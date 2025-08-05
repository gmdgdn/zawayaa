#!/usr/bin/env node

/**
 * WordPress Migration Health Check
 * Monitors critical system components
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

class HealthMonitor {
  constructor() {
    this.checks = []
    this.results = {
      timestamp: new Date().toISOString(),
      overall: 'unknown',
      checks: {}
    }
  }

  async checkWordPressAPI() {
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL || process.env.WORDPRESS_URL
    if (!wpUrl) {
      return { status: 'error', message: 'WordPress URL not configured' }
    }

    try {
      const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=1`)
      const responseTime = response.headers.get('x-response-time') || 'unknown'
      
      return {
        status: response.ok ? 'healthy' : 'error',
        statusCode: response.status,
        responseTime,
        message: response.ok ? 'WordPress API accessible' : 'WordPress API error'
      }
    } catch (error) {
      return {
        status: 'error',
        message: `WordPress API unreachable: ${error.message}`
      }
    }
  }

  async checkApplicationHealth() {
    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    
    try {
      const response = await fetch(`${appUrl}/ar`)
      const loadTime = Date.now()
      
      return {
        status: response.ok ? 'healthy' : 'error',
        statusCode: response.status,
        loadTime: `${Date.now() - loadTime}ms`,
        message: response.ok ? 'Application accessible' : 'Application error'
      }
    } catch (error) {
      return {
        status: 'error',
        message: `Application unreachable: ${error.message}`
      }
    }
  }

  async checkRevalidationEndpoint() {
    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    
    try {
      const response = await fetch(`${appUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      // Should return 400 or 401 (not 404)
      const isConfigured = [400, 401].includes(response.status)
      
      return {
        status: isConfigured ? 'healthy' : 'error',
        statusCode: response.status,
        message: isConfigured ? 'Revalidation endpoint configured' : 'Revalidation endpoint missing'
      }
    } catch (error) {
      return {
        status: 'error',
        message: `Revalidation endpoint error: ${error.message}`
      }
    }
  }

  async checkEnvironmentVariables() {
    const requiredVars = [
      'NEXT_PUBLIC_WP_URL',
      'WP_USERNAME',
      'WP_APP_PASSWORD',
      'REVALIDATION_SECRET'
    ]
    
    const missing = requiredVars.filter(varName => !process.env[varName])
    
    return {
      status: missing.length === 0 ? 'healthy' : 'error',
      missing,
      message: missing.length === 0 
        ? 'All required environment variables configured'
        : `Missing environment variables: ${missing.join(', ')}`
    }
  }

  async runAllChecks() {
    console.log('🏥 Running WordPress Migration Health Checks')
    console.log('=' .repeat(45))
    
    const checks = {
      wordpress: await this.checkWordPressAPI(),
      application: await this.checkApplicationHealth(),
      revalidation: await this.checkRevalidationEndpoint(),
      environment: await this.checkEnvironmentVariables()
    }
    
    // Determine overall health
    const healthyChecks = Object.values(checks).filter(check => check.status === 'healthy').length
    const totalChecks = Object.keys(checks).length
    const healthPercentage = (healthyChecks / totalChecks) * 100
    
    let overallStatus = 'healthy'
    if (healthPercentage < 50) overallStatus = 'critical'
    else if (healthPercentage < 80) overallStatus = 'warning'
    
    this.results = {
      timestamp: new Date().toISOString(),
      overall: overallStatus,
      healthPercentage: Math.round(healthPercentage),
      checks
    }
    
    // Display results
    Object.entries(checks).forEach(([name, result]) => {
      const icon = result.status === 'healthy' ? '✅' : '❌'
      console.log(`${icon} ${name.toUpperCase()}: ${result.message}`)
      if (result.statusCode) console.log(`   Status Code: ${result.statusCode}`)
      if (result.responseTime) console.log(`   Response Time: ${result.responseTime}`)
      if (result.loadTime) console.log(`   Load Time: ${result.loadTime}`)
      if (result.missing && result.missing.length > 0) {
        console.log(`   Missing: ${result.missing.join(', ')}`)
      }
      console.log('')
    })
    
    console.log(`📊 Overall Health: ${overallStatus.toUpperCase()} (${healthPercentage}%)`)
    
    // Save results to file
    const logFile = `logs/health-check-${new Date().toISOString().split('T')[0]}.json`
    fs.writeFileSync(logFile, JSON.stringify(this.results, null, 2))
    console.log(`📝 Results saved to: ${logFile}`)
    
    return this.results
  }
}

// Run health checks if called directly
if (require.main === module) {
  const monitor = new HealthMonitor()
  monitor.runAllChecks().then(results => {
    process.exit(results.overall === 'critical' ? 1 : 0)
  }).catch(error => {
    console.error('Health check failed:', error)
    process.exit(1)
  })
}

module.exports = HealthMonitor