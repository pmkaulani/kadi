# Kadi priority backlog

## P0 — Fix before more visual expansion

1. **Preview parity:** One shared invitation renderer for wizard, editor and public guest page. Add interaction tests that change title/date/venue, image, palette, font, envelope style, letter style, guest name and active sections one at a time.
2. **Draft/public separation:** Public invite route only serves published events; add private signed preview links for feedback. Do not reveal drafts by predictable slug.
3. **Accurate saving states:** Save Draft, autosave and Publish must have distinct states (`unsaved`, `saving`, `saved`, `error`); show saved only after server success.
4. **Event-specific envelope art direction:** Graduation, housewarming, birthday, corporate, wedding, funeral and memorial each use suitable palettes, ornaments, background effects and opening behaviour.
5. **Production foundations:** Replace in-memory mock DB and stub login with persistent database and real auth before production.

## P1 — UX/product completeness

6. Complete wizard steps for event details, design, guest list, RSVP rules, review/publish and completion.
7. Implement a block schema and block settings. Every block operation must modify the exact same config consumed by preview and public guest page.
8. Add event coverage for the 11 missing categories, each with suitable imagery, copy, theme, sections and preview.
9. Curate licensed, category-correct imagery featuring Black Kenyan people where people are shown. Validate crop/responsive focal points on phone, tablet and desktop.
10. Test countdown timing with timezone `Africa/Nairobi`, calendar export (`.ics`), Google Calendar links and multi-part funeral services.
11. Separate a mock M-Pesa flow from real Daraja/STK Push integration; never label a simulated push as live.
12. Protect owner operations with authorization on both server routes and data-service methods.

## P2 — Refinement

13. Consolidate old CSS selector families into documented tokens and components.
14. Use responsive `next/image` with correct `sizes` and `object-position`; preload only above-the-fold images and lazy-load below.
15. Add reduced-motion mode, keyboard flow, visible focus, touch targets and accessible labels.
16. Audit empty/loading/error/success states across all pages.
17. Add screenshot QA at 1440×900, 1280×800, 1024×768, 390×844, 375×667, plus 844×390 landscape.
18. Test guest personalization for individual, couple/household and blank name.
19. Reduce excessive card use: mix editorial sections, lists, tables and purpose-built workspace panels.
20. Run route/link QA and service tests after every phase.
