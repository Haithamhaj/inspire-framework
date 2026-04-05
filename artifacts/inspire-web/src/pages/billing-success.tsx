import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function BillingSuccess() {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [queryClient]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center"
      >
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
            تم الدفع بنجاح!
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            تم تأكيد دفعتك. يمكنك الآن الانتقال إلى تقاريرك.
          </p>

          {!ready ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Loader2 className="h-4 w-4 animate-spin" />
              جارٍ تحديث بياناتك...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 mb-6">
              <CheckCircle2 className="h-4 w-4" />
              دفعتك مؤكدة
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
