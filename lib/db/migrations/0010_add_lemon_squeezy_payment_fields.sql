ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'paypal',
  ADD COLUMN IF NOT EXISTS lemon_checkout_id text,
  ADD COLUMN IF NOT EXISTS lemon_order_id text;

CREATE UNIQUE INDEX IF NOT EXISTS payments_lemon_checkout_id_unique
  ON payments (lemon_checkout_id)
  WHERE lemon_checkout_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS payments_lemon_order_id_unique
  ON payments (lemon_order_id)
  WHERE lemon_order_id IS NOT NULL;
