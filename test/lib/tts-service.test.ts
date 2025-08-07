import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TTSService, type TTSGenerationRequest } from '@/lib/tts-service'

// Mock fetch for API calls
global.fetch = vi.fn()

describe('TTSService', () => {
  let ttsService: TTSService

  beforeEach(() => {
    // Mock environment variables
    process.env.PLAYHT_API_KEY = 'test-api-key'
    process.env.PLAYHT_USER_ID = 'test-user-id'
    ttsService = new TTSService()
    vi.clearAllMocks()
  })

  it('should get available Arabic voices', async () => {
    const mockVoices = [
      { id: 'ar-voice-1', name: 'Fatima', language_code: 'ar-SA', gender: 'female' },
      { id: 'en-voice-1', name: 'John', language_code: 'en-US', gender: 'male' },
    ]
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockVoices),
    })

    const voices = await ttsService.getArabicVoices()
    expect(voices).toHaveLength(1)
    expect(voices[0].id).toBe('ar-voice-1')
  })

  it('should generate Arabic audio successfully', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://example.com/audio.mp3' }),
    })

    const request: TTSGenerationRequest = {
      text: 'مرحبا بكم',
      voice_id: 'ar-voice-1',
      language: 'ar',
    }
    const result = await ttsService.generateArabicAudio(request)
    expect(result.audio_url).toBe('https://example.com/audio.mp3')
    expect(fetch).toHaveBeenCalledWith(
      'https://api.play.ht/api/v2/tts',
      expect.any(Object)
    )
  })

  it('should generate audio for an article', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://example.com/article-audio.mp3' }),
    })

    const result = await ttsService.generateArticleAudio('المحتوى هنا', 'العنوان')
    expect(result.audio_url).toBe('https://example.com/article-audio.mp3')
  })

  it('should check generation status', async () => {
    const mockStatus = { status: 'completed', url: 'https://example.com/status-audio.mp3' }
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStatus),
    })

    const result = await ttsService.checkGenerationStatus('job-123')
    expect(result.status).toBe('completed')
    expect(result.audio_url).toBe('https://example.com/status-audio.mp3')
  })

  it('should get estimated cost', async () => {
    const cost = await ttsService.getEstimatedCost('هذا نص طويل للتقدير', 'premium')
    expect(cost.character_count).toBe(22)
    expect(cost.estimated_cost_usd).toBeCloseTo(0.00132)
  })

  it('should confirm if service is configured', () => {
    expect(ttsService.isConfigured()).toBe(true)
    // Test unconfigured state
    delete process.env.PLAYHT_API_KEY
    const unconfiguredService = new TTSService()
    expect(unconfiguredService.isConfigured()).toBe(false)
  })

  it('should get service status', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 'ar-voice-1' }]),
    })
    const status = await ttsService.getServiceStatus()
    expect(status.configured).toBe(true)
    expect(status.available).toBe(true)
    expect(status.voices_count).toBe(1)
  })
})
