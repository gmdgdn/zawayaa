# Complete Content Types Specification - Zawaya Platform

## 📋 **All Content Types Overview**

Based on your frontend components and database schema, here are ALL content types with their complete field specifications:

---

## 🎬 **1. PROGRAMS** (TV Shows, Radio Shows, Podcast Series)

### **Storage**: Supabase Primary
### **Management**: Admin Dashboard

### **Database Fields** (Supabase `programs` table):
```sql
-- Core Identity
id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
slug                VARCHAR(200) UNIQUE NOT NULL
status              VARCHAR(20) DEFAULT 'active' -- active, inactive, draft, archived

-- Content (Bilingual)
title_ar            VARCHAR(300) NOT NULL
title_en            VARCHAR(300)
description_ar      TEXT
description_en      TEXT

-- Program Details
type                VARCHAR(20) DEFAULT 'video' -- video, audio, mixed
host_ar             VARCHAR(200)
host_en             VARCHAR(200)
featured            BOOLEAN DEFAULT false
episode_count       INTEGER DEFAULT 0
duration_avg        INTEGER DEFAULT 0 -- average episode duration in seconds
launch_date         DATE
latest_episode_date DATE

-- Media & Branding
cover_image_url     VARCHAR(500)
trailer_url         VARCHAR(500)
theme_color         VARCHAR(7) DEFAULT '#6366f1'
logo_url            VARCHAR(500)

-- Analytics & Engagement
view_count          INTEGER DEFAULT 0
subscriber_count    INTEGER DEFAULT 0
rating              DECIMAL(3,2) DEFAULT 0.00
total_duration      INTEGER DEFAULT 0 -- total content duration

-- SEO & Social
meta_description_ar TEXT
meta_description_en TEXT
social_image_url    VARCHAR(500)
keywords_ar         TEXT[]
keywords_en         TEXT[]

-- Timestamps
created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### **Frontend Display Fields**:
- Program card: `title_ar`, `description_ar`, `cover_image_url`, `episode_count`, `host_ar`
- Program page: All fields + episodes list
- Featured section: `featured = true` programs

### **WordPress ACF Fields** (if syncing programs to WP):
```php
// ACF Field Group: "Program Details"
'program_supabase_id' => 'text',           // Link to Supabase
'program_type' => 'select',                // video, audio, mixed
'host_arabic' => 'text',
'host_english' => 'text',
'episode_count' => 'number',
'average_duration' => 'number',
'cover_image' => 'image',
'trailer_video' => 'url',
'theme_color' => 'color_picker',
'subscriber_count' => 'number',
'program_rating' => 'number',
'launch_date' => 'date_picker',
'meta_description_arabic' => 'textarea',
'keywords_arabic' => 'text',
'social_sharing_image' => 'image'
```

---

## 🎵 **2. EPISODES** (Individual Program Episodes)

### **Storage**: Supabase Primary
### **Management**: Admin Dashboard

### **Database Fields** (Supabase `episodes` table):
```sql
-- Core Identity
id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
program_id          UUID REFERENCES programs(id) ON DELETE CASCADE
slug                VARCHAR(300) -- auto-generated from title

-- Content (Bilingual)
title_ar            VARCHAR(300) NOT NULL
title_en            VARCHAR(300)
description_ar      TEXT
description_en      TEXT
transcript_ar       TEXT
transcript_en       TEXT

-- Episode Details
episode_number      INTEGER
season_number       INTEGER DEFAULT 1
duration            INTEGER NOT NULL DEFAULT 0 -- in seconds
status              VARCHAR(20) DEFAULT 'published' -- draft, scheduled, published, archived

-- Media Files
video_url           VARCHAR(500)
audio_url           VARCHAR(500)
thumbnail_url       VARCHAR(500)
poster_image_url    VARCHAR(500)

-- Additional Media
gallery_images      TEXT[] -- array of image URLs
attachments         JSONB -- {filename, url, type, size}

-- Analytics & Engagement
view_count          INTEGER DEFAULT 0
like_count          INTEGER DEFAULT 0
download_count      INTEGER DEFAULT 0
completion_rate     DECIMAL(3,2) DEFAULT 0.00
average_watch_time  INTEGER DEFAULT 0

-- Publishing & SEO
published_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
scheduled_for       TIMESTAMP WITH TIME ZONE
meta_description_ar TEXT
meta_description_en TEXT
tags_ar             TEXT[]
tags_en             TEXT[]

-- Timestamps
created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### **Frontend Display Fields**:
- Episode list: `title_ar`, `description_ar`, `thumbnail_url`, `duration`, `episode_number`
- Episode player: `video_url`, `audio_url`, `transcript_ar`
- Episode page: All fields + related episodes

### **WordPress ACF Fields** (if syncing episodes to WP):
```php
// ACF Field Group: "Episode Details"
'episode_supabase_id' => 'text',
'program_reference' => 'post_object',      // Link to program post
'episode_number' => 'number',
'season_number' => 'number',
'duration_seconds' => 'number',
'video_embed_url' => 'url',
'audio_file_url' => 'url',
'episode_thumbnail' => 'image',
'episode_poster' => 'image',
'transcript_arabic' => 'wysiwyg',
'transcript_english' => 'wysiwyg',
'episode_gallery' => 'gallery',
'episode_attachments' => 'repeater', // sub-fields: file, title, description
'view_count' => 'number',
'like_count' => 'number',
'completion_rate' => 'number',
'episode_tags_arabic' => 'text',
'scheduled_publish' => 'date_time_picker'
```

---

## 📰 **3. ARTICLES** (Blog Posts, News, Opinion Pieces)

### **Storage**: WordPress Primary + Supabase Metadata
### **Management**: WordPress Admin + Dashboard Sync

### **WordPress Fields** (Standard + ACF):
```php
// Standard WordPress Fields
'post_title' => 'text',                   // English title
'post_content' => 'wysiwyg',              // Main content
'post_excerpt' => 'textarea',             // English excerpt
'post_status' => 'select',                // draft, publish, private
'post_date' => 'datetime',
'featured_image' => 'image',
'post_categories' => 'taxonomy',
'post_tags' => 'taxonomy',

// ACF Custom Fields for Arabic Content
'title_arabic' => 'text',
'excerpt_arabic' => 'textarea',
'content_arabic' => 'wysiwyg',
'meta_description_arabic' => 'textarea',
'meta_description_english' => 'textarea',

// Audio & Media
'audio_narration_url' => 'url',
'audio_duration' => 'number',
'reading_time_minutes' => 'number',
'featured_image_alt_arabic' => 'text',
'article_gallery' => 'gallery',
'video_embed' => 'oembed',

// Classification & Features
'article_type' => 'select',               // opinion, news, analysis, interview
'is_featured' => 'true_false',
'is_breaking_news' => 'true_false',
'is_premium' => 'true_false',
'category_color' => 'color_picker',

// Author & Attribution
'author_arabic_name' => 'text',
'author_bio_arabic' => 'textarea',
'guest_author' => 'true_false',
'co_authors' => 'relationship',           // Link to other authors

// SEO & Social
'social_sharing_title' => 'text',
'social_sharing_description' => 'textarea',
'social_sharing_image' => 'image',
'keywords_arabic' => 'text',
'keywords_english' => 'text',
'canonical_url' => 'url',

// Engagement & Analytics
'estimated_views' => 'number',
'social_shares_count' => 'number',
'comments_enabled' => 'true_false',

// Publishing & Scheduling
'publish_to_social' => 'true_false',
'newsletter_include' => 'true_false',
'homepage_featured' => 'true_false',
'sticky_post' => 'true_false'
```

### **Supabase Metadata Fields** (`wp_article_metadata` table):
```sql
-- Link to WordPress
wp_post_id          INTEGER NOT NULL
wp_slug             VARCHAR(200)

-- Arabic Content Enhancement
title_ar            VARCHAR(300)
excerpt_ar          TEXT
content_ar          TEXT -- Full Arabic translation if different from WP

-- Audio & Media
audio_url           VARCHAR(500)
audio_duration      INTEGER
reading_time_ar     INTEGER

-- Categorization (Supabase categories)
category_id         UUID REFERENCES categories(id)
secondary_categories UUID[]
tags_ar             TEXT[]

-- Analytics (Supabase tracking)
view_count          INTEGER DEFAULT 0
read_completion     DECIMAL(3,2) DEFAULT 0.00
engagement_score    DECIMAL(3,2) DEFAULT 0.00

-- Timestamps
synced_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
last_updated        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

---

## ✍️ **4. AUTHORS/WRITERS** (Content Creators, Hosts, Contributors)

### **Storage**: Supabase Primary
### **Management**: Admin Dashboard

### **Database Fields** (Supabase `authors` table):
```sql
-- Core Identity
id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
slug                VARCHAR(200) UNIQUE
wp_user_id          INTEGER -- Link to WordPress user if exists

-- Personal Information (Bilingual)
name_ar             VARCHAR(200) NOT NULL
name_en             VARCHAR(200)
bio_ar              TEXT
bio_en              TEXT
title_ar            VARCHAR(200) -- Job title in Arabic
title_en            VARCHAR(200) -- Job title in English

-- Contact & Media
email               VARCHAR(255)
phone               VARCHAR(50)
avatar_url          VARCHAR(500)
cover_image_url     VARCHAR(500)

-- Social Media Links
social_twitter      VARCHAR(100)
social_facebook     VARCHAR(100)
social_instagram    VARCHAR(100)
social_linkedin     VARCHAR(100)
social_youtube      VARCHAR(100)
social_tiktok       VARCHAR(100)
website_url         VARCHAR(500)
personal_blog_url   VARCHAR(500)

-- Professional Details
location_ar         VARCHAR(100)
location_en         VARCHAR(100)
expertise_tags      TEXT[] -- Areas of expertise
languages_spoken    TEXT[] -- Arabic, English, French, etc.
education_ar        TEXT
education_en        TEXT
experience_years    INTEGER

-- Platform Status
is_verified         BOOLEAN DEFAULT false
is_featured         BOOLEAN DEFAULT false
is_staff            BOOLEAN DEFAULT false
author_level        VARCHAR(20) DEFAULT 'contributor' -- contributor, editor, admin
status              VARCHAR(20) DEFAULT 'active' -- active, inactive, suspended

-- Content Statistics
article_count       INTEGER DEFAULT 0
program_count       INTEGER DEFAULT 0
episode_count       INTEGER DEFAULT 0
total_views         INTEGER DEFAULT 0
follower_count      INTEGER DEFAULT 0

-- SEO & Discovery
meta_description_ar TEXT
meta_description_en TEXT
keywords            TEXT[]

-- Timestamps
joined_date         DATE DEFAULT CURRENT_DATE
created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### **WordPress ACF Fields** (Author Profile Enhancement):
```php
// ACF Field Group: "Author Arabic Profile"
'author_supabase_id' => 'text',
'name_arabic' => 'text',
'bio_arabic' => 'wysiwyg',
'job_title_arabic' => 'text',
'job_title_english' => 'text',
'author_avatar' => 'image',
'author_cover_image' => 'image',
'phone_number' => 'text',
'location_arabic' => 'text',
'location_english' => 'text',
'expertise_areas' => 'checkbox', // predefined options
'languages_spoken' => 'checkbox',
'education_arabic' => 'textarea',
'education_english' => 'textarea',
'experience_years' => 'number',
'is_verified_author' => 'true_false',
'is_featured_author' => 'true_false',
'author_level' => 'select',
'social_media_links' => 'repeater', // platform, url
'personal_website' => 'url',
'author_keywords' => 'text'
```

---

## 📂 **5. CATEGORIES** (Content Classification)

### **Storage**: Supabase Primary
### **Management**: Admin Dashboard

### **Database Fields** (Supabase `categories` table):
```sql
-- Core Identity
id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
slug                VARCHAR(100) UNIQUE NOT NULL
wp_category_id      INTEGER -- Link to WordPress category if exists

-- Content (Bilingual)
name_ar             VARCHAR(100) NOT NULL
name_en             VARCHAR(100)
description_ar      TEXT
description_en      TEXT

-- Visual Design
color               VARCHAR(7) DEFAULT '#6366f1' -- Hex color
icon                VARCHAR(50) DEFAULT 'folder' -- Icon name
background_image    VARCHAR(500)
banner_image        VARCHAR(500)

-- Hierarchy & Organization
parent_id           UUID REFERENCES categories(id)
sort_order          INTEGER DEFAULT 0
level               INTEGER DEFAULT 0 -- 0=top level, 1=subcategory, etc.

-- Content Settings
is_active           BOOLEAN DEFAULT true
is_featured         BOOLEAN DEFAULT false
show_in_menu        BOOLEAN DEFAULT true
show_on_homepage    BOOLEAN DEFAULT true

-- Content Statistics
article_count       INTEGER DEFAULT 0
program_count       INTEGER DEFAULT 0
total_views         INTEGER DEFAULT 0

-- SEO & Discovery
meta_description_ar TEXT
meta_description_en TEXT
keywords_ar         TEXT[]
keywords_en         TEXT[]

-- Timestamps
created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### **WordPress ACF Fields** (Category Enhancement):
```php
// ACF Field Group: "Category Arabic Details"
'category_supabase_id' => 'text',
'name_arabic' => 'text',
'description_arabic' => 'wysiwyg',
'category_color' => 'color_picker',
'category_icon' => 'select', // predefined icon options
'background_image' => 'image',
'banner_image' => 'image',
'is_featured_category' => 'true_false',
'show_in_main_menu' => 'true_false',
'show_on_homepage' => 'true_false',
'sort_order' => 'number',
'meta_description_arabic' => 'textarea',
'category_keywords_arabic' => 'text',
'category_keywords_english' => 'text'
```

---

## 🎙️ **6. PODCASTS** (Audio-First Content)

### **Storage**: Supabase (as specialized Programs)
### **Management**: Admin Dashboard

### **Database Fields** (Extension of `programs` table with podcast-specific fields):
```sql
-- Podcast-Specific Fields (added to programs table)
podcast_rss_url     VARCHAR(500)
podcast_itunes_url  VARCHAR(500)
podcast_spotify_url VARCHAR(500)
podcast_google_url  VARCHAR(500)
podcast_category    VARCHAR(100) -- iTunes category
podcast_language    VARCHAR(10) DEFAULT 'ar'
podcast_explicit    BOOLEAN DEFAULT false
podcast_frequency   VARCHAR(20) -- weekly, biweekly, monthly
podcast_day         VARCHAR(10) -- monday, tuesday, etc.
podcast_time        TIME -- publication time

-- Podcast Branding
podcast_artwork_url VARCHAR(500) -- Square artwork (1400x1400)
intro_audio_url     VARCHAR(500)
outro_audio_url     VARCHAR(500)

-- Podcast Analytics
total_downloads     INTEGER DEFAULT 0
average_listen_time INTEGER DEFAULT 0
retention_rate      DECIMAL(3,2) DEFAULT 0.00
```

### **WordPress ACF Fields** (Podcast-Specific):
```php
// ACF Field Group: "Podcast Details"
'podcast_rss_feed' => 'url',
'itunes_link' => 'url',
'spotify_link' => 'url',
'google_podcasts_link' => 'url',
'podcast_category' => 'select',
'podcast_language' => 'select',
'explicit_content' => 'true_false',
'publication_frequency' => 'select',
'publication_day' => 'select',
'publication_time' => 'time_picker',
'podcast_artwork' => 'image',
'intro_audio' => 'file',
'outro_audio' => 'file',
'total_downloads' => 'number',
'average_listen_duration' => 'number'
```

---

## 📺 **7. VIDEO CONTENT** (Video-First Programs)

### **Storage**: Supabase (as specialized Programs/Episodes)
### **Management**: Admin Dashboard

### **Additional Fields** (for video content):
```sql
-- Video-Specific Fields
video_quality       VARCHAR(10) DEFAULT '1080p' -- 720p, 1080p, 4K
video_format        VARCHAR(10) DEFAULT 'mp4'
video_duration      INTEGER -- in seconds
video_file_size     BIGINT -- in bytes
video_thumbnail_url VARCHAR(500)
video_preview_url   VARCHAR(500) -- Short preview clip

-- Video Platforms
youtube_id          VARCHAR(50)
vimeo_id            VARCHAR(50)
wistia_id           VARCHAR(50)
custom_player_url   VARCHAR(500)

-- Video Analytics
play_count          INTEGER DEFAULT 0
completion_rate     DECIMAL(3,2) DEFAULT 0.00
average_view_time   INTEGER DEFAULT 0
engagement_rate     DECIMAL(3,2) DEFAULT 0.00

-- Video SEO
video_transcript    TEXT
video_chapters      JSONB -- [{time: 120, title: "Chapter 1", description: "..."}]
video_tags          TEXT[]
```

---

## 🏷️ **8. TAGS** (Content Tagging System)

### **Storage**: Both WordPress (standard) + Supabase (Arabic)
### **Management**: Both systems

### **Supabase Fields** (`tags` table):
```sql
id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
name_ar             VARCHAR(100) NOT NULL
name_en             VARCHAR(100)
slug                VARCHAR(100) UNIQUE NOT NULL
wp_tag_id           INTEGER -- Link to WordPress tag
color               VARCHAR(7)
usage_count         INTEGER DEFAULT 0
is_trending         BOOLEAN DEFAULT false
created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

---

## 📊 **Summary of All Content Types**

### **Content Type Distribution**:
1. **Programs** (Supabase) - 25+ fields
2. **Episodes** (Supabase) - 30+ fields  
3. **Articles** (WordPress + Supabase) - 35+ fields
4. **Authors** (Supabase) - 30+ fields
5. **Categories** (Supabase) - 20+ fields
6. **Podcasts** (Supabase extension) - 15+ additional fields
7. **Video Content** (Supabase extension) - 15+ additional fields
8. **Tags** (Both systems) - 10+ fields

### **Total Custom Fields for WordPress ACF**:
- **Programs**: 15 ACF fields
- **Episodes**: 18 ACF fields
- **Articles**: 25 ACF fields (already the most comprehensive)
- **Authors**: 20 ACF fields
- **Categories**: 12 ACF fields
- **Podcasts**: 12 ACF fields
- **Video Content**: 10 ACF fields

**Grand Total**: ~112 custom ACF fields across all content types

This gives you complete control over every aspect of your content with full bilingual support and rich metadata for SEO, analytics, and user experience!