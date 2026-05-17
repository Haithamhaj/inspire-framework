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
  UserRound,
} from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useI18n } from "@/i18n";
import {
  JourneyPanel,
  JourneyPrimaryButton,
  JourneyShell,
  JourneyStepIndicator,
} from "@/components/journey";

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

interface PreviousAssessmentReuse {
  id: string;
  projectName: string;
  projectGoal: string;
  domain: string | null;
  customDomain: string | null;
  domainSpecialization: string | null;
  projectContext: string | null;
  reportLanguage: "ar" | "en" | "both";
  answers: Answer[];
  openAnswer: string;
}

// ─── Wizard Config ────────────────────────────────────────
const Q_PER_PAGE = 3;
const OPEN_STEP_OFFSET = 1; // open step comes after all question pages

function apiUrl(path: string) {
  return `/api${path}`;
}

const DOMAIN_OPTIONS = [
  { value: "Coding / Software Development", labelKey: "assessment.wizard.domainOptions.coding" },
  { value: "IT / Systems & Support", labelKey: "assessment.wizard.domainOptions.it" },
  { value: "Marketing", labelKey: "assessment.wizard.domainOptions.marketing" },
  { value: "Education", labelKey: "assessment.wizard.domainOptions.education" },
  { value: "Finance", labelKey: "assessment.wizard.domainOptions.finance" },
  { value: "Operations", labelKey: "assessment.wizard.domainOptions.operations" },
  { value: "Sales / Customer Service", labelKey: "assessment.wizard.domainOptions.sales" },
  { value: "HR", labelKey: "assessment.wizard.domainOptions.hr" },
  { value: "Healthcare", labelKey: "assessment.wizard.domainOptions.healthcare" },
  { value: "Legal", labelKey: "assessment.wizard.domainOptions.legal" },
  { value: "Other", labelKey: "assessment.wizard.domainOptions.other" },
] as const;

function ProgressBar({
  step,
  totalSteps,
  answeredCount,
  totalQuestions,
  progressLabel,
  openStepLabel,
  timelineLabels,
}: {
  step: number;
  totalSteps: number;
  answeredCount: number;
  totalQuestions: number;
  progressLabel: (page: number, total: number) => string;
  openStepLabel: string;
  timelineLabels: {
    setup: string;
    questions: string;
    open: string;
    report: string;
    answered: string;
  };
}) {
  const pct = Math.round((step / totalSteps) * 100);
  const answerPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const isOpenStep = step >= totalSteps;
  const stages = [
    { label: timelineLabels.setup, state: "complete" },
    { label: timelineLabels.questions, state: isOpenStep ? "complete" : "current" },
    { label: timelineLabels.open, state: isOpenStep ? "current" : "upcoming" },
    { label: timelineLabels.report, state: "upcoming" },
  ] as const;

  return (
    <div className="w-full overflow-hidden rounded-[24px] border border-slate-400/10 bg-slate-950/55 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="border-b border-slate-400/10 p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-sm font-black text-slate-100">
              {step <= totalSteps - 1
                ? progressLabel(step, totalSteps - 1)
                : openStepLabel}
            </span>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {timelineLabels.answered
                .replace("{answered}", String(answeredCount))
                .replace("{total}", String(totalQuestions))}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-400/10 bg-slate-900/70 px-3 py-1 text-xs font-black text-slate-300">
              {answerPct}%
            </span>
            <span className="rounded-full bg-gradient-to-l from-rose-500 to-orange-500 px-3 py-1 text-xs font-black text-slate-950">
              {pct}%
            </span>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-l from-rose-400 to-orange-400"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="grid gap-2 p-3 sm:grid-cols-4 md:p-4">
        {stages.map((stage, index) => (
          <div
            key={stage.label}
            className={`relative rounded-2xl border px-3 py-3 transition-colors ${
              stage.state === "complete"
                ? "border-teal-300/20 bg-teal-500/[0.07]"
                : stage.state === "current"
                  ? "border-rose-300/30 bg-rose-500/[0.1] shadow-lg shadow-rose-950/15"
                  : "border-slate-400/10 bg-slate-900/35"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${
                  stage.state === "complete"
                    ? "border-teal-300/30 bg-teal-400/15 text-teal-100"
                    : stage.state === "current"
                      ? "border-rose-300/40 bg-rose-400/15 text-rose-100"
                      : "border-slate-500/20 bg-slate-800/60 text-slate-500"
                }`}
              >
                {stage.state === "complete" ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span
                className={`min-w-0 text-xs font-black leading-5 ${
                  stage.state === "upcoming" ? "text-slate-500" : "text-slate-100"
                }`}
              >
                {stage.label}
              </span>
            </div>
          </div>
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
        className="rounded-[28px] border border-slate-400/10 bg-slate-950/55 p-5 shadow-2xl shadow-black/30 ring-1 ring-slate-300/[0.04] backdrop-blur-2xl md:p-8"
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
  answeredCount,
  totalQuestions,
}: {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  answeredCount: number;
  totalQuestions: number;
}) {
  const showProgress = step > 0;
  const { dir, t } = useI18n();

  return (
    <JourneyShell
      dir={dir}
      eyebrow={t("assessment.shell.badge")}
      title={t("assessment.shell.title")}
      subtitle={t("assessment.shell.subtitle")}
      aside={
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-200/70">INSPIRE</p>
              <h2 className="mt-1 text-lg font-black leading-tight text-slate-100">{t("assessment.shell.sidebarTitle")}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                {t("assessment.shell.sidebarDescription")}
              </p>
            </div>
          </div>

          <JourneyStepIndicator
            steps={[
              { label: t("privacyConsent.title"), state: "complete" },
              { label: t("register.title"), state: "complete" },
              { label: t("assessment.wizard.setupTitle"), state: "complete" },
              { label: t("assessment.shell.questionsLabel"), state: "current" },
              { label: t("assessment.payment.eyebrow"), state: "upcoming" },
            ]}
          />

          <div className="grid gap-3">
            {[
              { icon: Target, label: t("assessment.shell.contextLabel"), value: t("assessment.shell.contextValue") },
              { icon: Layers3, label: t("assessment.shell.questionsLabel"), value: t("assessment.shell.questionsValue") },
              { icon: ShieldCheck, label: t("assessment.shell.privacyLabel"), value: t("assessment.shell.privacyValue") },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-slate-400/10 bg-slate-900/45 p-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-400/10 bg-slate-950/70 text-rose-200">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">{item.label}</p>
                  <p className="text-xs leading-5 text-slate-400">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <section className="min-w-0 space-y-5">
        <div className="rounded-[24px] border border-slate-400/10 bg-slate-950/45 p-5 shadow-xl shadow-black/20 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-bold text-rose-100">
                <Sparkles className="h-3.5 w-3.5" />
                {t("assessment.shell.badge")}
              </p>
              <h1 className="text-2xl font-black leading-tight text-slate-50 md:text-3xl">
                {t("assessment.shell.title")}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {t("assessment.shell.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-400/10 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-300">
              <Check className="h-4 w-4 text-rose-200" />
              {t("assessment.shell.noScores")}
            </div>
          </div>
        </div>

        {showProgress && (
          <ProgressBar
            step={step}
            totalSteps={totalSteps}
            answeredCount={answeredCount}
            totalQuestions={totalQuestions}
            progressLabel={(page, total) => t("assessment.progress.questions")
              .replace("{page}", String(page))
              .replace("{total}", String(total))}
            openStepLabel={t("assessment.progress.openStep")}
            timelineLabels={{
              setup: t("assessment.progress.setupStage"),
              questions: t("assessment.progress.questionsStage"),
              open: t("assessment.progress.openStage"),
              report: t("assessment.progress.reportStage"),
              answered: t("assessment.progress.answered"),
            }}
          />
        )}
        {children}
      </section>
    </JourneyShell>
  );
}

function ProcessingExperience() {
  const { dir, t } = useI18n();
  const [elapsed, setElapsed] = useState(0);
  const steps = [
    {
      icon: Brain,
      title: t("assessment.status.processingStepAnswersTitle"),
      description: t("assessment.status.processingStepAnswersDescription"),
    },
    {
      icon: Target,
      title: t("assessment.status.processingStepPatternTitle"),
      description: t("assessment.status.processingStepPatternDescription"),
    },
    {
      icon: Layers3,
      title: t("assessment.status.processingStepInstructionsTitle"),
      description: t("assessment.status.processingStepInstructionsDescription"),
    },
    {
      icon: ClipboardList,
      title: t("assessment.status.processingStepReportTitle"),
      description: t("assessment.status.processingStepReportDescription"),
    },
  ];
  const activeStep = Math.min(steps.length - 1, Math.floor(elapsed / 9));
  const progress = Math.min(96, 18 + elapsed * 2.4);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <JourneyShell
      dir={dir}
      eyebrow="INSPIRE"
      title={t("assessment.status.processingTitle")}
      subtitle={t("assessment.status.processingSubtitle")}
      aside={
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-100">{t("assessment.status.processingAsideTitle")}</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {t("assessment.status.processingAsideDescription")}
              </p>
            </div>
          </div>

          <JourneyStepIndicator
            steps={[
              { label: t("assessment.progress.setupStage"), state: "complete" },
              { label: t("assessment.progress.questionsStage"), state: "complete" },
              { label: t("assessment.progress.openStage"), state: "complete" },
              { label: t("assessment.progress.reportStage"), state: "current" },
            ]}
          />
        </div>
      }
    >
      <JourneyPanel className="mx-auto max-w-4xl overflow-hidden p-0">
        <div className="relative border-b border-slate-400/10 p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.14),transparent_42%)]" />
          <div className="relative flex flex-col items-center text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="mb-7 flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-rose-300/20 bg-rose-500/[0.08] shadow-2xl shadow-rose-950/30 ring-1 ring-rose-300/10 sm:h-28 sm:w-28 sm:rounded-[2rem]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-slate-400/10 bg-slate-950/80 text-rose-200 sm:h-20 sm:w-20 sm:rounded-[1.5rem]">
                <Brain className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
            </motion.div>

            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-bold text-rose-100">
              <Sparkles className="h-3.5 w-3.5" />
              {t("assessment.status.processingLiveLabel")}
            </p>
            <h2 className="max-w-2xl text-2xl font-black leading-tight text-slate-50 md:text-4xl">
              {t("assessment.status.processingTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              {t("assessment.status.processingSubtitle")}
            </p>

            <div className="mt-7 w-full max-w-xl">
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{t("assessment.status.processingProgressLabel")}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-l from-rose-400 via-orange-400 to-teal-300"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-4 md:grid-cols-2 md:p-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const state = index < activeStep ? "complete" : index === activeStep ? "current" : "upcoming";
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={`rounded-3xl border p-4 transition-colors ${
                  state === "complete"
                    ? "border-teal-300/20 bg-teal-500/[0.06]"
                    : state === "current"
                      ? "border-rose-300/30 bg-rose-500/[0.09] shadow-lg shadow-rose-950/15"
                      : "border-slate-400/10 bg-slate-900/35"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                      state === "complete"
                        ? "border-teal-300/30 bg-teal-400/15 text-teal-100"
                        : state === "current"
                          ? "border-rose-300/35 bg-rose-400/15 text-rose-100"
                          : "border-slate-500/20 bg-slate-800/60 text-slate-500"
                    }`}
                  >
                    {state === "complete" ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className={`text-sm font-black ${state === "upcoming" ? "text-slate-500" : "text-slate-100"}`}>
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-6 text-slate-400">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 border-t border-slate-400/10 bg-slate-950/35 px-6 py-4 text-sm text-slate-400">
          <Clock className="h-4 w-4" />
          <span>{t("assessment.status.processingTime")}</span>
        </div>
      </JourneyPanel>
    </JourneyShell>
  );
}

interface CheckoutConfig {
  provider: "lemon" | "paypal";
  clientId?: string;
  env?: string;
  price: number;
  testMode?: boolean;
}

interface DiscountInfo {
  valid: boolean;
  discountPercent: number;
  finalPrice: number;
  originalPrice: number;
}

interface NextAssessmentDiscount {
  code: string;
  discountPercent: number;
  finalPrice: number;
  originalPrice: number;
  maxUses: number | null;
  usedCount: number;
}

export default function Assess() {
  const { user, isLoading } = useAuth();
  const { dir, locale, t } = useI18n();

  const searchParams = new URLSearchParams(window.location.search);
  const previousAssessmentId = searchParams.get("prev");
  const resumeAssessmentId = searchParams.get("resume");

  const [step, setStep] = useState(0);
  const [domainChoice, setDomainChoice] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [domainSpecialization, setDomainSpecialization] = useState("");
  const [projectContext, setProjectContext] = useState("");
  const [reportLanguage, setReportLanguage] = useState<"ar" | "en" | "both">(() => locale);

  // v2 question bank (fetched from API)
  const [questions, setQuestions] = useState<V2Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState(false);

  // v2 answers
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [openAnswer, setOpenAnswer] = useState("");
  const [answerMode, setAnswerMode] = useState<"new" | "reuse">("new");
  const [previousReuse, setPreviousReuse] = useState<PreviousAssessmentReuse | null>(null);
  const [previousReuseLoading, setPreviousReuseLoading] = useState(Boolean(previousAssessmentId));
  const [previousReuseError, setPreviousReuseError] = useState("");

  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<"wizard" | "processing" | "error">("wizard");
  const [setupError, setSetupError] = useState("");
  const [, navigate] = useLocation();

  // ── Payment gate state ─────────────────────────────────
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "free" | "required" | "paid">("loading");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [checkoutConfig, setCheckoutConfig] = useState<CheckoutConfig | null>(null);
  const [paymentGatewayUnavailable, setPaymentGatewayUnavailable] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [checkingDiscount, setCheckingDiscount] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [processingFree, setProcessingFree] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(false);

  const startTime = useRef(Date.now());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // ── localStorage autosave — persists answers across refreshes/payment interruptions ──
  const LS_KEY = user ? `inspire_draft_answers_${user.id}` : null;

  // Restore saved answers on first load (only if no reuse mode and no pending answers).
  // Uses queueMicrotask to defer setState outside the effect body (avoids cascading-render lint rule).
  useEffect(() => {
    if (!LS_KEY || previousAssessmentId || resumeAssessmentId) return;
    const key = LS_KEY;
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(key);
        if (!saved) return;
        const parsed = JSON.parse(saved) as { answers?: Answer[]; openAnswer?: string };
        if (parsed.answers && parsed.answers.length > 0) {
          setAnswers((prev) => (prev.length > 0 ? prev : parsed.answers!));
          if (parsed.openAnswer) setOpenAnswer((prev) => prev || parsed.openAnswer!);
        }
      } catch {
        // ignore corrupt data
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LS_KEY]);

  // Autosave answers + openAnswer whenever they change
  useEffect(() => {
    if (!LS_KEY || answers.length === 0) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ answers, openAnswer }));
    } catch {
      // ignore quota errors
    }
  }, [answers, openAnswer, LS_KEY]);

  useEffect(() => {
    if (paymentStatus !== "required" || checkoutConfig) {
      return;
    }
    fetch(apiUrl("/billing/checkout-config"))
      .then((r) => r.json() as Promise<CheckoutConfig & { success: boolean }>)
      .then((config) => {
        if (config.success) setCheckoutConfig(config);
        else setPaymentGatewayUnavailable(true);
      })
      .catch(() => setPaymentGatewayUnavailable(true));
  }, [paymentStatus, checkoutConfig]);

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
      .then((r) => r.json() as Promise<{
        success: boolean;
        freeUsed: boolean;
        price: number;
        nextAssessmentDiscount?: NextAssessmentDiscount | null;
      }>)
      .then((d) => {
        if (d.nextAssessmentDiscount) {
          setDiscountCode(d.nextAssessmentDiscount.code);
          setDiscountInfo({
            valid: true,
            discountPercent: d.nextAssessmentDiscount.discountPercent,
            finalPrice: d.nextAssessmentDiscount.finalPrice,
            originalPrice: d.nextAssessmentDiscount.originalPrice,
          });
        }
        if (resumeAssessmentId) {
          setPaymentStatus("required");
        } else if (d.freeUsed) {
          setPaymentStatus("required");
          fetch(apiUrl("/billing/checkout-config"))
            .then((r) => r.json() as Promise<CheckoutConfig & { success: boolean }>)
            .then((config) => {
              if (config.success) setCheckoutConfig(config);
              else setPaymentGatewayUnavailable(true);
            })
            .catch(() => setPaymentGatewayUnavailable(true));
        } else {
          setPaymentStatus("free");
        }
      })
      .catch(() => setPaymentStatus("free"));
  }, [user, resumeAssessmentId]);

  useEffect(() => {
    if (!resumeAssessmentId || !user) return;

    fetch(apiUrl(`/assessments/${resumeAssessmentId}/reuse-data`))
      .then((r) => r.json() as Promise<{
        success: boolean;
        assessment?: {
          id: string;
          status: string;
          domain: string;
          customDomain: string | null;
          domainSpecialization: string | null;
          projectContext: string | null;
          reportLanguage: "ar" | "en" | "both";
          answers: Answer[];
          openAnswer: string;
        };
        error?: string;
      }>)
      .then((d) => {
        if (!d.success || !d.assessment) {
          throw new Error(d.error ?? "تعذر تحميل التقييم المحفوظ");
        }
        if (d.assessment.status !== "pending_payment" && d.assessment.status !== "draft") {
          navigate(`/results/${d.assessment.id}`);
          return;
        }
        setAssessmentId(d.assessment.id);
        setDomainChoice(d.assessment.domain);
        setCustomDomain(d.assessment.customDomain ?? "");
        setDomainSpecialization(d.assessment.domainSpecialization ?? "");
        setProjectContext(d.assessment.projectContext ?? "");
        setReportLanguage(d.assessment.reportLanguage);
        setAnswers(d.assessment.answers);
        setOpenAnswer(d.assessment.openAnswer ?? "");
        setPendingPayment(true);
        setPaymentStatus("required");
      })
      .catch((err: unknown) => {
        setSetupError(err instanceof Error ? err.message : "تعذر تحميل التقييم المحفوظ");
      });
  }, [navigate, resumeAssessmentId, user]);

  useEffect(() => {
    if (!previousAssessmentId || !user) {
      return;
    }

    fetch(apiUrl(`/assessments/${previousAssessmentId}/reuse-data`))
      .then((r) => r.json() as Promise<{
        success: boolean;
        assessment?: PreviousAssessmentReuse;
        error?: string;
      }>)
      .then((d) => {
        if (!d.success || !d.assessment) {
          throw new Error(d.error ?? "تعذر تحميل إجابات التحليل السابق");
        }
        setPreviousReuse(d.assessment);
        setAnswerMode("reuse");
      })
      .catch((err: unknown) => {
        setAnswerMode("new");
        setPreviousReuseError(err instanceof Error ? err.message : "تعذر تحميل إجابات التحليل السابق");
      })
      .finally(() => setPreviousReuseLoading(false));
  }, [previousAssessmentId, user]);

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
      if (!d.success || !d.paymentId) throw new Error(d.error ?? t("assessment.payment.freeOrderError"));
      setPaymentId(d.paymentId);
      setPaymentStatus("paid");
      if (pendingPayment && assessmentId) {
        setPendingPayment(false);
        await submitAssessment(assessmentId, answers, openAnswer, d.paymentId);
      }
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : t("assessment.payment.freeOrderFallback"));
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
          finalPrice: d.finalPrice ?? checkoutConfig?.price ?? 10,
          originalPrice: d.originalPrice ?? checkoutConfig?.price ?? 10,
        });
      }
    } catch {
      // ignore
    } finally {
      setCheckingDiscount(false);
    }
  }

  async function handleLemonCheckout() {
    if (!assessmentId) {
      setPaymentError(locale === "ar" ? "تعذر تحديد التقييم الحالي. أعد المحاولة." : "Could not identify the current assessment. Please try again.");
      return;
    }
    setPaymentError("");
    try {
      const res = await fetch(apiUrl("/billing/create-order"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId,
          discountCode: (discountInfo?.valid && discountCode.trim()) ? discountCode.trim() : undefined,
        }),
      });
      const d = await res.json() as { success: boolean; checkoutUrl?: string; error?: string };
      if (!d.success || !d.checkoutUrl) {
        throw new Error(d.error ?? (locale === "ar" ? "تعذر إنشاء صفحة الدفع" : "Could not create checkout"));
      }
      window.location.href = d.checkoutUrl;
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : t("assessment.payment.paypalError"));
    }
  }

  if (isLoading || (!!user && paymentStatus === "loading")) {
    return (
      <JourneyShell dir={dir} eyebrow="INSPIRE" title={t("assessment.status.preparingTitle")} subtitle={t("assessment.status.preparingSubtitle")}>
        <JourneyPanel className="mx-auto flex min-h-[22rem] max-w-xl flex-col items-center justify-center text-center">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-rose-200" />
          <p className="text-lg font-black text-slate-50">{t("assessment.status.preparingTitle")}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{t("assessment.status.preparingSubtitle")}</p>
        </JourneyPanel>
      </JourneyShell>
    );
  }
  if (!user) return <Redirect to="/login" />;

  // ── Payment gate screen ────────────────────────────────
  if (paymentStatus === "required" && pendingPayment) {
    const displayPrice = discountInfo?.valid ? discountInfo.finalPrice : (checkoutConfig?.price ?? 10);
    const originalPrice = checkoutConfig?.price ?? 10;

    return (
      <JourneyShell
        dir={dir}
        eyebrow={t("assessment.payment.eyebrow")}
        title={previousAssessmentId ? t("assessment.payment.titleRetry") : t("assessment.payment.titleNew")}
        subtitle={previousAssessmentId ? t("assessment.payment.subtitleRetry") : t("assessment.payment.subtitleNew")}
        aside={
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-100">{t("assessment.payment.sidebarTitle")}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {t("assessment.payment.sidebarText")}
                </p>
              </div>
            </div>

            <JourneyStepIndicator
              steps={[
                { label: t("privacyConsent.title"), state: "complete" },
                { label: t("register.title"), state: "complete" },
                { label: t("assessment.progress.setupStage"), state: "complete" },
                { label: t("assessment.progress.questionsStage"), state: "complete" },
                { label: t("assessment.payment.eyebrow"), state: "current" },
                { label: t("assessment.progress.reportStage"), state: "upcoming" },
              ]}
            />
          </div>
        }
      >
        <div className="grid max-w-5xl gap-6">
          <JourneyPanel>
            <div className="mx-auto max-w-2xl">
              <div className="mb-7 text-center">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-rose-300/20 bg-rose-500/[0.1] text-rose-200 shadow-xl shadow-rose-950/25">
                  <CreditCard className="h-8 w-8" />
                </div>
                <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-bold text-rose-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("assessment.payment.eyebrow")}
                </p>
                <h2 className="text-3xl font-black leading-tight text-slate-50 md:text-4xl">
                  {previousAssessmentId ? t("assessment.payment.titleRetry") : t("assessment.payment.titleNew")}
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  {previousAssessmentId ? t("assessment.payment.subtitleRetry") : t("assessment.payment.subtitleNew")}
                </p>
              </div>

              <div className="mb-5 rounded-[28px] border border-slate-400/10 bg-slate-950/55 p-6 text-center shadow-xl shadow-black/20">
                {discountInfo?.valid ? (
                  <div>
                    <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      {t("assessment.payment.priceAfterDiscount")}
                    </div>
                    <div className="mb-2 flex items-end justify-center gap-3">
                      <div className="pb-1 text-sm text-slate-500 line-through">${originalPrice.toFixed(2)}</div>
                      <div className="text-4xl font-black text-rose-200">${displayPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-sm font-semibold text-teal-200">
                      {t("assessment.payment.discountApplied").replace("{percent}", String(discountInfo.discountPercent))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      {t("assessment.payment.oneTime")}
                    </div>
                    <div className="text-4xl font-black text-rose-200">${originalPrice.toFixed(2)}</div>
                    <div className="mt-2 text-sm text-slate-400">{t("assessment.payment.noSubscription")}</div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-slate-200">{t("assessment.payment.discountCodeLabel")}</label>
                {discountInfo?.valid && discountInfo.discountPercent === 50 && (
                  <div className="mb-3 rounded-2xl border border-teal-300/20 bg-teal-500/[0.08] px-4 py-3 text-sm leading-6 text-teal-100">
                    {locale === "ar"
                      ? "لأن لديك تحليلاً سابقاً، تم تطبيق خصم خاص لك 50% لهذا التحليل فقط. الكود صالح لمرة واحدة."
                      : "Because you already have a previous assessment, a private 50% discount has been applied for this assessment only. This code is one-time use."}
                  </div>
                )}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value.toUpperCase());
                      setDiscountInfo(null);
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter") checkDiscount(); }}
                    placeholder={t("assessment.payment.discountPlaceholder")}
                    className="input-ltr min-h-12 flex-1 rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3 text-sm font-mono text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={checkDiscount}
                    disabled={checkingDiscount || !discountCode.trim()}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-400/15 bg-slate-900/70 px-5 py-3 text-sm font-black text-slate-100 transition-all hover:border-rose-300/30 hover:bg-slate-800/75 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {checkingDiscount ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("assessment.payment.checkingDiscount")}
                      </>
                    ) : (
                      t("assessment.payment.checkDiscount")
                    )}
                  </button>
                </div>
                {discountInfo !== null && (
                  <p className={`mt-2 text-xs ${discountInfo.valid ? "text-teal-200" : "text-rose-300"}`}>
                    {discountInfo.valid
                      ? t("assessment.payment.discountValid").replace("{percent}", String(discountInfo.discountPercent))
                      : t("assessment.payment.discountInvalid")}
                  </p>
                )}
              </div>

              {discountInfo?.valid && displayPrice === 0 ? (
                <JourneyPrimaryButton
                  onClick={handleFreeOrder}
                  disabled={processingFree}
                  className="w-full"
                  icon={processingFree ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
                >
                  {processingFree
                    ? t("assessment.payment.activating")
                    : previousAssessmentId
                      ? t("assessment.payment.freeActivateRetry")
                      : t("assessment.payment.freeActivate")}
                </JourneyPrimaryButton>
              ) : checkoutConfig?.provider === "lemon" && !paymentGatewayUnavailable ? (
                <div className="rounded-3xl border border-slate-400/10 bg-slate-950/45 p-4">
                  {checkoutConfig.testMode && (
                    <div className="mb-3 rounded-2xl border border-amber-300/20 bg-amber-500/[0.08] px-4 py-3 text-sm leading-6 text-amber-100">
                      {locale === "ar"
                        ? "وضع الاختبار مفعل في Lemon Squeezy. استخدم بيانات اختبار فقط."
                        : "Lemon Squeezy test mode is active. Use test payment details only."}
                    </div>
                  )}
                  <JourneyPrimaryButton
                    onClick={handleLemonCheckout}
                    className="w-full"
                  >
                    {locale === "ar" ? "الدفع الآمن عبر Lemon Squeezy" : "Pay securely with Lemon Squeezy"}
                  </JourneyPrimaryButton>
                </div>
              ) : checkoutConfig?.provider === "paypal" && checkoutConfig.clientId && !paymentGatewayUnavailable ? (
                <div className="rounded-3xl border border-slate-400/10 bg-slate-950/45 p-3">
                  <PayPalScriptProvider options={{ clientId: checkoutConfig.clientId, currency: "USD" }}>
                    <PayPalButtons
                      style={{ layout: "vertical", shape: "rect", label: "pay" }}
                      createOrder={async () => {
                        setPaymentError("");
                        const res = await fetch(apiUrl("/billing/create-order"), {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            assessmentId,
                            discountCode: (discountInfo?.valid && discountCode.trim()) ? discountCode.trim() : undefined,
                          }),
                        });
                        const d = await res.json() as { success: boolean; orderId?: string; error?: string };
                        if (!d.success || !d.orderId) throw new Error(d.error ?? t("assessment.payment.createOrderError"));
                        return d.orderId;
                      }}
                      onApprove={async (data) => {
                        const res = await fetch(apiUrl("/billing/capture-order"), {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ orderId: data.orderID }),
                        });
                        const d = await res.json() as { success: boolean; paymentId?: string; error?: string };
                        if (!d.success || !d.paymentId) throw new Error(d.error ?? t("assessment.payment.captureOrderError"));
                        setPaymentId(d.paymentId);
                        setPaymentStatus("paid");
                        if (pendingPayment && assessmentId) {
                          setPendingPayment(false);
                          await submitAssessment(assessmentId, answers, openAnswer, d.paymentId);
                        }
                      }}
                      onError={(err) => {
                        setPaymentError(t("assessment.payment.paypalError"));
                        console.error("PayPal error:", err);
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              ) : paymentGatewayUnavailable ? (
                <div className="rounded-3xl border border-amber-300/20 bg-amber-500/[0.08] p-5 text-center">
                  <p className="text-sm font-black text-amber-100">
                    {t("assessment.payment.gatewayUnavailableTitle")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-amber-100/75">
                    {t("assessment.payment.gatewayUnavailableText")}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("assessment.payment.paypalLoading")}
                </div>
              )}

              {paymentError && (
                <p className="mt-3 text-center text-sm text-rose-300">{paymentError}</p>
              )}
            </div>
          </JourneyPanel>

          <JourneyPanel delay={0.12} className="overflow-hidden p-0">
            <div className="flex flex-col gap-3 border-b border-slate-400/10 bg-slate-950/35 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-100">{t("assessment.payment.previewTitle")}</p>
                  <p className="text-xs text-slate-500">{t("assessment.payment.previewSubtitle")}</p>
                </div>
              </div>
              <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
                {[
                  t("assessment.payment.previewTagQuestions"),
                  t("assessment.payment.previewTagPdf"),
                  t("assessment.payment.previewTagShare"),
                ].map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-400/10 bg-slate-900/70 px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="pointer-events-none select-none space-y-4 p-6 opacity-65 blur-[2.5px]">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    {t("assessment.payment.previewBehaviorTitle")}
                  </p>
                  <p className="text-sm leading-7 text-slate-300">
                    {t("assessment.payment.previewBehaviorText")}
                  </p>
                </div>
                <div className="rounded-2xl border border-rose-300/15 bg-rose-500/[0.08] p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-200/70">
                    {t("assessment.payment.previewPromptTitle")}
                  </p>
                  <p className="whitespace-pre-line font-mono text-xs leading-6 text-slate-200">
                    {t("assessment.payment.previewPromptText")}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-400/10 bg-slate-950/55 p-3">
                    <p className="mb-1 text-xs font-black text-slate-100">{t("assessment.payment.previewStrengthsTitle")}</p>
                    <p className="whitespace-pre-line text-xs leading-6 text-slate-400">{t("assessment.payment.previewStrengths")}</p>
                  </div>
                  <div className="rounded-xl border border-slate-400/10 bg-slate-950/55 p-3">
                    <p className="mb-1 text-xs font-black text-slate-100">{t("assessment.payment.previewGrowthTitle")}</p>
                    <p className="whitespace-pre-line text-xs leading-6 text-slate-400">{t("assessment.payment.previewGrowth")}</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="max-w-xs rounded-3xl border border-rose-300/20 bg-slate-950/90 px-6 py-4 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
                  <p className="mb-1 text-sm font-black text-slate-50">{t("assessment.payment.previewOverlayTitle")}</p>
                  <p className="text-xs text-slate-400">{t("assessment.payment.previewOverlaySubtitle")}</p>
                </div>
              </div>
            </div>
          </JourneyPanel>
        </div>
      </JourneyShell>
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

  async function submitAssessment(
    targetAssessmentId: string,
    selectedAnswers: Answer[],
    selectedOpenAnswer: string,
    overridePaymentId?: string,
  ) {
    if (submitting) return;
    setSubmitting(true);
    const elapsed = Math.max(1, Math.round((Date.now() - startTime.current) / 1000));
    try {
      const res = await fetch(apiUrl(`/assessments/${targetAssessmentId}/submit`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: selectedAnswers,
          ...(selectedOpenAnswer.trim() ? { open_answer: selectedOpenAnswer.trim() } : {}),
          completion_time_seconds: elapsed,
          ...((overridePaymentId ?? paymentId) ? { payment_id: overridePaymentId ?? paymentId } : {}),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || data.error || "فشل الإرسال");
      }
      // Answers saved — payment required before generating the report
      if (data.status === "pending_payment") {
        setPaymentStatus("required");
        setPendingPayment(true);
        setSubmitting(false);
        return;
      }
      // Clear autosaved draft now that submission is successful
      if (LS_KEY) {
        try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
      }
      setPhase("processing");
      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch(apiUrl(`/assessments/${targetAssessmentId}/status`));
          const d = await r.json();
          if (!d.success) return;
          if (d.assessment.status === "completed") {
            clearInterval(pollRef.current!);
            navigate(`/results/${targetAssessmentId}`);
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

  // ── Setup submit ───────────────────────────────────────

  async function handleSetupSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!domainChoice || (domainChoice === "Other" && !customDomain.trim())) return;
    const context = projectContext.trim();
    if (answerMode === "reuse" && !context) {
      setSetupError(
        locale === "ar"
          ? "عند استخدام نفس الإجابات، يجب إدخال سياق/هدف جديد حتى يتأثر التحليل الجديد بالدومين."
          : "When reusing answers, add a new context/goal so the new analysis is affected by the selected domain."
      );
      return;
    }
    setSetupError("");
    try {
      const res = await fetch(apiUrl("/assessments/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: context ? context.slice(0, 120) : `${domainChoice === "Other" ? customDomain.trim() : domainChoice} project`,
          project_goal: context || `Use AI support within ${domainChoice === "Other" ? customDomain.trim() : domainChoice}.`,
          domain: domainChoice,
          ...(domainChoice === "Other" ? { custom_domain: customDomain.trim() } : {}),
          ...(domainSpecialization.trim() ? { domain_specialization: domainSpecialization.trim() } : {}),
          ...(context ? { project_context: context } : {}),
          report_language: reportLanguage,
          assessment_type: "full",
          ...(previousAssessmentId ? { previous_assessment_id: previousAssessmentId } : {}),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "فشل بدء التقييم");
      setAssessmentId(data.assessmentId);
      startTime.current = Date.now();
      if (answerMode === "reuse" && previousReuse) {
        setAnswers(previousReuse.answers);
        setOpenAnswer(previousReuse.openAnswer ?? "");
        if (paymentStatus === "required") {
          setPendingPayment(true);
          return;
        }
        await submitAssessment(data.assessmentId, previousReuse.answers, previousReuse.openAnswer ?? "");
        return;
      }
      setStep(1);
    } catch (err: unknown) {
      setSetupError(err instanceof Error ? err.message : "فشل بدء التقييم");
    }
  }

  // ── Final submit ───────────────────────────────────────

  async function handleFinalSubmit() {
    if (!assessmentId || submitting) return;
    setPaymentError("");
    await submitAssessment(assessmentId, answers, openAnswer);
  }

  // ── Processing screen ──────────────────────────────────

  if (phase === "processing") {
    return <ProcessingExperience />;
  }

  // ── Error screen ───────────────────────────────────────

  if (phase === "error") {
    return (
      <JourneyShell dir={dir} eyebrow="INSPIRE" title={t("assessment.status.errorTitle")}>
        <JourneyPanel className="mx-auto max-w-lg text-center">
          <p className="mb-6 text-xl text-rose-200">{t("assessment.status.errorTitle")}</p>
          <button onClick={() => { setPhase("wizard"); setSubmitting(false); }} className="mx-auto flex items-center gap-2 rounded-2xl border border-slate-400/15 bg-slate-900/70 px-6 py-3 font-bold text-slate-100 transition-colors hover:border-rose-300/30 hover:bg-slate-800/75">
            <RotateCcw className="h-4 w-4" /> {t("assessment.status.errorRetry")}
          </button>
        </JourneyPanel>
      </JourneyShell>
    );
  }

  // ── Loading questions ──────────────────────────────────

  if (questionsLoading) {
    return (
      <JourneyShell dir={dir} eyebrow="INSPIRE" title={t("assessment.status.loadingQuestionsTitle")} subtitle={t("assessment.status.loadingQuestionsSubtitle")}>
        <JourneyPanel className="mx-auto flex min-h-[22rem] max-w-xl flex-col items-center justify-center text-center">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-rose-200" />
          <p className="text-lg font-black text-slate-50">{t("assessment.status.loadingQuestionsTitle")}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{t("assessment.status.loadingQuestionsSubtitle")}</p>
        </JourneyPanel>
      </JourneyShell>
    );
  }

  if (questionsError) {
    return (
      <JourneyShell dir={dir} eyebrow="INSPIRE" title={t("assessment.status.questionsError")}>
        <JourneyPanel className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-medium text-slate-100">{t("assessment.status.questionsError")}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-2xl bg-gradient-to-l from-rose-500 to-orange-500 px-6 py-3 text-sm font-black text-slate-950 transition-colors hover:from-rose-400 hover:to-orange-400"
        >
          {t("assessment.status.questionsRetry")}
        </button>
        </JourneyPanel>
      </JourneyShell>
    );
  }

  if (step === 0) {
    const userName = String((user as { name?: unknown }).name ?? "").trim();

    return (
      <JourneyShell
        dir={dir}
        eyebrow={t("assessment.shell.badge")}
        title={t("assessment.wizard.setupTitle")}
        subtitle={t("assessment.wizard.setupSubtitle")}
        aside={
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-100">INSPIRE</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {t("assessment.shell.sidebarDescription")}
                </p>
              </div>
            </div>

            <JourneyStepIndicator
              steps={[
                { label: t("privacyConsent.title"), state: "complete" },
                { label: t("register.title"), state: "complete" },
                { label: t("assessment.payment.eyebrow"), state: "complete" },
                { label: t("assessment.wizard.setupTitle"), state: "current" },
                { label: t("assessment.shell.questionsLabel"), state: "upcoming" },
              ]}
            />
          </div>
        }
      >
        <JourneyPanel className="max-w-3xl">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.1] text-rose-200 shadow-lg shadow-rose-950/25">
              <ClipboardList className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-200/80">
                {t("assessment.shell.badge")}
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-50">{t("assessment.wizard.setupTitle")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{t("assessment.wizard.setupSubtitle")}</p>
            </div>
          </div>

          <div className="mb-7 rounded-3xl border border-slate-400/10 bg-slate-900/40 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-100">
                  {userName ? `جاهز نبدأ يا ${userName}؟` : "جاهز نبدأ؟"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  أدخل اسم المشروع وهدفك الرئيسي، وسنستخدمهما فقط لتوجيه الأسئلة والتقرير حول سياقك الحقيقي.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    t("assessment.shell.contextLabel"),
                    t("assessment.shell.questionsLabel"),
                    t("assessment.shell.privacyLabel"),
                  ].map((label) => (
                    <span key={label} className="rounded-full border border-slate-400/10 bg-slate-950/45 px-3 py-1 text-xs font-bold text-slate-300">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {previousAssessmentId && (
            <div className="mb-7 rounded-3xl border border-slate-400/10 bg-slate-950/45 p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-100">
                    {locale === "ar" ? "إجابات التحليل السابق" : "Previous assessment answers"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {locale === "ar"
                      ? "اختر هل تريد الإجابة على الأسئلة من جديد، أو استخدام نفس إجاباتك السلوكية السابقة مع دومين وسياق جديد."
                      : "Choose whether to answer again or reuse your previous behavioral answers with a new domain and context."}
                  </p>
                  {previousReuse && (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {locale === "ar"
                        ? `الإجابات السابقة محفوظة من: ${previousReuse.projectName}`
                        : `Previous answers saved from: ${previousReuse.projectName}`}
                    </p>
                  )}
                </div>
              </div>

              {previousReuseLoading ? (
                <div className="flex items-center gap-2 rounded-2xl border border-slate-400/10 bg-slate-900/45 px-4 py-3 text-sm text-slate-300">
                  <Loader2 className="h-4 w-4 animate-spin text-rose-200" />
                  {locale === "ar" ? "جاري تحميل الإجابات السابقة..." : "Loading previous answers..."}
                </div>
              ) : previousReuseError ? (
                <div className="rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] px-4 py-3 text-sm text-rose-200">
                  {previousReuseError}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setAnswerMode("reuse")}
                    disabled={!previousReuse}
                    className={`rounded-2xl border p-4 text-start transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                      answerMode === "reuse"
                        ? "border-rose-300/35 bg-rose-500/[0.1] ring-2 ring-rose-500/10"
                        : "border-slate-400/10 bg-slate-900/45 hover:border-rose-300/25"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-100">
                      <Check className="h-4 w-4 text-rose-200" />
                      {locale === "ar" ? "استخدم نفس الإجابات" : "Reuse previous answers"}
                    </div>
                    <p className="text-xs leading-5 text-slate-400">
                      {locale === "ar"
                        ? "سيتم تخطي الأسئلة السلوكية فقط. يجب اختيار الدومين وإدخال السياق الحالي قبل التوليد."
                        : "Only behavioral questions will be skipped. You still need to choose the domain and enter the current context before generation."}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswerMode("new");
                      setAnswers([]);
                      setOpenAnswer("");
                    }}
                    className={`rounded-2xl border p-4 text-start transition-all ${
                      answerMode === "new"
                        ? "border-rose-300/35 bg-rose-500/[0.1] ring-2 ring-rose-500/10"
                        : "border-slate-400/10 bg-slate-900/45 hover:border-rose-300/25"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-100">
                      <ClipboardList className="h-4 w-4 text-rose-200" />
                      {locale === "ar" ? "أجيب من جديد" : "Answer again"}
                    </div>
                    <p className="text-xs leading-5 text-slate-400">
                      {locale === "ar"
                        ? "ستمر على الأسئلة كاملة وتبني تحليلاً جديداً من إجابات جديدة."
                        : "You will go through the full questions and build a new analysis from new answers."}
                    </p>
                  </button>
                </div>
              )}
            </div>
          )}

          {setupError && (
            <div className="mb-6 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-3 text-sm text-rose-200">
              {setupError}
            </div>
          )}

          <form onSubmit={handleSetupSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">{t("assessment.wizard.domainLabel")}</label>
              <select
                value={domainChoice}
                onChange={(e) => {
                  setDomainChoice(e.target.value);
                  if (e.target.value !== "Other") setCustomDomain("");
                }}
                className="w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3.5 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                required
              >
                <option value="">{t("assessment.wizard.domainPlaceholder")}</option>
                {DOMAIN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            {domainChoice === "Other" && (
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-200">{t("assessment.wizard.customDomainLabel")}</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder={t("assessment.wizard.customDomainPlaceholder")}
                  className="w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3.5 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                  required
                  minLength={2}
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">{t("assessment.wizard.domainSpecializationLabel")}</label>
              <input
                type="text"
                value={domainSpecialization}
                onChange={(e) => setDomainSpecialization(e.target.value)}
                placeholder={t("assessment.wizard.domainSpecializationPlaceholder")}
                className="w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3.5 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">{t("assessment.wizard.projectContextLabel")}</label>
              <textarea
                value={projectContext}
                onChange={(e) => setProjectContext(e.target.value)}
                placeholder={t("assessment.wizard.projectContextPlaceholder")}
                className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3.5 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">{t("assessment.wizard.reportLanguageLabel")}</label>
              <select
                value={reportLanguage}
                onChange={(e) => setReportLanguage(e.target.value as "ar" | "en" | "both")}
                className="w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3.5 text-slate-100 outline-none transition-all focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
              >
                <option value="ar">{t("assessment.wizard.reportLanguageArabic")}</option>
                <option value="en">{t("assessment.wizard.reportLanguageEnglish")}</option>
                <option value="both">{t("assessment.wizard.reportLanguageBoth")}</option>
              </select>
            </div>

            <div className="pt-3">
              <JourneyPrimaryButton
                type="submit"
                className="w-full"
                disabled={previousReuseLoading || (answerMode === "reuse" && !previousReuse)}
                icon={submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
              >
                {submitting
                  ? t("assessment.wizard.submitting")
                  : answerMode === "reuse" && previousReuse
                    ? (locale === "ar" ? "استخدم الإجابات وابدأ التوليد" : "Reuse answers and generate")
                    : t("assessment.wizard.startButton")}
              </JourneyPrimaryButton>
            </div>
          </form>
        </JourneyPanel>
      </JourneyShell>
    );
  }

  // ── WIZARD ─────────────────────────────────────────────

  return (
    <AssessmentShell
      step={step}
      totalSteps={TOTAL_WIZARD_STEPS}
      answeredCount={answers.length}
      totalQuestions={questions.length}
    >
        {/* Question Pages */}
        {step >= 1 && step <= totalQPages && (
          <StepCard stepKey={`q-${step}`}>
            <div className="mb-7 rounded-3xl border border-slate-400/10 bg-slate-900/45 p-4 md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    {t("assessment.wizard.questionRange")
                      .replace("{start}", String((step - 1) * Q_PER_PAGE + 1))
                      .replace("{end}", String(Math.min(step * Q_PER_PAGE, questions.length)))}
                  </p>
                  <h2 className="text-xl font-black leading-tight text-slate-50">
                    {questions[(step - 1) * Q_PER_PAGE]?.block ?? t("assessment.wizard.fallbackBlock")}
                  </h2>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.1] text-sm font-black text-rose-100 shadow-sm">
                  {step}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {questions.slice((step - 1) * Q_PER_PAGE, step * Q_PER_PAGE).map((q, i) => {
                const globalIdx = (step - 1) * Q_PER_PAGE + i;
                const selected = getAnswer(q.questionId);
                return (
                  <motion.div
                    key={q.questionId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.04 }}
                    className={`rounded-3xl border p-4 shadow-xl transition-all md:p-5 ${
                      selected
                        ? "border-teal-300/15 bg-teal-500/[0.04] shadow-teal-950/10 ring-1 ring-teal-300/[0.04]"
                        : "border-slate-400/10 bg-slate-900/35 shadow-black/10"
                    }`}
                  >
                    <div className="mb-4 flex items-start gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition-colors ${
                          selected
                            ? "border-teal-300/30 bg-teal-400/15 text-teal-100"
                            : "border-rose-300/20 bg-rose-500/[0.1] text-rose-100"
                        }`}
                      >
                        {selected ? <Check className="h-4 w-4" /> : globalIdx + 1}
                      </span>
                      <p className="pt-1 text-base font-bold leading-7 text-slate-100">
                        {locale === "ar" ? q.questionAr : q.questionEn}
                      </p>
                    </div>
                    <div className="grid gap-2.5">
                      {q.options.map((opt) => (
                        <motion.button
                          key={opt.optionId}
                          onClick={() => setAnswer(q.questionId, opt.optionId)}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.995 }}
                          className={`group flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-start text-sm font-semibold leading-6 transition-all md:px-5 ${
                            selected === opt.optionId
                              ? "border-rose-300/35 bg-rose-500/[0.1] text-rose-100 shadow-lg shadow-rose-950/15 ring-2 ring-rose-500/10"
                              : "border-slate-400/10 bg-slate-950/55 text-slate-200 hover:border-rose-300/25 hover:bg-slate-900/70"
                          }`}
                        >
                          <span className="min-w-0 flex-1">{locale === "ar" ? opt.textAr : opt.textEn}</span>
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                              selected === opt.optionId
                                ? "border-rose-300 bg-rose-500 text-slate-950"
                                : "border-slate-500/30 bg-slate-950/70 text-transparent group-hover:border-rose-300/40"
                            }`}
                            aria-hidden="true"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-7 flex flex-col-reverse justify-between gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-400/15 bg-slate-900/50 px-6 py-3 font-bold text-slate-200 transition-colors hover:border-rose-300/30 hover:bg-slate-800/70"
              >
                <ChevronRight className="h-4 w-4" /> {t("common.actions.back")}
              </button>
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!pageComplete(step)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-rose-500 to-orange-500 px-6 py-3 font-black text-slate-950 transition-all hover:from-rose-400 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
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
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.1] text-rose-200">
                <MessageSquare className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.18em] mb-0.5">{t("assessment.wizard.finalStepEyebrow")}</p>
                <h2 className="text-xl font-black text-slate-50">{t("assessment.wizard.openTitle")}</h2>
              </div>
            </div>

            <p className="text-slate-400 mb-2 leading-relaxed">
              {t("assessment.wizard.openDescription")}
            </p>
            <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-200" />
              {t("assessment.wizard.openOptional")}
            </p>

            <textarea
              value={openAnswer}
              onChange={(e) => setOpenAnswer(e.target.value)}
              placeholder={t("assessment.wizard.openPlaceholder")}
              className="w-full min-h-[160px] resize-none rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-4 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10 mb-2"
            />
            <div className="flex justify-end text-xs text-slate-500 mb-8">
              <span>{openAnswer.length}/2000</span>
            </div>

            {setupError && (
              <div className="rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-3 mb-4 text-rose-200 text-sm">{setupError}</div>
            )}

            <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={() => setStep(OPEN_STEP - 1)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-400/15 bg-slate-900/50 px-6 py-3 font-bold text-slate-200 transition-colors hover:border-rose-300/30 hover:bg-slate-800/70"
              >
                <ChevronRight className="h-4 w-4" /> {t("common.actions.back")}
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-rose-500 to-orange-500 px-6 py-3 font-black text-slate-950 transition-all hover:from-rose-400 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
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
