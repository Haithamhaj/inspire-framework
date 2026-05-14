# INSPIRE SEO Execution Plan

Last updated: May 14, 2026

## Goal

Make INSPIRE discoverable and credible for people in Saudi Arabia, the GCC, and the wider Middle East who want better AI instructions, prompt engineering workflows, and personalized AI operating profiles.

## Source Strategy

Use sources by confidence level:

- Primary product authority:
  - INSPIRE product behavior and assessment output.
  - The SSRN paper: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595
  - Next-stepAI brand/entity context.
  - Smart Prompt Engineer GPT as a practical companion tool, only where its public or owner-provided description is available.
- Official prompt-engineering references:
  - OpenAI prompt engineering documentation: https://platform.openai.com/docs/guides/prompt-engineering/strategy
  - Anthropic Claude prompt engineering documentation: https://docs.claude.com/claude/docs/prompt-engineering
  - Google/Gemini prompting resources when used from official Google sources.
- SEO and indexing references:
  - Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
  - Google international SEO guidance: https://developers.google.com/search/docs/specialty/international
- Regional market references:
  - SDAIA, SPA, DGA, Microsoft, PwC, McKinsey, BCG, Deloitte, or similar reputable sources for Saudi/GCC AI adoption context.

Do not publish unsupported AI-generated statistics. GPT, Claude, and Gemini can help generate keyword and content ideas, but they are not treated as factual sources unless backed by official or primary references.

Examples should read like useful product education, not defensive disclaimers. When a page uses an example, explain the method behind it in natural language and include relevant references nearby when they help the reader trust the guidance. Do not make examples look sourced from OpenAI, Anthropic, Google, SSRN, or Next-stepAI unless the source actually contains that exact example or supports the claim being made.

## Phase 1: Trust And Entity Foundation

Tasks:
- [x] Add `/about` page explaining who created INSPIRE, what problem it solves, and how it relates to the INSPIRE & CRAFTS research.
- [x] Add `/research` page summarizing the SSRN paper in plain language and linking to the DOI/SSRN page.
- [x] Add `/contact` page with product/support contact and clear digital-product expectations.
- [x] Add footer links to these pages.
- [x] Add metadata, sitemap entries, and `llms.txt` entries.
- [x] Refine trust/pricing pages with positive Arabic/English copy and Arabic metadata.
- [x] Localize legal review pages with professional Arabic copy and Arabic metadata.

Expected result:
- Reviewers and search engines can understand the entity, author, research basis, and support path.

## Phase 2: Content Hub Expansion

Tasks:
- [x] Expand each existing guide into a deeper page with examples, mistakes, and practical templates.
- [x] Add FAQ blocks to guide pages.
- [x] Add `FAQPage`, `Article`, and `BreadcrumbList` structured data where appropriate.
- [x] Add stronger internal links from guide pages to the free quick assessment and pricing page.
- [x] Add natural source/method notes so examples feel credible without defensive AI-written disclaimers.
- [x] Localize visible guide hub and guide detail content for Arabic users while preserving the existing URL structure.
- [x] Add a secondary Smart Prompt Coach CTA to help readers apply CRAFTS after reading the guide example.

Expected result:
- The guide hub becomes useful enough to rank for practical prompt-engineering searches, not just exist as thin SEO content.

## Phase 3: Arabic And GCC Positioning

Tasks:
- [ ] Add Arabic-first content targeting Saudi/GCC users.
- [x] Decide whether Arabic pages should be separate localized URLs or bilingual pages.
- [x] Add `/ar/...` Arabic URL structure for public pages while keeping `?lang=ar` as a compatibility fallback.
- [x] Add `hreflang` alternates after stabilizing the language URL strategy.
- [ ] Add examples for Arabic, English, and bilingual workflows.

Expected result:
- INSPIRE has a clearer regional advantage instead of competing only in broad English AI keyword searches.

## Phase 4: Keyword Validation And Measurement

Tasks:
- [ ] Use Google Trends for Saudi Arabia/GCC keyword comparisons.
- [ ] Use Google Keyword Planner if Ads access is available.
- [ ] Connect Google Search Console and Bing Webmaster Tools.
- [x] Submit the initial sitemap in Google Search Console.
- [ ] Submit `sitemap.txt` as the preferred Search Console sitemap if Replit continues serving `sitemap.xml` with an HTML/plain-text response.
- [ ] Review impressions/queries after indexing and refine content around actual search data.

Expected result:
- Keyword strategy is refined from real search signals rather than guesses.

## Phase 5: Technical SEO Upgrade

Tasks:
- [ ] Optimize image weight and alt text.
- [ ] Inspect bundle size and lazy-load heavy non-critical frontend code if needed.
- [ ] Move public marketing/content pages to prerender/SSR/SSG when leaving temporary Replit hosting or when technically practical.
- [ ] Keep private/auth/result pages out of the index.

Expected result:
- Public pages become faster and easier for crawlers to understand.

## Current Recommended Sequence

1. Complete Phase 1 trust/entity pages.
2. Add structured data and sitemap coverage.
3. Expand current guides with FAQ and examples.
4. Add Arabic/GCC content strategy once the first pages are stable.
5. Connect measurement tools and refine from actual search data.
