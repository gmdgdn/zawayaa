"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "ar" | "en"
type Direction = "rtl" | "ltr"

interface LanguageContextType {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar")
  const direction: Direction = language === "ar" ? "rtl" : "ltr"

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("zawaya-language", lang)
    document.documentElement.lang = lang
    document.documentElement.dir = direction
  }

  useEffect(() => {
    const savedLang = localStorage.getItem("zawaya-language") as Language
    if (savedLang && ["ar", "en"].includes(savedLang)) {
      setLanguageState(savedLang)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
  }, [language, direction])

  return <LanguageContext.Provider value={{ language, direction, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
