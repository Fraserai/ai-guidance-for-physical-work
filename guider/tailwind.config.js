/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0D1117',
        panel: '#151B23',
        panelSoft: '#1E2630',
        text: '#F6F8FA',
        muted: '#9FA9B6',
        border: '#263241',
        safety: '#FF6200',
        success: '#22C55E',
        danger: '#EF4444'
      }
    }
  },
  plugins: []
};
