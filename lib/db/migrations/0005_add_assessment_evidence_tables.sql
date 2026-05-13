CREATE TABLE IF NOT EXISTS assessment_decision_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE cascade,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE cascade,
  decision_engine_version text NOT NULL,
  answers_snapshot jsonb NOT NULL,
  matrix_snapshot jsonb NOT NULL,
  scoring_snapshot jsonb NOT NULL,
  selected_rules jsonb NOT NULL,
  selected_roles jsonb NOT NULL,
  selected_red_lines jsonb NOT NULL,
  selected_output_rules jsonb NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS assessment_decision_snapshots_assessment_idx
  ON assessment_decision_snapshots (assessment_id);

CREATE INDEX IF NOT EXISTS assessment_decision_snapshots_user_id_idx
  ON assessment_decision_snapshots (user_id);

CREATE TABLE IF NOT EXISTS assessment_generation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE cascade,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE cascade,
  assessment_type text NOT NULL,
  status text NOT NULL DEFAULT 'processing',
  provider text,
  model text,
  prompt_version text NOT NULL,
  attempt_number integer NOT NULL DEFAULT 1,
  started_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp,
  error_message text,
  input_snapshot jsonb,
  output_snapshot jsonb
);

CREATE INDEX IF NOT EXISTS assessment_generation_runs_assessment_id_idx
  ON assessment_generation_runs (assessment_id);

CREATE INDEX IF NOT EXISTS assessment_generation_runs_user_id_idx
  ON assessment_generation_runs (user_id);

CREATE INDEX IF NOT EXISTS assessment_generation_runs_status_idx
  ON assessment_generation_runs (status);
