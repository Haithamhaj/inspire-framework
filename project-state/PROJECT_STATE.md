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

## Active Decisions
- Do not make large migration or platform changes directly on `main`.
- Treat Replit as the old running environment for now.
- Use this branch for DB v2, admin improvements, Supabase readiness, deployment planning, and Lemon Squeezy review preparation.
- Historical data is not critical; a clean Supabase database is acceptable if migration becomes costly.

## Active Risks
- Billing copy now mentions Lemon Squeezy, while the current backend billing implementation still uses PayPal.
- Replit production environment may differ from local `.env.local`.
- Supabase Data API/RLS posture still needs a production decision before launch.

## Protected Areas
- Do not expose secrets from `.env.local`.
- Do not break the current `main`/Replit working baseline.
- Do not remove legacy data paths until replacements are verified.

## Next Recommended Action
Set local/staging `DATABASE_URL` to the Supabase Postgres connection string, then test a full V2 assessment flow with `BILLING_PROVIDER=disabled` to confirm the review path and admin evidence panel.

## Critical References
- Frontend app: `artifacts/inspire-web`
- API server: `artifacts/api-server`
- DB schema: `lib/db/src/schema`
- Legal pages added on this branch: `/terms`, `/privacy`, `/refund-policy`
- Execution plan: `project-state/IMPLEMENTATION_PLAN.md`
- Technical audit: `project-state/TECHNICAL_AUDIT.md`
- Visual system map: `project-state/SYSTEM_MAP.html`
- Supabase/deployment notes: `project-state/SUPABASE_DEPLOYMENT_NOTES.md`
