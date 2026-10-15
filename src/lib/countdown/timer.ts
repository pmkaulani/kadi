/**
 * Precise, timezone-aware countdown calculation and unambiguous datetime parsing.
 * Supports Africa/Nairobi (UTC+3) and arbitrary IANA timezones without ambiguous locale parsing bugs.
 */

export interface ParsedEventDateTime {
  targetDate: Date;
  isoString: string;
  isValid: boolean;
  timezone: string;
}

export interface CountdownState {
  status: 'upcoming' | 'today' | 'passed';
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSecondsRemaining: number;
  label: string;
  message: string;
}

export interface CountdownOptions {
  durationHours?: number;
  label?: string;
  todayMessage?: string;
  passedMessage?: string;
}

/**
 * Standard IANA timezone offsets in hours (fixed standard offsets).
 * Kenya (Africa/Nairobi) is strictly UTC+3 all year round (no DST).
 */
const COMMON_TIMEZONE_OFFSETS: Record<string, number> = {
  'Africa/Nairobi': 3,
  'EAT': 3,
  'UTC': 0,
  'GMT': 0,
  'Europe/London': 0,
  'Europe/Paris': 1,
  'America/New_York': -5,
  'America/Los_Angeles': -8,
  'Asia/Dubai': 4,
  'Africa/Johannesburg': 2,
};

/**
 * Normalizes time string to 24-hour [HH, MM, SS].
 * Supports formats: "14:00", "2:00 PM", "2:00 PM EAT", "14:00:00", "09:30 AM".
 */
export function parseTimeString(timeStr?: string): { hours: number; minutes: number; seconds: number } {
  if (!timeStr || typeof timeStr !== 'string') {
    return { hours: 12, minutes: 0, seconds: 0 };
  }

  const clean = timeStr.trim();
  const ampmMatch = clean.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?(?:\s+[A-Za-z]+)?$/i);

  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const seconds = ampmMatch[3] ? parseInt(ampmMatch[3], 10) : 0;
    const meridian = ampmMatch[4] ? ampmMatch[4].toUpperCase() : null;

    if (meridian === 'PM' && hours < 12) {
      hours += 12;
    } else if (meridian === 'AM' && hours === 12) {
      hours = 0;
    }

    return { hours, minutes, seconds };
  }

  // 24-hour fallback like "14:30"
  const parts = clean.split(':').map((p) => parseInt(p, 10));
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return {
      hours: Math.min(23, Math.max(0, parts[0])),
      minutes: Math.min(59, Math.max(0, parts[1])),
      seconds: parts[2] && !isNaN(parts[2]) ? Math.min(59, Math.max(0, parts[2])) : 0,
    };
  }

  return { hours: 12, minutes: 0, seconds: 0 };
}

/**
 * Months map for English date strings
 */
const MONTHS: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

/**
 * Parses date string unambiguously into [YYYY, MM, DD].
 * Handles:
 * - ISO date: "2026-11-14"
 * - Human date: "Saturday, 14 November 2026", "14 Nov 2026", "November 14, 2026"
 * - Numeric DD/MM/YYYY or YYYY/MM/DD
 */
export function parseDateString(dateStr?: string): { year: number; month: number; day: number } | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const clean = dateStr.trim();

  // Format 1: YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return {
      year: parseInt(isoMatch[1], 10),
      month: parseInt(isoMatch[2], 10),
      day: parseInt(isoMatch[3], 10),
    };
  }

  // Format 2: "14 November 2026" or "Saturday, 14 November 2026" or "14 Nov 2026"
  const dayMonthYearMatch = clean.match(/(?:[A-Za-z]+,\s*)?(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})/i);
  if (dayMonthYearMatch) {
    const day = parseInt(dayMonthYearMatch[1], 10);
    const monthKey = dayMonthYearMatch[2].toLowerCase();
    const month = MONTHS[monthKey];
    const year = parseInt(dayMonthYearMatch[3], 10);
    if (month) return { year, month, day };
  }

  // Format 3: "November 14, 2026"
  const monthDayYearMatch = clean.match(/([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i);
  if (monthDayYearMatch) {
    const monthKey = monthDayYearMatch[1].toLowerCase();
    const month = MONTHS[monthKey];
    const day = parseInt(monthDayYearMatch[2], 10);
    const year = parseInt(monthDayYearMatch[3], 10);
    if (month) return { year, month, day };
  }

  // Format 4: DD/MM/YYYY
  const slashMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    return {
      day: parseInt(slashMatch[1], 10),
      month: parseInt(slashMatch[2], 10),
      year: parseInt(slashMatch[3], 10),
    };
  }

  return null;
}

/**
 * Unambiguously resolves event date, time, and timezone into a standard Date and ISO timestamp.
 */
export function parseEventDateTime(
  dateStr: string,
  timeStr?: string,
  timezone = 'Africa/Nairobi'
): ParsedEventDateTime {
  if (!dateStr) {
    return {
      targetDate: new Date(NaN),
      isoString: '',
      isValid: false,
      timezone,
    };
  }

  // Check if dateStr is already a full ISO 8601 string (e.g. 2026-11-14T14:00:00+03:00 or 2026-11-14T11:00:00Z)
  if (dateStr.includes('T') && (dateStr.endsWith('Z') || dateStr.match(/[+-]\d{2}:?\d{2}$/))) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return {
        targetDate: date,
        isoString: date.toISOString(),
        isValid: true,
        timezone,
      };
    }
  }

  const dateParts = parseDateString(dateStr);
  if (!dateParts) {
    // Attempt standard JS Date constructor as fallback
    const fallback = new Date(timeStr ? `${dateStr} ${timeStr}` : dateStr);
    if (!isNaN(fallback.getTime())) {
      return {
        targetDate: fallback,
        isoString: fallback.toISOString(),
        isValid: true,
        timezone,
      };
    }
    return {
      targetDate: new Date(NaN),
      isoString: '',
      isValid: false,
      timezone,
    };
  }

  const timeParts = parseTimeString(timeStr);

  // Determine timezone offset in hours
  const tzOffsetHours = COMMON_TIMEZONE_OFFSETS[timezone] ?? 3; // Default to Kenya EAT (+03:00)

  // Construct UTC timestamp:
  // Local time = UTC + offset  =>  UTC = Local time - offset
  const utcDate = new Date(
    Date.UTC(
      dateParts.year,
      dateParts.month - 1,
      dateParts.day,
      timeParts.hours - tzOffsetHours,
      timeParts.minutes,
      timeParts.seconds,
      0
    )
  );

  const sign = tzOffsetHours >= 0 ? '+' : '-';
  const absHours = Math.abs(tzOffsetHours).toString().padStart(2, '0');
  const offsetString = `${sign}${absHours}:00`;

  // ISO representation in the local timezone
  const pad = (n: number) => n.toString().padStart(2, '0');
  const localIsoString = `${dateParts.year}-${pad(dateParts.month)}-${pad(dateParts.day)}T${pad(
    timeParts.hours
  )}:${pad(timeParts.minutes)}:${pad(timeParts.seconds)}${offsetString}`;

  return {
    targetDate: utcDate,
    isoString: localIsoString,
    isValid: true,
    timezone,
  };
}

/**
 * Calculates countdown state for an event at reference time `now`.
 * - 'upcoming': event is in the future (> 0 ms remaining)
 * - 'today': event start has arrived and duration window is active (e.g. within 12 hours)
 * - 'passed': event duration window has ended
 */
export function calculateCountdown(
  targetDate: Date,
  now: Date = new Date(),
  options: CountdownOptions = {}
): CountdownState {
  const {
    durationHours = 12,
    label = 'Counting down with joy',
    todayMessage = 'Today is the day!',
    passedMessage = 'This event has passed.',
  } = options;

  if (isNaN(targetDate.getTime())) {
    return {
      status: 'passed',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSecondsRemaining: 0,
      label,
      message: passedMessage,
    };
  }

  const targetMs = targetDate.getTime();
  const nowMs = now.getTime();
  const diffMs = targetMs - nowMs;
  const durationMs = durationHours * 3600 * 1000;

  // 1. Upcoming
  if (diffMs > 0) {
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return {
      status: 'upcoming',
      days,
      hours,
      minutes,
      seconds,
      totalSecondsRemaining: totalSeconds,
      label,
      message: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    };
  }

  // 2. Today is the day! (Event start has arrived and is within duration)
  if (nowMs < targetMs + durationMs) {
    return {
      status: 'today',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSecondsRemaining: 0,
      label: 'Celebration Day',
      message: todayMessage,
    };
  }

  // 3. Passed
  return {
    status: 'passed',
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSecondsRemaining: 0,
    label: 'Event Concluded',
    message: passedMessage,
  };
}
