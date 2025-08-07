# Implementation Plan - WordPress SCF Extension

- [x] 1. Extend SCF Type Mappings with New Meta Fields





  - Create comprehensive TypeScript interfaces for all WordPress Custom Post Types with their Smart Custom Field metadata
  - Add reading_time, inline_media[], meta_description, meta_og_image to post mappings
  - Add trailer_video_url, apple_link, spotify_link, google_link, rss_feed to program mappings  
  - Add season_number, episode_number, transcript_markdown, resource_links, key_points, chapters[] to episode mappings
  - Create new TaqdeerMeta interface with kicker, deck, verdict, charts_gallery fields
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 1.1 Extend Post SCF Mappings


  - Modify lib/scf-mappings/post.ts to add reading_time (number), inline_media (MediaItem[]), meta_description (string), meta_og_image (string) fields
  - Define MediaItem interface with type, url, caption, alt properties
  - Update transformation functions to handle new fields with proper null checking
  - Add validation functions for new URL and numeric fields
  - _Requirements: 1.1_

- [x] 1.2 Extend Program SCF Mappings  


  - Modify lib/scf-mappings/program.ts to add trailer_video_url, apple_link, spotify_link, google_link, rss_feed fields
  - Update ProgramDetailProps interface to include subscription links and trailer video
  - Modify transformToProgramDetail function to map new fields from WordPress meta
  - Add URL validation for all new link fields
  - _Requirements: 1.2_

- [x] 1.3 Extend Episode SCF Mappings




  - Modify lib/scf-mappings/episode.ts to add season_number, episode_number, transcript_markdown, resource_links, key_points, chapters fields
  - Define Chapter interface with start (number) and title (string) properties
  - Define ResourceLink interface with title, url, type properties
  - Update EpisodeDetailProps to include all new metadata fields
  - Update transformation functions to handle arrays and nested objects
  - _Requirements: 1.3_

- [x] 1.4 Create Taqdeer SCF Mappings


  - Create new file lib/scf-mappings/taqdeer.ts with TaqdeerMeta interface
  - Define interfaces for ChartItem (title, image_url, description) and Source (title, url, date, type)
  - Create TaqdeerDetailProps interface for component consumption
  - Implement transformToTaqdeerDetail function for WordPress post transformation
  - Add validation functions for verdict enum and confidence percentage
  - _Requirements: 1.4_

- [x] 1.5 Create Central SCF Mappings Index


  - Create lib/scf-mappings/index.ts file to re-export all mapping interfaces and functions
  - Export all existing mappings (article-mappings, program-mappings, author-mappings)
  - Export new mappings (post, program, episode, taqdeer)
  - Ensure TypeScript compilation passes with strictNullChecks enabled
  - _Requirements: 1.5, 1.6_

- [x] 2. Implement WordPress REST API Client Extensions





  - Create generic wpFetch function with proper error handling and ISR caching
  - Implement specific content fetcher functions for programs, episodes, and Taqdeer content
  - Add support for _embed and _fields parameters for optimized API requests
  - Implement proper retry logic and fallback handling for network errors
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 2.1 Create Generic WordPress Fetch Function


  - Create lib/wp.ts file with wpFetch<T>(endpoint: string, queryString: string) function
  - Implement proper HTTP status error handling with custom WordPressError class
  - Add ISR caching with next: { revalidate: 60 } configuration
  - Include WordPress Application Password authentication headers
  - Add timeout handling and network error recovery
  - _Requirements: 2.1_

- [x] 2.2 Implement Content Fetcher Functions


  - Add getPrograms() function to fetch all programs with _embed and _fields parameters
  - Add getProgram(slug: string) function to fetch single program by slug
  - Add getEpisodesByProgram(parentId: number) function to fetch episodes for a program
  - Add getEpisode(slug: string) function to fetch single episode by slug
  - Add getTaqdeer(slug: string) function to fetch single Taqdeer assessment by slug
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 2.3 Add Query Parameter Support


  - Ensure all fetcher functions include _embed=true for embedded author and media data
  - Add _fields=id,slug,title,content,excerpt,meta parameter for optimized responses
  - Implement proper URL encoding for query parameters
  - Add support for pagination and filtering parameters where needed
  - _Requirements: 2.6_

- [x] 3. Implement Global Media Player System





  - Create React Context for managing global media playback state
  - Implement sticky media player component with audio/video support
  - Add media player to app layout for persistent playback across navigation
  - Ensure proper cleanup and state management for media resources
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 3.1 Create Sticky Media Context


  - Create src/context/StickyMediaContext.tsx with MediaState interface (url, type, poster, title, isPlaying)
  - Implement MediaContextType with setMedia, play, pause, toggle methods
  - Create StickyMediaProvider component with useState for media state management
  - Add useStickyMedia custom hook for consuming context in components
  - _Requirements: 3.1_

- [x] 3.2 Implement Sticky Media Player Component


  - Create src/components/StickyMediaPlayer.tsx with fixed bottom positioning
  - Implement conditional rendering for video vs audio elements based on media type
  - Add play/pause button with proper icon states and click handlers
  - Include truncated title display and responsive design for mobile
  - Add proper z-index and styling for overlay positioning
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [x] 3.3 Integrate Media Provider in App Layout




  - Modify app/layout.tsx to wrap content with StickyMediaProvider
  - Position provider wrapper right after body tag for proper context scope
  - Include StickyMediaPlayer component in layout for global availability
  - Ensure proper TypeScript imports and context availability
  - _Requirements: 3.6_

- [x] 4. Create Content Display Components



  - Implement ProgramHero component with cover image, host info, and subscription buttons
  - Create EpisodePlayer component with video/audio support and sticky player integration
  - Build ChaptersList component with clickable seek functionality
  - Implement TranscriptAccordion with markdown rendering and collapsible UI
  - Create LongformLayout component for Taqdeer content with verdict badges and charts
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 4.1 Implement Program Hero Component


  - Create components/ProgramHero.tsx with WPProgram props interface
  - Display cover_image as background with gradient overlay for text readability
  - Show host_arabic name and program title with proper Arabic typography
  - Add subscription buttons for Apple, Spotify, Google links when available
  - Integrate with sticky media context for trailer video playback
  - _Requirements: 4.1_

- [x] 4.2 Create Episode Player Component


  - Create components/EpisodePlayer.tsx with WPEpisode props interface
  - Implement conditional rendering for video_embed_url vs audio_file_url
  - Use ReactPlayer for video embeds and HTML5 audio element for audio files
  - Add onPlay handler to update sticky media context with current episode
  - Include proper poster image and media controls
  - _Requirements: 4.2, 4.6_

- [x] 4.3 Build Chapters List Component


  - Create components/ChaptersList.tsx with chapters array and onSeek callback props
  - Render clickable list of chapters with start time and title
  - Implement formatTime utility function for displaying timestamps
  - Add hover states and proper RTL layout for Arabic text
  - Connect chapter clicks to media player seek functionality
  - _Requirements: 4.3_

- [x] 4.4 Implement Transcript Accordion Component


  - Create components/TranscriptAccordion.tsx with markdown string prop
  - Use react-markdown or next-mdx-remote for markdown rendering
  - Implement collapsible accordion UI with expand/collapse animation
  - Add proper Arabic prose styling and RTL text direction
  - Include chevron icon with rotation animation for open/closed states
  - _Requirements: 4.4_

- [x] 4.5 Create Longform Layout Component


  - Create components/LongformLayout.tsx with WPTaqdeer props interface
  - Render kicker, title, deck, and verdict badge with appropriate styling
  - Display verdict with color coding (positive=green, negative=red, neutral=gray)
  - Include charts gallery with responsive grid layout
  - Add key findings and methodology sections with proper typography
  - _Requirements: 4.5_

- [x] 5. Implement Dynamic Routes with ISR





  - Create /programs index page with grid layout of program cards
  - Implement /programs/[slug] dynamic page with program details and episode listings
  - Create /episodes/[slug] dynamic page with episode player, transcript, and chapters
  - Implement /taqdeer-mawqef/[slug] dynamic page with longform assessment layout
  - Add generateStaticParams for all dynamic routes using WordPress data
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 5.1 Create Programs Index Page


  - Create app/programs/page.tsx with async function for server-side data fetching
  - Use getPrograms() to fetch all programs with proper error handling
  - Implement responsive grid layout using ProgramCard components (reuse ProgramHero thumbnail style)
  - Add proper page metadata and SEO optimization
  - Include loading states and error boundaries
  - _Requirements: 5.1_

- [x] 5.2 Implement Program Detail Page


  - Create app/programs/[slug]/page.tsx with generateStaticParams using getPrograms()
  - Fetch individual program data and related episodes using getProgram() and getEpisodesByProgram()
  - Render ProgramHero component with full program information
  - Display list of EpisodeCard components linking to individual episode pages
  - Add proper ISR configuration and cache tags
  - _Requirements: 5.2_

- [x] 5.3 Add Program Page Loading and Error States



  - Create app/programs/[slug]/loading.tsx with skeleton UI for program page
  - Create app/programs/[slug]/not-found.tsx with Arabic 404 message
  - Ensure proper fallback handling for missing programs
  - Add error boundary for component-level error handling
  - _Requirements: 5.2_

- [x] 5.4 Create Episode Detail Page


  - Create app/episodes/[slug]/page.tsx with generateStaticParams using getEpisodesByProgram for all programs
  - Fetch episode data and parent program information using getEpisode()
  - Render EpisodePlayer component with video/audio playback
  - Include TranscriptAccordion and ChaptersList components
  - Implement sticky media player integration for continuous playback
  - _Requirements: 5.3_

- [x] 5.5 Implement Taqdeer Detail Page


  - Create app/taqdeer-mawqef/[slug]/page.tsx with generateStaticParams using wpFetch('taqdeer_mawqef?per_page=100&_fields=slug')
  - Fetch Taqdeer assessment data using getTaqdeer() function
  - Use LongformLayout component for rendering assessment content
  - Add proper SEO metadata and social sharing tags
  - Include proper Arabic typography and RTL layout
  - _Requirements: 5.4_

- [-] 6. Implement Cache Revalidation API



  - Create webhook endpoint for WordPress-triggered cache invalidation
  - Add secret token validation for security
  - Implement revalidatePath calls for targeted cache clearing
  - Add proper error handling and response formatting
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 6.1 Create Revalidation API Route


  - Create app/api/revalidate/route.ts with POST method handler
  - Validate secret token from request body against REVALIDATION_SECRET environment variable
  - Accept tag (path) parameter for targeted revalidation
  - Call revalidatePath(tag) for cache invalidation
  - Return JSON response with revalidated status and timestamp
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6.2 Add Error Handling and Logging









  - Implement proper error responses for invalid secret or missing parameters
  - Add request logging for monitoring and debugging
  - Include rate limiting protection against abuse
  - Return appropriate HTTP status codes (200, 401, 400, 500)
  - _Requirements: 6.4, 6.6_

- [ ] 7. Enable RTL Styling and Arabic Typography
  - Add tailwindcss-rtl plugin to Tailwind configuration
  - Import and configure IBM Plex Sans Arabic font from Google Fonts
  - Set HTML dir attribute based on locale for proper text direction
  - Update component styles to support RTL layout
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 7.1 Configure Tailwind RTL Plugin
  - Install tailwindcss-rtl plugin as development dependency
  - Add plugin to tailwind.config.ts plugins array
  - Test RTL utility classes in components
  - _Requirements: 7.1_

- [ ] 7.2 Setup IBM Plex Arabic Font
  - Import IBM_Plex_Sans_Arabic from next/font/google in layout.tsx
  - Configure font with appropriate weights and subsets
  - Apply font className to HTML element for global usage
  - _Requirements: 7.2_

- [ ] 7.3 Configure HTML Direction Attribute
  - Update layout.tsx to set dir="rtl" for Arabic locale
  - Ensure proper language attribute (lang="ar") for Arabic pages
  - Test text flow and component alignment in RTL mode
  - _Requirements: 7.3, 7.4, 7.5, 7.6_

- [ ] 8. Add Comprehensive Testing Coverage
  - Write unit tests for SCF mapping transformation functions
  - Create integration tests for WordPress API client methods
  - Implement component tests for media player functionality
  - Add end-to-end tests for complete user journeys
  - Test cache revalidation and webhook security
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 8.1 Write SCF Mapping Unit Tests
  - Test transformation functions for all content types (posts, programs, episodes, Taqdeer)
  - Validate proper handling of missing fields and null values
  - Test validation functions for URLs, numbers, and enum values
  - Ensure TypeScript compilation with strict null checks
  - _Requirements: 10.1_

- [ ] 8.2 Create WordPress API Integration Tests
  - Test wpFetch function with various endpoints and error conditions
  - Validate content fetcher functions (getPrograms, getEpisode, etc.)
  - Test error handling and retry logic for network failures
  - Mock WordPress API responses for consistent testing
  - _Requirements: 10.2_

- [ ] 8.3 Implement Media Player Component Tests
  - Test sticky media context state management and updates
  - Validate media player component rendering for audio vs video
  - Test play/pause functionality and context integration
  - Ensure proper cleanup and memory management
  - _Requirements: 10.3_

- [ ] 8.4 Add Route and Navigation Tests
  - Test dynamic route generation with generateStaticParams
  - Validate proper page rendering with WordPress data
  - Test ISR functionality and cache behavior
  - Ensure proper 404 handling for missing content
  - _Requirements: 10.4_

- [ ] 8.5 Test Cache Revalidation Security
  - Test revalidation API endpoint with valid and invalid secrets
  - Validate proper error responses and status codes
  - Test webhook integration with WordPress
  - Ensure rate limiting and abuse protection
  - _Requirements: 10.5_

- [ ] 8.6 Verify TypeScript Compilation
  - Run pnpm tsc --noEmit to ensure zero TypeScript errors
  - Validate all imports and exports are properly typed
  - Test strict null checks compliance across all new code
  - Ensure proper interface definitions and type safety
  - _Requirements: 10.6_