# Local Setup

Edit `.env.local` manually for local development. Do not paste real secrets into
`.env.example`, documentation, chat, or committed files.

## Mandatory For The App

- `DATABASE_URL`: PostgreSQL connection string used by the API and Drizzle.
- `PORT`: Required by the API server and Vite configs. Use `8080` for the API
  and a separate value such as `5173` when starting the web app.
- `BASE_PATH`: Required by Vite. Use `/` locally.
- `JWT_SECRET`: Required for auth tokens.

## Feature-Specific Values

- Admin: `ADMIN_PASSWORD`
- AI report generation: `OPENAI_API_KEY`
- AI fallback: `ANTHROPIC_API_KEY`
- Email delivery: `RESEND_API_KEY`, `FROM_NAME`, `FROM_EMAIL`, `APP_URL`
- Internal failure alerts: `ADMIN_ALERT_EMAIL`
- PayPal checkout: `PAYPAL_ENV`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`,
  `ASSESSMENT_PRICE`

## Optional Defaults

- `NODE_ENV`: defaults by command/runtime; use `development` locally.
- `JWT_EXPIRES_IN`: defaults to `7d`.
- `BCRYPT_ROUNDS`: defaults to `12`.
- `OPENAI_MODEL`: defaults to `gpt-5.4`.
- `ANTHROPIC_MODEL`: defaults to `claude-sonnet-4-6`.
- `LOG_LEVEL`: defaults to `info`.
- `REPL_ID`: Replit-only Vite plugin flag.
- `CRON_SECRET`: legacy documentation reference only. Current source protects
  `POST /api/cron/retry` with `ADMIN_PASSWORD`.

## Common Local Commands

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm build
```

Example web startup:

```sh
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/inspire-web run dev
```

Example API startup after filling `.env.local`:

```sh
set -a
source .env.local
set +a
PORT=8080 pnpm --filter @workspace/api-server run dev
```
