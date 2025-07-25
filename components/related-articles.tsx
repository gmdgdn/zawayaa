"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock } from "lucide-react"

interface Author {
  id: string
  name: string
  avatar?: string
}

interface Category {
  id: string
  name_ar: string
  slug: string
}

interface RelatedArticle {
  id: string
  title: string
  excerpt: string
  author: Author
  category: Category
  publishedAt: string
  readingTime: number
  coverImage?: string
  slug: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
  currentArticleId: string
  className?: string
}

export default function RelatedArticles({ articles, currentArticleId, className = "" }: RelatedArticlesProps) {
  const relatedArticles = articles.filter((article) => article.id !== currentArticleId).slice(0, 4)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
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

  if (relatedArticles.length === 0) {
    return null
  }

  return (
    <Card className={`p-6 bg-white shadow-sm border border-gray-200 ${className}`} dir="rtl">
      <h3 className="text-lg font-semibold text-zawaya-primary mb-6 font-ge-ss">مقالات ذات صلة</h3>

      <div className="space-y-6">
        {relatedArticles.map((article) => (
          <div key={article.id} className="group cursor-pointer">
            <div className="flex space-x-4 space-x-reverse">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <div
                  className="w-20 h-16 rounded-lg bg-gradient-to-br from-zawaya-menthol to-zawaya-yellow group-hover:scale-105 transition-transform duration-200"
                  style={{
                    backgroundImage: article.coverImage ? `url(${article.coverImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!article.coverImage && (
                    <div className="flex items-center justify-center h-full text-white/70 text-lg">📄</div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-zawaya-accent transition-colors font-ge-ss text-sm leading-relaxed mb-2">
                  {article.title}
                </h4>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs bg-zawaya-primary text-white font-ge-ss">
                        {getInitials(article.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-ge-ss">{article.author.name}</span>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Calendar className="w-3 h-3" />
                      <span className="font-ge-ss">{formatDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Clock className="w-3 h-3" />
                      <span className="font-ge-ss">{article.readingTime}د</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="text-zawaya-accent hover:text-zawaya-accent/80 font-medium text-sm font-ge-ss transition-colors">
          عرض المزيد من المقالات ←
        </button>
      </div>
    </Card>
  )
}
