# INSPIRE Platform Migration State

## Current Goal
Stabilize the Replit-hosted `codex/platform-migration` deployment on Supabase, then finish the customer demo/review path for Lemon Squeezy.

## Current Reality
- `main` remains the old GitHub baseline, but the Replit workspace has been switched to `codex/platform-migration` for the current deployment work.
- Active work branch: `codex/platform-migration`.
- The app currently has a Vite frontend, Express API, PostgreSQL/Drizzle database, and legacy PayPal billing code.
- Lemon Squeezy approval is not complete yet; the site needs review readiness before payment integration.
- Phase 1 technical audit is documented in `project-state/TECHNICAL_AUDIT.md`.
- Phase 2 DB v2 foundation has started with schema and migration files for decision snapshots and generation runs.
- Admin now has an API and first UI panel for assessment evidence detail.
- PayPal can now be disabled for review/staging with `BILLING_PROVIDER=disabled`, and the assessment payment page shows a clear checkout-unavailable message instead of an endless loading state.
- Supabase/deployment preparation notes are documented in `project-state/SUPABASE_DEPLOYMENT_NOTES.md`.
- Supabase MCP is connected to staging project `duncakyzabwlrvvnjmmq`.
- Supabase staging has the INSPIRE core schema applied through MCP migrations:
  - `create_inspire_core_schema`
  - `add_inspire_foreign_key_indexes`
- Local `.env.local` now points to Supabase Session Pooler, because the direct connection is IPv6-only.
- Local API was verified against Supabase by registering a test user and confirming the `users` row count increased.
- Local Supabase assessment persistence is verified: login works, full assessment start works, V2 submit saves 21 answers into `assessments.behavioral_answers`, and one `assessment_decision_snapshots` row is created.
- The tested full assessment initially stopped at `pending_payment` because `BILLING_PROVIDER=disabled`, then the existing admin manual generation endpoint completed it successfully.
- Supabase generation evidence is verified: the completed test assessment has a final report, final instruction, and one completed `assessment_generation_runs` row with input/output snapshots.
- Admin detail API is verified for the completed test assessment: it returns 21 answers, decision snapshot, final report, final instruction, and generation run history.
- Admin page visual verification is complete for stats, completed assessment row, saved answers, decision/matrix snapshot, and generation run count.
- Public shared results initially displayed only the header for V2 reports; this is fixed by returning and rendering safe `reportContent` sections while still excluding the private system instruction.
- Deployment decision: keep Replit temporarily as the host and switch its database to Supabase after the Replit workspace is updated to `codex/platform-migration`.
- Database pool settings are now configurable through `PG_POOL_MAX`, `PG_IDLE_TIMEOUT_MS`, and `PG_CONNECTION_TIMEOUT_MS`.
- Durable Supabase CA setup is now included for Replit production via `certs/supabase-ca-chain.pem` and `NODE_EXTRA_CA_CERTS`.
- Replit deployment handoff now includes both an audit-only prompt and an execution-preparation prompt.
- Replit production is republished from `codex/platform-migration`.
- Official production domain: `https://inspire.next-stepai.com`.
- Replit `APP_URL` is set to `https://inspire.next-stepai.com`.
- Replit `DATABASE_URL` is set manually as a secret and verified to point to Supabase Session Pooler with `sslmode=verify-full`.
- Replit Supabase connectivity was verified from the Replit shell with the checked-in CA chain.
- Replit production smoke verification passed:
  - `/api/healthz` returned `200`.
  - `/terms`, `/privacy`, and `/refund-policy` returned `200`.
  - A production registration request returned `201`, confirming the deployed API can write to Supabase.
- Replit initially kept injecting its managed Neon `DATABASE_URL`; this is now bypassed by the API production startup wrapper using `SUPABASE_DATABASE_URL`.
- Production Supabase write verification passed after the wrapper: a live registration appeared in Supabase project `duncakyzabwlrvvnjmmq`.
- Production full-flow verification passed:
  - registered and logged in a new user
  - loaded 21 V2 questions
  - created a full assessment
  - submitted 21 answers
  - received expected `pending_payment` response because billing is disabled
  - confirmed 21 answers, open answer, and decision snapshot in Supabase
  - generated the report through the admin manual generation endpoint
  - confirmed completed report, final instruction, report content, and completed generation run in Supabase
- The old test share token is not available on the current production database; this is expected for non-migrated test data. The latest generated production report has sharing disabled by default.

## Active Decisions
- Do not make large migration or platform changes directly on `main`.
- Treat Replit as the old running environment for now.
- Use this branch for DB v2, admin improvements, Supabase readiness, deployment planning, and Lemon Squeezy review preparation.
- Historical data is not critical; a clean Supabase database is acceptable if migration becomes costly.
- Replit remains the temporary deployment target because it is already paid for and configured.

## Active Risks
- Billing copy now mentions Lemon Squeezy, while the current backend billing implementation still uses PayPal.
- Replit production deploys from the Replit workspace snapshot, not automatic GitHub push deploys.
- Supabase Data API/RLS posture still needs a production decision before launch.
- Node/Postgres requires Supabase CA handling for the pooler. Replit shell verification works with the durable checked-in CA path.
- Customer-facing paid completion still needs Lemon Squeezy or a dedicated test-payment path after approval.
- The Replit workspace is currently on a feature branch. Later, decide whether to merge `codex/platform-migration` into `main` or keep Replit intentionally pinned to this branch until review is complete.
- Replit/Neon production database may still be connected as an unused resource. It is no longer receiving writes, but should be removed later to eliminate hidden environment injection and cost/confusion.

## Protected Areas
- Do not expose secrets from `.env.local`.
- Do not break the current `main`/Replit working baseline.
- Do not remove legacy data paths until replacements are verified.

## Next Recommended Action
Clean up the unused Replit/Neon production database resource when convenient, then polish the Lemon Squeezy review flow and payment-disabled customer messaging.

## Critical References
- Frontend app: `artifacts/inspire-web`
- API server: `artifacts/api-server`
- DB schema: `lib/db/src/schema`
- Legal pages added on this branch: `/terms`, `/privacy`, `/refund-policy`
- Execution plan: `project-state/IMPLEMENTATION_PLAN.md`
- Technical audit: `project-state/TECHNICAL_AUDIT.md`
- Visual system map: `project-state/SYSTEM_MAP.html`
- Supabase/deployment notes: `project-state/SUPABASE_DEPLOYMENT_NOTES.md`
- Replit deployment plan: `project-state/REPLIT_SUPABASE_DEPLOYMENT.md`
