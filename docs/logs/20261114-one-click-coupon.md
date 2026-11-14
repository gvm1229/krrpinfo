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
