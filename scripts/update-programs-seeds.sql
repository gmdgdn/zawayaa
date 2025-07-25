-- Update existing programs and add new ones
INSERT INTO programs (
    title, tagline, description, cover_image_url, type, status, host, 
    episode_count, duration_avg, category, launch_date, latest_episode_date, 
    slug, featured
) VALUES 
-- New Video Programs
(
    'ترانزيت',
    'رحلة عبر قصص الهجرة والانتقال',
    'برنامج وثائقي يتتبع قصص الأشخاص في رحلات انتقالهم وهجرتهم، ويستكشف التحديات والفرص التي يواجهونها في بحثهم عن حياة أفضل',
    '/placeholder.svg?height=300&width=400&text=ترانزيت',
    'video',
    'active',
    'ليلى الوثائقية',
    24,
    45,
    'وثائقي',
    '2024-02-01',
    '2025-01-12',
    'transit',
    true
),
(
    'شمال جنوب',
    'حوارات تربط بين القارات',
    'برنامج حواري يجمع بين ضيوف من الشمال والجنوب العالمي لمناقشة القضايا المشتركة والاختلافات الثقافية والاقتصادية',
    '/placeholder.svg?height=300&width=400&text=شمال+جنوب',
    'video',
    'active',
    'د. أحمد الدولي',
    18,
    52,
    'حوارات',
    '2024-04-15',
    '2025-01-08',
    'north-south',
    false
),
-- New Audio Program
(
    'حدث ومعنى',
    'فهم الأحداث من خلال السياق والمعنى',
    'برنامج صوتي تحليلي يتناول الأحداث الجارية ويضعها في سياقها التاريخي والثقافي والسياسي لفهم معناها الأعمق',
    '/placeholder.svg?height=300&width=400&text=حدث+ومعنى',
    'audio',
    'active',
    'د. محمد المحلل',
    56,
    35,
    'تحليل',
    '2024-01-10',
    '2025-01-14',
    'event-and-meaning',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    cover_image_url = EXCLUDED.cover_image_url,
    type = EXCLUDED.type,
    status = EXCLUDED.status,
    host = EXCLUDED.host,
    episode_count = EXCLUDED.episode_count,
    duration_avg = EXCLUDED.duration_avg,
    category = EXCLUDED.category,
    launch_date = EXCLUDED.launch_date,
    latest_episode_date = EXCLUDED.latest_episode_date,
    featured = EXCLUDED.featured,
    updated_at = NOW();

-- Update existing programs to ensure correct types
UPDATE programs SET type = 'video' WHERE slug IN ('transistor', 'zawaya-dialogues');
UPDATE programs SET type = 'audio' WHERE slug IN ('asl-al-khabar', 'lakhasna-lak', 'economy-without-borders');
