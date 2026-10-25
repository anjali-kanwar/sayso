/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        plum: { DEFAULT: "#FFDEDE", light: "#FFC4C4" },
        cream: { DEFAULT: "#0B0B0B", light: "#121212" },
        charcoal: "#202020",
      },
    },
  },
  plugins: [],
};