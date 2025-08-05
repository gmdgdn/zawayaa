#!/usr/bin/env node

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
        message: `System health at ${healthResults.healthPercentage}% (threshold: ${this.thresholds.healthPercentage}%)`,
        details: healthResults.checks
      })
    }
    
    // Check page load times
    if (performanceResults && performanceResults.summary) {
      if (performanceResults.summary.maxPageLoadTime > this.thresholds.pageLoadTime) {
        alerts.push({
          level: 'warning',
          type: 'performance',
          message: `Page load time ${performanceResults.summary.maxPageLoadTime}ms exceeds threshold ${this.thresholds.pageLoadTime}ms`,
          details: performanceResults.pages
        })
      }
      
      // Check API response times
      if (performanceResults.summary.maxApiResponseTime > this.thresholds.apiResponseTime) {
        alerts.push({
          level: 'warning',
          type: 'performance',
          message: `API response time ${performanceResults.summary.maxApiResponseTime}ms exceeds threshold ${this.thresholds.apiResponseTime}ms`,
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
    console.log(`${icon} ${alert.level.toUpperCase()} ALERT: ${alert.message}`)
    
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
    
    console.log(`🔔 Processing ${alerts.length} alert(s)...`)
    
    const processedAlerts = []
    for (const alert of alerts) {
      const processed = await this.sendAlert(alert)
      processedAlerts.push(processed)
    }
    
    return processedAlerts
  }
}

module.exports = AlertSystem