/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"League Spartan"', 'sans-serif'],
        gochi: ['"Gochi Hand"', 'cursive'],
      },
    },
  },
  plugins: [],
}
