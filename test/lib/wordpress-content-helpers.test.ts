/**
 * Unit Tests for WordPress Content Helpers
 * Tests article, program, episode, and author helper functions with mock responses
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  ArticleHelpers, 
  ProgramHelpers, 
  EpisodeHelpers, 
  AuthorHelpers,
  TaxonomyHelpers
} from '@/lib/wordpress-content-helpers'
import { wpClient } from '@/lib/wordpress'

// Mock the WordPress client
vi.mock('@/lib/wordpress', () => ({
  wpClient: {
    listPosts: vi.fn(),
    getPostBySlug: vi.fn(),
    getFeaturedPosts: vi.fn(),
    searchPosts: vi.fn(),
    wpGet: vi.fn()
  }
}))

// Mock transformers
vi.mock('@/lib/wordpress-transformers', () => ({
  createFallbackPost: vi.fn(() => ({
    id: 999,
    slug: 'fallback-post',
    title: 'Fallback Post',
    content: 'Fallback content',
    excerpt: 'Fallback excerpt',
    zawaya_meta: {
      title_arabic: 'مقال احتياطي',
      is_featured: false
    }
  }))
}))

describe('ArticleHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getArticles', () => {
    it('should fetch articles with default parameters', async () => {
      const mockPosts = [
        {
          id: 1,
          slug: 'test-article',
          title: 'Test Article',
          zawaya_meta: { is_featured: false }
        }
      ]
      
      vi.mocked(wpClient.listPosts).mockResolvedValueOnce(mockPosts as any)

      const result = await ArticleHelpers.getArticles()

      expect(wpClient.listPosts).toHaveBeenCalledWith({
        per_page: 10,
        page: 1,
        status: 'publish',
        orderby: 'date',
        order: 'desc',
        _embed: true
      })
      expect(result).toEqual(mockPosts)
    })

    it('should apply featured filter', async () => {
      const mockPosts = [
        { id: 1, zawaya_meta: { is_featured: true } },
        { id: 2, zawaya_meta: { is_featured: false } },
        { id: 3, zawaya_meta: { is_featured: true } }
      ]
      
      vi.mocked(wpClient.listPosts).mockResolvedValueOnce(mockPosts as any)

      const result = await ArticleHelpers.getArticles({ featured: true })

      expect(result).toHaveLength(2)
      expect(result.every(post => post.zawaya_meta.is_featured)).toBe(true)
    })

    it('should apply breaking news filter', async () => {
      const mockPosts = [
        { id: 1, zawaya_meta: { is_breaking_news: true } },
        { id: 2, zawaya_meta: { is_breaking_news: false } },
        { id: 3, zawaya_meta: { is_breaking_news: true } }
      ]
      
      vi.mocked(wpClient.listPosts).mockResolvedValueOnce(mockPosts as any)

      const result = await ArticleHelpers.getArticles({ breaking: true })

      expect(result).toHaveLength(2)
      expect(result.every(post => post.zawaya_meta.is_breaking_news)).toBe(true)
    })

    it('should handle errors gracefully', async () => {
      vi.mocked(wpClient.listPosts).mockRejectedValueOnce(new Error('Network error'))

      const result = await ArticleHelpers.getArticles()

      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('fallback-post')
    })
  })

  describe('getArticleBySlug', () => {
    it('should fetch article by slug', async () => {
      const mockPost = {
        id: 1,
        slug: 'test-article',
        title: 'Test Article'
      }
      
      vi.mocked(wpClient.getPostBySlug).mockResolvedValueOnce(mockPost as any)

      const result = await ArticleHelpers.getArticleBySlug('test-article')

      expect(wpClient.getPostBySlug).toHaveBeenCalledWith('test-article', true)
      expect(result).toEqual(mockPost)
    })

    it('should return null for non-existent article', async () => {
      vi.mocked(wpClient.getPostBySlug).mockResolvedValueOnce(null)

      const result = await ArticleHelpers.getArticleBySlug('non-existent')

      expect(result).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      vi.mocked(wpClient.getPostBySlug).mockRejectedValueOnce(new Error('Network error'))

      const result = await ArticleHelpers.getArticleBySlug('test-article')

      expect(result).toBeNull()
    })
  })

  describe('getFeaturedArticles', () => {
    it('should fetch featured articles', async () => {
      const mockPosts = [
        { id: 1, zawaya_meta: { is_featured: true } },
        { id: 2, zawaya_meta: { is_featured: true } }
      ]
      
      vi.mocked(wpClient.getFeaturedPosts).mockResolvedValueOnce(mockPosts as any)

      const result = await ArticleHelpers.getFeaturedArticles(5)

      expect(wpClient.getFeaturedPosts).toHaveBeenCalledWith(5)
      expect(result).toEqual(mockPosts)
    })
  })

  describe('getBreakingNews', () => {
    it('should fetch breaking news articles', async () => {
      const mockPosts = [
        { id: 1, zawaya_meta: { is_breaking_news: true } }
      ]
      
      vi.mocked(wpClient.listPosts).mockResolvedValueOnce(mockPosts as any)

      const result = await ArticleHelpers.getBreakingNews(3)

      expect(wpClient.listPosts).toHaveBeenCalledWith({
        per_page: 3,
        page: 1,
        status: 'publish',
        orderby: 'date',
        order: 'desc',
        _embed: true
      })
      
      // Should filter for breaking news
      expect(result.every(post => post.zawaya_meta.is_breaking_news)).toBe(true)
    })
  })

  describe('searchArticles', () => {
    it('should search articles with query', async () => {
      const mockPosts = [
        { id: 1, title: 'Search Result' }
      ]
      
      vi.mocked(wpClient.searchPosts).mockResolvedValueOnce(mockPosts as any)

      const result = await ArticleHelpers.searchArticles('test query', 10)

      expect(wpClient.searchPosts).toHaveBeenCalledWith('test query', 10)
      expect(result).toEqual(mockPosts)
    })

    it('should return empty array for empty query', async () => {
      const result = await ArticleHelpers.searchArticles('', 10)

      expect(result).toEqual([])
      expect(wpClient.searchPosts).not.toHaveBeenCalled()
    })

    it('should return empty array for whitespace query', async () => {
      const result = await ArticleHelpers.searchArticles('   ', 10)

      expect(result).toEqual([])
      expect(wpClient.searchPosts).not.toHaveBeenCalled()
    })
  })

  describe('getRelatedArticles', () => {
    it('should get related articles by category', async () => {
      const currentArticle = {
        id: 1,
        categories: [5, 10],
        zawaya_meta: {}
      }

      const relatedPosts = [
        { id: 2, categories: [5] },
        { id: 3, categories: [5] },
        { id: 1, categories: [5] }, // Should be filtered out
        { id: 4, categories: [5] }
      ]
      
      vi.mocked(wpClient.listPosts).mockResolvedValueOnce(relatedPosts as any)

      const result = await ArticleHelpers.getRelatedArticles(currentArticle as any, 4)

      expect(result).toHaveLength(3) // Excludes the current article
      expect(result.every(post => post.id !== 1)).toBe(true)
    })

    it('should handle articles with no categories', async () => {
      const currentArticle = {
        id: 1,
        categories: [],
        zawaya_meta: {}
      }

      const result = await ArticleHelpers.getRelatedArticles(currentArticle as any, 4)

      expect(result).toEqual([])
    })
  })

  describe('getArticlesWithAudio', () => {
    it('should filter articles with audio narration', async () => {
      const mockPosts = [
        { id: 1, zawaya_meta: { audio_narration_url: 'http://example.com/audio1.mp3' } },
        { id: 2, zawaya_meta: { audio_narration_url: null } },
        { id: 3, zawaya_meta: { audio_narration_url: 'http://example.com/audio2.mp3' } },
        { id: 4, zawaya_meta: {} }
      ]
      
      vi.mocked(wpClient.listPosts).mockResolvedValueOnce(mockPosts as any)

      const result = await ArticleHelpers.getArticlesWithAudio(10)

      expect(result).toHaveLength(2)
      expect(result.every(article => article.zawaya_meta.audio_narration_url)).toBe(true)
    })
  })
})

describe('ProgramHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPrograms', () => {
    it('should fetch programs with default parameters', async () => {
      const mockPrograms = [
        { id: 1, title: 'Test Program', zawaya_meta: { program_type: 'video' } }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockPrograms)

      const result = await ProgramHelpers.getPrograms()

      expect(wpClient.wpGet).toHaveBeenCalledWith('/program', {
        per_page: 10,
        page: 1,
        orderby: 'date',
        order: 'desc',
        _embed: true
      }, 'programs')
      expect(result).toEqual(mockPrograms)
    })

    it('should filter by program type', async () => {
      const mockPrograms = [
        { id: 1, zawaya_meta: { program_type: 'video' } },
        { id: 2, zawaya_meta: { program_type: 'audio' } },
        { id: 3, zawaya_meta: { program_type: 'video' } }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockPrograms)

      const result = await ProgramHelpers.getPrograms({ program_type: 'video' })

      expect(result).toHaveLength(2)
      expect(result.every(program => program.zawaya_meta.program_type === 'video')).toBe(true)
    })
  })

  describe('getProgramBySlug', () => {
    it('should fetch program by slug', async () => {
      const mockPrograms = [
        { id: 1, slug: 'test-program', title: 'Test Program' }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockPrograms)

      const result = await ProgramHelpers.getProgramBySlug('test-program')

      expect(wpClient.wpGet).toHaveBeenCalledWith('/program', {
        slug: 'test-program',
        _embed: true
      }, 'programs')
      expect(result).toEqual(mockPrograms[0])
    })

    it('should return null for non-existent program', async () => {
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce([])

      const result = await ProgramHelpers.getProgramBySlug('non-existent')

      expect(result).toBeNull()
    })
  })
})

describe('EpisodeHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getEpisodes', () => {
    it('should fetch episodes with default parameters', async () => {
      const mockEpisodes = [
        { id: 1, title: 'Test Episode', zawaya_meta: { program_reference: '1' } }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockEpisodes)

      const result = await EpisodeHelpers.getEpisodes()

      expect(wpClient.wpGet).toHaveBeenCalledWith('/episode', {
        per_page: 10,
        page: 1,
        orderby: 'date',
        order: 'desc',
        _embed: true
      }, 'episodes')
      expect(result).toEqual(mockEpisodes)
    })

    it('should filter by program ID', async () => {
      const mockEpisodes = [
        { id: 1, zawaya_meta: { program_reference: '1' } },
        { id: 2, zawaya_meta: { program_reference: '2' } },
        { id: 3, zawaya_meta: { program_reference: '1' } }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockEpisodes)

      const result = await EpisodeHelpers.getEpisodes({ program_id: 1 })

      expect(result).toHaveLength(2)
      expect(result.every(episode => episode.zawaya_meta.program_reference === '1')).toBe(true)
    })

    it('should filter by season number', async () => {
      const mockEpisodes = [
        { id: 1, zawaya_meta: { season_number: 1 } },
        { id: 2, zawaya_meta: { season_number: 2 } },
        { id: 3, zawaya_meta: { season_number: 1 } }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockEpisodes)

      const result = await EpisodeHelpers.getEpisodes({ season: 1 })

      expect(result).toHaveLength(2)
      expect(result.every(episode => episode.zawaya_meta.season_number === 1)).toBe(true)
    })
  })

  describe('getEpisodesByProgram', () => {
    it('should fetch episodes for specific program', async () => {
      const mockEpisodes = [
        { id: 1, zawaya_meta: { program_reference: '5' } }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockEpisodes)

      const result = await EpisodeHelpers.getEpisodesByProgram(5, 10)

      expect(wpClient.wpGet).toHaveBeenCalledWith('/episode', {
        per_page: 10,
        page: 1,
        orderby: 'episode_number',
        order: 'asc',
        _embed: true
      }, 'episodes')
    })
  })
})

describe('AuthorHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAuthors', () => {
    it('should fetch authors', async () => {
      const mockAuthors = [
        { id: 1, name: 'Test Author', slug: 'test-author' }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockAuthors)

      const result = await AuthorHelpers.getAuthors(10)

      expect(wpClient.wpGet).toHaveBeenCalledWith('/users', {
        per_page: 10,
        _embed: true
      }, 'authors')
      expect(result).toEqual(mockAuthors)
    })
  })

  describe('getAuthorById', () => {
    it('should fetch author by ID', async () => {
      const mockAuthor = { id: 1, name: 'Test Author' }
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockAuthor)

      const result = await AuthorHelpers.getAuthorById(1)

      expect(wpClient.wpGet).toHaveBeenCalledWith('/users/1', {
        _embed: true
      }, 'authors')
      expect(result).toEqual(mockAuthor)
    })
  })

  describe('getAuthorBySlug', () => {
    it('should fetch author by slug', async () => {
      const mockAuthors = [
        { id: 1, name: 'Test Author', slug: 'test-author' }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockAuthors)

      const result = await AuthorHelpers.getAuthorBySlug('test-author')

      expect(wpClient.wpGet).toHaveBeenCalledWith('/users', {
        slug: 'test-author',
        _embed: true
      }, 'authors')
      expect(result).toEqual(mockAuthors[0])
    })

    it('should return null for non-existent author', async () => {
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce([])

      const result = await AuthorHelpers.getAuthorBySlug('non-existent')

      expect(result).toBeNull()
    })
  })
})

describe('TaxonomyHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCategories', () => {
    it('should fetch categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Test Category', slug: 'test-category' }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockCategories)

      const result = await TaxonomyHelpers.getCategories(50)

      expect(wpClient.wpGet).toHaveBeenCalledWith('/categories', {
        per_page: 50,
        orderby: 'name',
        order: 'asc'
      }, 'navigation')
      expect(result).toEqual(mockCategories)
    })
  })

  describe('getCategoryById', () => {
    it('should fetch category by ID', async () => {
      const mockCategory = { id: 1, name: 'Test Category' }
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockCategory)

      const result = await TaxonomyHelpers.getCategoryById(1)

      expect(wpClient.wpGet).toHaveBeenCalledWith('/categories/1', {}, 'navigation')
      expect(result).toEqual(mockCategory)
    })
  })

  describe('getTags', () => {
    it('should fetch tags', async () => {
      const mockTags = [
        { id: 1, name: 'Test Tag', slug: 'test-tag' }
      ]
      
      vi.mocked(wpClient.wpGet).mockResolvedValueOnce(mockTags)

      const result = await TaxonomyHelpers.getTags(50)

      expect(wpClient.wpGet).toHaveBeenCalledWith('/tags', {
        per_page: 50,
        orderby: 'name',
        order: 'asc'
      }, 'navigation')
      expect(result).toEqual(mockTags)
    })
  })
})