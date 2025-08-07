/**
 * WordPress Integration Tests
 * Tests the complete WordPress integration functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WPPost } from '@/lib/wordpress'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock environment variables
vi.mock('process', () => ({
  env: {
    WP_API_BASE: 'https://test-wp.com/wp-json/wp/v2',
    WP_USERNAME: 'testuser',
    WP_APP_PASSWORD: 'testpass123'
  }
}))

// Mock cache manager
vi.mock('@/lib/cache-manager', () => ({
  getCacheStrategy: vi.fn(() => ({
    revalidate: 300,
    tags: ['test']
  }))
}))

const createMockWpPost = (overrides: Partial<WPPost> = {}): WPPost => ({
  id: 1,
  slug: 'test-post',
  status: 'publish',
  title: { rendered: 'Test Post' },
  content: { rendered: '<p>Test content</p>' },
  excerpt: { rendered: '<p>Test excerpt</p>' },
  author: 1,
  featured_media: 123,
  date: '2024-01-01T00:00:00',
  modified: '2024-01-02T00:00:00',
  categories: [1, 2],
  tags: [3, 4],
  ...overrides,
});

describe('WordPress Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Article Fetching', () => {
    it('should fetch articles with proper SCF field mapping', async () => {
      const mockArticles = [
        createMockWpPost({
          zawaya_meta: {
            title_arabic: 'مقال تجريبي',
            excerpt_arabic: 'مقتطف تجريبي',
            content_arabic: 'محتوى تجريبي',
            is_featured: true,
            reading_time_minutes: 5,
            audio_narration_url: 'http://example.com/audio.mp3'
          }
        })
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockArticles)
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.getArticles()
      
      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('zawaya_meta')
      expect(result[0].zawaya_meta.title_arabic).toBe('مقال تجريبي')
      expect(result[0].zawaya_meta.is_featured).toBe(true)
    })

    it('should fetch featured articles', async () => {
      const mockArticles = [
        createMockWpPost({ zawaya_meta: { is_featured: true, title_arabic: 'مقال مميز' } }),
        createMockWpPost({ id: 2, zawaya_meta: { is_featured: false, title_arabic: 'مقال عادي' } })
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockArticles)
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.getArticles({ featured: true })
      
      expect(result.every(article => article.zawaya_meta.is_featured)).toBe(true)
    })

    it('should fetch article by slug', async () => {
      const mockArticle = createMockWpPost({
        slug: 'test-article',
        zawaya_meta: {
          title_arabic: 'مقال تجريبي'
        }
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([mockArticle])
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.getArticleBySlug('test-article')
      
      expect(result).toBeDefined()
      expect(result?.slug).toBe('test-article')
      expect(result?.zawaya_meta.title_arabic).toBe('مقال تجريبي')
    })
  })

  describe('Program and Episode Fetching', () => {
    it('should fetch programs with SCF metadata', async () => {
      const mockPrograms = [
        createMockWpPost({
          id: 1,
          slug: 'test-program',
          title: { rendered: 'Test Program' },
          zawaya_meta: {
            host_arabic: 'مقدم البرنامج',
            program_type: 'video',
            theme_color: '#ff0000',
            episode_count: 10
          }
        })
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPrograms)
      })

      const { ProgramHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ProgramHelpers.getPrograms()
      
      expect(result).toHaveLength(1)
      expect(result[0].zawaya_meta.host_arabic).toBe('مقدم البرنامج')
      expect(result[0].zawaya_meta.program_type).toBe('video')
    })

    it('should fetch episodes for a program', async () => {
      const mockEpisodes = [
        createMockWpPost({
          id: 1,
          title: { rendered: 'Episode 1' },
          zawaya_meta: {
            program_reference: '5',
            season_number: 1,
            episode_number: 1,
            duration_seconds: 1800
          }
        })
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockEpisodes)
      })

      const { EpisodeHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await EpisodeHelpers.getEpisodesByProgram(5)
      
      expect(result).toHaveLength(1)
      expect(result[0].zawaya_meta.program_reference).toBe('5')
      expect(result[0].zawaya_meta.episode_number).toBe(1)
    })
  })

  describe('Author Fetching', () => {
    it('should fetch authors with Arabic metadata', async () => {
      const mockAuthors = [
        {
          id: 1,
          name: 'John Doe',
          slug: 'john-doe',
          zawaya_meta: {
            name_arabic: 'جون دو',
            job_title_arabic: 'كاتب',
            bio_arabic: 'سيرة ذاتية عربية',
            is_verified_author: true
          }
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockAuthors)
      })

      const { AuthorHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await AuthorHelpers.getAuthors()
      
      expect(result).toHaveLength(1)
      expect(result[0].zawaya_meta.name_arabic).toBe('جون دو')
      expect(result[0].zawaya_meta.is_verified_author).toBe(true)
    })
  })

  describe('Search Functionality', () => {
    it('should search articles with query', async () => {
      const mockResults = [
        createMockWpPost({
          id: 1,
          title: { rendered: 'Search Result' },
          zawaya_meta: {
            title_arabic: 'نتيجة البحث'
          }
        })
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResults)
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.searchArticles('test query')
      
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Search Result')
    })

    it('should return empty array for empty search query', async () => {
      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.searchArticles('')
      
      expect(result).toEqual([])
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.getArticles()
      
      // Should return fallback data
      expect(Array.isArray(result)).toBe(true)
    })

    it('should handle 404 errors for single items', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.getArticleBySlug('non-existent')
      
      expect(result).toBeNull()
    })
  })

  describe('Cache Integration', () => {
    it('should use appropriate cache strategies', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      })

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

  describe('SCF Field Processing', () => {
    it('should prefer zawaya_meta over meta fields', async () => {
      const mockPost = createMockWpPost({
        meta: {
          title_arabic: 'من meta'
        },
        zawaya_meta: {
          title_arabic: 'من zawaya_meta'
        }
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([mockPost])
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.getArticles()
      
      expect(result[0].zawaya_meta.title_arabic).toBe('من zawaya_meta')
    })

    it('should handle missing SCF fields gracefully', async () => {
      const mockPost = createMockWpPost()
      delete mockPost.zawaya_meta
      delete mockPost.meta

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([mockPost])
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.getArticles()
      
      expect(result[0]).toHaveProperty('zawaya_meta')
      expect(typeof result[0].zawaya_meta).toBe('object')
    })
  })

  describe('Embedded Data Handling', () => {
    it('should process embedded author data', async () => {
      const mockPost = createMockWpPost({
        _embedded: {
          author: [{
            id: 1,
            name: 'Test Author',
            slug: 'test-author'
          }]
        }
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([mockPost])
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.getArticles()
      
      expect(result[0].author?.name).toBe('Test Author')
    })

    it('should process embedded featured media', async () => {
      const mockPost = createMockWpPost({
        _embedded: {
          'wp:featuredmedia': [{
            id: 123,
            source_url: 'http://example.com/image.jpg',
            alt_text: 'Test image'
          }]
        }
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([mockPost])
      })

      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const result = await ArticleHelpers.getArticles()
      
      expect(result[0].featured_image_url).toBe('http://example.com/image.jpg')
    })
  })
})