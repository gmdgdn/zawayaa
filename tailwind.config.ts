import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px", 
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px", // Updated to match design system max-width
      },
    },
    extend: {
      // Dubai desert-meets-city color palette
      colors: {
        // Primary colors - midnight blue base
        primary: {
          900: "#0F172A", // primary-900
          700: "#334155", // primary-700
          50: "#F8FAFC",  // neutral-50 (for dark mode flip)
        },
        // Accent colors - warm sand
        accent: {
          600: "#F59E0B", // accent-600
          300: "#FDE68A", // accent-300
        },
        // Neutrals
        neutral: {
          50: "#F8FAFC",
          900: "#0F172A",
        },
        // Error state
        error: "#DC2626",
        
        // Legacy shadcn colors for compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      // Typography - IBM Plex Sans Arabic/Latin with modular scale
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        latin: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      
      // Modular-4 font scale
      fontSize: {
        '-2': ['0.75rem', { lineHeight: '1.2' }],  // -2 → 0.75rem
        '-1': ['0.875rem', { lineHeight: '1.3' }], // -1 → 0.875rem
        '0': ['1rem', { lineHeight: '1.5' }],      // 0 (body) → 1rem
        '1': ['1.25rem', { lineHeight: '1.4' }],   // 1 → 1.25rem
        '2': ['1.5rem', { lineHeight: '1.3' }],    // 2 → 1.5rem
        '3': ['2rem', { lineHeight: '1.2' }],      // 3 → 2rem
        '4': ['2.75rem', { lineHeight: '1.1' }],   // 4 → 2.75rem
      },
      
      // Spacing tokens
      spacing: {
        'xs': '4px',   // xs
        'sm': '8px',   // sm
        'md': '12px',  // md
        'lg': '16px',  // lg
        'xl': '24px',  // xl
        '2xl': '32px', // 2xl
      },
      
      // Grid system
      maxWidth: {
        'site': '1440px', // max-width for site
        'content': '1200px', // content area
        'reading': '620px', // article reading width
      },
      
      // Border radius - soft, friendly corners
      borderRadius: {
        '2xl': '1rem', // Cards & buttons
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // Shadows - soft layer
      boxShadow: {
        'soft': '0 4px 8px rgba(15, 23, 42, 0.08)',
        'card': '0 4px 8px rgba(15, 23, 42, 0.08)',
      },
      
      // Grid gap
      gap: {
        'grid': '16px', // lg for grid gaps
      },
      
      // Focus ring
      ringColor: {
        'accent': '#F59E0B',
      },
      
      // Animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-rtl"),
  ],
} satisfies Config

export default config
