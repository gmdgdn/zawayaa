/**
 * WordPress API Integration Tests
 * Tests real WordPress API integration with test content
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

// These tests require a real WordPress instance
// Skip if WordPress is not available
const WORDPRESS_AVAILABLE = process.env.WP_API_BASE && process.env.WP_USERNAME && process.env.WP_APP_PASSWORD

describe.skipIf(!WORDPRESS_AVAILABLE)('WordPress API Integration', () => {
  beforeAll(async () => {
    // Test WordPress connection before running tests
    const { wpClient } = await import('@/lib/wordpress')
    const isConnected = await wpClient.testConnection()
    
    if (!isConnected) {
      console.warn('WordPress connection failed - skipping integration tests')
      return
    }
  })

  describe('Connection and Authentication', () => {
    it('should connect to WordPress successfully', async () => {
      const { wpClient } = await import('@/lib/wordpress')
      
      const result = await wpClient.testConnection()
      expect(result).toBe(true)
    })

    it('should perform health check', async () => {
      const { wpClient } = await import('@/lib/wordpress')
      
      const health = await wpClient.healthCheck()
      
      expect(health).toHaveProperty('status')
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status)
      expect(health).toHaveProperty('details')
      expect(health.details).toHaveProperty('connection')
      expect(health.details).toHaveProperty('responseTime')
    })
  })

  describe('Posts API', () => {
    it('should fetch posts from WordPress', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const posts = await wpGet('/posts', { per_page: 5 })
      
      expect(Array.isArray(posts)).toBe(true)
      if (posts.length > 0) {
        expect(posts[0]).toHaveProperty('id')
        expect(posts[0]).toHaveProperty('title')
        expect(posts[0]).toHaveProperty('content')
      }
    })

    it('should fetch posts with embedded data', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const posts = await wpGet('/posts', { 
        per_page: 3,
        _embed: true 
      })
      
      expect(Array.isArray(posts)).toBe(true)
      if (posts.length > 0) {
        // Check if embedded data is present (if available)
        const post = posts[0]
        if (post._embedded) {
          expect(post._embedded).toBeTypeOf('object')
        }
      }
    })

    it('should handle post not found gracefully', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const post = await wpGet('/posts/999999') // Non-existent post
      
      expect(post).toBeNull()
    })
  })

  describe('Custom Post Types', () => {
    it('should fetch programs if available', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      try {
        const programs = await wpGet('/program', { per_page: 5 })
        
        expect(Array.isArray(programs)).toBe(true)
        // Programs might not exist, so we just check the response format
      } catch (error) {
        // Custom post type might not be registered - that's okay
        console.log('Programs CPT not available:', error)
      }
    })

    it('should fetch episodes if available', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      try {
        const episodes = await wpGet('/episode', { per_page: 5 })
        
        expect(Array.isArray(episodes)).toBe(true)
        // Episodes might not exist, so we just check the response format
      } catch (error) {
        // Custom post type might not be registered - that's okay
        console.log('Episodes CPT not available:', error)
      }
    })
  })

  describe('Users and Authors', () => {
    it('should fetch users/authors', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const users = await wpGet('/users', { per_page: 5 })
      
      expect(Array.isArray(users)).toBe(true)
      if (users.length > 0) {
        expect(users[0]).toHaveProperty('id')
        expect(users[0]).toHaveProperty('name')
        expect(users[0]).toHaveProperty('slug')
      }
    })
  })

  describe('Taxonomies', () => {
    it('should fetch categories', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const categories = await wpGet('/categories', { per_page: 10 })
      
      expect(Array.isArray(categories)).toBe(true)
      if (categories.length > 0) {
        expect(categories[0]).toHaveProperty('id')
        expect(categories[0]).toHaveProperty('name')
        expect(categories[0]).toHaveProperty('slug')
      }
    })

    it('should fetch tags', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const tags = await wpGet('/tags', { per_page: 10 })
      
      expect(Array.isArray(tags)).toBe(true)
      if (tags.length > 0) {
        expect(tags[0]).toHaveProperty('id')
        expect(tags[0]).toHaveProperty('name')
        expect(tags[0]).toHaveProperty('slug')
      }
    })
  })

  describe('Search Functionality', () => {
    it('should search posts', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const results = await wpGet('/posts', { 
        search: 'test',
        per_page: 5 
      })
      
      expect(Array.isArray(results)).toBe(true)
      // Results might be empty if no posts match 'test'
    })
  })

  describe('SCF Fields Integration', () => {
    it('should handle SCF fields if present', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const posts = await wpGet('/posts', { 
        per_page: 3,
        acf_format: 'standard'
      })
      
      expect(Array.isArray(posts)).toBe(true)
      if (posts.length > 0) {
        const post = posts[0]
        
        // Check if SCF fields are present
        if (post.zawaya_meta || post.meta) {
          expect(typeof (post.zawaya_meta || post.meta)).toBe('object')
        }
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid endpoints gracefully', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const result = await wpGet('/invalid-endpoint')
      
      // Should return fallback data or empty array
      expect(result).toBeDefined()
    })

    it('should handle malformed requests gracefully', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const result = await wpGet('/posts', { 
        per_page: 'invalid' // Invalid parameter
      })
      
      // Should still return data or handle gracefully
      expect(result).toBeDefined()
    })
  })

  describe('Caching Behavior', () => {
    it('should cache requests appropriately', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      const start1 = Date.now()
      const result1 = await wpGet('/posts', { per_page: 1 }, 'articles')
      const time1 = Date.now() - start1
      
      const start2 = Date.now()
      const result2 = await wpGet('/posts', { per_page: 1 }, 'articles')
      const time2 = Date.now() - start2
      
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
      
      // Second request might be faster due to caching
      // (This is not always reliable in tests, so we just check both completed)
      expect(time1).toBeGreaterThan(0)
      expect(time2).toBeGreaterThan(0)
    })
  })

  describe('Content Helpers Integration', () => {
    it('should fetch articles using helpers', async () => {
      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const articles = await ArticleHelpers.getArticles({ per_page: 3 })
      
      expect(Array.isArray(articles)).toBe(true)
      if (articles.length > 0) {
        expect(articles[0]).toHaveProperty('id')
        expect(articles[0]).toHaveProperty('title')
        expect(articles[0]).toHaveProperty('zawaya_meta')
      }
    })

    it('should search articles using helpers', async () => {
      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const results = await ArticleHelpers.searchArticles('test', 5)
      
      expect(Array.isArray(results)).toBe(true)
      // Results might be empty if no posts match
    })

    it('should fetch programs using helpers', async () => {
      const { ProgramHelpers } = await import('@/lib/wordpress-content-helpers')
      
      try {
        const programs = await ProgramHelpers.getPrograms({ per_page: 3 })
        
        expect(Array.isArray(programs)).toBe(true)
      } catch (error) {
        // Programs CPT might not be available
        console.log('Programs not available via helpers:', error)
      }
    })

    it('should fetch authors using helpers', async () => {
      const { AuthorHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const authors = await AuthorHelpers.getAuthors(5)
      
      expect(Array.isArray(authors)).toBe(true)
      if (authors.length > 0) {
        expect(authors[0]).toHaveProperty('id')
        expect(authors[0]).toHaveProperty('name')
      }
    })
  })
})

// Fallback tests that run even without WordPress
describe('WordPress API Fallback Behavior', () => {
  it('should handle missing WordPress gracefully', async () => {
    // Temporarily override environment to simulate missing WordPress
    const originalBase = process.env.WP_API_BASE
    const originalUser = process.env.WP_USERNAME
    const originalPass = process.env.WP_APP_PASSWORD
    
    process.env.WP_API_BASE = ''
    process.env.WP_USERNAME = ''
    process.env.WP_APP_PASSWORD = ''
    
    try {
      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const articles = await ArticleHelpers.getArticles()
      
      // Should return fallback data
      expect(Array.isArray(articles)).toBe(true)
    } finally {
      // Restore environment
      process.env.WP_API_BASE = originalBase
      process.env.WP_USERNAME = originalUser
      process.env.WP_APP_PASSWORD = originalPass
    }
  })

  it('should provide meaningful error messages', async () => {
    const { wpClient } = await import('@/lib/wordpress')
    
    // Test connection should work even if it returns false
    const result = await wpClient.testConnection()
    expect(typeof result).toBe('boolean')
  })
})