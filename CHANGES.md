# Changes

## 0.1.1

- Next.js 14.2 → 16.2.2 업그레이드 (Turbopack 기본 활성화)
- React 18 → 19 업그레이드
- yarn 4 → pnpm 10 패키지 매니저 마이그레이션
- contentlayer → contentlayer2 마이그레이션
- ESLint 8 → 9 (flat config) 마이그레이션
- Storybook 8.0 → 8.6, Radix UI, lucide-react 등 의존성 업데이트
- Next.js 15+ 비동기 API 대응 (headers, params, searchParams await)
- react-day-picker v8 → v9 API 변경 대응
- next-themes v0.4 타입 import 경로 수정
- request.ip 제거 대응 (Next.js 16)
- revalidatePath 렌더 내 호출 제거 (Next.js 16)

## 0.1.3

- Storybook 완전 제거 (.storybook/, src/stories/, generate-stories 스크립트)
- 조회수 기능 제거 (Upstash Redis, ViewCounter, ViewReporter, viewcount API)
- Blog 컴포넌트 views prop 제거, SiteFooter ViewCounter 제거
- Dead dependency 제거 (gray-matter, postcss-cli, npm-check-updates, unist-util-visit)
- Contentlayer2 → Supabase 마이그레이션
  - @mdx-js/mdx 런타임 MDX 렌더링 + @shikijs/rehype 코드 하이라이팅
  - Supabase posts 테이블 기반 콘텐츠 관리
  - remark-gfm 3.0.1 → 4.0.1 업그레이드
  - HTML 기반 ToC 추출 (기존 인터페이스 호환)
  - MDX 컴포넌트 스타일 CSS 셀렉터 이전
  - CommandMenu prop-threading (서버 → 클라이언트)
- contentlayer2, next-contentlayer2, concurrently, remark, mdast-util-toc 제거

## 0.1.2

- Tailwind CSS 3.4 → 4.2.2 업그레이드
- PostCSS 설정 마이그레이션 (@tailwindcss/postcss)
- autoprefixer 제거 (Tailwind v4 내장)
- ESLint → Prettier 전환
- mdx.css @reference 지시문 추가 (Tailwind v4 대응)
