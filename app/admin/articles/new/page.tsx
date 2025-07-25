"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/admin-layout'
import RichTextEditor from '@/components/editor/rich-text-editor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload, 
  Calendar, 
  FileText,
  Globe,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name_ar: string
  slug: string
}

interface Author {
  id: string
  name: string
}

interface ArticleFormData {
  titleAr: string
  titleEn: string
  summaryAr: string
  summaryEn: string
  contentAr: string
  contentEn: string
  categoryId: string
  authorId: string
  type: string
  featured: boolean
  featuredImageUrl: string
  publishedAt: string
  tags: string[]
  readTimeMinutes: number
}

export default function NewArticle() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<ArticleFormData>({
    titleAr: '',
    titleEn: '',
    summaryAr: '',
    summaryEn: '',
    contentAr: '',
    contentEn: '',
    categoryId: '',
    authorId: '',
    type: 'article',
    featured: false,
    featuredImageUrl: '',
    publishedAt: '',
    tags: [],
    readTimeMinutes: 5
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentTab, setCurrentTab] = useState('arabic')

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name_ar, slug')
        .order('name_ar')

      if (categoriesError) {
        console.error('Error loading categories:', categoriesError)
        return
      }

      // Load authors
      const { data: authorsData, error: authorsError } = await supabase
        .from('authors')
        .select('id, name')
        .order('name')

      if (authorsError) {
        console.error('Error loading authors:', authorsError)
        return
      }

      setCategories(categoriesData || [])
      setAuthors(authorsData || [])

      // Set default publish date to now
      setFormData(prev => ({
        ...prev,
        publishedAt: new Date().toISOString().slice(0, 16)
      }))

    } catch (error) {
      console.error('Error loading initial data:', error)
      setError('حدث خطأ أثناء تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const calculateReadTime = (content: string) => {
    // Remove HTML tags for word count
    const text = content.replace(/<[^>]*>/g, '')
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
    // Average reading speed: 200 words per minute for Arabic
    const readTime = Math.max(1, Math.ceil(wordCount / 200))
    return readTime
  }

  const handleContentChange = (content: string, language: 'ar' | 'en') => {
    if (language === 'ar') {
      setFormData(prev => ({
        ...prev,
        contentAr: content,
        readTimeMinutes: calculateReadTime(content)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        contentEn: content
      }))
    }
  }

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setFormData(prev => ({ ...prev, tags }))
  }

  const validateForm = () => {
    if (!formData.titleAr.trim()) {
      setError('العنوان باللغة العربية مطلوب')
      return false
    }
    if (!formData.summaryAr.trim()) {
      setError('الملخص باللغة العربية مطلوب')
      return false
    }
    if (!formData.contentAr.trim()) {
      setError('المحتوى باللغة العربية مطلوب')
      return false
    }
    if (!formData.categoryId) {
      setError('يرجى اختيار التصنيف')
      return false
    }
    if (!formData.authorId) {
      setError('يرجى اختيار الكاتب')
      return false
    }
    return true
  }

  const saveArticle = async (status: 'draft' | 'published') => {
    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      setError('')

      // Create article slug from Arabic title
      const slug = formData.titleAr
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\w\s-]/g, '') // Keep Arabic characters, letters, numbers, spaces, hyphens
        .replace(/\s+/g, '-')
        .trim()

      const articleData = {
        slug,
        type: formData.type,
        category_id: formData.categoryId,
        author_id: formData.authorId,
        featured_image_url: formData.featuredImageUrl || null,
        status,
        is_featured: formData.featured,
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        read_time_minutes: formData.readTimeMinutes,
        published_at: status === 'published' ? formData.publishedAt : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Insert article
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single()

      if (articleError) {
        console.error('Error creating article:', articleError)
        setError('حدث خطأ أثناء حفظ المقال')
        return
      }

      // Insert Arabic translation
      const arTranslation = {
        article_id: article.id,
        language: 'ar',
        title: formData.titleAr,
        subtitle: '',
        content: formData.contentAr,
        excerpt: formData.summaryAr,
        seo_title: formData.titleAr,
        seo_description: formData.summaryAr,
        tags: formData.tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: arTranslationError } = await supabase
        .from('article_translations')
        .insert(arTranslation)

      if (arTranslationError) {
        console.error('Error creating Arabic translation:', arTranslationError)
        setError('حدث خطأ أثناء حفظ النسخة العربية')
        return
      }

      // Insert English translation if provided
      if (formData.titleEn || formData.contentEn) {
        const enTranslation = {
          article_id: article.id,
          language: 'en',
          title: formData.titleEn || formData.titleAr,
          subtitle: '',
          content: formData.contentEn || formData.contentAr,
          excerpt: formData.summaryEn || formData.summaryAr,
          seo_title: formData.titleEn || formData.titleAr,
          seo_description: formData.summaryEn || formData.summaryAr,
          tags: formData.tags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: enTranslationError } = await supabase
          .from('article_translations')
          .insert(enTranslation)

        if (enTranslationError) {
          console.error('Error creating English translation:', enTranslationError)
          // Don't fail the entire operation for English translation
        }
      }

      setSuccess(`تم ${status === 'published' ? 'نشر' : 'حفظ'} المقال بنجاح!`)
      
      // Redirect to articles list after a delay
      setTimeout(() => {
        router.push('/admin/articles')
      }, 2000)

    } catch (error) {
      console.error('Error saving article:', error)
      setError('حدث خطأ أثناء حفظ المقال')
    } finally {
      setSaving(false)
    }
  }

  const previewArticle = () => {
    // In a real implementation, this would open a preview modal or page
    console.log('Preview article:', formData)
    alert('معاينة المقال - سيتم تنفيذها قريباً')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-ge-ss">جاري تحميل البيانات...</h1>
          </div>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/admin/articles">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                العودة للمقالات
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-ge-ss">إنشاء مقال جديد</h1>
              <p className="text-gray-600 font-ge-ss">أنشئ مقالاً جديداً بمحرر النصوص المتقدم</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button variant="outline" onClick={previewArticle} disabled={saving}>
              <Eye className="mr-2 h-4 w-4" />
              معاينة
            </Button>
            <Button 
              variant="outline" 
              onClick={() => saveArticle('draft')} 
              disabled={saving}
              className="font-ge-ss"
            >
              حفظ كمسودة
            </Button>
            <Button 
              onClick={() => saveArticle('published')} 
              disabled={saving}
              className="font-ge-ss"
            >
              {saving ? 'جاري النشر...' : 'نشر المقال'}
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-ge-ss">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="font-ge-ss text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Article Content */}
            <Card>
              <CardHeader>
                <CardTitle className="font-ge-ss">محتوى المقال</CardTitle>
                <CardDescription className="font-ge-ss">
                  اكتب محتوى المقال باللغة العربية والإنجليزية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="arabic" className="font-ge-ss">العربية</TabsTrigger>
                    <TabsTrigger value="english" className="font-ge-ss">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="arabic" className="space-y-4">
                    <div>
                      <Label htmlFor="title-ar" className="font-ge-ss">العنوان *</Label>
                      <Input
                        id="title-ar"
                        value={formData.titleAr}
                        onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                        placeholder="عنوان المقال باللغة العربية"
                        className="font-ge-ss"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="summary-ar" className="font-ge-ss">الملخص *</Label>
                      <Textarea
                        id="summary-ar"
                        value={formData.summaryAr}
                        onChange={(e) => setFormData(prev => ({ ...prev, summaryAr: e.target.value }))}
                        placeholder="ملخص المقال باللغة العربية"
                        className="font-ge-ss"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label className="font-ge-ss">المحتوى *</Label>
                      <RichTextEditor
                        content={formData.contentAr}
                        onChange={(content) => handleContentChange(content, 'ar')}
                        placeholder="اكتب محتوى المقال هنا..."
                        direction="rtl"
                        minHeight="400px"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="english" className="space-y-4">
                    <div>
                      <Label htmlFor="title-en" className="font-ge-ss">Title (English)</Label>
                      <Input
                        id="title-en"
                        value={formData.titleEn}
                        onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                        placeholder="Article title in English"
                        dir="ltr"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="summary-en" className="font-ge-ss">Summary (English)</Label>
                      <Textarea
                        id="summary-en"
                        value={formData.summaryEn}
                        onChange={(e) => setFormData(prev => ({ ...prev, summaryEn: e.target.value }))}
                        placeholder="Article summary in English"
                        rows={3}
                        dir="ltr"
                      />
                    </div>
                    
                    <div>
                      <Label className="font-ge-ss">Content (English)</Label>
                      <RichTextEditor
                        content={formData.contentEn}
                        onChange={(content) => handleContentChange(content, 'en')}
                        placeholder="Write article content here..."
                        direction="ltr"
                        minHeight="400px"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="font-ge-ss">إعدادات المقال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category" className="font-ge-ss">التصنيف *</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="author" className="font-ge-ss">الكاتب *</Label>
                  <Select value={formData.authorId} onValueChange={(value) => setFormData(prev => ({ ...prev, authorId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الكاتب" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map(author => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type" className="font-ge-ss">نوع المقال</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">مقال</SelectItem>
                      <SelectItem value="opinion">رأي</SelectItem>
                      <SelectItem value="analysis">تحليل</SelectItem>
                      <SelectItem value="assessment">تقدير موقف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="published-at" className="font-ge-ss">تاريخ النشر</Label>
                  <Input
                    id="published-at"
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured" className="font-ge-ss">مقال مميز</Label>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className="font-ge-ss">الصورة المميزة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image-url" className="font-ge-ss">رابط الصورة</Label>
                  <Input
                    id="image-url"
                    value={formData.featuredImageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    dir="ltr"
                  />
                </div>
                {formData.featuredImageUrl && (
                  <div className="border rounded-lg p-2">
                    <img 
                      src={formData.featuredImageUrl} 
                      alt="معاينة الصورة" 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <Button variant="outline" className="w-full font-ge-ss">
                  <Upload className="mr-2 h-4 w-4" />
                  رفع صورة
                </Button>
              </CardContent>
            </Card>

            {/* Article Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="font-ge-ss">إحصائيات المقال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-ge-ss">وقت القراءة المتوقع</span>
                  <span className="text-sm font-bold">{formData.readTimeMinutes} دقيقة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-ge-ss">عدد الكلمات (عربي)</span>
                  <span className="text-sm">{formData.contentAr.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-ge-ss">عدد الأحرف (عربي)</span>
                  <span className="text-sm">{formData.contentAr.replace(/<[^>]*>/g, '').length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="font-ge-ss">الكلمات المفتاحية</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="tags" className="font-ge-ss">الكلمات المفتاحية</Label>
                  <Input
                    id="tags"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="سياسة، اقتصاد، ثقافة (مفصولة بفواصل)"
                    className="font-ge-ss"
                  />
                  <p className="text-xs text-gray-500 mt-1 font-ge-ss">
                    افصل الكلمات المفتاحية بفواصل
                  </p>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="bg-zawaya-primary/10 text-zawaya-primary px-2 py-1 rounded text-sm font-ge-ss">
                        {tag}
                      </span>
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