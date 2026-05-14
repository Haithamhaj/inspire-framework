export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  robots?: string;
};

const siteUrl = "https://inspire.next-stepai.com";
const imageUrl = `${siteUrl}/opengraph.jpg`;
const guideSeo: Record<string, SeoConfig> = {
  "how-to-write-better-prompts": {
    path: "/guides/how-to-write-better-prompts",
    title: "How to Write Better AI Prompts — INSPIRE Guide",
    description:
      "Learn how to write better prompts for ChatGPT, Claude, and Gemini using goals, roles, constraints, examples, and quality rules.",
  },
  "chatgpt-custom-instructions": {
    path: "/guides/chatgpt-custom-instructions",
    title: "ChatGPT Custom Instructions: What to Include — INSPIRE",
    description:
      "A practical guide to ChatGPT custom instructions, AI assistant behavior, reusable prompt rules, and personal AI operating profiles.",
  },
  "prompt-engineering-for-work": {
    path: "/guides/prompt-engineering-for-work",
    title: "Prompt Engineering for Work in Saudi Arabia and the GCC",
    description:
      "Use prompt engineering at work for planning, writing, analysis, bilingual communication, and productivity across Saudi Arabia and GCC teams.",
  },
  "ai-operating-profile": {
    path: "/guides/ai-operating-profile",
    title: "What Is an AI Operating Profile? — INSPIRE Framework",
    description:
      "An AI operating profile is a reusable instruction layer that helps ChatGPT, Claude, and Gemini work with your goals, style, and constraints.",
  },
  "arabic-ai-prompts": {
    path: "/guides/arabic-ai-prompts",
    title: "Arabic AI Prompts and Bilingual AI Instructions — INSPIRE",
    description:
      "Learn how Arabic-speaking users can write better AI prompts and bilingual instructions for ChatGPT, Claude, and Gemini.",
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
}
