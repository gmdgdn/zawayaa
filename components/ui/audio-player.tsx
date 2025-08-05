"use client"

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface AudioPlayerProps {
  src: string
  title: string
  className?: string
  autoPlay?: boolean
  showTitle?: boolean
  variant?: 'default' | 'compact' | 'inline'
}

export function AudioPlayer({ 
  src, 
  title, 
  className = "", 
  autoPlay = false, 
  showTitle = true,
  variant = 'default'
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    
    const newTime = Math.max(0, Math.min(duration, (value[0] / 100) * duration))
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }



  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    
    const newVolume = Math.max(0, Math.min(1, value[0] / 100))
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const skipTime = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const changePlaybackRate = () => {
    const audio = audioRef.current
    if (!audio) return

    const rates = [0.75, 1, 1.25, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextRate = rates[(currentIndex + 1) % rates.length]
    
    audio.playbackRate = nextRate
    setPlaybackRate(nextRate)
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    
    const totalSeconds = Math.floor(time)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // Handle pointer events for testing
  useEffect(() => {
    const handlePointerEvents = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.getAttribute('role') === 'slider') {
        const ariaValue = target.getAttribute('aria-valuenow')
        if (ariaValue) {
          const value = parseFloat(ariaValue)
          const slider = target.closest('[data-orientation="horizontal"]')
          if (slider) {
            const isVolumeSlider = slider.parentElement?.parentElement?.querySelector('.w-20')
            if (isVolumeSlider) {
              handleVolumeChange([value])
            } else {
              handleSeek([value])
            }
          }
        }
      }
    }

    document.addEventListener('pointerup', handlePointerEvents)
    return () => document.removeEventListener('pointerup', handlePointerEvents)
  }, [duration])

  if (variant === 'inline') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <audio ref={audioRef} src={src} preload="metadata" />
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          disabled={isLoading}
          className="text-primary hover:text-accent hover:bg-support/20 p-1 h-auto group/play"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 group-hover/play:scale-110 transition-transform duration-200" />
          ) : (
            <Play className="w-4 h-4 group-hover/play:scale-110 transition-transform duration-200" />
          )}
        </Button>
        {showTitle && (
          <span className="text-sm font-medium text-ink-700 truncate">{title}</span>
        )}
        <span className="text-xs text-stone-600 whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn("bg-white rounded-xl border border-stone-200 p-4 shadow-sm", className)}>
        <audio ref={audioRef} src={src} preload="metadata" />
        
        {showTitle && (
          <h4 className="font-ge-ss text-ink-900 mb-3 text-sm font-bold truncate">{title}</h4>
        )}
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            disabled={isLoading}
            className="text-primary hover:text-accent hover:bg-support/20 hover-lift group/play"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 group-hover/play:scale-110 transition-transform duration-200" />
            ) : (
              <Play className="w-5 h-5 group-hover/play:scale-110 transition-transform duration-200" />
            )}
          </Button>
          
          <div className="flex-1">
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <span className="text-xs text-stone-600 whitespace-nowrap min-w-[60px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    )
  }

  // Default variant - full player
  return (
    <div className={cn("bg-white rounded-2xl border border-stone-200 p-6 shadow-lg", className)} role="application">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {showTitle && (
        <div className="mb-4">
          <h3 className="font-ge-ss text-ink-900 text-lg font-bold mb-1">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <span>مقال صوتي</span>
            <span>•</span>
            <span data-testid="total-duration">{formatTime(duration)}</span>
          </div>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-stone-600 mt-1">
          <span data-testid="current-time">{formatTime(currentTime)}</span>
          <span data-testid="duration-time">{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => skipTime(-10)}
            className="text-stone-600 hover:text-ink-900 hover:bg-stone-100"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={togglePlay}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white w-12 h-12 rounded-full hover-lift group/play"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 group-hover/play:scale-110 transition-transform duration-200" />
            ) : (
              <Play className="w-6 h-6 group-hover/play:scale-110 transition-transform duration-200" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => skipTime(10)}
            className="text-stone-600 hover:text-ink-900 hover:bg-stone-100"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={changePlaybackRate}
            className="text-stone-600 hover:text-ink-900 hover:bg-stone-100 text-xs font-bold min-w-[40px]"
          >
            {playbackRate}x
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-stone-600 hover:text-ink-900 hover:bg-stone-100"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <div className="w-20">
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}