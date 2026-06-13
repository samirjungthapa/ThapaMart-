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
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
        },
        accent: {
          DEFAULT: '#22D3EE',
          dark: '#06B6D4',
        },
        bg: {
          light: '#FFFFFF',
          dark: '#030712',
        },
        text: {
          light: '#0F172A',
          dark: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'premium-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
