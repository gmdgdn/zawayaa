/**
 * Article SCF (Secure Custom Fields) Mappings
 * Maps WordPress ACF fields to Next.js component props for articles
 */

import { NormalizedWPPost } from '../wordpress-transformers'



// Article-specific SCF field definitions
export const ARTICLE_SCF_FIELDS = {
  // Arabic content fields
  title_arabic: 'string',
  excerpt_arabic: 'string', 
  content_arabic: 'string',
  author_arabic_name: 'string',
  author_bio_arabic: 'string',
  
  // Audio and media fields
  audio_narration_url: 'string',
  audio_duration: 'number',
  social_sharing_image: 'string',
  
  // Content metadata
  reading_time_minutes: 'number',
  category_color: 'string',
  is_featured: 'boolean',
  is_breaking_news: 'boolean',
  
  // SEO fields
  meta_description_arabic: 'string',
  keywords_arabic: 'string'
} as const

// Article component prop interfaces
export type ArticleCardProps = {
  id: number
  slug: string
  title: string
  excerpt: string
  href: string
  image?: string
  readTime?: number
  categoryColor?: string
  featured?: boolean
  audioUrl?: string
  publishedAt: string
  author: {
    name: string
    avatar?: string
  }
}

export type ArticleDetailProps = {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string
  authorName: string
  authorBio?: string
  audioUrl?: string
  audioDuration?: number
  readTime?: number
  categoryColor?: string
  socialImage?: string
  publishedAt: string
  modifiedAt: string
  featured?: boolean
  breakingNews?: boolean
  seo: {
    title: string
    description: string
    keywords?: string
    image?: string
  }
}

export type ArticleListProps = {
  articles: ArticleCardProps[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters?: {
    category?: string
    featured?: boolean
    search?: string
  }
}

/**
 * Transform WordPress post to ArticleCard props
 */
export function transformToArticleCard(post: NormalizedWPPost): ArticleCardProps {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title_ar || post.title,
    excerpt: post.excerpt_ar || post.excerpt,
    href: `/ar/articles/${post.slug}`,
    image: post.featured_image_url,
    readTime: post.zawaya_meta.reading_time_minutes || undefined,
    categoryColor: post.zawaya_meta.category_color || undefined,
    featured: post.zawaya_meta.is_featured || false,
    audioUrl: post.zawaya_meta.audio_narration_url || undefined,
    publishedAt: post.date,
    author: {
      name: post.zawaya_meta.author_arabic_name || post.author.name_ar || post.author.name,
      avatar: post.author.avatar_urls?.['96'] || post.author.avatar_urls?.['48']
    }
  }
}

/**
 * Transform WordPress post to ArticleDetail props
 */
export function transformToArticleDetail(post: NormalizedWPPost): ArticleDetailProps {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title_ar || post.title,
    content: post.content_ar || post.content,
    excerpt: post.excerpt_ar || post.excerpt,
    authorName: post.zawaya_meta.author_arabic_name || post.author.name_ar || post.author.name,
    authorBio: post.zawaya_meta.author_bio_arabic,
    audioUrl: post.zawaya_meta.audio_narration_url,
    audioDuration: post.zawaya_meta.audio_duration || undefined,
    readTime: post.zawaya_meta.reading_time_minutes || undefined,
    categoryColor: post.zawaya_meta.category_color,
    socialImage: post.zawaya_meta.social_sharing_image || post.featured_image_url,
    publishedAt: post.date,
    modifiedAt: post.modified,
    featured: post.zawaya_meta.is_featured || false,
    breakingNews: post.zawaya_meta.is_breaking_news || false,
    seo: {
      title: post.zawaya_meta.title_arabic || post.title,
      description: post.zawaya_meta.meta_description_arabic || post.excerpt_ar || post.excerpt,
      keywords: post.zawaya_meta.keywords_arabic,
      image: post.zawaya_meta.social_sharing_image || post.featured_image_url
    }
  }
}

/**
 * Transform array of WordPress posts to ArticleCard props
 */
export function transformToArticleCards(posts: NormalizedWPPost[]): ArticleCardProps[] {
  return posts.map(transformToArticleCard)
}

/**
 * Create article list props with pagination
 */
export function createArticleListProps(
  posts: NormalizedWPPost[],
  pagination: {
    page: number
    perPage: number
    total: number
  },
  filters?: {
    category?: string
    featured?: boolean
    search?: string
  }
): ArticleListProps {
  const totalPages = Math.ceil(pagination.total / pagination.perPage)
  
  return {
    articles: transformToArticleCards(posts),
    pagination: {
      currentPage: pagination.page,
      totalPages,
      totalItems: pagination.total,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1
    },
    filters
  }
}

/**
 * Validate article SCF fields
 */
export function validateArticleSCF(meta: Record<string, any>): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required fields
  if (!meta.title_arabic && !meta.title) {
    errors.push('Missing title (Arabic or English)')
  }

  if (!meta.excerpt_arabic && !meta.excerpt) {
    warnings.push('Missing excerpt (Arabic or English)')
  }

  if (!meta.content_arabic && !meta.content) {
    errors.push('Missing content (Arabic or English)')
  }

  // Validate numeric fields
  if (meta.reading_time_minutes && isNaN(Number(meta.reading_time_minutes))) {
    warnings.push('Invalid reading_time_minutes - should be a number')
  }

  if (meta.audio_duration && isNaN(Number(meta.audio_duration))) {
    warnings.push('Invalid audio_duration - should be a number')
  }

  // Validate URL fields
  if (meta.audio_narration_url && !isValidUrl(meta.audio_narration_url)) {
    warnings.push('Invalid audio_narration_url format')
  }

  if (meta.social_sharing_image && !isValidUrl(meta.social_sharing_image)) {
    warnings.push('Invalid social_sharing_image URL format')
  }

  // Validate color field
  if (meta.category_color && !isValidColor(meta.category_color)) {
    warnings.push('Invalid category_color format - should be hex color')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get fallback values for missing SCF fields
 */
export function getArticleFallbacks(post: any): Partial<ArticleDetailProps> {
  return {
    title: post.title?.rendered || 'عنوان غير متوفر',
    excerpt: post.excerpt?.rendered || 'ملخص غير متوفر',
    content: post.content?.rendered || 'المحتوى غير متوفر',
    authorName: post.author?.name || 'مؤلف غير معروف',
    readTime: estimateReadingTime(post.content?.rendered || ''),
    seo: {
      title: post.title?.rendered || 'زوايا',
      description: post.excerpt?.rendered || 'منصة زوايا للمحتوى العربي',
      image: post.featured_image_url
    }
  }
}

/**
 * Estimate reading time from content
 */
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200 // Average Arabic reading speed
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate hex color format
 */
function isValidColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

/**
 * Generate article cache tags
 */
export function getArticleCacheTags(post: NormalizedWPPost): string[] {
  const tags = ['articles', `article:${post.id}`]
  
  if (post.zawaya_meta.is_featured) {
    tags.push('featured-articles', 'homepage')
  }
  
  if (post.zawaya_meta.is_breaking_news) {
    tags.push('breaking-news')
  }
  
  if (post.categories.length > 0) {
    post.categories.forEach(catId => {
      tags.push(`category:${catId}`)
    })
  }
  
  if (post.author.id) {
    tags.push(`author:${post.author.id}`)
  }
  
  return tags
}

/**
 * Generate article revalidation paths
 */
export function getArticleRevalidationPaths(post: NormalizedWPPost): string[] {
  const paths = [
    '/ar', // Homepage
    '/ar/articles', // Articles list
    `/ar/articles/${post.slug}` // Individual article
  ]
  
  // Add category pages if applicable
  if (post.category?.slug) {
    paths.push(`/ar/articles/category/${post.category.slug}`)
  }
  
  // Add author page if applicable
  if (post.author.slug) {
    paths.push(`/ar/authors/${post.author.slug}`)
  }
  
  return paths
}

// Re-export types for better compatibility
export type { ArticleCardProps, ArticleDetailProps, ArticleListProps }