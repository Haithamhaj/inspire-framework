import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ClipboardList,
  Brain,
  MessageSquare,
  Zap,
  Clock,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────

const AXES = [
  { key: "Intention", ar: "النية والهدف", letter: "I", color: "from-violet-500 to-purple-600" },
  { key: "Narrative", ar: "السرد والتواصل", letter: "N", color: "from-blue-500 to-indigo-600" },
  { key: "Style", ar: "الأسلوب المعرفي", letter: "S", color: "from-cyan-500 to-blue-600" },
  { key: "Preferences", ar: "التفضيلات البيئية", letter: "P", color: "from-emerald-500 to-green-600" },
  { key: "Interaction", ar: "التفاعل والتعاون", letter: "I", color: "from-yellow-500 to-orange-600" },
  { key: "Reflection", ar: "التفكير والتأمل", letter: "R", color: "from-rose-500 to-red-600" },
  { key: "Evaluation", ar: "التقييم والجودة", letter: "E", color: "from-pink-500 to-fuchsia-600" },
];

const BEHAVIORAL_QUESTIONS = [
  // Intention — 3 questions (indices 0-2)
  {
    axis: "Intention",
    textAr: "عندما تبدأ مشروعاً جديداً، ما الذي يحفزك أكثر؟",
    options: [
      "تحقيق هدف واضح ومحدد",
      "استكشاف إمكانيات جديدة غير محددة",
      "المساهمة في فريق أو مجتمع",
      "تطوير مهاراتي الشخصية",
    ],
  },
  {
    axis: "Intention",
    textAr: "كيف تحدد الأولويات عند مواجهة مهام متعددة؟",
    options: [
      "حسب الأهمية والتأثير الاستراتيجي",
      "حسب ترتيب الورود والإلحاح",
      "حسب ما يثير اهتمامي أكثر",
      "حسب ما يرضي الآخرين ويفيدهم",
    ],
  },
  {
    axis: "Intention",
    textAr: "ما الذي يجعلك تشعر أن عملك ناجح حقاً؟",
    options: [
      "تحقيق الأهداف المرسومة بدقة",
      "الحصول على تقدير وإشادة من الآخرين",
      "تعلم شيء جديد من التجربة",
      "إحداث تأثير إيجابي ملموس",
    ],
  },
  // Narrative — 3 questions (indices 3-5)
  {
    axis: "Narrative",
    textAr: "كيف تفضل تلقي المعلومات الجديدة؟",
    options: [
      "ملخص موجز ونقاط رئيسية",
      "شرح مفصل مع أمثلة",
      "تصور بصري أو مخطط",
      "نقاش وحوار تفاعلي",
    ],
  },
  {
    axis: "Narrative",
    textAr: "عندما تشرح فكرة معقدة، كيف تبدأ عادةً؟",
    options: [
      "من الصورة الكبيرة ثم التفاصيل",
      "من التفاصيل وصولاً للصورة الكاملة",
      "بضرب مثال واقعي أولاً",
      "بطرح أسئلة لفهم ما يعرفه المستمع",
    ],
  },
  {
    axis: "Narrative",
    textAr: "ما الأسلوب الذي تفضله في التواصل المهني؟",
    options: [
      "رسمي ومنظم",
      "ودي ومباشر",
      "تحليلي وموضوعي",
      "قصصي وإلهامي",
    ],
  },
  // Style — 3 questions (indices 6-8)
  {
    axis: "Style",
    textAr: "كيف تتعامل مع مشكلة غير متوقعة في العمل؟",
    options: [
      "أتوقف وأخطط بشكل منظم قبل التصرف",
      "أتصرف فوراً ثم أعدل المسار لاحقاً",
      "أبحث عمن يمكن أن يساعدني",
      "أفكر في بدائل إبداعية خارج الصندوق",
    ],
  },
  {
    axis: "Style",
    textAr: "ما طبيعة بيئة العمل المثالية لك؟",
    options: [
      "هادئة ومنظمة مع حدود واضحة",
      "ديناميكية ومتغيرة باستمرار",
      "تعاونية وإنسانية",
      "مستقلة تمنحني حرية القرار",
    ],
  },
  {
    axis: "Style",
    textAr: "كيف تتعامل مع التغيير المفاجئ في الخطط؟",
    options: [
      "يزعجني وأحتاج وقتاً للتكيف",
      "أتقبله وأتكيف بسرعة",
      "أنظر إليه كفرصة جديدة",
      "أحاول إعادة الخطط الأصلية",
    ],
  },
  // Preferences — 3 questions (indices 9-11)
  {
    axis: "Preferences",
    textAr: "كم عدد المهام التي تفضل العمل عليها في وقت واحد؟",
    options: [
      "مهمة واحدة حتى أُكملها",
      "مهمتان أو ثلاث بشكل متوازٍ",
      "أُفضل تعدد المهام والتنويع",
      "يعتمد على نوع المهمة",
    ],
  },
  {
    axis: "Preferences",
    textAr: "ما الذي يساعدك أكثر على الإنتاجية؟",
    options: [
      "جدول واضح ومواعيد نهائية",
      "حرية في إدارة وقتي",
      "العمل مع فريق",
      "أهداف طموحة تُحفزني",
    ],
  },
  {
    axis: "Preferences",
    textAr: "كيف تفضل اتخاذ القرارات المهمة؟",
    options: [
      "بعد جمع بيانات وتحليل كامل",
      "بناءً على خبرتي وحدسي",
      "بعد التشاور مع المعنيين",
      "بتجربة الخيار الأقل خطراً أولاً",
    ],
  },
  // Interaction — 3 questions (indices 12-14)
  {
    axis: "Interaction",
    textAr: "ما دورك المفضل في فريق العمل؟",
    options: [
      "القائد الذي يحدد الاتجاه",
      "المنفذ الذي يُنجز المهام",
      "الوسيط الذي يُوحّد الآراء",
      "المفكر الاستراتيجي",
    ],
  },
  {
    axis: "Interaction",
    textAr: "كيف تتعامل مع الخلاف في الرأي في العمل؟",
    options: [
      "أُفضل النقاش المباشر لحل الأمر فوراً",
      "أبحث عن أرضية مشتركة",
      "أتراجع وأُعيد تقييم موقفي",
      "أتجنب الجدال وأُركز على العمل",
    ],
  },
  {
    axis: "Interaction",
    textAr: "ما الذي يُعزز ثقتك بشخص تعمل معه؟",
    options: [
      "الكفاءة والاحترافية العالية",
      "الصدق والشفافية",
      "الالتزام بالمواعيد والوعود",
      "الدعم والاهتمام بالفريق",
    ],
  },
  // Reflection — 3 questions (indices 15-17)
  {
    axis: "Reflection",
    textAr: "كيف تتعلم أفضل من تجاربك السابقة؟",
    options: [
      "بمراجعة ما حدث وتحليله بشكل منهجي",
      "بالتجربة والخطأ المستمر",
      "بالحوار مع من مروا بتجارب مماثلة",
      "بالقراءة والبحث في الموضوع",
    ],
  },
  {
    axis: "Reflection",
    textAr: "ما مدى وضوح نقاط قوتك وضعفك في عملك؟",
    options: [
      "أعرفها بشكل واضح وجلي",
      "أعرف قوتي لكن ضعفي أقل وضوحاً",
      "أحتاج لتغذية راجعة من الآخرين",
      "أكتشفها تدريجياً عبر التجارب",
    ],
  },
  {
    axis: "Reflection",
    textAr: "ما موقفك من الأخطاء التي ترتكبها؟",
    options: [
      "أتعلم منها وأتجاوزها بسرعة",
      "أُحلّلها بعمق لتجنب تكرارها",
      "أُحاسب نفسي بشدة أحياناً",
      "أعتبرها جزءاً طبيعياً من المسيرة",
    ],
  },
  // Evaluation — 3 questions (indices 18-20)
  {
    axis: "Evaluation",
    textAr: "ما معيارك لقياس جودة العمل؟",
    options: [
      "المعايير الموضوعية والمقاييس الدقيقة",
      "مدى رضا المستخدم أو العميل",
      "مقارنة النتائج بالأهداف المحددة",
      "إحساسي الشخصي بالجودة",
    ],
  },
  {
    axis: "Evaluation",
    textAr: "كيف تتعامل مع النقد على عملك؟",
    options: [
      "أُقيّمه بموضوعية وآخذ ما يفيدني",
      "أُحلله بدقة للتأكد من صحته",
      "يؤثر عليّ عاطفياً في البداية",
      "أُبدي دفاعاً إذا كنت مقتنعاً بعملي",
    ],
  },
  {
    axis: "Evaluation",
    textAr: "ما مستوى المخاطرة الذي تقبله في القرارات؟",
    options: [
      "أُفضل الأمان وتجنب المخاطر",
      "أقبل مخاطر محسوبة ومدروسة",
      "أُحب التجريب ولو بمخاطر عالية",
      "يعتمد على السياق والظروف",
    ],
  },
  // Remaining 4 questions spread across axes (indices 21-23)
  {
    axis: "Intention",
    textAr: "كيف تستجيب عندما تُكلَّف بمهمة لا تُحبها؟",
    options: [
      "أُكملها بمهنية عالية رغم ذلك",
      "أبحث عن طريقة تجعلها أكثر إثارة",
      "أُفاوض على تعديلها أو تفويضها",
      "أُنجزها أولاً ثم أُعبّر عن رأيي",
    ],
  },
  {
    axis: "Reflection",
    textAr: "ما الذي تبحث عنه في التغذية الراجعة؟",
    options: [
      "نقاط تحسين محددة وقابلة للتطبيق",
      "تحقق من اتجاهي الصحيح",
      "إشادة بما أحسنت فيه",
      "رؤية شاملة لأدائي العام",
    ],
  },
  {
    axis: "Evaluation",
    textAr: "عند انتهاء مشروع ما، ما أول شيء تفعله؟",
    options: [
      "أُوثّق الدروس المستفادة",
      "أُقيّم النتائج بموضوعية",
      "أحتفل وأُكافئ الفريق",
      "أبدأ التخطيط للمشروع التالي",
    ],
  },
];

const SCENARIOS = [
  {
    dimension_ar: "العمق / السرعة",
    question: "عندما تعمل مع الذكاء الاصطناعي، هل تفضل أن يُعطيك الحل مباشرة وبسرعة؟ أم تفضل أن يشرح التفكير والمنطق معك خطوة بخطوة؟",
    option_a: "أريد الحل مباشرة وبسرعة دون تفاصيل زائدة",
    option_b: "أفضل الشرح خطوة بخطوة مع المنطق الكامل",
  },
  {
    dimension_ar: "القيادة / التنفيذ",
    question: "عند استخدام الذكاء الاصطناعي في مشروع، هل تفضل أن تقود أنت الحوار وتوجّهه؟ أم تترك للذكاء الاصطناعي المبادرة باقتراح الخطوات؟",
    option_a: "أقود أنا الحوار وأحدد الاتجاه بنفسي",
    option_b: "أترك للذكاء الاصطناعي المبادرة واقتراح الخطوات",
  },
  {
    dimension_ar: "التحدي / التأكيد",
    question: "عندما تطرح فكرة على الذكاء الاصطناعي، ماذا تريد منه؟ أن يتحداها ويكشف نقاط ضعفها؟ أم أن يدعمها ويساعدك على تطويرها؟",
    option_a: "أريده أن يتحدى فكرتي ويكشف نقاط ضعفها",
    option_b: "أريده أن يدعم فكرتي ويساعدني على تطويرها",
  },
  {
    dimension_ar: "الخطية / التشعب",
    question: "كيف تفضل أن يسير حوارك مع الذكاء الاصطناعي؟ خطياً ومنظماً؟ أم بشكل متشعب تستكشف فيه أفكاراً متعددة؟",
    option_a: "خطياً ومنظماً من البداية للنهاية",
    option_b: "متشعباً أستكشف فيه أفكاراً متعددة في آنٍ واحد",
  },
  {
    dimension_ar: "التعلم / الإنجاز",
    question: "عند استخدامك للذكاء الاصطناعي، ما الذي يهمك أكثر: أن تفهم وتتعلم من العملية؟ أم أن تُنجز المهمة بأسرع وقت؟",
    option_a: "أن أفهم وأتعلم من العملية نفسها",
    option_b: "أن أُنجز المهمة وأحصل على النتيجة بأسرع وقت",
  },
  {
    dimension_ar: "الاستقلالية / الاتكاء",
    question: "كيف تصف علاقتك المثالية مع الذكاء الاصطناعي؟ أداة تستخدمها عند الحاجة؟ أم شريك دائم تعتمد عليه؟",
    option_a: "أداة أستخدمها عند الحاجة فقط وأعتمد على نفسي",
    option_b: "شريك دائم أعتمد عليه في معظم مهامي",
  },
  {
    dimension_ar: "تحمل الغموض",
    question: "عندما تطرح سؤالاً ليس له إجابة واضحة، كيف تريد الذكاء الاصطناعي أن يتعامل معه؟",
    option_a: "يُقر بالغموض ويعطيني خيارات وجوانب متعددة",
    option_b: "يختار أفضل إجابة ويُقدمها بثقة حتى لو لم تكن مثالية",
  },
  {
    dimension_ar: "السياق",
    question: "عند بدء محادثة جديدة مع الذكاء الاصطناعي، هل تفضل أن تشرح له السياق الكامل؟ أم تدخل مباشرة في الطلب؟",
    option_a: "أشرح السياق الكامل وأهدافي في البداية دائماً",
    option_b: "أدخل مباشرة في الطلب دون مقدمات",
  },
];

// ─── TYPES ────────────────────────────────────────────────

interface BehavioralAnswer {
  question_index: number;
  answer_index: number;
}

interface ScenarioAnswer {
  scenario_index: number;
  choice: "a" | "b";
}

// ─── HELPERS ──────────────────────────────────────────────

function apiUrl(path: string) {
  return `/api${path}`;
}

function getQuestionsByAxis(axis: string) {
  return BEHAVIORAL_QUESTIONS.map((q, i) => ({ ...q, index: i })).filter(
    (q) => q.axis === axis
  );
}

// ─── STEP COMPONENTS ──────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
        <span>الخطوة {step} من {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-l from-accent to-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      key="card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-10"
    >
      {children}
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────

const TOTAL_STEPS = 10;

export default function Assess() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Wizard state
  const [step, setStep] = useState(0); // 0=setup, 1-7=axes, 8=scenarios, 9=open
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [reportLanguage, setReportLanguage] = useState<"ar" | "en" | "both">("ar");
  const [assessmentType, setAssessmentType] = useState<"full" | "mini">("full");
  const [behavioralAnswers, setBehavioralAnswers] = useState<BehavioralAnswer[]>([]);
  const [scenarioAnswers, setScenarioAnswers] = useState<ScenarioAnswer[]>([]);
  const [openAnswer, setOpenAnswer] = useState("");

  // Assessment session
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<"wizard" | "processing" | "done" | "error">("wizard");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const startTime = useRef(Date.now());
  const [copied, setCopied] = useState(false);

  // Poll for status
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;

  // ── STEP 0: Project setup ──────────────────────────────

  async function handleSetupSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectName.trim() || !projectGoal.trim()) return;

    try {
      const res = await fetch(apiUrl("/assessments/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName.trim(),
          project_goal: projectGoal.trim(),
          report_language: reportLanguage,
          assessment_type: assessmentType,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to start");
      setAssessmentId(data.assessmentId);
      setStep(1);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // ── STEPS 1-7: Behavioral questions ───────────────────

  function handleBehavioralAnswer(questionIndex: number, answerIndex: number) {
    setBehavioralAnswers((prev) => {
      const next = prev.filter((a) => a.question_index !== questionIndex);
      return [...next, { question_index: questionIndex, answer_index: answerIndex }];
    });
  }

  function getAnswerFor(questionIndex: number) {
    return behavioralAnswers.find((a) => a.question_index === questionIndex)
      ?.answer_index ?? -1;
  }

  function currentAxisQuestions() {
    if (step < 1 || step > 7) return [];
    const axis = AXES[step - 1]?.key ?? "";
    return getQuestionsByAxis(axis);
  }

  function axisComplete() {
    return currentAxisQuestions().every((q) => getAnswerFor(q.index) >= 0);
  }

  // ── STEP 8: Scenarios ─────────────────────────────────

  function handleScenarioAnswer(scenarioIndex: number, choice: "a" | "b") {
    setScenarioAnswers((prev) => {
      const next = prev.filter((a) => a.scenario_index !== scenarioIndex);
      return [...next, { scenario_index: scenarioIndex, choice }];
    });
  }

  function getScenarioAnswer(scenarioIndex: number) {
    return scenarioAnswers.find((a) => a.scenario_index === scenarioIndex)?.choice ?? null;
  }

  function scenariosComplete() {
    return SCENARIOS.every((_, i) => getScenarioAnswer(i) !== null);
  }

  // ── STEP 9: Open answer + Submit ──────────────────────

  async function handleFinalSubmit() {
    if (!assessmentId || openAnswer.trim().length < 20) return;
    setSubmitting(true);
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);

    try {
      const res = await fetch(
        apiUrl(`/assessments/${assessmentId}/submit`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            behavioral_answers: behavioralAnswers,
            scenario_answers: scenarioAnswers,
            open_answer: openAnswer.trim(),
            completion_time_seconds: elapsed,
          }),
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Submit failed");
      setPhase("processing");
      startPolling();
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          apiUrl(`/assessments/${assessmentId}/status`)
        );
        const data = await res.json();
        if (!data.success) return;
        const a = data.assessment;
        if (a.status === "completed") {
          clearInterval(pollRef.current!);
          setResult(a);
          setPhase("done");
        } else if (a.status === "failed") {
          clearInterval(pollRef.current!);
          setError("فشلت عملية التحليل. يُرجى المحاولة مرة أخرى لاحقاً.");
          setPhase("error");
        }
      } catch {
        // silent - keep polling
      }
    }, 3000);
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── RENDER ─────────────────────────────────────────────

  if (phase === "processing") {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-20 animate-ping" />
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            INSPIRE يُحلّل نمطك
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            يجري الذكاء الاصطناعي تحليلاً عميقاً لإجاباتك عبر الأبعاد السبعة
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>يستغرق عادةً 30–60 ثانية</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-lg bg-card rounded-3xl border border-border p-10 shadow-xl">
          <p className="text-xl text-destructive mb-6">{error}</p>
          <button
            onClick={() => { setPhase("wizard"); setSubmitting(false); }}
            className="flex items-center gap-2 mx-auto bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold"
          >
            <RotateCcw className="h-4 w-4" />
            العودة للمحاولة مجدداً
          </button>
        </div>
      </div>
    );
  }

  if (phase === "done" && result) {
    return (
      <div className="min-h-[calc(100vh-5rem)] py-12 px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl space-y-6"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-300" />
            <h1 className="text-3xl font-display font-bold mb-2">
              تقريرك جاهز يا {user.name}!
            </h1>
            <p className="text-primary-foreground/80">
              تحليل INSPIRE الشخصي عبر 7 أبعاد سلوكية و8 أبعاد تفاعلية
            </p>
          </div>

          {/* Role Analysis */}
          {result.roleAnalysis && (
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display font-bold text-xl text-foreground mb-3 flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                نمطك السلوكي
              </h2>
              <p className="text-foreground leading-relaxed">{result.roleAnalysis}</p>
            </div>
          )}

          {/* INSPIRE Table */}
          {result.inspireTable && Array.isArray(result.inspireTable) && result.inspireTable.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 overflow-x-auto">
              <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-accent" />
                مؤشرات INSPIRE
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-right pb-2">البعد</th>
                    <th className="text-center pb-2">النسبة</th>
                    <th className="text-right pb-2">ملاحظة</th>
                  </tr>
                </thead>
                <tbody>
                  {result.inspireTable.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-2 font-medium text-foreground">{row.axis}</td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${row.percentage}%` }}
                            />
                          </div>
                          <span className="text-accent font-bold">{row.percentage}%</span>
                        </div>
                      </td>
                      <td className="py-2 text-muted-foreground">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Strengths */}
          {result.strengths && result.strengths.length > 0 && (
            <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
              <h2 className="font-display font-bold text-xl text-green-900 mb-3">نقاط القوة</h2>
              <ul className="space-y-2">
                {result.strengths.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-green-800">
                    <CheckCircle2 className="h-4 w-4 mt-1 shrink-0 text-green-600" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Red Lines */}
          {result.redLines && result.redLines.length > 0 && (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
              <h2 className="font-display font-bold text-xl text-red-900 mb-3">الخطوط الحمراء</h2>
              <ul className="space-y-2">
                {result.redLines.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-red-800">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* System Instruction */}
          {result.systemInstruction && (
            <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  تعليمات النظام الشخصية
                </h2>
                <button
                  onClick={() => copyToClipboard(result.systemInstruction)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  {copied ? (
                    <><Check className="h-4 w-4" /> تم النسخ</>
                  ) : (
                    <><Copy className="h-4 w-4" /> نسخ</>
                  )}
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-primary-foreground/90 leading-relaxed font-sans">
                {result.systemInstruction}
              </pre>
            </div>
          )}

          {/* Quick Starters */}
          {result.quickStarters && result.quickStarters.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent" />
                بوادئ الحوار المقترحة
              </h2>
              <div className="space-y-3">
                {result.quickStarters.map((qs: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-xl group cursor-pointer hover:bg-secondary transition-colors" onClick={() => copyToClipboard(qs)}>
                    <span className="font-bold text-accent shrink-0">{i + 1}.</span>
                    <p className="text-sm text-foreground leading-relaxed">{qs}</p>
                    <Copy className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display font-bold text-xl text-foreground mb-4">التوصيات</h2>
              <ol className="space-y-3">
                {result.recommendations.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent font-bold text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-foreground mt-0.5">{r}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // ── WIZARD RENDER ──────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4 flex justify-center bg-gray-50/50">
      <div className="w-full max-w-2xl">
        {step > 0 && <ProgressBar step={step} total={TOTAL_STEPS} />}

        <AnimatePresence mode="wait">
          {/* ── Step 0: Project Setup ── */}
          {step === 0 && (
            <StepCard key="step-0">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                  أخبرنا عن مشروعك
                </h1>
                <p className="text-muted-foreground">
                  هذه المعلومات تُشكّل سياق التقرير وتعليمات الذكاء الاصطناعي
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSetupSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    اسم المشروع أو مجال العمل
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="مثال: تطوير منصة تعليمية"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                    minLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    ما هدفك الرئيسي من استخدام الذكاء الاصطناعي؟
                  </label>
                  <textarea
                    value={projectGoal}
                    onChange={(e) => setProjectGoal(e.target.value)}
                    placeholder="مثال: أريد استخدام الذكاء الاصطناعي لمساعدتي في كتابة المحتوى التعليمي وتصميم المناهج وتحليل أداء المتعلمين"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none"
                    required
                    minLength={10}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      لغة التقرير
                    </label>
                    <select
                      value={reportLanguage}
                      onChange={(e) => setReportLanguage(e.target.value as any)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="ar">عربي</option>
                      <option value="en">English</option>
                      <option value="both">كلاهما</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      نوع التقييم
                    </label>
                    <select
                      value={assessmentType}
                      onChange={(e) => setAssessmentType(e.target.value as any)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="full">الكامل (24 سؤالاً)</option>
                      <option value="mini">السريع (12 سؤالاً)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  ابدأ التقييم
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </form>
            </StepCard>
          )}

          {/* ── Steps 1-7: Behavioral questions per axis ── */}
          {step >= 1 && step <= 7 && (
            <StepCard key={`step-${step}`}>
              {(() => {
                const axis = AXES[step - 1]!;
                const questions = currentAxisQuestions();
                return (
                  <>
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${axis.color} flex items-center justify-center text-white font-display font-black text-2xl shrink-0`}>
                        {axis.letter}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                          البعد {step} من 7
                        </p>
                        <h2 className="text-xl font-display font-bold text-foreground">
                          {axis.ar}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {questions.map((q) => {
                        const selected = getAnswerFor(q.index);
                        return (
                          <div key={q.index}>
                            <p className="font-semibold text-foreground mb-3 leading-relaxed">
                              {q.textAr}
                            </p>
                            <div className="grid gap-2">
                              {q.options.map((opt, oi) => (
                                <button
                                  key={oi}
                                  onClick={() => handleBehavioralAnswer(q.index, oi)}
                                  className={`text-right w-full px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                    selected === oi
                                      ? "border-primary bg-primary/5 text-primary"
                                      : "border-border bg-background text-foreground hover:border-primary/40"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between mt-8 gap-4">
                      <button
                        onClick={() => setStep((s) => s - 1)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary/30 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                        السابق
                      </button>
                      <button
                        onClick={() => setStep((s) => s + 1)}
                        disabled={!axisComplete()}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-1 justify-center"
                      >
                        {step === 7 ? "انتقل لأسئلة الذكاء الاصطناعي" : "التالي"}
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </StepCard>
          )}

          {/* ── Step 8: Scenarios ── */}
          {step === 8 && (
            <StepCard key="step-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-rose-600 flex items-center justify-center text-white shrink-0">
                  <Zap className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                    الخطوة 8 من 10
                  </p>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    بروتوكول التفاعل مع الذكاء الاصطناعي
                  </h2>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 text-sm">
                لكل سؤال، اختر الخيار الذي يصف تفضيلك الحقيقي مع الذكاء الاصطناعي
              </p>

              <div className="space-y-6">
                {SCENARIOS.map((s, i) => {
                  const chosen = getScenarioAnswer(i);
                  return (
                    <div key={i} className="bg-secondary/30 rounded-2xl p-4">
                      <p className="font-semibold text-foreground mb-3 text-sm leading-relaxed">
                        <span className="text-accent font-bold">{s.dimension_ar} — </span>
                        {s.question}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {(["a", "b"] as const).map((choice) => (
                          <button
                            key={choice}
                            onClick={() => handleScenarioAnswer(i, choice)}
                            className={`text-right px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              chosen === choice
                                ? "border-accent bg-accent/5 text-accent"
                                : "border-border bg-background text-foreground hover:border-accent/40"
                            }`}
                          >
                            {choice === "a" ? s.option_a : s.option_b}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-8 gap-4">
                <button
                  onClick={() => setStep(7)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary/30 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </button>
                <button
                  onClick={() => setStep(9)}
                  disabled={!scenariosComplete()}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-1 justify-center"
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </StepCard>
          )}

          {/* ── Step 9: Open Answer + Submit ── */}
          {step === 9 && (
            <StepCard key="step-9">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shrink-0">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                    الخطوة الأخيرة
                  </p>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    أنت بكلماتك الخاصة
                  </h2>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                هذا السؤال الأهم في التقييم. اكتب بحرية كيف تصف نمطك في العمل، أسلوبك مع الذكاء الاصطناعي، أو أي شيء تريد أن يأخذه التقرير بعين الاعتبار.
              </p>

              <textarea
                value={openAnswer}
                onChange={(e) => setOpenAnswer(e.target.value)}
                placeholder="اكتب هنا بحرية... (20 حرفاً على الأقل)"
                className="w-full bg-background border border-border rounded-xl px-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[160px] resize-none mb-2"
                minLength={20}
              />
              <div className="flex justify-between text-xs text-muted-foreground mb-8">
                <span>{openAnswer.length < 20 ? `${20 - openAnswer.length} حرفاً متبقية` : "✓ جاهز للإرسال"}</span>
                <span>{openAnswer.length}/2000</span>
              </div>

              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setStep(8)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary/30 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={submitting || openAnswer.trim().length < 20}
                  className="flex items-center gap-2 bg-gradient-to-l from-accent to-red-500 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-1 justify-center"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الإرسال...</>
                  ) : (
                    <><Zap className="h-4 w-4" /> توليد تقريري الآن</>
                  )}
                </button>
              </div>
            </StepCard>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
