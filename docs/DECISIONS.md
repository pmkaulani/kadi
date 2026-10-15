# KADI — Architecture & Product Decision Log

This document records architectural, business, provider, compliance, and product decisions for **Kadi**.

---

## 1. Provisional Product Identity
- **Status:** PROVISIONAL / PLANNING
- **Decision:** The working name **Kadi** ("card" in Swahili) is provisional.
- **Decision Gate:** Before public release, verify:
  1. Kenya Registrar of Companies / BRS business name availability.
  2. Kenya Industrial Property Institute (KIPI) trademark registry for Class 9/38/42.
  3. Domain availability (`.co.ke`, `.ke`, `.app`, `.com`) and verified DNS ownership.
  4. Social media and app handle availability without intellectual property infringements.
- **Positioning:** *"Invitations, with feeling."*
- **Visual source of truth:** `docs/DESIGN_DIRECTION.md`. The brand direction is tactile editorial stationery and bespoke event art direction, not purple/gold SaaS styling, generic gradient logo artwork, or rounded-card-heavy layouts.

---

## 2. Core Baseline Technology Stack
- **Status:** ADOPTED
- **Decision:**
  - **Framework:** Next.js (App Router) with React 18 and strict TypeScript.
  - **Styling & Tokens:** Tailwind CSS with the current editorial-stationery system documented in `docs/DESIGN_DIRECTION.md`: paper `#F6F2EA`, ink `#272620`, terracotta `#934638`, muted brass `#B99A62`, secondary ink `#756F64`, and event accents rose `#A94F51`, coral `#BE5A42`, and olive-sage `#747D62`. Older brainstorm palette references are retained for historical context only and must not override the current design direction.
  - **Validation & Forms:** React Hook Form + Zod for shared client/server schema validation.
  - **Database & Persistence:** Relational model supporting PostgreSQL, with clean repository/adapter layer and an in-memory/JSON mock adapter for offline sandbox development and zero-config automated testing.
  - **Motion & Animation:** CSS 3D transforms (`preserve-3d`, `rotateX`, `perspective`) and Framer Motion for the signature envelope flap opening, liner reveal, card emergence, and scroll-revealed sections. No competing heavy animation engines.
  - **Icons & Assets:** Lucide React SVG icon system + custom SVG vector artwork. No raw emojis in production brand UI.

---

## 3. Signature Invitation Interaction Architecture
- **Status:** ADOPTED
- **Decision:** The animated invitation is a **physical object transition**, not a slide transition or fade.
- **Layers:**
  1. Outer envelope body with deep paper drop-shadows.
  2. Flap with 3D hinge perspective (`transform-origin: top`, rotating backwards 180°).
  3. Inner envelope liner (floral, metallic, watercolor, geometric, or solid).
  4. Wax/metallic seal reacting on touch.
  5. Invitation card nestled *inside* the envelope pocket, rising vertically with subtle tilt, settling onto the canvas.
  6. Layered typography & real photo reveal sequence.
  7. Smooth seamless transition into full scrollable event website (countdown, timeline, venue map, RSVP, gallery, condolences/registry).
- **Inclusivity & Accessibility:**
  - Automatic reduced-motion mode (`prefers-reduced-motion`) bypassing opening sequence directly to settled state.
  - One-click "Skip to details" button always present.
  - Replay button for guests who want to re-experience the reveal.
  - Optional ambient audio starts strictly on deliberate user interaction (browser autoplay policy compliant).

---

## 4. Communication & WhatsApp Architecture
- **Status:** PHASED / DECISION GATE ACTIVE
- **Decision:**
  - **Phase 1 (Initial Release):** User-controlled native sharing via Web Share API and pre-filled WhatsApp deep-links (`https://wa.me/?text=...`) using the host's own device and WhatsApp account.
  - **Phase 2 (Automated Cloud API Gate):** Meta WhatsApp Cloud API will only be enabled after:
    1. Verified Meta Business Manager account.
    2. Meta-approved, versioned message templates matching current policy (utility/marketing categories).
    3. Immutable consent records stored with timestamp, source, channel, and explicit purpose.
    4. Per-dispatch suppression list checking (opt-out adherence).
    5. Cost-per-conversation budgeting and host authorization.
- **Non-Negotiable:** Phone numbers are never treated as implied consent for automated messages.

---

## 5. Payments, Contributions & Daraja M-Pesa Architecture
- **Status:** PHASED / DECISION GATE ACTIVE
- **Decision:**
  - **Initial Default:** Host-provided payment instructions (Host's own M-Pesa Paybill, Till number, or Send Money phone number, displayed cleanly with copy-to-clipboard buttons and clear reference notes). Kadi does NOT hold or intermediate funds.
  - **Direct Collection Gate:** Managed collection via Safaricom Daraja STK Push / B2C disbursement requires:
    1. Verified corporate entity and Safaricom merchant agreement.
    2. Regulatory review regarding custody/escrow of public funds.
    3. Idempotent webhook processing, transaction ledger with append-only entries, reconciliation job, and reversal handling.
  - **Platform Billing:** Kadi subscription/event creation fees are separate from guest contributions and follow verified billing channels.

---

## 6. Privacy, Legal & Kenya Data Protection Compliance
- **Status:** ADOPTED REQUIREMENT
- **Decision:** Compliance with the **Kenya Data Protection Act, 2019 (KDPA)** and Office of the Data Protection Commissioner (ODPC) guidelines:
  - Purpose limitation: guest contact data is strictly used for the host's event invitation.
  - Child data protection: Baby shower, baptism, and children's birthday events mandate parental consent flags and prohibit indexing of minors' identifying information.
  - Rights workflows: Host/guest data export (JSON/CSV) and automated deletion/retention policies.
  - Cryptographic tokens: Guest access links use high-entropy random tokens, stored hashed, and strictly excluded from client analytics.


## 7. Current Visual Direction
- **Status:** ADOPTED FOR THE CURRENT REDESIGN
- **Source of truth:** `docs/DESIGN_DIRECTION.md`.
- The working identity uses warm paper, ink, terracotta and muted brass; the mark is a restrained folded-folio monogram with a serif `kadi.` wordmark.
- Prefer asymmetrical editorial composition, image-led template suites, typography and fine rules. Use cards only where functional grouping warrants them.
- Never reintroduce the former gradient diamond/envelope logo or the old purple/gold gradient visual system merely because the old brainstorm document contains it.
