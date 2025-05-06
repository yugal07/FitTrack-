/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // Primary brand colors
          primary: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1', // indigo-500
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
          },
          // Secondary brand colors - using teal
          secondary: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
          // Accent colors - using amber for highlights
          accent: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          // Success/error/warning colors
          success: {
            light: '#d1fae5',
            DEFAULT: '#10b981',
            dark: '#065f46',
          },
          error: {
            light: '#fee2e2',
            DEFAULT: '#ef4444',
            dark: '#991b1b',
          },
          warning: {
            light: '#fef3c7',
            DEFAULT: '#f59e0b',
            dark: '#92400e',
          },
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
          heading: ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        },
        // Custom animation durations
        animation: {
          'spin-slow': 'spin 3s linear infinite',
        },
        // Custom box shadows
        boxShadow: {
          'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          'sharp': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        // Custom screen sizes
        screens: {
          'xs': '475px',
          '3xl': '1920px',
        },
      },
    },
    plugins: [],
  }