# Full-scope requirements matrix and definition of done

A requirement is “done” only after code is integrated in the real repository and the relevant tests/UI path have passed. A prompt, mockup, component file or static screenshot alone is not completion.

| Workstream | Deliverables | Acceptance evidence |
|---|---|---|
| Audit | Route/component/service inventory, baseline screenshots, command baseline, risks | Audit doc updated against current workspace; Git changes preserved |
| Design system | Tokens, component states, shared app shell | Every authenticated route has consistent nav/spacing/control behavior; no stray tokens |
| Landing | viewport-fit hero + long-form below-fold content | screenshots at 375x667, 390x844, 1280x800, 1440x900; CTA visible without scrolling the hero |
| Category discovery | canonical category filters and curated assets | all 23 categories browsable; at least planned template for each; each links to correct filter/new-event route |
| Templates | distinct art direction and complete metadata | no wedding template shown for other categories by default unless chosen; missing categories aren't just empty filters |
| Live preview | shared guest renderer + one draft config | tests for title/date/venue/images/design/sections/order/guest name + preview side-effect isolation |
| Autosave | optimistic state + debounce + save queue/revision | state shows correct transitions; delayed/failing responses cannot revert newer draft or claim saved |
| Envelope | one renderer, 6 real presets, motion cancellation | visual capture of each preset and opening sequence at phone and desktop widths; skip/replay/reduced-motion works |
| Blocks | add/remove/duplicate/reorder/settings | action updates preview immediately and persists typed JSON; keyboard reorder supported; tests cover id/order/update/delete |
| Typography/palette | presets + sliders + contrast | every control changes actual output and is persisted; contrast warning calculated not decorative |
| Images | upload/provider integration, crop, focal point, responsive delivery | no unbounded layout shift; mobile images fit; failures show fallback; provider keys server-side |
| Countdown | ticking timezone-aware and post-event state | unit tests for before/at/after boundary and timezone; no hydration mismatch or leaking intervals |
| Calendar | ICS / Google links and multi-location services | parseable ICS with correct time zone, start/end, escaping and alarms; multiple memorial services are separate events |
| Map | map/directions action | valid maps URL, venue toggle for multi-location; no fake interactive map; no exposed secrets |
| RSVP | guest token / household / plus-one validation | server validation and constraints tests, preview cannot submit real response, duplicate/retry behavior understood |
| M-Pesa | provider adapter or labelled simulation | no fake “paid”; verified callback/idempotency/reconciliation test in real integration; clear disabled/sandbox state without credentials |
| Guests & notifications | CRUD, import, consent, safe share | CSV row report, no auto-send on import, role/owner checks, manual vs automated send clearly distinguished |
| Auth & persistence | durable DB adapter + real auth + authorization | multi-user isolation tests; refresh/restart persistence; secure sessions; API ownership tests |
| Kenya-specific UX | locally appropriate imagery/copy/pricing/date/phone | asset audit with image source/license and alt text; copy uses context, no stereotyping; price in KES |
| Accessibility | semantic roles/focus/keyboard/contrast/reduced motion | keyboard walkthrough and automated checks if available; reduced-motion capture; screen-reader names |
| Mobile | route screenshots/functional paths | no x overflow at 320–430px, touch targets ≥44px, no clipped fixed buttons or modal traps |
| Errors/empty/loading | all route states | actions offer retry/next step; skeleton layout stable; no false success or dead buttons |
| Release QA | typecheck, lint, tests, build, screenshots | actual command logs/exit codes and screenshots linked; blockers documented accurately |

## Twenty high-value anti-vibe-coded changes

1. Replace scattered hex values with shared CSS variables.
2. Give the public landing page a deliberate section story instead of stopping after hero + categories.
3. Fit the first hero composition inside the initial viewport on phones.
4. Use responsive, licensed and relevant image art direction instead of generic stock assets.
5. Show actual occasion diversity above the fold; stop equating invitations with weddings.
6. Replace disconnected form state with one typed draft object.
7. Make the editor preview the same guest renderer, not a static poster.
8. Separate immediate visual updates from debounced persistence.
9. Serialize saves or guard revisions so stale responses cannot overwrite newer edits.
10. Make six envelope presets structurally/motion-distinct, not colour-only variants.
11. Remove duplicate envelope implementations or route both through one canonical renderer.
12. Tie section order and visibility to the actual render tree.
13. Build a real serializable content-block registry with stable IDs.
14. Provide meaningful empty/loading/error/saved states instead of placeholder copy.
15. Fix mobile editor into explicit tabs, not tiny multi-column controls.
16. Keep guest RSVP account-free and personalization token-bound.
17. Separate demo, sandbox and production states for M-Pesa/notifications/persistence.
18. Keep motion purposeful, cancellable and reduced-motion compliant.
19. Use responsive image crop/focal point, `sizes`, explicit ratio and alt text.
20. Establish screenshot-based QA for each route and fix visible mismatch rather than stopping at successful compilation.
