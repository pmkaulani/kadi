# Kadi editorial redesign — change log

## Design direction
- Replaced the purple/gold SaaS visual direction with warm paper, ink, terracotta and muted brass.
- Added `docs/DESIGN_DIRECTION.md` as the visual source of truth, including brand tokens, logo direction, layout principles, motion and explicit anti-patterns.
- Updated `docs/DECISIONS.md`, the full blueprint Markdown and the Antigravity prompt so old visual references do not override the new direction.
- Replaced the gradient diamond/envelope logo treatment with a custom folded-folio SVG mark and serif `kadi.` wordmark.

## Main interface changes
- Rebuilt the public home page with editorial typography, asymmetric image composition, a real interactive envelope demonstration and numbered editorial sections instead of repeated feature cards.
- Rebuilt template browsing around varied image-led invitation plates and simple typographic filters rather than a uniform rounded-card grid.
- Reworked pricing, How it Works, About, Contact and FAQ into ruled editorial layouts.
- Updated login to an editorial split composition and made the demo-only authentication status explicit.
- Reworked the host navigation and events dashboard to use a side rail, one featured event composition and line-based rows rather than piles of cards.
- Reworked event creation as a three-step invitation studio with occasion rows, image-led designs and a live preview.
- Changed the invitation renderer after the envelope reveal to a full-width, scrollable editorial event page instead of a centered card on a dark background.
- Reworked schedule and venue content, selected RSVP and condolence sections, and simplified shared input/button/card styling.
- Changed FAQ and privacy-by-design copy to avoid claiming integrations or legal compliance that have not been verified in production.

## Validation status
- `node node_modules/typescript/bin/tsc --noEmit` — passed.
- `node node_modules/next/dist/bin/next lint` — passed with no warnings or errors.
- `npm test` — could not run because the uploaded `node_modules` contains `@esbuild/win32-x64`, which cannot execute in the Linux validation environment.
- Full browser visual review and production build have not been completed in this environment. The source archive excludes `node_modules` and `.next`; install dependencies on the target machine before running the application.

## Phase 05 — Refine Envelope Realism and Motion
- **Canonical Envelope Renderer**: Refactored `src/components/animation/EnvelopeRenderer.tsx` into the single authoritative component for template previews (`/templates/[templateId]`), live studio editor (`DraftInvitationPreview`), and guest invitation routes (`/e/[slug]`).
- **Physical Paper Substrate & Layering**:
  - Base paper substrate with inline SVG fractal noise data URI (`--iv-paper-grain`) for authentic paper tooth and tactile fiber texture without external HTTP asset dependencies.
  - Multi-tier ground contact shadows and deep throat cavity shadow (`.iv-throat-shadow`).
  - True 3D hinged top flap (`transform-origin: 50% 0%`, `transform-style: preserve-3d`) rotating -178° on open, with inner face liner (`transform: rotateX(180deg)`) rendering right-side-up when folded back.
  - Embossed wax seal with bevel rim, monogram letter styling, ribbon cord medallion, and dynamic lift/fade physics.
  - Staggered paper inserts (RSVP card and Service/Details card) peeking out with authentic readable typography and borders.
- **6 Opening Motion Presets**:
  1. `classic-wax-seal`: Traditional seal break, subtle deflection, regal card rise.
  2. `floral-bloom`: Soft romantic card rise with gentle petal drift.
  3. `confetti-burst`: Celebratory party flutter with multi-hued geometric confetti for birthdays and jubilees.
  4. `minimal-fade`: Crisp corporate wafer seal with subtle linear card reveal.
  5. `gold-foil`: Shimmering metallic seal, radiant liner, and opulent card rise.
  6. `dignified-memorial`: Candlelight reverent reveal with zero celebratory confetti or floating petals.
- **Strict Memorial Constraint**: Enforced at the core of `resolveEnvelopeMotionStyle()`: memorial and funeral events are strictly locked to `dignified-memorial` regardless of host or URL overrides.
- **Timeline Choreography & Safety**:
  - Explicit 6-beat sequence (seal press at 0ms, seal release at 320ms, flap swing at 570ms, card & insert rise at 1120ms, settling at 1920ms, settled full page at 2650ms).
  - Escape key listener and "Skip intro" button immediately clear all pending timer IDs and settle without race conditions.
  - Unmount cleanup (`useEffect` clearing `timerRefs.current`) preventing memory leaks and orphaned timers.
  - Full `prefers-reduced-motion: reduce` support via `useReducedMotionPreference()`, instantly jumping to settled invitation.
  - Strict audio safety: no autoplay; sound plays strictly on explicit user gesture.
- **Studio Editor Integration**: Added "Opening Motion Choreography" dropdown in `KadiStudioEditor.tsx` with dynamic lock for memorial categories and live updates in draft state.
- **Verification & Testing**:
  - `tests/envelope-motion.test.mjs`: 26/26 tests passing (100%), verifying all 6 styles, memorial hard locks, category fallbacks, and cancellation timers.
  - `npm run typecheck`: 0 errors.
  - `npm run build`: Production build verified.
  - Visual verification: 13 high-resolution desktop (1440x900) and mobile (390x844) screenshots captured in `docs/screenshots/phase05/`.

## Phase 06 — Canonical Invitation Configuration and Renderer Parity
- **Single Canonical Configuration Schema (`CanonicalInvitationConfig`)**:
  - Implemented strictly-typed Zod schemas (`CanonicalInvitationConfigSchema`, `EventEntityConfigSchema`) in `src/lib/invitations/config.ts`.
  - Defined serializable configuration covering event identity, host & celebrant names, schedule, venue, countdown, registry/contributions, guest RSVP rules, envelope styling, motion style, and customizable ordered section blocks.
  - Implemented typed builder functions: `buildPublishedInvitationConfig()`, `buildTemplatePreviewInvitationConfig()`, `buildDraftPreviewInvitationConfig()`, and `buildPrivateReviewInvitationConfig()`.
- **Single Canonical Invitation Renderer (`InvitationRenderer`)**:
  - Created `src/components/invitations/InvitationRenderer.tsx` as the single authoritative renderer across all 4 modes:
    1. Template preview (`/templates/[templateId]`)
    2. Studio live draft preview (`DraftInvitationPreview.tsx`)
    3. Guest invitation page (`/e/[slug]`)
    4. Private host/review links
  - Eliminated duplicate renderer markup across the entire application: every preview and guest view now consumes the identical component hierarchy (`InvitationThemeScope` -> `EnvelopeRenderer` -> `InvitationSectionsRenderer`).
- **Section Ordering & Graceful Degradation**:
  - `resolveActiveSections()` respects custom host ordering while filtering hidden sections.
  - Dynamic countdown block (`CountdownSection.tsx`) with live countdown calculations and dignified fallback for past dates.
  - Graceful omission: missing optional sections (e.g. absent photo gallery, empty FAQ, missing story milestones) cleanly omit rather than showing empty borders or placeholder copy.
  - Fail-safe block dispatcher: unknown or experimental block types trigger a safe console warning without crashing the guest invitation page.
  - Memorial/funeral dignity safeguards: registry celebration cards and gift registries are strictly stripped from funeral/memorial events.
- **Side-Effect Safety**:
  - Enforced `previewMode: true` in template gallery and studio draft previews to guarantee RSVP submissions, guest check-ins, and M-Pesa push triggers are simulated or disabled without mutating production records.
- **Verification & Testing**:
  - `tests/invitation-renderer-parity.test.mjs`: 7 comprehensive test suites passing (33/33 tests total across the repo).
  - Backwards compatibility tests verifying historical event models seamlessly parse into the canonical schema.
  - Production build (`npm run build`) succeeded with 0 TypeScript errors.
  - High-resolution visual screenshots captured in `docs/screenshots/phase06/` across desktop and mobile.

## Phase 07 — Content-Block Builder and Creative Controls
- **Serializable Block Registry (`src/lib/blocks/`)**:
  - Implemented 17 typed canonical blocks: `hero`, `rich-text`, `photo`, `gallery`, `video`, `venue-map`, `countdown`, `rsvp`, `contribution`, `timeline`, `quote`, `divider`, `button`, `faq`, `music`, `guestbook`, `livestream`.
  - Defined `CommonBlockSettingsSchema` and `InvitationBlockConfigSchema` in `src/lib/blocks/types.ts` with strict Zod validation.
  - Built high-entropy stable ID factory `createBlockId` (`blk_<type>_<timestamp>_<rand>`), pure array helpers (`createBlock`, `duplicateBlock`, `reorderBlocks`), and security sanitizers (`sanitizeUrl`, `sanitizeVideoUrl`, `sanitizeLivestreamUrl`).
  - Added schema migration helper `migrateEventToBlocks` ensuring backwards compatibility for legacy events and strictly enforcing dignity rules (stripping gift registries for funeral/memorial events).
- **Security & XSS Neutralization**:
  - Strict host allowlisting for YouTube and Vimeo video embeds (`youtube-nocookie.com`, `player.vimeo.com`).
  - Sandboxed video iframe permissions (`sandbox="allow-scripts allow-same-origin allow-presentation"`).
  - Safe protocol allowlisting for buttons and action links (restricting to `http:`, `https:`, `mailto:`, `tel:`; rejecting `javascript:`, `data:`, `vbscript:`).
  - Zero raw HTML injection: eliminated `dangerouslySetInnerHTML` across host-authored inputs.
- **Creative Controls & Live WCAG AA Contrast**:
  - 12 curated font pairings in `src/lib/design/presets.ts` spanning editorial serif, contemporary sans, warm geometric, and neoclassical display.
  - Interactive typographic scale and rhythm sliders (font scale, heading letter spacing, body line height) mapped to CSS custom variables in `InvitationThemeScope.tsx`.
  - 20 category-tailored palette presets covering weddings, graduations, birthdays, memorials, and corporate galas.
  - 5 customizable color slots (primary, secondary, accent, cardBackground, text) with real-time WCAG 2.1 contrast ratio calculations and AAA / AA / Warning status badges.
  - 1-click "Auto-Fix Contrast" button that algorithmically computes and applies high-contrast compliant ink colors guaranteeing at least 4.5:1 ratio.
- **Studio Block Builder UI (`src/components/studio/ContentBlockBuilder.tsx`)**:
  - Drag-and-drop block reordering powered by `framer-motion` Reorder components.
  - Full keyboard accessibility with dedicated Move Up / Move Down buttons.
  - Block duplicate, enable/disable toggle, and delete with non-blocking Undo toast.
  - Categorized Add Block modal with filter pills (All, Content, Media, Logistics, Social, Styling).
  - Inline block editor tabs ("Content" and "Layout & Motion Settings") for editing padding, max-width, text alignment, corner styles, and scroll motion.
- **Unified Renderer Parity (`src/components/blocks/BlockRenderer.tsx`)**:
  - Integrated into `InvitationSectionsRenderer.tsx` and `InvitationRenderer.tsx` to ensure 100% parity across draft preview, template previews, and guest routes.
- **Verification & Testing**:
  - `tests/content-block-builder.test.mjs`: 10 test suites verifying all 17 blocks, immutability, video/URL sanitization, legacy migration, dignity rules, font pairings, and contrast math.
  - All 43 test suites passing across the codebase (`npm test`).
  - `npm run typecheck`: 0 errors.
  - `npm run build`: Production build verified with all 20 static and dynamic routes.
  - 6 verified screenshots captured in `docs/screenshots/phase07/`.

## Phase 08 — Countdown, Calendar, and Venue Maps
- **Countdown Engine (`src/lib/countdown/timer.ts`)**:
  - Robust datetime parsing supporting unambiguous ISO 8601 strings, Kenyan 12/24h timestamps (`2:00 PM EAT`), and human date strings.
  - Timezone-aware calculation engine supporting Africa/Nairobi (UTC+3, no DST) and arbitrary IANA timezones.
  - Three state lifecycles: upcoming (`days`, `hours`, `minutes`, `seconds`), start day ("Today is the day!"), and passed event ("This event has passed.").
  - Ticking interval cleanup on unmount; client-side ticking only after mount to guarantee hydration safety and prevent server/client timestamp mismatches.
  - Subtle digit flip transition powered by Framer Motion respecting `prefers-reduced-motion` settings.
- **Calendar & RFC 5545 .ics Generator (`src/lib/calendar/`)**:
  - RFC 5545 `.ics` generator with special character escaping (`\\`, `\;`, `\,`, `\n`), line folding (> 75 octets via CRLF + space), `VTIMEZONE`, and unique `UID` / `DTSTAMP`.
  - Multi-stage reminder alarms (`VALARM`) for 1 day (24 hours) and 1 hour before event start.
  - Culturally-aware multi-event `.ics` generator separating distinct ceremony & reception moments (for weddings) or church requiem mass & graveside burial (for funerals/memorials) so geographically distinct venues are never conflated into a single calendar item.
  - Direct web calendar URL generators for Google Calendar (`ctz=Africa/Nairobi`), Microsoft Outlook Web (`outlook.live.com`), and Yahoo Calendar (`calendar.yahoo.com`) without dead or inert buttons.
  - Browser-native `.ics` file download helper supporting full multi-event itinerary downloads as well as individual segment downloads.
- **Venue Maps & Location Engine (`src/lib/maps/index.ts`)**:
  - Intelligent multi-venue resolver (`extractVenuesFromEvent`) identifying distinct venues for weddings (ceremony church vs reception grounds) and funerals (church service vs burial cemetery) with curated coordinate defaults for prominent Kenyan landmarks (All Saints Cathedral, Safari Park Hotel, Consolata Shrine, Lang'ata Cemetery, Windsor Golf, etc.).
  - Multi-venue switcher tabs with dedicated venue badges, start/end times, and parking notes.
  - Platform-aware directions generator supporting Google Maps navigation, Apple Maps navigation (`maps.apple.com`), and OS-detected "Get Directions".
  - Privacy-friendly, API-key-free OpenStreetMap interactive iframe embed centered at venue coordinates with zoom control and OpenStreetMap attribution.
  - Safe fallback rendering for events without configured venue locations.
- **Renderer Parity & Studio Integration**:
  - Upgraded `CountdownSection.tsx` and `VenueSection.tsx` components.
  - Connected `countdown` and `venue-map` cases in `BlockRenderer.tsx` with parity across draft previews, template previews, and public guest pages.
  - Responsive positioning for `AddToCalendarDropdown` on mobile devices avoiding horizontal overflow.
- **Verification & Testing**:
  - `tests/countdown-calendar-maps.test.mjs`: 9 new unit test suites verifying countdown transitions, Kenyan timezone handling, RFC 5545 line folding/escaping, multi-event `.ics`, web calendar links, and multi-venue extraction.
  - All 52 test suites passing across the codebase (`npm test`).
  - `npm run typecheck`: 0 errors.
  - `npm run build`: Production build verified with all 20 static and dynamic routes.
  - 5 verified screenshots captured in `docs/screenshots/phase08/`.


## Phase 09 — RSVP, Guest Management, Contributions, and Communications
- **Guest Management & Household Tokens (`src/lib/services/guest-service.ts`)**:
  - Implemented high-entropy cryptographic token generation (`generateHighEntropyToken`, `tok_...` 32-char crypto-random) with SHA-256 hash storage (`computeTokenHash`, `hash_...`).
  - Added instant token rotation (`rotateGuestToken`) and revocation (`revokeGuestToken`) with real-time invalidation.
  - Kenyan E.164 phone normalization (`normalizeKenyanPhoneNumber`) and phone validation (`isValidPhoneNumber`).
  - Robust CSV import parser (`parseCsvText`, `importGuests`) supporting flexible header aliases (`name`, `fullname`, `phone`, `mobile`, `email`, `group`, `plusones`, `plus_ones`, `notes`), duplicate contact detection, row-level error reporting, and non-destructive skip mode.
  - Strict privacy safeguard: CSV guest imports never trigger automatic background messaging.
- **Guest RSVP Submissions & Security (`src/lib/services/rsvp-service.ts`, `src/app/api/public/rsvp/route.ts`)**:
  - Frictionless guest RSVP flow: guests require zero accounts or sign-ins.
  - Cross-event token rejection throwing explicit HTTP/service errors if an Event A token is submitted against Event B.
  - Untokenized open RSVP policy check (`allowUntokenizedRsvp`): rejects untokenized submissions for private/closed guest lists.
  - Strict plus-one cap enforcement based on household invitation limits.
  - Named attendee records: collects explicit names and dietary preferences for every attendee in `mockDb.attendees`, completely separated from household invitee entities.
  - Resubmission deduplication: updates existing records rather than producing orphan duplicates.
  - Rapid submission debouncing (<1500ms) and anti-spam honeypot fields (`hp_field`, `website`) with rate limiting (10 requests/min).
  - Formula injection mitigation (`exportRSVPsCSV`, `sanitizeCsvCell`): prepends `'` to cells starting with `=`, `+`, `-`, `@`, `\t`, or `\r` to neutralize spreadsheet macro execution in exported caterer CSVs.
- **Contributions & M-Pesa Integration (`src/lib/services/mpesa-service.ts`, `src/app/api/mpesa/stk-push/route.ts`)**:
  - Conditional rendering: contributions section only renders when the host has explicitly configured payment options.
  - Supports Buy Goods Till (5-8 digits), Paybill (5-7 digits with account reference), and Send Money (Kenyan mobile).
  - Kenyan currency formatting (`formatKES`) for amounts (e.g. `KES 2,500`).
  - Interactive STK Push simulation modal with clear sandbox disclaimer banner: explicitly clarifies that test pushes simulate guest UI flows without debiting bank accounts or settling balances without webhook verification.
  - Formatted step-by-step SIM toolkit instructions for manual Lipa na M-Pesa payments.
- **Notifications & Multi-Channel Sharing (`src/lib/services/notification-service.ts`, `src/components/ui/QrCode.tsx`)**:
  - Dependency-free pure SVG QR code generator (`QrCode.tsx`) with instant SVG download capability.
  - Private preview token generator (`generateShareUrl`) creating expiring tokens (`prev_...`) for unpublished drafts.
  - One-click WhatsApp direct sharing link (`wa.me`) with pre-filled personalized event greetings, clearly distinguished from automated background messaging.
  - Automated delivery audit card displaying provider configuration readiness (WhatsApp Cloud API, Africa's Talking SMS) without premature "Sent" status markers.
- **Command Center & Studio Integration**:
  - `src/components/invitations/RsvpSection.tsx`: Headcount selector dynamically revealing named attendee inputs, dietary restrictions, song request, and privacy consent.
  - `src/components/invitations/RegistrySection.tsx`: Interactive STK push modal, live Lipa na M-Pesa manual steps, KES formatting, and config validation.
  - `src/app/app/events/[eventId]/page.tsx`:
    - Guest tab: Token link display, copy link, rotate token button, revoke button, CSV importer summary.
    - RSVP tab: Sub-tab switcher between `Household Submissions` and `Named Attendees List`, caterer CSV export button.
    - Share Hub tab: Draft preview token banner, guest personalization dropdown, pure SVG QR code with download, WhatsApp preview, direct `wa.me` button, and automated provider status audit card.
    - Contributions tab: Live instruction card preview, "Test STK Push Simulation" button opening interactive modal with sandbox protocol disclaimer.
- **Verification & Testing**:
  - `tests/rsvp-guests-contributions.test.mjs`: 11 comprehensive unit test suites covering token isolation, rotation/revocation, named attendees, plus-one limits, CSV parsing & duplicates, formula injection mitigation, M-Pesa validation, STK push simulation, and Notification service.
  - All 63 test suites passing across the codebase (`npm test`).
  - `npm run typecheck`: 0 errors.
  - `npm run build`: Production build verified with all 20 static and dynamic routes.
  - 5 verified screenshots captured in `docs/screenshots/phase09/`.


## Phase 10 — Production-Minded Persistence and Auth Boundaries
- **Database Adapter & Repository Boundary (`src/lib/db/adapters/`, `src/lib/db/index.ts`)**:
  - Defined strict interface `IDatabaseAdapter` decoupling UI services from data storage engines.
  - Implemented `MemoryDatabaseAdapter` providing sandbox memory storage with honest diagnostic reporting (`isPersistent: false`, driver: `memory`), pre-seeded demo hosts (`host-1`, `host-2`), and complete multi-user isolation.
  - Provided `src/lib/db/schema.sql` with full PostgreSQL 14+ / Supabase DDL:
    - Tables: `users`, `events`, `event_designs`, `guest_households`, `attendees`, `rsvp_submissions`, `condolences`.
    - Foreign keys with `ON DELETE CASCADE`, composite indexes, and status constraints.
    - Full Row Level Security (RLS) policies for multi-tenant isolation, public guest RSVPs, and host-restricted exports.
- **Verified Authentication & Session Security (`src/lib/auth/`, `src/app/api/auth/`)**:
  - Secure password hashing using Node.js PBKDF2 (`hashPassword`) with salt and constant-time equality verification (`verifyPassword`).
  - Cryptographically signed HMAC-SHA256 session tokens (`createSessionToken`, `verifySessionToken`).
  - Secure HTTP-only cookies (`kadi_session`, `httpOnly: true`, `sameSite: 'lax'`, `path: '/'`, 7-day expiration).
  - Implemented `/api/auth/login` (rejecting invalid credentials with 401), `/api/auth/signup` (validating unique email, name, and 8+ char password), `/api/auth/logout` (clearing session cookie), and `/api/auth/me` (returning session profile and database diagnostics).
  - Updated `src/app/login/page.tsx` with tabbed Sign In / Create Workspace forms, real API authentication, and a verified demo access action.
  - Updated workspace layout `src/app/app/layout.tsx` to handle true session sign out via `/api/auth/logout`.
- **Server-Side Protection & Event Ownership Enforcement (`src/middleware.ts`, `src/app/api/events/`)**:
  - Added Next.js Edge Middleware (`src/middleware.ts`) server-side protecting `/app/**` routes, bouncing unauthenticated requests to `/login?from=...`.
  - Protected every event, guest, import, publish, duplicate, and export API handler with session verification and event ownership validation:
    - `/api/events`: GET filters exclusively by `session.id`; POST binds `hostId` to authenticated user.
    - `/api/events/[eventId]`: GET, PATCH, DELETE reject non-owners with 403 Forbidden.
    - `/api/events/[eventId]/publish`: POST verifies ownership before publishing.
    - `/api/events/[eventId]/duplicate`: POST verifies ownership, creating a clean draft under the caller.
    - `/api/events/[eventId]/guests/**`: GET, POST, PATCH, DELETE verify event ownership; prevents tampering with guests across host boundaries.
    - `/api/events/[eventId]/rsvps/**`: GET and CSV export verify event ownership; non-owners are rejected with 403 Forbidden.
- **Payload Validation, State Transitions, and Slug Uniqueness (`src/lib/validation/events.ts`, `src/lib/services/event-service.ts`)**:
  - Enforced event status state machine (`isValidStatusTransition`): `draft` -> `published` -> `archived`; rejects illegal transitions (e.g. `archived` directly to `published`).
  - Slug collision prevention: `EventService.generateUniqueSlug` guarantees unique event slugs in storage.
  - Zod validation for event creation/updates and guest import batches (capping plus-ones from 0 to 10 and file batches to 500 rows).
- **Draft Slug Security & Data Leak Prevention (`src/lib/services/notification-service.ts`, `src/app/e/[slug]/page.tsx`)**:
  - Cryptographically signed, expiring preview tokens (`prev_...`) using HMAC-SHA256 and expiration timestamps for unpublished drafts.
  - Public guest page (`/e/[slug]`) strictly blocks unauthenticated draft access; guessing draft slugs returns 404 / "Draft Invitation Unavailable".
  - Sanitized public responses (`EventService.sanitizeForPublic`): strips internal host IDs, M-Pesa API secrets, and guest contact information.
- **Clean Event Duplication**:
  - Duplicating an event creates a new `draft` event owned by the caller.
  - Strictly does NOT duplicate RSVP submissions, attendees, or guest tokens.
- **Verification & Testing**:
  - `tests/auth-persistence-security.test.mjs`: 10 comprehensive unit test suites covering password hashing, HMAC sessions, adapter diagnostics, multi-user ownership isolation, event duplication security, signed preview tokens, status state transitions, slug uniqueness, and data leak prevention.
  - All 73 test suites passing across the codebase (`npm test`: 73 passed, 0 failed).
  - `npm run typecheck`: 0 errors.
  - `npm run build`: Production build verified with all 25 static and dynamic routes.
  - 5 verified screenshots captured in `docs/screenshots/phase10/`.

## Phase 11 — Mobile Experience, Accessibility, Responsive Imagery, and Performance
- **Comprehensive Documentation & Design Standard (`docs/MOBILE_IMAGE_PERFORMANCE_AND_ACCESSIBILITY.md`)**:
  - Detailed design specification establishing strict responsive standards, 11 standard test viewports, next/image conventions, touch target ergonomic rules, modal safe area padding, and WCAG 2.1 AA contrast requirements.
- **Next.js Responsive Image Optimization (`next/image`)**:
  - Eliminated all raw `<img>` tags in favor of `next/image` (`Image` component) across all core components and pages:
    - `src/app/app/events/page.tsx`: Workspace event hero cover photos and user avatars.
    - `src/components/visual-reference/HeroBackdropCarousel.tsx`: Landing page hero slideshow with `priority` on initial frame, responsive `sizes="100vw"`, and object-cover fill.
    - `src/components/animation/kadi-invitation-kit/motion/AnimatedTimeline.tsx`: Milestone cards with responsive `sizes="(max-width: 640px) 100vw, 400px"`.
    - `src/components/animation/kadi-invitation-kit/motion/PhotoMasonry.tsx`: Dynamic masonry layout with responsive sizes.
    - `src/components/invitations/BirthdayAboutSection.tsx`: Birthday honouree portraits with responsive sizes.
    - `src/components/invitations/GallerySection.tsx`: Single, double, and mosaic photo gallery layouts with responsive image sizing.
    - `src/components/blocks/BlockRenderer.tsx`: Content-block photo and gallery blocks with fill and aspect ratio containers.
  - Configured remote patterns in `next.config.mjs` for `images.unsplash.com` and `api.dicebear.com`.
  - Zero `@next/next/no-img-element` ESLint warnings across the entire build.
- **Mobile Stacked Cards Pattern for Dense Tables**:
  - Converted multi-column desktop tables on mobile viewports (`< 640px`) to touch-friendly stacked cards:
    - `src/app/app/events/page.tsx`: All Guest Households and RSVPs display as individual cards with guest status badges, contact info, and a full-width "Copy personal link" button (`sm:hidden`).
    - `src/app/app/events/[eventId]/page.tsx`: Guest Households, RSVP Submissions, and Named Attendees lists render as stacked cards on mobile with touch-optimized action buttons (Copy Link, Rotate Token, Revoke, Delete) while cleanly preserving the tabular layout on desktop (`hidden sm:block`).
- **Studio Editor Mobile Experience (`KadiStudioEditor.tsx`)**:
  - Implemented mobile segmented toggle with `Edit` and `Preview` controls (`aria-pressed`), allowing hosts to seamlessly alternate between full-width editing forms and live invitation previews on small screens.
  - Compact mobile action bars with safe spacing and elevated z-index controls.
- **Dialog & Bottom Sheet Accessibility (`src/components/ui/Modal.tsx`)**:
  - Focus return management: automatically captures `document.activeElement` prior to opening and restores keyboard focus to the triggering element upon dialog dismissal.
  - Safe-area inset support: added `pb-[env(safe-area-inset-bottom)]` and responsive bottom-sheet formatting on mobile.
  - Body scroll locking (`overflow: hidden`) while open, escape key dismissal, and proper `aria-modal="true"`.
- **WCAG 2.1 AA Compliance & Ergonomics**:
  - Color contrast: verified >= 4.5:1 for body copy and >= 3:1 for large headings across both light paper and dark envelope surfaces.
  - Touch targets: ensured all primary interactive buttons, tabs, and action links meet minimum 44×44px hit areas.
  - Reduced motion: media query `prefers-reduced-motion: reduce` honored across all motion primitives, instantly settling envelopes and animated components without nausea or vertigo.
- **Verification & Testing**:
  - `tests/mobile-accessibility-performance.test.mjs`: 6 test suites verifying 11 viewports (320x568 up to 1920x1080), WCAG AA luminance/contrast math, reduced motion fallbacks, touch target standards, and modal accessibility contracts.
  - All 79 test suites passing across the codebase (`npm test`: 79 passed, 0 failed).
  - `npm run typecheck`: 0 errors.
  - `npm run build`: Clean production build with 25 routes, 0 ESLint warnings, 87.3 kB shared First Load JS.
  - 9 multi-viewport screenshots captured and visually verified in `docs/screenshots/phase11/`:
    - `01-viewport-320x568-homepage-hero.png` (Ultra-compact mobile 320px)
    - `02-viewport-375x667-templates-browse.png` (Compact iPhone SE 375px)
    - `03-viewport-390x844-workspace-stacked-cards.png` (Standard mobile stacked cards 390px)
    - `04-viewport-393x852-studio-editor-mobile.png` (Studio editor Edit/Preview switch 393px)
    - `05-viewport-430x932-command-center-guests.png` (Event command center phablet 430px)
    - `06-dialog-accessible-focus-safe-area.png` (Modal dialog safe area & focus 390px)
    - `07-viewport-768x1024-tablet-portrait.png` (Tablet portrait 768px)
    - `08-viewport-1440x900-desktop-workspace.png` (Desktop workspace 1440px)
    - `09-viewport-390x844-public-invitation.png` (Public mobile envelope reveal 390px)

## Phase 12 — Route Polish and Content States
- **Complete Route Inventory & Visual Alignment**:
  - Audited and verified all 25 Next.js app routes and 16 API endpoints.
  - Harmonized public pages (`/about`, `/how-it-works`, `/pricing`, `/faq`, `/contact`, `/privacy`, `/terms`, `/cookies`, `/data-protection`, `/login`, `/templates`, `/e/[slug]`) to use unified editorial reading widths, warm paper palettes (`#F6F2EA` and `#EDE5D9`), terracotta accents (`#934638`), and shared `PublicNavbar` and `PublicFooter`.
  - Re-architected `/cookies`, `/privacy`, and `/terms` away from legacy white SaaS layouts into numbered editorial layouts matching `/data-protection` and `/about`.
  - Linked `/cookies` in `PublicFooter.tsx` alongside Privacy, Terms, and Data Protection.
- **Global & Scoped Error / Loading / Not-Found Boundaries**:
  - `src/app/not-found.tsx`: Global editorial 404 page ("This stationery has moved.") featuring serif typography, helpful navigation, and studio branding.
  - `src/app/error.tsx`: Global client error boundary with recovery action ("Try Again") and error reference reporting.
  - `src/app/loading.tsx`: Global loading screen with delicate pulse and paper styling.
  - `src/app/app/loading.tsx`: Realistic workspace loading skeleton with animated shimmer for sidebar, metrics, featured event, and activity rows.
  - `src/app/app/error.tsx`: Workspace client error boundary with section reload and return to dashboard actions.
  - `src/app/app/not-found.tsx`: Workspace resource missing screen with direct links to dashboard and new event studio.
  - `src/app/e/[slug]/loading.tsx`: Guest invitation loading screen featuring envelope silhouette and wax monogram.
  - `src/app/templates/[templateId]/loading.tsx`: Template preview loading screen.
- **Event Lifecycle State Machine & Publishing Success**:
  - Implemented complete lifecycle state machine: `draft` -> `published` -> `archived` -> `draft` (`isValidStatusTransition`).
  - Added `archiveEvent(id)` and `unarchiveEvent(id)` to `EventService` and implemented `/api/events/[eventId]/archive` and `/api/events/[eventId]/unarchive` endpoints with strict HMAC session ownership checks.
  - Differentiated Save Draft from Publish:
    - `src/app/app/events/new/page.tsx`: Added `PublishSuccessModal` showing celebration banner, public live link, copy button with copied toast feedback, and quick actions to manage guests or preview live.
    - `src/app/app/events/[eventId]/page.tsx`: Integrated `PublishSuccessModal` and `ArchiveConfirmModal` explaining archive consequences.
    - Added an archive status banner in the event command center when archived with a 1-click "Restore to Draft" button.
  - Public guest invitation route (`/e/[slug]`):
    - Unauthorized drafts display an editorial "Private Draft · Authorization Required" screen with host sign-in link.
    - Concluded/archived events display an editorial "This celebration has concluded" message.
- **Form Interactivity & Anti-Pattern Elimination**:
  - Added submitting loading states (`isSubmitting`), disabled states, and inline error handling to the Contact page (`/contact`).
  - Verified zero forbidden placeholder anti-patterns (`Coming soon`, `Lorem ipsum`, `dummy text`, `TODO`) across all pages.
  - All navigation and footer links verified to resolve to existing route files with zero dead `#` targets.
- **Verification & Testing**:
  - `tests/route-polish-and-content-states.test.mjs`: 6 comprehensive test suites verifying route inventory, boundary files, lifecycle state transitions, preview token security, navigation integrity, and QA anti-pattern checks.
  - All 85 test suites passing across the codebase (`npm test`: 85 passed, 0 failed).
  - `npm run typecheck`: 0 errors.
  - `npm run build`: Production build verified with all 25 static & dynamic routes and 16 API endpoints.
  - 12 verified screenshots captured in `docs/screenshots/phase12/`:
    - `01-route-pricing.png`
    - `02-route-how-it-works.png`
    - `03-route-about.png`
    - `04-route-contact-form.png`
    - `05-route-faq-accordion.png`
    - `06-route-cookies-policy.png`
    - `07-route-privacy-policy.png`
    - `08-route-terms-of-service.png`
    - `09-route-data-protection.png`
    - `10-route-global-404.png`
    - `11-event-lifecycle-command-center.png`
## Phase 13 — Release QA & Verification Gate
- **Release Verification Execution**:
  - `npm run typecheck`: 0 TypeScript errors across the entire codebase.
  - `npm run lint`: 0 ESLint errors, 0 warnings.
  - `npm test`: 85/85 tests passed (100% pass rate across all 10 domain suites in `docs/QA_TEST_MATRIX.md`).
  - `npm run build`: Production build verified with all 25 app routes and 16 API endpoints.
  - Automated headless Chrome console & hydration audit: 0 console errors, 0 runtime exceptions, 0 hydration mismatches across key flows.
- **Dual-Viewport Screenshot Verification**:
  - Captured 24 screenshots across Desktop (1440×900) and Mobile (390×844) viewports in `docs/screenshots/phase13/`:
    - `01-home-desktop.png` & `01-home-mobile.png` (Flagship landing page)
    - `02-templates-desktop.png` & `02-templates-mobile.png` (Templates catalogue)
    - `03-login-desktop.png` & `03-login-mobile.png` (Authentication screen)
    - `04-workspace-events-desktop.png` & `04-workspace-events-mobile.png` (Host workspace dashboard)
    - `05-studio-editor-desktop.png` & `05-studio-editor-mobile.png` (Live studio editor)
    - `06-command-center-desktop.png` & `06-command-center-mobile.png` (Event command center)
    - `07-occasion-wedding-desktop.png` & `07-occasion-wedding-mobile.png` (Wedding suite)
    - `08-occasion-birthday-desktop.png` & `08-occasion-birthday-mobile.png` (Birthday suite)
    - `09-occasion-memorial-desktop.png` & `09-occasion-memorial-mobile.png` (Memorial suite)
    - `10-occasion-graduation-desktop.png` & `10-occasion-graduation-mobile.png` (Graduation suite)
    - `11-occasion-housewarming-desktop.png` & `11-occasion-housewarming-mobile.png` (Housewarming suite)
    - `12-occasion-corporate-desktop.png` & `12-occasion-corporate-mobile.png` (Corporate suite)
- **Visual Reference Audit & 3 Discovered Mismatches Repaired**:
  - **Mismatch 1 (Graduation & Corporate Occasion Covers)**: Fixed unstyled `.iv-occasion-cover` in `EnvelopeRenderer.tsx` and `globals.css` with a responsive 2-column editorial grid, serif `Playfair Display` headings, category theme nuances, middle dot metadata separators, and contained imagery.
  - **Mismatch 2 (Housewarming Template Slug Alias)**: Fixed 404 on `/templates/a-place-to-call-home` by updating `getTemplateById` in `src/lib/templates/catalogue.ts` with alias and slugified title fallback mapping to `first-home-botanical`.
  - **Mismatch 3 (Command Center Tabs & Mobile Clearance)**: Replaced legacy `border-brand-purple` styling with warm terracotta token `#934638` and added `pb-28 lg:pb-6` bottom padding in `KadiStudioEditor.tsx` to prevent the mobile nav bar from obscuring form controls.
  - **Hydration Fix**: Eliminated Next.js SSR hydration mismatch in `CountdownSection.tsx` via `mounted` guard and `suppressHydrationWarning`.
- **Release Documentation (`docs/RELEASE_QA_REPORT.md`)**:
  - Published comprehensive release QA verification report documenting all test runs, exit codes, screenshot paths, code health audits, and remaining live external provider prerequisites.

## Important
This is a source-level redesign of the supplied prototype. Some services remain mock/local implementations and are not production integrations. The old SQL/schema and blueprint source material remain included as planning references; they still need migration and security review before production.




