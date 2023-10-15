/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.jsx', './src/*.jsx'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
