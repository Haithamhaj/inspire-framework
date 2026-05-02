# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

---

## INSPIRE Framework

INSPIRE is a behavioral profiling web app with Arabic RTL interface. Build order follows CLAUDE.md.

### Phase 6 — V2 Question/Scoring Foundation (COMPLETE)

**Backend data** (`artifacts/api-server/src/data/`):
- `questions-v2.ts` — 21 v2 questions: S2, S3 (5 options each, Setup / Behavioral Bridge), Q01–Q15 (4 options each, Behavioral Backbone), AI01–AI04 (4 options each, AI-Use Scenario). Bilingual AR+EN. Exports `REQUIRED_V2_QUESTION_IDS`.
- `option-routing.ts` — 86 option routes with `behavioralSignal`, `instructionSections[]`, `reportSections[]`, `strength`, `thinkingModeEffect`, `redLineEffect`, `riskGuard`. Exports `getOptionRoute()` and `VALID_OPTION_IDS_BY_QUESTION`. Backend-only — never exposed to frontend.

**Backend routes** (`artifacts/api-server/src/routes/`):
- `questions.ts` — `GET /api/questions` — public endpoint returning only the public question shape (no backend metadata). Registered in `routes/index.ts`.

**Backend libs** (`artifacts/api-server/src/lib/`):
- `validators.ts` — Old `AssessmentSubmitSchema` renamed to `MiniSubmitSchema` (snake_case, unchanged). Added `V2SubmitSchema` (camelCase, 21 answers array, optional open_answer). Both used in assessments route.
- `prompt-builder.ts` — Added `PromptDataV2` interface and `buildPromptV2()` function. Anti-bloat pipeline: collects behavioral signals from all 21 option routes → clusters by instruction section → merges overlapping signals → identifies 3–5 dominant patterns → builds compact prompt instructing AI to produce 8 named output sections.
- `report-parser.ts` — Added `parseFullReportV2()` alongside existing `parseFullReport()`. Maps v2 markers (FULL_INSTRUCTION, STARTERS, RED_LINES, STRENGTHS, RISKS, ROLE_ANALYSIS, RECOMMENDATIONS) to existing DB fields. `inspireTable` always null for v2.
- `ai-engine.ts` — Added `generateReportV2()` parallel to existing `generateReport()`. Retry queue auto-detects v2 by checking if stored answers have `questionId` field.

**Backend routes** (`artifacts/api-server/src/routes/assessments.ts`):
- `POST /api/assessments/:id/submit` — Now branches by `assessmentType`: mini → `MiniSubmitSchema` → existing pipeline; full → `V2SubmitSchema` + cross-validation (missing questionIds, invalid optionIds) → v2 pipeline.

**Frontend** (`artifacts/inspire-web/src/pages/assess.tsx`):
- Removed hardcoded `BEHAVIORAL_QUESTIONS` and `SCENARIOS` arrays.
- Fetches questions from `GET /api/questions` on mount.
- Unified `Answer` type: `{questionId, optionId}` (camelCase).
- No separate scenario step — all 21 questions in unified paginated flow (3 per page = 7 pages).
- Open answer is optional (submit button always enabled).
- Submit payload: `{answers, open_answer?, completion_time_seconds}`.

**Mini assessment** (`pages/assess-mini.tsx`): **UNTOUCHED** — unchanged.

### Phase 5 — Admin + Mini + Polish (COMPLETE)

**Backend**:
- `routes/admin.ts` — GET /api/admin/stats (9 KPIs), GET /api/admin/assessments (filters + pagination), GET /api/admin/export (CSV with BOM). Auth: `x-admin-password` header vs `ADMIN_PASSWORD` env var.
- `lib/rate-limit.ts` — In-memory IP-based rate limiter. Applied: `/auth/register` (5/h), `/assessments/start` (10/h).
- `lib/prompt-builder.ts` — Added `buildMiniPrompt()` for mini assessments (QS section only); `buildPrompt()` dispatches by `assessmentType`.
- `routes/assessments.ts` — Passes `assessmentType` to `generateReport()`.

**Frontend pages**:
- `pages/assess-mini.tsx` — Mini assessment at `/assess/mini`; 5 scenarios (indices 0,1,2,5,6) + open question; auth-protected; produces `quickStarters` only; "5 دقائق فقط" label.
- `pages/admin.tsx` — Admin dashboard at `/admin`; password gate modal; 4 stat cards; search + status filter; paginated assessment table; CSV export button.
- `pages/landing.tsx` — Complete landing with: Hero (2 CTAs), How It Works (3 steps), What You Get (6 items + sample system prompt preview), FAQ (7 Q&A accordion), CTA strip, Footer.

**Polish**:
- `pages/results.tsx` — Skeleton loader + animated "processing" waiting screen with polling every 4s (replaces spinner); supports mini assessments (shows only quickStarters if no system instruction).
- `pages/my-assessments.tsx` — Skeleton card loaders (3 cards pulsing while loading).
- App.tsx — New routes: `/assess/mini`, `/admin`.

### Phase 1 — Foundation (COMPLETE)

**Database schema** (`lib/db/src/schema/`):
- `users.ts` — user accounts (email, password hash, consent, email verification)
- `refresh-tokens.ts` — JWT refresh tokens (cascade delete on user remove)
- `assessments.ts` — full assessment sessions + all 8 AI result sections
- `admin-sessions.ts` — admin panel sessions

All 4 tables pushed to PostgreSQL via `pnpm --filter @workspace/db run push`.

**Assessment data** (`artifacts/api-server/src/`):
- `data/questions.ts` — 24 behavioral questions across 7 INSPIRE axes (I/N/S/P/I/R/E), bilingual AR+EN
- `data/scenarios.ts` — 8 binary A/B scenario questions + 5 mini-scenarios, bilingual AR+EN
- `inspire-types/index.ts` — TypeScript types for the entire INSPIRE domain

### Phase 4 — Results, Email, PDF, History (COMPLETE)

**Backend libs** (`artifacts/api-server/src/lib/`):
- `email.ts` — Lazy Resend client; `sendResultsEmail()` called after `finish()` in ai-engine; `sendFailureEmail()` called when retries hit 10 and assessment transitions to `failed`; HTML email with results link + PDF download link; reads `RESEND_API_KEY`, `FROM_NAME`, `FROM_EMAIL`, `APP_URL` from env at send time (not module load); silently skips if `RESEND_API_KEY` absent
- `pdf.ts` — `generateAndSavePDF()` using `@react-pdf/renderer`; 2-page A4 PDF (profile + system instruction); saves to `/public/pdfs/inspire-report-{id}.pdf`

**Backend routes** (`artifacts/api-server/src/routes/results.ts`):
- `GET /api/results/:id` — Full assessment data for a specific completed assessment
- `GET /api/my-assessments` — Paginated list of user's assessments (ordered newest-first)
- `GET /api/my-assessments/compare?a=id&b=id` — Compare 2 assessments; returns delta per INSPIRE axis
- `POST /api/results/:id/generate-pdf` — Generate PDF on demand, cache and return URL
- `GET /api/pdfs/:filename` — Stream PDF files from disk

**Frontend pages**:
- `pages/results.tsx` — Full results page at `/results/:id`; INSPIRE bars with animation, copy system instruction, click-to-copy quick starters, PDF download/generate button
- `pages/my-assessments.tsx` — Assessment history at `/my-assessments`; select 2 assessments to compare with delta visualization; INSPIRE mini-bar on each card

**assess.tsx** — Redirects to `/results/:id` after completion (no more inline results display)
**Navbar** — Added "تقاريري" link for authenticated users
**Routes** — Added `/results/:id` and `/my-assessments` to App.tsx router

**Build** — Added `@swc/helpers` to esbuild external list (needed by `@react-pdf/renderer`)

### Phase 3 — AI Engine & Assessment Core (COMPLETE)

**Backend libs** (`artifacts/api-server/src/lib/`):
- `report-parser.ts` — Parses 8-section AI output using `===SECTION_START/END===` markers into typed fields
- `prompt-builder.ts` — Builds bilingual INSPIRE prompt with all 7 axes + 8 AI interaction dimensions; instructs AI to emit all 8 sections
- `ai-engine.ts` — Lazy-initialized OpenAI (gpt-4o) + Anthropic (claude-sonnet-4-5) clients; 3 OpenAI retries → Claude fallback → `pending_retry` queue; cron retry schedule 30s→1h over 10 attempts

**Backend routes** (`artifacts/api-server/src/routes/assessments.ts`):
- `POST /api/assessments/start` — Creates draft assessment; returns `assessmentId`
- `POST /api/assessments/:id/submit` — Saves answers, sets status=processing, fires `generateReport` async via `setImmediate`
- `GET /api/assessments/:id/status` — Polls assessment including all 8 parsed sections
- `GET /api/cron/retry` — Protected cron endpoint (x-cron-secret header) for background retry queue

**Frontend** (`artifacts/inspire-web/src/pages/assess.tsx`):
- 10-step wizard: Step 0 (project setup) → Steps 1-7 (behavioral Qs per INSPIRE axis) → Step 8 (8 AI scenarios) → Step 9 (open answer) → Processing → Results
- Auth-protected; redirects to /login if not authenticated
- Polls `/api/assessments/:id/status` every 3s after submit
- Results page shows: role analysis, INSPIRE table with progress bars, strengths, red lines, recommendations, system instruction (copyable), quick starters

**Brand fix**: All "إلهام" replaced with "INSPIRE" across all pages (navbar, login, register, consent, assess)

### Phase 2 — Auth (COMPLETE)

**Backend auth** (`artifacts/api-server/src/`):
- `lib/auth.ts` — bcrypt password hashing, jose JWT (access token 7d, refresh token 30d), cookie management, email verify token generation
- `lib/validators.ts` — Zod schemas for Register, Login, AssessmentStart, AssessmentSubmit
- `routes/auth.ts` — All auth API endpoints: POST /auth/register, POST /auth/login, POST /auth/logout, POST /auth/refresh, GET /auth/verify-email, GET /auth/me, POST /admin/login

**Frontend pages** (`artifacts/inspire-web/`):
- `src/hooks/use-auth.tsx` — Auth React context with access token in memory
- `src/pages/privacy-consent.tsx` — Consent page (checkbox required, button disabled until checked)
- `src/pages/register.tsx` — Registration form with react-hook-form + zod validation
- `src/pages/login.tsx` — Login form with Arabic error messages
- `src/pages/landing.tsx` — Hero landing page (Arabic RTL)
- `src/components/layout/Navbar.tsx` — RTL navigation

**OpenAPI spec** updated with all auth endpoints, codegen re-run.
RTL layout with Tajawal font, primary #1a1a2e, accent #e94560.

### Environment Variables (Email)

| Variable | Scope | Value | Notes |
|---|---|---|---|
| `RESEND_API_KEY` | Secret | from Resend dashboard | Required for email sending; absent = silent skip |
| `FROM_NAME` | shared env | `INSPIRE Framework` | Sender display name |
| `FROM_EMAIL` | shared env | `onboarding@resend.dev` | Use `onboarding@resend.dev` until domain verified; then `noreply@imperfect-success.com` |
| `APP_URL` | development env | Replit dev domain | Set production value after deployment; used in email links |

To activate production emails: verify `imperfect-success.com` at resend.com/domains, then update `FROM_EMAIL` to `noreply@imperfect-success.com` and set `APP_URL` to the production domain.

Admin route for manual resend: `POST /api/admin/resend-email/:id` (requires `x-admin-password` header).

### INSPIRE Acronym
**I**ntention, **N**arrative, **S**tyle, **P**references, **I**nteraction, **R**eflection, **E**valuation

### Key Rules
- Arabic RTL is default (`<html lang="ar" dir="rtl">`)
- AI calls are server-side ONLY (never in components)
- 8 output sections stored separately in DB (never merged)
- User account required before assessment (no anonymous)
- Consent page required before registration
