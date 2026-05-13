ALTER TABLE assessment_feedback
  ADD COLUMN IF NOT EXISTS copied_instructions boolean DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS feedback_source text;
