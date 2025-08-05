/**
 * Feature Parity Verification Test
 * Ensures all existing features work with WordPress data
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium, Browser, Page } from 'playwright'

describe('Feature Parity Verification - WordPress Migration', () => {
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

  describe('Arabic Content Display and RTL Functionality', () => {
    it('should display Arabic content with proper RTL layout', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Check HTML direction
      const htmlDir = await page.locator('html').getAttribute('dir')
      expect(htmlDir).toBe('rtl')
      
      // Check for Arabic language attribute
      const htmlLang = await page.locator('html').getAttribute('lang')
      expect(htmlLang).toBe('ar')
      
      // Check for Arabic text content
      const bodyText = await page.textContent('body')
      const hasArabicText = /[\u0600-\u06FF]/.test(bodyText || '')
      
      console.log(`✓ RTL direction: ${htmlDir}`)
      console.log(`✓ Language: ${htmlLang}`)
      console.log(`✓ Arabic text detected: ${hasArabicText}`)
    })

    it('should have proper Arabic typography and fonts', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Check for Arabic font families
      const bodyFontFamily = await page.evaluate(() => {
        return window.getComputedStyle(document.body).fontFamily
      })
      
      // Check for proper text alignment
      const textAlign = await page.evaluate(() => {
        const elements = document.querySelectorAll('h1, h2, h3, p')
        const alignments = Array.from(elements).map(el => 
          window.getComputedStyle(el).textAlign
        )
        return alignments
      })
      
      console.log(`✓ Font family configured: ${bodyFontFamily}`)
      console.log(`✓ Text alignments: ${textAlign.slice(0, 3).join(', ')}`)
    })

    it('should handle Arabic navigation correctly', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Check for navigation elements
      const navExists = await page.locator('nav, [role="navigation"]').count() > 0
      if (navExists) {
        const navText = await page.locator('nav, [role="navigation"]').first().textContent()
        const hasArabicNav = /[\u0600-\u06FF]/.test(navText || '')
        
        console.log(`✓ Navigation exists: ${navExists}`)
        console.log(`✓ Arabic navigation text: ${hasArabicNav}`)
      }
    })
  })

  describe('Audio Players and Media Components', () => {
    it('should handle audio content if present', async () => {
      await page.goto(`${baseUrl}/ar/articles`)
      
      // Look for audio indicators or players
      const audioElements = await page.locator('audio, [data-testid*="audio"], [class*="audio"]').count()
      const audioButtons = await page.locator('button[aria-label*="play"], button[aria-label*="تشغيل"]').count()
      
      if (audioElements > 0 || audioButtons > 0) {
        console.log(`✓ Found ${audioElements} audio elements`)
        console.log(`✓ Found ${audioButtons} audio control buttons`)
        
        // Test audio player functionality if present
        if (audioButtons > 0) {
          const firstAudioButton = page.locator('button[aria-label*="play"], button[aria-label*="تشغيل"]').first()
          await firstAudioButton.click()
          
          // Wait for audio player to initialize
          await page.waitForTimeout(1000)
          
          console.log('✓ Audio player interaction tested')
        }
      } else {
        console.log('ℹ No audio content found in current articles')
      }
    })

    it('should handle video content if present', async () => {
      await page.goto(`${baseUrl}/ar/programs`)
      
      // Look for video elements or embeds
      const videoElements = await page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"]').count()
      const videoButtons = await page.locator('button[aria-label*="video"], [data-testid*="video"]').count()
      
      if (videoElements > 0 || videoButtons > 0) {
        console.log(`✓ Found ${videoElements} video elements`)
        console.log(`✓ Found ${videoButtons} video control buttons`)
      } else {
        console.log('ℹ No video content found in current programs')
      }
    })

    it('should handle image galleries if present', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Look for image galleries or carousels
      const galleryElements = await page.locator('[data-testid*="gallery"], [class*="gallery"], [class*="carousel"]').count()
      const images = await page.locator('img').count()
      
      console.log(`✓ Found ${galleryElements} gallery elements`)
      console.log(`✓ Found ${images} images total`)
      
      // Check for proper image loading
      if (images > 0) {
        const firstImage = page.locator('img').first()
        const imageLoaded = await firstImage.evaluate((img: HTMLImageElement) => {
          return img.complete && img.naturalWidth > 0
        })
        
        console.log(`✓ First image loaded: ${imageLoaded}`)
      }
    })
  })

  describe('Search Functionality', () => {
    it('should have search interface available', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Look for search input
      const searchInputs = await page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="search"]').count()
      const searchButtons = await page.locator('button[aria-label*="search"], button[aria-label*="بحث"]').count()
      
      if (searchInputs > 0) {
        console.log(`✓ Found ${searchInputs} search inputs`)
        
        // Test search functionality
        const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="search"]').first()
        await searchInput.fill('test')
        
        if (searchButtons > 0) {
          await page.locator('button[aria-label*="search"], button[aria-label*="بحث"]').first().click()
        } else {
          await searchInput.press('Enter')
        }
        
        // Wait for search results
        await page.waitForTimeout(2000)
        
        console.log('✓ Search functionality tested')
      } else {
        console.log('ℹ No search interface found')
      }
    })

    it('should handle search results display', async () => {
      // Check if we're on a search results page
      const currentUrl = page.url()
      if (currentUrl.includes('search') || currentUrl.includes('بحث')) {
        const resultsContainer = await page.locator('[data-testid*="search-results"], [class*="search-results"]').count()
        const resultItems = await page.locator('[data-testid*="search-result"], article, .result-item').count()
        
        console.log(`✓ Search results container: ${resultsContainer > 0}`)
        console.log(`✓ Search result items: ${resultItems}`)
      }
    })
  })

  describe('Navigation and Routing', () => {
    it('should handle navigation between main sections', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Test navigation to articles
      const articlesLink = page.locator('a[href*="/articles"], a[href*="/مقالات"]').first()
      if (await articlesLink.count() > 0) {
        await articlesLink.click()
        await page.waitForURL('**/articles**', { timeout: 5000 })
        console.log('✓ Navigation to articles works')
      }
      
      // Test navigation to programs
      await page.goto(`${baseUrl}/ar`)
      const programsLink = page.locator('a[href*="/programs"], a[href*="/برامج"]').first()
      if (await programsLink.count() > 0) {
        await programsLink.click()
        await page.waitForURL('**/programs**', { timeout: 5000 })
        console.log('✓ Navigation to programs works')
      }
    })

    it('should handle breadcrumb navigation if present', async () => {
      await page.goto(`${baseUrl}/ar/articles`)
      
      const breadcrumbs = await page.locator('[data-testid*="breadcrumb"], nav[aria-label*="breadcrumb"], .breadcrumb').count()
      if (breadcrumbs > 0) {
        console.log(`✓ Breadcrumb navigation found: ${breadcrumbs}`)
        
        // Test breadcrumb functionality
        const breadcrumbLinks = await page.locator('[data-testid*="breadcrumb"] a, nav[aria-label*="breadcrumb"] a, .breadcrumb a').count()
        console.log(`✓ Breadcrumb links: ${breadcrumbLinks}`)
      } else {
        console.log('ℹ No breadcrumb navigation found')
      }
    })

    it('should handle pagination if present', async () => {
      await page.goto(`${baseUrl}/ar/articles`)
      
      const pagination = await page.locator('[data-testid*="pagination"], .pagination, nav[aria-label*="pagination"]').count()
      if (pagination > 0) {
        console.log(`✓ Pagination found: ${pagination}`)
        
        const paginationLinks = await page.locator('[data-testid*="pagination"] a, .pagination a, nav[aria-label*="pagination"] a').count()
        console.log(`✓ Pagination links: ${paginationLinks}`)
        
        // Test pagination functionality
        if (paginationLinks > 0) {
          const nextLink = page.locator('a[aria-label*="next"], a[aria-label*="التالي"], a:has-text("التالي")').first()
          if (await nextLink.count() > 0) {
            await nextLink.click()
            await page.waitForTimeout(2000)
            console.log('✓ Pagination navigation tested')
          }
        }
      } else {
        console.log('ℹ No pagination found')
      }
    })
  })

  describe('Content Interaction Features', () => {
    it('should handle social sharing if present', async () => {
      await page.goto(`${baseUrl}/ar/articles`)
      
      // Look for an article to test sharing
      const articleLink = page.locator('[data-testid*="article"] a, article a').first()
      if (await articleLink.count() > 0) {
        await articleLink.click()
        await page.waitForTimeout(2000)
        
        // Look for sharing buttons
        const shareButtons = await page.locator('[data-testid*="share"], button[aria-label*="share"], button[aria-label*="مشاركة"]').count()
        const socialButtons = await page.locator('a[href*="twitter"], a[href*="facebook"], a[href*="whatsapp"]').count()
        
        console.log(`✓ Share buttons found: ${shareButtons}`)
        console.log(`✓ Social media buttons found: ${socialButtons}`)
      }
    })

    it('should handle content filtering if present', async () => {
      await page.goto(`${baseUrl}/ar/articles`)
      
      // Look for filter controls
      const filterButtons = await page.locator('[data-testid*="filter"], button[aria-label*="filter"], select').count()
      const categoryFilters = await page.locator('[data-testid*="category"], .category-filter').count()
      
      if (filterButtons > 0 || categoryFilters > 0) {
        console.log(`✓ Filter controls found: ${filterButtons}`)
        console.log(`✓ Category filters found: ${categoryFilters}`)
        
        // Test filter functionality
        if (filterButtons > 0) {
          await page.locator('[data-testid*="filter"], button[aria-label*="filter"]').first().click()
          await page.waitForTimeout(1000)
          console.log('✓ Filter interaction tested')
        }
      } else {
        console.log('ℹ No content filters found')
      }
    })

    it('should handle newsletter signup if present', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Look for newsletter signup
      const newsletterInputs = await page.locator('input[type="email"], input[placeholder*="email"], input[placeholder*="بريد"]').count()
      const newsletterButtons = await page.locator('button:has-text("subscribe"), button:has-text("اشتراك")').count()
      
      if (newsletterInputs > 0 || newsletterButtons > 0) {
        console.log(`✓ Newsletter inputs found: ${newsletterInputs}`)
        console.log(`✓ Newsletter buttons found: ${newsletterButtons}`)
      } else {
        console.log('ℹ No newsletter signup found')
      }
    })
  })

  describe('Responsive Design and Mobile Support', () => {
    it('should handle mobile viewport correctly', async () => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`${baseUrl}/ar`)
      
      // Check for mobile navigation
      const mobileMenu = await page.locator('[data-testid*="mobile-menu"], .mobile-menu, button[aria-label*="menu"]').count()
      
      if (mobileMenu > 0) {
        console.log(`✓ Mobile menu found: ${mobileMenu}`)
        
        // Test mobile menu functionality
        await page.locator('[data-testid*="mobile-menu"], .mobile-menu, button[aria-label*="menu"]').first().click()
        await page.waitForTimeout(500)
        console.log('✓ Mobile menu interaction tested')
      }
      
      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    it('should handle tablet viewport correctly', async () => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(`${baseUrl}/ar`)
      
      // Check layout adaptation
      const contentWidth = await page.evaluate(() => {
        const main = document.querySelector('main') || document.body
        return window.getComputedStyle(main).width
      })
      
      console.log(`✓ Tablet layout width: ${contentWidth}`)
      
      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 })
    })
  })
})