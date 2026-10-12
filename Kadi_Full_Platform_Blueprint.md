# KADI — Full Platform Blueprint

**Product concept:** A mobile-first, multi-event digital invitation platform with cinematic invitation openings, guest management, RSVP collection, and optional event communications and contribution tools.

**Document status:** Brainstorming and product-definition blueprint. This is not a statement that the product, provider accounts, legal position, domain, or integrations already exist.

**Working product name:** Kadi. Treat the name, logo, domain availability, and trademark position as unverified until checked.

**Primary market:** Kenya, with architecture that can support additional markets later.

**Date:** 12 October 2026

---

## How to use this blueprint

This document defines the complete intended product. It distinguishes (1) the proposed product experience, (2) technical recommendations, and (3) decisions that need validation before money, live messaging, or regulated payment flows are enabled. It is not necessary or sensible to build every item before launch. The complete vision is described first; implementation phases then determine what is built when.

Terms such as **MUST**, **SHOULD**, and **MAY** mean:

- **MUST:** Required for correctness, security, accessibility, or the stated product behaviour.
- **SHOULD:** Recommended default unless a documented reason justifies another approach.
- **MAY:** Optional capability that can be introduced when there is a validated need.

## Table of contents

1. Executive summary and product goals
2. Product principles and boundaries
3. Users, roles, and core journeys
4. Brand and visual identity
5. Information architecture and sitemap
6. Public marketing site
7. Authentication and onboarding
8. Host workspace and dashboard
9. Event creation and publishing wizard
10. Invitation renderer and animation system
11. Template engine and design editor
12. Event-type experiences
13. Guest and household management
14. RSVP engine
15. Sharing, WhatsApp, email, and SMS
16. M-Pesa and contribution architecture
17. Subscriptions, plans, and billing
18. Notifications and background jobs
19. Administration and customer support
20. Analytics and reporting
21. Loading, empty, error, and success states
22. Accessibility and inclusive design
23. PWA, offline behaviour, and performance
24. Privacy and Kenya legal/compliance workstream
25. Security and abuse prevention
26. Recommended technical architecture
27. Logical data model
28. API and webhook design
29. Integrations and operational tooling
30. Testing and quality gates
31. Delivery roadmap and release gates
32. Product metrics and business validation
33. Risks, edge cases, and operational runbooks
34. Definition of done
35. Reference websites and source material

---

# 1. Executive summary and product goals

## 1.1 Product definition

Kadi is a web platform for creating, publishing, personalising, sharing, and managing digital invitations for weddings, birthdays, memorials and funerals, baby showers, graduations, anniversaries, corporate events, community functions, and custom occasions.

The key differentiator is not merely an invitation image or a plain event website. The guest can open a link and experience a designed invitation: a sealed envelope, an interactive flap and seal, a card emerging from the envelope, text revealing in sequence, and photographs or decorative details that animate into the full invitation website. After the reveal, the invitation remains a usable web page with real event details, navigation, maps, the event schedule, gallery, RSVP, and optional contribution information.

The experience MUST be mobile-first, accessible, quick to load, editable after publishing, and usable without requiring a guest to install an app or create an account.

## 1.2 Product goals

1. Let a host produce and publish a beautiful, personalised invitation without needing a designer or coding skills.
2. Make opening the invitation feel special through intentional envelope, paper, typography, and photography animation.
3. Keep all practical details in one shareable link.
4. Give hosts reliable guest, household, plus-one, RSVP, and dietary-preference management.
5. Reduce manual chasing with consent-respecting reminders and delivery status.
6. Support Kenyan workflows, including phone-number formatting, WhatsApp sharing, local time, KES display, M-Pesa options, and familiar venue/location details.
7. Preserve privacy and dignity for memorials, funerals, and family events.
8. Create a sustainable SaaS business with clear plans, cost visibility, operational controls, and a safe route to add paid capabilities.

## 1.3 Non-goals for the first release

- Do not build a native iOS or Android application before the responsive website proves the core concept.
- Do not build an unrestricted drag-and-drop page builder if a structured section editor can deliver the planned layouts more reliably.
- Do not hold or route guests' funds through Kadi until the payment model, approved provider arrangement, and regulatory implications have been reviewed.
- Do not assume a saved phone number means permission for automated WhatsApp messages.
- Do not pretend a third-party integration is live when credentials, approvals, or production access are missing.
- Do not make all invitations look or move the same way.

## 1.4 Product success definition

A new host should be able to sign up, choose a design, enter event details, preview the opening animation, add a few guests, publish a private invitation link, share it, receive an RSVP, and view that RSVP on the dashboard without developer intervention. Optional messaging and payment integrations must be clearly labelled according to their actual configuration state.

---

# 2. Product principles and boundaries

## 2.1 Guest experience principles

- A guest should be able to view an invitation without creating an account.
- The invitation must communicate the essential event details even when animation, sound, or media fail.
- There is one primary experience: open the invitation, discover the details, respond, and optionally add the event to a calendar or maps app.
- The guest should never need to hunt for RSVP controls or be blocked by an oversized animation.
- Every private invitation token must be revocable; the token is an access mechanism, not proof of identity.
- A host can update a published invitation and the same canonical link should display the current published version.

## 2.2 Host experience principles

- The wizard can be completed progressively; optional steps may be skipped and revisited.
- Keep draft saving transparent. Do not tell a host changes are saved until the server confirms it.
- A live preview should use the same renderer as the guest-facing invitation.
- Guest counts mean people invited or expected, not merely household records.
- High-impact actions such as sending a bulk message, deleting an event, or enabling paid features require a review step.
- The system must make delivery and payment uncertainty visible instead of masking it with false success states.

## 2.3 Design principles

- Rich invitation artwork, depth, layered paper, strong photography, tasteful typography, and deliberate motion are part of the product's value; they must not be removed merely to simplify generic dashboard UI.
- Dashboard screens should remain clear and practical. Let the invitation be expressive; let management screens prioritise hierarchy, scanning, and efficiency.
- Avoid empty, generic, over-spaced layouts. Use event preview imagery, useful summary cards, guest data, strong typography, and clear section grouping without needless decorative controls.
- Respect the event's emotional context. A memorial must not inherit celebratory confetti or playful motion.
- Use a shared design system with template-specific skins rather than one-off page implementations.

## 2.4 Decision gates

These items must be resolved before production enablement:

1. Verify the Kadi name, domain, trademarks, and relevant naming conflicts.
2. Choose the first release's host authentication method and OTP/email providers.
3. Decide whether early contribution features only display host-provided payment instructions or use a provider-backed direct-to-host flow.
4. Get appropriate advice and provider confirmation before Kadi collects, holds, or pays out money on behalf of hosts.
5. Decide whether automated WhatsApp Cloud API sending is part of launch or a later release. Native WhatsApp sharing is the safer initial default.
6. Establish pricing and guest/event/storage/message entitlements after cost and customer research.
7. Confirm the applicable ODPC registration, controller/processor, retention, child-data, and cross-border processing obligations before production.

---

# 3. Users, roles, and core journeys

## 3.1 User groups

**Host:** An individual planning an event. Usually operates from a mobile phone and shares invitations through WhatsApp.

**Event co-host or planner:** Helps manage one or more events. Permissions must be limited to explicitly assigned events or workspaces.

**Guest:** Views a link and may RSVP, choose meal preferences, write a message, upload photos where enabled, or contribute where supported. Does not need an account.

**Kadi support agent:** Responds to account, event, message, and billing problems using limited support permissions.

**Kadi administrator:** Manages templates, account support, platform configuration, abuse reports, and aggregate operations.

**Finance/operations role:** Has narrowly scoped access to reconciliation and financial records, not unrestricted access to all invitation content by default.

## 3.2 Core host journey

1. Visit the landing page or template gallery.
2. Browse a real interactive demo on phone or desktop.
3. Create an account or authenticate.
4. Create an event and choose event type.
5. Pick a template and preview its actual opening animation.
6. Enter event information, location, timeline, and content.
7. Personalise photographs, colours, type, sections, envelope liner, seal, and motion preset.
8. Add guests individually, by CSV, or by paste/import flow with clear permission handling.
9. Configure RSVP questions and deadline.
10. Review the invitation as a guest, validate all information, and publish.
11. Share via copy link, native WhatsApp share/deep link, email, or enabled delivery integration.
12. Monitor views where privacy-respecting measurement is available, RSVPs, guest lists, and message states.
13. Send permitted reminders, export data, manage event-day check-in if enabled, and archive/delete the event according to retention choices.

## 3.3 Core guest journey

1. Receive a familiar, clear message from the host.
2. Open a stable invitation URL in the mobile browser.
3. See an appropriate loading state, then a closed envelope or a direct invitation if the host disabled the reveal.
4. Tap to open; the animation is coordinated, skippable, and can run silently.
5. Read event details and navigate through the page.
6. Open directions, add the date to a calendar, and inspect venue or schedule details.
7. RSVP for themselves and allowed household members, answer configured questions, and receive a confirmed submission state.
8. Optionally contribute using the displayed supported method or add a message/photo if enabled.
9. Reopen the invitation later to see current published details and, where allowed, update an RSVP.

## 3.4 Role and permission matrix

| Role | Primary permissions and restrictions |
|---|---|
| Guest | View a public invitation or a personalised invitation with a valid token; submit/update only the RSVP allowed for that invite; use permitted guest features. No host dashboard or access to other guests' private information. |
| Host | Manage their own events, designs, invitations, guests, RSVPs, settings, exports and enabled integrations. Financial actions are limited to the approved contribution model. |
| Co-host/planner | Access only explicitly assigned events/workspaces; permissions can be viewer, guest manager, editor or event manager. No default access to billing, payouts or unrelated events. |
| Support | Use narrowly scoped support tools, with audit trails for access or assisted changes. No silent impersonation or unrestricted access to financial details. |
| Template/messaging administrator | Manage template versions or messaging configuration only within the assigned operational role. Sensitive actions are logged and require appropriate access controls. |
| Finance/operations | Access reconciliation and financial records only as needed. Refund/payout overrides should have controlled approval and audit workflows. |
| Platform administrator | Manage platform configuration and users with MFA, least privilege, audit logging and documented break-glass procedures. |

Every server-side endpoint must enforce these permissions. Hiding a control in the UI is not authorisation.

---

# 4. Brand and visual identity

## 4.1 Name and positioning

Use **Kadi** as a provisional working name. Validate domain availability, business/name conflicts, cultural meaning in relevant regions, social handles, and trademark considerations before public launch.

Possible positioning line: **Invitations that feel like an occasion.**

Alternative supporting line: **Beautiful invitations. One link for every detail.**

The positioning should communicate more than card design: the invitation is a living guest experience with event details, RSVP, and practical event management.

## 4.2 Visual system

Proposed base palette (validate contrast in implementation):

| Token | Hex | Purpose |
|---|---|---|
| Brand purple | `#6B4EFF` | Primary actions and brand accents |
| Brand gold | `#F5B942` | Warm decorative accent; not small text on white |
| Wedding rose | `#E85D75` | Wedding template accent |
| Birthday coral | `#FF6B6B` | Birthday template accent |
| Memorial sage | `#7A8B7A` | Memorial template accent |
| Charcoal | `#1A1A2E` | Primary text |
| Slate | `#64748B` | Secondary text; verify contrast for small text |
| Mist | `#F1F5F9` | Neutral surfaces |
| White | `#FFFFFF` | Cards and page surfaces |
| Success | `#15803D` | Success state, contrast-tested |
| Warning | `#92400E` | Warning text, contrast-tested |
| Error | `#B91C1C` | Error text, contrast-tested |
| Info | `#1D4ED8` | Informational state, contrast-tested |

Use CSS variables/design tokens so brand and event accents can be changed without rewriting components. Do not assume that all initially proposed colors meet accessibility contrast requirements; test foreground/background combinations.

## 4.3 Typography

- Product/dashboard: Inter or a comparable readable sans serif with system fallbacks.
- Invitation headings: Playfair Display or a similar elegant serif where appropriate.
- Script typography: Great Vibes or a restrained alternative for limited decorative use; do not use script faces for long passages or essential details.
- Data IDs and technical codes: system monospace.
- Load only required weights and subsets. Provide fallbacks and ensure text remains legible while fonts load.

## 4.4 Logo and asset requirements

Create a cohesive logo family after name validation: horizontal wordmark, stacked mark, icon/favicon, monochrome variants, app icons, and social profile asset. The original three-diamond envelope idea is a concept, not a final approved logo. Create production SVG assets and a documented safe zone; do not use text or emoji as the production logo.

## 4.5 Tone and copy

Use warm, clear, respectful language. Use Kenyan cultural expressions naturally and only where appropriate. Avoid forcing Swahili phrases into every message. Use especially restrained, dignified copy for bereavement and sensitive family events. All UI copy should be centralised or otherwise maintainable for future localisation.

---

# 5. Information architecture and sitemap

## 5.1 Public routes

- `/` — landing page
- `/pricing` — plans and entitlements
- `/templates` — template gallery
- `/templates/[category]` — event-specific gallery
- `/templates/[templateId]` — template details and live demo
- `/how-it-works` — overview and sample experience
- `/faq` — frequently asked questions
- `/guides` — practical event-planning content, if content operations are funded
- `/about`, `/contact`, `/help`
- `/privacy`, `/terms`, `/cookies`, `/data-protection`
- `/status` — service availability, if reliable status monitoring is implemented
- `/login`, `/signup`, `/forgot-password`, `/verify`
- `/e/[slug]` — public event page where enabled
- `/e/[slug]/g/[token]` — personalised guest invitation
- `/unsubscribe/[token]` — communication preference/opt-out management

## 5.2 Host application routes

- `/app` — dashboard overview
- `/app/events` — event list
- `/app/events/new` — event wizard
- `/app/events/[eventId]` — event overview
- `/app/events/[eventId]/edit` — event details
- `/app/events/[eventId]/design` — invitation editor
- `/app/events/[eventId]/preview` — preview as guest
- `/app/events/[eventId]/guests` — guest and household management
- `/app/events/[eventId]/guests/import` — CSV/paste import
- `/app/events/[eventId]/rsvps` — response management
- `/app/events/[eventId]/messages` — message history, only for configured channels
- `/app/events/[eventId]/contributions` — contribution/payment activity if enabled
- `/app/events/[eventId]/check-in` — optional event-day check-in
- `/app/events/[eventId]/analytics` — event reports
- `/app/events/[eventId]/settings` — privacy, link, access, event status
- `/app/contacts` — reusable contact book, only with clear consent/permission rules
- `/app/templates/saved` — saved templates
- `/app/billing` — plan, usage, invoices
- `/app/settings/profile`, `/app/settings/security`, `/app/settings/notifications`
- `/app/settings/team` — planner/workspace team
- `/app/help`, `/app/feedback`

## 5.3 Internal administration routes

- `/admin` — operations overview
- `/admin/users`, `/admin/events`, `/admin/templates`
- `/admin/transactions`, `/admin/reconciliation`
- `/admin/messaging`, `/admin/webhooks`
- `/admin/support`, `/admin/abuse-reports`
- `/admin/privacy-requests`, `/admin/retention`
- `/admin/feature-flags`, `/admin/audit-log`, `/admin/system`

Admin routes require server-side role checks, MFA for privileged roles, narrow permission sets, and audit records for sensitive actions.

---

# 6. Public marketing site

## 6.1 Landing page

Recommended section order:
1. Hero statement, product screenshot or lightweight live invitation preview, and one clear CTA.
2. Short playable or clickable invitation demo that demonstrates the envelope and card emergence; do not force sound.
3. Template categories and sample cards.
4. How it works: create, personalise, share, manage replies.
5. Feature summary: animated invitations, RSVP, guest management, venue details, optional event communications.
6. Example use cases for wedding, birthday, memorial, baby shower, graduation, and custom events.
7. Plan/pricing teaser only when validated plans exist.
8. FAQ, trust/privacy explanation, help, footer links.

The landing page itself must load quickly. Do not load every animation asset above the fold. Use a lightweight poster or simplified preview until the user requests the demo.

## 6.2 Template gallery

Each template card should show a meaningful thumbnail and event type. Filters can include category, style, photo-based/illustrated, animation intensity, and free/premium status when plans exist. A template detail page should have a live demo with controls to restart, mute, skip, and switch to reduced-motion preview.

## 6.3 Pricing page

Do not hardcode unvalidated prices in product copy. Build an entitlement model that can express guest limits, event limits, template access, upload limits, custom branding, message quotas, RSVP features, retention window, and team access. Prices, quotas, and provider fees must be editable through controlled configuration and reflected consistently at checkout and in the dashboard.

---

# 7. Authentication and onboarding

## 7.1 Authentication strategy

Choose one primary authentication provider and session model. Do not implement password handling, OAuth, email magic links, and phone OTP as parallel systems unless there is a real requirement and a tested design. A managed identity provider is preferred for a first release.

Possible methods, once configured: email/password or email magic link, phone OTP using a supported Kenyan SMS delivery route, and Google OAuth. Do not promise all methods in the UI before credentials and callbacks are configured. Keep the host identity model provider-neutral so the authentication provider can change without losing host-owned records.

## 7.2 Sign-up journey

1. Welcome page with a clear explanation and supported sign-up methods.
2. Collect only data required for account setup.
3. Verify the selected method with an expiring, single-use code or link.
4. Name/profile step; email can remain optional if the selected setup supports it.
5. Ask what event type the user is planning as an optional personalisation question.
6. Offer create first event, or browse a template first.
7. Show a useful first-run checklist in the dashboard without forcing every task.

## 7.3 Login, recovery, and sessions

- Provide clear login recovery.
- Make OTP and magic links single-use with expiry, attempt throttling, and abuse controls.
- Avoid disclosing whether a particular email/phone belongs to an account in a way that enables enumeration.
- Use secure server-managed sessions/cookies. Do not store long-lived access tokens in browser local storage.
- Support logout from the current session and revoke sessions where the selected identity system permits.
- Add MFA for platform staff and administrators; offer extra protection to hosts where practical.

## 7.4 Profile and preferences

Maintain display name, verified login identifiers, timezone, preferred language, notification preferences, privacy settings, security activity, and account deletion/export requests. Do not request an address or demographic details without a product need.

---

# 8. Host workspace and dashboard

## 8.1 Dashboard home

Show the host's upcoming events, drafts, recent activity, key RSVP totals, and a clear create-event action. Display financial totals only when the underlying payment data are confirmed and reconcile correctly. Do not make fabricated sample numbers look like live data in production.

Required states:
- Initial loading skeletons.
- No events: explain the next step and offer create/browse actions.
- Draft events: show draft status and resume action.
- Upcoming events: show date/time, venue, confirmed/pending counts and quick action.
- Past events: archive, export, or duplicate actions.
- Load failure with retry and support route.

## 8.2 Event overview

Header includes title, date/time with timezone context, venue, event status and sensible actions: edit, preview, share, more. Use a responsive tab structure: Overview, Guests, RSVPs, Design, Messages (when enabled), Contributions (when enabled), Check-in (when enabled), Analytics, Settings.

Overview includes RSVP summary, guest response status, recent changes, invitation publication status, link health, and key action shortcuts. Recent activity should be based on real audit/events, not mock data.

## 8.3 Guest management screen

Provide search, filter, sort, paging/virtualisation where needed, group selection, bulk selection and responsive mobile cards/table. Show household display name, contact channels, attendee count, RSVP status, invitation status, message permissions where relevant, and last update. Bulk actions require a confirmation and preview for sends or removals.

## 8.4 Settings

Settings include event visibility, invitation link, guest access token management, RSVP deadline, attendance capacity, event cancellation, data exports, privacy and sharing settings, design defaults, contact and support, archive, and delete. High-impact actions must explain consequences and request confirmation.

---

# 9. Event creation and publishing wizard

Use a short stepper with saved progress and a clear review step. Do not create a rigid eight-page obstacle where a host must fill optional fields.

## Step 1 — Event type

Wedding, birthday, memorial/funeral, baby shower, graduation, anniversary, corporate, community, and custom event. Event type controls template recommendations and sensible default sections, not an inflexible data model.

## Step 2 — Select design

Show meaningful previews and allow a live demo before the user commits. Filters should be useful and limited. Explain premium restrictions only if the pricing model exists.

## Step 3 — Event details

Fields include title, host/organiser name, event date, start/end time, timezone, venue, address, map link or coordinates if supported, description, dress code and event contact/help instructions where appropriate. Date/time validation must use event timezone and support time ranges; memorial services may use different event-specific fields. Venue need not be mandatory for a virtual or online event.

## Step 4 — Design and story

Personalise typography, palettes, envelope/liner/seal, background artwork, hero photo, gallery, animations, visible sections, copy, and optional audio. Show an actual guest-side live preview. Include photo cropping and focal-point selection.

## Step 5 — Guests

Add guests manually, import CSV, or paste selected contact data. Show which columns map to the app's fields and preview records before committing. Contact-book access must be explicit and limited. Allow the host to skip guest entry until later.

## Step 6 — RSVP setup

Enable attendance responses, allowed guests/plus-ones, custom questions, meal choices, dietary restrictions, message-to-host, deadline, and post-deadline behaviour. Explain how each option affects guest questions and reporting.

## Step 7 — Optional extras

Calendar support, directions, guest photo contributions, memorial condolences/candles, host payment instructions or approved contribution provider, reminder settings, and music. Each can be skipped and revisited. Only show a managed payment/payout switch if the required production provider is configured and compliance gates are cleared.

## Step 8 — Review, test and publish

Show a summary of title, date/time/timezone, venue, template, enabled sections, guest count and RSVP deadline. Run validation and broken-media checks. Offer desktop/mobile preview and sample guest preview. Publishing creates or updates a stable slug and publishes a versioned configuration. Explain that the link reflects future edits unless the event is archived or the link revoked.

## Draft behaviour

- Save drafts on explicit save and/or autosave with conflict handling.
- Show `Saving`, `Saved`, and `Couldn't save` states honestly.
- Preserve unsaved work locally where suitable, but never report it as server-saved.
- Support duplicate event as a new draft, with no inherited guest personal tokens, responses, payment data, or consent records.

---

# 10. Invitation renderer and animation system

This is the core differentiator and must receive dedicated design, implementation and test time.

## 10.1 Golden guest journey

1. Guest opens a canonical link on a phone browser.
2. The system resolves the published event and, if present, validates the guest token.
3. A lightweight envelope scene appears, personalised with guest/event details.
4. Guest deliberately taps the seal/envelope to begin. Sound may start only after user interaction and must remain optional.
5. Seal responds; envelope flap rotates around a convincing hinge using appropriate perspective.
6. Inner liner appears; invitation card rises from inside the envelope with layered paper, tilt, and soft shadow.
7. The card expands/settles into the hero view. Names, date and hero photo reveal in a designed sequence.
8. Normal scrolling then exposes the invitation's selected sections with subtle in-view effects.
9. Guest can skip or replay the intro, navigate, open images, view directions, and submit an RSVP at any point after the essential content is available.

The card must visibly emerge from the envelope. A basic fade between two screens is not a substitute for the signature interaction.

## 10.2 Animation layers

Treat these as distinct layers/assets: envelope body, flap, inner liner, seal, card front/back, paper shadow, decorative artwork, text groups, hero media, and transition into the page. Prefer CSS/SVG for simple vectors and transforms. Use Rive or another specialised asset for complex art only if the asset is justified and can be maintained. Use one main timeline for the envelope sequence. Do not let multiple animation libraries compete for control of the same DOM nodes.

## 10.3 Animation presets

- **Classic stationery:** restrained paper motion, seal, liner, serif type, soft shadow.
- **Floral romance:** flowers/leaves and romantic photography with restrained petal motion.
- **Cinematic photo reveal:** one to four selected photos with Ken Burns, blur-to-sharp, circle reveal, clip reveal or gentle fade.
- **Modern editorial:** crisp card movement, bold typography and asymmetric photo composition.
- **Playful birthday:** faster but controlled motion, colour and optional confetti after opening.
- **Baby shower:** soft illustration or pastel photography with low-intensity decorative motion.
- **Graduation:** photo-driven opening, date/venue clarity and optional programme.
- **Memorial:** slow fades, calm imagery, dignified text, no celebratory effects.
- **Corporate/community:** brand-forward, fast access to date, venue, programme and RSVP.

These are editable presets. Use event type for recommended defaults, but let hosts select a different appropriate preset.

## 10.4 Photo and gallery motion

Support uploaded images, responsive crop variants, focal point, captions/alt text, slow pan/zoom, crossfade, circle/clip masks, sequence ordering, and an accessible full-screen gallery. Do not apply every effect to every image. Allow a reduced-motion mode and respect `prefers-reduced-motion`.

## 10.5 Music and audio

Audio is optional. Never promise audible autoplay. Start only after a user gesture where required by browser behaviour. Provide visible mute/play controls; keep the invitation readable when silent. The host must have rights to uploaded audio or use properly licensed tracks. Add upload limits and validate content type/size. Do not bundle unlicensed commercial music in templates.

## 10.6 Replay, skip and state

Offer replay from a discrete control. A guest should never have to replay the full envelope to view details. Avoid replaying automatically on every navigation. The opening state should not be coupled to RSVP state. Reopening the same link must not create a new response or message event.

## 10.7 Template configuration example

```json
{
  "id": "wedding-classic-stationery",
  "version": 1,
  "category": "wedding",
  "layout": "envelope-story",
  "theme": {
    "primary": "#6B4EFF",
    "accent": "#F5B942",
    "background": "#FFF9F3",
    "text": "#1A1A2E",
    "headingFont": "Playfair Display",
    "bodyFont": "Inter"
  },
  "opening": {
    "enabled": true,
    "preset": "classic-stationery",
    "allowSkip": true,
    "allowReplay": true,
    "musicAssetId": null,
    "layers": ["envelope", "flap", "liner", "seal", "card", "hero"]
  },
  "sections": [
    { "type": "hero", "visible": true, "required": true },
    { "type": "welcome", "visible": true, "required": true },
    { "type": "story", "visible": false, "required": false },
    { "type": "schedule", "visible": true, "required": false },
    { "type": "venue", "visible": true, "required": false },
    { "type": "gallery", "visible": true, "required": false },
    { "type": "rsvp", "visible": true, "required": true },
    { "type": "faq", "visible": false, "required": false }
  ]
}
```

This is illustrative, not the complete schema. Validate configuration at save and render time. Keep template definitions versioned so old published events do not break when a template changes.

---

# 11. Template engine and design editor

## 11.1 Template library

Initial categories and concepts:

- Wedding: classic stationery, modern minimal, floral, rustic, royal gold, garden, coastal, illustrated/storybook, dark and moody, African-inspired designs created respectfully and not as caricatures.
- Birthday: elegant milestone, children, playful confetti, neon, retro, photo-forward, tropical.
- Memorial/funeral: serene garden, candlelight, scripture-enabled, classic, understated, family-photo-led.
- Baby shower: neutral, floral, pastel, safari illustration, modern.
- Graduation: academic, modern, portrait-focused, school-colour palette.
- Anniversary: classic, gold/silver milestone, floral, contemporary.
- Corporate/community: professional, brand-led, conference/session, fundraising/community gathering.
- Custom: sections selected from the common section catalogue.

Every style needs a thumbnail, demo, metadata, accessibility description, usage rights record for its assets, and supported renderer version.

## 11.2 Editor layout

Desktop: preview plus grouped controls for content, style, media, motion and page sections. Mobile: preview and controls in an appropriate tab/drawer flow, not a permanently split screen.

Features:
- Real-time or debounced preview.
- Colour palettes and accessible contrast warnings.
- Type/font selection within approved sets.
- Image upload, crop, focal point, ordering, alt text and replace/remove.
- Envelope liner/seal options and supported opening preset.
- Background and decorative assets.
- Section ordering and visibility toggles.
- Content editing for each section.
- Undo/redo if feasible without corrupting server state.
- Autosave with revision indicator.
- Preview as mobile, desktop, and a sample personalised guest.
- Reset current section/design with confirmation.
- Versioned draft and publish workflow.

A fully arbitrary drag-and-drop builder is not required initially. A structured editor is more robust, easier to test and more consistent across phones.

## 11.3 Media safety and quality

Validate MIME type and actual file content; enforce size, dimensions, and count limits; create optimised derivatives; store origin/processing metadata; scan uploads where suitable; avoid exposing untrusted HTML/SVG as raw executable content; support deletion and retention; provide fallback images. Respect users' rights to upload and publish images/audio.

---

# 12. Event-type experiences

Use a shared renderer and event-section catalogue. Event type changes defaults, copy, template suggestions and optional sections; it should not create a separate unrelated application for every event type.

## 12.1 Wedding

Potential sections: envelope, couple names, hero photo, welcome, story/timeline, countdown, ceremony, reception, programme, venue/map/directions, dress code, accommodation/travel, gift registry or contribution instructions, photo gallery, FAQs, RSVP, meal preference, dietary restrictions, song request, message to the couple.

Support one RSVP per household where appropriate and separate attendance/meal choices for each named attendee. Permit hosts to disable any section that is irrelevant.

## 12.2 Birthday

Potential sections: name/age or milestone, hero images, location, date/time, dress code/theme, schedule/activities, age-appropriate guardian details, RSVP, plus-ones/children, gift guidance, optional gallery. Avoid publishing a child's sensitive details publicly by default.

## 12.3 Memorial/funeral

Potential sections: deceased person's name, dignified photograph, dates, service details, burial/commemoration schedule, venue/directions, family-approved obituary or tribute, condolences, memorial candles where appropriate, RSVP/attendance count, transport/help details, donation/contribution instructions if lawful and configured.

Privacy and moderation are essential: hosts control visibility; condolences can be reviewed before public display; hosts can remove harmful content; candle interactions must not expose guest data unnecessarily. Never apply party confetti or playful animation.

## 12.4 Baby shower

Potential sections: parents/family names, date/venue, theme, registry/gift guidance, RSVP, dietary needs, optional photos. Children's data protections apply where details identify a child.

## 12.5 Graduation

Potential sections: graduate name, institution/course, ceremony/party schedule, venue/directions, dress code, photographs, RSVP, plus-ones, accessibility/travel notes.

## 12.6 Anniversary

Potential sections: names/milestone, story/gallery, date/venue, programme, RSVP, contribution/gift options.

## 12.7 Corporate, community and custom events

Support organisation/brand, agenda, session/time blocks, location or virtual link, registration questions, attendee capacity, ticket/information links if enabled, accessibility and contact details. For paid ticketing, make a separate business/payment scope decision rather than silently turning contribution tooling into a ticketing system.

---

# 13. Guest and household management

## 13.1 Correct data model

A household/invitation group is not the same as a person. Model:
- **Guest household/invitation:** label, access token, contact routing, group, plus-one policy, invitation delivery status and household-level RSVP status if applicable.
- **Attendee/person:** display name and person-level attendance, meal, dietary details and allowed guest/plus-one status.
- **RSVP submission:** a versioned submission from a household token or guest flow.

This supports individuals, couples, families and plus-ones without inventing `meal_1`, `meal_2`, `partner_1`, `partner_2` columns for every possible family shape.

## 13.2 Guest creation

Fields may include display label, attendee names, phone, email, group, plus-one allowance, personal note, communication permissions/status, invitation access token, delivery status and host-defined internal notes. Collect only fields that are needed. Show phone numbers in a Kenyan-friendly format but normalise them internally to E.164 where valid.

## 13.3 Duplicate detection

Warn on likely duplicates using event-scoped normalised phone/email and host confirmation. Do not silently merge people based on a name alone. A single phone may be shared by a household; allow a host to resolve duplicate warnings deliberately.

## 13.4 Groups and bulk actions

Support family, friends, colleagues, church/community, VIP or custom groups. Group labels are host-defined, not a fixed enum. Bulk actions include add/remove group, export, invitation status checks, and permitted reminder actions. Destructive/broadcast actions require a summary and confirmation.

## 13.5 CSV and paste import

Flow: upload/paste, map columns, preview rows, validate all records, show duplicates/errors, import valid rows, provide result summary and downloadable error report. Support cancel/retry safely. Use chunked/background jobs for large imports and idempotent import batches. Do not send messages automatically as a side effect of importing guests.

## 13.6 Guest access tokens

Use high-entropy random tokens, store token hashes where practical, support expiry/revocation and reissue, rate-limit lookups, avoid sequential IDs, and prevent cross-event token use. A token grants only the capabilities intended for that invited household. Do not expose the token to analytics or logs. Treat copied links as transferable unless a stronger recipient verification flow is actually added.

---

# 14. RSVP engine

## 14.1 Supported response capabilities

- Accept/decline/maybe when enabled.
- Number of attending people limited by host's invite and plus-one allowance.
- Individual attendee names and responses where configured.
- Meal selections per attendee.
- Dietary restriction free text or structured options.
- Children count/attendance if enabled and appropriate.
- Custom text, single-select, multi-select, checkbox, and date/number question types as supported.
- Message to host, song request, or other event-specific questions.
- RSVP deadline, closed RSVP state, waitlist/capacity policy if added later.
- Host override/manual correction with audit trail.
- Optional edit response link with access control and revision history.

## 14.2 Question design

Each question has ID, event ID, prompt, type, options, required flag, validation, display order, visibility logic if supported, and data retention class. Answers need a proper foreign key to the question and a stable response/submission ID. Do not store every answer only as one unvalidated text field.

## 14.3 Submission behaviour

- Validate on client and server.
- Use a submission/idempotency key to avoid duplicates from double taps or retries.
- Show a pending state during submission.
- Only show success after the server confirms persistence.
- If the response is accepted but network acknowledgement is lost, safely query current state instead of blindly making a second record.
- Enforce event close/deadline rules on the server using the event timezone.
- Keep a clear confirmation screen and optional confirmation email only when a contact address and permitted notification are available.

## 14.4 Host RSVP dashboard

Show invitation/household counts and attendee counts separately. Breakdown confirmed, declined, maybe, pending, attendees, plus-ones, meals, dietary restrictions, and custom answers. Filters and exports need to respect privacy and include timestamps where useful. Do not mislabel delivered/read/open as RSVP conversion.

## 14.5 Exports

CSV export with stable headers, dates/timezone, one row per person or household according to the selected export mode, and clear handling of multiple attendees. Protect exports against public exposure and optionally audit the export.

---

# 15. Sharing, WhatsApp, email, and SMS

## 15.1 Start with user-controlled sharing

First release should support copy link, native share sheet where available, and a WhatsApp share/deep link that opens the host's own WhatsApp app with a prepared message. The host chooses the recipient and sends the message. This provides the core Kenyan sharing workflow without requiring the platform to run a business messaging account on day one.

## 15.2 WhatsApp Business Platform integration

Automated sending is an optional integration and a later release gate. Implement only after the business account, phone number, templates, permissions, provider configuration and cost model are validated.

Requirements:
- Record opt-in/permission with purpose, source, time and current status.
- Do not equate a guest phone number imported by a host with an automatic opt-in to platform-originated business messages.
- Use approved templates where required by Meta's current policy and message window rules.
- Categorise message templates based on actual content and policy, not by a hardcoded event type.
- Maintain a suppression list and honour opt-out before queued sends are dispatched.
- Provide delivery status mapping: queued, submitted/sent, delivered, read if reported, failed, suppressed, unknown.
- Process provider webhooks idempotently and preserve external message IDs.
- Retry transient failures with exponential backoff and jitter; do not retry permanent rejection or recipient opt-out.
- Apply event/host quotas and cost limits, and show the host the send count and any estimated charge before a campaign.
- Message content must be editable through versioned templates; variables must be escaped and missing variables handled.
- Measure delivery only when confirmed by provider data; treat open tracking as uncertain and privacy-sensitive.

Pricing and category rates change. Do not hardcode an assumed per-message price; maintain a dated configuration or obtain the current live rate before pricing the product.

## 15.3 Message types

Examples of potential message categories, subject to policy approval:
- Invitation notice with the link.
- Event details changed notice.
- RSVP reminder.
- Event-day logistics update.
- Cancellation/postponement notice.
- Thank-you message.

Do not claim these are pre-approved templates until the provider approves the exact templates.

## 15.4 Email

Optional email sender for account verification, host security notices, billing documents, guest confirmations, and event communications when configured. Implement domain authentication (SPF/DKIM/DMARC as appropriate), bounce handling, suppression, and distinct transactional/marketing preference logic. Never expose other guest addresses in group sends.

## 15.5 SMS

An optional fallback provider such as a suitable Kenyan SMS service may be integrated after pricing and sender registration are confirmed. Use SMS for defined fallback cases, not as an uncontrolled duplicate of every WhatsApp message. Respect applicable consent and opt-out rules and track delivery status separately.

---

# 16. M-Pesa and contribution architecture

This section is a decision framework, not a claim that Kadi has legal permission to collect or transfer funds.

## 16.1 Safest early model

Initially, Kadi can let a host display their own verified contribution instructions or a supported direct-to-host flow once the exact provider account setup is confirmed. Kadi should not custody funds, pool balances, promise automated payouts, or represent itself as a payment intermediary without written provider guidance and appropriate legal/regulatory review.

## 16.2 Future integration models

**Model A — Direct to host:** Funds go to the host's approved account and Kadi stores only the minimum status or reference data permitted and required. Confirm how transaction verification will be obtained before claiming a contribution is confirmed.

**Model B — Provider-backed collection and payouts:** Kadi uses a contractually approved collection and disbursement arrangement. Requires due diligence, production credentials, account/shortcode capability, reconciliation, support, fee and reversal handling, fraud controls, and advice on applicable payment-service obligations.

Do not silently choose Model B just because an STK Push API is available.

## 16.3 Payment state machine

Use explicit states such as `created`, `requesting`, `pending_provider`, `succeeded`, `failed`, `cancelled`, `timed_out_unknown`, `reversed`, and `reconciliation_required`. Keep provider status separate from user-facing display state. Valid transitions must be defined and tested.

## 16.4 Payment flow

1. Guest selects a contribution option and confirms amount/recipient details.
2. Server creates a payment attempt and idempotency key.
3. Server initiates the supported provider request; secret credentials stay server-side.
4. Guest sees a pending/check-phone state and may leave the page without losing status.
5. Provider callback/webhook is validated according to provider-supported mechanisms and deduplicated.
6. Server validates relevant receipt, amount, currency, shortcode/account, request identifiers and event relationship.
7. Contribution is recorded only after trustworthy confirmation; ambiguous states remain pending/unknown.
8. Reconciliation process checks unresolved transactions and handles reversals/disputes.
9. Host dashboard reflects a ledger-derived total, never a client-supplied number.

## 16.5 Reconciliation and payouts

If managed payouts are approved later, use separate contribution/transaction/payout tables and an append-only financial event history. Do not delete completed transaction records when an event is deleted. Add staff audit, dual approval for high-impact operations where appropriate, payout destination confirmation, limits, status polling/callbacks, idempotency, reversal/refund procedures, and a reconciliation queue. Never promise instant or 24-hour payout until the provider contract supports it.

## 16.6 Fees and display

Disclose fees and net receipt where applicable. Store money in integer minor units or a carefully defined decimal strategy; for KES, use an explicit precision rule and never use binary floating-point for accounting. Store currency explicitly. Separate gross collections, provider fees, Kadi fees, refunds/reversals and net settlement.

---

# 17. Subscriptions, plans, and billing

## 17.1 Business model hypothesis

Potential revenue models to validate:
- One-time fee per published event.
- Free basic invitations with paid premium designs/features.
- Host subscription for frequent event creators/planners.
- Business/planner plans for teams and higher event volume.
- Separately billed optional message delivery where provider charges apply.

Do not implement all simultaneously without research. Test willingness to pay and cost-to-serve first.

## 17.2 Entitlement model

Possible entitlements: number of draft/published events, guest count, template access, custom branding, photo/video storage, opening animation presets, gallery uploads, custom sections, message quota, data-retention duration, collaboration seats, exports, and support level. Entitlements must be centrally enforced on the server and clearly explained in the UI.

## 17.3 Billing features

- Checkout and payment confirmation.
- Invoice/receipt history.
- Active/past-due/cancelled/expired state.
- Renewal or event purchase state.
- Refund/cancellation policy surfaced before purchase.
- Grace period and feature downgrade rules.
- No deletion of user content without warning and retention rules.
- Idempotent subscription payment callbacks.

## 17.4 Provider decision

Evaluate providers for availability to a Kenyan business, supported merchant setup, recurring billing ability if needed, M-Pesa/card support, fees, refunds, support, settlement and tax/reporting. Do not assume a global card processor supports every feature for a Kenya-based account. Use an adapter boundary so the billing provider can be changed without rewriting event logic.

---

# 18. Notifications and background jobs

## 18.1 In-app notifications

Show notifications for RSVP changes, event publication, failed imports, failed delivery, payment reconciliation issues, plan limits and security events as appropriate. Notifications should link to the relevant page and include read/unread state.

## 18.2 Background job system

Use a durable background job service for tasks that can exceed a request lifetime or need retrying: CSV imports, media processing, scheduled reminders, bulk messaging, email, exports, PDF generation if offered, scheduled deletion/retention, webhooks and reconciliation.

Each job should have a type, owner/resource IDs, state, attempts, next run time, progress where useful, error classification, idempotency key and timestamps. Store minimal payloads and avoid retaining sensitive contact data unnecessarily in job logs.

## 18.3 Retry policy

Transient timeouts and rate limits may be retried with backoff and jitter. Do not retry invalid recipients, rejected templates, authentication failures, opt-outs, or permanent validation errors blindly. Dead-letter failures need a support/admin view.

## 18.4 Scheduled reminders

Schedule relative to the event and RSVP deadline using the event timezone. Before dispatch, re-check event status, guest eligibility, consent/suppression, changed venue/date, and whether a prior reminder was already sent. Cancelling or editing an event must update/cancel outstanding jobs.

## 18.5 Notification preferences

Separate account/security notices, event operational messages, marketing, and guest communication permissions. A marketing opt-out must not disable legally necessary security communications, but the distinction must be explained clearly.

---

# 19. Administration and customer support

## 19.1 Operations dashboard

Show aggregate signups, event creation, active events, queued jobs, failed jobs, service status, messaging status and unresolved reconciliation count. Production admin screens must not display fake uptime, fake user counts or sample transactions as live data.

## 19.2 User and event tools

Search users/events using permitted fields, suspend abusive accounts, inspect event status, review a reported item, resend a verification only through safe workflows, and process account export/deletion requests. Support staff must not be able to quietly impersonate hosts or view sensitive data without audit.

## 19.3 Template management

Create/edit/retire templates with versioning, asset-rights metadata, category, supported renderer version, premium/entitlement, preview URL and test status. Do not alter a published template in a way that breaks previously published events; use version pins or explicit migration.

## 19.4 Messaging/payment operations

Provide queue health, provider outage indicator, webhook failures, retry options, template status, reconciliation queues and cost limits. Manual retries must be idempotent and respect opt-outs. Financial operations should require least privilege and an audit trail.

## 19.5 Audit logging

Audit security-sensitive actions: login/security setting changes, event publication/deletion, bulk sends, exports, admin access, permissions changes, payment state overrides, refunds/payout approvals, data export/deletion requests and retention actions. Do not log raw passwords, OTPs, tokens, full payment secrets or unnecessary message content.

## 19.6 Support tools

Support request categories: account access, event editing, invitation/link problems, guest/RSVP issue, message issue, payment issue, privacy request and abuse report. Provide clear status, owner, timestamps and safe attachment handling. Keep internal notes separate from user-visible replies.

---

# 20. Analytics and reporting

## 20.1 Host analytics

- Invitations created/published.
- Guest households and individual attendees.
- Invitation link visits, only where measurement is privacy-respecting and appropriately disclosed.
- RSVP counts and response trend.
- Meal/dietary preference summaries.
- Message status where a provider reports it.
- Contribution summary only from confirmed/reconciled financial data.
- Time-to-response and response rates with transparent denominators.

## 20.2 Platform analytics

- Funnel: landing -> template preview -> signup -> event draft -> publish -> first share -> first RSVP.
- Activation and repeat event creation.
- Template usage.
- Feature adoption.
- Support rate and error rate.
- Cost per event and cost per successfully delivered message.
- Churn/renewal only when recurring plans exist.
- Infrastructure and provider reliability.

## 20.3 Analytics rules

- Do not store access tokens in analytics events.
- Prefer aggregate metrics and short retention for granular events.
- Avoid sensitive or intrusive tracking on memorials/funerals.
- A page view does not necessarily prove a particular guest opened or read a message.
- Provide a documented event taxonomy and data-retention policy.
- Separate product analytics from the authoritative transaction ledger.

---

# 21. Loading, empty, error, and success states

Every primary screen and action needs a complete set of states. Use consistent patterns, but choose the pattern that fits the task.

## 21.1 Loading

- Dashboard: skeleton for known card/list structure.
- Template gallery: skeleton cards with stable layout.
- Invitation: lightweight envelope/hero placeholder that preserves layout; no infinite preloader.
- Save/publish: explicit in-progress state and disabled duplicate action.
- CSV import: stages for upload, parsing, mapping, validating, importing, partial failure and success.
- Background sends/exports: persistent progress page or job row that remains available after navigation.
- M-Pesa: pending/check-phone state; never report completion before confirmed status.

## 21.2 Empty states

- No events: create first event or browse demos.
- No guests: add manually, import, paste, or skip.
- No RSVPs: state that responses will appear when guests reply.
- No messages: explain that native sharing does not create provider delivery history.
- No contributions: show configuration prerequisites and explain any unsupported feature.
- No photos/condolences/candles: explain the guest-facing feature if enabled.
- No analytics: explain which activity creates the metric.

## 21.3 Errors

Cover network offline, slow connection, request timeout, server errors, validation, permission denied, session expired, import partial failure, file rejection, upload failure, message rate limit, template rejection, provider outage, duplicate callback, ambiguous payment, failed payout, export failure, subscription/billing error, and revoked/expired invitation token.

Errors must identify what happened, whether data was saved, what can be safely retried, and how to recover. Never say “our team has been notified” unless an alert or support ticket was actually created.

## 21.4 Success states

Examples: account verified, event draft saved, event published, guest list imported, RSVP received, message accepted by provider, delivery confirmed, contribution confirmed, export ready, and account deletion request recorded. Keep “submitted,” “delivered,” and “completed/settled” distinct.

## 21.5 Micro-interactions

Use appropriate button feedback, form validation, card hover/focus, save status, gallery transitions and section reveal. Keep motion purposeful. Provide focus indicators and do not use colour alone to convey state.

---

# 22. Accessibility and inclusive design

Target WCAG 2.2 AA as a design/test goal, and assess applicable Kenyan legal accessibility duties before launch. Legal compliance requires local review and is not proven merely by meeting a checklist.

Requirements:
- Semantic headings and landmarks.
- Full keyboard support and visible focus.
- Accessible names and correct labels for forms/controls.
- Proper field-level validation and error association.
- Sufficient contrast for text and controls.
- Touch targets sized for mobile use.
- Text resize/reflow without loss of functionality.
- Screen-reader announcements for loading, errors, RSVP submission and state changes.
- Alt text/captions for meaningful images; decorative images marked appropriately.
- No essential information hidden behind animation, hover, sound or colour alone.
- Reduced-motion mode for envelope, scroll, decorative elements and transitions.
- Sound off by default until user interaction; no audio-only information.
- Memorial/funeral templates with calm animation and readable contrast.
- Test with keyboard, at least one screen reader, reduced motion and smaller screens.

---

# 23. PWA, offline behaviour, and performance

## 23.1 PWA scope

An installable PWA may include a web manifest, icons, theme colour, service worker, cache strategy and optional web push. PWA installation and push support vary by browser/platform; never promise universal support.

## 23.2 Cache strategy

- Versioned static assets: cache-first with safe update strategy.
- Public published invitation data: cautious network-first with cache fallback only if access/privacy policy allows it.
- Personalised/private guest data: do not put into broad public caches; carefully assess cache keys and purge/revocation.
- API mutations: network-first. Do not silently replay an RSVP or financial transaction without an explicit idempotent sync flow.
- Fonts and decorative assets: cache with versioning.

## 23.3 Offline behaviour

Guests may view a clearly labelled cached invitation when safe and previously available. An offline RSVP may be kept as an explicitly pending local draft only if the product intentionally supports it; do not display final confirmation before server acceptance. Do not queue payments offline. Explain that current event details may have changed since cache time.

## 23.4 Performance goals

Aim for good Core Web Vitals on representative mid-range mobile hardware and realistic Kenyan network conditions. Prioritise server-rendered essential content, responsive optimised images, font strategy, reduced JavaScript, lazy-loaded galleries, and staged animation assets. Use objective lab and field metrics instead of relying on subjective claims that a page feels fast.

Do not load full-resolution photos, animation runtimes, music, analytics and all below-the-fold sections before the guest can see the initial invitation. Measure the published invitation independently from the authenticated dashboard.

---

# 24. Privacy and Kenya legal/compliance workstream

This is a product and engineering checklist, not legal advice. Before production, obtain advice suited to the actual business model and verify the current statutes, regulations, ODPC guidance and provider agreements.

## 24.1 Data inventory

Potential data categories:
- Host account and security data.
- Guest names and communication details.
- Household relationships and attendee lists.
- RSVP attendance, food preferences and free-text answers.
- Event location and schedule.
- Images, audio and captions.
- Condolence/tribute content and memorial interaction records.
- Communication consent, send history and suppression status.
- Payment references and accounting records if enabled.
- Support records, audit records and technical diagnostics.

For each category document purpose, legal basis, data controller/processor roles, access, provider sharing, storage location, retention, deletion/anonymisation, data subject rights and whether cross-border processing occurs.

## 24.2 Core privacy controls

- Purpose limitation and data minimisation.
- Valid lawful basis for each purpose; do not use a single generic checkbox for everything.
- Clear privacy notice in language the host/guest can understand.
- Consent records where consent is the chosen basis and an easy revocation path where applicable.
- Separate communication marketing/operational choices where needed.
- Access, correction, deletion, objection and other applicable data-subject request workflows.
- Processors and sub-processors documented by purpose and data flow.
- Data retention schedule based on purpose and legal obligations, not a blanket delete date applied to all records.
- Cross-border transfer assessment and appropriate safeguards.
- Incident response, harm assessment, internal escalation and notifications within applicable legal timelines.
- Privacy review for major new features such as public galleries, guest photo uploads, analytics, child profiles, and contribution/payout tools.

## 24.3 Children's personal data

Birthday and baby-related features can process information about children. Minimise public identifiers, images and location details. Determine the applicable parental/guardian consent and child-protection requirements under the Data Protection Act and related rules. Provide default privacy settings and a removal workflow.

## 24.4 ODPC registration and accountable owner

Assess controller/processor status and registration obligations against the current ODPC rules and the actual business activities. ODPC guidance describes threshold-based exemptions and exceptions; do not assume all small operators are exempt. Determine whether a formal Data Protection Officer is legally required; name an accountable privacy contact regardless.

## 24.5 Retention schedule

Define separate periods for active event data, guest phone/email, access tokens, uploaded photos/audio, messages, consent/suppression records, support data, security logs, financial transaction records and invoices. Preserve records required for lawful accounting, disputes or legal duties while deleting or anonymising unrelated personal information when no longer needed. Make retention rules configurable and auditable.

## 24.6 Cookies and analytics

Document essential vs non-essential cookies/trackers. Obtain the necessary choices/consent before non-essential tracking where required. Make consent choices reversible. Do not load analytics before the product's cookie/privacy decision has been implemented.

## 24.7 Payment and messaging caveats

Do not claim PCI DSS compliance simply because Safaricom or a payment provider is involved. Establish the actual card-data scope if card payment is later added. Verify M-Pesa provider accounts and applicable payment-services requirements before custody/payout. Follow the current WhatsApp Business terms, opt-in rules, template approval and rate card.

## 24.8 Legal documents

Before launch, prepare and review:
- Privacy notice.
- Terms of service and acceptable-use rules.
- Cookie notice/settings where relevant.
- Host responsibilities for guest contact details, uploaded media and event information.
- Guest communication consent/privacy language.
- Refund/cancellation policy for the chosen business model.
- Data processing agreements with relevant processors.
- Retention and deletion policy.
- Security/incident response plan.
- Complaint, content moderation and abuse reporting process.

---

# 25. Security and abuse prevention

## 25.1 Authentication and session security

Use a maintained provider for identity where possible. Require secure cookies, CSRF protections where applicable, short-lived/rotatable sessions, rate-limited OTP, brute-force protections, secure reset flow, account enumeration resistance and MFA for admins. Store secrets server-side and never expose them in the client bundle.

## 25.2 Authorisation and tenant isolation

Every event, guest, RSVP, export, message, photo, payment, team and admin request must validate both role and ownership/assignment. Use database constraints and, where supported, row-level security as additional defence. Test cross-tenant access directly.

## 25.3 Input and file protection

Validate all input server-side, normalise identifiers, escape output, protect against SQL injection/XSS/CSRF/SSRF, restrict outbound fetches, validate uploads by content, enforce maximum sizes/dimensions, protect SVG/HTML, and rate-limit public endpoints. Use secure rendering for custom section content; do not execute arbitrary host-supplied HTML/JS.

## 25.4 Public link protections

- High entropy invitation tokens and safe storage.
- Optional expiry and revocation.
- Rate limits and abuse detection.
- Avoid tokens in analytics, referrer URLs and logs.
- Use conservative referrer policy and avoid third-party scripts on token-bearing routes where possible.
- Provide host-facing link rotation/revocation where supported.

## 25.5 Payment security

Use server-side credentials, provider-supported callback verification, strict amount/currency/reference checks, idempotency, reconciliation and an append-only record of state changes. Do not trust a success URL or client message as proof of payment. Use separate access roles for finance functions.

## 25.6 Admin and audit protection

MFA, least privilege, restricted production access, audit records, secret rotation, backup/restore tests, monitoring, dependency scanning, security patches and an incident contact/on-call procedure appropriate for the operating scale.

## 25.7 Security headers and content policy

Configure CSP compatible with selected providers, HSTS in production, `X-Content-Type-Options`, suitable `Referrer-Policy`, frame restrictions, and appropriate permissions policy. Do not paste a rigid CSP that breaks required image/CDN/payment resources; test and tune it per deployment.

---

# 26. Recommended technical architecture

The stack below is a coherent default for a new build. The coding agent should verify current stable releases and package compatibility before scaffolding, and document material departures instead of mixing multiple alternatives by default.

## 26.1 Proposed baseline

| Layer | Recommended baseline | Reason |
|---|---|---|
| Web app | Next.js App Router + React + strict TypeScript | Public pages, authenticated dashboard, server-rendered invitation content in one application |
| Styling/system | Tailwind CSS + accessible component primitives | Shared responsive layout and reusable design tokens |
| Forms/validation | React Hook Form + Zod or equivalent maintained stack | Consistent client/server schema validation |
| Database | Managed PostgreSQL | Relational ownership, RSVP, audit, payment and event data |
| ORM/migrations | Drizzle or a single selected ORM | Versioned schema changes and typed queries |
| Authentication | One managed identity provider and server session model | Avoid bespoke credential handling |
| Object storage | One provider (e.g. Supabase Storage or Cloudflare R2) | Uploads, optimised media and lifecycle controls |
| Animation | Motion for React for ordinary transitions; GSAP for the envelope timeline only if justified; Rive optional for authored animation assets | Avoid competing animation systems |
| Background jobs | One durable queue/job service | Imports, reminders, media, messaging and reconciliation |
| Email | One transactional provider | Verification, notices and receipts |
| WhatsApp | Native share initially; Meta Cloud API later if approved/configured | Keep initial launch independent from automated messaging approval |
| M-Pesa | Daraja adapter or confirmed provider adapter | Keep server credentials and transaction state isolated |
| Hosting/CDN | One main hosting provider with image/static delivery | Fewer operational surfaces in the first release |
| Monitoring | Error tracking, structured logs, uptime, alerting and backup verification | Detect failures with real signals |
| CI/CD | Git-based workflow with lint/typecheck/tests and staged deployment | Repeatable releases and regression control |

Do not use Next.js API routes plus Hono, two databases, two object-storage providers, two animation frameworks, or multiple auth systems without a clear documented need. Redis/cache should be added only for a defined workload; a durable job system is not the same as a cache.

## 26.2 Application boundaries

Use modular service boundaries within one application initially:
- Identity/access.
- Event and template domain.
- Media processing.
- Guest households and attendees.
- RSVP.
- Messaging/notification adapters.
- Payment adapter and ledger (only if enabled).
- Subscription/billing adapter.
- Admin/support/audit.
- Analytics/metrics.

Keep business rules in service/domain modules rather than duplicating them in page components and API handlers. Provider adapters isolate external APIs and make test fakes possible.

## 26.3 Environment separation

Separate local development, test, staging, and production. Use provider sandbox/test accounts until approvals and secrets are available. Maintain `.env.example` with names and explanations but no secrets. Never commit credentials. Production deployment must fail safely when a required secret is absent; optional integrations must be marked disabled, not simulated as live.

## 26.4 Backups and recovery

Automated database backups, media recovery/lifecycle strategy, scheduled restore test, incident runbook, migration rollback plan, and a clear recovery objective appropriate to the business scale. Document data export and deletion recovery considerations.

---

# 27. Logical data model

The implementation may adjust table names but must preserve these entities and relationships. Use UUIDs or equivalent opaque IDs, timestamps, foreign keys, constraints, and migrations. Money must not use JavaScript floating-point arithmetic as an accounting source.

## 27.1 Core entities

**users/accounts** — host identity, profile, status, created/updated/deleted timestamps. Identity-provider identifiers should be modelled separately if needed; never store plaintext passwords.

**workspaces/teams** — optional owner/workspace; members and roles.

**events** — host/workspace ID, type, title, slug, description, start/end date/time, timezone, venue/online details, status, visibility, RSVP deadline, template version, published revision, design settings, timestamps, soft-delete/archive state.

**event_sections** — event ID, type, configuration/content JSON validated against a schema, order, visibility, revision.

**templates/template_versions** — template identity, category, version, schema/config, preview assets, asset rights, active/premium status, renderer compatibility.

**media_assets** — owner/event ID, storage key, purpose, MIME/type, byte size, dimensions, alt text/caption, focal point, processing status, rights/consent metadata if appropriate, created/deleted timestamps.

**guest_households/invitations** — event ID, display name, group ID, contact routing details, plus-one limits, token hash/expiry/revocation, invitation state, permissions/status, created/updated timestamps.

**attendees** — invitation/household ID, person display name, allowed status, attendee-level RSVP status, meal and dietary preferences as structured values where configured.

**guest_groups** — event ID, name, optional colour, display order.

**rsvp_submissions** — event, household/guest access ID, revision, source, submission time, idempotency key, status and receipt metadata.

**rsvp_questions** — event ID, prompt, type, options/schema, required/validation rules, order, active state.

**rsvp_answers** — submission ID, question ID, attendee ID where relevant, structured answer JSON, timestamps; enforce relevant foreign keys and uniqueness.

## 27.2 Communication entities

**consent_records** — subject/contact, channel, purpose, source, timestamp, status/revocation, policy version, evidence metadata.

**suppression_entries** — normalised address/phone, channel, reason, scope, timestamp and source. Opt-outs must be checked at dispatch time.

**message_campaigns** — event/owner, purpose/category, chosen template version, recipient criteria, creator, schedule, status, estimated cost/config, cancellation state.

**message_jobs/messages** — campaign, guest/household, provider, provider message ID, delivery state, retry count, timestamps, error classification and limited content metadata.

**notification_jobs** — job type, related entity, schedule, status, attempts, idempotency key and error summary.

## 27.3 Financial entities (only when enabled)

**payment_attempts** — event, contribution/host context, amount in minor units, currency, destination/config identifier, provider request ID, idempotency key, state, timestamps.

**contributions/transactions** — trusted provider reference/receipt, gross amount, currency, payer/guest reference where appropriate, provider fees, status and reconciliation state. Keep raw callback payloads only when needed, access-controlled and retention-limited.

**payment_events/ledger_entries** — append-only state/financial history with a stable event ID and unique provider identifier. Model reversals as new linked entries rather than erasing history.

**payouts** — host, destination reference, amount/fees/net, provider request and response IDs, state, approval, timestamps, reconciliation and failure details.

**subscriptions/plans/entitlements/invoices** — plan configuration, price version, status, service period, payment provider reference, invoice itemisation and renewal/cancellation history.

## 27.4 Moderation and operations entities

**condolences/tributes** — event, author identity or display name, content, moderation status, reviewer, timestamps and removal reason where relevant.

**virtual_candles** — event, optional guest reference, interaction timestamp and privacy-safe count handling.

**guest_photos** — event, uploader/guest reference, media asset, caption, moderation status, consent state and retention.

**audit_logs** — actor, action, entity type/ID, timestamp, trace ID and minimal metadata. Avoid secrets.

**support_tickets/abuse_reports** — subject, category, status, assignee, messages/notes, attachments references and audit.

**webhook_events** — provider, external event ID, received time, signature/verification result, processing state, retry/error summary and deduplication key.

**job_runs** — job type, target, status, attempts, progress, idempotency key and safe error context.

## 27.5 Database constraints and modelling rules

- Foreign keys for all relationships.
- Unique event slug; event-scoped duplicate rules for guests.
- Unique provider transaction/message/webhook identifiers where applicable.
- `CHECK` constraints for non-negative amounts, allowed statuses and valid counts.
- Appropriate indexes for event ID, date/status, household, response, status/schedule, provider reference, and audit time.
- Consistent UTC timestamps with event timezone stored separately.
- Avoid hard-coded `meal_1` / `meal_2` or fixed partner columns as the only attendee model.
- Avoid destructive cascading deletion of financial records or audit records.
- Store tokens hashed when practical; never index/log raw secret tokens for convenience.
- Use optimistic concurrency/version numbers on saved design drafts where needed.

---

# 28. API and webhook design

Use one consistent API approach. REST is adequate for the first release. Define request/response schemas, validation, authentication, permissions, pagination, idempotency, error codes and versioning conventions.

## 28.1 Core endpoints

**Authentication/provider callbacks**
- Provider-managed authentication routes where possible.
- `POST /api/auth/logout` only if required by the chosen setup.

**Events**
- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:eventId`
- `PATCH /api/events/:eventId`
- `POST /api/events/:eventId/publish`
- `POST /api/events/:eventId/unpublish`
- `POST /api/events/:eventId/duplicate`
- `DELETE` or archive endpoint with safe semantics.

**Design/media**
- `GET/PATCH /api/events/:eventId/design`
- `POST /api/events/:eventId/media/upload-url` or equivalent secure upload flow
- `POST /api/media/:assetId/process` only if async processing is needed
- `POST /api/events/:eventId/preview` only if required; preview should not unintentionally publish.

**Guests/imports**
- `GET/POST /api/events/:eventId/guests`
- `PATCH/DELETE /api/events/:eventId/guests/:guestId`
- `POST /api/events/:eventId/guests/import`
- `GET /api/imports/:jobId`
- `POST /api/events/:eventId/guests/bulk-action`

**RSVP**
- `GET /api/events/:eventId/rsvps`
- `POST /api/public/invitations/:token/rsvp`
- `GET /api/public/invitations/:token` or equivalent resolved-invitation endpoint
- `PATCH /api/public/invitations/:token/rsvp/:submissionId` only if editing is permitted
- `GET /api/events/:eventId/rsvps/export`

**Messaging**
- `POST /api/events/:eventId/share-link` if server-generated text/metadata are needed
- `POST /api/events/:eventId/campaigns`
- `POST /api/campaigns/:campaignId/dispatch`
- `GET /api/campaigns/:campaignId`
- `POST /api/webhooks/whatsapp` only after provider setup.

**Payments**
- `POST /api/events/:eventId/payment-attempts`
- `GET /api/payment-attempts/:attemptId`
- `POST /api/webhooks/mpesa` as a provider-specific callback endpoint after exact Daraja model is selected
- reconciliation endpoints restricted to finance operations.

**Memorial interactions and gallery**
- `GET/POST /api/events/:eventId/condolences` subject to visibility/token policy.
- `POST /api/events/:eventId/candles` and aggregate/count routes where enabled.
- Guest photo upload/moderation routes where enabled.

**Admin**
- Routes separated by permission and audited; avoid a single unrestricted generic admin update route.

## 28.2 API response format

Use a stable structure, for example:

```json
{
  "data": {},
  "meta": { "requestId": "..." }
}
```

Errors should include a stable machine-readable code, safe human-readable message, request ID, and field-level details where appropriate. Do not return stack traces, secrets, raw provider responses or internal paths in production.

## 28.3 Webhook rules

- Accept only the documented provider payload.
- Verify authenticity using the mechanism the provider actually supports.
- Persist a minimal webhook event record before acknowledging if required by provider behaviour.
- Deduplicate on provider event/transaction identifier.
- Return prompt acknowledgement and process asynchronous work via jobs when safe.
- Retry internal processing without treating a duplicate delivery as a new transaction.
- Alert on repeated failures and preserve enough safe data to reconcile.
- Never expose the provider callback as a guest-facing browser endpoint.

---

# 29. Integrations and operational tooling

## 29.1 Initial integrations

- Managed authentication.
- Database and object storage.
- Email provider if email is a supported verified channel.
- Error monitoring and uptime checks.
- User-controlled link sharing.

## 29.2 Later integrations

- Meta WhatsApp Cloud API with approved template and consent workflow.
- SMS provider for agreed fallback use cases.
- M-Pesa Daraja or another confirmed provider for the chosen collection model.
- Subscription billing provider after country/account feature availability is confirmed.
- Calendar event generation (`.ics`) and standard add-to-calendar links.
- Maps link integration; avoid exposing precise guest location.
- Product analytics after a privacy review.
- Web push only if supported browsers and opt-in experience justify the complexity.

## 29.3 Cost governance

Track storage per event, image processing, egress, email, SMS, WhatsApp messages, background jobs and subscription processor fees. Provide quotas and alerts. Never promise “unlimited” functionality without a cost model and abuse safeguards.

---

# 30. Testing and quality gates

## 30.1 Test layers

- **Unit:** validators, state machines, permissions, template configuration, price/entitlement logic and event-time rules.
- **Integration:** database constraints, token verification, storage upload, job enqueue/dequeue, provider adapter responses and webhooks.
- **End-to-end:** signup/login, create event, design preview, publish, share, guest RSVP, host dashboard, CSV import/export, opt-out, and payment sandbox flows if enabled.
- **Visual regression:** key invite templates, envelope open state, card emergence, page sections, mobile and desktop layouts.
- **Accessibility:** keyboard, screen reader, focus, contrast, reflow, reduced motion and error announcement.
- **Security:** cross-tenant access, token brute force, auth rate limits, XSS, CSRF, upload abuse, data export access, webhook replay and secret leakage.
- **Performance:** invitation mobile LCP/CLS/INP where measurable, slow network, low memory, image handling and animation load.
- **Recovery:** database restore, job retry, provider outage, callback replay, failed media processing and deletion/retention test.

## 30.2 Non-negotiable acceptance tests

1. A guest opens an invitation without a Kadi account.
2. The seal/flap/card opening is visibly coordinated and the card emerges from the envelope.
3. Skip/replay controls function without losing the current place or creating data changes.
4. Reduced-motion mode remains usable and exposes all essential content.
5. Published invitations work with real host data and optimised uploads.
6. A host can create and publish an event with optional steps skipped.
7. A guest can RSVP for only the permitted household members and cannot exceed plus-one limits.
8. Duplicate taps/retries do not create duplicate RSVP submissions.
9. A host cannot access another host's event/guest/RSVP/payment resources by modifying an ID.
10. A copied/revoked/expired token behaves according to the policy; sensitive access is not exposed in analytics/logs.
11. CSV preview exposes errors before import and import retry does not duplicate valid rows.
12. Messages respect suppression/opt-out at dispatch time; delivery states are not faked.
13. Payment is not marked successful from client-side state alone; callbacks are deduplicated and reconciled.
14. Event cancellation stops scheduled reminders and makes updated details visible.
15. Account export/deletion and retention workflows act on the right data categories.
16. Backup can be restored and an incident alert reaches a responsible contact.

## 30.3 Release thresholds

- Zero known critical/high-severity security findings at launch.
- No failed critical end-to-end flows.
- No placeholder data in production views.
- No unconfigured integrations represented as operational.
- Accessibility issues in essential guest and host flows resolved or documented with an accountable remediation plan.
- Tested database migration and rollback/restore process.
- Production errors and provider failures observable.

---

# 31. Delivery roadmap and release gates

## Phase 0 — Product and provider validation

- Interview hosts and planners.
- Test the animated opening on phones with target users.
- Validate name, domain, asset sources and legal considerations.
- Choose initial monetisation hypothesis.
- Resolve payment model and WhatsApp launch scope.
- Create wireframes and clickable interactive prototypes.
- Define template art direction and first templates.

**Exit gate:** One selected first-release scope, known risks/assumptions and user-tested core flow.

## Phase 1 — Foundation and core invitation MVP

- Repository, environments, CI, design tokens, identity provider, database migrations and monitoring.
- Public landing/template demo.
- Host onboarding and dashboard.
- Event creation, draft/publish, template selection and guest-facing renderer.
- Initial envelope opening and reduced-motion variant.
- Invitation details, maps/calendar links, guest list, household/attendee model and RSVP.
- Basic CSV import/export.
- Data export/deletion foundation and audit logging.

**Exit gate:** Host-to-guest-to-RSVP flow works in production for a limited pilot without direct payment or bulk automation dependencies.

## Phase 2 — Design depth and operations

- Multiple high-quality templates across key event types.
- Editor preview, crop/focal point, section visibility/reordering, replay and gallery.
- Reminder scheduling through the user's chosen manual/native-share route, in-app notifications, support workflows and stronger analytics.
- PWA basics and performance improvement.

**Exit gate:** Multiple hosts can create, edit and manage real events; accessibility/performance validated on representative devices.

## Phase 3 — Automated messaging

- Complete consent records and suppression rules.
- Register/configure WhatsApp provider account and approved templates.
- Message campaigns, queue, webhook processing, quota/cost view, retries, failure queue and opt-out.
- Optional email/SMS fallback depending on cost and compliance.

**Exit gate:** Delivery, opt-out and message-cost behaviour verified with provider test and production approval.

## Phase 4 — Money and paid plans

- Decide paid plan strategy and entitlement rules.
- Enable subscription/payment provider integration for platform fees.
- Implement direct-to-host contribution confirmation or provider-backed collection according to the approved business model.
- Reconciliation, refunds/reversals, payout controls if applicable, finance audit and support runbook.

**Exit gate:** Written provider/account confirmation, compliance review, sandbox-to-production tests, reconciliation procedure and support responsibility.

## Phase 5 — Expansion

- Planner teams, multi-event workspace, check-in, guest photo sharing/moderation, more templates, custom sections, web push, B2B API, advanced analytics, localised languages and additional markets as justified.

**Exit gate:** Evidence of demand and operational capacity; each expansion has a clear cost, privacy and support plan.

---

# 32. Product metrics and business validation

## 32.1 Funnel metrics

- Template demo opened.
- Signup started/completed.
- First draft created.
- Invitation published.
- First share action taken.
- First guest RSVP received.
- Event reaches meaningful RSVP coverage.
- Host returns to edit or create another event.

## 32.2 Operational metrics

- Publish error rate.
- RSVP submit success/error rate.
- CSV import success/partial-failure rate.
- Media processing failure rate.
- Queue latency and dead-letter jobs.
- Provider API/webhook error rate.
- Messaging cost per successful delivery.
- Payment attempts by state and time-to-reconciliation if enabled.
- Support requests per active event.

## 32.3 Research metrics

Test whether hosts value the envelope animation enough to choose/purchase Kadi, whether they prefer one-time event pricing or subscriptions, which event categories are most frequent, whether WhatsApp link sharing meets initial needs, and which optional features influence willingness to pay. Do not confuse aesthetic preference with actual retention or payment behaviour.

## 32.4 Success criteria

Set numeric goals only after baseline data from user tests/pilot. Initial research should validate: time to first publish, percentage of guests who complete RSVP, host-reported ease, mobile performance, animation completion/skip behaviour, and repeat host usage. Measure animation engagement without collecting unnecessary personal data.

---

# 33. Risks, edge cases, and operational runbooks

## 33.1 Invitation and event edge cases

- Event date/time changes after invitations were sent.
- Venue changes or cancellation.
- Daylight/timezone and date parsing issues.
- Invalid/duplicate slug and old-link redirects.
- Draft or unpublished invitation visited.
- Expired/revoked/forwarded guest token.
- Host deletes or duplicates an event.
- RSVP deadline passes while a guest is submitting.
- Household size changes after invitation creation.
- Attendee name or meal selection updated after export.
- Missing photo/font/animation asset.
- Unsupported browser or slow network.

## 33.2 Messaging edge cases

- Opt-out after a reminder is queued.
- Provider returns success but webhook is delayed.
- Duplicate/reordered delivery webhooks.
- Template paused/rejected or category reclassified.
- Provider outage/rate limit.
- Wrong/invalid number.
- Event edits during scheduled send.
- Host clicks send twice.
- Campaign paused midway.
- Incorrect cost estimate or unexpected bill.

## 33.3 Payment edge cases

- STK prompt not approved, cancelled or timed out.
- Request times out but provider processes it.
- Duplicate callback.
- Callback arrives out of order.
- Wrong amount/receipt/currency/destination.
- Reversal after success.
- Guest pays from a number different from their guest record.
- Provider outage and reconciliation gap.
- Payout destination invalid/changed.
- Host disputes a contribution or asks for refund.
- Event deleted while financial records must remain.

## 33.4 Security/privacy edge cases

- Guest token shared publicly.
- Host imports contacts without appropriate authorisation.
- Guest requests deletion or correction.
- Child photo published without appropriate authority.
- Harmful condolence or uploaded photo.
- Admin account compromised.
- Access logs contain token or phone data.
- Analytics vendor receives private event metadata.
- User uploads malicious SVG/image/audio.
- Account deleted but background jobs continue to send messages.

## 33.5 Runbooks

Prepare concise procedures for: database outage, provider outage, messaging suppression incident, payment reconciliation failure, suspected account compromise, data breach, accidental public invitation exposure, harmful uploaded content, data subject request, failed deployment and restore from backup. Each runbook needs an owner, trigger, immediate containment, communication approach, recovery steps and post-incident record.

---

# 34. Definition of done

A feature is complete only when the user-visible experience, server rules, data model, accessibility, error handling, tests, logs/monitoring and documentation agree.

For the full platform:

- Product requirements and unresolved decisions are documented.
- Core host and guest journeys are complete.
- Signature envelope/card/photo reveal is polished, skippable, replayable and accessible.
- Invitation layouts are responsive and match the preview.
- Guest households, attendees and RSVPs are correctly modelled.
- All state transitions and errors are deliberate.
- Every privileged endpoint enforces server-side authorisation.
- External integrations are either configured and tested or visibly disabled; no fake success paths.
- Provider callback processing is idempotent and observable.
- Privacy and retention behaviours are implementable and documented.
- Production analytics avoid secret and unnecessary sensitive data.
- The test suite passes, critical flows are exercised on mobile, and recovery procedures have been tried.
- The product has been validated with real hosts and guests before scaling scope.

---

# 35. Reference websites and source material

These are reference points for user experience, not claims that Kadi should copy their artwork or code. Review the live experiences on a phone as well as desktop.

## Interactive invitation references

- The Digital Envelope — animated invitation, envelope, seal, music, story sections and live demo: https://thedigitalenvelope.com/animated-wedding-invitations
- The Digital Envelope homepage and templates: https://thedigitalenvelope.com/
- Greenvelope — animated envelope explanation: https://www.greenvelope.com/resources/animated-envelope-invitations
- Snap Post — opening animations, Ken Burns, circle reveal, clip reveal and music: https://www.snappost.co/en/features/opening-animation
- Paperless Post — digital invitation/card library: https://www.paperlesspost.com/cards/section/invitations
- VibeFly Digital — wedding/event invitation websites and gallery/RSVP patterns: https://www.vibeflydigital.com/en/digital-wedding-invitations
- Joy — wedding websites and guest photo experiences: https://withjoy.com/wedding-website/

## Current technical and policy references to re-check before production

- Next.js App Router documentation: https://nextjs.org/docs/app
- Safaricom Daraja portal: https://developer.safaricom.co.ke/apis
- Safaricom B2C API documentation: https://developer.safaricom.co.ke/apis/BusinessToCustomer
- WhatsApp Business terms: https://www.whatsapp.com/legal/meta-terms-whatsapp-business
- WhatsApp Business policy: https://business.whatsapp.com/policy
- ODPC FAQs and registration guidance: https://www.odpc.go.ke/faqs/
- Kenya Data Protection Act, 2019: https://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/2019/TheDataProtectionAct__No24of2019.pdf
- Central Bank of Kenya, draft National Payment System Policy and Bill 2026 (draft, not itself an enacted Act): https://www.centralbank.go.ke/2026/09/21/draft-national-payment-system-policy-and-national-payment-system-bill-2026/
- W3C reduced-motion technique: https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html

Pricing, provider terms, statutory status, and technical APIs can change. Verify current terms and the actual production account arrangement before launch.

---

## Closing recommendation

Build Kadi around one unforgettable, well-executed guest moment: the seal opens, the flap moves, the card rises out of the envelope, and the invitation expands into an elegant, personal, functional event page. Surround that experience with reliable guest/household data, RSVP, sharing, clear privacy, and well-defined integration boundaries. Add automated messaging and managed money movement only when their real operational requirements are met.


---

---

# Appendix A — Technical snippets and starter schema retained from the original brainstorm

This appendix preserves the actual code-oriented examples from the original `Pasted text.txt` source so that they are not lost in the more complete product blueprint. These are **starter examples, not production-ready code**. The data model and endpoints must be reconciled with the final chosen stack, reviewed for security, migrated safely, and covered by tests before use. In particular, the original schema has design limitations described after the SQL listing.

## A1. Template configuration example (JSON)

```json
{
  "id": "wedding-elegant-floral",
  "name": "Elegant Floral",
  "category": "wedding",
  "thumbnail": "/templates/wedding-elegant-floral/thumb.jpg",
  "colors": {
    "primary": "#E85D75",
    "secondary": "#F5E6E8",
    "accent": "#F5B942",
    "text": "#1A1A2E",
    "background": "#FFF8F5"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "Inter",
    "script": "Great Vibes"
  },
  "animations": {
    "envelope": "floral-bloom",
    "background": "floating-petals",
    "entrance": "fade-up"
  },
  "sections": [
    { "type": "hero", "layout": "full-photo", "required": true },
    { "type": "couple", "layout": "two-column", "required": true },
    { "type": "story", "layout": "timeline", "required": false },
    { "type": "ceremony", "layout": "card", "required": true },
    { "type": "reception", "layout": "card", "required": true },
    { "type": "program", "layout": "timeline", "required": false },
    { "type": "registry", "layout": "card", "required": false },
    { "type": "gallery", "layout": "grid", "required": false },
    { "type": "rsvp", "layout": "form", "required": true },
    { "type": "faq", "layout": "accordion", "required": false }
  ],
  "music": {
    "default": "/templates/wedding-elegant-floral/music.mp3",
    "options": ["Canon in D", "Perfect", "A Thousand Years"]
  }
}
```

## A2. Loading-state CSS examples

### Skeleton shimmer
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
```

### Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top-color: #6B4EFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

### Progress bar
```css
.progress-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6B4EFF, #F5B942);
  transition: width 0.3s ease;
}
```

### Loading dots
```css
@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}
.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
```

## A3. Reduced-motion and screen-reader examples

### Reduced motion (CSS)
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .confetti, .petals, .balloons {
    display: none;
  }
}
```

### Screen-reader announcement (HTML)
```html
<div aria-live="polite" aria-atomic="true">
  <!-- "RSVP submitted successfully" -->
</div>
```

## A4. Security-header example

The following original header list is illustrative; validate the final Content Security Policy against actual assets, providers, embeds and deployment configuration. Do not copy a policy that breaks required functionality.

```text
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=()
```

## A5. Original SQL database schema

The following is the SQL starter schema from the original brainstorm, preserved for reference. It is not asserted to be production-ready or to match a selected ORM. Review it before converting it into versioned migrations.

```sql
-- Users (hosts)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'host', -- host, planner, admin
  plan VARCHAR(20) DEFAULT 'free', -- free, pro, business
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL, -- wedding, birthday, funeral, custom
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  end_date DATE,
  venue_name VARCHAR(255),
  venue_address TEXT,
  venue_lat DECIMAL(10, 8),
  venue_lng DECIMAL(11, 8),
  template_id VARCHAR(100),
  design JSONB DEFAULT '{}',
  music_url TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255),
  rsvp_deadline DATE,
  status VARCHAR(20) DEFAULT 'draft', -- draft, active, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Event Sections (customizable content blocks)
CREATE TABLE event_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  section_type VARCHAR(50) NOT NULL, -- hero, story, ceremony, etc.
  title VARCHAR(255),
  content JSONB DEFAULT '{}',
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Guests
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  display_name VARCHAR(255) NOT NULL,
  is_couple BOOLEAN DEFAULT FALSE,
  partner_1_name VARCHAR(255),
  partner_2_name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  group_name VARCHAR(100),
  plus_ones_allowed INT DEFAULT 0,
  personal_note TEXT,
  unique_token VARCHAR(64) UNIQUE NOT NULL,
  rsvp_status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, declined, maybe
  rsvp_attending_count INT DEFAULT 0,
  rsvp_meal_1 VARCHAR(50),
  rsvp_meal_2 VARCHAR(50),
  rsvp_dietary TEXT,
  rsvp_song_request TEXT,
  rsvp_message TEXT,
  rsvp_at TIMESTAMP,
  contribution_total DECIMAL(12, 2) DEFAULT 0,
  invitation_sent_at TIMESTAMP,
  invitation_opened_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Guest Groups
CREATE TABLE guest_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW()
);

-- RSVP Responses (detailed)
CREATE TABLE rsvp_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  question_id UUID,
  answer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RSVP Questions (custom)
CREATE TABLE rsvp_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL, -- text, select, checkbox, radio
  options JSONB DEFAULT '[]',
  is_required BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contributions
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  contributor_name VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  mpesa_receipt VARCHAR(50),
  mpesa_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, reversed
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Payouts
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  amount DECIMAL(12, 2) NOT NULL,
  fee DECIMAL(12, 2) NOT NULL,
  net_amount DECIMAL(12, 2) NOT NULL,
  mpesa_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  failure_reason TEXT,
  requested_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- WhatsApp Messages
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  template_name VARCHAR(100),
  message_body TEXT,
  whatsapp_message_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'queued', -- queued, sent, delivered, read, failed
  failure_reason TEXT,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Condolences (funeral)
CREATE TABLE condolences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  author_name VARCHAR(255),
  message TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Virtual Candles (funeral)
CREATE TABLE virtual_candles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  lit_at TIMESTAMP DEFAULT NOW()
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES guests(id),
  url TEXT NOT NULL,
  caption TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  body TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Templates
CREATE TABLE templates (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  thumbnail_url TEXT,
  config JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL, -- active, past_due, cancelled, expired
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  status VARCHAR(20) NOT NULL, -- paid, pending, failed
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members (B2B)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  member_id UUID REFERENCES users(id),
  role VARCHAR(20) NOT NULL, -- admin, editor, viewer
  created_at TIMESTAMP DEFAULT NOW()
);

-- API Keys (B2B)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(100),
  key_hash VARCHAR(255) NOT NULL,
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_host ON events(host_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_guests_event ON guests(event_id);
CREATE INDEX idx_guests_token ON guests(unique_token);
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_contributions_event ON contributions(event_id);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_whatsapp_event ON whatsapp_messages(event_id);
CREATE INDEX idx_whatsapp_status ON whatsapp_messages(status);
CREATE INDEX idx_condolences_event ON condolences(event_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);
```

### Required review items before using this SQL

1. The original `events.host_id`, several required relationship IDs, and other foreign keys are not consistently declared `NOT NULL`; choose nullability intentionally.
2. `rsvp_responses.question_id` is not declared as a foreign key to `rsvp_questions`, and uniqueness rules for responses are missing.
3. The guest design has couple-specific fields (`partner_1_name`, `partner_2_name`, `rsvp_meal_1`, `rsvp_meal_2`) but does not robustly model arbitrary household attendees, children, plus-ones or per-person dietary needs. A normalised attendee/household model is safer.
4. `guests.unique_token` is stored in plaintext and has no explicit expiry/revocation design. Prefer high-entropy token secrets stored as hashes, with expiry and revocation support where appropriate.
5. `contributions` and `payouts` need provider request/checkout identifiers, idempotency keys, currency/amount consistency rules, event history, reconciliation state, and unique provider receipt constraints. Do not trust client status or a browser redirect as proof of payment.
6. The current cascade delete from events to guests and contributions can destroy records needed for financial reconciliation or lawful record keeping. Define soft-delete/anonymisation and retention policies separately.
7. `users.role`, `users.plan`, and `team_members.role` as strings need constrained values or reference tables; admin privileges require stronger separation than a user-editable role column.
8. Authentication methods need a consistent identity model if phone OTP, email/password, Google OAuth, and magic links are all supported. Do not store unusable or unnecessary password/2FA secrets.
9. Consent and suppression records are absent. Add records for messaging consent, withdrawals/opt-outs, consent source/timestamp/purpose, privacy requests and relevant audit history.
10. Templates need versioning and compatibility information so published invitations do not break when the template is updated. Uploaded media needs ownership, validation, moderation status where relevant, and retention rules.
11. Add suitable CHECK constraints, indexes, uniqueness constraints, transaction boundaries, and database tests after the final domain model is decided.
12. Store timestamps consistently (normally UTC `timestamptz` in PostgreSQL); render event times in the event's intended timezone.

## A6. Original API endpoint outline

This endpoint list is retained from the source. The final API may use route handlers or server actions according to the chosen architecture, but every operation must have explicit validation, authorisation, rate limiting where appropriate, pagination, idempotency and error semantics. Webhooks must be server-to-server endpoints and must not be confused with host- or guest-facing requests.

```text
Auth
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/otp/send
POST   /api/auth/otp/verify
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

Events
GET    /api/events
POST   /api/events
GET    /api/events/:id
PATCH  /api/events/:id
DELETE /api/events/:id
POST   /api/events/:id/duplicate
GET    /api/events/:id/preview

Guests
GET    /api/events/:id/guests
POST   /api/events/:id/guests
PATCH  /api/events/:id/guests/:guestId
DELETE /api/events/:id/guests/:guestId
POST   /api/events/:id/guests/import
POST   /api/events/:id/guests/bulk

RSVPs
GET    /api/events/:id/rsvps
GET    /api/events/:id/rsvps/export
PATCH  /api/events/:id/rsvps/:guestId

Contributions
GET    /api/events/:id/contributions
POST   /api/events/:id/contributions/initiate
POST   /api/events/:id/contributions/callback
GET    /api/events/:id/contributions/export

WhatsApp
POST   /api/events/:id/whatsapp/send
POST   /api/events/:id/whatsapp/reminder
POST   /api/events/:id/whatsapp/broadcast
GET    /api/events/:id/whatsapp/logs
POST   /api/webhooks/whatsapp

Templates
GET    /api/templates
GET    /api/templates/:id

Condolences
GET    /api/events/:id/condolences
POST   /api/events/:id/condolences
PATCH  /api/events/:id/condolences/:id/approve

Candles
POST   /api/events/:id/candles
GET    /api/events/:id/candles

Public
GET    /api/public/e/:slug
GET    /api/public/e/:slug/g/:token
POST   /api/public/e/:slug/g/:token/rsvp
POST   /api/public/e/:slug/g/:token/contribute
POST   /api/public/e/:slug/g/:token/condolence
POST   /api/public/e/:slug/g/:token/candle

Webhooks
POST   /api/webhooks/mpesa
POST   /api/webhooks/whatsapp
```

## A7. Original API response examples

### Success response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 142
  }
}
```

### Error response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone number",
    "field": "phone",
    "details": { ... }
  }
}
```

These response shapes are illustrative. Standardise response semantics for the selected framework; never return internal exception messages, secrets or sensitive provider payloads to a client.
