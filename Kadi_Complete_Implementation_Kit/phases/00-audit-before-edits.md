# Phase 00 — Audit the active Kadi repository (read-only)

Read `MASTER_PROMPT_FOR_ANTIGRAVITY.md` and `SOURCE_AUDIT_NOTES.md`. This first task is read-only: do not change files yet.

Inspect the active repository, not just the contents of the prompt. Confirm the actual Next.js/React versions, routes, current nav components, global tokens, templates/categories, event data types, API/service functions, authentication, envelope renderer, and scripts.

Report:

1. the actual route map and shared layout structure;
2. the current count of template records per category, and all filters with no actual templates;
3. the exact files that control the landing hero, mobile nav, app shell, template gallery, editor, invitee page and image configuration;
4. which source observations in `SOURCE_AUDIT_NOTES.md` still apply;
5. the shortest safe implementation plan and the current baseline typecheck/test/lint/build status;
6. any active uncommitted changes that must not be overwritten.

Do not write a new design or code yet. Wait for the user to provide `phases/01-shared-design-system-and-shell.md`. After this audit, implement one named phase at a time. Do not try to rewrite every screen in one pass.
