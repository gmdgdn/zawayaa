"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Calendar, Clock, Headphones, Video, ExternalLink } from "lucide-react"
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
  episode_count: number
  duration_avg: number // in minutes
  category: string
  launch_date: string
  latest_episode_date?: string
  slug: string
  featured?: boolean
}

// Mock data for the seeded programs
const mockPrograms: Program[] = [
  {
    id: "1",
    title: "أصل الخبر",
    tagline: "نكشف لك الحقيقة وراء الأخبار",
    description: "برنامج استقصائي يتعمق في الأحداث الجارية ويكشف الخلفيات والسياقات التي تقف وراء الأخبار الرئيسية",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=أصل+الخبر",
    type: "audio",
    status: "active",
    host: "أحمد الصحفي",
    episode_count: 45,
    duration_avg: 35,
    category: "إعلام",
    launch_date: "2024-01-15",
    latest_episode_date: "2025-01-10",
    slug: "asl-al-khabar",
    featured: true,
  },
  {
    id: "2",
    title: "ترانزستور",
    tagline: "التكنولوجيا التي تغير عالمنا",
    description: "برنامج تقني يستكشف أحدث التطورات في عالم التكنولوجيا وتأثيرها على حياتنا اليومية والمستقبل",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=ترانزستور",
    type: "video",
    status: "active",
    host: "سارة التقنية",
    episode_count: 32,
    duration_avg: 28,
    category: "تكنولوجيا",
    launch_date: "2024-03-20",
    latest_episode_date: "2025-01-08",
    slug: "transistor",
  },
  {
    id: "3",
    title: "جيوبوليتيكا",
    tagline: "فهم السياسة من منظور جغرافي",
    description:
      "تحليل عميق للأحداث السياسية العالمية من خلال فهم الجغرافيا السياسية وتأثيرها على القرارات الاستراتيجية",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=جيوبوليتيكا",
    type: "mixed",
    status: "active",
    host: "د. محمد الجغرافي",
    episode_count: 28,
    duration_avg: 42,
    category: "سياسة",
    launch_date: "2024-02-10",
    latest_episode_date: "2025-01-12",
    slug: "geopolitica",
    featured: true,
  },
  {
    id: "4",
    title: "لخصنا لك",
    tagline: "أهم الأحداث في دقائق معدودة",
    description: "ملخص يومي سريع لأهم الأحداث والتطورات في المنطقة والعالم، مقدم بأسلوب مبسط وواضح",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=لخصنا+لك",
    type: "audio",
    status: "active",
    host: "فريق التحرير",
    episode_count: 120,
    duration_avg: 8,
    category: "أخبار",
    launch_date: "2024-01-01",
    latest_episode_date: "2025-01-15",
    slug: "lakhasna-lak",
  },
  {
    id: "5",
    title: "حوارات زوايا",
    tagline: "لقاءات مع صناع التأثير",
    description: "برنامج حواري يستضيف شخصيات مؤثرة من مختلف المجالات لمناقشة القضايا المعاصرة والتحديات المستقبلية",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=حوارات+زوايا",
    type: "video",
    status: "active",
    host: "نور المذيعة",
    episode_count: 24,
    duration_avg: 55,
    category: "حوارات",
    launch_date: "2024-04-01",
    latest_episode_date: "2025-01-05",
    slug: "zawaya-dialogues",
  },
  {
    id: "6",
    title: "اقتصاد بلا حدود",
    tagline: "الاقتصاد العالمي بعيون عربية",
    description: "تحليل اقتصادي معمق للأسواق العالمية والإقليمية مع التركيز على تأثيرها على الاقتصادات العربية",
    cover_image_url: "/placeholder.svg?height=300&width=400&text=اقتصاد+بلا+حدود",
    type: "audio",
    status: "active",
    host: "خالد الاقتصادي",
    episode_count: 36,
    duration_avg: 40,
    category: "اقتصاد",
    launch_date: "2024-05-15",
    latest_episode_date: "2025-01-07",
    slug: "economy-without-borders",
  },
]

export default function ProgramsListPage() {
  const [programs, setPrograms] = useState<Program[]>(mockPrograms)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  // Get unique categories
  const categories = Array.from(new Set(programs.map((p) => p.category)))
  const types = [
    { value: "audio", label: "صوتي", icon: Headphones },
    { value: "video", label: "مرئي", icon: Video },
    { value: "mixed", label: "مختلط", icon: Play },
  ]

  // Filter programs
  const filteredPrograms = programs.filter((program) => {
    const categoryMatch = selectedCategory === "all" || program.category === selectedCategory
    const typeMatch = selectedType === "all" || program.type === selectedType
    return categoryMatch && typeMatch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Headphones className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "mixed":
        return <Play className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "audio":
        return "صوتي"
      case "video":
        return "مرئي"
      case "mixed":
        return "مختلط"
      default:
        return "برنامج"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "نشط"
      case "upcoming":
        return "قريباً"
      case "completed":
        return "مكتمل"
      default:
        return "غير محدد"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-zawaya-primary mb-4 font-ge-ss">البرامج</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-ge-ss leading-relaxed">
            مجموعة متنوعة من البرامج الصوتية والمرئية التي تغطي أهم القضايا المعاصرة بأسلوب تحليلي معمق
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full font-ge-ss ${
                selectedCategory === "all"
                  ? "bg-zawaya-accent text-white hover:bg-zawaya-accent/90"
                  : "border-gray-300 text-gray-700 hover:border-zawaya-accent hover:text-zawaya-accent bg-transparent"
              }`}
              style={selectedCategory === "all" ? { backgroundColor: colors.accent } : {}}
            >
              جميع الفئات
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full font-ge-ss ${
                  selectedCategory === category
                    ? "bg-zawaya-accent text-white hover:bg-zawaya-accent/90"
                    : "border-gray-300 text-gray-700 hover:border-zawaya-accent hover:text-zawaya-accent bg-transparent"
                }`}
                style={selectedCategory === category ? { backgroundColor: colors.accent } : {}}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              onClick={() => setSelectedType("all")}
              className={`rounded-full font-ge-ss ${
                selectedType === "all"
                  ? "bg-zawaya-primary text-white hover:bg-zawaya-primary/90"
                  : "border-gray-300 text-gray-700 hover:border-zawaya-primary hover:text-zawaya-primary bg-transparent"
              }`}
              style={selectedType === "all" ? { backgroundColor: colors.primary } : {}}
            >
              جميع الأنواع
            </Button>
            {types.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                onClick={() => setSelectedType(type.value)}
                className={`rounded-full font-ge-ss flex items-center space-x-2 space-x-reverse ${
                  selectedType === type.value
                    ? "bg-zawaya-primary text-white hover:bg-zawaya-primary/90"
                    : "border-gray-300 text-gray-700 hover:border-zawaya-primary hover:text-zawaya-primary bg-transparent"
                }`}
                style={selectedType === type.value ? { backgroundColor: colors.primary } : {}}
              >
                <type.icon className="w-4 h-4" />
                <span>{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600 font-ge-ss">
            {filteredPrograms.length} برنامج
            {selectedCategory !== "all" && ` في فئة "${selectedCategory}"`}
            {selectedType !== "all" && ` من النوع "${getTypeLabel(selectedType)}"`}
          </p>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📻</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2 font-ge-ss">لا توجد برامج</h3>
            <p className="text-gray-500 font-ge-ss">لم نجد برامج تطابق معايير البحث المحددة</p>
            <Button
              onClick={() => {
                setSelectedCategory("all")
                setSelectedType("all")
              }}
              className="mt-4 bg-zawaya-accent hover:bg-zawaya-accent/90 text-white font-ge-ss"
              style={{ backgroundColor: colors.accent }}
            >
              مسح الفلاتر
            </Button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 text-center">
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Headphones className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "mixed":
        return <Play className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "audio":
        return "صوتي"
      case "video":
        return "مرئي"
      case "mixed":
        return "مختلط"
      default:
        return "برنامج"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "نشط"
      case "upcoming":
        return "قريباً"
      case "completed":
        return "مكتمل"
      default:
        return "غير محدد"
    }
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image with Overlay */}
      <div className="relative h-64 overflow-hidden">
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

          {/* Status Badge */}
          <Badge className={`absolute top-3 left-3 font-ge-ss ${getStatusColor(program.status)}`}>
            {getStatusLabel(program.status)}
          </Badge>

          {/* Type Icon */}
          <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
            {getTypeIcon(program.type)}
          </div>

          {/* Hover Overlay with Tagline */}
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 transform transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            <p className="text-white font-ge-ss text-lg font-medium leading-relaxed">{program.tagline}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title and Category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-zawaya-accent transition-colors font-ge-ss">
              {program.title}
            </h3>
            <Badge variant="outline" className="text-xs font-ge-ss">
              {program.category}
            </Badge>
          </div>
          <p className="text-gray-600 line-clamp-2 font-ge-ss text-sm leading-relaxed">{program.description}</p>
        </div>

        {/* Host and Stats */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <span className="font-ge-ss">مقدم البرنامج:</span>
            <span className="font-medium font-ge-ss">{program.host}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Calendar className="w-4 h-4" />
              <span className="font-ge-ss">{program.episode_count} حلقة</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Clock className="w-4 h-4" />
              <span className="font-ge-ss">{program.duration_avg} دقيقة</span>
            </div>
          </div>

          {program.latest_episode_date && (
            <div className="text-xs text-gray-500 font-ge-ss">آخر حلقة: {formatDate(program.latest_episode_date)}</div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100">
          <Button
            className="w-full bg-zawaya-primary hover:bg-zawaya-primary/90 text-white font-ge-ss flex items-center justify-center space-x-2 space-x-reverse"
            style={{ backgroundColor: colors.primary }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>استمع الآن</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
