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
