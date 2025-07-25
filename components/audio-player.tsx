"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react"

interface AudioPlayerProps {
  src: string
  title?: string
  className?: string
}

export default function AudioPlayer({ src, title, className = "" }: AudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initWaveSurfer = async () => {
      if (typeof window !== "undefined" && waveformRef.current) {
        try {
          const WaveSurfer = (await import("wavesurfer.js")).default

          wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#bef0b4", // zawaya-menthol
            progressColor: "#28645a", // zawaya-primary
            cursorColor: "#f6523d", // zawaya-accent
            barWidth: 2,
            barRadius: 1,
            responsive: true,
            height: 60,
            normalize: true,
            backend: "WebAudio",
            mediaControls: false,
          })

          wavesurferRef.current.load(src)

          wavesurferRef.current.on("ready", () => {
            setDuration(wavesurferRef.current.getDuration())
            setIsLoading(false)
          })

          wavesurferRef.current.on("audioprocess", () => {
            setCurrentTime(wavesurferRef.current.getCurrentTime())
          })

          wavesurferRef.current.on("play", () => {
            setIsPlaying(true)
          })

          wavesurferRef.current.on("pause", () => {
            setIsPlaying(false)
          })

          wavesurferRef.current.on("finish", () => {
            setIsPlaying(false)
            setCurrentTime(0)
          })

          wavesurferRef.current.setVolume(volume)
        } catch (error) {
          console.error("Error loading WaveSurfer:", error)
          setIsLoading(false)
        }
      }
    }

    initWaveSurfer()

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
      }
    }
  }, [src, volume])

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause()
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0]
    setVolume(vol)
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(vol)
    }
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (wavesurferRef.current) {
      if (isMuted) {
        wavesurferRef.current.setVolume(volume)
        setIsMuted(false)
      } else {
        wavesurferRef.current.setVolume(0)
        setIsMuted(true)
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const downloadAudio = () => {
    const link = document.createElement("a")
    link.href = src
    link.download = title || "audio"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`} dir="rtl">
      {title && <h3 className="text-lg font-semibold text-zawaya-primary mb-4 font-ge-ss">{title}</h3>}

      {/* Waveform */}
      <div className="mb-4">
        {isLoading ? (
          <div className="h-15 bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <span className="text-gray-500 font-ge-ss">جاري التحميل...</span>
          </div>
        ) : (
          <div ref={waveformRef} className="w-full" />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Play/Pause Button */}
          <Button
            onClick={togglePlayPause}
            disabled={isLoading}
            size="sm"
            className="bg-zawaya-primary hover:bg-zawaya-primary/90 text-white rounded-full w-10 h-10 p-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          {/* Time Display */}
          <div className="text-sm text-gray-600 font-ge-ss min-w-[80px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center space-x-3 space-x-reverse">
          {/* Volume Control */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button variant="ghost" size="sm" onClick={toggleMute} className="p-1">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-gray-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-gray-500" />
              )}
            </Button>
            <div className="w-20">
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Download Button */}
          <Button variant="ghost" size="sm" onClick={downloadAudio} className="p-1" title="تحميل الملف الصوتي">
            <Download className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}
