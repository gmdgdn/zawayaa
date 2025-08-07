/**
 * Post SCF (Smart Custom Fields) Mappings
 * Maps WordPress SCF fields to Next.js component props for posts
 */

import { NormalizedWPPost } from '../wordpress-transformers'

// MediaItem interface for inline media
export interface MediaItem {
  type: 'image' | 'video' | 'audio'
  url: string
  caption?: string
  alt?: string
}

// Post-specific SCF field definitions
export const POST_SCF_FIELDS = {
  // Extended post fields
  reading_time: 'number',
  inline_media: 'array',
  meta_description: 'string',
  meta_og_image: 'string',
  
  // Existing fields from article mappings
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

// Post component prop interfaces
export interface PostCardProps {
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
  inlineMedia?: MediaItem[]
}

export interface PostDetailProps {
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
  inlineMedia?: MediaItem[]
  seo: {
    title: string
    description: string
    keywords?: string
    image?: string
  }
}

/**
 * Transform WordPress post to PostCard props
 */
export function transformToPostCard(post: NormalizedWPPost): PostCardProps {
  // Parse inline media if available
  let inlineMedia: MediaItem[] = []
  try {
    if (post.zawaya_meta.inline_media) {
      inlineMedia = Array.isArray(post.zawaya_meta.inline_media) 
        ? post.zawaya_meta.inline_media 
        : JSON.parse(post.zawaya_meta.inline_media)
    }
  } catch (error) {
    console.warn('Failed to parse inline_media for post', post.id)
  }

  return {
    id: post.id,
    slug: post.slug,
    title: post.title_ar || post.title,
    excerpt: post.excerpt_ar || post.excerpt,
    href: `/ar/posts/${post.slug}`,
    image: post.zawaya_meta.meta_og_image || post.featured_image_url,
    readTime: post.zawaya_meta.reading_time || post.zawaya_meta.reading_time_minutes || undefined,
    categoryColor: post.zawaya_meta.category_color || undefined,
    featured: post.zawaya_meta.is_featured || false,
    audioUrl: post.zawaya_meta.audio_narration_url || undefined,
    publishedAt: post.date,
    author: {
      name: post.zawaya_meta.author_arabic_name || post.author.name_ar || post.author.name,
      avatar: post.author.avatar_urls?.['96'] || post.author.avatar_urls?.['48']
    },
    inlineMedia
  }
}

/**
 * Transform WordPress post to PostDetail props
 */
export function transformToPostDetail(post: NormalizedWPPost): PostDetailProps {
  // Parse inline media if available
  let inlineMedia: MediaItem[] = []
  try {
    if (post.zawaya_meta.inline_media) {
      inlineMedia = Array.isArray(post.zawaya_meta.inline_media) 
        ? post.zawaya_meta.inline_media 
        : JSON.parse(post.zawaya_meta.inline_media)
    }
  } catch (error) {
    console.warn('Failed to parse inline_media for post', post.id)
  }

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
    readTime: post.zawaya_meta.reading_time || post.zawaya_meta.reading_time_minutes || undefined,
    categoryColor: post.zawaya_meta.category_color,
    socialImage: post.zawaya_meta.meta_og_image || post.zawaya_meta.social_sharing_image || post.featured_image_url,
    publishedAt: post.date,
    modifiedAt: post.modified,
    featured: post.zawaya_meta.is_featured || false,
    breakingNews: post.zawaya_meta.is_breaking_news || false,
    inlineMedia,
    seo: {
      title: post.zawaya_meta.title_arabic || post.title,
      description: post.zawaya_meta.meta_description || post.zawaya_meta.meta_description_arabic || post.excerpt_ar || post.excerpt,
      keywords: post.zawaya_meta.keywords_arabic,
      image: post.zawaya_meta.meta_og_image || post.zawaya_meta.social_sharing_image || post.featured_image_url
    }
  }
}

/**
 * Transform array of WordPress posts to PostCard props
 */
export function transformToPostCards(posts: NormalizedWPPost[]): PostCardProps[] {
  return posts.map(transformToPostCard)
}

/**
 * Validate post SCF fields
 */
export function validatePostSCF(meta: Record<string, any>): {
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
  if (meta.reading_time && !isValidNumber(meta.reading_time)) {
    warnings.push('Invalid reading_time - should be a number')
  }

  if (meta.reading_time_minutes && !isValidNumber(meta.reading_time_minutes)) {
    warnings.push('Invalid reading_time_minutes - should be a number')
  }

  if (meta.audio_duration && !isValidNumber(meta.audio_duration)) {
    warnings.push('Invalid audio_duration - should be a number')
  }

  // Validate URL fields
  if (meta.audio_narration_url && !isValidUrl(meta.audio_narration_url)) {
    warnings.push('Invalid audio_narration_url format')
  }

  if (meta.social_sharing_image && !isValidUrl(meta.social_sharing_image)) {
    warnings.push('Invalid social_sharing_image URL format')
  }

  if (meta.meta_og_image && !isValidUrl(meta.meta_og_image)) {
    warnings.push('Invalid meta_og_image URL format')
  }

  // Validate color field
  if (meta.category_color && !isValidColor(meta.category_color)) {
    warnings.push('Invalid category_color format - should be hex color')
  }

  // Validate inline media array
  if (meta.inline_media) {
    try {
      const mediaArray = Array.isArray(meta.inline_media) 
        ? meta.inline_media 
        : JSON.parse(meta.inline_media)
      
      if (!Array.isArray(mediaArray)) {
        warnings.push('Invalid inline_media - should be an array')
      } else {
        mediaArray.forEach((item, index) => {
          if (!validateMediaItem(item)) {
            warnings.push(`Invalid inline_media item ${index + 1} - missing required fields`)
          }
        })
      }
    } catch (error) {
      warnings.push('Invalid inline_media - should be valid JSON array')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate MediaItem structure
 */
function validateMediaItem(item: any): boolean {
  if (!item || typeof item !== 'object') return false
  
  // Check required fields
  if (!item.type || !item.url) return false
  
  // Validate type
  if (!['image', 'video', 'audio'].includes(item.type)) return false
  
  // Validate URL
  if (!isValidUrl(item.url)) return false
  
  return true
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate number format
 */
function isValidNumber(value: any): boolean {
  return !isNaN(Number(value)) && isFinite(Number(value))
}

/**
 * Validate hex color format
 */
function isValidColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

/**
 * Get fallback values for missing SCF fields
 */
export function getPostFallbacks(post: any): Partial<PostDetailProps> {
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
 * Generate post cache tags
 */
export function getPostCacheTags(post: NormalizedWPPost): string[] {
  const tags = ['posts', `post:${post.id}`]
  
  if (post.zawaya_meta.is_featured) {
    tags.push('featured-posts', 'homepage')
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
 * Generate post revalidation paths
 */
export function getPostRevalidationPaths(post: NormalizedWPPost): string[] {
  const paths = [
    '/ar', // Homepage
    '/ar/posts', // Posts list
    `/ar/posts/${post.slug}` // Individual post
  ]
  
  // Add category pages if applicable
  if (post.category?.slug) {
    paths.push(`/ar/posts/category/${post.category.slug}`)
  }
  
  // Add author page if applicable
  if (post.author.slug) {
    paths.push(`/ar/authors/${post.author.slug}`)
  }
  
  return paths
}