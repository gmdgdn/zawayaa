/**
 * Author SCF Integration
 * Complete integration layer for author SCF fields with WordPress
 */

import { 
  AuthorCardProps, 
  AuthorProfileProps, 
  AuthorListProps,
  WordPressAuthor,
  transformToAuthorCard,
  transformToAuthorProfile,
  createAuthorListProps,
  validateAuthorSCF,
  getAuthorFallbacks,
  getAuthorCacheTags,
  getAuthorRevalidationPaths,
  filterAuthorsByExpertise,
  sortAuthors
} from './scf-mappings/author-mappings'
import { wpGet } from './wordpress'

// Author fetching options
export interface AuthorFetchOptions {
  page?: number
  perPage?: number
  featured?: boolean
  verified?: boolean
  expertise?: string
  orderBy?: 'name' | 'registered' | 'post_count'
  order?: 'asc' | 'desc'
  includeMeta?: boolean
}

/**
 * Fetch authors with complete SCF mapping
 */
export async function fetchAuthorsWithSCF(
  options: AuthorFetchOptions = {}
): Promise<{
  authors: AuthorCardProps[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  cacheTags: string[]
}> {
  const {
    page = 1,
    perPage = 12,
    featured,
    verified,
    expertise,
    orderBy = 'name',
    order = 'asc',
    includeMeta = true
  } = options

  // Build WordPress API parameters
  const params: Record<string, any> = {
    page,
    per_page: perPage,
    orderby: orderBy,
    order,
    who: 'authors', // Only users who can publish posts
    acf_format: 'standard'
  }

  // Add meta query for filtering
  const metaQuery: any[] = []
  
  if (featured) {
    metaQuery.push({
      key: 'is_featured_author',
      value: '1',
      compare: '='
    })
  }

  if (verified) {
    metaQuery.push({
      key: 'is_verified_author',
      value: '1',
      compare: '='
    })
  }

  if (metaQuery.length > 0) {
    params.meta_query = JSON.stringify(metaQuery)
  }

  try {
    // Fetch authors from WordPress
    const response = await wpGet('users', params, {
      revalidate: 600, // 10 minutes
      tags: ['authors']
    })

    const authors: WordPressAuthor[] = response.data || []
    
    // Get article counts for each author
    const articlesCounts = await getArticleCountsForAuthors(authors.map(a => a.id))
    
    // Filter by expertise if specified
    let filteredAuthors = authors
    if (expertise) {
      filteredAuthors = authors.filter(author => {
        try {
          const expertiseAreas = author.meta?.expertise_areas ? 
            JSON.parse(author.meta.expertise_areas) : []
          return expertiseAreas.some((area: string) => 
            area.toLowerCase().includes(expertise.toLowerCase())
          )
        } catch {
          return false
        }
      })
    }
    
    // Transform to author cards
    const authorCards = filteredAuthors.map(author => 
      transformToAuthorCard(author, articlesCounts[author.id] || 0)
    )
    
    // Calculate pagination
    const totalItems = response.headers?.['x-wp-total'] ? 
      parseInt(response.headers['x-wp-total']) : authorCards.length
    const totalPages = response.headers?.['x-wp-totalpages'] ? 
      parseInt(response.headers['x-wp-totalpages']) : 1

    // Generate cache tags
    const cacheTags = ['authors']
    if (featured) cacheTags.push('featured-authors')
    if (verified) cacheTags.push('verified-authors')
    if (expertise) cacheTags.push(`expertise:${expertise}`)

    return {
      authors: authorCards,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      cacheTags
    }

  } catch (error) {
    console.error('Error fetching authors with SCF:', error)
    
    return {
      authors: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      },
      cacheTags: ['authors']
    }
  }
}

/**
 * Fetch single author with complete SCF mapping
 */
export async function fetchAuthorWithSCF(
  slug: string
): Promise<{
  author: AuthorProfileProps | null
  cacheTags: string[]
  revalidationPaths: string[]
}> {
  try {
    // Fetch single author by slug
    const response = await wpGet('users', {
      slug,
      acf_format: 'standard'
    }, {
      revalidate: 600, // 10 minutes
      tags: ['authors', `author-slug:${slug}`]
    })

    if (!response.data || response.data.length === 0) {
      return {
        author: null,
        cacheTags: ['authors'],
        revalidationPaths: []
      }
    }

    const wpAuthor: WordPressAuthor = response.data[0]
    
    // Validate SCF fields
    const validation = validateAuthorSCF(wpAuthor.meta || {})
    if (!validation.valid) {
      console.warn('Author SCF validation failed:', validation.errors)
    }
    if (validation.warnings.length > 0) {
      console.warn('Author SCF warnings:', validation.warnings)
    }
    
    // Get author stats
    const stats = await getAuthorStats(wpAuthor.id)
    
    // Transform to author profile
    const author = transformToAuthorProfile(wpAuthor, stats)
    
    // Generate cache tags and revalidation paths
    const cacheTags = getAuthorCacheTags(wpAuthor)
    const revalidationPaths = getAuthorRevalidationPaths(wpAuthor)

    return {
      author,
      cacheTags,
      revalidationPaths
    }

  } catch (error) {
    console.error('Error fetching author with SCF:', error)
    
    return {
      author: null,
      cacheTags: ['authors'],
      revalidationPaths: []
    }
  }
}

/**
 * Fetch featured authors for homepage
 */
export async function fetchFeaturedAuthorsWithSCF(
  limit: number = 6
): Promise<{
  authors: AuthorCardProps[]
  cacheTags: string[]
}> {
  try {
    const response = await wpGet('users', {
      per_page: limit,
      orderby: 'name',
      order: 'asc',
      who: 'authors',
      acf_format: 'standard',
      meta_query: JSON.stringify([
        {
          key: 'is_featured_author',
          value: '1',
          compare: '='
        }
      ])
    }, {
      revalidate: 300, // 5 minutes for homepage
      tags: ['featured-authors', 'homepage']
    })

    const authors: WordPressAuthor[] = response.data || []
    const articlesCounts = await getArticleCountsForAuthors(authors.map(a => a.id))
    
    const authorCards = authors.map(author => 
      transformToAuthorCard(author, articlesCounts[author.id] || 0)
    )

    return {
      authors: authorCards,
      cacheTags: ['featured-authors', 'homepage', 'authors']
    }

  } catch (error) {
    console.error('Error fetching featured authors:', error)
    
    return {
      authors: [],
      cacheTags: ['featured-authors', 'homepage']
    }
  }
}

/**
 * Fetch authors by expertise area
 */
export async function fetchAuthorsByExpertiseWithSCF(
  expertise: string,
  options: Omit<AuthorFetchOptions, 'expertise'> = {}
): Promise<{
  authors: AuthorCardProps[]
  expertise: string
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  cacheTags: string[]
}> {
  const authorsResult = await fetchAuthorsWithSCF({
    ...options,
    expertise
  })

  return {
    ...authorsResult,
    expertise,
    cacheTags: [...authorsResult.cacheTags, `expertise:${expertise}`]
  }
}

/**
 * Search authors with SCF mapping
 */
export async function searchAuthorsWithSCF(
  query: string,
  options: Omit<AuthorFetchOptions, 'search'> = {}
): Promise<{
  authors: AuthorCardProps[]
  query: string
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  cacheTags: string[]
}> {
  try {
    const {
      page = 1,
      perPage = 12,
      orderBy = 'name',
      order = 'asc'
    } = options

    const response = await wpGet('users', {
      search: query,
      page,
      per_page: perPage,
      orderby: orderBy,
      order,
      who: 'authors',
      acf_format: 'standard'
    }, {
      revalidate: 300,
      tags: ['authors', 'search']
    })

    const authors: WordPressAuthor[] = response.data || []
    const articlesCounts = await getArticleCountsForAuthors(authors.map(a => a.id))
    
    const authorCards = authors.map(author => 
      transformToAuthorCard(author, articlesCounts[author.id] || 0)
    )
    
    const totalItems = response.headers?.['x-wp-total'] ? 
      parseInt(response.headers['x-wp-total']) : authorCards.length
    const totalPages = response.headers?.['x-wp-totalpages'] ? 
      parseInt(response.headers['x-wp-totalpages']) : 1

    return {
      authors: authorCards,
      query,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      cacheTags: ['authors', 'search']
    }

  } catch (error) {
    console.error('Error searching authors:', error)
    
    return {
      authors: [],
      query,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      },
      cacheTags: ['authors', 'search']
    }
  }
}

/**
 * Get article counts for multiple authors
 */
async function getArticleCountsForAuthors(authorIds: number[]): Promise<Record<number, number>> {
  if (authorIds.length === 0) return {}

  try {
    const counts: Record<number, number> = {}
    
    // Fetch article counts for each author
    for (const authorId of authorIds) {
      try {
        const response = await wpGet('posts', {
          author: authorId,
          per_page: 1,
          status: 'publish'
        }, {
          revalidate: 600,
          tags: [`author:${authorId}`]
        })
        
        counts[authorId] = response.headers?.['x-wp-total'] ? 
          parseInt(response.headers['x-wp-total']) : 0
      } catch (error) {
        console.warn(`Failed to get article count for author ${authorId}:`, error)
        counts[authorId] = 0
      }
    }
    
    return counts

  } catch (error) {
    console.error('Error getting article counts for authors:', error)
    return {}
  }
}

/**
 * Get comprehensive stats for an author
 */
async function getAuthorStats(authorId: number): Promise<{
  articlesCount: number
  programsCount: number
  totalViews?: number
}> {
  try {
    const [articlesResponse, programsResponse] = await Promise.all([
      wpGet('posts', {
        author: authorId,
        per_page: 1,
        status: 'publish'
      }, {
        revalidate: 600,
        tags: [`author:${authorId}`]
      }),
      wpGet('programs', {
        author: authorId,
        per_page: 1,
        status: 'publish'
      }, {
        revalidate: 600,
        tags: [`author:${authorId}`]
      }).catch(() => ({ headers: {} })) // Programs might not exist
    ])

    return {
      articlesCount: articlesResponse.headers?.['x-wp-total'] ? 
        parseInt(articlesResponse.headers['x-wp-total']) : 0,
      programsCount: programsResponse.headers?.['x-wp-total'] ? 
        parseInt(programsResponse.headers['x-wp-total']) : 0
    }

  } catch (error) {
    console.error('Error getting author stats:', error)
    return {
      articlesCount: 0,
      programsCount: 0
    }
  }
}

/**
 * Get articles by author with SCF mapping
 */
export async function fetchAuthorArticlesWithSCF(
  authorId: number,
  options: {
    page?: number
    perPage?: number
    orderBy?: 'date' | 'title' | 'modified'
    order?: 'asc' | 'desc'
  } = {}
): Promise<{
  articles: any[] // Use ArticleCardProps from article-mappings
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  cacheTags: string[]
}> {
  const {
    page = 1,
    perPage = 10,
    orderBy = 'date',
    order = 'desc'
  } = options

  try {
    const response = await wpGet('posts', {
      author: authorId,
      page,
      per_page: perPage,
      orderby: orderBy,
      order,
      status: 'publish',
      _embed: true,
      acf_format: 'standard'
    }, {
      revalidate: 300,
      tags: ['articles', `author:${authorId}`]
    })

    // Transform articles using article mappings
    // This would need to import from article-scf-integration
    const articles = response.data || []
    
    const totalItems = response.headers?.['x-wp-total'] ? 
      parseInt(response.headers['x-wp-total']) : articles.length
    const totalPages = response.headers?.['x-wp-totalpages'] ? 
      parseInt(response.headers['x-wp-totalpages']) : 1

    return {
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      cacheTags: ['articles', `author:${authorId}`]
    }

  } catch (error) {
    console.error('Error fetching author articles:', error)
    
    return {
      articles: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      },
      cacheTags: ['articles', `author:${authorId}`]
    }
  }
}

/**
 * Prefetch author data for performance
 */
export async function prefetchAuthorData(slug: string): Promise<void> {
  try {
    await fetchAuthorWithSCF(slug)
  } catch (error) {
    console.warn('Failed to prefetch author data:', error)
  }
}

// Export all functions and types
export {
  AuthorCardProps,
  AuthorProfileProps,
  AuthorListProps,
  WordPressAuthor,
  AuthorFetchOptions
}