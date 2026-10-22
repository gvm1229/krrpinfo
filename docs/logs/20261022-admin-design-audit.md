# 2026-10-22 — 관리자 디자인·조작 요소 점검

## 📝 docs

- PLAN_ADMIN_DESIGN_AUDIT.md에 사용자 원본 디자인 우선·shadcn 사용 기준, 검사 범위·결과·후속 수정 대응표 기록
- Codex·Windows에서 TypeScript 구문 트리로 관리자 48곳·공개 화면 11곳의 직접 작성 조작 요소와 관리자 confirm 3곳 확인. shadcn 내부 HTML·편집기 연결 요소는 구분
- DESIGN.md의 기존 공개 화면 기준과 CMS 구현 때 추가한 Strapi 팔레트·4px 모서리 출처를 Git 이력으로 대조
- Chrome Preview에서 어두운 화면·편집기 경계 초점 강조 없음·32px 도구 버튼·미디어 창 이름 누락·투명 미디어 버튼 확인. 입력 커서는 표시돼 WCAG 실패로 단정하지 않음. 390px 모의 화면의 폼 전체 가로 넘침 없음, 창 크기 설정 복원
- 콘텐츠 변경·테스트·빌드·배포는 실행하지 않은 읽기 전용 점검. 제품 코드·DESIGN.md와 버전 0.1.25는 유지, 제안한 UI 수정은 미구현

## 🔧 chore — 자체 UI와 Strapi 원본의 지침 범위

- 사용자 명확화에 따라 AGENTS.md·DESIGN.md에 자체 작성 조작 UI의 shadcn 사용과 가져온 Strapi 원본 UI의 교체 금지 명시
- shadcn 내부 HTML·Slate/CodeMirror 내부 편집 요소 유지, 직접 추가한 주변 조작 UI에만 규칙 적용
- 점검 계획과 PR.md에도 출처 확인 후 자체 코드만 수정하는 범위 반영. Codex·Windows에서 문서 diff·Hive 표시 블록 보존 확인, 제품 코드·버전 변경 없음
- 지침·문서 변경으로 테스트·빌드·브라우저 조작·배포는 실행하지 않음
