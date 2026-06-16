import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteUrl = "https://inspire.next-stepai.com";
const imageUrl = `${siteUrl}/opengraph.jpg`;
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const here = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(here, "..");
const outDir = path.resolve(projectDir, "dist/public");
const templatePath = path.join(outDir, "index.html");

const sourceLinks = [
  "INSPIRE & CRAFTS research paper",
  "OpenAI prompt engineering guide",
  "Anthropic Claude prompt engineering docs",
  "Google Vertex AI prompt design strategies",
];

const guides = [
  {
    slug: "how-to-write-better-prompts",
    title: "How to Write Better Prompts for AI",
    titleAr: "كيف تكتب مطالبات أفضل للذكاء الاصطناعي",
    metaTitle: "How to Write Better AI Prompts — INSPIRE Guide",
    metaTitleAr: "كيف تكتب مطالبات أفضل للذكاء الاصطناعي — INSPIRE",
    description:
      "Learn how to write better prompts for ChatGPT, Claude, and Gemini using goals, roles, constraints, examples, and quality rules.",
    descriptionAr:
      "دليل عملي لكتابة مطالبات أوضح مع ChatGPT وClaude وGemini باستخدام الدور والسياق والقيود وشكل المخرجات.",
    sections: [
      ["Start with the outcome, not the tool", "A strong prompt begins with the result you want: a decision, plan, draft, review, clearer thinking, or next action. Instead of asking a broad question, define the task, audience, constraints, format, and quality standard."],
      ["Give the assistant a working role", "Generic prompts often produce generic answers. Give the assistant a role that fits the job: strategy reviewer, writing editor, planning partner, customer-support analyst, or technical explainer."],
      ["Add constraints and red lines", "Good prompts say what the AI should avoid: long lists, unsupported claims, jargon, vague advice, or skipping risks. These red lines are especially useful for work contexts where quality and decision discipline matter."],
      ["Use examples to calibrate quality", "If you already know what a useful answer looks like, include a short example. Examples help the model understand structure, tone, and depth faster than abstract instructions."],
    ],
    sectionsAr: [
      ["ابدأ بالنتيجة، لا بالأداة", "المطالبة القوية تبدأ بالنتيجة التي تريدها: قرار، خطة، مسودة، مراجعة، تفكير أوضح، أو خطوة تالية. بدلاً من سؤال واسع، حدّد المهمة والجمهور والقيود وشكل المخرجات ومعيار الجودة."],
      ["أعط المساعد دوراً واضحاً", "المطالبات العامة تنتج إجابات عامة. حدّد دوراً يناسب المهمة: مراجع استراتيجي، محرر كتابة، شريك تخطيط، أو محلل دعم عملاء."],
      ["أضف القيود وخطوط الجودة", "المطالبة الجيدة توضّح ما يجب تجنبه: الإطالة، الادعاءات غير المدعومة، اللغة العامة، أو تجاهل المخاطر."],
      ["استخدم الأمثلة لضبط الجودة", "إذا كنت تعرف شكل الإجابة المفيدة، أضف مثالاً قصيراً. المثال يساعد النموذج على فهم البنية والنبرة والعمق بسرعة."],
    ],
    faqs: [
      ["What makes a prompt better?", "A better prompt gives the AI a clear outcome, role, context, constraints, format, and quality standard. The goal is to reduce guessing."],
      ["Do I need a different prompt for every AI tool?", "The exact wording may change, but the same core instructions can usually work across ChatGPT, Claude, Gemini, and similar assistants."],
    ],
  },
  {
    slug: "chatgpt-custom-instructions",
    title: "ChatGPT Custom Instructions: What to Include",
    titleAr: "ماذا تضع في تعليمات ChatGPT المخصصة",
    metaTitle: "ChatGPT Custom Instructions: What to Include — INSPIRE",
    metaTitleAr: "تعليمات ChatGPT المخصصة: ماذا تضع فيها — INSPIRE",
    description:
      "A practical guide to ChatGPT custom instructions, AI assistant behavior, reusable prompt rules, and personalized AI instructions.",
    descriptionAr:
      "دليل عملي لبناء تعليمات ChatGPT تساعد أدوات الذكاء الاصطناعي على فهم أهدافك وأسلوبك وقواعد الجودة.",
    sections: [
      ["Custom instructions should describe how you work", "The best custom instructions are not a biography. They explain your goals, preferred style, decision habits, and what kind of output helps you move forward."],
      ["Separate context from commands", "Permanent instructions should include stable preferences. Temporary project details should stay in the current chat so the instruction set stays useful over time."],
      ["Use instructions as a quality system", "A good instruction set tells the assistant how to handle uncertainty, when to ask questions, and how to structure answers."],
      ["Keep stable preferences separate", "Stable preferences belong in custom instructions: answer length, tone, formatting, risk tolerance, and preferred decision style."],
    ],
    sectionsAr: [
      ["التعليمات تصف طريقة عملك", "أفضل تعليمات مخصصة ليست سيرة ذاتية. هي توضّح أهدافك، أسلوبك المفضل، عادات القرار، ونوع المخرجات التي تساعدك."],
      ["افصل السياق الثابت عن تفاصيل المشروع", "التفضيلات الثابتة مكانها في التعليمات المخصصة. أما تفاصيل المشروع المؤقتة فالأفضل أن تبقى داخل المحادثة الحالية."],
      ["حوّل التعليمات إلى نظام جودة", "مجموعة التعليمات الجيدة تخبر المساعد كيف يتعامل مع عدم اليقين، متى يسأل، وكيف يرتّب الإجابة."],
      ["حافظ على التعليمات خفيفة وواضحة", "التعليمات الدائمة يجب أن تشمل نمط الإجابة، النبرة، الشكل، مستوى التفصيل، وحدود الجودة."],
    ],
    faqs: [
      ["What should I put in ChatGPT custom instructions?", "Include your goals, preferred answer style, formatting preferences, quality rules, and things the assistant should avoid."],
      ["Should custom instructions include personal details?", "Only include details that improve the work. Avoid sensitive information that the assistant does not need to answer well."],
    ],
  },
  {
    slug: "prompt-engineering-for-work",
    title: "Prompt Engineering for Work in Saudi Arabia and the GCC",
    titleAr: "هندسة المطالبات للعمل في السعودية والخليج",
    metaTitle: "Prompt Engineering for Work in Saudi Arabia and the GCC",
    metaTitleAr: "هندسة المطالبات للعمل في السعودية والخليج — INSPIRE",
    description:
      "Use prompt engineering at work for planning, writing, clearer thinking, bilingual communication, and productivity across Saudi Arabia and GCC teams.",
    descriptionAr:
      "استخدم هندسة المطالبات في التخطيط والكتابة والتفكير الأوضح والتواصل ثنائي اللغة داخل فرق العمل في السعودية والخليج.",
    sections: [
      ["Work prompts need business context", "In the workplace, prompts should include the goal, audience, constraints, decision criteria, and expected format."],
      ["The highest-value use cases", "Useful prompt patterns include summarizing documents, preparing meeting briefs, reviewing proposals, drafting bilingual communication, building plans, and checking assumptions."],
      ["Build reusable personalized instructions", "Personalized instructions make AI outputs more consistent. They give the assistant rules for tone, structure, risk, detail level, and decision support."],
      ["Use bilingual instructions deliberately", "Many Saudi and GCC workflows move between Arabic and English. Prompt instructions should define when to translate, when to preserve terms, and what audience the output is for."],
    ],
    sectionsAr: [
      ["مطالبات العمل تحتاج سياقاً تجارياً", "في العمل، المطالبة يجب أن تشمل الهدف والجمهور والقيود ومعايير القرار وشكل المخرجات المتوقع."],
      ["أعلى الاستخدامات قيمة", "من الاستخدامات المفيدة: تلخيص المستندات، تجهيز ملخصات الاجتماعات، مراجعة العروض، صياغة رسائل ثنائية اللغة، بناء الخطط، واختبار الافتراضات."],
      ["ابنِ تعليمات مخصصة قابلة لإعادة الاستخدام", "التعليمات المخصصة تجعل مخرجات الذكاء الاصطناعي أكثر اتساقاً، لأنها تحدد النبرة والبنية والمخاطر ومستوى التفصيل."],
      ["استخدم التعليمات ثنائية اللغة بوعي", "كثير من بيئات العمل في الخليج تتحرك بين العربية والإنجليزية. لذلك يجب تحديد متى نترجم، ومتى نحافظ على المصطلح، ولمن تُكتب المخرجات."],
    ],
    faqs: [
      ["Why does prompt engineering matter at work?", "Work prompts carry more risk because outputs often affect decisions, customers, or internal alignment. Clear context and constraints improve usefulness."],
      ["What are good workplace AI use cases?", "Common use cases include meeting briefs, document summaries, proposal reviews, bilingual communication, planning, research synthesis, and decision support."],
    ],
  },
  {
    slug: "ai-operating-profile",
    title: "What Are Personalized AI Instructions?",
    titleAr: "ما هي تعليمات الذكاء الاصطناعي المخصصة؟",
    metaTitle: "What Are Personalized AI Instructions? — INSPIRE Framework",
    metaTitleAr: "ما هي تعليمات الذكاء الاصطناعي المخصصة؟ — INSPIRE",
    description:
      "Personalized AI instructions help ChatGPT, Claude, and Gemini understand your goal, working style, boundaries, and preferred response format.",
    descriptionAr:
      "تعليمات الذكاء الاصطناعي المخصصة تساعد ChatGPT وClaude وGemini على فهم هدفك، أسلوبك، حدودك، وشكل الرد المناسب لك.",
    sections: [
      ["Personalized instructions are more than one prompt", "A prompt usually asks for one output. Personalized instructions define how the assistant should think, respond, structure work, and avoid mistakes across many tasks."],
      ["What it contains", "Useful instructions include your goal context, preferred communication style, thinking modes, quality standards, red lines, and examples of useful outputs."],
      ["Why it matters", "Most people lose time because every AI conversation starts from zero. Personalized instructions reduce repetition and help the assistant adapt faster."],
      ["How it differs from a prompt library", "A prompt library gives you reusable task templates. Personalized instructions give AI a reusable understanding of how to work with you."],
    ],
    sectionsAr: [
      ["التعليمات المخصصة أكثر من مطالبة واحدة", "المطالبة تطلب مخرجاً واحداً غالباً. أما التعليمات المخصصة فتحدد كيف يفكر المساعد ويرد ويرتب العمل ويتجنب الأخطاء عبر مهام متعددة."],
      ["ماذا تحتوي؟", "التعليمات المفيدة تشمل سياق الهدف، أسلوب التواصل المفضل، أنماط التفكير، معايير الجودة، الخطوط الحمراء، وأمثلة على المخرجات المفيدة."],
      ["لماذا تهم؟", "كثير من الناس يضيعون وقتاً لأن كل محادثة تبدأ من الصفر. التعليمات المخصصة تقلل التكرار وتساعد المساعد على التكيف أسرع."],
      ["كيف تختلف عن مكتبة المطالبات؟", "مكتبة المطالبات تعطيك قوالب للمهام. التعليمات المخصصة تعطي المساعد فهماً متكرراً لطريقة العمل معك."],
    ],
    faqs: [
      ["Are personalized AI instructions the same as a prompt?", "No. A prompt usually asks for one output. Personalized instructions define repeated behavior across many tasks and conversations."],
      ["Can I use the same instructions across multiple AI tools?", "Yes. Well-written instructions can be adapted for ChatGPT, Claude, Gemini, and other assistants."],
    ],
  },
  {
    slug: "arabic-ai-prompts",
    title: "Arabic AI Prompts and Bilingual AI Instructions",
    titleAr: "مطالبات عربية وتعليمات ثنائية اللغة للذكاء الاصطناعي",
    metaTitle: "Arabic AI Prompts and Bilingual AI Instructions — INSPIRE",
    metaTitleAr: "مطالبات عربية وتعليمات ثنائية اللغة للذكاء الاصطناعي — INSPIRE",
    description:
      "Learn how Arabic-speaking users can write better AI prompts and bilingual instructions for ChatGPT, Claude, and Gemini.",
    descriptionAr:
      "تعلم كيف تكتب مطالبات عربية أوضح وتعليمات ثنائية اللغة مع ChatGPT وClaude وGemini.",
    sections: [
      ["Arabic prompts need clarity, not literal translation", "Good Arabic prompts should be clear about the task, tone, audience, and output format. Literal translation from English prompt templates often weakens the result."],
      ["Bilingual work benefits from stable instructions", "Many GCC users switch between Arabic and English at work. Stable instructions can tell the AI when to preserve English terms and when to explain in Arabic."],
      ["INSPIRE supports bilingual AI usage", "INSPIRE can produce reports and instructions for users who work across Arabic and English contexts. The goal is better alignment, not just translation."],
      ["Avoid vague Arabic commands", "Short Arabic commands often produce generic answers. Add the audience, goal, context, tone, output format, and boundaries."],
    ],
    sectionsAr: [
      ["المطالبات العربية تحتاج وضوحاً لا ترجمة حرفية", "المطالبة العربية الجيدة توضّح المهمة والنبرة والجمهور وشكل المخرجات. الترجمة الحرفية من قوالب إنجليزية قد تضعف النتيجة."],
      ["العمل ثنائي اللغة يستفيد من تعليمات ثابتة", "كثير من مستخدمي الخليج ينتقلون بين العربية والإنجليزية في العمل. التعليمات الثابتة تحدد متى نحافظ على المصطلحات الإنجليزية ومتى نشرح بالعربية."],
      ["INSPIRE يدعم استخداماً ثنائي اللغة", "يمكن لـ INSPIRE توليد تقارير وتعليمات لمستخدمين يعملون بين العربية والإنجليزية. الهدف ليس الترجمة فقط، بل مواءمة طريقة عملك مع طريقة استجابة الذكاء الاصطناعي."],
      ["تجنب الأوامر العربية العامة", "أوامر قصيرة مثل “اكتب لي برومبت” تنتج غالباً إجابات عامة. أضف الجمهور والهدف والسياق والنبرة وشكل المخرجات والحدود."],
    ],
    faqs: [
      ["هل الأفضل أكتب البرومبت بالعربي أم بالإنجليزي؟", "اكتب باللغة التي تناسب المخرجات المطلوبة. إذا كان العمل عربي أو موجه لجمهور عربي، فالوضوح بالعربية أهم من الترجمة الحرفية."],
      ["كيف أحسن نتائج ChatGPT بالعربي؟", "حدد الدور، الهدف، الجمهور، النبرة، شكل المخرجات، والكلمات التي يجب الحفاظ عليها بالإنجليزية إن وجدت."],
    ],
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pathFor(basePath, locale) {
  if (locale === "ar") return basePath === "/" ? "/ar" : `/ar${basePath}`;
  return basePath;
}

function breadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

function globalSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "INSPIRE Framework",
        url: `${siteUrl}/`,
        logo: `${siteUrl}/images/logo.png`,
        email: "Haitham.haj@gmail.com",
        sameAs: [
          "https://www.linkedin.com/in/haithamhaj/",
          "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595",
          "https://dx.doi.org/10.2139/ssrn.5358595",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "INSPIRE Framework",
        url: `${siteUrl}/`,
        publisher: { "@id": organizationId },
        inLanguage: ["en", "ar"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        name: "INSPIRE Framework",
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/`,
        description:
          "A self-serve digital assessment that creates an AI operating profile, copy-ready prompt instructions, starter prompts, and a report for working with AI tools.",
        publisher: { "@id": organizationId },
        offers: {
          "@type": "Offer",
          price: "10.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/pricing`,
        },
      },
    ],
  };
}

function pageSchema(page) {
  if (page.type === "guide") {
    const url = `${siteUrl}${page.path}`;
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: page.h1, path: page.path },
        ]),
        {
          "@type": "Article",
          "@id": `${url}#article`,
          headline: page.h1,
          description: page.description,
          url,
          image: imageUrl,
          author: { "@type": "Organization", name: "INSPIRE Framework", url: siteUrl },
          publisher: { "@id": organizationId },
          mainEntityOfPage: url,
          inLanguage: page.locale,
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: page.faqs.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        },
      ],
    };
  }

  if (page.type === "about") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb([{ name: "Home", path: "/" }, { name: "About", path: page.path }]),
        {
          "@type": "AboutPage",
          "@id": `${siteUrl}${page.path}#webpage`,
          url: `${siteUrl}${page.path}`,
          name: page.h1,
          description: page.description,
          isPartOf: { "@id": websiteId },
          publisher: { "@id": organizationId },
        },
      ],
    };
  }

  if (page.type === "contact") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb([{ name: "Home", path: "/" }, { name: "Contact", path: page.path }]),
        {
          "@type": "ContactPage",
          "@id": `${siteUrl}${page.path}#webpage`,
          url: `${siteUrl}${page.path}`,
          name: page.h1,
          isPartOf: { "@id": websiteId },
          publisher: { "@id": organizationId },
        },
      ],
    };
  }

  if (page.type === "research") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb([{ name: "Home", path: "/" }, { name: "Research", path: page.path }]),
        {
          "@type": "ScholarlyArticle",
          "@id": "https://dx.doi.org/10.2139/ssrn.5358595",
          name: "Inspire & Crafts: A Dual Framework for Individual AI Interaction Customization",
          author: { "@type": "Person", name: "Haitham Hamadneh" },
          url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595",
          sameAs: "https://dx.doi.org/10.2139/ssrn.5358595",
        },
      ],
    };
  }

  return breadcrumb([{ name: "Home", path: "/" }, { name: page.h1, path: page.path }]);
}

function headHtml(page) {
  const canonical = `${siteUrl}${page.path}`;
  const enPath = pathFor(page.basePath, "en");
  const arPath = pathFor(page.basePath, "ar");
  const schemas = [globalSchema(), pageSchema(page)];

  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#070817" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="en" href="${siteUrl}${enPath}" />
    <link rel="alternate" hreflang="ar" href="${siteUrl}${arPath}" />
    <link rel="alternate" hreflang="x-default" href="${siteUrl}${enPath}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/images/logo.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="INSPIRE Framework" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:alt" content="INSPIRE Framework AI operating profile preview" />
    <meta property="og:locale" content="${page.locale === "ar" ? "ar_SA" : "en_US"}" />
    <meta property="og:locale:alternate" content="${page.locale === "ar" ? "en_US" : "ar_SA"}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
${page.assets}
${schemas
  .map(
    (schema) => `    <script type="application/ld+json">${JSON.stringify(schema)}</script>`
  )
  .join("\n")}`;
}

function bodyHtml(page) {
  const dir = page.locale === "ar" ? "rtl" : "ltr";
  const links = [
    [pathFor("/", page.locale), page.locale === "ar" ? "الرئيسية" : "Home"],
    [pathFor("/guides", page.locale), page.locale === "ar" ? "الأدلة" : "Guides"],
    [pathFor("/about", page.locale), page.locale === "ar" ? "عن INSPIRE" : "About"],
    [pathFor("/research", page.locale), page.locale === "ar" ? "البحث" : "Research"],
    [pathFor("/pricing", page.locale), page.locale === "ar" ? "الأسعار" : "Pricing"],
  ];

  const sections = page.sections
    .map(([heading, text]) => `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p></section>`)
    .join("\n");
  const faq = page.faqs?.length
    ? `<section><h2>FAQ</h2>${page.faqs
        .map(([q, a]) => `<h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p>`)
        .join("\n")}</section>`
    : "";

  return `<div id="root"><div class="seo-prerender" dir="${dir}">
    <nav>${links.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join(" ")}</nav>
    <main>
      <article>
        <h1>${escapeHtml(page.h1)}</h1>
        <p>${escapeHtml(page.intro)}</p>
        ${sections}
        ${page.type === "guide" ? `<section><h2>${page.locale === "ar" ? "المنهج والمراجع" : "Method and references"}</h2><p>${sourceLinks.map(escapeHtml).join(" · ")}</p></section>` : ""}
        ${faq}
      </article>
    </main>
  </div></div>`;
}

function pageFilePath(routePath) {
  if (routePath === "/") return path.join(outDir, "index.html");
  return path.join(outDir, routePath.replace(/^\//, ""), "index.html");
}

function extractAssets(template) {
  const head = template.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  return head
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((tag) => tag.includes("/assets/"))
    .join("\n");
}

function render(template, page) {
  const htmlAttrs = `lang="${page.locale}"${page.locale === "ar" ? ' dir="rtl"' : ""}`;
  const body = template.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const scripts = body
    .split("\n")
    .filter((line) => line.includes("<script") && line.includes("/assets/"))
    .join("\n");
  return `<!DOCTYPE html>
<html ${htmlAttrs}>
  <head>
${headHtml(page)}
  </head>
  <body>
    ${bodyHtml(page)}
${scripts}
  </body>
</html>
`;
}

function makeBasePages() {
  const pages = [
    {
      basePath: "/",
      type: "home",
      title: "Personalized AI Instructions for ChatGPT | INSPIRE",
      titleAr: "تعليمات AI مخصصة لـ ChatGPT | INSPIRE",
      description:
        "Answer 21 short questions and get personalized, ready-to-use AI instructions for ChatGPT, Claude, or Gemini based on your goal, working style, and preferred response format.",
      descriptionAr:
        "أجب عن 21 سؤالًا قصيرًا واحصل على تعليمات AI جاهزة للاستخدام في ChatGPT أو Claude أو Gemini، مبنية على هدفك وطريقة عملك وشكل الرد الذي تفضله.",
      h1: "Personalized AI instructions for the way you work",
      h1Ar: "تعليمات ذكاء اصطناعي مخصصة لطريقة عملك",
      intro:
        "INSPIRE turns your goals, working style, preferences, and red lines into a reusable AI operating profile for ChatGPT, Claude, Gemini, and similar tools.",
      introAr:
        "يحوّل INSPIRE أهدافك وأسلوب عملك وتفضيلاتك وحدودك إلى تعليمات مخصصة قابلة للاستخدام مع ChatGPT وClaude وGemini.",
      sections: [
        ["What INSPIRE creates", "A copy-ready instruction set, starter prompts, and a readable report that explains how AI should work with you."],
        ["Why it matters", "Most people repeat the same context in every AI conversation. INSPIRE makes that context reusable and easier to improve."],
      ],
      sectionsAr: [
        ["ماذا ينشئ INSPIRE", "تعليمات قابلة للنسخ، مطالبات بداية، وتقرير واضح يشرح كيف يجب أن يعمل الذكاء الاصطناعي معك."],
        ["لماذا يهم", "كثير من الناس يعيدون شرح نفس السياق في كل محادثة. INSPIRE يجعل هذا السياق قابلاً لإعادة الاستخدام والتحسين."],
      ],
    },
    {
      basePath: "/pricing",
      type: "pricing",
      title: "INSPIRE Pricing — $10 Personalized AI Instructions",
      titleAr: "أسعار INSPIRE — تعليمات ذكاء اصطناعي مخصصة",
      description:
        "Simple INSPIRE pricing: a free quick assessment and $10 one-time personalized AI instructions with copy-ready starter prompts.",
      descriptionAr:
        "تسعير واضح من INSPIRE: تقييم سريع مجاني وتعليمات مخصصة كاملة بقيمة 10 دولارات جاهزة للنسخ والاستخدام.",
      h1: "Simple pricing for personalized AI instructions",
      h1Ar: "تسعير واضح لتعليمات ذكاء اصطناعي مخصصة",
      intro:
        "Start with the free quick assessment or unlock the complete personalized instruction report for a one-time price.",
      introAr:
        "ابدأ بالتقييم السريع المجاني أو احصل على تقرير التعليمات المخصصة الكامل بسعر مرة واحدة.",
      sections: [["Plans", "The free quick assessment gives starter prompts. The complete report creates reusable instructions and a structured AI operating profile."]],
      sectionsAr: [["الخطط", "التقييم السريع المجاني يعطي مطالبات بداية. التقرير الكامل ينشئ تعليمات قابلة لإعادة الاستخدام وملف تشغيل للذكاء الاصطناعي."]],
    },
    {
      basePath: "/about",
      type: "about",
      title: "About INSPIRE Framework — Personalized AI Instructions",
      titleAr: "عن INSPIRE Framework — تعليمات مخصصة للذكاء الاصطناعي",
      description:
        "Learn about INSPIRE Framework, a digital assessment that creates personalized AI instructions for ChatGPT, Claude, and Gemini.",
      descriptionAr:
        "تعرّف على INSPIRE Framework، تقييم رقمي يحوّل أهدافك وأسلوب عملك إلى تعليمات مخصصة للذكاء الاصطناعي.",
      h1: "A practical framework for personal AI instructions",
      h1Ar: "إطار عملي لبناء تعليمات شخصية للذكاء الاصطناعي",
      intro:
        "INSPIRE Framework is a self-serve digital assessment that turns a person's goals, working style, preferences, and red lines into reusable personalized AI instructions.",
      introAr:
        "INSPIRE هو تقييم رقمي ذاتي يحوّل أهدافك، أسلوب عملك، تفضيلاتك، وحدودك إلى تعليمات مخصصة قابلة للاستخدام.",
      sections: [["What INSPIRE helps you unlock", "When AI understands your context and working style, its responses become clearer, more relevant, and easier to use."], ["Research-backed product method", "INSPIRE is connected to the INSPIRE & CRAFTS work by Haitham Hamadneh."]],
      sectionsAr: [["ماذا يضيف INSPIRE؟", "عندما يعرف الذكاء الاصطناعي سياقك وطريقة تفكيرك، تصبح إجاباته أقرب لما تحتاجه."], ["أساس بحثي ومنتج عملي", "يرتبط INSPIRE بعمل INSPIRE & CRAFTS من إعداد هيثم حمادنة."]],
    },
    {
      basePath: "/research",
      type: "research",
      title: "INSPIRE & CRAFTS Research — AI Interaction Customization",
      titleAr: "خلفية INSPIRE & CRAFTS البحثية — تخصيص التفاعل مع الذكاء الاصطناعي",
      description:
        "Read the research background behind INSPIRE Framework and the INSPIRE & CRAFTS approach to personalized AI interaction and prompt instructions.",
      descriptionAr:
        "اقرأ الخلفية البحثية وراء INSPIRE Framework ومنهج INSPIRE & CRAFTS لتخصيص التفاعل مع الذكاء الاصطناعي.",
      h1: "INSPIRE & CRAFTS research background",
      h1Ar: "خلفية INSPIRE & CRAFTS البحثية",
      intro:
        "INSPIRE Framework is informed by the paper Inspire & Crafts: A Dual Framework for Individual AI Interaction Customization.",
      introAr:
        "يعتمد INSPIRE Framework على ورقة Inspire & Crafts: A Dual Framework for Individual AI Interaction Customization.",
      sections: [["Plain-language summary", "The research presents a practical way to customize how AI assistants work with individuals by defining goals, style, preferences, interaction rules, and quality standards."], ["From research to product", "INSPIRE turns this idea into structured questions, useful signals, and reusable personalized AI instructions."]],
      sectionsAr: [["ملخص مبسط", "توضح الورقة طريقة عملية لتخصيص تعامل الأفراد مع المساعدات الذكية من خلال تحديد الأهداف والأسلوب والتفضيلات وقواعد التفاعل ومعايير الجودة."], ["من البحث إلى المنتج", "يحوّل INSPIRE هذه الفكرة إلى أسئلة منظمة وإشارات مفيدة وتعليمات مخصصة قابلة للاستخدام."]],
    },
    {
      basePath: "/contact",
      type: "contact",
      title: "Contact INSPIRE Framework — Support and Product Questions",
      titleAr: "تواصل مع INSPIRE Framework — الدعم والاستفسارات",
      description:
        "Contact INSPIRE Framework for support, product questions, billing questions, and review inquiries for personalized AI instructions.",
      descriptionAr:
        "تواصل مع INSPIRE Framework لأسئلة المنتج، الدعم، الفواتير، أو مراجعة التقرير الرقمي المخصص للذكاء الاصطناعي.",
      h1: "Contact INSPIRE Framework",
      h1Ar: "تواصل مع INSPIRE Framework",
      intro:
        "For product questions, support, billing questions, or review inquiries, contact the INSPIRE team by email.",
      introAr:
        "للاستفسارات عن المنتج، الدعم، أو مراجعة الطلبات، يمكنك التواصل مع فريق INSPIRE عبر البريد الإلكتروني.",
      sections: [["Support email", "Use Haitham.haj@gmail.com and include the email used for your assessment if your question is about a report or account."]],
      sectionsAr: [["بريد الدعم", "استخدم Haitham.haj@gmail.com واكتب البريد المستخدم في التقييم إذا كان سؤالك متعلقاً بتقرير أو حساب."]],
    },
    {
      basePath: "/assess/mini",
      type: "assessment",
      title: "Free AI Prompt Assessment — INSPIRE Framework",
      titleAr: "تقييم سريع مجاني لمطالبات الذكاء الاصطناعي — INSPIRE",
      description:
        "Try a free quick AI working-style assessment and get starter prompts for better ChatGPT, Claude, and Gemini results.",
      descriptionAr:
        "جرّب تقييماً سريعاً مجانياً لأسلوب عملك مع الذكاء الاصطناعي واحصل على مطالبات بداية لتحسين نتائج ChatGPT وClaude وGemini.",
      h1: "Free AI prompt assessment",
      h1Ar: "تقييم سريع مجاني لمطالبات الذكاء الاصطناعي",
      intro:
        "Answer a short set of questions and get starter prompts that reflect your goal, working style, and preferred output format.",
      introAr:
        "أجب عن مجموعة قصيرة من الأسئلة واحصل على مطالبات بداية تعكس هدفك وأسلوب عملك وشكل المخرجات المفضل لديك.",
      sections: [["What you get", "The mini assessment provides a lightweight starting point for better AI instructions before the full INSPIRE report."]],
      sectionsAr: [["ماذا تحصل عليه", "يوفر التقييم السريع نقطة بداية خفيفة لتعليمات أفضل قبل تقرير INSPIRE الكامل."]],
    },
    {
      basePath: "/guides",
      type: "guides",
      title: "AI Prompt Guides for Work — INSPIRE Framework",
      titleAr: "أدلة عملية لكتابة تعليمات أفضل للذكاء الاصطناعي — INSPIRE",
      description:
        "Practical guides for better AI prompts, ChatGPT custom instructions, prompt engineering, Arabic AI prompts, and personalized AI instructions.",
      descriptionAr:
        "أدلة عملية عن كتابة مطالبات أفضل، تعليمات ChatGPT، هندسة المطالبات، المطالبات العربية، وتعليمات الذكاء الاصطناعي المخصصة.",
      h1: "Practical guides for better AI prompts and instructions",
      h1Ar: "أدلة عملية لكتابة تعليمات أفضل للذكاء الاصطناعي",
      intro:
        "Learn how to write better prompts, use ChatGPT custom instructions, and build personalized AI instructions for work in Saudi Arabia, the GCC, and bilingual contexts.",
      introAr:
        "تعرّف على طريقة كتابة مطالبات أوضح، واستخدام تعليمات ChatGPT، وبناء تعليمات مخصصة للذكاء الاصطناعي تناسب العمل والسياقات العربية والإنجليزية.",
      sections: guides.map((guide) => [guide.title, guide.description]),
      sectionsAr: guides.map((guide) => [guide.titleAr, guide.descriptionAr]),
    },
    {
      basePath: "/terms",
      type: "legal",
      title: "Terms of Service — INSPIRE Framework",
      titleAr: "شروط الخدمة — INSPIRE Framework",
      description: "Terms for using INSPIRE Framework, a self-serve personalized AI instruction product.",
      descriptionAr: "شروط استخدام INSPIRE Framework، المنتج الرقمي الذاتي لإنشاء تعليمات مخصصة للذكاء الاصطناعي.",
      h1: "Terms of Service",
      h1Ar: "شروط الخدمة",
      intro: "These terms describe the use of INSPIRE Framework as a self-serve digital product.",
      introAr: "توضح هذه الشروط استخدام INSPIRE Framework كمنتج رقمي ذاتي.",
      sections: [["Digital product terms", "INSPIRE provides online assessments, generated reports, and related digital outputs for personal AI instruction workflows."]],
      sectionsAr: [["شروط المنتج الرقمي", "يوفر INSPIRE تقييمات رقمية وتقارير ومخرجات مرتبطة ببناء تعليمات شخصية للذكاء الاصطناعي."]],
    },
    {
      basePath: "/privacy",
      type: "legal",
      title: "Privacy Policy — INSPIRE Framework",
      titleAr: "سياسة الخصوصية — INSPIRE Framework",
      description: "How INSPIRE Framework collects and uses information to generate personalized AI instructions.",
      descriptionAr: "كيفية جمع INSPIRE Framework للمعلومات واستخدامها وحمايتها لتقديم تجربة التقييم والتقرير الرقمي المخصص للذكاء الاصطناعي.",
      h1: "Privacy Policy",
      h1Ar: "سياسة الخصوصية",
      intro: "This policy explains how INSPIRE handles information used to provide assessments and reports.",
      introAr: "توضح هذه السياسة كيفية تعامل INSPIRE مع المعلومات المستخدمة لتقديم التقييمات والتقارير.",
      sections: [["Information use", "Information is used to operate the assessment, create the report, support accounts, and improve the digital product."]],
      sectionsAr: [["استخدام المعلومات", "تستخدم المعلومات لتشغيل التقييم، إنشاء التقرير، دعم الحسابات، وتحسين المنتج الرقمي."]],
    },
    {
      basePath: "/refund-policy",
      type: "legal",
      title: "Refund Policy — INSPIRE Framework",
      titleAr: "سياسة الاسترداد — INSPIRE Framework",
      description: "Refund policy for the INSPIRE Framework personalized AI instruction product.",
      descriptionAr: "سياسة الاسترداد الخاصة بتقرير INSPIRE Framework الرقمي وطلبات الاسترداد المؤهلة للمنتج الرقمي المخصص للذكاء الاصطناعي.",
      h1: "Refund Policy",
      h1Ar: "سياسة الاسترداد",
      intro: "This policy explains refund handling for the INSPIRE personalized AI instruction product.",
      introAr: "توضح هذه السياسة آلية الاسترداد الخاصة بمنتج INSPIRE لتعليمات الذكاء الاصطناعي المخصصة.",
      sections: [["Digital delivery", "Refund eligibility depends on the status of digital report generation, access activation, and support review."]],
      sectionsAr: [["التسليم الرقمي", "تعتمد أهلية الاسترداد على حالة إنشاء التقرير الرقمي وتفعيل الوصول ومراجعة الدعم."]],
    },
  ];

  return pages.flatMap((page) => localizedPages(page));
}

function localizedPages(page) {
  return ["en", "ar"].map((locale) => ({
    ...page,
    locale,
    path: pathFor(page.basePath, locale),
    title: locale === "ar" ? page.titleAr : page.title,
    description: locale === "ar" ? page.descriptionAr : page.description,
    h1: locale === "ar" ? page.h1Ar : page.h1,
    intro: locale === "ar" ? page.introAr : page.intro,
    sections: locale === "ar" ? page.sectionsAr : page.sections,
    faqs: page.faqs ?? [],
  }));
}

function guidePages() {
  return guides.flatMap((guide) => {
    const basePath = `/guides/${guide.slug}`;
    return localizedPages({
      basePath,
      type: "guide",
      title: guide.metaTitle,
      titleAr: guide.metaTitleAr,
      description: guide.description,
      descriptionAr: guide.descriptionAr,
      h1: guide.title,
      h1Ar: guide.titleAr,
      intro: guide.description,
      introAr: guide.descriptionAr,
      sections: guide.sections,
      sectionsAr: guide.sectionsAr,
      faqs: guide.faqs,
    });
  });
}

async function main() {
  const template = await readFile(templatePath, "utf8");
  const assets = extractAssets(template);
  const pages = [...makeBasePages(), ...guidePages()].map((page) => ({ ...page, assets }));

  for (const page of pages) {
    const filePath = pageFilePath(page.path);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, render(template, page), "utf8");
  }

  console.log(`Prerendered ${pages.length} SEO pages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
