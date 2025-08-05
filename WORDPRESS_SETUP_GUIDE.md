# 🚀 WordPress Setup Guide for Zawaya Platform

## 📋 Overview

This guide will help you set up WordPress as a headless CMS for Zawaya, running in parallel with your existing Supabase system.

## 🎯 Phase 0: WordPress Provisioning

### Step 1: Create WordPress Instance on Cloudways

1. **Sign up for Cloudways**:
   - Go to [Cloudways.com](https://www.cloudways.com)
   - Choose a plan (Start with $12/month for testing)
   - Select server: **DigitalOcean** or **AWS** (recommended)

2. **Launch WordPress Application**:
   - Application: **WordPress**
   - Server Size: **1GB RAM** (minimum for testing)
   - Location: Choose closest to your users
   - Project Name: `zawaya-cms`

3. **Domain Setup**:
   - Point your domain to Cloudways server IP
   - Enable SSL certificate (free Let's Encrypt)
   - Set up `wp.zawaya.com` or similar subdomain

### Step 2: WordPress Initial Configuration

1. **Access WordPress Admin**:
   - URL: `https://your-domain.com/wp-admin`
   - Use credentials provided by Cloudways

2. **Basic Settings**:
   ```
   Settings → General:
   - Site Title: "Zawaya CMS"
   - Tagline: "Editorial Content Management"
   - WordPress Address: https://your-domain.com
   - Site Address: https://your-domain.com
   ```

3. **Permalink Structure**:
   ```
   Settings → Permalinks:
   - Select "Post name" structure
   - Save changes
   ```

### Step 3: Install Required Plugins

Install these plugins via **Plugins → Add New**:

#### 1. Advanced Custom Fields (ACF) Pro
```
Plugin: Advanced Custom Fields PRO
Purpose: Add custom fields for Arabic content
License: Required (purchase from ACF website)
```

#### 2. Application Passwords (Built-in WordPress 5.6+)
```
Feature: Built into WordPress core
Purpose: API authentication for Next.js
Location: Users → Profile → Application Passwords
```

#### 3. WPGraphQL (Optional)
```
Plugin: WPGraphQL
Purpose: GraphQL API (alternative to REST)
Free: Yes
```

#### 4. Webhook Plugin (Custom)
```
Plugin: Custom webhook for revalidation
Purpose: Notify Next.js when content changes
Implementation: See code below
```

### Step 4: Create Application Password

1. **Go to User Profile**:
   - WordPress Admin → Users → Your Profile
   - Scroll to "Application Passwords" section

2. **Generate Password**:
   - Application Name: `Zawaya Next.js App`
   - Click "Add New Application Password"
   - **IMPORTANT**: Copy the generated password immediately
   - Format: `xxxx xxxx xxxx xxxx xxxx xxxx`

3. **Update Environment Variables**:
   ```env
   WP_USERNAME=your_wp_username
   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
   ```

### Step 5: Configure ACF Fields

Create these field groups for Arabic content:

#### Field Group: "Article Enhancements"
```php
Fields to add:
- audio_narration_url (URL field)
- audio_duration (Number field, in seconds)
- reading_time_minutes (Number field)
- featured_image_alt_ar (Text field)
- excerpt_ar (Textarea field)
- meta_description_ar (Text field, max 160 chars)
- is_featured (True/False field)
- category_color (Color Picker field)
```

#### ACF REST API Integration
1. **Enable REST API**:
   - ACF → Field Groups → Article Enhancements
   - Settings → "Show in REST API" = Yes
   - REST API base = `acf`

2. **Test REST Response**:
   ```bash
   curl "https://your-domain.com/wp-json/wp/v2/posts?_embed&per_page=1"
   ```

### Step 6: Test WordPress REST API

#### Basic Posts Endpoint
```bash
# Test public posts
curl "https://your-domain.com/wp-json/wp/v2/posts"

# Test with authentication
curl -H "Authorization: Basic $(echo -n 'username:app_password' | base64)" \
     "https://your-domain.com/wp-json/wp/v2/posts"
```

#### Expected Response Structure
```json
{
  "id": 1,
  "title": {"rendered": "Sample Article"},
  "content": {"rendered": "<p>Article content...</p>"},
  "excerpt": {"rendered": "<p>Article excerpt...</p>"},
  "slug": "sample-article",
  "status": "publish",
  "author": 1,
  "featured_media": 0,
  "acf": {
    "audio_narration_url": "https://...",
    "audio_duration": 300,
    "reading_time_minutes": 5,
    "excerpt_ar": "ملخص المقال بالعربية",
    "is_featured": true
  },
  "_embedded": {
    "author": [{"name": "Author Name"}],
    "wp:featuredmedia": [{"source_url": "https://..."}]
  }
}
```

## 🔧 WordPress Webhook Setup

Add this code to your theme's `functions.php` or create a custom plugin:

```php
<?php
/**
 * Zawaya Revalidation Webhook
 * Notifies Next.js when content changes
 */

function zawaya_revalidate_on_publish($post_id, $post, $update) {
    // Only trigger for published posts
    if ($post->post_status !== 'publish') {
        return;
    }
    
    // Your Next.js revalidation endpoint
    $webhook_url = 'https://your-nextjs-app.com/api/revalidate';
    
    // Determine cache tag based on content
    $tag = 'articles';
    if ($post->post_type === 'page') {
        $tag = 'pages';
    }
    
    // Send revalidation request
    $response = wp_remote_post($webhook_url, [
        'body' => json_encode([
            'tag' => $tag,
            'post_id' => $post_id,
            'post_slug' => $post->post_name
        ]),
        'headers' => [
            'Content-Type' => 'application/json',
            'X-Revalidate-Token' => 'your-secret-token' // Optional security
        ],
        'timeout' => 10
    ]);
    
    // Log for debugging
    if (is_wp_error($response)) {
        error_log('Zawaya revalidation failed: ' . $response->get_error_message());
    }
}

// Hook into post publish/update
add_action('wp_after_insert_post', 'zawaya_revalidate_on_publish', 10, 3);

// Also trigger on post status changes
add_action('transition_post_status', function($new_status, $old_status, $post) {
    if ($new_status === 'publish' && $old_status !== 'publish') {
        zawaya_revalidate_on_publish($post->ID, $post, false);
    }
}, 10, 3);
?>
```

## 🧪 Testing Checklist

### ✅ WordPress Setup Verification

1. **Basic Access**:
   - [ ] WordPress admin accessible
   - [ ] SSL certificate working
   - [ ] Pretty permalinks enabled

2. **REST API**:
   - [ ] `/wp-json/wp/v2/posts` returns data
   - [ ] Application Password authentication works
   - [ ] ACF fields appear in REST response

3. **Content Management**:
   - [ ] Can create/edit posts
   - [ ] ACF fields save properly
   - [ ] Featured images upload correctly

4. **Integration Ready**:
   - [ ] Webhook code installed
   - [ ] Environment variables configured
   - [ ] Test post created with Arabic content

### 🔍 Troubleshooting

#### Common Issues:

1. **REST API Not Working**:
   ```
   Solution: Check permalink structure, ensure pretty permalinks enabled
   ```

2. **Application Password Failed**:
   ```
   Solution: Verify username/password format, check user permissions
   ```

3. **ACF Fields Not in REST**:
   ```
   Solution: Enable "Show in REST API" in ACF field group settings
   ```

4. **CORS Issues**:
   ```
   Solution: Add CORS headers in WordPress or use server-side fetching
   ```

## 🚀 Next Steps

Once WordPress is set up:

1. **Create Sample Content**:
   - Add 3-5 test articles with Arabic content
   - Include ACF fields (audio URLs, reading time, etc.)
   - Set featured images

2. **Test Integration**:
   - Verify REST API responses
   - Test webhook functionality
   - Confirm ACF field data

3. **Ready for Phase 1**:
   - WordPress client implementation
   - Next.js integration
   - Cache and revalidation setup

## 📞 Support

If you encounter issues:

1. **WordPress REST API Handbook**: https://developer.wordpress.org/rest-api/
2. **ACF Documentation**: https://www.advancedcustomfields.com/resources/
3. **Application Passwords Guide**: https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/

---

**🎉 Once complete, you'll have a headless WordPress CMS ready for integration with your Zawaya platform!**