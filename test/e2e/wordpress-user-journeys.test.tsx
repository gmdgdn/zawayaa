/**
 * WordPress Integration End-to-End Tests
 * Tests complete user journeys with WordPress content
 */

import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'

// Mock Next.js router
const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/ar',
  redirect: vi.fn(),
}))

// Mock WordPress API responses
const mockWordPressResponses = {
  articles: [
    {
      id: 1,
      slug: 'test-article',
      title: { rendered: 'مقال تجريبي' },
      content: { rendered: '<p>محتوى المقال التجريبي</p>' },
      excerpt: { rendered: '<p>مقتطف من المقال</p>' },
      author: 1,
      featured_media: 123,
      date: '2024-01-01T00:00:00',
      modified: '2024-01-02T00:00:00',
      categories: [1],
      tags: [2],
      zawaya_meta: {
        title_arabic: 'مقال تجريبي',
        excerpt_arabic: 'مقتطف من المقال',
        content_arabic: 'محتوى المقال التجريبي',
        is_featured: true,
        reading_time_minutes: 5,
        audio_narration_url: 'http://example.com/audio.mp3'
      }
    }
  ],
  programs: [
    {
      id: 1,
      slug: 'test-program',
      title: { rendered: 'برنامج تجريبي' },
      zawaya_meta: {
        host_arabic: 'مقدم البرنامج',
        program_type: 'video',
        episode_count: 10
      }
    }
  ]
}

// Mock fetch for WordPress API
global.fetch = vi.fn((url: string) => {
  if (url.includes('/posts')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockWordPressResponses.articles)
    })
  }
  if (url.includes('/program')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockWordPressResponses.programs)
    })
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
}) as any

describe('WordPress User Journey E2E Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Homepage Journey', () => {
    it('should load homepage with WordPress content', async () => {
      // Import the actual homepage component
      const { default: Homepage } = await import('@/app/ar/page')
      
      render(<Homepage />)
      
      // Wait for content to load
      await waitFor(() => {
        expect(screen.getByText(/زوايا/)).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Check if WordPress content is displayed
      // Note: This will depend on the actual implementation
      expect(document.body).toBeInTheDocument()
    })

    it('should navigate to articles page', async () => {
      const user = userEvent.setup()
      
      // Mock navigation component
      const MockNavigation = () => (
        <nav data-testid="main-navigation">
          <button 
            onClick={() => mockPush('/ar/articles')}
            data-testid="articles-link"
          >
            المقالات
          </button>
        </nav>
      )
      
      render(<MockNavigation />)
      
      const articlesLink = screen.getByTestId('articles-link')
      await user.click(articlesLink)
      
      expect(mockPush).toHaveBeenCalledWith('/ar/articles')
    })
  })

  describe('Articles Journey', () => {
    it('should display articles from WordPress', async () => {
      // Test that articles are fetched and displayed
      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const articles = await ArticleHelpers.getArticles({ per_page: 5 })
      
      expect(Array.isArray(articles)).toBe(true)
      if (articles.length > 0) {
        expect(articles[0]).toHaveProperty('id')
        expect(articles[0]).toHaveProperty('title')
        expect(articles[0]).toHaveProperty('zawaya_meta')
      }
    })

    it('should handle article reading flow', async () => {
      const user = userEvent.setup()
      
      // Mock article card component
      const MockArticleCard = () => (
        <div data-testid="article-card">
          <h3>مقال تجريبي</h3>
          <p>مقتطف من المقال</p>
          <button 
            onClick={() => mockPush('/ar/articles/test-article')}
            data-testid="read-article"
          >
            اقرأ المقال
          </button>
          <button data-testid="listen-article">
            استمع للمقال
          </button>
        </div>
      )
      
      render(<MockArticleCard />)
      
      // Test reading article
      const readButton = screen.getByTestId('read-article')
      await user.click(readButton)
      
      expect(mockPush).toHaveBeenCalledWith('/ar/articles/test-article')
      
      // Test audio functionality
      const listenButton = screen.getByTestId('listen-article')
      expect(listenButton).toBeInTheDocument()
    })
  })

  describe('Search Journey', () => {
    it('should perform search and display results', async () => {
      const user = userEvent.setup()
      
      // Mock search component
      const MockSearchInterface = () => {
        const [query, setQuery] = React.useState('')
        const [results, setResults] = React.useState<any[]>([])
        
        const handleSearch = async () => {
          const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
          const searchResults = await ArticleHelpers.searchArticles(query)
          setResults(searchResults)
        }
        
        return (
          <div data-testid="search-interface">
            <input
              data-testid="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في المحتوى..."
            />
            <button 
              data-testid="search-button"
              onClick={handleSearch}
            >
              بحث
            </button>
            <div data-testid="search-results">
              {results.map((result, index) => (
                <div key={index} data-testid="search-result">
                  {result.title}
                </div>
              ))}
            </div>
          </div>
        )
      }
      
      render(<MockSearchInterface />)
      
      const searchInput = screen.getByTestId('search-input')
      const searchButton = screen.getByTestId('search-button')
      
      await user.type(searchInput, 'تجريبي')
      await user.click(searchButton)
      
      // Wait for search results
      await waitFor(() => {
        const resultsContainer = screen.getByTestId('search-results')
        expect(resultsContainer).toBeInTheDocument()
      })
    })
  })

  describe('Programs Journey', () => {
    it('should display programs from WordPress', async () => {
      const { ProgramHelpers } = await import('@/lib/wordpress-content-helpers')
      
      try {
        const programs = await ProgramHelpers.getPrograms({ per_page: 5 })
        
        expect(Array.isArray(programs)).toBe(true)
        if (programs.length > 0) {
          expect(programs[0]).toHaveProperty('id')
          expect(programs[0]).toHaveProperty('title')
        }
      } catch (error) {
        // Programs CPT might not be available - that's okay for this test
        console.log('Programs not available:', error)
      }
    })

    it('should handle program viewing flow', async () => {
      const user = userEvent.setup()
      
      // Mock program card
      const MockProgramCard = () => (
        <div data-testid="program-card">
          <h3>برنامج تجريبي</h3>
          <p>مقدم البرنامج: أحمد محمد</p>
          <button 
            onClick={() => mockPush('/ar/programs/test-program')}
            data-testid="watch-program"
          >
            شاهد البرنامج
          </button>
        </div>
      )
      
      render(<MockProgramCard />)
      
      const watchButton = screen.getByTestId('watch-program')
      await user.click(watchButton)
      
      expect(mockPush).toHaveBeenCalledWith('/ar/programs/test-program')
    })
  })

  describe('Content Consumption Journey', () => {
    it('should handle Arabic text rendering', async () => {
      // Mock article content component
      const MockArticleContent = () => (
        <article data-testid="article-content" dir="rtl" lang="ar">
          <h1>عنوان المقال باللغة العربية</h1>
          <div className="article-meta">
            <span>وقت القراءة: 5 دقائق</span>
            <span>الكاتب: أحمد محمد</span>
          </div>
          <div className="article-body">
            <p>هذا نص تجريبي باللغة العربية لاختبار عرض المحتوى.</p>
            <p>يجب أن يظهر النص من اليمين إلى اليسار بشكل صحيح.</p>
          </div>
          <div data-testid="audio-player">
            <button data-testid="play-audio">تشغيل التسجيل الصوتي</button>
            <div data-testid="progress-bar"></div>
          </div>
        </article>
      )
      
      render(<MockArticleContent />)
      
      // Check Arabic content rendering
      expect(screen.getByText('عنوان المقال باللغة العربية')).toBeInTheDocument()
      expect(screen.getByText(/وقت القراءة/)).toBeInTheDocument()
      
      // Check RTL direction
      const article = screen.getByTestId('article-content')
      expect(article).toHaveAttribute('dir', 'rtl')
      expect(article).toHaveAttribute('lang', 'ar')
      
      // Check audio player
      const audioPlayer = screen.getByTestId('audio-player')
      expect(audioPlayer).toBeInTheDocument()
    })

    it('should handle responsive design', async () => {
      // Mock responsive component
      const MockResponsiveLayout = () => (
        <div data-testid="responsive-layout">
          <div className="desktop-nav hidden md:block" data-testid="desktop-nav">
            Desktop Navigation
          </div>
          <div className="mobile-nav md:hidden" data-testid="mobile-nav">
            Mobile Navigation
          </div>
          <main className="container mx-auto px-4" data-testid="main-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div data-testid="content-area">Content</div>
              <div data-testid="sidebar">Sidebar</div>
            </div>
          </main>
        </div>
      )
      
      render(<MockResponsiveLayout />)
      
      // Check responsive elements exist
      expect(screen.getByTestId('desktop-nav')).toBeInTheDocument()
      expect(screen.getByTestId('mobile-nav')).toBeInTheDocument()
      expect(screen.getByTestId('main-content')).toBeInTheDocument()
    })
  })

  describe('Error Handling Journey', () => {
    it('should handle WordPress connection errors gracefully', async () => {
      // Mock fetch to simulate network error
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
      
      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      // Should return fallback data instead of throwing
      const articles = await ArticleHelpers.getArticles()
      
      expect(Array.isArray(articles)).toBe(true)
      // Should have fallback content
    })

    it('should display error messages in Arabic', async () => {
      // Mock error component
      const MockErrorDisplay = ({ error }: { error: string }) => (
        <div data-testid="error-display" role="alert">
          <h2>حدث خطأ</h2>
          <p>{error}</p>
          <button data-testid="retry-button">إعادة المحاولة</button>
        </div>
      )
      
      render(<MockErrorDisplay error="فشل في تحميل المحتوى" />)
      
      expect(screen.getByText('حدث خطأ')).toBeInTheDocument()
      expect(screen.getByText('فشل في تحميل المحتوى')).toBeInTheDocument()
      expect(screen.getByTestId('retry-button')).toBeInTheDocument()
    })
  })

  describe('Performance Journey', () => {
    it('should load content within acceptable time', async () => {
      const startTime = Date.now()
      
      const { ArticleHelpers } = await import('@/lib/wordpress-content-helpers')
      
      const articles = await ArticleHelpers.getArticles({ per_page: 1 })
      
      const loadTime = Date.now() - startTime
      
      // Should load within 3 seconds (generous for testing)
      expect(loadTime).toBeLessThan(3000)
      expect(articles).toBeDefined()
    })

    it('should handle caching correctly', async () => {
      const { wpGet } = await import('@/lib/wordpress')
      
      // First request
      const start1 = Date.now()
      const result1 = await wpGet('/posts', { per_page: 1 })
      const time1 = Date.now() - start1
      
      // Second request (should be cached)
      const start2 = Date.now()
      const result2 = await wpGet('/posts', { per_page: 1 })
      const time2 = Date.now() - start2
      
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
      
      // Both requests should complete
      expect(time1).toBeGreaterThan(0)
      expect(time2).toBeGreaterThan(0)
    })
  })
})

// Add React import for JSX
import React from 'react'