export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0a0a0a',
        darkCard: 'rgba(20, 20, 20, 0.65)',
        neonAmber: '#f59e0b',
        neonBlue: '#3b82f6',
        neonOrange: '#ea580c',
      },
      boxShadow: {
        'neon-amber': '0 0 15px rgba(245, 158, 11, 0.5)',
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
