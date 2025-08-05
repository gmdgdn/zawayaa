// WordPress REST API response types for Zawaya platform

// Base WordPress API response structure
export interface WordPressResponse<T> {
  data: T
  headers: Record<string, string>
  status: number
}

// WordPress post/page base structure
export interface WordPressPost {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private'
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: 'open' | 'closed'
  ping_status: 'open' | 'closed'
  sticky: boolean
  template: string
  format: string
  meta: Record<string, any>
  categories: number[]
  tags: number[]
  _links: WordPressLinks
  _embedded?: WordPressEmbedded
}

// WordPress user structure
export interface WordPressUser {
  id: number
  name: string
  url: string
  description: string
  link: string
  slug: string
  avatar_urls: {
    '24': string
    '48': string
    '96': string
  }
  meta: Record<string, any>
  _links: WordPressLinks
}

// WordPress media/attachment structure
export interface WordPressMedia {
  id: number
  date: string
  slug: string
  type: 'attachment'
  link: string
  title: {
    rendered: string
  }
  author: number
  comment_status: 'open' | 'closed'
  ping_status: 'open' | 'closed'
  template: string
  meta: Record<string, any>
  description: {
    rendered: string
  }
  caption: {
    rendered: string
  }
  alt_text: string
  media_type: 'image' | 'video' | 'audio' | 'file'
  mime_type: string
  media_details: {
    width?: number
    height?: number
    file: string
    sizes?: Record<string, {
      file: string
      width: number
      height: number
      mime_type: string
      source_url: string
    }>
  }
  source_url: string
  _links: WordPressLinks
}

// WordPress taxonomy term structure
export interface WordPressTerm {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
  meta: Record<string, any>
  _links: WordPressLinks
}

// WordPress links structure
export interface WordPressLinks {
  self: Array<{ href: string }>
  collection: Array<{ href: string }>
  about: Array<{ href: string }>
  author?: Array<{ embeddable: boolean; href: string }>
  replies?: Array<{ embeddable: boolean; href: string }>
  'version-history'?: Array<{ count: number; href: string }>
  'predecessor-version'?: Array<{ id: number; href: string }>
  'wp:attachment'?: Array<{ href: string }>
  'wp:term'?: Array<{ taxonomy: string; embeddable: boolean; href: string }>
  'wp:featuredmedia'?: Array<{ embeddable: boolean; href: string }>
}

// WordPress embedded data structure
export interface WordPressEmbedded {
  author?: WordPressUser[]
  'wp:featuredmedia'?: WordPressMedia[]
  'wp:term'?: WordPressTerm[][]
}

// Article-specific WordPress post with SCF fields
export interface WordPressArticle extends WordPressPost {
  meta: {
    // Arabic content fields
    title_arabic?: string
    excerpt_arabic?: string
    content_arabic?: string
    author_arabic_name?: string
    author_bio_arabic?: string
    
    // Audio and media
    audio_narration_url?: string
    audio_duration?: number
    social_sharing_image?: string
    
    // Content metadata
    reading_time_minutes?: number
    category_color?: string
    is_featured?: boolean
    is_breaking_news?: boolean
    
    // SEO fields
    meta_description_arabic?: string
    keywords_arabic?: string
    
    // Additional article fields
    view_count?: number
    like_count?: number
    tags_arabic?: string
  }
}

// Program custom post type with SCF fields
export interface WordPressProgram extends WordPressPost {
  meta: {
    // Program details
    host_arabic?: string
    program_type: 'video' | 'audio' | 'mixed'
    theme_color?: string
    cover_image?: string
    
    // Statistics and metadata
    episode_count?: number
    average_duration?: number
    subscriber_count?: number
    program_rating?: number
    trailer_video?: string
    
    // Program status
    program_status?: 'active' | 'inactive' | 'upcoming' | 'completed'
    launch_date?: string
    latest_episode_date?: string
  }
}

// Episode custom post type with SCF fields
export interface WordPressEpisode extends WordPressPost {
  meta: {
    // Episode media
    video_embed_url?: string
    audio_file_url?: string
    episode_poster?: string
    episode_thumbnail?: string
    
    // Episode metadata
    season_number?: number
    episode_number?: number
    duration_seconds?: number
    transcript_arabic?: string
    episode_gallery?: string[]
    episode_tags_arabic?: string
    scheduled_publish?: string
    
    // Episode relationships
    parent_program_id?: number
    guest_arabic?: string
    
    // Statistics
    view_count?: number
    like_count?: number
    download_count?: number
  }
}

// Author with extended meta fields
export interface WordPressAuthor extends WordPressUser {
  meta: {
    // Arabic author fields
    name_arabic?: string
    job_title_arabic?: string
    bio_arabic?: string
    location_arabic?: string
    
    // Author media and verification
    author_avatar?: string
    author_cover_image?: string
    is_verified_author?: boolean
    is_featured_author?: boolean
    
    // Professional details
    expertise_areas?: string[]
    languages_spoken?: string[]
    social_media_links?: Array<{
      platform: string
      url: string
    }>
    
    // Statistics
    article_count?: number
    total_views?: number
  }
}

// WordPress API query parameters
export interface WordPressQueryParams {
  // Pagination
  page?: number
  per_page?: number
  offset?: number
  
  // Ordering
  order?: 'asc' | 'desc'
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'modified'
  
  // Filtering
  search?: string
  author?: number | number[]
  author_exclude?: number | number[]
  before?: string
  after?: string
  exclude?: number | number[]
  include?: number | number[]
  slug?: string | string[]
  status?: string | string[]
  categories?: number | number[]
  categories_exclude?: number | number[]
  tags?: number | number[]
  tags_exclude?: number | number[]
  sticky?: boolean
  
  // Embedding and context
  _embed?: boolean
  context?: 'view' | 'embed' | 'edit'
  
  // ACF fields
  acf_format?: 'standard' | 'array'
  
  // Custom fields
  meta_key?: string
  meta_value?: string
  meta_compare?: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE' | 'NOT LIKE'
}

// WordPress API error response
export interface WordPressError {
  code: string
  message: string
  data: {
    status: number
    params?: Record<string, any>
    details?: Record<string, any>
  }
}

// WordPress API collection response with pagination
export interface WordPressCollection<T> {
  data: T[]
  headers: {
    'x-wp-total': string
    'x-wp-totalpages': string
    'x-wp-per-page': string
    'x-wp-current-page': string
  }
}

// Transformed content types for application use
export interface TransformedArticle {
  id: number
  slug: string
  title: string
  titleArabic?: string
  content: string
  contentArabic?: string
  excerpt: string
  excerptArabic?: string
  author: {
    id: number
    name: string
    nameArabic?: string
    avatar?: string
    bio?: string
    bioArabic?: string
  }
  featuredImage?: {
    url: string
    alt: string
    width?: number
    height?: number
  }
  categories: Array<{
    id: number
    name: string
    slug: string
    color?: string
  }>
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  publishedDate: string
  modifiedDate: string
  readingTime?: number
  audioUrl?: string
  audioDuration?: number
  isFeatured: boolean
  isBreaking?: boolean
  viewCount?: number
  likeCount?: number
  seo: {
    title?: string
    description?: string
    keywords?: string
    image?: string
  }
}

export interface TransformedProgram {
  id: number
  slug: string
  title: string
  description: string
  type: 'video' | 'audio' | 'mixed'
  host?: string
  coverImage?: string
  themeColor?: string
  episodeCount: number
  averageDuration?: number
  subscriberCount?: number
  rating?: number
  status: 'active' | 'inactive' | 'upcoming' | 'completed'
  launchDate?: string
  latestEpisodeDate?: string
  trailerVideo?: string
  publishedDate: string
  modifiedDate: string
}

export interface TransformedEpisode {
  id: number
  slug: string
  title: string
  description: string
  episodeNumber: number
  seasonNumber?: number
  duration?: number
  videoUrl?: string
  audioUrl?: string
  poster?: string
  thumbnail?: string
  transcript?: string
  gallery?: string[]
  tags?: string
  guest?: string
  program: {
    id: number
    title: string
    slug: string
  }
  publishedDate: string
  scheduledPublish?: string
  viewCount?: number
  likeCount?: number
  downloadCount?: number
}

export interface TransformedAuthor {
  id: number
  slug: string
  name: string
  nameArabic?: string
  bio: string
  bioArabic?: string
  jobTitle?: string
  location?: string
  avatar?: string
  coverImage?: string
  isVerified: boolean
  isFeatured: boolean
  expertiseAreas?: string[]
  languagesSpoken?: string[]
  socialLinks?: Array<{
    platform: string
    url: string
  }>
  articleCount?: number
  totalViews?: number
  url: string
}

// Cache configuration types
export interface CacheConfig {
  revalidate?: number
  tags?: string[]
}

export interface ContentCacheStrategy {
  static: CacheConfig
  articles: CacheConfig
  programs: CacheConfig
  episodes: CacheConfig
  authors: CacheConfig
  homepage: CacheConfig
}