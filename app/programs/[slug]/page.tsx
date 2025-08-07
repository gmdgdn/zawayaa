import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPrograms, getProgram, getEpisodesByProgram, WPProgram, WPEpisode } from '@/lib/wp'
import { transformToProgramDetail } from '@/lib/scf-mappings/program'
import { ProgramHero } from '@/components/ProgramHero'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Calendar, Clock, Headphones, Video } from 'lucide-react'

interface ProgramPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all programs
export async function generateStaticParams() {
  try {
    const programs = await getPrograms({ per_page: 100 })
    return programs.map((program) => ({
      slug: program.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for programs:', error)
    return []
  }
}

// Generate metadata for the program page
export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  try {
    const program = await getProgram(params.slug)
    
    if (!program) {
      return {
        title: 'البرنامج غير موجود - زوايا',
        description: 'البرنامج المطلوب غير متاح',
      }
    }

    const title = program.title.rendered
    const description = program.excerpt.rendered.replace(/<[^>]*>/g, '') || `برنامج ${title} على منصة زوايا`
    const image = program.meta.cover_image || program._embedded?.['wp:featuredmedia']?.[0]?.source_url

    return {
      title: `${title} - زوايا`,
      description,
      openGraph: {
        title: `${title} - زوايا`,
        description,
        type: 'website',
        images: image ? [{ url: image, alt: title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} - زوايا`,
        description,
        images: image ? [image] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for program:', error)
    return {
      title: 'خطأ - زوايا',
      description: 'حدث خطأ أثناء تحميل البرنامج',
    }
  }
}

// ISR configuration
export const revalidate = 300 // 5 minutes

export default async function ProgramPage({ params }: ProgramPageProps) {
  let program: WPProgram | null = null
  let episodes: WPEpisode[] = []
  let error: string | null = null

  try {
    // Fetch program data
    program = await getProgram(params.slug)
    
    if (!program) {
      notFound()
    }

    // Fetch episodes for this program
    episodes = await getEpisodesByProgram(program.id, { 
      per_page: 50, 
      orderby: 'date', 
      order: 'desc' 
    })
  } catch (err) {
    console.error('Error fetching program data:', err)
    error = 'خطأ في تحميل البرنامج'
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'البرنامج غير موجود'}</h1>
          <p className="text-gray-600 mb-4">
            {error ? 'حدث خطأ أثناء تحميل البرنامج. يرجى المحاولة مرة أخرى.' : 'البرنامج المطلوب غير متاح.'}
          </p>
          <Button asChild>
            <Link href="/programs">العودة إلى البرامج</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Transform program data for ProgramHero component
  const programDetail = transformToProgramDetail({
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
  }, episodes.map(episode => ({
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
  })))

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Program Hero Section */}
      <ProgramHero program={programDetail} />

      <div className="container mx-auto px-4 py-12">
        {/* Program Description */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">عن البرنامج</h2>
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: program.content.rendered }}
            />
          </div>
        </div>

        {/* Episodes Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">الحلقات</h2>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {episodes.length} حلقة
            </Badge>
          </div>

          {episodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎧</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد حلقات</h3>
              <p className="text-gray-500">لم يتم نشر أي حلقات لهذا البرنامج بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Episode Card Component
interface EpisodeCardProps {
  episode: WPEpisode
}

function EpisodeCard({ episode }: EpisodeCardProps) {
  const getTypeIcon = (hasVideo: boolean, hasAudio: boolean) => {
    if (hasVideo) return <Video className="w-4 h-4" />
    if (hasAudio) return <Headphones className="w-4 h-4" />
    return <Play className="w-4 h-4" />
  }

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

  const hasVideo = Boolean(episode.meta.video_embed_url)
  const hasAudio = Boolean(episode.meta.audio_file_url)
  const thumbnail = episode.meta.episode_thumbnail || episode._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const duration = episode.meta.duration_seconds
  const episodeNumber = episode.meta.episode_number
  const seasonNumber = episode.meta.season_number

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white">
      <Link href={`/episodes/${episode.slug}`}>
        {/* Episode Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={thumbnail || '/images/placeholder-episode.jpg'}
            alt={episode.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Episode Number Badge */}
          {episodeNumber && (
            <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
              {seasonNumber ? `س${seasonNumber} ح${episodeNumber}` : `ح${episodeNumber}`}
            </div>
          )}

          {/* Media Type Icon */}
          <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
            {getTypeIcon(hasVideo, hasAudio)}
          </div>

          {/* Duration */}
          {duration && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
              {formatDuration(duration)}
            </div>
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-900 mr-1" />
            </div>
          </div>
        </div>

        {/* Episode Content */}
        <div className="p-6 space-y-3">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {episode.title.rendered}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {episode.excerpt.rendered.replace(/<[^>]*>/g, '')}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(episode.date)}</span>
            </div>
            
            {duration && (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(duration)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  )
}