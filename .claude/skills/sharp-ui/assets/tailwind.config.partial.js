/**
 * Sharp UI Design System - Tailwind Configuration (PREMIUM)
 *
 * Includes: Bold colors, layered borders, glitch effects, scan lines, tech patterns
 *
 * Usage:
 * module.exports = {
 *   theme: {
 *     extend: {
 *       ...require('./sharp-ui-tailwind.config').theme.extend
 *     }
 *   }
 * }
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        sharp: {
          // Backgrounds - ultra-dark
          bg: '#0a0a0a',           // Near-black page background
          surface: '#141414',      // Card/element surface
          hover: '#1a1a1a',        // Hover state background
          active: '#222222',       // Active/pressed background
          elevated: '#1c1c1c',     // Elevated surface

          // Borders - more variety
          border: '#333333',       // Standard visible border
          'border-strong': '#444444', // Emphasized border
          'border-subtle': '#222222', // Subtle separation

          // Text
          text: '#ffffff',         // Primary text (pure white)
          'text-muted': '#888888', // Secondary text, labels
          'text-dim': '#555555',   // Very muted (coordinates, hints)

          // Primary accent - electric green (more shades)
          accent: {
            DEFAULT: '#00ff88',
            light: '#33ffaa',
            dark: '#00cc6a',
            muted: 'rgba(0, 255, 136, 0.15)',
            glow: 'rgba(0, 255, 136, 0.6)',
          },
          // Secondary accent - hot pink
          'accent-alt': {
            DEFAULT: '#ff3366',
            light: '#ff5588',
            dark: '#cc2952',
            muted: 'rgba(255, 51, 102, 0.15)',
            glow: 'rgba(255, 51, 102, 0.6)',
          },
          // Tertiary - electric blue (for variety)
          'accent-blue': {
            DEFAULT: '#00ccff',
            muted: 'rgba(0, 204, 255, 0.15)',
            glow: 'rgba(0, 204, 255, 0.6)',
          },
          // Warning/Error
          warning: {
            DEFAULT: '#ffcc00',
            muted: 'rgba(255, 204, 0, 0.15)',
          },
          error: {
            DEFAULT: '#ff4444',
            muted: 'rgba(255, 68, 68, 0.15)',
          },
          success: {
            DEFAULT: '#00ff88',
            muted: 'rgba(0, 255, 136, 0.15)',
          },
        }
      },
      borderRadius: {
        // Hard edges - 0-4px max
        'sharp': '0px',        // Default - truly sharp corners
        'sharp-sm': '2px',     // Subtle softening
        'sharp-md': '4px',     // Maximum allowed radius
      },
      borderWidth: {
        // Strong, visible borders
        'sharp': '2px',        // Standard border width
        'sharp-lg': '3px',     // Emphasized border width
        'sharp-xl': '4px',     // Heavy emphasis
      },
      boxShadow: {
        // Offset borders instead of traditional shadows
        'sharp-offset': '4px 4px 0 0 #333333',
        'sharp-offset-lg': '6px 6px 0 0 #333333',
        'sharp-offset-accent': '4px 4px 0 0 #00ff88',
        'sharp-offset-alt': '4px 4px 0 0 #ff3366',
        // Double border effect
        'sharp-double': 'inset 0 0 0 2px #333333, inset 0 0 0 4px #0a0a0a',
        // Focus rings (only shadows allowed)
        'sharp-focus': '0 0 0 2px #00ff88',
        'sharp-focus-alt': '0 0 0 2px #ff3366',
        // Glow for emphasis (use sparingly)
        'sharp-glow': '0 0 20px -4px rgba(0, 255, 136, 0.6)',
        'sharp-glow-alt': '0 0 20px -4px rgba(255, 51, 102, 0.6)',
      },
      backgroundImage: {
        // Grid pattern for technical feel
        'sharp-grid': `
          linear-gradient(rgba(51, 51, 51, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(51, 51, 51, 0.5) 1px, transparent 1px)
        `,
        // Scan lines overlay
        'sharp-scanlines': `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.15) 2px,
          rgba(0, 0, 0, 0.15) 4px
        )`,
        // Diagonal lines pattern
        'sharp-diagonal': `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(51, 51, 51, 0.3) 10px,
          rgba(51, 51, 51, 0.3) 11px
        )`,
        // Corner accents (technical HUD style)
        'sharp-corner-tl': `
          linear-gradient(to right, #00ff88 20px, transparent 20px),
          linear-gradient(to bottom, #00ff88 20px, transparent 20px)
        `,
        // Gradient for accent elements (breaks flat rule, use for emphasis)
        'sharp-gradient-accent': 'linear-gradient(90deg, #00ff88 0%, #00ccff 100%)',
        'sharp-gradient-alt': 'linear-gradient(90deg, #ff3366 0%, #ffcc00 100%)',
      },
      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-md': '40px 40px',
        'grid-lg': '80px 80px',
      },
      transitionTimingFunction: {
        'sharp': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'sharp-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'sharp-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'sharp-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        // Glitch effect
        'sharp-glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        // Scan line moving down
        'sharp-scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        // Border color cycle
        'sharp-border-pulse': {
          '0%, 100%': { borderColor: '#333333' },
          '50%': { borderColor: '#00ff88' },
        },
        // Cursor blink
        'sharp-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        // Typing effect
        'sharp-type': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        // Data stream
        'sharp-stream': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
      },
      animation: {
        'sharp-glitch': 'sharp-glitch 0.3s ease-in-out',
        'sharp-scan': 'sharp-scan 3s linear infinite',
        'sharp-border-pulse': 'sharp-border-pulse 2s ease-in-out infinite',
        'sharp-blink': 'sharp-blink 1s step-end infinite',
        'sharp-type': 'sharp-type 2s steps(40, end)',
      },
      fontFamily: {
        'sharp-mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'sharp-display': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    }
  }
};

/**
 * USAGE PATTERNS:
 *
 * // Primary button with offset shadow
 * <button className="
 *   bg-sharp-accent text-sharp-bg
 *   border-sharp border-sharp-accent
 *   font-bold uppercase tracking-wider
 *   shadow-sharp-offset-accent
 *   hover:-translate-x-1 hover:-translate-y-1
 *   hover:shadow-[6px_6px_0_0_#00ff88]
 *   active:translate-x-0 active:translate-y-0
 *   active:shadow-none
 *   transition-all duration-150 ease-sharp
 * ">
 *
 * // Card with offset border
 * <div className="
 *   bg-sharp-surface
 *   border-sharp border-sharp-border
 *   shadow-sharp-offset
 *   hover:-translate-x-1 hover:-translate-y-1
 *   hover:shadow-sharp-offset-lg
 *   transition-all duration-150
 * ">
 *
 * // Technical grid background
 * <div className="
 *   bg-sharp-bg bg-sharp-grid bg-grid-md
 * ">
 *
 * // Scan line overlay
 * <div className="relative">
 *   <div className="absolute inset-0 bg-sharp-scanlines pointer-events-none opacity-50" />
 *   {content}
 * </div>
 *
 * // Corner accent (HUD style)
 * <div className="relative">
 *   <span className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-sharp-accent" />
 *   <span className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-sharp-accent" />
 *   <span className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-sharp-accent" />
 *   <span className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-sharp-accent" />
 *   {content}
 * </div>
 *
 * // Status badge with glow
 * <span className="
 *   bg-sharp-accent-muted text-sharp-accent
 *   border border-sharp-accent/50
 *   shadow-sharp-glow
 *   font-mono uppercase tracking-wider text-xs
 * ">
 *
 * // Glitch on hover
 * <span className="hover:animate-sharp-glitch">
 *
 * // Blinking cursor
 * <span className="animate-sharp-blink">_</span>
 */
