# Kadi — Complete Antigravity implementation handoff

This package consolidates the product brief, source-aware audit, all major implementation prompts, code starters, visual references, and acceptance tests for the existing Kadi Next.js application.

## Use it in this order

1. Open `MASTER_PROMPT_FOR_ANTIGRAVITY.md` and paste it into Antigravity with the **existing Kadi repository open as the workspace**.
2. Tell Antigravity to execute `prompts/00_AUDIT_BASELINE.md` first. Do not allow it to start a visual rewrite before it has captured the current routes, services, screenshots, Git status and test results.
3. Execute the phases in numeric order, one at a time. Each phase prompt names files to inspect, the expected change, the definition of done and required validation.
4. Treat `reference/` images as composition references. They are not a reason to make every invitation Victorian. Kadi's public brand/app can remain cohesive while each occasion's guest invitation has a distinct art direction.
5. Use `snippets/` as implementation starters, not as permission to overwrite newer code. `starter_snippets/previous_repair_kit/` contains earlier candidate components/patches; diff each against the active code before integration.
6. At the end, execute `prompts/13_RELEASE_QA.md`. Require screenshots from the actual running app and results from actual commands.

## Source and technology facts

The supplied project snapshot is a Next.js 14 App Router app using React 18, Tailwind CSS 3.4, TypeScript, Framer Motion 11 and Lucide. The user's earlier brief says to assume Tailwind v4/latest Next, but the **supplied repository is not that stack**. Do not upgrade frameworks just for the redesign; preserve the existing dependency versions unless the maintainer explicitly approves a separate migration.

The snapshot contains a landing route `/`, public template routes `/templates` and `/templates/[templateId]`, workspace routes `/app/events`, `/app/events/new`, `/app/events/[eventId]`, `/app/templates`, public invitations `/e/[slug]`, account `/login`, public info pages, and event/guest/RSVP API routes. It contains `EnvelopeRenderer`, an additional `kadi-invitation-kit/EnvelopeExperience`, shared section components and an event design model. Inspect current code because source snapshots may differ from the local workspace.

The current service layer has an in-memory `mockDb` / demo auth patterns. A functioning demo is not durable production persistence. Do not claim database persistence, production authentication, M-Pesa collection, WhatsApp automation, private share tokens or uploads are real until the appropriate provider/server implementation is present and tested.

## What this package is and is not

It is a detailed implementation handoff and code starter pack. It **does not automatically modify the app on your computer**. Antigravity must apply the changes in the open repository. The generated/reference visuals are targets for comparison, not screenshots of the current running application. Any code labelled starter must be reconciled with the actual source and tested after integration.

## Extra context included

`docs/ORIGINAL_FULL_USER_BRIEF.txt` preserves the detailed brief supplied by the user. `source_map/prior_briefs/` preserves earlier invitation, video-reference, mobile envelope and technical prompts so they are not lost. The consolidated master prompt is authoritative where earlier prompt wording overlaps; the most recent UX requirements (occasion diversity, long page below a viewport-fit hero, and consistent app shell) take precedence.
