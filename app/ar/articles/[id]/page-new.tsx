import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight, Heart, Share2, Headphones } from "lucide-react"
import { getArticleBySlug, getArticles } from "@/lib/wordpress-content-helpers"
import type { NormalizedWPPost } from "@/lib/wordpress"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

interface ArticlePageProps {
  params: {
    id: string
  }
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  // Fetch the article by slug
  let article: NormalizedWPPost | null = null
  let relatedArticles: NormalizedWPPost[] = []

  try {
    // Try to get article by slug (id parameter is actually the slug)
    article = await getArticleBySlug(params.id)
    
    if (!article) {
      notFound()
    }

    // Get related articles from the same category
    if (article.categories.length > 0) {
      const allArticles = await getArticles({ 
        category: article.categories[0], 
        per_page: 5 
      })
      relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 3)
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
    notFound()
  }

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Article Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/ar" className="hover:text-gray-900">الرئيسية</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/ar/articles" className="hover:text-gray-900">المقالات</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900">{article.category?.name || 'مقال'}</span>
          </nav>

          {/* Article Meta */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge 
                variant="secondary" 
                className="text-white"
                style={{ backgroundColor: article.zawaya_meta.category_color || '#6366f1' }}
              >
                {article.category?.name || 'مقال'}
              </Badge>
              {article.zawaya_meta.is_featured && (
                <Badge variant="outline">مميز</Badge>
              )}
              {article.zawaya_meta.is_breaking_news && (
                <Badge variant="destructive">عاجل</Badge>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-ge-ss leading-tight">
              {article.title_ar || article.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt_ar || article.excerpt}
            </p>

            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{article.author.name_ar || article.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(article.date).toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{article.read_time_minutes || article.zawaya_meta.reading_time_minutes || 5} دقائق قراءة</span>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          {(article.audio_url || article.zawaya_meta.audio_narration_url) && (
            <div className="mb-8">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">استمع للمقال</h3>
                    <p className="text-sm text-gray-600">
                      مدة التسجيل: {article.zawaya_meta.audio_duration || 5} دقائق
                    </p>
                  </div>
                  <Button>
                    <Headphones className="w-4 h-4 ml-2" />
                    تشغيل
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {article.featured_image_url && (
            <div className="mb-8">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={article.featured_image_url}
                  alt={article.title_ar || article.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg max-w-none prose-headings:font-ge-ss prose-headings:text-gray-900">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: article.content_ar || article.content 
              }} 
            />
          </div>

          {/* Article Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 ml-2" />
                  أعجبني
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 ml-2" />
                  مشاركة
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                آخر تحديث: {new Date(article.modified).toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-ge-ss">
                    {article.author.name_ar || article.author.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {article.zawaya_meta.author_bio_arabic || 'كاتب ومحلل في منصة زوايا'}
                  </p>
                  <Button variant="outline" size="sm">
                    عرض المزيد من المقالات
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss">مقالات ذات صلة</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 relative">
                      <Image
                        src={relatedArticle.featured_image_url || '/images/placeholder-article.jpg'}
                        alt={relatedArticle.title_ar || relatedArticle.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <Badge 
                        variant="secondary" 
                        className="text-white text-xs mb-2"
                        style={{ backgroundColor: relatedArticle.zawaya_meta.category_color || '#6366f1' }}
                      >
                        {relatedArticle.category?.name || 'مقال'}
                      </Badge>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        <Link 
                          href={`/ar/articles/${relatedArticle.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {relatedArticle.title_ar || relatedArticle.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedArticle.excerpt_ar || relatedArticle.excerpt}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const articles = await getArticles({ per_page: 50 })
    return articles.map((article) => ({
      id: article.slug,
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}