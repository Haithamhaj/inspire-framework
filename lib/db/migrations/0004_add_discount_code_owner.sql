ALTER TABLE discount_codes
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE cascade;

CREATE INDEX IF NOT EXISTS discount_codes_user_id_idx
  ON discount_codes (user_id);
