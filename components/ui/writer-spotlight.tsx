import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface WriterSpotlightProps {
  id: string
  slug: string
  name: string
  specialty: string
  avatarUrl: string
  articleCount: number
  latestArticles: Array<{
    title: string
    slug: string
  }>
  className?: string
}

export function WriterSpotlight({
  id,
  slug,
  name,
  specialty,
  avatarUrl,
  articleCount,
  latestArticles,
  className = ""
}: WriterSpotlightProps) {
  return (
    <article className={cn(
      "bg-white rounded-2xl border border-stone-200 shadow-sm p-5 transition-all duration-200 hover:shadow-lg group",
      className
    )}>
      {/* Author info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-ink-900 font-bold text-lg group-hover:text-brand-red transition-colors">
            <Link href={`/ar/writers/${slug}`} className="focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2">
              {name}
            </Link>
          </h3>
          <p className="text-ink-600 text-sm">{specialty}</p>
        </div>
      </div>
      
      {/* Latest articles */}
      <ul className="space-y-1 text-sm text-ink-700 list-disc pr-5 mb-4">
        {latestArticles.slice(0, 2).map((article, index) => (
          <li key={index}>
            <Link 
              href={`/ar/articles/${article.slug}`} 
              className="hover:underline hover:text-brand-red transition-colors"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-ink-600 text-sm">
        <span>+{articleCount} مقال</span>
        <Link 
          href={`/ar/writers/${slug}`} 
          className="text-brand-green font-semibold hover:underline hover:text-brand-red transition-colors"
        >
          اطّلع على الأعمال
        </Link>
      </div>
    </article>
  )
}