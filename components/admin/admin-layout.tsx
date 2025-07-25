"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Upload,
  Tags,
  BarChart3,
  Settings,
  Menu,
  X,
  ExternalLink,
  LogOut,
  Globe,
  Wrench,
  Image,
  Video,
  Calendar,
  Shield
} from "lucide-react"
import Link from 'next/link'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar_url?: string
}

const navigation = [
  { 
    name: 'لوحة التحكم', 
    href: '/admin', 
    icon: LayoutDashboard,
    description: 'نظرة عامة على الإحصائيات'
  },
  { 
    name: 'المقالات', 
    href: '/admin/articles', 
    icon: FileText,
    description: 'إدارة المقالات والمحتوى'
  },
  { 
    name: 'البرامج والحلقات', 
    href: '/admin/programs', 
    icon: Video,
    description: 'إدارة البرامج المرئية والصوتية'
  },
  { 
    name: 'إدارة الملفات', 
    href: '/admin/media', 
    icon: Image,
    description: 'رفع وإدارة الصور والفيديوهات'
  },
  { 
    name: 'الكُتّاب', 
    href: '/admin/authors', 
    icon: Users,
    description: 'إدارة ملفات الكُتّاب'
  },
  { 
    name: 'الطلبات المرسلة', 
    href: '/admin/submissions', 
    icon: Upload,
    description: 'مراجعة طلبات الكتابة'
  },
  { 
    name: 'النشرة البريدية', 
    href: '/admin/newsletter', 
    icon: Mail,
    description: 'إدارة المشتركين والحملات'
  },
  { 
    name: 'التصنيفات', 
    href: '/admin/categories', 
    icon: Tags,
    description: 'إدارة تصنيفات المحتوى'
  },
  { 
    name: 'جدولة المحتوى', 
    href: '/admin/scheduler', 
    icon: Calendar,
    description: 'جدولة نشر المقالات والحلقات'
  },
  { 
    name: 'إدارة المستخدمين', 
    href: '/admin/users', 
    icon: Shield,
    description: 'إدارة المستخدمين والأذونات'
  },
  { 
    name: 'الإحصائيات', 
    href: '/admin/analytics', 
    icon: BarChart3,
    description: 'تحليل الأداء والمشاهدات'
  },
  { 
    name: 'إعداد المنصة', 
    href: '/admin/setup', 
    icon: Wrench,
    description: 'تكوين قاعدة البيانات'
  },
  { 
    name: 'الإعدادات', 
    href: '/admin/settings', 
    icon: Settings,
    description: 'إعدادات النظام'
  },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/admin/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('authors')
        .select('id, name, email, role, avatar_url')
        .eq('id', session.user.id)
        .single()

      if (error || !profile) {
        console.error('Error fetching profile:', error)
        await supabase.auth.signOut()
        router.push('/admin/login')
        return
      }

      if (profile.role !== 'admin' && profile.role !== 'editor') {
        router.push('/admin/unauthorized')
        return
      }

      setUser({
        ...profile,
        email: session.user.email || profile.email
      })
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isActivePage = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-zawaya-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-ge-ss">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/admin" className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-zawaya-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ز</span>
              </div>
              <div>
                <h1 className="font-bold text-zawaya-primary font-eurostile">زوايا</h1>
                <p className="text-xs text-gray-500 font-ge-ss">لوحة الإدارة</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = isActivePage(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zawaya-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-ge-ss">{item.name}</div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User profile and actions */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <Avatar>
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate font-ge-ss">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.role === 'admin' ? 'مدير' : 'محرر'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Link href="/ar" target="_blank">
                <Button variant="outline" size="sm" className="w-full justify-start font-ge-ss">
                  <Globe className="mr-2 h-4 w-4" />
                  عرض الموقع
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start font-ge-ss"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:mr-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div>
                <h1 className="text-lg font-semibold text-gray-900 font-ge-ss">
                  {navigation.find(nav => isActivePage(nav.href))?.name || 'لوحة الإدارة'}
                </h1>
                <p className="text-sm text-gray-500 font-ge-ss">
                  {navigation.find(nav => isActivePage(nav.href))?.description || 'منصة زوايا للإدارة والتحكم'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 font-ge-ss">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role === 'admin' ? 'مدير النظام' : 'محرر'}</p>
              </div>
              <Avatar>
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 