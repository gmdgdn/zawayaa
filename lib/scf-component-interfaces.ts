/**
 * SCF Component Interfaces
 * Consolidated component prop interfaces with SCF field bindings
 * Maps all WordPress SCF fields to Next.js component props
 */

// Re-export all component interfaces from individual mappings
export type {
  ArticleCardProps,
  ArticleDetailProps,
  ArticleListProps,
} from './scf-mappings/article-mappings'

export type {
  ProgramCardProps,
  ProgramDetailProps,
  EpisodeCardProps,
  EpisodeDetailProps,
} from './scf-mappings/program-mappings'

export type {
  AuthorCardProps,
  AuthorProfileProps,
  AuthorListProps,
  SocialMediaLink
} from './scf-mappings/author-mappings'

// Common interfaces used across components
export interface BaseContentProps {
  id: number
  slug: string
  title: string
  href: string
  publishedAt: string
}

export interface SEOProps {
  title: string
  description: string
  image?: string
  keywords?: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

// Homepage component interfaces
export interface HomepageHeroProps {
  featuredArticle?: {
    id: number
    slug: string
    title: string
    excerpt: string
    image?: string
    categoryColor?: string
    audioUrl?: string
    readTime?: number
    author: {
      name: string
      avatar?: string
    }
    href: string
  }
}

export interface HomepageArticlesProps {
  articles: Array<{
    id: number
    slug: string
    title: string
    excerpt: string
    image?: string
    categoryColor?: string
    featured?: boolean
    audioUrl?: string
    readTime?: number
    author: {
      name: string
      avatar?: string
    }
    href: string
    publishedAt: string
  }>
  sectionTitle: string
  viewAllHref: string
}

export interface HomepageProgramsProps {
  programs: Array<{
    id: number
    slug: string
    title: string
    host: string
    cover: string
    type: 'video' | 'audio' | 'mixed'
    episodeCount: number
    themeColor?: string
    href: string
  }>
  sectionTitle: string
  viewAllHref: string
}

export interface HomepageAuthorsProps {
  authors: Array<{
    id: number
    slug: string
    name: string
    title?: string
    avatar?: string
    verified?: boolean
    featured?: boolean
    href: string
  }>
  sectionTitle: string
  viewAllHref: string
}

// Navigation and layout interfaces
export interface NavigationProps {
  currentPath: string
  menuItems: Array<{
    label: string
    href: string
    children?: Array<{
      label: string
      href: string
    }>
  }>
}

export interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
  }>
}

// Search component interfaces
export interface SearchResultsProps {
  query: string
  results: {
    articles: Array<{
      id: number
      slug: string
      title: string
      excerpt: string
      categoryColor?: string
      readTime?: number
      author: {
        name: string
      }
      href: string
      publishedAt: string
    }>
    programs: Array<{
      id: number
      slug: string
      title: string
      host: string
      type: 'video' | 'audio' | 'mixed'
      episodeCount: number
      href: string
    }>
    episodes: Array<{
      id: number
      slug: string
      title: string
      programTitle: string
      duration?: number
      href: string
      publishedAt: string
    }>
  }
  pagination: PaginationProps
}

// Category and tag interfaces
export interface CategoryPageProps {
  category: {
    id: number
    name: string
    slug: string
    description?: string
    color?: string
  }
  articles: Array<{
    id: number
    slug: string
    title: string
    excerpt: string
    image?: string
    categoryColor?: string
    readTime?: number
    author: {
      name: string
    }
    href: string
    publishedAt: string
  }>
  pagination: PaginationProps
}

export interface TagPageProps {
  tag: {
    id: number
    name: string
    slug: string
    description?: string
  }
  articles: Array<{
    id: number
    slug: string
    title: string
    excerpt: string
    categoryColor?: string
    readTime?: number
    author: {
      name: string
    }
    href: string
    publishedAt: string
  }>
  pagination: PaginationProps
}

// Media player interfaces
export interface AudioPlayerProps {
  title: string
  audioUrl: string
  duration?: number
  poster?: string
  autoPlay?: boolean
  showPlaylist?: boolean
  transcript?: string
}

export interface VideoPlayerProps {
  title: string
  videoUrl: string
  poster?: string
  duration?: number
  autoPlay?: boolean
  showControls?: boolean
  transcript?: string
}

// Newsletter and subscription interfaces
export interface NewsletterSignupProps {
  title: string
  description: string
  placeholder: string
  buttonText: string
  variant?: 'default' | 'compact' | 'hero'
}

// Error and loading state interfaces
export interface ErrorStateProps {
  title: string
  message: string
  actionLabel?: string
  actionHref?: string
  showRetry?: boolean
}

export interface LoadingStateProps {
  message?: string
  variant?: 'spinner' | 'skeleton' | 'dots'
}

// Form interfaces
export interface ContactFormProps {
  fields: Array<{
    name: string
    label: string
    type: 'text' | 'email' | 'textarea' | 'select'
    required?: boolean
    options?: string[]
  }>
  submitLabel: string
  successMessage: string
}

export interface WriterSubmissionFormProps {
  fields: Array<{
    name: string
    label: string
    type: 'text' | 'email' | 'textarea' | 'file'
    required?: boolean
    maxLength?: number
  }>
  guidelines: string[]
  submitLabel: string
}

// Social sharing interfaces
export interface SocialShareProps {
  url: string
  title: string
  description?: string
  image?: string
  platforms: Array<'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'telegram' | 'copy'>
}

// Comment system interfaces (if implemented)
export interface CommentsProps {
  contentId: number
  contentType: 'article' | 'episode'
  comments: Array<{
    id: number
    author: {
      name: string
      avatar?: string
    }
    content: string
    publishedAt: string
    replies?: Array<{
      id: number
      author: {
        name: string
        avatar?: string
      }
      content: string
      publishedAt: string
    }>
  }>
  allowComments: boolean
}

// Analytics and tracking interfaces
export interface AnalyticsProps {
  contentId: number
  contentType: 'article' | 'program' | 'episode'
  title: string
  author?: string
  category?: string
  tags?: string[]
}

// Accessibility interfaces
export interface AccessibilityProps {
  skipLinks: Array<{
    href: string
    label: string
  }>
  announcements?: string[]
}

// Theme and styling interfaces
export interface ThemeProps {
  primaryColor?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
  rtl: boolean
}

// Component validation interfaces
export interface ComponentValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  missingFields: string[]
  fallbacksUsed: string[]
}

/**
 * Validate component props against SCF requirements
 */
export function validateComponentProps<T extends Record<string, any>>(
  props: T,
  requiredFields: (keyof T)[],
  optionalFields: (keyof T)[] = []
): ComponentValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const missingFields: string[] = []
  const fallbacksUsed: string[] = []

  // Check required fields
  requiredFields.forEach(field => {
    if (props[field] === undefined || props[field] === null || props[field] === '') {
      errors.push(`Missing required field: ${String(field)}`)
      missingFields.push(String(field))
    }
  })

  // Check optional fields and note when fallbacks might be used
  optionalFields.forEach(field => {
    if (props[field] === undefined || props[field] === null || props[field] === '') {
      warnings.push(`Optional field missing: ${String(field)}`)
      fallbacksUsed.push(String(field))
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missingFields,
    fallbacksUsed
  }
}

/**
 * Create fallback props for missing SCF data
 */
export function createFallbackProps<T extends Record<string, any>>(
  props: Partial<T>,
  fallbacks: Partial<T>
): T {
  const result = { ...props } as T

  Object.keys(fallbacks).forEach(key => {
    if (result[key as keyof T] === undefined || result[key as keyof T] === null || result[key as keyof T] === '') {
      result[key as keyof T] = fallbacks[key as keyof T] as T[keyof T]
    }
  })

  return result
}

/**
 * Transform SCF data to component props with validation
 */
export function transformSCFToProps<T extends Record<string, any>>(
  scfData: Record<string, any>,
  mapping: Record<keyof T, string>,
  fallbacks: Partial<T> = {}
): { props: T; validation: ComponentValidationResult } {
  const props = {} as T

  // Map SCF fields to component props
  Object.keys(mapping).forEach(propKey => {
    const scfKey = mapping[propKey as keyof T]
    props[propKey as keyof T] = scfData[scfKey] || fallbacks[propKey as keyof T]
  })

  // Apply remaining fallbacks
  const finalProps = createFallbackProps(props, fallbacks)

  // Validate the result
  const validation = validateComponentProps(
    finalProps,
    Object.keys(mapping) as (keyof T)[],
    Object.keys(fallbacks) as (keyof T)[]
  )

  return {
    props: finalProps,
    validation
  }
}

/**
 * Generate component cache tags based on props
 */
export function generateComponentCacheTags(
  componentType: string,
  props: Record<string, any>
): string[] {
  const tags = [componentType]

  // Add content-specific tags
  if (props.id) {
    tags.push(`${componentType}:${props.id}`)
  }

  if (props.slug) {
    tags.push(`${componentType}-slug:${props.slug}`)
  }

  // Add type-specific tags
  if (props.type) {
    tags.push(`${componentType}-type:${props.type}`)
  }

  if (props.category) {
    tags.push(`category:${props.category}`)
  }

  if (props.author?.id) {
    tags.push(`author:${props.author.id}`)
  }

  if (props.featured) {
    tags.push(`featured-${componentType}`)
  }

  return tags
}

/**
 * Create responsive image props from SCF data
 */
export function createImageProps(
  imageUrl?: string,
  alt?: string,
  fallbackUrl: string = '/images/placeholder.jpg'
): {
  src: string
  alt: string
  sizes: string
} {
  return {
    src: imageUrl || fallbackUrl,
    alt: alt || 'صورة',
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
}

/**
 * Format Arabic date for display
 */
export function formatArabicDate(
  dateString: string,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const date = new Date(dateString)
  
  switch (format) {
    case 'long':
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    case 'relative':
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
      
      if (diffInHours < 1) return 'منذ أقل من ساعة'
      if (diffInHours < 24) return `منذ ${diffInHours} ساعة`
      if (diffInHours < 48) return 'منذ يوم واحد'
      
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `منذ ${diffInDays} أيام`
      
      return date.toLocaleDateString('ar-SA')
    default:
      return date.toLocaleDateString('ar-SA')
  }
}

/**
 * Create SEO meta tags from component props
 */
export function createSEOMetaTags(seo: SEOProps, baseUrl: string = ''): Array<{
  name?: string
  property?: string
  content: string
}> {
  return [
    { name: 'description', content: seo.description },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
    { property: 'og:type', content: 'article' },
    ...(seo.image ? [{ property: 'og:image', content: seo.image }] : []),
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:title', content: seo.title },
    { property: 'twitter:description', content: seo.description },
    ...(seo.image ? [{ property: 'twitter:image', content: seo.image }] : []),
    ...(seo.keywords ? [{ name: 'keywords', content: seo.keywords }] : [])
  ]
}