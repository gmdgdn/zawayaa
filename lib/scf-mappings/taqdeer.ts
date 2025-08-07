/**
 * Taqdeer SCF (Smart Custom Fields) Mappings
 * Maps WordPress SCF fields to Next.js component props for Taqdeer content
 */

import { NormalizedWPPost } from '../wordpress-transformers'

// ChartItem interface for charts gallery
export interface ChartItem {
  title: string
  image_url: string
  description?: string
}

// Source interface for content sources
export interface Source {
  title: string
  url: string
  date?: string
  type: 'article' | 'report' | 'website' | 'document'
}

// Taqdeer-specific SCF field definitions
export const TAQDEER_SCF_FIELDS = {
  // Taqdeer content fields
  kicker: 'string',
  deck: 'string',
  verdict: 'string', // enum: 'positive' | 'negative' | 'neutral' | 'mixed'
  charts_gallery: 'array',
  
  // Additional metadata
  confidence_percentage: 'number',
  sources: 'array',
  methodology: 'string',
  last_updated: 'string'
} as const

// Taqdeer meta interface
export interface TaqdeerMeta {
  kicker?: string
  deck?: string
  verdict: 'positive' | 'negative' | 'neutral' | 'mixed'
  charts_gallery?: ChartItem[]
  confidence_percentage?: number
  sources?: Source[]
  methodology?: string
  last_updated?: string
}

// Taqdeer component prop interfaces
export interface TaqdeerCardProps {
  id: number
  slug: string
  title: string
  kicker?: string
  deck?: string
  verdict: 'positive' | 'negative' | 'neutral' | 'mixed'
  confidence?: number
  image?: string
  href: string
  publishedAt: string
  lastUpdated?: string
}

export interface TaqdeerDetailProps {
  id: number
  slug: string
  title: string
  content: string
  kicker?: string
  deck?: string
  verdict: 'positive' | 'negative' | 'neutral' | 'mixed'
  confidence?: number
  chartsGallery?: ChartItem[]
  sources?: Source[]
  methodology?: string
  image?: string
  publishedAt: string
  modifiedAt: string
  lastUpdated?: string
  seo: {
    title: string
    description: string
    image?: string
  }
}

/**
 * Transform WordPress post to TaqdeerCard props
 */
export function transformToTaqdeerCard(post: NormalizedWPPost): TaqdeerCardProps {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title_ar || post.title,
    kicker: post.zawaya_meta.kicker,
    deck: post.zawaya_meta.deck,
    verdict: (post.zawaya_meta.verdict as 'positive' | 'negative' | 'neutral' | 'mixed') || 'neutral',
    confidence: post.zawaya_meta.confidence_percentage ?? undefined,
    image: post.featured_image_url,
    href: `/ar/taqdeer/${post.slug}`,
    publishedAt: post.date,
    lastUpdated: post.zawaya_meta.last_updated
  }
}

/**
 * Transform WordPress post to TaqdeerDetail props
 */
export function transformToTaqdeerDetail(post: NormalizedWPPost): TaqdeerDetailProps {
  // Parse charts gallery if available
  let chartsGallery: ChartItem[] = []
  try {
    if (post.zawaya_meta.charts_gallery) {
      chartsGallery = Array.isArray(post.zawaya_meta.charts_gallery) 
        ? post.zawaya_meta.charts_gallery 
        : JSON.parse(post.zawaya_meta.charts_gallery)
    }
  } catch (error) {
    console.warn('Failed to parse charts_gallery for taqdeer', post.id)
  }

  // Parse sources if available
  let sources: Source[] = []
  try {
    if (post.zawaya_meta.sources) {
      sources = Array.isArray(post.zawaya_meta.sources) 
        ? post.zawaya_meta.sources 
        : JSON.parse(post.zawaya_meta.sources)
    }
  } catch (error) {
    console.warn('Failed to parse sources for taqdeer', post.id)
  }

  return {
    id: post.id,
    slug: post.slug,
    title: post.title_ar || post.title,
    content: post.content_ar || post.content,
    kicker: post.zawaya_meta.kicker,
    deck: post.zawaya_meta.deck,
    verdict: (post.zawaya_meta.verdict as 'positive' | 'negative' | 'neutral' | 'mixed') || 'neutral',
    confidence: post.zawaya_meta.confidence_percentage ?? undefined,
    chartsGallery,
    sources,
    methodology: post.zawaya_meta.methodology,
    image: post.featured_image_url,
    publishedAt: post.date,
    modifiedAt: post.modified,
    lastUpdated: post.zawaya_meta.last_updated,
    seo: {
      title: `${post.zawaya_meta.kicker ? post.zawaya_meta.kicker + ' | ' : ''}${post.title_ar || post.title} | تقدير`,
      description: post.zawaya_meta.deck || post.excerpt_ar || post.excerpt || 'تحليل وتقدير من منصة زوايا',
      image: post.featured_image_url
    }
  }
}

/**
 * Transform array of WordPress posts to TaqdeerCard props
 */
export function transformToTaqdeerCards(posts: NormalizedWPPost[]): TaqdeerCardProps[] {
  return posts.map(transformToTaqdeerCard)
}

/**
 * Validate Taqdeer SCF fields
 */
export function validateTaqdeerSCF(meta: Record<string, any>): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required fields
  if (!meta.verdict) {
    errors.push('Missing verdict - required field')
  } else if (!['positive', 'negative', 'neutral', 'mixed'].includes(meta.verdict)) {
    errors.push('Invalid verdict - must be positive, negative, neutral, or mixed')
  }

  // Validate numeric fields
  if (meta.confidence_percentage && (!isValidNumber(meta.confidence_percentage) || 
      Number(meta.confidence_percentage) < 0 || Number(meta.confidence_percentage) > 100)) {
    warnings.push('Invalid confidence_percentage - should be a number between 0 and 100')
  }

  // Validate charts gallery array
  if (meta.charts_gallery) {
    try {
      const chartsArray = Array.isArray(meta.charts_gallery) 
        ? meta.charts_gallery 
        : JSON.parse(meta.charts_gallery)
      
      if (!Array.isArray(chartsArray)) {
        warnings.push('Invalid charts_gallery - should be an array')
      } else {
        chartsArray.forEach((chart, index) => {
          if (!validateChartItem(chart)) {
            warnings.push(`Invalid charts_gallery item ${index + 1} - missing required fields`)
          }
        })
      }
    } catch (error) {
      warnings.push('Invalid charts_gallery - should be valid JSON array')
    }
  }

  // Validate sources array
  if (meta.sources) {
    try {
      const sourcesArray = Array.isArray(meta.sources) 
        ? meta.sources 
        : JSON.parse(meta.sources)
      
      if (!Array.isArray(sourcesArray)) {
        warnings.push('Invalid sources - should be an array')
      } else {
        sourcesArray.forEach((source, index) => {
          if (!validateSource(source)) {
            warnings.push(`Invalid sources item ${index + 1} - missing required fields`)
          }
        })
      }
    } catch (error) {
      warnings.push('Invalid sources - should be valid JSON array')
    }
  }

  // Validate date format
  if (meta.last_updated && !isValidDate(meta.last_updated)) {
    warnings.push('Invalid last_updated - should be valid date format')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate ChartItem structure
 */
function validateChartItem(chart: any): boolean {
  if (!chart || typeof chart !== 'object') return false
  
  // Check required fields
  if (!chart.title || !chart.image_url) return false
  
  // Validate URL
  if (!isValidUrl(chart.image_url)) return false
  
  return true
}

/**
 * Validate Source structure
 */
function validateSource(source: any): boolean {
  if (!source || typeof source !== 'object') return false
  
  // Check required fields
  if (!source.title || !source.url) return false
  
  // Validate type
  if (source.type && !['article', 'report', 'website', 'document'].includes(source.type)) return false
  
  // Validate URL
  if (!isValidUrl(source.url)) return false
  
  // Validate date if provided
  if (source.date && !isValidDate(source.date)) return false
  
  return true
}

/**
 * Get verdict display name in Arabic
 */
export function getVerdictDisplayName(verdict: string): string {
  switch (verdict) {
    case 'positive':
      return 'إيجابي'
    case 'negative':
      return 'سلبي'
    case 'neutral':
      return 'محايد'
    case 'mixed':
      return 'مختلط'
    default:
      return 'غير محدد'
  }
}

/**
 * Get verdict color class
 */
export function getVerdictColorClass(verdict: string): string {
  switch (verdict) {
    case 'positive':
      return 'text-green-600 bg-green-50'
    case 'negative':
      return 'text-red-600 bg-red-50'
    case 'neutral':
      return 'text-gray-600 bg-gray-50'
    case 'mixed':
      return 'text-yellow-600 bg-yellow-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

/**
 * Get source type display name in Arabic
 */
export function getSourceTypeDisplayName(type: string): string {
  switch (type) {
    case 'article':
      return 'مقال'
    case 'report':
      return 'تقرير'
    case 'website':
      return 'موقع ويب'
    case 'document':
      return 'وثيقة'
    default:
      return 'مصدر'
  }
}

/**
 * Format confidence percentage for display
 */
export function formatConfidence(percentage?: number): string {
  if (!percentage) return ''
  return `${percentage}%`
}

/**
 * Generate Taqdeer cache tags
 */
export function getTaqdeerCacheTags(post: NormalizedWPPost): string[] {
  const tags = ['taqdeer', `taqdeer:${post.id}`]
  
  if (post.zawaya_meta.verdict) {
    tags.push(`verdict:${post.zawaya_meta.verdict}`)
  }
  
  return tags
}

/**
 * Generate Taqdeer revalidation paths
 */
export function getTaqdeerRevalidationPaths(post: NormalizedWPPost): string[] {
  return [
    '/ar', // Homepage
    '/ar/taqdeer', // Taqdeer list
    `/ar/taqdeer/${post.slug}` // Individual taqdeer
  ]
}

/**
 * Get fallback values for missing Taqdeer SCF fields
 */
export function getTaqdeerFallbacks(post: any): Partial<TaqdeerDetailProps> {
  return {
    title: post.title?.rendered || 'تقدير غير متوفر',
    content: post.content?.rendered || 'المحتوى غير متوفر',
    verdict: 'neutral',
    seo: {
      title: `${post.title?.rendered || 'تقدير غير متوفر'} | تقدير | زوايا`,
      description: post.excerpt?.rendered || 'تحليل وتقدير من منصة زوايا',
      image: post.featured_image_url
    }
  }
}

// Helper functions
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidNumber(value: any): boolean {
  return !isNaN(Number(value)) && isFinite(Number(value))
}

function isValidDate(date: string): boolean {
  if (!date || typeof date !== 'string') return false
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}