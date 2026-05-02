import { BEHAVIORAL_QUESTIONS } from "../data/questions";
import { SCENARIOS } from "../data/scenarios";
import { getOptionRoute, type InstructionSection } from "../data/option-routing";

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
  reportLanguage: "ar" | "en" | "both";
  answers: Array<{ questionId: string; optionId: string }>;
  openAnswer?: string;
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
    redLineEffect: string | null;
    thinkingModeEffect: string;
  };

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
      redLineEffect: route.redLineEffect,
      thinkingModeEffect: route.thinkingModeEffect,
    });
  }

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
  for (const entry of signalEntries) {
    const sig = entry.behavioralSignal;
    const strengthWeight = entry.strength === "primary" ? 2 : 1;
    if (!signalFrequency.has(sig)) signalFrequency.set(sig, { count: 0, strength: 0 });
    const curr = signalFrequency.get(sig)!;
    curr.count += 1;
    curr.strength += strengthWeight;
  }

  const dominantPatterns = [...signalFrequency.entries()]
    .sort((a, b) => b[1].strength - a[1].strength)
    .slice(0, 5)
    .map(([sig]) => sig.replace(/_/g, " "));

  // Collect red line effects from primary signals.
  const redLineEffects = signalEntries
    .filter((e) => e.strength === "primary" && e.redLineEffect)
    .slice(0, 5)
    .map((e) => `• ${e.redLineEffect!.replace(/_/g, " ")}`);

  // Collect thinking mode effects from primary signals.
  const thinkingModes = signalEntries
    .filter((e) => e.strength === "primary" && e.thinkingModeEffect)
    .map((e) => e.thinkingModeEffect.replace(/_/g, " "))
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 4);

  // Step 5: Build section context lines (compact, never pasting raw ruleText)
  const sectionContextLines: string[] = [];
  for (const [section, entries] of sectionBuckets.entries()) {
    const descriptor = mergeBucket(entries);
    if (descriptor) {
      sectionContextLines.push(`• ${section}: ${descriptor}`);
    }
  }

  return `You are an expert behavioral analyst specializing in the INSPIRE Framework — a personalized AI interaction profiling system.

## Subject Profile
- Name: ${data.name}
- Job Title: ${data.jobTitle ?? "Not specified"}
- Project: ${data.projectName}
- Project Goal: ${data.projectGoal}
- Report Language: ${lang}

## Behavioral Analysis Summary (from 21-question v2 assessment)

### Dominant Behavioral Patterns (ranked by signal strength)
${dominantPatterns.map((p, i) => `${i + 1}. ${p}`).join("\n")}

### Behavioral Signals by Instruction Domain
${sectionContextLines.join("\n")}

### Thinking Mode Profile
${thinkingModes.map((m) => `• ${m}`).join("\n")}

### Key Red Lines (things this person will not tolerate)
${redLineEffects.join("\n")}

${data.openAnswer ? `## Personal Reflection (in their own words)\n${data.openAnswer}` : ""}

---

## Your Task

Based on this behavioral profile, generate a comprehensive, highly personalized AI interaction report. Write everything in ${lang}.

Output EXACTLY these 8 sections using the markers shown. Do not add or omit any section.

===FULL_INSTRUCTION_START===
Write a complete, standalone AI system instruction (600-900 words) this person can paste directly into any AI tool as their permanent system prompt.

Structure it as follows:
1. Opening identity line establishing the AI's role relative to this user and their project
2. Core behavioral directives (6-8 rules) derived from the dominant patterns above — each as a direct instruction to the AI
3. Communication style rules: response format, depth, and directness preferences based on the behavioral profile
4. Thinking mode alignment: how the AI should approach reasoning given the identified thinking modes
5. Interaction protocol: role division between user and AI based on the behavioral signals
6. Red lines section: explicit "never do" rules based on the red line effects
7. Closing adaptive loop rule

Write in second person addressing the AI. Sound authoritative and natural, not mechanical.
Do NOT include Universal Rules or Performance Rules — those are prepended separately.
===FULL_INSTRUCTION_END===

===STARTERS_START===
Write EXACTLY 3 ready-to-use prompt starters tailored to this person's behavioral profile and project goal. Each should be immediately usable in an AI tool.
1. "[starter 1]"
2. "[starter 2]"
3. "[starter 3]"
===STARTERS_END===

===RED_LINES_START===
List 4-5 specific behaviors this person absolutely cannot tolerate in AI interactions, derived from their red line signals and behavioral profile. Each on its own line starting with •
• [red line]
===RED_LINES_END===

===STRENGTHS_START===
List 4-5 behavioral and cognitive strengths revealed by this profile. Each on its own line starting with •
• [strength]
===STRENGTHS_END===

===RISKS_START===
List 3-4 growth areas or blind spots this profile reveals. Each on its own line starting with •
• [risk or blind spot]
===RISKS_END===

===ROLE_ANALYSIS_START===
Write 4-6 sentences covering:
1. This person's behavioral archetype and dominant cognitive style
2. How they naturally operate in professional settings
3. Their ideal AI interaction style (from the ai_interaction_style, recommended_identity, and domain_operating_mode signals)
4. What makes their AI partnership uniquely effective or challenging
===ROLE_ANALYSIS_END===

===RECOMMENDATIONS_START===
List 4-5 specific, actionable recommendations for how this person should use AI tools to maximize value. Numbered list.
1. [recommendation]
2. [recommendation]
3. [recommendation]
4. [recommendation]
===RECOMMENDATIONS_END===

===SIGNAL_MAP_START===
If you can represent the behavioral signal clusters in a structured table format (signal name | section | strength), do so. Otherwise write "null".
===SIGNAL_MAP_END===`;
}
