/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: { DEFAULT: "#4F2339", light: "#6B3350" },
        cream: { DEFAULT: "#F0D9C5", light: "#FAF3EC" },
      },
    },
  },
  plugins: [],
}