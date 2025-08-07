/**
 * Test suite for revalidation API error handling and logging
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET } from '../../app/api/revalidate/route'

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('Revalidation API Error Handling', () => {
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

  it('should return success for valid request', async () => {
    const { revalidatePath } = await import('next/cache')
    vi.mocked(revalidatePath).mockImplementation(() => {})

    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ 
        secret: 'test-secret',
        tag: '/programs'
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.revalidated).toBe('/programs')
    expect(data.requestId).toBeDefined()
    expect(data.timestamp).toBeDefined()
    expect(data.duration).toBeDefined()
    expect(revalidatePath).toHaveBeenCalledWith('/programs')
  })

  it('should return health check data on GET request', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('healthy')
    expect(data.timestamp).toBeDefined()
    expect(data.metrics).toBeDefined()
    expect(data.rateLimitConfig).toBeDefined()
    expect(data.metrics.successRate).toBeDefined()
  })
})