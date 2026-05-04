import type {
  ContradictionTag,
  InspireInstructionSection,
  RoleHint,
} from "../data/option-routing";

export type ThinkingModeId =
  | "step_back_reasoning"
  | "structured_reasoning"
  | "devils_advocate_weakness_detection"
  | "scenario_testing"
  | "tree_of_thoughts_alternatives_exploration"
  | "self_consistency_quality_gate"
  | "react_action_oriented_reasoning"
  | "fact_verification_evidence_check"
  | "source_aware_reasoning"
  | "assumption_check"
  | "risk_guard_reasoning"
  | "readiness_gate"
  | "decision_review"
  | "counterexample_testing"
  | "consistency_check"
  | "clarification_gate"
  | "scope_control_anti_sprawl"
  | "recovery_revert_reasoning";

export type ThinkingModeCategory = "core" | "conditional" | "guard";
export type ThinkingModePriorityLevel = "high" | "medium" | "low";

export interface ThinkingModeCatalogEntry {
  modeId: ThinkingModeId;
  displayName: string;
  category: ThinkingModeCategory;
  trigger: string;
  whenToUse: string;
  howToApply: string;
  whenNotToUse: string;
}

export interface ThinkingModeSelectionSignals {
  roleSignals: string[];
  inspireSectionSignals: string[];
  selectedRuleSignals: string[];
  contradictionSignals: string[];
  riskGuardSignals: string[];
  evidenceLabelSignals: string[];
  domainSignals: string[];
  openAnswerSignals: string[];
  exclusionSignals: string[];
}

export interface ThinkingModeSelection extends ThinkingModeCatalogEntry {
  priorityScore: number;
  priorityLevel: ThinkingModePriorityLevel;
  selectionSignals: ThinkingModeSelectionSignals;
}

export interface ThinkingModeProfile {
  selectedModes: ThinkingModeSelection[];
  coreModes: ThinkingModeSelection[];
  conditionalModes: ThinkingModeSelection[];
  guardModes: ThinkingModeSelection[];
  rejectedModes?: Array<{
    modeId: ThinkingModeId;
    reason: string;
  }>;
  summary: {
    primaryThinkingStyle: string;
    instructionSummary: string;
  };
}

interface ThinkingModeInput {
  roleScores: Record<RoleHint, number>;
  inspireSectionScores: Record<InspireInstructionSection, number>;
  inspireSectionPercentages: Record<InspireInstructionSection, number>;
  contradictionTags: Partial<Record<ContradictionTag, number>>;
  selectedInstructionRules: string[];
  selectedOutputRules: string[];
  selectedRedLines: string[];
  selectedRiskGuards: string[];
  topEvidenceLabels: string[];
  domain: string;
  domainRole: string;
  domainSpecialization: string | null;
  projectContext: string | null;
  openAnswer?: string;
}

type WeightedModeMap = Partial<Record<ThinkingModeId, number>>;
type SignalKey = keyof ThinkingModeSelectionSignals;

const THINKING_MODE_CATALOG: Record<ThinkingModeId, ThinkingModeCatalogEntry> = {
  step_back_reasoning: {
    modeId: "step_back_reasoning",
    displayName: "Step-Back Reasoning",
    category: "core",
    trigger: "Use when the problem is unclear, messy, or the apparent question may not be the real problem.",
    whenToUse:
      "Use when the request is unclear, broad, messy, or likely needs reframing before execution.",
    howToApply:
      "Briefly restate the real goal, name the missing or hidden frame, then proceed with the most useful interpretation.",
    whenNotToUse:
      "Do not use for simple direct execution where the goal and output are already clear.",
  },
  structured_reasoning: {
    modeId: "structured_reasoning",
    displayName: "Structured Reasoning",
    category: "core",
    trigger: "Use when the task needs logical structure, ordered explanation, comparison, or concise reasoning summary.",
    whenToUse:
      "Use when the user needs ordered explanation, comparison, sequencing, or a concise reasoning summary.",
    howToApply:
      "Organize the answer into clear steps, options, criteria, and a direct conclusion without exposing private chain-of-thought.",
    whenNotToUse:
      "Do not add heavy structure to a short factual answer or a small edit request.",
  },
  devils_advocate_weakness_detection: {
    modeId: "devils_advocate_weakness_detection",
    displayName: "Devil's Advocate / Weakness Detection",
    category: "core",
    trigger: "Use when reviewing logic, decisions, readiness, plans, reports, launch quality, or weak assumptions.",
    whenToUse:
      "Use when reviewing a decision, plan, launch, report, argument, or important recommendation.",
    howToApply:
      "Identify weak assumptions, gaps, contradictions, and likely failure points, then give a practical improvement path.",
    whenNotToUse:
      "Do not use harsh critique for a simple execution request that does not require review.",
  },
  scenario_testing: {
    modeId: "scenario_testing",
    displayName: "Scenario Testing",
    category: "conditional",
    trigger: "Use when a decision has multiple possible outcomes or paths.",
    whenToUse:
      "Use when outcomes vary by stakeholder, path, condition, or future scenario.",
    howToApply:
      "Compare a small set of likely scenarios, describe consequences, and identify the safest or highest-value path.",
    whenNotToUse:
      "Do not create scenarios when the task has one obvious path or the user asked for a single direct output.",
  },
  tree_of_thoughts_alternatives_exploration: {
    modeId: "tree_of_thoughts_alternatives_exploration",
    displayName: "Tree of Thoughts / Alternatives Exploration",
    category: "conditional",
    trigger: "Use when several solution paths exist and need comparison before choosing.",
    whenToUse:
      "Use when there are several plausible solution paths and choosing too early could reduce quality.",
    howToApply:
      "Present two or three viable paths, compare trade-offs, then recommend the strongest path.",
    whenNotToUse:
      "Do not overload the user with alternatives when the request is already specific.",
  },
  self_consistency_quality_gate: {
    modeId: "self_consistency_quality_gate",
    displayName: "Self-Consistency / Quality Gate",
    category: "core",
    trigger: "Use before important final outputs to check coherence, gaps, contradictions, and usability.",
    whenToUse:
      "Use before important final outputs, handoffs, reports, instructions, or recommendations.",
    howToApply:
      "Check coherence, missing pieces, contradictions, usability, and whether the output matches the stated goal.",
    whenNotToUse:
      "Do not add a visible quality gate to trivial answers unless the user asks for verification.",
  },
  react_action_oriented_reasoning: {
    modeId: "react_action_oriented_reasoning",
    displayName: "ReAct / Action-Oriented Reasoning",
    category: "core",
    trigger: "Use for execution, testing, debugging, implementation steps, and result verification.",
    whenToUse:
      "Use when the task requires implementation, debugging, testing, execution, or stepwise verification.",
    howToApply:
      "Take the next practical action, observe the result, adjust the plan, and verify the outcome.",
    whenNotToUse:
      "Do not use action loops for purely reflective or explanatory requests.",
  },
  fact_verification_evidence_check: {
    modeId: "fact_verification_evidence_check",
    displayName: "Fact Verification / Evidence Check",
    category: "conditional",
    trigger: "Use when information may be outdated, uncertain, disputed, factual, legal, technical, financial, or high-impact.",
    whenToUse:
      "Use when factual accuracy, evidence, freshness, or high-impact correctness matters.",
    howToApply:
      "Separate fact from inference and recommendation, verify unstable claims, and flag uncertainty clearly.",
    whenNotToUse:
      "Do not over-verify stable facts or subjective creative preferences.",
  },
  source_aware_reasoning: {
    modeId: "source_aware_reasoning",
    displayName: "Source-Aware Reasoning",
    category: "conditional",
    trigger: "Use when working from a document, file, policy, webpage, source, transcript, or reference material.",
    whenToUse:
      "Use when the user provides or references source material, files, documents, policies, web pages, or transcripts.",
    howToApply:
      "Ground the output in the source, preserve source boundaries, and avoid adding unsupported claims.",
    whenNotToUse:
      "Do not imply source support when no source material is present.",
  },
  assumption_check: {
    modeId: "assumption_check",
    displayName: "Assumption Check",
    category: "conditional",
    trigger: "Use when hidden assumptions affect the decision.",
    whenToUse:
      "Use when the answer depends on hidden, weak, or unconfirmed assumptions.",
    howToApply:
      "List the key assumptions that affect the decision and state how each one changes the recommendation.",
    whenNotToUse:
      "Do not list assumptions that do not materially affect the output.",
  },
  risk_guard_reasoning: {
    modeId: "risk_guard_reasoning",
    displayName: "Risk Guard Reasoning",
    category: "guard",
    trigger: "Use when the action may create loss, broken UX, wrong launch, wrong merge, wasted effort, or operational risk.",
    whenToUse:
      "Use when the task could create operational, launch, quality, UX, merge, cost, or trust risk.",
    howToApply:
      "Identify the likely failure mode, reduce the risk, and propose the safest next step.",
    whenNotToUse:
      "Do not block low-risk work with unnecessary warnings.",
  },
  readiness_gate: {
    modeId: "readiness_gate",
    displayName: "Readiness Gate",
    category: "guard",
    trigger: "Use before moving from one phase to another, launching, accepting, merging, or generating final output.",
    whenToUse:
      "Use before launch, merge, approval, acceptance, publishing, or final handoff.",
    howToApply:
      "Check required criteria, unresolved blockers, and whether the result is ready to move forward.",
    whenNotToUse:
      "Do not use when the user is exploring early ideas and has not asked for readiness.",
  },
  decision_review: {
    modeId: "decision_review",
    displayName: "Decision Review",
    category: "conditional",
    trigger: "Use when choosing a path, accepting/rejecting a change, or approving a recommendation.",
    whenToUse:
      "Use when the user needs to choose, accept, reject, approve, or prioritize a path.",
    howToApply:
      "Compare decision criteria, trade-offs, risks, and expected value, then recommend one path.",
    whenNotToUse:
      "Do not perform a decision review when no decision is being made.",
  },
  counterexample_testing: {
    modeId: "counterexample_testing",
    displayName: "Counterexample Testing",
    category: "conditional",
    trigger: "Use when a rule, conclusion, or assumption needs to be tested against exceptions.",
    whenToUse:
      "Use when a conclusion, rule, plan, or assumption may fail under edge cases or exceptions.",
    howToApply:
      "Test the claim against likely counterexamples and revise the recommendation if it breaks.",
    whenNotToUse:
      "Do not search for edge cases when the task is low-risk and already bounded.",
  },
  consistency_check: {
    modeId: "consistency_check",
    displayName: "Consistency Check",
    category: "conditional",
    trigger: "Use when many instructions, stages, files, or previous decisions must remain aligned.",
    whenToUse:
      "Use when multiple rules, files, stages, instructions, or previous decisions must remain aligned.",
    howToApply:
      "Check that terminology, decisions, constraints, and outputs do not contradict each other.",
    whenNotToUse:
      "Do not use for isolated tasks that have no cross-step dependencies.",
  },
  clarification_gate: {
    modeId: "clarification_gate",
    displayName: "Clarification Gate",
    category: "conditional",
    trigger: "Use when a missing detail blocks quality, but ask only one focused question if truly needed.",
    whenToUse:
      "Use when one missing detail would materially change quality or direction.",
    howToApply:
      "Ask one focused question, or state a clear assumption and proceed when the missing detail is not blocking.",
    whenNotToUse:
      "Do not ask clarification questions that only delay usable progress.",
  },
  scope_control_anti_sprawl: {
    modeId: "scope_control_anti_sprawl",
    displayName: "Scope Control / Anti-Sprawl",
    category: "guard",
    trigger: "Use when the task starts expanding beyond the agreed goal.",
    whenToUse:
      "Use when the work starts expanding, adding unrelated fixes, or drifting from the agreed goal.",
    howToApply:
      "Restate the agreed scope, separate out-of-scope items, and keep the next action focused.",
    whenNotToUse:
      "Do not reject useful adjacent work when the user explicitly broadens scope.",
  },
  recovery_revert_reasoning: {
    modeId: "recovery_revert_reasoning",
    displayName: "Recovery / Revert Reasoning",
    category: "guard",
    trigger: "Use when there is breakage, bad commit, wrong revert, damaged state, or need to return to last safe checkpoint.",
    whenToUse:
      "Use when work is broken, a revert is needed, a commit is bad, or state must return to a known-safe checkpoint.",
    howToApply:
      "Identify the safe checkpoint, preserve a backup, revert only the bad change, and verify the restored state.",
    whenNotToUse:
      "Do not use for normal forward implementation or minor edits.",
  },
};

const ROLE_AFFINITY: Record<RoleHint, WeightedModeMap> = {
  CriticalReviewer: {
    devils_advocate_weakness_detection: 7,
    counterexample_testing: 5,
    self_consistency_quality_gate: 5,
    risk_guard_reasoning: 4,
    fact_verification_evidence_check: 4,
  },
  ThinkingPartner: {
    step_back_reasoning: 6,
    tree_of_thoughts_alternatives_exploration: 7,
    scenario_testing: 5,
    clarification_gate: 4,
    assumption_check: 4,
  },
  ExecutorBuilder: {
    react_action_oriented_reasoning: 7,
    decision_review: 4,
    self_consistency_quality_gate: 4,
    scope_control_anti_sprawl: 3,
  },
  StrategicOrganizer: {
    step_back_reasoning: 5,
    scenario_testing: 4,
    decision_review: 5,
    readiness_gate: 4,
    consistency_check: 4,
  },
  TeacherSimplifier: {
    structured_reasoning: 6,
    source_aware_reasoning: 3,
    clarification_gate: 4,
    step_back_reasoning: 3,
  },
  AudienceTranslator: {
    source_aware_reasoning: 3,
    structured_reasoning: 5,
    consistency_check: 4,
    scenario_testing: 3,
  },
};

const SECTION_AFFINITY: Record<InspireInstructionSection, WeightedModeMap> = {
  IdentityRole: {
    step_back_reasoning: 1.5,
    decision_review: 1.5,
  },
  NormsBoundaries: {
    risk_guard_reasoning: 4,
    fact_verification_evidence_check: 3,
    readiness_gate: 3,
    scope_control_anti_sprawl: 3,
  },
  StyleTone: {},
  PrecisionSelfCheck: {
    fact_verification_evidence_check: 4,
    counterexample_testing: 3,
    self_consistency_quality_gate: 4,
    source_aware_reasoning: 2,
  },
  InternalEvaluation: {
    self_consistency_quality_gate: 4,
    consistency_check: 3,
    decision_review: 4,
    assumption_check: 2,
  },
  ResponseStructure: {
    structured_reasoning: 4,
    react_action_oriented_reasoning: 3,
    decision_review: 3,
    scenario_testing: 2,
  },
  EnhancementAdaptation: {
    clarification_gate: 3,
    scope_control_anti_sprawl: 3,
    recovery_revert_reasoning: 3,
    consistency_check: 2,
  },
};

const CONTRADICTION_AFFINITY: Record<ContradictionTag, WeightedModeMap> = {
  speed_vs_precision: {
    fact_verification_evidence_check: 3,
    self_consistency_quality_gate: 4,
    react_action_oriented_reasoning: 2,
  },
  creativity_vs_structure: {
    tree_of_thoughts_alternatives_exploration: 3,
    scenario_testing: 3,
    structured_reasoning: 3,
  },
  brevity_vs_depth: {
    step_back_reasoning: 2,
    structured_reasoning: 3,
    clarification_gate: 2,
  },
  critique_vs_support: {
    devils_advocate_weakness_detection: 4,
    decision_review: 3,
    risk_guard_reasoning: 3,
  },
  autonomy_vs_guidance: {
    clarification_gate: 3,
    react_action_oriented_reasoning: 2,
    decision_review: 2,
  },
  adaptation_vs_stability: {
    consistency_check: 4,
    scope_control_anti_sprawl: 3,
    recovery_revert_reasoning: 3,
  },
};

const MODE_OVERLAPS: Partial<Record<ThinkingModeId, ThinkingModeId[]>> = {
  self_consistency_quality_gate: ["readiness_gate"],
  readiness_gate: ["self_consistency_quality_gate"],
  tree_of_thoughts_alternatives_exploration: ["scenario_testing"],
  scenario_testing: ["tree_of_thoughts_alternatives_exploration"],
  fact_verification_evidence_check: ["source_aware_reasoning"],
  source_aware_reasoning: ["fact_verification_evidence_check"],
};

function emptySignals(): ThinkingModeSelectionSignals {
  return {
    roleSignals: [],
    inspireSectionSignals: [],
    selectedRuleSignals: [],
    contradictionSignals: [],
    riskGuardSignals: [],
    evidenceLabelSignals: [],
    domainSignals: [],
    openAnswerSignals: [],
    exclusionSignals: [],
  };
}

function priorityLevel(score: number): ThinkingModePriorityLevel {
  if (score >= 18) return "high";
  if (score >= 10) return "medium";
  return "low";
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").toLowerCase();
}

function addScore(
  scores: Map<ThinkingModeId, number>,
  signals: Map<ThinkingModeId, ThinkingModeSelectionSignals>,
  modeId: ThinkingModeId,
  amount: number,
  signalKey: SignalKey,
  signal: string
) {
  scores.set(modeId, (scores.get(modeId) ?? 0) + amount);
  const modeSignals = signals.get(modeId) ?? emptySignals();
  modeSignals[signalKey].push(signal);
  signals.set(modeId, modeSignals);
}

function applyWeightedMap(
  scores: Map<ThinkingModeId, number>,
  signals: Map<ThinkingModeId, ThinkingModeSelectionSignals>,
  weightedMap: WeightedModeMap,
  multiplier: number,
  signalKey: SignalKey,
  signal: string
) {
  for (const [modeId, weight] of Object.entries(weightedMap) as Array<
    [ThinkingModeId, number]
  >) {
    addScore(scores, signals, modeId, weight * multiplier, signalKey, signal);
  }
}

function applyKeywordSignal(params: {
  text: string;
  scores: Map<ThinkingModeId, number>;
  signals: Map<ThinkingModeId, ThinkingModeSelectionSignals>;
  signalKey: SignalKey;
  signalPrefix: string;
}) {
  const { text, scores, signals, signalKey, signalPrefix } = params;
  const normalized = normalizeText(text);
  const keywordRules: Array<{
    patterns: RegExp[];
    weight: number;
    modes: ThinkingModeId[];
    label: string;
  }> = [
    {
      patterns: [/gap|missing|assumption|افتراض|ناقص|فجوة/],
      weight: 3,
      modes: ["assumption_check", "step_back_reasoning"],
      label: "gap-or-assumption",
    },
    {
      patterns: [/weak|risk|fail|quality|ready|launch|مخاطر|ضعف|جودة|إطلاق|جاهز/],
      weight: 3,
      modes: [
        "devils_advocate_weakness_detection",
        "risk_guard_reasoning",
        "readiness_gate",
      ],
      label: "risk-quality-readiness",
    },
    {
      patterns: [/source|reference|evidence|fact|verify|دليل|مصدر|حقيقة|تحقق/],
      weight: 3,
      modes: ["fact_verification_evidence_check", "source_aware_reasoning"],
      label: "source-evidence",
    },
    {
      patterns: [/option|alternative|path|scenario|compare|بديل|مسار|سيناريو|قارن/],
      weight: 2.5,
      modes: [
        "tree_of_thoughts_alternatives_exploration",
        "scenario_testing",
        "decision_review",
      ],
      label: "alternatives-comparison",
    },
    {
      patterns: [/structure|sequence|organize|step|ترتيب|نظم|خطوة|هيكل/],
      weight: 2.5,
      modes: ["structured_reasoning", "react_action_oriented_reasoning"],
      label: "structure-sequence",
    },
    {
      patterns: [/scope|sprawl|simple|overload|heavy structure|نطاق|توسع|تعقيد/],
      weight: 2.5,
      modes: ["scope_control_anti_sprawl", "clarification_gate"],
      label: "scope-control",
    },
    {
      patterns: [/revert|rollback|broken|damage|restore|رجوع|استرجاع|مكسور|تعطل/],
      weight: 4,
      modes: ["recovery_revert_reasoning", "risk_guard_reasoning"],
      label: "recovery",
    },
    {
      patterns: [/decision|approve|accept|reject|choose|قرار|اعتماد|اختيار/],
      weight: 2.5,
      modes: ["decision_review", "counterexample_testing"],
      label: "decision",
    },
    {
      patterns: [/consistent|alignment|contradiction|align|تناسق|اتساق|تعارض/],
      weight: 2.5,
      modes: ["consistency_check", "self_consistency_quality_gate"],
      label: "consistency",
    },
    {
      patterns: [/debug|test|implement|execution|build|اختبار|تنفيذ|بناء/],
      weight: 2.5,
      modes: ["react_action_oriented_reasoning", "self_consistency_quality_gate"],
      label: "execution",
    },
  ];

  for (const rule of keywordRules) {
    if (rule.patterns.some((pattern) => pattern.test(normalized))) {
      for (const modeId of rule.modes) {
        addScore(scores, signals, modeId, rule.weight, signalKey, `${signalPrefix}:${rule.label}`);
      }
    }
  }
}

function domainTaskSignals(input: ThinkingModeInput): string[] {
  return [
    input.domain,
    input.domainRole,
    input.domainSpecialization ?? "",
    input.projectContext ?? "",
  ].filter(Boolean);
}

function modeSort(a: ThinkingModeSelection, b: ThinkingModeSelection): number {
  if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
  return a.displayName.localeCompare(b.displayName);
}

function selectWithQuotas(candidates: ThinkingModeSelection[]): ThinkingModeSelection[] {
  const byCategory = {
    core: candidates.filter((mode) => mode.category === "core").sort(modeSort),
    conditional: candidates.filter((mode) => mode.category === "conditional").sort(modeSort),
    guard: candidates.filter((mode) => mode.category === "guard").sort(modeSort),
  };

  const selected: ThinkingModeSelection[] = [];
  const addMode = (mode: ThinkingModeSelection) => {
    if (selected.some((entry) => entry.modeId === mode.modeId)) return;
    const strongOverlap = MODE_OVERLAPS[mode.modeId]?.some((overlapId) => {
      const overlap = selected.find((entry) => entry.modeId === overlapId);
      return overlap && overlap.priorityScore >= mode.priorityScore + 2;
    });
    if (!strongOverlap) selected.push(mode);
  };

  for (const mode of byCategory.core.filter((entry) => entry.priorityScore >= 8).slice(0, 3)) {
    addMode(mode);
  }
  for (const mode of byCategory.conditional.filter((entry) => entry.priorityScore >= 8).slice(0, 4)) {
    addMode(mode);
  }
  const guardCandidates = byCategory.guard.filter((entry) => entry.priorityScore >= 8);
  for (const mode of guardCandidates.slice(0, 3)) {
    addMode(mode);
  }

  if (selected.length > 7) {
    const mustKeepCore = selected.filter((mode) => mode.category === "core").sort(modeSort).slice(0, 2);
    const remaining = selected
      .filter((mode) => !mustKeepCore.some((coreMode) => coreMode.modeId === mode.modeId))
      .sort(modeSort)
      .slice(0, 7 - mustKeepCore.length);
    return [...mustKeepCore, ...remaining].sort(modeSort);
  }

  return selected.sort(modeSort);
}

function summaryFor(selectedModes: ThinkingModeSelection[]): ThinkingModeProfile["summary"] {
  const coreNames = selectedModes
    .filter((mode) => mode.category === "core")
    .slice(0, 2)
    .map((mode) => mode.displayName);
  const guardNames = selectedModes
    .filter((mode) => mode.category === "guard")
    .slice(0, 2)
    .map((mode) => mode.displayName);

  return {
    primaryThinkingStyle: coreNames.length
      ? coreNames.join(" + ")
      : selectedModes[0]?.displayName ?? "No dominant thinking mode",
    instructionSummary: [
      coreNames.length ? `Operate primarily through ${coreNames.join(" and ")}.` : "",
      guardNames.length ? `Apply guardrails through ${guardNames.join(" and ")} when risk appears.` : "",
      "Use conditional modes only when the task context triggers them.",
    ]
      .filter(Boolean)
      .join(" "),
  };
}

export function selectThinkingModes(input: ThinkingModeInput): ThinkingModeProfile {
  const scores = new Map<ThinkingModeId, number>();
  const signals = new Map<ThinkingModeId, ThinkingModeSelectionSignals>();

  for (const role of Object.keys(input.roleScores) as RoleHint[]) {
    const roleScore = input.roleScores[role];
    if (roleScore <= 0) continue;
    const multiplier = Math.min(roleScore / 10, 7);
    applyWeightedMap(
      scores,
      signals,
      ROLE_AFFINITY[role],
      multiplier,
      "roleSignals",
      `${role}:${roleScore}`
    );
  }

  for (const section of Object.keys(input.inspireSectionScores) as InspireInstructionSection[]) {
    const percentage = input.inspireSectionPercentages[section] ?? 0;
    if (percentage <= 0) continue;
    const multiplier = percentage / 10;
    applyWeightedMap(
      scores,
      signals,
      SECTION_AFFINITY[section],
      multiplier,
      "inspireSectionSignals",
      `${section}:${percentage}%`
    );
  }

  for (const [tag, count] of Object.entries(input.contradictionTags) as Array<
    [ContradictionTag, number]
  >) {
    if (!count) continue;
    applyWeightedMap(
      scores,
      signals,
      CONTRADICTION_AFFINITY[tag],
      count,
      "contradictionSignals",
      `${tag}:${count}`
    );
  }

  for (const rule of [...input.selectedInstructionRules, ...input.selectedOutputRules]) {
    applyKeywordSignal({
      text: rule,
      scores,
      signals,
      signalKey: "selectedRuleSignals",
      signalPrefix: rule,
    });
  }

  for (const line of input.selectedRedLines) {
    applyKeywordSignal({
      text: line,
      scores,
      signals,
      signalKey: "riskGuardSignals",
      signalPrefix: line,
    });
  }

  for (const guard of input.selectedRiskGuards) {
    applyKeywordSignal({
      text: guard,
      scores,
      signals,
      signalKey: "riskGuardSignals",
      signalPrefix: guard,
    });
  }

  for (const evidence of input.topEvidenceLabels) {
    applyKeywordSignal({
      text: evidence,
      scores,
      signals,
      signalKey: "evidenceLabelSignals",
      signalPrefix: evidence,
    });
  }

  for (const domainSignal of domainTaskSignals(input)) {
    applyKeywordSignal({
      text: domainSignal,
      scores,
      signals,
      signalKey: "domainSignals",
      signalPrefix: domainSignal,
    });
  }

  if (input.openAnswer?.trim()) {
    applyKeywordSignal({
      text: input.openAnswer,
      scores,
      signals,
      signalKey: "openAnswerSignals",
      signalPrefix: "openAnswer",
    });
  }

  const candidates = (Object.keys(THINKING_MODE_CATALOG) as ThinkingModeId[])
    .map((modeId) => {
      const priorityScore = Math.round((scores.get(modeId) ?? 0) * 100) / 100;
      const selectionSignals = signals.get(modeId) ?? emptySignals();
      if (modeId === "source_aware_reasoning") {
        const hasSourceSignal =
          selectionSignals.selectedRuleSignals.length > 0 ||
          selectionSignals.riskGuardSignals.length > 0 ||
          selectionSignals.domainSignals.length > 0 ||
          selectionSignals.openAnswerSignals.length > 0;
        if (!hasSourceSignal) {
          selectionSignals.exclusionSignals.push(
            "No explicit source/document/reference dependency strong enough to select source-aware reasoning alone."
          );
        }
      }
      return {
        ...THINKING_MODE_CATALOG[modeId],
        priorityScore,
        priorityLevel: priorityLevel(priorityScore),
        selectionSignals,
      };
    })
    .filter((mode) => mode.priorityScore > 0);

  const selectedModes = selectWithQuotas(candidates);
  const selectedIds = new Set(selectedModes.map((mode) => mode.modeId));
  const rejectedModes = candidates
    .filter((mode) => !selectedIds.has(mode.modeId))
    .sort(modeSort)
    .slice(0, 8)
    .map((mode) => ({
      modeId: mode.modeId,
      reason:
        mode.priorityScore < 8
          ? `Score ${mode.priorityScore} did not meet selection threshold.`
          : "Dropped by max-count or overlap control to avoid bloated instructions.",
    }));

  return {
    selectedModes,
    coreModes: selectedModes.filter((mode) => mode.category === "core"),
    conditionalModes: selectedModes.filter((mode) => mode.category === "conditional"),
    guardModes: selectedModes.filter((mode) => mode.category === "guard"),
    rejectedModes,
    summary: summaryFor(selectedModes),
  };
}
