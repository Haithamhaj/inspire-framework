# INSPIRE Technical Audit

Branch: `codex/platform-migration`

## Summary

INSPIRE currently runs as a Vite React frontend plus an Express API server. The API uses PostgreSQL through Drizzle. The current product flow is functional enough for local development, but the next version should remove PayPal from the review path, improve database evidence capture, improve admin review tools, and prepare a clean Supabase-backed deployment outside Replit.

## Current Architecture

Frontend:
- App: `artifacts/inspire-web`
- Router: Wouter in `artifacts/inspire-web/src/App.tsx`
- Main customer pages:
  - `/`
  - `/privacy-consent`
  - `/register`
  - `/login`
  - `/assess`
  - `/assess/mini`
  - `/results/:id`
  - `/my-assessments`
  - `/profile`
  - `/share/:token`
  - `/billing/success`
  - `/terms`
  - `/privacy`
  - `/refund-policy`
- Admin page:
  - `/admin`

API:
- App: `artifacts/api-server`
- API mount: `/api`
- Route modules:
  - `health.ts`
  - `auth.ts`
  - `assessments.ts`
  - `results.ts`
  - `admin.ts`
  - `billing.ts`
  - `questions.ts`

Database:
- Package: `lib/db`
- ORM: Drizzle
- Database: PostgreSQL
- Current schema tables:
  - `users`
  - `refresh_tokens`
  - `assessments`
  - `admin_sessions`
  - `payments`
  - `discount_codes`
  - `assessment_feedback`

## Key Runtime Requirements

Required for API:
- `DATABASE_URL`
- `PORT`
- `JWT_SECRET`
- `ADMIN_PASSWORD`

Required for frontend build/dev:
- `PORT`
- `BASE_PATH`

AI generation:
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`

Email:
- `RESEND_API_KEY`
- `FROM_NAME`
- `FROM_EMAIL`
- `APP_URL`
- `ADMIN_ALERT_EMAIL`

Legacy/current billing:
- `PAYPAL_ENV`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_SECRET`
- `ASSESSMENT_PRICE`

Replit-related:
- `REPL_ID` is only used by Vite to enable Replit plugins in development-like environments.

## Customer Flow

1. User lands on `/`.
2. User goes through `/privacy-consent`.
3. User registers through `/register`.
4. User logs in through `/login`.
5. Auth stores a short-lived access token in memory and a refresh token in an HTTP-only cookie.
6. User starts an assessment through `POST /api/assessments/start`.
7. A draft `assessments` row is created.
8. User submits answers through `POST /api/assessments/:id/submit`.
9. For full assessments, answers are saved before payment validation.
10. If no completed payment is linked, the API can return `pending_payment`.
11. If payment is linked or provided, the assessment moves to `processing`.
12. Background generation creates the report/instruction.
13. Completed results are viewed through `/results/:id`.

## Authentication Flow

Current auth is custom email/password:
- Passwords are hashed with bcrypt.
- Access tokens are JWTs signed with `JWT_SECRET`.
- Refresh tokens are random values stored in `refresh_tokens`.
- Refresh tokens rotate on `/api/auth/refresh`.
- Logout revokes the refresh token.
- Admin routes use `x-admin-password` in most admin API calls.
- `/api/admin/login` also creates an `admin_sessions` cookie, but the frontend admin page primarily sends the admin password header.

Assessment:
- Current auth is acceptable for early launch.
- Google login is not necessary before migration.
- Admin auth should be improved later because password-in-header is simple but weak operationally.

## Assessment Data Flow

Current `assessments` stores:
- Project name and goal.
- Domain and specialization.
- Project context.
- Report language.
- Assessment type.
- Behavioral answers.
- Scenario answers for mini/legacy flow.
- Open answer.
- Final `system_instruction`.
- Final `report_content`.
- Legacy report fields.
- AI provider/model.
- Status and retry data.
- Email/PDF/share metadata.
- Payment link.

Gap:
- The current schema does not preserve a full decision/matrix/scoring snapshot.
- The final instruction exists, but the evidence explaining why it was generated is not stored deeply enough for product improvement.
- Generation attempts and failures are not stored as first-class records.

Recommendation:
- Add generation runs and decision snapshot tables before early-user data matters.

## Billing Flow

Current billing is PayPal-based:
- Frontend calls:
  - `/api/billing/paypal-config`
  - `/api/billing/status`
  - `/api/billing/discount/:code`
  - `/api/billing/create-order`
  - `/api/billing/capture-order`
  - `/api/billing/free-order`
- Backend stores payment rows in `payments`.
- The schema uses `paypal_order_id`.
- Discounts are stored in `discount_codes`.

Gap:
- PayPal is not aligned with the Lemon Squeezy review direction.
- PayPal has been unreliable in manual testing.
- Legal pages now mention Lemon Squeezy, while the live billing implementation is still PayPal.

Recommendation before Lemon review:
- Hide or disable PayPal from the customer-facing review path.
- Keep internal payment state but avoid exposing broken checkout.
- After Lemon approval, replace the processor integration and generalize the payment schema.

## Admin Flow

Current admin page already has meaningful capabilities:
- Stats.
- Assessment list.
- Discount code management.
- User listing and verification.
- Password reset.
- CSV export.
- Regenerate/retry/recovery actions.
- Payment listing.

Gaps:
- No strong assessment detail view that shows answers, final instruction, report, generation evidence, decision snapshot, and payment together.
- No first-class generation run history.
- Limited comparison and quality review tooling.
- Admin auth is operationally simple but not ideal long-term.

Recommendation:
- Admin v2 should focus first on assessment detail and evidence review, not visual redesign.

## Replit Dependencies

Known code-level Replit dependency:
- Vite conditionally loads Replit plugins when `REPL_ID` is present.

Known deployment assumptions:
- Frontend dev server proxies `/api` to `http://localhost:8080`.
- API server expects its own `PORT`.
- Replit may have separate environment variables and database from local `.env.local`.

Recommendation:
- Treat Replit as legacy production/staging for now.
- Build the next environment from GitHub plus Supabase plus a chosen deploy platform.
- Avoid depending on Replit-specific runtime plugins for production behavior.

## Supabase Readiness

The database layer is already PostgreSQL-compatible, so Supabase can be used as the database with minimal code change.

Needed:
- Create Supabase project.
- Use Supabase connection string as `DATABASE_URL`.
- Run Drizzle migrations.
- Confirm SSL/connection pooling settings if required by the deployment platform.
- Test auth, assessment, generation, admin, and email flows.

Historical data:
- Not critical before public launch.
- A clean Supabase database is acceptable.

## Lemon Squeezy Readiness

Already completed:
- `/terms`
- `/privacy`
- `/refund-policy`
- Footer legal links.

Still needed:
- Remove visible broken PayPal flow from review path.
- Make the product and delivery clear in the purchase/review journey.
- Prepare a demo flow and video.
- After approval, add Lemon checkout and webhook.

## Main Risks

1. Payment mismatch:
   - Copy says Lemon Squeezy.
   - Backend still uses PayPal.

2. Data improvement gap:
   - Current DB stores results but not enough decision evidence.

3. Admin review gap:
   - The operator cannot yet inspect the full path from answers to final instruction in one place.

4. Environment drift:
   - Replit DB/env may not match local `.env.local`.

5. Deployment split:
   - Codex/GitHub are development/source-control tools, not hosting.
   - A separate deployment platform is still required.

## Recommended Next Technical Step

Implement DB v2 evidence capture:
1. Add `assessment_generation_runs`.
2. Add `assessment_decision_snapshots`.
3. Update the V2 decision engine to return a snapshot.
4. Save the snapshot during assessment submission/generation.
5. Expose the evidence through admin assessment detail APIs.
