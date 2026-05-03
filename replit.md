# Workspace

## Overview

This project is an INSPIRE Framework web application, a behavioral profiling web app with an Arabic RTL interface. It's built as a pnpm workspace monorepo using TypeScript. The application aims to provide comprehensive behavioral assessments and generate detailed reports.

The project utilizes a modern web stack including Express 5 for the API server, PostgreSQL with Drizzle ORM for data persistence, and React for the frontend. Key capabilities include:

- **Behavioral Assessments**: Offers a multi-stage assessment process with 21 core questions and various scenarios.
- **AI-Powered Reporting**: Generates in-depth behavioral reports using AI models (OpenAI and Anthropic), parsing outputs into 8 distinct sections.
- **User Authentication**: Secure user registration, login, and session management.
- **Admin Dashboard**: Provides administrative tools for monitoring KPIs, managing assessments, and exporting data.
- **Multi-language Support**: Bilingual Arabic and English content, with a default Arabic RTL interface.
- **PDF Generation**: Creates downloadable PDF reports of assessment results.
- **Email Notifications**: Sends assessment results and failure notifications via email.

The business vision is to deliver a robust, scalable platform for behavioral analysis, offering valuable insights to users through an intuitive and culturally adapted interface.

## User Preferences

- Arabic RTL is default (`<html lang="ar" dir="rtl">`)
- AI calls are server-side ONLY (never in components)
- 8 output sections stored separately in DB (never merged)
- User account required before assessment (no anonymous)
- Consent page required before registration

## System Architecture

The project is structured as a pnpm monorepo with distinct packages for deployable applications (`artifacts/`) and shared libraries (`lib/`).

**Monorepo Structure & Build:**
- **pnpm workspaces**: Manages dependencies and scripts across packages.
- **TypeScript**: Version 5.9, with composite projects for efficient type-checking across packages. `tsc --build --emitDeclarationOnly` is used for type-checking, while `esbuild` handles actual JS bundling.
- **Root Scripts**: `pnpm run build` (typecheck + package builds), `pnpm run typecheck` (full monorepo typecheck).

**Frontend (artifacts/inspire-web):**
- **UI/UX**: Arabic RTL interface by default, using Tajawal font. Primary color `#1a1a2e`, accent `#e94560`.
- **Core Pages**:
    - `landing.tsx`: Comprehensive landing page with hero, how-it-works, benefits, FAQ, and CTAs.
    - `register.tsx`, `login.tsx`, `privacy-consent.tsx`: User authentication and consent flows.
    - `assess.tsx`: The main multi-step assessment wizard (10 steps for full assessment, 3 questions per page). Fetches questions from the API.
    - `assess-mini.tsx`: Separate mini-assessment flow.
    - `results.tsx`: Displays comprehensive assessment results, including INSPIRE bars, quick starters, and PDF download options. Includes skeleton loaders and animated processing screens.
    - `my-assessments.tsx`: User history of assessments with comparison functionality.
    - `admin.tsx`: Admin dashboard with stats, assessment search, pagination, and CSV export.
- **State Management**: `use-auth.tsx` for authentication context, storing access tokens in memory.

**Backend (artifacts/api-server):**
- **Framework**: Express 5.
- **Routing**: Organized by `src/routes/` (e.g., `auth.ts`, `assessments.ts`, `results.ts`, `admin.ts`, `questions.ts`).
- **Data Handling**:
    - `src/data/questions-v2.ts`, `option-routing.ts`: Stores v2 assessment questions, options, and their associated behavioral signals and report metadata.
    - `src/lib/validators.ts`: Zod schemas for request validation (`MiniSubmitSchema`, `V2SubmitSchema`).
    - `src/lib/prompt-builder.ts`: Constructs prompts for AI, collecting behavioral signals and defining output structure (`buildPromptV2`, `buildMiniPrompt`).
    - `src/lib/report-parser.ts`: Parses AI-generated reports into structured data, mapping markers to DB fields (`parseFullReportV2`).
    - `src/lib/ai-engine.ts`: Manages AI interactions, retries, and fallback logic (`generateReportV2`).
    - `src/lib/rate-limit.ts`: In-memory IP-based rate limiter for critical endpoints.
- **Authentication**: `src/lib/auth.ts` handles bcrypt password hashing, JOSE JWT for access/refresh tokens, cookie management, and email verification token generation.
- **File Management**: `src/lib/pdf.ts` generates and saves PDF reports to `/public/pdfs/`.
- **Cron Jobs**: `GET /api/cron/retry` for background AI retry queue processing.

**Database Layer (lib/db):**
- **ORM**: Drizzle ORM for PostgreSQL.
- **Schema**: Defined in `src/schema/` (`users.ts`, `refresh-tokens.ts`, `assessments.ts`, `admin-sessions.ts`). Drizzle Kit is used for migrations.
- **Exports**: Drizzle client instance and schema models.

**API Specification & Codegen (lib/api-spec):**
- **OpenAPI**: `openapi.yaml` defines the API contract.
- **Orval**: Configured via `orval.config.ts` to generate API clients.
    - `lib/api-client-react`: Generates React Query hooks and fetch clients.
    - `lib/api-zod`: Generates Zod schemas for API request/response validation.

**Shared Utility Scripts (scripts):**
- A dedicated package for miscellaneous utility scripts, runnable via `pnpm --filter @workspace/scripts run <script>`.

## External Dependencies

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API Codegen**: Orval
- **AI Services**: OpenAI (gpt-4o), Anthropic (claude-sonnet-4-5)
- **Email Service**: Resend (for sending assessment results and failure notifications)
- **PDF Generation**: `@react-pdf/renderer`
- **Authentication**: `bcrypt`, `jose` (JWT)
- **HTTP Client**: `pg` (for PostgreSQL connection pool)