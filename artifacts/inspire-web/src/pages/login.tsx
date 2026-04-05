import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login: setAuthToken } = useAuth();
  const { mutateAsync: performLogin, isPending } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await performLogin({ data });
      if (result.success && result.access_token) {
        setAuthToken(result.access_token);
        toast({ title: "مرحباً بك مجدداً!" });
        setLocation("/assess");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "بيانات الدخول غير صحيحة";
      toast({
        variant: "destructive",
        title: "فشل تسجيل الدخول",
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
        <div className="p-8 sm:p-12">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-accent/10 rounded-2xl">
              <LogIn className="h-10 w-10 text-accent" />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">تسجيل الدخول</h1>
            <p className="text-muted-foreground">أهلاً بك في منصة INSPIRE للتقييم</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">البريد الإلكتروني</label>
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
              <label className="block text-sm font-bold text-foreground mb-2">كلمة المرور</label>
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
                  <><Loader2 className="h-5 w-5 animate-spin" /> جاري الدخول...</>
                ) : (
                  "دخول"
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-muted-foreground font-medium">
            ليس لديك حساب؟ <Link href="/privacy-consent" className="text-accent hover:underline font-bold">حساب جديد</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
