import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { motion } from "framer-motion";
import { User, Briefcase, Lock, Save, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function apiUrl(path: string) {
  return `/api${path}`;
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "حدث خطأ غير متوقع";
}

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Pre-fill form fields once user data is available
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setJobTitle(user.jobTitle ?? "");
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSaving(true);
    try {
      const res = await fetch(apiUrl("/auth/profile"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          job_title: jobTitle.trim() || null,
        }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error || "فشل الحفظ");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setProfileMsg({ ok: true, text: "تم حفظ البيانات بنجاح" });
    } catch (err: unknown) {
      setProfileMsg({ ok: false, text: getErrorMessage(err) });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, text: "كلمة المرور الجديدة غير متطابقة" });
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch(apiUrl("/auth/profile"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error || "فشل تغيير كلمة المرور");
      setPasswordMsg({ ok: true, text: "تم تغيير كلمة المرور بنجاح" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
    } catch (err: unknown) {
      setPasswordMsg({ ok: false, text: getErrorMessage(err) });
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">
            الملف الشخصي
          </h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>

        {/* Profile info form */}
        <form onSubmit={handleProfileSave} className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-5">
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            البيانات الشخصية
          </h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              placeholder="اسمك الكامل"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              المسمى الوظيفي
              <span className="text-xs text-muted-foreground">(اختياري)</span>
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              placeholder="مثال: مدير مشروع"
            />
          </div>

          {profileMsg && (
            <div
              className={`text-sm px-4 py-2.5 rounded-xl border ${
                profileMsg.ok
                  ? "bg-green-50 border-green-100 text-green-700"
                  : "bg-red-50 border-red-100 text-red-700"
              }`}
            >
              {profileMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={profileSaving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            حفظ التغييرات
          </button>
        </form>

        {/* Password change section */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => {
              setShowPassword((v) => !v);
              setPasswordMsg(null);
            }}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
          >
            <span className="font-display font-semibold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              تغيير كلمة المرور
            </span>
            {showPassword ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showPassword && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handlePasswordSave}
              className="px-6 pb-6 space-y-4 border-t border-border pt-5"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="8 أحرف على الأقل، تحتوي على رقم"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {passwordMsg && (
                <div
                  className={`text-sm px-4 py-2.5 rounded-xl border ${
                    passwordMsg.ok
                      ? "bg-green-50 border-green-100 text-green-700"
                      : "bg-red-50 border-red-100 text-red-700"
                  }`}
                >
                  {passwordMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={passwordSaving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {passwordSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                تغيير كلمة المرور
              </button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
