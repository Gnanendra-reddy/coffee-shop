/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fbf8f5',
          100: '#f5eee6',
          200: '#ebdccf',
          300: '#ddc1ad',
          400: '#cba085',
          500: '#bb8161',
          600: '#aa6c4f',
          700: '#8e543e',
          800: '#734434',
          900: '#5e3a2e',
          950: '#341d16',
        },
        amber: {
          500: '#d97706',
          600: '#b45309',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
