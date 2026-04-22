# 2026-04-22 — Supabase 제거 + MongoDB 통합 + NextAuth v5 도입

> version: 0.1.10

## ⬆️ chore(deps)

- `@supabase/supabase-js` 제거
- `next-auth@5.0.0-beta.31` + `@auth/mongodb-adapter@^3.11.2` 추가
- `restore:posts` npm script 등록

## ♻️ refactor(env)

- `env.mjs` server schema 에서 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 제거
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` 추가
- `.env.example` 동기화 (NextAuth 섹션 신설)

## ♻️ refactor(db)

- `src/util/db.ts` — `clientPromise` named export 추가 (NextAuth MongoDBAdapter 가 `Promise<MongoClient>` 직접 요구)
- 기존 `mongoClient()` default export 는 handleYTData 호환을 위해 `@deprecated` wrapper 로 유지
- `MongoClientOptions` 적용: `maxPoolSize=10`, `serverSelectionTimeoutMS=5000`, `appName='krrpinfo'`

## ♻️ refactor(queries)

- `src/lib/supabase.ts` 삭제
- `src/lib/queries.ts` 를 mongodb driver 기반으로 재작성
- `client.db('krrpinfo').collection<PostDoc>('posts')` 로 DB/컬렉션 명시 (URL 변경에 영향 없음)
- `pub_date`/`created_at`/`updated_at` Date → ISO string 변환을 `toPost()` helper 로 단일화
- `getPost`, `getPostMeta` 에 `String(slug)` 강제 변환 추가하여 NoSQL injection 방어
- `getPostMeta`, `getAllPostSlugs`, `getPostsForSearch` 에 명시적 `Promise<…>` return type 선언

## ✨ feat(auth)

- `src/auth.ts` — `NextAuth({ adapter: MongoDBAdapter(clientPromise), providers: [Google(...)], session: { strategy: 'database' }, secret: env.AUTH_SECRET })`
- `app/api/auth/[...nextauth]/route.ts` — `handlers` 분해 export (route 위치는 root `app/`, `src/app` 아님)

## ✨ feat(scripts)

- `scripts/restore-posts.ts` — `backup/supabase-posts-*.json` 가장 최신 파일을 읽어 Mongo 에 upsert
  - `tags` string → `string[]` 정규화 (Supabase 에 string 으로 저장되어 있던 데이터를 schema 와 일치하도록 변환)
  - `pub_date` 등 ISO string → `Date` 변환
  - slug unique index 생성
  - 결과: 2 row upserted into `krrpinfo.posts`

## 🙈 chore(.gitignore)

- `/backup/` 디렉터리 exclusion 추가 (dump 파일 repo 비포함)

## 📝 docs(agents)

- AGENTS.md 에 Discord 수신 acknowledgement 규칙 추가

## 🔧 verification

- `pnpm build` 통과 (17 static pages + `/api/auth/[...nextauth]` route 정상 등록)
- `npx tsc --noEmit` 통과
- 다중 reviewer (architect / security / code-reviewer) 검토 후 critical 이슈 모두 해소
  - NoSQL injection (`String(slug)`)
  - app router 디렉터리 위치 (`src/app` → root `app/`)
  - getPostMeta return type 명시
  - connection pool options
  - DB 명시 (`client.db('krrpinfo')`)

## 후속 작업 (별도 PR)

- 사인인 UI / `useSession` 사용처 구현
- `callbacks.signIn` 화이트리스트 (필요 시)
- Google Cloud Console redirect URI 등록 (manual)
