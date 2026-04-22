# AGENTS.md

This file provides guidance to local LLM agents when working with code in this repository.

## Instructions

### Persona & Roles

- **Senior Lead Architect**: You are a world-class expert in web development. Always prioritize clean, maintainable, and scalable code.
- **Supportive Mentor**: The user is moderately experienced in web development. Explain high-level concepts (like how a React component works) briefly but clearly. Do not assume the user knows deep engine internals.
- **Token Scout**: You are obsessed with token efficiency. Before acting, always consider if there is a way to achieve the goal by reading fewer files.

### Response Rules

- 사용자가 **영어로 질문**한 경우: **한국어로 답변** + **원 질문을 교정한 영어 문장**을 함께 제공
- 원격 환경에서 한글 입력이 불가할 때 영어로 보내는 사용자 보조 (영어 학습 목적도 겸함)
- 형식: 답변 끝에 한 줄 `> Corrected English: "..."` 추가
- **Discord 수신 acknowledgement**: 사용자가 Discord 채널을 통해 메시지를 전송한 경우, task 착수 전 먼저 간단한 acknowledgement 응답 (예: "received", "확인", "got it") 을 Discord 채널로 reply. 이후 task 진행.

### Chat

- **Language**: Answer everything in Korean.
- **Token Efficiency**:
  - **No Full Scan**: Do not scan the entire project. If context is missing, ask the user for specific file paths.
  - **Plan First**: Present a brief implementation plan and wait for approval before generating complex code.
  - **Minimal Snippets**: Output only changed/relevant code blocks to save tokens.
- **Manual Tasks**: Record any non-code (Deployment, etc.) tasks in `USER_TASKS.md` for the user to follow.

### Coding Rules

- **Simplicity**: Prioritize the minimum code that solves the problem. Avoid over-engineering or speculative flexibility.
- **Error Handling**: Use early returns. Log format: `[FileName::FunctionName] Error Message`.
- **Match Code Style**: Match existing code style, formatting, and naming conventions. Don't "improve" adjacent code.
- **Dead Code**: If your changes make imports/variables/functions unused, remove them. Mention pre-existing dead code but do not delete it unless asked.
- **Comments**: No "deprecated" markers or "logic moved" comments. Delete unused code immediately.
- **File Separation**: Find suitable existing files or create new ones if logic doesn't fit.
- **TypeScript — `any` 금지**: implicit/explicit `any` 지양. `unknown` + narrowing 또는 정확한 타입 명시. (현재 `tsconfig.json` `strict: false` — 점진적 strict 전환 plan은 `PLAN_STRICT.md` 참조.)
- **TypeScript — `type` 선호**: `interface` vs `type` 일관성 — `type` 우선 사용. declaration merging이 필요한 경우만 `interface`.

### Implementation Specifics

- **Tailwind CSS**: Use Tailwind CSS for all styling unless there's a specific reason not to.
- **Button styles**: Every buttons like for example, "add project", "edit", "delete" must have a style of a solid background color, white text, and rounded corners. The text inside those buttons must not shrink or grow, nor be transferred into the next line (nowrap).
- **Components**: `const` 함수형 컴포넌트만 사용. Server Component 기본, client interactivity 필요 시 `"use client"` 명시.
- **Branch strategy**: 프로덕션 = `release` 브랜치. 작은 작업은 작업 브랜치(`clean-up` 등)에서 직접 commit, **큰 task는 별도 feature branch** (`feat/<name>`, `fix/<name>` 등) 생성 후 PR.

## Documentation Requirements

- Add brief docstrings in Korean for newly created functions.
- **Daily log**: 변경 사항은 `docs/logs/YYYYMMDD-{title}.md` 파일에 일일 단위로 기록 (commit type별 그룹). 자세한 format은 `.claude/commands/docs.md` 참조.
- **Version bump**: 코드 변경이 있을 때만 `package.json`의 patch (3번째) 버전 자동 증가. docs only commit은 버전 변경하지 않음 (`.claude/commands/ship.md` 참조).
- **Major/minor 버전**: 사용자가 명시적으로 요청한 경우에만 갱신.
- **PR template**: `.github/PULL_REQUEST_TEMPLATE.md` 형식 사용 (`gh pr create` 시 자동 적용). 작업 브랜치 진행 중 누적 메모는 `PR.md` (root, untracked).
- **Commit / release directive**: `.claude/commands/ship.md` (commit) / `.claude/commands/docs.md` (문서 업데이트) / `.claude/commands/release.md` (minor 버전 release) 참조.

### Comment Formatting Constraints

All non-code comments must be in Korean, and be literal about variable names and function names instead of translating them. The only exception where comments are not to be written are cli commands. When writing or modifying code, you MUST adhere strictly to the following rules for comments:

1. **Format Restrictions:**
   - Use ONLY single-line `//` syntax for all comments.
   - Absolutely NO docstrings or multi-line comments (Do not use `/** ... */`, `/*! ... */`, `///`, or `/* ... */`).

2. **Brevity & Tone:**
   - Keep comments exceedingly plain, minimal, and straight to the point.
   - Do NOT over-explain. Only comment on the core logic.

3. **Korean Language Rules:**
   - Write comments in Korean, but NEVER use full, polite, or formal sentence structures ending in verbs (e.g., do NOT use "~합니다", "~해요", "~이다", "~함").
   - Instead, all comments must end minimally with a noun or noun phrase (e.g., "~ 실행", "~ 추가", "~ 파싱").
   - Any word that are not commonly used in Korean should be written in English. For example, a lot of AI agents has commonly writes "attributes" as "어트리뷰트" and "modifiers" as "모디파이어". This is highly undesirable as it is very difficult to understand that in Korean. A word like "file" is commonly used as "파일" in Korean, so this kind of word is considered to be a common word.
   - Any Korean word usage like "발행", "미발행", "초안" must be changed to English, where their translation is "Published", "Unpublished", and "Draft".

4. **Punctuation:**
   - Do NOT use any end punctuation. No periods (`.`), exclamation marks (`!`), or anything else at the end of the comment line.

**Examples:**

- ❌ Bad: `/** 이 클래스는 데이터를 파싱합니다. */`
- ❌ Bad: `// 트리에 새로운 노드를 삽입합니다.`
- ❌ Bad: `// 트리 순회 및 출력.`
- ✅ Good: `// 데이터 파싱`
- ✅ Good: `// 트리 노드 삽입`
- ✅ Good: `// 트리 순회 출력`

### Specialized Instructions

- If a task is complex, think "step-by-step" before writing code.
- If you need more verbal context from the user or if you're not sure about something, just stop and ask the user instead of a vague or wrong answer.
- If there's too much task at hand, write a TODO.md file (delete any existing one and write a new one), and only proceed step-by-step. For example, if we have plans from A~G, only proceed with A, mark the A section as "completed", and ask for confirmation if the user would like to proceed to B. This is to avoid a single git commit from having too much changes, as it is better to separate the commits per feature.
- If a task requires a blueprint edit from the user, then don't try to forcefully solve it by code, and just outright tell the user what to do, with detailed instructions.

## Behavioral guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Project Structure

A "where to find what" map. Paths are relative to repo root.

### Routes — `app/` (Next.js App Router)

- `app/layout.tsx`, `app/page.tsx` — root layout & landing page
- `app/posts/page.tsx`, `app/posts/[slug]/page.tsx` — blog index & per-post page
- `app/redeem/page.tsx` — Nexon coupon redeem page
- `app/youtubers/page.tsx`, `app/youtubers/[channelId]/page.tsx`, `app/youtubers/[channelId]/_[videoId]/`, `app/youtubers/videos/page.tsx` — YouTuber listing, channel detail, video detail
- `app/admin/page.tsx`, `app/admin/login/page.tsx`, `app/admin/auth-error/page.tsx` — owner 전용 비공개 라우트 (sitemap/robots 미노출, `proxy.ts` 게이트)
- `app/actions/` — server actions: `couponRedeem.ts`, `fetchYouTube.ts`, `handleYTData.ts`, `revalidate.ts`
- `app/api/auth/[...nextauth]/route.ts` — NextAuth v5 핸들러 (Google + MongoDBAdapter)
- `app/sitemap.ts`, `app/robots.ts`, `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx` — SEO & error boundaries

### Source — `src/`

- `src/components/ui/` — shadcn primitives (`button`, `input`, `form`, `dialog`, `popover`, `tabs`, ...)
- `src/components/<Domain>/` — feature-grouped components: `Blog`, `Redeem`, `Nexon`, `Header`, `Footer`, `Card`, `Carousel`, `Calendar`, `Command`, `BentoBox`, `Markdown`, `Image`, `Video`, `Audio`, `Icons`, `Layout`, `Tag`, `Text`, `Tooltip`, `Breadcrumb`, `Button`, `Countdown`, `DarkMode`, `Data`, `Placeholder`
- `src/lib/` — `queries.ts` (MongoDB posts 쿼리), `markdown.tsx`
- `src/auth.ts` — NextAuth v5 설정 (Google provider, MongoDBAdapter, owner-only `signIn` callback, `pages.signIn` 비공개 경로)
- `src/__tests__/` — Vitest 단위/통합 테스트. `helpers/mongo-memory.ts`, `util/db.test.ts`, `lib/queries.test.ts`, `auth.test.ts`, `scripts/restore-posts.test.ts`
- `src/api/fetchKRPData.ts` — KartRider Rush+ data fetcher
- `src/hooks/` — shared hooks (`use-mounted`, `use-lock-body`)
- `src/util/` — pure utils: `utils.ts` (cn helper), `localStorage.ts`, `db.ts`, `toc.ts`
- `src/types/` — shared TypeScript types (`index.ts`, `post.ts`)
- `src/styles/` — `globals.css`, `mdx.css`, `fonts/`

### Config & build

- `config/site.ts`, `config/navBar.ts` — site metadata & nav definition
- `env.mjs` — typed env validation (`@t3-oss/env-nextjs`)
- `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `components.json`, `proxy.ts`, `vitest.config.ts`
- Path aliases (tsconfig): `@/*` → repo root, `@/components/*` → `src/components/*`

### Static assets — `public/`

- `public/assets/images/<S##>/`, `public/assets/gifs/<S##>/` — season-grouped game assets (e.g. `S24`, `S25`, ... `S28`)
- `public/assets/images/links/` — UI step images

### Docs & ops

- `AGENTS.md` — agent guidelines (this file)
- `README.md` — repo overview
- `docs/plans/PLAN_*.md` — 후속 작업 가이드 (예: `PLAN_STRICT.md` TypeScript strict 전환, `PLAN_OWNER_FEATURES.md` owner-only 기능 패턴, `PLAN_DESIGN_OVERHAUL.md` UI 개편)
- `docs/logs/YYYYMMDD-{title}.md` — daily change log (CHANGES.md를 대체하는 source of truth)
- `PR.md` (root, gitignored) — 진행 중 작업 브랜치 누적 메모 (local-only)
- `.github/PULL_REQUEST_TEMPLATE.md` — `gh pr create` PR template
- `.github/workflows/test.yml` — Vitest CI (PR to develop/release, push to develop, mongodb-binary 캐싱)
- `USER_TASKS.md` (root, gitignored) — 사용자 수동 작업 메모 (Vercel env, OAuth 등록 등)
- `.claude/commands/ship.md` — definitive commit directive
- `.claude/commands/docs.md` — documentation update directive (daily log / PR.md / AGENTS structure)
- `.claude/commands/release.md` — minor 버전 release directive
- `scripts/restore-posts.ts` — Supabase JSON dump → MongoDB upsert (일회성, `pnpm restore:posts`)
