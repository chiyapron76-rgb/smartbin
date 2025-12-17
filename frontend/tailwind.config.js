/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // 👇 เพิ่มตรงนี้ครับ
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
    },
  },
},
  plugins: [],
};
