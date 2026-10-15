import type { CalendarEventDefinition, CalendarExportOptions } from './types';
import { parseEventDateTime } from '../countdown/timer';

/**
 * Escapes characters according to iCalendar RFC 5545 (Section 3.3.11):
 * - Backslash (\) -> \\
 * - Semicolon (;) -> \;
 * - Comma (,) -> \,
 * - Newline (\n) -> \n
 */
export function escapeIcsText(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Formats a Date object into UTC iCalendar format: YYYYMMDDTHHMMSSZ
 */
export function formatIcsDateTimeUtc(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Formats a Date object into local datetime string: YYYYMMDDTHHMMSS
 */
export function formatIcsDateTimeLocal(date: Date, offsetHours = 3): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  // Shift UTC time by offset to get local components
  const localMs = date.getTime() + offsetHours * 3600 * 1000;
  const localDate = new Date(localMs);

  const year = localDate.getUTCFullYear();
  const month = pad(localDate.getUTCMonth() + 1);
  const day = pad(localDate.getUTCDate());
  const hours = pad(localDate.getUTCHours());
  const minutes = pad(localDate.getUTCMinutes());
  const seconds = pad(localDate.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * RFC 5545 line folding: folds lines exceeding 75 octets by inserting CRLF + space.
 */
export function foldIcsLine(line: string): string {
  if (line.length <= 75) return line;

  let folded = '';
  let remaining = line;

  // First line can be up to 75 characters
  folded += remaining.slice(0, 75) + '\r\n';
  remaining = remaining.slice(75);

  // Subsequent lines can have 74 characters (since prefixed by space)
  while (remaining.length > 74) {
    folded += ' ' + remaining.slice(0, 74) + '\r\n';
    remaining = remaining.slice(74);
  }

  if (remaining.length > 0) {
    folded += ' ' + remaining;
  }

  return folded;
}

/**
 * Generates VTIMEZONE definition. Africa/Nairobi is UTC+3 with no DST.
 */
export function generateVTimeZone(timezone = 'Africa/Nairobi'): string[] {
  if (timezone === 'Africa/Nairobi' || timezone === 'EAT') {
    return [
      'BEGIN:VTIMEZONE',
      'TZID:Africa/Nairobi',
      'LAST-MODIFIED:20240101T000000Z',
      'TZURL:http://tzurl.org/zoneinfo-outlook/Africa/Nairobi',
      'X-LIC-LOCATION:Africa/Nairobi',
      'BEGIN:STANDARD',
      'TZNAME:EAT',
      'TZOFFSETFROM:+0300',
      'TZOFFSETTO:+0300',
      'DTSTART:19700101T000000',
      'END:STANDARD',
      'END:VTIMEZONE',
    ];
  }

  // Generic UTC VTIMEZONE
  return [
    'BEGIN:VTIMEZONE',
    `TZID:${timezone}`,
    'BEGIN:STANDARD',
    'TZNAME:UTC',
    'TZOFFSETFROM:+0000',
    'TZOFFSETTO:+0000',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
  ];
}

/**
 * Converts a start/end date input to a valid Date object.
 */
function resolveDate(val: Date | string, timezone = 'Africa/Nairobi'): Date {
  if (val instanceof Date) return val;
  const parsed = parseEventDateTime(val, undefined, timezone);
  if (parsed.isValid) return parsed.targetDate;
  const fallback = new Date(val);
  return isNaN(fallback.getTime()) ? new Date() : fallback;
}

/**
 * Generates a VEVENT component for a single calendar event.
 */
export function generateVEvent(event: CalendarEventDefinition, index = 0): string[] {
  const timezone = event.timezone || 'Africa/Nairobi';
  const startDate = resolveDate(event.start, timezone);
  const endDate = event.end
    ? resolveDate(event.end, timezone)
    : new Date(startDate.getTime() + 3 * 3600 * 1000); // Default 3 hours

  const now = new Date();
  const dtstamp = formatIcsDateTimeUtc(now);
  const uid =
    event.uid ||
    event.id ||
    `kadi-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}@kadi.africa`;

  const offsetHours = timezone === 'Africa/Nairobi' || timezone === 'EAT' ? 3 : 0;
  const dtstart = `TZID=${timezone}:${formatIcsDateTimeLocal(startDate, offsetHours)}`;
  const dtend = `TZID=${timezone}:${formatIcsDateTimeLocal(endDate, offsetHours)}`;

  const location =
    event.location ||
    [event.venueName, event.address, event.city].filter(Boolean).join(', ') ||
    'Location to be announced';

  const lines: string[] = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;${dtstart}`,
    `DTEND;${dtend}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description || 'Invitation via Kadi (kadi.africa)')}`,
    `LOCATION:${escapeIcsText(location)}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
  ];

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  if (event.organizer?.name) {
    lines.push(
      `ORGANIZER;CN=${escapeIcsText(event.organizer.name)}:mailto:${event.organizer.email || 'noreply@kadi.africa'}`
    );
  }

  // Reminders / VALARMs
  const alarms = event.alarms || [
    { trigger: '-P1D', description: `Reminder: ${event.title} is tomorrow` },
    { trigger: '-PT1H', description: `Reminder: ${event.title} begins in 1 hour` },
  ];

  for (const alarm of alarms) {
    lines.push(
      'BEGIN:VALARM',
      `TRIGGER:${alarm.trigger}`,
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcsText(alarm.description || event.title)}`,
      'END:VALARM'
    );
  }

  lines.push('END:VEVENT');
  return lines;
}

/**
 * Generates an RFC 5545 compliant .ics calendar string.
 * Supports single event or multi-event itineraries (e.g. Ceremony and Reception as distinct VEVENTs).
 */
export function generateIcsCalendar(
  events: CalendarEventDefinition | CalendarEventDefinition[],
  options: CalendarExportOptions = {}
): string {
  const eventList = Array.isArray(events) ? events : [events];
  const timezone = options.timezone || eventList[0]?.timezone || 'Africa/Nairobi';
  const calName = options.calendarName || (eventList.length === 1 ? eventList[0].title : 'Kadi Invitation');

  const rawLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kadi Africa//Kadi Invitation Suite//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calName)}`,
    `X-WR-TIMEZONE:${timezone}`,
    ...generateVTimeZone(timezone),
  ];

  eventList.forEach((ev, idx) => {
    rawLines.push(...generateVEvent(ev, idx));
  });

  rawLines.push('END:VCALENDAR');

  // Apply RFC 5545 line folding and join with CRLF
  return rawLines.map(foldIcsLine).join('\r\n') + '\r\n';
}
