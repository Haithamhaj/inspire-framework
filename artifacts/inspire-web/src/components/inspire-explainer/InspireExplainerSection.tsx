import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n";

const SCENE1_END = 5000;
const SCENE2_END = 11000;
const TOTAL = 18000;
const CARD_DELAYS = [5300, 6400, 7500, 8600, 9700];
const CANVAS_W = 1280;
const CANVAS_H = 720;

const content = {
  ar: {
    dir: "rtl" as const,
    userPrompt: "ساعدني أرتب مشروعي",
    genericResponse:
      "بالطبع! يمكنني مساعدتك في ترتيب مشروعك. ما هي تفاصيل المشروع؟ هل تريد قائمة مهام أم جدولًا زمنيًا؟",
    scene1Caption: "طلب واضح… لكن بدون تعليمات مخصصة",
    scene2Title: "تعليمات INSPIRE المخصصة",
    cards: [
      { letter: "I", label: "الدور", values: ["مستشار استراتيجي", "محلل أعمال", "مدير مشاريع"], final: "مدير مشاريع" },
      { letter: "N", label: "الأسلوب", values: ["إبداعي مرن", "منطقي منظّم", "دقيق ومنظّم"], final: "دقيق ومنظّم" },
      { letter: "S", label: "المخرجات", values: ["تقارير مفصّلة", "قوائم منظّمة", "خطوات عملية"], final: "خطوات عملية" },
      { letter: "P", label: "الحدود", values: ["لا تفترض السياق", "بدون اقتراحات", "ركّز على الهدف"], final: "ركّز على الهدف" },
      { letter: "I", label: "طريقة التفكير", values: ["من الأكبر للأصغر", "بدءًا من الأولويات", "خطوة بخطوة"], final: "خطوة بخطوة" },
    ],
    scene3Caption: "نفس الطلب… بسياق أوضح",
    structuredTitle: "خطة تنظيم مشروعك",
    bullets: [
      "تحديد أهداف المشروع والنتائج المتوقعة",
      "تقسيم العمل إلى مراحل قابلة للقياس",
      "توزيع المهام وفق الأولويات والمواعيد",
    ],
    nextStep: "الخطوة التالية: مراجعة المرحلة الأولى بحلول الجمعة",
    cta: "احصل على تعليماتك الآن",
    sceneLabel: (s: 1 | 2 | 3) =>
      s === 1 ? "بدون تعليمات مخصصة" : s === 2 ? "جارٍ بناء التعليمات…" : "التعليمات نشطة",
  },
  en: {
    dir: "ltr" as const,
    userPrompt: "Help me organize my project",
    genericResponse:
      "Sure! I can help you organize your project. What are the details? Would you like a task list or a timeline?",
    scene1Caption: "A clear request… but without personalized instructions",
    scene2Title: "Personalized INSPIRE Instructions",
    cards: [
      { letter: "I", label: "Role", values: ["Strategic Advisor", "Business Analyst", "Project Manager"], final: "Project Manager" },
      { letter: "N", label: "Style", values: ["Creative & Flexible", "Structured Logic", "Analytical"], final: "Analytical" },
      { letter: "S", label: "Output", values: ["Detailed Reports", "Structured Lists", "Action Steps"], final: "Action Steps" },
      { letter: "P", label: "Boundaries", values: ["Don't assume context", "No suggestions", "Stay on target"], final: "Stay on target" },
      { letter: "I", label: "Thinking", values: ["Top-down", "Priority-first", "Step by step"], final: "Step by step" },
    ],
    scene3Caption: "Same request… with clearer context",
    structuredTitle: "Project Organization Plan",
    bullets: [
      "Define project goals and expected outcomes",
      "Break work into measurable phases",
      "Assign tasks by priority and deadline",
    ],
    nextStep: "Next step: Review Phase 1 by Friday",
    cta: "Get Your Instructions Now",
    sceneLabel: (s: 1 | 2 | 3) =>
      s === 1 ? "no personalized instructions" : s === 2 ? "building instructions…" : "instructions active",
  },
};

function TypingText({ text, speed = 60, seed }: { text: string; speed?: number; seed: number }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShown("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, seed]);
  return (
    <span>
      {shown}
      <span className="inline-block w-[2px] h-[1em] bg-rose-400 mx-0.5 align-middle animate-pulse" />
    </span>
  );
}

function CyclingValue({ values, final, active, seed }: { values: string[]; final: string; active: boolean; seed: number }) {
  const [val, setVal] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVal("");
    setDone(false);
    if (!active) return;
    let i = 0;
    setVal(values[0]);
    const iv = setInterval(() => {
      i++;
      if (i >= values.length) { clearInterval(iv); setVal(final); setDone(true); }
      else setVal(values[i]);
    }, 680);
    return () => clearInterval(iv);
  }, [active, seed, values, final]);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={val + seed}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.15 }}
        className={done ? "text-orange-300 font-bold" : "text-violet-300 font-medium"}
      >
        {val}
      </motion.span>
    </AnimatePresence>
  );
}

function Glass({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 ${className}`}
      style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(18px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.4)", ...style }}
    >
      {children}
    </div>
  );
}

function TitleBar({ label, glow = false }: { label: string; glow?: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.08] flex-shrink-0"
      style={{ background: glow ? "rgba(225,29,72,0.06)" : "rgba(255,255,255,0.02)" }}
    >
      <div className="w-3 h-3 rounded-full bg-rose-500/70" />
      <div className="w-3 h-3 rounded-full bg-orange-400/70" />
      <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
      <span className="text-white/35 text-[13px] font-mono mx-auto">{label}</span>
    </div>
  );
}

function useScaledCanvas(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setScale(w / CANVAS_W);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return scale;
}

export function InspireExplainerSection() {
  const { locale } = useI18n();
  const lang = locale === "en" ? "en" : "ar";
  const c = content[lang];
  const dir = c.dir;

  const [loopKey, setLoopKey] = useState(0);
  const [scene, setScene] = useState<1 | 2 | 3>(1);
  const [activeCard, setActiveCard] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scale = useScaledCanvas(wrapperRef);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScene(1);
    setActiveCard(-1);

    const at = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };

    at(() => setScene(2), SCENE1_END);
    CARD_DELAYS.forEach((ms, i) => at(() => setActiveCard(i), ms));
    at(() => setScene(3), SCENE2_END);
    at(() => setLoopKey((k) => k + 1), TOTAL);

    return () => timers.current.forEach(clearTimeout);
  }, [loopKey]);

  return (
    <div
      ref={wrapperRef}
      className="w-full overflow-hidden rounded-2xl shadow-2xl"
      style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}`, position: "relative" }}
    >
      <div
        dir={dir}
        className="relative overflow-hidden select-none flex flex-col"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
          background: "linear-gradient(140deg,#08080f 0%,#0d0820 55%,#08080f 100%)",
          flexShrink: 0,
        }}
      >
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full" style={{ width: 600, height: 600, top: -180, left: -120, background: "radial-gradient(circle,rgba(225,29,72,.22) 0%,transparent 65%)" }} />
          <div className="absolute rounded-full" style={{ width: 560, height: 560, bottom: -140, right: -80, background: "radial-gradient(circle,rgba(124,58,237,.2) 0%,transparent 65%)" }} />
          <div className="absolute rounded-full" style={{ width: 360, height: 360, top: "30%", right: "22%", background: "radial-gradient(circle,rgba(249,115,22,.14) 0%,transparent 65%)" }} />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-10 pt-7 pb-0 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[15px] font-black text-white" style={{ background: "linear-gradient(135deg,#e11d48,#7c3aed)" }}>I</div>
            <span className="text-white/68 text-[15px] font-bold tracking-[0.18em]">INSPIRE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-white/35 text-[13px] font-mono">{c.sceneLabel(scene)}</span>
          </div>
        </div>

        {/* Scenes */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 py-6">
          <AnimatePresence mode="wait">

            {/* ═══ SCENE 1 ═══ */}
            {scene === 1 && (
              <motion.div key={`s1-${loopKey}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex flex-col gap-5">
                <Glass className="overflow-hidden" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 12px 60px rgba(0,0,0,0.5)" }}>
                  <TitleBar label="AI Assistant" />
                  <div className="p-8 flex flex-col gap-6">
                    <div className="flex justify-start">
                      <div className="rounded-2xl px-6 py-4 text-xl font-bold text-white max-w-md leading-snug" style={{ background: "linear-gradient(135deg,#e11d48,#7c3aed)", boxShadow: "0 6px 28px rgba(225,29,72,.4)" }}>
                        <TypingText text={c.userPrompt} speed={60} seed={loopKey} />
                      </div>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: 0.4 }} className={`flex ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
                      <div className="rounded-2xl px-6 py-4 text-base text-white/60 leading-relaxed max-w-lg border border-white/10" style={{ background: "rgba(255,255,255,0.045)" }}>
                        {c.genericResponse}
                      </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2, duration: 0.3 }} className={`flex ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
                      <div className="rounded-xl px-4 py-3 border border-white/[0.08] flex gap-1.5 items-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                        {[0, 0.2, 0.4].map((d, i) => (
                          <motion.div key={i} className="w-2 h-2 rounded-full bg-white/25" animate={{ opacity: [.25, 1, .25], y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, delay: d }} />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </Glass>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.0, duration: 0.6 }} className="flex justify-center">
                  <div className="px-7 py-3 rounded-full border border-white/10 text-base text-white/45 font-light tracking-wide" style={{ background: "rgba(255,255,255,0.025)" }}>
                    {c.scene1Caption}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ═══ SCENE 2 ═══ */}
            {scene === 2 && (
              <motion.div key={`s2-${loopKey}`} initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4 }} className="flex flex-col gap-6">
                <div className="flex justify-center">
                  <div className="flex items-center gap-3 px-7 py-3 rounded-full border border-rose-500/35" style={{ background: "rgba(225,29,72,.09)" }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
                    <span className="text-rose-300 text-[15px] font-bold tracking-widest uppercase">{c.scene2Title}</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {c.cards.map((card, i) => {
                    const vis = activeCard >= i;
                    const active = activeCard === i;
                    return (
                      <motion.div
                        key={`c${i}-${loopKey}`}
                        animate={{ opacity: vis ? 1 : 0, y: vis ? 0 : 32, scale: vis ? 1 : .88 }}
                        transition={{ duration: 0.38, ease: [.22, 1, .36, 1] }}
                        className="rounded-2xl p-6 flex flex-col gap-4 border"
                        style={{
                          minHeight: 200,
                          background: active ? "rgba(225,29,72,.07)" : "rgba(255,255,255,0.04)",
                          backdropFilter: "blur(16px)",
                          borderColor: active ? "rgba(225,29,72,.55)" : vis ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.06)",
                          boxShadow: active ? "0 0 36px rgba(225,29,72,.22), inset 0 1px 0 rgba(255,255,255,.09)" : "inset 0 1px 0 rgba(255,255,255,.05)",
                        }}
                      >
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-black text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#e11d48,#7c3aed)", boxShadow: "0 4px 16px rgba(225,29,72,.35)" }}>
                          {card.letter}
                        </div>
                        <div className="text-white/55 text-[13px] font-bold uppercase tracking-widest">{card.label}</div>
                        <div className="text-[15px] leading-snug min-h-[2.8rem] flex items-start">
                          {vis && <CyclingValue values={card.values} final={card.final} active={active} seed={loopKey} />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <motion.div animate={{ opacity: activeCard >= 4 ? 1 : 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-center gap-4">
                  <div className="h-px flex-1 max-w-32" style={{ background: "linear-gradient(to right,transparent,rgba(225,29,72,.5))" }} />
                  <span className="text-white/35 text-[13px] font-medium tracking-widest uppercase">merging with prompt</span>
                  <div className="h-px flex-1 max-w-32" style={{ background: "linear-gradient(to left,transparent,rgba(124,58,237,.5))" }} />
                </motion.div>
              </motion.div>
            )}

            {/* ═══ SCENE 3 ═══ */}
            {scene === 3 && (
              <motion.div key={`s3-${loopKey}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-5">
                <Glass className="overflow-hidden" style={{ borderColor: "rgba(225,29,72,.3)", boxShadow: "0 0 80px rgba(225,29,72,.12), 0 0 160px rgba(124,58,237,.07), inset 0 1px 0 rgba(255,255,255,.08)" }}>
                  <TitleBar label={locale === "ar" ? "AI Assistant + تعليمات INSPIRE" : "AI Assistant + INSPIRE Instructions"} glow />
                  <div className="p-8 flex flex-col gap-6">
                    <div className="flex justify-start">
                      <div className="rounded-2xl px-6 py-4 text-xl font-bold text-white max-w-md" style={{ background: "linear-gradient(135deg,#e11d48,#7c3aed)", boxShadow: "0 6px 28px rgba(225,29,72,.4)" }}>
                        {c.userPrompt}
                      </div>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .45 }} className="rounded-xl p-6 border border-white/10 flex flex-col gap-4" style={{ background: "rgba(255,255,255,.06)" }}>
                      <p className="text-white font-bold text-lg">{c.structuredTitle}</p>
                      <ul className="flex flex-col gap-3">
                        {c.bullets.map((b, i) => (
                          <motion.li key={i} initial={{ opacity: 0, x: dir === "rtl" ? 14 : -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .55 + i * .22, duration: .3 }} className="flex items-start gap-3 text-white/72 text-[15px] leading-relaxed">
                            <span className="text-orange-400 flex-shrink-0 mt-0.5 text-base">◆</span>
                            <span>{b}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: .4 }} className="text-rose-300 text-[15px] font-semibold pt-3 border-t border-white/10 flex items-center gap-2">
                        <span className="text-rose-400 text-base">{dir === "rtl" ? "←" : "→"}</span>{c.nextStep}
                      </motion.p>
                    </motion.div>
                  </div>
                </Glass>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: .5 }} className="flex items-center justify-between px-1">
                  <span className="text-white/45 text-[15px]">{c.scene3Caption}</span>
                  <div className="flex items-center gap-5">
                    <span className="text-white/55 text-[15px] font-black tracking-[.22em]">INSPIRE</span>
                    <div className="px-7 py-3 rounded-full text-[15px] font-bold text-white" style={{ background: "linear-gradient(135deg,#e11d48,#7c3aed)", boxShadow: "0 0 28px rgba(225,29,72,.5), 0 4px 14px rgba(0,0,0,.3)" }}>
                      {c.cta}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: "rgba(255,255,255,.04)" }}>
          <motion.div
            key={`bar-${loopKey}`}
            className="h-full"
            style={{ background: "linear-gradient(90deg,#e11d48,#7c3aed,#f97316)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: TOTAL / 1000, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
