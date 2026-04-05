import { useState, useCallback, useEffect } from "react";
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
  Tag,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
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

interface DiscountCode {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
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

  // User verification state
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Password reset state
  const [resetEmail, setResetEmail] = useState("");
  const [resetPass, setResetPass] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Delete user state
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Discount codes state
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [codesLoading, setCodesLoading] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newPct, setNewPct] = useState("10");
  const [newMaxUses, setNewMaxUses] = useState("");
  const [creatingCode, setCreatingCode] = useState(false);
  const [codeError, setCodeError] = useState("");

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
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "خطأ غير متوقع");
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

  const loadDiscountCodes = useCallback(async (pw: string) => {
    setCodesLoading(true);
    try {
      const res = await fetch(apiUrl("/admin/discount-codes"), {
        headers: { "x-admin-password": pw },
      });
      const d = await res.json() as { success: boolean; codes?: DiscountCode[] };
      if (d.success) setDiscountCodes(d.codes ?? []);
    } finally {
      setCodesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed && password) loadDiscountCodes(password);
  }, [authed, password, loadDiscountCodes]);

  async function handleCreateCode() {
    const code = newCode.trim().toUpperCase();
    const pct = parseInt(newPct);
    if (!code || isNaN(pct) || pct < 1 || pct > 100) {
      setCodeError("أدخل كوداً صالحاً ونسبة خصم من 1 إلى 100");
      return;
    }
    setCreatingCode(true);
    setCodeError("");
    try {
      const res = await fetch(apiUrl("/admin/discount-codes"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ code, discountPercent: pct, maxUses: newMaxUses ? parseInt(newMaxUses) : null }),
      });
      const d = await res.json() as { success: boolean; code?: DiscountCode; error?: string };
      if (!d.success) { setCodeError(d.error ?? "فشل الإنشاء"); return; }
      setDiscountCodes(prev => [d.code!, ...prev]);
      setNewCode(""); setNewPct("10"); setNewMaxUses("");
    } catch {
      setCodeError("فشل الاتصال");
    } finally {
      setCreatingCode(false);
    }
  }

  async function handleToggleCode(id: string, isActive: boolean) {
    const res = await fetch(apiUrl(`/admin/discount-codes/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ isActive: !isActive }),
    });
    const d = await res.json() as { success: boolean; code?: DiscountCode };
    if (d.success && d.code) {
      setDiscountCodes(prev => prev.map(c => c.id === id ? d.code! : c));
    }
  }

  async function handleDeleteCode(id: string) {
    if (!confirm("حذف كود الخصم؟")) return;
    const res = await fetch(apiUrl(`/admin/discount-codes/${id}`), {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });
    const d = await res.json() as { success: boolean };
    if (d.success) setDiscountCodes(prev => prev.filter(c => c.id !== id));
  }

  async function handleDeleteUser() {
    const email = deleteEmail.trim();
    if (!email) return;
    if (!confirm(`⚠️ حذف حساب ${email} نهائياً؟ لا يمكن التراجع.`)) return;
    setDeleting(true);
    setDeleteMsg(null);
    try {
      const res = await fetch(apiUrl("/admin/users"), {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ email }),
      });
      const d = await res.json() as { success: boolean; error?: string };
      if (d.success) {
        setDeleteMsg({ ok: true, text: `✅ تم حذف حساب ${email} بنجاح` });
        setDeleteEmail("");
      } else {
        setDeleteMsg({ ok: false, text: d.error ?? "فشل الحذف" });
      }
    } catch {
      setDeleteMsg({ ok: false, text: "فشل الاتصال" });
    } finally {
      setDeleting(false);
    }
  }

  async function handleResetPassword() {
    const email = resetEmail.trim();
    if (!email || resetPass.length < 6) return;
    setResetting(true);
    setResetMsg(null);
    try {
      const res = await fetch(apiUrl("/admin/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ email, newPassword: resetPass }),
      });
      const d = await res.json() as { success: boolean; error?: string };
      if (d.success) {
        setResetMsg({ ok: true, text: `✅ تم تغيير كلمة مرور ${email} بنجاح` });
        setResetEmail(""); setResetPass("");
      } else {
        setResetMsg({ ok: false, text: d.error ?? "فشل التغيير" });
      }
    } catch {
      setResetMsg({ ok: false, text: "فشل الاتصال" });
    } finally {
      setResetting(false);
    }
  }

  async function handleVerifyUser() {
    const email = verifyEmail.trim();
    if (!email) return;
    setVerifying(true);
    setVerifyMsg(null);
    try {
      const res = await fetch(apiUrl("/admin/verify-user"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ email }),
      });
      const d = await res.json() as { success: boolean; error?: string };
      if (d.success) {
        setVerifyMsg({ ok: true, text: `✅ تم تفعيل ${email} بنجاح` });
        setVerifyEmail("");
      } else {
        setVerifyMsg({ ok: false, text: d.error ?? "فشل التفعيل" });
      }
    } catch {
      setVerifyMsg({ ok: false, text: "فشل الاتصال" });
    } finally {
      setVerifying(false);
    }
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

        {/* ─── Verify User Section ─── */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-display font-bold text-foreground">تفعيل حسابات المستخدمين</h2>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-sm text-muted-foreground mb-4">إذا لم يصل إيميل التفعيل للمستخدم، يمكنك تفعيل حسابه يدوياً من هنا.</p>
            <div className="flex gap-3">
              <input
                type="email"
                value={verifyEmail}
                onChange={(e) => setVerifyEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyUser()}
                placeholder="البريد الإلكتروني للمستخدم"
                className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                dir="ltr"
              />
              <button
                onClick={handleVerifyUser}
                disabled={verifying || !verifyEmail.trim()}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 hover:bg-green-700 transition-colors"
              >
                {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                تفعيل
              </button>
            </div>
            {verifyMsg && (
              <p className={`mt-3 text-sm font-medium ${verifyMsg.ok ? "text-green-600" : "text-red-500"}`}>
                {verifyMsg.text}
              </p>
            )}
          </div>
        </div>

        {/* ─── Reset Password Section ─── */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-display font-bold text-foreground">تغيير كلمة مرور مستخدم</h2>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-sm text-muted-foreground mb-4">استخدم هذا لإعادة تعيين كلمة مرور أي مستخدم يدوياً.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                dir="ltr"
              />
              <input
                type="text"
                value={resetPass}
                onChange={(e) => setResetPass(e.target.value)}
                placeholder="كلمة المرور الجديدة (6 أحرف على الأقل)"
                className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                dir="ltr"
              />
              <button
                onClick={handleResetPassword}
                disabled={resetting || !resetEmail.trim() || resetPass.length < 6}
                className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                تغيير
              </button>
            </div>
            {resetMsg && (
              <p className={`mt-3 text-sm font-medium ${resetMsg.ok ? "text-green-600" : "text-red-500"}`}>
                {resetMsg.text}
              </p>
            )}
          </div>
        </div>

        {/* ─── Delete User Section ─── */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-5">
            <Trash2 className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-display font-bold text-foreground">حذف حساب مستخدم</h2>
          </div>
          <div className="bg-card border border-red-200 rounded-2xl p-6">
            <p className="text-sm text-muted-foreground mb-4">تحذير: هذا الإجراء نهائي ولا يمكن التراجع عنه.</p>
            <div className="flex gap-3">
              <input
                type="email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDeleteUser()}
                placeholder="البريد الإلكتروني للمستخدم"
                className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-red-300"
                dir="ltr"
              />
              <button
                onClick={handleDeleteUser}
                disabled={deleting || !deleteEmail.trim()}
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                حذف
              </button>
            </div>
            {deleteMsg && (
              <p className={`mt-3 text-sm font-medium ${deleteMsg.ok ? "text-green-600" : "text-red-500"}`}>
                {deleteMsg.text}
              </p>
            )}
          </div>
        </div>

        {/* ─── Discount Codes Section ─── */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-5">
            <Tag className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-display font-bold text-foreground">أكواد الخصم</h2>
          </div>

          {/* Create code form */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-5">
            <h3 className="font-semibold text-sm mb-4 text-foreground">إنشاء كود جديد</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">الكود</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="INSPIRE10"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">نسبة الخصم %</label>
                <input
                  type="number"
                  value={newPct}
                  onChange={(e) => setNewPct(e.target.value)}
                  min="1" max="100"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">حد الاستخدام (اختياري)</label>
                <input
                  type="number"
                  value={newMaxUses}
                  onChange={(e) => setNewMaxUses(e.target.value)}
                  placeholder="غير محدود"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  dir="ltr"
                />
              </div>
            </div>
            {codeError && <p className="text-sm text-red-500 mb-3">{codeError}</p>}
            <button
              onClick={handleCreateCode}
              disabled={creatingCode}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-70 hover:bg-primary/90 transition-colors"
            >
              {creatingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              إنشاء كود
            </button>
          </div>

          {/* Codes table */}
          {codesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : discountCodes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">لا توجد أكواد خصم بعد</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border text-right">
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-xs">الكود</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-xs">الخصم</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-xs">الاستخدام</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-xs">الحالة</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-xs">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {discountCodes.map((code) => (
                    <tr key={code.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                      <td className="px-4 py-3 font-mono font-bold text-primary" dir="ltr">{code.code}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{code.discountPercent}%</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {code.usedCount} / {code.maxUses ?? "∞"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${code.isActive ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"}`}>
                          {code.isActive ? "مفعّل" : "معطّل"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleCode(code.id, code.isActive)}
                            title={code.isActive ? "تعطيل" : "تفعيل"}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {code.isActive
                              ? <ToggleRight className="h-5 w-5 text-green-600" />
                              : <ToggleLeft className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteCode(code.id)}
                            title="حذف"
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
