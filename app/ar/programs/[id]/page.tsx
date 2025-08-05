"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, User, ArrowRight, Heart, Share2, Download, Video, Play, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState as useVideoState, useRef } from "react"

interface Episode {
  id: string
  title_ar: string
  description_ar?: string
  episode_number: number
  season_number: number
  duration: number
  video_url?: string
  audio_url?: string
  thumbnail_url?: string
  view_count: number
  like_count: number
  published_at: string
  program: {
    id: string
    title_ar: string
    description_ar?: string
    host_ar?: string
    type: string
  }
}

export default function ProgramEpisodePage() {
  const params = useParams()
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useVideoState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/episodes/${params.id}`)
        const result = await response.json()
        
        if (result.success) {
          setEpisode(result.data)
        } else {
          setError(result.error || 'الحلقة غير موجودة')
        }
      } catch (err) {
        setError('خطأ في تحميل الحلقة')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEpisode()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل الحلقة...</p>
        </div>
      </div>
    )
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'الحلقة غير موجودة'}</h1>
          <Link href="/ar/programs">
            <Button>العودة إلى البرامج</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}م`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}ك`
    }
    return views.toString()
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="content-container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mb-6">
          <Link href="/ar" className="hover:text-clr-accent">الرئيسية</Link>
          <ArrowRight className="w-4 h-4" />
          <Link href="/ar/programs" className="hover:text-clr-accent">البرامج</Link>
          <ArrowRight className="w-4 h-4" />
          <span>{episode.program_name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster={episode.thumbnail_url}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls
                >
                  <source src={episode.video_url} type="video/mp4" />
                </video>
              </div>
            </Card>

            {/* Episode Info */}
            <Card className="p-8">
              <div className="space-y-6">
                {/* Program Badge */}
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Badge className="badge badge-iris">
                    <Video className="w-4 h-4 ml-2" />
                    برنامج
                  </Badge>
                  <span className="text-gray-600 font-ge-ss">
                    {episode.program.title_ar} • الحلقة {episode.episode_number}
                  </span>
                </div>

                {/* Episode Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-ge-ss leading-tight">
                  {episode.title_ar}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 border-b border-gray-200 pb-6">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <User className="w-5 h-5" />
                    <span className="font-ge-ss">{episode.program.host_ar || 'فريق زوايا'}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Calendar className="w-5 h-5" />
                    <span className="font-ge-ss">{new Date(episode.published_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="w-5 h-5" />
                    <span className="font-ge-ss">{formatDuration(episode.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Eye className="w-5 h-5" />
                    <span className="font-ge-ss">{formatViews(episode.view_count)} مشاهدة</span>
                  </div>
                </div>

                {/* Episode Description */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-ge-ss">وصف الحلقة</h3>
                  <p className="text-gray-800 font-ge-ss leading-reading">
                    {episode.description_ar || 'لا يوجد وصف متاح لهذه الحلقة.'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Button variant="outline" className="flex items-center space-x-2 space-x-reverse">
                      <Heart className="w-5 h-5" />
                      <span>أعجبني</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2 space-x-reverse">
                      <Share2 className="w-5 h-5" />
                      <span>مشاركة</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2 space-x-reverse">
                      <Download className="w-5 h-5" />
                      <span>تحميل</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Program Info */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-ge-ss">عن البرنامج</h3>
                <h4 className="text-xl font-bold text-clr-iris font-ge-ss">{episode.program.title_ar}</h4>
                <p className="text-gray-600 font-ge-ss leading-relaxed">
                  {episode.program.description_ar || 'برنامج من إنتاج زوايا'}
                </p>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{(episode.program.host_ar || 'ز').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-ge-ss text-gray-700">{episode.program.host_ar || 'فريق زوايا'}</span>
                </div>
              </div>
            </Card>

            {/* Episode Stats */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-ge-ss">إحصائيات الحلقة</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-ge-ss">المشاهدات:</span>
                    <span className="font-bold font-ge-ss">{formatViews(episode.view_count)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-ge-ss">المدة:</span>
                    <span className="font-bold font-ge-ss">{formatDuration(episode.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-ge-ss">النوع:</span>
                    <span className="font-bold font-ge-ss">{episode.program.type === 'video' ? 'فيديو' : episode.program.type === 'audio' ? 'صوتي' : 'مختلط'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-ge-ss">الموسم:</span>
                    <span className="font-bold font-ge-ss">الموسم {episode.season_number}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Related Programs CTA */}
            <Card className="p-6 bg-gradient-to-br from-clr-primary-dark to-clr-iris text-white">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-ge-ss">تصفح المزيد</h3>
                <p className="text-gray-100 font-ge-ss">
                  اكتشف حلقات أخرى من {episode.program.title_ar} والبرامج المشابهة
                </p>
                <Link href="/ar/programs">
                  <Button variant="secondary" className="w-full">
                    عرض جميع البرامج
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 