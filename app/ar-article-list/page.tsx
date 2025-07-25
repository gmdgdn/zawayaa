"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { colors } from "@/lib/theme"

interface Author {
  id: string
  name: string
  avatar?: string
}

interface Category {
  id: string
  name_ar: string
  name_en: string
  slug: string
}

interface Article {
  id: string
  title: string
  excerpt: string
  author: Author
  category: Category
  publishedAt: string
  readingTime: number
  coverImage?: string
  slug: string
  featured?: boolean
}

interface ArticleListPageProps {
  initialArticles?: Article[]
  initialCategories?: Category[]
}

// Mock data - in real app this would come from props or API
const mockCategories: Category[] = [
  { id: "1", name_ar: "فن", name_en: "Art", slug: "art" },
  { id: "2", name_ar: "أدب", name_en: "Literature", slug: "literature" },
  { id: "3", name_ar: "ثقافة", name_en: "Culture", slug: "culture" },
  { id: "4", name_ar: "تاريخ", name_en: "History", slug: "history" },
  { id: "5", name_ar: "سياسة", name_en: "Politics", slug: "politics" },
  { id: "6", name_ar: "اقتصاد", name_en: "Economy", slug: "economy" },
  { id: "7", name_ar: "تكنولوجيا", name_en: "Technology", slug: "technology" },
  { id: "8", name_ar: "مجتمع", name_en: "Society", slug: "society" },
]

const mockArticles: Article[] = [
  {
    id: "1",
    title: "النهضة الفنية في العالم العربي المعاصر",
    excerpt:
      "استكشاف للحركة الفنية المعاصرة في المنطقة العربية وتأثيرها على الهوية الثقافية. نتناول في هذا المقال أبرز الفنانين والمدارس الفنية التي شكلت المشهد الفني العربي الحديث.",
    author: { id: "1", name: "د. سارة أحمد", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[0], // فن
    publishedAt: "2025-01-15T10:00:00Z",
    readingTime: 8,
    coverImage: "/placeholder.svg?height=300&width=400",
    slug: "arab-art-renaissance",
    featured: true,
  },
  {
    id: "2",
    title: "الأدب العربي في عصر الرقمنة",
    excerpt: "كيف غيرت التكنولوجيا الرقمية من طبيعة الكتابة والنشر في الأدب العربي المعاصر.",
    author: { id: "2", name: "محمد الكاتب", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[1], // أدب
    publishedAt: "2025-01-14T15:30:00Z",
    readingTime: 6,
    coverImage: "/placeholder.svg?height=250&width=400",
    slug: "digital-arabic-literature",
  },
  {
    id: "3",
    title: "التراث الثقافي العربي في مواجهة العولمة",
    excerpt:
      "تحليل لتأثير العولمة على التراث الثقافي العربي والجهود المبذولة للحفاظ عليه. نناقش التحديات والفرص التي تواجه الثقافة العربية في عالم متصل.",
    author: { id: "3", name: "فاطمة حسن", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[2], // ثقافة
    publishedAt: "2025-01-13T12:00:00Z",
    readingTime: 10,
    coverImage: "/placeholder.svg?height=350&width=400",
    slug: "arab-heritage-globalization",
  },
  {
    id: "4",
    title: "الحضارة الإسلامية في الأندلس: دروس للحاضر",
    excerpt: "نظرة على الإنجازات الحضارية في الأندلس وما يمكن تعلمه منها اليوم.",
    author: { id: "4", name: "د. أحمد التاريخي", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[3], // تاريخ
    publishedAt: "2025-01-12T09:15:00Z",
    readingTime: 12,
    coverImage: "/placeholder.svg?height=280&width=400",
    slug: "andalusia-civilization",
  },
  {
    id: "5",
    title: "التحولات السياسية في المنطقة العربية",
    excerpt: "تحليل للتغيرات السياسية الحديثة وتأثيرها على مستقبل المنطقة.",
    author: { id: "5", name: "عمر السياسي", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[4], // سياسة
    publishedAt: "2025-01-11T16:45:00Z",
    readingTime: 7,
    coverImage: "/placeholder.svg?height=320&width=400",
    slug: "arab-political-transformations",
  },
  {
    id: "6",
    title: "الاقتصاد الرقمي في دول الخليج",
    excerpt: "استكشاف للتطورات في الاقتصاد الرقمي ودوره في تنويع الاقتصادات الخليجية.",
    author: { id: "6", name: "ليلى الاقتصادية", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[5], // اقتصاد
    publishedAt: "2025-01-10T14:20:00Z",
    readingTime: 9,
    coverImage: "/placeholder.svg?height=290&width=400",
    slug: "gulf-digital-economy",
  },
  {
    id: "7",
    title: "الذكاء الاصطناعي والمجتمع العربي",
    excerpt: "تأثير تقنيات الذكاء الاصطناعي على المجتمعات العربية والتحديات المصاحبة لها.",
    author: { id: "7", name: "د. نور التقني", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[6], // تكنولوجيا
    publishedAt: "2025-01-09T11:30:00Z",
    readingTime: 11,
    coverImage: "/placeholder.svg?height=310&width=400",
    slug: "ai-arab-society",
  },
  {
    id: "8",
    title: "التغيرات الاجتماعية في المدن العربية",
    excerpt: "دراسة للتحولات الاجتماعية في المدن العربية الكبرى وتأثيرها على نمط الحياة.",
    author: { id: "8", name: "حسام الاجتماعي", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[7], // مجتمع
    publishedAt: "2025-01-08T13:15:00Z",
    readingTime: 8,
    coverImage: "/placeholder.svg?height=270&width=400",
    slug: "arab-cities-social-changes",
  },
  {
    id: "9",
    title: "الموسيقى العربية المعاصرة: بين الأصالة والحداثة",
    excerpt: "تحليل للموسيقى العربية المعاصرة وكيف تمكنت من الموازنة بين التراث والتجديد.",
    author: { id: "9", name: "مريم الموسيقية", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[0], // فن
    publishedAt: "2025-01-07T10:45:00Z",
    readingTime: 6,
    coverImage: "/placeholder.svg?height=260&width=400",
    slug: "contemporary-arab-music",
  },
  {
    id: "10",
    title: "الشعر العربي الحديث: أصوات جديدة",
    excerpt: "استعراض لأبرز الأصوات الشعرية الجديدة في الأدب العربي المعاصر.",
    author: { id: "10", name: "يوسف الشاعر", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[1], // أدب
    publishedAt: "2025-01-06T15:20:00Z",
    readingTime: 5,
    coverImage: "/placeholder.svg?height=240&width=400",
    slug: "modern-arab-poetry",
  },
  {
    id: "11",
    title: "المهرجانات الثقافية العربية: منصات للتبادل الحضاري",
    excerpt: "دور المهرجانات الثقافية في تعزيز التبادل الثقافي بين الدول العربية والعالم.",
    author: { id: "11", name: "رانيا الثقافية", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[2], // ثقافة
    publishedAt: "2025-01-05T12:30:00Z",
    readingTime: 7,
    coverImage: "/placeholder.svg?height=330&width=400",
    slug: "arab-cultural-festivals",
  },
  {
    id: "12",
    title: "العمارة الإسلامية: إرث حضاري خالد",
    excerpt: "رحلة عبر تاريخ العمارة الإسلامية وتأثيرها على العمارة المعاصرة.",
    author: { id: "12", name: "د. خالد المعماري", avatar: "/placeholder.svg?height=40&width=40" },
    category: mockCategories[3], // تاريخ
    publishedAt: "2025-01-04T09:00:00Z",
    readingTime: 13,
    coverImage: "/placeholder.svg?height=300&width=400",
    slug: "islamic-architecture",
  },
]

export default function ArticleListPage({
  initialArticles = mockArticles,
  initialCategories = mockCategories,
}: ArticleListPageProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [categories] = useState<Category[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const articlesPerPage = 9

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    let filtered = articles

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category.slug === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.author.name.toLowerCase().includes(query) ||
          article.category.name_ar.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [articles, selectedCategory, searchQuery])

  // Paginate articles
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage
    return filteredArticles.slice(startIndex, startIndex + articlesPerPage)
  }, [filteredArticles, currentPage, articlesPerPage])

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  const formatDate = (dateString: string) => {
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

  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-zawaya-primary mb-2 font-ge-ss">المقالات</h1>
              <p className="text-gray-600 font-ge-ss">اكتشف مجموعة متنوعة من المقالات والتحليلات في مختلف المجالات</p>
            </div>

            {/* Search Box */}
            <div className="relative lg:w-80">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="البحث في المقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 font-ge-ss text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-500 font-ge-ss">
            {filteredArticles.length} مقال
            {selectedCategory !== "all" && (
              <span> في فئة "{categories.find((cat) => cat.slug === selectedCategory)?.name_ar}"</span>
            )}
            {searchQuery && <span> تحتوي على "{searchQuery}"</span>}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => handleCategoryFilter("all")}
              className={`rounded-full font-ge-ss ${
                selectedCategory === "all"
                  ? "bg-zawaya-accent text-white hover:bg-zawaya-accent/90"
                  : "border-gray-300 text-gray-700 hover:border-zawaya-accent hover:text-zawaya-accent bg-transparent"
              }`}
              style={
                selectedCategory === "all"
                  ? { backgroundColor: colors.accent }
                  : {
                      borderColor: "#d1d5db",
                      color: "#374151",
                    }
              }
            >
              الكل
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                onClick={() => handleCategoryFilter(category.slug)}
                className={`rounded-full font-ge-ss ${
                  selectedCategory === category.slug
                    ? "bg-zawaya-accent text-white hover:bg-zawaya-accent/90"
                    : "border-gray-300 text-gray-700 hover:border-zawaya-accent hover:text-zawaya-accent bg-transparent"
                }`}
                style={
                  selectedCategory === category.slug
                    ? { backgroundColor: colors.accent }
                    : {
                        borderColor: "#d1d5db",
                        color: "#374151",
                      }
                }
              >
                {category.name_ar}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid - Masonry Layout */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {paginatedArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                formatDate={formatDate}
                getInitials={getInitials}
                priority={index < 3} // Prioritize first 3 images for loading
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2 font-ge-ss">لا توجد مقالات</h3>
            <p className="text-gray-500 font-ge-ss">
              {searchQuery || selectedCategory !== "all"
                ? "لم نجد مقالات تطابق معايير البحث المحددة"
                : "لم يتم نشر أي مقالات بعد"}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className="mt-4 bg-zawaya-accent hover:bg-zawaya-accent/90 text-white font-ge-ss"
                style={{ backgroundColor: colors.accent }}
              >
                مسح الفلاتر
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </Button>

              <div className="flex items-center space-x-1 space-x-reverse">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  const isCurrentPage = page === currentPage
                  const showPage =
                    page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)

                  if (!showPage) {
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <Button
                      key={page}
                      variant={isCurrentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 p-0 ${
                        isCurrentPage
                          ? "bg-zawaya-accent text-white hover:bg-zawaya-accent/90"
                          : "bg-transparent hover:bg-gray-50"
                      }`}
                      style={isCurrentPage ? { backgroundColor: colors.accent } : {}}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-transparent"
              >
                التالي
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Article Card Component
interface ArticleCardProps {
  article: Article
  formatDate: (date: string) => string
  getInitials: (name: string) => string
  priority?: boolean
}

function ArticleCard({ article, formatDate, getInitials, priority = false }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white">
      {/* Cover Image */}
      <div className="relative overflow-hidden">
        <div
          className="h-48 bg-gradient-to-br from-zawaya-menthol to-zawaya-yellow group-hover:scale-105 transition-transform duration-300"
          style={{
            backgroundImage: article.coverImage ? `url(${article.coverImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!article.coverImage && (
            <div className="flex items-center justify-center h-full text-white/70 text-4xl">📄</div>
          )}
        </div>

        {/* Featured Badge */}
        {article.featured && (
          <Badge
            className="absolute top-3 right-3 bg-zawaya-accent text-white font-ge-ss"
            style={{ backgroundColor: colors.accent }}
          >
            مميز
          </Badge>
        )}

        {/* Category Badge */}
        <Badge variant="secondary" className="absolute bottom-3 right-3 bg-white/90 text-zawaya-primary font-ge-ss">
          {article.category.name_ar}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-zawaya-accent transition-colors font-ge-ss text-lg leading-relaxed">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 line-clamp-3 font-ge-ss text-sm leading-relaxed">{article.excerpt}</p>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs bg-zawaya-primary text-white font-ge-ss">
                {getInitials(article.author.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 font-ge-ss">{article.author.name}</span>
              <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span className="font-ge-ss">{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </div>

          {/* Reading Time */}
          <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span className="font-ge-ss">{article.readingTime} دقائق</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
