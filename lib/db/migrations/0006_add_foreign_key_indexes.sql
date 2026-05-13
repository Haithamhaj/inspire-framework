CREATE INDEX IF NOT EXISTS assessments_user_id_idx
  ON assessments (user_id);

CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx
  ON refresh_tokens (user_id);

CREATE INDEX IF NOT EXISTS payments_user_id_idx
  ON payments (user_id);

CREATE INDEX IF NOT EXISTS payments_assessment_id_idx
  ON payments (assessment_id);

CREATE INDEX IF NOT EXISTS assessment_feedback_user_id_idx
  ON assessment_feedback (user_id);
