# Requirements Document - WordPress Production Readiness

## Introduction

This document outlines the requirements for making the Next.js WordPress integration production-ready. The WordPress 6.5 backend is already configured and live, but the Next.js frontend needs specific technical improvements to handle production traffic reliably, including proper error handling, caching, testing, and deployment configuration.

## Requirements

### Requirement 1: Robust WordPress Client Error Handling

**User Story:** As a user, I want the website to remain functional even when WordPress endpoints return errors or are temporarily unavailable, so that I can still access cached content and have a smooth browsing experience.

#### Acceptance Criteria

1. WHEN WordPress returns a 404 error THEN the system SHALL return empty arrays instead of null to prevent build failures
2. WHEN WordPress returns server errors (≥500) THEN the system SHALL implement retry logic with exponential backoff
3. WHEN WordPress returns client errors (401, 404) THEN the system SHALL NOT retry and handle gracefully
4. WHEN fetching content lists THEN the system SHALL use generic helpers that work for both programs and episodes
5. WHEN WordPress endpoints are unavailable THEN the system SHALL serve cached content when possible
6. WHEN discovering content types THEN the system SHALL use the rest_base from /wp/v2/types/{slug} instead of hard-coded paths

### Requirement 2: Complete TypeScript Compilation

**User Story:** As a developer, I want the codebase to compile without TypeScript errors or warnings, so that I can deploy with confidence and catch potential runtime issues early.

#### Acceptance Criteria

1. WHEN running pnpm typecheck --noEmit THEN the system SHALL return 0 TypeScript errors
2. WHEN running pnpm typecheck --noEmit THEN the system SHALL return 0 TypeScript warnings
3. WHEN importing SCF mapping types THEN all ArticleCardProps, ArticleListProps, and ArticleDetailProps SHALL be properly exported
4. WHEN building the application THEN there SHALL be no "export not found" warnings
5. WHEN using SCF mappings THEN all type definitions SHALL be consistent and properly re-exported

### Requirement 3: Reliable Test Suite

**User Story:** As a developer, I want all tests to pass consistently in both local and CI environments, so that I can trust the test suite to catch regressions and deploy with confidence.

#### Acceptance Criteria

1. WHEN testing Radix UI sliders THEN tests SHALL use fireEvent.input instead of fireEvent.change
2. WHEN testing audio components THEN HTMLMediaElement properties SHALL be properly mocked
3. WHEN testing WaveSurfer components THEN the WaveSurfer library SHALL be correctly mocked
4. WHEN running tests in CI (happy-dom) THEN all tests SHALL pass
5. WHEN running tests locally (jsdom) THEN all tests SHALL pass
6. WHEN testing audio duration THEN Object.defineProperty SHALL properly mock HTMLMediaElement.prototype.duration

### Requirement 4: Secure Revalidation API

**User Story:** As a content editor, I want WordPress content updates to automatically refresh the website cache securely, so that published changes appear immediately without compromising system security.

#### Acceptance Criteria

1. WHEN receiving revalidation requests THEN the system SHALL validate the secret token and return 401 on mismatch
2. WHEN content_type is 'program' THEN the system SHALL automatically append '/ar/programs' to revalidation paths
3. WHEN revalidation completes THEN the system SHALL respond with revalidated paths, timestamp, and duration
4. WHEN revalidation fails THEN the system SHALL return appropriate error responses with details
5. WHEN processing webhooks THEN the system SHALL log revalidation attempts for monitoring
6. WHEN validating requests THEN the system SHALL follow Next.js API security best practices

### Requirement 5: Optimized Static Generation

**User Story:** As a user, I want pages to load quickly with fresh content, so that I have a fast browsing experience while still seeing recently updated information.

#### Acceptance Criteria

1. WHEN accessing the Arabic homepage THEN the page SHALL revalidate every 5 minutes (300 seconds)
2. WHEN accessing article listing pages THEN pages SHALL revalidate every 5 minutes (300 seconds)  
3. WHEN accessing program listing pages THEN pages SHALL revalidate every 5 minutes (300 seconds)
4. WHEN using revalidate exports THEN they SHALL be placed at the top of files before other imports
5. WHEN implementing ISR THEN the system SHALL use Next.js 15 best practices for static regeneration
6. WHEN serving cached pages THEN the system SHALL balance freshness with performance

### Requirement 6: Production Environment Configuration

**User Story:** As a system administrator, I want all production credentials and environment variables properly configured in Vercel, so that the application can connect to WordPress and handle webhooks securely in production.

#### Acceptance Criteria

1. WHEN deploying to production THEN WP_URL SHALL be set to https://wordpress-1401009-5702602.cloudwaysapps.com
2. WHEN authenticating with WordPress THEN WP_USERNAME and WP_APP_PASSWORD SHALL be properly configured
3. WHEN processing webhooks THEN REVALIDATION_SECRET SHALL match the WordPress plugin configuration
4. WHEN accessing environment variables THEN they SHALL be properly encrypted and protected in Vercel
5. WHEN deploying to preview environments THEN the same environment variables SHALL be available
6. WHEN rotating credentials THEN the system SHALL support updating environment variables without downtime

### Requirement 7: Efficient CI/CD Pipeline

**User Story:** As a developer, I want the CI/CD pipeline to run efficiently with proper caching and comprehensive checks, so that deployments are fast and reliable.

#### Acceptance Criteria

1. WHEN running CI builds THEN the system SHALL use Node.js 20 with pnpm 10
2. WHEN installing dependencies THEN the system SHALL use actions/setup-node@v4 with pnpm caching
3. WHEN running CI stages THEN they SHALL execute in order: typecheck → test → build
4. WHEN caching dependencies THEN the system SHALL follow GitHub Actions pnpm caching best practices
5. WHEN CI fails THEN the system SHALL provide clear error messages and logs
6. WHEN CI passes THEN the system SHALL be ready for automatic deployment

### Requirement 8: Production Readiness Verification

**User Story:** As a product owner, I want to verify that all systems are working correctly in production, so that users have a reliable experience and content updates flow properly.

#### Acceptance Criteria

1. WHEN running pnpm dev locally THEN pages SHALL render real WordPress data for programs and articles
2. WHEN running health checks THEN all 4 sections (WordPress, ENV, Application, Revalidation) SHALL show 100% status
3. WHEN triggering WordPress updates THEN the /api/revalidate endpoint SHALL log "200 OK" responses
4. WHEN accessing Vercel preview deployments THEN they SHALL successfully connect to WordPress
5. WHEN content is published in WordPress THEN it SHALL appear on the website within the revalidation interval
6. WHEN monitoring the application THEN error rates SHALL be minimal and performance SHALL meet standards