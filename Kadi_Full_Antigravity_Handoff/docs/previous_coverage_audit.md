# Kadi full-scope coverage audit

## Honest status

**The current repair kit does not fully implement every requirement in the original brief.** It provides a focused patch for preview parity, shared invitation-section rendering, envelope/theming improvements, a longer landing-page structure, design-system direction, category coverage planning, mobile specifications, and QA instructions. Those files are not automatically applied to the user's live Antigravity project.

Static checks on the temporary source snapshot do not prove a successful production build or visual correctness. The actual browser screenshot comparison has not been run. Treat this as a staged implementation kit, not a completed product overhaul.

Status meanings:
- **Patched/scaffolded:** code is included in the kit, but must be merged and verified in the active project.
- **Partial:** some behavior or architecture is included; the full requested behavior is not done.
- **Not completed/verified:** no claim that this is implemented end-to-end.
- **Production dependency:** requires a real backend/provider, credentials, security, or deployed service.

## Requirement-by-requirement audit

| Original requirement | Current kit status | Remaining work before claiming complete |
|---|---|---|
| Apple-influenced visual system | **Patched/scaffolded** | Merge tokens across all public and authenticated routes; remove duplicate legacy CSS families incrementally; validate contrast, all control states and consistency in browser. |
| Split-screen studio editor | **Patched/scaffolded** | Integrate with actual editor route, verify every existing field and route, test keyboard and mobile editing, avoid duplicate studio implementations. |
| Live preview uses the real guest invitation | **Patched/scaffolded; highest priority** | Field-by-field tests for title, host(s), date, time, venue, image, palette, font, envelope, guest personalisation, visible sections and ordering; verify same renderer on draft and published pages. |
| Debounced autosave and truthful status | **Partial** | Connect to durable authenticated persistence; handle failed writes, retry, ordering/races, navigation with unsaved changes and multi-tab edits. Never claim saved from local state alone. |
| Preview-as guest | **Partial** | Test individual, couple/household, blank guest and Unicode names; resolve guest-specific content and consent. |
| Restart envelope animation | **Partial** | Verify actual sequence restarts from the first beat every time and works with reduced motion/keyboard. |
| Device switch: iPhone/Android/Desktop | **Partial** | Make each frame resize the real guest renderer at realistic viewports; verify no scaling-only fake preview, clipping or hidden controls. |
| Secure preview-share link | **Not completed / production dependency** | Build a server-generated, random, expiring and revocable token; read-only scope; no public draft access through predictable slugs or a `preview=true` flag. |
| Full invitation sections | **Partial** | Audit each event category and the public page for story/content, venue, schedule, gallery, countdown, contribution/gift, RSVP, FAQ, and event-appropriate extras. Ensure section settings actually change output. |
| Drag-and-drop content-block builder | **Not completed** | Implement a typed block schema; add/remove/reorder/duplicate; per-block settings; usable keyboard alternatives; persistence; undo/redo if supported; the same ordered config must drive preview and guest page. |
| Block library | **Not completed end-to-end** | Implement or deliberately scope Hero, Text, Photo, Gallery, Video, Map, Countdown, RSVP, Gift Registry, Program/Timeline, Quote, Divider, Button, FAQ, Music, Guestbook and Livestream. Treat arbitrary Custom HTML as a security-sensitive advanced feature; sanitize and sandbox it or defer it. |
| Typography controls | **Partial** | Curate 10+ working font pairings, scale, heading letter spacing and body line height; prove settings update preview and persist. Custom upload is a Pro/backend/storage/security feature, not just an input. |
| Colour system and palettes | **Partial** | Add at least 20 curated, category-appropriate palettes only if they can be rendered correctly; custom 5-colour palette; contrast checker; warning and accessible text alternative. Optional gradient builder stays off by default. |
| Image controls | **Partial** | Upload validation/storage; crop, zoom, focal point and object-position responsive behavior; image filters; approved source search; appropriate licence/source tracking. AI image generation needs a configured provider and should be optional. |
| Envelope designs | **Partial** | The kit improves category-aware layers and animation choreography, but photoreal depth/reference fidelity still needs hands-on comparison and refinement. Consolidate the competing envelope renderers to one canonical implementation. |
| Six envelope-opening presets | **Partial** | Confirm all six selectable presets have distinct compositions and timings: floral bloom, confetti burst, minimal fade, wax seal, gold foil, video envelope. They must work with each category; no forced Victorian look. |
| Background and scroll motion | **Not completed end-to-end** | Add safe selectable modes (none, petals, confetti, bokeh, leaves, snow, candle flicker, dove) where appropriate, plus scroll presets, speed settings, cleanup and reduced-motion handling. Memorials default to dignified low motion; some effects are unsuitable for certain events. |
| Music | **Not completed end-to-end** | Implement user-triggered playback (never unexpected autoplay), upload/library choice, start point, fade controls, pause state, media validation and mobile/browser restrictions. |
| Countdown | **Not fully verified** | Live days/hours/minutes/seconds, timezone-safe event parsing in `Africa/Nairobi`, passed/today states, accessible changing numbers, placement/config and optional flip animation. Test daylight/timezone edge cases. |
| Add to Calendar | **Not fully verified** | Generate a correct offline `.ics`, plus Google/Outlook/Yahoo links; validate escaping, timezone, end time, reminders. For funerals with service and burial, make separate calendar events when they differ. |
| Interactive map / directions | **Not fully verified** | Correct venue pin, venue switch for multi-location events, Google/Apple Maps links, native mobile directions; confirm map provider key and privacy configuration. |
| RSVP workflow | **Partial** | Test validations, household counts, plus-ones, deadlines, duplicate response policy, edit/cancel response, confirmation, network errors and server persistence. Ensure preview mode cannot submit real data. |
| Contributions and M-Pesa | **Partial / production dependency** | Clearly label simulation as simulation. Real STK Push requires configured Daraja credentials, server-side request, callback/webhook verification, transaction state/idempotency and secure reconciliation. Never simulate a successful payment as real. |
| Kenyan context and imagery | **Planning only / partial** | Audit every asset and replace wrong or broken photos; use licensed/approved images that genuinely fit event category and Kenyan context. Add meaningful alt text and responsive focal crops. Copy should use KES, Kenyan dates/phone formats, EAT where relevant, M-Pesa and context-appropriate Swahili. Do not fake Kenyan phone numbers as reachable real users. |
| Category diversity | **Plan included; actual catalogue incomplete** | Make sure each promised category has actual templates, demo content, relevant sections, imagery, palette, typography and motion—not only a filter chip. Current snapshot has 28 templates in 12 of 23 categories. |
| Longer professional landing page | **Structure patched/scaffolded** | Verify final rendered page has intentional sections below a complete first viewport; accurate links and content; responsive imagery; no broken remote assets; screenshot comparison at the listed dimensions. |
| Hero fits without scrolling | **Specification included, browser not verified** | Test 1440×900, 1280×800, 390×844, 375×667 and 844×390; the navigation, headline, CTA and main visual must fit, with safe areas accounted for. The page below the hero can be long. |
| Consistent app across routes | **Partial** | Apply the same shell/tokens to dashboard, templates, event list, editor, guest management, login, registration and settings. Check no route retains unrelated spacing/type/surface systems. Public invitation designs remain intentionally expressive. |
| Mobile, accessibility and motion | **Spec included; not fully browser verified** | Run every route at phone/tablet/desktop and landscape; verify touch targets, focus, keyboard, screen reader labels, reduced motion, dynamic text and safe areas. Test dark mode only where it is a product-supported theme—not by adding forced dark styling. |
| Loading/empty/error/success states | **Partial** | Audit every route and mutation. Use skeletons for page-level loading, inline errors, recoverable retry, purposeful empty states, disabled/busy button states and clear publish/save distinctions. |
| Production auth and data | **Known blocker** | Source snapshot uses a prototype login and in-memory mock DB. Replace with actual session/auth provider and durable database, email verification/recovery, owner-level authorization on every server action/API, validation and rate limits before public production. |
| 20 anti-vibe-coded improvements | **Documented as a checklist** | Each change must actually be implemented and visually verified; checklist text alone is not implementation. |
| Automated and browser QA | **Incomplete** | Run tests/build in the real target environment; perform a route/interaction matrix and screenshot comparisons. Current report says the actual browser screenshot comparison has not been run, tests/build were blocked/not verified. |

## Minimum full-completion acceptance gate

Do not call the app-wide redesign complete until all items below are evidenced in the real project:

1. A route inventory shows every route and the shared shell/design-system coverage.
2. Automated tests demonstrate that each editor control updates the exact guest renderer; autosave failures are visible and recoverable.
3. The same invitation component/config drives preview and published guest output, with preview side effects disabled.
4. Six envelope presets have distinguishable geometry/motion and screenshots/video of each; no default category-wide Victorian styling.
5. Event coverage lists every category, its real template IDs, data, suitable assets and enabled blocks.
6. Every requested block operation works and is reflected in both preview and guest view.
7. Countdown, calendar, map, RSVP, contribution, music and background-motion behavior each have tests or an explicitly documented and honestly labelled integration boundary.
8. No demo or mock provider is presented as live production behavior.
9. All target viewport screenshots are compared to the reference targets; clipping, overflow, broken imagery, hidden CTAs and inconsistent page shells are fixed.
10. Typecheck, lint, tests and production build results are recorded honestly with logs; environment blockers are named, not called passes.

## Recommended work order

- **Phase A — Preserve and stabilize:** source backup/branch, dependency and route audit, baseline screenshots, remove duplicate sources of truth.
- **Phase B — Shared app shell and design system:** every route, responsive behavior, common controls/states.
- **Phase C — Real invitation configuration model:** typed event design, sections/blocks, order/visibility, event-category defaults, schema validation.
- **Phase D — Preview parity:** connect controls to the same renderer/config as public invite; autosave and secure preview semantics.
- **Phase E — Envelope and motion fidelity:** category-specific art direction, six presets, reduced motion, screenshot-driven refinement.
- **Phase F — Content block builder and creative controls:** drag/reorder/duplicate; font, palette, crop/focal point and animation settings.
- **Phase G — Guest utilities and transactions:** countdown, calendar, maps, RSVP, contribution/M-Pesa, music.
- **Phase H — Occasion diversity and image audit:** actual templates, licensed/context-appropriate images, copy and accessible art direction.
- **Phase I — Landing page and responsive QA:** complete first viewport, full long-form body, actual browser screenshot corrections.
- **Phase J — Production foundations and release gate:** real database/auth, authorization, test/build/report.

This checklist is intentionally conservative. A requirement is complete only when the code is integrated into the actual app and behavior has been verified—not when a prompt or static snippet exists.
