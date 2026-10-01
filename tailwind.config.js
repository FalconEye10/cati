/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDF9',
        parchment: '#FFF9F6',
        ink: {
          DEFAULT: '#1C1215',
          muted: '#4A3B42',
          subtle: '#7E6B74'
        },
        romance: {
          primary: '#BE123C',
          dark: '#9F1239',
          light: '#FFE4E6',
          champagne: '#FEF3C7',
          palerose: '#FCE7F3'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'soft-glow': '0 0 35px -5px rgba(190, 18, 60, 0.15)',
        'candle': '0 10px 40px -10px rgba(190, 18, 60, 0.12)',
        'wax': '0 6px 20px rgba(159, 18, 57, 0.35)'
      }
    },
  },
  plugins: [],
}
