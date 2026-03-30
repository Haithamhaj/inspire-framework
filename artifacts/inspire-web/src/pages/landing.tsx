import { Link } from "wouter";
import { ArrowLeft, ArrowDown, Brain, FileText, Zap, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ─── FAQ DATA ─────────────────────────────────────────────
const FAQ = [
  {
    q: "ما هو إطار INSPIRE؟",
    a: "INSPIRE هو نظام تحليل سلوكي من 7 محاور (الهدف، الرواية، الأسلوب، التفضيلات، التفاعل، التأمل، التقييم) صُمِّم خصيصاً لتحسين طريقة تعاملك مع أدوات الذكاء الاصطناعي. بدلاً من استخدام AI بشكل عشوائي، يمنحك INSPIRE تعليمات مخصصة لطبيعتك.",
  },
  {
    q: "كم من الوقت يستغرق التقييم الكامل؟",
    a: "التقييم الكامل يستغرق ما بين 15 و20 دقيقة ويشمل 24 سؤالاً سلوكياً، 8 سيناريوهات تفاعلية، وسؤالاً مفتوحاً. النسخة السريعة تستغرق 5 دقائق فقط وتُولّد نقاط انطلاق فورية.",
  },
  {
    q: "ما الذي يُولّده التقييم بالضبط؟",
    a: "يُولّد التقييم الكامل: جدول نتائج 7 محاور INSPIRE، تحليل دورك المهني، الخطوط الحمراء في التعامل مع AI، نقاط قوتك السلوكية، مجالات التطوير، توصيات عملية، تعليمات نظام شاملة يمكن نسخها إلى ChatGPT أو Claude، ونقاط انطلاق جاهزة.",
  },
  {
    q: "هل يمكنني إجراء أكثر من تقييم واحد؟",
    a: "نعم. يمكنك إنشاء تقييمات متعددة لمشاريع مختلفة ومقارنة نتائجها. كل تقييم يُنتج تعليمات مخصصة للمشروع المحدد.",
  },
  {
    q: "مع أي أدوات AI تعمل التعليمات المُولَّدة؟",
    a: "التعليمات المُولَّدة تعمل مع أي أداة AI تدعم مفهوم system prompt أو custom instructions، بما فيها: ChatGPT (My GPT / System prompt)، Claude (Custom instructions)، Gemini، وسواها.",
  },
  {
    q: "هل بياناتي آمنة وخاصة؟",
    a: "نعم. بياناتك محمية ومشفرة ولا تُشارَك مع أي جهة خارجية. إجاباتك تُستخدم فقط لتوليد تقريرك الشخصي ولا تُستخدم في تدريب النماذج.",
  },
  {
    q: "ما الفرق بين التقييم الكامل والتقييم السريع؟",
    a: "التقييم السريع يُركّز على 5 أبعاد من تفاعلك مع AI ويُولّد نقاط انطلاق فورية في 5 دقائق. التقييم الكامل يُحلّل 7 محاور سلوكية بعمق ويُولّد تعليمات نظام شاملة مع تقرير مفصّل يمكن تنزيله.",
  },
];

// ─── STEPS DATA ────────────────────────────────────────────
const STEPS = [
  {
    number: "١",
    icon: ClipboardList,
    title: "أجب على التقييم",
    desc: "24 سؤالاً سلوكياً + 8 سيناريوهات AI تفاعلية تكشف أنماطك الحقيقية في التعامل مع الذكاء الاصطناعي",
  },
  {
    number: "٢",
    icon: Brain,
    title: "حلّل INSPIRE نمطك",
    desc: "يُحلّل النظام إجاباتك عبر 7 محاور سلوكية ويضع بصمتك الفريدة في خريطة دقيقة",
  },
  {
    number: "٣",
    icon: FileText,
    title: "احصل على تعليماتك",
    desc: "تعليمات نظام جاهزة للنسخ + تقرير PDF شامل + نقاط انطلاق فورية مخصصة لمشروعك",
  },
];

// ─── SAMPLE SYSTEM INSTRUCTION ─────────────────────────────
const SAMPLE_INSTRUCTION = `أنت مساعد ذكاء اصطناعي شخصي لـ [الاسم]، محلل استراتيجي يعمل في مجال تطوير المنتجات.

📊 ملف INSPIRE السلوكي:
• الهدف (I): 4/4 — موجّه بالنتائج بشكل كامل
• الأسلوب (S): 3/4 — منهجي مع قابلية للتكيف
• التفاعل (I): 2/4 — يفضل الاستقلالية في العمل
• التأمل (R): 4/4 — يراجع ويحلل بعمق

🎯 كيف تتعامل معه:
- قدّم الحل أولاً ثم التفاصيل إذا طُلبت
- تحدى أفكاره ولا تُؤكدها فقط
- استخدم أرقاماً وبيانات في كل توصية
- لا تُقدّم خيارات أكثر من ثلاثة في آن واحد`;

function ClipboardList({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 container max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border text-sm font-medium text-primary mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            نظام التحليل السلوكي للذكاء الاصطناعي
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-primary mb-6 leading-[1.2]">
            اجعل الذكاء الاصطناعي يفهمك<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">لا العكس</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            <span className="font-semibold text-primary" dir="ltr">INSPIRE</span> يحلل نمطك السلوكي عبر 7 محاور ويولّد تعليمات مخصصة تجعل AI مساعداً حقيقياً لك
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
              href="/assess/mini"
              className="flex items-center gap-2 bg-card border-2 border-border hover:border-accent/40 text-foreground px-6 py-3.5 rounded-xl font-medium text-base shadow-sm transition-all hover:-translate-y-1 w-full sm:w-auto justify-center"
            >
              <Zap className="h-4 w-4 text-accent" />
              النسخة السريعة — 5 دقائق فقط
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/60 animate-bounce"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">العملية</span>
            <h2 className="text-4xl font-display font-bold text-primary mb-4">كيف يعمل INSPIRE؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">ثلاث خطوات بسيطة من التقييم إلى تعليمات AI الشخصية</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-card border border-border rounded-2xl p-8 shadow-sm text-center group hover:border-accent/30 transition-all hover:-translate-y-1"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -left-4 w-8 border-t border-dashed border-border z-10" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 mb-5">
                  <step.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="text-4xl font-display font-black text-accent/20 mb-3">{step.number}</div>
                <h3 className="text-lg font-bold text-primary mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT YOU GET ─────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">المخرجات</span>
            <h2 className="text-4xl font-display font-bold text-primary mb-4">ماذا ستحصل؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">تقريرك يتضمن تعليمات نظام جاهزة للنسخ مباشرةً إلى أي أداة AI</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                { icon: "📊", title: "جدول نتائج 7 محاور INSPIRE", desc: "درجات دقيقة لكل محور مع ملاحظات تحليلية" },
                { icon: "🧠", title: "تحليل دورك السلوكي", desc: "من أنت في سياق العمل مع AI وكيف تعمل بشكل طبيعي" },
                { icon: "🚫", title: "خطوطك الحمراء", desc: "ما لا يمكنك تحمله في تفاعلات AI — محدد بدقة" },
                { icon: "⚡", title: "تعليمات نظام شاملة", desc: "500–800 كلمة جاهزة للصق في ChatGPT أو Claude" },
                { icon: "🎯", title: "نقاط انطلاق فورية", desc: "5 prompts جاهزة مخصصة لمشروعك وأسلوبك" },
                { icon: "📄", title: "تقرير PDF قابل للتنزيل", desc: "تقرير احترافي يمكن مشاركته مع فريقك" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-primary text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-auto" />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-24"
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-secondary/60 px-5 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">مثال: تعليمات النظام</span>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-accent/10 text-accent border border-accent/20">System Prompt</span>
                </div>
                <div className="p-6">
                  <pre className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans" dir="rtl">
                    {SAMPLE_INSTRUCTION}
                  </pre>
                </div>
                <div className="bg-secondary/30 px-5 py-3 border-t border-border text-center">
                  <span className="text-xs text-muted-foreground">انسخ هذا مباشرة → ChatGPT / Claude</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">الأسئلة الشائعة</span>
            <h2 className="text-4xl font-display font-bold text-primary mb-4">أسئلة وأجوبة</h2>
          </motion.div>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-right hover:bg-secondary/30 transition-colors"
                >
                  <span className="font-semibold text-primary text-sm">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0 mr-3" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 mr-3" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA STRIP ────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-12 shadow-2xl shadow-primary/20"
          >
            <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">ابدأ رحلتك مع AI المخصص</h2>
            <p className="text-primary-foreground/70 mb-8">مجاناً تماماً — لا بطاقة ائتمان مطلوبة</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/privacy-consent"
                className="flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl w-full sm:w-auto justify-center"
              >
                التقييم الكامل — 20 دقيقة
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Link
                href="/assess/mini"
                className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-medium px-6 py-4 rounded-xl transition-all hover:bg-white/20 w-full sm:w-auto justify-center"
              >
                <Zap className="h-4 w-4" />
                النسخة السريعة — 5 دقائق
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <div className="font-display font-black text-xl text-primary tracking-tight" dir="ltr">
                INSPIRE
              </div>
              <div className="text-xs text-muted-foreground mt-1">نظام التحليل السلوكي للذكاء الاصطناعي</div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy-consent" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
              <Link href="/login" className="hover:text-primary transition-colors">تسجيل الدخول</Link>
              <Link href="/register" className="hover:text-primary transition-colors">إنشاء حساب</Link>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} INSPIRE Framework. جميع الحقوق محفوظة.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
