# Phase 02 — professional long-form landing page, viewport-correct hero

Read the actual `src/app/page.tsx`, `KadiReferenceLanding.tsx`, hero component, `PublicNavbar`, `PublicFooter`, `reference/landing-page-reference.png` and `reference/occasion-diversity-reference.png`.

Do not grow the hero until it requires scrolling. Keep navigation, headline, supporting line, main CTA, secondary CTA and hero image visible within initial screen on standard phones and desktop. Use `100svh`/`100dvh` with compact height variants and safe-area handling; support reduced motion. The rest of the page must be longer and genuinely helpful.

Implement this page structure, keeping existing route semantics:
1. Navbar with clear “Templates”, “How it works”, login and primary create CTA.
2. High-end cinematic/editorial hero: copy left and invitation art right on desktop; deliberate stacked/cropped composition on small phones. Avoid purple-blue gradient, generic marketing copy, tiny labels, or over-large font that clips.
3. Occasion exploration for the real canonical categories: weddings, birthdays, graduation, housewarming, baby, engagement/anniversary, memorial/funeral, corporate/launch, community/fundraiser, and more. Categories should link to real filters. Use a category per art image instead of four wedding-like stationery images.
4. Featured templates with real catalogue data and varied visual identities; avoid a static poster catalogue if actual template route exists.
5. “From envelope to experience” steps explaining create → personalize → share/manage RSVP.
6. One broad product section showing how guest experience can adapt by event type (birthday vs graduation vs memorial vs housewarming).
7. Host tools feature section (guest list, RSVP counts, QR/share link, event updates) based on real capabilities.
8. Kenyan context section only with truthful copy and vetted visuals; no fake testimonials/metrics.
9. FAQ, closing CTA, public footer.

Images: use Next `Image` where appropriate. Correct `sizes`, aspect ratio, `object-position`, responsive focal point and stable parent size. Don't use raw `<img>` when it causes layout shifts; fix all console warnings. Use local/licensed images and alt text. Any carousel must have pause/keyboard controls, a fixed copy position, restrained timing and no layout jump.

**Acceptance:** complete hero visible at 320×568, 375×667, 390×844, 1280×800 and 1440×900; no scroll needed to see hero CTA. Full page contains all planned below-fold sections and genuinely supports category/template browsing. Capture screenshots and fix the three biggest visual mismatches.
