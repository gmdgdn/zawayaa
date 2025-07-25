"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import NewsletterModal from "./newsletter-modal"
import { useLanguage } from "@/lib/language-context"

interface NewsletterTriggerProps {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export default function NewsletterTrigger({
  variant = "default",
  size = "default",
  className = "",
  children,
}: NewsletterTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { language } = useLanguage()

  const defaultText = {
    ar: "اشترك في النشرة",
    en: "Subscribe to Newsletter",
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        className={`${className} ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
      >
        {children || (
          <>
            <Mail className="w-4 h-4 mr-2 ml-2" />
            {defaultText[language]}
          </>
        )}
      </Button>

      <NewsletterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
