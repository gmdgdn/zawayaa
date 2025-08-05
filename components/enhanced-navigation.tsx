"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X, ChevronDown, Home, FileText, Headphones, Video, Camera, Users, Mail, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface NavigationItem {
  href: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  key: string
  children?: NavigationItem[]
}

interface EnhancedNavigationProps {
  currentPath?: string
}

export default function EnhancedNavigation({ currentPath = "/" }: EnhancedNavigationProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems: NavigationItem[] = [
    { 
      href: "/ar", 
      label: "الرئيسية", 
      icon: Home,
      key: "home" 
    },
    {
      href: "/ar/articles",
      label: "المحتوى المكتوب",
      icon: FileText,
      key: "written",
      children: [
        { href: "/ar/articles", label: "جميع المقالات", key: "all-articles" },
        { href: "/ar/opinions", label: "آراء سياسية", key: "opinions" },
        { href: "/ar/assessment", label: "تقدير موقف", key: "assessment" },
      ]
    },
    {
      href: "/ar/podcast",
      label: "المحتوى الصوتي",
      icon: Headphones,
      key: "audio",
      children: [
        { href: "/ar/podcast", label: "جميع البودكاستات", key: "all-podcasts" },
        { href: "/ar/podcast", label: "شمال جنوب", key: "north-south" },
        { href: "/ar/podcast", label: "عبق التاريخ", key: "history-scent" },
      ]
    },
    {
      href: "/ar/programs",
      label: "المحتوى المرئي", 
      icon: Video,
      key: "video",
      children: [
        { href: "/ar/programs", label: "جميع البرامج", key: "all-programs" },
        { href: "/ar/documentaries", label: "زوايا الوثائقية", key: "documentaries" },
        { href: "/ar/programs", label: "حضارة الشرق", key: "east-civilization" },
      ]
    },
    {
      href: "/ar/about",
      label: "المنصة",
      icon: Users,
      key: "platform",
      children: [
        { href: "/ar/about", label: "من نحن", key: "about" },
        { href: "/ar/writers", label: "منبر الكُتّاب", key: "writers" },
        { href: "/ar/contact", label: "تواصل معنا", key: "contact" },
        { href: "/ar/search", label: "البحث", key: "search" },
      ]
    }
  ]

  const isActiveLink = (href: string) => {
    if (href === "/" && currentPath === "/") return true
    if (href !== "/" && currentPath?.startsWith(href)) return true
    return false
  }

  const hasActiveChild = (item: NavigationItem) => {
    if (!item.children) return false
    return item.children.some(child => isActiveLink(child.href))
  }

  return (
    <header className="sticky top-0 z-50 bg-clr-primary-dark text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Right side for RTL */}
          <div className="flex items-center">
            <Link href="/ar" className="flex items-center space-x-3 space-x-reverse group">
              <div className="w-10 h-10 bg-clr-accent rounded-lg flex items-center justify-center group-hover:bg-clr-accent/90 transition-default">
                <span className="text-white font-bold text-xl font-eurostile">ز</span>
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-bold font-eurostile">
                  زوايا
                </div>
                <div className="text-xs font-light font-eurostile hidden sm:block text-gray-300">
                  القصة من كل زواياها
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
            {navigationItems.map((item) => {
              const isActive = isActiveLink(item.href) || hasActiveChild(item)
              
              if (item.children) {
                return (
                  <DropdownMenu key={item.key}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className={`font-ge-ss font-medium transition-default hover:text-clr-accent hover:bg-white/10 px-4 py-2 h-auto flex items-center space-x-1 space-x-reverse ${
                          isActive ? "text-clr-accent bg-white/10" : "text-white"
                        }`}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56 bg-white text-gray-900">
                      <DropdownMenuLabel className="font-ge-ss font-bold">{item.label}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.key} asChild>
                          <Link 
                            href={child.href}
                            className={`font-ge-ss cursor-pointer w-full ${
                              isActiveLink(child.href) ? "bg-clr-accent/10 text-clr-accent" : ""
                            }`}
                          >
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`font-ge-ss font-medium transition-default hover:text-clr-accent hover:bg-white/10 px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse ${
                    isActive ? "text-clr-accent bg-white/10" : "text-white"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              )
            })}
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
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <div key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-ge-ss font-medium transition-default hover:text-clr-accent px-4 py-3 rounded-lg flex items-center space-x-2 space-x-reverse ${
                      isActiveLink(item.href) || hasActiveChild(item)
                        ? "text-clr-accent bg-white/10"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.label}</span>
                  </Link>
                  
                  {/* Mobile Submenu */}
                  {item.children && (hasActiveChild(item) || isActiveLink(item.href)) && (
                    <div className="mr-8 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`font-ge-ss text-sm transition-default block px-4 py-2 rounded-lg ${
                            isActiveLink(child.href)
                              ? "text-clr-accent bg-white/10"
                              : "text-gray-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Language Switch */}
              <div className="border-t border-white/20 pt-4 mt-4">
                <Button
                  variant="ghost"
                  className="text-white hover:text-clr-accent w-full justify-start px-4 py-3 font-ge-ss"
                >
                  <Globe className="w-5 h-5 ml-2" />
                  Switch to English
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 