-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    cover_image_url VARCHAR(500),
    type VARCHAR(20) NOT NULL CHECK (type IN ('audio', 'video', 'mixed')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'completed', 'paused')),
    host VARCHAR(255) NOT NULL,
    episode_count INTEGER DEFAULT 0,
    duration_avg INTEGER DEFAULT 0, -- in minutes
    category VARCHAR(100) NOT NULL,
    launch_date DATE NOT NULL,
    latest_episode_date DATE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create episodes table
CREATE TABLE IF NOT EXISTS episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    episode_number INTEGER NOT NULL,
    season_number INTEGER DEFAULT 1,
    duration INTEGER, -- in minutes
    audio_url VARCHAR(500),
    video_url VARCHAR(500),
    transcript_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(program_id, episode_number, season_number),
    UNIQUE(program_id, slug)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_type ON programs(type);
CREATE INDEX IF NOT EXISTS idx_programs_featured ON programs(featured);
CREATE INDEX IF NOT EXISTS idx_programs_launch_date ON programs(launch_date DESC);

CREATE INDEX IF NOT EXISTS idx_episodes_program_id ON episodes(program_id);
CREATE INDEX IF NOT EXISTS idx_episodes_published_at ON episodes(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_episodes_status ON episodes(status);

-- Create RLS policies
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

-- Public read access for published programs
CREATE POLICY "Public can view active programs" ON programs
    FOR SELECT USING (status = 'active');

-- Public read access for published episodes
CREATE POLICY "Public can view published episodes" ON episodes
    FOR SELECT USING (status = 'published');

-- Admin policies for full access
CREATE POLICY "Admins can manage programs" ON programs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can manage episodes" ON episodes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_programs_updated_at 
    BEFORE UPDATE ON programs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_episodes_updated_at 
    BEFORE UPDATE ON episodes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update episode count and latest episode date
CREATE OR REPLACE FUNCTION update_program_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update episode count and latest episode date for the affected program
    UPDATE programs 
    SET 
        episode_count = (
            SELECT COUNT(*) 
            FROM episodes 
            WHERE program_id = COALESCE(NEW.program_id, OLD.program_id) 
            AND status = 'published'
        ),
        latest_episode_date = (
            SELECT MAX(published_at::date) 
            FROM episodes 
            WHERE program_id = COALESCE(NEW.program_id, OLD.program_id) 
            AND status = 'published'
        )
    WHERE id = COALESCE(NEW.program_id, OLD.program_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger to update program stats when episodes change
CREATE TRIGGER update_program_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON episodes
    FOR EACH ROW
    EXECUTE FUNCTION update_program_stats();

-- Insert seed data for the programs
INSERT INTO programs (
    title, tagline, description, cover_image_url, type, status, host, 
    episode_count, duration_avg, category, launch_date, latest_episode_date, 
    slug, featured
) VALUES 
(
    'أصل الخبر',
    'نكشف لك الحقيقة وراء الأخبار',
    'برنامج استقصائي يتعمق في الأحداث الجارية ويكشف الخلفيات والسياقات التي تقف وراء الأخبار الرئيسية',
    '/placeholder.svg?height=300&width=400&text=أصل+الخبر',
    'audio',
    'active',
    'أحمد الصحفي',
    45,
    35,
    'إعلام',
    '2024-01-15',
    '2025-01-10',
    'asl-al-khabar',
    true
),
(
    'ترانزستور',
    'التكنولوجيا التي تغير عالمنا',
    'برنامج تقني يستكشف أحدث التطورات في عالم التكنولوجيا وتأثيرها على حياتنا اليومية والمستقبل',
    '/placeholder.svg?height=300&width=400&text=ترانزستور',
    'video',
    'active',
    'سارة التقنية',
    32,
    28,
    'تكنولوجيا',
    '2024-03-20',
    '2025-01-08',
    'transistor',
    false
),
(
    'جيوبوليتيكا',
    'فهم السياسة من منظور جغرافي',
    'تحليل عميق للأحداث السياسية العالمية من خلال فهم الجغرافيا السياسية وتأثيرها على القرارات الاستراتيجية',
    '/placeholder.svg?height=300&width=400&text=جيوبوليتيكا',
    'mixed',
    'active',
    'د. محمد الجغرافي',
    28,
    42,
    'سياسة',
    '2024-02-10',
    '2025-01-12',
    'geopolitica',
    true
),
(
    'لخصنا لك',
    'أهم الأحداث في دقائق معدودة',
    'ملخص يومي سريع لأهم الأحداث والتطورات في المنطقة والعالم، مقدم بأسلوب مبسط وواضح',
    '/placeholder.svg?height=300&width=400&text=لخصنا+لك',
    'audio',
    'active',
    'فريق التحرير',
    120,
    8,
    'أخبار',
    '2024-01-01',
    '2025-01-15',
    'lakhasna-lak',
    false
)
ON CONFLICT (slug) DO NOTHING;
