import type { Config } from 'tailwindcss';

/**
 * MLRIT design tokens — peak palette.
 *
 * Discipline:
 *  • ONE warm-ink for every dark section          → ink (#0c0c0e)
 *  • ONE deeper ink for nested cards/strips        → ink-2 (#16161a)
 *  • ONE cream for every cream section             → cream (#faf7f0)
 *  • ONE deeper cream for alternation              → cream-2 (#f1ece1)
 *  • Off-white for pristine surfaces               → snow (#fbfbfa)
 *  • Brand orange + brand green stay distinctive
 *
 * Hex codes are tuned for warmth — not pure neutrals — so the site
 * reads premium and editorial rather than corporate-blue.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand
        primary:   { DEFAULT: '#e85d04', hover: '#f06a14', pressed: '#c44b00' },
        // Brand green === the navbar green (#01741f), used consistently site-wide.
        secondary: { DEFAULT: '#01741f', hover: '#018f28', pressed: '#015416' },

        // ── Orange / Green palettes
        orange: {
          50:  '#fff5ec', 100: '#ffe5d3', 200: '#ffcfa6', 300: '#ffb27a',
          500: '#e85d04', 600: '#c44b00', 700: '#9c3c00',
        },
        green: {
          50:  '#f1f8f4', 100: '#d7f0e3', 200: '#a9d9bf', 300: '#6cbd97',
          nav: '#01741f', 500: '#2d8b55', 600: '#1f6b3e',
        },

        // ── Accent palettes
        gold: { 50: '#fdf3e0', 400: '#f5c842', 600: '#c49a10', 900: '#7a4f00' },
        warm: { light: '#faf7f0', DEFAULT: '#ecdec1', dark: '#d4c5a8' },

        // ── Inks (dark canvases) — warm rather than blue
        ink:   { DEFAULT: '#0c0c0e', 2: '#16161a', 3: '#1f1f24' },

        // ── Creams (light canvases)
        cream:   { DEFAULT: '#faf7f0', 2: '#f1ece1', deep: '#e8e2d2' },
        snow:    '#fbfbfa',

        // ── Neutral palette (warm grays)
        neutral: {
          0:   '#ffffff',
          50:  '#f7f6f3',
          100: '#ecebe6',
          200: '#dad7cf',
          400: '#9d9b94',
          600: '#5e5d57',
          800: '#27272a',
          900: '#0f0f0f',
        },

        // ── Semantic aliases (refined)
        background: '#ffffff',
        foreground: '#0f0f0f',
        muted:      '#6a6a64',  // warmer than the old 5c5a55, slightly lighter for editorial feel
        subtle:     '#9d9b94',
        border:     '#e4e0d7',  // slightly warmer than #d9d7d1 for a softer card edge
      },

      // ── Fonts (preserved)
      fontFamily: {
        sans:    ['var(--font-manrope)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },

      letterSpacing: {
        'tighter-2': '-0.04em',
        'tighter-3': '-0.05em',
      },

      boxShadow: {
        // Premium glows — warm rather than cold
        'primary-glow':   '0 8px 28px rgba(232, 93, 4, 0.22)',
        'primary-soft':   '0 8px 28px rgba(232, 93, 4, 0.12)',
        'secondary-glow': '0 8px 28px rgba(1, 116, 31, 0.22)',
        'card-soft':      '0 12px 32px rgba(15, 15, 15, 0.06), 0 2px 6px rgba(15, 15, 15, 0.04)',
        'card-strong':    '0 24px 60px rgba(15, 15, 15, 0.10), 0 4px 10px rgba(15, 15, 15, 0.04)',
      },

      backgroundImage: {
        'cream-gradient': 'linear-gradient(135deg, #fff5ec 0%, #faf7f0 50%, #f1f8f4 100%)',
        // Single source of truth for green surfaces — derived from the navbar green (#01741f).
        'green-hero':     'linear-gradient(135deg, #01741f 0%, #01741f 100%)',
        'ink-glow':       'radial-gradient(ellipse at 80% 10%, rgba(232,93,4,0.12) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(45,139,85,0.10) 0%, transparent 55%)',
      },

      transitionTimingFunction: {
        'out-quart':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      animation: {
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'marquee':    'marquee 32s linear infinite',
      },

      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.55', transform: 'scale(0.85)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: (u: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
      });
    },
  ],
};

export default config;
