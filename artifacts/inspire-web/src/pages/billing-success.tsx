import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";

export default function BillingSuccess() {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    // Refresh user data so the new "pro" plan is reflected immediately
    const timer = setTimeout(async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setRefreshed(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [queryClient]);

  const isPro = user?.plan === "pro";

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            🎉 مرحباً بك في Pro!
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            تمت عملية الدفع بنجاح. حسابك تم ترقيته إلى خطة Pro ويمكنك الآن الاستمتاع بجميع الميزات الاحترافية.
          </p>

          {/* Features unlocked */}
          <div className="bg-card border border-green-200 rounded-2xl p-6 mb-8 text-right">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="font-bold text-foreground">ما يمكنك فعله الآن</span>
            </div>
            <ul className="space-y-3">
              {[
                "تقييمات غير محدودة لجميع مشاريعك",
                "تنزيل تقرير PDF احترافي لكل تقييم",
                "مشاركة نتائجك مع فريقك عبر رابط عام",
                "مقارنة نتائج التقييمات المختلفة",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Status indicator */}
          {isLoading || (!refreshed && !isPro) ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Loader2 className="h-4 w-4 animate-spin" />
              جارٍ تفعيل حسابك...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 mb-6">
              <CheckCircle2 className="h-4 w-4" />
              حسابك مفعّل على خطة Pro
            </div>
          )}

          <Link
            href="/my-assessments"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-base hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20"
          >
            انتقل إلى تقاريري
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
