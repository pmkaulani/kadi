# Phase 13 — release gate; do not declare finished early

Run the actual project in a browser after changes. Use automated screenshot tools already available in the workspace, or state the exact limitation and give commands/steps for the user. Never create fictional screenshots or say “visually verified” unless captured.

1. Run and record `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. Include each command, exit code and concise stdout/stderr. Do not count blocked as pass.
2. Review changed files / diff for unintended route deletions, CSS override pileups, unused code, leaked secrets, broken imports, bad `Image` config and duplicate components.
3. Run tests from `docs/QA_TEST_MATRIX.md` across template, editor, envelope, guest/RSVP, calendar/map, auth/ownership, M-Pesa sandbox and persistence.
4. Capture screenshots for `/`, `/templates`, `/app/events`, `/app/events/new`, `/app/events/[eventId]`, `/e/[slug]`, `/login` at desktop and mobile; include event examples for birthday, graduation, housewarming, wedding, funeral/memorial, corporate.
5. Compare to references by hierarchy, actual section width, hero composition, image crop, type scale, section rhythm and whitespace—not merely colour. List 3 most visible mismatches, repair them, recapture.
6. Validate responsive viewports from phase 11 and reduced motion. Run no-console-error/hydration check in key flows.
7. Report: changed files, features verified with exact route, tests pass/fail/blocked, screenshot paths, remaining production blockers, provider credentials/data needed and next work in priority order.

Completion condition: only mark an item “done” when implementation + test + rendered behavior are verified. Use “implemented, not verified” where applicable. If database/auth/payment provider access is missing, describe it as a blocker, not a complete feature.
