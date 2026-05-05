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
    export { buildInspireInstructionPromptV2, buildPromptV2 } from ${JSON.stringify(
      path.join(repoRoot, "artifacts/api-server/src/lib/prompt-builder.ts")
    )};
    export { AssessmentStartSchema } from ${JSON.stringify(
      path.join(repoRoot, "artifacts/api-server/src/lib/validators.ts")
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
  AssessmentStartSchema,
} = await import(pathToFileURL(bundleFile).href);

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
  projectName: "INSPIRE evidence gate",
  projectGoal: "Inspect the final prompt without generating a report.",
  domain: "Coding / Software Development",
  domainSpecialization: "React / Next.js frontend",
  projectContext: "I am building a dashboard",
  reportLanguage: "en",
  answers: makeAnswers(proofProfiles[0].choices),
  openAnswer: proofProfiles[0].openAnswer,
};

const promptTemplate = buildPromptV2(promptInput);
const instructionPromptTemplate = buildInspireInstructionPromptV2(promptInput);

const instructionInputJsonBlock =
  instructionPromptTemplate.match(/```json\n([\s\S]*?)\n```/)?.[1] ?? "";

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
  universalPrinciplesMergedByPrompt:
    instructionPromptTemplate.includes("Universal behavioral principles") &&
    !instructionInputJsonBlock.includes("universalInstructions"),
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
  promptContractProof,
  realCsvSmoke: {
    sourceFile: csvPath.replace(/\/[^/]+$/, "/[masked file]"),
    mappingNote:
      "Old CSV has no v2 question ids or domain fields. For smoke only, old Arabic answer text is mapped semantically to the nearest v2 option ids without changing the v2 questions or routing matrix.",
    rows: realRowSmoke,
  },
  validationCases,
  migrationRequirement:
    "Production/Replit must apply lib/db/migrations/0001_add_assessment_domain.sql before running new assessment creation.",
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
await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
await writeFile(proofProfilesPath, `${JSON.stringify(proofProfileJson, null, 2)}\n`);
await writeFile(promptPath, promptTemplate);
await writeFile(instructionPromptPath, instructionPromptTemplate);
await writeFile(smokePath, `${JSON.stringify({
  realCsvSmoke: evidence.realCsvSmoke,
  validationCases,
  migrationRequirement: evidence.migrationRequirement,
}, null, 2)}\n`);

console.log(JSON.stringify({
  outputPath,
  proofProfilesPath,
  promptPath,
  instructionPromptPath,
  smokePath,
  proofProfileNames: Object.keys(proofProfileJson),
  promptContractProof,
  realCsvRows: realRowSmoke,
  validationCases,
  migrationRequirement: evidence.migrationRequirement,
}, null, 2));
