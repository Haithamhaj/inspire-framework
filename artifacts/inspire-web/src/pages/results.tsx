import { useEffect, useState } from "react";
import { useParams, Redirect, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  Brain,
  ClipboardList,
  CheckCircle2,
  Zap,
  MessageSquare,
  Copy,
  Check,
  Loader2,
  Download,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

function apiUrl(path: string) {
  return `/api${path}`;
}

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!id || authLoading || !user) return;
    fetch(apiUrl(`/results/${id}`))
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) throw new Error(d.error || "Not found");
        setAssessment(d.assessment);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, user, authLoading]);

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleGeneratePdf() {
    if (!id || generatingPdf) return;
    setGeneratingPdf(true);
    try {
      const res = await fetch(apiUrl(`/results/${id}/generate-pdf`), { method: "POST" });
      const d = await res.json();
      if (d.success && d.pdfUrl) {
        setAssessment((prev: any) => ({ ...prev, pdfUrl: d.pdfUrl }));
        window.open(apiUrl(d.pdfUrl.replace("/api", "")), "_blank");
      }
    } finally {
      setGeneratingPdf(false);
    }
  }

  if (authLoading) {
    return <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }
  if (!user) return <Redirect to="/login" />;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جارٍ تحميل تقريرك...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div className="bg-card rounded-3xl border border-border p-10 shadow-xl text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg text-foreground mb-6">{error || "التقرير غير موجود"}</p>
          <button onClick={() => navigate("/my-assessments")} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold">
            عودة لتقاريري
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-300" />
                <span className="text-primary-foreground/80 text-sm">تقرير مكتمل</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">{assessment.projectName}</h1>
              <p className="text-primary-foreground/70 text-sm">{assessment.projectGoal}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => navigate("/my-assessments")}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <ChevronRight className="h-4 w-4" /> تقاريري
              </button>
              {assessment.pdfUrl ? (
                <a
                  href={apiUrl(assessment.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <Download className="h-4 w-4" /> تحميل PDF
                </a>
              ) : (
                <button
                  onClick={handleGeneratePdf}
                  disabled={generatingPdf}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {generatingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {generatingPdf ? "جارٍ التوليد..." : "توليد PDF"}
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-primary-foreground/60">
            <span>نُوِّل بواسطة: {assessment.aiModel ?? assessment.aiProvider ?? "AI"}</span>
            {assessment.createdAt && (
              <span>
                {new Date(assessment.createdAt).toLocaleDateString("ar-SA", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Role Analysis */}
        {assessment.roleAnalysis && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display font-bold text-xl text-foreground mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" /> نمطك السلوكي
            </h2>
            <p className="text-foreground leading-relaxed">{assessment.roleAnalysis}</p>
          </div>
        )}

        {/* INSPIRE Table */}
        {Array.isArray(assessment.inspireTable) && assessment.inspireTable.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display font-bold text-xl text-foreground mb-5 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-accent" /> مؤشرات INSPIRE السبعة
            </h2>
            <div className="space-y-4">
              {assessment.inspireTable.map((row: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-foreground">{row.axis}</span>
                    <span className="text-sm font-bold text-accent">{row.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden mb-1">
                    <motion.div
                      className="h-full bg-gradient-to-l from-accent to-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${row.percentage}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                  {row.note && <p className="text-xs text-muted-foreground">{row.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & Red Lines */}
        <div className="grid md:grid-cols-2 gap-4">
          {Array.isArray(assessment.strengths) && assessment.strengths.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-100 dark:border-green-900 p-5">
              <h2 className="font-display font-bold text-lg text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> نقاط القوة
              </h2>
              <ul className="space-y-2">
                {assessment.strengths.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-green-800 dark:text-green-400 text-sm">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(assessment.redLines) && assessment.redLines.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-100 dark:border-red-900 p-5">
              <h2 className="font-display font-bold text-lg text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> الخطوط الحمراء
              </h2>
              <ul className="space-y-2">
                {assessment.redLines.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-red-800 dark:text-red-400 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Development Areas */}
        {Array.isArray(assessment.developmentAreas) && assessment.developmentAreas.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display font-bold text-xl text-foreground mb-4">مجالات التطوير</h2>
            <ul className="space-y-2">
              {assessment.developmentAreas.map((d: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                  <span className="text-amber-500 mt-0.5 shrink-0">◆</span>{d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* System Instruction */}
        {assessment.systemInstruction && (
          <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" /> تعليمات النظام الشخصية
              </h2>
              <button
                onClick={() => copyText(assessment.systemInstruction, "sys")}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                {copied === "sys" ? <><Check className="h-4 w-4" /> تم النسخ</> : <><Copy className="h-4 w-4" /> انسخ</>}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-primary-foreground/90 leading-relaxed font-sans">
              {assessment.systemInstruction}
            </pre>
          </div>
        )}

        {/* Quick Starters */}
        {Array.isArray(assessment.quickStarters) && assessment.quickStarters.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent" /> بوادئ الحوار المقترحة
            </h2>
            <p className="text-muted-foreground text-sm mb-4">انقر على أي بادئة لنسخها مباشرةً</p>
            <div className="space-y-3">
              {assessment.quickStarters.map((qs: string, i: number) => (
                <div
                  key={i}
                  onClick={() => copyText(qs, `qs-${i}`)}
                  className="flex items-start gap-3 p-3 bg-secondary/50 rounded-xl group cursor-pointer hover:bg-secondary transition-colors"
                >
                  <span className="font-bold text-accent shrink-0">{i + 1}.</span>
                  <p className="text-sm text-foreground leading-relaxed flex-1">{qs}</p>
                  {copied === `qs-${i}` ? (
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {Array.isArray(assessment.recommendations) && assessment.recommendations.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display font-bold text-xl text-foreground mb-4">التوصيات</h2>
            <ol className="space-y-3">
              {assessment.recommendations.map((r: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-foreground mt-0.5">{r}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-l from-primary/10 to-accent/10 rounded-2xl p-6 text-center border border-primary/10">
          <p className="text-foreground font-semibold mb-4">هل تريد تقييماً لمشروع آخر؟</p>
          <button
            onClick={() => navigate("/assess")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            ابدأ تقييماً جديداً
          </button>
        </div>
      </motion.div>
    </div>
  );
}
