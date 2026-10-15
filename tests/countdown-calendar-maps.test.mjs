import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseEventDateTime,
  parseDateString,
  parseTimeString,
  calculateCountdown,
} from '../src/lib/countdown/timer.ts';

import {
  escapeIcsText,
  formatIcsDateTimeUtc,
  formatIcsDateTimeLocal,
  foldIcsLine,
  generateVTimeZone,
  generateVEvent,
  generateIcsCalendar,
} from '../src/lib/calendar/ics.ts';

import {
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  getYahooCalendarUrl,
  buildCalendarEventsFromEvent,
} from '../src/lib/calendar/links.ts';

import {
  getGoogleMapsDirectionsUrl,
  getAppleMapsDirectionsUrl,
  getPlatformDirectionsUrl,
  getSafeOpenStreetMapEmbedUrl,
  extractVenuesFromEvent,
  resolveCoordinates,
} from '../src/lib/maps/index.ts';

test('1. Datetime and Timezone Parsing (Unambiguous ISO & Kenyan Formats)', () => {
  // Test unambiguous ISO 8601 string
  const isoParsed = parseEventDateTime('2026-11-14T14:00:00+03:00');
  assert.equal(isoParsed.isValid, true);
  assert.equal(isoParsed.targetDate.toISOString(), '2026-11-14T11:00:00.000Z');

  // Test Kenyan standard text date + time in Africa/Nairobi (UTC+3)
  const nairobiParsed = parseEventDateTime('14 Nov 2026', '2:00 PM', 'Africa/Nairobi');
  assert.equal(nairobiParsed.isValid, true);
  // 14:00 EAT is 11:00 UTC
  assert.equal(nairobiParsed.targetDate.getUTCHours(), 11);
  assert.equal(nairobiParsed.targetDate.getUTCDate(), 14);
  assert.equal(nairobiParsed.targetDate.getUTCMonth(), 10); // November is index 10
  assert.equal(nairobiParsed.targetDate.getUTCFullYear(), 2026);

  // Test 12-hour AM/PM and 24-hour parsing
  const morningTime = parseTimeString('10:30 AM');
  assert.deepEqual(morningTime, { hours: 10, minutes: 30, seconds: 0 });

  const eveningTime = parseTimeString('07:45 PM');
  assert.deepEqual(eveningTime, { hours: 19, minutes: 45, seconds: 0 });

  const eatTime = parseTimeString('2:00 PM EAT');
  assert.deepEqual(eatTime, { hours: 14, minutes: 0, seconds: 0 });

  // Test various date formats
  assert.deepEqual(parseDateString('2026-12-25'), { year: 2026, month: 12, day: 25 });
  assert.deepEqual(parseDateString('Saturday, 14 November 2026'), { year: 2026, month: 11, day: 14 });
  assert.deepEqual(parseDateString('14/11/2026'), { year: 2026, month: 11, day: 14 });
});

test('2. Countdown State Transitions (Upcoming, Today is the day, and Passed)', () => {
  const targetDate = new Date('2026-11-14T11:00:00Z'); // 2:00 PM EAT

  // Case A: 5 days, 3 hours, 20 minutes, 15 seconds before event
  const fiveDaysBefore = new Date(
    targetDate.getTime() - (5 * 86400 + 3 * 3600 + 20 * 60 + 15) * 1000
  );
  const upcomingState = calculateCountdown(targetDate, fiveDaysBefore, {
    label: 'Counting down with joy',
  });
  assert.equal(upcomingState.status, 'upcoming');
  assert.equal(upcomingState.days, 5);
  assert.equal(upcomingState.hours, 3);
  assert.equal(upcomingState.minutes, 20);
  assert.equal(upcomingState.seconds, 15);
  assert.equal(upcomingState.label, 'Counting down with joy');

  // Case B: At event start moment (or 2 hours into event) -> 'today'
  const duringEvent = new Date(targetDate.getTime() + 2 * 3600 * 1000); // 2 hours after start
  const todayState = calculateCountdown(targetDate, duringEvent, {
    durationHours: 10,
    todayMessage: 'Today is the day!',
  });
  assert.equal(todayState.status, 'today');
  assert.equal(todayState.days, 0);
  assert.equal(todayState.hours, 0);
  assert.equal(todayState.message, 'Today is the day!');

  // Case C: After event duration passes -> 'passed'
  const afterEvent = new Date(targetDate.getTime() + 24 * 3600 * 1000); // 24 hours after start
  const passedState = calculateCountdown(targetDate, afterEvent, {
    durationHours: 10,
    passedMessage: 'This celebration has concluded.',
  });
  assert.equal(passedState.status, 'passed');
  assert.equal(passedState.message, 'This celebration has concluded.');
});

test('3. Calendar RFC 5545 Text Escaping & Line Folding', () => {
  // Test escaping of commas, semicolons, backslashes, and newlines
  const rawText = 'Welcome to Kevin & Wanjiku; celebrating in Nairobi, Kenya\\East Africa\nReception to follow.';
  const escaped = escapeIcsText(rawText);
  assert.equal(
    escaped,
    'Welcome to Kevin & Wanjiku\\; celebrating in Nairobi\\, Kenya\\\\East Africa\\nReception to follow.'
  );

  // Test RFC 5545 line folding (lines > 75 octets)
  const longLine = 'DESCRIPTION:This is a remarkably long event description that easily exceeds seventy-five octets as specified in the iCalendar RFC 5545 specification.';
  const folded = foldIcsLine(longLine);
  assert.ok(folded.includes('\r\n '));
  const splitLines = folded.split('\r\n');
  assert.ok(splitLines[0].length <= 75);
  assert.ok(splitLines[1].startsWith(' '));
});

test('4. Calendar .ics Generation (VTIMEZONE, DTSTART, DTEND, VALARM reminders)', () => {
  const event = {
    title: 'Kevin & Wanjiku Wedding',
    description: 'Ceremony and evening reception.',
    location: 'Safari Park Hotel, Thika Road, Nairobi',
    start: '2026-11-14T14:00:00+03:00',
    end: '2026-11-14T20:00:00+03:00',
    timezone: 'Africa/Nairobi',
    url: 'https://kadi.africa/e/kevin-and-wanjiku',
  };

  const ics = generateIcsCalendar(event);

  // Check RFC 5545 mandatory headers
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('VERSION:2.0'));
  assert.ok(ics.includes('PRODID:-//Kadi Africa//Kadi Invitation Suite//EN'));
  assert.ok(ics.includes('END:VCALENDAR'));

  // Check VTIMEZONE for Africa/Nairobi (UTC+3, no DST)
  assert.ok(ics.includes('BEGIN:VTIMEZONE'));
  assert.ok(ics.includes('TZID:Africa/Nairobi'));
  assert.ok(ics.includes('TZOFFSETFROM:+0300'));
  assert.ok(ics.includes('TZOFFSETTO:+0300'));
  assert.ok(ics.includes('TZNAME:EAT'));

  // Check VEVENT headers
  assert.ok(ics.includes('BEGIN:VEVENT'));
  assert.ok(ics.includes('SUMMARY:Kevin & Wanjiku Wedding'));
  assert.ok(ics.includes('LOCATION:Safari Park Hotel\\, Thika Road\\, Nairobi'));
  assert.ok(ics.includes('STATUS:CONFIRMED'));
  assert.ok(ics.includes('URL:https://kadi.africa/e/kevin-and-wanjiku'));

  // Check VALARMs (1 day before and 1 hour before)
  assert.ok(ics.includes('TRIGGER:-P1D'));
  assert.ok(ics.includes('TRIGGER:-PT1H'));
  assert.ok(ics.includes('ACTION:DISPLAY'));
});

test('5. Multi-Event .ics Calendar (Separate Ceremony & Reception / Service & Burial)', () => {
  // A wedding with ceremony at All Saints Cathedral and reception at Safari Park Hotel
  const multiEvents = [
    {
      title: 'Wedding Ceremony: Kevin & Wanjiku',
      location: 'All Saints Cathedral, Kenyatta Avenue, Nairobi',
      start: '2026-11-14T10:00:00+03:00',
      end: '2026-11-14T12:30:00+03:00',
      timezone: 'Africa/Nairobi',
    },
    {
      title: 'Wedding Reception: Kevin & Wanjiku',
      location: 'Safari Park Hotel, Thika Road, Nairobi',
      start: '2026-11-14T14:00:00+03:00',
      end: '2026-11-14T21:00:00+03:00',
      timezone: 'Africa/Nairobi',
    },
  ];

  const ics = generateIcsCalendar(multiEvents, { calendarName: 'Kevin & Wanjiku Itinerary' });

  // Count VEVENT blocks in output
  const veventStarts = (ics.match(/BEGIN:VEVENT/g) || []).length;
  const veventEnds = (ics.match(/END:VEVENT/g) || []).length;

  assert.equal(veventStarts, 2);
  assert.equal(veventEnds, 2);
  assert.ok(ics.includes('Wedding Ceremony: Kevin & Wanjiku'));
  assert.ok(ics.includes('Wedding Reception: Kevin & Wanjiku'));
  assert.ok(ics.includes('All Saints Cathedral'));
  assert.ok(ics.includes('Safari Park Hotel'));
});

test('6. Web Calendar Links (Google, Outlook, Yahoo) URL Generation', () => {
  const event = {
    title: 'Wanjiku Birthday Gala',
    description: 'Dinner and dancing celebrating Wanjiku.',
    location: 'Windsor Golf Hotel, Nairobi',
    start: new Date('2026-11-14T16:00:00Z'),
    end: new Date('2026-11-14T20:00:00Z'),
    timezone: 'Africa/Nairobi',
  };

  // Google Calendar URL
  const googleUrl = getGoogleCalendarUrl(event);
  assert.ok(googleUrl.startsWith('https://calendar.google.com/calendar/render?'));
  assert.ok(googleUrl.includes('action=TEMPLATE'));
  assert.ok(googleUrl.includes('text=Wanjiku+Birthday+Gala'));
  assert.ok(googleUrl.includes('ctz=Africa%2FNairobi'));
  assert.ok(googleUrl.includes('location=Windsor+Golf+Hotel%2C+Nairobi'));

  // Outlook Calendar URL
  const outlookUrl = getOutlookCalendarUrl(event);
  assert.ok(outlookUrl.startsWith('https://outlook.live.com/calendar/0/deeplink/compose?'));
  assert.ok(outlookUrl.includes('subject=Wanjiku+Birthday+Gala'));
  assert.ok(outlookUrl.includes('location=Windsor+Golf+Hotel%2C+Nairobi'));

  // Yahoo Calendar URL
  const yahooUrl = getYahooCalendarUrl(event);
  assert.ok(yahooUrl.startsWith('https://calendar.yahoo.com/?'));
  assert.ok(yahooUrl.includes('v=60'));
  assert.ok(yahooUrl.includes('title=Wanjiku+Birthday+Gala'));
});

test('7. Multi-Venue Extraction from EventEntity', () => {
  // Test wedding event with distinct ceremony & reception details
  const weddingEvent = {
    id: 'wedding-1',
    category: 'wedding',
    title: 'Kevin & Wanjiku Wedding',
    date: '2026-11-14',
    time: '10:00 AM',
    city: 'Nairobi, Kenya',
    ceremonyDetails: {
      name: 'All Saints Cathedral',
      address: 'Kenyatta Avenue, Nairobi',
      time: '10:00 AM',
    },
    receptionDetails: {
      name: 'Safari Park Hotel',
      address: 'Thika Road, Nairobi',
      time: '2:00 PM',
    },
  };

  const venues = extractVenuesFromEvent(weddingEvent);
  assert.equal(venues.length, 2);
  assert.equal(venues[0].label, 'Ceremony Venue');
  assert.equal(venues[0].venueName, 'All Saints Cathedral');
  assert.equal(venues[1].label, 'Reception Venue');
  assert.equal(venues[1].venueName, 'Safari Park Hotel');

  // Verify coordinates resolved for known landmarks
  assert.ok(typeof venues[0].latitude === 'number');
  assert.ok(typeof venues[1].latitude === 'number');

  // Test memorial event with service & burial
  const memorialEvent = {
    id: 'memorial-1',
    category: 'funeral',
    title: 'Memorial of Mzee Jomo',
    city: 'Nairobi',
    memorialServices: [
      {
        name: 'Consolata Shrine Mass',
        venue: 'Consolata Shrine, Westlands',
        address: 'Westlands, Nairobi',
        time: '10:00 AM',
        type: 'service',
      },
      {
        name: 'Graveside Interment',
        venue: 'Langata Cemetery',
        address: 'Langata, Nairobi',
        time: '2:30 PM',
        type: 'burial',
      },
    ],
  };

  const memorialVenues = extractVenuesFromEvent(memorialEvent);
  assert.equal(memorialVenues.length, 2);
  assert.equal(memorialVenues[0].venueName, 'Consolata Shrine, Westlands');
  assert.equal(memorialVenues[1].label, 'Graveside Burial');
});

test('8. Directions URLs and Safe OpenStreetMap Embed', () => {
  const loc = {
    venueName: 'Safari Park Hotel',
    address: 'Thika Road',
    city: 'Nairobi, Kenya',
    latitude: -1.2185,
    longitude: 36.8837,
  };

  const googleDir = getGoogleMapsDirectionsUrl(loc);
  assert.ok(googleDir.includes('maps/dir/?api=1&destination=-1.2185,36.8837'));

  const appleDir = getAppleMapsDirectionsUrl(loc);
  assert.ok(appleDir.includes('maps.apple.com/?daddr=-1.2185,36.8837'));

  // Safe OpenStreetMap embed without API keys
  const osmEmbed = getSafeOpenStreetMapEmbedUrl(loc.latitude, loc.longitude);
  assert.ok(osmEmbed.startsWith('https://www.openstreetmap.org/export/embed.html?'));
  assert.ok(osmEmbed.includes('marker=-1.2185%2C36.8837'));
  assert.ok(osmEmbed.includes('layer=mapnik'));
});

test('9. Graceful Handling of Empty or Missing Venues', () => {
  const emptyEvent = {
    id: 'draft-no-venue',
    title: 'Intimate Gathering',
    venue: '',
    address: '',
    city: '',
  };

  const emptyVenues = extractVenuesFromEvent(emptyEvent);
  assert.deepEqual(emptyVenues, []);

  // Empty coordinates resolve to null without errors
  const noCoords = resolveCoordinates('', '');
  assert.equal(noCoords, null);
});
