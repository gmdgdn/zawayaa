/**
 * Social Sharing Service for Arabic Content
 * Optimized for MENA platforms and Arabic social media
 */

export interface SocialShareData {
  title: string
  url: string
  description?: string
  imageUrl?: string
  hashtags?: string[]
  via?: string
  language?: 'ar' | 'en'
}

export interface SocialPlatform {
  name: string
  icon: string
  color: string
  shareUrl: string
  popular_in_mena: boolean
}

export class SocialService {
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zawaya.org'

  /**
   * Get social platforms popular in MENA region
   */
  getMENAPlatforms(): SocialPlatform[] {
    return [
      {
        name: 'WhatsApp',
        icon: 'whatsapp',
        color: '#25D366',
        shareUrl: 'https://wa.me/?text=',
        popular_in_mena: true,
      },
      {
        name: 'Twitter',
        icon: 'twitter',
        color: '#1DA1F2',
        shareUrl: 'https://twitter.com/intent/tweet',
        popular_in_mena: true,
      },
      {
        name: 'Facebook',
        icon: 'facebook',
        color: '#1877F2',
        shareUrl: 'https://www.facebook.com/sharer/sharer.php',
        popular_in_mena: true,
      },
      {
        name: 'Telegram',
        icon: 'telegram',
        color: '#0088CC',
        shareUrl: 'https://t.me/share/url',
        popular_in_mena: true,
      },
      {
        name: 'LinkedIn',
        icon: 'linkedin',
        color: '#0A66C2',
        shareUrl: 'https://www.linkedin.com/sharing/share-offsite/',
        popular_in_mena: false,
      },
      {
        name: 'Instagram',
        icon: 'instagram',
        color: '#E4405F',
        shareUrl: '', // Instagram doesn't support direct URL sharing
        popular_in_mena: true,
      },
    ]
  }

  /**
   * Generate share URL for specific platform
   */
  generateShareUrl(platform: string, data: SocialShareData): string {
    const encodedUrl = encodeURIComponent(data.url)
    const encodedTitle = encodeURIComponent(data.title)
    const encodedDescription = encodeURIComponent(data.description || '')
    const hashtags = data.hashtags?.map(tag => `#${tag}`).join(' ') || ''
    const encodedHashtags = encodeURIComponent(hashtags)

    switch (platform.toLowerCase()) {
      case 'whatsapp':
        const whatsappText = `${data.title}\n\n${data.description || ''}\n\n${data.url} ${hashtags}`.trim()
        return `https://wa.me/?text=${encodeURIComponent(whatsappText)}`

      case 'twitter':
        const twitterParams = new URLSearchParams({
          text: `${data.title} ${hashtags}`.trim(),
          url: data.url,
          ...(data.via && { via: data.via }),
        })
        return `https://twitter.com/intent/tweet?${twitterParams.toString()}`

      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`

      case 'telegram':
        const telegramParams = new URLSearchParams({
          url: data.url,
          text: `${data.title}\n\n${data.description || ''}`.trim(),
        })
        return `https://t.me/share/url?${telegramParams.toString()}`

      case 'linkedin':
        const linkedinParams = new URLSearchParams({
          url: data.url,
          title: data.title,
          summary: data.description || '',
        })
        return `https://www.linkedin.com/sharing/share-offsite/?${linkedinParams.toString()}`

      case 'email':
        const emailParams = new URLSearchParams({
          subject: data.title,
          body: `${data.description || ''}\n\n${data.url}`,
        })
        return `mailto:?${emailParams.toString()}`

      case 'copy':
        return data.url

      default:
        return data.url
    }
  }

  /**
   * Generate Arabic-optimized share text
   */
  generateArabicShareText(data: SocialShareData): string {
    const { title, description, hashtags } = data
    
    let shareText = title
    
    if (description) {
      shareText += `\n\n${description}`
    }
    
    if (hashtags && hashtags.length > 0) {
      const arabicHashtags = hashtags.map(tag => `#${tag}`).join(' ')
      shareText += `\n\n${arabicHashtags}`
    }
    
    shareText += `\n\n${data.url}`
    
    // Add platform signature
    shareText += '\n\nعبر منصة زوايا'
    
    return shareText
  }

  /**
   * Get suggested hashtags for Arabic content
   */
  getSuggestedHashtags(category: string, language: 'ar' | 'en' = 'ar'): string[] {
    const arabicHashtags: { [key: string]: string[] } = {
      'سياسة': ['سياسة', 'تحليل_سياسي', 'الشرق_الأوسط', 'زوايا'],
      'اقتصاد': ['اقتصاد', 'تحليل_اقتصادي', 'الاقتصاد_العربي', 'زوايا'],
      'ثقافة': ['ثقافة', 'الثقافة_العربية', 'فكر', 'زوايا'],
      'تكنولوجيا': ['تكنولوجيا', 'ذكاء_اصطناعي', 'تقنية', 'زوايا'],
      'فن': ['فن', 'الفن_العربي', 'ثقافة', 'زوايا'],
      'تاريخ': ['تاريخ', 'التاريخ_العربي', 'تراث', 'زوايا'],
      'آراء سياسية': ['رأي_سياسي', 'تحليل', 'سياسة', 'زوايا'],
      'تقدير موقف': ['تقدير_موقف', 'تحليل', 'استراتيجية', 'زوايا'],
    }

    const englishHashtags: { [key: string]: string[] } = {
      'politics': ['Politics', 'MiddleEast', 'Analysis', 'Zawaya'],
      'economy': ['Economy', 'Economics', 'ArabEconomy', 'Zawaya'],
      'culture': ['Culture', 'ArabCulture', 'Heritage', 'Zawaya'],
      'technology': ['Technology', 'AI', 'Tech', 'Zawaya'],
      'art': ['Art', 'ArabArt', 'Culture', 'Zawaya'],
      'history': ['History', 'ArabHistory', 'Heritage', 'Zawaya'],
    }

    const hashtags = language === 'ar' ? arabicHashtags : englishHashtags
    return hashtags[category] || ['زوايا', 'Zawaya']
  }

  /**
   * Track social sharing analytics
   */
  async trackShare(platform: string, contentId: string, contentType: 'article' | 'program' | 'podcast'): Promise<void> {
    try {
      await fetch('/api/analytics/social-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          content_id: contentId,
          content_type: contentType,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error('Failed to track social share:', error)
    }
  }

  /**
   * Generate Open Graph meta tags for social sharing
   */
  generateOpenGraphTags(data: SocialShareData): string {
    const tags = [
      `<meta property="og:title" content="${data.title}" />`,
      `<meta property="og:description" content="${data.description || ''}" />`,
      `<meta property="og:url" content="${data.url}" />`,
      `<meta property="og:type" content="article" />`,
      `<meta property="og:site_name" content="زوايا | Zawaya" />`,
      `<meta property="og:locale" content="${data.language === 'en' ? 'en_US' : 'ar_SA'}" />`,
    ]

    if (data.imageUrl) {
      tags.push(
        `<meta property="og:image" content="${data.imageUrl}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${data.title}" />`
      )
    }

    return tags.join('\n')
  }

  /**
   * Generate Twitter Card meta tags
   */
  generateTwitterCardTags(data: SocialShareData): string {
    const tags = [
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${data.title}" />`,
      `<meta name="twitter:description" content="${data.description || ''}" />`,
      `<meta name="twitter:site" content="@ZawayaPlatform" />`,
      `<meta name="twitter:creator" content="@ZawayaPlatform" />`,
    ]

    if (data.imageUrl) {
      tags.push(`<meta name="twitter:image" content="${data.imageUrl}" />`)
    }

    return tags.join('\n')
  }

  /**
   * Generate structured data for social sharing
   */
  generateSocialStructuredData(data: SocialShareData): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.description,
      url: data.url,
      image: data.imageUrl,
      publisher: {
        '@type': 'Organization',
        name: 'زوايا | Zawaya',
        url: this.baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': data.url,
      },
    }
  }

  /**
   * Open share dialog for specific platform
   */
  openShareDialog(platform: string, data: SocialShareData): void {
    const shareUrl = this.generateShareUrl(platform, data)
    
    if (platform.toLowerCase() === 'copy') {
      this.copyToClipboard(data.url)
      return
    }

    if (platform.toLowerCase() === 'email') {
      window.location.href = shareUrl
      return
    }

    // Open in popup window
    const popup = window.open(
      shareUrl,
      'share-dialog',
      'width=600,height=400,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no'
    )

    if (popup) {
      popup.focus()
    }
  }

  /**
   * Copy URL to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const success = document.execCommand('copy')
        textArea.remove()
        return success
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  /**
   * Get social sharing statistics
   */
  async getSharingStats(contentId: string): Promise<{
    total_shares: number
    platform_breakdown: { [platform: string]: number }
    most_popular_platform: string
  }> {
    try {
      const response = await fetch(`/api/analytics/social-share?content_id=${contentId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch sharing stats')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching sharing stats:', error)
      return {
        total_shares: 0,
        platform_breakdown: {},
        most_popular_platform: 'twitter',
      }
    }
  }

  /**
   * Generate share buttons HTML for Arabic content
   */
  generateShareButtonsHTML(data: SocialShareData): string {
    const platforms = this.getMENAPlatforms().filter(p => p.popular_in_mena)
    
    return platforms
      .map(platform => {
        const shareUrl = this.generateShareUrl(platform.name, data)
        return `
          <button 
            onclick="window.open('${shareUrl}', 'share', 'width=600,height=400')"
            class="share-btn share-btn-${platform.name.toLowerCase()}"
            style="background-color: ${platform.color}"
            title="مشاركة عبر ${platform.name}"
          >
            <i class="icon-${platform.icon}"></i>
            ${platform.name}
          </button>
        `
      })
      .join('')
  }

  /**
   * Check if platform is popular in MENA
   */
  isPlatformPopularInMENA(platform: string): boolean {
    const menaPlatforms = ['whatsapp', 'twitter', 'facebook', 'telegram', 'instagram']
    return menaPlatforms.includes(platform.toLowerCase())
  }

  /**
   * Get platform-specific sharing tips for Arabic content
   */
  getSharingTips(platform: string): string[] {
    const tips: { [key: string]: string[] } = {
      whatsapp: [
        'استخدم نص قصير ومباشر',
        'أضف الهاشتاغات في نهاية الرسالة',
        'تأكد من وضوح الرابط',
      ],
      twitter: [
        'اجعل النص أقل من 280 حرف',
        'استخدم هاشتاغات ذات صلة',
        'أضف صورة جذابة',
        'اذكر @ZawayaPlatform',
      ],
      facebook: [
        'اكتب وصف مفصل',
        'استخدم صورة عالية الجودة',
        'أضف دعوة للعمل واضحة',
      ],
      telegram: [
        'استخدم تنسيق نص جذاب',
        'أضف الهاشتاغات المناسبة',
        'شارك في القنوات ذات الصلة',
      ],
    }

    return tips[platform.toLowerCase()] || ['شارك المحتوى مع جمهورك']
  }
}

// Export singleton instance
export const socialService = new SocialService()

// Export types
export type { SocialShareData, SocialPlatform }