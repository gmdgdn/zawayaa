-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Categories table (must be created first due to foreign key dependencies)
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    color VARCHAR(7) DEFAULT '#6366f1',
    icon VARCHAR(50) DEFAULT 'folder',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    bio_ar TEXT,
    bio_en TEXT,
    avatar_url VARCHAR(500),
    email VARCHAR(255) UNIQUE,
    social_twitter VARCHAR(100),
    social_facebook VARCHAR(100),
    social_instagram VARCHAR(100),
    social_linkedin VARCHAR(100),
    website_url VARCHAR(500),
    location_ar VARCHAR(100),
    location_en VARCHAR(100),
    expertise_tags TEXT[], -- Array of expertise areas
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    article_count INTEGER DEFAULT 0,
    follower_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles table (depends on authors and categories)
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    featured_image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    read_time_minutes INTEGER DEFAULT 5,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Article translations table (depends on articles)
CREATE TABLE IF NOT EXISTS article_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    language VARCHAR(5) NOT NULL CHECK (language IN ('ar', 'en')),
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    content TEXT NOT NULL,
    excerpt TEXT,
    meta_description VARCHAR(300),
    audio_url VARCHAR(500), -- For TTS generated audio
    audio_duration INTEGER, -- Duration in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, language)
);

-- Programs table (depends on categories)
CREATE TABLE IF NOT EXISTS programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('video', 'audio', 'mixed')),
    title_ar VARCHAR(300) NOT NULL,
    title_en VARCHAR(300) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    cover_image_url VARCHAR(500),
    host_ar VARCHAR(200),
    host_en VARCHAR(200),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    featured BOOLEAN DEFAULT false,
    episode_count INTEGER DEFAULT 0,
    duration_avg INTEGER DEFAULT 0, -- Average duration in minutes
    launch_date DATE,
    latest_episode_date DATE,
    slug VARCHAR(200) UNIQUE NOT NULL,
    view_count INTEGER DEFAULT 0,
    subscriber_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Episodes table (depends on programs)
CREATE TABLE IF NOT EXISTS episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    title_ar VARCHAR(300) NOT NULL,
    title_en VARCHAR(300) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    thumbnail_url VARCHAR(500),
    video_url VARCHAR(500),
    audio_url VARCHAR(500),
    duration INTEGER NOT NULL, -- Duration in seconds
    episode_number INTEGER,
    season_number INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guest submissions table (depends on categories)
CREATE TABLE IF NOT EXISTS guest_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TTS generations tracking table (depends on article_translations and articles)
CREATE TABLE IF NOT EXISTS tts_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_translation_id UUID NOT NULL REFERENCES article_translations(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    language VARCHAR(5) NOT NULL,
    audio_url VARCHAR(500) NOT NULL,
    character_count INTEGER NOT NULL,
    voice_used VARCHAR(100) NOT NULL,
    generation_duration INTEGER, -- in seconds
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    topics TEXT[], -- Array of subscribed topics
    language VARCHAR(5) DEFAULT 'ar' CHECK (language IN ('ar', 'en')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured);

CREATE INDEX IF NOT EXISTS idx_article_translations_article_id ON article_translations(article_id);
CREATE INDEX IF NOT EXISTS idx_article_translations_language ON article_translations(language);
CREATE INDEX IF NOT EXISTS idx_article_translations_audio_url ON article_translations(audio_url);

CREATE INDEX IF NOT EXISTS idx_programs_type ON programs(type);
CREATE INDEX IF NOT EXISTS idx_programs_category_id ON programs(category_id);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_featured ON programs(featured);

CREATE INDEX IF NOT EXISTS idx_episodes_program_id ON episodes(program_id);
CREATE INDEX IF NOT EXISTS idx_episodes_status ON episodes(status);
CREATE INDEX IF NOT EXISTS idx_episodes_published_at ON episodes(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_tts_generations_article_translation_id ON tts_generations(article_translation_id);
CREATE INDEX IF NOT EXISTS idx_tts_generations_article_id ON tts_generations(article_id);
CREATE INDEX IF NOT EXISTS idx_tts_generations_language ON tts_generations(language);
CREATE INDEX IF NOT EXISTS idx_tts_generations_status ON tts_generations(status);

-- Create updated_at triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_article_translations_updated_at BEFORE UPDATE ON article_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guest_submissions_updated_at BEFORE UPDATE ON guest_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tts_generations_updated_at BEFORE UPDATE ON tts_generations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_subscriptions_updated_at BEFORE UPDATE ON newsletter_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tts_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public can view published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view article translations" ON article_translations FOR SELECT USING (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_translations.article_id AND articles.status = 'published')
);
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view authors" ON authors FOR SELECT USING (true);
CREATE POLICY "Public can view active programs" ON programs FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view published episodes" ON episodes FOR SELECT USING (status = 'published');

-- Admin policies (assuming admin role in user metadata)
CREATE POLICY "Admins can manage all data" ON articles FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin')
);
CREATE POLICY "Admins can manage article translations" ON article_translations FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin')
);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin')
);
CREATE POLICY "Admins can manage authors" ON authors FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin')
);
CREATE POLICY "Admins can manage programs" ON programs FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin')
);
CREATE POLICY "Admins can manage episodes" ON episodes FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin')
);

-- Guest submission policies
CREATE POLICY "Anyone can submit guest articles" ON guest_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all submissions" ON guest_submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin')
);
CREATE POLICY "Admins can update submissions" ON guest_submissions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin')
);

-- Newsletter subscription policies
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own subscriptions" ON newsletter_subscriptions FOR SELECT USING (
    auth.jwt() ->> 'email' = email
);
CREATE POLICY "Users can update their own subscriptions" ON newsletter_subscriptions FOR UPDATE USING (
    auth.jwt() ->> 'email' = email
);

-- TTS generation policies
CREATE POLICY "System can insert TTS generations" ON tts_generations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all TTS generations" ON tts_generations FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin')
);
