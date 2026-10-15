# Phase 01 — one Kadi design system across the app

Read `docs/DESIGN_SYSTEM_SPEC.md` and `reference/app-dashboard-reference.png` first. Implement tokens in the existing global CSS and use them consistently. Do not replace the whole app shell with a disconnected demo.

Tasks:
- Audit `src/app/globals.css`, app/public layouts and shared UI components. Consolidate current values rather than appending a conflicting second design system.
- Define tokens for warm neutral surfaces, ink/secondary ink, border, the existing Kadi accent, gold support, semantic success/warning/error, radius/spacing/type/shadow/easing.
- Normalize buttons, inputs, select, checkbox/toggle, tabs, segmented controls, modal/bottom sheet, badges, tables, card surface and focus rings. Every control needs hover/press/focus/disabled/loading/invalid states when applicable.
- Establish one authenticated shell across `/app/events`, `/app/events/new`, `/app/events/[eventId]`, `/app/templates`: consistent nav position, width, page header, action hierarchy, tabs and mobile nav. Don't use app-shell styles in the guest invitation's artistic theme scope.
- Ensure all content states have designed skeleton/error/empty/retry states, no generic blank cards, placeholder “coming soon” or decorative dead buttons.
- Use Lucide for icons; never emoji icons. Don't add `shadcn/ui` automatically if existing primitives do the job.
- Check dark mode only if an actual theme switch/requirement exists; do not introduce inconsistent pseudo-dark screens. If implementing theme support, all routes share the same semantic tokens.

**Acceptance:** all core routes have consistent shell and control dimensions; visible focus, keyboard controls and 44px target minimum; no duplicate token values proliferating; screenshots before/after included.
