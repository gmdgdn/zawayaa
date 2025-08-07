'use client'

import React from 'react'
import { Chapter } from '@/lib/scf-mappings/episode'

interface ChaptersListProps {
  chapters: Chapter[]
  onSeek?: (time: number) => void
  currentTime?: number
}

export function ChaptersList({ chapters, onSeek, currentTime = 0 }: ChaptersListProps) {
  // Format time for display (MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Determine if a chapter is currently active
  const isActiveChapter = (chapter: Chapter, index: number): boolean => {
    const nextChapter = chapters[index + 1]
    const chapterStart = chapter.start
    const chapterEnd = nextChapter ? nextChapter.start : Infinity
    
    return currentTime >= chapterStart && currentTime < chapterEnd
  }

  // Handle chapter click
  const handleChapterClick = (chapter: Chapter) => {
    if (onSeek) {
      onSeek(chapter.start)
    }
  }

  if (!chapters || chapters.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
          </svg>
          فهرس الحلقة ({chapters.length} فصل)
        </h3>
      </div>

      {/* Chapters List */}
      <div className="divide-y divide-gray-100">
        {chapters.map((chapter, index) => {
          const isActive = isActiveChapter(chapter, index)
          
          return (
            <button
              key={index}
              onClick={() => handleChapterClick(chapter)}
              className={`w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors group ${
                isActive ? 'bg-blue-50 border-r-4 border-blue-500' : ''
              }`}
              disabled={!onSeek}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Chapter Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-medium truncate ${
                    isActive ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {chapter.title}
                  </h4>
                  <p className={`text-xs mt-1 ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    الفصل {index + 1}
                  </p>
                </div>

                {/* Time and Play Icon */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-sm font-mono ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {formatTime(chapter.start)}
                  </span>
                  
                  {onSeek && (
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                    }`}>
                      {isActive ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer Note */}
      {onSeek && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            اضغط على أي فصل للانتقال إليه مباشرة
          </p>
        </div>
      )}
    </div>
  )
}