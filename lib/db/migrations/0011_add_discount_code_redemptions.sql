CREATE TABLE IF NOT EXISTS discount_code_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now() NOT NULL,
  discount_code_id uuid NOT NULL REFERENCES discount_codes(id) ON DELETE cascade,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE cascade,
  payment_id uuid REFERENCES payments(id) ON DELETE set null
);

CREATE UNIQUE INDEX IF NOT EXISTS discount_code_redemptions_code_user_idx
  ON discount_code_redemptions (discount_code_id, user_id);

CREATE UNIQUE INDEX IF NOT EXISTS discount_code_redemptions_payment_idx
  ON discount_code_redemptions (payment_id)
  WHERE payment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS discount_code_redemptions_user_id_idx
  ON discount_code_redemptions (user_id);

CREATE INDEX IF NOT EXISTS discount_code_redemptions_discount_code_id_idx
  ON discount_code_redemptions (discount_code_id);

INSERT INTO discount_code_redemptions (discount_code_id, user_id, payment_id, created_at)
SELECT dc.id, p.user_id, p.id, COALESCE(p.created_at, now())
FROM payments p
JOIN discount_codes dc ON dc.code = p.discount_code
WHERE p.discount_code IS NOT NULL
  AND p.status = 'completed'
ON CONFLICT (discount_code_id, user_id) DO NOTHING;
