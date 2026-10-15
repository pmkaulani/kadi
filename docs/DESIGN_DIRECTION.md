# Kadi Design Direction — Source of Truth

**Status:** Working design system. The four uploaded reference videos and `VIDEO_REFERENCE_SPEC.md` are the primary source of truth for invitation visuals. This guide sets the shared quality bar; theme-specific compositions must remain different. The product name remains provisional pending clearance.

This document overrides older colour/logo recommendations in the brainstorm documents wherever they conflict with the current visual design. Preserve the original technical snippets and database schema as engineering reference material; do not treat their old visual palette as current branding.

## Creative direction

Kadi is a studio for richly art-directed, mobile-first invitation experiences inspired by the four user-supplied videos. One invitation is a ruby disco birthday framed by stars and record art; another is a pastel floral garden invitation; another is a gift-led birthday collage; another is a sage botanical wedding suite. These must be separate visual compositions, not the same UI recoloured. Use `docs/VIDEO_REFERENCE_SPEC.md` for the detailed anatomy and interactions.

The signature experience is a physical-object transition: envelope, seal, hinged flap, patterned liner, card rising from the pocket, a tailored typography reveal, and a seamless transition into a real invitation website.

## Brand system

Avoid treating the brand guide as a single site-wide theme that flattens each invitation. Kadi may retain restrained stationery influences, but every template must have its own art direction, illustration set, type hierarchy, background and rhythm.

- **Working wordmark:** `kadi.` set in a refined serif with a small, restrained folio mark. Avoid generic gradients, overlapping diamonds, stock envelope icons and glowing app marks.
- **Brand line:** “Invitations, with feeling.”
- **Primary paper:** `#F6F2EA`.
- **Light surface / card stock:** `#FBF8F1`.
- **Ink:** `#272620`.
- **Secondary ink:** `#756F64`.
- **Terracotta / signature accent:** `#934638`.
- **Muted brass:** `#B99A62`.
- **Warm shadow / paper edge:** `#DDD3C5`.
- **Dark stage:** `#272620` with paper-colour type.
- **Event accents:** wedding rose `#A94F51`, birthday/clay coral `#BE5A42`, memorial olive-sage `#747D62`. Event colours are accents, not full-page gradients.

Use the design tokens in Tailwind/CSS variables, not inconsistent raw colours spread through components. Keep text/background combinations accessible; where a colour fails contrast, use a semantic accessible variant.

## Typography and composition

- Use an elegant serif display face for emotional headline moments, event names and printed-card typography.
- Use a restrained, highly legible sans-serif for navigation, controls, labels and body copy.
- Use script fonts only for a short accent if a particular invitation design needs it; never for long passages or essential details.
- Create hierarchy with scale, spacing, alignment, line length, small uppercase labels and thin rules.
- Prefer asymmetric editorial grids, image-led compositions, portrait imagery, overlapping printed matter, full-bleed scenes and generous but purposeful negative space.
- Use real event/template artwork and photographs. Keep image cropping deliberate, and give each template a distinct composition.

## UI anti-patterns to avoid

Do not build a page by arranging one rounded card after another. Avoid:

- generic SaaS/dashboard-looking marketing pages;
- identical three-column feature cards for every section;
- huge radii, heavy shadows, glassmorphism, neon gradients and purple/gold gradient buttons;
- pill controls for every item or status;
- uniform template cards that all have the same aspect ratio and overlay;
- a logo made from a generic gradient envelope, gem or overlapping diamonds;
- oversized empty hero areas without meaningful art direction;
- tiny all-caps text used for everything;
- placing the guest invitation inside yet another rounded panel after the envelope animation;
- making the invitation feel like a form rather than a ceremonial reveal;
- emoji used as production brand artwork or decorative imagery;
- needless motion, scroll-jacking or animation before the guest can access important details.

Boxes may be used when they genuinely improve grouping or task comprehension, especially in data tables and admin tools. They should not be the default layout primitive. Use ruled sections, rows, typographic grouping, image composition and page-level backgrounds when those communicate better.

## Invitation opening interaction

The opening must visibly show the physical layers. At minimum:

1. Closed envelope, liner, seal and the guest/event identity.
2. Seal reaction on tap.
3. Flap hinge and perspective rotation.
4. Liner becomes visible.
5. Card rises from the envelope pocket, tilts slightly and casts a realistic soft shadow.
6. Card settles and expands into the invitation hero, not into a generic modal/card container.
7. Event typography and photo reveal in a controlled, event-specific sequence.
8. The remainder of the page is a live, scrollable invitation with gallery, itinerary, venue and RSVP as appropriate.

A fade-only transition is insufficient. Keep a visible skip-to-details control, replay control, keyboard support, reduced-motion experience, and audio only after deliberate interaction.

## Different event, different art direction

- **Wedding:** tactile stationery, balanced serif typography, photo-led editorial layouts, floral/illustrated liners and slower motion.
- **Birthday:** stronger colour and typography, playful reveals, celebrant imagery and optional lively transitions.
- **Baby shower / graduation / anniversary:** distinct palettes and composition based on the event rather than simple colour swaps.
- **Memorial:** dignified, calm, still, restrained motion and easy access to tribute/condolence content; never celebratory confetti.
- **Corporate/custom:** clear typography and brand-specific colours without forcing a wedding-stationery metaphor on every section.

## Host dashboard versus guest experience

The host application should be useful and organised, but it must share the same design sensibility. Use editorial page titles, calm surfaces, thin dividers, selected-image previews, clear typographic navigation, restrained utility panels and practical tables. A card can group a complex task but must not be repeated simply to create visual structure.

The guest-facing invitation deserves the strongest art direction. It is not a dashboard, and the RSVP form is only one section of the event page.

## Responsive behaviour and motion quality

- Start with the phone composition; preserve the envelope's complete silhouette and the whole card during the opening.
- Use motion that explains spatial relationships. Avoid arbitrary bouncing and different easing curves fighting one another.
- Prefer transform/opacity animations where suitable, optimise photos, lazy-load below-the-fold images, and avoid layout shifts.
- Handle reduced-motion and audio permissions without making the page less usable.
- Keep all essential details available even if assets fail or animation is disabled.

## Definition of done

A page is not visually complete simply because it compiles. Review real page captures at mobile and desktop widths. Check visual rhythm, typography, image composition, contrast, consistent brand tokens, and whether repeated cards dominate the page. Compare the envelope opening frame-by-frame and confirm that the card actually emerges from the envelope before continuing into the live invitation.
