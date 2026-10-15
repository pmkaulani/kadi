# Kadi source audit notes used to tailor this kit

These notes are based on inspection of the supplied `kadi(1).zip` source snapshot. Antigravity should repeat the inspection against the active working tree before changes, since that may be newer.

- **Stack:** `next` 14.2.x, React 18, TypeScript 5.6, Tailwind CSS 3.4, Framer Motion 11, Lucide React.
- **Root layout and styles:** `src/app/layout.tsx`, `src/app/globals.css`; Inter and Playfair Display fonts are already configured.
- **Public routes:** `/`, `/about`, `/contact`, `/cookies`, `/data-protection`, `/faq`, `/how-it-works`, `/login`, `/pricing`, `/privacy`, `/templates`, `/templates/[templateId]`, `/terms`.
- **Creator routes:** `/app/events`, `/app/events/new`, `/app/events/[eventId]`.
- **Invitee route:** `/e/[slug]`.
- **Public nav:** `src/components/layout/PublicNavbar.tsx` currently uses a light, opaque 82px row. It should gain an optional hero variant and remain the only public navigation implementation.
- **Home page:** `src/app/page.tsx` has a large two-column visual with image-column `min-h` values up to 590px, oversized vertical padding and additional sections; this must be adapted so the first screen fits the viewport on desktop and mobile.
- **Workspace shell:** `src/app/app/layout.tsx` contains the shared app nav but a light-beige sidebar, a light topbar and two mobile navigation items in a horizontal row. Refactor this shared shell once, then remove page-specific duplicate shells if any.
- **Template catalogue:** six definitions were counted in the inspected source, with two wedding and one each birthday, graduation, memorial and baby shower. Housewarming is missing.
- **Types:** `src/lib/templates/types.ts` owns an `EventCategory` union; `src/lib/db/types.ts` separately declares `EventEntity.category`. Keep these synchronized or move to one canonical type.
- **Image configuration:** `next.config.js` includes Unsplash in `images.domains` and also a broad remote pattern. Preserve working catalogue images; do not widen this configuration further. Restrict to genuinely used image providers if safe.
- **Services and APIs:** `src/lib/services/event-service.ts`, `guest-service.ts`, `rsvp-service.ts` and route handlers under `src/app/api` should be preserved, not replaced with local UI fixture data.
- **Existing animation:** `src/components/animation/EnvelopeRenderer.tsx` is already part of the public invitation experience. Improve it in place if needed rather than create a parallel invitation renderer.

## Specific visual problems to address

1. The landing page hero is too tall on mobile and currently relies on a tall secondary visual column; the content hierarchy does not behave as a one-screen composition.
2. Navigation and route chrome contain hard-coded per-page styles instead of relying on a clearly shared set of design tokens.
3. The product feels wedding-centric because the actual catalogue is extremely small and the existing hero chooses from the first wedding and birthday entries.
4. Existing template filters outnumber the catalogue categories that actually have templates, so discoverability is ahead of product content.
5. The app workspace shell needs to feel intentionally different from the public landing page but still part of one product: consistent tokens and control styles; distinct dark navigation vs light canvas; event-specific theme only in the invite itself.
6. Responsive image sizing is not consistently expressed with `sizes` and reserved aspect-ratio containers. Introduce a shared image card pattern and validate real crops at phone widths.
