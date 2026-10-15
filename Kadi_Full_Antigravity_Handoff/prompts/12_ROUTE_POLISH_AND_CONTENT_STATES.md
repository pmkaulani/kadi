# Phase 12 — finish every route and every state

Review `src/app/**` route inventory. Public pages share header/footer typography and reading width; workspace pages share app shell. Do not leave one route with old buttons/colors/spacing or a template route using an unrelated header.

For every route, implement realistic loading skeleton, empty state with next action, inline validation, not-found/access-denied state, network/server error with retry where sensible, confirmation/publish/saved feedback, and disabled/loading states for form submission. No blank panels, “Coming soon”, lorem ipsum, fake activity, phantom counts or inert controls.

Public pages `/how-it-works`, `/about`, `/contact`, `/faq`, `/pricing`, `/privacy`, `/terms`, `/cookies`, `/data-protection`, `/login` should retain their purpose, accurate copy, accessibility and shared visuals. Do not invent subscription plan features/payment processing that don't exist. Link every nav/footer action to working routes.

Test event lifecycle: save draft, return to it, edit, preview, guest config, RSVP configuration, review requirements, publish, view public invite, share, update, archive. Save Draft differs from Publish; publish requires server checks and a success screen. Public route should not expose draft/unpublished/archived state except authorized private review flow.

**Acceptance:** route matrix lists every page and checked state; no dead buttons; empty/error messages give next action; consistent app shell and valid nav targets.
