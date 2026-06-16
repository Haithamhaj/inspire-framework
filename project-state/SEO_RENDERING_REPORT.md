# SEO Rendering Before/After Report

Date: 2026-06-16

## Summary

The frontend now prerenders the 30 public sitemap URLs during `@workspace/inspire-web` build. Each public SEO URL gets a real route-specific `index.html` file under `artifacts/inspire-web/dist/public`, with unique metadata, self-referencing canonical, rendered H1/body content, JSON-LD, and EN/AR/x-default hreflang before JavaScript runs.

The Replit static artifact no longer uses a universal `/* -> /index.html` production rewrite. Public prerendered SEO files can be served directly, while app-only routes still fall back to the SPA shell.

## Before

Live audit before implementation found public routes returned the same raw HTML shell:

| URL | Raw title | Raw canonical | Raw description | Raw H1 | Raw structured data |
| --- | --- | --- | --- | --- | --- |
| `/guides/chatgpt-custom-instructions` | `INSPIRE Framework — AI Operating Profile & Prompt Instructions` | `https://inspire.next-stepai.com/` | Homepage description | Missing | Global Organization/WebSite/SoftwareApplication only |
| `/guides/ai-operating-profile` | Same homepage title | `https://inspire.next-stepai.com/` | Homepage description | Missing | Global only |
| `/guides/how-to-write-better-prompts` | Same homepage title | `https://inspire.next-stepai.com/` | Homepage description | Missing | Global only |
| `/research` | Same homepage title | `https://inspire.next-stepai.com/` | Homepage description | Missing | Global only |
| `/about` | Same homepage title | `https://inspire.next-stepai.com/` | Homepage description | Missing | Global only |

## After

Verified against the built static output through a route-first static server using raw HTML requests.

| URL | Raw title | Raw canonical | Raw description | Raw H1 | Raw structured data |
| --- | --- | --- | --- | --- | --- |
| `/guides/chatgpt-custom-instructions` | `ChatGPT Custom Instructions: What to Include — INSPIRE` | `https://inspire.next-stepai.com/guides/chatgpt-custom-instructions` | Practical guide to ChatGPT custom instructions, assistant behavior, reusable prompt rules, and personalized AI instructions. | `ChatGPT Custom Instructions: What to Include` | Organization, WebSite, SoftwareApplication, BreadcrumbList, Article, FAQPage |
| `/guides/ai-operating-profile` | `What Are Personalized AI Instructions? — INSPIRE Framework` | `https://inspire.next-stepai.com/guides/ai-operating-profile` | Personalized AI instructions for ChatGPT, Claude, Gemini, goals, working style, boundaries, and response format. | `What Are Personalized AI Instructions?` | Organization, WebSite, SoftwareApplication, BreadcrumbList, Article, FAQPage |
| `/guides/how-to-write-better-prompts` | `How to Write Better AI Prompts — INSPIRE Guide` | `https://inspire.next-stepai.com/guides/how-to-write-better-prompts` | How to write better prompts using goals, roles, constraints, examples, and quality rules. | `How to Write Better Prompts for AI` | Organization, WebSite, SoftwareApplication, BreadcrumbList, Article, FAQPage |
| `/research` | `INSPIRE & CRAFTS Research — AI Interaction Customization` | `https://inspire.next-stepai.com/research` | Research background behind INSPIRE Framework and INSPIRE & CRAFTS. | `INSPIRE & CRAFTS research background` | Organization, WebSite, SoftwareApplication, BreadcrumbList, ScholarlyArticle |
| `/about` | `About INSPIRE Framework — Personalized AI Instructions` | `https://inspire.next-stepai.com/about` | About INSPIRE Framework and personalized AI instructions for ChatGPT, Claude, and Gemini. | `A practical framework for personal AI instructions` | Organization, WebSite, SoftwareApplication, BreadcrumbList, AboutPage |

## Verification

Build command:

```bash
pnpm --filter @workspace/inspire-web run build
```

Result:

```text
Prerendered 30 SEO pages.
```

Raw HTML coverage check:

```text
checked: 30
failures: 0
unknown URL status: 404
```

Representative curl extraction confirmed every checked route had:

- Unique `<title>`
- Unique `<meta name="description">`
- Self-referencing canonical
- Rendered `<h1>`
- 3 hreflang tags: `en`, `ar`, `x-default`
- Route-specific JSON-LD in raw HTML

## Remaining Deployment Check

After Replit deployment, run live `curl` checks against `https://inspire.next-stepai.com/...` to confirm Replit serves exact prerendered files before SPA rewrites.
