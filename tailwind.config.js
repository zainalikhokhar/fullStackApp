/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs}", "./resources/**/*.{html,js}"],
  theme: {
    minHeight: { //adding our own classes
      'screen': '100vh',
    },
    extend: {},
  },
  plugins: [],
}
