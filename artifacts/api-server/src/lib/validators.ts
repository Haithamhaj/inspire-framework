import { z } from "zod";

const DOMAIN_OPTIONS = [
  "Coding / Software Development",
  "IT / Systems & Support",
  "Marketing",
  "Education",
  "Finance",
  "Operations",
  "Sales / Customer Service",
  "HR",
  "Healthcare",
  "Legal",
  "Other",
] as const;

export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  job_title: z.string().max(200).optional(),
  consent_given: z.boolean().refine((v) => v === true, {
    message: "You must accept the privacy policy",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const AssessmentStartSchema = z.object({
  project_name: z.string().min(2).max(500).optional(),
  project_goal: z.string().min(10).max(2000).optional(),
  domain: z.enum(DOMAIN_OPTIONS),
  custom_domain: z.string().max(200).optional().nullable(),
  domain_specialization: z.string().max(300).optional().nullable(),
  project_context: z.string().max(2000).optional().nullable(),
  report_language: z.enum(["ar", "en", "both"]),
  assessment_type: z.enum(["full", "mini"]),
  previous_assessment_id: z.string().uuid().optional(),
  payment_id: z.string().uuid().optional(),
}).superRefine((data, ctx) => {
  if (data.domain === "Other" && !data.custom_domain?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["custom_domain"],
      message: "custom_domain is required when domain is Other",
    });
  }
});

// ─── Mini path (snake_case, unchanged) ───────────────────────────────────────
export const MiniSubmitSchema = z.object({
  behavioral_answers: z.array(
    z.object({
      question_index: z.number().int().min(0).max(23),
      answer_index: z.number().int().min(0).max(3),
    })
  ),
  scenario_answers: z.array(
    z.object({
      scenario_index: z.number().int().min(0).max(7),
      choice: z.enum(["a", "b"]),
    })
  ),
  open_answer: z.string().min(1).max(2000),
  completion_time_seconds: z.number().int().positive(),
});

// ─── V2 full path (camelCase) ─────────────────────────────────────────────────
export const V2SubmitSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        optionId: z.string().min(1),
      })
    )
    .length(21, "Exactly 21 answers required"),
  open_answer: z.string().max(2000).optional(),
  completion_time_seconds: z.number().int().positive(),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  job_title: z.string().max(200).optional().nullable(),
  current_password: z.string().optional(),
  new_password: z
    .string()
    .min(8)
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .optional(),
}).refine(
  (d) => {
    const hasCurrent = !!d.current_password;
    const hasNew = !!d.new_password;
    return hasCurrent === hasNew;
  },
  { message: "current_password and new_password must both be provided or both omitted" }
);

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type AssessmentStartInput = z.infer<typeof AssessmentStartSchema>;
export type MiniSubmitInput = z.infer<typeof MiniSubmitSchema>;
export type V2SubmitInput = z.infer<typeof V2SubmitSchema>;
