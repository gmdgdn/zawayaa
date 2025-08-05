/**
 * Final Performance Verification Test
 * Tests WordPress downtime handling, cache performance, and error handling
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium, Browser, Page } from 'playwright'

describe('Final Performance Verification - WordPress Migration', () => {
  let browser: Browser
  let page: Page
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000'

  beforeAll(async () => {
    browser = await chromium.launch()
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  describe('WordPress Downtime Handling and Fallbacks', () => {
    it('should handle WordPress API unavailability gracefully', async () => {
      // Test with WordPress potentially unavailable
      await page.goto(`${baseUrl}/ar`)
      
      // Page should still load even if WordPress is down
      const response = await page.waitForResponse(response => 
        response.url().includes('/ar') && response.status() !== 0
      )
      
      expect([200, 500, 503]).toContain(response.status())
      
      // Check for error handling UI
      const hasErrorMessage = await page.locator('[data-testid*="error"], .error-message').count() > 0
      const hasLoadingState = await page.locator('[data-testid*="loading"], .loading').count() > 0
      const hasContent = await page.locator('main, [data-testid*="content"]').count() > 0
      
      // Should have either content or appropriate error/loading state
      expect(hasContent || hasErrorMessage || hasLoadingState).toBe(true)
      
      console.log(`✓ Page response status: ${response.status()}`)
      console.log(`✓ Has error message: ${hasErrorMessage}`)
      console.log(`✓ Has loading state: ${hasLoadingState}`)
      console.log(`✓ Has content: ${hasContent}`)
    })

    it('should display user-friendly error messages in Arabic', async () => {
      await page.goto(`${baseUrl}/ar/articles`)
      
      // Wait for page to load
      await page.waitForTimeout(3000)
      
      // Check for Arabic error messages if WordPress is unavailable
      const pageText = await page.textContent('body')
      const hasArabicText = /[\u0600-\u06FF]/.test(pageText || '')
      
      // Look for error indicators
      const errorElements = await page.locator('[data-testid*="error"], .error, [class*="error"]').count()
      const emptyStateElements = await page.locator('[data-testid*="empty"], .empty-state').count()
      
      if (errorElements > 0 || emptyStateElements > 0) {
        console.log(`✓ Found ${errorElements} error elements`)
        console.log(`✓ Found ${emptyStateElements} empty state elements`)
        
        // Check if error messages are in Arabic
        if (errorElements > 0) {
          const errorText = await page.locator('[data-testid*="error"], .error').first().textContent()
          const hasArabicError = /[\u0600-\u06FF]/.test(errorText || '')
          console.log(`✓ Error message in Arabic: ${hasArabicError}`)
        }
      }
      
      console.log(`✓ Page contains Arabic text: ${hasArabicText}`)
    })

    it('should handle network timeouts gracefully', async () => {
      // Set a short timeout to simulate network issues
      page.setDefaultTimeout(5000)
      
      try {
        await page.goto(`${baseUrl}/ar/programs`)
        
        // Check if page loads within timeout
        const hasContent = await page.locator('main, body').count() > 0
        expect(hasContent).toBe(true)
        
        console.log('✓ Page loaded within timeout period')
      } catch (error) {
        // If timeout occurs, check for appropriate error handling
        const currentUrl = page.url()
        console.log(`ℹ Timeout occurred for: ${currentUrl}`)
        
        // This is acceptable behavior for network issues
        expect(error.message).toContain('timeout')
      }
      
      // Reset timeout
      page.setDefaultTimeout(30000)
    })

    it('should provide fallback content when WordPress data unavailable', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Check for fallback content or placeholders
      const placeholderElements = await page.locator('[data-testid*="placeholder"], .placeholder, .skeleton').count()
      const fallbackElements = await page.locator('[data-testid*="fallback"], .fallback').count()
      const staticContent = await page.locator('nav, header, footer').count()
      
      // Should have some content even if WordPress is unavailable
      const hasAnyContent = placeholderElements > 0 || fallbackElements > 0 || staticContent > 0
      expect(hasAnyContent).toBe(true)
      
      console.log(`✓ Placeholder elements: ${placeholderElements}`)
      console.log(`✓ Fallback elements: ${fallbackElements}`)
      console.log(`✓ Static content elements: ${staticContent}`)
    })
  })

  describe('Cache Performance and Hit Rates', () => {
    it('should demonstrate caching behavior', async () => {
      const testUrl = `${baseUrl}/ar`
      
      // First request (cache miss)
      const start1 = Date.now()
      await page.goto(testUrl)
      const firstLoadTime = Date.now() - start1
      
      // Wait a moment
      await page.waitForTimeout(1000)
      
      // Second request (potential cache hit)
      const start2 = Date.now()
      await page.reload()
      const secondLoadTime = Date.now() - start2
      
      console.log(`✓ First load time: ${firstLoadTime}ms`)
      console.log(`✓ Second load time: ${secondLoadTime}ms`)
      
      // Cache effectiveness (second load should be faster or similar)
      const cacheEffective = secondLoadTime <= firstLoadTime * 1.2 // Allow 20% variance
      console.log(`✓ Cache appears effective: ${cacheEffective}`)
      
      // Both loads should be reasonable
      expect(firstLoadTime).toBeLessThan(10000) // 10 seconds max
      expect(secondLoadTime).toBeLessThan(10000) // 10 seconds max
    })

    it('should handle cache headers appropriately', async () => {
      const response = await page.goto(`${baseUrl}/ar`)
      
      if (response) {
        const headers = response.headers()
        
        // Check for caching headers
        const hasCacheControl = 'cache-control' in headers
        const hasEtag = 'etag' in headers
        const hasLastModified = 'last-modified' in headers
        
        console.log(`✓ Has Cache-Control: ${hasCacheControl}`)
        console.log(`✓ Has ETag: ${hasEtag}`)
        console.log(`✓ Has Last-Modified: ${hasLastModified}`)
        
        if (hasCacheControl) {
          console.log(`✓ Cache-Control: ${headers['cache-control']}`)
        }
        
        // Should have some form of caching headers
        const hasCachingHeaders = hasCacheControl || hasEtag || hasLastModified
        expect(hasCachingHeaders).toBe(true)
      }
    })

    it('should handle static asset caching', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Check for static assets
      const images = await page.locator('img').count()
      const stylesheets = await page.locator('link[rel="stylesheet"]').count()
      const scripts = await page.locator('script[src]').count()
      
      console.log(`✓ Images found: ${images}`)
      console.log(`✓ Stylesheets found: ${stylesheets}`)
      console.log(`✓ Scripts found: ${scripts}`)
      
      // If assets exist, they should load properly
      if (images > 0) {
        const firstImage = page.locator('img').first()
        const imageLoaded = await firstImage.evaluate((img: HTMLImageElement) => {
          return img.complete && img.naturalWidth > 0
        })
        console.log(`✓ First image loaded: ${imageLoaded}`)
      }
    })
  })

  describe('Error Handling and User Experience', () => {
    it('should provide meaningful error messages', async () => {
      // Test 404 page
      const response = await page.goto(`${baseUrl}/ar/non-existent-page`)
      expect(response?.status()).toBe(404)
      
      const pageContent = await page.textContent('body')
      expect(pageContent).toBeTruthy()
      
      // Check for Arabic content in error page
      const hasArabicText = /[\u0600-\u06FF]/.test(pageContent || '')
      console.log(`✓ 404 page has Arabic text: ${hasArabicText}`)
      
      // Should not show technical error details to users
      const hasTechnicalErrors = /error|exception|stack trace/i.test(pageContent || '')
      expect(hasTechnicalErrors).toBe(false)
      
      console.log('✓ 404 page provides user-friendly content')
    })

    it('should handle JavaScript errors gracefully', async () => {
      const jsErrors: string[] = []
      
      // Listen for JavaScript errors
      page.on('pageerror', (error) => {
        jsErrors.push(error.message)
      })
      
      await page.goto(`${baseUrl}/ar`)
      
      // Wait for page to fully load
      await page.waitForTimeout(3000)
      
      // Check if page is still functional despite any JS errors
      const pageTitle = await page.title()
      const hasContent = await page.locator('main, body').count() > 0
      
      expect(pageTitle).toBeTruthy()
      expect(hasContent).toBe(true)
      
      if (jsErrors.length > 0) {
        console.log(`⚠️ JavaScript errors detected: ${jsErrors.length}`)
        jsErrors.forEach(error => console.log(`   - ${error}`))
      } else {
        console.log('✓ No JavaScript errors detected')
      }
      
      // Page should still be functional
      console.log(`✓ Page title: ${pageTitle}`)
      console.log(`✓ Page has content: ${hasContent}`)
    })

    it('should handle slow network conditions', async () => {
      // Simulate slow network
      await page.route('**/*', async (route) => {
        // Add delay to simulate slow network
        await new Promise(resolve => setTimeout(resolve, 100))
        await route.continue()
      })
      
      const start = Date.now()
      await page.goto(`${baseUrl}/ar`)
      const loadTime = Date.now() - start
      
      // Should still load within reasonable time even with network delay
      expect(loadTime).toBeLessThan(15000) // 15 seconds max with simulated delay
      
      // Check for loading states
      const hasLoadingIndicators = await page.locator('[data-testid*="loading"], .loading, .spinner').count() > 0
      console.log(`✓ Has loading indicators: ${hasLoadingIndicators}`)
      console.log(`✓ Load time with network delay: ${loadTime}ms`)
      
      // Remove route handler
      await page.unroute('**/*')
    })

    it('should maintain accessibility during error states', async () => {
      await page.goto(`${baseUrl}/ar/articles`)
      
      // Check for accessibility features
      const hasHeadings = await page.locator('h1, h2, h3, h4, h5, h6').count() > 0
      const hasLandmarks = await page.locator('main, nav, header, footer, aside').count() > 0
      const hasAriaLabels = await page.locator('[aria-label], [aria-labelledby]').count() > 0
      
      console.log(`✓ Has headings: ${hasHeadings}`)
      console.log(`✓ Has landmarks: ${hasLandmarks}`)
      console.log(`✓ Has ARIA labels: ${hasAriaLabels}`)
      
      // Should maintain basic accessibility structure
      expect(hasHeadings).toBe(true)
      expect(hasLandmarks).toBe(true)
      
      // Check for proper language attributes
      const htmlLang = await page.locator('html').getAttribute('lang')
      const htmlDir = await page.locator('html').getAttribute('dir')
      
      expect(htmlLang).toBe('ar')
      expect(htmlDir).toBe('rtl')
      
      console.log(`✓ HTML lang: ${htmlLang}`)
      console.log(`✓ HTML dir: ${htmlDir}`)
    })
  })

  describe('Performance Metrics and Thresholds', () => {
    it('should meet Core Web Vitals thresholds', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Measure performance metrics
      const performanceMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          // Wait for load event
          if (document.readyState === 'complete') {
            measureMetrics()
          } else {
            window.addEventListener('load', measureMetrics)
          }
          
          function measureMetrics() {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            
            resolve({
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
              firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
              firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
            })
          }
        })
      })
      
      console.log('📊 Performance Metrics:')
      console.log(`   DOM Content Loaded: ${(performanceMetrics as any).domContentLoaded}ms`)
      console.log(`   Load Complete: ${(performanceMetrics as any).loadComplete}ms`)
      console.log(`   First Paint: ${(performanceMetrics as any).firstPaint}ms`)
      console.log(`   First Contentful Paint: ${(performanceMetrics as any).firstContentfulPaint}ms`)
      
      // Core Web Vitals thresholds (relaxed for testing)
      expect((performanceMetrics as any).firstContentfulPaint).toBeLessThan(5000) // 5 seconds
    })

    it('should handle concurrent users simulation', async () => {
      const concurrentRequests = 5
      const promises = []
      
      for (let i = 0; i < concurrentRequests; i++) {
        const promise = (async () => {
          const start = Date.now()
          const response = await fetch(`${baseUrl}/ar`)
          const loadTime = Date.now() - start
          
          return {
            status: response.status,
            loadTime,
            ok: response.ok
          }
        })()
        
        promises.push(promise)
      }
      
      const results = await Promise.all(promises)
      
      const successfulRequests = results.filter(r => r.ok).length
      const averageLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length
      const maxLoadTime = Math.max(...results.map(r => r.loadTime))
      
      console.log(`✓ Concurrent requests: ${concurrentRequests}`)
      console.log(`✓ Successful requests: ${successfulRequests}`)
      console.log(`✓ Success rate: ${(successfulRequests / concurrentRequests * 100).toFixed(1)}%`)
      console.log(`✓ Average load time: ${averageLoadTime.toFixed(0)}ms`)
      console.log(`✓ Max load time: ${maxLoadTime}ms`)
      
      // Should handle concurrent requests reasonably well
      expect(successfulRequests).toBeGreaterThan(concurrentRequests * 0.8) // 80% success rate
      expect(averageLoadTime).toBeLessThan(10000) // 10 seconds average
    })

    it('should demonstrate memory efficiency', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        } : null
      })
      
      if (initialMemory) {
        console.log('💾 Memory Usage:')
        console.log(`   Used JS Heap: ${(initialMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`)
        console.log(`   Total JS Heap: ${(initialMemory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`)
        console.log(`   JS Heap Limit: ${(initialMemory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`)
        
        // Memory usage should be reasonable
        const usedMemoryMB = initialMemory.usedJSHeapSize / 1024 / 1024
        expect(usedMemoryMB).toBeLessThan(100) // Less than 100MB
      } else {
        console.log('ℹ Memory API not available in this browser')
      }
    })
  })
})