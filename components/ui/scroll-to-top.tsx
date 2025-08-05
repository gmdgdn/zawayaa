"use client"

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover-lift transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      )}
      aria-label="العودة إلى الأعلى"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  )
}