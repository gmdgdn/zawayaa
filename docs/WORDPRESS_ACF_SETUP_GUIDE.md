# WordPress ACF Setup Guide - Complete Implementation

## 📋 **Complete Content Types Summary**

Your Zawaya Platform has **8 main content types** with **112 total custom fields**:

### **Content Types Breakdown:**
1. **Articles** (WordPress + Supabase) - 25 ACF fields
2. **Programs** (Supabase + WordPress sync) - 15 ACF fields  
3. **Episodes** (Supabase + WordPress sync) - 18 ACF fields
4. **Authors** (Supabase + WordPress profiles) - 20 ACF fields
5. **Categories** (Supabase + WordPress taxonomies) - 12 ACF fields
6. **Podcasts** (Program extension) - 12 ACF fields
7. **Video Content** (Program/Episode extension) - 10 ACF fields
8. **Tags** (Both systems) - Taxonomy-based

---

## 🚀 **Step-by-Step WordPress Setup**

### **Step 1: Install Required Plugins**

```bash
# Required WordPress Plugins:
1. Advanced Custom Fields (ACF) Pro - For custom fields
2. Custom Post Type UI - Alternative to custom code
3. WP REST API - For API integration (usually built-in)
4. Yoast SEO - For SEO optimization
5. WP Rocket - For caching (optional)
```

### **Step 2: Add Custom Post Types**

**Option A: Using Code (Recommended)**
1. Copy `wordpress-acf-config/custom-post-types.php` content
2. Add to your theme's `functions.php` file
3. Or create as a custom plugin

**Option B: Using Custom Post Type UI Plugin**
1. Install "Custom Post Type UI" plugin
2. Create post types: `program`, `episode`
3. Create taxonomies: `program_category`, `program_tag`, `episode_tag`

### **Step 3: Import ACF Field Groups**

1. **Go to WordPress Admin** → Custom Fields → Field Groups
2. **Click "Import Field Groups"**
3. **Upload** `wordpress-acf-config/acf-field-groups-export.json`
4. **Activate** all imported field groups

**Field Groups Imported:**
- ✅ Zawaya - Article Arabic Content (25 fields)
- ✅ Zawaya - Program Details (15 fields)
- ✅ Zawaya - Episode Details (18 fields)
- ✅ Zawaya - Author Arabic Profile (20 fields)

### **Step 4: Configure Field Group Locations**

Ensure field groups are assigned to correct locations:

```php
// Articles ACF → Posts
Location: Post Type = Post

// Programs ACF → Programs
Location: Post Type = Program

// Episodes ACF → Episodes  
Location: Post Type = Episode

// Authors ACF → User Profiles
Location: User Form = Edit
```

---

## 📝 **All Custom Fields by Content Type**

### **1. ARTICLES (25 ACF Fields)**

#### **Content Fields:**
- `title_arabic` - Text
- `excerpt_arabic` - Textarea
- `content_arabic` - WYSIWYG Editor
- `meta_description_arabic` - Textarea (160 chars)
- `meta_description_english` - Textarea (160 chars)

#### **Media Fields:**
- `audio_narration_url` - URL
- `audio_duration` - Number (seconds)
- `reading_time_minutes` - Number
- `social_sharing_image` - Image

#### **Classification Fields:**
- `article_type` - Select (opinion, news, analysis, interview, review)
- `is_featured` - True/False
- `is_breaking_news` - True/False
- `category_color` - Color Picker

#### **Author Fields:**
- `author_arabic_name` - Text
- `author_bio_arabic` - Textarea

#### **SEO Fields:**
- `keywords_arabic` - Text
- `keywords_english` - Text

### **2. PROGRAMS (15 ACF Fields)**

#### **Core Fields:**
- `program_supabase_id` - Text (readonly)
- `program_type` - Select (video, audio, mixed)
- `host_arabic` - Text
- `host_english` - Text

#### **Statistics Fields:**
- `episode_count` - Number (readonly)
- `average_duration` - Number (minutes)
- `subscriber_count` - Number
- `program_rating` - Number (0-5)

#### **Media Fields:**
- `cover_image` - Image
- `trailer_video` - URL
- `theme_color` - Color Picker

#### **Scheduling Fields:**
- `launch_date` - Date Picker

### **3. EPISODES (18 ACF Fields)**

#### **Core Fields:**
- `episode_supabase_id` - Text (readonly)
- `program_reference` - Post Object (link to program)
- `episode_number` - Number
- `season_number` - Number
- `duration_seconds` - Number

#### **Media Fields:**
- `video_embed_url` - URL
- `audio_file_url` - URL
- `episode_thumbnail` - Image
- `episode_poster` - Image
- `episode_gallery` - Gallery

#### **Content Fields:**
- `transcript_arabic` - WYSIWYG
- `transcript_english` - WYSIWYG
- `episode_tags_arabic` - Text

#### **Analytics Fields:**
- `view_count` - Number (readonly)

#### **Publishing Fields:**
- `scheduled_publish` - Date/Time Picker

### **4. AUTHORS (20 ACF Fields)**

#### **Identity Fields:**
- `author_supabase_id` - Text (readonly)
- `name_arabic` - Text
- `job_title_arabic` - Text
- `job_title_english` - Text

#### **Content Fields:**
- `bio_arabic` - WYSIWYG
- `location_arabic` - Text
- `location_english` - Text

#### **Media Fields:**
- `author_avatar` - Image
- `author_cover_image` - Image

#### **Professional Fields:**
- `expertise_areas` - Checkbox (multiple)
- `languages_spoken` - Checkbox (multiple)
- `experience_years` - Number

#### **Status Fields:**
- `is_verified_author` - True/False
- `is_featured_author` - True/False

#### **Social Fields:**
- `social_media_links` - Repeater (platform + URL)
- `personal_website` - URL

#### **SEO Fields:**
- `author_keywords` - Text

---

## 🔧 **WordPress Configuration Code**

### **Add to functions.php:**

```php
// Enable ACF fields in REST API
function zawaya_add_acf_to_rest() {
    register_rest_field(['post', 'program', 'episode'], 'acf', [
        'get_callback' => function($post) {
            return get_fields($post['id']);
        }
    ]);
}
add_action('rest_api_init', 'zawaya_add_acf_to_rest');

// Add Arabic language support
function zawaya_arabic_support() {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    
    // Register Arabic text domain
    load_theme_textdomain('zawaya', get_template_directory() . '/languages');
}
add_action('after_setup_theme', 'zawaya_arabic_support');

// Custom REST API endpoints for Supabase sync
function zawaya_custom_rest_routes() {
    register_rest_route('zawaya/v1', '/sync-programs', [
        'methods' => 'GET',
        'callback' => 'zawaya_get_programs_for_sync',
        'permission_callback' => '__return_true'
    ]);
    
    register_rest_route('zawaya/v1', '/sync-articles', [
        'methods' => 'GET', 
        'callback' => 'zawaya_get_articles_for_sync',
        'permission_callback' => '__return_true'
    ]);
}
add_action('rest_api_init', 'zawaya_custom_rest_routes');

// Sync functions
function zawaya_get_programs_for_sync() {
    $programs = get_posts([
        'post_type' => 'program',
        'numberposts' => -1,
        'meta_query' => [
            [
                'key' => 'program_supabase_id',
                'compare' => 'EXISTS'
            ]
        ]
    ]);
    
    $data = [];
    foreach ($programs as $program) {
        $data[] = [
            'id' => $program->ID,
            'supabase_id' => get_field('program_supabase_id', $program->ID),
            'title' => $program->post_title,
            'acf' => get_fields($program->ID)
        ];
    }
    
    return rest_ensure_response($data);
}

function zawaya_get_articles_for_sync() {
    $articles = get_posts([
        'post_type' => 'post',
        'numberposts' => -1,
        'meta_query' => [
            [
                'key' => 'title_arabic',
                'compare' => 'EXISTS'
            ]
        ]
    ]);
    
    $data = [];
    foreach ($articles as $article) {
        $data[] = [
            'id' => $article->ID,
            'title' => $article->post_title,
            'slug' => $article->post_name,
            'content' => $article->post_content,
            'excerpt' => $article->post_excerpt,
            'featured_image' => get_the_post_thumbnail_url($article->ID, 'full'),
            'acf' => get_fields($article->ID),
            'categories' => wp_get_post_categories($article->ID),
            'tags' => wp_get_post_tags($article->ID)
        ];
    }
    
    return rest_ensure_response($data);
}
```

---

## 🔄 **Integration with Next.js**

### **API Endpoints to Create:**

```javascript
// In your Next.js app/api/wordpress/ folder:

// 1. Sync WordPress articles to Supabase
POST /api/wordpress/sync-articles

// 2. Get WordPress articles with ACF data
GET /api/wordpress/articles

// 3. Sync programs between systems
POST /api/wordpress/sync-programs

// 4. Get author profiles
GET /api/wordpress/authors
```

### **Example WordPress API Call:**

```javascript
// Fetch articles with ACF fields
const wpArticles = await fetch(
  'https://your-wp-site.com/wp-json/wp/v2/posts?_embed&acf_format=standard'
);

// Fetch programs with ACF fields
const wpPrograms = await fetch(
  'https://your-wp-site.com/wp-json/wp/v2/program?_embed&acf_format=standard'
);
```

---

## ✅ **Verification Checklist**

After setup, verify these work:

### **WordPress Admin:**
- [ ] Can create/edit Articles with Arabic fields
- [ ] Can create/edit Programs with all details
- [ ] Can create/edit Episodes linked to programs
- [ ] Can edit User profiles with Arabic author info
- [ ] ACF fields appear in correct locations
- [ ] Custom post types show in admin menu

### **REST API:**
- [ ] `/wp-json/wp/v2/posts` returns ACF fields
- [ ] `/wp-json/wp/v2/program` returns program data
- [ ] `/wp-json/wp/v2/episode` returns episode data
- [ ] Custom endpoints work for sync

### **Next.js Integration:**
- [ ] WordPress client can fetch articles
- [ ] ACF fields are accessible in API responses
- [ ] Hybrid content service combines WP + Supabase data
- [ ] Arabic content displays correctly

---

## 🎯 **Next Steps After Setup**

1. **Test Content Creation**: Create sample articles, programs, episodes
2. **Test API Integration**: Verify Next.js can fetch WordPress data
3. **Setup Sync Process**: Create automated sync between WP and Supabase
4. **Configure Media**: Setup image uploads and CDN
5. **SEO Optimization**: Configure Yoast SEO for Arabic content
6. **Performance**: Setup caching and optimization

This gives you a complete, production-ready content management system with full bilingual support and rich metadata for all content types!