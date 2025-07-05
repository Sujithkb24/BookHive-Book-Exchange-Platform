/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Make sure this path matches your project
  theme: {
    extend: {
      keyframes: {
        'move-bg': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'background-move': 'move-bg 10s ease infinite',
      },
      colors: {
        brownLight: '#D2B48C',
        brownDark: '#8B4513',
      },
    },
  },
  plugins: [],
};
