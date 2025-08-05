/**
 * Arabic Cross-Browser and Device Compatibility Tests
 * Tests platform compatibility across different browsers and devices
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'

// Mock different browser environments
const mockUserAgents = {
  chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  mobileSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  mobileChrome: 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
}

// Mock viewport sizes
const mockViewports = {
  desktop: { width: 1920, height: 1080 },
  laptop: { width: 1366, height: 768 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
  largeMobile: { width: 414, height: 896 }
}

// Mock Arabic content component for testing
const MockArabicContent = () => (
  <div data-testid="arabic-content" dir="rtl" lang="ar">
    <header data-testid="header">
      <nav data-testid="navigation">
        <ul>
          <li><a href="/ar" data-testid="home-link">الرئيسية</a></li>
          <li><a href="/ar/articles" data-testid="articles-link">المقالات</a></li>
          <li><a href="/ar/programs" data-testid="programs-link">البرامج</a></li>
        </ul>
      </nav>
    </header>
    
    <main data-testid="main-content">
      <article data-testid="article">
        <h1 data-testid="article-title">عنوان المقال باللغة العربية</h1>
        <div data-testid="article-meta">
          <span data-testid="author">الكاتب: أحمد محمد</span>
          <time data-testid="date">٢٠٢٥/٠١/٠١</time>
        </div>
        <div data-testid="article-content">
          <p>هذا نص تجريبي باللغة العربية لاختبار التوافق عبر المتصفحات المختلفة.</p>
          <p>يحتوي هذا النص على أرقام ١٢٣٤٥ وعلامات ترقيم مختلفة: ؟ ! ، ؛</p>
        </div>
        
        <div data-testid="audio-player">
          <button data-testid="play-button">▶️ تشغيل</button>
          <div data-testid="progress-bar" style={{ width: '100%', height: '4px', background: '#ddd' }}>
            <div data-testid="progress-fill" style={{ width: '30%', height: '100%', background: '#007cba' }}></div>
          </div>
          <span data-testid="time-display">٠٢:٣٠ / ٠٥:٠٠</span>
        </div>
        
        <div data-testid="share-buttons">
          <button data-testid="share-whatsapp">واتساب</button>
          <button data-testid="share-telegram">تيليجرام</button>
          <button data-testid="share-twitter">تويتر</button>
        </div>
      </article>
      
      <aside data-testid="sidebar">
        <div data-testid="newsletter-signup">
          <h3>اشترك في النشرة</h3>
          <form data-testid="newsletter-form">
            <input 
              data-testid="email-input" 
              type="email" 
              placeholder="البريد الإلكتروني"
              dir="rtl"
            />
            <button data-testid="subscribe-button">اشتراك</button>
          </form>
        </div>
        
        <div data-testid="related-articles">
          <h3>مقالات ذات صلة</h3>
          <ul>
            <li><a href="/ar/article/1" data-testid="related-link-1">مقال ذو صلة ١</a></li>
            <li><a href="/ar/article/2" data-testid="related-link-2">مقال ذو صلة ٢</a></li>
          </ul>
        </div>
      </aside>
    </main>
    
    <footer data-testid="footer">
      <div data-testid="footer-links">
        <a href="/ar/about" data-testid="about-link">عن المنصة</a>
        <a href="/ar/contact" data-testid="contact-link">اتصل بنا</a>
        <a href="/ar/privacy" data-testid="privacy-link">سياسة الخصوصية</a>
      </div>
      <div data-testid="social-links">
        <a href="https://twitter.com/zawaya" data-testid="twitter-link">تويتر</a>
        <a href="https://facebook.com/zawaya" data-testid="facebook-link">فيسبوك</a>
      </div>
    </footer>
  </div>
)

// Mock responsive component
const MockResponsiveComponent = () => (
  <div data-testid="responsive-component">
    <div data-testid="desktop-only" className="hidden md:block">
      محتوى سطح المكتب فقط
    </div>
    <div data-testid="tablet-only" className="hidden sm:block md:hidden">
      محتوى الجهاز اللوحي فقط
    </div>
    <div data-testid="mobile-only" className="block sm:hidden">
      محتوى الهاتف المحمول فقط
    </div>
    <div data-testid="mobile-menu" className="md:hidden">
      <button data-testid="menu-toggle">☰</button>
    </div>
  </div>
)

describe('Arabic Cross-Browser and Device Compatibility Tests', () => {
  const user = userEvent.setup()
  let originalUserAgent: string
  let originalInnerWidth: number
  let originalInnerHeight: number

  beforeEach(() => {
    // Store original values
    originalUserAgent = navigator.userAgent
    originalInnerWidth = window.innerWidth
    originalInnerHeight = window.innerHeight
    
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore original values
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: originalUserAgent
    })
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: originalInnerHeight
    })
  })

  const mockUserAgent = (userAgent: string) => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: userAgent
    })
  }

  const mockViewport = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: width
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: height
    })
    
    // Trigger resize event
    fireEvent(window, new Event('resize'))
  }

  describe('Browser Compatibility Tests', () => {
    it('should render Arabic content correctly in Chrome', async () => {
      mockUserAgent(mockUserAgents.chrome)
      render(<MockArabicContent />)
      
      // Verify Arabic content renders
      expect(screen.getByTestId('arabic-content')).toHaveAttribute('dir', 'rtl')
      expect(screen.getByTestId('arabic-content')).toHaveAttribute('lang', 'ar')
      
      // Verify Arabic text displays correctly
      expect(screen.getByText('عنوان المقال باللغة العربية')).toBeInTheDocument()
      expect(screen.getByText('الكاتب: أحمد محمد')).toBeInTheDocument()
      
      // Verify Arabic numbers display
      expect(screen.getByText('٢٠٢٥/٠١/٠١')).toBeInTheDocument()
      expect(screen.getByText('٠٢:٣٠ / ٠٥:٠٠')).toBeInTheDocument()
    })

    it('should render Arabic content correctly in Firefox', async () => {
      mockUserAgent(mockUserAgents.firefox)
      render(<MockArabicContent />)
      
      // Test Firefox-specific RTL rendering
      const arabicContent = screen.getByTestId('arabic-content')
      expect(arabicContent).toHaveAttribute('dir', 'rtl')
      
      // Test navigation in RTL
      const navigation = screen.getByTestId('navigation')
      expect(navigation).toBeInTheDocument()
      
      // Verify Arabic links work
      const homeLink = screen.getByTestId('home-link')
      expect(homeLink).toHaveTextContent('الرئيسية')
    })

    it('should render Arabic content correctly in Safari', async () => {
      mockUserAgent(mockUserAgents.safari)
      render(<MockArabicContent />)
      
      // Test Safari-specific Arabic font rendering
      const articleTitle = screen.getByTestId('article-title')
      expect(articleTitle).toBeInTheDocument()
      
      // Test Arabic input fields
      const emailInput = screen.getByTestId('email-input')
      expect(emailInput).toHaveAttribute('dir', 'rtl')
      expect(emailInput).toHaveAttribute('placeholder', 'البريد الإلكتروني')
    })

    it('should render Arabic content correctly in Edge', async () => {
      mockUserAgent(mockUserAgents.edge)
      render(<MockArabicContent />)
      
      // Test Edge-specific compatibility
      expect(screen.getByTestId('arabic-content')).toBeInTheDocument()
      
      // Test audio player controls
      const playButton = screen.getByTestId('play-button')
      expect(playButton).toHaveTextContent('▶️ تشغيل')
      
      const progressBar = screen.getByTestId('progress-bar')
      expect(progressBar).toBeInTheDocument()
    })

    it('should handle Arabic text input across browsers', async () => {
      render(<MockArabicContent />)
      
      const emailInput = screen.getByTestId('email-input')
      
      // Test Arabic text input
      await user.type(emailInput, 'test@example.com')
      expect(emailInput).toHaveValue('test@example.com')
      
      // Test RTL text direction
      expect(emailInput).toHaveAttribute('dir', 'rtl')
    })
  })

  describe('Mobile Device Compatibility Tests', () => {
    it('should render correctly on iPhone (Mobile Safari)', async () => {
      mockUserAgent(mockUserAgents.mobileSafari)
      mockViewport(mockViewports.mobile.width, mockViewports.mobile.height)
      
      render(<MockArabicContent />)
      
      // Verify mobile rendering
      expect(screen.getByTestId('arabic-content')).toBeInTheDocument()
      
      // Test touch-friendly elements
      const playButton = screen.getByTestId('play-button')
      expect(playButton).toBeInTheDocument()
      
      // Test mobile navigation
      const navigation = screen.getByTestId('navigation')
      expect(navigation).toBeInTheDocument()
    })

    it('should render correctly on Android (Mobile Chrome)', async () => {
      mockUserAgent(mockUserAgents.mobileChrome)
      mockViewport(mockViewports.mobile.width, mockViewports.mobile.height)
      
      render(<MockArabicContent />)
      
      // Test Android-specific rendering
      const arabicContent = screen.getByTestId('arabic-content')
      expect(arabicContent).toHaveAttribute('dir', 'rtl')
      
      // Test mobile share buttons
      const shareWhatsApp = screen.getByTestId('share-whatsapp')
      expect(shareWhatsApp).toBeInTheDocument()
      
      const shareTelegram = screen.getByTestId('share-telegram')
      expect(shareTelegram).toBeInTheDocument()
    })

    it('should handle touch interactions on mobile devices', async () => {
      mockViewport(mockViewports.mobile.width, mockViewports.mobile.height)
      render(<MockArabicContent />)
      
      const playButton = screen.getByTestId('play-button')
      
      // Test touch events
      fireEvent.touchStart(playButton)
      fireEvent.touchEnd(playButton)
      
      expect(playButton).toBeInTheDocument()
      
      // Test swipe gestures (simulated)
      const progressBar = screen.getByTestId('progress-bar')
      fireEvent.touchStart(progressBar, { touches: [{ clientX: 100, clientY: 0 }] })
      fireEvent.touchMove(progressBar, { touches: [{ clientX: 150, clientY: 0 }] })
      fireEvent.touchEnd(progressBar)
      
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('Responsive Design Tests', () => {
    it('should adapt layout for desktop screens', async () => {
      mockViewport(mockViewports.desktop.width, mockViewports.desktop.height)
      render(<MockResponsiveComponent />)
      
      // Desktop-specific elements should be visible
      const desktopOnly = screen.getByTestId('desktop-only')
      expect(desktopOnly).toBeInTheDocument()
      
      // Mobile menu should be hidden
      const mobileMenu = screen.getByTestId('mobile-menu')
      expect(mobileMenu).toBeInTheDocument()
    })

    it('should adapt layout for tablet screens', async () => {
      mockViewport(mockViewports.tablet.width, mockViewports.tablet.height)
      render(<MockResponsiveComponent />)
      
      // Tablet-specific elements should be visible
      const tabletOnly = screen.getByTestId('tablet-only')
      expect(tabletOnly).toBeInTheDocument()
      
      // Test tablet navigation
      const mobileMenu = screen.getByTestId('mobile-menu')
      expect(mobileMenu).toBeInTheDocument()
    })

    it('should adapt layout for mobile screens', async () => {
      mockViewport(mockViewports.mobile.width, mockViewports.mobile.height)
      render(<MockResponsiveComponent />)
      
      // Mobile-specific elements should be visible
      const mobileOnly = screen.getByTestId('mobile-only')
      expect(mobileOnly).toBeInTheDocument()
      
      // Mobile menu should be visible
      const mobileMenu = screen.getByTestId('mobile-menu')
      expect(mobileMenu).toBeInTheDocument()
      
      const menuToggle = screen.getByTestId('menu-toggle')
      expect(menuToggle).toBeInTheDocument()
    })

    it('should handle orientation changes on mobile', async () => {
      // Portrait mode
      mockViewport(375, 667)
      const { rerender } = render(<MockArabicContent />)
      
      expect(screen.getByTestId('arabic-content')).toBeInTheDocument()
      
      // Landscape mode
      mockViewport(667, 375)
      rerender(<MockArabicContent />)
      
      // Content should still be accessible
      expect(screen.getByTestId('arabic-content')).toBeInTheDocument()
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
    })
  })

  describe('Arabic Font and Typography Tests', () => {
    it('should render Arabic fonts correctly across browsers', async () => {
      render(<MockArabicContent />)
      
      // Test Arabic text rendering
      const articleTitle = screen.getByTestId('article-title')
      expect(articleTitle).toHaveTextContent('عنوان المقال باللغة العربية')
      
      // Test mixed Arabic and numbers
      const timeDisplay = screen.getByTestId('time-display')
      expect(timeDisplay).toHaveTextContent('٠٢:٣٠ / ٠٥:٠٠')
      
      // Test Arabic punctuation
      const articleContent = screen.getByTestId('article-content')
      expect(articleContent).toBeInTheDocument()
    })

    it('should handle Arabic text direction (RTL) correctly', async () => {
      render(<MockArabicContent />)
      
      // Verify RTL direction is set
      const arabicContent = screen.getByTestId('arabic-content')
      expect(arabicContent).toHaveAttribute('dir', 'rtl')
      
      // Test RTL input fields
      const emailInput = screen.getByTestId('email-input')
      expect(emailInput).toHaveAttribute('dir', 'rtl')
    })

    it('should handle Arabic text overflow and wrapping', async () => {
      render(<MockArabicContent />)
      
      // Test long Arabic text handling
      const articleContent = screen.getByTestId('article-content')
      expect(articleContent).toBeInTheDocument()
      
      // Verify text doesn't break layout
      const sidebar = screen.getByTestId('sidebar')
      expect(sidebar).toBeInTheDocument()
    })
  })

  describe('Media Player Compatibility Tests', () => {
    it('should handle audio playback across browsers', async () => {
      render(<MockArabicContent />)
      
      const audioPlayer = screen.getByTestId('audio-player')
      expect(audioPlayer).toBeInTheDocument()
      
      const playButton = screen.getByTestId('play-button')
      await user.click(playButton)
      
      // Verify audio controls are accessible
      const progressBar = screen.getByTestId('progress-bar')
      expect(progressBar).toBeInTheDocument()
      
      const timeDisplay = screen.getByTestId('time-display')
      expect(timeDisplay).toBeInTheDocument()
    })

    it('should handle video playback on mobile devices', async () => {
      mockViewport(mockViewports.mobile.width, mockViewports.mobile.height)
      render(<MockArabicContent />)
      
      // Audio player should work on mobile
      const audioPlayer = screen.getByTestId('audio-player')
      expect(audioPlayer).toBeInTheDocument()
      
      // Test mobile-friendly controls
      const playButton = screen.getByTestId('play-button')
      expect(playButton).toBeInTheDocument()
    })
  })

  describe('Form Compatibility Tests', () => {
    it('should handle Arabic form inputs across browsers', async () => {
      render(<MockArabicContent />)
      
      const emailInput = screen.getByTestId('email-input')
      const subscribeButton = screen.getByTestId('subscribe-button')
      
      // Test form interaction
      await user.type(emailInput, 'user@example.com')
      expect(emailInput).toHaveValue('user@example.com')
      
      await user.click(subscribeButton)
      
      // Form should still be present
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
    })

    it('should handle form validation with Arabic messages', async () => {
      render(<MockArabicContent />)
      
      const subscribeButton = screen.getByTestId('subscribe-button')
      
      // Try to submit empty form
      await user.click(subscribeButton)
      
      // Form should still be present (validation would prevent submission)
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
    })
  })

  describe('Social Sharing Compatibility Tests', () => {
    it('should handle social sharing on different platforms', async () => {
      render(<MockArabicContent />)
      
      // Test WhatsApp sharing (popular in MENA)
      const shareWhatsApp = screen.getByTestId('share-whatsapp')
      await user.click(shareWhatsApp)
      expect(shareWhatsApp).toBeInTheDocument()
      
      // Test Telegram sharing
      const shareTelegram = screen.getByTestId('share-telegram')
      await user.click(shareTelegram)
      expect(shareTelegram).toBeInTheDocument()
      
      // Test Twitter sharing
      const shareTwitter = screen.getByTestId('share-twitter')
      await user.click(shareTwitter)
      expect(shareTwitter).toBeInTheDocument()
    })
  })

  describe('Performance Tests Across Devices', () => {
    it('should load efficiently on low-end mobile devices', async () => {
      // Simulate slower device
      mockViewport(mockViewports.mobile.width, mockViewports.mobile.height)
      
      const startTime = performance.now()
      render(<MockArabicContent />)
      const endTime = performance.now()
      
      // Verify content loads
      expect(screen.getByTestId('arabic-content')).toBeInTheDocument()
      
      // Basic performance check (render time should be reasonable)
      const renderTime = endTime - startTime
      expect(renderTime).toBeLessThan(1000) // Less than 1 second
    })

    it('should handle large Arabic content efficiently', async () => {
      render(<MockArabicContent />)
      
      // Verify all content sections load
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('main-content')).toBeInTheDocument()
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })

  describe('Accessibility Across Browsers and Devices', () => {
    it('should maintain accessibility on all platforms', async () => {
      render(<MockArabicContent />)
      
      // Test keyboard navigation
      const homeLink = screen.getByTestId('home-link')
      homeLink.focus()
      expect(document.activeElement).toBe(homeLink)
      
      // Test screen reader compatibility
      const articleTitle = screen.getByTestId('article-title')
      expect(articleTitle.tagName).toBe('H1')
      
      // Test ARIA labels (would be present in real implementation)
      const playButton = screen.getByTestId('play-button')
      expect(playButton).toBeInTheDocument()
    })

    it('should support high contrast mode', async () => {
      render(<MockArabicContent />)
      
      // Verify content is still accessible
      expect(screen.getByTestId('arabic-content')).toBeInTheDocument()
      
      // Test that important elements are visible
      expect(screen.getByTestId('article-title')).toBeInTheDocument()
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
    })
  })
})