# PR: clean-up branch

## 📝 AGENTS.md 프로젝트 구조 map & ship/docs directives

- AGENTS.md 끝부분에 프로젝트 구조 map 섹션 추가 (routes / src / config / assets / docs)
- `.claude/commands/ship.md` 추가 — 향후 commit directive 기준
- `.claude/commands/docs.md` 추가 — 문서 (CHANGES / PR / AGENTS structure) 갱신 directive

## 🔥 Storybook & 조회수 기능 제거

- Storybook 완전 제거 (9 devDeps, 22 파일, ~1,137줄)
- Upstash Redis 조회수 기능 제거 (ViewCounter, ViewReporter, viewcount API)
- Blog views prop 제거, SiteFooter ViewCounter 제거
- Dead dependency 제거 (gray-matter, postcss-cli, npm-check-updates)

## ✨ Contentlayer2 → Supabase 마이그레이션

- contentlayer2 (빌드 타임 MDX) → Supabase + @mdx-js/mdx (런타임 MDX)
- @shikijs/rehype 코드 하이라이팅 (github-light/dark)
- remark-gfm 3.0.1 → 4.0.1
- HTML 기반 ToC 추출 (DashboardTableOfContents 호환)
- MDX 컴포넌트 스타일 → CSS 셀렉터 이전
- CommandMenu 서버 데이터 prop-threading

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
