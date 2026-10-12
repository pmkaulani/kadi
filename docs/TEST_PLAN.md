# KADI — Verification & Test Plan

## 1. Test Strategy Overview
Kadi follows a pyramid testing strategy covering unit tests, integration tests, animation state verifications, accessibility audits, and security boundaries.

---

## 2. Test Suites

### 2.1 Unit Tests (`src/lib/__tests__`)
- **Token Generation & Cryptography:** Verify high entropy, base64url safety, and SHA-256 hash matching.
- **RSVP Validation Rules:** Verify attendee counts, plus-one upper limits, mandatory meal selection, deadline expiration, and idempotency key handling.
- **CSV Guest Parsing & Mapping:** Test standard headers, dirty data, phone number normalization (Kenyan `+254` formatting), invalid rows, and partial-batch error reporting.
- **Date & Timezone Calculations:** Test East Africa Time (`Africa/Nairobi` UTC+3) conversions, countdown timer logic, and calendar file (.ics) generation.

### 2.2 Component & Visual Tests
- **Envelope Timeline States:**
  1. *Closed:* Envelope sealed, flap down, card hidden inside.
  2. *Opening:* Flap rotating backwards 180° with 3D perspective, seal fading, liner visible.
  3. *Emergence:* Card translating vertically out of envelope pocket with drop shadow.
  4. *Settled:* Card docked into hero position, typography and photos revealing.
- **Accessibility & Fallback Checks:**
  - `prefers-reduced-motion`: Envelope immediately presents settled state without animation.
  - "Skip to details" keyboard focus and immediate bypass.
  - Replay button resets timeline and re-executes reveal.
  - Mobile touch vs desktop pointer interactions.

### 2.3 Integration & API Tests (`src/app/api/__tests__`)
- **Event Lifecycle:** Create draft -> update details -> design customization -> publish -> verify public view -> archive.
- **Guest Access Isolation:** Guest with Token A cannot read or modify RSVP for Token B.
- **Webhook Idempotency:** Repeated provider webhook calls with identical IDs do not create duplicate transactions or duplicate messages.
- **Provider Adapters:** Verify sandbox/mock adapters correctly return predictable responses with explicit dev labels.

---

## 3. Automated CI / Verification Commands
- `npm run lint`: ESLint checking across all TypeScript and React files.
- `npm run typecheck`: Strict TypeScript typechecking (`tsc --noEmit`).
- `npm test`: Node.js test runner executing domain and schema unit tests.
- `npm run build`: Production Next.js build verification ensuring zero build errors.
