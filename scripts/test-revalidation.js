#!/usr/bin/env node

/**
 * Manual Revalidation Workflow Test Script
 * Tests the revalidation API endpoint with various scenarios
 */

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'zawaya-revalidate-secret-2024'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function testRevalidationEndpoint() {
  console.log('🧪 Testing Revalidation Workflow')
  console.log('================================')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Secret: ${REVALIDATION_SECRET.substring(0, 10)}...`)
  console.log('')

  const tests = [
    {
      name: 'GET endpoint test',
      method: 'GET',
      url: `${BASE_URL}/api/revalidate?secret=${REVALIDATION_SECRET}`,
      expectedStatus: 200
    },
    {
      name: 'Invalid secret test',
      method: 'POST',
      url: `${BASE_URL}/api/revalidate`,
      body: { secret: 'invalid', paths: ['/ar'] },
      expectedStatus: 401
    },
    {
      name: 'Basic path revalidation',
      method: 'POST',
      url: `${BASE_URL}/api/revalidate`,
      body: {
        secret: REVALIDATION_SECRET,
        paths: ['/ar', '/ar/articles'],
        tags: ['homepage', 'articles']
      },
      expectedStatus: 200
    },
    {
      name: 'Article publish simulation',
      method: 'POST',
      url: `${BASE_URL}/api/revalidate`,
      body: {
        secret: REVALIDATION_SECRET,
        content_type: 'post',
        content_id: 123,
        content_slug: 'test-article',
        action: 'publish'
      },
      expectedStatus: 200
    },
    {
      name: 'Program update simulation',
      method: 'POST',
      url: `${BASE_URL}/api/revalidate`,
      body: {
        secret: REVALIDATION_SECRET,
        content_type: 'program',
        content_id: 456,
        action: 'update'
      },
      expectedStatus: 200
    },
    {
      name: 'Episode publish simulation',
      method: 'POST',
      url: `${BASE_URL}/api/revalidate`,
      body: {
        secret: REVALIDATION_SECRET,
        content_type: 'episode',
        content_id: 789,
        action: 'publish'
      },
      expectedStatus: 200
    },
    {
      name: 'Featured content toggle',
      method: 'POST',
      url: `${BASE_URL}/api/revalidate`,
      body: {
        secret: REVALIDATION_SECRET,
        content_type: 'post',
        content_id: 123,
        action: 'featured_toggle'
      },
      expectedStatus: 200
    },
    {
      name: 'Cascade revalidation test',
      method: 'POST',
      url: `${BASE_URL}/api/revalidate`,
      body: {
        secret: REVALIDATION_SECRET,
        tags: ['articles'],
        cascade: true
      },
      expectedStatus: 200
    }
  ]

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      console.log(`🔍 ${test.name}`)
      
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Zawaya-Test-Script/1.0'
        }
      }

      if (test.body) {
        options.body = JSON.stringify(test.body)
      }

      const response = await fetch(test.url, options)
      const data = await response.json()

      if (response.status === test.expectedStatus) {
        console.log(`   ✅ Status: ${response.status} (expected ${test.expectedStatus})`)
        
        if (response.status === 200 && data.success) {
          console.log(`   ✅ Success: ${data.success}`)
          
          if (data.revalidated) {
            console.log(`   📄 Paths: ${data.revalidated.paths?.length || 0}`)
            console.log(`   🏷️  Tags: ${data.revalidated.tags?.length || 0}`)
            
            if (data.revalidated.errors?.length > 0) {
              console.log(`   ⚠️  Errors: ${data.revalidated.errors.length}`)
              data.revalidated.errors.forEach(error => {
                console.log(`      - ${error}`)
              })
            }
          }
          
          if (data.duration) {
            console.log(`   ⏱️  Duration: ${data.duration}ms`)
          }
        }
        
        passed++
      } else {
        console.log(`   ❌ Status: ${response.status} (expected ${test.expectedStatus})`)
        console.log(`   📄 Response: ${JSON.stringify(data, null, 2)}`)
        failed++
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
      failed++
    }
    
    console.log('')
  }

  console.log('📊 Test Results')
  console.log('===============')
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`)

  if (failed === 0) {
    console.log('')
    console.log('🎉 All tests passed! Revalidation workflow is working correctly.')
  } else {
    console.log('')
    console.log('⚠️  Some tests failed. Please check the implementation.')
    process.exit(1)
  }
}

// WordPress webhook simulation
async function simulateWordPressWebhook() {
  console.log('')
  console.log('🔗 WordPress Webhook Simulation')
  console.log('===============================')

  const webhookPayloads = [
    {
      name: 'Article Published',
      payload: {
        secret: REVALIDATION_SECRET,
        content_type: 'post',
        content_id: 123,
        content_slug: 'new-article-published',
        action: 'publish',
        paths: ['/ar', '/ar/articles', '/ar/articles/new-article-published'],
        tags: ['articles', 'article:123', 'homepage']
      }
    },
    {
      name: 'Program Updated',
      payload: {
        secret: REVALIDATION_SECRET,
        content_type: 'program',
        content_id: 456,
        content_slug: 'updated-program',
        action: 'update'
      }
    },
    {
      name: 'Featured Article Toggle',
      payload: {
        secret: REVALIDATION_SECRET,
        content_type: 'post',
        content_id: 789,
        action: 'featured_toggle'
      }
    }
  ]

  for (const webhook of webhookPayloads) {
    console.log(`📡 ${webhook.name}`)
    
    try {
      const response = await fetch(`${BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'WordPress/6.0; https://zawaya.example.com'
        },
        body: JSON.stringify(webhook.payload)
      })

      const data = await response.json()

      if (response.status === 200 && data.success) {
        console.log(`   ✅ Webhook processed successfully`)
        console.log(`   📄 Revalidated paths: ${data.revalidated.paths?.join(', ') || 'none'}`)
        console.log(`   🏷️  Revalidated tags: ${data.revalidated.tags?.join(', ') || 'none'}`)
      } else {
        console.log(`   ❌ Webhook failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    console.log('')
  }
}

// Run tests
async function main() {
  try {
    await testRevalidationEndpoint()
    await simulateWordPressWebhook()
  } catch (error) {
    console.error('Test script failed:', error)
    process.exit(1)
  }
}

main()