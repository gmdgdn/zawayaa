# Vercel Environment Variables Setup Guide

## Overview

This guide provides step-by-step instructions for configuring production environment variables in Vercel for the Zawaya WordPress integration.

## Required Environment Variables

Based on the codebase analysis, the following environment variables must be configured in Vercel:

### WordPress Connection Variables
- `NEXT_PUBLIC_WP_URL` - WordPress site URL (public, used in client-side code)
- `WP_API_BASE` - WordPress REST API base URL (server-side)
- `WP_USERNAME` - WordPress application user account (server-side)
- `WP_APP_PASSWORD` - WordPress application password (server-side, sensitive)

### Security Variables
- `REVALIDATION_SECRET` - Webhook security token (server-side, sensitive)

## Step-by-Step Configuration

### Step 1: Access Vercel Dashboard

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project (zawaya-platform)
3. Go to **Settings** → **Environment Variables**

### Step 2: Configure WordPress Connection Variables

#### 2.1 Set WP_URL (Public Variable)
- **Variable Name**: `NEXT_PUBLIC_WP_URL`
- **Value**: `https://wordpress-1401009-5702602.cloudwaysapps.com`
- **Environments**: Production, Preview, Development
- **Sensitive**: No (this is a public variable)

#### 2.2 Set WP_API_BASE (Server Variable)
- **Variable Name**: `WP_API_BASE`
- **Value**: `https://wordpress-1401009-5702602.cloudwaysapps.com/wp-json/wp/v2`
- **Environments**: Production, Preview
- **Sensitive**: No

#### 2.3 Set WP_USERNAME (Sensitive)
- **Variable Name**: `WP_USERNAME`
- **Value**: `e.elrefae@dbrandria.com` (WordPress application user)
- **Environments**: Production, Preview
- **Sensitive**: Yes (enable encryption)

#### 2.4 Set WP_APP_PASSWORD (Sensitive)
- **Variable Name**: `WP_APP_PASSWORD`
- **Value**: `nja8QODKRKpOkVX5ELhe934a` (24-character application password)
- **Environments**: Production, Preview
- **Sensitive**: Yes (enable encryption)

### Step 3: Configure Revalidation Security

#### 3.1 Set REVALIDATION_SECRET (Sensitive)
- **Variable Name**: `REVALIDATION_SECRET`
- **Value**: `zawaya-wp-revalidation-2025-secure-token`
- **Environments**: Production, Preview
- **Sensitive**: Yes (enable encryption)

**Note**: This secret must match the configuration in the WordPress revalidation plugin.

## Environment Configuration Matrix

| Variable | Production | Preview | Development | Sensitive |
|----------|------------|---------|-------------|-----------|
| `NEXT_PUBLIC_WP_URL` | ✅ | ✅ | ✅ | No |
| `WP_API_BASE` | ✅ | ✅ | ❌ | No |
| `WP_USERNAME` | ✅ | ✅ | ❌ | Yes |
| `WP_APP_PASSWORD` | ✅ | ✅ | ❌ | Yes |
| `REVALIDATION_SECRET` | ✅ | ✅ | ❌ | Yes |

## Security Best Practices

### Encryption Settings
1. **Enable Encryption**: All sensitive variables should have encryption enabled
2. **Environment Isolation**: Sensitive variables should not be available in Development environment
3. **Access Control**: Limit team member access to sensitive environment variables

### Variable Protection
1. **Logging**: Ensure sensitive variables are not logged in application logs
2. **Client Exposure**: Never expose server-side variables to client-side code
3. **Rotation**: Regularly rotate sensitive credentials (WordPress app passwords)

## Verification Steps

### Step 1: Verify Environment Variables are Set
After configuration, verify variables are properly set:

1. Deploy a test branch to Preview environment
2. Check the deployment logs for any missing environment variable warnings
3. Test API endpoints that use these variables

### Step 2: Test WordPress Connection
1. Access the preview deployment
2. Navigate to pages that fetch WordPress content
3. Verify content loads correctly from WordPress

### Step 3: Test Revalidation Webhook
1. Update content in WordPress CMS
2. Check that webhook triggers successfully
3. Verify content updates appear on the website

## Troubleshooting

### Common Issues

#### Missing Environment Variables
**Symptom**: Build fails with "Environment variable not found" errors
**Solution**: Ensure all required variables are set for the target environment

#### WordPress Connection Fails
**Symptom**: Pages show empty content or connection errors
**Solution**: 
- Verify `WP_URL` and `WP_API_BASE` are correct
- Check `WP_USERNAME` and `WP_APP_PASSWORD` are valid
- Test WordPress credentials manually

#### Revalidation Webhook Fails
**Symptom**: Content updates don't appear on website
**Solution**:
- Verify `REVALIDATION_SECRET` matches WordPress plugin configuration
- Check webhook endpoint is accessible
- Review revalidation logs in Vercel

### Environment Variable Validation

Use this checklist to validate your configuration:

- [ ] All required variables are set in Production environment
- [ ] All required variables are set in Preview environment
- [ ] Sensitive variables have encryption enabled
- [ ] WordPress connection variables are correct
- [ ] Revalidation secret matches WordPress plugin
- [ ] No sensitive variables are exposed to client-side
- [ ] Test deployment succeeds with new variables

## WordPress Plugin Configuration

Ensure the WordPress revalidation plugin is configured with the same secret:

```php
// In WordPress revalidation plugin configuration
define('ZAWAYA_REVALIDATION_SECRET', 'zawaya-wp-revalidation-2025-secure-token');
define('ZAWAYA_FRONTEND_URL', 'https://your-vercel-domain.vercel.app');
```

## Deployment Verification

After configuring environment variables:

1. **Trigger New Deployment**: Push a commit or manually trigger deployment
2. **Monitor Build Logs**: Check for environment variable related errors
3. **Test Functionality**: Verify WordPress integration works correctly
4. **Check Health Endpoints**: Use monitoring endpoints to verify system health

## Security Considerations

### Credential Management
- WordPress application passwords should be unique and rotated regularly
- Revalidation secrets should be cryptographically secure random strings
- Never commit sensitive credentials to version control

### Access Control
- Limit Vercel team member access to production environment variables
- Use separate credentials for different environments when possible
- Monitor access logs for unauthorized environment variable access

## Next Steps

After completing environment variable configuration:

1. Run production readiness verification tests
2. Monitor application performance and error rates
3. Set up alerting for WordPress connection failures
4. Document credential rotation procedures