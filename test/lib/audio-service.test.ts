import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AudioService } from '@/lib/audio-service'

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ 
          data: { 
            id: '1',
            title_ar: 'مقال صوتي',
            audio_url: 'https://example.com/audio.mp3',
            audio_duration: 180
          }, 
          error: null 
        })),
        limit: vi.fn(() => Promise.resolve({ 
          data: [
            {
              id: '1',
              title_ar: 'برنامج صوتي',
              audio_url: 'https://example.com/episode1.mp3',
              duration: 1800
            }
          ], 
          error: null 
        }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }))
}

vi.mock('@/lib/supabase', () => ({
  createClient: () => mockSupabase
}))

describe('AudioService - Arabic Audio Management', () => {
  let audioService: AudioService
  
  beforeEach(() => {
    audioService = new AudioService()
    vi.clearAllMocks()
  })

  describe('Arabic Audio Narration Generation', () => {
    it('should generate Arabic audio narration successfully', async () => {
      // Mock TTS service response
      vi.doMock('@/lib/tts-service', () => ({
        ttsService: {
          isConfigured: () => true,
          generateArabicAudio: vi.fn().mockResolvedValue({
            audio_url: 'https://example.com/generated-audio.mp3',
            duration: 180,
            character_count: 500
          }),
          getArabicVoices: vi.fn().mockResolvedValue([
            { id: 'ar-female-1', gender: 'female' }
          ])
        }
      }))

      const request = {
        articleId: 'article-123',
        text: 'هذا نص عربي للتحويل إلى صوت',
        language: 'ar' as const,
        voice: 'ar-female-1'
      }

      const audioUrl = await audioService.generateNarration(request)
      
      expect(audioUrl).toBe('https://example.com/generated-audio.mp3')
      expect(mockSupabase.from).toHaveBeenCalledWith('article_translations')
    })

    it('should handle TTS service errors gracefully', async () => {
      vi.doMock('@/lib/tts-service', () => ({
        ttsService: {
          isConfigured: () => false
        }
      }))

      const request = {
        articleId: 'article-123',
        text: 'نص عربي',
        language: 'ar' as const
      }

      await expect(audioService.generateNarration(request)).rejects.toThrow()
      
      // Should update status to failed
      expect(mockSupabase.from).toHaveBeenCalledWith('tts_generations')
    })

    it('should update TTS status correctly during generation', async () => {
      await audioService.updateTTSStatus('article-123', 'processing', 'ar')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('tts_generations')
    })
  })

  describe('Arabic Audio File Upload', () => {
    it('should upload Arabic audio file successfully', async () => {
      const mockFile = new File(['audio data'], 'arabic-audio.mp3', {
        type: 'audio/mpeg'
      })

      // Mock Supabase storage
      const mockStorage = {
        upload: vi.fn().mockResolvedValue({
          data: { path: 'audio/articles/test.mp3' },
          error: null
        }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/test.mp3' }
        })
      }

      mockSupabase.storage = {
        from: vi.fn(() => mockStorage)
      }

      const audioUrl = await audioService.uploadAudioFile(mockFile, 'article-123')
      
      expect(audioUrl).toBe('https://example.com/test.mp3')
      expect(mockStorage.upload).toHaveBeenCalled()
    })

    it('should handle upload errors gracefully', async () => {
      const mockFile = new File(['audio data'], 'test.mp3', {
        type: 'audio/mpeg'
      })

      const mockStorage = {
        upload: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Upload failed' }
        })
      }

      mockSupabase.storage = {
        from: vi.fn(() => mockStorage)
      }

      await expect(audioService.uploadAudioFile(mockFile, 'article-123')).rejects.toThrow()
    })
  })

  describe('Arabic Audio Content Retrieval', () => {
    it('should get Arabic articles with audio', async () => {
      const articles = await audioService.getArticlesWithAudio(10, 'ar')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('article_translations')
      expect(Array.isArray(articles)).toBe(true)
    })

    it('should filter by language correctly', async () => {
      await audioService.getArticlesWithAudio(5, 'en')
      
      const selectCall = mockSupabase.from().select()
      expect(selectCall.eq).toHaveBeenCalledWith('language', 'en')
    })

    it('should handle database errors gracefully', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          not: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve({
                  data: null,
                  error: { message: 'Database error' }
                }))
              }))
            }))
          }))
        }))
      })

      await expect(audioService.getArticlesWithAudio()).rejects.toThrow()
    })
  })

  describe('Audio Retry and Recovery', () => {
    it('should retry failed audio generation', async () => {
      // Mock article data
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                id: 'article-123',
                article_translations: [
                  { content: 'محتوى المقال العربي', language: 'ar' }
                ]
              },
              error: null
            }))
          }))
        }))
      })

      // Mock TTS service
      vi.doMock('@/lib/tts-service', () => ({
        ttsService: {
          isConfigured: () => true,
          generateArabicAudio: vi.fn().mockResolvedValue({
            audio_url: 'https://example.com/retry-audio.mp3'
          }),
          getArabicVoices: vi.fn().mockResolvedValue([
            { id: 'ar-female-1', gender: 'female' }
          ])
        }
      }))

      await audioService.retryAudioGeneration('article-123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('articles')
    })

    it('should handle retry errors gracefully', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Article not found' }
            }))
          }))
        }))
      })

      await expect(audioService.retryAudioGeneration('non-existent')).rejects.toThrow()
    })
  })

  describe('Audio Statistics and Analytics', () => {
    it('should get comprehensive audio statistics', async () => {
      // Mock audio data
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          not: vi.fn(() => Promise.resolve({
            data: [
              { audio_url: 'https://example.com/audio1.mp3' },
              { audio_url: 'https://example.com/audio2.mp3' }
            ],
            error: null
          }))
        }))
      })

      // Mock TTS data
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => Promise.resolve({
          data: [
            { status: 'completed' },
            { status: 'completed' },
            { status: 'pending' },
            { status: 'failed' }
          ],
          error: null
        }))
      })

      const stats = await audioService.getAudioStats()
      
      expect(stats).toHaveProperty('total', 2)
      expect(stats).toHaveProperty('generated', 2)
      expect(stats).toHaveProperty('pending', 1)
      expect(stats).toHaveProperty('failed', 1)
    })

    it('should handle statistics errors gracefully', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          not: vi.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Database error' }
          }))
        }))
      })

      await expect(audioService.getAudioStats()).rejects.toThrow()
    })
  })

  describe('Audio Metadata Processing', () => {
    it('should extract audio metadata correctly', async () => {
      const metadata = await audioService.getAudioMetadata('https://example.com/test.mp3')
      
      expect(metadata).toHaveProperty('duration')
      expect(metadata).toHaveProperty('size')
      expect(metadata).toHaveProperty('format')
      expect(typeof metadata.duration).toBe('number')
    })

    it('should handle metadata extraction errors', async () => {
      const metadata = await audioService.getAudioMetadata('invalid-url')
      
      expect(metadata.duration).toBe(0)
      expect(metadata.size).toBe(0)
      expect(metadata.format).toBe('unknown')
    })
  })

  describe('Audio Progress Tracking', () => {
    it('should save Arabic audio progress', async () => {
      await audioService.saveAudioProgress('article-123', 'user-456', 120, 300)

      expect(mockSupabase.from).toHaveBeenCalledWith('audio_progress')
    })

    it('should get Arabic audio progress', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: { 
                  progress_seconds: 120,
                  total_duration: 300,
                  completed: false
                }, 
                error: null 
              }))
            }))
          }))
        }))
      })

      const progress = await audioService.getAudioProgress('article-123', 'user-456')
      
      expect(progress).toHaveProperty('progress_seconds', 120)
      expect(progress).toHaveProperty('total_duration', 300)
      expect(progress).toHaveProperty('completed', false)
    })

    it('should calculate completion percentage', () => {
      const percentage1 = audioService.calculateCompletionPercentage(120, 300)
      const percentage2 = audioService.calculateCompletionPercentage(300, 300)

      expect(percentage1).toBe(40)
      expect(percentage2).toBe(100)
    })
  })

  describe('Audio Quality Management', () => {
    it('should validate Arabic audio file quality', async () => {
      const audioFile = new File(['audio data'], 'arabic-content.mp3', {
        type: 'audio/mpeg'
      })

      const quality = await audioService.validateAudioQuality(audioFile)
      
      expect(quality).toHaveProperty('isValid')
      expect(quality).toHaveProperty('bitrate')
      expect(quality).toHaveProperty('sampleRate')
    })

    it('should optimize Arabic audio for web delivery', async () => {
      const audioFile = new File(['audio data'], 'high-quality.wav', {
        type: 'audio/wav'
      })

      const optimized = await audioService.optimizeAudioForWeb(audioFile)
      
      expect(optimized).toHaveProperty('file')
      expect(optimized).toHaveProperty('compressionRatio')
      expect(optimized.file.type).toBe('audio/mpeg')
    })

    it('should generate audio waveform data', async () => {
      const audioFile = new File(['audio data'], 'arabic-audio.mp3', {
        type: 'audio/mpeg'
      })

      const waveform = await audioService.generateWaveform(audioFile)
      
      expect(Array.isArray(waveform)).toBe(true)
      expect(waveform.length).toBeGreaterThan(0)
    })
  })

  describe('Playlist Management', () => {
    it('should create Arabic content playlist', async () => {
      const contentIds = ['article-1', 'article-2', 'episode-1']
      const playlist = await audioService.createPlaylist(contentIds, 'قائمة تشغيل عربية')

      expect(playlist).toHaveProperty('name', 'قائمة تشغيل عربية')
      expect(playlist).toHaveProperty('items')
      expect(playlist.items).toHaveLength(3)
    })

    it('should shuffle Arabic playlist', () => {
      const originalOrder = ['item1', 'item2', 'item3', 'item4', 'item5']
      const shuffled = audioService.shufflePlaylist([...originalOrder])

      expect(shuffled).toHaveLength(originalOrder.length)
      expect(shuffled).not.toEqual(originalOrder) // Very unlikely to be the same
    })

    it('should get next item in Arabic playlist', () => {
      const playlist = ['item1', 'item2', 'item3']
      const currentIndex = 1

      const nextItem = audioService.getNextPlaylistItem(playlist, currentIndex)
      expect(nextItem).toBe('item3')

      const lastItem = audioService.getNextPlaylistItem(playlist, 2)
      expect(lastItem).toBe('item1') // Should loop back
    })
  })

  describe('Error Handling', () => {
    it('should handle audio loading errors', async () => {
      const errorHandler = vi.fn()
      
      const playerConfig = {
        url: 'https://invalid-url.com/audio.mp3',
        title: 'مقال صوتي',
        onError: errorHandler
      }

      const player = audioService.createAudioPlayer(playerConfig)
      
      // Simulate audio loading error
      player.simulateError(new Error('Failed to load audio'))
      
      expect(errorHandler).toHaveBeenCalled()
    })

    it('should handle database errors during progress save', async () => {
      mockSupabase.from.mockReturnValueOnce({
        upsert: vi.fn(() => Promise.resolve({ 
          data: null, 
          error: { message: 'Database error' } 
        }))
      })

      const result = await audioService.saveAudioProgress('article-123', 'user-456', 120, 300)
      expect(result).toBe(false)
    })

    it('should handle network errors during audio fetch', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.reject(new Error('Network error')))
          }))
        }))
      })

      const article = await audioService.getArticleWithAudio('article-123')
      expect(article).toBeNull()
    })
  })
})