"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const navigation = {
  ar: [
    { name: "الرئيسية", href: "/" },
    { name: "آراء سياسية", href: "/opinions" },
    { name: "تقييم الوضع", href: "/assessment" },
    { name: "بودكاست", href: "/podcast" },
    { name: "وثائقيات", href: "/documentaries" },
    { name: "من نحن", href: "/about" },
  ],
  en: [
    { name: "Home", href: "/" },
    { name: "Political Opinions", href: "/opinions" },
    { name: "Situation Assessment", href: "/assessment" },
    { name: "Podcast", href: "/podcast" },
    { name: "Documentaries", href: "/documentaries" },
    { name: "About Us", href: "/about" },
  ],
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, direction, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar")
  }

  const currentNav = navigation[language]
  const slogan = "القصة من كل زواياها"

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/20 supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo - positioned based on direction */}
        <div className={`flex ${direction === "rtl" ? "order-3 lg:order-1" : "order-1"}`}>
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Zawaya</span>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-zawaya-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ز</span>
              </div>
              <div className="flex flex-col">
                <span className="font-eurostile font-bold text-zawaya-primary text-xl">Zawaya</span>
                <span className="font-ge-ss text-xs text-gray-600">{slogan}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className={`flex lg:hidden ${direction === "rtl" ? "order-1" : "order-3"}`}>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation - centered */}
        <div className="hidden lg:flex lg:gap-x-8 order-2">
          {currentNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium leading-6 text-gray-900 hover:text-zawaya-accent transition-colors ${
                language === "ar" ? "font-ge-ss" : "font-eurostile"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Language toggle */}
        <div className={`hidden lg:flex ${direction === "rtl" ? "order-1" : "order-3"}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center space-x-1 space-x-reverse"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm">{language === "ar" ? "EN" : "عر"}</span>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div
            className={`fixed inset-y-0 ${direction === "rtl" ? "left-0" : "right-0"} z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10`}
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Zawaya</span>
                <div className="w-8 h-8 bg-zawaya-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ز</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {currentNav.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 ${
                        language === "ar" ? "font-ge-ss" : "font-eurostile"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Button
                    variant="outline"
                    onClick={toggleLanguage}
                    className="flex items-center space-x-2 space-x-reverse w-full bg-transparent"
                  >
                    <Globe className="h-4 w-4" />
                    <span>{language === "ar" ? "English" : "العربية"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
