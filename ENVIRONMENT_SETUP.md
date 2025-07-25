# Zawaya Platform - Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://etsnhjqduvviooqlgidh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0c25oanFkdXZ2aW9vcWxnaWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA0ODQsImV4cCI6MjA2OTAxNjQ4NH0.bXg5sEwDvPowCknyCHdpvlJp9rfK6DMTxrSpzHXhoc8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0c25oanFkdXZ2aW9vcWxnaWRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ0MDQ4NCwiZXhwIjoyMDY5MDE2NDg0fQ.ZhprRaWCYwL9QQFh0IKVAiP9nIvcAAlP-vldkkK70Kw

# PlayHT Text-to-Speech Service (Required for TTS feature)
PLAYHT_API_KEY=your_playht_api_key_here
PLAYHT_USER_ID=your_playht_user_id_here

# Optional: Analytics & Monitoring
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_analytics_id_here

# Optional: Email Service (for newsletters)
RESEND_API_KEY=your_resend_api_key_here
NEWSLETTER_FROM_EMAIL=newsletter@zawaya.com

# Development Settings
NODE_ENV=development
```

## Setup Steps

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Get your service role key (for server-side operations)
4. Run the database schema from `/scripts/create-database-schema.sql`
5. Seed initial data using other scripts in `/scripts/` folder

### 2. PlayHT Setup (for TTS)
1. Sign up at [PlayHT](https://play.ht)
2. Get your API key and User ID from dashboard
3. Choose voice models for Arabic and English content

### 3. Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Database Schema

The platform uses the following main tables:
- `articles` - Main content articles
- `authors` - Author profiles
- `categories` - Content categories
- `programs` - Podcast/video programs
- `episodes` - Individual podcast episodes
- `guest_submissions` - Guest article submissions
- `newsletter_subscriptions` - Email subscribers
- `tts_generations` - Audio generation tracking

## Content Structure

### Arabic Sections (/ar/*)
- آراء سياسية (Political Opinions)
- تقدير موقف (Situation Assessment)
- مقالات (Articles) with subcategories: فن، أدب، ثقافة، تاريخ
- بودكاست (Podcasts)
- البرامج (Programs)
- الوثائقيات (Documentaries)
- حضارة الشرق (Eastern Civilization)
- منبر الكُتّاب (Writers' Platform)

### English Sections (/en/*) - Phase 5
- Opinion Articles
- Documentaries
- Eastern Civilization
- Newsletter

## Audio/TTS Integration

Every article includes:
- Text-to-speech generation via PlayHT
- Audio player with "Al-Sharq Al-Awsat style" introduction
- Automatic audio URL storage in database

## Deployment

The platform is configured for Vercel deployment with:
- Automatic builds on git push
- Environment variables in Vercel dashboard
- Edge functions for Supabase operations 