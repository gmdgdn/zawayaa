import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import EnhancedNavigation from "@/components/enhanced-navigation"
import EnhancedFooter from "@/components/enhanced-footer"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/language-context"
import { StickyMediaProvider } from "@/context/StickyMediaContext"
import { StickyMediaPlayer } from "@/components/StickyMediaPlayer"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "زوايا | Zawaya - القصة من كل زواياها",
  description: "منصة معرفية غير ربحية، ثنائية اللغة، تربط الواقع العربي بالتحولات العالمية عبر تحليلات رصينة متعددة الاختصاصات.",
  keywords: "زوايا، تحليل سياسي، ثقافة عربية، بودكاست، مقالات، آراء سياسية",
  authors: [{ name: "Zawaya Platform" }],
  openGraph: {
    title: "زوايا | Zawaya - القصة من كل زواياها",
    description: "منصة معرفية غير ربحية، ثنائية اللغة، تربط الواقع العربي بالتحولات العالمية",
    url: "https://zawaya.org",
    siteName: "Zawaya",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "زوايا | Zawaya",
    description: "القصة من كل زواياها",
  },
  robots: "index, follow",
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} font-ge-ss antialiased`} suppressHydrationWarning>
        <StickyMediaProvider>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <div className="min-h-screen flex flex-col bg-white">
                <EnhancedNavigation />
                <main className="flex-1">
                  {children}
                </main>
                <EnhancedFooter />
              </div>
              <StickyMediaPlayer />
            </ThemeProvider>
          </LanguageProvider>
        </StickyMediaProvider>
      </body>
    </html>
  )
}
