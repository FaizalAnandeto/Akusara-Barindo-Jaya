/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom colors for dark mode
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          text: '#e2e8f0',
          muted: '#64748b'
        },
        // Accent colors for better dark mode support
        accent: {
          emerald: '#059669',
          amber: '#f59e0b',
          rose: '#e11d48'
        }
      }
    },
  },
  plugins: [],
};
