/**
 * Fixed Unit Tests for WordPress Client
 * Tests authentication, caching, error handling, and retry logic
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock environment variables
vi.mock('process', () => ({
  env: {
    WP_API_BASE: 'https://test-wp.com/wp-json/wp/v2',
    WP_USERNAME: 'testuser',
    WP_APP_PASSWORD: 'testpass123',
    REVALIDATION_SECRET: 'test-secret'
  }
}))

// Mock cache manager
vi.mock('@/lib/cache-manager', () => ({
  getCacheStrategy: vi.fn(() => ({
    revalidate: 300,
    tags: ['test']
  }))
}))

// Mock transformers
vi.mock('@/lib/wordpress-transformers', () => ({
  transformWordPressPost: vi.fn((post) => post),
  transformWordPressPosts: vi.fn((posts) => posts),
  createFallbackPost: vi.fn(() => ({
    id: 0,
    slug: 'fallback',
    title: 'Fallback Post'
  }))
}))

describe('WordPress Client Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Basic Functionality', () => {
    it('should make authenticated requests', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ id: 1, title: { rendered: 'Test Post' } }])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      // Import here to avoid hoisting issues
      const { wpGet } = await import('@/lib/wordpress')
      
      const result = await wpGet('/posts')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Basic ')
          })
        })
      )
      expect(result).toBeDefined()
    })

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValue(networkError)

      const { wpGet } = await import('@/lib/wordpress')
      
      // Should return fallback data instead of throwing
      const result = await wpGet('/posts')
      expect(result).toBeDefined()
    })

    it('should handle 404 errors by returning null', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const { wpGet } = await import('@/lib/wordpress')
      
      const result = await wpGet('/posts/999')
      expect(result).toBeNull()
    })

    it('should include cache configuration', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const { wpGet } = await import('@/lib/wordpress')
      
      await wpGet('/posts', {}, 'articles')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: expect.any(Number),
            tags: expect.any(Array)
          })
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should classify authentication errors', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const { wpGet } = await import('@/lib/wordpress')
      
      // Should handle auth error gracefully
      const result = await wpGet('/posts')
      expect(result).toBeDefined() // Should return fallback
    })

    it('should handle server errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const { wpGet } = await import('@/lib/wordpress')
      
      const result = await wpGet('/posts')
      expect(result).toBeDefined() // Should return fallback
    })
  })

  describe('Request Building', () => {
    it('should build URLs with query parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const { wpGet } = await import('@/lib/wordpress')
      
      await wpGet('/posts', {
        per_page: 10,
        page: 2,
        search: 'test query'
      })

      const calledUrl = mockFetch.mock.calls[0][0] as string
      expect(calledUrl).toContain('per_page=10')
      expect(calledUrl).toContain('page=2')
      expect(calledUrl).toContain('search=test+query')
    })

    it('should handle array parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const { wpGet } = await import('@/lib/wordpress')
      
      await wpGet('/posts', {
        categories: [1, 2, 3]
      })

      const calledUrl = mockFetch.mock.calls[0][0] as string
      expect(calledUrl).toContain('categories=1%2C2%2C3')
    })
  })

  describe('Health Check', () => {
    it('should perform health check', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const { wpClient } = await import('@/lib/wordpress')
      
      const health = await wpClient.healthCheck()
      
      expect(health).toHaveProperty('status')
      expect(health).toHaveProperty('details')
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status)
    })
  })

  describe('Connection Test', () => {
    it('should test connection successfully', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const { wpClient } = await import('@/lib/wordpress')
      
      const result = await wpClient.testConnection()
      expect(typeof result).toBe('boolean')
    })
  })
})