import { BEHAVIORAL_QUESTIONS } from "../data/questions";
import { SCENARIOS } from "../data/scenarios";
import { getOptionRoute, type InstructionSection, type RoleHint } from "../data/option-routing";
import {
  computeInspireV2Profile,
  ROLE_HINTS,
  ROLE_LABELS,
} from "./inspire-v2-decision-engine";

// ─── Universal Rules ───────────────────────────────────────
// These 6 rules are appended to EVERY generated system instruction
// programmatically (in report-parser.ts) — never rely on the AI to include them.

export const UNIVERSAL_RULES = `
━━━ UNIVERSAL AI PERFORMANCE RULES ━━━
(These apply to ALL users — never remove or modify based on profile)

1. HONESTY PROTOCOL
   - If certain → answer directly without hedging
   - If uncertain → explicitly state "غير متأكد" and explain why
   - Never present guesses, inferences, or outdated information as facts
   - Never fabricate sources, data, or references

2. CLARIFICATION LIMIT
   - If the request is unclear → ask ONE clarifying question only
   - After 2 failed clarification attempts → pick the most logical interpretation, state it explicitly, and proceed
   - Never loop more than twice on the same ambiguity

3. RESPONSE STRUCTURE
   - Always lead with the answer or solution first
   - Put explanations, reasoning, and details after
   - Never open with long preambles, summaries of the question, or "great question" style openers

4. DISTINGUISH CLEARLY
   Every response must separate:
   - Verified fact → presented as fact
   - Inference from data → labeled as inference
   - Recommendation or opinion → labeled as recommendation
   Never mix these three without clear labeling

5. CONTEXT SHIFT DETECTION
   - If the user suddenly changes topic mid-conversation, flag it explicitly:
     "هل ننتقل لموضوع جديد أم نكمل الموضوع الحالي؟"
   - Never silently switch context without acknowledging the shift
   - If a new project or goal appears, suggest opening a new session to maintain focus

6. CONFIDENCE INDICATOR
   For responses containing inferences, recommendations, or potentially outdated information, end with one of:

   [موثوق — مبني على بيانات موثقة]
   [استنتاج — تحليل قابل للنقاش]
   [غير مؤكد — يحتاج تحقق]

   Use the level that honestly reflects the response.
   Skip entirely for: direct execution tasks, creative content, and clearly verified facts.
   Do NOT use percentages — they imply false precision.
`.trim();

export interface PromptData {
  name: string;
  jobTitle?: string;
  projectName: string;
  projectGoal: string;
  reportLanguage: "ar" | "en" | "both";
  behavioralAnswers: Array<{ question_index: number; answer_index: number }>;
  scenarioAnswers: Array<{ scenario_index: number; choice: "a" | "b" }>;
  openAnswer: string;
  assessmentType?: "full" | "mini";
}

export interface PromptDataV2 {
  name: string;
  jobTitle?: string;
  projectName: string;
  projectGoal: string;
  domain: string;
  customDomain?: string;
  domainSpecialization?: string;
  projectContext?: string;
  reportLanguage: "ar" | "en" | "both";
  answers: Array<{ questionId: string; optionId: string }>;
  openAnswer?: string;
}

export interface InspireInstructionWriterInput {
  subjectProfile: {
    clientName: string;
    jobTitle?: string;
    projectName: string;
    projectGoal: string;
    projectContext?: string;
    domain: string;
    customDomain?: string | null;
    domainSpecialization?: string | null;
    domainRole: string;
    instructionLanguage: PromptDataV2["reportLanguage"];
  };
  computedProfile: {
    primaryRole: string;
    secondaryRole: string | null;
    secondaryRoleTrigger: string | null;
    primaryOperatingArchetype: string;
    secondaryOperatingMode: string | null;
    selectedInstructionRules: string[];
    selectedOutputRules: string[];
    selectedRedLines: string[];
    selectedRiskGuards: string[];
    contradictionRulesGenerated: string[];
    inspireSectionFocus: Array<{
      section: string;
      guidance: string;
    }>;
    openAnswerOverlay: {
      exists: boolean;
      affectsNumericScoring: false;
      affects: string[];
      note: string;
    };
  };
  thinkingModeProfile: {
    selectedModes: Array<{
      displayName: string;
      trigger: string;
      whenToUse: string;
      howToApply: string;
    }>;
  };
}

// ─── Score Calculator ──────────────────────────────────────
// Maps each axis to the question indices that measure it and
// computes a score out of 6 using semantic weighting per option.
// Option 0 = lowest alignment to axis, 3 = highest alignment.
// Score = (sum_of_indices / (n_questions * 3)) * 6  →  rounded to 1dp

export function calcAxisScores(
  answers: Array<{ question_index: number; answer_index: number }>
): Record<string, { score: number; max: number; percentage: number }> {
  const axisBuckets: Record<string, number[]> = {};

  for (const a of answers) {
    const q = BEHAVIORAL_QUESTIONS[a.question_index];
    if (!q) continue;
    if (!axisBuckets[q.axis]) axisBuckets[q.axis] = [];
    axisBuckets[q.axis].push(a.answer_index); // 0–3
  }

  const result: Record<string, { score: number; max: number; percentage: number }> = {};

  for (const [axis, indices] of Object.entries(axisBuckets)) {
    const n = indices.length;
    const maxRaw = n * 3;
    const sumRaw = indices.reduce((s, v) => s + v, 0);
    // Normalise to 0–6
    const score = Math.round((sumRaw / maxRaw) * 6 * 10) / 10;
    const percentage = Math.round((sumRaw / maxRaw) * 100);
    result[axis] = { score, max: 6, percentage };
  }

  return result;
}

export function buildMiniPrompt(data: PromptData): string {
  const lang =
    data.reportLanguage === "en"
      ? "English"
      : data.reportLanguage === "both"
        ? "Arabic and English"
        : "Arabic";

  const scenarioSection = data.scenarioAnswers
    .map((a) => {
      const s = SCENARIOS[a.scenario_index];
      if (!s) return "";
      const chosen = a.choice === "a" ? s.option_a : s.option_b;
      return `[${s.dimension_en}] ${s.question}\nChosen: ${chosen} (${a.choice.toUpperCase()})`;
    })
    .filter(Boolean)
    .join("\n\n");

  return `You are an expert AI interaction coach specializing in the INSPIRE Framework.

## Subject
- Name: ${data.name}
- Project: ${data.projectName}
- Goal: ${data.projectGoal}
- Report Language: ${lang}

## AI Interaction Scenarios (5 dimensions)
${scenarioSection}

## Personal Reflection
${data.openAnswer}

---

## Your Task

Based ONLY on the 5 AI interaction dimensions and the personal reflection above, generate 3 highly personalized, ready-to-use AI prompt starters for this person's specific project.

Output ONLY this one section:

===QS_START===
Write EXACTLY 3 ready-to-use prompt starters tailored to their AI interaction style and project goal. Make each starter immediately usable — as if they typed it into ChatGPT right now.
1. "[starter 1]"
2. "[starter 2]"
3. "[starter 3]"
===QS_END===`;
}

export function buildPrompt(data: PromptData): string {
  if (data.assessmentType === "mini") return buildMiniPrompt(data);

  const lang =
    data.reportLanguage === "en"
      ? "English"
      : data.reportLanguage === "both"
        ? "Arabic and English"
        : "Arabic";

  const axisScores = calcAxisScores(data.behavioralAnswers);

  const behavioralSection = data.behavioralAnswers
    .map((a) => {
      const q = BEHAVIORAL_QUESTIONS[a.question_index];
      if (!q) return "";
      const answer = q.options[a.answer_index];
      return `[${q.axis}] ${q.textEn}\nAnswer: ${answer?.en ?? "N/A"}`;
    })
    .filter(Boolean)
    .join("\n\n");

  const scenarioSection = data.scenarioAnswers
    .map((a) => {
      const s = SCENARIOS[a.scenario_index];
      if (!s) return "";
      const chosen = a.choice === "a" ? s.option_a : s.option_b;
      return `[${s.dimension_en}] ${s.question}\nChosen: ${chosen} (${a.choice.toUpperCase()})`;
    })
    .filter(Boolean)
    .join("\n\n");

  const INSPIRE_AXES = [
    "I – Intention (Goal orientation & motivation drivers)",
    "N – Narrative (Information processing & communication style)",
    "S – Style (Work approach & cognitive patterns)",
    "P – Preferences (Environmental & structural preferences)",
    "I – Interaction (Collaboration & interpersonal dynamics)",
    "R – Reflection (Self-awareness & learning orientation)",
    "E – Evaluation (Decision-making & quality standards)",
  ];

  // Map score to strength qualifier for directive language
  const scoreToQualifier = (score: number): string => {
    if (score > 4.5) return "Always";
    if (score >= 3)  return "Usually";
    return "When needed,";
  };

  // Pre-calculated scores to anchor the AI, with strength qualifiers
  const scoreLines = [
    { key: "Intention",   label: "I-Intention" },
    { key: "Narrative",   label: "N-Narrative" },
    { key: "Style",       label: "S-Style" },
    { key: "Preferences", label: "P-Preferences" },
    { key: "Interaction", label: "I-Interaction" },
    { key: "Reflection",  label: "R-Reflection" },
    { key: "Evaluation",  label: "E-Evaluation" },
  ]
    .map(({ key, label }) => {
      const s = axisScores[key];
      if (!s) return `${label}: score unknown`;
      const qualifier = scoreToQualifier(s.score);
      return `${label}: ${s.score}/6 (${s.percentage}%) → directive strength: "${qualifier}"`;
    })
    .join("\n");

  return `You are an expert behavioral analyst specializing in the INSPIRE Framework — a 7-axis professional profiling system for AI interaction optimization.

## INSPIRE Framework Axes
${INSPIRE_AXES.map((a, i) => `${i + 1}. ${a}`).join("\n")}

## Subject Profile
- Name: ${data.name}
- Job Title: ${data.jobTitle ?? "Not specified"}
- Project: ${data.projectName}
- Project Goal: ${data.projectGoal}
- Report Language: ${lang}

## Pre-Calculated INSPIRE Axis Scores (MANDATORY — use these EXACT values)
These scores are computed deterministically from the 24 behavioral answers.
You MUST use these exact scores in the TABLE section. Do NOT round or alter them.
The "directive strength" qualifier shown for each axis MUST be used verbatim as the opening word of that axis's directive in the SYS section.
${scoreLines}

## Behavioral Assessment Answers (24 questions across 7 INSPIRE axes)
${behavioralSection}

## AI Interaction Protocol Answers (8 binary dimensions)
${scenarioSection}

## Open-Ended Reflection
${data.openAnswer}

---

## Your Task

Analyze this professional's behavioral profile across all 7 INSPIRE axes and all 8 AI interaction dimensions. Then generate a comprehensive, personalized AI system instruction.

Output EXACTLY these 8 sections with the markers shown. Write the entire report in ${lang}.

IMPORTANT SCORING RULE: The TABLE section MUST use the pre-calculated scores above verbatim. Scores naturally vary per axis — do not make all axes the same value.

===TABLE_START===
Use EXACTLY the pre-calculated scores. Format: one axis per line, pipe-delimited.
Axis | Score | Max | Percentage | Confidence(1-5) | Brief Note in ${lang}
I-Intention | ${axisScores["Intention"]?.score ?? "?"} | 6 | ${axisScores["Intention"]?.percentage ?? "?"}% | 5 | [brief behavioral note]
N-Narrative | ${axisScores["Narrative"]?.score ?? "?"} | 6 | ${axisScores["Narrative"]?.percentage ?? "?"}% | 5 | [brief behavioral note]
S-Style | ${axisScores["Style"]?.score ?? "?"} | 6 | ${axisScores["Style"]?.percentage ?? "?"}% | 5 | [brief behavioral note]
P-Preferences | ${axisScores["Preferences"]?.score ?? "?"} | 6 | ${axisScores["Preferences"]?.percentage ?? "?"}% | 5 | [brief behavioral note]
I-Interaction | ${axisScores["Interaction"]?.score ?? "?"} | 6 | ${axisScores["Interaction"]?.percentage ?? "?"}% | 5 | [brief behavioral note]
R-Reflection | ${axisScores["Reflection"]?.score ?? "?"} | 6 | ${axisScores["Reflection"]?.percentage ?? "?"}% | 5 | [brief behavioral note]
E-Evaluation | ${axisScores["Evaluation"]?.score ?? "?"} | 6 | ${axisScores["Evaluation"]?.percentage ?? "?"}% | 5 | [brief behavioral note]
===TABLE_END===

===ROLE_START===
Write 3-4 sentences describing this professional's behavioral archetype, their likely role in teams, how they naturally operate at work, and what kind of AI partnership suits them best.
===ROLE_END===

===REDLINES_START===
List EXACTLY 4 things this person absolutely cannot tolerate in AI interactions (based on their profile). Return EXACTLY 4 items, no more, no fewer. Each on its own line starting with •
• [red line 1]
• [red line 2]
• [red line 3]
• [red line 4]
===REDLINES_END===

===STRENGTHS_START===
List EXACTLY 4 behavioral and cognitive strengths revealed by this profile. Return EXACTLY 4 items, no more, no fewer. Each on its own line starting with •
• [strength 1]
• [strength 2]
• [strength 3]
• [strength 4]
===STRENGTHS_END===

===DEVELOPMENT_START===
List EXACTLY 3 growth areas or blind spots this profile reveals. Return EXACTLY 3 items, no more, no fewer. Each on its own line starting with •
• [area 1]
• [area 2]
• [area 3]
===DEVELOPMENT_END===

===RECOMMENDATIONS_START===
List EXACTLY 4 specific, actionable recommendations for how this person should use AI tools. Return EXACTLY 4 items, no more, no fewer. Numbered list.
1. [recommendation]
2. [recommendation]
3. [recommendation]
4. [recommendation]
===RECOMMENDATIONS_END===

===SYS_START===
Write a complete, standalone AI system instruction (500-800 words) that this person can paste into any AI tool (ChatGPT, Claude, etc.) as their permanent system prompt.

This instruction MUST follow this exact structure and order:
1. Identity line: "أنت مساعد ذكاء اصطناعي شخصي لـ [Name]" (or English equivalent) + project context
2. INSPIRE Axes Directives: For EACH of the 7 axes, write ONE executable directive using the strength qualifier from the pre-calculated scores:
   - directive strength "Always" → write: "Always [behavioral action]" (dominant pattern)
   - directive strength "Usually" → write: "Usually [behavioral action]" (moderate pattern)
   - directive strength "When needed," → write: "When needed, [behavioral action]" (weak pattern)
   The action text must come from your behavioral analysis of this person — the qualifier is fixed by the score.
3. AI Interaction Protocol: Encode all 8 binary scenario preferences as explicit behavioral rules
4. Operational Protocols: This MUST be the final section header. Under it, include output format rules with this EXACT condition:
   "قدّم المخرجات بهذا الترتيب للمهام المعقدة والقرارات المهمة فقط. للأسئلة المباشرة والطلبات البسيطة، أجب مباشرة بدون هذا الهيكل."
   (or English equivalent if report language is English)

Additional requirements:
- Be written in the second person addressing the AI
- Cover: communication style, depth vs speed preference, challenge vs affirm mode, context expectations, and red lines
- Sound natural and authoritative, not mechanical
- Do NOT include any "Universal Rules" or "Performance Rules" — those are prepended separately before your content.

This is the MOST IMPORTANT section. Make it exceptional.
===SYS_END===

===QS_START===
Write EXACTLY 3 ready-to-use prompt starters this person can immediately use with AI, tailored to their profile and project goal. Return EXACTLY 3 items, no more, no fewer.
1. "[prompt starter 1]"
2. "[prompt starter 2]"
3. "[prompt starter 3]"
===QS_END===`;
}

// ─── V2 Prompt Builder ────────────────────────────────────────────────────────
// Anti-bloat pipeline:
//   selected option routes
//     → collect behavioralSignal strings for all 21 answers
//     → cluster signals by instructionSection (group signals per section bucket)
//     → within each bucket: merge overlapping/redundant signals into one dominant descriptor
//     → identify 3–5 dominant patterns across all buckets
//     → build prompt: pass section names + dominant pattern descriptors as compact context
//     → instruct AI: produce the 8 named output sections

export function buildInspireInstructionWriterInput(
  data: PromptDataV2
): InspireInstructionWriterInput {
  const computedProfile = computeInspireV2Profile({
    answers: data.answers,
    domain: data.domain,
    customDomain: data.customDomain,
    domainSpecialization: data.domainSpecialization,
    projectContext: data.projectContext,
    openAnswer: data.openAnswer,
  });

  const secondaryRoleTrigger = computedProfile.secondaryRole
    ? `Activate ${computedProfile.secondaryRole} only when the task clearly needs that mode; do not expose score thresholds or selection logic.`
    : null;

  const inspireSectionFocus = Object.entries(computedProfile.inspireSectionPercentages)
    .sort((a, b) => b[1] - a[1])
    .map(([section]) => ({
      section,
      guidance:
        section === "IdentityRole"
          ? "Use this section to define the assistant's role and relationship to the client."
          : section === "NormsBoundaries"
            ? "Use this section to define direct boundaries, red lines, and risk controls."
            : section === "StyleTone"
              ? "Use this section to define tone, length, directness, and language behavior."
              : section === "PrecisionSelfCheck"
                ? "Use this section to define accuracy, uncertainty, and verification behavior."
                : section === "InternalEvaluation"
                  ? "Use this section to define final quality checks before responding."
                  : section === "ResponseStructure"
                    ? "Use this section to define answer-first structure, bullets, steps, and copy-ready output."
                    : "Use this section to define adaptation, feedback handling, clarification, and scope control.",
    }));

  return {
    subjectProfile: {
      clientName: data.name,
      jobTitle: data.jobTitle,
      projectName: data.projectName,
      projectGoal: data.projectGoal,
      projectContext: computedProfile.projectContext ?? data.projectContext,
      domain: computedProfile.domain,
      customDomain: computedProfile.customDomain,
      domainSpecialization: computedProfile.domainSpecialization,
      domainRole: computedProfile.domainRole,
      instructionLanguage: data.reportLanguage,
    },
    computedProfile: {
      primaryRole: computedProfile.primaryRole,
      secondaryRole: computedProfile.secondaryRole,
      secondaryRoleTrigger,
      primaryOperatingArchetype: computedProfile.primaryOperatingArchetype,
      secondaryOperatingMode: computedProfile.secondaryOperatingMode,
      selectedInstructionRules: computedProfile.selectedInstructionRules,
      selectedOutputRules: computedProfile.selectedOutputRules,
      selectedRedLines: computedProfile.selectedRedLines,
      selectedRiskGuards: computedProfile.selectedRiskGuards,
      contradictionRulesGenerated: computedProfile.contradictionRulesGenerated,
      inspireSectionFocus,
      openAnswerOverlay: computedProfile.openAnswerOverlay,
    },
    thinkingModeProfile: {
      selectedModes: computedProfile.thinkingModeProfile.selectedModes.map((mode) => ({
        displayName: mode.displayName,
        trigger: mode.trigger,
        whenToUse: mode.whenToUse,
        howToApply: mode.howToApply,
      })),
    },
  };
}

export function buildInspireInstructionPromptV2(data: PromptDataV2): string {
  const lang =
    data.reportLanguage === "en"
      ? "English"
      : data.reportLanguage === "both"
        ? "Arabic and English"
        : "Arabic";
  const writerInput = buildInspireInstructionWriterInput(data);

  return `You are an expert AI Instruction Architect for INSPIRE v2.

INSPIRE is an AI operating-profile system. It turns a client's answers into practical operating instructions for an AI assistant.
INSPIRE is not a personality report and not a generic prompt generator.
The INSPIRE Decision Engine has already processed the client's answers. You are not analyzing the client from scratch.

Your job is to write high-quality Custom Instructions for a future AI assistant such as ChatGPT, Gemini, Claude, or another similar AI system.
The final instructions should make that future assistant behave according to the client's goal, project context, domain, working style, boundaries, output needs, and reasoning preferences.
Write instructions that guide the assistant's behavior. Instruct the assistant directly; do not describe the client.

The model receives a writer-safe packet. Transform that packet into operational instructions:
- Turn the primary role into the assistant's main operating identity.
- Turn the secondary role into a conditional behavior activated by its trigger.
- Turn the domain role into domain-specific assistant behavior.
- Turn selected instruction rules into daily assistant behavior.
- Turn selected output rules into response structure and delivery behavior.
- Turn selected red lines into clear boundaries and forbidden mistakes.
- Turn selected risk guards into safeguards against poor assistant behavior.
- Turn contradiction rules into balancing rules when preferences conflict.
- Turn section focus into emphasis inside the relevant INSPIRE sections.
- Turn selected thinking modes into a short practical manual only if they add value.

Good INSPIRE instructions are direct, practical, behavioral, concise, copy-ready, addressed to the future AI assistant, and specific enough to change how that assistant behaves.
Prefer operating rules such as "Start with a practical first step when the task is clear" or "Ask one focused question only when missing information blocks progress."
Avoid report language such as "the client tends to", "the profile shows", "the assessment indicates", or "based on the score".

Universal behavioral principles to merge into the relevant sections:
- Do not fabricate facts, data, sources, or references.
- Separate verified facts, assumptions, inferences, and recommendations when relevant.
- State uncertainty clearly when information is incomplete or unstable.
- Ask one focused question only when missing information blocks a useful answer.
- Do not stop progress because of minor ambiguity.
- Lead with the useful answer or output first.
- Avoid long preambles.
- Keep outputs easy to copy and apply.
- Keep responses aligned with the client's current goal.
- Before finalizing important outputs, check coherence, gaps, contradictions, usability, and alignment with the goal.

Write all JSON string values in ${lang}.

## Instruction Writer Input Packet
This JSON is fixed input. Use it only to phrase operational assistant instructions.

\`\`\`json
${JSON.stringify(writerInput, null, 2)}
\`\`\`

## Output Contract

Return structured JSON only. Do not return Markdown.
The application will render the final Markdown from your JSON.

Return exactly this JSON shape:

{
  "title": "string",
  "identityAndRole": {
    "bullets": ["string"]
  },
  "normsAndBoundaries": {
    "bullets": ["string"]
  },
  "styleAndTone": {
    "bullets": ["string"]
  },
  "precisionAndSelfCheck": {
    "bullets": ["string"]
  },
  "internalEvaluation": {
    "bullets": ["string"]
  },
  "responseStructure": {
    "bullets": ["string"]
  },
  "enhancementAndAdaptation": {
    "bullets": ["string"]
  },
  "thinkingModesManual": {
    "include": true,
    "modes": [
      {
        "name": "string",
        "whenToUse": "string",
        "howToApply": "string"
      }
    ]
  }
}

If no selected thinking mode adds practical value, return:
"thinkingModesManual": {
  "include": false,
  "modes": []
}

Seven required INSPIRE core sections:

1. Identity & Role
Define the assistant's role, client context, project, domain role, primary role, secondary role, and when the secondary role activates.

2. Norms & Boundaries
Define red lines, risk controls, forbidden mistakes, clarification behavior, and boundaries.

3. Style & Tone
Define communication style, directness, concision, practical tone, level of detail, and when to expand.

4. Precision & Self-Check
Define how the assistant handles facts, uncertainty, assumptions, verification, unsupported claims, and fact/inference/recommendation separation.

5. Internal Evaluation
Define the assistant's quality check before responding: coherence, gaps, contradictions, usability, and alignment with the client's goal.

6. Response Structure
Define answer-first behavior, concise sections, bullets, steps, tables only when useful, and copy-ready outputs.

7. Enhancement & Adaptation
Define how the assistant adapts to feedback, preserves stable rules, changes approach after repeated failed fixes, suggests alternatives, controls scope, and asks one focused question only when necessary.

Thinking modes handling:
1. First write the seven INSPIRE core instruction sections.
2. Then review thinkingModeProfile.selectedModes.
3. Include only modes that add practical value beyond the core sections.
4. Skip modes whose behavior is already clearly covered in another section.
5. Prefer fewer, stronger modes over a long list.
6. Keep the Thinking Modes Manual short, practical, and behavior-focused.
7. Avoid turning thinking modes into theory.
8. For each included mode, output only name, whenToUse, and howToApply.

Restrictions:
- Use the input packet as writing guidance only. Never expose internal INSPIRE data or explain how the profile was computed.
- Do not expose scores, matrix logic, raw answers, internal field names, evidence labels, selection logic, or computed profile terminology.
- Do not invent unselected thinking modes.
- Do not include report sections, recommendations about using INSPIRE, or analysis of why the profile was selected.
- Return valid JSON only, with no Markdown fences and no extra commentary.`;
}

export function buildPromptV2(data: PromptDataV2): string {
  const lang =
    data.reportLanguage === "en"
      ? "English"
      : data.reportLanguage === "both"
        ? "Arabic and English"
        : "Arabic";

  // Step 1: Collect behavioral signals and instruction sections for each answer
  type SignalEntry = {
    questionId: string;
    optionId: string;
    behavioralSignal: string;
    instructionSections: InstructionSection[];
    strength: "primary" | "secondary";
    questionWeight: number;
    optionStrengthWeight: 1.0 | 0.6 | 0.3;
    redLineEffect: string | null;
    thinkingModeEffect: string;
  };

  const computedProfile = computeInspireV2Profile({
    answers: data.answers,
    domain: data.domain,
    customDomain: data.customDomain,
    domainSpecialization: data.domainSpecialization,
    projectContext: data.projectContext,
    openAnswer: data.openAnswer,
  });

  const signalEntries: SignalEntry[] = [];
  for (const answer of data.answers) {
    const route = getOptionRoute(answer.questionId, answer.optionId);
    if (!route) continue;
    signalEntries.push({
      questionId: answer.questionId,
      optionId: answer.optionId,
      behavioralSignal: route.behavioralSignal,
      instructionSections: route.instructionSections,
      strength: route.strength,
      questionWeight: route.questionWeight,
      optionStrengthWeight: route.optionStrengthWeight,
      redLineEffect: route.redLineEffect,
      thinkingModeEffect: route.thinkingModeEffect,
    });
  }

  const weightedEntries = signalEntries.map((entry) => ({
    ...entry,
    weightedScore: Math.round(entry.questionWeight * entry.optionStrengthWeight * 100) / 100,
  }));

  const allocationRows = Object.entries(computedProfile.inspireSectionScores).map(
    ([section, score]) => ({
      section,
      score,
      percentage:
        computedProfile.inspireSectionPercentages[
          section as keyof typeof computedProfile.inspireSectionPercentages
        ],
    })
  ).sort((a, b) => b.score - a.score);

  const roleRows = ROLE_HINTS.map((role) => ({
    role,
    label: ROLE_LABELS[role],
    score: computedProfile.roleScores[role],
  })).sort((a, b) => b.score - a.score);

  const contradictionSummary = Object.entries(computedProfile.contradictionTags)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => `${tag}: ${count}`);

  const allocationSummaryLines = allocationRows.map(
    (row) => `• ${row.section}: score ${row.score}, share ${row.percentage}%`
  );

  const roleScoreLines = roleRows
    .filter((row) => row.score > 0)
    .map((row) => `• ${row.label}: ${row.score}`);

  const calculatedPrimaryRole = computedProfile.primaryOperatingArchetype;
  const calculatedSecondaryRole = computedProfile.secondaryOperatingMode ?? "None";
  const secondaryRoleInstructionTrigger = computedProfile.secondaryRole
    ? `Activate ${computedProfile.secondaryRole} only when the task clearly needs that mode; do not expose score thresholds or selection logic.`
    : "No secondary role was computed.";

  const roleByLabel = Object.fromEntries(
    ROLE_HINTS.map((role) => [ROLE_LABELS[role], role])
  ) as Record<string, RoleHint>;

  // Step 2: Cluster signals by instruction section bucket
  const sectionBuckets = new Map<InstructionSection, SignalEntry[]>();
  for (const entry of signalEntries) {
    for (const section of entry.instructionSections) {
      if (!sectionBuckets.has(section)) sectionBuckets.set(section, []);
      sectionBuckets.get(section)!.push(entry);
    }
  }

  // Step 3: Within each bucket, merge overlapping signals into dominant descriptors
  // Group by signal prefix (first word) to detect overlaps
  const mergeBucket = (entries: SignalEntry[]): string => {
    // Prioritize primary signals from the approved routing matrix.
    const sorted = [...entries].sort((a, b) => {
      const order = { primary: 0, secondary: 1 };
      return order[a.strength] - order[b.strength];
    });
    // Deduplicate by similar signal roots (first segment before _)
    const seen = new Set<string>();
    const merged: string[] = [];
    for (const e of sorted) {
      const root = e.behavioralSignal.split("_").slice(0, 2).join("_");
      if (!seen.has(root)) {
        seen.add(root);
        merged.push(e.behavioralSignal.replace(/_/g, " "));
      }
    }
    return merged.slice(0, 3).join(", ");
  };

  // Step 4: Identify 3–5 dominant patterns across all buckets
  // Count signal frequency and pick top signals by strength weight
  const signalFrequency = new Map<string, { count: number; strength: number }>();
  for (const entry of weightedEntries) {
    const sig = entry.behavioralSignal;
    if (!signalFrequency.has(sig)) signalFrequency.set(sig, { count: 0, strength: 0 });
    const curr = signalFrequency.get(sig)!;
    curr.count += 1;
    curr.strength += entry.weightedScore;
  }

  const dominantPatterns = [...signalFrequency.entries()]
    .sort((a, b) => b[1].strength - a[1].strength)
    .slice(0, 5)
    .map(([sig]) => sig.replace(/_/g, " "));

  const sectionDescriptor = (section: InstructionSection): string => {
    const entries = sectionBuckets.get(section);
    if (!entries || entries.length === 0) return "No dominant signal; infer lightly from project context.";
    return mergeBucket(entries);
  };

  const roleContextByRole: Record<RoleHint, string> = {
    ExecutorBuilder: sectionDescriptor("core_behavior_rules"),
    StrategicOrganizer: sectionDescriptor("mission_domain_context"),
    CriticalReviewer: sectionDescriptor("red_lines_failure_triggers"),
    ThinkingPartner: sectionDescriptor("dynamic_roles"),
    TeacherSimplifier: sectionDescriptor("thinking_quality_modes"),
    AudienceTranslator: sectionDescriptor("relationship_with_user"),
  };

  const calculatedRoleSignals = [
    computedProfile.primaryOperatingArchetype,
    computedProfile.secondaryOperatingMode,
  ]
    .filter((label): label is string => Boolean(label))
    .map((label) => {
      const role = roleByLabel[label];
      return role ? `${label}: ${roleContextByRole[role]}` : `${label}: Calculated by role score.`;
    });

  const thinkingModesForPrompt = computedProfile.thinkingModeProfile.selectedModes.map((mode) => ({
    modeId: mode.modeId,
    displayName: mode.displayName,
    category: mode.category,
    priorityLevel: mode.priorityLevel,
    trigger: mode.trigger,
    whenToUse: mode.whenToUse,
    howToApply: mode.howToApply,
    whenNotToUse: mode.whenNotToUse,
  }));

  const computedProfileForPrompt = {
    inspireSectionScores: computedProfile.inspireSectionScores,
    inspireSectionPercentages: computedProfile.inspireSectionPercentages,
    roleScores: computedProfile.roleScores,
    domain: computedProfile.domain,
    customDomain: computedProfile.customDomain,
    domainSpecialization: computedProfile.domainSpecialization,
    projectContext: computedProfile.projectContext,
    domainRole: computedProfile.domainRole,
    domainSource: computedProfile.domainSource,
    domainConfidence: computedProfile.domainConfidence,
    primaryOperatingArchetype: computedProfile.primaryOperatingArchetype,
    secondaryOperatingMode: computedProfile.secondaryOperatingMode,
    operatingModeTriggers: computedProfile.operatingModeTriggers,
    primaryRole: computedProfile.primaryRole,
    secondaryRole: computedProfile.secondaryRole,
    secondaryRoleTrigger: computedProfile.secondaryRoleTrigger,
    contradictionTags: computedProfile.contradictionTags,
    contradictionRulesGenerated: computedProfile.contradictionRulesGenerated,
    confidenceIndex: computedProfile.confidenceIndex,
    topEvidenceLabels: computedProfile.topEvidenceLabels,
    selectedInstructionRules: computedProfile.selectedInstructionRules,
    selectedOutputRules: computedProfile.selectedOutputRules,
    selectedRedLines: computedProfile.selectedRedLines,
    selectedRiskGuards: computedProfile.selectedRiskGuards,
    thinkingModeProfile: {
      selectedModes: thinkingModesForPrompt,
      summary: computedProfile.thinkingModeProfile.summary,
    },
    openAnswerOverlay: computedProfile.openAnswerOverlay,
  };

  return `You are an INSPIRE report writer, not a behavioral scorer.

You are not analyzing the user from scratch.
The profile has already been computed by the INSPIRE decision engine.
Your most important task is to write a copy-ready assistant instruction using the computed profile.
Keep the existing user-facing report marker blocks compatible, but do not redesign them in this task.
Do not change the computed roles, scores, contradictions, selected rules, or risk guards.
Do not re-score answers.
Do not re-analyze raw answers.
Do not choose a new domainRole, primaryOperatingArchetype, secondaryOperatingMode, primaryRole, or secondaryRole.
Do not choose thinking modes. The decision engine has already selected them in computedProfile.thinkingModeProfile.selectedModes.
Do not invent unsupported personality traits.
Do not add generic advice that is not backed by selectedInstructionRules, selectedOutputRules, selectedRedLines, selectedRiskGuards, contradictionRulesGenerated, domainRole, projectContext, thinkingModeProfile.selectedModes, topEvidenceLabels, or the open-answer overlay.

## Subject Profile
- Name: ${data.name}
- Job Title: ${data.jobTitle ?? "Not specified"}
- Project: ${data.projectName}
- Project Context: ${computedProfile.projectContext ?? data.projectGoal}
- Selected Domain: ${computedProfile.domain}
- Custom Domain: ${computedProfile.customDomain ?? "Not applicable"}
- Domain Specialization: ${computedProfile.domainSpecialization ?? "Not provided"}
- Domain Role: ${computedProfile.domainRole}
- Report Language: ${lang}

## Behavioral Analysis Summary (from 21-question v2 assessment)

### Authoritative Computed Profile
This JSON is the source of truth. Use it as fixed input. Evidence labels are supporting labels only; they are not raw answers and must not be used to reinterpret the profile.

\`\`\`json
${JSON.stringify(computedProfileForPrompt, null, 2)}
\`\`\`

INSPIRE Allocation Scores:
${allocationSummaryLines.join("\n")}

Role Scores:
${roleScoreLines.join("\n")}

Domain Role: ${computedProfile.domainRole}
Primary Operating Archetype: ${calculatedPrimaryRole}
Secondary Dynamic Mode: ${calculatedSecondaryRole}
Confidence Index: ${computedProfile.confidenceIndex.label} (${computedProfile.confidenceIndex.score})
Contradiction Tags: ${contradictionSummary.length ? contradictionSummary.join(", ") : "None"}

### Supporting Evidence Labels
${dominantPatterns.map((p, i) => `${i + 1}. ${p}`).join("\n")}

### Calculated Role Trigger Inputs
${calculatedRoleSignals.map((r) => `• ${r}`).join("\n")}

${data.openAnswer ? `## Open-Answer Overlay\nUse this only for tone, examples/domain, red lines, and adaptation wording. Do not use it to change numeric scores or roles.\n${data.openAnswer}` : ""}

---

## Your Task

Write everything in ${lang}.

Create two clearly separated outputs:
1. A user-facing analysis report.
2. A model-facing, copy-ready system instruction.

The report may explain what the computed profile means, but it must remain conservative and evidence-backed.
The system instruction must be operational text addressed to an AI assistant.

Output EXACTLY these 8 marker blocks using the markers shown. Do not add or omit any marker block.

===FULL_INSTRUCTION_START===
Write ONLY the complete, standalone INSPIRE assistant instruction this person can paste directly into ChatGPT, Gemini, Claude, or another AI assistant.

MANDATORY:
- This section is model-facing, not user-facing analysis.
- Address the client's AI assistant directly.
- Start directly with "# INSPIRE Assistant Instructions".
- Do not include report explanation inside this section.
- Do not explain why the profile, role, rules, or thinking modes were selected.
- Do not expose raw scores, priority scores, evidence labels, selectionSignals, matrix logic, JSON, or computedProfile terminology.
- Do not write phrases like "this user", "the client tends to", "selected because", "based on the score", "computedProfile", or "matrix".
- Use Domain Role exactly unless translation requires natural wording: ${computedProfile.domainRole}.
- Use the calculated Primary Operating Archetype exactly unless translation requires natural wording: ${calculatedPrimaryRole}.
- Include Secondary Dynamic Mode only if computedProfile.secondaryOperatingMode is not null: ${calculatedSecondaryRole}.
- Use selectedInstructionRules, selectedOutputRules, selectedRedLines, selectedRiskGuards, contradictionRulesGenerated, domainRole, projectContext, openAnswerOverlay, and thinkingModeProfile.selectedModes as the behavioral sources.
- Use ONLY computedProfile.thinkingModeProfile.selectedModes for section 8. Do not invent, add, remove, or rename thinking modes.
- Fixed general INSPIRE rules: this is not a personality report, not generic prompt advice, and not an explanation of the assessment; it is operational custom-instruction text for an AI assistant.

Use this exact nine-section INSPIRE format and order:

# INSPIRE Assistant Instructions

## 1. Assistant Identity & Role
   - Write direct instructions to the AI assistant.
   - If report language is Arabic, start naturally like: "أنت مساعد مخصص لـ ${data.name} في سياق ${data.projectName}..."
   - If report language is English, start naturally like: "You are a custom assistant for ${data.name} in the context of ${data.projectName}..."
   - Include client name: ${data.name}.
   - Include project name: ${data.projectName}.
   - Domain Role: Act as ${computedProfile.domainRole} within the selected domain ${computedProfile.domain}.
   - Project Context: ${computedProfile.projectContext ? `Use this as background and use-case context: ${computedProfile.projectContext}` : "No project context was provided; keep examples relevant to the selected domain only."}
   - Primary Role: Operate primarily as ${calculatedPrimaryRole}.
   - Secondary Role: Include ${calculatedSecondaryRole} only if it is not "None"; activate it only when this trigger applies: ${secondaryRoleInstructionTrigger}
   - Boundary: Domain/domainSpecialization define expertise. ProjectContext defines the use case and background. The operating archetype defines delivery behavior. Do not turn projectContext into a professional specialization unless explicitly stated. Do not infer specialization from behavioral answers alone.

## 2. Operating Mission
   - Tell the AI assistant what it is supposed to help ${data.name} do in ${data.projectName}.
   - Use projectContext, domainRole, selectedInstructionRules, and selectedOutputRules.
   - Write direct operating behavior, not analysis.

## 3. Norms & Boundaries
   - Convert selectedRedLines, selectedRiskGuards, contradictionRulesGenerated, and fixed general INSPIRE rules into direct rules.
   - Include rules in the form: do this, avoid this, stop or clarify when this happens.
   - Do not include reasons, scores, evidence, or selection logic.

## 4. Style & Tone
   - Use StyleTone signals from the computed profile, selectedInstructionRules, selectedOutputRules, and the open-answer overlay if available.
   - Define tone, length, directness, level of detail, and language behavior.
   - Keep it direct and usable; avoid decorative language.

## 5. Precision & Self-Check
   - Use PrecisionSelfCheck, selectedRiskGuards, contradictionRulesGenerated, and selected modes such as Fact Verification / Evidence Check or Self-Consistency / Quality Gate if they are present.
   - Tell the assistant how to check uncertainty, avoid generic output, separate fact / inference / recommendation when needed, and avoid inventing information.
   - Do not ask the assistant to reveal hidden chain-of-thought.

## 6. Response Structure
   - Use ResponseStructure, selectedOutputRules, and selected thinking modes related to structure, action, review, or execution.
   - Define answer-first behavior, sections, bullets, steps, tables only when useful, and copy-ready outputs.

## 7. Adaptation & Feedback
   - Use EnhancementAdaptation, secondaryRoleTrigger, and selected modes such as Clarification Gate, Scope Control / Anti-Sprawl, Recovery / Revert Reasoning, or Consistency Check if present.
   - Tell the assistant how to adapt to corrections, preserve stable rules, ask only one focused question when needed, and avoid scope sprawl.

## 8. Thinking Modes Manual
   - Use ONLY computedProfile.thinkingModeProfile.selectedModes.
   - For every selected mode, write one concise operational instruction containing:
     1. when to use it
     2. how to apply it
     3. when not to use it
   - Use each mode's displayName, whenToUse, howToApply, and whenNotToUse.
   - Do not include modeId, category, priorityLevel, priorityScore, trigger labels, why it was selected, evidence labels, selectionSignals, scores, JSON, or matrix logic.
   - Example style in Arabic: "استخدم Devil’s Advocate عند مراجعة قرار، خطة، أو منطق قبل اعتماده. طبّقه عبر كشف الافتراضات الضعيفة، الثغرات، والمخاطر المحتملة، ثم قدّم توصية عملية واضحة. لا تستخدمه عند طلب تنفيذ بسيط ومباشر لا يحتاج مراجعة نقدية."
   - Example style in English: "Use Devil’s Advocate when reviewing a decision, plan, or logic before approval. Apply it by exposing weak assumptions, gaps, and risks, then give a clear practical recommendation. Do not use it for simple direct execution requests that do not need critique."

## 9. Starter Usage Commands
   - Write 3 to 5 short starter commands ${data.name} can send after pasting this instruction.
   - These must be commands to the AI assistant, not report analysis.
   - Tailor them to the selected thinking modes, projectContext, selectedInstructionRules, and selectedOutputRules.

Do NOT write any Universal Quality Rules, Universal Rules, Performance Rules, honesty protocol, source protocol, or confidence protocol in this section. Those rules are appended by the system after parsing and must remain fixed across all analyses.

Write in second person addressing the AI. Sound authoritative and natural, not mechanical.
Do not paste raw matrix internals. Use only the computed profile fields.

Before finalizing this section, silently check that it:
- uses exactly the nine INSPIRE sections above
- is copy-ready and model-facing
- does not contain user-facing explanation
- is not generic
- does not override computed roles
- does not infer domain specialization from behavioral answers
- includes every selected thinking mode as a when/how/when-not-to-use manual
- exposes no selection reasons, scores, evidence labels, selectionSignals, JSON, or matrix logic
- does not start with Universal Quality Rules
- does not include any universal rules generated by AI
- is concise and not bloated
===FULL_INSTRUCTION_END===

===STARTERS_START===
Write EXACTLY 3 ready-to-use prompt starters tailored to this person's behavioral profile and project goal. Each should be immediately usable in an AI tool.
1. "[starter 1]"
2. "[starter 2]"
3. "[starter 3]"
===STARTERS_END===

===RED_LINES_START===
List 4-5 specific behaviors this person absolutely cannot tolerate in AI interactions. Use selectedRedLines and selectedRiskGuards only. Each on its own line starting with •
• [red line]
===RED_LINES_END===

===STRENGTHS_START===
List 4-5 strengths conservatively supported by roleScores, topEvidenceLabels, and selectedInstructionRules. Each on its own line starting with •
• [strength]
===STRENGTHS_END===

===RISKS_START===
List 3-4 growth areas or blind spots conservatively supported by contradictionRulesGenerated, selectedRiskGuards, and selectedRedLines. Each on its own line starting with •
• [risk or blind spot]
===RISKS_END===

===ROLE_ANALYSIS_START===
Write 4-6 sentences covering:
1. The calculated domainRole, primaryOperatingArchetype, and optional secondaryOperatingMode
2. The top two or three INSPIRE section scores
3. What the selected rules imply for AI interaction
4. What contradictions need to be handled

Do not name an unsupported archetype. Do not infer traits beyond the computedProfile.
===ROLE_ANALYSIS_END===

===RECOMMENDATIONS_START===
List 4-5 specific, actionable recommendations for how this person should use AI tools to maximize value. Each recommendation must be backed by selectedInstructionRules, selectedOutputRules, contradictionRulesGenerated, or selectedRiskGuards. Numbered list.
1. [recommendation]
2. [recommendation]
3. [recommendation]
4. [recommendation]
===RECOMMENDATIONS_END===

===SIGNAL_MAP_START===
Represent the computed evidence in a compact table format: evidence label | related INSPIRE section | support source. Use topEvidenceLabels and the top INSPIRE sections only. If evidence is insufficient, write "null".
===SIGNAL_MAP_END===`;
}
