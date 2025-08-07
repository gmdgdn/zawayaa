"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Menu, Globe, X } from "lucide-react"
import { Button } from "@/components/atoms/Button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  locale: 'ar' | 'en'
  onLocaleChange: (locale: 'ar' | 'en') => void
}

const navigation = [
  { name: 'الرئيسية', nameEn: 'Home', href: '/', hrefEn: '/en' },
  { name: 'المقالات', nameEn: 'Articles', href: '/articles', hrefEn: '/en/articles' },
  { name: 'البرامج', nameEn: 'Programs', href: '/programs', hrefEn: '/en/programs' },
  { name: 'البودكاست', nameEn: 'Podcast', href: '/podcast', hrefEn: '/en/podcast' },
  { name: 'الوثائقيات', nameEn: 'Documentaries', href: '/documentaries', hrefEn: '/en/documentaries' },
  { name: 'تقدير موقف', nameEn: 'Analysis', href: '/taqdeer-mawqef', hrefEn: '/en/taqdeer-mawqef' },
]

export function Header({ locale, onLocaleChange }: HeaderProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  const isRTL = locale === 'ar'

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  const getNavHref = (item: typeof navigation[0]) => {
    return isRTL ? item.href : item.hrefEn
  }

  const getNavName = (item: typeof navigation[0]) => {
    return isRTL ? item.name : item.nameEn
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-site mx-auto px-lg">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={isRTL ? "/" : "/en"} className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-600 to-accent-300 rounded-lg flex items-center justify-center">
                <span className="text-neutral-50 font-bold text-lg">ز</span>
              </div>
              <span className="text-2 font-bold text-primary-900">زوايا</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navigation.map((item) => {
              const href = getNavHref(item)
              const isActive = pathname === href || pathname.startsWith(href + '/')
              
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "text-0 font-medium transition-colors hover:text-accent-600 relative",
                    isActive ? "text-accent-600" : "text-primary-700"
                  )}
                >
                  {getNavName(item)}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-4 left-0 right-0 h-0.5 bg-accent-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 140, damping: 18 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="relative"
            >
              <Search className="w-5 h-5" />
              <span className="sr-only">بحث</span>
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLocaleChange(locale === 'ar' ? 'en' : 'ar')}
              className="hidden sm:flex items-center gap-xs"
            >
              <Globe className="w-4 h-4" />
              <span>{locale === 'ar' ? 'EN' : 'ع'}</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
              <span className="sr-only">القائمة</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-neutral-50 py-4"
          >
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-700" />
              <input
                type="text"
                placeholder={isRTL ? "ابحث في زوايا..." : "Search Zawaya..."}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 border border-neutral-50 rounded-2xl bg-neutral-50 text-primary-900 placeholder-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent"
                autoFocus
              />
            </div>
          </motion.div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-50 py-4"
          >
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => {
                const href = getNavHref(item)
                const isActive = pathname === href || pathname.startsWith(href + '/')
                
                return (
                  <Link
                    key={item.href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "text-0 font-medium transition-colors hover:text-accent-600 py-2",
                      isActive ? "text-accent-600" : "text-primary-700"
                    )}
                  >
                    {getNavName(item)}
                  </Link>
                )
              })}
              
              {/* Mobile Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLocaleChange(locale === 'ar' ? 'en' : 'ar')}
                className="justify-start gap-xs mt-4 pt-4 border-t border-neutral-50"
              >
                <Globe className="w-4 h-4" />
                <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
