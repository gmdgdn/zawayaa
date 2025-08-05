# Content Management Examples

## 1. Adding a Program via Dashboard

### Step-by-Step Process:
1. Go to `/admin/content`
2. Click "Add Program"
3. Fill in the form:

```
Arabic Title: برنامج الأسبوع السياسي
English Title: Political Week Program
Arabic Description: برنامج أسبوعي يناقش أهم الأحداث السياسية في المنطقة العربية
English Description: Weekly program discussing major political events in the Arab region
Type: Video
Status: Active
Host (Arabic): د. أحمد الخبير
Host (English): Dr. Ahmed Al-Khabeer
Cover Image URL: https://example.com/political-week-cover.jpg
URL Slug: political-week
Featured: ✓ (checked)
```

4. Click "Add Program"

### Result:
- Program created in Supabase
- Available at `/ar/programs/political-week`
- Shows in programs list
- Can add episodes to it

## 2. Adding Episodes to a Program

### Via API:
```javascript
const episodeData = {
  program_id: "uuid-of-program",
  title_ar: "الحلقة الأولى: الانتخابات الأمريكية",
  title_en: "Episode 1: US Elections",
  description_ar: "تحليل شامل للانتخابات الأمريكية وتأثيرها على المنطقة",
  description_en: "Comprehensive analysis of US elections and their impact on the region",
  video_url: "https://youtube.com/watch?v=xyz",
  audio_url: "https://soundcloud.com/episode1",
  thumbnail_url: "https://example.com/episode1-thumb.jpg",
  duration: 2700, // 45 minutes in seconds
  episode_number: 1,
  season_number: 1,
  status: "published"
};

fetch('/api/admin/episodes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(episodeData)
});
```

## 3. WordPress + Supabase Hybrid Articles

### WordPress Side (Articles):
1. Create post in WordPress admin
2. Add ACF fields:
   - `audio_narration_url`: URL to Arabic audio
   - `reading_time_minutes`: Estimated reading time
   - `excerpt_ar`: Arabic excerpt
   - `is_featured`: Featured article checkbox

### Supabase Side (Metadata):
```sql
-- Link WordPress article to Supabase categories
INSERT INTO wp_article_categories (wp_post_id, category_id) 
VALUES (123, 'uuid-of-category');

-- Add Arabic author info
INSERT INTO authors (name_ar, name_en, wp_user_id) 
VALUES ('د. سارة الكاتبة', 'Dr. Sara Al-Katiba', 5);
```

## 4. Bulk Content Import via SQL

### Import Multiple Programs:
```sql
INSERT INTO programs (title_ar, title_en, description_ar, type, host_ar, slug, status) VALUES
('برنامج الثقافة والفن', 'Culture & Art Program', 'برنامج يستكشف الثقافة والفن في العالم العربي', 'video', 'ريم الفنانة', 'culture-art', 'active'),
('بودكاست التكنولوجيا', 'Tech Podcast', 'بودكاست أسبوعي عن التكنولوجيا والابتكار', 'audio', 'أحمد التقني', 'tech-podcast', 'active'),
('حوارات اقتصادية', 'Economic Dialogues', 'حوارات مع خبراء الاقتصاد', 'mixed', 'د. محمد الاقتصادي', 'economic-dialogues', 'active');
```

### Import Episodes for Programs:
```sql
-- Get program IDs first
WITH program_ids AS (
  SELECT id, slug FROM programs WHERE slug IN ('culture-art', 'tech-podcast')
)
INSERT INTO episodes (program_id, title_ar, title_en, episode_number, duration, status)
SELECT 
  p.id,
  'الحلقة الأولى',
  'Episode 1',
  1,
  1800,
  'published'
FROM program_ids p WHERE p.slug = 'culture-art';
```

## 5. Content Management Workflows

### Workflow 1: New Program Launch
1. **Planning**: Define program concept, host, format
2. **Setup**: Create program in dashboard with all details
3. **Content**: Record and upload first 3 episodes
4. **Launch**: Set program as featured, announce
5. **Maintenance**: Regular episode uploads, analytics review

### Workflow 2: Article Publishing (Hybrid)
1. **WordPress**: Create article with content and media
2. **Supabase**: Add Arabic metadata and categorization
3. **Audio**: Generate/upload Arabic narration
4. **SEO**: Optimize for Arabic search terms
5. **Distribution**: Share across social platforms

### Workflow 3: Content Updates
1. **Edit**: Use dashboard edit buttons or API
2. **Preview**: Check changes on frontend
3. **Publish**: Update status to active
4. **Cache**: Clear relevant cache tags
5. **Monitor**: Track engagement metrics

## 6. Media Management

### Image Upload Process:
1. **Upload**: Use file upload service (Cloudinary, AWS S3)
2. **Optimize**: Compress and resize for web
3. **Store URL**: Save URL in database
4. **Display**: Use Next.js Image component for optimization

### Video/Audio Hosting:
- **YouTube**: For public video content
- **Vimeo**: For premium/private content  
- **SoundCloud**: For podcast episodes
- **AWS S3**: For direct file hosting
- **CDN**: Use CloudFront for global delivery

## 7. API Usage Examples

### Get All Programs:
```javascript
const response = await fetch('/api/programs');
const { data } = await response.json();
```

### Create New Episode:
```javascript
const newEpisode = await fetch('/api/admin/episodes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    program_id: 'program-uuid',
    title_ar: 'عنوان الحلقة',
    duration: 1800,
    video_url: 'https://youtube.com/watch?v=abc'
  })
});
```

### Update Program:
```javascript
const updated = await fetch('/api/admin/programs/program-uuid', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title_ar: 'العنوان المحدث',
    featured: true
  })
});
```

This comprehensive system gives you full control over all content types with multiple management interfaces!