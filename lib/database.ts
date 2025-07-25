import { supabase } from './supabase'
import type { 
  Article, 
  Program, 
  PodcastEpisode, 
  Author, 
  Category, 
  NewsletterSubscription,
  GuestSubmission 
} from './types'

// Articles
export const articleService = {
  // Get all articles with optional filtering
  async getAll(filters?: {
    category?: string
    author?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*),
        article_translations!inner(*)
      `)
      .eq('article_translations.language_code', 'ar')
      .order('created_at', { ascending: false })

    if (filters?.category) {
      query = query.eq('category.slug', filters.category)
    }
    
    if (filters?.author) {
      query = query.eq('author.slug', filters.author)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  // Get article by ID or slug
  async getById(id: string) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*),
        article_translations!inner(*)
      `)
      .eq('article_translations.language_code', 'ar')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*),
        article_translations!inner(*)
      `)
      .eq('article_translations.language_code', 'ar')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  // Get featured articles
  async getFeatured(limit = 5) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*),
        article_translations!inner(*)
      `)
      .eq('article_translations.language_code', 'ar')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  // Get articles by category
  async getByCategory(categorySlug: string, limit = 10) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories!inner(*),
        article_translations!inner(*)
      `)
      .eq('article_translations.language_code', 'ar')
      .eq('categories.slug', categorySlug)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  // Search articles
  async search(query: string, filters?: {
    category?: string
    type?: string
    limit?: number
  }) {
    let dbQuery = supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*),
        article_translations!inner(*)
      `)
      .eq('article_translations.language_code', 'ar')

    // Full-text search on title and content
    if (query) {
      dbQuery = dbQuery.or(`
        article_translations.title.ilike.%${query}%,
        article_translations.content.ilike.%${query}%,
        article_translations.summary.ilike.%${query}%
      `)
    }

    if (filters?.category) {
      dbQuery = dbQuery.eq('category.slug', filters.category)
    }

    if (filters?.type) {
      dbQuery = dbQuery.eq('type', filters.type)
    }

    dbQuery = dbQuery
      .order('created_at', { ascending: false })
      .limit(filters?.limit || 20)

    const { data, error } = await dbQuery

    if (error) throw error
    return data
  },

  // Increment view count
  async incrementViews(id: string) {
    const { error } = await supabase.rpc('increment_article_views', {
      article_id: id
    })

    if (error) throw error
  }
}

// Categories
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_ar')

    if (error) throw error
    return data
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  }
}

// Authors
export const authorService = {
  async getAll() {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  async getWithArticles(authorSlug: string) {
    const { data, error } = await supabase
      .from('authors')
      .select(`
        *,
        articles(
          *,
          category:categories(*),
          article_translations!inner(*)
        )
      `)
      .eq('slug', authorSlug)
      .eq('articles.article_translations.language_code', 'ar')
      .single()

    if (error) throw error
    return data
  }
}

// Programs & Episodes
export const programService = {
  async getAll() {
    const { data, error } = await supabase
      .from('programs')
      .select(`
        *,
        episodes(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('programs')
      .select(`
        *,
        episodes(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getEpisodes(programId: string, limit = 10) {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('program_id', programId)
      .order('episode_number', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  async getFeaturedEpisodes(limit = 5) {
    const { data, error } = await supabase
      .from('episodes')
      .select(`
        *,
        program:programs(*)
      `)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }
}

// Newsletter Subscriptions
export const newsletterService = {
  async subscribe(email: string, preferences?: {
    weekly_digest?: boolean
    breaking_news?: boolean
    podcast_updates?: boolean
  }) {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email,
        subscribed_at: new Date().toISOString(),
        preferences: preferences || {
          weekly_digest: true,
          breaking_news: false,
          podcast_updates: true
        },
        is_active: true
      })
      .select()
      .single()

    if (error) {
      // Handle duplicate email error
      if (error.code === '23505') {
        throw new Error('هذا البريد الإلكتروني مشترك بالفعل')
      }
      throw error
    }

    return data
  },

  async unsubscribe(email: string) {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
      .eq('email', email)

    if (error) throw error
  },

  async getSubscriptionCount() {
    const { count, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (error) throw error
    return count || 0
  }
}

// Guest Submissions
export const submissionService = {
  async create(submission: {
    author_name: string
    email: string
    title: string
    category: string
    summary: string
    content: string
    author_bio?: string
    references?: string
    qualifications?: string
  }) {
    const { data, error } = await supabase
      .from('guest_submissions')
      .insert({
        ...submission,
        submitted_at: new Date().toISOString(),
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAll(status?: string) {
    let query = supabase
      .from('guest_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: string, feedback?: string) {
    const { error } = await supabase
      .from('guest_submissions')
      .update({ 
        status, 
        feedback,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  }
}

// Homepage Content
export const homepageService = {
  async getContent() {
    try {
      // Get featured article
      const featuredArticles = await articleService.getFeatured(1)
      const featuredArticle = featuredArticles[0]

      // Get political opinions
      const politicalOpinions = await articleService.getByCategory('political-opinion', 4)

      // Get situation assessments  
      const situationAssessments = await articleService.getByCategory('situation-assessment', 4)

      // Get featured programs
      const programs = await programService.getAll()

      // Get articles by category for the bottom section
      const categories = await categoryService.getAll()
      const articlesByCategory: { [key: string]: any[] } = {}

      for (const category of categories.slice(0, 3)) {
        const articles = await articleService.getByCategory(category.slug, 2)
        articlesByCategory[category.name_ar] = articles
      }

      return {
        featuredArticle,
        politicalOpinions,
        situationAssessments,
        programs: programs.slice(0, 4),
        articlesByCategory
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error)
      throw error
    }
  }
}

// Database utility functions
export const dbUtils = {
  // Initialize database with sample data
  async seedDatabase() {
    try {
      // This would run the SQL scripts to populate initial data
      console.log('Database seeding should be done via SQL scripts')
      return true
    } catch (error) {
      console.error('Error seeding database:', error)
      throw error
    }
  },

  // Check database connection
  async checkConnection() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('count')
        .limit(1)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Database connection failed:', error)
      return false
    }
  }
} 