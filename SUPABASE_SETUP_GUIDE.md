# 🚀 Supabase Integration Setup Guide

This guide will help you set up Supabase integration for the Zawaya platform.

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Environment Variables**: Configured `.env.local` file
3. **Node.js**: Version 18+ installed

## 🔧 Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and fill project details:
   - **Name**: `zawaya-platform`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Wait for project to be created (2-3 minutes)

## 🔑 Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Public anon key** (starts with `eyJ...`)
   - **Service role key** (starts with `eyJ...`)

## 📝 Step 3: Configure Environment Variables

Create or update `.env.local` in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
```

**⚠️ Important**: 
- Replace the example values with your actual Supabase credentials
- Never commit `.env.local` to version control
- The service role key has admin privileges - keep it secure

## 🗄️ Step 4: Create Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of each SQL file in order:

```sql
-- 1. First, run: scripts/create-database-schema.sql
-- 2. Then run: scripts/seed-categories.sql  
-- 3. Finally run: scripts/seed-sample-data.sql
```

### Option B: Using the Setup Script

```bash
# Install dependencies if not already done
npm install

# Run the setup script
node scripts/setup-supabase.js
```

## 🧪 Step 5: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Test the Supabase connection:
```bash
curl http://localhost:3000/api/test-supabase
```

You should see:
```json
{
  "overallStatus": "success",
  "tests": [
    {"name": "Environment Variables", "status": "success"},
    {"name": "Basic Supabase Connection", "status": "success"},
    {"name": "Database Schema", "status": "success"},
    {"name": "Sample Data", "status": "success"}
  ]
}
```

## 📊 Step 6: Verify Admin Dashboard

1. Go to `http://localhost:3000/admin`
2. You should see:
   - Articles management with sample data
   - Authors list
   - Categories
   - Dashboard statistics

## 🔒 Step 7: Configure Row Level Security (RLS)

For production, enable RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published content
CREATE POLICY "Allow public read access to published articles" 
ON articles FOR SELECT 
USING (status = 'published');

CREATE POLICY "Allow public read access to categories" 
ON categories FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow public read access to authors" 
ON authors FOR SELECT 
USING (true);

-- Admin policies (service role can do everything)
CREATE POLICY "Allow admin full access" 
ON articles FOR ALL 
USING (auth.role() = 'service_role');

-- Repeat for other tables...
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"relation does not exist" error**
   - Solution: Run the database schema scripts
   - Check: SQL Editor → run `create-database-schema.sql`

2. **"Invalid API key" error**
   - Solution: Verify your environment variables
   - Check: Project settings → API keys

3. **"Project not found" error**
   - Solution: Ensure project URL is correct
   - Check: Project URL doesn't have trailing slash

4. **CORS issues**
   - Solution: Add your domain to allowed origins
   - Location: Authentication → Settings → Site URL

### Test Commands:

```bash
# Test basic connection
curl http://localhost:3000/api/test-supabase

# Test articles API
curl http://localhost:3000/api/articles?limit=5

# Test specific article
curl http://localhost:3000/api/articles/po-001

# Test newsletter subscription
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## 📈 Production Setup

### 1. Enable Database Backups
- Go to **Settings** → **Database**
- Enable **Point-in-time Recovery**

### 2. Set up Monitoring
- Enable **Database Monitoring**
- Set up **Email Alerts** for downtime

### 3. Performance Optimization
- Add indexes for frequently queried columns
- Enable **Connection Pooling** if needed
- Monitor **Database Performance** tab

### 4. Security Best Practices
- Enable **Row Level Security** on all tables
- Set up proper **Auth policies**
- Regularly rotate **API keys**
- Use **Database Webhooks** for audit logging

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Performance Optimization](https://supabase.com/docs/guides/platform/performance)
- [Zawaya API Documentation](./API_DOCUMENTATION.md)

## 🆘 Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting) above
2. Run the diagnostic test: `http://localhost:3000/api/test-supabase`
3. Review the server logs in your terminal
4. Check Supabase project logs in the dashboard

---

**✅ Once completed, your Supabase integration should be fully functional with the Zawaya platform!** 