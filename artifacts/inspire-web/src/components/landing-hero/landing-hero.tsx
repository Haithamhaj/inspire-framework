import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
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
import { useDirection, useT, type TKey } from "@/i18n";
import { AutoGuideBar } from "@/components/guide-character/GuideCharacterDemo";

// ─── Goal model ──────────────────────────────────────────────────────────────
type GoalKey = "pm" | "writing" | "teaching" | "creative" | "business";

interface GoalDef {
  key: GoalKey;
  icon: React.ComponentType<{ className?: string }>;
  accent: keyof typeof accentClasses;
}

const GOAL_DEFS: GoalDef[] = [
  { key: "pm", icon: Compass, accent: "rose" },
  { key: "writing", icon: PenLine, accent: "amber" },
  { key: "teaching", icon: GraduationCap, accent: "teal" },
  { key: "creative", icon: Lightbulb, accent: "violet" },
  { key: "business", icon: Scale, accent: "indigo" },
];

const accentClasses = {
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
} as const;

function goalKey(g: GoalKey, leaf: string): TKey {
  return `landing.hero.goals.${g}.${leaf}` as TKey;
}

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

function ValueMarquee({
  text,
  reduced,
  isRtl,
}: {
  text: string;
  reduced: boolean;
  isRtl: boolean;
}) {
  const items = text.split("•").map((item) => item.trim()).filter(Boolean);
  const duration = 26;

  return (
    <div className="relative z-10 h-10 overflow-hidden border-y border-white/10 bg-black/25 backdrop-blur-md">
      <style>
        {`
          @keyframes inspire-marquee-rtl {
            from { transform: translate3d(110vw, -50%, 0); }
            to { transform: translate3d(-25vw, -50%, 0); }
          }
          @keyframes inspire-marquee-ltr {
            from { transform: translate3d(-25vw, -50%, 0); }
            to { transform: translate3d(110vw, -50%, 0); }
          }
          @keyframes inspire-marquee-hue {
            from { filter: hue-rotate(0deg); }
            to { filter: hue-rotate(360deg); }
          }
        `}
      </style>
      <span className="sr-only">{text}</span>
      <div aria-hidden="true" className="absolute inset-0">
        {items.map((item, itemIndex) => {
          return (
            <span
              key={item}
              className="absolute left-0 top-1/2 inline-flex min-w-max items-center gap-3 text-[13px] font-semibold text-white/82 md:text-[14px]"
              style={
                reduced
                  ? {
                      insetInlineStart: `${(itemIndex / items.length) * 100}%`,
                      transform: "translateY(-50%)",
                      color: "hsl(45 95% 82%)",
                      filter: `hue-rotate(${itemIndex * 58}deg)`,
                    }
                  : {
                      animationName: isRtl
                        ? "inspire-marquee-rtl, inspire-marquee-hue"
                        : "inspire-marquee-ltr, inspire-marquee-hue",
                      animationDuration: `${duration}s, 12s`,
                      animationTimingFunction: "linear, ease-in-out",
                      animationIterationCount: "infinite, infinite",
                      animationDelay: `${-(duration / items.length) * itemIndex}s, ${-itemIndex * 1.4}s`,
                      color: "hsl(45 95% 82%)",
                    }
              }
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_16px_currentColor]" />
              <span className="drop-shadow-[0_0_12px_currentColor]">
                {item}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function OutcomeStrip({ reduced }: { reduced: boolean }) {
  const t = useT();
  const items = [
    {
      icon: Brain,
      title: t("landing.hero.outcome1Title"),
      desc: t("landing.hero.outcome1Desc"),
    },
    {
      icon: MessageSquare,
      title: t("landing.hero.outcome2Title"),
      desc: t("landing.hero.outcome2Desc"),
    },
    {
      icon: Target,
      title: t("landing.hero.outcome3Title"),
      desc: t("landing.hero.outcome3Desc"),
    },
  ];

  return (
    <section className="relative mx-auto w-full max-w-7xl px-5 pb-12 md:px-8 md:pb-14">
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.35 }}
        className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 backdrop-blur-md md:p-6"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 md:max-w-[240px]">
            <span className="text-[12px] font-bold uppercase tracking-widest text-rose-300">
              {t("landing.hero.outcomesEyebrow")}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white">
              {t("landing.hero.outcomesTitle")}
            </h2>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
            {items.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-400/15 text-rose-200">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-[15px] font-bold text-white">{title}</div>
                  <div className="mt-1 text-[13.5px] leading-5 text-white/62">
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function SignalChip({
  label,
  accent,
  reduced,
}: {
  label: string;
  accent: keyof typeof accentClasses;
  reduced: boolean;
}) {
  const a = accentClasses[accent];
  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium backdrop-blur-md ${a.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
      {label}
    </motion.div>
  );
}

function ProfilePreview({
  goal,
  reduced,
}: {
  goal: GoalDef;
  reduced: boolean;
}) {
  const t = useT();
  const a = accentClasses[goal.accent];
  const Icon = goal.icon;

  return (
    <div className="relative">
      <div
        className={`absolute -inset-6 rounded-[36px] bg-gradient-to-br ${a.glow} blur-2xl opacity-70`}
      />

      <motion.div
        layout
        className={`relative rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl ring-1 ${a.ring} backdrop-blur-xl`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[12px] font-medium text-white/76">
            <span className="relative flex h-1.5 w-1.5">
              {!reduced && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {t("landing.hero.profile.liveLabel")}
          </div>
          <div className={`text-[12px] font-medium ${a.text}`}>
            {t("landing.hero.profile.tag")}
          </div>
        </div>

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
                <div className="text-[12px] font-medium text-white/58">
                  {t("landing.hero.profile.identity")}
                </div>
                <div className="text-base font-semibold text-white">
                  {t(goalKey(goal.key, "identityTitle"))}
                </div>
              </div>
            </div>
            <p className="text-[13.5px] leading-relaxed text-white/74">
              {t(goalKey(goal.key, "identityLine"))}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={goal.key + "-roles"}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-white/66">
                <Workflow className="h-3.5 w-3.5" />
                {t("landing.hero.profile.roles")}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="rounded-md bg-white/5 px-2 py-0.5 text-[12px] font-medium text-white/84"
                  >
                    {t(goalKey(goal.key, `role${i}`))}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={goal.key + "-modes"}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-white/66">
                <Brain className="h-3.5 w-3.5" />
                {t("landing.hero.profile.modes")}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="rounded-md bg-white/5 px-2 py-0.5 text-[12px] font-medium text-white/84"
                  >
                    {t(goalKey(goal.key, `mode${i}`))}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={goal.key + "-rules"}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="col-span-2 rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <div className="mb-1.5 flex items-center gap-2 text-[12px] font-medium text-white/66">
                <ShieldAlert className="h-3.5 w-3.5" />
                {t("landing.hero.profile.rules")}
              </div>
              <div className="text-[13px] text-white/88">
                {t(goalKey(goal.key, "outputRule"))}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={goal.key + "-starter"}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`col-span-2 rounded-xl border bg-gradient-to-br p-3 ${a.chip} from-white/[0.04] to-transparent`}
            >
              <div className="mb-1.5 flex items-center gap-2 text-[12px] font-medium opacity-85">
                <MessageSquare className="h-3.5 w-3.5" />
                {t("landing.hero.profile.starter")}
              </div>
              <div className="text-[13px] leading-relaxed">
                « {t(goalKey(goal.key, "starter"))} »
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function FloatingSignals({
  goal,
  reduced,
  isRtl,
}: {
  goal: GoalDef;
  reduced: boolean;
  isRtl: boolean;
}) {
  const t = useT();
  const positions = [
    { top: "-6%" },
    { top: "12%" },
    { top: "48%" },
    { bottom: "8%" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
      <AnimatePresence mode="popLayout">
        {[1, 2, 3, 4].map((i) => {
          const pos = positions[(i - 1) % positions.length];
          return (
            <motion.div
              key={goal.key + i}
              initial={
                reduced
                  ? { opacity: 0.9 }
                  : { opacity: 0, x: isRtl ? 30 : -30, y: 8, scale: 0.92 }
              }
              animate={{
                opacity: 0.95,
                x: 0,
                y: reduced ? 0 : [0, -6, 0],
                scale: 1,
              }}
              exit={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: isRtl ? -20 : 20 }
              }
              transition={{
                duration: reduced ? 0.2 : 0.65,
                delay: reduced ? 0 : 0.08 + (i - 1) * 0.07,
                y: reduced
                  ? undefined
                  : {
                      repeat: Infinity,
                      duration: 4 + (i - 1) * 0.4,
                      ease: "easeInOut",
                    },
              }}
              className={`absolute ${isRtl ? "left-full ml-4" : "right-full mr-4"}`}
              style={pos}
            >
              <div className="whitespace-nowrap">
                <SignalChip
                  label={t(goalKey(goal.key, `signal${i}`))}
                  accent={goal.accent}
                  reduced={reduced}
                />
              </div>
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
  const t = useT();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {GOAL_DEFS.map((g) => {
        const Icon = g.icon;
        const isActive = active === g.key;
        const a = accentClasses[g.accent];
        return (
          <button
            key={g.key}
            type="button"
            onClick={() => onSelect(g.key)}
            data-testid={`hero-goal-${g.key}`}
            className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13.5px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 ${
              isActive
                ? `${a.chip} ring-2 ${a.ring} shadow-lg`
                : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${isActive ? a.text : "text-white/60 group-hover:text-white"}`}
            />
            {t(goalKey(g.key, "label"))}
            {isActive && <Check className="h-3.5 w-3.5 opacity-80" />}
          </button>
        );
      })}
    </div>
  );
}

function BeforeAfter({ goal, reduced }: { goal: GoalDef; reduced: boolean }) {
  const t = useT();
  const a = accentClasses[goal.accent];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="mb-2 text-[12.5px] font-semibold uppercase tracking-widest text-white/50">
          {t("landing.hero.compare.promptLabel")}
        </div>
        <p className="text-[15px] leading-7 text-white/82">
          {t("landing.hero.compare.promptText")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 ${a.chip} ring-1 ${a.ring}`}
        >
          <div
            className={`pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-gradient-to-br ${a.glow} blur-2xl`}
          />
          <div className="relative mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex min-w-0 items-center gap-2 text-[13px] font-medium">
              <Sparkles className={`h-3.5 w-3.5 ${a.text}`} />
              {t("landing.hero.compare.withLabel")}
            </div>
            <span className="rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[11.5px] font-medium text-white/76">
              {t("landing.hero.compare.withTag")}
            </span>
          </div>
          <div className="relative whitespace-pre-line rounded-xl border border-white/10 bg-black/30 p-4 text-[14px] leading-relaxed text-white/92">
            {t("landing.hero.compare.withExample")}
          </div>
          <div className="relative mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-medium text-white/76">
            {(["withChip1", "withChip2", "withChip3", "withChip4"] as const).map(
              (k) => (
                <span key={k} className="inline-flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {t(`landing.hero.compare.${k}` as TKey)}
                </span>
              ),
            )}
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex min-w-0 items-center gap-2 text-[13px] font-medium text-white/66">
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              {t("landing.hero.compare.withoutLabel")}
            </div>
            <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[11.5px] font-medium text-white/58">
              {t("landing.hero.compare.withoutTag")}
            </span>
          </div>
          <div className="whitespace-pre-line rounded-xl border border-white/[0.06] bg-black/20 p-4 text-[14px] leading-relaxed text-white/76">
            {t("landing.hero.compare.withoutExample")}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12.5px] font-medium text-white/58">
            <span className="h-1 w-1 rounded-full bg-white/40" />
            {t("landing.hero.compare.withoutNote")}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface LandingHeroProps {
  primaryHref: string;
  secondaryAnchorId: string;
}

export default function LandingHero({
  primaryHref,
  secondaryAnchorId,
}: LandingHeroProps) {
  const t = useT();
  const dir = useDirection();
  const isRtl = dir === "rtl";
  const reduced = useReducedMotion() ?? false;

  const [activeKey, setActiveKey] = useState<GoalKey>("pm");
  const goal = useMemo(
    () => GOAL_DEFS.find((g) => g.key === activeKey) ?? GOAL_DEFS[0],
    [activeKey],
  );

  const [userTouched, setUserTouched] = useState(false);
  useEffect(() => {
    if (userTouched || reduced) return;
    const id = setInterval(() => {
      setActiveKey((prev) => {
        const idx = GOAL_DEFS.findIndex((g) => g.key === prev);
        return GOAL_DEFS[(idx + 1) % GOAL_DEFS.length].key;
      });
    }, 5200);
    return () => clearInterval(id);
  }, [userTouched, reduced]);

  const handleSelect = (k: GoalKey) => {
    setUserTouched(true);
    setActiveKey(k);
  };

  const handleSecondary = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(secondaryAnchorId);
    if (el) {
      el.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  const ArrowCta = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      dir={dir}
      className="relative overflow-hidden bg-[#0b0d1f] text-white"
      data-testid="landing-hero"
    >
      <AuroraBackground />
      <AutoGuideBar locale={isRtl ? "ar" : "en"} />
      <div className="h-[112px] md:h-[104px]" aria-hidden="true" />
      <ValueMarquee
        text={t("landing.hero.marquee")}
        reduced={reduced}
        isRtl={isRtl}
      />

      {/* HERO MAIN */}
      <section className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Content */}
          <div className="order-1 lg:col-span-6">
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[13px] font-medium text-white/78 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-rose-300" />
              {t("landing.hero.eyebrow")}
            </motion.div>

            <motion.h1
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 text-[34px] font-extrabold leading-[1.2] tracking-tight md:text-[52px] md:leading-[1.15]"
            >
              {t("landing.hero.headlineLead")}{" "}
              <span className="bg-gradient-to-l from-rose-300 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                {t("landing.hero.headlineAccent1")}
              </span>{" "}
              {t("landing.hero.headlineMid")}{" "}
              <span className="bg-gradient-to-l from-violet-300 via-fuchsia-300 to-rose-300 bg-clip-text text-transparent">
                {t("landing.hero.headlineAccent2")}
              </span>
            </motion.h1>

            <motion.p
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-5 max-w-xl text-[15px] leading-loose text-white/70 md:text-[17px]"
            >
              {t("landing.hero.paragraph")}
            </motion.p>

            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Link
                href={primaryHref}
                data-testid="hero-cta-primary"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-rose-500 via-orange-500 to-amber-400 px-5 py-3 text-[14.5px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(244,63,94,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-10px_rgba(244,63,94,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
              >
                <Wand2 className="h-4 w-4" />
                {t("landing.hero.primaryCta")}
                <ArrowCta className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-0 ltr:group-hover:translate-x-1" />
              </Link>
              <a
                href={`#${secondaryAnchorId}`}
                onClick={handleSecondary}
                data-testid="hero-cta-secondary"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-[14.5px] text-white/85 backdrop-blur-md transition-colors hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <Play className="h-4 w-4" />
                {t("landing.hero.secondaryCta")}
              </a>
            </motion.div>

            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-5 flex flex-wrap items-center gap-2 text-[13.5px] font-medium text-white/68"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t("landing.hero.trustLine")}
              <span className="text-white/88">ChatGPT</span>·
              <span className="text-white/88">Gemini</span>·
              <span className="text-white/88">Claude</span>
            </motion.div>

            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-gradient-to-l from-rose-500/10 via-violet-500/10 to-teal-500/10 px-4 py-2.5 text-[14px] font-medium text-white/90"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-200" />
              {t("landing.hero.slogan")}
            </motion.div>
          </div>

          {/* Visual */}
          <div className="order-2 lg:col-span-6">
            <div className="relative mx-auto w-full max-w-[520px]">
              <FloatingSignals goal={goal} reduced={reduced} isRtl={isRtl} />
              <ProfilePreview goal={goal} reduced={reduced} />
            </div>
          </div>
        </div>
      </section>

      <OutcomeStrip reduced={reduced} />

      {/* GOAL SELECTOR */}
      <section className="relative mx-auto w-full max-w-7xl px-5 pb-12 md:px-8 md:pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:p-8">
          <div className="mb-5 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <div className="mb-1 inline-flex items-center gap-2 text-[13px] font-medium text-white/68">
                <Target className="h-3.5 w-3.5 text-rose-300" />
                {t("landing.hero.goalsEyebrow")}
              </div>
              <h2 className="text-[22px] font-bold md:text-[26px]">
                {t("landing.hero.goalsTitle")}
              </h2>
              <p className="mt-1 max-w-xl text-[14.5px] leading-6 text-white/72 md:text-[15px]">
                {t("landing.hero.goalsSubtitle")}
              </p>
            </div>
            <div className="text-[13px] font-medium text-white/58">
              {userTouched
                ? t("landing.hero.manualSelected")
                : t("landing.hero.autoCycling")}
            </div>
          </div>

          <GoalSelector active={activeKey} onSelect={handleSelect} />
        </div>
      </section>

      {/* BEFORE / WITH */}
      <section className="relative mx-auto w-full max-w-7xl px-5 pb-16 md:px-8 md:pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 inline-flex items-center gap-2 text-[13px] font-medium text-white/68">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              {t("landing.hero.compare.eyebrow")}
            </div>
            <h2 className="text-[22px] font-bold md:text-[26px]">
              {t("landing.hero.compare.title")}
            </h2>
          </div>
          <div className="hidden text-[13px] font-medium text-white/58 md:block">
            {t("landing.hero.compare.goalExampleLabel")}{" "}
            {t(goalKey(goal.key, "label"))}
          </div>
        </div>

        <BeforeAfter goal={goal} reduced={reduced} />
      </section>
    </div>
  );
}
