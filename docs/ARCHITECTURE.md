# KADI — Technical Architecture Document

## 1. System Overview
Kadi is a mobile-first digital invitation platform designed specifically for Kenyan and global events (weddings, birthdays, memorials, baby showers, graduations, anniversaries, corporate and community events).

```
                      +-----------------------------------+
                      |       Clients (Mobile / Web)      |
                      +-----------------+-----------------+
                                        |
               +------------------------+------------------------+
               |                                                 |
               v                                                 v
    [ Public & Guest Portal ]                         [ Host Dashboard & Studio ]
  - Responsive Invitation Reveal                     - Event Creation Wizard
  - 3D Animated Envelope & Card                      - Template & Theme Editor
  - Event Sections (Timeline/Map)                    - Guest & Household Manager
  - Interactive RSVP Submission                      - CSV Contact Importer
  - Condolences / Tributes / Candles                 - RSVP Analytics & Export
  - Direct Host Payment Details                      - Share Hub & WhatsApp Links
               |                                                 |
               +------------------------+------------------------+
                                        |
                                        v
                          +---------------------------+
                          |   Next.js 14 App Router   |
                          | (React 18 + TypeScript)   |
                          +-------------+-------------+
                                        |
       +--------------------------------+--------------------------------+
       |                                |                                |
       v                                v                                v
[ Domain Services ]           [ Security & Auth ]             [ Provider Adapters ]
- Event & Sections Service    - Session Management            - Storage (S3 / Local Mock)
- Template Engine & Schema    - Host Auth & RBAC              - Email (Resend / Mock)
- Household & Attendee Core   - High-Entropy Guest Tokens     - WhatsApp (Native / Meta Cloud)
- RSVP Engine & Constraints   - Rate Limiting                 - M-Pesa (Daraja STK / Manual)
- Export & Audit Service      - KDPA Compliance & Deletion    - Jobs (Background Queue)
       |                                |                                |
       +--------------------------------+--------------------------------+
                                        |
                                        v
                          +---------------------------+
                          |  Database / Persistence   |
                          | (PostgreSQL Schema / ORM  |
                          |  & Development Mock Repo) |
                          +---------------------------+
```

---

## 2. Technology Stack & Rationale

| Layer | Selection | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) + React 18 | Unified architecture for server-side rendered public invitations with high SEO/performance, alongside interactive client-rendered animated studio components. |
| **Language** | TypeScript (Strict) | Enforces compile-time type safety across database entities, API payloads, template schemas, and UI components. |
| **Styling & Design Tokens** | Tailwind CSS + CSS Variables | Enables dynamic theming per event and template while maintaining a consistent design token system. |
| **Animation System** | Framer Motion + Pure CSS 3D | Coordinates complex multi-stage timelines (seal snap, flap 3D fold, card emergence, text reveal) without the bloat or licensing overhead of competing animation suites. |
| **Forms & Schemas** | React Hook Form + Zod | Schema-first client & server validation ensuring data integrity across complex nested attendee and question structures. |
| **Icons & Media** | Lucide React + Bespoke SVGs | Crisp vector icons with zero emoji reliance for official brand and UI elements. |
| **Database** | PostgreSQL + Relational Repositories | ACID transactions for RSVP counts, plus-one limits, household attendees, and audit logs. |
| **Testing** | Node.js Test Runner / Vitest / E2E | Fast unit and integration tests covering the envelope timeline, RSVP limits, CSV parsing, token security, and payment adapters. |

---

## 3. Directory Layout

```
kadi/
├── docs/                        # Architecture, blueprint, security, and test documentation
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── KADI_PLATFORM_BLUEPRINT.md
│   ├── SECURITY_AND_PRIVACY.md
│   └── TEST_PLAN.md
├── src/
│   ├── app/                     # Next.js App Router routes
│   │   ├── (auth)/              # Host authentication routes (/login, /register, etc.)
│   │   ├── (dashboard)/         # Host management dashboard (/app/...)
│   │   │   └── app/
│   │   │       ├── events/      # Event list, creation wizard, and management
│   │   │       └── settings/    # Host workspace and profile settings
│   │   ├── (public)/            # Public marketing pages (/, /templates, /how-it-works, /pricing, etc.)
│   │   ├── e/                   # Public & personalized invitation routes (/e/[slug])
│   │   ├── api/                 # REST API endpoints (/api/events, /api/guests, /api/rsvps, etc.)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/              # Modular UI components
│   │   ├── animation/           # 3D Envelope, flap, liner, card emergence renderer
│   │   ├── ui/                  # Reusable accessible primitives (Button, Modal, Input, Badge, etc.)
│   │   ├── layout/              # Navbars, footers, dashboard shells
│   │   ├── invitations/         # Event-specific section components (wedding, birthday, memorial, etc.)
│   │   └── editor/              # Real-time template & design studio controls
│   ├── lib/                     # Core domain logic, schemas, and adapters
│   │   ├── db/                  # Data models, schema definitions, and repository interfaces
│   │   ├── schemas/             # Zod validation schemas (event, guest, RSVP, template)
│   │   ├── templates/           # Built-in template catalogue, themes, and motion presets
│   │   ├── services/            # Domain service logic (events, guests, rsvp, exports)
│   │   ├── adapters/            # External provider adapters (email, whatsapp, mpesa, storage)
│   │   └── utils/               # Formatting, date-time, token generation, and helpers
└── public/                      # Static assets, SVG liners, seal graphics, and logos
```

---

## 4. Key Subsystems

### 4.1 Signature Invitation Renderer
The signature invitation renderer (`src/components/animation/EnvelopeRenderer.tsx`) is designed with 7 physical layers:
1. Envelope back & pocket body (`perspective: 1200px`)
2. Envelope flap with 3D hinge rotation (`rotateX(0deg)` to `rotateX(-180deg)`)
3. Decorative envelope liner with pattern/texture
4. Interactive seal button with haptic/visual press feedback
5. Physical invitation card with upward translation (`translateY(0)` to `translateY(-120%)`) and layered paper elevation shadow
6. Card settling transition expanding to hero viewport
7. Staggered typography and hero photo reveal

### 4.2 Household & Attendee RSVP Model
Unlike simplistic platforms that assume one invite equals one attendee, Kadi separates:
- **Household / Invitation Entity:** The unit of sharing and access (e.g. "The Wanjiku Family", "Dr. Peter & Guest"). Holds the private token, group, and plus-one allowance.
- **Individual Attendees:** Distinct records for each named individual or plus-one, capturing exact meal choices, dietary requirements, and individual attendance status.

### 4.3 Resilience & Fallback Guarantees
- **No JS / Reduced Motion:** Renders a clean, accessible editorial card directly without blocking page interaction.
- **Missing Credentials:** Provider adapters fall back cleanly to transparent development sandboxes with explicit UI labeling (never claiming simulated transactions are live).
