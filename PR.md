# PR: feat/mongo-nextauth branch

## Summary

- `develop` 대비 Supabase 의존성을 제거하고 MongoDB 단일 소스로 posts 데이터 통합
- NextAuth v5 (beta) + Google OAuth + MongoDBAdapter 도입으로 인증 인프라 마련
- 기존 Supabase posts dump 를 Mongo `krrpinfo` database 로 복원하는 일회성 스크립트 제공

## Changes

## ⬆️ Dependency swap

- `@supabase/supabase-js` 제거
- `next-auth@5.0.0-beta.31` + `@auth/mongodb-adapter@^3.11.2` 추가
- `mongodb` 기존 사용 유지

## ♻️ Env schema

- `env.mjs` 와 `.env.example` 에서 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 제거
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` 추가

## ♻️ MongoDB client

- `src/util/db.ts` 에 `clientPromise` named export 추가 (NextAuth adapter 요구사항)
- 기존 `mongoClient()` default export 는 `@deprecated` wrapper 로 호환 유지
- `maxPoolSize`, `serverSelectionTimeoutMS`, `appName` 옵션 적용

## ♻️ Posts queries

- `src/lib/supabase.ts` 삭제, `src/lib/queries.ts` 를 mongodb driver 기반으로 재작성
- `client.db('krrpinfo').collection<PostDoc>('posts')` 명시적 참조
- `pub_date`/`created_at`/`updated_at` Date → ISO string 변환을 `toPost()` 로 일원화
- `getPost`/`getPostMeta` 에 `String(slug)` 강제 변환 추가하여 NoSQL injection 방지
- 모든 export 에 명시적 return type 선언

## ✨ NextAuth v5 + MongoDBAdapter

- `src/auth.ts` — Google provider + MongoDBAdapter + `session.strategy='database'`
- `app/api/auth/[...nextauth]/route.ts` — `handlers` 분해 export

## ✨ Restore script

- `scripts/restore-posts.ts` — `backup/supabase-posts-*.json` → Mongo `krrpinfo.posts` upsert
- `tags` string → `string[]` 정규화, `pub_date` 등 Date 변환
- slug unique index 보장
- `pnpm restore:posts` npm script 등록

## 🙈 .gitignore

- `/backup/` dump 디렉터리 exclusion 추가

## 📝 docs

- AGENTS.md 에 Discord 수신 acknowledgement 규칙 추가

## ✨ Test infrastructure

- 신규 의존성: `vitest@4.1`, `@vitest/coverage-v8`, `vite-tsconfig-paths`, `mongodb-memory-server`
- `vitest.config.ts` — node 환경, `src/__tests__/**/*.test.ts` glob, v8 coverage threshold (lines/functions/statements 80%, branches 70%)
- npm scripts: `test`, `test:watch`, `test:coverage`
- `src/__tests__/` 24개 단위/통합 테스트 (db 3, queries 10, auth 4, restore-posts 7)
- `src/__tests__/helpers/mongo-memory.ts` — mongodb-memory-server 라이프사이클 헬퍼
- 결과: 24/24 pass, statements/branches/functions/lines 모두 100%

## 👷 CI

- `.github/workflows/test.yml` — develop/release 대상 PR + develop push 트리거, `pnpm test:coverage` 실행, `~/.cache/mongodb-binaries` 캐싱

## 🔒 Owner-only auth

- `env.mjs` 에 `AUTH_OWNER_EMAIL` (z.string().email()) 추가
- `src/auth.ts` `callbacks.signIn` 으로 단일 owner 이메일만 가입/로그인 허용 (`user.email` → `profile.email` fallback)
- `pages.signIn = '/admin/login'`, `pages.error = '/admin/auth-error'` — NextAuth 기본 UI 노출 차단
- `app/admin/login/page.tsx` — 서버 액션 기반 Google 로그인 버튼 (`metadata.robots: { index: false, follow: false }`)
- `app/admin/auth-error/page.tsx` — 거부된 계정 안내
- `app/robots.ts` — `/admin/`, `/api/auth/` disallow 추가
- 테스트 5건 추가 (signIn allow/reject/missing/profile-fallback + pages 라우팅) — 총 29 tests, 100% coverage 유지

## 🔧 Version

- `package.json` `0.1.9` → `0.1.10` → `0.1.11`
- `docs/logs/20260422-supabase-mongo-nextauth-migration.md` 신규 작성

## 사용자 후속 작업

- Google Cloud Console 에서 OAuth redirect URI 등록 (`/api/auth/callback/google`)
- 필요 시 `src/auth.ts` 에 `callbacks.signIn` 추가하여 허용 이메일 화이트리스트 적용
- 사인인 UI / `useSession` 등 사용자 진입점은 후속 PR
