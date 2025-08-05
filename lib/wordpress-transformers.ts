/**
 * WordPress Response Transformation Utilities
 * Handles SCF (Secure Custom Fields) data transformation and normalization
 */

// SCF field mappings for different post types
export const SCF_FIELD_MAPS = {
  post: [
    'title_arabic',
    'excerpt_arabic', 
    'content_arabic',
    'audio_narration_url',
    'audio_duration',
    'reading_time_minutes',
    'is_featured',
    'is_breaking_news',
    'category_color',
    'author_arabic_name',
    'author_bio_arabic',
    'social_sharing_image',
    'meta_description_arabic',
    'keywords_arabic'
  ],
  program: [
    'program_wp_id',
    'program_type',
    'host_arabic',
    'episode_count',
    'average_duration',
    'subscriber_count',
    'program_rating',
    'cover_image',
    'trailer_video',
    'theme_color',
    'launch_date'
  ],
  episode: [
    'episode_wp_id',
    'program_reference',
    'episode_number',
    'season_number',
    'duration_seconds',
    'view_count',
    'video_embed_url',
    'audio_file_url',
    'episode_thumbnail',
    'episode_poster',
    'transcript_arabic',
    'episode_gallery',
    'episode_tags_arabic',
    'scheduled_publish'
  ]
} as const

// Normalized data types
export interface NormalizedZawayaMeta {
  // Common fields
  title_arabic?: string
  excerpt_arabic?: string
  content_arabic?: string
  
  // Article fields
  audio_narration_url?: string
  audio_duration?: number | null
  reading_time_minutes?: number | null
  is_featured?: boolean
  is_breaking_news?: boolean
  category_color?: string
  author_arabic_name?: string
  author_bio_arabic?: string
  social_sharing_image?: string
  meta_description_arabic?: string
  keywords_arabic?: string
  
  // Program fields
  program_type?: 'video' | 'audio' | 'mixed'
  host_arabic?: string
  episode_count?: number | null
  average_duration?: number | null
  subscriber_count?: number | null
  program_rating?: number | null
  cover_image?: string
  trailer_video?: string
  theme_color?: string
  launch_date?: string
  
  // Episode fields
  program_reference?: string
  episode_number?: number | null
  season_number?: number | null
  duration_seconds?: number | null
  view_count?: number | null
  video_embed_url?: string
  audio_file_url?: string
  episode_thumbnail?: string
  episode_poster?: string
  transcript_arabic?: string
  episode_gallery?: string[]
  episode_tags_arabic?: string[]
  scheduled_publish?: string
}

export interface NormalizedCategory {
  id: number
  name: string
  name_ar: string
  slug: string
  link: string
}

export interface NormalizedAuthor {
  id: number
  name: string
  name_ar: string
  slug: string
  avatar_urls: Record<string, string>
  link: string
}

export interface NormalizedWPPost {
  id: number
  slug: string
  status: string
  title: string
  title_ar: string
  content: string
  content_ar: string
  excerpt: string
  excerpt_ar: string
  date: string
  modified: string
  author: NormalizedAuthor
  featured_media: number
  featured_image_url?: string
  categories: number[]
  category?: NormalizedCategory
  tags: number[]
  zawaya_meta: NormalizedZawayaMeta
  
  // Computed fields for compatibility
  audio_url?: string
  read_time_minutes?: number
  published_at: string
}

/**
 * Normalize SCF meta fields from WordPress response
 */
export function normalizeZawayaMeta(
  meta: Record<string, any> | undefined,
  zawayaMeta?: Record<string, any>
): NormalizedZawayaMeta {
  // Prefer zawaya_meta if available (from zawaya-scf-rest plugin)
  const source = zawayaMeta || meta || {}
  
  return {
    // Text fields
    title_arabic: source.title_arabic || '',
    excerpt_arabic: source.excerpt_arabic || '',
    content_arabic: source.content_arabic || '',
    audio_narration_url: source.audio_narration_url || '',
    category_color: source.category_color || '',
    author_arabic_name: source.author_arabic_name || '',
    author_bio_arabic: source.author_bio_arabic || '',
    social_sharing_image: source.social_sharing_image || '',
    meta_description_arabic: source.meta_description_arabic || '',
    keywords_arabic: source.keywords_arabic || '',
    
    // Boolean fields (SCF stores as '1' or '')
    is_featured: source.is_featured === '1' || source.is_featured === true,
    is_breaking_news: source.is_breaking_news === '1' || source.is_breaking_news === true,
    
    // Numeric fields
    audio_duration: source.audio_duration ? Number(source.audio_duration) : null,
    reading_time_minutes: source.reading_time_minutes ? Number(source.reading_time_minutes) : null,
    
    // Program fields
    program_type: source.program_type as 'video' | 'audio' | 'mixed' || undefined,
    host_arabic: source.host_arabic || '',
    episode_count: source.episode_count ? Number(source.episode_count) : null,
    average_duration: source.average_duration ? Number(source.average_duration) : null,
    subscriber_count: source.subscriber_count ? Number(source.subscriber_count) : null,
    program_rating: source.program_rating ? Number(source.program_rating) : null,
    cover_image: source.cover_image || '',
    trailer_video: source.trailer_video || '',
    theme_color: source.theme_color || '',
    launch_date: source.launch_date || '',
    
    // Episode fields
    program_reference: source.program_reference || '',
    episode_number: source.episode_number ? Number(source.episode_number) : null,
    season_number: source.season_number ? Number(source.season_number) : null,
    duration_seconds: source.duration_seconds ? Number(source.duration_seconds) : null,
    view_count: source.view_count ? Number(source.view_count) : null,
    video_embed_url: source.video_embed_url || '',
    audio_file_url: source.audio_file_url || '',
    episode_thumbnail: source.episode_thumbnail || '',
    episode_poster: source.episode_poster || '',
    transcript_arabic: source.transcript_arabic || '',
    episode_gallery: source.episode_gallery ? JSON.parse(source.episode_gallery) : [],
    episode_tags_arabic: source.episode_tags_arabic ? JSON.parse(source.episode_tags_arabic) : [],
    scheduled_publish: source.scheduled_publish || ''
  }
}

/**
 * Extract and normalize category from WordPress _embedded data
 */
export function extractCategory(embedded?: any): NormalizedCategory | undefined {
  if (!embedded || !embedded['wp:term'] || !embedded['wp:term'][0]) {
    return undefined
  }
  
  const categories = embedded['wp:term'][0]
  if (!categories || categories.length === 0) {
    return undefined
  }
  
  const category = categories[0]
  return {
    id: category.id,
    name: category.name,
    name_ar: category.name, // Use same for now, can be enhanced later
    slug: category.slug,
    link: category.link
  }
}

/**
 * Extract and normalize author from WordPress _embedded data
 */
export function extractAuthor(embedded?: any): NormalizedAuthor | undefined {
  if (!embedded || !embedded.author || !embedded.author[0]) {
    return undefined
  }
  
  const author = embedded.author[0]
  return {
    id: author.id,
    name: author.name,
    name_ar: author.name, // Use same for now, can be enhanced later
    slug: author.slug,
    avatar_urls: author.avatar_urls || {},
    link: author.link
  }
}

/**
 * Extract featured image URL from WordPress _embedded data
 */
export function extractFeaturedImage(embedded?: any): string | undefined {
  if (!embedded || !embedded['wp:featuredmedia'] || !embedded['wp:featuredmedia'][0]) {
    return undefined
  }
  
  return embedded['wp:featuredmedia'][0].source_url
}

/**
 * Transform WordPress post response to normalized format
 */
export function transformWordPressPost(wpPost: any): NormalizedWPPost {
  const zawayaMeta = normalizeZawayaMeta(wpPost.meta, wpPost.zawaya_meta)
  const category = extractCategory(wpPost._embedded)
  const author = extractAuthor(wpPost._embedded)
  const featuredImageUrl = extractFeaturedImage(wpPost._embedded)
  
  return {
    id: wpPost.id,
    slug: wpPost.slug,
    status: wpPost.status,
    title: wpPost.title?.rendered || '',
    title_ar: zawayaMeta.title_arabic || wpPost.title?.rendered || '',
    content: wpPost.content?.rendered || '',
    content_ar: zawayaMeta.content_arabic || wpPost.content?.rendered || '',
    excerpt: wpPost.excerpt?.rendered || '',
    excerpt_ar: zawayaMeta.excerpt_arabic || wpPost.excerpt?.rendered || '',
    date: wpPost.date,
    modified: wpPost.modified,
    author: author || {
      id: wpPost.author || 1,
      name: zawayaMeta.author_arabic_name || 'Unknown Author',
      name_ar: zawayaMeta.author_arabic_name || 'مؤلف غير معروف',
      slug: 'unknown',
      avatar_urls: {},
      link: ''
    },
    featured_media: wpPost.featured_media || 0,
    featured_image_url: featuredImageUrl,
    categories: wpPost.categories || [],
    category,
    tags: wpPost.tags || [],
    zawaya_meta: zawayaMeta,
    
    // Computed fields for backward compatibility
    audio_url: zawayaMeta.audio_narration_url,
    read_time_minutes: zawayaMeta.reading_time_minutes,
    published_at: wpPost.date
  }
}

/**
 * Transform array of WordPress posts
 */
export function transformWordPressPosts(wpPosts: any[]): NormalizedWPPost[] {
  return wpPosts.map(transformWordPressPost)
}

/**
 * Create fallback post when WordPress is unavailable
 */
export function createFallbackPost(
  title: string = 'الموقع قيد الصيانة',
  content: string = 'نعتذر، الموقع قيد الصيانة حالياً. يرجى المحاولة لاحقاً.'
): NormalizedWPPost {
  return {
    id: Date.now(),
    slug: 'maintenance-mode',
    status: 'publish',
    title,
    title_ar: title,
    content,
    content_ar: content,
    excerpt: content.substring(0, 150),
    excerpt_ar: content.substring(0, 150),
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    author: {
      id: 1,
      name: 'Zawaya Team',
      name_ar: 'فريق زوايا',
      slug: 'zawaya-team',
      avatar_urls: {},
      link: ''
    },
    featured_media: 0,
    categories: [],
    tags: [],
    zawaya_meta: {
      title_arabic: title,
      excerpt_arabic: content.substring(0, 150),
      content_arabic: content,
      is_featured: false,
      is_breaking_news: false
    },
    published_at: new Date().toISOString()
  }
}

// Export types for use in other files
export type { NormalizedWPPost, NormalizedZawayaMeta, NormalizedCategory, NormalizedAuthor }