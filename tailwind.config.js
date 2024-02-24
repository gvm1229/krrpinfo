/** @type {import('tailwindcss').Config} */

const array100To599 = Array.from(Array(500)).map((_, i) => i + 100);
const object400To2396px = array100To599.reduce((o, key) => ({ ...o, [key]: `${key * 4}px` }), {});
const array0To599 = Array.from(Array(600)).map((_, i) => i + 1);
const object1To2396px = array0To599.reduce((o, key) => ({ ...o, [key]: `${key}px` }), {});
const array0To49 = Array.from(Array(50)).map((_, i) => i + 1);
const object1To50rem = array0To49.reduce((o, key) => ({ ...o, [key]: `${key}px` }), {});

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)'],
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
      tablet: { min: '721px' },
      desktop: { min: '1241px' },
      // retina: { min: '1921px' },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
