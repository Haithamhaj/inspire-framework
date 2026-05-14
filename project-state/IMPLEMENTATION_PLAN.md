# INSPIRE Platform Migration Implementation Plan

Branch: `codex/platform-migration`

## Final Goal
Build the next production-ready INSPIRE version on a safe branch before moving away from Replit. The target version should have stronger data capture, a better admin workflow, Supabase readiness, a clean deployment path, and a site ready for Lemon Squeezy review.

## Phase 0: Stabilize The Starting Point

Goal: Work safely without disrupting `main` or the current Replit baseline.

Tasks:
- [x] Keep large migration work off `main`.
- [x] Use `codex/platform-migration` as the active working branch.
- [x] Review uncommitted files and classify them as required changes, unrelated existing changes, or temporary files.
- [x] Update `.gitignore` if temporary tooling files should not be committed.
- [x] Commit the legal page work separately from unrelated changes.
- [!] Unrelated existing local changes still remain in the working tree and should not be mixed into migration commits unless explicitly approved.

Expected result:
- A clean working branch.
- A clear first commit scope.
- `main` remains available as the current Replit baseline.

## Phase 1: Technical Audit

Goal: Understand what currently works, what depends on Replit, and what depends on PayPal or the current database.

Tasks:
- [x] Map frontend routes.
- [x] Map API routes.
- [x] Map database tables and write paths.
- [x] Map authentication flow.
- [x] Map assessment generation flow.
- [x] Map payment flow.
- [x] List required environment variables by name only.
- [x] Identify Replit-specific assumptions.
- [x] Identify PayPal-specific assumptions.
- [x] Identify Lemon Squeezy review gaps.

Expected result:
- A practical system map.
- A list of migration risks.
- Clear decisions about what to keep, replace, or disable.

## Phase 2: Database V2 For Analysis

Goal: Store enough evidence to understand why each customer result was generated.

Tasks:
- [x] Design and add database changes for generation evidence.
- [x] Preserve final customer-facing outputs.
- [x] Preserve user answers and open answers.
- [x] Preserve decision/matrix/scoring snapshots.
- [x] Preserve prompt/model/provider metadata.
- [x] Preserve generation errors and retry state.
- [!] Add a formal migration runner before production; SQL migration files exist, but release execution is still manual/MCP-driven.

Likely additions:
- `assessment_generation_runs`
  - `assessment_id`
  - `provider`
  - `model`
  - `prompt_version`
  - `status`
  - `started_at`
  - `completed_at`
  - `error_message`
  - `input_snapshot`
  - `output_snapshot`
- `assessment_decision_snapshots`
  - `assessment_id`
  - `answers_snapshot`
  - `matrix_snapshot`
  - `scoring_snapshot`
  - `selected_rules`
  - `selected_roles`
  - `selected_red_lines`
  - `selected_output_rules`
  - `decision_engine_version`

Expected result:
- Each assessment can be reviewed from answers to final output.
- Future comparisons between customers become possible.
- Product quality can improve from evidence, not guesses.

## Phase 3: Generation Pipeline Updates

Goal: Save generation evidence every time the system creates or retries a report.

Tasks:
- [x] Update the decision engine to return a structured decision snapshot.
- [x] Update V2 generation to save:
  - answers snapshot
  - decision snapshot
  - prompt/input metadata
  - final instruction
  - report content
  - model/provider details
  - failure details when generation fails
- [x] Verify generation-run evidence is created during manual admin generation on Supabase.
- [x] Update default OpenAI generation model to `gpt-5.5`.
- [ ] Make retry/failure states easier to inspect beyond the first admin detail panel.

Expected result:
- No completed report is a black box.
- Failed reports contain enough information for support and improvement.

## Phase 4: Admin V2

Goal: Turn admin from a basic management page into a practical review and operations dashboard.

Tasks:
- [x] Add a dashboard with:
  - users count
  - assessments by status
  - payments by status
  - failed and pending retry counts
  - latest assessments
- [x] Improve assessment detail view with:
  - user summary
  - project details
  - answers
  - open answer
  - final report
  - final instruction
  - decision snapshot
  - generation runs
  - payment state
  - feedback
- [ ] Add admin tools:
  - [x] regenerate report
  - [x] retry failed assessment
  - [x] resend email
  - [x] enable or disable share
  - [x] export JSON/CSV
- [ ] Add filters:
  - [x] status
  - [x] language
  - [x] domain
  - [x] model/provider
  - [x] failed/completed
- [!] Admin operations and filtering are now implemented in the API and UI; run final browser QA on production-like data before treating the dashboard as review-ready.

Expected result:
- The operator can inspect and improve real customer outputs.
- Support and quality review become much easier.

## Phase 5: Auth Review

Goal: Keep authentication sufficient and avoid unnecessary complexity before migration.

Tasks:
- [x] Review current email/password flow.
- [x] Review refresh token behavior.
- [x] Review cookie security.
- [x] Review admin session behavior.
- [x] Add password reset flow:
  - [x] forgot-password request
  - [x] secure reset token
  - [x] reset email
  - [x] new-password form
  - [x] token expiry and reuse protection
- [ ] Add small security improvements only if needed.
- [x] Defer Google login unless there is a clear product need.
- [x] Supabase migration `add_password_reset_fields` was applied on May 14, 2026 and verified to add `password_reset_token` and `password_reset_expires`.
- [!] Production cookie/session settings should be rechecked after the final hosting choice.

Expected result:
- Current auth remains usable and safe enough for early launch.
- OAuth complexity is avoided until needed.

## Phase 6: Lemon Squeezy Review Readiness

Goal: Prepare the site and demo flow before requesting Lemon Squeezy approval.

Tasks:
- [x] Confirm `/terms`, `/privacy`, and `/refund-policy`.
- [x] Confirm footer legal links.
- [x] Remove or hide broken PayPal checkout from the customer review path.
- [x] Clarify that the free offer is the quick assessment, not the full report.
- [x] Make product, price, delivery, and digital nature clear across the full review path.
- [x] Add a direct `/pricing` route so Lemon reviewers do not hit a SPA 404 when looking for pricing.
- [x] Verify production `/pricing` after Replit update.
- [ ] Prepare a review/demo flow:
  - landing page
  - start assessment
  - complete assessment
  - view generated or demo result
  - legal pages
- [ ] Prepare video talking points:
  - product is digital
  - no physical shipping
  - no professional advice
  - Lemon Squeezy will process payments after approval
- [!] Local legal page verification passed on `http://localhost:5173`, but the full review/demo path still needs end-to-end recording preparation.

Expected result:
- Reviewers see a coherent digital product.
- No broken checkout blocks approval.
- The site is ready to record and submit.

## Phase 7: Payment Strategy

Goal: Stop relying on broken PayPal flow and prepare clean Lemon Squeezy integration after approval.

Before approval:
- [x] Hide PayPal from the main customer experience with `BILLING_PROVIDER=disabled`.
- [x] Keep payment state internally ready.
- [ ] Use admin/free/manual completion only for testing if needed.

After approval:
- [ ] Add Lemon Squeezy checkout.
- [ ] Add Lemon Squeezy webhook.
- [ ] Update payment records to support:
  - `processor`
  - `processor_order_id`
  - `checkout_id`
  - `customer_email`
  - `currency`
  - `refund_status`
- [ ] Link webhook payment confirmation to assessment/report generation.
- [ ] Test successful payment, duplicate webhook, failed payment, and refund states.
- [!] Current schema still has PayPal-specific fields; general payment schema should be part of the Lemon Squeezy integration phase.

Expected result:
- A reliable payment path.
- Payment schema is not locked to PayPal.
- Lemon Squeezy can become the production processor.

## Phase 8: Supabase Migration

Goal: Move to a clean Supabase PostgreSQL database.

Tasks:
- [x] Create a Supabase project.
- [x] Connect Supabase MCP to staging project `duncakyzabwlrvvnjmmq`.
- [x] Run migrations through Supabase MCP.
- [x] Update local `DATABASE_URL` to Supabase Session Pooler.
- [x] Set `BILLING_PROVIDER=disabled` locally.
- [x] Test API read path with `/api/questions`.
- [x] Test register path and confirm a user row was saved in Supabase.
- [x] Test login.
- [x] Test assessment start.
- [x] Test assessment submit.
- [x] Confirm `assessments.behavioral_answers` stores the 21-answer V2 payload.
- [x] Confirm `assessment_decision_snapshots` receives one row for the submitted assessment.
- [x] Test report generation through the existing admin manual generation endpoint.
- [x] Test admin review API for answers, decision snapshot, final report, final instruction, and generation runs.
- [x] Decide whether any old data is worth manually importing: not critical before launch.
- [!] Direct Supabase connection is IPv6-only in this project. Local/typical hosting should use Session Pooler.
- [x] Node/Postgres Supabase CA handling is configured with `certs/supabase-ca-chain.pem` and verified from Replit shell.
- [x] Use existing admin manual generation path to complete one pending-payment assessment for staging verification.
- [!] Customer-facing paid completion still needs Lemon Squeezy or a dedicated test-payment path after approval.

Expected result:
- The app works against Supabase.
- Replit database is no longer required for the new version.

## Phase 9: Deployment Outside Replit

Goal: Run the new version from a controlled deployment path while keeping Replit as the temporary host.

Tasks:
- [x] Decide deployment shape:
  - keep Replit's current separate static frontend and API services for now.
- [x] Choose platform after audit: keep Replit temporarily, use Supabase for the database.
- [x] Add configurable Postgres pool settings for Replit/Supabase.
- [x] Add durable Supabase CA chain and Replit `NODE_EXTRA_CA_CERTS` production setting.
- [x] Document Replit + Supabase deployment sequence.
- [x] Add Replit audit and execution-preparation prompts.
- [x] Configure build commands.
- [x] Configure environment variables.
- [x] Configure durable Supabase CA/SSL handling for Replit Node hosting.
- [x] Deploy staging/early-production URL on Replit.
- [x] Test end to end on staging/early production through admin-generated report.
- [x] Document deployment process.
- [!] Replit's managed Neon production database may still be connected as an unused resource. The startup wrapper now overrides it with `SUPABASE_DATABASE_URL`; later cleanup should remove the old resource completely.

Expected result:
- A staging/early-production deployment on Replit that uses Supabase instead of the old database.
- GitHub remains the source of truth.
- Replit remains temporary hosting until there is a clear reason to move.

## Phase 10: Final QA And Launch Decision

Goal: Confirm the migrated version is ready for early users and Lemon Squeezy review.

Tasks:
- [x] Test registration locally against Supabase.
- [x] Test login.
- [ ] Test logout.
- [x] Test assessment flow through submit/pending-payment.
- [x] Test generation through admin manual generation.
- [x] Test public shared results page for V2 report content.
- [x] Test admin detail API.
- [x] Test admin page visually in the browser.
- [x] Test legal pages locally.
- [x] Test legal pages on production domain.
- [x] Test production registration writes through the deployed Replit API to Supabase.
- [x] Test production full flow through registration, login, 21-question submit, Supabase evidence persistence, and admin manual generation.
- [!] Latest production-generated report has sharing disabled by default; a share-enabled production result still needs explicit verification if that feature is required for the Lemon Squeezy video.
- [x] Make submitted unpaid assessments use `pending_payment` instead of remaining `draft`, and show that state in admin.
- [x] Add an admin preset for a 100% Lemon Squeezy review discount code.
- [x] Add a user-facing way to resume payment for saved `pending_payment` assessments from "My reports".
- [x] Expand admin discount-code creation with optional user email, usage limit, start date, and expiration date.
- [x] Capture report feedback context, including whether the user copied the final AI instructions before rating.
- [x] Smoke-test the free quick assessment path on production.
- [x] Add backend validation that the free quick assessment receives exactly the intended five scenario answers.
- [ ] Test mobile and desktop.
- [ ] Review copy.
- [ ] Record Lemon Squeezy video.
- [ ] Submit Lemon Squeezy review.

Expected result:
- A stable review-ready website.
- A clear operator workflow.
- A practical basis for early users and future launch.

## Recommended Execution Order

1. [x] Clean current branch and commit legal pages.
2. [x] Complete technical audit.
3. [x] Design DB v2 and migrations.
4. [x] Save generation and decision snapshots.
5. [x] Build admin assessment detail.
6. [x] Hide or disable PayPal from the review path.
7. [x] Set up Supabase.
8. [x] Complete local Supabase end-to-end flow through admin-generated report and admin detail API review.
9. [x] Fix shared result page to display V2 `reportContent` without exposing system instruction.
10. [x] Decide deployment platform: keep Replit temporarily and configure Supabase readiness.
11. [x] Deploy staging/early-production on Replit with Supabase.
12. [x] Run fresh production demo assessment through admin-generated report.
13. [ ] Polish Lemon Squeezy review flow.
14. [ ] Integrate Lemon Squeezy after approval.
