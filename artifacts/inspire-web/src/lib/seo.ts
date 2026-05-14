export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  robots?: string;
  jsonLd?: Record<string, unknown>;
};

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

const guideSeo: Record<string, SeoConfig> = {
  "how-to-write-better-prompts": {
    path: "/guides/how-to-write-better-prompts",
    title: "How to Write Better AI Prompts — INSPIRE Guide",
    description:
      "Learn how to write better prompts for ChatGPT, Claude, and Gemini using goals, roles, constraints, examples, and quality rules.",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "How to Write Better AI Prompts", path: "/guides/how-to-write-better-prompts" },
    ]),
  },
  "chatgpt-custom-instructions": {
    path: "/guides/chatgpt-custom-instructions",
    title: "ChatGPT Custom Instructions: What to Include — INSPIRE",
    description:
      "A practical guide to ChatGPT custom instructions, AI assistant behavior, reusable prompt rules, and personal AI operating profiles.",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "ChatGPT Custom Instructions", path: "/guides/chatgpt-custom-instructions" },
    ]),
  },
  "prompt-engineering-for-work": {
    path: "/guides/prompt-engineering-for-work",
    title: "Prompt Engineering for Work in Saudi Arabia and the GCC",
    description:
      "Use prompt engineering at work for planning, writing, analysis, bilingual communication, and productivity across Saudi Arabia and GCC teams.",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "Prompt Engineering for Work", path: "/guides/prompt-engineering-for-work" },
    ]),
  },
  "ai-operating-profile": {
    path: "/guides/ai-operating-profile",
    title: "What Is an AI Operating Profile? — INSPIRE Framework",
    description:
      "An AI operating profile is a reusable instruction layer that helps ChatGPT, Claude, and Gemini work with your goals, style, and constraints.",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "AI Operating Profile", path: "/guides/ai-operating-profile" },
    ]),
  },
  "arabic-ai-prompts": {
    path: "/guides/arabic-ai-prompts",
    title: "Arabic AI Prompts and Bilingual AI Instructions — INSPIRE",
    description:
      "Learn how Arabic-speaking users can write better AI prompts and bilingual instructions for ChatGPT, Claude, and Gemini.",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "Arabic AI Prompts", path: "/guides/arabic-ai-prompts" },
    ]),
  },
};

export const defaultSeo: SeoConfig = {
  path: "/",
  title: "INSPIRE Framework — AI Operating Profile & Prompt Instructions",
  description:
    "Build a personal AI operating profile for ChatGPT, Claude, and Gemini. INSPIRE turns your working style into copy-ready AI instructions, starter prompts, and a digital report.",
};

export function getSeoForPath(pathname: string): SeoConfig {
  if (pathname === "/pricing") {
    return {
      path: "/pricing",
      title: "INSPIRE Pricing — $10 AI Operating Profile Report",
      description:
        "Simple INSPIRE pricing: a free quick assessment and a $10 one-time digital AI operating profile report with copy-ready prompt instructions.",
      jsonLd: breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Pricing", path: "/pricing" },
      ]),
    };
  }

  if (pathname === "/about") {
    return {
      path: "/about",
      title: "About INSPIRE Framework — AI Operating Profile Research and Product",
      description:
        "Learn about INSPIRE Framework, a digital assessment that creates personal AI operating profiles and prompt instructions for ChatGPT, Claude, and Gemini.",
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
              "INSPIRE Framework is a self-serve digital assessment that turns a user's goals, work style, preferences, and constraints into AI operating profile instructions.",
            isPartOf: { "@id": websiteId },
            publisher: { "@id": organizationId },
          },
        ],
      },
    };
  }

  if (pathname === "/contact") {
    return {
      path: "/contact",
      title: "Contact INSPIRE Framework — Support and Product Questions",
      description:
        "Contact INSPIRE Framework for support, product questions, billing questions, and review inquiries for the digital AI operating profile report.",
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
      title: "Free AI Prompt Assessment — INSPIRE Framework",
      description:
        "Try a free quick AI working-style assessment and get starter prompts for better ChatGPT, Claude, and Gemini results.",
    };
  }

  if (pathname === "/guides") {
    return {
      path: "/guides",
      title: "AI Prompt Guides for Work — INSPIRE Framework",
      description:
        "Practical guides for better AI prompts, ChatGPT custom instructions, prompt engineering, Arabic AI prompts, and AI operating profiles.",
      jsonLd: breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Guides", path: "/guides" },
      ]),
    };
  }

  if (pathname.startsWith("/guides/")) {
    const slug = pathname.replace("/guides/", "");
    return guideSeo[slug] ?? {
      path: "/guides",
      title: "AI Prompt Guides — INSPIRE Framework",
      description: "Practical guides for better prompts, AI instructions, and AI productivity.",
    };
  }

  if (pathname === "/terms") {
    return {
      path: "/terms",
      title: "Terms of Service — INSPIRE Framework",
      description: "Terms for using INSPIRE Framework, a self-serve digital AI operating profile and prompt instruction product.",
    };
  }

  if (pathname === "/privacy") {
    return {
      path: "/privacy",
      title: "Privacy Policy — INSPIRE Framework",
      description: "How INSPIRE Framework collects and uses information to generate digital AI operating profile reports.",
    };
  }

  if (pathname === "/refund-policy") {
    return {
      path: "/refund-policy",
      title: "Refund Policy — INSPIRE Framework",
      description: "Refund policy for the INSPIRE Framework digital AI operating profile report.",
    };
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/my-assessments") ||
    pathname.startsWith("/results") ||
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

export function applySeo(config: SeoConfig) {
  const canonicalUrl = `${siteUrl}${config.path === "/" ? "/" : config.path}`;
  document.title = config.title;
  setMeta("name", "description", config.description);
  setMeta("name", "robots", config.robots ?? "index, follow");
  setCanonical(canonicalUrl);

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
