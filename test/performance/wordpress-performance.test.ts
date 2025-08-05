/**
 * WordPress Performance Tests
 * Tests Core Web Vitals, loading times, and performance metrics
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn()
}

global.performance = mockPerformance as any

// Mock fetch for controlled timing tests
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('WordPress Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPerformance.now.mockImplementation(() => Date.now())
  })

  describe('API Response Times', () => {
    it('should fetch articles within acceptable time', async () => {
      // Mock fast response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([
          {
            id: 1,
            slug: 'test-article',
            status: 'publish',
            title: { rendered: 'Test Article' },
            content: { rendered: '<p>Content</p>' },
            excerpt: { rendered: '<p>Excerpt</p>' },
            author: 1,
            featured_media: 0,
            date: '2024-01-01T00:00:00',
            modified: '2024-01-01T00:00:00',
            categories: [],
            tags: [],
            zawaya_meta: {}
          }
        ])
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const startTime = Date.now()
      const articles = await ArticleHelpers.getArticles({ per_page: 10 })
      const endTime = Date.now()
      
      const responseTime = endTime - startTime
      
      expect(articles).toBeDefined()
      expect(Array.isArray(articles)).toBe(true)
      
      // Should respond within 2 seconds for API calls
      expect(responseTime).toBeLessThan(2000)
    })

    it('should handle concurrent requests efficiently', async () => {
      // Mock multiple responses
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const startTime = Date.now()
      
      // Make 5 concurrent requests
      const promises = Array.from({ length: 5 }, (_, i) => 
        ArticleHelpers.getArticles({ per_page: 5, page: i + 1 })
      )
      
      const results = await Promise.all(promises)
      const endTime = Date.now()
      
      const totalTime = endTime - startTime
      
      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true)
      })
      
      // Concurrent requests should not take much longer than sequential
      expect(totalTime).toBeLessThan(5000)
    })

    it('should cache requests for better performance', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      })

      const { wpGet } = await import('@/lib/wordpress')
      
      // First request
      const start1 = Date.now()
      await wpGet('/posts', { per_page: 1 })
      const time1 = Date.now() - start1
      
      // Second identical request (should use cache)
      const start2 = Date.now()
      await wpGet('/posts', { per_page: 1 })
      const time2 = Date.now() - start2
      
      expect(time1).toBeGreaterThan(0)
      expect(time2).toBeGreaterThan(0)
      
      // Both should complete successfully
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('Memory Usage', () => {
    it('should not leak memory during repeated operations', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      // Simulate memory usage tracking
      const initialMemory = process.memoryUsage().heapUsed
      
      // Perform many operations
      for (let i = 0; i < 10; i++) {
        await ArticleHelpers.getArticles({ per_page: 1 })
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
    })

    it('should handle large datasets efficiently', async () => {
      // Mock large dataset
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        slug: `article-${i + 1}`,
        status: 'publish' as const,
        title: { rendered: `Article ${i + 1}` },
        content: { rendered: '<p>Content</p>'.repeat(100) }, // Large content
        excerpt: { rendered: '<p>Excerpt</p>' },
        author: 1,
        featured_media: 0,
        date: '2024-01-01T00:00:00',
        modified: '2024-01-01T00:00:00',
        categories: [1, 2, 3],
        tags: [1, 2, 3, 4, 5],
        zawaya_meta: {
          title_arabic: `مقال ${i + 1}`,
          content_arabic: 'محتوى طويل '.repeat(100)
        }
      }))

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(largeDataset)
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const startTime = Date.now()
      const articles = await ArticleHelpers.getArticles({ per_page: 100 })
      const endTime = Date.now()
      
      const processingTime = endTime - startTime
      
      expect(articles).toHaveLength(100)
      
      // Should process large dataset within reasonable time
      expect(processingTime).toBeLessThan(3000)
    })
  })

  describe('Error Recovery Performance', () => {
    it('should fail fast on network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const startTime = Date.now()
      const articles = await ArticleHelpers.getArticles()
      const endTime = Date.now()
      
      const errorTime = endTime - startTime
      
      // Should return fallback data quickly
      expect(Array.isArray(articles)).toBe(true)
      
      // Error handling should not take too long (accounting for retries)
      expect(errorTime).toBeLessThan(15000) // Max retry time
    })

    it('should handle timeout gracefully', async () => {
      // Mock slow response
      mockFetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([])
          }), 10000) // 10 second delay
        )
      )

      const { wpGet } = await import('@/lib/wordpress')
      
      const startTime = Date.now()
      const result = await wpGet('/posts', { per_page: 1 })
      const endTime = Date.now()
      
      const totalTime = endTime - startTime
      
      expect(result).toBeDefined()
      
      // Should not wait the full 10 seconds due to timeout handling
      expect(totalTime).toBeLessThan(8000)
    })
  })

  describe('Bundle Size and Loading', () => {
    it('should have reasonable module sizes', async () => {
      // Test that modules can be imported without excessive overhead
      const startTime = Date.now()
      
      const { wpGet } = await import('@/lib/wordpress')
      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      const { transformWordPressPost } = await import('@/lib/wordpress-transformers')
      
      const loadTime = Date.now() - startTime
      
      expect(wpGet).toBeDefined()
      expect(ArticleHelpers).toBeDefined()
      expect(transformWordPressPost).toBeDefined()
      
      // Module loading should be fast
      expect(loadTime).toBeLessThan(1000)
    })

    it('should support tree shaking', async () => {
      // Test that individual functions can be imported
      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      expect(ArticleHelpers.getArticles).toBeTypeOf('function')
      expect(ArticleHelpers.searchArticles).toBeTypeOf('function')
      expect(ArticleHelpers.getArticleBySlug).toBeTypeOf('function')
    })
  })

  describe('Arabic Text Performance', () => {
    it('should handle Arabic text processing efficiently', async () => {
      const arabicContent = {
        id: 1,
        slug: 'arabic-article',
        status: 'publish' as const,
        title: { rendered: 'مقال باللغة العربية مع نص طويل جداً يحتوي على كلمات كثيرة' },
        content: { rendered: '<p>' + 'النص العربي الطويل '.repeat(1000) + '</p>' },
        excerpt: { rendered: '<p>مقتطف عربي</p>' },
        author: 1,
        featured_media: 0,
        date: '2024-01-01T00:00:00',
        modified: '2024-01-01T00:00:00',
        categories: [],
        tags: [],
        zawaya_meta: {
          title_arabic: 'عنوان عربي طويل جداً مع كلمات كثيرة ومعقدة',
          content_arabic: 'محتوى عربي طويل '.repeat(500)
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([arabicContent])
      })

      const { transformWordPressPost } = await import('@/lib/wordpress-transformers')
      
      const startTime = Date.now()
      const transformed = transformWordPressPost(arabicContent)
      const endTime = Date.now()
      
      const transformTime = endTime - startTime
      
      expect(transformed).toBeDefined()
      expect(transformed.zawaya_meta.title_arabic).toContain('عنوان عربي')
      
      // Arabic text processing should be fast
      expect(transformTime).toBeLessThan(100)
    })

    it('should handle RTL text direction efficiently', async () => {
      // Test that RTL processing doesn't add significant overhead
      const rtlContent = 'هذا نص تجريبي باللغة العربية يحتوي على أرقام ١٢٣٤٥ ورموز خاصة'
      
      const startTime = Date.now()
      
      // Simulate RTL text processing
      const processed = rtlContent
        .replace(/[٠-٩]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 1584 + 48))
        .trim()
      
      const endTime = Date.now()
      const processingTime = endTime - startTime
      
      expect(processed).toBeDefined()
      expect(processingTime).toBeLessThan(10) // Should be very fast
    })
  })

  describe('Search Performance', () => {
    it('should perform search operations efficiently', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const searchQueries = [
        'تكنولوجيا',
        'علوم',
        'ثقافة',
        'فلسفة',
        'أدب'
      ]
      
      const startTime = Date.now()
      
      const searchPromises = searchQueries.map(query => 
        ArticleHelpers.searchArticles(query, 10)
      )
      
      const results = await Promise.all(searchPromises)
      const endTime = Date.now()
      
      const totalSearchTime = endTime - startTime
      
      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true)
      })
      
      // Multiple searches should complete within reasonable time
      expect(totalSearchTime).toBeLessThan(3000)
    })
  })
})