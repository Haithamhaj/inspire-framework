# Task #16 — Landing Page Visual QA Manifest

## Scope
Full visual QA of the INSPIRE landing page after the v2 copy refresh
(Task #15), covering every section: hero, goal picker, before/after,
philosophy, INSPIRE 7 components, sample output, how-it-works,
pricing, FAQ, and final CTA.

## Viewports & Locales
- Desktop: 1280px wide
- Mobile: 402px wide
- Locales: English (LTR) and Arabic (RTL)

## Capture Method
A temporary `?qa=1&scrollY=<Y>` helper was added to `landing.tsx` to
disable framer-motion `whileInView` animations and scroll to a given
offset, so each screenshot captures fully-rendered sections instead
of blank pre-animation states. The helper has been fully reverted;
`landing.tsx` has zero net diff in this commit.

## Files
| File | Locale | Width | scrollY |
|------|--------|-------|---------|
| en-desktop-1.jpg | EN | 1280 | 0 |
| en-desktop-2.jpg | EN | 1280 | 3000 |
| en-desktop-3.jpg | EN | 1280 | 6000 |
| ar-desktop-1.jpg | AR | 1280 | 0 |
| ar-desktop-2.jpg | AR | 1280 | 3000 |
| ar-desktop-3.jpg | AR | 1280 | 6000 |
| en-mobile-1.jpg  | EN | 402  | 0 |
| en-mobile-2.jpg  | EN | 402  | 3000 |
| en-mobile-3.jpg  | EN | 402  | 6000 |
| en-mobile-4.jpg  | EN | 402  | 9000 |
| ar-mobile-1.jpg  | AR | 402  | 0 |
| ar-mobile-2.jpg  | AR | 402  | 3000 |
| ar-mobile-3.jpg  | AR | 402  | 6000 |
| ar-mobile-4.jpg  | AR | 402  | 9000 |

(Earlier `*-5.jpg` mobile captures at scrollY 12000 were duplicates of
the bottom-of-page `*-4.jpg` views and have been removed.)

## QA Result: NO ISSUES FOUND
- No line-wrap, overflow, or clipping regressions.
- The long AR pricing string
  ("خريطة عملية لملف INSPIRE عبر المكونات السبعة") wraps cleanly to
  2 lines inside the pricing card.
- RTL alignment is correct across all sections (hero, axes grid,
  before/after, FAQ rows, CTA arrows mirrored to ArrowLeft).
- Gradient CTA buttons render without text breaks at both widths.
- FAQ rows, INSPIRE 7 cards, and the sample output code block render
  correctly in both locales.

No copy or layout code changes were required.
