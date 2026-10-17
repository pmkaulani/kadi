# KADI — MASTER PRODUCT REDESIGN + IMPLEMENTATION BRIEF (V2 — PROFESSIONAL SELECTION UX)

> **Paste this entire brief into Antigravity with the existing Kadi repository/workspace open.**
>
> You are working on an existing product, not starting a new repository. Audit first, preserve working functionality, then implement the target experience end-to-end. Do not blindly replace the app or delete working code.

---

## 0. YOUR ROLE AND THE OUTCOME

Act as a senior product designer, UX architect, frontend engineer, creative-tool engineer, accessibility specialist, and careful technical lead. You have been asked to evolve the existing Kadi app into a polished, creative, Canva-like **digital invitation studio** with interactive guest-facing invitations.

The product concept is:

**A person opens Kadi, sees a beautiful moving gallery of invitations, clicks a design, and immediately starts making it their own—without an account, setup wizard, or SaaS dashboard getting in the way.** They edit by interacting with the actual invitation canvas: text, sticker-like illustrations, photos, colours, layers, animations and optional event sections. They can preview the true guest experience at every stage, publish a shareable link, and share it through their preferred channels. Account creation is required only when they want persistent event management such as managing a guest list, viewing RSVP responses, sending reminders or adding co-hosts. Their work must not disappear when they sign up.

The intended blend is:

- **Canva-like** direct manipulation, sticker/element library, text editing, layering, reusable assets and approachable creative control.
- **Paperless Post / Greenvelope-like** invitation craft, stationery quality, envelopes and an intentional opening/reveal.
- **Partiful-like** low-friction links, mobile guest experience, RSVP and event communication.
- **Kadi's own identity:** original, beautiful, movement-rich invitation art, with Kenyan-first details and workflows where useful.

Do not make a generic SaaS product with an invitation editor added to it. Do not make a generic form wizard. Do not make the whole app look like a grid of rounded cards. Do not flatten the invitation into one background image. Do not use stock photographs of smiling people as the default template aesthetic. The core art direction is **illustrated invitation designs assembled from individual sticker-like objects**.

### What success looks like

A first-time visitor can choose a template, edit text, replace and move stickers, upload a photo, place text over artwork, adjust layers, add a supported animation or optional event section, preview the actual guest page, publish and share—all without registering. The editor remains approachable even though the underlying capabilities are powerful. A creator can later claim the same draft/invitation with an account and manage the event without losing content or changing the public link unnecessarily.

---

## 1. NON-NEGOTIABLE SAFETY RULES FOR THIS EXISTING CODEBASE

This brief authorises significant design and UX changes, but **not a careless rewrite**.

1. **Inspect before editing.** Read the project structure, package files, routes, app state, authentication, database schema/migrations, backend/server actions, current template system, save/publish flow, RSVP flow, tests, environment/configuration expectations and the existing UI. Run the app if possible.
2. **Build a capability inventory.** Identify each screen and existing capability as: working and preserve; partially working and improve; duplicated or broken; absent and required. Look for features created by earlier prompts and preserve working outcomes.
3. **Establish a safe baseline.** Check `git status` and current diffs before changes. Do not discard user changes. If the repository uses Git, create a safe feature branch or another reversible checkpoint only if that is safe in this environment. Do not run destructive commands such as `git reset --hard`, mass file deletion, destructive database changes, or blanket replacement of config files.
4. **Preserve working behaviour.** Keep current functional auth, server APIs, database connections, RSVP storage, payment flows, uploads, deployment configuration, analytics, route logic and existing data. Refactor or restyle the UI around them unless the audit proves a feature is defective. If a schema change is required, write a backward-compatible migration and preserve existing records.
5. **Do not replace functioning pages with static mockups.** Every visible control must perform its advertised action. Never leave buttons that merely look interactive. Do not fabricate successful saves, publishing, payment or RSVP states.
6. **Keep dependencies under control.** Inspect existing libraries first. Do not add a new canvas, animation, state or UI library until checking whether the existing stack already supports the capability. Prefer the smallest compatible dependency set. Explain any necessary new dependency in the final summary.
7. **Do not invent backend capabilities.** If a service or API is absent, build the proper integration boundary, UI and a clearly labelled safe fallback; do not pretend a real map, payment, background removal, AI writing service or playlist integration is working if it is not.
8. **Do not break existing URLs or saved invitations.** Preserve public slugs, established links and data structures where possible. Where migration is unavoidable, create a migration path, preserve old records and verify that previously saved invitations still load.
9. **Do not stop after the audit.** After documenting the baseline in a short internal project note, continue to implement the safe, agreed changes. Do not ask me to re-prompt for each obvious step. Make well-reasoned choices and document any unavoidable limitation.
10. **Never expose secrets.** Do not print, commit or copy real `.env` secrets to documentation, client code or logs. Never make private anonymous draft or RSVP data publicly readable by guessing an ID.

If two requirements conflict, preserve data/security and working backend functionality first; then honour the creative direction and simplify the surface UI. The result should look substantially better without destabilising the product.

---

## 2. PRODUCT EXPERIENCE AND NAVIGATION MODEL

There are three distinct experiences. Keep their boundaries clear.

### A. Public landing / invitation discovery

Purpose: inspire visitors and get them into creation immediately. This is not a logged-in SaaS dashboard.

- The first viewport must communicate what Kadi is and show actual invitations immediately.
- The moving invitation gallery is the main visual feature, not a secondary thumbnail row under a large marketing banner.
- A visitor must be able to click a template and enter the editor with that design loaded, without a registration wall or long setup form.
- Include a subtle “Start blank” option.
- Existing users need a quiet “Find my drafts / Sign in” entry, not a giant dashboard CTA that competes with creation.
- Search and small filters can help with discovery, but should not dominate the visual experience.

### B. Kadi Studio / editor

Purpose: create the invitation by direct manipulation. The invitation canvas stays central; controls appear contextually.

- Do not show a long event form before the canvas.
- Do not make users understand technical terms such as “layer compositing” or “content block” just to edit.
- Controls should be compact, contextual and easy to discover.
- There must always be an accessible way to preview the real published guest experience.

### C. Published guest invitation

Purpose: give the invitee a beautiful, quick, mobile-first experience.

- No guest account required merely to open the link or RSVP, unless current product/legal constraints require a specific verification flow; if verification is needed, keep it simple and explain why.
- Never expose editor toolbars or selection handles to guests.
- Render the same layout, assets, text styles, layer order and supported animations shown in preview.
- Event details and RSVP actions must remain accessible even if the guest skips the opening animation or has reduced motion enabled.

### D. Event-management workspace

Purpose: serve hosts after they choose to manage an event. This area can be more operational, but it must not be the public landing experience or an obstacle to creation.

- Requires an account for durable host features such as guest-list management, RSVP dashboard, reminders, co-hosts, exports and advanced analytics.
- The existing invitation/draft should be claimed and attached to the account, not duplicated.

---

## 3. VISUAL DIRECTION — USE THIS AS THE DESIGN SYSTEM BRIEF

### 3.1 Reference image and gallery composition

The user supplied a reference image showing a collage of invitation designs laid at different angles on a deep teal surface. Several tall invitation designs are partly clipped by the viewport edges. The designs are visually distinct: botanical wedding invitations, illustrated birthday invitations, typography-driven designs and soft colour palettes. It feels like a curated wall of printed invitations rather than a software catalogue.

Use this as a **composition and energy reference**, not a template to copy pixel-for-pixel. If the reference file exists in the workspace, inspect it. If not, follow the description here; do not block implementation or invent a file path.

The landing gallery should have:

- Multiple vertical columns/streams of tall invitation compositions.
- Columns moving slowly in alternating directions: one upward, the next downward, and a third at a different speed. Use seamless looping so there are no obvious jumps.
- Invitations of varied but controlled heights, slight angle differences, and carefully managed gaps. Some may be partially cropped at top/bottom/side edges to create a gallery-wall feeling.
- A deep teal / blue-green environment as a key reference, with invitation art supplying the colour. Potential supporting colours: warm ivory, blush, coral, muted sage, butter yellow, burgundy and gold. Confirm against existing Kadi branding and reuse any strong existing brand elements rather than imposing unrelated branding.
- Gentle depth using believable shadows and subtle perspective; never overdo blur, glassmorphism or motion.
- No huge conventional hero block that pushes all invitations below the fold. Keep any headline short and visible alongside/over the visual gallery without obscuring the designs.
- Hover: pause that invitation/column locally where feasible, gently elevate/straighten the selected design, reveal a small label such as the style/occasion, and make the click affordance clear. No aggressive bounce, glow or constant tilting.
- Click/tap: open that exact design in the editor and show a brief, elegant transition. It must not open a separate marketing details page unless that page provides a clear “Edit this invitation” action.
- Motion should remain calm and polished. Honor reduced-motion preferences; allow a still gallery.

Desktop should show a rich gallery with several readable columns. Tablet should reduce columns and preserve card scale. Mobile should not shrink all designs into tiny slivers; use a curated 1–2 column arrangement or vertically staggered/scrolling strips that remain tappable and readable. Avoid interfering with normal page scrolling.

### 3.2 Visual quality bar

Professional craft standard: do not treat “looks modern” or “works” as sufficient. Reuse a coherent design system, align baselines and spacing, keep type scale and button sizes consistent, make interactive states intentional, avoid generic placeholder art, and remove visual clutter without hiding necessary controls. Every primary screen must look like it belongs to the same carefully art-directed product. Do a final UI polish pass at realistic desktop and mobile sizes. Check clipping, overflow, alignment, type wrapping, modal/popover placement, focus states, loading/error/empty/saved states, and the difference between hover, selected, active, disabled and focus. Prefer a few excellent, finished interactions over many half-working controls. Do not claim a feature is complete unless it is connected to working behaviour and has been tested.

- Premium editorial art direction, not generic dashboard UI.
- Strong visual hierarchy, intentional typography, real whitespace, coherent colour, and varied compositions.
- Avoid “everything inside a rounded rectangle.” Use actual invitation artwork, canvas space, typography and decorative composition as the structure.
- Avoid oversized gradient blobs, random shadows, excessive borders, generic gradient buttons, and identical layout repeated across every page.
- Avoid emoji as interface icons. Use the current icon system or a consistent line-icon set such as Lucide if compatible with the project. Product UI text should not use emojis.
- Keep all text readable, including on decorative backgrounds. Do not let animations obscure event details.
- Maintain consistent design tokens across landing, editor panels, dialogs, published pages and account areas while allowing invitations themselves to have diverse art direction.

### 3.3 Typography

Use a purposeful type system: an expressive display font suitable for invitation headings, a highly readable body face and optional template-specific font pairings. Reuse available local/project fonts before adding external dependencies. If web fonts are used, load them efficiently and provide fallbacks. Typography selected in a template must remain consistent between editor preview and published rendering.

### 3.4 Button and control rules

- Primary action buttons are visually distinct but not huge; one strong primary action per screen/state.
- Secondary actions should be quieter, usually text/icon buttons.
- Icon-only buttons must have tooltips or accessible labels.
- Use clear hover, focus, active, disabled, saving and loading states.
- Destructive actions such as delete/remove should be visually restrained until invoked and should be undoable where practical.
- Don't add a toolbar button for an action that belongs in a selected element's contextual popup.
- Keep spacing and touch targets comfortable, particularly on mobile.

---

## 4. TEMPLATE AND IMAGE-ART REQUIREMENTS

### 4.1 Templates are editable compositions, not flattened poster images

Every template must be a real structured design made from separate objects. At a minimum, the object system must support text, sticker/image assets, user photos, simple shapes/lines, backgrounds and optional sections.

Do not use a flattened JPG/PNG as the entire template with fake text placed on top. Text and decorative elements in the template must be independently selectable and editable. Maintain layer order and object identity when replacing an element.

### 4.2 Stickers are the central visual language

Decorative images should behave like Canva elements/stickers:

- Each flower, leaf, butterfly, bow, ribbon, balloon, cake, candle, graduation cap, star, paper scrap or other illustration is a separate object.
- Sticker assets must have genuine transparent/alpha backgrounds or vector paths, so only the silhouette is visible. The file's bounding box may be rectangular internally, but there must be no visible white/square image background unless it is intentionally part of the sticker artwork.
- Support different art treatments: delicate watercolor, botanical illustration, flat illustrated, hand-drawn, cut-paper, editorial graphic and playful illustrated. Keep each template set internally coherent.
- Sometimes a sticker can have a deliberate die-cut outline; make it a design choice, not a default forced outline.
- Allow stickers to overlap each other, overlap text, appear in front/behind other objects, extend partly beyond the invitation canvas edge and be clipped by the canvas naturally.
- Users can replace, resize, rotate, move, duplicate, delete, change opacity, change supported colours, layer, group, favourite and animate an individual sticker.
- When an asset is replaced, preserve position, approximate size, rotation and layer if compatible.
- Sticker insertion should use a sensible default scale and a suitable starting position, ideally near the selected point or centre of the canvas. New elements must not unexpectedly cover all the main text.

### 4.3 Separate sticker assets from user photography

A photo is not automatically a sticker. For user photos:

- Allow gallery/file upload on desktop and mobile.
- Provide crop/reposition/fit/fill controls and useful image layouts.
- Keep the original photo available when changing the crop.
- If background removal is supported by an existing service, expose it as an optional “Remove background” action and create a separate cut-out result; do not silently modify the original.
- If it is not supported, do not fabricate a functioning background-removal action. Provide a sound integration boundary or omit the unsupported action and note the limitation.
- Support optional frames/masks including oval, circle, rounded rectangle and available decorative masks, but don't force photographs into a square frame.

### 4.4 No stock faces as the default template design

The default template gallery must focus on illustrated objects, florals, typography, textures and abstract or occasion-specific motifs—not stock portraits or faces. Users are free to upload their own photographs and place them anywhere in their invitation. Do not ban user photography; simply do not make random people's faces the visual foundation of template art.

### 4.5 Asset sourcing and quality

Audit the existing asset library first. Retain high-quality assets with valid licensing, proper resolution and consistent style. Remove or replace visible square-background placeholder art, low-resolution images, duplicate assets, mismatched clipart and generic placeholder patterns.

Where image generation is available in the working environment, use it to create an original, visually coherent starter set with transparent-background sticker assets. Where it is not available, use licensed assets only after verifying source/licence, or create intentional original vector illustrations. Do not scrape Pinterest/Google images, hotlink random images, copy another company's designs, or use asset URLs that can silently disappear.

Use SVG for suitable vector artwork and transparent PNG/WebP for raster artwork. Keep source/editing assets where appropriate, add descriptive names/tags/alt metadata, and optimise file sizes. Use several coherent visual families rather than one style repeated everywhere.

**Starter asset coverage:** create or organise a useful minimum set covering botanicals (individual flowers, leaves, sprigs and corners), birthday (cake, candles, balloons, ribbons, confetti), weddings (floral elements, rings or elegant decorative motifs without people), graduation, baby shower, housewarming, corporate, memorial/tribute and abstract decoration. The library can grow in phases, but do not ship only a tiny handful of identical placeholders and claim the library is complete.

### 4.6 Asset library panel

The “Elements”/“Stickers” panel should include:

- Search field at the top.
- Clear categories and visual thumbnails shown on a neutral transparency checkerboard where useful.
- Tabs/filters for Stickers, Photos/Uploads, Shapes and Favourites/Recent items where useful.
- Click to insert; drag-to-canvas if supported; a non-drag alternative must exist.
- Insertion feedback, loading/empty/error states, and pagination or virtualisation when the collection is large.
- A visible way to upload the user's own assets.
- No unnecessary repeated large cards or long descriptions on every thumbnail.

---

## 5. EDITOR LAYOUT AND INTERACTION SPECIFICATION

### 5.1 Main desktop editor layout

Build on the existing editor where possible. Target the following hierarchy:

**Top bar**
- Left: Back to designs/gallery (confirm if there are unsaved changes only when needed; autosave first), Kadi wordmark or existing logo.
- Centre/left: editable invitation/project name, with a small save status such as “Saving…”, “Saved” or “Offline changes”.
- Right: Undo, Redo, Preview, and one clear Publish/Share action. Keep the account control quiet/secondary. Undo/redo should be real and preserve sensible history.
- Buttons should have consistent height, restrained styling and accessible labels. Publish/Share is the strongest primary action only when the project is publish-ready; otherwise show why it is disabled.

**Left tool rail/panel**
Keep a compact rail for the main creative actions. Suggested order: Design/Templates, Text, Stickers/Elements, Uploads, Sections, Envelope. Use brief labels plus icons; don't make users guess an icon's meaning. Selecting a rail item opens a secondary panel adjacent to the canvas rather than navigating away or hiding the invitation. Avoid many extra tool categories until needed.

**Central canvas/workspace**
- The invitation is the visual focus.
- For a cover design, use a portrait artboard appropriate to invitation design (keep aspect ratio consistent with existing data/templates and choose a suitable standard if not established). Do not force all assets into a square.
- Show a neutral work surface around the artboard with enough contrast to distinguish transparent edges.
- Allow zoom in/out, fit-to-canvas, and pan. Provide a clear “Fit” action. Do not load an indoor-map-like zoom behaviour that cuts off the whole invitation with no easy fit-to-canvas control.
- Canvas controls must not cover important artwork. When a panel opens, resize/reflow the workspace intelligently or allow panning; don't place popups directly over the most important content if avoidable.
- Selection must be unmistakable and professionally restrained: for transparent stickers, trace the visible silhouette where feasible and use a no-fill transform frame only for resize/rotation handles; never create a visible square image tile. Follow the full selection-state specification in §5.3.1. All editor handles/controls disappear in Preview.
- Support artwork beyond edges and clip at artboard boundary, while still allowing the creator to reselect off-canvas elements from layers/outline.

**Optional right contextual panel**
Use only when there is enough room and the selected object needs more settings. Do not keep a permanently filled settings panel visible when nothing is selected. Context controls can appear as a floating toolbar or compact popover close to the selection.

**Page/section navigation**
If the invitation contains a cover plus scrollable sections, show a lightweight outline or small section strip. Allow adding/reordering sections without forcing the creator into a multi-step wizard. Clearly distinguish canvas objects (stickers/text/images) from guest-page sections (RSVP, map, gallery, schedule). Do not flatten these concepts into a confusing one-level panel.

### 5.2 Contextual popup behaviour

When the user selects an element, open a compact floating popup/toolbar near the selected object, like a familiar creative app. Position it so it stays inside the viewport and avoids covering the selected object or important nearby content. If there is no room, reposition intelligently or move to a side/bottom panel.

- Text selected: font family, font size, weight, italic, underline, text colour, alignment, spacing, line height, opacity, animation, layer/position and more-options.
- Sticker/image selected: replace, crop (for photos), size, rotation, flip if supported, opacity, animation, duplicate, layer/position, group, lock and delete.
- Background selected: colour/image/texture, replace, fit/position, opacity where valid.
- Section selected: edit content, reorder, visibility, style and remove.
- Multiple selected objects: group/ungroup, align/distribute where feasible, duplicate, layer order and delete.
- Clicking outside dismisses the popup without discarding changes. A selected object remains selected as appropriate.
- On mobile, do not make the floating popup tiny or overlap the canvas permanently. Use an accessible bottom sheet with the most relevant controls and a clear Done/close action.
- For destructive actions, allow undo or confirm only when the action is consequential. Avoid repetitive confirmation dialogs for ordinary edits.

### 5.3 Direct manipulation and canvas behaviour

- Click/tap an object to select it. Click/tap empty canvas to deselect. Double-click text or choose Edit text to type inline.
- Drag to move; corner handles resize; a dedicated control rotates. Preserve aspect ratio by default for stickers/photos, with an explicit override when stretching is appropriate.
- Shift/click or a touch-friendly selection mode supports multiple selection; use a clear selection highlight.
- Provide arrange commands: Bring forward, Send backward, Bring to front, Send to back.
- Provide optional layer/outline panel that lists object names/types and lets users select hidden/overlapped objects, reorder them and lock/unlock them.
- Lock an object so it can't be moved accidentally. Hide/show can be supported through layers panel.
- Support group and ungroup when multiple items are selected.
- Add sensible alignment guides/snapping and an optional way to turn them off. Never snap so aggressively that free placement becomes frustrating.
- Undo/redo should cover movement, resize, content, layer and style changes; not just text entry. Maintain history without storing huge image blobs in every action.
- Keyboard shortcuts when appropriate: Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y redo, Delete/Backspace remove selected element when not editing text, Ctrl/Cmd+D duplicate, Ctrl/Cmd+G group where supported, Escape deselect/close a popover. Avoid conflicts with browser shortcuts and input fields.
- Prevent accidental page navigation/selection while manipulating objects, but do not break normal browser accessibility or scrolling.
- For touch, distinguish a canvas pan from an object drag, and provide clear, reliable zoom gestures plus buttons.
- Provide non-drag alternatives for moving/arranging elements (numeric position controls, nudging arrows or a move/align menu). This is both an accessibility requirement and a usability fallback.

### 5.3.1 Professional selection states — make selection unmistakable

This is a core interaction, not a minor detail. Users must immediately understand which object is selected, what they can manipulate, and what will happen if they drag or press a control. Implement and visually test these states for stickers, text, photos, shapes, backgrounds, groups and sections. Do not leave the look of selection to the canvas library defaults.

#### A. Idle, hover, focus, selected and editing are different states

- **Idle:** no selection decoration. The sticker is shown exactly as designed, with no visible rectangular image tile or permanent editor border.
- **Hover (desktop only):** a restrained, thin Kadi-accent outline or subtle edge indicator can preview the target; show the appropriate cursor. Hover must be weaker than selection, must never make the artwork glow aggressively, and must not be the only way controls are revealed.
- **Selected:** show a high-contrast, clearly visible selection treatment immediately on pointer/tap selection. Use the existing Kadi design tokens for the accent colour; if none exist, define one consistent accessible editor-selection colour and reuse it everywhere. Use approximately a 1.5–2 px screen-space stroke with enough contrast against both light and dark artwork, supplemented by shape/handles so colour alone never communicates selection. Do not change the selected artwork's opacity, tint, scale or appearance to indicate selection.
- **Keyboard focus:** show a clear focus ring that is distinguishable from the mouse-selected state and works against varied artboard backgrounds. All canvas objects must have accessible names/types where the canvas technology supports them.
- **Text edit mode:** show a caret/text selection and a clean text-editing boundary. Do not leave eight resize handles obscuring text while the user is typing; return to normal object selection when editing ends.
- **Dragging/resizing/rotating:** the selected indicator remains attached to the object and moves in real time. Show alignment/snap guides only when useful. Keep the action stable—no flickering outline, selection jumping between objects, or toolbar chasing the pointer.
- **Locked object:** show a subtle lock indicator and prevent movement/transformation. Make it possible to unlock from its contextual menu or Layers panel.
- **Preview/public guest view:** all editing outlines, handles, hover states, grid/snap guides, selection toolbars and editor-only labels must disappear completely.

#### B. Cut-out stickers must still look like stickers when selected

This requirement is particularly important for the transparent silhouette assets:

- The asset must have genuine transparent pixels or a vector silhouette. The selection treatment is an editor overlay only; it must never be baked into the asset or published invitation.
- Where technically feasible, draw a thin selection contour around the **visible non-transparent silhouette** so the user sees the shape they selected—not a visible square surrounding a flower or butterfly.
- Resize and rotation controls may use an invisible geometric transform frame around the object's bounds because the frame makes manipulation predictable. That frame must have no fill and must not turn the sticker into a visible rectangle. The silhouette contour and the transform frame serve different purposes.
- Show clear corner resize handles and a separate rotation handle with a short connector from the top edge. Keep handles outside or just at the edge of the artwork where possible, so they do not hide important petals, faces in user-uploaded photos, lettering or other detail.
- Use small circular or softly rounded handles with a light fill, clear Kadi-accent border and subtle depth/contrast. On desktop, keep handles visually refined and large enough to hit accurately; on touch devices, provide a generous hit target (aim for at least 28–32 CSS px effective touch area, without making the visible handle itself visually bulky).
- Preserve aspect ratio for stickers by default. Corner handles resize; edge handles should not distort an illustration unless the object explicitly supports free stretching. Rotation is controlled by the dedicated rotation handle, not by an accidental drag near a corner.
- For masked photos, the visible crop/mask defines the displayed image; selection should make the crop/mask and transform bounds understandable without implying a white or square background.
- If tracing an alpha silhouette is too expensive or unsupported in the existing renderer, use a no-fill transform frame plus clear handles as the fallback. Do not create a permanent opaque rectangle or a square highlight fill behind the sticker.

#### C. Exact single-selection and multi-selection behaviour

- A single click/tap selects the topmost unlocked object under the pointer. The change to selected state must be immediate and visually obvious.
- Selecting an object opens its contextual toolbar/popover in a predictable location, usually just above the selected object, then below or to a side when space is limited. Reposition it so it stays inside the editor viewport and does not cover the selected object's most important detail, the main heading, or essential controls. Do not let the toolbar jump on every pointer move.
- Clicking blank canvas deselects unless the user is actively editing text or interacting with an open menu. Escape closes the topmost popover first, then exits text editing/deselects in a predictable order.
- When objects overlap, clicking the topmost object selects it. Provide an understandable way to reach covered objects: a Layers panel, a “Select underneath”/cycle-selection action, and/or a modifier-click where supported. Do not require precise clicking on a tiny exposed sliver of a hidden object.
- Multiple selection shows one outer transform frame around the selected group, with the individual objects still identifiable where practical. The UI must clearly say how many items are selected and offer Group, Ungroup, Align, Distribute, Duplicate, Layer order and Delete only when those actions are valid.
- The selected object is not silently changed by choosing it. It must not jump position, change z-order, start an animation unexpectedly or resize on selection.
- If the selected object has an animation, keep editing stable by pausing it while manipulating or show a clear edit/playback mode. An explicit preview/play action can show the actual animation; stopping preview returns to a stable editable selection.

#### D. Contextual controls and responsive behaviour

- The contextual toolbar must visibly belong to the selected object but must not resemble a permanent settings dashboard. Use compact icon + short label controls where icons alone could be ambiguous.
- Core actions for a selected sticker/image should be easy to discover: Replace, Animate, Arrange/layer, Duplicate, Lock and Delete. Put secondary options such as flip, opacity, fine rotation, grouping, crop and exact sizing in a secondary menu or contextual panel rather than cramming every action into the first row.
- Delete must support Undo immediately; only show a confirmation when the action is genuinely consequential. Provide a clear and accessible undo path.
- On mobile, tapping an object selects it and shows the selection outline; a compact bottom sheet then exposes relevant controls. The sheet must not cover the selected object permanently or consume the whole screen without a clear reason. Keep Done/Close visible and preserve the selected object when the sheet opens/closes.
- Touch dragging of the object must not be confused with browser scrolling. Provide an explicit way to move/resize/rotate without relying solely on precision gestures, and make all major actions available from menus/buttons as alternatives.
- Use consistent placement, spacing, icon style, states and animations for toolbars, menus, popovers, handles and panels throughout Kadi. Reuse shared components and design tokens instead of styling each object type independently.

#### E. Selection animation and microinteraction quality

- Selection changes may use a very short, restrained transition (roughly 100–160 ms) for the outline/handles and toolbar appearance. Do not animate the object's actual position, size or rotation just to signal selection.
- Use no bouncy entrance, pulsing neon glow, heavy blur, dramatic scale-up or prolonged easing for routine editor actions. Creative motion belongs to the invitation; editor feedback should be fast and quiet.
- On deselection, remove handles/outline cleanly without making the object fade or jump. Toolbar entrance/exit should be subtle and must not delay the next input.
- Respect `prefers-reduced-motion`; selection, dragging, focus and essential state feedback must remain understandable without transition animations.

#### F. Verify the selection design visually, not only in code

Before considering canvas selection complete, inspect and test at least these states: (1) one transparent flower sticker selected; (2) two overlapping stickers with the upper selected; (3) a lower/covered sticker selected through Layers/Select-underneath; (4) text selected, then text in editing mode; (5) a masked/cropped photo selected; (6) multi-selection; (7) a locked object; (8) the same invitation in Preview with all editor controls absent; (9) a mobile selected sticker with its bottom sheet open. Where browser/screenshot tooling exists, capture and inspect desktop and mobile screenshots, correct visual defects, and repeat. If visual inspection tooling is unavailable, run the available interaction tests and state that limitation accurately in the final report; do not claim pixel-level visual verification that was not performed.

### 5.4 Add text

Click “Text” to open a concise panel with “Add heading”, “Add subheading”, “Add body text” and “Add text box”. Clicking a choice inserts editable text on the canvas with a reasonable style and selects it. Do not open a page of text inputs.

Text editing features:
- Rich text editing for selected ranges if the existing engine supports it robustly.
- Font selection and size, weight, italic, underline, colour, highlight/background, alignment, line-height, paragraph spacing and letter spacing.
- Text box resize and reposition; rotate if supported.
- Text can overlap art, stickers and photos. It is not automatically confined to a card or section.
- Readability helpers: contrast warnings, clipping/overflow warnings and a visual indication if text extends beyond the page. These are gentle advisories, not restrictions on creative freedom.
- Useful starter styles and template-specific font pairings.
- Preserve text style when editing the content. Don't unexpectedly change the font or spacing while typing.

### 5.5 Writing help

If the existing product has an AI text-writing integration, improve it with contextual prompts appropriate to occasion and tone: warm, formal, concise, playful, respectful/solemn and professional. If no AI service exists, do not invent a working AI endpoint; implement a service boundary or provide local starter copy/standard templates.

Suggested use cases: invitation wording, RSVP instructions, dress-code wording, event description, ceremony/reception details, programme, short thank-you message and FAQ. Users must always be able to edit suggested text and accept/reject it. Never silently replace their content.

### 5.6 Uploads

- Support file picker on desktop and gallery/file chooser on mobile.
- Show upload progress and useful errors (unsupported type, file too large, offline, upload failure).
- Make uploading visible only in the upload panel/canvas rather than taking over the app.
- Images inserted should immediately appear on canvas and be editable. Preserve the original upload so the user can re-crop/replace it.
- Validate files on the server as well as client-side. Use access controls for private uploads.
- Optimise dimensions and formats without destroying transparent alpha. Avoid reloading full-resolution files for every thumbnail.

---

## 6. ANIMATION SYSTEM

Animations are a major part of Kadi, but they must be a coherent system, not random CSS effects.

### 6.1 Animation categories

1. **Entrance** — fade in, reveal, rise, slide, gentle scale, draw/reveal where suitable.
2. **Subtle continuous** — float, sway, drift, slow rotation, gentle sparkle; use sparingly and only when visually appropriate.
3. **Scroll reveal** — sections or their objects reveal as the guest scrolls down the invitation.
4. **Sequence/timing** — objects can reveal in order with delay, duration and easing presets.
5. **Envelope opening** — a curated set of complete envelope styles and opening animations; the creator chooses from polished presets rather than building a flap animation from scratch.

### 6.2 Per-element animation controls

For a selected text/sticker/photo, expose a clear “Animate” control in its contextual popup. Open a small visual preset picker with preview thumbnails/examples, grouped by effect. Show only relevant/compatible effects for the selected asset. Provide:

- Effect choice and “None” option.
- Duration/speed, delay and direction where relevant.
- Easing/intensity only if the chosen engine supports it reliably.
- A Play/Preview action and a reset/remove animation action.
- Sensible default values so the user does not need to tune everything.
- Keep settings compact; put advanced timing/timeline controls behind an “Advanced” affordance if needed.

Animations must persist in the document model and work in the actual published guest page. Never build an editor-only animation that disappears when published.

### 6.3 Timing and motion quality

- Motion should have a purpose and be restrained by default.
- Avoid endless high-amplitude bouncing, flashing, aggressive zooming, or simultaneous movement of every object.
- Prefer transitions that make content feel revealed, not hidden behind mandatory delays.
- Let the guest skip the opening animation and reach essential event information quickly.
- Honour `prefers-reduced-motion`; reduce or remove non-essential motion and provide still alternatives. Avoid using large full-page parallax or constant scaling.
- Pause or reduce off-screen animation where possible. Avoid creating dozens of expensive concurrent animation loops.
- Ensure animations do not make text unreadable and do not block RSVP buttons.

### 6.4 Envelope selection

The creator chooses the envelope and its opening animation from curated options. Each option needs a real visual preview, not a placeholder thumbnail. Group styles by overall mood (e.g. botanical/stationery, modern, playful, formal/solemn) while avoiding a huge decision wall. Choosing an envelope should not alter the invitation design or erase edits. The selected opening animation must transition into the same invitation preview used elsewhere.

---

## 7. THE GUEST-PAGE SECTIONS LIBRARY

Treat the invitation's designed cover and its functional guest-page sections as related but different parts of the same document.

Use an “Add section” library. When selected, add the section and then show contextual configuration. Do not ask the creator to fill every possible field up front. Section ordering and visibility must be editable.

Potential sections:

- Event details / date / time / time zone.
- Add-to-calendar: produce a valid calendar link/file with correct start/end and time zone. Offer Google Calendar/Apple Calendar where appropriate, plus a downloadable calendar event if feasible.
- Location/venue: venue name, address, optional map preview or external map link, directions action; multiple venues for ceremony/reception or multi-part events.
- RSVP: attending/declining and optionally “maybe” if suited to the flow; guest name, plus-ones, custom questions, RSVP deadline, meal selections where applicable. Ensure validation, success, error and duplicate-response handling.
- Schedule/programme/timeline.
- Photo gallery, captions and image ordering.
- Story/timeline (wedding story, graduate journey or birthday highlights).
- Music/Spotify playlist link. Where a collaborative playlist is configured by the host, explain that participation depends on Spotify's share/collaboration permission; do not falsely promise direct song write access from Kadi.
- WhatsApp group or other external link buttons. The creator can paste a URL and set a button label; validate/normalise URLs and show what guests will open.
- Livestream link.
- Gift registry/external gift link.
- M-Pesa or other contribution information/links where supported. Secure payment integrations only; never claim a contribution is completed from a screenshot or unverified guest statement.
- FAQ.
- Dress code.
- Optional post-event gallery or guest photo submission.
- Tribute/obituary/memorial information and optional virtual-candle/stream links for solemn events, with understated design treatment.

Only show features relevant to the chosen occasion and the creator's choices. Keep the library searchable but small and intelligible. Do not add every possible section automatically. A feature must work end-to-end or be clearly labelled as a link/manual section rather than a live integration.

### Maps and calendars

Use existing supported integrations if they exist. Otherwise use reliable external links and structured event data. Never hardcode a fake map or nonfunctional date button. On mobile, prioritize a reliable “Open directions” action rather than an embedded map that consumes the whole screen.

### RSVP behaviour

Guests should be able to open the public link and respond without creating a Kadi account. Use the project's existing RSVP backend if functional. If a simple identity/phone verification step is required to prevent abuse, explain it and make it low-friction. Store responses securely. Hosts see them only within the proper authenticated management permission. Prevent duplicate submissions appropriately while allowing a guest to update an answer when policy permits.

---

## 8. LIVE PREVIEW, PUBLISHING AND SHARING

### 8.1 One source of truth

The editor canvas, editor Preview mode and public guest URL must be renderings of the same underlying invitation model. Do not create separate hand-coded preview markup that drifts away from the published result.

Preview must show:
- Envelope and selected opening animation.
- Canvas composition, real sticker transparency, text styles, overlap and layer order.
- The scrolling/long-page sections.
- Working RSVP UI in an appropriate preview/test mode.
- Calendar, maps, music, links, galleries and other selected sections.
- Mobile and desktop views, with mobile as a first-class target.

The creator must be able to open preview from anywhere in the editor and return without losing selection/work. Preview should use a clear back-to-edit control. Do not reload the entire editor unnecessarily.

### 8.2 Publishing flow

- Autosave first, then validate only truly required information.
- Show a concise checklist of missing important information if necessary. Do not turn publishing into a long form.
- Publish should create a stable public invitation URL, reusing an existing slug when sensible.
- The public state must be explicit: draft, published, unpublished/archived if supported.
- Updating a published invite should update the existing link rather than silently create a duplicate.
- If publishing fails, keep all data and provide a retry. Never display success until the server confirms it.

### 8.3 Share menu and placement

After successful publishing, show a polished share panel/modal, not a dashboard. Make the URL prominent with a large, clear “Copy link” action; add native sharing using `navigator.share` when supported, and platform shortcuts for WhatsApp, email and other suitable channels. Include a QR code if the current stack can generate one cleanly. Provide a way to reopen share later.

- Keep the interface honest about limitations (for example, not every social platform offers direct link-sharing the same way).
- Copy button must work, show copied feedback and have a fallback.
- Share targets must use the actual invitation URL and safe URL encoding.
- The invitation should have a usable social link preview (title, description and image metadata) where the framework supports server-rendered/dynamic metadata.
- Public URLs should not leak private host data or access tokens.

---

## 9. ANONYMOUS DRAFTS AND ACCOUNT CLAIMING

This is a core requirement, not a later polish item.

### Intended behaviour

- A visitor can start creating without account registration.
- Changes autosave to a cloud-backed anonymous draft if the existing architecture supports it, with local browser recovery as a fallback.
- Closing/reopening the browser should recover the draft when the same browser identity/recovery capability remains available.
- For cross-device recovery or secure ownership, provide a secure recovery route or account claiming process. Do not claim cross-device recovery exists if it's only local storage.
- The user can publish/share without being forced to sign up.
- When the user chooses event management, sign-up/login attaches the existing draft/published event to their account. It must not duplicate the invitation, reset the style or change its public link unnecessarily.
- A host can edit their published invitation after signing in.

### Persistence implementation

Audit the existing data model and build on it. Use versioned structured design data, stable IDs, server-side ownership rules and safe save revisions. Debounce rapid edits but flush outstanding changes before preview/publish/navigation where possible. Show honest saving/offline/error states. Queue or preserve pending edits during temporary network loss and resolve conflicts deliberately.

If local storage/IndexedDB is used for recovery, do not store secrets unsafely or treat client-side state as proof of ownership. Anonymous cloud drafts require unguessable capabilities and server-side access checks; public invitation URLs must not grant access to private editor state or RSVP dashboards. Rate-limit sensitive endpoints. On claiming, perform an atomic ownership transfer with proper verification and preserve all associated data.

If current infrastructure cannot provide secure anonymous cloud drafts without a substantial new backend, implement the safest compatible version and explain the limitation in the final report. Do not pretend a local-only draft can be recovered on another device.

---

## 10. EVENT MANAGEMENT AFTER ACCOUNT CREATION

Keep event-management tools, but move them behind sign-in and let them remain secondary to creation.

Priority order:

1. View RSVP responses and their statuses.
2. Edit event details and the published invitation.
3. Manage/filter/export guest list.
4. Set RSVP deadlines/questions and plus-one rules.
5. Send host updates/reminders using supported communication services.
6. Co-hosts and role permissions.
7. QR check-in, capacity/ticketing and more advanced analytics later if justified.

Reuse existing working event dashboards and APIs if sound. Simplify duplicate/overwhelming controls; don't delete the underlying capability merely to make the UI simpler. Protect guest PII and restrict event-management data to authorised hosts. Any co-host support needs explicit permissions and revocation.

---

## 11. KENYA-FIRST DETAILS AND LOCALISATION

Preserve existing local payment and contact functionality if present. Where relevant, ensure:

- EAT / Africa-Nairobi time zone handling for event times and calendar exports.
- Kenyan Shilling (KES/KSh) formatting where money is displayed.
- Kenyan phone formats, including `+254`, with appropriate validation and normalisation.
- Event venues and directions that work with real address/search data or user-supplied map links.
- Easy sharing in WhatsApp, because hosts and guests may coordinate there.
- Useful local ceremony/reception workflows and design options that are culturally varied and respectful; do not reduce Kenyan design to a single stereotyped style.
- M-Pesa instructions or integration only according to real capabilities and secure processing; preserve existing working Daraja/provider integration if present.

Don't hardcode Kenya assumptions into data structures that prevent future localisation. Store times in a robust standard and display them in the event's intended time zone.

---

## 12. DATA MODEL AND COMPATIBILITY GUIDANCE

Adapt this to the existing architecture rather than blindly implementing a new schema. The data must represent editable objects and guest sections independently.

A conceptual invitation document can contain:

- `schemaVersion` / migration version.
- Invitation identity: stable internal ID, public slug, title, status, creation/update timestamps.
- Anonymous recovery/ownership metadata stored securely and separately from publicly readable content.
- Event information: type, title, host display names if present, date/time/time zone, venue(s), RSVP deadline and event-specific settings.
- Envelope preset and opening-animation preset.
- Canvas/document settings: intended dimensions/aspect ratio, background/texture and relevant viewport defaults.
- `elements[]`: stable ID; element type; asset or content reference; position and dimensions in a consistent coordinate system; rotation; z-order; opacity; visibility/locked flags; group IDs; crop/mask; style props; animation config; accessibility label/description when appropriate.
- `sections[]`: stable ID, section type, ordering, visibility, content/settings, design style and interaction config.
- Asset references/uploads and licence/metadata references where applicable.
- Version/revision metadata and publication settings.

Use normalized coordinates or another layout strategy that keeps compositions consistent between editor viewport sizes and guest-page sizes. Store original dimensions independently of the user's current zoom. Z-order must be deterministic. Maintain backward compatibility with existing designs and migrate old templates/data rather than breaking them.

Avoid storing huge base64 images in the main JSON document or history. Store file references and appropriate metadata. Validate allowed element types and fields on the server. Do not accept arbitrary unsafe script/HTML as an invitation element.

---

## 13. RESPONSIVE DESIGN AND ACCESSIBILITY

Mobile is not a squeezed desktop layout. It is a first-class creation and guest experience.

### Editor mobile behaviour

- Keep the canvas large enough to manipulate.
- Use a bottom tool dock or compact tool row for Text, Stickers, Uploads, Sections and Preview, with labels where useful.
- Open selected-element controls in an accessible bottom sheet that can be dismissed and does not hide every action.
- Provide fit-to-canvas and straightforward zoom/pan.
- Ensure dragging an object doesn't unintentionally scroll the whole page; normal page scroll must remain possible when the user interacts outside the canvas.
- File selection should work with a phone's image gallery/files.
- Don't use hover as the only way to reveal actions.

### Accessibility

- Keyboard navigation/focus support for menus, buttons, dialogs, editor panels and important element operations.
- Visible focus styles and descriptive accessible names for icon buttons.
- Contrast-aware text warnings and readable guest content.
- Respect `prefers-reduced-motion` and provide a reduced-motion invitation rendering.
- Provide single-pointer alternatives to drag-only operations (position controls, nudge/arrange menu, etc.) as recommended by WCAG 2.2 SC 2.5.7.
- Use adequate touch target sizes; avoid tiny decorative hit areas.
- Do not convey save/publish/RSVP state only by colour.
- Ensure modal focus management, Escape handling where appropriate, focus return, and screen-reader status announcements for save/publish/errors.
- Do not block access to event details behind an animation or inaccessible interaction.

---

## 14. PERFORMANCE, SECURITY AND RELIABILITY

### Performance

- Optimise image assets and use responsive image sizes when appropriate.
- Lazy-load below-the-fold gallery thumbnails and invitation sections while keeping the first viewport visually complete.
- Pause or reduce off-screen motion where practical.
- Avoid dozens of unthrottled animation timers or unnecessary re-renders on each pointer movement.
- Keep object transform feedback responsive; batch/debounce expensive persistence rather than delaying the visual drag itself.
- Test in production build and on a mid-range mobile device/emulator if available.
- Provide loading states, empty states, upload progress and graceful errors.

### Security and privacy

- Validate and authorise every server-side operation, especially upload, draft load/save, publish, RSVP, ownership claim and event-management APIs.
- Do not leak private drafts, access tokens, host information or guest lists in public HTML/meta tags.
- Upload validation must occur server-side and include file-type/magic-byte validation where feasible, size limits and safe storage headers. Never trust only the filename or browser MIME field.
- Sanitize text/link content appropriately; never execute user-supplied HTML/scripts.
- Add rate limits for anonymous creation and public RSVP endpoints where supported.
- Protect private photo galleries and guest uploads; give hosts controls over visibility and deletion.
- Use secure, verified account-claiming and permission checks. Public invitation visibility does not equal editor ownership.

---

## 15. REFERENCES — LEARN FROM PATTERNS, DO NOT CLONE DESIGNS

Use these references to understand interaction patterns and product choices. Do not copy their exact interface, artwork, templates or brand identity. Build a distinctive Kadi experience consistent with this brief.

### Creative editing and layers
- Canva Elements: https://www.canva.com/help/add-elements/
- Canva grouping, layers and alignment: https://www.canva.com/help/layer-group-align/
- Canva element transparency: https://www.canva.com/en_gb/help/transparency/

Learn: searchable reusable elements; individual objects; group/ungroup; reorder front/back; alignment; opacity; replacement and deletion.

### Invitation visual craft and envelope
- Paperless Post: https://www.paperlesspost.com/
- Greenvelope: https://www.greenvelope.com/

Learn: stationery-quality art direction, visual customisation, a deliberate envelope/opening moment and guest-facing invitation presentation. Keep Kadi's envelope presets curated but make invitation contents freer.

### Simplified event links and RSVP
- Partiful: https://partiful.com/
- Partiful Help Center: https://help.partiful.com/

Learn: event links, simple RSVP, guest communication and mobile-first hosting patterns. Do not allow host-management features to take over Kadi's creation entry point.

### Canvas implementation candidates (evaluate; don't choose blindly)
- Fabric.js core concepts: https://fabricjs.com/docs/core-concepts/
- React-Konva drag and drop: https://konvajs.org/docs/react/Drag_And_Drop.html

Evaluate based on the actual stack, rich-text needs, object model, transparent assets, masks, selection under overlapping objects, export/render consistency, serialisation, mobile performance and accessibility. Keep the existing canvas library if it already works and can be improved.

### Motion and accessibility
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- W3C WCAG 2.2 overview: https://www.w3.org/TR/WCAG22/
- W3C dragging movements criterion: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements

Learn: reduce motion according to user preferences, and don't make drag the only possible way to complete an action.

### Image performance
- Web performance image guidance: https://web.dev/learn/images/

Learn: right-sized images, appropriate formats, efficient loading and avoiding unnecessary image bytes. Confirm current guidance if the linked page changes.

---

## 16. IMPLEMENTATION PLAN — FOLLOW THIS ORDER

Do not attempt a risky all-at-once rewrite. Make the visual and behaviour changes in controlled phases within this assignment, preserving a working project between phases.

### Phase 0 — Audit and baseline

- Inspect the full relevant codebase and run current tests/build.
- Record route/page map, framework/library inventory, current feature behaviour, design/template structure, state/persistence, auth, publishing, RSVP and upload flows.
- Identify the current primary entrypoint and what currently makes the app feel too complicated or SaaS-like.
- Check existing work and Git diff; do not discard user changes.
- Create a concise `KADI_IMPLEMENTATION_NOTES.md` inside the project that records current architecture, keep/refactor/remove decisions, planned migrations and tested commands. Do not put secrets or personal data in it.

### Phase 1 — Build a safe product shell and design system

- Preserve existing routes and functional APIs.
- Implement coherent shared design tokens, typography, button/input/menu/popover/modal patterns, responsive layouts and state treatments.
- Remove unnecessary SaaS-first clutter from the public landing page, not the useful event-management capability behind account access.
- Make the landing gallery the key entry point, using actual invitation compositions and reduced-motion fallback.

### Phase 2 — Editor experience

- Upgrade the existing canvas in place where practical.
- Implement/repair object model, selection, reposition, resize, rotation, layering, text editing, sticker insertion, photo upload, replacement, contextual popups, undo/redo, zoom and responsive controls.
- Add an optional layers/outline panel for overlapping elements.
- Make image silhouette/transparency a first-class requirement.
- Make the canvas and panels responsive.

### Phase 3 — Assets, templates and animation

- Organise/source/create a visually consistent starter set of sticker assets and templates; do not use face-based stock photos as default templates.
- Convert templates into editable compositions if currently flattened, keeping old templates/data compatible.
- Add animation presets and selected-element controls, plus curated envelope/opening options.
- Verify the real guest rendering reproduces the same composition and motion.

### Phase 4 — Sections, preview, publish and share

- Implement/repair the section library with useful integrations/fallbacks.
- Use one document model for editor, preview and public guest page.
- Complete account-free preview, publish and share flow.
- Ensure stable links, social metadata and guest RSVP.

### Phase 5 — Draft recovery and management ownership

- Implement or repair autosave, recovery, anonymous cloud draft if architecture permits, safe ownership claiming and compatibility with the existing account system.
- Verify signing up does not duplicate or reset the invitation.
- Preserve the event management tools, but keep them out of the default creation flow.

### Phase 6 — Verify and polish

- Run lint/type checks/build/tests available in the project.
- Test all primary user journeys, responsive layouts, reduced motion, object selection/layering, save recovery, publish/share, guest RSVP and existing management flows.
- Fix regressions before finishing. Do not leave compilation errors or dead controls.

If some phases already exist and work well, retain them and focus on gaps. The phases are a safe execution order, not a requirement to rewrite already good code.

---

## 17. ACCEPTANCE TESTS — THE WORK IS NOT COMPLETE UNTIL THESE PASS

### Landing and gallery
- [ ] A visitor can understand Kadi and enter creation with one clear action.
- [ ] The gallery shows multiple invitation designs in staggered columns with opposite-direction movement on desktop.
- [ ] Motion loops smoothly, doesn't make normal scrolling difficult, and honours reduced-motion preference.
- [ ] Designs are readable/clickable; clicking one opens that exact editable design.
- [ ] Gallery works on tablet and mobile without shrinking everything into illegible thumbnails.
- [ ] No registration wall or event form blocks template selection/creation.

### Editor and canvas
- [ ] Add/edit/delete text works and styling persists after reload.
- [ ] Stickers have transparent backgrounds / visible silhouettes and are individual objects.
- [ ] A text object can overlap a sticker and can be brought in front/behind it.
- [ ] Two stickers can overlap and can be independently selected/edited.
- [ ] A hidden/covered object can be selected from layers/outline.
- [ ] Selected stickers have an unmistakable high-contrast selection state; hover is visibly weaker than selection, and keyboard focus is also visible.
- [ ] Transparent cut-out stickers show a silhouette-aware outline where supported plus no-fill transform bounds/handles; selection never adds a visible square background or changes the artwork.
- [ ] Resize handles, rotation handle/connector, aspect-ratio behaviour and handle hit targets work with mouse and touch.
- [ ] Contextual toolbar stays inside the viewport, is anchored predictably, and does not obscure important artwork or jump while dragging.
- [ ] Overlapping objects can be selected independently, including covered objects through Layers/Select-underneath.
- [ ] Text object selection and inline text-edit mode are visually distinct; editor selection chrome is absent from Preview/public view.
- [ ] Multi-selection, locked-object state, deselection, Undo after Delete, Escape behaviour and reduced-motion selection states are tested.
- [ ] Desktop and mobile visual inspection has been performed (or any tooling limitation is disclosed honestly).
- [ ] Resize, rotate, opacity, replacement, duplicate, delete, grouping and layer order work where available in the UI.
- [ ] Photo upload works on desktop and mobile; crop/reposition works; the original asset is not destructively lost.
- [ ] The contextual popup appears near the selected element without obscuring essential content; mobile uses a usable bottom sheet.
- [ ] Fit-to-canvas, zoom and pan work and don't trap the user in a cropped view.
- [ ] Undo/redo reverses real canvas edits.
- [ ] A non-drag alternative exists for moving/reordering elements.

### Animation and envelope
- [ ] Animation is assigned to a selected element and previewed accurately.
- [ ] Effect, duration/delay where supported, remove/reset and playback controls work.
- [ ] Opening animation is selected from available presets and doesn't erase invitation edits.
- [ ] Public invitation plays the configured effects consistently with preview.
- [ ] Reduced-motion users can access the full content without non-essential motion.

### Sections and guest view
- [ ] Sections can be added, configured, removed, reordered and hidden/shown as intended.
- [ ] Calendar and map actions use real event data and URLs.
- [ ] Spotify/WhatsApp/external links use validated URLs and explain external destinations where needed.
- [ ] RSVP stores a real response through the existing or correctly implemented backend.
- [ ] Guest opens invitation and can respond without a Kadi account, subject only to a clear, necessary verification flow.
- [ ] Guest view contains no editing controls and works on mobile.
- [ ] Editor Preview and public link match in artwork, text, layer order, selected section order and animations.

### Persistence, account and share
- [ ] Changes auto-save and show honest saving/saved/error states.
- [ ] After refresh/reopening the same browser, the draft is recovered when expected.
- [ ] Temporary network error does not silently destroy local changes; retry is possible.
- [ ] Publish creates/updates the invitation successfully and preserves a stable URL where appropriate.
- [ ] Sharing, copy link and native share work with the correct public URL; failure is handled honestly.
- [ ] Signing up/logging in claims the same invitation rather than producing a duplicate.
- [ ] Existing user accounts, event records, RSVPs and working management flows still work.
- [ ] Private draft/editor/guest data cannot be accessed by guessing a public URL or ID.

### Quality and regression
- [ ] Build succeeds and relevant tests/type/lint checks pass.
- [ ] No broken import, missing required asset, empty page, red console error or obvious dead button remains.
- [ ] Existing routes, saved templates/invitations and backend integrations were tested.
- [ ] Performance is acceptable on a typical mobile device; gallery and long invitation art are not all loaded at full resolution at once.
- [ ] UI is coherent across landing, editor, preview, guest page and account area.

If an acceptance criterion cannot be completed because a dependency/service is missing, do not fake it. Document exactly what blocks it, the safe fallback implemented, and the remaining work. Finish all work possible in the current environment.

---

## 18. WHAT TO KEEP, WHAT TO DELETE, WHAT TO REDESIGN

### Keep

- Existing working authentication, accounts and permission checks.
- Existing database/data, backend APIs and event/RSVP flows that pass audit.
- Existing payment/M-Pesa integrations, uploads, calendar/map logic, public slugs and deployment configuration if working.
- Existing strong Kadi branding, design assets, template data or components that fit the quality target.
- The event-management area and all useful business logic; simplify its surface if it is overly complex.
- Existing code created by earlier work when it is functional and compatible.

### Delete or remove from the primary experience (not necessarily from the codebase)

- SaaS-style landing/dashboard clutter that makes a first-time visitor manage an event before creating an invitation.
- Redundant forms, repeated cards, unnecessary field buttons, oversized settings panels and technical jargon in the first-time journey.
- Duplicate editors, duplicate renderers or inconsistent preview implementations after carefully verifying which implementation is correct.
- Placeholder buttons, false integrations, empty features and decorative UI that has no purpose.
- Template thumbnails based on random stock faces, white-square flowers or visibly mismatched clipart.
- Emoji used as app icons.
- Any destructive database or code deletion without verified dependency and compatibility review.

### Redesign

- Landing: become a living invitation gallery with immediate creation.
- Editor: become a canvas-first creative workspace with contextual popup controls.
- Assets: become a searchable sticker/element library of individual transparent objects.
- Templates: become layered editable compositions, not flat preview images.
- Preview: render the actual invitation as guests will see it.
- Sharing: make publishing and copying the public link effortless.
- Account transition: let the creator claim the existing draft/invitation and then manage RSVP/event details.
- Guest pages: coherent, mobile-first, visually polished and functional.

---

## 19. FINAL RULES WHILE IMPLEMENTING

- Do not create a new repository or duplicate the app.
- Do not rewrite all pages in one destructive pass.
- Do not change every visual component merely to make it look “modern”; follow the clear art direction above.
- Do not flatten the canvas or store everything as a screenshot.
- Do not use visible square art backgrounds for sticker assets.
- Do not use people/face stock templates as the default art direction.
- Do not make every possible feature visible at once.
- Do not require a login to begin, edit, preview, publish or share.
- Do not require guests to create an account to open an invitation or RSVP when the current product rules allow anonymous responses.
- Do not claim save/publish/upload/payment/RSVP success before the responsible system confirms it.
- Do not leave functions broken to make the UI simpler; hide/defer complexity rather than deleting useful functionality.
- Do not ask the user to write more prompts for ordinary implementation decisions. Make careful choices and finish the coherent scope.
- Use current project conventions and format/lint rules.
- Add tests around changed core behaviour, especially document serialization, object layering, draft persistence, publishing and RSVP access.
- When done, provide a concise report with: (1) what changed, (2) what was intentionally preserved, (3) files/routes affected, (4) tests/builds run and their actual outcomes, (5) integrations/assets that still need external credentials or generation, (6) any known limitations. Be honest about anything not completed.

## FINAL PRODUCT TEST

Before declaring completion, perform this complete journey in the running app:

1. Open the landing page as a first-time visitor.
2. Click a botanical or birthday invitation from the moving gallery.
3. Change the heading; add a sticker; move the sticker over the text; send it behind the text; replace it with another sticker.
4. Upload a photo and crop it; keep the original available; add another sticker over the photo.
5. Add an animation and preview it.
6. Choose a curated envelope and opening animation.
7. Add venue/map details, calendar action, RSVP and a playlist/external link where those integrations are actually supported.
8. Use Preview and verify it matches the guest page.
9. Refresh or reopen the draft and ensure edits persist.
10. Publish/share and verify the public URL, link preview and guest RSVP.
11. Sign up/log in and verify the invitation was claimed without a duplicate and that the existing event/RSVP management flow still works.
12. Test at mobile width and with reduced motion enabled.

**Start with the codebase audit, then implement the changes in the safest order. The final result should feel like opening a beautiful creative studio—not a SaaS setup wizard.**
