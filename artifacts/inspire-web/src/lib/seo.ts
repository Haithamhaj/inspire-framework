import { localizePath, stripLocalePrefix } from "@/lib/locale-paths";

export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  robots?: string;
  jsonLd?: Record<string, unknown>;
};
type Locale = "ar" | "en";

const siteUrl = "https://inspire.next-stepai.com";
const imageUrl = `${siteUrl}/opengraph.jpg`;
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
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

function guideJsonLd(config: {
  title: string;
  description: string;
  path: string;
  breadcrumbName: string;
  faqs: Array<{ question: string; answer: string }>;
}) {
  const url = `${siteUrl}${config.path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Guides", path: "/guides" },
        { name: config.breadcrumbName, path: config.path },
      ]),
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: config.title,
        description: config.description,
        url,
        image: imageUrl,
        author: {
          "@type": "Organization",
          name: "INSPIRE Framework",
          url: siteUrl,
        },
        publisher: { "@id": organizationId },
        mainEntityOfPage: url,
        inLanguage: ["en", "ar"],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: config.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

const guideSeo: Record<string, SeoConfig> = {
  "how-to-write-better-prompts": {
    path: "/guides/how-to-write-better-prompts",
    title: "How to Write Better AI Prompts — INSPIRE Guide",
    description:
      "Learn how to write better prompts for ChatGPT, Claude, and Gemini using goals, roles, constraints, examples, and quality rules.",
    jsonLd: guideJsonLd({
      path: "/guides/how-to-write-better-prompts",
      title: "How to Write Better AI Prompts",
      description:
        "Learn how to write better prompts for ChatGPT, Claude, and Gemini using goals, roles, constraints, examples, and quality rules.",
      breadcrumbName: "How to Write Better AI Prompts",
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
    }),
  },
  "chatgpt-custom-instructions": {
    path: "/guides/chatgpt-custom-instructions",
    title: "ChatGPT Custom Instructions: What to Include — INSPIRE",
    description:
      "A practical guide to ChatGPT custom instructions, AI assistant behavior, reusable prompt rules, and personalized AI instructions.",
    jsonLd: guideJsonLd({
      path: "/guides/chatgpt-custom-instructions",
      title: "ChatGPT Custom Instructions: What to Include",
      description:
        "A practical guide to ChatGPT custom instructions, AI assistant behavior, reusable prompt rules, and personalized AI instructions.",
      breadcrumbName: "ChatGPT Custom Instructions",
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
    }),
  },
  "prompt-engineering-for-work": {
    path: "/guides/prompt-engineering-for-work",
    title: "Prompt Engineering for Work — INSPIRE Guide",
    description:
      "Use prompt engineering at work for planning, writing, clearer thinking, bilingual communication, and productivity with ChatGPT, Claude, and Gemini.",
    jsonLd: guideJsonLd({
      path: "/guides/prompt-engineering-for-work",
      title: "Prompt Engineering for Work",
      description:
        "Use prompt engineering at work for planning, writing, clearer thinking, bilingual communication, and productivity with ChatGPT, Claude, and Gemini.",
      breadcrumbName: "Prompt Engineering for Work",
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
    }),
  },
  "ai-operating-profile": {
    path: "/guides/ai-operating-profile",
    title: "AI Operating Profile: Instructions for ChatGPT, Claude, and Gemini",
    description:
      "Learn what an AI Operating Profile is and how reusable instructions help ChatGPT, Claude, and Gemini understand your goals, style, boundaries, and quality rules.",
    jsonLd: guideJsonLd({
      path: "/guides/ai-operating-profile",
      title: "AI Operating Profile: Instructions for ChatGPT, Claude, and Gemini",
      description:
        "Learn what an AI Operating Profile is and how reusable instructions help ChatGPT, Claude, and Gemini understand your goals, style, boundaries, and quality rules.",
      breadcrumbName: "AI Operating Profile",
      faqs: [
        {
          question: "Is an AI Operating Profile the same as a prompt?",
          answer:
            "No. A prompt usually asks for one output. An AI Operating Profile defines reusable behavior, context, boundaries, and quality rules across many tasks and conversations.",
        },
        {
          question: "Can I use an AI Operating Profile across multiple AI tools?",
          answer:
            "Yes. A well-written AI Operating Profile can be adapted for ChatGPT, Claude, Gemini, and other assistants, although each tool may have different instruction fields.",
        },
      ],
    }),
  },
  "ai-operating-profile-vs-chatgpt-custom-instructions": {
    path: "/guides/ai-operating-profile-vs-chatgpt-custom-instructions",
    title: "AI Operating Profile vs ChatGPT Custom Instructions — INSPIRE",
    description:
      "Compare AI Operating Profiles with ChatGPT Custom Instructions and learn when to use each for better ChatGPT, Claude, and Gemini results.",
    jsonLd: guideJsonLd({
      path: "/guides/ai-operating-profile-vs-chatgpt-custom-instructions",
      title: "AI Operating Profile vs ChatGPT Custom Instructions",
      description:
        "Compare AI Operating Profiles with ChatGPT Custom Instructions and learn when to use each for better ChatGPT, Claude, and Gemini results.",
      breadcrumbName: "AI Operating Profile vs ChatGPT Custom Instructions",
      faqs: [
        {
          question: "Are AI Operating Profiles and ChatGPT Custom Instructions competitors?",
          answer:
            "No. They work together. The AI Operating Profile defines the assistant behavior, and ChatGPT Custom Instructions are one place where parts of that behavior can be pasted.",
        },
        {
          question: "Can I use an AI Operating Profile outside ChatGPT?",
          answer:
            "Yes. A well-written AI Operating Profile can be adapted for Claude, Gemini, Custom GPTs, project instructions, and other assistant settings.",
        },
      ],
    }),
  },
  "arabic-ai-prompts": {
    path: "/guides/arabic-ai-prompts",
    title: "Arabic AI Prompts and Bilingual AI Instructions — INSPIRE",
    description:
      "Learn how Arabic-speaking users can write better AI prompts and bilingual instructions for ChatGPT, Claude, and Gemini.",
    jsonLd: guideJsonLd({
      path: "/guides/arabic-ai-prompts",
      title: "Arabic AI Prompts and Bilingual AI Instructions",
      description:
        "Learn how Arabic-speaking users can write better AI prompts and bilingual instructions for ChatGPT, Claude, and Gemini.",
      breadcrumbName: "Arabic AI Prompts",
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
    }),
  },
};

const guideSeoAr: Record<string, SeoConfig> = {
  "how-to-write-better-prompts": {
    path: "/guides/how-to-write-better-prompts",
    title: "كيف تكتب مطالبات أفضل للذكاء الاصطناعي — INSPIRE",
    description:
      "دليل عملي لكتابة مطالبات أوضح مع ChatGPT وClaude وGemini باستخدام الدور والسياق والقيود وشكل المخرجات.",
  },
  "chatgpt-custom-instructions": {
    path: "/guides/chatgpt-custom-instructions",
    title: "تعليمات ChatGPT المخصصة: ماذا تضع فيها — INSPIRE",
    description:
      "دليل عملي لبناء تعليمات ChatGPT تساعد أدوات الذكاء الاصطناعي على فهم أهدافك وأسلوبك وقواعد الجودة.",
  },
  "prompt-engineering-for-work": {
    path: "/guides/prompt-engineering-for-work",
    title: "هندسة المطالبات للعمل — INSPIRE",
    description:
      "استخدم هندسة المطالبات في التخطيط والكتابة والتفكير الأوضح والتواصل ثنائي اللغة مع ChatGPT وClaude وGemini.",
  },
  "ai-operating-profile": {
    path: "/guides/ai-operating-profile",
    title: "AI Operating Profile: تعليمات قابلة للاستخدام مع ChatGPT وClaude وGemini",
    description:
      "تعرف على AI Operating Profile وكيف يساعد ChatGPT وClaude وGemini على فهم هدفك، أسلوبك، حدودك، وقواعد الجودة التي تفضلها.",
  },
  "ai-operating-profile-vs-chatgpt-custom-instructions": {
    path: "/guides/ai-operating-profile-vs-chatgpt-custom-instructions",
    title: "AI Operating Profile vs ChatGPT Custom Instructions — INSPIRE",
    description:
      "مقارنة عملية بين AI Operating Profile وتعليمات ChatGPT المخصصة، ومتى تستخدم كل واحد وكيف يربط INSPIRE بينهما.",
  },
  "arabic-ai-prompts": {
    path: "/guides/arabic-ai-prompts",
    title: "مطالبات عربية وتعليمات ثنائية اللغة للذكاء الاصطناعي — INSPIRE",
    description:
      "تعلم كيف تكتب مطالبات عربية أوضح وتعليمات ثنائية اللغة مع ChatGPT وClaude وGemini.",
  },
};

export const defaultSeo: SeoConfig = {
  path: "/",
  locale: "en",
  title: "AI Operating Profile for ChatGPT, Claude, and Gemini | INSPIRE",
  description:
    "Create an AI Operating Profile with reusable instructions for ChatGPT, Claude, and Gemini based on your goal, working style, boundaries, and preferred response format.",
};

export const defaultSeoAr: SeoConfig = {
  path: "/",
  locale: "ar",
  title: "AI Operating Profile لـ ChatGPT وClaude وGemini | INSPIRE",
  description:
    "أنشئ AI Operating Profile وتعليمات قابلة لإعادة الاستخدام مع ChatGPT وClaude وGemini بناءً على هدفك وأسلوب عملك وحدودك وشكل الرد الذي تفضله.",
};

export function getSeoForPath(pathname: string, locale: Locale = "en"): SeoConfig {
  pathname = stripLocalePrefix(pathname).split("?")[0] || "/";

  if (pathname === "/") {
    return locale === "ar" ? defaultSeoAr : defaultSeo;
  }

  if (pathname === "/pricing") {
    if (locale === "ar") {
      return {
        path: "/pricing",
        title: "أسعار INSPIRE — تعليمات ذكاء اصطناعي مخصصة",
        description:
          "تسعير واضح من INSPIRE: تعليمات مختصرة سريعة وتعليمات مخصصة كاملة بقيمة 10 دولارات جاهزة للنسخ والاستخدام.",
        jsonLd: breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ]),
      };
    }

    return {
      path: "/pricing",
      title: "INSPIRE Pricing — $10 Personalized AI Instructions",
      description:
        "Simple INSPIRE pricing: short AI instructions and $10 one-time complete personalized AI instructions.",
      jsonLd: breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Pricing", path: "/pricing" },
      ]),
    };
  }

  if (pathname === "/about") {
    if (locale === "ar") {
      return {
        path: "/about",
        title: "عن INSPIRE Framework — تعليمات مخصصة للذكاء الاصطناعي",
        description:
          "تعرّف على INSPIRE Framework، تقييم رقمي يحوّل أهدافك وأسلوب عملك إلى تعليمات مخصصة للذكاء الاصطناعي.",
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
            {
              "@type": "AboutPage",
              "@id": `${siteUrl}/about#webpage`,
              url: `${siteUrl}/about`,
              name: "About INSPIRE Framework",
              description:
                "INSPIRE Framework is a self-serve digital assessment that turns a user's goals, work style, preferences, and constraints into personalized AI instructions.",
              isPartOf: { "@id": websiteId },
              publisher: { "@id": organizationId },
            },
          ],
        },
      };
    }

    return {
      path: "/about",
      title: "About INSPIRE Framework — Personalized AI Instructions",
      description:
        "Learn about INSPIRE Framework, a digital assessment that creates personalized AI instructions for ChatGPT, Claude, and Gemini.",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          {
            "@type": "AboutPage",
            "@id": `${siteUrl}/about#webpage`,
            url: `${siteUrl}/about`,
            name: "About INSPIRE Framework",
            description:
              "INSPIRE Framework is a self-serve digital assessment that turns a user's goals, work style, preferences, and constraints into personalized AI instructions.",
            isPartOf: { "@id": websiteId },
            publisher: { "@id": organizationId },
          },
        ],
      },
    };
  }

  if (pathname === "/contact") {
    if (locale === "ar") {
      return {
        path: "/contact",
        title: "تواصل مع INSPIRE Framework — الدعم والاستفسارات",
        description:
          "تواصل مع INSPIRE Framework لأسئلة المنتج، الدعم، الفواتير، أو مراجعة التقرير الرقمي المخصص للذكاء الاصطناعي.",
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
            {
              "@type": "ContactPage",
              "@id": `${siteUrl}/contact#webpage`,
              url: `${siteUrl}/contact`,
              name: "Contact INSPIRE Framework",
              isPartOf: { "@id": websiteId },
              publisher: { "@id": organizationId },
            },
          ],
        },
      };
    }

    return {
      path: "/contact",
      title: "Contact INSPIRE Framework — Support and Product Questions",
      description:
        "Contact INSPIRE Framework for support, product questions, billing questions, and review inquiries for personalized AI instructions.",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          {
            "@type": "ContactPage",
            "@id": `${siteUrl}/contact#webpage`,
            url: `${siteUrl}/contact`,
            name: "Contact INSPIRE Framework",
            isPartOf: { "@id": websiteId },
            publisher: { "@id": organizationId },
          },
        ],
      },
    };
  }

  if (pathname === "/research") {
    if (locale === "ar") {
      return {
        path: "/research",
        title: "خلفية INSPIRE & CRAFTS البحثية — تخصيص التفاعل مع الذكاء الاصطناعي",
        description:
          "اقرأ الخلفية البحثية وراء INSPIRE Framework ومنهج INSPIRE & CRAFTS لتخصيص التفاعل مع الذكاء الاصطناعي.",
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Research", path: "/research" },
            ]),
            {
              "@type": "ScholarlyArticle",
              "@id": "https://dx.doi.org/10.2139/ssrn.5358595",
              name: "Inspire & Crafts: A Dual Framework for Individual AI Interaction Customization",
              author: {
                "@type": "Person",
                name: "Haitham Hamadneh",
              },
              url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595",
              sameAs: "https://dx.doi.org/10.2139/ssrn.5358595",
            },
          ],
        },
      };
    }

    return {
      path: "/research",
      title: "INSPIRE & CRAFTS Research — AI Interaction Customization",
      description:
        "Read the research background behind INSPIRE Framework and the INSPIRE & CRAFTS approach to personalized AI interaction and prompt instructions.",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Research", path: "/research" },
          ]),
          {
            "@type": "ScholarlyArticle",
            "@id": "https://dx.doi.org/10.2139/ssrn.5358595",
            name: "Inspire & Crafts: A Dual Framework for Individual AI Interaction Customization",
            author: {
              "@type": "Person",
              name: "Haitham Hamadneh",
            },
            url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595",
            sameAs: "https://dx.doi.org/10.2139/ssrn.5358595",
          },
        ],
      },
    };
  }

  if (pathname === "/assess/mini") {
    return {
      path: "/assess/mini",
      title: "Short AI Instructions — INSPIRE Framework",
      description:
        "Answer a few quick questions and get short personalized AI instructions for ChatGPT, Claude, and Gemini.",
    };
  }

  if (pathname === "/guides") {
    if (locale === "ar") {
      return {
        path: "/guides",
        title: "أدلة عملية لكتابة تعليمات أفضل للذكاء الاصطناعي — INSPIRE",
        description:
          "أدلة عملية عن كتابة مطالبات أفضل، تعليمات ChatGPT، هندسة المطالبات، المطالبات العربية، وتعليمات الذكاء الاصطناعي المخصصة.",
        jsonLd: breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ]),
      };
    }

    return {
      path: "/guides",
      title: "AI Prompt Guides and AI Operating Profile Guides — INSPIRE",
      description:
        "Practical guides for AI Operating Profiles, ChatGPT custom instructions, prompt engineering, Arabic AI prompts, and personalized AI instructions.",
      jsonLd: breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Guides", path: "/guides" },
      ]),
    };
  }

  if (pathname.startsWith("/guides/")) {
    const slug = pathname.replace("/guides/", "");
    if (locale === "ar" && guideSeoAr[slug]) {
      return {
        ...guideSeo[slug],
        ...guideSeoAr[slug],
        jsonLd: undefined,
      };
    }

    return guideSeo[slug] ?? {
      path: "/guides",
      title: "AI Prompt Guides — INSPIRE Framework",
      description: "Practical guides for better prompts, AI instructions, and AI productivity.",
    };
  }

  if (pathname === "/terms") {
    if (locale === "ar") {
      return {
        path: "/terms",
        title: "شروط الخدمة — INSPIRE Framework",
        description:
          "شروط استخدام INSPIRE Framework، المنتج الرقمي الذاتي لإنشاء تعليمات مخصصة للذكاء الاصطناعي.",
      };
    }

    return {
      path: "/terms",
      title: "Terms of Service — INSPIRE Framework",
      description: "Terms for using INSPIRE Framework, a self-serve personalized AI instruction product.",
    };
  }

  if (pathname === "/privacy") {
    if (locale === "ar") {
      return {
        path: "/privacy",
        title: "سياسة الخصوصية — INSPIRE Framework",
        description:
          "كيفية جمع INSPIRE Framework للمعلومات واستخدامها وحمايتها لتقديم تجربة التقييم والتقرير الرقمي المخصص للذكاء الاصطناعي.",
      };
    }

    return {
      path: "/privacy",
      title: "Privacy Policy — INSPIRE Framework",
      description: "How INSPIRE Framework collects and uses information to generate personalized AI instructions.",
    };
  }

  if (pathname === "/refund-policy") {
    if (locale === "ar") {
      return {
        path: "/refund-policy",
        title: "سياسة الاسترداد — INSPIRE Framework",
        description:
          "سياسة الاسترداد الخاصة بتقرير INSPIRE Framework الرقمي وطلبات الاسترداد المؤهلة للمنتج الرقمي المخصص للذكاء الاصطناعي.",
      };
    }

    return {
      path: "/refund-policy",
      title: "Refund Policy — INSPIRE Framework",
      description: "Refund policy for the INSPIRE Framework personalized AI instruction product.",
    };
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/my-assessments") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/review-demo") ||
    pathname.startsWith("/share") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/privacy-consent")
  ) {
    return {
      path: pathname,
      title: "INSPIRE Framework",
      description: defaultSeo.description,
      robots: "noindex, nofollow",
    };
  }

  return defaultSeo;
}

function setMeta(nameOrProperty: "name" | "property", key: string, content: string) {
  const selector = `meta[${nameOrProperty}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(nameOrProperty, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}

function setAlternateLinks(path: string) {
  document.head.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]').forEach((link) => {
    link.remove();
  });

  const alternatives = [
    { hreflang: "en", path: localizePath(path, "en") },
    { hreflang: "ar", path: localizePath(path, "ar") },
    { hreflang: "x-default", path: localizePath(path, "en") },
  ];

  for (const item of alternatives) {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = item.hreflang;
    link.href = `${siteUrl}${item.path}`;
    link.dataset.localeLink = "true";
    document.head.appendChild(link);
  }
}

function setJsonLd(data?: Record<string, unknown>) {
  const id = "route-json-ld";
  let script = document.head.querySelector<HTMLScriptElement>(`script[data-seo="${id}"]`);

  if (!data) {
    script?.remove();
    return;
  }

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = id;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

export function applySeo(config: SeoConfig, locale?: Locale) {
  const activeLocale = locale ?? config.locale ?? (document.documentElement.lang === "ar" ? "ar" : "en");
  const canonicalPath = localizePath(config.path, activeLocale);
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  document.title = config.title;
  setMeta("name", "description", config.description);
  setMeta("name", "robots", config.robots ?? "index, follow");
  setCanonical(canonicalUrl);
  setAlternateLinks(config.path);

  setMeta("property", "og:title", config.title);
  setMeta("property", "og:description", config.description);
  setMeta("property", "og:url", canonicalUrl);
  setMeta("property", "og:image", imageUrl);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", "INSPIRE Framework");

  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", config.title);
  setMeta("name", "twitter:description", config.description);
  setMeta("name", "twitter:image", imageUrl);
  setJsonLd(config.jsonLd);
}
