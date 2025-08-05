"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Link, Check, MessageCircle, Send, Mail } from "lucide-react"
import { socialService, type SocialShareData } from "@/lib/social-service"

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
  imageUrl?: string
  category?: string
  contentId?: string
  contentType?: 'article' | 'program' | 'podcast'
  className?: string
  showLabels?: boolean
  variant?: 'default' | 'compact' | 'full'
}

export default function ShareButtons({ 
  title, 
  url, 
  description,
  imageUrl,
  category,
  contentId,
  contentType = 'article',
  className = "",
  showLabels = false,
  variant = 'default'
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareData: SocialShareData = {
    title,
    url,
    description,
    imageUrl,
    hashtags: category ? socialService.getSuggestedHashtags(category, 'ar') : undefined,
    via: 'ZawayaPlatform',
    language: 'ar'
  }

  const handleShare = async (platform: string) => {
    // Track sharing analytics
    if (contentId) {
      await socialService.trackShare(platform, contentId, contentType)
    }

    if (platform === 'copy') {
      const success = await socialService.copyToClipboard(url)
      if (success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
      return
    }

    socialService.openShareDialog(platform, shareData)
  }

  const platforms = [
    {
      name: 'whatsapp',
      icon: MessageCircle,
      label: 'واتساب',
      color: 'hover:bg-green-50 border-green-200 text-green-600 hover:border-green-300',
      popular: true
    },
    {
      name: 'twitter',
      icon: Twitter,
      label: 'تويتر',
      color: 'hover:bg-sky-50 border-sky-200 text-sky-600 hover:border-sky-300',
      popular: true
    },
    {
      name: 'facebook',
      icon: Facebook,
      label: 'فيسبوك',
      color: 'hover:bg-blue-50 border-blue-200 text-blue-600 hover:border-blue-300',
      popular: true
    },
    {
      name: 'telegram',
      icon: Send,
      label: 'تيليجرام',
      color: 'hover:bg-blue-50 border-blue-200 text-blue-500 hover:border-blue-300',
      popular: true
    },
    {
      name: 'linkedin',
      icon: Linkedin,
      label: 'لينكد إن',
      color: 'hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300',
      popular: false
    },
    {
      name: 'email',
      icon: Mail,
      label: 'بريد إلكتروني',
      color: 'hover:bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300',
      popular: false
    }
  ]

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 space-x-reverse ${className}`} dir="rtl">
        {platforms.filter(p => p.popular).slice(0, 3).map((platform) => {
          const IconComponent = platform.icon
          return (
            <Button
              key={platform.name}
              variant="outline"
              size="sm"
              onClick={() => handleShare(platform.name)}
              className={`bg-transparent ${platform.color} p-2`}
              title={`مشاركة عبر ${platform.label}`}
            >
              <IconComponent className="w-4 h-4" />
            </Button>
          )
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('copy')}
          className="bg-transparent hover:bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 p-2"
          title="نسخ الرابط"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link className="w-4 h-4" />}
        </Button>
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className={`space-y-4 ${className}`} dir="rtl">
        <h4 className="text-lg font-bold text-gray-900 font-ge-ss">شارك هذا المحتوى</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {platforms.map((platform) => {
            const IconComponent = platform.icon
            return (
              <Button
                key={platform.name}
                variant="outline"
                onClick={() => handleShare(platform.name)}
                className={`bg-transparent ${platform.color} justify-start space-x-2 space-x-reverse h-12`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-ge-ss">{platform.label}</span>
              </Button>
            )
          })}
          
          <Button
            variant="outline"
            onClick={() => handleShare('copy')}
            className="bg-transparent hover:bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 justify-start space-x-2 space-x-reverse h-12"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Link className="w-5 h-5" />}
            <span className="font-ge-ss">{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
          </Button>
        </div>

        {/* Share tips */}
        <div className="text-xs text-gray-500 font-ge-ss">
          💡 نصيحة: استخدم واتساب وتويتر للوصول لأكبر عدد من القراء في المنطقة العربية
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`flex items-center space-x-3 space-x-reverse ${className}`} dir="rtl">
      <span className="text-sm font-medium text-gray-700 font-ge-ss">مشاركة:</span>

      <div className="flex items-center space-x-2 space-x-reverse">
        {platforms.filter(p => p.popular).map((platform) => {
          const IconComponent = platform.icon
          return (
            <Button
              key={platform.name}
              variant="outline"
              size="sm"
              onClick={() => handleShare(platform.name)}
              className={`bg-transparent ${platform.color} ${showLabels ? 'space-x-1 space-x-reverse px-3' : 'p-2'}`}
              title={`مشاركة عبر ${platform.label}`}
            >
              <IconComponent className="w-4 h-4" />
              {showLabels && <span className="font-ge-ss text-xs">{platform.label}</span>}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('copy')}
          className={`bg-transparent hover:bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 ${showLabels ? 'space-x-1 space-x-reverse px-3' : 'p-2'}`}
          title="نسخ الرابط"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link className="w-4 h-4" />}
          {showLabels && <span className="font-ge-ss text-xs">{copied ? 'تم النسخ!' : 'نسخ'}</span>}
        </Button>
      </div>

      {copied && <span className="text-sm text-green-600 font-ge-ss">تم النسخ!</span>}
    </div>
  )
}
