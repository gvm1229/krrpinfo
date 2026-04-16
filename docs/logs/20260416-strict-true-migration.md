# 2026-04-16 — TypeScript strict: true 전환

> version: 0.1.7

## ♻️ refactor(typescript)

- `tsconfig.json` — `strict: false` → `strict: true` 전환
- 24 파일 / ~50건 type error 수정:
  - `app/actions/couponRedeem.ts` — `responseData.info` undefined narrowing
  - `app/actions/handleYTData.ts` — MongoDB `collection<T>()` generic 추가 + null guard
  - `app/layout.tsx` — `children` binding type + `userAgent` null fallback
  - `app/page.tsx` — `className` binding type + `description` null → undefined
  - `app/posts/[slug]/page.tsx`, `app/posts/page.tsx` — keywords null guard, description null 변환
  - `app/youtubers/**` — thumbnail optional chaining + Korean-key index `as keyof typeof`
  - `src/components/Blog/Blog.tsx` — optional props (`string | undefined`) + `NavigateComponent` → `React.ElementType`
  - `src/components/Calendar/Calendar1.tsx` — react-day-picker v9 `required` prop
  - `src/components/Card/*` — string | undefined fallback (`?? ''`)
  - `src/components/Video/*` — playerRef typing, timestamps undefined guard, state null 허용
  - `src/components/Data/ResponseDisplay.tsx` — response prop null 허용
  - `src/util/db.ts` — `declare global` block 추가
  - `src/lib/markdown.tsx` — react-dom/server ts-expect-error

## 🔧 chore(deps)

- `@types/react-scroll` devDependency 추가
