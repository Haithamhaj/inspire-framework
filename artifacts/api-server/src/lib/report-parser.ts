export function parseFullReport(text: string) {
  const extract = (start: string, end: string) => {
    const m = text.match(new RegExp(`${start}([\\s\\S]*?)${end}`));
    return m ? m[1].trim() : "";
  };

  const parseJsonSection = (raw: string): string[] => {
    return raw
      .split("\n")
      .filter((l) => l.trim().startsWith("•"))
      .map((l) => l.replace(/^•\s*/, "").trim())
      .filter(Boolean);
  };

  const parseTable = (raw: string) => {
    return raw
      .split("\n")
      .filter((l) => l.includes("|") && !l.startsWith("Axis"))
      .map((l) => {
        const parts = l
          .split("|")
          .map((p) => p.trim())
          .filter(Boolean);
        if (parts.length < 6) return null;
        return {
          axis: parts[0],
          score: parseInt(parts[1]) || 0,
          max: parseInt(parts[2]) || 6,
          percentage: parseFloat(parts[3]) || 0,
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
    .filter(Boolean);

  return {
    inspireTable: parseTable(
      extract("===TABLE_START===", "===TABLE_END===")
    ),
    roleAnalysis: extract("===ROLE_START===", "===ROLE_END==="),
    redLines: parseJsonSection(
      extract("===REDLINES_START===", "===REDLINES_END===")
    ),
    strengths: parseJsonSection(
      extract("===STRENGTHS_START===", "===STRENGTHS_END===")
    ),
    developmentAreas: parseJsonSection(
      extract("===DEVELOPMENT_START===", "===DEVELOPMENT_END===")
    ),
    recommendations: extract(
      "===RECOMMENDATIONS_START===",
      "===RECOMMENDATIONS_END==="
    )
      .split("\n")
      .filter((l) => /^\d\./.test(l.trim()))
      .map((l) => l.replace(/^\d\.\s*/, "").trim())
      .filter(Boolean),
    systemInstruction: extract("===SYS_START===", "===SYS_END==="),
    quickStarters: quickStarters.length > 0 ? quickStarters : [rawQS],
  };
}
