/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        wa: {
          teal: '#008069',
          darkteal: '#075E54',
          lightgreen: '#d9fdd3',
          chatbg: '#efeae2',
          cream: '#f0ece2',
          gray: '#f0f2f5',
          text: '#111b21',
          muted: '#667781',
          bluecheck: '#53bdeb',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.25s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
