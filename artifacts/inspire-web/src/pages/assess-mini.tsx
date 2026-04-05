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

// ─── MINI SCENARIOS (indices 0,1,2,5,6 from full list) ──────

const MINI_SCENARIOS = [
  { idx: 0, dimension_ar: "العمق / السرعة", question: "عندما تعمل مع الذكاء الاصطناعي، هل تفضل أن يُعطيك الحل مباشرة وبسرعة؟ أم تفضل أن يشرح التفكير والمنطق معك خطوة بخطوة؟", option_a: "أريد الحل مباشرة وبسرعة دون تفاصيل زائدة", option_b: "أفضل الشرح خطوة بخطوة مع المنطق الكامل" },
  { idx: 1, dimension_ar: "القيادة / التنفيذ", question: "عند استخدام الذكاء الاصطناعي في مشروع، هل تفضل أن تقود أنت الحوار وتوجّهه؟ أم تترك للذكاء الاصطناعي المبادرة باقتراح الخطوات؟", option_a: "أقود أنا الحوار وأحدد الاتجاه بنفسي", option_b: "أترك للذكاء الاصطناعي المبادرة واقتراح الخطوات" },
  { idx: 2, dimension_ar: "التحدي / التأكيد", question: "عندما تطرح فكرة على الذكاء الاصطناعي، ماذا تريد منه؟ أن يتحداها ويكشف نقاط ضعفها؟ أم أن يدعمها ويساعدك على تطويرها؟", option_a: "أريده أن يتحدى فكرتي ويكشف نقاط ضعفها", option_b: "أريده أن يدعم فكرتي ويساعدني على تطويرها" },
  { idx: 5, dimension_ar: "الاستقلالية / الاتكاء", question: "كيف تصف علاقتك المثالية مع الذكاء الاصطناعي؟ أداة تستخدمها عند الحاجة؟ أم شريك دائم تعتمد عليه؟", option_a: "أداة أستخدمها عند الحاجة فقط وأعتمد على نفسي", option_b: "شريك دائم أعتمد عليه في معظم مهامي" },
  { idx: 6, dimension_ar: "تحمل الغموض", question: "عندما تطرح سؤالاً ليس له إجابة واضحة، كيف تريد الذكاء الاصطناعي أن يتعامل معه؟", option_a: "يُقر بالغموض ويعطيني خيارات وجوانب متعددة", option_b: "يختار أفضل إجابة ويُقدمها بثقة حتى لو لم تكن مثالية" },
];

// Steps: 0 = setup, 1 = scenarios, 2 = open question
const TOTAL_STEPS = 3;

function apiUrl(path: string) {
  return `/api${path}`;
}

export default function AssessMini() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [reportLanguage, setReportLanguage] = useState<"ar" | "en" | "both">("ar");
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
      setError("يرجى ملء جميع الحقول");
      return;
    }
    setError(null);
    try {
      const res = await fetch(apiUrl("/assessments/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, project_goal: projectGoal, report_language: reportLanguage, assessment_type: "mini" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "فشل في البدء");
      setAssessmentId(data.assessmentId);
      setStep(1);
    } catch (e: any) {
      setError(e.message);
    }
  }

  function handleScenarioAnswer(scenarioIdx: number, choice: "a" | "b") {
    setScenarioAnswers((prev) => ({ ...prev, [scenarioIdx]: choice }));
  }

  const allScenariosAnswered = MINI_SCENARIOS.every((s) => scenarioAnswers[s.idx] !== undefined);

  async function handleSubmit() {
    if (!openAnswer.trim()) { setError("يرجى كتابة إجابة"); return; }
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
      if (!data.success) throw new Error(data.error ?? "فشل الإرسال");
      navigate(`/results/${assessmentId}`);
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-4">
            <Zap className="h-4 w-4" />
            النسخة السريعة — 5 دقائق فقط
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">تقييم سريع</h1>
          <p className="text-muted-foreground">5 سيناريوهات فقط لتوليد نقاط انطلاقك مع الذكاء الاصطناعي</p>
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
              <h2 className="text-xl font-bold mb-6 text-primary">بداية سريعة</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">اسم المشروع <span className="text-destructive">*</span></label>
                  <input
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="مثال: تطوير منتج جديد"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">هدف المشروع <span className="text-destructive">*</span></label>
                  <textarea
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                    placeholder="صف هدفك الرئيسي من هذا المشروع..."
                    rows={3}
                    value={projectGoal}
                    onChange={(e) => setProjectGoal(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">لغة التقرير</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "ar", label: "عربي" },
                      { value: "en", label: "English" },
                      { value: "both", label: "كلاهما" },
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
                ابدأ الآن
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
                كيف تتفاعل مع الذكاء الاصطناعي؟
              </h2>
              {MINI_SCENARIOS.map((s, i) => (
                <div key={s.idx} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 bg-accent/10 text-accent rounded-full">{s.dimension_ar}</span>
                    <span className="text-xs text-muted-foreground">{i + 1} / {MINI_SCENARIOS.length}</span>
                  </div>
                  <p className="text-sm font-medium mb-4 leading-relaxed">{s.question}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { choice: "a" as const, label: s.option_a },
                      { choice: "b" as const, label: s.option_b },
                    ].map(({ choice, label }) => (
                      <button
                        key={choice}
                        onClick={() => handleScenarioAnswer(s.idx, choice)}
                        className={`text-right p-4 rounded-xl border text-sm transition-all ${
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
                  السابق
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
                  التالي
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
                <h2 className="text-xl font-bold text-primary">سؤال أخير</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                ما الشيء الذي تتمنى أن يفهمه الذكاء الاصطناعي عنك بشكل أفضل؟
              </p>
              <textarea
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                placeholder="اكتب إجابتك هنا..."
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
                  السابق
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
                    <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ التوليد...</>
                  ) : (
                    <>توليد نقاط الانطلاق<Zap className="h-4 w-4" /></>
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
