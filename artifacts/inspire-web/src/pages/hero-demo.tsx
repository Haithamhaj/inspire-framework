import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Compass,
  PenLine,
  GraduationCap,
  Lightbulb,
  Scale,
  Target,
  Workflow,
  Brain,
  ShieldAlert,
  MessageSquare,
  Play,
  Check,
  Wand2,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — Hero Experience Demo (frontend-only, static)
// ─────────────────────────────────────────────────────────────────────────────

type GoalKey = "pm" | "writing" | "teaching" | "creative" | "business";

interface Goal {
  key: GoalKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string; // tailwind color name
  identityTitle: string;
  identityLine: string;
  signals: string[];
  roles: string[];
  modes: string[];
  outputRule: string;
  starter: string;
  before: string;
  after: string;
}

const GOALS: Goal[] = [
  {
    key: "pm",
    label: "إدارة مشاريع",
    icon: Compass,
    accent: "rose",
    identityTitle: "مساعد إدارة مشاريع",
    identityLine:
      "شريك تنفيذي يحوّل الأفكار إلى خطط، يكشف المخاطر، ويرتّب الأولويات.",
    signals: ["الهدف", "أولويات", "خطة مرحلية", "كشف مخاطر", "مخرجات تنفيذية"],
    roles: ["شريك تخطيط", "مراجع مخاطر", "منظم تنفيذي"],
    modes: ["تفكير منهجي", "تحليل أولويات", "قرار سريع"],
    outputRule: "خطة مرقّمة + مخاطر + خطوة تالية واضحة",
    starter: "ساعدني أحوّل هذه الفكرة إلى خطة تنفيذ من ٣ مراحل…",
    before: "نصائح عامة عن إدارة الوقت دون ربط بمشروعك.",
    after: "خطة من ٣ مراحل، مخاطر مرتّبة، وخطوة تالية محددة لمشروعك.",
  },
  {
    key: "writing",
    label: "كتابة",
    icon: PenLine,
    accent: "amber",
    identityTitle: "مساعد كتابة",
    identityLine:
      "محرر ذكي يحافظ على صوتك، يقترح بدائل، ويحوّل المسودات إلى نص أوضح.",
    signals: ["نبرة الصوت", "جمهور القارئ", "هيكل النص", "تحرير ذكي", "مسودات بديلة"],
    roles: ["محرر لغوي", "مقترح بدائل", "مدقق هيكلي"],
    modes: ["تفكير سردي", "تحليل أسلوبي", "إعادة صياغة"],
    outputRule: "نص نظيف + بدائل قصيرة + ملاحظات تحرير",
    starter: "حرّر هذه الفقرة مع الحفاظ على نبرتي…",
    before: "إعادة صياغة عامة قد تفقد صوتك الأصلي.",
    after: "تحرير يحفظ نبرتك، مع ٢-٣ بدائل وملاحظات على الإيقاع.",
  },
  {
    key: "teaching",
    label: "تعليم وتدريب",
    icon: GraduationCap,
    accent: "teal",
    identityTitle: "مساعد تعليم وتدريب",
    identityLine:
      "مرشد تعليمي يبسّط المفاهيم، يقدم أمثلة، ويبني تمارين متدرّجة.",
    signals: ["مستوى المتعلم", "أمثلة واقعية", "تمارين متدرجة", "شرح بسيط", "تقويم سريع"],
    roles: ["مبسّط مفاهيم", "مصمم تمارين", "مقيّم فهم"],
    modes: ["تفكير تعليمي", "تشبيه قريب", "تدرّج صعوبة"],
    outputRule: "شرح مبسّط + مثال + تمرين قصير",
    starter: "اشرح لي هذا المفهوم بمثال يومي ثم اختبرني…",
    before: "تعريف أكاديمي طويل بدون تطبيق.",
    after: "شرح بمثال يومي، ثم تمرين قصير لقياس فهمك.",
  },
  {
    key: "creative",
    label: "إبداع",
    icon: Lightbulb,
    accent: "violet",
    identityTitle: "مساعد إبداعي",
    identityLine:
      "شريك أفكار يولّد بدائل، يفتح زوايا جديدة، ويقدّم نقدًا بنّاءً.",
    signals: ["زوايا جديدة", "بدائل متعددة", "نقد بنّاء", "إلهام بصري", "تحدي الفرضيات"],
    roles: ["مولّد أفكار", "ناقد إبداعي", "كاسر فرضيات"],
    modes: ["تفكير تباعدي", "ربط غير متوقع", "نقد لطيف"],
    outputRule: "٣ بدائل مختلفة + ملاحظة نقدية لكل منها",
    starter: "أعطني ٣ زوايا مختلفة لهذه الفكرة، ثم انتقدها…",
    before: "اقتراح واحد متوقَّع وقريب من المألوف.",
    after: "٣ بدائل بزوايا مختلفة، مع نقد بنّاء لكل خيار.",
  },
  {
    key: "business",
    label: "قرارات أعمال",
    icon: Scale,
    accent: "indigo",
    identityTitle: "مساعد قرارات أعمال",
    identityLine:
      "محلل قرارات يقارن الخيارات، يوضّح المقايضات، ويقترح توصية مبرَّرة.",
    signals: ["مقارنة خيارات", "مقايضات", "مخاطر القرار", "توصية مبرَّرة", "أفق زمني"],
    roles: ["محلل مقارن", "كاشف مقايضات", "موصي قرار"],
    modes: ["تفكير تحليلي", "موازنة معايير", "حسم مبرَّر"],
    outputRule: "جدول مقارنة + مقايضات + توصية واضحة",
    starter: "قارن بين هذين الخيارين بمعاييري، ثم أوصِ…",
    before: "سرد عام لإيجابيات وسلبيات بدون ترجيح.",
    after: "مقارنة بمعاييرك، مقايضات صريحة، وتوصية مبرَّرة.",
  },
];

const PROFILE_SECTION_LABELS = [
  { key: "identity", label: "هوية المساعد", icon: Sparkles },
  { key: "roles", label: "الأدوار الديناميكية", icon: Workflow },
  { key: "modes", label: "أنماط التفكير", icon: Brain },
  { key: "rules", label: "قواعد المخرجات", icon: ShieldAlert },
  { key: "starter", label: "برومبت بداية", icon: MessageSquare },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const accentClasses: Record<
  string,
  { text: string; ring: string; glow: string; chip: string; dot: string }
> = {
  rose: {
    text: "text-rose-300",
    ring: "ring-rose-400/40",
    glow: "from-rose-500/30 via-orange-500/20 to-transparent",
    chip: "bg-rose-500/10 border-rose-400/30 text-rose-100",
    dot: "bg-rose-400",
  },
  amber: {
    text: "text-amber-300",
    ring: "ring-amber-400/40",
    glow: "from-amber-500/30 via-rose-500/20 to-transparent",
    chip: "bg-amber-500/10 border-amber-400/30 text-amber-100",
    dot: "bg-amber-400",
  },
  teal: {
    text: "text-teal-300",
    ring: "ring-teal-400/40",
    glow: "from-teal-500/30 via-emerald-500/20 to-transparent",
    chip: "bg-teal-500/10 border-teal-400/30 text-teal-100",
    dot: "bg-teal-400",
  },
  violet: {
    text: "text-violet-300",
    ring: "ring-violet-400/40",
    glow: "from-violet-500/30 via-fuchsia-500/20 to-transparent",
    chip: "bg-violet-500/10 border-violet-400/30 text-violet-100",
    dot: "bg-violet-400",
  },
  indigo: {
    text: "text-indigo-300",
    ring: "ring-indigo-400/40",
    glow: "from-indigo-500/30 via-sky-500/20 to-transparent",
    chip: "bg-indigo-500/10 border-indigo-400/30 text-indigo-100",
    dot: "bg-indigo-400",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-rose-500/20 blur-3xl" />
      <div className="absolute top-1/3 -left-40 h-[460px] w-[460px] rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/15 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}

function SignalChip({
  label,
  accent,
  delay,
  reduced,
}: {
  label: string;
  accent: string;
  delay: number;
  reduced: boolean;
}) {
  const a = accentClasses[accent];
  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] backdrop-blur-md ${a.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
      {label}
    </motion.div>
  );
}

function ProfilePreview({ goal, reduced }: { goal: Goal; reduced: boolean }) {
  const a = accentClasses[goal.accent];
  const Icon = goal.icon;

  return (
    <div className="relative">
      {/* Soft outer glow */}
      <div
        className={`absolute -inset-6 rounded-[36px] bg-gradient-to-br ${a.glow} blur-2xl opacity-70`}
      />

      {/* Card */}
      <motion.div
        layout
        className={`relative rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl ring-1 ${a.ring} backdrop-blur-xl`}
      >
        {/* Top label */}
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-white/70">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            ملف تشغيل المساعد
          </div>
          <div className={`text-[11px] ${a.text}`}>INSPIRE Profile</div>
        </div>

        {/* Identity */}
        <AnimatePresence mode="wait">
          <motion.div
            key={goal.key + "-identity"}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5"
          >
            <div className="mb-2 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ${a.ring}`}
              >
                <Icon className={`h-5 w-5 ${a.text}`} />
              </div>
              <div>
                <div className="text-[11px] text-white/50">هوية المساعد</div>
                <div className="text-base font-semibold text-white">
                  {goal.identityTitle}
                </div>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-white/70">
              {goal.identityLine}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Sections grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Roles */}
          <AnimatePresence mode="wait">
            <motion.div
              key={goal.key + "-roles"}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <div className="mb-2 flex items-center gap-2 text-[11px] text-white/60">
                <Workflow className="h-3.5 w-3.5" /> أدوار ديناميكية
              </div>
              <div className="flex flex-wrap gap-1.5">
                {goal.roles.map((r) => (
                  <span
                    key={r}
                    className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/80"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Modes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={goal.key + "-modes"}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <div className="mb-2 flex items-center gap-2 text-[11px] text-white/60">
                <Brain className="h-3.5 w-3.5" /> أنماط التفكير
              </div>
              <div className="flex flex-wrap gap-1.5">
                {goal.modes.map((m) => (
                  <span
                    key={m}
                    className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/80"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Output rule */}
          <AnimatePresence mode="wait">
            <motion.div
              key={goal.key + "-rules"}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="col-span-2 rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <div className="mb-1.5 flex items-center gap-2 text-[11px] text-white/60">
                <ShieldAlert className="h-3.5 w-3.5" /> قواعد المخرجات
              </div>
              <div className="text-[12.5px] text-white/85">{goal.outputRule}</div>
            </motion.div>
          </AnimatePresence>

          {/* Starter */}
          <AnimatePresence mode="wait">
            <motion.div
              key={goal.key + "-starter"}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`col-span-2 rounded-xl border bg-gradient-to-br p-3 ${a.chip} from-white/[0.04] to-transparent`}
            >
              <div className="mb-1.5 flex items-center gap-2 text-[11px] opacity-80">
                <MessageSquare className="h-3.5 w-3.5" /> برومبت بداية
              </div>
              <div className="text-[12.5px] leading-relaxed">
                « {goal.starter} »
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function FloatingSignals({ goal, reduced }: { goal: Goal; reduced: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0">
      <AnimatePresence mode="popLayout">
        {goal.signals.map((s, i) => {
          // Spread chips around the card
          const positions = [
            { top: "-6%", right: "8%" },
            { top: "12%", right: "-10%" },
            { top: "48%", right: "-14%" },
            { bottom: "8%", right: "-6%" },
            { bottom: "-4%", right: "30%" },
          ];
          const pos = positions[i % positions.length];
          return (
            <motion.div
              key={goal.key + s}
              initial={
                reduced
                  ? { opacity: 0.9 }
                  : { opacity: 0, x: 40, y: 10, scale: 0.9 }
              }
              animate={{
                opacity: 0.95,
                x: 0,
                y: reduced ? 0 : [0, -6, 0],
                scale: 1,
              }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
              transition={{
                duration: reduced ? 0.2 : 0.7,
                delay: reduced ? 0 : 0.1 + i * 0.08,
                y: reduced
                  ? undefined
                  : { repeat: Infinity, duration: 4 + i * 0.4, ease: "easeInOut" },
              }}
              className="absolute"
              style={pos}
            >
              <SignalChip label={s} accent={goal.accent} delay={0} reduced={reduced} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function GoalSelector({
  active,
  onSelect,
}: {
  active: GoalKey;
  onSelect: (k: GoalKey) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {GOALS.map((g) => {
        const Icon = g.icon;
        const isActive = active === g.key;
        const a = accentClasses[g.accent];
        return (
          <button
            key={g.key}
            onClick={() => onSelect(g.key)}
            data-testid={`goal-${g.key}`}
            className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] transition-all ${
              isActive
                ? `${a.chip} ring-2 ${a.ring} shadow-lg`
                : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${isActive ? a.text : "text-white/60 group-hover:text-white"}`}
            />
            {g.label}
            {isActive && <Check className="h-3.5 w-3.5 opacity-80" />}
          </button>
        );
      })}
    </div>
  );
}

function BeforeAfter({ goal, reduced }: { goal: Goal; reduced: boolean }) {
  const a = accentClasses[goal.accent];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Without INSPIRE */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-[12px] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            بدون ملف تشغيل
          </div>
          <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-white/50">
            رد عام
          </span>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-[13px] leading-relaxed text-white/70">
          {goal.before}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-white/50">
          <span className="h-1 w-1 rounded-full bg-white/40" /> أقل ارتباطًا
          بهدفك وسياقك
        </div>
      </motion.div>

      {/* With INSPIRE */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 ${a.chip} ring-1 ${a.ring}`}
      >
        <div
          className={`pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-gradient-to-br ${a.glow} blur-2xl`}
        />
        <div className="relative mb-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-[12px]">
            <Sparkles className={`h-3.5 w-3.5 ${a.text}`} />
            مع ملف تشغيل INSPIRE
          </div>
          <span className="rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[10px] text-white/70">
            رد مخصّص
          </span>
        </div>
        <div className="relative rounded-xl border border-white/10 bg-black/30 p-4 text-[13px] leading-relaxed text-white/90">
          {goal.after}
        </div>
        <div className="relative mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/70">
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3" /> سياقي
          </span>
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3" /> واعٍ بدورك
          </span>
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3" /> منظم
          </span>
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3" /> قابل للتنفيذ
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroDemo() {
  const reduced = useReducedMotion() ?? false;
  const [activeKey, setActiveKey] = useState<GoalKey>("pm");
  const goal = useMemo(
    () => GOALS.find((g) => g.key === activeKey) ?? GOALS[0],
    [activeKey],
  );

  // Auto-rotate goals on first 30s for demo richness, stop after user interacts
  const [userTouched, setUserTouched] = useState(false);
  useEffect(() => {
    if (userTouched || reduced) return;
    const id = setInterval(() => {
      setActiveKey((prev) => {
        const idx = GOALS.findIndex((g) => g.key === prev);
        return GOALS[(idx + 1) % GOALS.length].key;
      });
    }, 5200);
    return () => clearInterval(id);
  }, [userTouched, reduced]);

  const handleSelect = (k: GoalKey) => {
    setUserTouched(true);
    setActiveKey(k);
  };

  return (
    <div
      dir="rtl"
      lang="ar"
      className="relative min-h-screen overflow-x-hidden bg-[#0b0d1f] text-white"
      data-testid="hero-demo-page"
    >
      <AuroraBackground />

      {/* HERO */}
      <section className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Right side (visually first in RTL) — content */}
          <div className="order-1 lg:order-1 lg:col-span-6">
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-rose-300" />
              Next Step AI · Human Interactive AI
            </motion.div>

            <motion.h1
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 text-[34px] font-extrabold leading-[1.2] tracking-tight md:text-[52px] md:leading-[1.15]"
            >
              خطوتك التالية مع{" "}
              <span className="bg-gradient-to-l from-rose-300 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                AI
              </span>{" "}
              تبدأ عندما يفهم{" "}
              <span className="bg-gradient-to-l from-violet-300 via-fuchsia-300 to-rose-300 bg-clip-text text-transparent">
                كيف يعمل معك
              </span>
              .
            </motion.h1>

            <motion.p
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-5 max-w-xl text-[15px] leading-loose text-white/70 md:text-[17px]"
            >
              INSPIRE يبني ملف تشغيل مخصّصًا يساعد ChatGPT وGemini وClaude على
              تقديم إجابات أقرب لهدفك، أسلوبك، وسياقك.
            </motion.p>

            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <button
                data-testid="cta-primary"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-rose-500 via-orange-500 to-amber-400 px-5 py-3 text-[14.5px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(244,63,94,0.6)] transition-all hover:shadow-[0_14px_36px_-10px_rgba(244,63,94,0.8)]"
              >
                <Wand2 className="h-4 w-4" />
                ابنِ ملف تشغيل مساعدك
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </button>
              <button
                data-testid="cta-secondary"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-[14.5px] text-white/85 backdrop-blur-md transition-colors hover:bg-white/[0.08]"
              >
                <Play className="h-4 w-4" />
                شاهد كيف يعمل
              </button>
            </motion.div>

            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-5 flex items-center gap-2 text-[12.5px] text-white/55"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              يعمل مع
              <span className="text-white/80">ChatGPT</span>·
              <span className="text-white/80">Gemini</span>·
              <span className="text-white/80">Claude</span>
            </motion.div>

            {/* Slogan */}
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-gradient-to-l from-rose-500/10 via-violet-500/10 to-teal-500/10 px-4 py-2 text-[13px] text-white/85"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-200" />
              كل هدف له إلهامه الخاص
            </motion.div>
          </div>

          {/* Left side (visually second in RTL) — animated preview */}
          <div className="order-2 lg:order-2 lg:col-span-6">
            <div className="relative mx-auto w-full max-w-[520px]">
              <FloatingSignals goal={goal} reduced={reduced} />
              <ProfilePreview goal={goal} reduced={reduced} />
            </div>
          </div>
        </div>
      </section>

      {/* GOAL SELECTOR */}
      <section className="relative mx-auto w-full max-w-7xl px-5 pb-12 md:px-8 md:pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:p-8">
          <div className="mb-5 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <div className="mb-1 inline-flex items-center gap-2 text-[12px] text-white/60">
                <Target className="h-3.5 w-3.5 text-rose-300" />
                اختر هدفك
              </div>
              <h2 className="text-[22px] font-bold md:text-[26px]">
                كل هدف له إلهامه الخاص
              </h2>
              <p className="mt-1 max-w-xl text-[13.5px] text-white/65 md:text-[14.5px]">
                اضغط أي هدف لترى كيف يتكيّف ملف التشغيل ليخدمه — هوية، أدوار،
                وأنماط تفكير مختلفة.
              </p>
            </div>
            <div className="text-[11.5px] text-white/45">
              {userTouched ? "تم التحديد يدويًا" : "عرض تلقائي…"}
            </div>
          </div>

          <GoalSelector active={activeKey} onSelect={handleSelect} />

          {/* Inline live profile sections preview pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {PROFILE_SECTION_LABELS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={goal.key + s.key}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11.5px] text-white/75"
                >
                  <Icon className="h-3 w-3 opacity-70" />
                  {s.label}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BEFORE / WITH */}
      <section className="relative mx-auto w-full max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 inline-flex items-center gap-2 text-[12px] text-white/60">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              الفرق بنظرة واحدة
            </div>
            <h2 className="text-[22px] font-bold md:text-[26px]">
              نفس السؤال — ردّ أقرب لك
            </h2>
          </div>
          <div className="hidden text-[12px] text-white/45 md:block">
            مثال على هدف: {goal.label}
          </div>
        </div>

        <BeforeAfter goal={goal} reduced={reduced} />

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center">
          <p className="max-w-2xl text-[14px] leading-relaxed text-white/65">
            INSPIRE ليس دورة برومبت ولا اختبار شخصية — هو طبقة علاقة بينك وبين
            مساعدك الذكي، تترجم هدفك إلى تعليمات يفهمها AI ويعمل بها.
          </p>
          <button className="group mt-2 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-rose-500 via-orange-500 to-amber-400 px-5 py-3 text-[14.5px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(244,63,94,0.6)] transition-all hover:shadow-[0_14px_36px_-10px_rgba(244,63,94,0.8)]">
            <Wand2 className="h-4 w-4" />
            ابدأ خطوتك التالية مع AI
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
}
