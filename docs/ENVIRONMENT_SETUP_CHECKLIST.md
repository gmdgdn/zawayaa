# Environment Variables Setup Checklist

## Pre-Deployment Checklist

Use this checklist to ensure all environment variables are properly configured in Vercel before deploying to production.

### 1. WordPress Connection Variables

#### NEXT_PUBLIC_WP_URL
- [ ] Variable name: `NEXT_PUBLIC_WP_URL`
- [ ] Value: `https://wordpress-1401009-5702602.cloudwaysapps.com`
- [ ] Environments: ✅ Production ✅ Preview ✅ Development
- [ ] Sensitive: ❌ No
- [ ] Verification: URL is HTTPS and accessible

#### WP_API_BASE
- [ ] Variable name: `WP_API_BASE`
- [ ] Value: `https://wordpress-1401009-5702602.cloudwaysapps.com/wp-json/wp/v2`
- [ ] Environments: ✅ Production ✅ Preview ❌ Development
- [ ] Sensitive: ❌ No
- [ ] Verification: URL returns valid WordPress REST API response

#### WP_USERNAME
- [ ] Variable name: `WP_USERNAME`
- [ ] Value: `e.elrefae@dbrandria.com`
- [ ] Environments: ✅ Production ✅ Preview ❌ Development
- [ ] Sensitive: ✅ **Yes** (Enable encryption)
- [ ] Verification: Valid WordPress user with application password access

#### WP_APP_PASSWORD
- [ ] Variable name: `WP_APP_PASSWORD`
- [ ] Value: `nja8QODKRKpOkVX5ELhe934a` (24 characters)
- [ ] Environments: ✅ Production ✅ Preview ❌ Development
- [ ] Sensitive: ✅ **Yes** (Enable encryption)
- [ ] Verification: Valid application password for the WordPress user

### 2. Security Variables

#### REVALIDATION_SECRET
- [ ] Variable name: `REVALIDATION_SECRET`
- [ ] Value: `zawaya-wp-revalidation-2025-secure-token`
- [ ] Environments: ✅ Production ✅ Preview ❌ Development
- [ ] Sensitive: ✅ **Yes** (Enable encryption)
- [ ] Verification: Matches WordPress revalidation plugin configuration

### 3. Vercel Configuration Steps

#### Access Vercel Dashboard
- [ ] Log in to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Navigate to project: **zawaya-platform**
- [ ] Go to **Settings** → **Environment Variables**

#### Configure Each Variable
For each variable above:
- [ ] Click "Add New" environment variable
- [ ] Enter variable name exactly as specified
- [ ] Enter variable value exactly as specified
- [ ] Select appropriate environments (Production/Preview/Development)
- [ ] Enable "Sensitive" checkbox for sensitive variables
- [ ] Click "Save"

### 4. Security Verification

#### Sensitive Variable Protection
- [ ] All sensitive variables marked as "Sensitive" in Vercel
- [ ] Sensitive variables restricted to Production and Preview only
- [ ] Sensitive variables NOT available in Development environment
- [ ] Variable values are masked in Vercel dashboard

#### Access Control
- [ ] Team access restrictions configured (if applicable)
- [ ] Only authorized team members can view sensitive variables
- [ ] Audit logging enabled for environment variable changes

### 5. Deployment Verification

#### Trigger Test Deployment
- [ ] Push commit to trigger new deployment
- [ ] Monitor build logs for environment variable errors
- [ ] Verify no sensitive data appears in build logs

#### Test WordPress Connection
- [ ] Navigate to deployed application
- [ ] Verify pages load WordPress content correctly
- [ ] Check that articles and programs display properly
- [ ] Confirm no connection errors in browser console

#### Test Revalidation Webhook
- [ ] Update content in WordPress CMS
- [ ] Verify webhook triggers successfully
- [ ] Check that content updates appear on website
- [ ] Monitor revalidation logs for success responses

### 6. Security Testing

#### Run Verification Scripts
```bash
# Test environment variable configuration
npm run verify:env

# Test security configuration
npm run verify:security
```

#### Manual Security Checks
- [ ] No sensitive variables exposed in client-side code
- [ ] No credentials visible in browser developer tools
- [ ] No sensitive data in application error logs
- [ ] HTTPS enforced for all WordPress connections

### 7. WordPress Plugin Configuration

#### Revalidation Plugin Setup
- [ ] WordPress revalidation plugin installed and activated
- [ ] Plugin configured with correct Vercel deployment URL
- [ ] Plugin secret matches `REVALIDATION_SECRET` environment variable
- [ ] Webhook endpoints tested and working

#### WordPress User Configuration
- [ ] Application user account exists in WordPress
- [ ] User has appropriate permissions (Editor or Administrator)
- [ ] Application password generated and active
- [ ] Application password matches `WP_APP_PASSWORD` environment variable

### 8. Monitoring Setup

#### Health Checks
- [ ] WordPress connection monitoring enabled
- [ ] Revalidation webhook monitoring configured
- [ ] Error alerting set up for failed connections
- [ ] Performance monitoring for API response times

#### Security Monitoring
- [ ] Failed authentication attempt logging
- [ ] Unusual API usage pattern detection
- [ ] Environment variable access audit logging
- [ ] Regular security scan scheduling

### 9. Documentation and Procedures

#### Team Documentation
- [ ] Environment variable documentation updated
- [ ] Security procedures documented
- [ ] Incident response plan created
- [ ] Credential rotation schedule established

#### Backup and Recovery
- [ ] Environment variable backup procedures
- [ ] Rollback plan for failed deployments
- [ ] Emergency access procedures documented
- [ ] Contact information for WordPress hosting provider

### 10. Final Verification

#### Production Readiness Test
```bash
# Run comprehensive health check
npm run monitor:health

# Verify all systems operational
npm run verify:security
```

#### Success Criteria
- [ ] All health checks return 100% status
- [ ] WordPress connection successful
- [ ] Revalidation webhook functional
- [ ] No security warnings or errors
- [ ] Performance metrics within acceptable ranges

## Troubleshooting Common Issues

### Environment Variable Not Found
**Symptoms:** Build fails with "Environment variable not found" error
**Solution:** 
1. Verify variable is set in correct environment (Production/Preview)
2. Check variable name spelling matches exactly
3. Ensure variable is not restricted to wrong environment

### WordPress Connection Failed
**Symptoms:** Pages show empty content or connection errors
**Solution:**
1. Verify `WP_URL` and `WP_API_BASE` are correct and accessible
2. Test WordPress credentials manually
3. Check WordPress user permissions and application password status
4. Verify WordPress site is accessible and REST API enabled

### Revalidation Webhook Failed
**Symptoms:** Content updates don't appear on website
**Solution:**
1. Verify `REVALIDATION_SECRET` matches WordPress plugin configuration
2. Check webhook endpoint URL in WordPress plugin
3. Test webhook manually using curl or Postman
4. Review revalidation logs for error details

### Security Warnings
**Symptoms:** Security verification script reports warnings
**Solution:**
1. Ensure sensitive variables are marked as "Sensitive" in Vercel
2. Restrict sensitive variables to Production and Preview only
3. Remove sensitive variables from Development environment
4. Verify no credentials in client-side code

## Post-Deployment Maintenance

### Regular Tasks
- [ ] **Weekly:** Monitor health check results
- [ ] **Monthly:** Review environment variable access logs
- [ ] **Quarterly:** Rotate WordPress application passwords
- [ ] **Quarterly:** Update revalidation secrets
- [ ] **Annually:** Comprehensive security audit

### Credential Rotation Schedule
- **WordPress App Password:** Every 90 days
- **Revalidation Secret:** Every 180 days
- **Emergency Rotation:** Immediately if compromise suspected

### Performance Monitoring
- Monitor WordPress API response times
- Track revalidation webhook success rates
- Monitor Core Web Vitals scores
- Alert on error rate increases

## Emergency Procedures

### Credential Compromise
1. **Immediate:** Rotate compromised credentials
2. **Within 1 hour:** Update environment variables in Vercel
3. **Within 1 hour:** Force redeploy all environments
4. **Within 24 hours:** Investigate compromise source
5. **Within 1 week:** Implement additional security measures

### Service Outage
1. **Immediate:** Check WordPress hosting status
2. **Immediate:** Verify environment variable configuration
3. **Within 30 minutes:** Implement fallback measures if available
4. **Within 1 hour:** Contact WordPress hosting support if needed
5. **Post-incident:** Review and improve monitoring

---

**✅ Checklist Complete:** All items checked and verified
**📅 Completion Date:** _______________
**👤 Verified By:** _______________
**🔄 Next Review Date:** _______________