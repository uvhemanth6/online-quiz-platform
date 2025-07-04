/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Crucial for Tailwind to scan your React files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'), // If you installed this plugin
  ],
}
