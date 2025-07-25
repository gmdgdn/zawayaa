"use client"

import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, User, ArrowRight, Heart, Share2, Download, Video, Play, Eye } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"

// Sample program episodes data
const getProgramById = (id: string) => {
  const episodes = {
    "prog-001": {
      id: "prog-001",
      title_ar: "نافذة على العالم: اليابان بين التقليد والحداثة",
      program_name: "حضارة الشرق",
      host: "محمد الحكيم",
      description: "رحلة استكشافية في الثقافة اليابانية المعاصرة وكيف تمكنت من الحفاظ على تراثها مع احتضان الحداثة. نزور معابد كيوتو القديمة ومختبرات طوكيو المستقبلية لنفهم سر هذا التوازن الفريد.",
      published_date: "2025-01-18",
      duration: "30:15",
      views: 15420,
      video_url: "/placeholder-video.mp4",
      thumbnail: "/images/programs/japan_culture.png",
      tags: ["ثقافة", "اليابان", "تراث", "حداثة"],
      category: "وثائقي ثقافي",
      episode_number: 5,
      season: 2,
      program_description: "سلسلة وثائقية تستكشف حضارات الشرق وتأثيرها على العالم المعاصر"
    },
    "prog-002": {
      id: "prog-002",
      title_ar: "طريق الحرير الرقمي: كيف تعيد التكنولوجيا ربط القارات؟",
      program_name: "شمال جنوب",
      host: "د. سارا العلي",
      description: "تحليل معمق للمبادرات التكنولوجية الصينية الجديدة وتأثيرها على طرق التجارة العالمية. نناقش مشروع طريق الحرير الرقمي ودوره في إعادة تشكيل الجغرافيا الاقتصادية العالمية.",
      published_date: "2025-01-15",
      duration: "45:30",
      views: 23100,
      video_url: "/placeholder-video.mp4",
      thumbnail: "/images/programs/digital_silk_road.png",
      tags: ["تكنولوجيا", "اقتصاد", "الصين", "طريق الحرير"],
      category: "تحليل اقتصادي",
      episode_number: 8,
      season: 1,
      program_description: "برنامج تحليلي يناقش القضايا الجيوسياسية والاقتصادية المعاصرة"
    }
  }
  
  return episodes[id as keyof typeof episodes] || null
}

export default function ProgramEpisodePage() {
  const params = useParams()
  const episode = getProgramById(params.id as string)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  if (!episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الحلقة غير موجودة</h1>
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
                  poster={episode.thumbnail}
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
                    {episode.program_name} • الحلقة {episode.episode_number}
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
                    <span className="font-ge-ss">{episode.host}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Calendar className="w-5 h-5" />
                    <span className="font-ge-ss">{new Date(episode.published_date).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="w-5 h-5" />
                    <span className="font-ge-ss">{episode.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Eye className="w-5 h-5" />
                    <span className="font-ge-ss">{formatViews(episode.views)} مشاهدة</span>
                  </div>
                </div>

                {/* Episode Description */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-ge-ss">وصف الحلقة</h3>
                  <p className="text-gray-800 font-ge-ss leading-reading">
                    {episode.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-ge-ss">العلامات</h3>
                  <div className="flex flex-wrap gap-2">
                    {episode.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="badge border-gray-600 text-gray-600 font-ge-ss">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
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
                <h4 className="text-xl font-bold text-clr-iris font-ge-ss">{episode.program_name}</h4>
                <p className="text-gray-600 font-ge-ss leading-relaxed">
                  {episode.program_description}
                </p>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{episode.host.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-ge-ss text-gray-700">{episode.host}</span>
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
                    <span className="font-bold font-ge-ss">{formatViews(episode.views)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-ge-ss">المدة:</span>
                    <span className="font-bold font-ge-ss">{episode.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-ge-ss">الفئة:</span>
                    <span className="font-bold font-ge-ss">{episode.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-ge-ss">الموسم:</span>
                    <span className="font-bold font-ge-ss">الموسم {episode.season}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Related Programs CTA */}
            <Card className="p-6 bg-gradient-to-br from-clr-primary-dark to-clr-iris text-white">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-ge-ss">تصفح المزيد</h3>
                <p className="text-gray-100 font-ge-ss">
                  اكتشف حلقات أخرى من {episode.program_name} والبرامج المشابهة
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