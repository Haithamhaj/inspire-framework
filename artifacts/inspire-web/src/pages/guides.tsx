import { Link, useRoute } from "wouter";
import { ArrowRight, BookOpen, CheckCircle2, FileText, Sparkles } from "lucide-react";

type Guide = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  example: {
    weak: string;
    stronger: string;
  };
  sections: Array<{
    title: string;
    body: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

const guides: Guide[] = [
  {
    slug: "how-to-write-better-prompts",
    title: "How to Write Better Prompts for AI",
    description:
      "A practical guide to writing better prompts for ChatGPT, Claude, Gemini, and other AI assistants.",
    keywords: ["how to write better prompts", "AI prompts", "ChatGPT prompts", "كيف أكتب برومبت"],
    example: {
      weak: "Write a plan for my project.",
      stronger:
        "Act as a practical planning partner. Create a 2-week launch plan for a solo founder building an AI productivity product. Include priorities, risks, and next actions. Keep it concise and flag assumptions.",
    },
    sections: [
      {
        title: "Start with the outcome, not the tool",
        body: [
          "A strong prompt begins with the result you want: a decision, plan, draft, review, analysis, or next action. The AI model matters, but the operating context matters more.",
          "Instead of asking a broad question, define the task, audience, constraints, format, and quality standard.",
        ],
      },
      {
        title: "Give the assistant a working role",
        body: [
          "Generic prompts often produce generic answers. Give the assistant a role that fits the job: strategy reviewer, writing editor, planning partner, customer-support analyst, or technical explainer.",
          "INSPIRE turns this into a reusable operating profile so you do not rewrite the same context every time.",
        ],
      },
      {
        title: "Add constraints and red lines",
        body: [
          "Good prompts say what the AI should avoid: long lists, unsupported claims, jargon, vague advice, or skipping risks.",
          "These red lines are especially useful for work contexts where quality, tone, and decision discipline matter.",
        ],
      },
      {
        title: "Use examples to calibrate quality",
        body: [
          "If you already know what a useful answer looks like, include a short example. Examples help the model understand structure, tone, and depth faster than abstract instructions.",
          "This is especially effective when you want a specific format: an executive summary, bilingual email, decision memo, customer reply, or action checklist.",
        ],
      },
    ],
    faqs: [
      {
        question: "What makes a prompt better?",
        answer:
          "A better prompt gives the AI a clear outcome, role, context, constraints, format, and quality standard. The goal is to reduce guessing.",
      },
      {
        question: "Do I need a different prompt for every AI tool?",
        answer:
          "The exact wording may change, but the same core instructions can usually work across ChatGPT, Claude, Gemini, and similar assistants.",
      },
    ],
  },
  {
    slug: "chatgpt-custom-instructions",
    title: "ChatGPT Custom Instructions: What to Include",
    description:
      "Learn what to put in ChatGPT custom instructions so AI tools understand your goals, style, and expectations.",
    keywords: ["ChatGPT custom instructions", "تعليمات ChatGPT", "AI assistant instructions"],
    example: {
      weak: "Be helpful and concise.",
      stronger:
        "Give direct answers first, then explain trade-offs. Ask a clarifying question only when the missing detail changes the recommendation. Avoid generic advice and tie suggestions to my current goal.",
    },
    sections: [
      {
        title: "Custom instructions should describe how you work",
        body: [
          "The best custom instructions are not a biography. They explain your goals, preferred style, decision habits, and what kind of output helps you move forward.",
          "For example: whether you prefer direct answers, options, trade-offs, examples, checklists, or step-by-step reasoning.",
        ],
      },
      {
        title: "Separate context from commands",
        body: [
          "Permanent instructions should include stable preferences. Temporary project details should stay in the current chat.",
          "INSPIRE helps separate these layers by producing a stable AI operating profile and project-aware starter prompts.",
        ],
      },
      {
        title: "Use instructions as a quality system",
        body: [
          "A good instruction set tells the assistant how to handle uncertainty, when to ask questions, and how to structure answers.",
          "This improves consistency across ChatGPT, Claude, Gemini, and similar tools.",
        ],
      },
      {
        title: "Keep stable preferences separate",
        body: [
          "Stable preferences belong in custom instructions: answer length, tone, formatting, risk tolerance, and preferred decision style.",
          "Temporary project facts should stay in the chat so your permanent instructions do not become cluttered or outdated.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should I put in ChatGPT custom instructions?",
        answer:
          "Include your goals, preferred answer style, formatting preferences, quality rules, and things the assistant should avoid.",
      },
      {
        question: "Should custom instructions include personal details?",
        answer:
          "Only include details that improve the work. Avoid sensitive information that the assistant does not need to answer well.",
      },
    ],
  },
  {
    slug: "prompt-engineering-for-work",
    title: "Prompt Engineering for Work in Saudi Arabia and the GCC",
    description:
      "A workplace-focused guide to using prompt engineering for planning, writing, analysis, and productivity in GCC teams.",
    keywords: ["prompt engineering for work", "AI productivity GCC", "استخدام الذكاء الاصطناعي في العمل"],
    example: {
      weak: "Summarize this meeting.",
      stronger:
        "Summarize this meeting for a Saudi operations team. Separate decisions, open questions, risks, and owner-specific next actions. Keep Arabic names as written and preserve English technical terms.",
    },
    sections: [
      {
        title: "Work prompts need business context",
        body: [
          "In the workplace, prompts should include the goal, audience, constraints, decision criteria, and expected format.",
          "This matters in Saudi and GCC teams where AI is increasingly used for communication, analysis, training, planning, and operational work.",
        ],
      },
      {
        title: "The highest-value use cases",
        body: [
          "Useful prompt patterns include summarizing documents, preparing meeting briefs, reviewing proposals, drafting bilingual communication, building plans, and checking assumptions.",
          "The real advantage comes from repeatable instructions, not one-off prompt tricks.",
        ],
      },
      {
        title: "Build a reusable operating profile",
        body: [
          "A personal or team operating profile makes AI outputs more consistent. It gives the assistant rules for tone, structure, risk, detail level, and decision support.",
          "INSPIRE is designed to generate this profile from a structured assessment rather than guesswork.",
        ],
      },
      {
        title: "Use bilingual instructions deliberately",
        body: [
          "Many Saudi and GCC workflows move between Arabic and English. Prompt instructions should define when to translate, when to preserve terms, and what audience the output is for.",
          "This avoids awkward literal translation and keeps business communication more natural.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why does prompt engineering matter at work?",
        answer:
          "Work prompts carry more risk because outputs often affect decisions, customers, or internal alignment. Clear context and constraints improve usefulness.",
      },
      {
        question: "What are good workplace AI use cases?",
        answer:
          "Common use cases include meeting briefs, document summaries, proposal reviews, bilingual communication, planning, research synthesis, and decision support.",
      },
    ],
  },
  {
    slug: "ai-operating-profile",
    title: "What Is an AI Operating Profile?",
    description:
      "An AI operating profile is a reusable instruction layer that tells AI tools how to work with your goals, style, and constraints.",
    keywords: ["AI operating profile", "AI work style assessment", "تعليمات مخصصة للذكاء الاصطناعي"],
    example: {
      weak: "Answer in my style.",
      stronger:
        "Work as a concise strategy partner. Start with the recommendation, then give reasoning, trade-offs, and the next action. Avoid filler, unsupported claims, and long option lists.",
    },
    sections: [
      {
        title: "A profile is more than a prompt",
        body: [
          "A prompt usually asks for one output. An AI operating profile defines how the assistant should think, respond, structure work, and avoid mistakes across many tasks.",
          "It acts like a lightweight operating manual for your AI assistant.",
        ],
      },
      {
        title: "What it contains",
        body: [
          "A useful profile includes your goal context, preferred communication style, thinking modes, quality standards, red lines, and examples of useful outputs.",
          "INSPIRE organizes these signals into a copy-ready instruction set and a readable report.",
        ],
      },
      {
        title: "Why it matters",
        body: [
          "Most people lose time because every AI conversation starts from zero. A profile reduces repetition and helps the assistant adapt faster.",
          "For teams, it can also make AI collaboration easier to explain and share.",
        ],
      },
      {
        title: "How it differs from a prompt library",
        body: [
          "A prompt library gives you reusable task templates. An operating profile gives the AI a reusable understanding of how to work with you.",
          "The two can work together: the profile sets behavior, while task prompts describe the current job.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is an AI operating profile the same as a prompt?",
        answer:
          "No. A prompt usually asks for one output. An operating profile defines repeated behavior across many tasks and conversations.",
      },
      {
        question: "Can I use one profile across multiple AI tools?",
        answer:
          "Yes. A well-written profile can be adapted for ChatGPT, Claude, Gemini, and other assistants, although each tool may have different instruction fields.",
      },
    ],
  },
  {
    slug: "arabic-ai-prompts",
    title: "Arabic AI Prompts and Bilingual AI Instructions",
    description:
      "How Arabic-speaking users can write better AI prompts and use bilingual instructions with ChatGPT, Claude, and Gemini.",
    keywords: ["Arabic AI prompts", "برومبت عربي", "تعليمات شات جي بي تي", "هندسة الأوامر"],
    example: {
      weak: "اكتب لي برومبت للتسويق.",
      stronger:
        "تصرف كخبير تسويق عملي. اكتب برومبت يساعدني أجهز حملة لمنتج رقمي في السعودية. اذكر الجمهور، الرسالة، القنوات، المخاطر، وخطوات التنفيذ. استخدم العربية الواضحة وحافظ على المصطلحات التقنية الإنجليزية عند الحاجة.",
    },
    sections: [
      {
        title: "Arabic prompts need clarity, not literal translation",
        body: [
          "Good Arabic prompts should be clear about the task, tone, audience, and output format. Literal translation from English prompt templates often weakens the result.",
          "Use direct wording, define the role, and specify whether the answer should be Arabic, English, or bilingual.",
        ],
      },
      {
        title: "Bilingual work benefits from stable instructions",
        body: [
          "Many GCC users switch between Arabic and English at work. Stable instructions can tell the AI when to preserve English terms and when to explain in Arabic.",
          "This is especially useful for business, technology, education, and operations contexts.",
        ],
      },
      {
        title: "INSPIRE supports bilingual AI usage",
        body: [
          "INSPIRE can produce reports and instructions for users who work across Arabic and English contexts.",
          "The goal is not just translation; it is better alignment between your work style and the way AI responds.",
        ],
      },
      {
        title: "Avoid vague Arabic commands",
        body: [
          "Short Arabic commands such as “اكتب لي برومبت” often produce generic answers. Add the audience, goal, context, tone, output format, and boundaries.",
          "If the work is bilingual, say which terms should stay in English and whether the final answer should be Arabic, English, or mixed.",
        ],
      },
    ],
    faqs: [
      {
        question: "هل الأفضل أكتب البرومبت بالعربي أم بالإنجليزي؟",
        answer:
          "اكتب باللغة التي تناسب المخرجات المطلوبة. إذا كان العمل عربي أو موجه لجمهور عربي، فالوضوح بالعربية أهم من الترجمة الحرفية من الإنجليزية.",
      },
      {
        question: "كيف أحسن نتائج ChatGPT بالعربي؟",
        answer:
          "حدد الدور، الهدف، الجمهور، النبرة، شكل المخرجات، والكلمات التي يجب الحفاظ عليها بالإنجليزية إن وجدت.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group rounded-2xl border border-slate-400/10 bg-slate-950/50 p-5 transition-colors hover:border-rose-300/30 hover:bg-slate-900/65"
    >
      <BookOpen className="mb-4 h-5 w-5 text-rose-200" />
      <h2 className="text-xl font-black text-white group-hover:text-rose-100">{guide.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">{guide.description}</p>
      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-rose-200">
        Read guide
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

function GuidesIndex() {
  return (
    <div className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <Sparkles className="h-4 w-4" />
            AI prompt guides
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            Practical guides for better AI prompts and instructions
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Learn how to write better prompts, use ChatGPT custom instructions, and build an AI operating profile for work in Saudi Arabia, the GCC, and bilingual Arabic/English contexts.
          </p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {guides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </section>
      </div>
    </div>
  );
}

function GuideDetail({ guide }: { guide: Guide }) {
  return (
    <article className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/guides" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-rose-200">
          <ArrowRight className="h-4 w-4 rotate-180" />
          All guides
        </Link>

        <header>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <FileText className="h-4 w-4" />
            INSPIRE guide
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">{guide.description}</p>
        </header>

        <div className="mt-8 flex flex-wrap gap-2">
          {guide.keywords.map((keyword) => (
            <span key={keyword} className="rounded-full border border-slate-400/10 bg-slate-950/55 px-3 py-1 text-xs font-bold text-slate-300">
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-10 space-y-8">
          {guide.sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
              <h2 className="text-2xl font-black text-white">{section.title}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-slate-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
          <h2 className="text-2xl font-black text-white">Example prompt upgrade</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-red-300/10 bg-red-500/[0.05] p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-red-200">Weak prompt</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{guide.example.weak}</p>
            </div>
            <div className="rounded-xl border border-emerald-300/10 bg-emerald-500/[0.06] p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-emerald-200">Stronger prompt</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{guide.example.stronger}</p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
          <h2 className="text-2xl font-black text-white">FAQ</h2>
          <div className="mt-5 space-y-5">
            {guide.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-black text-white">{faq.question}</h3>
                <p className="mt-2 text-base leading-8 text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-6">
          <h2 className="text-2xl font-black text-white">Turn this into your own AI instructions</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            INSPIRE converts your goals, work style, preferences, and red lines into a reusable AI operating profile.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/assess/mini" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-400/15 bg-slate-950/65 px-5 py-3 text-sm font-black text-white hover:border-rose-300/30">
              Try the free quick assessment
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-400">
              View pricing
              <CheckCircle2 className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}

export default function Guides() {
  const [, params] = useRoute("/guides/:slug");
  const slug = params?.slug;
  if (!slug) return <GuidesIndex />;

  const guide = getGuideBySlug(slug);
  if (!guide) return <GuidesIndex />;

  return <GuideDetail guide={guide} />;
}

export { guides };
