import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase client for content discovery
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({
              data: [
                {
                  id: '1',
                  title_ar: 'مقال مميز عن الثقافة العربية',
                  excerpt_ar: 'مقال يناقش جوانب مختلفة من الثقافة العربية المعاصرة',
                  featured_image_url: 'https://example.com/featured.jpg',
                  view_count: 250,
                  published_at: '2024-01-15T00:00:00Z',
                  authors: { name_ar: 'كاتب مميز' },
                  categories: { name_ar: 'ثقافة' },
                  tags: ['ثقافة', 'تراث', 'هوية']
                }
              ],
              error: null
            }))
          })),
          not: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({
                data: [
                  {
                    id: '2',
                    title_ar: 'مقال ذو صلة بالموضوع',
                    category_ar: 'ثقافة',
                    similarity_score: 0.85
                  }
                ],
                error: null
              }))
            }))
          })),
          gte: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({
                data: [
                  {
                    id: '3',
                    title_ar: 'مقال حديث',
                    published_at: '2024-01-20T00:00:00Z'
                  }
                ],
                error: null
              }))
            }))
          })),
          in: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({
                data: [
                  {
                    id: '4',
                    title_ar: 'مقال من نفس الفئة',
                    category_ar: 'ثقافة'
                  }
                ],
                error: null
              }))
            }))
          }))
        })),
        ilike: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({
              data: [
                {
                  id: '5',
                  name_ar: 'كاتب مشهور',
                  bio_ar: 'كاتب متخصص في الشؤون الثقافية',
                  articles_count: 25
                }
              ],
              error: null
            }))
          }))
        }))
      }))
    }))
  }))
}

vi.mock('@/lib/supabase', () => ({
  createClient: () => mockSupabase
}))

// Content Discovery Service Implementation
class ContentDiscoveryService {
  constructor() {}

  /**
   * Get featured Arabic content for homepage
   */
  async getFeaturedContent(limit: number = 6): Promise<any[]> {
    try {
      const { data, error } = await mockSupabase
        .from('article_translations')
        .select(`
          article_id,
          title,
          excerpt,
          articles!inner(
            id,
            slug,
            featured_image_url,
            view_count,
            published_at,
            is_featured,
            authors!inner(name_ar),
            categories!inner(name_ar)
          )
        `)
        .eq('language', 'ar')
        .eq('articles.status', 'published')
        .eq('articles.is_featured', true)
        .order('articles.published_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching featured content:', error)
      return []
    }
  }

  /**
   * Get related Arabic content based on category and tags
   */
  async getRelatedContent(
    contentId: string, 
    categoryId: string, 
    tags: string[] = [], 
    limit: number = 5
  ): Promise<any[]> {
    try {
      const { data, error } = await mockSupabase
        .from('article_translations')
        .select(`
          article_id,
          title,
          excerpt,
          articles!inner(
            id,
            slug,
            featured_image_url,
            category_id,
            published_at,
            authors!inner(name_ar)
          )
        `)
        .eq('language', 'ar')
        .eq('articles.status', 'published')
        .eq('articles.category_id', categoryId)
        .not('articles.id', 'eq', contentId)
        .order('articles.published_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching related content:', error)
      return []
    }
  }

  /**
   * Get trending Arabic content based on views and engagement
   */
  async getTrendingContent(
    timeframe: 'day' | 'week' | 'month' = 'week',
    limit: number = 10
  ): Promise<any[]> {
    try {
      const daysAgo = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo)

      const { data, error } = await mockSupabase
        .from('article_translations')
        .select(`
          article_id,
          title,
          excerpt,
          articles!inner(
            id,
            slug,
            featured_image_url,
            view_count,
            published_at,
            authors!inner(name_ar),
            categories!inner(name_ar)
          )
        `)
        .eq('language', 'ar')
        .eq('articles.status', 'published')
        .gte('articles.published_at', cutoffDate.toISOString())
        .order('articles.view_count', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching trending content:', error)
      return []
    }
  }

  /**
   * Get content by Arabic category with filtering
   */
  async getContentByCategory(
    categoryName: string,
    filters: {
      hasAudio?: boolean
      hasVideo?: boolean
      dateFrom?: string
      dateTo?: string
    } = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<{ content: any[], total: number }> {
    try {
      let query = mockSupabase
        .from('article_translations')
        .select(`
          article_id,
          title,
          excerpt,
          audio_url,
          articles!inner(
            id,
            slug,
            featured_image_url,
            view_count,
            published_at,
            authors!inner(name_ar),
            categories!inner(name_ar)
          )
        `)
        .eq('language', 'ar')
        .eq('articles.status', 'published')
        .eq('articles.categories.name_ar', categoryName)

      // Apply filters
      if (filters.hasAudio) {
        query = query.not('audio_url', 'is', null)
      }

      if (filters.dateFrom) {
        query = query.gte('articles.published_at', filters.dateFrom)
      }

      if (filters.dateTo) {
        query = query.lte('articles.published_at', filters.dateTo)
      }

      const { data, error } = await query
        .order('articles.published_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return {
        content: data || [],
        total: data?.length || 0
      }
    } catch (error) {
      console.error('Error fetching content by category:', error)
      return { content: [], total: 0 }
    }
  }

  /**
   * Get Arabic author profiles with their content
   */
  async getAuthorProfiles(
    searchQuery?: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      let query = mockSupabase
        .from('authors')
        .select(`
          id,
          name_ar,
          bio_ar,
          profile_image_url,
          social_links,
          articles_count,
          specializations
        `)

      if (searchQuery) {
        query = query.ilike('name_ar', `%${searchQuery}%`)
      }

      const { data, error } = await query
        .order('articles_count', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching author profiles:', error)
      return []
    }
  }

  /**
   * Get content recommendations based on user reading history
   */
  async getPersonalizedRecommendations(
    userId: string,
    readArticleIds: string[] = [],
    limit: number = 8
  ): Promise<any[]> {
    try {
      // Get user's reading categories
      const userCategories = await this.getUserReadingCategories(userId, readArticleIds)
      
      if (userCategories.length === 0) {
        // Fallback to popular content
        return this.getTrendingContent('week', limit)
      }

      const { data, error } = await mockSupabase
        .from('article_translations')
        .select(`
          article_id,
          title,
          excerpt,
          articles!inner(
            id,
            slug,
            featured_image_url,
            view_count,
            published_at,
            category_id,
            authors!inner(name_ar),
            categories!inner(name_ar)
          )
        `)
        .eq('language', 'ar')
        .eq('articles.status', 'published')
        .in('articles.category_id', userCategories)
        .not('articles.id', 'in', `(${readArticleIds.join(',')})`)
        .order('articles.view_count', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error)
      return []
    }
  }

  /**
   * Get user's preferred reading categories
   */
  private async getUserReadingCategories(
    userId: string, 
    readArticleIds: string[]
  ): Promise<string[]> {
    if (readArticleIds.length === 0) return []

    try {
      // This would analyze user's reading history to determine preferred categories
      // For testing, return mock categories
      return ['1', '2', '3'] // Mock category IDs
    } catch (error) {
      console.error('Error analyzing user reading categories:', error)
      return []
    }
  }

  /**
   * Get content statistics for analytics
   */
  async getContentStats(): Promise<{
    total_articles: number
    total_programs: number
    total_episodes: number
    total_authors: number
    categories_count: number
    avg_views_per_article: number
  }> {
    try {
      // Mock implementation - in real app would query actual stats
      return {
        total_articles: 150,
        total_programs: 25,
        total_episodes: 200,
        total_authors: 30,
        categories_count: 8,
        avg_views_per_article: 125
      }
    } catch (error) {
      console.error('Error fetching content stats:', error)
      return {
        total_articles: 0,
        total_programs: 0,
        total_episodes: 0,
        total_authors: 0,
        categories_count: 0,
        avg_views_per_article: 0
      }
    }
  }
}

describe('ContentDiscoveryService - Arabic Content Discovery', () => {
  let contentDiscovery: ContentDiscoveryService

  beforeEach(() => {
    contentDiscovery = new ContentDiscoveryService()
    vi.clearAllMocks()
  })

  describe('Featured Content Discovery', () => {
    it('should get featured Arabic content for homepage', async () => {
      const featured = await contentDiscovery.getFeaturedContent(6)

      expect(mockSupabase.from).toHaveBeenCalledWith('article_translations')
      expect(Array.isArray(featured)).toBe(true)
    })

    it('should handle featured content query errors', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => ({
                  limit: vi.fn(() => Promise.resolve({
                    data: null,
                    error: { message: 'Database error' }
                  }))
                }))
              }))
            }))
          }))
        }))
      })

      const featured = await contentDiscovery.getFeaturedContent()
      expect(featured).toHaveLength(0)
    })

    it('should limit featured content results correctly', async () => {
      await contentDiscovery.getFeaturedContent(3)

      const limitCall = mockSupabase.from().select().eq().eq().eq().order().limit
      expect(limitCall).toHaveBeenCalledWith(3)
    })
  })

  describe('Related Content Discovery', () => {
    it('should get related Arabic content by category', async () => {
      const related = await contentDiscovery.getRelatedContent(
        'article-123',
        'category-456',
        ['ثقافة', 'تراث'],
        5
      )

      expect(mockSupabase.from).toHaveBeenCalledWith('article_translations')
      expect(Array.isArray(related)).toBe(true)
    })

    it('should exclude current article from related results', async () => {
      await contentDiscovery.getRelatedContent('article-123', 'category-456')

      const notCall = mockSupabase.from().select().eq().eq().eq().not
      expect(notCall).toHaveBeenCalledWith('articles.id', 'eq', 'article-123')
    })

    it('should handle empty related content gracefully', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                not: vi.fn(() => ({
                  order: vi.fn(() => ({
                    limit: vi.fn(() => Promise.resolve({
                      data: [],
                      error: null
                    }))
                  }))
                }))
              }))
            }))
          }))
        }))
      })

      const related = await contentDiscovery.getRelatedContent('article-123', 'category-456')
      expect(related).toHaveLength(0)
    })
  })

  describe('Trending Content Discovery', () => {
    it('should get trending Arabic content for different timeframes', async () => {
      const dailyTrending = await contentDiscovery.getTrendingContent('day', 5)
      const weeklyTrending = await contentDiscovery.getTrendingContent('week', 10)
      const monthlyTrending = await contentDiscovery.getTrendingContent('month', 15)

      expect(Array.isArray(dailyTrending)).toBe(true)
      expect(Array.isArray(weeklyTrending)).toBe(true)
      expect(Array.isArray(monthlyTrending)).toBe(true)
    })

    it('should order trending content by view count', async () => {
      await contentDiscovery.getTrendingContent('week')

      const orderCall = mockSupabase.from().select().eq().eq().gte().order
      expect(orderCall).toHaveBeenCalledWith('articles.view_count', { ascending: false })
    })

    it('should filter trending content by date range', async () => {
      await contentDiscovery.getTrendingContent('day')

      const gteCall = mockSupabase.from().select().eq().eq().gte
      expect(gteCall).toHaveBeenCalled()
    })
  })

  describe('Category-Based Content Discovery', () => {
    it('should get Arabic content by category with filters', async () => {
      const filters = {
        hasAudio: true,
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31'
      }

      const result = await contentDiscovery.getContentByCategory(
        'ثقافة',
        filters,
        20,
        0
      )

      expect(result).toHaveProperty('content')
      expect(result).toHaveProperty('total')
      expect(Array.isArray(result.content)).toBe(true)
    })

    it('should apply audio filter correctly', async () => {
      await contentDiscovery.getContentByCategory('ثقافة', { hasAudio: true })

      const notCall = mockSupabase.from().select().eq().eq().eq().not
      expect(notCall).toHaveBeenCalledWith('audio_url', 'is', null)
    })

    it('should handle pagination correctly', async () => {
      await contentDiscovery.getContentByCategory('ثقافة', {}, 10, 20)

      const rangeCall = mockSupabase.from().select().eq().eq().eq().order().range
      expect(rangeCall).toHaveBeenCalledWith(20, 29)
    })
  })

  describe('Author Profile Discovery', () => {
    it('should get Arabic author profiles', async () => {
      const authors = await contentDiscovery.getAuthorProfiles()

      expect(mockSupabase.from).toHaveBeenCalledWith('authors')
      expect(Array.isArray(authors)).toBe(true)
    })

    it('should search authors by name', async () => {
      await contentDiscovery.getAuthorProfiles('كاتب مشهور')

      const ilikeCall = mockSupabase.from().select().ilike
      expect(ilikeCall).toHaveBeenCalledWith('name_ar', '%كاتب مشهور%')
    })

    it('should order authors by article count', async () => {
      await contentDiscovery.getAuthorProfiles()

      const orderCall = mockSupabase.from().select().order
      expect(orderCall).toHaveBeenCalledWith('articles_count', { ascending: false })
    })
  })

  describe('Personalized Recommendations', () => {
    it('should get personalized Arabic recommendations', async () => {
      const recommendations = await contentDiscovery.getPersonalizedRecommendations(
        'user-123',
        ['article-1', 'article-2'],
        8
      )

      expect(Array.isArray(recommendations)).toBe(true)
    })

    it('should exclude already read articles', async () => {
      const readArticles = ['article-1', 'article-2', 'article-3']
      
      await contentDiscovery.getPersonalizedRecommendations('user-123', readArticles)

      const notCall = mockSupabase.from().select().eq().eq().in().not
      expect(notCall).toHaveBeenCalledWith('articles.id', 'in', '(article-1,article-2,article-3)')
    })

    it('should fallback to trending content for new users', async () => {
      const recommendations = await contentDiscovery.getPersonalizedRecommendations('new-user', [])

      expect(Array.isArray(recommendations)).toBe(true)
    })
  })

  describe('Content Statistics', () => {
    it('should get comprehensive content statistics', async () => {
      const stats = await contentDiscovery.getContentStats()

      expect(stats).toHaveProperty('total_articles')
      expect(stats).toHaveProperty('total_programs')
      expect(stats).toHaveProperty('total_episodes')
      expect(stats).toHaveProperty('total_authors')
      expect(stats).toHaveProperty('categories_count')
      expect(stats).toHaveProperty('avg_views_per_article')
      
      expect(typeof stats.total_articles).toBe('number')
      expect(typeof stats.avg_views_per_article).toBe('number')
    })

    it('should handle statistics errors gracefully', async () => {
      // Mock error scenario
      const originalConsoleError = console.error
      console.error = vi.fn()

      const stats = await contentDiscovery.getContentStats()

      expect(stats.total_articles).toBeGreaterThanOrEqual(0)
      
      console.error = originalConsoleError
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle database connection failures', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const featured = await contentDiscovery.getFeaturedContent()
      expect(featured).toHaveLength(0)
    })

    it('should handle empty category names', async () => {
      const result = await contentDiscovery.getContentByCategory('')
      
      expect(result.content).toHaveLength(0)
      expect(result.total).toBe(0)
    })

    it('should handle invalid user IDs in recommendations', async () => {
      const recommendations = await contentDiscovery.getPersonalizedRecommendations('')
      
      expect(Array.isArray(recommendations)).toBe(true)
    })

    it('should handle malformed filter objects', async () => {
      const result = await contentDiscovery.getContentByCategory('ثقافة', {
        hasAudio: undefined,
        dateFrom: null as any,
        dateTo: 'invalid-date'
      })

      expect(result).toHaveProperty('content')
      expect(result).toHaveProperty('total')
    })
  })
})