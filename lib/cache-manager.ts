/**
 * Advanced Cache Manager
 * Provides intelligent cache management with smart revalidation strategies
 */

import { revalidatePath, revalidateTag } from 'next/cache'

export interface CacheRevalidationResult {
  paths: string[]
  tags: string[]
  errors: string[]
  duration: number
}

export interface SmartRevalidationResult {
  paths: string[]
  tags: string[]
}

/**
 * Cache Manager Class
 */
export class CacheManager {
  // Content type to path mappings
  private static readonly CONTENT_PATHS = {
    post: {
      base: ['/ar', '/ar/articles'],
      detail: (slug: string) => `/ar/articles/${slug}`,
      related: ['/', '/ar/search']
    },
    program: {
      base: ['/ar', '/ar/programs'],
      detail: (slug: string) => `/ar/programs/${slug}`,
      related: ['/']
    },
    episode: {
      base: ['/ar/programs'],
      detail: (slug: string) => `/ar/episodes/${slug}`,
      related: ['/ar/programs']
    },
    user: {
      base: ['/ar/authors'],
      detail: (slug: string) => `/ar/authors/${slug}`,
      related: ['/ar']
    }
  }

  // Content type to tag mappings
  private static readonly CONTENT_TAGS = {
    post: (id?: string) => [
      'articles',
      'homepage',
      ...(id ? [`article:${id}`] : [])
    ],
    program: (id?: string) => [
      'programs',
      'homepage',
      ...(id ? [`program:${id}`] : [])
    ],
    episode: (id?: string) => [
      'episodes',
      'programs',
      ...(id ? [`episode:${id}`] : [])
    ],
    user: (id?: string) => [
      'authors',
      ...(id ? [`author:${id}`] : [])
    ]
  }

  /**
   * Smart revalidation based on content type and action
   */
  static smartRevalidate(
    contentType: keyof typeof CacheManager.CONTENT_PATHS,
    action: string,
    slug?: string,
    id?: string
  ): SmartRevalidationResult {
    const paths = new Set<string>()
    const tags = new Set<string>()

    const contentConfig = this.CONTENT_PATHS[contentType]
    const contentTags = this.CONTENT_TAGS[contentType]

    // Add base paths
    contentConfig.base.forEach(path => paths.add(path))

    // Add detail path if slug is provided
    if (slug) {
      paths.add(contentConfig.detail(slug))
    }

    // Add related paths based on action
    if (action === 'featured_toggle' || action === 'publish') {
      contentConfig.related.forEach(path => paths.add(path))
    }

    // Add content-specific tags
    contentTags(id).forEach(tag => tags.add(tag))

    // Add action-specific tags
    switch (action) {
      case 'featured_toggle':
        tags.add('featured-content')
        tags.add('homepage')
        break
      case 'delete':
        tags.add('content-deleted')
        break
      case 'publish':
        tags.add('new-content')
        break
    }

    return {
      paths: Array.from(paths),
      tags: Array.from(tags)
    }
  }

  /**
   * Cascade revalidation for related content
   */
  static cascadeRevalidate(primaryTag: string): string[] {
    const cascadedTags: string[] = []

    // Define cascade relationships
    const cascadeMap: Record<string, string[]> = {
      'articles': ['homepage', 'search', 'categories'],
      'programs': ['homepage', 'episodes'],
      'episodes': ['programs'],
      'authors': ['articles', 'programs'],
      'categories': ['articles', 'homepage'],
      'featured-content': ['homepage'],
      'breaking-news': ['homepage', 'notifications']
    }

    const relatedTags = cascadeMap[primaryTag] || []
    
    relatedTags.forEach(tag => {
      try {
        revalidateTag(tag)
        cascadedTags.push(tag)
      } catch (error) {
        console.error(`Failed to cascade revalidate tag ${tag}:`, error)
      }
    })

    return cascadedTags
  }

  /**
   * Emergency cache clear for critical situations
   */
  static emergencyCacheClear(): CacheRevalidationResult {
    const startTime = Date.now()
    const paths: string[] = []
    const tags: string[] = []
    const errors: string[] = []

    // Critical paths to clear
    const criticalPaths = [
      '/',
      '/ar',
      '/ar/articles',
      '/ar/programs',
      '/ar/authors'
    ]

    // Critical tags to clear
    const criticalTags = [
      'homepage',
      'articles',
      'programs',
      'episodes',
      'authors',
      'featured-content',
      'breaking-news',
      'navigation'
    ]

    // Clear critical paths
    criticalPaths.forEach(path => {
      try {
        revalidatePath(path)
        paths.push(path)
      } catch (error) {
        errors.push(`Failed to clear path ${path}: ${error}`)
      }
    })

    // Clear critical tags
    criticalTags.forEach(tag => {
      try {
        revalidateTag(tag)
        tags.push(tag)
      } catch (error) {
        errors.push(`Failed to clear tag ${tag}: ${error}`)
      }
    })

    return {
      paths,
      tags,
      errors,
      duration: Date.now() - startTime
    }
  }

  /**
   * Selective cache invalidation based on content relationships
   */
  static selectiveInvalidation(
    contentType: string,
    contentId: string,
    relationships: {
      authors?: string[]
      categories?: string[]
      programs?: string[]
      episodes?: string[]
    }
  ): CacheRevalidationResult {
    const startTime = Date.now()
    const paths: string[] = []
    const tags: string[] = []
    const errors: string[] = []

    try {
      // Invalidate related author content
      if (relationships.authors) {
        relationships.authors.forEach(authorId => {
          try {
            revalidateTag(`author:${authorId}`)
            revalidateTag(`author-content:${authorId}`)
            tags.push(`author:${authorId}`, `author-content:${authorId}`)
          } catch (error) {
            errors.push(`Failed to invalidate author ${authorId}: ${error}`)
          }
        })
      }

      // Invalidate related category content
      if (relationships.categories) {
        relationships.categories.forEach(categoryId => {
          try {
            revalidateTag(`category:${categoryId}`)
            tags.push(`category:${categoryId}`)
          } catch (error) {
            errors.push(`Failed to invalidate category ${categoryId}: ${error}`)
          }
        })
      }

      // Invalidate related program content
      if (relationships.programs) {
        relationships.programs.forEach(programId => {
          try {
            revalidateTag(`program:${programId}`)
            revalidateTag(`program-episodes:${programId}`)
            tags.push(`program:${programId}`, `program-episodes:${programId}`)
          } catch (error) {
            errors.push(`Failed to invalidate program ${programId}: ${error}`)
          }
        })
      }

      // Invalidate related episode content
      if (relationships.episodes) {
        relationships.episodes.forEach(episodeId => {
          try {
            revalidateTag(`episode:${episodeId}`)
            tags.push(`episode:${episodeId}`)
          } catch (error) {
            errors.push(`Failed to invalidate episode ${episodeId}: ${error}`)
          }
        })
      }

    } catch (error) {
      errors.push(`Selective invalidation failed: ${error}`)
    }

    return {
      paths,
      tags,
      errors,
      duration: Date.now() - startTime
    }
  }

  /**
   * Batch revalidation with priority handling
   */
  static async batchRevalidate(
    operations: Array<{
      type: 'path' | 'tag'
      value: string
      priority: 'high' | 'normal' | 'low'
    }>
  ): Promise<CacheRevalidationResult> {
    const startTime = Date.now()
    const paths: string[] = []
    const tags: string[] = []
    const errors: string[] = []

    // Sort by priority
    const sortedOps = operations.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

    // Process operations
    for (const op of sortedOps) {
      try {
        if (op.type === 'path') {
          revalidatePath(op.value)
          paths.push(op.value)
        } else {
          revalidateTag(op.value)
          tags.push(op.value)
        }
      } catch (error) {
        errors.push(`Failed to revalidate ${op.type} ${op.value}: ${error}`)
      }
    }

    return {
      paths,
      tags,
      errors,
      duration: Date.now() - startTime
    }
  }

  /**
   * Get cache health status
   */
  static getCacheHealth(): {
    status: 'healthy' | 'degraded' | 'critical'
    metrics: {
      lastRevalidation: string
      totalOperations: number
      errorRate: number
    }
  } {
    // This would typically connect to your monitoring system
    // For now, return a basic health check
    return {
      status: 'healthy',
      metrics: {
        lastRevalidation: new Date().toISOString(),
        totalOperations: 0,
        errorRate: 0
      }
    }
  }

  /**
   * Preemptive cache warming for critical content
   */
  static async warmCriticalCache(): Promise<{
    warmed: string[]
    errors: string[]
  }> {
    const warmed: string[] = []
    const errors: string[] = []

    const criticalPaths = [
      '/',
      '/ar',
      '/ar/articles',
      '/ar/programs'
    ]

    // In a real implementation, you would make requests to these paths
    // to warm the cache. For now, we'll just simulate it.
    criticalPaths.forEach(path => {
      try {
        // Simulate cache warming
        warmed.push(path)
      } catch (error) {
        errors.push(`Failed to warm cache for ${path}: ${error}`)
      }
    })

    return { warmed, errors }
  }
}