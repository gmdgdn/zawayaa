-- Create database functions for Zawaya platform

-- Function to increment article view count
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET view_count = view_count + 1,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get article with translations
CREATE OR REPLACE FUNCTION get_article_with_translation(
  article_slug TEXT DEFAULT NULL,
  article_id UUID DEFAULT NULL,
  lang_code TEXT DEFAULT 'ar'
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type TEXT,
  featured BOOLEAN,
  view_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  author_id UUID,
  category_id UUID,
  title TEXT,
  content TEXT,
  summary TEXT,
  audio_url TEXT,
  image_url TEXT,
  author_name TEXT,
  author_bio TEXT,
  category_name_ar TEXT,
  category_name_en TEXT,
  category_slug TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.slug,
    a.type,
    a.featured,
    a.view_count,
    a.created_at,
    a.updated_at,
    a.author_id,
    a.category_id,
    at.title,
    at.content,
    at.summary,
    at.audio_url,
    at.image_url,
    au.name as author_name,
    au.bio as author_bio,
    c.name_ar as category_name_ar,
    c.name_en as category_name_en,
    c.slug as category_slug
  FROM articles a
  LEFT JOIN article_translations at ON a.id = at.article_id AND at.language_code = lang_code
  LEFT JOIN authors au ON a.author_id = au.id
  LEFT JOIN categories c ON a.category_id = c.id
  WHERE 
    (article_slug IS NOT NULL AND a.slug = article_slug) OR
    (article_id IS NOT NULL AND a.id = article_id);
END;
$$ LANGUAGE plpgsql;

-- Function to search articles with full-text search
CREATE OR REPLACE FUNCTION search_articles(
  search_query TEXT,
  lang_code TEXT DEFAULT 'ar',
  category_filter TEXT DEFAULT NULL,
  article_type TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type TEXT,
  featured BOOLEAN,
  view_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  title TEXT,
  content TEXT,
  summary TEXT,
  audio_url TEXT,
  image_url TEXT,
  author_name TEXT,
  category_name_ar TEXT,
  category_slug TEXT,
  search_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.slug,
    a.type,
    a.featured,
    a.view_count,
    a.created_at,
    at.title,
    at.content,
    at.summary,
    at.audio_url,
    at.image_url,
    au.name as author_name,
    c.name_ar as category_name_ar,
    c.slug as category_slug,
    (
      ts_rank(
        to_tsvector('arabic', COALESCE(at.title, '') || ' ' || COALESCE(at.content, '') || ' ' || COALESCE(at.summary, '')),
        plainto_tsquery('arabic', search_query)
      ) +
      CASE WHEN at.title ILIKE '%' || search_query || '%' THEN 1.0 ELSE 0.0 END +
      CASE WHEN at.summary ILIKE '%' || search_query || '%' THEN 0.5 ELSE 0.0 END
    ) as search_rank
  FROM articles a
  LEFT JOIN article_translations at ON a.id = at.article_id AND at.language_code = lang_code
  LEFT JOIN authors au ON a.author_id = au.id
  LEFT JOIN categories c ON a.category_id = c.id
  WHERE 
    (
      search_query = '' OR
      to_tsvector('arabic', COALESCE(at.title, '') || ' ' || COALESCE(at.content, '') || ' ' || COALESCE(at.summary, '')) 
      @@ plainto_tsquery('arabic', search_query) OR
      at.title ILIKE '%' || search_query || '%' OR
      at.content ILIKE '%' || search_query || '%' OR
      at.summary ILIKE '%' || search_query || '%'
    )
    AND (category_filter IS NULL OR c.slug = category_filter)
    AND (article_type IS NULL OR a.type = article_type)
  ORDER BY search_rank DESC, a.created_at DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get homepage content
CREATE OR REPLACE FUNCTION get_homepage_content(lang_code TEXT DEFAULT 'ar')
RETURNS JSON AS $$
DECLARE
  result JSON;
  featured_article JSON;
  political_opinions JSON;
  situation_assessments JSON;
  programs JSON;
  articles_by_category JSON;
BEGIN
  -- Get featured article
  SELECT row_to_json(featured) INTO featured_article
  FROM (
    SELECT 
      a.id, a.slug, a.type, a.view_count, a.created_at,
      at.title, at.summary, at.image_url, at.audio_url,
      au.name as author_name,
      c.name_ar as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN article_translations at ON a.id = at.article_id AND at.language_code = lang_code
    LEFT JOIN authors au ON a.author_id = au.id
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.featured = true
    ORDER BY a.created_at DESC
    LIMIT 1
  ) featured;

  -- Get political opinions
  SELECT json_agg(row_to_json(opinions)) INTO political_opinions
  FROM (
    SELECT 
      a.id, a.slug, a.view_count, a.created_at,
      at.title, at.summary, at.image_url, at.audio_url,
      au.name as author_name
    FROM articles a
    LEFT JOIN article_translations at ON a.id = at.article_id AND at.language_code = lang_code
    LEFT JOIN authors au ON a.author_id = au.id
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE c.slug = 'political-opinion'
    ORDER BY a.created_at DESC
    LIMIT 4
  ) opinions;

  -- Get situation assessments
  SELECT json_agg(row_to_json(assessments)) INTO situation_assessments
  FROM (
    SELECT 
      a.id, a.slug, a.view_count, a.created_at,
      at.title, at.summary, at.image_url, at.audio_url,
      au.name as author_name
    FROM articles a
    LEFT JOIN article_translations at ON a.id = at.article_id AND at.language_code = lang_code
    LEFT JOIN authors au ON a.author_id = au.id
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE c.slug = 'situation-assessment'
    ORDER BY a.created_at DESC
    LIMIT 4
  ) assessments;

  -- Get programs
  SELECT json_agg(row_to_json(progs)) INTO programs
  FROM (
    SELECT 
      id, title_ar as title, description_ar as description, 
      cover_image, type, created_at
    FROM programs
    ORDER BY created_at DESC
    LIMIT 4
  ) progs;

  -- Build result
  result := json_build_object(
    'featured_article', featured_article,
    'political_opinions', COALESCE(political_opinions, '[]'::json),
    'situation_assessments', COALESCE(situation_assessments, '[]'::json),
    'programs', COALESCE(programs, '[]'::json)
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to check if email is already subscribed
CREATE OR REPLACE FUNCTION is_email_subscribed(email_address TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM newsletter_subscriptions 
    WHERE email = email_address AND is_active = true
  );
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_type ON articles(type);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_translations_language ON article_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_article_translations_search ON article_translations USING GIN (to_tsvector('arabic', title || ' ' || content || ' ' || summary));
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscriptions(is_active) WHERE is_active = true; 