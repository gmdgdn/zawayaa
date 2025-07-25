import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for frontend operations
export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin client for backend operations (server-side only)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database schema types
export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          slug: string
          author_id: string
          category_id: string
          title_ar: string
          content: string
          summary_ar: string
          excerpt_ar?: string
          featured_image_url?: string
          audio_url?: string
          audio_duration?: number
          tags_ar: string[]
          is_featured: boolean
          view_count: number
          like_count: number
          read_time_minutes: number
          status: 'draft' | 'published' | 'archived'
          published_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          author_id: string
          category_id: string
          title_ar: string
          content: string
          summary_ar: string
          excerpt_ar?: string
          featured_image_url?: string
          audio_url?: string
          audio_duration?: number
          tags_ar?: string[]
          is_featured?: boolean
          view_count?: number
          like_count?: number
          read_time_minutes?: number
          status?: 'draft' | 'published' | 'archived'
          published_at?: string
        }
        Update: {
          slug?: string
          author_id?: string
          category_id?: string
          title_ar?: string
          content?: string
          summary_ar?: string
          excerpt_ar?: string
          featured_image_url?: string
          audio_url?: string
          audio_duration?: number
          tags_ar?: string[]
          is_featured?: boolean
          view_count?: number
          like_count?: number
          read_time_minutes?: number
          status?: 'draft' | 'published' | 'archived'
          published_at?: string
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          bio?: string
          avatar_url?: string
          email?: string
          social_twitter?: string
          social_facebook?: string
          social_instagram?: string
          social_linkedin?: string
          website_url?: string
          location?: string
          expertise_tags?: string[]
          is_verified: boolean
          is_featured: boolean
          article_count: number
          created_at: string
          updated_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name_ar: string
          name_en?: string
          slug: string
          description_ar?: string
          description_en?: string
          color?: string
          icon?: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      programs: {
        Row: {
          id: string
          slug: string
          type: 'video' | 'audio' | 'mixed'
          title_ar: string
          description_ar: string
          cover_image_url?: string
          host_ar?: string
          category_id?: string
          status: 'active' | 'inactive' | 'upcoming' | 'completed'
          featured: boolean
          episode_count: number
          duration_avg: number
          launch_date?: string
          latest_episode_date?: string
          view_count: number
          subscriber_count: number
          created_at: string
          updated_at: string
        }
      }
      episodes: {
        Row: {
          id: string
          program_id: string
          title_ar: string
          description_ar?: string
          episode_number: number
          season_number: number
          duration: number
          video_url?: string
          audio_url?: string
          transcript_url?: string
          cover_image_url?: string
          guest_ar?: string
          host_ar?: string
          view_count: number
          like_count: number
          download_count: number
          status: 'draft' | 'published' | 'scheduled' | 'archived'
          published_at?: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
} 