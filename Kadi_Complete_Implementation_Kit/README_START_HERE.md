# Kadi Complete Implementation Kit — Start here

This pack is tailored to the Kadi source snapshot shared in this conversation (Next.js App Router, React, TypeScript, Tailwind, Framer Motion, Lucide). It contains a copy-ready implementation prompt, scoped phase prompts, reference boards, and snippets for the shared design system, full-viewport landing hero, occasion diversity, responsive image cards and mobile workspace navigation.

## What is inside

- `MASTER_PROMPT_FOR_ANTIGRAVITY.md` — full product-level instructions, current source observations, visual acceptance targets and QA requirements.
- `phases/` — smaller prompts to use one at a time if Antigravity performs poorly with large tasks.
- `snippets/kadi-design-system.css` — shared style tokens and primitives.
- `snippets/KadiFullViewportHero.tsx` + `kadi-viewport-hero.css` — carousel hero with navigation included inside one viewport height.
- `snippets/landing-hero-slides.ts` — first slide is the local hero envelope, followed by representative categories from the actual template catalogue.
- `snippets/occasion-art-direction.ts` — category-specific visual direction, copy tone, image brief, palette and motion guidance.
- `snippets/event-categories.ts` — canonical event category type and labels.
- `snippets/TemplateDiversityExamples.ts` — mergeable examples for housewarming, graduation, birthday, funeral service and a second housewarming look.
- `snippets/ResponsiveTemplateCard.tsx`, `OccasionRail.tsx` and `kadi-template-components.css` — shared template gallery primitives with responsive image sizes.
- `snippets/WorkspaceBottomNav.tsx` — mobile navigation using routes present in the inspected source snapshot.
- `snippets/event-category-type-patch.md` — instructions to update both existing type locations safely.
- `reference/` — the supplied multi-occasion and workspace boards for Antigravity to inspect.
- `public/kadi/` — local hero envelope, phone and wedding sample assets. The envelope can be copied into Kadi at `public/kadi/hero-envelope.webp`.

## Recommended workflow

Do not dump every file into Antigravity and ask it to “make everything beautiful” in one pass. Use this order:

1. Open the active Kadi repository. Paste `MASTER_PROMPT_FOR_ANTIGRAVITY.md` first. Ask Antigravity to inspect the files and make a concise repository audit, but keep it from changing code during the audit.
2. Once it returns the audit, paste `phases/01-shared-design-system-and-shell.md` and require implementation + typecheck.
3. Paste `phases/02-full-viewport-landing-page.md`. Compare screenshots before continuing.
4. Paste `phases/03-diverse-occasion-catalogue.md`. Do not proceed until each core category has a real template record and a relevant image.
5. Paste `phases/04-template-library-and-editor.md`.
6. Paste `phases/05-workspace-dashboard.md`.
7. Paste `phases/06-invitee-auth-and-rsvp.md`.
8. Paste `phases/07-responsive-images-and-mobile.md`.
9. Finish with `phases/08-visual-qa-and-repair.md`.

If Antigravity tries to only describe what it will do, reply: **“Implement the current phase in the existing files now. Do not send another plan. Run the checks and show me the screenshot results.”**

## Where snippets go

| Snippet | Recommended target in Kadi |
|---|---|
| `event-categories.ts` | `src/lib/events/categories.ts` |
| `occasion-art-direction.ts` | `src/lib/templates/occasion-art-direction.ts` |
| `KadiFullViewportHero.tsx` | `src/components/landing/KadiFullViewportHero.tsx` |
| `landing-hero-slides.ts` | `src/lib/templates/landing-hero-slides.ts` |
| `ResponsiveTemplateCard.tsx` | `src/components/templates/ResponsiveTemplateCard.tsx` |
| `OccasionRail.tsx` | `src/components/templates/OccasionRail.tsx` |
| `WorkspaceBottomNav.tsx` | `src/components/app/WorkspaceBottomNav.tsx` |
| `kadi-design-system.css` | Merge into `src/app/globals.css`; don't overwrite existing global rules |
| `kadi-viewport-hero.css` | Merge into `src/app/globals.css` |
| `kadi-template-components.css` | Merge into `src/app/globals.css` |
| `TemplateDiversityExamples.ts` | Merge new entries into `src/lib/templates/catalogue.ts` after adding the category and motion type literals |

The path table is a guide. Antigravity must confirm aliases and current folder conventions in the active repo before importing.

## Important

The TSX snippets are implementation starting points, not a claim that the full Kadi app has been modified. The updated application still needs to be integrated and run inside Antigravity. It must validate the active repository's current changes, not rely on this kit alone.
