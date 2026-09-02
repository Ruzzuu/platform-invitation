/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: 'rgb(var(--color-cream, 255 255 255) / <alpha-value>)',
        'cream-dark': 'rgb(var(--color-cream-dark, 255 240 246) / <alpha-value>)',
        blush: 'rgb(var(--color-blush, 249 168 212) / <alpha-value>)',
        'blush-dark': 'rgb(var(--color-blush-dark, 236 72 153) / <alpha-value>)',
        'blush-light': 'rgb(var(--color-blush-light, 243 208 224) / <alpha-value>)',
        sage: 'rgb(var(--color-sage, 143 185 150) / <alpha-value>)',
        'sage-dark': 'rgb(var(--color-sage-dark, 106 155 120) / <alpha-value>)',
        dark: 'rgb(var(--color-dark, 0 0 0) / <alpha-value>)',
        'warm-gray': 'rgb(var(--color-warm-gray, 138 126 116) / <alpha-value>)',
        mahogany: 'rgb(var(--color-mahogany, 64 24 1) / <alpha-value>)',
        ivory: 'rgb(var(--color-ivory, 239 239 240) / <alpha-value>)',
        gold: '#EC4899',
        'gold-dark': '#D4318A',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        script2: ['"Dancing Script"', 'cursive'],
        script3: ['"Pinyon Script"', 'cursive'],
      },
      animation: {
        'fade-up': 'fadeInUp 0.8s ease both',
        'spin-slow': 'spin 4s linear infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgb(var(--color-blush, 249 168 212) / .5)' },
          '70%, 100%': { boxShadow: '0 0 0 20px rgb(var(--color-blush, 249 168 212) / 0)' },
        },
        floatSlow: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}
