# KADI — ANTIGRAVITY MASTER BUILD PROMPT

You are the product architect, senior full-stack engineer, UX designer, motion designer, accessibility reviewer, security engineer, and test engineer for **Kadi**, a new mobile-first multi-event digital invitation platform primarily for Kenya.

The project is still at the planning stage. Assume the workspace may be empty. Do not assume an app, backend, database, brand assets, accounts, API credentials, domain, or production integrations already exist.

Your mission is to build a high-quality, production-oriented platform in controlled phases from a written blueprint. The signature feature is an immersive animated invitation: a sealed envelope opens, the flap rotates, the liner appears, a card physically emerges from the envelope, typography and real event photographs reveal, and the card transitions into a complete interactive invitation website. Do not reduce this to a static template, a generic landing page, a plain fade, or a video.

Read and follow the accompanying **Kadi Full Platform Blueprint**, including **Appendix A: Technical snippets and starter schema retained from the original brainstorm**. The original template JSON, loading/reduced-motion CSS, accessible HTML example, security-header example, full SQL starter schema, indexes, API route outline and response examples are intentional project inputs and must not be silently discarded. Review each item critically: preserve useful detail, document any design changes, and convert accepted database design into versioned migrations with tests. Do not treat the original SQL as production-ready or paste it blindly; fix the documented limitations and add the necessary security, integrity, consent, token, transaction and audit controls. , including **Appendix A: Technical snippets and starter schema retained from the original brainstorm**. The original template JSON, loading/reduced-motion CSS, accessible HTML example, security-header example, full SQL starter schema, indexes, API route outline and response examples are intentional project inputs and must not be silently discarded. Review each item critically: preserve useful detail, document any design changes, and convert accepted database design into versioned migrations with tests. Do not treat the original SQL as production-ready or paste it blindly; fix the documented limitations and add the necessary security, integrity, consent, token, transaction and audit controls.  If it is available in the workspace, treat it as the main product specification. If it is not present, create `docs/KADI_PLATFORM_BLUEPRINT.md` from these requirements and record any assumptions. Keep a decision log for anything that genuinely needs a business/provider/legal choice.

## NON-NEGOTIABLE RULES

1. Inspect the workspace, existing dependencies, files, environment and available tests before changing anything. If the workspace is empty, scaffold the project using the stack below. If code already exists, preserve and understand it before changing it.
2. Do not invent working external services, API credentials, production approval, payment success, WhatsApp delivery, legal approvals, or live analytics. When credentials or account approval are missing, build an adapter, sandbox/mock for development, configuration checks and honest disabled states. Never label simulated data as live.
3. Do not sacrifice the rich invitation visual experience to make the product generic, dull, empty or overly minimal. The invitation should feel like a physical object that unfolds into an editorial, animated event experience. Dashboard screens can be calmer and more functional, but they must still feel carefully designed.
4. Preserve all existing working capabilities when enhancing an existing workspace. Do not perform an unnecessary rewrite, remove routes or simplify away features.
5. Do not generate the whole application as one unstructured code dump. Build in milestones, with working code, migrations, tests, documentation and visible verification at each milestone. Continue to the next milestone after the prior one is implemented and checked; do not stop at a plan or static mockup.
6. Do not use emoji as the production logo, icon system or decorative asset. Use proper SVG, image assets, icon components, typography and motion.
7. Do not expose secrets in browser code, commits, logs or documentation. Provide `.env.example` with placeholders only.
8. All ownership, roles, limits and permissions must be enforced server-side. Hiding buttons is not access control.
9. Every critical interaction must have success, loading, empty, validation, error and recovery states. Never claim a save, message, RSVP or payment succeeded until confirmed by the authoritative server/provider.
10. Document current package choices and provider/API versions. Verify the current stable versions and compatibility before installing dependencies.


## PRESERVE ORIGINAL TECHNICAL INPUTS

The full blueprint appendix retains the original brainstorm's working-level examples. During implementation, inventory each one in `docs/DECISIONS.md` or `docs/IMPLEMENTATION_NOTES.md` as `reuse`, `adapt`, or `replace`, with a short reason. Do not silently omit the original SQL tables, indexes, event/template JSON, loading CSS, reduced-motion CSS, accessible announcement example, API routes or response shapes. Where changes are required, explain the change and keep the resulting schema, migrations, API definitions and tests in the repository. Keep the distinction clear between illustrative code, tested code and production integration.

## PRODUCT DEFINITION

Kadi lets hosts create invitations for weddings, birthdays, memorials/funerals, baby showers, graduations, anniversaries, corporate/community events and custom occasions. Hosts personalise event details, photographs, colours, fonts, envelope liner/seal, animation, sections and RSVP questions. Guests open one link without needing a Kadi account, experience the animation, view the details and RSVP. Hosts manage guest households, attendees, groups, imports, responses and event updates. Optional features include guest galleries, condolences/candles, calendar links, directions, WhatsApp/email/SMS communication, contributions, subscription billing, team workspaces and event-day check-in.

Kadi is not just a digital card. The animated invitation is a live website containing real editable event details and functioning RSVP features.

## RECOMMENDED BASELINE STACK

Use a coherent stack, not multiple overlapping alternatives:

- Next.js App Router, React and strict TypeScript.
- Tailwind CSS plus accessible, reusable UI primitives.
- React Hook Form with Zod or another single maintained form/schema system.
- Managed PostgreSQL with migrations and an ORM; choose one (Drizzle is acceptable) and use it consistently.
- One managed authentication provider with secure server-managed sessions. Do not hand-roll password/session infrastructure unnecessarily.
- One object-storage provider for uploads.
- Motion for React for ordinary interface animation. Use GSAP for the envelope timeline only if it adds clear value. Rive is optional for a prepared complex animation asset; do not add it without need.
- One durable background job service for imports, reminder scheduling, media processing, messaging and reconciliation.
- One transactional email provider if email is enabled.
- User-controlled WhatsApp share initially. Meta WhatsApp Cloud API is a later integration requiring approved account/configuration/templates and consent-aware dispatch.
- Daraja/M-Pesa through a provider adapter only after the specific payment model and live account arrangements are confirmed.
- One primary hosting/deployment target with appropriate CDN/media delivery.
- Error monitoring, structured logs, uptime checks, database backup and tested restore.
- Automated CI running formatting/lint, typecheck, unit/integration tests, build and critical end-to-end tests.

Do not mix Next.js handlers and a second backend framework, use multiple databases or storage providers, or include Redis only because it appears in a boilerplate. Add dependencies when a documented need justifies them. Write the final chosen stack and rationale to `docs/ARCHITECTURE.md`.

## MILESTONE 0 — REPOSITORY INSPECTION AND PRODUCT SETUP

1. Inspect current workspace, runtime/package manager, repository, existing app, dependencies, lint/test scripts and deployment assumptions.
2. If empty, initialise a clean TypeScript application with a maintainable folder structure, route groups, environment validation, linting, formatting and CI.
3. Create:
   - `docs/KADI_PLATFORM_BLUEPRINT.md`
   - `docs/ARCHITECTURE.md`
   - `docs/DECISIONS.md`
   - `docs/SECURITY_AND_PRIVACY.md`
   - `docs/TEST_PLAN.md`
   - `.env.example`
4. State explicitly in `DECISIONS.md` that the name Kadi is provisional until checked; payment model, automated WhatsApp, final pricing, provider accounts, and legal interpretation are decision gates.
5. Do not block progress on missing production credentials. Set up provider interfaces and local test doubles with unmistakable development-only labels.
6. Implement the design tokens and layout foundations before creating a large set of screens.

At the end of this milestone, report the workspace findings, selected stack, files created and tests/build run. Then continue into Milestone 1.

## MILESTONE 1 — DESIGN SYSTEM AND PUBLIC WEBSITE

Create an intentional, premium design system. Proposed palette: purple `#6B4EFF`, gold `#F5B942`, rose `#E85D75`, coral `#FF6B6B`, sage `#7A8B7A`, charcoal `#1A1A2E`, slate `#64748B`, mist `#F1F5F9`, white `#FFFFFF`. These are tokens, not fixed styling values repeated throughout components. Verify real contrast; choose accessible semantic variants when a token fails.

Typography: readable UI sans-serif; elegant serif display face for appropriate invitation designs; optional script face only for brief decorative text. Use system fallbacks, subset fonts and avoid layout shift.

Create polished public routes:
- `/`: landing page with strong product promise, a playable/clickable animated demo, feature explanation, example templates and clear create-invitation CTA.
- `/templates`, `/templates/[category]`, `/templates/[templateId]`: browsing, event/style filters, detail page and live demo.
- `/how-it-works`, `/pricing`, `/faq`, `/about`, `/contact`, `/help`, `/privacy`, `/terms`, `/cookies`, `/data-protection`.
- Authentication routes suitable for the chosen provider.

Do not create fake statistics, fabricated testimonials, or production-looking dummy payment data. Seed data should be visibly local/demo-only. Avoid loading all demo animations and photos immediately on the landing page.

## MILESTONE 2 — SIGNATURE ANIMATED INVITATION RENDERER

Treat this as a first-class feature, not decoration. Build and verify a prototype with actual distinct layers/assets:

- Envelope body.
- Hinged flap with perspective.
- Inner liner.
- Seal.
- Invitation card front/back or layered card surface.
- Paper shadow/depth.
- Hero image, decorative art and typography.

Sequence:
1. A guest opens the invitation URL and sees a closed, personalised envelope.
2. The guest taps the seal/envelope.
3. The seal reacts.
4. The flap rotates back with 3D perspective.
5. The liner becomes visible.
6. The card rises out of the envelope with a small tilt and realistic layered shadow.
7. The card expands/settles into the invitation hero.
8. Names, date, event title and hero image reveal in a designed sequence.
9. The live invitation page continues below with scroll-triggered sections.

The card MUST visibly emerge from inside the envelope. A fade-only transition or a button that replaces the screen is not acceptable.

Add template-level motion presets: classic stationery, floral romance, cinematic photos, modern editorial, birthday/playful, baby shower, graduation, dignified memorial, and corporate/community. Use the event type only to recommend defaults. Never use celebratory confetti or playful motion for memorial/funeral templates.

Photo effects: slow Ken Burns pan/zoom, crossfade, circle reveal, clip/mask reveal, blur-to-sharp and staggered reveal. Do not overuse effects. Use real uploaded event images after upload functionality exists; avoid shipping stock placeholders as real guest content.

Add:
- Skip opening option.
- Replay control.
- Silent default/optional audio control; only start audio after user gesture as browser policy permits.
- Reduced-motion alternative respecting `prefers-reduced-motion`.
- Static fallback if animation fails.
- Cleanup for timelines, observers and listeners.
- Browser/mobile test coverage.

Review these experience patterns, without copying their copyrighted assets or code:
- https://thedigitalenvelope.com/animated-wedding-invitations
- https://www.greenvelope.com/resources/animated-envelope-invitations
- https://www.snappost.co/en/features/opening-animation
- https://www.paperlesspost.com/cards/section/invitations
- https://www.vibeflydigital.com/en/digital-wedding-invitations

Do not produce a flat, empty, or generic invitation design. Invest in paper depth, composition, lighting/shadows, typography, properly designed seal/liner artwork and meaningful image transitions while protecting readability and performance.

## MILESTONE 3 — TEMPLATE ENGINE AND DESIGN EDITOR

Use a structured, schema-validated template format. Each template needs ID, version, category, theme tokens, font selections, envelope/layer assets, animation preset, section catalogue, image requirements, preview image/demo, accessibility notes, asset rights information, entitlement, and supported renderer version.

Implement:
- Template browse/select with live demo.
- Real-time or debounced invitation preview using the same renderer as the guest view.
- Event names/details editing.
- Colour palette and typography controls.
- Image upload, crop, focal point, order, alt text and replacement.
- Envelope liner/seal selection.
- Supported animation preset selection.
- Section visibility/order and supported content editing.
- Optional music upload/selection only where rights and storage limits are handled.
- Save state, autosave with honest confirmation, undo/redo where feasible, preview and reset with confirmation.
- Template versioning so changing a library template does not break old events.

Do not implement arbitrary user-supplied HTML/JS. Use safe structured sections and render validated configuration.

## MILESTONE 4 — HOST AUTHENTICATION, WORKSPACE AND EVENT MANAGEMENT

Build the authenticated host dashboard with loading, empty, error and real loaded states.

Routes:
- `/app`
- `/app/events`
- `/app/events/new`
- `/app/events/[eventId]`
- `/app/events/[eventId]/edit`
- `/app/events/[eventId]/design`
- `/app/events/[eventId]/preview`
- `/app/events/[eventId]/guests`
- `/app/events/[eventId]/guests/import`
- `/app/events/[eventId]/rsvps`
- `/app/events/[eventId]/messages` when enabled
- `/app/events/[eventId]/contributions` when enabled
- `/app/events/[eventId]/check-in` when enabled
- `/app/events/[eventId]/analytics`
- `/app/events/[eventId]/settings`
- `/app/billing`, `/app/settings/*`, `/app/help`.

Event creation steps:
1. Event type.
2. Template/live demo.
3. Details/date/time/timezone/venue or online location.
4. Design/photo/animation and sections.
5. Guests (optional; can skip).
6. RSVP questions/deadline.
7. Optional add-ons (directions, calendar, memorial options, contribution instructions, reminders, music).
8. Review, guest preview, validation, publish.

A wizard step can be skipped if optional. Support draft persistence, resume and event duplication. Duplicating an event MUST NOT duplicate guest tokens, RSVPs, payment records, consent or delivery history.

## MILESTONE 5 — GUESTS, HOUSEHOLDS, IMPORT AND RSVP

Do not model every invite as one person. Use a household/invitation entity plus individual attendees so one household may include a couple, family or allowed plus-one count.

Guest features:
- Add/edit/remove individual or household invitation.
- Group, contact details, personal note, allowed plus-ones, access token, invitation state and consent/suppression state.
- Search/filter/sort/pagination and responsive mobile layout.
- Bulk selection/actions with a review step.
- CSV upload/paste, column mapping, preview, validation, duplicate warnings, partial imports, progress and downloadable error report.
- Never send invitations automatically as a side effect of importing contacts.

RSVP features:
- Accept/decline/maybe.
- Per-household or per-attendee response according to event settings.
- Attendance count limited by allowed guests/plus-ones.
- Meal and dietary preferences per attendee.
- Custom text, single-select, multi-select and checkbox questions.
- Optional song request, message, child count or event-specific questions.
- Deadline, closed state, accessible confirmation and response edit if allowed.
- Server-side validation, idempotency, and safe retry after a timeout.
- Host dashboard with clear household count vs actual attendee count, filters, summaries and CSV export.

Private invitation token rules: generate high-entropy tokens, store token hashes where practical, expiry/revocation, rate limits, no sequential IDs, never send token values to analytics, and prevent cross-event use. Guests do not require an account to RSVP.

## MILESTONE 6 — GUEST INVITATION CONTENT BY EVENT TYPE

Implement one renderer and configurable sections, not separate apps for every occasion.

Wedding: envelope, couple, welcome, story, countdown, ceremony/reception, programme, maps, dress code, accommodation, registry/contribution info, gallery, FAQ, RSVP, meal/dietary preferences, song request.

Birthday: celebrant/age or milestone, photos, time/venue, theme/dress code, schedule, RSVP, allowed guests, gift guidance.

Memorial/funeral: dignified photo and text, service dates/times, ceremony/burial/commemoration schedule, directions, family-approved tribute, moderated condolences, optional candles, attendance RSVP and contact/help information. No party-like effects.

Baby shower: parents/family names, venue, theme, RSVP, gift/registry information and photos with child-data privacy safeguards.

Graduation: graduate details, institution, schedule, venue/directions, photos, guest allowance and RSVP.

Anniversary: names/milestone, story, photos, schedule, venue and RSVP.

Corporate/community/custom: organiser, brand, agenda, time blocks, online/physical venue, custom questions, capacity, accessibility/contact information.

Only render enabled and applicable sections. Ensure all essential event details are accessible if the animation is skipped or disabled.

## MILESTONE 7 — SHARING, NOTIFICATIONS AND OPTIONAL AUTOMATED MESSAGING

First shipping scope:
- Copy invitation link.
- Native share sheet when supported.
- WhatsApp share/deep link that opens the host's own WhatsApp with text pre-filled.
- Optional verified email if provider configured.

Automated WhatsApp Cloud API is a later release gate. If adding it, implement:
- Explicit consent records per contact/channel/purpose/source/time/status.
- Suppression list and opt-out that is checked at dispatch time.
- Approved, versioned templates as required by current Meta policy.
- Template category that reflects content and current policy, not hardcoded event type.
- Queue, retry/backoff, campaign previews, send confirmation, quotas and estimated cost.
- Provider webhook event ID/message ID deduplication.
- Honest state mapping: queued, submitted, delivered, read-if-provided, failed, suppressed, unknown.
- Recheck event status, permissions and opt-out immediately before send.
- Current provider pricing must be configuration-driven and verified before any cost claim.

Do not claim template approval before it exists. Do not infer consent from an uploaded phone number. If provider credentials/approval are absent, keep automated sends disabled and clearly state why.

Email/SMS can be adapters after their provider, sender setup, pricing and consent are configured. Add scheduled reminders only through durable background jobs and make them cancel on event edits/cancellation or opt-out.

## MILESTONE 8 — M-PESA, CONTRIBUTIONS AND BILLING

Do not assume Kadi may collect, hold or disburse money for hosts. The initial default should be host-provided payment instructions or a confirmed direct-to-host arrangement. Managed collection/payouts require explicit business/legal/provider review and production account confirmation.

If payment integration is configured:
- Server-side credentials only.
- Separate payment attempt and transaction records.
- Explicit pending/succeeded/failed/cancelled/unknown/reversed/reconciliation-required states.
- Idempotency keys and unique provider references.
- Validate the provider-supported callback authenticity mechanism; do not invent a signature scheme.
- Validate amount/currency/receipt/request/account/event relation.
- Treat provider callbacks as asynchronous and deduplicate repeats.
- Payment is not successful because the UI said success or the guest returned to a success URL.
- Unknown timeout result must be reconciled before asking the guest to pay again.
- Separate gross, fee, net, reversal, refund and payout records.
- Append-only financial history and finance-scoped access.
- No managed payout button or payout-time promise until approved and tested.

Safaricom B2C production use has specific account/shortcode arrangements. Read and verify the relevant live Daraja docs for the chosen API and do not assume an STK Push collection setup automatically enables disbursement.

Billing for Kadi's own plans is separate from guest-to-host contributions. Build an entitlement abstraction for event/guest limits, templates, branding, storage, message quota, teams and support. Verify the chosen payment provider's actual availability/features for a Kenya-based business before selecting it. Do not hardcode prices before validation.

## MILESTONE 9 — ADMIN, SUPPORT, ANALYTICS AND PWA

Admin/support:
- User/event/template management.
- Restricted account support and abuse reporting.
- Queue, webhook and provider health.
- Message cost/usage where automated messaging enabled.
- Transaction reconciliation only for authorised finance roles.
- Privacy requests, retention jobs and deletion status.
- Feature flags and audit log.
- MFA/least privilege for staff.

Analytics:
- Funnel from template demo to published invitation, first share and first RSVP.
- RSVP trends and counts.
- Template usage, errors, support rate, cost-to-serve and provider reliability.
- Do not equate page views with read receipts; avoid sensitive analytics on memorial pages and keep tokens out of analytics.
- Avoid fake live counts, sample transactions and fabricated uptime values.

PWA/offline:
- Manifest, correct icons, appropriate service-worker cache and versioned static assets.
- Do not publicly cache private guest payloads or tokenized invitation data incorrectly.
- No offline payment requests.
- If offline RSVP drafts are supported, mark them pending and never show final confirmation before server acceptance.
- Explain cached invitation data may be out of date.

## DATA MODEL REQUIREMENTS

Implement migrations and constraints for at least:
- users/accounts and identity mapping;
- workspaces/team membership if the feature is enabled;
- events, event sections, event publication revisions;
- templates and template versions;
- media assets;
- guest households/invitations and attendees;
- guest groups;
- RSVP submissions, questions, answers;
- consent records and communication suppression;
- message campaigns/jobs/provider statuses;
- background jobs and webhook events;
- payment attempts, contributions/transactions, financial events/ledger and payouts only if approved;
- plans, entitlements, subscriptions and invoices if paid plans are enabled;
- condolences/tributes, candles, guest photo uploads if enabled;
- support tickets/abuse reports and audit logs.

Enforce foreign keys, allowed state values, non-negative amount constraints, unique event slugs, unique provider transaction/message/webhook identifiers, appropriate event-scoped uniqueness, timestamps, and indices for common list/filter queries. Avoid destructive cascade deletion of financial/audit history. Model multiple attendee records properly instead of fixed partner/meal columns.

## API REQUIREMENTS

Use a consistent REST API unless the codebase has a documented reason to differ. Include routes/services for:
- events list/create/read/update/publish/unpublish/duplicate/archive;
- design and media upload/processing;
- guest CRUD, bulk actions and CSV imports/job status;
- public invitation read, RSVP submit/update and guest response export;
- optional message campaigns, status, opt-out and provider webhooks;
- optional payment attempts/status/provider webhooks/reconciliation;
- templates and template versions;
- optional condolences/candles/gallery moderation;
- admin/support/privacy/export/deletion with specific permissions.

Every request requires schema validation, permission checks, safe error codes, request IDs, appropriate pagination, idempotency for retries, and tests. Never return stack traces or secret-bearing provider errors to a guest.

## PRIVACY, ACCESSIBILITY AND SECURITY

The platform is intended for Kenya. Treat privacy requirements as implementation work, not a boilerplate page. Before production, verify current Kenya Data Protection Act/regulations/ODPC guidance, provider agreements, registration obligations and cross-border data flows with competent advice. Current draft law/policy is not enacted law solely because a draft has been published.

Implement:
- Data inventory and retention schedule by category.
- Clear privacy notice and purpose-specific lawful basis/consent.
- Host/guest access, correction, deletion and export workflows.
- Child-data minimisation and appropriate parent/guardian safeguards.
- Cross-border processor/subprocessor review.
- Incident/breach assessment and escalation.
- Cookie/tracker decision and consent management where applicable.
- WhatsApp policy/opt-in/opt-out compliance if enabled.
- No claim of PCI DSS compliance just because Safaricom or a payment provider is used.
- Managed identity, secure session cookies, brute-force/rate limiting, secure secret management, safe file uploads, XSS/CSRF/SSRF defences, CSP/HSTS and least privilege.
- Guest tokens high entropy, revocable, protected from logs and analytics.
- Admin MFA, audit log, secure backup/restore and dependency scanning.
- WCAG 2.2 AA as a quality target: semantics, keyboard/focus, contrast, labels/errors, alt text, screen readers, reduced motion, reflow and no essential information conveyed only by sound/animation.

## TESTING REQUIREMENTS

Write tests for:
- envelope flap/card emergence, skip/replay and reduced-motion behaviour;
- event publish and stable link;
- template version compatibility;
- RSVP attendee/plus-one constraints and duplicate submission;
- CSV mapping, invalid rows and retry safety;
- tenant isolation and role permissions;
- token expiry/revocation and rate limits;
- message opt-out/duplicate webhook if messaging is enabled;
- payment unknown outcome, callback deduplication, receipt/amount validation and reconciliation if payments enabled;
- event update/cancel stops outdated scheduled reminders;
- privacy export/deletion and retention;
- upload safety, accessible keyboard flows and mobile responsive layouts.

Use unit, integration, browser end-to-end, visual regression for key invitation states, accessibility checks and performance checks. Test on phone viewport sizes and constrained network. Fix issues; do not merely document failing critical tests.

## IMPLEMENTATION ORDER AND CONTINUATION RULE

Build in this order:
1. Inspect/design-system/docs/CI.
2. Public website and high-quality animated invitation prototype.
3. Template schema/editor foundation.
4. Auth and host/event management.
5. Household/attendee guest model, imports and RSVP.
6. Event-type sections, gallery, export and essential admin/audit.
7. Sharing, notifications, privacy/export/deletion.
8. Automated WhatsApp only after configuration/consent readiness.
9. Billing and M-Pesa only after business/provider/legal decision gates.
10. PWA, analytics expansion, teams/check-in and other scale features.

At each stage:
- Implement real working components, not a static screenshot.
- Run formatter, lint, typecheck, tests and build.
- Resolve failures before moving forward.
- Update docs and decision log.
- Show the changed files and any external prerequisites.
- Keep the application runnable.

If the workspace is empty, scaffold it. If it is not empty, preserve existing code and adapt the sequence. Do not stop after the initial plan. Continue with the first buildable milestone and complete it to a verified state. Do not claim production readiness when provider credentials, legal review, or external approval remain outstanding.

## VISUAL QUALITY ACCEPTANCE CRITERIA

The product is not accepted if:
- it looks like a generic admin template with a plain empty invitation;
- the envelope does not physically open or the card does not visibly emerge;
- all invitation templates use the same generic motion and layout;
- the editor preview differs from the guest view;
- it uses emoji as a substitute for real visual assets;
- hero/gallery media are unoptimised or the animation delays essential content;
- music starts without a deliberate user action where required;
- reduced-motion users cannot access content;
- there are fake interactions, nonfunctional controls, dummy production data, or false success messages;
- RSVP/security checks exist only in the frontend;
- external integrations are falsely represented as connected.

The intended result is a premium, emotionally engaging invitation product with a highly polished letter-opening reveal, genuinely beautiful event-specific templates, a complete practical event page, reliable host management and a secure foundation for later communications and payments.
