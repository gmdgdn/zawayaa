/**
 * Text-to-Speech Service for Arabic Content
 * Integrates with PlayHT for high-quality Arabic TTS generation
 */

export interface TTSVoice {
  id: string
  name: string
  language: string
  gender: 'male' | 'female'
  accent?: string
  sample_url?: string
}

export interface TTSGenerationRequest {
  text: string
  voice_id: string
  language: 'ar' | 'en'
  speed?: number // 0.5 to 2.0
  quality?: 'draft' | 'standard' | 'premium'
}

export interface TTSGenerationResponse {
  audio_url: string
  duration: number
  character_count: number
  voice_used: string
  generation_time: number
}

export class TTSService {
  private apiKey: string
  private userId: string
  private baseUrl = 'https://api.play.ht/api/v2'

  constructor() {
    this.apiKey = process.env.PLAYHT_API_KEY || ''
    this.userId = process.env.PLAYHT_USER_ID || ''
    
    if (!this.apiKey || !this.userId) {
      console.warn('PlayHT credentials not configured. TTS functionality will be limited.')
    }
  }

  /**
   * Get available Arabic voices
   */
  async getArabicVoices(): Promise<TTSVoice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-User-ID': this.userId,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`)
      }

      const voices = await response.json()
      
      // Filter for Arabic voices
      return voices.filter((voice: any) => 
        voice.language_code?.startsWith('ar') || 
        voice.language?.toLowerCase().includes('arabic')
      ).map((voice: any) => ({
        id: voice.id,
        name: voice.name,
        language: voice.language_code || 'ar',
        gender: voice.gender || 'male',
        accent: voice.accent,
        sample_url: voice.sample_url
      }))
    } catch (error) {
      console.error('Error fetching Arabic voices:', error)
      return this.getDefaultArabicVoices()
    }
  }

  /**
   * Generate Arabic audio from text
   */
  async generateArabicAudio(request: TTSGenerationRequest): Promise<TTSGenerationResponse> {
    const startTime = Date.now()

    try {
      if (!this.apiKey || !this.userId) {
        throw new Error('PlayHT credentials not configured')
      }

      // Clean and prepare Arabic text
      const cleanedText = this.prepareArabicText(request.text)
      
      const response = await fetch(`${this.baseUrl}/tts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-User-ID': this.userId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: cleanedText,
          voice: request.voice_id,
          quality: request.quality || 'standard',
          output_format: 'mp3',
          speed: request.speed || 1.0,
          sample_rate: 24000
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`TTS generation failed: ${response.statusText} - ${JSON.stringify(errorData)}`)
      }

      const result = await response.json()
      const generationTime = Date.now() - startTime

      // Get audio duration (this would typically be provided by the service)
      const duration = await this.getAudioDuration(result.url)

      return {
        audio_url: result.url,
        duration,
        character_count: cleanedText.length,
        voice_used: request.voice_id,
        generation_time: generationTime
      }
    } catch (error) {
      console.error('Error generating Arabic audio:', error)
      throw error
    }
  }

  /**
   * Generate audio for article content
   */
  async generateArticleAudio(
    articleContent: string, 
    title: string,
    voiceId?: string
  ): Promise<TTSGenerationResponse> {
    // Get default Arabic voice if none specified
    const voice = voiceId || await this.getDefaultArabicVoice()
    
    // Prepare full text with title
    const fullText = this.prepareArticleText(title, articleContent)
    
    return this.generateArabicAudio({
      text: fullText,
      voice_id: voice,
      language: 'ar',
      quality: 'standard',
      speed: 0.9 // Slightly slower for better comprehension
    })
  }

  /**
   * Check generation status (for async generations)
   */
  async checkGenerationStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed'
    audio_url?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/tts/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-User-ID': this.userId
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to check status: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        status: result.status,
        audio_url: result.url,
        error: result.error
      }
    } catch (error) {
      console.error('Error checking generation status:', error)
      return { status: 'failed', error: error.message }
    }
  }

  /**
   * Get estimated cost for text generation
   */
  async getEstimatedCost(text: string, quality: 'draft' | 'standard' | 'premium' = 'standard'): Promise<{
    character_count: number
    estimated_cost_usd: number
    estimated_duration_seconds: number
  }> {
    const characterCount = text.length
    
    // PlayHT pricing (approximate - check current rates)
    const costPerCharacter = {
      draft: 0.000015,
      standard: 0.00003,
      premium: 0.00006
    }

    // Estimate duration (Arabic: ~8-10 characters per second)
    const estimatedDuration = Math.ceil(characterCount / 9)

    return {
      character_count: characterCount,
      estimated_cost_usd: characterCount * costPerCharacter[quality],
      estimated_duration_seconds: estimatedDuration
    }
  }

  /**
   * Prepare Arabic text for TTS
   */
  private prepareArabicText(text: string): string {
    return text
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Normalize Arabic text
      .replace(/[\u064B-\u065F]/g, '') // Remove diacritics for better TTS
      // Add pauses for better narration
      .replace(/\./g, '. ')
      .replace(/\n\n/g, '\n\n ')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * Prepare article text with title for narration
   */
  private prepareArticleText(title: string, content: string): string {
    const cleanTitle = this.prepareArabicText(title)
    const cleanContent = this.prepareArabicText(content)
    
    return `${cleanTitle}.\n\n${cleanContent}`
  }

  /**
   * Get audio duration from URL (placeholder implementation)
   */
  private async getAudioDuration(audioUrl: string): Promise<number> {
    try {
      // In a real implementation, you would:
      // 1. Download the audio file
      // 2. Use a library like ffprobe to get duration
      // 3. Or use the duration provided by the TTS service
      
      // For now, estimate based on character count
      // Arabic: approximately 8-10 characters per second
      return 300 // Placeholder: 5 minutes
    } catch (error) {
      console.error('Error getting audio duration:', error)
      return 0
    }
  }

  /**
   * Get default Arabic voice
   */
  private async getDefaultArabicVoice(): Promise<string> {
    try {
      const voices = await this.getArabicVoices()
      
      // Prefer female voices for Arabic content
      const femaleVoice = voices.find(v => v.gender === 'female')
      if (femaleVoice) return femaleVoice.id
      
      // Fallback to any Arabic voice
      if (voices.length > 0) return voices[0].id
      
      // Ultimate fallback
      return 'ar-default'
    } catch (error) {
      console.error('Error getting default Arabic voice:', error)
      return 'ar-default'
    }
  }

  /**
   * Get default Arabic voices (fallback when API is unavailable)
   */
  private getDefaultArabicVoices(): TTSVoice[] {
    return [
      {
        id: 'ar-female-1',
        name: 'Amina (Arabic)',
        language: 'ar',
        gender: 'female',
        accent: 'Modern Standard Arabic'
      },
      {
        id: 'ar-male-1',
        name: 'Omar (Arabic)',
        language: 'ar',
        gender: 'male',
        accent: 'Modern Standard Arabic'
      }
    ]
  }

  /**
   * Validate TTS configuration
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.userId)
  }

  /**
   * Get service status
   */
  async getServiceStatus(): Promise<{
    configured: boolean
    available: boolean
    voices_count: number
    error?: string
  }> {
    try {
      const configured = this.isConfigured()
      
      if (!configured) {
        return {
          configured: false,
          available: false,
          voices_count: 0,
          error: 'PlayHT credentials not configured'
        }
      }

      const voices = await this.getArabicVoices()
      
      return {
        configured: true,
        available: true,
        voices_count: voices.length
      }
    } catch (error) {
      return {
        configured: this.isConfigured(),
        available: false,
        voices_count: 0,
        error: error.message
      }
    }
  }
}

// Export singleton instance
export const ttsService = new TTSService()

// Export types
export type { TTSVoice, TTSGenerationRequest, TTSGenerationResponse }