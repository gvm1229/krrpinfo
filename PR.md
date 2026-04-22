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

## 🔧 Version

- `package.json` `0.1.9` → `0.1.10`
- `docs/logs/20260422-supabase-mongo-nextauth-migration.md` 신규 작성

## 사용자 후속 작업

- Google Cloud Console 에서 OAuth redirect URI 등록 (`/api/auth/callback/google`)
- 필요 시 `src/auth.ts` 에 `callbacks.signIn` 추가하여 허용 이메일 화이트리스트 적용
- 사인인 UI / `useSession` 등 사용자 진입점은 후속 PR
