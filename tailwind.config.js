import aspectRatio from '@tailwindcss/aspect-ratio';
import colors from 'tailwindcss/colors';

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
        navy: {
          50: '#e7e9f4',
          100: '#c5cbe9',
          200: '#a3aedd',
          300: '#8090d2',
          400: '#5e73c6',
          500: '#3c56ba',
          600: '#2f4595',
          700: '#233470',
          800: '#16234a',
          900: '#0a1225', // Cor de fundo principal para o tema escuro
        },
        accent: colors.amber, // Usar 'amber' como cor de destaque
      }
    },
  },
  plugins: [
    aspectRatio,
  ],
}
