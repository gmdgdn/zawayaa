import { describe, it, expect } from 'vitest'
import { SEOService, type SEOData } from '@/lib/seo-service'

describe('SEOService', () => {
  const seoService = new SEOService()
  const path = '/ar/test-article'
  const baseData: SEOData = {
    title: 'مقال تجريبي',
    description: 'هذا وصف المقال التجريبي.',
    language: 'ar',
    type: 'article',
    author: 'كاتب تجريبي',
    publishedTime: '2024-01-01T12:00:00Z',
    modifiedTime: '2024-01-02T12:00:00Z',
    section: 'أخبار',
    tags: ['تجريبي', 'عربي'],
    imageUrl: 'https://example.com/image.jpg',
    readTime: 5,
  }

  it('should generate comprehensive metadata', () => {
    const metadata = seoService.generateMetadata(baseData, path)

    expect(metadata.title).toBe('مقال تجريبي | زوايا | Zawaya')
    expect(metadata.description).toBe('هذا وصف المقال التجريبي.')
    expect(metadata.openGraph?.title).toBe('مقال تجريبي | زوايا | Zawaya')
    expect(metadata.twitter?.card).toBe('summary_large_image')
    expect(metadata.alternates?.canonical).toBe('https://zawaya.org/ar/test-article')
  })

  it('should generate Article structured data', () => {
    const sd = seoService.generateStructuredData(baseData, path) as any
    expect(sd['@type']).toBe('Article')
    expect(sd.headline).toBe('مقال تجريبي')
    expect(sd.author.name).toBe('كاتب تجريبي')
  })

  it('should generate Podcast structured data', () => {
    const podcastData: SEOData = { ...baseData, type: 'podcast', audioUrl: 'https://example.com/audio.mp3', duration: 300 }
    const sd = seoService.generateStructuredData(podcastData, path) as any
    expect(sd['@type']).toBe('PodcastEpisode')
    expect(sd.associatedMedia['@type']).toBe('AudioObject')
  })

  it('should generate breadcrumb structured data', () => {
    const breadcrumbs = [
      { name: 'الرئيسية', url: '/ar' },
      { name: 'مقالات', url: '/ar/articles' },
    ]
    const sd = seoService.generateBreadcrumbStructuredData(breadcrumbs) as any
    expect(sd['@type']).toBe('BreadcrumbList')
    expect(sd.itemListElement).toHaveLength(2)
    expect(sd.itemListElement[1].name).toBe('مقالات')
  })

  it('should generate organization structured data', () => {
    const sd = seoService.generateOrganizationStructuredData() as any
    expect(sd['@type']).toBe('Organization')
    expect(sd.name).toBe('زوايا | Zawaya')
  })

  it('should generate website structured data', () => {
    const sd = seoService.generateWebsiteStructuredData() as any
    expect(sd['@type']).toBe('WebSite')
    expect(sd.url).toBe('https://zawaya.org')
  })

  it('should generate sitemap entry', () => {
    const entry = seoService.generateSitemapEntry(baseData, path)
    expect(entry.url).toBe('https://zawaya.org/ar/test-article')
    expect(entry.priority).toBe(0.8)
    expect(entry.changeFrequency).toBe('weekly')
  })

  it('should generate raw meta tags string', () => {
    const tags = seoService.generateMetaTags(baseData, path)
    expect(tags).toContain('<meta name="description" content="هذا وصف المقال التجريبي." />')
    expect(tags).toContain('<meta property="og:title" content="مقال تجريبي | زوايا | Zawaya" />')
  })
})
