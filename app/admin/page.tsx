"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Users, 
  Eye, 
  Mail, 
  Upload, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  articles: {
    total: number
    published: number
    draft: number
    featured: number
  }
  authors: {
    total: number
    active: number
  }
  views: {
    total: number
    today: number
    thisWeek: number
  }
  newsletter: {
    subscribers: number
    growthRate: number
  }
  submissions: {
    pending: number
    underReview: number
    approved: number
    rejected: number
  }
}

interface RecentActivity {
  id: string
  type: 'article' | 'submission' | 'newsletter' | 'author'
  title: string
  description: string
  timestamp: string
  status?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load statistics
      const [
        articlesCount,
        authorsCount,
        totalViews,
        subscribersCount,
        submissionsStats
      ] = await Promise.all([
        supabase.from('articles').select('id, featured', { count: 'exact' }),
        supabase.from('authors').select('id', { count: 'exact' }),
        supabase.from('articles').select('view_count'),
        supabase.from('newsletter_subscriptions').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('guest_submissions').select('status', { count: 'exact' })
      ])

      // Calculate article stats
      const articleStats = {
        total: articlesCount.count || 0,
        published: articlesCount.count || 0, // All articles in DB are considered published
        draft: 0, // Will be implemented with draft functionality
        featured: articlesCount.data?.filter(a => a.featured).length || 0
      }

      // Calculate view stats
      const totalViewCount = totalViews.data?.reduce((sum, article) => sum + (article.view_count || 0), 0) || 0

      // Calculate submission stats
      const submissionCounts = submissionsStats.data?.reduce((acc, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const dashboardStats: DashboardStats = {
        articles: articleStats,
        authors: {
          total: authorsCount.count || 0,
          active: authorsCount.count || 0 // Assume all authors are active for now
        },
        views: {
          total: totalViewCount,
          today: Math.floor(totalViewCount * 0.05), // Mock data - implement proper tracking later
          thisWeek: Math.floor(totalViewCount * 0.2)
        },
        newsletter: {
          subscribers: subscribersCount.count || 0,
          growthRate: 12.5 // Mock data - implement proper growth tracking
        },
        submissions: {
          pending: submissionCounts['pending'] || 0,
          underReview: submissionCounts['under_review'] || 0,
          approved: submissionCounts['approved'] || 0,
          rejected: submissionCounts['rejected'] || 0
        }
      }

      setStats(dashboardStats)

      // Load recent activity
      const { data: recentArticles } = await supabase
        .from('articles')
        .select(`
          id, 
          created_at,
          article_translations!inner(title)
        `)
        .eq('article_translations.language_code', 'ar')
        .order('created_at', { ascending: false })
        .limit(3)

      const { data: recentSubmissions } = await supabase
        .from('guest_submissions')
        .select('id, title, author_name, submitted_at, status')
        .order('submitted_at', { ascending: false })
        .limit(3)

      const activityItems: RecentActivity[] = [
        ...(recentArticles || []).map(article => ({
          id: article.id,
          type: 'article' as const,
          title: article.article_translations[0]?.title || 'مقال بدون عنوان',
          description: 'تم نشر مقال جديد',
          timestamp: article.created_at,
          status: 'published'
        })),
        ...(recentSubmissions || []).map(submission => ({
          id: submission.id,
          type: 'submission' as const,
          title: submission.title,
          description: `طلب كتابة من ${submission.author_name}`,
          timestamp: submission.submitted_at,
          status: submission.status
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)

      setRecentActivity(activityItems)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'قيد الانتظار', variant: 'secondary' as const },
      under_review: { label: 'قيد المراجعة', variant: 'default' as const },
      approved: { label: 'مقبول', variant: 'default' as const },
      rejected: { label: 'مرفوض', variant: 'destructive' as const },
      published: { label: 'منشور', variant: 'default' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 font-ge-ss">حدث خطأ أثناء تحميل البيانات</p>
          <Button onClick={loadDashboardData} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="bg-gradient-to-r from-zawaya-primary to-zawaya-accent rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2 font-eurostile">مرحباً بك في لوحة إدارة زوايا</h1>
          <p className="opacity-90 font-ge-ss">نظرة شاملة على أداء منصتك المعرفية</p>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Articles card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-ge-ss">المقالات</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.articles.total}</div>
              <p className="text-xs text-muted-foreground font-ge-ss">
                {stats.articles.featured} مقال مميز
              </p>
              <div className="mt-2">
                <Link href="/admin/articles">
                  <Button size="sm" variant="outline" className="font-ge-ss">
                    إدارة المقالات
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Authors card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-ge-ss">الكُتّاب</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.authors.total}</div>
              <p className="text-xs text-muted-foreground font-ge-ss">
                {stats.authors.active} كاتب نشط
              </p>
              <div className="mt-2">
                <Link href="/admin/authors">
                  <Button size="sm" variant="outline" className="font-ge-ss">
                    إدارة الكُتّاب
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Views card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-ge-ss">المشاهدات</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.views.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground font-ge-ss">
                +{stats.views.today} اليوم
              </p>
              <div className="mt-2">
                <Link href="/admin/analytics">
                  <Button size="sm" variant="outline" className="font-ge-ss">
                    التفاصيل
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-ge-ss">النشرة البريدية</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newsletter.subscribers}</div>
              <p className="text-xs text-muted-foreground font-ge-ss">
                +{stats.newsletter.growthRate}% هذا الشهر
              </p>
              <div className="mt-2">
                <Link href="/admin/newsletter">
                  <Button size="sm" variant="outline" className="font-ge-ss">
                    إدارة النشرة
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions overview */}
          <Card>
            <CardHeader>
              <CardTitle className="font-ge-ss">طلبات الكتابة</CardTitle>
              <CardDescription className="font-ge-ss">
                حالة طلبات الكتابة المرسلة من الكُتّاب
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-ge-ss">قيد الانتظار</span>
                  </div>
                  <span className="font-bold">{stats.submissions.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span className="font-ge-ss">قيد المراجعة</span>
                  </div>
                  <span className="font-bold">{stats.submissions.underReview}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-ge-ss">مقبولة</span>
                  </div>
                  <span className="font-bold">{stats.submissions.approved}</span>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/submissions">
                  <Button className="w-full font-ge-ss">
                    مراجعة الطلبات
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle className="font-ge-ss">النشاط الأخير</CardTitle>
              <CardDescription className="font-ge-ss">
                آخر التحديثات والأنشطة على المنصة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 space-x-reverse">
                      <div className="flex-shrink-0">
                        {activity.type === 'article' && <FileText className="h-4 w-4 text-blue-500" />}
                        {activity.type === 'submission' && <Upload className="h-4 w-4 text-orange-500" />}
                        {activity.type === 'newsletter' && <Mail className="h-4 w-4 text-green-500" />}
                        {activity.type === 'author' && <Users className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate font-ge-ss">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500 font-ge-ss">{activity.description}</p>
                        <div className="flex items-center space-x-2 space-x-reverse mt-1">
                          <p className="text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
                          {activity.status && getStatusBadge(activity.status)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4 font-ge-ss">
                    لا توجد أنشطة حديثة
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-ge-ss">إجراءات سريعة</CardTitle>
            <CardDescription className="font-ge-ss">
              أكثر المهام استخداماً في لوحة الإدارة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/articles/new">
                <Button variant="outline" className="w-full justify-start font-ge-ss">
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة مقال جديد
                </Button>
              </Link>
              <Link href="/admin/submissions">
                <Button variant="outline" className="w-full justify-start font-ge-ss">
                  <Upload className="mr-2 h-4 w-4" />
                  مراجعة الطلبات ({stats.submissions.pending})
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start font-ge-ss">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  عرض الإحصائيات
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 