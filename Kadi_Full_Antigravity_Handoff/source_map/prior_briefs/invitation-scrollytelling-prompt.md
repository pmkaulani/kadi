# KADI — MASTER IMPLEMENTATION PROMPT: REALISTIC ENVELOPE, RICH INVITATION CONTENT, AND CINEMATIC SCROLL ANIMATIONS

You are working on Kadi, a multi-event digital invitation platform. The project is being developed from an existing codebase. Your job is to implement the guest-facing invitation experience and the supporting template/editor behaviour in the actual code—not just provide mockups, design advice, or another specification.

The supplied reference videos are the primary visual reference. The desired result is a beautiful, bespoke, immersive invitation that unfolds like real stationery and then continues as a long, art-directed digital experience. The current experience feels shallow. It must have a convincing physical envelope/letter, many more meaningful content sections, and sophisticated scroll-triggered motion throughout the invitation.

## 0. NON-NEGOTIABLE WORKING RULES

1. Inspect the repository before changing code. Read `package.json`, existing routes, invitation components, template data/schema, CSS, animation dependencies, data models, API endpoints and available tests.
2. Work within the actual stack and versions in the repository. Reuse suitable installed dependencies. Do not blindly upgrade the framework or add multiple overlapping animation libraries.
3. Preserve working routes, authentication, event management, RSVP, media handling, contribution-related UI, existing API integrations and database structures. Make additive changes and migrations where needed; do not replace a working product with a disconnected demo.
4. Implement, run and test changes. Do not stop after producing a plan, an image, static HTML, or a prompt. Do not claim features work unless you verified them.
5. Do not flatten the invitation into a stack of generic rounded cards. Prefer full-bleed art direction, editorial typography, carefully layered stationery, negative space, asymmetry, fine rules, decorative frames and varied section compositions. Cards may be used only when the design genuinely calls for one.
6. Do not use emoji as decoration or as substitutes for real artwork/icons. Use custom SVG/CSS artwork, suitable supplied assets, or a consistent icon library already used by the project.
7. Never leave sample names, sample dates, sample venues, fake RSVP counts, fake contributions or placeholder gallery images in a published invitation. Example content is allowed only in clearly identified preview/demo fixtures.
8. Make the experience look and feel deliberate, not like a generic AI-generated dashboard. No default gradient blob, repeated card grid, random floating shapes or one animation reused on every page.
9. Use the supplied four reference videos to retain the distinct directions: (a) ruby-red disco birthday, (b) pastel garden birthday, (c) gift-led birthday with interactive messages/flowers/cake and photo collage, and (d) sage botanical wedding. Build a coherent template system that permits genuinely different designs rather than recolouring one layout.
10. The opening animation and scroll animation must enhance the content, never obstruct it. No scroll hijacking, forced horizontal scroll, unskippable intro or long blank wait.

## 1. FIRST: AUDIT AND REPORT THE EXISTING IMPLEMENTATION

Before edits, identify:
- The current public invitation route and renderer.
- How the invitation obtains event/guest data and how personalisation works.
- Which template and section configuration schema already exists.
- How the RSVP form submits, validates and reports success/errors.
- Existing image upload/storage and gallery components.
- Existing event, venue, program, gift/contribution, obituary, condolence, candle and livestream fields/models, if any.
- The currently installed animation libraries and their versions.
- Existing design tokens, fonts, logo assets and responsive breakpoints.
- Relevant scripts for type checking, linting, tests and production build.

Then implement the changes in the existing structure. Summarise what was found and which files will be changed, but do not wait for user confirmation to proceed.

## 2. THE ENVELOPE MUST LOOK PHYSICAL AND OPEN LIKE THE REFERENCE VIDEOS

Build the closed-envelope screen as a designed 3D stationery composition. The envelope is the hero interaction; it is not a plain rectangle with a triangular flap and not an ordinary card sitting in a box.

### Visual construction

Use independently controllable layers whenever practical:
- A background environment consistent with the selected invitation style: printed paper, textured stock, subtle fabric, floral illustration, disco lighting, or a suitable event photograph.
- Envelope back/body.
- Inner envelope liner with a meaningful pattern/illustration matched to the selected design.
- An invitation card partly tucked inside the envelope.
- Front pocket/fold and side/bottom folds.
- Top flap hinged at its actual top edge.
- A dimensional seal (wax, embossed monogram, printed emblem, ribbon or design-appropriate closure).
- Contact shadows, paper-edge shading, gentle highlights and a subtle surface texture.
- Personalised names or a short line on the envelope where the template calls for it.

Create the artwork in SVG/CSS or use legitimate assets in the repository. Make folds and shadows react consistently to the source layers. The layers must visually agree on paper thickness, direction of light and perspective. Use 3D transforms and a perspective camera where supported, plus `backface-visibility` where appropriate. If the current CSS-only construction cannot convincingly support a template, use a well-structured SVG or the animation technology already present in the project. Avoid a random emoji, stock icon or single flat illustration pretending to be a realistic envelope.

### Opening sequence

When the visitor taps/clicks the envelope or activates the accessible “Open invitation” control:
1. The seal reacts with a slight pressure/scale response and a brief highlight or separation effect appropriate to the artwork.
2. The top flap rotates backwards from the top hinge with clear perspective. It must not rotate around its centre or simply fade away.
3. The patterned liner is revealed beneath the flap.
4. The invitation card moves upward from inside the envelope, with a small forward tilt, paper depth, contact shadow and convincing z-order.
5. The card clears the envelope and grows/settles into the cover composition.
6. The main invitation title, names and cover photograph reveal in sequence. Use elegant staggered typography rather than making every element appear at once.
7. Decorative detail can move slightly in response, but the event's names and main subject remain the focal point.
8. The open state transitions naturally into the first full invitation section; it must feel like the same designed object has opened into a living page.

Use a well-paced overall sequence, approximately 1.8–3 seconds depending on the preset, with shorter timings on reduced-motion or low-power conditions. Provide a clear skip/open-immediately action, replay control and a stable post-animation state. Do not force the visitor to replay the sequence on every route navigation. Prevent double activation and animation-state races.

### Multiple envelope presets

Create different envelope treatments per template, not just different colours:
- **Sage botanical wedding:** warm ivory or sage stock, botanical liner, understated embossed monogram, subtle shadows and soft natural light.
- **Ruby disco birthday:** rich red or burgundy envelope, metallic or foil-like accents, high contrast, confident typography, controlled highlights and party-artwork reveal.
- **Pastel garden birthday:** soft patterned liner, illustrated florals, pastel paper, gentle paper movement and friendly type.
- **Gift-led birthday:** tactile gift/card reveal that ties into the interactive flowers, message or cake motif, then transitions into photo collage.
- **Memorial:** restrained, dignified paper, muted tones, calm transition and no celebratory particles/confetti.

The guest's invitation type, selected template and event data determine the preset. Keep this configurable in template metadata.

## 3. MAKE SCROLLING FEEL LIKE A SEQUENCE OF REVEALS, NOT A LONG STATIC PAGE

The current invitation feels shallow. Expand the content and give each section a distinct visual composition and scroll behaviour. The page needs a designed beginning, middle and ending. Motion must follow the invitation's story and actual content, not be applied randomly.

First inspect the dependencies. Prefer the existing animation library and `IntersectionObserver`/CSS for straightforward reveals. Use GSAP ScrollTrigger only if it is already present or justified by the existing stack. Use one coherent motion system; avoid conflicts among Framer Motion, GSAP, CSS timelines and custom scroll listeners.

### Global motion principles

- Use viewport entry/exit intentionally; do not animate every paragraph with the same fade-up.
- Animate heading, supporting text, ornament, photo and caption as coordinated layers.
- Use short, staggered reveals, clipped image wipes, mask reveals, perspective shifts, line drawing, gentle scale/position movement and controlled parallax where appropriate.
- Vary animation by template and section type. Never use the same canned animation on every section.
- Avoid heavy motion on every pixel. Motion should occur when it helps reveal meaning.
- Keep body copy readable while moving. Avoid large rotation on text, excessive blur, rapid flashing, intense parallax and unbounded looping.
- Do not make scroll direction control essential business logic. Scrolling normally must always work.
- Use IntersectionObserver with cleanup for simple reveals. Avoid expensive global scroll handlers.
- Respect `prefers-reduced-motion`; offer a static/reduced-motion mode with all content available immediately.
- Ensure animation remains usable on narrow phones, low-powered devices and reduced bandwidth.
- Avoid layout shift: reserve image dimensions and final section space before animation begins.

### Build a section-animation toolkit

Create reusable, accessible primitives that templates can compose, for example:
- `RevealText` — split/stagger text without harming screen-reader reading order.
- `RevealImage` — image wipe, mask reveal, focus-to-sharp or gentle zoom.
- `ParallaxArtwork` — capped movement for background/decorative art only.
- `DrawLine` — timeline/route/ornament line draws into view.
- `StaggerGroup` — coordinated entrance for related items.
- `SectionIntro` — unique heading, eyebrow, divider and supporting copy.
- `GalleryReveal` — staggered collage entrance and accessible gallery/lightbox.
- `ScrollProgress` or minimal chapter marker where it suits the design.
- `MotionPreference`/motion utilities that respect reduced motion.

These should be reusable building blocks, not dozens of hard-coded duplicated effects. Keep text semantic and accessible; do not create a screen-reader-unfriendly pile of individually split letters.

### Required scroll interactions

Implement and visually tune at least these effects across the actual invitation templates:
1. Cover image reveals through an elegant clip/mask rather than simply appearing.
2. Event title and date enter in separate beats after the card opens.
3. The cover ornament/background shifts subtly at a different speed from the foreground, with capped parallax.
4. A transition/divider introduces the next chapter, such as a drawn rule, botanical growth, foil line or template-specific artwork.
5. Story/life timeline spine draws into view; milestones and their photos alternate or vary in position on wide screens and simplify cleanly on mobile.
6. Each story milestone's year, label, body and photograph appears as a coordinated unit; do not reveal just bullet text.
7. Ceremony/reception/location sections use art-directed alternating compositions, venue photography or architectural illustrations, with restrained map/location motion.
8. Programme/order-of-service items reveal in sequence, with a timeline line or time markers drawing into place.
9. Gallery reveals as a varied editorial mosaic, with individual photographs entering at slightly different times; open photos in a full-screen, keyboard-accessible lightbox.
10. Interactive gift/tribute/candle items respond to a direct click/tap and then animate into a confirmation or state change.
11. RSVP section transitions into a calm, clear interactive mode. Do not hide labels or form fields behind animation and do not make the guest wait for the section to become usable.
12. FAQ rows open/close with a short height/opacity transition and proper accessible disclosure semantics.
13. Final thank-you/footer section has a designed arrival/closing moment, with the couple/event name and optional share/calendar actions.

On desktop, use editorial asymmetry, image/text split layouts, occasional full-bleed imagery and purposeful whitespace. On mobile, reorder these into a natural vertical story; do not shrink a desktop collage until it becomes unreadable.

## 4. USE REAL CONTENT DEPTH: WEDDING INVITATION

Build the following sections as available, configurable modules. They must render from event data, not be hard-coded into the component. Hosts must be able to enable/disable and reorder sections. Not every wedding needs every section.

### 4.1 Cover / hero
- Couple's full-bleed or art-directed photograph, or a designed typographic cover when no photo is supplied.
- Couple names, invitation statement, personalised guest salutation when the guest has an invitation token, event date/time, venue and countdown if meaningful.
- Main action: RSVP. Secondary indication that the invitation continues below.
- Scroll cue must be subtle and must not resemble a default button.
- Validate event date/time and compute countdown from event data; never show hard-coded countdown numbers.

### 4.2 Our story
- Timeline with flexible milestones: first meeting, first date, important move, proposal, or custom milestones.
- Each item can contain year/date, title, story, image and optional place.
- Alternate photography/composition on desktop; use one aligned readable sequence on mobile.
- Draw the spine and reveal milestone details as the visitor scrolls.
- Allow zero story items; hide the section rather than showing empty placeholder blocks.

### 4.3 Ceremony
- Name, formatted address, local date/time, venue image or artwork, additional directions, dress code and colours if supplied.
- Real “Open in Maps” link from a valid address/coordinates.
- “Add to calendar” must generate a real downloadable/compatible calendar event or use a valid calendar URL.
- Do not fabricate venue data, directions or coordinates.

### 4.4 Reception
- Optional separate venue, time, address, directions, map link and calendar action.
- Support cases where reception and ceremony occur at the same venue, and hide or combine duplicate content appropriately.

### 4.5 Programme / schedule
- Configurable sequence of start time, title, description, place and optional icon/illustration.
- Use a designed timeline, staggered entries and a drawn connecting line.
- Validate and sensibly order times. Handle no end time and multi-venue events.

### 4.6 Gift registry / contributions
- Host-authored message and optional gift list.
- Display payment methods only when genuinely configured and confirmed.
- Support M-Pesa payment instructions, amount presets and custom amount selection as appropriate to the actual provider flow.
- Do not claim money was sent or received until confirmed by the provider/backend.
- Do not expose private payment details on events where the host disabled the section.
- Make amounts and labels data-driven and locale/currency aware.

### 4.7 Gallery
- Host-uploaded photographs with captions and optional grouping/labels.
- Editorial mosaic rather than nine identical boxes. Support portrait, landscape and square images.
- Progressive reveal per image, not an excessive global animation.
- Accessible lightbox with next/previous, escape/close, keyboard navigation, captions and proper focus handling.
- Lazy-load below-the-fold photos, use responsive sizes and placeholders only in explicitly labelled demo previews.

### 4.8 RSVP
- Personalised salutation where applicable; display the correct invited person/household.
- Attendance options: attending, partial attendance where household invites permit it, or unable to attend.
- Household/couple RSVP must handle each attendee correctly rather than storing only one guest-level yes/no.
- Meal choices per attendee when enabled; dietary restrictions; song request; message to the couple; and configurable extra questions.
- Show RSVP deadline from data; stop or clearly label submissions after the deadline according to host settings.
- Inline validation, loading, duplicate-submit protection, recoverable errors and a genuine server-confirmed success state.
- Keep labels visible, keyboard accessible and mobile friendly.

### 4.9 FAQ
- Configurable question/answer items, expandable using accessible accordion/disclosure semantics.
- Example categories: plus-one policy, children, dress code, parking, photography, dietary needs, directions and accommodation.
- Animate expansion modestly; do not require content to animate before it can be read.

### 4.10 Closing section
- Couple names and thank-you copy, visually echoing the envelope's paper/artwork.
- Share invitation and add-to-calendar actions that actually function.
- Small “Created with Kadi” brand treatment; no intrusive ads or generic large footer card.

## 5. USE REAL CONTENT DEPTH: BIRTHDAY INVITATION

Birthday invitations need their own art direction, not the wedding page recoloured.

### 5.1 Cover
- Birthday person's photo or art-directed typography.
- Name, age/milestone, invitation text, optional guest greeting, date/time, venue, theme/dress code, RSVP action and data-derived countdown.
- Template presets can be disco/ruby, pastel garden, playful illustrated, editorial photo collage or other intentional art directions.

### 5.2 About the birthday person
- Bio paragraph and optional “things to know” list such as 30 facts for a 30th birthday.
- Allow host-controlled list size and custom heading.
- Animate facts in a designed, readable sequence; do not automatically invent personal facts.

### 5.3 Party details
- Venue, address, date/time, theme, dress code, directions/map and calendar action.
- Optionally specify entrance details, parking, accessibility or what guests should bring.

### 5.4 Food and drinks
- Optional menu items, drinks policy, dietary information and cake details.
- Use a layout appropriate to the template (printed menu, typography, photo, illustration), not a generic card grid.

### 5.5 Activities
- Editable activities such as music, karaoke, games, photo booth, dance floor and dress competition.
- Reveal them with restrained event-specific movement.

### 5.6 Gift wishlist
- Optional text and item list with links/images if host supplies them.
- Optional contribution action only if configured and operational.

### 5.7 Gallery
- Throwback/portrait imagery, mosaic, lightbox and captions where provided.

### 5.8 RSVP
- Personalised guest greeting where available.
- Attendance, plus-one status limited by the actual guest invitation/entitlement, dietary restrictions and optional memory/message question.
- Prevent a guest from granting themselves an unapproved plus-one.

### 5.9 Closing
- A celebratory but template-specific close, share action and calendar action. Do not use wedding-specific copy.

## 6. USE REAL CONTENT DEPTH: MEMORIAL / FUNERAL INVITATION

A memorial needs dignified art direction and gentle motion. Never apply confetti, flashing particles, disco effects or celebratory language by default.

### 6.1 Memorial cover
- Deceased person's chosen name, lifespan, photograph with optional host-selected monochrome treatment, short epitaph/quote, personalised invite greeting, service date/time/location, details action and condolence/candle actions when enabled.
- Any photograph filter must be reversible/non-destructive; preserve original media.

### 6.2 Obituary / life story
- Long-form, readable biography with paragraphs, headings and optional photographs.
- Preserve the family's text exactly unless the host edits it. Do not invent personal biography.
- Use restrained type and a gentle reveal; never animate obituary text letter-by-letter in a way that impedes reading.

### 6.3 Life milestones
- Configurable date/year, title, description, image and location.
- Timeline line draws into view and milestone units reveal subtly.

### 6.4 Gallery
- Family-uploaded photos and captions with permission controls, accessible lightbox and a dignified collage.
- “Upload a photo” must require a valid upload workflow, file validation, security checks and any needed host approval. If the backend cannot support it yet, hide or clearly mark the feature as unavailable; do not fake a successful upload.

### 6.5 Service details
- Multiple service/burial events with distinct locations and times.
- Map and calendar actions where location data is valid.
- Dress code and practical information as provided by the family.

### 6.6 Order of service
- Configurable time, item, person/participant and optional description.
- Designed programme timeline with calm sequential reveals.

### 6.7 Tribute wall
- Visitor tributes/condolences with author display preference (public name or anonymous) and host moderation.
- Submissions must be stored server-side, validated, rate limited and pending moderation when that is the configured policy.
- Do not show unreviewed messages publicly if the family chose moderation.
- Animate new/approved items gently. Avoid treating grief content as social engagement bait.

### 6.8 Virtual candles
- A candle interaction with a real server-side count and prevention/rate limits against spam.
- Use a gentle flame animation and an accessible textual confirmation. The count must come from persisted data, not a hard-coded number.
- Provide a quiet version for reduced motion.

### 6.9 Family support / contributions
- Clearly explain the purpose and display payment instructions or a live integrated flow only when configured.
- Never fabricate payment receipts, collected totals or successful disbursements.

### 6.10 Livestream
- Optional host-supplied valid video/service URL, stream start time and instructions.
- Clearly differentiate an upcoming, live, ended or unavailable stream based on configured schedule/provider support. Do not claim that the service is live unless verified.

### 6.11 Leave a condolence
- Name or anonymous setting, message, consent/display choice, validation, loading state, moderation status and a proper confirmation screen.
- Preserve privacy; do not display private contact details.

### 6.12 Memorial close
- Gentle final message, service/calendar/share links where appropriate and restrained Kadi attribution.

## 7. TEMPLATE AND CONTENT MODEL: CONTENT MUST BE DATA-DRIVEN

Inspect and extend the current template schema without breaking existing records. Do not hardcode every section's content in one large page component.

The model should support:
- Event type and template/style preset.
- Template-specific art direction tokens and artwork assets.
- Envelope style: body art, flap, liner/pattern, seal, depth/shadow treatment, opening sequence and reduced-motion alternative.
- Animation preset per template and optional per-section overrides.
- Ordered invitation sections, with stable section IDs, enabled/disabled state, type, content payload and design settings.
- Host-managed content, images, captions, gallery order, timelines, schedules, FAQ items and gift-list entries.
- Guest-specific/personalised data when the route uses a guest token.
- Published/draft state and safe preview mode.
- Backward-compatible default settings for older events lacking newly added configuration fields.

Use typed discriminated unions or equivalent validation for section types. Validate persisted JSON at the server boundary; do not blindly trust client-supplied template configuration. Keep the template renderer modular, for example using distinct components for hero, timeline, venue, schedule, gift list, gallery, RSVP, FAQ, tribute wall, candles and livestream.

If database fields/tables must change, add migration files and update generated types/validators. Do not wipe existing data or silently change meanings of existing fields.

## 8. HOST CREATION AND DESIGN EDITOR

A beautiful guest invitation requires an editor that can actually create and customise it.

Implement or extend the host-facing workflow with:
- Select event type and an appropriate template/art direction.
- Enter event details with clear labels and useful validation; do not make the entire host interface look like one endless form.
- Upload/change cover and gallery photos using the existing media flow; show crop/position and upload state if supported.
- Configure envelope/cover details where the preset allows it.
- Add, edit, hide/show and reorder content sections.
- Edit story milestones, programme items, FAQ questions, menu/activity/wishlist entries, services, obituary, tributes settings and candle/livestream settings based on event type.
- Preview the entire guest view, including the closed envelope, opened cover, scroll transitions, mobile view, guest-personalised view and reduced-motion state.
- Save draft, save changes, publish and share a real event link through the existing routes.
- Warn before navigating away with unsaved edits.
- Do not show settings that do not apply to the chosen event type.

Use section-specific editing controls and helpful inline previews, not one huge generic JSON textarea. Keep the editor's layout efficient and professional; the guest invitation itself must remain the visual star.

## 9. VISUAL DESIGN QUALITY — SPECIFIC DIRECTION

Use the supplied videos as primary direction. The four reference styles should each feel designed by someone who understands art direction:
- **Ruby disco:** confident red/burgundy field, foil/shine accents, bolder type and framed composition with controlled light movement.
- **Pastel garden:** delicate botanical art, light paper stock, soft pastel palette, floral linework and a friendly but considered hierarchy.
- **Gift-led birthday:** strong visual sequence built around gift objects, interactive floral/message/cake elements and photo collage. Each interaction should do something real.
- **Sage botanical wedding:** quiet luxury, sage/ivory paper, fine botanical illustration, realistic envelope, restrained type hierarchy and cinematic photo reveals.
- **Memorial:** introduce a separate appropriate family of calm, legible designs; don't reuse celebratory artwork.

Do not make every template the same three-column grid or a pile of rounded cards. Create variety through hierarchy, scale, full-bleed imagery, border rules, composition, layering, typography, paper textures, illustration and section transitions.

Typography must have a clear type scale and good contrast. Use display serif/script only where appropriate and keep important names/readability accessible. Avoid too many unrelated fonts. All art assets must have a consistent style and must not look like random clip-art pasted on top.

## 10. AUDIO, ACCESSIBILITY, RESPONSIVE BEHAVIOUR AND PERFORMANCE

- Music is optional and starts only after a deliberate user gesture; provide a persistent, accessible play/pause or mute control when enabled.
- Handle a browser refusing audio playback without breaking the invitation.
- Respect `prefers-reduced-motion` and provide a complete functional reduced-motion experience.
- Use semantic headings, landmarks, descriptive image alt text and labelled form controls.
- Keep keyboard focus visible. Support Escape and focus control for lightboxes and dialogs.
- Maintain usable touch targets and avoid controls hidden under decorative artwork.
- Make the envelope openable by keyboard and screen reader. Give it a clear accessible name and state.
- Use responsive images, explicit dimensions/aspect ratio, lazy loading for below-the-fold content and optimised image formats where the project supports them.
- Avoid large layout shifts, excessive GPU-heavy effects, huge uncompressed background video and continuous animation when off screen.
- Use SVG/CSS for lightweight decorative work and avoid downloading entire animation packages for small movements.
- Test narrow mobile, mobile landscape, tablet and desktop layouts.
- Ensure the experience remains beautiful if audio, motion, one photograph or optional section is unavailable.

## 11. FUNCTIONALITY AND SECURITY MUST REMAIN REAL

- RSVP submits through the existing server/backend. Add validation and server-side checks; protect against double submissions.
- Only show guest-personalisation when a valid guest token/permission exists. Validate access on the server, support expiry/revocation as appropriate and do not leak a guest list through public data.
- Map/calendar/share links must perform real actions using validated event data.
- Media uploads must validate file size/type and use the existing secure storage path.
- Tribute and condolence submissions need server validation, moderation status, spam protection and safe output escaping.
- Virtual candle totals and contributions must be persisted/verified; never use fake live numbers.
- Contribution UI is conditional on a configured payment model. Never pretend a payment has succeeded just because a user clicked a button.
- Do not invent API keys, webhook secrets, provider approval, business credentials, successful payment status or WhatsApp delivery status. If a provider is not configured, provide an honest configuration state and keep the live feature disabled.
- Preserve permission boundaries between hosts, guests and administrators.

## 12. CONTENT DEPTH AND EMPTY STATES

A template should not appear shallow just because the event host has not supplied every optional detail.
- Provide meaningful section presets and editing hints, but do not fabricate personal stories, family members, menu items or memories.
- In preview/demo mode, use clearly labelled sample content so the design can be evaluated end to end.
- In a real published invitation, hide disabled or genuinely empty optional sections rather than leaving blank space, placeholder cards or dummy images.
- Allow the host to choose an appropriate set of sections and give the invitation a meaningful narrative arc. Provide more content modules than the initial few sections, while preserving editorial pacing.
- Use section titles and short supporting copy appropriate to the event style; the same generic title treatment must not be repeated mechanically.
- Do not pad invitations with filler paragraphs just to make pages longer. Depth comes from relevant, host-authored details, visual storytelling, venue/practical information and personalised interactions.

## 13. MOTION AND COMPONENT ACCEPTANCE TESTS

Before calling this complete, verify:
1. Envelope layers stack correctly on mobile and desktop; flap hinges at its edge.
2. The envelope opens, liner appears, card emerges from inside, and all final elements settle at the right positions.
3. Replay, skip, keyboard activation and reduced-motion modes work.
4. The scroll page has multiple distinct, intentional reveal patterns rather than one fade-up reused everywhere.
5. Timeline line draws and milestone content appears in a coordinated way.
6. Gallery mosaic reveals images and lightbox supports keyboard/close/navigation.
7. Program items reveal progressively but remain instantly readable if motion is reduced.
8. The wedding has all enabled sections: hero, story, ceremony, reception, programme, gift registry/contributions, gallery, RSVP, FAQ and closing.
9. Birthday has cover, about/facts, party details, food/drinks, activities, gift wishlist, gallery, RSVP and closing where enabled.
10. Memorial has cover, obituary, milestones, gallery, service details, order of service, moderated tribute wall, candles, family support, livestream, condolence form and closing where enabled.
11. Empty optional modules are omitted from published pages without awkward gaps; demo fixtures show enough content to test all layouts.
12. Host can enable/disable and reorder sections, edit content and preview the result if editor capability is within the current scope. If part of the editor is absent, implement it rather than merely showing decorative controls.
13. RSVP errors/success state represent server results truthfully, and duplicate submissions are prevented.
14. No console errors, unhandled promise rejections, broken images or hydration mismatch caused by animation state.
15. TypeScript/type checks, lint, tests and production build are run where the environment permits. Record any failure honestly with the exact command and cause; do not claim passing checks that were not run.

## 14. IMPLEMENTATION ORDER

Work in these concrete stages and leave the app runnable after each:

**Stage A — inspect and map**
Trace the existing guest route, template configuration, media, RSVP and animation components. Record the relevant files, scripts and any schema constraints.

**Stage B — envelope realism**
Implement layered art direction and the complete physical envelope/card animation for at least the sage botanical and ruby disco presets. Add a compatible reduced-motion state and replay/skip controls.

**Stage C — section scroll system**
Build the reusable reveal toolkit and apply varied animations to the actual hero, story/timeline, venues, programme, gallery, RSVP, FAQ and closing sections. Validate scrolling on small screens.

**Stage D — event-specific content sections**
Complete configurable wedding, birthday and memorial section sets. Ensure each template family has its own layout, colours, illustration and motion direction.

**Stage E — host editor/data binding**
Bind each section to actual event/template/guest data, support add/edit/reorder/hide/show and provide live preview. Migrate schemas safely if required.

**Stage F — quality and regression**
Run type checks, lint, tests and build. Fix regressions and visually inspect the rendered app at representative widths. Test every new interaction, empty state, loading/error state and reduced-motion path.

## 15. FINAL RESPONSE REQUIRED FROM YOU, THE CODING AGENT

When done, report:
- The real files/components changed.
- Which envelope presets and scroll effects are implemented.
- Which wedding/birthday/memorial sections are data-driven and working.
- Whether the editor can add/reorder/hide sections and preview them.
- Any database migrations and environment variables needed.
- Commands actually run and their outcomes.
- Remaining integration requirements or unimplemented items.

Do not say “done” if only one hero animation was changed. Do not replace the supplied visual target with a generic dashboard. The result should feel like opening a beautiful physical invitation that unfolds into a rich, carefully art-directed interactive story.
