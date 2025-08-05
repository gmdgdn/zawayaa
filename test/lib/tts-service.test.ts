import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TTSService } from '@/lib/tts-service'

// Mock fetch for API calls
global.fetch = vi.fn()

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
    })),
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ 
          data: { 
            id: '1', 
            status: 'completed',
            audio_url: 'https://example.com/audio.mp3',
            duration: 120
          }, 
          error: null 
        }))
      }))
    }))
  }))
}

vi.mock('@/lib/supabase', () => ({
  createClient: () => mockSupabase
}))

describe('TTSService - Arabic Audio Processing', () => {
  let ttsService: TTSService
  
  beforeEach(() => {
    ttsService = new TTSService()
    vi.clearAllMocks()
  })

  describe('Arabic Text Processing', () => {
    it('should clean Arabic text for TTS processing', () => {
      const arabicText = 'هذا نص عربي مع علامات ترقيم، وأرقام 123 ورموز خاصة!'
      const cleaned = ttsService.cleanArabicTextForTTS(arabicText)
      
      expect(cleaned).toBe('هذا نص عربي مع علامات ترقيم وأرقام مائة وثلاثة وعشرون ورموز خاصة')
    })

    it('should handle Arabic diacritics in TTS text', () => {
      const textWithDiacritics = 'الكِتابُ المُقَدَّسُ'
      const cleaned = ttsService.cleanArabicTextForTTS(textWithDiacritics)
      
      expect(cleaned).toBe('الكتاب المقدس')
    })

    it('should convert Arabic numerals to words', () => {
      const textWithNumbers = 'في عام 2024 كان هناك 15 مقالاً'
      const cleaned = ttsService.cleanArabicTextForTTS(textWithNumbers)
      
      expect(cleaned).toContain('ألفان وأربعة وعشرون')
      expect(cleaned).toContain('خمسة عشر')
    })
  })

  describe('Arabic Voice Selection', () => {
    it('should select appropriate Arabic voice for male narrator', () => {
      const voice = ttsService.selectArabicVoice('male')
      
      expect(voice).toHaveProperty('voice_id')
      expect(voice).toHaveProperty('language', 'ar')
      expect(voice).toHaveProperty('gender', 'male')
    })

    it('should select appropriate Arabic voice for female narrator', () => {
      const voice = ttsService.selectArabicVoice('female')
      
      expect(voice).toHaveProperty('voice_id')
      expect(voice).toHaveProperty('language', 'ar')
      expect(voice).toHaveProperty('gender', 'female')
    })

    it('should default to male voice for invalid gender', () => {
      const voice = ttsService.selectArabicVoice('invalid' as any)
      
      expect(voice).toHaveProperty('gender', 'male')
    })
  })

  describe('Audio Generation', () => {
    it('should generate Arabic audio successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          audio_url: 'https://example.com/generated-audio.mp3',
          duration: 180
        })
      }
      
      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await ttsService.generateArabicAudio(
        'هذا نص عربي للتحويل إلى صوت',
        'article-123'
      )

      expect(result).toHaveProperty('audio_url')
      expect(result).toHaveProperty('duration')
      expect(mockSupabase.from).toHaveBeenCalledWith('tts_generations')
    })

    it('should handle TTS API errors gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }
      
      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await expect(
        ttsService.generateArabicAudio('نص عربي', 'article-123')
      ).rejects.toThrow('TTS generation failed')
    })

    it('should track generation status in database', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          audio_url: 'https://example.com/audio.mp3',
          duration: 120
        })
      }
      
      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await ttsService.generateArabicAudio('نص عربي', 'article-123')

      expect(mockSupabase.from).toHaveBeenCalledWith('tts_generations')
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          article_id: 'article-123',
          status: 'processing'
        })
      )
    })
  })

  describe('Audio File Management', () => {
    it('should validate Arabic audio file uploads', async () => {
      const validFile = new File(['audio data'], 'arabic-audio.mp3', {
        type: 'audio/mpeg'
      })

      const isValid = await ttsService.validateAudioFile(validFile)
      expect(isValid).toBe(true)
    })

    it('should reject invalid audio file types', async () => {
      const invalidFile = new File(['text data'], 'not-audio.txt', {
        type: 'text/plain'
      })

      const isValid = await ttsService.validateAudioFile(invalidFile)
      expect(isValid).toBe(false)
    })

    it('should extract audio metadata correctly', async () => {
      const audioFile = new File(['audio data'], 'test.mp3', {
        type: 'audio/mpeg'
      })

      // Mock audio element
      const mockAudio = {
        duration: 180,
        addEventListener: vi.fn((event, callback) => {
          if (event === 'loadedmetadata') {
            setTimeout(callback, 0)
          }
        }),
        src: '',
        load: vi.fn()
      }

      global.Audio = vi.fn(() => mockAudio) as any

      const metadata = await ttsService.extractAudioMetadata(audioFile)
      
      expect(metadata).toHaveProperty('duration', 180)
      expect(metadata).toHaveProperty('size')
    })
  })

  describe('Generation Status Tracking', () => {
    it('should get generation status from database', async () => {
      const status = await ttsService.getGenerationStatus('article-123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('tts_generations')
      expect(status).toHaveProperty('status', 'completed')
    })

    it('should update generation status', async () => {
      await ttsService.updateGenerationStatus('gen-123', 'completed', {
        audio_url: 'https://example.com/audio.mp3',
        duration: 120
      })

      expect(mockSupabase.from).toHaveBeenCalledWith('tts_generations')
      expect(mockSupabase.from().update).toHaveBeenCalled()
    })

    it('should handle missing generation records', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        }))
      })

      const status = await ttsService.getGenerationStatus('non-existent')
      expect(status).toBeNull()
    })
  })

  describe('Error Recovery', () => {
    it('should retry failed generations', async () => {
      let callCount = 0
      ;(global.fetch as any).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ ok: false, status: 500 })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            audio_url: 'https://example.com/audio.mp3',
            duration: 120
          })
        })
      })

      const result = await ttsService.generateArabicAudio(
        'نص عربي',
        'article-123',
        { maxRetries: 2 }
      )

      expect(result).toHaveProperty('audio_url')
      expect(callCount).toBe(2)
    })

    it('should fail after max retries', async () => {
      ;(global.fetch as any).mockResolvedValue({ ok: false, status: 500 })

      await expect(
        ttsService.generateArabicAudio(
          'نص عربي',
          'article-123',
          { maxRetries: 1 }
        )
      ).rejects.toThrow()
    })
  })
})