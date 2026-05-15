import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Play, Sparkles, TimerReset } from "lucide-react";
import {
  RealityFoxCharacter,
  type GuideState,
} from "@/components/guide-character/GuideCharacterDemo";
import poseAnswer from "@/assets/inspire-guide-character/poses/cleaned/half-body/answer-received.webp";
import poseBored from "@/assets/inspire-guide-character/poses/cleaned/half-body/bored-polite.webp";
import poseCelebrate from "@/assets/inspire-guide-character/poses/cleaned/half-body/completion-celebration.webp";
import poseIdle from "@/assets/inspire-guide-character/poses/cleaned/half-body/idle.webp";
import posePointing from "@/assets/inspire-guide-character/poses/cleaned/half-body/pointing-hint.webp";
import poseProgress from "@/assets/inspire-guide-character/poses/cleaned/half-body/progress-encouragement.webp";
import poseSpeaking from "@/assets/inspire-guide-character/poses/cleaned/half-body/speaking.webp";
import poseThinking from "@/assets/inspire-guide-character/poses/cleaned/half-body/thinking.webp";
import poseWaiting from "@/assets/inspire-guide-character/poses/cleaned/half-body/waiting.webp";
import poseWelcome from "@/assets/inspire-guide-character/poses/cleaned/half-body/welcome-wave.webp";
import fullJumpCelebrate from "@/assets/inspire-guide-character/poses/cleaned/full-body/jump-celebration.webp";
import fullListening from "@/assets/inspire-guide-character/poses/cleaned/full-body/listening-standing.webp";
import fullPointing from "@/assets/inspire-guide-character/poses/cleaned/full-body/pointing-standing.webp";
import fullSeatedTablet from "@/assets/inspire-guide-character/poses/cleaned/full-body/seated-tablet.webp";
import fullSeatedWaiting from "@/assets/inspire-guide-character/poses/cleaned/full-body/seated-waiting-platform.webp";
import fullTablet from "@/assets/inspire-guide-character/poses/cleaned/full-body/tablet-standing.webp";
import fullThinking from "@/assets/inspire-guide-character/poses/cleaned/full-body/thinking-standing.webp";
import fullWalkLeft from "@/assets/inspire-guide-character/poses/cleaned/full-body/walk-left.webp";
import fullWelcome from "@/assets/inspire-guide-character/poses/cleaned/full-body/welcome-standing.webp";

type Locale = "ar" | "en";
type LabMood = GuideState | "thinking" | "bored" | "walk";
type InspireGuidePose =
  | "listening"
  | "speaking"
  | "thinking"
  | "pointing"
  | "answer"
  | "bored"
  | "waiting"
  | "welcome"
  | "progress"
  | "celebrate"
  | "walk";

interface Scenario {
  key: string;
  mood: LabMood;
  inspirePose: InspireGuidePose;
  sprite: GuideState | "runningRight" | "runningLeft";
  x: number;
  title: { ar: string; en: string };
  line: { ar: string; en: string };
}

const SCENARIOS: Scenario[] = [
  {
    key: "landing",
    mood: "waving",
    inspirePose: "welcome",
    sprite: "waving",
    x: 126,
    title: { ar: "الصفحة الرئيسية", en: "Landing" },
    line: {
      ar: "أهلاً. الفكرة بسيطة: نساعدك تبني تعليمات تجعل AI أقرب لطريقتك.",
      en: "Hi. The idea is simple: build instructions that make AI closer to your way of working.",
    },
  },
  {
    key: "question",
    mood: "walk",
    inspirePose: "pointing",
    sprite: "runningLeft",
    x: -98,
    title: { ar: "أثناء الأسئلة", en: "Questions" },
    line: {
      ar: "اختر الأقرب لسلوكك الحقيقي. ليس مطلوباً أن يكون الجواب مثالياً.",
      en: "Choose what is closest to your real behavior. It does not need to be perfect.",
    },
  },
  {
    key: "idle",
    mood: "thinking",
    inspirePose: "thinking",
    sprite: "waiting",
    x: -18,
    title: { ar: "توقف طويل", en: "Long pause" },
    line: {
      ar: "خذ وقتك. هذا النوع من الأسئلة طبيعي يحتاج لحظة تفكير.",
      en: "Take your time. This kind of question naturally needs a moment.",
    },
  },
  {
    key: "bored",
    mood: "bored",
    inspirePose: "bored",
    sprite: "waiting",
    x: 88,
    title: { ar: "ملل أو بطء", en: "Fatigue" },
    line: {
      ar: "لو حسيت السؤال ثقيل، اختصرها: أي خيار يتكرر معك أكثر في العمل؟",
      en: "If it feels heavy, simplify it: which option happens most often in your work?",
    },
  },
  {
    key: "answer",
    mood: "review",
    inspirePose: "answer",
    sprite: "review",
    x: -124,
    title: { ar: "بعد اختيار جواب", en: "Answer selected" },
    line: {
      ar: "تمام. هذا الاختيار يعطينا إشارة أوضح عن طريقة تعاملك مع المشاريع.",
      en: "Good. This choice gives a clearer signal about how you handle projects.",
    },
  },
  {
    key: "complete",
    mood: "complete",
    inspirePose: "celebrate",
    sprite: "complete",
    x: 24,
    title: { ar: "تقدم واضح", en: "Progress" },
    line: {
      ar: "اقتربنا. كل إجابة الآن تجعل التعليمات النهائية أدق وأكثر فائدة.",
      en: "Almost there. Every answer now makes the final instructions sharper.",
    },
  },
];

const HALF_BODY_POSES: Record<InspireGuidePose, string> = {
  listening: poseIdle,
  speaking: poseSpeaking,
  thinking: poseThinking,
  pointing: posePointing,
  answer: poseAnswer,
  bored: poseBored,
  waiting: poseWaiting,
  welcome: poseWelcome,
  progress: poseProgress,
  celebrate: poseCelebrate,
  walk: posePointing,
};

const FULL_BODY_POSES = [
  {
    key: "welcome",
    image: fullWelcome,
    label: { ar: "ترحيب", en: "Welcome" },
  },
  {
    key: "question",
    image: fullPointing,
    label: { ar: "تلميح للسؤال", en: "Question hint" },
  },
  {
    key: "thinking",
    image: fullThinking,
    label: { ar: "تفكير", en: "Thinking" },
  },
  {
    key: "waiting",
    image: fullSeatedWaiting,
    label: { ar: "انتظار", en: "Waiting" },
  },
  {
    key: "tablet",
    image: fullTablet,
    label: { ar: "قراءة التقدم", en: "Reading progress" },
  },
  {
    key: "walk",
    image: fullWalkLeft,
    label: { ar: "مشي", en: "Walking" },
  },
  {
    key: "celebrate",
    image: fullJumpCelebrate,
    label: { ar: "احتفال", en: "Celebration" },
  },
  {
    key: "seated-tablet",
    image: fullSeatedTablet,
    label: { ar: "مراجعة هادئة", en: "Calm review" },
  },
  {
    key: "listening",
    image: fullListening,
    label: { ar: "استماع", en: "Listening" },
  },
];

function isArabicPath() {
  return window.location.pathname.startsWith("/ar");
}

function movement(amount: number) {
  if (typeof window === "undefined") return amount;
  if (window.innerWidth < 420) return Math.round(amount * 0.3);
  if (window.innerWidth < 640) return Math.round(amount * 0.45);
  return amount;
}

function SvgGuideCharacter({ mood }: { mood: LabMood }) {
  const reduced = useReducedMotion() ?? false;
  const activeWalk = mood === "walk";
  const thinking = mood === "thinking";
  const bored = mood === "bored";
  const complete = mood === "complete";

  const legAnim = reduced
    ? undefined
    : activeWalk
      ? { rotate: [-16, 16, -16] }
      : bored
        ? { rotate: [0, 4, 0] }
        : { rotate: [0, -3, 0] };
  const armAnim = reduced
    ? undefined
    : thinking
      ? { rotate: [-18, -34, -18] }
      : bored
        ? { rotate: [-8, -28, -8] }
        : complete
          ? { rotate: [-18, -72, -18] }
          : { rotate: [-10, 12, -10] };

  return (
    <motion.svg
      viewBox="0 0 220 160"
      className="h-[92px] w-[126px] overflow-visible drop-shadow-[0_18px_22px_rgba(0,0,0,0.38)]"
      role="img"
      aria-label="INSPIRE motion guide concept"
      animate={reduced ? undefined : { y: [0, -3, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="guideCore" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#fb7185" />
          <stop offset="0.55" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
        <linearGradient id="guideSuit" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#f8fafc" />
          <stop offset="1" stopColor="#c7d2fe" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="143" rx="48" ry="9" fill="rgba(0,0,0,0.28)" />
      <motion.g
        animate={
          reduced
            ? undefined
            : bored
              ? { rotate: [-2, 2, -2] }
              : { rotate: [0, 1.5, 0] }
        }
        transition={{ duration: bored ? 1.6 : 3, repeat: Infinity }}
        style={{ originX: "110px", originY: "82px" }}
      >
        <rect x="75" y="58" width="70" height="62" rx="28" fill="url(#guideSuit)" />
        <rect x="84" y="66" width="52" height="36" rx="18" fill="#111827" opacity="0.92" />
        <motion.circle
          cx="101"
          cy="84"
          r="4"
          fill={thinking ? "#fbbf24" : "#fda4af"}
          animate={reduced ? undefined : { scaleY: [1, 0.18, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.92, 1] }}
        />
        <motion.circle
          cx="120"
          cy="84"
          r="4"
          fill={thinking ? "#fbbf24" : "#fda4af"}
          animate={reduced ? undefined : { scaleY: [1, 0.18, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.92, 1] }}
        />
        <path
          d={bored ? "M100 95 Q110 90 122 95" : "M100 94 Q110 101 122 94"}
          stroke="#f8fafc"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <circle cx="110" cy="113" r="10" fill="url(#guideCore)" />
      </motion.g>

      <motion.g
        animate={armAnim}
        transition={{ duration: activeWalk ? 0.72 : 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "78px", originY: "76px" }}
      >
        <path d="M80 78 C60 86 56 102 64 116" stroke="#e0e7ff" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="64" cy="116" r="7" fill="#fb7185" />
      </motion.g>
      <motion.g
        animate={armAnim}
        transition={{ duration: activeWalk ? 0.72 : 2.4, repeat: Infinity, ease: "easeInOut", delay: activeWalk ? 0.35 : 0.2 }}
        style={{ originX: "142px", originY: "76px" }}
      >
        <path d="M140 78 C162 86 166 102 156 116" stroke="#e0e7ff" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="156" cy="116" r="7" fill="#2dd4bf" />
      </motion.g>
      <motion.g
        animate={legAnim}
        transition={{ duration: activeWalk ? 0.62 : 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "94px", originY: "117px" }}
      >
        <path d="M95 116 C91 128 88 137 82 144" stroke="#c7d2fe" strokeWidth="12" strokeLinecap="round" fill="none" />
      </motion.g>
      <motion.g
        animate={legAnim}
        transition={{ duration: activeWalk ? 0.62 : 2.2, repeat: Infinity, ease: "easeInOut", delay: activeWalk ? 0.31 : 0.15 }}
        style={{ originX: "126px", originY: "117px" }}
      >
        <path d="M125 116 C129 128 132 137 138 144" stroke="#c7d2fe" strokeWidth="12" strokeLinecap="round" fill="none" />
      </motion.g>
      {thinking && (
        <motion.circle
          cx="152"
          cy="42"
          r="5"
          fill="#fbbf24"
          animate={reduced ? undefined : { opacity: [0.35, 1, 0.35], y: [0, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}
    </motion.svg>
  );
}

function InspireGuideCharacter({ pose }: { pose: InspireGuidePose }) {
  const reduced = useReducedMotion() ?? false;
  const isWalk = pose === "walk";
  const isThinking = pose === "thinking";
  const isCelebrate = pose === "celebrate";
  const isListening = pose === "listening";
  const poseImage = HALF_BODY_POSES[pose];

  return (
    <motion.div
      role="img"
      aria-label="INSPIRE guide character prototype"
      className="relative flex h-[92px] w-[156px] items-end justify-center overflow-visible drop-shadow-[0_18px_22px_rgba(0,0,0,0.36)]"
      animate={
        reduced
          ? undefined
          : isWalk
            ? { x: [-8, 8, -8], y: [0, -2, 0] }
            : isCelebrate
              ? { y: [0, -8, 0], rotate: [0, -2, 2, 0] }
              : isListening
                ? { rotate: [0, -1.5, 0] }
                : { y: [0, -3, 0] }
      }
      transition={{
        duration: isWalk ? 1.6 : isCelebrate ? 1.2 : 2.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="absolute bottom-0 h-2.5 w-24 rounded-full bg-black/35 blur-sm" />
      <motion.div
        animate={reduced ? undefined : isThinking ? { rotate: [-2, 2, -2] } : undefined}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex h-[94px] w-[142px] items-end justify-center overflow-visible"
      >
        <img
          src={poseImage}
          alt=""
          className="max-h-[106px] max-w-[150px] object-contain"
          draggable={false}
        />
      </motion.div>
      {isThinking && (
        <motion.span
          className="absolute right-6 top-2 z-20 h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_18px_rgba(253,230,138,0.8)]"
          animate={reduced ? undefined : { y: [0, -8, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {isCelebrate && (
        <motion.span
          className="absolute left-8 top-1 z-20 h-2 w-2 rounded-full bg-teal-200 shadow-[0_0_18px_rgba(94,234,212,0.8)]"
          animate={reduced ? undefined : { scale: [0.8, 1.5, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}

function MotionBar({
  title,
  scenario,
  locale,
  children,
}: {
  title: string;
  scenario: Scenario;
  locale: Locale;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  const isAr = locale === "ar";

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/55">
          {scenario.title[locale]}
        </span>
      </div>
      <div className="grid min-h-[190px] grid-cols-1 items-center gap-3 rounded-[24px] border border-white/10 bg-[#101327]/94 p-3 md:min-h-[118px] md:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)]">
        <div className="relative h-[92px] overflow-hidden rounded-[22px] border border-white/10 bg-black/25">
          <motion.div
            className="absolute top-1/2"
            animate={
              reduced
                ? { x: 0, y: "-50%" }
                : { x: isAr ? -movement(scenario.x) : movement(scenario.x), y: "-50%" }
            }
            transition={{ type: "spring", stiffness: 76, damping: 17 }}
            style={{ left: "50%" }}
          >
            <div className="-translate-x-1/2">{children}</div>
          </motion.div>
        </div>
        <div className="min-w-0 rounded-[22px] border border-white/10 bg-white/[0.045] px-4 py-3">
          <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-rose-200/70">
            <Sparkles className="h-3.5 w-3.5" />
            {isAr ? "دليل INSPIRE" : "INSPIRE Guide"}
          </div>
          <p className="line-clamp-3 text-[13.5px] leading-6 text-white/78 md:text-[14.5px]">
            {scenario.line[locale]}
          </p>
        </div>
      </div>
    </section>
  );
}

function RiveReadinessCard({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";

  return (
    <section className="rounded-[28px] border border-amber-200/18 bg-amber-400/[0.055] p-5">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-black/20 px-3 py-1 text-xs font-bold text-amber-100">
        <TimerReset className="h-3.5 w-3.5" />
        {isAr ? "Rive / Lottie جاهز للتجربة التالية" : "Rive / Lottie ready for the next trial"}
      </div>
      <h2 className="text-xl font-bold text-white">
        {isAr ? "أفضل خيار للحركة الواقعية يحتاج ملف حركة احترافي" : "The best realistic motion path needs a proper animation file"}
      </h2>
      <p className="mt-3 text-[14.5px] leading-7 text-white/68">
        {isAr
          ? "Rive أقوى من SVG للحالات المعقدة مثل انتظار المستخدم، الملل الخفيف، التفكير، والاحتفال. لكن لا يكفي أن نضيف المكتبة فقط؛ نحتاج ملف .riv أو Lottie مصمم للشخصية حتى تكون النتيجة راقية وليست شكل تجريبي."
          : "Rive is stronger than SVG for complex states like waiting, light fatigue, thinking, and celebrating. But adding the library is not enough; we need a designed .riv or Lottie file so the result feels polished rather than experimental."}
      </p>
      <div className="mt-4 grid gap-2 text-sm text-white/72 md:grid-cols-3">
        {(isAr
          ? ["State machine للحالات", "انتقالات أنعم", "حجم أخف من sprite كبير غالباً"]
          : ["State machine support", "Smoother transitions", "Often lighter than a large sprite"]
        ).map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/18 px-3 py-2">
            <Check className="h-4 w-4 text-emerald-300" />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function FullBodyPoseGallery({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";

  return (
    <section className="rounded-[28px] border border-cyan-200/14 bg-cyan-300/[0.045] p-5">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            {isAr ? "حالات الجسم الكامل للشخصية الجديدة" : "Full-body states for the new guide"}
          </h2>
          <p className="mt-2 text-[14.5px] leading-7 text-white/62">
            {isAr
              ? "هذه الصور تعرض الاتجاه الحقيقي للشخصية قبل تحويلها لاحقاً إلى Rive أو Lottie. الآن هي مناسبة للاختبار البصري والحركة الخفيفة داخل الموقع."
              : "These assets show the real character direction before converting it to Rive or Lottie later. For now, they are useful for visual testing and light site motion."}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-cyan-100/80">
          {isAr ? "تجربة فقط" : "Prototype only"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {FULL_BODY_POSES.map((pose, poseIndex) => (
          <motion.div
            key={pose.key}
            className="flex min-h-[210px] flex-col items-center justify-end rounded-[22px] border border-white/10 bg-black/20 p-3"
            animate={{ y: [0, poseIndex % 2 === 0 ? -4 : -2, 0] }}
            transition={{
              duration: 2.8 + (poseIndex % 3) * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex h-[170px] w-full items-end justify-center overflow-visible">
              <img
                src={pose.image}
                alt=""
                className="max-h-[176px] max-w-full object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.28)]"
                draggable={false}
              />
            </div>
            <div className="mt-2 w-full rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-center text-xs font-bold text-white/70">
              {pose.label[locale]}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function GuideCharacterMotionLab() {
  const locale = useMemo<Locale>(() => (isArabicPath() ? "ar" : "en"), []);
  const isAr = locale === "ar";
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const scenario = SCENARIOS[index];

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % SCENARIOS.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#090b18] text-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="mb-8 max-w-4xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] font-semibold text-white/70">
            <Play className="h-4 w-4 text-rose-300" />
            {isAr ? "مختبر حركة شخصية INSPIRE" : "INSPIRE character motion lab"}
          </div>
          <h1 className="text-3xl font-extrabold tracking-normal text-white md:text-5xl">
            {isAr ? "نقارن الحركة قبل اعتماد الشخصية" : "Compare motion before choosing the guide"}
          </h1>
          <p className="mt-4 text-[16px] leading-8 text-white/64 md:text-lg">
            {isAr
              ? "هذه صفحة تجربة فقط. تقارن الشخصية الحالية مع شخصية SVG محسّنة، وتحدد متطلبات Rive/Lottie قبل إدخال مكتبة جديدة أو ملف حركة احترافي."
              : "This is a trial page only. It compares the current sprite with an improved SVG rig and defines what Rive/Lottie needs before adding a new library or professional motion file."}
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {SCENARIOS.map((item, itemIndex) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                itemIndex === index
                  ? "border-rose-300/45 bg-rose-400/15 text-white"
                  : "border-white/10 bg-white/[0.035] text-white/62 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              {item.title[locale]}
            </button>
          ))}
        </div>

        <div className="grid gap-5">
          <MotionBar title={isAr ? "الخيار 1: الشخصية الحالية Sprite" : "Option 1: current sprite"} scenario={scenario} locale={locale}>
            <RealityFoxCharacter state={scenario.sprite} size={76} />
          </MotionBar>

          <MotionBar title={isAr ? "الخيار 2: شخصية SVG قابلة للتحريك" : "Option 2: animatable SVG rig"} scenario={scenario} locale={locale}>
            <SvgGuideCharacter mood={scenario.mood} />
          </MotionBar>

          <MotionBar title={isAr ? "الخيار 3: شخصية INSPIRE الجديدة" : "Option 3: new INSPIRE guide"} scenario={scenario} locale={locale}>
            <InspireGuideCharacter pose={scenario.inspirePose} />
          </MotionBar>

          <FullBodyPoseGallery locale={locale} />

          <RiveReadinessCard locale={locale} />
        </div>
      </div>
    </div>
  );
}
