import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPrograms, getEpisode, getProgram, getEpisodesByProgram, WPEpisode, WPProgram } from '@/lib/wp'
import { transformToEpisodeDetail } from '@/lib/scf-mappings/episode'
import { EpisodePlayer } from '@/components/EpisodePlayer'
import { TranscriptAccordion } from '@/components/TranscriptAccordion'
import { ChaptersList } from '@/components/ChaptersList'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Clock, ExternalLink, Tag } from 'lucide-react'

interface EpisodePageProps {
  params: {
    slug: string
  }
}

// Generate static params for all episodes
export async function generateStaticParams() {
  try {
    // Get all programs first
    const programs = await getPrograms({ per_page: 100 })
    const allEpisodes = []
    
    // Get episodes for each program
    for (const program of programs) {
      try {
        const episodes = await getEpisodesByProgram(program.id, { per_page: 100 })
        allEpisodes.push(...episodes)
      } catch (error) {
        console.warn(`Failed to fetch episodes for program ${program.id}:`, error)
      }
    }
    
    return allEpisodes.map((episode) => ({
      slug: episode.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for episodes:', error)
    return []
  }
}

// Generate metadata for the episode page
export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  try {
    const episode = await getEpisode(params.slug)
    
    if (!episode) {
      return {
        title: 'الحلقة غير موجودة - زوايا',
        description: 'الحلقة المطلوبة غير متاحة',
      }
    }

    // Get parent program for context
    let program: WPProgram | null = null
    if (episode.parent) {
      try {
        // First get all programs to find the one with matching ID
        const programs = await getPrograms({ per_page: 100 })
        program = programs.find(p => p.id === episode.parent) || null
      } catch (error) {
        console.warn('Failed to fetch parent program:', error)
      }
    }

    const title = episode.title.rendered
    const programTitle = program?.title.rendered || 'زوايا'
    const description = episode.excerpt.rendered.replace(/<[^>]*>/g, '') || `حلقة من برنامج ${programTitle}`
    const image = episode.meta.episode_poster || episode.meta.episode_thumbnail || episode._embedded?.['wp:featuredmedia']?.[0]?.source_url

    return {
      title: `${title} | ${programTitle} - زوايا`,
      description,
      openGraph: {
        title: `${title} | ${programTitle} - زوايا`,
        description,
        type: 'video.episode',
        images: image ? [{ url: image, alt: title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | ${programTitle} - زوايا`,
        description,
        images: image ? [image] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for episode:', error)
    return {
      title: 'خطأ - زوايا',
      description: 'حدث خطأ أثناء تحميل الحلقة',
    }
  }
}

// ISR configuration
export const revalidate = 300 // 5 minutes

export default async function EpisodePage({ params }: EpisodePageProps) {
  let episode: WPEpisode | null = null
  let program: WPProgram | null = null
  let error: string | null = null

  try {
    // Fetch episode data
    episode = await getEpisode(params.slug)
    
    if (!episode) {
      notFound()
    }

    // Fetch parent program
    if (episode.parent) {
      try {
        // First get all programs to find the one with matching ID
        const programs = await getPrograms({ per_page: 100 })
        program = programs.find(p => p.id === episode.parent) || null
      } catch (err) {
        console.warn('Failed to fetch parent program:', err)
      }
    }
  } catch (err) {
    console.error('Error fetching episode data:', err)
    error = 'خطأ في تحميل الحلقة'
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'الحلقة غير موجودة'}</h1>
          <p className="text-gray-600 mb-4">
            {error ? 'حدث خطأ أثناء تحميل الحلقة. يرجى المحاولة مرة أخرى.' : 'الحلقة المطلوبة غير متاحة.'}
          </p>
          <Button asChild>
            <Link href="/programs">العودة إلى البرامج</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Transform episode data
  const episodeDetail = transformToEpisodeDetail({
    id: episode.id,
    slug: episode.slug,
    title: episode.title.rendered,
    title_ar: episode.title.rendered,
    content: episode.content.rendered,
    content_ar: episode.content.rendered,
    excerpt: episode.excerpt.rendered,
    excerpt_ar: episode.excerpt.rendered,
    date: episode.date,
    modified: episode.modified,
    featured_image_url: episode._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    zawaya_meta: episode.meta
  }, program ? {
    id: program.id,
    slug: program.slug,
    title: program.title.rendered,
    title_ar: program.title.rendered,
    content: program.content.rendered,
    content_ar: program.content.rendered,
    excerpt: program.excerpt.rendered,
    excerpt_ar: program.excerpt.rendered,
    date: program.date,
    modified: program.modified,
    featured_image_url: program._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    zawaya_meta: program.meta
  } : undefined)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <Link href="/programs" className="hover:text-blue-600">البرامج</Link>
            <ArrowRight className="w-4 h-4" />
            {program && (
              <>
                <Link href={`/programs/${program.slug}`} className="hover:text-blue-600">
                  {program.title.rendered}
                </Link>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
            <span className="text-gray-900">{episode.title.rendered}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Episode Header */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Episode Number */}
                  {(episodeDetail.seasonNumber || episodeDetail.episodeNumber) && (
                    <div className="mb-2">
                      <Badge variant="outline" className="text-sm">
                        {episodeDetail.seasonNumber 
                          ? `الموسم ${episodeDetail.seasonNumber} - الحلقة ${episodeDetail.episodeNumber}`
                          : `الحلقة ${episodeDetail.episodeNumber}`
                        }
                      </Badge>
                    </div>
                  )}
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {episode.title.rendered}
                  </h1>
                  
                  {/* Program Link */}
                  {program && (
                    <div className="mb-4">
                      <Link 
                        href={`/programs/${program.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2 space-x-reverse"
                      >
                        <span>من برنامج: {program.title.rendered}</span>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Episode Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(episode.date)}</span>
                </div>
                
                {episodeDetail.duration && (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(episodeDetail.duration)}</span>
                  </div>
                )}
              </div>

              {/* Episode Description */}
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: episode.content.rendered }}
              />

              {/* Tags */}
              {episodeDetail.tags && episodeDetail.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 space-x-reverse mb-3">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">الكلمات المفتاحية:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {episodeDetail.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Episode Player */}
            <EpisodePlayer episode={episodeDetail} />

            {/* Transcript */}
            {(episodeDetail.transcript || episodeDetail.transcriptMarkdown) && (
              <TranscriptAccordion 
                transcript={episodeDetail.transcriptMarkdown || episodeDetail.transcript || ''}
                isMarkdown={Boolean(episodeDetail.transcriptMarkdown)}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chapters */}
            {episodeDetail.chapters && episodeDetail.chapters.length > 0 && (
              <ChaptersList chapters={episodeDetail.chapters} />
            )}

            {/* Key Points */}
            {episodeDetail.keyPoints && episodeDetail.keyPoints.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">النقاط الرئيسية</h3>
                <ul className="space-y-2">
                  {episodeDetail.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2 space-x-reverse">
                      <span className="text-blue-600 font-bold text-sm mt-1">•</span>
                      <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Resource Links */}
            {episodeDetail.resourceLinks && episodeDetail.resourceLinks.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">روابط مفيدة</h3>
                <div className="space-y-3">
                  {episodeDetail.resourceLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{link.title}</h4>
                          {link.type && (
                            <span className="text-xs text-gray-500">
                              {link.type === 'article' ? 'مقال' : 
                               link.type === 'website' ? 'موقع ويب' : 
                               link.type === 'document' ? 'وثيقة' : 'رابط'}
                            </span>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}