import Image from "next/image"
import Link from "next/link"
import { Play, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProgramCardProps {
  id: string
  slug: string
  title: string
  description: string
  coverImageUrl: string
  type: 'video' | 'audio'
  host: string
  episodeCount: number
  className?: string
}

export function ProgramCard({
  id,
  slug,
  title,
  description,
  coverImageUrl,
  type,
  host,
  episodeCount,
  className = ""
}: ProgramCardProps) {
  const isVideo = type === 'video'
  
  return (
    <article className={cn(
      "bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group",
      className
    )}>
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="lg" className="bg-white text-ink-900 hover:bg-white/90 font-bold">
            <Play className="w-6 h-6 ml-2" />
            {isVideo ? 'مشاهدة البرنامج' : 'استماع للبرنامج'}
          </Button>
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-4 right-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-white text-sm font-medium",
            isVideo ? "bg-brand-orange" : "bg-brand-violet"
          )}>
            {isVideo ? 'مرئي' : 'صوتي'}
          </span>
        </div>
        
        {/* Episode Count */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 rounded-full bg-black/60 text-white text-sm backdrop-blur-sm">
            {episodeCount} حلقة
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-ink-900 font-bold text-2xl leading-8 group-hover:text-brand-red transition-colors">
          <Link href={`/ar/programs/${slug}`} className="focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2 hover:underline decoration-2 underline-offset-4">
            {title}
          </Link>
        </h3>
        
        {/* Description */}
        <p className="text-ink-600 text-base leading-6">
          {description}
        </p>
        
        {/* Meta */}
        <div className="flex items-center justify-between text-ink-600 text-sm pt-2 border-t border-stone-200">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{host}</span>
          </div>
          <span className="text-ink-600">شهرياً</span>
        </div>
        
        {/* CTA */}
        <Button 
          asChild 
          className={cn(
            "w-full font-bold",
            isVideo 
              ? "bg-brand-orange hover:bg-brand-orange/90 text-white" 
              : "bg-brand-mint hover:bg-brand-mint/90 text-ink-900"
          )}
        >
          <Link href={`/ar/programs/${slug}`}>
            آخر حلقة
          </Link>
        </Button>
      </div>
    </article>
  )
}