import { Link } from "wouter";
import { ArrowRight, Check, CreditCard, FileText, ShieldCheck, Sparkles } from "lucide-react";

const pricingPlans = [
  {
    name: "Quick assessment",
    price: "$0",
    note: "Free quick version",
    cta: "Start quick assessment",
    href: "/assess/mini",
    features: [
      "Free quick assessment",
      "Initial AI working-style snapshot",
      "No card required",
    ],
    highlighted: false,
  },
  {
    name: "Full INSPIRE report",
    price: "$10",
    note: "One-time payment per assessment",
    cta: "Start full assessment",
    href: "/assess",
    features: [
      "Full operating profile report",
      "Copy-ready AI instructions",
      "PDF report and share link",
      "No subscription",
    ],
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <CreditCard className="h-4 w-4" />
            Pricing
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            Simple pricing for a digital AI operating profile
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            INSPIRE is delivered online. No physical product is shipped. The full report is a one-time digital purchase that generates a structured operating profile and copy-ready AI instructions.
          </p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-6 shadow-2xl shadow-black/20 ${
                plan.highlighted
                  ? "border-rose-300/35 bg-gradient-to-b from-rose-500/[0.14] to-slate-950/70"
                  : "border-slate-400/10 bg-slate-950/55"
              }`}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">{plan.name}</h2>
                  <p className="mt-2 text-sm text-slate-400">{plan.note}</p>
                </div>
                {plan.highlighted && (
                  <span className="rounded-full border border-rose-300/20 bg-rose-500/[0.12] px-3 py-1 text-xs font-bold text-rose-100">
                    Full report
                  </span>
                )}
              </div>

              <div className="mb-6 flex items-end gap-2">
                <span className="font-display text-5xl font-black text-white">{plan.price}</span>
                {plan.highlighted && <span className="pb-2 text-sm text-slate-400">/ assessment</span>}
              </div>

              <ul className="mb-7 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition-colors ${
                  plan.highlighted
                    ? "bg-rose-500 text-white hover:bg-rose-400"
                    : "border border-slate-400/15 bg-slate-900/70 text-slate-100 hover:border-rose-300/30"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-5">
            <FileText className="mb-3 h-5 w-5 text-rose-200" />
            <h3 className="font-black text-white">Digital delivery</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Reports are generated and accessed through the website. No physical shipping applies.</p>
          </div>
          <div className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-rose-200" />
            <h3 className="font-black text-white">Payment processor</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Card payments will be processed by Lemon Squeezy after checkout approval.</p>
          </div>
          <div className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-5">
            <Sparkles className="mb-3 h-5 w-5 text-rose-200" />
            <h3 className="font-black text-white">Informational output</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">INSPIRE is not legal, medical, financial, psychological, or professional advice.</p>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold text-slate-400">
          <Link href="/terms" className="transition-colors hover:text-rose-200">Terms</Link>
          <Link href="/privacy" className="transition-colors hover:text-rose-200">Privacy</Link>
          <Link href="/refund-policy" className="transition-colors hover:text-rose-200">Refund Policy</Link>
        </div>
      </div>
    </div>
  );
}
