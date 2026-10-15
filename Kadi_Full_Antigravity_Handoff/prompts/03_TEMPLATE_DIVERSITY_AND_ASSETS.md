# Phase 03 — real occasion diversity and template asset quality

Read `src/lib/events/categories.ts`, `src/lib/templates/catalogue.ts`, `types.ts`, template browse routes and `docs/TEMPLATE_DIVERSITY_AND_KENYAN_ART_DIRECTION.md`. Do not create a parallel category enum.

Tasks:
- Generate a category coverage report from the actual catalogue in the active repository. State counts, missing categories and broken asset URLs.
- Keep current template ids stable; don't break events saved using older ids. Add real template definitions and data as needed for all 23 canonical categories. At least one intentionally art-directed template must exist for each advertised category. A filter label without an actual template does not count.
- Each template needs category, version, description, palette, fonts, hero layout, suitable liner/seal only if appropriate, default blocks/sections, supported blocks, default animation, gallery/hero media, complete content labels and a proper fallback. Avoid all templates sharing same cream envelope / gold wax / script font.
- Ensure occasion defaults: birthday can be disco/playful/color pop/age milestone, graduation academic/editorial, housewarming home/architecture, corporate/launch brand-led, reunion photo collage, memorial quiet and dignified, funeral service-first, baby warm and gentle, wedding has romantic/minimal/cultural/editorial choices.
- Audit image sources for rights/provider and intended category. Every image showing people should intentionally represent the Kenyan market when context calls for it; don't rely on arbitrary unsplash seeds. Add a local asset manifest (source/license, alt, category, mobile crop/focal position).
- Template card art should have diverse layout ratio, crop and type, not card-after-card in identical proportions. Filters, search and favorites must work, and selecting a template takes the real template ID to creation.

**Acceptance:** coverage report lists every canonical category, actual template IDs/count, media and missing work; category filters work; no fallback quietly showing wedding in birthday/funeral; template compatibility tests pass.
