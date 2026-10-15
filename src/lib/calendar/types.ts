/**
 * Calendar event data structures supporting single and multi-event itineraries
 * (e.g. Ceremony + Reception, or Memorial Service + Burial).
 */

export interface CalendarEventDefinition {
  id?: string;
  uid?: string;
  title: string;
  description?: string;
  location?: string;
  venueName?: string;
  address?: string;
  city?: string;
  start: Date | string; // Date object or unambiguous ISO string
  end?: Date | string;   // Optional end time (defaults to start + 3 hours if omitted)
  timezone?: string;    // Defaults to 'Africa/Nairobi'
  url?: string;
  organizer?: {
    name: string;
    email?: string;
  };
  alarms?: Array<{
    trigger: string;     // e.g. '-P1D' (1 day before), '-PT1H' (1 hour before)
    description?: string;
  }>;
}

export interface CalendarExportOptions {
  calendarName?: string;
  timezone?: string;
}
