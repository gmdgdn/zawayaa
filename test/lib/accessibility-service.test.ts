import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { AccessibilityService } from '@/lib/accessibility-service'

// Setup JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
  url: 'http://localhost',
})

global.window = dom.window as unknown as Window & typeof globalThis
global.document = dom.window.document
global.HTMLElement = dom.window.HTMLElement

describe('AccessibilityService', () => {
  let accessibilityService: AccessibilityService

  beforeEach(() => {
    accessibilityService = new AccessibilityService()
    // Reset the document body for each test
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  it('should get ARIA label in Arabic by default', () => {
    const label = accessibilityService.getAriaLabel('mainNavigation')
    expect(label).toBe('التنقل الرئيسي')
  })

  it('should get ARIA label in English when specified', () => {
    const label = accessibilityService.getAriaLabel('mainNavigation', 'en')
    expect(label).toBe('Main navigation')
  })

  it('should return the key if label is not found', () => {
    const label = accessibilityService.getAriaLabel('nonExistentKey')
    expect(label).toBe('nonExistentKey')
  })

  it('should generate common ARIA attributes', () => {
    const attrs = accessibilityService.generateAriaAttributes({
      label: 'مرحبا',
      expanded: false,
      language: 'ar',
    })
    expect(attrs).toEqual({
      'aria-label': 'مرحبا',
      'aria-expanded': false,
      lang: 'ar',
      dir: 'rtl',
    })
  })

  it('should generate skip links', () => {
    const linksHtml = accessibilityService.generateSkipLinks('ar')
    document.body.innerHTML = linksHtml
    const link = document.querySelector('.skip-link')
    expect(link).not.toBeNull()
    expect(link?.textContent?.trim()).toBe('تخطي إلى المحتوى الرئيسي')
    expect(link?.getAttribute('href')).toBe('#main-content')
  })

  it('should generate screen reader only text', () => {
    const srTextHtml = accessibilityService.generateScreenReaderText('نص مخفي')
    document.body.innerHTML = srTextHtml
    const span = document.querySelector('.sr-only')
    expect(span).not.toBeNull()
    expect(span?.textContent).toBe('نص مخفي')
  })

  it('should apply accessibility settings to the document', () => {
    accessibilityService.applyAccessibilitySettings({
      fontSize: 'large',
      contrast: 'high',
      language: 'en',
    })
    const root = document.documentElement
    expect(root.classList.contains('text-large')).toBe(true)
    expect(root.classList.contains('high-contrast')).toBe(true)
    expect(root.getAttribute('lang')).toBe('en')
    expect(root.getAttribute('dir')).toBe('ltr')
  })

  it('should validate accessibility of an element', () => {
    const testElement = document.createElement('div')
    testElement.innerHTML = `
      <img src="test.jpg" />
      <input type="text" id="name" />
      <h1>Title</h1>
        <h3>Sub-subtitle</h3>
    `
    const result = accessibilityService.validateAccessibility(testElement)
    expect(result.issues).toContain('Image missing alt text')
    expect(result.issues).toContain('Form input missing label')
    expect(result.warnings).toContain('Heading hierarchy skipped a level')
  })

  it('should generate an accessibility report', async () => {
    document.body.innerHTML = '<img src="test.jpg" />'
    const report = await accessibilityService.generateAccessibilityReport()
    expect(report.score).toBeLessThan(100)
    expect(report.issues).toBe(1)
  })

  it('should initialize and add styles and skip links', () => {
    accessibilityService.initialize()
    expect(document.querySelector('.skip-links')).not.toBeNull()
    expect(document.head.querySelector('style')).not.toBeNull()
  })
})
