"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Calendar, Clock, Headphones, Video, ExternalLink, Loader2 } from "lucide-react"
import { colors } from "@/lib/theme"

interface Program {
  id: string
  title_ar: string
  description_ar: string
  cover_image_url?: string
  type: "audio" | "video" | "mixed"
  status: "active" | "inactive" | "archived"
  host_ar?: string
  episode_count: number
  duration_avg: number // in minutes
  launch_date?: string
  latest_episode_date?: string
  slug: string
  featured: boolean
  episodes?: Array<{
    id: string
    title_ar: string
  }>
}

export default function ProgramsListPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>("all")

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/programs')
        const result = await response.json()
        
        if (result.success) {
          setPrograms(result.data)
        } else {
          setError(result.error || 'خطأ في تحميل البرامج')
        }
      } catch (err) {
        setError('خطأ في تحميل البرامج')
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])
  const types = [
    { value: "audio", label: "صوتي", icon: Headphones },
    { value: "video", label: "مرئي", icon: Video },
    { value: "mixed", label: "مختلط", icon: Play },
  ]

  // Filter programs
  const filteredPrograms = programs.filter((program) => {
    const typeMatch = selectedType === "all" || program.type === selectedType
    return typeMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل البرامج...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
        </div>
      </div>
    )
  }

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
      case "inactive":
        return "bg-blue-100 text-blue-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "نشط"
      case "inactive":
        return "متوقف"
      case "archived":
        return "مؤرشف"
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
            backgroundImage: `url(${program.cover_image_url || '/images/placeholder-program.jpg'})`,
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

          {/* Hover Overlay with Description */}
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 transform transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            <p className="text-white font-ge-ss text-lg font-medium leading-relaxed">{program.description_ar}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title and Category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-zawaya-accent transition-colors font-ge-ss">
              {program.title_ar}
            </h3>
            <Badge variant="outline" className="text-xs font-ge-ss">
              {getTypeLabel(program.type)}
            </Badge>
          </div>
          <p className="text-gray-600 line-clamp-2 font-ge-ss text-sm leading-relaxed">{program.description_ar}</p>
        </div>

        {/* Host and Stats */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <span className="font-ge-ss">مقدم البرنامج:</span>
            <span className="font-medium font-ge-ss">{program.host_ar || 'فريق زوايا'}</span>
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
            asChild
          >
            <a href={`/ar/programs/${program.id}`}>
              <ExternalLink className="w-4 h-4" />
              <span>استمع الآن</span>
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
}
