import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/atoms/Button"
import { Facebook, Twitter, Instagram, Youtube, Mail, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface FooterProps {
  locale: 'ar' | 'en'
  className?: string
}

const footerLinks = {
  ar: {
    sections: [
      {
        title: 'المحتوى',
        links: [
          { name: 'المقالات', href: '/articles' },
          { name: 'البرامج', href: '/programs' },
          { name: 'البودكاست', href: '/podcast' },
          { name: 'الوثائقيات', href: '/documentaries' },
          { name: 'تقدير موقف', href: '/taqdeer-mawqef' },
        ]
      },
      {
        title: 'عن زوايا',
        links: [
          { name: 'من نحن', href: '/about' },
          { name: 'فريق العمل', href: '/team' },
          { name: 'اتصل بنا', href: '/contact' },
          { name: 'منصة الكتاب', href: '/writers-platform' },
        ]
      },
      {
        title: 'الدعم',
        links: [
          { name: 'الأسئلة الشائعة', href: '/faq' },
          { name: 'سياسة الخصوصية', href: '/privacy' },
          { name: 'شروط الاستخدام', href: '/terms' },
          { name: 'إرشادات المجتمع', href: '/guidelines' },
        ]
      }
    ],
    newsletter: {
      title: 'اشترك في نشرتنا البريدية',
      description: 'احصل على أحدث المقالات والحلقات مباشرة في بريدك الإلكتروني',
      placeholder: 'البريد الإلكتروني',
      button: 'اشترك',
    },
    social: {
      title: 'تابعنا',
      copyright: '© 2024 زوايا. جميع الحقوق محفوظة.',
    }
  },
  en: {
    sections: [
      {
        title: 'Content',
        links: [
          { name: 'Articles', href: '/en/articles' },
          { name: 'Programs', href: '/en/programs' },
          { name: 'Podcast', href: '/en/podcast' },
          { name: 'Documentaries', href: '/en/documentaries' },
          { name: 'Analysis', href: '/en/taqdeer-mawqef' },
        ]
      },
      {
        title: 'About Zawaya',
        links: [
          { name: 'About Us', href: '/en/about' },
          { name: 'Team', href: '/en/team' },
          { name: 'Contact', href: '/en/contact' },
          { name: 'Writers Platform', href: '/en/writers-platform' },
        ]
      },
      {
        title: 'Support',
        links: [
          { name: 'FAQ', href: '/en/faq' },
          { name: 'Privacy Policy', href: '/en/privacy' },
          { name: 'Terms of Use', href: '/en/terms' },
          { name: 'Community Guidelines', href: '/en/guidelines' },
        ]
      }
    ],
    newsletter: {
      title: 'Subscribe to our newsletter',
      description: 'Get the latest articles and episodes delivered directly to your inbox',
      placeholder: 'Email address',
      button: 'Subscribe',
    },
    social: {
      title: 'Follow us',
      copyright: '© 2024 Zawaya. All rights reserved.',
    }
  }
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/zawaya' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/zawaya' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/zawaya' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/zawaya' },
]

export function Footer({ locale, className }: FooterProps) {
  const [email, setEmail] = React.useState('')
  const [isSubscribing, setIsSubscribing] = React.useState(false)
  
  const content = footerLinks[locale]
  const isRTL = locale === 'ar'

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    
    // Simulate newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setEmail('')
    setIsSubscribing(false)
    // In a real app, you'd handle the actual subscription here
  }

  return (
    <footer className={cn("bg-primary-900 text-neutral-50", className)}>
      <div className="max-w-site mx-auto px-lg py-2xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl mb-2xl">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1 space-y-lg">
            {/* Logo */}
            <Link href={isRTL ? "/" : "/en"} className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-600 to-accent-300 rounded-xl flex items-center justify-center">
                <span className="text-neutral-50 font-bold text-xl">ز</span>
              </div>
              <span className="text-2 font-bold">زوايا</span>
            </Link>

            {/* Newsletter Signup */}
            <div className="space-y-md">
              <h3 className="text-1 font-semibold">{content.newsletter.title}</h3>
              <p className="text-0 text-neutral-50/80 leading-relaxed">
                {content.newsletter.description}
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-sm">
                <div className="relative">
                  <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-700" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.newsletter.placeholder}
                    className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-sm border border-primary-700 rounded-2xl bg-primary-700/50 text-neutral-50 placeholder-neutral-50/60 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  disabled={isSubscribing}
                  className="w-full"
                >
                  {isSubscribing ? 'جاري الاشتراك...' : content.newsletter.button}
                </Button>
              </form>
            </div>
          </div>

          {/* Footer Links */}
          {content.sections.map((section) => (
            <div key={section.title} className="space-y-lg">
              <h3 className="text-1 font-semibold">{section.title}</h3>
              <ul className="space-y-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-0 text-neutral-50/80 hover:text-accent-300 transition-colors duration-200 flex items-center gap-xs group"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-700 pt-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-lg">
            {/* Social Links */}
            <div className="flex items-center gap-lg">
              <span className="text-0 text-neutral-50/80">{content.social.title}</span>
              <div className="flex items-center gap-md">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-primary-700/50 rounded-full flex items-center justify-center text-neutral-50/80 hover:text-accent-300 hover:bg-primary-700 transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="sr-only">{social.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Copyright */}
            <p className="text--1 text-neutral-50/60">
              {content.social.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
