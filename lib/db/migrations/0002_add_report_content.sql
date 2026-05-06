ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS report_content jsonb;
