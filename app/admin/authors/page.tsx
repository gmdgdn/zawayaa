"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star,
  Calendar,
  FileText,
  Mail,
  Shield,
  User,
  MoreHorizontal,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface Author {
  id: string
  name: string
  email: string
  bio_ar?: string
  bio_en?: string
  avatar_url?: string
  role: 'admin' | 'editor' | 'author'
  is_verified: boolean
  is_featured: boolean
  article_count: number
  social_twitter?: string
  social_facebook?: string
  social_instagram?: string
  social_linkedin?: string
  website_url?: string
  location_ar?: string
  location_en?: string
  expertise_tags?: string[]
  created_at: string
  updated_at: string
}

interface AuthorFormData {
  name: string
  email: string
  bio_ar: string
  bio_en: string
  role: 'admin' | 'editor' | 'author'
  location_ar: string
  location_en: string
  website_url: string
  social_twitter: string
  social_facebook: string
  social_instagram: string
  social_linkedin: string
  expertise_tags: string
}

export default function AuthorsManagement() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState<AuthorFormData>({
    name: '',
    email: '',
    bio_ar: '',
    bio_en: '',
    role: 'author',
    location_ar: '',
    location_en: '',
    website_url: '',
    social_twitter: '',
    social_facebook: '',
    social_instagram: '',
    social_linkedin: '',
    expertise_tags: ''
  })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadAuthors()
  }, [])

  const loadAuthors = async () => {
    try {
      setLoading(true)
      
      const { data: authorsData, error } = await supabase
        .from('authors')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading authors:', error)
        return
      }

      setAuthors(authorsData || [])
    } catch (error) {
      console.error('Error loading authors:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAuthorRole = async (authorId: string, newRole: Author['role']) => {
    try {
      setActionLoading(true)
      
      const { error } = await supabase
        .from('authors')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', authorId)

      if (error) {
        console.error('Error updating author role:', error)
        return
      }

      // Update local state
      setAuthors(prev => prev.map(author => 
        author.id === authorId 
          ? { ...author, role: newRole }
          : author
      ))
    } catch (error) {
      console.error('Error updating author role:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const toggleAuthorStatus = async (authorId: string, field: 'is_verified' | 'is_featured', currentValue: boolean) => {
    try {
      setActionLoading(true)
      
      const { error } = await supabase
        .from('authors')
        .update({ [field]: !currentValue, updated_at: new Date().toISOString() })
        .eq('id', authorId)

      if (error) {
        console.error(`Error updating author ${field}:`, error)
        return
      }

      // Update local state
      setAuthors(prev => prev.map(author => 
        author.id === authorId 
          ? { ...author, [field]: !currentValue }
          : author
      ))
    } catch (error) {
      console.error(`Error updating author ${field}:`, error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveAuthor = async (isEdit: boolean = false) => {
    try {
      setActionLoading(true)

      const authorData = {
        name_ar: formData.name,
        name_en: formData.name,
        email: formData.email,
        bio_ar: formData.bio_ar,
        bio_en: formData.bio_en,
        role: formData.role,
        location_ar: formData.location_ar,
        location_en: formData.location_en,
        website_url: formData.website_url,
        social_twitter: formData.social_twitter,
        social_facebook: formData.social_facebook,
        social_instagram: formData.social_instagram,
        social_linkedin: formData.social_linkedin,
        expertise_tags: formData.expertise_tags ? formData.expertise_tags.split(',').map(t => t.trim()) : [],
        updated_at: new Date().toISOString()
      }

      if (isEdit && editingAuthor) {
        const { error } = await supabase
          .from('authors')
          .update(authorData)
          .eq('id', editingAuthor.id)

        if (error) {
          console.error('Error updating author:', error)
          return
        }
      } else {
        const { error } = await supabase
          .from('authors')
          .insert({
            ...authorData,
            created_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error creating author:', error)
          return
        }
      }

      // Reset form and reload data
      setFormData({
        name: '',
        email: '',
        bio_ar: '',
        bio_en: '',
        role: 'author',
        location_ar: '',
        location_en: '',
        website_url: '',
        social_twitter: '',
        social_facebook: '',
        social_instagram: '',
        social_linkedin: '',
        expertise_tags: ''
      })
      setEditingAuthor(null)
      setShowAddDialog(false)
      await loadAuthors()
    } catch (error) {
      console.error('Error saving author:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditAuthor = (author: Author) => {
    setFormData({
      name: author.name || '',
      email: author.email || '',
      bio_ar: author.bio_ar || '',
      bio_en: author.bio_en || '',
      role: author.role,
      location_ar: author.location_ar || '',
      location_en: author.location_en || '',
      website_url: author.website_url || '',
      social_twitter: author.social_twitter || '',
      social_facebook: author.social_facebook || '',
      social_instagram: author.social_instagram || '',
      social_linkedin: author.social_linkedin || '',
      expertise_tags: author.expertise_tags?.join(', ') || ''
    })
    setEditingAuthor(author)
  }

  const deleteAuthor = async (authorId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكاتب؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return
    }

    try {
      setActionLoading(true)
      
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', authorId)

      if (error) {
        console.error('Error deleting author:', error)
        return
      }

      // Update local state
      setAuthors(prev => prev.filter(author => author.id !== authorId))
    } catch (error) {
      console.error('Error deleting author:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getRoleBadge = (role: Author['role']) => {
    const roleConfig = {
      admin: { label: 'مدير', variant: 'destructive' as const, icon: Shield },
      editor: { label: 'محرر', variant: 'default' as const, icon: Edit },
      author: { label: 'كاتب', variant: 'secondary' as const, icon: User }
    }
    
    const config = roleConfig[role]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1 space-x-reverse">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    )
  }

  const filteredAuthors = authors.filter(author => {
    const matchesSearch = !searchTerm || 
      author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === 'all' || author.role === selectedRole
    
    return matchesSearch && matchesRole
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '')
    }
    if (sortBy === 'article_count') {
      return (b.article_count || 0) - (a.article_count || 0)
    }
    if (sortBy === 'role') {
      return a.role.localeCompare(b.role)
    }
    // Default: created_at
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold font-ge-ss">إدارة الكُتّاب</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
            <h1 className="text-2xl font-bold font-ge-ss">إدارة الكُتّاب</h1>
            <p className="text-gray-600 font-ge-ss">
              إجمالي الكُتّاب: {authors.length} | المعروضة: {filteredAuthors.length}
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="font-ge-ss">
                <Plus className="mr-2 h-4 w-4" />
                إضافة كاتب جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle className="font-ge-ss">
                  {editingAuthor ? 'تعديل الكاتب' : 'إضافة كاتب جديد'}
                </DialogTitle>
                <DialogDescription className="font-ge-ss">
                  {editingAuthor ? 'تعديل معلومات الكاتب' : 'إضافة كاتب جديد إلى المنصة'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="font-ge-ss">الاسم</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="اسم الكاتب"
                      className="font-ge-ss"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="font-ge-ss">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      className="font-ge-ss"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role" className="font-ge-ss">الدور</Label>
                  <Select value={formData.role} onValueChange={(value: Author['role']) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger className="font-ge-ss">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="author">كاتب</SelectItem>
                      <SelectItem value="editor">محرر</SelectItem>
                      <SelectItem value="admin">مدير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bio_ar" className="font-ge-ss">النبذة (عربي)</Label>
                  <Textarea
                    id="bio_ar"
                    value={formData.bio_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio_ar: e.target.value }))}
                    placeholder="نبذة عن الكاتب باللغة العربية"
                    className="font-ge-ss"
                  />
                </div>

                <div>
                  <Label htmlFor="bio_en" className="font-ge-ss">النبذة (إنجليزي)</Label>
                  <Textarea
                    id="bio_en"
                    value={formData.bio_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio_en: e.target.value }))}
                    placeholder="Author bio in English"
                    className="font-ge-ss"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location_ar" className="font-ge-ss">الموقع (عربي)</Label>
                    <Input
                      id="location_ar"
                      value={formData.location_ar}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_ar: e.target.value }))}
                      placeholder="الرياض، السعودية"
                      className="font-ge-ss"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_url" className="font-ge-ss">الموقع الإلكتروني</Label>
                    <Input
                      id="website_url"
                      value={formData.website_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                      placeholder="https://example.com"
                      className="font-ge-ss"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="expertise_tags" className="font-ge-ss">مجالات الخبرة</Label>
                  <Input
                    id="expertise_tags"
                    value={formData.expertise_tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, expertise_tags: e.target.value }))}
                    placeholder="سياسة، اقتصاد، ثقافة (مفصولة بفواصل)"
                    className="font-ge-ss"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="social_twitter" className="font-ge-ss">تويتر</Label>
                    <Input
                      id="social_twitter"
                      value={formData.social_twitter}
                      onChange={(e) => setFormData(prev => ({ ...prev, social_twitter: e.target.value }))}
                      placeholder="@username"
                      className="font-ge-ss"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="social_linkedin" className="font-ge-ss">لينكد إن</Label>
                    <Input
                      id="social_linkedin"
                      value={formData.social_linkedin}
                      onChange={(e) => setFormData(prev => ({ ...prev, social_linkedin: e.target.value }))}
                      placeholder="linkedin.com/in/username"
                      className="font-ge-ss"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddDialog(false)
                      setEditingAuthor(null)
                      setFormData({
                        name: '',
                        email: '',
                        bio_ar: '',
                        bio_en: '',
                        role: 'author',
                        location_ar: '',
                        location_en: '',
                        website_url: '',
                        social_twitter: '',
                        social_facebook: '',
                        social_instagram: '',
                        social_linkedin: '',
                        expertise_tags: ''
                      })
                    }}
                    disabled={actionLoading}
                    className="font-ge-ss"
                  >
                    إلغاء
                  </Button>
                  <Button 
                    onClick={() => handleSaveAuthor(!!editingAuthor)}
                    disabled={actionLoading || !formData.name || !formData.email}
                    className="font-ge-ss"
                  >
                    {actionLoading ? 'جاري الحفظ...' : (editingAuthor ? 'تحديث' : 'إضافة')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
                  placeholder="البحث في الأسماء والبريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 font-ge-ss"
                />
              </div>

              {/* Role Filter */}
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="font-ge-ss">
                  <SelectValue placeholder="جميع الأدوار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="editor">محرر</SelectItem>
                  <SelectItem value="author">كاتب</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="font-ge-ss">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">تاريخ الانضمام</SelectItem>
                  <SelectItem value="name">الاسم</SelectItem>
                  <SelectItem value="article_count">عدد المقالات</SelectItem>
                  <SelectItem value="role">الدور</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Authors List */}
        <div className="space-y-4">
          {filteredAuthors.length > 0 ? (
            filteredAuthors.map((author) => (
              <Card key={author.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 space-x-reverse flex-1">
                      {/* Avatar */}
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={author.avatar_url} alt={author.name} />
                        <AvatarFallback className="text-lg font-ge-ss">
                          {author.name?.charAt(0) || '؟'}
                        </AvatarFallback>
                      </Avatar>

                      {/* Author Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 space-x-reverse mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 font-ge-ss">
                                {author.name || 'بدون اسم'}
                              </h3>
                              {author.is_verified && (
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                              )}
                              {author.is_featured && (
                                <Star className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-600 mb-2">
                              <Mail className="h-4 w-4" />
                              <span dir="ltr">{author.email}</span>
                            </div>

                            {author.bio_ar && (
                              <p className="text-sm text-gray-600 line-clamp-2 font-ge-ss mb-2">
                                {author.bio_ar}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <FileText className="h-4 w-4" />
                            <span className="font-ge-ss">{author.article_count || 0} مقال</span>
                          </div>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Calendar className="h-4 w-4" />
                            <span>انضم {formatDate(author.created_at)}</span>
                          </div>
                          {author.location_ar && (
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <span className="font-ge-ss">{author.location_ar}</span>
                            </div>
                          )}
                        </div>

                        {/* Badges and Tags */}
                        <div className="flex items-center space-x-2 space-x-reverse flex-wrap">
                          {getRoleBadge(author.role)}
                          {author.is_verified && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              موثق
                            </Badge>
                          )}
                          {author.is_featured && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              مميز
                            </Badge>
                          )}
                          {author.expertise_tags && author.expertise_tags.length > 0 && (
                            <div className="flex items-center space-x-1 space-x-reverse">
                              {author.expertise_tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {author.expertise_tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{author.expertise_tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {author.website_url && (
                        <Link href={author.website_url} target="_blank">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => handleEditAuthor(author)}>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل المعلومات
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => toggleAuthorStatus(author.id, 'is_verified', author.is_verified)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {author.is_verified ? 'إلغاء التوثيق' : 'توثيق الحساب'}
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => toggleAuthorStatus(author.id, 'is_featured', author.is_featured)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            {author.is_featured ? 'إلغاء التمييز' : 'جعله مميز'}
                          </DropdownMenuItem>

                          {author.role !== 'admin' && (
                            <DropdownMenuItem 
                              onClick={() => updateAuthorRole(author.id, 'admin')}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              ترقية إلى مدير
                            </DropdownMenuItem>
                          )}

                          {author.role !== 'editor' && (
                            <DropdownMenuItem 
                              onClick={() => updateAuthorRole(author.id, 'editor')}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              جعله محرر
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem 
                            onClick={() => deleteAuthor(author.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-ge-ss">
                  لا توجد كُتّاب
                </h3>
                <p className="text-gray-600 mb-4 font-ge-ss">
                  {searchTerm || selectedRole !== 'all'
                    ? 'لم يتم العثور على كُتّاب يطابقون معايير البحث'
                    : 'لم يتم إضافة أي كُتّاب بعد'
                  }
                </p>
                <Button onClick={() => setShowAddDialog(true)} className="font-ge-ss">
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة كاتب جديد
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
} 