import { Link, useRoute } from "wouter";
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, FileText, Sparkles } from "lucide-react";
import { useI18n, type Locale } from "@/i18n";
import { localizePath } from "@/lib/locale-paths";

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

const sourceLinks = [
  {
    label: "INSPIRE & CRAFTS research paper",
    href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595",
  },
  {
    label: "OpenAI prompt engineering guide",
    href: "https://platform.openai.com/docs/guides/prompt-engineering/strategy",
  },
  {
    label: "Anthropic Claude prompt engineering docs",
    href: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering",
  },
  {
    label: "Google Vertex AI prompt design strategies",
    href: "https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/prompt-design-strategies",
  },
];

const sourceLinksAr = [
  {
    label: "ورقة INSPIRE & CRAFTS البحثية",
    href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595",
  },
  {
    label: "دليل OpenAI لهندسة المطالبات",
    href: "https://platform.openai.com/docs/guides/prompt-engineering/strategy",
  },
  {
    label: "توثيق Anthropic Claude لهندسة المطالبات",
    href: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering",
  },
  {
    label: "استراتيجيات تصميم المطالبات من Google Vertex AI",
    href: "https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/prompt-design-strategies",
  },
];

const smartPromptCoachUrl =
  "https://chatgpt.com/g/g-67fe5939b39c8191a7ad597fd6fb0192-smart-prompt-engineer-mhnds-lmtlbt-ldhky";

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
          "A strong prompt begins with the result you want: a decision, plan, draft, review, clearer thinking, or next action. The AI model matters, but the working context matters more.",
          "Instead of asking a broad question, define the task, audience, constraints, format, and quality standard.",
        ],
      },
      {
        title: "Give the assistant a working role",
        body: [
          "Generic prompts often produce generic answers. Give the assistant a role that fits the job: strategy reviewer, writing editor, planning partner, customer-support analyst, or technical explainer.",
          "INSPIRE turns this into reusable personalized instructions so you do not rewrite the same context every time.",
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
          "INSPIRE helps separate these layers by producing stable personalized AI instructions and project-aware guidance.",
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
      "A workplace-focused guide to using prompt engineering for planning, writing, clearer thinking, and productivity in GCC teams.",
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
          "This matters in Saudi and GCC teams where AI is increasingly used for communication, clearer thinking, training, planning, and operational work.",
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
        title: "Build reusable personalized instructions",
        body: [
          "Personalized instructions make AI outputs more consistent. They give the assistant rules for tone, structure, risk, detail level, and decision support.",
          "INSPIRE is designed to generate these instructions from a structured assessment rather than guesswork.",
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
    title: "What Are Personalized AI Instructions?",
    description:
      "Personalized AI instructions tell AI tools how to work with your goals, style, boundaries, and preferred response format.",
    keywords: ["personalized AI instructions", "AI work style assessment", "تعليمات مخصصة للذكاء الاصطناعي"],
    example: {
      weak: "Answer in my style.",
      stronger:
        "Work as a concise strategy partner. Start with the recommendation, then give reasoning, trade-offs, and the next action. Avoid filler, unsupported claims, and long option lists.",
    },
    sections: [
      {
        title: "Personalized instructions are more than one prompt",
        body: [
          "A prompt usually asks for one output. Personalized instructions define how the assistant should think, respond, structure work, and avoid mistakes across many tasks.",
          "They act like a lightweight guide for your AI assistant.",
        ],
      },
      {
        title: "What it contains",
        body: [
          "Useful instructions include your goal context, preferred communication style, thinking modes, quality standards, red lines, and examples of useful outputs.",
          "INSPIRE organizes these signals into a copy-ready instruction set and a readable report.",
        ],
      },
      {
        title: "Why it matters",
        body: [
          "Most people lose time because every AI conversation starts from zero. Personalized instructions reduce repetition and help the assistant adapt faster.",
          "For teams, it can also make AI collaboration easier to explain and share.",
        ],
      },
      {
        title: "How it differs from a prompt library",
        body: [
          "A prompt library gives you reusable task templates. Personalized instructions give AI a reusable understanding of how to work with you.",
          "The two can work together: instructions set behavior, while task prompts describe the current job.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are personalized AI instructions the same as a prompt?",
        answer:
          "No. A prompt usually asks for one output. Personalized instructions define repeated behavior across many tasks and conversations.",
      },
      {
        question: "Can I use the same instructions across multiple AI tools?",
        answer:
          "Yes. Well-written instructions can be adapted for ChatGPT, Claude, Gemini, and other assistants, although each tool may have different instruction fields.",
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

const guideArabic: Record<string, Omit<Guide, "slug">> = {
  "how-to-write-better-prompts": {
    title: "كيف تكتب مطالبات أفضل للذكاء الاصطناعي",
    description: "دليل عملي لكتابة مطالبات أوضح مع ChatGPT وClaude وGemini وأدوات الذكاء الاصطناعي المشابهة.",
    keywords: ["كيف أكتب برومبت", "مطالبات الذكاء الاصطناعي", "مطالبات ChatGPT", "هندسة المطالبات"],
    example: {
      weak: "اكتب خطة لمشروعي.",
      stronger:
        "تصرف كشريك تخطيط عملي. أنشئ خطة إطلاق لمدة أسبوعين لمؤسس منفرد يبني منتج إنتاجية بالذكاء الاصطناعي. اذكر الأولويات والمخاطر والخطوات التالية، واجعل الإجابة مختصرة مع توضيح الافتراضات.",
    },
    sections: [
      {
        title: "ابدأ بالنتيجة، لا بالأداة",
        body: [
          "المطالبة القوية تبدأ بالنتيجة التي تريدها: قرار، خطة، مسودة، مراجعة، تفكير أوضح، أو خطوة تالية.",
          "بدلاً من سؤال واسع، حدّد المهمة والجمهور والقيود وشكل المخرجات ومعيار الجودة.",
        ],
      },
      {
        title: "أعط المساعد دوراً واضحاً",
        body: [
          "المطالبات العامة تنتج إجابات عامة. حدّد دوراً يناسب المهمة: مراجع استراتيجي، محرر كتابة، شريك تخطيط، أو محلل دعم عملاء.",
          "INSPIRE يحول هذا الدور إلى تعليمات مخصصة قابلة لإعادة الاستخدام حتى لا تعيد كتابة نفس السياق كل مرة.",
        ],
      },
      {
        title: "أضف القيود وخطوط الجودة",
        body: [
          "المطالبة الجيدة توضّح ما يجب تجنبه: الإطالة، الادعاءات غير المدعومة، اللغة العامة، أو تجاهل المخاطر.",
          "هذه القواعد مهمة في العمل عندما تكون الجودة والنبرة والانضباط في القرار عناصر مؤثرة.",
        ],
      },
      {
        title: "استخدم الأمثلة لضبط الجودة",
        body: [
          "إذا كنت تعرف شكل الإجابة المفيدة، أضف مثالاً قصيراً. المثال يساعد النموذج على فهم البنية والنبرة والعمق بسرعة.",
          "هذا مفيد عندما تريد صيغة محددة مثل ملخص تنفيذي، رسالة ثنائية اللغة، مذكرة قرار، أو قائمة إجراءات.",
        ],
      },
    ],
    faqs: [
      {
        question: "ما الذي يجعل المطالبة أفضل؟",
        answer: "المطالبة الأفضل توضّح النتيجة والدور والسياق والقيود وشكل المخرجات ومعيار الجودة، فتقلل التخمين.",
      },
      {
        question: "هل أحتاج مطالبة مختلفة لكل أداة ذكاء اصطناعي؟",
        answer: "قد تختلف الصياغة قليلاً، لكن نفس التعليمات الأساسية غالباً تعمل مع ChatGPT وClaude وGemini وأدوات مشابهة.",
      },
    ],
  },
  "chatgpt-custom-instructions": {
    title: "ماذا تضع في تعليمات ChatGPT المخصصة",
    description: "دليل عملي لبناء تعليمات تساعد أدوات الذكاء الاصطناعي على فهم هدفك وأسلوبك وتوقعاتك.",
    keywords: ["تعليمات ChatGPT", "تعليمات شات جي بي تي", "تعليمات المساعد", "تخصيص الذكاء الاصطناعي"],
    example: {
      weak: "كن مفيداً ومختصراً.",
      stronger:
        "ابدأ بالإجابة المباشرة، ثم وضّح الخيارات والمفاضلات. اسأل سؤال توضيح فقط عندما تؤثر المعلومة الناقصة على التوصية. تجنب النصائح العامة واربط الاقتراحات بالهدف الحالي.",
    },
    sections: [
      {
        title: "التعليمات تصف طريقة عملك",
        body: [
          "أفضل تعليمات مخصصة ليست سيرة ذاتية. هي توضّح أهدافك، أسلوبك المفضل، عادات القرار، ونوع المخرجات التي تساعدك.",
          "مثلاً: هل تفضل الإجابات المباشرة، الخيارات، المفاضلات، الأمثلة، القوائم، أو الشرح خطوة بخطوة.",
        ],
      },
      {
        title: "افصل السياق الثابت عن تفاصيل المشروع",
        body: [
          "التفضيلات الثابتة مكانها في التعليمات المخصصة. أما تفاصيل المشروع المؤقتة فالأفضل أن تبقى داخل المحادثة الحالية.",
          "INSPIRE يساعدك على فصل هذه الطبقات عبر تعليمات مخصصة ثابتة ومطالبات بداية مرتبطة بسياقك.",
        ],
      },
      {
        title: "حوّل التعليمات إلى نظام جودة",
        body: [
          "مجموعة التعليمات الجيدة تخبر المساعد كيف يتعامل مع عدم اليقين، متى يسأل، وكيف يرتّب الإجابة.",
          "هذا يحسن الاتساق عبر ChatGPT وClaude وGemini وأدوات مشابهة.",
        ],
      },
      {
        title: "حافظ على التعليمات خفيفة وواضحة",
        body: [
          "التعليمات الدائمة يجب أن تشمل نمط الإجابة، النبرة، الشكل، مستوى التفصيل، وحدود الجودة.",
          "تجنب تكديس معلومات مؤقتة تجعل التعليمات أقل دقة مع الوقت.",
        ],
      },
    ],
    faqs: [
      {
        question: "ماذا أضع في تعليمات ChatGPT؟",
        answer: "ضع أهدافك، أسلوب الإجابة المفضل، شكل المخرجات، قواعد الجودة، وما تريد من المساعد أن يتجنبه.",
      },
      {
        question: "هل أضع معلومات شخصية كثيرة؟",
        answer: "ضع فقط المعلومات التي تحسن جودة العمل. تجنب التفاصيل الحساسة التي لا يحتاجها المساعد.",
      },
    ],
  },
  "prompt-engineering-for-work": {
    title: "هندسة المطالبات للعمل في السعودية والخليج",
    description: "دليل عملي لاستخدام هندسة المطالبات في التخطيط والكتابة والتفكير الأوضح والإنتاجية داخل فرق العمل.",
    keywords: ["هندسة المطالبات للعمل", "الذكاء الاصطناعي في السعودية", "إنتاجية الذكاء الاصطناعي", "استخدام AI في العمل"],
    example: {
      weak: "لخّص هذا الاجتماع.",
      stronger:
        "لخّص هذا الاجتماع لفريق عمليات في السعودية. افصل بين القرارات، الأسئلة المفتوحة، المخاطر، والخطوات التالية حسب المسؤول. حافظ على الأسماء العربية كما هي، وأبقِ المصطلحات التقنية الإنجليزية عند الحاجة.",
    },
    sections: [
      {
        title: "مطالبات العمل تحتاج سياقاً تجارياً",
        body: [
          "في العمل، المطالبة يجب أن تشمل الهدف والجمهور والقيود ومعايير القرار وشكل المخرجات المتوقع.",
          "هذا مهم في السعودية والخليج حيث يستخدم الذكاء الاصطناعي في التواصل والتفكير الأوضح والتدريب والتخطيط والعمل التشغيلي.",
        ],
      },
      {
        title: "أعلى الاستخدامات قيمة",
        body: [
          "من الاستخدامات المفيدة: تلخيص المستندات، تجهيز ملخصات الاجتماعات، مراجعة العروض، صياغة رسائل ثنائية اللغة، بناء الخطط، واختبار الافتراضات.",
          "القيمة الحقيقية تأتي من تعليمات قابلة للتكرار، لا من حيل مؤقتة في صياغة المطالبة.",
        ],
      },
      {
        title: "ابنِ تعليمات مخصصة قابلة لإعادة الاستخدام",
        body: [
          "التعليمات المخصصة الشخصية أو الجماعية تجعل مخرجات الذكاء الاصطناعي أكثر اتساقاً، لأنها تحدد النبرة والبنية والمخاطر ومستوى التفصيل.",
          "INSPIRE مصمم لتوليد هذه التعليمات من تقييم منظّم بدلاً من التخمين.",
        ],
      },
      {
        title: "استخدم التعليمات ثنائية اللغة بوعي",
        body: [
          "كثير من بيئات العمل في الخليج تتحرك بين العربية والإنجليزية. لذلك يجب تحديد متى نترجم، ومتى نحافظ على المصطلح، ولمن تُكتب المخرجات.",
          "هذا يحافظ على طبيعية التواصل ويقلل الترجمة الحرفية الضعيفة.",
        ],
      },
    ],
    faqs: [
      {
        question: "لماذا تهم هندسة المطالبات في العمل؟",
        answer: "لأن مخرجات العمل تؤثر على قرارات وعملاء وتنسيق داخلي. وضوح السياق والقيود يرفع جودة النتائج.",
      },
      {
        question: "ما أفضل استخدامات الذكاء الاصطناعي في العمل؟",
        answer: "ملخصات الاجتماعات، تلخيص المستندات، مراجعة العروض، التواصل ثنائي اللغة، التخطيط، وتجميع البحث لدعم القرار.",
      },
    ],
  },
  "ai-operating-profile": {
    title: "ما هي تعليمات الذكاء الاصطناعي المخصصة؟",
    description: "تعليمات الذكاء الاصطناعي المخصصة توضّح للذكاء الاصطناعي كيف يعمل مع أهدافك وأسلوبك وحدودك.",
    keywords: ["تعليمات مخصصة للذكاء الاصطناعي", "تقييم أسلوب العمل", "personalized AI instructions"],
    example: {
      weak: "أجب بأسلوبي.",
      stronger:
        "اعمل كشريك استراتيجي مختصر. ابدأ بالتوصية، ثم وضّح المنطق والمفاضلات والخطوة التالية. تجنب الحشو والادعاءات غير المدعومة والقوائم الطويلة.",
    },
    sections: [
      {
        title: "التعليمات المخصصة أكثر من مطالبة واحدة",
        body: [
          "المطالبة تطلب مخرجاً واحداً غالباً. أما التعليمات المخصصة فتحدد كيف يفكر المساعد ويرد ويرتب العمل ويتجنب الأخطاء عبر مهام متعددة.",
          "هي أشبه بدليل خفيف لمساعدك الذكي.",
        ],
      },
      {
        title: "ماذا يحتوي؟",
        body: [
          "التعليمات المفيدة تشمل سياق الهدف، أسلوب التواصل المفضل، أنماط التفكير، معايير الجودة، الخطوط الحمراء، وأمثلة على المخرجات المفيدة.",
          "INSPIRE يرتب هذه الإشارات في تعليمات قابلة للنسخ وتقرير واضح.",
        ],
      },
      {
        title: "لماذا يهم؟",
        body: [
          "كثير من الناس يضيعون وقتاً لأن كل محادثة تبدأ من الصفر. التعليمات المخصصة تقلل التكرار وتساعد المساعد على التكيف أسرع.",
          "وبالنسبة للفرق، يسهل شرح طريقة التعاون مع الذكاء الاصطناعي ومشاركتها.",
        ],
      },
      {
        title: "كيف يختلف عن مكتبة المطالبات؟",
        body: [
          "مكتبة المطالبات تعطيك قوالب للمهام. التعليمات المخصصة تعطي المساعد فهماً متكرراً لطريقة العمل معك.",
          "يمكن الجمع بين الاثنين: التعليمات تحدد السلوك، والمطالبة تصف المهمة الحالية.",
        ],
      },
    ],
    faqs: [
      {
        question: "هل التعليمات المخصصة هي نفسها البرومبت؟",
        answer: "لا. البرومبت يطلب غالباً نتيجة واحدة، أما التعليمات المخصصة فتحدد سلوكاً متكرراً عبر مهام ومحادثات كثيرة.",
      },
      {
        question: "هل أستطيع استخدام نفس التعليمات مع أكثر من أداة؟",
        answer: "نعم. يمكن تكييف التعليمات الجيدة مع ChatGPT وClaude وGemini، مع مراعاة اختلاف مكان إدخال التعليمات في كل أداة.",
      },
    ],
  },
  "arabic-ai-prompts": {
    title: "مطالبات عربية وتعليمات ثنائية اللغة للذكاء الاصطناعي",
    description: "كيف يكتب المستخدم العربي مطالبات أوضح ويستخدم تعليمات ثنائية اللغة مع ChatGPT وClaude وGemini.",
    keywords: ["برومبت عربي", "مطالبات عربية", "تعليمات شات جي بي تي", "هندسة الأوامر"],
    example: {
      weak: "اكتب لي برومبت للتسويق.",
      stronger:
        "تصرف كخبير تسويق عملي. اكتب برومبت يساعدني أجهز حملة لمنتج رقمي في السعودية. اذكر الجمهور، الرسالة، القنوات، المخاطر، وخطوات التنفيذ. استخدم العربية الواضحة وحافظ على المصطلحات التقنية الإنجليزية عند الحاجة.",
    },
    sections: [
      {
        title: "المطالبات العربية تحتاج وضوحاً لا ترجمة حرفية",
        body: [
          "المطالبة العربية الجيدة توضّح المهمة والنبرة والجمهور وشكل المخرجات. الترجمة الحرفية من قوالب إنجليزية قد تضعف النتيجة.",
          "استخدم لغة مباشرة، حدّد الدور، واذكر هل تريد الإجابة بالعربية أو الإنجليزية أو باللغتين.",
        ],
      },
      {
        title: "العمل ثنائي اللغة يستفيد من تعليمات ثابتة",
        body: [
          "كثير من مستخدمي الخليج ينتقلون بين العربية والإنجليزية في العمل. التعليمات الثابتة تحدد متى نحافظ على المصطلحات الإنجليزية ومتى نشرح بالعربية.",
          "هذا مفيد في الأعمال والتقنية والتعليم والعمليات.",
        ],
      },
      {
        title: "INSPIRE يدعم استخداماً ثنائي اللغة",
        body: [
          "يمكن لـ INSPIRE توليد تقارير وتعليمات لمستخدمين يعملون بين العربية والإنجليزية.",
          "الهدف ليس الترجمة فقط، بل مواءمة طريقة عملك مع طريقة استجابة الذكاء الاصطناعي.",
        ],
      },
      {
        title: "تجنب الأوامر العربية العامة",
        body: [
          "أوامر قصيرة مثل “اكتب لي برومبت” تنتج غالباً إجابات عامة. أضف الجمهور والهدف والسياق والنبرة وشكل المخرجات والحدود.",
          "إذا كان العمل ثنائي اللغة، قل بوضوح أي المصطلحات تبقى بالإنجليزية وما لغة النتيجة النهائية.",
        ],
      },
    ],
    faqs: [
      {
        question: "هل الأفضل أكتب البرومبت بالعربي أم بالإنجليزي؟",
        answer: "اكتب باللغة التي تناسب المخرجات المطلوبة. إذا كان العمل عربياً أو موجهاً لجمهور عربي، فالوضوح بالعربية أهم من الترجمة الحرفية.",
      },
      {
        question: "كيف أحسن نتائج ChatGPT بالعربي؟",
        answer: "حدد الدور، الهدف، الجمهور، النبرة، شكل المخرجات، والكلمات التي يجب الحفاظ عليها بالإنجليزية عند الحاجة.",
      },
    ],
  },
};

function getLocalizedGuide(guide: Guide, locale: Locale): Guide {
  if (locale !== "ar") return guide;
  const localized = guideArabic[guide.slug];
  return localized ? { slug: guide.slug, ...localized } : guide;
}

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}

function GuideCard({ guide, locale }: { guide: Guide; locale: Locale }) {
  return (
    <Link
      href={localizePath(`/guides/${guide.slug}`, locale)}
      className="group rounded-2xl border border-slate-400/10 bg-slate-950/50 p-5 transition-colors hover:border-rose-300/30 hover:bg-slate-900/65"
    >
      <BookOpen className="mb-4 h-5 w-5 text-rose-200" />
      <h2 className="text-xl font-black text-white group-hover:text-rose-100">{guide.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">{guide.description}</p>
      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-rose-200">
        {locale === "ar" ? "للمزيد" : "Read guide"}
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

function GuidesIndex() {
  const { locale, dir } = useI18n();
  const localizedGuides = guides.map((guide) => getLocalizedGuide(guide, locale));

  return (
    <div className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8" dir={dir}>
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <Sparkles className="h-4 w-4" />
            {locale === "ar" ? "أدلة عملية" : "AI prompt guides"}
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            {locale === "ar" ? "أدلة عملية لكتابة تعليمات أفضل للذكاء الاصطناعي" : "Practical guides for better AI prompts and instructions"}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            {locale === "ar"
              ? "تعرّف على طريقة كتابة مطالبات أوضح، واستخدام تعليمات ChatGPT، وبناء تعليمات مخصصة للذكاء الاصطناعي تناسب العمل في السعودية والخليج والسياقات العربية/الإنجليزية."
              : "Learn how to write better prompts, use ChatGPT custom instructions, and build personalized AI instructions for work in Saudi Arabia, the GCC, and bilingual Arabic/English contexts."}
          </p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {localizedGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} locale={locale} />
          ))}
        </section>
      </div>
    </div>
  );
}

function GuideDetail({ guide }: { guide: Guide }) {
  const { locale, dir } = useI18n();
  const localizedGuide = getLocalizedGuide(guide, locale);
  const links = locale === "ar" ? sourceLinksAr : sourceLinks;
  const href = (path: string) => localizePath(path, locale);

  return (
    <article className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8" dir={dir}>
      <div className="mx-auto max-w-3xl">
        <Link href={href("/guides")} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-rose-200">
          <ArrowRight className="h-4 w-4 rotate-180" />
          {locale === "ar" ? "كل الأدلة" : "All guides"}
        </Link>

        <header>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <FileText className="h-4 w-4" />
            {locale === "ar" ? "دليل INSPIRE" : "INSPIRE guide"}
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            {localizedGuide.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">{localizedGuide.description}</p>
        </header>

        <div className="mt-8 flex flex-wrap gap-2">
          {localizedGuide.keywords.map((keyword) => (
            <span key={keyword} className="rounded-full border border-slate-400/10 bg-slate-950/55 px-3 py-1 text-xs font-bold text-slate-300">
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-10 space-y-8">
          {localizedGuide.sections.map((section) => (
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
          <h2 className="text-2xl font-black text-white">{locale === "ar" ? "مثال على تحسين المطالبة" : "Example prompt upgrade"}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {locale === "ar"
              ? "كل مثال يوضح النمط نفسه الذي يستخدمه INSPIRE لتحويل الطلب العام إلى تعليمات قابلة للاستخدام: توضيح الدور، المهمة، السياق، القيود، شكل المخرجات، وقواعد الجودة."
              : "Each upgrade shows the same pattern INSPIRE uses when turning a vague request into a usable instruction: clarify the role, task, context, constraints, output format, and quality rules."}
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-red-300/10 bg-red-500/[0.05] p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-red-200">{locale === "ar" ? "طلب عام" : "Weak prompt"}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{localizedGuide.example.weak}</p>
            </div>
            <div className="rounded-xl border border-emerald-300/10 bg-emerald-500/[0.06] p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-emerald-200">{locale === "ar" ? "تعليمات أقوى" : "Stronger prompt"}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{localizedGuide.example.stronger}</p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-6">
          <h2 className="text-2xl font-black text-white">
            {locale === "ar" ? "طبّق CRAFTS على مطالبتك" : "Apply CRAFTS to your prompt"}
          </h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            {locale === "ar"
              ? "استخدم مهندس المطالبات الذكي لترتيب السياق، الدور، الجمهور، الشكل، النبرة، والهدف في مطالبة واضحة قابلة للتجربة."
              : "Use Smart Prompt Coach to organize context, role, audience, format, tone, and goal into a clear prompt you can test with ChatGPT, Claude, Gemini, or another AI model."}
          </p>
          <a
            href={smartPromptCoachUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300/25 bg-slate-950/65 px-5 py-3 text-sm font-black text-rose-100 hover:border-rose-200/40 hover:bg-slate-900/80"
          >
            {locale === "ar" ? "افتح مهندس المطالبات الذكي" : "Open Smart Prompt Coach"}
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
          <h2 className="text-2xl font-black text-white">{locale === "ar" ? "المنهج والمراجع" : "Method and references"}</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            {locale === "ar"
              ? "يجمع هذا الدليل بين منهج INSPIRE، والخلفية البحثية لـ INSPIRE & CRAFTS، وإرشادات تصميم المطالبات من مزودي منصات الذكاء الاصطناعي."
              : "This guide combines INSPIRE's product method with the INSPIRE & CRAFTS research background and official prompt-design guidance from AI platform providers."}
          </p>
          <div className="mt-5 grid gap-3">
            {links.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-black text-rose-200 hover:text-rose-100"
              >
                {source.label}
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
          <h2 className="text-2xl font-black text-white">{locale === "ar" ? "أسئلة شائعة" : "FAQ"}</h2>
          <div className="mt-5 space-y-5">
            {localizedGuide.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-black text-white">{faq.question}</h3>
                <p className="mt-2 text-base leading-8 text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-6">
          <h2 className="text-2xl font-black text-white">{locale === "ar" ? "حوّل هذا إلى تعليماتك الخاصة" : "Turn this into your own AI instructions"}</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            {locale === "ar"
              ? "INSPIRE يحوّل أهدافك وأسلوب عملك وتفضيلاتك وحدودك إلى تعليمات مخصصة قابلة للاستخدام مع الذكاء الاصطناعي."
              : "INSPIRE converts your goals, work style, preferences, and red lines into reusable personalized AI instructions."}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href={href("/assess/mini")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-400/15 bg-slate-950/65 px-5 py-3 text-sm font-black text-white hover:border-rose-300/30">
              {locale === "ar" ? "احصل على تعليمات مختصرة" : "Get short instructions"}
            </Link>
            <Link href={href("/pricing")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-400">
              {locale === "ar" ? "عرض الأسعار" : "View pricing"}
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
  const [, arParams] = useRoute("/ar/guides/:slug");
  const slug = params?.slug ?? arParams?.slug;
  if (!slug) return <GuidesIndex />;

  const guide = getGuideBySlug(slug);
  if (!guide) return <GuidesIndex />;

  return <GuideDetail guide={guide} />;
}

export { guides };
