# Admin Panel Setup Guide

This guide helps you set up the admin panel for the Zawaya platform after completing Phase 4 (Database Integration).

## Prerequisites

✅ **Phase 4 completed** - Database is set up and working
✅ **Environment variables** - Supabase credentials configured  
✅ **Sample data** - Database populated with content

## Step 1: Create Admin User

### 1.1 Create User in Supabase Auth

1. Go to your **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"**
3. Enter admin details:
   - **Email**: `admin@zawaya.com` (or your preferred admin email)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Enable
4. Click **"Create new user"**
5. **Copy the User ID** from the users list (you'll need this)

### 1.2 Add Admin Role to Database

1. Go to **SQL Editor** in Supabase
2. Run the admin roles migration:

```sql
-- First, run the role migration
-- Copy and paste from scripts/add-author-roles.sql
```

3. **Update the admin user ID**:

```sql
-- Replace '00000000-0000-0000-0000-000000000000' with your actual User ID
UPDATE authors 
SET id = 'YOUR_ACTUAL_USER_ID_HERE'
WHERE email = 'admin@zawaya.com';
```

## Step 2: Test Admin Access

### 2.1 Start Development Server

```bash
npm run dev
```

### 2.2 Access Admin Panel

1. Visit: `http://localhost:3000/admin`
2. You should be redirected to: `http://localhost:3000/admin/login`
3. Login with your admin credentials
4. You should see the admin dashboard

## Step 3: Admin Panel Features

### 🏠 Dashboard (`/admin`)
- **Platform statistics** - Articles, authors, views, subscribers
- **Recent activity** - Latest articles and submissions
- **Submissions overview** - Pending, under review, approved
- **Quick actions** - Add article, review submissions, view analytics

### 📝 Articles Management (`/admin/articles`)  
- **View all articles** - With search and filtering
- **Edit articles** - Modify existing content
- **Delete articles** - Remove content (with confirmation)
- **Feature articles** - Mark articles as featured
- **Bulk operations** - Multiple article management

### 📋 Submissions Review (`/admin/submissions`)
- **Review submissions** - From guest writers
- **Status management** - Pending → Under Review → Approved/Rejected
- **Add feedback** - Comments for writers
- **Full content view** - Read complete submissions

## Step 4: User Roles

### 👑 Admin
- **Full access** to all admin features
- **User management** capabilities
- **System settings** control
- **Content moderation** powers

### ✏️ Editor  
- **Content management** - Articles and submissions
- **Review submissions** - Approve/reject content
- **Moderate comments** - When implemented
- **View analytics** - Platform statistics

### 📝 Author
- **Regular platform access** only
- **Cannot access admin panel**
- **Submit articles** via guest submission form

## Step 5: Adding More Admins/Editors

### Method 1: Through Database (Recommended)

1. **Create user in Supabase Auth** (Step 1.1 above)
2. **Add to authors table**:

```sql
INSERT INTO authors (
    id, 
    name_ar, 
    name_en, 
    email, 
    role,
    bio_ar,
    is_verified,
    created_at, 
    updated_at
) VALUES (
    'USER_ID_FROM_AUTH',  -- Get from Supabase Auth
    'اسم المحرر',         -- Arabic name
    'Editor Name',        -- English name  
    'editor@email.com',   -- Email
    'editor',             -- Role: 'admin' or 'editor'
    'محرر في منصة زوايا',  -- Arabic bio
    true,                 -- Verified
    NOW(),
    NOW()
);
```

### Method 2: Through Admin Panel (Future)

*This will be implemented in a future update with user management interface.*

## Step 6: Security Checklist

### ✅ Environment Variables
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is secure and not exposed
- [ ] `.env.local` is not committed to version control
- [ ] Production environment variables are properly set

### ✅ Database Security  
- [ ] Row Level Security (RLS) is enabled
- [ ] Admin roles are properly assigned
- [ ] Test permissions with different user roles

### ✅ Access Control
- [ ] Admin routes are protected by middleware
- [ ] Users without admin role get "Unauthorized" page
- [ ] Session management works correctly

## Step 7: Troubleshooting

### Problem: "Unauthorized" page when accessing admin

**Solutions:**
1. **Check user role in database**:
   ```sql
   SELECT id, email, role FROM authors WHERE email = 'your@email.com';
   ```
2. **Ensure role is 'admin' or 'editor'**
3. **Verify user ID matches between auth.users and authors table**

### Problem: "Cannot find profile" error

**Solutions:**
1. **Check if user exists in authors table**:
   ```sql
   SELECT * FROM authors WHERE id = 'YOUR_USER_ID';
   ```
2. **Add missing user to authors table** (see Step 5)

### Problem: Middleware redirects not working

**Solutions:**
1. **Check middleware.ts** is in root directory
2. **Verify environment variables** are loaded
3. **Restart development server** after changes

## Step 8: Next Steps

After setting up the admin panel:

1. **📝 Add real content** - Replace sample data with actual articles
2. **👥 Invite editors** - Add team members with editor role  
3. **📊 Monitor usage** - Use dashboard analytics
4. **🔧 Customize features** - Modify admin panel as needed
5. **🚀 Deploy to production** - Follow deployment guide

## Support

### Common Issues
- **Database connection errors** → Check environment variables
- **Permission errors** → Verify user roles in database  
- **Login issues** → Check Supabase Auth configuration

### Getting Help
- Check browser console for errors
- Review Supabase logs for API issues
- Ensure all migration scripts were run successfully

**Your admin panel is now ready! 🎉**

Access it at: `http://localhost:3000/admin` 