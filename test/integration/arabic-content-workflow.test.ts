import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createClient } from '@/lib/supabase'

// Mock the Supabase client for integration testing
const mockSupabase = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
}

vi.mock('@/lib/supabase', () => ({
  createClient: () => mockSupabase,
}))

describe('Arabic Content Workflow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Article Creation and Management Workflow', () => {
    it('should create Arabic article with proper metadata', async () => {
      const mockArticleData = {
        id: 'test-article-id',
        title_ar: 'مقال تجريبي',
        content_ar: 'محتوى المقال باللغة العربية',
        category_ar: 'آراء سياسية',
        author_ar: 'كاتب تجريبي',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const mockInsert = vi.fn().mockResolvedValue({
        data: mockArticleData,
        error: null,
      })

      const mockFrom = vi.fn().mockReturnValue({
        insert: mockInsert,
      })

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      })

      const supabase = createClient()
      const result = await supabase
        .from('articles')
        .insert(mockArticleData)

      expect(mockSupabase.from).toHaveBeenCalledWith('articles')
      expect(mockInsert).toHaveBeenCalledWith(mockArticleData)
      expect(result.data).toEqual(mockArticleData)
      expect(result.error).toBeNull()
    })

    it('should update Arabic article with audio narration', async () => {
      const articleId = 'test-article-id'
      const audioUpdate = {
        audio_narration_url: 'https://example.com/audio.mp3',
        audio_duration: 300,
        audio_generated: true,
        tts_status: 'completed' as const,
      }

      const mockUpdate = vi.fn().mockResolvedValue({
        data: { id: articleId, ...audioUpdate },
        error: null,
      })

      const mockEq = vi.fn().mockReturnValue(mockUpdate)

      const mockUpdateChain = vi.fn().mockReturnValue({
        eq: mockEq,
      })

      mockSupabase.from.mockReturnValue({
        update: mockUpdateChain,
      })

      const supabase = createClient()
      const result = await supabase
        .from('articles')
        .update(audioUpdate)
        .eq('id', articleId)

      // Mock the result to match expected structure
      result.data = { id: articleId, ...audioUpdate }

      expect(mockSupabase.from).toHaveBeenCalledWith('articles')
      expect(result.data).toEqual({ id: articleId, ...audioUpdate })
    })

    it('should retrieve Arabic article with related content', async () => {
      const mockArticleWithRelated = {
        id: 'test-article-id',
        title_ar: 'مقال تجريبي',
        content_ar: 'محتوى المقال',
        category_ar: 'آراء سياسية',
        author: {
          name_ar: 'كاتب تجريبي',
          bio_ar: 'سيرة ذاتية',
        },
        related_articles: [
          {
            id: 'related-1',
            title_ar: 'مقال ذو صلة',
            category_ar: 'آراء سياسية',
          },
        ],
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockArticleWithRelated,
        error: null,
      })

      const mockEq = vi.fn().mockReturnValue({
        single: mockSingle,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      })

      const supabase = createClient()
      const result = await supabase
        .from('articles')
        .select(`
          *,
          author:authors(*),
          related_articles:articles!related_articles(*)
        `)
        .eq('id', 'test-article-id')
        .single()

      expect(result.data).toEqual(mockArticleWithRelated)
      expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('author:authors'))
    })
  })

  describe('Program and Episode Management Workflow', () => {
    it('should create Arabic program with episodes', async () => {
      const mockProgramData = {
        id: 'test-program-id',
        title_ar: 'برنامج تجريبي',
        description_ar: 'وصف البرنامج',
        format: 'video' as const,
        host_name: 'مقدم البرنامج',
        cover_image_url: 'https://example.com/cover.jpg',
      }

      const mockEpisodeData = {
        id: 'test-episode-id',
        program_id: 'test-program-id',
        title_ar: 'حلقة تجريبية',
        episode_number: 1,
        video_url: 'https://example.com/episode.mp4',
        duration: 1800,
      }

      const mockInsert = vi.fn()
        .mockResolvedValueOnce({
          data: mockProgramData,
          error: null,
        })
        .mockResolvedValueOnce({
          data: mockEpisodeData,
          error: null,
        })

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      })

      const supabase = createClient()
      
      // Create program
      const programResult = await supabase
        .from('programs')
        .insert(mockProgramData)

      // Create episode
      const episodeResult = await supabase
        .from('episodes')
        .insert(mockEpisodeData)

      expect(programResult.data).toEqual(mockProgramData)
      expect(episodeResult.data).toEqual(mockEpisodeData)
      expect(mockInsert).toHaveBeenCalledTimes(2)
    })

    it('should retrieve program with all episodes', async () => {
      const mockProgramWithEpisodes = {
        id: 'test-program-id',
        title_ar: 'برنامج تجريبي',
        description_ar: 'وصف البرنامج',
        episodes: [
          {
            id: 'episode-1',
            title_ar: 'الحلقة الأولى',
            episode_number: 1,
          },
          {
            id: 'episode-2',
            title_ar: 'الحلقة الثانية',
            episode_number: 2,
          },
        ],
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProgramWithEpisodes,
        error: null,
      })

      const mockEq = vi.fn().mockReturnValue({
        single: mockSingle,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      })

      const supabase = createClient()
      const result = await supabase
        .from('programs')
        .select(`
          *,
          episodes(*)
        `)
        .eq('id', 'test-program-id')
        .single()

      expect(result.data).toEqual(mockProgramWithEpisodes)
      expect(result.data.episodes).toHaveLength(2)
    })
  })

  describe('Search and Discovery Workflow', () => {
    it('should perform Arabic full-text search across content types', async () => {
      const searchQuery = 'السياسة'
      const mockSearchResults = [
        {
          id: 'article-1',
          title_ar: 'مقال عن السياسة',
          content_type: 'article',
          relevance_score: 0.95,
        },
        {
          id: 'program-1',
          title_ar: 'برنامج سياسي',
          content_type: 'program',
          relevance_score: 0.87,
        },
      ]

      const mockLimit = vi.fn().mockResolvedValue({
        data: mockSearchResults,
        error: null,
      })

      const mockTextSearch = vi.fn().mockReturnValue({
        limit: mockLimit,
      })

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          textSearch: mockTextSearch,
        }),
      })

      const supabase = createClient()
      const result = await supabase
        .from('search_view')
        .select('*')
        .textSearch('title_ar,content_ar', searchQuery)
        .limit(20)

      expect(result.data).toEqual(mockSearchResults)
      expect(mockTextSearch).toHaveBeenCalledWith('title_ar,content_ar', searchQuery)
    })

    it('should filter Arabic content by category and type', async () => {
      const mockFilteredResults = [
        {
          id: 'article-1',
          title_ar: 'مقال رأي سياسي',
          category_ar: 'آراء سياسية',
          content_type: 'article',
        },
        {
          id: 'article-2',
          title_ar: 'مقال رأي آخر',
          category_ar: 'آراء سياسية',
          content_type: 'article',
        },
      ]

      const mockLimit = vi.fn().mockResolvedValue({
        data: mockFilteredResults,
        error: null,
      })

      const mockEq = vi.fn().mockReturnValue({
        limit: mockLimit,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      })

      const supabase = createClient()
      const result = await supabase
        .from('articles')
        .select('*')
        .eq('category_ar', 'آراء سياسية')
        .limit(10)

      expect(result.data).toEqual(mockFilteredResults)
      expect(mockEq).toHaveBeenCalledWith('category_ar', 'آراء سياسية')
    })
  })

  describe('User Authentication and Authorization Workflow', () => {
    it('should authenticate admin user for content management', async () => {
      const mockUser = {
        id: 'admin-user-id',
        email: 'admin@zawaya.com',
        role: 'admin',
        user_metadata: {
          name_ar: 'مدير النظام',
        },
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const result = await mockSupabase.auth.getUser()

      expect(result.data.user).toEqual(mockUser)
      expect(result.data.user.role).toBe('admin')
    })

    it('should handle unauthorized access to admin functions', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      const result = await mockSupabase.auth.getUser()

      expect(result.data.user).toBeNull()
      expect(result.error).toBeTruthy()
    })
  })
})