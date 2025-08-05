#!/usr/bin/env node

/**
 * WordPress Migration Monitoring Setup
 * Sets up monitoring and alerting for the WordPress-only architecture
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 Setting up WordPress Migration Monitoring')
console.log('=' .repeat(50))

// Create monitoring directory structure
function createMonitoringStructure() {
  const dirs = [
    'monitoring',
    'monitoring/health-checks',
    'monitoring/performance',
    'monitoring/alerts',
    'logs'
  ]
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`✓ Created directory: ${dir}`)
    }
  })
}

// Create health check monitoring
function createHealthChecks() {
  const healthCheckScript = `#!/usr/bin/env node

/**
 * WordPress Migration Health Check
 * Monitors critical system components
 */

const fs = require('fs')

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
      const response = await fetch(\`\${wpUrl}/wp-json/wp/v2/posts?per_page=1\`)
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
        message: \`WordPress API unreachable: \${error.message}\`
      }
    }
  }

  async checkApplicationHealth() {
    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    
    try {
      const response = await fetch(\`\${appUrl}/ar\`)
      const loadTime = Date.now()
      
      return {
        status: response.ok ? 'healthy' : 'error',
        statusCode: response.status,
        loadTime: \`\${Date.now() - loadTime}ms\`,
        message: response.ok ? 'Application accessible' : 'Application error'
      }
    } catch (error) {
      return {
        status: 'error',
        message: \`Application unreachable: \${error.message}\`
      }
    }
  }

  async checkRevalidationEndpoint() {
    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    
    try {
      const response = await fetch(\`\${appUrl}/api/revalidate\`, {
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
        message: \`Revalidation endpoint error: \${error.message}\`
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
        : \`Missing environment variables: \${missing.join(', ')}\`
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
      console.log(\`\${icon} \${name.toUpperCase()}: \${result.message}\`)
      if (result.statusCode) console.log(\`   Status Code: \${result.statusCode}\`)
      if (result.responseTime) console.log(\`   Response Time: \${result.responseTime}\`)
      if (result.loadTime) console.log(\`   Load Time: \${result.loadTime}\`)
      if (result.missing && result.missing.length > 0) {
        console.log(\`   Missing: \${result.missing.join(', ')}\`)
      }
      console.log('')
    })
    
    console.log(\`📊 Overall Health: \${overallStatus.toUpperCase()} (\${healthPercentage}%)\`)
    
    // Save results to file
    const logFile = \`logs/health-check-\${new Date().toISOString().split('T')[0]}.json\`
    fs.writeFileSync(logFile, JSON.stringify(this.results, null, 2))
    console.log(\`📝 Results saved to: \${logFile}\`)
    
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

module.exports = HealthMonitor`

  fs.writeFileSync('monitoring/health-checks/wordpress-health.js', healthCheckScript)
  console.log('✓ Created WordPress health check script')
}

// Create performance monitoring
function createPerformanceMonitoring() {
  const performanceScript = `#!/usr/bin/env node

/**
 * WordPress Migration Performance Monitor
 * Monitors page load times and API response times
 */

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
      { url: \`\${baseUrl}/ar\`, name: 'Homepage' },
      { url: \`\${baseUrl}/ar/articles\`, name: 'Articles List' },
      { url: \`\${baseUrl}/ar/programs\`, name: 'Programs List' }
    ]
    
    console.log('📄 Testing Page Load Times...')
    for (const test of pageTests) {
      const result = await this.measurePageLoad(test.url, test.name)
      this.metrics.pages[test.name] = result
      
      const icon = result.ok ? '✅' : '❌'
      const time = result.ok ? \`\${result.loadTime}ms\` : 'Failed'
      console.log(\`\${icon} \${test.name}: \${time}\`)
    }
    
    // Test API response times
    if (wpUrl) {
      const apiTests = [
        { url: \`\${wpUrl}/wp-json/wp/v2/posts?per_page=5\`, name: 'WordPress Posts' },
        { url: \`\${wpUrl}/wp-json/wp/v2/users?per_page=5\`, name: 'WordPress Users' },
        { url: \`\${wpUrl}/wp-json/wp/v2/categories\`, name: 'WordPress Categories' }
      ]
      
      console.log('\\n🔌 Testing API Response Times...')
      for (const test of apiTests) {
        const result = await this.measureAPIResponse(test.url, test.name)
        this.metrics.apis[test.name] = result
        
        const icon = result.ok ? '✅' : '❌'
        const time = result.ok ? \`\${result.responseTime}ms\` : 'Failed'
        console.log(\`\${icon} \${test.name}: \${time}\`)
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
    
    console.log('\\n📊 Performance Summary:')
    console.log(\`   Average Page Load: \${this.metrics.summary.avgPageLoadTime}ms\`)
    console.log(\`   Max Page Load: \${this.metrics.summary.maxPageLoadTime}ms\`)
    console.log(\`   Average API Response: \${this.metrics.summary.avgApiResponseTime}ms\`)
    console.log(\`   Max API Response: \${this.metrics.summary.maxApiResponseTime}ms\`)
    
    // Save results
    const logFile = \`logs/performance-\${new Date().toISOString().split('T')[0]}.json\`
    require('fs').writeFileSync(logFile, JSON.stringify(this.metrics, null, 2))
    console.log(\`\\n📝 Results saved to: \${logFile}\`)
    
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

module.exports = PerformanceMonitor`

  fs.writeFileSync('monitoring/performance/wordpress-performance.js', performanceScript)
  console.log('✓ Created WordPress performance monitoring script')
}

// Create alerting system
function createAlertingSystem() {
  const alertScript = `#!/usr/bin/env node

/**
 * WordPress Migration Alert System
 * Sends alerts when critical thresholds are exceeded
 */

const fs = require('fs')

class AlertSystem {
  constructor() {
    this.thresholds = {
      pageLoadTime: 5000, // 5 seconds
      apiResponseTime: 3000, // 3 seconds
      errorRate: 0.05, // 5%
      healthPercentage: 80 // 80%
    }
    
    this.alerts = []
  }

  checkThresholds(healthResults, performanceResults) {
    const alerts = []
    
    // Check overall health
    if (healthResults.healthPercentage < this.thresholds.healthPercentage) {
      alerts.push({
        level: 'critical',
        type: 'health',
        message: \`System health at \${healthResults.healthPercentage}% (threshold: \${this.thresholds.healthPercentage}%)\`,
        details: healthResults.checks
      })
    }
    
    // Check page load times
    if (performanceResults && performanceResults.summary) {
      if (performanceResults.summary.maxPageLoadTime > this.thresholds.pageLoadTime) {
        alerts.push({
          level: 'warning',
          type: 'performance',
          message: \`Page load time \${performanceResults.summary.maxPageLoadTime}ms exceeds threshold \${this.thresholds.pageLoadTime}ms\`,
          details: performanceResults.pages
        })
      }
      
      // Check API response times
      if (performanceResults.summary.maxApiResponseTime > this.thresholds.apiResponseTime) {
        alerts.push({
          level: 'warning',
          type: 'performance',
          message: \`API response time \${performanceResults.summary.maxApiResponseTime}ms exceeds threshold \${this.thresholds.apiResponseTime}ms\`,
          details: performanceResults.apis
        })
      }
    }
    
    return alerts
  }

  async sendAlert(alert) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      ...alert
    }
    
    // Log alert to file
    const alertLog = 'logs/alerts.json'
    let alerts = []
    
    if (fs.existsSync(alertLog)) {
      alerts = JSON.parse(fs.readFileSync(alertLog, 'utf8'))
    }
    
    alerts.push(logEntry)
    fs.writeFileSync(alertLog, JSON.stringify(alerts, null, 2))
    
    // Console output
    const icon = alert.level === 'critical' ? '🚨' : '⚠️'
    console.log(\`\${icon} \${alert.level.toUpperCase()} ALERT: \${alert.message}\`)
    
    // In a real implementation, you would send emails, Slack messages, etc.
    // For now, we'll just log to console and file
    
    return logEntry
  }

  async processAlerts(healthResults, performanceResults) {
    const alerts = this.checkThresholds(healthResults, performanceResults)
    
    if (alerts.length === 0) {
      console.log('✅ No alerts triggered - system operating normally')
      return []
    }
    
    console.log(\`🔔 Processing \${alerts.length} alert(s)...\`)
    
    const processedAlerts = []
    for (const alert of alerts) {
      const processed = await this.sendAlert(alert)
      processedAlerts.push(processed)
    }
    
    return processedAlerts
  }
}

module.exports = AlertSystem`

  fs.writeFileSync('monitoring/alerts/alert-system.js', alertScript)
  console.log('✓ Created alerting system')
}

// Create monitoring dashboard
function createMonitoringDashboard() {
  const dashboardScript = `#!/usr/bin/env node

/**
 * WordPress Migration Monitoring Dashboard
 * Combines health checks, performance monitoring, and alerting
 */

const HealthMonitor = require('./health-checks/wordpress-health')
const PerformanceMonitor = require('./performance/wordpress-performance')
const AlertSystem = require('./alerts/alert-system')

class MonitoringDashboard {
  constructor() {
    this.healthMonitor = new HealthMonitor()
    this.performanceMonitor = new PerformanceMonitor()
    this.alertSystem = new AlertSystem()
  }

  async runFullMonitoring() {
    console.log('🖥️  WordPress Migration Monitoring Dashboard')
    console.log('=' .repeat(50))
    console.log(\`Started at: \${new Date().toISOString()}\`)
    console.log('')
    
    try {
      // Run health checks
      const healthResults = await this.healthMonitor.runAllChecks()
      console.log('')
      
      // Run performance tests
      const performanceResults = await this.performanceMonitor.runPerformanceTests()
      console.log('')
      
      // Process alerts
      const alerts = await this.alertSystem.processAlerts(healthResults, performanceResults)
      console.log('')
      
      // Summary
      console.log('📋 Monitoring Summary:')
      console.log(\`   Overall Health: \${healthResults.overall.toUpperCase()}\`)
      console.log(\`   Health Percentage: \${healthResults.healthPercentage}%\`)
      if (performanceResults.summary) {
        console.log(\`   Avg Page Load: \${performanceResults.summary.avgPageLoadTime}ms\`)
        console.log(\`   Avg API Response: \${performanceResults.summary.avgApiResponseTime}ms\`)
      }
      console.log(\`   Alerts Triggered: \${alerts.length}\`)
      
      return {
        health: healthResults,
        performance: performanceResults,
        alerts
      }
      
    } catch (error) {
      console.error('❌ Monitoring failed:', error)
      throw error
    }
  }
}

// Run monitoring if called directly
if (require.main === module) {
  const dashboard = new MonitoringDashboard()
  dashboard.runFullMonitoring().catch(error => {
    console.error('Dashboard failed:', error)
    process.exit(1)
  })
}

module.exports = MonitoringDashboard`

  fs.writeFileSync('monitoring/dashboard.js', dashboardScript)
  console.log('✓ Created monitoring dashboard')
}

// Create package.json scripts
function updatePackageScripts() {
  const packagePath = 'package.json'
  
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    
    // Add monitoring scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'monitor:health': 'node monitoring/health-checks/wordpress-health.js',
      'monitor:performance': 'node monitoring/performance/wordpress-performance.js',
      'monitor:dashboard': 'node monitoring/dashboard.js',
      'monitor:alerts': 'node monitoring/alerts/alert-system.js'
    }
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
    console.log('✓ Updated package.json with monitoring scripts')
  }
}

// Create cron job setup
function createCronSetup() {
  const cronScript = `#!/bin/bash

# WordPress Migration Monitoring Cron Jobs
# Add these to your crontab with: crontab -e

# Health check every 5 minutes
*/5 * * * * cd /path/to/your/project && npm run monitor:health >> logs/cron-health.log 2>&1

# Performance check every 15 minutes
*/15 * * * * cd /path/to/your/project && npm run monitor:performance >> logs/cron-performance.log 2>&1

# Full dashboard every hour
0 * * * * cd /path/to/your/project && npm run monitor:dashboard >> logs/cron-dashboard.log 2>&1

# Clean old logs daily
0 2 * * * find /path/to/your/project/logs -name "*.log" -mtime +7 -delete
0 2 * * * find /path/to/your/project/logs -name "*.json" -mtime +30 -delete`

  fs.writeFileSync('monitoring/setup-cron.sh', cronScript)
  console.log('✓ Created cron job setup script')
}

// Main setup function
async function setupMonitoring() {
  try {
    createMonitoringStructure()
    createHealthChecks()
    createPerformanceMonitoring()
    createAlertingSystem()
    createMonitoringDashboard()
    updatePackageScripts()
    createCronSetup()
    
    console.log('')
    console.log('🎉 WordPress Migration Monitoring Setup Complete!')
    console.log('')
    console.log('📋 Available Commands:')
    console.log('   npm run monitor:health      - Run health checks')
    console.log('   npm run monitor:performance - Run performance tests')
    console.log('   npm run monitor:dashboard   - Run full monitoring dashboard')
    console.log('')
    console.log('📁 Created Files:')
    console.log('   monitoring/health-checks/wordpress-health.js')
    console.log('   monitoring/performance/wordpress-performance.js')
    console.log('   monitoring/alerts/alert-system.js')
    console.log('   monitoring/dashboard.js')
    console.log('   monitoring/setup-cron.sh')
    console.log('')
    console.log('🔧 Next Steps:')
    console.log('   1. Test monitoring: npm run monitor:dashboard')
    console.log('   2. Set up cron jobs: bash monitoring/setup-cron.sh')
    console.log('   3. Configure alerting endpoints (email, Slack, etc.)')
    console.log('   4. Set up log rotation and cleanup')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run setup
setupMonitoring()