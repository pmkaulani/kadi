export interface CalendarEventInput {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  /** IANA zone, e.g. Africa/Nairobi. Displaying EAT is not a substitute for storing the zone. */
  timeZone: string;
  uid?: string;
}

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function toUtcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

/** Basic UTC ICS builder starter. For production local-time calendars, extend with a tested TZID/VTIMEZONE strategy. */
export function buildIcs(event: CalendarEventInput): string {
  if (!Number.isFinite(event.start.getTime()) || !Number.isFinite(event.end.getTime())) {
    throw new Error('Calendar start and end must be valid dates.');
  }
  if (event.end <= event.start) throw new Error('Calendar end must be after start.');
  const uid = event.uid || `${crypto.randomUUID()}@kadi`;
  const now = toUtcStamp(new Date());
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kadi//Invitation//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', `UID:${escapeIcs(uid)}`, `DTSTAMP:${now}`,
    `DTSTART:${toUtcStamp(event.start)}`, `DTEND:${toUtcStamp(event.end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    ...(event.description ? [`DESCRIPTION:${escapeIcs(event.description)}`] : []),
    ...(event.location ? [`LOCATION:${escapeIcs(event.location)}`] : []),
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${escapeIcs(event.title)}`, 'END:VALARM',
    'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', `DESCRIPTION:${escapeIcs(event.title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', '',
  ];
  // RFC 5545 requires CRLF and line folding for long lines. Add compliant folding before production use.
  return lines.join('\r\n');
}

export function downloadIcs(event: CalendarEventInput, filename = 'kadi-invitation.ics') {
  const blob = new Blob([buildIcs(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function googleCalendarUrl(event: CalendarEventInput): string {
  const fmt = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const query = new URLSearchParams({
    action: 'TEMPLATE', text: event.title,
    dates: `${fmt(event.start)}/${fmt(event.end)}`,
    details: event.description || '', location: event.location || '', ctz: event.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${query.toString()}`;
}

// IMPORTANT: This snippet intentionally uses UTC stamps so it does not invent local offsets.
// Before production, confirm user-local event date semantics and add a real timezone-aware
// formatter/VTIMEZONE as needed. For a memorial, create separate CalendarEventInput items for
// service and burial locations rather than merging them into one event.
