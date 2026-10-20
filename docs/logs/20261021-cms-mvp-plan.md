# 2026-10-21 — 1인용 CMS MVP 계획 보존

## 📝 docs

- `docs/plans/PLAN_CMS_MVP.md`에 대화에서 확정한 수정 계획과 근거 링크 보존
- Strapi 기술·UI 우선 재사용, Next.js·Server Actions·Vercel 유지, Supabase·R2 연결, 관리자 콘텐츠·운영 설정 편집 범위 기록
- 배경음악·유튜버 페이지 제거, 추천 영상 유지, 데이터 이전 및 완료 기준 기록
- 문서만 추가하므로 package.json 버전 변경 없음
- MongoDB·NextAuth 브랜치 목적, 이미 완료된 develop 병합, UI 브랜치의 포함 관계와 CMS 전환 시 재사용 범위 검토 완료. 별도 검토 문서는 역할 종료로 삭제
- 현재 UI 브랜치의 테스트 타입 오류, Windows 복원 진입 조건, 기존 YouTube 변경 함수의 권한 확인 누락과 검증 한계 기록
- 사용자 결정 반영: Google 로그인 제거, NextAuth 기반 자체 로그인과 NextAuth가 관리하는 JWT 세션으로 계획 수정. 단일 운영자의 ID·비밀번호를 쓰는 Credentials 방식은 구현 기본안으로 명시
- `AGENTS.md`에서 영어 질문에 교정문을 자동으로 덧붙이는 규칙과 관련 설명 제거

## 검증

- 현재 Codex·Windows 환경에서 저장 문서와 변경 파일 목록 확인
- 구현·DB 적용·데이터 이전·배포 미실행 — 이번 요청은 계획의 Markdown 보존이며 기능 동작은 검증 범위 밖

## 브랜치 기반 검토 검증

- Codex 로컬·Windows, Node.js 24.13.1·pnpm 10.33.0에서 원격 Git 정보를 갱신하고 MongoDB 브랜치 → develop → 현재 UI 브랜치 포함 관계 확인
- 현재 UI 브랜치에서 `pnpm test:coverage` 7개 파일·47개 검사 통과 — 모의 인증과 임시 로컬 MongoDB 범위이며 실제 Google·운영 DB 연결은 미검증
- 같은 브랜치의 `pnpm exec tsc --noEmit --incremental false` 실패 — `src/__tests__/actions/saveEdit.test.ts:83`부터 10개, `src/__tests__/actions/togglePublished.test.ts:62`부터 4개. `vi.mocked(auth)`가 세션 반환형 대신 `NextMiddleware` 반환형을 사용하여 TS2345 오류 발생
- 빈 DB 연결값으로 Node 별도 실행하여 복원 스크립트의 Windows 진입 조건 문제 재현 — 실제 DB 변경 없음, tsx·다른 운영체제 실행 미검증
- 빌드·브라우저·Vercel·Supabase·R2 시험 미실행 — 브랜치 조사 범위이며 배포·실서비스 동작을 증명하지 않음
- 문서만 변경. 코드 수정·병합·실제 데이터 이전·배포·버전 변경 없음

## 로컬 브랜치 정리

- 사용자 요청에 따라 Codex 로컬·Windows에서 `git fetch origin --no-tags` 후 로컬 `feat/mongo-nextauth`가 `origin/develop`에 포함됨을 다시 확인
- `git branch -d feat/mongo-nextauth` 실행 완료. 로컬 참조 부재, 원격 추적 참조 존재와 현재 작업 브랜치 `feat/owner-ui-overhaul` 확인
- 원격 브랜치 삭제·인증 코드 변경 미실행 — 이번 후속 작업은 인증 요구 수정과 병합된 로컬 브랜치 삭제 범위. 새 인증의 실제 동작은 구현 뒤 검증 필요
- 문서와 Git 참조만 변경하여 자동 테스트·타입 검사 재실행 생략. 앞선 코드 검사 결과를 변경하거나 새 인증의 동작을 증명하지 않음

## 응답 지침 수정 검증

- Codex 로컬·Windows에서 `AGENTS.md`의 영어 교정문 추가 규칙 삭제와 `git diff --check` 확인
- 문서만 변경하여 기능 테스트 미실행. 코드 동작 검증은 이번 변경 범위 밖

## 완료된 브랜치 검토 문서 정리

- 정리 순서: 검토 문서와 CMS 계획 대조 → 역할을 마친 별도 문서 삭제와 참조 정리 → CMS 계획에 없는 보완 후보 제시 → 사용자 승인 후에만 CMS 계획에 반영
- 병합·로컬 브랜치 삭제 기록은 이 일일 기록으로 보존. 인증 변경, 본문 형식 구분, 원문 보존, 최신 MongoDB 원본 사용은 CMS 계획에 이미 포함
- `docs/plans/PLAN_MONGO_NEXTAUTH_REVIEW.md` 삭제 완료. 코드·CMS 계획 변경은 이번 정리 범위 밖

### CMS 계획 보완 항목 — 사용자 승인·반영 완료

1. 구현 전 기존 타입 오류 정리: 앞선 Windows 검사에서 확인한 테스트 파일 두 곳의 오류 14개를 해결하고, 타입 검사와 관련 테스트가 통과하는 상태를 시작 기준으로 지정
2. MongoDB 의존성 제거 완료 조건: 이전 검증 후 조회·저장·영상 처리의 MongoDB 사용처, 연결 모듈·패키지·환경변수, 과거 Google 로그인 설정, `restore:posts`와 복원 도구, MongoDB 전용 테스트·CI 준비 단계를 제거하거나 새 저장 방식에 맞게 교체. 과거 복원 도구의 Windows 문제는 별도 수리하지 않고, 새 이전 도구의 시작·오류 처리를 Windows와 Linux에서 확인
3. 공개 범위·권한 제한 테스트 구체화: Draft가 본문·메타데이터·검색·사이트맵에 나타나지 않는지 검사하고, 미로그인·운영자 아닌 세션·만료 세션으로 글 저장·공개 전환·영상 변경·업로드를 호출하면 거부되는지 검사. 모의 함수의 복제 동작만 검사하지 않고 실제 운영자 확인 함수와 새 조회 함수도 검사

후보 제시 뒤 사용자가 세 항목의 추가를 승인했다. `PLAN_CMS_MVP.md`의 데이터 이전·구현 순서·시작 조건·보안 테스트·완료 기준에 반영했다. 승인 범위는 계획 보완이며 코드 구현은 아직 수행하지 않았다.

- Codex 로컬·Windows에서 삭제 파일 부재, 현재 계획·PR 메모의 삭제 문서 참조 제거, CMS 계획의 수정 전후 SHA256 일치와 `git diff --check` 통과 확인
- 문서 정리만 수행하여 테스트·타입 검사 재실행 생략. 앞선 타입 오류 해결이나 새 인증·DB 동작을 증명하는 검사는 미실행

## CMS 계획 보완 반영 검증

- Codex 로컬·Windows에서 승인된 세 항목과 구현 순서·완료 기준의 대응, 승인 대기 문구 정리와 `git diff --check` 확인
- 문서만 수정하여 기능 테스트·타입 검사 재실행 생략. 기존 타입 오류 해결, MongoDB 제거와 보안 테스트 실행은 구현 단계의 작업이며 이번 변경으로 완료를 주장하지 않음
