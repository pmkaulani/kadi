# 20 specific improvements: before / after

1. **Preview content** — Before: poster mockup independent of edits. After: real envelope + shared invitation sections consumes optimistic current values.
2. **Preview event data** — Before: selected form values were not assembled into a full event. After: date, time, names, venue, image and category are mapped into a draft event model.
3. **Design tokens in preview** — Before: theme controls could look disconnected. After: palette, font, liner, seal, envelope and letter options are passed to the same renderer.
4. **Guest page parity** — Before: duplicate section switches could drift. After: shared `InvitationSectionsRenderer` used in preview/editor/public page.
5. **RSVP safety** — Before: preview could resemble a real guest flow. After: preview mode blocks real RSVP submission.
6. **Draft privacy** — Before: draft could be fetched by public slug. After: public guest page only serves published events; private preview needs a separate signed link.
7. **Envelope default** — Before: several generic event types inherited romantic or gift-box treatment. After: event-category theme resolution separates memorial, graduation, housewarming, corporate and holiday styles.
8. **Envelope options** — Before: physical style controls lacked true theme propagation. After: persisted design supports envelope shape and letter style properties in renderer.
9. **Liner and seal** — Before: editor choices could be visual-only. After: design overrides affect liner pattern, seal shape, colour and monogram.
10. **Replay** — Before: animation replay wasn't integrated with the live preview state. After: editor preview uses a key to restart the envelope component.
11. **Valid template default** — Before: new event could start with a stale/invalid template slug. After: selection starts from a valid catalogue template.
12. **Occasion category filters** — Before: filter list omitted supported categories. After: filters derive from catalogue/categories instead of a short hardcoded subset.
13. **Landing-page breadth** — Before: only four occasion choices and a wedding-centric impression. After: eight occasion families, additional template discovery and longer explanatory sections.
14. **Landing category routes** — Before: broad occasion links could blur event types. After: cards link to category-specific template browsing routes.
15. **Featured templates** — Before: no clear non-wedding design discovery on the landing page. After: featured category selection includes birthday, graduation, housewarming, funeral, baby shower and corporate.
16. **Landing imagery sizing** — Before: images often used raw `<img>`/uncontrolled display. After: updated landing images use Next Image with responsive `sizes` and deliberate cover layout.
17. **Section defaults** — Before: legacy visible sections could override category-specific defaults. After: section order is centralized in `default-invitation-sections.ts` and initialized by category.
18. **Schedule/story examples** — Before: a new draft could preview empty sections even after selecting a template. After: the draft preview prepares category-appropriate sample schedule/story/FAQ data until the host replaces it.
19. **Public data access** — Before: public slug route didn't consistently check publish status. After: drafts are not treated as published invitations.
20. **Completion discipline** — Before: compile success might be taken as redesign success. After: kit mandates per-field interaction checks, viewport screenshots, route checks and real test/build reporting.

The patch is a focused repair of these areas, not a claim that all large product features in the requested brief (e.g. real authentication, persistent DB, full block builder, production M-Pesa, upload/crop, private preview sharing) are already complete.
