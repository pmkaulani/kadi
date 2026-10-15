# Phase 04 — Template library and invitation editor

Implement in `src/app/templates/page.tsx`, `src/app/templates/[templateId]/page.tsx`, `src/app/app/events/new/page.tsx` and `src/app/app/events/[eventId]/page.tsx`, reusing the existing service functions and template types.

## Template library

- One coherent shared Kadi title/nav/control system.
- Search is real and filters title, description, and category.
- Occasion filter rail is horizontal and touch-scrollable on phone, compact on tablet, and easy to scan on desktop.
- Each template card uses its own image; crop and visual accent fit that template's category.
- Cards show category, name, concise description, preview and Use design. Do not overload cards with five buttons.
- Read `?category=` from URL and allow a clear reset to All. Preserve the selected query when navigating back.
- Use `snippets/ResponsiveTemplateCard.tsx`, `snippets/OccasionRail.tsx`, and `snippets/kadi-template-components.css` as implementation references.

## Editor

- Keep the real form, API/service calls, template values, save/publish behavior and validation.
- Show a simple stepper: Occasion/Design → Details → Guests & RSVP → Preview/Publish.
- On desktop use a clear control pane plus prominent preview; preview can be sticky within the editor region, never obscure controls.
- On mobile use one step at a time plus an Edit/Preview toggle. Do not stack a giant preview above an endless form or squeeze desktop side-by-side panels to tiny widths.
- Retain entered values when changing template, navigating backward, or toggling preview.
- Surface saved, saving, validation, error and published states. Never simulate save success if the service failed.
- Event themes affect the invitation preview only. Editor controls and app chrome remain Kadi-consistent.

Take desktop and 320–390px mobile screenshots of the library and editor. Run typecheck/tests after integration.
