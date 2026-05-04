import {
  getOptionRoute,
  type ContradictionTag,
  type InspireInstructionSection,
  type RoleHint,
} from "../data/option-routing";
import {
  selectThinkingModes,
  type ThinkingModeProfile,
} from "./inspire-v2-thinking-modes";

export interface V2SelectedAnswer {
  questionId: string;
  optionId: string;
}

export interface InspireV2ComputedProfile {
  selectedAnswers: Array<{
    questionId: string;
    optionId: string;
    optionAr: string;
    optionEn: string;
    behavioralSignal: string;
    weightedScore: number;
  }>;
  inspireSectionScores: Record<InspireInstructionSection, number>;
  inspireSectionPercentages: Record<InspireInstructionSection, number>;
  lowCoverageNotes: Partial<Record<InspireInstructionSection, string>>;
  roleScores: Record<RoleHint, number>;
  domain: string;
  customDomain: string | null;
  domainSpecialization: string | null;
  projectContext: string | null;
  domainRole: string;
  domainSource: "selected_domain" | "project_context" | "open_answer" | "product_context";
  domainConfidence: "high" | "medium" | "low";
  primaryOperatingArchetype: string;
  secondaryOperatingMode: string | null;
  operatingModeTriggers: string[];
  /** @deprecated Use primaryOperatingArchetype. */
  primaryRole: string;
  /** @deprecated Use secondaryOperatingMode. */
  secondaryRole: string | null;
  /** @deprecated Use operatingModeTriggers. */
  secondaryRoleTrigger: string | null;
  contradictionTags: Record<ContradictionTag, number>;
  contradictionRulesGenerated: string[];
  confidenceIndex: {
    score: number;
    label: string;
  };
  topEvidenceLabels: string[];
  selectedInstructionRules: string[];
  selectedOutputRules: string[];
  selectedRedLines: string[];
  selectedRiskGuards: string[];
  openAnswerOverlay: {
    exists: boolean;
    affectsNumericScoring: false;
    affects: string[];
    note: string;
  };
  thinkingModeProfile: ThinkingModeProfile;
}

export const FINAL_INSPIRE_SECTIONS: InspireInstructionSection[] = [
  "IdentityRole",
  "NormsBoundaries",
  "StyleTone",
  "PrecisionSelfCheck",
  "InternalEvaluation",
  "ResponseStructure",
  "EnhancementAdaptation",
];

export const ROLE_HINTS: RoleHint[] = [
  "ExecutorBuilder",
  "StrategicOrganizer",
  "CriticalReviewer",
  "ThinkingPartner",
  "TeacherSimplifier",
  "AudienceTranslator",
];

export const ROLE_LABELS: Record<RoleHint, string> = {
  ExecutorBuilder: "Executor / Builder",
  StrategicOrganizer: "Strategic Organizer",
  CriticalReviewer: "Critical Reviewer",
  ThinkingPartner: "Thinking Partner",
  TeacherSimplifier: "Teacher / Simplifier",
  AudienceTranslator: "Audience Translator",
};

const CONTRADICTION_RULES: Record<ContradictionTag, string> = {
  speed_vs_precision:
    "Provide a quick actionable first version, then apply a concise verification step before finalizing.",
  autonomy_vs_guidance:
    "Proceed independently on clear tasks, but ask one focused question when requirements are missing.",
  brevity_vs_depth:
    "Start concise, then offer expandable detail if the task is complex.",
  creativity_vs_structure:
    "Offer creative options inside a structured comparison.",
  critique_vs_support:
    "Challenge weak logic without using harsh or motivational language.",
  adaptation_vs_stability:
    "Adapt to repeated corrections, but preserve stable rules unless the user explicitly changes them.",
};

const roundScore = (value: number): number => Math.round(value * 100) / 100;

const unique = (values: string[]): string[] => [...new Set(values.filter(Boolean))];

function normalizeDomain(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function baseDomainRole(domain: string): string {
  const normalized = domain.toLowerCase();
  if (/\b(coding|code|software|programming|development|frontend|backend|full[- ]?stack)\b/.test(normalized)) {
    return "software development assistant";
  }
  if (/\b(it|systems?|infrastructure|helpdesk|network|security)\b/.test(normalized)) {
    return "IT systems and support assistant";
  }
  if (/\b(marketing|brand|growth|content|seo)\b/.test(normalized)) {
    return "marketing strategy assistant";
  }
  if (/\b(education|teaching|learning|training|course)\b/.test(normalized)) {
    return "educational coaching assistant";
  }
  if (/\b(accounting|tax|finance|bookkeeping|financial)\b/.test(normalized)) {
    return "finance assistant";
  }
  if (/\b(economics|economic|market analysis)\b/.test(normalized)) {
    return "economic analysis assistant";
  }
  if (/\b(workflow|operations|process|automation)\b/.test(normalized)) {
    return "workflow and operations assistant";
  }
  if (/\b(sales|customer service|support|client)\b/.test(normalized)) {
    return "sales and customer service assistant";
  }
  if (/\b(hr|human resources|people operations|talent|recruiting)\b/.test(normalized)) {
    return "HR assistant";
  }
  if (/\b(healthcare|health|medical|clinical)\b/.test(normalized)) {
    return "healthcare assistant";
  }
  if (/\b(legal|law|contract|compliance)\b/.test(normalized)) {
    return "legal assistant";
  }
  return `${domain} assistant`;
}

function specialistDomainRole(domain: string, specialization: string, isCustomDomain: boolean): string {
  const compactSpecialization = specialization.replace(/\s*\/\s*/g, "/").trim();
  if (isCustomDomain) {
    return `${domain.toLowerCase()} / ${compactSpecialization} assistant`;
  }
  return `${compactSpecialization} expert`;
}

function deriveDomainProfile(params: {
  domain: string;
  customDomain?: string;
  domainSpecialization?: string;
  projectContext?: string;
}): Pick<
  InspireV2ComputedProfile,
  | "domain"
  | "customDomain"
  | "domainSpecialization"
  | "projectContext"
  | "domainRole"
  | "domainSource"
  | "domainConfidence"
> {
  const selectedDomain = normalizeDomain(params.domain || "");
  const customDomain = params.customDomain?.trim() ? normalizeDomain(params.customDomain) : null;
  const isOther = selectedDomain === "Other";
  const domain = isOther ? customDomain || "" : selectedDomain;
  const specialization = params.domainSpecialization?.trim() || null;
  const projectContext = params.projectContext?.trim() || null;

  if (!domain) {
    return {
      domain: "Unavailable",
      customDomain,
      domainSpecialization: specialization,
      projectContext,
      domainRole: "general AI interaction assistant",
      domainSource: "product_context",
      domainConfidence: "low",
    };
  }

  return {
    domain,
    customDomain,
    domainSpecialization: specialization,
    projectContext,
    domainRole: specialization
      ? specialistDomainRole(domain, specialization, isOther)
      : baseDomainRole(domain),
    domainSource: "selected_domain",
    domainConfidence: specialization ? "high" : "medium",
  };
}

export function computeInspireV2Profile(params: {
  answers: V2SelectedAnswer[];
  domain: string;
  customDomain?: string;
  domainSpecialization?: string;
  projectContext?: string;
  openAnswer?: string;
}): InspireV2ComputedProfile {
  const domainProfile = deriveDomainProfile({
    domain: params.domain,
    customDomain: params.customDomain,
    domainSpecialization: params.domainSpecialization,
    projectContext: params.projectContext,
  });

  const selectedRoutes = params.answers
    .map((answer) => getOptionRoute(answer.questionId, answer.optionId))
    .filter((route): route is NonNullable<typeof route> => Boolean(route));

  const weightedRoutes = selectedRoutes.map((route) => ({
    route,
    weightedScore: roundScore(route.questionWeight * route.optionStrengthWeight),
  }));

  const totalWeightedScore =
    weightedRoutes.reduce((sum, entry) => sum + entry.weightedScore, 0) || 1;

  const inspireSectionScores = Object.fromEntries(
    FINAL_INSPIRE_SECTIONS.map((section) => [section, 0])
  ) as Record<InspireInstructionSection, number>;

  const roleScores = Object.fromEntries(ROLE_HINTS.map((role) => [role, 0])) as Record<
    RoleHint,
    number
  >;

  const contradictionCounts = new Map<ContradictionTag, number>();
  let confidenceScore = 0;

  for (const entry of weightedRoutes) {
    for (const section of FINAL_INSPIRE_SECTIONS) {
      inspireSectionScores[section] +=
        entry.weightedScore * entry.route.inspireAllocation[section];
    }
    for (const role of ROLE_HINTS) {
      roleScores[role] += entry.weightedScore * entry.route.roleHints[role];
    }
    for (const tag of entry.route.contradictionTags) {
      contradictionCounts.set(tag, (contradictionCounts.get(tag) ?? 0) + 1);
    }
    confidenceScore += entry.weightedScore * entry.route.confidenceEffect;
  }

  for (const section of FINAL_INSPIRE_SECTIONS) {
    inspireSectionScores[section] = roundScore(inspireSectionScores[section]);
  }
  for (const role of ROLE_HINTS) {
    roleScores[role] = roundScore(roleScores[role]);
  }

  const inspireSectionPercentages = Object.fromEntries(
    FINAL_INSPIRE_SECTIONS.map((section) => [
      section,
      Math.round((inspireSectionScores[section] / totalWeightedScore) * 100),
    ])
  ) as Record<InspireInstructionSection, number>;

  const lowCoverageNotes = Object.fromEntries(
    FINAL_INSPIRE_SECTIONS.filter((section) => inspireSectionScores[section] <= 0).map(
      (section) => [section, "No selected option allocated numeric coverage to this section."]
    )
  ) as Partial<Record<InspireInstructionSection, string>>;

  const roleRows = ROLE_HINTS.map((role) => ({
    role,
    label: ROLE_LABELS[role],
    score: roleScores[role],
  })).sort((a, b) => b.score - a.score);

  const primaryRoleRow = roleRows[0]?.score > 0 ? roleRows[0] : null;
  const secondaryThreshold = primaryRoleRow ? Math.max(2, primaryRoleRow.score * 0.55) : 0;
  const secondaryRoleRow =
    primaryRoleRow && roleRows[1]?.score >= secondaryThreshold ? roleRows[1] : null;
  const primaryOperatingArchetype = primaryRoleRow?.label ?? "No strong primary operating archetype";
  const secondaryOperatingMode = secondaryRoleRow?.label ?? null;
  const operatingModeTriggers = secondaryRoleRow
    ? [
        `Activate ${secondaryRoleRow.label} only when the task needs that mode; score ${secondaryRoleRow.score} met threshold ${roundScore(
          secondaryThreshold
        )}.`,
      ]
    : [];

  const confidenceLabel =
    confidenceScore >= 8
      ? "High behavioral clarity"
      : confidenceScore >= 3
        ? "Moderate behavioral clarity"
        : confidenceScore >= 0
          ? "Mixed but usable clarity"
          : "Low clarity / unstable preference signals";

  const sortedContradictions = [...contradictionCounts.entries()].sort((a, b) => b[1] - a[1]);
  const contradictionTags = Object.fromEntries(sortedContradictions) as Record<
    ContradictionTag,
    number
  >;

  const evidenceRows = weightedRoutes
    .map(({ route, weightedScore }) => ({
      label: `${route.behavioralSignal.replace(/_/g, " ")} (${route.questionId}:${route.optionId})`,
      weightedScore,
    }))
    .sort((a, b) => b.weightedScore - a.weightedScore);

  const selectedInstructionRules = unique(
    weightedRoutes
      .filter(({ route }) => route.ruleTextEn && route.ruleTextEn !== "—")
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .map(({ route }) => route.ruleTextEn)
  ).slice(0, 10);

  const selectedOutputRules = unique(
    weightedRoutes
      .filter(({ route }) => route.instructionSections.includes("output_rules"))
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .map(({ route }) => route.ruleTextEn)
  ).slice(0, 8);

  const selectedRedLines = unique(
    weightedRoutes
      .filter(({ route }) => route.redLineEffect)
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .map(({ route }) => route.redLineEffect ?? "")
  ).slice(0, 8);

  const selectedRiskGuards = unique(
    weightedRoutes
      .filter(({ route }) => route.riskGuard && route.riskGuard !== "—")
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .map(({ route }) => route.riskGuard)
  ).slice(0, 10);

  const topEvidenceLabels = evidenceRows.slice(0, 8).map((row) => row.label);
  const thinkingModeProfile = selectThinkingModes({
    roleScores,
    inspireSectionScores,
    inspireSectionPercentages,
    contradictionTags,
    selectedInstructionRules,
    selectedOutputRules,
    selectedRedLines,
    selectedRiskGuards,
    topEvidenceLabels,
    domain: domainProfile.domain,
    domainRole: domainProfile.domainRole,
    domainSpecialization: domainProfile.domainSpecialization,
    projectContext: domainProfile.projectContext,
    openAnswer: params.openAnswer,
  });

  return {
    selectedAnswers: weightedRoutes.map(({ route, weightedScore }) => ({
      questionId: route.questionId,
      optionId: route.optionId,
      optionAr: route.optionAr,
      optionEn: route.optionEn,
      behavioralSignal: route.behavioralSignal,
      weightedScore,
    })),
    inspireSectionScores,
    inspireSectionPercentages,
    lowCoverageNotes,
    roleScores,
    ...domainProfile,
    primaryOperatingArchetype,
    secondaryOperatingMode,
    operatingModeTriggers,
    primaryRole: primaryOperatingArchetype,
    secondaryRole: secondaryOperatingMode,
    secondaryRoleTrigger: operatingModeTriggers[0] ?? null,
    contradictionTags,
    contradictionRulesGenerated: sortedContradictions.map(([tag]) => CONTRADICTION_RULES[tag]),
    confidenceIndex: {
      score: roundScore(confidenceScore),
      label: confidenceLabel,
    },
    topEvidenceLabels,
    selectedInstructionRules,
    selectedOutputRules,
    selectedRedLines,
    selectedRiskGuards,
    openAnswerOverlay: {
      exists: Boolean(params.openAnswer?.trim()),
      affectsNumericScoring: false,
      affects: ["tone", "examples/domain", "red lines", "adaptation rules"],
      note:
        "The open-ended answer is passed to the AI writer as qualitative context only. It must not change INSPIRE section scores or role scores directly.",
    },
    thinkingModeProfile,
  };
}
