/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-color-white': '#eff3f5',
        'theme-color-1': '#aacfd0',
        'theme-color-2': '#79a8a9',
        'theme-color-3': '#1f4e5f'
      }
    },
  },
  plugins: [],
}

