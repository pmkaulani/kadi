# Code snippets explained: what each file does and how to integrate it

## 1. `snippets/kadi-design-system.css`

**Purpose:** Creates a consistent set of Kadi tokens and reusable button, field, panel, typography, app-shell and event-theme rules. It is the foundation for keeping every route in one design language.

**Integrate:** Merge into `src/app/globals.css`; do not overwrite current reset, font, or reduced-motion behavior. Replace duplicated hardcoded styles as each route is implemented.

**Important:** the `.kadi-invitation-theme[data-occasion=...]` variables are scoped to the guest-facing invitation; they do not recolor the creator workspace.

## 2. `snippets/KadiFullViewportHero.tsx`

**Purpose:** A real React hero with a full-screen photo layer, existing Kadi nav, copy, primary/secondary actions, category pills, next/previous controls, pause/resume, and automatic crossfade behavior.

**Integrate:** Copy to `src/components/landing/KadiFullViewportHero.tsx`. First apply the optional hero variant to existing `PublicNavbar` as described in `snippets/PublicNavbar.hero-patch.md`. Do not keep the old separate `PublicNavbar` directly above the home hero; this component renders it inside the first-screen composition.

## 3. `snippets/kadi-viewport-hero.css`

**Purpose:** Locks the opening composition to the dynamic viewport and adapts the image/text relationship at mobile widths. It prevents the old 440–590px visual column from forcing the opening CTA below the fold.

**Integrate:** Merge into `src/app/globals.css`. The next homepage sections should remain outside `.kadi-home-viewport` so the page scrolls normally after the complete first screen.

## 4. `snippets/event-categories.ts`

**Purpose:** One canonical category ID/type and readable label map shared by template definitions and saved events.

**Integrate:** Copy to `src/lib/events/categories.ts`; update `src/lib/templates/types.ts` and `src/lib/db/types.ts` using `snippets/event-category-type-patch.md`. Also search schemas/validators and API input handling.

## 5. `snippets/occasion-art-direction.ts`

**Purpose:** The creative direction registry for each occasion: palette, photo brief, decor, copy tone, motion and “avoid” rules. This is what prevents all templates from looking like weddings.

**Integrate:** Copy to `src/lib/templates/occasion-art-direction.ts`. Use it in template gallery labels and template-authoring guidance; the data does not replace actual `TemplateDefinition` records.

## 6. `snippets/TemplateDiversityExamples.ts`

**Purpose:** Fully structured data examples for a botanical housewarming, architectural housewarming, graduation, bright birthday and funeral/service programme.

**Integrate:** Merge these entries into the existing `TEMPLATES` array only after the event-category and motion-preset types are expanded. Keep all existing template IDs. Add motion implementations for new presets before assigning them to templates.

## 7. `snippets/ResponsiveTemplateCard.tsx` + `kadi-template-components.css`

**Purpose:** One reusable template card system: responsive image container, category label, title, description and one main “Use design” action. The `sizes` prop means the browser can choose an image appropriate to the card's real width.

**Integrate:** Copy the component into `src/components/templates/ResponsiveTemplateCard.tsx`, then refactor the map in `/templates` to render it. Merge CSS into globals.

## 8. `snippets/OccasionRail.tsx`

**Purpose:** A touch-scrollable category rail with snap points and accessible previous/next controls for desktop. The parent page maintains filter state via `onSelect`.

**Integrate:** Copy into `src/components/templates/OccasionRail.tsx`. Map real available template images to category IDs; do not make up an image for a category with no template. Once all categories have templates, all core categories should appear.

## 9. `snippets/WorkspaceBottomNav.tsx`

**Purpose:** A mobile navigation option with real existing destinations and a prominent create action. Uses safe-area-aware CSS in `kadi-template-components.css`.

**Integrate:** Copy to `src/components/app/WorkspaceBottomNav.tsx`. Update the shared app layout to render this only under the mobile breakpoint and remove duplicate mobile navigation. If the active project has a dedicated settings/profile route, use that real route; do not invent it.

## 10. `snippets/landing-hero-slides.ts`

**Purpose:** Places the Kadi envelope photograph first and adds one representative real template image per category. As the template catalogue becomes more diverse, the hero carousel becomes diverse without reusing wedding imagery for every slide.

**Integrate:** Copy to `src/lib/templates/landing-hero-slides.ts` after the canonical event category labels are in place.

## How to verify snippets

These are integration snippets and not a claim that the existing project has already been modified. After merging, run `npm run typecheck` and inspect import alias locations. Then run the actual app and perform the screenshot checks in `phases/08-visual-qa-and-repair.md`.
