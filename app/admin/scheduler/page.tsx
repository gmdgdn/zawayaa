"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  Video, 
  Headphones,
  Plus, 
  Edit, 
  Trash2, 
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Filter
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

interface ScheduledContent {
  id: string
  title: string
  type: 'article' | 'episode' | 'podcast'
  author: string
  scheduled_date: string
  scheduled_time: string
  status: 'scheduled' | 'publishing' | 'published' | 'failed'
  content_url?: string
  estimated_duration?: number
  categories: string[]
  description?: string
  social_media_scheduled: boolean
  newsletter_scheduled: boolean
}

const mockScheduledContent: ScheduledContent[] = [
  {
    id: 'sch-001',
    title: 'تحليل: الأزمة الاقتصادية العالمية وتأثيرها على المنطقة',
    type: 'article',
    author: 'د. أحمد الزهراني',
    scheduled_date: '2025-01-26',
    scheduled_time: '09:00',
    status: 'scheduled',
    categories: ['اقتصاد', 'تحليل'],
    description: 'مقال تحليلي شامل حول الأزمة الاقتصادية الحالية',
    social_media_scheduled: true,
    newsletter_scheduled: true
  },
  {
    id: 'sch-002',
    title: 'حلقة جديدة: الذكاء الاصطناعي في التعليم العربي',
    type: 'podcast',
    author: 'فريق زوايا التحريري',
    scheduled_date: '2025-01-27',
    scheduled_time: '15:30',
    status: 'scheduled',
    estimated_duration: 45,
    categories: ['تكنولوجيا', 'تعليم'],
    description: 'مناقشة حول تطبيقات الذكاء الاصطناعي في التعليم',
    social_media_scheduled: true,
    newsletter_scheduled: false
  },
  {
    id: 'sch-003',
    title: 'وثائقي: رحلة في تاريخ العمارة الإسلامية',
    type: 'episode',
    author: 'محمد الحكيم',
    scheduled_date: '2025-01-25',
    scheduled_time: '12:00',
    status: 'publishing',
    estimated_duration: 30,
    categories: ['تاريخ', 'فن'],
    description: 'وثائقي يستكشف تطور العمارة الإسلامية عبر التاريخ',
    social_media_scheduled: true,
    newsletter_scheduled: true
  }
]

export default function ContentScheduler() {
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>(mockScheduledContent)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />
      case 'episode': return <Video className="w-4 h-4" />
      case 'podcast': return <Headphones className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'مقال'
      case 'episode': return 'حلقة مرئية'
      case 'podcast': return 'بودكاست'
      default: return 'محتوى'
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      scheduled: 'bg-blue-100 text-blue-800',
      publishing: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    }
    
    const statusLabels = {
      scheduled: 'مجدول',
      publishing: 'قيد النشر',
      published: 'منشور',
      failed: 'فشل'
    }

    const statusIcons = {
      scheduled: <Clock className="w-3 h-3 ml-1" />,
      publishing: <AlertCircle className="w-3 h-3 ml-1" />,
      published: <CheckCircle className="w-3 h-3 ml-1" />,
      failed: <AlertCircle className="w-3 h-3 ml-1" />
    }

    return (
      <Badge className={`${statusStyles[status as keyof typeof statusStyles]} flex items-center`}>
        {statusIcons[status as keyof typeof statusIcons]}
        {statusLabels[status as keyof typeof statusLabels]}
      </Badge>
    )
  }

  const formatDateTime = (date: string, time: string) => {
    const datetime = new Date(`${date}T${time}`)
    return format(datetime, "PPP 'في' p", { locale: ar })
  }

  const filteredContent = scheduledContent.filter(content => {
    const matchesStatus = selectedStatus === 'all' || content.status === selectedStatus
    const matchesType = selectedType === 'all' || content.type === selectedType
    const matchesDate = !selectedDate || content.scheduled_date === format(selectedDate, 'yyyy-MM-dd')
    return matchesStatus && matchesType && matchesDate
  })

  const todaysContent = scheduledContent.filter(content => 
    content.scheduled_date === format(new Date(), 'yyyy-MM-dd')
  )

  const upcomingContent = scheduledContent.filter(content => {
    const scheduledDate = new Date(content.scheduled_date)
    const today = new Date()
    return scheduledDate > today
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">جدولة المحتوى</h1>
            <p className="text-gray-600 mt-2">
              إدارة وجدولة نشر المقالات والحلقات
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            جدولة محتوى جديد
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">مجدول اليوم</p>
                  <p className="text-2xl font-bold">{todaysContent.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">قادم</p>
                  <p className="text-2xl font-bold">{upcomingContent.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">قيد النشر</p>
                  <p className="text-2xl font-bold">{scheduledContent.filter(c => c.status === 'publishing').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">فشل النشر</p>
                  <p className="text-2xl font-bold">{scheduledContent.filter(c => c.status === 'failed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendar Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>التقويم</CardTitle>
                <CardDescription>اختر تاريخاً لعرض المحتوى المجدول</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  locale={ar}
                />
              </CardContent>
            </Card>

            {/* Quick Filters */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>فلاتر سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">الحالة</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="scheduled">مجدول</option>
                    <option value="publishing">قيد النشر</option>
                    <option value="published">منشور</option>
                    <option value="failed">فشل</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">نوع المحتوى</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">جميع الأنواع</option>
                    <option value="article">مقالات</option>
                    <option value="episode">حلقات مرئية</option>
                    <option value="podcast">بودكاست</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>جدول اليوم</CardTitle>
                <CardDescription>المحتوى المجدول لليوم</CardDescription>
              </CardHeader>
              <CardContent>
                {todaysContent.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">لا يوجد محتوى مجدول لليوم</p>
                ) : (
                  <div className="space-y-4">
                    {todaysContent.map((content) => (
                      <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getTypeIcon(content.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{content.title}</h4>
                            <p className="text-sm text-gray-500">
                              {content.scheduled_time} • {content.author}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {getStatusBadge(content.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 ml-2" />
                                تحرير
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Play className="w-4 h-4 ml-2" />
                                نشر الآن
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 ml-2" />
                                إلغاء الجدولة
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Scheduled Content */}
            <Card>
              <CardHeader>
                <CardTitle>جميع المحتوى المجدول</CardTitle>
                <CardDescription>
                  {selectedDate ? `المحتوى المجدول لتاريخ ${format(selectedDate, 'PPP', { locale: ar })}` : 'جميع المحتوى المجدول'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredContent.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">لا يوجد محتوى مجدول للتاريخ المحدد</p>
                ) : (
                  <div className="space-y-4">
                    {filteredContent.map((content) => (
                      <Card key={content.id} className="border-l-4 border-blue-500">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 space-x-reverse">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                {getTypeIcon(content.type)}
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-3 space-x-reverse">
                                  <h3 className="text-lg font-bold text-gray-900">{content.title}</h3>
                                  {getStatusBadge(content.status)}
                                  <Badge variant="outline">{getTypeLabel(content.type)}</Badge>
                                </div>
                                <p className="text-gray-600">{content.description}</p>
                                <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-500">
                                  <div className="flex items-center space-x-2 space-x-reverse">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>{formatDateTime(content.scheduled_date, content.scheduled_time)}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 space-x-reverse">
                                    <span>بواسطة: {content.author}</span>
                                  </div>
                                  {content.estimated_duration && (
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                      <Clock className="w-4 h-4" />
                                      <span>{content.estimated_duration} دقيقة</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 space-x-reverse">
                                  {content.categories.map((category) => (
                                    <Badge key={category} variant="secondary" className="text-xs">
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500">
                                  {content.social_media_scheduled && (
                                    <span className="flex items-center space-x-1 space-x-reverse">
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      <span>جدولة وسائل التواصل</span>
                                    </span>
                                  )}
                                  {content.newsletter_scheduled && (
                                    <span className="flex items-center space-x-1 space-x-reverse">
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      <span>جدولة النشرة</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 ml-2" />
                                  تحرير الجدولة
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Play className="w-4 h-4 ml-2" />
                                  نشر الآن
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pause className="w-4 h-4 ml-2" />
                                  إيقاف مؤقت
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 ml-2" />
                                  إلغاء الجدولة
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 