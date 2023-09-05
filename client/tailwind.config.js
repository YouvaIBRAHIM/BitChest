import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', ...defaultTheme.fontFamily.sans],
        'inter': ['Inter', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        signal: {
          '0%, 20%, 40%, 60%, 80%, 100%': { 
            backgroundColor:  '#eab308'
          },
          '10%, 30%, 50%, 70%, 90%': { 
            backgroundColor: "transparent" 
          }
        }
      },
      animation: {
        signal: 'signal 3s ease-in-out',
      }
    },
    minWidth: {
      '1/3': '33%',
    },
    maxWidth: {
      '1/3': '33%',
    },
    minHeight: {
      '200': '200px',
      '500': '500px',
    }
  },
  plugins: [],
}

