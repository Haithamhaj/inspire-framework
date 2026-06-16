import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { KeyRound, Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { JourneyPanel, JourneyPrimaryButton, JourneyShell } from "@/components/journey";
import { useI18n } from "@/i18n";
import { localizePath } from "@/lib/locale-paths";

function apiUrl(path: string) {
  return `/api${path}`;
}

export default function ResetPassword() {
  const { dir, locale } = useI18n();
  const href = (path: string) => localizePath(path, locale);
  const text = locale === "ar" ? {
    title: "إنشاء كلمة مرور جديدة",
    subtitle: "استخدم رابط إعادة التعيين من بريدك. ينتهي خلال ساعة ويعمل مرة واحدة.",
    eyebrow: "إعادة تعيين آمنة",
    heading: "كلمة مرور جديدة",
    description: "بعد هذا التغيير، سيتم إلغاء الجلسات الحالية.",
    missingToken: "رابط إعادة التعيين لا يحتوي على رمز صالح. اطلب رابطاً جديداً.",
    passwordLabel: "كلمة المرور الجديدة",
    passwordPlaceholder: "8 أحرف على الأقل",
    confirmLabel: "تأكيد كلمة المرور",
    confirmPlaceholder: "أعد كتابة كلمة المرور الجديدة",
    mismatch: "كلمتا المرور غير متطابقتين.",
    weak: "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف ورقم.",
    fallback: "تعذّر تحديث كلمة المرور",
    success: "تم تحديث كلمة المرور. سيتم تحويلك لتسجيل الدخول...",
    saving: "جارٍ الحفظ...",
    submit: "تحديث كلمة المرور",
    needLink: "تحتاج رابطاً آخر؟",
    requestReset: "طلب إعادة تعيين",
  } : {
    title: "Create a new password",
    subtitle: "Use the reset link from your email. It expires after one hour and works once.",
    eyebrow: "Secure reset",
    heading: "New password",
    description: "After this change, existing sessions are revoked.",
    missingToken: "This reset link is missing a token. Request a new password reset email.",
    passwordLabel: "New password",
    passwordPlaceholder: "At least 8 characters",
    confirmLabel: "Confirm password",
    confirmPlaceholder: "Repeat new password",
    mismatch: "Passwords do not match.",
    weak: "Password must be at least 8 characters and include a letter and a number.",
    fallback: "Unable to reset password",
    success: "Password updated. Redirecting to login...",
    saving: "Saving...",
    submit: "Update password",
    needLink: "Need another link?",
    requestReset: "Request reset",
  };
  const [, setLocation] = useLocation();
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token") ?? "", []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError(text.mismatch);
      return;
    }
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError(text.weak);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl("/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json() as { success: boolean; message?: string; error?: string };
      if (!data.success) throw new Error(data.error ?? text.fallback);
      setMessage(text.success);
      window.setTimeout(() => setLocation(href("/login")), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : text.fallback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <JourneyShell
      dir={dir}
      eyebrow="INSPIRE"
      title={text.title}
      subtitle={text.subtitle}
    >
      <JourneyPanel className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-start gap-4"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.1] text-rose-200 shadow-lg shadow-rose-950/25">
            <KeyRound className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-200/80">{text.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-black text-slate-50">{text.heading}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{text.description}</p>
          </div>
        </motion.div>

        {!token ? (
          <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            {text.missingToken}
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">{text.passwordLabel}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input-ltr w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 pl-12 pr-4 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                  placeholder={text.passwordPlaceholder}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">{text.confirmLabel}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="input-ltr w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 pl-12 pr-4 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                  placeholder={text.confirmPlaceholder}
                  required
                />
              </div>
            </div>

            {message && <p className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{message}</p>}
            {error && <p className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</p>}

            <JourneyPrimaryButton
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full"
              icon={loading ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
            >
              {loading ? text.saving : text.submit}
            </JourneyPrimaryButton>
          </form>
        )}

        <p className="mt-8 text-center font-medium text-slate-400">
          {text.needLink}{" "}
          <Link href={href("/forgot-password")} className="font-bold text-rose-200 transition-colors hover:text-rose-100 hover:underline">
            {text.requestReset}
          </Link>
        </p>
      </JourneyPanel>
    </JourneyShell>
  );
}
