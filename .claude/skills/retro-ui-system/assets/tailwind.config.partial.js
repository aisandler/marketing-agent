/**
 * Retro UI System - Tailwind Configuration
 *
 * 8-bit aesthetic with dot grids, stepped gradients, scanlines, and CRT effects.
 * Synthwave-inspired color palette with neon accents.
 * Merge this into your tailwind.config.js theme.extend
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        retro: {
          // Backgrounds - CRT monitor dark
          bg: {
            deep: '#0a0a0f',
            base: '#0f0f18',
            elevated: '#161620',
            surface: '#1e1e2a',
            hover: '#282836',
          },

          // Primary - Neon magenta/pink
          primary: {
            DEFAULT: '#ff2d95',
            light: '#ff6eb4',
            dark: '#cc0066',
            glow: 'rgba(255, 45, 149, 0.6)',
            muted: 'rgba(255, 45, 149, 0.2)',
          },

          // Secondary - Electric cyan
          cyan: {
            DEFAULT: '#00f5ff',
            light: '#7fffff',
            dark: '#00b8c4',
            glow: 'rgba(0, 245, 255, 0.5)',
            muted: 'rgba(0, 245, 255, 0.15)',
          },

          // Tertiary - Synthwave purple
          purple: {
            DEFAULT: '#9d4edd',
            light: '#c77dff',
            glow: 'rgba(157, 78, 221, 0.5)',
            muted: 'rgba(157, 78, 221, 0.2)',
          },

          // Accent - Neon yellow/green
          neon: {
            yellow: '#f0f000',
            green: '#39ff14',
            orange: '#ff6600',
          },

          // Text
          text: {
            primary: '#e0e0ff',
            secondary: '#9090b0',
            muted: '#606080',
            glow: '#ffffff',
          },

          // Borders - pixelated feel
          border: {
            subtle: 'rgba(255, 255, 255, 0.08)',
            default: 'rgba(255, 255, 255, 0.15)',
            strong: 'rgba(255, 255, 255, 0.25)',
            neon: 'rgba(255, 45, 149, 0.5)',
            cyan: 'rgba(0, 245, 255, 0.5)',
          },

          // Status
          success: {
            DEFAULT: '#39ff14',
            glow: 'rgba(57, 255, 20, 0.5)',
            muted: 'rgba(57, 255, 20, 0.15)',
          },
          warning: {
            DEFAULT: '#f0f000',
            glow: 'rgba(240, 240, 0, 0.5)',
            muted: 'rgba(240, 240, 0, 0.15)',
          },
          error: {
            DEFAULT: '#ff3333',
            glow: 'rgba(255, 51, 51, 0.5)',
            muted: 'rgba(255, 51, 51, 0.15)',
          },
        },
      },

      backgroundImage: {
        // Dot grid pattern - signature 8-bit effect
        'retro-dots': `radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
        'retro-dots-dense': `radial-gradient(circle, rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
        'retro-dots-neon': `radial-gradient(circle, rgba(255, 45, 149, 0.3) 1px, transparent 1px)`,
        'retro-dots-cyan': `radial-gradient(circle, rgba(0, 245, 255, 0.25) 1px, transparent 1px)`,

        // Grid lines
        'retro-grid': `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        'retro-grid-neon': `
          linear-gradient(rgba(255, 45, 149, 0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
        `,

        // Scanlines - CRT monitor effect
        'retro-scanlines': `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.3) 2px,
          rgba(0, 0, 0, 0.3) 4px
        )`,
        'retro-scanlines-subtle': `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 3px,
          rgba(0, 0, 0, 0.15) 3px,
          rgba(0, 0, 0, 0.15) 4px
        )`,

        // Stepped gradient - 8-bit color banding
        'retro-gradient-stepped': `linear-gradient(
          180deg,
          #ff2d95 0%, #ff2d95 20%,
          #cc44aa 20%, #cc44aa 40%,
          #9955bb 40%, #9955bb 60%,
          #6666cc 60%, #6666cc 80%,
          #00f5ff 80%, #00f5ff 100%
        )`,

        // Smooth neon gradient
        'retro-gradient': 'linear-gradient(135deg, #ff2d95 0%, #9d4edd 50%, #00f5ff 100%)',
        'retro-gradient-horizontal': 'linear-gradient(90deg, #ff2d95 0%, #00f5ff 100%)',

        // CRT vignette
        'retro-vignette': `radial-gradient(
          ellipse at center,
          transparent 0%,
          transparent 60%,
          rgba(0, 0, 0, 0.4) 100%
        )`,

        // Noise/static
        'retro-noise': `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      },

      backgroundSize: {
        'retro-dots': '16px 16px',
        'retro-dots-sm': '8px 8px',
        'retro-dots-lg': '24px 24px',
        'retro-grid': '32px 32px',
        'retro-grid-sm': '16px 16px',
      },

      boxShadow: {
        // Neon glow shadows
        'retro-glow-pink': '0 0 20px rgba(255, 45, 149, 0.5), 0 0 40px rgba(255, 45, 149, 0.3)',
        'retro-glow-cyan': '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)',
        'retro-glow-purple': '0 0 20px rgba(157, 78, 221, 0.5), 0 0 40px rgba(157, 78, 221, 0.3)',

        // Text glow
        'retro-text-glow': '0 0 10px currentColor, 0 0 20px currentColor',

        // Pixel shadow - offset like retro games
        'retro-pixel': '4px 4px 0 0 rgba(0, 0, 0, 0.5)',
        'retro-pixel-neon': '4px 4px 0 0 rgba(255, 45, 149, 0.4)',
        'retro-pixel-cyan': '4px 4px 0 0 rgba(0, 245, 255, 0.3)',

        // Inset CRT
        'retro-inset': 'inset 0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.3)',

        // Combined glow + shadow
        'retro-card': '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px -10px rgba(255, 45, 149, 0.3)',
        'retro-card-hover': '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 50px -10px rgba(255, 45, 149, 0.5)',
      },

      borderRadius: {
        'retro-none': '0px',        // Sharp pixel corners
        'retro-sm': '4px',          // Slight rounding
        'retro': '8px',             // Standard
        'retro-lg': '12px',
      },

      fontFamily: {
        'retro-mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace'],
        'retro-display': ['Press Start 2P', 'VT323', 'monospace'],
      },

      transitionTimingFunction: {
        'retro-step': 'steps(8, end)',           // Stepped animation
        'retro-step-smooth': 'steps(16, end)',   // Smoother steps
        'retro-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      animation: {
        'retro-blink': 'retro-blink 1s steps(2, start) infinite',
        'retro-pulse-neon': 'retro-pulse-neon 2s ease-in-out infinite',
        'retro-scanline': 'retro-scanline 8s linear infinite',
        'retro-glitch': 'retro-glitch 3s infinite',
        'retro-flicker': 'retro-flicker 0.15s infinite',
        'retro-float': 'retro-float 3s ease-in-out infinite',
      },

      keyframes: {
        'retro-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'retro-pulse-neon': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 45, 149, 0.5), 0 0 40px rgba(255, 45, 149, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 45, 149, 0.7), 0 0 60px rgba(255, 45, 149, 0.5)',
          },
        },
        'retro-scanline': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100vh' },
        },
        'retro-glitch': {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '91%': { transform: 'translate(-2px, 1px)' },
          '92%': { transform: 'translate(2px, -1px)' },
          '93%': { transform: 'translate(-1px, 2px)' },
          '94%': { transform: 'translate(1px, -2px)' },
        },
        'retro-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
          '75%': { opacity: '0.98' },
        },
        'retro-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
};
