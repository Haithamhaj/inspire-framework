# SEO Measurement Setup

Last updated: May 14, 2026

## Goal

Move keyword and SEO decisions from assumptions to measured search data for Saudi Arabia, the GCC, Arabic, and English queries.

## Required Tools

- Google Search Console for indexing, sitemap submission, impressions, clicks, and query data.
- Bing Webmaster Tools for additional indexing and search visibility.
- Google Trends for directional Saudi/GCC keyword comparison.
- Google Keyword Planner if an Ads account is available.

## Recommended Setup Order

1. Add `https://inspire.next-stepai.com` as a domain or URL-prefix property in Google Search Console.
2. Verify ownership through DNS, HTML file, or meta tag. DNS is preferred if domain access is available.
3. Submit `https://inspire.next-stepai.com/sitemap.txt` first. Keep `sitemap.xml` available for crawlers that read XML correctly.
4. Add the same site in Bing Webmaster Tools and submit the sitemap.
5. After indexing starts, review:
   - Arabic queries
   - English GCC/Saudi queries
   - page impressions
   - click-through rate
   - indexed pages
   - `hreflang` or sitemap warnings

## Data To Track

- Queries containing: prompt, prompt engineering, ChatGPT instructions, AI productivity, AI operating profile.
- Arabic queries containing: برومبت، هندسة الأوامر، تعليمات ChatGPT، استخدام الذكاء الاصطناعي في العمل.
- Pages earning impressions but low clicks; these need better titles/descriptions.
- Pages with impressions from irrelevant queries; these need clearer positioning.

## Current Blocker

Search Console verification is complete. Replit currently renders `sitemap.xml` as plain text in Chrome, so `sitemap.txt` is the preferred Search Console submission target.
