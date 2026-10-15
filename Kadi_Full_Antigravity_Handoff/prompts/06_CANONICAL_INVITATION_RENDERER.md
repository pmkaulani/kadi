# Phase 06 — canonical invitation configuration and renderer parity

Create one typed serializable config that describes event values, template version/design, ordered typed blocks, section visibility, RSVP settings, media and motion. Reuse `EventEntity`, `EventDesignEntity`, `TemplateDefinition` and `EVENT_CATEGORY_IDS` where possible; add versioned fields only after identifying what's missing. Validate at input and API boundaries with the existing Zod conventions or add schemas if absent.

One `InvitationRenderer`/shared section renderer must drive:
- template preview (sample data + preview mode);
- editor draft preview (draft state + side effects disabled);
- published guest route (published event + token personalization + real RSVP actions);
- private review link (read-only, expiring token if implemented).

Only the config/data and allowed action adapters differ; the visual content, section ordering and envelope must be the same. Never copy and paste separate JSX for “preview” and “guest page.”

Default sections vary by category:
- Wedding: hero, story, countdown, ceremony/reception, schedule, venue/directions, gallery, registry, RSVP, FAQ.
- Birthday: hero, celebrant/bio/age, activities/menu, location, gallery, RSVP, wishlist.
- Graduation: graduate/institution, celebration, programme, venue, gallery, RSVP.
- Housewarming: home note/photos, location/directions, details, RSVP, optional gift/help note.
- Memorial/funeral: obituary, service/burial list, order of service, directions, tribute/gallery, livestream, condolences/candles/support; not registry/party blocks by default.
- Corporate/product launch/fundraiser/community: organizer/brand, agenda/programme, venue, speakers/partners, registration/RSVP, FAQ/contribution if enabled.

Missing fields should omit their sections elegantly instead of rendering blanks or placeholders. Unknown block type should fail safely and be omitted/logged, not break the entire guest invitation. Add contract tests so saved events created with old template versions still render.

**Acceptance:** renderer parity test runs same config through draft and published renderers and confirms section tree, key text, palette and ordering; preview actions are safely disabled; no stale duplicated renderer code.
