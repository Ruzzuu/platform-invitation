/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFFFF',
        'cream-dark': '#FFF0F6',
        blush: '#F9A8D4',
        'blush-dark': '#EC4899',
        sage: '#8FB996',
        'sage-dark': '#6A9B78',
        dark: '#000000',
        'warm-gray': '#8A7E74',
        gold: '#EC4899',
        'gold-dark': '#D4318A',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        script2: ['"Dancing Script"', 'cursive'],
      },
      animation: {
        'fade-up': 'fadeInUp 0.8s ease both',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
