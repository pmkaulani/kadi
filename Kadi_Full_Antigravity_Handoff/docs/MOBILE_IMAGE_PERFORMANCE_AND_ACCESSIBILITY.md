# Responsive layout, image delivery and accessibility acceptance

## Viewport-first layout

The hero's complete core composition must fit in the first viewport: navigation, headline, supporting copy, primary and secondary action, and main image. Build around `100svh`/`100dvh`, `min-height: 0`, compact spacing rules at short viewports and safe-area insets. Do not add a desktop-sized hero `min-height` that forces a phone user to scroll to see its CTA. Use a mobile-specific composition when the desktop split becomes cramped.

## Image requirements

- Use `next/image` for local and approved remote images when it fits the source; configure `remotePatterns` on the server, never expose API keys to the browser.
- Always set stable `width`/`height` or a positioned parent + `fill`; provide `sizes`; define `aspect-ratio`; use `object-position` based on an explicit focal point.
- Hero image should get priority/fetch high only when actually LCP; below-fold images lazy-load. Avoid eager loading a whole gallery.
- Use mobile crops when the composition differs materially. Do not load a giant desktop board as a mobile asset.
- Provide descriptive alt text for meaningful photos; `alt=""` for decoration.
- Broken remote image gets a designed fallback, not a layout collapse or broken icon.
- Track asset source, license, intended category and alternative. Remove irrelevant images and verify Kenyan representation rather than trust a search query alone.

## Screens to test

- 320×568: very compact device/short viewport.
- 360×800: small Android baseline.
- 375×667: compact iPhone viewport.
- 390×844 and 393×852: typical iPhone.
- 430×932: larger phone.
- 768×1024: tablet portrait.
- 1024×768: tablet/short landscape.
- 1280×800, 1440×900: standard desktop.
- 1920×1080: large desktop, ensuring the content doesn't become excessively wide.

For each, test landing hero, template browsing, editor in Edit and Preview modes, invitation envelope open and guest scrolling, RSVP, and dialogs/bottom sheets. Verify no horizontal scroll, clipped controls, modal body lock bugs, hidden buttons under browser chrome, or text rendered too small.

## Accessibility

- Semantic landmarks/headings/forms/buttons; labelled controls and errors `aria-describedby`.
- Visible keyboard focus; logical tab sequence; Escape closes modals; focus returns to trigger; disclosures announce state.
- Target sizes ≥44×44 CSS px, adequate spacing between controls.
- Respect `prefers-reduced-motion`; decorative background motion stops/simplifies.
- Do not make hover the only way to reveal controls.
- Modal becomes bottom sheet on mobile where suitable, but never blocks required close/confirm controls.
- Test keyboard-only, reduced motion, zoom/reflow and contrast. Informational colour isn't the only status indicator.
