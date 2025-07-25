-- ==============================================
-- Supabase Storage Setup for Rich Content Editor
-- ==============================================

-- Create storage buckets for different media types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'images',
    'images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  ),
  (
    'videos', 
    'videos',
    true,
    104857600, -- 100MB limit
    ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime']
  ),
  (
    'files',
    'files', 
    true,
    52428800, -- 50MB limit
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/zip']
  )
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- Storage Policies
-- ==============================================

-- Images bucket policies
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'uploads'
);

CREATE POLICY "Authors can update their images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
  AND owner = auth.uid()
);

CREATE POLICY "Authors can delete their images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
  AND owner = auth.uid()
);

-- Videos bucket policies
CREATE POLICY "Anyone can view videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'uploads'
);

CREATE POLICY "Authors can update their videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'videos' 
  AND auth.role() = 'authenticated'
  AND owner = auth.uid()
);

CREATE POLICY "Authors can delete their videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'videos' 
  AND auth.role() = 'authenticated'
  AND owner = auth.uid()
);

-- Files bucket policies
CREATE POLICY "Anyone can view files"
ON storage.objects FOR SELECT
USING (bucket_id = 'files');

CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'uploads'
);

CREATE POLICY "Authors can update their files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'files' 
  AND auth.role() = 'authenticated'
  AND owner = auth.uid()
);

CREATE POLICY "Authors can delete their files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'files' 
  AND auth.role() = 'authenticated'
  AND owner = auth.uid()
);

-- ==============================================
-- Helper Functions
-- ==============================================

-- Function to get file extension
CREATE OR REPLACE FUNCTION storage.get_file_extension(filename text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN lower(split_part(filename, '.', array_length(string_to_array(filename, '.'), 1)));
END;
$$;

-- Function to validate file size
CREATE OR REPLACE FUNCTION storage.validate_file_size(
  bucket_name text,
  file_size bigint
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  max_size bigint;
BEGIN
  SELECT file_size_limit INTO max_size
  FROM storage.buckets
  WHERE id = bucket_name;
  
  RETURN file_size <= COALESCE(max_size, 0);
END;
$$;

-- Function to clean up old files (optional, for maintenance)
CREATE OR REPLACE FUNCTION storage.cleanup_old_files(
  bucket_name text,
  days_old integer DEFAULT 30
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer := 0;
BEGIN
  -- Only allow admins to run cleanup
  IF NOT EXISTS (
    SELECT 1 FROM authors 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can run cleanup';
  END IF;

  -- Delete files older than specified days that are not referenced
  DELETE FROM storage.objects
  WHERE bucket_id = bucket_name
    AND created_at < NOW() - INTERVAL '%s days', days_old
    AND name NOT IN (
      -- Keep files that are referenced in articles
      SELECT DISTINCT unnest(
        ARRAY[
          featured_image_url,
          COALESCE(featured_image_url, '')
        ]
      )
      FROM articles
      WHERE featured_image_url IS NOT NULL
        AND featured_image_url LIKE '%' || bucket_name || '%'
    );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- ==============================================
-- Indexes for Performance
-- ==============================================

-- Index on bucket_id and created_at for cleanup operations
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_created 
ON storage.objects (bucket_id, created_at);

-- Index on bucket_id and owner for user-specific queries
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_owner 
ON storage.objects (bucket_id, owner);

-- ==============================================
-- Comments and Documentation
-- ==============================================

COMMENT ON TABLE storage.buckets IS 'Storage buckets for the Zawaya platform media files';
COMMENT ON FUNCTION storage.get_file_extension(text) IS 'Extracts file extension from filename';
COMMENT ON FUNCTION storage.validate_file_size(text, bigint) IS 'Validates if file size is within bucket limits';
COMMENT ON FUNCTION storage.cleanup_old_files(text, integer) IS 'Cleans up old unreferenced files (admin only)';

-- ==============================================
-- Test Data (Optional)
-- ==============================================

-- Insert some sample file references for testing
-- These would normally be created by the application when files are uploaded

/*
INSERT INTO storage.objects (bucket_id, name, owner, metadata) VALUES
('images', 'uploads/sample-article-image.jpg', auth.uid(), '{"originalName": "sample.jpg", "mimeType": "image/jpeg"}'),
('videos', 'uploads/sample-video.mp4', auth.uid(), '{"originalName": "video.mp4", "mimeType": "video/mp4"}');
*/

-- ==============================================
-- Usage Examples
-- ==============================================

/*
-- Check bucket setup
SELECT * FROM storage.buckets;

-- Check storage policies
SELECT * FROM storage.objects WHERE bucket_id = 'images' LIMIT 5;

-- Run cleanup (admin only)
SELECT storage.cleanup_old_files('images', 30);

-- Check file extension
SELECT storage.get_file_extension('test-image.jpg');

-- Validate file size
SELECT storage.validate_file_size('images', 5000000); -- 5MB file
*/ 