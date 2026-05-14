export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  robots?: string;
};

const siteUrl = "https://inspire.next-stepai.com";
const imageUrl = `${siteUrl}/opengraph.jpg`;

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

