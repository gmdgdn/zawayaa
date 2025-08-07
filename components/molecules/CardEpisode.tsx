import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { Play, Pause, Clock, Calendar, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"

interface EpisodeCardProps {
  episode: {
    id: string
    title: string
    description?: string
    slug: string
    audioUrl?: string
    duration?: string
    publishedAt: string
    episodeNumber?: number
    coverImage?: {
      url: string
      alt: string
    }
    program: {
      title: string
      slug: string
    }
  }
  className?: string
  priority?: boolean
  layout?: 'horizontal' | 'vertical'
}

const CardEpisode = React.forwardRef<HTMLDivElement, EpisodeCardProps>(
  ({ episode, className, priority = false, layout = 'horizontal' }, ref) => {
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [currentTime, setCurrentTime] = React.useState(0)
    const [duration, setDuration] = React.useState(0)
    const audioRef = React.useRef<HTMLAudioElement>(null)

    const togglePlay = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    }

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    const isHorizontal = layout === 'horizontal'

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className={cn(
          "group relative overflow-hidden rounded-2xl bg-card shadow-soft transition-all duration-300 hover:shadow-lg",
          className
        )}
      >
        <Link href={`/episodes/${episode.slug}`} className="block">
          <div className={cn(
            "flex gap-lg p-lg",
            isHorizontal ? "flex-row" : "flex-col"
          )}>
            {/* Cover Image */}
            {episode.coverImage && (
              <div className={cn(
                "relative overflow-hidden rounded-xl flex-shrink-0",
                isHorizontal ? "w-24 h-24" : "aspect-video w-full"
              )}>
                <Image
                  src={episode.coverImage.url}
                  alt={episode.coverImage.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={priority}
                  sizes={isHorizontal ? "96px" : "(max-width: 768px) 100vw, 50vw"}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-primary-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="w-8 h-8 bg-accent-600 hover:bg-accent-600/90 text-neutral-50"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" fill="currentColor" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 space-y-sm min-w-0">
              {/* Episode Number & Program */}
              <div className="flex items-center gap-sm">
                {episode.episodeNumber && (
                  <Badge variant="tag">
                    الحلقة {episode.episodeNumber}
                  </Badge>
                )}
                <span className="text--1 text-primary-700 truncate">
                  {episode.program.title}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-1 font-semibold text-primary-900 line-clamp-2 group-hover:text-accent-600 transition-colors duration-200">
                {episode.title}
              </h3>

              {/* Description */}
              {episode.description && (
                <p className="text-0 text-primary-700 line-clamp-2 leading-relaxed">
                  {episode.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex items-center justify-between pt-xs">
                <div className="flex items-center gap-md text--1 text-primary-700">
                  <div className="flex items-center gap-xs">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={episode.publishedAt}>
                      {formatDate(episode.publishedAt)}
                    </time>
                  </div>
                  
                  {episode.duration && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-xs">
                        <Clock className="w-4 h-4" />
                        <span>{episode.duration}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Audio Controls */}
                {episode.audioUrl && (
                  <div className="flex items-center gap-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlay}
                      className="text-accent-600 hover:text-accent-600/90"
                    >
                      <Headphones className="w-4 h-4 ml-xs" />
                      {isPlaying ? 'إيقاف' : 'تشغيل'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Progress Bar (when playing) */}
              {isPlaying && duration > 0 && (
                <div className="w-full bg-neutral-50 rounded-full h-1">
                  <div
                    className="bg-accent-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Hidden Audio Element */}
        {episode.audioUrl && (
          <audio
            ref={audioRef}
            src={episode.audioUrl}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </motion.div>
    )
  }
)

CardEpisode.displayName = "CardEpisode"

export { CardEpisode }
