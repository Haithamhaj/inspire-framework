import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, ApiError } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/i18n";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  JourneyPanel,
  JourneyPrimaryButton,
  JourneyShell,
  JourneyStepIndicator,
} from "@/components/journey";

type LoginFormData = { email: string; password: string };

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login: setAuthToken } = useAuth();
  const { mutateAsync: performLogin, isPending } = useLogin();
  const { t, dir } = useI18n();

  const loginSchema = z.object({
    email: z.string().email(t("login.emailInvalid")),
    password: z.string().min(1, t("login.passwordRequired")),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await performLogin({ data });
      if (result.success && result.access_token) {
        setAuthToken(result.access_token);
        toast({ title: t("login.successToast") });
        setLocation("/my-assessments");
      }
    } catch (err: unknown) {
      let message = t("login.errorFallback");
      if (err instanceof ApiError) {
        const data = err.data as { error?: string; retryAfter?: number } | null;
        if (err.status === 429 && data?.retryAfter != null) {
          const minutes = Math.ceil(data.retryAfter / 60);
          message = `حاولت كثيراً، أعد المحاولة بعد ${minutes} دقيقة`;
        } else if (data?.error) {
          message = data.error;
        } else {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast({
        variant: "destructive",
        title: t("login.errorToastTitle"),
        description: message,
      });
    }
  };

  return (
    <JourneyShell
      dir={dir}
      eyebrow="INSPIRE"
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      aside={
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200">
              <LogIn className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-100">INSPIRE</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {t("login.subtitle")}
              </p>
            </div>
          </div>

          <JourneyStepIndicator
            steps={[
              { label: t("privacyConsent.title"), state: "complete" },
              { label: t("login.title"), state: "current" },
              { label: t("assessment.shell.title"), state: "upcoming" },
            ]}
          />
        </div>
      }
    >
      <JourneyPanel className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-start gap-4"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.1] text-rose-200 shadow-lg shadow-rose-950/25">
            <LogIn className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-200/80">
              INSPIRE
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-50">{t("login.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{t("login.subtitle")}</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">{t("login.emailLabel")}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                {...register("email")}
                type="email"
                dir="ltr"
                className="input-ltr w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 pl-12 pr-4 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                placeholder="name@company.com"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-sm font-medium text-rose-300">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">{t("login.passwordLabel")}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                {...register("password")}
                type="password"
                dir="ltr"
                className="input-ltr w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 pl-12 pr-4 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1.5 text-sm font-medium text-rose-300">{errors.password.message}</p>}
            <div className="mt-3 text-right">
              <Link href="/forgot-password" className="text-sm font-bold text-rose-200 transition-colors hover:text-rose-100 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <JourneyPrimaryButton
              type="submit"
              disabled={isPending}
              className="w-full"
              icon={isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
            >
              {isPending ? t("login.submitting") : t("login.submitButton")}
            </JourneyPrimaryButton>
          </div>
        </form>

        <p className="mt-8 text-center font-medium text-slate-400">
          {t("login.noAccount")}{" "}
          <Link href="/privacy-consent" className="font-bold text-rose-200 transition-colors hover:text-rose-100 hover:underline">
            {t("login.createAccount")}
          </Link>
        </p>
      </JourneyPanel>
    </JourneyShell>
  );
}
