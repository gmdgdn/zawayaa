<?php
/**
 * Plugin Name: Zawaya SCF Revalidate
 * Description: Enhanced revalidation plugin with SCF field change detection
 * Version: 2.0
 * Author: Zawaya Team
 */

class ZawayaSCFRevalidate {
    private $revalidate_url;
    private $secret;
    private $previous_meta = [];

    public function __construct() {
        $this->revalidate_url = get_option('zawaya_revalidate_url', '');
        $this->secret = get_option('zawaya_revalidate_secret', '');
        
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'admin_menu'));
    }

    public function init() {
        // Hook into post save events with priority to capture before/after states
        add_action('pre_post_update', array($this, 'capture_pre_update_state'), 10, 2);
        add_action('save_post', array($this, 'trigger_scf_revalidation'), 20, 2);
        add_action('delete_post', array($this, 'trigger_revalidation_delete'));
        
        // Hook into user/author updates
        add_action('profile_update', array($this, 'capture_user_pre_update'), 10, 1);
        add_action('profile_update', array($this, 'trigger_user_scf_revalidation'), 20, 1);
        add_action('user_register', array($this, 'trigger_user_revalidation'));
    }

    /**
     * Capture post state before update to detect field changes
     */
    public function capture_pre_update_state($post_id, $data) {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        // Get current ACF fields
        $current_fields = get_fields($post_id);
        $this->previous_meta[$post_id] = $current_fields ?: [];
    }

    /**
     * Capture user state before update
     */
    public function capture_user_pre_update($user_id) {
        $current_fields = get_fields('user_' . $user_id);
        $this->previous_meta['user_' . $user_id] = $current_fields ?: [];
    }

    /**
     * Trigger SCF-aware revalidation for posts
     */
    public function trigger_scf_revalidation($post_id, $post) {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        // Get current ACF fields
        $current_fields = get_fields($post_id) ?: [];
        $previous_fields = isset($this->previous_meta[$post_id]) ? $this->previous_meta[$post_id] : [];

        // Detect changed fields
        $changed_fields = $this->detect_field_changes($previous_fields, $current_fields);
        $field_changes = $this->get_field_change_details($previous_fields, $current_fields, $changed_fields);

        // Determine content type
        $content_type = $post->post_type === 'post' ? 'post' : $post->post_type;

        // Create SCF-aware payload
        $payload = array(
            'secret' => $this->secret,
            'content_type' => $content_type,
            'content_id' => $post_id,
            'content_slug' => $post->post_name,
            'action' => $post->post_status === 'publish' ? 'publish' : 'update',
            'changed_fields' => $changed_fields,
            'field_changes' => $field_changes,
            'cascade' => true,
            'priority' => $this->determine_priority($changed_fields, $field_changes)
        );

        $this->send_webhook($payload);

        // Clean up stored meta
        unset($this->previous_meta[$post_id]);
    }

    /**
     * Trigger SCF-aware revalidation for users
     */
    public function trigger_user_scf_revalidation($user_id) {
        $user = get_user_by('id', $user_id);
        if (!$user) return;

        // Get current ACF fields
        $current_fields = get_fields('user_' . $user_id) ?: [];
        $previous_fields = isset($this->previous_meta['user_' . $user_id]) ? $this->previous_meta['user_' . $user_id] : [];

        // Detect changed fields
        $changed_fields = $this->detect_field_changes($previous_fields, $current_fields);
        $field_changes = $this->get_field_change_details($previous_fields, $current_fields, $changed_fields);

        // Create SCF-aware payload
        $payload = array(
            'secret' => $this->secret,
            'content_type' => 'user',
            'content_id' => $user_id,
            'content_slug' => $user->user_nicename,
            'action' => 'update',
            'changed_fields' => $changed_fields,
            'field_changes' => $field_changes,
            'cascade' => true,
            'priority' => $this->determine_priority($changed_fields, $field_changes)
        );

        $this->send_webhook($payload);

        // Clean up stored meta
        unset($this->previous_meta['user_' . $user_id]);
    }

    /**
     * Detect which fields have changed
     */
    private function detect_field_changes($previous, $current) {
        $changed_fields = [];

        // Check for new or changed fields
        foreach ($current as $field_name => $current_value) {
            $previous_value = isset($previous[$field_name]) ? $previous[$field_name] : null;
            
            if ($this->values_different($previous_value, $current_value)) {
                $changed_fields[] = $field_name;
            }
        }

        // Check for removed fields
        foreach ($previous as $field_name => $previous_value) {
            if (!isset($current[$field_name]) && !empty($previous_value)) {
                $changed_fields[] = $field_name;
            }
        }

        return array_unique($changed_fields);
    }

    /**
     * Get detailed information about field changes
     */
    private function get_field_change_details($previous, $current, $changed_fields) {
        $field_changes = [];

        foreach ($changed_fields as $field_name) {
            $old_value = isset($previous[$field_name]) ? $previous[$field_name] : null;
            $new_value = isset($current[$field_name]) ? $current[$field_name] : null;

            $field_changes[$field_name] = array(
                'old_value' => $old_value,
                'new_value' => $new_value,
                'change_type' => $this->determine_change_type($field_name, $old_value, $new_value)
            );
        }

        return $field_changes;
    }

    /**
     * Determine the type of change for a field
     */
    private function determine_change_type($field_name, $old_value, $new_value) {
        // Featured toggles
        if (in_array($field_name, ['is_featured', 'is_featured_author'])) {
            return 'featured_toggle';
        }

        // Breaking news toggle
        if ($field_name === 'is_breaking_news') {
            return 'breaking_news_toggle';
        }

        // Content updates
        if (in_array($field_name, ['title_arabic', 'content_arabic', 'excerpt_arabic'])) {
            return 'content_update';
        }

        // Media changes
        if (in_array($field_name, ['cover_image', 'episode_thumbnail', 'author_avatar', 'social_sharing_image'])) {
            return 'media_change';
        }

        // SEO changes
        if (in_array($field_name, ['meta_description_arabic', 'keywords_arabic'])) {
            return 'seo_change';
        }

        // Program type changes
        if ($field_name === 'program_type') {
            return 'program_type_change';
        }

        // Episode media changes
        if (in_array($field_name, ['video_embed_url', 'audio_file_url'])) {
            return 'episode_media_change';
        }

        // Author verification changes
        if (in_array($field_name, ['is_verified_author'])) {
            return 'author_verification_change';
        }

        return 'content_update';
    }

    /**
     * Determine revalidation priority based on changed fields
     */
    private function determine_priority($changed_fields, $field_changes) {
        $high_priority_fields = ['is_featured', 'is_breaking_news', 'is_featured_author', 'title_arabic', 'content_arabic'];
        $medium_priority_fields = ['excerpt_arabic', 'category_color', 'audio_narration_url', 'cover_image', 'program_type'];

        foreach ($changed_fields as $field) {
            if (in_array($field, $high_priority_fields)) {
                return 'high';
            }
        }

        foreach ($changed_fields as $field) {
            if (in_array($field, $medium_priority_fields)) {
                return 'normal';
            }
        }

        return 'low';
    }

    /**
     * Check if two values are different
     */
    private function values_different($old, $new) {
        // Handle arrays/objects
        if (is_array($old) || is_object($old) || is_array($new) || is_object($new)) {
            return serialize($old) !== serialize($new);
        }

        // Handle boolean values (ACF stores as '1' or '')
        if (is_bool($old) || is_bool($new) || $old === '1' || $old === '' || $new === '1' || $new === '') {
            $old_bool = !empty($old) && $old !== '0';
            $new_bool = !empty($new) && $new !== '0';
            return $old_bool !== $new_bool;
        }

        // Handle regular values
        return (string)$old !== (string)$new;
    }

    /**
     * Send webhook with retry logic
     */
    private function send_webhook($data) {
        if (empty($this->revalidate_url) || empty($this->secret)) {
            error_log('Zawaya SCF Revalidate: Missing URL or secret');
            return;
        }

        $response = wp_remote_post($this->revalidate_url, array(
            'body' => json_encode($data),
            'headers' => array(
                'Content-Type' => 'application/json',
                'User-Agent' => 'WordPress/' . get_bloginfo('version') . '; ' . get_bloginfo('url')
            ),
            'timeout' => 15,
            'blocking' => false // Don't block page load
        ));

        if (is_wp_error($response)) {
            error_log('Zawaya SCF Revalidate Error: ' . $response->get_error_message());
        }
    }

    /**
     * Batch revalidation for multiple content items
     */
    public function trigger_batch_revalidation($items) {
        if (empty($items) || empty($this->revalidate_url) || empty($this->secret)) {
            return;
        }

        $batch_payloads = [];

        foreach ($items as $item) {
            $batch_payloads[] = array(
                'secret' => $this->secret,
                'content_type' => $item['content_type'],
                'content_id' => $item['content_id'],
                'content_slug' => $item['content_slug'],
                'action' => $item['action'],
                'changed_fields' => isset($item['changed_fields']) ? $item['changed_fields'] : [],
                'field_changes' => isset($item['field_changes']) ? $item['field_changes'] : [],
                'cascade' => true,
                'priority' => isset($item['priority']) ? $item['priority'] : 'normal'
            );
        }

        $payload = array(
            'secret' => $this->secret,
            'action' => 'batch_revalidation',
            'batch_payloads' => $batch_payloads
        );

        $this->send_webhook($payload);
    }

    /**
     * Admin menu and settings
     */
    public function admin_menu() {
        add_options_page(
            'Zawaya SCF Revalidate Settings',
            'Zawaya SCF Revalidate',
            'manage_options',
            'zawaya-scf-revalidate',
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
            <h1>Zawaya SCF Revalidate Settings</h1>
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
            
            <h2>SCF Field Monitoring</h2>
            <p>This plugin monitors changes to the following ACF fields and triggers intelligent cache revalidation:</p>
            
            <h3>Article Fields</h3>
            <ul>
                <li><strong>High Priority:</strong> title_arabic, content_arabic, is_featured, is_breaking_news</li>
                <li><strong>Normal Priority:</strong> excerpt_arabic, category_color, audio_narration_url, social_sharing_image</li>
                <li><strong>Low Priority:</strong> reading_time_minutes, keywords_arabic, meta_description_arabic</li>
            </ul>
            
            <h3>Program Fields</h3>
            <ul>
                <li><strong>Normal Priority:</strong> host_arabic, program_type, cover_image, theme_color</li>
                <li><strong>Low Priority:</strong> episode_count, trailer_video, program_rating</li>
            </ul>
            
            <h3>Episode Fields</h3>
            <ul>
                <li><strong>High Priority:</strong> video_embed_url, audio_file_url</li>
                <li><strong>Normal Priority:</strong> episode_thumbnail, episode_poster, transcript_arabic</li>
                <li><strong>Low Priority:</strong> duration_seconds, episode_number, season_number</li>
            </ul>
            
            <h3>Author Fields</h3>
            <ul>
                <li><strong>High Priority:</strong> name_arabic, is_featured_author, is_verified_author</li>
                <li><strong>Normal Priority:</strong> author_avatar, job_title_arabic, bio_arabic</li>
                <li><strong>Low Priority:</strong> social_media_links, expertise_areas, languages_spoken</li>
            </ul>
        </div>
        <?php
    }
}

new ZawayaSCFRevalidate();
?>