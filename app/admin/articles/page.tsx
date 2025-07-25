"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Calendar,
  User,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface Article {
  id: string
  slug: string
  type: string
  featured: boolean
  view_count: number
  created_at: string
  updated_at: string
  author: {
    id: string
    name: string
    avatar_url?: string
  }
  category: {
    id: string
    name_ar: string
    slug: string
  }
  article_translations: {
    title: string
    summary: string
    image_url?: string
  }[]
}

interface Category {
  id: string
  name_ar: string
  slug: string
}

export default function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterAndSortArticles()
  }, [searchTerm, selectedCategory, selectedType, sortBy, sortOrder])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load articles with related data
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select(`
          id,
          slug,
          type,
          featured,
          view_count,
          created_at,
          updated_at,
          author:authors(
            id,
            name,
            avatar_url
          ),
          category:categories(
            id,
            name_ar,
            slug
          ),
          article_translations!inner(
            title,
            summary,
            image_url
          )
        `)
        .eq('article_translations.language_code', 'ar')
        .order('created_at', { ascending: false })

      if (articlesError) {
        console.error('Error loading articles:', articlesError)
        return
      }

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name_ar, slug')
        .order('name_ar')

      if (categoriesError) {
        console.error('Error loading categories:', categoriesError)
        return
      }

      setArticles(articlesData || [])
      setCategories(categoriesData || [])

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortArticles = () => {
    let filtered = articles

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.article_translations[0]?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category.slug === selectedCategory)
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(article => article.type === selectedType)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Article]
      let bValue: any = b[sortBy as keyof Article]

      if (sortBy === 'title') {
        aValue = a.article_translations[0]?.title || ''
        bValue = b.article_translations[0]?.title || ''
      }

      if (sortBy === 'author') {
        aValue = a.author.name
        bValue = b.author.name
      }

      if (sortBy === 'category') {
        aValue = a.category.name_ar
        bValue = b.category.name_ar
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

    return filtered
  }

  const toggleFeatured = async (articleId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ featured: !currentFeatured })
        .eq('id', articleId)

      if (error) {
        console.error('Error updating featured status:', error)
        return
      }

      // Update local state
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, featured: !currentFeatured }
          : article
      ))
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
  }

  const deleteArticle = async (articleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)

      if (error) {
        console.error('Error deleting article:', error)
        return
      }

      // Update local state
      setArticles(prev => prev.filter(article => article.id !== articleId))
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      'article': 'مقال',
      'opinion': 'رأي',
      'analysis': 'تحليل',
      'assessment': 'تقدير موقف'
    }
    return typeLabels[type as keyof typeof typeLabels] || type
  }

  const getTypeBadgeVariant = (type: string) => {
    const variants = {
      'article': 'default' as const,
      'opinion': 'secondary' as const,
      'analysis': 'outline' as const,
      'assessment': 'destructive' as const
    }
    return variants[type as keyof typeof variants] || 'default' as const
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredArticles = filterAndSortArticles()

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold font-ge-ss">إدارة المقالات</h1>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-ge-ss">إدارة المقالات</h1>
            <p className="text-gray-600 font-ge-ss">
              إجمالي المقالات: {articles.length} | المعروضة: {filteredArticles.length}
            </p>
          </div>
          <Link href="/admin/articles/new">
            <Button className="font-ge-ss">
              <Plus className="mr-2 h-4 w-4" />
              إضافة مقال جديد
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="font-ge-ss">البحث والتصفية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في العناوين والكُتّاب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 font-ge-ss"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="font-ge-ss">
                  <SelectValue placeholder="جميع التصنيفات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="font-ge-ss">
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="article">مقال</SelectItem>
                  <SelectItem value="opinion">رأي</SelectItem>
                  <SelectItem value="analysis">تحليل</SelectItem>
                  <SelectItem value="assessment">تقدير موقف</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="font-ge-ss">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">تاريخ الإنشاء</SelectItem>
                  <SelectItem value="updated_at">تاريخ التحديث</SelectItem>
                  <SelectItem value="view_count">عدد المشاهدات</SelectItem>
                  <SelectItem value="title">العنوان</SelectItem>
                  <SelectItem value="author">الكاتب</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start space-x-4 space-x-reverse">
                        {/* Article image */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            {article.article_translations[0]?.image_url ? (
                              <img 
                                src={article.article_translations[0].image_url} 
                                alt={article.article_translations[0].title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Article details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 space-x-reverse mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate font-ge-ss">
                              {article.article_translations[0]?.title || 'بدون عنوان'}
                            </h3>
                            {article.featured && (
                              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2 font-ge-ss mb-3">
                            {article.article_translations[0]?.summary || 'بدون ملخص'}
                          </p>

                          <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <User className="h-4 w-4" />
                              <span className="font-ge-ss">{article.author.name}</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(article.created_at)}</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Eye className="h-4 w-4" />
                              <span>{article.view_count.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Badge variant={getTypeBadgeVariant(article.type)}>
                          {getTypeLabel(article.type)}
                        </Badge>
                        <Badge variant="outline">
                          {article.category.name_ar}
                        </Badge>
                        {article.featured && (
                          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                            مميز
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Link href={`/ar/articles/${article.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem>
                            <Link href={`/admin/articles/edit/${article.id}`} className="flex items-center w-full">
                              <Edit className="mr-2 h-4 w-4" />
                              تعديل
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => toggleFeatured(article.id, article.featured)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            {article.featured ? 'إلغاء التمييز' : 'جعله مميز'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteArticle(article.id)}
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
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-ge-ss">
                  لا توجد مقالات
                </h3>
                <p className="text-gray-600 mb-4 font-ge-ss">
                  {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
                    ? 'لم يتم العثور على مقالات تطابق معايير البحث'
                    : 'لم يتم إنشاء أي مقالات بعد'
                  }
                </p>
                <Link href="/admin/articles/new">
                  <Button className="font-ge-ss">
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة مقال جديد
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
} 