import { Link } from "wouter";
import { ArrowLeft, Brain, FileText, Zap, CheckCircle2, ChevronDown, ChevronUp, CreditCard, Copy, Sparkles, Target, Layers, MessageSquare, Eye, BarChart3, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import LandingHero from "@/components/landing-hero/landing-hero";

// ─── INSPIRE AXES ─────────────────────────────────────────
const AXES = [
  {
    letter: "I",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-500",
    arabic: "الهدف",
    english: "Intention",
    desc: "ما الذي يقودك حقاً؟ هل أنت موجّه بالنتائج أم بالعملية؟ هذا المحور يكشف دافعك الداخلي الحقيقي.",
    icon: Target,
  },
  {
    letter: "N",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-500",
    arabic: "الرواية",
    english: "Narrative",
    desc: "كيف تؤطر المعلومات؟ قصص وأمثلة، أم بيانات وحقائق مجردة؟",
    icon: MessageSquare,
  },
  {
    letter: "S",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-500",
    arabic: "الأسلوب",
    english: "Style",
    desc: "منهجي أم عفوي؟ تفضل الهياكل الواضحة أم الحرية في التفكير؟",
    icon: Layers,
  },
  {
    letter: "P",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-500",
    arabic: "التفضيلات",
    english: "Preferences",
    desc: "ما الذي يريحك وما الذي يزعجك في تعاملك مع AI؟ خطوطك الحمراء ومحفزاتك.",
    icon: Eye,
  },
  {
    letter: "I",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-500",
    arabic: "التفاعل",
    english: "Interaction",
    desc: "كيف تتفاعل في الوقت الفعلي؟ تفضل الحوار المتبادل أم الاستجابة المباشرة؟",
    icon: RefreshCw,
  },
  {
    letter: "R",
    color: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    text: "text-indigo-500",
    arabic: "التأمل",
    english: "Reflection",
    desc: "مدى عمق تفكيرك التحليلي. هل تراجع وتستنتج، أم تبحث عن إجابات فورية؟",
    icon: Brain,
  },
  {
    letter: "E",
    color: "from-fuchsia-500 to-purple-500",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/30",
    text: "text-fuchsia-500",
    arabic: "التقييم",
    english: "Evaluation",
    desc: "كيف تقيس النجاح؟ بالمقاييس الكمية أم بالإحساس النوعي والتأثير؟",
    icon: BarChart3,
  },
];

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
    a: "التعليمات المُولَّدة تعمل مع أي أداة AI تدعم مفهوم system prompt أو custom instructions، بما فيها: ChatGPT، Claude، Gemini، وسواها.",
  },
  {
    q: "ما الفرق بين التقييم الكامل والتقييم السريع؟",
    a: "التقييم السريع يُركّز على 5 أبعاد من تفاعلك مع AI ويُولّد نقاط انطلاق فورية في 5 دقائق مجاناً. التقييم الكامل يُحلّل 7 محاور سلوكية بعمق ويُولّد تعليمات نظام شاملة مع تقرير مفصّل.",
  },
];

// ─── BEFORE / AFTER ────────────────────────────────────────
const BEFORE = [
  "تكتب سؤالاً وتأمل في النتيجة",
  "تحصل على إجابات عامة لا تناسبك",
  "تُعيد الصياغة مراراً وتُراً دون وضوح",
  "AI يُقدّم خيارات لا تعكس أسلوبك",
  "وقت ضائع في توضيح ما تريد كل مرة",
];

const AFTER = [
  "AI يعرف أسلوبك قبل أن تبدأ",
  "ردود مصممة لطريقة تفكيرك تحديداً",
  "لا إعادة شرح — فقط نتائج فورية",
  "AI يتحداك ولا يُؤكد أفكارك فقط",
  "توفير ساعات من التكرار كل أسبوع",
];

// ─── SAMPLE INSTRUCTION ────────────────────────────────────
const SAMPLE = `## Universal Rules
Always respond in Arabic unless asked otherwise.
Be concise, practical, and specific.
Challenge my assumptions — don't just validate them.

## My INSPIRE Profile
I (Intention): Focused — Outcome-driven. Always prioritize one clear goal.
N (Narrative): Analyst — Lead with reasoning before conclusions.
S (Style): Structured — Step-by-step when complexity demands it.
P (Preferences): Evidence — Connect all claims to data or examples.
I (Interaction): Direct — No preamble, no filler phrases.
R (Reflection): Deep — I review before I act. Match this depth.
E (Evaluation): Metrics — I measure success in numbers.

## Red Lines — Never Do This
• Don't list more than 3 options at once
• Don't use vague terms like "it depends"
• Don't repeat what I just said back to me

## For [اسم مشروعك]
Goal: [هدفك المحدد]
Depth: Full analysis with actionable steps`;

const PAID_FEATURES = [
  "تقييم شخصي كامل لأي مشروع",
  "جدول نتائج 7 محاور INSPIRE",
  "تعليمات نظام جاهزة للنسخ",
  "تنزيل تقرير PDF احترافي",
  "مشاركة النتائج مع فريقك",
  "نقاط انطلاق فورية مخصصة",
];

const FREE_FEATURES = [
  "تقييم سريع مجاني (5 دقائق)",
  "نقاط انطلاق فورية",
  "مقدمة للمحاور السبعة",
  "بدون بطاقة ائتمان",
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  function copySample() {
    navigator.clipboard.writeText(SAMPLE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="overflow-x-hidden" dir="rtl">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <LandingHero primaryHref="/assess/mini" secondaryAnchorId="how-it-works" />

      {/* ─── PHILOSOPHY (THE PROBLEM) ─────────────────────── */}
      <section className="py-24 px-6 bg-foreground text-background">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">الفلسفة</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-background mb-6">
              لماذا AI لا يعطيك ما تريد؟
            </h2>
            <p className="text-background/60 max-w-2xl mx-auto text-lg leading-relaxed">
              ليس بسبب الأداة. بل لأن الأداة لا تعرف <em>من أنت</em>. كل إنسان لديه نمط سلوكي فريد في التفكير والتعلم والعمل — لكن معظم تعليمات AI مكتوبة كأن الجميع متشابه.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 text-lg font-black">✕</span>
                </div>
                <h3 className="text-xl font-bold text-background/90">بدون INSPIRE</h3>
              </div>
              <ul className="space-y-4">
                {BEFORE.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 text-background/60 text-sm leading-relaxed"
                  >
                    <span className="mt-1 w-5 h-5 rounded-full border border-red-500/40 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-accent/20 to-rose-900/20 border border-accent/30 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-lg font-black">✓</span>
                </div>
                <h3 className="text-xl font-bold text-background/90">مع INSPIRE</h3>
              </div>
              <ul className="space-y-4">
                {AFTER.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 text-background/80 text-sm leading-relaxed"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── THE 7 AXES ───────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">المحاور السبعة</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent to-orange-400" dir="ltr">INSPIRE</span> — سبعة أبعاد تُعرّفك
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">كل حرف يُمثّل بُعداً سلوكياً يُحلّله النظام ليبني ملفك الشخصي الفريد</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {AXES.map((axis, i) => {
              const Icon = axis.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative bg-card border ${axis.border} rounded-2xl p-6 hover:-translate-y-1 transition-all group overflow-hidden`}
                >
                  {/* large letter background */}
                  <div className={`absolute -top-4 -left-2 text-[90px] font-display font-black leading-none opacity-[0.06] ${axis.text} select-none pointer-events-none`} dir="ltr">
                    {axis.letter}
                  </div>

                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${axis.bg} border ${axis.border} mb-4`}>
                    <Icon className={`h-5 w-5 ${axis.text}`} />
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-2xl font-display font-black ${axis.text}`} dir="ltr">{axis.letter}</span>
                    <span className="text-sm font-bold text-foreground">{axis.arabic}</span>
                  </div>
                  <div className="text-xs text-muted-foreground/70 mb-3 italic" dir="ltr">{axis.english}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{axis.desc}</p>
                </motion.div>
              );
            })}

            {/* CTA card (8th) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: AXES.length * 0.08 }}
              className="bg-gradient-to-br from-accent/10 to-rose-500/5 border-2 border-accent/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center sm:col-span-2 lg:col-span-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <p className="font-bold text-foreground mb-2">اكتشف نمطك الكامل</p>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">كيف تبدو درجاتك في كل محور؟ التقييم يجيبك.</p>
              <Link
                href="/assess/mini"
                className="px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                ابدأ التقييم المجاني
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SAMPLE OUTPUT ────────────────────────────────── */}
      <section className="py-24 px-6 bg-secondary/40">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">المخرج الفعلي</span>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">ماذا ستحصل بعد التقييم؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">تعليمات نظام كاملة جاهزة للنسخ مباشرةً إلى أي نموذج AI</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* feature list */}
            <div className="lg:col-span-2 space-y-4">
              {[
                { icon: "📊", title: "جدول نتائج 7 محاور", desc: "درجات دقيقة لكل محور مع تفسير نوعي" },
                { icon: "🧠", title: "تحليل دورك السلوكي", desc: "من أنت في سياق العمل مع AI بالتحديد" },
                { icon: "🚫", title: "خطوطك الحمراء", desc: "ما لا يمكنك تحمله — محدد بدقة" },
                { icon: "⚡", title: "تعليمات نظام شاملة", desc: "500–800 كلمة جاهزة للصق في ChatGPT/Claude" },
                { icon: "🎯", title: "5 نقاط انطلاق فورية", desc: "prompts مخصصة لمشروعك وأسلوبك" },
                { icon: "📄", title: "تقرير PDF قابل للتنزيل", desc: "يمكن مشاركته مع فريقك" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/25 transition-all"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                </motion.div>
              ))}
            </div>

            {/* sample system prompt */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 sticky top-24"
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl" dir="ltr">
                <div className="bg-foreground px-5 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/70" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <span className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-xs text-white/50 mr-2">system_prompt.txt</span>
                  </div>
                  <button
                    onClick={copySample}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/10"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? "تم النسخ ✓" : "نسخ"}
                  </button>
                </div>
                <div className="p-6 bg-foreground/98">
                  <pre className="text-xs text-emerald-400/90 leading-relaxed whitespace-pre-wrap font-mono" dir="ltr">
                    {SAMPLE}
                  </pre>
                </div>
                <div className="bg-foreground/95 px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40" dir="rtl">
                  <span>انسخ هذا مباشرةً → ChatGPT / Claude / Gemini</span>
                  <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full">System Prompt</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">العملية</span>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">ثلاث خطوات بسيطة</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">من التقييم إلى تعليمات AI الشخصية في أقل من 20 دقيقة</p>
          </motion.div>

          <div className="relative">
            {/* connecting line */}
            <div className="hidden md:block absolute top-14 right-[16.67%] left-[16.67%] h-px border-t-2 border-dashed border-border z-0" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { n: "١", color: "from-violet-500 to-purple-600", icon: FileText, title: "أجب على التقييم", desc: "24 سؤالاً سلوكياً + 8 سيناريوهات AI تكشف أنماطك الحقيقية" },
                { n: "٢", color: "from-accent to-rose-600", icon: Brain, title: "حلّل INSPIRE نمطك", desc: "7 محاور تُحلَّل بدقة وتُبنى بصمتك الفريدة في خريطة شاملة" },
                { n: "٣", color: "from-emerald-500 to-teal-600", icon: Sparkles, title: "احصل على تعليماتك", desc: "تعليمات نظام جاهزة + تقرير PDF + نقاط انطلاق لمشروعك" },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="relative text-center z-10"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} mb-5 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-5xl font-display font-black text-foreground/8 mb-2 -mt-2">{step.n}</div>
                    <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ──────────────────────────────────────── */}
      <section className="py-24 px-6 bg-secondary/40">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">الأسعار</span>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">بسيط وشفاف</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">ابدأ مجاناً واترقِّ عندما تكون مستعداً</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border-2 border-border rounded-3xl p-8 flex flex-col"
            >
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground mb-3">
                  <Zap className="h-3.5 w-3.5" />
                  تقييم سريع
                </div>
                <div className="text-5xl font-display font-black text-foreground mb-1">$0</div>
                <div className="text-sm text-muted-foreground">مجاناً للأبد</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {FREE_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/assess/mini"
                className="flex items-center justify-center gap-2 border-2 border-border text-foreground px-6 py-3 rounded-xl font-semibold hover:border-accent/40 hover:text-accent transition-all"
              >
                <Zap className="h-4 w-4" />
                ابدأ مجاناً
              </Link>
            </motion.div>

            {/* Paid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-foreground border-2 border-foreground rounded-3xl p-8 flex flex-col shadow-2xl shadow-foreground/20"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-accent text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg shadow-accent/30 flex items-center gap-1.5 whitespace-nowrap">
                  <CreditCard className="h-3.5 w-3.5" /> ادفع مرة واحدة فقط
                </span>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/60 mb-3">
                  <Brain className="h-3.5 w-3.5" />
                  تقييم كامل
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <div className="text-5xl font-display font-black text-white">$10</div>
                  <div className="text-white/50 text-sm mb-1">/ تقييم</div>
                </div>
                <div className="text-sm text-white/50">دفعة واحدة · بدون اشتراك</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {PAID_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/privacy-consent"
                className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-6 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 text-base"
              >
                ابدأ التقييم الكامل
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">أسئلة شائعة</span>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">أسئلة وأجوبة</h2>
          </motion.div>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-right hover:bg-secondary/40 transition-colors"
                >
                  <span className="font-semibold text-foreground text-sm leading-relaxed">{item.q}</span>
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
                      <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-foreground">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              ابدأ اليوم — لا بطاقة ائتمان مطلوبة
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
              حان وقت أن يفهمك<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent to-rose-400">الذكاء الاصطناعي</span>
            </h2>
            <p className="text-white/50 mb-10 text-lg max-w-xl mx-auto">
              الفارق بين AI متوسط وAI حقيقي لك يبدأ من تعليمات مبنية على من أنت — لا من ما تكتب.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/assess/mini"
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-accent/30 transition-all hover:-translate-y-1 w-full sm:w-auto justify-center"
              >
                <Zap className="h-5 w-5" />
                ابدأ مجاناً — 5 دقائق
              </Link>
              <Link
                href="/privacy-consent"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-6 py-4 rounded-2xl font-semibold text-base transition-all w-full sm:w-auto justify-center"
              >
                التقييم الكامل — $10
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
