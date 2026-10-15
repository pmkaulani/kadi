# MASTER PROMPT — Kadi full app audit, design overhaul and functional completion

You are the senior product designer, staff frontend engineer, interaction designer and QA owner responsible for finishing the **existing Kadi digital invitation platform**. The goal is a coherent, professional, premium product with the restraint and clarity of Apple's interface design, the efficiency of Linear/Vercel, and the discovery/content richness of Spotify/social products where useful. Do not copy another brand's UI. Kadi must have its own visual identity.

The user has shared reference boards in `reference/`. Open and inspect those images. Reference images are concrete targets for hierarchy, proportions, typography, image placement, spacing and visual richness. Do not treat the images as vague inspiration or build a generic component library that merely uses similar colours.

## Non-negotiable operating rules

1. **Work on the existing repository. Do not regenerate or replace the whole application.** Preserve functional routes, event data contracts, service interfaces, invitation tokens, RSVP constraints, accessibility behavior and APIs unless a documented bug requires a change.
2. **Audit before editing.** Begin with `prompts/00_AUDIT_BASELINE.md`. Inspect current git status, package.json, routes, services, types, components, tests, existing prompts and previous patches. Capture baseline screenshots and record known failures. Do not assume the source archive and current workspace are identical.
3. Do not respond with a plan only. Once the audit is complete, implement the phase requested, run its required checks, and report actual changes. Never say a feature is complete because a prompt or snippet exists.
4. Use TypeScript with the repository's existing Next.js 14 App Router, React 18 and Tailwind 3.4 baseline. Framer Motion and Lucide are already dependencies in the supplied snapshot. Do not casually migrate to Tailwind v4, Next latest, Radix or shadcn. If a new dependency is essential, explain why, confirm compatibility, install it and run tests; otherwise use existing primitives.
5. Establish one shared design system and use it across all app pages. Public marketing can be editorial; the authenticated workspace can be a consistent application shell; event invitations can each have distinctive art direction. Do not force a Victorian/wedding style onto birthdays, graduation, housewarming, memorials, corporate events or other occasions.
6. Never fake behavior. Every button must work or be explicitly disabled with a clear reason. Do not show “All changes saved” until the server/persistence layer confirms the latest save. Do not present a M-Pesa simulation as a real STK Push. Do not pretend an in-memory database is durable. Do not invent live metrics, reviews, provider credentials, people, event details or uploaded files.
7. Preserve user-created content and ensure draft edits are not lost. Add migrations/schema changes only with a safe plan. Do not overwrite unrelated local changes. Use a branch or create a backup before destructive modifications.
8. Visual QA is mandatory. Run the application, capture desktop and mobile screenshots, compare against the references, correct the largest mismatch and repeat. Compilation alone is not visual acceptance. If a browser automation/screenshot tool is unavailable, say so and provide exact reproducible steps; never fabricate screenshots.
9. Accessibility and mobile are first-class requirements: keyboard navigation, visible focus, meaningful labels, touch targets ≥44px, reduced motion, zoom/reflow, semantic headings, contrast, alt text, safe-area padding and no horizontal overflow.
10. Use Kenyan context naturally and accurately. Keep prices in KES, phone formatting in `+254`, date display such as `DD MMM YYYY`, and EAT timezone labels when appropriate. Use respectful local imagery and language. Do not randomly insert Swahili words where they sound unnatural.

## Repository facts to confirm, not blindly trust

The supplied snapshot's `package.json` lists Next 14, React 18, Tailwind 3.4, Framer Motion, Lucide, React Hook Form, Zod, `tsx` tests. Relevant routes include:
- `src/app/page.tsx` and `src/components/visual-reference/KadiReferenceLanding.tsx`
- `src/app/templates/page.tsx`, `src/app/templates/[templateId]/page.tsx`
- `src/app/app/templates/page.tsx`
- `src/app/app/events/page.tsx`, `src/app/app/events/new/page.tsx`, `src/app/app/events/[eventId]/page.tsx`
- `src/app/e/[slug]/page.tsx`
- `src/app/login/page.tsx`
- event, guest and RSVP handlers under `src/app/api/`
- `src/components/animation/EnvelopeRenderer.tsx`, `WaxSeal.tsx`, `MotionToolkit.tsx`, and `src/components/animation/kadi-invitation-kit/EnvelopeExperience.tsx`
- invitation section components under `src/components/invitations/`
- templates under `src/lib/templates/catalogue.ts` and types in `src/lib/templates/types.ts`
- data contracts in `src/lib/db/types.ts`, data store in `src/lib/db/mock-db.ts`, services in `src/lib/services/`

The current public homepage imports `KadiReferenceLanding`. Its first screen and below-fold content must be checked in a real browser. Current `KadiReferenceLanding` uses four top-level occasion cards and ordinary `<img>` tags in some places. The new-event wizard has separate React state for many controls. The app has two envelope implementations that may drift. The services include an in-memory `mockDb` in the supplied snapshot, and there are demo auth patterns. Confirm current workspace before fixing any of this.

## Product goals and required experience

### A. Unified product design system

Create or refine one source of truth for:
- colour tokens: warm off-white light surfaces, white content surface, layered neutral text, restrained Kadi accent, accessible semantic states;
- optional dark surface tokens if the route/theme already supports dark mode;
- type scale and curated font pairing, using the system/SF-like stack with Inter as sensible fallback and event-specific display fonts in invitation templates;
- 4px-based spacing scale, limited radii (12/16/24 plus pill), soft borders, deliberately restrained shadows;
- buttons, text inputs, selects, toggles, segmented controls, disclosure/accordion, modal/bottom sheet, table, pills, skeleton, empty/error states, toast only when action feedback calls for it;
- hover, active, pressed, focus-visible, disabled, loading, success and error states;
- transitions based on `cubic-bezier(.32,.72,0,1)` around 180–320ms unless the motion is physically intentional.

Avoid arbitrary gradients, random shadows, mixed radius values, giant pill shapes on every element, overused translucent glass cards, tiny unreadable labels, emoji icons, fake data, generic stock images and card grids used as the only layout primitive. Use whitespace, typography, image art direction and section composition as the primary hierarchy.

### B. Public landing page — full-length and professional

Keep the hero **within the initial viewport** so a user does not need to scroll just to see the complete hero, headline, CTA and main image. Use `100svh`/`100dvh` with safe responsive constraints and allow graceful adjustment when the address bar/short device viewport changes. Do not impose a giant `min-height` that hides the CTA on mobile.

Build out the page **below the hero**, not by making the hero taller. Required page story:
1. Header/nav with clear templates, how it works, sign-in and one primary “Create invitation” action.
2. Hero: editorial, image-led, strong headline and supporting sentence; action for browsing templates and action for starting an invitation. Main invitation artwork is the visual focal point. Use a slow, restrained carousel only if it does not compete with copy or hurt performance.
3. Occasion discovery featuring wedding, birthday, graduation, housewarming, baby shower, engagement/anniversary, memorial/funeral, corporate/product launch, community/fundraiser and more. Use occasion-specific art, not a wedding image under every label.
4. Featured template browser preview with real template catalogue data and links.
5. “From invite to event” how-it-works sequence for host creation and guest experience.
6. Showcase invitations are living pages: stories/programme/gallery/RSVP/calendar/gifts where relevant.
7. Host tools: guest list, RSVP visibility, QR/link sharing, event information updates.
8. Kenyan context and flexible occasions section. Do not invent reviews, customer counts or testimonials. Only render such content if backed by the real product.
9. FAQ and clear final CTA/footer.

Use real routes. Occasion cards must filter `/templates?category=<canonical-id>` or the real equivalent. Create actions point to `/app/events/new`, respecting auth/onboarding if implemented. Use Next Image/local assets or vetted URLs with correct `sizes`, aspect ratios and focal points. Below-fold content must use intentional image proportions and restrained reveal motion.

### C. App-wide consistency and navigation

The authenticated workspace needs a single shell (same left nav/sidebar or deliberate mobile bottom nav, header, page max-width, title/description rows, action placement, filters, empty states, loading and error states). At minimum review:
- `/app/events` overview/list and filters
- `/app/events/new` creation/editor
- `/app/events/[eventId]` event command centre with overview/design/guests/RSVP/settings as coherent tabs
- `/app/templates` template discovery
- `/login` and any actual account creation/recovery routes (do not invent nonworking auth routes)
- public `/templates`, template preview and `/e/[slug]` guest invitation
- legal/help/content routes for shared public header/footer and reading width

Every screen should feel like the same Kadi product. Use the same typography, accent, control sizing, focus states and spacing. Different data layouts may differ, but the shell, component behavior and visual weight should be consistent.

### D. Live invitation editor — critical, same renderer as guest page

Build a robust split/studio editor:
- desktop: controls panel at left, preview toolbar and device stage at right; preview should remain large and legible at available height; no three-column crunch on 1280 widths;
- mobile: explicit Edit / Preview tabs, controls full width, preview viewport within safe area, never squeeze both panels side-by-side;
- control groups: Event Details, Design, Content Blocks, RSVP & Guests, Contributions, Music, Animations, Layout and Publish/Review, shown only when applicable;
- all form fields use one canonical draft state object/reducer (including event values, selected template, palette, typeface, envelope shape, liner/seal, letter style, motion options, blocks, section order/visibility, image crop, RSVP policy); avoid many disconnected states for related data;
- every input updates state and the guest renderer immediately; only persistence is debounced ~150–500ms. Separate draft-update latency from network save latency;
- saving states: Unsaved changes → Saving… → All changes saved, or Save failed + retry. Serialize saves or use revision numbers to prevent a slow old response overwriting a newer draft. Never claim success before response;
- template selection should change template/category design and category-specific default content safely; category changes must not wipe authored content without confirmation;
- `Preview as` selects a real guest/household, including couple names; guest personalization should derive from data, not hard-coded text;
- device toggle iPhone/Android/Desktop changes the visual frame without changing invitation data; preview remains responsive within frame;
- Replay animation updates a replay key and resets the envelope state; skip-to-content remains available;
- “Share preview” must be a real secure read-only private preview token/route or clearly disabled/unavailable until API exists. Never use a public draft slug;
- all preview side effects are off: RSVP preview mode cannot submit a real RSVP, gift/M-Pesa preview cannot call a real payment API, music is only activated by a direct guest/editor user gesture, public analytics are not written by previews;
- use one guest rendering tree/config and same envelope/open sequence for saved draft preview and published invitation. Do not build a poster mockup as a substitute.

Create automated tests asserting title/date/venue/color/font/envelope/letter style, visible sections and section order updates in preview. Include a test for guest personalization and preview side-effect prevention.

### E. Envelope physical fidelity and animations

First inspect the supplied reference boards and both existing envelope implementations. Reconcile or wrap them behind one `EnvelopeRenderer`; do not maintain two independent sources of truth.

The envelope must look like tangible layered stationery, not a flat rectangle or a generic centered wedding card:
- ambient contact shadow; paper base with subtle grain; patterned or solid liner throat; two staggered insert papers; invitation card; front left/right/bottom folds with seam edges; upper flap attached at a visible hinge; inner side of flap; dimensional wax seal with bevel, stamped edge and monogram; shadow/floor bounce;
- use CSS 3D/transforms where appropriate: `transform-style: preserve-3d`, correct transform origins, perspective, careful backface visibility, layered `z-index` and shadow; if a suitable licensed image/texture materially improves fidelity, bundle it locally and use it as a background layer rather than relying on fragile external URLs;
- physically sequenced states: closed/pulse → seal press/depress → seal release/break → hinge flap rotates back → reveal liner → paper inserts rise at distinct angles → invitation card rises → card settles → handoff into a full scrollable guest page;
- replay, skip-to-details, keyboard activation, reduced-motion behavior and animation cancellation on unmount/route change; no permanent loading or animation locks;
- six presets requested by the user: floral bloom, confetti burst, minimal fade, classic wax seal, gold foil, video envelope. Each preset changes actual envelope/animation treatment—not just a label or colour;
- event-specific worlds: Ruby Disco birthday; gift-led birthday; Pastel Garden; Sage Love Letter wedding; calm memorial/funeral; distinct graduation, housewarming and corporate/product templates. No universal Victorian treatment;
- memorial/funeral prohibits confetti, party music or celebratory motion. Graduation can be dynamic, birthday bold, housewarming welcoming, corporate polished.

Reference the source `EnvelopeRenderer.tsx`, `WaxSeal.tsx`, `MotionToolkit.tsx` and `kadi-invitation-kit/EnvelopeExperience.tsx`. Test the real result at 320, 360, 375, 390, 430 px wide and desktop. Compare screenshots or short capture of each of the six presets to the reference. Do not say photorealistic if it is only CSS art; report remaining limitations truthfully.

### F. One canonical invitation model and shared guest renderer

The event/template/design configuration must have typed, validated fields. Model these distinct things separately:
- event metadata (title, host, date/time, timezone, venue(s), dress code, event category, RSVP deadline/capacity);
- template visual theme/palette/typography/image layout;
- envelope style and opening animation config;
- ordered content blocks with stable ids and typed props;
- RSVP policy and custom questions;
- guest/household personalization;
- section visibility and order;
- media/gallery/audio and optional contribution settings.

Guest invitation, template preview, editor live preview and any shared private preview must call the same data-driven rendering components. For a public published page: query authorized published event, resolved template version, event design and blocks. For an editor draft preview: pass the draft model; change only side-effect flags/mode, not a separate lookalike renderer.

Define default section/block sets per event type. Wedding: story, ceremony, reception, schedule, gallery, RSVP, registry, FAQ. Birthday: celebrant/about, activities, details, gallery, RSVP, wishlist. Graduation: graduate, institution/program, ceremony/celebration, directions, RSVP, gallery. Housewarming: home note, directions, event details, RSVP, gift/help note. Memorial/funeral: obituary/tribute, services, order of service, directions, livestream, condolences/candles, family support; hide registry/party effects by default. Corporate/product launch: agenda, venue, registration, speaker/brand blocks. Do not show irrelevant blocks simply because they exist.

### G. Content block builder and creative controls

Implement a real schema-driven block system with add, remove, duplicate, reorder, move up/down fallback, and drag-and-drop. Drag UI must be keyboard accessible; do not rely only on drag to reorder. New block insertion should preview immediately, IDs remain stable, and persistence stores the serializable block config rather than React elements/functions.

Block library requested:
- Hero, Rich Text, Photo, Photo Gallery, Video (allowlisted YouTube/Vimeo embed only), Map/Venue, Countdown, RSVP Form, Gift Registry/Contribution, Programme/Timeline, Quote, Divider, Button, FAQ, Music Player, Guestbook/Tributes, Livestream Embed; Custom HTML is advanced and must be sanitized/isolated or disabled until safely implemented.

Each block has common settings (padding, background, text alignment, max width, scroll animation) plus type-specific fields. Per-block validators provide inline errors. Preserve undo safety (at least confirm destructive delete); ideally provide undo for common edits. Reorder/visibility must be shared with preview, save and public rendering.

Typography controls: at least 10 curated preset font pairings including Playfair + Inter, Cormorant + Lato, DM Serif + DM Sans; size scale, heading tracking and body line-height sliders. Custom font upload can be marked Pro only when billing/storage permissions exist; do not fake a working upload.

Colour controls: at least 20 curated palettes grouped by event type; custom primary/secondary/accent/background/text; calculate contrast (WCAG AA targets) and warn/offer accessible correction when contrast is insufficient. Optional gradient builder off by default; no default purple-pink gradients.

Image controls: choose/upload image, crop and focal point, zoom/reposition and filters (warm/cool/monochrome/sepia/vintage/cinematic). Use local uploaded event media when available. Unsplash/API search must be backed by a configured API/provider and licensing guidance; do not scrape or put API secrets in client code. AI image creation is optional/pro-tier only if configured; label generated assets honestly.

Layout controls: single/two-column where appropriate, compact/comfortable/spacious spacing, square/soft/round/pill corner preset, border none/thin/thick/dotted, scroll animation style and speed. All must actually affect preview and serialized config.

### H. Occasion diversity and Kenyan authenticity

Use the canonical event categories already defined in `src/lib/events/categories.ts`—do not create an unrelated duplicate list. Cover wedding, engagement, anniversary, birthday, graduation, housewarming, memorial, funeral, baby shower, bridal shower, corporate, holiday, reunion, religious milestone, cultural celebration, retirement, product launch, fundraiser, community, welcome baby, farewell, get well and custom/other.

The snapshot's template catalogue currently includes multiple real template ids but fewer categories than the canonical 23. Audit the actual catalogue in the active project and expand actual designed templates; adding only filter labels does not count. Each new template needs an id, category, visual description, palette, typeface, hero layout, default section/block sequence, event-appropriate motion, and appropriate image assets. Ensure template categories and event types remain backward-compatible with existing saved events.

Art direction examples:
- weddings/engagement/anniversary: romantic, minimal, botanical, cultural/formal, editorial, bright modern choices; Victorian is only one style option;
- birthday: Ruby Disco, color-pop, adult dinner, kids' party, coastal, playful, gift-led; no wedding default;
- graduation: black/navy/gold, school colours, modern editorial, cap/academic-inspired motifs;
- housewarming: home/architecture, plants, cozy interiors, terracotta, modern illustrated keys; no wax seal as the mandatory look;
- funeral/memorial: dignified ivory, slate, botanical green or family-preferred colour, clear service information and respectful transitions;
- baby/welcome-baby: soft contemporary, illustrated, joyful, inclusive;
- corporate/product launch/fundraiser/community: brand-led, editorial, structured agenda and accessible layouts;
- religious/cultural/reunion/retirement/farewell/get-well: suitable symbolism and content chosen respectfully, not stereotypes.

For image requirements, prioritize images depicting Black Kenyan people and relevant places/settings when a person/location is shown. Use licensed, configured image providers or commissioned/generated assets; do not claim an image is Kenyan just because prompt says so. Ethnic specifics and traditional attire should only be used when relevant to the template's intent and described accurately. Avoid turning people into stereotypes. In solemn templates do not use overly sentimental “sad person” stock art. Maintain image alt text and crop per device.

### I. Full guest invitation behavior

The public `/e/[slug]` experience must render the invitation from event/template/design/block data and be responsive. It needs:
1. Optional envelope opening with replay/skip controls, then hero; if guest has already opened it in current session, don't force repeated motion on every route re-entry.
2. Guest or household greeting from the secure invitation token, not query-string free text. Couples/families display according to selected household.
3. Category-specific sections and ordering; missing fields hide gracefully.
4. Live countdown (days/hours/minutes/seconds), timezone aware; after event time display “Today is the day” when appropriate or passed-state. Avoid hydration mismatch; clean timer intervals.
5. Add to calendar: a valid downloadable `.ics` file plus Google Calendar link and optionally Outlook/Yahoo. Include event title, description, local time with correct timezone, location, end time and alarms. For memorial events at distinct service/burial times, create separate calendar events/files or a deliberate multi-event calendar feed; don't merge different locations into one inaccurate interval.
6. Venue map/directions: use valid configured map URLs/coordinates; provide Open in Google Maps / Apple Maps / directions actions. Multiple locations should switch clearly. Avoid exposing keys and don't present a static map as interactive if it isn't.
7. RSVP form with `yes/no/maybe` policy if enabled, inline validation, plus-one limits, household token linking, dietary fields and event-specific custom questions; success/error/retry states. Preview submits nowhere real.
8. Contributions: only show configured methods; M-Pesa section explains till/paybill/send-money reference accurately. Use sandbox/simulation clearly labelled if no actual Daraja service/credentials. Never collect payments based only on client-side “success”.
9. Music: user initiated, visible play/pause, no browser autoplay assumptions, respects mute and reduced-motion/data constraints; only use licensed/authorized media.
10. Background motion presets: none, petals, confetti, bokeh, leaves, soft snow, candle flicker or doves when relevant. Respect event category; throttle particles and fully disable or simplify under reduced motion/low-end mobile.
11. Gallery with responsive image delivery, keyboard accessible lightbox, alt text and error/loading states.
12. Social sharing and copy link with actual success feedback; only published invitation gets public link.

### J. RSVP, guests, event lifecycle, notifications

Complete the inviter loop: draft → preview → guest config → RSVP policy → review → publish → share → monitor → update/resend → close/archive. Save Draft and Publish are distinct actions. Review shows required fields and blockers; publishing is server-side and only succeeds if authorization, required details and state transitions pass.

Guests: add/edit/delete household; plus-one limit; groups; CSV mapping/validation with row feedback and duplicate policy; import should **not** auto-send messages; separate contact permission/consent from invitation existence. Show household totals vs attendee headcount clearly. Generate high-entropy invitation tokens with hashed storage; tokens should be revocable/rotatable. Do not leak guest data/tokens in list or event duplication.

RSVP host dashboard: counts and filters must derive from real event-scoped data; protect export endpoints and validate data. Test optimistic vs failed actions. Don't use hardcoded host id `host-1` or sample names as real account. Confirm that RSVP/guest APIs verify event ownership or a valid guest token.

Notifications: manual WhatsApp `wa.me` link is not the same as automated WhatsApp Cloud API. Automated sends must have provider configuration, approved message templates as applicable and recorded consent. Email/SMS needs adapters, retries, idempotency and truthful UI. If unavailable, expose copy/export/ready-to-send flow, not a fake “sent” status.

### K. Data persistence, authentication and security

The supplied snapshot uses an in-memory `mockDb` and prototype/demo auth patterns. This is a demo limitation, not production storage. First preserve current interfaces. Then create a clear repository/data access abstraction and documented production path for persistent database; do not claim persistence until an actual DB adapter, migration, environment variables and integration tests are present. If selecting Supabase/Prisma/Drizzle/another provider, inspect current docs/environment and use one consistent choice; don't add three providers.

Auth requirements: account creation/login/logout, verified email flow/recovery if intended, protected inviter routes and API, session validation server-side and owner-scoped data. Invitees can open invitation and RSVP without creating Kadi accounts. Owner APIs must prove the signed-in owner owns the event before editing/publishing/exporting. Validate payloads with Zod or existing schema patterns, rate-limit public RSVP/guest-token endpoints, avoid returning private contact data, avoid logs with secrets, use secure and HttpOnly cookie patterns through the auth provider, and store token hashes rather than raw tokens where supported. Do not store real passwords/API secrets in the client or demo data.

M-Pesa production integration must wait for provider credentials, approvals, callback validation, idempotency, reconciliation and operational/legal checks. A “simulation” must be visibly labelled as simulation.

### L. Responsive images and viewport rules

Use Next `<Image>` for local/remote images where appropriate, configure remote patterns if remote hosts are used, supply `alt`, `sizes`, width/height or `fill` with a positioned parent, and specify `object-position` per template. Serve efficient formats and avoid shipping large desktop composites as phone images. Use art-direction sources or CSS source variants for mobile crops when necessary.

The landing hero must show navigation, main headline, supporting copy, CTA and hero visual inside typical first viewport at desktop and phone sizes. On compact viewport, reduce nonessential spacing; do not shrink text below accessible readable sizes. For event imagery, a mobile image crop can differ from desktop only through explicit approved responsive assets or CSS focal point—not by loading a huge unbounded image.

Test breakpoints and visual sizes: 320×568, 360×800, 375×667, 390×844, 430×932, 768×1024, 1024×768, 1280×800 and 1440×900. Also test short-height landscape and browser safe areas. No horizontal overflow, hidden CTA, covered RSVP controls or content under sticky navigation.

### M. Loading, error, empty, and confirmation states

Every data-driven route must have designed loading skeletons, first-use empty states with a relevant next action, inline validation, retry states and useful errors. Don't use empty icons + “No data”, full page spinners, generic “Something went wrong” with no recovery, or toast for every trivial action. Do not fake network transitions or counts.

### N. Required deliverables after each phase

For the implementation phase you are asked to execute, deliver:
- direct code changes in existing source (not only a plan or a separate demo app);
- list of files changed and reason;
- any schema/types migration and compatibility notes;
- screenshots from actual running app at desktop and mobile for visual phases;
- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` results with actual exit status and useful logs; run relevant tests after each phase and all checks at final gate;
- functional walk-through for keyboard + touch paths;
- a list of remaining blockers/credentials and what is mocked versus production-ready.

If environment blocks a command (e.g., package install, native esbuild or Next SWC fetch), state the exact blocker and don't call it passed.

## Phase plan — execute each prompt in order

- `prompts/00_AUDIT_BASELINE.md`
- `prompts/01_DESIGN_SYSTEM_AND_SHARED_SHELL.md`
- `prompts/02_LANDING_PAGE.md`
- `prompts/03_TEMPLATE_DIVERSITY_AND_ASSETS.md`
- `prompts/04_LIVE_PREVIEW_STUDIO.md`
- `prompts/05_ENVELOPE_AND_MOTION.md`
- `prompts/06_CANONICAL_INVITATION_RENDERER.md`
- `prompts/07_CONTENT_BLOCK_BUILDER_AND_CONTROLS.md`
- `prompts/08_COUNTDOWN_CALENDAR_MAPS.md`
- `prompts/09_RSVP_GUESTS_CONTRIBUTIONS.md`
- `prompts/10_AUTH_PERSISTENCE_SECURITY.md`
- `prompts/11_MOBILE_ACCESSIBILITY_PERFORMANCE.md`
- `prompts/12_ROUTE_POLISH_AND_CONTENT_STATES.md`
- `prompts/13_RELEASE_QA.md`

Start now with phase 00. Do not try to implement all 14 phases in one unreviewed mega-diff. Execute with focused changes and keep the app functional between phases.
