# INSPIRE Platform Migration Implementation Plan

Branch: `codex/platform-migration`

## Final Goal
Build the next production-ready INSPIRE version on a safe branch before moving away from Replit. The target version should have stronger data capture, a better admin workflow, Supabase readiness, a clean deployment path, and a site ready for Lemon Squeezy review.

## Phase 0: Stabilize The Starting Point

Goal: Work safely without disrupting `main` or the current Replit baseline.

Tasks:
- Keep large migration work off `main`.
- Use `codex/platform-migration` as the active working branch.
- Review uncommitted files and classify them as required changes, unrelated existing changes, or temporary files.
- Update `.gitignore` if temporary tooling files should not be committed.
- Commit the legal page work separately from unrelated changes.

Expected result:
- A clean working branch.
- A clear first commit scope.
- `main` remains available as the current Replit baseline.

## Phase 1: Technical Audit

Goal: Understand what currently works, what depends on Replit, and what depends on PayPal or the current database.

Tasks:
- Map frontend routes.
- Map API routes.
- Map database tables and write paths.
- Map authentication flow.
- Map assessment generation flow.
- Map payment flow.
- List required environment variables by name only.
- Identify Replit-specific assumptions.
- Identify PayPal-specific assumptions.
- Identify Lemon Squeezy review gaps.

Expected result:
- A practical system map.
- A list of migration risks.
- Clear decisions about what to keep, replace, or disable.

## Phase 2: Database V2 For Analysis

Goal: Store enough evidence to understand why each customer result was generated.

Tasks:
- Design and add database changes for generation evidence.
- Preserve final customer-facing outputs.
- Preserve user answers and open answers.
- Preserve decision/matrix/scoring snapshots.
- Preserve prompt/model/provider metadata.
- Preserve generation errors and retry state.

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
- Update the decision engine to return a structured decision snapshot.
- Update V2 generation to save:
  - answers snapshot
  - decision snapshot
  - prompt/input metadata
  - final instruction
  - report content
  - model/provider details
  - failure details when generation fails
- Make retry/failure states easier to inspect.

Expected result:
- No completed report is a black box.
- Failed reports contain enough information for support and improvement.

## Phase 4: Admin V2

Goal: Turn admin from a basic management page into a practical review and operations dashboard.

Tasks:
- Add a dashboard with:
  - users count
  - assessments by status
  - payments by status
  - failed and pending retry counts
  - latest assessments
- Improve assessment detail view with:
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
- Add admin tools:
  - regenerate report
  - retry failed assessment
  - resend email
  - enable or disable share
  - export JSON/CSV
- Add filters:
  - status
  - language
  - domain
  - model/provider
  - failed/completed

Expected result:
- The operator can inspect and improve real customer outputs.
- Support and quality review become much easier.

## Phase 5: Auth Review

Goal: Keep authentication sufficient and avoid unnecessary complexity before migration.

Tasks:
- Review current email/password flow.
- Review refresh token behavior.
- Review cookie security.
- Review admin session behavior.
- Add small security improvements only if needed.
- Defer Google login unless there is a clear product need.

Expected result:
- Current auth remains usable and safe enough for early launch.
- OAuth complexity is avoided until needed.

## Phase 6: Lemon Squeezy Review Readiness

Goal: Prepare the site and demo flow before requesting Lemon Squeezy approval.

Tasks:
- Confirm `/terms`, `/privacy`, and `/refund-policy`.
- Confirm footer legal links.
- Remove or hide broken PayPal checkout from the customer review path.
- Make product, price, delivery, and digital nature clear.
- Prepare a review/demo flow:
  - landing page
  - start assessment
  - complete assessment
  - view generated or demo result
  - legal pages
- Prepare video talking points:
  - product is digital
  - no physical shipping
  - no professional advice
  - Lemon Squeezy will process payments after approval

Expected result:
- Reviewers see a coherent digital product.
- No broken checkout blocks approval.
- The site is ready to record and submit.

## Phase 7: Payment Strategy

Goal: Stop relying on broken PayPal flow and prepare clean Lemon Squeezy integration after approval.

Before approval:
- Hide PayPal from the main customer experience.
- Keep payment state internally ready.
- Use admin/free/manual completion only for testing if needed.

After approval:
- Add Lemon Squeezy checkout.
- Add Lemon Squeezy webhook.
- Update payment records to support:
  - `processor`
  - `processor_order_id`
  - `checkout_id`
  - `customer_email`
  - `currency`
  - `refund_status`
- Link webhook payment confirmation to assessment/report generation.
- Test successful payment, duplicate webhook, failed payment, and refund states.

Expected result:
- A reliable payment path.
- Payment schema is not locked to PayPal.
- Lemon Squeezy can become the production processor.

## Phase 8: Supabase Migration

Goal: Move to a clean Supabase PostgreSQL database.

Tasks:
- Create a Supabase project.
- Run migrations.
- Update local `DATABASE_URL`.
- Test:
  - register
  - login
  - assessment start
  - assessment submit
  - report generation
  - admin review
- Decide whether any old data is worth manually importing.

Expected result:
- The app works against Supabase.
- Replit database is no longer required for the new version.

## Phase 9: Deployment Outside Replit

Goal: Run the new version from GitHub on a cleaner deployment platform.

Tasks:
- Decide deployment shape:
  - one Node service for frontend build plus API, or
  - separate frontend and API services.
- Choose platform after audit.
- Configure build commands.
- Configure environment variables.
- Deploy staging URL.
- Test end to end on staging.
- Document deployment process.

Expected result:
- A staging deployment independent from Replit.
- GitHub remains the source of truth.
- Replit becomes legacy/backup.

## Phase 10: Final QA And Launch Decision

Goal: Confirm the migrated version is ready for early users and Lemon Squeezy review.

Tasks:
- Test registration.
- Test login/logout.
- Test assessment flow.
- Test generation.
- Test results page.
- Test admin page.
- Test legal pages.
- Test mobile and desktop.
- Review copy.
- Record Lemon Squeezy video.
- Submit Lemon Squeezy review.

Expected result:
- A stable review-ready website.
- A clear operator workflow.
- A practical basis for early users and future launch.

## Recommended Execution Order

1. Clean current branch and commit legal pages.
2. Complete technical audit.
3. Design DB v2 and migrations.
4. Save generation and decision snapshots.
5. Build admin assessment detail.
6. Hide or disable PayPal from the review path.
7. Set up Supabase.
8. Deploy staging.
9. Polish Lemon Squeezy review flow.
10. Integrate Lemon Squeezy after approval.
