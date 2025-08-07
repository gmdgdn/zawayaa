"use client"

import * as React from "react"
import { IBM_Plex_Sans_Arabic, IBM_Plex_Sans } from 'next/font/google'
import { cn } from "@/lib/utils"

// Font configurations
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-latin',
  display: 'swap',
})

interface RTLProviderProps {
  children: React.ReactNode
  locale: 'ar' | 'en'
  className?: string
}

export function RTLProvider({ children, locale, className }: RTLProviderProps) {
  const isRTL = locale === 'ar'
  
  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        // Font variables
        ibmPlexArabic.variable,
        ibmPlexSans.variable,
        // Default font family based on locale
        isRTL ? 'font-arabic' : 'font-latin',
        // Base styling
        "min-h-screen bg-neutral-50 text-primary-900",
        className
      )}
    >
      {children}
    </div>
  )
}

// Hook to get current locale context
export function useRTL() {
  const [locale, setLocale] = React.useState<'ar' | 'en'>('ar')
  
  const toggleLocale = React.useCallback(() => {
    setLocale(prev => prev === 'ar' ? 'en' : 'ar')
  }, [])
  
  return {
    locale,
    setLocale,
    toggleLocale,
    isRTL: locale === 'ar',
  }
}
