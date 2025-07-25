# 🔌 Zawaya Platform - API Documentation

## 📋 Table of Contents

- [🚀 Overview](#overview)
- [🔐 Authentication](#authentication)
- [📊 Response Format](#response-format)
- [📝 Articles API](#articles-api)
- [🔍 Search API](#search-api)
- [📧 Newsletter API](#newsletter-api)
- [👥 Authors API](#authors-api)
- [🏷️ Categories API](#categories-api)
- [🎙️ Programs API](#programs-api)
- [📨 Submissions API](#submissions-api)
- [🏠 Homepage API](#homepage-api)
- [🔧 System API](#system-api)
- [❌ Error Handling](#error-handling)

## 🚀 Overview

The Zawaya Platform API provides RESTful endpoints for managing content, users, and platform functionality. All endpoints return JSON responses and support standard HTTP methods.

**Base URL:** `https://zawayaa.vercel.app/api`  
**Development:** `http://localhost:3000/api`

## 🔐 Authentication

### **JWT Token Authentication**
```http
Authorization: Bearer <jwt_token>
```

### **API Key Authentication** (Server-side only)
```http
X-API-Key: <service_role_key>
```

### **Role-based Access Control**
- `super_admin` - Full platform access
- `admin` - Administrative operations
- `editor` - Content editing and publishing
- `writer` - Content creation
- `contributor` - Limited content creation

## 📊 Response Format

### **Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### **Error Response**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information",
  "code": "ERROR_CODE"
}
```

## 📝 Articles API

### **GET /api/articles**
Retrieve articles with filtering and pagination.

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 100)
- `category` (string) - Filter by category
- `author` (string) - Filter by author ID
- `featured` (boolean) - Filter featured articles
- `status` (string) - Filter by status (`published`, `draft`, `archived`)
- `sort` (string) - Sort order (`newest`, `oldest`, `popular`, `title`)
- `search` (string) - Search in title and content

**Example Request:**
```http
GET /api/articles?page=1&limit=10&category=politics&featured=true
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "po-001",
      "title_ar": "تحليل الوضع السياسي الراهن",
      "title_en": "Analysis of Current Political Situation",
      "summary_ar": "تحليل شامل للأحداث السياسية الأخيرة",
      "content_ar": "...",
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
      "featured": true,
      "published_at": "2025-01-25T10:00:00Z",
      "view_count": 1500,
      "like_count": 89,
      "share_count": 23
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### **GET /api/articles/[id]**
Retrieve a specific article by ID.

**Path Parameters:**
- `id` (string) - Article ID

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "po-001",
    "title_ar": "تحليل الوضع السياسي الراهن",
    "content_ar": "...",
    "author": { ... },
    "category": { ... },
    "tags": ["سياسة", "تحليل", "شرق أوسط"],
    "related_articles": [ ... ],
    "translations": {
      "en": {
        "title": "Analysis of Current Political Situation",
        "content": "..."
      }
    }
  }
}
```

### **POST /api/articles** 🔐
Create a new article (requires authentication).

**Required Role:** `editor` or higher

**Request Body:**
```json
{
  "title_ar": "عنوان المقال",
  "title_en": "Article Title",
  "summary_ar": "ملخص المقال",
  "content_ar": "محتوى المقال",
  "category_id": "politics",
  "author_id": "author-001",
  "featured": false,
  "tags": ["سياسة", "تحليل"],
  "publish_at": "2025-01-26T10:00:00Z"
}
```

### **PUT /api/articles/[id]** 🔐
Update an existing article.

**Required Role:** `editor` or article author

### **DELETE /api/articles/[id]** 🔐
Delete an article.

**Required Role:** `admin` or higher

## 🔍 Search API

### **GET /api/search**
Search across all content types.

**Query Parameters:**
- `q` (string) - Search query
- `type` (string) - Content type (`articles`, `programs`, `episodes`, `all`)
- `category` (string) - Filter by category
- `limit` (number) - Results limit (default: 10)
- `lang` (string) - Language (`ar`, `en`, `all`)

**Example Request:**
```http
GET /api/search?q=الذكاء%20الاصطناعي&type=all&limit=20
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "article",
        "id": "tech-001",
        "title": "الذكاء الاصطناعي والمستقبل",
        "summary": "مقال حول تأثير الذكاء الاصطناعي",
        "url": "/ar/articles/tech-001",
        "relevance": 0.95
      },
      {
        "type": "episode",
        "id": "ep-001",
        "title": "الذكاء الاصطناعي والثقافة العربية",
        "summary": "حلقة بودكاست حول AI",
        "url": "/ar/podcast/ep-001",
        "relevance": 0.87
      }
    ],
    "total": 15,
    "query": "الذكاء الاصطناعي"
  }
}
```

## 📧 Newsletter API

### **POST /api/newsletter**
Subscribe to newsletter.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "preferences": {
    "weekly_digest": true,
    "new_articles": true,
    "podcasts": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم الاشتراك بنجاح في النشرة البريدية",
  "data": {
    "subscription_id": "sub-001",
    "email": "user@example.com",
    "status": "confirmed"
  }
}
```

### **DELETE /api/newsletter/[email]**
Unsubscribe from newsletter.

## 👥 Authors API

### **GET /api/authors**
Retrieve author profiles.

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `search` (string) - Search by name

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "author-001",
      "name_ar": "د. أحمد الزهراني",
      "name_en": "Dr. Ahmed Al-Zahrani",
      "bio_ar": "خبير في العلوم السياسية",
      "avatar_url": "/images/authors/ahmed.jpg",
      "specialties": ["سياسة", "اقتصاد"],
      "articles_count": 15,
      "social_links": {
        "twitter": "@ahmed_zahrani",
        "linkedin": "ahmed-zahrani"
      }
    }
  ]
}
```

### **GET /api/authors/[id]**
Get specific author profile.

### **GET /api/authors/[id]/articles**
Get articles by specific author.

## 🏷️ Categories API

### **GET /api/categories**
Retrieve all content categories.

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "politics",
      "name_ar": "سياسة",
      "name_en": "Politics",
      "slug": "politics",
      "description_ar": "التحليلات السياسية والشؤون العامة",
      "color": "#ff6b6b",
      "articles_count": 45,
      "featured": true
    }
  ]
}
```

## 🎙️ Programs API

### **GET /api/programs**
Retrieve programs and episodes.

**Query Parameters:**
- `type` (string) - Program type (`video`, `audio`, `all`)
- `featured` (boolean) - Featured programs only
- `page`, `limit` - Pagination

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prog-001",
      "title_ar": "حضارة الشرق",
      "description_ar": "سلسلة وثائقية عن حضارات الشرق",
      "type": "video",
      "host_ar": "محمد الحكيم",
      "cover_image": "/images/programs/east_civilization.jpg",
      "episode_count": 12,
      "total_duration": 420,
      "latest_episode": {
        "id": "ep-001",
        "title_ar": "الحضارة الإسلامية",
        "published_at": "2025-01-20T15:00:00Z"
      }
    }
  ]
}
```

### **GET /api/programs/[id]/episodes**
Get episodes for a specific program.

## 📨 Submissions API

### **POST /api/submit-article**
Submit guest article for review.

**Request Body:**
```json
{
  "author_name": "اسم الكاتب",
  "email": "writer@example.com",
  "title": "عنوان المقال",
  "category": "politics",
  "summary": "ملخص المقال",
  "content": "محتوى المقال الكامل",
  "author_bio": "نبذة عن الكاتب",
  "qualifications": "المؤهلات والخبرات",
  "references": "المراجع والمصادر"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إرسال المقال بنجاح! سنتواصل معك خلال 3-5 أيام عمل.",
  "data": {
    "submission_id": "sub-001",
    "status": "pending_review"
  }
}
```

## 🏠 Homepage API

### **GET /api/homepage**
Get homepage content data.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "hero_article": { ... },
    "featured_episodes": [ ... ],
    "latest_articles": [ ... ],
    "documentaries": [ ... ],
    "statistics": {
      "total_articles": 120,
      "total_episodes": 45,
      "subscribers": 5600
    }
  }
}
```

## 🔧 System API

### **GET /api/test-supabase**
System health check and diagnostics.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "overallStatus": "healthy",
    "timestamp": "2025-01-25T12:00:00Z",
    "tests": [
      {
        "name": "Environment Variables",
        "status": "success",
        "message": "All required variables present"
      },
      {
        "name": "Database Connection",
        "status": "success",
        "responseTime": "45ms"
      }
    ],
    "recommendations": []
  }
}
```

### **GET /api/health**
Simple health check endpoint.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-01-25T12:00:00Z"
}
```

## ❌ Error Handling

### **HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

### **Error Response Format**
```json
{
  "success": false,
  "error": "Human-readable error message",
  "details": "Technical error details",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-25T12:00:00Z"
}
```

### **Common Error Codes**
- `INVALID_REQUEST` - Malformed request
- `AUTHENTICATION_REQUIRED` - Login required
- `INSUFFICIENT_PERMISSIONS` - Access denied
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `VALIDATION_ERROR` - Invalid input data
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `DATABASE_ERROR` - Database connection issue
- `EXTERNAL_SERVICE_ERROR` - Third-party service error

## 🚀 Rate Limiting

**Limits:**
- Anonymous: 100 requests/hour
- Authenticated: 1000 requests/hour
- Admin: 5000 requests/hour

**Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1643723400
```

## 📚 SDKs and Libraries

### **JavaScript/TypeScript**
```bash
npm install @zawaya/api-client
```

```javascript
import { ZawayaAPI } from '@zawaya/api-client'

const api = new ZawayaAPI({
  baseURL: 'https://zawayaa.vercel.app/api',
  apiKey: 'your-api-key'
})

const articles = await api.articles.list({ category: 'politics' })
```

### **Python**
```bash
pip install zawaya-api
```

```python
from zawaya_api import ZawayaClient

client = ZawayaClient(api_key='your-api-key')
articles = client.articles.list(category='politics')
```

---

## 📞 Support

For API support and questions:
- 📧 **Email:** api-support@zawaya.com
- 📖 **Documentation:** [docs.zawaya.com](https://docs.zawaya.com)
- 🐛 **Issues:** [GitHub Issues](https://github.com/gmdgdn/zawayaa/issues) 