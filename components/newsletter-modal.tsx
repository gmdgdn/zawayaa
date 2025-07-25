"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const { language, direction } = useLanguage()

  const content = {
    ar: {
      title: "اشترك في نشرتنا الإخبارية",
      description: "احصل على آخر الأخبار والتحليلات السياسية مباشرة في بريدك الإلكتروني",
      nameLabel: "الاسم الكامل",
      namePlaceholder: "أدخل اسمك الكامل",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      topicsTitle: "اختر المواضيع التي تهمك:",
      topics: [
        "السياسة والتحليل السياسي",
        "الاقتصاد والأعمال",
        "الثقافة والمجتمع",
        "التكنولوجيا والابتكار",
        "البودكاست والمحتوى الصوتي",
        "الوثائقيات والتقارير",
      ],
      subscribeButton: "اشترك الآن",
      subscribingButton: "جاري الاشتراك...",
      successTitle: "تم الاشتراك بنجاح!",
      successMessage: "شكراً لك على الاشتراك. ستصلك نشرتنا الإخبارية قريباً.",
      closeButton: "إغلاق",
      privacyNote: "نحن نحترم خصوصيتك ولن نشارك بياناتك مع أطراف ثالثة",
    },
    en: {
      title: "Subscribe to Our Newsletter",
      description: "Get the latest news and political analysis delivered directly to your inbox",
      nameLabel: "Full Name",
      namePlaceholder: "Enter your full name",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email address",
      topicsTitle: "Choose topics that interest you:",
      topics: [
        "Politics and Political Analysis",
        "Economy and Business",
        "Culture and Society",
        "Technology and Innovation",
        "Podcasts and Audio Content",
        "Documentaries and Reports",
      ],
      subscribeButton: "Subscribe Now",
      subscribingButton: "Subscribing...",
      successTitle: "Successfully Subscribed!",
      successMessage: "Thank you for subscribing. You'll receive our newsletter soon.",
      closeButton: "Close",
      privacyNote: "We respect your privacy and will not share your data with third parties",
    },
  }

  const t = content[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSuccess(false)
      setEmail("")
      setName("")
      setSelectedTopics([])
      onClose()
    }, 3000)
  }

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setIsSuccess(false)
      setEmail("")
      setName("")
      setSelectedTopics([])
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-md ${direction === "rtl" ? "text-right" : "text-left"}`}>
        {!isSuccess ? (
          <>
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-zawaya-primary/10 rounded-full">
                <Mail className="w-6 h-6 text-zawaya-primary" />
              </div>
              <DialogTitle
                className={`text-xl font-bold text-center ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
              >
                {t.title}
              </DialogTitle>
              <DialogDescription
                className={`text-center text-gray-600 ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
              >
                {t.description}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={language === "ar" ? "font-ge-ss" : "font-eurostile"}>
                  {t.nameLabel}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`${language === "ar" ? "font-ge-ss text-right" : "font-eurostile"}`}
                  dir={direction}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={language === "ar" ? "font-ge-ss" : "font-eurostile"}>
                  {t.emailLabel}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${language === "ar" ? "font-ge-ss text-right" : "font-eurostile"}`}
                  dir={direction}
                />
              </div>

              <div className="space-y-3">
                <Label className={`text-sm font-medium ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
                  {t.topicsTitle}
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {t.topics.map((topic, index) => (
                    <label
                      key={index}
                      className={`flex items-center space-x-2 space-x-reverse cursor-pointer p-2 rounded-lg border transition-colors ${
                        selectedTopics.includes(topic)
                          ? "bg-zawaya-primary/10 border-zawaya-primary"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic)}
                        onChange={() => toggleTopic(topic)}
                        className="w-4 h-4 text-zawaya-primary border-gray-300 rounded focus:ring-zawaya-primary"
                      />
                      <span className={`text-sm ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !email || !name}
                className={`w-full bg-zawaya-primary hover:bg-zawaya-primary/90 text-white ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
              >
                {isSubmitting ? t.subscribingButton : t.subscribeButton}
              </Button>

              <p className={`text-xs text-gray-500 text-center ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
                {t.privacyNote}
              </p>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className={`text-xl font-bold text-green-600 ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
                {t.successTitle}
              </h3>
              <p className={`text-gray-600 ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
                {t.successMessage}
              </p>
            </div>
            <Button
              onClick={handleClose}
              className={`bg-zawaya-primary hover:bg-zawaya-primary/90 text-white ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
            >
              {t.closeButton}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
