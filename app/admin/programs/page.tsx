"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Video, 
  Headphones, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Play,
  Pause,
  MoreHorizontal,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Star
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface Program {
  id: string
  title_ar: string
  description_ar: string
  type: 'video' | 'audio' | 'mixed'
  host_ar: string
  cover_image_url?: string
  status: 'active' | 'inactive' | 'upcoming' | 'completed'
  featured: boolean
  episode_count: number
  duration_avg: number
  launch_date: string
  latest_episode_date?: string
  view_count: number
  subscriber_count: number
  created_at: string
}

interface Episode {
  id: string
  program_id: string
  program_name: string
  title_ar: string
  description_ar?: string
  episode_number: number
  season_number: number
  duration: number
  video_url?: string
  audio_url?: string
  cover_image_url?: string
  guest_ar?: string
  host_ar: string
  view_count: number
  like_count: number
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  published_at?: string
  created_at: string
}

const mockPrograms: Program[] = [
  {
    id: 'prog-001',
    title_ar: 'حضارة الشرق',
    description_ar: 'سلسلة وثائقية تستكشف حضارات الشرق وتأثيرها على العالم المعاصر',
    type: 'video',
    host_ar: 'محمد الحكيم',
    cover_image_url: '/images/programs/east_civilization.png',
    status: 'active',
    featured: true,
    episode_count: 12,
    duration_avg: 35,
    launch_date: '2024-06-15',
    latest_episode_date: '2025-01-18',
    view_count: 45600,
    subscriber_count: 8900,
    created_at: '2024-06-01T10:00:00Z'
  },
  {
    id: 'prog-002',
    title_ar: 'شمال جنوب',
    description_ar: 'برنامج حواري أسبوعي يناقش القضايا المعاصرة من منظور عربي',
    type: 'audio',
    host_ar: 'فريق زوايا التحريري',
    cover_image_url: '/images/programs/north_south.png',
    status: 'active',
    featured: true,
    episode_count: 24,
    duration_avg: 45,
    launch_date: '2024-03-01',
    latest_episode_date: '2025-01-22',
    view_count: 78300,
    subscriber_count: 15600,
    created_at: '2024-02-15T14:30:00Z'
  }
]

const mockEpisodes: Episode[] = [
  {
    id: 'ep-001',
    program_id: 'prog-002',
    program_name: 'شمال جنوب',
    title_ar: 'الذكاء الاصطناعي والثقافة العربية: تحديات الهوية في العصر الرقمي',
    description_ar: 'حوار معمق حول تأثير الذكاء الاصطناعي على الثقافة والهوية العربية',
    episode_number: 12,
    season_number: 2,
    duration: 3150,
    audio_url: '/audio/ep-001.mp3',
    cover_image_url: '/images/episodes/ai_culture.png',
    guest_ar: 'د. أحمد الخيري - خبير في تقنيات الذكاء الاصطناعي',
    host_ar: 'فريق زوايا التحريري',
    view_count: 6700,
    like_count: 245,
    status: 'published',
    published_at: '2025-01-22T16:00:00Z',
    created_at: '2025-01-20T10:00:00Z'
  },
  {
    id: 'ep-002',
    program_id: 'prog-001',
    program_name: 'حضارة الشرق',
    title_ar: 'نافذة على العالم: اليابان بين التقليد والحداثة',
    description_ar: 'رحلة استكشافية في الثقافة اليابانية المعاصرة وكيف تمكنت من الحفاظ على تراثها',
    episode_number: 5,
    season_number: 2,
    duration: 1815,
    video_url: '/videos/prog-001.mp4',
    cover_image_url: '/images/episodes/japan_culture.png',
    host_ar: 'محمد الحكيم',
    view_count: 15420,
    like_count: 892,
    status: 'published',
    published_at: '2025-01-18T12:00:00Z',
    created_at: '2025-01-16T09:00:00Z'
  }
]

export default function ProgramsManagement() {
  const [programs, setPrograms] = useState<Program[]>(mockPrograms)
  const [episodes, setEpisodes] = useState<Episode[]>(mockEpisodes)
  const [activeTab, setActiveTab] = useState('programs')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}م`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}ك`
    }
    return views.toString()
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    
    const statusLabels = {
      active: 'نشط',
      inactive: 'غير نشط',
      upcoming: 'قادم',
      completed: 'مكتمل',
      published: 'منشور',
      draft: 'مسودة',
      scheduled: 'مجدول',
      archived: 'مؤرشف'
    }

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {statusLabels[status as keyof typeof statusLabels]}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'audio': return <Headphones className="w-4 h-4" />
      default: return <Video className="w-4 h-4" />
    }
  }

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title_ar.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || program.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = episode.title_ar.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || episode.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة البرامج</h1>
            <p className="text-gray-600 mt-2">
              إدارة البرامج المرئية والصوتية والحلقات
            </p>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button variant="outline">
              <Plus className="w-4 h-4 ml-2" />
              حلقة جديدة
            </Button>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              برنامج جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">البرامج النشطة</p>
                  <p className="text-2xl font-bold">{programs.filter(p => p.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">إجمالي الحلقات</p>
                  <p className="text-2xl font-bold">{episodes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">إجمالي المشاهدات</p>
                  <p className="text-2xl font-bold">
                    {formatViews(programs.reduce((sum, p) => sum + p.view_count, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">إجمالي المشتركين</p>
                  <p className="text-2xl font-bold">
                    {formatViews(programs.reduce((sum, p) => sum + p.subscriber_count, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="programs">البرامج</TabsTrigger>
            <TabsTrigger value="episodes">الحلقات</TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="البحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 w-64"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">جميع الحالات</option>
                    {activeTab === 'programs' ? (
                      <>
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                        <option value="upcoming">قادم</option>
                        <option value="completed">مكتمل</option>
                      </>
                    ) : (
                      <>
                        <option value="published">منشور</option>
                        <option value="draft">مسودة</option>
                        <option value="scheduled">مجدول</option>
                        <option value="archived">مؤرشف</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="programs" className="space-y-6">
            <div className="grid gap-6">
              {filteredPrograms.map((program) => (
                <Card key={program.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 space-x-reverse">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {program.cover_image_url ? (
                            <img 
                              src={program.cover_image_url} 
                              alt={program.title_ar}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {getTypeIcon(program.type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <h3 className="text-xl font-bold text-gray-900">{program.title_ar}</h3>
                            {program.featured && <Star className="w-5 h-5 text-yellow-500" />}
                            {getStatusBadge(program.status)}
                            <Badge variant="outline" className="flex items-center space-x-1 space-x-reverse">
                              {getTypeIcon(program.type)}
                              <span>{program.type === 'video' ? 'مرئي' : 'صوتي'}</span>
                            </Badge>
                          </div>
                          <p className="text-gray-600">{program.description_ar}</p>
                          <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-500">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Users className="w-4 h-4" />
                              <span>{program.host_ar}</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Play className="w-4 h-4" />
                              <span>{program.episode_count} حلقة</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Eye className="w-4 h-4" />
                              <span>{formatViews(program.view_count)} مشاهدة</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <TrendingUp className="w-4 h-4" />
                              <span>{formatViews(program.subscriber_count)} مشترك</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Clock className="w-4 h-4" />
                              <span>{program.duration_avg} دقيقة متوسط</span>
                            </div>
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
                            تحرير
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 ml-2" />
                            عرض الحلقات
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Plus className="w-4 h-4 ml-2" />
                            حلقة جديدة
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="episodes" className="space-y-6">
            <div className="grid gap-4">
              {filteredEpisodes.map((episode) => (
                <Card key={episode.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 space-x-reverse">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {episode.cover_image_url ? (
                            <img 
                              src={episode.cover_image_url} 
                              alt={episode.title_ar}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <h3 className="text-lg font-bold text-gray-900">{episode.title_ar}</h3>
                            {getStatusBadge(episode.status)}
                          </div>
                          <p className="text-sm text-gray-600">{episode.program_name} • الموسم {episode.season_number} • الحلقة {episode.episode_number}</p>
                          {episode.description_ar && (
                            <p className="text-gray-600 text-sm">{episode.description_ar}</p>
                          )}
                          <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-500">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Users className="w-4 h-4" />
                              <span>{episode.host_ar}</span>
                            </div>
                            {episode.guest_ar && (
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <span>ضيف: {episode.guest_ar}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Clock className="w-4 h-4" />
                              <span>{formatDuration(episode.duration)}</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Eye className="w-4 h-4" />
                              <span>{formatViews(episode.view_count)} مشاهدة</span>
                            </div>
                            {episode.published_at && (
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(episode.published_at).toLocaleDateString('ar-SA')}</span>
                              </div>
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
                            تحرير
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 ml-2" />
                            معاينة
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 ml-2" />
                            تشغيل
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
} 