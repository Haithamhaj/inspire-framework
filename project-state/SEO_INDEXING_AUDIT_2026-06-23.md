# SEO Indexing Audit - June 23, 2026

## Current Question

Why did Google index only a small subset of the sitemap pages while many other submitted pages remain unknown, discovered but not indexed, or crawled but not indexed?

## Data Source

- Google Search Console URL Inspection API for `sc-domain:inspire.next-stepai.com`.
- Local code review of sitemap, robots, route metadata, prerendered HTML, navigation, footer links, guide content, and client-side SEO handling.
- Sitemap reviewed: `artifacts/inspire-web/public/sitemap.xml` and `artifacts/inspire-web/public/sitemap.txt`.

Confidence: medium-high. The Search Console status is direct evidence, but some crawl snapshots are old. Several indexed guide pages were last crawled on May 19, 2026, while the codebase has changed since then.

## Search Console Result Summary

| Status | URLs |
| --- | ---: |
| Submitted and indexed | 6 |
| Crawled - currently not indexed | 1 |
| Discovered - currently not indexed | 9 |
| URL is unknown to Google | 14 |
| Total sitemap URLs checked | 30 |

## Indexed URLs

- `https://inspire.next-stepai.com/`
- `https://inspire.next-stepai.com/ar`
- `https://inspire.next-stepai.com/guides/chatgpt-custom-instructions`
- `https://inspire.next-stepai.com/ar/guides/chatgpt-custom-instructions`
- `https://inspire.next-stepai.com/guides/ai-operating-profile`
- `https://inspire.next-stepai.com/ar/guides/ai-operating-profile`

Important correction: the current API result shows 6 indexed URLs, not 5.

## Non-Indexed URL Groups

### Crawled But Not Indexed

- `https://inspire.next-stepai.com/guides/how-to-write-better-prompts`

Meaning: Google fetched this page successfully on June 16, 2026, but did not consider it strong or distinct enough to index yet.

### Discovered But Not Indexed

- `https://inspire.next-stepai.com/ar/pricing`
- `https://inspire.next-stepai.com/research`
- `https://inspire.next-stepai.com/assess/mini`
- `https://inspire.next-stepai.com/ar/guides`
- `https://inspire.next-stepai.com/ar/guides/how-to-write-better-prompts`
- `https://inspire.next-stepai.com/guides/arabic-ai-prompts`
- `https://inspire.next-stepai.com/ar/terms`
- `https://inspire.next-stepai.com/privacy`
- `https://inspire.next-stepai.com/refund-policy`

Meaning: Google knows these URLs, mostly from the sitemap, but has not crawled them yet.

### Unknown To Google

- `https://inspire.next-stepai.com/pricing`
- `https://inspire.next-stepai.com/about`
- `https://inspire.next-stepai.com/ar/about`
- `https://inspire.next-stepai.com/ar/research`
- `https://inspire.next-stepai.com/contact`
- `https://inspire.next-stepai.com/ar/contact`
- `https://inspire.next-stepai.com/ar/assess/mini`
- `https://inspire.next-stepai.com/guides`
- `https://inspire.next-stepai.com/guides/prompt-engineering-for-work`
- `https://inspire.next-stepai.com/ar/guides/prompt-engineering-for-work`
- `https://inspire.next-stepai.com/ar/guides/arabic-ai-prompts`
- `https://inspire.next-stepai.com/terms`
- `https://inspire.next-stepai.com/ar/privacy`
- `https://inspire.next-stepai.com/ar/refund-policy`

Meaning: despite sitemap inclusion, URL Inspection does not show these URLs as known. This can happen when sitemap processing is still incomplete, internal discovery is weak, or Google has not prioritized the site deeply yet.

## Technical Findings

### 1. Internal Linking Is Too Shallow For Individual Guides

Facts:
- The top navbar links only to home, auth/account actions, and assessment CTAs.
- The footer links to `/guides`, but not to individual guide pages.
- Individual guide pages are discoverable from `/guides`, so they are usually at depth 2 from globally linked pages.
- Search Console referring URLs for several non-indexed pages show only `sitemap.xml`, not strong internal page referrals.

Impact:
- Google is treating many URLs as sitemap-discovered rather than site-discovered.
- This likely explains why several pages are "Discovered - currently not indexed" and some are still unknown.

Recommendation:
- Add a compact "Guides" link to the navbar on public pages.
- Add footer links to the most important guide pages:
  - AI Operating Profile
  - ChatGPT Custom Instructions
  - Prompt Engineering for Work
- Add contextual links from the home page and pricing page into the AI Operating Profile and ChatGPT Custom Instructions pages.

### 2. The AI Operating Profile Page Is Indexed, But Its Search Positioning Is Blurred

Facts:
- `/guides/ai-operating-profile` is indexed.
- Its current English title is "What Are Personalized AI Instructions?".
- Its meta title is "What Are Personalized AI Instructions? - INSPIRE Framework".
- The phrase "AI Operating Profile" appears in the slug and some supporting text, but not as the primary H1/title.

Impact:
- Google can index the URL, but may classify it under "personalized AI instructions" rather than the category INSPIRE wants to own: "AI Operating Profile".
- This supports the product concern that Google understands "ChatGPT Custom Instructions" more clearly than the unique INSPIRE category.

Recommendation:
- Rename the guide H1/title to make the category explicit:
  - "AI Operating Profile: What It Is and How It Helps ChatGPT Work With You"
- Keep "personalized AI instructions" as a secondary phrase, not the primary category.
- Add a short definition near the top: "An AI Operating Profile is a reusable instruction profile that tells AI tools your goal, working style, preferences, boundaries, and quality rules."

### 3. Sitemap Inclusion Exists, But Sitemap Alone Is Not Enough

Facts:
- All 30 reviewed URLs are present in `sitemap.xml` and `sitemap.txt`.
- Robots allows public pages and blocks private/app pages correctly.
- Search Console confirms sitemap discovery for several non-indexed URLs.

Impact:
- The problem is not a missing sitemap.
- The likely problem is prioritization: weak internal linking, low external authority, similar/thin page templates, and unclear topical hierarchy.

Recommendation:
- Keep sitemap as-is for now.
- Improve internal links before adding many new pages.
- After internal links are deployed, request indexing for only the highest-value URLs first.

### 4. Canonical And Hreflang Need Re-Verification After Deploy

Facts:
- Current source code localizes canonical URLs with `localizePath(config.path, activeLocale)`.
- Search Console reports older crawl data where some Arabic guide pages showed English `userCanonical` while Google selected the Arabic canonical.
- Prerender script now writes localized canonical URLs for prerendered pages.

Impact:
- This may be stale Search Console data, but it is high-risk enough to verify after the next deploy.
- Incorrect canonical on Arabic pages can weaken Arabic URL indexing and confuse hreflang clusters.

Recommendation:
- After deploying, inspect source HTML for these URLs:
  - `/ar/guides/chatgpt-custom-instructions`
  - `/ar/guides/ai-operating-profile`
  - `/ar/pricing`
- Confirm each Arabic page has:
  - canonical pointing to its `/ar/...` URL
  - `hreflang="en"` pointing to English URL
  - `hreflang="ar"` pointing to Arabic URL
  - `hreflang="x-default"` pointing to English URL

### 5. Structured Data Exists On Guide Pages, But Rich Result Output Is Minimal

Facts:
- Guide pages include Article, FAQPage, and BreadcrumbList JSON-LD.
- Search Console detected Breadcrumbs on indexed guide pages.
- It did not report FAQ rich results in the inspected output.

Impact:
- Structured data is present, but it is not the main reason for indexing selection.
- The priority should be content clarity and internal links, not adding more schema types.

Recommendation:
- Keep existing structured data.
- Fix breadcrumb naming if "Unnamed item" continues appearing after recrawl.
- Do not add more schema until the internal linking and topical structure are stronger.

### 6. Rendered HTML Size Is Acceptable But Content Is Lightweight

Facts:
- Prerendered guide HTML files are roughly 8 KB each.
- Base pages are roughly 5-6 KB each.
- The guide pages use repeated page patterns and relatively short sections.

Impact:
- HTML size is not blocking crawl.
- The issue is more likely content depth/distinctiveness and internal priority.

Recommendation:
- Expand only the pages that support the core topic cluster.
- Do not publish many generic AI articles.
- Strengthen the AI Operating Profile page first, then comparison pages.

## Why Google Selected These Pages

Best explanation:

1. Home and Arabic home were indexed because they are top-level, globally linked, canonical, and central.
2. ChatGPT Custom Instructions pages were indexed because the topic is a known search entity and the page title/H1 match a recognized query.
3. AI Operating Profile pages were indexed because they are in the sitemap, internally paired between English/Arabic, and likely crawled as part of the guide cluster.
4. Other pages either have weaker internal discovery, lower perceived value, lower uniqueness, or are lower-priority legal/trust pages.
5. The "how to write better prompts" page proves Google can crawl guides, but may still choose not to index if the page does not look distinct enough or important enough.

## Recommended Execution Order

### P0 - Internal Linking And Topic Clarity

1. Add public navigation access to `/guides`.
2. Add footer links to:
   - `/guides/ai-operating-profile`
   - `/guides/chatgpt-custom-instructions`
   - `/guides/prompt-engineering-for-work`
3. Add contextual links from home and pricing to AI Operating Profile and ChatGPT Custom Instructions.
4. Retitle `/guides/ai-operating-profile` around "AI Operating Profile".

### P1 - Topic Cluster Drafts

Create drafts first, do not publish all at once:
- AI Operating Profile Examples
- AI Operating Profile vs ChatGPT Custom Instructions
- AI Operating Profile vs Custom GPT
- AI Operating Profile for Consultants
- AI Operating Profile for Managers
- AI Operating Profile for Founders
- AI Operating Profile for Students

### P2 - Comparison Pages

Publish 2-3 high-intent comparison pages after P0 is deployed:
- AI Operating Profile vs ChatGPT Custom Instructions
- Custom Instructions vs Projects
- Custom GPT vs AI Operating Profile

### P3 - Re-Inspect

After deployment:
- Use Search Console URL Inspection on the P0 pages.
- Request indexing for the top 5 URLs only.
- Wait several days before judging the effect.

## What Not To Do Now

- Do not redesign the site.
- Do not change colors or hero layout for SEO.
- Do not publish dozens of generic AI articles.
- Do not add many overlapping schema types.
- Do not rely on sitemap resubmission alone.

## Bottom Line

The immediate issue is not that Google is blocked. Robots, sitemap, canonical intent, and prerendering are mostly present.

The real problem is that many pages are weakly prioritized from inside the site, and the unique category "AI Operating Profile" is not consistently presented as the primary category in titles, headings, and internal links.
