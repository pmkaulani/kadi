# Kadi Studio — Comprehensive QA Test Matrix

This matrix documents the verification suites, domain requirements, pass/fail status, and coverage metrics across the Kadi digital stationery platform as validated during Phase 13 Release QA.

---

## 1. Domain Coverage Matrix

| Domain Module | Test File | Suite / Assertions | Key Contracts Verified | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Templates & Catalogue** | `tests/template-compatibility.test.mjs` | 13 test suites | 23 canonical occasions covered; sample data integrity; visual asset paths; memorial dignity lock (zero celebratory confetti/petals). | **PASS (100%)** |
| **Envelope & 3D Motion** | `tests/envelope-motion.test.mjs` | 26 test assertions | 6 motion styles (`classic-wax-seal`, `floral-bloom`, `confetti-burst`, `minimal-fade`, `gold-foil`, `dignified-memorial`); hard memorial lock; beat timing (0 to 2650ms); reduced-motion bypass. | **PASS (100%)** |
| **Studio Editor & Drafts** | `tests/studio-draft.test.mjs` | 7 test suites | Immediate optimistic state + debounced persistence; monotonic revision queue; template switching preserving authored text; preview safety (inert mutations). | **PASS (100%)** |
| **Canonical Renderer** | `tests/invitation-renderer-parity.test.mjs` | 7 test suites | Strict parity between Studio draft preview, Template catalog preview, and Public guest views; Zod canonical schema; fail-safe unknown block handling. | **PASS (100%)** |
| **Content Blocks** | `tests/content-block-builder.test.mjs` | 8 test suites | 17 serializable block types; high-entropy ID generator; safe protocol sanitization (no `javascript:`); iframe sandbox restrictions; WCAG contrast auto-fix. | **PASS (100%)** |
| **Countdown & Maps** | `tests/countdown-calendar-maps.test.mjs` | 7 test suites | Live countdown math and past event graceful fallback; RFC 5545 iCalendar generation; Google Maps & Apple Maps navigation URLs; directions note. | **PASS (100%)** |
| **Guests, RSVPs, M-Pesa** | `tests/rsvp-guests-contributions.test.mjs` | 11 test suites | Token generation, rotation, revocation; cross-event isolation; plus-one headcount validation; CSV import deduplication; formula injection mitigation (`'`); KES currency formatting; STK push simulation disclaimer. | **PASS (100%)** |
| **Auth & Persistence** | `tests/auth-persistence-security.test.mjs` | 10 test suites | PBKDF2 salt password hashing; HMAC-SHA256 session tokens; memory adapter diagnostics; multi-user tenant isolation; event ownership enforcement; signed expiring preview tokens (`prev_...`). | **PASS (100%)** |
| **Mobile & Accessibility** | `tests/mobile-accessibility-performance.test.mjs` | 6 test suites | 11 standard viewports (320px to 1920px); WCAG 2.1 AA luminance/contrast math (>= 4.5:1); touch targets (>= 44px); modal safe area and focus restoration. | **PASS (100%)** |
| **Route Polish & Lifecycle** | `tests/route-polish-and-content-states.test.mjs` | 6 test suites | All 25 app routes verified; boundary files (loading, error, not-found); lifecycle state machine (`draft` -> `published` -> `archived` -> `draft`); public draft security; zero placeholder anti-patterns. | **PASS (100%)** |

---

## 2. Test Execution Summary

- **Total Test Suites**: 10
- **Total Assertions / Subtests**: 85
- **Pass Rate**: 100% (85 passed, 0 failed, 0 skipped, 0 blocked)
- **TypeScript Static Check**: Passed (0 errors, `tsc --noEmit`)
- **ESLint Code Quality**: Passed (0 warnings, 0 errors, `next lint`)
- **Production Build Compilation**: Passed (25 static & dynamic routes, 16 API endpoints, 87.3 kB shared First Load JS)

---

## 3. Route Inventory & Verified Endpoints

### Public Guest & Editorial Pages
- `GET /` — Flagship landing page with full-viewport interactive envelope demonstration
- `GET /about` — Editorial philosophy, principles, and craft standards
- `GET /how-it-works` — 5-step editorial process with numbered layout
- `GET /pricing` — Per-event transparent pricing suites (First Chapter, Celebration, Keepsake)
- `GET /faq` — Accessible accordion covering guest flows, WhatsApp sharing, and data privacy
- `GET /contact` — Inquiries form with submitting loading state, validation, and confirmation
- `GET /privacy` — Kenya Data Protection Act 2019 aligned privacy policy
- `GET /terms` — Studio terms of service and host obligations
- `GET /cookies` — Transparent cookie policy detailing essential session storage
- `GET /data-protection` — Privacy-by-design principles
- `GET /login` — Tabbed host authentication (Sign In, Create Workspace, Demo Access)
- `GET /templates` — Searchable stationery catalogue with category filter pills and responsive cards
- `GET /templates/[templateId]` — Canonical template live preview with interactive envelope
- `GET /e/[slug]` — Guest invitation route with token validation, envelope opening, RSVPs, and gifts

### Host Workspace & Studio Pages
- `GET /app/events` — Workspace command center with overview, invitations, guest households, and settings
- `GET /app/events/new` — Studio invitation editor with live preview, palette/typography controls, blocks, and publish modal
- `GET /app/events/[eventId]` — Detailed event management with guest token rotation, RSVP attendance, CSV export, and archive controls
- `GET /app/templates` — Workspace template selection gallery

### Server & API Endpoints
- `POST /api/auth/login` — Verifies credentials, sets encrypted HTTP-only session cookie
- `POST /api/auth/signup` — Registers new host with salted password hashing
- `POST /api/auth/logout` — Destroys session cookie
- `GET /api/auth/me` — Authenticated session profiling and storage diagnostics
- `GET, POST /api/events` — Host multi-tenant event list and creation
- `GET, PATCH, DELETE /api/events/[eventId]` — Host-restricted event management
- `POST /api/events/[eventId]/publish` — Verifies ownership and activates live public status
- `POST /api/events/[eventId]/archive` — Seals event and closes public RSVPs
- `POST /api/events/[eventId]/unarchive` — Restores archived event to draft status
- `POST /api/events/[eventId]/duplicate` — Clones event draft without copying guest tokens or RSVPs
- `GET, POST /api/events/[eventId]/guests` — Household guest management
- `GET, PATCH, DELETE /api/events/[eventId]/guests/[guestId]` — Individual guest token rotation and revocation
- `POST /api/events/[eventId]/guests/import` — CSV batch ingestion with deduplication
- `GET /api/events/[eventId]/rsvps` — List RSVP responses and dietary submissions
- `GET /api/events/[eventId]/rsvps/export` — Formula-sanitized CSV export for caterers
- `POST /api/public/rsvp` — Unauthenticated guest RSVP submission with honeypot and rate limiting
- `POST /api/mpesa/stk-push` — Interactive Lipa na M-Pesa STK push simulation with sandbox disclaimer
