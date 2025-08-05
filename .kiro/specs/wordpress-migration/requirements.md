# Requirements Document - WordPress Migration

## Introduction

This document outlines the requirements for migrating the Zawaya platform from a hybrid Supabase + WordPress architecture to a WordPress-only architecture. The goal is to simplify the system by removing Supabase and the internal admin UI, using WordPress (hosted on Cloudways) as the sole CMS via REST API, while maintaining the existing Next.js App Router, Tailwind CSS, existing components, and Arabic RTL support.

## Requirements

### Requirement 1: Remove Supabase Dependencies

**User Story:** As a developer, I want to completely remove Supabase from the codebase, so that the system relies solely on WordPress for data management.

#### Acceptance Criteria

1. WHEN removing dependencies THEN the system SHALL uninstall @supabase/supabase-js and @supabase/ssr packages
2. WHEN cleaning code THEN the system SHALL delete all Supabase-related files (lib/supabase/**, scripts/setup-supabase.js, db/**, sql/**)
3. WHEN removing API routes THEN the system SHALL delete all Supabase-bound API routes under app/api/**
4. WHEN updating imports THEN the system SHALL remove all Supabase client imports and references
5. WHEN building the project THEN the system SHALL compile successfully without any Supabase dependencies
6. WHEN starting the application THEN the system SHALL run without Supabase connections

### Requirement 2: Remove Internal Admin UI

**User Story:** As a system administrator, I want to remove the internal admin interface, so that content management is handled exclusively through WordPress.

#### Acceptance Criteria

1. WHEN removing admin pages THEN the system SHALL delete all pages under app/admin/**
2. WHEN updating middleware THEN the system SHALL remove admin authentication and route protection
3. WHEN cleaning components THEN the system SHALL remove admin-specific components and utilities
4. WHEN updating navigation THEN the system SHALL remove admin links and references
5. WHEN accessing admin routes THEN the system SHALL return 404 or redirect appropriately
6. WHEN generating sitemaps THEN the system SHALL exclude admin routes

### Requirement 3: Implement WordPress REST API Client

**User Story:** As a developer, I want a robust WordPress REST API client, so that the application can fetch all content from WordPress efficiently.

#### Acceptance Criteria

1. WHEN creating the client THEN the system SHALL implement WordPress Application Password authentication
2. WHEN fetching data THEN the system SHALL use Next.js built-in caching with configurable revalidation
3. WHEN handling errors THEN the system SHALL provide graceful error handling and fallbacks
4. WHEN making requests THEN the system SHALL include proper headers and authentication
5. WHEN processing responses THEN the system SHALL handle WordPress REST API response format
6. WHEN caching THEN the system SHALL implement appropriate cache strategies for different content types

### Requirement 4: Create WordPress Content Helpers

**User Story:** As a developer, I want helper functions for fetching different content types from WordPress, so that I can easily retrieve articles, programs, episodes, and authors.

#### Acceptance Criteria

1. WHEN fetching articles THEN the system SHALL retrieve posts with ACF fields, featured images, and pagination
2. WHEN fetching programs THEN the system SHALL retrieve custom post type data with relationships
3. WHEN fetching episodes THEN the system SHALL retrieve episodes linked to their parent programs
4. WHEN fetching authors THEN the system SHALL retrieve user data or author CPT with metadata
5. WHEN including media THEN the system SHALL use _embed parameter for featured images and media
6. WHEN handling ACF THEN the system SHALL include acf_format=standard for proper field formatting

### Requirement 5: Update Page Data Sources

**User Story:** As a user, I want all pages to load content from WordPress, so that I have a consistent content experience managed through a single CMS.

#### Acceptance Criteria

1. WHEN loading homepage THEN the system SHALL fetch featured content, latest articles, and programs from WordPress
2. WHEN viewing article lists THEN the system SHALL paginate and filter WordPress posts
3. WHEN viewing single articles THEN the system SHALL fetch individual posts with full content and metadata
4. WHEN browsing programs THEN the system SHALL display WordPress custom post type data
5. WHEN viewing program details THEN the system SHALL show program information with related episodes
6. WHEN displaying authors THEN the system SHALL show author profiles with their published content

### Requirement 6: Implement Cache Revalidation

**User Story:** As a content editor, I want the website to update automatically when I publish content in WordPress, so that changes are reflected immediately for users.

#### Acceptance Criteria

1. WHEN content is published in WordPress THEN the system SHALL trigger cache revalidation via webhook
2. WHEN receiving revalidation requests THEN the system SHALL validate the secret token for security
3. WHEN revalidating THEN the system SHALL clear relevant page caches using revalidatePath
4. WHEN handling multiple paths THEN the system SHALL revalidate all affected routes efficiently
5. WHEN revalidation fails THEN the system SHALL log errors and provide appropriate responses
6. WHEN content is updated THEN the system SHALL ensure fresh content appears on next page visit

### Requirement 7: Configure WordPress REST API

**User Story:** As a WordPress administrator, I want proper REST API configuration, so that Next.js can access all required content and fields.

#### Acceptance Criteria

1. WHEN configuring ACF THEN the system SHALL enable "Show in REST API" for all field groups
2. WHEN setting up CPTs THEN the system SHALL ensure show_in_rest: true for programs and episodes
3. WHEN creating Application Passwords THEN the system SHALL generate secure credentials for API access
4. WHEN exposing endpoints THEN the system SHALL make all required content types available via REST
5. WHEN handling authentication THEN the system SHALL use WordPress Application Passwords over HTTPS
6. WHEN configuring fields THEN the system SHALL ensure ACF fields appear in REST responses

### Requirement 8: Maintain Existing Features

**User Story:** As a user, I want all current website features to continue working, so that the migration doesn't disrupt my experience.

#### Acceptance Criteria

1. WHEN using the website THEN the system SHALL maintain Next.js App Router functionality
2. WHEN viewing content THEN the system SHALL preserve Tailwind CSS styling and responsive design
3. WHEN browsing in Arabic THEN the system SHALL maintain RTL support and Arabic typography
4. WHEN using components THEN the system SHALL keep all existing UI components functional
5. WHEN navigating THEN the system SHALL preserve routing and navigation structure
6. WHEN accessing features THEN the system SHALL maintain audio players, search, and other functionality

### Requirement 9: Error Handling and Fallbacks

**User Story:** As a user, I want the website to handle WordPress downtime gracefully, so that I receive helpful feedback when content is unavailable.

#### Acceptance Criteria

1. WHEN WordPress is unavailable THEN the system SHALL display user-friendly error messages
2. WHEN API requests fail THEN the system SHALL implement retry logic with exponential backoff
3. WHEN content is missing THEN the system SHALL show appropriate 404 pages
4. WHEN images fail to load THEN the system SHALL provide fallback images or placeholders
5. WHEN network errors occur THEN the system SHALL cache previous responses when possible
6. WHEN debugging THEN the system SHALL log errors appropriately for troubleshooting

### Requirement 10: Performance and Caching

**User Story:** As a user, I want fast page load times, so that I can access content quickly and efficiently.

#### Acceptance Criteria

1. WHEN serving pages THEN the system SHALL use Next.js built-in caching mechanisms
2. WHEN fetching data THEN the system SHALL implement appropriate revalidation intervals
3. WHEN loading images THEN the system SHALL use Next.js Image optimization
4. WHEN caching content THEN the system SHALL balance freshness with performance
5. WHEN handling traffic THEN the system SHALL maintain good Core Web Vitals scores
6. WHEN scaling THEN the system SHALL support increased load through efficient caching