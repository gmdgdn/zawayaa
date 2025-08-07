'use client'

import React from 'react'
import Image from 'next/image'
import { ProgramDetailProps } from '@/lib/scf-mappings/program'
import { useStickyMedia } from '@/context/StickyMediaContext'

// Subscription platform icons
function AppleIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}

function SpotifyIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function RSSIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
}

interface ProgramHeroProps {
  program: ProgramDetailProps
}

export function ProgramHero({ program }: ProgramHeroProps) {
  const { setMedia } = useStickyMedia()

  const handleTrailerPlay = () => {
    if (program.trailerVideoUrl) {
      setMedia({
        url: program.trailerVideoUrl,
        type: 'video',
        poster: program.cover,
        title: `إعلان ${program.title}`,
        isPlaying: true
      })
    }
  }

  const subscriptionButtons = [
    {
      name: 'Apple Podcasts',
      url: program.appleLink,
      icon: AppleIcon,
      bgColor: 'bg-black hover:bg-gray-800',
      textColor: 'text-white'
    },
    {
      name: 'Spotify',
      url: program.spotifyLink,
      icon: SpotifyIcon,
      bgColor: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    },
    {
      name: 'Google Podcasts',
      url: program.googleLink,
      icon: GoogleIcon,
      bgColor: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      name: 'RSS Feed',
      url: program.rssFeed,
      icon: RSSIcon,
      bgColor: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-white'
    }
  ].filter(button => button.url) // Only show buttons for available links

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={program.cover}
          alt={program.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          style={{
            background: program.themeColor 
              ? `linear-gradient(to top, ${program.themeColor}CC, ${program.themeColor}66, transparent)`
              : undefined
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8 lg:p-12">
        <div className="max-w-4xl">
          {/* Program Type Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {program.type === 'video' ? 'برنامج مرئي' : program.type === 'audio' ? 'بودكاست' : 'برنامج مختلط'}
            </span>
          </div>

          {/* Program Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {program.title}
          </h1>

          {/* Host Name */}
          <p className="text-lg md:text-xl text-white/90 mb-6">
            يقدمه: <span className="font-semibold">{program.host}</span>
          </p>

          {/* Program Stats */}
          <div className="flex flex-wrap gap-4 mb-6 text-white/80 text-sm">
            <span>{program.stats.episodeCount} حلقة</span>
            {program.stats.subscriberCount && (
              <span>{program.stats.subscriberCount.toLocaleString('ar-SA')} متابع</span>
            )}
            {program.stats.rating && (
              <span>⭐ {program.stats.rating}/5</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Trailer Button */}
            {program.trailerVideoUrl && (
              <button
                onClick={handleTrailerPlay}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <PlayIcon />
                مشاهدة الإعلان
              </button>
            )}

            {/* Subscription Buttons */}
            {subscriptionButtons.map((button) => (
              <a
                key={button.name}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-3 ${button.bgColor} ${button.textColor} rounded-lg font-medium transition-colors`}
              >
                <button.icon />
                <span className="hidden sm:inline">{button.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}