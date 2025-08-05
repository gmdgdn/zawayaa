"use client"

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ReadingProgressProps {
  className?: string
  color?: string
}

export function ReadingProgress({ 
  className = "", 
  color = "bg-accent" 
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress() // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 h-1", className)}>
      <div 
        className={cn("h-full transition-all duration-150 ease-out", color)}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}