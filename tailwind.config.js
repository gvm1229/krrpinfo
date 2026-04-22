const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}', './content/**/*.{md,mdx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1534px',
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
        // 시즌 토큰
        season: {
          1: 'var(--s-1)',
          2: 'var(--s-2)',
          3: 'var(--s-3)',
          4: 'var(--s-4)',
          5: 'var(--s-5)',
        },
        // 브랜드 블루
        brand: {
          blue: 'var(--brand-blue)',
          'blue-hover': 'var(--brand-blue-hover)',
          'blue-dark': 'var(--brand-blue-dark)',
        },
        // 카카오 노란색
        kakao: {
          yellow: 'var(--kakao-yellow)',
        },
        // 타임라인 태그 필 8색
        tag: {
          gold: 'var(--tag-gold)',
          green: 'var(--tag-green)',
          blue: 'var(--tag-blue)',
          sky: 'var(--tag-sky)',
          red: 'var(--tag-red)',
          yellow: 'var(--tag-yellow)',
          purple: 'var(--tag-purple)',
          orange: 'var(--tag-orange)',
        },
      },
      borderRadius: {
        xl: '1rem',
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
        sans: ['Pretendard Variable', 'Pretendard', ...fontFamily.sans],
      },
      fontSize: {
        title: '2.5rem',
        subtitle: '1.2rem',
      },
      maxHeight: {
        108: '27rem',
      },
      maxWidth: {
        108: '27rem',
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '104rem',
      },
      zIndex: {
        100: '100',
      },
      height: {
        88: '22rem',
        108: '27rem',
      },
      width: {
        88: '22rem',
        108: '27rem',
      },
      scale: {
        103: '1.03',
      },
    },
    screens: {
      // default norms
      sm: { min: '0px', max: '1023px' },
      md: { min: '1024px' },
      // custom norms
      mobile_only: { max: '720px' },
      tablet_only: { min: '721px', max: '1240px' },
      tablet: { min: '721px' },
      laptop_only: { min: '1241px', max: '1599px' },
      laptop: { min: '1241px' },
      not_desktop: { max: '1599px' },
      desktop: { min: '1600px' },
      // retina: { min: '1921px' },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
