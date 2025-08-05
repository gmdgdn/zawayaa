# WordPress Configuration Guide

This guide outlines the required WordPress configuration for the Zawaya platform migration.

## Prerequisites

- WordPress 6.0 or higher
- Advanced Custom Fields (ACF) Pro plugin
- HTTPS enabled (required for Application Passwords)
- REST API enabled (default in WordPress)

## 1. ACF Field Groups Configuration

### Article Fields (Post Type: `post`)

Create an ACF field group named "Article Fields" with these fields:

```
Field Group: Article Fields
Location: Post Type = Post

Fields:
├── title_arabic (Text)
├── excerpt_arabic (Textarea)
├── content_arabic (Wysiwyg Editor)
├── author_arabic_name (Text)
├── author_bio_arabic (Textarea)
├── audio_narration_url (URL)
├── audio_duration (Number)
├── social_sharing_image (Image)
├── reading_time_minutes (Number)
├── category_color (Color Picker)
├── is_featured (True/False)
├── is_breaking_news (True/False)
├── meta_description_arabic (Textarea)
└── keywords_arabic (Text)
```

**Important**: Enable "Show in REST API" for this field group.

### Program Fields (Post Type: `program`)

Create an ACF field group named "Program Fields":

```
Field Group: Program Fields
Location: Post Type = Program

Fields:
├── host_arabic (Text)
├── program_type (Select: video, audio, mixed)
├── theme_color (Color Picker)
├── cover_image (Image)
├── episode_count (Number)
├── average_duration (Number)
├── subscriber_count (Number)
├── program_rating (Number)
└── trailer_video (URL)
```

**Important**: Enable "Show in REST API" for this field group.

### Episode Fields (Post Type: `episode`)

Create an ACF field group named "Episode Fields":

```
Field Group: Episode Fields
Location: Post Type = Episode

Fields:
├── video_embed_url (URL)
├── audio_file_url (URL)
├── episode_poster (Image)
├── episode_thumbnail (Image)
├── season_number (Number)
├── episode_number (Number)
├── duration_seconds (Number)
├── transcript_arabic (Textarea)
├── episode_gallery (Gallery)
├── episode_tags_arabic (Text)
└── scheduled_publish (Date Time Picker)
```

**Important**: Enable "Show in REST API" for this field group.

### Author Fields (Post Type: `user`)

Create an ACF field group named "Author Fields":

```
Field Group: Author Fields
Location: User Form = All

Fields:
├── name_arabic (Text)
├── job_title_arabic (Text)
├── bio_arabic (Textarea)
├── location_arabic (Text)
├── author_avatar (Image)
├── author_cover_image (Image)
├── is_verified_author (True/False)
├── is_featured_author (True/False)
├── expertise_areas (Repeater)
│   └── area (Text)
├── languages_spoken (Repeater)
│   └── language (Text)
└── social_media_links (Repeater)
    ├── platform (Text)
    └── url (URL)
```

**Important**: Enable "Show in REST API" for this field group.

## 2. Custom Post Types

### Programs CPT

Add this to your theme's `functions.php` or a plugin:

```php
function register_program_post_type() {
    register_post_type('program', array(
        'labels' => array(
            'name' => 'Programs',
            'singular_name' => 'Program',
        ),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true, // REQUIRED for REST API
        'rest_base' => 'programs',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-video-alt3',
    ));
}
add_action('init', 'register_program_post_type');
```

### Episodes CPT

```php
function register_episode_post_type() {
    register_post_type('episode', array(
        'labels' => array(
            'name' => 'Episodes',
            'singular_name' => 'Episode',
        ),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true, // REQUIRED for REST API
        'rest_base' => 'episodes',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-playlist-video',
    ));
}
add_action('init', 'register_episode_post_type');
```

## 3. Application Passwords Setup

### Enable Application Passwords

1. Go to **Users → Your Profile**
2. Scroll down to **Application Passwords**
3. Enter application name: "Zawaya Next.js App"
4. Click **Add New Application Password**
5. Copy the generated password (you won't see it again)

### Environment Variables

Add these to your Next.js `.env.local`:

```env
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your-username
WORDPRESS_APP_PASSWORD=generated-app-password
```

## 4. REST API Verification

### Test Basic Endpoints

```bash
# Test posts endpoint
curl "https://your-site.com/wp-json/wp/v2/posts?per_page=1"

# Test programs endpoint
curl "https://your-site.com/wp-json/wp/v2/programs?per_page=1"

# Test with ACF fields
curl "https://your-site.com/wp-json/wp/v2/posts?per_page=1&acf_format=standard"
```

### Test Authentication

```bash
# Test authenticated request
curl -H "Authorization: Basic $(echo -n 'username:app_password' | base64)" \
     "https://your-site.com/wp-json/wp/v2/users/me"
```

## 5. Revalidation Webhook Plugin

### Install Zawaya Revalidate Plugin

Create a custom plugin file `zawaya-revalidate.php`:

```php
<?php
/**
 * Plugin Name: Zawaya Revalidate
 * Description: Triggers Next.js cache revalidation on content updates
 * Version: 1.0
 */

class ZawayaRevalidate {
    private $revalidate_url;
    private $secret;

    public function __construct() {
        $this->revalidate_url = get_option('zawaya_revalidate_url', '');
        $this->secret = get_option('zawaya_revalidate_secret', '');
        
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'admin_menu'));
    }

    public function init() {
        // Hook into post save events
        add_action('save_post', array($this, 'trigger_revalidation'), 10, 2);
        add_action('delete_post', array($this, 'trigger_revalidation_delete'));
        add_action('user_register', array($this, 'trigger_user_revalidation'));
        add_action('profile_update', array($this, 'trigger_user_revalidation'));
    }

    public function trigger_revalidation($post_id, $post) {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        $content_type = $post->post_type === 'post' ? 'post' : $post->post_type;
        
        $this->send_webhook(array(
            'content_type' => $content_type,
            'content_id' => $post_id,
            'content_slug' => $post->post_name,
            'action' => $post->post_status === 'publish' ? 'publish' : 'update'
        ));
    }

    public function trigger_user_revalidation($user_id) {
        $this->send_webhook(array(
            'content_type' => 'user',
            'content_id' => $user_id,
            'action' => 'update'
        ));
    }

    private function send_webhook($data) {
        if (empty($this->revalidate_url) || empty($this->secret)) {
            return;
        }

        $data['secret'] = $this->secret;

        wp_remote_post($this->revalidate_url, array(
            'body' => json_encode($data),
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'timeout' => 10,
        ));
    }

    public function admin_menu() {
        add_options_page(
            'Zawaya Revalidate Settings',
            'Zawaya Revalidate',
            'manage_options',
            'zawaya-revalidate',
            array($this, 'admin_page')
        );
    }

    public function admin_page() {
        if (isset($_POST['submit'])) {
            update_option('zawaya_revalidate_url', sanitize_url($_POST['revalidate_url']));
            update_option('zawaya_revalidate_secret', sanitize_text_field($_POST['secret']));
            echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
        }

        $revalidate_url = get_option('zawaya_revalidate_url', '');
        $secret = get_option('zawaya_revalidate_secret', '');
        ?>
        <div class="wrap">
            <h1>Zawaya Revalidate Settings</h1>
            <form method="post">
                <table class="form-table">
                    <tr>
                        <th scope="row">Revalidate URL</th>
                        <td>
                            <input type="url" name="revalidate_url" value="<?php echo esc_attr($revalidate_url); ?>" class="regular-text" />
                            <p class="description">e.g., https://your-nextjs-site.com/api/revalidate</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Secret</th>
                        <td>
                            <input type="text" name="secret" value="<?php echo esc_attr($secret); ?>" class="regular-text" />
                            <p class="description">Must match REVALIDATION_SECRET in Next.js</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}

new ZawayaRevalidate();
```

### Configure Plugin

1. Go to **Settings → Zawaya Revalidate**
2. Set **Revalidate URL**: `https://your-nextjs-site.com/api/revalidate`
3. Set **Secret**: Same value as `REVALIDATION_SECRET` in Next.js
4. Save settings

## 6. Verification Checklist

### ACF Configuration
- [ ] All field groups created with correct field names
- [ ] "Show in REST API" enabled for all field groups
- [ ] Fields appear in REST API responses with `?acf_format=standard`

### Custom Post Types
- [ ] Programs CPT registered with `show_in_rest => true`
- [ ] Episodes CPT registered with `show_in_rest => true`
- [ ] CPT endpoints accessible via REST API

### Authentication
- [ ] Application Password generated
- [ ] HTTPS enabled on WordPress site
- [ ] Authentication works with REST API

### Webhooks
- [ ] Zawaya Revalidate plugin installed and configured
- [ ] Webhook URL and secret configured
- [ ] Test webhook triggers on content publish/update

## 7. Testing Commands

Run these scripts to verify configuration:

```bash
# Check endpoint accessibility
node scripts/check-wp-endpoints.js

# Full configuration verification (requires credentials)
WORDPRESS_URL=https://your-site.com \
WORDPRESS_USERNAME=your-username \
WORDPRESS_APP_PASSWORD=your-app-password \
node scripts/verify-wordpress-config.js
```

## Troubleshooting

### Common Issues

1. **ACF fields not appearing in REST API**
   - Check "Show in REST API" is enabled
   - Verify field group location rules
   - Test with `?acf_format=standard` parameter

2. **Custom post types not accessible**
   - Ensure `show_in_rest => true` in registration
   - Check `rest_base` is set correctly
   - Verify post type is public

3. **Authentication failing**
   - Confirm HTTPS is enabled
   - Check Application Password is correct
   - Verify username is correct

4. **Webhooks not triggering**
   - Check plugin is activated
   - Verify URL and secret are configured
   - Test with manual post publish

### Debug Mode

Enable WordPress debug mode in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Check `/wp-content/debug.log` for errors.