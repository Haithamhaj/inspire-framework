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
  Sparkles,
  MessageSquare,
  Zap,
  Clock,
  RotateCcw,
  CreditCard,
  ShieldCheck,
  Target,
  Layers3,
  Check,
} from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useI18n } from "@/i18n";

// ─── Types ────────────────────────────────────────────────

interface V2Option {
  optionId: string;
  textAr: string;
  textEn: string;
}

interface V2Question {
  questionId: string;
  block: string;
  selectionMode: string;
  questionAr: string;
  questionEn: string;
  options: V2Option[];
}

interface Answer {
  questionId: string;
  optionId: string;
}

// ─── Wizard Config ────────────────────────────────────────
const Q_PER_PAGE = 3;
const OPEN_STEP_OFFSET = 1; // open step comes after all question pages

function apiUrl(path: string) {
  return `/api${path}`;
}

function ProgressBar({
  step,
  totalSteps,
  progressLabel,
  openStepLabel,
}: {
  step: number;
  totalSteps: number;
  progressLabel: (page: number, total: number) => string;
  openStepLabel: string;
}) {
  const pct = Math.round((step / totalSteps) * 100);
  return (
    <div className="w-full rounded-2xl border border-border/70 bg-card/95 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold text-foreground">
          {step <= totalSteps - 1
            ? progressLabel(step, totalSteps - 1)
            : openStepLabel}
        </span>
        <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-gradient-to-l from-accent to-primary"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full ${pct >= (i + 1) * 25 ? "bg-accent" : "bg-secondary"}`}
          />
        ))}
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
        className="rounded-2xl border border-border/80 bg-card p-6 shadow-xl shadow-primary/5 md:p-8"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AssessmentShell({
  children,
  step,
  totalSteps,
}: {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
}) {
  const showProgress = step > 0;
  const { dir, t } = useI18n();

  return (
    <div dir={dir} className="min-h-[calc(100vh-5rem)] bg-[linear-gradient(180deg,hsl(var(--secondary))_0%,hsl(var(--background))_42%,hsl(var(--background))_100%)] px-4 py-6 md:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="order-2 lg:order-1">
          <div className="sticky top-28 space-y-4">
            <div className="rounded-2xl border border-border/80 bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">INSPIRE v2</p>
                  <h2 className="text-lg font-black leading-tight">{t("assessment.shell.sidebarTitle")}</h2>
                </div>
              </div>
              <p className="text-sm leading-7 text-white/72">
                {t("assessment.shell.sidebarDescription")}
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
              {[
                { icon: Target, label: t("assessment.shell.contextLabel"), value: t("assessment.shell.contextValue") },
                { icon: Layers3, label: t("assessment.shell.questionsLabel"), value: t("assessment.shell.questionsValue") },
                { icon: ShieldCheck, label: t("assessment.shell.privacyLabel"), value: t("assessment.shell.privacyValue") },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.label}</p>
                    <p className="text-xs leading-5 text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="order-1 min-w-0 space-y-5 lg:order-2">
          <div className="rounded-2xl border border-border/80 bg-card/95 p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("assessment.shell.badge")}
                </p>
                <h1 className="text-2xl font-black leading-tight text-foreground md:text-3xl">
                  {t("assessment.shell.title")}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {t("assessment.shell.subtitle")}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-xs font-semibold text-muted-foreground">
                <Check className="h-4 w-4 text-accent" />
                {t("assessment.shell.noScores")}
              </div>
            </div>
          </div>

          {showProgress && (
            <ProgressBar
              step={step}
              totalSteps={totalSteps}
              progressLabel={(page, total) => t("assessment.progress.questions")
                .replace("{page}", String(page))
                .replace("{total}", String(total))}
              openStepLabel={t("assessment.progress.openStep")}
            />
          )}
          {children}
        </section>
      </div>
    </div>
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
  const { dir, locale, t } = useI18n();

  const previousAssessmentId = new URLSearchParams(window.location.search).get("prev");

  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [reportLanguage, setReportLanguage] = useState<"ar" | "en" | "both">("ar");

  // v2 question bank (fetched from API)
  const [questions, setQuestions] = useState<V2Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState(false);

  // v2 answers
  const [answers, setAnswers] = useState<Answer[]>([]);
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

  // Fetch questions from API
  useEffect(() => {
    fetch(apiUrl("/questions"))
      .then((r) => r.json() as Promise<{ success: boolean; questions: V2Question[] }>)
      .then((d) => {
        if (d.success && d.questions?.length > 0) {
          setQuestions(d.questions);
        } else {
          setQuestionsError(true);
        }
      })
      .catch(() => setQuestionsError(true))
      .finally(() => setQuestionsLoading(false));
  }, []);

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
      <div dir={dir} className="min-h-[calc(100vh-5rem)] bg-[linear-gradient(180deg,hsl(var(--secondary))_0%,hsl(var(--background))_70%)] px-4 py-10">
        <div className="mx-auto flex min-h-[22rem] max-w-xl flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-8 text-center shadow-xl shadow-primary/5">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-bold text-foreground">{t("assessment.status.preparingTitle")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("assessment.status.preparingSubtitle")}</p>
        </div>
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;

  // ── Payment gate screen ────────────────────────────────
  if (paymentStatus === "required") {
    const displayPrice = discountInfo?.valid ? discountInfo.finalPrice : (paypalConfig?.price ?? 10);
    const originalPrice = paypalConfig?.price ?? 10;

    return (
      <div className="min-h-[calc(100vh-5rem)] py-10 px-4 flex justify-center">
        <div className="w-full max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl border border-border p-8 md:p-10 shadow-xl text-right"
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-center mb-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/70 border border-border text-xs font-semibold text-muted-foreground mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  انطباع أول قوي · ترقية واضحة · تجربة سريعة
                </div>
                <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                  {previousAssessmentId ? "إعادة تقييم" : "تقييم جديد"}
                </p>
                <h1 className="text-3xl md:text-4xl font-display font-black text-foreground mb-3 leading-tight">
                  {previousAssessmentId ? "ارجع لتقييمك السابق وطور نتيجتك" : "ابدأ تقييمك الكامل واحصل على نظامك الشخصي"}
                </h1>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {previousAssessmentId
                    ? "ستُنشئ نسخة محسّنة مرتبطة بتقييمك السابق، مع مقارنة واضحة ونتيجة أكثر عمقاً."
                    : "ستحصل على تعليمات نظام شخصية كاملة مبنية على 21 سؤالاً تحليلياً، جاهزة للنسخ إلى أي نموذج ذكاء اصطناعي."}
                </p>
              </div>

              {/* Price display */}
              <div className="bg-secondary/50 rounded-3xl p-6 mb-5 text-center border border-border/60">
                {discountInfo?.valid ? (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">السعر بعد الخصم</div>
                    <div className="flex items-end justify-center gap-3 mb-2">
                      <div className="text-sm text-muted-foreground line-through pb-1">${originalPrice.toFixed(2)}</div>
                      <div className="text-4xl font-display font-black text-primary">${displayPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-sm text-green-600 font-semibold">تم تطبيق خصم {discountInfo.discountPercent}%</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">دفعة واحدة</div>
                    <div className="text-4xl font-display font-black text-primary">${originalPrice.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground mt-2">بدون اشتراك · تقرير PDF والمشاركة مشمولان</div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">كود الخصم</label>
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
                    className="flex-1 bg-background border border-border rounded-2xl px-4 py-3 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    dir="ltr"
                  />
                  <button
                    onClick={checkDiscount}
                    disabled={checkingDiscount || !discountCode.trim()}
                    className="px-5 py-3 bg-secondary border border-border rounded-2xl text-sm font-semibold hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                  >
                    {checkingDiscount ? <Loader2 className="h-4 w-4 animate-spin" /> : "تحقق"}
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
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-600/20 transition-all disabled:opacity-70"
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
                    style={{ layout: "vertical", shape: "rect", label: "pay" }}
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
            </div>
          </motion.div>

          {/* ── Static Example Preview ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm"
          >
            <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">مثال سريع على النتيجة الكاملة</p>
                  <p className="text-xs text-muted-foreground">لتعرف بالضبط ماذا ستحصل عليه قبل الدفع</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2.5 py-1 rounded-full bg-secondary">21 سؤالاً</span>
                <span className="px-2.5 py-1 rounded-full bg-secondary">PDF</span>
                <span className="px-2.5 py-1 rounded-full bg-secondary">مشاركة</span>
              </div>
            </div>
            <div className="relative">
              <div className="p-6 space-y-4 select-none pointer-events-none" style={{ filter: "blur(2.5px)", opacity: 0.65 }}>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">نمطك السلوكي</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    أنت تميل إلى التخطيط الواضح قبل التنفيذ، وتحتاج من الذكاء الاصطناعي أن يشرح المنطق أولاً ثم يقترح الحلول العملية بشكل منظم.
                  </p>
                </div>
                <div className="bg-primary rounded-2xl p-4">
                  <p className="text-xs font-bold text-primary-foreground/70 uppercase tracking-widest mb-2">تعليمات النظام — جاهزة للنسخ</p>
                  <p className="text-xs text-primary-foreground/90 leading-relaxed font-mono">
                    {"أنت مساعد ذكاء اصطناعي شخصي متخصص في دعم أهدافي المهنية.\n\n• قدّم الإجابات مباشرةً ثم وضّح المنطق.\n• تحدّ أفكاري وأكشف نقاط ضعفها.\n• اعمل خطوة بخطوة مع سياق كامل.\n• لا تطوّل بلا داعٍ — الإيجاز مع العمق."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/50 rounded-xl p-3">
                    <p className="text-xs font-bold text-foreground mb-1">نقاط القوة</p>
                    <p className="text-xs text-muted-foreground">• التحليل المعمّق<br/>• التخطيط الاستراتيجي<br/>• وضوح التنفيذ</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-3">
                    <p className="text-xs font-bold text-foreground mb-1">مناطق التطوير</p>
                    <p className="text-xs text-muted-foreground">• الاستجابة السريعة<br/>• المرونة في التغيير<br/>• تقليل التردد</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/95 backdrop-blur-sm rounded-2xl px-6 py-4 border border-border shadow-lg text-center max-w-xs">
                  <p className="text-sm font-bold text-foreground mb-1">ادفع مرة واحدة واحصل على النسخة الكاملة</p>
                  <p className="text-xs text-muted-foreground">تعليمات شخصية + PDF + مشاركة</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Derived wizard config from fetched questions ───────
  const totalQPages = Math.ceil(questions.length / Q_PER_PAGE);
  const OPEN_STEP = totalQPages + OPEN_STEP_OFFSET;
  const TOTAL_WIZARD_STEPS = OPEN_STEP;

  // ── Answer helpers ─────────────────────────────────────

  function setAnswer(questionId: string, optionId: string) {
    setAnswers((prev) => [
      ...prev.filter((a) => a.questionId !== questionId),
      { questionId, optionId },
    ]);
  }

  function getAnswer(questionId: string): string | null {
    return answers.find((a) => a.questionId === questionId)?.optionId ?? null;
  }

  function pageComplete(page: number): boolean {
    const start = (page - 1) * Q_PER_PAGE;
    const pageQuestions = questions.slice(start, start + Q_PER_PAGE);
    return pageQuestions.every((q) => getAnswer(q.questionId) !== null);
  }

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
          assessment_type: "full",
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
    if (!assessmentId || submitting) return;
    setSubmitting(true);
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    try {
      const res = await fetch(apiUrl(`/assessments/${assessmentId}/submit`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          ...(openAnswer.trim() ? { open_answer: openAnswer.trim() } : {}),
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
      <div dir={dir} className="min-h-[calc(100vh-5rem)] bg-primary px-4 py-10 text-primary-foreground">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto flex min-h-[30rem] max-w-lg flex-col items-center justify-center text-center">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-2xl bg-white/15 animate-ping" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Brain className="h-14 w-14 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">{t("assessment.status.processingTitle")}</h2>
          <p className="text-white/70 text-lg mb-6">{t("assessment.status.processingSubtitle")}</p>
          <div className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">
            <Clock className="h-4 w-4" />
            <span>{t("assessment.status.processingTime")}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Error screen ───────────────────────────────────────

  if (phase === "error") {
    return (
      <div dir={dir} className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-[linear-gradient(180deg,hsl(var(--secondary))_0%,hsl(var(--background))_70%)] px-4">
        <div className="text-center max-w-lg bg-card rounded-2xl border border-border p-10 shadow-xl">
          <p className="text-xl text-destructive mb-6">{t("assessment.status.errorTitle")}</p>
          <button onClick={() => { setPhase("wizard"); setSubmitting(false); }} className="flex items-center gap-2 mx-auto bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold">
            <RotateCcw className="h-4 w-4" /> {t("assessment.status.errorRetry")}
          </button>
        </div>
      </div>
    );
  }

  // ── Loading questions ──────────────────────────────────

  if (questionsLoading) {
    return (
      <div dir={dir} className="min-h-[calc(100vh-5rem)] bg-[linear-gradient(180deg,hsl(var(--secondary))_0%,hsl(var(--background))_70%)] px-4 py-10">
        <div className="mx-auto flex min-h-[22rem] max-w-xl flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-8 text-center shadow-xl shadow-primary/5">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-bold text-foreground">{t("assessment.status.loadingQuestionsTitle")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("assessment.status.loadingQuestionsSubtitle")}</p>
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-4 bg-[linear-gradient(180deg,hsl(var(--secondary))_0%,hsl(var(--background))_70%)] px-4 text-center" dir={dir}>
        <p className="text-lg font-medium text-foreground">{t("assessment.status.questionsError")}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {t("assessment.status.questionsRetry")}
        </button>
      </div>
    );
  }

  // ── WIZARD ─────────────────────────────────────────────

  return (
    <AssessmentShell step={step} totalSteps={TOTAL_WIZARD_STEPS}>
        {/* Step 0 — Project Setup */}
        {step === 0 && (
          <StepCard stepKey="setup">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">{t("assessment.wizard.setupTitle")}</h1>
              <p className="text-muted-foreground">{t("assessment.wizard.setupSubtitle")}</p>
            </div>

            {setupError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6 text-red-700 text-sm">{setupError}</div>
            )}

            <form onSubmit={handleSetupSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("assessment.wizard.projectNameLabel")}</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder={t("assessment.wizard.projectNamePlaceholder")}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                  minLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("assessment.wizard.projectGoalLabel")}</label>
                <textarea
                  value={projectGoal}
                  onChange={(e) => setProjectGoal(e.target.value)}
                  placeholder={t("assessment.wizard.projectGoalPlaceholder")}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none"
                  required
                  minLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("assessment.wizard.reportLanguageLabel")}</label>
                <select
                  value={reportLanguage}
                  onChange={(e) => setReportLanguage(e.target.value as "ar" | "en" | "both")}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="ar">{t("assessment.wizard.reportLanguageArabic")}</option>
                  <option value="en">English</option>
                  <option value="both">{t("assessment.wizard.reportLanguageBoth")}</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {t("assessment.wizard.startButton")} <ChevronLeft className="h-5 w-5" />
              </button>
            </form>
          </StepCard>
        )}

        {/* Question Pages */}
        {step >= 1 && step <= totalQPages && (
          <StepCard stepKey={`q-${step}`}>
            <div className="mb-8">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                {t("assessment.wizard.questionRange")
                  .replace("{start}", String((step - 1) * Q_PER_PAGE + 1))
                  .replace("{end}", String(Math.min(step * Q_PER_PAGE, questions.length)))}
              </p>
              <h2 className="text-xl font-display font-bold text-foreground">
                {questions[(step - 1) * Q_PER_PAGE]?.block ?? t("assessment.wizard.fallbackBlock")}
              </h2>
            </div>

            <div className="space-y-8">
              {questions.slice((step - 1) * Q_PER_PAGE, step * Q_PER_PAGE).map((q, i) => {
                const globalIdx = (step - 1) * Q_PER_PAGE + i;
                const selected = getAnswer(q.questionId);
                return (
                  <div key={q.questionId}>
                    <p className="font-semibold text-foreground mb-3 leading-relaxed">
                      <span className="text-accent font-bold text-sm ml-1">{globalIdx + 1}.</span> {locale === "ar" ? q.questionAr : q.questionEn}
                    </p>
                    <div className="grid gap-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt.optionId}
                          onClick={() => setAnswer(q.questionId, opt.optionId)}
                          className={`w-full px-4 py-3 text-start rounded-xl border-2 text-sm font-medium transition-all ${
                            selected === opt.optionId
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-background text-foreground hover:border-primary/40"
                          }`}
                        >
                          {locale === "ar" ? opt.textAr : opt.textEn}
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
                <ChevronRight className="h-4 w-4" /> {t("common.actions.back")}
              </button>
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!pageComplete(step)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-1 justify-center"
              >
                {step === totalQPages ? t("assessment.wizard.goToFinalStep") : t("common.actions.next")} <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </StepCard>
        )}

        {/* Open Question Step */}
        {step === OPEN_STEP && (
          <StepCard stepKey="open">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shrink-0">
                <MessageSquare className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{t("assessment.wizard.finalStepEyebrow")}</p>
                <h2 className="text-xl font-display font-bold text-foreground">{t("assessment.wizard.openTitle")}</h2>
              </div>
            </div>

            <p className="text-muted-foreground mb-2 leading-relaxed">
              {t("assessment.wizard.openDescription")}
            </p>
            <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              {t("assessment.wizard.openOptional")}
            </p>

            <textarea
              value={openAnswer}
              onChange={(e) => setOpenAnswer(e.target.value)}
              placeholder={t("assessment.wizard.openPlaceholder")}
              className="w-full bg-background border border-border rounded-xl px-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[160px] resize-none mb-2"
            />
            <div className="flex justify-end text-xs text-muted-foreground mb-8">
              <span>{openAnswer.length}/2000</span>
            </div>

            {setupError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-red-700 text-sm">{setupError}</div>
            )}

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setStep(OPEN_STEP - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary/30 transition-colors"
              >
                <ChevronRight className="h-4 w-4" /> {t("common.actions.back")}
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-gradient-to-l from-accent to-red-500 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-1 justify-center"
              >
                {submitting
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("assessment.wizard.submitting")}</>
                  : <><Zap className="h-4 w-4" /> {t("assessment.wizard.submitButton")}</>
                }
              </button>
            </div>
          </StepCard>
        )}
    </AssessmentShell>
  );
}
