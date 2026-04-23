# 2026-04-23 (cont.) — MDX post editor + typography token

> version: 0.1.14

## ✨ feat(admin) — MDX post editor

- `app/admin/(authenticated)/posts/[slug]/edit/page.tsx` 신규 — `getPostByAnySlug` 로 draft 포함 조회 후 `EditPostForm` 렌더
- `app/admin/(authenticated)/posts/[slug]/edit/actions.ts` 신규 — `saveEdit` server action:
  - `isOwner` gate
  - slug `^[a-z0-9-]+$` 정규식 (대문자 차단 — URL convention)
  - 필드 길이 cap (title 300 / description 1000 / thumbnail 2048 / content 200K)
  - 태그/키워드 개수 cap (각 50)
  - KST 자정 (`T00:00:00+09:00`) 으로 pubDate 파싱 — UTC drift 방지
  - `updateOne` 후 `matchedCount === 0` 명시 throw (race / 삭제된 slug 대응)
  - `revalidatePath('/'/admin/posts/posts/posts/${slug}` 4경로 + `redirect('/admin/posts')`
- `src/components/Admin/EditPostForm.tsx` 신규 — `'use client'` form, `useTransition` + textarea (no new dep)
- `src/lib/queries.ts` — `getPostByAnySlug` 추가 (published filter 없음, editor 전용)
- `app/admin/(authenticated)/posts/page.tsx` + `app/(site)/posts/[slug]/page.tsx` — Edit 링크를 placeholder query (`?edit=`) 에서 실제 라우트 (`/edit`) 로 wire-up

### 테스트 (10건)

- 세션 없음 / 비-owner — Unauthorized
- 잘못된 slug — Invalid slug
- 대문자 slug — Invalid slug (소문자 정책 검증)
- 잘못된 pubDate — Invalid pub_date
- 필드 길이 초과 — Field too long
- 태그 51개 — Too many tags
- `matchedCount: 0` — Post not found, revalidate/redirect 미호출
- 빈 keywords (`',  , '`) → null 변환 검증
- happy path — updateOne 인자 + revalidatePath 4회 + redirect 호출

## 🎨 style(typography) — text-title 토큰 적용

- `tailwind.config.js` 에 이미 정의된 `fontSize.title` (2.5rem) / `subtitle` (1.2rem) 활용
- `app/(site)/posts/[slug]/page.tsx` 포스트 상세 h1 — `tablet:text-5xl` → `tablet:text-title`

## 🛡 validation 적용

- architect APPROVE
- security PASS — MEDIUM advisory (필드 길이 cap) 적용
- code-reviewer REQUEST CHANGES → 모두 해소:
  - HIGH: `updateOne` `matchedCount === 0` throw 추가
  - MEDIUM: pubDate timezone — KST 명시
  - MEDIUM: SLUG_RE 의 `/i` flag 제거
  - MEDIUM: 테스트 5건 추가 (대문자/길이/태그/matchedCount/빈keywords)

## 🔧 verification

- `pnpm test` — 10/10 (saveEdit) + 기존 37 = 47 pass
- `pnpm build` — `/admin/posts/[slug]/edit` route 등록 확인
- `pnpm lint` — clean (수정 파일만)

## 후속 작업 (별도 PR)

- 새 포스트 생성 (`/admin/posts/new`) — 현재는 기존 post 편집만 가능
- MDX preview / Tiptap 등 풍부한 편집 UX
- Phase 4 (Cloudflare + season schema) — 사용자 합의 필요 (USER_TASKS.md)
