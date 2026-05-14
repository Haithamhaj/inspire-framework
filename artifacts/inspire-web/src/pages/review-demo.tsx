import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Brain,
  Check,
  ClipboardList,
  FileText,
  Loader2,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const questions = [
  {
    title: "How should AI work with your ideas?",
    answer: "Challenge assumptions and improve the idea before execution.",
    icon: Target,
  },
  {
    title: "What type of support do you need most?",
    answer: "Structured planning, decision support, and clear next actions.",
    icon: ClipboardList,
  },
  {
    title: "How much context should AI preserve?",
    answer: "Keep the project goal, audience, constraints, and preferred tone active.",
    icon: Brain,
  },
  {
    title: "What should the assistant avoid?",
    answer: "Generic advice, hidden assumptions, and answers that skip risks.",
    icon: ShieldCheck,
  },
];

const reportSections = [
  {
    title: "AI Operating Profile",
    body: "A strategic execution partner that turns goals into structured plans, tests assumptions, and keeps every answer tied to the user's context.",
  },
  {
    title: "Recommended AI Roles",
    body: "Strategic Partner, Risk Reviewer, Decision Support, Organizer, and Execution Coach.",
  },
  {
    title: "Copy-ready Instructions",
    body: "Use the user's project goal, audience, constraints, preferred depth, and decision criteria before answering. Start with the useful next action, then provide concise reasoning.",
  },
];

const frames = ["setup", "questions-one", "questions-two", "processing", "report"] as const;
type Frame = (typeof frames)[number];

function getFrameLabel(frame: Frame) {
  switch (frame) {
    case "setup":
      return "Assessment setup";
    case "questions-one":
      return "Answering profile questions";
    case "questions-two":
      return "Capturing work preferences";
    case "processing":
      return "Generating the report";
    case "report":
      return "Digital report delivered";
  }
}

export default function ReviewDemo() {
  const fixedFrame = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("frame") as Frame | null
    : null;
  const fixedFrameIndex = fixedFrame && frames.includes(fixedFrame) ? frames.indexOf(fixedFrame) : null;
  const [frameIndex, setFrameIndex] = useState(fixedFrameIndex ?? 0);
  const frame = frames[frameIndex] ?? "setup";
  const progress = Math.round(((frameIndex + 1) / frames.length) * 100);

  useEffect(() => {
    if (fixedFrameIndex !== null) return;
    const timer = window.setInterval(() => {
      setFrameIndex((current) => Math.min(current + 1, frames.length - 1));
    }, 3400);
    return () => window.clearInterval(timer);
  }, [fixedFrameIndex]);

  const visibleQuestions = useMemo(() => {
    if (frame === "questions-one") return questions.slice(0, 2);
    if (frame === "questions-two") return questions.slice(2);
    return questions;
  }, [frame]);

  return (
    <div className="min-h-screen bg-[#050817] text-slate-50">
      <section className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-rose-200">
              <Sparkles className="h-3.5 w-3.5" />
              Lemon Squeezy review demo
            </div>
            <h1 className="max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">
              INSPIRE turns assessment answers into a personalized AI operating profile.
            </h1>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-4 shadow-xl shadow-black/20">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Current step</p>
            <p className="mt-1 text-lg font-black text-white">{getFrameLabel(frame)}</p>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-full border border-slate-700 bg-slate-950">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid min-h-[520px] gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="rounded-3xl border border-slate-700 bg-slate-950/70 p-6 shadow-2xl shadow-black/25">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-200">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Sample assessment context</p>
                <p className="text-xs text-slate-400">Reviewer-safe data, same product logic</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["Project", "AI productivity workflow"],
                ["Goal", "Create better instructions for ChatGPT, Claude, and Gemini"],
                ["Audience", "Saudi and GCC professionals using AI at work"],
                ["Language", "Arabic and English report"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-100">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-300/15 bg-emerald-500/10 p-4">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <p className="text-sm leading-6 text-emerald-50">
                  The paid product is delivered digitally after the online assessment as a structured report and copy-ready AI instructions.
                </p>
              </div>
            </div>
          </aside>

          <main className="rounded-3xl border border-slate-700 bg-slate-950/70 p-6 shadow-2xl shadow-black/25">
            {frame === "setup" && (
              <div className="flex h-full flex-col justify-center">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-200">
                  <Zap className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-black text-white">Start the assessment</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                  The user enters the work context, preferred report language, and objective. INSPIRE then asks structured preference questions that shape the final AI operating profile.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {["Context", "Preferences", "Report"].map((item, index) => (
                    <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                      <p className="text-2xl font-black text-rose-200">0{index + 1}</p>
                      <p className="mt-2 text-sm font-bold text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(frame === "questions-one" || frame === "questions-two") && (
              <div className="flex h-full flex-col">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-rose-200">Assessment questions</p>
                    <h2 className="text-2xl font-black text-white">Answers become report signals</h2>
                  </div>
                  <div className="rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200">
                    {frame === "questions-one" ? "2 of 4" : "4 of 4"} answered
                  </div>
                </div>
                <div className="grid flex-1 gap-4">
                  {visibleQuestions.map((question) => {
                    const Icon = question.icon;
                    return (
                      <div key={question.title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-rose-200">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-black text-white">{question.title}</h3>
                            <div className="mt-3 rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4">
                              <div className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 shrink-0 text-rose-200" />
                                <p className="text-sm font-semibold leading-6 text-rose-50">{question.answer}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {frame === "processing" && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-300/20 bg-rose-500/10">
                  <Loader2 className="h-10 w-10 animate-spin text-rose-200" />
                </div>
                <h2 className="text-3xl font-black text-white">Generating the report</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                  The system combines the user's answers, context, preference signals, and INSPIRE decision logic to produce a personalized report.
                </p>
                <div className="mt-8 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
                  {["Profile signals", "AI roles", "Instructions"].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm font-bold text-slate-100">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {frame === "report" && (
              <div className="flex h-full flex-col">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-emerald-200">Report ready</p>
                    <h2 className="text-2xl font-black text-white">Personalized digital output</h2>
                  </div>
                  <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-rose-950/30">
                    View full report
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid flex-1 gap-4">
                  {reportSections.map((section) => (
                    <article key={section.title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-200">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white">{section.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{section.body}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
