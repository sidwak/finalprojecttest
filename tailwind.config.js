/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      roboto_mono: ['Roboto_Mono', 'sans-serif'], //sans serif is fallback font
    },
    extend: {
      colors: {
        mbackground: {
          def: '#222222',
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#222222',
        },

        mred: {
          def: '#9d333e',
          50: '#fcf5f4',
          100: '#faeae9',
          200: '#f5d6d6',
          300: '#ecb6b5',
          400: '#e18b8c',
          500: '#d16265',
          600: '#bb434c',
          700: '#9d333e',
          800: '#842d39',
          900: '#722936',
          950: '#3e1319',
        },
        mblue: {
          def: '#5e90f2',
          50: '#f0f4fe',
          100: '#dde7fc',
          200: '#c2d5fb',
          300: '#98baf8',
          400: '#5e90f2',
          500: '#4471ed',
          600: '#2e52e2',
          700: '#263fcf',
          800: '#2536a8',
          900: '#233185',
          950: '#1a2151',
        },
      },
    },
  },
  plugins: [],
}
