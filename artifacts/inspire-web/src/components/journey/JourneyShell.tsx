import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type JourneyShellProps = {
  children: React.ReactNode;
  dir: "rtl" | "ltr";
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  aside?: React.ReactNode;
  className?: string;
};

type JourneyPanelProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

type JourneyStep = {
  label: string;
  state?: "complete" | "current" | "upcoming";
};

type JourneyStepIndicatorProps = {
  steps: JourneyStep[];
  className?: string;
};

type JourneyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  tone?: "primary" | "secondary" | "ghost";
};

type JourneyLinkButtonProps = {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "primary" | "secondary" | "ghost";
  className?: string;
};

const panelMotion = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const journeyGlowLayers = [
  {
    className: "left-[-18%] top-[-10%] h-[440px] w-[440px] bg-rose-500/14",
    animate: { x: [0, 70, 20, 0], y: [0, 80, 30, 0], scale: [1, 1.08, 0.98, 1] },
    duration: 28,
  },
  {
    className: "right-[-18%] top-[12%] h-[500px] w-[500px] bg-violet-500/12",
    animate: { x: [0, -80, -25, 0], y: [0, 60, 140, 0], scale: [1, 0.94, 1.08, 1] },
    duration: 32,
  },
  {
    className: "bottom-[-18%] left-[28%] h-[460px] w-[460px] bg-teal-500/9",
    animate: { x: [0, 90, -30, 0], y: [0, -80, -30, 0], scale: [1, 1.06, 0.96, 1] },
    duration: 36,
  },
];

function JourneyAtmosphere() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#080a18]" />
      {journeyGlowLayers.map((layer, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${layer.className}`}
          animate={reduced ? undefined : layer.animate}
          transition={
            reduced
              ? undefined
              : {
                  duration: layer.duration,
                  ease: "easeInOut",
                  repeat: Infinity,
                }
          }
        />
      ))}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-rose-500/[0.08] to-transparent" />
      <motion.div
        className="absolute inset-0 opacity-[0.045]"
        animate={reduced ? undefined : { backgroundPosition: ["0px 0px", "42px 42px"] }}
        transition={reduced ? undefined : { duration: 26, ease: "linear", repeat: Infinity }}
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.34]"
        animate={reduced ? undefined : { opacity: [0.25, 0.42, 0.28] }}
        transition={reduced ? undefined : { duration: 18, ease: "easeInOut", repeat: Infinity }}
        style={{
          background:
            "linear-gradient(130deg, rgba(244,63,94,0.08), transparent 34%, rgba(20,184,166,0.06) 68%, transparent)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(8,10,24,0.5)_46%,#080a18_100%)]" />
    </div>
  );
}

export function JourneyShell({
  children,
  dir,
  eyebrow,
  title,
  subtitle,
  aside,
  className,
}: JourneyShellProps) {
  const reduced = useReducedMotion();

  return (
    <div
      dir={dir}
      className={cn(
        "relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-[#080a18] text-slate-100",
        className
      )}
    >
      <JourneyAtmosphere />
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 md:py-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        <main className="min-w-0">
          {(eyebrow || title || subtitle) && (
            <motion.header
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mb-7 max-w-3xl"
            >
              {eyebrow && <JourneyEyebrow>{eyebrow}</JourneyEyebrow>}
              {title && (
                <h1 className="mt-4 text-3xl font-black leading-tight tracking-normal text-slate-50 md:text-5xl">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                  {subtitle}
                </p>
              )}
            </motion.header>
          )}
          {children}
        </main>

        {aside && (
          <aside className="min-w-0 lg:sticky lg:top-28 lg:h-fit">
            <JourneyPanel delay={0.08}>{aside}</JourneyPanel>
          </aside>
        )}
      </div>
    </div>
  );
}

export function JourneyEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-rose-200 shadow-lg shadow-rose-950/20 backdrop-blur-xl">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

export function JourneyPanel({ children, className, delay = 0 }: JourneyPanelProps) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      variants={reduced ? undefined : panelMotion}
      initial={reduced ? false : "hidden"}
      animate={reduced ? undefined : "show"}
      transition={{ duration: 0.38, delay, ease: "easeOut" }}
      className={cn(
        "rounded-[28px] border border-slate-400/10 bg-slate-950/55 p-5 shadow-2xl shadow-black/30 ring-1 ring-slate-300/[0.04] backdrop-blur-2xl md:p-7",
        className
      )}
    >
      {children}
    </motion.section>
  );
}

export function JourneyStepIndicator({ steps, className }: JourneyStepIndicatorProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {steps.map((step, index) => {
        const state = step.state ?? "upcoming";
        return (
          <div
            key={`${step.label}-${index}`}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition-colors",
              state === "complete" && "border-teal-300/20 bg-teal-500/[0.08] text-teal-100",
              state === "current" && "border-rose-300/30 bg-rose-500/[0.1] text-rose-100",
              state === "upcoming" && "border-slate-400/10 bg-slate-900/45 text-slate-400"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-black",
                state === "complete" && "border-teal-300/30 bg-teal-400/15 text-teal-100",
                state === "current" && "border-rose-300/40 bg-rose-400/15 text-rose-100",
                state === "upcoming" && "border-slate-500/20 bg-slate-800/60 text-slate-500"
              )}
            >
              {state === "complete" ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span className="min-w-0 font-semibold">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function JourneyPrimaryButton({
  children,
  className,
  icon,
  tone = "primary",
  ...props
}: JourneyButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        journeyButtonClass(tone),
        "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0",
        className
      )}
    >
      <span>{children}</span>
      {icon ?? <DefaultArrow />}
    </button>
  );
}

export function JourneyLinkButton({
  href,
  children,
  className,
  icon,
  tone = "primary",
}: JourneyLinkButtonProps) {
  return (
    <Link href={href} className={cn(journeyButtonClass(tone), className)}>
      <span>{children}</span>
      {icon ?? <DefaultArrow />}
    </Link>
  );
}

function journeyButtonClass(tone: "primary" | "secondary" | "ghost") {
  return cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition-all hover:-translate-y-0.5 active:translate-y-0",
    tone === "primary" &&
      "bg-gradient-to-l from-rose-500 to-orange-500 text-slate-950 shadow-xl shadow-rose-950/35 hover:from-rose-400 hover:to-orange-400",
    tone === "secondary" &&
      "border border-slate-400/15 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20 hover:border-rose-300/30 hover:bg-slate-800/75",
    tone === "ghost" &&
      "border border-transparent bg-transparent text-slate-300 hover:border-slate-400/15 hover:bg-slate-900/50 hover:text-slate-100"
  );
}

function DefaultArrow() {
  return (
    <>
      <ArrowLeft className="hidden h-4 w-4 rtl:block" />
      <ArrowRight className="h-4 w-4 rtl:hidden" />
    </>
  );
}
