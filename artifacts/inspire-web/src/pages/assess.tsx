import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { FileQuestion, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Assess() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 flex justify-center bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-12 text-center">
          <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3">
            <FileQuestion className="h-12 w-12 text-accent -rotate-3" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            مرحباً {user.name}، تقييمك جاهز للبدء
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            ستبدأ الآن رحلة استكشاف نمطك السلوكي والتفاعلي عبر إطار إلهام.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12 flex items-start gap-4 text-right">
            <AlertCircle className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-1">ملاحظة هامة</h3>
              <p className="text-blue-800 leading-relaxed">
                هذه الصفحة هي مجرد واجهة مؤقتة (Placeholder) تمهيداً للمرحلة القادمة من التطوير حيث سيتم بناء محرك التقييم وتوليد التقارير.
              </p>
            </div>
          </div>

          <button className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 opacity-50 cursor-not-allowed">
            بدء التقييم (قريباً)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
