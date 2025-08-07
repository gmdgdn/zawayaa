/**
 * Revalidation Workflow Tests
 * Tests the complete cache revalidation workflow from WordPress webhooks
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'zawaya-revalidate-secret-2024'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

describe('Revalidation Workflow', () => {
  beforeAll(() => {
    console.log('Testing revalidation workflow...')
  })

  afterAll(() => {
    console.log('Revalidation workflow tests completed')
  })

  describe('API Endpoint Tests', () => {
    it('should respond to GET requests for testing', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate?secret=${REVALIDATION_SECRET}`)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.message).toBe('Revalidation API is working')
      expect(data.endpoints).toBeDefined()
    })

    it('should reject requests with invalid secret', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: 'invalid-secret',
          paths: ['/ar']
        })
      })
      
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Invalid secret')
    })

    it('should accept valid revalidation requests', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          paths: ['/ar', '/ar/articles'],
          tags: ['articles', 'homepage']
        })
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.revalidated.paths).toContain('/ar')
      expect(data.revalidated.paths).toContain('/ar/articles')
      expect(data.revalidated.tags).toContain('articles')
      expect(data.revalidated.tags).toContain('homepage')
    })
  })

  describe('Content Type Revalidation', () => {
    it('should revalidate article-related paths and tags', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          content_type: 'post',
          content_id: 123,
          action: 'publish'
        })
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.revalidated.paths).toContain('/ar')
      expect(data.revalidated.paths).toContain('/ar/articles')
      expect(data.revalidated.tags).toContain('articles')
      expect(data.revalidated.tags).toContain('article:123')
    })

    it('should revalidate program-related paths and tags', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          content_type: 'program',
          content_id: 456,
          action: 'update'
        })
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.revalidated.paths).toContain('/ar')
      expect(data.revalidated.paths).toContain('/ar/programs')
      expect(data.revalidated.tags).toContain('programs')
      expect(data.revalidated.tags).toContain('program:456')
    })

    it('should revalidate episode-related paths and tags', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          content_type: 'episode',
          content_id: 789,
          action: 'publish'
        })
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.revalidated.paths).toContain('/ar/programs')
      expect(data.revalidated.tags).toContain('episodes')
      expect(data.revalidated.tags).toContain('episode:789')
      expect(data.revalidated.tags).toContain('programs') // Parent program
    })

    it('should revalidate author-related paths and tags', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          content_type: 'user',
          content_id: 101,
          action: 'featured_toggle'
        })
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.revalidated.paths).toContain('/ar') // Homepage for featured
      expect(data.revalidated.paths).toContain('/ar/authors')
      expect(data.revalidated.tags).toContain('authors')
      expect(data.revalidated.tags).toContain('author:101')
    })
  })

  describe('Special Actions', () => {
    it('should handle featured content toggles', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          content_type: 'post',
          content_id: 123,
          action: 'featured_toggle'
        })
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.revalidated.paths).toContain('/ar') // Homepage always revalidated
    })

    it('should handle emergency cache clear', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          action: 'emergency_clear'
        })
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.action).toBe('emergency_clear')
      expect(data.revalidated.paths).toBeDefined()
      expect(data.revalidated.tags).toBeDefined()
    })
  })

  describe('Cascade Revalidation', () => {
    it('should handle cascade revalidation when enabled', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          tags: ['articles'],
          cascade: true
        })
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.revalidated.tags.length).toBeGreaterThan(1) // Should include cascaded tags
    })
  })

  describe('Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      })
      
      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toBe('Internal server error')
    })

    it('should log errors for invalid paths', async () => {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          paths: ['/invalid-path-that-does-not-exist']
        })
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      // Should still succeed but may have errors logged
    })
  })
})

describe('WordPress Integration Simulation', () => {
  it('should simulate WordPress article publish webhook', async () => {
    // Simulate the payload WordPress would send
    const wordpressPayload = {
      secret: REVALIDATION_SECRET,
      content_type: 'post',
      content_id: 123,
      content_slug: 'test-article',
      action: 'publish',
      paths: ['/ar', '/ar/articles', '/ar/articles/test-article'],
      tags: ['articles', 'article:123', 'homepage']
    }

    const response = await fetch(`${BASE_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'WordPress/6.0; https://zawaya.example.com'
      },
      body: JSON.stringify(wordpressPayload)
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.revalidated.paths).toEqual(expect.arrayContaining([
      '/ar', '/ar/articles'
    ]))
    expect(data.revalidated.tags).toEqual(expect.arrayContaining([
      'articles', 'article:123', 'homepage'
    ]))
  })

  it('should simulate WordPress program update webhook', async () => {
    const wordpressPayload = {
      secret: REVALIDATION_SECRET,
      content_type: 'program',
      content_id: 456,
      content_slug: 'test-program',
      action: 'update'
    }

    const response = await fetch(`${BASE_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'WordPress/6.0; https://zawaya.example.com'
      },
      body: JSON.stringify(wordpressPayload)
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.revalidated.tags).toContain('program:456')
  })
})