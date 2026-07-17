/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0427FF',
          dark: '#0320cc',
          light: '#e9ebff',
        },
        ink: '#101828',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0) rotate(-0.6deg)' },
          '50%': { transform: 'translateY(-6px) rotate(0.6deg)' },
        },
        talk: {
          '0%, 100%': { transform: 'scale(0.6)', opacity: '0.35' },
          '50%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'pop-in': 'pop-in 0.35s ease-out',
        bob: 'bob 2.6s ease-in-out infinite',
        talk: 'talk 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
