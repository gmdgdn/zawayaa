-- Insert categories with Arabic and English names
INSERT INTO categories (id, name_ar, name_en, slug, description_ar, description_en, color, icon, sort_order) VALUES 
(gen_random_uuid(), 'فن', 'Art', 'art', 'مقالات وتحليلات حول الفن والثقافة البصرية', 'Articles and analysis about art and visual culture', '#e91e63', 'palette', 1),
(gen_random_uuid(), 'سياسة', 'Politics', 'politics', 'تحليلات سياسية وآراء حول الأحداث الجارية', 'Political analysis and opinions on current events', '#2196f3', 'flag', 2),
(gen_random_uuid(), 'اقتصاد', 'Economy', 'economy', 'أخبار وتحليلات اقتصادية ومالية', 'Economic and financial news and analysis', '#4caf50', 'trending-up', 3),
(gen_random_uuid(), 'تكنولوجيا', 'Technology', 'technology', 'آخر التطورات التقنية والابتكارات', 'Latest technological developments and innovations', '#ff9800', 'cpu', 4),
(gen_random_uuid(), 'ثقافة', 'Culture', 'culture', 'مواضيع ثقافية واجتماعية متنوعة', 'Diverse cultural and social topics', '#9c27b0', 'book-open', 5),
(gen_random_uuid(), 'رياضة', 'Sports', 'sports', 'أخبار وتحليلات رياضية', 'Sports news and analysis', '#f44336', 'trophy', 6),
(gen_random_uuid(), 'علوم', 'Science', 'science', 'اكتشافات علمية وبحوث جديدة', 'Scientific discoveries and new research', '#00bcd4', 'microscope', 7),
(gen_random_uuid(), 'صحة', 'Health', 'health', 'مواضيع صحية ونصائح طبية', 'Health topics and medical advice', '#8bc34a', 'heart', 8),
(gen_random_uuid(), 'بيئة', 'Environment', 'environment', 'قضايا بيئية ومناخية', 'Environmental and climate issues', '#607d8b', 'leaf', 9),
(gen_random_uuid(), 'تعليم', 'Education', 'education', 'مواضيع تعليمية وأكاديمية', 'Educational and academic topics', '#3f51b5', 'graduation-cap', 10),
(gen_random_uuid(), 'سفر', 'Travel', 'travel', 'وجهات سياحية وتجارب سفر', 'Tourist destinations and travel experiences', '#ff5722', 'map-pin', 11),
(gen_random_uuid(), 'طعام', 'Food', 'food', 'ثقافة الطعام والمطبخ', 'Food culture and cuisine', '#795548', 'utensils', 12)
ON CONFLICT (slug) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    description_ar = EXCLUDED.description_ar,
    description_en = EXCLUDED.description_en,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();
