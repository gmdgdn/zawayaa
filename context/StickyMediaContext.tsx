'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Media state interface
export interface MediaState {
  url: string
  type: 'audio' | 'video'
  poster?: string
  title?: string
  isPlaying: boolean
}

// Context type interface
export interface MediaContextType {
  media: MediaState | null
  setMedia: (media: MediaState | null) => void
  play: () => void
  pause: () => void
  toggle: () => void
}

// Create the context
const StickyMediaContext = createContext<MediaContextType | null>(null)

// Provider component props
interface StickyMediaProviderProps {
  children: ReactNode
}

// Provider component
export function StickyMediaProvider({ children }: StickyMediaProviderProps) {
  const [media, setMediaState] = useState<MediaState | null>(null)

  const setMedia = (newMedia: MediaState | null) => {
    setMediaState(newMedia)
  }

  const play = () => {
    if (media) {
      setMediaState({ ...media, isPlaying: true })
    }
  }

  const pause = () => {
    if (media) {
      setMediaState({ ...media, isPlaying: false })
    }
  }

  const toggle = () => {
    if (media) {
      setMediaState({ ...media, isPlaying: !media.isPlaying })
    }
  }

  const contextValue: MediaContextType = {
    media,
    setMedia,
    play,
    pause,
    toggle
  }

  return (
    <StickyMediaContext.Provider value={contextValue}>
      {children}
    </StickyMediaContext.Provider>
  )
}

// Custom hook for consuming the context
export function useStickyMedia(): MediaContextType {
  const context = useContext(StickyMediaContext)
  
  if (!context) {
    throw new Error('useStickyMedia must be used within a StickyMediaProvider')
  }
  
  return context
}