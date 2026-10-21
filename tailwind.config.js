/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wesal: {
          bg: '#faf8f5',
          'dark-bg': '#091214',
          surface: '#ffffff',
          'dark-surface': '#112225',
          card: '#ffffff',
          'dark-card': '#14272a',
          border: '#e7e0d3',
          'dark-border': 'rgba(212, 242, 231, 0.12)',
          text: '#1c1917',
          'dark-text': '#f8fafc',
          muted: '#78716c',
          'dark-muted': '#94a3b8',
          emerald: '#047857',
          'dark-emerald': '#10b981',
          gold: '#b45309',
          'dark-gold': '#facc15',
        },
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          glow: 'rgba(250, 204, 21, 0.25)',
        }
      },
      fontFamily: {
        sans: ['Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
        quran: ['Amiri', 'Scheherazade New', 'serif'],
        heading: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      boxShadow: {
        'emerald-glow': '0 0 25px rgba(16, 185, 129, 0.15)',
        'gold-glow': '0 0 25px rgba(250, 204, 21, 0.2)',
        'soft-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'dark-card': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
