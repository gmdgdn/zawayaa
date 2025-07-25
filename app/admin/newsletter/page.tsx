"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  Users, 
  Send, 
  Download, 
  Calendar,
  TrendingUp,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle,
  AlertCircle,
  UserX
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface NewsletterSubscription {
  id: string
  email: string
  is_active: boolean
  source: string
  subscribed_at: string
  unsubscribed_at?: string
  preferences?: {
    frequency?: string
    topics?: string[]
  }
}

interface NewsletterStats {
  totalSubscribers: number
  activeSubscribers: number
  recentSubscriptions: number
  unsubscribeRate: number
  topSources: Array<{ source: string; count: number }>
}

interface CampaignData {
  subject: string
  content: string
  targetAudience: 'all' | 'recent' | 'active'
  scheduledFor?: string
}

export default function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscription[]>([])
  const [stats, setStats] = useState<NewsletterStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCampaignDialog, setShowCampaignDialog] = useState(false)
  const [campaignData, setCampaignData] = useState<CampaignData>({
    subject: '',
    content: '',
    targetAudience: 'all'
  })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadNewsletterData()
  }, [])

  const loadNewsletterData = async () => {
    try {
      setLoading(true)
      
      // Load subscribers
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false })

      if (subscribersError) {
        console.error('Error loading subscribers:', subscribersError)
        return
      }

      setSubscribers(subscribersData || [])

      // Calculate stats
      const total = subscribersData?.length || 0
      const active = subscribersData?.filter(sub => sub.is_active).length || 0
      const recentCount = subscribersData?.filter(sub => {
        const subscribeDate = new Date(sub.subscribed_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return subscribeDate >= weekAgo
      }).length || 0

      // Calculate unsubscribe rate
      const unsubscribed = subscribersData?.filter(sub => !sub.is_active).length || 0
      const unsubscribeRate = total > 0 ? (unsubscribed / total) * 100 : 0

      // Calculate top sources
      const sourceCounts: Record<string, number> = {}
      subscribersData?.forEach(sub => {
        const source = sub.source || 'مباشر'
        sourceCounts[source] = (sourceCounts[source] || 0) + 1
      })
      
      const topSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setStats({
        totalSubscribers: total,
        activeSubscribers: active,
        recentSubscriptions: recentCount,
        unsubscribeRate: Math.round(unsubscribeRate * 100) / 100,
        topSources
      })

    } catch (error) {
      console.error('Error loading newsletter data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSubscriptionStatus = async (subscriptionId: string, isActive: boolean) => {
    try {
      setActionLoading(true)
      
      const updateData: any = {
        is_active: isActive,
        updated_at: new Date().toISOString()
      }

      if (!isActive) {
        updateData.unsubscribed_at = new Date().toISOString()
      } else {
        updateData.unsubscribed_at = null
      }

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update(updateData)
        .eq('id', subscriptionId)

      if (error) {
        console.error('Error updating subscription:', error)
        return
      }

      // Update local state
      setSubscribers(prev => prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, is_active: isActive, unsubscribed_at: isActive ? undefined : new Date().toISOString() }
          : sub
      ))

      // Reload stats
      await loadNewsletterData()
    } catch (error) {
      console.error('Error updating subscription:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const deleteSubscription = async (subscriptionId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الاشتراك؟')) {
      return
    }

    try {
      setActionLoading(true)
      
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', subscriptionId)

      if (error) {
        console.error('Error deleting subscription:', error)
        return
      }

      // Update local state
      setSubscribers(prev => prev.filter(sub => sub.id !== subscriptionId))
      await loadNewsletterData()
    } catch (error) {
      console.error('Error deleting subscription:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const exportSubscribers = () => {
    const filteredData = filteredSubscribers.map(sub => ({
      email: sub.email,
      status: sub.is_active ? 'نشط' : 'ملغي',
      source: sub.source || 'مباشر',
      subscribed_date: new Date(sub.subscribed_at).toLocaleDateString('ar-SA')
    }))

    const csvContent = [
      ['البريد الإلكتروني', 'الحالة', 'المصدر', 'تاريخ الاشتراك'],
      ...filteredData.map(row => [row.email, row.status, row.source, row.subscribed_date])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sendCampaign = async () => {
    if (!campaignData.subject || !campaignData.content) {
      alert('يرجى ملء جميع حقول الحملة')
      return
    }

    try {
      setActionLoading(true)
      
      // In a real implementation, this would:
      // 1. Create campaign record in database
      // 2. Queue emails for sending via email service (Resend, etc.)
      // 3. Track delivery and engagement
      
      // For now, simulate campaign creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('تم إنشاء الحملة بنجاح! سيتم إرسالها قريباً.')
      
      setCampaignData({
        subject: '',
        content: '',
        targetAudience: 'all'
      })
      setShowCampaignDialog(false)
      
    } catch (error) {
      console.error('Error sending campaign:', error)
      alert('حدث خطأ أثناء إنشاء الحملة')
    } finally {
      setActionLoading(false)
    }
  }

  const getSourceLabel = (source: string) => {
    const sourceLabels: Record<string, string> = {
      'homepage': 'الصفحة الرئيسية',
      'article': 'من مقال',
      'footer': 'تذييل الموقع',
      'popup': 'نافذة منبثقة',
      'direct': 'مباشر'
    }
    return sourceLabels[source] || source || 'مباشر'
  }

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = !searchTerm || 
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && sub.is_active) ||
      (statusFilter === 'inactive' && !sub.is_active)
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
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
          <h1 className="text-2xl font-bold font-ge-ss">إدارة النشرة البريدية</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-ge-ss">إدارة النشرة البريدية</h1>
            <p className="text-gray-600 font-ge-ss">
              إدارة المشتركين وإرسال الحملات البريدية
            </p>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <Button variant="outline" onClick={exportSubscribers} className="font-ge-ss">
              <Download className="mr-2 h-4 w-4" />
              تصدير البيانات
            </Button>
            <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
              <DialogTrigger asChild>
                <Button className="font-ge-ss">
                  <Send className="mr-2 h-4 w-4" />
                  إنشاء حملة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="font-ge-ss">إنشاء حملة بريدية جديدة</DialogTitle>
                  <DialogDescription className="font-ge-ss">
                    إنشاء وإرسال حملة بريدية للمشتركين
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject" className="font-ge-ss">موضوع الرسالة</Label>
                    <Input
                      id="subject"
                      value={campaignData.subject}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="موضوع النشرة البريدية"
                      className="font-ge-ss"
                    />
                  </div>

                  <div>
                    <Label htmlFor="audience" className="font-ge-ss">الجمهور المستهدف</Label>
                    <Select 
                      value={campaignData.targetAudience} 
                      onValueChange={(value: CampaignData['targetAudience']) => 
                        setCampaignData(prev => ({ ...prev, targetAudience: value }))
                      }
                    >
                      <SelectTrigger className="font-ge-ss">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المشتركين ({stats?.activeSubscribers || 0})</SelectItem>
                        <SelectItem value="recent">المشتركين الجدد ({stats?.recentSubscriptions || 0})</SelectItem>
                        <SelectItem value="active">المشتركين النشطين ({stats?.activeSubscribers || 0})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="content" className="font-ge-ss">محتوى الرسالة</Label>
                    <Textarea
                      id="content"
                      value={campaignData.content}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="اكتب محتوى النشرة البريدية هنا..."
                      className="font-ge-ss min-h-[200px]"
                    />
                  </div>

                  <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertDescription className="font-ge-ss">
                      سيتم إرسال الحملة إلى {
                        campaignData.targetAudience === 'all' ? stats?.activeSubscribers :
                        campaignData.targetAudience === 'recent' ? stats?.recentSubscriptions :
                        stats?.activeSubscribers
                      } مشترك
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCampaignDialog(false)}
                      disabled={actionLoading}
                      className="font-ge-ss"
                    >
                      إلغاء
                    </Button>
                    <Button 
                      onClick={sendCampaign}
                      disabled={actionLoading || !campaignData.subject || !campaignData.content}
                      className="font-ge-ss"
                    >
                      {actionLoading ? 'جاري الإرسال...' : 'إرسال الحملة'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-ge-ss">إجمالي المشتركين</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
                <p className="text-xs text-muted-foreground font-ge-ss">
                  جميع المشتركين المسجلين
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-ge-ss">المشتركين النشطين</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeSubscribers}</div>
                <p className="text-xs text-muted-foreground font-ge-ss">
                  {Math.round((stats.activeSubscribers / stats.totalSubscribers) * 100)}% من الإجمالي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-ge-ss">اشتراكات جديدة</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.recentSubscriptions}</div>
                <p className="text-xs text-muted-foreground font-ge-ss">
                  خلال الأسبوع الماضي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-ge-ss">معدل إلغاء الاشتراك</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.unsubscribeRate}%</div>
                <p className="text-xs text-muted-foreground font-ge-ss">
                  من إجمالي المشتركين
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Sources */}
        {stats && stats.topSources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-ge-ss">مصادر الاشتراك</CardTitle>
              <CardDescription className="font-ge-ss">
                أهم المصادر التي جلبت المشتركين
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {stats.topSources.map((source, index) => (
                  <div key={source.source} className="text-center">
                    <div className="text-2xl font-bold text-zawaya-primary">{source.count}</div>
                    <div className="text-sm text-gray-600 font-ge-ss">{getSourceLabel(source.source)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="font-ge-ss">البحث والتصفية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 font-ge-ss"
                  dir="ltr"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="font-ge-ss">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">ملغي</SelectItem>
                </SelectContent>
              </Select>

              {/* Results count */}
              <div className="flex items-center text-sm text-gray-600 font-ge-ss">
                <Eye className="mr-2 h-4 w-4" />
                عرض {filteredSubscribers.length} من {subscribers.length} مشترك
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle className="font-ge-ss">قائمة المشتركين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-10 h-10 bg-zawaya-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-zawaya-primary" />
                      </div>
                      <div>
                        <p className="font-medium" dir="ltr">{subscriber.email}</p>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                          <span className="font-ge-ss">{getSourceLabel(subscriber.source)}</span>
                          <span>•</span>
                          <span>{formatDate(subscriber.subscribed_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Badge variant={subscriber.is_active ? 'default' : 'secondary'}>
                        {subscriber.is_active ? 'نشط' : 'ملغي'}
                      </Badge>
                      
                      {subscriber.is_active ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSubscriptionStatus(subscriber.id, false)}
                          disabled={actionLoading}
                          className="font-ge-ss"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          إلغاء
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSubscriptionStatus(subscriber.id, true)}
                          disabled={actionLoading}
                          className="font-ge-ss"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          تفعيل
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSubscription(subscriber.id)}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-ge-ss">
                    لا توجد اشتراكات
                  </h3>
                  <p className="text-gray-600 font-ge-ss">
                    {searchTerm || statusFilter !== 'all'
                      ? 'لم يتم العثور على مشتركين يطابقون معايير البحث'
                      : 'لا توجد اشتراكات في النشرة البريدية بعد'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 