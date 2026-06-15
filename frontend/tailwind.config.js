/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── MIDNIGHT BLACK + EMERALD GREEN ──────────────────
        primary: {
          DEFAULT: '#10B981',  // Emerald 500
          dark:    '#059669',  // Emerald 600
          light:   '#34D399',  // Emerald 400
        },
        secondary: {
          DEFAULT: '#6EE7B7',  // Emerald 300
          dark:    '#34D399',  // Emerald 400
        },
        accent: {
          DEFAULT: '#A7F3D0',  // Emerald 200
        },
        bg: {
          dark:  '#030712',
          light: '#F9FAFB',
        },
        text: {
          dark:  '#ECFDF5',
          light: '#0F172A',
        },
        surface: '#0C1A14',
        iron:    '#111F18',
        zinc:    '#1C2E24',
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'premium':       '0 4px 24px rgba(0,0,0,0.7)',
        'premium-hover': '0 8px 40px rgba(0,0,0,0.8)',
        'green':         '0 0 24px rgba(16,185,129,0.35)',
        'green-hover':   '0 0 40px rgba(16,185,129,0.55)',
      },
    },
  },
  plugins: [],
}
