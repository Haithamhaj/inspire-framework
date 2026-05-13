#!/bin/sh
set -eu

if [ -n "${SUPABASE_DATABASE_URL:-}" ]; then
  export DATABASE_URL="$SUPABASE_DATABASE_URL"
fi

exec node --enable-source-maps artifacts/api-server/dist/index.mjs
