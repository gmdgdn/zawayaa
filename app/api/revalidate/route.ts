/**
 * Enhanced Cache Revalidation API Endpoint
 * Combines comprehensive error handling with SCF-aware intelligent revalidation
 * Handles WordPress webhook requests to invalidate Next.js cache
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CacheManager } from '@/lib/cache-manager'
import { 
  RevalidationLogger,
  RevalidationEventType, 
  logRevalidationEvent, 
  logRevalidationError,
  logRevalidationWarning 
} from '@/lib/revalidation-logger'
import { 
  processSCFRevalidation, 
  SCFRevalidationPayload,
  batchProcessSCFRevalidations,
  generateRevalidationReport
} from '@/lib/scf-cache-revalidation'

// Revalidation secret for security
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'zawaya-revalidate-secret-2024'

// Enhanced interface for webhook payload (supports both simple and SCF modes)
interface RevalidationPayload {
  secret: string
  // Simple mode (backward compatibility)
  tag?: string
  path?: string
  // SCF mode (advanced features)
  paths?: string[]
  tags?: string[]
  content_type?: 'post' | 'program' | 'episode' | 'user' | 'category'
  content_id?: number
  content_slug?: string
  action?: 'publish' | 'update' | 'delete' | 'featured_toggle' | 'emergency_clear'
  cascade?: boolean
  // SCF-specific fields
  changed_fields?: string[]
  field_changes?: Record<string, {
    old_value: any
    new_value: any
    change_type: string
  }>
  priority?: 'high' | 'normal' | 'low'
  batch_payloads?: SCFRevalidationPayload[]
}

// Enhanced response interfaces
interface ErrorResponse {
  error: string
  message: string
  timestamp: string
  requestId: string
  duration?: number
  details?: Record<string, any>
}

interface SuccessResponse {
  success: true
  revalidated: {
    paths: string[]
    tags: string[]
  }
  timestamp: string
  duration: number
  requestId: string
  mode: 'simple' | 'scf' | 'batch' | 'emergency'
  metrics?: {
    pathsCount: number
    tagsCount: number
    errorsCount: number
  }
}

// Rate limiting storage with enhanced tracking
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20 // Increased for SCF batch operations

// Enhanced monitoring metrics
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  rateLimitedRequests: 0,
  unauthorizedRequests: 0,
  badRequests: 0,
  serverErrors: 0,
  scfRequests: 0,
  batchRequests: 0,
  emergencyClears: 0,
  averageResponseTime: 0,
  pathsRevalidated: 0,
  tagsRevalidated: 0
}

// Enhanced utility functions
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const key = ip
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  record.count++
  return true
}

function updateMetrics(requestId: string, duration?: number): void {
  if (duration) {
    const total = metrics.averageResponseTime * (metrics.successfulRequests - 1)
    metrics.averageResponseTime = (total + duration) / metrics.successfulRequests
  }
  
  // Log enhanced metrics
  logRevalidationEvent(
    RevalidationEventType.REQUEST_RECEIVED,
    'Metrics updated',
    {
      totalRequests: metrics.totalRequests,
      successfulRequests: metrics.successfulRequests,
      failedRequests: metrics.failedRequests,
      successRate: metrics.totalRequests > 0 ? 
        (metrics.successfulRequests / metrics.totalRequests * 100).toFixed(2) + '%' : '0%',
      averageResponseTime: metrics.averageResponseTime,
      scfRequests: metrics.scfRequests,
      batchRequests: metrics.batchRequests
    }
  )
}

function createErrorResponse(
  error: string,
  message: string,
  requestId: string,
  duration?: number,
  details?: Record<string, any>
): ErrorResponse {
  return {
    error,
    message,
    timestamp: new Date().toISOString(),
    requestId,
    ...(duration !== undefined && { duration }),
    ...(details && { details })
  }
}

function createSuccessResponse(
  revalidated: { paths: string[]; tags: string[] },
  requestId: string,
  duration: number,
  mode: 'simple' | 'scf' | 'batch' | 'emergency'
): SuccessResponse {
  return {
    success: true,
    revalidated,
    timestamp: new Date().toISOString(),
    duration,
    requestId,
    mode,
    metrics: {
      pathsCount: revalidated.paths.length,
      tagsCount: revalidated.tags.length,
      errorsCount: 0
    }
  }
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

function validatePayload(body: RevalidationPayload): { valid: boolean; error?: string } {
  // Secret validation
  if (!body.secret) {
    return { valid: false, error: 'Missing authentication token' }
  }
  
  if (body.secret !== REVALIDATION_SECRET) {
    return { valid: false, error: 'Invalid authentication token' }
  }
  
  // Mode validation
  const hasSimpleMode = body.tag || body.path
  const hasSCFMode = body.content_type || body.paths || body.tags
  const hasBatchMode = body.batch_payloads && body.batch_payloads.length > 0
  
  if (!hasSimpleMode && !hasSCFMode && !hasBatchMode && body.action !== 'emergency_clear') {
    return { valid: false, error: 'Missing revalidation parameters' }
  }
  
  // SCF mode validation
  if (body.content_type && !['post', 'program', 'episode', 'user', 'category'].includes(body.content_type)) {
    return { valid: false, error: 'Invalid content type' }
  }
  
  // Tag/path format validation
  if (body.tag && (typeof body.tag !== 'string' || body.tag.length === 0 || body.tag.length > 200)) {
    return { valid: false, error: 'Invalid tag format' }
  }
  
  if (body.path && (typeof body.path !== 'string' || body.path.length === 0 || body.path.length > 200)) {
    return { valid: false, error: 'Invalid path format' }
  }
  
  // Security validation for malicious characters
  const invalidChars = /[<>\"'&]/
  if (body.tag && invalidChars.test(body.tag)) {
    return { valid: false, error: 'Tag contains invalid characters' }
  }
  
  if (body.path && invalidChars.test(body.path)) {
    return { valid: false, error: 'Path contains invalid characters' }
  }
  
  return { valid: true }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = generateRequestId()
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Increment total requests counter
  metrics.totalRequests++
  
  // Log request received with enhanced context
  logRevalidationEvent(
    RevalidationEventType.REQUEST_RECEIVED,
    'Revalidation request received',
    {
      ip: clientIP,
      userAgent,
      requestId,
      requestNumber: metrics.totalRequests
    }
  )
  
  try {
    // Rate limiting protection with enhanced logging
    if (!checkRateLimit(clientIP)) {
      metrics.rateLimitedRequests++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      
      logRevalidationError(
        RevalidationEventType.VALIDATION_FAILED,
        'Rate limit exceeded',
        new Error('Too many requests'),
        {
          ip: clientIP,
          duration,
          rateLimitedRequests: metrics.rateLimitedRequests
        }
      )
      
      return NextResponse.json(
        createErrorResponse(
          'Too Many Requests',
          'Rate limit exceeded. Please try again later.',
          requestId,
          duration,
          { rateLimitWindow: RATE_LIMIT_WINDOW, maxRequests: RATE_LIMIT_MAX_REQUESTS }
        ),
        { status: 429 }
      )
    }

    // Parse and validate the request body
    let body: RevalidationPayload
    try {
      body = await request.json()
      
      logRevalidationEvent(
        RevalidationEventType.REQUEST_RECEIVED,
        'Request body parsed successfully',
        {
          hasSecret: !!body.secret,
          hasTag: !!body.tag,
          hasPath: !!body.path,
          hasSCFMode: !!(body.content_type || body.paths || body.tags),
          hasBatchMode: !!(body.batch_payloads && body.batch_payloads.length > 0),
          action: body.action
        }
      )
    } catch (parseError) {
      metrics.badRequests++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      
      logRevalidationError(
        RevalidationEventType.VALIDATION_FAILED,
        'Failed to parse request body',
        parseError instanceof Error ? parseError : new Error('JSON parse error'),
        { duration, badRequests: metrics.badRequests }
      )
      
      return NextResponse.json(
        createErrorResponse(
          'Bad Request',
          'Invalid JSON in request body',
          requestId,
          duration
        ),
        { status: 400 }
      )
    }

    // Enhanced payload validation
    const validation = validatePayload(body)
    if (!validation.valid) {
      metrics.badRequests++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      
      logRevalidationError(
        RevalidationEventType.VALIDATION_FAILED,
        'Payload validation failed',
        new Error(validation.error!),
        { duration, badRequests: metrics.badRequests }
      )
      
      return NextResponse.json(
        createErrorResponse(
          validation.error!.includes('authentication') ? 'Unauthorized' : 'Bad Request',
          validation.error!,
          requestId,
          duration
        ),
        { status: validation.error!.includes('authentication') ? 401 : 400 }
      )
    }
    
    // Log revalidation started
    logRevalidationEvent(
      RevalidationEventType.REVALIDATION_STARTED,
      'Cache revalidation started',
      {
        content_type: body.content_type,
        content_id: body.content_id,
        action: body.action,
        cascade: body.cascade,
        changed_fields: body.changed_fields,
        priority: body.priority,
        has_batch_payloads: !!(body.batch_payloads && body.batch_payloads.length > 0)
      }
    )

    // Handle emergency clear action
    if (body.action === 'emergency_clear') {
      metrics.emergencyClears++
      
      logRevalidationEvent(
        RevalidationEventType.EMERGENCY_CLEAR,
        'Emergency cache clear triggered'
      )
      
      const emergencyResult = CacheManager.emergencyCacheClear()
      const duration = Date.now() - startTime
      
      metrics.successfulRequests++
      metrics.pathsRevalidated += emergencyResult.paths.length
      metrics.tagsRevalidated += emergencyResult.tags.length
      
      logRevalidationEvent(
        RevalidationEventType.REVALIDATION_COMPLETED,
        'Emergency cache clear completed',
        {
          pathsCleared: emergencyResult.paths.length,
          tagsCleared: emergencyResult.tags.length,
          errors: emergencyResult.errors
        },
        duration
      )
      
      updateMetrics(requestId, duration)
      
      return NextResponse.json(
        createSuccessResponse(
          {
            paths: emergencyResult.paths,
            tags: emergencyResult.tags
          },
          requestId,
          duration,
          'emergency'
        )
      )
    }
    
    // Handle batch SCF revalidation
    if (body.batch_payloads && body.batch_payloads.length > 0) {
      metrics.batchRequests++
      
      logRevalidationEvent(
        RevalidationEventType.REVALIDATION_STARTED,
        'Processing batch SCF revalidation',
        { batch_size: body.batch_payloads.length }
      )
      
      const batchResult = await batchProcessSCFRevalidations(body.batch_payloads)
      const report = generateRevalidationReport(batchResult.results)
      const duration = Date.now() - startTime
      
      if (batchResult.success) {
        metrics.successfulRequests++
      } else {
        metrics.failedRequests++
      }
      
      metrics.pathsRevalidated += report.summary.totalPaths
      metrics.tagsRevalidated += report.summary.totalTags
      
      logRevalidationEvent(
        batchResult.success ? RevalidationEventType.REVALIDATION_COMPLETED : RevalidationEventType.REVALIDATION_FAILED,
        'Batch SCF revalidation completed',
        report.summary,
        duration
      )
      
      updateMetrics(requestId, duration)
      
      return NextResponse.json({
        success: batchResult.success,
        mode: 'batch',
        batch_results: batchResult.results.map(r => ({
          content_type: r.payload.content_type,
          content_id: r.payload.content_id,
          success: r.result.success,
          paths: r.result.revalidated.paths,
          tags: r.result.revalidated.tags,
          errors: r.result.errors
        })),
        report,
        timestamp: new Date().toISOString(),
        duration,
        requestId
      })
    }

    // Handle single SCF revalidation
    if (body.content_type && body.content_id && (body.changed_fields || body.field_changes)) {
      metrics.scfRequests++
      
      const scfPayload: SCFRevalidationPayload = {
        secret: body.secret,
        content_type: body.content_type,
        content_id: body.content_id,
        content_slug: body.content_slug,
        action: body.action || 'update',
        changed_fields: body.changed_fields,
        field_changes: body.field_changes,
        cascade: body.cascade,
        priority: body.priority
      }
      
      logRevalidationEvent(
        RevalidationEventType.REVALIDATION_STARTED,
        'Processing SCF-aware revalidation',
        {
          content_type: body.content_type,
          content_id: body.content_id,
          changed_fields: body.changed_fields,
          priority: body.priority
        }
      )
      
      const scfResult = await processSCFRevalidation(scfPayload)
      const duration = Date.now() - startTime
      
      if (scfResult.success) {
        metrics.successfulRequests++
      } else {
        metrics.failedRequests++
      }
      
      metrics.pathsRevalidated += scfResult.revalidated.paths.length
      metrics.tagsRevalidated += scfResult.revalidated.tags.length
      
      logRevalidationEvent(
        scfResult.success ? RevalidationEventType.REVALIDATION_COMPLETED : RevalidationEventType.REVALIDATION_FAILED,
        'SCF revalidation completed',
        {
          success: scfResult.success,
          paths_count: scfResult.revalidated.paths.length,
          tags_count: scfResult.revalidated.tags.length,
          errors_count: scfResult.errors.length
        },
        duration
      )
      
      updateMetrics(requestId, duration)
      
      return NextResponse.json(
        createSuccessResponse(
          scfResult.revalidated,
          requestId,
          duration,
          'scf'
        )
      )
    }

    // Handle smart revalidation based on content type
    if (body.content_type && (body.content_id || body.content_slug)) {
      const smartResult = CacheManager.smartRevalidate(
        body.content_type,
        body.action || 'update',
        body.content_slug,
        body.content_id?.toString()
      )
      
      const revalidationResult = { paths: [] as string[], tags: [] as string[] }
      const errors: string[] = []
      
      // Revalidate paths
      for (const path of smartResult.paths) {
        try {
          revalidatePath(path)
          revalidationResult.paths.push(path)
          
          logRevalidationEvent(
            RevalidationEventType.PATH_REVALIDATED,
            `Smart path revalidated: ${path}`
          )
        } catch (error) {
          const errorMsg = `Failed to revalidate path ${path}: ${error}`
          errors.push(errorMsg)
          
          logRevalidationError(
            RevalidationEventType.REVALIDATION_FAILED,
            errorMsg,
            error instanceof Error ? error : new Error(errorMsg),
            { path, type: 'smart_path_revalidation' }
          )
        }
      }
      
      // Revalidate tags with optional cascade
      for (const tag of smartResult.tags) {
        try {
          if (body.cascade) {
            const cascadedTags = CacheManager.cascadeRevalidate(tag)
            revalidationResult.tags.push(tag, ...cascadedTags)
            
            logRevalidationEvent(
              RevalidationEventType.CASCADE_TRIGGERED,
              `Smart cascade revalidation triggered for tag: ${tag}`,
              { primaryTag: tag, cascadedTags }
            )
          } else {
            revalidateTag(tag)
            revalidationResult.tags.push(tag)
            
            logRevalidationEvent(
              RevalidationEventType.TAG_REVALIDATED,
              `Smart tag revalidated: ${tag}`
            )
          }
        } catch (error) {
          const errorMsg = `Failed to revalidate tag ${tag}: ${error}`
          errors.push(errorMsg)
          
          logRevalidationError(
            RevalidationEventType.REVALIDATION_FAILED,
            errorMsg,
            error instanceof Error ? error : new Error(errorMsg),
            { tag, type: 'smart_tag_revalidation' }
          )
        }
      }
      
      const duration = Date.now() - startTime
      
      if (errors.length === 0) {
        metrics.successfulRequests++
      } else {
        metrics.failedRequests++
      }
      
      metrics.pathsRevalidated += revalidationResult.paths.length
      metrics.tagsRevalidated += revalidationResult.tags.length
      
      updateMetrics(requestId, duration)
      
      return NextResponse.json(
        createSuccessResponse(
          revalidationResult,
          requestId,
          duration,
          'scf'
        )
      )
    }

    // Handle simple mode (backward compatibility)
    const pathsToRevalidate: string[] = []
    const tagsToRevalidate: string[] = []
    
    if (body.tag) {
      tagsToRevalidate.push(body.tag)
    }
    
    if (body.path) {
      pathsToRevalidate.push(body.path)
    }
    
    if (body.paths) {
      pathsToRevalidate.push(...body.paths)
    }
    
    if (body.tags) {
      tagsToRevalidate.push(...body.tags)
    }
    
    // Remove duplicates
    const uniquePaths = [...new Set(pathsToRevalidate)]
    const uniqueTags = [...new Set(tagsToRevalidate)]
    
    const results = { paths: [] as string[], tags: [] as string[] }
    const errors: string[] = []
    
    // Revalidate paths
    for (const path of uniquePaths) {
      try {
        revalidatePath(path)
        results.paths.push(path)
        
        logRevalidationEvent(
          RevalidationEventType.PATH_REVALIDATED,
          `Simple path revalidated: ${path}`
        )
      } catch (error) {
        const errorMsg = `Failed to revalidate path ${path}: ${error}`
        errors.push(errorMsg)
        
        logRevalidationError(
          RevalidationEventType.REVALIDATION_FAILED,
          errorMsg,
          error instanceof Error ? error : new Error(errorMsg),
          { path, type: 'simple_path_revalidation' }
        )
      }
    }
    
    // Revalidate tags
    for (const tag of uniqueTags) {
      try {
        if (body.cascade) {
          const cascadedTags = CacheManager.cascadeRevalidate(tag)
          results.tags.push(tag, ...cascadedTags)
          
          logRevalidationEvent(
            RevalidationEventType.CASCADE_TRIGGERED,
            `Simple cascade revalidation triggered for tag: ${tag}`,
            { primaryTag: tag, cascadedTags }
          )
        } else {
          revalidateTag(tag)
          results.tags.push(tag)
          
          logRevalidationEvent(
            RevalidationEventType.TAG_REVALIDATED,
            `Simple tag revalidated: ${tag}`
          )
        }
      } catch (error) {
        const errorMsg = `Failed to revalidate tag ${tag}: ${error}`
        errors.push(errorMsg)
        
        logRevalidationError(
          RevalidationEventType.REVALIDATION_FAILED,
          errorMsg,
          error instanceof Error ? error : new Error(errorMsg),
          { tag, type: 'simple_tag_revalidation' }
        )
      }
    }
    
    const duration = Date.now() - startTime
    
    if (errors.length === 0) {
      metrics.successfulRequests++
    } else {
      metrics.failedRequests++
    }
    
    metrics.pathsRevalidated += results.paths.length
    metrics.tagsRevalidated += results.tags.length
    
    logRevalidationEvent(
      errors.length === 0 ? RevalidationEventType.REVALIDATION_COMPLETED : RevalidationEventType.REVALIDATION_FAILED,
      'Simple revalidation completed',
      {
        paths: results.paths,
        tags: results.tags,
        errors
      },
      duration
    )
    
    updateMetrics(requestId, duration)
    
    return NextResponse.json(
      createSuccessResponse(
        results,
        requestId,
        duration,
        'simple'
      )
    )
    
  } catch (error) {
    metrics.serverErrors++
    metrics.failedRequests++
    
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    logRevalidationError(
      RevalidationEventType.REVALIDATION_FAILED,
      'Unexpected revalidation API error',
      error instanceof Error ? error : new Error(errorMessage),
      {
        duration,
        serverErrors: metrics.serverErrors,
        requestId
      }
    )
    
    updateMetrics(requestId, duration)
    
    return NextResponse.json(
      createErrorResponse(
        'Internal Server Error',
        errorMessage,
        requestId,
        duration
      ),
      { status: 500 }
    )
  }
}

// Enhanced GET endpoint for health check, metrics, and testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const action = searchParams.get('action')
  
  // Health check endpoint (no auth required)
  if (!secret && !action) {
    const healthStatus = RevalidationLogger.getHealthStatus()
    const cacheHealth = CacheManager.getCacheHealth()
    
    return NextResponse.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      health: {
        api: healthStatus.status,
        cache: cacheHealth.status,
        details: {
          ...healthStatus.details,
          ...cacheHealth.metrics
        }
      },
      endpoints: {
        POST: 'Send revalidation requests',
        'GET?secret=xxx': 'Access metrics and admin functions',
        'GET?secret=xxx&action=logs': 'View recent logs',
        'GET?secret=xxx&action=clear-logs': 'Clear logs',
        'GET?secret=xxx&action=reset-metrics': 'Reset metrics'
      }
    })
  }
  
  // Protected endpoints require secret
  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    )
  }
  
  // Handle admin actions
  switch (action) {
    case 'metrics':
      return NextResponse.json({
        metrics: {
          ...metrics,
          successRate: metrics.totalRequests > 0 ? 
            (metrics.successfulRequests / metrics.totalRequests * 100).toFixed(2) + '%' : '0%'
        },
        revalidationMetrics: RevalidationLogger.getMetrics(),
        rateLimitConfig: {
          windowMs: RATE_LIMIT_WINDOW,
          maxRequests: RATE_LIMIT_MAX_REQUESTS
        },
        timestamp: new Date().toISOString()
      })
      
    case 'logs':
      const limit = parseInt(searchParams.get('limit') || '50')
      const level = searchParams.get('level') as any
      
      return NextResponse.json({
        logs: RevalidationLogger.getLogs(limit, level),
        errorSummary: RevalidationLogger.getErrorSummary(),
        timestamp: new Date().toISOString()
      })
      
    case 'clear-logs':
      RevalidationLogger.clearLogs()
      return NextResponse.json({
        message: 'Logs cleared successfully',
        timestamp: new Date().toISOString()
      })
      
    case 'reset-metrics':
      RevalidationLogger.resetMetrics()
      // Reset local metrics too
      Object.keys(metrics).forEach(key => {
        if (typeof metrics[key as keyof typeof metrics] === 'number') {
          (metrics as any)[key] = 0
        }
      })
      
      return NextResponse.json({
        message: 'Metrics reset successfully',
        timestamp: new Date().toISOString()
      })
      
    case 'warm-cache':
      const warmResult = await CacheManager.warmCriticalCache()
      return NextResponse.json({
        message: 'Cache warming completed',
        result: warmResult,
        timestamp: new Date().toISOString()
      })
      
    default:
      return NextResponse.json({
        message: 'Enhanced Revalidation API is operational',
        version: '2.0.0',
        features: [
          'Simple path/tag revalidation (backward compatible)',
          'SCF-aware intelligent revalidation',
          'Batch processing with priority handling',
          'Cascade revalidation for related content',
          'Emergency cache clearing',
          'Comprehensive error handling and logging',
          'Rate limiting protection',
          'Performance metrics and monitoring',
          'Health checks and diagnostics'
        ],
        timestamp: new Date().toISOString()
      })
  }
}

