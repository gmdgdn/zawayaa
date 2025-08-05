/**
 * Cache Tags Constants and Helpers for Zawaya Platform
 * Centralized cache tag management for WordPress integration
 */

// Cache tag constants
export const CACHE_TAGS = {
  // WordPress content
  ARTICLES: 'articles',
  FEATURED_ARTICLES: 'featured-articles',
  ARTICLE_BY_ID: (id: string | number) => `article-${id}`,
  ARTICLE_BY_SLUG: (slug: string) => `article-slug-${slug}`,
  
  // WordPress content
  PROGRAMS: 'programs',
  FEATURED_PROGRAMS: 'featured-programs',
  PROGRAM_BY_ID: (id: string) => `program-${id}`,
  
  EPISODES: 'episodes',
  EPISODE_BY_ID: (id: string) => `episode-${id}`,
  PROGRAM_EPISODES: (programId: string) => `program-${programId}-episodes`,
  
  AUTHORS: 'authors',
  AUTHOR_BY_ID: (id: string) => `author-${id}`,
  
  CATEGORIES: 'categories',
  
  // Homepage and aggregated content
  HOMEPAGE: 'homepage',
  HOMEPAGE_HERO: 'homepage-hero',
  HOMEPAGE_FEATURES: 'homepage-features',
  
  // Search
  SEARCH: 'search',
  SEARCH_QUERY: (query: string) => `search-${encodeURIComponent(query)}`,
  
  // Admin
  ADMIN_DASHBOARD: 'admin-dashboard',
  ADMIN_ANALYTICS: 'admin-analytics'
} as const

// Helper function to get related tags for revalidation
export function getRelatedTags(primaryTag: string): string[] {
  const relatedTags: Record<string, string[]> = {
    [CACHE_TAGS.ARTICLES]: [
      CACHE_TAGS.HOMEPAGE,
      CACHE_TAGS.FEATURED_ARTICLES,
      CACHE_TAGS.HOMEPAGE_FEATURES
    ],
    [CACHE_TAGS.PROGRAMS]: [
      CACHE_TAGS.HOMEPAGE,
      CACHE_TAGS.FEATURED_PROGRAMS,
      CACHE_TAGS.HOMEPAGE_FEATURES
    ],
    [CACHE_TAGS.EPISODES]: [
      CACHE_TAGS.PROGRAMS,
      CACHE_TAGS.HOMEPAGE_FEATURES
    ],
    [CACHE_TAGS.AUTHORS]: [
      CACHE_TAGS.HOMEPAGE,
      CACHE_TAGS.ARTICLES
    ],
    [CACHE_TAGS.CATEGORIES]: [
      CACHE_TAGS.ARTICLES,
      CACHE_TAGS.PROGRAMS
    ]
  }
  
  return relatedTags[primaryTag] || []
}

// Helper function to create fetch options with cache tags
export function createFetchOptions(
  tags: string | string[],
  options: RequestInit = {}
): RequestInit {
  const tagArray = Array.isArray(tags) ? tags : [tags]
  
  return {
    ...options,
    next: {
      tags: tagArray,
      ...options.next
    }
  }
}

// Helper function for WordPress API calls with caching
export function createWPFetchOptions(
  endpoint: string,
  additionalTags: string[] = []
): RequestInit {
  const baseTags = [CACHE_TAGS.ARTICLES]
  
  // Add specific tags based on endpoint
  if (endpoint.includes('/posts')) {
    baseTags.push(CACHE_TAGS.ARTICLES)
  }
  if (endpoint.includes('featured')) {
    baseTags.push(CACHE_TAGS.FEATURED_ARTICLES)
  }
  
  return createFetchOptions([...baseTags, ...additionalTags])
}

// Helper function for WordPress queries with caching
export function createWordPressCacheKey(
  endpoint: string,
  operation: string,
  params?: Record<string, any>
): string {
  const baseKey = `wp-${endpoint}-${operation}`
  
  if (!params) return baseKey
  
  const paramString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('-')
    
  return `${baseKey}-${paramString}`
}

// Cache duration constants (in seconds)
export const CACHE_DURATIONS = {
  STATIC_CONTENT: 3600, // 1 hour
  DYNAMIC_CONTENT: 300, // 5 minutes
  USER_CONTENT: 60, // 1 minute
  SEARCH_RESULTS: 600, // 10 minutes
  HOMEPAGE: 300, // 5 minutes
  ADMIN_DATA: 60 // 1 minute
} as const

// Helper to create Next.js cache config
export function createCacheConfig(
  tags: string | string[],
  revalidate?: number
) {
  return {
    next: {
      tags: Array.isArray(tags) ? tags : [tags],
      revalidate
    }
  }
}

// Type definitions
export type CacheTag = typeof CACHE_TAGS[keyof typeof CACHE_TAGS]
export type CacheDuration = typeof CACHE_DURATIONS[keyof typeof CACHE_DURATIONS]