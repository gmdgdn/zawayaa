import Image from "next/image"
import Link from "next/link"
import { Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ArticleCardProps {
  id: string
  slug: string
  title: string
  summary: string
  imageUrl: string
  category: string
  author: {
    name: string
  }
  readTime: number
  publishedDate: string
  hasAudio?: boolean
  className?: string
}

// Category color mapping
const getCategoryStyles = (category: string) => {
  const categoryMap: Record<string, string> = {
    'آراء سياسية': 'category-politics',
    'تقدير موقف': 'category-analysis', 
    'ثقافة': 'category-culture',
    'تاريخ': 'category-history',
    'تقنية': 'category-tech',
    'فن': 'category-culture',
  }
  
  return categoryMap[category] || 'text-ink-600 border-ink-600'
}

export function ArticleCard({
  id,
  slug,
  title,
  summary,
  imageUrl,
  category,
  author,
  readTime,
  publishedDate,
  hasAudio = false,
  className = ""
}: ArticleCardProps) {
  return (
    <article className={cn(
      "bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group",
      className
    )}>
      {/* Image with Angular Mask */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-tl-2xl"
        />
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category and Audio Chips */}
        <div className="flex items-center gap-2 justify-between">
          <span className={cn(
            "px-3 py-1 rounded-full border text-sm font-semibold",
            getCategoryStyles(category)
          )}>
            {category}
          </span>
          
          {hasAudio && (
            <span className="px-3 py-1 rounded-full border text-brand-mint border-brand-mint text-sm font-medium">
              استمع للمقال
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-ink-900 font-bold text-xl leading-7 group-hover:text-brand-red transition-colors">
          <Link href={`/ar/articles/${slug}`} className="focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2 hover:underline decoration-2 underline-offset-4">
            {title}
          </Link>
        </h3>
        
        {/* Summary */}
        <p className="text-ink-600 text-sm leading-6 line-clamp-2">
          {summary}
        </p>
        
        {/* Meta */}
        <div className="flex items-center justify-between text-ink-600 text-sm pt-2 border-t border-stone-200">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readTime} دقائق</span>
          </div>
        </div>
      </div>
    </article>
  )
}