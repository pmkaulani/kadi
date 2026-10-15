# Phase 06 — Guest invitation, account and RSVP experience

Update the real guest route `/e/[slug]`, existing login/account routes, and reusable invitation renderer `src/components/animation/EnvelopeRenderer.tsx`. Do not create another invitation renderer.

## Invitee route

- The guest link opens directly, with no forced registration.
- An envelope open animation may be offered, but “Open invitation” is obvious and “Skip animation” is always available; returning guests should not be forced through the whole reveal again.
- Event-specific typography, image, palette and decoration come from the selected template. Use the same renderer components and actual data for wedding, birthday, graduation, housewarming, funeral/memorial and corporate examples.
- Details order is occasion-aware: housewarming prioritizes address/directions; graduation prioritizes graduate, ceremony and reception; funeral prioritizes portrait, service schedule, venue, directions and condolences; birthday prioritizes celebrant, party details and RSVP.
- RSVP errors, loading and confirmation are real states tied to the existing API. Prevent duplicate submissions, retain guest token/link security and use only appropriate fields.
- Keep keyboard navigation, focus indicators and reduced-motion support.

## Account pages

Use the same Kadi tokens/components as the workspace. Account form layout can be quieter than the landing page, but must not introduce a new unrelated design system. Preserve existing login/session behavior. If signup, verification or reset routes exist, integrate their actual providers; don't invent a new backend.

## Motion guidance

- Wedding/engagement: optional tactile envelope + smooth section reveal.
- Birthday: playful but fast and skippable.
- Graduation: confident and clean.
- Housewarming: a warm doorway/photo reveal.
- Memorial/funeral: minimal fades only; no confetti or autoplay audio.
- Corporate/product launch: controlled mask/crossfade.

Test RSVP yes/no/maybe (where enabled), success and error states at mobile size. Verify the inviter's real dashboard reflects the response.
