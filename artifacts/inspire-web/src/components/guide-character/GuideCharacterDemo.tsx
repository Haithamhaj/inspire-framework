import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  MousePointerClick,
  Sparkles,
} from "lucide-react";
import realityFoxSpritesheet from "@/assets/guide-character/reality-fox-spritesheet.webp";

export type GuideState = "idle" | "waiting" | "review" | "waving" | "complete";
type FoxSpriteState = GuideState | "runningRight" | "runningLeft";

const FOX_ROWS: Record<FoxSpriteState, { row: number; frames: number }> = {
  idle: { row: 0, frames: 6 },
  runningRight: { row: 1, frames: 8 },
  runningLeft: { row: 2, frames: 8 },
  waiting: { row: 6, frames: 6 },
  review: { row: 8, frames: 6 },
  waving: { row: 3, frames: 4 },
  complete: { row: 4, frames: 5 },
};

const BAR_COPY: Record<GuideState, { ar: string; en: string }> = {
  waving: {
    ar: "أهلاً، سأبقى معك هنا. اختر الأقرب لك، وليس الأجمل على الورق.",
    en: "Hi, I will stay here with you. Choose what is closest, not what sounds ideal.",
  },
  idle: {
    ar: "ابدأ بهدوء. لا يوجد جواب مثالي، يوجد جواب أقرب لك.",
    en: "Start calmly. There is no perfect answer, only the closest one.",
  },
  waiting: {
    ar: "خذ لحظة. السؤال يقيس نمط العمل، وليس سرعة الإجابة.",
    en: "Take a moment. This measures work pattern, not answer speed.",
  },
  review: {
    ar: "اختيارك وصل. لو شعرت أن خياراً آخر قريب، اعتمد الأكثر تكراراً في عملك.",
    en: "Answer received. If another option feels close, use what happens most often.",
  },
  complete: {
    ar: "تقدمت خطوة. الآن صار عندنا إشارة أوضح لبناء التعليمات.",
    en: "One step forward. We now have a clearer signal for the instructions.",
  },
};

const AUTO_BAR_STEPS: Array<{
  state: GuideState;
  sprite: FoxSpriteState;
  x: number;
}> = [
  { state: "waving", sprite: "waving", x: 122 },
  { state: "idle", sprite: "runningLeft", x: 22 },
  { state: "waiting", sprite: "waiting", x: -118 },
  { state: "review", sprite: "runningRight", x: -34 },
  { state: "complete", sprite: "complete", x: 106 },
  { state: "idle", sprite: "idle", x: 0 },
];

function isArabicPath() {
  return window.location.pathname.startsWith("/ar");
}

export function RealityFoxCharacter({
  state,
  size = 132,
}: {
  state: FoxSpriteState;
  size?: number;
}) {
  const reduced = useReducedMotion() ?? false;
  const { row, frames } = FOX_ROWS[state];
  const [frame, setFrame] = useState(0);
  const cellHeight = Math.round((size / 192) * 208);

  useEffect(() => {
    setFrame(0);
    if (reduced) return;
    const delay = state === "waving" || state === "complete" ? 180 : 250;
    const id = window.setInterval(() => {
      setFrame((current) => (current + 1) % frames);
    }, delay);
    return () => window.clearInterval(id);
  }, [frames, reduced, state]);

  return (
    <div
      aria-label="Reality Fox guide character"
      role="img"
      className="mx-auto overflow-hidden drop-shadow-[0_20px_26px_rgba(0,0,0,0.38)]"
      style={{
        width: size,
        height: cellHeight,
        backgroundImage: `url(${realityFoxSpritesheet})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${size * 8}px ${cellHeight * 9}px`,
        backgroundPosition: `${-frame * size}px ${-row * cellHeight}px`,
      }}
    />
  );
}

export function AutoGuideBar({
  locale,
  triggerState,
  triggerKey = 0,
}: {
  locale: "ar" | "en";
  triggerState?: GuideState;
  triggerKey?: number;
}) {
  const reduced = useReducedMotion() ?? false;
  const isAr = locale === "ar";
  const [stepIndex, setStepIndex] = useState(0);
  const activeStep = AUTO_BAR_STEPS[stepIndex];

  const movement = (amount: number) => {
    if (typeof window === "undefined") return amount;
    if (window.innerWidth < 420) return Math.round(amount * 0.3);
    if (window.innerWidth < 640) return Math.round(amount * 0.45);
    return amount;
  };

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % AUTO_BAR_STEPS.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (!triggerState || triggerKey === 0) return;
    const nextIndex = AUTO_BAR_STEPS.findIndex((step) => step.state === triggerState);
    if (nextIndex >= 0) setStepIndex(nextIndex);
  }, [triggerKey, triggerState]);

  return (
    <div className="fixed inset-x-0 top-14 z-40 border-b border-white/10 bg-[#101327]/94 shadow-xl shadow-black/25 backdrop-blur-xl sm:top-16">
      <div className="mx-auto grid h-[112px] max-w-7xl grid-cols-[minmax(104px,1fr)_minmax(0,2fr)] items-center gap-3 px-4 md:h-[104px] md:grid-cols-[minmax(210px,1fr)_minmax(0,2fr)] md:px-8">
        <div className="relative h-[88px] overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
          <motion.div
            className="absolute top-1/2"
            animate={
              reduced
                ? { x: 0, y: "-50%" }
                : {
                    x: isAr ? -movement(activeStep.x) : movement(activeStep.x),
                    y: "-50%",
                  }
            }
            transition={{ type: "spring", stiffness: 80, damping: 17 }}
            style={{ left: "50%" }}
          >
            <div className="-translate-x-1/2">
              <RealityFoxCharacter state={activeStep.sprite} size={76} />
            </div>
          </motion.div>
        </div>

        <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.045] px-4 py-3">
          <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-rose-200/70">
            <Sparkles className="h-3.5 w-3.5" />
            {isAr ? "دليل INSPIRE" : "INSPIRE Guide"}
          </div>
          <p className="line-clamp-2 text-[13.5px] leading-6 text-white/78 md:text-[14.5px]">
            {BAR_COPY[activeStep.state][locale]}
          </p>
        </div>
      </div>
    </div>
  );
}

function OptionButton({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[72px] w-full items-start gap-3 rounded-2xl border p-4 text-start transition ${
        selected
          ? "border-rose-300/45 bg-rose-400/12 text-white shadow-lg shadow-rose-950/20"
          : "border-white/10 bg-white/[0.035] text-white/68 hover:border-white/18 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? "border-rose-200 bg-rose-300 text-[#180915]"
            : "border-white/18 text-transparent"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
      <span className="text-[15px] leading-7">{children}</span>
    </button>
  );
}

export default function GuideCharacterDemo() {
  const [state, setState] = useState<GuideState>("waving");
  const [selected, setSelected] = useState<number | null>(null);
  const [barTrigger, setBarTrigger] = useState(0);
  const locale = useMemo<"ar" | "en">(() => (isArabicPath() ? "ar" : "en"), []);
  const isAr = locale === "ar";

  const options = isAr
    ? [
        "أبدأ بسرعة بنسخة أولى ثم أراجعها بعد أن أرى الشكل العملي.",
        "أفضل أن أفهم الصورة كاملة قبل أن أبدأ التنفيذ.",
        "أحتاج مثالاً واضحاً أو نموذجاً قبل اتخاذ القرار.",
        "أرتب الخطوات أولاً حتى لا يتشتت العمل أثناء التنفيذ.",
      ]
    : [
        "I start quickly with a first version, then review once I see it in practice.",
        "I prefer to understand the full picture before I begin execution.",
        "I need a clear example or model before deciding.",
        "I organize the steps first so execution does not become scattered.",
      ];

  const handleSelect = (index: number) => {
    setSelected(index);
    setState("review");
    setBarTrigger((current) => current + 1);
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#090b18] text-white">
      <AutoGuideBar
        locale={locale}
        triggerState={state}
        triggerKey={barTrigger}
      />

      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-40 md:px-8 md:pb-14 md:pt-44">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] font-semibold text-white/70">
              <MousePointerClick className="h-4 w-4 text-rose-300" />
              {isAr ? "تجربة شريط دليل INSPIRE" : "INSPIRE guide bar demo"}
            </div>
            <h1 className="text-3xl font-extrabold tracking-normal text-white md:text-5xl">
              {isAr ? "شريط متحرك تحت التنقل، بدون AI" : "A moving guide bar, without AI"}
            </h1>
            <p className="mt-4 text-[16px] leading-8 text-white/64 md:text-lg">
              {isAr
                ? "الجمل هنا محددة مسبقاً حسب trigger: بداية، انتظار، اختيار جواب، وإكمال جزء. لا يوجد API ولا ذكاء توليدي في هذه النسخة."
                : "Messages are predefined by trigger: start, waiting, answer selected, and section complete. No API or generative AI in this version."}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-7 text-white/64">
            {isAr
              ? "الشريط يتحرك تلقائياً. اختيار جواب يغيّر الرسالة بدون أزرار تحكم."
              : "The bar moves automatically. Selecting an answer changes the message without control buttons."}
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 md:p-7">
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-rose-300/20 bg-rose-400/10 px-3 py-1 text-[12px] font-bold text-rose-100">
                  {isAr ? "السؤال 6 من 21" : "Question 6 of 21"}
                </span>
                <span className="text-sm font-semibold text-white/50">29%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-300 to-teal-300"
                  animate={{ width: state === "complete" ? "36%" : "29%" }}
                />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-widest text-white/38">
                {isAr ? "طريقة بدء العمل" : "Starting style"}
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-10 text-white md:text-3xl">
                {isAr
                  ? "عندما تبدأ مشروعاً فيه غموض، ما الذي يحدث غالباً؟"
                  : "When you start a project with ambiguity, what usually happens?"}
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-white/58">
                {isAr
                  ? "اختر الأقرب لسلوكك الحقيقي في المشروع، حتى لو كان هناك أكثر من خيار مناسب."
                  : "Choose what is closest to your real behavior in the project, even if more than one option fits."}
              </p>
            </div>

            <div className="grid gap-3">
              {options.map((option, index) => (
                <OptionButton
                  key={option}
                  selected={selected === index}
                  onClick={() => handleSelect(index)}
                >
                  {option}
                </OptionButton>
              ))}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/[0.035] px-5 py-2.5 text-sm font-semibold text-white/64"
              >
                {isAr ? "السابق" : "Back"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setState("complete");
                  setBarTrigger((current) => current + 1);
                }}
                className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-950/30 disabled:opacity-50"
                disabled={selected === null}
              >
                {isAr ? "التالي" : "Next"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
