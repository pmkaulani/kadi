# Kadi — Canonical Category Coverage Report

**Generated Date:** October 2026  
**Audited Catalogue:** [`src/lib/templates/catalogue.ts`](file:///c:/Users/STD%20USER/Desktop/work/kadi/src/lib/templates/catalogue.ts)  
**Canonical Category Definition:** [`src/lib/events/categories.ts`](file:///c:/Users/STD%20USER/Desktop/work/kadi/src/lib/events/categories.ts)  
**Total Canonical Categories:** 23  
**Covered Canonical Categories:** 23 (100% coverage)  
**Total Template Definitions:** 39  

---

## 1. Executive Summary

All 23 canonical event categories defined in the Kadi product architecture have dedicated, art-directed stationery suites. No category lacks an authentic template, and no category falls back quietly to a generic wedding invitation.

Every template definition includes:
- Canonical `category` key
- Semantic `version`
- Context-appropriate `palette` (primary, secondary, accent, background, cardBackground, text, textMuted, envelope, flap, seal, sealIconColor)
- Typography pairing (`fonts.heading`, `fonts.body`, and optional `script`)
- Distinct `heroLayout` (`centered-portrait`, `editorial-split`, `arch-window`, `cinematic-landscape`, `minimalist`)
- Motion preset adhering to occasion emotional boundaries (e.g. `dignified-memorial` and `funeral-service` strictly forbid celebratory confetti or disco motion)
- Category-appropriate default sections (`supportedSections`)
- Sample invitation copy set in authentic Kenyan venues (Nairobi, Karen, Tigoni, Limuru, Kilimani, Ridgeways, Runda)

---

## 2. Category Breakdown & Template Inventory

| # | Canonical Category ID | Category Label | Template Count | Template IDs | Hero Layout | Motion Preset | Default Starter |
|---|---|---|:---:|---|---|---|---|
| 1 | `wedding` | Weddings | 3 | `savannah-twilight`, `coastal-romance`, `sage-love-letter` | `centered-portrait`, `cinematic-landscape`, `arch-window` | `classic-stationery`, `cinematic`, `floral-romance` | `savannah-twilight` |
| 2 | `engagement` | Engagements | 1 | `twilight-toast` | `arch-window` | `floral-romance` | `twilight-toast` |
| 3 | `anniversary` | Anniversaries | 2 | `golden-legacy`, `silver-memories` | `centered-portrait`, `editorial-split` | `classic-stationery`, `modern-editorial` | `golden-legacy` |
| 4 | `birthday` | Birthdays | 6 | `milestone-gold`, `ruby-disco-birthday`, `these-are-for-you`, `pastel-garden-birthday`, `birthday-color-pop`, `golden-soiree` | `centered-portrait`, `editorial-split`, `arch-window` | `birthday-playful`, `modern-editorial` | `milestone-gold` |
| 5 | `graduation` | Graduations | 3 | `summit-of-honor`, `future-in-gold`, `laurel-achievement` | `editorial-split`, `centered-portrait` | `graduation` | `summit-of-honor` |
| 6 | `housewarming` | Housewarmings | 3 | `first-home-botanical`, `new-address-modern`, `terrace-open-house` | `editorial-split`, `cinematic-landscape` | `home-warming` | `first-home-botanical` |
| 7 | `memorial` | Memorials | 2 | `everlasting-peace`, `serene-meadow` | `centered-portrait`, `minimalist` | `dignified-memorial` (strictly non-celebratory) | `everlasting-peace` |
| 8 | `funeral` | Funeral services | 2 | `quiet-remembrance`, `dignified-passage` | `centered-portrait`, `minimalist` | `funeral-service` (dignified service-first) | `quiet-remembrance` |
| 9 | `baby-shower` | Baby showers | 2 | `sweet-beginnings`, `lullaby-stars` | `arch-window`, `centered-portrait` | `baby-shower` | `sweet-beginnings` |
| 10 | `bridal-shower` | Bridal showers | 1 | `blush-bridal-brunch` | `arch-window` | `floral-romance` | `blush-bridal-brunch` |
| 11 | `corporate` | Corporate events | 2 | `summit-executive`, `modern-keynote` | `minimalist`, `editorial-split` | `corporate`, `corporate-minimal` | `summit-executive` |
| 12 | `holiday` | Holiday parties | 1 | `festive-lumiere` | `centered-portrait` | `holiday-celebration` | `festive-lumiere` |
| 13 | `reunion` | Reunions | 1 | `nostalgic-alumni-reunion` | `editorial-split` | `modern-editorial` | `nostalgic-alumni-reunion` |
| 14 | `religious-milestone` | Religious milestones | 1 | `sacred-light-milestone` | `centered-portrait` | `classic-stationery` | `sacred-light-milestone` |
| 15 | `cultural-celebration` | Cultural celebrations | 1 | `harambee-cultural-night` | `editorial-split` | `cultural-celebration` | `harambee-cultural-night` |
| 16 | `retirement` | Retirement | 1 | `golden-horizon-retirement` | `centered-portrait` | `classic-stationery` | `golden-horizon-retirement` |
| 17 | `product-launch` | Product launches | 1 | `nexus-product-unveil` | `cinematic-landscape` | `product-launch` | `nexus-product-unveil` |
| 18 | `fundraiser` | Fundraisers | 1 | `beacon-of-hope-gala` | `minimalist` | `corporate-minimal` | `beacon-of-hope-gala` |
| 19 | `community` | Community events | 1 | `harvest-table` | `cinematic-landscape` | `modern-editorial` | `harvest-table` |
| 20 | `welcome-baby` | Welcome baby | 1 | `tender-welcome-baby` | `arch-window` | `baby-shower` | `tender-welcome-baby` |
| 21 | `farewell` | Farewell gatherings | 1 | `bon-voyage-safari` | `editorial-split` | `modern-editorial` | `bon-voyage-safari` |
| 22 | `get-well` | Get-well wishes | 1 | `gentle-healing-wishes` | `minimalist` | `classic-stationery` | `gentle-healing-wishes` |
| 23 | `custom` | Other occasions | 1 | `bespoke-gathering` | `editorial-split` | `modern-editorial` | `bespoke-gathering` |

---

## 3. Motion & Emotional Safety Auditing

A key architectural mandate is that solemn and service-first occasions never inherit celebratory, playful, or particle-heavy motion:
- **`memorial` templates** (`everlasting-peace`, `serene-meadow`): strictly set to `dignified-memorial`. Unit tests enforce that neither ever uses `birthday-playful`.
- **`funeral` templates** (`quiet-remembrance`, `dignified-passage`): strictly set to `funeral-service` or dignified fades with focus on venue, schedule, and condolences.
- **`birthday` templates** (`milestone-gold`, `ruby-disco-birthday`, etc.): set to `birthday-playful` or `modern-editorial` with age reveals and optional party effects.
- **`corporate` and `product-launch` templates**: strictly omit wax seals and script fonts where inappropriate; set to `corporate-minimal` or `product-launch`.

---

## 4. Test Suite Coverage

Automated test in `tests/template-compatibility.test.mjs`:
- Verified `assert.ok(TEMPLATES.length >= 24)` -> **39 templates present**.
- Verified all 23 canonical categories in `EVENT_CATEGORY_IDS` have at least 1 template -> **100% pass**.
- Verified memorial motion constraints -> **100% pass**.
- Verified video-reference invitation worlds exist -> **100% pass**.
