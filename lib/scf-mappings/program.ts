/**
 * Program SCF (Smart Custom Fields) Mappings
 * Maps WordPress SCF fields to Next.js component props for programs
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
  trailer_video: 'string',
  
  // Extended program fields
  trailer_video_url: 'string',
  apple_link: 'string',
  spotify_link: 'string',
  google_link: 'string',
  rss_feed: 'string'
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
  trailerVideoUrl?: string
  appleLink?: string
  spotifyLink?: string
  googleLink?: string
  rssFeed?: string
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
export function transformToProgramDetail(program: NormalizedWPPost, episodes: any[] = []): ProgramDetailProps {
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
    trailerVideoUrl: program.zawaya_meta.trailer_video_url,
    appleLink: program.zawaya_meta.apple_link,
    spotifyLink: program.zawaya_meta.spotify_link,
    googleLink: program.zawaya_meta.google_link,
    rssFeed: program.zawaya_meta.rss_feed,
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
 * Transform arrays of WordPress posts
 */
export function transformToProgramCards(programs: NormalizedWPPost[]): ProgramCardProps[] {
  return programs.map(transformToProgramCard)
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
  if (meta.episode_count && !isValidNumber(meta.episode_count)) {
    warnings.push('Invalid episode_count - should be a number')
  }

  if (meta.average_duration && !isValidNumber(meta.average_duration)) {
    warnings.push('Invalid average_duration - should be a number')
  }

  if (meta.subscriber_count && !isValidNumber(meta.subscriber_count)) {
    warnings.push('Invalid subscriber_count - should be a number')
  }

  if (meta.program_rating && (!isValidNumber(meta.program_rating) || Number(meta.program_rating) < 0 || Number(meta.program_rating) > 5)) {
    warnings.push('Invalid program_rating - should be a number between 0 and 5')
  }

  // Validate URL fields
  if (meta.cover_image && !isValidUrl(meta.cover_image)) {
    warnings.push('Invalid cover_image URL format')
  }

  if (meta.trailer_video && !isValidUrl(meta.trailer_video)) {
    warnings.push('Invalid trailer_video URL format')
  }

  if (meta.trailer_video_url && !isValidUrl(meta.trailer_video_url)) {
    warnings.push('Invalid trailer_video_url URL format')
  }

  if (meta.apple_link && !isValidUrl(meta.apple_link)) {
    warnings.push('Invalid apple_link URL format')
  }

  if (meta.spotify_link && !isValidUrl(meta.spotify_link)) {
    warnings.push('Invalid spotify_link URL format')
  }

  if (meta.google_link && !isValidUrl(meta.google_link)) {
    warnings.push('Invalid google_link URL format')
  }

  if (meta.rss_feed && !isValidUrl(meta.rss_feed)) {
    warnings.push('Invalid rss_feed URL format')
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

function isValidColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}