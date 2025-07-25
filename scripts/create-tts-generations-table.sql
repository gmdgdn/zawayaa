-- Create TTS generations tracking table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tts_generations_article_translation_id ON tts_generations(article_translation_id);
CREATE INDEX IF NOT EXISTS idx_tts_generations_article_id ON tts_generations(article_id);
CREATE INDEX IF NOT EXISTS idx_tts_generations_language ON tts_generations(language);
CREATE INDEX IF NOT EXISTS idx_tts_generations_status ON tts_generations(status);
CREATE INDEX IF NOT EXISTS idx_tts_generations_created_at ON tts_generations(created_at DESC);

-- Create RLS policies
ALTER TABLE tts_generations ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view all TTS generations
CREATE POLICY "Admins can view all TTS generations" ON tts_generations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

-- Policy for system to insert TTS generations
CREATE POLICY "System can insert TTS generations" ON tts_generations
    FOR INSERT WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_tts_generations_updated_at 
    BEFORE UPDATE ON tts_generations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create database trigger to call the Edge Function
CREATE OR REPLACE FUNCTION trigger_tts_generation()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger if audio_url is NULL and we have content
    IF NEW.audio_url IS NULL AND NEW.content IS NOT NULL AND NEW.title IS NOT NULL THEN
        -- Call the Edge Function asynchronously using pg_net
        PERFORM
            net.http_post(
                url := 'https://your-project-ref.supabase.co/functions/v1/generateArticleTTS',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
                ),
                body := jsonb_build_object(
                    'type', TG_OP,
                    'table', TG_TABLE_NAME,
                    'record', row_to_json(NEW),
                    'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END
                )
            );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on article_translations table
DROP TRIGGER IF EXISTS article_translations_tts_trigger ON article_translations;
CREATE TRIGGER article_translations_tts_trigger
    AFTER INSERT OR UPDATE ON article_translations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_tts_generation();
