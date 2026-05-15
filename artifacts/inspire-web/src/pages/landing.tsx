import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Brain, FileText, Zap, CheckCircle2, ChevronDown, ChevronUp, CreditCard, Copy, Sparkles, Target, Layers, MessageSquare, Eye, BarChart3, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import LandingHero from "@/components/landing-hero/landing-hero";
import { LandingAtmosphere } from "@/components/landing/LandingAtmosphere";
import { InspireExplainerSection } from "@/components/inspire-explainer/InspireExplainerSection";
import { useI18n } from "@/i18n";
import { ar } from "@/i18n/locales/ar";
import { en } from "@/i18n/locales/en";
import { localizePath } from "@/lib/locale-paths";

// ─── INSPIRE AXES (visual config; copy comes from i18n) ───────────────
const AXES = [
  { key: "intention", letter: "I", latin: "Intention", bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-500", icon: Target },
  { key: "narrative", letter: "N", latin: "Narrative", bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-500", icon: MessageSquare },
  { key: "style", letter: "S", latin: "Style", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-500", icon: Layers },
  { key: "preferences", letter: "P", latin: "Preferences", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-500", icon: Eye },
  { key: "interaction", letter: "I", latin: "Interaction", bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-500", icon: RefreshCw },
  { key: "reflection", letter: "R", latin: "Reflection", bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-500", icon: Brain },
  { key: "evaluation", letter: "E", latin: "Evaluation", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/30", text: "text-fuchsia-500", icon: BarChart3 },
] as const;

const SAMPLE_FEATURE_ICONS = ["📊", "🧠", "🚫", "⚡", "🎯", "📄"] as const;

const STEP_COLORS = [
  "from-violet-500 to-purple-600",
  "from-accent to-rose-600",
  "from-emerald-500 to-teal-600",
] as const;
const STEP_ICONS = [FileText, Brain, Sparkles] as const;

// ─── SAMPLE INSTRUCTION (always English code block) ───────────────────
const SAMPLE = `## Assistant Identity
A purpose-specific assistant tuned to my selected goal, working style,
and how I like to interact with AI.

## Mission & Domain Context
Help me make focused, practical progress on [my project / goal].
Stay anchored to my context and the constraints I share.

## Dynamic Roles
- Planning partner — turn ideas into concrete next steps
- Quality reviewer — flag risks and weak assumptions
- Execution coach — keep momentum on the next action

## Thinking & Quality Modes
- Reason briefly before concluding; show the path
- Prefer concrete over generic; tie claims to my context
- When complexity rises, structure the answer step by step

## Red Lines
- Don't list more than 3 options at once
- Don't pad with filler or restate what I just said
- Don't switch topic without flagging it first`;

export default function Landing() {
  const { locale, dir } = useI18n();
  const copy = (locale === "ar" ? ar : en).landing;
  const isRtl = dir === "rtl";
  const ForwardArrow = isRtl ? ArrowLeft : ArrowRight;
  const href = (path: string) => localizePath(path, locale);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  function copySample() {
    navigator.clipboard.writeText(SAMPLE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative isolate overflow-x-hidden bg-[#070817] text-slate-100" dir={dir}>
      <LandingAtmosphere />

      <div className="relative z-10">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <LandingHero primaryHref={href("/privacy-consent")} secondaryAnchorId="what-you-get" />

      {/* ─── EXPLAINER DEMO ───────────────────────────────── */}
      <section className="py-20 px-6 bg-transparent">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-[13px] font-bold tracking-widest text-accent uppercase mb-3 block">
              {locale === "ar" ? "شاهد كيف يعمل" : "See It In Action"}
            </span>
            <h2 className="text-4xl font-display font-bold text-slate-50 mb-4">
              {locale === "ar" ? "الفرق الذي يصنعه ملف التشغيل" : "The Difference a Profile Makes"}
            </h2>
            <p className="text-[15px] leading-7 text-slate-400 max-w-xl mx-auto">
              {locale === "ar"
                ? "بدون ملف تشغيل، الذكاء الاصطناعي يجيب بشكل عام. بعده، يعرف تمامًا كيف تفكر وما تحتاجه."
                : "Without a profile, AI responds generically. With one, it knows exactly how you think and what you need."}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <InspireExplainerSection />
          </motion.div>
        </div>
      </section>

      {/* ─── PHILOSOPHY (THE PROBLEM) ─────────────────────── */}
      <section className="py-24 px-6 bg-slate-950/20 text-slate-100 backdrop-blur-[1px]">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[13px] font-bold tracking-widest text-accent uppercase mb-3 block">{copy.philosophy.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-50 mb-6">
              {copy.philosophy.title}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              {copy.philosophy.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-950/55 border border-slate-400/10 rounded-3xl p-8 shadow-2xl shadow-black/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 text-lg font-black">✕</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100">{copy.philosophy.withoutTitle}</h3>
              </div>
              <ul className="space-y-4">
                {copy.philosophy.before.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 text-slate-400 text-[15px] leading-relaxed"
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
              className="bg-gradient-to-br from-accent/20 to-rose-900/20 border border-accent/30 rounded-3xl p-8 shadow-2xl shadow-accent/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-lg font-black">✓</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100">{copy.philosophy.withTitle}</h3>
              </div>
              <ul className="space-y-4">
                {copy.philosophy.after.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 text-slate-300 text-[15px] leading-relaxed"
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
      <section className="py-24 px-6 bg-transparent">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[13px] font-bold tracking-widest text-accent uppercase mb-3 block">{copy.axes.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-50 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent to-orange-400" dir="ltr">INSPIRE</span> {copy.axes.titleSuffix}
            </h2>
            <p className="text-[15px] leading-7 text-slate-400 max-w-xl mx-auto">{copy.axes.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {AXES.map((axis, i) => {
              const Icon = axis.icon;
              const item = copy.axes.items[axis.key];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative bg-slate-950/55 border ${axis.border} rounded-2xl p-6 hover:-translate-y-1 transition-all group overflow-hidden shadow-xl shadow-black/10`}
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
                    <span className="text-[15px] font-bold text-slate-100">{item.name}</span>
                  </div>
                  {locale === "ar" && (
                    <div className="text-[13px] text-slate-500 mb-3 italic" dir="ltr">{axis.latin}</div>
                  )}
                  <p className="text-[15px] text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}

            {/* CTA card (8th) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: AXES.length * 0.08 }}
              className="bg-gradient-to-br from-accent/15 to-rose-500/10 border-2 border-accent/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center sm:col-span-2 lg:col-span-1 shadow-xl shadow-accent/10"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <p className="font-bold text-slate-50 mb-2">{copy.axes.ctaTitle}</p>
              <p className="text-[13.5px] text-slate-400 mb-5 leading-relaxed">{copy.axes.ctaSubtitle}</p>
              <Link
                href={href("/privacy-consent")}
                className="px-5 py-2.5 bg-accent text-white rounded-xl text-[15px] font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                {copy.axes.ctaButton}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SAMPLE OUTPUT ────────────────────────────────── */}
      <section id="what-you-get" className="py-24 px-6 bg-slate-950/20 backdrop-blur-[1px]">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-[13px] font-bold tracking-widest text-accent uppercase mb-3 block">{copy.sample.eyebrow}</span>
            <h2 className="text-4xl font-display font-bold text-slate-50 mb-4">{copy.sample.title}</h2>
            <p className="text-[15px] leading-7 text-slate-400 max-w-xl mx-auto">{copy.sample.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* feature list */}
            <div className="lg:col-span-2 space-y-4">
              {copy.sample.features.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/55 border border-slate-400/10 hover:border-accent/30 transition-all shadow-lg shadow-black/10"
                >
                  <span className="text-2xl shrink-0">{SAMPLE_FEATURE_ICONS[i]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-100 text-[15px]">{item.title}</div>
                    <div className="text-[13.5px] leading-5 text-slate-400 mt-1">{item.desc}</div>
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
              <div className="bg-slate-950/80 border border-slate-400/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/30" dir="ltr">
                <div className="bg-slate-950 px-5 py-3 border-b border-slate-400/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/70" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <span className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-[13px] text-white/60 ml-2">{copy.sample.fileName}</span>
                  </div>
                  <button
                    onClick={copySample}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-slate-800/70"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? copy.sample.copiedLabel : copy.sample.copyLabel}
                  </button>
                </div>
                <div className="p-6 bg-slate-950/98">
                  <pre className="text-[13px] text-emerald-400/90 leading-relaxed whitespace-pre-wrap font-mono" dir="ltr">
                    {SAMPLE}
                  </pre>
                </div>
                <div className="bg-slate-950/95 px-5 py-3 border-t border-slate-400/10 flex items-center justify-between text-[13px] text-white/50" dir={dir}>
                  <span>{copy.sample.footerHint}</span>
                  <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full">{copy.sample.badge}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-transparent">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[13px] font-bold tracking-widest text-accent uppercase mb-3 block">{copy.how.eyebrow}</span>
            <h2 className="text-4xl font-display font-bold text-slate-50 mb-4">{copy.how.title}</h2>
            <p className="text-[15px] leading-7 text-slate-400 max-w-xl mx-auto">{copy.how.subtitle}</p>
          </motion.div>

          <div className="relative">
            {/* connecting line */}
            <div className="hidden md:block absolute top-14 right-[16.67%] left-[16.67%] h-px border-t-2 border-dashed border-slate-400/15 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {copy.how.steps.map((step, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="relative text-center z-10"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${STEP_COLORS[i]} mb-5 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-5xl font-display font-black text-white/[0.08] mb-2 -mt-2">{step.n}</div>
                    <h3 className="text-lg font-bold text-slate-100 mb-3">{step.title}</h3>
                    <p className="text-[15px] text-slate-400 leading-relaxed max-w-[240px] mx-auto">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ──────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-slate-950/20 backdrop-blur-[1px]">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[13px] font-bold tracking-widest text-accent uppercase mb-3 block">{copy.pricing.eyebrow}</span>
            <h2 className="text-4xl font-display font-bold text-slate-50 mb-4">{copy.pricing.title}</h2>
            <p className="text-[15px] leading-7 text-slate-400 max-w-xl mx-auto">{copy.pricing.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-950/55 border-2 border-slate-400/10 rounded-3xl p-8 flex flex-col shadow-2xl shadow-black/20"
            >
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 text-[13px] font-semibold text-slate-300 mb-3">
                  <Zap className="h-3.5 w-3.5" />
                  {copy.pricing.free.badge}
                </div>
                <div className="text-5xl font-display font-black text-slate-50 mb-1">{copy.pricing.free.price}</div>
                <div className="text-[15px] text-slate-400">{copy.pricing.free.period}</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {copy.pricing.free.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px] text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={href("/assess/mini")}
                className="flex items-center justify-center gap-2 border-2 border-slate-400/15 text-slate-100 px-6 py-3 rounded-xl font-semibold hover:border-accent/40 hover:text-accent transition-all"
              >
                <Zap className="h-4 w-4" />
                {copy.pricing.free.cta}
              </Link>
            </motion.div>

            {/* Paid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-slate-950 border-2 border-accent/30 rounded-3xl p-8 flex flex-col shadow-2xl shadow-accent/20"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-accent text-white text-[13px] font-bold px-5 py-1.5 rounded-full shadow-lg shadow-accent/30 flex items-center gap-1.5 whitespace-nowrap">
                  <CreditCard className="h-3.5 w-3.5" /> {copy.pricing.paid.ribbon}
                </span>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 text-[13px] font-semibold text-slate-300 mb-3">
                  <Brain className="h-3.5 w-3.5" />
                  {copy.pricing.paid.badge}
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <div className="text-5xl font-display font-black text-white">{copy.pricing.paid.price}</div>
                  <div className="text-white/55 text-[15px] mb-1">{copy.pricing.paid.perUnit}</div>
                </div>
                <div className="text-[15px] text-white/55">{copy.pricing.paid.sublabel}</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {copy.pricing.paid.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px] text-white/82">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={href("/privacy-consent")}
                className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-6 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 text-base"
              >
                {copy.pricing.paid.cta}
                <ForwardArrow className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-transparent">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-[13px] font-bold tracking-widest text-accent uppercase mb-3 block">{copy.faq.eyebrow}</span>
            <h2 className="text-4xl font-display font-bold text-slate-50 mb-4">{copy.faq.title}</h2>
          </motion.div>

          <div className="space-y-3">
            {copy.faq.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-slate-950/55 border border-slate-400/10 rounded-2xl overflow-hidden shadow-lg shadow-black/10"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-6 py-5 ${isRtl ? "text-right" : "text-left"} hover:bg-slate-900/55 transition-colors`}
                >
                  <span className="font-semibold text-slate-100 text-[15px] leading-relaxed">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className={`h-5 w-5 text-slate-400 shrink-0 ${isRtl ? "mr-3" : "ml-3"}`} />
                  ) : (
                    <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 ${isRtl ? "mr-3" : "ml-3"}`} />
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
                      <p className="px-6 pb-5 text-[15px] text-slate-400 leading-relaxed border-t border-slate-400/10 pt-4">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SEO CONTENT HUB ──────────────────────────────── */}
      <section className="px-6 py-20 bg-slate-950/20 backdrop-blur-[1px]">
        <div className="container max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div>
              <span className="text-[13px] font-bold tracking-widest text-accent uppercase mb-3 block">
                {locale === "ar" ? "دليل عملي" : "Practical guides"}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-50 mb-4">
                {locale === "ar" ? "تعلم كيف تكتب تعليمات أفضل للذكاء الاصطناعي" : "Learn how to write better AI prompts and instructions"}
              </h2>
              <p className="text-[15px] leading-7 text-slate-400">
                {locale === "ar"
                  ? "قبل أن تبدأ التقييم، اقرأ أدلة مختصرة عن هندسة الأوامر، تعليمات ChatGPT، واستخدام الذكاء الاصطناعي في العمل داخل السعودية والخليج."
                  : "Before taking the assessment, explore focused guides on prompt engineering, ChatGPT custom instructions, and AI productivity for Saudi Arabia and GCC work contexts."}
              </p>
              <Link
                href={href("/guides")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-400/15 bg-slate-900/70 px-5 py-3 text-sm font-black text-white transition-colors hover:border-rose-300/30"
              >
                {locale === "ar" ? "للمزيد" : "Read the guides"}
                <ForwardArrow className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3">
              {[
                locale === "ar" ? "كيف أكتب برومبت أفضل؟" : "How do I write better prompts?",
                locale === "ar" ? "ماذا أضع في تعليمات ChatGPT؟" : "What should I put in ChatGPT custom instructions?",
                locale === "ar" ? "ما هو ملف تشغيل الذكاء الاصطناعي؟" : "What is an AI operating profile?",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-400/10 bg-slate-950/55 p-4 text-sm font-bold text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-950/50 backdrop-blur-[1px]">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-[13px] font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              {copy.finalCta.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
              {copy.finalCta.titleLead}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent to-rose-400">{copy.finalCta.titleAccent}</span>
            </h2>
            <p className="text-white/50 mb-10 text-lg max-w-xl mx-auto">
              {copy.finalCta.paragraph}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={href("/privacy-consent")}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-accent/30 transition-all hover:-translate-y-1 w-full sm:w-auto justify-center"
              >
                {copy.finalCta.primary}
              </Link>
              <Link
                href="#pricing"
                className="flex items-center gap-2 bg-slate-900/70 hover:bg-slate-800/80 border border-slate-400/15 text-white px-6 py-4 rounded-2xl font-semibold text-base transition-all w-full sm:w-auto justify-center"
              >
                {copy.finalCta.secondary}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      </div>
    </div>
  );
}
