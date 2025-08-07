/**
 * Central SCF (Smart Custom Fields) Mappings Index
 * Re-exports all mapping interfaces and functions for easy import
 */

// Export existing mappings
export * from './article-mappings'
export * from './program-mappings'
export * from './author-mappings'

// Export new mappings
export * from './post'
export * from './program'
export * from './episode'
export * from './taqdeer'

// Type definitions for all SCF field collections
export type AllSCFFields = 
  | typeof import('./article-mappings').ARTICLE_SCF_FIELDS
  | typeof import('./program-mappings').PROGRAM_SCF_FIELDS
  | typeof import('./author-mappings').AUTHOR_SCF_FIELDS
  | typeof import('./post').POST_SCF_FIELDS
  | typeof import('./program').PROGRAM_SCF_FIELDS
  | typeof import('./episode').EPISODE_SCF_FIELDS
  | typeof import('./taqdeer').TAQDEER_SCF_FIELDS

// Content type mappings
export const CONTENT_TYPE_MAPPINGS = {
  article: 'article-mappings',
  post: 'post',
  program: 'program',
  episode: 'episode',
  taqdeer: 'taqdeer',
  author: 'author-mappings'
} as const

export type ContentType = keyof typeof CONTENT_TYPE_MAPPINGS

// Validation function registry
export const VALIDATION_FUNCTIONS = {
  article: async () => (await import('./article-mappings')).validateArticleSCF,
  post: async () => (await import('./post')).validatePostSCF,
  program: async () => (await import('./program')).validateProgramSCF,
  episode: async () => (await import('./episode')).validateEpisodeSCF,
  taqdeer: async () => (await import('./taqdeer')).validateTaqdeerSCF,
  author: async () => (await import('./author-mappings')).validateAuthorSCF
} as const

// Transform function registry
export const TRANSFORM_FUNCTIONS = {
  article: {
    toCard: async () => (await import('./article-mappings')).transformToArticleCard,
    toDetail: async () => (await import('./article-mappings')).transformToArticleDetail,
    toCards: async () => (await import('./article-mappings')).transformToArticleCards
  },
  post: {
    toCard: async () => (await import('./post')).transformToPostCard,
    toDetail: async () => (await import('./post')).transformToPostDetail,
    toCards: async () => (await import('./post')).transformToPostCards
  },
  program: {
    toCard: async () => (await import('./program')).transformToProgramCard,
    toDetail: async () => (await import('./program')).transformToProgramDetail,
    toCards: async () => (await import('./program')).transformToProgramCards
  },
  episode: {
    toCard: async () => (await import('./episode')).transformToEpisodeCard,
    toDetail: async () => (await import('./episode')).transformToEpisodeDetail,
    toCards: async () => (await import('./episode')).transformToEpisodeCards
  },
  taqdeer: {
    toCard: async () => (await import('./taqdeer')).transformToTaqdeerCard,
    toDetail: async () => (await import('./taqdeer')).transformToTaqdeerDetail,
    toCards: async () => (await import('./taqdeer')).transformToTaqdeerCards
  },
  author: {
    toCard: async () => (await import('./author-mappings')).transformToAuthorCard,
    toProfile: async () => (await import('./author-mappings')).transformToAuthorProfile,
    toCards: async () => (await import('./author-mappings')).transformToAuthorCards
  }
} as const

// Cache tag function registry
export const CACHE_TAG_FUNCTIONS = {
  article: async () => (await import('./article-mappings')).getArticleCacheTags,
  post: async () => (await import('./post')).getPostCacheTags,
  program: async () => (await import('./program')).getProgramCacheTags,
  episode: async () => (await import('./episode')).getEpisodeCacheTags,
  taqdeer: async () => (await import('./taqdeer')).getTaqdeerCacheTags,
  author: async () => (await import('./author-mappings')).getAuthorCacheTags
} as const

// Revalidation path function registry
export const REVALIDATION_PATH_FUNCTIONS = {
  article: async () => (await import('./article-mappings')).getArticleRevalidationPaths,
  post: async () => (await import('./post')).getPostRevalidationPaths,
  program: async () => (await import('./program')).getProgramRevalidationPaths,
  episode: async () => (await import('./episode')).getEpisodeRevalidationPaths,
  taqdeer: async () => (await import('./taqdeer')).getTaqdeerRevalidationPaths,
  author: async () => (await import('./author-mappings')).getAuthorRevalidationPaths
} as const

/**
 * Get validation function for content type
 */
export async function getValidationFunction(contentType: ContentType) {
  const validationFn = VALIDATION_FUNCTIONS[contentType]
  if (!validationFn) {
    throw new Error(`No validation function found for content type: ${contentType}`)
  }
  return await validationFn()
}

/**
 * Get transform functions for content type
 */
export async function getTransformFunctions(contentType: ContentType) {
  const transformFns = TRANSFORM_FUNCTIONS[contentType]
  if (!transformFns) {
    throw new Error(`No transform functions found for content type: ${contentType}`)
  }
  
  const resolvedFunctions: Record<string, Function> = {}
  for (const [key, fn] of Object.entries(transformFns)) {
    resolvedFunctions[key] = await fn()
  }
  
  return resolvedFunctions
}

/**
 * Get cache tag function for content type
 */
export async function getCacheTagFunction(contentType: ContentType) {
  const cacheTagFn = CACHE_TAG_FUNCTIONS[contentType]
  if (!cacheTagFn) {
    throw new Error(`No cache tag function found for content type: ${contentType}`)
  }
  return await cacheTagFn()
}

/**
 * Get revalidation path function for content type
 */
export async function getRevalidationPathFunction(contentType: ContentType) {
  const revalidationFn = REVALIDATION_PATH_FUNCTIONS[contentType]
  if (!revalidationFn) {
    throw new Error(`No revalidation path function found for content type: ${contentType}`)
  }
  return await revalidationFn()
}

/**
 * Validate SCF fields for any content type
 */
export async function validateSCFFields(
  contentType: ContentType, 
  meta: Record<string, any>
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  const validateFn = await getValidationFunction(contentType)
  return validateFn(meta)
}

/**
 * Transform content to card format for any content type
 */
export async function transformToCard(
  contentType: ContentType, 
  content: any, 
  ...additionalArgs: any[]
): Promise<any> {
  const transformFns = await getTransformFunctions(contentType)
  const toCardFn = transformFns.toCard
  
  if (!toCardFn) {
    throw new Error(`No toCard transform function found for content type: ${contentType}`)
  }
  
  return toCardFn(content, ...additionalArgs)
}

/**
 * Transform content to detail format for any content type
 */
export async function transformToDetail(
  contentType: ContentType, 
  content: any, 
  ...additionalArgs: any[]
): Promise<any> {
  const transformFns = await getTransformFunctions(contentType)
  const toDetailFn = transformFns.toDetail || transformFns.toProfile
  
  if (!toDetailFn) {
    throw new Error(`No toDetail/toProfile transform function found for content type: ${contentType}`)
  }
  
  return toDetailFn(content, ...additionalArgs)
}

/**
 * Transform array of content to cards format for any content type
 */
export async function transformToCards(
  contentType: ContentType, 
  contents: any[], 
  ...additionalArgs: any[]
): Promise<any[]> {
  const transformFns = await getTransformFunctions(contentType)
  const toCardsFn = transformFns.toCards
  
  if (!toCardsFn) {
    throw new Error(`No toCards transform function found for content type: ${contentType}`)
  }
  
  return toCardsFn(contents, ...additionalArgs)
}

/**
 * Generate cache tags for any content type
 */
export async function generateCacheTags(
  contentType: ContentType, 
  content: any, 
  ...additionalArgs: any[]
): Promise<string[]> {
  const cacheTagFn = await getCacheTagFunction(contentType)
  return cacheTagFn(content, ...additionalArgs)
}

/**
 * Generate revalidation paths for any content type
 */
export async function generateRevalidationPaths(
  contentType: ContentType, 
  content: any, 
  ...additionalArgs: any[]
): Promise<string[]> {
  const revalidationFn = await getRevalidationPathFunction(contentType)
  return revalidationFn(content, ...additionalArgs)
}

/**
 * Get all available content types
 */
export function getAvailableContentTypes(): ContentType[] {
  return Object.keys(CONTENT_TYPE_MAPPINGS) as ContentType[]
}

/**
 * Check if content type is supported
 */
export function isContentTypeSupported(contentType: string): contentType is ContentType {
  return contentType in CONTENT_TYPE_MAPPINGS
}

/**
 * Get mapping file name for content type
 */
export function getMappingFileName(contentType: ContentType): string {
  return CONTENT_TYPE_MAPPINGS[contentType]
}