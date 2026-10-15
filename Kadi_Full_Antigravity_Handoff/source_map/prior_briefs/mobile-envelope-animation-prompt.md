# KADI — MOBILE-FIRST ENVELOPE REALISM + STRONG SCROLL ANIMATION PROMPT

You are modifying the existing Kadi Next.js application. This is a concrete implementation task, not a request for advice, a design description, a static mockup, or another generic design system.

The previous version is not visually strong enough on mobile. The opening letter looks like a flat CSS card, the motion lacks impact, and the content feels too shallow. Correct those exact failures in the actual codebase.

The supplied four videos and `docs/VIDEO_REFERENCE_SPEC.md` are the primary visual references. Build the interaction around those videos: a designed full-screen stationery world; a recognisable physical envelope with folds, paper thickness, liner and wax seal; a card and additional inserts visibly pulled out of it; then a rich, scrollable invitation with large typography, framed sections, photo compositions, illustration and lively transitions.

Do not copy competitor marks, watermarks or proprietary artwork. Create original assets in code/SVG/CSS or use existing licensed/user-uploaded assets.

## 1. Inspect before coding

Inspect `src/components/animation/EnvelopeRenderer.tsx`, `src/app/globals.css`, `src/app/e/[slug]/page.tsx`, template definitions, the content section components, `package.json`, and the current test suite. Preserve the existing framework, routes, event data, RSVP logic, payment and contribution UI, gallery and other working parts. Keep modifications incremental.

The envelope currently uses `.iv-envelope-back`, `.iv-envelope-liner`, `.iv-paper-stack`, `.iv-card-preview`, `.iv-envelope-pocket`, `.iv-envelope-flap-face` and `.iv-seal`. Improve these real components rather than recreating the old flat envelope. Keep CSS and TSX separated sensibly; move to a custom inline SVG or reusable SVG component if the existing HTML/CSS shapes cannot achieve the reference quality.

## 2. Mobile is the primary canvas

Design and test the guest-facing invitation first at these phone viewports: 320×568, 360×800, 390×844, 430×932. Desktop is secondary and must adapt from the mobile design, not control it.

The sealed envelope screen must feel like a designed invitation, not an app screen:
- Fill the first mobile viewport intentionally with the chosen visual world. Use `100vh` fallback followed by `100svh`/`100dvh` where supported.
- Do not show a conventional SaaS navigation bar or floating dashboard controls over the closed envelope. Keep brand attribution quiet and controls unobtrusive.
- Centre the envelope on the visual axis, but give the scene designed hierarchy and asymmetry through original botanical, disco, paper or memorial artwork.
- On short phones, reduce the title spacing and envelope size; never crop the wax seal, envelope, tap instruction or skip action behind the browser chrome.
- Keep the envelope large enough to read as an object, not a tiny decorative symbol. Avoid a giant headline pushing it below the fold.
- Ensure the seal remains an easy touch target, including on 320px-wide devices.
- Check both iOS Safari-like dynamic viewport behaviour and Android Chrome-like viewports. Avoid relying on unsupported `calc()` multiplication or desktop-only pointer hover.

## 3. Make the envelope unmistakably physical

It must look like a high-quality invitation envelope inspired by the actual videos, not a simple rounded rectangle with one triangle laid on top.

The composition needs separately controlled, correctly stacked layers:
1. Back surface and edge.
2. Envelope paper stock with fine grain/fibre texture and lighting.
3. Patterned inside liner, with template-specific floral, geometric, foil, or quiet memorial detail.
4. Two or more paper inserts/card layers with different offsets and realistic paper edges.
5. The personalised invitation card, tall enough that the guest can tell a proper card is being pulled out.
6. The front envelope pocket, constructed from the left/right/bottom folded panels, visible crease lines, clean mitred geometry and delicate edge shading.
7. A separate hinged flap with outer paper face and inner liner face. The inside face must be visible when the flap opens; do not just rotate the only face away.
8. A distinct wax seal or template-appropriate closure, positioned where the flap meets the pocket. Give the seal an irregular pressed-wax silhouette, embossed rim, highlight, darker lower edge and a raised monogram or small custom crest. It must look attached to the flap, not floating above the envelope.
9. Contact shadow beneath the object and natural shadow where the flap/card meets other paper.

Use intentional light direction consistently. Add paper grain with subtle textures, not high-contrast noise or polka dots. Add tiny edge/crease highlights, not thick cartoon outlines. Avoid excessive rounded corners, generic drop-shadow presets, and bright gradients that make paper look like plastic.

Match the relevant video art direction:
- Sage wedding: pale sage/ivory paper, botanical inner liner, restrained wax medallion, fine frame and calm romantic details.
- Ruby disco birthday: red textured world, a strong inset frame, cream printed invitation, metallic/disco details and bold celebrant/age hierarchy.
- Pastel garden: soft cream, illustrated florals, blush liner, green details and graceful typography.
- Gift-led birthday: ruby paper, keepsake/envelope motif, then clickable note/flowers/cake and scrapbook photographs.
- Memorial: muted paper and dignified ornament; no party effects.

## 4. Choreograph the physical opening as separate beats

The opening must be genuinely visible and satisfy these steps in order:

**Beat A — seal press.** The user taps the seal. The seal compresses slightly into the paper, its highlight changes, and the envelope responds with a tiny physical downward pressure and recovery. Use a deliberate 250–450ms beat. Do not make the entire envelope shrink like a button.

**Beat B — break/release.** The seal releases or lifts/fades with a small controlled highlight or paper movement. Do not use confetti by default. The envelope must remain visually stable under it.

**Beat C — hinged flap.** The flap rotates backwards around the exact top hinge in 3D. The interior face becomes visible, and its shadow sweeps across the liner. A missing back face or instantly disappearing triangle is a failure.

**Beat D — inserts move.** Two paper/card layers rise from the pocket at different speeds and angles, with believable parallax and shadows. They should not all translate together at the same exact speed.

**Beat E — hero card emerges.** The tall invitation card moves up from inside the envelope far enough that most of the card is visible, then tilts gently back into alignment. Its type, illustration and actual event photo become legible as it emerges. The bottom remains inside the pocket briefly, establishing depth.

**Beat F — transition.** The emerged card grows or transitions into the invitation cover. Use a choreographed reveal/wipe/morph-style handoff; do not abruptly unmount the envelope and fade in an unrelated page. The background and decorative world must connect between opening and cover.

Use separate timing/easing curves for seal, flap, insert stack, card, and cover. The full opening should be memorable and deliberate, not a single slow fade; target around 2.4–3.2 seconds, with a visible skip option once opening starts. Never trap the guest. The whole object must respond smoothly on mobile touch.

The card should not travel a hard-coded fixed number of pixels. Use percentages, measured sizes, CSS variables or motion values tied to its own dimensions so the choreography works at different phone sizes.

## 5. Dramatic, real scroll-driven invitation reveals

The invitation must not settle into a static sequence of headings and generic blocks. The design should continue to move as the guest scrolls, inspired by the supplied videos. Use strong but controlled changes of scale, masking, layering, stagger and image composition.

Create one coherent reveal system using installed tools and the existing React/Framer Motion version. Do not add a second animation library unless a specific need is demonstrated.

Required motion patterns:
- Hero photograph opens through a large vertical or diagonal mask, followed by a slow image scale/position settle.
- Large names and statement typography reveal through a mask/clip, with deliberate line staggering.
- Section transitions use template-specific illustrated rules, frame reveals, botanical linework, curtain/paper wipes or background colour-plane changes.
- The long invitation alternates between light paper and deep colour sections when the theme calls for it; it should feel like designed printed stationery unfolding, not repeated cards.
- Timeline paths draw while milestone items reveal, including accompanying photographs and short text.
- Venue photos or illustrations enter with perspective/clip transitions; supporting address text arrives after the main place name.
- Programme/order-of-service lines draw and rows arrive with a stagger.
- Photo galleries reveal as overlapping/offset photographs or irregular editorial mosaics with different proportions. Preserve intentional rotation in the collage while the image itself reveals.
- Large images drift at a small, controlled parallax offset while the user scrolls. Use passive events and `requestAnimationFrame`, CSS scroll-driven animations with a fallback, or another tested method. Cap offsets at approximately 12–24px on phones so text and images do not appear seasick.
- Interactive gift objects (message, flowers, cake) visibly react to taps and transition the real selected content below them.
- The RSVP section gets a more deliberate chapter entrance but the form becomes immediately usable. Never delay access to a form while an animation completes.
- FAQ disclosures animate their opening/closing while preserving accessible disclosure semantics.
- The end section closes the invitation's visual narrative, with a designed photo/type treatment rather than a generic footer card.

Do not use one identical fade-up for everything. It will still look generic. Use at least four distinct families of motion, assigned deliberately: masked image reveals, clipped/staggered typography, drawn line/timeline, offset/scale photo compositions, and measured parallax.

## 6. Add substantial useful content, with content-aware length

The full wedding, birthday and memorial module lists are specified in `docs/VIDEO_REFERENCE_SPEC.md` and `Kadi_Invitation_Scrollytelling_Antigravity_Prompt.md`. Preserve the existing real section components and extend the renderer and event model where necessary. Use event data for every name, age, date, venue, photograph, schedule entry, gift option, FAQ and RSVP deadline. Do not hardcode sample age 19 or fake people/events into real published invites.

Wedding should be able to show hero, personalised guest greeting, story, ceremony, reception, programme, registry/contributions, gallery, RSVP, FAQs, dress code/accommodation links when configured, and an intentional close. Birthday should support about/personality facts, party details, menu/drinks, activities, wishlist, gallery, RSVP and closing. Memorial should support obituary, life milestones, service details/order of service, gallery, moderated tributes, virtual candles, family support/contributions, livestream and condolence form where enabled.

Hosts should be able to enable/hide and reorder relevant sections in the editor. Do not render empty sections or meaningless blanks when data has not been provided. Use explicit demo fixtures to test richer layouts without inventing personal details in published events.

## 7. Keep real actions real

- Maps and calendar actions use actual event data.
- RSVP continues to use the existing backend and produces a truthful success/error state.
- Guest token and household permissions are checked server-side where applicable.
- Gallery images use the current media mechanism and never become placeholder stock images for a real event.
- Contribution UI appears only when configured; never report a payment as successful based on a button press.
- Music starts only after an explicit gesture. Provide persistent play/pause or mute controls when music exists.
- Do not delete existing routes or integrations to make the visual work easier.

## 8. Motion accessibility and performance

- Use `prefers-reduced-motion` to skip complex choreography and reveal all content in its final state.
- Keep semantic heading order, alt text, keyboard-operable controls, visible focus and accessible gallery close/navigation.
- Do not animate text letter by letter in a way that breaks screen readers; keep a sensible semantic text string.
- Avoid layout shift by reserving image sizes and section space.
- Pause or avoid off-screen continuous animation.
- Lazy-load below-the-fold gallery assets, prioritise cover media, and avoid heavyweight assets where simple SVG/CSS works.
- Support audio refusal and media load failure honestly, with no broken blocking state.

## 9. Required implementation and verification

Edit actual source files. At minimum inspect and modify the envelope renderer and its styles; update template metadata/data types only if needed. Add or adapt tests as appropriate. Do not finish after editing only a prompt or a CSS colour palette.

Visually inspect the actual running page at the four phone viewports listed above. Use screenshots at the closed envelope, mid-opening/card-emergence state, first revealed cover, and at least three different scroll points. Also check one desktop viewport. If browser automation is available, use it. If it isn't, explain the exact blocker and do not pretend visual screenshots were reviewed.

Acceptance criteria:
1. Closed envelope no longer looks like a flat card or generic triangular mail icon.
2. Flap hinges correctly, its back/liner is visible, paper stack emerges in layers, and the card visibly rises from inside the pocket.
3. All of the opening fits the first mobile viewport without clipping or excessive empty space.
4. The opening has multiple visible physical motion beats and an accessible skip/replay path.
5. Scrolling reveals imagery and typography through clearly different, noticeable animations. At least some photo elements respond continuously to scroll without disorienting movement.
6. Each template has distinct artwork/motion, not the same envelope merely recoloured.
7. All optional content sections remain data-driven and useful; published invites have no fake age, venue, count or success status.
8. RSVP, gallery, calendar/map, audio controls and existing integrations remain functional.
9. Reduced-motion mode leaves the full invitation readable and all controls operational.
10. Typecheck, lint, tests and production build are run where possible. Report exact outcomes, remaining failures and any dependency/platform cause without claiming success prematurely.

Do not say “improved” unless the actual phone-sized result has been inspected. Implement the changes, verify them, and report the files changed and evidence of the test results.
