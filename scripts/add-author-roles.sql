-- Add role field to authors table for admin permissions

-- Add role column to authors table
ALTER TABLE authors 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'author' 
CHECK (role IN ('author', 'editor', 'admin'));

-- Add index for role column
CREATE INDEX IF NOT EXISTS idx_authors_role ON authors(role);

-- Update existing authors to have 'author' role by default
UPDATE authors 
SET role = 'author' 
WHERE role IS NULL;

-- Create an admin user (replace with your actual admin email)
-- You'll need to create this user in Supabase Auth first, then update the ID here
INSERT INTO authors (
    id, 
    name_ar, 
    name_en, 
    email, 
    role, 
    bio_ar,
    bio_en,
    is_verified,
    created_at, 
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- Replace with your actual user ID from auth.users
    'مدير النظام',
    'System Admin',
    'admin@zawaya.com',
    'admin',
    'مدير منصة زوايا',
    'Zawaya Platform Administrator',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    email = EXCLUDED.email,
    bio_ar = EXCLUDED.bio_ar,
    bio_en = EXCLUDED.bio_en,
    is_verified = EXCLUDED.is_verified,
    updated_at = NOW();

-- Make first seeded author an editor for testing
UPDATE authors 
SET role = 'editor'
WHERE name_ar = 'د. أمين رشدي'; 