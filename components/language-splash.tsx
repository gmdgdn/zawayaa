"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export default function LanguageSplash() {
  const [showSplash, setShowSplash] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("LanguageSplash")

  useEffect(() => {
    const langPreference = localStorage.getItem("zawaya-lang")
    if (!langPreference) {
      setShowSplash(true)
    }
  }, [])

  const handleLanguageSelect = (locale: "en" | "ar") => {
    localStorage.setItem("zawaya-lang", locale)
    setShowSplash(false)

    // Redirect to the selected locale's homepage
    const newPath = `/${locale}`
    if (pathname !== newPath) {
      router.push(newPath)
    }
  }

  if (!showSplash) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zawaya-primary-dark">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-2 font-eurostile">Zawaya</h1>
        <h2 className="text-2xl font-light mb-8 font-ge-ss">{t("chooseLanguage")}</h2>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => handleLanguageSelect("en")}
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-zawaya-primary-dark px-8 py-6 text-lg"
          >
            {t("english")}
          </Button>
          <Button
            onClick={() => handleLanguageSelect("ar")}
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-zawaya-primary-dark px-8 py-6 text-lg font-ge-ss"
          >
            {t("arabic")}
          </Button>
        </div>
      </div>
    </div>
  )
}
