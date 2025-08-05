/**
 * WordPress Fallback Data Provider
 * Provides fallback content when WordPress is unavailable
 */

import type { WPPost, WPPostsResponse } from './wordpress'

// Fallback article data for when WordPress is unavailable
const FALLBACK_ARTICLES: WPPostsResponse = [
  {
    id: 1,
    slug: 'fallback-article-1',
    status: 'publish',
    title: { rendered: 'مقال احتياطي - الموقع قيد الصيانة' },
    content: { rendered: '<p>نعتذر، الموقع قيد الصيانة حالياً. يرجى المحاولة لاحقاً.</p>' },
    excerpt: { rendered: 'الموقع قيد الصيانة حالياً' },
    author: 1,
    featured_media: 0,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    categories: [],
    tags: [],
    acf: {
      is_featured: true,
      excerpt_ar: 'الموقع قيد الصيانة حالياً'
    }
  }
]

// Fallback program data
const FALLBACK_PROGRAMS: WPPostsResponse = [
  {
    id: 1,
    slug: 'fallback-program-1',
    status: 'publish',
    title: { rendered: 'برنامج احتياطي - الموقع قيد الصيانة' },
    content: { rendered: '<p>نعتذر، الموقع قيد الصيانة حالياً. يرجى المحاولة لاحقاً.</p>' },
    excerpt: { rendered: 'الموقع قيد الصيانة حالياً' },
    author: 1,
    featured_media: 0,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    categories: [],
    tags: [],
    acf: {
      is_featured: false
    }
  }
]

/**
 * Fallback data provider class
 */
export class WordPressFallbackProvider {
  /**
   * Get fallback articles
   */
  static getFallbackArticles(limit: number = 10): WPPostsResponse {
    return FALLBACK_ARTICLES.slice(0, limit)
  }

  /**
   * Get fallback programs
   */
  static getFallbackPrograms(limit: number = 10): WPPostsResponse {
    return FALLBACK_PROGRAMS.slice(0, limit)
  }

  /**
   * Get fallback featured posts
   */
  static getFallbackFeaturedPosts(limit: number = 5): WPPostsResponse {
    return FALLBACK_ARTICLES.filter(post => 
      typeof post.acf === 'object' && 
      post.acf !== null && 
      !Array.isArray(post.acf) && 
      (post.acf as any).is_featured === true
    ).slice(0, limit)
  }

  /**
   * Get fallback single post
   */
  static getFallbackPost(slug?: string): WPPost | null {
    if (slug) {
      const post = FALLBACK_ARTICLES.find(p => p.slug === slug)
      return post || FALLBACK_ARTICLES[0]
    }
    return FALLBACK_ARTICLES[0]
  }

  /**
   * Get fallback search results
   */
  static getFallbackSearchResults(query: string, limit: number = 10): WPPostsResponse {
    // Return empty array for search when WordPress is down
    // This prevents showing irrelevant fallback content for searches
    return []
  }

  /**
   * Check if we should use fallback data
   */
  static shouldUseFallback(): boolean {
    // In a production system, this could check:
    // - WordPress health status
    // - Error rate thresholds
    // - Maintenance mode flags
    return false
  }

  /**
   * Get maintenance message
   */
  static getMaintenanceMessage(language: 'ar' | 'en' = 'ar'): string {
    const messages = {
      ar: 'نعتذر، الموقع قيد الصيانة حالياً. يرجى المحاولة لاحقاً.',
      en: 'Sorry, the site is currently under maintenance. Please try again later.'
    }
    return messages[language]
  }

  /**
   * Create fallback post with custom content
   */
  static createFallbackPost(
    title: string,
    content: string,
    slug: string = 'fallback-post'
  ): WPPost {
    return {
      id: Date.now(), // Use timestamp as unique ID
      slug,
      status: 'publish',
      title: { rendered: title },
      content: { rendered: content },
      excerpt: { rendered: content.substring(0, 150) + '...' },
      author: 1,
      featured_media: 0,
      date: new Date().toISOString(),
      modified: new Date().toISOString(),
      categories: [],
      tags: [],
      acf: {
        is_featured: false
      }
    }
  }
}

// Export convenience functions
export const getFallbackArticles = WordPressFallbackProvider.getFallbackArticles
export const getFallbackPrograms = WordPressFallbackProvider.getFallbackPrograms
export const getFallbackFeaturedPosts = WordPressFallbackProvider.getFallbackFeaturedPosts
export const getFallbackPost = WordPressFallbackProvider.getFallbackPost
export const getFallbackSearchResults = WordPressFallbackProvider.getFallbackSearchResults
export const getMaintenanceMessage = WordPressFallbackProvider.getMaintenanceMessage