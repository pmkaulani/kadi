# Phase 11 — mobile, accessibility, responsive imagery and performance

Use `docs/MOBILE_IMAGE_PERFORMANCE_AND_ACCESSIBILITY.md`. Audit every public and app route, not only landing/editor.

- Breakpoints and viewport targets: 320×568, 360×800, 375×667, 390×844, 393×852, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080.
- Homepage hero fits initial screen; header/CTA not below fold. On mobile use a deliberately rearranged design, not a squeezed desktop split.
- Use `next/image` and configured remote patterns; stable width/height, sizes, ratio, object-position/focal point, lazy loading below the fold, priority for actual LCP image. Add fallback for failure and informative alt.
- Templates browse horizontally only where it helps; touch rail has scroll snap and focus states. Search/filter remain visible and usable.
- Editor mobile uses Edit/Preview tabs and full-width panels. Preview can scroll internally without trapping page navigation. Floating toolbar doesn't cover content.
- Workspace uses one mobile navigation paradigm; bottom bar obeys safe area and never covers primary form actions. Lists convert to useful stacked rows instead of compressed data tables.
- Dialogs/bottom sheets fit safe area, prevent background scroll appropriately, have close and focus return; forms keep submit reachable while keyboard opens.
- Keyboard-only navigation, focus ring, labels/error descriptions, headings/landmarks, screen reader names, reduced motion, 200% zoom/reflow and contrast checks.
- Remove layout shift and oversized JS/animation work. Test on throttled mobile if possible; limit large background particles and use requestAnimationFrame/intersection logic with cleanup where needed.

**Acceptance:** screenshots for listed viewports, no horizontal overflow, all target controls reachable, reduced-motion path tested, image layout stable on load, console free of layout/hydration warnings in major flows.
