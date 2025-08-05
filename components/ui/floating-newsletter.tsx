"use client"

import { useState, useEffect } from 'react'
import { X, Mail, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FloatingNewsletter() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10000) // Show after 10 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsVisible(false)
      }, 2000)
    }
  }

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-500 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
    )}>
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 max-w-sm">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 left-3 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-support rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-ge-ss text-ink-900 font-bold mb-1">شكراً لك!</h3>
            <p className="text-small text-ink-600">تم تسجيل اشتراكك بنجاح</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-ge-ss text-ink-900 font-bold text-sm">النشرة اليومية</h3>
                <p className="text-xs text-ink-600">أفضل المقالات في بريدك</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                dir="rtl"
                required
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white text-sm">
                اشترك مجاناً
              </Button>
            </form>

            <p className="text-xs text-stone-500 mt-2 text-center">
              يمكنك إلغاء الاشتراك في أي وقت
            </p>
          </>
        )}
      </div>
    </div>
  )
}