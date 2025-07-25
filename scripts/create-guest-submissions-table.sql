-- Create guest_submissions table for article submissions
CREATE TABLE IF NOT EXISTS guest_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    bio TEXT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'published')),
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guest_submissions_status ON guest_submissions(status);
CREATE INDEX IF NOT EXISTS idx_guest_submissions_submitted_at ON guest_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_guest_submissions_email ON guest_submissions(email);

-- Create RLS policies
ALTER TABLE guest_submissions ENABLE ROW LEVEL SECURITY;

-- Policy for users to insert their own submissions
CREATE POLICY "Users can insert their own submissions" ON guest_submissions
    FOR INSERT WITH CHECK (true);

-- Policy for admins to view all submissions
CREATE POLICY "Admins can view all submissions" ON guest_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

-- Policy for admins to update submissions
CREATE POLICY "Admins can update submissions" ON guest_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_guest_submissions_updated_at 
    BEFORE UPDATE ON guest_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for article files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('article-submissions', 'article-submissions', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Allow authenticated uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'article-submissions' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admins to view files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'article-submissions' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );
