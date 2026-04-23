# 2026-04-24 — TinyMCE 4 self-hosted editor

> version: 0.1.15

## ✨ feat(admin) — TinyMCE 4 (LGPL-2.1) editor 통합

textarea 기반 MDX 편집기를 TinyMCE 4 (Tistory KEDITOR 와 동일 엔진) 로 교체. self-host 라 API key 불필요.

### deps

- `tinymce@^4.9.11`
- `@tinymce/tinymce-react@^3.14.0`

### 자산 self-host

- `public/tinymce/` — `node_modules/tinymce/*` 전체 복사 (~10MB, gitignored)
- `public/tinymce/langs/ko_KR.js` — `KEDITOR-0.7.21/langs/ko_KR.min.js` 복사
- `public/tinymce/LICENSE` — KEDITOR LGPL-2.1 attribution
- `package.json scripts.setup:tinymce` — 사용자 환경에서 재생성 명령
- `.gitignore` — `/public/tinymce/` 추가 (build artifact 취급)

### 구현

`src/components/Admin/EditPostForm.tsx`:

- `dynamic(() => import('@tinymce/tinymce-react').then(m => m.Editor), { ssr: false })` — window 의존성 안전 처리
- `<Editor tinymceScriptSrc="/tinymce/tinymce.min.js" language="ko_KR" language_url="/tinymce/langs/ko_KR.js" skin_url=".../skins/lightgray" theme_url=".../themes/modern/theme.min.js" />`
- `useState(initial.content)` 으로 content 관리, `onEditorChange` → state → form action 클로저
- toolbar: undo/redo / B I U S / forecolor backcolor / align (left/center/right/justify) / bullist numlist / link image hr / charmap emoticons codesample / removeformat / code fullscreen
- plugins: image link lists charmap code codesample emoticons fullscreen hr searchreplace table textcolor visualblocks wordcount
- branding: false, content_style Pretendard

### deslop

- 6번 반복된 `<label><span><input/></label>` 패턴 → `<TextField>` 헬퍼 추출
- `external_plugins: {}` (default 동작) 제거

### 라이선스

LGPL-2.1 — 자유 사용 가능 (상업/사설 OK). 의무: LICENSE 파일 보존 + attribution. 라이브러리 자체 수정 없음 → copyleft 영향 없음.

## 🔧 verification

- `pnpm test` — 47/47 pass (regression 없음)
- `pnpm build` — 통과 (24 routes, `/admin/posts/[slug]/edit` 동적 등록)
- `public/tinymce/{tinymce.min.js, themes/modern/theme.min.js, skins/lightgray/, plugins/, langs/ko_KR.js, LICENSE}` 모두 존재
- architect APPROVE — closure 기반 content submission 이 TinyMCE-React 의 canonical 패턴

## 🚧 사용자 후속 작업

- `pnpm setup:tinymce` 1회 실행 (CI 또는 신규 clone 시)
- 실제 owner 로그인 후 `/admin/posts/{slug}/edit` 에서 editor 시각 확인 (필자가 dev server 통한 visual smoke 미실행)

## 후속 작업

- KEDITOR 의 한국어 plugin (kImage / kPaste 등) 은 Tistory CDN 종속이라 재사용 불가 — 표준 TinyMCE plugin 만 활성
- TinyMCE 5/6 마이그레이션은 별도 PR (라이선스/UI 변경 큼)
