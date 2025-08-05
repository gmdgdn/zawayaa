/**
 * SEO Utilities
 * Helper functions for managing SEO metadata across the application
 */

import { Metadata } from 'next'
import {
  generateArticleSEO,
  generateProgramSEO,
  generateEpisodeSEO,
  generateAuthorSEO,
  generateHomepageSEO,
  generateCategorySEO,
  generateMetaTags,
  SEOMetadata,
  OpenGraphMetadata,
  TwitterCardMetadata,
  JSONLDMetadata
} from './seo-metadata-mapping'
import { NormalizedWPPost } from './wordpress-transformers'
import { WordPressAuthor } from './scf-mappings/author-mappings'

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://zawaya.com'

/**
 * Generate Next.js Metadata object from SEO data
 */
export function createNextMetadata(
  seo: SEOMetadata,
  openGraph: OpenGraphMetadata,
  twitterCard: TwitterCardMetadata,
  jsonLD?: JSONLDMetadata
): Metadata {
  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.split(',').map(k => k.trim()),
    authors: seo.author ? [{ name: seo.author }] : undefined,
    creator: seo.author,
    publisher: 'زوايا',
    robots: seo.robots || 'index, follow',
    alternates: {
      canonical: seo.canonical
    },
    openGraph: {
      title: openGraph.title,
      description: openGraph.description,
      type: openGraph.type as any,
      url: openGraph.url,
      siteName: openGraph.siteName,
      locale: openGraph.locale,
      images: openGraph.image ? [{
        url: openGraph.image,
        alt: openGraph.imageAlt || openGraph.title
      }] : undefined,
      publishedTime: openGraph.publishedTime,
      modifiedTime: openGraph.modifiedTime,
      authors: openGraph.author ? [openGraph.author] : undefined,
      section: openGraph.section,
      tags: openGraph.tags
    },
    twitter: {
      card: twitterCard.card,
      title: twitterCard.title,
      description: twitterCard.description,
      images: twitterCard.image ? [{
        url: twitterCard.image,
        alt: twitterCard.imageAlt || twitterCard.title
      }] : undefined,
      site: twitterCard.site,
      creator: twitterCard.creator
    },
    other: jsonLD ? {
      'application/ld+json': JSON.stringify(jsonLD)
    } : undefined
  }

  return metadata
}

/**
 * Generate metadata for article pages
 */
export function generateArticleMetadata(post: NormalizedWPPost): Metadata {
  const { seo, openGraph, twitterCard, jsonLD } = generateArticleSEO(post, BASE_URL)
  return createNextMetadata(seo, openGraph, twitterCard, jsonLD)
}

/**
 * Generate metadata for program pages
 */
export function generateProgramMetadata(program: NormalizedWPPost): Metadata {
  const { seo, openGraph, twitterCard, jsonLD } = generateProgramSEO(program, BASE_URL)
  return createNextMetadata(seo, openGraph, twitterCard, jsonLD)
}

/**
 * Generate metadata for episode pages
 */
export function generateEpisodeMetadata(
  episode: NormalizedWPPost,
  program?: NormalizedWPPost
): Metadata {
  const { seo, openGraph, twitterCard, jsonLD } = generateEpisodeSEO(episode, program, BASE_URL)
  return createNextMetadata(seo, openGraph, twitterCard, jsonLD)
}

/**
 * Generate metadata for author pages
 */
export function generateAuthorMetadata(author: WordPressAuthor): Metadata {
  const { seo, openGraph, twitterCard, jsonLD } = generateAuthorSEO(author, BASE_URL)
  return createNextMetadata(seo, openGraph, twitterCard, jsonLD)
}

/**
 * Generate metadata for homepage
 */
export function generateHomepageMetadata(): Metadata {
  const { seo, openGraph, twitterCard, jsonLD } = generateHomepageSEO(BASE_URL)
  return createNextMetadata(seo, openGraph, twitterCard, jsonLD)
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(category: {
  id: number
  name: string
  slug: string
  description?: string
}): Metadata {
  const { seo, openGraph, twitterCard, jsonLD } = generateCategorySEO(category, BASE_URL)
  return createNextMetadata(seo, openGraph, twitterCard, jsonLD)
}

/**
 * Generate metadata for search pages
 */
export function generateSearchMetadata(query: string): Metadata {
  const title = query ? `نتائج البحث عن "${query}" | زوايا` : 'البحث | زوايا'
  const description = query ? 
    `نتائج البحث عن "${query}" في مقالات وبرامج منصة زوايا` : 
    'ابحث في مقالات وبرامج منصة زوايا'

  return {
    title,
    description,
    robots: 'noindex, follow', // Don't index search results
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE_URL}/ar/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
      siteName: 'زوايا',
      locale: 'ar_SA'
    },
    twitter: {
      card: 'summary',
      title,
      description,
      site: '@zawaya_platform'
    }
  }
}

/**
 * Generate metadata for tag pages
 */
export function generateTagMetadata(tag: {
  id: number
  name: string
  slug: string
  description?: string
}): Metadata {
  const title = `${tag.name} | الوسوم | زوايا`
  const description = tag.description || `مقالات بوسم ${tag.name} على منصة زوايا`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE_URL}/ar/tags/${tag.slug}`,
      siteName: 'زوايا',
      locale: 'ar_SA'
    },
    twitter: {
      card: 'summary',
      title,
      description,
      site: '@zawaya_platform'
    }
  }
}

/**
 * Generate metadata for static pages
 */
export function generateStaticPageMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const fullTitle = `${title} | زوايا`

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: `${BASE_URL}${path}`
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      url: `${BASE_URL}${path}`,
      siteName: 'زوايا',
      locale: 'ar_SA'
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
      site: '@zawaya_platform'
    }
  }
}

/**
 * Generate JSON-LD script tag
 */
export function generateJSONLDScript(jsonLD: JSONLDMetadata): string {
  return `<script type="application/ld+json">${JSON.stringify(jsonLD, null, 2)}</script>`
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbJSONLD(
  breadcrumbs: Array<{ name: string; url?: string }>
): JSONLDMetadata {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.url && { item: crumb.url })
    }))
  }
}

/**
 * Generate FAQ JSON-LD
 */
export function generateFAQJSONLD(
  faqs: Array<{ question: string; answer: string }>
): JSONLDMetadata {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * Generate WebSite JSON-LD with search action
 */
export function generateWebSiteJSONLD(): JSONLDMetadata {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'زوايا',
    description: 'منصة زوايا للمحتوى العربي',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/ar/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'ar',
    publisher: {
      '@type': 'Organization',
      name: 'زوايا',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`
      }
    }
  }
}

/**
 * Validate SEO metadata
 */
export function validateSEOMetadata(metadata: {
  seo: SEOMetadata
  openGraph: OpenGraphMetadata
  twitterCard: TwitterCardMetadata
}): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Title validation
  if (!metadata.seo.title || metadata.seo.title.length === 0) {
    errors.push('Missing SEO title')
  } else if (metadata.seo.title.length > 60) {
    warnings.push('SEO title is longer than 60 characters')
  }

  // Description validation
  if (!metadata.seo.description || metadata.seo.description.length === 0) {
    errors.push('Missing SEO description')
  } else if (metadata.seo.description.length > 160) {
    warnings.push('SEO description is longer than 160 characters')
  } else if (metadata.seo.description.length < 120) {
    warnings.push('SEO description is shorter than 120 characters')
  }

  // Open Graph validation
  if (!metadata.openGraph.image) {
    warnings.push('Missing Open Graph image')
  }

  // URL validation
  try {
    new URL(metadata.openGraph.url)
  } catch {
    errors.push('Invalid Open Graph URL')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/

# Disallow search pages
Disallow: /ar/search

# Allow specific paths
Allow: /ar/
Allow: /ar/articles/
Allow: /ar/programs/
Allow: /ar/episodes/
Allow: /ar/authors/
Allow: /ar/about
Allow: /ar/contact
Allow: /ar/newsletter

# Crawl delay
Crawl-delay: 1`
}

/**
 * Extract keywords from Arabic text
 */
export function extractArabicKeywords(
  text: string,
  maxKeywords: number = 10
): string[] {
  // Remove HTML tags and normalize text
  const cleanText = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Split into words and filter Arabic words
  const words = cleanText
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      /[\u0600-\u06FF]/.test(word) && // Contains Arabic characters
      !/^[0-9]+$/.test(word) // Not just numbers
    )

  // Count word frequency
  const wordCount: Record<string, number> = {}
  words.forEach(word => {
    const normalized = word.toLowerCase()
    wordCount[normalized] = (wordCount[normalized] || 0) + 1
  })

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word)
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(
  content: string,
  maxLength: number = 160
): string {
  // Remove HTML tags and normalize text
  const cleanText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Truncate to max length, ensuring we don't cut words
  if (cleanText.length <= maxLength) {
    return cleanText
  }

  const truncated = cleanText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > maxLength * 0.8 ? 
    truncated.substring(0, lastSpace) + '...' : 
    truncated + '...'
}

// Export all utilities
export {
  BASE_URL,
  generateMetaTags,
  generateSitemapEntries
} from './seo-metadata-mapping'