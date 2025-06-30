/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'google-blue': {
          DEFAULT: '#4285F4', // Often corresponds to the 500 shade
          '100': '#E8F0FE',
          '500': '#4285F4',
          '700': '#1A73E8',
        },
        'google-green': {
          DEFAULT: '#34A853',
          '100': '#E6F4EA',
          '500': '#34A853',
          '700': '#1E8E3E',
        },
        'google-yellow': {
          DEFAULT: '#FBBC05',
          '100': '#FEF7E0',
          '500': '#FBBC05',
          '700': '#F9AB00',
        },
        'google-red': {
          DEFAULT: '#EA4335',
          '100': '#FCE8E6',
          '500': '#EA4335',
          '700': '#D93025',
        },
        'google-gray': {
          DEFAULT: '#5F6368', // Default to secondary text color
          '50': '#F8F9FA',   // Page background alt
          '200': '#DADCE0',  // Borders
          '600': '#5F6368',  // Text Secondary
          '800': '#202124',  // Text Primary
        }
      }
    },
  },
  plugins: [],
}
