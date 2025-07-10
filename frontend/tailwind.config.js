// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        accent: '#f97316',
        info: '#3b82f6',
        warning: '#f59e0b',
        danger: '#ef4444',
        dark: '#1f2937',    // Now properly defined as direct color value
        light: '#f9fafb',
        // Add the full dark palette while keeping direct 'dark' reference
        darkPalette: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937', // Matches your 'dark' value
          900: '#111827',
          950: '#030712'
        }
      },
    },
  },
  plugins: [],
}