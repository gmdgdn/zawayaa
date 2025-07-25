"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const navigation = {
  ar: [
    { name: "الرئيسية", href: "/ar" },
    { name: "آراء سياسية", href: "/ar/opinions" },
    { name: "تقدير موقف", href: "/ar/assessment" },
    { name: "مقالات", href: "/ar/articles" },
    { name: "بودكاست", href: "/ar/podcast" },
    { name: "البرامج", href: "/ar/programs" },
    { name: "منبر الكُتّاب", href: "/ar/writers" },
    { name: "بحث", href: "/ar/search" },
    { name: "من نحن", href: "/ar/about" },
    { name: "تواصل معنا", href: "/ar/contact" },
  ],
  en: [
    { name: "Home", href: "/en" },
    { name: "Opinions", href: "/en/opinions" },
    { name: "Documentaries", href: "/en/documentaries" },
    { name: "Writers", href: "/en/writers" },
    { name: "Search", href: "/en/search" },
    { name: "About Us", href: "/en/about" },
    { name: "Contact", href: "/en/contact" },
  ],
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, direction, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar"
    setLanguage(newLang)
    // Redirect to corresponding language section
    if (newLang === "en") {
      window.location.href = "/en"
    } else {
      window.location.href = "/ar"
    }
  }

  const currentNav = navigation[language]
  const slogan = language === "ar" ? "القصة من كل زواياها" : "The Story from Every Angle"
  const logoText = language === "ar" ? "ز" : "Z"

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/20 supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo - positioned based on direction */}
        <div className={`flex ${direction === "rtl" ? "order-3 lg:order-1" : "order-1"}`}>
          <Link href={language === "ar" ? "/ar" : "/en"} className="-m-1.5 p-1.5">
            <span className="sr-only">Zawaya</span>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 bg-zawaya-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">{logoText}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-eurostile font-bold text-zawaya-primary text-xl">
                  {language === "ar" ? "زوايا" : "Zawaya"}
                </span>
                <span className={`text-xs text-gray-600 ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
                  {slogan}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className={`flex lg:hidden ${direction === "rtl" ? "order-1" : "order-3"}`}>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:text-zawaya-primary"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation - centered */}
        <div className="hidden lg:flex lg:gap-x-6 order-2">
          {currentNav.slice(0, 6).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium leading-6 text-gray-900 hover:text-zawaya-primary transition-colors ${
                language === "ar" ? "font-ge-ss" : "font-eurostile"
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {/* More Menu for Additional Items */}
          {currentNav.length > 6 && (
            <div className="relative group">
              <button className={`text-sm font-medium leading-6 text-gray-900 hover:text-zawaya-primary transition-colors ${
                language === "ar" ? "font-ge-ss" : "font-eurostile"
              }`}>
                {language === "ar" ? "المزيد" : "More"}
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {currentNav.slice(6).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 hover:text-zawaya-primary ${
                      language === "ar" ? "font-ge-ss" : "font-eurostile"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language toggle */}
        <div className={`hidden lg:flex ${direction === "rtl" ? "order-1" : "order-3"}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center space-x-1 space-x-reverse hover:text-zawaya-primary"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">
              {language === "ar" ? "EN" : "عر"}
            </span>
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
              <Link href={language === "ar" ? "/ar" : "/en"} className="-m-1.5 p-1.5">
                <span className="sr-only">Zawaya</span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-8 h-8 bg-zawaya-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{logoText}</span>
                  </div>
                  <span className="font-eurostile font-bold text-zawaya-primary text-lg">
                    {language === "ar" ? "زوايا" : "Zawaya"}
                  </span>
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
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-zawaya-primary ${
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
                    className={`flex items-center space-x-2 space-x-reverse w-full bg-transparent border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white ${
                      language === "ar" ? "font-ge-ss" : "font-eurostile"
                    }`}
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
