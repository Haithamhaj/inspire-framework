import { createRequire } from "node:module";
import { mkdtemp, readFile, writeFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const apiServerDir = path.join(repoRoot, "artifacts/api-server");
const require = createRequire(import.meta.url);
const { build } = require(require.resolve("esbuild", { paths: [apiServerDir] }));

const tempDir = await mkdtemp(path.join(os.tmpdir(), "inspire-v2-evidence-"));
const entryFile = path.join(tempDir, "entry.ts");
const bundleFile = path.join(tempDir, "entry.mjs");

await writeFile(
  entryFile,
  `
    export { V2_QUESTIONS } from ${JSON.stringify(
      path.join(repoRoot, "artifacts/api-server/src/data/questions-v2.ts")
    )};
    export { computeInspireV2Profile } from ${JSON.stringify(
      path.join(repoRoot, "artifacts/api-server/src/lib/inspire-v2-decision-engine.ts")
    )};
    export { buildInspireInstructionPromptV2, buildPromptV2, buildReportSafePacket, buildReportWriterPromptV2 } from ${JSON.stringify(
      path.join(repoRoot, "artifacts/api-server/src/lib/prompt-builder.ts")
    )};
    export { parseInspireInstructionJsonV2, parseInspireInstructionJsonWithMetricsV2, parseReportWriterJsonV2, UNIVERSAL_INSTRUCTION_RULES } from ${JSON.stringify(
      path.join(repoRoot, "artifacts/api-server/src/lib/report-parser.ts")
    )};
    export { AssessmentStartSchema } from ${JSON.stringify(
      path.join(repoRoot, "artifacts/api-server/src/lib/validators.ts")
    )};
    export { buildOperatingPatternReportContentV1, PersistedReportContentSchema, validateReportWriterOutputContract, expectedInstructionExplanationInclude } from ${JSON.stringify(
      path.join(repoRoot, "artifacts/api-server/src/inspire-types/index.ts")
    )};
    export { buildOperatingPatternReportContent, SMART_PROMPT_ENGINEER_URL } from ${JSON.stringify(
      path.join(repoRoot, "artifacts/api-server/src/lib/report-content.ts")
    )};
  `
);

await build({
  entryPoints: [entryFile],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: bundleFile,
  logLevel: "silent",
});

const {
  V2_QUESTIONS,
  computeInspireV2Profile,
  buildInspireInstructionPromptV2,
  buildPromptV2,
  buildReportSafePacket,
  buildReportWriterPromptV2,
  parseInspireInstructionJsonV2,
  parseInspireInstructionJsonWithMetricsV2,
  parseReportWriterJsonV2,
  UNIVERSAL_INSTRUCTION_RULES,
  AssessmentStartSchema,
  buildOperatingPatternReportContentV1,
  PersistedReportContentSchema,
  validateReportWriterOutputContract,
  expectedInstructionExplanationInclude,
  buildOperatingPatternReportContent,
  SMART_PROMPT_ENGINEER_URL,
} = await import(pathToFileURL(bundleFile).href);

const assessmentSchemaText = await readFile(
  path.join(repoRoot, "lib/db/src/schema/assessments.ts"),
  "utf8"
);
const reportContentMigrationText = await readFile(
  path.join(repoRoot, "lib/db/migrations/0002_add_report_content.sql"),
  "utf8"
);
const resultsRoutesText = await readFile(
  path.join(repoRoot, "artifacts/api-server/src/routes/results.ts"),
  "utf8"
);
const resultsUiText = await readFile(
  path.join(repoRoot, "artifacts/inspire-web/src/pages/results.tsx"),
  "utf8"
);
const webCssText = await readFile(
  path.join(repoRoot, "artifacts/inspire-web/src/index.css"),
  "utf8"
);
const pdfText = await readFile(path.join(repoRoot, "artifacts/api-server/src/lib/pdf.ts"), "utf8");
const aiEngineText = await readFile(
  path.join(repoRoot, "artifacts/api-server/src/lib/ai-engine.ts"),
  "utf8"
);
const shareRouteText = resultsRoutesText.slice(
  resultsRoutesText.indexOf("// ─── GET /api/share/:token"),
  resultsRoutesText.indexOf("// ─── POST /api/results/:id/generate-pdf")
);

const makeAnswers = (choices) =>
  V2_QUESTIONS.map((question) => ({
    questionId: question.id,
    optionId: choices[question.id] ?? question.options[0].id,
  }));

const proofProfiles = [
  {
    name: "fast executor",
    openAnswer:
      "I want the assistant to move quickly, draft usable versions, and avoid long theory unless I ask.",
    choices: {
      S2_messy_task_help: "draft_first_refine",
      S3_idea_clarity_for_others: "structured_for_following",
      Q01_starting_orientation: "action_oriented",
      Q02_ambiguity_handling: "iterative_action",
      Q03_unfamiliar_decision: "intuition_tested",
      Q04_plan_failure: "adaptive_pivot",
      Q05_stalled_task: "tool_method",
      Q06_success_clarity: "learn_by_doing",
      Q07_learning_style: "practice_learning",
      Q08_new_challenge: "experiment",
      Q09_repeating_problems: "alternative_search",
      Q10_disagreement: "outcome_priority",
      Q11_tasks_piling: "efficiency_tool",
      Q12_postponing: "focus_energy",
      Q13_completion_review: "forward_planning",
      Q14_error_feedback: "fix_oriented",
      Q15_repeated_no_progress: "change_plan",
      AI01_correct_unusable: "not_practical",
      AI02_incomplete_request: "draft_refine",
      AI03_repeated_ai_mistake: "auto_adjust",
      AI04_trust_verification: "simple_limits",
    },
  },
  {
    name: "analytical critical reviewer",
    openAnswer:
      "I need the assistant to expose assumptions, weak logic, missing evidence, and quality risks before execution.",
    choices: {
      S2_messy_task_help: "identify_gaps_before_build",
      S3_idea_clarity_for_others: "self_clarity_first",
      Q01_starting_orientation: "resource_oriented",
      Q02_ambiguity_handling: "gap_mapping",
      Q03_unfamiliar_decision: "evaluation_first",
      Q04_plan_failure: "root_cause",
      Q05_stalled_task: "blocker_diagnosis",
      Q06_success_clarity: "success_criteria",
      Q07_learning_style: "analytical_learning",
      Q08_new_challenge: "risk_first",
      Q09_repeating_problems: "root_pattern",
      Q10_disagreement: "conflict_analysis",
      Q11_tasks_piling: "schedule",
      Q12_postponing: "unclear_requirements",
      Q13_completion_review: "result_review",
      Q14_error_feedback: "detail_verify",
      Q15_repeated_no_progress: "under_root",
      AI01_correct_unusable: "no_quality_check",
      AI02_incomplete_request: "ask_one",
      AI03_repeated_ai_mistake: "suggest_rule",
      AI04_trust_verification: "validation_criteria",
    },
  },
  {
    name: "thinking partner / conversational explorer",
    openAnswer:
      "I like exploring possibilities with the assistant, asking good questions, and comparing paths before deciding.",
    choices: {
      S2_messy_task_help: "show_possible_directions",
      S3_idea_clarity_for_others: "context_adaptive_style",
      Q01_starting_orientation: "beneficiary_oriented",
      Q02_ambiguity_handling: "clarification_first",
      Q03_unfamiliar_decision: "collaborative_decision",
      Q04_plan_failure: "second_opinion",
      Q05_stalled_task: "external_feedback",
      Q06_success_clarity: "multi_path",
      Q07_learning_style: "interactive_learning",
      Q08_new_challenge: "precedent",
      Q09_repeating_problems: "collaborative_review",
      Q10_disagreement: "conflict_analysis",
      Q11_tasks_piling: "delegate",
      Q12_postponing: "unclear_requirements",
      Q13_completion_review: "share_feedback",
      Q14_error_feedback: "rationale_context",
      Q15_repeated_no_progress: "support_perspective",
      AI01_correct_unusable: "no_context",
      AI02_incomplete_request: "conditional_paths",
      AI03_repeated_ai_mistake: "confirm_permanent",
      AI04_trust_verification: "fact_inference_reco",
    },
  },
];

const computeProofProfile = (profile) =>
  computeInspireV2Profile({
    answers: makeAnswers(profile.choices),
    domain: "Coding / Software Development",
    domainSpecialization: undefined,
    projectContext: "AI-assisted work",
    openAnswer: profile.openAnswer,
  });

const proofProfileJson = Object.fromEntries(
  proofProfiles.map((profile) => [profile.name, computeProofProfile(profile)])
);

const promptInput = {
  name: "Evidence User",
  jobTitle: "Not specified",
  projectName: "Customer Launch Plan",
  projectGoal: "Prepare a practical AI-assisted launch review workflow.",
  domain: "Coding / Software Development",
  domainSpecialization: "React / Next.js frontend",
  projectContext: "I am building a dashboard",
  reportLanguage: "en",
  answers: makeAnswers(proofProfiles[0].choices),
  openAnswer: proofProfiles[0].openAnswer,
};

const promptTemplate = buildPromptV2(promptInput);
const instructionPromptTemplate = buildInspireInstructionPromptV2(promptInput);
const arabicReportInstructionPromptTemplate = buildInspireInstructionPromptV2({
  ...promptInput,
  reportLanguage: "ar",
});
const reportSafePacket = buildReportSafePacket(promptInput);
const reportWriterPromptTemplate = buildReportWriterPromptV2(promptInput);

const collectObjectKeys = (value, keys = []) => {
  if (Array.isArray(value)) {
    for (const item of value) collectObjectKeys(item, keys);
    return keys;
  }
  if (!value || typeof value !== "object") return keys;
  for (const [key, nested] of Object.entries(value)) {
    keys.push(key);
    collectObjectKeys(nested, keys);
  }
  return keys;
};

const forbiddenReportSafePacketKeys = [
  "answers",
  "selectedAnswers",
  "questionId",
  "optionId",
  "roleScores",
  "inspireSectionScores",
  "inspireSectionPercentages",
  "confidenceIndex",
  "weightedScore",
  "routeKey",
  "evidenceLabel",
  "topEvidenceLabels",
  "behaviorSignal",
  "behavioralSignal",
  "contradictionTags",
  "modeId",
  "category",
  "priorityLevel",
  "priorityScore",
  "selectionSignals",
  "computedProfile",
];
const forbiddenReportSafePacketValuePatterns = [
  /questionId/i,
  /optionId/i,
  /weightedScore/i,
  /roleScores/i,
  /inspireSectionScores/i,
  /inspireSectionPercentages/i,
  /topEvidenceLabels/i,
  /behavioralSignal/i,
  /selectionSignals/i,
  /priorityScore/i,
  /computedProfile/i,
  /\bQ\d{2}_/i,
  /\bAI\d{2}_/i,
  /\bS\d_/i,
  /speed_vs_precision/,
  /autonomy_vs_guidance/,
  /creativity_vs_structure/,
  /critique_vs_support/,
  /brevity_vs_depth/,
  /adaptation_vs_stability/,
];
const reportSafePacketKeys = collectObjectKeys(reportSafePacket);
const reportSafePacketJson = JSON.stringify(reportSafePacket, null, 2);
const reportSafePacketForbiddenKeysFound = reportSafePacketKeys.filter((key) =>
  forbiddenReportSafePacketKeys.includes(key)
);
const reportSafePacketForbiddenValuePatternsFound = forbiddenReportSafePacketValuePatterns
  .filter((pattern) => pattern.test(reportSafePacketJson))
  .map((pattern) => pattern.toString());
const reportSafePacketThinkingModeKeys = [
  ...new Set(reportSafePacket.thinkingModes.flatMap((mode) => Object.keys(mode))),
].sort();
const reportSafePacketBalancingGuidance = reportSafePacket.operatingPatterns.balancingGuidance;
const reportSafePacketProof = {
  hasApprovedTopLevelShape:
    Object.keys(reportSafePacket).join(",") ===
    [
      "subject",
      "domainContext",
      "operatingRoles",
      "operatingPatterns",
      "thinkingModes",
      "instructionExplanationSignals",
    ].join(","),
  forbiddenKeysAbsent: reportSafePacketForbiddenKeysFound.length === 0,
  forbiddenValuePatternsAbsent: reportSafePacketForbiddenValuePatternsFound.length === 0,
  secondaryRoleTriggerHasNoScoreOrThreshold:
    !reportSafePacket.operatingRoles.secondaryRoleTrigger ||
    !/\b(score|threshold|met threshold|selection logic)\b/i.test(
      reportSafePacket.operatingRoles.secondaryRoleTrigger
    ),
  thinkingModesUseSafeKeysOnly:
    reportSafePacketThinkingModeKeys.join(",") === "name,practicalValue,whenUseful",
  balancingGuidanceUsesSafeText:
    reportSafePacketBalancingGuidance.length > 0 &&
    reportSafePacketBalancingGuidance.every(
      (item) =>
        typeof item === "string" &&
        !forbiddenReportSafePacketValuePatterns.some((pattern) => pattern.test(item)) &&
        !/:\s*\d/.test(item)
    ),
  copyReadyInstructionLanguageFixedEnglish:
    reportSafePacket.instructionExplanationSignals.copyReadyInstructionLanguage === "en",
  reportNeedsExplanationDerivedFromLanguage:
    reportSafePacket.instructionExplanationSignals.reportNeedsExplanation ===
    (promptInput.reportLanguage !== "en"),
};

const reportWriterEnglishExample = {
  operatingSnapshot: {
    bullets: [
      "You move fastest when ideas are converted into a first practical action.",
      "You can work with partial clarity when the next step is obvious, then refine through feedback.",
      "Your best support pattern combines quick execution with a short quality check before final decisions.",
    ],
  },
  personalizedRecommendations: {
    bullets: [
      "Start complex work with a small first draft, then ask AI to improve the structure.",
      "Ask for alternatives when a first fix fails instead of repeating the same approach.",
      "Use a quick verification pass before accepting launch, planning, or technical recommendations.",
      "Request templates or structured methods when the task feels messy or hard to start.",
    ],
  },
  customAiUsageTips: {
    bullets: [
      "Ask AI for a first usable version before requesting deeper analysis.",
      "When the task is important, ask AI to separate facts, assumptions, and recommendations.",
    ],
  },
  instructionExplanation: {
    include: false,
    bullets: [],
  },
};

const reportWriterArabicExample = {
  operatingSnapshot: {
    bullets: [
      "يميل نمط العمل إلى تحويل الفكرة بسرعة إلى خطوة عملية أولى.",
      "يمكن البدء مع وضوح جزئي عندما تكون الخطوة التالية معروفة، ثم تحسين النتيجة بالتدرج.",
      "الدعم الأنسب يجمع بين التنفيذ السريع وفحص مختصر للجودة قبل القرارات المهمة.",
    ],
  },
  personalizedRecommendations: {
    bullets: [
      "ابدأ المهام المعقدة بمسودة صغيرة قابلة للاستخدام، ثم اطلب تحسين البنية.",
      "عندما لا ينجح الحل الأول، اطلب بدائل مختلفة بدل تكرار نفس المسار.",
      "استخدم فحص تحقق مختصر قبل اعتماد توصيات الإطلاق أو التخطيط أو القرارات التقنية.",
      "اطلب قالبا أو طريقة منظمة عندما تكون المهمة غير مرتبة أو يصعب البدء بها.",
    ],
  },
  customAiUsageTips: {
    bullets: [
      "اطلب من الذكاء الاصطناعي نسخة أولى قابلة للاستخدام قبل التوسع في التحليل.",
      "في المهام المهمة، اطلب فصل الحقائق عن الافتراضات والتوصيات.",
    ],
  },
  instructionExplanation: {
    include: true,
    bullets: [
      "تعليمات النسخ الجاهزة مكتوبة بالإنجليزية لأنها ستستخدم مباشرة داخل أدوات الذكاء الاصطناعي.",
      "توضح التعليمات للمساعد كيف يتعامل مع سياق المشروع، الحدود، وطريقة عرض المخرجات.",
      "استخدمها كما هي في إعدادات الأداة، ثم اطلب المهام اليومية باللغة التي تفضلها.",
    ],
  },
};

const reportWriterBothLanguageExample = {
  operatingSnapshot: {
    bullets: [
      "يميل نمط العمل إلى البدء بخطوة عملية واضحة. / The working pattern favors a clear practical first step.",
      "يستفيد من تحسين تدريجي بعد المسودة الأولى. / It benefits from iterative refinement after a first draft.",
      "يحتاج إلى فحص جودة مختصر قبل القرارات المهمة. / It needs a concise quality check before important decisions.",
    ],
  },
  personalizedRecommendations: {
    bullets: [
      "ابدأ بمسودة قابلة للاستخدام ثم حسّنها. / Start with a usable draft, then improve it.",
      "اطلب بدائل عند تعثر الحل الأول. / Ask for alternatives when the first fix stalls.",
      "استخدم فحص تحقق قبل اعتماد التوصيات. / Use verification before accepting recommendations.",
      "اطلب بنية واضحة عندما تكون المهمة واسعة. / Ask for structure when the task is broad.",
    ],
  },
  customAiUsageTips: {
    bullets: [
      "اطلب النتيجة أولا ثم التفاصيل. / Ask for the answer first, then details.",
      "اطلب فصل الحقائق عن الافتراضات عند الدقة. / Ask to separate facts from assumptions when accuracy matters.",
    ],
  },
  instructionExplanation: {
    include: true,
    bullets: [
      "تعليمات النسخ الجاهزة تبقى بالإنجليزية للاستخدام المباشر داخل الأداة. / The copy-ready instructions stay in English for direct tool use.",
      "هي تضبط دور المساعد وحدوده وطريقة إخراجه بدون ترجمة النص نفسه. / They set role, boundaries, and output behavior without translating the instruction text.",
      "يمكن استخدام التقرير لفهم التصميم، ثم نسخ التعليمات الإنجليزية كما هي. / Use the report to understand the design, then paste the English instructions as-is.",
    ],
  },
};

const invalidReportWriterExamples = {
  oldSectionTerm: {
    ...reportWriterEnglishExample,
    personalizedRecommendations: {
      bullets: [
        ...reportWriterEnglishExample.personalizedRecommendations.bullets.slice(0, 3),
        "Review your strengths before deciding how to use AI.",
      ],
    },
  },
  internalTerm: {
    ...reportWriterEnglishExample,
    operatingSnapshot: {
      bullets: [
        ...reportWriterEnglishExample.operatingSnapshot.bullets.slice(0, 2),
        "The computedProfile shows a high score in the matrix.",
      ],
    },
  },
  markdownHeading: {
    ...reportWriterEnglishExample,
    customAiUsageTips: {
      bullets: ["## Use AI better", "Ask for a concise first draft."],
    },
  },
  wrongExplanationForEnglish: {
    ...reportWriterEnglishExample,
    instructionExplanation: {
      include: true,
      bullets: [
        "English explanation should not be included here.",
        "This should fail for English.",
        "The contract should reject it.",
      ],
    },
  },
};

const reportWriterContractValidation = {
  english: validateReportWriterOutputContract(reportWriterEnglishExample, "en").success,
  arabic: validateReportWriterOutputContract(reportWriterArabicExample, "ar").success,
  both: validateReportWriterOutputContract(reportWriterBothLanguageExample, "both").success,
  rejectsOldSectionTerm: !validateReportWriterOutputContract(
    invalidReportWriterExamples.oldSectionTerm,
    "en"
  ).success,
  rejectsInternalTerm: !validateReportWriterOutputContract(
    invalidReportWriterExamples.internalTerm,
    "en"
  ).success,
  rejectsMarkdownHeading: !validateReportWriterOutputContract(
    invalidReportWriterExamples.markdownHeading,
    "en"
  ).success,
  rejectsWrongExplanationForEnglish: !validateReportWriterOutputContract(
    invalidReportWriterExamples.wrongExplanationForEnglish,
    "en"
  ).success,
  englishExplanationRule: expectedInstructionExplanationInclude("en") === false,
  arabicExplanationRule: expectedInstructionExplanationInclude("ar") === true,
  bothExplanationRule: expectedInstructionExplanationInclude("both") === true,
  bothLanguageBehaviorDocumented:
    reportWriterBothLanguageExample.operatingSnapshot.bullets.every((bullet) =>
      bullet.includes(" / ")
    ) &&
    reportWriterBothLanguageExample.instructionExplanation.include,
};

const parsedReportWriterEnglishExample = parseReportWriterJsonV2(
  JSON.stringify(reportWriterEnglishExample),
  "en"
);
const parsedReportWriterArabicFromFence = parseReportWriterJsonV2(
  `\`\`\`json\n${JSON.stringify(reportWriterArabicExample, null, 2)}\n\`\`\``,
  "ar"
);
let invalidReportWriterJsonRejected = false;
try {
  parseReportWriterJsonV2(JSON.stringify(invalidReportWriterExamples.internalTerm), "en");
} catch {
  invalidReportWriterJsonRejected = true;
}

const reportWriterParserProof = {
  parsesStrictEnglishJson:
    parsedReportWriterEnglishExample.operatingSnapshot.bullets.length === 3 &&
    parsedReportWriterEnglishExample.instructionExplanation.include === false,
  acceptsFencedJsonAsRecovery:
    parsedReportWriterArabicFromFence.instructionExplanation.include === true &&
    parsedReportWriterArabicFromFence.instructionExplanation.bullets.length === 3,
  rejectsInvalidContractOutput: invalidReportWriterJsonRejected,
  parserIsDisconnectedFromLiveGeneration:
    promptTemplate.includes("Output EXACTLY these 8 marker blocks") &&
    !promptTemplate.includes("parseReportWriterJsonV2"),
};

const sampleCopyReadyInstructionMarkdown =
  "# Customer Launch Plan - AI Assistant Operating Instructions\n\n- Work in English for copy-ready instructions.\n- Start with practical next steps.";
const fixedReportContentEnglish = buildOperatingPatternReportContent(reportWriterEnglishExample, {
  reportLanguage: "en",
  projectName: promptInput.projectName,
  copyReadyInstructionMarkdown: sampleCopyReadyInstructionMarkdown,
});
const fixedReportContentArabic = buildOperatingPatternReportContent(reportWriterArabicExample, {
  reportLanguage: "ar",
  projectName: promptInput.projectName,
  copyReadyInstructionMarkdown: sampleCopyReadyInstructionMarkdown,
});
const fixedReportContentBoth = buildOperatingPatternReportContent(reportWriterBothLanguageExample, {
  reportLanguage: "both",
  projectName: promptInput.projectName,
  copyReadyInstructionMarkdown: sampleCopyReadyInstructionMarkdown,
});
const persistedReportContentEnglish = buildOperatingPatternReportContentV1(
  reportWriterEnglishExample,
  "en",
  "2026-05-05T00:00:00.000Z"
);
const fixedReportContentJson = JSON.stringify(
  { fixedReportContentEnglish, fixedReportContentArabic, fixedReportContentBoth },
  null,
  2
);
const persistedReportContentJson = JSON.stringify(persistedReportContentEnglish, null, 2);
const persistedReportContentKeys = collectObjectKeys(persistedReportContentEnglish);
const persistedReportContentForbiddenPatternsFound = forbiddenReportSafePacketValuePatterns
  .filter((pattern) => pattern.test(persistedReportContentJson))
  .map((pattern) => pattern.toString());
const fixedReportContentForbiddenPatternsFound = forbiddenReportSafePacketValuePatterns
  .filter((pattern) => pattern.test(fixedReportContentJson))
  .map((pattern) => pattern.toString());
const fixedReportContentProof = {
  hasFiveCustomerFacingSections:
    Object.keys(fixedReportContentEnglish.sections).join(",") ===
    [
      "operatingSnapshot",
      "personalizedRecommendations",
      "howToUseAiBetter",
      "copyReadyAiInstructions",
      "instructionExplanation",
    ].join(","),
  craftIsCodeOwnedFixedContent:
    fixedReportContentEnglish.sections.howToUseAiBetter.fixedCraftFramework.title.includes(
      "CRAFT"
    ) &&
    fixedReportContentEnglish.sections.howToUseAiBetter.fixedCraftFramework.bullets.length === 5 &&
    !reportWriterPromptTemplate.includes("CRAFT"),
  smartPromptEngineerLinkIsCodeOwned:
    fixedReportContentEnglish.sections.howToUseAiBetter.smartPromptEngineer.url ===
    SMART_PROMPT_ENGINEER_URL,
  copyReadyInstructionsRemainEnglish:
    fixedReportContentEnglish.sections.copyReadyAiInstructions.language === "en" &&
    fixedReportContentArabic.sections.copyReadyAiInstructions.language === "en" &&
    fixedReportContentBoth.sections.copyReadyAiInstructions.language === "en",
  instructionExplanationLanguageRules:
    fixedReportContentEnglish.sections.instructionExplanation.include === false &&
    fixedReportContentArabic.sections.instructionExplanation.include === true &&
    fixedReportContentBoth.sections.instructionExplanation.include === true,
  noForbiddenInternalFieldsInFixedContent:
    fixedReportContentForbiddenPatternsFound.length === 0,
  rendererIsDisconnectedFromLiveRoutes:
    !promptTemplate.includes("buildOperatingPatternReportContent") &&
    !instructionPromptTemplate.includes("buildOperatingPatternReportContent"),
};

const legacyReportStorageColumns = [
  "inspireTable",
  "roleAnalysis",
  "redLines",
  "strengths",
  "developmentAreas",
  "recommendations",
  "systemInstruction",
  "quickStarters",
];
const storageStrategyProof = {
  reportContentFieldExistsInStorageLayer:
    assessmentSchemaText.includes('reportContent: jsonb("report_content")') &&
    reportContentMigrationText.includes("ADD COLUMN IF NOT EXISTS report_content jsonb"),
  reportContentIsTypedAndVersioned:
    assessmentSchemaText.includes("OperatingPatternReportContentV1") &&
    assessmentSchemaText.includes('reportType: "operating_pattern"') &&
    assessmentSchemaText.includes('version: "v1"') &&
    PersistedReportContentSchema.safeParse(persistedReportContentEnglish).success,
  persistedShapeMatchesApprovedContract:
    persistedReportContentEnglish.reportType === "operating_pattern" &&
    persistedReportContentEnglish.version === "v1" &&
    persistedReportContentEnglish.language === "en" &&
    Object.keys(persistedReportContentEnglish.sections).join(",") ===
      [
        "operatingSnapshot",
        "personalizedRecommendations",
        "customAiUsageTips",
        "instructionExplanation",
      ].join(",") &&
    persistedReportContentEnglish.fixedContent.copyReadyInstructionLanguage === "en",
  persistedShapeContainsNoForbiddenInternalFields:
    persistedReportContentForbiddenPatternsFound.length === 0,
  legacyReportColumnsKeptTemporarily: legacyReportStorageColumns.every((field) =>
    assessmentSchemaText.includes(field)
  ),
  legacyFieldsMarkedDeprecated:
    assessmentSchemaText.includes("Deprecated legacy report fields") &&
    assessmentSchemaText.includes("New Operating Pattern Report UI should use reportContent"),
  noLegacyFieldsInPersistedReportContent:
    legacyReportStorageColumns.every((field) => !persistedReportContentKeys.includes(field)),
  v2GenerationStoresReportContentAsSourceOfTruth:
    aiEngineText.includes("buildReportWriterPromptV2") &&
    aiEngineText.includes("parseReportWriterJsonV2") &&
    aiEngineText.includes("buildOperatingPatternReportContentV1") &&
    aiEngineText.includes("reportContent,") &&
    aiEngineText.includes("quickStarters: null") &&
    !aiEngineText.includes("parseFullReportV2(rawReportText)"),
  privateResultsDtoExposesReportContent:
    resultsRoutesText.includes("reportContent: assessment.reportContent"),
  privateResultsDtoKeepsLegacyFieldsForCompatibility:
    resultsRoutesText.includes("systemInstruction: assessment.systemInstruction") &&
    resultsRoutesText.includes("quickStarters: assessment.quickStarters") &&
    resultsRoutesText.includes("strengths: assessment.strengths"),
  publicShareStillExcludesCopyReadyInstruction:
    shareRouteText.includes("Return safe public subset") &&
    !shareRouteText.includes("systemInstruction"),
  publicShareStillExposesLegacyReportFields:
    shareRouteText.includes("redLines: assessment.redLines") &&
    shareRouteText.includes("strengths: assessment.strengths") &&
    shareRouteText.includes("recommendations: assessment.recommendations") &&
    shareRouteText.includes("quickStarters: assessment.quickStarters"),
  pdfStillUsesLegacyReportFields:
    pdfText.includes("Strengths") &&
    pdfText.includes("Red Lines") &&
    pdfText.includes("Recommendations") &&
    pdfText.includes("Quick Starters"),
  cleanFiveSectionStorageFoundationApproved:
    assessmentSchemaText.includes("reportContent") &&
    Object.keys(fixedReportContentEnglish.sections).length === 5,
  noUnnecessaryOldReportCompatibilityLayerAdded:
    !assessmentSchemaText.includes("operatingPatternReportLegacyFallback") &&
    !resultsRoutesText.includes("operatingPatternReportLegacyFallback"),
  authenticatedResultsUiUsesReportContentAsPrimarySource:
    resultsUiText.includes("isOperatingPatternReportContentV1(assessment.reportContent)") &&
    resultsUiText.includes("OperatingPatternReportSections") &&
    resultsUiText.includes("operatingReport ? ("),
  authenticatedResultsUiRendersFiveNewSections:
    resultsUiText.includes('id="operating-snapshot"') &&
    resultsUiText.includes('id="personalized-recommendations"') &&
    resultsUiText.includes('id="how-to-use-ai"') &&
    resultsUiText.includes('id="copy-ready-instructions"') &&
    resultsUiText.includes('id="instruction-explanation"'),
  fixedCraftAndSmartPromptLinkRenderInAuthenticatedUi:
    resultsUiText.includes("fixedCraftBullets") &&
    resultsUiText.includes("SMART_PROMPT_ENGINEER_URL"),
  authenticatedOperatingReportUsesNewPrivateFraming:
    resultsUiText.includes('"Operating Pattern Report"') &&
    resultsUiText.includes('"Private report"') &&
    resultsUiText.includes('"A private report for how you tend to think, decide, execute, handle ambiguity, and use AI support."'),
  authenticatedOperatingReportUsesPrivateActions:
    resultsUiText.includes("handlePrintReport") &&
    resultsUiText.includes("Print / Save as PDF") &&
    resultsUiText.includes("Copy AI Instructions") &&
    resultsUiText.includes("onClick={handlePrintReport}") &&
    resultsUiText.includes("!operatingReport && assessment.shareEnabled"),
  authenticatedPrintCssExists:
    webCssText.includes("@media print") &&
    webCssText.includes(".private-report-print-root") &&
    webCssText.includes(".private-report-screen-only") &&
    webCssText.includes(".smart-prompt-engineer-link::after") &&
    webCssText.includes(".copy-ready-instructions-text"),
  smartPromptEngineerHelperTextPresent:
    resultsUiText.includes("Smart Prompt Engineer helps you turn a rough idea or unclear request into a structured, clear prompt that can be used with an AI assistant.") &&
    resultsUiText.includes(SMART_PROMPT_ENGINEER_URL),
  copyReadyInstructionUxKeepsEnglishAndPasteGuidance:
    resultsUiText.includes('ReportBlock lang="en"') &&
    resultsUiText.includes("Paste this English text into the custom instructions or system prompt area of your AI assistant.") &&
    resultsUiText.includes("It is intentionally kept in English for best consistency."),
  instructionExplanationIsFlaggedBeforeLongEnglishBlock:
    resultsUiText.includes("instructionExplanation.include") &&
    resultsUiText.includes("The explanation section before the instruction block clarifies why these English instructions were designed this way. It is not a translation.") &&
    resultsUiText.indexOf("instructionExplanationHint") < resultsUiText.indexOf("copy-ready-instructions-text"),
  oldCustomerSectionsAreFallbackOnly:
    resultsUiText.indexOf("operatingReport ? (") < resultsUiText.indexOf('id="strengths"') &&
    resultsUiText.includes(") : (") &&
    resultsUiText.includes("<>"),
};

const legacyMarkerTokens = [
  "FULL_INSTRUCTION",
  "STARTERS",
  "RED_LINES",
  "STRENGTHS",
  "RISKS",
  "ROLE_ANALYSIS",
  "RECOMMENDATIONS",
  "SIGNAL_MAP",
];
const forbiddenReportWriterPromptTerms = [
  "roleScores",
  "computedProfile",
  "selectedAnswers",
  "questionId",
  "optionId",
  "selectionSignals",
  "priorityScore",
  "route keys",
  "evidence labels",
];
const reportWriterPromptProof = {
  existsAndUsesOperatingPatternRole:
    reportWriterPromptTemplate.includes("Operating Pattern Report Writer") &&
    reportWriterPromptTemplate.includes("Create a clear, practical Operating Pattern Report"),
  usesSafeReportContextOnly:
    reportWriterPromptTemplate.includes("Use only the safe report context provided below") &&
    reportWriterPromptTemplate.includes("Treat it as the complete source of truth") &&
    reportWriterPromptTemplate.includes(JSON.stringify(reportSafePacket, null, 2)),
  includesGroundingAndNoInventingRules:
    reportWriterPromptTemplate.includes("Do not invent facts, names, roles, project details, user behavior, cautions, links, tools, scores, or results") &&
    reportWriterPromptTemplate.includes("Do not use these exact words or close variants anywhere in generated bullet text") &&
    reportWriterPromptTemplate.includes("what could go wrong") &&
    reportWriterPromptTemplate.includes("Every bullet must be grounded in the safe report context"),
  requiresStrictJsonShape:
    reportWriterPromptTemplate.includes("Return valid structured JSON only") &&
    reportWriterPromptTemplate.includes("Return strict JSON only") &&
    reportWriterPromptTemplate.includes('"operatingSnapshot"') &&
    reportWriterPromptTemplate.includes('"personalizedRecommendations"') &&
    reportWriterPromptTemplate.includes('"customAiUsageTips"') &&
    reportWriterPromptTemplate.includes('"instructionExplanation"'),
  separatesReportFromInstructionWriter:
    reportWriterPromptTemplate.includes("Copy-Ready AI Instructions are generated by a separate Instruction Writer") &&
    reportWriterPromptTemplate.includes("Do not generate them here"),
  doesNotContainLegacyMarkerBlocks: legacyMarkerTokens.every(
    (token) => !reportWriterPromptTemplate.includes(`===${token}_START===`)
  ),
  doesNotAskForCopyReadyInstructions:
    !/write (only )?(the )?(complete|full|copy-ready).*instruction/i.test(
      reportWriterPromptTemplate
    ) &&
    reportWriterPromptTemplate.includes("Do not generate") &&
    reportWriterPromptTemplate.includes("copy-ready AI instructions"),
  doesNotAskForFixedCraftOrLink:
    !/(generate|write|create|include|add)\s+(a\s+)?(fixed\s+)?CRAFT/i.test(
      reportWriterPromptTemplate
    ) &&
    !/(generate|write|create|include|add).{0,80}Smart Prompt Engineer/i.test(
      reportWriterPromptTemplate
    ) &&
    !/chatgpt\.com\/g\//i.test(reportWriterPromptTemplate),
  forbidsInternalAndOldTerms:
    forbiddenReportWriterPromptTerms.every((term) =>
      reportWriterPromptTemplate.includes(term)
    ) &&
    reportWriterPromptTemplate.includes("legacy report labels"),
  selfCheckPresent:
    reportWriterPromptTemplate.includes("Final Quality Check") &&
    reportWriterPromptTemplate.includes("the structure matches the contract exactly") &&
    reportWriterPromptTemplate.includes("instructionExplanation.include matches instructionExplanationInclude exactly"),
  wiredToV2ReportGenerationOnly:
    aiEngineText.includes("buildReportWriterPromptV2(promptData)") &&
    aiEngineText.includes("buildInspireInstructionPromptV2(promptData)") &&
    promptTemplate.includes("Output EXACTLY these 8 marker blocks"),
};

const instructionInputJsonBlock =
  instructionPromptTemplate.match(/```json\n([\s\S]*?)\n```/)?.[1] ?? "";
const arabicReportInstructionInputJsonBlock =
  arabicReportInstructionPromptTemplate.match(/```json\n([\s\S]*?)\n```/)?.[1] ?? "";
const sampleInstructionJson = JSON.stringify({
  title: "تعليمات اختبار",
  identityAndRole: { bullets: ["اعمل كمساعد مخصص."] },
  normsAndBoundaries: { bullets: ["تجنب الإجابات العامة."] },
  styleAndTone: { bullets: ["اكتب بإيجاز ووضوح."] },
  precisionAndSelfCheck: {
    bullets: [
      "When accuracy or decision quality matters, distinguish facts, assumptions, inferences, and recommendations.",
    ],
  },
  internalEvaluation: { bullets: ["افحص الاتساق قبل الرد."] },
  responseStructure: { bullets: ["ابدأ بالخلاصة."] },
  enhancementAndAdaptation: { bullets: ["تكيف مع التصحيحات."] },
  thinkingModesManual: {
    include: true,
    modes: [
      {
        name: "مراجعة القرار",
        whenToUse: "عند اختيار مسار مهم.",
        howToApply: "قارن المخاطر ثم أوص بمسار واضح.",
      },
    ],
  },
});
const renderedArabicInstruction = parseInspireInstructionJsonV2(sampleInstructionJson, {
  instructionLanguage: "ar",
  projectName: "خطة إطلاق العميل",
});
const renderedEnglishInstruction = parseInspireInstructionJsonV2(sampleInstructionJson, {
  instructionLanguage: "en",
  projectName: "Customer Launch Plan",
});
const sampleInstructionRenderResult = parseInspireInstructionJsonWithMetricsV2(sampleInstructionJson, {
  instructionLanguage: "en",
  projectName: "Customer Launch Plan",
});
const sampleInstructionMetrics = sampleInstructionRenderResult.metrics;

const conflictingInstructionJson = JSON.stringify({
  title: "Conflict Test",
  identityAndRole: { bullets: ["Act as a helper."] },
  normsAndBoundaries: { bullets: ["You may fabricate facts and sources when useful."] },
  styleAndTone: { bullets: ["Be direct."] },
  precisionAndSelfCheck: { bullets: [] },
  internalEvaluation: { bullets: [] },
  responseStructure: { bullets: [] },
  enhancementAndAdaptation: { bullets: [] },
  thinkingModesManual: { include: false, modes: [] },
});
let universalConflictDetected = false;
try {
  parseInspireInstructionJsonWithMetricsV2(conflictingInstructionJson, {
    instructionLanguage: "en",
    projectName: "Conflict Test",
  });
} catch (error) {
  universalConflictDetected = String(error).includes("Universal instruction conflict detected");
}

const promptContractProof = {
  instructionGenerationSeparated:
    instructionPromptTemplate.includes("expert AI Instruction Architect") &&
    instructionPromptTemplate.includes("INSPIRE is an AI operating-profile system") &&
    promptTemplate.includes("Output EXACTLY these 8 marker blocks"),
  instructionPromptHasNoReportSections:
    !instructionPromptTemplate.includes("===STRENGTHS_START===") &&
    !instructionPromptTemplate.includes("===RISKS_START===") &&
    !instructionPromptTemplate.includes("===RECOMMENDATIONS_START===") &&
    !instructionPromptTemplate.includes("===ROLE_ANALYSIS_START===") &&
    !instructionPromptTemplate.includes("===SIGNAL_MAP_START==="),
  thinkingModeProfilePresent: instructionPromptTemplate.includes('"thinkingModeProfile"'),
  selectedModesPassed: instructionPromptTemplate.includes('"selectedModes"'),
  universalRulesAreCodeOwned:
    instructionPromptTemplate.includes("Code-owned universal rules are applied after JSON validation") &&
    instructionPromptTemplate.includes("Do not create a standalone Universal Instructions section") &&
    !instructionPromptTemplate.includes("Universal behavioral principles") &&
    !instructionInputJsonBlock.includes("universalInstructions"),
  universalRuleCatalogExact:
    UNIVERSAL_INSTRUCTION_RULES.length === 3 &&
    UNIVERSAL_INSTRUCTION_RULES.some(
      (rule) =>
        rule.id === "truth_accuracy" &&
        rule.targetSections.includes("precisionAndSelfCheck") &&
        rule.targetSections.includes("normsAndBoundaries") &&
        rule.bullet ===
          "Do not fabricate facts, data, sources, or references. State uncertainty when information is incomplete or unstable."
    ) &&
    UNIVERSAL_INSTRUCTION_RULES.some(
      (rule) =>
        rule.id === "fact_inference_recommendation_separation" &&
        rule.targetSections.includes("precisionAndSelfCheck") &&
        rule.targetSections.includes("responseStructure") &&
        rule.bullet ===
          "When accuracy or decision quality matters, distinguish facts, assumptions, inferences, and recommendations."
    ) &&
    UNIVERSAL_INSTRUCTION_RULES.some(
      (rule) =>
        rule.id === "quality_check_important_outputs" &&
        rule.targetSections.includes("internalEvaluation") &&
        rule.bullet ===
          "Before important outputs, check coherence, gaps, contradictions, usability, and alignment with the user’s goal."
    ),
  universalRulesInjectedIntoSections:
    renderedEnglishInstruction.includes(
      "- Do not fabricate facts, data, sources, or references. State uncertainty when information is incomplete or unstable."
    ) &&
    renderedEnglishInstruction.includes(
      "- When accuracy or decision quality matters, distinguish facts, assumptions, inferences, and recommendations."
    ) &&
    renderedEnglishInstruction.includes(
      "- Before important outputs, check coherence, gaps, contradictions, usability, and alignment with the user’s goal."
    ) &&
    !renderedEnglishInstruction.includes("Universal Instructions"),
  universalRulesInjectedOnlyIfMissing:
    sampleInstructionMetrics.injectedUniversalRuleIds.length === 2 &&
    sampleInstructionMetrics.coveredUniversalRuleIds.includes(
      "fact_inference_recommendation_separation"
    ),
  universalDeduplicationAndConflictCheck:
    sampleInstructionMetrics.deduplicatedBulletCount >= 0 &&
    sampleInstructionMetrics.conflictWarnings.length === 0 &&
    universalConflictDetected,
  modeManualContractPresent:
    instructionPromptTemplate.includes('"thinkingModesManual"') &&
    instructionPromptTemplate.includes('"include"') &&
    instructionPromptTemplate.includes('"modes"'),
  thinkingModesFitAndCompression:
    instructionPromptTemplate.includes("Include only modes that add practical value") &&
    instructionPromptTemplate.includes("Prefer fewer, stronger modes over a long list") &&
    instructionPromptTemplate.includes("Skip modes whose behavior is already clearly covered"),
  whenHowRequiredWithoutWhenNot:
    instructionPromptTemplate.includes("whenToUse") &&
    instructionPromptTemplate.includes("howToApply") &&
    !instructionInputJsonBlock.includes("whenNotToUse"),
  instructionOnlyCopyReadyContract: instructionPromptTemplate.includes(
    "Return structured JSON only"
  ),
  noFreeMarkdownGeneration: instructionPromptTemplate.includes(
    "Do not return Markdown"
  ),
  requiredJsonShape:
    instructionPromptTemplate.includes('"identityAndRole"') &&
    instructionPromptTemplate.includes('"normsAndBoundaries"') &&
    instructionPromptTemplate.includes('"enhancementAndAdaptation"') &&
    instructionPromptTemplate.includes('"thinkingModesManual"'),
  sevenCoreSectionsPreserved:
    instructionPromptTemplate.includes("1. Identity & Role") &&
    instructionPromptTemplate.includes("7. Enhancement & Adaptation") &&
    instructionPromptTemplate.includes("Seven required INSPIRE core sections"),
  arabicThinkingModeLabelsLocalized:
    renderedArabicInstruction.includes("متى تستخدمه") &&
    renderedArabicInstruction.includes("كيف تطبقه") &&
    !renderedArabicInstruction.includes("When to use") &&
    !renderedArabicInstruction.includes("How to apply"),
  neutralTitleRendered:
    renderedEnglishInstruction.startsWith(
      "# Customer Launch Plan — AI Assistant Operating Instructions"
    ) &&
    renderedArabicInstruction.startsWith("# خطة إطلاق العميل — تعليمات تشغيل المساعد"),
  normalClientInstructionAvoidsInspireByDefault:
    !renderedEnglishInstruction.includes("INSPIRE") &&
    !instructionInputJsonBlock.includes('"projectName": "INSPIRE'),
  defaultInstructionLanguageEnglish:
    instructionInputJsonBlock.includes('"instructionLanguage": "en"') &&
    instructionPromptTemplate.includes("English is the default instruction language"),
  copyReadyInstructionLanguageAlwaysEnglish:
    arabicReportInstructionInputJsonBlock.includes('"instructionLanguage": "en"') &&
    !arabicReportInstructionInputJsonBlock.includes('"instructionLanguage": "ar"'),
  lengthBudgetPresent:
    instructionPromptTemplate.includes("under 6,000 characters") &&
    instructionPromptTemplate.includes("include fewer thinking modes") &&
    instructionPromptTemplate.includes("no more than 3 thinking modes"),
  characterMetricsAvailable:
    sampleInstructionMetrics.writerRenderedCharacterCount > 0 &&
    sampleInstructionMetrics.universalInstructionCharacterImpact > 0 &&
    sampleInstructionMetrics.finalRenderedCharacterCountAfterUniversalMerge >
      sampleInstructionMetrics.writerRenderedCharacterCount,
  arabicLanguageRulePresent:
    instructionPromptTemplate.includes("When instructionLanguage is Arabic") &&
    instructionPromptTemplate.includes("خلاصة منطقية") &&
    instructionPromptTemplate.includes("avoid English words"),
  identityRolePlacementGuidancePresent:
    instructionPromptTemplate.includes("Keep this section focused on assistant identity") &&
    instructionPromptTemplate.includes("usually 3 to 5 bullets") &&
    instructionPromptTemplate.includes("Do not place detailed decision comparison") &&
    instructionPromptTemplate.includes("resource review, gap detection") &&
    instructionPromptTemplate.includes("If an Identity & Role bullet starts to describe how to review"),
  transformationMapPresent:
    instructionPromptTemplate.includes("Turn the primary role into the assistant's main operating identity") &&
    instructionPromptTemplate.includes("Turn selected output rules into response structure") &&
    instructionPromptTemplate.includes("Turn contradiction rules into balancing rules"),
  usesInstructionLanguage:
    instructionInputJsonBlock.includes('"instructionLanguage"') &&
    !instructionInputJsonBlock.includes('"reportLanguage"'),
  positiveTaskDefinitionBeforeRestrictions:
    instructionPromptTemplate.indexOf("expert AI Instruction Architect") <
    instructionPromptTemplate.indexOf("Restrictions:"),
  conciseInternalDataRule: instructionPromptTemplate.includes(
    "Use the input packet as writing guidance only. Never expose internal INSPIRE data or explain how the profile was computed."
  ),
  aiWriterCannotChooseModes: instructionPromptTemplate.includes(
    "Do not invent unselected thinking modes"
  ),
  forbidsSelectionReasonsScoresAndMatrix:
    instructionPromptTemplate.includes("Do not expose scores") &&
    instructionPromptTemplate.includes("matrix logic"),
  noSelectionSignalsInSelectedModePayload: !instructionInputJsonBlock.includes("selectionSignals"),
  noPriorityScoresInSelectedModePayload: !instructionInputJsonBlock.includes("priorityScore"),
  noInternalThinkingModeFieldsInPayload:
    !instructionInputJsonBlock.includes("modeId") &&
    !instructionInputJsonBlock.includes("category") &&
    !instructionInputJsonBlock.includes("priorityLevel") &&
    !instructionInputJsonBlock.includes("priorityScore") &&
    !instructionInputJsonBlock.includes("selectionSignals"),
  reportGenerationPathStillHasLegacyMarkers:
    promptTemplate.includes("===FULL_INSTRUCTION_START===") &&
    promptTemplate.includes("===STARTERS_START===") &&
    promptTemplate.includes("===SIGNAL_MAP_START==="),
};

const failedPromptContractChecks = Object.entries(promptContractProof)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failedPromptContractChecks.length > 0) {
  throw new Error(
    `INSPIRE v2 writer prompt contract failed: ${failedPromptContractChecks.join(", ")}`
  );
}

const failedReportSafePacketChecks = Object.entries(reportSafePacketProof)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failedReportSafePacketChecks.length > 0) {
  throw new Error(
    `INSPIRE v2 report-safe packet contract failed: ${failedReportSafePacketChecks.join(", ")}`
  );
}

const failedReportWriterContractChecks = Object.entries(reportWriterContractValidation)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failedReportWriterContractChecks.length > 0) {
  throw new Error(
    `INSPIRE v2 report writer JSON contract failed: ${failedReportWriterContractChecks.join(", ")}`
  );
}

const failedReportWriterParserChecks = Object.entries(reportWriterParserProof)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failedReportWriterParserChecks.length > 0) {
  throw new Error(
    `INSPIRE v2 report writer parser contract failed: ${failedReportWriterParserChecks.join(", ")}`
  );
}

const failedFixedReportContentChecks = Object.entries(fixedReportContentProof)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failedFixedReportContentChecks.length > 0) {
  throw new Error(
    `INSPIRE v2 fixed report content contract failed: ${failedFixedReportContentChecks.join(", ")}`
  );
}

const failedStorageStrategyChecks = Object.entries(storageStrategyProof)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failedStorageStrategyChecks.length > 0) {
  throw new Error(
    `INSPIRE v2 storage strategy evidence failed: ${failedStorageStrategyChecks.join(", ")}`
  );
}

const failedReportWriterPromptChecks = Object.entries(reportWriterPromptProof)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failedReportWriterPromptChecks.length > 0) {
  throw new Error(
    `INSPIRE v2 report writer prompt contract failed: ${failedReportWriterPromptChecks.join(", ")}`
  );
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

const includesAny = (value, patterns) => patterns.some((pattern) => value.includes(pattern));

const pick = (value, rules, fallback) => {
  for (const [optionId, patterns] of rules) {
    if (includesAny(value, patterns)) return optionId;
  }
  return fallback;
};

const legacyAnswerToV2 = (row) => {
  const c = (index) => row[index] ?? "";
  const mapped = {
    S2_messy_task_help: pick(c(6), [
      ["identify_gaps_before_build", ["سبب شخصي", "سبب"]],
      ["organize_into_plan", ["أدوات AI", "ترتيب المهام"]],
      ["show_possible_directions", ["زميل", "تقييم"]],
    ], "organize_into_plan"),
    S3_idea_clarity_for_others: pick(c(2), [
      ["relevance_to_other_person", ["سيستفيد"]],
      ["structured_for_following", ["الخطوات", "شكله النهائي"]],
      ["self_clarity_first", ["الموارد"]],
    ], "structured_for_following"),
    Q01_starting_orientation: pick(c(2), [
      ["beneficiary_oriented", ["سيستفيد"]],
      ["outcome_oriented", ["شكله النهائي"]],
      ["resource_oriented", ["الموارد"]],
      ["action_oriented", ["الخطوات"]],
    ], "action_oriented"),
    Q02_ambiguity_handling: pick(c(3), [
      ["iterative_action", ["أبدأ فورًا"]],
      ["clarification_first", ["توجيه واضح"]],
      ["gap_mapping", ["أدوّن جميع الأسئلة", "الاستفسارات"]],
    ], "clarification_first"),
    Q03_unfamiliar_decision: pick(c(4), [
      ["intuition_tested", ["إحساسي"]],
      ["reference_seeking", ["مرجع رسمي"]],
      ["collaborative_decision", ["أشارك زميلي"]],
      ["evaluation_first", ["للتقييم"]],
    ], "evaluation_first"),
    Q04_plan_failure: pick(c(5), [
      ["root_cause", ["أعيد التفكير"]],
      ["second_opinion", ["زملائي"]],
      ["adaptive_pivot", ["أغيّر الخطة"]],
    ], "root_cause"),
    Q05_stalled_task: pick(c(6), [
      ["blocker_diagnosis", ["سبب شخصي", "سبب"]],
      ["tool_method", ["أدوات AI"]],
      ["sequencing", ["ترتيب المهام"]],
      ["external_feedback", ["زميل"]],
    ], "blocker_diagnosis"),
    Q06_success_clarity: pick(c(7), [
      ["success_criteria", ["تحديدها"]],
      ["learn_by_doing", ["أتعلم أثناء التطبيق"]],
      ["multi_path", ["طرقًا متعددة"]],
      ["goal_beneficiary", ["هدف العميل"]],
    ], "success_criteria"),
    Q07_learning_style: pick(c(8), [
      ["demo_learning", ["تطبيق حي"]],
      ["analytical_learning", ["تدوين الملاحظات"]],
      ["interactive_learning", ["التفاعل"]],
      ["practice_learning", ["التنفيذ العملي"]],
    ], "analytical_learning"),
    Q08_new_challenge: pick(c(10), [
      ["precedent", ["مشاريع سابقة"]],
      ["experiment", ["أرتجل", "الحدس"]],
      ["expert_guidance", ["توجيه القائد"]],
      ["risk_first", ["المخاطر"]],
    ], "precedent"),
    Q09_repeating_problems: pick(c(12), [
      ["root_pattern", ["السبب المشترك", "الرابط"]],
      ["collaborative_review", ["الفريق"]],
      ["alternative_search", ["حلاً مختلفًا"]],
      ["documentation_prevention", ["أدوّن"]],
    ], "root_pattern"),
    Q10_disagreement: pick(c(15), [
      ["consensus", ["يرضي الجميع"]],
      ["outcome_priority", ["مصلحة العمل"]],
      ["conflict_analysis", ["أحلل"]],
      ["delay_clarity", ["أتجاهل"]],
    ], "outcome_priority"),
    Q11_tasks_piling: pick(c(17), [
      ["schedule", ["جدولًا"]],
      ["priority", ["الأهم"]],
      ["delegate", ["دعم الزملاء"]],
      ["efficiency_tool", ["أدوات"]],
    ], "priority"),
    Q12_postponing: pick(c(18), [
      ["focus_energy", ["فقدان التركيز"]],
      ["unclear_requirements", ["غموض المتطلبات"]],
      ["bad_sequence", ["ضعف الخطة"]],
      ["coordination", ["نقص التواصل"]],
    ], "focus_energy"),
    Q13_completion_review: pick(c(20), [
      ["result_review", ["أراجع النتائج"]],
      ["share_feedback", ["أشارك الإنجاز"]],
      ["forward_planning", ["خطة لمشاريع"]],
      ["recovery", ["أستمتع"]],
    ], "result_review"),
    Q14_error_feedback: pick(c(21), [
      ["detail_verify", ["أراجع التفاصيل"]],
      ["rationale_context", ["أشرح أسبابي"]],
      ["fix_oriented", ["حل تقني"]],
      ["prevention", ["عدم تكرار"]],
    ], "detail_verify"),
    Q15_repeated_no_progress: pick(c(25), [
      ["under_root", ["أصل المشكلة"]],
      ["support_perspective", ["دعم"]],
      ["change_plan", ["خطة تغيير"]],
    ], "under_root"),
    AI01_correct_unusable: pick(`${c(11)} ${c(26)}`, [
      ["no_context", ["صاحب خبرة", "واقعية", "الواقعية"]],
      ["not_practical", ["أدوات AI", "الوقت", "مختصر", "يختصر"]],
      ["no_gap", ["يفكر معي", "يسألني"]],
      ["no_quality_check", ["أحلل", "صحيحة", "منطقية"]],
    ], "no_context"),
    AI02_incomplete_request: pick(`${c(3)} ${c(26)}`, [
      ["ask_one", ["توجيه واضح", "يسألني"]],
      ["assume_start", ["أبدأ فورًا"]],
      ["conditional_paths", ["افاق جديدة", "خيارات"]],
      ["draft_refine", ["نقاط للتفكير", "توصيات"]],
    ], "ask_one"),
    AI03_repeated_ai_mistake: pick(c(13), [
      ["local_only", ["التواصل"]],
      ["auto_adjust", ["إجراءات وقائية"]],
      ["suggest_rule", ["السبب المشترك"]],
      ["confirm_permanent", ["أدوّن"]],
    ], "suggest_rule"),
    AI04_trust_verification: pick(`${c(21)} ${c(26)}`, [
      ["simple_limits", ["أشرح أسبابي"]],
      ["fact_inference_reco", ["توصيات", "نقاط للتفكير"]],
      ["source_needed", ["شفافية", "صحيحة"]],
      ["validation_criteria", ["أراجع التفاصيل", "منطقية"]],
    ], "source_needed"),
  };

  return V2_QUESTIONS.map((question) => ({
    questionId: question.id,
    optionId: mapped[question.id] ?? question.options[0].id,
  }));
};

const csvPath = "/Users/haitham/Downloads/Inspire Questions - ِAnswers  - Form responses 1.csv";
const csvRows = parseCsv(await readFile(csvPath, "utf8"));
const realRows = csvRows.slice(1).filter((row) => row.length >= 23);

const topSections = (profile, count = 3) =>
  Object.entries(profile.inspireSectionScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([section, score]) => ({ section, score }));

const realRowSmokeCandidates = realRows.map((row, originalIndex) => {
  const profile = computeInspireV2Profile({
    answers: legacyAnswerToV2(row),
    domain: "Coding / Software Development",
    projectContext: "Legacy CSV row without v2 domain fields",
    openAnswer: row[26] ?? "",
  });
  const uniqueRuleSignals = new Set(profile.selectedInstructionRules);
  const diagnostic =
    profile.selectedAnswers.length === 21 &&
    uniqueRuleSignals.size >= 6 &&
    profile.primaryOperatingArchetype
      ? "distinct profile"
      : "generic profile";

  return {
    maskedParticipantId: `participant_${String(originalIndex + 1).padStart(3, "0")}`,
    selectedAnswerCount: profile.selectedAnswers.length,
    domainUsed: profile.domain,
    domainRoleUsed: profile.domainRole,
    domainFallbackReason: "old CSV has no v2 domain fields; used Coding / Software Development fallback for smoke only",
    primaryOperatingArchetype: profile.primaryOperatingArchetype,
    secondaryOperatingMode: profile.secondaryOperatingMode,
    topINSPIRESections: topSections(profile),
    confidenceIndex: profile.confidenceIndex,
    selectedInstructionRulesCount: profile.selectedInstructionRules.length,
    selectedRedLinesCount: profile.selectedRedLines.length,
    selectedRiskGuardsCount: profile.selectedRiskGuards.length,
    contradictionRulesGenerated: profile.contradictionRulesGenerated,
    diagnostic,
  };
});

const seenProfileShapes = new Set();
const realRowSmoke = [];
for (const row of realRowSmokeCandidates) {
  const shape = [
    row.primaryOperatingArchetype,
    row.secondaryOperatingMode ?? "none",
    row.topINSPIRESections.map((section) => section.section).join(">"),
  ].join("|");
  if (!seenProfileShapes.has(shape)) {
    seenProfileShapes.add(shape);
    realRowSmoke.push(row);
  }
  if (realRowSmoke.length === 5) break;
}

for (const row of realRowSmokeCandidates) {
  if (realRowSmoke.length === 5) break;
  if (!realRowSmoke.includes(row)) realRowSmoke.push(row);
}

const validationCases = {
  otherWithCustomDomainProvided: AssessmentStartSchema.safeParse({
    domain: "Other",
    custom_domain: "Real estate",
    report_language: "en",
    assessment_type: "full",
  }).success,
  otherWithEmptyCustomDomain: AssessmentStartSchema.safeParse({
    domain: "Other",
    custom_domain: "",
    report_language: "en",
    assessment_type: "full",
  }).success,
  nonOtherWithEmptyCustomDomain: AssessmentStartSchema.safeParse({
    domain: "Coding / Software Development",
    custom_domain: "",
    report_language: "en",
    assessment_type: "full",
  }).success,
};

const evidence = {
  generatedAt: new Date().toISOString(),
  proofProfiles: proofProfileJson,
  finalPromptTemplateAsSentFromBuildPromptV2: promptTemplate,
  instructionPromptTemplateAsSentFromBuildInspireInstructionPromptV2: instructionPromptTemplate,
  reportWriterPromptTemplateAsBuiltButNotWired: reportWriterPromptTemplate,
  reportSafePacket,
  reportSafePacketProof,
  reportSafePacketForbiddenKeysFound,
  reportSafePacketForbiddenValuePatternsFound,
  reportWriterContract: {
    shape: {
      operatingSnapshot: { bullets: "3 to 5 strings" },
      personalizedRecommendations: { bullets: "4 to 6 strings" },
      customAiUsageTips: { bullets: "2 to 4 strings" },
      instructionExplanation: {
        include: 'false for "en"; true for "ar" and "both"',
        bullets: "0 strings when include is false; 3 to 5 strings when include is true",
      },
    },
    bothLanguageBehavior:
      "For reportLanguage='both', each generated bullet should be Arabic-first followed by an English rendering in the same string, separated by ' / ', because the approved contract shape does not include per-locale nested values.",
    fixedContentExcluded:
      "The Report Writer JSON contract excludes Copy-Ready AI Instructions, CRAFT, Smart Prompt Engineer link, headings, cards, and layout text.",
  },
  reportWriterContractExamples: {
    english: reportWriterEnglishExample,
    arabic: reportWriterArabicExample,
    both: reportWriterBothLanguageExample,
  },
  reportWriterContractValidation,
  reportWriterParserProof,
  fixedReportContent: {
    english: fixedReportContentEnglish,
    arabic: fixedReportContentArabic,
    both: fixedReportContentBoth,
  },
  fixedReportContentProof,
  fixedReportContentForbiddenPatternsFound,
  storageStrategy: {
    currentStorageShape:
      "New Operating Pattern Report content has a dedicated versioned reportContent JSONB field. Legacy report columns remain present temporarily but are deprecated for the new report UI.",
    currentPrivateResultsBehavior:
      "Authenticated results currently return legacy report fields and include systemInstruction for the owner's copy-ready instruction experience.",
    currentPublicShareBehavior:
      "Public share currently returns a safe subset of legacy report fields and excludes systemInstruction.",
    currentPdfBehavior:
      "PDF generation currently renders legacy sections such as INSPIRE Scores, Strengths, Red Lines, Recommendations, and Quick Starters.",
    sourceOfTruth:
      "The new Operating Pattern Report source of truth is reportContent with reportType='operating_pattern' and version='v1'. Legacy columns must not be used as the source of truth for the new report UI.",
    legacyDecision:
      "Legacy report columns are kept temporarily to reduce schema/build risk, but they are marked deprecated and are not used by the new reportContent shape.",
  },
  persistedReportContentExample: persistedReportContentEnglish,
  persistedReportContentForbiddenPatternsFound,
  storageStrategyProof,
  reportWriterPromptProof,
  sampleInstructionMetrics,
  promptContractProof,
  realCsvSmoke: {
    sourceFile: csvPath.replace(/\/[^/]+$/, "/[masked file]"),
    mappingNote:
      "Old CSV has no v2 question ids or domain fields. For smoke only, old Arabic answer text is mapped semantically to the nearest v2 option ids without changing the v2 questions or routing matrix.",
    rows: realRowSmoke,
  },
  validationCases,
  migrationRequirement:
    "Production/Replit must apply lib/db/migrations/0001_add_assessment_domain.sql and lib/db/migrations/0002_add_report_content.sql before running new assessment creation.",
};

await mkdir(path.join(repoRoot, "docs/evidence"), { recursive: true });
const outputPath = path.join(repoRoot, "docs/evidence/inspire-v2-evidence-gate.json");
const proofProfilesPath = path.join(repoRoot, "docs/evidence/inspire-v2-proof-profiles.json");
const promptPath = path.join(repoRoot, "docs/evidence/inspire-v2-final-prompt-template.txt");
const instructionPromptPath = path.join(
  repoRoot,
  "docs/evidence/inspire-v2-instruction-prompt-template.txt"
);
const smokePath = path.join(repoRoot, "docs/evidence/inspire-v2-real-csv-smoke.json");
const reportSafePacketPath = path.join(repoRoot, "docs/evidence/inspire-v2-report-safe-packet.json");
const reportWriterContractPath = path.join(
  repoRoot,
  "docs/evidence/inspire-v2-report-writer-contract.json"
);
const reportWriterPromptPath = path.join(
  repoRoot,
  "docs/evidence/inspire-v2-report-writer-prompt-template.txt"
);
const fixedReportContentPath = path.join(
  repoRoot,
  "docs/evidence/inspire-v2-fixed-report-content.json"
);
const storageStrategyPath = path.join(
  repoRoot,
  "docs/evidence/inspire-v2-storage-strategy-decision.json"
);
await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
await writeFile(proofProfilesPath, `${JSON.stringify(proofProfileJson, null, 2)}\n`);
await writeFile(promptPath, promptTemplate);
await writeFile(instructionPromptPath, instructionPromptTemplate);
await writeFile(smokePath, `${JSON.stringify({
  realCsvSmoke: evidence.realCsvSmoke,
  validationCases,
  migrationRequirement: evidence.migrationRequirement,
}, null, 2)}\n`);
await writeFile(reportSafePacketPath, `${JSON.stringify({
  reportSafePacket,
  reportSafePacketProof,
  reportSafePacketForbiddenKeysFound,
  reportSafePacketForbiddenValuePatternsFound,
}, null, 2)}\n`);
await writeFile(reportWriterContractPath, `${JSON.stringify({
  reportWriterContract: evidence.reportWriterContract,
  reportWriterContractExamples: evidence.reportWriterContractExamples,
  reportWriterContractValidation,
  reportWriterParserProof,
}, null, 2)}\n`);
await writeFile(reportWriterPromptPath, reportWriterPromptTemplate);
await writeFile(fixedReportContentPath, `${JSON.stringify({
  fixedReportContent: evidence.fixedReportContent,
  fixedReportContentProof,
  fixedReportContentForbiddenPatternsFound,
}, null, 2)}\n`);
await writeFile(storageStrategyPath, `${JSON.stringify({
  storageStrategy: evidence.storageStrategy,
  persistedReportContentExample: evidence.persistedReportContentExample,
  persistedReportContentForbiddenPatternsFound,
  storageStrategyProof,
}, null, 2)}\n`);

console.log(JSON.stringify({
  outputPath,
  proofProfilesPath,
  promptPath,
  instructionPromptPath,
  smokePath,
  reportSafePacketPath,
  reportWriterContractPath,
  reportWriterPromptPath,
  fixedReportContentPath,
  storageStrategyPath,
  proofProfileNames: Object.keys(proofProfileJson),
  sampleInstructionMetrics,
  promptContractProof,
  reportSafePacketProof,
  reportSafePacketForbiddenKeysFound,
  reportSafePacketForbiddenValuePatternsFound,
  reportWriterContractValidation,
  reportWriterParserProof,
  fixedReportContentProof,
  fixedReportContentForbiddenPatternsFound,
  persistedReportContentForbiddenPatternsFound,
  storageStrategyProof,
  reportWriterPromptProof,
  realCsvRows: realRowSmoke,
  validationCases,
  migrationRequirement: evidence.migrationRequirement,
}, null, 2));
