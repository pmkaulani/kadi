# Responsive and mobile acceptance specification

## Hero viewport

- The first viewport must show the complete navigation, key headline, short supporting copy, CTA and core visual composition without vertical scrolling just to reach the CTA.
- Use `min-height: 100svh` / `100dvh` thoughtfully, but test browser chrome and safe areas. Do not hardcode a large `min-height` that causes overflow on short devices.
- On mobile, stack/simplify the layout, keep the primary image visible, limit headline lines and remove decorative elements that compete with the CTA.
- The longer page comes **after** the hero and includes occasion discovery, featured designs, steps, inviter/guest benefits, local relevance, FAQs and closing CTA.

## Required manual/screenshot viewport matrix

- 1440 × 900 desktop
- 1280 × 800 laptop
- 1024 × 768 small laptop/tablet landscape
- 390 × 844 modern phone
- 375 × 667 short phone
- 844 × 390 phone landscape

## Images

- Prefer `next/image` for locally managed images and approved remote hosts.
- Provide `sizes` matching the actual CSS width; use `fill` only with a dimensioned, positioned parent.
- Use `aspect-ratio` for stable layouts, `object-fit: cover`, and per-image focal `object-position` where needed.
- Preload only the hero asset needed for LCP; below-fold assets should lazy-load.
- Never put the text into the image itself. Preserve enough contrast for overlays and avoid accidental crop of faces / invitation names.
- Missing images use designed neutral/occasion-pattern placeholders, not broken remote URLs.

## Mobile app shell

- Bottom navigation is persistent but clear of the device safe area and content.
- Touch targets aim for 44×44 CSS px minimum.
- Wide editor uses a deliberate mode toggle (`Edit` / `Preview`) or stacked panels on narrow screens. Do not shrink the desktop split to unreadable columns.
- Guests, RSVP, settings and modal interactions should use bottom sheets on small screens and dialogs/popovers on desktop where suitable.
- Horizontal occasion rails use scroll snapping and visible affordances; they must not accidentally cause whole-page horizontal overflow.

## Motion and accessibility

- Honor `prefers-reduced-motion: reduce` for envelope and scroll effects.
- All actions work by keyboard; focus is visible and not hidden by sticky nav.
- Avoid automatic sound; music requires explicit interaction.
- Do not make essential details dependent on animation. Provide skip/open controls and an accessible non-animated path.
