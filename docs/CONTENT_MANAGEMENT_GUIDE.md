# Zawaya Platform - Content Management Guide

## Content Flow Architecture

### 1. **Content Sources**
- **WordPress (Primary)**: Articles, posts, media
- **Supabase (Secondary)**: Programs, episodes, authors, categories
- **Hybrid System**: Combines both sources

### 2. **Content Types**

#### A. **Articles** (WordPress + Supabase)
- **WordPress**: Content, images, SEO
- **Supabase**: Arabic metadata, audio narration
- **Fields**: title_ar, title_en, content, excerpt, featured_image, audio_url, reading_time

#### B. **Programs** (Supabase)
- **Fields**: title_ar, title_en, description, cover_image_url, host, type (video/audio/mixed)
- **Related**: Episodes (one-to-many)

#### C. **Episodes** (Supabase)
- **Fields**: title_ar, title_en, description, video_url, audio_url, thumbnail_url, duration
- **Related**: Belongs to Program

#### D. **Authors** (Supabase)
- **Fields**: name_ar, name_en, bio, avatar_url, social_links, expertise_tags

#### E. **Categories** (Supabase)
- **Fields**: name_ar, name_en, slug, color, icon

### 3. **Content Management Methods**

#### Method 1: **Admin Dashboard** (Web Interface)
- Create/Edit/Delete all content types
- Upload images and media
- Preview content
- Bulk operations

#### Method 2: **WordPress Admin** (Articles only)
- WordPress dashboard for articles
- ACF fields for Arabic content
- Media library management

#### Method 3: **API Endpoints** (Programmatic)
- REST APIs for all operations
- Bulk import/export
- Third-party integrations

#### Method 4: **Direct SQL** (Database)
- Bulk operations
- Data migration
- Advanced queries

## Content Workflow Examples

### Adding a New Program with Episodes
1. Create program in dashboard
2. Upload cover image
3. Add episodes with media files
4. Publish and preview

### Adding Articles (Hybrid)
1. Create in WordPress OR Supabase
2. Add Arabic metadata
3. Upload audio narration
4. Set categories and tags
5. Publish across both systems