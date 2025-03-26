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
          DEFAULT: '#00DC82',
          50: '#E6FFF3',
          100: '#B3FFE0',
          200: '#80FFCD',
          300: '#4DFFBA',
          400: '#1AFFA7',
          500: '#00DC82',
          600: '#00A962',
          700: '#007642',
          800: '#004326',
          900: '#001006',
        },
        dark: {
          DEFAULT: '#0F1115',
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#0F1115',
        },
      },
      keyframes: {
        ping: {
          '75%, 100%': {
            transform: 'scale(1.5)',
            opacity: '0',
          },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '.5',
            transform: 'scale(0.8)',
          },
        },
        slideIn: {
          '0%': { 
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
      },
      animation: {
        ping: 'ping 2s ease-in-out infinite',
        spin: 'spin 1s linear infinite',
        pulse: 'pulse 1.5s ease-in-out infinite',
        slideIn: 'slideIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
