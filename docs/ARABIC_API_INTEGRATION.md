# 🔌 دليل تكامل واجهات برمجة التطبيقات العربية | Arabic API Integration Guide

## 📋 فهرس المحتويات | Table of Contents

- [🚀 نظرة عامة | Overview](#overview)
- [🔐 المصادقة والتفويض | Authentication & Authorization](#auth)
- [📝 واجهات المحتوى العربي | Arabic Content APIs](#content-apis)
- [🔍 واجهات البحث العربي | Arabic Search APIs](#search-apis)
- [🎵 واجهات الوسائط الصوتية | Audio Media APIs](#audio-apis)
- [📧 واجهات التفاعل | Engagement APIs](#engagement-apis)
- [🛠️ أمثلة التكامل | Integration Examples](#examples)

---

## 🚀 نظرة عامة | Overview {#overview}

### عنوان الخدمة الأساسي | Base Service URL
```
Production:  https://zawayaa.vercel.app/api
Development: http://localhost:3000/api
```

### تنسيق الاستجابة | Response Format
جميع واجهات برمجة التطبيقات ترجع استجابات JSON بالتنسيق التالي:

```json
{
  "success": true,
  "data": { ... },
  "message": "رسالة النجاح",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### معالجة الأخطاء | Error Handling
```json
{
  "success": false,
  "error": "رسالة الخطأ",
  "details": "تفاصيل تقنية إضافية",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-25T12:00:00Z"
}
```

---

## 🔐 المصادقة والتفويض | Authentication & Authorization {#auth}

### أنواع المصادقة | Authentication Types

#### 1. JWT Token Authentication
```http
Authorization: Bearer <jwt_token>
```

#### 2. API Key Authentication (للخوادم فقط)
```http
X-API-Key: <service_role_key>
```

### الأدوار والصلاحيات | Roles & Permissions

| الدور | الصلاحيات |
|-------|-----------|
| `super_admin` | وصول كامل للمنصة |
| `admin` | العمليات الإدارية |
| `editor` | تحرير ونشر المحتوى |
| `writer` | إنشاء المحتوى |
| `contributor` | إنشاء محدود للمحتوى |

### مثال على المصادقة | Authentication Example
```typescript
// تسجيل الدخول
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// استخدام الرمز المميز
const response = await fetch('/api/articles', {
  headers: {
    'Authorization': `Bearer ${data.session.access_token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## 📝 واجهات المحتوى العربي | Arabic Content APIs {#content-apis}

### المقالات العربية | Arabic Articles

#### `GET /api/articles` - جلب المقالات
```typescript
interface ArticlesQuery {
  page?: number          // رقم الصفحة (افتراضي: 1)
  limit?: number         // عدد العناصر (افتراضي: 10، أقصى: 100)
  category?: string      // تصفية حسب الفئة
  author?: string        // تصفية حسب الكاتب
  featured?: boolean     // المقالات المميزة فقط
  status?: 'published' | 'draft' | 'archived'
  sort?: 'newest' | 'oldest' | 'popular' | 'title'
  search?: string        // البحث في العنوان والمحتوى
}

// مثال على الاستخدام
const articles = await fetch('/api/articles?' + new URLSearchParams({
  category: 'politics',
  featured: 'true',
  limit: '5',
  sort: 'newest'
}))
```

#### `GET /api/articles/[id]` - جلب مقال محدد
```typescript
interface ArticleResponse {
  id: string
  title_ar: string
  title_en?: string
  summary_ar: string
  content_ar: string
  author: {
    id: string
    name_ar: string
    bio_ar: string
    avatar_url?: string
  }
  category: {
    id: string
    name_ar: string
    slug: string
    color: string
  }
  audio_url?: string
  audio_duration?: number
  published_at: string
  view_count: number
  like_count: number
  share_count: number
  tags: string[]
  related_articles: ArticleSummary[]
}

// مثال على الاستخدام
const article = await fetch('/api/articles/article-001')
  .then(res => res.json())
```

#### `POST /api/articles` - إنشاء مقال جديد 🔐
```typescript
interface CreateArticleRequest {
  title_ar: string
  title_en?: string
  summary_ar: string
  content_ar: string
  category_id: string
  author_id: string
  featured?: boolean
  tags?: string[]
  publish_at?: string
  generate_audio?: boolean
}

// مثال على الاستخدام
const newArticle = await fetch('/api/articles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title_ar: 'عنوان المقال الجديد',
    summary_ar: 'ملخص المقال',
    content_ar: 'محتوى المقال الكامل...',
    category_id: 'politics',
    author_id: 'author-001',
    featured: false,
    tags: ['سياسة', 'تحليل'],
    generate_audio: true
  })
})
```

### البرامج والحلقات | Programs & Episodes

#### `GET /api/programs` - جلب البرامج
```typescript
interface ProgramsQuery {
  format?: 'video' | 'audio' | 'both'
  featured?: boolean
  category?: string
  page?: number
  limit?: number
}

interface ProgramResponse {
  id: string
  title_ar: string
  description_ar: string
  format: 'video' | 'audio' | 'both'
  host_ar: string
  cover_image: string
  episode_count: number
  total_duration: number
  schedule?: string
  latest_episode: {
    id: string
    title_ar: string
    episode_number: number
    published_at: string
  }
}
```

#### `GET /api/programs/[id]/episodes` - جلب حلقات برنامج
```typescript
interface EpisodeResponse {
  id: string
  program_id: string
  title_ar: string
  description_ar: string
  episode_number: number
  season_number: number
  video_url?: string
  audio_url?: string
  duration: number
  guest_name?: string
  show_notes?: string
  published_at: string
  view_count: number
}

// مثال على الاستخدام
const episodes = await fetch('/api/programs/prog-001/episodes')
  .then(res => res.json())
```

### الكتّاب والمؤلفون | Authors

#### `GET /api/authors` - جلب الكتّاب
```typescript
interface AuthorResponse {
  id: string
  name_ar: string
  name_en?: string
  bio_ar: string
  avatar_url?: string
  specialties: string[]
  article_count: number
  social_links: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

// مثال على الاستخدام
const authors = await fetch('/api/authors?limit=20')
  .then(res => res.json())
```

#### `GET /api/authors/[id]/articles` - مقالات كاتب محدد
```typescript
const authorArticles = await fetch('/api/authors/author-001/articles')
  .then(res => res.json())
```

---

## 🔍 واجهات البحث العربي | Arabic Search APIs {#search-apis}

### البحث الشامل | Comprehensive Search

#### `GET /api/search` - البحث في المحتوى
```typescript
interface SearchQuery {
  q: string                    // استعلام البحث
  type?: 'articles' | 'programs' | 'episodes' | 'all'
  category?: string            // تصفية حسب الفئة
  author?: string             // تصفية حسب الكاتب
  limit?: number              // حد النتائج (افتراضي: 10)
  lang?: 'ar' | 'en' | 'all'  // اللغة
  sort?: 'relevance' | 'date' | 'popularity'
}

interface SearchResult {
  type: 'article' | 'program' | 'episode'
  id: string
  title: string
  summary: string
  url: string
  relevance: number
  highlight?: string
  published_at: string
}

// مثال على الاستخدام
const searchResults = await fetch('/api/search?' + new URLSearchParams({
  q: 'الذكاء الاصطناعي',
  type: 'all',
  limit: '20',
  sort: 'relevance'
})).then(res => res.json())
```

### البحث المتقدم | Advanced Search

#### `POST /api/search/advanced` - البحث المتقدم
```typescript
interface AdvancedSearchRequest {
  query: string
  filters: {
    content_types: string[]
    categories: string[]
    authors: string[]
    date_range?: {
      start: string
      end: string
    }
    has_audio?: boolean
    featured_only?: boolean
  }
  sort: {
    field: 'relevance' | 'date' | 'popularity' | 'title'
    order: 'asc' | 'desc'
  }
  pagination: {
    page: number
    limit: number
  }
}

// مثال على الاستخدام
const advancedResults = await fetch('/api/search/advanced', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'السياسة الخارجية',
    filters: {
      content_types: ['articles', 'programs'],
      categories: ['politics', 'assessment'],
      date_range: {
        start: '2024-01-01',
        end: '2025-01-31'
      },
      has_audio: true
    },
    sort: { field: 'relevance', order: 'desc' },
    pagination: { page: 1, limit: 15 }
  })
})
```

### اقتراحات البحث | Search Suggestions

#### `GET /api/search/suggestions` - اقتراحات البحث
```typescript
interface SuggestionsQuery {
  q: string      // النص المدخل
  limit?: number // عدد الاقتراحات (افتراضي: 5)
}

interface SuggestionResponse {
  suggestions: string[]
  popular_queries: string[]
  related_topics: string[]
}

// مثال على الاستخدام
const suggestions = await fetch('/api/search/suggestions?q=الذكاء&limit=10')
  .then(res => res.json())
```

---

## 🎵 واجهات الوسائط الصوتية | Audio Media APIs {#audio-apis}

### تحويل النص إلى صوت | Text-to-Speech

#### `POST /api/tts/generate` - توليد الصوت 🔐
```typescript
interface TTSRequest {
  articleId: string
  language?: 'ar' | 'en'
  voiceId?: string
  speed?: number        // سرعة القراءة (0.5 - 2.0)
  pitch?: number        // نبرة الصوت (-20 - 20)
}

interface TTSResponse {
  success: true
  audioUrl: string
  duration: number      // المدة بالثواني
  fileSize: number      // حجم الملف بالبايت
  message: string
}

// مثال على الاستخدام
const audioGeneration = await fetch('/api/tts/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    articleId: 'article-001',
    language: 'ar',
    voiceId: 'arabic-female-1',
    speed: 1.0
  })
})
```

#### `GET /api/tts/voices` - الأصوات المتاحة
```typescript
interface Voice {
  id: string
  name: string
  gender: 'male' | 'female'
  language: string
  accent?: string
  sample_url: string
  description_ar: string
}

// مثال على الاستخدام
const voices = await fetch('/api/tts/voices')
  .then(res => res.json())
```

#### `GET /api/tts/status/[generationId]` - حالة التوليد
```typescript
interface TTSStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number     // نسبة الإنجاز (0-100)
  audioUrl?: string
  error?: string
  created_at: string
  completed_at?: string
}
```

### رفع الملفات الصوتية | Audio File Upload

#### `POST /api/audio/upload` - رفع ملف صوتي 🔐
```typescript
// مثال على رفع ملف صوتي
const formData = new FormData()
formData.append('audio', audioFile)
formData.append('articleId', 'article-001')
formData.append('title', 'عنوان التسجيل')

const uploadResult = await fetch('/api/audio/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
```

---

## 📧 واجهات التفاعل | Engagement APIs {#engagement-apis}

### النشرة البريدية | Newsletter

#### `POST /api/newsletter` - الاشتراك في النشرة
```typescript
interface NewsletterSubscription {
  email: string
  name?: string
  preferences?: {
    weekly_digest: boolean
    new_articles: boolean
    podcasts: boolean
    special_reports: boolean
  }
}

// مثال على الاستخدام
const subscription = await fetch('/api/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'اسم المستخدم',
    preferences: {
      weekly_digest: true,
      new_articles: true,
      podcasts: false,
      special_reports: true
    }
  })
})
```

#### `DELETE /api/newsletter` - إلغاء الاشتراك
```typescript
const unsubscribe = await fetch('/api/newsletter', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com'
  })
})
```

### إرسال المقالات | Article Submissions

#### `POST /api/submit-article` - إرسال مقال للمراجعة
```typescript
interface ArticleSubmission {
  author_name: string
  email: string
  title: string
  category: string
  summary: string
  content: string
  author_bio: string
  qualifications: string
  references?: string
}

// مثال على الاستخدام
const submission = await fetch('/api/submit-article', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    author_name: 'اسم الكاتب',
    email: 'writer@example.com',
    title: 'عنوان المقال المقترح',
    category: 'politics',
    summary: 'ملخص المقال...',
    content: 'محتوى المقال الكامل...',
    author_bio: 'نبذة عن الكاتب...',
    qualifications: 'المؤهلات والخبرات...',
    references: 'المراجع والمصادر...'
  })
})
```

### التفاعل الاجتماعي | Social Engagement

#### `POST /api/articles/[id]/like` - إعجاب بمقال 🔐
```typescript
const likeArticle = await fetch('/api/articles/article-001/like', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

#### `POST /api/articles/[id]/share` - مشاركة مقال
```typescript
interface ShareRequest {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'telegram'
  custom_message?: string
}

const shareArticle = await fetch('/api/articles/article-001/share', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    platform: 'twitter',
    custom_message: 'مقال رائع يستحق القراءة'
  })
})
```

---

## 🛠️ أمثلة التكامل | Integration Examples {#examples}

### مثال شامل: تطبيق React | Complete React Example

```typescript
// hooks/useZawayaAPI.ts
import { useState, useEffect } from 'react'

interface APIState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useZawayaAPI<T>(endpoint: string, options?: RequestInit) {
  const [state, setState] = useState<APIState<T>>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const response = await fetch(`/api${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers
          },
          ...options
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'API request failed')
        }

        setState({
          data: result.data,
          loading: false,
          error: null
        })
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    fetchData()
  }, [endpoint])

  return state
}

// components/ArticlesList.tsx
import { useZawayaAPI } from '../hooks/useZawayaAPI'

interface Article {
  id: string
  title_ar: string
  summary_ar: string
  author: { name_ar: string }
  published_at: string
}

export function ArticlesList({ category }: { category?: string }) {
  const { data, loading, error } = useZawayaAPI<{
    articles: Article[]
    pagination: any
  }>(`/articles${category ? `?category=${category}` : ''}`)

  if (loading) return <div>جاري التحميل...</div>
  if (error) return <div>خطأ: {error}</div>
  if (!data) return <div>لا توجد مقالات</div>

  return (
    <div className="articles-list">
      {data.articles.map(article => (
        <article key={article.id} className="article-card">
          <h2>{article.title_ar}</h2>
          <p>{article.summary_ar}</p>
          <div className="article-meta">
            <span>بقلم: {article.author.name_ar}</span>
            <time>{new Date(article.published_at).toLocaleDateString('ar')}</time>
          </div>
        </article>
      ))}
    </div>
  )
}
```

### مثال: البحث التفاعلي | Interactive Search Example

```typescript
// components/SearchComponent.tsx
import { useState, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'

export function SearchComponent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  // البحث مع التأخير لتحسين الأداء
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=10`)
        const data = await response.json()
        
        if (data.success) {
          setResults(data.data.results)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  // جلب الاقتراحات
  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        
        if (data.success) {
          setSuggestions(data.suggestions)
        }
      } catch (error) {
        console.error('Suggestions error:', error)
      }
    }, 200),
    []
  )

  useEffect(() => {
    debouncedSearch(query)
    fetchSuggestions(query)
  }, [query, debouncedSearch, fetchSuggestions])

  return (
    <div className="search-component">
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث في المقالات والبرامج..."
          className="search-input"
        />
        
        {suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="suggestion-item"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <div className="loading">جاري البحث...</div>}

      <div className="search-results">
        {results.map((result: any) => (
          <div key={result.id} className="search-result">
            <h3>
              <a href={result.url}>{result.title}</a>
            </h3>
            <p>{result.summary}</p>
            {result.highlight && (
              <div className="highlight" dangerouslySetInnerHTML={{ __html: result.highlight }} />
            )}
            <div className="result-meta">
              <span className="result-type">{result.type}</span>
              <span className="relevance">الصلة: {Math.round(result.relevance * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### مثال: مشغل الصوت | Audio Player Example

```typescript
// components/AudioPlayer.tsx
import { useState, useRef, useEffect } from 'react'

interface AudioPlayerProps {
  articleId: string
  title: string
  audioUrl?: string
}

export function AudioPlayer({ articleId, title, audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState(audioUrl)
  const audioRef = useRef<HTMLAudioElement>(null)

  // توليد الصوت إذا لم يكن متوفراً
  const generateAudio = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          articleId,
          language: 'ar',
          voiceId: 'arabic-female-1'
        })
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedAudioUrl(data.audioUrl)
      }
    } catch (error) {
      console.error('Audio generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // تحديث الوقت الحالي
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [generatedAudioUrl])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seek = (time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!generatedAudioUrl && !isGenerating) {
    return (
      <div className="audio-player-placeholder">
        <button onClick={generateAudio} className="generate-audio-btn">
          🎵 استمع للمقال
        </button>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="audio-player-loading">
        <div className="loading-spinner"></div>
        <span>جاري توليد الصوت...</span>
      </div>
    )
  }

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={generatedAudioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="audio-controls">
        <button onClick={togglePlayPause} className="play-pause-btn">
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="audio-info">
          <div className="audio-title">{title}</div>
          <div className="audio-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      <div className="audio-progress">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          className="progress-slider"
        />
      </div>
    </div>
  )
}
```

---

## 📞 الدعم والمساعدة | Support & Help

### موارد المساعدة | Support Resources
- 📖 **الوثائق الكاملة:** [docs/](../docs/)
- 🔌 **مرجع API:** [API.md](../docs/API.md)
- 🐛 **تتبع المشاكل:** [GitHub Issues](https://github.com/gmdgdn/zawayaa/issues)
- 💬 **المناقشات:** [GitHub Discussions](https://github.com/gmdgdn/zawayaa/discussions)
- 📧 **الدعم الفني:** [support@zawaya.org](mailto:support@zawaya.org)

### أمثلة إضافية | Additional Examples
- 🔗 **مستودع الأمثلة:** [GitHub Examples](https://github.com/gmdgdn/zawayaa-examples)
- 📚 **دروس تعليمية:** [Tutorials](https://docs.zawaya.org/tutorials)
- 🎥 **فيديوهات تعليمية:** [YouTube Channel](https://youtube.com/@zawaya)

---

<div align="center">

**تم البناء بـ ❤️ للخطاب الفكري العربي**  
**Built with ❤️ for Arabic intellectual discourse**

[⭐ نجمة على GitHub](https://github.com/gmdgdn/zawayaa) | [🐛 بلاغ عن خطأ](https://github.com/gmdgdn/zawayaa/issues) | [💡 طلب ميزة](https://github.com/gmdgdn/zawayaa/issues/new)

</div>