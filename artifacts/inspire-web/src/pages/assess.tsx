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
  CreditCard,
} from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// ─── DATA ────────────────────────────────────────────────

const BEHAVIORAL_QUESTIONS = [
  // 1–3 Intention
  { textAr: "عندما تبدأ مشروعاً جديداً، ما الذي يحفزك أكثر؟", options: ["تحقيق هدف واضح ومحدد", "استكشاف إمكانيات جديدة غير محددة", "المساهمة في فريق أو مجتمع", "تطوير مهاراتي الشخصية"] },
  { textAr: "كيف تحدد الأولويات عند مواجهة مهام متعددة؟", options: ["حسب الأهمية والتأثير الاستراتيجي", "حسب ترتيب الورود والإلحاح", "حسب ما يثير اهتمامي أكثر", "حسب ما يرضي الآخرين ويفيدهم"] },
  { textAr: "ما الذي يجعلك تشعر أن عملك ناجح حقاً؟", options: ["تحقيق الأهداف المرسومة بدقة", "الحصول على تقدير وإشادة من الآخرين", "تعلم شيء جديد من التجربة", "إحداث تأثير إيجابي ملموس"] },
  // 4–6 Narrative
  { textAr: "كيف تفضل تلقي المعلومات الجديدة؟", options: ["ملخص موجز ونقاط رئيسية", "شرح مفصل مع أمثلة", "تصور بصري أو مخطط", "نقاش وحوار تفاعلي"] },
  { textAr: "عندما تشرح فكرة معقدة، كيف تبدأ عادةً؟", options: ["من الصورة الكبيرة ثم التفاصيل", "من التفاصيل وصولاً للصورة الكاملة", "بضرب مثال واقعي أولاً", "بطرح أسئلة لفهم ما يعرفه المستمع"] },
  { textAr: "ما الأسلوب الذي تفضله في التواصل المهني؟", options: ["رسمي ومنظم", "ودي ومباشر", "تحليلي وموضوعي", "قصصي وإلهامي"] },
  // 7–9 Style
  { textAr: "كيف تتعامل مع مشكلة غير متوقعة في العمل؟", options: ["أتوقف وأخطط بشكل منظم قبل التصرف", "أتصرف فوراً ثم أعدل المسار لاحقاً", "أبحث عمن يمكن أن يساعدني", "أفكر في بدائل إبداعية خارج الصندوق"] },
  { textAr: "ما طبيعة بيئة العمل المثالية لك؟", options: ["هادئة ومنظمة مع حدود واضحة", "ديناميكية ومتغيرة باستمرار", "تعاونية وإنسانية", "مستقلة تمنحني حرية القرار"] },
  { textAr: "كيف تتعامل مع التغيير المفاجئ في الخطط؟", options: ["يزعجني وأحتاج وقتاً للتكيف", "أتقبله وأتكيف بسرعة", "أنظر إليه كفرصة جديدة", "أحاول إعادة الخطط الأصلية"] },
  // 10–12 Preferences
  { textAr: "كم عدد المهام التي تفضل العمل عليها في وقت واحد؟", options: ["مهمة واحدة حتى أُكملها", "مهمتان أو ثلاث بشكل متوازٍ", "أُفضل تعدد المهام والتنويع", "يعتمد على نوع المهمة"] },
  { textAr: "ما الذي يساعدك أكثر على الإنتاجية؟", options: ["جدول واضح ومواعيد نهائية", "حرية في إدارة وقتي", "العمل مع فريق", "أهداف طموحة تُحفزني"] },
  { textAr: "كيف تفضل اتخاذ القرارات المهمة؟", options: ["بعد جمع بيانات وتحليل كامل", "بناءً على خبرتي وحدسي", "بعد التشاور مع المعنيين", "بتجربة الخيار الأقل خطراً أولاً"] },
  // 13–15 Interaction
  { textAr: "ما دورك المفضل في فريق العمل؟", options: ["القائد الذي يحدد الاتجاه", "المنفذ الذي يُنجز المهام", "الوسيط الذي يُوحّد الآراء", "المفكر الاستراتيجي"] },
  { textAr: "كيف تتعامل مع الخلاف في الرأي في العمل؟", options: ["أُفضل النقاش المباشر لحل الأمر فوراً", "أبحث عن أرضية مشتركة", "أتراجع وأُعيد تقييم موقفي", "أتجنب الجدال وأُركز على العمل"] },
  { textAr: "ما الذي يُعزز ثقتك بشخص تعمل معه؟", options: ["الكفاءة والاحترافية العالية", "الصدق والشفافية", "الالتزام بالمواعيد والوعود", "الدعم والاهتمام بالفريق"] },
  // 16–18 Reflection
  { textAr: "كيف تتعلم أفضل من تجاربك السابقة؟", options: ["بمراجعة ما حدث وتحليله بشكل منهجي", "بالتجربة والخطأ المستمر", "بالحوار مع من مروا بتجارب مماثلة", "بالقراءة والبحث في الموضوع"] },
  { textAr: "ما مدى وضوح نقاط قوتك وضعفك في عملك؟", options: ["أعرفها بشكل واضح وجلي", "أعرف قوتي لكن ضعفي أقل وضوحاً", "أحتاج لتغذية راجعة من الآخرين", "أكتشفها تدريجياً عبر التجارب"] },
  { textAr: "ما موقفك من الأخطاء التي ترتكبها؟", options: ["أتعلم منها وأتجاوزها بسرعة", "أُحلّلها بعمق لتجنب تكرارها", "أُحاسب نفسي بشدة أحياناً", "أعتبرها جزءاً طبيعياً من المسيرة"] },
  // 19–21 Evaluation
  { textAr: "ما معيارك لقياس جودة العمل؟", options: ["المعايير الموضوعية والمقاييس الدقيقة", "مدى رضا المستخدم أو العميل", "مقارنة النتائج بالأهداف المحددة", "إحساسي الشخصي بالجودة"] },
  { textAr: "كيف تتعامل مع النقد على عملك؟", options: ["أُقيّمه بموضوعية وآخذ ما يفيدني", "أُحلله بدقة للتأكد من صحته", "يؤثر عليّ عاطفياً في البداية", "أُبدي دفاعاً إذا كنت مقتنعاً بعملي"] },
  { textAr: "ما مستوى المخاطرة الذي تقبله في القرارات؟", options: ["أُفضل الأمان وتجنب المخاطر", "أقبل مخاطر محسوبة ومدروسة", "أُحب التجريب ولو بمخاطر عالية", "يعتمد على السياق والظروف"] },
  // 22–24 Mixed
  { textAr: "كيف تستجيب عندما تُكلَّف بمهمة لا تُحبها؟", options: ["أُكملها بمهنية عالية رغم ذلك", "أبحث عن طريقة تجعلها أكثر إثارة", "أُفاوض على تعديلها أو تفويضها", "أُنجزها أولاً ثم أُعبّر عن رأيي"] },
  { textAr: "ما الذي تبحث عنه في التغذية الراجعة؟", options: ["نقاط تحسين محددة وقابلة للتطبيق", "تحقق من اتجاهي الصحيح", "إشادة بما أحسنت فيه", "رؤية شاملة لأدائي العام"] },
  { textAr: "عند انتهاء مشروع ما، ما أول شيء تفعله؟", options: ["أُوثّق الدروس المستفادة", "أُقيّم النتائج بموضوعية", "أحتفل وأُكافئ الفريق", "أبدأ التخطيط للمشروع التالي"] },
];

const SCENARIOS = [
  { dimension_ar: "العمق / السرعة", question: "عندما تعمل مع الذكاء الاصطناعي، هل تفضل أن يُعطيك الحل مباشرة وبسرعة؟ أم تفضل أن يشرح التفكير والمنطق معك خطوة بخطوة؟", option_a: "أريد الحل مباشرة وبسرعة دون تفاصيل زائدة", option_b: "أفضل الشرح خطوة بخطوة مع المنطق الكامل" },
  { dimension_ar: "القيادة / التنفيذ", question: "عند استخدام الذكاء الاصطناعي في مشروع، هل تفضل أن تقود أنت الحوار وتوجّهه؟ أم تترك للذكاء الاصطناعي المبادرة باقتراح الخطوات؟", option_a: "أقود أنا الحوار وأحدد الاتجاه بنفسي", option_b: "أترك للذكاء الاصطناعي المبادرة واقتراح الخطوات" },
  { dimension_ar: "التحدي / التأكيد", question: "عندما تطرح فكرة على الذكاء الاصطناعي، ماذا تريد منه؟ أن يتحداها ويكشف نقاط ضعفها؟ أم أن يدعمها ويساعدك على تطويرها؟", option_a: "أريده أن يتحدى فكرتي ويكشف نقاط ضعفها", option_b: "أريده أن يدعم فكرتي ويساعدني على تطويرها" },
  { dimension_ar: "الخطية / التشعب", question: "كيف تفضل أن يسير حوارك مع الذكاء الاصطناعي؟ خطياً ومنظماً؟ أم بشكل متشعب تستكشف فيه أفكاراً متعددة؟", option_a: "خطياً ومنظماً من البداية للنهاية", option_b: "متشعباً أستكشف فيه أفكاراً متعددة في آنٍ واحد" },
  { dimension_ar: "التعلم / الإنجاز", question: "عند استخدامك للذكاء الاصطناعي، ما الذي يهمك أكثر: أن تفهم وتتعلم من العملية؟ أم أن تُنجز المهمة بأسرع وقت؟", option_a: "أن أفهم وأتعلم من العملية نفسها", option_b: "أن أُنجز المهمة وأحصل على النتيجة بأسرع وقت" },
  { dimension_ar: "الاستقلالية / الاتكاء", question: "كيف تصف علاقتك المثالية مع الذكاء الاصطناعي؟ أداة تستخدمها عند الحاجة؟ أم شريك دائم تعتمد عليه؟", option_a: "أداة أستخدمها عند الحاجة فقط وأعتمد على نفسي", option_b: "شريك دائم أعتمد عليه في معظم مهامي" },
  { dimension_ar: "تحمل الغموض", question: "عندما تطرح سؤالاً ليس له إجابة واضحة، كيف تريد الذكاء الاصطناعي أن يتعامل معه؟", option_a: "يُقر بالغموض ويعطيني خيارات وجوانب متعددة", option_b: "يختار أفضل إجابة ويُقدمها بثقة حتى لو لم تكن مثالية" },
  { dimension_ar: "السياق", question: "عند بدء محادثة جديدة مع الذكاء الاصطناعي، هل تفضل أن تشرح له السياق الكامل؟ أم تدخل مباشرة في الطلب؟", option_a: "أشرح السياق الكامل وأهدافي في البداية دائماً", option_b: "أدخل مباشرة في الطلب دون مقدمات" },
];

// ─── WIZARD CONFIG ────────────────────────────────────────
// Step 0: project setup
// Steps 1-6: 4 behavioral questions each (6 pages × 4 = 24)
// Step 7: 8 scenarios
// Step 8: open question
const Q_PAGES = 6;
const Q_PER_PAGE = 4;
const SCENARIO_STEP = 7;
const OPEN_STEP = 8;
const TOTAL_WIZARD_STEPS = 9; // steps 1-9 for progress bar (0 = setup, not counted)

function apiUrl(path: string) {
  return `/api${path}`;
}

interface BehavioralAnswer { question_index: number; answer_index: number }
interface ScenarioAnswer { scenario_index: number; choice: "a" | "b" }

function ProgressBar({ step }: { step: number }) {
  // step 0 = setup (no bar), steps 1-8 shown
  const pct = Math.round((step / TOTAL_WIZARD_STEPS) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
        <span>
          {step <= Q_PAGES
            ? `الأسئلة السلوكية — الصفحة ${step} من ${Q_PAGES}`
            : step === SCENARIO_STEP
            ? "أسئلة التفاعل مع الذكاء الاصطناعي"
            : "السؤال المفتوح"}
        </span>
        <span className="font-bold text-primary">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-l from-accent to-primary rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function StepCard({ children, stepKey }: { children: React.ReactNode; stepKey: string | number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-10"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface PayPalConfig {
  clientId: string;
  env: string;
  price: number;
}

interface DiscountInfo {
  valid: boolean;
  discountPercent: number;
  finalPrice: number;
  originalPrice: number;
}

export default function Assess() {
  const { user, isLoading } = useAuth();

  // Read optional previousAssessmentId from ?prev= query param
  const previousAssessmentId = new URLSearchParams(window.location.search).get("prev");

  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [reportLanguage, setReportLanguage] = useState<"ar" | "en" | "both">("ar");
  const [assessmentType, setAssessmentType] = useState<"full" | "mini">("full");

  const [behavioralAnswers, setBehavioralAnswers] = useState<BehavioralAnswer[]>([]);
  const [scenarioAnswers, setScenarioAnswers] = useState<ScenarioAnswer[]>([]);
  const [openAnswer, setOpenAnswer] = useState("");

  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<"wizard" | "processing" | "error">("wizard");
  const [setupError, setSetupError] = useState("");
  const [, navigate] = useLocation();

  // ── Payment gate state ─────────────────────────────────
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "free" | "required" | "paid">("loading");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paypalConfig, setPaypalConfig] = useState<PayPalConfig | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [checkingDiscount, setCheckingDiscount] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [processingFree, setProcessingFree] = useState(false);

  const startTime = useRef(Date.now());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  useEffect(() => {
    if (!user) return;
    fetch(apiUrl("/billing/status"))
      .then((r) => r.json() as Promise<{ success: boolean; freeUsed: boolean; price: number }>)
      .then((d) => {
        if (d.freeUsed) {
          setPaymentStatus("required");
          fetch(apiUrl("/billing/paypal-config"))
            .then((r) => r.json() as Promise<{ success: boolean; clientId: string; env: string; price: number }>)
            .then((config) => {
              if (config.success) setPaypalConfig(config);
            })
            .catch(() => undefined);
        } else {
          setPaymentStatus("free");
        }
      })
      .catch(() => setPaymentStatus("free"));
  }, [user]);

  async function handleFreeOrder() {
    const code = discountCode.trim();
    if (!code) return;
    setProcessingFree(true);
    setPaymentError("");
    try {
      const res = await fetch(apiUrl("/billing/free-order"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountCode: code }),
      });
      const d = await res.json() as { success: boolean; paymentId?: string; error?: string };
      if (!d.success || !d.paymentId) throw new Error(d.error ?? "فشل تفعيل الطلب المجاني");
      setPaymentId(d.paymentId);
      setPaymentStatus("paid");
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : "حدث خطأ، حاول مجدداً");
    } finally {
      setProcessingFree(false);
    }
  }

  async function checkDiscount() {
    const code = discountCode.trim();
    if (!code) return;
    setCheckingDiscount(true);
    setDiscountInfo(null);
    try {
      const res = await fetch(apiUrl(`/billing/discount/${encodeURIComponent(code)}`));
      const d = await res.json() as {
        success: boolean;
        valid: boolean;
        discountPercent?: number;
        finalPrice?: number;
        originalPrice?: number;
      };
      if (d.success) {
        setDiscountInfo({
          valid: d.valid,
          discountPercent: d.discountPercent ?? 0,
          finalPrice: d.finalPrice ?? paypalConfig?.price ?? 10,
          originalPrice: d.originalPrice ?? paypalConfig?.price ?? 10,
        });
      }
    } catch {
      // ignore
    } finally {
      setCheckingDiscount(false);
    }
  }

  if (isLoading || (!!user && paymentStatus === "loading")) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;

  // ── Payment gate screen ────────────────────────────────
  if (paymentStatus === "required") {
    const displayPrice = discountInfo?.valid ? discountInfo.finalPrice : (paypalConfig?.price ?? 10);
    const originalPrice = paypalConfig?.price ?? 10;

    return (
      <div className="min-h-[calc(100vh-5rem)] py-12 px-4 flex justify-center">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl border border-border p-8 md:p-10 shadow-xl text-right"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2 text-center">
              {previousAssessmentId ? "إعادة التقييم" : "تقييم جديد"}
            </h1>
            <p className="text-muted-foreground text-center mb-8 text-sm">
              {previousAssessmentId
                ? "ستُجري تقييماً محدّثاً مرتبطاً بتقييمك السابق — يمكنك مقارنة النتائج لاحقاً."
                : "لقد استخدمت تقييمك المجاني. ادفع لإنشاء تقييم جديد — PDF والمشاركة مشمولة."}
            </p>

            {/* Price display */}
            <div className="bg-secondary/50 rounded-2xl p-5 mb-6 text-center">
              {discountInfo?.valid ? (
                <div>
                  <div className="text-sm text-muted-foreground line-through mb-1">${originalPrice.toFixed(2)}</div>
                  <div className="text-4xl font-display font-black text-primary">${displayPrice.toFixed(2)}</div>
                  <div className="text-sm text-green-600 font-semibold mt-1">خصم {discountInfo.discountPercent}% مطبق ✓</div>
                </div>
              ) : (
                <div>
                  <div className="text-4xl font-display font-black text-primary">${originalPrice.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1">دفعة واحدة · بدون اشتراك</div>
                </div>
              )}
            </div>

            {/* Discount code */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">كود خصم (اختياري)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value.toUpperCase());
                    setDiscountInfo(null);
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") checkDiscount(); }}
                  placeholder="INSPIRE10"
                  className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  dir="ltr"
                />
                <button
                  onClick={checkDiscount}
                  disabled={checkingDiscount || !discountCode.trim()}
                  className="px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm font-semibold hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                >
                  {checkingDiscount ? <Loader2 className="h-4 w-4 animate-spin" /> : "تطبيق"}
                </button>
              </div>
              {discountInfo !== null && (
                <p className={`text-xs mt-2 ${discountInfo.valid ? "text-green-600" : "text-red-500"}`}>
                  {discountInfo.valid
                    ? `✓ كود صالح — خصم ${discountInfo.discountPercent}%`
                    : "✗ الكود غير صالح أو منتهي الصلاحية"}
                </p>
              )}
            </div>

            {/* Free button (100% discount) or PayPal */}
            {discountInfo?.valid && displayPrice === 0 ? (
              <button
                onClick={handleFreeOrder}
                disabled={processingFree}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all disabled:opacity-70"
              >
                {processingFree ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> جارٍ التفعيل...</>
                ) : (
                  previousAssessmentId ? "ابدأ إعادة التقييم مجاناً ←" : "ابدأ التقييم مجاناً ←"
                )}
              </button>
            ) : paypalConfig ? (
              <PayPalScriptProvider options={{ clientId: paypalConfig.clientId, currency: "USD" }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                  createOrder={async () => {
                    setPaymentError("");
                    const res = await fetch(apiUrl("/billing/create-order"), {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        discountCode: (discountInfo?.valid && discountCode.trim()) ? discountCode.trim() : undefined,
                      }),
                    });
                    const d = await res.json() as { success: boolean; orderId?: string; error?: string };
                    if (!d.success || !d.orderId) throw new Error(d.error ?? "فشل إنشاء الطلب");
                    return d.orderId;
                  }}
                  onApprove={async (data) => {
                    const res = await fetch(apiUrl("/billing/capture-order"), {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ orderId: data.orderID }),
                    });
                    const d = await res.json() as { success: boolean; paymentId?: string; error?: string };
                    if (!d.success || !d.paymentId) throw new Error(d.error ?? "فشل تأكيد الدفع");
                    setPaymentId(d.paymentId);
                    setPaymentStatus("paid");
                  }}
                  onError={(err) => {
                    setPaymentError("حدث خطأ في الدفع. يُرجى المحاولة مجدداً.");
                    console.error("PayPal error:", err);
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                جارٍ تحميل بوابة الدفع...
              </div>
            )}

            {paymentError && (
              <p className="text-sm text-red-500 text-center mt-3">{paymentError}</p>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Behavioral helpers ─────────────────────────────────

  function setAnswer(qIdx: number, aIdx: number) {
    setBehavioralAnswers(prev => [
      ...prev.filter(a => a.question_index !== qIdx),
      { question_index: qIdx, answer_index: aIdx },
    ]);
  }

  function getAnswer(qIdx: number) {
    return behavioralAnswers.find(a => a.question_index === qIdx)?.answer_index ?? -1;
  }

  function pageComplete(page: number) {
    const start = (page - 1) * Q_PER_PAGE;
    return Array.from({ length: Q_PER_PAGE }, (_, i) => start + i).every(i => getAnswer(i) >= 0);
  }

  // ── Scenario helpers ───────────────────────────────────

  function setScenario(sIdx: number, choice: "a" | "b") {
    setScenarioAnswers(prev => [
      ...prev.filter(a => a.scenario_index !== sIdx),
      { scenario_index: sIdx, choice },
    ]);
  }

  function getScenario(sIdx: number) {
    return scenarioAnswers.find(a => a.scenario_index === sIdx)?.choice ?? null;
  }

  const scenariosComplete = SCENARIOS.every((_, i) => getScenario(i) !== null);

  // ── Setup submit ───────────────────────────────────────

  async function handleSetupSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectName.trim() || !projectGoal.trim()) return;
    setSetupError("");
    try {
      const res = await fetch(apiUrl("/assessments/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName.trim(),
          project_goal: projectGoal.trim(),
          report_language: reportLanguage,
          assessment_type: assessmentType,
          ...(previousAssessmentId ? { previous_assessment_id: previousAssessmentId } : {}),
          ...(paymentId ? { payment_id: paymentId } : {}),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "فشل بدء التقييم");
      setAssessmentId(data.assessmentId);
      startTime.current = Date.now();
      setStep(1);
    } catch (err: unknown) {
      setSetupError(err instanceof Error ? err.message : "فشل بدء التقييم");
    }
  }

  // ── Final submit ───────────────────────────────────────

  async function handleFinalSubmit() {
    if (!assessmentId || openAnswer.trim().length < 20 || submitting) return;
    setSubmitting(true);
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    try {
      const res = await fetch(apiUrl(`/assessments/${assessmentId}/submit`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          behavioral_answers: behavioralAnswers,
          scenario_answers: scenarioAnswers,
          open_answer: openAnswer.trim(),
          completion_time_seconds: elapsed,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "فشل الإرسال");
      setPhase("processing");
      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch(apiUrl(`/assessments/${assessmentId}/status`));
          const d = await r.json();
          if (!d.success) return;
          if (d.assessment.status === "completed") {
            clearInterval(pollRef.current!);
            navigate(`/results/${assessmentId}`);
          } else if (d.assessment.status === "failed") {
            clearInterval(pollRef.current!);
            setPhase("error");
          }
        } catch { /* keep polling */ }
      }, 3000);
    } catch (err: unknown) {
      setSetupError(err instanceof Error ? err.message : "فشل الإرسال");
      setSubmitting(false);
    }
  }

  // ── Processing screen ──────────────────────────────────

  if (phase === "processing") {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-20 animate-ping" />
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent">
              <Brain className="h-14 w-14 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">INSPIRE يُحلّل نمطك</h2>
          <p className="text-muted-foreground text-lg mb-6">يجري الذكاء الاصطناعي تحليلاً عميقاً عبر الأبعاد السبعة</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>يستغرق عادةً 30–60 ثانية</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Error screen ───────────────────────────────────────

  if (phase === "error") {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-lg bg-card rounded-3xl border border-border p-10 shadow-xl">
          <p className="text-xl text-destructive mb-6">فشلت عملية التحليل. يُرجى المحاولة مرة أخرى لاحقاً.</p>
          <button onClick={() => { setPhase("wizard"); setSubmitting(false); }} className="flex items-center gap-2 mx-auto bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold">
            <RotateCcw className="h-4 w-4" /> العودة للمحاولة مجدداً
          </button>
        </div>
      </div>
    );
  }

  // ── WIZARD ─────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4 flex justify-center bg-gray-50/50">
      <div className="w-full max-w-2xl">
        {step > 0 && <ProgressBar step={step} />}

        {/* Step 0 — Project Setup */}
        {step === 0 && (
          <StepCard stepKey="setup">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">أخبرنا عن مشروعك</h1>
              <p className="text-muted-foreground">هذه المعلومات تُشكّل سياق التقرير وتعليمات الذكاء الاصطناعي</p>
            </div>

            {setupError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6 text-red-700 text-sm">{setupError}</div>
            )}

            <form onSubmit={handleSetupSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">اسم المشروع أو مجال العمل</label>
                <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="مثال: تطوير منصة تعليمية" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" required minLength={2} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">ما هدفك الرئيسي من استخدام الذكاء الاصطناعي؟</label>
                <textarea value={projectGoal} onChange={e => setProjectGoal(e.target.value)} placeholder="مثال: أريد استخدام الذكاء الاصطناعي لمساعدتي في كتابة المحتوى التعليمي وتصميم المناهج" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none" required minLength={10} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">لغة التقرير</label>
                  <select value={reportLanguage} onChange={e => setReportLanguage(e.target.value as any)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="ar">عربي</option>
                    <option value="en">English</option>
                    <option value="both">كلاهما</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">نوع التقييم</label>
                  <select value={assessmentType} onChange={e => setAssessmentType(e.target.value as any)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="full">الكامل — 24 سؤالاً</option>
                    <option value="mini">السريع — 12 سؤالاً</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                ابدأ التقييم <ChevronLeft className="h-5 w-5" />
              </button>
            </form>
          </StepCard>
        )}

        {/* Steps 1–6 — 4 behavioral questions per page */}
        {step >= 1 && step <= Q_PAGES && (
          <StepCard stepKey={`q-${step}`}>
            <div className="mb-8">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                الأسئلة {(step - 1) * Q_PER_PAGE + 1}–{step * Q_PER_PAGE}
              </p>
              <h2 className="text-xl font-display font-bold text-foreground">الأسئلة السلوكية</h2>
            </div>

            <div className="space-y-8">
              {Array.from({ length: Q_PER_PAGE }, (_, i) => {
                const qIdx = (step - 1) * Q_PER_PAGE + i;
                const q = BEHAVIORAL_QUESTIONS[qIdx];
                if (!q) return null;
                const selected = getAnswer(qIdx);
                return (
                  <div key={qIdx}>
                    <p className="font-semibold text-foreground mb-3 leading-relaxed">
                      <span className="text-accent font-bold text-sm ml-1">{qIdx + 1}.</span> {q.textAr}
                    </p>
                    <div className="grid gap-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} onClick={() => setAnswer(qIdx, oi)}
                          className={`text-right w-full px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${selected === oi ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-foreground hover:border-primary/40"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-8 gap-4">
              <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary/30 transition-colors">
                <ChevronRight className="h-4 w-4" /> السابق
              </button>
              <button onClick={() => setStep(s => s + 1)} disabled={!pageComplete(step)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-1 justify-center">
                {step === Q_PAGES ? "انتقل لأسئلة الذكاء الاصطناعي" : "التالي"} <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </StepCard>
        )}

        {/* Step 7 — 8 Scenarios */}
        {step === SCENARIO_STEP && (
          <StepCard stepKey="scenarios">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-rose-600 flex items-center justify-center text-white shrink-0">
                <Zap className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">الخطوة 7 من 8</p>
                <h2 className="text-xl font-display font-bold text-foreground">بروتوكول التفاعل مع الذكاء الاصطناعي</h2>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">لكل سؤال، اختر الخيار الذي يصف تفضيلك الحقيقي</p>

            <div className="space-y-5">
              {SCENARIOS.map((s, i) => {
                const chosen = getScenario(i);
                return (
                  <div key={i} className="bg-secondary/30 rounded-2xl p-4">
                    <p className="font-semibold text-foreground mb-3 text-sm leading-relaxed">
                      <span className="text-accent font-bold">{s.dimension_ar} — </span>{s.question}
                    </p>
                    <div className="grid gap-2">
                      {(["a", "b"] as const).map(choice => (
                        <button key={choice} onClick={() => setScenario(i, choice)}
                          className={`text-right px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${chosen === choice ? "border-accent bg-accent/5 text-accent" : "border-border bg-background text-foreground hover:border-accent/40"}`}>
                          {choice === "a" ? s.option_a : s.option_b}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-8 gap-4">
              <button onClick={() => setStep(Q_PAGES)} className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary/30 transition-colors">
                <ChevronRight className="h-4 w-4" /> السابق
              </button>
              <button onClick={() => setStep(OPEN_STEP)} disabled={!scenariosComplete}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-1 justify-center">
                التالي <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </StepCard>
        )}

        {/* Step 8 — Open question */}
        {step === OPEN_STEP && (
          <StepCard stepKey="open">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shrink-0">
                <MessageSquare className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">الخطوة الأخيرة</p>
                <h2 className="text-xl font-display font-bold text-foreground">أنت بكلماتك الخاصة</h2>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              هذا السؤال الأهم في التقييم. اكتب بحرية كيف تصف نمطك في العمل، أسلوبك مع الذكاء الاصطناعي، أو أي شيء تريد أن يأخذه التقرير بعين الاعتبار.
            </p>

            <textarea value={openAnswer} onChange={e => setOpenAnswer(e.target.value)}
              placeholder="اكتب هنا بحرية... (20 حرفاً على الأقل)"
              className="w-full bg-background border border-border rounded-xl px-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[160px] resize-none mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground mb-8">
              <span className={openAnswer.length >= 20 ? "text-green-600 font-medium" : ""}>
                {openAnswer.length < 20 ? `${20 - openAnswer.length} حرفاً متبقية` : "✓ جاهز للإرسال"}
              </span>
              <span>{openAnswer.length}/2000</span>
            </div>

            {setupError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-red-700 text-sm">{setupError}</div>
            )}

            <div className="flex justify-between gap-4">
              <button onClick={() => setStep(SCENARIO_STEP)} className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary/30 transition-colors">
                <ChevronRight className="h-4 w-4" /> السابق
              </button>
              <button onClick={handleFinalSubmit} disabled={submitting || openAnswer.trim().length < 20}
                className="flex items-center gap-2 bg-gradient-to-l from-accent to-red-500 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-1 justify-center">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الإرسال...</> : <><Zap className="h-4 w-4" /> توليد تقريري الآن</>}
              </button>
            </div>
          </StepCard>
        )}
      </div>
    </div>
  );
}
