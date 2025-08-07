/**
 * Cache Revalidation API Endpoint
 * Handles WordPress webhook requests to invalidate Next.js cache
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Revalidation secret for security
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET

// Interface for webhook payload
interface RevalidationPayload {
  secret: string
  tag?: string // path parameter for targeted revalidation
}

// Interface for error response
interface ErrorResponse {
  error: string
  message: string
  timestamp: string
  requestId: string
  duration?: number
}

// Interface for success response
interface SuccessResponse {
  success: true
  revalidated: string
  timestamp: string
  duration: number
  requestId: string
}

// Rate limiting storage (simple in-memory store for demo)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10 // Max 10 requests per minute per IP

// Monitoring metrics
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  rateLimitedRequests: 0,
  unauthorizedRequests: 0,
  badRequests: 0,
  serverErrors: 0
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const key = ip
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  record.count++
  return true
}

function logMetrics(requestId: string): void {
  console.log(`[${requestId}] Current metrics:`, {
    totalRequests: metrics.totalRequests,
    successfulRequests: metrics.successfulRequests,
    failedRequests: metrics.failedRequests,
    rateLimitedRequests: metrics.rateLimitedRequests,
    unauthorizedRequests: metrics.unauthorizedRequests,
    badRequests: metrics.badRequests,
    serverErrors: metrics.serverErrors,
    successRate: metrics.totalRequests > 0 ? (metrics.successfulRequests / metrics.totalRequests * 100).toFixed(2) + '%' : '0%'
  })
}

function createErrorResponse(
  error: string,
  message: string,
  requestId: string,
  duration?: number
): ErrorResponse {
  return {
    error,
    message,
    timestamp: new Date().toISOString(),
    requestId,
    ...(duration !== undefined && { duration })
  }
}

function createSuccessResponse(
  revalidated: string,
  requestId: string,
  duration: number
): SuccessResponse {
  return {
    success: true,
    revalidated,
    timestamp: new Date().toISOString(),
    duration,
    requestId
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Increment total requests counter
  metrics.totalRequests++
  
  // Log request received with additional context
  console.log(`[${requestId}] Revalidation request received`, {
    ip: clientIP,
    userAgent,
    timestamp: new Date().toISOString(),
    requestNumber: metrics.totalRequests
  })
  
  try {
    // Rate limiting protection
    if (!checkRateLimit(clientIP)) {
      metrics.rateLimitedRequests++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      console.warn(`[${requestId}] Rate limit exceeded for IP: ${clientIP}`, {
        duration,
        rateLimitedRequests: metrics.rateLimitedRequests
      })
      
      logMetrics(requestId)
      
      return NextResponse.json(
        createErrorResponse(
          'Too Many Requests',
          'Rate limit exceeded. Please try again later.',
          requestId,
          duration
        ),
        { status: 429 }
      )
    }

    // Parse the request body
    let body: RevalidationPayload
    try {
      body = await request.json()
      console.log(`[${requestId}] Request body parsed successfully`, {
        hasSecret: !!body.secret,
        hasTag: !!body.tag,
        tagValue: body.tag
      })
    } catch (parseError) {
      metrics.badRequests++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      console.error(`[${requestId}] Failed to parse request body:`, {
        error: parseError,
        duration,
        badRequests: metrics.badRequests
      })
      
      logMetrics(requestId)
      
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
    
    // Validate the secret token
    if (!body.secret) {
      metrics.unauthorizedRequests++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      console.warn(`[${requestId}] Missing secret token from IP: ${clientIP}`, {
        duration,
        unauthorizedRequests: metrics.unauthorizedRequests
      })
      
      logMetrics(requestId)
      
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          'Missing authentication token',
          requestId,
          duration
        ),
        { status: 401 }
      )
    }

    if (!REVALIDATION_SECRET) {
      metrics.serverErrors++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      console.error(`[${requestId}] REVALIDATION_SECRET environment variable is not set`, {
        duration,
        serverErrors: metrics.serverErrors
      })
      
      logMetrics(requestId)
      
      return NextResponse.json(
        createErrorResponse(
          'Internal Server Error',
          'Server configuration error',
          requestId,
          duration
        ),
        { status: 500 }
      )
    }

    if (body.secret !== REVALIDATION_SECRET) {
      metrics.unauthorizedRequests++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      console.warn(`[${requestId}] Invalid secret token from IP: ${clientIP}`, {
        duration,
        unauthorizedRequests: metrics.unauthorizedRequests,
        secretLength: body.secret.length
      })
      
      logMetrics(requestId)
      
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          'Invalid authentication token',
          requestId,
          duration
        ),
        { status: 401 }
      )
    }

    // Validate tag parameter
    if (!body.tag) {
      metrics.badRequests++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      console.warn(`[${requestId}] Missing tag parameter`, {
        duration,
        badRequests: metrics.badRequests
      })
      
      logMetrics(requestId)
      
      return NextResponse.json(
        createErrorResponse(
          'Bad Request',
          'Missing tag parameter for targeted revalidation',
          requestId,
          duration
        ),
        { status: 400 }
      )
    }

    // Validate tag format (basic security check)
    if (typeof body.tag !== 'string' || body.tag.length > 200 || body.tag.length === 0) {
      metrics.badRequests++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      console.warn(`[${requestId}] Invalid tag format`, {
        tag: body.tag,
        tagType: typeof body.tag,
        tagLength: typeof body.tag === 'string' ? body.tag.length : 'N/A',
        duration,
        badRequests: metrics.badRequests
      })
      
      logMetrics(requestId)
      
      return NextResponse.json(
        createErrorResponse(
          'Bad Request',
          'Invalid tag format - must be a non-empty string with max 200 characters',
          requestId,
          duration
        ),
        { status: 400 }
      )
    }

    // Additional security validation for tag content
    const invalidChars = /[<>\"'&]/
    if (invalidChars.test(body.tag)) {
      metrics.badRequests++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      console.warn(`[${requestId}] Tag contains invalid characters`, {
        tag: body.tag,
        duration,
        badRequests: metrics.badRequests
      })
      
      logMetrics(requestId)
      
      return NextResponse.json(
        createErrorResponse(
          'Bad Request',
          'Tag contains invalid characters',
          requestId,
          duration
        ),
        { status: 400 }
      )
    }
    
    console.log(`[${requestId}] Starting revalidation for path: ${body.tag}`)
    
    // Call revalidatePath for targeted cache clearing
    try {
      revalidatePath(body.tag)
      
      metrics.successfulRequests++
      const duration = Date.now() - startTime
      
      console.log(`[${requestId}] Successfully revalidated path: ${body.tag}`, {
        duration,
        successfulRequests: metrics.successfulRequests
      })
      
      logMetrics(requestId)
      
      // Return JSON response with revalidated status and timestamp
      return NextResponse.json(
        createSuccessResponse(body.tag, requestId, duration)
      )
      
    } catch (revalidateError) {
      metrics.serverErrors++
      metrics.failedRequests++
      
      const duration = Date.now() - startTime
      console.error(`[${requestId}] Failed to revalidate path ${body.tag}:`, {
        error: revalidateError,
        duration,
        serverErrors: metrics.serverErrors
      })
      
      logMetrics(requestId)
      
      return NextResponse.json(
        createErrorResponse(
          'Internal Server Error',
          'Failed to revalidate cache',
          requestId,
          duration
        ),
        { status: 500 }
      )
    }
    
  } catch (error) {
    metrics.serverErrors++
    metrics.failedRequests++
    
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error(`[${requestId}] Unexpected revalidation API error after ${duration}ms:`, {
      error: errorMessage,
      stack: errorStack,
      duration,
      serverErrors: metrics.serverErrors
    })
    
    logMetrics(requestId)
    
    // Return structured error response
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

// Optional: Add a GET endpoint for health check and metrics
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    metrics: {
      ...metrics,
      successRate: metrics.totalRequests > 0 ? 
        (metrics.successfulRequests / metrics.totalRequests * 100).toFixed(2) + '%' : '0%'
    },
    rateLimitConfig: {
      windowMs: RATE_LIMIT_WINDOW,
      maxRequests: RATE_LIMIT_MAX_REQUESTS
    }
  })
}

