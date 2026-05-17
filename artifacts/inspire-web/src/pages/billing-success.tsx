import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function BillingSuccess() {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(!new URLSearchParams(window.location.search).get("payment_id"));
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const paymentId = params.get("payment_id");
  const assessmentId = params.get("assessment_id");

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      if (!paymentId) {
        if (!cancelled) setPaymentConfirmed(true);
        if (!cancelled) setReady(true);
        return;
      }
      try {
        const res = await fetch(`/api/billing/payment-status/${paymentId}`);
        const data = await res.json() as {
          success: boolean;
          payment?: { status: string };
          assessment?: { id: string; status: string } | null;
        };
        if (data.success && data.payment?.status === "completed") {
          if (!cancelled) setPaymentConfirmed(true);
          if (data.assessment?.status === "completed") {
            navigate(`/results/${data.assessment.id}`);
            return;
          }
          if (!cancelled) setReady(true);
          return;
        }
      } catch {
        // Keep polling briefly; Lemon webhooks can arrive moments after redirect.
      }
      if (!cancelled && attempts < 10) window.setTimeout(poll, 1500);
      else if (!cancelled) setReady(true);
    };
    const timer = window.setTimeout(poll, 1000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [assessmentId, navigate, paymentId, queryClient]);

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
            يتم تأكيد الدفع وتجهيز تقريرك الرقمي الآن. سيظهر التقرير ضمن تقاريرك فور اكتمال التوليد.
          </p>

          {!ready ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Loader2 className="h-4 w-4 animate-spin" />
              جارٍ تحديث بياناتك...
            </div>
          ) : paymentConfirmed ? (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 mb-6">
              <CheckCircle2 className="h-4 w-4" />
              دفعتك مؤكدة
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-amber-500 mb-6">
              <Loader2 className="h-4 w-4 animate-spin" />
              ننتظر تأكيد Lemon Squeezy
            </div>
          )}

          <Link
            href={assessmentId ? `/results/${assessmentId}` : "/my-assessments"}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-base hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20"
          >
            {assessmentId ? "فتح التقرير" : "انتقل إلى تقاريري"}
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
