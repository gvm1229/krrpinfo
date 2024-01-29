/** @type {import('tailwindcss').Config} */
const array100To599 = Array.from(Array(500)).map((_, i) => i + 100);
const object400To2396px = array100To599.reduce((o, key) => ({ ...o, [key]: `${key * 4}px` }), {});
const array0To599 = Array.from(Array(600)).map((_, i) => i + 1);
const object1To2396px = array0To599.reduce((o, key) => ({ ...o, [key]: `${key}px` }), {});
const array0To49 = Array.from(Array(50)).map((_, i) => i + 1);
const object1To50rem = array0To49.reduce((o, key) => ({ ...o, [key]: `${key}px` }), {});

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  blocklist: [
    'container',
    'collapse',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#e30022',
        secondary: '#cc0000',
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      fontSize: {
        title: '2.5rem',
        subtitle: '1.2rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        100: '100',
      },
      height: {
        88: '22rem',
        ...object400To2396px,
      },
      width: {
        88: '22rem',
        ...object400To2396px,
      },
      scale: {
        103: '1.03',
      },
      maxHeight: object400To2396px,
      lineHeight: object1To2396px,
      borderWidth: object1To50rem,
    },
    screens: {
      // default norms
      sm: { min: '0px', max: '1023px' },
      md: { min: '1024px' },
      // custom production norms
      mobile: { max: '720px' },
      tablet: { min: '721px', max: '1240px' },
      desktop: { min: '1241px' },
      // retina: { min: '1921px' },
    },
  },
  plugins: [],
};
