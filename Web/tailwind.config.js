const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons")
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
      },
      keyframes: {
        grow: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(2)' },
        }
      },
      animation: {
        grow: 'grow 1s ease-in-out infinite',
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections('all'),
    }),
  ],
}

