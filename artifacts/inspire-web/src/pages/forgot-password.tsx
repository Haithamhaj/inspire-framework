import { useState } from "react";
import { Link } from "wouter";
import { Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { JourneyPanel, JourneyPrimaryButton, JourneyShell } from "@/components/journey";
import { useI18n } from "@/i18n";

function apiUrl(path: string) {
  return `/api${path}`;
}

export default function ForgotPassword() {
  const { dir } = useI18n();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(apiUrl("/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { success: boolean; message?: string; error?: string; retryAfter?: number };
      if (!data.success) {
        if (res.status === 429 && data.retryAfter) {
          throw new Error(`Too many requests. Try again in ${Math.ceil(data.retryAfter / 60)} minutes.`);
        }
        throw new Error(data.error ?? "Unable to request reset link");
      }
      setMessage("If an account exists, a reset link has been sent to that email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to request reset link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <JourneyShell
      dir={dir}
      eyebrow="INSPIRE"
      title="Reset your password"
      subtitle="Enter the email you used for INSPIRE. The reset link expires in one hour."
    >
      <JourneyPanel className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-start gap-4"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.1] text-rose-200 shadow-lg shadow-rose-950/25">
            <Mail className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-200/80">Account access</p>
            <h2 className="mt-2 text-2xl font-black text-slate-50">Forgot password</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">We will send a secure, one-time reset link if the account exists.</p>
          </div>
        </motion.div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input-ltr w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 pl-12 pr-4 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          {message && <p className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{message}</p>}
          {error && <p className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</p>}

          <JourneyPrimaryButton
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full"
            icon={loading ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
          >
            {loading ? "Sending..." : "Send reset link"}
          </JourneyPrimaryButton>
        </form>

        <p className="mt-8 text-center font-medium text-slate-400">
          Remembered your password?{" "}
          <Link href="/login" className="font-bold text-rose-200 transition-colors hover:text-rose-100 hover:underline">
            Log in
          </Link>
        </p>
      </JourneyPanel>
    </JourneyShell>
  );
}
