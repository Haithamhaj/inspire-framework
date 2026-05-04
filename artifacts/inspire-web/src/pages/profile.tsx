/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { motion } from "framer-motion";
import { User, Briefcase, Lock, Save, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/i18n";
import {
  JourneyPanel,
  JourneyPrimaryButton,
  JourneyShell,
} from "@/components/journey";

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
  const { dir } = useI18n();

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
      <JourneyShell dir={dir} eyebrow="INSPIRE" title="الملف الشخصي">
        <JourneyPanel className="mx-auto flex min-h-[18rem] max-w-xl items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-rose-200" />
        </JourneyPanel>
      </JourneyShell>
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
    <JourneyShell
      dir={dir}
      eyebrow="INSPIRE"
      title="الملف الشخصي"
      subtitle={user.email}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-50 mb-1">
            الملف الشخصي
          </h1>
          <p className="text-slate-400 text-sm">{user.email}</p>
        </div>

        {/* Profile info form */}
        <JourneyPanel>
        <form onSubmit={handleProfileSave} className="space-y-5">
          <h2 className="font-black text-slate-50 flex items-center gap-2">
            <User className="h-4 w-4 text-rose-200" />
            البيانات الشخصية
          </h2>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-200">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
              placeholder="اسمك الكامل"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-slate-500" />
              المسمى الوظيفي
              <span className="text-xs text-slate-500">(اختياري)</span>
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              maxLength={200}
              className="w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
              placeholder="مثال: مدير مشروع"
            />
          </div>

          {profileMsg && (
            <div
              className={`text-sm px-4 py-2.5 rounded-2xl border ${
                profileMsg.ok
                  ? "bg-teal-500/[0.08] border-teal-300/20 text-teal-200"
                  : "bg-rose-500/[0.08] border-rose-300/20 text-rose-200"
              }`}
            >
              {profileMsg.text}
            </div>
          )}

          <JourneyPrimaryButton
            type="submit"
            disabled={profileSaving}
            icon={profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          >
            حفظ التغييرات
          </JourneyPrimaryButton>
        </form>
        </JourneyPanel>

        {/* Password change section */}
        <JourneyPanel className="mt-6 overflow-hidden p-0">
          <button
            type="button"
            onClick={() => {
              setShowPassword((v) => !v);
              setPasswordMsg(null);
            }}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-900/60 transition-colors"
          >
            <span className="font-bold text-slate-100 flex items-center gap-2">
              <Lock className="h-4 w-4 text-rose-200" />
              تغيير كلمة المرور
            </span>
            {showPassword ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {showPassword && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handlePasswordSave}
              className="px-6 pb-6 space-y-4 border-t border-slate-400/10 pt-5"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-200">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-200">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                  placeholder="8 أحرف على الأقل، تحتوي على رقم"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-200">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 px-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                  placeholder="••••••••"
                />
              </div>

              {passwordMsg && (
                <div
                  className={`text-sm px-4 py-2.5 rounded-2xl border ${
                    passwordMsg.ok
                      ? "bg-teal-500/[0.08] border-teal-300/20 text-teal-200"
                      : "bg-rose-500/[0.08] border-rose-300/20 text-rose-200"
                  }`}
                >
                  {passwordMsg.text}
                </div>
              )}

              <JourneyPrimaryButton
                type="submit"
                disabled={passwordSaving}
                icon={passwordSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              >
                تغيير كلمة المرور
              </JourneyPrimaryButton>
            </motion.form>
          )}
        </JourneyPanel>
      </motion.div>
    </JourneyShell>
  );
}
