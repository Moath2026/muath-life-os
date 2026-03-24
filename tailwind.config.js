/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '375px', // iPhone SE
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#12121a',
          tertiary: '#1a1a25',
          card: '#161622',
        },
        accent: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          green: '#22c55e',
          'green-dim': '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          sky: '#38bdf8',
        },
      },
      boxShadow: {
        'card': '0 1px 1px rgba(0,0,0,0.5), 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-green': '0 0 0 1px rgba(34,197,94,0.1), 0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(34,197,94,0.05), inset 0 1px 0 rgba(34,197,94,0.08)',
        'card-hover': '0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
        'nav': '0 -1px 0 rgba(255,255,255,0.05), 0 -8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'progress': 'progressBar 1s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        progressBar: { from: { width: '0%' }, to: { width: 'var(--progress)' } },
        glowPulse: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
}
