# File map and code guide

This map directs Antigravity to the existing application surface. Paths can differ if the active workspace diverged from the attached snapshot; always inspect the local file before editing.

## Public experience
- `src/app/page.tsx` — current public homepage route. Keep route and metadata valid.
- `src/components/visual-reference/KadiReferenceLanding.tsx` — current landing composition.
- `src/components/landing/KadiFullViewportHero.tsx` and current hero slide config — viewport and slide behavior.
- `src/components/layout/PublicNavbar.tsx`, `PublicFooter.tsx` — public navigation and shared footer.
- `src/app/templates/page.tsx`, `src/app/templates/[templateId]/page.tsx` — public template browsing/preview.
- `src/app/e/[slug]/page.tsx` — guest invitation route.

## Inviter workspace
- `src/app/app/layout.tsx` — workspace shell boundary.
- `src/app/app/events/page.tsx` — event list/workspace home.
- `src/app/app/events/new/page.tsx` — draft creation wizard and preview.
- `src/app/app/events/[eventId]/page.tsx` — event command centre and design/guest/RSVP controls.
- `src/app/app/templates/page.tsx` — templates from the authenticated context.
- `src/components/app/WorkspaceBottomNav.tsx` — current mobile nav component if still used.

## Invitation engine
- `src/components/animation/EnvelopeRenderer.tsx` — existing envelope entry point.
- `src/components/animation/WaxSeal.tsx`, `MotionToolkit.tsx` — physical seal and motion helpers.
- `src/components/animation/kadi-invitation-kit/EnvelopeExperience.tsx`, `types.ts`, `themes.ts`, CSS — alternative/parallel envelope implementation to reconcile.
- `src/components/invitations/*` — existing event-specific sections; keep these where appropriate, avoid writing a second version with divergent props.
- `src/lib/templates/catalogue.ts`, `types.ts` — template catalogue/types.
- `src/lib/events/categories.ts` — canonical event category IDs and labels.
- `src/lib/db/types.ts` — current event/design/guest/RSVP contracts.
- `src/lib/events/default-invitation-sections.ts` may or may not exist in current snapshot; inspect and centralize defaults if absent.

## APIs/services
- `src/lib/services/event-service.ts`, `guest-service.ts`, `rsvp-service.ts`.
- `src/lib/db/mock-db.ts` — in-memory demo store; don't present as durable data.
- `src/app/api/**/route.ts` — validate every handler and its ownership/auth contract.

## Starters in this handoff
- `snippets/useInvitationDraft.ts` — canonical draft reducer and serialized autosave idea.
- `snippets/invitation-config.types.ts` — serializable block/config type starter.
- `snippets/invitation-defaults.ts` — per-category block defaults starter.
- `snippets/calendar.ts` — calendar integration starter. Verify timezone and RFC 5545 edge cases before production.
- `snippets/responsive-image-pattern.tsx` — Next Image sizing/crop pattern.
- `snippets/kadi-design-tokens.css` — token base.
- `starter_snippets/previous_repair_kit/` — code and patches from an earlier repair attempt. Compare/diff before use; do not overwrite source blindly.
