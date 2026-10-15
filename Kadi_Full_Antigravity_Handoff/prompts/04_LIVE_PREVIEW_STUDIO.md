# Phase 04 — make every edit update the real guest preview

Highest-priority functional fix. Read `src/app/app/events/new/page.tsx`, `src/app/app/events/[eventId]/page.tsx`, `src/app/e/[slug]/page.tsx`, existing `EnvelopeRenderer`, all design/event types, service methods, and `snippets/useInvitationDraft.ts` and previous starter `KadiStudioEditor.tsx` (diff first).

## State architecture

Create one versioned typed draft object/reducer for event values, template/category, design palette/type/font, envelope/liner/seal/letter style, animation config, block list/order/visibility, image crop, RSVP options and music. Do not keep multiple disconnected states for values that affect the same visual output. Use updater functions that preserve untouched fields and stable ids.

UI edit → state update immediately → preview renders immediately from the same draft object → persistence occurs after a short debounce. Debounce only network/DB writes, never the visual update. Use a serialized save queue or monotonic revision ids so late responses never mark an outdated snapshot as “saved”. Save statuses: unsaved, saving, saved, error; retry failed saves.

## Studio layout

Desktop: left control column ~360–440px, right preview stage fills the rest; a toolbar above the preview holds guest selector, replay, iPhone/Android/Desktop device preview and share-preview action. Phone itself is 393×852 logical proportions but must scale within visible space; desktop preview uses a wider frame. Avoid a three-column layout that makes the invitation too small at 1280px.

Mobile: Edit / Preview tabs or segmented control. In edit mode, controls use full screen width and accordions; in preview mode the preview fills available space with a persistent close/edit action. No side-by-side narrow panels on phone.

Control accordions: Event Details, Design, Content Blocks, RSVP Questions, Contributions, Music, Animations, Layout and Publish/Review. Hide or adapt controls that are not relevant for the selected event category.

`Preview as` uses actual guest/household data; correct names flow into invitation salutation. Replay increments/reinitializes envelope timeline. Device selection changes a shell/scale, not a separate render component. Share preview either creates a real expiring, read-only, secure token link; until endpoint exists, show disabled/help text, never pretend it was generated.

## Rendering and safety

Render the same canonical invitation component used by `/e/[slug]`. Pass draft config instead of loading saved event, and disable real side effects through explicit `previewMode`: RSVP cannot submit, M-Pesa cannot call provider, previews don't write guest analytics/notification logs. Preserve all event fields and selected template data. Template/category switch must not wipe authored information without confirmation.

## Required controls to prove live

Change: title, hosts, celebrants, date, time, timezone, venue, address/city, image, crop/focal position, palette each color, heading/body font pairing, size/line height/tracking, envelope preset, flap/seal color, seal monogram, liner, letter style, background animation, scroll animation/speed, block props, section visibility/order, RSVP question, countdown label and layout spacing. For each, screenshot/test the preview output; if a control is not implemented, don't show it as functional.

**Acceptance tests:** test control → preview for each key field; persistence failure and out-of-order response; selected guest name; device switch; replay/skip/reduced motion; no RSVP/payment side effects in preview; published guest route matches preview for same data.
