ALTER TABLE discount_codes
  ADD COLUMN IF NOT EXISTS starts_at timestamp;
