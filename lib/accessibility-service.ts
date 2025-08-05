/**
 * Accessibility Service for Arabic Content
 * Provides comprehensive accessibility features and ARIA support
 */

export interface AccessibilityOptions {
  language: 'ar' | 'en'
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  contrast: 'normal' | 'high'
  reducedMotion: boolean
  screenReader: boolean
}

export interface AriaLabels {
  [key: string]: {
    ar: string
    en: string
  }
}

export class AccessibilityService {
  private ariaLabels: AriaLabels = {
    // Navigation
    mainNavigation: {
      ar: 'التنقل الرئيسي',
      en: 'Main navigation'
    },
    breadcrumb: {
      ar: 'مسار التنقل',
      en: 'Breadcrumb navigation'
    },
    skipToContent: {
      ar: 'تخطي إلى المحتوى الرئيسي',
      en: 'Skip to main content'
    },
    
    // Content
    article: {
      ar: 'مقال',
      en: 'Article'
    },
    readMore: {
      ar: 'اقرأ المزيد',
      en: 'Read more'
    },
    readTime: {
      ar: 'وقت القراءة',
      en: 'Reading time'
    },
    publishedDate: {
      ar: 'تاريخ النشر',
      en: 'Published date'
    },
    author: {
      ar: 'الكاتب',
      en: 'Author'
    },
    category: {
      ar: 'الفئة',
      en: 'Category'
    },
    
    // Media
    playAudio: {
      ar: 'تشغيل الصوت',
      en: 'Play audio'
    },
    pauseAudio: {
      ar: 'إيقاف الصوت',
      en: 'Pause audio'
    },
    playVideo: {
      ar: 'تشغيل الفيديو',
      en: 'Play video'
    },
    pauseVideo: {
      ar: 'إيقاف الفيديو',
      en: 'Pause video'
    },
    audioPlayer: {
      ar: 'مشغل الصوت',
      en: 'Audio player'
    },
    videoPlayer: {
      ar: 'مشغل الفيديو',
      en: 'Video player'
    },
    
    // Forms
    required: {
      ar: 'مطلوب',
      en: 'Required'
    },
    optional: {
      ar: 'اختياري',
      en: 'Optional'
    },
    email: {
      ar: 'البريد الإلكتروني',
      en: 'Email address'
    },
    name: {
      ar: 'الاسم',
      en: 'Name'
    },
    submit: {
      ar: 'إرسال',
      en: 'Submit'
    },
    search: {
      ar: 'البحث',
      en: 'Search'
    },
    
    // Social sharing
    shareOn: {
      ar: 'مشاركة على',
      en: 'Share on'
    },
    copyLink: {
      ar: 'نسخ الرابط',
      en: 'Copy link'
    },
    linkCopied: {
      ar: 'تم نسخ الرابط',
      en: 'Link copied'
    },
    
    // Newsletter
    newsletter: {
      ar: 'النشرة البريدية',
      en: 'Newsletter'
    },
    subscribe: {
      ar: 'اشترك',
      en: 'Subscribe'
    },
    unsubscribe: {
      ar: 'إلغاء الاشتراك',
      en: 'Unsubscribe'
    },
    
    // Loading states
    loading: {
      ar: 'جاري التحميل',
      en: 'Loading'
    },
    loadingContent: {
      ar: 'جاري تحميل المحتوى',
      en: 'Loading content'
    },
    
    // Errors
    error: {
      ar: 'خطأ',
      en: 'Error'
    },
    errorOccurred: {
      ar: 'حدث خطأ',
      en: 'An error occurred'
    },
    tryAgain: {
      ar: 'حاول مرة أخرى',
      en: 'Try again'
    },
    
    // Close/Open
    close: {
      ar: 'إغلاق',
      en: 'Close'
    },
    open: {
      ar: 'فتح',
      en: 'Open'
    },
    menu: {
      ar: 'القائمة',
      en: 'Menu'
    },
    
    // Pagination
    previousPage: {
      ar: 'الصفحة السابقة',
      en: 'Previous page'
    },
    nextPage: {
      ar: 'الصفحة التالية',
      en: 'Next page'
    },
    page: {
      ar: 'صفحة',
      en: 'Page'
    },
    
    // Filters
    filter: {
      ar: 'تصفية',
      en: 'Filter'
    },
    clearFilters: {
      ar: 'مسح الفلاتر',
      en: 'Clear filters'
    },
    sortBy: {
      ar: 'ترتيب حسب',
      en: 'Sort by'
    }
  }

  /**
   * Get ARIA label in specified language
   */
  getAriaLabel(key: string, language: 'ar' | 'en' = 'ar'): string {
    return this.ariaLabels[key]?.[language] || key
  }

  /**
   * Generate ARIA attributes for Arabic content
   */
  generateAriaAttributes(options: {
    label?: string
    describedBy?: string
    expanded?: boolean
    hasPopup?: boolean
    current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time'
    live?: 'off' | 'polite' | 'assertive'
    atomic?: boolean
    relevant?: 'additions' | 'removals' | 'text' | 'all'
    language?: 'ar' | 'en'
  }): { [key: string]: string | boolean } {
    const attrs: { [key: string]: string | boolean } = {}

    if (options.label) {
      attrs['aria-label'] = options.label
    }

    if (options.describedBy) {
      attrs['aria-describedby'] = options.describedBy
    }

    if (options.expanded !== undefined) {
      attrs['aria-expanded'] = options.expanded
    }

    if (options.hasPopup) {
      attrs['aria-haspopup'] = true
    }

    if (options.current !== undefined) {
      attrs['aria-current'] = options.current
    }

    if (options.live) {
      attrs['aria-live'] = options.live
    }

    if (options.atomic !== undefined) {
      attrs['aria-atomic'] = options.atomic
    }

    if (options.relevant) {
      attrs['aria-relevant'] = options.relevant
    }

    if (options.language) {
      attrs['lang'] = options.language
      attrs['dir'] = options.language === 'ar' ? 'rtl' : 'ltr'
    }

    return attrs
  }

  /**
   * Generate skip links for Arabic content
   */
  generateSkipLinks(language: 'ar' | 'en' = 'ar'): string {
    const skipToMain = this.getAriaLabel('skipToContent', language)
    
    return `
      <div class="skip-links">
        <a href="#main-content" class="skip-link">
          ${skipToMain}
        </a>
      </div>
    `
  }

  /**
   * Generate screen reader only text
   */
  generateScreenReaderText(text: string, language: 'ar' | 'en' = 'ar'): string {
    return `<span class="sr-only" lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">${text}</span>`
  }

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Check if user prefers high contrast
   */
  prefersHighContrast(): boolean {
    if (typeof window === 'undefined') return false
    
    return window.matchMedia('(prefers-contrast: high)').matches
  }

  /**
   * Get user's preferred color scheme
   */
  getPreferredColorScheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  /**
   * Apply accessibility settings
   */
  applyAccessibilitySettings(options: Partial<AccessibilityOptions>): void {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    // Font size
    if (options.fontSize) {
      root.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large')
      root.classList.add(`text-${options.fontSize}`)
    }

    // High contrast
    if (options.contrast === 'high') {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Reduced motion
    if (options.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Language and direction
    if (options.language) {
      root.setAttribute('lang', options.language)
      root.setAttribute('dir', options.language === 'ar' ? 'rtl' : 'ltr')
    }
  }

  /**
   * Generate accessibility CSS
   */
  generateAccessibilityCSS(): string {
    return `
      /* Skip links */
      .skip-links {
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 1000;
      }

      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        z-index: 1001;
      }

      .skip-link:focus {
        top: 6px;
      }

      /* Screen reader only */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* Focus indicators */
      :focus {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
      }

      :focus:not(:focus-visible) {
        outline: none;
      }

      :focus-visible {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
      }

      /* High contrast mode */
      .high-contrast {
        filter: contrast(150%);
      }

      .high-contrast * {
        border-color: currentColor !important;
      }

      /* Reduced motion */
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      /* Font size adjustments */
      .text-small {
        font-size: 14px;
      }

      .text-medium {
        font-size: 16px;
      }

      .text-large {
        font-size: 18px;
      }

      .text-extra-large {
        font-size: 20px;
      }

      /* Arabic text improvements */
      [lang="ar"] {
        font-feature-settings: "kern" 1, "liga" 1;
        text-rendering: optimizeLegibility;
        line-height: 1.6;
      }

      /* Touch targets */
      @media (pointer: coarse) {
        button,
        [role="button"],
        input,
        select,
        textarea,
        a {
          min-height: 44px;
          min-width: 44px;
        }
      }

      /* Print styles */
      @media print {
        .skip-links,
        .sr-only {
          display: none !important;
        }
      }
    `
  }

  /**
   * Validate accessibility of element
   */
  validateAccessibility(element: HTMLElement): {
    issues: string[]
    warnings: string[]
    suggestions: string[]
  } {
    const issues: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Check for missing alt text on images
    const images = element.querySelectorAll('img')
    images.forEach(img => {
      if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
        issues.push('Image missing alt text')
      }
    })

    // Check for missing labels on form inputs
    const inputs = element.querySelectorAll('input, select, textarea')
    inputs.forEach(input => {
      const hasLabel = input.getAttribute('aria-label') || 
                     input.getAttribute('aria-labelledby') ||
                     element.querySelector(`label[for="${input.id}"]`)
      
      if (!hasLabel) {
        issues.push('Form input missing label')
      }
    })

    // Check for proper heading hierarchy
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let lastLevel = 0
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level > lastLevel + 1) {
        warnings.push('Heading hierarchy skipped a level')
      }
      lastLevel = level
    })

    // Check for color contrast (simplified check)
    const colorElements = element.querySelectorAll('[style*="color"]')
    if (colorElements.length > 0) {
      suggestions.push('Consider checking color contrast ratios')
    }

    // Check for Arabic language attributes
    const arabicText = element.textContent?.match(/[\u0600-\u06FF]/)
    if (arabicText && !element.getAttribute('lang')?.includes('ar')) {
      suggestions.push('Consider adding lang="ar" for Arabic content')
    }

    return { issues, warnings, suggestions }
  }

  /**
   * Generate accessibility report
   */
  generateAccessibilityReport(): Promise<{
    score: number
    issues: number
    warnings: number
    suggestions: number
    details: string[]
  }> {
    return new Promise((resolve) => {
      if (typeof document === 'undefined') {
        resolve({
          score: 0,
          issues: 0,
          warnings: 0,
          suggestions: 0,
          details: []
        })
        return
      }

      const result = this.validateAccessibility(document.body)
      const totalChecks = 10 // Total number of accessibility checks
      const issueWeight = 3
      const warningWeight = 1
      const suggestionWeight = 0.5

      const deductions = (result.issues.length * issueWeight) + 
                        (result.warnings.length * warningWeight) + 
                        (result.suggestions.length * suggestionWeight)

      const score = Math.max(0, Math.min(100, 100 - (deductions / totalChecks) * 100))

      resolve({
        score: Math.round(score),
        issues: result.issues.length,
        warnings: result.warnings.length,
        suggestions: result.suggestions.length,
        details: [...result.issues, ...result.warnings, ...result.suggestions]
      })
    })
  }

  /**
   * Initialize accessibility features
   */
  initialize(): void {
    if (typeof document === 'undefined') return

    // Add skip links
    const skipLinks = document.createElement('div')
    skipLinks.innerHTML = this.generateSkipLinks()
    document.body.insertBefore(skipLinks, document.body.firstChild)

    // Apply user preferences
    const options: Partial<AccessibilityOptions> = {
      reducedMotion: this.prefersReducedMotion(),
      contrast: this.prefersHighContrast() ? 'high' : 'normal'
    }

    this.applyAccessibilitySettings(options)

    // Add accessibility CSS
    const style = document.createElement('style')
    style.textContent = this.generateAccessibilityCSS()
    document.head.appendChild(style)
  }
}

// Export singleton instance
export const accessibilityService = new AccessibilityService()

// Export types
export type { AccessibilityOptions, AriaLabels }