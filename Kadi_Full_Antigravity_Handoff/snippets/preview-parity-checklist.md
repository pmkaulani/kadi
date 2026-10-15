# Live preview parity checklist for manual and automated verification

Use the selected template and same data/config to compare:

- [ ] `title` text, subtitle and host/celebrant names.
- [ ] Date, event time and timezone text.
- [ ] Venue/address/city/map link.
- [ ] Hero image, gallery, crop/focal point and alt.
- [ ] Palette: primary, secondary, accent, background, card and text.
- [ ] Typography: heading/body font, size scale, tracking and line height.
- [ ] Envelope: geometry/preset, envelope and flap colour, liner, seal shape/colour/monogram, letter style.
- [ ] Background and section animations/speed; replay starts at closed state.
- [ ] Block list: add/remove/duplicate/reorder/settings and enabled state.
- [ ] Section order and visibility, no blank gap from hidden section.
- [ ] RSVP questions, deadline, plus-one policy; preview submit is inert/simulated.
- [ ] Guest selector changes personalized greeting; family/couple name handling.
- [ ] Device selection only changes preview frame, not values/config.
- [ ] Saved draft reloads same config; failed save shows retry and doesn't report saved.
- [ ] Published guest route renders the same content/sequence without editor-only tools.

Regression test: edit title A→B, trigger a slow save for B, edit to C before B resolves; after all requests settle, preview and persisted draft must both be C and status must say saved only if C save succeeded.
