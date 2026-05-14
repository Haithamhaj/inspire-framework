import { Link } from "wouter";
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, Sparkles, Target } from "lucide-react";

const principles = [
  "Personal AI instructions should reflect the user, not a generic prompt template.",
  "Useful AI behavior comes from clear goals, context, preferences, constraints, and quality rules.",
  "A repeatable assessment is easier to trust than guessing what to write in every new chat.",
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <Sparkles className="h-4 w-4" />
            About INSPIRE
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            A practical framework for personal AI instructions
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            INSPIRE Framework is a self-serve digital assessment that turns a person's goals,
            working style, preferences, and red lines into a reusable AI operating profile for
            tools such as ChatGPT, Claude, Gemini, and similar assistants.
          </p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <div key={principle} className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-5">
              <CheckCircle2 className="mb-4 h-5 w-5 text-rose-200" />
              <p className="text-sm leading-7 text-slate-300">{principle}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
            <Target className="mb-4 h-6 w-6 text-rose-200" />
            <h2 className="text-2xl font-black text-white">What INSPIRE is built to solve</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-300">
              <p>
                Many people know that AI tools can help them, but they keep getting answers that
                are too generic, too verbose, too vague, or not aligned with how they work. The
                problem is usually not one missing magic prompt. The problem is missing operating
                context.
              </p>
              <p>
                INSPIRE collects that context through a guided assessment and converts it into a
                copy-ready instruction set, starter prompts, and a readable digital report.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
            <BookOpen className="mb-4 h-6 w-6 text-rose-200" />
            <h2 className="text-2xl font-black text-white">Research and product basis</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-300">
              <p>
                INSPIRE is connected to the INSPIRE & CRAFTS work by Haitham Hamadneh, which
                documents a practical framework for individual-level AI interaction customization.
              </p>
              <a
                href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-black text-rose-200 hover:text-rose-100"
              >
                View the SSRN paper
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-6">
          <h2 className="text-2xl font-black text-white">Create your own AI operating profile</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            Start with the free quick assessment or review the pricing page for the full digital
            report.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/assess/mini" className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-400">
              Try the free quick assessment
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-400/15 bg-slate-950/65 px-5 py-3 text-sm font-black text-white hover:border-rose-300/30">
              View pricing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
