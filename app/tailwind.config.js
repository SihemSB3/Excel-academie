/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette de l'ebook "Ton Guide Excel" : crème + turquoise + bleu marine
        navy: { DEFAULT: '#0a335d', deep: '#072545', light: '#1b4d80' },
        mint: { DEFAULT: '#41c1ba', dark: '#2fa39c' },
        cream: '#f5f0e8',
      },
      fontFamily: {
        display: ['Anton', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'pop': { '0%': { transform: 'scale(.6)', opacity: 0 }, '70%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
        'glow': { '0%,100%': { filter: 'drop-shadow(0 0 0px rgba(65,193,186,0))' }, '50%': { filter: 'drop-shadow(0 0 20px rgba(65,193,186,.55))' } },
        'float': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        'fade-up': 'fade-up .4s ease-out both',
        'pop': 'pop .5s cubic-bezier(.2,.9,.3,1.2) both',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
