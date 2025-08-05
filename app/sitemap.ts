import { MetadataRoute } from 'next'
import { wpClient } from '@/lib/wordpress'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zawaya.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []

  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ar/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/programs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/podcast`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ar/writers`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  sitemap.push(...staticPages)

  try {
    // Get published articles from WordPress
    const articles = await wpClient.listPosts({ 
      per_page: 100,
      status: 'publish'
    })

    articles.forEach(article => {
      sitemap.push({
        url: `${baseUrl}/ar/articles/${article.slug}`,
        lastModified: new Date(article.modified),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })

    // Get programs from WordPress custom post type
    try {
      const programs = await wpClient.wpGet('/wp/v2/programs', { 
        per_page: 100,
        status: 'publish'
      })

      programs.forEach((program: any) => {
        sitemap.push({
          url: `${baseUrl}/ar/programs/${program.slug}`,
          lastModified: new Date(program.modified),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      })
    } catch (error) {
      console.log('Programs not yet configured in WordPress:', error.message)
    }

    // Get episodes from WordPress custom post type
    try {
      const episodes = await wpClient.wpGet('/wp/v2/episodes', { 
        per_page: 100,
        status: 'publish'
      })

      episodes.forEach((episode: any) => {
        sitemap.push({
          url: `${baseUrl}/ar/episodes/${episode.slug}`,
          lastModified: new Date(episode.modified),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      })
    } catch (error) {
      console.log('Episodes not yet configured in WordPress:', error.message)
    }

  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return sitemap
}