CREATE TABLE IF NOT EXISTS assessment_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE cascade,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE cascade,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  useful_answer text,
  most_useful text,
  missing text
);

CREATE UNIQUE INDEX IF NOT EXISTS assessment_feedback_assessment_user_idx
  ON assessment_feedback (assessment_id, user_id);
