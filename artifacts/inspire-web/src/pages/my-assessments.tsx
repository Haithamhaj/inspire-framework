import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  AlertTriangle,
  Loader2,
  Plus,
  GitCompare,
  Download,
  ChevronLeft,
  RotateCcw,
  Link2Off,
  RefreshCw,
  CreditCard,
  Sparkles,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { localizePath } from "@/lib/locale-paths";
import {
  JourneyPanel,
  JourneyPrimaryButton,
  JourneyShell,
} from "@/components/journey";

function apiUrl(path: string) {
  return `/api${path}`;
}

const MY_REPORTS_TEXT = {
  ar: {
    title: "تقاريري",
    emptySubtitle: "لا توجد تقارير بعد",
    reportCount: (count: number) => `${count} تقرير`,
    loadingErrorTitle: "تعذّر تحميل التقارير",
    emptyTitle: "لا توجد تقارير بعد",
    emptyBody: "ابدأ تقييمك الكامل، وبعد اكتماله ستظهر هنا كل تعليماتك وتقاريرك مع روابط المشاركة ونسخ PDF والمقارنة بين النتائج.",
    emptyFeatures: ["21 سؤالاً مركزاً", "تعليمات مخصصة جاهزة", "مقارنة بين النتائج"],
    startFull: "ابدأ التقييم الكامل",
    welcome: (name: string) => name ? `أهلاً ${name}` : "أهلاً بك",
    welcomeBody: "هذه مساحة رحلتك داخل INSPIRE. ابدأ تقييم جديد، راجع تقاريرك السابقة، أو قارن بين النتائج عندما يصبح لديك أكثر من تقرير.",
    statsAll: "كل التقارير",
    statsCompleted: "مكتملة",
    statsNext: "الخطوة التالية",
    newAssessmentValue: "تقييم جديد",
    startNowValue: "ابدأ الآن",
    chips: ["تقييم كامل", "تقرير قابل للنسخ", "PDF ومشاركة"],
    startNew: "ابدأ تقييماً جديداً",
    startFirst: "ابدأ تقييمك الأول",
    newAssessment: "تقييم جديد",
    completedBanner: (count: number) => `لقد أكملت ${count} تقييم`,
    completedBannerSub: "كل تقييم إضافي بـ $10 فقط — PDF والمشاركة متاحة مجاناً لجميع تقاريرك",
    comparePickAnother: "اختر تقريراً آخر للمقارنة",
    compareReady: "جاهز للمقارنة بين تقييمين",
    cancel: "إلغاء",
    compare: "قارن",
    view: "عرض",
    reassess: "إعادة تقييم",
    selected: "محدد",
    revokeLink: "إلغاء الرابط",
    processing: "معالجة...",
    processingHelp: "طلبك محفوظ، ويمكنك الرجوع لهذه الصفحة لاحقًا.",
    completePayment: "إكمال الدفع",
    paymentHelp: "أجوبتك محفوظة، ويمكنك إكمال الدفع بدون إعادة التقييم.",
    failed: "فشل",
    failedHelp: "لم يكتمل التقرير تلقائيًا. فريق الدعم يستطيع مراجعته.",
    retrying: "إعادة محاولة",
    retryingHelp: "نحاول تجهيز التقرير تلقائيًا بدون دفع جديد.",
    comparisonResults: "نتائج المقارنة",
    fetchFailed: "فشل جلب التقارير",
    genericError: "حدث خطأ",
    revokeFailed: "فشل إلغاء المشاركة",
    pdfFailed: "فشل تجهيز ملف PDF",
    pdfPreparing: "جاري تجهيز PDF...",
    providerOpenai: "GPT",
    providerAnthropic: "Claude",
    dateLocale: "ar-SA",
    status: {
      completed: "مكتمل",
      processing: "قيد المعالجة",
      pending_payment: "بانتظار الدفع",
      pending_retry: "قيد الإعادة",
      failed: "فشل",
      draft: "مسودة",
    },
  },
  en: {
    title: "My reports",
    emptySubtitle: "No reports yet",
    reportCount: (count: number) => `${count} report${count === 1 ? "" : "s"}`,
    loadingErrorTitle: "Could not load reports",
    emptyTitle: "No reports yet",
    emptyBody: "Start your full assessment. Once it is complete, your instructions, reports, share links, PDF copies, and comparisons will appear here.",
    emptyFeatures: ["21 focused questions", "Copy-ready instructions", "Report comparison"],
    startFull: "Start full assessment",
    welcome: (name: string) => name ? `Welcome, ${name}` : "Welcome",
    welcomeBody: "This is your INSPIRE journey space. Start a new assessment, review previous reports, or compare results once you have more than one report.",
    statsAll: "All reports",
    statsCompleted: "Completed",
    statsNext: "Next step",
    newAssessmentValue: "New assessment",
    startNowValue: "Start now",
    chips: ["Full assessment", "Copy-ready report", "PDF and sharing"],
    startNew: "Start a new assessment",
    startFirst: "Start your first assessment",
    newAssessment: "New assessment",
    completedBanner: (count: number) => `You have completed ${count} assessment${count === 1 ? "" : "s"}`,
    completedBannerSub: "Each additional assessment is only $10. PDF and sharing are included for all reports.",
    comparePickAnother: "Choose another report to compare",
    compareReady: "Ready to compare two reports",
    cancel: "Cancel",
    compare: "Compare",
    view: "View",
    reassess: "Reassess",
    selected: "Selected",
    revokeLink: "Remove link",
    processing: "Processing...",
    processingHelp: "Your request is saved. You can return to this page later.",
    completePayment: "Complete payment",
    paymentHelp: "Your answers are saved, and you can complete payment without retaking the assessment.",
    failed: "Failed",
    failedHelp: "The report did not complete automatically. Support can review it.",
    retrying: "Retrying",
    retryingHelp: "We are preparing the report automatically without a new payment.",
    comparisonResults: "Comparison results",
    fetchFailed: "Could not fetch reports",
    genericError: "Something went wrong",
    revokeFailed: "Could not remove sharing",
    pdfFailed: "Could not prepare the PDF",
    pdfPreparing: "Preparing PDF...",
    providerOpenai: "GPT",
    providerAnthropic: "Claude",
    dateLocale: "en-US",
    status: {
      completed: "Completed",
      processing: "Processing",
      pending_payment: "Awaiting payment",
      pending_retry: "Retrying",
      failed: "Failed",
      draft: "Draft",
    },
  },
} as const;

type MyReportsText = (typeof MY_REPORTS_TEXT)[keyof typeof MY_REPORTS_TEXT];

function statusLabel(status: string, text: MyReportsText) {
  switch (status) {
    case "completed": return { label: text.status.completed, color: "text-teal-200 bg-teal-500/[0.08] border-teal-300/20" };
    case "processing": return { label: text.status.processing, color: "text-sky-200 bg-sky-500/[0.08] border-sky-300/20" };
    case "pending_payment": return { label: text.status.pending_payment, color: "text-indigo-200 bg-indigo-500/[0.08] border-indigo-300/20" };
    case "pending_retry": return { label: text.status.pending_retry, color: "text-amber-200 bg-amber-500/[0.08] border-amber-300/20" };
    case "failed": return { label: text.status.failed, color: "text-rose-200 bg-rose-500/[0.08] border-rose-300/20" };
    default: return { label: text.status.draft, color: "text-slate-300 bg-slate-900/60 border-slate-400/10" };
  }
}

interface AssessmentSummary {
  id: string;
  projectName: string;
  projectGoal: string;
  status: string;
  aiProvider: string | null;
  aiModel: string | null;
  pdfUrl: string | null;
  createdAt: string;
  completionTimeSeconds: number | null;
  inspireTable: { axis: string; score: number; percentage: number; note?: string }[] | null;
  shareToken: string | null;
  shareEnabled: boolean;
}

interface CompareRow {
  axis: string;
  a: { score: number; percentage: number; note?: string } | null;
  b: { score: number; percentage: number; note?: string } | null;
  delta: number;
}

interface CompareResult {
  success: boolean;
  a: { id: string; projectName: string };
  b: { id: string; projectName: string };
  comparison: CompareRow[];
}

function ReportsLoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-slate-400/10 bg-slate-950/55 shadow-xl shadow-black/10"
        >
          <div className="animate-pulse p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="h-4 w-48 rounded-lg bg-slate-800" />
                <div className="h-3 w-72 max-w-full rounded-lg bg-slate-800/60" />
              </div>
              <div className="h-7 w-24 rounded-full bg-slate-800" />
            </div>
            <div className="grid grid-cols-7 gap-1.5 border-t border-slate-400/10 pt-5">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-1 rounded-full bg-slate-800" />
                  <div className="mx-auto h-2 w-2 rounded-full bg-slate-800/70" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsErrorState({ message, text }: { message: string; text: MyReportsText }) {
  return (
    <JourneyPanel className="mb-6 overflow-hidden border-rose-300/20 bg-rose-500/[0.07] p-0">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-500/[0.12] text-rose-200">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-black text-rose-100">{text.loadingErrorTitle}</p>
          <p className="mt-1 text-sm leading-6 text-rose-100/75">{message}</p>
        </div>
      </div>
    </JourneyPanel>
  );
}

function ReportsEmptyState({ onStart, text }: { onStart: () => void; text: MyReportsText }) {
  return (
    <JourneyPanel className="relative overflow-hidden py-20 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.16),transparent_55%)]" />
      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-rose-300/20 bg-rose-500/[0.08] text-rose-200 shadow-2xl shadow-rose-950/25">
        <ClipboardList className="h-10 w-10" />
      </div>
      <p className="relative mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-bold text-rose-100">
        <Sparkles className="h-3.5 w-3.5" />
        INSPIRE
      </p>
      <h2 className="relative mb-3 text-2xl font-black text-slate-50">
        {text.emptyTitle}
      </h2>
      <p className="relative mx-auto mb-8 max-w-md text-sm leading-7 text-slate-400">
        {text.emptyBody}
      </p>
      <div className="relative mb-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: ClipboardList, label: text.emptyFeatures[0] },
          { icon: ShieldCheck, label: text.emptyFeatures[1] },
          { icon: GitCompare, label: text.emptyFeatures[2] },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-400/10 bg-slate-900/40 p-3">
            <item.icon className="mx-auto mb-2 h-4 w-4 text-rose-200" />
            <p className="text-xs font-bold text-slate-300">{item.label}</p>
          </div>
        ))}
      </div>
      <JourneyPrimaryButton onClick={onStart}>
        {text.startFull}
      </JourneyPrimaryButton>
    </JourneyPanel>
  );
}

function WelcomeNextStep({
  userName,
  totalCount,
  completedCount,
  loading,
  onStart,
  text,
}: {
  userName: string;
  totalCount: number;
  completedCount: number;
  loading: boolean;
  onStart: () => void;
  text: MyReportsText;
}) {
  return (
    <JourneyPanel className="mb-8 overflow-hidden p-0">
      <div className="relative p-5 md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(244,63,94,0.13),transparent_42%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200 shadow-lg shadow-rose-950/25">
              <UserRound className="h-7 w-7" />
            </div>
            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-rose-200/75">
                INSPIRE Journey
              </p>
              <h2 className="text-2xl font-black leading-tight text-slate-50">
                {text.welcome(userName)}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
                {text.welcomeBody}
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:w-[24rem]">
            {[
              { label: text.statsAll, value: loading ? "..." : String(totalCount) },
              { label: text.statsCompleted, value: loading ? "..." : String(completedCount) },
              { label: text.statsNext, value: totalCount > 0 ? text.newAssessmentValue : text.startNowValue },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-400/10 bg-slate-900/45 p-3">
                <p className="text-[11px] font-bold text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-black text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-5 flex flex-col gap-3 border-t border-slate-400/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {text.chips.map((label) => (
              <span key={label} className="rounded-full border border-slate-400/10 bg-slate-950/45 px-3 py-1 text-xs font-bold text-slate-300">
                {label}
              </span>
            ))}
          </div>
          <JourneyPrimaryButton onClick={onStart} icon={<Plus className="h-4 w-4" />}>
            {totalCount > 0 ? text.startNew : text.startFirst}
          </JourneyPrimaryButton>
        </div>
      </div>
    </JourneyPanel>
  );
}

export default function MyAssessments() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { dir, locale } = useI18n();
  const text = MY_REPORTS_TEXT[locale];
  const href = (path: string) => localizePath(path, locale);

  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    fetch(apiUrl("/my-assessments"))
      .then((r) => r.json())
      .then((d: { success: boolean; assessments?: AssessmentSummary[]; error?: string }) => {
        if (!d.success) throw new Error(d.error || text.fetchFailed);
        setAssessments(d.assessments ?? []);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : text.genericError))
      .finally(() => setLoading(false));
  }, [user, authLoading, text.fetchFailed, text.genericError]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
    setCompareResult(null);
  }

  async function handleCompare() {
    if (selectedIds.length !== 2) return;
    setComparing(true);
    try {
      const res = await fetch(
        apiUrl(`/my-assessments/compare?a=${selectedIds[0]}&b=${selectedIds[1]}`)
      );
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setCompareResult(d);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : text.genericError);
    } finally {
      setComparing(false);
    }
  }

  async function handleRevokeShare(assessmentId: string) {
    try {
      const res = await fetch(apiUrl(`/results/${assessmentId}/share`), { method: "DELETE" });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setAssessments((prev) =>
        prev.map((a) =>
          a.id === assessmentId ? { ...a, shareToken: null, shareEnabled: false } : a
        )
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : text.revokeFailed);
    }
  }

  async function handleDownloadPdf(assessmentId: string) {
    if (generatingPdfId) return;
    setGeneratingPdfId(assessmentId);
    setError("");
    try {
      const res = await fetch(apiUrl(`/results/${assessmentId}/generate-pdf`), { method: "POST" });
      const d = await res.json() as { success: boolean; pdfUrl?: string; error?: string };
      if (!d.success || !d.pdfUrl) throw new Error(d.error || text.pdfFailed);
      setAssessments((prev) =>
        prev.map((a) => a.id === assessmentId ? { ...a, pdfUrl: d.pdfUrl! } : a)
      );
      window.open(apiUrl(d.pdfUrl.replace("/api", "")), "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : text.pdfFailed);
    } finally {
      setGeneratingPdfId(null);
    }
  }

  if (authLoading) {
    return (
      <JourneyShell dir={dir} eyebrow="INSPIRE" title={text.title}>
        <JourneyPanel className="mx-auto flex min-h-[18rem] max-w-xl items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-rose-200" />
        </JourneyPanel>
      </JourneyShell>
    );
  }
  if (!user) return <Redirect to={href("/login")} />;

  const completedCount = assessments.filter((a) => a.status === "completed").length;
  const userName = String((user as { name?: unknown }).name ?? "").trim();

  return (
    <JourneyShell
      dir={dir}
      eyebrow="INSPIRE"
      title={text.title}
      subtitle={assessments.length === 0 ? text.emptySubtitle : text.reportCount(assessments.length)}
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-50 mb-1">
              {text.title}
            </h1>
            <p className="text-slate-400 text-sm">
              {assessments.length === 0 ? text.emptySubtitle : text.reportCount(assessments.length)}
            </p>
          </div>
          <JourneyPrimaryButton onClick={() => navigate(href("/assess"))} icon={<Plus className="h-4 w-4" />} className="w-full sm:w-auto">
            {text.newAssessment}
          </JourneyPrimaryButton>
        </div>

        <WelcomeNextStep
          userName={userName}
          totalCount={assessments.length}
          completedCount={completedCount}
          loading={loading}
          onStart={() => navigate(href("/assess"))}
          text={text}
        />

        {/* Error */}
        {error && <ReportsErrorState message={error} text={text} />}

        {/* Loading Skeletons */}
        {loading ? (
          <ReportsLoadingState />
        ) : assessments.length === 0 ? (
          <ReportsEmptyState onStart={() => navigate(href("/assess"))} text={text} />
        ) : (
          <>
            {/* Pay-per-assessment info banner */}
            {completedCount >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-col gap-4 rounded-3xl border border-sky-300/20 bg-sky-500/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-sky-100 text-sm mb-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {text.completedBanner(completedCount)}
                  </p>
                  <p className="text-xs text-sky-200/75">
                    {text.completedBannerSub}
                  </p>
                </div>
                <button
                  onClick={() => navigate(href("/assess"))}
                  className="flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-rose-500 to-orange-500 px-4 py-2 text-sm font-black text-slate-950 transition-colors hover:from-rose-400 hover:to-orange-400 sm:w-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {text.newAssessment}
                </button>
              </motion.div>
            )}

            {/* Compare bar */}
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-col gap-4 rounded-3xl border border-rose-300/20 bg-rose-500/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm text-slate-100">
                  {selectedIds.length === 1
                    ? text.comparePickAnother
                    : text.compareReady}
                </p>
                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    onClick={() => { setSelectedIds([]); setCompareResult(null); }}
                    className="flex-1 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition-colors hover:text-slate-100 sm:flex-none"
                  >
                    {text.cancel}
                  </button>
                  {selectedIds.length === 2 && (
                    <button
                      onClick={handleCompare}
                      disabled={comparing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-rose-500 to-orange-500 px-4 py-1.5 text-sm font-black text-slate-950 disabled:opacity-60 sm:flex-none"
                    >
                      {comparing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <GitCompare className="h-3.5 w-3.5" />}
                      {text.compare}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Assessment cards */}
            <div className="space-y-4 mb-8">
              {assessments.map((a, i) => {
                const status = statusLabel(a.status, text);
                const isSelected = selectedIds.includes(a.id);
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-slate-950/55 rounded-3xl border p-5 transition-all shadow-xl shadow-black/10 ${
                      isSelected ? "border-rose-300/35 ring-2 ring-rose-500/10" : "border-slate-400/10 hover:border-rose-300/25"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-slate-50">{a.projectName}</h3>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-3 line-clamp-1">{a.projectGoal}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(a.createdAt).toLocaleDateString(text.dateLocale, {
                              year: "numeric", month: "long", day: "numeric",
                            })}
                          </span>
                          {a.aiProvider && <span>{a.aiProvider === "openai" ? text.providerOpenai : text.providerAnthropic}</span>}
                        </div>
                      </div>

                      <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:flex-col">
                        {a.status === "completed" && (
                          <>
                            <button
                              onClick={() => navigate(href(`/results/${a.id}`))}
                              className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-l from-rose-500 to-orange-500 px-4 py-2 text-sm font-black text-slate-950 transition-colors hover:from-rose-400 hover:to-orange-400"
                            >
                              {text.view} <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => navigate(href(`/assess?prev=${a.id}`))}
                              className="flex items-center justify-center gap-1.5 rounded-2xl border border-rose-300/25 px-4 py-2 text-sm font-bold text-rose-200 transition-colors hover:border-rose-300/45 hover:bg-rose-500/[0.08]"
                            >
                              <RefreshCw className="h-3.5 w-3.5" /> {text.reassess}
                            </button>
                            <button
                              onClick={() => toggleSelect(a.id)}
                              className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-4 py-2 text-sm font-medium transition-colors ${
                                isSelected
                                  ? "bg-rose-500/[0.08] border-rose-300/35 text-rose-100"
                                  : "border-slate-400/10 text-slate-200 hover:border-rose-300/30"
                              }`}
                            >
                              <GitCompare className="h-3.5 w-3.5" />
                              {isSelected ? text.selected : text.compare}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadPdf(a.id)}
                              disabled={generatingPdfId === a.id}
                              className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-400/10 px-4 py-2 text-sm font-bold text-slate-200 transition-colors hover:border-rose-300/30 disabled:cursor-wait disabled:opacity-70"
                              title={generatingPdfId === a.id ? text.pdfPreparing : "PDF"}
                            >
                              {generatingPdfId === a.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Download className="h-3.5 w-3.5" />
                              )} PDF
                            </button>
                            {a.shareEnabled && (
                              <button
                                onClick={() => handleRevokeShare(a.id)}
                                className="col-span-2 flex items-center justify-center gap-1.5 rounded-2xl border border-rose-300/25 px-4 py-2 text-sm font-bold text-rose-200 transition-colors hover:border-rose-300/45 hover:bg-rose-500/[0.08] sm:col-span-1"
                              >
                                <Link2Off className="h-3.5 w-3.5" /> {text.revokeLink}
                              </button>
                            )}
                          </>
                        )}
                        {a.status === "processing" && (
                          <div className="col-span-2 rounded-2xl border border-sky-300/20 bg-sky-500/[0.08] px-4 py-2 text-center text-sm font-bold text-sky-200 sm:col-span-1">
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" /> {text.processing}
                            </span>
                            <span className="mt-1 block text-xs font-medium text-sky-100/70">
                              {text.processingHelp}
                            </span>
                          </div>
                        )}
                        {a.status === "pending_payment" && (
                          <>
                            <button
                              onClick={() => navigate(href(`/assess?resume=${a.id}`))}
                              className="col-span-2 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-l from-rose-500 to-orange-500 px-4 py-2 text-sm font-black text-slate-950 transition-colors hover:from-rose-400 hover:to-orange-400 sm:col-span-1"
                            >
                              <CreditCard className="h-3.5 w-3.5" /> {text.completePayment}
                            </button>
                            <div className="col-span-2 rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.08] px-4 py-2 text-center text-xs font-medium leading-5 text-indigo-100/75 sm:col-span-1">
                              {text.paymentHelp}
                            </div>
                          </>
                        )}
                        {a.status === "failed" && (
                          <div className="col-span-2 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] px-4 py-2 text-center text-sm font-bold text-rose-200 sm:col-span-1">
                            <span className="flex items-center justify-center gap-2">
                              <AlertTriangle className="h-4 w-4" /> {text.failed}
                            </span>
                            <span className="mt-1 block text-xs font-medium text-rose-100/70">
                              {text.failedHelp}
                            </span>
                          </div>
                        )}
                        {a.status === "pending_retry" && (
                          <div className="col-span-2 rounded-2xl border border-amber-300/20 bg-amber-500/[0.08] px-4 py-2 text-center text-sm font-bold text-amber-200 sm:col-span-1">
                            <span className="flex items-center justify-center gap-2">
                              <RotateCcw className="h-4 w-4" /> {text.retrying}
                            </span>
                            <span className="mt-1 block text-xs font-medium text-amber-100/75">
                              {text.retryingHelp}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* INSPIRE mini-bar */}
                    {Array.isArray(a.inspireTable) && a.inspireTable.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-400/10 grid grid-cols-7 gap-1">
                        {a.inspireTable.slice(0, 7).map((row, j) => (
                          <div key={j} className="flex flex-col items-center gap-1">
                            <div className="w-full bg-slate-800 rounded-full overflow-hidden" style={{ height: "4px" }}>
                              <div
                                className="h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full"
                                style={{ width: `${row.percentage}%` }}
                              />
                            </div>
                            <span className="text-[9px] text-slate-500 font-bold">
                              {row.axis?.charAt(0) ?? ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Comparison result */}
            {compareResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-950/55 rounded-3xl border border-slate-400/10 p-6 shadow-xl shadow-black/10"
              >
                <h2 className="font-black text-xl text-slate-50 mb-2 flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-rose-200" /> {text.comparisonResults}
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-center">
                  <div className="bg-rose-500/[0.08] rounded-2xl p-3 font-semibold text-slate-100">
                    {compareResult.a.projectName}
                  </div>
                  <div className="bg-orange-500/[0.08] rounded-2xl p-3 font-semibold text-slate-100">
                    {compareResult.b.projectName}
                  </div>
                </div>
                <div className="space-y-3 overflow-x-auto pb-1">
                  {compareResult.comparison.map((row, i) => (
                    <div key={i} className="flex min-w-[34rem] items-center gap-3">
                      <span className="text-sm font-medium text-slate-200 w-28 shrink-0">{row.axis}</span>
                      <span className="text-sm font-bold text-rose-200 w-12 text-center">{row.a?.percentage ?? 0}%</span>
                      <div className="flex-1 relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 right-0 bg-rose-400/40 rounded-full"
                          style={{ width: `${row.a?.percentage ?? 0}%` }}
                        />
                        <div
                          className="absolute inset-y-0 right-0 bg-orange-400/60 rounded-full"
                          style={{ width: `${row.b?.percentage ?? 0}%`, opacity: 0.7 }}
                        />
                      </div>
                      <span className="text-sm font-bold text-orange-200 w-12 text-center">{row.b?.percentage ?? 0}%</span>
                      <span className={`text-xs w-12 text-center font-semibold ${row.delta > 0 ? "text-teal-200" : row.delta < 0 ? "text-rose-300" : "text-slate-500"}`}>
                        {row.delta > 0 ? `+${row.delta}` : row.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </JourneyShell>
  );
}
