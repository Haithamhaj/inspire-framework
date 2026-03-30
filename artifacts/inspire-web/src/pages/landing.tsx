import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Abstract background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 container max-w-4xl mx-auto px-6 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border text-sm font-medium text-primary mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
          النظام قيد التطوير - Coming Soon
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-primary mb-6 leading-[1.2]">
          اجعل الذكاء الاصطناعي يفهمك<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">لا العكس</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          <span className="font-semibold text-primary" dir="ltr">INSPIRE</span> يحلل نمطك السلوكي ويولّد تعليمات مخصصة تجعل AI مساعداً حقيقياً لك
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/privacy-consent"
            className="flex items-center gap-2 bg-gradient-to-l from-primary to-primary/80 hover:from-primary hover:to-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 w-full sm:w-auto justify-center"
          >
            ابدأ التقييم المجاني
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 bg-card border-2 border-border hover:border-primary/30 text-foreground px-6 py-3.5 rounded-xl font-medium text-base shadow-sm transition-all hover:-translate-y-1 w-full sm:w-auto justify-center"
          >
            النسخة السريعة — 5 دقائق
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
