"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface HeroAssessmentData {
  id: string
  content_type: "article"
  category_ar: string
  title_ar: string
  author: string
  published_date: string
  image_url: string
  summary_ar: string
}

interface HeroAssessmentProps {
  data: HeroAssessmentData
}

export default function HeroAssessment({ data }: HeroAssessmentProps) {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.image_url})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-2xl">
          {/* Category Tag */}
          <Badge 
            className="mb-6 bg-clr-accent text-white px-4 py-2 text-sm font-ge-ss badge"
          >
            {data.category_ar}
          </Badge>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-6 font-ge-ss leading-display text-balance">
            {data.title_ar}
          </h1>
          
          {/* Author Byline */}
          <p className="text-lg text-white/90 mb-6 font-ge-ss">
            بقلم: {data.author}
          </p>
          
          {/* Summary */}
          <p className="text-base text-white/80 mb-8 font-ge-ss leading-reading max-w-reading prose-arabic">
            {data.summary_ar}
          </p>
          
          {/* Call to Action */}
          <Link href={`/ar/assessment/${data.id}`}>
            <Button 
              size="lg"
              className="btn-accent px-8 py-4 text-lg font-ge-ss transition-default"
            >
              اقرأ التحليل الكامل
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 