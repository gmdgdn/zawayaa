/**
 * Episode SCF (Smart Custom Fields) Mappings
 * Maps WordPress SCF fields to Next.js component props for episodes
 */

import { NormalizedWPPost } from '../wordpress-transformers'

// Chapter interface for episode chapters
export interface Chapter {
  start: number // seconds
  title: string
}

// ResourceLink interface for episode resources
export interface ResourceLink {
  title: string
  url: string
  type: 'article' | 'website' | 'document'
}

// Episode-specific SCF field definitions
export const EPISODE_SCF_FIELDS = {
  // Episode metadata
  season_number: 'number',
  episode_number: 'number',
  transcript_markdown: 'string',
  resource_links: 'array',
  key_points: 'array',
  chapters: 'array',
  
  // Existing episode fields
  video_embed_url: 'string',
  audio_file_url: 'string',
  episode_poster: 'string',
  episode_thumbnail: 'string',
  duration_seconds: 'number',
  transcript_arabic: 'string',
  episode_gallery: 'array',
  episode_tags_arabic: 'array',
  scheduled_publish: 'string'
} as const

// Episode component prop interfaces
export interface EpisodeCardProps {
  id: number
  slug: string
  title: string
  thumbnail?: string
  duration?: number
  episodeNumber?: number
  seasonNumber?: number
  href: string
  publishedAt: string
}

export interface EpisodeDetailProps {
  id: number
  slug: string
  title: string
  description: string
  programId: number
  programTitle: string
  programSlug: string
  
  // Media
  videoUrl?: string
  audioUrl?: string
  poster?: string
  thumbnail?: string
  
  // Extended metadata
  seasonNumber?: number
  episodeNumber?: number
  duration?: number
  transcript?: string
  transcriptMarkdown?: string
  resourceLinks?: ResourceLink[]
  keyPoints?: string[]
  chapters?: Chapter[]
  gallery?: string[]
  tags?: string[]
  scheduledPublish?: string
  
  // Dates
  publishedAt: string
  modifiedAt: string
  
  seo: {
    title: string
    description: string
    image?: string
  }
}

/**
 * Transform WordPress episode post to EpisodeCard props
 */
export function transformToEpisodeCard(episode: NormalizedWPPost): EpisodeCardProps {
  return {
    id: episode.id,
    slug: episode.slug,
    title: episode.title_ar || episode.title,
    thumbnail: episode.zawaya_meta.episode_thumbnail || episode.featured_image_url,
    duration: episode.zawaya_meta.duration_seconds ?? undefined,
    episodeNumber: episode.zawaya_meta.episode_number ?? undefined,
    seasonNumber: episode.zawaya_meta.season_number ?? undefined,
    href: `/ar/episodes/${episode.slug}`,
    publishedAt: episode.date
  }
}

/**
 * Transform WordPress episode post to EpisodeDetail props
 */
export function transformToEpisodeDetail(
  episode: NormalizedWPPost, 
  program?: NormalizedWPPost
): EpisodeDetailProps {
  // Parse resource links if available
  let resourceLinks: ResourceLink[] = []
  try {
    if (episode.zawaya_meta.resource_links) {
      resourceLinks = Array.isArray(episode.zawaya_meta.resource_links) 
        ? episode.zawaya_meta.resource_links 
        : JSON.parse(episode.zawaya_meta.resource_links)
    }
  } catch (error) {
    console.warn('Failed to parse resource_links for episode', episode.id)
  }

  // Parse key points if available
  let keyPoints: string[] = []
  try {
    if (episode.zawaya_meta.key_points) {
      keyPoints = Array.isArray(episode.zawaya_meta.key_points) 
        ? episode.zawaya_meta.key_points 
        : JSON.parse(episode.zawaya_meta.key_points)
    }
  } catch (error) {
    console.warn('Failed to parse key_points for episode', episode.id)
  }

  // Parse chapters if available
  let chapters: Chapter[] = []
  try {
    if (episode.zawaya_meta.chapters) {
      chapters = Array.isArray(episode.zawaya_meta.chapters) 
        ? episode.zawaya_meta.chapters 
        : JSON.parse(episode.zawaya_meta.chapters)
    }
  } catch (error) {
    console.warn('Failed to parse chapters for episode', episode.id)
  }

  // Parse gallery if available
  let gallery: string[] = []
  try {
    if (episode.zawaya_meta.episode_gallery) {
      gallery = Array.isArray(episode.zawaya_meta.episode_gallery) 
        ? episode.zawaya_meta.episode_gallery 
        : JSON.parse(episode.zawaya_meta.episode_gallery)
    }
  } catch (error) {
    console.warn('Failed to parse episode_gallery for episode', episode.id)
  }

  // Parse tags if available
  let tags: string[] = []
  try {
    if (episode.zawaya_meta.episode_tags_arabic) {
      tags = Array.isArray(episode.zawaya_meta.episode_tags_arabic) 
        ? episode.zawaya_meta.episode_tags_arabic 
        : JSON.parse(episode.zawaya_meta.episode_tags_arabic)
    }
  } catch (error) {
    console.warn('Failed to parse episode_tags_arabic for episode', episode.id)
  }

  return {
    id: episode.id,
    slug: episode.slug,
    title: episode.title_ar || episode.title,
    description: episode.content_ar || episode.content,
    programId: program?.id || 0,
    programTitle: program?.title_ar || program?.title || 'برنامج غير محدد',
    programSlug: program?.slug || '',
    
    // Media
    videoUrl: episode.zawaya_meta.video_embed_url,
    audioUrl: episode.zawaya_meta.audio_file_url,
    poster: episode.zawaya_meta.episode_poster,
    thumbnail: episode.zawaya_meta.episode_thumbnail || episode.featured_image_url,
    
    // Extended metadata
    seasonNumber: episode.zawaya_meta.season_number ?? undefined,
    episodeNumber: episode.zawaya_meta.episode_number ?? undefined,
    duration: episode.zawaya_meta.duration_seconds ?? undefined,
    transcript: episode.zawaya_meta.transcript_arabic,
    transcriptMarkdown: episode.zawaya_meta.transcript_markdown,
    resourceLinks,
    keyPoints,
    chapters,
    gallery,
    tags,
    scheduledPublish: episode.zawaya_meta.scheduled_publish,
    
    // Dates
    publishedAt: episode.date,
    modifiedAt: episode.modified,
    
    seo: {
      title: `${episode.title_ar || episode.title} | ${program?.title_ar || program?.title || 'زوايا'}`,
      description: episode.zawaya_meta.transcript_markdown?.substring(0, 160) || 
                   episode.zawaya_meta.transcript_arabic?.substring(0, 160) || 
                   episode.excerpt_ar || episode.excerpt || 'حلقة من برنامج على منصة زوايا',
      image: episode.zawaya_meta.episode_poster || episode.zawaya_meta.episode_thumbnail || episode.featured_image_url
    }
  }
}

/**
 * Transform arrays of WordPress posts
 */
export function transformToEpisodeCards(episodes: NormalizedWPPost[]): EpisodeCardProps[] {
  return episodes.map(transformToEpisodeCard)
}

/**
 * Validate episode SCF fields
 */
export function validateEpisodeSCF(meta: Record<string, any>): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check that at least one media URL is provided
  if (!meta.video_embed_url && !meta.audio_file_url) {
    errors.push('Missing media - provide either video_embed_url or audio_file_url')
  }

  // Validate numeric fields
  if (meta.episode_number && !isValidNumber(meta.episode_number)) {
    warnings.push('Invalid episode_number - should be a number')
  }

  if (meta.season_number && !isValidNumber(meta.season_number)) {
    warnings.push('Invalid season_number - should be a number')
  }

  if (meta.duration_seconds && !isValidNumber(meta.duration_seconds)) {
    warnings.push('Invalid duration_seconds - should be a number')
  }

  // Validate URL fields
  if (meta.video_embed_url && !isValidUrl(meta.video_embed_url)) {
    warnings.push('Invalid video_embed_url format')
  }

  if (meta.audio_file_url && !isValidUrl(meta.audio_file_url)) {
    warnings.push('Invalid audio_file_url format')
  }

  if (meta.episode_poster && !isValidUrl(meta.episode_poster)) {
    warnings.push('Invalid episode_poster URL format')
  }

  if (meta.episode_thumbnail && !isValidUrl(meta.episode_thumbnail)) {
    warnings.push('Invalid episode_thumbnail URL format')
  }

  // Validate array fields
  if (meta.resource_links) {
    try {
      const resourceLinks = Array.isArray(meta.resource_links) 
        ? meta.resource_links 
        : JSON.parse(meta.resource_links)
      
      if (!Array.isArray(resourceLinks)) {
        warnings.push('Invalid resource_links - should be an array')
      } else {
        resourceLinks.forEach((link, index) => {
          if (!validateResourceLink(link)) {
            warnings.push(`Invalid resource_links item ${index + 1} - missing required fields`)
          }
        })
      }
    } catch (error) {
      warnings.push('Invalid resource_links - should be valid JSON array')
    }
  }

  if (meta.key_points) {
    try {
      const keyPoints = Array.isArray(meta.key_points) 
        ? meta.key_points 
        : JSON.parse(meta.key_points)
      
      if (!Array.isArray(keyPoints)) {
        warnings.push('Invalid key_points - should be an array')
      }
    } catch (error) {
      warnings.push('Invalid key_points - should be valid JSON array')
    }
  }

  if (meta.chapters) {
    try {
      const chapters = Array.isArray(meta.chapters) 
        ? meta.chapters 
        : JSON.parse(meta.chapters)
      
      if (!Array.isArray(chapters)) {
        warnings.push('Invalid chapters - should be an array')
      } else {
        chapters.forEach((chapter, index) => {
          if (!validateChapter(chapter)) {
            warnings.push(`Invalid chapters item ${index + 1} - missing required fields`)
          }
        })
      }
    } catch (error) {
      warnings.push('Invalid chapters - should be valid JSON array')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate ResourceLink structure
 */
function validateResourceLink(link: any): boolean {
  if (!link || typeof link !== 'object') return false
  
  // Check required fields
  if (!link.title || !link.url) return false
  
  // Validate type
  if (link.type && !['article', 'website', 'document'].includes(link.type)) return false
  
  // Validate URL
  if (!isValidUrl(link.url)) return false
  
  return true
}

/**
 * Validate Chapter structure
 */
function validateChapter(chapter: any): boolean {
  if (!chapter || typeof chapter !== 'object') return false
  
  // Check required fields
  if (typeof chapter.start !== 'number' || !chapter.title) return false
  
  // Validate start time is non-negative
  if (chapter.start < 0) return false
  
  return true
}

/**
 * Generate episode cache tags
 */
export function getEpisodeCacheTags(episode: NormalizedWPPost, programId?: number): string[] {
  const tags = ['episodes', `episode:${episode.id}`]
  
  if (programId) {
    tags.push(`program:${programId}`, 'programs')
  }
  
  return tags
}

/**
 * Generate episode revalidation paths
 */
export function getEpisodeRevalidationPaths(episode: NormalizedWPPost, programSlug?: string): string[] {
  const paths = [
    '/ar/programs', // Programs list (episode counts)
    `/ar/episodes/${episode.slug}` // Individual episode
  ]
  
  if (programSlug) {
    paths.push(`/ar/programs/${programSlug}`) // Parent program page
  }
  
  return paths
}

/**
 * Format duration for display
 */
export function formatDuration(seconds?: number): string {
  if (!seconds) return ''
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

/**
 * Format chapter time for display
 */
export function formatChapterTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Get resource link type display name in Arabic
 */
export function getResourceTypeDisplayName(type: string): string {
  switch (type) {
    case 'article':
      return 'مقال'
    case 'website':
      return 'موقع ويب'
    case 'document':
      return 'وثيقة'
    default:
      return 'رابط'
  }
}

// Helper functions
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidNumber(value: any): boolean {
  return !isNaN(Number(value)) && isFinite(Number(value))
}