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
        setLocation("/assess");
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
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 flex justify-center items-center bg-gray-50/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-3xl shadow-xl shadow-primary/5 border border-border overflow-hidden"
      >
        <div className="p-8 sm:p-12" dir={dir}>
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-accent/10 rounded-2xl">
              <LogIn className="h-10 w-10 text-accent" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">{t("login.title")}</h1>
            <p className="text-muted-foreground">{t("login.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">{t("login.emailLabel")}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <input
                  {...register("email")}
                  type="email"
                  dir="ltr"
                  className="input-ltr w-full bg-background border-2 border-border rounded-xl py-3 pl-12 pr-4 text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">{t("login.passwordLabel")}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <input
                  {...register("password")}
                  type="password"
                  dir="ltr"
                  className="input-ltr w-full bg-background border-2 border-border rounded-xl py-3 pl-12 pr-4 text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isPending ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> {t("login.submitting")}</>
                ) : (
                  t("login.submitButton")
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-muted-foreground font-medium">
            {t("login.noAccount")}{" "}
            <Link href="/privacy-consent" className="text-accent hover:underline font-bold">
              {t("login.createAccount")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
