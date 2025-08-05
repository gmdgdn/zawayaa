/**
 * Cache Revalidation API Endpoint
 * Handles WordPress webhook requests to invalidate Next.js cache
 * Supports both path-based and tag-based revalidation
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CacheManager, smartRevalidate, cascadeRevalidate, emergencyCacheClear } from '@/lib/cache-manager'
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

// Interface for webhook payload (extended for SCF support)
interface RevalidationPayload {
  secret: string
  paths?: string[]
  tags?: string[]
  content_type?: 'post' | 'program' | 'episode' | 'user' | 'category'
  content_id?: number
  content_slug?: string
  action?: 'publish' | 'update' | 'delete' | 'featured_toggle' | 'emergency_clear'
  cascade?: boolean // Whether to trigger cascade revalidation
  // SCF-specific fields
  changed_fields?: string[]
  field_changes?: Record<string, {
    old_value: any
    new_value: any
    change_type: string
  }>
  priority?: 'high' | 'normal' | 'low'
  batch_payloads?: SCFRevalidationPayload[] // For batch processing
}

// Content type to path mapping
const getPathsForContentType = (contentType: string, contentId: number, action: string): string[] => {
  const paths: string[] = []
  
  switch (contentType) {
    case 'post':
      paths.push('/ar') // Homepage
      paths.push('/ar/articles') // Articles list
      if (contentId) {
        // We'd need to fetch the slug, but for now use a pattern
        paths.push(`/ar/articles/*`) // Individual article (wildcard)
      }
      break
      
    case 'program':
      paths.push('/ar') // Homepage (if featured)
      paths.push('/ar/programs') // Programs list
      if (contentId) {
        paths.push(`/ar/programs/*`) // Individual program
      }
      break
      
    case 'episode':
      paths.push('/ar/programs') // Programs list (episode counts)
      if (contentId) {
        paths.push(`/ar/episodes/*`) // Individual episode
        paths.push(`/ar/programs/*`) // Parent program page
      }
      break
      
    case 'user':
      paths.push('/ar') // Homepage (if featured author)
      paths.push('/ar/authors') // Authors list
      if (contentId) {
        paths.push(`/ar/authors/*`) // Individual author
      }
      break
  }
  
  // For featured content toggles, always revalidate homepage
  if (action === 'featured_toggle') {
    paths.push('/ar')
  }
  
  return paths
}

// Content type to cache tags mapping
const getTagsForContentType = (contentType: string, contentId: number): string[] => {
  const tags: string[] = []
  
  switch (contentType) {
    case 'post':
      tags.push('articles')
      if (contentId) {
        tags.push(`article:${contentId}`)
      }
      break
      
    case 'program':
      tags.push('programs')
      if (contentId) {
        tags.push(`program:${contentId}`)
      }
      break
      
    case 'episode':
      tags.push('episodes')
      if (contentId) {
        tags.push(`episode:${contentId}`)
        // Also invalidate parent program
        tags.push('programs')
      }
      break
      
    case 'user':
      tags.push('authors')
      if (contentId) {
        tags.push(`author:${contentId}`)
      }
      break
  }
  
  return tags
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Log request received
    logRevalidationEvent(
      RevalidationEventType.REQUEST_RECEIVED,
      'Revalidation request received',
      { userAgent: request.headers.get('user-agent') }
    )

    // Parse the request body
    const body: RevalidationPayload = await request.json()
    
    // Validate the secret token
    if (body.secret !== REVALIDATION_SECRET) {
      logRevalidationError(
        RevalidationEventType.VALIDATION_FAILED,
        'Invalid revalidation secret provided',
        new Error('Authentication failed'),
        { hasSecret: !!body.secret }
      )
      
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
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
        has_batch_payloads: !!body.batch_payloads
      }
    )
    
    // Collect paths and tags to revalidate
    let pathsToRevalidate: string[] = body.paths || []
    let tagsToRevalidate: string[] = body.tags || []
    
    // Handle special actions first
    if (body.action === 'emergency_clear') {
      logRevalidationEvent(
        RevalidationEventType.EMERGENCY_CLEAR,
        'Emergency cache clear triggered'
      )
      
      const emergencyResult = emergencyCacheClear()
      const duration = Date.now() - startTime
      
      logRevalidationEvent(
        RevalidationEventType.REVALIDATION_COMPLETED,
        'Emergency cache clear completed',
        emergencyResult,
        duration
      )
      
      return NextResponse.json({
        success: true,
        action: 'emergency_clear',
        revalidated: {
          paths: emergencyResult.paths,
          tags: emergencyResult.tags,
          errors: []
        },
        timestamp: new Date().toISOString(),
        duration
      })
    }

    // Handle batch SCF revalidation
    if (body.batch_payloads && body.batch_payloads.length > 0) {
      logRevalidationEvent(
        RevalidationEventType.REVALIDATION_STARTED,
        'Processing batch SCF revalidation',
        { batch_size: body.batch_payloads.length }
      )

      const batchResult = await batchProcessSCFRevalidations(body.batch_payloads)
      const report = generateRevalidationReport(batchResult.results)

      logRevalidationEvent(
        RevalidationEventType.REVALIDATION_COMPLETED,
        'Batch SCF revalidation completed',
        report.summary,
        batchResult.totalDuration
      )

      return NextResponse.json({
        success: batchResult.success,
        action: 'batch_scf_revalidation',
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
        duration: batchResult.totalDuration
      })
    }

    // Handle single SCF revalidation
    if (body.content_type && body.content_id && (body.changed_fields || body.field_changes)) {
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

      logRevalidationEvent(
        scfResult.success ? RevalidationEventType.REVALIDATION_COMPLETED : RevalidationEventType.REVALIDATION_FAILED,
        'SCF revalidation completed',
        {
          success: scfResult.success,
          paths_count: scfResult.revalidated.paths.length,
          tags_count: scfResult.revalidated.tags.length,
          errors_count: scfResult.errors.length
        },
        scfResult.duration
      )

      return NextResponse.json({
        success: scfResult.success,
        action: 'scf_revalidation',
        revalidated: scfResult.revalidated,
        errors: scfResult.errors,
        timestamp: new Date().toISOString(),
        duration: scfResult.duration
      })
    }

    // If content type and ID are provided, use smart revalidation
    if (body.content_type && (body.content_id || body.content_slug)) {
      const smartResult = smartRevalidate(
        body.content_type,
        body.action || 'update',
        body.content_slug,
        body.content_id?.toString()
      )
      
      pathsToRevalidate = [...pathsToRevalidate, ...smartResult.paths]
      tagsToRevalidate = [...tagsToRevalidate, ...smartResult.tags]
    } else if (body.content_type && body.content_id) {
      // Fallback to manual path/tag generation
      const autoPaths = getPathsForContentType(
        body.content_type, 
        body.content_id, 
        body.action || 'update'
      )
      const autoTags = getTagsForContentType(body.content_type, body.content_id)
      
      pathsToRevalidate = [...pathsToRevalidate, ...autoPaths]
      tagsToRevalidate = [...tagsToRevalidate, ...autoTags]
    }
    
    // Remove duplicates
    pathsToRevalidate = [...new Set(pathsToRevalidate)]
    tagsToRevalidate = [...new Set(tagsToRevalidate)]
    
    // Perform revalidation
    const results = {
      paths: [] as string[],
      tags: [] as string[],
      errors: [] as string[]
    }
    
    // Revalidate paths
    for (const path of pathsToRevalidate) {
      try {
        // Handle wildcard paths by revalidating common patterns
        if (path.includes('*')) {
          // For wildcards, we'll revalidate the parent directory
          const basePath = path.replace('/*', '')
          revalidatePath(basePath)
          results.paths.push(basePath)
          
          logRevalidationEvent(
            RevalidationEventType.PATH_REVALIDATED,
            `Path revalidated (wildcard): ${basePath}`,
            { originalPath: path, resolvedPath: basePath }
          )
        } else {
          revalidatePath(path)
          results.paths.push(path)
          
          logRevalidationEvent(
            RevalidationEventType.PATH_REVALIDATED,
            `Path revalidated: ${path}`
          )
        }
      } catch (error) {
        const errorMsg = `Failed to revalidate path ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`
        
        logRevalidationError(
          RevalidationEventType.REVALIDATION_FAILED,
          errorMsg,
          error instanceof Error ? error : new Error(errorMsg),
          { path, type: 'path_revalidation' }
        )
        
        results.errors.push(errorMsg)
      }
    }
    
    // Revalidate tags with optional cascade
    for (const tag of tagsToRevalidate) {
      try {
        if (body.cascade) {
          // Use cascade revalidation for related tags
          const cascadedTags = cascadeRevalidate(tag)
          results.tags.push(tag, ...cascadedTags)
          
          logRevalidationEvent(
            RevalidationEventType.CASCADE_TRIGGERED,
            `Cascade revalidation triggered for tag: ${tag}`,
            { primaryTag: tag, cascadedTags }
          )
        } else {
          revalidateTag(tag)
          results.tags.push(tag)
          
          logRevalidationEvent(
            RevalidationEventType.TAG_REVALIDATED,
            `Tag revalidated: ${tag}`
          )
        }
      } catch (error) {
        const errorMsg = `Failed to revalidate tag ${tag}: ${error instanceof Error ? error.message : 'Unknown error'}`
        
        logRevalidationError(
          RevalidationEventType.REVALIDATION_FAILED,
          errorMsg,
          error instanceof Error ? error : new Error(errorMsg),
          { tag, type: 'tag_revalidation' }
        )
        
        results.errors.push(errorMsg)
      }
    }
    
    // Log successful revalidation
    console.log('Cache revalidation completed:', {
      paths: results.paths,
      tags: results.tags,
      content_type: body.content_type,
      content_id: body.content_id,
      content_slug: body.content_slug,
      action: body.action,
      cascade: body.cascade,
      errors: results.errors
    })
    
    // Return success response
    return NextResponse.json({
      success: true,
      revalidated: results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Revalidation API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle GET requests for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  
  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    )
  }
  
  return NextResponse.json({
    message: 'Revalidation API is working',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: 'Send revalidation requests',
      GET: 'Test endpoint status'
    }
  })
}