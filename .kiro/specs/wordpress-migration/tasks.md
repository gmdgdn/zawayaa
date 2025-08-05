# Implementation Plan - WordPress Migration

## Overview

This implementation plan converts the existing Zawaya platform from a hybrid Supabase + WordPress architecture to a WordPress-only architecture. The plan follows the 8-phase approach outlined in the requirements, building incrementally to ensure a smooth migration while maintaining all existing functionality.

## Implementation Tasks

- [x] 1. Environment Setup and WordPress Configuration






  - Update environment variables for WordPress-only architecture
  - Configure WordPress Application Passwords for API access
  - Verify WordPress REST API endpoints and ACF field exposure
  - _Requirements: 3.4, 7.3, 7.5_

- [x] 1.1 Update environment configuration


  - Modify .env files to include WordPress API credentials and endpoints
  - Remove Supabase-related environment variables
  - Add revalidation secret for webhook security
  - _Requirements: 3.4, 6.4_

- [x] 1.2 Configure WordPress Application Passwords


  - Create Application Password in WordPress admin for API authentication
  - Test basic authentication with WordPress REST API endpoints
  - Verify HTTPS connection and credential security
  - _Requirements: 7.5, 3.1_

- [x] 1.3 Verify WordPress REST API and ACF configuration


  - Ensure all ACF field groups have "Show in REST API" enabled
  - Confirm custom post types (programs, episodes) have show_in_rest: true
  - Test API endpoints return ACF fields with acf_format=standard
  - _Requirements: 7.1, 7.4, 4.6_

- [x] 2. Remove Supabase Dependencies and Admin UI




  - Uninstall Supabase packages from package.json
  - Delete all Supabase-related files and directories
  - Remove admin pages and components
  - Clean up middleware and routing
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

- [x] 2.1 Uninstall Supabase packages


  - Remove @supabase/supabase-js and @supabase/ssr from package.json
  - Run package manager install to clean dependencies
  - Verify no Supabase references remain in package files
  - _Requirements: 1.1, 1.5_

- [x] 2.2 Delete Supabase-related files and directories


  - Remove lib/supabase/**, scripts/setup-supabase.js, db/**, sql/** directories
  - Delete all Supabase migration and setup scripts
  - Clean up any remaining Supabase configuration files
  - _Requirements: 1.2, 1.4_

- [x] 2.3 Remove admin UI pages and components


  - Delete all pages under app/admin/** directory
  - Remove admin-specific components and utilities
  - Clean up admin-related imports and references
  - _Requirements: 2.1, 2.3_

- [x] 2.4 Clean up middleware and API routes


  - Remove admin authentication and route protection from middleware
  - Delete all Supabase-bound API routes under app/api/**
  - Update navigation to remove admin links
  - _Requirements: 2.2, 2.4, 1.3_

- [x] 2.5 Verify clean build and startup





  - Ensure project builds successfully without Supabase dependencies
  - Test application startup without Supabase connections
  - Confirm no broken imports or references remain
  - _Requirements: 1.5, 1.6_

- [x] 3. Implement WordPress REST API Client

  - Create core WordPress client with authentication
  - Implement caching and error handling
  - Add request/response transformation utilities
  - Build retry logic and fallback mechanisms
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 9.2, 9.6_




- [x] 3.1 Create core WordPress client class

  - Implement wpGet method with Application Password authentication



  - Add proper headers and HTTPS request configuration
  - Include basic error handling and response validation
  - _Requirements: 3.1, 3.4_




- [x] 3.2 Implement caching and revalidation

  - Add Next.js built-in caching with configurable revalidation intervals




  - Implement cache tagging for selective invalidation
  - Create cache strategy configuration for different content types
  - _Requirements: 3.2, 10.2, 10.4_

- [x] 3.3 Add error handling and retry logic

  - Implement exponential backoff retry mechanism
  - Create specific error handlers for different failure types
  - Add graceful fallback responses for network issues
  - _Requirements: 3.3, 9.2, 9.6_



- [x] 3.4 Build response transformation utilities

  - Create functions to transform WordPress API responses to application format
  - Handle embedded data extraction (_embedded parameter)
  - Implement SCF field processing and normalization with meta.* access pattern
  - Add fallback logic for missing SCF fields to WordPress core fields
  - Create TypeScript interfaces matching the SCF-to-UI mapping contract
  - _Requirements: 3.5, 4.6_

- [x] 4. Create WordPress Content Helper Functions

  - Implement article fetching with pagination and filtering

  - Create program and episode retrieval functions
  - Add author and media fetching capabilities
  - Build search and category filtering helpers
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_


- [x] 4.1 Implement article fetching functions

  - Create getArticles with pagination, category, and search parameters
  - Build getArticleBySlug for individual article retrieval
  - Include SCF fields and featured media with _embed parameter
  - Implement SCF field mapping: title_arabic, excerpt_arabic, content_arabic, audio_narration_url, reading_time_minutes, category_color, is_featured
  - Add fallback logic for missing SCF fields to WordPress core fields
  - _Requirements: 4.1, 5.2_

- [x] 4.2 Create program and episode helpers

  - Implement getPrograms for custom post type retrieval
  - Build getProgramBySlug for individual program pages
  - Create getEpisodes with program relationship filtering
  - _Requirements: 4.2, 4.3, 5.4, 5.5_

- [x] 4.3 Add author and media fetching

  - Implement getAuthors for user or author CPT retrieval
  - Create getAuthorById for individual author profiles
  - Add media handling for featured images and attachments
  - _Requirements: 4.4, 4.5, 5.6_

- [x] 4.4 Build search and filtering utilities

  - Create search functions with WordPress REST API search parameter
  - Implement category and tag filtering capabilities
  - Add date range and custom field filtering options
  - _Requirements: 4.1, 5.2_

- [x] 5. Update Page Data Sources to WordPress

  - Replace Supabase calls in homepage components
  - Update article list and detail pages
  - Modify program and episode pages
  - Convert author profile pages
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 5.1 Update homepage data fetching


  - Replace Supabase calls with WordPress API for featured content
  - Fetch latest articles, programs, and hero content from WordPress
  - Implement proper caching for homepage performance
  - _Requirements: 5.1, 8.1_

- [x] 5.2 Convert article pages to WordPress


  - Update app/ar/articles/page.tsx to use WordPress article fetching
  - Modify app/ar/articles/[slug]/page.tsx for individual articles
  - Ensure ACF fields and featured images display correctly
  - _Requirements: 5.2, 5.3, 8.3_

- [x] 5.3 Update program and episode pages

  - Convert app/ar/programs/page.tsx to use WordPress program data
  - Modify app/ar/programs/[slug]/page.tsx for program details
  - Update episode pages to fetch from WordPress with program relationships
  - _Requirements: 5.4, 5.5, 8.3_

- [x] 5.4 Convert author profile pages

  - Update author pages to fetch from WordPress users or author CPT
  - Display author information with their published content
  - Maintain existing author profile functionality and styling
  - _Requirements: 5.6, 8.3_

- [x] 5.5 Verify all pages render from WordPress


  - Test all page types load content correctly from WordPress API
  - Ensure ACF fields, images, and metadata display properly
  - Confirm Arabic RTL functionality remains intact
  - _Requirements: 8.1, 8.3, 8.4_

- [x] 6. Implement Cache Revalidation System

  - Create revalidation API endpoint
  - Implement webhook security validation
  - Add selective cache invalidation logic
  - Test revalidation workflow with WordPress
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 6.1 Create revalidation API endpoint


  - Build app/api/revalidate/route.ts with POST handler
  - Implement secret token validation for security
  - Add support for multiple path revalidation
  - _Requirements: 6.2, 6.4_


- [x] 6.2 Implement selective cache invalidation

  - Use revalidatePath to clear specific route caches
  - Create logic to determine affected paths from content changes
  - Handle both individual content and list page invalidation
  - _Requirements: 6.3, 6.4_

- [x] 6.3 Add error handling and logging


  - Implement proper error responses for revalidation failures
  - Add logging for webhook calls and cache invalidation
  - Create monitoring for revalidation success/failure rates
  - _Requirements: 6.5_

- [x] 6.4 Test revalidation workflow


  - Verify WordPress webhook triggers revalidation correctly
  - Test that content updates appear after cache invalidation
  - Ensure revalidation works for all content types
  - _Requirements: 6.1, 6.6_

- [x] 7. WordPress Server Configuration Verification

  - Verify ACF fields are exposed in REST API
  - Confirm custom post types are accessible
  - Test Application Password authentication
  - Validate webhook plugin configuration
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 7.1 Verify ACF REST API exposure


  - Check all ACF field groups have "Show in REST API" enabled
  - Test that ACF fields appear in API responses
  - Confirm acf_format=standard parameter works correctly
  - _Requirements: 7.1, 7.6_

- [x] 7.2 Confirm custom post type accessibility

  - Verify programs and episodes CPTs have show_in_rest: true
  - Test custom post type endpoints return proper data
  - Ensure CPT relationships work correctly in API
  - _Requirements: 7.2, 7.4_

- [x] 7.3 Test Application Password authentication

  - Verify Application Password creation in WordPress admin
  - Test basic authentication works with generated credentials
  - Confirm HTTPS requirement is met for secure authentication
  - _Requirements: 7.3, 7.5_

- [x] 7.4 Validate revalidation webhook setup

  - Ensure "Zawaya Revalidate" plugin is installed and configured
  - Test webhook triggers on content publish/update
  - Verify webhook payload includes correct paths for revalidation
  - _Requirements: 6.1_

- [x] 8. Implement Complete SCF-to-UI Mapping System


  - Create comprehensive SCF field mapping for all content types
  - Implement page-specific data bindings and component props
  - Add SEO and metadata mapping with fallback strategies
  - Build cache revalidation system with proper tagging
  - _Requirements: 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.3, 8.2_

- [x] 8.1 Implement article SCF mappings


  - Map article meta fields: title_arabic, excerpt_arabic, content_arabic, author_arabic_name, author_bio_arabic
  - Add audio fields: audio_narration_url, audio_duration, social_sharing_image
  - Implement content metadata: reading_time_minutes, category_color, is_featured, is_breaking_news
  - Create SEO field mappings: meta_description_arabic, keywords_arabic
  - Add fallback logic for all fields to WordPress core equivalents
  - _Requirements: 4.1, 5.2, 5.3_

- [x] 8.2 Implement program and episode SCF mappings


  - Map program meta fields: host_arabic, program_type, theme_color, cover_image
  - Add program statistics: episode_count, average_duration, subscriber_count, program_rating, trailer_video
  - Map episode media fields: video_embed_url, audio_file_url, episode_poster, episode_thumbnail
  - Implement episode metadata: season_number, episode_number, duration_seconds, transcript_arabic, episode_gallery, episode_tags_arabic
  - Create proper TypeScript interfaces for all program and episode data
  - _Requirements: 4.2, 4.3, 5.4, 5.5_

- [x] 8.3 Implement author SCF mappings



  - Map Arabic author fields: name_arabic, job_title_arabic, bio_arabic, location_arabic
  - Add author media: author_avatar, author_cover_image, is_verified_author, is_featured_author
  - Implement professional details: expertise_areas, languages_spoken, social_media_links
  - Create author profile component props with proper SCF bindings
  - Add fallback strategies for missing author data
  - _Requirements: 4.4, 4.5, 5.6_

- [x] 8.4 Create component prop interfaces with SCF bindings


  - Build ArticleCard, ArticleDetail, ProgramCard, ProgramDetail component interfaces
  - Create EpisodeCard, EpisodeDetail, AuthorCard, AuthorProfile interfaces
  - Map all component props to specific SCF fields with fallbacks
  - Implement proper TypeScript typing for all component data
  - Add validation and error handling for missing SCF data
  - _Requirements: 8.2_

- [x] 8.5 Implement SEO and metadata mapping system


  - Create SEO mapping interfaces for articles, programs, episodes, authors
  - Map meta titles, descriptions, images, and keywords to SCF fields
  - Implement JSON-LD structured data with SCF field bindings
  - Add Open Graph and Twitter Card mappings
  - Create fallback strategies for missing SEO data
  - _Requirements: 8.2, 8.5_

- [x] 8.6 Build cache revalidation with SCF-aware tagging


  - Implement cache tags based on content type and SCF field changes
  - Create revalidation logic for featured content toggles
  - Add path-based revalidation for all page types
  - Build webhook payload processing for SCF field updates
  - Test revalidation triggers for all content types and SCF changes
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 9. Code Cleanup and Type Safety





  - Remove dead Supabase-related code and types
  - Update TypeScript interfaces for WordPress data
  - Clean up unused API routes and utilities
  - Update sitemap and robots.txt configuration
  - _Requirements: 1.4, 2.5, 8.2, 8.5_

- [x] 9.1 Remove dead code and unused imports


  - Delete remaining Supabase type definitions and interfaces
  - Remove unused database schemas and SQL-related code
  - Clean up any remaining Supabase import statements
  - _Requirements: 1.4_

- [x] 9.2 Update TypeScript interfaces for WordPress


  - Create TypeScript types for WordPress API responses
  - Define interfaces for articles, programs, episodes, and authors
  - Add proper typing for ACF fields and embedded data
  - _Requirements: 8.2_

- [x] 9.3 Clean up API routes and utilities


  - Remove or update API routes that previously proxied Supabase
  - Delete unused utility functions and services
  - Update remaining services to work with WordPress data
  - _Requirements: 2.5, 8.5_

- [x] 9.4 Update sitemap and SEO configuration


  - Remove admin routes from sitemap generation
  - Update robots.txt to exclude removed endpoints
  - Ensure SEO metadata works with WordPress content
  - _Requirements: 2.6, 8.5_

- [x] 10. Testing and Quality Assurance





  - Create unit tests for WordPress client and helpers
  - Build integration tests for API functionality
  - Implement end-to-end tests for critical user journeys
  - Perform performance and accessibility testing
  - _Requirements: 9.1, 9.3, 9.4, 9.5, 10.5_

- [x] 10.1 Create unit tests for WordPress functionality






  - Write tests for WordPress client authentication and caching
  - Test content helper functions with mock WordPress responses
  - Add tests for error handling and retry logic
  - _Requirements: 9.1_

- [x] 10.2 Build integration tests for API functionality


  - Test real WordPress API integration with test content
  - Verify ACF fields and embedded data processing
  - Test revalidation webhook integration
  - _Requirements: 9.3_

- [x] 10.3 Implement end-to-end testing


  - Test complete user journeys from homepage to content consumption
  - Verify content updates flow from WordPress to frontend
  - Test error handling when WordPress is unavailable
  - _Requirements: 9.4_

- [x] 10.4 Perform performance and accessibility testing


  - Verify Core Web Vitals scores remain acceptable
  - Test Arabic RTL functionality and accessibility
  - Ensure mobile responsiveness is maintained
  - _Requirements: 9.5, 10.5, 8.4_

- [x] 11. Final Verification and Rollback Preparation




  - Conduct comprehensive smoke testing
  - Verify all features work with WordPress-only architecture
  - Prepare rollback plan and documentation
  - Monitor performance and error rates
  - _Requirements: 8.1, 8.6, 9.6_

- [x] 11.1 Conduct comprehensive smoke testing


  - Test all page types load correctly with WordPress content
  - Verify content creation and publishing workflow
  - Test revalidation triggers and cache updates
  - _Requirements: 8.1, 8.6_



- [ ] 11.2 Verify feature parity
  - Ensure all existing features work with WordPress data
  - Test Arabic content display and RTL functionality
  - Verify audio players, search, and other components function


  - _Requirements: 8.1, 8.4, 8.5_

- [ ] 11.3 Prepare rollback plan and monitoring
  - Create feature branch with WordPress-only implementation


  - Document rollback procedures for quick recovery
  - Set up monitoring for performance and error tracking
  - _Requirements: 9.6_

- [ ] 11.4 Final performance verification
  - Test WordPress downtime handling and fallbacks
  - Verify cache performance and hit rates
  - Ensure error handling provides user-friendly messages
  - _Requirements: 9.1, 9.4, 9.5_