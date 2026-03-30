import { BEHAVIORAL_QUESTIONS } from "../data/questions";
import { SCENARIOS } from "../data/scenarios";

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

Based ONLY on the 5 AI interaction dimensions and the personal reflection above, generate 5 highly personalized, ready-to-use AI prompt starters for this person's specific project.

Output ONLY this one section:

===QS_START===
Write 5 ready-to-use prompt starters tailored to their AI interaction style and project goal. Make each starter immediately usable — as if they typed it into ChatGPT right now.
1. "[starter 1]"
2. "[starter 2]"
3. "[starter 3]"
4. "[starter 4]"
5. "[starter 5]"
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

  return `You are an expert behavioral analyst specializing in the INSPIRE Framework — a 7-axis professional profiling system for AI interaction optimization.

## INSPIRE Framework Axes
${INSPIRE_AXES.map((a, i) => `${i + 1}. ${a}`).join("\n")}

## Subject Profile
- Name: ${data.name}
- Job Title: ${data.jobTitle ?? "Not specified"}
- Project: ${data.projectName}
- Project Goal: ${data.projectGoal}
- Report Language: ${lang}

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

===TABLE_START===
Score each INSPIRE axis using this format (one axis per line, pipe-delimited):
Axis | Score | Max | Percentage | Confidence(1-5) | Brief Note
I-Intention | X | 4 | XX% | X | [note]
N-Narrative | X | 4 | XX% | X | [note]
S-Style | X | 4 | XX% | X | [note]
P-Preferences | X | 4 | XX% | X | [note]
I-Interaction | X | 4 | XX% | X | [note]
R-Reflection | X | 4 | XX% | X | [note]
E-Evaluation | X | 4 | XX% | X | [note]
===TABLE_END===

===ROLE_START===
Write 3-4 sentences describing this professional's behavioral archetype, their likely role in teams, how they naturally operate at work, and what kind of AI partnership suits them best.
===ROLE_END===

===REDLINES_START===
List 5-7 things this person absolutely cannot tolerate in AI interactions (based on their profile). Each on its own line starting with •
• [red line 1]
• [red line 2]
===REDLINES_END===

===STRENGTHS_START===
List 5-7 behavioral and cognitive strengths revealed by this profile. Each on its own line starting with •
• [strength 1]
• [strength 2]
===STRENGTHS_END===

===DEVELOPMENT_START===
List 4-6 growth areas or blind spots this profile reveals. Each on its own line starting with •
• [area 1]
• [area 2]
===DEVELOPMENT_END===

===RECOMMENDATIONS_START===
List 5 specific, actionable recommendations for how this person should use AI tools. Numbered list.
1. [recommendation]
2. [recommendation]
===RECOMMENDATIONS_END===

===SYS_START===
Write a complete, standalone AI system instruction (500-800 words) that this person can paste into any AI tool (ChatGPT, Claude, etc.) as their permanent system prompt. 

This instruction must:
- Open with: "أنت مساعد ذكاء اصطناعي شخصي لـ [Name]" (or English equivalent)
- Embed all 7 INSPIRE axis scores as behavioral parameters
- Encode all 8 AI interaction protocol preferences as explicit behavioral rules
- Be written in the second person addressing the AI
- Cover: communication style, depth vs speed preference, challenge vs affirm mode, context expectations, output format, and red lines
- Sound natural and authoritative, not mechanical

This is the MOST IMPORTANT section. Make it exceptional.
===SYS_END===

===QS_START===
Write 5 ready-to-use prompt starters this person can immediately use with AI, tailored to their profile and project goal.
1. "[prompt starter 1]"
2. "[prompt starter 2]"
3. "[prompt starter 3]"
4. "[prompt starter 4]"
5. "[prompt starter 5]"
===QS_END===`;
}
