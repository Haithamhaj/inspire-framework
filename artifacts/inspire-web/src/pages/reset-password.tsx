import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { KeyRound, Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { JourneyPanel, JourneyPrimaryButton, JourneyShell } from "@/components/journey";
import { useI18n } from "@/i18n";

function apiUrl(path: string) {
  return `/api${path}`;
}

export default function ResetPassword() {
  const { dir } = useI18n();
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
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must be at least 8 characters and include a letter and a number.");
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
      if (!data.success) throw new Error(data.error ?? "Unable to reset password");
      setMessage("Password updated. Redirecting to login...");
      window.setTimeout(() => setLocation("/login"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <JourneyShell
      dir={dir}
      eyebrow="INSPIRE"
      title="Create a new password"
      subtitle="Use the reset link from your email. It expires after one hour and works once."
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
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-200/80">Secure reset</p>
            <h2 className="mt-2 text-2xl font-black text-slate-50">New password</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">After this change, existing sessions are revoked.</p>
          </div>
        </motion.div>

        {!token ? (
          <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            This reset link is missing a token. Request a new password reset email.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">New password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input-ltr w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 pl-12 pr-4 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                  placeholder="At least 8 characters"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="input-ltr w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 pl-12 pr-4 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                  placeholder="Repeat new password"
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
              {loading ? "Saving..." : "Update password"}
            </JourneyPrimaryButton>
          </form>
        )}

        <p className="mt-8 text-center font-medium text-slate-400">
          Need another link?{" "}
          <Link href="/forgot-password" className="font-bold text-rose-200 transition-colors hover:text-rose-100 hover:underline">
            Request reset
          </Link>
        </p>
      </JourneyPanel>
    </JourneyShell>
  );
}
