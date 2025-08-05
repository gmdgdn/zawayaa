#!/usr/bin/env node

/**
 * WordPress Migration Performance Monitor
 * Monitors page load times and API response times
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

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      pages: {},
      apis: {},
      summary: {}
    }
  }

  async measurePageLoad(url, name) {
    const start = Date.now()
    
    try {
      const response = await fetch(url)
      const loadTime = Date.now() - start
      
      return {
        name,
        url,
        loadTime,
        status: response.status,
        ok: response.ok,
        size: response.headers.get('content-length') || 'unknown'
      }
    } catch (error) {
      return {
        name,
        url,
        loadTime: Date.now() - start,
        status: 'error',
        ok: false,
        error: error.message
      }
    }
  }

  async measureAPIResponse(url, name) {
    const start = Date.now()
    
    try {
      const response = await fetch(url)
      const responseTime = Date.now() - start
      const data = await response.json()
      
      return {
        name,
        url,
        responseTime,
        status: response.status,
        ok: response.ok,
        dataSize: JSON.stringify(data).length,
        itemCount: Array.isArray(data) ? data.length : 1
      }
    } catch (error) {
      return {
        name,
        url,
        responseTime: Date.now() - start,
        status: 'error',
        ok: false,
        error: error.message
      }
    }
  }

  async runPerformanceTests() {
    console.log('⚡ Running WordPress Migration Performance Tests')
    console.log('=' .repeat(50))
    
    const baseUrl = process.env.APP_URL || 'http://localhost:3000'
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL || process.env.WORDPRESS_URL
    
    // Test page load times
    const pageTests = [
      { url: `${baseUrl}/ar`, name: 'Homepage' },
      { url: `${baseUrl}/ar/articles`, name: 'Articles List' },
      { url: `${baseUrl}/ar/programs`, name: 'Programs List' }
    ]
    
    console.log('📄 Testing Page Load Times...')
    for (const test of pageTests) {
      const result = await this.measurePageLoad(test.url, test.name)
      this.metrics.pages[test.name] = result
      
      const icon = result.ok ? '✅' : '❌'
      const time = result.ok ? `${result.loadTime}ms` : 'Failed'
      console.log(`${icon} ${test.name}: ${time}`)
    }
    
    // Test API response times
    if (wpUrl) {
      const apiTests = [
        { url: `${wpUrl}/wp-json/wp/v2/posts?per_page=5`, name: 'WordPress Posts' },
        { url: `${wpUrl}/wp-json/wp/v2/users?per_page=5`, name: 'WordPress Users' },
        { url: `${wpUrl}/wp-json/wp/v2/categories`, name: 'WordPress Categories' }
      ]
      
      console.log('\n🔌 Testing API Response Times...')
      for (const test of apiTests) {
        const result = await this.measureAPIResponse(test.url, test.name)
        this.metrics.apis[test.name] = result
        
        const icon = result.ok ? '✅' : '❌'
        const time = result.ok ? `${result.responseTime}ms` : 'Failed'
        console.log(`${icon} ${test.name}: ${time}`)
      }
    }
    
    // Calculate summary metrics
    const pageLoadTimes = Object.values(this.metrics.pages)
      .filter(p => p.ok)
      .map(p => p.loadTime)
    
    const apiResponseTimes = Object.values(this.metrics.apis)
      .filter(a => a.ok)
      .map(a => a.responseTime)
    
    this.metrics.summary = {
      avgPageLoadTime: pageLoadTimes.length > 0 
        ? Math.round(pageLoadTimes.reduce((a, b) => a + b, 0) / pageLoadTimes.length)
        : 0,
      maxPageLoadTime: pageLoadTimes.length > 0 ? Math.max(...pageLoadTimes) : 0,
      avgApiResponseTime: apiResponseTimes.length > 0
        ? Math.round(apiResponseTimes.reduce((a, b) => a + b, 0) / apiResponseTimes.length)
        : 0,
      maxApiResponseTime: apiResponseTimes.length > 0 ? Math.max(...apiResponseTimes) : 0,
      pagesHealthy: Object.values(this.metrics.pages).filter(p => p.ok).length,
      apiHealthy: Object.values(this.metrics.apis).filter(a => a.ok).length
    }
    
    console.log('\n📊 Performance Summary:')
    console.log(`   Average Page Load: ${this.metrics.summary.avgPageLoadTime}ms`)
    console.log(`   Max Page Load: ${this.metrics.summary.maxPageLoadTime}ms`)
    console.log(`   Average API Response: ${this.metrics.summary.avgApiResponseTime}ms`)
    console.log(`   Max API Response: ${this.metrics.summary.maxApiResponseTime}ms`)
    
    // Save results
    const logFile = `logs/performance-${new Date().toISOString().split('T')[0]}.json`
    require('fs').writeFileSync(logFile, JSON.stringify(this.metrics, null, 2))
    console.log(`\n📝 Results saved to: ${logFile}`)
    
    return this.metrics
  }
}

// Run performance tests if called directly
if (require.main === module) {
  const monitor = new PerformanceMonitor()
  monitor.runPerformanceTests().catch(error => {
    console.error('Performance test failed:', error)
    process.exit(1)
  })
}

module.exports = PerformanceMonitor