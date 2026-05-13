# Replit + Supabase Deployment Plan

Branch: `codex/platform-migration`

## Decision

Use Replit as the temporary deployment host and Supabase as the production-style database.

This is the safest next move because:
- Replit is already paid for and configured.
- The current app already deploys successfully there.
- Supabase staging is already created and verified locally.
- Moving hosting and database at the same time would add unnecessary risk before Lemon Squeezy review.

Replit should be treated as a staging/early-production host, not as the long-term architecture decision.

## Current Replit Reality

From the Replit audit:
- Replit deploys from the current Replit workspace snapshot, not automatically from GitHub pushes.
- The Replit workspace was switched from `main` to `codex/platform-migration` for the current deployment work.
- Deployment target is Autoscale.
- Frontend and API are deployed as separate Replit services in one monorepo deployment.
- API listens on port `8080`.
- Frontend is served statically from `artifacts/inspire-web/dist/public`.
- Existing automatic Replit database variables were bypassed by adding a manual `DATABASE_URL` secret.
- `DATABASE_URL` is now verified in Replit shell as a Supabase Session Pooler URL with `sslmode=verify-full`.
- This branch now includes a durable Supabase CA chain at `certs/supabase-ca-chain.pem`.
- The API Replit artifact sets `NODE_EXTRA_CA_CERTS=certs/supabase-ca-chain.pem` for production runs.

## Required Replit Secrets

Keep values private. Store values only in Replit Secrets.

Required:
- `DATABASE_URL`
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

Recommended for Replit + Supabase:
- `PG_POOL_MAX=5`
- `PG_IDLE_TIMEOUT_MS=30000`
- `PG_CONNECTION_TIMEOUT_MS=10000`

Configured in the API Replit artifact, not as a secret:
- `NODE_EXTRA_CA_CERTS=certs/supabase-ca-chain.pem`

For Lemon Squeezy review mode before approval:
- `BILLING_PROVIDER=disabled`

Legacy PayPal values can remain temporarily, but should not be used in the review path while `BILLING_PROVIDER=disabled`.

## Supabase Connection Choice

Use Supabase Session Pooler first:
- Host pattern: `aws-...pooler.supabase.com`
- Port: `5432`
- User format: `postgres.<project_ref>`
- Database: `postgres`

Reason:
- The API is a persistent Express service using `pg.Pool`.
- Session Pooler was verified locally.
- Transaction Pooler on `6543` is better for short-lived serverless/edge workloads and has more restrictions.

Add SSL mode in the connection string if Supabase gives a string without it:
- Prefer `sslmode=verify-full`.
- The checked-in Supabase CA chain is available to Node through `NODE_EXTRA_CA_CERTS`.
- Use `sslmode=require` only if `verify-full` fails and the risk is accepted for the temporary Replit staging period.

Do not rely on `/tmp` for certificates in Replit.

## Safe Deployment Sequence

1. Do not change the current Replit production secrets until the workspace code is on `codex/platform-migration`.
2. In Replit, create a checkpoint or duplicate Repl if available.
3. Update the Replit workspace code to `codex/platform-migration`.
4. Confirm these files are present in Replit:
   - `lib/db/migrations/0000_create_inspire_core_schema.sql`
   - `lib/db/migrations/0005_add_assessment_evidence_tables.sql`
   - `lib/db/migrations/0006_add_foreign_key_indexes.sql`
   - `project-state/REPLIT_SUPABASE_DEPLOYMENT.md`
   - `certs/supabase-ca-chain.pem`
5. Set Replit secrets:
   - `DATABASE_URL=<Supabase Session Pooler connection string with sslmode=verify-full>`
   - `BILLING_PROVIDER=disabled`
   - `PG_POOL_MAX=5`
   - `PG_IDLE_TIMEOUT_MS=30000`
   - `PG_CONNECTION_TIMEOUT_MS=10000`
6. Ensure `APP_URL` points to the deployed Replit URL, not the old development URL.
7. Deploy from Replit.
8. Verify:
   - `/api/healthz`
   - `/terms`
   - `/privacy`
   - `/refund-policy`
   - registration
   - login
   - assessment submit
   - admin manual generation
   - admin detail view
   - shared result page
   - checkout-disabled message in the payment step

## Deployment Verification Status

Verified on May 13, 2026:
- Replit workspace branch: `codex/platform-migration`.
- API build passed.
- Frontend build passed with `PORT=24301 BASE_PATH=/`.
- Replit secrets added or updated:
  - `DATABASE_URL`
  - `BILLING_PROVIDER=disabled`
  - `PG_POOL_MAX=5`
  - `PG_IDLE_TIMEOUT_MS=30000`
  - `PG_CONNECTION_TIMEOUT_MS=10000`
  - `APP_URL=https://inspire.next-stepai.com`
- Replit shell confirmed the active `DATABASE_URL` points to Supabase, uses the pooler, and includes `sslmode=verify-full`.
- Replit shell confirmed Postgres connectivity with `NODE_EXTRA_CA_CERTS=/home/runner/workspace/certs/supabase-ca-chain.pem`.
- Replit shell confirmed these Supabase tables exist:
  - `users`
  - `assessments`
  - `assessment_decision_snapshots`
  - `assessment_generation_runs`
- Production domain verification:
  - `https://inspire.next-stepai.com/api/healthz` returned `200`.
  - `https://inspire.next-stepai.com/terms` returned `200`.
  - `https://inspire.next-stepai.com/privacy` returned `200`.
  - `https://inspire.next-stepai.com/refund-policy` returned `200`.
  - A production registration smoke test returned `201`, confirming the deployed API can write to Supabase.

Remaining:
- Run one fresh production assessment and generate its report through admin.
- Verify the new production shared result URL from that generated assessment.
- Verify the checkout-disabled customer message visually on production.

## Prompt For Replit Agent

Use this prompt before changing Replit. This is the audit-only prompt:

```text
Audit and prepare only. Do not deploy, change secrets, or modify files unless I approve after your answer.

This Replit workspace currently deploys INSPIRE Framework from the workspace snapshot. I want to update it to the GitHub branch `codex/platform-migration` and keep Replit as the host while using Supabase as the database.

Please inspect the workspace and answer:

1. What branch is currently checked out?
2. Are there uncommitted Replit workspace changes?
3. Can this workspace safely switch to `codex/platform-migration` without losing local-only changes?
4. Is there a checkpoint or duplicate-Repl option available before switching?
5. What exact command would you run to fetch and switch to `codex/platform-migration`?
6. After switching, would deployment still use the same API and frontend artifact configuration?
7. Which secrets need to be changed or added for Supabase, by name only?
8. Does Replit support setting `PG_POOL_MAX`, `PG_IDLE_TIMEOUT_MS`, and `PG_CONNECTION_TIMEOUT_MS` as secrets/env vars for deployment?
9. Confirm that `certs/supabase-ca-chain.pem` exists after switching branches and that API production has `NODE_EXTRA_CA_CERTS=certs/supabase-ca-chain.pem`.
10. Is `APP_URL` currently deployment-only or development-only, and where should it be set for production?
11. Are there any warnings about using Supabase Session Pooler on port 5432 from this Replit Autoscale deployment?

Do not print secret values.
Do not modify anything.
Return a concise checklist with risks and exact next recommended action.
```

## Execution Prompt For Replit Agent

Use this only after the audit confirms the workspace can safely switch branches.

```text
Proceed with the Replit workspace preparation for deployment. Follow these rules:

- Do not print secret values.
- Do not change DATABASE_URL or any secret values unless I explicitly do it in the Secrets UI or explicitly approve a separate secret-change step.
- Do not deploy until I approve after your preparation report.
- Do not delete local files.
- If the workspace has uncommitted changes, stop and report them before switching.

Goal:
Update this Replit workspace from `main` to the GitHub branch `codex/platform-migration` so the Replit deployment can use the new INSPIRE Framework code with Supabase readiness.

Steps:
1. Confirm the current branch and git status.
2. Fetch the latest GitHub refs from `origin`.
3. Switch to `codex/platform-migration`.
4. Confirm the latest commit is `2316692` or newer.
5. Confirm these files exist:
   - `certs/supabase-ca-chain.pem`
   - `project-state/REPLIT_SUPABASE_DEPLOYMENT.md`
   - `lib/db/migrations/0000_create_inspire_core_schema.sql`
   - `lib/db/migrations/0005_add_assessment_evidence_tables.sql`
   - `lib/db/migrations/0006_add_foreign_key_indexes.sql`
6. Confirm API production env includes:
   - `NODE_EXTRA_CA_CERTS=certs/supabase-ca-chain.pem`
7. Run validation without deploying:
   - `pnpm --filter @workspace/api-server run build`
   - `pnpm --filter @workspace/inspire-web run build`
8. Report whether both builds pass.
9. List the Replit secrets that I must update or add by name only:
   - `DATABASE_URL`
   - `BILLING_PROVIDER`
   - `PG_POOL_MAX`
   - `PG_IDLE_TIMEOUT_MS`
   - `PG_CONNECTION_TIMEOUT_MS`
   - `APP_URL`
10. Stop and wait for my approval before deployment.

Expected DATABASE_URL shape, do not ask me to paste it into chat:
Use the Supabase Session Pooler connection string from the Supabase dashboard, port `5432`, user format `postgres.<project_ref>`, with `sslmode=verify-full`.

Return:
- branch before and after
- build results
- files confirmed
- secrets to update by name only
- exact next manual action for me in Replit Secrets
- whether it is ready to deploy after secrets are set
```

## Manual Secret Values To Set In Replit

Set these in Replit Secrets after the branch switch is confirmed:

- `DATABASE_URL`: Supabase Session Pooler URL from Supabase dashboard, with `sslmode=verify-full`.
- `BILLING_PROVIDER`: `disabled`
- `PG_POOL_MAX`: `5`
- `PG_IDLE_TIMEOUT_MS`: `30000`
- `PG_CONNECTION_TIMEOUT_MS`: `10000`
- `APP_URL`: `https://inspire.next-stepai.com`.

Do not send secret values through Replit agent chat or Codex chat.

## Rollback Plan

If Replit deployment fails after switching to Supabase:
1. Do not overwrite Supabase data.
2. Revert only Replit `DATABASE_URL` to the previous database secret if needed.
3. Re-deploy the previous Replit workspace snapshot or switch back to `main`.
4. Keep `codex/platform-migration` unchanged on GitHub.
