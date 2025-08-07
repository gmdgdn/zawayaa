# Revalidation Workflow Testing Guide

This guide explains how to test the cache revalidation system that handles WordPress webhook requests.

## Prerequisites

1. **Development Server Running**: Start the Next.js development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Environment Variables**: Ensure these are set in your `.env.local`:
   ```env
   REVALIDATION_SECRET=zawaya-wp-revalidation-2025-secure-token
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

## Testing Methods

### 1. Automated Test Script

Run the comprehensive test script:

```bash
node scripts/test-revalidation.js
```

This script tests:
- ✅ GET endpoint functionality
- ✅ Secret validation
- ✅ Basic path/tag revalidation
- ✅ Content type-specific revalidation
- ✅ Featured content toggles
- ✅ Cascade revalidation
- ✅ WordPress webhook simulation

### 2. Manual API Testing

#### Test GET Endpoint
```bash
curl "http://localhost:3000/api/revalidate?secret=zawaya-wp-revalidation-2025-secure-token"
```

Expected response:
```json
{
  "message": "Revalidation API is working",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "endpoints": {
    "POST": "Send revalidation requests",
    "GET": "Test endpoint status"
  }
}
```

#### Test Article Revalidation
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "zawaya-wp-revalidation-2025-secure-token",
    "content_type": "post",
    "content_id": 123,
    "action": "publish"
  }'
```

Expected response:
```json
{
  "success": true,
  "revalidated": {
    "paths": ["/ar", "/ar/articles"],
    "tags": ["articles", "article:123"],
    "errors": []
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Test Program Revalidation
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "zawaya-wp-revalidation-2025-secure-token",
    "content_type": "program",
    "content_id": 456,
    "action": "update"
  }'
```

#### Test Featured Content Toggle
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "zawaya-wp-revalidation-2025-secure-token",
    "content_type": "post",
    "content_id": 123,
    "action": "featured_toggle"
  }'
```

### 3. WordPress Integration Testing

#### Simulate WordPress Webhook
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "User-Agent: WordPress/6.0; https://zawaya.example.com" \
  -d '{
    "secret": "zawaya-wp-revalidation-2025-secure-token",
    "content_type": "post",
    "content_id": 123,
    "content_slug": "test-article",
    "action": "publish",
    "paths": ["/ar", "/ar/articles", "/ar/articles/test-article"],
    "tags": ["articles", "article:123", "homepage"]
  }'
```

## Content Type Mappings

### Articles (post)
- **Paths**: `/ar`, `/ar/articles`, `/ar/articles/[slug]`
- **Tags**: `articles`, `article:{id}`
- **Actions**: `publish`, `update`, `delete`, `featured_toggle`

### Programs (program)
- **Paths**: `/ar`, `/ar/programs`, `/ar/programs/[slug]`
- **Tags**: `programs`, `program:{id}`
- **Actions**: `publish`, `update`, `delete`

### Episodes (episode)
- **Paths**: `/ar/programs`, `/ar/episodes/[slug]`, `/ar/programs/[program-slug]`
- **Tags**: `episodes`, `episode:{id}`, `programs`
- **Actions**: `publish`, `update`, `delete`

### Authors (user)
- **Paths**: `/ar`, `/ar/authors`, `/ar/authors/[slug]`
- **Tags**: `authors`, `author:{id}`
- **Actions**: `update`, `featured_toggle`

## Error Scenarios

### Invalid Secret
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "invalid-secret",
    "paths": ["/ar"]
  }'
```

Expected: `401 Unauthorized`

### Malformed JSON
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d 'invalid json'
```

Expected: `500 Internal Server Error`

## Monitoring and Logging

The revalidation system includes comprehensive logging:

1. **Request Received**: Logs all incoming webhook requests
2. **Validation**: Logs secret validation attempts
3. **Revalidation Events**: Logs each path/tag revalidation
4. **Errors**: Logs any revalidation failures
5. **Performance**: Tracks revalidation duration

Check the console output when running the development server to see these logs.

## WordPress Plugin Configuration

For production use, ensure the "Zawaya Revalidate" WordPress plugin is configured with:

1. **Endpoint URL**: `https://your-domain.com/api/revalidate`
2. **Secret**: Same value as `REVALIDATION_SECRET`
3. **Content Types**: Enable for posts, programs, episodes, users
4. **Actions**: Enable for publish, update, delete, featured toggles

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure development server is running
2. **401 Unauthorized**: Check `REVALIDATION_SECRET` matches
3. **500 Internal Error**: Check server logs for detailed error messages
4. **No Cache Invalidation**: Verify paths and tags are correct

### Debug Mode

Set `NODE_ENV=development` to enable detailed logging:

```bash
NODE_ENV=development node scripts/test-revalidation.js
```

### Cache Verification

After revalidation, verify cache invalidation by:

1. Loading the affected pages
2. Checking for fresh content
3. Monitoring server logs for cache misses
4. Using browser dev tools to check response headers

## Success Criteria

The revalidation workflow is working correctly when:

- ✅ All test script tests pass
- ✅ WordPress webhooks trigger cache invalidation
- ✅ Content updates appear immediately after publish
- ✅ Error handling works for invalid requests
- ✅ Logging captures all revalidation events
- ✅ Performance is acceptable (< 500ms per request)