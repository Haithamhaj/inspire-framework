/**
 * Production smoke: register -> login -> start full v2 assessment -> submit 21 answers
 * -> apply 100% discount (free order) -> generate report -> verify results.
 *
 * Usage:
 *   INSPIRE_BASE_URL="https://inspire.next-stepai.com" \
 *   ADMIN_PASSWORD="..." \
 *   node scripts/prod-smoke-full-flow.mjs
 *
 * Notes:
 * - Uses a unique disposable account per run (`smoke+<timestamp>@example.com`).
 * - Attempts cleanup via admin delete endpoint if `ADMIN_PASSWORD` is provided.
 * - Never prints secrets.
 */

import fs from "node:fs";

const baseUrl = (process.env.INSPIRE_BASE_URL ?? "https://inspire.next-stepai.com").replace(/\/$/, "");
const apiBase = `${baseUrl}/api`;

function readEnvLocalValue(key) {
  try {
    const text = fs.readFileSync(".env.local", "utf8");
    const line = text
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("#") && l.startsWith(`${key}=`));
    if (!line) return undefined;
    return line.split("=", 2)[1]?.trim()?.replace(/^['"]|['"]$/g, "");
  } catch {
    return undefined;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function fetchJson(url, { method = "GET", headers, body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
      ...(headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // ignore
  }

  return { ok: res.ok, status: res.status, json, text };
}

async function fetchText(path) {
  const res = await fetch(`${baseUrl}${path}`);
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

function buildSmokeEmail() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "");
  return `smoke+${stamp}@example.com`;
}

async function main() {
  const startedAt = Date.now();
  const email = buildSmokeEmail();
  const password = "SmokeTest123";
  const discountCode = "HAITHAM"; // confirmed active 100% in DB

  const pages = {};
  for (const path of ["/", "/pricing", "/assess", "/login"]) {
    const r = await fetchText(path);
    pages[path] = r.status;
  }

  // Register (idempotent-ish: treat 409 as ok)
  {
    const r = await fetchJson(`${apiBase}/auth/register`, {
      method: "POST",
      body: {
        name: "Smoke Test",
        email,
        password,
        job_title: "QA",
        consent_given: true,
      },
    });
    assert(r.status === 201 || r.status === 409, `register failed: ${r.status}`);
  }

  // Login
  const login = await fetchJson(`${apiBase}/auth/login`, {
    method: "POST",
    body: { email, password },
  });
  assert(login.ok && login.json?.success, `login failed: ${login.status}`);
  const token = login.json.access_token;
  const authHeaders = { authorization: `Bearer ${token}` };

  // Free order via 100% discount
  const freeOrder = await fetchJson(`${apiBase}/billing/free-order`, {
    method: "POST",
    headers: authHeaders,
    body: { discountCode },
  });
  assert(freeOrder.ok && freeOrder.json?.success, `free-order failed: ${freeOrder.status}`);
  const paymentId = freeOrder.json.paymentId;

  // Load v2 questions
  const questions = await fetchJson(`${apiBase}/questions`);
  assert(questions.ok && questions.json?.success, `questions failed: ${questions.status}`);
  assert(Array.isArray(questions.json.questions) && questions.json.questions.length === 21, "expected 21 questions");

  const answers = questions.json.questions.map((q) => ({
    questionId: q.questionId,
    optionId: q.options?.[0]?.optionId,
  }));
  assert(answers.every((a) => a.optionId), "some questions had no options");

  // Start assessment
  const start = await fetchJson(`${apiBase}/assessments/start`, {
    method: "POST",
    headers: authHeaders,
    body: {
      project_name: "Production Smoke Test",
      project_goal: "Verify production end-to-end report generation.",
      domain: "Coding / Software Development",
      custom_domain: null,
      domain_specialization: "Web app",
      project_context: "Automated daily QA run.",
      report_language: "en",
      assessment_type: "full",
    },
  });
  assert(start.status === 201 && start.json?.success, `assessment start failed: ${start.status}`);
  const assessmentId = start.json.assessmentId;

  // Submit (v2 full) + attach payment
  const submit = await fetchJson(`${apiBase}/assessments/${assessmentId}/submit`, {
    method: "POST",
    headers: authHeaders,
    body: {
      answers,
      open_answer: "Automated production smoke test.",
      completion_time_seconds: 180,
      payment_id: paymentId,
    },
  });
  assert(submit.ok && submit.json?.success, `submit failed: ${submit.status}`);

  // Poll completion
  let finalStatus = null;
  let final = null;
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    const st = await fetchJson(`${apiBase}/assessments/${assessmentId}/status`, { headers: authHeaders });
    assert(st.ok && st.json?.success, `status failed: ${st.status}`);
    final = st.json.assessment;
    finalStatus = final?.status;
    if (finalStatus === "completed" || finalStatus === "failed" || finalStatus === "pending_retry") break;
    await new Promise((r) => setTimeout(r, 3000));
  }
  assert(finalStatus, "timed out waiting for final status");

  // Fetch results payload
  const results = await fetchJson(`${apiBase}/results/${assessmentId}`, { headers: authHeaders });
  assert(results.ok && results.json?.success, `results api failed: ${results.status}`);
  const assessment = results.json.assessment ?? {};
  const hasReport = Boolean(assessment.reportContent);
  const hasInstruction = Boolean(assessment.systemInstruction);

  // Results page should load
  const resultsPage = await fetchText(`/results/${assessmentId}`);

  // Cleanup disposable account (best-effort)
  const adminPassword = process.env.ADMIN_PASSWORD ?? readEnvLocalValue("ADMIN_PASSWORD");
  let cleanup = "skipped";
  if (adminPassword) {
    const del = await fetchJson(`${apiBase}/admin/users`, {
      method: "DELETE",
      headers: { "x-admin-password": adminPassword },
      body: { email },
    });
    cleanup = del.ok ? "deleted" : `failed:${del.status}`;
  }

  const elapsedSeconds = Math.round((Date.now() - startedAt) / 100) / 10;
  console.log(
    JSON.stringify(
      {
        ok: finalStatus === "completed" && hasReport && hasInstruction && resultsPage.status === 200,
        baseUrl,
        webPages: pages,
        assessmentId,
        finalStatus,
        aiProvider: final?.aiProvider ?? null,
        aiModel: final?.aiModel ?? null,
        retryCount: final?.retryCount ?? null,
        hasReportContent: hasReport,
        hasSystemInstruction: hasInstruction,
        resultsPageStatus: resultsPage.status,
        discountCode,
        cleanup,
        elapsedSeconds,
      },
      null,
      2
    )
  );
}

await main();
