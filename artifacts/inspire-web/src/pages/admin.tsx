import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  CheckCircle2,
  Clock,
  Download,
  Search,
  RefreshCw,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";

function apiUrl(path: string) {
  return `/api${path}`;
}

interface Stats {
  totalUsers: number;
  totalAssessments: number;
  completedAssessments: number;
  processingAssessments: number;
  avgCompletionSeconds: number;
  assessmentsToday: number;
  assessmentsThisWeek: number;
  failedAssessments: number;
}

interface Assessment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  projectName: string;
  assessmentType: string;
  status: string;
  aiProvider: string | null;
  completionTimeSeconds: number | null;
  createdAt: string;
}

interface AssessmentsResponse {
  assessments: Assessment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const PAGE_SIZE = 20;

  async function handleLogin() {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(apiUrl("/admin/stats"), {
        headers: { "x-admin-password": password },
      });
      if (res.status === 401 || res.status === 403) {
        setAuthError("كلمة المرور غير صحيحة");
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "خطأ");
      setStats(data.stats);
      setAuthed(true);
      loadAssessments(1, "", password);
    } catch {
      setAuthError("خطأ في الاتصال بالخادم");
    } finally {
      setAuthLoading(false);
    }
  }

  const loadAssessments = useCallback(
    async (p: number, s: string, pw: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
        if (s) params.set("status", s);
        const res = await fetch(apiUrl(`/admin/assessments?${params}`), {
          headers: { "x-admin-password": pw },
        });
        const data: { success: boolean; error?: string } & AssessmentsResponse = await res.json();
        if (!data.success) throw new Error(data.error ?? "خطأ");
        setAssessments(data.assessments);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(p);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  async function loadStats() {
    const res = await fetch(apiUrl("/admin/stats"), {
      headers: { "x-admin-password": password },
    });
    const data = await res.json();
    if (data.success) setStats(data.stats);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch(apiUrl("/admin/export"), {
        headers: { "x-admin-password": password },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inspire-export-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("فشل التصدير");
    } finally {
      setExporting(false);
    }
  }

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      completed: "bg-green-500/10 text-green-600 border-green-500/20",
      processing: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      draft: "bg-secondary text-muted-foreground border-border",
      failed: "bg-destructive/10 text-destructive border-destructive/20",
    };
    const ar: Record<string, string> = { completed: "مكتمل", processing: "جارٍ", draft: "مسودة", failed: "فشل" };
    return (
      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${map[s] ?? "bg-secondary border-border"}`}>
        {ar[s] ?? s}
      </span>
    );
  };

  // ─── Auth gate ───────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-10 shadow-xl w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary">لوحة الإدارة</h1>
            <p className="text-sm text-muted-foreground mt-1">أدخل كلمة المرور للمتابعة</p>
          </div>
          <input
            type="password"
            dir="ltr"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {authError && (
            <div className="flex items-center gap-2 text-destructive text-sm mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {authError}
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={authLoading || !password}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "دخول"}
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Dashboard ───────────────────────────────────────────

  const statCards = stats
    ? [
        { label: "إجمالي المستخدمين", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
        { label: "التقييمات الكاملة", value: stats.totalAssessments, icon: ClipboardList, color: "text-purple-500" },
        { label: "مكتملة", value: stats.completedAssessments, icon: CheckCircle2, color: "text-green-500" },
        { label: "هذا الأسبوع", value: stats.assessmentsThisWeek, icon: Clock, color: "text-accent" },
      ]
    : [];

  const filtered = search
    ? assessments.filter(
        (a) =>
          a.userName?.toLowerCase().includes(search.toLowerCase()) ||
          a.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
          a.projectName?.toLowerCase().includes(search.toLowerCase())
      )
    : assessments;

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">لوحة الإدارة</h1>
            <p className="text-sm text-muted-foreground">إحصائيات وبيانات INSPIRE</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { loadStats(); loadAssessments(page, status, password); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:border-primary/30 text-sm transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              تحديث
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium transition-all hover:bg-accent/90"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              تصدير CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm"
            >
              <c.icon className={`h-6 w-6 mb-3 ${c.color}`} />
              <div className="text-2xl font-bold text-primary">{c.value.toLocaleString("ar")}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="بحث بالاسم أو البريد أو المشروع..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              loadAssessments(1, e.target.value, password);
            }}
          >
            <option value="">الكل</option>
            <option value="completed">مكتمل</option>
            <option value="processing">جارٍ</option>
            <option value="draft">مسودة</option>
            <option value="failed">فشل</option>
          </select>
        </div>

        {/* Table */}
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm mb-4">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">لا توجد تقييمات</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">المستخدم</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">المشروع</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">النوع</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr
                      key={a.id}
                      className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/5"}`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-primary">{a.userName}</div>
                        <div className="text-xs text-muted-foreground" dir="ltr">{a.userEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{a.projectName}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${a.assessmentType === "mini" ? "bg-accent/10 text-accent border-accent/20" : "bg-secondary border-border text-muted-foreground"}`}>
                          {a.assessmentType === "mini" ? "سريع" : "كامل"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{statusBadge(a.status)}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground" dir="ltr">
                        {new Date(a.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 text-sm">
            <span className="text-muted-foreground">
              {total.toLocaleString("ar")} تقييم — صفحة {page} من {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => loadAssessments(page - 1, status, password)}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl border border-border disabled:opacity-40 hover:border-primary/30 transition-all"
              >
                السابق
              </button>
              <button
                onClick={() => loadAssessments(page + 1, status, password)}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl border border-border disabled:opacity-40 hover:border-primary/30 transition-all"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
