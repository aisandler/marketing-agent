import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors adapted for Soft UI (customize in config/brand.json)
        soft: {
          primary: {
            DEFAULT: '#1a365d',      // Brand primary
            light: '#2d4a7c',        // Lighter navy
            dark: '#0f2341',         // Darker navy
            muted: 'rgba(26, 54, 93, 0.12)',
            glow: 'rgba(26, 54, 93, 0.4)',
          },
          secondary: {
            DEFAULT: '#0891b2',      // Cyan for gradient end
            light: '#22d3ee',
            muted: 'rgba(8, 145, 178, 0.12)',
            glow: 'rgba(8, 145, 178, 0.35)',
          },
          accent: {
            DEFAULT: '#d69e2e',      // Brand accent
            muted: 'rgba(214, 158, 46, 0.15)',
          },
          // Light mode surface colors
          surface: {
            50: '#ffffff',           // Cards, elevated
            100: '#f8fafc',          // Main background
            200: '#f1f5f9',          // Subtle sections
            300: '#e2e8f0',          // Borders, dividers
            400: '#cbd5e1',          // Muted text bg
          },
          // Text colors
          text: {
            primary: '#0f172a',      // Headings, important text
            secondary: '#475569',    // Body text
            muted: '#94a3b8',        // Subtle text, placeholders
          },
          // Semantic colors
          success: {
            DEFAULT: '#10b981',
            muted: 'rgba(16, 185, 129, 0.12)',
          },
          warning: {
            DEFAULT: '#f59e0b',
            muted: 'rgba(245, 158, 11, 0.12)',
          },
          error: {
            DEFAULT: '#ef4444',
            muted: 'rgba(239, 68, 68, 0.12)',
          },
        },
        // Legacy color aliases
        'brand-primary': '#1a365d',
        'brand-accent': '#d69e2e',
        'brand-gray': '#718096',
      },
      backgroundImage: {
        // Brand gradient (navy to cyan)
        'soft-gradient': 'linear-gradient(135deg, #1a365d 0%, #0891b2 100%)',
        'soft-gradient-subtle': 'linear-gradient(135deg, rgba(26, 54, 93, 0.08) 0%, rgba(8, 145, 178, 0.04) 100%)',
        'soft-gradient-hover': 'linear-gradient(135deg, #2d4a7c 0%, #22d3ee 100%)',
        // Shine overlay for buttons
        'soft-shine': 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
        // Subtle grain texture
        'soft-grain': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
      },
      boxShadow: {
        // Multi-layer shadows for depth (light mode optimized)
        'soft-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'soft': '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 4px 10px -5px rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 16px -8px rgba(0, 0, 0, 0.1)',
        // Glow shadows with brand color
        'soft-glow': '0 0 30px -5px rgba(26, 54, 93, 0.3), 0 0 15px -3px rgba(8, 145, 178, 0.2)',
        'soft-glow-lg': '0 0 50px -10px rgba(26, 54, 93, 0.4), 0 0 25px -5px rgba(8, 145, 178, 0.3)',
        // Lift shadows (combine depth + subtle glow)
        'soft-lift': '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 0 20px -5px rgba(26, 54, 93, 0.15)',
        'soft-lift-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 0 40px -10px rgba(26, 54, 93, 0.2)',
      },
      borderRadius: {
        'soft-sm': '8px',
        'soft': '12px',
        'soft-lg': '16px',
        'soft-xl': '24px',
      },
      transitionTimingFunction: {
        'soft-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'soft-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'soft-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      animation: {
        'soft-pulse': 'soft-pulse 2s ease-in-out infinite',
        'soft-glow': 'soft-glow-pulse 2s ease-in-out infinite',
        'soft-shimmer': 'soft-shimmer 2s linear infinite',
        'soft-fade-in': 'soft-fade-in 0.3s ease-out forwards',
        'soft-fade-in-up': 'soft-fade-in-up 0.4s ease-out forwards',
        'soft-scale-in': 'soft-scale-in 0.2s ease-out forwards',
      },
      keyframes: {
        'soft-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'soft-glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px currentColor' },
          '50%': { boxShadow: '0 0 16px currentColor, 0 0 24px currentColor' },
        },
        'soft-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'soft-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'soft-fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
