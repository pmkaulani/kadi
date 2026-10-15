# Phase 07 — Responsive images and mobile system-wide pass

Audit every image in `/`, `/templates`, template preview, editor, dashboard, guest invitation and gallery. Correct the image implementation, not just the container CSS.

## Required image handling

- Use `next/image` where possible. For `fill`, parent must be positioned and reserve space with `aspect-ratio` or a constrained responsive height.
- Set the `sizes` prop for every large image. Hero `sizes="100vw"`; gallery card sizes based on grid; narrow rail cards use a small width. Do not leave all images behaving as if they are full-screen.
- Use `priority` only for LCP/above-the-fold imagery. Lazy-load lower gallery images. Avoid eager-loading the whole catalogue.
- Set `object-fit: cover` and a subject-appropriate focal position. Check the mobile crop separately; a wide desktop crop is not automatically correct at 320px.
- Use meaningful alt text for informational photos, empty alt for decorative backgrounds. Never use wedding imagery as a stand-in for other categories.
- Prevent cumulative layout shift; no stretched images, broken remote URL, horizontal overflow or fixed desktop pixel widths on mobile.

## Breakpoints to test

Capture real screenshots at 320×568, 360×800, 390×844, 768×1024, 1024×768, 1366×768 and 1440×900. If CSS breakpoints differ in the repo, test around the actual configured boundaries too.

### Mobile checklist

- Landing hero fits in one viewport with nav, headline, short copy, CTA and main image all visible.
- Body text is readable, no text or buttons are clipped.
- Template gallery is touch-scrollable and cards don't overflow.
- Editor uses Edit/Preview mode or steps; it isn't a scaled-down desktop split pane.
- Guest RSVP is comfortably tappable and confirmation is visible after submit.
- Workspace bottom navigation respects safe-area insets and never covers the last action or content row.
- No horizontal page scroll at any target size.
- Reduced motion works and interactive controls have accessible labels.
