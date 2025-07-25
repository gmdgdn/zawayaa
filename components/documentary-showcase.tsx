"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface ShowcaseItem {
  id: string
  program_ar: string
  description_ar: string
  image_url: string
  cta_link: string
}

interface DocumentaryShowcaseProps {
  data: ShowcaseItem[]
}

export default function DocumentaryShowcase({ data }: DocumentaryShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="relative bg-clr-primary-dark text-white py-20 pattern-overlay">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-geometric-pattern opacity-5"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Current Slide */}
          <div className="relative overflow-hidden rounded-lg">
            <ShowcaseSlide item={data[currentIndex]} />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-3 transition-default backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-3 transition-default backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-default ${
                  index === currentIndex
                    ? "bg-clr-accent scale-125"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface ShowcaseSlideProps {
  item: ShowcaseItem
}

function ShowcaseSlide({ item }: ShowcaseSlideProps) {
  return (
    <div className="relative">
      {/* Background Image */}
      <div 
        className="h-96 md:h-[500px] bg-cover bg-center bg-gradient-to-r from-clr-primary-dark to-clr-iris"
        style={{ backgroundImage: `url(${item.image_url})` }}
      >
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              {/* Program Title */}
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-6 font-ge-ss leading-display text-balance">
                {item.program_ar}
              </h2>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-white/90 mb-8 font-ge-ss leading-reading prose-arabic">
                {item.description_ar}
              </p>
              
              {/* CTA Button */}
              <Link href={item.cta_link}>
                <Button 
                  size="lg"
                  className="btn-accent px-8 py-4 text-lg font-ge-ss border-2 border-clr-accent hover:border-white transition-default"
                >
                  شاهد الآن
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 