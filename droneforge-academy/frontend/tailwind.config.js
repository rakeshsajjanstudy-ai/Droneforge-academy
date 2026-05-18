/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00f5ff',
        'neon-orange': '#ff6b00',
        'neon-purple': '#bf00ff',
        'neon-gold': '#ffd700',
        'neon-green': '#00ff88',
        'dark-bg': '#020408',
        'dark-panel': 'rgba(0,20,35,0.75)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,245,255,0.4), 0 0 40px rgba(0,245,255,0.15)',
        'glow-orange': '0 0 20px rgba(255,107,0,0.5), 0 0 40px rgba(255,107,0,0.2)',
        'glow-purple': '0 0 20px rgba(191,0,255,0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 0.8s ease forwards',
        'scroll-pulse': 'scrollPulse 1.8s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scrollPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
