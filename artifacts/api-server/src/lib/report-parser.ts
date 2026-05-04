import { UNIVERSAL_RULES } from "./prompt-builder";

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
