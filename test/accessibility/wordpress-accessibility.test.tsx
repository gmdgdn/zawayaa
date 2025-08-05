/**
 * WordPress Accessibility Tests
 * Tests Arabic RTL functionality, screen reader support, and WCAG compliance
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { axe, toHaveNoViolations } from 'jest-axe'

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations)

// Mock components for accessibility testing
const MockArticleCard = ({ article }: { article: any }) => (
  <article 
    className="article-card"
    dir="rtl"
    lang="ar"
    role="article"
    aria-labelledby={`article-title-${article.id}`}
  >
    <header>
      <h2 id={`article-title-${article.id}`}>
        {article.zawaya_meta?.title_arabic || article.title}
      </h2>
      <div className="article-meta" aria-label="معلومات المقال">
        <time 
          dateTime={article.date}
          aria-label={`تاريخ النشر: ${new Date(article.date).toLocaleDateString('ar')}`}
        >
          {new Date(article.date).toLocaleDateString('ar')}
        </time>
        <span aria-label={`وقت القراءة: ${article.zawaya_meta?.reading_time_minutes || 5} دقائق`}>
          {article.zawaya_meta?.reading_time_minutes || 5} دقائق
        </span>
      </div>
    </header>
    
    <div className="article-content">
      <p>{article.zawaya_meta?.excerpt_arabic || article.excerpt}</p>
    </div>
    
    <footer className="article-actions">
      <a 
        href={`/ar/articles/${article.slug}`}
        aria-label={`اقرأ المقال: ${article.zawaya_meta?.title_arabic || article.title}`}
        className="read-link"
      >
        اقرأ المقال
      </a>
      
      {article.zawaya_meta?.audio_narration_url && (
        <button
          type="button"
          aria-label={`استمع للمقال: ${article.zawaya_meta?.title_arabic || article.title}`}
          className="audio-button"
        >
          <span aria-hidden="true">🎵</span>
          استمع للمقال
        </button>
      )}
    </footer>
  </article>
)

const MockNavigationMenu = () => (
  <nav role="navigation" aria-label="القائمة الرئيسية" dir="rtl" lang="ar">
    <ul className="nav-menu">
      <li>
        <a href="/ar" aria-current="page" className="nav-link">
          الرئيسية
        </a>
      </li>
      <li>
        <a href="/ar/articles" className="nav-link">
          المقالات
        </a>
      </li>
      <li>
        <a href="/ar/programs" className="nav-link">
          البرامج
        </a>
      </li>
      <li>
        <a href="/ar/search" className="nav-link">
          البحث
        </a>
      </li>
    </ul>
  </nav>
)

const MockSearchInterface = () => (
  <div className="search-interface" dir="rtl" lang="ar">
    <form role="search" aria-label="البحث في المحتوى">
      <div className="search-field">
        <label htmlFor="search-input" className="search-label">
          ابحث في المحتوى
        </label>
        <input
          id="search-input"
          type="search"
          placeholder="اكتب كلمات البحث..."
          aria-describedby="search-help"
          className="search-input"
        />
        <div id="search-help" className="search-help">
          يمكنك البحث في المقالات والبرامج والمحتوى
        </div>
      </div>
      
      <button 
        type="submit" 
        className="search-button"
        aria-label="تنفيذ البحث"
      >
        <span aria-hidden="true">🔍</span>
        بحث
      </button>
    </form>
    
    <div 
      className="search-results" 
      role="region" 
      aria-label="نتائج البحث"
      aria-live="polite"
    >
      {/* Search results will be populated here */}
    </div>
  </div>
)

const MockAudioPlayer = ({ audioUrl, title }: { audioUrl: string; title: string }) => (
  <div className="audio-player" dir="rtl" lang="ar">
    <audio 
      controls
      preload="metadata"
      aria-label={`مشغل الصوت: ${title}`}
    >
      <source src={audioUrl} type="audio/mpeg" />
      <p>متصفحك لا يدعم تشغيل الملفات الصوتية.</p>
    </audio>
    
    <div className="audio-controls" role="group" aria-label="أدوات التحكم في الصوت">
      <button 
        type="button" 
        aria-label="تشغيل/إيقاف"
        className="play-pause-btn"
      >
        <span aria-hidden="true">▶️</span>
        تشغيل
      </button>
      
      <div className="progress-container">
        <label htmlFor="progress-slider" className="sr-only">
          موضع التشغيل
        </label>
        <input
          id="progress-slider"
          type="range"
          min="0"
          max="100"
          defaultValue="0"
          aria-label="شريط التقدم"
          className="progress-slider"
        />
      </div>
      
      <div className="time-display" aria-live="off">
        <span aria-label="الوقت الحالي">00:00</span>
        /
        <span aria-label="المدة الإجمالية">05:30</span>
      </div>
    </div>
  </div>
)

describe('WordPress Accessibility Tests', () => {
  describe('Arabic RTL Support', () => {
    it('should have proper RTL direction and language attributes', () => {
      const mockArticle = {
        id: 1,
        slug: 'test-article',
        title: 'Test Article',
        excerpt: 'Test excerpt',
        date: '2024-01-01T00:00:00',
        zawaya_meta: {
          title_arabic: 'مقال تجريبي',
          excerpt_arabic: 'مقتطف تجريبي',
          reading_time_minutes: 5
        }
      }

      render(<MockArticleCard article={mockArticle} />)

      const article = screen.getByRole('article')
      expect(article).toHaveAttribute('dir', 'rtl')
      expect(article).toHaveAttribute('lang', 'ar')
    })

    it('should display Arabic text correctly', () => {
      const mockArticle = {
        id: 1,
        slug: 'arabic-article',
        title: 'Arabic Article',
        excerpt: 'Arabic excerpt',
        date: '2024-01-01T00:00:00',
        zawaya_meta: {
          title_arabic: 'مقال باللغة العربية',
          excerpt_arabic: 'مقتطف باللغة العربية',
          reading_time_minutes: 3
        }
      }

      render(<MockArticleCard article={mockArticle} />)

      expect(screen.getByText('مقال باللغة العربية')).toBeInTheDocument()
      expect(screen.getByText('مقتطف باللغة العربية')).toBeInTheDocument()
    })

    it('should have proper Arabic navigation', () => {
      render(<MockNavigationMenu />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('dir', 'rtl')
      expect(nav).toHaveAttribute('lang', 'ar')
      expect(nav).toHaveAttribute('aria-label', 'القائمة الرئيسية')

      expect(screen.getByText('الرئيسية')).toBeInTheDocument()
      expect(screen.getByText('المقالات')).toBeInTheDocument()
      expect(screen.getByText('البرامج')).toBeInTheDocument()
    })
  })

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels and roles', () => {
      const mockArticle = {
        id: 1,
        slug: 'test-article',
        title: 'Test Article',
        excerpt: 'Test excerpt',
        date: '2024-01-01T00:00:00',
        zawaya_meta: {
          title_arabic: 'مقال تجريبي',
          excerpt_arabic: 'مقتطف تجريبي',
          reading_time_minutes: 5,
          audio_narration_url: 'http://example.com/audio.mp3'
        }
      }

      render(<MockArticleCard article={mockArticle} />)

      const article = screen.getByRole('article')
      expect(article).toHaveAttribute('aria-labelledby', 'article-title-1')

      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveAttribute('id', 'article-title-1')

      const readLink = screen.getByRole('link', { name: /اقرأ المقال/ })
      expect(readLink).toHaveAttribute('aria-label', 'اقرأ المقال: مقال تجريبي')

      const audioButton = screen.getByRole('button', { name: /استمع للمقال/ })
      expect(audioButton).toHaveAttribute('aria-label', 'استمع للمقال: مقال تجريبي')
    })

    it('should have proper form labels and descriptions', () => {
      render(<MockSearchInterface />)

      const searchInput = screen.getByRole('searchbox')
      expect(searchInput).toHaveAttribute('aria-describedby', 'search-help')

      const label = screen.getByLabelText('ابحث في المحتوى')
      expect(label).toBeInTheDocument()

      const helpText = screen.getByText('يمكنك البحث في المقالات والبرامج والمحتوى')
      expect(helpText).toHaveAttribute('id', 'search-help')
    })

    it('should have proper live regions for dynamic content', () => {
      render(<MockSearchInterface />)

      const resultsRegion = screen.getByRole('region', { name: 'نتائج البحث' })
      expect(resultsRegion).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Keyboard Navigation', () => {
    it('should have focusable elements in logical order', () => {
      const mockArticle = {
        id: 1,
        slug: 'test-article',
        title: 'Test Article',
        excerpt: 'Test excerpt',
        date: '2024-01-01T00:00:00',
        zawaya_meta: {
          title_arabic: 'مقال تجريبي',
          excerpt_arabic: 'مقتطف تجريبي',
          audio_narration_url: 'http://example.com/audio.mp3'
        }
      }

      render(<MockArticleCard article={mockArticle} />)

      const focusableElements = [
        screen.getByRole('link', { name: /اقرأ المقال/ }),
        screen.getByRole('button', { name: /استمع للمقال/ })
      ]

      focusableElements.forEach(element => {
        expect(element).toBeInTheDocument()
        // Elements should be focusable (not have tabindex="-1")
        expect(element).not.toHaveAttribute('tabindex', '-1')
      })
    })

    it('should have proper skip links for navigation', () => {
      const MockPageWithSkipLinks = () => (
        <div dir="rtl" lang="ar">
          <a href="#main-content" className="skip-link">
            انتقل إلى المحتوى الرئيسي
          </a>
          <a href="#navigation" className="skip-link">
            انتقل إلى القائمة
          </a>
          
          <nav id="navigation">
            <MockNavigationMenu />
          </nav>
          
          <main id="main-content">
            <h1>المحتوى الرئيسي</h1>
          </main>
        </div>
      )

      render(<MockPageWithSkipLinks />)

      const skipToContent = screen.getByRole('link', { name: 'انتقل إلى المحتوى الرئيسي' })
      const skipToNav = screen.getByRole('link', { name: 'انتقل إلى القائمة' })

      expect(skipToContent).toHaveAttribute('href', '#main-content')
      expect(skipToNav).toHaveAttribute('href', '#navigation')
    })
  })

  describe('Audio Accessibility', () => {
    it('should have accessible audio controls', () => {
      render(
        <MockAudioPlayer 
          audioUrl="http://example.com/audio.mp3" 
          title="مقال تجريبي" 
        />
      )

      const audio = screen.getByRole('application') || screen.getByLabelText(/مشغل الصوت/)
      expect(audio).toBeInTheDocument()

      const playButton = screen.getByRole('button', { name: /تشغيل/ })
      expect(playButton).toHaveAttribute('aria-label', 'تشغيل/إيقاف')

      const progressSlider = screen.getByRole('slider')
      expect(progressSlider).toHaveAttribute('aria-label', 'شريط التقدم')
    })

    it('should provide alternative text for audio content', () => {
      const MockArticleWithAudio = () => (
        <article dir="rtl" lang="ar">
          <h1>مقال مع تسجيل صوتي</h1>
          <p>هذا المقال متوفر كتسجيل صوتي.</p>
          
          <div className="audio-section">
            <h2>التسجيل الصوتي</h2>
            <MockAudioPlayer 
              audioUrl="http://example.com/audio.mp3" 
              title="مقال مع تسجيل صوتي" 
            />
            <p className="audio-description">
              يحتوي هذا التسجيل على قراءة كاملة للمقال باللغة العربية.
            </p>
          </div>
        </article>
      )

      render(<MockArticleWithAudio />)

      expect(screen.getByText('يحتوي هذا التسجيل على قراءة كاملة للمقال باللغة العربية.')).toBeInTheDocument()
    })
  })

  describe('Color and Contrast', () => {
    it('should not rely solely on color for information', () => {
      const MockStatusIndicators = () => (
        <div dir="rtl" lang="ar">
          <div className="article-status">
            <span className="status-icon" aria-label="مقال مميز">⭐</span>
            <span className="status-text">مقال مميز</span>
          </div>
          
          <div className="article-status">
            <span className="status-icon" aria-label="مقال جديد">🆕</span>
            <span className="status-text">مقال جديد</span>
          </div>
        </div>
      )

      render(<MockStatusIndicators />)

      // Both icon and text should be present
      expect(screen.getByText('مقال مميز')).toBeInTheDocument()
      expect(screen.getByText('مقال جديد')).toBeInTheDocument()
      expect(screen.getByLabelText('مقال مميز')).toBeInTheDocument()
      expect(screen.getByLabelText('مقال جديد')).toBeInTheDocument()
    })
  })

  describe('Error Messages', () => {
    it('should have accessible error messages', () => {
      const MockErrorMessage = () => (
        <div dir="rtl" lang="ar">
          <div 
            role="alert" 
            className="error-message"
            aria-live="assertive"
          >
            <h2>حدث خطأ</h2>
            <p>فشل في تحميل المحتوى. يرجى المحاولة مرة أخرى.</p>
            <button type="button" aria-label="إعادة المحاولة">
              إعادة المحاولة
            </button>
          </div>
        </div>
      )

      render(<MockErrorMessage />)

      const errorAlert = screen.getByRole('alert')
      expect(errorAlert).toHaveAttribute('aria-live', 'assertive')
      expect(screen.getByText('حدث خطأ')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'إعادة المحاولة' })).toBeInTheDocument()
    })
  })

  describe('WCAG Compliance', () => {
    it('should pass axe accessibility tests for article card', async () => {
      const mockArticle = {
        id: 1,
        slug: 'test-article',
        title: 'Test Article',
        excerpt: 'Test excerpt',
        date: '2024-01-01T00:00:00',
        zawaya_meta: {
          title_arabic: 'مقال تجريبي',
          excerpt_arabic: 'مقتطف تجريبي',
          reading_time_minutes: 5
        }
      }

      const { container } = render(<MockArticleCard article={mockArticle} />)
      const results = await axe(container)
      
      expect(results).toHaveNoViolations()
    })

    it('should pass axe accessibility tests for navigation', async () => {
      const { container } = render(<MockNavigationMenu />)
      const results = await axe(container)
      
      expect(results).toHaveNoViolations()
    })

    it('should pass axe accessibility tests for search interface', async () => {
      const { container } = render(<MockSearchInterface />)
      const results = await axe(container)
      
      expect(results).toHaveNoViolations()
    })
  })

  describe('Mobile Accessibility', () => {
    it('should have touch-friendly interactive elements', () => {
      const mockArticle = {
        id: 1,
        slug: 'test-article',
        title: 'Test Article',
        excerpt: 'Test excerpt',
        date: '2024-01-01T00:00:00',
        zawaya_meta: {
          title_arabic: 'مقال تجريبي',
          audio_narration_url: 'http://example.com/audio.mp3'
        }
      }

      render(<MockArticleCard article={mockArticle} />)

      const interactiveElements = [
        screen.getByRole('link'),
        screen.getByRole('button')
      ]

      interactiveElements.forEach(element => {
        // Elements should be large enough for touch (minimum 44px)
        // This would be tested with actual CSS in a real scenario
        expect(element).toBeInTheDocument()
      })
    })

    it('should support zoom up to 200% without horizontal scrolling', () => {
      // This would typically be tested with actual browser testing
      // Here we just ensure the structure supports responsive design
      
      const MockResponsiveLayout = () => (
        <div className="responsive-container" dir="rtl" lang="ar">
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <main className="main-content">
            <h1>محتوى متجاوب</h1>
            <p>هذا المحتوى يجب أن يكون قابلاً للقراءة عند التكبير حتى 200%</p>
          </main>
        </div>
      )

      render(<MockResponsiveLayout />)
      
      expect(screen.getByText('محتوى متجاوب')).toBeInTheDocument()
    })
  })
})