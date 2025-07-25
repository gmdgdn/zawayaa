"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export default function NewsletterSignUp() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Here you would typically call your newsletter API
    // For now, we'll simulate a submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
    setEmail("")
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2 font-ge-ss">
                شكراً لك!
              </h3>
              <p className="text-green-700 font-ge-ss">
                تم تسجيلك بنجاح في نشرتنا الإخبارية. ستصلك أحدث المقالات والتحليلات قريباً.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Newsletter Icon */}
          <div className="w-16 h-16 bg-clr-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          {/* Main Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-ge-ss leading-display text-balance">
            اذهب إلى ما وراء العناوين
          </h2>
          
          {/* Sub-headline */}
          <p className="text-lg text-gray-600 mb-8 font-ge-ss leading-reading prose-arabic content-container">
            احصل على تحليلاتنا العميقة وآرائنا المميزة مباشرة في بريدك الإلكتروني. 
            لا ضوضاء، فقط المحتوى الذي يستحق وقتك.
          </p>
          
          {/* Email Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 text-lg font-ge-ss text-right"
              dir="rtl"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-accent px-8 py-3 text-lg font-ge-ss whitespace-nowrap"
            >
              {isSubmitting ? "جاري التسجيل..." : "اشترك الآن"}
            </Button>
          </form>
          
          {/* Privacy Note */}
          <p className="text-sm text-gray-500 mt-6 font-ge-ss">
            نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
          </p>
        </div>
      </div>
    </section>
  )
} 