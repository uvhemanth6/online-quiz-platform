// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Crucial for Tailwind to scan your React files
  ],
  theme: {
    extend: {
      colors: {
        // Define a custom color palette for the quiz platform
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Main primary color
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcffe6',
          200: '#bbf7d0',
          300: '#86efad',
          400: '#4ade80',
          500: '#22c55e', // Success/Accent color
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#0c3d22',
        },
        accent: '#f97316', // A vibrant accent color (orange-500)
        info: '#3b82f6',   // Blue for informational messages
        warning: '#f59e0b', // Yellow for warnings
        danger: '#ef4444',  // Red for errors/danger
        dark: '#1f2937',    // Dark gray for text/backgrounds
        light: '#f9fafb',   // Light gray for backgrounds
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // If you installed this plugin, keep it here.
  ],
}
