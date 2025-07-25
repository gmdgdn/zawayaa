"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, Calendar, Eye, Share2, Download, Heart } from "lucide-react"
import { colors } from "@/lib/theme"

interface Documentary {
  id: string
  title: string
  synopsis: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
  releaseDate: string
  director: string
  category: string
  views: number
  likes: number
  tags: string[]
  featured?: boolean
}

// Sample documentary data
const documentaries: Documentary[] = [
  {
    id: "1",
    title: "أصوات من الشرق",
    synopsis:
      "رحلة استكشافية عبر التاريخ والثقافة في المنطقة العربية، تسلط الضوء على القصص المنسية والشخصيات المؤثرة التي شكلت هويتنا المعاصرة.",
    description:
      "وثائقي شامل يتناول التطورات الثقافية والاجتماعية في المنطقة العربية خلال القرن العشرين، من خلال شهادات حية ومواد أرشيفية نادرة. يستكشف الفيلم كيف تشكلت الهوية العربية المعاصرة وتأثير الأحداث التاريخية على المجتمعات العربية اليوم.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "52:30",
    releaseDate: "2024-01-15",
    director: "أحمد المصري",
    category: "تاريخ وثقافة",
    views: 125000,
    likes: 8500,
    tags: ["تاريخ", "ثقافة", "هوية", "عربي"],
    featured: true,
  },
  {
    id: "2",
    title: "مدن الصحراء",
    synopsis:
      "استكشاف للحضارات القديمة التي ازدهرت في قلب الصحراء العربية، وكيف تكيفت مع البيئة القاسية لتبني مجتمعات مزدهرة.",
    description:
      "رحلة بصرية مذهلة عبر المدن الصحراوية القديمة، تكشف أسرار الحضارات التي ازدهرت في أقسى البيئات. يتتبع الوثائقي طرق التجارة القديمة والابتكارات المعمارية والاجتماعية التي مكنت هذه المجتمعات من البقاء والازدهار.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "48:15",
    releaseDate: "2024-02-20",
    director: "فاطمة الزهراني",
    category: "تاريخ وآثار",
    views: 98000,
    likes: 6200,
    tags: ["صحراء", "حضارة", "آثار", "تجارة"],
  },
  {
    id: "3",
    title: "رواد الفكر العربي",
    synopsis:
      "لقاءات حصرية مع أبرز المفكرين والفلاسفة العرب المعاصرين، يتحدثون عن رؤيتهم للمستقبل وتحديات الفكر العربي الحديث.",
    description:
      "سلسلة من المقابلات المعمقة مع نخبة من المفكرين العرب، تستكشف أفكارهم حول التحديات المعاصرة والحلول المقترحة للنهضة الفكرية العربية. يناقش الوثائقي قضايا الهوية والحداثة والتراث في سياق عالمي متغير.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "65:45",
    releaseDate: "2024-03-10",
    director: "محمد الأسعد",
    category: "فكر وفلسفة",
    views: 156000,
    likes: 12000,
    tags: ["فكر", "فلسفة", "مفكرين", "نهضة"],
  },
  {
    id: "4",
    title: "البحر والحضارة",
    synopsis:
      "كيف شكلت البحار والمحيطات الحضارة العربية عبر التاريخ، من التجارة البحرية إلى الاستكشافات الجغرافية والتبادل الثقافي.",
    description:
      "وثائقي يتتبع العلاقة العميقة بين الشعوب العربية والبحر، من الملاحة القديمة في المحيط الهندي إلى التجارة عبر البحر المتوسط. يستكشف كيف أثر البحر على تطور المدن الساحلية والثقافة البحرية العربية.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "55:20",
    releaseDate: "2024-04-05",
    director: "ليلى البحراني",
    category: "تاريخ بحري",
    views: 87000,
    likes: 5800,
    tags: ["بحر", "تجارة", "ملاحة", "حضارة"],
  },
  {
    id: "5",
    title: "لغة الضاد",
    synopsis:
      "رحلة في تاريخ اللغة العربية وتطورها عبر العصور، من الشعر الجاهلي إلى الأدب المعاصر، وأثرها على الثقافة العالمية.",
    description:
      "استكشاف شامل لتاريخ اللغة العربية وتأثيرها الحضاري، يتتبع تطور الأدب والشعر العربي ودور اللغة في نقل المعرفة والعلوم. يسلط الضوء على إسهامات اللغة العربية في الحضارة الإنسانية.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "72:10",
    releaseDate: "2024-05-12",
    director: "عبد الرحمن الكاتب",
    category: "لغة وأدب",
    views: 203000,
    likes: 15500,
    tags: ["لغة", "أدب", "شعر", "خط"],
  },
  {
    id: "6",
    title: "المرأة في التاريخ العربي",
    synopsis:
      "قصص نساء عربيات تركن بصمة في التاريخ، من الملكات والشاعرات إلى العالمات والمحاربات، وإسهاماتهن في بناء الحضارة.",
    description:
      "وثائقي يحتفي بإنجازات المرأة العربية عبر التاريخ، يروي قصص شخصيات نسائية مؤثرة في مختلف المجالات. من زنوبيا ملكة تدمر إلى رابعة العدوية والخنساء، يستكشف دور المرأة في تشكيل الحضارة العربية.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "58:35",
    releaseDate: "2024-06-18",
    director: "نورا السالم",
    category: "تاريخ اجتماعي",
    views: 142000,
    likes: 11200,
    tags: ["مرأة", "تاريخ", "شخصيات", "إنجازات"],
  },
]

const featuredDocumentary = documentaries.find((doc) => doc.featured) || documentaries[0]

export default function ArDocumentaryPage() {
  const [selectedDocumentary, setSelectedDocumentary] = useState<Documentary | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const bannerVideoRef = useRef<HTMLVideoElement>(null)

  // Auto-play banner video on mount
  useEffect(() => {
    if (bannerVideoRef.current) {
      bannerVideoRef.current.play().catch(console.error)
    }
  }, [])

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

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir="rtl">
      {/* Hero Banner with Auto-Playing Video */}
      <section className="relative h-screen overflow-hidden">
        <video
          ref={bannerVideoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/placeholder-video.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center space-y-8 max-w-4xl px-6">
            <h1 className="text-6xl md:text-8xl font-bold font-ge-ss mb-6">زوايا الوثائقية</h1>
            <p className="text-xl md:text-2xl text-gray-200 font-ge-ss leading-relaxed max-w-3xl mx-auto">
              استكشف عالم الوثائقيات العربية المتميزة، حيث تلتقي القصص الحقيقية بالسرد المبدع لتقدم لك تجربة بصرية لا
              تُنسى
            </p>
            <div className="flex items-center justify-center space-x-6 space-x-reverse">
              <Button
                size="lg"
                className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white px-8 py-4 text-lg font-ge-ss"
                style={{ backgroundColor: colors.accent }}
              >
                <Play className="w-6 h-6 ml-2" />
                ابدأ المشاهدة
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-ge-ss bg-transparent"
              >
                تصفح المجموعة
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Documentary Section */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-zawaya-accent text-white mb-4 px-4 py-2 text-lg font-ge-ss">مميز هذا الشهر</Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-ge-ss mb-6">{featuredDocumentary.title}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-ge-ss leading-relaxed">
              {featuredDocumentary.synopsis}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative group cursor-pointer" onClick={() => setSelectedDocumentary(featuredDocumentary)}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={featuredDocumentary.thumbnail || "/placeholder.svg"}
                  alt={featuredDocumentary.title}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-20 h-20 transition-all duration-300 group-hover:scale-110"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-6 space-x-reverse text-gray-300">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Clock className="w-5 h-5" />
                  <span className="font-ge-ss">{featuredDocumentary.duration}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="w-5 h-5" />
                  <span className="font-ge-ss">{formatDate(featuredDocumentary.releaseDate)}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Eye className="w-5 h-5" />
                  <span className="font-ge-ss">{formatViews(featuredDocumentary.views)} مشاهدة</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2 font-ge-ss">المخرج</h3>
                  <p className="text-white font-ge-ss">{featuredDocumentary.director}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2 font-ge-ss">الفئة</h3>
                  <Badge className="bg-zawaya-primary text-white font-ge-ss">{featuredDocumentary.category}</Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {featuredDocumentary.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 font-ge-ss"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white w-full font-ge-ss"
                onClick={() => setSelectedDocumentary(featuredDocumentary)}
              >
                <Play className="w-5 h-5 ml-2" />
                شاهد الآن
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Documentary Grid */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-ge-ss mb-6">مجموعة الوثائقيات</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-ge-ss leading-relaxed">
              اكتشف مجموعة متنوعة من الوثائقيات العربية المتميزة التي تغطي مختلف جوانب التاريخ والثقافة والفكر العربي
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {documentaries.map((documentary) => (
              <Card
                key={documentary.id}
                className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedDocumentary(documentary)}
              >
                <div className="relative">
                  <img
                    src={documentary.thumbnail || "/placeholder.svg"}
                    alt={documentary.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-16 h-16">
                      <Play className="w-6 h-6 text-white" />
                    </Button>
                  </div>

                  {/* Duration Badge */}
                  <Badge className="absolute bottom-4 right-4 bg-black/70 text-white font-ge-ss">
                    {documentary.duration}
                  </Badge>

                  {/* Category Badge */}
                  <Badge className="absolute top-4 right-4 bg-zawaya-accent text-white font-ge-ss">
                    {documentary.category}
                  </Badge>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-zawaya-accent transition-colors font-ge-ss">
                    {documentary.title}
                  </h3>

                  <p className="text-gray-300 line-clamp-3 font-ge-ss leading-relaxed">{documentary.synopsis}</p>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Eye className="w-4 h-4" />
                        <span className="font-ge-ss">{formatViews(documentary.views)}</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Heart className="w-4 h-4" />
                        <span className="font-ge-ss">{formatViews(documentary.likes)}</span>
                      </div>
                    </div>
                    <span className="font-ge-ss">{formatDate(documentary.releaseDate)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-ge-ss">إخراج: {documentary.director}</span>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={!!selectedDocumentary} onOpenChange={() => setSelectedDocumentary(null)}>
        <DialogContent className="max-w-6xl w-full bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-ge-ss text-right">{selectedDocumentary?.title}</DialogTitle>
          </DialogHeader>

          {selectedDocumentary && (
            <div className="space-y-6">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-96 object-cover"
                  poster={selectedDocumentary.thumbnail}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                >
                  <source src={selectedDocumentary.videoUrl} type="video/mp4" />
                </video>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleMuteToggle}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                      <span className="text-white text-sm font-ge-ss">
                        {Math.floor(currentTime / 60)}:
                        {Math.floor(currentTime % 60)
                          .toString()
                          .padStart(2, "0")}{" "}
                        / {selectedDocumentary.duration}
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Documentary Info */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-ge-ss">نبذة عن الوثائقي</h3>
                  <p className="text-gray-300 font-ge-ss leading-relaxed">{selectedDocumentary.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {selectedDocumentary.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-gray-600 text-gray-300 font-ge-ss">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-ge-ss">تفاصيل الإنتاج</h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span className="font-ge-ss">المخرج:</span>
                      <span className="font-ge-ss">{selectedDocumentary.director}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-ge-ss">المدة:</span>
                      <span className="font-ge-ss">{selectedDocumentary.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-ge-ss">تاريخ الإصدار:</span>
                      <span className="font-ge-ss">{formatDate(selectedDocumentary.releaseDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-ge-ss">الفئة:</span>
                      <span className="font-ge-ss">{selectedDocumentary.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-ge-ss">المشاهدات:</span>
                      <span className="font-ge-ss">{formatViews(selectedDocumentary.views)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-ge-ss">الإعجابات:</span>
                      <span className="font-ge-ss">{formatViews(selectedDocumentary.likes)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3 space-x-reverse pt-4">
                    <Button
                      className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white flex-1 font-ge-ss"
                      style={{ backgroundColor: colors.accent }}
                    >
                      <Heart className="w-4 h-4 ml-2" />
                      أعجبني
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1 font-ge-ss bg-transparent"
                    >
                      <Share2 className="w-4 h-4 ml-2" />
                      مشاركة
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 font-ge-ss bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
