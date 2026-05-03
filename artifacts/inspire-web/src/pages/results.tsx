import { useEffect, useMemo, useState } from "react";
import { useParams, Redirect, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  CheckCircle2,
  Zap,
  MessageSquare,
  Copy,
  Check,
  Loader2,
  Download,
  ChevronRight,
  AlertTriangle,
  Share2,
  LinkIcon,
  Trash2,
  Sparkles,
  ShieldAlert,
  BookOpen,
  Settings2,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n, useT } from "@/i18n";
import {
  ReportBlock,
  MismatchNotice,
  type ReportLanguage,
} from "@/components/premium/ReportBlock";

function apiUrl(path: string) {
  return `/api${path}`;
}

interface InspireRow {
  axis: string;
  score: number;
  percentage: number;
  note?: string;
}

interface AssessmentDto {
  id: string;
  status: string;
  projectName: string;
  projectGoal: string;
  reportLanguage: string;
  assessmentType: string;
  aiProvider: string | null;
  aiModel: string | null;
  createdAt: string;
  completionTimeSeconds: number | null;
  pdfUrl: string | null;
  inspireTable: InspireRow[] | null;
  roleAnalysis: string | null;
  redLines: string[] | null;
  strengths: string[] | null;
  developmentAreas: string[] | null;
  recommendations: string[] | null;
  systemInstruction: string | null;
  quickStarters: string[] | null;
  shareToken: string | null;
  shareEnabled: boolean;
  previousAssessmentId: string | null;
  previousInspireTable: InspireRow[] | null;
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-white/5 rounded-xl ${className ?? ""}`}
    />
  );
}

function ResultsSkeleton() {
  return (
    <div className="w-full max-w-4xl space-y-6 mx-auto">
      <Skeleton className="h-44 rounded-3xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
      <div className="grid md:grid-cols-2 gap-4">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-hidden bg-[#0b0d1f] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0d1f] via-[#0e1130] to-[#0a0c1c]" />
        <div className="absolute -top-40 -end-40 w-[700px] h-[700px] rounded-full bg-rose-500/10 blur-[160px]" />
        <div className="absolute top-[40%] -start-40 w-[700px] h-[700px] rounded-full bg-violet-500/10 blur-[160px]" />
        <div className="absolute bottom-0 end-1/3 w-[500px] h-[500px] rounded-full bg-teal-500/8 blur-[140px]" />
      </div>
      {children}
    </div>
  );
}

// ── Section heading primitive ────────────────────────────────────────────────
function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-[11px] uppercase tracking-widest text-white/45 font-semibold mb-2">
        {eyebrow}
      </p>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/60 text-sm md:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Inline copy button ───────────────────────────────────────────────────────
function CopyButton({
  text,
  label,
  successLabel,
  variant = "ghost",
  size = "sm",
}: {
  text: string;
  label: string;
  successLabel: string;
  variant?: "ghost" | "primary";
  size?: "sm" | "md" | "lg";
}) {
  const [copied, setCopied] = useState(false);
  function onClick() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.97]";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3.5 text-base",
  } as const;
  const variants = {
    ghost:
      "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10",
    primary:
      "bg-gradient-to-l from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40",
  } as const;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="ok"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {successLabel}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const t = useT();
  const { locale } = useI18n();

  const [assessment, setAssessment] = useState<AssessmentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [sharingLoading, setSharingLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id || authLoading || !user) return;

    let cancelled = false;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;

    async function fetchResult() {
      try {
        const res = await fetch(apiUrl(`/results/${id}`));
        const d = await res.json();
        if (cancelled) return;
        if (!d.success) throw new Error(d.error || "Not found");

        if (d.assessment.status === "processing" || d.assessment.status === "draft") {
          setProcessing(true);
          setLoading(false);
          // Poll every 4 seconds
          pollTimer = setTimeout(fetchResult, 4000);
        } else {
          setProcessing(false);
          setAssessment(d.assessment);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "حدث خطأ");
          setLoading(false);
        }
      }
    }

    fetchResult();
    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [id, user, authLoading]);

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function buildShareUrl(shareToken: string) {
    return `${window.location.origin}${import.meta.env.BASE_URL}share/${shareToken}`.replace(/\/+/g, "/").replace(":/", "://");
  }

  async function handleShare() {
    if (!id || sharingLoading) return;
    setSharingLoading(true);
    setShareMsg(null);
    try {
      const res = await fetch(apiUrl(`/results/${id}/share`), { method: "POST" });
      const d = await res.json();
      if (!d.success) throw new Error(d.error || "فشل إنشاء رابط المشاركة");
      const url = buildShareUrl(d.shareToken);
      setAssessment((prev) => prev ? { ...prev, shareToken: d.shareToken as string, shareEnabled: true } : prev);
      await navigator.clipboard.writeText(url);
      setShareMsg(`${t("results.header.linkCopiedPrefix")} ${url}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      setShareMsg(msg);
    } finally {
      setSharingLoading(false);
    }
  }

  async function handleRevokeShare() {
    if (!id || sharingLoading) return;
    setSharingLoading(true);
    setShareMsg(null);
    try {
      const res = await fetch(apiUrl(`/results/${id}/share`), { method: "DELETE" });
      const d = await res.json();
      if (!d.success) throw new Error(d.error || "فشل إلغاء المشاركة");
      setAssessment((prev) => prev ? { ...prev, shareToken: null, shareEnabled: false } : prev);
      setShareMsg(t("results.header.shareCancelled"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      setShareMsg(msg);
    } finally {
      setSharingLoading(false);
    }
  }

  async function handleGeneratePdf() {
    if (!id || generatingPdf) return;
    setGeneratingPdf(true);
    try {
      const res = await fetch(apiUrl(`/results/${id}/generate-pdf`), { method: "POST" });
      const d = await res.json();
      if (d.success && d.pdfUrl) {
        setAssessment((prev) => prev ? { ...prev, pdfUrl: d.pdfUrl as string } : prev);
        window.open(apiUrl(d.pdfUrl.replace("/api", "")), "_blank");
      }
    } finally {
      setGeneratingPdf(false);
    }
  }

  // ── Derive report language safely ────────────────────────────────────────
  const reportLang: ReportLanguage = useMemo(() => {
    const v = assessment?.reportLanguage;
    if (v === "ar" || v === "en" || v === "both") return v;
    return "ar";
  }, [assessment?.reportLanguage]);
  const reportLangSingle: "ar" | "en" =
    reportLang === "en" ? "en" : "ar";

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#0b0d1f]">
        <Loader2 className="h-10 w-10 animate-spin text-rose-300" />
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;

  if (loading) {
    return (
      <PageShell>
        <div className="py-12 px-4">
          <ResultsSkeleton />
        </div>
      </PageShell>
    );
  }

  if (processing) {
    return (
      <PageShell>
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-12 shadow-xl text-center max-w-md w-full"
          >
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-rose-300/20" />
              <div className="absolute inset-0 rounded-full border-4 border-rose-300 border-t-transparent animate-spin" />
              <Brain className="absolute inset-0 m-auto h-8 w-8 text-rose-200" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {t("results.status.processingTitle")}
            </h2>
            <p className="text-white/70 text-sm mb-1">
              {t("results.status.processingLine1")}
            </p>
            <p className="text-white/45 text-xs">
              {t("results.status.processingLine2")}
            </p>
            <div className="mt-6 flex justify-center gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-rose-300 animate-bounce"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </PageShell>
    );
  }

  if (error || !assessment) {
    return (
      <PageShell>
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 shadow-xl text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-rose-300 mx-auto mb-4" />
            <p className="text-lg text-white mb-6">
              {error || t("results.status.errorMissing")}
            </p>
            <button
              onClick={() => navigate("/my-assessments")}
              className="bg-gradient-to-l from-rose-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {t("results.status.errorBack")}
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Mini assessment branch — preserved as-is from prior implementation ────
  if (assessment.assessmentType === "mini") {
    return (
      <div className="min-h-[calc(100vh-5rem)] py-12 px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl space-y-6"
        >
          {/* Mini Header */}
          <div className="bg-gradient-to-br from-accent/80 to-accent rounded-3xl p-8 text-accent-foreground">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-white/80" />
              <span className="text-white/80 text-sm">تقرير البداية السريعة</span>
            </div>
            <h1 className="text-2xl font-display font-bold mb-1">{assessment.projectName}</h1>
            <p className="text-white/70 text-sm">{assessment.projectGoal}</p>
            <div className="mt-4">
              <button
                onClick={() => navigate("/my-assessments")}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <ChevronRight className="h-4 w-4" /> تقاريري
              </button>
            </div>
          </div>

          {/* Quick Starters */}
          {Array.isArray(assessment.quickStarters) && assessment.quickStarters.length > 0 ? (
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display font-bold text-xl text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent" /> نقاط انطلاقك مع الذكاء الاصطناعي
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                انسخ أي بادئة وأرسلها مباشرةً إلى ChatGPT أو أي نموذج ذكاء اصطناعي
              </p>
              <div className="space-y-3">
                {assessment.quickStarters.map((qs: string, i: number) => (
                  <div
                    key={i}
                    onClick={() => copyText(qs, `qs-${i}`)}
                    className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl group cursor-pointer hover:bg-secondary transition-colors"
                  >
                    <span className="font-bold text-accent shrink-0 text-lg">{i + 1}.</span>
                    <p className="text-sm text-foreground leading-relaxed flex-1">{qs}</p>
                    {copied === `qs-${i}` ? (
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Upgrade CTA */}
          <div className="bg-gradient-to-l from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6 text-right">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground mb-1">احصل على تعليمات النظام الكاملة</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  التقييم الكامل يُحلّل 7 محاور سلوكية بعمق ويولّد تعليمات نظام شخصية جاهزة للنسخ مباشرةً إلى أي نموذج ذكاء اصطناعي — مع تقرير PDF قابل للمشاركة.
                </p>
                <button
                  onClick={() => navigate("/assess")}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  ابدأ التقييم الكامل — $10
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Full results premium render ───────────────────────────────────────────
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const dateLocale = t("results.dateLocale");
  const formattedDate = assessment.createdAt
    ? new Date(assessment.createdAt).toLocaleDateString(dateLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const identityTags = [
    t("results.identity.tagPartner"),
    t("results.identity.tagReviewer"),
    t("results.identity.tagContextAware"),
    t("results.identity.tagOutcomeFocused"),
  ];

  const platforms: Array<{
    id: "chatgpt" | "gemini" | "claude";
    name: string;
    accent: string;
    steps: [string, string, string];
  }> = [
    {
      id: "chatgpt",
      name: t("results.platforms.chatgpt.name"),
      accent: "from-emerald-500/30 to-teal-500/20",
      steps: [
        t("results.platforms.chatgpt.step1"),
        t("results.platforms.chatgpt.step2"),
        t("results.platforms.chatgpt.step3"),
      ],
    },
    {
      id: "gemini",
      name: t("results.platforms.gemini.name"),
      accent: "from-sky-500/30 to-indigo-500/20",
      steps: [
        t("results.platforms.gemini.step1"),
        t("results.platforms.gemini.step2"),
        t("results.platforms.gemini.step3"),
      ],
    },
    {
      id: "claude",
      name: t("results.platforms.claude.name"),
      accent: "from-rose-500/30 to-orange-500/20",
      steps: [
        t("results.platforms.claude.step1"),
        t("results.platforms.claude.step2"),
        t("results.platforms.claude.step3"),
      ],
    },
  ];

  const profileText = assessment.systemInstruction ?? "";

  return (
    <PageShell>
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 md:py-14 space-y-10 md:space-y-14">
        {/* ── 1. RESULTS-READY HEADER ─────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 text-[11px] font-medium tracking-widest uppercase text-white/70 mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {t("results.status.ready")}
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl leading-[1.25] mb-4 text-white">
            {t("results.header.titlePrefix")}{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-l from-rose-300 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                {t("results.header.titleConnector")}{" "}
                <span
                  lang={reportLangSingle}
                  dir={reportLangSingle === "ar" ? "rtl" : "ltr"}
                  className="inline"
                >
                  {assessment.projectName}
                </span>
              </span>
              <span className="absolute -bottom-1 inset-x-0 h-[3px] bg-gradient-to-l from-rose-400/80 to-orange-300/80 rounded-full" />
            </span>
          </h1>

          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-3">
            {t("results.header.subtitle")}
          </p>

          {assessment.projectGoal && (
            <ReportBlock
              lang={reportLangSingle}
              className="text-white/55 text-sm max-w-2xl mx-auto mb-6"
            >
              <span className="text-white/40">
                {t("results.projectGoalLabel")}:
              </span>{" "}
              {assessment.projectGoal}
            </ReportBlock>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            {profileText && (
              <CopyButton
                text={profileText}
                label={t("results.header.ctaPrimary")}
                successLabel={t("results.header.ctaPrimarySuccess")}
                variant="primary"
                size="lg"
              />
            )}
            <a
              href="#how-to-use"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 text-base font-semibold transition-all active:scale-[0.98]"
            >
              {t("results.header.ctaSecondary")}
              <Arrow className="h-4 w-4" />
            </a>
          </div>

          {/* Secondary actions: my reports / pdf / share */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <button
              onClick={() => navigate("/my-assessments")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
              {t("results.header.myAssessments")}
            </button>
            {assessment.pdfUrl ? (
              <a
                href={apiUrl(assessment.pdfUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
              >
                <Download className="h-4 w-4" /> {t("results.header.downloadPdf")}
              </a>
            ) : (
              <button
                onClick={handleGeneratePdf}
                disabled={generatingPdf}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-60"
              >
                {generatingPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {generatingPdf
                  ? t("results.header.generatingPdf")
                  : t("results.header.generatePdf")}
              </button>
            )}
            {assessment.shareEnabled ? (
              <button
                onClick={handleRevokeShare}
                disabled={sharingLoading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-rose-400/20 border border-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-60"
              >
                {sharingLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {sharingLoading
                  ? t("results.header.revoking")
                  : t("results.header.revokeShare")}
              </button>
            ) : (
              <button
                onClick={handleShare}
                disabled={sharingLoading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-60"
              >
                {sharingLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {sharingLoading
                  ? t("results.header.sharing")
                  : t("results.header.share")}
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/45">
            {(assessment.aiModel || assessment.aiProvider) && (
              <span>
                {t("results.header.generatedBy")}:{" "}
                {assessment.aiModel ?? assessment.aiProvider}
              </span>
            )}
            {formattedDate && <span>{formattedDate}</span>}
          </div>

          <div className="mt-5 flex justify-center">
            <MismatchNotice reportLanguage={reportLang} />
          </div>
        </motion.section>

        {/* Share message */}
        {shareMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 text-sm text-white/85"
          >
            <LinkIcon className="h-4 w-4 text-rose-300 shrink-0 mt-0.5" />
            <span className="break-all">{shareMsg}</span>
          </motion.div>
        )}

        {/* ── 2. ASSISTANT IDENTITY CARD ──────────────────────────────── */}
        <motion.section
          id="identity"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative rounded-[2rem] bg-gradient-to-b from-[#13163a]/95 to-[#0d1030]/95 border border-white/10 backdrop-blur-xl p-7 md:p-10 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full bg-gradient-to-b from-rose-500/15 to-transparent blur-3xl pointer-events-none" />

            <div className="relative flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/30 to-orange-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10">
                <Sparkles className="h-5 w-5 text-rose-200" />
              </div>
              <div className="text-start">
                <p className="text-[11px] uppercase tracking-widest text-white/50 mb-1 font-semibold">
                  {t("results.identity.eyebrow")}
                </p>
                <h2 className="font-display font-bold text-xl md:text-2xl text-white">
                  {t("results.identity.titlePrefix")}{" "}
                  <span
                    lang={reportLangSingle}
                    dir={reportLangSingle === "ar" ? "rtl" : "ltr"}
                    className="inline"
                  >
                    {assessment.projectName}
                  </span>
                </h2>
              </div>
            </div>

            <ReportBlock
              lang={reportLangSingle}
              className="relative text-white/85 text-lg leading-[1.9] font-medium mb-6"
            >
              {assessment.roleAnalysis ?? t("results.identity.fallbackParagraph")}
            </ReportBlock>

            <div className="relative flex flex-wrap gap-2">
              {identityTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/8 border border-white/15 text-xs text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── 3. STRENGTHS ────────────────────────────────────────────── */}
        {Array.isArray(assessment.strengths) && assessment.strengths.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading
              eyebrow={t("results.strengths.eyebrow")}
              title={t("results.strengths.title")}
              subtitle={t("results.strengths.subtitle")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {assessment.strengths.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 p-5 hover:border-emerald-300/30 transition-colors overflow-hidden"
                >
                  <div className="absolute -top-12 -end-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-white/10 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  </div>
                  <ReportBlock
                    lang={reportLangSingle}
                    className="relative text-[15px] text-white/85 leading-relaxed"
                  >
                    {s}
                  </ReportBlock>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── 4. RED LINES ────────────────────────────────────────────── */}
        {Array.isArray(assessment.redLines) && assessment.redLines.length > 0 && (
          <motion.section
            id="redlines"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-rose-400/25">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/12 via-rose-500/4 to-transparent" />
              <div className="absolute -top-20 -start-20 w-64 h-64 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
              <div className="relative p-7 md:p-8">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-5 w-5 text-rose-300" />
                  </div>
                  <div className="text-start">
                    <p className="text-[11px] uppercase tracking-widest text-rose-300/70 mb-1 font-semibold">
                      {t("results.redLines.eyebrow")}
                    </p>
                    <h2 className="font-display font-bold text-xl md:text-2xl text-white">
                      {t("results.redLines.title")}
                    </h2>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {assessment.redLines.map((line, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-rose-300/30 transition-colors"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0 ring-4 ring-rose-400/20" />
                      <ReportBlock
                        lang={reportLangSingle}
                        className="text-white/85 text-[15px] leading-relaxed flex-1"
                      >
                        {line}
                      </ReportBlock>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        )}

        {/* ── 5. DEVELOPMENT AREAS (gentle framing) ───────────────────── */}
        {Array.isArray(assessment.developmentAreas) && assessment.developmentAreas.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading
              eyebrow={t("results.developmentAreas.eyebrow")}
              title={t("results.developmentAreas.title")}
              subtitle={t("results.developmentAreas.subtitle")}
            />
            <div className="mt-8 rounded-2xl bg-white/[0.03] border border-white/10 p-5 md:p-6 backdrop-blur-md">
              <ul className="space-y-2.5">
                {assessment.developmentAreas.map((d, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.025] border border-white/10"
                  >
                    <Lightbulb className="h-4 w-4 text-amber-300 mt-0.5 shrink-0" />
                    <ReportBlock
                      lang={reportLangSingle}
                      className="text-white/85 text-[15px] leading-relaxed flex-1"
                    >
                      {d}
                    </ReportBlock>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        )}

        {/* ── 6. RECOMMENDATIONS ──────────────────────────────────────── */}
        {Array.isArray(assessment.recommendations) && assessment.recommendations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading
              eyebrow={t("results.recommendations.eyebrow")}
              title={t("results.recommendations.title")}
              subtitle={t("results.recommendations.subtitle")}
            />
            <ol className="mt-8 space-y-3">
              {assessment.recommendations.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10"
                >
                  <span className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-rose-500/30 to-orange-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-rose-100">
                    {i + 1}
                  </span>
                  <ReportBlock
                    lang={reportLangSingle}
                    className="text-white/85 text-[15px] leading-relaxed flex-1 pt-1"
                  >
                    {r}
                  </ReportBlock>
                </li>
              ))}
            </ol>
          </motion.section>
        )}

        {/* ── 7. COPY-READY OPERATING PROFILE (friendly accordion) ────── */}
        {profileText && (
          <motion.section
            id="profile"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading
              eyebrow={t("results.profile.eyebrow")}
              title={t("results.profile.title")}
              subtitle={t("results.profile.subtitle")}
            />

            <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/25 to-orange-500/15 border border-white/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-rose-200" />
                  </div>
                  <div className="text-start">
                    <p className="text-sm font-bold text-white">
                      {t("results.profile.headerLabel")}
                    </p>
                    <p className="text-xs text-white/55">
                      {t("results.profile.headerHint")}
                    </p>
                  </div>
                </div>
                <CopyButton
                  text={profileText}
                  label={t("results.profile.copyAll")}
                  successLabel={t("results.profile.copyAllSuccess")}
                  variant="primary"
                  size="md"
                />
              </div>

              <div className="p-3 sm:p-5">
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="profile-body"
                  className="space-y-2"
                >
                  <AccordionItem
                    value="profile-body"
                    className="rounded-xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.04] transition-colors data-[state=open]:bg-white/[0.05] overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3.5 hover:no-underline group">
                      <div className="flex items-center gap-3 flex-1 text-start">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                          <Sparkles className="h-4 w-4 text-white/75" />
                        </div>
                        <span className="font-bold text-white text-[15px]">
                          {t("results.profile.headerLabel")}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-4 pb-4 pt-1">
                        <div className="rounded-xl bg-[#0a0c1c]/60 border border-white/10 p-4 mb-3">
                          <ReportBlock lang={reportLangSingle}>
                            <p className="text-[15px] text-white/85 leading-[1.95] whitespace-pre-line font-sans">
                              {profileText}
                            </p>
                          </ReportBlock>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </motion.section>
        )}

        {/* ── 8. WHERE TO USE IT ──────────────────────────────────────── */}
        <motion.section
          id="how-to-use"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow={t("results.howToUse.eyebrow")}
            title={t("results.howToUse.title")}
            subtitle={t("results.howToUse.subtitle")}
          />
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-2 sm:p-3">
            <Tabs defaultValue="chatgpt" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl gap-1 h-auto flex-wrap">
                {platforms.map((p) => (
                  <TabsTrigger
                    key={p.id}
                    value={p.id}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white/65 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
                  >
                    {p.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {platforms.map((p) => (
                <TabsContent key={p.id} value={p.id} className="mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`relative rounded-xl p-6 bg-gradient-to-br ${p.accent} border border-white/10`}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                        <Settings2 className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-white text-lg">
                        {t("results.howToUse.headingPrefix")} {p.name}
                      </h3>
                    </div>
                    <ol className="space-y-3">
                      {p.steps.map((step, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-black/20 border border-white/10"
                        >
                          <span className="shrink-0 w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sm font-bold text-white">
                            {i + 1}
                          </span>
                          <p className="text-white/85 text-[15px] leading-relaxed pt-0.5">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </motion.section>

        {/* ── 9. STARTER PROMPTS ──────────────────────────────────────── */}
        {Array.isArray(assessment.quickStarters) && assessment.quickStarters.length > 0 && (
          <motion.section
            id="starters"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading
              eyebrow={t("results.starters.eyebrow")}
              title={t("results.starters.title")}
              subtitle={t("results.starters.subtitle")}
            />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessment.quickStarters.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="group relative rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-white/25 p-5 transition-all overflow-hidden"
                >
                  <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start gap-3 mb-4">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500/30 to-orange-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-rose-100">
                      {i + 1}
                    </span>
                    <ReportBlock
                      lang={reportLangSingle}
                      className="text-white/90 text-[15px] leading-relaxed flex-1"
                    >
                      {s}
                    </ReportBlock>
                  </div>
                  <div className="relative flex justify-end">
                    <CopyButton
                      text={s}
                      label={t("common.copy.label")}
                      successLabel={t("common.copy.copied")}
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-l from-rose-500/10 to-orange-500/5 p-6 text-center"
        >
          <p className="text-white font-semibold mb-4">
            {t("results.newCta.line")}
          </p>
          <button
            onClick={() => navigate("/assess")}
            className="inline-flex items-center gap-2 bg-gradient-to-l from-rose-500 to-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:from-rose-400 hover:to-orange-400 transition-colors"
          >
            {t("results.newCta.button")}
            <Arrow className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </PageShell>
  );
}
