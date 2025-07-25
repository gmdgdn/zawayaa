"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Link, Check } from "lucide-react"

interface ShareButtonsProps {
  title: string
  url: string
  className?: string
}

export default function ShareButtons({ title, url, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400,scrollbars=yes,resizable=yes")
  }

  return (
    <div className={`flex items-center space-x-3 space-x-reverse ${className}`} dir="rtl">
      <span className="text-sm font-medium text-gray-700 font-ge-ss">شارك المقال:</span>

      <div className="flex items-center space-x-2 space-x-reverse">
        {/* Facebook */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => openShareWindow(shareData.facebook)}
          className="bg-transparent hover:bg-blue-50 border-blue-200 text-blue-600 hover:border-blue-300"
        >
          <Facebook className="w-4 h-4" />
        </Button>

        {/* Twitter */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => openShareWindow(shareData.twitter)}
          className="bg-transparent hover:bg-sky-50 border-sky-200 text-sky-600 hover:border-sky-300"
        >
          <Twitter className="w-4 h-4" />
        </Button>

        {/* LinkedIn */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => openShareWindow(shareData.linkedin)}
          className="bg-transparent hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300"
        >
          <Linkedin className="w-4 h-4" />
        </Button>

        {/* Copy Link */}
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className={`bg-transparent transition-all duration-200 ${
            copied
              ? "border-green-200 text-green-600 hover:border-green-300"
              : "border-gray-200 text-gray-600 hover:border-zawaya-accent hover:text-zawaya-accent"
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
        </Button>
      </div>

      {copied && <span className="text-sm text-green-600 font-ge-ss">تم النسخ!</span>}
    </div>
  )
}
