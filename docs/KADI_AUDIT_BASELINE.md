# Kadi Platform Baseline Audit & Architectural Map

**Date:** October 14, 2026  
**Auditor:** Senior Product Designer & Staff Frontend Engineer (Antigravity)  
**Authoritative Workspace:** `c:\Users\STD USER\Desktop\work\kadi`  
**Current Git Baseline:** `main` (clean baseline branch with existing modifications)

---

## Executive Summary

Kadi is a digital invitation and event management platform tailored to Kenyan celebratory and solemn occasions. It combines tactile stationery physics (envelope openings, dimensional wax seals, textured liners) with guest event experiences (RSVP, schedules, maps, M-Pesa gift registries).

This audit documents the state of the active repository before starting the 14-phase implementation overhaul. All findings are derived directly from the active workspace source code, compilation checks, automated test suites, and headless browser captures.

---

## 1. Environment & Stack Baseline

### 1.1 Package & Toolchain Specifications
- **Framework:** Next.js `14.2.15` (App Router)
- **Runtime & Language:** React `18.3.1`, React DOM `18.3.1`, TypeScript `5.6.3`
- **Styling:** Tailwind CSS `3.4.14`, PostCSS `8.4.47`, Autoprefixer `10.4.20`
- **Animation & Motion:** Framer Motion `11.11.17`, `canvas-confetti` `1.9.3`
- **Icons:** `lucide-react` `0.454.0`
- **Forms & Validation:** `react-hook-form` `7.53.0`, `@hookform/resolvers` `3.9.0`, `zod` `3.23.8`
- **Utility:** `clsx` `2.1.1`, `tailwind-merge` `2.5.4`
- **Test Runner:** Node `22.19.0` native runner via `tsx` `4.23.15` (`npm test`)

### 1.2 Baseline Verification Results
All four verification commands were executed directly against the workspace:

| Check | Command | Exit Code | Result Summary |
| :--- | :--- | :---: | :--- |
| **Typecheck** | `npm run typecheck` | `0` | **Passed.** Clean TypeScript compilation without emit. |
| **Lint** | `npm run lint` | `0` | **Passed (0 errors, 15 warnings).** Warnings originate from `<img>` usage in `KadiReferenceLanding`, `new/page.tsx`, and `layout.tsx` instead of `next/image`. |
| **Unit Tests** | `npm test` | `0` | **Passed (16 of 16 tests passing).** Covers M-Pesa adapter gates, WhatsApp deep links, event lifecycle, guest tokens, RSVP constraints, and template catalogue compatibility. |
| **Production Build** | `npm run build` | `0` | **Passed.** Successfully compiled 20 static and dynamic routes. Production build artifacts generated in `.next/`. |

---

## 2. Comprehensive Inventory of Repository Assets

### 2.1 Route Inventory (App Router)

#### Public Routes
- `src/app/page.tsx`: Root landing page delegating to `KadiReferenceLanding`.
- `src/app/templates/page.tsx`: Public template gallery with category filter rail and cards.
- `src/app/templates/[templateId]/page.tsx`: Detailed public preview of an individual template.
- `src/app/e/[slug]/page.tsx`: Public guest invitation route with envelope opening and living sections.
- `src/app/about/page.tsx`: Company story and mission.
- `src/app/how-it-works/page.tsx`: 3-step platform workflow explainer.
- `src/app/pricing/page.tsx`: Pricing tiers and features.
- `src/app/faq/page.tsx`: Frequently asked questions.
- `src/app/contact/page.tsx`: Contact and support form.
- `src/app/login/page.tsx`: Host login / authentication entry point.
- `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/cookies/page.tsx`, `src/app/data-protection/page.tsx`: Compliance and legal pages.

#### Authenticated Host Workspace Routes (`/app/`)
- `src/app/app/layout.tsx`: Sidebar navigation shell with profile header and navigation links.
- `src/app/app/events/page.tsx`: Host event dashboard listing active, draft, and completed events with overview metrics.
- `src/app/app/events/new/page.tsx`: Stepper wizard for creating a new invitation draft.
- `src/app/app/events/[eventId]/page.tsx`: Event command centre featuring 6 tabs: Overview, Guests, RSVPs, Design Studio, Share & Distribution, and Contributions.
- `src/app/app/templates/page.tsx`: Workspace-scoped template picker.

#### API Route Handlers (`src/app/api/`)
- `src/app/api/events/route.ts`: `GET` (list events) and `POST` (create event).
- `src/app/api/events/[eventId]/route.ts`: `GET`, `PATCH` (update), `DELETE` (delete).
- `src/app/api/events/[eventId]/publish/route.ts`: Transition draft event to published.
- `src/app/api/events/[eventId]/duplicate/route.ts`: Clean duplication of event configuration without leaking guest data.
- `src/app/api/events/[eventId]/guests/route.ts`: Guest list management for an event.
- `src/app/api/events/[eventId]/guests/import/route.ts`: Bulk CSV guest importer.
- `src/app/api/events/[eventId]/rsvps/route.ts`: Host RSVP submission retrieval.
- `src/app/api/events/[eventId]/rsvps/export/route.ts`: Export RSVP dataset to CSV.
- `src/app/api/public/rsvp/route.ts`: Public endpoint for guest RSVP submissions.

---

### 2.2 Component Hierarchy & Structure

```
src/components/
├── animation/
│   ├── EnvelopeRenderer.tsx               # Primary 1078-line envelope and stationery animation engine
│   ├── WaxSeal.tsx                        # Dimensional wax seal component with custom monograms and colors
│   ├── MotionToolkit.tsx                  # ScrollParallax and RevealText motion helpers
│   └── kadi-invitation-kit/               # Secondary/alternative envelope package
│       ├── EnvelopeExperience.tsx         # 314-line physical stationery opening experience
│       ├── EnvelopeStylePicker.tsx        # Envelope shape and style selector
│       ├── envelope.css & motion.css      # CSS 3D transforms and keyframes
│       ├── themes.ts & types.ts           # Envelope themes and opening beat contracts
│       └── motion/                        # Physical beats: flap open, wax break, card raise, etc.
├── invitations/                           # Invitation section components
│   ├── InvitationThemeScope.tsx           # CSS variable injector for template palettes and fonts
│   ├── StorySection.tsx                   # Couple/celebrant journey timeline
│   ├── CeremonyReceptionSection.tsx       # Church/ceremony and garden reception split cards
│   ├── VenueSection.tsx                   # Location, Google Maps link, and Add to Calendar
│   ├── ScheduleSection.tsx                # Event timeline and programme schedule
│   ├── BirthdayAboutSection.tsx           # Celebrant spotlight, bio, and fun facts
│   ├── BirthdayActivitiesSection.tsx      # Activities, entertainment, and celebration menu
│   ├── MemorialObituarySection.tsx        # Memorial obituary, life dates, and epitaph
│   ├── MemorialServiceSection.tsx         # Service details, eulogy, and order of service
│   ├── MemorialLivestreamSection.tsx      # YouTube/Vimeo livestream embed
│   ├── MemorialTributesCandlesSection.tsx # Virtual candles lighting and tribute counter
│   ├── CondolencesSection.tsx             # Condolence message wall
│   ├── GallerySection.tsx                 # Photo gallery with modal lightbox
│   ├── FAQSection.tsx                     # Expandable accordion FAQ items
│   ├── RegistrySection.tsx                # M-Pesa Till / Paybill gift instructions
│   ├── RSVPSection.tsx                    # Guest response form with attendance and dietary fields
│   └── ClosingSection.tsx                 # Warm closing note, host sign-off, and calendar action
├── landing/
│   └── KadiFullViewportHero.tsx           # 100svh viewport hero with background carousel
├── layout/
│   ├── PublicNavbar.tsx                   # Public navigation bar with links and CTA
│   └── PublicFooter.tsx                   # Public site footer with columns and copyright
├── templates/
│   ├── OccasionRail.tsx                   # Horizontal scrollable category pill rail
│   └── ResponsiveTemplateCard.tsx         # Responsive template card with hover preview
├── ui/                                    # Base design system primitives
│   ├── Badge.tsx, Button.tsx, Card.tsx, Input.tsx, Logo.tsx, Modal.tsx
└── visual-reference/
    ├── HeroBackdropCarousel.tsx           # Background image transition carousel
    └── KadiReferenceLanding.tsx           # Standalone reference landing layout
```

---

## 3. Data Flow & Preview Parity Trace

### 3.1 New Event Wizard (`src/app/app/events/new/page.tsx`)
A critical divergence was identified between the wizard's inputs and its live preview:

```
[User Form Controls]
├── Category Picker --------> Updates local React state
├── Template Picker --------> Updates selectedTemplateId & sample data
├── Palette Swatches -------> Updates activeColor [DISCONNECTED - Not reflected in preview]
├── Font Selector ----------> Updates selectedFont [DISCONNECTED - Not reflected in preview]
├── Envelope Style ---------> Updates envelopeStyle [DISCONNECTED - Not reflected in preview]
├── Letter Style -----------> Updates letterStyle [DISCONNECTED - Not reflected in preview]
├── RSVP Deadline ----------> Updates rsvpDeadline [DISCONNECTED - Not reflected in preview]
└── Dress Code -------------> Updates dressCode [DISCONNECTED - Not reflected in preview]
```

**Renderer Reality in `new/page.tsx` (Lines 226–269):**
Instead of invoking `EnvelopeRenderer` or the shared invitation sections, the wizard renders a hardcoded static phone card:
```tsx
<div className="w-full max-w-[340px] aspect-[9/16] ...">
  <img src={selectedTemplate.sampleData.heroImage} ... />
  <div className="relative z-10 space-y-3 ...">
    <p>{hosts}</p>
    <h4>{celebrants}</h4>
    <p>{title}</p>
    <p>{date}</p>
    <p>{venue}</p>
  </div>
</div>
```
- **Stale/Unconnected Fields:** Palette colors, typography font families, envelope styles, letter styles, and RSVP policies do not alter the preview card.
- **Persistence State:** The bottom sticky bar displays a static "All changes saved" with a green checkmark (lines 519–522), even though persistence occurs only when clicking "Save Draft" or "Launch Invitation Studio".

### 3.2 Guest Experience Route (`src/app/e/[slug]/page.tsx`)
In contrast to the wizard, the guest route consumes real event data:
1. `EventService.getEventBySlug(slug)` queries the event record.
2. `GuestService.getGuestByToken(token)` resolves household personalization.
3. `EventService.getEventDesign(eventId)` queries custom palette, liner, and seal settings.
4. Renders `InvitationThemeScope` injecting CSS variables for colors and fonts.
5. Renders `EnvelopeRenderer` with the event's metadata.
6. Maps `activeSectionKeys` to individual modular section components.

### 3.3 Event Command Centre Design Studio (`src/app/app/events/[eventId]/page.tsx`)
Tab 4 ("Design & 3D Envelope Studio") renders the true `EnvelopeRenderer` with real sections, but duplicates the entire section mapping logic:
- Lines 848–975 implement a custom reordering and visibility UI.
- Lines 1020–1170 duplicate the 150-line `renderSection` switch statement found in `src/app/e/[slug]/page.tsx`.

---

## 4. Envelope Implementation Audit & Physical Fidelity

### 4.1 Dual Implementation Conflict
The repository contains two competing envelope rendering systems:
1. **`src/components/animation/EnvelopeRenderer.tsx` (1,078 lines):**
   - Active in `e/[slug]` and `events/[eventId]` Tab 4.
   - Implements 7 phases: `closed`, `seal-press`, `seal-release`, `flap-open`, `card-rising`, `settling`, `settled`.
   - Contains themed embellishments (disco ball, botanical flourishes, record player, star field).
   - Manages audio playback, replay triggers, and skip-to-content.
2. **`src/components/animation/kadi-invitation-kit/EnvelopeExperience.tsx` (314 lines):**
   - Self-contained package with `envelope.css`, `themes.ts`, and `physicalBeats.ts`.
   - Implements 3D flap rotation via `preserve-3d` transforms, layered paper insert rise, and wax seal breakage.
   - Currently orphan code not connected to the main guest or editor views.

### 4.2 Fidelity Gap vs. Reference Targets
Comparing against `envelope-and-animations-reference.png` and `envelope-options-reference.png`:
- **Paper Depth & Layering:** Current `EnvelopeRenderer` renders a 2D flat container with CSS box-shadows rather than layered stationery (creased pocket flaps, visible inner liner throat, staggered insert cards).
- **Hinge Physics:** The upper flap in `EnvelopeRenderer` scales vertically rather than rotating along a top horizontal hinge axis with backface perspective.
- **Wax Seal Realism:** Current `WaxSeal.tsx` uses a simple SVG border rather than a beveled stamp with dimensional shadows, edge irregularity, and break particles.
- **Opening Styles:** The references specify 6 distinct envelope forms (Classic Fold, Tri-Fold, Pocket, Ribbon Tie, Wax & String, Scalloped Edge). Current code only supports theme color variations of a single rect shape.

---

## 5. Landing Page & Template Catalogue Audit

### 5.1 Landing Page Route (`src/app/page.tsx`)
- Renders `KadiReferenceLanding.tsx`.
- **First Viewport Fit:** Headless captures confirm the hero fits within `100svh` on desktop (`1440x900`, `1280x800`) and mobile (`390x844`), displaying the headline, CTAs, occasion pills, and background visual without clipping.
- **Below-the-Fold Shortfall:** Below the hero, the page only contains 4 occasion cards (Weddings, Birthdays, Memorials, & More), a brief 3-step "How it works", and a minimal footer.
- **Missing Required Sections:**
  1. Interactive template catalogue preview browser.
  2. Living invitation features showcase (stories, RSVP, map, calendar, M-Pesa).
  3. Host tools overview (guest list, RSVP analytics, WhatsApp link dispatch).
  4. Authentic Kenyan occasions showcase (celebrating cultural variety beyond weddings).
  5. FAQ accordion.
  6. Standard site footer with legal links, social links, and navigation columns.

### 5.2 Baseline Screenshot Evidence
Captured directly from the running production build via Chrome DevTools Protocol (`scratch/capture-screenshot.mjs`):

| File Path | Viewport | Subject |
| :--- | :---: | :--- |
| `docs/screenshots/baseline/landing-1440x900.png` | 1440×900 | Full desktop landing hero |
| `docs/screenshots/baseline/landing-1280x800.png` | 1280×800 | Laptop desktop landing hero |
| `docs/screenshots/baseline/landing-390x844.png` | 390×844 | Mobile responsive landing hero |
| `docs/screenshots/baseline/studio-new-1440x900.png` | 1440×900 | Invitation Studio creation wizard |
| `docs/screenshots/baseline/guest-e-slug-1440x900.png` | 1440×900 | Published guest invitation (`/e/kevin-and-wanjiku`) |
| `docs/screenshots/baseline/guest-e-slug-390x844.png` | 390×844 | Mobile guest invitation (`/e/kevin-and-wanjiku`) |

### 5.3 Template Catalogue Breadth vs. 23 Canonical Categories
Canonical categories in `src/lib/events/categories.ts`: **23 categories**.  
Current templates in `src/lib/templates/catalogue.ts`: **28 templates** covering only **12 categories**.

```
Category Representation Breakdown:
├── Represented Categories (12):
│   ├── Wedding: 3 templates (savannah-twilight, royal-velvet, sage-botanical)
│   ├── Birthday: 6 templates (milestone-gold, ruby-disco, playful-confetti, etc.)
│   ├── Memorial: 2 templates (everlasting-peace, sunset-serenity)
│   ├── Funeral: 2 templates (quiet-remembrance, eternal-rest)
│   ├── Graduation: 3 templates (summit-of-honor, academic-prestige, golden-future)
│   ├── Housewarming: 3 templates (first-home-botanical, warm-hearth, modern-dwelling)
│   ├── Baby Shower: 2 templates (sweet-beginnings, celestial-dreams)
│   ├── Anniversary: 2 templates (golden-years, silver-romance)
│   ├── Corporate: 2 templates (executive-summit, corporate-gala)
│   ├── Holiday: 1 template (festive-cheer)
│   ├── Engagement: 1 template (promise-of-forever)
│   └── Community: 1 template (community-spirit)
└── Unrepresented Categories (11 - Currently 0 templates):
    ├── bridal-shower, reunion, religious-milestone, cultural-celebration,
    ├── retirement, product-launch, fundraiser, welcome-baby,
    └── farewell, get-well, custom
```

---

## 6. Data Architecture, Auth & Security Boundaries

### 6.1 Persistence: `mockDb` In-Memory Limitation
- `src/lib/db/mock-db.ts` stores events, designs, guests, and RSVPs in volatile Node process memory.
- Restarting the server resets all user-created events and drafts.
- Must be abstracted behind repository interfaces to allow a persistent database adapter (PostgreSQL/Supabase/Prisma) without breaking services.

### 6.2 Authentication & Authorization Boundaries
- **Workspace Identity:** Hardcoded to `'host-1'` (Peter Kaulani) across `EventService.listEvents()`, `src/app/app/layout.tsx`, and `src/app/api/events/route.ts`.
- **API Security:** `src/app/api/events/[eventId]/route.ts` executes `PATCH` and `DELETE` without validating caller identity or verifying that the event belongs to the requesting user.
- **Guest Access:** Protected by high-entropy guest tokens (`GuestService.getGuestByToken`), allowing invitees to view personalized greetings and submit RSVPs without an account.

### 6.3 Third-Party Provider Boundaries
- **M-Pesa Adapter (`src/lib/adapters/mpesa-adapter.ts`):** Strictly gates STK Push requests. Returns `disabled_pending_compliance` if credentials or Safaricom merchant approvals are absent. Falls back honestly to manual Paybill/Till instructions.
- **WhatsApp Adapter (`src/lib/adapters/whatsapp-adapter.ts`):** Generates native `wa.me` deep-links for device sharing. Denies automated Cloud API dispatch unless explicit affirmative consent is logged.

---

## 7. Prioritized Issue Table (P0 / P1 / P2)

| ID | Priority | Category | File & Location | Description |
| :--- | :---: | :--- | :--- | :--- |
| **ISS-01** | **P0** | Bug / Architecture | `src/app/app/events/new/page.tsx:226-269` | **Creation Studio Preview Disconnect.** The wizard preview renders a static dummy card; changes to palette, typography, envelope, and letter style do not update the preview. |
| **ISS-02** | **P0** | Architecture | `src/components/animation/` | **Dual Envelope Implementations.** Two parallel codebases (`EnvelopeRenderer.tsx` and `EnvelopeExperience.tsx`) exist with divergent state models, motion controls, and styles. |
| **ISS-03** | **P0** | Architecture / Dry | `src/app/e/[slug]/page.tsx:85-268` & `[eventId]/page.tsx:1020-1170` | **Duplicated Section Rendering Tree.** The 150-line section mapping switch is copied across both files instead of a single canonical renderer. |
| **ISS-04** | **P0** | Security / Auth | `src/app/api/events/[eventId]/route.ts:23-50` | **Unprotected Event Mutation APIs.** Route handlers allow `PATCH` and `DELETE` without authenticating caller session or verifying event ownership. |
| **ISS-05** | **P1** | UI / Completion | `src/components/visual-reference/KadiReferenceLanding.tsx` | **Incomplete Landing Page.** Below-the-fold content lacks featured template browser, living invitation showcase, host tools, Kenyan context section, FAQ, and full footer. |
| **ISS-06** | **P1** | Catalog / Content | `src/lib/templates/catalogue.ts` | **Missing Category Coverage.** 11 of 23 canonical categories have zero templates in the catalogue. |
| **ISS-07** | **P1** | Physical Fidelity | `src/components/animation/EnvelopeRenderer.tsx` | **Missing 3D Stationery Physics.** Upper flap scaling lacks 3D hinge perspective, liner throat reveal is non-dimensional, and wax seal lacks physical break dynamics. |
| **ISS-08** | **P1** | UX / State | `src/app/app/events/new/page.tsx:519-522` | **Misleading Save Status.** Sticky action bar displays "All changes saved" before any persistence has been triggered or confirmed. |
| **ISS-09** | **P2** | Performance / Lint | `src/app/app/events/new/page.tsx`, `KadiReferenceLanding.tsx` | **Raw `<img>` Elements.** 15 lint warnings for unoptimized images lacking `next/image` responsive sizing, srcset, and blur placeholders. |
| **ISS-10** | **P2** | Architecture / DB | `src/lib/db/mock-db.ts` | **Volatile In-Memory Storage.** Data is lost on server reload; requires a clean repository pattern with pluggable persistence adapters. |

---

## 8. Ordered Implementation Phase Plan

Following `PROMPT_INDEX.md`, the implementation will proceed strictly one phase at a time:

1. **Phase 01: Design System & Shared Shell** (`prompts/01_DESIGN_SYSTEM_AND_SHARED_SHELL.md`)
   - Establish shared color tokens, typography scales, radius, spacing, and unified app shell.
2. **Phase 02: Public Landing Page** (`prompts/02_LANDING_PAGE.md`)
   - Expand full-length page below viewport hero with template browser, showcase, host tools, Kenyan context, and FAQ.
3. **Phase 03: Template Diversity & Assets** (`prompts/03_TEMPLATE_DIVERSITY_AND_ASSETS.md`)
   - Expand catalogue to cover all 23 categories with authentic art direction and stable IDs.
4. **Phase 04: Live Preview Studio** (`prompts/04_LIVE_PREVIEW_STUDIO.md`)
   - Unify wizard draft state reducer, connect all controls, debounced persistence, and device switcher.
5. **Phase 05: Envelope & Motion** (`prompts/05_ENVELOPE_AND_MOTION.md`)
   - Deliver 3D stationery realism, hinge flap, wax seal breakage, and 6 physical presets.
6. **Phase 06: Canonical Invitation Renderer** (`prompts/06_CANONICAL_INVITATION_RENDERER.md`)
   - Single shared renderer tree consumed by editor preview, guest page (`/e/[slug]`), and template gallery.
7. **Phase 07: Content Block Builder & Creative Controls** (`prompts/07_CONTENT_BLOCK_BUILDER_AND_CONTROLS.md`)
   - Add/remove/reorder modular blocks, typography presets, palette builder, and image focal point.
8. **Phase 08: Countdown, Calendar & Maps** (`prompts/08_COUNTDOWN_CALENDAR_MAPS.md`)
   - Timezone-safe countdown, `.ics` feed generation, and multi-venue map navigation.
9. **Phase 09: RSVP, Guests & Contributions** (`prompts/09_RSVP_GUESTS_CONTRIBUTIONS.md`)
   - Household limits, custom dietary/survey questions, CSV import, and M-Pesa direct display.
10. **Phase 10: Auth, Persistence & Security** (`prompts/10_AUTH_PERSISTENCE_SECURITY.md`)
    - Session validation, owner-scoped authorization, and database persistence adapter abstraction.
11. **Phase 11: Mobile, Accessibility & Performance** (`prompts/11_MOBILE_ACCESSIBILITY_PERFORMANCE.md`)
    - Touch targets ≥44px, screen-reader semantics, responsive `<Image>` delivery, and reduced motion.
12. **Phase 12: Route Polish & Content States** (`prompts/12_ROUTE_POLISH_AND_CONTENT_STATES.md`)
    - Designed skeletons, zero-data empty states, inline error feedback, and legal pages.
13. **Phase 13: Release QA & Visual Acceptance** (`prompts/13_RELEASE_QA.md`)
    - Full test suite execution, multi-device capture verification, and delivery report.

---

## 9. Baseline Audit Conclusion

The Kadi repository has a sound foundation: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, and working domain adapters. The existing unit test suite (16 tests) and production build are fully functional.

Phase 00 is complete. No destructive edits have been performed. With `docs/KADI_AUDIT_BASELINE.md` recorded and verified against live screenshots, the codebase is ready to begin **Phase 01: Design System & Shared Shell**.
