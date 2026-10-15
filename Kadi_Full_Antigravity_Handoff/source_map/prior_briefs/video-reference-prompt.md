# KADI — MASTER BUILD PROMPT FOR ANTIGRAVITY

## Mission

Build Kadi into a complete, polished, production-oriented digital invitation platform. Use the supplied invitation videos and `docs/VIDEO_REFERENCE_SPEC.md` as the primary design reference for the guest-facing invitation experience. The current project is only a starting codebase; do not assume the current UI is acceptable. Do not repeat the visual mistakes of generic AI-generated SaaS pages.

**The required result is code, not another plan.** Inspect the codebase, make an implementation plan, then execute it phase by phase. Do not stop after writing TODOs, mockup descriptions, plans, wireframes or placeholder components. Keep a progress log, run the available checks, fix regressions, and report which features genuinely work. If credentials or provider approval are missing, build the integration boundary correctly and label it as unconfigured; never fake a successful payment or message.

## Source-of-truth order

1. The four user-supplied reference videos, as captured in `docs/VIDEO_REFERENCE_SPEC.md`.
2. This prompt.
3. Existing project code and original material in `docs/KADI_PLATFORM_BLUEPRINT.md`, `docs/SECURITY_AND_PRIVACY.md`, `docs/TEST_PLAN.md`, `Kadi_Full_Platform_Blueprint.md`, and `Kadi_Technical_Snippets_and_Original_Database_Schema.md` when those files exist.
4. Existing features and data contracts, which should be retained or explicitly migrated—not quietly deleted.

Do not copy the competitor's exact artwork, logos, text, screenshots, watermarks or proprietary assets. Recreate the *interaction ideas and design grammar* in Kadi's own brand.

## Non-negotiable quality bar

- No generic rounded card grid for every page.
- No forms as the primary visual metaphor for invitation creation.
- No dashboard made from identical KPI cards as the entire composition.
- No giant blank hero with a couple of buttons and no crafted visual details.
- No generic gradient blobs, default lucide icons standing in for illustrations, emojis as decoration, stock gradient envelope logo, or repeated pill controls everywhere.
- No single invitation layout recoloured for every occasion.
- No fake working integrations, fake numbers, fake analytics, false delivery receipts or hard-coded invented guest data in production views.
- Do not delete existing API routes, RSVP logic, mock data contracts, validation or tests just to make a visual redesign easier.
- The central envelope reveal must be a real animation sequence: flap hinge, visible inner liner, card moving out from the envelope, layered paper / photographs where appropriate, and a deliberate transition into the complete invitation page.
- Use real content and imagery from event data; all template sample content must be clearly demo data.
- Every prominent control must do something meaningful. If an integration is not configured, show an accurate setup state rather than claiming success.

## Phase 0 — inspect before modifying

First inspect the actual workspace. Confirm:
- Next.js 14, React 18, TypeScript, Tailwind CSS 3.4, Framer Motion and existing dependencies.
- App Router routes, components, CSS variables, template catalogue and supported section types.
- Current mock database / service layer, API routes, event lifecycle and current RSVP flow.
- Existing schema snippets and security notes.
- What is working, broken, duplicated or stubbed.

Create `docs/IMPLEMENTATION_PLAN.md` and `docs/IMPLEMENTATION_STATUS.md`. Plan the work but continue implementing immediately. Avoid introducing a new framework or upgrading major versions unless a verified need requires it. Prefer existing dependencies and a coherent architecture.

## Phase 1 — reproduce the video design language in Kadi

Read `docs/VIDEO_REFERENCE_SPEC.md` in full. Implement four independently art-directed experience themes. They must not be just four colour palettes applied to one component.

### Theme A: Ruby Disco birthday

- Ruby / wine-red outer world with a richly composed repeat texture, stars, silver disco-ball art and whimsical decorative illustrations.
- A central invitation with a bespoke frame / border, cream stationery surface, strong display typography, very large milestone age when configured, and a hero image.
- Later details include the event date, venue, dress code / house rules, RSVP and optional music / vinyl motif.
- Use the `event.milestoneAge` field if available; otherwise derive carefully from structured event data. Never hard-code an age such as 19.
- Keep any ambient decorations slow and behind content.

### Theme B: Pastel Garden

- Warm cream paper, watercolor-like blush flowers, sage leaves, fine ornamental borders, large celebrant script, a custom garden-arch / gazebo illustration and a separate sage-green information section.
- Date, time and venue have a clear hierarchy and RSVP is easy to find.
- Use SVG or crafted layered assets for botanical details; do not substitute emoji or random icon rows.

### Theme C: “These are for you” gift-led birthday

- Deep red / ruby field and cream paper with handwritten typography, hero photo, overlapping scrapbook photographs and a visual record / turntable motif.
- Include three interactive gift objects: personal message, flowers and cake. Each click reveals different content using a controlled, subtle transition.
- Use irregular composition and varied image crops instead of identical boxed cards.
- If audio is attached, the record rotates while the audio is playing and stops when paused. Without configured audio, don't show a fake playback state.

### Theme D: Sage Love Letter wedding

- Botanical sage / ivory palette, warm paper texture, botanical corners and blush accents.
- Envelope with a wax seal and believable 3D flap; include a short stack of overlapping papers / image cards that rise out of the envelope, then transform into the main cover.
- Full long-scroll invitation with hero photography, personal opening phrase, story / quote, venue and direct map link, RSVP, schedule, dress code, gallery, optional gifts / cash contribution, accommodation / hotel link and closing photograph / message.
- Make section ordering configurable per template, not hardcoded globally.

For memorials, use a fifth dignified visual mode with restrained motion, muted botanical art, remembrance notes / condolences and optional candles. Do not show confetti or celebratory effects in memorial templates.

## Phase 2 — invitation animation system

Implement the animation as a clear state machine, not unrelated CSS transitions. Suggested phases: `closed`, `unsealing`, `flap-open`, `paper-rising`, `reveal-transition`, `revealed`.

Sequence:
1. Start with a complete designed invitation world: not a blank screen. Show the envelope, seal, personalized names / event context and a tasteful “tap to open” cue.
2. On user action, play seal response, flap rotation around the top hinge, reveal the patterned liner, card lift, layered-paper emergence where the theme requires it, then the hero reveal.
3. Use Framer Motion shared-layout transitions where beneficial so the card / hero image appears to transform instead of disappearing and being replaced by an unrelated page.
4. Once open, reveal the scrollable invitation. Do not trap mobile users in a nested scroll area; let the page scroll normally.
5. Include replay and skip intro controls. Controls are discreet and must not cover names, event details or the RSVP form.
6. Handle timer cleanup, component unmounts, rapid clicks and replaying during an animation. Skip cancels outstanding timers.
7. Respect `prefers-reduced-motion`. In reduced-motion mode, reveal the invitation immediately or with a minimal fade; all content remains reachable.
8. Audio starts only after an explicit click/tap. Music controls must reflect actual playback state. Catch playback failures and allow mute / pause.
9. Do not use scroll-jacking. Scroll-triggered reveals must leave native scrolling, selection, form use and links fully usable.

Prefer transforms and opacity over expensive layout animation. Add a static fallback if an image or animation fails. Use proper `alt` attributes and accessible buttons rather than clickable divs.

## Phase 3 — brand system

Create a distinctive Kadi visual identity connected to crafted invitations, letterpress, seals, stationery and editorial design. Do not reuse the failed generic purple-gold gradient / diamond logo direction.

Create and use:
- A bespoke responsive SVG mark and wordmark, plus mono / small-size variants.
- A coherent colour system with core brand colours and template-specific theme tokens.
- A typography system: strong editorial serif, readable sans serif, and controlled script use only where appropriate. Use script for names / short phrases, never for long body copy.
- Surface and print details: paper textures, liner patterns, fine rules, intentional shadows, frames, cut-paper masks, stamps, illustrated ornaments, offsets and varied proportions.
- A spacing / typography scale and reusable design tokens.
- Event-specific tone: playful and expressive for birthdays; floral and romantic for weddings; warm for showers and graduations; calm and respectful for memorials; refined and legible for corporate gatherings.

Do not enforce invitation art direction on every admin screen; use the same quality bar but keep creator workflows efficient and readable.

## Phase 4 — marketing website

Build a genuine public landing page with an art-directed hero and interactive invitation preview drawn from the real template catalogue. Show several different experiences using asymmetrical compositions / editorial pacing; not a grid of repetitive feature cards.

Include:
- Landing page and main CTA.
- Template gallery with meaningful category filters and immersive previews.
- Template detail / live demo routes.
- How it works.
- Pricing.
- FAQs, contact, about.
- Privacy, terms, cookie / data-protection information.
- Login / signup.

Landing-page CTA should open the creator flow. Sample invitations must be clearly identified as samples. The site's responsive navigation must work with keyboard and touch.

## Phase 5 — invitation creator / visual studio

The host-side editor must feel like a design studio, not a lengthy plain form.

Desktop:
- Main canvas with the invitation preview large enough to judge the design.
- A narrow, contextual inspector for the active selected item / section.
- A left section navigator with names, thumbnails and drag handles.
- Inline editable text / image placeholders and selection outlines only in edit mode.
- Direct actions for preview-as-guest, save, publish and share.
- A visible save / unsaved state and robust recovery after failed saves.

Mobile:
- Full-width live preview with a compact bottom / top contextual action strip.
- Editing controls open as focused drawers or steps; never squeeze a desktop inspector into tiny columns.
- Keep creation possible on mobile with progressive disclosure.

Wizard and editor requirements:
- Select event type, then template / experience theme.
- Enter event / celebrant names, event title, intro wording, date, start / end time and timezone, venue, address, direct map URL, schedule, dress code, story, photos, gallery captions, accommodation URL, gift details and RSVP options.
- Add / remove / reorder / hide sections. Templates define a default order, but the host can customise it.
- Change palette, type choices, frame / liner / seal, animation presets, image crop / positioning, decorative motion, and optional audio.
- Upload / replace / crop / reorder photos with upload progress, file-size limits, type validation and meaningful error messages.
- Preview every change live. Reset is reversible / confirmed; support undo / redo if feasible.
- Autosave with a clear state; debounce saves and avoid lost updates.
- Preview the initial closed envelope, opening sequence, post-opening page, RSVP and mobile view.
- Guest-specific preview uses the actual household name and guest-token behaviour.
- Publishing validates required event fields and creates a stable public slug.

Do not ask the user to fill irrelevant fields. Reveal fields based on event type and enabled sections. Use a guided, canvas-based workflow with useful defaults.

## Phase 6 — templates and data-driven rendering

The template catalogue must be data-driven. Keep theme definitions out of deeply nested route conditionals.

Extend the template model with fields as appropriate, for example:
- `experienceTheme`, `motionPreset`, version, category.
- Theme palette, background texture, envelope / liner / seal assets, frame style, typography.
- Configurable section list, order, optionality and section layout preset.
- Optional milestone age, audio URL, decorative asset set, photo layout and default RSVP questions.
- Default content used only for previews and new drafts; never override actual event data on public invitations.

Use a typed section registry (hero, opening letter, story, timeline, venue, map, schedule, dress code, gallery, RSVP, gifts / contributions, accommodation, FAQ, memorial condolences / candle wall and closing message). Each section must be independently editable, reorderable and responsive. Avoid one giant `if template === ...` file: use shared primitives plus separate experience-layout components and small section renderers.

The live public invitation should resolve actual Event data, Template data, optional EventDesign data, gallery assets, section configuration and guest household token. Treat the URL token as a credential: hash / verify it server side, support expiration / revocation and avoid exposing sensitive household data in public APIs.

## Phase 7 — full platform features

Implement and verify the following feature areas without removing existing functionality:

### Accounts and access
- Secure host signup / login, password reset or supported verified login, session expiration, logout, account settings.
- Clear role boundaries: host, planner, support/admin and system admin. Enforce authorisation server-side on every event-scoped request.
- Do not claim Google OAuth, SMS OTP, email delivery or magic links are live unless providers and environment variables are actually configured.

### Event lifecycle
- Draft, preview, publish, update, archive, restore if supported, duplicate event and unpublish.
- Unique slugs, collision handling, event timezone, invitation versioning and stable share links.
- Safe publish validation and a clear unconfigured state where a dependency is absent.

### Guests and households
- Add one guest, couple or household; edit details; group guests; search, sort and filter; bulk select; remove / archive.
- CSV import with column mapping, row preview, valid / invalid row report and duplicate policy; template download; export.
- Guest-specific invitation tokens, plus-one limits and attendee records for each household member.
- Track invite status and RSVP status separately from WhatsApp/email delivery status.

### RSVPs
- Yes / no / maybe or event-specific attendance responses.
- One RSVP per valid invitation/household as appropriate, idempotent submission, deadline enforcement and update/correction policy.
- Per-attendee guest names, plus-ones, optional meal choices, allergies / dietary restrictions, children and custom questions.
- Save response state and show clear success/error/pending feedback only based on server response.
- Host dashboard with counts and filters; export and printable list.

### Invitations, event assets and galleries
- Reusable uploads, appropriate image sizes, responsive formats, captions, order, focal point, preview and missing-image fallback.
- Do not use arbitrary stock images in production invites. Provide licensed sample media only in demo templates and make it replaceable.
- Use object storage behind an adapter; validate content-type and actual file signature, file size and dimensions. Do not store huge files as Base64 in database rows.

### WhatsApp / other messaging
- Start with the host's native WhatsApp share link if direct messaging is not configured.
- Direct Cloud API requires valid credentials, approved templates, business setup and proof / records of recipient opt-in where required.
- Use a suppression list and honour opt-outs before every send / retry.
- Maintain delivery webhooks, template category, recipient, provider message ID, cost/currency, timestamps, failure details and idempotency.
- Queue bulk delivery and reminders in background jobs with retries, rate limits and a dead-letter state.
- Never fabricate sent, delivered or read statuses.

### M-Pesa / contributions / payments
- Keep a payment-provider adapter and use Sandbox / mock mode until live credentials and provider approval are set.
- Separate invitation contributions from Kadi subscription billing.
- A requested STK Push is not a confirmed payment. Wait for a verified provider result and reconcile ambiguous outcomes.
- Store idempotency key, request ID, receipt / transaction ID, amount, currency, account / payer details only as needed, event ID, state transitions, reconciliation status and audit timestamps.
- Webhooks are server-to-server endpoints with provider-supported verification, duplicate detection and validation. Never trust a browser-only success signal or let a repeated callback double-count.
- Do not build a custodial pooling / host-payout product until provider arrangements and applicable payment-services obligations are reviewed. Direct-to-host instructions can be used as an earlier option if product requirements allow.
- Do not claim instant payouts or fixed settlement timing without a verified provider contract and test.

### Subscription billing
- Plans, entitlements, renewal status, invoices / receipts and subscription lifecycle if included.
- Verify Kenya and feature availability of any selected payment provider. Do not assume a provider can process Kenyan businesses or that a Safaricom integration confers card-security compliance.
- Make plan gating server-enforced, not only hidden controls in the UI.

### Notifications and admin
- In-app/email notifications where configured, event reminders, deadline reminders and failure alerts.
- Admin dashboards for user support, events, template management, messaging / transaction logs, feature flags, system health and audit history.
- Admin actions require role checks, reason logging for high-impact actions and audit trails.
- Do not present made-up usage, revenue, delivery percentage or uptime metrics. Use actual computed metrics or explicit demo labels.

### Offline and performance
- PWA / installability only where it has a real benefit. Cache static, non-sensitive assets carefully.
- Do not queue a guest RSVP and falsely show it as submitted before server confirmation. Offline state must say `pending sync` and dedupe on retry.
- Avoid caching personalised invitations or guest tokens in shared caches without deliberate private-cache rules.

## Phase 8 — database, services and APIs

Use the supplied original schema as a valuable starting point. Read `Kadi_Technical_Snippets_and_Original_Database_Schema.md` and `docs/KADI_PLATFORM_BLUEPRINT.md`, compare them with current TypeScript types and actual routes, then write a migration plan. Keep the intent and useful tables; don't blindly copy inconsistent fields into production.

Ensure relational integrity for at least:
- users / auth identities / sessions as applicable;
- events and versioned event designs;
- templates and template versions;
- guests / guest households / individual attendees / group assignments;
- invitation access tokens / token hashes / expiry / revocation;
- RSVP questions / options / answers / response submissions;
- gallery media / uploads / section configuration / schedules / venue / links;
- contribution attempts / financial transactions / payout records if supported / provider callbacks and reconciliation;
- subscription plans / subscriptions / invoices where implemented;
- consent records / communication preferences / suppression entries;
- background jobs / notification logs / webhook event IDs;
- audit logs and admin actions.

Use database constraints, indexes and transactions where appropriate. Define the uniqueness rules. Avoid destructive cascade deletion for financial/audit records. Keep secrets and provider credentials only in environment variables / secret manager. No production secrets in source control.

The current project may have a mock database. Keep a deterministic local demo provider for UI development, but clearly separate it from production services. Add an actual database adapter and migrations when dependencies / credentials are available; don't quietly label an in-memory store as production persistence.

API requirements:
- Validate all input at the server boundary with Zod or an equivalent typed schema.
- Enforce authentication, event ownership and role checks on every private endpoint.
- Use predictable response / error structures, pagination, reasonable request limits and request IDs.
- Make mutations idempotent where retries can happen.
- Implement webhook handling separately from browser APIs.
- Avoid returning secrets, raw access tokens, excessive personal data or internal stack traces.
- Add rate limits / abuse protection to auth, RSVP, upload, messaging and public forms.

## Phase 9 — security, privacy and Kenya readiness

Implement safeguards, but don't claim legal certification from code alone. Produce a checklist for qualified review before public launch.

- Apply the Kenya Data Protection Act and applicable regulations to the actual data flows, purposes, legal bases, access rights, retention and deletion.
- Minimise guest data; document controller / processor roles and provider data transfers.
- Assess ODPC registration / DPO requirements based on the platform's actual circumstances and current guidance.
- Handle children's data with an appropriate guardian-consent and protection workflow when applicable.
- Differentiate ordinary service notices from marketing. Maintain opt-out / suppression controls.
- Define a real incident response and breach-notification process; don't use a simplistic blanket deadline irrespective of statutory conditions.
- Give guests and hosts appropriate access, correction, deletion and complaint channels.
- Define retention by data category. Do not erase financial records improperly when an event is deleted.
- Validate upload types / size, escape user content, protect against XSS / CSRF / SSRF where relevant, restrict unsafe URL schemes, use secure cookie settings, and avoid leaking token-bearing URLs to third-party analytics / referers.
- Never put a full guest list, contact details or private RSVP state on public event endpoints.
- Add admin audit logs, access controls, environment validation and secure error handling.

## Phase 10 — test plan and definition of done

Add or update automated tests. At minimum verify:

### Visual and interaction
- All four invitation themes render their own layouts, decorations and section order.
- Envelope seal responds to pointer, keyboard and touch. Flap and card motion render without clipping or z-index errors at supported sizes.
- Skip / replay cancels pending timers. Audio state reflects actual playback. No autoplay.
- Reduced-motion mode exposes the invitation without requiring animation.
- Long invitation scrolling works on mobile and gallery modal closes and navigates correctly.
- CTA targets (map, calendar, accommodation, RSVP) point to the relevant destination / section.
- Published invitations use real event data, not hardcoded demo labels.

### Application and data
- Draft creation, edit, preview, publish, unpublish / archive and slug collision handling.
- Guest import errors / duplicates, household attendee limits, token revocation and expiration.
- RSVP deadline / duplicate-submission logic, guest response updates and exports.
- Event ownership / access control, admin privilege checks, validation and rate limiting.
- Payment retries / duplicate callbacks / ambiguous status / reconciliation if payment features are enabled.
- Messaging opt-out, suppression, retry and provider-failure behaviour if direct messaging is enabled.

### Runtime and release
- Run lint, TypeScript, unit / integration tests and production build. Fix failures introduced by the change.
- Check the home page, template gallery, template detail, event creator, dashboard, login and public invitation on mobile and desktop in a browser if tooling is available.
- Test keyboard navigation, form labels, visible focus, image alt text and reduced motion.
- Check 320px-wide mobile, modern phone size and desktop widths. No horizontal overflow, hidden controls or forms clipped by decorative layers.
- Provide `.env.example` with all variable names and explanations but no secrets.
- Update README with installation, environment setup, local demo mode, database migration, tests and known external provider prerequisites.

## Implementation order

Do not try to write the entire platform in one enormous component. Implement sequential vertical slices, but continue through the phases unless blocked by missing third-party credentials:

1. Audit the actual code and document the plan.
2. Implement the four video-inspired guest invitation layouts and correct the template catalogue.
3. Ensure the public invitation route provides real event data and existing RSVP / venue / schedule / gift components in the theme-appropriate order.
4. Rework the template gallery and creator experience around a live invitation canvas, not cards / forms everywhere.
5. Complete event and guest lifecycle / validation / persistence while retaining the supplied schema intentions.
6. Wire integration adapters, demo modes, webhook logic, consent and security.
7. Add test coverage, run checks, fix visual/runtime issues and document blockers accurately.

Do not stop after Phase 2. If a provider integration requires credentials, finish its configuration screen, adapter, schema, sandbox / test support, error states and setup documentation, then move on.

## Final handoff

When finished, provide:
- A concise list of implemented features and exact routes.
- The main source files added or changed.
- Commands used and actual results for lint, typecheck, tests and production build.
- Known limitations / integrations not configured, clearly labelled.
- Any required environment variables in `.env.example`.
- Instructions to run and visually inspect the project.

Never say a check passed if it was not run. Never call a prototype a complete production platform while core persistence, authentication, messaging or payment features remain mocked.
