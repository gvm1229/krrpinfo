# Strapi Community 이식 범위

- 기준: Strapi v5.58.0
- 라이선스: LICENSE 파일에 원문 보존, Enterprise ee 디렉터리 사용 없음
- withStrapiSchema.ts: Slate 텍스트 노드의 type: text 정규화를 선별 이식. React 19에서 편집기 루트를 텍스트로 바꾸지 않도록 Editor.isEditor 검사 추가
- 원본: https://github.com/strapi/strapi/blob/v5.58.0/packages/core/content-manager/admin/src/pages/EditView/components/FormInputs/BlocksInput/plugins/withStrapiSchema.ts
- 편집 기술: Slate 0.94.1, Slate React 0.98.4, Slate History 0.93.0, CodeMirror 5, markdown-it
- UI 연결부: Strapi의 인증·미디어·폼 문맥 의존성을 NextAuth·Server Actions·R2에 맞춰 변경
- 호환성: @strapi/design-system 2.2.4는 React 18을 요구하므로 패키지를 강제 설치하거나 React를 하향하지 않음. 기존 Next.js의 React 19에서 관리 화면 구성과 스타일을 맞춘 연결부 사용
- 표·YouTube·접기와 색상·정렬은 이 프로젝트의 Slate 확장으로 구분, Strapi 기본 기능으로 표시하지 않음
