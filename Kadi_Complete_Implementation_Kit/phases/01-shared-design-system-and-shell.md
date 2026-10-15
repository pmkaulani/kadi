# Phase 01 — Unify Kadi visual language and application shell

Implement this phase in the current Kadi repository. Do not stop at a plan.

Read `MASTER_PROMPT_FOR_ANTIGRAVITY.md`, `SOURCE_AUDIT_NOTES.md` and `snippets/kadi-design-system.css` first. Inspect the active project; do not assume the source snapshot is unchanged.

## Required changes

1. Merge the design tokens and shared utility patterns into `src/app/globals.css` without deleting current working styles. Remove conflicting duplicates as you touch each page.
2. Refactor shared styles for buttons, text fields, panels/cards, focus rings, navigation items and typography. Use semantic classes/tokens instead of inventing new hex/radius/shadow values for each route.
3. Refactor `src/app/app/layout.tsx` as the single inviter-app shell: dark sidebar on desktop, shared light topbar, light workspace canvas, consistent active route state. Keep every route and its data untouched.
4. For phone sizes, remove the duplicated mobile top navigation if replacing it with the supplied `WorkspaceBottomNav.tsx`; use safe-area padding and never let the fixed bottom nav cover page content. Only add links for real routes.
5. Add an optional `variant="hero"` to the existing `PublicNavbar` as described in `snippets/PublicNavbar.hero-patch.md`. Keep default behavior on inner public pages. Do not create a second navbar.
6. Make auth, public content, app workspace and invitation editor share the Kadi components/tokens. Keep invitation-specific colors scoped to the guest-facing invitation theme, not the app shell.

## Acceptance

- Public secondary pages still work and use their existing routes.
- All workspace routes use the same shell.
- Sidebar width, topbar height, active state, buttons, fields, border color, radius and typography are consistent between workspace routes.
- Mobile has no horizontal overflow or nav-covered form actions.
- `npm run typecheck` passes before moving to the next phase, or you report the exact blocker.
