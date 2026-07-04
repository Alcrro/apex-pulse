/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#f0f2f5',
          200: '#d1d5db',
          300: '#9ca3af',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#3d4a61',
          700: '#1e2433',
          800: '#1a1f2e',
          900: '#0f1117',
          950: '#000000',
        },
        orange: {
          400: '#ff7d33',
          500: '#FF5C00',
          600: '#e05200',
        },
        forge: {
          base:     '#000000',
          surface:  '#1a1f2e',
          surface2: '#222839',
          gold:     '#D4B96A',
          text:     '#ffffff',
          muted:    '#9ca3af',
        },
      },
    },
  },
  plugins: [],
}
