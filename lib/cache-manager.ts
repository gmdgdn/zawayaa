/**
 * Cache Management Utilities for WordPress Integration
 * Handles Next.js cache tagging, revalidation strategies, and cache invalidation
 */

import { revalidateTag, revalidatePath } from 'next/cache'

// Cache tag definitions for different content types
export const CACHE_TAGS = {
  // Content types
  ARTICLES: 'articles',
  PROGRAMS: 'programs', 
  EPISODES: 'episodes',
  AUTHORS: 'authors',
  CATEGORIES: 'categories',
  
  // Page types
  HOMEPAGE: 'homepage',
  FEATURED: 'featured',
  SEARCH: 'search',
  NAVIGATION: 'navigation',
  
  // Static content
  STATIC: 'static',
  SITEMAP: 'sitemap'
} as const

// Cache revalidation intervals (in seconds)
export const CACHE_INTERVALS = {
  IMMEDIATE: 0,        // No cache
  SHORT: 60,           // 1 minute
  MEDIUM: 300,         // 5 minutes  
  LONG: 600,           // 10 minutes
  VERY_LONG: 3600,     // 1 hour
  STATIC: 86400        // 24 hours
} as const

// Predefined cache strategies for different content types
export const CACHE_STRATEGIES = {
  articles: {
    revalidate: CACHE_INTERVALS.MEDIUM,
    tags: [CACHE_TAGS.ARTICLES]
  },
  programs: {
    revalidate: CACHE_INTERVALS.LONG,
    tags: [CACHE_TAGS.PROGRAMS]
  },
  episodes: {
    revalidate: CACHE_INTERVALS.LONG,
    tags: [CACHE_TAGS.EPISODES, CACHE_TAGS.PROGRAMS]
  },
  authors: {
    revalidate: CACHE_INTERVALS.LONG,
    tags: [CACHE_TAGS.AUTHORS]
  },
  homepage: {
    revalidate: CACHE_INTERVALS.SHORT,
    tags: [CACHE_TAGS.HOMEPAGE, CACHE_TAGS.FEATURED]
  },
  featured: {
    revalidate: CACHE_INTERVALS.MEDIUM,
    tags: [CACHE_TAGS.FEATURED, CACHE_TAGS.ARTICLES]
  },
  search: {
    revalidate: CACHE_INTERVALS.SHORT,
    tags: [CACHE_TAGS.SEARCH, CACHE_TAGS.ARTICLES]
  },
  navigation: {
    revalidate: CACHE_INTERVALS.LONG,
    tags: [CACHE_TAGS.NAVIGATION, CACHE_TAGS.CATEGORIES]
  },
  static: {
    revalidate: CACHE_INTERVALS.VERY_LONG,
    tags: [CACHE_TAGS.STATIC]
  }
} as const

export type CacheStrategy = keyof typeof CACHE_STRATEGIES

/**
 * Cache Manager class for handling WordPress content caching
 */
export class CacheManager {
  /**
   * Get cache configuration for a specific strategy
   */
  static getStrategy(strategy: CacheStrategy) {
    return CACHE_STRATEGIES[strategy]
  }

  /**
   * Create custom cache options
   */
  static createCacheOptions(revalidate: number, tags: string[]) {
    return { revalidate, tags }
  }

  /**
   * Revalidate cache by tags
   */
  static revalidateByTags(tags: string[]) {
    tags.forEach(tag => {
      console.log(`Revalidating cache tag: ${tag}`)
      revalidateTag(tag)
    })
  }

  /**
   * Revalidate cache by paths
   */
  static revalidateByPaths(paths: string[]) {
    paths.forEach(path => {
      console.log(`Revalidating cache path: ${path}`)
      revalidatePath(path)
    })
  }

  /**
   * Smart revalidation based on content type and action
   */
  static smartRevalidate(contentType: string, action: string, slug?: string, id?: string) {
    const tags: string[] = []
    const paths: string[] = []

    switch (contentType) {
      case 'post':
      case 'article':
        tags.push(CACHE_TAGS.ARTICLES, CACHE_TAGS.HOMEPAGE, CACHE_TAGS.FEATURED)
        paths.push('/ar', '/ar/articles')
        
        if (slug) {
          paths.push(`/ar/articles/${slug}`)
        }
        if (id) {
          paths.push(`/ar/articles/${id}`)
        }
        break

      case 'program':
        tags.push(CACHE_TAGS.PROGRAMS, CACHE_TAGS.HOMEPAGE)
        paths.push('/ar', '/ar/programs')
        
        if (slug) {
          paths.push(`/ar/programs/${slug}`)
        }
        break

      case 'episode':
        tags.push(CACHE_TAGS.EPISODES, CACHE_TAGS.PROGRAMS)
        paths.push('/ar/programs') // Episodes are shown on program pages
        break

      case 'author':
      case 'user':
        tags.push(CACHE_TAGS.AUTHORS, CACHE_TAGS.HOMEPAGE)
        paths.push('/ar')
        
        if (slug) {
          paths.push(`/ar/authors/${slug}`)
        }
        break

      case 'category':
        tags.push(CACHE_TAGS.CATEGORIES, CACHE_TAGS.NAVIGATION)
        paths.push('/ar')
        break
    }

    // Action-specific revalidation
    if (action === 'delete') {
      // More aggressive revalidation for deletions
      tags.push(CACHE_TAGS.HOMEPAGE, CACHE_TAGS.NAVIGATION, CACHE_TAGS.SITEMAP)
      paths.push('/', '/sitemap.xml')
    }

    // Execute revalidation
    this.revalidateByTags(tags)
    this.revalidateByPaths(paths)

    return { tags, paths }
  }

  /**
   * Cascade revalidation - when one tag changes, related tags should also be revalidated
   */
  static cascadeRevalidate(primaryTag: string) {
    const cascadeMap: Record<string, string[]> = {
      [CACHE_TAGS.ARTICLES]: [CACHE_TAGS.HOMEPAGE, CACHE_TAGS.FEATURED],
      [CACHE_TAGS.PROGRAMS]: [CACHE_TAGS.HOMEPAGE],
      [CACHE_TAGS.EPISODES]: [CACHE_TAGS.PROGRAMS],
      [CACHE_TAGS.AUTHORS]: [CACHE_TAGS.HOMEPAGE],
      [CACHE_TAGS.CATEGORIES]: [CACHE_TAGS.NAVIGATION, CACHE_TAGS.HOMEPAGE],
      [CACHE_TAGS.FEATURED]: [CACHE_TAGS.HOMEPAGE]
    }

    const cascadeTags = cascadeMap[primaryTag] || []
    
    // Revalidate primary tag
    this.revalidateByTags([primaryTag])
    
    // Revalidate cascade tags
    if (cascadeTags.length > 0) {
      console.log(`Cascading revalidation from ${primaryTag} to:`, cascadeTags)
      this.revalidateByTags(cascadeTags)
    }

    return cascadeTags
  }

  /**
   * Emergency cache clear - revalidate all major tags
   */
  static emergencyCacheClear() {
    const allTags = Object.values(CACHE_TAGS)
    const majorPaths = ['/', '/ar', '/ar/articles', '/ar/programs', '/sitemap.xml']
    
    console.log('Emergency cache clear initiated')
    this.revalidateByTags(allTags)
    this.revalidateByPaths(majorPaths)
    
    return { tags: allTags, paths: majorPaths }
  }

  /**
   * Get cache status information (for debugging)
   */
  static getCacheInfo() {
    return {
      strategies: Object.keys(CACHE_STRATEGIES),
      tags: Object.values(CACHE_TAGS),
      intervals: CACHE_INTERVALS
    }
  }
}

// Export convenience functions
export const getCacheStrategy = CacheManager.getStrategy
export const createCacheOptions = CacheManager.createCacheOptions
export const smartRevalidate = CacheManager.smartRevalidate
export const cascadeRevalidate = CacheManager.cascadeRevalidate
export const emergencyCacheClear = CacheManager.emergencyCacheClear