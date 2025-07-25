"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react"
import { colors } from "@/lib/theme"

interface SubmitModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
}

interface FormData {
  author_name: string
  email: string
  title: string
  category: string
  summary: string
  content: string
  author_bio: string
  references: string
  qualifications: string
  file: File | null
}

interface FormErrors {
  author_name?: string
  email?: string
  title?: string
  category?: string
  summary?: string
  content?: string
  author_bio?: string
  references?: string
  qualifications?: string
  file?: string
}

export default function SubmitModal({ isOpen, onOpenChange, trigger }: SubmitModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    title: "",
    bio: "",
    file: null,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [dragActive, setDragActive] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب"
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح"
    }

    if (!formData.title.trim()) {
      newErrors.title = "عنوان المقال مطلوب"
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "نبذة عن الكاتب مطلوبة"
    }

    if (!formData.file) {
      newErrors.file = "يرجى رفع ملف المقال"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileChange = (file: File | null) => {
    if (file) {
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/msword", // .doc
        "text/markdown", // .md
        "text/plain", // .txt (for .mdx)
      ]

      const allowedExtensions = [".doc", ".docx", ".md", ".mdx"]
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        setErrors((prev) => ({ ...prev, file: "نوع الملف غير مدعوم. يرجى رفع ملف .doc أو .docx أو .mdx" }))
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrors((prev) => ({ ...prev, file: "حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت" }))
        return
      }
    }

    setFormData((prev) => ({ ...prev, file }))
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: undefined }))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("email", formData.email)
      submitData.append("title", formData.title)
      submitData.append("bio", formData.bio)
      if (formData.file) {
        submitData.append("file", formData.file)
      }

      // In a real app, this would be an API call to your backend
      // which would then save to Supabase
      const response = await fetch("/api/submit-article", {
        method: "POST",
        body: submitData,
      })

      if (response.ok) {
        setSubmitStatus("success")
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({ name: "", email: "", title: "", bio: "", file: null })
          setSubmitStatus("idle")
          onOpenChange(false)
        }, 2000)
      } else {
        throw new Error("فشل في إرسال المقال")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", title: "", bio: "", file: null })
    setErrors({})
    setSubmitStatus("idle")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-zawaya-primary font-ge-ss">قدّم مقالك</DialogTitle>
          <DialogDescription className="text-gray-600 font-ge-ss">
            شاركنا أفكارك وتحليلاتك. سيقوم فريقنا التحريري بمراجعة مقالك والرد عليك في أقرب وقت ممكن.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-600 mb-2 font-ge-ss">تم إرسال المقال بنجاح!</h3>
            <p className="text-gray-600 font-ge-ss">
              شكراً لك على مساهمتك. سيقوم فريقنا التحريري بمراجعة مقالك والرد عليك قريباً.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 font-ge-ss">
                الاسم الكامل *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className={`font-ge-ss text-right ${errors.name ? "border-red-500" : ""}`}
                dir="rtl"
              />
              {errors.name && <p className="text-sm text-red-600 font-ge-ss">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 font-ge-ss">
                البريد الإلكتروني *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="example@email.com"
                className={`font-ge-ss text-right ${errors.email ? "border-red-500" : ""}`}
                dir="rtl"
              />
              {errors.email && <p className="text-sm text-red-600 font-ge-ss">{errors.email}</p>}
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 font-ge-ss">
                عنوان المقال *
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="أدخل عنوان المقال"
                className={`font-ge-ss text-right ${errors.title ? "border-red-500" : ""}`}
                dir="rtl"
              />
              {errors.title && <p className="text-sm text-red-600 font-ge-ss">{errors.title}</p>}
            </div>

            {/* Bio Field */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium text-gray-700 font-ge-ss">
                نبذة عن الكاتب *
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="اكتب نبذة مختصرة عنك وخبراتك..."
                className={`font-ge-ss text-right min-h-[100px] resize-none ${errors.bio ? "border-red-500" : ""}`}
                dir="rtl"
              />
              {errors.bio && <p className="text-sm text-red-600 font-ge-ss">{errors.bio}</p>}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 font-ge-ss">ملف المقال *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? "border-zawaya-accent bg-zawaya-accent/5"
                    : errors.file
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-zawaya-accent hover:bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".doc,.docx,.md,.mdx"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />

                {formData.file ? (
                  <div className="flex items-center justify-center space-x-3 space-x-reverse">
                    <FileText className="w-8 h-8 text-zawaya-primary" />
                    <div className="text-right">
                      <p className="font-medium text-gray-900 font-ge-ss">{formData.file.name}</p>
                      <p className="text-sm text-gray-500 font-ge-ss">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} ميجابايت
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileChange(null)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-ge-ss mb-2">اسحب الملف هنا أو</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="bg-transparent border-zawaya-accent text-zawaya-accent hover:bg-zawaya-accent hover:text-white font-ge-ss"
                    >
                      اختر ملف
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 font-ge-ss">
                      الملفات المدعومة: .doc, .docx, .mdx (حتى 10 ميجابايت)
                    </p>
                  </div>
                )}
              </div>
              {errors.file && <p className="text-sm text-red-600 font-ge-ss">{errors.file}</p>}
            </div>

            {/* Submit Status */}
            {submitStatus === "error" && (
              <div className="flex items-center space-x-2 space-x-reverse p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600 font-ge-ss">حدث خطأ أثناء إرسال المقال. يرجى المحاولة مرة أخرى.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
                  onOpenChange(false)
                }}
                disabled={isSubmitting}
                className="bg-transparent font-ge-ss"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white font-ge-ss"
                style={{ backgroundColor: colors.accent }}
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال المقال"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
