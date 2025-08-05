#!/usr/bin/env node

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
    console.log(`Started at: ${new Date().toISOString()}`)
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
      console.log(`   Overall Health: ${healthResults.overall.toUpperCase()}`)
      console.log(`   Health Percentage: ${healthResults.healthPercentage}%`)
      if (performanceResults.summary) {
        console.log(`   Avg Page Load: ${performanceResults.summary.avgPageLoadTime}ms`)
        console.log(`   Avg API Response: ${performanceResults.summary.avgApiResponseTime}ms`)
      }
      console.log(`   Alerts Triggered: ${alerts.length}`)
      
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

module.exports = MonitoringDashboard