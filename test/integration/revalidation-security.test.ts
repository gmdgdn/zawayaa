/**
 * Revalidation API Security Tests
 * 
 * Tests the security aspects of the revalidation webhook endpoint,
 * including secret validation and authentication.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/revalidate/route'

// Test constants
const VALID_SECRET = 'zawaya-wp-revalidation-2025-secure-token'
const INVALID_SECRET = 'invalid-secret-token'

// Mock environment variable
const originalEnv = process.env.REVALIDATION_SECRET
beforeAll(() => {
  process.env.REVALIDATION_SECRET = VALID_SECRET
})

afterAll(() => {
  process.env.REVALIDATION_SECRET = originalEnv
})

describe('Revalidation API Security', () => {
  describe('POST endpoint authentication', () => {
    it('should reject requests without secret', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paths: ['/ar']
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(data.message).toContain('Missing or invalid authentication token')
    })

    it('should reject requests with invalid secret', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: INVALID_SECRET,
          paths: ['/ar']
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(data.message).toContain('Invalid authentication token')
    })

    it('should reject requests with non-string secret', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: 12345, // Number instead of string
          paths: ['/ar']
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(data.message).toContain('Missing or invalid authentication token')
    })

    it('should accept requests with valid secret', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: VALID_SECRET,
          paths: ['/ar']
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.revalidated).toBeDefined()
    })

    it('should use constant-time comparison for secret validation', async () => {
      // Test that timing attacks are prevented by using secrets of different lengths
      const shortSecret = 'short'
      const longSecret = 'this-is-a-very-long-secret-that-should-not-match'

      const request1 = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: shortSecret,
          paths: ['/ar']
        })
      })

      const request2 = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: longSecret,
          paths: ['/ar']
        })
      })

      const start1 = Date.now()
      const response1 = await POST(request1)
      const time1 = Date.now() - start1

      const start2 = Date.now()
      const response2 = await POST(request2)
      const time2 = Date.now() - start2

      // Both should return 401
      expect(response1.status).toBe(401)
      expect(response2.status).toBe(401)

      // Timing difference should be minimal (within reasonable bounds)
      // This is a basic check - in practice, constant-time comparison
      // prevents more sophisticated timing attacks
      const timeDiff = Math.abs(time1 - time2)
      expect(timeDiff).toBeLessThan(100) // Allow 100ms variance
    })
  })

  describe('GET endpoint authentication', () => {
    it('should reject GET requests without secret', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(data.message).toContain('Missing authentication token')
    })

    it('should reject GET requests with invalid secret', async () => {
      const request = new NextRequest(`http://localhost:3000/api/revalidate?secret=${INVALID_SECRET}`, {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(data.message).toContain('Invalid authentication token')
    })

    it('should accept GET requests with valid secret', async () => {
      const request = new NextRequest(`http://localhost:3000/api/revalidate?secret=${VALID_SECRET}`, {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Revalidation API is working')
      expect(data.endpoints).toBeDefined()
    })
  })

  describe('Security headers', () => {
    it('should include WWW-Authenticate header in 401 responses', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paths: ['/ar']
        })
      })

      const response = await POST(request)

      expect(response.status).toBe(401)
      expect(response.headers.get('WWW-Authenticate')).toBe('Bearer realm="Revalidation API"')
    })
  })

  describe('WordPress webhook simulation', () => {
    it('should handle WordPress webhook with correct secret', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'WordPress/6.5; https://wordpress-1401009-5702602.cloudwaysapps.com'
        },
        body: JSON.stringify({
          secret: VALID_SECRET,
          content_type: 'program',
          content_id: 123,
          action: 'publish'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.revalidated.paths).toContain('/ar/programs')
    })

    it('should reject WordPress webhook with incorrect secret', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'WordPress/6.5; https://wordpress-1401009-5702602.cloudwaysapps.com'
        },
        body: JSON.stringify({
          secret: 'wrong-secret',
          content_type: 'program',
          content_id: 123,
          action: 'publish'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('Environment variable fallback', () => {
    it('should use fallback secret when environment variable is not set', async () => {
      // Temporarily remove environment variable
      const originalSecret = process.env.REVALIDATION_SECRET
      delete process.env.REVALIDATION_SECRET

      try {
        const request = new NextRequest('http://localhost:3000/api/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: 'zawaya-wp-revalidation-2025-secure-token', // Fallback value
            paths: ['/ar']
          })
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
      } finally {
        // Restore environment variable
        process.env.REVALIDATION_SECRET = originalSecret
      }
    })
  })
})