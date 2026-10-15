# Phase 07 — content block builder and creative controls

Implement a real serializable block registry, not decorative “add section” buttons. Each block is `{ id, type, version, enabled, settings, content }`, where the data is JSON-serializable. Use a stable UUID/id factory. Persist order by block array or explicit position consistently. No React elements/functions in stored configuration.

Operations: browse/add block, remove (with confirmation/undo when practical), duplicate with new id, reorder by drag-and-drop and accessible move-up/down controls, enable/disable, select block to edit, edit common settings and type-specific content, immediate live preview, autosave/retry. Use current drag/drop dependency if present; if not, select one accessible maintained option compatible with current stack, and support keyboard reorder.

Library: Hero, Rich Text, Photo, Gallery, Video (allowlisted YouTube/Vimeo only), Venue/Map, Countdown, RSVP, Gift Registry/Contribution, Programme/Timeline, Quote, Divider, Button, FAQ, Music Player, Guestbook/Tributes, Livestream Embed. Custom HTML is risky XSS: do not `dangerouslySetInnerHTML` arbitrary host content. Sanitize with a suitable well-tested sanitizer/allowlist or keep the feature visibly gated/unavailable until safe.

Common settings: padding, max width, background color, text alignment, entrance/scroll animation, spacing. Type-specific settings: text content/typography, image URL or media ID/crop/focal point, gallery order, video provider/id, map venue and address, countdown target/label/timezone, RSVP questions/deadline, contribution display instructions, schedule list items, FAQ pairs, music source/controls, guestbook moderation, livestream provider/URL.

Typography: ≥10 usable curated font pairs; font size scale, heading letter spacing and body line-height must change preview; custom upload only when authenticated storage/entitlement exists. Palette: ≥20 presets with category relevance, 5 editable colours (primary, secondary, accent, background, text), live contrast ratio and warnings/correction. Layout presets: one/two-column where appropriate, compact/comfortable/spacious, square/soft/round/pill, border none/thin/thick/dotted. Every visible option changes output and is serialized.

**Acceptance:** unit tests for create/update/duplicate/delete/order/schema migration. Refresh preserves saved block configuration in persistent store when available. Preview and public page agree. No dead controls and no unsafe host HTML execution.
