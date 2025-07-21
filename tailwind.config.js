/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@protoku/design-system/dist/**/*.{js,mjs}",
    "./node_modules/@protoku/design-system/src/**/*.{ts,tsx}",
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

