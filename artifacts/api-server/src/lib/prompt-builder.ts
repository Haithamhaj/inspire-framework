import { BEHAVIORAL_QUESTIONS } from "../data/questions";
import { SCENARIOS } from "../data/scenarios";

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

  // Pre-calculated scores to anchor the AI
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
      return `${label}: ${s.score}/6 (${s.percentage}%)`;
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

This instruction must:
- Open with: "أنت مساعد ذكاء اصطناعي شخصي لـ [Name]" (or English equivalent)
- Embed all 7 INSPIRE axis scores as behavioral parameters
- Encode all 8 AI interaction protocol preferences as explicit behavioral rules
- Be written in the second person addressing the AI
- Cover: communication style, depth vs speed preference, challenge vs affirm mode, context expectations, output format, and red lines
- End your content with "=== Operational Protocols ===" as the final section header before closing
- Sound natural and authoritative, not mechanical

NOTE: After your content, a fixed "UNIVERSAL AI PERFORMANCE RULES" section (6 rules) will be appended automatically — do NOT write it yourself.

This is the MOST IMPORTANT section. Make it exceptional.
===SYS_END===

===QS_START===
Write EXACTLY 3 ready-to-use prompt starters this person can immediately use with AI, tailored to their profile and project goal. Return EXACTLY 3 items, no more, no fewer.
1. "[prompt starter 1]"
2. "[prompt starter 2]"
3. "[prompt starter 3]"
===QS_END===`;
}
