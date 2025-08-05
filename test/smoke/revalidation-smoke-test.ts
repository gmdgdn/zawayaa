/**
 * Revalidation Smoke Test
 * Tests cache revalidation triggers and updates
 */

import { describe, it, expect } from 'vitest'

describe('Revalidation Smoke Tests', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000'
  const revalidateSecret = process.env.REVALIDATE_SECRET || 'test-secret'

  it('should trigger revalidation via webhook', async () => {
    // Test the revalidation endpoint
    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: revalidateSecret,
        paths: ['/ar', '/ar/articles'],
        tags: ['articles', 'homepage']
      })
    })

    expect(response.status).toBe(200)
    
    const result = await response.json()
    expect(result.revalidated).toBe(true)
    
    console.log('✓ Revalidation webhook responds correctly')
  })

  it('should reject invalid revalidation requests', async () => {
    // Test with wrong secret
    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'wrong-secret',
        paths: ['/ar']
      })
    })

    expect(response.status).toBe(401)
    console.log('✓ Invalid revalidation requests are rejected')
  })

  it('should handle revalidation without paths or tags', async () => {
    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: revalidateSecret
      })
    })

    expect(response.status).toBe(400)
    console.log('✓ Revalidation requires paths or tags')
  })

  it('should test cache behavior after revalidation', async () => {
    // First, get a page to establish cache
    const initialResponse = await fetch(`${baseUrl}/ar`)
    expect(initialResponse.status).toBe(200)
    
    const initialContent = await initialResponse.text()
    const initialTimestamp = Date.now()
    
    // Trigger revalidation
    await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: revalidateSecret,
        paths: ['/ar']
      })
    })

    // Wait a moment for revalidation to process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Get the page again
    const revalidatedResponse = await fetch(`${baseUrl}/ar`)
    expect(revalidatedResponse.status).toBe(200)
    
    console.log('✓ Page accessible after revalidation')
  })
})