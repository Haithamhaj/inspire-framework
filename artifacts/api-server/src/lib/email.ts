import { Resend } from "resend";
import { db } from "@workspace/db";
import { assessmentsTable, usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env["RESEND_API_KEY"]!);
  }
  return _resend;
}

function getFrom(): string {
  return `${process.env["FROM_NAME"] ?? "INSPIRE Framework"} <${process.env["FROM_EMAIL"] ?? "noreply@imperfect-success.com"}>`;
}

function getAppUrl(): string {
  return (process.env["APP_URL"] ?? "https://inspire.imperfect-success.com").replace(/\/$/, "");
}

export async function sendResultsEmail(assessmentId: string): Promise<void> {
  if (!process.env["RESEND_API_KEY"]) {
    logger.warn("RESEND_API_KEY not set — skipping results email");
    return;
  }

  const [assessment] = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.id, assessmentId));

  if (!assessment) return;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, assessment.userId));

  if (!user) return;

  const appUrl = getAppUrl();
  const resultsUrl = `${appUrl}/results/${assessmentId}`;
  const pdfUrl = assessment.pdfUrl ? `${appUrl}${assessment.pdfUrl}` : null;

  try {
    await getResend().emails.send({
      from: getFrom(),
      to: user.email,
      subject: `تقرير INSPIRE الخاص بك — ${assessment.projectName}`,
      html: buildResultsEmailHtml({
        name: user.name,
        projectName: assessment.projectName,
        resultsUrl,
        pdfUrl,
        aiProvider: assessment.aiProvider ?? "AI",
        appUrl,
      }),
    });

    await db
      .update(assessmentsTable)
      .set({ emailSent: true, emailSentAt: new Date() })
      .where(eq(assessmentsTable.id, assessmentId));

    logger.info({ assessmentId, email: user.email }, "Results email sent");
  } catch (err) {
    logger.error({ assessmentId, err }, "Failed to send results email");
  }
}

export async function sendFailureEmail(email: string, name: string): Promise<void> {
  if (!process.env["RESEND_API_KEY"]) return;
  try {
    await getResend().emails.send({
      from: getFrom(),
      to: email,
      subject: "INSPIRE — نعتذر عن تأخر تقريرك",
      html: buildFailureEmailHtml(name),
    });
  } catch (err) {
    logger.error({ email, err }, "Failed to send failure email");
  }
}

function buildResultsEmailHtml({
  name,
  projectName,
  resultsUrl,
  pdfUrl,
  aiProvider,
  appUrl,
}: {
  name: string;
  projectName: string;
  resultsUrl: string;
  pdfUrl: string | null;
  aiProvider: string;
  appUrl: string;
}) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>تقرير INSPIRE</title></head>
<body style="margin:0;padding:0;background:#f8f9fc;font-family:'Segoe UI',Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:#1a1a2e;padding:40px 40px 32px;text-align:center;">
          <img src="${appUrl}/images/imperfect-success-logo.jpg" width="120" style="display:block;margin:0 auto 16px;border-radius:8px;" alt="Imperfect Success" />
          <h1 style="color:#e94560;margin:0;font-size:26px;font-weight:700;letter-spacing:2px;" dir="ltr">INSPIRE</h1>
          <p style="color:rgba(255,255,255,0.5);margin:8px 0 0;font-size:13px;">إطار التقييم السلوكي للذكاء الاصطناعي</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px;">
          <h2 style="color:#1a1a2e;margin:0 0 16px;font-size:22px;">مرحباً ${name}! 🎉</h2>
          <p style="color:#4a5568;font-size:16px;line-height:1.8;margin:0 0 24px;">
            اكتمل تقرير INSPIRE الخاص بمشروعك <strong style="color:#1a1a2e;">"${projectName}"</strong>.
            تم تحليل نمطك السلوكي عبر 7 أبعاد و8 أبعاد تفاعلية بواسطة الذكاء الاصطناعي (${aiProvider}).
          </p>
          <div style="background:#f0f4ff;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="color:#1a1a2e;font-size:15px;font-weight:600;margin:0 0 8px;">ما يتضمنه تقريرك:</p>
            <ul style="color:#4a5568;font-size:14px;line-height:2;margin:0;padding-right:20px;">
              <li>جدول مؤشرات INSPIRE السبعة</li>
              <li>تحليل نمطك السلوكي والمهني</li>
              <li>نقاط قوتك والخطوط الحمراء</li>
              <li>تعليمات النظام الشخصية — جاهزة للنسخ</li>
              <li>5 بوادئ حوار مخصصة لمشروعك</li>
            </ul>
          </div>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${resultsUrl}" style="display:inline-block;background:#e94560;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;">
              عرض تقريري الكامل
            </a>
          </div>
          ${pdfUrl ? `<div style="text-align:center;margin-bottom:24px;"><a href="${pdfUrl}" style="display:inline-block;border:2px solid #1a1a2e;color:#1a1a2e;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px;">تحميل PDF</a></div>` : ""}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8f9fc;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">INSPIRE Framework — تعليمات الذكاء الاصطناعي المخصصة</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildFailureEmailHtml(name: string) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>INSPIRE — اعتذار</title></head>
<body style="margin:0;padding:40px 20px;background:#f8f9fc;font-family:'Segoe UI',Arial,sans-serif;direction:rtl;">
  <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <h2 style="color:#1a1a2e;margin:0 0 16px;">مرحباً ${name}،</h2>
    <p style="color:#4a5568;line-height:1.8;">نعتذر — واجهنا مشكلة تقنية في توليد تقريرك. فريقنا يعمل على حل المشكلة وسيُرسل تقريرك في أقرب وقت ممكن.</p>
    <p style="color:#4a5568;line-height:1.8;">شكراً لصبرك وثقتك.</p>
    <p style="color:#9ca3af;font-size:13px;margin-top:32px;">INSPIRE Framework</p>
  </div>
</body>
</html>`;
}
