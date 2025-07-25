"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  Image, 
  Video, 
  Music, 
  File, 
  Search, 
  Filter, 
  Download,
  Trash2,
  Eye,
  Copy,
  MoreHorizontal,
  FolderPlus,
  Grid3X3,
  List
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  size: number
  created_at: string
  folder?: string
  alt_text?: string
  width?: number
  height?: number
  duration?: number
}

const mockMediaFiles: MediaFile[] = [
  {
    id: '1',
    name: 'post_rentier.png',
    type: 'image',
    url: '/images/articles/post_rentier.png',
    size: 245760,
    created_at: '2025-01-20T10:00:00Z',
    folder: 'articles',
    alt_text: 'ما بعد الريع - مقال اقتصادي',
    width: 1200,
    height: 630
  },
  {
    id: '2',
    name: 'soft_power.png',
    type: 'image',
    url: '/images/articles/soft_power.png',
    size: 198432,
    created_at: '2025-01-18T14:30:00Z',
    folder: 'articles',
    alt_text: 'القوة الناعمة والدبلوماسية',
    width: 1200,
    height: 630
  },
  {
    id: '3',
    name: 'ai_culture_episode.mp3',
    type: 'audio',
    url: '/audio/ep-001.mp3',
    size: 45678123,
    created_at: '2025-01-22T16:00:00Z',
    folder: 'podcasts',
    duration: 3150
  },
  {
    id: '4',
    name: 'japan_culture_video.mp4',
    type: 'video',
    url: '/videos/prog-001.mp4',
    size: 125678912,
    created_at: '2025-01-18T12:00:00Z',
    folder: 'programs',
    duration: 1815
  }
]

export default function MediaManagement() {
  const [files, setFiles] = useState<MediaFile[]>(mockMediaFiles)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />
      case 'video': return <Video className="w-5 h-5" />
      case 'audio': return <Music className="w-5 h-5" />
      default: return <File className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-green-100 text-green-800'
      case 'video': return 'bg-blue-100 text-blue-800'
      case 'audio': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || file.type === selectedType
    return matchesSearch && matchesType
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (uploadedFiles) {
      // Handle file upload logic here
      console.log('Files to upload:', uploadedFiles)
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    // Show toast notification
  }

  const deleteFiles = (fileIds: string[]) => {
    setFiles(prev => prev.filter(file => !fileIds.includes(file.id)))
    setSelectedFiles([])
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الملفات</h1>
            <p className="text-gray-600 mt-2">
              رفع وإدارة الصور والفيديوهات والملفات الصوتية
            </p>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="cursor-pointer">
                <Upload className="w-4 h-4 ml-2" />
                رفع ملفات
              </Button>
            </label>
            <Button variant="outline">
              <FolderPlus className="w-4 h-4 ml-2" />
              مجلد جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Image className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">الصور</p>
                  <p className="text-2xl font-bold">{files.filter(f => f.type === 'image').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">الفيديوهات</p>
                  <p className="text-2xl font-bold">{files.filter(f => f.type === 'video').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Music className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">الملفات الصوتية</p>
                  <p className="text-2xl font-bold">{files.filter(f => f.type === 'audio').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <File className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">إجمالي الملفات</p>
                  <p className="text-2xl font-bold">{files.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في الملفات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 w-64"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="image">الصور</option>
                  <option value="video">الفيديوهات</option>
                  <option value="audio">الملفات الصوتية</option>
                  <option value="document">المستندات</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                {selectedFiles.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteFiles(selectedFiles)}
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف ({selectedFiles.length})
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files Grid/List */}
        <Card>
          <CardContent className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="group relative border rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {file.type === 'image' ? (
                        <img src={file.url} alt={file.alt_text || file.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`p-4 rounded-lg ${getTypeColor(file.type)}`}>
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      {file.duration && (
                        <p className="text-xs text-gray-500">{formatDuration(file.duration)}</p>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => copyUrl(file.url)}>
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ الرابط
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 ml-2" />
                            معاينة
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 ml-2" />
                            تحميل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteFiles([file.id])} className="text-red-600">
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className={`p-2 rounded ${getTypeColor(file.type)}`}>
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                          {file.duration && ` • ${formatDuration(file.duration)}`}
                          {file.width && file.height && ` • ${file.width}×${file.height}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Badge className={getTypeColor(file.type)}>{file.type}</Badge>
                      <p className="text-sm text-gray-500">
                        {new Date(file.created_at).toLocaleDateString('ar-SA')}
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => copyUrl(file.url)}>
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ الرابط
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 ml-2" />
                            معاينة
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 ml-2" />
                            تحميل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteFiles([file.id])} className="text-red-600">
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
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
      </div>
    </AdminLayout>
  )
} 