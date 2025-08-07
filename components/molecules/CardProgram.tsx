import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/atoms/Badge"
import { Play, Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgramCardProps {
  program: {
    id: string
    title: string
    description?: string
    slug: string
    coverImage?: {
      url: string
      alt: string
    }
    programType?: 'podcast' | 'show' | 'documentary'
    episodeCount?: number
    lastEpisodeDate?: string
    duration?: string
    host?: {
      name: string
      avatar?: string
    }
  }
  className?: string
  priority?: boolean
}

const CardProgram = React.forwardRef<HTMLDivElement, ProgramCardProps>(
  ({ program, className, priority = false }, ref) => {
    const getProgramTypeLabel = (type?: string) => {
      switch (type) {
        case 'podcast': return 'بودكاست'
        case 'show': return 'برنامج'
        case 'documentary': return 'وثائقي'
        default: return 'برنامج'
      }
    }

    const getProgramTypeBadge = (type?: string) => {
      switch (type) {
        case 'podcast': return 'tag'
        case 'show': return 'category'
        case 'documentary': return 'verdict'
        default: return 'category'
      }
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "group relative overflow-hidden rounded-2xl bg-card shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          className
        )}
      >
        <Link href={`/programs/${program.slug}`} className="block">
          {/* Cover Image */}
          {program.coverImage && (
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={program.coverImage.url}
                alt={program.coverImage.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-primary-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-center w-16 h-16 bg-accent-600 rounded-full shadow-lg">
                  <Play className="w-6 h-6 text-neutral-50 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-lg space-y-md">
            {/* Program Type Badge */}
            <div className="flex items-center justify-between">
              <Badge variant={getProgramTypeBadge(program.programType) as any}>
                {getProgramTypeLabel(program.programType)}
              </Badge>
              
              {program.episodeCount && (
                <span className="text--1 text-primary-700">
                  {program.episodeCount} حلقة
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-1 font-semibold text-primary-900 line-clamp-2 group-hover:text-accent-600 transition-colors duration-200">
              {program.title}
            </h3>

            {/* Description */}
            {program.description && (
              <p className="text-0 text-primary-700 line-clamp-2 leading-relaxed">
                {program.description}
              </p>
            )}

            {/* Meta Information */}
            <div className="space-y-sm pt-sm border-t border-neutral-50">
              {/* Host */}
              {program.host && (
                <div className="flex items-center gap-sm">
                  {program.host.avatar && (
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={program.host.avatar}
                        alt={program.host.name}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="text--1 text-primary-700">
                    {program.host.name}
                  </span>
                </div>
              )}

              {/* Last Episode & Duration */}
              <div className="flex items-center justify-between text--1 text-primary-700">
                {program.lastEpisodeDate && (
                  <div className="flex items-center gap-xs">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={program.lastEpisodeDate}>
                      {new Date(program.lastEpisodeDate).toLocaleDateString('ar-SA')}
                    </time>
                  </div>
                )}
                
                {program.duration && (
                  <div className="flex items-center gap-xs">
                    <Clock className="w-4 h-4" />
                    <span>{program.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }
)

CardProgram.displayName = "CardProgram"

export { CardProgram }
