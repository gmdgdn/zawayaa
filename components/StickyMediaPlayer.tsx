'use client'

import React, { useRef, useEffect } from 'react'
import { useStickyMedia } from '../context/StickyMediaContext'

// Play icon component
function PlayIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

// Pause icon component
function PauseIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

// Close icon component
function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  )
}

export function StickyMediaPlayer() {
  const { media, play, pause, toggle, setMedia } = useStickyMedia()
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle media element play/pause state sync
  useEffect(() => {
    if (!media) return

    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current
    if (!mediaElement) return

    if (media.isPlaying) {
      mediaElement.play().catch(console.error)
    } else {
      mediaElement.pause()
    }
  }, [media?.isPlaying])

  // Handle media element events
  const handlePlay = () => {
    play()
  }

  const handlePause = () => {
    pause()
  }

  const handleClose = () => {
    setMedia(null)
  }

  // Truncate title for display
  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + '...'
  }

  if (!media) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center p-4 max-w-7xl mx-auto">
        {/* Media Element */}
        <div className="flex-shrink-0 mr-4">
          {media.type === 'video' ? (
            <video
              ref={videoRef}
              src={media.url}
              poster={media.poster}
              className="w-16 h-12 md:w-20 md:h-15 rounded object-cover"
              onPlay={handlePlay}
              onPause={handlePause}
              muted={false}
            />
          ) : (
            <audio
              ref={audioRef}
              src={media.url}
              onPlay={handlePlay}
              onPause={handlePause}
              className="hidden"
            />
          )}

          {/* Audio placeholder or video thumbnail */}
          {media.type === 'audio' && (
            <div className="w-16 h-12 md:w-20 md:h-15 bg-gray-200 rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}
        </div>

        {/* Media Info */}
        <div className="flex-1 min-w-0 mr-4">
          {media.title && (
            <div className="text-sm font-medium text-gray-900 truncate">
              {truncateTitle(media.title)}
            </div>
          )}
          <div className="text-xs text-gray-500 capitalize">
            {media.type === 'video' ? 'فيديو' : 'صوت'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Play/Pause Button */}
          <button
            onClick={toggle}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
            aria-label={media.isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {media.isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="إغلاق المشغل"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .sticky-media-player {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  )
}