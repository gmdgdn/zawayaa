# 🚀 Zawaya Platform - Headless WordPress + Supabase Implementation Plan

## 📋 **Implementation Overview**

This plan transforms Zawaya into a hybrid architecture:
- **WordPress**: Editorial CMS for articles, posts, and long-form content
- **Supabase**: Structured data for programs, episodes, writers, and authentication
- **Next.js**: Frontend that consumes both data sources

## 🎯 **Architecture Benefits**
- **Editorial Workflow**: WordPress's mature content management
- **Structured Data**: Supabase's powerful database and real-time features  
- **Performance**: Next.js caching and revalidation
- **Scalability**: Best of both worlds

---

## 📅 **Phase 0: Foundations & Environment Setup**

### **Duration**: 1-2 hours
### **Priority**: 🔴 Critical

#### **Step 0.1: Environment Configuration**

**Task**: Set up environment variables for both WordPress and Supabase

```bash
# Create comprehensive .env.local
```

**Files to Create**:
- `.env.example` - Template with all required variables
- `README-SETUP.md` - Setup instructions

**Environment Variables Needed**:
```env
# Supabase (keep existing)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# WordPress (new)
NEXT_PUBLIC_WP_URL="https://your-wp-domain.com"
WP_API_BASE="${NEXT_PUBLIC_WP_URL}/wp-json/wp/v2"
WP_USERNAME="wp_editor_or_admin"
WP_APP_PASSWORD="application-password"

# Optional GraphQL
WP_GRAPHQL_URL="${NEXT_PUBLIC_WP_URL}/graphql"
```

**Kiro Prompt**:
```
Create a comprehensive .env.example file with WordPress REST API and Supabase configuration. Include a setup README that explains:
1. How to create WordPress Application Passwords
2. Where to get Supabase credentials
3. WordPress REST endpoint testing
4. Environment variable validation
```

#### **Step 0.2: Project Structure Planning**

**Task**: Plan the integration of WordPress client alongside existing Supabase setup

**Decision Points**:
- Keep existing Supabase schema or migrate?
- Gradual migration vs complete overhaul?
- Content type responsibilities (WP vs Supabase)

---

## 📅 **Phase 1: WordPress & Supabase Provisioning**

### **Duration**: 2-3 hours
### **Priority**: 🔴 Critical

#### **Step 1A: WordPress Setup**

**Tasks**:
1. **Provision WordPress** (Cloudways or preferred host)
2. **Install Required Plugins**:
   - Advanced Custom Fields (ACF) Pro
   - WPGraphQL (optional)
   - Custom webhook plugin for revalidation
3. **Configure WordPress**:
   - Enable pretty permalinks
   - Set up SSL and domain
   - Create Application Password
   - Configure ACF REST integration

**Custom Fields to Add** (via ACF):
```php
// Article enhancements
- audio_narration_url (URL)
- audio_duration (Number)
- reading_time_minutes (Number)
- featured_image_alt_ar (Text)
- excerpt_ar (Textarea)
- meta_description_ar (Text)
```

**Kiro Prompt**:
```
Create a WordPress setup checklist and ACF field configuration for Arabic content management. Include:
1. Required plugins list with installation steps
2. ACF field groups for articles with Arabic/English support
3. REST API testing endpoints
4. Application Password creation guide
5. Webhook setup for Next.js revalidation
```

#### **Step 1B: Supabase Schema Updates**

**Tasks**:
1. **Update existing schema** to work alongside WordPress
2. **Add WordPress integration tables**:
   - `wp_post_mappings` - Link WP posts to Supabase features
   - `homepage_features` - Control homepage content
3. **Maintain existing tables** for programs, episodes, writers

**New Tables**:
```sql
-- WordPress post mappings
CREATE TABLE wp_post_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wp_post_id INTEGER NOT NULL,
  wp_post_slug VARCHAR(200) NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  feature_type VARCHAR(50), -- 'hero', 'spotlight', 'trending'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homepage content control
CREATE TABLE homepage_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name VARCHAR(100) NOT NULL, -- 'hero', 'latest', 'programs'
  content_type VARCHAR(50) NOT NULL, -- 'wp_post', 'program', 'episode'
  content_id VARCHAR(100) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Kiro Prompt**:
```
Update the existing Supabase schema to integrate with WordPress. Add tables for:
1. WordPress post mappings and featuring
2. Homepage content control
3. Maintain existing programs/episodes/writers tables
4. Add RLS policies for the new tables
5. Create helper functions for homepage content aggregation
```

---

## 📅 **Phase 2: Data Access Layer Implementation**

### **Duration**: 3-4 hours
### **Priority**: 🔴 Critical

#### **Step 2A: WordPress REST Client**

**Task**: Create WordPress API client with authentication and caching

**Files to Create**:
- `lib/wordpress.ts` - Main WordPress client
- `lib/wp-types.ts` - TypeScript definitions
- `lib/wp-cache.ts` - Caching helpers

**Key Features**:
- Application Password authentication
- ACF field support
- Pagination handling
- Error handling
- Cache tagging

**Kiro Prompt**:
```
Create a comprehensive WordPress REST API client for Next.js App Router with:
1. Application Password authentication
2. TypeScript types for WP posts with ACF fields
3. Functions: wpListPosts, wpGetPostBySlug, wpGetPostById
4. Support for _embed parameter and ACF fields
5. Next.js cache tagging for revalidation
6. Error handling and retry logic
7. Pagination support
```

#### **Step 2B: Enhanced Supabase Clients**

**Task**: Update existing Supabase clients for SSR compatibility

**Files to Update**:
- `lib/supabase.ts` - Add SSR support
- `lib/database.ts` - Add WordPress integration helpers

**New Functions**:
```typescript
// WordPress integration helpers
export const wpIntegrationService = {
  async getHomepageContent(),
  async getFeaturedPosts(),
  async mapWpPostToFeature(),
  async getHomepageFeatures()
}
```

**Kiro Prompt**:
```
Update the existing Supabase client to support SSR with @supabase/ssr and add WordPress integration helpers:
1. Convert existing client to SSR-compatible version
2. Add functions for homepage content aggregation
3. Add WordPress post mapping functions
4. Maintain existing articleService, programService functions
5. Add caching and revalidation support
```

---

## 📅 **Phase 3: Caching & Revalidation System**

### **Duration**: 2-3 hours
### **Priority**: 🟡 High

#### **Step 3A: Cache Tagging Strategy**

**Task**: Implement comprehensive cache tagging for both data sources

**Cache Tags**:
- `articles` - WordPress posts
- `programs` - Supabase programs
- `episodes` - Supabase episodes
- `homepage` - Homepage aggregated content
- `writers` - Writer profiles

**Files to Create**:
- `lib/cache-tags.ts` - Cache tag constants and helpers
- `app/api/revalidate/route.ts` - Revalidation endpoint

**Kiro Prompt**:
```
Implement a comprehensive caching and revalidation system:
1. Add cache tags to all WordPress and Supabase data fetches
2. Create /api/revalidate route that accepts tag parameter
3. Add cache tag constants and helper functions
4. Implement selective revalidation for different content types
5. Add webhook endpoint for WordPress to trigger revalidation
```

#### **Step 3B: WordPress Webhook Integration**

**Task**: Set up WordPress to notify Next.js of content changes

**WordPress Plugin/Code**:
```php
// Add to functions.php or custom plugin
function zawaya_revalidate_on_publish($post_id) {
    $webhook_url = 'https://your-nextjs-app.com/api/revalidate';
    wp_remote_post($webhook_url, [
        'body' => json_encode(['tag' => 'articles']),
        'headers' => ['Content-Type' => 'application/json']
    ]);
}
add_action('publish_post', 'zawaya_revalidate_on_publish');
```

---

## 📅 **Phase 4: Admin Dashboard Enhancement**

### **Duration**: 4-5 hours
### **Priority**: 🟡 High

#### **Step 4A: WordPress Integration in Admin**

**Task**: Add WordPress content management to existing admin panel

**New Admin Pages**:
- `/admin/wordpress` - WordPress content overview
- `/admin/homepage` - Homepage content curation
- `/admin/features` - Featured content management

**Features to Add**:
- WordPress post listing with feature controls
- Homepage section management
- Content scheduling integration
- WordPress media library integration

**Kiro Prompt**:
```
Enhance the existing admin dashboard with WordPress integration:
1. Add WordPress content management pages
2. Create homepage curation interface
3. Add featured content selection
4. Integrate with existing admin layout and authentication
5. Add WordPress media library browser
6. Create content scheduling interface
```

#### **Step 4B: Unified Content Management**

**Task**: Create unified interface for managing both WordPress and Supabase content

**Features**:
- Content type switcher (Articles vs Programs)
- Unified search across both systems
- Content relationship management
- Bulk operations

---

## 📅 **Phase 5: Search & Discovery Enhancement**

### **Duration**: 3-4 hours
### **Priority**: 🟡 Medium

#### **Step 5A: Unified Search Implementation**

**Task**: Create search that covers both WordPress and Supabase content

**Search Sources**:
- WordPress posts (via REST API search)
- Supabase programs/episodes (via FTS)
- Combined results with relevance ranking

**Files to Create**:
- `app/api/search/route.ts` - Unified search endpoint
- `lib/search.ts` - Search aggregation logic
- `components/search/` - Search UI components

**Kiro Prompt**:
```
Implement unified search across WordPress and Supabase:
1. Create search API that queries both WordPress REST and Supabase FTS
2. Implement result ranking and aggregation
3. Add search UI components with filters
4. Support Arabic text search with proper tokenization
5. Add search result highlighting
6. Implement search analytics
```

---

## 📅 **Phase 6: Frontend Pages Integration**

### **Duration**: 5-6 hours
### **Priority**: 🔴 Critical

#### **Step 6A: Homepage Redesign**

**Task**: Update homepage to pull from both WordPress and Supabase

**New Homepage Structure**:
```typescript
// Homepage data sources
const homepageData = {
  hero: await wpGetFeaturedPost(),
  latestArticles: await wpListPosts({ per_page: 6 }),
  featuredPrograms: await supabase.getFeaturedPrograms(),
  spotlightWriter: await supabase.getFeaturedWriter(),
  newsletter: // existing implementation
}
```

**Kiro Prompt**:
```
Redesign the homepage to integrate WordPress and Supabase content:
1. Update homepage to fetch from both data sources
2. Maintain existing Arabic RTL design
3. Add proper loading states and error handling
4. Implement cache tagging for selective updates
5. Add SEO optimization with dynamic meta tags
6. Ensure mobile responsiveness
```

#### **Step 6B: Article Pages Enhancement**

**Task**: Update article pages to use WordPress data with Supabase enhancements

**Features**:
- WordPress content with ACF fields
- Supabase-powered features (views, likes, comments)
- Audio narration integration
- Related content suggestions

**Kiro Prompt**:
```
Update article pages to use WordPress as primary source:
1. Fetch article content from WordPress REST API
2. Integrate ACF fields (audio, reading time, etc.)
3. Add Supabase-powered engagement features
4. Maintain existing Arabic typography and RTL layout
5. Add structured data for SEO
6. Implement social sharing
```

---

## 📅 **Phase 7: Security & Performance Optimization**

### **Duration**: 2-3 hours
### **Priority**: 🟡 High

#### **Step 7A: Security Hardening**

**Tasks**:
1. **WordPress Security**:
   - Secure Application Passwords
   - Rate limiting for API calls
   - CORS configuration

2. **Supabase Security**:
   - Review and update RLS policies
   - Secure storage bucket policies
   - API rate limiting

3. **Next.js Security**:
   - Security headers
   - CSRF protection
   - Input validation

**Kiro Prompt**:
```
Implement comprehensive security measures:
1. Add security headers and CSRF protection
2. Implement rate limiting for public APIs
3. Review and update Supabase RLS policies
4. Add input validation and sanitization
5. Secure WordPress API integration
6. Add monitoring and alerting
```

#### **Step 7B: Performance Optimization**

**Tasks**:
- Image optimization for both sources
- Font preloading
- Bundle optimization
- Core Web Vitals optimization

---

## 📅 **Phase 8: Deployment & Monitoring**

### **Duration**: 2-3 hours
### **Priority**: 🟡 High

#### **Step 8A: Production Deployment**

**Tasks**:
1. **Environment Setup**:
   - Production WordPress instance
   - Supabase production project
   - Vercel deployment

2. **Configuration**:
   - Environment variables
   - Domain configuration
   - SSL certificates

**Kiro Prompt**:
```
Create production deployment guide:
1. WordPress production setup checklist
2. Supabase production migration
3. Vercel deployment configuration
4. Environment variable management
5. Domain and SSL setup
6. Performance monitoring setup
```

#### **Step 8B: Monitoring & Analytics**

**Tasks**:
- Error tracking (Sentry)
- Performance monitoring
- Content analytics
- User behavior tracking

---

## 🎯 **Implementation Priority Matrix**

### **Phase 1 Priority** (Must Complete First):
1. ✅ Phase 0: Environment setup
2. ✅ Phase 1: WordPress & Supabase provisioning
3. ✅ Phase 2: Data access layer

### **Phase 2 Priority** (Core Functionality):
4. ✅ Phase 3: Caching & revalidation
5. ✅ Phase 6: Frontend integration

### **Phase 3 Priority** (Enhancement):
6. ✅ Phase 4: Admin dashboard
7. ✅ Phase 5: Search enhancement

### **Phase 4 Priority** (Production):
8. ✅ Phase 7: Security & performance
9. ✅ Phase 8: Deployment & monitoring

---

## 🤔 **Key Decisions Needed**

Before we start implementation, please confirm:

1. **WordPress Hosting**: Cloudways, WP Engine, or other preference?
2. **Migration Strategy**: Gradual migration or complete overhaul?
3. **Content Responsibility**: Which content types go to WordPress vs Supabase?
4. **Timeline**: Preferred completion timeline?
5. **Budget**: Any constraints for hosting/services?

## 📋 **Ready-to-Use Kiro Prompts**

I've prepared specific prompts for each phase that you can copy-paste directly into Kiro/Windsurf. Each prompt includes:
- Specific technical requirements
- File structure guidance
- Code examples
- Integration points
- Testing criteria

Would you like me to start with Phase 0 and create the environment setup, or do you have questions about any specific phase?