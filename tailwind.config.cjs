/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#019B43',
        secondary: '#F7B100',
        tertiary: '#BF1022'
      },
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif']
      }
    }
  },
  plugins: [],
  darkMode: 'class'
}
