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

## ✨ feat(test) — 동일 브랜치에 후속 추가

테스트 인프라 0 → vitest 4.1 + mongodb-memory-server 도입.

- devDependency: `vitest`, `@vitest/coverage-v8`, `vite-tsconfig-paths`, `mongodb-memory-server`
- `vitest.config.ts` — node 환경, `src/__tests__/**/*.test.ts` glob, threshold lines/functions/statements 80% + branches 70%
- npm scripts: `test`, `test:watch`, `test:coverage`
- `scripts/restore-posts.ts` — `toArray`/`toDoc`/`restorePosts` pure 함수 추출, `import.meta.url` 가드 추가, `main()` v8 ignore (entrypoint glue)

24 tests in `src/__tests__/`:

- `util/db.test.ts` (3) — clientPromise dev singleton / prod fresh / default wrapper
- `lib/queries.test.ts` (10) — mongodb-memory-server 통합. 모든 export 함수 + NoSQL injection 방어 + projection + 정렬 + Date 정규화
- `auth.test.ts` (4) — vi.mock 으로 NextAuth 설정 객체 캡처
- `scripts/restore-posts.test.ts` (7) — 순수 함수 + restorePosts upsert/idempotency + slug index
- `helpers/mongo-memory.ts` — startMongo/stopMongo 라이프사이클

검증: 24/24 pass (881ms), statements/branches/functions/lines 100%, `pnpm build` 회귀 없음.

## 👷 ci

- `.github/workflows/test.yml` — PR(develop/release) + push(develop) 트리거, `pnpm test:coverage` 실행
- `actions/cache` 로 `~/.cache/mongodb-binaries` 캐싱하여 cold start 단축

## 🔒 feat(auth) — owner-only 제한 (0.1.11)

방문자가 로그인 페이지조차 보지 못하도록 두 단계 방어 적용:

1. **인증 보안 게이트** — `src/auth.ts` `callbacks.signIn` 에서 `env.AUTH_OWNER_EMAIL` 와 일치하는 이메일만 `true` 반환. owner 가 아니면 NextAuth 가 세션을 만들지 않음.
2. **UI 은닉** — `pages.signIn = '/admin/login'`, `pages.error = '/admin/auth-error'` 로 기본 NextAuth UI (`/api/auth/signin`) 를 비공개 경로로 redirect. 두 페이지 모두 `metadata.robots: { index: false, follow: false }` 설정.

신규/변경:

- `env.mjs` — `AUTH_OWNER_EMAIL: z.string().email()` 서버 env 추가
- `.env.example` — `AUTH_OWNER_EMAIL` 항목 + 주석
- `src/auth.ts` — `pages` 와 `callbacks.signIn` 추가 (user.email → profile.email fallback)
- `app/admin/login/page.tsx` — server action 기반 Google 로그인 버튼
- `app/admin/auth-error/page.tsx` — 거부 안내 페이지
- `app/robots.ts` — `disallow: ['/dashboard/', '/admin/', '/api/auth/']`
- `src/__tests__/auth.test.ts` — 5 tests 추가 (allow owner, reject non-owner, reject missing email, profile fallback, pages 라우팅)

검증:

- `pnpm test:coverage` → 29 tests pass, statements/branches/functions/lines 100%
- `pnpm build` → `/admin/login`, `/admin/auth-error`, `/api/auth/[...nextauth]` 모두 route 등록

## 🚧 feat(admin) — admin route 보호 (0.1.11 추가)

방문자가 `/admin` 직접 입력해도 로그인 없이는 접근 불가하도록 두 layer 방어:

1. **proxy.ts** — Next.js 16 file convention (deprecated `middleware.ts` 의 후속). `/admin/:path*` matcher 에서 `auth()` 세션 검증. 미로그인 시 `/admin/login` 으로 redirect. `/admin/login`, `/admin/auth-error` 는 public 화이트리스트.
2. **server component 재검증** — `app/admin/page.tsx` 내부에서도 `auth()` 호출 후 `redirect('/admin/login')` (proxy 우회 케이스 방어).

신규/변경:

- `proxy.ts` — `/admin/:path*` matcher 추가 + auth() 게이트. 기존 `/youtubers` gate 유지.
- `app/admin/page.tsx` — owner 전용 dashboard. user email 표시 + Sign Out form
- `app/admin/login/page.tsx` — 이미 인증된 owner 는 `/admin` 으로 redirect

진입 방법: owner 가 직접 `/admin/login` URL 입력 → Google 로그인 → `/admin` 자동 이동. 외부 어디에도 노출 링크 없음.

검증: `pnpm build` 통과 (`/admin`, `/admin/login`, `/admin/auth-error` route 등록), `pnpm test` 29/29 pass.

## 🐛 fix(ci)

- `.github/workflows/test.yml` — `pnpm/action-setup@v4` 의 `with.version: 10` 입력이 `package.json` `packageManager: "pnpm@10.33.0"` 와 충돌하여 `ERR_PNPM_BAD_PM_VERSION` 발생. `version` 입력 제거하여 `packageManager` 단일 출처로 통일.

## 📝 docs(readme)

- README tech stack 최신화: React 18.2 → 19.2.4, Next.js 14.2 → 16.2.3, Tailwind 3.4 → 4.2, MDX 3.0 → 3.1.1, MongoDB driver 6.5 → 6.14, Yarn → pnpm 10.33, TypeScript 5.4 → 5.8
- Storybook 항목 삭제 (이전 PR 에서 제거됨)
- 신규 항목: NextAuth v5 (Google + MongoDBAdapter), Vitest 4.1
- Auth/Testing 섹션 신설 — owner-only 정책 + CI 안내
- `remark-gfm` 제약 버전 4.0.1 로 업데이트

## 후속 작업 (별도 PR)

- Sign-in UI / `useSession` 사용처 구현
- Google Cloud Console redirect URI 등록 (manual)
- Vercel 환경변수 등록 (`AUTH_SECRET`, `AUTH_GOOGLE_*`, `AUTH_OWNER_EMAIL`) — `USER_TASKS.md` 참조
- Dependabot critical alert #143 별도 fix
