# Visual and interaction acceptance checklist

## Screens to capture

- Landing page, top viewport and full long page
- Workspace home
- Template catalogue using Wedding, Birthday, Graduation, Housewarming, Funeral, Memorial, Corporate
- New event wizard with preview pane
- Existing event studio editor
- Public published event page
- RSVP success state
- Login / sign-up / recovery routes

## Required viewports

- Desktop 1440×900
- Laptop 1280×800
- Tablet 1024×768
- Phone 390×844
- Short phone 375×667
- Landscape 844×390

## Preview parity field checks

Change one at a time and confirm both the phone preview and guest page:

- Title
- Hosts and celebrant names
- Date / time / timezone
- Venue / city / address
- Hero image and focal point
- Primary/accent/background colors
- Heading/body font pairing
- Envelope construction / seal / liner
- Printed vs handwritten vs folded-card letter
- Guest name (single person and couple/household)
- Visible section order and disabled section
- RSVP deadline / plus-one policy
- Theme/background animation and scroll animation if exposed

Check no RSVP API mutation fires from preview. Confirm Save Draft persists and reports truthful result. Confirm a draft slug cannot be opened publicly.

## Design targets

- Landing hero headline, CTA and focal image fully visible without scrolling just to reach them.
- Above-fold hero works in 375×667 without overlaying or clipping the CTA.
- Long landing page continues with categories, featured templates, host/guest value, local context, FAQ and CTA.
- Non-wedding categories don't all inherit floral ornaments, candles and wax.
- Memorial/funeral remains respectful and low-motion by default.
- Mobile does not shrink a 2-column editor until text becomes unreadable: use Edit/Preview switching or meaningful stacked layout.
- Each app screen shares the same typography, surfaces, buttons, navigation and spacing system.
