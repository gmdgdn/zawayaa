/**
 * Revalidation Logging and Monitoring System
 * Tracks cache revalidation events, errors, and performance metrics
 */

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// Revalidation event types
export enum RevalidationEventType {
  REQUEST_RECEIVED = 'request_received',
  VALIDATION_FAILED = 'validation_failed',
  REVALIDATION_STARTED = 'revalidation_started',
  PATH_REVALIDATED = 'path_revalidated',
  TAG_REVALIDATED = 'tag_revalidated',
  CASCADE_TRIGGERED = 'cascade_triggered',
  REVALIDATION_COMPLETED = 'revalidation_completed',
  REVALIDATION_FAILED = 'revalidation_failed',
  EMERGENCY_CLEAR = 'emergency_clear'
}

// Revalidation log entry interface
interface RevalidationLogEntry {
  timestamp: string
  level: LogLevel
  event: RevalidationEventType
  message: string
  data?: Record<string, any>
  duration?: number
  error?: {
    message: string
    stack?: string
    code?: string
  }
}

// Performance metrics
interface RevalidationMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  pathsRevalidated: number
  tagsRevalidated: number
  cascadeEvents: number
  emergencyClears: number
  lastActivity: string
  errorsByType: Record<string, number>
}

/**
 * Revalidation Logger Class
 */
export class RevalidationLogger {
  private static logs: RevalidationLogEntry[] = []
  private static metrics: RevalidationMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    pathsRevalidated: 0,
    tagsRevalidated: 0,
    cascadeEvents: 0,
    emergencyClears: 0,
    lastActivity: new Date().toISOString(),
    errorsByType: {}
  }
  private static maxLogEntries = 1000 // Keep last 1000 entries

  /**
   * Log a revalidation event
   */
  static log(
    level: LogLevel,
    event: RevalidationEventType,
    message: string,
    data?: Record<string, any>,
    duration?: number,
    error?: Error
  ) {
    const entry: RevalidationLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      message,
      data,
      duration,
      error: error ? {
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      } : undefined
    }

    // Add to logs array
    this.logs.push(entry)

    // Trim logs if exceeding max entries
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries)
    }

    // Update metrics
    this.updateMetrics(entry)

    // Console logging based on environment
    if (process.env.NODE_ENV === 'development' || level === LogLevel.ERROR) {
      const logMethod = level === LogLevel.ERROR ? console.error : 
                      level === LogLevel.WARN ? console.warn : console.log
      
      logMethod(`[REVALIDATION] ${event}: ${message}`, data || '', error || '')
    }

    // In production, you might want to send to external logging service
    if (process.env.NODE_ENV === 'production' && level === LogLevel.ERROR) {
      this.sendToExternalLogger(entry)
    }
  }

  /**
   * Update performance metrics
   */
  private static updateMetrics(entry: RevalidationLogEntry) {
    this.metrics.lastActivity = entry.timestamp

    switch (entry.event) {
      case RevalidationEventType.REQUEST_RECEIVED:
        this.metrics.totalRequests++
        break
      
      case RevalidationEventType.REVALIDATION_COMPLETED:
        this.metrics.successfulRequests++
        if (entry.duration) {
          // Update average response time
          const total = this.metrics.averageResponseTime * (this.metrics.successfulRequests - 1)
          this.metrics.averageResponseTime = (total + entry.duration) / this.metrics.successfulRequests
        }
        break
      
      case RevalidationEventType.REVALIDATION_FAILED:
        this.metrics.failedRequests++
        if (entry.error) {
          const errorType = entry.error.code || 'unknown'
          this.metrics.errorsByType[errorType] = (this.metrics.errorsByType[errorType] || 0) + 1
        }
        break
      
      case RevalidationEventType.PATH_REVALIDATED:
        this.metrics.pathsRevalidated++
        break
      
      case RevalidationEventType.TAG_REVALIDATED:
        this.metrics.tagsRevalidated++
        break
      
      case RevalidationEventType.CASCADE_TRIGGERED:
        this.metrics.cascadeEvents++
        break
      
      case RevalidationEventType.EMERGENCY_CLEAR:
        this.metrics.emergencyClears++
        break
    }
  }

  /**
   * Send critical errors to external logging service
   */
  private static async sendToExternalLogger(entry: RevalidationLogEntry) {
    // Implement external logging service integration here
    // Examples: Sentry, LogRocket, DataDog, etc.
    
    try {
      // Example implementation (replace with your logging service)
      if (process.env.EXTERNAL_LOGGING_ENDPOINT) {
        await fetch(process.env.EXTERNAL_LOGGING_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXTERNAL_LOGGING_TOKEN}`
          },
          body: JSON.stringify({
            service: 'zawaya-revalidation',
            level: entry.level,
            message: entry.message,
            data: entry.data,
            error: entry.error,
            timestamp: entry.timestamp
          })
        })
      }
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  /**
   * Get recent logs
   */
  static getLogs(limit = 100, level?: LogLevel): RevalidationLogEntry[] {
    let filteredLogs = this.logs

    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level)
    }

    return filteredLogs.slice(-limit).reverse() // Most recent first
  }

  /**
   * Get performance metrics
   */
  static getMetrics(): RevalidationMetrics {
    return { ...this.metrics }
  }

  /**
   * Get error summary
   */
  static getErrorSummary(): {
    totalErrors: number
    errorRate: number
    recentErrors: RevalidationLogEntry[]
    errorsByType: Record<string, number>
  } {
    const recentErrors = this.logs
      .filter(log => log.level === LogLevel.ERROR)
      .slice(-10)
      .reverse()

    return {
      totalErrors: this.metrics.failedRequests,
      errorRate: this.metrics.totalRequests > 0 
        ? this.metrics.failedRequests / this.metrics.totalRequests 
        : 0,
      recentErrors,
      errorsByType: { ...this.metrics.errorsByType }
    }
  }

  /**
   * Clear logs (for maintenance)
   */
  static clearLogs() {
    this.logs = []
    console.log('Revalidation logs cleared')
  }

  /**
   * Reset metrics (for maintenance)
   */
  static resetMetrics() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      pathsRevalidated: 0,
      tagsRevalidated: 0,
      cascadeEvents: 0,
      emergencyClears: 0,
      lastActivity: new Date().toISOString(),
      errorsByType: {}
    }
    console.log('Revalidation metrics reset')
  }

  /**
   * Health check based on recent activity
   */
  static getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy'
    details: {
      recentErrors: number
      errorRate: number
      lastActivity: string
      avgResponseTime: number
    }
  } {
    const recentErrorCount = this.logs
      .filter(log => 
        log.level === LogLevel.ERROR && 
        new Date(log.timestamp) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
      ).length

    const errorRate = this.metrics.totalRequests > 0 
      ? this.metrics.failedRequests / this.metrics.totalRequests 
      : 0

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'

    if (recentErrorCount > 5 || errorRate > 0.5) {
      status = 'unhealthy'
    } else if (recentErrorCount > 2 || errorRate > 0.2 || this.metrics.averageResponseTime > 5000) {
      status = 'degraded'
    }

    return {
      status,
      details: {
        recentErrors: recentErrorCount,
        errorRate,
        lastActivity: this.metrics.lastActivity,
        avgResponseTime: this.metrics.averageResponseTime
      }
    }
  }
}

// Convenience logging functions
export const logRevalidationEvent = (
  event: RevalidationEventType,
  message: string,
  data?: Record<string, any>,
  duration?: number
) => {
  RevalidationLogger.log(LogLevel.INFO, event, message, data, duration)
}

export const logRevalidationError = (
  event: RevalidationEventType,
  message: string,
  error: Error,
  data?: Record<string, any>
) => {
  RevalidationLogger.log(LogLevel.ERROR, event, message, data, undefined, error)
}

export const logRevalidationWarning = (
  event: RevalidationEventType,
  message: string,
  data?: Record<string, any>
) => {
  RevalidationLogger.log(LogLevel.WARN, event, message, data)
}

export const logRevalidationDebug = (
  event: RevalidationEventType,
  message: string,
  data?: Record<string, any>
) => {
  RevalidationLogger.log(LogLevel.DEBUG, event, message, data)
}