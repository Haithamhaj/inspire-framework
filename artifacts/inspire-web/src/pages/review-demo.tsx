import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  Check,
  ChevronDown,
  ClipboardList,
  Copy,
  Download,
  FileText,
  Loader2,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const frames = [
  "intro",
  "q1-open",
  "q1-selected",
  "q2-open",
  "q2-selected",
  "q3-open",
  "q3-selected",
  "processing",
  "report-cover",
  "report-profile",
  "report-instruction",
  "report-prompts",
  "report-final",
] as const;

type Frame = (typeof frames)[number];

const questions = [
  {
    number: 1,
    title: "When you share an idea with AI, what should it do first?",
    icon: Target,
    options: [
      "Support the idea and help make it clearer.",
      "Challenge the idea, expose weak assumptions, then improve it.",
      "Give a short answer without asking for context.",
    ],
    selected: 1,
    signal: "INSPIRE detects that the user wants AI to act as a constructive challenger, not only a supportive assistant.",
  },
  {
    number: 2,
    title: "What kind of help do you expect from AI at work?",
    icon: ClipboardList,
    options: [
      "A structured plan, priorities, risks, and next actions.",
      "A long explanation with every possible detail.",
      "Creative ideas only, without execution steps.",
    ],
    selected: 0,
    signal: "The report prioritizes planning, decision support, and practical execution guidance.",
  },
  {
    number: 3,
    title: "Which context should AI keep active while helping you?",
    icon: Brain,
    options: [
      "Only the current question.",
      "Project goal, audience, constraints, tone, and success criteria.",
      "General best practices from the internet.",
    ],
    selected: 1,
    signal: "The final personalized instructions keep project context and user preferences active across prompts.",
  },
];

const reportSections = [
  {
    eyebrow: "01",
    title: "Personalized AI Instructions",
    body:
      "You work best with an AI assistant that behaves like a strategic execution partner. It should clarify the objective, test assumptions, identify risks, and keep each response tied to the user's project context.",
  },
  {
    eyebrow: "02",
    title: "Recommended AI Roles",
    body:
      "Primary roles: Strategic Partner, Risk Reviewer, Decision Support, Organizer, and Execution Coach. The assistant should switch roles depending on whether the task is planning, clearer thinking, writing, prioritization, or implementation.",
  },
  {
    eyebrow: "03",
    title: "Copy-ready AI Instructions",
    body:
      "Use the user's project goal, audience, constraints, preferred depth, and decision criteria before answering. Start with the most useful next action, then provide concise reasoning and a practical structure the user can apply immediately.",
  },
  {
    eyebrow: "04",
    title: "Prompt Starters",
    body:
      "1. Review this plan and identify the highest-risk assumptions.\n2. Turn this rough idea into a practical execution plan.\n3. Compare these options and recommend the strongest path.\n4. Rewrite this prompt so another AI model can produce a better result.",
  },
  {
    eyebrow: "05",
    title: "Quality Rules",
    body:
      "Avoid generic advice. Separate facts, assumptions, and recommendations. Ask one focused clarification question when needed. When the task is clear, proceed with a reasonable assumption and state it briefly.",
  },
  {
    eyebrow: "06",
    title: "Final Delivery",
    body:
      "The customer receives a structured digital report and copy-ready instructions they can use with AI tools such as ChatGPT, Claude, and Gemini. No physical goods are shipped and no consultation service is included.",
  },
];

function getFrameFromQuery(): Frame | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("frame");
  return frames.includes(value as Frame) ? (value as Frame) : null;
}

function getStep(frame: Frame) {
  if (frame.startsWith("q")) return "Assessment questions";
  if (frame === "processing") return "Generating report";
  if (frame.startsWith("report")) return "Reviewing full report";
  return "Start assessment";
}

function getQuestionFrame(frame: Frame) {
  if (frame === "q1-open" || frame === "q1-selected") return { question: questions[0], selected: frame.endsWith("selected") };
  if (frame === "q2-open" || frame === "q2-selected") return { question: questions[1], selected: frame.endsWith("selected") };
  if (frame === "q3-open" || frame === "q3-selected") return { question: questions[2], selected: frame.endsWith("selected") };
  return null;
}

function reportOffset(frame: Frame) {
  switch (frame) {
    case "report-cover":
      return 0;
    case "report-profile":
      return -260;
    case "report-instruction":
      return -560;
    case "report-prompts":
      return -860;
    case "report-final":
      return -1160;
    default:
      return 0;
  }
}

export default function ReviewDemo() {
  const fixedFrame = getFrameFromQuery();
  const fixedFrameIndex = fixedFrame ? frames.indexOf(fixedFrame) : null;
  const [frameIndex, setFrameIndex] = useState(fixedFrameIndex ?? 0);
  const frame = frames[frameIndex] ?? "intro";
  const progress = Math.round(((frameIndex + 1) / frames.length) * 100);
  const questionFrame = useMemo(() => getQuestionFrame(frame), [frame]);
  const completedQuestions = Math.min(
    questions.length,
    frame.startsWith("q1") ? (frame.endsWith("selected") ? 1 : 0)
      : frame.startsWith("q2") ? (frame.endsWith("selected") ? 2 : 1)
        : frame.startsWith("q3") ? (frame.endsWith("selected") ? 3 : 2)
          : frame === "intro" ? 0 : 3,
  );

  useEffect(() => {
    if (fixedFrameIndex !== null) return;
    const timer = window.setInterval(() => {
      setFrameIndex((current) => Math.min(current + 1, frames.length - 1));
    }, 2600);
    return () => window.clearInterval(timer);
  }, [fixedFrameIndex]);

  return (
    <div dir="ltr" className="min-h-screen overflow-hidden bg-[#050817] text-slate-50">
      <div className="mx-auto flex h-screen w-full max-w-[1780px] flex-col px-10 py-8">
        <header className="mb-6 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-500/15 text-rose-100">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <p className="text-2xl font-black tracking-wide text-white">INSPIRE Framework</p>
              <p className="text-sm font-semibold text-slate-400">Self-serve digital assessment and personalized AI instructions</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/80 px-6 py-4 text-right">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Current product step</p>
            <p className="mt-1 text-xl font-black text-white">{getStep(frame)}</p>
          </div>
        </header>

        <div className="mb-6 overflow-hidden rounded-full border border-slate-700 bg-slate-950">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <main className="grid min-h-0 flex-1 gap-7 lg:grid-cols-[0.37fr_0.63fr]">
          <aside className="rounded-[28px] border border-slate-700 bg-slate-950/75 p-7 shadow-2xl shadow-black/30">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-200">Assessment context</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-white">
              AI productivity workflow for GCC professionals
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              The user completes a guided assessment. INSPIRE converts their choices into a personalized digital report and reusable AI instructions.
            </p>

            <div className="mt-8 space-y-4">
              {[
                ["Product", "Full INSPIRE report"],
                ["Delivery", "Digital report after online assessment"],
                ["Output", "Personalized instructions, AI roles, prompt starters, and copy-ready instructions"],
                ["Payment status", "Lemon Squeezy review stage; no live checkout in this demo"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                  <p className="mt-2 text-base font-bold leading-7 text-slate-100">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {questions.map((question) => (
                <div
                  key={question.number}
                  className={`rounded-2xl border p-4 text-center ${
                    completedQuestions >= question.number
                      ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-100"
                      : "border-slate-800 bg-slate-900/60 text-slate-400"
                  }`}
                >
                  <p className="text-2xl font-black">{completedQuestions >= question.number ? <Check className="mx-auto h-7 w-7" /> : question.number}</p>
                  <p className="mt-2 text-xs font-bold">Question {question.number}</p>
                </div>
              ))}
            </div>
          </aside>

          <section className="min-h-0 rounded-[28px] border border-slate-700 bg-slate-950/75 p-7 shadow-2xl shadow-black/30">
            {frame === "intro" && (
              <div className="flex h-full flex-col justify-center">
                <div className="mb-7 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/15 text-orange-200">
                  <MousePointerClick className="h-10 w-10" />
                </div>
                <h2 className="text-5xl font-black leading-tight text-white">Start the assessment</h2>
                <p className="mt-5 max-w-4xl text-2xl leading-10 text-slate-300">
                  The demo below shows the actual product logic: answer structured questions, submit the assessment, generate the report, then review the complete digital output.
                </p>
                <div className="mt-10 grid gap-5 sm:grid-cols-3">
                  {["Answer questions", "Generate report", "Use instructions"].map((item, index) => (
                    <div key={item} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                      <p className="text-4xl font-black text-rose-200">0{index + 1}</p>
                      <p className="mt-4 text-xl font-black text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {questionFrame && (
              <div className="flex h-full flex-col">
                <div className="mb-6 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-base font-bold uppercase tracking-[0.18em] text-rose-200">Question {questionFrame.question.number} of 3</p>
                    <h2 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-white">{questionFrame.question.title}</h2>
                  </div>
                  <div className="rounded-full border border-slate-700 px-5 py-3 text-lg font-black text-slate-100">
                    {completedQuestions}/3 answered
                  </div>
                </div>

                <div className="grid gap-5">
                  {questionFrame.question.options.map((option, index) => {
                    const selected = questionFrame.selected && index === questionFrame.question.selected;
                    return (
                      <div
                        key={option}
                        className={`relative rounded-3xl border p-6 transition ${
                          selected
                            ? "border-rose-300/60 bg-rose-500/18 shadow-2xl shadow-rose-950/30"
                            : "border-slate-800 bg-slate-900/65"
                        }`}
                      >
                        <div className="flex items-start gap-5">
                          <div
                            className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-black ${
                              selected ? "border-rose-200 bg-rose-400 text-slate-950" : "border-slate-600 text-slate-400"
                            }`}
                          >
                            {selected ? <Check className="h-5 w-5" /> : String.fromCharCode(65 + index)}
                          </div>
                          <p className={`text-2xl font-bold leading-9 ${selected ? "text-white" : "text-slate-200"}`}>{option}</p>
                        </div>
                        {selected && (
                          <div className="absolute -right-4 -top-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-base font-black text-slate-950 shadow-xl">
                            <MousePointerClick className="h-5 w-5 text-rose-500" />
                            Selected
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {questionFrame.selected && (
                  <div className="mt-6 rounded-3xl border border-emerald-300/25 bg-emerald-500/10 p-6">
                    <div className="flex items-start gap-4">
                      <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-emerald-200" />
                      <div>
                        <p className="text-lg font-black text-emerald-100">Signal captured</p>
                        <p className="mt-2 text-xl leading-8 text-emerald-50/90">{questionFrame.question.signal}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {frame === "processing" && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[32px] border border-rose-300/25 bg-rose-500/12">
                  <Loader2 className="h-14 w-14 animate-spin text-rose-200" />
                </div>
                <h2 className="text-5xl font-black leading-tight text-white">Generating the personalized report</h2>
                <p className="mt-5 max-w-4xl text-2xl leading-10 text-slate-300">
                  INSPIRE combines the user's answers, project context, decision signals, and report structure into complete personalized AI instructions.
                </p>
                <div className="mt-10 grid w-full max-w-5xl gap-5 sm:grid-cols-3">
                  {["Assessment answers", "INSPIRE logic", "Report sections"].map((item) => (
                    <div key={item} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-xl font-black text-slate-100">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {frame.startsWith("report") && (
              <div className="flex h-full flex-col">
                <div className="mb-5 flex items-center justify-between gap-5">
                  <div>
                    <p className="text-base font-bold uppercase tracking-[0.18em] text-emerald-200">Generated report</p>
                    <h2 className="mt-2 text-4xl font-black text-white">Full digital output</h2>
                  </div>
                  <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-3 text-base font-black text-slate-100">
                      <Copy className="h-5 w-5" />
                      Copy
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-base font-black text-white">
                      <Download className="h-5 w-5" />
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">
                  <div
                    className="absolute inset-x-0 top-0 p-7 transition-transform duration-700"
                    style={{ transform: `translateY(${reportOffset(frame)}px)` }}
                  >
                    <div className="mb-7 rounded-3xl border border-rose-300/20 bg-rose-500/10 p-7">
                      <div className="flex items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-100">
                          <FileText className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-200">INSPIRE report</p>
                          <h3 className="mt-2 text-4xl font-black text-white">AI Productivity Workflow</h3>
                          <p className="mt-3 max-w-4xl text-xl leading-8 text-slate-300">
                            Personalized AI instructions, generated from the user's assessment answers and work context.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {reportSections.map((section) => (
                        <article key={section.title} className="rounded-3xl border border-slate-700 bg-slate-950/70 p-7">
                          <div className="flex items-start gap-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-200">
                              <span className="text-xl font-black">{section.eyebrow}</span>
                            </div>
                            <div>
                              <h3 className="text-3xl font-black text-white">{section.title}</h3>
                              <p className="mt-3 whitespace-pre-line text-xl leading-9 text-slate-300">{section.body}</p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="mt-5 rounded-3xl border border-emerald-300/25 bg-emerald-500/10 p-7 text-center">
                      <Check className="mx-auto h-10 w-10 text-emerald-200" />
                      <p className="mt-3 text-3xl font-black text-white">End of report</p>
                      <p className="mt-2 text-xl text-slate-300">The customer can copy instructions, download the report, or reuse the instructions with AI tools.</p>
                    </div>
                  </div>

                  {frame !== "report-final" && (
                    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-base font-black text-slate-100 shadow-xl">
                      <ChevronDown className="h-5 w-5 text-rose-200" />
                      Scrolling through the report
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
