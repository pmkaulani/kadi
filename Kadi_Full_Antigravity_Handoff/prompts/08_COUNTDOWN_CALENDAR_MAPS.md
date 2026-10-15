# Phase 08 — countdown, calendar and venue maps

## Countdown
- Update every second with a clean interval that is cleaned up on unmount and avoid server/client hydration mismatch; use client-side ticking after initial render.
- Use event timezone (usually `Africa/Nairobi` for Kenya-based local time, but don't force EAT if event data specifies another zone). Store an unambiguous ISO start datetime/timezone; date and time must not be parsed with ambiguous locale strings.
- Display days, hours, minutes and seconds; on start day use configurable “Today is the day!”; after event passes use “This event has passed.”
- Optional digit flip is subtle, only animates changed digits and respects reduced motion. Countdown label is a custom block field.

## Calendar
- Generate an actual `.ics` download offline from a valid event config. Correctly escape backslash, semicolon, comma and newline; include DTSTART/DTEND in valid format with TZID/VTIMEZONE where appropriate, unique UID, DTSTAMP, summary, description, location and VALARM reminders 1 day/1 hour before. Test timezones and DST cases even though Kenya generally has no DST.
- Provide a Google Calendar URL with URL-encoded fields and timezone. If Outlook/Yahoo links are provided, ensure they work; don't use inert dropdown options.
- For funeral/memorial events with service and burial different times/locations, create separate events or a multi-event .ics calendar. Never combine two geographically separate service and burial moments into one inaccurate event.

## Map
- Use valid event-stored maps URLs/coordinates. Provide Get Directions, Open in Google Maps and Open in Apple Maps. Native links should work on mobile. For multiple locations use a clearly labelled switch between actual ceremony/reception/service/burial venues.
- An embedded map requires a real provider integration or safe embed URL; no placeholder image should be called an interactive map. Do not expose provider secret keys. If no map provider is configured, use address card + external directions links.

**Acceptance:** unit tests before/at/after countdown, calendar `.ics` format/date/time and multiple-service output; map directions produce the expected encoded location; disabled/missing venue handled gracefully.
