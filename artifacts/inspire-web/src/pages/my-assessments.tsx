import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  Plus,
  GitCompare,
  Download,
  ChevronLeft,
  RotateCcw,
  Share2,
  Link2Off,
  RefreshCw,
  Sparkles,
  Crown,
} from "lucide-react";

function apiUrl(path: string) {
  return `/api${path}`;
}

function statusLabel(status: string) {
  switch (status) {
    case "completed": return { label: "مكتمل", color: "text-green-600 bg-green-50 border-green-100" };
    case "processing": return { label: "قيد المعالجة", color: "text-blue-600 bg-blue-50 border-blue-100" };
    case "pending_retry": return { label: "قيد الإعادة", color: "text-amber-600 bg-amber-50 border-amber-100" };
    case "failed": return { label: "فشل", color: "text-red-600 bg-red-50 border-red-100" };
    default: return { label: "مسودة", color: "text-gray-600 bg-gray-50 border-gray-100" };
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

export default function MyAssessments() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    fetch(apiUrl("/my-assessments"))
      .then((r) => r.json())
      .then((d: { success: boolean; assessments?: AssessmentSummary[]; error?: string }) => {
        if (!d.success) throw new Error(d.error || "فشل جلب التقارير");
        setAssessments(d.assessments ?? []);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "حدث خطأ"))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

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
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setComparing(false);
    }
  }

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const res = await fetch(apiUrl("/billing/checkout"), { method: "POST" });
      const d = await res.json() as { success: boolean; url?: string; error?: string };
      if (!d.success || !d.url) {
        throw new Error(d.error || "فشل إنشاء جلسة الدفع");
      }
      window.location.href = d.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ. حاول مرة أخرى.");
      setUpgrading(false);
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
      setError(err instanceof Error ? err.message : "فشل إلغاء المشاركة");
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;

  const isPro = user?.plan === "pro";
  const completedCount = assessments.filter((a) => a.status === "completed").length;
  const freeUserAtLimit = !isPro && completedCount >= 1;

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                تقاريري
              </h1>
              {isPro ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 border border-amber-300 text-amber-700">
                  <Crown className="h-3.5 w-3.5" /> Pro
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary border border-border text-muted-foreground">
                  مجاني
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {assessments.length === 0 ? "لا توجد تقارير بعد" : `${assessments.length} تقرير`}
            </p>
          </div>
          {freeUserAtLimit ? (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="flex items-center gap-2 bg-gradient-to-l from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-amber-200 transition-all hover:-translate-y-0.5 disabled:opacity-70"
            >
              {upgrading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              ترقية إلى Pro
            </button>
          ) : (
            <button
              onClick={() => navigate("/assess")}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" /> تقييم جديد
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card border border-border rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-secondary rounded-lg" />
                    <div className="h-3 w-64 bg-secondary/60 rounded-lg" />
                  </div>
                  <div className="h-6 w-20 bg-secondary rounded-full" />
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-9 w-24 bg-secondary rounded-xl" />
                  <div className="h-9 w-24 bg-secondary rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-3xl border border-border">
            <ClipboardList className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              لا توجد تقارير بعد
            </h2>
            <p className="text-muted-foreground mb-8">
              ابدأ تقييمك الأول لتوليد تعليمات الذكاء الاصطناعي الشخصية
            </p>
            <button
              onClick={() => navigate("/assess")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
            >
              ابدأ التقييم المجاني
            </button>
          </div>
        ) : (
          <>
            {/* Free plan upgrade prompt */}
            {freeUserAtLimit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-gradient-to-l from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-amber-800 text-sm mb-1 flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    لقد استخدمت تقييمك المجاني
                  </p>
                  <p className="text-xs text-amber-700">
                    قم بالترقية إلى Pro للحصول على تقييمات غير محدودة + PDF + مشاركة التقارير
                  </p>
                </div>
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="flex items-center gap-2 shrink-0 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-70"
                >
                  {upgrading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  ترقية الآن
                </button>
              </motion.div>
            )}

            {/* Compare bar */}
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <p className="text-sm text-foreground">
                  {selectedIds.length === 1
                    ? "اختر تقريراً آخر للمقارنة"
                    : "جاهز للمقارنة بين تقييمين"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedIds([]); setCompareResult(null); }}
                    className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
                  >
                    إلغاء
                  </button>
                  {selectedIds.length === 2 && (
                    <button
                      onClick={handleCompare}
                      disabled={comparing}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-60"
                    >
                      {comparing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <GitCompare className="h-3.5 w-3.5" />}
                      قارن
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Assessment cards */}
            <div className="space-y-4 mb-8">
              {assessments.map((a, i) => {
                const status = statusLabel(a.status);
                const isSelected = selectedIds.includes(a.id);
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-card rounded-2xl border-2 p-5 transition-all ${
                      isSelected ? "border-primary shadow-md" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-display font-bold text-foreground">{a.projectName}</h3>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{a.projectGoal}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(a.createdAt).toLocaleDateString("ar-SA", {
                              year: "numeric", month: "long", day: "numeric",
                            })}
                          </span>
                          {a.aiProvider && <span>{a.aiProvider === "openai" ? "GPT" : "Claude"}</span>}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        {a.status === "completed" && (
                          <>
                            <button
                              onClick={() => navigate(`/results/${a.id}`)}
                              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                            >
                              عرض <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => navigate(`/assess?prev=${a.id}`)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border-2 border-accent/40 text-accent hover:border-accent hover:bg-accent/5 transition-colors"
                            >
                              <RefreshCw className="h-3.5 w-3.5" /> إعادة تقييم
                            </button>
                            <button
                              onClick={() => toggleSelect(a.id)}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${
                                isSelected
                                  ? "bg-primary/10 border-primary text-primary"
                                  : "border-border text-foreground hover:border-primary/40"
                              }`}
                            >
                              <GitCompare className="h-3.5 w-3.5" />
                              {isSelected ? "محدد" : "قارن"}
                            </button>
                            {a.pdfUrl && (
                              <a
                                href={apiUrl(a.pdfUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border-2 border-border text-foreground hover:border-primary/40 transition-colors"
                              >
                                <Download className="h-3.5 w-3.5" /> PDF
                              </a>
                            )}
                            {a.shareEnabled && (
                              <button
                                onClick={() => handleRevokeShare(a.id)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border-2 border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50 transition-colors"
                              >
                                <Link2Off className="h-3.5 w-3.5" /> إلغاء الرابط
                              </button>
                            )}
                          </>
                        )}
                        {a.status === "processing" && (
                          <div className="flex items-center gap-2 text-blue-600 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" /> معالجة...
                          </div>
                        )}
                        {a.status === "failed" && (
                          <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertTriangle className="h-4 w-4" /> فشل
                          </div>
                        )}
                        {a.status === "pending_retry" && (
                          <div className="flex items-center gap-2 text-amber-600 text-sm">
                            <RotateCcw className="h-4 w-4" /> إعادة محاولة
                          </div>
                        )}
                      </div>
                    </div>

                    {/* INSPIRE mini-bar */}
                    {Array.isArray(a.inspireTable) && a.inspireTable.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border grid grid-cols-7 gap-1">
                        {a.inspireTable.slice(0, 7).map((row, j) => (
                          <div key={j} className="flex flex-col items-center gap-1">
                            <div className="w-full bg-secondary rounded-full overflow-hidden" style={{ height: "4px" }}>
                              <div
                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                style={{ width: `${row.percentage}%` }}
                              />
                            </div>
                            <span className="text-[9px] text-muted-foreground font-bold">
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
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h2 className="font-display font-bold text-xl text-foreground mb-2 flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-accent" /> نتائج المقارنة
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-center">
                  <div className="bg-primary/10 rounded-xl p-3 font-semibold text-foreground">
                    {compareResult.a.projectName}
                  </div>
                  <div className="bg-accent/10 rounded-xl p-3 font-semibold text-foreground">
                    {compareResult.b.projectName}
                  </div>
                </div>
                <div className="space-y-3">
                  {compareResult.comparison.map((row, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground w-28 shrink-0">{row.axis}</span>
                      <span className="text-sm font-bold text-primary w-12 text-center">{row.a?.percentage ?? 0}%</span>
                      <div className="flex-1 relative h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 right-0 bg-primary/40 rounded-full"
                          style={{ width: `${row.a?.percentage ?? 0}%` }}
                        />
                        <div
                          className="absolute inset-y-0 right-0 bg-accent/60 rounded-full"
                          style={{ width: `${row.b?.percentage ?? 0}%`, opacity: 0.7 }}
                        />
                      </div>
                      <span className="text-sm font-bold text-accent w-12 text-center">{row.b?.percentage ?? 0}%</span>
                      <span className={`text-xs w-12 text-center font-semibold ${row.delta > 0 ? "text-green-600" : row.delta < 0 ? "text-red-500" : "text-muted-foreground"}`}>
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
    </div>
  );
}
