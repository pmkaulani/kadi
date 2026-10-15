# QA matrix and visual release gate

## Commands to execute in repository root

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Record exact exit code, command output excerpt and any environment blocker. Test commands against actual installed dependencies on target machine. A command blocked due to native `esbuild`, Next SWC, missing env or network must be called **blocked**, not passed.

## Functional test matrix

### Draft/preview
- Edit each text field and verify visible guest preview within one frame.
- Change template, category, palette colors, heading/body font, letter style, envelope type/seal/liner, section visibility/order, photo, focal point, content block properties and animation settings.
- Select invited guest and verify correct salutation (individual/couple/family); switch guest without modifying draft.
- Test device toggles, replay, skip envelope, save draft, reload draft, publish, view published link.
- Confirm a preview RSVP never mutates the actual RSVP data; contribution preview never makes provider requests; preview analytics do not count as real guest visits.
- Simulate slow save + newer edit, failed save, retry and route change while save is pending. Never lose newer revision or falsely mark saved.

### Envelope/motion
- Each of six presets captured before open / seal pressed / flap open / card rising / final page.
- Open button works by pointer, Enter and Space; skip-to-details works; replay works; unmount cancels timers; reduced motion settles instantly/quickly.
- Funeral and memorial motion has no confetti/disco/party music. Other categories use selected preset and do not inherit default wedding ornamentation accidentally.

### Event/category content
- Visit each category filter and start a new invitation; chosen template and category remain compatible.
- Ensure categories with no template are not shown as if populated; don't fake missing content.
- Verify category defaults use the correct blocks and fields: funeral doesn't show gift registry by default, birthday doesn't show ceremony/reception as wedding fields, corporate has agenda/speakers/registration, housewarming has home details/address.

### Public guest behavior
- Published invitation accessible by correct slug/token; draft/archived access rules enforced.
- Countdown before/at/after date and event timezone.
- Valid `.ics` parse, daylight/time-zone, escape commas/semicolons/newlines; Google calendar URL encodes fields; memorial multiple services remain separate.
- Directions on Google and Apple Maps open correct location, multi-venue switch works.
- RSVP yes/no/maybe policy, required questions, household plus-one rules, errors, retries, double submit, token invalid/expired; confirmation is accurate.
- M-Pesa dev mode clearly says simulation; no false payment confirmation.
- Music only starts from user gesture; stop/pause exists; no autoplay audio.

### Security/data
- Cross-user event ownership tests, public RSVP rate limits/validation, no private guest fields leaked, event duplicate doesn't copy tokens/RSVP, CSV import reports bad rows and doesn't send messages.

### Visual and mobile
- screenshots at 320x568, 360x800, 375x667, 390x844, 430x932, 768x1024, 1024x768, 1280x800, 1440x900.
- landing hero complete within first viewport; full landing includes the below-fold sections; all major screens share consistent app shell.
- no horizontal overflow; images crop well and don't cause layout shifts; text readable; button targets reachable; no fixed menu overlap; keyboard focus remains visible.
- run normal motion and reduced motion, plus keyboard-only navigation.

## Screenshot comparison loop

1. Capture baseline before phase.
2. Implement one focused phase.
3. Capture target dimensions using the same route/state and content.
4. Compare against `reference/` for composition/hierarchy/scale/image focal placement, not just colour.
5. Write top 3 discrepancies and fix them; recapture.
6. Attach actual screenshots and state any dimension not available. Do not claim a screenshot was checked unless it exists.
