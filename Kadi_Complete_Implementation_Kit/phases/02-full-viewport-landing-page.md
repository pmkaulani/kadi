# Phase 02 — Match the landing-page reference and fit one viewport

Inspect `reference/landing-page-reference.png`. Implement the existing `/` page, not a new route. Use `snippets/KadiFullViewportHero.tsx`, `snippets/landing-hero-slides.ts`, `snippets/kadi-viewport-hero.css` and `snippets/PublicNavbar.hero-patch.md` as the concrete starting point; adapt imports and types to the active project.

## Target composition

- One full viewport-height dark photographic opening with nav included, headline left, strong photograph on right, category-aware copy and two visible actions.
- First visual may use `/public/kadi/hero-envelope.webp`, but the messaging must mention birthdays, graduations, housewarmings, weddings, memorials and other events.
- At least one image slide per currently available category, selected by unique category from the real template catalogue; once the catalogue grows, the hero carousel must rotate into non-wedding art too.
- Below the viewport hero: a diverse occasion strip/grid, then template examples, then how-it-works, then closing CTA/footer. The sections below may scroll normally; the entire hero itself may not need scrolling.
- Keep the actual existing PublicNavbar links and mobile menu. The hero version changes only surface/contrast and is used only on `/`.

## Viewport must fit

Use one outer section with `height:100vh; height:100svh; height:100dvh; min-height:0; overflow:clip`, with grid rows for the navbar and content. Do not keep `min-h-[440px]`, `sm:min-h-[590px]`, or vertical padding that forces the CTA below fold. Use `clamp()` and mobile-specific composition. On small phones use the main image as a background behind a compact readable copy layer, not as a tall image stacked above/below the copy.

Use the test sizes **1366×768, 1440×900, 390×844, 360×800 and 320×568**. At each size, capture a screenshot and confirm the nav, title, supporting copy, main CTA and key photograph all fit in the first viewport. If the content does not fit, reduce ornament/extra tags/margins and adjust the image focal point; do not hide the main action.

Run the page, inspect screenshots, fix the biggest visual mismatches, and run typecheck before moving on.
