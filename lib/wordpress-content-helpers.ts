/**
 * WordPress Content Helper Functions
 * Specialized functions for fetching different content types with proper SCF handling
 */

import { wpClient, type NormalizedWPPost } from './wordpress'
import { transformWordPressPosts, transformWordPressPost, createFallbackPost } from './wordpress-transformers'

// Types for different content types
export interface ArticleFilters {
  page?: number
  per_page?: number
  category?: number
  author?: number
  search?: string
  featured?: boolean
  breaking?: boolean
  orderby?: 'date' | 'title' | 'menu_order'
  order?: 'asc' | 'desc'
}

export interface ProgramFilters {
  page?: number
  per_page?: number
  program_type?: 'video' | 'audio' | 'mixed'
  host?: string
  orderby?: 'date' | 'title' | 'menu_order'
  order?: 'asc' | 'desc'
}

export interface EpisodeFilters {
  page?: number
  per_page?: number
  program_id?: number
  season?: number
  orderby?: 'date' | 'episode_number' | 'title'
  order?: 'asc' | 'desc'
}

/**
 * Article Helper Functions
 */
export class ArticleHelpers {
  /**
   * Get articles with advanced filtering
   */
  static async getArticles(filters: ArticleFilters = {}): Promise<NormalizedWPPost[]> {
    try {
      const params: any = {
        per_page: filters.per_page || 10,
        page: filters.page || 1,
        status: 'publish',
        orderby: filters.orderby || 'date',
        order: filters.order || 'desc',
        _embed: true
      }

      // Add filters
      if (filters.category) params.categories = [filters.category]
      if (filters.author) params.author = filters.author
      if (filters.search) params.search = filters.search

      const posts = await wpClient.listPosts(params)

      // Apply SCF-based filters
      let filteredPosts = posts

      if (filters.featured !== undefined) {
        filteredPosts = filteredPosts.filter(post => 
          post.zawaya_meta.is_featured === filters.featured
        )
      }

      if (filters.breaking !== undefined) {
        filteredPosts = filteredPosts.filter(post => 
          post.zawaya_meta.is_breaking_news === filters.breaking
        )
      }

      return filteredPosts
    } catch (error) {
      console.error('Failed to get articles:', error)
      return [createFallbackPost('خطأ في تحميل المقالات', 'نعتذر، حدث خطأ في تحميل المقالات. يرجى المحاولة لاحقاً.')]
    }
  }

  /**
   * Get article by slug with full details
   */
  static async getArticleBySlug(slug: string): Promise<NormalizedWPPost | null> {
    try {
      return await wpClient.getPostBySlug(slug, true)
    } catch (error) {
      console.error(`Failed to get article by slug ${slug}:`, error)
      return null
    }
  }

  /**
   * Get featured articles
   */
  static async getFeaturedArticles(limit: number = 5): Promise<NormalizedWPPost[]> {
    try {
      return await wpClient.getFeaturedPosts(limit)
    } catch (error) {
      console.error('Failed to get featured articles:', error)
      return []
    }
  }

  /**
   * Get breaking news articles
   */
  static async getBreakingNews(limit: number = 3): Promise<NormalizedWPPost[]> {
    try {
      return await ArticleHelpers.getArticles({ 
        breaking: true, 
        per_page: limit,
        orderby: 'date',
        order: 'desc'
      })
    } catch (error) {
      console.error('Failed to get breaking news:', error)
      return []
    }
  }

  /**
   * Get articles by category
   */
  static async getArticlesByCategory(categoryId: number, limit: number = 10): Promise<NormalizedWPPost[]> {
    try {
      return await this.getArticles({ 
        category: categoryId, 
        per_page: limit 
      })
    } catch (error) {
      console.error(`Failed to get articles by category ${categoryId}:`, error)
      return []
    }
  }

  /**
   * Get articles by author
   */
  static async getArticlesByAuthor(authorId: number, limit: number = 10): Promise<NormalizedWPPost[]> {
    try {
      return await this.getArticles({ 
        author: authorId, 
        per_page: limit 
      })
    } catch (error) {
      console.error(`Failed to get articles by author ${authorId}:`, error)
      return []
    }
  }

  /**
   * Search articles with Arabic support
   */
  static async searchArticles(query: string, limit: number = 10): Promise<NormalizedWPPost[]> {
    try {
      if (!query.trim()) return []
      return await wpClient.searchPosts(query, limit)
    } catch (error) {
      console.error(`Failed to search articles for "${query}":`, error)
      return []
    }
  }

  /**
   * Get related articles based on categories and tags
   */
  static async getRelatedArticles(article: NormalizedWPPost, limit: number = 4): Promise<NormalizedWPPost[]> {
    try {
      // Get articles from same categories
      const relatedByCategory = article.categories.length > 0 
        ? await this.getArticlesByCategory(article.categories[0], limit * 2)
        : []

      // Filter out the current article and limit results
      const related = relatedByCategory
        .filter(post => post.id !== article.id)
        .slice(0, limit)

      return related
    } catch (error) {
      console.error('Failed to get related articles:', error)
      return []
    }
  }

  /**
   * Get articles with audio narration
   */
  static async getArticlesWithAudio(limit: number = 10): Promise<NormalizedWPPost[]> {
    try {
      const articles = await this.getArticles({ per_page: limit * 2 })
      
      // Filter articles that have audio narration
      return articles
        .filter(article => article.zawaya_meta.audio_narration_url)
        .slice(0, limit)
    } catch (error) {
      console.error('Failed to get articles with audio:', error)
      return []
    }
  }
}

/**
 * Program Helper Functions
 */
export class ProgramHelpers {
  /**
   * Get programs with filtering
   */
  static async getPrograms(filters: ProgramFilters = {}): Promise<any[]> {
    try {
      const params: any = {
        per_page: filters.per_page || 10,
        page: filters.page || 1,
        orderby: filters.orderby || 'date',
        order: filters.order || 'desc',
        _embed: true
      }

      const programs = await wpClient.wpGet('/program', params, 'programs')
      
      // Apply SCF-based filters if zawaya_meta is available
      let filteredPrograms = programs

      if (filters.program_type && programs.length > 0 && programs[0].zawaya_meta) {
        filteredPrograms = filteredPrograms.filter((program: any) => 
          program.zawaya_meta.program_type === filters.program_type
        )
      }

      return filteredPrograms
    } catch (error) {
      console.error('Failed to get programs:', error)
      return []
    }
  }

  /**
   * Get program by slug
   */
  static async getProgramBySlug(slug: string): Promise<any | null> {
    try {
      const programs = await wpClient.wpGet('/program', { 
        slug, 
        _embed: true 
      }, 'programs')
      
      return programs.length > 0 ? programs[0] : null
    } catch (error) {
      console.error(`Failed to get program by slug ${slug}:`, error)
      return null
    }
  }

  /**
   * Get programs by type
   */
  static async getProgramsByType(type: 'video' | 'audio' | 'mixed', limit: number = 10): Promise<any[]> {
    try {
      return await this.getPrograms({ 
        program_type: type, 
        per_page: limit 
      })
    } catch (error) {
      console.error(`Failed to get programs by type ${type}:`, error)
      return []
    }
  }
}

/**
 * Episode Helper Functions
 */
export class EpisodeHelpers {
  /**
   * Get episodes with filtering
   */
  static async getEpisodes(filters: EpisodeFilters = {}): Promise<any[]> {
    try {
      const params: any = {
        per_page: filters.per_page || 10,
        page: filters.page || 1,
        orderby: filters.orderby || 'date',
        order: filters.order || 'desc',
        _embed: true
      }

      const episodes = await wpClient.wpGet('/episode', params, 'episodes')
      
      // Apply SCF-based filters if zawaya_meta is available
      let filteredEpisodes = episodes

      if (filters.program_id && episodes.length > 0 && episodes[0].zawaya_meta) {
        filteredEpisodes = filteredEpisodes.filter((episode: any) => 
          episode.zawaya_meta.program_reference === filters.program_id.toString()
        )
      }

      if (filters.season && episodes.length > 0 && episodes[0].zawaya_meta) {
        filteredEpisodes = filteredEpisodes.filter((episode: any) => 
          episode.zawaya_meta.season_number === filters.season
        )
      }

      return filteredEpisodes
    } catch (error) {
      console.error('Failed to get episodes:', error)
      return []
    }
  }

  /**
   * Get episodes for a specific program
   */
  static async getEpisodesByProgram(programId: number, limit: number = 10): Promise<any[]> {
    try {
      return await this.getEpisodes({ 
        program_id: programId, 
        per_page: limit,
        orderby: 'episode_number',
        order: 'asc'
      })
    } catch (error) {
      console.error(`Failed to get episodes for program ${programId}:`, error)
      return []
    }
  }

  /**
   * Get episode by slug
   */
  static async getEpisodeBySlug(slug: string): Promise<any | null> {
    try {
      const episodes = await wpClient.wpGet('/episode', { 
        slug, 
        _embed: true 
      }, 'episodes')
      
      return episodes.length > 0 ? episodes[0] : null
    } catch (error) {
      console.error(`Failed to get episode by slug ${slug}:`, error)
      return null
    }
  }

  /**
   * Get latest episodes across all programs
   */
  static async getLatestEpisodes(limit: number = 10): Promise<any[]> {
    try {
      return await this.getEpisodes({ 
        per_page: limit,
        orderby: 'date',
        order: 'desc'
      })
    } catch (error) {
      console.error('Failed to get latest episodes:', error)
      return []
    }
  }
}

/**
 * Author Helper Functions
 */
export class AuthorHelpers {
  /**
   * Get authors/users
   */
  static async getAuthors(limit: number = 10): Promise<any[]> {
    try {
      const authors = await wpClient.wpGet('/users', { 
        per_page: limit,
        _embed: true 
      }, 'authors')
      
      return authors
    } catch (error) {
      console.error('Failed to get authors:', error)
      return []
    }
  }

  /**
   * Get author by ID
   */
  static async getAuthorById(id: number): Promise<any | null> {
    try {
      const author = await wpClient.wpGet(`/users/${id}`, { 
        _embed: true 
      }, 'authors')
      
      return author
    } catch (error) {
      console.error(`Failed to get author by ID ${id}:`, error)
      return null
    }
  }

  /**
   * Get author by slug
   */
  static async getAuthorBySlug(slug: string): Promise<any | null> {
    try {
      const authors = await wpClient.wpGet('/users', { 
        slug,
        _embed: true 
      }, 'authors')
      
      return authors.length > 0 ? authors[0] : null
    } catch (error) {
      console.error(`Failed to get author by slug ${slug}:`, error)
      return null
    }
  }
}

/**
 * Category and Taxonomy Helper Functions
 */
export class TaxonomyHelpers {
  /**
   * Get categories
   */
  static async getCategories(limit: number = 50): Promise<any[]> {
    try {
      const categories = await wpClient.wpGet('/categories', { 
        per_page: limit,
        orderby: 'name',
        order: 'asc'
      }, 'navigation')
      
      return categories
    } catch (error) {
      console.error('Failed to get categories:', error)
      return []
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: number): Promise<any | null> {
    try {
      const category = await wpClient.wpGet(`/categories/${id}`, {}, 'navigation')
      return category
    } catch (error) {
      console.error(`Failed to get category by ID ${id}:`, error)
      return null
    }
  }

  /**
   * Get tags
   */
  static async getTags(limit: number = 50): Promise<any[]> {
    try {
      const tags = await wpClient.wpGet('/tags', { 
        per_page: limit,
        orderby: 'name',
        order: 'asc'
      }, 'navigation')
      
      return tags
    } catch (error) {
      console.error('Failed to get tags:', error)
      return []
    }
  }
}

// Export all helpers
export {
  ArticleHelpers as Articles,
  ProgramHelpers as Programs, 
  EpisodeHelpers as Episodes,
  AuthorHelpers as Authors,
  TaxonomyHelpers as Taxonomies
}

// Export convenience functions
export const getArticles = ArticleHelpers.getArticles
export const getArticleBySlug = ArticleHelpers.getArticleBySlug
export const getFeaturedArticles = ArticleHelpers.getFeaturedArticles
export const getBreakingNews = ArticleHelpers.getBreakingNews
export const searchArticles = ArticleHelpers.searchArticles

export const getPrograms = ProgramHelpers.getPrograms
export const getProgramBySlug = ProgramHelpers.getProgramBySlug
export const getProgramsByType = ProgramHelpers.getProgramsByType

export const getEpisodes = EpisodeHelpers.getEpisodes
export const getEpisodesByProgram = EpisodeHelpers.getEpisodesByProgram
export const getLatestEpisodes = EpisodeHelpers.getLatestEpisodes

export const getAuthors = AuthorHelpers.getAuthors
export const getAuthorById = AuthorHelpers.getAuthorById

export const getCategories = TaxonomyHelpers.getCategories
export const getCategoryById = TaxonomyHelpers.getCategoryById