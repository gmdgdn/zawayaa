# Vercel Security Configuration Guide

## Overview

This guide provides detailed instructions for securely configuring environment variables in Vercel with proper encryption and access controls for the Zawaya WordPress integration.

## Environment Variable Security Matrix

| Variable | Type | Encryption | Production | Preview | Development | Notes |
|----------|------|------------|------------|---------|-------------|-------|
| `NEXT_PUBLIC_WP_URL` | Public | No | ✅ | ✅ | ✅ | Client-side accessible |
| `WP_API_BASE` | Server | No | ✅ | ✅ | ❌ | Server-side only |
| `WP_USERNAME` | Server | **Yes** | ✅ | ✅ | ❌ | Sensitive credential |
| `WP_APP_PASSWORD` | Server | **Yes** | ✅ | ✅ | ❌ | Sensitive credential |
| `REVALIDATION_SECRET` | Server | **Yes** | ✅ | ✅ | ❌ | Security token |

## Step-by-Step Security Configuration

### 1. Access Vercel Environment Variables

1. Navigate to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **zawaya-platform**
3. Go to **Settings** → **Environment Variables**

### 2. Configure Public Variables (No Encryption)

#### NEXT_PUBLIC_WP_URL
```
Name: NEXT_PUBLIC_WP_URL
Value: https://wordpress-1401009-5702602.cloudwaysapps.com
Environments: ✅ Production ✅ Preview ✅ Development
Sensitive: ❌ No
```

#### WP_API_BASE
```
Name: WP_API_BASE
Value: https://wordpress-1401009-5702602.cloudwaysapps.com/wp-json/wp/v2
Environments: ✅ Production ✅ Preview ❌ Development
Sensitive: ❌ No
```

### 3. Configure Sensitive Variables (With Encryption)

#### WP_USERNAME
```
Name: WP_USERNAME
Value: e.elrefae@dbrandria.com
Environments: ✅ Production ✅ Preview ❌ Development
Sensitive: ✅ Yes (Enable Encryption)
```

**Security Settings:**
- ✅ Enable "Sensitive" checkbox
- ✅ Restrict to Production and Preview only
- ❌ Do not include in Development environment
- ✅ Enable team access restrictions (if applicable)

#### WP_APP_PASSWORD
```
Name: WP_APP_PASSWORD
Value: nja8QODKRKpOkVX5ELhe934a
Environments: ✅ Production ✅ Preview ❌ Development
Sensitive: ✅ Yes (Enable Encryption)
```

**Security Settings:**
- ✅ Enable "Sensitive" checkbox
- ✅ Restrict to Production and Preview only
- ❌ Do not include in Development environment
- ✅ Enable team access restrictions (if applicable)

#### REVALIDATION_SECRET
```
Name: REVALIDATION_SECRET
Value: zawaya-wp-revalidation-2025-secure-token
Environments: ✅ Production ✅ Preview ❌ Development
Sensitive: ✅ Yes (Enable Encryption)
```

**Security Settings:**
- ✅ Enable "Sensitive" checkbox
- ✅ Restrict to Production and Preview only
- ❌ Do not include in Development environment
- ✅ Enable team access restrictions (if applicable)

## Vercel Security Features

### 1. Environment Variable Encryption

When you mark a variable as "Sensitive":
- ✅ Variable is encrypted at rest in Vercel's database
- ✅ Variable is encrypted in transit during deployments
- ✅ Variable values are masked in the Vercel dashboard
- ✅ Variable values are not exposed in build logs
- ✅ Variable values are not accessible via client-side code

### 2. Environment Isolation

**Production Environment:**
- Contains all sensitive credentials
- Used for live website deployments
- Highest security restrictions

**Preview Environment:**
- Contains same credentials as production
- Used for feature branch deployments
- Allows testing with real WordPress data

**Development Environment:**
- Should NOT contain sensitive credentials
- Uses local `.env.local` file instead
- Prevents credential exposure in development

### 3. Access Control

**Team Access Restrictions:**
- Limit which team members can view sensitive variables
- Require admin approval for environment variable changes
- Audit log for all environment variable modifications

## Security Verification Checklist

### Pre-Deployment Verification

- [ ] All sensitive variables marked as "Sensitive" in Vercel
- [ ] Sensitive variables restricted to Production and Preview only
- [ ] No sensitive variables exposed in Development environment
- [ ] Variable values are masked in Vercel dashboard
- [ ] Team access restrictions configured (if applicable)

### Post-Deployment Verification

- [ ] WordPress connection works in Production
- [ ] WordPress connection works in Preview deployments
- [ ] Revalidation webhook authentication works
- [ ] No sensitive data appears in deployment logs
- [ ] Environment variables load correctly in application

### Security Monitoring

- [ ] Regular audit of environment variable access logs
- [ ] Monitor for unauthorized environment variable changes
- [ ] Verify no sensitive data in application error logs
- [ ] Check for credential exposure in client-side bundles

## Environment Variable Rotation

### WordPress Credentials Rotation

**Frequency:** Every 90 days or when compromised

**Steps:**
1. Generate new WordPress application password
2. Update `WP_APP_PASSWORD` in Vercel
3. Test connection in Preview environment
4. Deploy to Production
5. Revoke old application password in WordPress

### Revalidation Secret Rotation

**Frequency:** Every 180 days or when compromised

**Steps:**
1. Generate new secure random token
2. Update WordPress revalidation plugin configuration
3. Update `REVALIDATION_SECRET` in Vercel
4. Test webhook functionality in Preview
5. Deploy to Production

## Security Best Practices

### 1. Credential Management

```bash
# Generate secure revalidation secret
openssl rand -base64 32

# Verify WordPress application password format
# Should be exactly 24 characters: [a-zA-Z0-9]{24}
```

### 2. Environment Variable Validation

```javascript
// Runtime validation in application
function validateEnvironmentVariables() {
  const required = [
    'NEXT_PUBLIC_WP_URL',
    'WP_API_BASE', 
    'WP_USERNAME',
    'WP_APP_PASSWORD',
    'REVALIDATION_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  // Validate WordPress app password format
  if (process.env.WP_APP_PASSWORD?.length !== 24) {
    throw new Error('WordPress app password must be 24 characters');
  }
  
  // Validate revalidation secret strength
  if (process.env.REVALIDATION_SECRET?.length < 32) {
    throw new Error('Revalidation secret must be at least 32 characters');
  }
}
```

### 3. Logging Security

```javascript
// Safe logging that doesn't expose credentials
function safeLog(message, data = {}) {
  const sanitized = { ...data };
  
  // Remove sensitive fields
  delete sanitized.WP_APP_PASSWORD;
  delete sanitized.REVALIDATION_SECRET;
  delete sanitized.secret;
  delete sanitized.password;
  
  // Mask sensitive URLs
  if (sanitized.WP_API_BASE) {
    sanitized.WP_API_BASE = sanitized.WP_API_BASE.replace(/\/\/[^@]+@/, '//***:***@');
  }
  
  console.log(message, sanitized);
}
```

## Incident Response

### Credential Compromise Response

**Immediate Actions (< 1 hour):**
1. Rotate compromised credentials immediately
2. Update environment variables in Vercel
3. Force redeploy all environments
4. Revoke old credentials in WordPress

**Investigation Actions (< 24 hours):**
1. Review access logs for unauthorized access
2. Check deployment logs for credential exposure
3. Audit team member access to environment variables
4. Verify no credentials in version control history

**Prevention Actions (< 1 week):**
1. Implement additional access controls
2. Set up monitoring for credential usage
3. Review and update security procedures
4. Schedule regular credential rotation

### Security Monitoring

**Automated Monitoring:**
- Environment variable access logging
- Failed authentication attempts
- Unusual API usage patterns
- Deployment failure alerts

**Manual Reviews:**
- Monthly environment variable audit
- Quarterly security configuration review
- Annual penetration testing
- Regular team access review

## Compliance Considerations

### Data Protection

- Environment variables containing personal data (like email addresses) should be treated as PII
- Implement data retention policies for environment variable history
- Ensure compliance with GDPR/CCPA requirements for data handling

### Audit Requirements

- Maintain logs of all environment variable changes
- Document access controls and approval processes
- Regular security assessments and penetration testing
- Incident response documentation and procedures

## Troubleshooting

### Common Security Issues

**Issue:** Sensitive variables visible in logs
**Solution:** Ensure variables are marked as "Sensitive" in Vercel

**Issue:** WordPress connection fails in production
**Solution:** Verify credentials are correctly set and not expired

**Issue:** Revalidation webhook returns 401
**Solution:** Check `REVALIDATION_SECRET` matches WordPress plugin configuration

**Issue:** Environment variables not loading
**Solution:** Verify variables are set for correct environment (Production/Preview)

### Verification Commands

```bash
# Test environment variable loading (safe - no sensitive data)
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects/$PROJECT_ID/env"

# Test WordPress connection (requires valid credentials)
curl -u "$WP_USERNAME:$WP_APP_PASSWORD" \
  "$WP_API_BASE/posts?per_page=1"

# Test revalidation endpoint (requires valid secret)
curl -X POST "$DEPLOYMENT_URL/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret":"'$REVALIDATION_SECRET'","paths":["/ar"]}'
```

## Next Steps

After completing environment variable security configuration:

1. **Deploy and Test:** Trigger new deployment and verify all functionality
2. **Monitor:** Set up monitoring for security events and credential usage
3. **Document:** Update team documentation with security procedures
4. **Schedule:** Set up regular credential rotation schedule
5. **Audit:** Conduct security review and penetration testing