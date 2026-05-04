import { createRequire } from "node:module";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const apiServerDir = path.join(repoRoot, "artifacts/api-server");
const require = createRequire(import.meta.url);
const { build } = require(require.resolve("esbuild", { paths: [apiServerDir] }));

const tempDir = await mkdtemp(path.join(os.tmpdir(), "inspire-v2-proof-"));
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
    export { OPTION_ROUTES } from ${JSON.stringify(
      path.join(repoRoot, "artifacts/api-server/src/data/option-routing.ts")
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

const { V2_QUESTIONS, computeInspireV2Profile, OPTION_ROUTES } = await import(
  pathToFileURL(bundleFile).href
);

const makeAnswers = (choices) =>
  V2_QUESTIONS.map((question) => ({
    questionId: question.id,
    optionId: choices[question.id] ?? question.options[0].id,
  }));

const topSections = (profile, count = 3) =>
  Object.entries(profile.inspireSectionScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([section]) => section);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const testProfiles = [
  {
    name: "fast executor",
    expectedPrimaryRole: "Executor / Builder",
    expectedDominantSections: ["ResponseStructure", "NormsBoundaries", "EnhancementAdaptation"],
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
    expectedPrimaryRole: "Critical Reviewer",
    expectedDominantSections: ["PrecisionSelfCheck", "NormsBoundaries", "InternalEvaluation"],
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
    name: "teacher/simplifier preference",
    expectedPrimaryRole: "Teacher / Simplifier",
    expectedDominantSections: ["NormsBoundaries", "PrecisionSelfCheck", "InternalEvaluation"],
    openAnswer:
      "I prefer simple explanation, examples, and step-by-step teaching before jumping into complex recommendations.",
    choices: {
      S2_messy_task_help: "simplify_then_continue",
      S3_idea_clarity_for_others: "plain_language_no_assumed_expertise",
      Q01_starting_orientation: "beneficiary_oriented",
      Q02_ambiguity_handling: "clarification_first",
      Q03_unfamiliar_decision: "reference_seeking",
      Q04_plan_failure: "second_opinion",
      Q05_stalled_task: "external_feedback",
      Q06_success_clarity: "learn_by_doing",
      Q07_learning_style: "demo_learning",
      Q08_new_challenge: "expert_guidance",
      Q09_repeating_problems: "collaborative_review",
      Q10_disagreement: "consensus",
      Q11_tasks_piling: "delegate",
      Q12_postponing: "coordination",
      Q13_completion_review: "share_feedback",
      Q14_error_feedback: "rationale_context",
      Q15_repeated_no_progress: "learn_examples",
      AI01_correct_unusable: "no_context",
      AI02_incomplete_request: "ask_one",
      AI03_repeated_ai_mistake: "confirm_permanent",
      AI04_trust_verification: "simple_limits",
    },
  },
  {
    name: "strategic organizer",
    expectedPrimaryRole: "Strategic Organizer",
    expectedDominantSections: ["ResponseStructure", "NormsBoundaries", "IdentityRole"],
    openAnswer:
      "I want organized thinking, priorities, sequencing, clear outcomes, and context-aware planning.",
    choices: {
      S2_messy_task_help: "organize_into_plan",
      S3_idea_clarity_for_others: "structured_for_following",
      Q01_starting_orientation: "outcome_oriented",
      Q02_ambiguity_handling: "gap_mapping",
      Q03_unfamiliar_decision: "reference_seeking",
      Q04_plan_failure: "context_constraints",
      Q05_stalled_task: "sequencing",
      Q06_success_clarity: "goal_beneficiary",
      Q07_learning_style: "analytical_learning",
      Q08_new_challenge: "precedent",
      Q09_repeating_problems: "documentation_prevention",
      Q10_disagreement: "outcome_priority",
      Q11_tasks_piling: "priority",
      Q12_postponing: "bad_sequence",
      Q13_completion_review: "forward_planning",
      Q14_error_feedback: "rationale_context",
      Q15_repeated_no_progress: "change_plan",
      AI01_correct_unusable: "no_context",
      AI02_incomplete_request: "conditional_paths",
      AI03_repeated_ai_mistake: "suggest_rule",
      AI04_trust_verification: "fact_inference_reco",
    },
  },
  {
    name: "thinking partner / conversational explorer",
    expectedPrimaryRole: "Thinking Partner",
    expectedDominantSections: ["IdentityRole", "InternalEvaluation", "PrecisionSelfCheck"],
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

const auditOptionStrengthWeights = () =>
  OPTION_ROUTES.map((route) => {
    const maxRoleHint = Math.max(...Object.values(route.roleHints));
    const allRoleHintsZero = maxRoleHint === 0;
    const contradictionLoad = route.contradictionTags.length;
    const isAmbiguous =
      route.confidenceEffect < 0 ||
      allRoleHintsZero ||
      /support|collaborative|context|adaptive|confirm|local|possible|alternative/.test(
        route.behavioralSignal
      );
    const suggestedWeight =
      allRoleHintsZero || route.confidenceEffect < 0
        ? 0.3
        : route.confidenceEffect === 0 || contradictionLoad >= 2 || isAmbiguous
          ? 0.6
          : 1.0;
    return {
      questionId: route.questionId,
      optionId: route.optionId,
      behavioralSignal: route.behavioralSignal,
      current: route.optionStrengthWeight,
      suggested: suggestedWeight,
      rationale:
        suggestedWeight === 1
          ? "Explicit/strong behavioral signal."
          : suggestedWeight === 0.6
            ? "Contextual or moderate signal; useful but should not dominate scoring."
            : "Weak, ambiguous, or persistence/adaptation-only signal.",
    };
  }).filter((row) => row.current !== row.suggested);

const results = [];
const failures = [];

for (const testProfile of testProfiles) {
  const computedProfile = computeInspireV2Profile({
    answers: makeAnswers(testProfile.choices),
    domain: testProfile.domain ?? "Coding / Software Development",
    customDomain: testProfile.customDomain,
    domainSpecialization: testProfile.domainSpecialization,
    projectContext: testProfile.projectContext ?? "AI-assisted work",
    openAnswer: testProfile.openAnswer,
  });

  const dominantSections = topSections(computedProfile, 3);
  const matchedDominantSections = testProfile.expectedDominantSections.filter((section) =>
    dominantSections.includes(section)
  );
  const coveredOrNotedSections = Object.entries(computedProfile.inspireSectionScores).filter(
    ([section, score]) => score > 0 || computedProfile.lowCoverageNotes[section]
  );

  try {
    assert(
      computedProfile.primaryRole === testProfile.expectedPrimaryRole,
      `${testProfile.name}: expected primaryRole ${testProfile.expectedPrimaryRole}, got ${computedProfile.primaryRole}`
    );
    assert(
      matchedDominantSections.length >= 2,
      `${testProfile.name}: expected at least 2 dominant sections from ${testProfile.expectedDominantSections.join(
        ", "
      )}, got ${dominantSections.join(", ")}`
    );
    assert(
      computedProfile.confidenceIndex.score >= 0,
      `${testProfile.name}: confidenceIndex is negative`
    );
    assert(
      computedProfile.selectedInstructionRules.length > 0,
      `${testProfile.name}: selectedInstructionRules is empty`
    );
    assert(
      computedProfile.selectedRedLines.length > 0,
      `${testProfile.name}: selectedRedLines is empty`
    );
    assert(
      coveredOrNotedSections.length === 7,
      `${testProfile.name}: not all INSPIRE sections have coverage or low-coverage notes`
    );
  } catch (error) {
    failures.push(error.message);
  }

  results.push({
    name: testProfile.name,
    expectedPrimaryRole: testProfile.expectedPrimaryRole,
    dominantSections,
    matchedDominantSections,
    computedProfile,
  });
}

const domainSetupCases = [
  {
    name: "domain only",
    input: {
      domain: "Coding / Software Development",
      domainSpecialization: undefined,
      projectContext: "I am building a website",
    },
    expected: {
      domainRole: "software development assistant",
      projectContext: "I am building a website",
      domainConfidence: "medium",
    },
  },
  {
    name: "domain plus specialization",
    input: {
      domain: "Coding / Software Development",
      domainSpecialization: "React / Next.js frontend",
      projectContext: "I am building a dashboard",
    },
    expected: {
      domainRole: "React/Next.js frontend expert",
      projectContext: "I am building a dashboard",
      domainConfidence: "high",
    },
  },
  {
    name: "other with custom domain",
    input: {
      domain: "Other",
      customDomain: "Real estate",
      domainSpecialization: "property investment analysis",
      projectContext: undefined,
    },
    expected: {
      domainRole: "real estate / property investment analysis assistant",
      domain: "Real estate",
      domainConfidence: "high",
    },
  },
];

const domainSetupResults = domainSetupCases.map((domainCase) => {
  const computedProfile = computeInspireV2Profile({
    answers: makeAnswers(testProfiles[0].choices),
    ...domainCase.input,
  });
  try {
    for (const [key, value] of Object.entries(domainCase.expected)) {
      assert(
        computedProfile[key] === value,
        `${domainCase.name}: expected ${key} ${value}, got ${computedProfile[key]}`
      );
    }
  } catch (error) {
    failures.push(error.message);
  }
  return {
    name: domainCase.name,
    input: domainCase.input,
    expected: domainCase.expected,
    computedProfile: {
      domain: computedProfile.domain,
      customDomain: computedProfile.customDomain,
      domainSpecialization: computedProfile.domainSpecialization,
      projectContext: computedProfile.projectContext,
      domainRole: computedProfile.domainRole,
      domainSource: computedProfile.domainSource,
      domainConfidence: computedProfile.domainConfidence,
      primaryOperatingArchetype: computedProfile.primaryOperatingArchetype,
    },
  };
});

const otherValidationCase = {
  domain: "Other",
  customDomainRequired: true,
  expectedFrontendBehavior: "Block progression before questions when customDomain is empty.",
};

const proofOutput = {
  generatedAt: new Date().toISOString(),
  acceptanceGate:
    "Computed profiles must be meaningfully different before any AI report is generated.",
  assertions: {
    passed: failures.length === 0,
    failures,
  },
  profiles: results,
  domainSetupCases: domainSetupResults,
  otherValidationCase,
  optionStrengthWeightAudit: {
    note:
      "Suggested changes are audit-only. The matrix has not been changed by this script.",
    suggestedChanges: auditOptionStrengthWeights(),
  },
};

console.log(JSON.stringify(proofOutput, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
