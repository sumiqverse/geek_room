/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#161B2A',
        primary: '#4338CA',
        accent: '#38BDF8',
      }
    },
  },
  plugins: [],
}
