# Phase 03 — Make Kadi genuinely multi-occasion

The supplied source snapshot has just six templates (two weddings, one birthday, one graduation, one memorial, one baby shower) and no housewarming template. This phase is not complete until the catalogue contains real category-specific records, not only category chips.

Read `snippets/event-categories.ts`, `snippets/occasion-art-direction.ts`, `snippets/event-category-type-patch.md` and `snippets/TemplateDiversityExamples.ts`.

## Work

1. Create the canonical event categories in `src/lib/events/categories.ts` and use one `EventCategory` type for template records and event records. Search all type unions, validators, API handlers, service parsers, default selection logic and UI labels. Preserve existing category IDs for saved events.
2. Update `src/lib/templates/types.ts` and the data type in `src/lib/db/types.ts` to use that canonical type. Expand `MotionPreset` only alongside actual renderer behavior.
3. Merge the starter examples into `src/lib/templates/catalogue.ts` after the type update; add the remaining templates using the same schema. Do not overwrite the existing templates or change their IDs.
4. Reach at least 24 real template records, with at least one in each category, and more choices for wedding, birthday, graduation, housewarming, and memorial/funeral service.
5. Every template needs its own real image and design story. Change composition and decoration, not just the palette/name. Never reuse a wedding image to represent graduation or a new home.
6. Update filters to be generated from the same category list but show categories that actually have available templates only if the product has not yet implemented a category. The target is all listed core categories populated. Implement URL query filtering and result counts.
7. Ensure starter categories in the create flow determine the most appropriate default template, but users can always choose a different style.

Use the supplied moodboards in `reference/`. Graduation must feel achievement-led, housewarming architecture/home-led, birthday expressive, funeral/memorial calm, corporate clean, holidays seasonal/context-aware. Do not force all invitation themes into Victorian stationery.

## Acceptance

- Search the data file and provide the exact template count and per-category counts.
- `/templates?category=housewarming` shows at least two actual housewarming designs, with home/architecture imagery.
- `/templates?category=graduation` has more than one design and does not reuse the wedding photo.
- Template selection flows into `/app/events/new?template=...` correctly.
- Existing event records with old categories still load.
- Typecheck and tests pass or any blocking issue is documented.
