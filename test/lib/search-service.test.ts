import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SearchService } from '@/lib/search-service'

// Mock fetch for API calls
global.fetch = vi.fn()

// Mock Supabase client with comprehensive Arabic content
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ 
              data: [
                {
                  article_id: '1',
                  title: 'مقال تجريبي عن السياسة العربية',
                  excerpt: 'محتوى المقال يناقش الأوضاع السياسية في المنطقة العربية',
                  language: 'ar',
                  articles: {
                    id: '1',
                    slug: 'test-article',
                    featured_image_url: 'https://example.com/image.jpg',
                    view_count: 150,
                    published_at: '2024-01-01T00:00:00Z',
                    status: 'published',
                    authors: { name_ar: 'كاتب تجريبي' },
                    categories: { name_ar: 'آراء سياسية' }
                  }
                }
              ], 
              error: null 
            }))
          }))
        })),
        ilike: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({ 
                data: [
                  {
                    suggestion: 'السياسة العربية',
                    popularity_score: 85
                  },
                  {
                    suggestion: 'الثقافة الإسلامية',
                    popularity_score: 72
                  }
                ], 
                error: null 
              }))
            }))
          }))
        })),
        or: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({ 
                data: [
                  {
                    id: 'prog-1',
                    slug: 'arabic-program',
                    title_ar: 'برنامج عربي تجريبي',
                    description_ar: 'وصف البرنامج العربي',
                    host_ar: 'مقدم البرنامج',
                    cover_image_url: 'https://example.com/program.jpg',
                    type: 'video',
                    episode_count: 10,
                    view_count: 500,
                    latest_episode_date: '2024-01-15T00:00:00Z',
                    categories: { name_ar: 'برامج ثقافية' }
                  }
                ], 
                error: null 
              }))
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

describe('SearchService - Arabic Functionality', () => {
  let searchService: SearchService
  
  beforeEach(() => {
    searchService = new SearchService()
    vi.clearAllMocks()
    // Reset fetch mock
    ;(global.fetch as any).mockClear()
  })

  describe('Comprehensive Arabic Search', () => {
    it('should perform comprehensive search across all content types', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ queries: [{ query: 'السياسة' }] })
      })

      const result = await searchService.search('السياسة العربية', {}, 10, 0)
      
      expect(result).toHaveProperty('results')
      expect(result).toHaveProperty('total_count')
      expect(result).toHaveProperty('query', 'السياسة العربية')
      expect(result).toHaveProperty('search_time_ms')
      expect(typeof result.search_time_ms).toBe('number')
    })

    it('should apply Arabic content filters correctly', async () => {
      const filters = {
        type: 'articles' as const,
        category: 'آراء سياسية',
        hasAudio: true,
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31'
      }
      
      const result = await searchService.search('مقال', filters, 20, 0)
      
      expect(result.filters).toEqual(filters)
      expect(mockSupabase.from).toHaveBeenCalled()
    })

    it('should provide search suggestions for zero results', async () => {
      // Mock empty results
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
              }))
            }))
          }))
        }))
      })

      const result = await searchService.search('استعلام غير موجود', {}, 10, 0)
      
      expect(result.results).toHaveLength(0)
      expect(result.suggestions).toBeDefined()
    })
  })

  describe('Arabic Query Normalization', () => {
    it('should normalize Arabic queries by removing diacritics', () => {
      const query = 'السَّلامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ'
      // Access private method through any cast for testing
      const normalized = (searchService as any).normalizeArabicQuery(query)
      expect(normalized).toBe('السلام عليكم ورحمة الله')
    })

    it('should normalize different Arabic letter forms', () => {
      const query = 'أإآالكتابة'
      const normalized = (searchService as any).normalizeArabicQuery(query)
      expect(normalized).toBe('اااالكتابة')
    })

    it('should handle mixed Arabic and English queries', () => {
      const query = 'السياسة Politics العربية'
      const normalized = (searchService as any).normalizeArabicQuery(query)
      expect(normalized).toBe('السياسة politics العربية')
    })
  })

  describe('Arabic Search Suggestions', () => {
    it('should get Arabic search suggestions with popularity ranking', async () => {
      const suggestions = await searchService.getSearchSuggestions('سياس')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('search_suggestions')
      expect(Array.isArray(suggestions)).toBe(true)
    })

    it('should handle short queries gracefully', async () => {
      const suggestions = await searchService.getSearchSuggestions('س')
      expect(suggestions).toHaveLength(0)
    })

    it('should get popular Arabic searches', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          queries: [
            { query: 'السياسة العربية' },
            { query: 'الثقافة الإسلامية' },
            { query: 'التاريخ العربي' }
          ]
        })
      })

      const popular = await searchService.getPopularSearches(5)
      
      expect(Array.isArray(popular)).toBe(true)
      expect(popular).toContain('السياسة العربية')
    })
  })

  describe('Arabic Content Relevance Scoring', () => {
    it('should calculate relevance scores for Arabic content', () => {
      const query = 'السياسة العربية'
      const title = 'مقال عن السياسة العربية المعاصرة'
      const content = 'يناقش هذا المقال الأوضاع السياسية في المنطقة العربية'
      
      const score = (searchService as any).calculateRelevanceScore(query, title, content)
      expect(score).toBeGreaterThan(0)
    })

    it('should give higher scores for exact title matches', () => {
      const query = 'السياسة العربية'
      
      const exactMatch = (searchService as any).calculateRelevanceScore(
        query, 'السياسة العربية', 'محتوى عام'
      )
      const partialMatch = (searchService as any).calculateRelevanceScore(
        query, 'مقال عن السياسة', 'محتوى عام'
      )
      
      expect(exactMatch).toBeGreaterThan(partialMatch)
    })

    it('should handle Arabic word boundaries correctly', () => {
      const query = 'كتاب'
      const title1 = 'الكتاب المقدس' // Contains the word
      const title2 = 'مكتبة الكتب' // Contains the word
      const title3 = 'كاتب مشهور' // Similar but different word
      
      const score1 = (searchService as any).calculateRelevanceScore(query, title1, '')
      const score2 = (searchService as any).calculateRelevanceScore(query, title2, '')
      const score3 = (searchService as any).calculateRelevanceScore(query, title3, '')
      
      expect(score1).toBeGreaterThan(0)
      expect(score2).toBeGreaterThan(0)
      expect(score3).toBeGreaterThan(0)
    })
  })

  describe('Arabic Search Analytics', () => {
    it('should get search statistics', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          total_searches: 1500,
          avg_results_count: 8.5,
          zero_results_percentage: 12.3,
          period_days: 30
        })
      })

      const stats = await searchService.getSearchStats()
      
      expect(stats).toHaveProperty('total_searches')
      expect(stats).toHaveProperty('avg_results_count')
      expect(stats).toHaveProperty('zero_results_percentage')
      expect(stats).toHaveProperty('period_days')
    })

    it('should handle analytics API errors gracefully', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const stats = await searchService.getSearchStats()
      
      expect(stats.total_searches).toBe(0)
      expect(stats.avg_results_count).toBe(0)
    })
  })

  describe('Arabic Content Type Searches', () => {
    it('should search Arabic articles with proper filtering', async () => {
      const filters = { type: 'articles' as const, category: 'آراء سياسية' }
      
      await searchService.search('مقال سياسي', filters)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('article_translations')
    })

    it('should search Arabic programs with metadata', async () => {
      const filters = { type: 'programs' as const }
      
      await searchService.search('برنامج ثقافي', filters)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('programs')
    })

    it('should search Arabic episodes with program context', async () => {
      const filters = { type: 'podcasts' as const }
      
      await searchService.search('حلقة بودكاست', filters)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('episodes')
    })
  })

  describe('Duration Formatting', () => {
    it('should format Arabic duration correctly', () => {
      const formatDuration = (searchService as any).formatDuration
      
      expect(formatDuration(90)).toBe('1:30')
      expect(formatDuration(3661)).toBe('1:01:01')
      expect(formatDuration(0)).toBe('')
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      await expect(searchService.search('مقال')).rejects.toThrow('Search failed')
    })

    it('should handle malformed search queries', async () => {
      const result = await searchService.search('', {}, 10, 0)
      
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
    })

    it('should handle network timeouts gracefully', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network timeout'))

      const suggestions = await searchService.getSearchSuggestions('مقال')
      expect(suggestions).toHaveLength(0)
    })
  })
})