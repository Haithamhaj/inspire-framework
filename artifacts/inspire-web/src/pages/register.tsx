import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@workspace/api-client-react";
import { UserPlus, Mail, Lock, User, Briefcase, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const registerSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب ويجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[a-zA-Z]/, "يجب أن تحتوي على حرف واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل"),
  job_title: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutateAsync: registerUser, isPending } = useRegister();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser({
        data: {
          ...data,
          consent_given: true, // Inherited from previous step
        }
      });
      if (result.success) {
        setSuccess(true);
        toast({
          title: "تم التسجيل بنجاح!",
          description: "جاري تحويلك لصفحة تسجيل الدخول...",
        });
        setTimeout(() => setLocation("/login"), 2500);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "فشل التسجيل",
        description: err.response?.data?.error || "حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى.",
      });
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card p-10 rounded-3xl shadow-2xl text-center max-w-md border border-border"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">تم التسجيل!</h2>
          <p className="text-muted-foreground text-lg">حسابك جاهز. سيتم تحويلك لصفحة الدخول الآن...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 flex justify-center items-center bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-card rounded-3xl shadow-xl shadow-primary/5 border border-border overflow-hidden"
      >
        <div className="p-8 sm:p-12">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-primary/5 rounded-2xl">
              <UserPlus className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">إنشاء حساب جديد</h1>
            <p className="text-muted-foreground">أدخل بياناتك للبدء في تقييم INSPIRE</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  {...register("name")}
                  className="w-full bg-background border-2 border-border rounded-xl py-3 px-12 text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                  placeholder="أحمد محمد"
                />
              </div>
              {errors.name && <p className="text-destructive text-sm mt-1.5 font-medium">{errors.name.message}</p>}
            </div>

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

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">المسمى الوظيفي <span className="text-muted-foreground font-normal text-xs">(اختياري)</span></label>
              <div className="relative">
                <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  {...register("job_title")}
                  className="w-full bg-background border-2 border-border rounded-xl py-3 px-12 text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                  placeholder="مدير مشروع، مطور، الخ..."
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isPending ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> جاري التسجيل...</>
                ) : (
                  "إنشاء الحساب"
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-muted-foreground font-medium">
            لديك حساب بالفعل؟ <Link href="/login" className="text-accent hover:underline font-bold">تسجيل الدخول</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
