/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surface2: 'rgb(var(--color-surface2) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        accent1: '#6C63FF',
        accent2: '#00D4AA',
        accent3: '#FF6B9D',
        accent4: '#FFB84C',
        accent5: '#4FC3F7',
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
        },
        // Maps to utilities `text-text-primary` and `text-text-muted`
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
