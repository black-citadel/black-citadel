/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@protoku-bv/design-system/dist/**/*.{js,mjs}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['NotoSans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

