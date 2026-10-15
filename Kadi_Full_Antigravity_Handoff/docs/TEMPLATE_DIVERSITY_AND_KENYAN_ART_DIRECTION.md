# Event catalogue and art direction — not every invite is Victorian

Use `src/lib/events/categories.ts` as the canonical category source. This file is a design plan, not a statement that templates for all categories already exist.

## Required categories and visual worlds

| Category | Suitable starting visual families | Suggested blocks | Motion boundaries |
|---|---|---|---|
| Wedding | Botanical, modern editorial, cultural, minimal, luxury formal, cinematic | Hero, story, schedule, ceremony/reception, gallery, RSVP, registry, FAQ | physical envelope optional; romantic reveal only by choice |
| Engagement | Modern romance, bold editorial, garden, dinner invitation | Hero, story/announcement, venue, countdown, RSVP, gallery | subtle sparkle or reveal, not mandatory wax |
| Anniversary | Portrait-led, elegant minimal, nostalgic photo album | Hero, milestone story, schedule, gallery, RSVP | gentle photo transitions |
| Birthday | Ruby Disco, color-pop, playful illustrated, elegant dinner, kids’ party, coastal | Hero, celebrant, activities, venue, schedule, gallery, RSVP, wish list | confetti/disco only for suitable theme; reduced motion |
| Graduation | Academic editorial, black/navy/gold, school-colour, photo-led | Graduate, institution, ceremony, celebration, schedule, venue, RSVP, gallery | crisp line/foil reveal; optional celebratory motion |
| Housewarming | Architectural, cozy interior, botanical/home, illustration/key motif | Home note, photos, address/directions, date/time, RSVP, practical notes | simple reveal; no wedding floral default |
| Memorial | Quiet botanical, portrait-led, ivory/slate/sage, contemporary | Obituary, tributes, gallery, services, order of service, candles, condolences, livestream | calm fade only; no party particles or upbeat music |
| Funeral | Dignified service program, restrained family-selected palette | Service and burial times/venues, directions, order of service, condolences, livestream/support | minimal; precise timing; no celebratory animation |
| Baby shower | Soft contemporary, playful illustration, warm neutrals | Parent-to-be, event, schedule, venue, RSVP, registry/wishlist, FAQ | light reveal; optional petals; respect preferences |
| Bridal shower | Personal editorial, garden brunch, bold contemporary | Host/guest of honour, schedule, venue, RSVP, gift list, gallery | light celebratory options; not default for all weddings |
| Corporate | Brand-led editorial, minimalist, structured | Hero, organiser, agenda, speakers, venue, registration/RSVP, FAQ | low-noise, professional |
| Product launch | Product-led, bold typographic, cinematic brand visual | Product, agenda, speakers, venue, RSVP/registration, media | staged reveal optional |
| Holiday | Warm festive, modern graphic, cultural/family oriented | Host, occasion text, date, venue, schedule, RSVP | seasonal motion only when opted-in |
| Reunion | Photo collage, school/alumni colours, nostalgic editorial | Group story, programme, venue, gallery, RSVP, FAQ | subtle photo transitions |
| Religious milestone | respectful, faith-specific art direction chosen appropriately | ceremony details, programme, venue, RSVP, family note | reserved; avoid assumptions about denomination |
| Cultural celebration | specific community/cultural design only when selected intentionally | cultural context, schedule, venue, dress code, RSVP | decorative motifs used accurately and respectfully |
| Retirement | Portrait-led editorial, warm celebratory, professional | career timeline, programme, venue, RSVP, messages/tributes | restrained celebration |
| Fundraiser | Cause-led editorial, accessible info, brand/partner marks | purpose, programme, venue, RSVP, contribution details, FAQ | minimal; trust and clarity over decoration |
| Community | local/organizer-led, bright modern, practical | organizer, activity schedule, venue, registration/RSVP, directions | minimal |
| Welcome baby | birth announcement, soft neutral, photo-first | baby/parent note, date/visit guidance, gallery, RSVP if gathering | gentle |
| Farewell | editorial memories, group photo, warm notes | honouree, timeline, venue, programme, message board, RSVP | photo reveal |
| Get-well | calm, kind, private, low pressure | personal note, optional message collection, privacy | quiet, avoid public exposure of sensitive personal info |
| Custom/other | neutral base with configurable blocks | host-defined | host choice within accessible boundaries |

## Kenyan authenticity and content

- Where people or places are shown, source assets intentionally depicting Black Kenyan people and Kenyan contexts where relevant. Do not use a generic western suburban party image for a Nairobi housewarming by default.
- Include Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Diani and other Kenyan contexts when contextually appropriate; do not imply these are venue recommendations unless real data was supplied.
- Use attire and cultural motifs accurately. Kikoi, kitenge, beadwork, kanzu, etc. are not universal decorations. Choose them based on event or host context, not ethnicity guessing.
- Use correct local formats: KES, +254 phone display, DD MMM YYYY and EAT where appropriate. “Karibu”, “Asante”, and “Pole sana” belong in contexts where they sound respectful and natural.
- Maintain an asset manifest: source/provider, license/usage conditions, alt text, category relevance, mobile crop/focal point and replacement path.
- If AI-generated imagery is used, prompt explicitly for the intended Kenyan context and review results for fidelity, unintended stereotypes and anatomical errors before shipping. Do not describe an AI-generated person as a real customer/celebrant.
