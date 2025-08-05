/**
 * Mobile Optimization Service for Arabic Content
 * Handles responsive design, touch interactions, and mobile-specific features
 */

export interface MobileBreakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
}

export interface TouchGesture {
  type: 'tap' | 'swipe' | 'pinch' | 'long-press'
  direction?: 'left' | 'right' | 'up' | 'down'
  element: HTMLElement
  callback: (event: TouchEvent) => void
}

export interface MobileOptimizations {
  lazyLoading: boolean
  imageCompression: boolean
  touchOptimization: boolean
  offlineSupport: boolean
  pushNotifications: boolean
}

export class MobileService {
  private breakpoints: MobileBreakpoints = {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  }

  private touchGestures: TouchGesture[] = []

  /**
   * Check if device is mobile
   */
  isMobile(): boolean {
    if (typeof window === 'undefined') return false
    
    return window.innerWidth < this.breakpoints.md || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * Check if device is tablet
   */
  isTablet(): boolean {
    if (typeof window === 'undefined') return false
    
    return window.innerWidth >= this.breakpoints.md && 
           window.innerWidth < this.breakpoints.lg &&
           /iPad|Android/i.test(navigator.userAgent)
  }

  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint(): keyof MobileBreakpoints {
    if (typeof window === 'undefined') return 'md'
    
    const width = window.innerWidth
    
    if (width < this.breakpoints.sm) return 'xs'
    if (width < this.breakpoints.md) return 'sm'
    if (width < this.breakpoints.lg) return 'md'
    if (width < this.breakpoints.xl) return 'lg'
    return 'xl'
  }

  /**
   * Check if device supports touch
   */
  isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false
    
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           (navigator as any).msMaxTouchPoints > 0
  }

  /**
   * Get device orientation
   */
  getOrientation(): 'portrait' | 'landscape' {
    if (typeof window === 'undefined') return 'portrait'
    
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  }

  /**
   * Check if device is in standalone mode (PWA)
   */
  isStandalone(): boolean {
    if (typeof window === 'undefined') return false
    
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true
  }

  /**
   * Optimize images for mobile
   */
  optimizeImageForMobile(
    src: string, 
    options: {
      width?: number
      quality?: number
      format?: 'webp' | 'jpeg' | 'png'
      lazy?: boolean
    } = {}
  ): {
    src: string
    srcSet: string
    sizes: string
    loading: 'lazy' | 'eager'
  } {
    const {
      width = this.isMobile() ? 400 : 800,
      quality = 85,
      format = 'webp',
      lazy = true
    } = options

    // Generate responsive image URLs
    const sizes = [320, 640, 768, 1024, 1280]
    const srcSet = sizes
      .filter(size => size <= width * 2) // Only include sizes up to 2x the target width
      .map(size => `${this.generateOptimizedImageUrl(src, { width: size, quality, format })} ${size}w`)
      .join(', ')

    const sizesAttr = this.isMobile() 
      ? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
      : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'

    return {
      src: this.generateOptimizedImageUrl(src, { width, quality, format }),
      srcSet,
      sizes: sizesAttr,
      loading: lazy ? 'lazy' : 'eager'
    }
  }

  /**
   * Generate optimized image URL
   */
  private generateOptimizedImageUrl(
    src: string, 
    options: { width: number; quality: number; format: string }
  ): string {
    if (!src || src.startsWith('data:')) return src

    // If using Next.js Image Optimization
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      const params = new URLSearchParams({
        url: encodeURIComponent(src),
        w: options.width.toString(),
        q: options.quality.toString(),
        f: options.format
      })
      return `/_next/image?${params.toString()}`
    }

    return src
  }

  /**
   * Add touch gesture support
   */
  addTouchGesture(gesture: TouchGesture): void {
    this.touchGestures.push(gesture)
    this.bindTouchEvents(gesture)
  }

  /**
   * Remove touch gesture
   */
  removeTouchGesture(element: HTMLElement, type: TouchGesture['type']): void {
    this.touchGestures = this.touchGestures.filter(
      gesture => !(gesture.element === element && gesture.type === type)
    )
  }

  /**
   * Bind touch events for gesture
   */
  private bindTouchEvents(gesture: TouchGesture): void {
    let startX = 0
    let startY = 0
    let startTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      startX = touch.clientX
      startY = touch.clientY
      startTime = Date.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      const endX = touch.clientX
      const endY = touch.clientY
      const endTime = Date.now()
      
      const deltaX = endX - startX
      const deltaY = endY - startY
      const deltaTime = endTime - startTime
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const isSwipe = distance > 50 && deltaTime < 300
      const isLongPress = deltaTime > 500 && distance < 10
      const isTap = deltaTime < 300 && distance < 10

      switch (gesture.type) {
        case 'tap':
          if (isTap) gesture.callback(e)
          break
          
        case 'long-press':
          if (isLongPress) gesture.callback(e)
          break
          
        case 'swipe':
          if (isSwipe) {
            const direction = Math.abs(deltaX) > Math.abs(deltaY)
              ? (deltaX > 0 ? 'right' : 'left')
              : (deltaY > 0 ? 'down' : 'up')
            
            if (!gesture.direction || gesture.direction === direction) {
              gesture.callback(e)
            }
          }
          break
      }
    }

    gesture.element.addEventListener('touchstart', handleTouchStart, { passive: true })
    gesture.element.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  /**
   * Enable pull-to-refresh
   */
  enablePullToRefresh(callback: () => void): void {
    if (!this.isMobile()) return

    let startY = 0
    let currentY = 0
    let isPulling = false

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY
        isPulling = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return
      
      currentY = e.touches[0].clientY
      const pullDistance = currentY - startY
      
      if (pullDistance > 100) {
        // Add visual feedback
        document.body.style.transform = `translateY(${Math.min(pullDistance - 100, 50)}px)`
      }
    }

    const handleTouchEnd = () => {
      if (!isPulling) return
      
      const pullDistance = currentY - startY
      
      if (pullDistance > 100) {
        callback()
      }
      
      // Reset
      document.body.style.transform = ''
      isPulling = false
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  /**
   * Optimize Arabic text for mobile
   */
  optimizeArabicTextForMobile(): string {
    return `
      /* Mobile Arabic text optimizations */
      @media (max-width: 768px) {
        [lang="ar"], .arabic-text {
          font-size: 16px;
          line-height: 1.8;
          letter-spacing: 0.02em;
          word-spacing: 0.1em;
        }

        .arabic-content h1 {
          font-size: 1.75rem;
          line-height: 1.4;
        }

        .arabic-content h2 {
          font-size: 1.5rem;
          line-height: 1.4;
        }

        .arabic-content h3 {
          font-size: 1.25rem;
          line-height: 1.4;
        }

        .arabic-content p {
          margin-bottom: 1.5rem;
        }

        /* Improve readability on small screens */
        .article-content {
          padding: 1rem;
          max-width: 100%;
        }

        /* Touch-friendly buttons */
        button, .btn {
          min-height: 44px;
          min-width: 44px;
          padding: 12px 16px;
          font-size: 16px;
        }

        /* Mobile navigation */
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 8px;
          z-index: 50;
        }

        /* Responsive images */
        img {
          max-width: 100%;
          height: auto;
        }

        /* Mobile-friendly forms */
        input, textarea, select {
          font-size: 16px; /* Prevents zoom on iOS */
          padding: 12px;
          border-radius: 8px;
        }
      }

      /* Landscape orientation adjustments */
      @media (max-width: 768px) and (orientation: landscape) {
        .mobile-nav {
          display: none;
        }

        .content-container {
          padding-bottom: 0;
        }
      }

      /* High DPI displays */
      @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .logo, .icon {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      }
    `
  }

  /**
   * Generate mobile viewport meta tag
   */
  generateViewportMeta(): string {
    return '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">'
  }

  /**
   * Generate PWA manifest for Arabic app
   */
  generatePWAManifest(): object {
    return {
      name: 'زوايا | Zawaya',
      short_name: 'زوايا',
      description: 'منصة معرفية غير ربحية، ثنائية اللغة، تربط الواقع العربي بالتحولات العالمية',
      start_url: '/ar',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#1a365d',
      orientation: 'portrait-primary',
      lang: 'ar',
      dir: 'rtl',
      icons: [
        {
          src: '/icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: '/icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: '/icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: '/icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/icons/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png'
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      categories: ['news', 'education', 'lifestyle'],
      screenshots: [
        {
          src: '/screenshots/mobile-home.png',
          sizes: '390x844',
          type: 'image/png',
          form_factor: 'narrow'
        },
        {
          src: '/screenshots/desktop-home.png',
          sizes: '1280x720',
          type: 'image/png',
          form_factor: 'wide'
        }
      ]
    }
  }

  /**
   * Check mobile performance metrics
   */
  async checkMobilePerformance(): Promise<{
    score: number
    metrics: {
      firstContentfulPaint: number
      largestContentfulPaint: number
      cumulativeLayoutShift: number
      firstInputDelay: number
    }
    recommendations: string[]
  }> {
    if (typeof window === 'undefined') {
      return {
        score: 0,
        metrics: {
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
          firstInputDelay: 0
        },
        recommendations: []
      }
    }

    const recommendations: string[] = []
    
    // Check if images are optimized
    const images = document.querySelectorAll('img')
    let unoptimizedImages = 0
    images.forEach(img => {
      if (!img.loading || img.loading !== 'lazy') {
        unoptimizedImages++
      }
    })
    
    if (unoptimizedImages > 0) {
      recommendations.push('Enable lazy loading for images')
    }

    // Check for mobile-friendly touch targets
    const buttons = document.querySelectorAll('button, a, input')
    let smallTouchTargets = 0
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect()
      if (rect.width < 44 || rect.height < 44) {
        smallTouchTargets++
      }
    })

    if (smallTouchTargets > 0) {
      recommendations.push('Increase touch target sizes for mobile')
    }

    // Mock performance metrics (in real implementation, use Performance API)
    const metrics = {
      firstContentfulPaint: 1200,
      largestContentfulPaint: 2500,
      cumulativeLayoutShift: 0.1,
      firstInputDelay: 50
    }

    // Calculate score based on metrics
    let score = 100
    if (metrics.largestContentfulPaint > 2500) score -= 20
    if (metrics.cumulativeLayoutShift > 0.1) score -= 15
    if (metrics.firstInputDelay > 100) score -= 10
    if (recommendations.length > 0) score -= recommendations.length * 5

    return {
      score: Math.max(0, score),
      metrics,
      recommendations
    }
  }

  /**
   * Initialize mobile optimizations
   */
  initialize(options: Partial<MobileOptimizations> = {}): void {
    if (typeof document === 'undefined') return

    const {
      lazyLoading = true,
      touchOptimization = true,
      offlineSupport = false
    } = options

    // Add mobile CSS
    const style = document.createElement('style')
    style.textContent = this.optimizeArabicTextForMobile()
    document.head.appendChild(style)

    // Enable lazy loading
    if (lazyLoading && 'IntersectionObserver' in window) {
      this.enableLazyLoading()
    }

    // Add touch optimizations
    if (touchOptimization && this.isTouchDevice()) {
      this.addTouchOptimizations()
    }

    // Register service worker for offline support
    if (offlineSupport && 'serviceWorker' in navigator) {
      this.registerServiceWorker()
    }
  }

  /**
   * Enable lazy loading for images
   */
  private enableLazyLoading(): void {
    const images = document.querySelectorAll('img[data-src]')
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach(img => imageObserver.observe(img))
  }

  /**
   * Add touch optimizations
   */
  private addTouchOptimizations(): void {
    // Add touch feedback
    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.role === 'button') {
        target.classList.add('touch-active')
      }
    }, { passive: true })

    document.addEventListener('touchend', (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.role === 'button') {
        setTimeout(() => target.classList.remove('touch-active'), 150)
      }
    }, { passive: true })
  }

  /**
   * Register service worker
   */
  private async registerServiceWorker(): Promise<void> {
    try {
      await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered successfully')
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

// Export singleton instance
export const mobileService = new MobileService()

// Export types
export type { MobileBreakpoints, TouchGesture, MobileOptimizations }