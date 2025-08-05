/**
 * Article SCF Integration
 * Complete integration layer for article SCF fields with WordPress
 */

import { 
  transformToArticleCard,
  transformToArticleDetail,
  createArticleListProps,
  validateArticleSCF,
  getArticleFallbacks,
  getArticleCacheTags,
  getArticleRevalidationPaths
} from './scf-mappings/article-mappings'
import { NormalizedWPPost, transformWordPressPosts } from './wordpress-transformers'
import { wpGet } from './wordpress'

// Article component prop types
export type ArticleCardProps = {
  id: number
  slug: string
  title: string
  excerpt: string
  href: string
  image?: string
  readTime?: number
  categoryColor?: string
  featured?: boolean
  audioUrl?: string
  publishedAt: string
  author: {
    name: string
    avatar?: string
  }
}

export type ArticleDetailProps = {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string
  authorName: string
  authorBio?: string
  audioUrl?: string
  audioDuration?: number
  readTime?: number
  categoryColor?: string
  socialImage?: string
  publishedAt: string
  modifiedAt: string
  featured?: boolean
  breakingNews?: boolean
  seo: {
    title: string
    description: string
    keywords?: string
    image?: string
  }
}

export type ArticleListProps = {
  articles: ArticleCardProps[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters?: {
    category?: string
    featured?: boolean
    search?: string
  }
}

// Article fetching options
export interface ArticleFetchOptions {
  page?: number
  perPage?: number
  category?: string
  search?: string
  featured?: boolean
  author?: number
  orderBy?: 'date' | 'title' | 'modified'
  order?: 'asc' | 'desc'
  includeMeta?: boolean
}

/**
 * Fetch articles with complete SCF mapping
 */
export async function fetchArticlesWithSCF(
  options: ArticleFetchOptions = {}
): Promise<{
  articles: ArticleCardProps[]
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
    category,
    search,
    featured,
    author,
    orderBy = 'date',
    order = 'desc',
    includeMeta = true
  } = options

  // Build WordPress API parameters
  const params: Record<string, any> = {
    page,
    per_page: perPage,
    orderby: orderBy,
    order,
    _embed: true,
    acf_format: 'standard'
  }

  if (category) {
    params.categories = category
  }

  if (search) {
    params.search = search
  }

  if (author) {
    params.author = author
  }

  if (featured) {
    params.meta_query = JSON.stringify([
      {
        key: 'is_featured',
        value: '1',
        compare: '='
      }
    ])
  }

  try {
    // Fetch posts from WordPress
    const response = await wpGet('posts', params, {
      revalidate: 300, // 5 minutes
      tags: ['articles']
    })

    // Transform to normalized format
    const normalizedPosts = transformWordPressPosts(response.data)
    
    // Transform to article cards
    const articles = normalizedPosts.map(transformToArticleCard)
    
    // Calculate pagination
    const totalItems = response.headers?.['x-wp-total'] ? 
      parseInt(response.headers['x-wp-total']) : articles.length
    const totalPages = response.headers?.['x-wp-totalpages'] ? 
      parseInt(response.headers['x-wp-totalpages']) : 1

    // Generate cache tags
    const cacheTags = ['articles']
    if (featured) cacheTags.push('featured-articles')
    if (category) cacheTags.push(`category:${category}`)
    if (author) cacheTags.push(`author:${author}`)

    return {
      articles,
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
    console.error('Error fetching articles with SCF:', error)
    
    // Return fallback data
    return {
      articles: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      },
      cacheTags: ['articles']
    }
  }
}

/**
 * Fetch single article with complete SCF mapping
 */
export async function fetchArticleWithSCF(
  slug: string
): Promise<{
  article: ArticleDetailProps | null
  cacheTags: string[]
  revalidationPaths: string[]
}> {
  try {
    // Fetch single post by slug
    const response = await wpGet('posts', {
      slug,
      _embed: true,
      acf_format: 'standard'
    }, {
      revalidate: 300, // 5 minutes
      tags: ['articles', `article-slug:${slug}`]
    })

    if (!response.data || response.data.length === 0) {
      return {
        article: null,
        cacheTags: ['articles'],
        revalidationPaths: []
      }
    }

    // Transform to normalized format
    const normalizedPost = transformWordPressPosts(response.data)[0]
    
    // Validate SCF fields
    const validation = validateArticleSCF(normalizedPost.zawaya_meta)
    if (!validation.valid) {
      console.warn('Article SCF validation failed:', validation.errors)
    }
    if (validation.warnings.length > 0) {
      console.warn('Article SCF warnings:', validation.warnings)
    }
    
    // Transform to article detail
    const article = transformToArticleDetail(normalizedPost)
    
    // Generate cache tags and revalidation paths
    const cacheTags = getArticleCacheTags(normalizedPost)
    const revalidationPaths = getArticleRevalidationPaths(normalizedPost)

    return {
      article,
      cacheTags,
      revalidationPaths
    }

  } catch (error) {
    console.error('Error fetching article with SCF:', error)
    
    return {
      article: null,
      cacheTags: ['articles'],
      revalidationPaths: []
    }
  }
}

/**
 * Fetch featured articles for homepage
 */
export async function fetchFeaturedArticlesWithSCF(
  limit: number = 6
): Promise<{
  articles: ArticleCardProps[]
  cacheTags: string[]
}> {
  try {
    const response = await wpGet('posts', {
      per_page: limit,
      orderby: 'date',
      order: 'desc',
      _embed: true,
      acf_format: 'standard',
      meta_query: JSON.stringify([
        {
          key: 'is_featured',
          value: '1',
          compare: '='
        }
      ])
    }, {
      revalidate: 180, // 3 minutes for homepage
      tags: ['featured-articles', 'homepage']
    })

    const normalizedPosts = transformWordPressPosts(response.data || [])
    const articles = normalizedPosts.map(transformToArticleCard)

    return {
      articles,
      cacheTags: ['featured-articles', 'homepage', 'articles']
    }

  } catch (error) {
    console.error('Error fetching featured articles:', error)
    
    return {
      articles: [],
      cacheTags: ['featured-articles', 'homepage']
    }
  }
}

/**
 * Fetch articles by category with SCF mapping
 */
export async function fetchArticlesByCategoryWithSCF(
  categorySlug: string,
  options: Omit<ArticleFetchOptions, 'category'> = {}
): Promise<{
  articles: ArticleCardProps[]
  category: {
    id: number
    name: string
    slug: string
  } | null
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
    // First, get the category ID
    const categoryResponse = await wpGet('categories', {
      slug: categorySlug
    })

    if (!categoryResponse.data || categoryResponse.data.length === 0) {
      return {
        articles: [],
        category: null,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNext: false,
          hasPrev: false
        },
        cacheTags: ['articles']
      }
    }

    const category = categoryResponse.data[0]
    
    // Fetch articles in this category
    const articlesResult = await fetchArticlesWithSCF({
      ...options,
      category: category.id.toString()
    })

    return {
      ...articlesResult,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      },
      cacheTags: [...articlesResult.cacheTags, `category:${category.id}`]
    }

  } catch (error) {
    console.error('Error fetching articles by category:', error)
    
    return {
      articles: [],
      category: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      },
      cacheTags: ['articles']
    }
  }
}

/**
 * Search articles with SCF mapping
 */
export async function searchArticlesWithSCF(
  query: string,
  options: Omit<ArticleFetchOptions, 'search'> = {}
): Promise<{
  articles: ArticleCardProps[]
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
  const articlesResult = await fetchArticlesWithSCF({
    ...options,
    search: query
  })

  return {
    ...articlesResult,
    query,
    cacheTags: [...articlesResult.cacheTags, 'search']
  }
}

/**
 * Get related articles based on categories and tags
 */
export async function fetchRelatedArticlesWithSCF(
  currentArticle: NormalizedWPPost,
  limit: number = 4
): Promise<{
  articles: ArticleCardProps[]
  cacheTags: string[]
}> {
  try {
    // Get articles from same categories, excluding current article
    const params: Record<string, any> = {
      per_page: limit + 1, // Get one extra in case current article is included
      orderby: 'date',
      order: 'desc',
      _embed: true,
      acf_format: 'standard',
      exclude: [currentArticle.id]
    }

    if (currentArticle.categories.length > 0) {
      params.categories = currentArticle.categories.join(',')
    }

    const response = await wpGet('posts', params, {
      revalidate: 600, // 10 minutes
      tags: ['articles', 'related-articles']
    })

    const normalizedPosts = transformWordPressPosts(response.data || [])
      .filter(post => post.id !== currentArticle.id) // Extra safety
      .slice(0, limit)
    
    const articles = normalizedPosts.map(transformToArticleCard)

    return {
      articles,
      cacheTags: ['articles', 'related-articles', `article:${currentArticle.id}`]
    }

  } catch (error) {
    console.error('Error fetching related articles:', error)
    
    return {
      articles: [],
      cacheTags: ['articles', 'related-articles']
    }
  }
}

/**
 * Prefetch article data for performance
 */
export async function prefetchArticleData(slug: string): Promise<void> {
  try {
    await fetchArticleWithSCF(slug)
  } catch (error) {
    console.warn('Failed to prefetch article data:', error)
  }
}

// Export all functions and types
export type {
  ArticleCardProps,
  ArticleDetailProps,
  ArticleListProps,
  ArticleFetchOptions
}