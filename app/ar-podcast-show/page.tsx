"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AudioPlayer from "@/components/audio-player"
import {
  Play,
  Headphones,
  Calendar,
  Clock,
  Download,
  Share2,
  Heart,
  Bookmark,
  Users,
  TrendingUp,
  Star,
  Mic,
  Volume2,
} from "lucide-react"
import { colors } from "@/lib/theme"

interface Episode {
  id: string
  title: string
  description: string
  episode_number: number
  season_number: number
  duration: number // in seconds
  audio_url: string
  cover_image_url?: string
  published_at: string
  views: number
  likes: number
  downloads: number
  status: "published" | "draft" | "scheduled"
  slug: string
  transcript_url?: string
}

interface Podcast {
  id: string
  title: string
  tagline: string
  description: string
  cover_image_url: string
  type: "audio"
  status: "active" | "upcoming" | "completed"
  host: string
  host_bio: string
  host_avatar?: string
  total_episodes: number
  total_listens: number
  total_downloads: number
  total_duration: number // in seconds
  average_rating: number
  subscriber_count: number
  category: string
  launch_date: string
  latest_episode_date: string
  slug: string
  featured: boolean
  episodes: Episode[]
  rss_feed_url?: string
  apple_podcasts_url?: string
  spotify_url?: string
  google_podcasts_url?: string
}

// Sample podcast data with episodes
const samplePodcast: Podcast = {
  id: "1",
  title: "حدث ومعنى",
  tagline: "فهم الأحداث من خلال السياق والمعنى",
  description: `برنامج صوتي تحليلي أسبوعي يتناول الأحداث الجارية ويضعها في سياقها التاريخي والثقافي والسياسي لفهم معناها الأعمق. نحن نؤمن بأن كل حدث له قصة أكبر، وكل تطور له جذور تاريخية وأبعاد متعددة يجب استكشافها.

في كل حلقة، نأخذكم في رحلة تحليلية لفهم الأحداث من زوايا مختلفة، مع الاستعانة بخبراء ومختصين ومصادر موثوقة لتقديم تحليل شامل وموضوعي للقضايا المطروحة.

البرنامج يغطي مواضيع متنوعة من السياسة المحلية والإقليمية والدولية، إلى القضايا الاقتصادية والاجتماعية والثقافية التي تشكل عالمنا المعاصر.

نهدف إلى تقديم محتوى صوتي عالي الجودة يساعد المستمعين على فهم التعقيدات في عالمنا المتغير، ويمنحهم الأدوات اللازمة لتكوين آراء مدروسة حول القضايا المهمة.`,
  cover_image_url: "/placeholder.svg?height=400&width=400&text=حدث+ومعنى",
  type: "audio",
  status: "active",
  host: "د. محمد المحلل",
  host_bio:
    "محلل سياسي واقتصادي متخصص في الشؤون الإقليمية والدولية، حاصل على دكتوراه في العلوم السياسية من جامعة السوربون، ويتمتع بخبرة أكثر من 20 عاماً في مجال التحليل والإعلام",
  host_avatar: "/placeholder.svg?height=80&width=80&text=محمد",
  total_episodes: 56,
  total_listens: 3200000,
  total_downloads: 1800000,
  total_duration: 117600, // ~32.5 hours
  average_rating: 4.8,
  subscriber_count: 145000,
  category: "تحليل",
  launch_date: "2024-01-10",
  latest_episode_date: "2025-01-14",
  slug: "event-and-meaning",
  featured: true,
  rss_feed_url: "https://feeds.zawaya.org/event-and-meaning",
  apple_podcasts_url: "https://podcasts.apple.com/podcast/event-and-meaning",
  spotify_url: "https://open.spotify.com/show/event-and-meaning",
  google_podcasts_url: "https://podcasts.google.com/feed/event-and-meaning",
  episodes: [
    {
      id: "ep-56",
      title: "التحولات الجيوسياسية في 2025: قراءة في المشهد العالمي",
      description:
        "تحليل شامل للتحولات الجيوسياسية المتوقعة في عام 2025، مع التركيز على تأثيرها على المنطقة العربية والنظام العالمي الجديد",
      episode_number: 56,
      season_number: 3,
      duration: 2520, // 42 minutes
      audio_url: "/sample-audio.mp3",
      cover_image_url: "/placeholder.svg?height=300&width=300&text=الحلقة+56",
      published_at: "2025-01-14T18:00:00Z",
      views: 125000,
      likes: 4200,
      downloads: 89000,
      status: "published",
      slug: "geopolitical-transformations-2025",
      transcript_url: "/transcripts/ep-56.txt",
    },
    {
      id: "ep-55",
      title: "الذكاء الاصطناعي والمجتمع: فرص وتحديات",
      description:
        "نقاش معمق حول تأثير الذكاء الاصطناعي على المجتمعات العربية، الفرص الاقتصادية والتحديات الأخلاقية والاجتماعية",
      episode_number: 55,
      season_number: 3,
      duration: 2340, // 39 minutes
      audio_url: "/sample-audio-2.mp3",
      cover_image_url: "/placeholder.svg?height=300&width=300&text=الحلقة+55",
      published_at: "2025-01-07T18:00:00Z",
      views: 98000,
      likes: 3800,
      downloads: 72000,
      status: "published",
      slug: "ai-society-opportunities-challenges",
      transcript_url: "/transcripts/ep-55.txt",
    },
    {
      id: "ep-54",
      title: "أزمة المناخ والأمن الغذائي في المنطقة العربية",
      description:
        "استكشاف تأثير التغير المناخي على الأمن الغذائي في المنطقة العربية والسياسات المطلوبة للتكيف مع هذه التحديات",
      episode_number: 54,
      season_number: 3,
      duration: 2680, // 44.5 minutes
      audio_url: "/sample-audio-3.mp3",
      cover_image_url: "/placeholder.svg?height=300&width=300&text=الحلقة+54",
      published_at: "2024-12-31T18:00:00Z",
      views: 87000,
      likes: 3200,
      downloads: 65000,
      status: "published",
      slug: "climate-crisis-food-security-arab-region",
    },
    {
      id: "ep-53",
      title: "الاقتصاد الرقمي في دول الخليج: نحو التنويع الاقتصادي",
      description:
        "تحليل للتطورات في الاقتصاد الرقمي في دول الخليج ودوره في تحقيق التنويع الاقتصادي وتقليل الاعتماد على النفط",
      episode_number: 53,
      season_number: 3,
      duration: 2420, // 40.5 minutes
      audio_url: "/sample-audio-4.mp3",
      cover_image_url: "/placeholder.svg?height=300&width=300&text=الحلقة+53",
      published_at: "2024-12-24T18:00:00Z",
      views: 76000,
      likes: 2900,
      downloads: 58000,
      status: "published",
      slug: "digital-economy-gulf-diversification",
    },
    {
      id: "ep-52",
      title: "الانتخابات الأمريكية وتأثيرها على الشرق الأوسط",
      description:
        "قراءة في نتائج الانتخابات الأمريكية وتحليل التأثيرات المحتملة على سياسات الولايات المتحدة في منطقة الشرق الأوسط",
      episode_number: 52,
      season_number: 3,
      duration: 2780, // 46.5 minutes
      audio_url: "/sample-audio-5.mp3",
      cover_image_url: "/placeholder.svg?height=300&width=300&text=الحلقة+52",
      published_at: "2024-12-17T18:00:00Z",
      views: 112000,
      likes: 4500,
      downloads: 84000,
      status: "published",
      slug: "us-elections-middle-east-impact",
    },
  ],
}

export default function PodcastShowPage() {
  const [podcast] = useState<Podcast>(samplePodcast)
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(podcast.episodes[0])
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

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

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}م`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}ك`
    }
    return num.toString()
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

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const toggleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Audio Player */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Audio Player Section - 3 columns */}
          <div className="lg:col-span-3">
            {/* Podcast Cover and Info */}
            <Card className="overflow-hidden bg-white mb-6">
              <div className="md:flex">
                {/* Cover Art */}
                <div className="md:w-1/3 relative">
                  <div
                    className="w-full h-64 md:h-80 bg-gradient-to-br from-zawaya-primary to-zawaya-iris"
                    style={{
                      backgroundImage: `url(${currentEpisode.cover_image_url || podcast.cover_image_url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Episode Number Badge */}
                    <Badge
                      className="absolute top-4 right-4 bg-zawaya-accent text-white font-ge-ss"
                      style={{ backgroundColor: colors.accent }}
                    >
                      الحلقة {currentEpisode.episode_number}
                    </Badge>

                    {/* Audio Icon */}
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-zawaya-primary" />
                    </div>
                  </div>
                </div>

                {/* Episode Info */}
                <div className="md:w-2/3 p-6 flex flex-col justify-center">
                  <div className="mb-4">
                    <Badge
                      variant="outline"
                      className="border-zawaya-accent text-zawaya-accent bg-transparent font-ge-ss mb-2"
                      style={{ borderColor: colors.accent, color: colors.accent }}
                    >
                      {podcast.category}
                    </Badge>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 font-ge-ss leading-tight">
                      {currentEpisode.title}
                    </h1>
                    <p className="text-zawaya-accent font-medium mb-3 font-ge-ss">{podcast.title}</p>
                  </div>

                  <p className="text-gray-600 font-ge-ss leading-relaxed mb-4 line-clamp-3">
                    {currentEpisode.description}
                  </p>

                  {/* Episode Meta */}
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Calendar className="w-4 h-4" />
                      <span className="font-ge-ss">{formatDate(currentEpisode.published_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Clock className="w-4 h-4" />
                      <span className="font-ge-ss">{formatDuration(currentEpisode.duration)}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Volume2 className="w-4 h-4" />
                      <span className="font-ge-ss">{formatNumber(currentEpisode.views)} استماع</span>
                    </div>
                  </div>

                  {/* Episode Actions */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                      onClick={toggleLike}
                      className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full transition-all duration-200 ${
                        isLiked
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      <span className="font-ge-ss text-sm">{formatNumber(currentEpisode.likes)}</span>
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
                </div>
              </div>
            </Card>

            {/* Audio Player */}
            <AudioPlayer
              src={currentEpisode.audio_url}
              title={`${currentEpisode.title} - ${podcast.title}`}
              className="mb-6"
            />

            {/* Transcript Section */}
            {currentEpisode.transcript_url && (
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-semibold text-zawaya-primary mb-4 font-ge-ss flex items-center space-x-2 space-x-reverse">
                  <Mic className="w-5 h-5" />
                  <span>نص الحلقة</span>
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 font-ge-ss text-sm mb-3">
                    يمكنك قراءة النص الكامل للحلقة أو البحث في محتواها
                  </p>
                  <Button
                    variant="outline"
                    className="bg-transparent border-zawaya-accent text-zawaya-accent hover:bg-zawaya-accent hover:text-white font-ge-ss"
                  >
                    عرض النص الكامل
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Podcast Info Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Podcast Title Card */}
              <Card className="p-6 bg-white">
                <div className="text-center mb-6">
                  <div
                    className="w-24 h-24 mx-auto mb-4 rounded-lg bg-gradient-to-br from-zawaya-primary to-zawaya-iris"
                    style={{
                      backgroundImage: `url(${podcast.cover_image_url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <h2 className="text-xl font-bold text-zawaya-primary mb-2 font-ge-ss">{podcast.title}</h2>
                  <p className="text-gray-600 font-ge-ss text-sm">{podcast.tagline}</p>
                  <Badge
                    variant="outline"
                    className="mt-3 border-zawaya-accent text-zawaya-accent bg-transparent font-ge-ss"
                    style={{ borderColor: colors.accent, color: colors.accent }}
                  >
                    {podcast.category}
                  </Badge>
                </div>

                {/* Host Info */}
                <div className="flex items-center space-x-3 space-x-reverse mb-6 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={podcast.host_avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-zawaya-primary text-white font-ge-ss">
                      {getInitials(podcast.host)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 font-ge-ss">{podcast.host}</h4>
                    <p className="text-sm text-gray-600 font-ge-ss">مقدم البودكاست</p>
                  </div>
                </div>

                {/* Subscribe Button */}
                <Button
                  onClick={toggleSubscribe}
                  className={`w-full font-ge-ss mb-4 ${
                    isSubscribed
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-zawaya-accent hover:bg-zawaya-accent/90 text-white"
                  }`}
                  style={!isSubscribed ? { backgroundColor: colors.accent } : {}}
                >
                  <Users className="w-4 h-4 ml-2" />
                  {isSubscribed ? "مشترك" : "اشترك في البودكاست"}
                </Button>

                {/* Platform Links */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 font-ge-ss">استمع على:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {podcast.apple_podcasts_url && (
                      <Button variant="outline" size="sm" className="bg-transparent text-xs font-ge-ss">
                        Apple Podcasts
                      </Button>
                    )}
                    {podcast.spotify_url && (
                      <Button variant="outline" size="sm" className="bg-transparent text-xs font-ge-ss">
                        Spotify
                      </Button>
                    )}
                    {podcast.google_podcasts_url && (
                      <Button variant="outline" size="sm" className="bg-transparent text-xs font-ge-ss">
                        Google Podcasts
                      </Button>
                    )}
                    {podcast.rss_feed_url && (
                      <Button variant="outline" size="sm" className="bg-transparent text-xs font-ge-ss">
                        RSS Feed
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Podcast Statistics */}
              <Card className="p-6 bg-white">
                <h3 className="font-semibold text-gray-900 mb-4 font-ge-ss">إحصائيات البودكاست</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Volume2 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">إجمالي الاستماع</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">
                      {formatNumber(podcast.total_listens)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Download className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">إجمالي التحميلات</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">
                      {formatNumber(podcast.total_downloads)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">إجمالي المدة</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">
                      {Math.round(podcast.total_duration / 3600)} ساعة
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">عدد الحلقات</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">{podcast.total_episodes}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">المشتركون</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">
                      {formatNumber(podcast.subscriber_count)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 font-ge-ss">التقييم</span>
                    </div>
                    <span className="font-semibold text-zawaya-primary font-ge-ss">{podcast.average_rating}/5</span>
                  </div>
                </div>
              </Card>

              {/* Current Episode Stats */}
              <Card className="p-6 bg-gradient-to-br from-zawaya-primary to-zawaya-iris text-white">
                <h3 className="font-semibold mb-4 font-ge-ss">إحصائيات هذه الحلقة</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/90 font-ge-ss">الاستماع</span>
                    <span className="font-semibold font-ge-ss">{formatNumber(currentEpisode.views)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/90 font-ge-ss">الإعجابات</span>
                    <span className="font-semibold font-ge-ss">{formatNumber(currentEpisode.likes)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/90 font-ge-ss">التحميلات</span>
                    <span className="font-semibold font-ge-ss">{formatNumber(currentEpisode.downloads)}</span>
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

        {/* Podcast Description and Episodes */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Podcast Description - 2 columns */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white mb-8">
              <h3 className="text-xl font-semibold text-zawaya-primary mb-4 font-ge-ss">عن البودكاست</h3>
              <div className="space-y-4 text-gray-700 font-ge-ss leading-relaxed">
                {podcast.description.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Host Bio */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 font-ge-ss">عن مقدم البودكاست</h4>
                <div className="flex items-start space-x-4 space-x-reverse">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={podcast.host_avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-zawaya-primary text-white font-ge-ss text-lg">
                      {getInitials(podcast.host)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 font-ge-ss">{podcast.host}</h5>
                    <p className="text-gray-600 font-ge-ss leading-relaxed">{podcast.host_bio}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Episodes List - 1 column */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-semibold text-zawaya-primary mb-6 font-ge-ss">
                الحلقات ({podcast.episodes.length})
              </h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {podcast.episodes.map((episode) => (
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
                          className="w-16 h-16 rounded bg-gradient-to-br from-zawaya-menthol to-zawaya-yellow flex items-center justify-center"
                          style={{
                            backgroundImage: episode.cover_image_url ? `url(${episode.cover_image_url})` : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {currentEpisode.id === episode.id ? (
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Play className="w-4 h-4 text-zawaya-primary" />
                            </div>
                          ) : (
                            <Headphones className="w-5 h-5 text-white/70" />
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
                            <Volume2 className="w-3 h-3" />
                            <span className="font-ge-ss">{formatNumber(episode.views)}</span>
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
