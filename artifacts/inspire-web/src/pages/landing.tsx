import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Brain, FileText, Zap, CheckCircle2, ChevronDown, ChevronUp, CreditCard, Copy, Sparkles, Target, Layers, MessageSquare, Eye, BarChart3, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import LandingHero from "@/components/landing-hero/landing-hero";
import { useI18n } from "@/i18n";
import { ar } from "@/i18n/locales/ar";
import { en } from "@/i18n/locales/en";

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

export default function Landing() {
  const { locale, dir } = useI18n();
  const copy = (locale === "ar" ? ar : en).landing;
  const isRtl = dir === "rtl";
  const ForwardArrow = isRtl ? ArrowLeft : ArrowRight;

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  function copySample() {
    navigator.clipboard.writeText(SAMPLE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="overflow-x-hidden" dir={dir}>

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
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">{copy.philosophy.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-background mb-6">
              {copy.philosophy.title}
            </h2>
            <p className="text-background/60 max-w-2xl mx-auto text-lg leading-relaxed">
              {copy.philosophy.subtitle}
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
                <h3 className="text-xl font-bold text-background/90">{copy.philosophy.withoutTitle}</h3>
              </div>
              <ul className="space-y-4">
                {copy.philosophy.before.map((item, i) => (
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
                <h3 className="text-xl font-bold text-background/90">{copy.philosophy.withTitle}</h3>
              </div>
              <ul className="space-y-4">
                {copy.philosophy.after.map((item, i) => (
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
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">{copy.axes.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent to-orange-400" dir="ltr">INSPIRE</span> {copy.axes.titleSuffix}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{copy.axes.subtitle}</p>
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
                    <span className="text-sm font-bold text-foreground">{item.name}</span>
                  </div>
                  {locale === "ar" && (
                    <div className="text-xs text-muted-foreground/70 mb-3 italic" dir="ltr">{axis.latin}</div>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
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
              <p className="font-bold text-foreground mb-2">{copy.axes.ctaTitle}</p>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{copy.axes.ctaSubtitle}</p>
              <Link
                href="/assess/mini"
                className="px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                {copy.axes.ctaButton}
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
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">{copy.sample.eyebrow}</span>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">{copy.sample.title}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{copy.sample.subtitle}</p>
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
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/25 transition-all"
                >
                  <span className="text-2xl shrink-0">{SAMPLE_FEATURE_ICONS[i]}</span>
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
                    <span className="text-xs text-white/50 ml-2">{copy.sample.fileName}</span>
                  </div>
                  <button
                    onClick={copySample}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/10"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? copy.sample.copiedLabel : copy.sample.copyLabel}
                  </button>
                </div>
                <div className="p-6 bg-foreground/98">
                  <pre className="text-xs text-emerald-400/90 leading-relaxed whitespace-pre-wrap font-mono" dir="ltr">
                    {SAMPLE}
                  </pre>
                </div>
                <div className="bg-foreground/95 px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40" dir={dir}>
                  <span>{copy.sample.footerHint}</span>
                  <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full">{copy.sample.badge}</span>
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
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">{copy.how.eyebrow}</span>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">{copy.how.title}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{copy.how.subtitle}</p>
          </motion.div>

          <div className="relative">
            {/* connecting line */}
            <div className="hidden md:block absolute top-14 right-[16.67%] left-[16.67%] h-px border-t-2 border-dashed border-border z-0" />
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
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">{copy.pricing.eyebrow}</span>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">{copy.pricing.title}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{copy.pricing.subtitle}</p>
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
                  {copy.pricing.free.badge}
                </div>
                <div className="text-5xl font-display font-black text-foreground mb-1">{copy.pricing.free.price}</div>
                <div className="text-sm text-muted-foreground">{copy.pricing.free.period}</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {copy.pricing.free.features.map((f, i) => (
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
                {copy.pricing.free.cta}
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
                  <CreditCard className="h-3.5 w-3.5" /> {copy.pricing.paid.ribbon}
                </span>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/60 mb-3">
                  <Brain className="h-3.5 w-3.5" />
                  {copy.pricing.paid.badge}
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <div className="text-5xl font-display font-black text-white">{copy.pricing.paid.price}</div>
                  <div className="text-white/50 text-sm mb-1">{copy.pricing.paid.perUnit}</div>
                </div>
                <div className="text-sm text-white/50">{copy.pricing.paid.sublabel}</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {copy.pricing.paid.features.map((f, i) => (
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
                {copy.pricing.paid.cta}
                <ForwardArrow className="h-4 w-4" />
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
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">{copy.faq.eyebrow}</span>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">{copy.faq.title}</h2>
          </motion.div>

          <div className="space-y-3">
            {copy.faq.items.map((item, i) => (
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
                  className={`w-full flex items-center justify-between px-6 py-5 ${isRtl ? "text-right" : "text-left"} hover:bg-secondary/40 transition-colors`}
                >
                  <span className="font-semibold text-foreground text-sm leading-relaxed">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className={`h-5 w-5 text-muted-foreground shrink-0 ${isRtl ? "mr-3" : "ml-3"}`} />
                  ) : (
                    <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 ${isRtl ? "mr-3" : "ml-3"}`} />
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
              {copy.finalCta.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
              {copy.finalCta.titleLead}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent to-rose-400">{copy.finalCta.titleAccent}</span>
            </h2>
            <p className="text-white/50 mb-10 text-lg max-w-xl mx-auto">
              {copy.finalCta.paragraph}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/assess/mini"
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-accent/30 transition-all hover:-translate-y-1 w-full sm:w-auto justify-center"
              >
                <Zap className="h-5 w-5" />
                {copy.finalCta.primary}
              </Link>
              <Link
                href="/privacy-consent"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-6 py-4 rounded-2xl font-semibold text-base transition-all w-full sm:w-auto justify-center"
              >
                {copy.finalCta.secondary}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
