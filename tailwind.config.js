/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cage: {
          wood: '#D4A574',
          hay: '#F4E4B8',
        },
      },
      fontFamily: {
        game: ['Comic Sans MS', 'cursive'],
      },
    },
  },
  plugins: [],
}

