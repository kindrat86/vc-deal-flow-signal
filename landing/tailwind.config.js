/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Action color — Brunson-style high-contrast orange for primary CTAs
        signal: {
          400: '#ff8c4d',
          500: '#ff6b1a',
          600: '#e85a0c',
        },
        dark: {
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      keyframes: {
        'cta-pulse': {
          '0%, 100%': { boxShadow: '0 12px 32px rgba(255, 107, 26, 0.35), 0 0 0 0 rgba(255, 107, 26, 0.55)' },
          '50%':      { boxShadow: '0 18px 44px rgba(255, 107, 26, 0.55), 0 0 0 12px rgba(255, 107, 26, 0)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'proof-tick': {
          '0%':   { transform: 'translateY(110%)', opacity: '0' },
          '10%':  { transform: 'translateY(0)',    opacity: '1' },
          '85%':  { transform: 'translateY(0)',    opacity: '1' },
          '100%': { transform: 'translateY(-110%)', opacity: '0' },
        },
      },
      animation: {
        'cta-pulse':   'cta-pulse 2.4s ease-in-out infinite',
        'fade-in-up':  'fade-in-up 0.4s ease-out both',
        'proof-tick':  'proof-tick 5s ease-in-out',
      },
    },
  },
}
