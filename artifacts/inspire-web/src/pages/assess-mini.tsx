import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  Zap,
  MessageSquare,
} from "lucide-react";
import { useI18n, type Locale } from "@/i18n";

// ─── MINI SCENARIOS (indices 0,1,2,5,6 from full list) ──────

const MINI_SCENARIOS = [
  {
    idx: 0,
    dimension: { ar: "العمق / السرعة", en: "Depth / speed" },
    question: {
      ar: "عندما تعمل مع الذكاء الاصطناعي، هل تفضل أن يُعطيك الحل مباشرة وبسرعة؟ أم تفضل أن يشرح التفكير والمنطق معك خطوة بخطوة؟",
      en: "When working with AI, do you prefer a direct fast answer, or do you prefer it to explain the reasoning step by step?",
    },
    optionA: { ar: "أريد الحل مباشرة وبسرعة دون تفاصيل زائدة", en: "I want the answer directly and quickly without extra detail" },
    optionB: { ar: "أفضل الشرح خطوة بخطوة مع المنطق الكامل", en: "I prefer step-by-step explanation with the full reasoning" },
  },
  {
    idx: 1,
    dimension: { ar: "القيادة / التنفيذ", en: "Leadership / execution" },
    question: {
      ar: "عند استخدام الذكاء الاصطناعي في مشروع، هل تفضل أن تقود أنت الحوار وتوجّهه؟ أم تترك للذكاء الاصطناعي المبادرة باقتراح الخطوات؟",
      en: "When using AI in a project, do you prefer to lead and direct the conversation, or let AI take initiative and suggest next steps?",
    },
    optionA: { ar: "أقود أنا الحوار وأحدد الاتجاه بنفسي", en: "I lead the conversation and set the direction myself" },
    optionB: { ar: "أترك للذكاء الاصطناعي المبادرة واقتراح الخطوات", en: "I let AI take initiative and suggest the steps" },
  },
  {
    idx: 2,
    dimension: { ar: "التحدي / التأكيد", en: "Challenge / affirmation" },
    question: {
      ar: "عندما تطرح فكرة على الذكاء الاصطناعي، ماذا تريد منه؟ أن يتحداها ويكشف نقاط ضعفها؟ أم أن يدعمها ويساعدك على تطويرها؟",
      en: "When you share an idea with AI, what do you want from it: challenge it and reveal weaknesses, or support and develop it?",
    },
    optionA: { ar: "أريده أن يتحدى فكرتي ويكشف نقاط ضعفها", en: "I want it to challenge my idea and expose weaknesses" },
    optionB: { ar: "أريده أن يدعم فكرتي ويساعدني على تطويرها", en: "I want it to support my idea and help develop it" },
  },
  {
    idx: 5,
    dimension: { ar: "الاستقلالية / الاتكاء", en: "Independence / reliance" },
    question: {
      ar: "كيف تصف علاقتك المثالية مع الذكاء الاصطناعي؟ أداة تستخدمها عند الحاجة؟ أم شريك دائم تعتمد عليه؟",
      en: "How would you describe your ideal relationship with AI: a tool you use when needed, or an always-on partner you rely on?",
    },
    optionA: { ar: "أداة أستخدمها عند الحاجة فقط وأعتمد على نفسي", en: "A tool I use only when needed while relying on myself" },
    optionB: { ar: "شريك دائم أعتمد عليه في معظم مهامي", en: "An always-on partner I rely on for most tasks" },
  },
  {
    idx: 6,
    dimension: { ar: "تحمل الغموض", en: "Ambiguity tolerance" },
    question: {
      ar: "عندما تطرح سؤالاً ليس له إجابة واضحة، كيف تريد الذكاء الاصطناعي أن يتعامل معه؟",
      en: "When you ask a question with no clear answer, how do you want AI to handle it?",
    },
    optionA: { ar: "يُقر بالغموض ويعطيني خيارات وجوانب متعددة", en: "Acknowledge ambiguity and give me multiple options and angles" },
    optionB: { ar: "يختار أفضل إجابة ويُقدمها بثقة حتى لو لم تكن مثالية", en: "Choose the best answer and present it confidently even if imperfect" },
  },
];

function localized(value: Record<Locale, string>, locale: Locale) {
  return value[locale];
}

// Steps: 0 = setup, 1 = scenarios, 2 = open question
const TOTAL_STEPS = 3;

function apiUrl(path: string) {
  return `/api${path}`;
}

export default function AssessMini() {
  const { user, isLoading } = useAuth();
  const { dir, locale, t } = useI18n();
  const [, navigate] = useLocation();

  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [reportLanguage, setReportLanguage] = useState<"ar" | "en" | "both">(() => locale);
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<number, "a" | "b">>({});
  const [openAnswer, setOpenAnswer] = useState("");
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;

  const progress = Math.round((step / (TOTAL_STEPS - 1)) * 100);

  async function handleStart() {
    if (!projectName.trim() || !projectGoal.trim()) {
      setError(t("miniAssessment.requiredFieldsError"));
      return;
    }
    setError(null);
    try {
      const res = await fetch(apiUrl("/assessments/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName,
          project_goal: projectGoal,
          domain: "Other",
          custom_domain: "General AI assistance",
          project_context: `${projectName}: ${projectGoal}`,
          report_language: reportLanguage,
          assessment_type: "mini",
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? t("miniAssessment.startFailed"));
      setAssessmentId(data.assessmentId);
      setStep(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("miniAssessment.startFailed"));
    }
  }

  function handleScenarioAnswer(scenarioIdx: number, choice: "a" | "b") {
    setScenarioAnswers((prev) => ({ ...prev, [scenarioIdx]: choice }));
  }

  const allScenariosAnswered = MINI_SCENARIOS.every((s) => scenarioAnswers[s.idx] !== undefined);

  async function handleSubmit() {
    if (!openAnswer.trim()) { setError(t("miniAssessment.openAnswerRequiredError")); return; }
    if (!assessmentId) return;
    setSubmitting(true);
    setError(null);
    try {
      const scenarioArr = MINI_SCENARIOS.map((s) => ({
        scenario_index: s.idx,
        choice: scenarioAnswers[s.idx]!,
      }));
      const res = await fetch(apiUrl(`/assessments/${assessmentId}/submit`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          behavioral_answers: [],
          scenario_answers: scenarioArr,
          open_answer: openAnswer,
          completion_time_seconds: 300,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? t("miniAssessment.submitFailed"));
      navigate(`/results/${assessmentId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("miniAssessment.submitFailed"));
      setSubmitting(false);
    }
  }

  return (
    <div dir={dir} className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-4">
            <Zap className="h-4 w-4" />
            {t("miniAssessment.badge")}
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">{t("miniAssessment.title")}</h1>
          <p className="text-muted-foreground">{t("miniAssessment.subtitle")}</p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full bg-secondary rounded-full h-1.5 mb-8">
          <motion.div
            className="h-1.5 rounded-full bg-gradient-to-l from-accent to-accent/60"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* ─── STEP 0: Setup ──────────────────────────────── */}
          {step === 0 && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-xl font-bold mb-6 text-primary">{t("miniAssessment.setupTitle")}</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("miniAssessment.projectNameLabel")} <span className="text-destructive">*</span></label>
                  <input
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder={t("miniAssessment.projectNamePlaceholder")}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("miniAssessment.projectGoalLabel")} <span className="text-destructive">*</span></label>
                  <textarea
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                    placeholder={t("miniAssessment.projectGoalPlaceholder")}
                    rows={3}
                    value={projectGoal}
                    onChange={(e) => setProjectGoal(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("miniAssessment.reportLanguageLabel")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "ar", label: t("miniAssessment.reportLanguageArabic") },
                      { value: "en", label: t("miniAssessment.reportLanguageEnglish") },
                      { value: "both", label: t("miniAssessment.reportLanguageBoth") },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setReportLanguage(opt.value as "ar" | "en" | "both")}
                        className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          reportLanguage === opt.value
                            ? "bg-accent text-accent-foreground border-accent shadow-sm"
                            : "bg-background border-border hover:border-accent/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {error && <p className="text-destructive text-sm mt-4">{error}</p>}
              <button
                onClick={handleStart}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-accent/20"
              >
                {t("miniAssessment.startButton")}
                <ChevronLeft className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 1: Scenarios ──────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-5"
            >
              <h2 className="text-lg font-bold text-primary mb-2">
                {t("miniAssessment.scenariosTitle")}
              </h2>
              {MINI_SCENARIOS.map((s, i) => (
                <div key={s.idx} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 bg-accent/10 text-accent rounded-full">{localized(s.dimension, locale)}</span>
                    <span className="text-xs text-muted-foreground">{i + 1} / {MINI_SCENARIOS.length}</span>
                  </div>
                  <p className="text-sm font-medium mb-4 leading-relaxed">{localized(s.question, locale)}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { choice: "a" as const, label: localized(s.optionA, locale) },
                      { choice: "b" as const, label: localized(s.optionB, locale) },
                    ].map(({ choice, label }) => (
                      <button
                        key={choice}
                        onClick={() => handleScenarioAnswer(s.idx, choice)}
                        className={`text-start p-4 rounded-xl border text-sm transition-all ${
                          scenarioAnswers[s.idx] === choice
                            ? "bg-accent/10 border-accent text-accent font-medium"
                            : "bg-background border-border hover:border-accent/40"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:border-primary/30 text-sm transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                  {t("miniAssessment.backButton")}
                </button>
                <button
                  onClick={() => allScenariosAnswered && setStep(2)}
                  disabled={!allScenariosAnswered}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    allScenariosAnswered
                      ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {t("miniAssessment.nextButton")}
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: Open question + Submit ─────────────── */}
          {step === 2 && (
            <motion.div
              key="open"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold text-primary">{t("miniAssessment.finalTitle")}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {t("miniAssessment.finalDescription")}
              </p>
              <textarea
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                placeholder={t("miniAssessment.finalPlaceholder")}
                rows={5}
                value={openAnswer}
                onChange={(e) => setOpenAnswer(e.target.value)}
              />
              {error && <p className="text-destructive text-sm mt-3">{error}</p>}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:border-primary/30 text-sm transition-all"
                  disabled={submitting}
                >
                  <ChevronRight className="h-4 w-4" />
                  {t("miniAssessment.backButton")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !openAnswer.trim()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    submitting || !openAnswer.trim()
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
                  }`}
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> {t("miniAssessment.generating")}</>
                  ) : (
                    <>{t("miniAssessment.submitButton")}<Zap className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
