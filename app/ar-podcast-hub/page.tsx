"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Play, Video, Headphones, Calendar, Clock, Users, TrendingUp, ExternalLink } from "lucide-react"
import { colors } from "@/lib/theme"

interface Program {
  id: string
  title: string
  tagline: string
  description: string
  cover_image_url: string
  type: "audio" | "video" | "mixed"
  status: "active" | "upcoming" | "completed"
  host: string
  host_avatar?: string
  episode_count: number
  duration_avg: number // in minutes
  category: string
  launch_date: string
  latest_episode_date?: string
  slug: string
  featured?: boolean
  subscriber_count: number
  total_views: number
}

// Updated mock programs with new seeds
const mockPrograms: Program[] = [
  // Video Programs
  {
    id: "1",
    title: "ترانزيت",
    tagline: "رحلة عبر قصص الهجرة والانتقال",
    description:
      "برنامج وثائقي يتتبع قصص الأشخاص في رحلات انتقالهم وهجرتهم، ويستكشف التحديات والفرص التي يواجهونها في بحثهم عن حياة أفضل",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=ترانزيت",
    type: "video",
    status: "active",
    host: "ليلى الوثائقية",
    host_avatar: "/placeholder.svg?height=40&width=40&text=ليلى",
    episode_count: 24,
    duration_avg: 45,
    category: "وثائقي",
    launch_date: "2024-02-01",
    latest_episode_date: "2025-01-12",
    slug: "transit",
    featured: true,
    subscriber_count: 89000,
    total_views: 1200000,
  },
  {
    id: "2",
    title: "شمال جنوب",
    tagline: "حوارات تربط بين القارات",
    description:
      "برنامج حواري يجمع بين ضيوف من الشمال والجنوب العالمي لمناقشة القضايا المشتركة والاختلافات الثقافية والاقتصادية",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=شمال+جنوب",
    type: "video",
    status: "active",
    host: "د. أحمد الدولي",
    host_avatar: "/placeholder.svg?height=40&width=40&text=أحمد",
    episode_count: 18,
    duration_avg: 52,
    category: "حوارات",
    launch_date: "2024-04-15",
    latest_episode_date: "2025-01-08",
    slug: "north-south",
    featured: false,
    subscriber_count: 67000,
    total_views: 890000,
  },
  {
    id: "3",
    title: "ترانزستور",
    tagline: "التكنولوجيا التي تغير عالمنا",
    description: "برنامج تقني يستكشف أحدث التطورات في عالم التكنولوجيا وتأثيرها على حياتنا اليومية والمستقبل",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=ترانزستور",
    type: "video",
    status: "active",
    host: "سارة التقنية",
    host_avatar: "/placeholder.svg?height=40&width=40&text=سارة",
    episode_count: 32,
    duration_avg: 28,
    category: "تكنولوجيا",
    launch_date: "2024-03-20",
    latest_episode_date: "2025-01-08",
    slug: "transistor",
    featured: true,
    subscriber_count: 125000,
    total_views: 1800000,
  },
  {
    id: "4",
    title: "حوارات زوايا",
    tagline: "لقاءات مع صناع التأثير",
    description: "برنامج حواري يستضيف شخصيات مؤثرة من مختلف المجالات لمناقشة القضايا المعاصرة والتحديات المستقبلية",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=حوارات+زوايا",
    type: "video",
    status: "active",
    host: "نور المذيعة",
    host_avatar: "/placeholder.svg?height=40&width=40&text=نور",
    episode_count: 24,
    duration_avg: 55,
    category: "حوارات",
    launch_date: "2024-04-01",
    latest_episode_date: "2025-01-05",
    slug: "zawaya-dialogues",
    featured: false,
    subscriber_count: 78000,
    total_views: 950000,
  },

  // Audio Programs
  {
    id: "5",
    title: "حدث ومعنى",
    tagline: "فهم الأحداث من خلال السياق والمعنى",
    description:
      "برنامج صوتي تحليلي يتناول الأحداث الجارية ويضعها في سياقها التاريخي والثقافي والسياسي لفهم معناها الأعمق",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=حدث+ومعنى",
    type: "audio",
    status: "active",
    host: "د. محمد المحلل",
    host_avatar: "/placeholder.svg?height=40&width=40&text=محمد",
    episode_count: 56,
    duration_avg: 35,
    category: "تحليل",
    launch_date: "2024-01-10",
    latest_episode_date: "2025-01-14",
    slug: "event-and-meaning",
    featured: true,
    subscriber_count: 145000,
    total_views: 2100000,
  },
  {
    id: "6",
    title: "أصل الخبر",
    tagline: "نكشف لك الحقيقة وراء الأخبار",
    description: "برنامج استقصائي يتعمق في الأحداث الجارية ويكشف الخلفيات والسياقات التي تقف وراء الأخبار الرئيسية",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=أصل+الخبر",
    type: "audio",
    status: "active",
    host: "أحمد الصحفي",
    host_avatar: "/placeholder.svg?height=40&width=40&text=أحمد",
    episode_count: 45,
    duration_avg: 35,
    category: "إعلام",
    launch_date: "2024-01-15",
    latest_episode_date: "2025-01-10",
    slug: "asl-al-khabar",
    featured: true,
    subscriber_count: 125000,
    total_views: 2500000,
  },
  {
    id: "7",
    title: "لخصنا لك",
    tagline: "أهم الأحداث في دقائق معدودة",
    description: "ملخص يومي سريع لأهم الأحداث والتطورات في المنطقة والعالم، مقدم بأسلوب مبسط وواضح",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=لخصنا+لك",
    type: "audio",
    status: "active",
    host: "فريق التحرير",
    host_avatar: "/placeholder.svg?height=40&width=40&text=فريق",
    episode_count: 120,
    duration_avg: 8,
    category: "أخبار",
    launch_date: "2024-01-01",
    latest_episode_date: "2025-01-15",
    slug: "lakhasna-lak",
    featured: false,
    subscriber_count: 98000,
    total_views: 1500000,
  },
  {
    id: "8",
    title: "اقتصاد بلا حدود",
    tagline: "الاقتصاد العالمي بعيون عربية",
    description: "تحليل اقتصادي معمق للأسواق العالمية والإقليمية مع التركيز على تأثيرها على الاقتصادات العربية",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=اقتصاد+بلا+حدود",
    type: "audio",
    status: "active",
    host: "خالد الاقتصادي",
    host_avatar: "/placeholder.svg?height=40&width=40&text=خالد",
    episode_count: 36,
    duration_avg: 40,
    category: "اقتصاد",
    launch_date: "2024-05-15",
    latest_episode_date: "2025-01-07",
    slug: "economy-without-borders",
    featured: false,
    subscriber_count: 72000,
    total_views: 980000,
  },
]

export default function PodcastHubPage() {
  const [activeTab, setActiveTab] = useState<"video" | "audio">("video")
  const [programs] = useState<Program[]>(mockPrograms)

  // Filter programs by type
  const filteredPrograms = programs.filter((program) => program.type === activeTab)

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
      month: "short",
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

  const getTypeIcon = (type: string) => {
    return type === "video" ? <Video className="w-5 h-5" /> : <Headphones className="w-5 h-5" />
  }

  const getTypeLabel = (type: string) => {
    return type === "video" ? "مرئي" : "صوتي"
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-zawaya-primary rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-zawaya-primary mb-4 font-ge-ss">مركز البودكاست</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-ge-ss leading-relaxed">
            اكتشف مجموعة متنوعة من البرامج الصوتية والمرئية التي تغطي أهم القضايا المعاصرة بأسلوب تحليلي معمق
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-2 shadow-sm border border-gray-200">
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={() => setActiveTab("video")}
                className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-full font-medium transition-all duration-300 font-ge-ss ${
                  activeTab === "video"
                    ? "bg-zawaya-accent text-white shadow-md"
                    : "text-gray-600 hover:text-zawaya-accent hover:bg-gray-50"
                }`}
                style={activeTab === "video" ? { backgroundColor: colors.accent } : {}}
              >
                <Video className="w-5 h-5" />
                <span>مرئي</span>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    activeTab === "video" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {programs.filter((p) => p.type === "video").length}
                </Badge>
              </button>

              <button
                onClick={() => setActiveTab("audio")}
                className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-full font-medium transition-all duration-300 font-ge-ss ${
                  activeTab === "audio"
                    ? "bg-zawaya-accent text-white shadow-md"
                    : "text-gray-600 hover:text-zawaya-accent hover:bg-gray-50"
                }`}
                style={activeTab === "audio" ? { backgroundColor: colors.accent } : {}}
              >
                <Headphones className="w-5 h-5" />
                <span>صوتي</span>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    activeTab === "audio" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {programs.filter((p) => p.type === "audio").length}
                </Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-zawaya-primary mb-2 font-ge-ss flex items-center justify-center space-x-3 space-x-reverse">
            {getTypeIcon(activeTab)}
            <span>البرامج {getTypeLabel(activeTab)}ة</span>
          </h2>
          <p className="text-gray-600 font-ge-ss">
            {filteredPrograms.length} برنامج {getTypeLabel(activeTab).toLowerCase()}
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>

        {/* Featured Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-zawaya-primary mb-8 font-ge-ss text-center">البرامج المميزة</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {programs
              .filter((p) => p.featured)
              .slice(0, 2)
              .map((program) => (
                <FeaturedProgramCard key={program.id} program={program} />
              ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-zawaya-primary to-zawaya-iris text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 font-ge-ss">لا تفوت أي حلقة جديدة</h3>
            <p className="text-lg mb-6 text-white/90 font-ge-ss">
              اشترك في نشرتنا البريدية للحصول على إشعارات بأحدث الحلقات والبرامج الجديدة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-ge-ss text-right w-full sm:w-auto"
                dir="rtl"
              />
              <Button className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white px-8 py-3 font-ge-ss w-full sm:w-auto">
                اشترك الآن
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Program Card Component
interface ProgramCardProps {
  program: Program
}

function ProgramCard({ program }: ProgramCardProps) {
  const [isHovered, setIsHovered] = useState(false)

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
      month: "short",
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

  const getTypeIcon = (type: string) => {
    return type === "video" ? <Video className="w-4 h-4" /> : <Headphones className="w-4 h-4" />
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="w-full h-full bg-gradient-to-br from-zawaya-menthol to-zawaya-yellow group-hover:scale-105 transition-transform duration-300"
          style={{
            backgroundImage: `url(${program.cover_image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Featured Badge */}
          {program.featured && (
            <Badge
              className="absolute top-3 right-3 bg-zawaya-accent text-white font-ge-ss"
              style={{ backgroundColor: colors.accent }}
            >
              مميز
            </Badge>
          )}

          {/* Type Icon */}
          <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
            {getTypeIcon(program.type)}
          </div>

          {/* Play Button Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-zawaya-primary mr-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title and Category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-zawaya-accent transition-colors font-ge-ss">
              {program.title}
            </h3>
            <Badge variant="outline" className="text-xs font-ge-ss">
              {program.category}
            </Badge>
          </div>
          <p className="text-zawaya-accent font-medium text-sm font-ge-ss">{program.tagline}</p>
          <p className="text-gray-600 line-clamp-2 font-ge-ss text-sm leading-relaxed">{program.description}</p>
        </div>

        {/* Host */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <Avatar className="h-8 w-8">
            <AvatarImage src={program.host_avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-zawaya-primary text-white font-ge-ss text-xs">
              {getInitials(program.host)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900 text-sm font-ge-ss">{program.host}</p>
            <p className="text-xs text-gray-500 font-ge-ss">مقدم البرنامج</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2 space-x-reverse">
            <TrendingUp className="w-4 h-4" />
            <span className="font-ge-ss">{program.episode_count} حلقة</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Clock className="w-4 h-4" />
            <span className="font-ge-ss">{program.duration_avg} دقيقة</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Users className="w-4 h-4" />
            <span className="font-ge-ss">{formatViews(program.subscriber_count)}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Calendar className="w-4 h-4" />
            <span className="font-ge-ss">{program.latest_episode_date && formatDate(program.latest_episode_date)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100">
          <Button
            className="w-full bg-zawaya-primary hover:bg-zawaya-primary/90 text-white font-ge-ss flex items-center justify-center space-x-2 space-x-reverse"
            style={{ backgroundColor: colors.primary }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>{program.type === "video" ? "شاهد الآن" : "استمع الآن"}</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Featured Program Card Component
function FeaturedProgramCard({ program }: ProgramCardProps) {
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}م`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}ك`
    }
    return views.toString()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
  }

  const getTypeIcon = (type: string) => {
    return type === "video" ? <Video className="w-5 h-5" /> : <Headphones className="w-5 h-5" />
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white">
      <div className="md:flex">
        {/* Image */}
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <div
            className="w-full h-full bg-gradient-to-br from-zawaya-iris to-zawaya-primary group-hover:scale-105 transition-transform duration-300"
            style={{
              backgroundImage: `url(${program.cover_image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Play Button */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 text-zawaya-primary mr-1" />
              </div>
            </div>

            {/* Type Badge */}
            <Badge
              className="absolute top-4 right-4 bg-white/90 text-zawaya-primary font-ge-ss flex items-center space-x-1 space-x-reverse"
              variant="secondary"
            >
              {getTypeIcon(program.type)}
              <span>{program.type === "video" ? "مرئي" : "صوتي"}</span>
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <Badge
            className="w-fit mb-3 bg-zawaya-accent text-white font-ge-ss"
            style={{ backgroundColor: colors.accent }}
          >
            برنامج مميز
          </Badge>

          <h3 className="text-2xl font-bold text-gray-900 mb-2 font-ge-ss group-hover:text-zawaya-accent transition-colors">
            {program.title}
          </h3>

          <p className="text-zawaya-accent font-medium mb-3 font-ge-ss">{program.tagline}</p>

          <p className="text-gray-600 mb-4 font-ge-ss leading-relaxed line-clamp-3">{program.description}</p>

          {/* Host and Stats */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Avatar className="h-8 w-8">
                <AvatarImage src={program.host_avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-zawaya-primary text-white font-ge-ss text-xs">
                  {getInitials(program.host)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-900 font-ge-ss">{program.host}</span>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
              <span className="font-ge-ss">{program.episode_count} حلقة</span>
              <span className="font-ge-ss">{formatViews(program.total_views)} مشاهدة</span>
              <span className="font-ge-ss">{formatViews(program.subscriber_count)} مشترك</span>
            </div>
          </div>

          <Button
            className="bg-zawaya-primary hover:bg-zawaya-primary/90 text-white font-ge-ss flex items-center justify-center space-x-2 space-x-reverse"
            style={{ backgroundColor: colors.primary }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>{program.type === "video" ? "شاهد الآن" : "استمع الآن"}</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
