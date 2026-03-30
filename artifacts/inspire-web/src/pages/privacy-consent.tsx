import { useState } from "react";
import { useLocation } from "wouter";
import { Check, Shield, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyConsent() {
  const [, setLocation] = useLocation();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (agreed) {
      // In a real app we might store consent in local storage or context before passing to register
      setLocation("/register");
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 flex justify-center bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-card rounded-3xl shadow-xl shadow-primary/5 border border-border overflow-hidden flex flex-col"
      >
        <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold">سياسة الخصوصية والموافقة</h1>
          </div>
          <p className="relative z-10 text-primary-foreground/80 text-lg mt-2 ms-16">
            يرجى قراءة سياسة استخدام البيانات قبل البدء
          </p>
        </div>

        <div className="p-8 flex-1 flex flex-col">
          <div className="prose prose-slate prose-lg max-w-none text-muted-foreground leading-relaxed mb-8 flex-1">
            <p>
              نحن في إلهام (INSPIRE) نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية والمهنية. تم تصميم هذا التقييم لمساعدتك في فهم نمطك السلوكي والتفاعلي.
            </p>
            <h3 className="text-foreground font-bold flex items-center gap-2 mt-6 mb-4">
              <FileText className="h-5 w-5 text-accent" />
              كيف نستخدم بياناتك؟
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                <span><strong className="text-foreground">تحليل النمط:</strong> يتم استخدام إجاباتك لإنشاء تقرير دقيق يعكس أسلوبك في العمل والتواصل.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                <span><strong className="text-foreground">السرية التامة:</strong> جميع بياناتك مشفرة ولا يتم مشاركتها مع أطراف ثالثة دون موافقتك الصريحة.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                <span><strong className="text-foreground">تحسين الخدمة:</strong> قد نستخدم البيانات المجمعة (بدون الكشف عن الهوية) لتحسين خوارزميات التقييم لدينا.</span>
              </li>
            </ul>
          </div>

          <div className="bg-secondary/50 rounded-2xl p-6 border border-border mb-8">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-1">
                <input 
                  type="checkbox" 
                  className="peer sr-only"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <div className="w-6 h-6 rounded-md border-2 border-primary/30 peer-checked:border-accent peer-checked:bg-accent transition-all flex items-center justify-center group-hover:border-accent/60">
                  <Check className="h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground text-lg select-none group-hover:text-primary transition-colors">
                  أوافق على استخدام بياناتي 
                </span>
                <span className="text-muted-foreground text-sm select-none" dir="ltr">
                  I agree to the terms and the use of my data
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!agreed}
              className={`
                px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center gap-2
                ${agreed 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 hover:shadow-primary/20 cursor-pointer" 
                  : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                }
              `}
            >
              المتابعة للتسجيل
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
