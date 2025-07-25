"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Play, 
  Eye, 
  BookOpen,
  Mic,
  Video,
  FileText,
  SlidersHorizontal,
  X
} from "lucide-react"

// Sample search data combining all content types
const searchData = {
  articles: [
    {
      id: "art-001",
      type: "مقال",
      title: "ذاكرة على تذكرة سفر: جدل استعادة آثار الشرق من متاحف الغرب",
      excerpt: "من حجر رشيد إلى منحوتات تدمر، تستضيف متاحف الغرب ذاكرة الشرق...",
      author: "د. ريم الخوري",
      category: "فن",
      published_date: "2025-07-20",
      read_time: 7,
      view_count: 4200,
      image_url: "/images/articles/restitution.png",
      audio_url: "/audio/art-001.mp3",
      tags: ["فن", "تراث", "ثقافة", "متاحف"]
    },
    {
      id: "sa-001",
      type: "تقدير موقف",
      title: "الخلافة الرقمية أم استئناف العقل؟ الذكاء الاصطناعي على مفترق طرق الحضارة العربية",
      excerpt: "يقف العالم العربي اليوم أمام الذكاء الاصطناعي كما وقفت بغداد يومًا أمام حكمة الإغريق والفرس...",
      author: "د. أمين رشدي",
      category: "تكنولوجيا",
      published_date: "2025-07-25",
      read_time: 8,
      view_count: 12500,
      image_url: "/images/hero/ai_crossroads_hero.png",
      audio_url: "/audio/sa-001.mp3",
      tags: ["ذكاء اصطناعي", "تكنولوجيا", "حضارة عربية", "مستقبل"]
    },
    {
      id: "op-001",
      type: "رأي سياسي",
      title: "مستقبل الشرق الأوسط في ظل التحولات الجيوسياسية",
      excerpt: "تحليل للتغيرات السياسية الإقليمية وتأثيرها على مستقبل المنطقة...",
      author: "د. أحمد الخطيب",
      category: "سياسة",
      published_date: "2025-07-14",
      read_time: 6,
      view_count: 8900,
      image_url: "/images/opinions/geopolitics.png",
      audio_url: "/audio/op-001.mp3",
      tags: ["جيوسياسة", "شرق أوسط", "سياسة", "تحليل"]
    }
  ],
  podcasts: [
    {
      id: "pod-001",
      type: "بودكاست",
      title: "الأدب العربي في العصر الرقمي",
      excerpt: "حوار مع الناقد الأدبي د. سامي العيسى حول تأثير التكنولوجيا على الأدب العربي المعاصر",
      author: "فريق زوايا",
      category: "أدب",
      published_date: "2025-07-22",
      duration: "45 دقيقة",
      view_count: 6700,
      image_url: "/images/podcasts/digital_literature.png",
      audio_url: "/audio/pod-001.mp3",
      tags: ["أدب", "تكنولوجيا", "نقد", "حوار"]
    }
  ],
  programs: [
    {
      id: "prog-001",
      type: "برنامج",
      title: "نافذة على العالم: اليابان بين التقليد والحداثة",
      excerpt: "رحلة استكشافية في الثقافة اليابانية المعاصرة وكيف تمكنت من الحفاظ على تراثها",
      author: "محمد الحكيم",
      category: "ثقافة",
      published_date: "2025-07-18",
      duration: "30 دقيقة",
      view_count: 9200,
      image_url: "/images/programs/japan_culture.png",
      video_url: "/videos/prog-001.mp4",
      tags: ["ثقافة", "اليابان", "تراث", "حداثة"]
    }
  ]
}

const contentTypes = [
  { id: "all", label: "الكل", icon: BookOpen },
  { id: "articles", label: "مقالات", icon: FileText },
  { id: "opinions", label: "آراء سياسية", icon: FileText },
  { id: "assessments", label: "تقدير موقف", icon: FileText },
  { id: "podcasts", label: "بودكاست", icon: Mic },
  { id: "programs", label: "برامج", icon: Video }
]

const categories = [
  "الكل", "سياسة", "اقتصاد", "ثقافة", "فن", "أدب", "تاريخ", "تكنولوجيا", "علوم"
]

const sortOptions = [
  { value: "relevance", label: "الأكثر صلة" },
  { value: "date", label: "الأحدث" },
  { value: "views", label: "الأكثر مشاهدة" },
  { value: "readTime", label: "وقت القراءة" }
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [selectedSort, setSelectedSort] = useState("relevance")
  const [showFilters, setShowFilters] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [])

  const performSearch = async (query: string) => {
    if (!query.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple search simulation
    const allContent = [
      ...searchData.articles,
      ...searchData.podcasts,
      ...searchData.programs
    ]

    let results = allContent.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())) ||
      item.author.toLowerCase().includes(query.toLowerCase())
    )

    // Apply type filter
    if (selectedType !== "all") {
      const typeMap: { [key: string]: string[] } = {
        "articles": ["مقال"],
        "opinions": ["رأي سياسي"],
        "assessments": ["تقدير موقف"],
        "podcasts": ["بودكاست"],
        "programs": ["برنامج"]
      }
      results = results.filter(item => typeMap[selectedType]?.includes(item.type))
    }

    // Apply category filter
    if (selectedCategory !== "الكل") {
      results = results.filter(item => item.category === selectedCategory)
    }

    // Apply sorting
    switch (selectedSort) {
      case "date":
        results.sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
        break
      case "views":
        results.sort((a, b) => b.view_count - a.view_count)
        break
      case "readTime":
        results.sort((a, b) => (a.read_time || 0) - (b.read_time || 0))
        break
    }

    setSearchResults(results)
    setIsLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  const clearFilters = () => {
    setSelectedType("all")
    setSelectedCategory("الكل")
    setSelectedSort("relevance")
    if (searchQuery) performSearch(searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 font-ge-ss text-center">
            البحث في زوايا
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="ابحث في المقالات، البودكاست، البرامج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 h-14 text-lg font-ge-ss"
              />
              <Button 
                type="submit" 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss"
                disabled={isLoading}
              >
                بحث
              </Button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="font-ge-ss"
            >
              <SlidersHorizontal className="w-4 h-4 ml-1" />
              فلاتر متقدمة
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="max-w-4xl mx-auto p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 font-ge-ss">فلاتر البحث</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="font-ge-ss text-gray-500"
              >
                <X className="w-4 h-4 ml-1" />
                مسح الفلاتر
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                  نوع المحتوى
                </label>
                <div className="space-y-2">
                  {contentTypes.map((type) => (
                    <label key={type.id} className="flex items-center">
                      <input
                        type="radio"
                        name="contentType"
                        value={type.id}
                        checked={selectedType === type.id}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="ml-2"
                      />
                      <type.icon className="w-4 h-4 ml-1 text-gray-400" />
                      <span className="text-sm font-ge-ss">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                  الفئة
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md font-ge-ss text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                  ترتيب النتائج
                </label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md font-ge-ss text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={() => performSearch(searchQuery)}
              className="mt-4 bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss"
              disabled={isLoading}
            >
              تطبيق الفلاتر
            </Button>
          </Card>
        )}

        {/* Search Results */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zawaya-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 font-ge-ss">جاري البحث...</p>
            </div>
          ) : hasSearched ? (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 font-ge-ss">
                  نتائج البحث {searchQuery && `عن "${searchQuery}"`}
                </h2>
                <p className="text-gray-600 font-ge-ss">
                  {searchResults.length} نتيجة
                </p>
              </div>

              {/* Results List */}
              {searchResults.length > 0 ? (
                <div className="space-y-6">
                  {searchResults.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-ge-ss">
                    لم نجد نتائج مطابقة
                  </h3>
                  <p className="text-gray-600 font-ge-ss mb-4">
                    جرب استخدام كلمات مختلفة أو تعديل الفلاتر
                  </p>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white font-ge-ss"
                  >
                    مسح الفلاتر
                  </Button>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-ge-ss">
                ابدأ البحث في زوايا
              </h3>
              <p className="text-gray-600 font-ge-ss max-w-md mx-auto">
                اكتشف المقالات والتحليلات والبودكاست والبرامج في جميع المجالات
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function SearchResultCard({ result }: { result: any }) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "بودكاست": return <Mic className="w-4 h-4" />
      case "برنامج": return <Video className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "بودكاست": return "bg-green-100 text-green-800"
      case "برنامج": return "bg-purple-100 text-purple-800"
      case "تقدير موقف": return "bg-blue-100 text-blue-800"
      case "رأي سياسي": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0">
          <img
            src={result.image_url}
            alt={result.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`text-xs ${getTypeColor(result.type)}`}>
              <span className="flex items-center gap-1">
                {getTypeIcon(result.type)}
                {result.type}
              </span>
            </Badge>
            <Badge variant="secondary" className="text-xs font-ge-ss">
              {result.category}
            </Badge>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 font-ge-ss line-clamp-2">
            <a href={`/ar/${result.type.toLowerCase()}/${result.id}`} className="hover:text-zawaya-primary">
              {result.title}
            </a>
          </h3>

          <p className="text-gray-600 text-sm font-ge-ss line-clamp-2 mb-3">
            {result.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="font-ge-ss">{result.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(result.published_date).toLocaleDateString('ar-SA')}</span>
            </div>
            {result.read_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{result.read_time} دقائق</span>
              </div>
            )}
            {result.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{result.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{result.view_count.toLocaleString('ar-SA')}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {result.tags.slice(0, 4).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs font-ge-ss">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss"
              asChild
            >
              <a href={`/ar/${result.type.toLowerCase()}/${result.id}`}>
                {result.type === "بودكاست" || result.type === "برنامج" ? "استمع/شاهد" : "اقرأ"}
              </a>
            </Button>
            
            {result.audio_url && (
              <Button variant="outline" size="sm" className="font-ge-ss">
                <Play className="w-3 h-3 ml-1" />
                تشغيل
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
} 