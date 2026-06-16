import { UNIVERSAL_RULES } from "./prompt-builder";
import {
  validateReportWriterOutputContract,
  type ReportLanguage,
  type ReportWriterOutput,
} from "../inspire-types";

export function parseFullReport(text: string) {
  const extract = (start: string, end: string) => {
    const m = text.match(new RegExp(`${start}([\\s\\S]*?)${end}`));
    return m ? m[1].trim() : "";
  };

  const parseBulletSection = (raw: string, maxItems: number): string[] => {
    return raw
      .split("\n")
      .filter((l) => l.trim().startsWith("•"))
      .map((l) => l.replace(/^•\s*/, "").trim())
      .filter(Boolean)
      .slice(0, maxItems);
  };

  const parseTable = (raw: string) => {
    return raw
      .split("\n")
      .filter((l) => l.includes("|") && !l.startsWith("Axis") && !l.startsWith("Use EXACTLY"))
      .map((l) => {
        const parts = l
          .split("|")
          .map((p) => p.trim())
          .filter(Boolean);
        if (parts.length < 6) return null;
        const pctRaw = parts[3] ?? "";
        const pct = parseFloat(pctRaw.replace("%", "")) || 0;
        return {
          axis: parts[0],
          score: parseFloat(parts[1]) || 0,
          max: parseInt(parts[2]) || 6,
          percentage: pct,
          confidence: parseInt(parts[4]) || 0,
          note: parts[5] || "",
        };
      })
      .filter(Boolean);
  };

  const rawQS = extract("===QS_START===", "===QS_END===");
  const quickStarters = rawQS
    .split("\n")
    .filter((l) => /^\d\./.test(l.trim()))
    .map((l) =>
      l
        .replace(/^\d\.\s*[""]?/, "")
        .replace(/[""]?\s*$/, "")
        .trim()
    )
    .filter(Boolean)
    .slice(0, 3);

  const rawRecs = extract("===RECOMMENDATIONS_START===", "===RECOMMENDATIONS_END===");
  const recommendations = rawRecs
    .split("\n")
    .filter((l) => /^\d\./.test(l.trim()))
    .map((l) => l.replace(/^\d\.\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 4);

  return {
    inspireTable: parseTable(extract("===TABLE_START===", "===TABLE_END===")),
    roleAnalysis: extract("===ROLE_START===", "===ROLE_END==="),
    redLines: parseBulletSection(extract("===REDLINES_START===", "===REDLINES_END==="), 4),
    strengths: parseBulletSection(extract("===STRENGTHS_START===", "===STRENGTHS_END==="), 4),
    developmentAreas: parseBulletSection(extract("===DEVELOPMENT_START===", "===DEVELOPMENT_END==="), 3),
    recommendations,
    systemInstruction: UNIVERSAL_RULES + "\n\n" + extract("===SYS_START===", "===SYS_END==="),
    quickStarters: quickStarters.length > 0 ? quickStarters : [rawQS].filter(Boolean).slice(0, 3),
  };
}

// ─── V2 Report Parser ─────────────────────────────────────────────────────────
// Maps AI output sections (using v2 markers) to existing DB fields.
// Per Correction 5 mapping:
//   full_copy_ready_instruction → systemInstruction
//   starter_prompts             → quickStarters
//   red_lines_failure_triggers  → redLines
//   recommended_usage_strategy  → recommendations
//   ai_interaction_style + recommended_identity + domain_operating_mode → roleAnalysis
//   strengths                   → strengths
//   risks_blindspots            → developmentAreas
//   behavioral_signal_map       → inspireTable (null for v2)

export function parseFullReportV2(text: string): {
  systemInstruction: string;
  quickStarters: string[];
  redLines: string[];
  recommendations: string[];
  roleAnalysis: string;
  strengths: string[];
  developmentAreas: string[];
  inspireTable: null;
} {
  const extract = (start: string, end: string): string => {
    const m = text.match(new RegExp(`${start}([\\s\\S]*?)${end}`));
    return m ? m[1].trim() : "";
  };

  const parseBulletSection = (raw: string, maxItems: number): string[] => {
    const items = raw
      .split("\n")
      .filter((l) => l.trim().startsWith("•"))
      .map((l) => l.replace(/^•\s*/, "").trim())
      .filter(Boolean);
    if (items.length > 0) return items.slice(0, maxItems);
    return raw
      .split("\n")
      .map((l) => l.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, maxItems);
  };

  const parseNumberedSection = (raw: string, maxItems: number): string[] => {
    const items = raw
      .split("\n")
      .filter((l) => /^\d+\./.test(l.trim()))
      .map((l) => l.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
    if (items.length > 0) return items.slice(0, maxItems);
    return raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, maxItems);
  };

  const rawInstruction = extract("===FULL_INSTRUCTION_START===", "===FULL_INSTRUCTION_END===");
  const rawStarters = extract("===STARTERS_START===", "===STARTERS_END===");
  const rawRedLines = extract("===RED_LINES_START===", "===RED_LINES_END===");
  const rawStrengths = extract("===STRENGTHS_START===", "===STRENGTHS_END===");
  const rawRisks = extract("===RISKS_START===", "===RISKS_END===");
  const rawRoleAnalysis = extract("===ROLE_ANALYSIS_START===", "===ROLE_ANALYSIS_END===");
  const rawRecommendations = extract("===RECOMMENDATIONS_START===", "===RECOMMENDATIONS_END===");

  const quickStarters = parseNumberedSection(rawStarters, 3).map((s) =>
    s.replace(/^[""]/, "").replace(/[""]$/, "").trim()
  );

  return {
    systemInstruction: UNIVERSAL_RULES + "\n\n" + rawInstruction,
    quickStarters: quickStarters.length > 0 ? quickStarters : rawStarters.split("\n").filter(Boolean).slice(0, 3),
    redLines: parseBulletSection(rawRedLines, 5),
    recommendations: parseNumberedSection(rawRecommendations, 5),
    roleAnalysis: rawRoleAnalysis,
    strengths: parseBulletSection(rawStrengths, 5),
    developmentAreas: parseBulletSection(rawRisks, 5),
    inspireTable: null,
  };
}

type InspireInstructionWriterOutput = {
  title?: string;
  identityAndRole?: { bullets?: string[] };
  normsAndBoundaries?: { bullets?: string[] };
  styleAndTone?: { bullets?: string[] };
  precisionAndSelfCheck?: { bullets?: string[] };
  internalEvaluation?: { bullets?: string[] };
  responseStructure?: { bullets?: string[] };
  enhancementAndAdaptation?: { bullets?: string[] };
  thinkingModesManual?: {
    include?: boolean;
    modes?: Array<{
      name?: string;
      whenToUse?: string;
      howToApply?: string;
    }>;
  };
};

type InspireInstructionSectionKey =
  | "identityAndRole"
  | "normsAndBoundaries"
  | "styleAndTone"
  | "precisionAndSelfCheck"
  | "internalEvaluation"
  | "responseStructure"
  | "enhancementAndAdaptation";

export type UniversalInstructionRuleId =
  | "truth_accuracy"
  | "fact_inference_recommendation_separation"
  | "quality_check_important_outputs";

export type UniversalInstructionRule = {
  id: UniversalInstructionRuleId;
  targetSections: InspireInstructionSectionKey[];
  bullet: string;
  coverageSignals: string[];
  mergeBehavior: "inject_if_missing";
};

export const UNIVERSAL_INSTRUCTION_RULES: UniversalInstructionRule[] = [
  {
    id: "truth_accuracy",
    targetSections: ["precisionAndSelfCheck", "normsAndBoundaries"],
    bullet:
      "Do not fabricate facts, data, sources, or references. State uncertainty when information is incomplete or unstable.",
    coverageSignals: [
      "fabricate facts",
      "fabricate data",
      "fabricate sources",
      "fabricate references",
      "state uncertainty",
      "incomplete or unstable information",
      "unsupported claims",
    ],
    mergeBehavior: "inject_if_missing",
  },
  {
    id: "fact_inference_recommendation_separation",
    targetSections: ["precisionAndSelfCheck", "responseStructure"],
    bullet:
      "When accuracy or decision quality matters, distinguish facts, assumptions, inferences, and recommendations.",
    coverageSignals: [
      "distinguish facts",
      "assumptions",
      "inferences",
      "recommendations",
      "separate fact from recommendation",
      "decision quality matters",
    ],
    mergeBehavior: "inject_if_missing",
  },
  {
    id: "quality_check_important_outputs",
    targetSections: ["internalEvaluation"],
    bullet:
      "Before important outputs, check coherence, gaps, contradictions, usability, and alignment with the user’s goal.",
    coverageSignals: [
      "before important outputs",
      "check coherence",
      "gaps",
      "contradictions",
      "usability",
      "alignment with the user’s goal",
      "quality check",
    ],
    mergeBehavior: "inject_if_missing",
  },
];

type UniversalInstructionMergeMetrics = {
  writerRenderedCharacterCount: number;
  universalInstructionCharacterImpact: number;
  finalRenderedCharacterCountAfterUniversalMerge: number;
  injectedUniversalRuleIds: UniversalInstructionRuleId[];
  coveredUniversalRuleIds: UniversalInstructionRuleId[];
  deduplicatedBulletCount: number;
  conflictWarnings: string[];
};

type InspireInstructionRenderOptions =
  | "ar"
  | "en"
  | "both"
  | {
      instructionLanguage?: "ar" | "en" | "both";
      projectName?: string;
    };

const cleanAiJson = (text: string): string => {
  const trimmed = text.trim();
  const fencedWhole = trimmed.match(/^```(?:json)?\s*\n([\s\S]*?)\n```$/i);
  if (fencedWhole) return fencedWhole[1].trim();

  const fencedAnywhere = trimmed.match(/```(?:json)?\s*\n([\s\S]*?)\n```/i);
  if (fencedAnywhere) return fencedAnywhere[1].trim();

  const start = trimmed.indexOf("{");
  if (start < 0) return trimmed;

  let depth = 0;
  let inString = false;
  let escapeNext = false;
  for (let i = start; i < trimmed.length; i += 1) {
    const ch = trimmed[i]!;
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (ch === "\\\\") {
      if (inString) escapeNext = true;
      continue;
    }
    if (ch === "\"") {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") depth += 1;
    if (ch === "}") depth -= 1;
    if (depth === 0) {
      return trimmed.slice(start, i + 1).trim();
    }
  }

  return trimmed.slice(start).trim();
};

export function parseReportWriterJsonV2(
  text: string,
  reportLanguage: ReportLanguage
): ReportWriterOutput {
  const parsed = validateReportWriterOutputContract(JSON.parse(cleanAiJson(text)), reportLanguage);
  if (!parsed.success) {
    throw new Error(`Invalid Report Writer JSON: ${parsed.error.message}`);
  }
  return parsed.data;
}

const renderBullets = (bullets: string[] | undefined): string =>
  (bullets ?? [])
    .map((bullet) => bullet.trim())
    .filter(Boolean)
    .map((bullet) => `- ${bullet}`)
    .join("\n");

const getSectionBullets = (
  parsed: InspireInstructionWriterOutput,
  section: InspireInstructionSectionKey
): string[] => {
  const value = parsed[section];
  if (!value) {
    parsed[section] = { bullets: [] };
    return parsed[section]?.bullets ?? [];
  }
  value.bullets = (value.bullets ?? []).map((bullet) => bullet.trim()).filter(Boolean);
  return value.bullets;
};

const normalizeForCoverage = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\u0600-\u06ff\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeForSimilarity = (value: string): string =>
  normalizeForCoverage(value).replace(/\b(the|a|an|and|or|to|of|in|for|with|when|before)\b/g, " ");

const wordSet = (value: string): Set<string> =>
  new Set(
    normalizeForSimilarity(value)
      .split(/\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 2)
  );

const wordOverlapSimilarity = (a: string, b: string): number => {
  const aWords = wordSet(a);
  const bWords = wordSet(b);
  if (aWords.size === 0 || bWords.size === 0) return 0;
  let overlap = 0;
  for (const word of aWords) {
    if (bWords.has(word)) overlap += 1;
  }
  return overlap / Math.max(aWords.size, bWords.size);
};

const sectionCoversRule = (
  bullets: string[],
  rule: UniversalInstructionRule
): boolean => {
  const sectionText = normalizeForCoverage(bullets.join(" "));
  const canonicalBullet = normalizeForCoverage(rule.bullet);
  if (sectionText.includes(canonicalBullet)) return true;

  const signalMatches = rule.coverageSignals.filter((signal) =>
    sectionText.includes(normalizeForCoverage(signal))
  ).length;

  return signalMatches >= 2;
};

const dedupeBullets = (bullets: string[]): { bullets: string[]; removedCount: number } => {
  const kept: string[] = [];
  let removedCount = 0;

  for (const bullet of bullets.map((item) => item.trim()).filter(Boolean)) {
    const normalized = normalizeForCoverage(bullet);
    const duplicate = kept.some(
      (existing) =>
        normalizeForCoverage(existing) === normalized ||
        wordOverlapSimilarity(existing, bullet) >= 0.82
    );
    if (duplicate) {
      removedCount += 1;
    } else {
      kept.push(bullet);
    }
  }

  return { bullets: kept, removedCount };
};

const detectUniversalInstructionConflicts = (
  parsed: InspireInstructionWriterOutput
): string[] => {
  const allBullets = [
    ...(parsed.normsAndBoundaries?.bullets ?? []),
    ...(parsed.precisionAndSelfCheck?.bullets ?? []),
    ...(parsed.internalEvaluation?.bullets ?? []),
    ...(parsed.responseStructure?.bullets ?? []),
  ];
  const text = normalizeForCoverage(allBullets.join(" "));
  const conflicts: string[] = [];

  if (
    /\b(you may|can|should|allowed to|feel free to)\b.{0,40}\b(invent|fabricate|make up|create)\b.{0,40}\b(facts|data|sources|references)\b/.test(text) ||
    /\b(invent|fabricate|make up|create)\b.{0,40}\b(facts|data|sources|references)\b.{0,30}\b(when useful|if useful|as needed)\b/.test(text) ||
    /\bguess\b.{0,40}\b(as fact|facts)\b/.test(text)
  ) {
    conflicts.push("truth_accuracy");
  }

  if (
    /\b(do not|don't|avoid|never)\b.{0,60}\b(distinguish|separate|label)\b.{0,60}\b(facts?|assumptions?|inferences?|recommendations?)\b/.test(
      text
    )
  ) {
    conflicts.push("fact_inference_recommendation_separation");
  }

  if (
    /\b(skip|avoid|do not|don't|never)\b.{0,50}\b(quality check|check coherence|check gaps|review contradictions|check alignment)\b/.test(
      text
    )
  ) {
    conflicts.push("quality_check_important_outputs");
  }

  return conflicts;
};

const applyUniversalInstructionRules = (
  parsed: InspireInstructionWriterOutput
): {
  parsed: InspireInstructionWriterOutput;
  injectedRuleIds: UniversalInstructionRuleId[];
  coveredRuleIds: UniversalInstructionRuleId[];
  deduplicatedBulletCount: number;
  conflictWarnings: string[];
} => {
  const merged: InspireInstructionWriterOutput = {
    ...parsed,
    identityAndRole: { bullets: [...(parsed.identityAndRole?.bullets ?? [])] },
    normsAndBoundaries: { bullets: [...(parsed.normsAndBoundaries?.bullets ?? [])] },
    styleAndTone: { bullets: [...(parsed.styleAndTone?.bullets ?? [])] },
    precisionAndSelfCheck: { bullets: [...(parsed.precisionAndSelfCheck?.bullets ?? [])] },
    internalEvaluation: { bullets: [...(parsed.internalEvaluation?.bullets ?? [])] },
    responseStructure: { bullets: [...(parsed.responseStructure?.bullets ?? [])] },
    enhancementAndAdaptation: {
      bullets: [...(parsed.enhancementAndAdaptation?.bullets ?? [])],
    },
    thinkingModesManual: parsed.thinkingModesManual,
  };

  const injectedRuleIds: UniversalInstructionRuleId[] = [];
  const coveredRuleIds: UniversalInstructionRuleId[] = [];

  for (const rule of UNIVERSAL_INSTRUCTION_RULES) {
    const targetBullets = rule.targetSections.flatMap((section) =>
      getSectionBullets(merged, section)
    );
    if (sectionCoversRule(targetBullets, rule)) {
      coveredRuleIds.push(rule.id);
      continue;
    }
    getSectionBullets(merged, rule.targetSections[0]).push(rule.bullet);
    injectedRuleIds.push(rule.id);
  }

  let deduplicatedBulletCount = 0;
  const sections: InspireInstructionSectionKey[] = [
    "identityAndRole",
    "normsAndBoundaries",
    "styleAndTone",
    "precisionAndSelfCheck",
    "internalEvaluation",
    "responseStructure",
    "enhancementAndAdaptation",
  ];
  for (const section of sections) {
    const result = dedupeBullets(getSectionBullets(merged, section));
    getSectionBullets(merged, section).splice(0, Infinity, ...result.bullets);
    deduplicatedBulletCount += result.removedCount;
  }

  const conflictWarnings = detectUniversalInstructionConflicts(merged);
  if (conflictWarnings.length > 0) {
    throw new Error(
      `Universal instruction conflict detected: ${conflictWarnings.join(", ")}`
    );
  }

  return {
    parsed: merged,
    injectedRuleIds,
    coveredRuleIds,
    deduplicatedBulletCount,
    conflictWarnings,
  };
};

const resolveRenderOptions = (
  options: InspireInstructionRenderOptions
): { instructionLanguage: "ar" | "en"; projectName?: string } => {
  if (typeof options === "string") {
    return { instructionLanguage: options === "ar" ? "ar" : "en" };
  }
  return {
    instructionLanguage: options.instructionLanguage === "ar" ? "ar" : "en",
    projectName: options.projectName,
  };
};

const neutralInstructionTitle = (
  fallbackTitle: string | undefined,
  options: { instructionLanguage: "ar" | "en"; projectName?: string }
): string => {
  const projectName = options.projectName?.trim() || fallbackTitle?.trim() || "AI Assistant";
  return options.instructionLanguage === "ar"
    ? `${projectName} — تعليمات تشغيل المساعد`
    : `${projectName} — AI Assistant Operating Instructions`;
};

const renderInspireInstructionMarkdown = (
  parsed: InspireInstructionWriterOutput,
  renderOptions: { instructionLanguage: "ar" | "en"; projectName?: string }
): string => {
  const title = neutralInstructionTitle(parsed.title, renderOptions);
  const sections: Array<[string, string[] | undefined]> = [
    ["1. Identity & Role", parsed.identityAndRole?.bullets],
    ["2. Norms & Boundaries", parsed.normsAndBoundaries?.bullets],
    ["3. Style & Tone", parsed.styleAndTone?.bullets],
    ["4. Precision & Self-Check", parsed.precisionAndSelfCheck?.bullets],
    ["5. Internal Evaluation", parsed.internalEvaluation?.bullets],
    ["6. Response Structure", parsed.responseStructure?.bullets],
    ["7. Enhancement & Adaptation", parsed.enhancementAndAdaptation?.bullets],
  ];

  const markdown = [`# ${title}`];
  for (const [heading, bullets] of sections) {
    const rendered = renderBullets(bullets);
    markdown.push(`## ${heading}`, rendered || "- Not specified.");
  }

  const modes = parsed.thinkingModesManual?.include
    ? (parsed.thinkingModesManual.modes ?? []).filter(
        (mode) => mode.name?.trim() && mode.whenToUse?.trim() && mode.howToApply?.trim()
      )
    : [];
  const whenToUseLabel = renderOptions.instructionLanguage === "ar" ? "متى تستخدمه" : "When to use";
  const howToApplyLabel = renderOptions.instructionLanguage === "ar" ? "كيف تطبقه" : "How to apply";

  if (modes.length > 0) {
    markdown.push(
      "## 8. Thinking Modes Manual",
      modes
        .map(
          (mode) =>
            `- ${mode.name}\n  - ${whenToUseLabel}: ${mode.whenToUse}\n  - ${howToApplyLabel}: ${mode.howToApply}`
        )
        .join("\n")
    );
  }

  return markdown.join("\n\n").trim();
};

export function parseInspireInstructionJsonWithMetricsV2(
  text: string,
  options: InspireInstructionRenderOptions = "en"
): { markdown: string; metrics: UniversalInstructionMergeMetrics } {
  const renderOptions = resolveRenderOptions(options);
  const parsed = JSON.parse(cleanAiJson(text)) as InspireInstructionWriterOutput;
  const writerMarkdown = renderInspireInstructionMarkdown(parsed, renderOptions);
  const mergeResult = applyUniversalInstructionRules(parsed);
  const finalMarkdown = renderInspireInstructionMarkdown(mergeResult.parsed, renderOptions);

  return {
    markdown: finalMarkdown,
    metrics: {
      writerRenderedCharacterCount: writerMarkdown.length,
      universalInstructionCharacterImpact: Math.max(0, finalMarkdown.length - writerMarkdown.length),
      finalRenderedCharacterCountAfterUniversalMerge: finalMarkdown.length,
      injectedUniversalRuleIds: mergeResult.injectedRuleIds,
      coveredUniversalRuleIds: mergeResult.coveredRuleIds,
      deduplicatedBulletCount: mergeResult.deduplicatedBulletCount,
      conflictWarnings: mergeResult.conflictWarnings,
    },
  };
}

export function parseInspireInstructionJsonV2(
  text: string,
  options: InspireInstructionRenderOptions = "en"
): string {
  try {
    return parseInspireInstructionJsonWithMetricsV2(text, options).markdown;
  } catch (error) {
    if (error instanceof SyntaxError) return text.trim();
    throw error;
  }
}

export function getInspireInstructionCharacterMetrics(
  renderedInstruction: string,
  universalInstructions: string = UNIVERSAL_RULES
): {
  writerRenderedCharacterCount: number;
  universalInstructionCharacterImpact: number;
  finalRenderedCharacterCountAfterUniversalMerge: number;
} {
  void universalInstructions;
  return {
    writerRenderedCharacterCount: renderedInstruction.length,
    universalInstructionCharacterImpact: 0,
    finalRenderedCharacterCountAfterUniversalMerge: renderedInstruction.length,
  };
}
