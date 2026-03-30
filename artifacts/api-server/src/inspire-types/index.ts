export type ReportLanguage = "ar" | "en" | "both";
export type AssessmentType = "full" | "mini";
export type AssessmentStatus =
  | "draft"
  | "processing"
  | "pending_retry"
  | "completed"
  | "failed";

export interface BehavioralAnswer {
  questionIndex: number;
  answerIndex: number;
}

export interface ScenarioAnswer {
  scenarioIndex: number;
  choice: "a" | "b";
}

export interface InspireAxisScore {
  axis: string;
  score: number;
  max: number;
  percentage: number;
  confidence: number;
  note: string;
}

export interface ParsedReport {
  inspireTable: InspireAxisScore[];
  roleAnalysis: string;
  redLines: string[];
  strengths: string[];
  developmentAreas: string[];
  recommendations: string[];
  systemInstruction: string;
  quickStarters: string[];
}

export interface PromptData {
  name: string;
  jobTitle?: string;
  projectName: string;
  projectGoal: string;
  reportLanguage: ReportLanguage;
  behavioralAnswers: BehavioralAnswer[];
  scenarioAnswers: ScenarioAnswer[];
  openAnswer: string;
}

export const INSPIRE_AXES = [
  "Intention",
  "Narrative",
  "Style",
  "Preferences",
  "Interaction",
  "Reflection",
  "Evaluation",
] as const;

export type InspireAxis = (typeof INSPIRE_AXES)[number];

export const INSPIRE_ACRONYM: Record<InspireAxis, string> = {
  Intention: "I",
  Narrative: "N",
  Style: "S",
  Preferences: "P",
  Interaction: "I",
  Reflection: "R",
  Evaluation: "E",
};

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  jobTitle?: string | null;
  emailVerified: boolean;
  plan: string;
  createdAt: Date;
}

export interface AssessmentSummary {
  id: string;
  projectName: string;
  assessmentType: AssessmentType;
  status: AssessmentStatus;
  reportLanguage: ReportLanguage;
  aiProvider?: string | null;
  aiModel?: string | null;
  createdAt: Date;
}
