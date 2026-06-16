import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import fullWalkRight from "@/assets/inspire-guide-character/poses/cleaned/full-body/walk-right.webp";
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

const FULL_BODY_BY_POSE: Record<InspireGuidePose, string> = {
  listening: fullListening,
  speaking: fullWelcome,
  thinking: fullThinking,
  pointing: fullPointing,
  answer: fullTablet,
  bored: fullSeatedTablet,
  waiting: fullSeatedWaiting,
  welcome: fullWelcome,
  progress: fullTablet,
  celebrate: fullJumpCelebrate,
  walk: fullWalkLeft,
};

type AutoMotionPhase = {
  key: string;
  image: string;
  x: number;
  y: number;
  scale: number;
  duration: number;
  label: { ar: string; en: string };
  line: { ar: string; en: string };
  motion: "walk" | "idle" | "think" | "wait" | "happy" | "listen";
};

const AUTO_MOTION_PHASES: AutoMotionPhase[] = [
  {
    key: "walk-in",
    image: fullWalkRight,
    x: -280,
    y: 12,
    scale: 0.72,
    duration: 4200,
    motion: "walk",
    label: { ar: "مشي هادئ", en: "Calm walk" },
    line: {
      ar: "أتحرك معك داخل التجربة، بدون ما أقطع تركيزك.",
      en: "I move with the experience without interrupting your focus.",
    },
  },
  {
    key: "welcome-stop",
    image: fullWelcome,
    x: -120,
    y: 8,
    scale: 0.9,
    duration: 2600,
    motion: "listen",
    label: { ar: "ترحيب", en: "Welcome" },
    line: {
      ar: "ابدأ بهدوء. المطلوب تختار الأقرب لك، مش الإجابة المثالية.",
      en: "Start calmly. Choose what is closest to you, not the perfect answer.",
    },
  },
  {
    key: "walk-cross",
    image: fullWalkLeft,
    x: 250,
    y: 16,
    scale: 0.68,
    duration: 5000,
    motion: "walk",
    label: { ar: "تنقل داخل البار", en: "Moving through the bar" },
    line: {
      ar: "لما تنتقل بين الأسئلة، الحركة تظل ناعمة ومستمرة.",
      en: "Between questions, the motion stays soft and continuous.",
    },
  },
  {
    key: "thinking-stop",
    image: fullThinking,
    x: 92,
    y: 6,
    scale: 0.88,
    duration: 3100,
    motion: "think",
    label: { ar: "تفكير", en: "Thinking" },
    line: {
      ar: "لو السؤال يحتاج تفكير، هذا طبيعي. خذ لحظة قصيرة.",
      en: "If the question needs thought, that is normal. Take a short moment.",
    },
  },
  {
    key: "waiting",
    image: fullSeatedWaiting,
    x: -14,
    y: 18,
    scale: 0.86,
    duration: 3600,
    motion: "wait",
    label: { ar: "انتظار", en: "Waiting" },
    line: {
      ar: "أنا موجود هنا كمساعد خفيف، مش كنافذة مزعجة.",
      en: "I stay here as a light guide, not a noisy popup.",
    },
  },
  {
    key: "progress",
    image: fullTablet,
    x: 160,
    y: 6,
    scale: 0.88,
    duration: 3000,
    motion: "idle",
    label: { ar: "قراءة التقدم", en: "Reading progress" },
    line: {
      ar: "كل إجابة تضيف إشارة أوضح لطريقة عملك وتفكيرك.",
      en: "Every answer adds a clearer signal about your work style.",
    },
  },
  {
    key: "celebrate",
    image: fullJumpCelebrate,
    x: 18,
    y: -2,
    scale: 0.86,
    duration: 2500,
    motion: "happy",
    label: { ar: "تشجيع", en: "Encouragement" },
    line: {
      ar: "ممتاز. التقدم واضح، والنتيجة النهائية صارت أقرب لك.",
      en: "Good. Progress is clear, and the final result is closer to you.",
    },
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

function SvgCompanion({
  motionState,
  locale,
}: {
  motionState: AutoMotionPhase["motion"];
  locale: Locale;
}) {
  const reduced = useReducedMotion() ?? false;
  const isAr = locale === "ar";
  const isThinking = motionState === "think";
  const isWaiting = motionState === "wait";
  const isHappy = motionState === "happy";
  const isWalk = motionState === "walk";

  return (
    <motion.svg
      viewBox="0 0 120 120"
      className="h-[76px] w-[76px] overflow-visible drop-shadow-[0_14px_16px_rgba(0,0,0,0.35)]"
      role="img"
      aria-label={isAr ? "مساعد SVG تابع لشخصية INSPIRE" : "INSPIRE SVG companion"}
      animate={
        reduced
          ? undefined
          : {
              y: isWaiting ? [0, 4, 0] : isHappy ? [0, -8, 0] : [0, -4, 0],
              rotate: isThinking ? [-4, 4, -4] : isHappy ? [-8, 8, -8] : [-2, 2, -2],
            }
      }
      transition={{ duration: isHappy ? 1.1 : 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="companionShell" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff7ed" />
          <stop offset="0.58" stopColor="#dbeafe" />
          <stop offset="1" stopColor="#99f6e4" />
        </linearGradient>
        <linearGradient id="companionCore" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#fb7185" />
        </linearGradient>
        <filter id="companionGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.ellipse
        cx="60"
        cy="104"
        rx="24"
        ry="6"
        fill="#020617"
        opacity="0.28"
        animate={reduced ? undefined : { scaleX: isHappy ? [1, 0.75, 1] : [1, 0.88, 1] }}
        transition={{ duration: isHappy ? 1.1 : 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.g
        animate={reduced ? undefined : { scale: isHappy ? [1, 1.08, 1] : [1, 1.025, 1] }}
        transition={{ duration: isHappy ? 1.1 : 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="60" cy="56" r="40" fill="url(#companionShell)" />
        <circle cx="60" cy="56" r="31" fill="#0f172a" opacity="0.94" />
        <motion.circle
          cx="60"
          cy="56"
          r="44"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="52 28"
          animate={reduced ? undefined : { rotate: [0, 360], opacity: [0.32, 0.72, 0.32] }}
          transition={{ duration: isHappy ? 2.6 : 4.8, repeat: Infinity, ease: "linear" }}
          style={{ originX: "60px", originY: "56px" }}
        />
        <motion.circle
          cx="60"
          cy="56"
          r="37"
          stroke="#fb923c"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="18 42"
          animate={reduced ? undefined : { rotate: [360, 0], opacity: [0.24, 0.58, 0.24] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "linear" }}
          style={{ originX: "60px", originY: "56px" }}
        />
        <motion.circle
          cx="48"
          cy={isWaiting ? 58 : 54}
          r="5"
          fill="#67e8f9"
          filter="url(#companionGlow)"
          animate={reduced ? undefined : { x: isWalk ? [-3, 3, -3] : isThinking ? [0, 4, 0] : 0 }}
          transition={{ duration: isWalk ? 0.9 : 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="72"
          cy={isWaiting ? 58 : 54}
          r="5"
          fill="#67e8f9"
          filter="url(#companionGlow)"
          animate={reduced ? undefined : { x: isWalk ? [-3, 3, -3] : isThinking ? [-4, 0, -4] : 0 }}
          transition={{ duration: isWalk ? 0.9 : 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d={
            isWaiting
              ? "M51 67 C56 64, 64 64, 69 67"
              : isHappy
                ? "M49 65 C54 73, 66 73, 71 65"
                : "M50 67 C56 71, 64 71, 70 67"
          }
          stroke="#a7f3d0"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="60" cy="17" r="4" fill="url(#companionCore)" filter="url(#companionGlow)" />
      </motion.g>
    </motion.svg>
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

function HybridCompanionStage({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion() ?? false;
  const isAr = locale === "ar";
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = AUTO_MOTION_PHASES[phaseIndex];

  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => {
      setPhaseIndex((current) => (current + 1) % AUTO_MOTION_PHASES.length);
    }, phase.duration);
    return () => window.clearTimeout(id);
  }, [phase.duration, reduced]);

  const mainX = isAr ? -phase.x * 0.82 : phase.x * 0.82;
  const companionDrift = isAr ? -1 : 1;
  const companionX = companionDrift * (phaseIndex % 2 === 0 ? -180 : phase.motion === "happy" ? 205 : 150);
  const companionY = phase.motion === "wait" ? -112 : phase.motion === "happy" ? -132 : -124;

  return (
    <section className="rounded-[28px] border border-fuchsia-200/16 bg-fuchsia-400/[0.045] p-4 shadow-2xl shadow-black/20">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            {isAr ? "الخيار 5: الشخصية الأساسية مع مساعد SVG تابع" : "Option 5: main character with SVG companion"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-white/58">
            {isAr
              ? "PNG تبقى شخصية INSPIRE الرسمية، والـ SVG مساعد صغير يعطي حركة مستمرة حولها بدون أن يصبح شخصية ثانية مستقلة."
              : "The PNG stays the official INSPIRE character, while a small SVG companion adds continuous motion without becoming a second main character."}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/60">
          {phase.label[locale]}
        </span>
      </div>

      <div className="relative min-h-[360px] overflow-hidden rounded-[26px] border border-white/10 bg-[#0b0f1f] p-3 md:min-h-[276px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_28%,rgba(217,70,239,0.13),transparent_36%),radial-gradient(circle_at_58%_42%,rgba(45,212,191,0.12),transparent_34%)]" />
        <div className="absolute bottom-6 left-10 right-10 h-px bg-white/10" />

        <motion.div
          className="absolute left-1/2 top-20 z-10"
          animate={
            reduced
              ? undefined
              : {
                  x: [companionX, companionX + companionDrift * 34, companionX - companionDrift * 22, companionX],
                  y: [companionY, companionY - 16, companionY + 8, companionY],
                  scale: phase.motion === "happy" ? [0.88, 1, 0.88] : [0.82, 0.9, 0.82],
                }
          }
          transition={{
            duration: phase.motion === "happy" ? 3.2 : phase.motion === "walk" ? 4.8 : 5.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <SvgCompanion motionState={phase.motion} locale={locale} />
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 z-20 flex h-[240px] w-[210px] -translate-x-1/2 items-end justify-center md:h-[260px]"
          animate={reduced ? undefined : { x: mainX, y: phase.y, scale: phase.scale }}
          transition={{
            duration: phase.motion === "walk" ? phase.duration / 1000 : 1.05,
            ease: phase.motion === "walk" ? "linear" : [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className="absolute bottom-0 h-3 w-32 rounded-full bg-black/42 blur-md"
            animate={reduced ? undefined : { scaleX: phase.motion === "happy" ? [1, 0.74, 1] : [1, 0.9, 1] }}
            transition={{ duration: phase.motion === "happy" ? 1.15 : 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <AnimatePresence initial={false}>
            <motion.img
              key={`hybrid-${phase.key}`}
              src={phase.image}
              alt=""
              draggable={false}
              className="absolute bottom-0 max-h-[222px] object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.36)] md:max-h-[244px]"
              initial={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, scale: 1.02, filter: "blur(3px)" }}
              transition={{ duration: 0.78, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </motion.div>

        <motion.div
          className={`absolute bottom-4 z-30 max-w-[min(540px,calc(100%-32px))] rounded-[22px] border border-white/10 bg-white/[0.075] px-4 py-3 backdrop-blur ${
            isAr ? "right-4 md:right-8" : "left-4 md:left-8"
          }`}
          animate={reduced ? undefined : { y: [0, -2, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-fuchsia-100/75">
            <Sparkles className="h-3.5 w-3.5" />
            {isAr ? "ثنائي مساعد" : "Companion pair"}
          </div>
          <p className="text-[13.5px] leading-6 text-white/78">{phase.line[locale]}</p>
        </motion.div>
      </div>
    </section>
  );
}

function MinimalPresence({
  motionState,
  locale,
}: {
  motionState: AutoMotionPhase["motion"];
  locale: Locale;
}) {
  const reduced = useReducedMotion() ?? false;
  const isAr = locale === "ar";
  const isThinking = motionState === "think";
  const isWaiting = motionState === "wait";
  const isHappy = motionState === "happy";
  const isWalk = motionState === "walk";

  const eyeShift = isThinking ? 6 : isWalk ? 8 : isWaiting ? -5 : 0;
  const eyeY = isWaiting ? 2 : isHappy ? -2 : 0;
  const mouthPath = isWaiting
    ? "M77 120 C94 112 118 112 135 120"
    : isThinking
      ? "M81 120 C97 126 115 126 131 120"
      : isHappy
        ? "M76 116 C92 137 120 137 136 116"
        : "M78 120 C94 132 118 132 134 120";

  return (
    <motion.svg
      viewBox="0 0 212 164"
      className="h-[132px] w-[210px] overflow-visible"
      role="img"
      aria-label={isAr ? "واجهة INSPIRE ذكية بسيطة" : "Minimal INSPIRE smart presence"}
      animate={reduced ? undefined : { y: [0, -4, 0] }}
      transition={{ duration: isHappy ? 1.8 : 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id="presenceIris" cx="44%" cy="38%" r="62%">
          <stop stopColor="#bff8ff" />
          <stop offset="0.45" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#0f766e" />
        </radialGradient>
        <filter id="presenceGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.ellipse
        cx="106"
        cy="88"
        rx="88"
        ry="58"
        fill="#22d3ee"
        opacity="0.08"
        animate={reduced ? undefined : { scale: isHappy ? [1, 1.08, 1] : [1, 1.03, 1] }}
        transition={{ duration: isHappy ? 1.8 : 3.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.g
        animate={reduced ? undefined : { x: [0, eyeShift, eyeShift, 0], y: [0, eyeY, 0] }}
        transition={{ duration: isWalk ? 1.6 : isThinking ? 2.4 : 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.g
          animate={reduced ? undefined : { scaleY: [1, 0.1, 1] }}
          transition={{ duration: isWaiting ? 3.2 : 5.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.94, 1] }}
          style={{ originX: "70px", originY: "68px" }}
        >
          <ellipse cx="70" cy="68" rx="34" ry="25" fill="#f8fafc" opacity="0.96" />
          <circle cx="72" cy="68" r="17" fill="url(#presenceIris)" filter="url(#presenceGlow)" />
          <circle cx="76" cy="70" r="9.5" fill="#020617" />
          <circle cx="66" cy="59" r="5.2" fill="#ffffff" opacity="0.95" />
          <circle cx="81" cy="63" r="2.2" fill="#ffffff" opacity="0.75" />
        </motion.g>
        <motion.g
          animate={reduced ? undefined : { scaleY: [1, 0.1, 1] }}
          transition={{ duration: isWaiting ? 3.2 : 5.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.94, 1], delay: 0.05 }}
          style={{ originX: "142px", originY: "68px" }}
        >
          <ellipse cx="142" cy="68" rx="34" ry="25" fill="#f8fafc" opacity="0.96" />
          <circle cx="140" cy="68" r="17" fill="url(#presenceIris)" filter="url(#presenceGlow)" />
          <circle cx="136" cy="70" r="9.5" fill="#020617" />
          <circle cx="132" cy="59" r="5.2" fill="#ffffff" opacity="0.95" />
          <circle cx="147" cy="63" r="2.2" fill="#ffffff" opacity="0.75" />
        </motion.g>
      </motion.g>

      <motion.path
        d={mouthPath}
        stroke={isHappy ? "#fb923c" : "#a7f3d0"}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        filter="url(#presenceGlow)"
        animate={
          reduced
            ? undefined
            : motionState === "idle"
              ? { pathLength: [0.7, 1, 0.7] }
              : { opacity: [0.72, 1, 0.72] }
        }
        transition={{ duration: isHappy ? 1.4 : 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

function MinimalPresenceStage({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion() ?? false;
  const isAr = locale === "ar";
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = AUTO_MOTION_PHASES[phaseIndex];

  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => {
      setPhaseIndex((current) => (current + 1) % AUTO_MOTION_PHASES.length);
    }, Math.max(2600, phase.duration * 0.75));
    return () => window.clearTimeout(id);
  }, [phase.duration, reduced]);

  return (
    <section className="rounded-[28px] border border-cyan-200/16 bg-cyan-400/[0.045] p-4 shadow-2xl shadow-black/20">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            {isAr ? "الخيار 6: شاشة ذكية بسيطة" : "Option 6: minimal smart screen"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-white/58">
            {isAr
              ? "بدون شخصية كرتونية: حضور ذكي خفيف من عيون وفم فقط، مناسب أكثر لموقع رسمي وهادئ."
              : "No cartoon character: a light smart presence made only of eyes and mouth, better suited for a calm product interface."}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/60">
          {phase.label[locale]}
        </span>
      </div>

      <div className="grid min-h-[260px] grid-cols-1 items-center gap-4 rounded-[26px] border border-white/10 bg-[#0b0f1f] p-4 md:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.4fr)]">
        <div className="relative flex min-h-[190px] items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,0.16),transparent_42%)]" />
          <MinimalPresence motionState={phase.motion} locale={locale} />
        </div>
        <motion.div
          className="rounded-[24px] border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur"
          animate={reduced ? undefined : { y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-cyan-100/75">
            <Sparkles className="h-3.5 w-3.5" />
            {isAr ? "حضور ذكي" : "Smart presence"}
          </div>
          <p className="text-[16px] leading-8 text-white/78">{phase.line[locale]}</p>
        </motion.div>
      </div>
    </section>
  );
}

function DepthMotionStage({
  scenario,
  locale,
}: {
  scenario: Scenario;
  locale: Locale;
}) {
  const reduced = useReducedMotion() ?? false;
  const isAr = locale === "ar";
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = AUTO_MOTION_PHASES[phaseIndex];
  const closeKeys = new Set(["welcome-stop"]);
  const farKeys = new Set(["walk-in", "walk-cross"]);
  const isClose = closeKeys.has(phase.key);
  const isFar = farKeys.has(phase.key);
  const signedX = isAr ? -phase.x : phase.x;
  const direction = isAr ? -1 : 1;
  const bubbleVisible = phase.motion !== "walk" || phaseIndex % 2 === 0;
  const characterHeightClass = isClose ? "h-[190px] md:h-[208px]" : "h-[230px] md:h-[252px]";
  const characterMaxHeightClass = isClose ? "max-h-[178px] md:max-h-[196px]" : "max-h-[212px] md:max-h-[236px]";

  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => {
      setPhaseIndex((current) => (current + 1) % AUTO_MOTION_PHASES.length);
    }, phase.duration);
    return () => window.clearTimeout(id);
  }, [phase.duration, reduced]);

  const microMotion = reduced
    ? undefined
    : phase.motion === "walk"
      ? { y: [0, -5, 0], rotate: [-0.8, 0.8, -0.8] }
      : phase.motion === "happy"
        ? { y: [0, -12, 0], rotate: [0, -2, 2, 0], scale: [1, 1.035, 1] }
        : phase.motion === "think"
          ? { y: [0, -2, 0], rotate: [-1.2, 1.2, -1.2] }
          : phase.motion === "wait"
            ? { y: [0, 3, 0], rotate: [0, -0.8, 0.8, 0] }
            : { y: [0, -3, 0] };

  return (
    <section className="rounded-[28px] border border-teal-200/18 bg-teal-300/[0.045] p-4 shadow-2xl shadow-black/20">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            {isAr ? "الخيار 4: نسخة React بحركة مستمرة قدر الإمكان" : "Option 4: React motion prototype with continuous movement"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-white/58">
            {isAr
              ? "هذه أفضل تجربة ممكنة بالصور الحالية: حركة تلقائية داخل المساحة، توقفات ذات معنى، وتنفس بصري خفيف. ما زالت ليست Rig حقيقي مثل Rive."
              : "This is the best practical version with current images: automatic motion, meaningful pauses, and subtle life. It is still not a true Rive rig."}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/60">
          {phase.label[locale]}
        </span>
      </div>

      <div className="relative min-h-[380px] overflow-hidden rounded-[26px] border border-white/10 bg-[#0c1021] p-3 md:min-h-[292px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(45,212,191,0.14),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.03),transparent_28%,transparent_72%,rgba(255,255,255,0.03))]" />
        <div className="absolute bottom-10 left-8 right-8 h-px bg-cyan-100/10" />
        <div className="absolute bottom-20 left-16 right-16 h-px bg-cyan-100/7" />
        <div className="absolute bottom-4 left-1/2 h-24 w-[72%] -translate-x-1/2 rounded-[50%] bg-black/28 blur-2xl" />

        <motion.div
          className="absolute left-1/2 top-10 z-10 h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_20px_rgba(103,232,249,0.75)]"
          animate={reduced ? undefined : { x: [-180, 180, -180], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className={`absolute bottom-7 left-1/2 z-20 flex w-[190px] -translate-x-1/2 items-end justify-center md:w-[220px] ${characterHeightClass}`}
          animate={
            reduced
              ? undefined
              : {
                  x: signedX,
                  y: phase.y,
                  scale: phase.scale,
                }
          }
          transition={{
            duration: phase.motion === "walk" ? phase.duration / 1000 : 1.05,
            ease: phase.motion === "walk" ? "linear" : [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className="absolute bottom-0 h-3 w-28 rounded-full bg-black/38 blur-md"
            animate={reduced ? undefined : { scaleX: phase.motion === "happy" ? [1, 0.72, 1] : [1, 0.9, 1] }}
            transition={{ duration: phase.motion === "happy" ? 1.25 : 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="relative z-10 flex h-full w-full items-end justify-center"
            animate={microMotion}
            transition={{
              duration: phase.motion === "walk" ? 0.72 : phase.motion === "happy" ? 1.15 : phase.motion === "wait" ? 2.9 : 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={phase.key}
                src={phase.image}
                alt=""
                draggable={false}
                className={`absolute bottom-0 object-contain drop-shadow-[0_22px_22px_rgba(0,0,0,0.34)] ${characterMaxHeightClass}`}
                initial={{
                  opacity: 0,
                  scale: 0.98,
                  y: phase.motion === "walk" ? 4 : 12,
                  filter: "blur(3px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  scale: 1.02,
                  y: phase.motion === "walk" ? -4 : -10,
                  filter: "blur(3px)",
                }}
                transition={{
                  opacity: { duration: 0.82, ease: "easeInOut" },
                  scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  filter: { duration: 0.62, ease: "easeOut" },
                }}
              />
            </AnimatePresence>
            {!reduced && phase.motion === "walk" ? (
              <motion.div
                className="absolute bottom-3 h-1.5 w-10 rounded-full bg-cyan-200/24 blur-sm"
                animate={{ x: [direction * 28, direction * -30, direction * 28], opacity: [0.15, 0.42, 0.15] }}
                transition={{ duration: 0.72, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : null}
          </motion.div>
        </motion.div>

        <motion.div
          className={`absolute z-30 max-w-[min(520px,calc(100%-32px))] rounded-[22px] border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur ${
            isAr ? "right-4 md:right-8" : "left-4 md:left-8"
          } bottom-4`}
          animate={
            reduced
              ? undefined
              : {
                  opacity: bubbleVisible ? 1 : 0.68,
                  y: bubbleVisible ? 0 : 5,
                }
          }
          transition={{ duration: 0.35 }}
        >
          <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-cyan-100/75">
            <Sparkles className="h-3.5 w-3.5" />
            {isAr ? "حالة العمق" : "Depth state"}
          </div>
          <p className="text-[13.5px] leading-6 text-white/78">
            {phase.line[locale]}
          </p>
        </motion.div>
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

          <DepthMotionStage scenario={scenario} locale={locale} />

          <HybridCompanionStage locale={locale} />

          <MinimalPresenceStage locale={locale} />

          <FullBodyPoseGallery locale={locale} />

          <RiveReadinessCard locale={locale} />
        </div>
      </div>
    </div>
  );
}
