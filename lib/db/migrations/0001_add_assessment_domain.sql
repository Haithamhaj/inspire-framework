ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS domain text,
  ADD COLUMN IF NOT EXISTS custom_domain text,
  ADD COLUMN IF NOT EXISTS domain_specialization text,
  ADD COLUMN IF NOT EXISTS project_context text;
