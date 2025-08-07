import * as React from "react"
import Head from "next/head"
import { Header } from "@/components/organisms/Header"
import { Footer } from "@/components/organisms/Footer"
import { RTLProvider } from "@/components/providers/RTLProvider"
import { StickyMediaPlayer } from "@/components/StickyMediaPlayer"
import { cn } from "@/lib/utils"

interface SEOProps {
  title: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'video' | 'audio'
  structuredData?: object
}

interface DefaultLayoutProps {
  children: React.ReactNode
  seo: SEOProps
  locale?: 'ar' | 'en'
  className?: string
  showHeader?: boolean
  showFooter?: boolean
  showStickyPlayer?: boolean
}

export function DefaultLayout({
  children,
  seo,
  locale = 'ar',
  className,
  showHeader = true,
  showFooter = true,
  showStickyPlayer = true,
}: DefaultLayoutProps) {
  const [currentLocale, setCurrentLocale] = React.useState(locale)
  
  const handleLocaleChange = (newLocale: 'ar' | 'en') => {
    setCurrentLocale(newLocale)
    // In a real app, this would trigger router.push to change the URL
    // For now, we'll just update the state
  }

  const isRTL = currentLocale === 'ar'

  return (
    <>
      {/* SEO Head */}
      <Head>
        <title>{seo.title}</title>
        {seo.description && <meta name="description" content={seo.description} />}
        {seo.keywords && <meta name="keywords" content={seo.keywords.join(', ')} />}
        {seo.canonical && <link rel="canonical" href={seo.canonical} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={seo.title} />
        {seo.description && <meta property="og:description" content={seo.description} />}
        <meta property="og:type" content={seo.ogType || 'website'} />
        {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
        <meta property="og:locale" content={isRTL ? 'ar_SA' : 'en_US'} />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        {seo.description && <meta name="twitter:description" content={seo.description} />}
        {seo.ogImage && <meta name="twitter:image" content={seo.ogImage} />}
        
        {/* Viewport and mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F172A" />
        
        {/* Fonts preload */}
        <link
          rel="preload"
          href="/fonts/IBMPlexSansArabic-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/IBMPlexSans-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Structured Data */}
        {seo.structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(seo.structuredData)
            }}
          />
        )}
      </Head>

      <RTLProvider locale={currentLocale}>
        <div className={cn("flex flex-col min-h-screen", className)}>
          {/* Header */}
          {showHeader && (
            <Header 
              locale={currentLocale} 
              onLocaleChange={handleLocaleChange}
            />
          )}

          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-site mx-auto">
              {children}
            </div>
          </main>

          {/* Footer */}
          {showFooter && (
            <Footer locale={currentLocale} />
          )}

          {/* Sticky Media Player */}
          {showStickyPlayer && (
            <StickyMediaPlayer />
          )}
        </div>
      </RTLProvider>
    </>
  )
}

// Specialized layout variants
export function ArticleLayout(props: DefaultLayoutProps) {
  return (
    <DefaultLayout 
      {...props}
      seo={{
        ...props.seo,
        ogType: 'article',
      }}
    />
  )
}

export function ProgramLayout(props: DefaultLayoutProps) {
  return (
    <DefaultLayout 
      {...props}
      seo={{
        ...props.seo,
        ogType: 'website',
      }}
    />
  )
}

export function EpisodeLayout(props: DefaultLayoutProps) {
  return (
    <DefaultLayout 
      {...props}
      seo={{
        ...props.seo,
        ogType: 'audio',
      }}
    />
  )
}
