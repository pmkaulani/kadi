# Kadi — Multi-occasion catalogue plan

The purpose is not to put the same wedding card into 23 category filters. Each occasion needs its own image, layout proportions, copy tone, decorative motif, colour plan, and animation intensity. Keep these templates data-driven through `TemplateDefinition` and the shared renderer.

## Baseline coverage target

The supplied project has six templates across five categories. Keep those IDs and preserve their stored event compatibility. Expand toward at least 24 real template records, with all core event categories represented and extra choices for common categories.

| Occasion | Minimum target | Visual direction | Layout and motion |
|---|---:|---|---|
| Weddings | 3 | Classic floral, outdoor editorial, modern/cultural | Mix stationery, full photo, and editorial split; envelope optional |
| Birthdays | 3 | Color-pop, milestone dinner, playful kids' party | Strong numerals, party imagery; optional restrained confetti |
| Graduations | 2 | Achievement-led, modern school/campus | Bold title/year, navy/gold or chosen school colors; upward reveal |
| Housewarming | 2 | Botanical home, modern architecture/open-house | Home/interior/doorway/garden image; warm reveal, no wedding imagery |
| Memorial | 1+ | Quiet portrait or nature | Calm, readable service/tribute hierarchy; fade only |
| Funeral/service programme | 1+ | Clear, dignified, practical | Portrait, schedule, venue, directions, condolence link; no decorative motion |
| Baby shower | 1+ | Soft, neutral, playful | Illustrated/pastel choices; gentle motion |
| Welcome baby | 1+ | Personal, tender | Optional photo; readable details |
| Bridal shower | 1+ | Social, editorial, flowers/brunch | Ribbon or collage motifs; distinct from wedding design |
| Engagement | 1+ | Modern romance | Photo-led, city or garden direction |
| Anniversary | 1+ | Personal, memory-rich | Timeline, photo strip, milestone year |
| Corporate | 1+ | Brand-aware, minimal, structured | Grid, clean sans-serif, venue/schedule |
| Product launch | 1+ | Bold, high contrast, contemporary | Product image, large type, precise mask reveal |
| Holiday party | 1+ | Seasonal but context-aware | Lights, seasonal colors; don't assume only Christmas |
| Reunion | 1+ | Community and shared memories | Photo collage, schedule, location motif |
| Religious milestone | 1+ | Tradition-aware and respectful | Clear ceremony/service details; don't invent symbols |
| Cultural celebration | 1+ | User-grounded and authentic | Use selected references; avoid stereotypes |
| Retirement | 1+ | Gratitude and next chapter | Timeline, career photos, milestone type |
| Fundraiser | 1+ | Credible and cause-led | Cause image and clear info; never invent impact numbers |
| Community gathering | 1+ | Open, warm, practical | Location, schedule, local activity images |
| Farewell | 1+ | Personal and forward-looking | Postcard/photo strip/handwritten note |
| Get-well wishes | 1+ | Gentle, private | Single note, gentle imagery, no public/private health assumptions |
| Other/custom | 1+ | User-selected, adaptable | Flexible layout; no wedding as default |

## How template data should encode diversity

Reuse the shared type fields already present in `src/lib/templates/types.ts`:

- `category`: canonical event ID.
- `palette`: palette for the invitation preview only.
- `fonts`: a combination appropriate to the event; script should remain optional.
- `liner` and `seal`: optional visual details; avoid forcing a seal into corporate or funeral layouts.
- `heroLayout`: pick the composition for the category; do not make every template `centered-portrait`.
- `supportedSections`: only show relevant sections. Funeral pages should emphasize schedule/venue/condolences, housewarming should emphasize address/directions, and corporate pages should prioritize agenda/location.
- `motionPreset`: a real implemented behavior in `EnvelopeRenderer`, not just a label.
- `sampleData.heroImage`: genuine category-specific imagery. Never use the first wedding image as the universal fallback.

## Gallery acceptance

- Every category shown in filters has at least one actual record.
- Housewarming cards show homes/architecture, not a couple and flowers.
- Graduation cards show caps, graduates, campus or certificate details.
- Birthday cards have a range of playful/bold and adult/milestone designs.
- Memorial and funeral are treated with dignity.
- No copy says “wedding” unless that template/event is a wedding.
- Images, description, palette and preview all agree with the selected category.
