# Source-aware audit — Kadi supplied repository snapshot

## Method and boundaries

This file is based on inspection of the project source archive at `/mnt/data/kadi.zip` that was attached in the conversation, extracted in the work environment. It describes that snapshot, not a guarantee that the current local Antigravity workspace has the same files or edits. Antigravity must re-inspect the open repo and update findings before changing files.

## Stack and scripts observed

- Next.js `14.2.x`, App Router; React `18.3.x`; TypeScript.
- Tailwind CSS `3.4.x` (not Tailwind v4 in the supplied snapshot).
- Framer Motion `11.11.x`, Lucide React `0.454.x`, React Hook Form, Zod, `clsx`, `tailwind-merge`.
- Scripts: `dev` on port 3005, `build`, `start`, `lint` via `next lint`, `typecheck` via `tsc --noEmit`, `test` via `tsx --test tests/*.test.*`.
- Test files include adapter, event lifecycle, guest token/CSV, RSVP constraints and template compatibility suites.

## Route inventory observed

Public pages:
- `/` → `src/app/page.tsx` → imports `KadiReferenceLanding`.
- `/templates`, `/templates/[templateId]`.
- `/e/[slug]` published guest invitation.
- `/how-it-works`, `/about`, `/contact`, `/faq`, `/pricing`, `/login`, `/privacy`, `/terms`, `/cookies`, `/data-protection`.

Inviter workspace:
- `/app/events` event dashboard/list and guest/RSVP/notification/settings-related panels.
- `/app/events/new` wizard.
- `/app/events/[eventId]` event command centre / design / guest / RSVP areas.
- `/app/templates` workspace templates.

APIs observed in archive:
- `/api/events` and `/api/events/[eventId]`.
- additional routes include publish, duplicate, guests/import, guests, RSVP export and public RSVP (inspect actual tree before relying on them; paths have changed between source versions).

## Core files to inspect

- Public homepage: `src/app/page.tsx`, `src/components/visual-reference/KadiReferenceLanding.tsx`, `src/components/landing/KadiFullViewportHero.tsx`, `src/components/layout/PublicNavbar.tsx`, `PublicFooter.tsx`, `src/app/globals.css`.
- Creation: `src/app/app/events/new/page.tsx`.
- Event workspace: `src/app/app/events/page.tsx`, `src/app/app/events/[eventId]/page.tsx`, `src/app/app/templates/page.tsx`.
- Guest experience: `src/app/e/[slug]/page.tsx`, `src/app/templates/[templateId]/page.tsx`.
- Motion: `src/components/animation/EnvelopeRenderer.tsx`, `WaxSeal.tsx`, `MotionToolkit.tsx`, and `src/components/animation/kadi-invitation-kit/EnvelopeExperience.tsx`, `themes.ts`, `envelope.css`, `motion.css`.
- Category / template data: `src/lib/events/categories.ts`, `src/lib/templates/catalogue.ts`, `src/lib/templates/types.ts`.
- Event and guest data: `src/lib/db/types.ts`, `src/lib/db/mock-db.ts`, `src/lib/services/event-service.ts`, `guest-service.ts`, `rsvp-service.ts`.
- API security: all `src/app/api/**/route.ts` files.

## Findings and action required

### 1. Preview parity / draft state (critical)
`src/app/app/events/new/page.tsx` contains many individual React state fields (template id, category, colour, font, envelope, letter style, title, hosts, celebrants, date/time/venue/city, etc.). A field updating state doesn't prove the currently visible renderer uses all those fields. Test every control against what the guest will actually see. The editor and public guest route must use the same invitation rendering components and typed configuration. Keep instant React state changes separate from debounced saves. Build tests for preview propagation and save races.

### 2. Envelope implementation duplication and physical fidelity (critical)
The snapshot contains `EnvelopeRenderer.tsx` and another `kadi-invitation-kit/EnvelopeExperience.tsx`. Multiple implementations can cause the editor, template demo and guest route to animate differently. Select one canonical renderer or make a single public wrapper that delegates to one implementation. Verify flap hinge, paper layering, liner, seams, card lift and wax seal physically against supplied imagery. Avoid one wedding/romance fallback for all categories.

### 3. Homepage length and hero composition (high)
`src/app/page.tsx` currently renders the `KadiReferenceLanding` component. In the snapshot it has four top-level occasion cards (Weddings, Birthdays, Memorials and “& More”), followed by an image/copy “How it works” section and closing CTA. It uses ordinary `<img>` for some category/content images. Expand the below-fold marketing story to showcase the breadth of Kadi and template discovery. Do not make the hero itself longer than the viewport. Verify headline + CTA + image + navigation fit in the first screen on phones.

### 4. Occasion breadth and catalogue truth (high)
`src/lib/events/categories.ts` defines 23 canonical event categories. `src/lib/templates/catalogue.ts` has 28 named template definitions in the supplied snapshot, but the available templates cover only a subset of the 23 categories (wedding, birthday, memorial, baby-shower, graduation, housewarming, funeral, anniversary, corporate, holiday, engagement, community are represented; the catalogue must be recomputed in the current workspace). The UI needs curated template coverage, art-directed images, and category defaults rather than filters without actual templates. Ensure new template ids remain stable.

### 5. Data model already contains useful event detail fields
`src/lib/db/types.ts` includes EventEntity rich fields for event dates/timezone/venue, programme, story milestones, ceremony/reception, FAQs, birthday information/activity/menu, memorial obituary/services/order of service/candles/livestream, audio, M-Pesa type/number/recipient/reference and more. Reuse and validate existing fields before adding overlapping fields. If the current schema lacks generic content blocks or complete design controls, add a versioned typed config and migration plan rather than duplicating `EventEntity` data in a new frontend-only structure.

### 6. Persistence/auth/security blocker
The snapshot's `EventService`, `GuestService`, and `RSVPService` use `mockDb` in memory, and workspace views contain demo assumptions such as `host-1`; the login screen is prototype/demo-oriented according to source documentation. In-memory data can reset and is not multi-user durable. Protect every event/guest/export/publish operation by verified session and owner authorization. Keep invitee RSVP account-free. Production database and authentication are a distinct workstream; do not fake their availability.

### 7. RSVP, guest and provider honesty
Existing code includes guest token concepts and RSVP constraints/services; maintain those safeguards. CSV import must not send invitations as a side effect. Do not call M-Pesa real unless callback, idempotency, reconciliation and provider credentials are set up. Manual WhatsApp link sharing is not automated Cloud API dispatch. Public draft preview needs a scoped expiring private token, not a public guessable slug.

### 8. Mobile/viewport
Use a viewport-aware hero and explicit mobile editor tabs; don't reduce a desktop 3-column design into unreadable narrow panels. Verify horizontal overflow, safe areas, sticky controls and image crop at 320/360/375/390/430 widths and 768/1024/1280/1440 widths. Provide reduced-motion support.

## What is already present

- Multiple invitation section components including story, venue, gallery, schedule, registry, FAQ, RSVP and memorial/birthday-specific sections.
- An envelope renderer, wax seal and motion toolkit.
- Template definitions and canonical 23 event categories.
- API route skeletons and test files for event lifecycle, guest tokens/CSV, RSVP constraints and template compatibility.
- `tests/` and npm scripts for typecheck/lint/test/build.

Presence of a file does not mean a feature is correct or production-complete. Each component must be exercised in the actual flow.
