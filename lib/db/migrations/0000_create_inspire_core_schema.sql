CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL,
  job_title text,
  email_verified boolean DEFAULT false NOT NULL,
  email_verify_token text,
  email_verify_expires timestamp,
  consent_given boolean DEFAULT false NOT NULL,
  consent_at timestamp,
  is_active boolean DEFAULT true NOT NULL,
  last_login_at timestamp,
  plan text DEFAULT 'free' NOT NULL
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE cascade,
  token text UNIQUE NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  expires_at timestamp NOT NULL,
  revoked boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  expires_at timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE cascade,
  project_name text NOT NULL,
  project_goal text NOT NULL,
  domain text,
  custom_domain text,
  domain_specialization text,
  project_context text,
  report_language text DEFAULT 'ar' NOT NULL,
  assessment_type text DEFAULT 'full' NOT NULL,
  behavioral_answers jsonb,
  scenario_answers jsonb,
  open_answer text,
  inspire_table jsonb,
  role_analysis text,
  red_lines jsonb,
  strengths jsonb,
  development_areas jsonb,
  recommendations jsonb,
  system_instruction text,
  quick_starters jsonb,
  report_content jsonb,
  ai_provider text,
  ai_model text,
  status text DEFAULT 'draft' NOT NULL,
  retry_count integer DEFAULT 0 NOT NULL,
  next_retry_at timestamp,
  email_sent boolean DEFAULT false NOT NULL,
  email_sent_at timestamp,
  pdf_generated boolean DEFAULT false NOT NULL,
  pdf_url text,
  completion_time_seconds integer,
  previous_assessment_id uuid,
  share_token text UNIQUE,
  share_enabled boolean DEFAULT false NOT NULL,
  payment_id uuid
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE cascade,
  assessment_id uuid REFERENCES assessments(id) ON DELETE set null,
  paypal_order_id text UNIQUE,
  amount numeric(10, 2) NOT NULL,
  original_amount numeric(10, 2) NOT NULL,
  discount_code text,
  discount_percent integer DEFAULT 0 NOT NULL,
  status text DEFAULT 'pending' NOT NULL
);

CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  code text UNIQUE NOT NULL,
  discount_percent integer NOT NULL,
  max_uses integer,
  used_count integer DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  expires_at timestamp,
  user_id uuid REFERENCES users(id) ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS discount_codes_user_id_idx
  ON discount_codes (user_id);

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
