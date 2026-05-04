import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_DURATION = 18000;

const content = {
  ar: {
    dir: "rtl",
    userPrompt: "ساعدني أرتب مشروعي",
    genericResponse: "بالطبع! يمكنني مساعدتك في ترتيب مشروعك. ما هي تفاصيل المشروع؟ هل تريد قائمة مهام أم جدولًا زمنيًا؟",
    scene1Caption: "طلب واضح… لكن بدون ملف تشغيل",
    scene2Title: "ملف التشغيل INSPIRE",
    cards: [
      { letter: "I", label: "الدور", values: ["مدير مشاريع", "مستشار استراتيجي", "محلل أعمال"], final: "مدير مشاريع" },
      { letter: "N", label: "الأسلوب", values: ["تحليلي دقيق", "إبداعي مرن", "منطقي منظّم"], final: "تحليلي دقيق" },
      { letter: "S", label: "المخرجات", values: ["قوائم منظّمة", "تقارير مفصّلة", "خطوات عملية"], final: "خطوات عملية" },
      { letter: "P", label: "الحدود", values: ["بدون اقتراحات", "لا تفترض السياق", "ركّز على الهدف"], final: "ركّز على الهدف" },
      { letter: "I", label: "طريقة التفكير", values: ["من الأكبر للأصغر", "خطوة بخطوة", "بدءًا من الأولويات"], final: "خطوة بخطوة" },
    ],
    scene3Caption: "نفس الطلب… بسياق أوضح",
    structuredTitle: "خطة تنظيم مشروعك",
    structuredBullets: ["تحديد أهداف المشروع والنتائج المتوقعة", "تقسيم العمل إلى مراحل قابلة للقياس", "توزيع المهام وفق الأولويات والمواعيد"],
    nextStep: "الخطوة التالية: مراجعة المرحلة الأولى بحلول الجمعة",
    cta: "ابنِ ملفك الآن",
    logo: "INSPIRE",
  },
  en: {
    dir: "ltr",
    userPrompt: "Help me organize my project",
    genericResponse: "Sure! I can help you organize your project. What are the project details? Would you like a task list or a timeline?",
    scene1Caption: "A clear request… but without an operating profile",
    scene2Title: "INSPIRE Operating Profile",
    cards: [
      { letter: "I", label: "Role", values: ["Project Manager", "Strategic Advisor", "Business Analyst"], final: "Project Manager" },
      { letter: "N", label: "Style", values: ["Analytical", "Creative & Flexible", "Structured Logic"], final: "Analytical" },
      { letter: "S", label: "Output", values: ["Structured Lists", "Detailed Reports", "Action Steps"], final: "Action Steps" },
      { letter: "P", label: "Boundaries", values: ["No suggestions", "Don't assume context", "Stay on target"], final: "Stay on target" },
      { letter: "I", label: "Thinking", values: ["Top-down", "Step by step", "Priority-first"], final: "Step by step" },
    ],
    scene3Caption: "Same request… with clearer context",
    structuredTitle: "Project Organization Plan",
    structuredBullets: ["Define project goals and expected outcomes", "Break work into measurable phases", "Assign tasks by priority and deadline"],
    nextStep: "Next step: Review Phase 1 by Friday",
    cta: "Build Your Profile Now",
    logo: "INSPIRE",
  },
};

function useUrlLang(): "ar" | "en" {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  return lang === "en" ? "en" : "ar";
}

function TypingText({ text, startDelay = 0, speed = 60 }: { text: string; startDelay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [started, text, speed]);

  return <span>{displayed}<span className="inline-block w-0.5 h-4 bg-rose-400 ml-0.5 animate-pulse" /></span>;
}

function CardValue({ values, final, active, cycleStart }: { values: string[]; final: string; active: boolean; cycleStart: number }) {
  const [displayed, setDisplayed] = useState(values[0]);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(values[0]); setSettled(false); return; }
    setSettled(false);
    let idx = 0;
    const iv = setInterval(() => {
      idx++;
      if (idx >= values.length) {
        clearInterval(iv);
        setDisplayed(final);
        setSettled(true);
      } else {
        setDisplayed(values[idx]);
      }
    }, 600);
    return () => clearInterval(iv);
  }, [active, final, values]);

  return (
    <motion.span
      key={displayed}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={settled ? "text-orange-300 font-semibold" : "text-violet-300"}
    >
      {displayed}
    </motion.span>
  );
}

export function InspireExplainer() {
  const lang = useUrlLang();
  const c = content[lang];
  const dir = c.dir as "rtl" | "ltr";

  const [scene, setScene] = useState<1 | 2 | 3>(1);
  const [activeCard, setActiveCard] = useState(-1);
  const cycleRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    cycleRef.current.forEach(clearTimeout);
    cycleRef.current = [];

    const s = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      cycleRef.current.push(t);
      return t;
    };

    s(() => setScene(2), 5000);
    s(() => setActiveCard(0), 5400);
    s(() => setActiveCard(1), 6600);
    s(() => setActiveCard(2), 7800);
    s(() => setActiveCard(3), 9000);
    s(() => setActiveCard(4), 10200);
    s(() => setScene(3), 11000);
    s(() => {
      setScene(1);
      setActiveCard(-1);
    }, TOTAL_DURATION);

    return () => cycleRef.current.forEach(clearTimeout);
  }, [scene === 1 && activeCard === -1]);

  useEffect(() => {
    let start = Date.now();
    const loop = () => {
      const elapsed = Date.now() - start;
      if (elapsed >= TOTAL_DURATION) {
        start = Date.now();
        setScene(1);
        setActiveCard(-1);
      }
      requestAnimationFrame(loop);
    };
    const raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      dir={dir}
      className="w-full h-screen overflow-hidden flex items-center justify-center relative select-none"
      style={{ background: "linear-gradient(135deg, #0a0a14 0%, #0d0820 50%, #0a0a14 100%)" }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #e11d48, transparent)", top: "10%", left: "15%" }} />
        <div className="absolute w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7c3aed, transparent)", bottom: "20%", right: "10%" }} />
        <div className="absolute w-64 h-64 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #f97316, transparent)", top: "40%", right: "30%" }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        {/* Scene 1 */}
        <AnimatePresence mode="wait">
          {scene === 1 && (
            <motion.div
              key="scene1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Chat UI mockup */}
              <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}>
                {/* Header bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <div className="w-3 h-3 rounded-full bg-orange-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-white/30 text-xs mx-auto font-mono">AI Assistant</span>
                </div>
                <div className="p-6 space-y-4">
                  {/* User message */}
                  <div className={`flex ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
                    <div className="rounded-2xl px-4 py-2.5 max-w-xs text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, #e11d48, #7c3aed)" }}>
                      <TypingText text={c.userPrompt} speed={70} />
                    </div>
                  </div>
                  {/* AI response */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0, duration: 0.4 }}
                    className={`flex ${dir === "rtl" ? "justify-start" : "justify-start"}`}
                  >
                    <div className="rounded-2xl px-4 py-2.5 max-w-sm text-sm text-white/70 leading-relaxed border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                      {c.genericResponse}
                    </div>
                  </motion.div>
                </div>
              </div>
              {/* Caption */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.2, duration: 0.5 }}
                className="text-center"
              >
                <span className="text-white/50 text-base font-light tracking-wide">{c.scene1Caption}</span>
              </motion.div>
            </motion.div>
          )}

          {/* Scene 2 */}
          {scene === 2 && (
            <motion.div
              key="scene2"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Panel title */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-rose-500/30" style={{ background: "rgba(225,29,72,0.1)" }}>
                  <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span className="text-rose-300 text-sm font-semibold tracking-widest uppercase">{c.scene2Title}</span>
                </div>
              </motion.div>

              {/* Cards grid */}
              <div className="grid grid-cols-5 gap-3">
                {c.cards.map((card, i) => (
                  <motion.div
                    key={card.letter + i}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{
                      opacity: activeCard >= i ? 1 : 0,
                      y: activeCard >= i ? 0 : 30,
                      scale: activeCard >= i ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="relative rounded-2xl p-4 border flex flex-col gap-2 min-h-[120px] justify-between"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(12px)",
                      borderColor: activeCard === i ? "rgba(225,29,72,0.6)" : "rgba(255,255,255,0.1)",
                      boxShadow: activeCard === i ? "0 0 24px rgba(225,29,72,0.25), inset 0 1px 0 rgba(255,255,255,0.08)" : "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    {/* Letter badge */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #e11d48, #7c3aed)" }}>
                      {card.letter}
                    </div>
                    {/* Label */}
                    <div className="text-white/60 text-xs font-medium">{card.label}</div>
                    {/* Cycling value */}
                    <div className="text-xs leading-snug min-h-[2rem]">
                      {activeCard >= i ? (
                        <CardValue
                          values={card.values}
                          final={card.final}
                          active={activeCard === i}
                          cycleStart={i * 1200}
                        />
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Merge animation hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard >= 4 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 text-white/40 text-xs">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-500/40" />
                  <span className="text-rose-300/60">▲</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-violet-500/40" />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Scene 3 */}
          {scene === 3 && (
            <motion.div
              key="scene3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Enhanced chat */}
              <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", borderColor: "rgba(225,29,72,0.25)", boxShadow: "0 0 40px rgba(225,29,72,0.1)" }}>
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <div className="w-3 h-3 rounded-full bg-orange-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-white/30 text-xs mx-auto font-mono">AI Assistant + INSPIRE</span>
                </div>
                <div className="p-6 space-y-4">
                  {/* User message */}
                  <div className={`flex ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
                    <div className="rounded-2xl px-4 py-2.5 max-w-xs text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, #e11d48, #7c3aed)" }}>
                      {c.userPrompt}
                    </div>
                  </div>
                  {/* Structured response */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="rounded-xl p-4 border border-white/10 space-y-3"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-white font-semibold text-sm">{c.structuredTitle}</p>
                    <ul className="space-y-1.5">
                      {c.structuredBullets.map((b, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: dir === "rtl" ? 10 : -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.2, duration: 0.3 }}
                          className="flex items-start gap-2 text-white/70 text-xs leading-relaxed"
                        >
                          <span className="text-orange-400 mt-0.5 flex-shrink-0">◆</span>
                          <span>{b}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.4 }}
                      className="text-rose-300/80 text-xs font-medium pt-1 border-t border-white/10"
                    >
                      → {c.nextStep}
                    </motion.p>
                  </motion.div>
                </div>
              </div>

              {/* Caption + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="flex items-center justify-between px-2"
              >
                <span className="text-white/40 text-sm">{c.scene3Caption}</span>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-sm font-bold tracking-widest">{c.logo}</span>
                  <button className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all" style={{ background: "linear-gradient(135deg, #e11d48, #7c3aed)", boxShadow: "0 0 20px rgba(225,29,72,0.4)" }}>
                    {c.cta}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(90deg, #e11d48, #7c3aed, #f97316)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: TOTAL_DURATION / 1000, ease: "linear", repeat: Infinity }}
        />
      </div>
    </div>
  );
}
