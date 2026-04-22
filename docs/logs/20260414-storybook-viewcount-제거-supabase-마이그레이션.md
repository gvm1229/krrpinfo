# 2026-04-14 — Storybook & 조회수 제거, Supabase 마이그레이션

> version: 0.1.3

## 🔥 delete

- Storybook 완전 제거 (`.storybook/`, `src/stories/`, `generate-stories` 스크립트)
- 조회수 기능 제거 (Upstash Redis, ViewCounter, ViewReporter, viewcount API)
- Blog 컴포넌트 `views` prop 제거, SiteFooter ViewCounter 제거
- Dead dependency 제거 (gray-matter, postcss-cli, npm-check-updates, unist-util-visit)

## ✨ feat(supabase)

- Contentlayer2 → Supabase 마이그레이션
  - `@mdx-js/mdx` 런타임 MDX 렌더링 + `@shikijs/rehype` 코드 하이라이팅
  - Supabase posts 테이블 기반 콘텐츠 관리
  - remark-gfm 3.0.1 → 4.0.1 업그레이드
  - HTML 기반 ToC 추출 (기존 인터페이스 호환)
  - MDX 컴포넌트 스타일 CSS 셀렉터 이전
  - CommandMenu prop-threading (서버 → 클라이언트)
- contentlayer2, next-contentlayer2, concurrently, remark, mdast-util-toc 제거

## 🐛 fix(a11y)

- CommandDialog에 숨겨진 DialogTitle 추가 (스크린리더 접근성)
