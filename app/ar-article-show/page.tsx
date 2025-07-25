"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AudioPlayer from "@/components/audio-player"
import RelatedArticles from "@/components/related-articles"
import ShareButtons from "@/components/share-buttons"
import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react"
import { colors } from "@/lib/theme"

interface Author {
  id: string
  name: string
  bio: string
  avatar?: string
  slug: string
}

interface Category {
  id: string
  name_ar: string
  name_en: string
  slug: string
}

interface Article {
  id: string
  title_ar: string
  title_en: string
  excerpt_ar: string
  excerpt_en: string
  content: string // MDX content
  author: Author
  category: Category
  publishedAt: string
  readingTime: number
  coverImage?: string
  audioUrl?: string
  slug: string
  tags: string[]
  featured?: boolean
}

// Sample MDX content
const sampleMDXContent = `
# تحولات التقنية وصراع النفوذ العالمي

في عالم يتسارع فيه التطور التقنولوجي بوتيرة مذهلة، تشهد الساحة الدولية **صراعاً جديداً للنفوذ** يختلف جذرياً عن الصراعات التقليدية. لم تعد القوة العسكرية أو الاقتصادية وحدها كافية لتحديد موازين القوى العالمية، بل أصبحت **التكنولوجيا المتقدمة** هي المحرك الأساسي للهيمنة والتأثير.

## الذكاء الاصطناعي: ساحة المعركة الجديدة

يمثل الذكاء الاصطناعي اليوم ما مثلته الطاقة النووية في القرن العشرين - **سلاحاً استراتيجياً** يمكنه تغيير موازين القوى بشكل جذري. الدول التي تتقدم في هذا المجال تحصل على مزايا تنافسية هائلة في:

- **الاقتصاد**: من خلال أتمتة العمليات وتحسين الكفاءة
- **الدفاع**: عبر تطوير أنظمة دفاعية ذكية
- **المعلومات**: بواسطة تحليل البيانات الضخمة

> "من يتحكم في الذكاء الاصطناعي، يتحكم في المستقبل" - هذه ليست مجرد مقولة، بل حقيقة استراتيجية تدركها القوى العظمى جيداً.

## الصين والولايات المتحدة: سباق التقنية

تتصدر **الصين والولايات المتحدة** هذا السباق التقني، حيث تستثمر كل منهما مليارات الدولارات في البحث والتطوير. الصين تركز على:

1. **تطوير الشبكات الذكية** للمدن
2. **أنظمة المراقبة المتقدمة**
3. **التجارة الإلكترونية والدفع الرقمي**

بينما تركز الولايات المتحدة على:

1. **الابتكار في وادي السيليكون**
2. **التطبيقات العسكرية للذكاء الاصطناعي**
3. **الحوسبة الكمية**

## التأثير على العالم العربي

لا يمكن للعالم العربي أن يقف مكتوف الأيدي أمام هذه التحولات. الدول العربية بحاجة إلى:

### استراتيجية شاملة للتحول الرقمي

- **الاستثمار في التعليم التقني**
- **تطوير البنية التحتية الرقمية**
- **جذب الاستثمارات التقنية**

### الشراكات الاستراتيجية

من المهم أن تبني الدول العربية شراكات متوازنة مع القوى التقنية العالمية، دون الانحياز الكامل لطرف واحد.

## خلاصة

إن **التحول التقني** ليس مجرد تطور طبيعي، بل هو **ثورة حقيقية** تعيد تشكيل النظام العالمي. الدول والمجتمعات التي تفشل في مواكبة هذا التحول ستجد نفسها على هامش التاريخ.

المطلوب اليوم هو **رؤية استراتيجية واضحة** وإرادة سياسية قوية للاستثمار في المستقبل التقني، مع الحفاظ على القيم الإنسانية والثقافية التي تميز كل مجتمع.
`

// Mock data
const mockArticle: Article = {
  id: "1",
  title_ar: "تحولات التقنية وصراع النفوذ العالمي",
  title_en: "Technology Transformations and Global Power Struggle",
  excerpt_ar:
    "في عالم يتسارع فيه التطور التقني، تشهد الساحة الدولية صراعاً جديداً للنفوذ يختلف جذرياً عن الصراعات التقليدية. لم تعد القوة العسكرية وحدها كافية لتحديد موازين القوى العالمية.",
  excerpt_en:
    "In a world where technological development is accelerating, the international arena is witnessing a new struggle for influence that differs radically from traditional conflicts.",
  content: sampleMDXContent,
  author: {
    id: "1",
    name: "د. أحمد التقني",
    bio: "خبير في التكنولوجيا والسياسة الدولية، حاصل على دكتوراه في العلوم السياسية من جامعة هارفارد",
    avatar: "/placeholder.svg?height=80&width=80",
    slug: "ahmed-tech",
  },
  category: {
    id: "1",
    name_ar: "تكنولوجيا",
    name_en: "Technology",
    slug: "technology",
  },
  publishedAt: "2025-01-15T10:00:00Z",
  readingTime: 12,
  coverImage: "/placeholder.svg?height=400&width=800",
  audioUrl: "/sample-audio.mp3",
  slug: "tech-transformations-global-power",
  tags: ["تكنولوجيا", "ذكاء اصطناعي", "سياسة دولية", "الصين", "أمريكا", "العالم العربي"],
  featured: true,
}

const mockRelatedArticles = [
  {
    id: "2",
    title: "مستقبل الذكاء الاصطناعي في العالم العربي",
    excerpt: "نظرة على التطورات المتوقعة في مجال الذكاء الاصطناعي",
    author: { id: "2", name: "سارة الذكية", avatar: "/placeholder.svg?height=32&width=32" },
    category: { id: "1", name_ar: "تكنولوجيا", slug: "technology" },
    publishedAt: "2025-01-14T15:30:00Z",
    readingTime: 8,
    coverImage: "/placeholder.svg?height=200&width=300",
    slug: "ai-future-arab-world",
  },
  {
    id: "3",
    title: "الأمن السيبراني في عصر الرقمنة",
    excerpt: "التحديات والحلول في مجال الأمن السيبراني",
    author: { id: "3", name: "محمد الأمني", avatar: "/placeholder.svg?height=32&width=32" },
    category: { id: "1", name_ar: "تكنولوجيا", slug: "technology" },
    publishedAt: "2025-01-13T12:00:00Z",
    readingTime: 10,
    coverImage: "/placeholder.svg?height=200&width=300",
    slug: "cybersecurity-digital-age",
  },
  {
    id: "4",
    title: "التجارة الإلكترونية والاقتصاد الرقمي",
    excerpt: "كيف غيرت التجارة الإلكترونية من طبيعة الاقتصاد العالمي",
    author: { id: "4", name: "فاطمة التجارية", avatar: "/placeholder.svg?height=32&width=32" },
    category: { id: "2", name_ar: "اقتصاد", slug: "economy" },
    publishedAt: "2025-01-12T09:15:00Z",
    readingTime: 7,
    coverImage: "/placeholder.svg?height=200&width=300",
    slug: "ecommerce-digital-economy",
  },
]

export default function ArticleShowPage() {
  const [article] = useState<Article>(mockArticle)
  const [relatedArticles] = useState(mockRelatedArticles)

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

  // Simple MDX-like content renderer
  const renderContent = (content: string) => {
    return content
      .split("\n")
      .map((line, index) => {
        // Headers
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xl font-semibold text-zawaya-iris mt-8 mb-4 font-ge-ss">
              {line.replace("### ", "")}
            </h3>
          )
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-2xl font-semibold text-zawaya-primary mt-10 mb-6 font-ge-ss">
              {line.replace("## ", "")}
            </h2>
          )
        }
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-3xl font-bold text-zawaya-primary mt-8 mb-6 font-ge-ss">
              {line.replace("# ", "")}
            </h1>
          )
        }

        // Blockquotes
        if (line.startsWith("> ")) {
          return (
            <blockquote
              key={index}
              className="border-r-4 border-zawaya-accent bg-gray-50 p-4 my-6 italic text-gray-700 font-ge-ss"
            >
              {line.replace("> ", "")}
            </blockquote>
          )
        }

        // Lists
        if (line.match(/^\d+\. /)) {
          return (
            <li key={index} className="mb-2 font-ge-ss text-gray-700 leading-relaxed">
              {line.replace(/^\d+\. /, "")}
            </li>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="mb-2 font-ge-ss text-gray-700 leading-relaxed">
              {line.replace("- ", "")}
            </li>
          )
        }

        // Regular paragraphs
        if (line.trim() && !line.startsWith("#") && !line.startsWith(">") && !line.match(/^[\d-]/)) {
          // Handle bold text
          const processedLine = line
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-zawaya-primary">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

          return (
            <p
              key={index}
              className="mb-6 font-ge-ss text-gray-700 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: processedLine }}
            />
          )
        }

        return null
      })
      .filter(Boolean)
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Hero Image */}
              {article.coverImage && (
                <div className="relative h-80 lg:h-96">
                  <div
                    className="w-full h-full bg-gradient-to-br from-zawaya-primary to-zawaya-iris"
                    style={{
                      backgroundImage: `url(${article.coverImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {article.featured && (
                      <Badge
                        className="absolute top-4 right-4 bg-zawaya-accent text-white font-ge-ss"
                        style={{ backgroundColor: colors.accent }}
                      >
                        مميز
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Article Header */}
              <div className="p-8 lg:p-12">
                {/* Category Overline */}
                <div className="mb-4">
                  <Badge
                    variant="outline"
                    className="border-zawaya-accent text-zawaya-accent font-ge-ss bg-transparent"
                    style={{ borderColor: colors.accent, color: colors.accent }}
                  >
                    {article.category.name_ar}
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-ge-ss leading-tight">
                  {article.title_ar}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-zawaya-primary text-white font-ge-ss">
                        {getInitials(article.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <User className="w-4 h-4 text-gray-500" />
                        <button className="font-semibold text-zawaya-primary hover:text-zawaya-accent transition-colors font-ge-ss">
                          {article.author.name}
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Calendar className="w-4 h-4" />
                          <span className="font-ge-ss">{formatDate(article.publishedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Clock className="w-4 h-4" />
                          <span className="font-ge-ss">{article.readingTime} دقائق قراءة</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Share Buttons - Desktop */}
                  <div className="hidden lg:block">
                    <ShareButtons title={article.title_ar} url={currentUrl} />
                  </div>
                </div>

                {/* Audio Player */}
                {article.audioUrl && (
                  <div className="mb-8">
                    <AudioPlayer src={article.audioUrl} title="استمع للمقال" />
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-4">{renderContent(article.content)}</div>
                </div>

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center space-x-3 space-x-reverse mb-6">
                    <Tag className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700 font-ge-ss">الكلمات المفتاحية:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 text-gray-700 hover:bg-zawaya-menthol hover:text-zawaya-primary transition-colors cursor-pointer font-ge-ss"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Share Buttons - Mobile */}
                <div className="lg:hidden mt-8 pt-6 border-t border-gray-200">
                  <ShareButtons title={article.title_ar} url={currentUrl} />
                </div>

                {/* Author Bio */}
                <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-zawaya-primary text-white font-ge-ss text-lg">
                        {getInitials(article.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 font-ge-ss">{article.author.name}</h4>
                      <p className="text-gray-600 font-ge-ss leading-relaxed">{article.author.bio}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 bg-transparent border-zawaya-accent text-zawaya-accent hover:bg-zawaya-accent hover:text-white font-ge-ss"
                      >
                        عرض المزيد من المقالات
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <RelatedArticles articles={relatedArticles} currentArticleId={article.id} />

              {/* Newsletter Signup */}
              <Card className="p-6 bg-gradient-to-br from-zawaya-primary to-zawaya-iris text-white">
                <h3 className="font-semibold mb-3 font-ge-ss">اشترك في النشرة البريدية</h3>
                <p className="text-sm mb-4 text-white/90 font-ge-ss">
                  احصل على أحدث المقالات والتحليلات مباشرة في بريدك الإلكتروني
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    className="w-full px-3 py-2 rounded-lg text-gray-900 font-ge-ss text-right"
                    dir="rtl"
                  />
                  <Button className="w-full bg-zawaya-accent hover:bg-zawaya-accent/90 text-white font-ge-ss">
                    اشترك الآن
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
