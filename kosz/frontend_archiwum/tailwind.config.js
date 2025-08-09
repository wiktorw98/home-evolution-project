/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Nowa, profesjonalna i semantyczna paleta kolorów
      colors: {
        'background': '#f8f9fa',      // Bardzo jasny szary, przyjemny dla oka
        'primary': '#2d3748',         // Główny ciemny kolor (dla tła stopki, nagłówków)
        'accent': '#4CAF50',          // Nasz zielony akcent
        'text-main': '#1a202c',       // Główny kolor tekstu (prawie czarny, wysoki kontrast)
        'text-light': '#718096',      // Jaśniejszy tekst dla opisów i podtytułów
      },
      backgroundImage: {
        'hero-pattern': "url('/assets/hero-bg.jpg')",
      },
    },
  },
  plugins: [],
};