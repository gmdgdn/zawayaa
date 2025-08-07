# Requirements Document - WordPress SCF Extension

## Introduction

This document outlines the requirements for extending the Zawaya platform's WordPress integration with comprehensive Smart Custom Field (SCF) mappings and new Custom Post Types. The goal is to enhance the existing WordPress REST API integration by adding support for programs, episodes, and Taqdeer content types with their associated metadata, while implementing a global media player system and proper RTL styling.

## Requirements

### Requirement 1: Extended SCF Type Mappings

**User Story:** As a developer, I want comprehensive TypeScript interfaces for all WordPress Custom Post Types and their Smart Custom Field metadata, so that I can work with strongly-typed data throughout the application.

#### Acceptance Criteria

1. WHEN defining post metadata THEN the system SHALL include reading_time, inline_media[], meta_description, and meta_og_image fields
2. WHEN defining program metadata THEN the system SHALL include trailer_video_url, apple_link, spotify_link, google_link, and rss_feed fields
3. WHEN defining episode metadata THEN the system SHALL include season_number, episode_number, transcript_markdown, resource_links, key_points, and chapters array with start time and title
4. WHEN creating Taqdeer interface THEN the system SHALL define TaqdeerMeta interface with all required fields for assessment content
5. WHEN exporting types THEN the system SHALL re-export all interfaces from a central index file
6. WHEN compiling TypeScript THEN the system SHALL pass strictNullChecks without errors

### Requirement 2: WordPress REST API Client

**User Story:** As a developer, I want a generic WordPress fetch client and specific content fetchers, so that I can efficiently retrieve different Custom Post Types from WordPress.

#### Acceptance Criteria

1. WHEN creating wpFetch function THEN the system SHALL handle non-OK HTTP status responses gracefully
2. WHEN fetching data THEN the system SHALL implement ISR caching with 60-second revalidation
3. WHEN retrieving programs THEN the system SHALL fetch with _embed and specific _fields parameters
4. WHEN retrieving episodes THEN the system SHALL support filtering by parent program ID
5. WHEN fetching individual content THEN the system SHALL retrieve by slug with full metadata
6. WHEN making API calls THEN the system SHALL include id, slug, title, content, excerpt, and meta fields

### Requirement 3: Global Media Player System

**User Story:** As a user, I want a persistent media player that continues playing when I navigate between pages, so that I can listen to audio content while browsing the site.

#### Acceptance Criteria

1. WHEN creating media context THEN the system SHALL support both audio and video content types
2. WHEN playing media THEN the system SHALL maintain playback state across page navigation
3. WHEN displaying video content THEN the system SHALL use HTML5 video element with poster image
4. WHEN displaying audio content THEN the system SHALL use HTML5 audio element with controls
5. WHEN showing player UI THEN the system SHALL display play/pause button and truncated title
6. WHEN integrating with layout THEN the system SHALL position player as fixed bottom bar

### Requirement 4: Content Display Components

**User Story:** As a user, I want rich content display components for programs, episodes, and assessments, so that I can view multimedia content with proper formatting and controls.

#### Acceptance Criteria

1. WHEN displaying program hero THEN the system SHALL show cover image, Arabic host name, and subscription buttons
2. WHEN playing episodes THEN the system SHALL support both video embed and audio playback
3. WHEN viewing chapters THEN the system SHALL provide clickable chapter list with seek functionality
4. WHEN reading transcripts THEN the system SHALL display markdown content in collapsible accordion
5. WHEN viewing Taqdeer content THEN the system SHALL render kicker, deck, verdict badge, and charts gallery
6. WHEN playing media THEN the system SHALL update the global sticky media player context

### Requirement 5: Dynamic Route Implementation

**User Story:** As a user, I want to browse programs, episodes, and assessment content through dedicated pages, so that I can access all content types with proper URLs and navigation.

#### Acceptance Criteria

1. WHEN accessing /programs THEN the system SHALL display a grid of all available programs
2. WHEN viewing /programs/[slug] THEN the system SHALL show program details with episode listings
3. WHEN accessing /episodes/[slug] THEN the system SHALL display episode player, transcript, and chapters
4. WHEN viewing /taqdeer-mawqef/[slug] THEN the system SHALL render assessment content with proper formatting
5. WHEN generating static params THEN the system SHALL use WordPress data for pre-rendering
6. WHEN handling loading states THEN the system SHALL provide appropriate loading and not-found pages

### Requirement 6: Cache Revalidation API

**User Story:** As a content editor, I want the website to update automatically when I publish content in WordPress, so that new content appears immediately without manual intervention.

#### Acceptance Criteria

1. WHEN receiving webhook requests THEN the system SHALL validate secret token for security
2. WHEN processing revalidation THEN the system SHALL accept tag (path) parameter for targeted updates
3. WHEN revalidating successfully THEN the system SHALL return confirmation with revalidated status
4. WHEN handling invalid requests THEN the system SHALL return appropriate error responses
5. WHEN updating content THEN the system SHALL clear relevant page caches using revalidatePath
6. WHEN logging activity THEN the system SHALL record revalidation attempts for monitoring

### Requirement 7: RTL Styling and Typography

**User Story:** As an Arabic user, I want proper right-to-left layout and Arabic typography, so that I can read content naturally in my preferred language direction.

#### Acceptance Criteria

1. WHEN configuring Tailwind THEN the system SHALL include tailwindcss-rtl plugin
2. WHEN loading fonts THEN the system SHALL use IBM Plex Sans Arabic from Google Fonts
3. WHEN setting HTML attributes THEN the system SHALL apply dir="rtl" for Arabic locale
4. WHEN displaying Arabic content THEN the system SHALL use proper Arabic font family
5. WHEN styling components THEN the system SHALL support RTL layout adjustments
6. WHEN rendering text THEN the system SHALL maintain proper Arabic text flow and alignment

### Requirement 8: Static Site Generation with ISR

**User Story:** As a user, I want fast page loads with fresh content, so that I can access information quickly while still seeing recently updated content.

#### Acceptance Criteria

1. WHEN generating static pages THEN the system SHALL use WordPress data for generateStaticParams
2. WHEN serving pages THEN the system SHALL implement Incremental Static Regeneration
3. WHEN fetching data THEN the system SHALL use appropriate caching strategies for different content types
4. WHEN building the site THEN the system SHALL pre-render popular content paths
5. WHEN updating content THEN the system SHALL regenerate pages on-demand via revalidation
6. WHEN handling traffic THEN the system SHALL serve cached pages for optimal performance

### Requirement 9: Error Handling and Fallbacks

**User Story:** As a user, I want the website to handle errors gracefully, so that I receive helpful feedback when content is unavailable or when technical issues occur.

#### Acceptance Criteria

1. WHEN WordPress is unavailable THEN the system SHALL display user-friendly error messages
2. WHEN content is not found THEN the system SHALL show appropriate 404 pages
3. WHEN media fails to load THEN the system SHALL provide fallback states
4. WHEN API requests fail THEN the system SHALL implement proper error boundaries
5. WHEN network issues occur THEN the system SHALL show loading states and retry options
6. WHEN debugging issues THEN the system SHALL log errors appropriately for troubleshooting

### Requirement 10: Testing and Quality Assurance

**User Story:** As a developer, I want comprehensive testing coverage for the new features, so that I can ensure reliability and catch regressions early.

#### Acceptance Criteria

1. WHEN running smoke tests THEN the system SHALL verify /programs grid displays content
2. WHEN testing program pages THEN the system SHALL confirm subscription buttons appear when links exist
3. WHEN testing episode playback THEN the system SHALL verify player functionality and sticky bar persistence
4. WHEN testing Taqdeer pages THEN the system SHALL confirm verdict badge and content rendering
5. WHEN testing revalidation API THEN the system SHALL verify webhook security and functionality
6. WHEN running TypeScript checks THEN the system SHALL compile without errors or warnings