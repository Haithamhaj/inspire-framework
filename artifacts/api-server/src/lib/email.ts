import { Resend } from "resend";
import { db } from "@workspace/db";
import {
  assessmentGenerationRunsTable,
  assessmentsTable,
  usersTable,
} from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import { logger } from "./logger";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env["RESEND_API_KEY"]!);
  }
  return _resend;
}

function getFrom(): string {
  return `${process.env["FROM_NAME"] ?? "INSPIRE"} <${process.env["FROM_EMAIL"] ?? "noreply@imperfect-success.com"}>`;
}

function getAppUrl(): string {
  return (process.env["INSPIRE_APP_URL"] ?? process.env["APP_URL"] ?? "https://inspire.next-stepai.com").replace(/\/$/, "");
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

export async function sendRecoveryEmail(toEmail: string, toName: string, discountCode: string): Promise<void> {
  if (!process.env["RESEND_API_KEY"]) {
    logger.warn("RESEND_API_KEY not set — skipping recovery email");
    return;
  }
  const appUrl = getAppUrl();
  try {
    await getResend().emails.send({
      from: getFrom(),
      to: toEmail,
      subject: "INSPIRE — كود خصم 100% لإعادة تقييمك",
      html: buildRecoveryEmailHtml(toName, appUrl, discountCode),
    });
    logger.info({ email: toEmail }, "Recovery email sent");
  } catch (err) {
    logger.error({ email: toEmail, err }, "Failed to send recovery email");
    throw err;
  }
}

export async function sendPasswordResetEmail(toEmail: string, toName: string, resetToken: string): Promise<void> {
  if (!process.env["RESEND_API_KEY"]) {
    logger.warn("RESEND_API_KEY not set — skipping password reset email");
    return;
  }
  const appUrl = getAppUrl();
  const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;
  try {
    await getResend().emails.send({
      from: getFrom(),
      to: toEmail,
      subject: "INSPIRE — Reset your password",
      html: buildPasswordResetEmailHtml(toName, resetUrl, appUrl),
    });
    logger.info({ email: toEmail }, "Password reset email sent");
  } catch (err) {
    logger.error({ email: toEmail, err }, "Failed to send password reset email");
    throw err;
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

export async function sendAdminAlertEmail({
  subject,
  assessmentId,
  reason,
}: {
  subject: string;
  assessmentId: string;
  reason: string;
}): Promise<void> {
  const to = process.env["ADMIN_ALERT_EMAIL"];
  if (!process.env["RESEND_API_KEY"] || !to) {
    logger.warn({ assessmentId, reason }, "Admin alert email skipped");
    return;
  }

  const [[assessment], [latestRun]] = await Promise.all([
    db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.id, assessmentId)),
    db
      .select()
      .from(assessmentGenerationRunsTable)
      .where(eq(assessmentGenerationRunsTable.assessmentId, assessmentId))
      .orderBy(desc(assessmentGenerationRunsTable.createdAt))
      .limit(1),
  ]);

  const [user] = assessment
    ? await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, assessment.userId))
    : [null];

  const appUrl = getAppUrl();
  const resultsUrl = `${appUrl}/results/${assessmentId}`;

  try {
    await getResend().emails.send({
      from: getFrom(),
      to,
      subject,
      html: buildAdminAlertEmailHtml({
        assessmentId,
        reason,
        resultsUrl,
        userName: user?.name ?? "Unknown",
        userEmail: user?.email ?? "Unknown",
        projectName: assessment?.projectName ?? "Unknown",
        status: assessment?.status ?? "Unknown",
        retryCount: assessment?.retryCount ?? 0,
        nextRetryAt: assessment?.nextRetryAt?.toISOString() ?? null,
        paymentId: assessment?.paymentId ?? null,
        latestRunStatus: latestRun?.status ?? null,
        latestRunAttempt: latestRun?.attemptNumber ?? null,
        latestRunProvider: latestRun?.provider ?? null,
        latestRunModel: latestRun?.model ?? null,
        latestRunError: latestRun?.errorMessage ?? null,
        latestRunAt: latestRun?.createdAt?.toISOString() ?? null,
      }),
    });
    logger.info({ assessmentId, to }, "Admin alert email sent");
  } catch (err) {
    logger.error({ assessmentId, err }, "Failed to send admin alert email");
  }
}

function buildRecoveryEmailHtml(name: string, appUrl: string, discountCode: string) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>INSPIRE — كود خصم لإعادة التقييم</title></head>
<body style="margin:0;padding:0;background:#f8f9fc;font-family:'Segoe UI',Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a1a2e;padding:40px 40px 32px;text-align:center;">
          <h1 style="color:#e94560;margin:0;font-size:26px;font-weight:700;letter-spacing:2px;" dir="ltr">INSPIRE</h1>
          <p style="color:rgba(255,255,255,0.5);margin:8px 0 0;font-size:13px;">إطار التقييم السلوكي للذكاء الاصطناعي</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="color:#1a1a2e;margin:0 0 16px;font-size:20px;">مرحباً ${name}،</h2>
          <p style="color:#4a5568;font-size:16px;line-height:1.8;margin:0 0 20px;">
            نعتذر عن المشكلة التي واجهتك أثناء إتمام عملية الدفع. تفضّل بكود خصم <strong>100%</strong> صالح لاستخدام واحد فقط — أدخله عند الدفع وستُعفى من الرسوم بالكامل.
          </p>
          <div style="background:#fff7ed;border:2px dashed #e94560;border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
            <p style="color:#9ca3af;font-size:13px;margin:0 0 8px;">كود الخصم الخاص بك</p>
            <p style="color:#1a1a2e;font-size:28px;font-weight:700;letter-spacing:4px;margin:0;" dir="ltr">${discountCode}</p>
            <p style="color:#e94560;font-size:12px;margin:8px 0 0;">صالح لاستخدام واحد فقط · خصم 100%</p>
          </div>
          <div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="color:#3730a3;font-size:15px;font-weight:600;margin:0 0 8px;">📋 خطوات إعادة التقييم:</p>
            <ol style="color:#374151;font-size:14px;line-height:2.2;margin:0;padding-right:20px;">
              <li>اضغط على الرابط أدناه للدخول إلى المنصة</li>
              <li>سجّل دخولك بنفس البريد الإلكتروني والكلمة السرية</li>
              <li>ابدأ التقييم وأجب على الأسئلة</li>
              <li>عند شاشة الدفع، أدخل الكود أعلاه في خانة "كود الخصم"</li>
              <li>اضغط تطبيق — ستصبح الرسوم صفراً وتكمل مجاناً</li>
            </ol>
          </div>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${appUrl}/assess" style="display:inline-block;background:#e94560;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:700;font-size:16px;">
              ابدأ التقييم الآن
            </a>
          </div>
          <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">إذا واجهتك أي مشكلة، تواصل معنا مباشرةً عبر الرد على هذا البريد.</p>
        </td></tr>
        <tr><td style="background:#f8f9fc;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">INSPIRE — تقرير نمط التشغيل وتعليمات الذكاء الاصطناعي</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildPasswordResetEmailHtml(name: string, resetUrl: string, appUrl: string) {
  return `<!DOCTYPE html>
<html dir="ltr" lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>INSPIRE password reset</title></head>
<body style="margin:0;padding:0;background:#f8f9fc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a1a2e;padding:36px 40px;text-align:center;">
          <h1 style="color:#e94560;margin:0;font-size:26px;font-weight:700;letter-spacing:2px;">INSPIRE</h1>
          <p style="color:rgba(255,255,255,0.55);margin:8px 0 0;font-size:13px;">Operating Pattern Report</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="color:#1a1a2e;margin:0 0 16px;font-size:20px;">Hi ${name},</h2>
          <p style="color:#4a5568;font-size:16px;line-height:1.7;margin:0 0 20px;">
            We received a request to reset your INSPIRE password. This link expires in one hour and can be used once.
          </p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${resetUrl}" style="display:inline-block;background:#e94560;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;">
              Reset password
            </a>
          </div>
          <p style="color:#718096;font-size:14px;line-height:1.7;margin:0 0 12px;">
            If you did not request this, you can ignore this email.
          </p>
          <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0;word-break:break-all;">
            ${resetUrl}
          </p>
        </td></tr>
        <tr><td style="background:#f8f9fc;padding:22px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">${appUrl}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
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
            تم تجهيز تقرير نمط التشغيل الخاص بك بواسطة الذكاء الاصطناعي (${aiProvider}).
          </p>
          <div style="background:#f0f4ff;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="color:#1a1a2e;font-size:15px;font-weight:600;margin:0 0 8px;">ما يتضمنه تقريرك:</p>
            <ul style="color:#4a5568;font-size:14px;line-height:2;margin:0;padding-right:20px;">
              <li>لمحة تشغيلية عن طريقة عملك</li>
              <li>توصيات عملية مخصصة</li>
              <li>إرشادات مختصرة لاستخدام AI بشكل أفضل</li>
              <li>تعليمات AI إنجليزية جاهزة للنسخ</li>
              <li>شرح لكيفية استخدام التعليمات عند الحاجة</li>
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
          <p style="color:#9ca3af;font-size:12px;margin:0;">INSPIRE — تقرير نمط التشغيل وتعليمات الذكاء الاصطناعي</p>
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
    <p style="color:#9ca3af;font-size:13px;margin-top:32px;">INSPIRE</p>
  </div>
</body>
</html>`;
}

function buildAdminAlertEmailHtml({
  assessmentId,
  reason,
  resultsUrl,
  userName,
  userEmail,
  projectName,
  status,
  retryCount,
  nextRetryAt,
  paymentId,
  latestRunStatus,
  latestRunAttempt,
  latestRunProvider,
  latestRunModel,
  latestRunError,
  latestRunAt,
}: {
  assessmentId: string;
  reason: string;
  resultsUrl: string;
  userName: string;
  userEmail: string;
  projectName: string;
  status: string;
  retryCount: number;
  nextRetryAt: string | null;
  paymentId: string | null;
  latestRunStatus: string | null;
  latestRunAttempt: number | null;
  latestRunProvider: string | null;
  latestRunModel: string | null;
  latestRunError: string | null;
  latestRunAt: string | null;
}) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>INSPIRE Admin Alert</title></head>
<body style="margin:0;padding:32px 18px;background:#f8f9fc;font-family:'Segoe UI',Arial,sans-serif;direction:rtl;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <h2 style="color:#b91c1c;margin:0 0 16px;">تنبيه تشغيل INSPIRE</h2>
    <p style="color:#374151;line-height:1.8;margin:0 0 18px;">${reason}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;color:#374151;font-size:14px;">
      <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:700;">Assessment ID</td><td dir="ltr" style="padding:8px;border-bottom:1px solid #e5e7eb;">${assessmentId}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:700;">Project</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${projectName}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:700;">User</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${userName} — <span dir="ltr">${userEmail}</span></td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:700;">Status</td><td dir="ltr" style="padding:8px;border-bottom:1px solid #e5e7eb;">${status}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:700;">Retry</td><td dir="ltr" style="padding:8px;border-bottom:1px solid #e5e7eb;">${retryCount > 0 ? retryCount : "first generation"}${nextRetryAt ? ` — next: ${nextRetryAt}` : ""}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:700;">Payment ID</td><td dir="ltr" style="padding:8px;border-bottom:1px solid #e5e7eb;">${paymentId ?? "None"}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:700;">Latest run</td><td dir="ltr" style="padding:8px;border-bottom:1px solid #e5e7eb;">${latestRunStatus ?? "None"}${latestRunAttempt ? ` — ${latestRunAttempt === 1 ? "first generation" : `retry attempt ${latestRunAttempt}`}` : ""}${latestRunAt ? ` — ${latestRunAt}` : ""}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:700;">Provider / Model</td><td dir="ltr" style="padding:8px;border-bottom:1px solid #e5e7eb;">${latestRunProvider ?? "None"}${latestRunModel ? ` / ${latestRunModel}` : ""}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:700;">Error</td><td dir="ltr" style="padding:8px;border-bottom:1px solid #e5e7eb;white-space:pre-wrap;">${latestRunError ?? "None"}</td></tr>
    </table>
    <div style="margin-top:22px;text-align:center;">
      <a href="${resultsUrl}" style="display:inline-block;background:#e94560;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;">فتح صفحة النتيجة</a>
    </div>
  </div>
</body>
</html>`;
}
