// Zawaya Modern Design System - Flat & Content-First
export const colors = {
  // Strategic Color Usage
  "primary-text": "#1a1a1a",        // Near-black for maximum readability
  "primary-accent": "#f6523d",       // Ogre Odor - CTAs and active states
  "secondary-accent": "#644bd2",     // Iris - category tags, podcasts
  "brand-green": "#28645a",          // Dark Slate Gray - author highlights
  
  // Content categorization
  "brand-red": "#f6523d",            // Political opinions, main CTAs
  "brand-violet": "#644bd2",         // Tech/culture, podcasts
  "brand-orange": "#fc7931",         // Secondary actions
  "brand-yellow": "#ffdc64",         // Highlights, badges
  "brand-mint": "#bef0b4",           // Success states
  
  // Modern neutrals
  "ink-900": "#1a1a1a",             // Primary text (near-black)
  "ink-700": "#374151",             // Secondary text
  "ink-600": "#6b7280",             // Meta text
  "sand-50": "#fefefe",             // Light off-white background
  "stone-200": "#e5e7eb",           // Subtle borders
  
  // Legacy aliases for backward compatibility
  "primary-dark": "#28645a",
  "accent": "#f6523d",
  "iris": "#644bd2",
  "orange": "#fc7931",
  "menthol": "#bef0b4",
  "naples": "#ffdc64",
  primary: "#28645a",
  yellow: "#ffdc64",
  "primary-surface": "#F6F9F8",
  "stone-600": "#5E6E6B",
}

export const typography = {
  fonts: {
    arabic: ['"IBM Plex Sans Arabic"', 'Cairo', 'system-ui', 'sans-serif'],
    latin: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
  },
  scale: {
    // Arabic-first scale with better breathing room
    meta: "14px",      // 14/22 (500) - Meta text
    body: "17px",      // 17/28 (500) - Body text (increased from 16px)
    lead: "18px",      // 18/30 (500) - Lead paragraphs (increased)
    h3: "24px",        // 24/32 (600) - H3
    h2: "32px",        // 32/40 (700) - H2
    h1: "40px",        // 40/48 (700) - Giant section titles
    // Legacy sizes
    xs: "12px",
    sm: "14px", 
    base: "17px",      // Updated to match body
    lg: "20px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "40px",
    "4xl": "48px",
  },
  lineHeight: {
    meta: 1.57,        // 22/14
    body: 1.65,        // 28/17 (generous for Arabic)
    lead: 1.67,        // 30/18 (extra breathing room)
    h3: 1.33,          // 32/24
    h2: 1.25,          // 40/32
    h1: 1.2,           // 48/40
    // Legacy
    arabic: 1.7,       // Extra generous for Arabic paragraphs
    reading: 1.7,      // Extra generous for long-form
    display: 1.2,
  },
}

export const layout = {
  grid: {
    mobile: 4,
    tablet: 8, 
    desktop: 12,
  },
  maxContentWidth: "760px",
  aspectRatios: {
    square: "1:1",
    card: "3:2",
  },
}

export const motion = {
  duration: "200ms",
  easing: "ease-out",
  transforms: {
    hover: "translateY(-4px)",
  },
}

export const theme = {
  colors,
  typography,
  layout,
  motion,
}
