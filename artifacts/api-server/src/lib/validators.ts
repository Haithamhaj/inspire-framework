import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  job_title: z.string().max(200).optional(),
  consent_given: z.literal(true, {
    errorMap: () => ({ message: "You must accept the privacy policy" }),
  }),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const AssessmentStartSchema = z.object({
  project_name: z.string().min(2).max(500),
  project_goal: z.string().min(10).max(2000),
  report_language: z.enum(["ar", "en", "both"]),
  assessment_type: z.enum(["full", "mini"]),
});

export const AssessmentSubmitSchema = z.object({
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
  open_answer: z.string().min(20).max(2000),
  completion_time_seconds: z.number().int().positive(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type AssessmentStartInput = z.infer<typeof AssessmentStartSchema>;
export type AssessmentSubmitInput = z.infer<typeof AssessmentSubmitSchema>;
