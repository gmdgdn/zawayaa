"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NavigationHeaderProps {
  currentPath?: string
}

export default function NavigationHeader({ currentPath = "/" }: NavigationHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: "/", label: "الرئيسية", key: "home" },
    { href: "/ar/articles", label: "المقالات", key: "articles" },
    { href: "/ar/podcast", label: "الإذاعة", key: "radio" },
    { href: "/ar/programs", label: "البرامج", key: "programs" },
    { href: "/ar/documentaries", label: "الوثائقيات", key: "documentaries" },
  ]

  const isActiveLink = (href: string) => {
    if (href === "/" && currentPath === "/") return true
    if (href !== "/" && currentPath?.startsWith(href)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 bg-clr-primary-dark text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Right side for RTL */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <div className="text-2xl font-bold font-eurostile">
                زوايا
              </div>
              <div className="text-sm font-light font-eurostile hidden sm:block">
                Zawaya
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`font-ge-ss font-medium transition-default hover:text-clr-accent ${
                  isActiveLink(item.href)
                    ? "text-clr-accent border-b-2 border-clr-accent pb-1"
                    : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Search and Mobile Menu */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Input
                    type="search"
                    placeholder="البحث..."
                    className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/70 font-ge-ss"
                    dir="rtl"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-white hover:text-clr-accent hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-white hover:text-clr-accent hover:bg-white/10"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-clr-accent hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-ge-ss font-medium transition-default hover:text-clr-accent px-4 py-2 rounded-lg ${
                    isActiveLink(item.href)
                      ? "text-clr-accent bg-white/10"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 