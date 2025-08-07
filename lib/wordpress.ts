/**
 * WordPress REST API Client for Zawaya Platform
 * Handles authentication, caching, and data fetching from headless WordPress
 * Enhanced for WordPress-only architecture with proper error handling and caching
 */

import { z } from 'zod'
import { CacheManager, getCacheStrategy, type CacheStrategy } from './cache-manager'

// WordPress API Configuration
const WP_API_BASE = process.env.WP_API_BASE || (process.env.NEXT_PUBLIC_WP_URL ? process.env.NEXT_PUBLIC_WP_URL + '/wp-json/wp/v2' : 'https://wordpress-1401009-5702602.cloudwaysapps.com/wp-json/wp/v2')
const WP_USERNAME = process.env.WP_USERNAME || 'Zawayawp'
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || 'lDLhSBco7QgR3IDuOZQzoY6k'

// Cache for REST base names to avoid repeated API calls
const REST_BASE_CACHE = new Map<string, string>()

// Default REST base mappings (fallback)
const DEFAULT_REST_BASES = {
  posts: 'posts',
  programs: 'programs',
  episodes: 'episodes',
} as const

// Validate required environment variables
if (!WP_USERNAME || !WP_APP_PASSWORD) {
  console.warn('WordPress credentials not properly configured. Some features may not work.')
}

// Create Basic Auth header for Application Passwords
const authHeader = `Basic ${Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64')}`

// Cache configuration
interface CacheOptions {
  revalidate?: number
  tags?: string[]
}

// Retry configuration
interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

// Error types for better error handling
export enum WordPressErrorType {
  NETWORK_ERROR = 'network_error',
  AUTH_ERROR = 'auth_error', 
  NOT_FOUND = 'not_found',
  SERVER_ERROR = 'server_error',
  TIMEOUT_ERROR = 'timeout_error',
  RATE_LIMIT = 'rate_limit',
  VALIDATION_ERROR = 'validation_error'
}

export class WordPressError extends Error {
  constructor(
    message: string,
    public type: WordPressErrorType,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'WordPressError'
  }
}

// Default retry configuration
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2
}

// Legacy cache strategies - use CacheManager instead
// @deprecated - Use getCacheStrategy() from cache-manager.ts
const LEGACY_CACHE_STRATEGIES = {
  articles: getCacheStrategy('articles'),
  programs: getCacheStrategy('programs'), 
  static: getCacheStrategy('static'),
  homepage: getCacheStrategy('homepage'),
  search: getCacheStrategy('search'),
  featured: getCacheStrategy('featured')
}

// Import transformation utilities
import { 
  transformWordPressPost, 
  transformWordPressPosts, 
  createFallbackPost,
  type NormalizedWPPost 
} from './wordpress-transformers'

// WordPress Post Schema (with SCF fields via meta or zawaya_meta)
export const WPPostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  status: z.enum(['publish', 'draft', 'private', 'pending']),
  title: z.object({
    rendered: z.string()
  }),
  content: z.object({
    rendered: z.string()
  }),
  excerpt: z.object({
    rendered: z.string()
  }),
  author: z.number(),
  featured_media: z.number(),
  date: z.string(),
  modified: z.string(),
  categories: z.array(z.number()),
  tags: z.array(z.number()),
  // SCF fields in meta object
  meta: z.record(z.any()).optional(),
  // SCF fields exposed via zawaya-scf-rest plugin (preferred)
  zawaya_meta: z.record(z.any()).optional(),
  // Embedded data (when using ?_embed)
  _embedded: z.object({
    author: z.array(z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      avatar_urls: z.record(z.string()).optional(),
      link: z.string().optional()
    })).optional(),
    'wp:featuredmedia': z.array(z.object({
      id: z.number(),
      source_url: z.string(),
      alt_text: z.string().optional()
    })).optional(),
    'wp:term': z.array(z.array(z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      link: z.string().optional()
    }))).optional()
  }).optional()
})

export type WPPost = z.infer<typeof WPPostSchema>

// WordPress API Response Schema
export const WPPostsResponseSchema = z.array(WPPostSchema)
export type WPPostsResponse = z.infer<typeof WPPostsResponseSchema>

// Export normalized types
export type { NormalizedWPPost }

// WordPress API Client Class
export class WordPressClient {
  private baseUrl: string
  private authHeader: string

  constructor() {
    this.baseUrl = WP_API_BASE
    this.authHeader = authHeader
    console.log('WordPress client initialized with URL:', this.baseUrl)
  }

  /**
   * Get the REST base for a content type by querying WordPress /types endpoint
   * Caches results to avoid repeated API calls
   */
  private async getRestBase(contentType: string): Promise<string> {
    // Check cache first
    if (REST_BASE_CACHE.has(contentType)) {
      return REST_BASE_CACHE.get(contentType)!
    }

    // Use default if available
    if (contentType in DEFAULT_REST_BASES) {
      const defaultBase = DEFAULT_REST_BASES[contentType as keyof typeof DEFAULT_REST_BASES]
      REST_BASE_CACHE.set(contentType, defaultBase)
      return defaultBase
    }

    try {
      // Query WordPress types endpoint to get rest_base
      const typeInfo = await this.wpGet<{
        name: string
        slug: string
        rest_base: string
        rest_controller_class: string
      }>(`/types/${contentType}`, {}, 'static')

      const restBase = typeInfo.rest_base || contentType
      
      // Cache the result
      REST_BASE_CACHE.set(contentType, restBase)
      
      console.log(`Cached REST base for ${contentType}: ${restBase}`)
      return restBase
      
    } catch (error) {
      console.warn(`Failed to get REST base for ${contentType}, using content type as fallback:`, error)
      
      // Fallback to content type name
      REST_BASE_CACHE.set(contentType, contentType)
      return contentType
    }
  }

  /**
   * Exponential backoff retry utility
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    options: RetryOptions = DEFAULT_RETRY_OPTIONS
  ): Promise<T> {
    const { maxRetries, baseDelay, maxDelay, backoffMultiplier } = {
      ...DEFAULT_RETRY_OPTIONS,
      ...options
    }

    let lastError: Error
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        // Only retry on server errors (≥500) - don't retry on client errors (4xx)
        if (error instanceof WordPressError) {
          if (error.statusCode && error.statusCode < 500) {
            // Client errors (4xx) should not be retried
            throw error
          }
          
          // Don't retry on specific error types regardless of status code
          if (error.type === WordPressErrorType.AUTH_ERROR || 
              error.type === WordPressErrorType.NOT_FOUND ||
              error.type === WordPressErrorType.VALIDATION_ERROR) {
            throw error
          }
        }

        // If this was the last attempt, throw the error
        if (attempt === maxRetries) {
          break
        }

        // Calculate delay with exponential backoff (only for server errors ≥500)
        const delay = Math.min(
          baseDelay * Math.pow(backoffMultiplier, attempt),
          maxDelay
        )

        console.log(`WordPress server error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`)
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }

  /**
   * Enhanced error classification
   */
  private classifyError(error: any, response?: Response): WordPressError {
    // Network/connection errors
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return new WordPressError(
        'WordPress request timed out',
        WordPressErrorType.TIMEOUT_ERROR,
        undefined,
        error
      )
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return new WordPressError(
        'WordPress server unreachable',
        WordPressErrorType.NETWORK_ERROR,
        undefined,
        error
      )
    }

    // HTTP response errors
    if (response) {
      switch (response.status) {
        case 401:
          return new WordPressError(
            'WordPress authentication failed. Check Application Password.',
            WordPressErrorType.AUTH_ERROR,
            401,
            error
          )
        case 404:
          return new WordPressError(
            'WordPress endpoint not found',
            WordPressErrorType.NOT_FOUND,
            404,
            error
          )
        case 429:
          return new WordPressError(
            'WordPress rate limit exceeded',
            WordPressErrorType.RATE_LIMIT,
            429,
            error
          )
        case 500:
        case 502:
        case 503:
        case 504:
        case 505:
        case 507:
        case 508:
        case 510:
        case 511:
          return new WordPressError(
            `WordPress server error (${response.status}). Please try again later.`,
            WordPressErrorType.SERVER_ERROR,
            response.status,
            error
          )
        default:
          return new WordPressError(
            `WordPress API error: ${response.status} ${response.statusText}`,
            WordPressErrorType.SERVER_ERROR,
            response.status,
            error
          )
      }
    }

    // Generic error
    return new WordPressError(
      error.message || 'Unknown WordPress error',
      WordPressErrorType.NETWORK_ERROR,
      undefined,
      error
    )
  }

  /**
   * Core WordPress GET method with Application Password authentication
   * Implements proper caching, error handling, and retry logic with exponential backoff
   */
  async wpGet<T>(
    path: string, 
    params: Record<string, any> = {}, 
    cacheStrategy: CacheStrategy | CacheOptions = 'articles',
    retryOptions?: RetryOptions
  ): Promise<T> {
    return this.retryWithBackoff(async () => {
      // Resolve dynamic REST base for custom post types
      const pathParts = path.split('/')
      if (pathParts.length > 1 && pathParts[1]) {
        const contentType = pathParts[1] // Get the resource part (e.g., 'programs' from '/programs')
        
        // Skip REST base resolution for built-in WordPress endpoints
        if (!['types', 'users', 'media', 'comments', 'taxonomies', 'statuses'].includes(contentType)) {
          const restBase = await this.getRestBase(contentType)
          if (restBase !== contentType) {
            pathParts[1] = restBase
            path = pathParts.join('/')
          }
        }
      }
      
      // Build URL with parameters
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            searchParams.set(key, value.join(','))
          } else {
            searchParams.set(key, value.toString())
          }
        }
      })

      const url = `${this.baseUrl}${path}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
      
      // Resolve cache options
      const cacheOptions = typeof cacheStrategy === 'string' 
        ? getCacheStrategy(cacheStrategy)
        : cacheStrategy
      
      const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Next.js caching configuration with enhanced cache management
        next: {
          revalidate: cacheOptions.revalidate,
          tags: cacheOptions.tags
        },
        // Timeout to prevent hanging requests
        signal: AbortSignal.timeout(15000) // 15 second timeout
      }

      let response: Response
      try {
        response = await fetch(url, fetchOptions)
      } catch (error: any) {
        throw this.classifyError(error)
      }
      
      if (!response.ok) {
        // Handle 404 as non-fatal for list endpoints - return empty arrays
        if (response.status === 404) {
          console.log(`WordPress endpoint not found (404): ${url}, returning empty data`)
          return this.getFallbackData<T>(path)
        }
        throw this.classifyError(new Error(`HTTP ${response.status}`), response)
      }

      try {
        const data = await response.json()
        return data as T
      } catch (error: any) {
        throw new WordPressError(
          'Failed to parse WordPress response as JSON',
          WordPressErrorType.VALIDATION_ERROR,
          response.status,
          error
        )
      }
    }, retryOptions).catch((error: WordPressError) => {
      // Provide graceful fallbacks for different error types
      console.error('WordPress API request failed after retries:', error.message)
      
      switch (error.type) {
        case WordPressErrorType.TIMEOUT_ERROR:
        case WordPressErrorType.NETWORK_ERROR:
        case WordPressErrorType.SERVER_ERROR:
          console.log('Using fallback data due to WordPress connectivity issues')
          // Return appropriate fallback based on endpoint type
          return this.getFallbackData<T>(path)
          
        case WordPressErrorType.NOT_FOUND:
          console.log('WordPress endpoint not found, returning empty data')
          return this.getFallbackData<T>(path)
          
        case WordPressErrorType.AUTH_ERROR:
          console.error('WordPress authentication failed - check credentials')
          throw error // Don't provide fallback for auth errors
          
        default:
          // For other errors, provide fallback
          return this.getFallbackData<T>(path)
      }
    })
  }

  /**
   * Provide appropriate fallback data based on endpoint type
   */
  private getFallbackData<T>(path: string): T {
    // For list endpoints (programs, episodes, posts), return empty array
    if (path.includes('program') || path.includes('episode') || path.includes('posts') || 
        path.match(/^\/[^\/]+$/) || // Root level endpoints like /posts
        path.includes('search')) {
      return [] as unknown as T
    }
    
    // For single item endpoints, return null
    return null as unknown as T
  }

  /**
   * Legacy fetchWP method for backward compatibility
   * @deprecated Use wpGet instead
   */
  private async fetchWP<T>(
    endpoint: string, 
    _options: RequestInit = {},
    cacheTag?: string
  ): Promise<T> {
    const cacheOptions: CacheOptions = cacheTag ? { tags: [cacheTag] } : getCacheStrategy('articles')
    return this.wpGet<T>(endpoint, {}, cacheOptions)
  }

  /**
   * Generic list content method for posts, programs, episodes, etc.
   * Uses improved wpGet method with proper caching and SCF transformation
   */
  async listContent<T = NormalizedWPPost>(
    contentType: string,
    params: {
      per_page?: number
      page?: number
      status?: 'publish' | 'draft' | 'private'
      categories?: number[]
      tags?: number[]
      author?: number
      search?: string
      orderby?: 'date' | 'title' | 'menu_order'
      order?: 'asc' | 'desc'
      _embed?: boolean
      [key: string]: any // Allow additional custom parameters
    } = {},
    cacheStrategy: CacheStrategy = 'articles'
  ): Promise<T[]> {
    // Prepare parameters with defaults
    const queryParams = {
      per_page: params.per_page || 10,
      page: params.page || 1,
      status: params.status || 'publish',
      orderby: params.orderby || 'date',
      order: params.order || 'desc',
      _embed: params._embed !== false ? 'true' : undefined,
      categories: params.categories,
      tags: params.tags,
      author: params.author,
      search: params.search,
      ...Object.fromEntries(
        Object.entries(params).filter(([key]) => 
          !['per_page', 'page', 'status', 'orderby', 'order', '_embed', 'categories', 'tags', 'author', 'search'].includes(key)
        )
      )
    }

    // Use appropriate cache strategy based on content type
    const strategy: CacheStrategy = params.search ? 'search' : cacheStrategy

    try {
      // Get the correct REST base for this content type
      const restBase = await this.getRestBase(contentType)
      const data = await this.wpGet<WPPostsResponse>(`/${restBase}`, queryParams, strategy)
      
      // Validate WordPress response
      const validatedData = WPPostsResponseSchema.parse(data)
      
      // Transform to normalized format
      const normalizedContent = transformWordPressPosts(validatedData)
      
      return normalizedContent as T[]
    } catch (error) {
      console.error(`WordPress ${contentType} fetch/transform failed:`, error)
      
      // Return empty array for failed requests
      return []
    }
  }

  /**
   * List posts with filtering and pagination
   * Uses improved wpGet method with proper caching and SCF transformation
   */
  async listPosts(params: {
    per_page?: number
    page?: number
    status?: 'publish' | 'draft' | 'private'
    categories?: number[]
    tags?: number[]
    author?: number
    search?: string
    orderby?: 'date' | 'title' | 'menu_order'
    order?: 'asc' | 'desc'
    _embed?: boolean
  } = {}): Promise<NormalizedWPPost[]> {
    return this.listContent('posts', params, 'articles')
  }

  /**
   * Get single post by ID
   */
  async getPostById(id: number, embed = true): Promise<NormalizedWPPost | null> {
    const queryParams = embed ? { _embed: 'true' } : {}
    
    try {
      const data = await this.wpGet<WPPost>(`/posts/${id}`, queryParams, 'articles')
      const validatedData = WPPostSchema.parse(data)
      return transformWordPressPost(validatedData)
    } catch (error) {
      console.error(`Failed to get post by ID ${id}:`, error)
      return null
    }
  }

  /**
   * Get single post by slug
   */
  async getPostBySlug(slug: string, embed = true): Promise<NormalizedWPPost | null> {
    const queryParams = {
      slug,
      status: 'publish',
      _embed: embed ? 'true' : undefined
    }

    try {
      const data = await this.wpGet<WPPostsResponse>('/posts', queryParams, 'articles')
      const posts = WPPostsResponseSchema.parse(data)
      
      if (posts.length > 0) {
        return transformWordPressPost(posts[0])
      }
      
      return null
    } catch (error) {
      console.error(`Failed to get post by slug ${slug}:`, error)
      return null
    }
  }

  /**
   * Get featured posts (using SCF is_featured field)
   */
  async getFeaturedPosts(limit = 5): Promise<NormalizedWPPost[]> {
    try {
      // Try to get more posts to filter for featured ones
      const posts = await this.wpGet<WPPostsResponse>('/posts', {
        per_page: limit * 3, // Get more to ensure we have enough featured posts
        status: 'publish',
        _embed: 'true'
      }, 'featured')
      
      // Validate data first
      const validatedPosts = WPPostsResponseSchema.parse(posts)
      
      // Transform to normalized format
      const normalizedPosts = transformWordPressPosts(validatedPosts)
      
      // Filter posts with is_featured = true from SCF fields
      const featuredPosts = normalizedPosts.filter(post => 
        post.zawaya_meta.is_featured === true
      )
      
      return featuredPosts.slice(0, limit)
    } catch (error) {
      console.error('Failed to get featured posts:', error)
      return [createFallbackPost('مقال مميز', 'محتوى مميز قيد التحميل')]
    }
  }

  /**
   * Search posts with Arabic text support
   */
  async searchPosts(query: string, limit = 10): Promise<NormalizedWPPost[]> {
    if (!query.trim()) {
      return []
    }

    try {
      return await this.listPosts({
        search: query,
        per_page: limit,
        _embed: true
      })
    } catch (error) {
      console.error(`Failed to search posts for query "${query}":`, error)
      return []
    }
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(categoryId: number, limit = 10): Promise<NormalizedWPPost[]> {
    try {
      return await this.listPosts({
        categories: [categoryId],
        per_page: limit,
        _embed: true
      })
    } catch (error) {
      console.error(`Failed to get posts by category ${categoryId}:`, error)
      return []
    }
  }

  /**
   * Get posts by author
   */
  async getPostsByAuthor(authorId: number, limit = 10): Promise<NormalizedWPPost[]> {
    try {
      return await this.listPosts({
        author: authorId,
        per_page: limit,
        _embed: true
      })
    } catch (error) {
      console.error(`Failed to get posts by author ${authorId}:`, error)
      return []
    }
  }

  /**
   * List programs with filtering and pagination
   * Uses generic listContent method
   */
  async listPrograms(params: {
    per_page?: number
    page?: number
    status?: 'publish' | 'draft' | 'private'
    program_type?: string
    search?: string
    orderby?: 'date' | 'title' | 'menu_order'
    order?: 'asc' | 'desc'
    _embed?: boolean
  } = {}): Promise<NormalizedWPPost[]> {
    return this.listContent('programs', params, 'programs')
  }

  /**
   * List episodes with filtering and pagination
   * Uses generic listContent method
   */
  async listEpisodes(params: {
    per_page?: number
    page?: number
    status?: 'publish' | 'draft' | 'private'
    program_id?: number
    season_number?: number
    search?: string
    orderby?: 'date' | 'title' | 'episode_number'
    order?: 'asc' | 'desc'
    _embed?: boolean
  } = {}): Promise<NormalizedWPPost[]> {
    return this.listContent('episodes', params, 'programs')
  }

  /**
   * Create new post (for admin use)
   * Note: Requires proper WordPress user permissions
   */
  async createPost(postData: {
    title: string
    content: string
    excerpt?: string
    status?: 'publish' | 'draft'
    categories?: number[]
    tags?: number[]
    featured_media?: number
    acf?: Record<string, any>
  }): Promise<WPPost | null> {
    try {
      const url = `${this.baseUrl}/posts`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return WPPostSchema.parse(data)
    } catch (error) {
      console.error('Failed to create WordPress post:', error)
      return null
    }
  }

  /**
   * Update existing post (for admin use)
   * Note: Requires proper WordPress user permissions
   */
  async updatePost(id: number, postData: Partial<WPPost>): Promise<WPPost | null> {
    try {
      const url = `${this.baseUrl}/posts/${id}`
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return WPPostSchema.parse(data)
    } catch (error) {
      console.error(`Failed to update WordPress post ${id}:`, error)
      return null
    }
  }

  /**
   * Clear the REST base cache (useful for testing or when WordPress configuration changes)
   */
  clearRestBaseCache(): void {
    REST_BASE_CACHE.clear()
    console.log('REST base cache cleared')
  }

  /**
   * Get cached REST bases (for debugging)
   */
  getCachedRestBases(): Record<string, string> {
    return Object.fromEntries(REST_BASE_CACHE.entries())
  }

  /**
   * Test WordPress connection and authentication
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.wpGet('/posts', { per_page: 1 }, 'static')
      console.log('WordPress connection test successful')
      return true
    } catch (error) {
      console.error('WordPress connection test failed:', error)
      return false
    }
  }

  /**
   * Get WordPress site information
   */
  async getSiteInfo(): Promise<any> {
    try {
      // Remove /wp/v2 from base URL to get site info
      const siteUrl = this.baseUrl.replace('/wp-json/wp/v2', '')
      const response = await fetch(`${siteUrl}/wp-json/`, {
        headers: {
          'Authorization': this.authHeader
        }
      })
      return await response.json()
    } catch (error) {
      console.error('Failed to get WordPress site info:', error)
      return null
    }
  }

  /**
   * Trigger cache revalidation via WordPress webhook
   * This works with your WordPress revalidate script
   */
  async triggerRevalidation(paths: string[] = ['/'], tags: string[] = []): Promise<boolean> {
    try {
      const revalidateUrl = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`
        : '/api/revalidate'
      
      const response = await fetch(revalidateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          secret: process.env.REVALIDATION_SECRET,
          paths,
          tags
        })
      })

      if (response.ok) {
        console.log('Cache revalidation triggered successfully')
        return true
      } else {
        console.error('Cache revalidation failed:', response.statusText)
        return false
      }
    } catch (error) {
      console.error('Failed to trigger cache revalidation:', error)
      return false
    }
  }

  /**
   * Health check with detailed error reporting
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    details: {
      connection: boolean
      authentication: boolean
      responseTime: number
      lastError?: string
    }
  }> {
    const startTime = Date.now()
    
    try {
      // Test basic connection
      await this.wpGet('/posts', { per_page: 1 }, 'static', { maxRetries: 1 })
      
      const responseTime = Date.now() - startTime
      
      return {
        status: responseTime < 2000 ? 'healthy' : 'degraded',
        details: {
          connection: true,
          authentication: true,
          responseTime
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      if (error instanceof WordPressError) {
        return {
          status: 'unhealthy',
          details: {
            connection: error.type !== WordPressErrorType.NETWORK_ERROR,
            authentication: error.type !== WordPressErrorType.AUTH_ERROR,
            responseTime,
            lastError: error.message
          }
        }
      }
      
      return {
        status: 'unhealthy',
        details: {
          connection: false,
          authentication: false,
          responseTime,
          lastError: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }

  /**
   * Get error statistics (for monitoring)
   */
  getErrorStats(): {
    totalRequests: number
    errorCount: number
    errorRate: number
    lastError?: WordPressError
  } {
    // This would be implemented with actual tracking in a production system
    // For now, return placeholder data
    return {
      totalRequests: 0,
      errorCount: 0,
      errorRate: 0
    }
  }
}

// Export singleton instance
export const wpClient = new WordPressClient()

// Convenience functions with proper typing
export const wpListPosts = (params?: Parameters<typeof wpClient.listPosts>[0]): Promise<NormalizedWPPost[]> => 
  wpClient.listPosts(params)

export const wpListPrograms = (params?: Parameters<typeof wpClient.listPrograms>[0]): Promise<NormalizedWPPost[]> => 
  wpClient.listPrograms(params)

export const wpListEpisodes = (params?: Parameters<typeof wpClient.listEpisodes>[0]): Promise<NormalizedWPPost[]> => 
  wpClient.listEpisodes(params)

export const wpListContent = <T = NormalizedWPPost>(
  contentType: string,
  params?: Parameters<typeof wpClient.listContent>[1],
  cacheStrategy?: Parameters<typeof wpClient.listContent>[2]
): Promise<T[]> => 
  wpClient.listContent<T>(contentType, params, cacheStrategy)

export const wpGetPostBySlug = (slug: string, embed?: boolean): Promise<NormalizedWPPost | null> => 
  wpClient.getPostBySlug(slug, embed)

export const wpGetPostById = (id: number, embed?: boolean): Promise<NormalizedWPPost | null> => 
  wpClient.getPostById(id, embed)

export const wpGetFeaturedPosts = (limit?: number): Promise<NormalizedWPPost[]> => 
  wpClient.getFeaturedPosts(limit)

export const wpSearchPosts = (query: string, limit?: number): Promise<NormalizedWPPost[]> => 
  wpClient.searchPosts(query, limit)

export const wpTestConnection = (): Promise<boolean> => 
  wpClient.testConnection()

export const wpClearRestBaseCache = (): void => 
  wpClient.clearRestBaseCache()

export const wpGetCachedRestBases = (): Record<string, string> => 
  wpClient.getCachedRestBases()

// Add missing wpGet export
export const wpGet = <T>(
  path: string, 
  params: Record<string, any> = {}, 
  cacheStrategy: CacheStrategy | CacheOptions = 'articles',
  retryOptions?: RetryOptions
): Promise<T> => 
  wpClient.wpGet<T>(path, params, cacheStrategy, retryOptions)