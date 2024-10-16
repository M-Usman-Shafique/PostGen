/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D1D5DB',
        secondary: '#1F2937',
        darkPrimary: '#000000',
        darkSecondary: '#877EFF',
        darkAccent: '#101012',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
