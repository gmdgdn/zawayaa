'use client'

import React, { useRef, useEffect, useState } from 'react'
import { EpisodeDetailProps } from '@/lib/scf-mappings/episode'
import { useStickyMedia } from '@/context/StickyMediaContext'

interface EpisodePlayerProps {
  episode: EpisodeDetailProps
}

export function EpisodePlayer({ episode }: EpisodePlayerProps) {
  const { setMedia } = useStickyMedia()
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Determine media type and URL
  const hasVideo = !!episode.videoUrl
  const hasAudio = !!episode.audioUrl
  const mediaUrl = hasVideo ? episode.videoUrl : episode.audioUrl
  const mediaType = hasVideo ? 'video' : 'audio'

  // Handle media load events
  const handleLoadStart = () => {
    setIsLoading(true)
    setHasError(false)
  }

  const handleCanPlay = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Update sticky media context when playing
  const handlePlay = () => {
    if (mediaUrl) {
      setMedia({
        url: mediaUrl,
        type: mediaType,
        poster: episode.poster || episode.thumbnail,
        title: episode.title,
        isPlaying: true
      })
    }
  }

  const handlePause = () => {
    setMedia(prev => prev ? { ...prev, isPlaying: false } : null)
  }

  // Format duration for display
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return ''
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  }

  if (!mediaUrl) {
    return (
      <div className="w-full bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <p className="text-gray-600">لا يتوفر محتوى صوتي أو مرئي لهذه الحلقة</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Episode Info Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          {episode.seasonNumber && episode.episodeNumber && (
            <span>الموسم {episode.seasonNumber} - الحلقة {episode.episodeNumber}</span>
          )}
          {episode.duration && (
            <>
              <span>•</span>
              <span>{formatDuration(episode.duration)}</span>
            </>
          )}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {episode.title}
        </h2>
        <p className="text-gray-600">
          من برنامج: <span className="font-medium">{episode.programTitle}</span>
        </p>
      </div>

      {/* Media Player */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        {hasError ? (
          <div className="aspect-video flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p>حدث خطأ في تحميل المحتوى</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        ) : hasVideo ? (
          // Video Player
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
            <video
              ref={videoRef}
              className="w-full aspect-video"
              controls
              poster={episode.poster || episode.thumbnail}
              onLoadStart={handleLoadStart}
              onCanPlay={handleCanPlay}
              onError={handleError}
              onPlay={handlePlay}
              onPause={handlePause}
              preload="metadata"
            >
              <source src={episode.videoUrl} type="video/mp4" />
              <p className="text-white p-4">
                متصفحك لا يدعم تشغيل الفيديو. 
                <a href={episode.videoUrl} className="underline">اضغط هنا للتحميل</a>
              </p>
            </video>
          </div>
        ) : (
          // Audio Player
          <div className="relative">
            {/* Audio Poster/Thumbnail */}
            {(episode.poster || episode.thumbnail) && (
              <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                <img
                  src={episode.poster || episode.thumbnail}
                  alt={episode.title}
                  className="max-w-full max-h-full object-contain"
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            )}
            
            {/* Audio Controls */}
            <div className="bg-gray-900 p-4">
              <audio
                ref={audioRef}
                className="w-full"
                controls
                onLoadStart={handleLoadStart}
                onCanPlay={handleCanPlay}
                onError={handleError}
                onPlay={handlePlay}
                onPause={handlePause}
                preload="metadata"
              >
                <source src={episode.audioUrl} type="audio/mpeg" />
                <source src={episode.audioUrl} type="audio/mp4" />
                <p className="text-white">
                  متصفحك لا يدعم تشغيل الصوت. 
                  <a href={episode.audioUrl} className="underline">اضغط هنا للتحميل</a>
                </p>
              </audio>
            </div>
          </div>
        )}
      </div>

      {/* Episode Description */}
      {episode.description && (
        <div className="mt-6 prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: episode.description }}
          />
        </div>
      )}

      {/* Key Points */}
      {episode.keyPoints && episode.keyPoints.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">النقاط الرئيسية</h3>
          <ul className="space-y-2">
            {episode.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}