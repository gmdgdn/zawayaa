"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Eye,
  Clock,
  Calendar,
  Download,
  Share2,
  Heart,
  Bookmark,
  Users,
  TrendingUp,
  Star,
} from "lucide-react"
import { colors } from "@/lib/theme"

interface Episode {
  id: string
  title: string
  description: string
  episode_number: number
  season_number: number
  duration: number // in seconds
  audio_url?: string
  video_url?: string
  cover_image_url?: string
  published_at: string
  views: number
  likes: number
  status: "published" | "draft" | "scheduled"
  slug: string
}

interface Program {
  id: string
  title: string
  tagline: string
  description: string
  cover_image_url: string
  type: "audio" | "video" | "mixed"
  status: "active" | "upcoming" | "completed"
  host: string
  host_bio: string
  host_avatar?: string
  total_episodes: number
  total_views: number
  total_duration: number // in seconds
  average_rating: number
  subscriber_count: number
  category: string
  launch_date: string
  latest_episode_date: string
  slug: string
  featured: boolean
  episodes: Episode[]
}

// Sample program data with episodes
const sampleProgram: Program = {
  id: "1",
  title: "أصل الخبر",
  tagline: "نكشف لك الحقيقة وراء الأخبار",
  description: `برنامج استقصائي أسبوعي يتعمق في الأحداث الجارية ويكشف الخلفيات والسياقات التي تقف وراء الأخبار الرئيسية. نحن نؤمن بأن كل خبر له قصة أعمق، وكل حدث له سياق تاريخي وسياسي واجتماعي يجب فهمه لإدراك الصورة الكاملة.

في كل حلقة، نأخذكم في رحلة استقصائية لفهم الأحداث من جذورها، مع الاستعانة بخبراء ومختصين ومصادر موثوقة لتقديم تحليل شامل وموضوعي للقضايا المطروحة.

البرنامج يغطي مواضيع متنوعة من السياسة المحلية والإقليمية والدولية، إلى القضايا الاقتصادية والاجتماعية التي تؤثر على حياتنا اليومية.`,
  cover_image_url: "/placeholder.svg?height=400&width=600&text=أصل+الخبر",
  type: "video",
  status: "active",
  host: "أحمد الصحفي",
  host_bio: "صحفي استقصائي متخصص في الشؤون السياسية والاقتصادية، يتمتع بخبرة أكثر من 15 عاماً في مجال الإعلام",
  host_avatar: "/placeholder.svg?height=80&width=80&text=أحمد",
  total_episodes: 45,
  total_views: 2500000,
  total_duration: 94500, // ~26 hours
  average_rating: 4.7,
  subscriber_count: 125000,
  category: "إعلام",
  launch_date: "2024-01-15",
  latest_episode_date: "2025-01-10",
  slug: "asl-al-khabar",
  featured: true,
  episodes: [
    {
      id: "ep-45",
      title: "أزمة الطاقة العالمية: الأسباب والتداعيات",
      description:
        "تحليل شامل لأزمة الطاقة العالمية الحالية، أسبابها الجذرية وتأثيرها على الاقتصاد العالمي والمنطقة العربية",
      episode_number: 45,
      season_number: 2,
      duration: 2340, // 39 minutes
      video_url: "/sample-video.mp4",
      cover_image_url: "/placeholder.svg?height=300&width=400&text=الحلقة+45",
      published_at: "2025-01-10T18:00:00Z",
      views: 85000,
      likes: 3200,
      status: "published",
      slug: "global-energy-crisis",
    },
    {
      id: "ep-44",
      title: "الانتخابات الأمريكية: تأثيرها على الشرق الأوسط",
      description:
        "نظرة معمقة على نتائج الانتخابات الأمريكية وتأثيرها المحتمل على سياسات الولايات المتحدة في الشرق الأوسط",
      episode_number: 44,
      season_number: 2,
      duration: 2780, // 46 minutes
      video_url: "/sample-video-2.mp4",
      cover_image_url: "/placeholder.svg?height=300&width=400&text=الحلقة+44",
      published_at: "2025-01-03T18:00:00Z",
      views: 92000,
      likes: 3800,
      status: "published",
      slug: "us-elections-middle-east",
    },
    {
      id: "ep-43",
      title: "التضخم العالمي: هل نحن مقبلون على ركود؟",
      description:
        "تحليل اقتصادي للموجة التضخمية العالمية وإمكانية دخول الاقتصاد العالمي في حالة ركود، مع التركيز على الأسواق العربية",
      episode_number: 43,
      season_number: 2,
      duration: 2520, // 42 minutes
      video_url: "/sample-video-3.mp4",
      cover_image_url: "/placeholder.svg?height=300&width=400&text=الحلقة+43",
      published_at: "2024-12-27T18:00:00Z",
      views: 76000,
      likes: 2900,
      status: "published",
      slug: "global-inflation-recession",
    },
    {
      id: "ep-42",
      title: "التغير المناخي والأمن الغذائي في المنطقة",
      description:
        "استكشاف تأثير التغير المناخي على الأمن الغذائي في المنطقة العربية والسياسات المطلوبة للتكيف مع هذه التحديات",
      episode_number: 42,
      season_number: 2,
      duration: 2680, // 44.5 minutes
      video_url: "/sample-video-4.mp4",
      cover_image_url: "/placeholder.svg?height=300&width=400&text=الحلقة+42",
      published_at: "2024-12-20T18:00:00Z",
      views: 68000,
      likes: 2500,
      status: "published",
      slug: "climate-change-food-security",
    },
    {
      id: "ep-41",
      title: "الذكاء الاصطناعي والإعلام: مستقبل الصحافة",
      description: "نقاش حول تأثير الذكاء الاصطناعي على مستقبل الإعلام والصحافة، الفرص والتحديات التي يطرحها",
      episode_number: 41,
      season_number: 2,
      duration: 2420, // 40.5 minutes
      video_url: "/sample-video-5.mp4",
      cover_image_url: "/placeholder.svg?height=300&width=400&text=الحلقة+41",
      published_at: "2024-12-13T18:00:00Z",
      views: 89000,
      likes: 3500,
      status: "published",
      slug: "ai-media-future-journalism",
    },
  ],
}

export default function ProgramShowPage() {
  const [program] = useState<Program>(sampleProgram)
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(program.episodes[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }
  }

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}م`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}ك`
    }
    return views.toString()
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Video Player */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Video Player - 3 columns */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden bg-black">
              <div className="relative aspect-video">
                {/* Video Player */}
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <div
                    className="w-full h-full bg-gradient-to-br from-zawaya-primary to-zawaya-iris flex items-center justify-center relative"
                    style={{
                      backgroundImage: currentEpisode.cover_image_url
                        ? `url(${currentEpisode.cover_image_url})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Play Button Overlay */}
                    <button
                      onClick={togglePlay}
                      className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-zawaya-primary" />
                      ) : (
                        <Play className="w-8 h-8 text-zawaya-primary mr-1" />
                      )}
                    </button>

                    {/* Video Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <button className="text-white hover:text-zawaya-menthol transition-colors">
                          <Volume2 className="w-5 h-5" />
                        </button>
                        <span className="text-white text-sm font-ge-ss">{formatDuration(currentEpisode.duration)}</span>
                      </div>
                      <button className="text-white hover:text-zawaya-menthol transition-colors">
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Episode Number Badge */}
                    <Badge
                      className="absolute top-4 right-4 bg-zawaya-accent text-white font-ge-ss"
                      style={{ backgroundColor: colors.accent }}
                    >
                      الحلقة {currentEpisode.episode_number}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Episode Info Below Video */}
              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-ge-ss leading-tight">
                  {currentEpisode.title}
                </h2>
                <p className="text-gray-600 font-ge-ss leading-relaxed mb-4">{currentEpisode.description}</p>

                {/* Episode Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <button
                      onClick={toggleLike}
                      className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full transition-all duration-200 ${
                        isLiked
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      <span className="font-ge-ss text-sm">{formatViews(currentEpisode.likes)}</span>
                    </button>

                    <button
                      onClick={toggleBookmark}
                      className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full transition-all duration-200 ${
                        isBookmarked
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                      <span className="font-ge-ss text-sm">حفظ</span>
                    </button>

                    <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="font-ge-ss text-sm">مشاركة</span>
                    </button>

                    <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="font-ge-ss text-sm">تحميل</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="font-ge-ss">{formatDate(currentEpisode.published_at)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Program Metrics - 1 column */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Program Title Card */}
              <Card className="p-6 bg-white">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-zawaya-primary mb-2 font-ge-ss">{program.title}</h1>
                  <p className="text-gray-600 font-ge-ss">{program.tagline}</p>
                  <Badge
                    variant="outline"
                    className="mt-3 border-zawaya-accent text-zawaya-accent bg-transparent font-ge-ss"
                    style={{ borderColor: colors.accent, color: colors.accent }}
                  >
                    {program.category}
                  </Badge>
                </div>

                {/* Host Info */}
                <div className="flex items-center space-x-3 space-x-reverse mb-6 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={program.host_avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-zawaya-primary text-white font-ge-ss">
                      {getInitials(program.host)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 font-ge-ss">{program.host}</h4>
                    <p className="text-sm text-gray-600 font-ge-ss">مقدم البرنامج</p>
                  </div>
                </div>

                {/* Subscribe Button */}
                <Button
                  className="w-full bg-zawaya-accent hover:bg-zawaya-accent/90 text-white font-ge-ss mb-4"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Users className="w-4 h-4 ml-2" />
                  اشترك في البرنامج
                </Button>
              </Card>

              {/* Metrics Card */}
              <Card className="p-6 bg-white">
                <h3 className="font-semibold text-gray-900 mb-4 font-ge-ss">إحصائيات البرنامج</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">إجمالي المشاهدات</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">
                      {formatViews(program.total_views)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">إجمالي المدة</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">
                      {Math.round(program.total_duration / 3600)} ساعة
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">عدد الحلقات</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">{program.total_episodes}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">المشتركون</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">
                      {formatViews(program.subscriber_count)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">التقييم</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">{program.average_rating}/5</span>
                  </div>
                </div>
              </Card>

              {/* Latest Stats Card */}
              <Card className="p-6 bg-gradient-to-br from-zawaya-primary to-zawaya-iris text-white">
                <h3 className="font-semibold mb-4 font-ge-ss">إحصائيات هذه الحلقة</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/90 font-ge-ss">المشاهدات</span>
                    <span className="font-semibold font-ge-ss">{formatViews(currentEpisode.views)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/90 font-ge-ss">الإعجابات</span>
                    <span className="font-semibold font-ge-ss">{formatViews(currentEpisode.likes)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/90 font-ge-ss">المدة</span>
                    <span className="font-semibold font-ge-ss">{formatDuration(currentEpisode.duration)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Program Description and Episodes */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Program Description - 2 columns */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white mb-8">
              <h3 className="text-xl font-semibold text-zawaya-primary mb-4 font-ge-ss">عن البرنامج</h3>
              <div className="space-y-4 text-gray-700 font-ge-ss leading-relaxed">
                {program.description.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Host Bio */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 font-ge-ss">عن مقدم البرنامج</h4>
                <div className="flex items-start space-x-4 space-x-reverse">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={program.host_avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-zawaya-primary text-white font-ge-ss text-lg">
                      {getInitials(program.host)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 font-ge-ss">{program.host}</h5>
                    <p className="text-gray-600 font-ge-ss leading-relaxed">{program.host_bio}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Episodes List - 1 column */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-semibold text-zawaya-primary mb-6 font-ge-ss">
                الحلقات ({program.episodes.length})
              </h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {program.episodes.map((episode) => (
                  <div
                    key={episode.id}
                    onClick={() => setCurrentEpisode(episode)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentEpisode.id === episode.id
                        ? "bg-zawaya-accent/10 border border-zawaya-accent"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start space-x-3 space-x-reverse">
                      {/* Episode Thumbnail */}
                      <div className="flex-shrink-0">
                        <div
                          className="w-16 h-12 rounded bg-gradient-to-br from-zawaya-menthol to-zawaya-yellow flex items-center justify-center"
                          style={{
                            backgroundImage: episode.cover_image_url ? `url(${episode.cover_image_url})` : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {currentEpisode.id === episode.id ? (
                            <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                              <Play className="w-3 h-3 text-zawaya-primary" />
                            </div>
                          ) : (
                            <Play className="w-4 h-4 text-white/70" />
                          )}
                        </div>
                      </div>

                      {/* Episode Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500 font-ge-ss">الحلقة {episode.episode_number}</span>
                          <span className="text-xs text-gray-500 font-ge-ss">{formatDuration(episode.duration)}</span>
                        </div>

                        <h4
                          className={`font-medium text-sm line-clamp-2 font-ge-ss leading-tight mb-2 ${
                            currentEpisode.id === episode.id ? "text-zawaya-accent" : "text-gray-900"
                          }`}
                        >
                          {episode.title}
                        </h4>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Eye className="w-3 h-3" />
                            <span className="font-ge-ss">{formatViews(episode.views)}</span>
                          </div>
                          <span className="font-ge-ss">{formatDate(episode.published_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="bg-transparent border-zawaya-accent text-zawaya-accent hover:bg-zawaya-accent hover:text-white font-ge-ss"
                >
                  عرض المزيد من الحلقات
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
