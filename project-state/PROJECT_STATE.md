# INSPIRE Operational State

## Current Goal
Keep the current Replit-hosted production app stable while planning the next product improvements on a separate work branch.

## Current Reality
- GitHub `main` is updated to commit `37db554` with the latest landing-page conversion pass.
- The local active planning branch is `codex/product-plan-next`, created after `main` was updated for deployment.
- Replit workspace was reset to `origin/main` at commit `37db554`, and the production build command passed there. Replit deployment still requires the owner to click/run Deploy from Replit.
- The app currently has a Vite frontend, Express API, PostgreSQL/Drizzle database, and legacy PayPal billing code.
- Official production domain: `https://inspire.next-stepai.com`.
- Latest production read-only smoke after the GitHub merge passed:
  - `/api/healthz` returned `{"status":"ok"}`.
  - `/pricing` returned `200`.
- Lemon Squeezy approval has been received. Payment integration is moving from disabled/manual review mode to Lemon Squeezy checkout/webhook activation.
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
- Admin dashboard now has operator actions for regenerate report, retry failed/pending generation, resend results email, enable/disable share links, and CSV/JSON exports with status/language/domain/provider/model/completed/failed filters.
- Customer password reset has been added in code with forgot-password request, one-hour reset token, reset email, new-password form, token clearing after use, and refresh-token revocation after reset.
- Supabase migration `add_password_reset_fields` was applied on May 14, 2026 and verified to add `password_reset_token` and `password_reset_expires` to `public.users`.
- Production QA found `/pricing` rendered the SPA 404; a dedicated `/pricing` route has been added with product, price, digital delivery, no-subscription, Lemon Squeezy processor, and legal-link copy for review readiness.
- Replit was updated to commit `920e831`, and production `/pricing` was verified on May 14, 2026: it no longer renders 404 and includes the $0 quick assessment, $10 full report, digital delivery, Lemon Squeezy processor, no-subscription, and legal-link copy.
- SEO audit found missing real `robots.txt`/`sitemap.xml`, thin static metadata, missing canonical/social tags, and no structured data. Technical SEO improvements have been added in code, with keyword and content strategy captured in `project-state/SEO_STRATEGY.md`.
- SEO topical authority work has started with a `/guides` hub and five initial guide pages targeting prompt writing, ChatGPT custom instructions, prompt engineering for work, AI operating profiles, and Arabic/bilingual AI prompts.
- SEO execution is now tracked in `project-state/SEO_EXECUTION_PLAN.md`.
- The first SEO trust/entity page set has been added locally: `/about`, `/research`, and `/contact`, with footer links, route metadata, sitemap coverage, `llms.txt` coverage, and route-level structured data.
- The initial guide pages have been expanded locally with practical prompt upgrade examples, FAQ sections, and route-level Article/FAQ structured data.
- Guide pages now explain the example-upgrade method in natural reader-facing language and include visible reference links to SSRN, OpenAI, Anthropic, and Google prompt-design resources.
- `/guides` and guide detail pages now localize their visible content and client-side page titles when Arabic is the active site language.
- Guide detail pages now include a secondary Smart Prompt Coach CTA that applies CRAFTS to a user's prompt without competing with the main INSPIRE assessment CTA.
- `/about`, `/research`, `/contact`, and `/pricing` now use more positive, confident Arabic/English copy and Arabic client-side SEO metadata when Arabic is active.
- Footer navigation labels now switch to Arabic when Arabic is active.
- `/terms`, `/privacy`, and `/refund-policy` now switch to Arabic professional legal copy and Arabic client-side SEO metadata when Arabic is active.
- Public Arabic pages now have `/ar/...` URLs, localized internal links, canonical URLs, `hreflang` alternates, and multilingual sitemap coverage. The old `?lang=ar` path still works as a compatibility fallback.
- The contact page and organization structured data now include the LinkedIn profile alongside the support email.
- Google Search Console domain ownership is verified, but the initial `sitemap.xml` submission returned `Couldn't fetch` while Replit rendered the XML as visible plain text in Chrome. A `sitemap.txt` fallback has been added for Search Console submission.
- Google Search Console now accepts `sitemap.xml` and reports 30 discovered pages.
- Review-facing product copy now explicitly states that INSPIRE is a premade self-serve digital assessment/report product, not consultation or custom-service sales.
- A hidden noindex `/review-demo` route now exists for Lemon Squeezy review video capture. It shows the product path only: assessment setup, answering questions, report generation, and digital report delivery using reviewer-safe sample data.
- The Lemon review MP4 at `docs/lemon-review/inspire-assessment-review-demo.mp4` has been updated to a clearer 1920x1080 product-flow video: answer selection examples, report generation, and report review through the end.
- Lemon Squeezy checkout activation is implemented locally: `BILLING_PROVIDER=lemon` creates server-side Lemon checkouts, stores Lemon checkout/order identifiers, accepts signed `order_created` webhooks, and starts the paid report generation after payment confirmation.
- A separate prototype branch `codex/guide-character-demo` is testing the INSPIRE guide character as an automatic sticky bar under the navbar on `/ar/guide-character-demo` and the landing page; it is not on `main` and does not change assessment, matrix, report, billing, or API logic.
- A newer prototype branch `codex/guide-character-motion-lab` adds `/ar/guide-character-motion-lab` to compare the current sprite character, an SVG motion-rig concept, and the new INSPIRE guide character direction using supplied JPG reference/motion sheets. It now uses selected cleaned WebP half-body and full-body pose assets for a more realistic visual review, but it remains a prototype because production animation still needs either clean layered exports, a `.riv` file, or a deliberate static-pose implementation decision.

## Active Decisions
- Do not make product changes directly on `main`; use `codex/next-work` or a new feature branch, then merge after verification.
- Treat Replit as the production deployment host for now, but remember it does not automatically deploy GitHub `main`.
- Keep Replit deployment intentional: GitHub updates do not change production until Replit deploy is run.
- Historical data is not critical; a clean Supabase database is acceptable if migration becomes costly.
- Replit remains the temporary deployment target because it is already paid for and configured.
- Next product-work order is documented at the top of `project-state/PRODUCT_IDEAS.md`.
- Activate Lemon Squeezy in test mode first (`LEMON_SQUEEZY_TEST_MODE=true`), verify one full checkout and webhook, then switch to live mode.

## Active Risks
- Lemon Squeezy environment variables and webhook settings must be correct before enabling checkout in production.
- Replit production deploys from the Replit workspace snapshot, not automatic GitHub push deploys.
- Supabase Data API/RLS posture still needs a production decision before launch.
- Node/Postgres requires Supabase CA handling for the pooler. Replit shell verification works with the durable checked-in CA path.
- Customer-facing paid completion now has code support for Lemon Squeezy, but still needs a real test-mode checkout/webhook verification on Replit before live mode.
- Replit workspace history previously had local-only commits; it was backed up/reset before the latest deploy preparation. Continue using explicit GitHub commit checks before each Replit deploy.
- Replit/Neon production database may still be connected as an unused resource. It is no longer receiving writes, but should be removed later to eliminate hidden environment injection and cost/confusion.

## Protected Areas
- Do not expose secrets from `.env.local`.
- Do not break the current `main`/Replit working baseline.
- Do not remove legacy data paths until replacements are verified.

## Next Recommended Action
Deploy the Lemon Squeezy integration to Replit in test mode, add the Lemon webhook URL, run one full checkout through `/assess`, and confirm the report starts generating after the `order_created` webhook.

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
- SEO strategy: `project-state/SEO_STRATEGY.md`
- SEO execution plan: `project-state/SEO_EXECUTION_PLAN.md`
- SEO measurement setup: `project-state/SEO_MEASUREMENT_SETUP.md`
- Product ideas backlog: `project-state/PRODUCT_IDEAS.md`
