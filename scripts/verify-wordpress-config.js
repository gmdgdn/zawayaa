#!/usr/bin/env node

/**
 * WordPress Configuration Verification Script
 * Verifies ACF fields, custom post types, and authentication
 */

const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    
    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=')
          process.env[key] = value
        }
      }
    })
  }
}

// Load environment variables
loadEnvFile()

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WP_URL || process.env.WORDPRESS_URL || 'https://zawaya.example.com'
const WORDPRESS_USERNAME = process.env.WP_USERNAME || process.env.WORDPRESS_USERNAME
const WORDPRESS_APP_PASSWORD = process.env.WP_APP_PASSWORD || process.env.WORDPRESS_APP_PASSWORD

if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
  console.error('❌ Missing WordPress credentials')
  console.error('Please set WORDPRESS_USERNAME and WORDPRESS_APP_PASSWORD environment variables')
  process.exit(1)
}

// Create basic auth header
const auth = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}`).toString('base64')

async function makeRequest(endpoint, options = {}) {
  const url = `${WORDPRESS_URL}/wp-json/wp/v2/${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

async function verifyACFExposure() {
  console.log('🔍 Verifying ACF REST API Exposure')
  console.log('==================================')

  const tests = [
    {
      name: 'Posts with ACF fields',
      endpoint: 'posts?per_page=1&acf_format=standard',
      checkACF: true
    },
    {
      name: 'Programs with ACF fields',
      endpoint: 'programs?per_page=1&acf_format=standard',
      checkACF: true
    },
    {
      name: 'Episodes with ACF fields',
      endpoint: 'episodes?per_page=1&acf_format=standard',
      checkACF: true
    },
    {
      name: 'Users with ACF fields',
      endpoint: 'users?per_page=1&acf_format=standard',
      checkACF: true
    }
  ]

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      console.log(`📋 ${test.name}`)
      
      const data = await makeRequest(test.endpoint)
      
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0]
        console.log(`   ✅ Endpoint accessible: ${data.length} items found`)
        console.log(`   📄 Sample ID: ${item.id}`)
        console.log(`   📝 Sample title: ${item.title?.rendered || item.name || 'N/A'}`)
        
        if (test.checkACF) {
          if (item.acf) {
            console.log(`   ✅ ACF fields present: ${Object.keys(item.acf).length} fields`)
            
            // Show sample ACF fields
            const acfKeys = Object.keys(item.acf).slice(0, 5)
            if (acfKeys.length > 0) {
              console.log(`   🏷️  Sample ACF fields: ${acfKeys.join(', ')}`)
            }
          } else {
            console.log(`   ⚠️  ACF fields missing - check "Show in REST API" setting`)
            failed++
            continue
          }
        }
        
        passed++
      } else {
        console.log(`   ⚠️  No items found - endpoint may be empty`)
        passed++ // Still counts as working endpoint
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
      failed++
    }
    
    console.log('')
  }

  return { passed, failed }
}

async function verifyCustomPostTypes() {
  console.log('🏗️  Verifying Custom Post Types')
  console.log('==============================')

  const cptTests = [
    {
      name: 'Programs CPT',
      endpoint: 'programs',
      expectedFields: ['title', 'content', 'acf']
    },
    {
      name: 'Episodes CPT',
      endpoint: 'episodes',
      expectedFields: ['title', 'content', 'acf']
    }
  ]

  let passed = 0
  let failed = 0

  for (const test of cptTests) {
    try {
      console.log(`📦 ${test.name}`)
      
      // Test if endpoint exists
      const data = await makeRequest(`${test.endpoint}?per_page=1`)
      console.log(`   ✅ CPT endpoint accessible`)
      
      // Test if we can get the post type info
      try {
        const typeInfo = await makeRequest(`types/${test.endpoint.slice(0, -1)}`) // Remove 's' for singular
        console.log(`   ✅ CPT configuration accessible`)
        console.log(`   📝 Name: ${typeInfo.name}`)
        console.log(`   🔗 REST base: ${typeInfo.rest_base}`)
        console.log(`   🌐 Show in REST: ${typeInfo.rest_controller_class ? 'Yes' : 'No'}`)
      } catch (error) {
        console.log(`   ⚠️  CPT type info not accessible: ${error.message}`)
      }
      
      passed++
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
      console.log(`   💡 Ensure CPT has 'show_in_rest' => true`)
      failed++
    }
    
    console.log('')
  }

  return { passed, failed }
}

async function verifyAuthentication() {
  console.log('🔐 Verifying Authentication')
  console.log('===========================')

  try {
    console.log('🔑 Testing Application Password authentication')
    
    // Test with a simple endpoint that requires auth
    const data = await makeRequest('users/me')
    
    console.log(`   ✅ Authentication successful`)
    console.log(`   👤 User: ${data.name} (ID: ${data.id})`)
    console.log(`   📧 Email: ${data.email}`)
    console.log(`   🎭 Roles: ${data.roles?.join(', ') || 'None'}`)
    
    return { passed: 1, failed: 0 }
    
  } catch (error) {
    console.log(`   ❌ Authentication failed: ${error.message}`)
    console.log(`   💡 Check Application Password credentials`)
    return { passed: 0, failed: 1 }
  }
}

async function verifySpecificACFFields() {
  console.log('🏷️  Verifying Specific ACF Fields')
  console.log('=================================')

  const fieldTests = [
    {
      name: 'Article SCF Fields',
      endpoint: 'posts?per_page=1&acf_format=standard',
      expectedFields: [
        'title_arabic',
        'excerpt_arabic', 
        'content_arabic',
        'audio_narration_url',
        'reading_time_minutes',
        'category_color',
        'is_featured'
      ]
    },
    {
      name: 'Program SCF Fields',
      endpoint: 'programs?per_page=1&acf_format=standard',
      expectedFields: [
        'host_arabic',
        'program_type',
        'theme_color',
        'cover_image',
        'episode_count'
      ]
    },
    {
      name: 'Episode SCF Fields',
      endpoint: 'episodes?per_page=1&acf_format=standard',
      expectedFields: [
        'video_embed_url',
        'audio_file_url',
        'episode_thumbnail',
        'duration_seconds',
        'transcript_arabic'
      ]
    },
    {
      name: 'Author SCF Fields',
      endpoint: 'users?per_page=1&acf_format=standard',
      expectedFields: [
        'name_arabic',
        'job_title_arabic',
        'author_avatar',
        'is_featured_author'
      ]
    }
  ]

  let totalPassed = 0
  let totalFailed = 0

  for (const test of fieldTests) {
    try {
      console.log(`📋 ${test.name}`)
      
      const data = await makeRequest(test.endpoint)
      
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0]
        
        if (item.acf) {
          const availableFields = Object.keys(item.acf)
          const foundFields = test.expectedFields.filter(field => 
            availableFields.includes(field)
          )
          const missingFields = test.expectedFields.filter(field => 
            !availableFields.includes(field)
          )
          
          console.log(`   ✅ Found ${foundFields.length}/${test.expectedFields.length} expected fields`)
          
          if (foundFields.length > 0) {
            console.log(`   🟢 Available: ${foundFields.join(', ')}`)
          }
          
          if (missingFields.length > 0) {
            console.log(`   🔴 Missing: ${missingFields.join(', ')}`)
            console.log(`   💡 Add these fields to ACF and enable "Show in REST API"`)
          }
          
          totalPassed += foundFields.length
          totalFailed += missingFields.length
          
        } else {
          console.log(`   ❌ No ACF fields found`)
          totalFailed += test.expectedFields.length
        }
      } else {
        console.log(`   ⚠️  No content available to test fields`)
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
      totalFailed += test.expectedFields.length
    }
    
    console.log('')
  }

  return { passed: totalPassed, failed: totalFailed }
}

async function main() {
  console.log('🔍 WordPress Configuration Verification')
  console.log('=======================================')
  console.log(`WordPress URL: ${WORDPRESS_URL}`)
  console.log(`Username: ${WORDPRESS_USERNAME}`)
  console.log('')

  try {
    const authResults = await verifyAuthentication()
    console.log('')
    
    const acfResults = await verifyACFExposure()
    console.log('')
    
    const cptResults = await verifyCustomPostTypes()
    console.log('')
    
    const fieldResults = await verifySpecificACFFields()
    console.log('')

    // Summary
    const totalPassed = authResults.passed + acfResults.passed + cptResults.passed + fieldResults.passed
    const totalFailed = authResults.failed + acfResults.failed + cptResults.failed + fieldResults.failed
    
    console.log('📊 Verification Summary')
    console.log('=======================')
    console.log(`✅ Passed: ${totalPassed}`)
    console.log(`❌ Failed: ${totalFailed}`)
    console.log(`📈 Success Rate: ${Math.round((totalPassed / (totalPassed + totalFailed)) * 100)}%`)

    if (totalFailed === 0) {
      console.log('')
      console.log('🎉 All verifications passed! WordPress is properly configured.')
    } else {
      console.log('')
      console.log('⚠️  Some verifications failed. Please check the WordPress configuration.')
      console.log('')
      console.log('📝 Common fixes:')
      console.log('   1. Enable "Show in REST API" for all ACF field groups')
      console.log('   2. Set show_in_rest: true for custom post types')
      console.log('   3. Verify Application Password is correctly generated')
      console.log('   4. Check WordPress REST API is enabled')
      
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    process.exit(1)
  }
}

main()