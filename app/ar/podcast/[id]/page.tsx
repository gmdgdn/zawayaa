"use client"

import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, User, ArrowRight, Heart, Share2, Download, Headphones, Play } from "lucide-react"
import Link from "next/link"
import EnhancedAudioPlayer from "@/components/enhanced-audio-player"

// Sample podcast episodes data
const getPodcastById = (id: string) => {
  const episodes = {
    "ep-001": {
      id: "ep-001",
      title_ar: "الذكاء الاصطناعي والثقافة العربية: تحديات الهوية في العصر الرقمي",
      show_name: "شمال جنوب",
      host: "فريق زوايا التحريري",
      guest: "د. أحمد الخيري - خبير في تقنيات الذكاء الاصطناعي",
      description: "حوار معمق حول تأثير الذكاء الاصطناعي على الثقافة والهوية العربية، والتحديات التي تواجه المنطقة في عصر التحول الرقمي. نناقش كيف يمكن للعالم العربي أن يستفيد من هذه التقنيات مع الحفاظ على خصوصيته الثقافية.",
      published_date: "2025-01-22",
      duration: "52:30",
      audio_url: "/audio/ep-001.mp3",
      transcript: `[00:00] مقدمة البرنامج
[02:15] تعريف بالضيف
[05:30] الذكاء الاصطناعي: الفرص والتحديات
[15:45] التأثير على اللغة العربية
[28:20] الهوية الثقافية في العصر الرقمي
[38:10] مستقبل التعليم العربي
[45:30] توصيات للمؤسسات العربية
[50:15] خاتمة وشكر للضيف`,
      tags: ["تكنولوجيا", "ثقافة", "هوية", "ذكاء اصطناعي"],
      image_url: "/images/episodes/ai_culture.png",
      show_description: "برنامج حواري أسبوعي يناقش القضايا المعاصرة من منظور عربي",
      episode_number: 12,
      season: 2
    },
    "ep-002": {
      id: "ep-002",
      title_ar: "الفن الإسلامي في العصر الحديث: بين الأصالة والمعاصرة",
      show_name: "عبق التاريخ",
      host: "د. ليلى حسن",
      guest: "الفنان محمد السعيد",
      description: "رحلة في عالم الفن الإسلامي المعاصر، نكتشف كيف يوازن الفنانون المسلمون بين التراث الأصيل والتعبير المعاصر. حوار مع الفنان محمد السعيد حول تجربته في دمج الخط العربي مع الفنون الحديثة.",
      published_date: "2025-01-20",
      duration: "45:15",
      audio_url: "/audio/ep-002.mp3",
      transcript: "",
      tags: ["فن", "تراث", "خط عربي", "حداثة"],
      image_url: "/images/episodes/islamic_art.png",
      show_description: "برنامج يستكشف التاريخ والتراث العربي الإسلامي",
      episode_number: 8,
      season: 1
    }
  }
  
  return episodes[id as keyof typeof episodes] || null
}

export default function PodcastEpisodePage() {
  const params = useParams()
  const episode = getPodcastById(params.id as string)

  if (!episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الحلقة غير موجودة</h1>
          <Link href="/ar/podcast">
            <Button>العودة إلى البودكاست</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="content-container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mb-6">
          <Link href="/ar" className="hover:text-clr-accent">الرئيسية</Link>
          <ArrowRight className="w-4 h-4" />
          <Link href="/ar/podcast" className="hover:text-clr-accent">البودكاست</Link>
          <ArrowRight className="w-4 h-4" />
          <span>{episode.show_name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Episode Header */}
            <Card className="p-8">
              <div className="space-y-6">
                {/* Show Badge */}
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Badge className="badge badge-iris">
                    <Headphones className="w-4 h-4 ml-2" />
                    بودكاست
                  </Badge>
                  <span className="text-gray-600 font-ge-ss">
                    {episode.show_name} • الحلقة {episode.episode_number}
                  </span>
                </div>

                {/* Episode Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-ge-ss leading-tight">
                  {episode.title_ar}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
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
                </div>

                {/* Episode Image */}
                {episode.image_url && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img 
                      src={episode.image_url} 
                      alt={episode.title_ar}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Audio Player */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-ge-ss">استمع للحلقة</h3>
                <EnhancedAudioPlayer 
                  tracks={[{
                    id: episode.id,
                    title: episode.title_ar,
                    author: episode.host,
                    src: episode.audio_url,
                    duration: episode.duration
                  }]}
                  currentTrackIndex={0}
                  autoPlay={false}
                  showPlaylist={false}
                />
              </div>
            </Card>

            {/* Episode Description */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-ge-ss">وصف الحلقة</h3>
                <p className="text-gray-800 font-ge-ss leading-reading">
                  {episode.description}
                </p>
                {episode.guest && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold font-ge-ss mb-2">ضيف الحلقة:</h4>
                    <p className="text-gray-700 font-ge-ss">{episode.guest}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Transcript */}
            {episode.transcript && (
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-ge-ss">محتويات الحلقة</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-gray-700 font-ge-ss text-sm leading-relaxed">
                      {episode.transcript}
                    </pre>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Show Info */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-ge-ss">عن البرنامج</h3>
                <h4 className="text-xl font-bold text-clr-iris font-ge-ss">{episode.show_name}</h4>
                <p className="text-gray-600 font-ge-ss leading-relaxed">
                  {episode.show_description}
                </p>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{episode.host.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-ge-ss text-gray-700">{episode.host}</span>
                </div>
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
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
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-ge-ss">إجراءات</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full flex items-center space-x-2 space-x-reverse">
                    <Heart className="w-5 h-5" />
                    <span>أعجبني</span>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center space-x-2 space-x-reverse">
                    <Share2 className="w-5 h-5" />
                    <span>مشاركة</span>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center space-x-2 space-x-reverse">
                    <Download className="w-5 h-5" />
                    <span>تحميل</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Back to Podcast */}
            <Link href="/ar/podcast">
              <Button className="w-full">العودة إلى البودكاست</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 