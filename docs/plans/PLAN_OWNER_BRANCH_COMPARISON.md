# develop와 feat/owner-ui-overhaul 비교

- 작성일: 2026-10-21
- 범위: 로컬 브랜치에 커밋된 내용만 비교
- 기준: develop `b4d7192`, feat/owner-ui-overhaul `e33b534`
- 현재 작업 폴더의 미커밋 변경은 비교에서 제외

## 확인 순서

1. 두 브랜치의 공통 이력과 변경 파일 확인
2. 관리자 기능, 공개 화면, 접근 제한 관련 코드의 차이 확인
3. 구현된 기능과 준비 중인 화면을 구분해 요약

## 확인 기준

- 주요 차이를 실제 브랜치 코드로 뒷받침
- 문서의 예정 작업을 완료 기능으로 설명하지 않음
- 코드 확인과 실제 실행 검증을 구분

## 비교 결과

- 이력: develop 전용 커밋 0개, feat/owner-ui-overhaul 전용 커밋 13개
- 변경 규모: 파일 54개, 1,775줄 추가, 242줄 삭제; 공개 페이지 경로 이동 포함
- 관리자 화면: 로그인 계정 표시 중심 화면에서 사이드 메뉴와 전체 글·Published·Draft 수 및 최근 수정일을 표시하는 화면으로 확장
- 글 관리: 전체 글 목록, 공개 여부 전환, 기존 글의 제목·설명·태그·검색 키워드·대표 이미지 주소·본문·날짜 수정 추가
- 본문 편집: TinyMCE 4를 사이트에서 직접 제공하도록 구성, 공개 글에 관리자 전용 Edit 링크 추가
- 접근 제한: 기존 Google 로그인·MongoDB 기반 NextAuth 유지, isOwner로 관리자 이메일을 페이지 진입과 저장 처리에서도 확인
- 공개 화면: /seasons 시즌 미래시와 상단 메뉴 추가, 날짜·이미지·색상 태그를 이용한 세로 일정 표시
- 화면 구조: 공개 페이지를 (site) 그룹으로 이동하여 공개 사이트의 상단·하단 메뉴와 관리자 화면 분리; 기존 공개 URL 유지
- 표현 정리: 시즌·브랜드·카카오·태그 색상 공통값, 홈 상단 배경색, 일부 제목 크기 및 YYYY-MM-DD 날짜 형식 적용

## 구현 범위의 한계

- /admin/seasons와 /admin/config는 예정 기능을 설명하는 화면이며 실제 편집 기능 없음
- src/data/timeline.ts의 일정은 고정 데이터이며 관리자 편집이나 데이터베이스 연결 없음
- 글 생성·삭제 및 이미지 업로드 처리는 이번 브랜치 변경에 없음
- public/tinymce는 Git 제외 대상이며 setup:tinymce가 별도 로컬 한국어 파일 경로에 의존
- 커밋 제목과 일지에는 0.1.15로 표기되지만 실제 package.json은 0.1.14

## 근거 파일

아래 경로는 현재 작업 폴더의 미커밋 파일이 아닌 feat/owner-ui-overhaul 커밋의 파일 기준

- app/admin/(authenticated)/layout.tsx 및 page.tsx
- app/admin/(authenticated)/posts/page.tsx 및 actions.ts
- app/admin/(authenticated)/posts/[slug]/edit/actions.ts
- src/components/Admin/EditPostForm.tsx
- src/auth.ts 및 proxy.ts
- app/(site)/layout.tsx 및 seasons/page.tsx
- src/data/timeline.ts, src/styles/globals.css, src/util/utils.ts
- app/admin/(authenticated)/seasons/page.tsx 및 config/page.tsx
- package.json 및 .gitignore

## 검증과 완료

- 완료: Windows의 로컬 Codex에서 git log, git diff, git show로 지정 브랜치의 커밋 내용 비교
- 미실행: 테스트·빌드·브라우저 실행; 요청이 브랜치 내용 비교이므로 실행 검증은 범위에 포함하지 않음
- 확인 범위: 구현 코드와 미구현 화면의 구분; 실제 로그인·저장·화면 표시 및 배포 동작은 증명하지 않음
- 원격 조회 미실행: 원격의 최신 상태와 로컬 브랜치의 일치 여부는 확인하지 않음
- 지식 기록 검토 범위: current-project; 이번 질문과 특정 커밋의 비교만으로 장기 사용자 선호를 추론하지 않고 별도 지식 기록 생략
