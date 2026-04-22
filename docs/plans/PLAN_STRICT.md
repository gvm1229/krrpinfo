# PLAN_STRICT — TypeScript `strict: true` 전환 계획

> Status: **deferred** — `tsconfig.json`은 현재 `strict: false` 유지. 본 문서는 점진적 전환 plan.

## 배경

CLAUDE.md 컨벤션 통합 과정에서 `strict: true` 도입이 결정되었으나, 즉시 전환 시 21개 파일 / **56건의 type 에러**가 발생함이 확인됨. 한 번에 수정하기에는 변경 범위가 크고 regression risk가 있으므로 단계적 전환을 진행한다.

## 전환 단계 (제안)

각 단계는 독립적인 feature branch (`strict/<step-name>`)에서 작업 후 `release` 브랜치로 merge.

### Phase 1 — 기반 정리 (선행 조건)

- [ ] `react-scroll`: `@types/react-scroll` 추가 또는 `declare module` shim 작성
- [ ] `react-day-picker` v9 prop 정합성 확인 (`Calendar1.tsx` `mode: 'single' + required` 등)
- [ ] `Blog.tsx` `NavigateComponent` ForwardRef vs functional component union 정리

### Phase 2 — `noImplicitAny` 단독 활성화

- [ ] tsconfig: `"noImplicitAny": true` 만 별도 활성화
- [ ] `app/layout.tsx`, `app/page.tsx` binding element 타입 명시
- [ ] `app/youtubers/[channelId]/page.tsx`, `app/youtubers/videos/page.tsx` index signature 추가

### Phase 3 — `strictNullChecks` 단독 활성화

- [ ] `app/actions/couponRedeem.ts`, `handleYTData.ts` undefined narrowing
- [ ] `app/posts/[slug]/page.tsx`, `app/posts/page.tsx` null guard
- [ ] `app/youtubers/**` thumbnail/snippet null guard
- [ ] `src/components/Blog/Blog.tsx` (12건) string undefined → fallback 또는 optional prop
- [ ] `src/components/Card/SimpleLinkCard.tsx` undefined guard

### Phase 4 — 나머지 strict 옵션

- [ ] `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `alwaysStrict` 활성화
- [ ] 새로 발견되는 에러 수정

### Phase 5 — `strict: true` 전체 활성화

- [ ] tsconfig `strict: true`로 전환 + 개별 옵션 제거
- [ ] `npx tsc --noEmit` 0 error 확인
- [ ] AGENTS.md 컨벤션에 strict 강제 명시

## 첫 활성화 시 발견된 에러 분포 (참고)

- 총 **56건 / 21 파일** (2026-04-15 기준)
- 주요 카테고리:
  - `TS18048` possibly undefined (`couponRedeem`, `handleYTData`, youtube thumbnails)
  - `TS2322` null/undefined → string 미할당 (`Blog.tsx` 다수, `layout.tsx`, `page.tsx`)
  - `TS7031` implicit any binding element (`layout.tsx`, `page.tsx`)
  - `TS7053` index signature 누락 (Korean-key 객체 dynamic indexing)
  - `TS7016` declaration 없음 (`react-scroll`)
  - `TS2604`/`TS2786` JSX element type union 충돌 (`Blog.tsx` `NavigateComponent`)
  - `TS2531` Object null possible (`youtubers/[channelId]/page.tsx`)
  - `TS2488` iterator 없음 (`posts/[slug]/page.tsx`)
  - `TS2322` react-day-picker v9 prop 누락 (`Calendar1.tsx`)

## 리스크

- Blog.tsx 단일 파일에 12건 집중 → narrowing/wrapper 작성 시 surface area 큼
- `NavigateComponent` 타입 union이 design-time 결정인지 runtime 결정인지 확인 필요
- 일부 server action은 외부 API 응답 의존이라 zod schema 도입 검토

## 결정 사항

- 본 plan은 reference 용도. 실제 작업 시 user 승인 + 단계별 PR.
- 단계 진행 중 하위 task 변경 시 본 문서를 surgical edit으로 갱신.
