import type { CalendarEventDefinition } from './types';
import type { EventEntity } from '../db/types';
import { parseEventDateTime } from '../countdown/timer';
import { formatIcsDateTimeUtc } from './ics';

/**
 * Generates an active, working Google Calendar event creation URL.
 */
export function getGoogleCalendarUrl(event: CalendarEventDefinition): string {
  const timezone = event.timezone || 'Africa/Nairobi';
  const parsedStart =
    event.start instanceof Date
      ? event.start
      : parseEventDateTime(event.start, undefined, timezone).targetDate;
  const parsedEnd = event.end
    ? event.end instanceof Date
      ? event.end
      : parseEventDateTime(event.end, undefined, timezone).targetDate
    : new Date(parsedStart.getTime() + 3 * 3600 * 1000);

  const startUtc = formatIcsDateTimeUtc(parsedStart);
  const endUtc = formatIcsDateTimeUtc(parsedEnd);

  const location =
    event.location ||
    [event.venueName, event.address, event.city].filter(Boolean).join(', ');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startUtc}/${endUtc}`,
    details: event.description || 'Invitation via Kadi (kadi.africa)',
    location,
    ctz: timezone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an active, working Microsoft Outlook Web calendar link.
 */
export function getOutlookCalendarUrl(event: CalendarEventDefinition): string {
  const timezone = event.timezone || 'Africa/Nairobi';
  const parsedStart =
    event.start instanceof Date
      ? event.start
      : parseEventDateTime(event.start, undefined, timezone).targetDate;
  const parsedEnd = event.end
    ? event.end instanceof Date
      ? event.end
      : parseEventDateTime(event.end, undefined, timezone).targetDate
    : new Date(parsedStart.getTime() + 3 * 3600 * 1000);

  const location =
    event.location ||
    [event.venueName, event.address, event.city].filter(Boolean).join(', ');

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: parsedStart.toISOString(),
    enddt: parsedEnd.toISOString(),
    body: event.description || 'Invitation via Kadi (kadi.africa)',
    location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generates an active, working Yahoo Calendar creation link.
 */
export function getYahooCalendarUrl(event: CalendarEventDefinition): string {
  const timezone = event.timezone || 'Africa/Nairobi';
  const parsedStart =
    event.start instanceof Date
      ? event.start
      : parseEventDateTime(event.start, undefined, timezone).targetDate;
  const parsedEnd = event.end
    ? event.end instanceof Date
      ? event.end
      : parseEventDateTime(event.end, undefined, timezone).targetDate
    : new Date(parsedStart.getTime() + 3 * 3600 * 1000);

  const startUtc = formatIcsDateTimeUtc(parsedStart);
  const endUtc = formatIcsDateTimeUtc(parsedEnd);

  const location =
    event.location ||
    [event.venueName, event.address, event.city].filter(Boolean).join(', ');

  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    st: startUtc,
    et: endUtc,
    desc: event.description || 'Invitation via Kadi (kadi.africa)',
    in_loc: location,
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

/**
 * Triggers an offline browser download of an .ics calendar file.
 */
export function downloadIcsFile(filename: string, icsContent: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}

/**
 * Maps a domain EventEntity into one or more CalendarEventDefinition instances.
 * Crucial Kenyan context:
 * - If a wedding has both ceremony and reception with distinct times/locations, returns 2 distinct events.
 * - If a memorial/funeral has multiple services (e.g. church service + graveside burial), returns distinct events.
 * - Never combines two geographically separate moments into one inaccurate event.
 */
export function buildCalendarEventsFromEvent(event: Partial<EventEntity>): CalendarEventDefinition[] {
  const timezone = event.timezone || 'Africa/Nairobi';
  const baseDate = event.date || '2026-11-14';

  // 1. Memorial / Funeral with distinct services (Church Service, Viewing, Burial)
  if (
    (event.category === 'memorial' || event.category === 'funeral') &&
    event.memorialServices &&
    event.memorialServices.length > 0
  ) {
    return event.memorialServices.map((service, idx) => {
      const serviceDate = service.date || baseDate;
      const parsedStart = parseEventDateTime(serviceDate, service.time, timezone).targetDate;
      const parsedEnd = new Date(parsedStart.getTime() + 2.5 * 3600 * 1000); // 2.5 hours per service

      return {
        id: `${event.id || 'event'}-service-${idx + 1}`,
        title: `${service.name} — ${event.title || 'Memorial'}`,
        description: `Part of the memorial for ${event.celebrants || event.title}. ${service.type.toUpperCase()}: ${service.name}`,
        location: [service.venue, service.address, event.city].filter(Boolean).join(', '),
        venueName: service.venue,
        address: service.address,
        city: event.city,
        start: parsedStart,
        end: parsedEnd,
        timezone,
        url: event.slug ? `https://kadi.africa/e/${event.slug}` : undefined,
      };
    });
  }

  // 2. Wedding with distinct Ceremony and Reception details
  if (
    event.category === 'wedding' &&
    event.ceremonyDetails?.name &&
    event.receptionDetails?.name &&
    (event.ceremonyDetails.address !== event.receptionDetails.address ||
      event.ceremonyDetails.name !== event.receptionDetails.name)
  ) {
    const ceremonyStart = parseEventDateTime(baseDate, event.ceremonyDetails.time || event.time || '10:00 AM', timezone).targetDate;
    const ceremonyEnd = new Date(ceremonyStart.getTime() + 2 * 3600 * 1000); // 2h ceremony

    const receptionStart = parseEventDateTime(baseDate, event.receptionDetails.time || '2:00 PM', timezone).targetDate;
    const receptionEnd = new Date(receptionStart.getTime() + 5 * 3600 * 1000); // 5h reception

    return [
      {
        id: `${event.id || 'event'}-ceremony`,
        title: `Wedding Ceremony: ${event.celebrants || event.title}`,
        description: `Ceremony for ${event.celebrants || event.title}. Followed by reception at ${event.receptionDetails.name}.`,
        location: [event.ceremonyDetails.name, event.ceremonyDetails.address, event.city].filter(Boolean).join(', '),
        venueName: event.ceremonyDetails.name,
        address: event.ceremonyDetails.address,
        city: event.city,
        start: ceremonyStart,
        end: ceremonyEnd,
        timezone,
        url: event.slug ? `https://kadi.africa/e/${event.slug}` : undefined,
      },
      {
        id: `${event.id || 'event'}-reception`,
        title: `Wedding Reception: ${event.celebrants || event.title}`,
        description: `Evening banquet and reception celebrating ${event.celebrants || event.title}.`,
        location: [event.receptionDetails.name, event.receptionDetails.address, event.city].filter(Boolean).join(', '),
        venueName: event.receptionDetails.name,
        address: event.receptionDetails.address,
        city: event.city,
        start: receptionStart,
        end: receptionEnd,
        timezone,
        url: event.slug ? `https://kadi.africa/e/${event.slug}` : undefined,
      },
    ];
  }

  // 3. Standard Single Event
  const parsedStart = parseEventDateTime(baseDate, event.time || '2:00 PM', timezone).targetDate;
  const parsedEnd = new Date(parsedStart.getTime() + 4 * 3600 * 1000); // 4 hours duration

  return [
    {
      id: event.id || 'event-primary',
      title: event.title || 'Celebration',
      description: event.story
        ? `${event.title} — ${event.story}`
        : `You are cordially invited to celebrate ${event.celebrants || event.title}.`,
      location: [event.venue, event.address, event.city].filter(Boolean).join(', '),
      venueName: event.venue,
      address: event.address,
      city: event.city,
      start: parsedStart,
      end: parsedEnd,
      timezone,
      url: event.slug ? `https://kadi.africa/e/${event.slug}` : undefined,
      organizer: event.hosts ? { name: event.hosts } : undefined,
    },
  ];
}
