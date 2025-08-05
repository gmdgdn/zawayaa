/**
 * SEO and Metadata Mapping System
 * Maps WordPress SCF fields to SEO metadata, Open Graph, Twitter Cards, and JSON-LD
 */

import { NormalizedWPPost } from './wordpress-transformers'
import { WordPressAuthor } from './scf-mappings/author-mappings'

// SEO metadata interfaces
export interface SEOMetadata {
  title: string
  description: string
  keywords?: string
  canonical?: string
  robots?: string
  language: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export interface OpenGraphMetadata {
  title: string
  description: string
  type: 'article' | 'website' | 'profile' | 'video.episode' | 'music.song'
  url: string
  image?: string
  imageAlt?: string
  siteName: string
  locale: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export interface TwitterCardMetadata {
  card: 'summary' | 'summary_large_image' | 'app' | 'player'
  title: string
  description: string
  image?: string
  imageAlt?: string
  site?: string
  creator?: string
}

export interface JSONLDMetadata {
  '@context': string
  '@type': string
  [key: string]: any
}

// Content type SEO mappings
export const SEO_MAPPINGS = {
  article: {
    title: (post: NormalizedWPPost) => 
      post.zawaya_meta.title_arabic || post.title || 'مقال | زوايا',
    description: (post: NormalizedWPPost) => 
      post.zawaya_meta.meta_description_arabic || 
      post.zawaya_meta.excerpt_arabic || 
      post.excerpt || 
      'مقال على منصة زوايا للمحتوى العربي',
    keywords: (post: NormalizedWPPost) => 
      post.zawaya_meta.keywords_arabic,
    image: (post: NormalizedWPPost) => 
      post.zawaya_meta.social_sharing_image || 
      post.featured_image_url,
    author: (post: NormalizedWPPost) => 
      post.zawaya_meta.author_arabic_name || 
      post.author.name_ar || 
      post.author.name,
    section: (post: NormalizedWPPost) => 
      post.category?.name || 'مقالات',
    tags: (post: NormalizedWPPost) => 
      post.tags?.map(tag => tag.toString()) || []
  },

  program: {
    title: (program: NormalizedWPPost) => 
      program.title || 'برنامج | زوايا',
    description: (program: NormalizedWPPost) => 
      program.excerpt || 'برنامج على منصة زوايا',
    image: (program: NormalizedWPPost) => 
      program.zawaya_meta.cover_image || 
      program.featured_image_url,
    author: (program: NormalizedWPPost) => 
      program.zawaya_meta.host_arabic || 'فريق زوايا',
    section: () => 'البرامج'
  },

  episode: {
    title: (episode: NormalizedWPPost, program?: NormalizedWPPost) => 
      `${episode.title} | ${program?.title || 'برنامج'} | زوايا`,
    description: (episode: NormalizedWPPost) => 
      episode.zawaya_meta.transcript_arabic?.substring(0, 160) || 
      episode.excerpt || 
      'حلقة من برنامج على منصة زوايا',
    image: (episode: NormalizedWPPost) => 
      episode.zawaya_meta.episode_poster || 
      episode.zawaya_meta.episode_thumbnail || 
      episode.featured_image_url,
    author: (episode: NormalizedWPPost, program?: NormalizedWPPost) => 
      program?.zawaya_meta.host_arabic || 'فريق زوايا',
    section: () => 'الحلقات'
  },

  author: {
    title: (author: WordPressAuthor) => 
      `${author.meta?.name_arabic || author.name} | الكتّاب | زوايا`,
    description: (author: WordPressAuthor) => 
      author.meta?.bio_arabic || 
      author.description || 
      `صفحة الكاتب ${author.meta?.name_arabic || author.name} على منصة زوايا`,
    image: (author: WordPressAuthor) => 
      author.meta?.author_avatar || 
      author.avatar_urls?.['96'],
    author: (author: WordPressAuthor) => 
      author.meta?.name_arabic || author.name,
    section: () => 'الكتّاب'
  }
} as const

/**
 * Generate SEO metadata for articles
 */
export function generateArticleSEO(
  post: NormalizedWPPost,
  baseUrl: string = 'https://zawaya.com'
): {
  seo: SEOMetadata
  openGraph: OpenGraphMetadata
  twitterCard: TwitterCardMetadata
  jsonLD: JSONLDMetadata
} {
  const mapping = SEO_MAPPINGS.article
  const url = `${baseUrl}/ar/articles/${post.slug}`

  const seo: SEOMetadata = {
    title: mapping.title(post),
    description: mapping.description(post),
    keywords: mapping.keywords(post),
    canonical: url,
    robots: 'index, follow',
    language: 'ar',
    author: mapping.author(post),
    publishedTime: post.date,
    modifiedTime: post.modified,
    section: mapping.section(post),
    tags: mapping.tags(post)
  }

  const openGraph: OpenGraphMetadata = {
    title: seo.title,
    description: seo.description,
    type: 'article',
    url,
    image: mapping.image(post),
    imageAlt: seo.title,
    siteName: 'زوايا',
    locale: 'ar_SA',
    publishedTime: post.date,
    modifiedTime: post.modified,
    author: seo.author,
    section: seo.section,
    tags: seo.tags
  }

  const twitterCard: TwitterCardMetadata = {
    card: mapping.image(post) ? 'summary_large_image' : 'summary',
    title: seo.title,
    description: seo.description,
    image: mapping.image(post),
    imageAlt: seo.title,
    site: '@zawaya_platform',
    creator: `@${post.author.slug}`
  }

  const jsonLD: JSONLDMetadata = {
    '@context': 'https://schema.org',
    '@type': post.zawaya_meta.is_breaking_news ? 'NewsArticle' : 'Article',
    headline: seo.title,
    description: seo.description,
    image: mapping.image(post),
    author: {
      '@type': 'Person',
      name: seo.author,
      url: `${baseUrl}/ar/authors/${post.author.slug}`
    },
    publisher: {
      '@type': 'Organization',
      name: 'زوايا',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`
      }
    },
    datePublished: post.date,
    dateModified: post.modified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    inLanguage: 'ar',
    ...(seo.keywords && { keywords: seo.keywords }),
    ...(post.zawaya_meta.audio_narration_url && {
      associatedMedia: {
        '@type': 'AudioObject',
        contentUrl: post.zawaya_meta.audio_narration_url,
        duration: post.zawaya_meta.audio_duration ? 
          `PT${post.zawaya_meta.audio_duration}S` : undefined
      }
    })
  }

  return { seo, openGraph, twitterCard, jsonLD }
}

/**
 * Generate SEO metadata for programs
 */
export function generateProgramSEO(
  program: NormalizedWPPost,
  baseUrl: string = 'https://zawaya.com'
): {
  seo: SEOMetadata
  openGraph: OpenGraphMetadata
  twitterCard: TwitterCardMetadata
  jsonLD: JSONLDMetadata
} {
  const mapping = SEO_MAPPINGS.program
  const url = `${baseUrl}/ar/programs/${program.slug}`

  const seo: SEOMetadata = {
    title: mapping.title(program),
    description: mapping.description(program),
    canonical: url,
    robots: 'index, follow',
    language: 'ar',
    author: mapping.author(program),
    publishedTime: program.date,
    modifiedTime: program.modified,
    section: mapping.section()
  }

  const openGraph: OpenGraphMetadata = {
    title: seo.title,
    description: seo.description,
    type: 'website',
    url,
    image: mapping.image(program),
    imageAlt: seo.title,
    siteName: 'زوايا',
    locale: 'ar_SA',
    publishedTime: program.date,
    modifiedTime: program.modified,
    author: seo.author,
    section: seo.section
  }

  const twitterCard: TwitterCardMetadata = {
    card: mapping.image(program) ? 'summary_large_image' : 'summary',
    title: seo.title,
    description: seo.description,
    image: mapping.image(program),
    imageAlt: seo.title,
    site: '@zawaya_platform'
  }

  const programType = program.zawaya_meta.program_type
  const jsonLD: JSONLDMetadata = {
    '@context': 'https://schema.org',
    '@type': programType === 'audio' ? 'PodcastSeries' : 'TVSeries',
    name: seo.title,
    description: seo.description,
    image: mapping.image(program),
    author: {
      '@type': 'Person',
      name: seo.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'زوايا',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`
      }
    },
    datePublished: program.date,
    dateModified: program.modified,
    inLanguage: 'ar',
    numberOfEpisodes: program.zawaya_meta.episode_count || 0,
    ...(program.zawaya_meta.trailer_video && {
      trailer: {
        '@type': 'VideoObject',
        contentUrl: program.zawaya_meta.trailer_video
      }
    })
  }

  return { seo, openGraph, twitterCard, jsonLD }
}

/**
 * Generate SEO metadata for episodes
 */
export function generateEpisodeSEO(
  episode: NormalizedWPPost,
  program?: NormalizedWPPost,
  baseUrl: string = 'https://zawaya.com'
): {
  seo: SEOMetadata
  openGraph: OpenGraphMetadata
  twitterCard: TwitterCardMetadata
  jsonLD: JSONLDMetadata
} {
  const mapping = SEO_MAPPINGS.episode
  const url = `${baseUrl}/ar/episodes/${episode.slug}`

  const seo: SEOMetadata = {
    title: mapping.title(episode, program),
    description: mapping.description(episode),
    canonical: url,
    robots: 'index, follow',
    language: 'ar',
    author: mapping.author(episode, program),
    publishedTime: episode.date,
    modifiedTime: episode.modified,
    section: mapping.section()
  }

  const openGraph: OpenGraphMetadata = {
    title: seo.title,
    description: seo.description,
    type: episode.zawaya_meta.video_embed_url ? 'video.episode' : 'website',
    url,
    image: mapping.image(episode),
    imageAlt: seo.title,
    siteName: 'زوايا',
    locale: 'ar_SA',
    publishedTime: episode.date,
    modifiedTime: episode.modified,
    author: seo.author,
    section: seo.section
  }

  const twitterCard: TwitterCardMetadata = {
    card: mapping.image(episode) ? 'summary_large_image' : 'summary',
    title: seo.title,
    description: seo.description,
    image: mapping.image(episode),
    imageAlt: seo.title,
    site: '@zawaya_platform'
  }

  const hasVideo = !!episode.zawaya_meta.video_embed_url
  const hasAudio = !!episode.zawaya_meta.audio_file_url

  const jsonLD: JSONLDMetadata = {
    '@context': 'https://schema.org',
    '@type': hasVideo ? 'TVEpisode' : 'PodcastEpisode',
    name: episode.title,
    description: seo.description,
    image: mapping.image(episode),
    author: {
      '@type': 'Person',
      name: seo.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'زوايا',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`
      }
    },
    datePublished: episode.date,
    dateModified: episode.modified,
    inLanguage: 'ar',
    ...(episode.zawaya_meta.episode_number && {
      episodeNumber: episode.zawaya_meta.episode_number
    }),
    ...(episode.zawaya_meta.season_number && {
      seasonNumber: episode.zawaya_meta.season_number
    }),
    ...(program && {
      partOfSeries: {
        '@type': hasVideo ? 'TVSeries' : 'PodcastSeries',
        name: program.title,
        url: `${baseUrl}/ar/programs/${program.slug}`
      }
    }),
    ...(episode.zawaya_meta.duration_seconds && {
      duration: `PT${episode.zawaya_meta.duration_seconds}S`
    }),
    ...(hasVideo && episode.zawaya_meta.video_embed_url && {
      associatedMedia: {
        '@type': 'VideoObject',
        contentUrl: episode.zawaya_meta.video_embed_url,
        thumbnailUrl: mapping.image(episode),
        duration: episode.zawaya_meta.duration_seconds ? 
          `PT${episode.zawaya_meta.duration_seconds}S` : undefined
      }
    }),
    ...(hasAudio && episode.zawaya_meta.audio_file_url && {
      associatedMedia: {
        '@type': 'AudioObject',
        contentUrl: episode.zawaya_meta.audio_file_url,
        duration: episode.zawaya_meta.duration_seconds ? 
          `PT${episode.zawaya_meta.duration_seconds}S` : undefined
      }
    })
  }

  return { seo, openGraph, twitterCard, jsonLD }
}

/**
 * Generate SEO metadata for authors
 */
export function generateAuthorSEO(
  author: WordPressAuthor,
  baseUrl: string = 'https://zawaya.com'
): {
  seo: SEOMetadata
  openGraph: OpenGraphMetadata
  twitterCard: TwitterCardMetadata
  jsonLD: JSONLDMetadata
} {
  const mapping = SEO_MAPPINGS.author
  const url = `${baseUrl}/ar/authors/${author.slug}`

  const seo: SEOMetadata = {
    title: mapping.title(author),
    description: mapping.description(author),
    canonical: url,
    robots: 'index, follow',
    language: 'ar',
    author: mapping.author(author),
    section: mapping.section()
  }

  const openGraph: OpenGraphMetadata = {
    title: seo.title,
    description: seo.description,
    type: 'profile',
    url,
    image: mapping.image(author),
    imageAlt: seo.title,
    siteName: 'زوايا',
    locale: 'ar_SA',
    author: seo.author,
    section: seo.section
  }

  const twitterCard: TwitterCardMetadata = {
    card: 'summary',
    title: seo.title,
    description: seo.description,
    image: mapping.image(author),
    imageAlt: seo.title,
    site: '@zawaya_platform'
  }

  // Parse social media links
  let socialLinks: string[] = []
  try {
    if (author.meta?.social_media_links) {
      const socials = JSON.parse(author.meta.social_media_links)
      socialLinks = socials.map((social: any) => social.url).filter(Boolean)
    }
  } catch (error) {
    console.warn('Failed to parse social media links for author', author.id)
  }

  const jsonLD: JSONLDMetadata = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.meta?.name_arabic || author.name,
    description: seo.description,
    image: mapping.image(author),
    url,
    ...(author.meta?.job_title_arabic && {
      jobTitle: author.meta.job_title_arabic
    }),
    ...(socialLinks.length > 0 && {
      sameAs: socialLinks
    }),
    ...(author.meta?.location_arabic && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: author.meta.location_arabic
      }
    }),
    worksFor: {
      '@type': 'Organization',
      name: 'زوايا',
      url: baseUrl
    }
  }

  return { seo, openGraph, twitterCard, jsonLD }
}

/**
 * Generate homepage SEO metadata
 */
export function generateHomepageSEO(
  baseUrl: string = 'https://zawaya.com'
): {
  seo: SEOMetadata
  openGraph: OpenGraphMetadata
  twitterCard: TwitterCardMetadata
  jsonLD: JSONLDMetadata
} {
  const url = `${baseUrl}/ar`

  const seo: SEOMetadata = {
    title: 'زوايا | القصة من كل زواياها',
    description: 'منصة زوايا للمحتوى العربي - مقالات وبرامج ومحتوى صوتي ومرئي يغطي أهم القضايا المعاصرة',
    canonical: url,
    robots: 'index, follow',
    language: 'ar'
  }

  const openGraph: OpenGraphMetadata = {
    title: seo.title,
    description: seo.description,
    type: 'website',
    url,
    image: `${baseUrl}/images/og-homepage.jpg`,
    imageAlt: 'زوايا - القصة من كل زواياها',
    siteName: 'زوايا',
    locale: 'ar_SA'
  }

  const twitterCard: TwitterCardMetadata = {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    image: `${baseUrl}/images/og-homepage.jpg`,
    imageAlt: 'زوايا - القصة من كل زواياها',
    site: '@zawaya_platform'
  }

  const jsonLD: JSONLDMetadata = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'زوايا',
    description: seo.description,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/images/logo.png`
    },
    sameAs: [
      'https://twitter.com/zawaya_platform',
      'https://facebook.com/zawaya.platform',
      'https://instagram.com/zawaya.platform'
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/ar/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  return { seo, openGraph, twitterCard, jsonLD }
}

/**
 * Generate category page SEO metadata
 */
export function generateCategorySEO(
  category: { id: number; name: string; slug: string; description?: string },
  baseUrl: string = 'https://zawaya.com'
): {
  seo: SEOMetadata
  openGraph: OpenGraphMetadata
  twitterCard: TwitterCardMetadata
  jsonLD: JSONLDMetadata
} {
  const url = `${baseUrl}/ar/articles/category/${category.slug}`

  const seo: SEOMetadata = {
    title: `${category.name} | المقالات | زوايا`,
    description: category.description || `مقالات في فئة ${category.name} على منصة زوايا`,
    canonical: url,
    robots: 'index, follow',
    language: 'ar',
    section: category.name
  }

  const openGraph: OpenGraphMetadata = {
    title: seo.title,
    description: seo.description,
    type: 'website',
    url,
    siteName: 'زوايا',
    locale: 'ar_SA',
    section: category.name
  }

  const twitterCard: TwitterCardMetadata = {
    card: 'summary',
    title: seo.title,
    description: seo.description,
    site: '@zawaya_platform'
  }

  const jsonLD: JSONLDMetadata = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seo.title,
    description: seo.description,
    url,
    inLanguage: 'ar',
    isPartOf: {
      '@type': 'WebSite',
      name: 'زوايا',
      url: baseUrl
    }
  }

  return { seo, openGraph, twitterCard, jsonLD }
}

/**
 * Convert metadata to HTML meta tags
 */
export function generateMetaTags(metadata: {
  seo: SEOMetadata
  openGraph: OpenGraphMetadata
  twitterCard: TwitterCardMetadata
}): Array<{ name?: string; property?: string; content: string }> {
  const tags: Array<{ name?: string; property?: string; content: string }> = []

  // Basic SEO tags
  tags.push({ name: 'description', content: metadata.seo.description })
  if (metadata.seo.keywords) {
    tags.push({ name: 'keywords', content: metadata.seo.keywords })
  }
  if (metadata.seo.author) {
    tags.push({ name: 'author', content: metadata.seo.author })
  }
  if (metadata.seo.robots) {
    tags.push({ name: 'robots', content: metadata.seo.robots })
  }

  // Open Graph tags
  tags.push({ property: 'og:title', content: metadata.openGraph.title })
  tags.push({ property: 'og:description', content: metadata.openGraph.description })
  tags.push({ property: 'og:type', content: metadata.openGraph.type })
  tags.push({ property: 'og:url', content: metadata.openGraph.url })
  tags.push({ property: 'og:site_name', content: metadata.openGraph.siteName })
  tags.push({ property: 'og:locale', content: metadata.openGraph.locale })
  
  if (metadata.openGraph.image) {
    tags.push({ property: 'og:image', content: metadata.openGraph.image })
    if (metadata.openGraph.imageAlt) {
      tags.push({ property: 'og:image:alt', content: metadata.openGraph.imageAlt })
    }
  }

  if (metadata.openGraph.publishedTime) {
    tags.push({ property: 'article:published_time', content: metadata.openGraph.publishedTime })
  }
  if (metadata.openGraph.modifiedTime) {
    tags.push({ property: 'article:modified_time', content: metadata.openGraph.modifiedTime })
  }
  if (metadata.openGraph.author) {
    tags.push({ property: 'article:author', content: metadata.openGraph.author })
  }
  if (metadata.openGraph.section) {
    tags.push({ property: 'article:section', content: metadata.openGraph.section })
  }

  // Twitter Card tags
  tags.push({ name: 'twitter:card', content: metadata.twitterCard.card })
  tags.push({ name: 'twitter:title', content: metadata.twitterCard.title })
  tags.push({ name: 'twitter:description', content: metadata.twitterCard.description })
  
  if (metadata.twitterCard.image) {
    tags.push({ name: 'twitter:image', content: metadata.twitterCard.image })
    if (metadata.twitterCard.imageAlt) {
      tags.push({ name: 'twitter:image:alt', content: metadata.twitterCard.imageAlt })
    }
  }
  
  if (metadata.twitterCard.site) {
    tags.push({ name: 'twitter:site', content: metadata.twitterCard.site })
  }
  if (metadata.twitterCard.creator) {
    tags.push({ name: 'twitter:creator', content: metadata.twitterCard.creator })
  }

  return tags
}

/**
 * Generate sitemap entries for content
 */
export function generateSitemapEntries(
  content: Array<{
    slug: string
    type: 'article' | 'program' | 'episode' | 'author'
    lastModified: string
    priority?: number
  }>,
  baseUrl: string = 'https://zawaya.com'
): Array<{
  url: string
  lastModified: string
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}> {
  return content.map(item => {
    const pathMap = {
      article: '/ar/articles/',
      program: '/ar/programs/',
      episode: '/ar/episodes/',
      author: '/ar/authors/'
    }

    const changeFreqMap = {
      article: 'weekly' as const,
      program: 'monthly' as const,
      episode: 'monthly' as const,
      author: 'monthly' as const
    }

    const priorityMap = {
      article: 0.8,
      program: 0.7,
      episode: 0.6,
      author: 0.5
    }

    return {
      url: `${baseUrl}${pathMap[item.type]}${item.slug}`,
      lastModified: item.lastModified,
      changeFreq: changeFreqMap[item.type],
      priority: item.priority || priorityMap[item.type]
    }
  })
}