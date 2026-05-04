import ReactPDF, { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { assessmentsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "./logger";
import { type InspireAxisScore } from "../inspire-types";

export interface AssessmentForPDF {
  projectName: string;
  projectGoal: string;
  roleAnalysis?: string | null;
  inspireTable?: InspireAxisScore[] | null;
  strengths?: string[] | null;
  redLines?: string[] | null;
  developmentAreas?: string[] | null;
  recommendations?: string[] | null;
  systemInstruction?: string | null;
  quickStarters?: string[] | null;
  createdAt?: Date | string | null;
}

// ─── PDF Document ──────────────────────────────────────────

function buildPDFDocument(data: {
  name: string;
  projectName: string;
  projectGoal: string;
  roleAnalysis: string;
  inspireTable: InspireAxisScore[];
  strengths: string[];
  redLines: string[];
  developmentAreas: string[];
  recommendations: string[];
  systemInstruction: string;
  quickStarters: string[];
  createdAt: string;
}) {
  const { Document, Page, Text, View, StyleSheet, Image } = ReactPDF;

  const styles = StyleSheet.create({
    page: { padding: 50, fontFamily: "Helvetica", fontSize: 10, direction: "rtl" as "ltr" | "rtl" },
    header: { marginBottom: 30, alignItems: "center" as "flex-start" | "flex-end" | "center" | "stretch" | "baseline" },
    logoImage: { width: 150, marginBottom: 12 },
    brand: { fontSize: 24, fontFamily: "Helvetica-Bold", color: "#1a1a2e", marginBottom: 4 },
    subtitle: { fontSize: 10, color: "#6b7280" },
    title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a1a2e", marginBottom: 4, marginTop: 24 },
    label: { fontSize: 9, color: "#6b7280", marginBottom: 2 },
    value: { fontSize: 10, color: "#111827", marginBottom: 12 },
    sectionTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1a1a2e", marginBottom: 10, marginTop: 20, borderBottom: "1px solid #e5e7eb", paddingBottom: 4 },
    paragraph: { fontSize: 10, color: "#374151", lineHeight: 1.7, marginBottom: 8 },
    bulletRow: { flexDirection: "row", marginBottom: 5, gap: 6 },
    bullet: { color: "#e94560", fontSize: 12, lineHeight: 1 },
    bulletText: { fontSize: 10, color: "#374151", flex: 1, lineHeight: 1.5 },
    tableRow: { flexDirection: "row", borderBottom: "1px solid #f3f4f6", paddingVertical: 6, gap: 8 },
    tableHeader: { flexDirection: "row", borderBottom: "2px solid #1a1a2e", paddingBottom: 6, marginBottom: 2, gap: 8 },
    tableAxis: { flex: 2, fontSize: 9, color: "#374151" },
    tableAxisHeader: { flex: 2, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1a1a2e" },
    tablePct: { flex: 1, fontSize: 9, color: "#e94560", fontFamily: "Helvetica-Bold" },
    tablePctHeader: { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1a1a2e" },
    tableNote: { flex: 3, fontSize: 8, color: "#6b7280" },
    tableNoteHeader: { flex: 3, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1a1a2e" },
    instructionBox: { backgroundColor: "#1a1a2e", padding: 16, borderRadius: 8, marginTop: 8 },
    instructionText: { fontSize: 9, color: "#e5e7eb", lineHeight: 1.7 },
    qsItem: { flexDirection: "row", gap: 6, marginBottom: 6 },
    qsNum: { fontSize: 9, color: "#e94560", fontFamily: "Helvetica-Bold", width: 14 },
    qsText: { fontSize: 9, color: "#374151", flex: 1, lineHeight: 1.5 },
    footer: { position: "absolute", bottom: 30, left: 50, right: 50, textAlign: "center", fontSize: 8, color: "#9ca3af" },
  });

  return React.createElement(
    Document,
    { title: `INSPIRE Report — ${data.name}`, author: "INSPIRE Framework" },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Image, { style: styles.logoImage, src: path.join(process.cwd(), "public/images/imperfect-success-logo.jpg") }),
        React.createElement(Text, { style: styles.brand }, "INSPIRE"),
        React.createElement(Text, { style: styles.subtitle }, "Personal Behavioral Profile & AI System Instruction"),
      ),
      // Meta
      React.createElement(Text, { style: styles.label }, "Name"),
      React.createElement(Text, { style: styles.value }, data.name),
      React.createElement(Text, { style: styles.label }, "Project"),
      React.createElement(Text, { style: styles.value }, data.projectName),
      React.createElement(Text, { style: styles.label }, "Goal"),
      React.createElement(Text, { style: styles.value }, data.projectGoal),
      React.createElement(Text, { style: styles.label }, "Generated"),
      React.createElement(Text, { style: styles.value }, data.createdAt),
      // Role analysis
      React.createElement(Text, { style: styles.sectionTitle }, "Behavioral Profile"),
      React.createElement(Text, { style: styles.paragraph }, data.roleAnalysis || "—"),
      // INSPIRE Table
      React.createElement(Text, { style: styles.sectionTitle }, "INSPIRE Scores"),
      React.createElement(View, { style: styles.tableHeader },
        React.createElement(Text, { style: styles.tableAxisHeader }, "Axis"),
        React.createElement(Text, { style: styles.tablePctHeader }, "Score"),
        React.createElement(Text, { style: styles.tableNoteHeader }, "Note"),
      ),
      ...(data.inspireTable ?? []).map((row: InspireAxisScore, i: number) =>
        React.createElement(View, { key: i, style: styles.tableRow },
          React.createElement(Text, { style: styles.tableAxis }, row.axis ?? ""),
          React.createElement(Text, { style: styles.tablePct }, `${row.percentage ?? 0}%`),
          React.createElement(Text, { style: styles.tableNote }, row.note ?? ""),
        )
      ),
      // Strengths
      React.createElement(Text, { style: styles.sectionTitle }, "Strengths"),
      ...(data.strengths ?? []).map((s: string, i: number) =>
        React.createElement(View, { key: i, style: styles.bulletRow },
          React.createElement(Text, { style: styles.bullet }, "•"),
          React.createElement(Text, { style: styles.bulletText }, s),
        )
      ),
      // Red Lines
      React.createElement(Text, { style: styles.sectionTitle }, "Red Lines"),
      ...(data.redLines ?? []).map((s: string, i: number) =>
        React.createElement(View, { key: i, style: styles.bulletRow },
          React.createElement(Text, { style: styles.bullet }, "•"),
          React.createElement(Text, { style: styles.bulletText }, s),
        )
      ),
      // Footer p1
      React.createElement(Text, { style: styles.footer }, `INSPIRE Framework • ${data.name} • Page 1`),
    ),
    // Page 2: System Instruction + Recommendations + Quick Starters
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(Text, { style: { ...styles.brand, fontSize: 16 } }, "INSPIRE — AI System Instruction"),
      React.createElement(View, { style: styles.instructionBox },
        React.createElement(Text, { style: styles.instructionText }, data.systemInstruction || "—"),
      ),
      React.createElement(Text, { style: styles.sectionTitle }, "Recommendations"),
      ...(data.recommendations ?? []).map((r: string, i: number) =>
        React.createElement(View, { key: i, style: styles.bulletRow },
          React.createElement(Text, { style: { ...styles.bullet, color: "#1a1a2e" } }, `${i + 1}.`),
          React.createElement(Text, { style: styles.bulletText }, r),
        )
      ),
      React.createElement(Text, { style: styles.sectionTitle }, "Quick Starters"),
      ...(data.quickStarters ?? []).map((qs: string, i: number) =>
        React.createElement(View, { key: i, style: styles.qsItem },
          React.createElement(Text, { style: styles.qsNum }, `${i + 1}.`),
          React.createElement(Text, { style: styles.qsText }, qs),
        )
      ),
      React.createElement(Text, { style: styles.footer }, `INSPIRE Framework • ${data.name} • Page 2`),
    )
  );
}

// ─── GENERATE & SAVE ──────────────────────────────────────

export async function generateAndSavePDF(
  assessmentId: string,
  userData: { name: string },
  assessment: AssessmentForPDF
): Promise<string | null> {
  try {
    const doc = buildPDFDocument({
      name: userData.name,
      projectName: assessment.projectName,
      projectGoal: assessment.projectGoal,
      roleAnalysis: assessment.roleAnalysis ?? "",
      inspireTable: (assessment.inspireTable as InspireAxisScore[]) ?? [],
      strengths: (assessment.strengths as string[]) ?? [],
      redLines: (assessment.redLines as string[]) ?? [],
      developmentAreas: (assessment.developmentAreas as string[]) ?? [],
      recommendations: (assessment.recommendations as string[]) ?? [],
      systemInstruction: assessment.systemInstruction ?? "",
      quickStarters: (assessment.quickStarters as string[]) ?? [],
      createdAt: assessment.createdAt
        ? new Date(assessment.createdAt).toLocaleDateString("ar-SA")
        : "",
    });

    const pdfBuffer = await renderToBuffer(doc);

    const pdfDir = path.join(process.cwd(), "public", "pdfs");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const filename = `inspire-report-${assessmentId}.pdf`;
    const filePath = path.join(pdfDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);

    const pdfUrl = `/pdfs/${filename}`;

    await db
      .update(assessmentsTable)
      .set({ pdfGenerated: true, pdfUrl })
      .where(eq(assessmentsTable.id, assessmentId));

    logger.info({ assessmentId, pdfUrl }, "PDF generated");
    return pdfUrl;
  } catch (err) {
    logger.error({ assessmentId, err }, "PDF generation failed");
    return null;
  }
}
