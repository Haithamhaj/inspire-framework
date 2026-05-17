import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import {
  Brain,
  ClipboardList,
  CheckCircle2,
  MessageSquare,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  Lock,
} from "lucide-react";

function apiUrl(path: string) {
  return `/api${path}`;
}

interface InspireRow {
  axis: string;
  score: number;
  percentage: number;
  note?: string;
}

interface ReportSection {
  include?: boolean;
  bullets?: string[];
}

interface ReportContent {
  language?: "ar" | "en" | "both";
  sections?: {
    operatingSnapshot?: ReportSection;
    personalizedRecommendations?: ReportSection;
    customAiUsageTips?: ReportSection;
    instructionExplanation?: ReportSection;
  };
}

interface PublicAssessmentDto {
  id: string;
  projectName: string;
  projectGoal: string;
  reportLanguage: string;
  assessmentType: string;
  aiProvider: string | null;
  aiModel: string | null;
  createdAt: string;
  reportContent: ReportContent | null;
  inspireTable: InspireRow[] | null;
  roleAnalysis: string | null;
  redLines: string[] | null;
  strengths: string[] | null;
  developmentAreas: string[] | null;
  recommendations: string[] | null;
  quickStarters: string[] | null;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-secondary/70 rounded-xl ${className ?? ""}`} />;
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
    </div>
  );
}

export default function Share() {
  const { token } = useParams<{ token: string }>();
  const [assessment, setAssessment] = useState<PublicAssessmentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(apiUrl(`/share/${token}`))
      .then((r) => r.json())
      .then((d: { success: boolean; assessment?: PublicAssessmentDto; error?: string }) => {
        if (!d.success) throw new Error(d.error || "الرابط غير صالح");
        setAssessment(d.assessment ?? null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <ResultsSkeleton />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-card rounded-3xl border border-border p-10 shadow-xl text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground mb-2">
            رابط غير صالح
          </h2>
          <p className="text-muted-foreground">{error || "هذا الرابط غير موجود أو تم إلغاؤه"}</p>
        </div>
      </div>
    );
  }

  const reportSections = assessment.reportContent?.sections;
  const v2Sections = [
    {
      key: "operatingSnapshot",
      title: "ملخص نمط التشغيل",
      icon: Brain,
      bullets: reportSections?.operatingSnapshot?.bullets,
    },
    {
      key: "personalizedRecommendations",
      title: "توصيات مخصصة",
      icon: TrendingUp,
      bullets: reportSections?.personalizedRecommendations?.bullets,
    },
    {
      key: "customAiUsageTips",
      title: "نصائح استخدام AI",
      icon: MessageSquare,
      bullets: reportSections?.customAiUsageTips?.bullets,
    },
    {
      key: "instructionExplanation",
      title: "شرح التعليمات الجاهزة",
      icon: ClipboardList,
      bullets: reportSections?.instructionExplanation?.include === false
        ? []
        : reportSections?.instructionExplanation?.bullets,
    },
  ].filter((section) => Array.isArray(section.bullets) && section.bullets.length > 0);

  return (
    <div className="min-h-screen py-12 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-300" />
                <span className="text-primary-foreground/80 text-sm">نتيجة مشتركة — INSPIRE</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">{assessment.projectName}</h1>
              <p className="text-primary-foreground/70 text-sm">{assessment.projectGoal}</p>
            </div>
            <div className="shrink-0 bg-white/10 rounded-2xl px-4 py-3 text-center text-sm">
              <p className="text-primary-foreground/60 text-xs mb-1">عرض للقراءة فقط</p>
              <Lock className="h-5 w-5 mx-auto text-primary-foreground/70" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-primary-foreground/60">
            {assessment.aiModel && <span>نُوِّل بواسطة: {assessment.aiModel}</span>}
            {assessment.createdAt && (
              <span>
                {new Date(assessment.createdAt).toLocaleDateString("ar-SA", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* V2 Report Content */}
        {v2Sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.key} className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-accent" /> {section.title}
              </h2>
              <ul className="space-y-3">
                {section.bullets!.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground text-sm leading-7">
                    <CheckCircle2 className="h-4 w-4 mt-1 shrink-0 text-accent" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Role Analysis */}
        {assessment.roleAnalysis && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display font-bold text-xl text-foreground mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" /> النمط السلوكي
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
              {assessment.inspireTable.map((row, i) => (
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
                {assessment.strengths.map((s, i) => (
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
                {assessment.redLines.map((s, i) => (
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
              {assessment.developmentAreas.map((area, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                  <span className="text-amber-500 mt-0.5 shrink-0">◆</span>{area}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Short instructions / starters */}
        {Array.isArray(assessment.quickStarters) && assessment.quickStarters.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent" />
              {assessment.assessmentType === "mini" ? "تعليمات مختصرة للذكاء الاصطناعي" : "Quick Starter Prompts"}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              {assessment.assessmentType === "mini"
                ? "انقر على أي تعليمات لنسخها مباشرةً"
                : "انقر على أي بادئة لنسخها مباشرةً"}
            </p>
            <div className="space-y-3">
              {assessment.quickStarters.map((qs, i) => (
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
              {assessment.recommendations.map((r, i) => (
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

        {/* System instruction deliberately excluded from public view */}
        <div className="bg-secondary/30 border border-border rounded-2xl p-5 text-center">
          <Lock className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            تعليمات النظام الشخصية خاصة بصاحب التقرير وغير مشمولة في هذا العرض
          </p>
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-l from-primary/10 to-accent/10 rounded-2xl p-6 text-center border border-primary/10">
          <p className="text-foreground font-semibold mb-1">هل تريد تقييمك الخاص؟</p>
          <p className="text-muted-foreground text-sm mb-4">احصل على تعليماتك المخصصة مجاناً</p>
          <a
            href="/"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            ابدأ تقييمك الآن
          </a>
        </div>
      </motion.div>
    </div>
  );
}
