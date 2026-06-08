/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // VALORANT Brand Colors
        'val-red': '#FF4655',
        'val-red-dark': '#C8102E',
        'val-blue': '#0F4C81',
        'val-blue-light': '#53B0F8',
        'val-gold': '#E5C07B',
        'val-dark': '#0F1923',
        'val-darker': '#0A1018',
        'val-panel': '#1A2733',
        'val-border': '#2A3A4A',
        'val-text': '#ECE8E1',
        'val-muted': '#7B8B9A',
      },
      fontFamily: {
        valorant: ['var(--font-valorant)', 'Impact', 'sans-serif'],
        ui: ['var(--font-ui)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-red': 'pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 70, 85, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(255, 70, 85, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { textShadow: '0 0 10px rgba(255, 70, 85, 0.5)' },
          '100%': { textShadow: '0 0 20px rgba(255, 70, 85, 0.9), 0 0 40px rgba(255, 70, 85, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
