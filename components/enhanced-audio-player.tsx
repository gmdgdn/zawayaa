"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Download,
  List,
  Shuffle,
  Repeat,
  Maximize2,
  Minimize2,
  Clock,
  Headphones
} from "lucide-react"

interface AudioTrack {
  id: string
  title: string
  author: string
  duration: string
  src: string
  image?: string
  description?: string
}

interface EnhancedAudioPlayerProps {
  tracks: AudioTrack[]
  currentTrackIndex?: number
  autoPlay?: boolean
  showPlaylist?: boolean
  className?: string
}

export default function EnhancedAudioPlayer({ 
  tracks, 
  currentTrackIndex = 0, 
  autoPlay = false,
  showPlaylist = false,
  className = ""
}: EnhancedAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentIndex, setCurrentIndex] = useState(currentTrackIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')
  const [playlistVisible, setPlaylistVisible] = useState(showPlaylist)
  const [isMinimized, setIsMinimized] = useState(false)

  const currentTrack = tracks[currentIndex]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (autoPlay && currentTrack) {
      handlePlay()
    }
  }, [currentTrack, autoPlay])

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        setIsLoading(true)
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNext = () => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * tracks.length)
      setCurrentIndex(randomIndex)
    } else {
      setCurrentIndex((prev) => (prev + 1) % tracks.length)
    }
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
      setIsLoading(false)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    
    if (repeatMode === 'one') {
      audioRef.current?.play()
      setIsPlaying(true)
    } else if (repeatMode === 'all' || currentIndex < tracks.length - 1) {
      handleNext()
    }
  }

  const handleSeek = (newTime: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime[0]
      setCurrentTime(newTime[0])
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0]
    setVolume(volumeValue)
    if (audioRef.current) {
      audioRef.current.volume = volumeValue
    }
    setIsMuted(volumeValue === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleDownload = () => {
    if (currentTrack.src) {
      const link = document.createElement('a')
      link.href = currentTrack.src
      link.download = `${currentTrack.title} - ${currentTrack.author}.mp3`
      link.click()
    }
  }

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`} dir="rtl">
        <Card className="p-3 bg-white shadow-lg border-zawaya-primary">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePlay}
              className="p-2"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate font-ge-ss">
                {currentTrack.title}
              </p>
              <p className="text-xs text-gray-500 truncate font-ge-ss">
                {currentTrack.author}
              </p>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(false)}
              className="p-2"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        <audio
          ref={audioRef}
          src={currentTrack.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />
      </div>
    )
  }

  return (
    <div className={`${className}`} dir="rtl">
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-zawaya-primary to-zawaya-accent text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold font-ge-ss">مشغل زوايا الصوتي</h3>
                <p className="text-sm opacity-90 font-ge-ss">
                  {tracks.length} تسجيل صوتي
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPlaylistVisible(!playlistVisible)}
                className="text-white hover:bg-white/20"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Track Info */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            {currentTrack.image ? (
              <img 
                src={currentTrack.image} 
                alt={currentTrack.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <Headphones className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1 font-ge-ss">
                {currentTrack.title}
              </h3>
              <p className="text-gray-600 font-ge-ss mb-2">
                {currentTrack.author}
              </p>
              {currentTrack.description && (
                <p className="text-sm text-gray-500 font-ge-ss">
                  {currentTrack.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentTrack.duration}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {currentIndex + 1} من {tracks.length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShuffled(!isShuffled)}
              className={isShuffled ? 'text-zawaya-primary' : 'text-gray-400'}
            >
              <Shuffle className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={tracks.length <= 1}
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              onClick={handlePlay}
              disabled={isLoading}
              className="w-12 h-12 rounded-full bg-zawaya-primary hover:bg-zawaya-primary/90"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={tracks.length <= 1}
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRepeatMode(
                repeatMode === 'none' ? 'all' : 
                repeatMode === 'all' ? 'one' : 'none'
              )}
              className={repeatMode !== 'none' ? 'text-zawaya-primary' : 'text-gray-400'}
            >
              <Repeat className="w-4 h-4" />
              {repeatMode === 'one' && (
                <span className="text-xs ml-1">1</span>
              )}
            </Button>
          </div>

          {/* Volume and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-gray-500 hover:text-zawaya-primary"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Playlist */}
        {playlistVisible && (
          <div className="border-t bg-gray-50">
            <div className="p-4">
              <h4 className="font-bold text-gray-900 mb-3 font-ge-ss">قائمة التشغيل</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentIndex
                        ? 'bg-zawaya-primary/10 border border-zawaya-primary'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === currentIndex 
                          ? 'bg-zawaya-primary text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index === currentIndex && isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate font-ge-ss ${
                          index === currentIndex ? 'text-zawaya-primary' : 'text-gray-900'
                        }`}>
                          {track.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate font-ge-ss">
                          {track.author} • {track.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  )
} 