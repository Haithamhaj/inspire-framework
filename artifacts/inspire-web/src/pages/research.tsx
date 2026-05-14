import { Link } from "wouter";
import { ArrowRight, ExternalLink, FileText, Layers, Sparkles } from "lucide-react";

const researchPoints = [
  "INSPIRE focuses on defining the user's AI interaction preferences and operating style.",
  "CRAFTS focuses on turning context and intent into practical prompt-engineering structure.",
  "Together, the frameworks support more repeatable and personalized AI collaboration.",
];

export default function Research() {
  return (
    <div className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <header>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <FileText className="h-4 w-4" />
            Research basis
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            INSPIRE & CRAFTS research background
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            INSPIRE Framework is informed by the paper “Inspire & Crafts: A Dual Framework for
            Individual AI Interaction Customization,” authored by Haitham Hamadneh and available on
            SSRN.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
          <Sparkles className="mb-4 h-6 w-6 text-rose-200" />
          <h2 className="text-2xl font-black text-white">Plain-language summary</h2>
          <div className="mt-4 space-y-4 text-base leading-8 text-slate-300">
            <p>
              The research argues that people need a clearer way to customize how AI assistants
              work with them. Instead of relying on generic outputs or isolated prompt tricks, users
              can define their goals, style, preferences, interaction rules, and quality standards.
            </p>
            <p>
              INSPIRE applies this idea as a product: it asks structured questions, identifies
              useful signals, and produces a reusable AI operating profile and prompt instructions.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-400"
            >
              Open SSRN page
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://dx.doi.org/10.2139/ssrn.5358595"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-400/15 bg-slate-950/65 px-5 py-3 text-sm font-black text-white hover:border-rose-300/30"
            >
              Open DOI
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {researchPoints.map((point) => (
            <div key={point} className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-5">
              <Layers className="mb-4 h-5 w-5 text-rose-200" />
              <p className="text-sm leading-7 text-slate-300">{point}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-6">
          <h2 className="text-2xl font-black text-white">From research to usable instructions</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            The product goal is practical: help users leave with copy-ready AI instructions they can
            use in real work, study, planning, writing, and analysis workflows.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/about" className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-400">
              Learn about INSPIRE
            </Link>
            <Link href="/guides" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-400/15 bg-slate-950/65 px-5 py-3 text-sm font-black text-white hover:border-rose-300/30">
              Read the guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
