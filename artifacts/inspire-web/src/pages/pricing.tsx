import { Link } from "wouter";
import { ArrowRight, Check, CreditCard, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";
import { localizePath } from "@/lib/locale-paths";

const pricingPlans = [
  {
    name: "Quick assessment",
    price: "$0",
    note: "Short instruction preview",
    cta: "Get short instructions",
    href: "/assess/mini",
    features: [
      "5-minute quick assessment",
      "Short personalized AI instructions",
      "No card required",
    ],
    highlighted: false,
  },
  {
    name: "Full INSPIRE report",
    price: "$10",
    note: "One-time payment per assessment",
    cta: "Get your AI instructions",
    href: "/privacy-consent",
    features: [
      "Full personalized AI instructions",
      "Copy-ready AI instructions",
      "Saveable PDF version and share link",
      "No subscription",
    ],
    highlighted: true,
  },
];

export default function Pricing() {
  const { locale, dir } = useI18n();
  const isAr = locale === "ar";
  const href = (path: string) => localizePath(path, locale);
  const plans = isAr
    ? [
        {
          name: "التقييم السريع",
          price: "$0",
          note: "معاينة تعليمات مختصرة",
          cta: "احصل على تعليمات مختصرة",
          href: "/assess/mini",
          features: ["تقييم سريع خلال 5 دقائق", "تعليمات ذكاء اصطناعي مختصرة", "بدون بطاقة دفع"],
          highlighted: false,
        },
        {
          name: "تقرير INSPIRE الكامل",
          price: "$10",
          note: "دفعة واحدة لكل تقييم",
          cta: "احصل على تعليماتك",
          href: "/privacy-consent",
          features: ["تعليمات مخصصة كاملة للذكاء الاصطناعي", "تعليمات جاهزة للنسخ", "نسخة قابلة للحفظ كـ PDF ورابط مشاركة", "بدون اشتراك"],
          highlighted: true,
        },
      ]
    : pricingPlans;
  const copy = isAr
    ? {
        eyebrow: "الأسعار",
        title: "تسعير واضح لتعليمات ذكاء اصطناعي مخصصة",
        intro:
          "INSPIRE يقدّم تجربة رقمية كاملة: تقييم منظم، تعليمات مخصصة للذكاء الاصطناعي، وتوجيهات عملية جاهزة للاستخدام مع أدوات مثل ChatGPT وClaude وGemini.",
        full: "التقرير الكامل",
        perAssessment: "/ تقييم",
        cards: [
          {
            title: "تسليم رقمي",
            body: "يتم إنشاء التقرير والوصول إليه عبر الموقع بعد إكمال المسار.",
          },
          {
            title: "دفع آمن",
            body: "يتم الدفع بالبطاقة بشكل آمن عبر Lemon Squeezy.",
          },
          {
            title: "مخرج إنتاجي عملي",
            body: "التقرير مصمم لمساعدتك على استخدام الذكاء الاصطناعي بوضوح واتساق أعلى.",
          },
          {
            title: "منتج ذاتي جاهز",
            body: "INSPIRE مسار تقييم وتقرير رقمي جاهز. لا يتم بيع استشارات أو خدمات تفصيل مخصصة ضمن هذا المنتج.",
          },
        ],
        terms: "الشروط",
        privacy: "الخصوصية",
        refund: "سياسة الاسترداد",
      }
    : {
        eyebrow: "Pricing",
        title: "Simple pricing for personalized AI instructions",
        intro:
          "INSPIRE delivers a complete digital experience: a structured assessment, personalized AI instructions, and practical guidance for tools such as ChatGPT, Claude, and Gemini.",
        full: "Full report",
        perAssessment: "/ assessment",
        cards: [
          {
            title: "Digital delivery",
            body: "Reports are generated and accessed through the website after completing the flow.",
          },
          {
            title: "Secure checkout",
            body: "Card checkout is handled securely through Lemon Squeezy.",
          },
          {
            title: "Practical productivity output",
            body: "The report is designed to help you use AI with more clarity and consistency.",
          },
          {
            title: "Self-serve product",
            body: "INSPIRE is a premade digital assessment and report flow. It is not a consultation or custom-service purchase.",
          },
        ],
        terms: "Terms",
        privacy: "Privacy",
        refund: "Refund Policy",
      };

  return (
    <div className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8" dir={dir}>
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <CreditCard className="h-4 w-4" />
            {copy.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            {copy.intro}
          </p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {plans.map((plan) => (
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
                    {copy.full}
                  </span>
                )}
              </div>

              <div className="mb-6 flex items-end gap-2">
                <span className="font-display text-5xl font-black text-white">{plan.price}</span>
                {plan.highlighted && <span className="pb-2 text-sm text-slate-400">{copy.perAssessment}</span>}
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
                href={href(plan.href)}
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

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          {copy.cards.map((card, index) => {
            const Icon = [FileText, ShieldCheck, Sparkles, Check][index] ?? FileText;

            return (
              <div key={card.title} className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-5">
                <Icon className="mb-3 h-5 w-5 text-rose-200" />
                <h3 className="font-black text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{card.body}</p>
              </div>
            );
          })}
        </section>

        <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold text-slate-400">
          <Link href={href("/terms")} className="transition-colors hover:text-rose-200">{copy.terms}</Link>
          <Link href={href("/privacy")} className="transition-colors hover:text-rose-200">{copy.privacy}</Link>
          <Link href={href("/refund-policy")} className="transition-colors hover:text-rose-200">{copy.refund}</Link>
        </div>
      </div>
    </div>
  );
}
