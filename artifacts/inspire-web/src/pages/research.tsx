import { Link } from "wouter";
import { ArrowRight, ExternalLink, FileText, Layers, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";
import { localizePath } from "@/lib/locale-paths";

const researchPoints = [
  "INSPIRE focuses on defining the user's AI interaction preferences and operating style.",
  "CRAFTS focuses on turning context and intent into practical prompt-engineering structure.",
  "Together, the frameworks support more repeatable and personalized AI collaboration.",
];

export default function Research() {
  const { locale, dir } = useI18n();
  const isAr = locale === "ar";
  const href = (path: string) => localizePath(path, locale);
  const copy = isAr
    ? {
        eyebrow: "الأساس البحثي",
        title: "خلفية INSPIRE & CRAFTS البحثية",
        intro:
          "يعتمد INSPIRE Framework على ورقة “Inspire & Crafts: A Dual Framework for Individual AI Interaction Customization” من إعداد هيثم حمادنة والمتاحة على SSRN.",
        summaryTitle: "ملخص مبسط",
        summary: [
          "توضح الورقة طريقة عملية لتخصيص تعامل الأفراد مع المساعدات الذكية، من خلال تحديد الأهداف والأسلوب والتفضيلات وقواعد التفاعل ومعايير الجودة.",
          "يحوّل INSPIRE هذه الفكرة إلى منتج عملي: يطرح أسئلة منظمة، يلتقط الإشارات المهمة، ثم ينتج ملف تشغيل وتعليمات قابلة للاستخدام.",
        ],
        points: [
          "INSPIRE يركز على تفضيلات المستخدم وأسلوب تشغيله مع الذكاء الاصطناعي.",
          "CRAFTS ينظم السياق والنية في بنية مطالبة عملية.",
          "معاً، يدعمان تعاوناً أوضح وأكثر تخصيصاً مع الذكاء الاصطناعي.",
        ],
        ssrn: "فتح صفحة SSRN",
        doi: "فتح DOI",
        ctaTitle: "من البحث إلى تعليمات قابلة للاستخدام",
        ctaBody:
          "الهدف العملي هو أن يخرج المستخدم بتعليمات جاهزة للنسخ يمكن استخدامها في العمل، الدراسة، التخطيط، الكتابة، والتحليل.",
        about: "تعرّف على INSPIRE",
        guides: "استكشف الأدلة",
      }
    : {
        eyebrow: "Research basis",
        title: "INSPIRE & CRAFTS research background",
        intro:
          "INSPIRE Framework is informed by the paper “Inspire & Crafts: A Dual Framework for Individual AI Interaction Customization,” authored by Haitham Hamadneh and available on SSRN.",
        summaryTitle: "Plain-language summary",
        summary: [
          "The research presents a practical way to customize how AI assistants work with individuals by defining goals, style, preferences, interaction rules, and quality standards.",
          "INSPIRE turns this idea into a product: it asks structured questions, identifies useful signals, and produces a reusable AI operating profile and prompt instructions.",
        ],
        points: researchPoints,
        ssrn: "Open SSRN page",
        doi: "Open DOI",
        ctaTitle: "From research to usable instructions",
        ctaBody:
          "The product goal is practical: help users leave with copy-ready AI instructions they can use in real work, study, planning, writing, and analysis workflows.",
        about: "Learn about INSPIRE",
        guides: "Explore the guides",
      };

  return (
    <div className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8" dir={dir}>
      <article className="mx-auto max-w-4xl">
        <header>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <FileText className="h-4 w-4" />
            {copy.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            {copy.intro}
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
          <Sparkles className="mb-4 h-6 w-6 text-rose-200" />
          <h2 className="text-2xl font-black text-white">{copy.summaryTitle}</h2>
          <div className="mt-4 space-y-4 text-base leading-8 text-slate-300">
            {copy.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-400"
            >
              {copy.ssrn}
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://dx.doi.org/10.2139/ssrn.5358595"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-400/15 bg-slate-950/65 px-5 py-3 text-sm font-black text-white hover:border-rose-300/30"
            >
              {copy.doi}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {copy.points.map((point) => (
            <div key={point} className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-5">
              <Layers className="mb-4 h-5 w-5 text-rose-200" />
              <p className="text-sm leading-7 text-slate-300">{point}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-6">
          <h2 className="text-2xl font-black text-white">{copy.ctaTitle}</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            {copy.ctaBody}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href={href("/about")} className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-400">
              {copy.about}
            </Link>
            <Link href={href("/guides")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-400/15 bg-slate-950/65 px-5 py-3 text-sm font-black text-white hover:border-rose-300/30">
              {copy.guides}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
