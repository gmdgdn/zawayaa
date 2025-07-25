"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LanguageSplash() {
  const [showSplash, setShowSplash] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const langPreference = localStorage.getItem("zawaya-language")
    if (!langPreference) {
      setShowSplash(true)
    } else {
      // Redirect to preferred language
      if (langPreference === "en") {
        router.push("/en")
      } else {
        router.push("/ar")
      }
    }
  }, [router])

  const handleLanguageSelect = (locale: "en" | "ar") => {
    localStorage.setItem("zawaya-language", locale)
    setShowSplash(false)

    // Redirect to the selected language section
    if (locale === "en") {
      router.push("/en")
    } else {
      router.push("/ar")
    }
  }

  if (!showSplash) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zawaya-primary">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 font-eurostile">زوايا</h1>
        <h2 className="text-3xl font-light mb-2 font-eurostile">Zawaya</h2>
        <p className="text-xl mb-8 font-ge-ss">القصة من كل زواياها</p>
        <h3 className="text-2xl font-light mb-8 font-eurostile">Choose your language</h3>
        <div className="flex justify-center gap-6">
          <Button
            onClick={() => handleLanguageSelect("ar")}
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-zawaya-primary px-8 py-6 text-lg font-ge-ss"
          >
            العربية
          </Button>
          <Button
            onClick={() => handleLanguageSelect("en")}
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-zawaya-primary px-8 py-6 text-lg font-eurostile"
          >
            English
          </Button>
        </div>
      </div>
    </div>
  )
}
