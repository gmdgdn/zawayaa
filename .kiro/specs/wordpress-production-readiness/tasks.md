# Implementation Plan - WordPress Production Readiness

## Overview

This implementation plan converts the 8 specific production readiness tasks into actionable coding steps. Each task builds incrementally to ensure the WordPress integration is production-ready with proper error handling, testing, security, and deployment configuration.

## Implementation Tasks

- [x] 1. Strengthen WordPress Client Error Handling





  - Update lib/wordpress.ts to treat 404 responses as non-fatal empty arrays
  - Implement retry logic only for server errors (≥500 status codes)
  - Make list helpers generic for both program and episode content types
  - Remove hard-coded endpoint fallbacks and use rest_base from WordPress API
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_

- [x] 1.1 Update 404 error handling to return empty arrays


  - Modify WordPress client to return { data: [], headers: {} } for 404 responses
  - Ensure build process doesn't fail when WordPress endpoints return 404
  - Test that pages render correctly with empty data instead of null
  - _Requirements: 1.1_

- [x] 1.2 Implement selective retry logic for server errors only


  - Add retry logic that only triggers for status codes ≥500
  - Ensure 401 and 404 errors are handled gracefully without retries
  - Implement exponential backoff for server error retries
  - _Requirements: 1.2, 1.3_

- [x] 1.3 Create generic list helpers for programs and episodes


  - Refactor content fetching functions to work with both program and episode types
  - Remove duplicate code between program and episode list handling
  - Ensure type safety while maintaining generic functionality
  - _Requirements: 1.4_

- [x] 1.4 Remove hard-coded endpoint paths and use WordPress rest_base


  - Query /wp/v2/types/{slug} to get rest_base for custom post types
  - Replace hard-coded /programs and /episodes paths with dynamic rest_base values
  - Cache rest_base values to avoid repeated API calls
  - _Requirements: 1.6_

- [x] 2. Fix SCF Mapping TypeScript Export Issues





  - Complete missing re-exports in lib/scf-mappings/article-mappings.ts
  - Ensure ArticleCardProps, ArticleListProps, and ArticleDetailProps compile without warnings
  - Run pnpm typecheck --noEmit until 0 TypeScript errors and 0 warnings
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2.1 Add missing type re-exports in article-mappings.ts



  - Export ArticleCardProps, ArticleListProps, and ArticleDetailProps types
  - Add proper re-export statements for compatibility with existing imports
  - Ensure all SCF mapping types are consistently exported
  - _Requirements: 2.3, 2.4_

- [x] 2.2 Verify TypeScript compilation with zero errors and warnings



  - Run pnpm typecheck --noEmit and fix any remaining TypeScript issues
  - Ensure all imports resolve correctly without "export not found" warnings
  - Test that build process completes without TypeScript compilation errors
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 3. Fix Remaining Vitest Test Issues



  - Update slider tests to use fireEvent.input instead of fireEvent.change for Radix components
  - Mock HTMLMediaElement and WaveSurfer correctly for audio component tests
  - Ensure tests pass in both happy-dom (CI) and jsdom (local) environments
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 3.1 Fix Radix UI slider test interactions


  - Update audio player tests to use fireEvent.input for slider interactions
  - Replace fireEvent.change with fireEvent.input for Radix Slider components
  - Verify slider value changes are properly detected in tests
  - _Requirements: 3.1_

- [x] 3.2 Implement proper HTMLMediaElement mocking


  - Use Object.defineProperty to mock HTMLMediaElement.prototype.duration
  - Mock currentTime, paused, and other audio element properties
  - Ensure audio component tests work with mocked media element
  - _Requirements: 3.2, 3.6_

- [x] 3.3 Add correct WaveSurfer mocking


  - Mock WaveSurfer.create method and instance methods (load, play, pause)
  - Ensure WaveSurfer-dependent components can be tested without the actual library
  - Test that audio visualization components work with mocked WaveSurfer
  - _Requirements: 3.3_

- [x] 3.4 Ensure cross-environment test compatibility


  - Verify tests pass in happy-dom environment used by CI
  - Test locally with jsdom to ensure compatibility
  - Add necessary polyfills or mocks for environment differences
  - _Requirements: 3.4, 3.5_

- [x] 4. Improve Revalidation API Security and Functionality



  - Validate req.body.secret and return 401 on mismatch per Next.js security practices
  - Add automatic '/ar/programs' path appending for program content_type
  - Return structured response with revalidated paths, timestamp, and duration
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 4.1 Implement secret token validation



  - Add secret validation in /api/revalidate route handler
  - Return 401 Unauthorized response when secret doesn't match REVALIDATION_SECRET
  - Follow Next.js API route security best practices for authentication
  - _Requirements: 4.1, 4.6_

- [x] 4.2 Add program-specific path handling


  - Check if content_type === 'program' and append '/ar/programs' to revalidation paths
  - Ensure program updates trigger revalidation of program listing pages
  - Test that program content changes properly invalidate relevant caches
  - _Requirements: 4.2_

- [x] 4.3 Implement structured revalidation response


  - Return JSON response with revalidated paths array, ISO timestamp, and duration in milliseconds
  - Add error handling with appropriate error messages and status codes
  - Include logging for revalidation attempts and results
  - _Requirements: 4.3, 4.4, 4.5_

- [x] 5. Configure Incremental Static Regeneration Settings





  - Add export const revalidate = 300 to Arabic homepage, articles, and programs pages
  - Ensure revalidate exports are placed at the top of files before other imports
  - Verify ISR configuration follows Next.js 15 best practices
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 5.1 Add ISR configuration to Arabic homepage


  - Export const revalidate = 300 (5 minutes) in app/ar/page.tsx
  - Place revalidate export at the top of the file before other imports
  - Test that homepage content refreshes within the revalidation interval
  - _Requirements: 5.1, 5.4_

- [x] 5.2 Configure ISR for articles pages


  - Add revalidate = 300 export to app/ar/articles/page.tsx
  - Ensure article listing page uses proper ISR configuration
  - Verify article content updates appear within revalidation window
  - _Requirements: 5.2, 5.4_

- [x] 5.3 Set up ISR for programs pages


  - Export revalidate = 300 in app/ar/programs/page.tsx
  - Confirm programs listing page follows ISR best practices
  - Test that program updates trigger proper cache revalidation
  - _Requirements: 5.3, 5.4_

- [x] 5.4 Verify ISR import order and Next.js 15 compliance


  - Ensure all revalidate exports are placed before other imports
  - Check that ISR configuration follows Next.js 15 documentation
  - Test ISR functionality in both development and production builds
  - _Requirements: 5.4, 5.5, 5.6_

- [x] 6. Configure Production Environment Variables in Vercel





  - Set WP_URL, WP_USERNAME, WP_APP_PASSWORD, and REVALIDATION_SECRET in Vercel
  - Configure environment variables for both Production and Preview environments
  - Ensure all credentials are properly encrypted and protected
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 6.1 Set WordPress connection environment variables


  - Configure WP_URL=https://wordpress-1401009-5702602.cloudwaysapps.com in Vercel
  - Set WP_USERNAME with the WordPress application user account
  - Add WP_APP_PASSWORD with the 24-character application password
  - _Requirements: 6.1, 6.2_

- [x] 6.2 Configure revalidation webhook security


  - Set REVALIDATION_SECRET=zawaya-wp-revalidation-2025-secure-token in Vercel
  - Ensure the secret matches the WordPress revalidation plugin configuration
  - Test webhook authentication with the configured secret
  - _Requirements: 6.3_

- [x] 6.3 Set up environment variable protection and encryption


  - Enable encryption for all sensitive environment variables in Vercel
  - Configure variables for both Production and Preview environments
  - Verify environment variables are properly protected and not exposed in logs
  - _Requirements: 6.4, 6.5, 6.6_

- [x] 7. Optimize CI/CD Pipeline with Caching and Stages





  - Update .github/workflows/ci.yml to use actions/setup-node@v4 with pnpm caching
  - Implement staged pipeline: typecheck → test → build
  - Follow GitHub Actions pnpm caching best practices
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 7.1 Update GitHub Actions workflow with proper Node.js and pnpm setup


  - Use actions/setup-node@v4 with Node.js 20 and cache: 'pnpm'
  - Ensure pnpm 10 is properly installed and configured
  - Add pnpm install --frozen-lockfile for consistent dependency installation
  - _Requirements: 7.1, 7.2_

- [x] 7.2 Implement staged CI pipeline

  - Create typecheck stage that runs pnpm typecheck --noEmit
  - Add test stage that runs pnpm test after typecheck passes
  - Include build stage that runs pnpm build after tests pass
  - _Requirements: 7.3, 7.4_

- [x] 7.3 Optimize CI performance with caching


  - Implement pnpm dependency caching following GitHub Actions best practices
  - Cache node_modules and pnpm store for faster CI runs
  - Ensure cache keys are properly configured for cache invalidation
  - _Requirements: 7.2, 7.5, 7.6_

- [-] 8. Conduct Production Readiness Verification



  - Test local development with pnpm dev to confirm real WordPress data rendering
  - Run pnpm monitoring:health to verify all 4 sections show 100% status
  - Test WordPress content updates trigger successful /api/revalidate responses
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 8.1 Verify local development with real WordPress data



  - Run pnpm dev and confirm pages render actual WordPress content
  - Test that program list and article list pages display real data
  - Verify that content updates in WordPress appear in local development
  - _Requirements: 8.1_

- [x] 8.2 Run comprehensive health checks


  - Execute pnpm monitoring:health command
  - Verify WordPress, ENV, Application, and Revalidation sections all show 100%
  - Fix any health check failures before proceeding to production
  - _Requirements: 8.2_

- [ ] 8.3 Test revalidation webhook functionality


  - Trigger WordPress content updates (publish/update program or article)
  - Verify /api/revalidate endpoint receives webhook and logs "200 OK"
  - Confirm that content changes appear on the website within revalidation interval
  - _Requirements: 8.3, 8.5_

- [ ] 8.4 Verify Vercel preview deployment functionality
  - Push changes to feature branch and create Vercel preview deployment
  - Test that preview deployment successfully connects to WordPress
  - Confirm all environment variables are properly configured in preview
  - _Requirements: 8.4_

- [ ] 8.5 Conduct final production readiness verification
  - Monitor error rates and performance metrics after deployment
  - Verify Core Web Vitals scores meet production standards
  - Ensure all critical user journeys work correctly in production
  - _Requirements: 8.6_