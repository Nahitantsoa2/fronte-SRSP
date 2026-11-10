/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F4F8F5',
          100: '#EAF2ED',
          200: '#C5DBCF',
          300: '#8BB6A1',
          400: '#5C9078',
          500: '#34735A',
          600: '#285F4A',
          700: '#1E4D3B',
          800: '#173F2F',
          900: '#123427',
          950: '#0C241B',
        },
        surface: {
          0: '#FFFFFF',
          50: '#F7F9F7',
          100: '#F0F4F1',
          200: '#E2EAE4',
          300: '#CBD8CF',
          400: '#9AA89F',
          500: '#78857D',
          600: '#5B6A61',
          700: '#435249',
          800: '#33423A',
          900: '#26352D',
          950: '#1B2821',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 0 1px rgba(30, 77, 59, 0.06), 0 12px 32px -12px rgba(30, 77, 59, 0.22)',
        'glow-lg': '0 0 0 1px rgba(30, 77, 59, 0.08), 0 24px 48px -18px rgba(30, 77, 59, 0.28)',
        'card': '0 1px 2px rgba(30, 77, 59, 0.04), 0 10px 28px -16px rgba(30, 77, 59, 0.14)',
        'card-hover': '0 2px 4px rgba(30, 77, 59, 0.05), 0 18px 36px -18px rgba(30, 77, 59, 0.20)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease both',
        'fade-in-up': 'fadeInUp 0.5s ease both',
        'slide-in-left': 'slideInLeft 0.4s ease both',
        'slide-in-right': 'slideInRight 0.4s ease both',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
