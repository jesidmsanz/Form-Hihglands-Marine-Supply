// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem', // móviles
        sm: '2rem',
        md: '2rem',
        lg: '2rem',
        xl: '0',
        '2xl': '0',
      },
    },
    extend: {
      colors: {
        brand: '#0A76BF',
        primary: '#0099FF',
        secondary: '#F5C142',
        'main-color': '#0A76BF',
        'main-blue': '#0A76BF',
        headings: '#324256',
        text: '#000',
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        default: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Liberation Sans',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
