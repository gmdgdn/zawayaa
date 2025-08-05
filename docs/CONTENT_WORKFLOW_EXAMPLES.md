# Content Workflow Examples - Step by Step

## 🎬 **Scenario 1: Adding a New TV Program**

### **Step-by-Step Process:**

#### **Step 1: Admin Dashboard Access**
```
Admin visits: http://localhost:3000/admin/content
↓
Middleware checks authentication (disabled in dev)
↓
Dashboard loads with Programs tab active
```

#### **Step 2: Create Program Form**
```
Admin clicks "Add Program"
↓
Form appears with fields:
- Arabic Title: "برنامج الأسبوع الثقافي"
- English Title: "Cultural Week Program"  
- Arabic Description: "برنامج أسبوعي يناقش الثقافة والفن"
- Type: Video
- Host: "د. سارة الثقافية"
- Cover Image URL: "https://example.com/culture-cover.jpg"
- Slug: "cultural-week"
- Featured: ✓
```

#### **Step 3: Data Processing**
```
Form submission → handleSaveProgram()
↓
POST request to /api/admin/programs
↓
Next.js API route processes data
↓
Supabase INSERT into programs table
↓
Database generates UUID and timestamps
↓
Success response back to dashboard
```

#### **Step 4: Database State**
```sql
-- New record in Supabase programs table:
INSERT INTO programs (
  id, title_ar, title_en, description_ar, 
  type, host_ar, cover_image_url, slug, 
  featured, status, created_at
) VALUES (
  'uuid-generated',
  'برنامج الأسبوع الثقافي',
  'Cultural Week Program',
  'برنامج أسبوعي يناقش الثقافة والفن',
  'video',
  'د. سارة الثقافية', 
  'https://example.com/culture-cover.jpg',
  'cultural-week',
  true,
  'active',
  NOW()
);
```

#### **Step 5: Frontend Display**
```
User visits: http://localhost:3000/ar/programs
↓
Page component calls API: /api/programs
↓
API queries Supabase programs table
↓
Returns program data including new program
↓
React renders program cards with Arabic content
```

---

## 📝 **Scenario 2: Publishing an Article (Hybrid)**

### **WordPress Side:**

#### **Step 1: Content Creation**
```
Editor logs into WordPress admin
↓
Creates new post with:
- Title: "The Future of Arab Culture"
- Content: Full article text with images
- Featured Image: Uploaded to WordPress media library
- Categories: Culture, Opinion
- SEO: Meta description, keywords
```

#### **Step 2: WordPress Database**
```sql
-- WordPress stores in wp_posts:
INSERT INTO wp_posts (
  post_title, post_content, post_status,
  post_type, post_date
) VALUES (
  'The Future of Arab Culture',
  '<p>Article content with HTML...</p>',
  'publish',
  'post',
  NOW()
);

-- WordPress stores metadata:
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES
(123, '_thumbnail_id', '456'),
(123, 'reading_time', '8');
```

### **Supabase Side (Arabic Enhancement):**

#### **Step 3: Arabic Metadata Addition**
```
Admin visits: http://localhost:3000/admin/content
↓
Switches to "Articles" tab
↓
Sees WordPress articles synced
↓
Clicks "Add Arabic Metadata" for article ID 123
↓
Fills form:
- Arabic Title: "مستقبل الثقافة العربية"
- Arabic Excerpt: "مقال يناقش التحديات والفرص"
- Audio Narration URL: "https://soundcloud.com/narration-123"
- Category Mapping: Maps to Supabase category "ثقافة وفكر"
```

#### **Step 4: Supabase Storage**
```sql
-- Stores Arabic metadata:
INSERT INTO wp_article_metadata (
  wp_post_id, title_ar, excerpt_ar, 
  audio_url, category_id
) VALUES (
  123,
  'مستقبل الثقافة العربية',
  'مقال يناقش التحديات والفرص',
  'https://soundcloud.com/narration-123',
  'uuid-of-culture-category'
);
```

### **Frontend Integration:**

#### **Step 5: Hybrid Content Display**
```
User visits: http://localhost:3000/ar/articles/future-of-arab-culture
↓
Next.js page component loads
↓
API calls both WordPress and Supabase:

// WordPress API call
const wpData = await fetch('https://wordpress-site.com/wp-json/wp/v2/posts/123')

// Supabase query
const { data: arabicMeta } = await supabase
  .from('wp_article_metadata')
  .select('*')
  .eq('wp_post_id', 123)

↓
Combines data and renders:
- WordPress: English content, images, HTML
- Supabase: Arabic title, audio player, Arabic categories
```

---

## 🎵 **Scenario 3: Adding Episodes to a Program**

### **Step 1: Episode Creation**
```
Admin in dashboard clicks "Episodes" tab
↓
Clicks "Add Episode"
↓
Selects program: "Cultural Week Program"
↓
Fills episode form:
- Arabic Title: "الحلقة الأولى: الفن المعاصر"
- English Title: "Episode 1: Contemporary Art"
- Episode Number: 1
- Duration: 45 minutes (2700 seconds)
- Video URL: "https://youtube.com/watch?v=abc123"
- Audio URL: "https://soundcloud.com/episode-1"
- Thumbnail: "https://example.com/ep1-thumb.jpg"
```

### **Step 2: Database Processing**
```
POST /api/admin/episodes
↓
API validates program_id exists
↓
Inserts episode into Supabase
↓
Triggers database function to update program.episode_count
↓
Returns success with episode data
```

### **Step 3: Database State**
```sql
-- New episode record:
INSERT INTO episodes (
  program_id, title_ar, title_en,
  episode_number, duration, video_url,
  audio_url, thumbnail_url, status
) VALUES (
  'program-uuid',
  'الحلقة الأولى: الفن المعاصر',
  'Episode 1: Contemporary Art',
  1, 2700,
  'https://youtube.com/watch?v=abc123',
  'https://soundcloud.com/episode-1',
  'https://example.com/ep1-thumb.jpg',
  'published'
);

-- Auto-update program stats:
UPDATE programs 
SET episode_count = episode_count + 1,
    latest_episode_date = NOW()
WHERE id = 'program-uuid';
```

### **Step 4: Frontend Display**
```
User visits: http://localhost:3000/ar/programs/cultural-week
↓
Program page loads with episodes list
↓
Shows episode with:
- Arabic title and description
- Video player embedded
- Audio download option
- Episode metadata (duration, number)
```

---

## 🔄 **Scenario 4: Content Editing Workflow**

### **Editing a Program:**

#### **Step 1: Edit Initiation**
```
Admin in dashboard sees program list
↓
Clicks "Edit" button on "Cultural Week Program"
↓
Form pre-populates with existing data:
- handleEditProgram(program) called
- setEditingItem(program) sets current program
- setShowAddForm(true) shows form
- Form fields filled with program.title_ar, etc.
```

#### **Step 2: Update Processing**
```
Admin modifies:
- Changes host from "د. سارة الثقافية" to "د. أحمد الخبير"
- Updates cover image URL
- Adds English description
↓
Form submission calls handleSaveProgram()
↓
PUT request to /api/admin/programs/[program-id]
↓
API updates Supabase record
↓
Frontend refreshes program list
```

#### **Step 3: Database Update**
```sql
UPDATE programs 
SET 
  host_ar = 'د. أحمد الخبير',
  cover_image_url = 'https://new-image.com/cover.jpg',
  description_en = 'Weekly program about culture and art',
  updated_at = NOW()
WHERE id = 'program-uuid';
```

---

## 📊 **Data Flow Summary**

### **Content Creation Flow:**
```
Admin Input → Form Validation → API Route → Database → Frontend Update
```

### **Content Display Flow:**
```
User Request → Next.js Page → API Call → Database Query → React Render
```

### **Hybrid Content Flow:**
```
WordPress Content + Supabase Metadata → API Merge → Unified Display
```

### **Real-time Updates:**
```
Database Change → Supabase Realtime → Frontend Subscription → UI Update
```

## 🎯 **Key Benefits of This System**

1. **Separation of Concerns**: Each system handles what it does best
2. **Arabic-First**: Native Arabic support throughout the stack
3. **Flexible Content Types**: Different workflows for different content
4. **Real-time Updates**: Immediate reflection of changes
5. **Scalable Architecture**: Can handle growing content and users
6. **Developer-Friendly**: Clear APIs and data flows
7. **Content Creator-Friendly**: Familiar interfaces where appropriate

This architecture gives you the power to manage complex, multilingual content while maintaining simplicity for your content creators and administrators!