"use client"

import Link from "next/link"
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const footerContent = {
  ar: {
    about: {
      title: "عن زوايا",
      description:
        "زوايا منصة معرفية غير ربحية، ثنائية اللغة، تربط الواقع العربي بالتحولات العالمية عبر تحليلات رصينة متعددة الاختصاصات.",
    },
    quickLinks: {
      title: "روابط سريعة",
      links: [
        { name: "الرئيسية", href: "/" },
        { name: "آراء سياسية", href: "/opinions" },
        { name: "تقييم الوضع", href: "/assessment" },
        { name: "بودكاست", href: "/podcast" },
        { name: "وثائقيات", href: "/documentaries" },
        { name: "اتصل بنا", href: "/contact" },
      ],
    },
    contact: {
      title: "تواصل معنا",
      email: "info@zawaya.org",
      phone: "+1 (555) 123-4567",
      address: "بيروت، لبنان",
    },
  },
  en: {
    about: {
      title: "About Zawaya",
      description:
        "Zawaya is a non-profit, bilingual knowledge hub that links Arab realities to global transformations through rigorous, multi-disciplinary analysis.",
    },
    quickLinks: {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "Political Opinions", href: "/opinions" },
        { name: "Situation Assessment", href: "/assessment" },
        { name: "Podcast", href: "/podcast" },
        { name: "Documentaries", href: "/documentaries" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    contact: {
      title: "Contact & Social",
      email: "info@zawaya.org",
      phone: "+1 (555) 123-4567",
      address: "Beirut, Lebanon",
    },
  },
}

export default function Footer() {
  const { language, direction } = useLanguage()
  const content = footerContent[language]

  return (
    <footer
      className="bg-zawaya-primary text-white bg-geometric-pattern bg-opacity-10"
      style={{
        backgroundImage: "url('/pattern.png')",
        backgroundSize: "100px 100px",
        backgroundRepeat: "repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-zawaya-primary font-bold text-lg">ز</span>
              </div>
              <span className="font-eurostile font-bold text-xl">Zawaya</span>
            </div>
            <h3 className={`text-lg font-semibold ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
              {content.about.title}
            </h3>
            <p
              className={`text-sm text-gray-300 leading-relaxed ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
            >
              {content.about.description}
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
              {content.quickLinks.title}
            </h3>
            <ul className="space-y-2">
              {content.quickLinks.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-sm text-gray-300 hover:text-zawaya-yellow transition-colors ${
                      language === "ar" ? "font-ge-ss" : "font-eurostile"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Column */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
              {content.contact.title}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Mail className="h-4 w-4 text-zawaya-menthol" />
                <a
                  href={`mailto:${content.contact.email}`}
                  className="text-sm text-gray-300 hover:text-zawaya-yellow transition-colors"
                >
                  {content.contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Phone className="h-4 w-4 text-zawaya-menthol" />
                <a
                  href={`tel:${content.contact.phone}`}
                  className="text-sm text-gray-300 hover:text-zawaya-yellow transition-colors"
                >
                  {content.contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <MapPin className="h-4 w-4 text-zawaya-menthol" />
                <span className="text-sm text-gray-300">{content.contact.address}</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4 space-x-reverse pt-4">
              <a href="#" className="text-gray-300 hover:text-zawaya-yellow transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-zawaya-yellow transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-zawaya-yellow transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-zawaya-yellow transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-600 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`text-sm text-gray-400 ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
              © 2025 Zawaya. {language === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
            <div className="flex space-x-6 space-x-reverse">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-zawaya-yellow transition-colors">
                {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-zawaya-yellow transition-colors">
                {language === "ar" ? "شروط الاستخدام" : "Terms of Use"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
