# Phase 00 — audit the open repository before edits

**Do not redesign in this phase.** Inspect the current workspace, not an assumed copy.

1. Run `git status --short`, list package scripts/dependencies, inspect `README.md` and current project plan. Preserve unrelated local changes.
2. Inventory all App Router pages, route handlers, public components, workspace components, invitation section renderers, templates, types, services, auth/provider integrations and tests. Create `docs/KADI_AUDIT_BASELINE.md` in the actual repository.
3. Trace exactly how new invitation state flows from `src/app/app/events/new/page.tsx` into the preview. List every control and the actual target props/data consumed by the visible renderer. Identify stale/unconnected fields.
4. Trace published guest rendering through `/e/[slug]`, its event/design query, envelope renderer and invitation sections. Compare the exact component tree to the editor preview. Identify duplicate envelope/section systems.
5. Audit the envelope against `reference/envelope-and-animations-reference.png` and `reference/envelope-options-reference.png`. Record layers/motion missing from current implementation.
6. Audit the landing route and capture baseline screenshots at 390×844, 1280×800 and 1440×900 if browser tooling is available. Verify the first viewport and all below-fold sections; count actual occasion cards and the template catalogue by category.
7. Audit all data paths: `EventService`, `GuestService`, `RSVPService`, `mockDb`, auth/session logic, API route authorization, guest token storage, publish lifecycle, import/export, M-Pesa and notifications. Mark production vs demo/sandbox explicitly.
8. Run baseline `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`; record actual outputs and blockers. Do not fix unrelated failures silently.
9. Create a prioritized issue table P0/P1/P2; separate bugs from design issues, technical blockers and missing features. Include exact paths/line ranges where known.

**Definition of done:** `docs/KADI_AUDIT_BASELINE.md` exists in the actual project and includes route map, state/data flow, screenshot references, real category/template counts, known test state and a phase plan. No destructive changes were made. If screenshots could not be captured, explain why and include exact reproduction steps.
