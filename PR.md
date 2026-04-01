# PR: redeem branch

## ⬆️ Next.js 16 업그레이드 & yarn → pnpm 마이그레이션

- Next.js 14.2 → 16.2.2 (Turbopack 기본 활성화)
- React 18 → 19
- yarn 4 → pnpm 10
- contentlayer → contentlayer2 마이그레이션
- ESLint 8 (.eslintrc.js) → ESLint 9 (eslint.config.mjs flat config)
- Storybook, Radix UI, lucide-react 등 주요 의존성 업데이트
- Next.js 15+ 비동기 API 대응 (headers, params, searchParams)
- react-day-picker v9 API 대응

## ⬆️ Tailwind CSS v4 업그레이드

- Tailwind CSS 3.4 → 4.2.2
- PostCSS 설정 마이그레이션 (@tailwindcss/postcss)
- autoprefixer 제거 (Tailwind v4 내장)
- ESLint → Prettier 전환
- mdx.css @reference 지시문 추가
