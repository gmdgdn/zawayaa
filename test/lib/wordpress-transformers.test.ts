/**
 * Unit Tests for WordPress Transformers
 * Tests data transformation from WordPress API format to normalized format
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  transformWordPressPost, 
  transformWordPressPosts, 
  createFallbackPost,
  type NormalizedWPPost 
} from '@/lib/wordpress-transformers'

describe('WordPress Transformers', () => {
  describe('transformWordPressPost', () => {
    it('should transform basic WordPress post', () => {
      const wpPost = {
        id: 1,
        slug: 'test-post',
        status: 'publish' as const,
        title: { rendered: 'Test Post' },
        content: { rendered: '<p>Test content</p>' },
        excerpt: { rendered: '<p>Test excerpt</p>' },
        author: 1,
        featured_media: 123,
        date: '2024-01-01T00:00:00',
        modified: '2024-01-02T00:00:00',
        categories: [1, 2],
        tags: [3, 4],
        meta: {
          title_arabic: 'مقال تجريبي',
          excerpt_arabic: 'مقتطف تجريبي',
          is_featured: true,
          reading_time_minutes: 5
        }
      }

      const result = transformWordPressPost(wpPost)

      expect(result).toEqual({
        id: 1,
        slug: 'test-post',
        status: 'publish',
        title: 'Test Post',
        content: '<p>Test content</p>',
        excerpt: '<p>Test excerpt</p>',
        author: 1,
        featured_media: 123,
        date: '2024-01-01T00:00:00',
        modified: '2024-01-02T00:00:00',
        categories: [1, 2],
        tags: [3, 4],
        zawaya_meta: {
          title_arabic: 'مقال تجريبي',
          excerpt_arabic: 'مقتطف تجريبي',
          is_featured: true,
          reading_time_minutes: 5
        },
        _embedded: undefined
      })
    })

    it('should handle zawaya_meta field over meta field', () => {
      const wpPost = {
        id: 1,
        slug: 'test-post',
        status: 'publish' as const,
        title: { rendered: 'Test Post' },
        content: { rendered: '<p>Test content</p>' },
        excerpt: { rendered: '<p>Test excerpt</p>' },
        author: 1,
        featured_media: 123,
        date: '2024-01-01T00:00:00',
        modified: '2024-01-02T00:00:00',
        categories: [1, 2],
        tags: [3, 4],
        meta: {
          title_arabic: 'من meta',
          is_featured: false
        },
        zawaya_meta: {
          title_arabic: 'من zawaya_meta',
          is_featured: true,
          audio_narration_url: 'http://example.com/audio.mp3'
        }
      }

      const result = transformWordPressPost(wpPost)

      expect(result.zawaya_meta.title_arabic).toBe('من zawaya_meta')
      expect(result.zawaya_meta.is_featured).toBe(true)
      expect(result.zawaya_meta.audio_narration_url).toBe('http://example.com/audio.mp3')
    })

    it('should handle embedded data', () => {
      const wpPost = {
        id: 1,
        slug: 'test-post',
        status: 'publish' as const,
        title: { rendered: 'Test Post' },
        content: { rendered: '<p>Test content</p>' },
        excerpt: { rendered: '<p>Test excerpt</p>' },
        author: 1,
        featured_media: 123,
        date: '2024-01-01T00:00:00',
        modified: '2024-01-02T00:00:00',
        categories: [1, 2],
        tags: [3, 4],
        meta: {},
        _embedded: {
          author: [{
            id: 1,
            name: 'Test Author',
            slug: 'test-author',
            avatar_urls: { '96': 'http://example.com/avatar.jpg' },
            link: 'http://example.com/author/test-author'
          }],
          'wp:featuredmedia': [{
            id: 123,
            source_url: 'http://example.com/image.jpg',
            alt_text: 'Test image'
          }],
          'wp:term': [[{
            id: 1,
            name: 'Test Category',
            slug: 'test-category',
            link: 'http://example.com/category/test-category'
          }]]
        }
      }

      const result = transformWordPressPost(wpPost)

      expect(result._embedded).toBeDefined()
      expect(result._embedded?.author).toHaveLength(1)
      expect(result._embedded?.author?.[0].name).toBe('Test Author')
      expect(result._embedded?.['wp:featuredmedia']).toHaveLength(1)
      expect(result._embedded?.['wp:featuredmedia']?.[0].source_url).toBe('http://example.com/image.jpg')
    })

    it('should handle missing meta fields gracefully', () => {
      const wpPost = {
        id: 1,
        slug: 'test-post',
        status: 'publish' as const,
        title: { rendered: 'Test Post' },
        content: { rendered: '<p>Test content</p>' },
        excerpt: { rendered: '<p>Test excerpt</p>' },
        author: 1,
        featured_media: 123,
        date: '2024-01-01T00:00:00',
        modified: '2024-01-02T00:00:00',
        categories: [1, 2],
        tags: [3, 4]
      }

      const result = transformWordPressPost(wpPost)

      expect(result.zawaya_meta).toEqual({})
    })

    it('should handle null and undefined values', () => {
      const wpPost = {
        id: 1,
        slug: 'test-post',
        status: 'publish' as const,
        title: { rendered: 'Test Post' },
        content: { rendered: '<p>Test content</p>' },
        excerpt: { rendered: '<p>Test excerpt</p>' },
        author: 1,
        featured_media: 0, // No featured media
        date: '2024-01-01T00:00:00',
        modified: '2024-01-02T00:00:00',
        categories: [],
        tags: [],
        meta: {
          title_arabic: null,
          excerpt_arabic: undefined,
          is_featured: false
        }
      }

      const result = transformWordPressPost(wpPost)

      expect(result.featured_media).toBe(0)
      expect(result.categories).toEqual([])
      expect(result.tags).toEqual([])
      expect(result.zawaya_meta.title_arabic).toBeNull()
      expect(result.zawaya_meta.excerpt_arabic).toBeUndefined()
      expect(result.zawaya_meta.is_featured).toBe(false)
    })
  })

  describe('transformWordPressPosts', () => {
    it('should transform array of WordPress posts', () => {
      const wpPosts = [
        {
          id: 1,
          slug: 'post-1',
          status: 'publish' as const,
          title: { rendered: 'Post 1' },
          content: { rendered: '<p>Content 1</p>' },
          excerpt: { rendered: '<p>Excerpt 1</p>' },
          author: 1,
          featured_media: 123,
          date: '2024-01-01T00:00:00',
          modified: '2024-01-02T00:00:00',
          categories: [1],
          tags: [2],
          meta: { title_arabic: 'مقال 1' }
        },
        {
          id: 2,
          slug: 'post-2',
          status: 'publish' as const,
          title: { rendered: 'Post 2' },
          content: { rendered: '<p>Content 2</p>' },
          excerpt: { rendered: '<p>Excerpt 2</p>' },
          author: 2,
          featured_media: 456,
          date: '2024-01-03T00:00:00',
          modified: '2024-01-04T00:00:00',
          categories: [2],
          tags: [3],
          meta: { title_arabic: 'مقال 2' }
        }
      ]

      const result = transformWordPressPosts(wpPosts)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[0].zawaya_meta.title_arabic).toBe('مقال 1')
      expect(result[1].id).toBe(2)
      expect(result[1].zawaya_meta.title_arabic).toBe('مقال 2')
    })

    it('should handle empty array', () => {
      const result = transformWordPressPosts([])
      expect(result).toEqual([])
    })

    it('should handle transformation errors gracefully', () => {
      const invalidPost = {
        id: 1,
        // Missing required fields
      } as any

      const result = transformWordPressPosts([invalidPost])

      // Should still return an array, but may have fallback data
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('createFallbackPost', () => {
    it('should create fallback post with default values', () => {
      const result = createFallbackPost()

      expect(result).toEqual({
        id: 0,
        slug: 'fallback-post',
        status: 'publish',
        title: 'محتوى قيد التحميل',
        content: 'نعتذر، المحتوى قيد التحميل. يرجى المحاولة لاحقاً.',
        excerpt: 'محتوى قيد التحميل...',
        author: 0,
        featured_media: 0,
        date: expect.any(String),
        modified: expect.any(String),
        categories: [],
        tags: [],
        zawaya_meta: {
          title_arabic: 'محتوى قيد التحميل',
          excerpt_arabic: 'محتوى قيد التحميل...',
          content_arabic: 'نعتذر، المحتوى قيد التحميل. يرجى المحاولة لاحقاً.',
          is_featured: false,
          is_breaking_news: false,
          reading_time_minutes: 1
        },
        _embedded: undefined
      })
    })

    it('should create fallback post with custom title and content', () => {
      const customTitle = 'عنوان مخصص'
      const customContent = 'محتوى مخصص'

      const result = createFallbackPost(customTitle, customContent)

      expect(result.title).toBe(customTitle)
      expect(result.content).toBe(customContent)
      expect(result.zawaya_meta.title_arabic).toBe(customTitle)
      expect(result.zawaya_meta.content_arabic).toBe(customContent)
    })

    it('should generate valid dates', () => {
      const result = createFallbackPost()

      expect(new Date(result.date).getTime()).not.toBeNaN()
      expect(new Date(result.modified).getTime()).not.toBeNaN()
      expect(new Date(result.modified).getTime()).toBeGreaterThanOrEqual(new Date(result.date).getTime())
    })

    it('should create unique slugs for multiple calls', () => {
      const post1 = createFallbackPost('Title 1')
      const post2 = createFallbackPost('Title 2')

      // Should have different timestamps in slug
      expect(post1.slug).not.toBe(post2.slug)
    })
  })

  describe('Edge Cases', () => {
    it('should handle posts with complex SCF data', () => {
      const wpPost = {
        id: 1,
        slug: 'complex-post',
        status: 'publish' as const,
        title: { rendered: 'Complex Post' },
        content: { rendered: '<p>Complex content</p>' },
        excerpt: { rendered: '<p>Complex excerpt</p>' },
        author: 1,
        featured_media: 123,
        date: '2024-01-01T00:00:00',
        modified: '2024-01-02T00:00:00',
        categories: [1, 2, 3],
        tags: [4, 5, 6],
        zawaya_meta: {
          title_arabic: 'مقال معقد',
          excerpt_arabic: 'مقتطف معقد',
          content_arabic: 'محتوى معقد',
          author_arabic_name: 'كاتب عربي',
          author_bio_arabic: 'سيرة ذاتية عربية',
          audio_narration_url: 'http://example.com/audio.mp3',
          audio_duration: 300,
          social_sharing_image: 'http://example.com/share.jpg',
          reading_time_minutes: 10,
          category_color: '#ff0000',
          is_featured: true,
          is_breaking_news: false,
          meta_description_arabic: 'وصف ميتا عربي',
          keywords_arabic: 'كلمات مفتاحية عربية'
        }
      }

      const result = transformWordPressPost(wpPost)

      expect(result.zawaya_meta).toEqual(wpPost.zawaya_meta)
      expect(result.categories).toEqual([1, 2, 3])
      expect(result.tags).toEqual([4, 5, 6])
    })

    it('should handle posts with malformed embedded data', () => {
      const wpPost = {
        id: 1,
        slug: 'test-post',
        status: 'publish' as const,
        title: { rendered: 'Test Post' },
        content: { rendered: '<p>Test content</p>' },
        excerpt: { rendered: '<p>Test excerpt</p>' },
        author: 1,
        featured_media: 123,
        date: '2024-01-01T00:00:00',
        modified: '2024-01-02T00:00:00',
        categories: [1, 2],
        tags: [3, 4],
        meta: {},
        _embedded: {
          author: null, // Malformed data
          'wp:featuredmedia': undefined,
          'wp:term': 'invalid' // Should be array
        }
      }

      const result = transformWordPressPost(wpPost)

      expect(result._embedded).toBeDefined()
      expect(result._embedded?.author).toBeNull()
      expect(result._embedded?.['wp:featuredmedia']).toBeUndefined()
      expect(result._embedded?.['wp:term']).toBe('invalid')
    })
  })
})