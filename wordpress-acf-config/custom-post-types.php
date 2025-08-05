<?php
/**
 * Zawaya Platform - Custom Post Types
 * Add this to your WordPress theme's functions.php or create as a plugin
 */

// Register Program Post Type
function zawaya_register_program_post_type() {
    $labels = array(
        'name'                  => _x('Programs', 'Post type general name', 'zawaya'),
        'singular_name'         => _x('Program', 'Post type singular name', 'zawaya'),
        'menu_name'             => _x('Programs', 'Admin Menu text', 'zawaya'),
        'name_admin_bar'        => _x('Program', 'Add New on Toolbar', 'zawaya'),
        'add_new'               => __('Add New', 'zawaya'),
        'add_new_item'          => __('Add New Program', 'zawaya'),
        'new_item'              => __('New Program', 'zawaya'),
        'edit_item'             => __('Edit Program', 'zawaya'),
        'view_item'             => __('View Program', 'zawaya'),
        'all_items'             => __('All Programs', 'zawaya'),
        'search_items'          => __('Search Programs', 'zawaya'),
        'parent_item_colon'     => __('Parent Programs:', 'zawaya'),
        'not_found'             => __('No programs found.', 'zawaya'),
        'not_found_in_trash'    => __('No programs found in Trash.', 'zawaya'),
        'featured_image'        => _x('Program Cover Image', 'Overrides the "Featured Image" phrase', 'zawaya'),
        'set_featured_image'    => _x('Set cover image', 'Overrides the "Set featured image" phrase', 'zawaya'),
        'remove_featured_image' => _x('Remove cover image', 'Overrides the "Remove featured image" phrase', 'zawaya'),
        'use_featured_image'    => _x('Use as cover image', 'Overrides the "Use as featured image" phrase', 'zawaya'),
        'archives'              => _x('Program archives', 'The post type archive label', 'zawaya'),
        'insert_into_item'      => _x('Insert into program', 'Overrides the "Insert into post" phrase', 'zawaya'),
        'uploaded_to_this_item' => _x('Uploaded to this program', 'Overrides the "Uploaded to this post" phrase', 'zawaya'),
        'filter_items_list'     => _x('Filter programs list', 'Screen reader text for the filter links', 'zawaya'),
        'items_list_navigation' => _x('Programs list navigation', 'Screen reader text for the pagination', 'zawaya'),
        'items_list'            => _x('Programs list', 'Screen reader text for the items list', 'zawaya'),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => true, // Enable Gutenberg editor and REST API
        'query_var'          => true,
        'rewrite'            => array('slug' => 'programs'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-video-alt3',
        'supports'           => array('title', 'editor', 'excerpt', 'thumbnail', 'author', 'comments', 'revisions', 'custom-fields'),
        'taxonomies'         => array('program_category', 'program_tag'),
        'show_in_admin_bar'  => true,
    );

    register_post_type('program', $args);
}
add_action('init', 'zawaya_register_program_post_type');

// Register Episode Post Type
function zawaya_register_episode_post_type() {
    $labels = array(
        'name'                  => _x('Episodes', 'Post type general name', 'zawaya'),
        'singular_name'         => _x('Episode', 'Post type singular name', 'zawaya'),
        'menu_name'             => _x('Episodes', 'Admin Menu text', 'zawaya'),
        'name_admin_bar'        => _x('Episode', 'Add New on Toolbar', 'zawaya'),
        'add_new'               => __('Add New', 'zawaya'),
        'add_new_item'          => __('Add New Episode', 'zawaya'),
        'new_item'              => __('New Episode', 'zawaya'),
        'edit_item'             => __('Edit Episode', 'zawaya'),
        'view_item'             => __('View Episode', 'zawaya'),
        'all_items'             => __('All Episodes', 'zawaya'),
        'search_items'          => __('Search Episodes', 'zawaya'),
        'parent_item_colon'     => __('Parent Episodes:', 'zawaya'),
        'not_found'             => __('No episodes found.', 'zawaya'),
        'not_found_in_trash'    => __('No episodes found in Trash.', 'zawaya'),
        'featured_image'        => _x('Episode Thumbnail', 'Overrides the "Featured Image" phrase', 'zawaya'),
        'set_featured_image'    => _x('Set thumbnail', 'Overrides the "Set featured image" phrase', 'zawaya'),
        'remove_featured_image' => _x('Remove thumbnail', 'Overrides the "Remove featured image" phrase', 'zawaya'),
        'use_featured_image'    => _x('Use as thumbnail', 'Overrides the "Use as featured image" phrase', 'zawaya'),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'episodes'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 6,
        'menu_icon'          => 'dashicons-playlist-video',
        'supports'           => array('title', 'editor', 'excerpt', 'thumbnail', 'author', 'comments', 'revisions', 'custom-fields'),
        'taxonomies'         => array('episode_tag'),
        'show_in_admin_bar'  => true,
    );

    register_post_type('episode', $args);
}
add_action('init', 'zawaya_register_episode_post_type');

// Register Program Categories Taxonomy
function zawaya_register_program_taxonomies() {
    // Program Categories
    $category_labels = array(
        'name'              => _x('Program Categories', 'taxonomy general name', 'zawaya'),
        'singular_name'     => _x('Program Category', 'taxonomy singular name', 'zawaya'),
        'search_items'      => __('Search Program Categories', 'zawaya'),
        'all_items'         => __('All Program Categories', 'zawaya'),
        'parent_item'       => __('Parent Program Category', 'zawaya'),
        'parent_item_colon' => __('Parent Program Category:', 'zawaya'),
        'edit_item'         => __('Edit Program Category', 'zawaya'),
        'update_item'       => __('Update Program Category', 'zawaya'),
        'add_new_item'      => __('Add New Program Category', 'zawaya'),
        'new_item_name'     => __('New Program Category Name', 'zawaya'),
        'menu_name'         => __('Categories', 'zawaya'),
    );

    $category_args = array(
        'hierarchical'      => true,
        'labels'            => $category_labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'program-category'),
    );

    register_taxonomy('program_category', array('program'), $category_args);

    // Program Tags
    $tag_labels = array(
        'name'                       => _x('Program Tags', 'taxonomy general name', 'zawaya'),
        'singular_name'              => _x('Program Tag', 'taxonomy singular name', 'zawaya'),
        'search_items'               => __('Search Program Tags', 'zawaya'),
        'popular_items'              => __('Popular Program Tags', 'zawaya'),
        'all_items'                  => __('All Program Tags', 'zawaya'),
        'edit_item'                  => __('Edit Program Tag', 'zawaya'),
        'update_item'                => __('Update Program Tag', 'zawaya'),
        'add_new_item'               => __('Add New Program Tag', 'zawaya'),
        'new_item_name'              => __('New Program Tag Name', 'zawaya'),
        'separate_items_with_commas' => __('Separate program tags with commas', 'zawaya'),
        'add_or_remove_items'        => __('Add or remove program tags', 'zawaya'),
        'choose_from_most_used'      => __('Choose from the most used program tags', 'zawaya'),
        'not_found'                  => __('No program tags found.', 'zawaya'),
        'menu_name'                  => __('Tags', 'zawaya'),
    );

    $tag_args = array(
        'hierarchical'          => false,
        'labels'                => $tag_labels,
        'show_ui'               => true,
        'show_admin_column'     => true,
        'show_in_rest'          => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var'             => true,
        'rewrite'               => array('slug' => 'program-tag'),
    );

    register_taxonomy('program_tag', array('program'), $tag_args);

    // Episode Tags
    $episode_tag_labels = array(
        'name'                       => _x('Episode Tags', 'taxonomy general name', 'zawaya'),
        'singular_name'              => _x('Episode Tag', 'taxonomy singular name', 'zawaya'),
        'search_items'               => __('Search Episode Tags', 'zawaya'),
        'popular_items'              => __('Popular Episode Tags', 'zawaya'),
        'all_items'                  => __('All Episode Tags', 'zawaya'),
        'edit_item'                  => __('Edit Episode Tag', 'zawaya'),
        'update_item'                => __('Update Episode Tag', 'zawaya'),
        'add_new_item'               => __('Add New Episode Tag', 'zawaya'),
        'new_item_name'              => __('New Episode Tag Name', 'zawaya'),
        'separate_items_with_commas' => __('Separate episode tags with commas', 'zawaya'),
        'add_or_remove_items'        => __('Add or remove episode tags', 'zawaya'),
        'choose_from_most_used'      => __('Choose from the most used episode tags', 'zawaya'),
        'not_found'                  => __('No episode tags found.', 'zawaya'),
        'menu_name'                  => __('Episode Tags', 'zawaya'),
    );

    $episode_tag_args = array(
        'hierarchical'          => false,
        'labels'                => $episode_tag_labels,
        'show_ui'               => true,
        'show_admin_column'     => true,
        'show_in_rest'          => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var'             => true,
        'rewrite'               => array('slug' => 'episode-tag'),
    );

    register_taxonomy('episode_tag', array('episode'), $episode_tag_args);
}
add_action('init', 'zawaya_register_program_taxonomies');

// Add custom columns to admin lists
function zawaya_program_columns($columns) {
    $columns['program_type'] = __('Type', 'zawaya');
    $columns['host'] = __('Host', 'zawaya');
    $columns['episodes'] = __('Episodes', 'zawaya');
    $columns['featured'] = __('Featured', 'zawaya');
    return $columns;
}
add_filter('manage_program_posts_columns', 'zawaya_program_columns');

function zawaya_program_column_content($column, $post_id) {
    switch ($column) {
        case 'program_type':
            echo get_field('program_type', $post_id) ?: 'Video';
            break;
        case 'host':
            $host_ar = get_field('host_arabic', $post_id);
            $host_en = get_field('host_english', $post_id);
            echo $host_ar ?: $host_en ?: '—';
            break;
        case 'episodes':
            echo get_field('episode_count', $post_id) ?: '0';
            break;
        case 'featured':
            echo get_field('is_featured', $post_id) ? '★' : '—';
            break;
    }
}
add_action('manage_program_posts_custom_column', 'zawaya_program_column_content', 10, 2);

// Add custom columns for episodes
function zawaya_episode_columns($columns) {
    $columns['episode_number'] = __('Episode #', 'zawaya');
    $columns['program'] = __('Program', 'zawaya');
    $columns['duration'] = __('Duration', 'zawaya');
    $columns['views'] = __('Views', 'zawaya');
    return $columns;
}
add_filter('manage_episode_posts_columns', 'zawaya_episode_columns');

function zawaya_episode_column_content($column, $post_id) {
    switch ($column) {
        case 'episode_number':
            $episode_num = get_field('episode_number', $post_id);
            $season_num = get_field('season_number', $post_id);
            echo $season_num ? "S{$season_num}E{$episode_num}" : "E{$episode_num}";
            break;
        case 'program':
            $program = get_field('program_reference', $post_id);
            if ($program) {
                echo '<a href="' . get_edit_post_link($program->ID) . '">' . $program->post_title . '</a>';
            } else {
                echo '—';
            }
            break;
        case 'duration':
            $duration = get_field('duration_seconds', $post_id);
            if ($duration) {
                $minutes = floor($duration / 60);
                $seconds = $duration % 60;
                echo sprintf('%d:%02d', $minutes, $seconds);
            } else {
                echo '—';
            }
            break;
        case 'views':
            echo get_field('view_count', $post_id) ?: '0';
            break;
    }
}
add_action('manage_episode_posts_custom_column', 'zawaya_episode_column_content', 10, 2);

// Flush rewrite rules on activation
function zawaya_flush_rewrites() {
    zawaya_register_program_post_type();
    zawaya_register_episode_post_type();
    zawaya_register_program_taxonomies();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'zawaya_flush_rewrites');

// Add REST API fields for ACF
function zawaya_add_acf_to_rest_api() {
    // Add ACF fields to REST API for programs
    register_rest_field('program', 'acf', array(
        'get_callback' => function($post) {
            return get_fields($post['id']);
        },
        'schema' => null,
    ));

    // Add ACF fields to REST API for episodes
    register_rest_field('episode', 'acf', array(
        'get_callback' => function($post) {
            return get_fields($post['id']);
        },
        'schema' => null,
    ));

    // Add ACF fields to REST API for posts (articles)
    register_rest_field('post', 'acf', array(
        'get_callback' => function($post) {
            return get_fields($post['id']);
        },
        'schema' => null,
    ));
}
add_action('rest_api_init', 'zawaya_add_acf_to_rest_api');

?>