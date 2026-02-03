/**
 * Soft UI Design System - Tailwind Configuration (PREMIUM)
 *
 * Includes: Gradients, multi-layer shadows, animations, transforms
 *
 * Usage:
 * module.exports = {
 *   theme: {
 *     extend: {
 *       ...require('./soft-ui-tailwind.config').theme.extend
 *     }
 *   }
 * }
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        soft: {
          // Primary accent - vibrant purple
          primary: {
            DEFAULT: '#7c5cff',
            light: '#a78bfa',
            dark: '#6344ff',
            muted: 'rgba(124, 92, 255, 0.15)',
            glow: 'rgba(124, 92, 255, 0.5)',
          },
          // Secondary accent - cyan for gradients
          secondary: {
            DEFAULT: '#06b6d4',
            light: '#22d3ee',
            dark: '#0891b2',
            muted: 'rgba(6, 182, 212, 0.15)',
            glow: 'rgba(6, 182, 212, 0.4)',
          },
          // Legacy indigo (backwards compatible)
          indigo: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#8b9cf8',
            500: '#6b7cf0',
            600: '#5566e8',
          },
          // Dark mode surfaces - deeper, richer
          dark: {
            50: '#0c0d12',   // Deepest - page canvas
            100: '#12141a',  // Deep - main background
            200: '#1a1d25',  // Elevated surfaces
            300: '#22262f',  // Cards, panels
            400: '#2a2f3a',  // Hover state
            500: '#343a47',  // Active/pressed
          },
          // Light mode surfaces
          light: {
            50: '#ffffff',
            100: '#f8fafc',
            200: '#f1f5f9',
            300: '#e2e8f0',
            400: '#cbd5e1',
            500: '#94a3b8',
          },
          // Semantic colors
          success: {
            DEFAULT: '#34d399',
            muted: 'rgba(52, 211, 153, 0.15)',
            glow: 'rgba(52, 211, 153, 0.4)',
          },
          warning: {
            DEFAULT: '#fbbf24',
            muted: 'rgba(251, 191, 36, 0.15)',
            glow: 'rgba(251, 191, 36, 0.4)',
          },
          error: {
            DEFAULT: '#f87171',
            muted: 'rgba(248, 113, 113, 0.15)',
            glow: 'rgba(248, 113, 113, 0.4)',
          },
        }
      },
      // Gradient backgrounds
      backgroundImage: {
        'soft-gradient': 'linear-gradient(135deg, #7c5cff 0%, #06b6d4 100%)',
        'soft-gradient-subtle': 'linear-gradient(135deg, rgba(124, 92, 255, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
        'soft-gradient-glow': 'linear-gradient(135deg, rgba(124, 92, 255, 0.4) 0%, rgba(6, 182, 212, 0.3) 100%)',
        'soft-gradient-radial': 'radial-gradient(ellipse at top, rgba(124, 92, 255, 0.15) 0%, transparent 50%)',
        'soft-shine': 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
        'soft-grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        'soft-sm': '8px',
        'soft': '12px',
        'soft-lg': '16px',
        'soft-xl': '24px',
      },
      // Multi-layer shadow system
      boxShadow: {
        // Ambient shadows (soft, spread out)
        'soft-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.3)',
        'soft': '0 4px 16px -4px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'soft-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.5), 0 4px 8px -4px rgba(0, 0, 0, 0.3)',
        'soft-xl': '0 16px 48px -12px rgba(0, 0, 0, 0.6), 0 8px 16px -8px rgba(0, 0, 0, 0.4)',
        // Glow shadows (accent colored)
        'soft-glow': '0 0 40px -8px rgba(124, 92, 255, 0.5), 0 0 20px -4px rgba(124, 92, 255, 0.3)',
        'soft-glow-lg': '0 0 60px -10px rgba(124, 92, 255, 0.6), 0 0 30px -5px rgba(124, 92, 255, 0.4)',
        'soft-glow-cyan': '0 0 40px -8px rgba(6, 182, 212, 0.4), 0 0 20px -4px rgba(6, 182, 212, 0.3)',
        // Combined lift + glow (for buttons)
        'soft-lift': '0 4px 16px -4px rgba(0, 0, 0, 0.4), 0 0 20px -4px rgba(124, 92, 255, 0.3)',
        'soft-lift-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.5), 0 0 40px -8px rgba(124, 92, 255, 0.4)',
        // Light mode
        'soft-light': '0 4px 16px -4px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'soft-light-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.12), 0 4px 8px -4px rgba(0, 0, 0, 0.06)',
        // Inner shadows (for depth)
        'soft-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'soft-inner-lg': 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      // Animation timing functions
      transitionTimingFunction: {
        'soft-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'soft-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'soft-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      // Keyframe animations
      keyframes: {
        'soft-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        'soft-glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px -4px rgba(124, 92, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px -4px rgba(124, 92, 255, 0.5)' },
        },
        'soft-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'soft-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'soft-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'soft-pulse': 'soft-pulse 2s ease-in-out infinite',
        'soft-glow': 'soft-glow-pulse 2s ease-in-out infinite',
        'soft-shimmer': 'soft-shimmer 1.5s ease-in-out infinite',
        'soft-float': 'soft-float 3s ease-in-out infinite',
        'soft-spin': 'soft-spin 1s linear infinite',
      },
    }
  },
  // Recommended plugins
  plugins: [],
};

/**
 * USAGE PATTERNS:
 *
 * // Gradient button with glow
 * <button className="
 *   bg-soft-gradient text-white
 *   shadow-soft-lift hover:shadow-soft-lift-lg
 *   hover:-translate-y-0.5 hover:scale-[1.02]
 *   active:scale-[0.98]
 *   transition-all duration-200 ease-soft-out
 * ">
 *
 * // Card with hover lift
 * <div className="
 *   bg-soft-dark-300 border border-white/[0.06]
 *   shadow-soft hover:shadow-soft-lg
 *   hover:-translate-y-1 hover:border-white/[0.12]
 *   transition-all duration-300 ease-soft-out
 * ">
 *
 * // Gradient text
 * <h1 className="
 *   bg-soft-gradient bg-clip-text text-transparent
 * ">
 *
 * // Grain texture overlay
 * <div className="relative">
 *   <div className="absolute inset-0 bg-soft-grain opacity-[0.03] pointer-events-none" />
 *   {content}
 * </div>
 *
 * // Shine overlay on element
 * <div className="relative overflow-hidden">
 *   <div className="absolute inset-0 bg-soft-shine" />
 *   {content}
 * </div>
 *
 * // Pulsing notification dot
 * <span className="
 *   w-2 h-2 bg-soft-gradient rounded-full
 *   animate-soft-pulse
 * " />
 *
 * // Status badge with glow
 * <span className="
 *   bg-soft-success-muted text-soft-success
 *   shadow-[0_0_12px_-2px_rgba(52,211,153,0.4)]
 * ">
 */
