# 2026-11-14 — 원클릭 쿠폰 사용과 프로젝트 skill 설치

> version: 0.1.28 · feat/cn-preview-coupon

## ✨ feat — 원클릭 쿠폰 사용 (0.1.28)

- `RedeemCard` 쿠폰마다 `RedeemCouponButton` 추가. 저장한 회원번호로 `handleUnified` 호출, 결과 문구 표시
- 성공 또는 Nexon `해당 쿠폰 완료 상태` 응답 시 회원번호별 사용 완료 기록(`krrpinfo:redeemed:<회원번호>`), 버튼 비활성
- 회원번호가 없으면 `redeem.required` 안내. `RedeemContainer`에 삭제 버튼 추가, 동작 없던 제출 버튼과 `console.log` 제거. Enter는 저장
- `handleUserLookup`·`handleRedeem` 비공개화, 회원번호·쿠폰 입력 검증, 연결 실패 시 내부 오류 대신 고정 문구와 `[couponRedeem::handleUnified]` 로그
- `cms:db:apply`가 `supabase/migrations/*.sql`을 버전 순서대로 적용. `redeem.delete`·`redeem.done` 문구 migration 추가

## 🔧 chore

- `impeccable`·`web-artifacts-builder`·`modern-web-guidance` skill을 `.claude/skills/`에 설치. 사용자 전역 설치본 복사
- `.claude/launch.json`에 `pnpm dev` 미리보기 설정 추가

## 검증

- Vitest 36개, TypeScript, Prettier, `cms:db:apply --help` 통과
- 로컬 `/redeem`은 `.env.local`의 Supabase에서 site 설정 조회 실패로 HTTP 500. 코드 변경과 무관한 연결 문제로 판단, 실제 DB는 조회·변경하지 않음
- 실제 Nexon 호출과 새 migration 적용은 미실행

## 📝 docs — 디자인 개편 P0 기준점

- Fable 5.2 advisor 진단과 P0~P8 계획을 TODO에 반영. 결정: 관리자 색 공개 화면과 통일, 홈 상단 코드 고정, 2단계 인증 보류
- 복구된 Supabase로 로컬 화면 정상. `/redeem` 회원번호 저장·삭제 흐름 확인, 새 문구는 migration 미적용으로 빈칸
- 수정 전 캡처 12장을 `.hive/runtime/design-overhaul/before/`에 보존 (Git 제외)
- 기존 홈 "향후 시즌 미리보기" hero와 `/seasons` "시즌 미래시"가 목표 D와 겹침. 이미지 lazy load placeholder 부재로 스크롤 전 빈칸

## 🎨 style — 디자인 개편 P1 token·여백 (0.1.29)

- container 좌우 여백을 모바일 16px·tablet 24px·laptop 32px로 변경. Tailwind v4 호환 config의 breakpoint 객체가 적용되지 않아 `@utility container`로 관리. 390px 본문 폭 326px → 358px
- 성공·주의 글씨 token(`--success-text`·`--warning-text`, Radix Green 11·Amber 11) 추가, 쿠폰 결과 문구에 적용
- 글 본문 읽기 폭 `max-w-reading`(45rem) token 추가. 적용은 P4
- 브라우저 기본 UI: `color-scheme`(CSS·viewport meta), `accent-color`, 텍스트 선택 색, 입력 커서 색, 대비 3:1 이상 스크롤바 색
- DESIGN.md Colors·Layout 갱신

### 검증

- 390·768·1280px에서 container 여백 16·24·32px 측정, 가로 넘침 없음. 밝은·어두운 테마에서 `color-scheme` 전환 확인
- impeccable detector 지적 0개, TypeScript·Prettier·Vitest 통과

## ✨ feat — 디자인 개편 P2 헤더와 메뉴 (0.1.30)

- 데스크톱 메뉴를 1241px → 1024px(`md`)부터 표시. 태블릿 가로·작은 노트북에서 메뉴가 햄버거로 숨던 문제 해결
- 하위 메뉴를 hover 전용 → shadcn `DropdownMenu` 버튼으로 변경. 클릭·Enter·Space·방향키·Esc·바깥 클릭 지원. 상위 링크는 그대로 이동
- 모바일 메뉴 하위 항목은 들여쓰기로 구분
- 1024px 미만 헤더에 쿠폰 바로가기 버튼(모바일 아이콘만, tablet부터 글씨) 추가. 햄버거는 중립색으로 바꿔 쿠폰을 주 동작으로 구분
- 헤더 높이 80px → 64px, 좌우 여백을 P1 container 여백과 맞춤

### 검증

- 390·768·1024px, 밝은·어두운 테마에서 헤더 64px, 가로 넘침 없음, 메뉴 표시 구간 확인. 모바일 메뉴 열기와 `aria-expanded` 확인
- 현재 CMS 메뉴에 하위 항목이 없어 dropdown은 실제 데이터로 미확인. 타입 검사만 통과
- impeccable detector 지적 0개, TypeScript·Prettier·Vitest 36개 통과

## ✨ feat — 디자인 개편 P3 홈 재구성 (0.1.31)

- 홈 상단을 코드 고정: 미래시 hero(사이트 설정 값)와 유효 쿠폰 패널(`RedeemCard` 재사용, 원클릭 사용 가능)을 laptop 3:2 배치. hero·일정은 CMS 섹션이 Published일 때만 표시
- hero 이미지에 크기 지정·16:9 고정, 링크를 단색 버튼으로 변경
- 주요 일정 카드: 파란 큰 카드 → 경계선 카드, D-day 숫자만 브랜드 색. 모바일 2열로 바꿔 홈 길이 5887px → 약 5300px
- 홈 타임라인은 최근 3개 그룹만 표시하고 `시즌 미래시` 전체 보기 링크 추가 (`Timeline` `limit` prop)
- 링크·글·타임라인 섹션은 기존처럼 CMS 순서

### 검증

- 390·1280px, 밝은·어두운 테마에서 가로 넘침 없음. 쿠폰 0개 빈 상태 확인
- impeccable detector 지적 0개, TypeScript·Prettier 통과

## ✨ feat — 디자인 개편 P4 읽기 화면 (0.1.32)

- 글 본문 폭을 `max-w-reading`(720px)으로 제한하고 목차와 함께 가운데 정렬. 1280px에서 한 줄 약 38자
- 1240px 미만에서 사라지던 목차를 본문 위 `details` 접힘 목차로 제공 (`DashboardTableOfContents` `hideTitle` prop)
- 글·카드 이미지에 `width`·`height` 지정과 `bg-muted` 자리 표시. 타임라인 이미지 상자에도 자리 표시
- 운영자 Edit 링크를 shadcn Button으로 변경, 목차 sticky 위치를 64px 헤더에 맞춤

### 검증

- 1280px 본문 720px·목차 표시, 390px 접힘 목차 표시, 두 테마 가로 넘침 없음
- impeccable detector 지적 0개, TypeScript·Prettier 통과
