import type { Config } from "tailwindcss"
import { colors, typography, layout, motion } from "./lib/theme"

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
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px", 
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Zawaya Semantic Color Tokens
        ink: {
          900: colors["ink-900"],
          700: colors["ink-700"],
          600: colors["ink-600"],
        },
        sand: {
          50: colors["sand-50"],
        },
        stone: {
          200: colors["stone-200"],
          600: colors["stone-600"],
        },
        brand: {
          green: colors["brand-green"],
          red: colors["brand-red"],
          yellow: colors["brand-yellow"],
          orange: colors["brand-orange"],
          mint: colors["brand-mint"],
          violet: colors["brand-violet"],
        },
        
        // Legacy Zawaya colors (for backward compatibility)
        "clr-primary-dark": colors["primary-dark"],
        "clr-accent": colors.accent,
        "clr-iris": colors.iris,
        "clr-orange": colors.orange,
        "clr-menthol": colors.menthol,
        "clr-naples": colors.naples,
        "zawaya-primary": colors.primary,
        "zawaya-accent": colors.accent,
        "zawaya-iris": colors.iris,
        "zawaya-orange": colors.orange,
        "zawaya-menthol": colors.menthol,
        "zawaya-yellow": colors.yellow,
        // Default shadcn colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
      fontSize: {
        xs: [typography.scale.xs, { lineHeight: typography.lineHeight.body.toString() }],
        sm: [typography.scale.sm, { lineHeight: typography.lineHeight.body.toString() }],
        base: [typography.scale.base, { lineHeight: typography.lineHeight.reading.toString() }],
        lg: [typography.scale.lg, { lineHeight: typography.lineHeight.body.toString() }],
        xl: [typography.scale.xl, { lineHeight: typography.lineHeight.body.toString() }],
        "2xl": [typography.scale["2xl"], { lineHeight: typography.lineHeight.display.toString() }],
        "3xl": [typography.scale["3xl"], { lineHeight: typography.lineHeight.display.toString() }],
        "4xl": [typography.scale["4xl"], { lineHeight: typography.lineHeight.display.toString() }],
      },
      fontFamily: {
        "ge-ss": typography.fonts.arabic,
        "eurostile": typography.fonts.latin,
        // RTL default
        sans: typography.fonts.arabic,
      },
      lineHeight: {
        'arabic': typography.lineHeight.arabic.toString(),
        'body': typography.lineHeight.body.toString(),
        'display': typography.lineHeight.display.toString(),
        'reading': typography.lineHeight.reading.toString(),
      },
      maxWidth: {
        'content': layout.maxContentWidth,
        'reading': '620px', // for article body text
      },
      aspectRatio: {
        'card': '3/2',
        'video': '16/9',
      },
      backgroundImage: {
        // Editorial gradients
        'cedar-mist': 'linear-gradient(140deg, #1E3E39 0%, #0D2A27 60%)',
        'sands-dusk': 'linear-gradient(180deg, #FAF7F0 0%, #F6F9F8 100%)',
        'iris-signal': 'linear-gradient(90deg, #644BD2 0%, #BEF0B4 100%)',
        // Legacy
        "geometric-pattern": "url('/pattern.png')",
      },
      boxShadow: {
        // Soft, airy shadows
        card: '0 6px 20px rgba(13, 42, 39, 0.06)',
      },
      transitionDuration: {
        'default': motion.duration,
      },
      transitionTimingFunction: {
        'default': motion.easing,
      },
      borderRadius: {
        // Design system radii
        xl: '16px',        // Cards
        '2xl': '20px',     // Feature elements
        // Legacy
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
} satisfies Config

export default config
