/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        backgroundAlt: '#12121a',
        backgroundSoft: '#1a1a25',
        accentBlue: '#3b82f6',
        accentPurple: '#8b5cf6',
        accentGreen: '#10b981',
        accentAmber: '#f59e0b',
        accentRed: '#ef4444',
        foreground: '#e5e7eb',
        muted: '#6b7280',
        card: 'rgba(18, 18, 26, 0.9)',
        cardSoft: 'rgba(26, 26, 37, 0.85)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.65)',
        innerGlow: '0 0 0 1px rgba(148, 163, 184, 0.25)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      backdropBlur: {
        xs: '3px',
      },
    },
  },
  plugins: [],
};
