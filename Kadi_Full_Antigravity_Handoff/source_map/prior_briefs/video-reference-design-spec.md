# Kadi — Video Reference Design Specification

This document captures the actual visual and interaction patterns in the four videos supplied for Kadi on 12 October 2026. Treat these descriptions as the design source of truth. They are not requests to copy a creator's branding, watermarks, precise artwork or assets.

## The product idea

Kadi is not a normal website that happens to have a moving envelope. Each invitation is an art-directed, mobile-first mini-experience with a designed outer world, an envelope or cover reveal, a bespoke invitation composition, long-form event sections, optional audio, and useful actions such as maps and RSVP. The creator platform is the studio for composing these experiences; it must not reduce them to a generic form or card dashboard.

## Reference A — “These are for you” / gift-led birthday (about 36 seconds)

### Visual language
- Saturated ruby / crimson invitation world, cream paper and script typography.
- A closed envelope is presented as a designed object, surrounded by delicate line-art decorations.
- The invitation changes into a photo-led celebration cover using a full-bleed or wide hero photograph and celebratory script lettering.
- The content uses a “These are for you” gift motif. Message, flowers and cake are represented as separate illustrated objects, not as conventional feature cards.
- A scrapbook-like photograph composition follows: overlapping images, a record / turntable motif, and playful arrangements with different angles and scale.
- The visual world stays coherent through the sequence. It feels composed, not like components from a dashboard library.

### Required behaviour
1. Start at an illustrated envelope and a short “tap to open” cue.
2. The seal reacts; the flap opens; the card appears from inside the envelope.
3. Reveal the personalised cover and hero imagery.
4. Present three interactive gifts: personal message, flowers, and cake. Selecting each changes the content below it with a short, deliberate transition.
5. Reveal an irregular photo collage and record-player motif. If audio is configured, the record can rotate only while audio is playing.
6. Provide replay, share and RSVP access without covering the visual content.

## Reference B — pastel botanical birthday invitation (about 42 seconds)

### Visual language
- A soft cream paper surface with blush-pink flowers, botanical corners and sage / olive green sections.
- Large elegant script for the celebrant's name, restrained supporting text, a central medallion / arch and hand-drawn garden architecture.
- The invitation is vertically composed and scrollable. It moves from a light floral introduction into a darker green event-details section.
- The date, venue, address and RSVP are easy to locate. The RSVP area is a designed part of the invitation but the form remains usable.

### Required behaviour
1. Reveal floral artwork and the personalised name in a sequence.
2. Use a mask, unfolding paper or layered-card motion to transition between intro and detail section.
3. Put date and venue information into a clear visual hierarchy; do not bury it in a pile of generic cards.
4. Make the RSVP action obvious. The response form must use real application state and backend submission.
5. Keep decorative botanical movement subtle; provide a reduced-motion equivalent.

## Reference C — red disco / frame-based birthday invitation (about 17 seconds)

### Visual language
- Ruby-red background with a rich repeated texture, stars, silver disco balls and small whimsical illustrations.
- A central paper invitation sits within an ornamental frame. The frame and surrounding design form part of the invitation's identity.
- The central invitation uses strong scale contrast: very large script name, a large celebrant age, compact date details and venue artwork.
- Later sections include venue, house rules and a prominent RSVP area. A record/music control remains part of the visual world.

### Required behaviour
1. The outer frame remains visually coherent while the guest moves through the invitation.
2. Envelope opening reveals a custom birthday cover, rather than a default hero component.
3. Make age / milestone optional event data, not a hardcoded “19”.
4. Venue, house rules and RSVP can be sections in a configurable order.
5. Decorative disco balls and stars may move slowly, but never obscure touch targets, text or the form.
6. Music can only start after a deliberate user action and must have a working pause / mute control.

## Reference D — sage botanical wedding invitation (about 67 seconds)

### Visual language
- Ivory / warm white page, sage green botanical illustrations, blush floral accents, subtle paper grain and script names.
- A wax-sealed envelope opens. Several overlapping paper / image pieces appear to be drawn out of the envelope before the guest arrives at the main invitation.
- The long invitation combines a photo cover and opening phrase with distinct content passages: venue/map, RSVP, dress code, gallery, romantic quote/story, cash gift, hotel / accommodation link, and a closing photograph or message.
- Images vary in size and placement. Some are offset or layered. Content is not laid out as a set of equal-width rounded cards.
- Navigation / action links take guests directly to useful destinations such as map directions or booking links.

### Required behaviour
1. The opening sequence includes the seal, 3D flap, rising paper/card and an overlapping paper-stack effect.
2. Transition into a long, editorial invitation page with clear section rhythm and carefully selected imagery.
3. Provide editable venue, maps, calendar details, RSVP, dress code, gallery, quote/story, contributions/gifts and accommodation links when enabled.
4. Keep the invitation easy to scroll on phones. Do not trap normal page scrolling in a small iframe-like window.
5. RSVP and external links must be real. Optional sections can be switched off and rearranged.

## Cross-video principles

- Four example visual worlds are different on purpose. Do not merely apply four palettes to the same layout.
- The invitation should look like crafted stationery / illustrated digital art; the creator dashboard should feel like a design studio, not an admin template.
- Use composed typography, deliberate negative space, varied image proportions, hand-authored SVG/CSS ornaments and template-specific decorative assets.
- Use image assets that the host owns or is licensed to use. Do not ship competitor screenshots, TikTok watermarks, competitor logos, or copied proprietary art.
- Add a real template metadata contract: `experienceTheme`, `motionPreset`, palette, typography, liner / seal, section configuration, gallery/media assets and optional audio.
- Use data from the event and the chosen template. Never hard-code a person's name, age, venue, date, URL or RSVP state.
- Motion should be choreographed into phases: sealed / opening / revealed / invitation scroll. Each phase needs a working skip/replay path and must not block access to details or RSVP.
- Audio never autoplays. Honour `prefers-reduced-motion`, keyboard operation, proper focus, alt text and contrast.
- The experience must stay fast and responsive on ordinary phones and uneven connections common in Kenya.
