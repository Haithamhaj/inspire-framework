import { Link } from "wouter";
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, Sparkles, Target } from "lucide-react";
import { useI18n } from "@/i18n";

const principles = [
  "Personal AI instructions should reflect the user, not a generic prompt template.",
  "Useful AI behavior comes from clear goals, context, preferences, constraints, and quality rules.",
  "A repeatable assessment is easier to trust than guessing what to write in every new chat.",
];

export default function About() {
  const { locale, dir } = useI18n();
  const isAr = locale === "ar";
  const copy = isAr
    ? {
        eyebrow: "عن INSPIRE",
        title: "إطار عملي لبناء تعليمات شخصية للذكاء الاصطناعي",
        intro:
          "INSPIRE هو تقييم رقمي ذاتي يحوّل أهدافك، أسلوب عملك، تفضيلاتك، وحدودك إلى ملف تشغيل قابل للاستخدام مع ChatGPT وClaude وGemini وأدوات الذكاء الاصطناعي المشابهة.",
        principles: [
          "تعليمات الذكاء الاصطناعي الأفضل تبدأ من طريقة عمل المستخدم، لا من قالب عام.",
          "النتائج المفيدة تأتي من وضوح الهدف، السياق، التفضيلات، القيود، وقواعد الجودة.",
          "التقييم المنظم يحوّل هذه الإشارات إلى تعليمات قابلة للتكرار والاستخدام.",
        ],
        solveTitle: "ماذا يضيف INSPIRE؟",
        solveBody: [
          "عندما يعرف الذكاء الاصطناعي سياقك وطريقة تفكيرك، تصبح إجاباته أقرب لما تحتاجه: أوضح، أكثر ارتباطاً بهدفك، وأسهل في التطبيق.",
          "INSPIRE يجمع هذا السياق من خلال تقييم موجه، ثم يحوله إلى تعليمات جاهزة للنسخ، مطالبات بداية، وتقرير رقمي واضح.",
        ],
        researchTitle: "أساس بحثي ومنتج عملي",
        researchBody:
          "يرتبط INSPIRE بعمل INSPIRE & CRAFTS من إعداد هيثم حمادنة، وهو إطار عملي لتخصيص تفاعل الأفراد مع الذكاء الاصطناعي.",
        ssrn: "عرض الورقة على SSRN",
        ctaTitle: "أنشئ ملف تشغيلك للذكاء الاصطناعي",
        ctaBody: "ابدأ بالتقييم السريع المجاني أو راجع صفحة الأسعار للتقرير الرقمي الكامل.",
        quick: "جرّب التقييم السريع المجاني",
        pricing: "عرض الأسعار",
      }
    : {
        eyebrow: "About INSPIRE",
        title: "A practical framework for personal AI instructions",
        intro:
          "INSPIRE Framework is a self-serve digital assessment that turns a person's goals, working style, preferences, and red lines into a reusable AI operating profile for tools such as ChatGPT, Claude, Gemini, and similar assistants.",
        principles,
        solveTitle: "What INSPIRE helps you unlock",
        solveBody: [
          "When AI understands your context and working style, its responses become clearer, more relevant, and easier to use.",
          "INSPIRE collects that context through a guided assessment and converts it into copy-ready instructions, starter prompts, and a readable digital report.",
        ],
        researchTitle: "Research-backed product method",
        researchBody:
          "INSPIRE is connected to the INSPIRE & CRAFTS work by Haitham Hamadneh, a practical framework for individual-level AI interaction customization.",
        ssrn: "View the SSRN paper",
        ctaTitle: "Create your own AI operating profile",
        ctaBody: "Start with the free quick assessment or review the pricing page for the full digital report.",
        quick: "Try the free quick assessment",
        pricing: "View pricing",
      };

  return (
    <div className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8" dir={dir}>
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <Sparkles className="h-4 w-4" />
            {copy.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            {copy.intro}
          </p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {copy.principles.map((principle) => (
            <div key={principle} className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-5">
              <CheckCircle2 className="mb-4 h-5 w-5 text-rose-200" />
              <p className="text-sm leading-7 text-slate-300">{principle}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
            <Target className="mb-4 h-6 w-6 text-rose-200" />
            <h2 className="text-2xl font-black text-white">{copy.solveTitle}</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-300">
              {copy.solveBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
            <BookOpen className="mb-4 h-6 w-6 text-rose-200" />
            <h2 className="text-2xl font-black text-white">{copy.researchTitle}</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-300">
              <p>{copy.researchBody}</p>
              <a
                href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-black text-rose-200 hover:text-rose-100"
              >
                {copy.ssrn}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-6">
          <h2 className="text-2xl font-black text-white">{copy.ctaTitle}</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            {copy.ctaBody}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/assess/mini" className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-400">
              {copy.quick}
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-400/15 bg-slate-950/65 px-5 py-3 text-sm font-black text-white hover:border-rose-300/30">
              {copy.pricing}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
