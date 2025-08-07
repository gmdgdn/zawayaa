/**
 * Test suite for enhanced revalidation API with error handling and SCF features
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET } from '../../app/api/revalidate/route'

// Mock Next.js cache functions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn()
}))

// Mock cache manager
vi.mock('@/lib/cache-manager', () => ({
  CacheManager: {
    smartRevalidate: vi.fn(() => ({
      paths: ['/ar/articles'],
      tags: ['articles']
    })),
    cascadeRevalidate: vi.fn(() => ['homepage', 'search']),
    emergencyCacheClear: vi.fn(() => ({
      paths: ['/ar', '/ar/articles'],
      tags: ['homepage', 'articles'],
      errors: [],
      duration: 100
    }))
  }
}))

// Mock SCF revalidation
vi.mock('@/lib/scf-cache-revalidation', () => ({
  processSCFRevalidation: vi.fn(() => Promise.resolve({
    success: true,
    revalidated: {
      paths: ['/ar/articles/test'],
      tags: ['article:123']
    },
    errors: [],
    duration: 50
  })),
  batchProcessSCFRevalidations: vi.fn(() => Promise.resolve({
    success: true,
    results: [],
    totalDuration: 100
  })),
  generateRevalidationReport: vi.fn(() => ({
    summary: {
      total: 1,
      successful: 1,
      failed: 0,
      totalPaths: 1,
      totalTags: 1,
      totalDuration: 100
    },
    details: []
  }))
}))

// Mock revalidation logger
vi.mock('@/lib/revalidation-logger', () => ({
  RevalidationLogger: {
    log: vi.fn(),
    getLogs: vi.fn(() => []),
    getMetrics: vi.fn(() => ({
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0
    })),
    getHealthStatus: vi.fn(() => ({
      status: 'healthy',
      details: {
        recentErrors: 0,
        errorRate: 0,
        lastActivity: new Date().toISOString(),
        avgResponseTime: 100
      }
    })),
    clearLogs: vi.fn(),
    resetMetrics: vi.fn()
  },
  RevalidationEventType: {
    REQUEST_RECEIVED: 'request_received',
    VALIDATION_FAILED: 'validation_failed',
    REVALIDATION_STARTED: 'revalidation_started',
    REVALIDATION_COMPLETED: 'revalidation_completed',
    REVALIDATION_FAILED: 'revalidation_failed',
    EMERGENCY_CLEAR: 'emergency_clear',
    PATH_REVALIDATED: 'path_revalidated',
    TAG_REVALIDATED: 'tag_revalidated',
    CASCADE_TRIGGERED: 'cascade_triggered'
  },
  logRevalidationEvent: vi.fn(),
  logRevalidationError: vi.fn(),
  logRevalidationWarning: vi.fn()
}))

describe('Enhanced Revalidation API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset environment variable
    process.env.REVALIDATION_SECRET = 'test-secret'
  })

  it('should return 400 for invalid JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Bad Request')
    expect(data.message).toBe('Invalid JSON in request body')
    expect(data.requestId).toBeDefined()
    expect(data.timestamp).toBeDefined()
    expect(data.duration).toBeDefined()
  })

  it('should return 401 for missing secret', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ tag: '/test' }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
    expect(data.message).toBe('Missing authentication token')
    expect(data.requestId).toBeDefined()
    expect(data.timestamp).toBeDefined()
  })

  it('should return 401 for invalid secret', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'wrong-secret',
        tag: '/test' 
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
    expect(data.message).toBe('Invalid authentication token')
    expect(data.requestId).toBeDefined()
  })

  it('should return 400 for missing tag', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'test-secret'
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Bad Request')
    expect(data.message).toBe('Missing tag parameter for targeted revalidation')
  })

  it('should return 400 for invalid tag format', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'test-secret',
        tag: '<script>alert("xss")</script>'
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Bad Request')
    expect(data.message).toBe('Tag contains invalid characters')
  })

  it('should return 400 for empty tag', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'test-secret',
        tag: ''
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Bad Request')
    expect(data.message).toBe('Invalid tag format - must be a non-empty string with max 200 characters')
  })

  it('should return 400 for tag that is too long', async () => {
    const longTag = 'a'.repeat(201)
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'test-secret',
        tag: longTag
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Bad Request')
    expect(data.message).toBe('Invalid tag format - must be a non-empty string with max 200 characters')
  })

  it('should return 500 when REVALIDATION_SECRET is not set', async () => {
    delete process.env.REVALIDATION_SECRET

    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'test-secret',
        tag: '/test'
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal Server Error')
    expect(data.message).toBe('Server configuration error')
  })

  it('should handle rate limiting', async () => {
    const requests = []
    
    // Make 11 requests (exceeding the limit of 10)
    for (let i = 0; i < 11; i++) {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ 
          secret: 'test-secret',
          tag: '/test'
        }),
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '127.0.0.1'
        }
      })
      requests.push(POST(request))
    }

    const responses = await Promise.all(requests)
    const lastResponse = responses[responses.length - 1]
    const data = await lastResponse.json()

    expect(lastResponse.status).toBe(429)
    expect(data.error).toBe('Too Many Requests')
    expect(data.message).toBe('Rate limit exceeded. Please try again later.')
  })

  it('should return success for valid simple request', async () => {
    const { revalidateTag } = await import('next/cache')
    vi.mocked(revalidateTag).mockImplementation(() => {})

    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'test-secret',
        tag: 'programs'
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.revalidated.tags).toContain('programs')
    expect(data.requestId).toBeDefined()
    expect(data.timestamp).toBeDefined()
    expect(data.duration).toBeDefined()
    expect(data.mode).toBe('simple')
    expect(revalidateTag).toHaveBeenCalledWith('programs')
  })

  it('should handle SCF-aware revalidation', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'test-secret',
        content_type: 'post',
        content_id: 123,
        content_slug: 'test-article',
        changed_fields: ['title_arabic', 'is_featured']
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.mode).toBe('scf')
    expect(data.revalidated.paths).toBeDefined()
    expect(data.revalidated.tags).toBeDefined()
  })

  it('should handle emergency clear', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'test-secret',
        action: 'emergency_clear'
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.mode).toBe('emergency')
    expect(data.revalidated.paths).toEqual(['/ar', '/ar/articles'])
    expect(data.revalidated.tags).toEqual(['homepage', 'articles'])
  })

  it('should return health check data on GET request', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('operational')
    expect(data.timestamp).toBeDefined()
    expect(data.health).toBeDefined()
    expect(data.endpoints).toBeDefined()
  })

  it('should return metrics with valid secret', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate?secret=test-secret&action=metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.metrics).toBeDefined()
    expect(data.revalidationMetrics).toBeDefined()
    expect(data.rateLimitConfig).toBeDefined()
  })

  it('should handle cascade revalidation', async () => {
    const { revalidateTag } = await import('next/cache')
    vi.mocked(revalidateTag).mockImplementation(() => {})

    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'test-secret',
        tag: 'articles',
        cascade: true
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.revalidated.tags).toEqual(['articles', 'homepage', 'search'])
  })
})