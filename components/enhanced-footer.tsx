"use client"

import Link from "next/link"
import { 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Headphones,
  Video,
  Users,
  Send,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const footerSections = {
  content: {
    title: "المحتوى",
    links: [
      { name: "المقالات", href: "/ar/articles", icon: FileText },
      { name: "آراء سياسية", href: "/ar/opinions", icon: FileText },
      { name: "تقدير موقف", href: "/ar/assessment", icon: FileText },
      { name: "البودكاست", href: "/ar/podcast", icon: Headphones },
      { name: "البرامج المرئية", href: "/ar/programs", icon: Video },
      { name: "الوثائقيات", href: "/ar/documentaries", icon: Video },
    ]
  },
  platform: {
    title: "المنصة",
    links: [
      { name: "من نحن", href: "/ar/about", icon: Users },
      { name: "منبر الكُتّاب", href: "/ar/writers", icon: Users },
      { name: "تواصل معنا", href: "/ar/contact", icon: Mail },
      { name: "البحث", href: "/ar/search", icon: FileText },
      { name: "سياسة الخصوصية", href: "/privacy", icon: FileText },
      { name: "شروط الاستخدام", href: "/terms", icon: FileText },
    ]
  },
  programs: {
    title: "برامجنا المميزة",
    links: [
      { name: "شمال جنوب", href: "/ar/programs", description: "حوارات سياسية واقتصادية" },
      { name: "عبق التاريخ", href: "/ar/podcast", description: "استكشاف التراث العربي" },
      { name: "زوايا الوثائقية", href: "/ar/documentaries", description: "وثائقيات متميزة" },
      { name: "حضارة الشرق", href: "/ar/programs", description: "رحلة في حضارات المنطقة" },
    ]
  }
}

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "YouTube", href: "#", icon: Youtube },
  { name: "Instagram", href: "#", icon: Instagram },
]

const contact = {
  email: "info@zawaya.org",
  phone: "+1 (555) 123-4567",
  address: "بيروت، لبنان",
}

export default function EnhancedFooter() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubscribing(false)
    setEmail("")
    // Show success message (in a real app)
  }

  return (
    <footer className="bg-clr-primary-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('/pattern.png')",
          backgroundSize: "100px 100px",
          backgroundRepeat: "repeat",
        }}
      />
      
      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold font-ge-ss mb-4">
                  اشترك في نشرتنا الإخبارية
                </h3>
                <p className="text-gray-300 font-ge-ss leading-relaxed">
                  احصل على آخر المقالات والتحليلات السياسية مباشرة في بريدك الإلكتروني
                </p>
              </div>
              <div>
                <form onSubmit={handleNewsletterSubmit} className="flex space-x-2 space-x-reverse">
                  <Input
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 font-ge-ss"
                    dir="rtl"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubscribing}
                    className="bg-clr-accent hover:bg-clr-accent/90 px-6"
                  >
                    {isSubscribing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-12 h-12 bg-clr-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl font-eurostile">ز</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-eurostile font-bold text-xl">زوايا</span>
                  <span className="text-sm text-gray-400 font-eurostile">Zawaya</span>
                </div>
              </div>
              <p className="text-gray-300 font-ge-ss leading-relaxed mb-6">
                زوايا منصة معرفية غير ربحية، ثنائية اللغة، تربط الواقع العربي بالتحولات العالمية عبر تحليلات رصينة متعددة الاختصاصات.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 space-x-reverse text-gray-300">
                  <Mail className="w-4 h-4 text-clr-menthol" />
                  <a 
                    href={`mailto:${contact.email}`}
                    className="hover:text-clr-accent transition-colors font-ge-ss"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-gray-300">
                  <Phone className="w-4 h-4 text-clr-menthol" />
                  <a 
                    href={`tel:${contact.phone}`}
                    className="hover:text-clr-accent transition-colors font-ge-ss"
                  >
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-gray-300">
                  <MapPin className="w-4 h-4 text-clr-menthol" />
                  <span className="font-ge-ss">{contact.address}</span>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div>
              <h3 className="text-lg font-bold font-ge-ss mb-6 text-clr-accent">
                {footerSections.content.title}
              </h3>
              <ul className="space-y-3">
                {footerSections.content.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-clr-accent transition-colors font-ge-ss flex items-center space-x-2 space-x-reverse group"
                    >
                      <link.icon className="w-4 h-4 text-gray-500 group-hover:text-clr-accent transition-colors" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform Column */}
            <div>
              <h3 className="text-lg font-bold font-ge-ss mb-6 text-clr-accent">
                {footerSections.platform.title}
              </h3>
              <ul className="space-y-3">
                {footerSections.platform.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-clr-accent transition-colors font-ge-ss flex items-center space-x-2 space-x-reverse group"
                    >
                      <link.icon className="w-4 h-4 text-gray-500 group-hover:text-clr-accent transition-colors" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs Column */}
            <div>
              <h3 className="text-lg font-bold font-ge-ss mb-6 text-clr-accent">
                {footerSections.programs.title}
              </h3>
              <ul className="space-y-4">
                {footerSections.programs.links.map((program) => (
                  <li key={program.name}>
                    <Link
                      href={program.href}
                      className="block group"
                    >
                      <div className="text-gray-300 hover:text-clr-accent transition-colors font-ge-ss font-medium group-hover:text-clr-accent">
                        {program.name}
                      </div>
                      <div className="text-sm text-gray-500 font-ge-ss mt-1">
                        {program.description}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 space-x-reverse">
                <p className="text-gray-400 font-ge-ss">
                  © 2025 Zawaya. جميع الحقوق محفوظة.
                </p>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4 space-x-reverse">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-clr-accent transition-colors p-2 rounded-lg hover:bg-white/10"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 