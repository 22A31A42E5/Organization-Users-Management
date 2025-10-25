/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',
        secondary: '#5f6368',
        success: '#34a853',
        warning: '#fbbc04',
        danger: '#ea4335',
      },
    },
  },
  plugins: [],
}
