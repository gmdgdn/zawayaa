"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlayCircle, Music } from "lucide-react"
import Link from "next/link"
import { ReactElement } from "react"

interface Episode {
  id: string
  program_name_ar: string
  title_ar: string
  image_url: string
  content_type: string
}

interface MultimediaHubData {
  title_ar: string
  featured_episode: Episode
  secondary_episodes: Episode[]
}

interface MultimediaHubProps {
  data: MultimediaHubData
}

interface EpisodeCardProps {
  episode: Episode
  variant: "featured" | "secondary"
  getContentIcon: (type: string) => ReactElement
  getContentLabel: (type: string) => string
}

function EpisodeCard({ episode, variant, getContentIcon, getContentLabel }: EpisodeCardProps) {
  const isVideo = episode.content_type.includes("video")
  const episodeUrl = isVideo ? `/ar/programs/${episode.id}` : `/ar/podcast/${episode.id}`
  
  if (variant === "featured") {
    return (
      <Link href={episodeUrl}>
        <Card className="overflow-hidden group cursor-pointer card transition-default">
          <div className="relative">
            <div 
              className="h-80 bg-gradient-to-br from-clr-primary-dark to-clr-iris bg-cover bg-center aspect-card"
              style={{ backgroundImage: `url(${episode.image_url})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-default"></div>
              
              {/* Content Icon */}
              <div className="absolute top-6 right-6">
                {getContentIcon(episode.content_type)}
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="space-y-2">
                  {/* Content Type Badge */}
                  <div className="badge badge-iris">
                    {getContentLabel(episode.content_type)}
                  </div>
                  
                  {/* Program Name */}
                  <h4 className="text-lg font-bold font-ge-ss">
                    {episode.program_name_ar}
                  </h4>
                  
                  {/* Episode Title */}
                  <p className="text-gray-200 font-ge-ss leading-relaxed">
                    {episode.title_ar}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white">
            {/* Watch/Listen Button */}
            <Button className="btn-primary font-ge-ss w-full">
              {isVideo ? "شاهد الآن" : "استمع الآن"}
            </Button>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={episodeUrl}>
      <Card className="overflow-hidden group cursor-pointer card transition-default">
        <div className="relative">
          <div 
            className="h-32 bg-gradient-to-br from-clr-primary-dark to-clr-iris bg-cover bg-center"
            style={{ backgroundImage: `url(${episode.image_url})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-default"></div>
            
            {/* Content Icon */}
            <div className="absolute top-3 right-3">
              {getContentIcon(episode.content_type)}
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white">
          <div className="space-y-2">
            {/* Content Type Badge */}
            <div className="badge badge-iris text-xs">
              {getContentLabel(episode.content_type)}
            </div>
            
            {/* Program Name */}
            <h4 className="font-bold text-sm font-ge-ss">
              {episode.program_name_ar}
            </h4>
            
            {/* Episode Title */}
            <p className="text-gray-600 text-sm font-ge-ss leading-relaxed">
              {episode.title_ar}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default function MultimediaHub({ data }: MultimediaHubProps) {
  const getContentIcon = (type: string) => {
    return type.includes("video") ? (
      <PlayCircle className="w-6 h-6 text-white opacity-90" />
    ) : (
      <Music className="w-6 h-6 text-white opacity-90" />
    )
  }

  const getContentLabel = (type: string) => {
    return type.includes("video") ? "فيديو" : "صوتي"
  }

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-clr-iris mb-12 font-ge-ss text-center section-heading">
          أحدث إصداراتنا المرئية والصوتية
        </h2>

        {/* Episodes Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Episode */}
          <div className="lg:col-span-2">
            <EpisodeCard
              episode={data.featured_episode}
              variant="featured"
              getContentIcon={getContentIcon}
              getContentLabel={getContentLabel}
            />
          </div>

          {/* Secondary Episodes */}
          <div className="space-y-6">
            {data.secondary_episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                variant="secondary"
                getContentIcon={getContentIcon}
                getContentLabel={getContentLabel}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 