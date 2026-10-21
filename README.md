## Description

카러플 (카트라이더 러쉬플러스) 관련 정보, 공략 및 팁 등 모음 사이트 (정보통)

## Tech Stack

[![React](https://img.shields.io/badge/React-19.2.4-gray?labelColor=222222&style=for-the-badge&logo=React&link=https://react.dev/)](https://react.dev/)

[![Next.js](https://img.shields.io/badge/Next.js-16.2.3-gray?labelColor=d4d4d8&style=for-the-badge&logo=Next.js&logoColor=black&link=https://nextjs.org/)](https://nextjs.org/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.2.2-gray?labelColor=06B6D4&style=for-the-badge&logo=Tailwind+CSS&logoColor=white&link=https://tailwindcss.com/)](https://tailwindcss.com/)

[![Shadcn-UI](https://img.shields.io/badge/Shadcn--UI-radix--primitives-gray?labelColor=black&style=for-the-badge&logo=Shadcn/UI&logoColor=white&link=https://ui.shadcn.com/)](https://ui.shadcn.com/)

[![MDX](https://img.shields.io/badge/MDX-3.1.1-gray?labelColor=fcb32c&style=for-the-badge&logo=MDX&logoColor=black&link=https://mdxjs.com/)](https://mdxjs.com/)

구조화한 콘텐츠는 Supabase PostgreSQL에, 직접 관리하는 이미지는 Cloudflare R2에 저장한다. 관리자 화면은 Strapi Community의 편집 기술·선별 소스·화면 규칙을 사용하며 별도 Strapi 서버는 실행하지 않는다.

[![NextAuth](https://img.shields.io/badge/NextAuth.js-v5--beta-gray?labelColor=8a2be2&style=for-the-badge&logo=Auth0&logoColor=white&link=https://authjs.dev/)](https://authjs.dev/)

## Dev Stack

[![Node.js](https://img.shields.io/badge/Node.js-%5E22.x-gray?labelColor=339933&style=for-the-badge&logo=Node.js&logoColor=white&link=https://nodejs.org/en)](https://nodejs.org/en)

[![pnpm](https://img.shields.io/badge/pnpm-10.33-gray?labelColor=F69220&style=for-the-badge&logo=pnpm&logoColor=white&link=https://pnpm.io/)](https://pnpm.io/)

[![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.8-gray?labelColor=3178C6&style=for-the-badge&logo=TypeScript&logoColor=white&link=https://www.typescriptlang.org/)](https://www.typescriptlang.org/)

[![Vitest](https://img.shields.io/badge/Vitest-4.1-gray?labelColor=6E9F18&style=for-the-badge&logo=Vitest&logoColor=white&link=https://vitest.dev/)](https://vitest.dev/)

## Constrained Dependency Upgrades

These dependencies must not be upgraded, and must be kept in their respective versions in order for the application to function.

![remark-gfm](https://img.shields.io/badge/remark--gfm-4.0.1-dc2626?style=for-the-badge)

## Auth

NextAuth v5 Credentials + JWT를 사용한다. 환경변수로 등록한 단일 운영자의 ID·비밀번호만 허용하며 비밀번호는 scrypt 해시로 검증한다. `/admin`은 공개 메뉴·검색·사이트맵에 표시하지 않는다. 공개 회원가입과 Google 로그인은 제공하지 않는다.

## CMS 시작

1. `.env.example`을 참고해 `.env.local`에 Supabase·R2·운영자 설정을 등록한다.
2. `pnpm cms:password`로 비밀번호 해시를 만든다.
3. `pnpm cms:db:apply`로 초기 SQL을 적용한다.
4. `pnpm cms:migrate -- --input backup/legacy-cms.json --dry-run`으로 기존 데이터와 이미지 누락을 확인한다. 확인 뒤 `--apply`로 이전한다. 기존 데이터는 덮어쓰지 않는다.
5. `pnpm dev`를 실행하고 `/admin/login`에 접속한다.

설계와 검증 범위는 [CMS 계획](docs/plans/PLAN_CMS_MVP.md), [데이터 대응표](docs/plans/CMS_DATA_MAP.md), [디자인 기준](DESIGN.md)을 참고한다. 실제 연결과 운영 전환 절차는 로컬 `USER_TASKS.md`에 기록한다. 새 글은 Draft이며 Published 글을 저장하면 다음 공개 조회에 반영된다.

## Testing

`pnpm test` / `pnpm test:coverage`는 실제 운영자 검사·서버 변경·공개 조회·미디어 권한·본문 표시·이전 로직을 검사한다. `pnpm exec tsc --noEmit --incremental false`, `pnpm build`로 타입과 빌드를 확인한다. CI는 Windows·Linux Node 24에서 테스트·타입·이전 명령 시작을 확인한다. 실제 Supabase·R2 연결과 브라우저 입력은 별도로 검증한다.

## Deployed at:

[![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=krrpinfo&style=for-the-badge&label=Prod+Build)](https://krrpinfo.vercel.app/)

[![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=krrpinfo-dev&style=for-the-badge&label=Dev+Build)](https://krrpinfo-dev.vercel.app/)

DEV BUILD is only accessible to users logged into [vercel.com](https://vercel.com)
