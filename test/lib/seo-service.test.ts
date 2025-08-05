import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SEOService } from '@/lib/seo-service'

describe('SEOService - Arabic SEO Optimization', () => {
  let seoService: SEOService
  
  beforeEach(() => {
    seoService = new SEOService()
    vi.clearAllMocks()
  })

  describe('Arabic Meta Tags Generation', () => {
    it('should generate Arabic meta tags for articles', () => {
      const article = {
        id: 'article-123',
        title_ar: 'مقال عن السياسة العربية المعاصرة',
        content_ar: 'هذا مقال يتحدث عن الوضع السياسي في المنطقة العربية والتحديات المعاصرة التي تواجه الدول العربية في القرن الحادي والعشرين.',
        category_ar: 'آراء سياسية',
        author_name: 'د. أحمد محمد',
        created_at: '2024-01-15T10:00:00Z'
      }

      const metaTags = seoService.generateArticleMetaTags(article, 'ar')

      expect(metaTags.title).toBe('مقال عن السياسة العربية المعاصرة | زوايا')
      expect(metaTags.description).toContain('هذا مقال يتحدث عن الوضع السياسي')
      expect(metaTags.keywords).toContain('السياسة العربية')
      expect(metaTags.author).toBe('د. أحمد محمد')
      expect(metaTags.lang).toBe('ar')
      expect(metaTags.dir).toBe('rtl')
    })

    it('should generate Arabic meta tags for programs', () => {
      const program = {
        id: 'program-123',
        title_ar: 'برنامج الثقافة والفكر',
        description_ar: 'برنامج أسبوعي يناقش القضايا الثقافية والفكرية في العالم العربي',
        host_name: 'د. فاطمة الزهراء',
        format: 'video' as const
      }

      const metaTags = seoService.generateProgramMetaTags(program, 'ar')

      expect(metaTags.title).toBe('برنامج الثقافة والفكر | زوايا')
      expect(metaTags.description).toBe('برنامج أسبوعي يناقش القضايا الثقافية والفكرية في العالم العربي')
      expect(metaTags.keywords).toContain('الثقافة والفكر')
      expect(metaTags.lang).toBe('ar')
      expect(metaTags.dir).toBe('rtl')
    })

    it('should truncate long Arabic descriptions appropriately', () => {
      const longContent = 'هذا نص طويل جداً '.repeat(50)
      const article = {
        id: 'article-123',
        title_ar: 'مقال طويل',
        content_ar: longContent,
        category_ar: 'ثقافة',
        author_name: 'كاتب',
        created_at: '2024-01-15T10:00:00Z'
      }

      const metaTags = seoService.generateArticleMetaTags(article, 'ar')

      expect(metaTags.description.length).toBeLessThanOrEqual(160)
      expect(metaTags.description).toMatch(/\.\.\.$/)
    })
  })

  describe('Arabic Open Graph Tags', () => {
    it('should generate Arabic Open Graph tags', () => {
      const content = {
        title_ar: 'مقال مهم عن التكنولوجيا',
        content_ar: 'مقال يتحدث عن تأثير التكنولوجيا على المجتمع العربي',
        image_url: 'https://example.com/image.jpg',
        url: '/ar/articles/tech-article'
      }

      const ogTags = seoService.generateOpenGraphTags(content, 'ar')

      expect(ogTags['og:title']).toBe('مقال مهم عن التكنولوجيا')
      expect(ogTags['og:description']).toContain('مقال يتحدث عن تأثير التكنولوجيا')
      expect(ogTags['og:image']).toBe('https://example.com/image.jpg')
      expect(ogTags['og:url']).toBe('https://zawaya.com/ar/articles/tech-article')
      expect(ogTags['og:locale']).toBe('ar_SA')
      expect(ogTags['og:site_name']).toBe('زوايا')
    })

    it('should generate Twitter Card tags for Arabic content', () => {
      const content = {
        title_ar: 'مقال تويتر',
        content_ar: 'محتوى للمشاركة على تويتر',
        image_url: 'https://example.com/twitter-image.jpg'
      }

      const twitterTags = seoService.generateTwitterCardTags(content, 'ar')

      expect(twitterTags['twitter:card']).toBe('summary_large_image')
      expect(twitterTags['twitter:title']).toBe('مقال تويتر')
      expect(twitterTags['twitter:description']).toContain('محتوى للمشاركة')
      expect(twitterTags['twitter:image']).toBe('https://example.com/twitter-image.jpg')
    })
  })

  describe('Arabic Structured Data', () => {
    it('should generate JSON-LD for Arabic articles', () => {
      const article = {
        id: 'article-123',
        title_ar: 'مقال عن الذكاء الاصطناعي',
        content_ar: 'مقال يتحدث عن تطبيقات الذكاء الاصطناعي في العالم العربي',
        author_name: 'د. سارة أحمد',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-16T12:00:00Z',
        image_url: 'https://example.com/ai-article.jpg',
        category_ar: 'تكنولوجيا'
      }

      const jsonLd = seoService.generateArticleJsonLd(article, 'ar')

      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('Article')
      expect(jsonLd.headline).toBe('مقال عن الذكاء الاصطناعي')
      expect(jsonLd.author.name).toBe('د. سارة أحمد')
      expect(jsonLd.publisher.name).toBe('زوايا')
      expect(jsonLd.inLanguage).toBe('ar')
    })

    it('should generate JSON-LD for Arabic programs', () => {
      const program = {
        id: 'program-123',
        title_ar: 'برنامج التقنية والمستقبل',
        description_ar: 'برنامج يناقش مستقبل التقنية في العالم العربي',
        host_name: 'م. خالد العتيبي',
        format: 'video' as const,
        image_url: 'https://example.com/program.jpg'
      }

      const jsonLd = seoService.generateProgramJsonLd(program, 'ar')

      expect(jsonLd['@type']).toBe('VideoObject')
      expect(jsonLd.name).toBe('برنامج التقنية والمستقبل')
      expect(jsonLd.description).toBe('برنامج يناقش مستقبل التقنية في العالم العربي')
      expect(jsonLd.inLanguage).toBe('ar')
    })

    it('should generate breadcrumb JSON-LD for Arabic pages', () => {
      const breadcrumbs = [
        { name: 'الرئيسية', url: '/ar' },
        { name: 'المقالات', url: '/ar/articles' },
        { name: 'آراء سياسية', url: '/ar/articles/political' },
        { name: 'مقال محدد', url: '/ar/articles/specific-article' }
      ]

      const jsonLd = seoService.generateBreadcrumbJsonLd(breadcrumbs)

      expect(jsonLd['@type']).toBe('BreadcrumbList')
      expect(jsonLd.itemListElement).toHaveLength(4)
      expect(jsonLd.itemListElement[0].name).toBe('الرئيسية')
      expect(jsonLd.itemListElement[3].name).toBe('مقال محدد')
    })
  })

  describe('Arabic URL Optimization', () => {
    it('should generate SEO-friendly Arabic URLs', () => {
      const title = 'مقال عن الذكاء الاصطناعي والتكنولوجيا المتقدمة'
      const slug = seoService.generateArabicSlug(title)

      expect(slug).toMatch(/^[a-z0-9-]+$/)
      expect(slug).not.toContain(' ')
      expect(slug.length).toBeLessThanOrEqual(60)
    })

    it('should handle Arabic diacritics in URL generation', () => {
      const titleWithDiacritics = 'الكِتابُ المُقَدَّسُ والثَّقافَةُ العَرَبِيَّةُ'
      const slug = seoService.generateArabicSlug(titleWithDiacritics)

      expect(slug).not.toContain('ُ')
      expect(slug).not.toContain('َ')
      expect(slug).not.toContain('ِ')
    })

    it('should generate canonical URLs for Arabic content', () => {
      const path = '/ar/articles/tech-article'
      const canonical = seoService.generateCanonicalUrl(path)

      expect(canonical).toBe('https://zawaya.com/ar/articles/tech-article')
    })
  })

  describe('Arabic Sitemap Generation', () => {
    it('should generate sitemap entries for Arabic content', () => {
      const articles = [
        {
          id: '1',
          slug: 'article-1',
          updated_at: '2024-01-15T10:00:00Z',
          priority: 0.8
        },
        {
          id: '2',
          slug: 'article-2',
          updated_at: '2024-01-16T10:00:00Z',
          priority: 0.7
        }
      ]

      const sitemapEntries = seoService.generateSitemapEntries(articles, 'articles', 'ar')

      expect(sitemapEntries).toHaveLength(2)
      expect(sitemapEntries[0].url).toBe('https://zawaya.com/ar/articles/article-1')
      expect(sitemapEntries[0].lastmod).toBe('2024-01-15T10:00:00Z')
      expect(sitemapEntries[0].priority).toBe(0.8)
      expect(sitemapEntries[0].changefreq).toBe('weekly')
    })

    it('should include hreflang for multilingual content', () => {
      const content = {
        id: '1',
        slug_ar: 'arabic-article',
        slug_en: 'english-article',
        updated_at: '2024-01-15T10:00:00Z'
      }

      const sitemapEntry = seoService.generateMultilingualSitemapEntry(content, 'articles')

      expect(sitemapEntry.alternates).toHaveLength(2)
      expect(sitemapEntry.alternates[0].hreflang).toBe('ar')
      expect(sitemapEntry.alternates[0].href).toBe('https://zawaya.com/ar/articles/arabic-article')
      expect(sitemapEntry.alternates[1].hreflang).toBe('en')
      expect(sitemapEntry.alternates[1].href).toBe('https://zawaya.com/en/articles/english-article')
    })
  })

  describe('Performance Optimization', () => {
    it('should optimize meta tags for Core Web Vitals', () => {
      const optimizedTags = seoService.optimizeForCoreWebVitals({
        preloadFonts: ['GE_SS_Two', 'Inter'],
        criticalCSS: true,
        lazyImages: true
      })

      expect(optimizedTags).toContain('preload')
      expect(optimizedTags).toContain('font-display: swap')
    })

    it('should generate resource hints for Arabic fonts', () => {
      const resourceHints = seoService.generateResourceHints('ar')

      expect(resourceHints).toContain('preconnect')
      expect(resourceHints).toContain('dns-prefetch')
      expect(resourceHints.some(hint => hint.includes('fonts.googleapis.com'))).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle missing content gracefully', () => {
      const metaTags = seoService.generateArticleMetaTags(null, 'ar')

      expect(metaTags.title).toBe('زوايا - منصة النشر الفكري العربي')
      expect(metaTags.description).toContain('منصة زوايا')
      expect(metaTags.lang).toBe('ar')
    })

    it('should handle invalid language codes', () => {
      const article = {
        id: 'article-123',
        title_ar: 'مقال تجريبي',
        content_ar: 'محتوى تجريبي',
        category_ar: 'عام',
        author_name: 'كاتب',
        created_at: '2024-01-15T10:00:00Z'
      }

      const metaTags = seoService.generateArticleMetaTags(article, 'invalid' as any)

      expect(metaTags.lang).toBe('ar') // Should default to Arabic
      expect(metaTags.dir).toBe('rtl')
    })
  })
})