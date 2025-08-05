/**
 * Author SCF (Secure Custom Fields) Mappings
 * Maps WordPress ACF fields to Next.js component props for authors
 */

// Author-specific SCF field definitions
export const AUTHOR_SCF_FIELDS = {
  // Arabic author fields
  name_arabic: 'string',
  job_title_arabic: 'string',
  bio_arabic: 'string',
  location_arabic: 'string',
  
  // Author media and verification
  author_avatar: 'string',
  author_cover_image: 'string',
  is_verified_author: 'boolean',
  is_featured_author: 'boolean',
  
  // Professional details
  expertise_areas: 'array',
  languages_spoken: 'array',
  social_media_links: 'array'
} as const

// Social media link interface
export interface SocialMediaLink {
  platform: string
  url: string
}

// Author component prop interfaces
export interface AuthorCardProps {
  id: number
  slug: string
  name: string
  title?: string
  avatar?: string
  topics?: string[]
  verified?: boolean
  featured?: boolean
  href: string
  articlesCount?: number
}

export interface AuthorProfileProps {
  id: number
  slug: string
  name: string
  title?: string
  bio?: string
  location?: string
  avatar?: string
  cover?: string
  verified?: boolean
  featured?: boolean
  expertise?: string[]
  languages?: string[]
  socials?: SocialMediaLink[]
  stats?: {
    articlesCount: number
    programsCount: number
    totalViews?: number
  }
  seo: {
    title: string
    description: string
    image?: string
  }
}

export interface AuthorListProps {
  authors: AuthorCardProps[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters?: {
    featured?: boolean
    verified?: boolean
    expertise?: string
  }
}

// WordPress user with SCF fields
export interface WordPressAuthor {
  id: number
  name: string
  slug: string
  description: string
  link: string
  avatar_urls: Record<string, string>
  meta?: {
    // Arabic author fields
    name_arabic?: string
    job_title_arabic?: string
    bio_arabic?: string
    location_arabic?: string
    
    // Author media and verification
    author_avatar?: string
    author_cover_image?: string
    is_verified_author?: boolean | string
    is_featured_author?: boolean | string
    
    // Professional details (JSON strings from ACF)
    expertise_areas?: string
    languages_spoken?: string
    social_media_links?: string
  }
}

/**
 * Transform WordPress author to AuthorCard props
 */
export function transformToAuthorCard(author: WordPressAuthor, articlesCount: number = 0): AuthorCardProps {
  const meta = author.meta || {}
  
  // Parse expertise areas
  let expertise: string[] = []
  try {
    if (meta.expertise_areas) {
      expertise = JSON.parse(meta.expertise_areas)
    }
  } catch (error) {
    console.warn('Failed to parse expertise_areas for author', author.id)
  }

  return {
    id: author.id,
    slug: author.slug,
    name: meta.name_arabic || author.name,
    title: meta.job_title_arabic,
    avatar: meta.author_avatar || author.avatar_urls?.['96'] || author.avatar_urls?.['48'],
    topics: expertise.slice(0, 3), // Show max 3 topics
    verified: meta.is_verified_author === true || meta.is_verified_author === '1',
    featured: meta.is_featured_author === true || meta.is_featured_author === '1',
    href: `/ar/authors/${author.slug}`,
    articlesCount
  }
}

/**
 * Transform WordPress author to AuthorProfile props
 */
export function transformToAuthorProfile(
  author: WordPressAuthor, 
  stats: { articlesCount: number; programsCount: number; totalViews?: number } = { articlesCount: 0, programsCount: 0 }
): AuthorProfileProps {
  const meta = author.meta || {}
  
  // Parse arrays from JSON strings
  let expertise: string[] = []
  let languages: string[] = []
  let socials: SocialMediaLink[] = []
  
  try {
    if (meta.expertise_areas) {
      expertise = JSON.parse(meta.expertise_areas)
    }
  } catch (error) {
    console.warn('Failed to parse expertise_areas for author', author.id)
  }
  
  try {
    if (meta.languages_spoken) {
      languages = JSON.parse(meta.languages_spoken)
    }
  } catch (error) {
    console.warn('Failed to parse languages_spoken for author', author.id)
  }
  
  try {
    if (meta.social_media_links) {
      socials = JSON.parse(meta.social_media_links)
    }
  } catch (error) {
    console.warn('Failed to parse social_media_links for author', author.id)
  }

  return {
    id: author.id,
    slug: author.slug,
    name: meta.name_arabic || author.name,
    title: meta.job_title_arabic,
    bio: meta.bio_arabic || author.description,
    location: meta.location_arabic,
    avatar: meta.author_avatar || author.avatar_urls?.['96'] || author.avatar_urls?.['48'],
    cover: meta.author_cover_image,
    verified: meta.is_verified_author === true || meta.is_verified_author === '1',
    featured: meta.is_featured_author === true || meta.is_featured_author === '1',
    expertise,
    languages,
    socials,
    stats,
    seo: {
      title: `${meta.name_arabic || author.name} | الكتّاب | زوايا`,
      description: meta.bio_arabic || author.description || `صفحة الكاتب ${meta.name_arabic || author.name} على منصة زوايا`,
      image: meta.author_avatar || author.avatar_urls?.['96']
    }
  }
}

/**
 * Transform array of WordPress authors to AuthorCard props
 */
export function transformToAuthorCards(authors: WordPressAuthor[], articlesCounts: Record<number, number> = {}): AuthorCardProps[] {
  return authors.map(author => transformToAuthorCard(author, articlesCounts[author.id] || 0))
}

/**
 * Create author list props with pagination
 */
export function createAuthorListProps(
  authors: WordPressAuthor[],
  articlesCounts: Record<number, number>,
  pagination: {
    page: number
    perPage: number
    total: number
  },
  filters?: {
    featured?: boolean
    verified?: boolean
    expertise?: string
  }
): AuthorListProps {
  const totalPages = Math.ceil(pagination.total / pagination.perPage)
  
  return {
    authors: transformToAuthorCards(authors, articlesCounts),
    pagination: {
      currentPage: pagination.page,
      totalPages,
      totalItems: pagination.total,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1
    },
    filters
  }
}

/**
 * Validate author SCF fields
 */
export function validateAuthorSCF(meta: Record<string, any>): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check recommended fields
  if (!meta.name_arabic) {
    warnings.push('Missing name_arabic - Arabic name for author')
  }

  if (!meta.job_title_arabic) {
    warnings.push('Missing job_title_arabic - author job title in Arabic')
  }

  if (!meta.bio_arabic) {
    warnings.push('Missing bio_arabic - author biography in Arabic')
  }

  // Validate URL fields
  if (meta.author_avatar && !isValidUrl(meta.author_avatar)) {
    warnings.push('Invalid author_avatar URL format')
  }

  if (meta.author_cover_image && !isValidUrl(meta.author_cover_image)) {
    warnings.push('Invalid author_cover_image URL format')
  }

  // Validate JSON fields
  if (meta.expertise_areas && !isValidJSON(meta.expertise_areas)) {
    errors.push('Invalid expertise_areas - should be valid JSON array')
  }

  if (meta.languages_spoken && !isValidJSON(meta.languages_spoken)) {
    errors.push('Invalid languages_spoken - should be valid JSON array')
  }

  if (meta.social_media_links && !isValidJSON(meta.social_media_links)) {
    errors.push('Invalid social_media_links - should be valid JSON array')
  }

  // Validate social media links structure
  if (meta.social_media_links) {
    try {
      const socials = JSON.parse(meta.social_media_links)
      if (Array.isArray(socials)) {
        socials.forEach((social, index) => {
          if (!social.platform || !social.url) {
            warnings.push(`Social media link ${index + 1} missing platform or url`)
          }
          if (social.url && !isValidUrl(social.url)) {
            warnings.push(`Social media link ${index + 1} has invalid URL format`)
          }
        })
      }
    } catch (error) {
      // Already handled above
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get fallback values for missing author SCF fields
 */
export function getAuthorFallbacks(author: any): Partial<AuthorProfileProps> {
  return {
    name: author.name || 'مؤلف غير معروف',
    title: 'كاتب',
    bio: author.description || 'لا توجد معلومات متاحة عن هذا الكاتب',
    seo: {
      title: `${author.name || 'مؤلف غير معروف'} | الكتّاب | زوايا`,
      description: author.description || 'صفحة كاتب على منصة زوايا',
      image: author.avatar_urls?.['96']
    }
  }
}

/**
 * Generate author cache tags
 */
export function getAuthorCacheTags(author: WordPressAuthor): string[] {
  const tags = ['authors', `author:${author.id}`]
  
  if (author.meta?.is_featured_author === true || author.meta?.is_featured_author === '1') {
    tags.push('featured-authors', 'homepage')
  }
  
  if (author.meta?.is_verified_author === true || author.meta?.is_verified_author === '1') {
    tags.push('verified-authors')
  }
  
  return tags
}

/**
 * Generate author revalidation paths
 */
export function getAuthorRevalidationPaths(author: WordPressAuthor): string[] {
  const paths = [
    '/ar/authors', // Authors list
    `/ar/authors/${author.slug}` // Individual author
  ]
  
  // Add homepage if featured
  if (author.meta?.is_featured_author === true || author.meta?.is_featured_author === '1') {
    paths.push('/ar') // Homepage
  }
  
  return paths
}

/**
 * Get social media platform display name in Arabic
 */
export function getSocialPlatformDisplayName(platform: string): string {
  const platformNames: Record<string, string> = {
    twitter: 'تويتر',
    facebook: 'فيسبوك',
    instagram: 'إنستغرام',
    linkedin: 'لينكد إن',
    youtube: 'يوتيوب',
    website: 'الموقع الشخصي',
    blog: 'المدونة',
    email: 'البريد الإلكتروني'
  }
  
  return platformNames[platform.toLowerCase()] || platform
}

/**
 * Get social media platform icon class
 */
export function getSocialPlatformIcon(platform: string): string {
  const platformIcons: Record<string, string> = {
    twitter: 'twitter',
    facebook: 'facebook',
    instagram: 'instagram',
    linkedin: 'linkedin',
    youtube: 'youtube',
    website: 'globe',
    blog: 'edit',
    email: 'mail'
  }
  
  return platformIcons[platform.toLowerCase()] || 'link'
}

/**
 * Filter authors by expertise area
 */
export function filterAuthorsByExpertise(authors: AuthorCardProps[], expertise: string): AuthorCardProps[] {
  return authors.filter(author => 
    author.topics?.some(topic => 
      topic.toLowerCase().includes(expertise.toLowerCase())
    )
  )
}

/**
 * Sort authors by various criteria
 */
export function sortAuthors(authors: AuthorCardProps[], sortBy: 'name' | 'articles' | 'featured'): AuthorCardProps[] {
  return [...authors].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name, 'ar')
      case 'articles':
        return (b.articlesCount || 0) - (a.articlesCount || 0)
      case 'featured':
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return a.name.localeCompare(b.name, 'ar')
      default:
        return 0
    }
  })
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

function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}