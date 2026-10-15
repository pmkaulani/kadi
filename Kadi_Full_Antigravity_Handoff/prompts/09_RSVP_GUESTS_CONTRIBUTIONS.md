# Phase 09 — RSVP, guest management, contributions and communications

Preserve existing RSVP/guest contract fields and constraints in `src/lib/db/types.ts` / services. Inspect API handlers and tests first. Do not break guest token semantics or CSV behavior.

## Guest management
- Household/group records, display name, phone/email where provided, guest group, allowed plus ones, token state, RSVP state and notes.
- CRUD, filters/search, group view, row-level validation, CSV column mapping and row-by-row import report; confirm duplicate handling. Import must never send messages automatically.
- Distinguish invited households from named attendees/headcount; display those counts separately and correctly.
- Generate high-entropy tokens, store hash where supported, support token revoke/rotate, and don't include raw tokens/contact info in dashboard APIs or page props unnecessarily.

## RSVP guest flow
- Guest needs no Kadi account. Published invite can use a scoped invitee/household token; un-tokenized RSVP policy must be explicit. Verify response yes/no/maybe, plus-one cap, names for attendees, dietary requirements, song request/custom questions when applicable, consent/privacy, inline errors and success state.
- Server validates all values; frontend validation complements server validation. Protect public endpoint against spam/rate abuse, duplicate submit and replay. Preview mode uses an in-memory preview action only and cannot hit real API.
- Host RSVP dashboard reflects real scoped data and updates after submission; export CSV uses safe encoding and owner authorization.

## Contributions/M-Pesa
- Only render when host configured it. Display type (Paybill/Till/Send Money), business/phone/recipient, account/reference and instructions in KES with validation. For live STK Push, require server provider setup and verified callback/idempotency/reconciliation. Without credentials, clearly label simulation, do not collect real payment data or mark as paid. Never infer success from a client event.

## Notifications and sharing
- Published event gets the share link/QR. Draft link needs a private expiring token. Copy link/QR success feedback must reflect browser/endpoint response.
- Distinguish manual `wa.me` share from automated WhatsApp Cloud API. Automated notifications require provider config, approved templates when applicable, logged consent and retry/delivery tracking. Email/SMS behaves similarly. Don't say sent before provider success.

**Acceptance:** execute guest RSVP end-to-end for valid/invalid token, no/yes/maybe, plus-one edge, duplicate submit, retry, CSV import invalid rows, cross-event token, protected export, fake/sandbox M-Pesa mode. All current tests continue to pass.
