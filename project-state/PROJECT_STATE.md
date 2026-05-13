# INSPIRE Platform Migration State

## Current Goal
Move INSPIRE development work off the live `main`/Replit path and build the next production-ready version on `codex/platform-migration`.

## Current Reality
- `main` remains the current GitHub/Replit baseline.
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

## Active Decisions
- Do not make large migration or platform changes directly on `main`.
- Treat Replit as the old running environment for now.
- Use this branch for DB v2, admin improvements, Supabase readiness, deployment planning, and Lemon Squeezy review preparation.
- Historical data is not critical; a clean Supabase database is acceptable if migration becomes costly.

## Active Risks
- Billing copy now mentions Lemon Squeezy, while the current backend billing implementation still uses PayPal.
- Replit production environment may differ from local `.env.local`.
- Supabase Data API/RLS posture still needs a production decision before launch.
- Node/Postgres requires Supabase CA handling for the pooler. Local verified command uses `NODE_EXTRA_CA_CERTS=/tmp/supabase-ca-chain.pem`; production needs a durable certificate setup.
- Customer-facing paid completion still needs Lemon Squeezy or a dedicated test-payment path after approval.

## Protected Areas
- Do not expose secrets from `.env.local`.
- Do not break the current `main`/Replit working baseline.
- Do not remove legacy data paths until replacements are verified.

## Next Recommended Action
Decide the staging deployment platform and durable Supabase CA setup, then deploy the migration branch outside Replit.

## Critical References
- Frontend app: `artifacts/inspire-web`
- API server: `artifacts/api-server`
- DB schema: `lib/db/src/schema`
- Legal pages added on this branch: `/terms`, `/privacy`, `/refund-policy`
- Execution plan: `project-state/IMPLEMENTATION_PLAN.md`
- Technical audit: `project-state/TECHNICAL_AUDIT.md`
- Visual system map: `project-state/SYSTEM_MAP.html`
- Supabase/deployment notes: `project-state/SUPABASE_DEPLOYMENT_NOTES.md`
