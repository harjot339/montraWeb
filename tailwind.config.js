/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        'custom': 'calc(85vw - 12rem)',
      },
    },
  },
  plugins: [],
};
