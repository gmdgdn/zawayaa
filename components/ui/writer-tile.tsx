import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WriterTileProps {
  id: string
  slug: string
  name: string
  specialty: string
  avatarUrl: string
  articleCount?: number
  className?: string
}

export function WriterTile({
  id,
  slug,
  name,
  specialty,
  avatarUrl,
  articleCount,
  className = ""
}: WriterTileProps) {
  return (
    <article className={cn(
      "bg-white rounded-2xl border border-stone-200 shadow-sm p-6 text-center transition-all duration-200 hover:shadow-lg group",
      className
    )}>
      {/* Avatar */}
      <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
        <Image
          src={avatarUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Name */}
      <h3 className="text-ink-900 font-bold text-lg mb-2 group-hover:text-brand-red transition-colors">
        <Link href={`/ar/writers/${slug}`} className="focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2">
          {name}
        </Link>
      </h3>
      
      {/* Specialty */}
      <p className="text-ink-600 text-sm mb-4">
        {specialty}
      </p>
      
      {/* Article Count */}
      {articleCount && (
        <p className="text-ink-600 text-xs mb-4">
          {articleCount} مقال
        </p>
      )}
      
      {/* CTA */}
      <Button 
        asChild 
        variant="outline" 
        size="sm"
        className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white font-medium"
      >
        <Link href={`/ar/writers/${slug}`}>
          اطلع على الأعمال
        </Link>
      </Button>
    </article>
  )
}