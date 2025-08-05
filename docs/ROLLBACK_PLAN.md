# WordPress Migration Rollback Plan

**Document Version:** 1.0  
**Created:** 2025-01-08  
**Last Updated:** 2025-01-08  

## Overview

This document outlines the comprehensive rollback plan for the WordPress migration of the Zawaya platform. The plan provides step-by-step procedures to quickly revert to the previous hybrid Supabase + WordPress architecture in case of critical issues with the WordPress-only implementation.

## Rollback Triggers

### Critical Issues Requiring Immediate Rollback

1. **WordPress API Complete Failure**
   - WordPress server becomes completely inaccessible
   - WordPress REST API returns consistent 500 errors
   - WordPress authentication fails across all endpoints

2. **Data Loss or Corruption**
   - Content missing from WordPress
   - ACF fields returning corrupted data
   - Media files inaccessible or corrupted

3. **Performance Degradation**
   - Page load times exceed 5 seconds consistently
   - WordPress API response times exceed 3 seconds
   - Cache hit rate drops below 70%

4. **Security Vulnerabilities**
   - WordPress credentials compromised
   - Unauthorized access to WordPress admin
   - Security vulnerabilities in WordPress plugins

5. **User Experience Issues**
   - Arabic RTL functionality broken
   - Critical features non-functional
   - Search functionality completely broken

## Pre-Rollback Checklist

### Immediate Assessment (5 minutes)

- [ ] Verify the issue is not a temporary network problem
- [ ] Check WordPress server status and accessibility
- [ ] Confirm the issue affects production users
- [ ] Assess the severity and impact scope
- [ ] Document the specific issue and error messages

### Stakeholder Notification (10 minutes)

- [ ] Notify technical team lead
- [ ] Inform content management team
- [ ] Alert customer support team
- [ ] Prepare user communication if needed

### Backup Verification (5 minutes)

- [ ] Confirm Supabase backup is available and recent
- [ ] Verify previous codebase backup exists
- [ ] Check database backup integrity
- [ ] Confirm environment variables backup

## Rollback Procedures

### Phase 1: Emergency Response (15 minutes)

#### 1.1 Immediate Damage Control

```bash
# 1. Switch to maintenance mode (if available)
echo "MAINTENANCE_MODE=true" >> .env.local

# 2. Create incident log
echo "$(date): WordPress migration rollback initiated" >> logs/rollback.log

# 3. Backup current state before rollback
git add .
git commit -m "Pre-rollback backup: $(date)"
git tag "pre-rollback-$(date +%Y%m%d-%H%M%S)"
```

#### 1.2 Quick Status Check

```bash
# Check WordPress connectivity
curl -I https://wordpress-1401009-5702602.cloudwaysapps.com/wp-json/wp/v2/

# Check application status
curl -I http://localhost:3000/ar

# Log system status
echo "$(date): System status check completed" >> logs/rollback.log
```

### Phase 2: Code Rollback (30 minutes)

#### 2.1 Revert to Previous Codebase

```bash
# 1. Create rollback branch
git checkout -b rollback-to-supabase-$(date +%Y%m%d)

# 2. Revert to last known good commit (before WordPress migration)
git revert --no-edit HEAD~50..HEAD  # Adjust range as needed

# Or restore from backup tag
git checkout tags/pre-wordpress-migration

# 3. Create new branch from restored state
git checkout -b restored-supabase-$(date +%Y%m%d)
```

#### 2.2 Restore Supabase Dependencies

```bash
# 1. Restore package.json with Supabase dependencies
git checkout HEAD~50 -- package.json  # Adjust as needed

# 2. Reinstall dependencies
npm install

# 3. Restore Supabase configuration files
git checkout HEAD~50 -- lib/supabase/
git checkout HEAD~50 -- .env.example
```

#### 2.3 Restore Environment Configuration

```bash
# 1. Backup current .env.local
cp .env.local .env.local.wordpress-backup

# 2. Restore Supabase environment variables
cat > .env.local << EOF
# Supabase Configuration (Restored)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# WordPress Configuration (Fallback)
NEXT_PUBLIC_WP_URL=https://wordpress-1401009-5702602.cloudwaysapps.com
WP_API_BASE=https://wordpress-1401009-5702602.cloudwaysapps.com/wp-json/wp/v2
WP_USERNAME=Zawayawp
WP_APP_PASSWORD=lDLhSBco7QgR3IDuOZQzoY6k

# Other configurations...
EOF
```

### Phase 3: Database Restoration (20 minutes)

#### 3.1 Supabase Database Restoration

```bash
# 1. Verify Supabase connection
npx supabase status

# 2. Restore database schema if needed
npx supabase db reset

# 3. Restore data from backup
# (This would involve specific Supabase restoration procedures)
```

#### 3.2 Data Migration Back to Supabase

```sql
-- Example SQL for data restoration
-- (Specific queries would depend on backup format)

-- Restore articles table
INSERT INTO articles (id, title, content, created_at, updated_at)
SELECT id, title, content, created_at, updated_at
FROM articles_backup;

-- Restore programs table
INSERT INTO programs (id, title, description, created_at, updated_at)
SELECT id, title, description, created_at, updated_at
FROM programs_backup;
```

### Phase 4: Application Restoration (15 minutes)

#### 4.1 Restore Admin Interface

```bash
# 1. Restore admin pages
git checkout HEAD~50 -- app/admin/

# 2. Restore admin components
git checkout HEAD~50 -- components/admin/

# 3. Restore admin API routes
git checkout HEAD~50 -- app/api/admin/
```

#### 4.2 Restore Supabase Integration

```bash
# 1. Restore Supabase client files
git checkout HEAD~50 -- lib/supabase-client.ts
git checkout HEAD~50 -- lib/supabase-server.ts

# 2. Restore data fetching functions
git checkout HEAD~50 -- lib/data/

# 3. Restore authentication
git checkout HEAD~50 -- lib/auth/
```

#### 4.3 Update Page Components

```bash
# 1. Restore page components to use Supabase
git checkout HEAD~50 -- app/ar/page.tsx
git checkout HEAD~50 -- app/ar/articles/
git checkout HEAD~50 -- app/ar/programs/

# 2. Restore middleware
git checkout HEAD~50 -- middleware.ts
```

### Phase 5: Testing and Verification (20 minutes)

#### 5.1 Build and Start Application

```bash
# 1. Clean build
npm run build

# 2. Start application
npm run dev

# 3. Verify startup
curl -I http://localhost:3000/ar
```

#### 5.2 Functional Testing

```bash
# 1. Test homepage
curl http://localhost:3000/ar | grep -i "supabase\|error"

# 2. Test admin interface
curl http://localhost:3000/admin | head -20

# 3. Test API endpoints
curl http://localhost:3000/api/articles | jq '.length'
```

#### 5.3 Database Connectivity

```bash
# 1. Test Supabase connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('articles').select('count').then(console.log);
"
```

## Post-Rollback Procedures

### Immediate Actions (30 minutes)

#### 1. System Verification

- [ ] Verify all pages load correctly
- [ ] Test admin interface functionality
- [ ] Confirm database connectivity
- [ ] Validate user authentication
- [ ] Test content creation workflow

#### 2. Performance Check

- [ ] Monitor page load times
- [ ] Check database query performance
- [ ] Verify cache functionality
- [ ] Test under normal load

#### 3. User Communication

- [ ] Notify users of service restoration
- [ ] Update status page
- [ ] Communicate with stakeholders
- [ ] Document lessons learned

### Follow-up Actions (24 hours)

#### 1. Root Cause Analysis

- [ ] Analyze what caused the rollback
- [ ] Document technical issues
- [ ] Identify process improvements
- [ ] Update migration plan

#### 2. Data Synchronization

- [ ] Sync any content created during WordPress-only period
- [ ] Verify data consistency
- [ ] Update content in both systems
- [ ] Plan for re-migration

#### 3. Monitoring Enhancement

- [ ] Implement additional monitoring
- [ ] Set up alerting for similar issues
- [ ] Create automated health checks
- [ ] Improve incident response procedures

## Rollback Testing

### Pre-Production Testing

#### 1. Staging Environment Rollback

```bash
# 1. Create staging rollback test
git checkout -b staging-rollback-test

# 2. Simulate rollback procedures
# (Follow all rollback steps in staging)

# 3. Verify functionality
npm run test:e2e
npm run test:integration
```

#### 2. Performance Testing

```bash
# 1. Load testing after rollback
npm run test:load

# 2. Database performance testing
npm run test:db-performance

# 3. API response time testing
npm run test:api-performance
```

### Rollback Validation Checklist

- [ ] Homepage loads within 2 seconds
- [ ] Admin interface accessible
- [ ] Content creation works
- [ ] User authentication functions
- [ ] Database queries perform well
- [ ] All API endpoints respond
- [ ] Arabic RTL functionality works
- [ ] Search functionality operational
- [ ] Media uploads work
- [ ] Email notifications sent

## Monitoring and Alerting

### Critical Metrics to Monitor

#### Application Health

```javascript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  const checks = {
    supabase: await checkSupabaseConnection(),
    wordpress: await checkWordPressConnection(),
    database: await checkDatabaseConnection(),
    cache: await checkCacheStatus()
  };
  
  const healthy = Object.values(checks).every(check => check.status === 'ok');
  
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  });
});
```

#### Performance Metrics

- Page load times (target: < 2 seconds)
- API response times (target: < 500ms)
- Database query times (target: < 100ms)
- Cache hit rates (target: > 80%)
- Error rates (target: < 1%)

#### Alert Thresholds

- **Critical:** Page load time > 5 seconds
- **Warning:** API response time > 1 second
- **Critical:** Error rate > 5%
- **Warning:** Cache hit rate < 70%
- **Critical:** Database connection failures

### Monitoring Tools Setup

#### 1. Application Monitoring

```javascript
// monitoring/app-monitor.js
const monitor = {
  async checkPageLoad(url) {
    const start = Date.now();
    const response = await fetch(url);
    const loadTime = Date.now() - start;
    
    return {
      url,
      status: response.status,
      loadTime,
      healthy: response.ok && loadTime < 2000
    };
  },
  
  async checkApiEndpoint(endpoint) {
    const start = Date.now();
    const response = await fetch(endpoint);
    const responseTime = Date.now() - start;
    
    return {
      endpoint,
      status: response.status,
      responseTime,
      healthy: response.ok && responseTime < 500
    };
  }
};
```

#### 2. Database Monitoring

```javascript
// monitoring/db-monitor.js
const dbMonitor = {
  async checkSupabaseHealth() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('count')
        .limit(1);
      
      return {
        service: 'supabase',
        status: error ? 'error' : 'ok',
        error: error?.message
      };
    } catch (err) {
      return {
        service: 'supabase',
        status: 'error',
        error: err.message
      };
    }
  }
};
```

#### 3. WordPress Monitoring

```javascript
// monitoring/wp-monitor.js
const wpMonitor = {
  async checkWordPressHealth() {
    try {
      const response = await fetch(`${process.env.WP_API_BASE}/posts?per_page=1`);
      
      return {
        service: 'wordpress',
        status: response.ok ? 'ok' : 'error',
        statusCode: response.status,
        responseTime: response.headers.get('x-response-time')
      };
    } catch (err) {
      return {
        service: 'wordpress',
        status: 'error',
        error: err.message
      };
    }
  }
};
```

## Emergency Contacts

### Technical Team

- **Lead Developer:** [Name] - [Phone] - [Email]
- **DevOps Engineer:** [Name] - [Phone] - [Email]
- **Database Administrator:** [Name] - [Phone] - [Email]

### Business Team

- **Product Manager:** [Name] - [Phone] - [Email]
- **Content Manager:** [Name] - [Phone] - [Email]
- **Customer Support Lead:** [Name] - [Phone] - [Email]

### External Services

- **WordPress Hosting (Cloudways):** [Support Contact]
- **Supabase Support:** [Support Contact]
- **CDN Provider:** [Support Contact]

## Documentation and Logging

### Rollback Log Template

```
ROLLBACK LOG
============
Date: [Date and Time]
Initiated By: [Name]
Reason: [Detailed reason for rollback]
Severity: [Critical/High/Medium/Low]

TIMELINE:
[Time] - Issue detected
[Time] - Rollback decision made
[Time] - Rollback initiated
[Time] - Code reverted
[Time] - Database restored
[Time] - Application restarted
[Time] - Verification completed
[Time] - Users notified

IMPACT:
- Affected Users: [Number/Percentage]
- Downtime: [Duration]
- Data Loss: [Yes/No - Details]
- Revenue Impact: [If applicable]

RESOLUTION:
- Root Cause: [Technical details]
- Fix Applied: [What was done]
- Prevention: [How to prevent in future]

LESSONS LEARNED:
- [Key takeaways]
- [Process improvements]
- [Technical improvements]
```

## Success Criteria

### Rollback Success Indicators

- [ ] Application accessible within 30 minutes
- [ ] All critical features functional
- [ ] No data loss occurred
- [ ] Performance metrics within acceptable range
- [ ] User experience restored to pre-migration state

### Post-Rollback Validation

- [ ] 24-hour stability period completed
- [ ] All monitoring alerts cleared
- [ ] User feedback positive
- [ ] Performance metrics stable
- [ ] No recurring issues detected

---

**Document Approval:**
- Technical Lead: [Signature/Date]
- Product Manager: [Signature/Date]
- DevOps Lead: [Signature/Date]

**Next Review Date:** [Date]

*This document should be reviewed and updated quarterly or after any significant system changes.*