/**
 * Program SCF (Secure Custom Fields) Mappings
 * Maps WordPress ACF fields to Next.js component props for programs
 */

import { NormalizedWPPost } from '../wordpress-transformers'

// Program-specific SCF field definitions
export const PROGRAM_SCF_FIELDS = {
  // Program details
  host_arabic: 'string',
  program_type: 'string', // 'video' | 'audio' | 'mixed'
  theme_color: 'string',
  cover_image: 'string',
  
  // Statistics and metadata
  episode_count: 'number',
  average_duration: 'number',
  subscriber_count: 'number',
  program_rating: 'number',
  trailer_video: 'string'
} as const

// Program component prop interfaces
export interface ProgramCardProps {
  id: number
  slug: string
  title: string
  host: string
  cover: string
  type: 'video' | 'audio' | 'mixed'
  episodeCount: number
  themeColor?: string
  rating?: number
  subscriberCount?: number
  href: string
}

export interface ProgramDetailProps {
  id: number
  slug: string
  title: string
  description: string
  host: string
  cover: string
  type: 'video' | 'audio' | 'mixed'
  themeColor?: string
  trailerVideo?: string
  stats: {
    episodeCount: number
    averageDuration?: number
    subscriberCount?: number
    rating?: number
  }
  episodes?: EpisodeCardProps[]
  seo: {
    title: string
    description: string
    image?: string
  }
}

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
  
  // Metadata
  seasonNumber?: number
  episodeNumber?: number
  duration?: number
  transcript?: string
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
 * Transform WordPress program post to ProgramCard props
 */
export function transformToProgramCard(program: NormalizedWPPost): ProgramCardProps {
  return {
    id: program.id,
    slug: program.slug,
    title: program.title_ar || program.title,
    host: program.zawaya_meta.host_arabic || 'مقدم غير محدد',
    cover: program.zawaya_meta.cover_image || program.featured_image_url || '/images/placeholder-program.jpg',
    type: (program.zawaya_meta.program_type as 'video' | 'audio' | 'mixed') || 'mixed',
    episodeCount: program.zawaya_meta.episode_count || 0,
    themeColor: program.zawaya_meta.theme_color,
    rating: program.zawaya_meta.program_rating ?? undefined,
    subscriberCount: program.zawaya_meta.subscriber_count ?? undefined,
    href: `/ar/programs/${program.slug}`
  }
}

/**
 * Transform WordPress program post to ProgramDetail props
 */
export function transformToProgramDetail(program: NormalizedWPPost, episodes: NormalizedWPPost[] = []): ProgramDetailProps {
  return {
    id: program.id,
    slug: program.slug,
    title: program.title_ar || program.title,
    description: program.content_ar || program.content,
    host: program.zawaya_meta.host_arabic || 'مقدم غير محدد',
    cover: program.zawaya_meta.cover_image || program.featured_image_url || '/images/placeholder-program.jpg',
    type: (program.zawaya_meta.program_type as 'video' | 'audio' | 'mixed') || 'mixed',
    themeColor: program.zawaya_meta.theme_color,
    trailerVideo: program.zawaya_meta.trailer_video,
    stats: {
      episodeCount: program.zawaya_meta.episode_count || episodes.length,
      averageDuration: program.zawaya_meta.average_duration ?? undefined,
      subscriberCount: program.zawaya_meta.subscriber_count ?? undefined,
      rating: program.zawaya_meta.program_rating ?? undefined
    },
    episodes: episodes.map(transformToEpisodeCard),
    seo: {
      title: program.title_ar || program.title,
      description: program.excerpt_ar || program.excerpt || 'برنامج على منصة زوايا',
      image: program.zawaya_meta.cover_image || program.featured_image_url
    }
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
    
    // Metadata
    seasonNumber: episode.zawaya_meta.season_number ?? undefined,
    episodeNumber: episode.zawaya_meta.episode_number ?? undefined,
    duration: episode.zawaya_meta.duration_seconds ?? undefined,
    transcript: episode.zawaya_meta.transcript_arabic,
    gallery: episode.zawaya_meta.episode_gallery,
    tags: episode.zawaya_meta.episode_tags_arabic,
    scheduledPublish: episode.zawaya_meta.scheduled_publish,
    
    // Dates
    publishedAt: episode.date,
    modifiedAt: episode.modified,
    
    seo: {
      title: `${episode.title_ar || episode.title} | ${program?.title_ar || program?.title || 'زوايا'}`,
      description: episode.zawaya_meta.transcript_arabic?.substring(0, 160) || 
                   episode.excerpt_ar || episode.excerpt || 'حلقة من برنامج على منصة زوايا',
      image: episode.zawaya_meta.episode_poster || episode.zawaya_meta.episode_thumbnail || episode.featured_image_url
    }
  }
}

/**
 * Transform arrays of WordPress posts
 */
export function transformToProgramCards(programs: NormalizedWPPost[]): ProgramCardProps[] {
  return programs.map(transformToProgramCard)
}

export function transformToEpisodeCards(episodes: NormalizedWPPost[]): EpisodeCardProps[] {
  return episodes.map(transformToEpisodeCard)
}

/**
 * Validate program SCF fields
 */
export function validateProgramSCF(meta: Record<string, any>): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required fields
  if (!meta.host_arabic) {
    warnings.push('Missing host_arabic - program host name')
  }

  if (!meta.program_type) {
    warnings.push('Missing program_type - should be video, audio, or mixed')
  } else if (!['video', 'audio', 'mixed'].includes(meta.program_type)) {
    errors.push('Invalid program_type - must be video, audio, or mixed')
  }

  // Validate numeric fields
  if (meta.episode_count && isNaN(Number(meta.episode_count))) {
    warnings.push('Invalid episode_count - should be a number')
  }

  if (meta.average_duration && isNaN(Number(meta.average_duration))) {
    warnings.push('Invalid average_duration - should be a number')
  }

  if (meta.subscriber_count && isNaN(Number(meta.subscriber_count))) {
    warnings.push('Invalid subscriber_count - should be a number')
  }

  if (meta.program_rating && (isNaN(Number(meta.program_rating)) || Number(meta.program_rating) < 0 || Number(meta.program_rating) > 5)) {
    warnings.push('Invalid program_rating - should be a number between 0 and 5')
  }

  // Validate URL fields
  if (meta.cover_image && !isValidUrl(meta.cover_image)) {
    warnings.push('Invalid cover_image URL format')
  }

  if (meta.trailer_video && !isValidUrl(meta.trailer_video)) {
    warnings.push('Invalid trailer_video URL format')
  }

  // Validate color field
  if (meta.theme_color && !isValidColor(meta.theme_color)) {
    warnings.push('Invalid theme_color format - should be hex color')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
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
  if (meta.episode_number && isNaN(Number(meta.episode_number))) {
    warnings.push('Invalid episode_number - should be a number')
  }

  if (meta.season_number && isNaN(Number(meta.season_number))) {
    warnings.push('Invalid season_number - should be a number')
  }

  if (meta.duration_seconds && isNaN(Number(meta.duration_seconds))) {
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

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Generate program cache tags
 */
export function getProgramCacheTags(program: NormalizedWPPost): string[] {
  const tags = ['programs', `program:${program.id}`]
  
  if (program.zawaya_meta.program_type) {
    tags.push(`program-type:${program.zawaya_meta.program_type}`)
  }
  
  return tags
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
 * Generate program revalidation paths
 */
export function getProgramRevalidationPaths(program: NormalizedWPPost): string[] {
  return [
    '/ar', // Homepage
    '/ar/programs', // Programs list
    `/ar/programs/${program.slug}` // Individual program
  ]
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
 * Get program type display name in Arabic
 */
export function getProgramTypeDisplayName(type: string): string {
  switch (type) {
    case 'video':
      return 'مرئي'
    case 'audio':
      return 'صوتي'
    case 'mixed':
      return 'مختلط'
    default:
      return 'غير محدد'
  }
}

// Helper functions
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}
