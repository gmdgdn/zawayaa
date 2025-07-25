# Zawaya Platform - Database Setup Guide

This guide will help you set up the complete database integration for the Zawaya platform.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **PostgreSQL Knowledge**: Basic understanding of SQL and database concepts
3. **Environment Variables**: Access to your `.env.local` file

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `zawaya-platform`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project initialization (2-3 minutes)

## Step 2: Get Environment Variables

Once your project is ready:

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:

### Required Environment Variables

Create or update your `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://etsnhjqduvviooqlgidh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0c25oanFkdXZ2aW9vcWxnaWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA0ODQsImV4cCI6MjA2OTAxNjQ4NH0.bXg5sEwDvPowCknyCHdpvlJp9rfK6DMTxrSpzHXhoc8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0c25oanFkdXZ2aW9vcWxnaWRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ0MDQ4NCwiZXhwIjoyMDY5MDE2NDg0fQ.ZhprRaWCYwL9QQFh0IKVAiP9nIvcAAlP-vldkkK70Kw

# Optional: PlayHT for Text-to-Speech (for future use)
PLAYHT_API_KEY=your_playht_api_key
PLAYHT_USER_ID=your_playht_user_id
```

**Where to find these values:**
- **Project URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → Project API keys → anon/public
- **Service Role Key**: Settings → API → Project API keys → service_role (⚠️ Keep this secret!)

## Step 3: Run Database Migrations

Execute the following SQL scripts in your Supabase SQL editor (in order):

### 3.1 Create Base Schema
```bash
# In Supabase Dashboard → SQL Editor → New Query
# Copy and paste the contents of each file:
```

1. **`scripts/create-database-schema.sql`** - Main database structure
2. **`scripts/create-functions.sql`** - Database functions and indexes  
3. **`scripts/setup-storage.sql`** - Storage buckets and policies for rich content editor
4. **`scripts/add-author-roles.sql`** - Add admin roles to authors table
5. **`scripts/seed-categories.sql`** - Category data (if not included in schema)
6. **`scripts/seed-programs.sql`** - Program data (if not included in schema)
7. **`scripts/seed-sample-data.sql`** - Sample content for testing

### 3.2 Enable Row Level Security (RLS)

The schema automatically sets up RLS policies, but verify in **Authentication** → **Policies** that you see policies for:
- `articles` table
- `newsletter_subscriptions` table  
- `guest_submissions` table
- `authors` table
- `categories` table

## Step 4: Configure Storage (Rich Content Editor)

The rich content editor requires storage buckets for media uploads. The `setup-storage.sql` script automatically creates:

### Storage Buckets Created:
- **`images`** - For article images (10MB limit, public)
- **`videos`** - For video embeds (100MB limit, public)  
- **`files`** - For document attachments (50MB limit, public)

### Storage Policies:
- ✅ **Public viewing** for all media files
- ✅ **Authenticated upload** access
- ✅ **Author permissions** to manage their own files
- ✅ **Admin cleanup** functions for maintenance

### Verification:
After running `setup-storage.sql`, verify in **Storage** → **Buckets** that you see:
- `images` bucket with proper MIME type restrictions
- `videos` bucket configured for video files
- `files` bucket for documents

### Manual Setup (if script fails):
If you prefer manual setup:
1. Go to **Storage** in Supabase dashboard
2. Create buckets: `images`, `videos`, `files`
3. Set all buckets to **Public**
4. Configure MIME type restrictions per bucket

## Step 5: Test Database Connection

Run this test to verify your setup:

```bash
npm run dev
```

Then visit:
- `http://localhost:3000/api/newsletter` - Should return subscriber count
- `http://localhost:3000/api/articles` - Should return sample articles
- `http://localhost:3000/ar` - Should load homepage with real data

## Step 6: Verify API Endpoints

Test each API endpoint:

### Articles API
```bash
# Get all articles
curl http://localhost:3000/api/articles

# Get specific article
curl http://localhost:3000/api/articles/digital-caliphate-or-renewed-mind

# Search articles
curl "http://localhost:3000/api/search?q=ذكاء اصطناعي"
```

### Newsletter API
```bash
# Subscribe to newsletter
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Get subscriber count
curl http://localhost:3000/api/newsletter
```

### Homepage API
```bash
# Get homepage content
curl http://localhost:3000/api/homepage
```

## Step 7: Database Management

### Backup Strategy
- Supabase automatically backs up your database
- For additional backups, use **Settings** → **Database** → **Backups**

### Monitoring
- Monitor database performance in **Reports** section
- Set up alerts for API usage limits

### Scaling
- Free tier includes:
  - 500MB database storage
  - 2GB bandwidth per month
  - 50,000 monthly active users
- Upgrade to Pro when needed

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Restart your development server after adding `.env.local`
   - Check for typos in variable names
   - Ensure no trailing spaces in values

2. **Database Connection Failed**
   - Verify Supabase project URL and keys
   - Check if your IP is allowed (Supabase allows all by default)
   - Ensure database is not paused (auto-pauses after 1 week of inactivity)

3. **RLS Policies Blocking Requests**
   - Review policies in **Authentication** → **Policies**
   - For development, you can temporarily disable RLS on specific tables
   - Check if you need authentication for certain operations

4. **SQL Migration Errors**
   - Run migrations one by one to identify issues
   - Check for conflicting table/column names
   - Ensure foreign key relationships are created in order

### Error Logs

Check logs in:
- **Logs** → **API** (for API endpoint errors)
- **Logs** → **Database** (for SQL errors)
- Browser console (for frontend errors)

## Database Schema Overview

### Core Tables
- `categories` - Content categories (Politics, Culture, etc.)
- `authors` - Writer profiles and bios
- `articles` - Main article records
- `article_translations` - Multilingual content
- `programs` - Podcast/video programs
- `episodes` - Individual program episodes

### User Interaction
- `newsletter_subscriptions` - Email subscriptions
- `guest_submissions` - Article submissions from writers
- `tts_generations` - Text-to-speech processing queue

### Sample Data Included
- 5 sample authors (Dr. Amin Roshdy, Dr. Reem Khoury, etc.)
- 6 content categories
- 6 sample articles with full Arabic content
- 4 sample programs
- 3 newsletter subscriptions (for testing)
- 2 guest submissions (for testing)

## Production Considerations

### Security
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code
- Use Row Level Security for all public-facing tables
- Implement proper authentication before production

### Performance
- Database includes optimized indexes for common queries
- Use pagination for large result sets
- Consider caching for frequently accessed content

### Content Management
- Set up proper content workflows
- Implement content approval processes
- Plan for content moderation

## Next Steps

After successful database setup:

1. **Test all features** - Try submitting articles, subscribing to newsletter
2. **Add real content** - Replace sample data with actual articles
3. **Set up authentication** - Implement user accounts for writers/admins
4. **Configure TTS** - Set up PlayHT for audio generation
5. **Deploy to production** - Use Vercel or similar platform

## Support

For issues:
- Check [Supabase Documentation](https://supabase.com/docs)
- Review error logs in Supabase dashboard
- Ensure all environment variables are correctly set
- Test API endpoints individually to isolate issues

Your database is now ready to power the full Zawaya platform! 🚀 