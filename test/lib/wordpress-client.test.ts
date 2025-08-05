/**
 * Unit Tests for WordPress Client
 * Tests authentication, caching, error handling, and retry logic
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WordPressClient, WordPressError, WordPressErrorType } from '@/lib/wordpress'

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

describe('WordPressClient', () => {
  let client: WordPressClient
  
  beforeEach(() => {
    client = new WordPressClient()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Authentication', () => {
    it('should include correct Authorization header', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await client.wpGet('/posts')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Basic ')
          })
        })
      )
    })

    it('should handle authentication errors', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      try {
        await client.wpGet('/posts')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(WordPressError)
        expect((error as WordPressError).type).toBe(WordPressErrorType.AUTH_ERROR)
        expect((error as WordPressError).statusCode).toBe(401)
      }
    })
  })

  describe('Caching', () => {
    it('should apply correct cache options', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await client.wpGet('/posts', {}, 'articles')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: expect.any(Number),
            tags: expect.arrayContaining(['articles'])
          })
        })
      )
    })

    it('should handle custom cache options', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const customCache = { revalidate: 3600, tags: ['custom'] }
      await client.wpGet('/posts', {}, customCache)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: 3600,
            tags: ['custom']
          })
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should classify network errors correctly', async () => {
      const networkError = new Error('Network error')
      networkError.name = 'TypeError'
      mockFetch.mockRejectedValueOnce(networkError)

      try {
        await client.wpGet('/posts')
      } catch (error) {
        expect(error).toBeInstanceOf(WordPressError)
        expect((error as WordPressError).type).toBe(WordPressErrorType.NETWORK_ERROR)
      }
    })

    it('should classify timeout errors correctly', async () => {
      const timeoutError = new Error('Timeout')
      timeoutError.name = 'TimeoutError'
      mockFetch.mockRejectedValueOnce(timeoutError)

      try {
        await client.wpGet('/posts')
      } catch (error) {
        expect(error).toBeInstanceOf(WordPressError)
        expect((error as WordPressError).type).toBe(WordPressErrorType.TIMEOUT_ERROR)
      }
    })

    it('should classify 404 errors correctly', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      try {
        await client.wpGet('/posts/999')
      } catch (error) {
        expect(error).toBeInstanceOf(WordPressError)
        expect((error as WordPressError).type).toBe(WordPressErrorType.NOT_FOUND)
        expect((error as WordPressError).statusCode).toBe(404)
      }
    })

    it('should classify server errors correctly', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      try {
        await client.wpGet('/posts')
      } catch (error) {
        expect(error).toBeInstanceOf(WordPressError)
        expect((error as WordPressError).type).toBe(WordPressErrorType.SERVER_ERROR)
        expect((error as WordPressError).statusCode).toBe(500)
      }
    })

    it('should classify rate limit errors correctly', async () => {
      const mockResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      try {
        await client.wpGet('/posts')
      } catch (error) {
        expect(error).toBeInstanceOf(WordPressError)
        expect((error as WordPressError).type).toBe(WordPressErrorType.RATE_LIMIT)
        expect((error as WordPressError).statusCode).toBe(429)
      }
    })
  })

  describe('Retry Logic', () => {
    it('should retry on network errors', async () => {
      const networkError = new Error('Network error')
      const successResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }

      mockFetch
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(successResponse)

      const resultPromise = client.wpGet('/posts')
      
      // Fast-forward through the retry delays
      await vi.runAllTimersAsync()
      
      const result = await resultPromise
      
      expect(mockFetch).toHaveBeenCalledTimes(3)
      expect(result).toEqual([])
    })

    it('should not retry on authentication errors', async () => {
      const authResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      }
      mockFetch.mockResolvedValueOnce(authResponse)

      await expect(client.wpGet('/posts')).rejects.toThrow(WordPressError)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should not retry on 404 errors', async () => {
      const notFoundResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      }
      mockFetch.mockResolvedValueOnce(notFoundResponse)

      // 404 errors should return null as fallback, not throw
      const result = await client.wpGet('/posts/999')
      expect(result).toBeNull()
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should respect max retry limit', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValue(networkError)

      const resultPromise = client.wpGet('/posts')
      
      // Fast-forward through all retry delays
      await vi.runAllTimersAsync()
      
      const result = await resultPromise
      
      // Should return fallback data instead of throwing
      expect(result).toEqual([])
      expect(mockFetch).toHaveBeenCalledTimes(4) // 1 initial + 3 retries
    })
  })

  describe('Request Parameters', () => {
    it('should build URL with query parameters correctly', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await client.wpGet('/posts', {
        per_page: 10,
        page: 2,
        categories: [1, 2, 3],
        search: 'test query'
      })

      const expectedUrl = expect.stringContaining('per_page=10&page=2&categories=1%2C2%2C3&search=test+query')
      expect(mockFetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object))
    })

    it('should handle undefined and null parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await client.wpGet('/posts', {
        per_page: 10,
        page: undefined,
        search: null,
        categories: [1, 2]
      })

      const call = mockFetch.mock.calls[0][0] as string
      expect(call).toContain('per_page=10')
      expect(call).toContain('categories=1%2C2')
      expect(call).not.toContain('page=')
      expect(call).not.toContain('search=')
    })
  })

  describe('Response Handling', () => {
    it('should parse JSON responses correctly', async () => {
      const mockData = [{ id: 1, title: 'Test Post' }]
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockData)
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await client.wpGet('/posts')
      expect(result).toEqual(mockData)
    })

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('Invalid JSON'))
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      try {
        await client.wpGet('/posts')
      } catch (error) {
        expect(error).toBeInstanceOf(WordPressError)
        expect((error as WordPressError).type).toBe(WordPressErrorType.VALIDATION_ERROR)
      }
    })
  })

  describe('Fallback Data', () => {
    it('should return empty array for list endpoints on error', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValue(networkError)

      const result = await client.wpGet('/posts')
      expect(result).toEqual([])
    })

    it('should return null for single item endpoints on error', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValue(networkError)

      const result = await client.wpGet('/posts/123')
      expect(result).toBeNull()
    })
  })

  describe('Health Check', () => {
    it('should return healthy status on successful connection', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const health = await client.healthCheck()
      
      expect(health.status).toBe('healthy')
      expect(health.details.connection).toBe(true)
      expect(health.details.authentication).toBe(true)
      expect(health.details.responseTime).toBeGreaterThan(0)
    })

    it('should return unhealthy status on connection failure', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValueOnce(networkError)

      const health = await client.healthCheck()
      
      expect(health.status).toBe('unhealthy')
      expect(health.details.connection).toBe(false)
      expect(health.details.lastError).toBeDefined()
    })

    it('should return degraded status on slow response', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      
      // Mock a slow response
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve(mockResponse), 2500))
      )

      const health = await client.healthCheck()
      
      expect(health.status).toBe('degraded')
      expect(health.details.responseTime).toBeGreaterThan(2000)
    })
  })

  describe('Connection Test', () => {
    it('should return true on successful connection', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await client.testConnection()
      expect(result).toBe(true)
    })

    it('should return false on connection failure', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValueOnce(networkError)

      const result = await client.testConnection()
      expect(result).toBe(false)
    })
  })
})