/**
 * Performance Optimization Service for Arabic Content
 * Handles caching, image optimization, and Core Web Vitals improvements
 */

export interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
}

export interface CacheConfig {
  maxAge: number
  staleWhileRevalidate: number
  tags: string[]
}

export class PerformanceService {
  /**
   * Generate cache headers for Arabic content
   */
  generateCacheHeaders(type: 'static' | 'dynamic' | 'api', customConfig?: Partial<CacheConfig>): HeadersInit {
    const configs = {
      static: {
        maxAge: 31536000, // 1 year
        staleWhileRevalidate: 86400, // 1 day
        tags: ['static'],
      },
      dynamic: {
        maxAge: 3600, // 1 hour
        staleWhileRevalidate: 86400, // 1 day
        tags: ['content'],
      },
      api: {
        maxAge: 300, // 5 minutes
        staleWhileRevalidate: 600, // 10 minutes
        tags: ['api'],
      },
    }

    const config = { ...configs[type], ...customConfig }

    return {
      'Cache-Control': `public, max-age=${config.maxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`,
      'CDN-Cache-Control': `public, max-age=${config.maxAge}`,
      'Vercel-CDN-Cache-Control': `public, max-age=${config.maxAge}`,
      'Cache-Tag': config.tags.join(','),
    }
  }

  /**
   * Optimize images for Arabic content
   */
  optimizeImageUrl(
    url: string, 
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'avif' | 'jpeg' | 'png'
      fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
    } = {}
  ): string {
    if (!url || url.startsWith('data:')) return url

    const {
      width = 800,
      height,
      quality = 85,
      format = 'webp',
      fit = 'cover'
    } = options

    // If using Vercel Image Optimization
    if (process.env.VERCEL) {
      const params = new URLSearchParams({
        url: encodeURIComponent(url),
        w: width.toString(),
        q: quality.toString(),
        ...(height && { h: height.toString() }),
        ...(format && { f: format }),
      })
      
      return `/_next/image?${params.toString()}`
    }

    // If using WordPress media, add transformation parameters
    if (url.includes('wp-content')) {
      const params = new URLSearchParams({
        width: width.toString(),
        quality: quality.toString(),
        format,
        resize: fit,
        ...(height && { height: height.toString() }),
      })
      
      return `${url}?${params.toString()}`
    }

    return url
  }

  /**
   * Generate responsive image srcSet for Arabic content
   */
  generateResponsiveImageSrcSet(url: string, sizes: number[] = [320, 640, 768, 1024, 1280, 1920]): string {
    return sizes
      .map(size => `${this.optimizeImageUrl(url, { width: size })} ${size}w`)
      .join(', ')
  }

  /**
   * Preload critical resources for Arabic content
   */
  generatePreloadLinks(resources: Array<{
    href: string
    as: 'style' | 'script' | 'font' | 'image' | 'audio' | 'video'
    type?: string
    crossorigin?: boolean
  }>): string {
    return resources
      .map(resource => {
        const attrs = [
          `rel="preload"`,
          `href="${resource.href}"`,
          `as="${resource.as}"`,
          ...(resource.type ? [`type="${resource.type}"`] : []),
          ...(resource.crossorigin ? ['crossorigin'] : []),
        ]
        return `<link ${attrs.join(' ')} />`
      })
      .join('\n')
  }

  /**
   * Generate font preload links for Arabic fonts
   */
  generateArabicFontPreloads(): string {
    const arabicFonts = [
      {
        href: '/fonts/ge-ss-two-light.woff2',
        as: 'font' as const,
        type: 'font/woff2',
        crossorigin: true,
      },
      {
        href: '/fonts/ge-ss-two-medium.woff2',
        as: 'font' as const,
        type: 'font/woff2',
        crossorigin: true,
      },
      {
        href: '/fonts/ge-ss-two-bold.woff2',
        as: 'font' as const,
        type: 'font/woff2',
        crossorigin: true,
      },
    ]

    return this.generatePreloadLinks(arabicFonts)
  }

  /**
   * Measure and report Core Web Vitals
   */
  measureWebVitals(): Promise<PerformanceMetrics> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve({
          loadTime: 0,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
          firstInputDelay: 0,
          timeToInteractive: 0,
        })
        return
      }

      const metrics: Partial<PerformanceMetrics> = {}

      // Load Time
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart
      })

      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime
          }
        }
      })
      observer.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        metrics.largestContentfulPaint = lastEntry.startTime
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Cumulative Layout Shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        metrics.cumulativeLayoutShift = clsValue
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          metrics.firstInputDelay = (entry as any).processingStart - entry.startTime
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Time to Interactive (approximation)
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        metrics.timeToInteractive = navigation.domInteractive - navigation.navigationStart

        resolve({
          loadTime: metrics.loadTime || 0,
          firstContentfulPaint: metrics.firstContentfulPaint || 0,
          largestContentfulPaint: metrics.largestContentfulPaint || 0,
          cumulativeLayoutShift: metrics.cumulativeLayoutShift || 0,
          firstInputDelay: metrics.firstInputDelay || 0,
          timeToInteractive: metrics.timeToInteractive || 0,
        })
      }, 5000) // Wait 5 seconds to collect metrics
    })
  }

  /**
   * Report Web Vitals to analytics
   */
  async reportWebVitals(metrics: PerformanceMetrics, page: string): Promise<void> {
    try {
      await fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page,
          metrics,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error('Failed to report web vitals:', error)
    }
  }

  /**
   * Optimize Arabic text rendering
   */
  generateArabicTextOptimizations(): string {
    return `
      <style>
        /* Optimize Arabic text rendering */
        [lang="ar"], .arabic-text {
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1, "pnum" 1, "tnum" 0, "onum" 1, "lnum" 0, "dlig" 0;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-variant-ligatures: common-ligatures;
          font-variant-numeric: oldstyle-nums;
        }

        /* Improve Arabic line height and spacing */
        .arabic-content {
          line-height: 1.8;
          letter-spacing: 0.02em;
          word-spacing: 0.1em;
        }

        /* Optimize for RTL layout */
        [dir="rtl"] {
          text-align: right;
        }

        /* Prevent layout shifts during font loading */
        .font-ge-ss {
          font-display: swap;
          size-adjust: 100%;
        }

        /* Critical CSS for above-the-fold content */
        .hero-section {
          contain: layout style paint;
        }

        /* Optimize images for Core Web Vitals */
        img {
          content-visibility: auto;
          contain-intrinsic-size: 300px 200px;
        }

        /* Reduce layout shift for dynamic content */
        .dynamic-content {
          min-height: 200px;
          contain: layout;
        }
      </style>
    `
  }

  /**
   * Generate critical CSS for Arabic content
   */
  generateCriticalCSS(): string {
    return `
      /* Critical CSS for Arabic content - inline in head */
      html { font-family: system-ui, -apple-system, sans-serif; }
      body { margin: 0; padding: 0; }
      [dir="rtl"] { text-align: right; }
      .font-ge-ss { font-family: 'GE SS Two', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    `
  }

  /**
   * Generate service worker for caching Arabic content
   */
  generateServiceWorkerConfig(): object {
    return {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          urlPattern: /\/api\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 5, // 5 minutes
            },
          },
        },
      ],
    }
  }
}

// Export singleton instance
export const performanceService = new PerformanceService()

// Export types
export type { PerformanceMetrics, CacheConfig }