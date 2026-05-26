import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary:   { DEFAULT: '#e85d04', hover: '#ff7a2f', pressed: '#c44b00' },
        secondary: { DEFAULT: '#2d8b55', hover: '#3dad6c', pressed: '#1f6b3e' },
        orange: {
          50:  '#fff8f4', 100: '#ffebd9', 200: '#ffcfa6', 300: '#ffb27a',
          500: '#e85d04', 600: '#c44b00',
        },
        green: {
          50:  '#f5fbf7', 100: '#d7f0e3', 200: '#a9d9bf', 300: '#6cbd97',
          nav: '#01741f', 500: '#2d8b55', 600: '#1f6b3e',
        },
        gold: { 50: '#fdf3e0', 400: '#f5c842', 600: '#c49a10', 900: '#7a4f00' },
        warm:  { light: '#f5efe5', DEFAULT: '#ecdec1', dark: '#d4c5a8' },
        neutral: {
          0:   '#ffffff',
          50:  '#f9f9f7',
          100: '#e0efeb',
          200: '#d9d7d1',
          400: '#989890',
          600: '#5c5a55',
          800: '#2b2a27',
          900: '#111111',
        },
        // Surfaces (semantic aliases)
        background: '#ffffff',
        foreground: '#111111',
        muted: '#5c5a55',
        subtle: '#989890',
        border: '#d9d7d1',
      },
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
        'primary-glow': '0 6px 24px rgba(0, 143, 49, 0.25)',
        'primary-soft': '0 6px 24px rgba(0, 143, 49, 0.12)',
      },
      backgroundImage: {
        'cream-gradient': 'linear-gradient(135deg, #fff8f4 0%, #fff 50%, #f5fbf7 100%)',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-smooth':'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.55', transform: 'scale(0.85)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
