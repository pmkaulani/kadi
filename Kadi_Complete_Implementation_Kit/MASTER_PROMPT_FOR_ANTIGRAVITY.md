# KADI — MASTER VISUAL + PRODUCT IMPLEMENTATION PROMPT

> **Global contract.** This document describes the finished product and visual acceptance rules. Start with `phases/00-audit-before-edits.md` as a read-only audit. Then implement one phase file at a time in the order in `README_START_HERE.md`. When a phase prompt is provided, edit the real files for that phase; do not answer with a plan only. Do not attempt to rewrite every route in one unverified pass.

## 0. The job

You are the senior product designer and senior frontend engineer assigned to the existing Kadi invitation platform. The current experience feels like separate pages made by different teams, has too much wedding/Victorian visual language, has too few event categories/templates, and does not make the full landing-page hero visible in one viewport on smaller screens.

Your work must fix all of these together:

1. **One Kadi design system across the whole product.** The public site, account pages, workspace, template library, invitation editor, guest invitation, RSVP, empty states, forms, buttons, typography, navigation, borders, radii, spacing, and responsive behavior must feel like the same product.
2. **Different occasions need genuinely different art direction.** Weddings are one category, not the default for the whole platform. Housewarmings should look like a home and an open-house gathering. Graduations should look proud and contemporary. Birthdays can be vibrant. Funerals and memorials must be calm and dignified. Corporate invitations should be clean and brand-aware. Do not simply recolor a wedding template and rename it.
3. **The landing hero fits inside one viewport.** On desktop and mobile, the complete first-screen composition—including navigation, heading, description, primary action, and main image—must be visible without scrolling inside the hero or clipping the CTA. Use responsive viewport units and compact responsive composition, not large fixed minimum heights that push the rest below the fold.
4. **Responsive images are intentional.** Images must be relevant to the current occasion, use suitable aspect ratios and focal positions, load at reasonable sizes, and not stretch, overflow, or crop out the important subject at mobile sizes.
5. **The reference image is an acceptance target, not loose inspiration.** Match composition, hierarchy, scale, section order, and image/text balance—not just colors.
6. **Preserve actual functionality.** Keep the working event services, template IDs, save/publish workflow, RSVP, guest token/link behavior, authentication, route structure, import/export, and data contracts. Do not replace real data with hard-coded mock analytics or make buttons merely decorative.

## 1. Inspect the real project before editing

Open the current workspace and confirm that it is the Kadi project. Do not assume this archive is newer than the active workspace. Inspect at least:

- `package.json`, `next.config.js`, `tailwind.config.js`, `tsconfig.json`
- `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- `src/components/layout/PublicNavbar.tsx`, `src/components/layout/PublicFooter.tsx`
- `src/app/templates/page.tsx`, `src/app/templates/[templateId]/page.tsx`
- `src/app/app/layout.tsx`, `src/app/app/events/page.tsx`, `src/app/app/events/new/page.tsx`, `src/app/app/events/[eventId]/page.tsx`
- `src/app/e/[slug]/page.tsx`, `src/app/login/page.tsx`
- `src/components/animation/EnvelopeRenderer.tsx`
- `src/lib/templates/catalogue.ts`, `src/lib/templates/types.ts`
- `src/lib/db/types.ts`, `src/lib/db/mock-db.ts`, `src/lib/services/event-service.ts`, `src/lib/services/guest-service.ts`, `src/lib/services/rsvp-service.ts`
- all route handlers under `src/app/api`

Write down the actual current route map, the real category/template count, reusable UI components, data flow, and commands that work before changing code. Search for duplicate category types, hardcoded colours, duplicated nav implementations, broken routes, and hardcoded example data. Do not edit `.env` secrets or remove user data.

### Known findings in the Kadi source archive shared for this work

These are useful starting observations, not a reason to skip inspection of the active workspace:

- The stack is Next.js App Router, Next 14, React 18, TypeScript, Tailwind, Framer Motion and Lucide icons.
- Font variables already exist for Inter and Playfair Display. Reuse them; do not add a second unrelated font system.
- `src/app/page.tsx` currently has a tall left/right editorial hero; its image column uses large minimum heights (including 440px and 590px) and generous vertical padding. That forces an overly tall opening composition on small screens.
- `src/components/layout/PublicNavbar.tsx` uses an opaque cream background and fixed 82px nav row. Add a reusable optional hero variant instead of duplicating the navigation.
- `src/app/app/layout.tsx` currently has a light-beige side area, a light top header, and a very small mobile nav. The app shell should be made coherent across all logged-in routes.
- The current `TEMPLATES` catalogue has six entries: two weddings, one birthday, one graduation, one memorial, and one baby shower. There is no housewarming template in that catalogue. The template page lists more filters than it can currently populate.
- `EventCategory` and the `EventEntity.category` union are separately declared. Consolidate them carefully so the UI, templates, stored events and APIs agree.
- Existing routes include `/`, `/templates`, `/templates/[templateId]`, `/app/events`, `/app/events/new`, `/app/events/[eventId]`, `/e/[slug]`, and `/login`. Use the real existing routes rather than inventing parallel pages.

## 2. Reference images: inspect them before coding

Open all supplied images in `Kadi_Complete_Implementation_Kit/reference/`:

- `landing-page-reference.png` — public landing page composition.
- `multi-occasion-modern-ui-board.png` and `diverse-occasion-app-board.png` — multiple categories, mobile layouts, editor and workspace visual direction.
- `workspace-reference.png` — inviter workspace and guest management layout.

These are reference boards, not assets to display as whole-page screenshots inside the website. Recreate their individual layouts in real HTML/CSS/components using appropriate images. `public/kadi/hero-envelope.webp` is a local hero image supplied for the initial landing visual; additional slides should represent varied occasions from the real catalogue.

If an instruction conflicts with a reference image, prioritize the **visual composition in the supplied reference** and the requirement to preserve working product behavior.

## 3. Non-negotiable design system

Use one canonical design system. The supplied `snippets/kadi-design-system.css` is the baseline to merge into `src/app/globals.css`, not an instruction to erase other CSS. Use semantic tokens for all main interface styling:

- shared ink, paper, surface, muted text, border, brand, focus, success/warning/error tokens
- shared Inter body / Playfair Display display typography
- one spacing scale; shared content max-width and responsive gutter
- one button system with primary, quiet/outline, and light-on-dark variants
- one input/select/textarea style and visible focus treatment
- shared card borders, radii and shadow depth
- shared nav item height, active state and interaction behavior
- consistent states: hover, focus-visible, active, disabled, loading, success, error, empty, offline where relevant

Do not assign every page its own ad hoc hex colors and radii. Remove or refactor conflicting hardcoded colour utilities when that route is being edited, but avoid unrelated rewrites.

### Important separation: app chrome vs invitation art direction

The **Kadi app shell remains consistent**. Its sidebar/header, forms, actions, editor controls, guest management, navigation and account screens use the shared Kadi tokens. The selected invitation theme is scoped to the guest-facing invitation renderer and its preview only (for example `[data-occasion="birthday"]` inside `.kadi-invitation-theme`). A birthday palette must not recolour the logged-in workspace. A funeral theme must not redesign the application menus. A Victorian look must never be the only template style.

## 4. Landing page: exact first-screen behavior

Implement one `KadiFullViewportHero`-style component using `snippets/KadiFullViewportHero.tsx` as a concrete starting point. Merge `snippets/kadi-viewport-hero.css` into `src/app/globals.css` and copy the supplied envelope asset to `public/kadi/hero-envelope.webp`.

The hero must:

- include the existing `PublicNavbar` in a transparent/overlay variant—do not duplicate nav markup or state;
- use a full-bleed, high-quality image with the image's visual subject on the right on desktop and readable copy on the left;
- use dark overlays only to protect readable copy, not to obscure the whole photograph;
- use the headline **“Beautiful invitations for every moment.”** or an equivalent approved short headline—not a wedding-only headline;
- mention varied occasions in the supporting copy: birthdays, graduations, housewarmings, weddings, memorials and more;
- show one obvious primary action to explore templates and one secondary action for “How it works”;
- keep small category tags subordinate to the main CTA;
- offer controls and pause/resume for an automatic carousel; pause on hover/focus and disable automatic rotation when reduced motion is preferred;
- use real hero/occasion images from separate categories as extra slides once those template entries exist;
- preserve a dark, cinematic first impression on desktop, while the next page sections shift to the shared warm-light surface; this is a purposeful section transition, not a different app.

### Viewport rule

The outer first-screen section must be exactly the available viewport height, with the navigation included in that height. Use the equivalent of:

```css
.kadi-home-viewport {
  height: 100vh;   /* fallback */
  height: 100svh;
  height: 100dvh;
  min-height: 0;
  overflow: clip;
  display: grid;
  grid-template-rows: var(--hero-nav-height) minmax(0, 1fr);
}
```

Do not use `min-height: 590px`, large `pt-16 pb-20`, or an independently tall art column that pushes the CTA below the fold. On mobile, the image may become a full-bleed background behind a compact text layer with a stronger legibility gradient. Use `clamp()` for title size, spacing and body copy. At very short mobile heights, reduce decorative tags and whitespace, **not** the CTA or key message. The first lower section can begin after the viewport hero; the hero itself must not require scrolling to complete.

The reference component CSS has the exact structure. Adapt it to the active code rather than pasting it blindly.

## 5. Event-category diversity is a product requirement

Create a single canonical event category list (the supplied `snippets/event-categories.ts` is the starting code). Use the same type and labels throughout template records, saved events, creation flow, filters, APIs, invitation renderer and analytics labels. At minimum support:

- Wedding
- Engagement
- Anniversary
- Birthday
- Graduation
- Housewarming
- Memorial
- Funeral/service programme
- Baby shower
- Bridal shower
- Corporate
- Holiday party
- Reunion
- Religious milestone
- Cultural celebration
- Retirement
- Product launch
- Fundraiser
- Community gathering
- Welcome baby
- Farewell
- Get-well wishes
- Other/custom

Do not simply add filter chips. The gallery must have actual records for the categories; selecting Housewarming cannot return an empty grid while a generic “templates are coming soon” message is shown.

### Catalogue minimum

Target at least **24 genuinely distinct template records**, covering all listed categories, with multiple designs for the high-frequency categories (at least 3 wedding styles, 3 birthday styles, 2 graduation styles, 2 housewarming styles, and different memorial vs funeral-service styles). This is a design-quality target; only claim a category has a template if the record and image actually exist.

Use unique IDs and a distinct visual identity per template. Keep existing template IDs and backward compatibility. Do not rename old IDs or break saved events referencing them.

For each category, change more than the accent colour: vary image, composition, typography balance, decorative motifs, layout, copy tone, and motion. Use `snippets/occasion-art-direction.ts` as the direction registry and `snippets/TemplateDiversityExamples.ts` as mergeable examples. Use `snippets/InvitationThemeScope.tsx` to scope the selected palette to the guest invite and preview, not the app shell. Add real behavior for any new `MotionPreset` rather than declaring unused preset strings.

### Minimum art direction examples

- Weddings: several styles—classic floral, outdoor/editorial, and modern/cultural. Wedding can keep the signature envelope; not every wedding must use it.
- Birthdays: bold color-pop, grown-up milestone, and playful children’s-party design. Confetti is optional and respects reduced motion.
- Graduation: strong typography, year/achievement motif, navy/cobalt/gold or school-selected colours, cap/certificate/campus imagery.
- Housewarming: actual house/interior/doorway/garden/keys photography, warm botanical or modern-architectural direction. Never lead with wedding rings or bouquets.
- Memorial/funeral: calm portrait, service schedule, directions, condolence/tribute sections when relevant; no autoplay music, confetti, playful movements or urgent commercial CTA.
- Baby shower/welcome baby: soft but not universally pink/blue, optional illustration/photo, gentle motion.
- Corporate/product launch: grid, brand colour, venue/product image, crisp type and clean schedule.
- Holiday/cultural/religious/community events: context-aware visual language; do not assume every holiday is Christmas or invent cultural/religious symbols.

Respect dignity, privacy and context. Users choose the specific art style; do not infer private beliefs from the event category.

## 6. Template gallery

Edit the actual `/templates` page:

- keep a clear heading and one line that communicates the range of occasions;
- add search that actually filters template name, description and category;
- add horizontally scrollable, snap-aligned occasion tiles on mobile and a proper gallery grid at larger widths;
- make category filters use the canonical categories and show a result count;
- read `/templates?category=housewarming` or equivalent query params so cards and CTAs link into a filtered view correctly;
- use image-led cards with aspect-ratio containers, unique category photographs, one label, one title, short useful description, preview and “Use design” actions;
- on mobile use a one-column feed or 2-column only when cards remain legible; do not force a desktop grid into 320px;
- show a genuine empty state only when no templates match search/filter; never use it as a substitute for missing core templates.

Use `snippets/ResponsiveTemplateCard.tsx` and `snippets/kadi-template-components.css` as the common visual primitive. Use `next/image` with correct `sizes`, fixed aspect-ratio container and relevant alt text. The first actually visible image may be prioritized; all later gallery images should be lazy-loaded.

## 7. Workspace / inviter application: one real shell

Refactor `src/app/app/layout.tsx` to become a shared application shell used by every logged-in route:

### Desktop and tablet landscape

- near-black sidebar (same on events, template picker, event editor, guest management, settings/account screens if implemented);
- Kadi logo, consistent navigation item size, icon weight and active treatment;
- warm off-white workspace canvas with the same shared header height, content width, controls, panel borders, radius and typography;
- top bar with contextual breadcrumb/title, notifications/profile actions only when those actions work;
- no route-specific duplicate logos or independent navigation styles.

### Mobile

- hide desktop sidebar;
- use a compact header, no horizontal overflow;
- add a safe-area-aware bottom navigation for existing working routes, with one prominent Create action;
- remove the current duplicated top mobile tab row if the bottom navigation replaces it;
- add `padding-bottom: calc(nav-height + env(safe-area-inset-bottom))` to scrollable page content;
- event-specific navigation can be in a horizontally scrollable subnav below the event heading; do not cram every subtab into the global nav.

Use `snippets/KadiWorkspaceShell.tsx` and `snippets/WorkspaceBottomNav.tsx` as concrete structure examples if their target routes match the active project. Do not keep visible navigation items that point to non-existent routes. Do not add decorative icons that do nothing.

### Dashboard (`/app/events`)

- clear title + one primary “Create invitation” action;
- useful event cards or a list with event name, occasion label, date/status, and contextual actions;
- a featured upcoming event only when a real event exists;
- empty state for a new inviter with a direct “Create your first invitation” action;
- real totals only from existing services; no fabricated RSVP percentage, fake activity log or sample names in production views;
- cards responsive enough to move from multi-column desktop to one column at mobile without clipping.

### Invitation editor (`/app/events/new` and `/app/events/[eventId]`)

- a visible stepper or clear stages: Occasion/Design, Event details, Guests/RSVP, Preview/Publish;
- desktop: editing controls and a prominent live invitation preview side by side, with the preview sticky only when useful;
- mobile: compact step-based form and explicit **Edit / Preview** switch rather than stacking a full desktop preview under an endless form;
- keep user input when stepping backwards, selecting categories or changing templates;
- preview updates when content/theme changes;
- show saved/draft/loading/error/success states honestly;
- keep existing service calls, route params and save/publish semantics.

## 8. Invitee-facing invitation and RSVP

The guest page at `/e/[slug]` has permission to use the selected event theme; it does not have permission to change the surrounding Kadi brand rules in the inviter app.

- public invite link must open on mobile without account creation;
- envelope opening is optional, skippable, keyboard accessible and respects reduced motion;
- keep the event's actual category identity: graduation should show graduation-specific details, a housewarming should highlight address/home, a funeral should prioritize portrait/service time/directions and condolences, a birthday should look celebratory;
- make the most important date, time and venue legible without zooming;
- RSVP form uses shared input/button/accessibility styles, does not request irrelevant fields, validates, prevents accidental duplicate submission, confirms success, and gives a clear error/retry state;
- directions, calendar, RSVP and share controls must work;
- don't force login for an invitee response; existing secure guest token/link rules must remain intact.

## 9. Responsive image rules (must be applied everywhere)

- Prefer Next `Image` for hero, template cards and content gallery. Configure only image hosts that are genuinely used by the catalogue; do not open arbitrary remote host patterns without reason.
- For `fill`, parent container must be `position: relative`, have a defined `aspect-ratio` or constrained height, and clip overflow. Always specify `sizes` for responsive width.
- Use `sizes="100vw"` for a real full-bleed hero; use a grid-appropriate sizes string for gallery cards; use compact sizes for small rail tiles.
- Use `object-fit: cover`, with category-appropriate `object-position`. If subject focus is lost on mobile, change the object position or use a supplied art-directed mobile crop, not an arbitrary height hack.
- No stretched images; no fixed pixel width that forces horizontal scrolling; no layout shift while images load.
- Hero/LCP image: eager/high priority once. Most below-the-fold images: lazy. Avoid marking every image `priority`.
- Every image that conveys information needs meaningful alt text; decorative background images use empty alt and must not repeat surrounding copy.
- Never reuse the wedding hero photo as a fake graduation, home, birthday or memorial image. A neutral graphic fallback is preferable to a visibly wrong photo.

## 10. Motion and interactions

Use the installed Framer Motion where it makes an interaction better; do not add a second library. Motion should be intentional and restrained:

- hero carousel: 6–8 second interval only if more than one genuine slide exists, pause on hover/focus, visible next/previous and pause/resume controls, stop auto rotation under `prefers-reduced-motion`;
- page reveal: small opacity/translate reveal, once per section; no huge distance, no delayed CTA;
- cards: slight image zoom/lift only; do not cause layout shift;
- template filtering: quick crossfade or no animation, preserve focus and scroll position;
- editor: no animation that makes controls feel sluggish;
- memorial/funeral: static or very gentle fade only, no confetti, bounce or autoplay audio;
- preserve keyboard access, visible focus and touch targets around 44px.

## 11. Code and implementation constraints

- Use the installed versions in `package.json`; do not update Next/React dependencies as part of a visual task.
- Do not create a parallel `src/app2`, demo homepage, mock database or duplicate invitation renderer.
- Keep existing route contracts and IDs. Make the smallest safe integration that creates the intended UX.
- Reuse the current `PublicNavbar`, `PublicFooter`, `Logo`, shared UI elements, `TEMPLATES`, services and event renderer; extend these instead of making lookalikes.
- Do not delete working features because they are not visible in the reference screenshot.
- Do not paste screenshots as page backgrounds. The UI must be real DOM, CSS and components.
- Keep TypeScript strict enough to detect invalid event categories. Update all category types/validators together.
- Use the provided snippets as a concrete starting point, adapting imports/aliases to the active repo. Do not blindly copy a file over a more complete current implementation.
- Use data-driven category and template collections rather than repeat-coded one-off card markup.

## 12. Mandatory visual verification

Run the actual app. Use available browser automation/screenshot tooling to capture these routes at these sizes:

| Route / screen | Viewports |
|---|---|
| `/` landing hero + next section | 1440×900, 1366×768, 768×1024, 390×844, 360×800, 320×568 |
| `/templates` and `?category=housewarming` | 1440×900, 768×1024, 390×844, 320×568 |
| `/app/events` | 1440×900, 1024×768, 390×844, 320×568 |
| `/app/events/new` and event editor | 1440×900, 390×844, 320×568 |
| `/e/[slug]` for at least a birthday, housewarming, and memorial/funeral example | 390×844, 320×568, plus one desktop size |
| `/login` | 390×844, 320×568 and desktop |

Take real screenshots, open them, and compare the largest differences with the supplied reference. Fix the three most important mismatches before continuing. Specifically confirm:

- the full landing hero is visible inside the initial viewport; headline, nav, photo and CTA are not cut off;
- on 320×568 the hero fits; if not, reduce decorative content and spacing and adjust responsive crop rather than making the page horizontally scroll;
- no image appears stretched, low-resolution or from the wrong occasion;
- each public/account/workspace/editor page uses the same type scale, border style, button style, input style and spacing system;
- mobile has no horizontal overflow, overlapping controls, hidden CTA or tiny text;
- bottom nav respects iPhone safe-area inset and does not cover content;
- template/category filters return real data and preserve selected state;
- desktop shell and mobile shell are both intentional rather than just CSS-shrunk versions of each other.

Use the project's real commands where possible:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

If a command cannot run, report the exact reason. If lint triggers an initial configuration wizard, resolve it using project-appropriate settings if safe; otherwise call it blocked. Never say screenshot checks, builds or tests passed unless they were actually run.

## 13. Completion report

When done, report:

1. the exact files changed;
2. which actual routes/screens were visually updated;
3. categories and template records added, with counts;
4. the viewport list actually screenshot-tested;
5. actual results for typecheck, tests, lint and build;
6. remaining problems, especially image assets that are temporary or any missing category/template.

For the workflow, use `phases/00-audit-before-edits.md` first, then complete each named phase in order. A phase is finished only after its files are edited, checks have run, and the visual result has been inspected when the phase changes UI. If context limits prevent completion, finish the current phase, leave the code in a coherent state, report blockers, and continue with the next phase rather than partially rewriting every page.
