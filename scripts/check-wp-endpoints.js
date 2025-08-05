#!/usr/bin/env node

/**
 * WordPress Endpoints Check Script
 * Checks if WordPress REST API endpoints are accessible
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WP_URL || process.env.WORDPRESS_URL || 'https://zawaya.example.com'

async function checkEndpoint(endpoint, description) {
  const url = `${WORDPRESS_URL}/wp-json/wp/v2/${endpoint}`
  
  try {
    console.log(`🔍 ${description}`)
    console.log(`   URL: ${url}`)
    
    const response = await fetch(url)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ Status: ${response.status}`)
      
      if (Array.isArray(data)) {
        console.log(`   📊 Items: ${data.length}`)
        
        if (data.length > 0) {
          const sample = data[0]
          console.log(`   📝 Sample title: ${sample.title?.rendered || sample.name || 'N/A'}`)
          
          // Check for ACF fields
          if (sample.acf) {
            console.log(`   🏷️  ACF fields: ${Object.keys(sample.acf).length}`)
          } else {
            console.log(`   ⚠️  No ACF fields (may need authentication or configuration)`)
          }
        }
      } else if (data.name) {
        console.log(`   📝 Name: ${data.name}`)
        console.log(`   📄 Description: ${data.description}`)
      }
      
      return true
    } else {
      console.log(`   ❌ Status: ${response.status} ${response.statusText}`)
      return false
    }
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('🌐 WordPress Endpoints Check')
  console.log('============================')
  console.log(`WordPress URL: ${WORDPRESS_URL}`)
  console.log('')

  const endpoints = [
    { endpoint: '', description: 'WordPress REST API Root' },
    { endpoint: 'posts?per_page=3', description: 'Posts Endpoint' },
    { endpoint: 'program?per_page=3', description: 'Programs Custom Post Type' },
    { endpoint: 'episode?per_page=3', description: 'Episodes Custom Post Type' },
    { endpoint: 'users?per_page=3', description: 'Users Endpoint' },
    { endpoint: 'categories', description: 'Categories Endpoint' },
    { endpoint: 'tags', description: 'Tags Endpoint' },
    { endpoint: 'types', description: 'Post Types Info' },
    { endpoint: 'types/post', description: 'Post Type Details' },
    { endpoint: 'types/program', description: 'Program Type Details' },
    { endpoint: 'types/episode', description: 'Episode Type Details' }
  ]

  let passed = 0
  let failed = 0

  for (const { endpoint, description } of endpoints) {
    const success = await checkEndpoint(endpoint, description)
    if (success) {
      passed++
    } else {
      failed++
    }
    console.log('')
  }

  console.log('📊 Results Summary')
  console.log('==================')
  console.log(`✅ Accessible: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`)

  if (failed === 0) {
    console.log('')
    console.log('🎉 All endpoints are accessible!')
  } else {
    console.log('')
    console.log('⚠️  Some endpoints failed. This may be due to:')
    console.log('   - WordPress site not accessible')
    console.log('   - Custom post types not configured')
    console.log('   - REST API disabled')
    console.log('   - Authentication required for some endpoints')
  }

  console.log('')
  console.log('💡 Next steps:')
  console.log('   1. Run with actual WordPress credentials: scripts/verify-wordpress-config.js')
  console.log('   2. Check ACF field group settings in WordPress admin')
  console.log('   3. Verify custom post type configurations')
}

main()