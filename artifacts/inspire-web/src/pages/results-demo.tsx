import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Copy,
  Check,
  Compass,
  ShieldAlert,
  Brain,
  Layers,
  Target,
  ListChecks,
  Scale,
  GitBranch,
  Repeat,
  ArrowLeft,
  Eye,
  Lightbulb,
  Workflow,
  MessageSquare,
  BookOpen,
  Settings2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — Project Management AI Operating Profile
// ─────────────────────────────────────────────────────────────────────────────

const PROJECT_NAME = "إدارة المشاريع";

const IDENTITY_PARAGRAPH =
  "مساعد استراتيجي لإدارة المشاريع يساعدك على تحويل الأفكار إلى خطط، كشف المخاطر، ترتيب الأولويات، وتلخيص القرارات. يعمل بحس الشريك المنفّذ لا المراقب، ويحافظ على وضوح الهدف في كل خطوة بدل الانجراف نحو إجابات عامة.";

// Signal chips that "converge" into the identity card on first load
const SIGNAL_CHIPS = [
  "هدف واضح",
  "أولويات",
  "قرار سريع",
  "خطة مرحلية",
  "كشف مخاطر",
  "سياق المشروع",
  "تلخيص نقاش",
  "مخرجات قابلة للتنفيذ",
  "اتساق في الأسلوب",
  "تحديد القيود",
];

const BENEFITS = [
  {
    icon: Target,
    title: "يربط الردود بهدفك وسياقك",
    desc: "بدل الإجابات النظرية، يفهم أنك تشتغل على مشروع له قيود وأولويات.",
    accent: "rose",
  },
  {
    icon: Layers,
    title: "يقلل الإجابات العامة",
    desc: "يستبدل الكلام الفضفاض بخطوات محددة قابلة للتطبيق على مهمتك الحالية.",
    accent: "violet",
  },
  {
    icon: Workflow,
    title: "يفعّل الدور المناسب حسب المهمة",
    desc: "يتحول بين شريك تخطيط، مراجع مخاطر، ومنظم تنفيذي حسب طلبك.",
    accent: "teal",
  },
  {
    icon: ShieldAlert,
    title: "يوضح المخاطر والخطوات التالية",
    desc: "يخبرك ما الذي قد يفشل وما الخطوة الأذكى التي تليها.",
    accent: "amber",
  },
  {
    icon: Repeat,
    title: "يجعل المخرجات أكثر اتساقًا",
    desc: "نفس الجودة ونفس الأسلوب عبر كل المحادثات والجلسات.",
    accent: "indigo",
  },
];

const ROLES = [
  {
    icon: Compass,
    name: "Strategic Partner",
    nameAr: "شريك استراتيجي",
    trigger: "عند التخطيط واتخاذ القرارات الكبرى",
    accent: "rose",
  },
  {
    icon: ShieldAlert,
    name: "Risk Reviewer",
    nameAr: "مراجع مخاطر",
    trigger: "عند مراجعة خطة أو فكرة قبل التنفيذ",
    accent: "amber",
  },
  {
    icon: ListChecks,
    name: "Organizer",
    nameAr: "منظِّم",
    trigger: "عند ترتيب المهام والمعلومات والوثائق",
    accent: "violet",
  },
  {
    icon: Scale,
    name: "Decision Support",
    nameAr: "داعم قرار",
    trigger: "عند المقارنة بين خيارات أو مسارات",
    accent: "teal",
  },
  {
    icon: GitBranch,
    name: "Execution Coach",
    nameAr: "موجّه تنفيذ",
    trigger: "عند تحويل الخطة إلى خطوات يومية",
    accent: "indigo",
  },
];

const MODES = [
  {
    name: "Step-Back",
    nameAr: "تراجع وتأطير",
    tip: "يبتعد خطوة عن التفاصيل ليعيد تأطير السؤال قبل الإجابة.",
  },
  {
    name: "Devil's Advocate",
    nameAr: "محامي الشيطان",
    tip: "يختبر فكرتك بنقاط ضعفها قبل أن يدعمها.",
  },
  {
    name: "Self-Check",
    nameAr: "فحص ذاتي",
    tip: "يراجع جوابه بنفسه قبل أن يقدّمه لك.",
  },
  {
    name: "Scenario Comparison",
    nameAr: "مقارنة سيناريوهات",
    tip: "يطرح مسارين أو ثلاثة ويوازن بينها بدل اقتراح واحد.",
  },
  {
    name: "Verification Check",
    nameAr: "تحقق من الدقة",
    tip: "يفصل بين ما هو حقيقة، استنتاج، أو توصية.",
  },
];

const RED_LINES = [
  "لا يعطي إجابات عامة بدون ربطها بسياق المشروع.",
  "لا يقفز للحلول قبل توضيح الهدف والقيود.",
  "لا يمدح الفكرة دون اختبار مخاطرها.",
  "لا يطيل عندما يكون المطلوب قرارًا سريعًا.",
];

const PROFILE_SECTIONS: { id: string; title: string; icon: React.ElementType; body: string }[] = [
  {
    id: "identity",
    title: "هوية المساعد",
    icon: Sparkles,
    body: `أنت مساعد استراتيجي مخصص لدعم مشاريع إدارة المشاريع. دورك الافتراضي: شريك تخطيط ومراجع قرارات يحوّل الأفكار إلى خطط واضحة. لست مساعدًا عامًا، بل تعمل دائمًا في سياق مشروع له هدف وقيود وأولويات.`,
  },
  {
    id: "mission",
    title: "المهمة والسياق",
    icon: Compass,
    body: `هدفك الأساسي: مساعدة المستخدم على إدارة مشاريعه بطريقة أوضح وأقل عشوائية. فكر دائمًا كأنك جزء من فريق المشروع: تعرف الهدف، تعرف الجمهور، وتعرف ما الذي يعتبر "مكتملًا".`,
  },
  {
    id: "relationship",
    title: "طريقة العمل معك",
    icon: MessageSquare,
    body: `تعامل بأسلوب مباشر وعملي. اطرح سؤالاً توضيحيًا واحدًا فقط عند الضرورة، ثم تابع بأفضل افتراض ممكن. ابدأ دائمًا بالنتيجة أو الخطوة المقترحة قبل الشرح.`,
  },
  {
    id: "roles",
    title: "الأدوار الديناميكية",
    icon: Workflow,
    body: `فعّل الدور المناسب حسب طلب المستخدم:
• شريك استراتيجي عند التخطيط واتخاذ القرارات.
• مراجع مخاطر عند تقييم خطة أو فكرة.
• منظِّم عند ترتيب المهام والمعلومات.
• داعم قرار عند المقارنة بين خيارات.
• موجّه تنفيذ عند تحويل الخطة إلى خطوات.`,
  },
  {
    id: "thinking",
    title: "قواعد التفكير والجودة",
    icon: Brain,
    body: `استخدم: تراجع وتأطير عند الغموض، محامي الشيطان عند تقييم فكرة، فحص ذاتي قبل تسليم الإجابة، مقارنة سيناريوهات قبل التوصية بمسار، وتحقق من الدقة عند ذكر أرقام أو حقائق. لا تكشف سلسلة تفكيرك الكاملة، اكتفِ بملخص منطق مفيد.`,
  },
  {
    id: "output",
    title: "قواعد المخرجات",
    icon: ListChecks,
    body: `ابدأ بالنتيجة. استخدم قوائم قصيرة ومحددة بدل فقرات طويلة. عند تقديم خيارات، قدم 2–3 خيارات مع مقارنة سريعة. أنهِ كل إجابة بـ"الخطوة التالية المقترحة".`,
  },
  {
    id: "redlines",
    title: "الخطوط الحمراء",
    icon: ShieldAlert,
    body: `لا تقدم إجابات عامة بلا ربط بسياق المشروع. لا تقفز للحلول قبل فهم الهدف والقيود. لا تمدح الفكرة دون اختبارها. لا تطيل عندما يكون المطلوب قرارًا سريعًا.`,
  },
  {
    id: "adapt",
    title: "طريقة التكيّف معك",
    icon: Repeat,
    body: `تعلّم من تصحيحاتي. إذا قلت "أقصر" أو "أعمق" أو "غيّر الزاوية"، طبّق ذلك على بقية الجلسة. حافظ على نبرتي وأسلوبي عبر الردود. عند تحول السياق، اسأل بسرعة قبل أن تكمل بافتراض قديم.`,
  },
];

const PLATFORMS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    accent: "from-emerald-500/30 to-teal-500/20",
    steps: [
      "افتح ChatGPT واستخدم الملف داخل تعليمات Custom GPT، أو الصقه في تعليمات المشاريع مثل Claude Projects.",
      "الصق ملف التشغيل في خانة \"كيف تريد أن يردّ عليك ChatGPT؟\".",
      "احفظ الإعدادات. ستجد المساعد يعمل بشخصيتك المخصصة في كل محادثة جديدة.",
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    accent: "from-sky-500/30 to-indigo-500/20",
    steps: [
      "افتح Gemini واختر \"Gems\" لإنشاء مساعد جديد.",
      "الصق ملف التشغيل في حقل تعليمات الـ Gem واحفظه باسم \"مساعد إدارة المشاريع\".",
      "افتح الـ Gem في كل مرة تحتاج فيها هذا الدور تحديدًا.",
    ],
  },
  {
    id: "claude",
    name: "Claude",
    accent: "from-rose-500/30 to-orange-500/20",
    steps: [
      "في Claude، أنشئ Project جديدًا وسمّه \"إدارة المشاريع\".",
      "الصق ملف التشغيل في خانة Custom Instructions الخاصة بالمشروع.",
      "ابدأ كل محادثة من هذا المشروع لتحصل على نفس السلوك المتسق.",
    ],
  },
];

const STARTERS = [
  "استخدم ملف التشغيل هذا، ثم ساعدني على تحويل هذه الفكرة إلى خطة تنفيذ من 5 خطوات.",
  "بصفتك مراجع المخاطر، اقرأ الخطة التالية واستخرج أكبر 3 مخاطر مع طريقة تخفيفها.",
  "قارن بين هذين المسارين لإطلاق المشروع، واقترح المسار الأنسب لي مع تبرير قصير.",
  "لخّص نقاش الفريق التالي إلى: قرار، مهام، مالكين، مواعيد. ابدأ بالنتيجة قبل التفاصيل.",
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER UTILS
// ─────────────────────────────────────────────────────────────────────────────

function buildFullProfileText() {
  const parts = PROFILE_SECTIONS.map(
    (s) => `## ${s.title}\n\n${s.body}`,
  ).join("\n\n");
  return `# ملف تشغيل مساعدك — ${PROJECT_NAME}\n\n${parts}\n`;
}

const ACCENT_MAP: Record<string, { ring: string; bg: string; text: string; glow: string }> = {
  rose: {
    ring: "ring-rose-400/30",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    glow: "shadow-rose-500/20",
  },
  violet: {
    ring: "ring-violet-400/30",
    bg: "bg-violet-500/10",
    text: "text-violet-300",
    glow: "shadow-violet-500/20",
  },
  teal: {
    ring: "ring-teal-400/30",
    bg: "bg-teal-500/10",
    text: "text-teal-300",
    glow: "shadow-teal-500/20",
  },
  amber: {
    ring: "ring-amber-400/30",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    glow: "shadow-amber-500/20",
  },
  indigo: {
    ring: "ring-indigo-400/30",
    bg: "bg-indigo-500/10",
    text: "text-indigo-300",
    glow: "shadow-indigo-500/20",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COPY BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function CopyButton({
  text,
  label = "نسخ",
  successLabel = "تم النسخ",
  variant = "ghost",
  size = "sm",
  fullWidth = false,
}: {
  text: string;
  label?: string;
  successLabel?: string;
  variant?: "ghost" | "primary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  function onClick() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.97]";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3.5 text-base",
  } as const;
  const variants = {
    ghost: "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10",
    primary:
      "bg-gradient-to-l from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40",
    outline:
      "bg-transparent border border-white/20 hover:bg-white/5 text-white/90",
  } as const;

  return (
    <button
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="ok"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {successLabel}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL CONVERGENCE — opening motion narrative
// ─────────────────────────────────────────────────────────────────────────────

function SignalConvergence({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  // Distribute chips around the identity card position (above + sides)
  const chipPositions = [
    { x: -260, y: -120 },
    { x: 240, y: -110 },
    { x: -310, y: 30 },
    { x: 290, y: 40 },
    { x: -180, y: 140 },
    { x: 200, y: 150 },
    { x: -100, y: -180 },
    { x: 130, y: -190 },
    { x: 0, y: -220 },
    { x: 0, y: 200 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {active &&
          SIGNAL_CHIPS.map((chip, i) => {
            const pos = chipPositions[i] ?? { x: 0, y: 0 };
            return (
              <motion.div
                key={chip}
                initial={{
                  opacity: 0,
                  x: pos.x,
                  y: pos.y,
                  scale: 0.6,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [pos.x, pos.x, 0, 0],
                  y: [pos.y, pos.y, 0, 0],
                  scale: [0.6, 1, 0.9, 0.4],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.8,
                  delay: 0.15 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                  times: [0, 0.25, 0.75, 1],
                }}
                className="absolute"
              >
                <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-white/85 font-medium whitespace-nowrap">
                  {chip}
                </span>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ResultsDemo() {
  const [signalsActive, setSignalsActive] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Stop the convergence animation after it completes so it doesn't loop
    const t = setTimeout(() => setSignalsActive(false), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Honor URL hash on mount (Wouter doesn't auto-scroll). Re-attempt a few
    // times because framer-motion's initial opacity:0 + delayed reveal can
    // shift layout after first paint.
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    let attempts = 0;
    const tick = () => {
      const el = document.getElementById(hash);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top: y, behavior: "auto" });
      }
      attempts++;
      if (attempts < 12) setTimeout(tick, 200);
    };
    tick();
  }, []);

  const fullProfileText = buildFullProfileText();

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden bg-[#0b0d1f] text-white"
    >
      {/* ── AMBIENT BACKGROUND ──────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0d1f] via-[#0e1130] to-[#0a0c1c]" />
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-rose-500/10 blur-[160px]" />
        <div className="absolute top-[40%] -left-40 w-[700px] h-[700px] rounded-full bg-violet-500/10 blur-[160px]" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-teal-500/8 blur-[140px]" />
        {/* subtle grain */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 md:py-16 space-y-10 md:space-y-14">
        {/* ── 1. RESULTS UNLOCK HEADER ─────────────────────────────────── */}
        <section className="relative">
          <SignalConvergence active={signalsActive} />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 text-[11px] font-medium tracking-widest uppercase text-white/70 mb-6"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              ملف تشغيل مساعدك جاهز
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black text-3xl sm:text-4xl md:text-5xl leading-[1.25] mb-4"
            >
              تم بناء ملف تشغيل مساعدك{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-l from-rose-300 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  لإدارة المشاريع
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 1 }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-l from-rose-400/80 to-orange-300/80 rounded-full"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8"
            >
              استخدمه مع ChatGPT أو Gemini أو Claude ليعمل AI معك بطريقة أوضح
              وأكثر اتساقًا.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <CopyButton
                text={fullProfileText}
                label="نسخ تعليمات المساعد"
                successLabel="تم نسخ كامل التعليمات"
                variant="primary"
                size="lg"
              />
              <a
                href="#how-to-use"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 text-base font-semibold transition-all active:scale-[0.98]"
              >
                كيف أستخدمه؟
                <ArrowLeft className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* ── 2. ASSISTANT IDENTITY (PREMIUM CARD — money shot) ──────── */}
        <motion.section
          id="identity"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: reduce ? 0 : 1.0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* rotating edge glow */}
          <div className="absolute -inset-px rounded-[2rem] overflow-hidden pointer-events-none">
            <motion.div
              animate={reduce ? {} : { rotate: 360 }}
              transition={{ duration: 14, ease: "linear", repeat: Infinity }}
              className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(244,114,182,0.35)_15%,transparent_30%,transparent_70%,rgba(139,92,246,0.30)_85%,transparent_100%)]"
            />
          </div>

          <div className="relative rounded-[2rem] bg-gradient-to-b from-[#13163a]/95 to-[#0d1030]/95 border border-white/10 backdrop-blur-xl p-8 md:p-10 overflow-hidden">
            {/* inner sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full bg-gradient-to-b from-rose-500/15 to-transparent blur-3xl pointer-events-none" />

            <div className="relative flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/30 to-orange-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10">
                <Sparkles className="h-5 w-5 text-rose-200" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/50 mb-1 font-semibold">
                  هوية مساعدك
                </p>
                <h2 className="font-display font-bold text-xl md:text-2xl text-white">
                  مساعدك الشخصي · {PROJECT_NAME}
                </h2>
              </div>
            </div>

            <p className="relative text-white/85 text-lg leading-[1.9] font-medium mb-6">
              {IDENTITY_PARAGRAPH}
            </p>

            <div className="relative flex flex-wrap gap-2">
              {[
                "شريك تنفيذ",
                "مراجع قرارات",
                "حسّاس للسياق",
                "موجّه نحو النتيجة",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/8 border border-white/15 text-xs text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── 3. WHAT THIS PROFILE CHANGES ───────────────────────────── */}
        <motion.section
          id="benefits"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow="ما الذي يتغيّر"
            title="كيف سيختلف تعاملك مع AI من الآن"
            subtitle="هذه ليست وعودًا عامة — هذه تأثيرات مباشرة لملف التشغيل المخصص لمشروعك."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              const a = ACCENT_MAP[b.accent];
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduce ? {} : { y: -3 }}
                  className="group relative rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 p-5 hover:border-white/20 transition-colors overflow-hidden"
                >
                  <div
                    className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${a.bg} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`}
                  />
                  <div
                    className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl ${a.bg} border border-white/10 mb-4`}
                  >
                    <Icon className={`h-5 w-5 ${a.text}`} />
                  </div>
                  <h3 className="relative font-bold text-white text-base mb-1.5 leading-snug">
                    {b.title}
                  </h3>
                  <p className="relative text-sm text-white/65 leading-relaxed">
                    {b.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 4. DYNAMIC ROLES ───────────────────────────────────────── */}
        <motion.section
          id="roles"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow="الأدوار الديناميكية"
            title="مساعدك يتحوّل حسب طلبك"
            subtitle="لا يستخدم كل الأدوار دفعة واحدة — يفعّل الدور المناسب لكل مهمة."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {ROLES.map((r, i) => {
              const Icon = r.icon;
              const a = ACCENT_MAP[r.accent];
              return (
                <motion.div
                  key={r.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  whileHover={reduce ? {} : { y: -3 }}
                  className={`group relative rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/10 p-5 hover:border-white/25 hover:shadow-xl ${a.glow} transition-all overflow-hidden`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${a.bg} border border-white/10 ring-1 ring-inset ${a.ring}`}
                    >
                      <Icon className={`h-5 w-5 ${a.text}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm leading-tight">
                        {r.nameAr}
                      </p>
                      <p className="text-[11px] text-white/45 font-mono" dir="ltr">
                        {r.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-3 border-t border-white/10">
                    <Lightbulb className="h-3.5 w-3.5 text-white/40 mt-0.5 shrink-0" />
                    <p className="text-xs text-white/65 leading-relaxed">
                      <span className="text-white/40">يُفعَّل:</span> {r.trigger}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 5. THINKING & QUALITY MODES ─────────────────────────────── */}
        <motion.section
          id="modes"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow="قواعد التفكير"
            title="أوضاع جودة يستخدمها مساعدك"
            subtitle="مرّر فوق أي وضع لمعرفة متى يستخدمه."
          />

          <div className="mt-8 rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-md">
            <div className="flex flex-wrap gap-2.5">
              {MODES.map((m, i) => (
                <Tooltip key={m.name}>
                  <TooltipTrigger asChild>
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      whileHover={reduce ? {} : { scale: 1.04, y: -1 }}
                      className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-b from-violet-500/15 to-violet-500/5 border border-violet-300/20 hover:border-violet-300/50 hover:shadow-lg hover:shadow-violet-500/20 transition-all"
                    >
                      <Brain className="h-3.5 w-3.5 text-violet-300/80 group-hover:text-violet-200 transition-colors" />
                      <span className="text-sm font-semibold text-white/90">
                        {m.nameAr}
                      </span>
                      <span className="text-[11px] text-white/40 font-mono" dir="ltr">
                        {m.name}
                      </span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-right" dir="rtl">
                    <p className="text-sm leading-relaxed">{m.tip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── 6. RED LINES ───────────────────────────────────────────── */}
        <motion.section
          id="redlines"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-rose-400/25">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/12 via-rose-500/4 to-transparent" />
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

            <div className="relative p-7 md:p-8">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-5 w-5 text-rose-300" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-rose-300/70 mb-1 font-semibold">
                    الخطوط الحمراء
                  </p>
                  <h2 className="font-display font-bold text-xl md:text-2xl text-white">
                    ما يجب أن يتجنبه مساعدك
                  </h2>
                </div>
              </div>

              <ul className="space-y-2.5">
                {RED_LINES.map((line, i) => (
                  <motion.li
                    key={line}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/8 hover:border-rose-300/30 transition-colors"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0 ring-4 ring-rose-400/20" />
                    <span className="text-white/85 text-[15px] leading-relaxed">
                      {line}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* ── 7. COPY-READY OPERATING PROFILE ────────────────────────── */}
        <motion.section
          id="profile"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow="ملف التشغيل"
            title="تعليمات مساعدك الجاهزة"
            subtitle="ملف تشغيل مكتوب بأسلوب طبيعي، جاهز لتلصقه في ChatGPT أو Gemini أو Claude."
          />

          <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02]">
            {/* Friendly header (NOT a code/terminal aesthetic) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/25 to-orange-500/15 border border-white/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-rose-200" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    ملف تشغيل مساعدك
                  </p>
                  <p className="text-xs text-white/55">
                    انسخ التعليمات إلى ChatGPT / Gemini / Claude
                  </p>
                </div>
              </div>
              <CopyButton
                text={fullProfileText}
                label="نسخ كامل الملف"
                successLabel="تم نسخ كامل الملف"
                variant="primary"
                size="md"
              />
            </div>

            <div className="p-3 sm:p-5">
              <Accordion
                type="multiple"
                defaultValue={["identity"]}
                className="space-y-2"
              >
                {PROFILE_SECTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <AccordionItem
                      key={s.id}
                      value={s.id}
                      className="rounded-xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.04] transition-colors data-[state=open]:bg-white/[0.05] overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3.5 hover:no-underline group">
                        <div className="flex items-center gap-3 flex-1 text-right">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                            <Icon className="h-4 w-4 text-white/75" />
                          </div>
                          <span className="font-bold text-white text-[15px]">
                            {s.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-4 pb-4 pt-1">
                          <div className="rounded-xl bg-[#0a0c1c]/60 border border-white/8 p-4 mb-3">
                            <p className="text-[15px] text-white/85 leading-[1.95] whitespace-pre-line">
                              {s.body}
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <CopyButton
                              text={`## ${s.title}\n\n${s.body}`}
                              label={`نسخ "${s.title}"`}
                              successLabel="تم نسخ هذا القسم"
                              variant="ghost"
                              size="sm"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </motion.section>

        {/* ── 8. WHERE TO USE IT ─────────────────────────────────────── */}
        <motion.section
          id="how-to-use"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow="طريقة الاستخدام"
            title="أين تستخدم ملف التشغيل؟"
            subtitle="نفس الملف يعمل في الأدوات الثلاث الكبرى. اختر أداتك واتبع الخطوات."
          />

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-2 sm:p-3">
            <Tabs defaultValue="chatgpt" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl gap-1 h-auto flex-wrap">
                {PLATFORMS.map((p) => (
                  <TabsTrigger
                    key={p.id}
                    value={p.id}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white/65 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
                  >
                    {p.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {PLATFORMS.map((p) => (
                <TabsContent key={p.id} value={p.id} className="mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`relative rounded-xl p-6 bg-gradient-to-br ${p.accent} border border-white/10`}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                        <Settings2 className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-white text-lg">
                        كيف تستخدمه في {p.name}
                      </h3>
                    </div>
                    <ol className="space-y-3">
                      {p.steps.map((step, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-black/20 border border-white/8"
                        >
                          <span className="shrink-0 w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sm font-bold text-white">
                            {i + 1}
                          </span>
                          <p className="text-white/85 text-[15px] leading-relaxed pt-0.5">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </motion.section>

        {/* ── 9. STARTER PROMPTS ──────────────────────────────────────── */}
        <motion.section
          id="starters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow="ابدأ الآن"
            title="نقاط انطلاق جاهزة"
            subtitle="انسخ أيًا منها وألصقه بعد ملف التشغيل في أي محادثة جديدة."
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {STARTERS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={reduce ? {} : { y: -3 }}
                className="group relative rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-white/25 p-5 transition-all overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-3 mb-4">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500/30 to-orange-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-rose-100">
                    {i + 1}
                  </span>
                  <p className="text-white/90 text-[15px] leading-relaxed flex-1">
                    {s}
                  </p>
                </div>
                <div className="relative flex justify-end">
                  <CopyButton
                    text={s}
                    label="نسخ"
                    successLabel="تم النسخ"
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── FOOTER NOTE ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center pt-4 pb-2"
        >
          <p className="text-xs text-white/40 inline-flex items-center gap-2">
            <Eye className="h-3.5 w-3.5" />
            عرض توضيحي للواجهة — ببيانات تجريبية لمشروع إدارة المشاريع
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED SECTION HEADING
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/55 font-semibold mb-3">
        <span className="h-1 w-1 rounded-full bg-rose-400" />
        {eyebrow}
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/60 text-sm md:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
