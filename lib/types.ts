// Core content types for Zawaya platform

export interface Author {
  id: string
  name: string
  bio?: string
  avatar?: string
  email?: string
  social_twitter?: string
  social_facebook?: string
  social_instagram?: string
  social_linkedin?: string
  website_url?: string
  location?: string
  expertise_tags?: string[]
  is_verified?: boolean
  is_featured?: boolean
  article_count?: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name_ar: string
  name_en?: string
  slug: string
  description_ar?: string
  description_en?: string
  color?: string
  icon?: string
  sort_order?: number
  is_active: boolean
}

export interface Article {
  id: string
  slug: string
  author: Author
  category: Category
  // Content categories: "آراء سياسية" | "تقدير موقف" | "مقالات"
  category_ar: string
  // Subcategories for "مقالات": "فن" | "أدب" | "ثقافة" | "تاريخ"
  subcategory_ar?: string
  title_ar: string
  content: string // Full markdown/text content
  summary_ar: string
  excerpt_ar?: string
  image_url?: string
  featured_image_url?: string
  audio_url?: string
  audio_duration?: number
  tags_ar: string[]
  is_featured: boolean
  view_count: number
  like_count: number
  read_time_minutes: number
  published_date: string
  created_at: string
  updated_at: string
  status: 'draft' | 'published' | 'archived'
}

export interface Program {
  id: string
  slug: string
  type: 'video' | 'audio' | 'mixed'
  title_ar: string
  description_ar: string
  cover_image_url?: string
  host_ar?: string
  presenter_ar?: string
  category?: Category
  status: 'active' | 'inactive' | 'upcoming' | 'completed'
  featured: boolean
  episode_count: number
  duration_avg: number // Average duration in minutes
  launch_date?: string
  latest_episode_date?: string
  view_count: number
  subscriber_count: number
  created_at: string
  updated_at: string
}

export interface PodcastEpisode {
  id: string
  program: Program
  title_ar: string
  description_ar?: string
  episode_details_ar?: string
  episode_number: number
  season_number: number
  duration: string // Format: "45:15"
  duration_seconds?: number
  video_url?: string
  audio_url?: string
  transcript_url?: string
  cover_image_url?: string
  thumbnail_url?: string
  guest_ar?: string
  host_ar?: string
  summary_ar?: string
  view_count: number
  like_count: number
  download_count: number
  published_date: string
  created_at: string
  updated_at: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
}

export interface Documentary {
  id: string
  title_ar: string
  title_en?: string
  synopsis_ar: string
  description_ar: string
  thumbnail_url?: string
  video_url?: string
  duration: string
  release_date: string
  director_ar?: string
  category_ar: string
  view_count: number
  like_count: number
  tags_ar: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

export interface NewsletterSubscription {
  id: string
  name: string
  email: string
  topics?: string[]
  language: 'ar' | 'en'
  status: 'active' | 'unsubscribed' | 'bounced'
  subscribed_at: string
  unsubscribed_at?: string
}

export interface GuestSubmission {
  id: string
  name: string
  email: string
  phone?: string
  title: string
  content: string
  bio?: string
  category?: Category
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  admin_notes?: string
  submitted_at: string
  reviewed_at?: string
}

// Homepage content structure
export interface HomepageContent {
  hero_featured_article: Article
  latest_podcasts_and_programs: PodcastEpisode[]
  opinions_and_assessments: Article[]
  diverse_articles: Article[]
  featured_programs: Program[]
}

// Content filters and search
export interface ContentFilters {
  category?: string
  subcategory?: string
  author?: string
  tags?: string[]
  date_from?: string
  date_to?: string
  featured_only?: boolean
}

export interface SearchResult {
  id: string
  type: 'article' | 'podcast' | 'program' | 'documentary'
  title: string
  summary: string
  url: string
  published_date: string
  relevance_score: number
} 