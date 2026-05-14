import { Link } from "wouter";
import { ArrowRight, Mail, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

const contactNotes = [
  "INSPIRE is a self-serve digital product. No physical goods are shipped.",
  "The full report is delivered digitally after completion and payment when payments are enabled.",
  "Outputs are productivity-focused and informational, not professional legal, medical, financial, or psychological advice.",
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <Sparkles className="h-4 w-4" />
            Contact
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            Contact INSPIRE Framework
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            For product questions, support, billing questions, or review inquiries, contact the
            INSPIRE team by email.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
          <Mail className="mb-4 h-6 w-6 text-rose-200" />
          <h2 className="text-2xl font-black text-white">Support email</h2>
          <a
            href="mailto:Haitham.haj@gmail.com"
            className="mt-3 inline-flex text-lg font-black text-rose-200 hover:text-rose-100"
          >
            Haitham.haj@gmail.com
          </a>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Include the email used for your assessment if your question is about a report or account.
          </p>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {contactNotes.map((note) => (
            <div key={note} className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-5">
              <ShieldCheck className="mb-4 h-5 w-5 text-rose-200" />
              <p className="text-sm leading-7 text-slate-300">{note}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-6">
          <MessageSquare className="mb-4 h-6 w-6 text-rose-200" />
          <h2 className="text-2xl font-black text-white">Before contacting support</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            You can review the pricing, refund policy, privacy policy, and terms from the footer.
            For product exploration, start with the free quick assessment.
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
