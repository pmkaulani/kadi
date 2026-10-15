# Production boundary checklist — do not simulate away missing infrastructure

## Source snapshot limitations to keep explicit

The supplied source's service layer is based on `mockDb`/in-memory state and prototype auth patterns. Those are useful for local UI evaluation, but do not provide durable cross-request/cross-device production storage or multi-user security. An Antigravity UI change alone cannot turn them into a production database or authenticated SaaS.

## Persistence / auth

- Keep data access behind service/repository contracts so the UI can be migrated without creating a second data model.
- Before implementation, determine which auth provider/database (if any) is already configured and use it consistently. Do not pick new provider secrets or claim deployment.
- Add migrations and `.env.example` entries (names only, no real secrets), session validation and owner checks.
- Test that user A cannot list/read/edit/publish/duplicate/export user B's events or guests.
- RSVP-by-token remains account-free but securely scoped; store token hashes where appropriate, make tokens high entropy/revocable and avoid exposing contact fields.
- Login/signup/recovery should report real states; do not authenticate simply because an email/password was typed.

## M-Pesa

A UI may show M-Pesa contribution details, a sandbox request or a development simulation. Only label it “paid” after server-side confirmation of a verified provider callback with signature/credential validation, idempotency, amount/currency/reference checks and reconciliation. A front-end success callback is not payment confirmation. If the host has no valid Paybill/Till/phone collection setup or the project has no Daraja credentials, clearly label the flow as preview/sandbox and don't imply funds were requested.

## Notifications

`wa.me` link generation is manual sharing, not WhatsApp Cloud API automated sending. Automated messages require provider credentials/configuration, appropriate consent, template approval where applicable, delivery/error states and retry/idempotency. CSV import must never send invites automatically. Email/SMS providers need the same honesty.

## Uploads/media

Do not treat remote example/Unsplash URLs as host uploads. Production uploads need authenticated signed upload route, content type/size limits, safe names, image processing, ownership association, delete/replace, quota and error states. AI generation and custom fonts are paid/optional integrations only when provider and entitlement checks exist.

## Draft preview sharing

A draft link must use a signed random unguessable token with expiry/revocation and minimal read-only permissions. Never allow a non-owner to access draft by guessable id/slug. Guest view should expose only fields intended for guests; never serialize all guest phone/email/token records into page props.
