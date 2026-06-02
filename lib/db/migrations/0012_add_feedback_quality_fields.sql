ALTER TABLE assessment_feedback
  ADD COLUMN IF NOT EXISTS feedback_category text,
  ADD COLUMN IF NOT EXISTS used_instructions boolean;

CREATE INDEX IF NOT EXISTS assessment_feedback_rating_idx
  ON assessment_feedback (rating);

CREATE INDEX IF NOT EXISTS assessment_feedback_category_idx
  ON assessment_feedback (feedback_category);
