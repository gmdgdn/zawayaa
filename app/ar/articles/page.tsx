import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, BookOpen, Palette, Globe, History, Volume2 } from "lucide-react"
import { fetchArticlesWithSCF, fetchFeaturedArticlesWithSCF } from "@/lib/article-scf-integration"
import { getCategories } from "@/lib/wordpress-content-helpers"
import Link from "next/link"
import Image from "next/image"

const categoryIcons: { [key: string]: any } = {
  "فن": Palette,
  "أدب": BookOpen,
  "ثقافة": Globe,
  "تاريخ": History,
  "سياسة": Globe,
  "اقتصاد": BookOpen,
  "تكنولوجيا": Palette
}

export default async function ArticlesPage() {
  // Fetch articles with complete SCF mapping
  let articlesResult: Awaited<ReturnType<typeof fetchArticlesWithSCF>>
  let featuredResult: Awaited<ReturnType<typeof fetchFeaturedArticlesWithSCF>>
  let categories: any[] = []

  try {
    const [allArticles, featured, cats] = await Promise.all([
      fetchArticlesWithSCF({ perPage: 20 }),
      fetchFeaturedArticlesWithSCF(3),
      getCategories(10)
    ])
    
    articlesResult = allArticles
    featuredResult = featured
    categories = cats
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    // Fallback data
    articlesResult = {
      articles: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0, hasNext: false, hasPrev: false },
      cacheTags: ['articles']
    }
    featuredResult = { articles: [], cacheTags: ['featured-articles'] }
  }

  // Process the data
  const featuredArticle = featuredResult.articles[0]
  const regularArticles = articlesResult.articles.filter(article => article.id !== featuredArticle?.id)

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-ge-ss">مقالات</h1>
          <p className="text-lg text-gray-600 font-ge-ss max-w-4xl">
            مقالات متنوعة في كل ما يخص الأدب، والثقافة، والتاريخ الإنساني العالمي - جميع المقالات متوفرة بالصوت
          </p>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss">المقال المميز</h2>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="aspect-video md:aspect-square bg-gray-200 relative">
                    <Image 
                      src={featuredArticle.image || '/images/placeholder-article.jpg'} 
                      alt={featuredArticle.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge 
                      variant="secondary" 
                      className="text-white"
                      style={{ backgroundColor: featuredArticle.categoryColor || '#6366f1' }}
                    >
                      مقال مميز
                    </Badge>
                    {featuredArticle.featured && (
                      <Badge variant="outline">مميز</Badge>
                    )}
                    {featuredArticle.audioUrl && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        صوتي
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-ge-ss line-clamp-2">
                    <Link 
                      href={featuredArticle.href}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {featuredArticle.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{featuredArticle.author.name}</span>
                    </div>
                    {featuredArticle.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredArticle.readTime} دقائق</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                  
                  <Button asChild>
                    <Link href={featuredArticle.href}>
                      اقرأ المقال
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-ge-ss">تصفح حسب الفئة</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                الكل
              </Button>
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.name] || BookOpen
                return (
                  <Button key={category.id} variant="outline" size="sm" className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {category.name}
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss">جميع المقالات</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <Image 
                    src={article.image || '/images/placeholder-article.jpg'} 
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant="secondary" 
                      className="text-white text-xs"
                      style={{ backgroundColor: article.categoryColor || '#6366f1' }}
                    >
                      مقال
                    </Badge>
                    {article.featured && (
                      <Badge variant="outline" className="text-xs">مميز</Badge>
                    )}
                    {article.audioUrl && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        صوتي
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-ge-ss line-clamp-2">
                    <Link 
                      href={article.href}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{article.author.name}</span>
                    </div>
                    {article.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime} د</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {articlesResult.pagination.totalPages > 1 && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm text-gray-600">
                صفحة {articlesResult.pagination.currentPage} من {articlesResult.pagination.totalPages}
              </span>
            </div>
            {articlesResult.pagination.hasNext && (
              <Button variant="outline" size="lg">
                تحميل المزيد من المقالات
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}