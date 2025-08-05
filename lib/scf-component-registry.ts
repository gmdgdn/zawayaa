/**
 * SCF Component Registry
 * Central registry mapping components to their SCF field requirements
 */

import type {
  ArticleCardProps,
  ArticleDetailProps,
  ProgramCardProps,
  ProgramDetailProps,
  EpisodeCardProps,
  EpisodeDetailProps,
  AuthorCardProps,
  AuthorProfileProps
} from './scf-component-interfaces'

// Component SCF field mappings
export const COMPONENT_SCF_MAPPINGS = {
  ArticleCard: {
    requiredFields: ['id', 'slug', 'title', 'href'],
    scfMappings: {
      title: 'title_arabic',
      excerpt: 'excerpt_arabic',
      readTime: 'reading_time_minutes',
      categoryColor: 'category_color',
      featured: 'is_featured',
      audioUrl: 'audio_narration_url',
      authorName: 'author_arabic_name'
    },
    fallbacks: {
      title: 'post.title.rendered',
      excerpt: 'post.excerpt.rendered',
      readTime: 5,
      categoryColor: '#6366f1',
      featured: false,
      authorName: 'post.author.name'
    }
  },

  ArticleDetail: {
    requiredFields: ['id', 'slug', 'title', 'content'],
    scfMappings: {
      title: 'title_arabic',
      content: 'content_arabic',
      excerpt: 'excerpt_arabic',
      authorName: 'author_arabic_name',
      authorBio: 'author_bio_arabic',
      audioUrl: 'audio_narration_url',
      audioDuration: 'audio_duration',
      readTime: 'reading_time_minutes',
      categoryColor: 'category_color',
      socialImage: 'social_sharing_image',
      featured: 'is_featured',
      breakingNews: 'is_breaking_news',
      seoTitle: 'title_arabic',
      seoDescription: 'meta_description_arabic',
      seoKeywords: 'keywords_arabic'
    },
    fallbacks: {
      title: 'post.title.rendered',
      content: 'post.content.rendered',
      excerpt: 'post.excerpt.rendered',
      authorName: 'post.author.name',
      readTime: 5,
      categoryColor: '#6366f1',
      featured: false,
      breakingNews: false,
      seoTitle: 'post.title.rendered',
      seoDescription: 'post.excerpt.rendered'
    }
  },

  ProgramCard: {
    requiredFields: ['id', 'slug', 'title', 'href'],
    scfMappings: {
      title: 'program.title',
      host: 'host_arabic',
      cover: 'cover_image',
      type: 'program_type',
      episodeCount: 'episode_count',
      themeColor: 'theme_color',
      rating: 'program_rating',
      subscriberCount: 'subscriber_count'
    },
    fallbacks: {
      host: 'مقدم غير محدد',
      cover: '/images/placeholder-program.jpg',
      type: 'mixed',
      episodeCount: 0,
      themeColor: '#6366f1'
    }
  },

  ProgramDetail: {
    requiredFields: ['id', 'slug', 'title'],
    scfMappings: {
      title: 'program.title',
      description: 'program.content',
      host: 'host_arabic',
      cover: 'cover_image',
      type: 'program_type',
      themeColor: 'theme_color',
      trailerVideo: 'trailer_video',
      episodeCount: 'episode_count',
      averageDuration: 'average_duration',
      subscriberCount: 'subscriber_count',
      rating: 'program_rating'
    },
    fallbacks: {
      description: 'برنامج على منصة زوايا',
      host: 'مقدم غير محدد',
      cover: '/images/placeholder-program.jpg',
      type: 'mixed',
      themeColor: '#6366f1',
      episodeCount: 0
    }
  },

  EpisodeCard: {
    requiredFields: ['id', 'slug', 'title', 'href'],
    scfMappings: {
      title: 'episode.title',
      thumbnail: 'episode_thumbnail',
      duration: 'duration_seconds',
      episodeNumber: 'episode_number',
      seasonNumber: 'season_number'
    },
    fallbacks: {
      thumbnail: '/images/placeholder-episode.jpg'
    }
  },

  EpisodeDetail: {
    requiredFields: ['id', 'slug', 'title'],
    scfMappings: {
      title: 'episode.title',
      description: 'episode.content',
      videoUrl: 'video_embed_url',
      audioUrl: 'audio_file_url',
      poster: 'episode_poster',
      thumbnail: 'episode_thumbnail',
      seasonNumber: 'season_number',
      episodeNumber: 'episode_number',
      duration: 'duration_seconds',
      transcript: 'transcript_arabic',
      gallery: 'episode_gallery',
      tags: 'episode_tags_arabic',
      scheduledPublish: 'scheduled_publish'
    },
    fallbacks: {
      description: 'حلقة من برنامج على منصة زوايا',
      poster: '/images/placeholder-episode.jpg'
    }
  },

  AuthorCard: {
    requiredFields: ['id', 'slug', 'name', 'href'],
    scfMappings: {
      name: 'name_arabic',
      title: 'job_title_arabic',
      avatar: 'author_avatar',
      verified: 'is_verified_author',
      featured: 'is_featured_author',
      topics: 'expertise_areas'
    },
    fallbacks: {
      name: 'user.name',
      title: 'كاتب',
      avatar: '/images/placeholder-avatar.jpg',
      verified: false,
      featured: false,
      topics: []
    }
  },

  AuthorProfile: {
    requiredFields: ['id', 'slug', 'name'],
    scfMappings: {
      name: 'name_arabic',
      title: 'job_title_arabic',
      bio: 'bio_arabic',
      location: 'location_arabic',
      avatar: 'author_avatar',
      cover: 'author_cover_image',
      verified: 'is_verified_author',
      featured: 'is_featured_author',
      expertise: 'expertise_areas',
      languages: 'languages_spoken',
      socials: 'social_media_links'
    },
    fallbacks: {
      name: 'user.name',
      title: 'كاتب',
      bio: 'user.description',
      avatar: '/images/placeholder-avatar.jpg',
      verified: false,
      featured: false,
      expertise: [],
      languages: [],
      socials: []
    }
  }
} as const

// Component validation rules
export const COMPONENT_VALIDATION_RULES = {
  ArticleCard: {
    required: ['id', 'slug', 'title', 'href'],
    optional: ['excerpt', 'image', 'readTime', 'categoryColor', 'featured', 'audioUrl', 'author'],
    validation: {
      id: (value: any) => typeof value === 'number' && value > 0,
      slug: (value: any) => typeof value === 'string' && value.length > 0,
      title: (value: any) => typeof value === 'string' && value.length > 0,
      href: (value: any) => typeof value === 'string' && value.startsWith('/'),
      readTime: (value: any) => !value || (typeof value === 'number' && value > 0),
      categoryColor: (value: any) => !value || /^#[0-9A-Fa-f]{6}$/.test(value)
    }
  },

  ArticleDetail: {
    required: ['id', 'slug', 'title', 'content'],
    optional: ['excerpt', 'authorName', 'authorBio', 'audioUrl', 'audioDuration', 'readTime', 'categoryColor', 'socialImage', 'featured', 'breakingNews', 'seo'],
    validation: {
      id: (value: any) => typeof value === 'number' && value > 0,
      slug: (value: any) => typeof value === 'string' && value.length > 0,
      title: (value: any) => typeof value === 'string' && value.length > 0,
      content: (value: any) => typeof value === 'string' && value.length > 0,
      audioDuration: (value: any) => !value || (typeof value === 'number' && value > 0),
      readTime: (value: any) => !value || (typeof value === 'number' && value > 0)
    }
  },

  ProgramCard: {
    required: ['id', 'slug', 'title', 'href'],
    optional: ['host', 'cover', 'type', 'episodeCount', 'themeColor', 'rating', 'subscriberCount'],
    validation: {
      id: (value: any) => typeof value === 'number' && value > 0,
      slug: (value: any) => typeof value === 'string' && value.length > 0,
      title: (value: any) => typeof value === 'string' && value.length > 0,
      href: (value: any) => typeof value === 'string' && value.startsWith('/'),
      type: (value: any) => !value || ['video', 'audio', 'mixed'].includes(value),
      episodeCount: (value: any) => !value || (typeof value === 'number' && value >= 0),
      rating: (value: any) => !value || (typeof value === 'number' && value >= 0 && value <= 5)
    }
  },

  AuthorCard: {
    required: ['id', 'slug', 'name', 'href'],
    optional: ['title', 'avatar', 'topics', 'verified', 'featured', 'articlesCount'],
    validation: {
      id: (value: any) => typeof value === 'number' && value > 0,
      slug: (value: any) => typeof value === 'string' && value.length > 0,
      name: (value: any) => typeof value === 'string' && value.length > 0,
      href: (value: any) => typeof value === 'string' && value.startsWith('/'),
      topics: (value: any) => !value || Array.isArray(value),
      articlesCount: (value: any) => !value || (typeof value === 'number' && value >= 0)
    }
  }
} as const

/**
 * Validate component props against registry rules
 */
export function validateComponentAgainstRegistry<T extends keyof typeof COMPONENT_VALIDATION_RULES>(
  componentType: T,
  props: Record<string, any>
): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const rules = COMPONENT_VALIDATION_RULES[componentType]
  const errors: string[] = []
  const warnings: string[] = []

  // Check required fields
  rules.required.forEach(field => {
    if (!(field in props) || props[field] === undefined || props[field] === null) {
      errors.push(`Missing required field: ${field}`)
    } else if (rules.validation[field] && !rules.validation[field](props[field])) {
      errors.push(`Invalid value for required field: ${field}`)
    }
  })

  // Check optional fields
  rules.optional.forEach(field => {
    if (field in props && props[field] !== undefined && props[field] !== null) {
      if (rules.validation[field] && !rules.validation[field](props[field])) {
        warnings.push(`Invalid value for optional field: ${field}`)
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get SCF mapping for a component
 */
export function getSCFMappingForComponent<T extends keyof typeof COMPONENT_SCF_MAPPINGS>(
  componentType: T
): typeof COMPONENT_SCF_MAPPINGS[T] {
  return COMPONENT_SCF_MAPPINGS[componentType]
}

/**
 * Transform WordPress data to component props using registry
 */
export function transformWordPressDataToComponentProps<T extends keyof typeof COMPONENT_SCF_MAPPINGS>(
  componentType: T,
  wpData: Record<string, any>,
  scfData: Record<string, any> = {}
): {
  props: Record<string, any>
  validation: { valid: boolean; errors: string[]; warnings: string[] }
} {
  const mapping = COMPONENT_SCF_MAPPINGS[componentType]
  const props: Record<string, any> = {}

  // Apply SCF mappings
  Object.entries(mapping.scfMappings).forEach(([propKey, scfKey]) => {
    const value = scfData[scfKey] || getNestedValue(wpData, scfKey)
    if (value !== undefined && value !== null && value !== '') {
      props[propKey] = value
    }
  })

  // Apply fallbacks for missing values
  Object.entries(mapping.fallbacks).forEach(([propKey, fallbackValue]) => {
    if (!(propKey in props) || props[propKey] === undefined || props[propKey] === null || props[propKey] === '') {
      if (typeof fallbackValue === 'string' && fallbackValue.includes('.')) {
        // Handle nested fallback paths like 'post.title.rendered'
        const nestedValue = getNestedValue(wpData, fallbackValue)
        props[propKey] = nestedValue || fallbackValue
      } else {
        props[propKey] = fallbackValue
      }
    }
  })

  // Validate the result
  const validation = validateComponentAgainstRegistry(componentType, props)

  return {
    props,
    validation
  }
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

/**
 * Generate component documentation from registry
 */
export function generateComponentDocumentation(): Record<string, {
  description: string
  requiredProps: string[]
  optionalProps: string[]
  scfMappings: Record<string, string>
  fallbacks: Record<string, any>
  examples: Record<string, any>
}> {
  return {
    ArticleCard: {
      description: 'Card component for displaying article previews with SCF data',
      requiredProps: COMPONENT_VALIDATION_RULES.ArticleCard.required,
      optionalProps: COMPONENT_VALIDATION_RULES.ArticleCard.optional,
      scfMappings: COMPONENT_SCF_MAPPINGS.ArticleCard.scfMappings,
      fallbacks: COMPONENT_SCF_MAPPINGS.ArticleCard.fallbacks,
      examples: {
        minimal: {
          id: 123,
          slug: 'sample-article',
          title: 'عنوان المقال',
          href: '/ar/articles/sample-article'
        },
        complete: {
          id: 123,
          slug: 'sample-article',
          title: 'عنوان المقال',
          excerpt: 'ملخص المقال',
          href: '/ar/articles/sample-article',
          image: '/images/article.jpg',
          readTime: 5,
          categoryColor: '#3b82f6',
          featured: true,
          audioUrl: '/audio/article.mp3',
          author: {
            name: 'اسم الكاتب',
            avatar: '/images/author.jpg'
          },
          publishedAt: '2024-01-01T00:00:00Z'
        }
      }
    },

    ProgramCard: {
      description: 'Card component for displaying program previews with SCF data',
      requiredProps: COMPONENT_VALIDATION_RULES.ProgramCard.required,
      optionalProps: COMPONENT_VALIDATION_RULES.ProgramCard.optional,
      scfMappings: COMPONENT_SCF_MAPPINGS.ProgramCard.scfMappings,
      fallbacks: COMPONENT_SCF_MAPPINGS.ProgramCard.fallbacks,
      examples: {
        minimal: {
          id: 456,
          slug: 'sample-program',
          title: 'اسم البرنامج',
          href: '/ar/programs/sample-program'
        },
        complete: {
          id: 456,
          slug: 'sample-program',
          title: 'اسم البرنامج',
          host: 'مقدم البرنامج',
          cover: '/images/program.jpg',
          type: 'video',
          episodeCount: 25,
          themeColor: '#10b981',
          rating: 4.5,
          subscriberCount: 1500,
          href: '/ar/programs/sample-program'
        }
      }
    },

    AuthorCard: {
      description: 'Card component for displaying author profiles with SCF data',
      requiredProps: COMPONENT_VALIDATION_RULES.AuthorCard.required,
      optionalProps: COMPONENT_VALIDATION_RULES.AuthorCard.optional,
      scfMappings: COMPONENT_SCF_MAPPINGS.AuthorCard.scfMappings,
      fallbacks: COMPONENT_SCF_MAPPINGS.AuthorCard.fallbacks,
      examples: {
        minimal: {
          id: 789,
          slug: 'sample-author',
          name: 'اسم الكاتب',
          href: '/ar/authors/sample-author'
        },
        complete: {
          id: 789,
          slug: 'sample-author',
          name: 'اسم الكاتب',
          title: 'كاتب وصحفي',
          avatar: '/images/author.jpg',
          topics: ['السياسة', 'الثقافة', 'التاريخ'],
          verified: true,
          featured: true,
          articlesCount: 42,
          href: '/ar/authors/sample-author'
        }
      }
    }
  }
}

// Export types for component registry
export type ComponentType = keyof typeof COMPONENT_SCF_MAPPINGS
export type ComponentProps<T extends ComponentType> = Record<string, any>
export type SCFMapping<T extends ComponentType> = typeof COMPONENT_SCF_MAPPINGS[T]