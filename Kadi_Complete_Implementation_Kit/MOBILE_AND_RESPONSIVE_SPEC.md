# Kadi mobile and responsive specification

## Global rules

- Mobile is designed as its own layout, not the desktop UI shrunk down.
- No horizontal page scroll at 320, 360 or 390 CSS pixels.
- Minimum target size for key controls: 44×44 CSS pixels. Keep adjacent controls separated.
- Use `env(safe-area-inset-bottom)` when positioning a fixed mobile navigation.
- Use CSS grid/flex with `minmax(0, 1fr)`, `min-width: 0` and content-based sizing; avoid fixed pixel widths on general page panels.
- Use `clamp()` for scalable headlines/padding while preserving readable line-height.
- Keep a visible focus state and correct labels when using icon-only controls.
- Under `prefers-reduced-motion: reduce`, disable autoplay and nonessential movement.

## Landing hero

The entire navbar-plus-hero is exactly one dynamic viewport high. At 320×568 the title, supporting text, primary CTA and main image must fit. Keep the photo full bleed as a background behind copy on small screens; use a legibility gradient. Hide the smallest extra occasion pills and caption before hiding/obscuring the CTA. Do not add a 500–600px minimum-height image column on mobile. The next section begins only after the viewport hero.

## Image rules

- Use `next/image` or a controlled responsive `picture` element.
- For `fill`, the parent must be `position: relative`, the image container must have a defined aspect ratio/size, and overflow should be clipped intentionally.
- Set `sizes` based on actual rendered width: `100vw` for fullscreen hero, `(max-width: 640px) 82vw, ...` for cards, and narrow sizes for horizontal rails.
- Set `object-position` by the actual subject. Mobile crop may use different `object-position` or a separate art-directed crop.
- Mark only the leading above-the-fold image high priority; lazy load below-the-fold imagery.
- Don't set fixed width and height that force card overflow; reserve layout ratio to prevent content jump.

## Screen-by-screen mobile behavior

### Template discovery
- Search and category filter stay visible at the top of the list.
- Category tiles scroll horizontally with snap, not wrap into multiple rows of tiny chips.
- Template cards stack to one column or a deliberate 2-column small-card grid only if the copy/actions remain usable.
- Full preview is its own detail route, not a hover-only desktop behavior.

### Invitation editor
- One clear stage at a time on small screens.
- Sticky bottom action row for Back/Continue/Save only if it never covers form controls and uses safe-area padding.
- Switch between **Edit** and **Preview** explicitly. Avoid showing the entire desktop preview beside the controls on a narrow screen.

### Workspace
- Desktop sidebar becomes a safe-area aware bottom nav with a prominent create action.
- Main list becomes full-width cards. No tiny KPI columns or squeezed tables; convert table rows to readable stacked items when needed.
- Give main content enough bottom padding for the fixed nav.

### Guest invitation and RSVP
- Event name, date, venue and RSVP action have priority.
- Body copy is comfortably readable without pinch-zooming.
- RSVP inputs use the full available width and have correct input types/labels.
- Confirmation and error states fit above the bottom edge and remain visible.

## Required screenshots

Test 320×568, 360×800, 390×844, 768×1024, 1024×768, 1366×768, and 1440×900. Check a short height as well as a narrow width. If a design only works at 390×844, it is not finished.
