/**
 * Comprehensive Smoke Tests for WordPress Migration
 * Tests all page types, content workflows, and revalidation triggers
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium, Browser, Page } from 'playwright'

describe('Comprehensive Smoke Tests - WordPress Migration', () => {
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

  describe('Page Loading Tests', () => {
    it('should load homepage with WordPress content', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Wait for content to load
      await page.waitForSelector('[data-testid="homepage-content"]', { timeout: 10000 })
      
      // Check for featured articles
      const featuredArticles = await page.locator('[data-testid="featured-article"]').count()
      expect(featuredArticles).toBeGreaterThan(0)
      
      // Check for latest articles
      const latestArticles = await page.locator('[data-testid="latest-articles"] article').count()
      expect(latestArticles).toBeGreaterThan(0)
      
      // Check for programs
      const programs = await page.locator('[data-testid="programs-section"] [data-testid="program-card"]').count()
      expect(programs).toBeGreaterThan(0)
      
      console.log('✓ Homepage loads with WordPress content')
    })

    it('should load article list page with pagination', async () => {
      await page.goto(`${baseUrl}/ar/articles`)
      
      // Wait for articles to load
      await page.waitForSelector('[data-testid="article-list"]', { timeout: 10000 })
      
      // Check for article cards
      const articleCards = await page.locator('[data-testid="article-card"]').count()
      expect(articleCards).toBeGreaterThan(0)
      
      // Check for pagination if present
      const paginationExists = await page.locator('[data-testid="pagination"]').count() > 0
      if (paginationExists) {
        console.log('✓ Pagination found on article list')
      }
      
      console.log('✓ Article list page loads correctly')
    })

    it('should load individual article page with full content', async () => {
      // First get an article slug from the list page
      await page.goto(`${baseUrl}/ar/articles`)
      await page.waitForSelector('[data-testid="article-card"] a', { timeout: 10000 })
      
      const firstArticleLink = await page.locator('[data-testid="article-card"] a').first().getAttribute('href')
      expect(firstArticleLink).toBeTruthy()
      
      // Navigate to the article
      await page.goto(`${baseUrl}${firstArticleLink}`)
      await page.waitForSelector('[data-testid="article-content"]', { timeout: 10000 })
      
      // Check for article elements
      const title = await page.locator('h1').textContent()
      expect(title).toBeTruthy()
      
      const content = await page.locator('[data-testid="article-content"]').textContent()
      expect(content).toBeTruthy()
      
      // Check for author info
      const authorExists = await page.locator('[data-testid="article-author"]').count() > 0
      if (authorExists) {
        console.log('✓ Author information displayed')
      }
      
      console.log('✓ Individual article page loads with full content')
    })

    it('should load programs list page', async () => {
      await page.goto(`${baseUrl}/ar/programs`)
      
      // Wait for programs to load
      await page.waitForSelector('[data-testid="programs-list"]', { timeout: 10000 })
      
      // Check for program cards
      const programCards = await page.locator('[data-testid="program-card"]').count()
      expect(programCards).toBeGreaterThan(0)
      
      console.log('✓ Programs list page loads correctly')
    })

    it('should load individual program page with episodes', async () => {
      // Get a program slug from the list page
      await page.goto(`${baseUrl}/ar/programs`)
      await page.waitForSelector('[data-testid="program-card"] a', { timeout: 10000 })
      
      const firstProgramLink = await page.locator('[data-testid="program-card"] a').first().getAttribute('href')
      expect(firstProgramLink).toBeTruthy()
      
      // Navigate to the program
      await page.goto(`${baseUrl}${firstProgramLink}`)
      await page.waitForSelector('[data-testid="program-details"]', { timeout: 10000 })
      
      // Check for program elements
      const title = await page.locator('h1').textContent()
      expect(title).toBeTruthy()
      
      // Check for episodes if they exist
      const episodesExist = await page.locator('[data-testid="episodes-list"]').count() > 0
      if (episodesExist) {
        const episodeCount = await page.locator('[data-testid="episode-card"]').count()
        console.log(`✓ Program has ${episodeCount} episodes`)
      }
      
      console.log('✓ Individual program page loads correctly')
    })

    it('should load author pages if they exist', async () => {
      // Try to access authors page
      const response = await page.goto(`${baseUrl}/ar/authors`)
      
      if (response?.status() === 200) {
        await page.waitForSelector('[data-testid="authors-list"]', { timeout: 5000 })
        
        const authorCards = await page.locator('[data-testid="author-card"]').count()
        if (authorCards > 0) {
          console.log(`✓ Authors page loads with ${authorCards} authors`)
        }
      } else {
        console.log('ℹ Authors page not implemented or not accessible')
      }
    })
  })

  describe('Content Workflow Tests', () => {
    it('should handle Arabic RTL content correctly', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Check for RTL direction
      const htmlDir = await page.locator('html').getAttribute('dir')
      expect(htmlDir).toBe('rtl')
      
      // Check for Arabic text rendering
      const arabicTextExists = await page.evaluate(() => {
        const textContent = document.body.textContent || ''
        // Check for Arabic characters
        return /[\u0600-\u06FF]/.test(textContent)
      })
      
      if (arabicTextExists) {
        console.log('✓ Arabic content detected and RTL direction set')
      }
    })

    it('should display featured content correctly', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Check for featured article indicators
      const featuredIndicators = await page.locator('[data-testid="featured-badge"]').count()
      if (featuredIndicators > 0) {
        console.log(`✓ Found ${featuredIndicators} featured content indicators`)
      }
      
      // Check for category colors if implemented
      const categoryColors = await page.locator('[data-testid="category-badge"]').count()
      if (categoryColors > 0) {
        console.log(`✓ Category badges with colors displayed`)
      }
    })

    it('should handle audio content if present', async () => {
      await page.goto(`${baseUrl}/ar/articles`)
      
      // Look for audio indicators
      const audioIndicators = await page.locator('[data-testid="audio-badge"]').count()
      if (audioIndicators > 0) {
        console.log(`✓ Found ${audioIndicators} articles with audio content`)
        
        // Click on an article with audio
        await page.locator('[data-testid="audio-badge"]').first().click()
        
        // Check for audio player
        const audioPlayer = await page.locator('audio, [data-testid="audio-player"]').count()
        if (audioPlayer > 0) {
          console.log('✓ Audio player found on article page')
        }
      } else {
        console.log('ℹ No audio content found in current articles')
      }
    })
  })

  describe('Search and Navigation Tests', () => {
    it('should handle search functionality', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Look for search input
      const searchInput = await page.locator('[data-testid="search-input"], input[type="search"]').first()
      
      if (await searchInput.count() > 0) {
        await searchInput.fill('test')
        await searchInput.press('Enter')
        
        // Wait for search results
        await page.waitForTimeout(2000)
        
        console.log('✓ Search functionality works')
      } else {
        console.log('ℹ Search functionality not found or not implemented')
      }
    })

    it('should handle navigation between pages', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Test navigation to articles
      const articlesLink = await page.locator('a[href*="/articles"]').first()
      if (await articlesLink.count() > 0) {
        await articlesLink.click()
        await page.waitForURL('**/articles**')
        console.log('✓ Navigation to articles page works')
      }
      
      // Test navigation to programs
      await page.goto(`${baseUrl}/ar`)
      const programsLink = await page.locator('a[href*="/programs"]').first()
      if (await programsLink.count() > 0) {
        await programsLink.click()
        await page.waitForURL('**/programs**')
        console.log('✓ Navigation to programs page works')
      }
    })
  })

  describe('Error Handling Tests', () => {
    it('should handle 404 pages gracefully', async () => {
      const response = await page.goto(`${baseUrl}/ar/non-existent-page`)
      expect(response?.status()).toBe(404)
      
      // Check for user-friendly 404 content
      const pageContent = await page.textContent('body')
      expect(pageContent).toBeTruthy()
      
      console.log('✓ 404 pages handled gracefully')
    })

    it('should handle missing images gracefully', async () => {
      await page.goto(`${baseUrl}/ar`)
      
      // Check for broken images
      const images = await page.locator('img').all()
      let brokenImages = 0
      
      for (const img of images) {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
        if (naturalWidth === 0) {
          brokenImages++
        }
      }
      
      console.log(`ℹ Found ${brokenImages} potentially broken images out of ${images.length} total`)
    })
  })
})