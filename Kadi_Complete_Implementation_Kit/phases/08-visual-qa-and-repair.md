# Phase 08 — Visual QA: compare and repair, don't just report

Run Kadi locally using the existing `npm run dev` command. Use available browser/screenshot tooling to capture the actual rendered UI. Open the screenshots and compare them against the reference boards in this kit.

## Screenshot matrix

- `/`: 1440×900, 1366×768, 390×844, 360×800, 320×568. Capture the initial viewport and one viewport just below the hero.
- `/templates`: same desktop and mobile sizes; also `/templates?category=housewarming`, `graduation`, `birthday`, `memorial`.
- `/app/events`: desktop, tablet and mobile.
- `/app/events/new`: desktop and mobile in edit mode and preview mode.
- `/app/events/[eventId]`: populated event with guest responses; mobile and desktop.
- `/e/[slug]`: birthday, housewarming and memorial/funeral examples; mobile and desktop.
- `/login`: mobile and desktop.

## Visual diffs, in priority order

1. Overall geometry: section order, hero height, image composition, whitespace, content width, nav height.
2. Type hierarchy: headline scale, line wrapping, paragraph width, button size and alignment.
3. Image choice/crop: does each category look like its real occasion? Can the subject be seen on mobile?
4. Consistency: shared buttons/fields/cards/spacing/focus styles/nav across routes.
5. States: hover/focus, carousel controls, filters, empty/loading/error/success states.

Fix the three biggest visual differences in each iteration and recapture; don't stop after a CSS change without looking at the new screenshot. The landing hero must not require scroll to see all its content. For a short viewport, remove decorative elements or reduce spacing before hiding the headline or CTA.

Run actual project checks:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

Do not claim tests/build/lint/screenshots were completed if a tool wasn't available. Report screenshots taken, exact viewport sizes, failures and anything still visually off.
