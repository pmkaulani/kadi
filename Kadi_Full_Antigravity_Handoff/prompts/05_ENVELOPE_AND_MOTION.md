# Phase 05 — envelope realism and purposeful animations

Inspect current `EnvelopeRenderer.tsx`, `WaxSeal.tsx`, `MotionToolkit.tsx`, `src/components/animation/kadi-invitation-kit/EnvelopeExperience.tsx`, envelope styles and reference boards. There must be one canonical animation implementation; no parallel version drifting from preview/published guest.

Implement a layered tangible envelope: base paper substrate, subtle grain, inside liner, staggered inserts, invite card, left/right/bottom front pocket folds, crease/shadow lines, top hinged flap with inside face, embossed wax seal with bevel/rim/monogram and ground-contact shadow. Use 3D perspective/transform origin/backface visibility properly. Typography and imagery on the rising card must be readable, event-specific and data-driven.

Opening choreography should have explicit timeline/state and cancellation:
1. closed invitation visible with subtle invitation cue (not a constant distracting pulse);
2. seal compresses, shadows react, seal releases;
3. flap rotates back around hinge (~180°);
4. inner liner appears;
5. inserts rise at staggered angles;
6. invitation card emerges and settles;
7. seamlessly reveals the full scrollable guest invitation.

Provide Replay and Skip to Details; skip cancels all pending timers/animations; Escape should work where appropriate. Motion uses spring-like/framer transitions, not random perpetual animation. Must respect reduced-motion, pointer/keyboard and current browser. Don't auto-play sound; no heavy particles on low-end phones.

Six requested choices must differ structurally or choreographically: floral bloom, confetti burst, minimal fade, classic wax seal, gold foil and video envelope. Add category-specific defaults (Ruby Disco, gift-led, Pastel Garden, Sage Love Letter, dignified memorial, graduation, housewarming, corporate/holiday). Avoid a generic wax seal and Victorian style for every event. Funeral/memorial presets cannot inherit celebratory motion.

Measure mobile sizes and verify flap doesn't clip, layout overflow or make buttons inaccessible. Capture each preset at closed, flap open and card rise and compare to reference boards. If textured image layers are used, package them locally and state license/source. Be clear if an implementation remains stylized CSS rather than photorealism.

**Acceptance:** one renderer is used by template preview, editor preview and live guest; six presets verified; no motion leaks after unmount; reduced-motion path settles safely.
