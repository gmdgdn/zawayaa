# 📚 الوثائق التقنية لمنصة زوايا | Zawaya Arabic Technical Documentation

## 📋 فهرس المحتويات | Table of Contents

- [🏗️ البنية التقنية | Architecture](#architecture)
- [🔌 واجهات برمجة التطبيقات العربية | Arabic API Endpoints](#arabic-api)
- [🛠️ الخدمات الأساسية | Core Services](#core-services)
- [🗄️ قاعدة البيانات العربية | Arabic Database Schema](#database)
- [🚀 النشر والصيانة | Deployment & Maintenance](#deployment)
- [🔧 استكشاف الأخطاء | Troubleshooting](#troubleshooting)

---

## 🏗️ البنية التقنية | Architecture {#architecture}

### نظرة عامة على النظام | System Overview

منصة زوايا مبنية على بنية حديثة تدعم المحتوى العربي بشكل أساسي مع إمكانية التوسع للغات أخرى.

**المكونات الأساسية | Core Components:**

```mermaid
graph TB
    A[Next.js 15.2.4 Frontend] --> B[Arabic-First Routing]
    B --> C[Arabic Content Pages /ar/*]
    C --> D[Supabase PostgreSQL]
    
    D --> E[Arabic Content Tables]
    D --> F[Media Storage]
    D --> G[Authentication]
    
    E --> H[Articles | المقالات]
    E --> I[Programs | البرامج]
    E --> J[Episodes | الحلقات]
    E --> K[Authors | الكتّاب]
    
    L[External Services] --> M[TTS Service | خدمة التحويل للصوت]
    L --> N[Email Service | خدمة البريد]
    L --> O[CDN Storage | التخزين السحابي]
```

### التقنيات المستخدمة | Technology Stack

| المكون | التقنية | الغرض |
|--------|---------|-------|
| **الواجهة الأمامية** | Next.js 15.2.4 + TypeScript | إطار عمل React مع دعم SSR/SSG |
| **التصميم** | Tailwind CSS + shadcn/ui | CSS مع مكونات جاهزة |
| **قاعدة البيانات** | Supabase PostgreSQL | قاعدة بيانات مع المصادقة |
| **التخزين** | Supabase Storage | إدارة الملفات والوسائط |
| **المصادقة** | Supabase Auth | نظام المصادقة والتفويض |
| **النشر** | Vercel | منصة الاستضافة |

### بنية المجلدات | Project Structure

```
zawayaa/
├── app/                    # Next.js app directory
│   ├── admin/             # لوحة الإدارة
│   ├── api/               # واجهات برمجة التطبيقات
│   ├── ar/                # صفحات المحتوى العربي
│   └── globals.css        # الأنماط العامة
├── components/            # مكونات React
│   ├── admin/            # مكونات الإدارة
│   ├── editor/           # محرر النصوص
│   └── ui/               # مكتبة المكونات
├── lib/                   # المكتبات المساعدة
│   ├── *-service.ts      # طبقة الخدمات
│   ├── database.ts       # خدمات قاعدة البيانات
│   ├── supabase.ts       # عميل Supabase
│   └── types.ts          # تعريفات TypeScript
├── scripts/              # سكريبتات قاعدة البيانات
├── docs/                 # الوثائق
└── public/               # الملفات الثابتة
```

---

## 🔌 واجهات برمجة التطبيقات العربية | Arabic API Endpoints {#arabic-api}

### المقالات العربية | Arabic Articles API

#### `GET /api/articles` - جلب المقالات

**المعاملات | Parameters:**
- `page` (رقم) - رقم الصفحة (افتراضي: 1)
- `limit` (رقم) - عدد العناصر (افتراضي: 10، أقصى: 100)
- `category` (نص) - تصفية حسب الفئة
- `author` (نص) - تصفية حسب الكاتب
- `featured` (منطقي) - المقالات المميزة فقط
- `search` (نص) - البحث في العنوان والمحتوى

**مثال على الطلب | Example Request:**
```http
GET /api/articles?category=politics&featured=true&limit=5
```

**مثال على الاستجابة | Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "article-001",
      "title_ar": "تحليل الوضع السياسي في المنطقة",
      "summary_ar": "تحليل شامل للتطورات السياسية الأخيرة",
      "content_ar": "محتوى المقال الكامل...",
      "author": {
        "id": "author-001",
        "name_ar": "د. أحمد الزهراني",
        "bio_ar": "خبير في العلوم السياسية"
      },
      "category": {
        "id": "politics",
        "name_ar": "سياسة",
        "slug": "politics"
      },
      "audio_url": "https://storage.supabase.co/audio/article-001.mp3",
      "audio_duration": 420,
      "published_at": "2025-01-25T10:00:00Z",
      "view_count": 1250,
      "featured": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 23,
    "pages": 5
  }
}
```

#### `POST /api/articles` - إنشاء مقال جديد 🔐

**الأدوار المطلوبة | Required Roles:** `editor` أو أعلى

**بيانات الطلب | Request Body:**
```json
{
  "title_ar": "عنوان المقال",
  "summary_ar": "ملخص المقال",
  "content_ar": "محتوى المقال الكامل",
  "category_id": "politics",
  "author_id": "author-001",
  "featured": false,
  "tags": ["سياسة", "تحليل", "شرق أوسط"],
  "publish_at": "2025-01-26T10:00:00Z",
  "generate_audio": true
}
```

### البحث العربي | Arabic Search API

#### `GET /api/search` - البحث في المحتوى

**المعاملات | Parameters:**
- `q` (نص) - استعلام البحث
- `type` (نص) - نوع المحتوى (`articles`, `programs`, `episodes`, `all`)
- `category` (نص) - تصفية حسب الفئة
- `limit` (رقم) - حد النتائج (افتراضي: 10)
- `lang` (نص) - اللغة (`ar`, `en`, `all`)

**مثال | Example:**
```http
GET /api/search?q=الذكاء%20الاصطناعي&type=all&limit=20
```

**الاستجابة | Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "article",
        "id": "tech-001",
        "title": "الذكاء الاصطناعي والمستقبل",
        "summary": "مقال حول تأثير الذكاء الاصطناعي على المجتمع",
        "url": "/ar/articles/tech-001",
        "relevance": 0.95,
        "highlight": "...الذكاء الاصطناعي يغير طريقة تفكيرنا..."
      }
    ],
    "total": 15,
    "query": "الذكاء الاصطناعي",
    "suggestions": ["الذكاء الاصطناعي والتعليم", "تقنيات الذكاء الاصطناعي"]
  }
}
```

### البرامج والحلقات | Programs & Episodes API

#### `GET /api/programs` - جلب البرامج

**المعاملات | Parameters:**
- `format` (نص) - نوع البرنامج (`video`, `audio`, `both`)
- `featured` (منطقي) - البرامج المميزة فقط
- `category` (نص) - تصفية حسب الفئة

**الاستجابة | Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prog-001",
      "title_ar": "حضارة الشرق",
      "description_ar": "سلسلة وثائقية عن حضارات الشرق الأوسط",
      "format": "video",
      "host_ar": "محمد الحكيم",
      "cover_image": "/images/programs/east_civilization.jpg",
      "episode_count": 12,
      "total_duration": 720,
      "schedule": "كل أحد 8:00 مساءً",
      "latest_episode": {
        "id": "ep-001",
        "title_ar": "الحضارة الإسلامية في الأندلس",
        "episode_number": 1,
        "duration": 45,
        "published_at": "2025-01-20T20:00:00Z"
      }
    }
  ]
}
```

### التحويل إلى صوت | Text-to-Speech API

#### `POST /api/tts/generate` - توليد الصوت 🔐

**بيانات الطلب | Request Body:**
```json
{
  "articleId": "article-001",
  "language": "ar",
  "voiceId": "arabic-female-1"
}
```

**الاستجابة | Response:**
```json
{
  "success": true,
  "audioUrl": "https://storage.supabase.co/audio/article-001.mp3",
  "duration": 420,
  "message": "تم توليد الصوت بنجاح"
}
```

#### `GET /api/tts/generate?action=voices` - الأصوات المتاحة

**الاستجابة | Response:**
```json
{
  "voices": [
    {
      "id": "arabic-female-1",
      "name": "ليلى",
      "gender": "female",
      "language": "ar",
      "sample_url": "/samples/leila.mp3"
    },
    {
      "id": "arabic-male-1", 
      "name": "أحمد",
      "gender": "male",
      "language": "ar",
      "sample_url": "/samples/ahmed.mp3"
    }
  ]
}
```

---

## 🛠️ الخدمات الأساسية | Core Services {#core-services}

### خدمة البحث العربي | Arabic Search Service

```typescript
// lib/search-service.ts
export class SearchService {
  /**
   * البحث الشامل في المحتوى العربي
   * Comprehensive Arabic content search
   */
  async searchContent(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]>

  /**
   * تطبيع النص العربي للبحث
   * Normalize Arabic text for search
   */
  private normalizeArabicQuery(query: string): string

  /**
   * البحث مع دعم التشكيل
   * Search with diacritics support
   */
  async searchWithDiacritics(query: string): Promise<SearchResult[]>
}
```

**الاستخدام | Usage:**
```typescript
import { searchService } from '@/lib/search-service'

// البحث في المقالات
const results = await searchService.searchContent('الذكاء الاصطناعي', {
  contentType: 'articles',
  category: 'technology',
  limit: 10
})

// البحث مع التشكيل
const diacriticResults = await searchService.searchWithDiacritics('الذَّكاءُ الاصْطِناعِيُّ')
```

### خدمة التحويل إلى صوت | TTS Service

```typescript
// lib/tts-service.ts
export class TTSService {
  /**
   * توليد صوت عربي من النص
   * Generate Arabic audio from text
   */
  async generateArabicAudio(
    text: string,
    options: TTSOptions = {}
  ): Promise<string>

  /**
   * الحصول على الأصوات العربية المتاحة
   * Get available Arabic voices
   */
  async getArabicVoices(): Promise<Voice[]>

  /**
   * معالجة النص العربي قبل التحويل
   * Process Arabic text before conversion
   */
  private preprocessArabicText(text: string): string
}
```

### خدمة تحسين محركات البحث | SEO Service

```typescript
// lib/seo-service.ts
export class SEOService {
  /**
   * توليد البيانات الوصفية للمحتوى العربي
   * Generate metadata for Arabic content
   */
  generateArabicMetadata(content: ArabicContent): Metadata

  /**
   * إنشاء البيانات المنظمة للمحتوى العربي
   * Create structured data for Arabic content
   */
  generateArabicStructuredData(content: ArabicContent): JsonLd

  /**
   * تحسين العناوين العربية لمحركات البحث
   * Optimize Arabic titles for SEO
   */
  optimizeArabicTitle(title: string): string
}
```

### خدمة الوسائط الصوتية | Audio Service

```typescript
// lib/audio-service.ts
export class AudioService {
  /**
   * توليد التعليق الصوتي للمقال
   * Generate article narration
   */
  async generateNarration(options: NarrationOptions): Promise<string>

  /**
   * رفع ملف صوتي
   * Upload audio file
   */
  async uploadAudio(file: File, articleId: string): Promise<string>

  /**
   * الحصول على معلومات الملف الصوتي
   * Get audio metadata
   */
  async getAudioMetadata(url: string): Promise<AudioMetadata>
}
```

### خدمة إمكانية الوصول | Accessibility Service

```typescript
// lib/accessibility-service.ts
export class AccessibilityService {
  /**
   * توليد تسميات ARIA للمحتوى العربي
   * Generate ARIA labels for Arabic content
   */
  generateArabicAriaLabels(): AriaLabels

  /**
   * التحقق من إمكانية الوصول للمحتوى العربي
   * Validate Arabic content accessibility
   */
  validateArabicAccessibility(element: HTMLElement): AccessibilityReport

  /**
   * تحسين التنقل بلوحة المفاتيح للنصوص العربية
   * Optimize keyboard navigation for Arabic text
   */
  setupArabicKeyboardNavigation(): void
}
```

---

## 🗄️ قاعدة البيانات العربية | Arabic Database Schema {#database}

### جداول المحتوى الأساسية | Core Content Tables

#### جدول المقالات | Articles Table
```sql
CREATE TABLE articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_ar VARCHAR(500) NOT NULL,
    title_en VARCHAR(500),
    summary_ar TEXT,
    summary_en TEXT,
    content_ar TEXT NOT NULL,
    content_en TEXT,
    slug VARCHAR(200) UNIQUE NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id),
    author_id UUID REFERENCES authors(id),
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    audio_url VARCHAR(500),
    audio_duration INTEGER,
    audio_generated BOOLEAN DEFAULT false,
    tts_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهارس للبحث العربي | Arabic search indexes
CREATE INDEX idx_articles_title_ar_gin ON articles USING gin(to_tsvector('arabic', title_ar));
CREATE INDEX idx_articles_content_ar_gin ON articles USING gin(to_tsvector('arabic', content_ar));
CREATE INDEX idx_articles_published_at ON articles(published_at DESC) WHERE published = true;
CREATE INDEX idx_articles_category_published ON articles(category_id, published_at DESC) WHERE published = true;
```

#### جدول البرامج | Programs Table
```sql
CREATE TABLE programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_ar VARCHAR(300) NOT NULL,
    title_en VARCHAR(300),
    description_ar TEXT,
    description_en TEXT,
    slug VARCHAR(200) UNIQUE NOT NULL,
    format VARCHAR(20) DEFAULT 'video', -- 'video', 'audio', 'both'
    category_id VARCHAR(50) REFERENCES categories(id),
    host_ar VARCHAR(200),
    host_en VARCHAR(200),
    schedule VARCHAR(100), -- "كل أحد 8:00 مساءً"
    cover_image VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    episode_count INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0, -- بالدقائق
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهارس البرامج | Program indexes
CREATE INDEX idx_programs_format ON programs(format);
CREATE INDEX idx_programs_featured ON programs(featured) WHERE featured = true;
CREATE INDEX idx_programs_active ON programs(active) WHERE active = true;
```

#### جدول الحلقات | Episodes Table
```sql
CREATE TABLE episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    title_ar VARCHAR(300) NOT NULL,
    title_en VARCHAR(300),
    description_ar TEXT,
    description_en TEXT,
    slug VARCHAR(200) UNIQUE NOT NULL,
    episode_number INTEGER,
    season_number INTEGER DEFAULT 1,
    video_url VARCHAR(500),
    audio_url VARCHAR(500),
    duration INTEGER, -- بالدقائق
    guest_name VARCHAR(200),
    show_notes TEXT,
    transcript TEXT,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهارس الحلقات | Episode indexes
CREATE INDEX idx_episodes_program_id ON episodes(program_id);
CREATE INDEX idx_episodes_published_at ON episodes(published_at DESC) WHERE published = true;
CREATE INDEX idx_episodes_episode_number ON episodes(program_id, season_number, episode_number);
```

#### جدول الكتّاب | Authors Table
```sql
CREATE TABLE authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    bio_ar TEXT,
    bio_en TEXT,
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'contributor', -- 'super_admin', 'admin', 'editor', 'writer', 'contributor'
    specialties TEXT[], -- ["سياسة", "اقتصاد", "ثقافة"]
    social_twitter VARCHAR(100),
    social_linkedin VARCHAR(100),
    social_website VARCHAR(200),
    article_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهارس الكتّاب | Author indexes
CREATE INDEX idx_authors_role ON authors(role);
CREATE INDEX idx_authors_active ON authors(active) WHERE active = true;
CREATE INDEX idx_authors_name_ar_gin ON authors USING gin(to_tsvector('arabic', name_ar));
```

### جداول النظام | System Tables

#### جدول الفئات | Categories Table
```sql
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    description_ar TEXT,
    description_en TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1', -- Hex color
    icon VARCHAR(50), -- Icon name
    parent_id VARCHAR(50) REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    article_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- بيانات الفئات الأساسية | Default categories
INSERT INTO categories (id, name_ar, name_en, slug, color, icon) VALUES
('politics', 'آراء سياسية', 'Political Opinions', 'politics', '#ef4444', 'politics'),
('assessment', 'تقدير موقف', 'Situation Assessment', 'assessment', '#f59e0b', 'assessment'),
('culture', 'ثقافة وفكر', 'Culture & Thought', 'culture', '#8b5cf6', 'culture'),
('economy', 'اقتصاد', 'Economy', 'economy', '#10b981', 'economy'),
('technology', 'تقنية', 'Technology', 'technology', '#06b6d4', 'technology'),
('society', 'مجتمع', 'Society', 'society', '#f97316', 'society');
```

#### جدول توليد الصوت | TTS Generations Table
```sql
CREATE TABLE tts_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    text_content TEXT NOT NULL,
    language VARCHAR(5) DEFAULT 'ar',
    voice_id VARCHAR(50),
    audio_url VARCHAR(500),
    duration INTEGER, -- بالثواني
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_message TEXT,
    cost_credits INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- فهارس توليد الصوت | TTS indexes
CREATE INDEX idx_tts_article_id ON tts_generations(article_id);
CREATE INDEX idx_tts_status ON tts_generations(status);
CREATE INDEX idx_tts_created_at ON tts_generations(created_at DESC);
```

### الدوال والمشغلات | Functions & Triggers

#### دالة البحث العربي | Arabic Search Function
```sql
CREATE OR REPLACE FUNCTION search_arabic_content(
    search_query TEXT,
    content_type TEXT DEFAULT 'all',
    category_filter TEXT DEFAULT NULL,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    content_type TEXT,
    content_id UUID,
    title TEXT,
    summary TEXT,
    url TEXT,
    relevance REAL,
    published_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'article'::TEXT as content_type,
        a.id as content_id,
        a.title_ar as title,
        a.summary_ar as summary,
        '/ar/articles/' || a.slug as url,
        ts_rank(
            to_tsvector('arabic', a.title_ar || ' ' || a.content_ar),
            plainto_tsquery('arabic', search_query)
        ) as relevance,
        a.published_at
    FROM articles a
    WHERE a.published = true
        AND (category_filter IS NULL OR a.category_id = category_filter)
        AND (content_type = 'all' OR content_type = 'articles')
        AND to_tsvector('arabic', a.title_ar || ' ' || a.content_ar) @@ plainto_tsquery('arabic', search_query)
    
    UNION ALL
    
    SELECT 
        'program'::TEXT as content_type,
        p.id as content_id,
        p.title_ar as title,
        p.description_ar as summary,
        '/ar/programs/' || p.slug as url,
        ts_rank(
            to_tsvector('arabic', p.title_ar || ' ' || p.description_ar),
            plainto_tsquery('arabic', search_query)
        ) as relevance,
        p.created_at as published_at
    FROM programs p
    WHERE p.active = true
        AND (content_type = 'all' OR content_type = 'programs')
        AND to_tsvector('arabic', p.title_ar || ' ' || p.description_ar) @@ plainto_tsquery('arabic', search_query)
    
    ORDER BY relevance DESC, published_at DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;
```

#### مشغل تحديث عدد المقالات | Article Count Trigger
```sql
CREATE OR REPLACE FUNCTION update_article_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- تحديث عدد مقالات الكاتب | Update author article count
    IF TG_OP = 'INSERT' THEN
        UPDATE authors 
        SET article_count = article_count + 1 
        WHERE id = NEW.author_id;
        
        UPDATE categories 
        SET article_count = article_count + 1 
        WHERE id = NEW.category_id;
        
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE authors 
        SET article_count = article_count - 1 
        WHERE id = OLD.author_id;
        
        UPDATE categories 
        SET article_count = article_count - 1 
        WHERE id = OLD.category_id;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- إذا تغير الكاتب | If author changed
        IF OLD.author_id != NEW.author_id THEN
            UPDATE authors SET article_count = article_count - 1 WHERE id = OLD.author_id;
            UPDATE authors SET article_count = article_count + 1 WHERE id = NEW.author_id;
        END IF;
        
        -- إذا تغيرت الفئة | If category changed
        IF OLD.category_id != NEW.category_id THEN
            UPDATE categories SET article_count = article_count - 1 WHERE id = OLD.category_id;
            UPDATE categories SET article_count = article_count + 1 WHERE id = NEW.category_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_article_counts
    AFTER INSERT OR UPDATE OR DELETE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_article_counts();
```

---

## 🚀 النشر والصيانة | Deployment & Maintenance {#deployment}

### متطلبات النشر | Deployment Requirements

#### متغيرات البيئة | Environment Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# TTS Service (اختياري | Optional)
PLAYHT_API_KEY=your_playht_api_key
PLAYHT_USER_ID=your_playht_user_id

# Email Service (اختياري | Optional)
RESEND_API_KEY=your_resend_api_key

# Analytics (اختياري | Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Base URL
NEXT_PUBLIC_BASE_URL=https://zawaya.org
```

#### أوامر النشر | Deployment Commands
```bash
# بناء المشروع | Build project
npm run build

# تشغيل الإنتاج | Start production
npm start

# فحص الأنواع | Type checking
npm run type-check

# فحص الكود | Linting
npm run lint

# اختبار قاعدة البيانات | Test database
npm run test-db
```

### مراقبة النظام | System Monitoring

#### فحص صحة النظام | Health Checks
```typescript
// /api/health - فحص سريع
{
  "status": "healthy",
  "timestamp": "2025-01-25T12:00:00Z",
  "uptime": 86400
}

// /api/test-supabase - فحص شامل
{
  "overallStatus": "healthy",
  "tests": [
    {
      "name": "Database Connection",
      "status": "success",
      "responseTime": "45ms"
    },
    {
      "name": "Arabic Content Query",
      "status": "success", 
      "responseTime": "120ms"
    },
    {
      "name": "TTS Service",
      "status": "success",
      "responseTime": "200ms"
    }
  ]
}
```

#### مراقبة الأداء | Performance Monitoring
```typescript
// مراقبة استعلامات قاعدة البيانات | Database query monitoring
const slowQueries = await supabase
  .from('pg_stat_statements')
  .select('query, mean_time, calls')
  .order('mean_time', { ascending: false })
  .limit(10)

// مراقبة استخدام التخزين | Storage usage monitoring
const storageUsage = await supabase.storage
  .from('media')
  .list('', { limit: 1000 })
```

### الصيانة الدورية | Regular Maintenance

#### تحسين قاعدة البيانات | Database Optimization
```sql
-- إعادة فهرسة الجداول | Reindex tables
REINDEX TABLE articles;
REINDEX TABLE programs;
REINDEX TABLE episodes;

-- تحليل الإحصائيات | Analyze statistics
ANALYZE articles;
ANALYZE programs;
ANALYZE episodes;

-- تنظيف البيانات القديمة | Clean old data
DELETE FROM tts_generations 
WHERE status = 'failed' 
AND created_at < NOW() - INTERVAL '30 days';

-- تحديث عدادات المحتوى | Update content counters
UPDATE authors SET article_count = (
    SELECT COUNT(*) FROM articles 
    WHERE author_id = authors.id AND published = true
);
```

#### نسخ احتياطية | Backups
```bash
# نسخة احتياطية من قاعدة البيانات | Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# نسخة احتياطية من الملفات | Files backup
supabase storage download --bucket media --recursive ./backup/media/

# جدولة النسخ الاحتياطية | Schedule backups
# في crontab:
0 2 * * * /path/to/backup-script.sh
```

---

## 🔧 استكشاف الأخطاء | Troubleshooting {#troubleshooting}

### مشاكل شائعة | Common Issues

#### 🔌 فشل الاتصال بقاعدة البيانات | Database Connection Failed
```bash
# فحص متغيرات البيئة | Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# اختبار الاتصال | Test connection
curl -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
     "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/articles?select=id&limit=1"

# فحص حالة Supabase | Check Supabase status
curl https://status.supabase.com/api/v2/status.json
```

#### 🚫 أخطاء 404 في الصفحات | 404 Page Errors
```bash
# فحص بنية المجلدات | Check folder structure
ls -la app/ar/
ls -la app/api/

# فحص ملفات التوجيه | Check routing files
cat app/ar/page.tsx
cat middleware.ts

# إعادة بناء المشروع | Rebuild project
rm -rf .next
npm run build
```

#### 🖼️ صور مفقودة (404) | Missing Images (404)
```bash
# نسخ الصور الافتراضية | Copy placeholder images
mkdir -p public/images/{articles,programs,episodes,authors}
cp public/placeholder.jpg public/images/articles/
cp public/placeholder.jpg public/images/programs/
cp public/placeholder.jpg public/images/episodes/

# فحص مسارات الصور | Check image paths
find public/images -name "*.jpg" -o -name "*.png" | head -10
```

#### 🔐 رفض الوصول للإدارة | Admin Access Denied
```sql
-- فحص دور المستخدم | Check user role
SELECT id, email, role FROM authors WHERE email = 'your@email.com';

-- تحديث دور المستخدم | Update user role
UPDATE authors SET role = 'admin' WHERE email = 'your@email.com';

-- إنشاء مستخدم إداري | Create admin user
INSERT INTO authors (email, name_ar, role) 
VALUES ('admin@zawaya.org', 'المدير العام', 'super_admin');
```

#### 🎵 مشاكل الصوت | Audio Issues
```bash
# فحص خدمة TTS | Check TTS service
curl -X GET "http://localhost:3000/api/tts/generate?action=status"

# فحص متغيرات TTS | Check TTS variables
echo $PLAYHT_API_KEY
echo $PLAYHT_USER_ID

# اختبار توليد الصوت | Test audio generation
curl -X POST "http://localhost:3000/api/tts/generate" \
     -H "Content-Type: application/json" \
     -d '{"articleId":"test","language":"ar"}'
```

### سجلات الأخطاء | Error Logs

#### تسجيل الأخطاء | Error Logging
```typescript
// lib/logger.ts
export const logger = {
  error: (message: string, error: any, context?: any) => {
    console.error(`[ERROR] ${message}`, {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
  },
  
  warn: (message: string, context?: any) => {
    console.warn(`[WARN] ${message}`, {
      context,
      timestamp: new Date().toISOString()
    })
  },
  
  info: (message: string, context?: any) => {
    console.info(`[INFO] ${message}`, {
      context,
      timestamp: new Date().toISOString()
    })
  }
}
```

#### مراقبة الأخطاء | Error Monitoring
```typescript
// app/api/errors/route.ts
export async function POST(request: NextRequest) {
  const { error, context } = await request.json()
  
  // حفظ الخطأ في قاعدة البيانات | Save error to database
  await supabase.from('error_logs').insert({
    message: error.message,
    stack: error.stack,
    context: JSON.stringify(context),
    user_agent: request.headers.get('user-agent'),
    ip_address: request.ip,
    created_at: new Date().toISOString()
  })
  
  return NextResponse.json({ success: true })
}
```

### أدوات التشخيص | Diagnostic Tools

#### سكريبت فحص النظام | System Check Script
```bash
#!/bin/bash
# scripts/system-check.sh

echo "🔍 فحص نظام زوايا | Zawaya System Check"
echo "=================================="

# فحص Node.js
echo "📦 Node.js Version:"
node --version

# فحص المتغيرات
echo "🔧 Environment Variables:"
[ -n "$NEXT_PUBLIC_SUPABASE_URL" ] && echo "✅ SUPABASE_URL" || echo "❌ SUPABASE_URL"
[ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && echo "✅ SERVICE_ROLE_KEY" || echo "❌ SERVICE_ROLE_KEY"

# فحص قاعدة البيانات
echo "🗄️ Database Connection:"
curl -s -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
     "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/articles?select=id&limit=1" \
     && echo "✅ Database Connected" || echo "❌ Database Failed"

# فحص الملفات
echo "📁 Required Files:"
[ -f "app/ar/page.tsx" ] && echo "✅ Arabic Homepage" || echo "❌ Arabic Homepage"
[ -f "middleware.ts" ] && echo "✅ Middleware" || echo "❌ Middleware"

echo "=================================="
echo "✅ System check completed"
```

---

## 📞 الدعم التقني | Technical Support

### موارد المساعدة | Support Resources
- 📖 **الوثائق الكاملة:** [docs/](../docs/)
- 🐛 **تتبع المشاكل:** [GitHub Issues](https://github.com/gmdgdn/zawayaa/issues)
- 💬 **المناقشات:** [GitHub Discussions](https://github.com/gmdgdn/zawayaa/discussions)
- 📧 **الدعم الفني:** [support@zawaya.org](mailto:support@zawaya.org)

### روابط مفيدة | Useful Links
- 🌐 **المنصة المباشرة:** [zawayaa.vercel.app](https://zawayaa.vercel.app/)
- 📊 **لوحة الإدارة:** [zawayaa.vercel.app/admin](https://zawayaa.vercel.app/admin)
- 🔧 **دليل الإعداد:** [ENVIRONMENT_SETUP.md](../ENVIRONMENT_SETUP.md)
- 📚 **وثائق API:** [API.md](../docs/API.md)

---

<div align="center">

**تم البناء بـ ❤️ للخطاب الفكري العربي**  
**Built with ❤️ for Arabic intellectual discourse**

[⭐ نجمة على GitHub](https://github.com/gmdgdn/zawayaa) | [🐛 بلاغ عن خطأ](https://github.com/gmdgdn/zawayaa/issues) | [💡 طلب ميزة](https://github.com/gmdgdn/zawayaa/issues/new)

</div>