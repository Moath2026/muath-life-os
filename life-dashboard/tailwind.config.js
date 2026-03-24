/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Mission Control v2 Space Palette ──────────────────────
        space:      '#030712',          // deep space black
        spaceAlt:   '#060d1f',          // dark navy
        spaceSoft:  '#0a1628',          // slightly lighter navy
        spaceCard:  'rgba(255,255,255,0.04)',

        // Neon accent colors
        cyan:        '#06b6d4',
        cyanLight:   '#22d3ee',
        cyanDim:     'rgba(6,182,212,0.15)',

        // Keep legacy names for backward compat
        accentBlue:        '#3b82f6',
        accentPurple:      '#7c3aed',
        accentPurpleLight: '#a78bfa',
        accentGreen:       '#10b981',
        accentGreenLight:  '#34d399',
        accentAmber:       '#f59e0b',
        accentRed:         '#ef4444',
        accentCyan:        '#06b6d4',

        // Semantic tokens
        background:    '#030712',
        backgroundAlt: '#060d1f',
        backgroundSoft:'#0a1628',
        foreground:    '#f1f5f9',
        muted:         '#64748b',
        card:          'rgba(255,255,255,0.04)',
        cardSoft:      'rgba(255,255,255,0.06)',
      },

      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        mono:    ['Space Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      boxShadow: {
        soft:        '0 20px 60px rgba(0,0,0,0.7)',
        innerGlow:   '0 0 0 1px rgba(6,182,212,0.3)',
        glow:        '0 0 20px rgba(6,182,212,0.35), 0 0 60px rgba(6,182,212,0.08)',
        glowSm:      '0 0 10px rgba(6,182,212,0.25)',
        glowPurple:  '0 0 20px rgba(124,58,237,0.35)',
        glowGreen:   '0 0 20px rgba(16,185,129,0.35)',
        glowAmber:   '0 0 20px rgba(245,158,11,0.35)',
        card:        '0 4px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        cardCyan:    '0 0 0 1px rgba(6,182,212,0.15), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(6,182,212,0.08)',
      },

      borderRadius: {
        xl:  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },

      backdropBlur: {
        xs:  '3px',
        '2xl': '40px',
      },

      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow-pulse':  'glow-pulse 2.5s ease-in-out infinite',
        'glow-purple': 'glow-purple 2.5s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'shimmer':     'shimmer 2.5s linear infinite',
        'scan':        'scan 4s linear infinite',
      },

      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(6,182,212,0.2)' },
          '50%':      { boxShadow: '0 0 25px rgba(6,182,212,0.55), 0 0 60px rgba(6,182,212,0.12)' },
        },
        'glow-purple': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(124,58,237,0.2)' },
          '50%':      { boxShadow: '0 0 25px rgba(124,58,237,0.55)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        'scan': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
};
