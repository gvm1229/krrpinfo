## Description

카러플 (카트라이더 러쉬플러스) 관련 정보, 공략 및 팁 등 모음 사이트 (정보통)

## Tech Stack

[![React](https://img.shields.io/badge/React-19.2.4-gray?labelColor=222222&style=for-the-badge&logo=React&link=https://react.dev/)](https://react.dev/)

[![Next.js](https://img.shields.io/badge/Next.js-16.2.3-gray?labelColor=d4d4d8&style=for-the-badge&logo=Next.js&logoColor=black&link=https://nextjs.org/)](https://nextjs.org/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.2.2-gray?labelColor=06B6D4&style=for-the-badge&logo=Tailwind+CSS&logoColor=white&link=https://tailwindcss.com/)](https://tailwindcss.com/)

[![Shadcn-UI](https://img.shields.io/badge/Shadcn--UI-radix--primitives-gray?labelColor=black&style=for-the-badge&logo=Shadcn/UI&logoColor=white&link=https://ui.shadcn.com/)](https://ui.shadcn.com/)

[![MDX](https://img.shields.io/badge/MDX-3.1.1-gray?labelColor=fcb32c&style=for-the-badge&logo=MDX&logoColor=black&link=https://mdxjs.com/)](https://mdxjs.com/)

[![MongoDB](https://img.shields.io/badge/MongoDB-driver%206.14-gray?labelColor=47A248&style=for-the-badge&logo=mongodb&logoColor=white&link=https://mongodb.com/)](https://mongodb.com/)

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

NextAuth v5 + Google provider + MongoDB adapter (database session). 단일 owner 이메일 (`AUTH_OWNER_EMAIL`) 만 가입/로그인 허용. 관리 진입점 (`/admin`) 은 sitemap/robots 모두 비공개이며 owner 가 직접 URL 입력해야 접근 가능.

## Testing

`pnpm test` / `pnpm test:coverage` — Vitest + mongodb-memory-server. CI: `.github/workflows/test.yml` (PR to develop/release, push to develop).

## Deployed at:

[![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=krrpinfo&style=for-the-badge&label=Prod+Build)](https://krrpinfo.vercel.app/)

[![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=krrpinfo-dev&style=for-the-badge&label=Dev+Build)](https://krrpinfo-dev.vercel.app/)

DEV BUILD is only accessible to users logged into [vercel.com](https://vercel.com)
