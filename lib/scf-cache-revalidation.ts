/**
 * SCF-Aware Cache Revalidation System
 * Enhanced cache revalidation that understands SCF field changes and dependencies
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NormalizedWPPost } from './wordpress-transformers'
import { WordPressAuthor } from './scf-mappings/author-mappings'
import { 
  getArticleCacheTags, 
  getArticleRevalidationPaths 
} from './scf-mappings/article-mappings'
import { 
  getProgramCacheTags, 
  getEpisodeCacheTags,
  getProgramRevalidationPaths,
  getEpisodeRevalidationPaths 
} from './scf-mappings/program-mappings'
import { 
  getAuthorCacheTags, 
  getAuthorRevalidationPaths 
} from './scf-mappings/author-mappings'

// SCF field change types
export type SCFFieldChangeType = 
  | 'content_update'
  | 'featured_toggle'
  | 'breaking_news_toggle'
  | 'category_change'
  | 'author_change'
  | 'media_change'
  | 'seo_change'
  | 'program_type_change'
  | 'episode_media_change'
  | 'author_verification_change'

// Revalidation payload interface
export interface SCFRevalidationPayload {
  secret: string
  content_type: 'post' | 'program' | 'episode' | 'user'
  content_id: number
  content_slug?: string
  action: 'publish' | 'update' | 'delete' | 'featured_toggle' | 'emergency_clear'
  changed_fields?: string[]
  field_changes?: Record<string, {
    old_value: any
    new_value: any
    change_type: SCFFieldChangeType
  }>
  cascade?: boolean
  priority?: 'high' | 'normal' | 'low'
}

// Cache dependency mapping
export const SCF_CACHE_DEPENDENCIES = {
  // Article field dependencies
  article: {
    title_arabic: ['articles', 'homepage', 'search'],
    excerpt_arabic: ['articles', 'homepage'],
    content_arabic: ['article-detail'],
    is_featured: ['homepage', 'featured-articles'],
    is_breaking_news: ['homepage', 'breaking-news'],
    category_color: ['articles', 'categories'],
    audio_narration_url: ['articles', 'audio-content'],
    reading_time_minutes: ['articles'],
    author_arabic_name: ['articles', 'authors'],
    social_sharing_image: ['articles', 'social-media'],
    meta_description_arabic: ['seo'],
    keywords_arabic: ['seo']
  },

  // Program field dependencies
  program: {
    host_arabic: ['programs', 'hosts'],
    program_type: ['programs', 'program-types'],
    theme_color: ['programs'],
    cover_image: ['programs', 'media'],
    episode_count: ['programs', 'statistics'],
    trailer_video: ['programs', 'media']
  },

  // Episode field dependencies
  episode: {
    video_embed_url: ['episodes', 'video-content', 'programs'],
    audio_file_url: ['episodes', 'audio-content', 'programs'],
    episode_thumbnail: ['episodes', 'media'],
    duration_seconds: ['episodes', 'programs'],
    transcript_arabic: ['episodes', 'search'],
    episode_number: ['episodes', 'programs']
  },

  // Author field dependencies
  author: {
    name_arabic: ['authors', 'articles', 'programs'],
    job_title_arabic: ['authors'],
    author_avatar: ['authors', 'articles'],
    is_featured_author: ['homepage', 'featured-authors'],
    is_verified_author: ['authors', 'verified-authors'],
    bio_arabic: ['authors'],
    social_media_links: ['authors', 'social-media']
  }
} as const

/**
 * Generate cache tags based on SCF field changes
 */
export function generateSCFCacheTags(
  contentType: keyof typeof SCF_CACHE_DEPENDENCIES,
  changedFields: string[],
  contentId: number
): string[] {
  const dependencies = SCF_CACHE_DEPENDENCIES[contentType]
  const tags = new Set<string>()

  // Add base content tags
  tags.add(contentType === 'post' ? 'articles' : `${contentType}s`)
  tags.add(`${contentType === 'post' ? 'article' : contentType}:${contentId}`)

  // Add field-specific dependency tags
  changedFields.forEach(field => {
    const fieldDependencies = dependencies[field as keyof typeof dependencies]
    if (fieldDependencies) {
      fieldDependencies.forEach(dep => tags.add(dep))
    }
  })

  return Array.from(tags)
}

/**
 * Generate revalidation paths based on SCF field changes
 */
export function generateSCFRevalidationPaths(
  contentType: 'post' | 'program' | 'episode' | 'user',
  contentSlug: string,
  changedFields: string[],
  fieldChanges?: Record<string, any>
): string[] {
  const paths = new Set<string>()

  // Base paths for content type
  switch (contentType) {
    case 'post':
      paths.add('/ar')
      paths.add('/ar/articles')
      paths.add(`/ar/articles/${contentSlug}`)
      break
    case 'program':
      paths.add('/ar')
      paths.add('/ar/programs')
      paths.add(`/ar/programs/${contentSlug}`)
      break
    case 'episode':
      paths.add('/ar/programs') // Episodes affect program pages
      paths.add(`/ar/episodes/${contentSlug}`)
      break
    case 'user':
      paths.add('/ar/authors')
      paths.add(`/ar/authors/${contentSlug}`)
      break
  }

  // Add field-specific paths
  changedFields.forEach(field => {
    switch (field) {
      case 'is_featured':
      case 'is_featured_author':
        paths.add('/ar') // Homepage
        break
      case 'category_color':
        // Add category pages if we have category info
        break
      case 'program_type':
        paths.add('/ar/programs') // Program type filters
        break
      case 'author_arabic_name':
        // Revalidate all content by this author
        paths.add('/ar/articles') // Author name appears on article cards
        break
    }
  })

  return Array.from(paths)
}

/**
 * Determine revalidation priority based on field changes
 */
export function determineSCFRevalidationPriority(
  changedFields: string[],
  fieldChanges?: Record<string, any>
): 'high' | 'normal' | 'low' {
  // High priority changes
  const highPriorityFields = [
    'is_featured',
    'is_breaking_news',
    'is_featured_author',
    'title_arabic',
    'content_arabic'
  ]

  // Medium priority changes
  const mediumPriorityFields = [
    'excerpt_arabic',
    'category_color',
    'audio_narration_url',
    'cover_image',
    'program_type'
  ]

  if (changedFields.some(field => highPriorityFields.includes(field))) {
    return 'high'
  }

  if (changedFields.some(field => mediumPriorityFields.includes(field))) {
    return 'normal'
  }

  return 'low'
}

/**
 * Process SCF-aware revalidation
 */
export async function processSCFRevalidation(
  payload: SCFRevalidationPayload
): Promise<{
  success: boolean
  revalidated: {
    paths: string[]
    tags: string[]
  }
  errors: string[]
  duration: number
}> {
  const startTime = Date.now()
  const errors: string[] = []
  const revalidatedPaths: string[] = []
  const revalidatedTags: string[] = []

  try {
    const { 
      content_type, 
      content_id, 
      content_slug, 
      changed_fields = [], 
      field_changes,
      cascade = false 
    } = payload

    // Generate SCF-aware cache tags
    const cacheTags = generateSCFCacheTags(
      content_type === 'post' ? 'article' : content_type,
      changed_fields,
      content_id
    )

    // Generate SCF-aware revalidation paths
    const revalidationPaths = generateSCFRevalidationPaths(
      content_type,
      content_slug || content_id.toString(),
      changed_fields,
      field_changes
    )

    // Revalidate paths
    for (const path of revalidationPaths) {
      try {
        revalidatePath(path)
        revalidatedPaths.push(path)
      } catch (error) {
        errors.push(`Failed to revalidate path ${path}: ${error}`)
      }
    }

    // Revalidate tags
    for (const tag of cacheTags) {
      try {
        revalidateTag(tag)
        revalidatedTags.push(tag)
      } catch (error) {
        errors.push(`Failed to revalidate tag ${tag}: ${error}`)
      }
    }

    // Handle cascade revalidation for related content
    if (cascade) {
      await handleCascadeRevalidation(
        content_type,
        content_id,
        changed_fields,
        revalidatedPaths,
        revalidatedTags,
        errors
      )
    }

    // Handle special field changes
    await handleSpecialFieldChanges(
      content_type,
      changed_fields,
      field_changes,
      revalidatedPaths,
      revalidatedTags,
      errors
    )

    return {
      success: errors.length === 0,
      revalidated: {
        paths: revalidatedPaths,
        tags: revalidatedTags
      },
      errors,
      duration: Date.now() - startTime
    }

  } catch (error) {
    errors.push(`SCF revalidation failed: ${error}`)
    return {
      success: false,
      revalidated: {
        paths: revalidatedPaths,
        tags: revalidatedTags
      },
      errors,
      duration: Date.now() - startTime
    }
  }
}

/**
 * Handle cascade revalidation for related content
 */
async function handleCascadeRevalidation(
  contentType: 'post' | 'program' | 'episode' | 'user',
  contentId: number,
  changedFields: string[],
  revalidatedPaths: string[],
  revalidatedTags: string[],
  errors: string[]
): Promise<void> {
  try {
    switch (contentType) {
      case 'post':
        // If article author changed, revalidate author page
        if (changedFields.includes('author_arabic_name')) {
          revalidateTag(`author-articles:${contentId}`)
          revalidatedTags.push(`author-articles:${contentId}`)
        }
        break

      case 'program':
        // If program changed, revalidate all its episodes
        if (changedFields.some(field => ['host_arabic', 'theme_color', 'program_type'].includes(field))) {
          revalidateTag(`program-episodes:${contentId}`)
          revalidatedTags.push(`program-episodes:${contentId}`)
        }
        break

      case 'episode':
        // If episode changed, revalidate parent program
        revalidateTag('programs')
        revalidatedTags.push('programs')
        break

      case 'user':
        // If author changed, revalidate all their content
        if (changedFields.includes('name_arabic') || changedFields.includes('author_avatar')) {
          revalidateTag(`author-content:${contentId}`)
          revalidatedTags.push(`author-content:${contentId}`)
        }
        break
    }
  } catch (error) {
    errors.push(`Cascade revalidation failed: ${error}`)
  }
}

/**
 * Handle special field changes that require additional revalidation
 */
async function handleSpecialFieldChanges(
  contentType: 'post' | 'program' | 'episode' | 'user',
  changedFields: string[],
  fieldChanges?: Record<string, any>,
  revalidatedPaths: string[],
  revalidatedTags: string[],
  errors: string[]
): Promise<void> {
  try {
    // Handle featured content toggles
    if (changedFields.includes('is_featured') || changedFields.includes('is_featured_author')) {
      revalidatePath('/ar') // Homepage
      revalidatedPaths.push('/ar')
      revalidateTag('homepage')
      revalidatedTags.push('homepage')
    }

    // Handle breaking news toggles
    if (changedFields.includes('is_breaking_news')) {
      revalidateTag('breaking-news')
      revalidatedTags.push('breaking-news')
    }

    // Handle program type changes
    if (changedFields.includes('program_type') && fieldChanges?.program_type) {
      const oldType = fieldChanges.program_type.old_value
      const newType = fieldChanges.program_type.new_value
      
      // Revalidate both old and new type filters
      if (oldType) {
        revalidateTag(`program-type:${oldType}`)
        revalidatedTags.push(`program-type:${oldType}`)
      }
      if (newType) {
        revalidateTag(`program-type:${newType}`)
        revalidatedTags.push(`program-type:${newType}`)
      }
    }

    // Handle category changes
    if (changedFields.includes('category_color') && fieldChanges?.category_color) {
      revalidateTag('categories')
      revalidatedTags.push('categories')
    }

    // Handle media changes
    if (changedFields.some(field => 
      ['cover_image', 'episode_thumbnail', 'author_avatar', 'social_sharing_image'].includes(field)
    )) {
      revalidateTag('media')
      revalidatedTags.push('media')
    }

    // Handle SEO changes
    if (changedFields.some(field => 
      ['meta_description_arabic', 'keywords_arabic', 'title_arabic'].includes(field)
    )) {
      revalidateTag('seo')
      revalidatedTags.push('seo')
    }

  } catch (error) {
    errors.push(`Special field change handling failed: ${error}`)
  }
}

/**
 * Create SCF revalidation webhook payload
 */
export function createSCFWebhookPayload(
  contentType: 'post' | 'program' | 'episode' | 'user',
  contentId: number,
  contentSlug: string,
  action: 'publish' | 'update' | 'delete',
  changedFields: string[] = [],
  fieldChanges?: Record<string, any>
): SCFRevalidationPayload {
  return {
    secret: process.env.REVALIDATION_SECRET || '',
    content_type: contentType,
    content_id: contentId,
    content_slug: contentSlug,
    action,
    changed_fields: changedFields,
    field_changes: fieldChanges,
    cascade: true,
    priority: determineSCFRevalidationPriority(changedFields, fieldChanges)
  }
}

/**
 * Batch process multiple SCF revalidations
 */
export async function batchProcessSCFRevalidations(
  payloads: SCFRevalidationPayload[]
): Promise<{
  success: boolean
  results: Array<{
    payload: SCFRevalidationPayload
    result: Awaited<ReturnType<typeof processSCFRevalidation>>
  }>
  totalDuration: number
}> {
  const startTime = Date.now()
  const results: Array<{
    payload: SCFRevalidationPayload
    result: Awaited<ReturnType<typeof processSCFRevalidation>>
  }> = []

  // Sort by priority (high first)
  const sortedPayloads = payloads.sort((a, b) => {
    const priorityOrder = { high: 0, normal: 1, low: 2 }
    return priorityOrder[a.priority || 'normal'] - priorityOrder[b.priority || 'normal']
  })

  // Process each payload
  for (const payload of sortedPayloads) {
    const result = await processSCFRevalidation(payload)
    results.push({ payload, result })
  }

  const allSuccessful = results.every(r => r.result.success)

  return {
    success: allSuccessful,
    results,
    totalDuration: Date.now() - startTime
  }
}

/**
 * Generate revalidation report
 */
export function generateRevalidationReport(
  results: Array<{
    payload: SCFRevalidationPayload
    result: Awaited<ReturnType<typeof processSCFRevalidation>>
  }>
): {
  summary: {
    total: number
    successful: number
    failed: number
    totalPaths: number
    totalTags: number
    totalDuration: number
  }
  details: Array<{
    contentType: string
    contentId: number
    action: string
    changedFields: string[]
    success: boolean
    pathsRevalidated: number
    tagsRevalidated: number
    duration: number
    errors: string[]
  }>
} {
  const summary = {
    total: results.length,
    successful: results.filter(r => r.result.success).length,
    failed: results.filter(r => !r.result.success).length,
    totalPaths: results.reduce((sum, r) => sum + r.result.revalidated.paths.length, 0),
    totalTags: results.reduce((sum, r) => sum + r.result.revalidated.tags.length, 0),
    totalDuration: results.reduce((sum, r) => sum + r.result.duration, 0)
  }

  const details = results.map(({ payload, result }) => ({
    contentType: payload.content_type,
    contentId: payload.content_id,
    action: payload.action,
    changedFields: payload.changed_fields || [],
    success: result.success,
    pathsRevalidated: result.revalidated.paths.length,
    tagsRevalidated: result.revalidated.tags.length,
    duration: result.duration,
    errors: result.errors
  }))

  return { summary, details }
}

// Export types and utilities
export type {
  SCFRevalidationPayload,
  SCFFieldChangeType
}