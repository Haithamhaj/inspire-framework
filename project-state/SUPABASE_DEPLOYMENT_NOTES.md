# Supabase And Deployment Notes

Branch: `codex/platform-migration`

## Deployment Direction

GitHub should remain the source of truth. Replit should be treated as the current legacy running environment until the migration branch is verified on a new staging environment.

Recommended target shape:
- Database: Supabase PostgreSQL.
- API: Node/Express service on Render, Railway, Fly, or another Node hosting platform.
- Frontend: either served by the same Node service after Vite build, or hosted separately on Vercel.

Initial recommendation:
- Use one backend service for the API first.
- Decide frontend hosting after confirming whether the chosen platform should serve `artifacts/inspire-web/dist/public`.

## Required Environment Variables

API service:
- `DATABASE_URL`
- `PORT`
- `JWT_SECRET`
- `ADMIN_PASSWORD`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`
- `RESEND_API_KEY`
- `FROM_NAME`
- `FROM_EMAIL`
- `APP_URL`
- `ADMIN_ALERT_EMAIL`
- `ASSESSMENT_PRICE`
- `BILLING_PROVIDER`

For Lemon review/staging before checkout approval:
- `BILLING_PROVIDER=disabled`

For legacy PayPal testing only:
- `BILLING_PROVIDER=paypal`
- `PAYPAL_ENV`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_SECRET`

Frontend build:
- `PORT`
- `BASE_PATH=/`

Replit-only:
- `REPL_ID`

Do not commit real values. Store production/staging values only in the deployment platform dashboard or local `.env.local`.

## Supabase Setup Steps

1. Create a new Supabase project.
2. Copy the pooled or direct PostgreSQL connection string.
3. Set that string as `DATABASE_URL` locally or in the staging environment.
4. Run existing Drizzle schema/migrations against the new database.
5. Confirm these tables exist:
   - `users`
   - `refresh_tokens`
   - `assessments`
   - `admin_sessions`
   - `payments`
   - `discount_codes`
   - `assessment_feedback`
   - `assessment_decision_snapshots`
   - `assessment_generation_runs`

## Current Migration Files

Existing migrations:
- `lib/db/migrations/0000_create_inspire_core_schema.sql`
- `lib/db/migrations/0001_add_assessment_domain.sql`
- `lib/db/migrations/0002_add_report_content.sql`
- `lib/db/migrations/0003_add_assessment_feedback.sql`
- `lib/db/migrations/0004_add_discount_code_owner.sql`
- `lib/db/migrations/0005_add_assessment_evidence_tables.sql`
- `lib/db/migrations/0006_add_foreign_key_indexes.sql`

Important:
- Supabase staging currently has MCP migrations applied:
  - `create_inspire_core_schema`
  - `add_inspire_foreign_key_indexes`
- This repo now contains SQL files matching the applied staging schema, but it does not yet include a formal checked-in migration runner script.
- `pnpm --filter @workspace/db run push` uses Drizzle Kit to push schema from code. This may be acceptable for a fresh Supabase database, but migration history should be tightened before production.

## Recommended Migration Approach For Fresh Supabase

For a clean new database before public launch:
1. Use `pnpm --filter @workspace/db run push` with `DATABASE_URL` pointed at Supabase.
2. Verify the generated schema matches the migration files.
3. Keep the SQL migration files as operational documentation.

For production after launch:
1. Add a formal migration command.
2. Run migrations in a controlled release process.
3. Avoid destructive schema pushes.

## Verification Checklist

After Supabase is connected:
- [x] Confirm local or staging `DATABASE_URL` points to the Supabase Postgres connection string.
- [x] Use Session Pooler locally because direct connection is IPv6-only.
- [x] Register a new user.
- [x] Confirm the user row exists in Supabase.
- [x] Login.
- [x] Start a full assessment.
- [x] Submit answers.
- [x] Confirm `assessments.behavioral_answers` is saved.
- [x] Confirm `assessment_decision_snapshots` receives one row.
- [x] With `BILLING_PROVIDER=disabled`, confirm the billing API disables PayPal checkout instead of returning PayPal config.
- [ ] Confirm the user-facing checkout-unavailable message visually in the assessment payment step.
- [x] Use admin manual generation or a test payment path to generate a report.
- [x] Confirm `assessment_generation_runs` receives a row.
- [x] Confirm the admin detail API shows:
  - answers
  - decision snapshot
  - final report
  - final instruction
  - generation runs
- [ ] Confirm the admin detail panel visually in the browser.

## Local Supabase Connection Notes

The direct Supabase database host is IPv6-only for this project, so local development currently uses the Session Pooler:
- Host: `aws-1-ap-northeast-2.pooler.supabase.com`
- Port: `5432`
- User format: `postgres.<project_ref>`
- Database: `postgres`

Node's `pg` driver rejected the Supabase pooler certificate chain until the Supabase CA was added. The local verified run used:
- `NODE_EXTRA_CA_CERTS=/tmp/supabase-ca-chain.pem`

This `/tmp` certificate file is only a local working setup. Before staging/production deployment, add a durable Supabase CA certificate file or platform-level certificate configuration. Do not switch to insecure SSL verification without an explicit risk decision.

## Latest Local Verification

Verified on May 13, 2026 against Supabase staging:
- API login succeeded.
- Full assessment start succeeded.
- V2 assessment submit succeeded and returned `pending_payment`.
- Supabase row check showed the submitted assessment stored 21 behavioral answers.
- Supabase row check showed one decision snapshot for the submitted assessment.
- Billing config check returned `503` with provider `disabled`, confirming PayPal is not exposed by the API in review mode.
- Existing admin manual generation endpoint completed the submitted assessment.
- Supabase row check showed the completed assessment has provider/model metadata, final instruction, and report content.
- Supabase row check showed one completed `assessment_generation_runs` row with input/output snapshots.
- Admin detail API returned answers, decision snapshot, final report, final instruction, and generation run history.

Expected limitation:
- The normal customer paid-completion path is still not verified because billing is intentionally disabled until the Lemon Squeezy path is ready.

## Security Notes

Supabase reported that Row Level Security is disabled for the new `public` tables. This matters if the Supabase Data API exposes the tables through anon/authenticated keys.

Current app architecture uses the Express API and direct Postgres connection rather than direct browser access to these tables. Before production, choose one of these:
- Enable RLS on all app tables and add only the policies actually needed.
- Keep all table access server-side and ensure browser clients do not use Supabase keys for these tables.

Do not enable RLS blindly in production without testing the API flow, because missing policies can block expected access depending on the database role used by the deployment connection string.

## Lemon Squeezy Review Mode

Before Lemon approval:
- Use `BILLING_PROVIDER=disabled`.
- Do not show broken PayPal checkout.
- Show the legal pages:
  - `/terms`
  - `/privacy`
  - `/refund-policy`
- Use a demo/admin-generated report for the video if needed.

After Lemon approval:
- Add Lemon checkout.
- Add Lemon webhook.
- Generalize `payments` away from PayPal-specific fields.
- Store processor events and refund state.

## Open Deployment Decision

Choose one:

Option A: One service
- API and built frontend served from one Node host.
- Simpler operations.
- Good for early launch.

Option B: Two services
- Frontend on Vercel.
- API on Render/Railway/Fly.
- Better frontend deployment ergonomics.
- More environment and CORS coordination.

Recommendation:
- Start with Option A unless the hosting platform makes static frontend serving awkward.
