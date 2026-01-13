/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{njk,md,html,js}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'Arial', 'sans-serif'],
        display: ['Montserrat', 'Helvetica', 'Arial', 'Lucida', 'sans-serif'],
      },
      colors: {
        'ebcu-blue': {
          DEFAULT: '#003399',
          dark: '#002266',
          light: '#e6ecf5',
        },
        'ebcu-gold': {
          DEFAULT: '#DE9E55',
          dark: '#c48a43',
        },
      },
    },
  },
  plugins: [],
}
