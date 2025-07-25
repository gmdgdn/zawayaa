// Official Zawaya Brand Palette
export const colors = {
  "primary-dark": "#28645a",  // header/footer bg, buttons on light bg
  "accent": "#f6523d",        // active nav link, CTA hovers, audio-play icon
  "iris": "#644bd2",          // info badges, podcast tag pills
  "orange": "#fc7931",        // warning/toast notices
  "menthol": "#bef0b4",       // success states, subtle separators
  "naples": "#ffdc64",        // highlights, tooltip pointers (was yellow)
  
  // Legacy aliases for backward compatibility
  primary: "#28645a",
  yellow: "#ffdc64",
}

export const typography = {
  fonts: {
    arabic: ["Ge SS Two", "sans-serif"],
    latin: ["Eurostile LT Std", "sans-serif"],
  },
  scale: {
    xs: "12px",
    sm: "14px", 
    base: "16px",
    lg: "20px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "40px",
    "4xl": "48px",
  },
  lineHeight: {
    body: 1.4,
    display: 1.2,
    arabic: 1.3, // minimum for diacritics
    reading: 1.6, // 60-80 chars per line
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
