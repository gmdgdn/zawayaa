/**
 * WordPress REST API Client Extensions
 * Generic wpFetch function and content fetchers for programs, episodes, and Taqdeer content
 */

// WordPress API Configuration
const WP_API_BASE = process.env.WP_API_BASE || 'https://wordpress-1401009-5702602.cloudwaysapps.com/wp-json/wp/v2'
const WP_USERNAME = process.env.WP_USERNAME || 'e.elrefae@dbrandria.com'
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || 'nja8QODKRKpOkVX5ELhe934a'

// Create Basic Auth header for Application Passwords
const authHeader = `Basic ${Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64')}`

// Custom WordPress Error class
export class WordPressError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message)
    this.name = 'WordPressError'
  }
}

// Retry configuration interface
interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

// Default retry configuration
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2
}

/**
 * Exponential backoff retry utility
 */
async function retryWithBackoff<T>(
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
 * Generic WordPress fetch function with proper error handling and ISR caching
 * @param endpoint - WordPress REST API endpoint (e.g., '/posts', '/programs/123')
 * @param queryString - Query parameters as string (e.g., '?_embed=true&per_page=10')
 * @returns Promise with typed response data
 */
export async function wpFetch<T>(
  endpoint: string,
  queryString: string = ''
): Promise<T> {
  return retryWithBackoff(async () => {
    // Build full URL
    const url = `${WP_API_BASE}${endpoint}${queryString}`
    
    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Next.js ISR caching configuration
      next: {
        revalidate: 60 // 60 seconds cache
      },
      // Timeout to prevent hanging requests
      signal: AbortSignal.timeout(15000) // 15 second timeout
    }

    let response: Response
    try {
      response = await fetch(url, fetchOptions)
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        throw new WordPressError(
          'WordPress request timed out',
          undefined,
          endpoint
        )
      }
      
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new WordPressError(
          'WordPress server unreachable',
          undefined,
          endpoint
        )
      }
      
      throw new WordPressError(
        `Network error: ${error.message}`,
        undefined,
        endpoint
      )
    }
    
    // Handle HTTP status errors
    if (!response.ok) {
      let errorMessage: string
      
      switch (response.status) {
        case 401:
          errorMessage = 'WordPress authentication failed. Check Application Password.'
          break
        case 404:
          errorMessage = 'WordPress endpoint not found'
          break
        case 429:
          errorMessage = 'WordPress rate limit exceeded'
          break
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = `WordPress server error (${response.status}). Please try again later.`
          break
        default:
          errorMessage = `WordPress API error: ${response.status} ${response.statusText}`
      }
      
      throw new WordPressError(errorMessage, response.status, endpoint)
    }

    // Parse JSON response
    try {
      const data = await response.json()
      return data as T
    } catch (error: any) {
      throw new WordPressError(
        'Failed to parse WordPress response as JSON',
        response.status,
        endpoint
      )
    }
  })
}
// WordPress data interfaces
export interface WPProgram {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  meta: Record<string, any>
  featured_media: number
  date: string
  modified: string
  _embedded?: {
    author?: Array<{
      id: number
      name: string
      slug: string
      avatar_urls?: Record<string, string>
    }>
    'wp:featuredmedia'?: Array<{
      id: number
      source_url: string
      alt_text?: string
    }>
  }
}

export interface WPEpisode {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  meta: Record<string, any>
  parent: number // Program ID
  featured_media: number
  date: string
  modified: string
  _embedded?: {
    author?: Array<{
      id: number
      name: string
      slug: string
      avatar_urls?: Record<string, string>
    }>
    'wp:featuredmedia'?: Array<{
      id: number
      source_url: string
      alt_text?: string
    }>
  }
}

export interface WPTaqdeer {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  meta: Record<string, any>
  featured_media: number
  date: string
  modified: string
  _embedded?: {
    author?: Array<{
      id: number
      name: string
      slug: string
      avatar_urls?: Record<string, string>
    }>
    'wp:featuredmedia'?: Array<{
      id: number
      source_url: string
      alt_text?: string
    }>
  }
}

/**
 * Get all programs with _embed and _fields parameters
 * @param params - Optional query parameters
 * @returns Promise with array of program data
 */
export async function getPrograms(params: {
  per_page?: number
  page?: number
  status?: 'publish' | 'draft' | 'private'
  search?: string
  orderby?: 'date' | 'title' | 'menu_order'
  order?: 'asc' | 'desc'
} = {}): Promise<WPProgram[]> {
  const queryParams = new URLSearchParams({
    _embed: 'true',
    _fields: 'id,slug,title,content,excerpt,meta,featured_media,date,modified,_embedded',
    per_page: (params.per_page || 10).toString(),
    page: (params.page || 1).toString(),
    status: params.status || 'publish',
    orderby: params.orderby || 'date',
    order: params.order || 'desc'
  })

  if (params.search) {
    queryParams.set('search', params.search)
  }

  return wpFetch<WPProgram[]>('/programs', `?${queryParams.toString()}`)
}

/**
 * Get single program by slug
 * @param slug - Program slug
 * @returns Promise with program data or null if not found
 */
export async function getProgram(slug: string): Promise<WPProgram | null> {
  const queryParams = new URLSearchParams({
    slug,
    _embed: 'true',
    _fields: 'id,slug,title,content,excerpt,meta,featured_media,date,modified,_embedded'
  })

  try {
    const programs = await wpFetch<WPProgram[]>('/programs', `?${queryParams.toString()}`)
    return programs.length > 0 ? programs[0] : null
  } catch (error) {
    if (error instanceof WordPressError && error.statusCode === 404) {
      return null
    }
    throw error
  }
}

/**
 * Get episodes by program ID
 * @param parentId - Program ID
 * @param params - Optional query parameters
 * @returns Promise with array of episode data
 */
export async function getEpisodesByProgram(parentId: number, params: {
  per_page?: number
  page?: number
  status?: 'publish' | 'draft' | 'private'
  orderby?: 'date' | 'title' | 'episode_number'
  order?: 'asc' | 'desc'
} = {}): Promise<WPEpisode[]> {
  const queryParams = new URLSearchParams({
    parent: parentId.toString(),
    _embed: 'true',
    _fields: 'id,slug,title,content,excerpt,meta,parent,featured_media,date,modified,_embedded',
    per_page: (params.per_page || 10).toString(),
    page: (params.page || 1).toString(),
    status: params.status || 'publish',
    orderby: params.orderby || 'date',
    order: params.order || 'desc'
  })

  return wpFetch<WPEpisode[]>('/episodes', `?${queryParams.toString()}`)
}

/**
 * Get single episode by slug
 * @param slug - Episode slug
 * @returns Promise with episode data or null if not found
 */
export async function getEpisode(slug: string): Promise<WPEpisode | null> {
  const queryParams = new URLSearchParams({
    slug,
    _embed: 'true',
    _fields: 'id,slug,title,content,excerpt,meta,parent,featured_media,date,modified,_embedded'
  })

  try {
    const episodes = await wpFetch<WPEpisode[]>('/episodes', `?${queryParams.toString()}`)
    return episodes.length > 0 ? episodes[0] : null
  } catch (error) {
    if (error instanceof WordPressError && error.statusCode === 404) {
      return null
    }
    throw error
  }
}

/**
 * Get single Taqdeer assessment by slug
 * @param slug - Taqdeer slug
 * @returns Promise with Taqdeer data or null if not found
 */
export async function getTaqdeer(slug: string): Promise<WPTaqdeer | null> {
  const queryParams = new URLSearchParams({
    slug,
    _embed: 'true',
    _fields: 'id,slug,title,content,excerpt,meta,featured_media,date,modified,_embedded'
  })

  try {
    const taqdeerItems = await wpFetch<WPTaqdeer[]>('/taqdeer_mawqef', `?${queryParams.toString()}`)
    return taqdeerItems.length > 0 ? taqdeerItems[0] : null
  } catch (error) {
    if (error instanceof WordPressError && error.statusCode === 404) {
      return null
    }
    throw error
  }
}

/**
 * Build query string with proper URL encoding and parameter validation
 * @param params - Object with query parameters
 * @returns Encoded query string
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Handle arrays by joining with commas
        searchParams.set(key, value.join(','))
      } else {
        searchParams.set(key, value.toString())
      }
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Get all programs with advanced filtering and pagination
 * @param params - Extended query parameters
 * @returns Promise with array of program data
 */
export async function getProgramsAdvanced(params: {
  per_page?: number
  page?: number
  status?: 'publish' | 'draft' | 'private'
  search?: string
  orderby?: 'date' | 'title' | 'menu_order'
  order?: 'asc' | 'desc'
  program_type?: string
  host?: string
  include?: number[]
  exclude?: number[]
  before?: string
  after?: string
} = {}): Promise<WPProgram[]> {
  const queryParams = {
    _embed: 'true',
    _fields: 'id,slug,title,content,excerpt,meta,featured_media,date,modified,_embedded',
    per_page: params.per_page || 10,
    page: params.page || 1,
    status: params.status || 'publish',
    orderby: params.orderby || 'date',
    order: params.order || 'desc',
    search: params.search,
    program_type: params.program_type,
    host: params.host,
    include: params.include,
    exclude: params.exclude,
    before: params.before,
    after: params.after
  }

  return wpFetch<WPProgram[]>('/programs', buildQueryString(queryParams))
}

/**
 * Get all episodes with advanced filtering and pagination
 * @param params - Extended query parameters
 * @returns Promise with array of episode data
 */
export async function getEpisodesAdvanced(params: {
  per_page?: number
  page?: number
  status?: 'publish' | 'draft' | 'private'
  parent?: number
  search?: string
  orderby?: 'date' | 'title' | 'episode_number'
  order?: 'asc' | 'desc'
  season_number?: number
  include?: number[]
  exclude?: number[]
  before?: string
  after?: string
} = {}): Promise<WPEpisode[]> {
  const queryParams = {
    _embed: 'true',
    _fields: 'id,slug,title,content,excerpt,meta,parent,featured_media,date,modified,_embedded',
    per_page: params.per_page || 10,
    page: params.page || 1,
    status: params.status || 'publish',
    orderby: params.orderby || 'date',
    order: params.order || 'desc',
    parent: params.parent,
    search: params.search,
    season_number: params.season_number,
    include: params.include,
    exclude: params.exclude,
    before: params.before,
    after: params.after
  }

  return wpFetch<WPEpisode[]>('/episodes', buildQueryString(queryParams))
}

/**
 * Get all Taqdeer assessments with advanced filtering and pagination
 * @param params - Extended query parameters
 * @returns Promise with array of Taqdeer data
 */
export async function getTaqdeerAdvanced(params: {
  per_page?: number
  page?: number
  status?: 'publish' | 'draft' | 'private'
  search?: string
  orderby?: 'date' | 'title' | 'modified'
  order?: 'asc' | 'desc'
  verdict?: 'positive' | 'negative' | 'neutral' | 'mixed'
  include?: number[]
  exclude?: number[]
  before?: string
  after?: string
} = {}): Promise<WPTaqdeer[]> {
  const queryParams = {
    _embed: 'true',
    _fields: 'id,slug,title,content,excerpt,meta,featured_media,date,modified,_embedded',
    per_page: params.per_page || 10,
    page: params.page || 1,
    status: params.status || 'publish',
    orderby: params.orderby || 'date',
    order: params.order || 'desc',
    search: params.search,
    verdict: params.verdict,
    include: params.include,
    exclude: params.exclude,
    before: params.before,
    after: params.after
  }

  return wpFetch<WPTaqdeer[]>('/taqdeer_mawqef', buildQueryString(queryParams))
}

/**
 * Search across all content types
 * @param query - Search query
 * @param contentTypes - Array of content types to search
 * @param limit - Maximum results per content type
 * @returns Promise with search results
 */
export async function searchContent(
  query: string,
  contentTypes: ('programs' | 'episodes' | 'taqdeer_mawqef')[] = ['programs', 'episodes', 'taqdeer_mawqef'],
  limit: number = 5
): Promise<{
  programs: WPProgram[]
  episodes: WPEpisode[]
  taqdeer: WPTaqdeer[]
}> {
  const results = {
    programs: [] as WPProgram[],
    episodes: [] as WPEpisode[],
    taqdeer: [] as WPTaqdeer[]
  }

  const searchPromises = []

  if (contentTypes.includes('programs')) {
    searchPromises.push(
      getPrograms({ search: query, per_page: limit })
        .then(data => { results.programs = data })
        .catch(error => console.warn('Programs search failed:', error))
    )
  }

  if (contentTypes.includes('episodes')) {
    searchPromises.push(
      getEpisodesAdvanced({ search: query, per_page: limit })
        .then(data => { results.episodes = data })
        .catch(error => console.warn('Episodes search failed:', error))
    )
  }

  if (contentTypes.includes('taqdeer_mawqef')) {
    searchPromises.push(
      getTaqdeerAdvanced({ search: query, per_page: limit })
        .then(data => { results.taqdeer = data })
        .catch(error => console.warn('Taqdeer search failed:', error))
    )
  }

  await Promise.all(searchPromises)
  return results
}