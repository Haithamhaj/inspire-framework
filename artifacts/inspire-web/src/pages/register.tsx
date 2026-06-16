import { useMemo, useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister, ApiError } from "@workspace/api-client-react";
import { UserPlus, Mail, Lock, User, Briefcase, Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n";
import { localizePath } from "@/lib/locale-paths";
import {
  JourneyPanel,
  JourneyPrimaryButton,
  JourneyShell,
  JourneyStepIndicator,
} from "@/components/journey";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  job_title?: string;
};

function iconSideClass(dir: "rtl" | "ltr") {
  return dir === "rtl" ? "right-4" : "left-4";
}

function textPaddingClass(dir: "rtl" | "ltr") {
  return dir === "rtl" ? "pr-12 pl-4" : "pl-12 pr-4";
}

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { dir, locale, t } = useI18n();
  const href = (path: string) => localizePath(path, locale);
  const { mutateAsync: registerUser, isPending } = useRegister();
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);

  const registerSchema = useMemo(() => z
    .object({
      name: z.string().min(2, t("register.validationName")),
      email: z.string().email(t("register.validationEmail")),
      password: z
        .string()
        .min(8, t("register.validationPasswordLength"))
        .regex(/[a-zA-Z]/, t("register.validationPasswordLetter"))
        .regex(/[0-9]/, t("register.validationPasswordNumber")),
      confirmPassword: z.string().min(1, t("register.validationConfirmRequired")),
      job_title: z.string().optional(),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: t("register.validationPasswordsMatch"),
      path: ["confirmPassword"],
    }), [t]);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const emailRegistration = register("email");
  const emailField = {
    ...emailRegistration,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsDuplicateEmail(false);
      return emailRegistration.onChange(e);
    },
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsDuplicateEmail(false);
    try {
      const result = await registerUser({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          job_title: data.job_title,
          consent_given: true,
        }
      });
      if (result.success) {
        setSuccess(true);
        toast({
          title: t("register.successToastTitle"),
          description: t("register.successToastDescription"),
        });
        setTimeout(() => setLocation(href("/login")), 2500);
      }
    } catch (err: unknown) {
      let message = t("register.errorFallback");
      if (err instanceof ApiError) {
        const data = err.data as { error?: string; retryAfter?: number; details?: { fieldErrors?: Record<string, string[]> } } | null;
        if (err.status === 409) {
          setIsDuplicateEmail(true);
          toast({
            variant: "destructive",
            title: t("register.duplicateEmailTitle"),
            description: t("register.duplicateEmailDescription"),
          });
          return;
        } else if (err.status === 429 && data?.retryAfter != null) {
          const minutes = Math.ceil(data.retryAfter / 60);
          message = t("register.tooManyAttempts").replace("{minutes}", String(minutes));
        } else {
          const fieldErrors = data?.details?.fieldErrors;
          if (fieldErrors && Object.keys(fieldErrors).length > 0) {
            message = Object.values(fieldErrors).flat().join(" • ");
          } else if (data?.error) {
            message = data.error;
          } else {
            message = err.message;
          }
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast({
        variant: "destructive",
        title: t("register.errorToastTitle"),
        description: message,
      });
    }
  };

  if (success) {
    return (
      <JourneyShell
        dir={dir}
        eyebrow="INSPIRE"
        title={t("register.successTitle")}
        subtitle={t("register.successDescription")}
      >
        <JourneyPanel className="mx-auto max-w-md text-center">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-teal-300/25 bg-teal-400/[0.12] text-teal-200 shadow-xl shadow-teal-950/25"
          >
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="mb-4 text-3xl font-black text-slate-50">{t("register.successTitle")}</h2>
          <p className="text-lg leading-8 text-slate-300">{t("register.successDescription")}</p>
        </JourneyPanel>
      </JourneyShell>
    );
  }

  return (
    <JourneyShell
      dir={dir}
      eyebrow="INSPIRE"
      title={t("register.title")}
      subtitle={t("register.subtitle")}
      aside={
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-100">INSPIRE</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {t("register.subtitle")}
              </p>
            </div>
          </div>

          <JourneyStepIndicator
            steps={[
              { label: t("privacyConsent.title"), state: "complete" },
              { label: t("register.title"), state: "current" },
              { label: t("assessment.shell.title"), state: "upcoming" },
            ]}
          />
        </div>
      }
    >
      <JourneyPanel className="max-w-2xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.1] text-rose-200 shadow-lg shadow-rose-950/25">
            <UserPlus className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-200/80">
              INSPIRE
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-50">{t("register.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{t("register.subtitle")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">{t("register.nameLabel")}</label>
            <div className="relative">
              <User className={`absolute ${iconSideClass(dir)} top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500`} />
              <input
                {...register("name")}
                className={`w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 ${textPaddingClass(dir)} text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10`}
                placeholder={t("register.namePlaceholder")}
              />
            </div>
            {errors.name && <p className="mt-1.5 text-sm font-medium text-rose-300">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">{t("register.emailLabel")}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                {...emailField}
                type="email"
                dir="ltr"
                className="input-ltr w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 pl-12 pr-4 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                placeholder="name@company.com"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-sm font-medium text-rose-300">{errors.email.message}</p>}
            {isDuplicateEmail && !errors.email && (
              <p className="mt-1.5 text-sm font-medium text-rose-300">
                {t("register.duplicateEmailInline")}{" "}
                <Link href={href("/login")} className="font-bold underline transition-colors hover:text-rose-200">
                  {t("register.duplicateEmailLoginCta")}
                </Link>
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">{t("register.passwordLabel")}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                {...register("password")}
                type={showPass ? "text" : "password"}
                dir="ltr"
                className="input-ltr w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 pl-12 pr-12 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-200"
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-sm font-medium text-rose-300">{errors.password.message}</p>}
            <p className="mt-1.5 text-xs text-slate-500">{t("register.passwordHint")}</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">{t("register.confirmPasswordLabel")}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                dir="ltr"
                className="input-ltr w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 pl-12 pr-12 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-200"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm font-medium text-rose-300">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">
              {t("register.jobTitleLabel")} <span className="text-xs font-normal text-slate-500">({t("register.optionalLabel")})</span>
            </label>
            <div className="relative">
              <Briefcase className={`absolute ${iconSideClass(dir)} top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500`} />
              <input
                {...register("job_title")}
                className={`w-full rounded-2xl border border-slate-400/10 bg-slate-950/65 py-3.5 ${textPaddingClass(dir)} text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-rose-300/35 focus:ring-4 focus:ring-rose-500/10`}
                placeholder={t("register.jobTitlePlaceholder")}
              />
            </div>
          </div>

          <div className="pt-3">
            <JourneyPrimaryButton
              type="submit"
              disabled={isPending}
              className="w-full"
              icon={isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
            >
              {isPending ? t("register.submitting") : t("register.submitButton")}
            </JourneyPrimaryButton>
          </div>
        </form>

        <p className="mt-8 text-center font-medium text-slate-400">
          {t("register.haveAccount")}{" "}
          <Link href={href("/login")} className="font-bold text-rose-200 transition-colors hover:text-rose-100 hover:underline">
            {t("register.loginLink")}
          </Link>
        </p>
      </JourneyPanel>
    </JourneyShell>
  );
}
