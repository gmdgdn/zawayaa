/**
 * SEO Service for Arabic Content
 * Generates dynamic metadata, structured data, and SEO optimizations
 */

import type { Metadata } from 'next'

export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  imageUrl?: string
  audioUrl?: string
  videoUrl?: string
  duration?: number
  readTime?: number
  canonicalUrl?: string
  language?: 'ar' | 'en'
  type?: 'article' | 'podcast' | 'program' | 'page'
}

export class SEOService {
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zawaya.org'
  private siteName = 'زوايا | Zawaya'
  private defaultDescription = 'منصة معرفية غير ربحية، ثنائية اللغة، تربط الواقع العربي بالتحولات العالمية عبر تحليلات رصينة متعددة الاختصاصات.'

  /**
   * Generate comprehensive metadata for Arabic content
   */
  generateMetadata(data: SEOData, path: string): Metadata {
    const url = `${this.baseUrl}${path}`
    const title = this.formatTitle(data.title)
    const description = data.description || this.defaultDescription

    const metadata: Metadata = {
      title,
      description,
      keywords: data.keywords?.join(', '),
      authors: data.author ? [{ name: data.author }] : [{ name: 'فريق زوايا' }],
      creator: data.author || 'فريق زوايا',
      publisher: this.siteName,
      
      // Open Graph
      openGraph: {
        title,
        description,
        url,
        siteName: this.siteName,
        locale: data.language === 'en' ? 'en_US' : 'ar_SA',
        type: this.getOpenGraphType(data.type),
        images: data.imageUrl ? [{
          url: data.imageUrl,
          width: 1200,
          height: 630,
          alt: data.title,
        }] : [],
        ...(data.publishedTime && { publishedTime: data.publishedTime }),
        ...(data.modifiedTime && { modifiedTime: data.modifiedTime }),
        ...(data.section && { section: data.section }),
        ...(data.tags && { tags: data.tags }),
        ...(data.author && { authors: [data.author] }),
      },

      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@ZawayaPlatform',
        site: '@ZawayaPlatform',
        ...(data.imageUrl && { images: [data.imageUrl] }),
      },

      // Additional metadata
      alternates: {
        canonical: data.canonicalUrl || url,
        languages: {
          'ar': url,
          'x-default': url,
        },
      },

      // Robots
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Additional properties
      category: data.section,
      ...(data.language && { 
        other: {
          'content-language': data.language,
          'article:author': data.author || 'فريق زوايا',
          ...(data.readTime && { 'article:reading_time': data.readTime.toString() }),
          ...(data.tags && { 'article:tag': data.tags.join(',') }),
        }
      }),
    }

    return metadata
  }

  /**
   * Generate JSON-LD structured data for Arabic content
   */
  generateStructuredData(data: SEOData, path: string): object {
    const url = `${this.baseUrl}${path}`
    
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': this.getSchemaType(data.type),
      name: data.title,
      headline: data.title,
      description: data.description,
      url,
      inLanguage: data.language || 'ar',
      isPartOf: {
        '@type': 'WebSite',
        name: this.siteName,
        url: this.baseUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        url: this.baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`,
        },
      },
      ...(data.author && {
        author: {
          '@type': 'Person',
          name: data.author,
        },
      }),
      ...(data.publishedTime && { datePublished: data.publishedTime }),
      ...(data.modifiedTime && { dateModified: data.modifiedTime }),
      ...(data.imageUrl && {
        image: {
          '@type': 'ImageObject',
          url: data.imageUrl,
          width: 1200,
          height: 630,
        },
      }),
      ...(data.keywords && { keywords: data.keywords.join(', ') }),
    }

    // Add type-specific structured data
    switch (data.type) {
      case 'article':
        return {
          ...baseStructuredData,
          '@type': 'Article',
          articleSection: data.section,
          wordCount: this.estimateWordCount(data.description),
          ...(data.readTime && { 
            timeRequired: `PT${data.readTime}M`,
            readingTime: `PT${data.readTime}M`,
          }),
          ...(data.tags && { about: data.tags.map(tag => ({ '@type': 'Thing', name: tag })) }),
        }

      case 'podcast':
        return {
          ...baseStructuredData,
          '@type': 'PodcastEpisode',
          ...(data.audioUrl && { associatedMedia: {
            '@type': 'AudioObject',
            contentUrl: data.audioUrl,
            ...(data.duration && { duration: `PT${Math.floor(data.duration / 60)}M${data.duration % 60}S` }),
          }}),
          partOfSeries: {
            '@type': 'PodcastSeries',
            name: data.section || 'بودكاست زوايا',
          },
        }

      case 'program':
        return {
          ...baseStructuredData,
          '@type': 'VideoObject',
          ...(data.videoUrl && { contentUrl: data.videoUrl }),
          ...(data.duration && { duration: `PT${Math.floor(data.duration / 60)}M${data.duration % 60}S` }),
          ...(data.imageUrl && { thumbnailUrl: data.imageUrl }),
          uploadDate: data.publishedTime,
        }

      default:
        return baseStructuredData
    }
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${this.baseUrl}${crumb.url}`,
      })),
    }
  }

  /**
   * Generate organization structured data
   */
  generateOrganizationStructuredData(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.siteName,
      alternateName: 'Zawaya Platform',
      url: this.baseUrl,
      logo: `${this.baseUrl}/logo.png`,
      description: this.defaultDescription,
      foundingDate: '2024',
      sameAs: [
        'https://twitter.com/ZawayaPlatform',
        'https://facebook.com/ZawayaPlatform',
        'https://instagram.com/ZawayaPlatform',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'info@zawaya.org',
        availableLanguage: ['Arabic', 'English'],
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'SA',
        addressRegion: 'Riyadh',
      },
    }
  }

  /**
   * Generate website structured data
   */
  generateWebsiteStructuredData(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      alternateName: 'Zawaya Platform',
      url: this.baseUrl,
      description: this.defaultDescription,
      inLanguage: ['ar', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/ar/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        url: this.baseUrl,
      },
    }
  }

  /**
   * Generate sitemap data for Arabic content
   */
  generateSitemapEntry(data: SEOData, path: string): {
    url: string
    lastModified: Date
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
  } {
    return {
      url: `${this.baseUrl}${path}`,
      lastModified: data.modifiedTime ? new Date(data.modifiedTime) : new Date(),
      changeFrequency: this.getChangeFrequency(data.type),
      priority: this.getPriority(data.type, path),
    }
  }

  /**
   * Format title with site name
   */
  private formatTitle(title: string): string {
    if (title.includes(this.siteName)) {
      return title
    }
    return `${title} | ${this.siteName}`
  }

  /**
   * Get Open Graph type based on content type
   */
  private getOpenGraphType(type?: string): 'website' | 'article' | 'video.other' | 'music.song' {
    switch (type) {
      case 'article': return 'article'
      case 'program': return 'video.other'
      case 'podcast': return 'music.song'
      default: return 'website'
    }
  }

  /**
   * Get Schema.org type based on content type
   */
  private getSchemaType(type?: string): string {
    switch (type) {
      case 'article': return 'Article'
      case 'podcast': return 'PodcastEpisode'
      case 'program': return 'VideoObject'
      default: return 'WebPage'
    }
  }

  /**
   * Estimate word count from text
   */
  private estimateWordCount(text: string): number {
    // Arabic words are typically longer, so we adjust the calculation
    return Math.ceil(text.split(/\s+/).length * 1.2)
  }

  /**
   * Get change frequency for sitemap
   */
  private getChangeFrequency(type?: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
    switch (type) {
      case 'article': return 'weekly'
      case 'podcast': return 'monthly'
      case 'program': return 'monthly'
      default: return 'weekly'
    }
  }

  /**
   * Get priority for sitemap
   */
  private getPriority(type?: string, path?: string): number {
    if (path === '/ar' || path === '/') return 1.0
    
    switch (type) {
      case 'article': return 0.8
      case 'podcast': return 0.7
      case 'program': return 0.7
      default: return 0.6
    }
  }

  /**
   * Generate meta tags for manual insertion
   */
  generateMetaTags(data: SEOData, path: string): string {
    const url = `${this.baseUrl}${path}`
    const title = this.formatTitle(data.title)
    
    return `
      <meta name="description" content="${data.description}" />
      <meta name="keywords" content="${data.keywords?.join(', ') || ''}" />
      <meta name="author" content="${data.author || 'فريق زوايا'}" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="${data.language || 'ar'}" />
      
      <!-- Open Graph -->
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${data.description}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:site_name" content="${this.siteName}" />
      <meta property="og:type" content="${this.getOpenGraphType(data.type)}" />
      <meta property="og:locale" content="${data.language === 'en' ? 'en_US' : 'ar_SA'}" />
      ${data.imageUrl ? `<meta property="og:image" content="${data.imageUrl}" />` : ''}
      ${data.publishedTime ? `<meta property="article:published_time" content="${data.publishedTime}" />` : ''}
      ${data.author ? `<meta property="article:author" content="${data.author}" />` : ''}
      
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${data.description}" />
      <meta name="twitter:site" content="@ZawayaPlatform" />
      ${data.imageUrl ? `<meta name="twitter:image" content="${data.imageUrl}" />` : ''}
      
      <!-- Canonical -->
      <link rel="canonical" href="${data.canonicalUrl || url}" />
      
      <!-- Language -->
      <link rel="alternate" hreflang="ar" href="${url}" />
      <link rel="alternate" hreflang="x-default" href="${url}" />
    `.trim()
  }
}

// Export singleton instance
export const seoService = new SEOService()

// Export types
export type { SEOData }