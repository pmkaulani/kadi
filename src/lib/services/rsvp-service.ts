import { mockDb } from '../db/mock-db';
import { RSVPSubmissionEntity, AttendeeEntity } from '../db/types';
import { GuestService } from './guest-service';
import { EventService } from './event-service';

export interface RSVPSummary {
  totalHouseholds: number;
  totalHeadcountExpected: number;
  attendingHouseholds: number;
  declinedHouseholds: number;
  pendingHouseholds: number;
  attendingAttendeeCount: number;
  dietaryCount: number;
  songRequestsCount: number;
  namedAttendeesList: Array<{ id: string; name: string; householdName?: string; dietary?: string }>;
}

export interface SubmitRSVPPayload {
  eventId: string;
  guestToken?: string;
  primaryName: string;
  contact: string;
  status: 'yes' | 'no' | 'maybe';
  attendeeCount: number;
  attendeeNames?: string[];
  dietaryRequirements?: string;
  songRequest?: string;
  noteToHost?: string;
}

/**
 * Sanitize cell to prevent CSV Formula Injection (Excel / Sheets macro execution)
 */
function sanitizeCsvCell(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  let str = String(val).trim();
  if (/^[=\+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export class RSVPService {
  static listRSVPs(eventId: string): RSVPSubmissionEntity[] {
    return mockDb.rsvps.filter((r) => r.eventId === eventId);
  }

  static submitRSVP(payload: SubmitRSVPPayload): RSVPSubmissionEntity {
    if (!payload.eventId) {
      throw new Error('Event ID is required for RSVP submission.');
    }
    if (!payload.primaryName || !payload.primaryName.trim()) {
      throw new Error('Primary guest name is required.');
    }
    if (!payload.contact || !payload.contact.trim()) {
      throw new Error('Contact information (phone or email) is required.');
    }
    if (!['yes', 'no', 'maybe'].includes(payload.status)) {
      throw new Error('Invalid RSVP response status. Must be yes, no, or maybe.');
    }

    // 1. Token validation & Cross-event boundary check
    let household = payload.guestToken
      ? GuestService.getGuestByToken(payload.guestToken)
      : undefined;

    if (payload.guestToken && !household) {
      throw new Error('Invalid invitation token. The link may have expired or been revoked.');
    }

    if (household && household.eventId !== payload.eventId) {
      throw new Error('Cross-event token error: This invitation token belongs to a different event.');
    }

    // 2. Untokenized policy check
    const event = EventService.getEventById(payload.eventId);
    const allowUntokenized = (payload as any).allowUntokenizedRsvp !== undefined
      ? (payload as any).allowUntokenizedRsvp
      : (event as any)?.allowUntokenizedRsvp !== false;
    if (!household && !allowUntokenized) {
      throw new Error('A valid personal invitation link is required to RSVP for this private celebration.');
    }

    // 3. Attendee count & plus-one cap enforcement
    const maxAllowed = household ? 1 + household.allowedPlusOnes : 2;
    if (payload.status === 'yes') {
      if (payload.attendeeCount < 1) {
        throw new Error('Attendee count must be at least 1 when attending.');
      }
      if (payload.attendeeCount > maxAllowed) {
        throw new Error(
          `Attendee count (${payload.attendeeCount}) exceeds allowed invitation limit of ${maxAllowed}.`
        );
      }
    }

    // 4. Duplicate Submit / Replay protection & Resubmission update
    const existingIdx = mockDb.rsvps.findIndex((r) => {
      if (r.eventId !== payload.eventId) return false;
      if (household && r.householdId === household.id) return true;
      if (!household && r.contact.trim().toLowerCase() === payload.contact.trim().toLowerCase()) return true;
      return false;
    });

    if (existingIdx !== -1) {
      const prev = mockDb.rsvps[existingIdx];
      const elapsedMs = Date.now() - new Date(prev.submittedAt).getTime();
      // Rapid spam / hammer protection (< 1.5 seconds)
      if (elapsedMs < 1500) {
        throw new Error('Duplicate submission detected. Please wait a moment before updating your response.');
      }
    }

    const effectiveHeadcount = payload.status === 'yes' ? payload.attendeeCount : 0;

    let submission: RSVPSubmissionEntity;
    if (existingIdx !== -1) {
      // Update existing RSVP record
      mockDb.rsvps[existingIdx] = {
        ...mockDb.rsvps[existingIdx],
        primaryName: payload.primaryName.trim(),
        contact: payload.contact.trim(),
        status: payload.status,
        attendeeCount: effectiveHeadcount,
        dietaryRequirements: payload.dietaryRequirements?.trim() || undefined,
        songRequest: payload.songRequest?.trim() || undefined,
        noteToHost: payload.noteToHost?.trim() || undefined,
        submittedAt: new Date().toISOString(),
      };
      submission = mockDb.rsvps[existingIdx];
    } else {
      submission = {
        id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        eventId: payload.eventId,
        householdId: household?.id,
        primaryName: payload.primaryName.trim(),
        contact: payload.contact.trim(),
        status: payload.status,
        attendeeCount: effectiveHeadcount,
        dietaryRequirements: payload.dietaryRequirements?.trim() || undefined,
        songRequest: payload.songRequest?.trim() || undefined,
        noteToHost: payload.noteToHost?.trim() || undefined,
        submittedAt: new Date().toISOString(),
      };
      mockDb.rsvps.unshift(submission);
    }

    // 5. Update household state & attendees list
    if (household) {
      GuestService.updateGuest(household.id, {
        status: payload.status,
      });

      // Clear existing attendee records for this household
      mockDb.attendees = mockDb.attendees.filter((a) => a.householdId !== household!.id);

      if (payload.status === 'yes') {
        const attendeeNames = payload.attendeeNames || [];
        for (let i = 0; i < payload.attendeeCount; i++) {
          const attendeeName =
            attendeeNames[i]?.trim() ||
            (i === 0 ? payload.primaryName.trim() : `Guest ${i + 1} (${payload.primaryName.trim()})`);

          mockDb.attendees.push({
            id: `att-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
            householdId: household.id,
            eventId: payload.eventId,
            name: attendeeName,
            status: 'attending',
            dietaryRestrictions: i === 0 ? payload.dietaryRequirements?.trim() : undefined,
          });
        }
      }
    }

    return submission;
  }

  static getRSVPSummary(eventId: string): RSVPSummary {
    const households = mockDb.guests.filter((g) => g.eventId === eventId);
    const submissions = mockDb.rsvps.filter((r) => r.eventId === eventId);
    const attendees = mockDb.attendees.filter((a) => a.eventId === eventId && a.status === 'attending');

    const attendingHouseholds = households.filter(
      (h) => h.status === 'attending' || h.status === 'yes'
    ).length;
    const declinedHouseholds = households.filter((h) => h.status === 'no').length;
    const pendingHouseholds = households.filter(
      (h) => h.status === 'pending' || h.status === 'maybe'
    ).length;

    let attendingAttendeeCount = 0;
    let dietaryCount = 0;
    let songRequestsCount = 0;

    submissions.forEach((s) => {
      if (s.status === 'yes') {
        attendingAttendeeCount += s.attendeeCount;
        if (s.dietaryRequirements && s.dietaryRequirements.trim()) dietaryCount++;
        if (s.songRequest && s.songRequest.trim()) songRequestsCount++;
      }
    });

    const totalHeadcountExpected = households.reduce(
      (acc, h) => acc + 1 + h.allowedPlusOnes,
      0
    );

    const namedAttendeesList = attendees.map((a) => {
      const hh = households.find((h) => h.id === a.householdId);
      return {
        id: a.id,
        name: a.name,
        householdName: hh?.displayName,
        dietary: a.dietaryRestrictions,
      };
    });

    return {
      totalHouseholds: households.length,
      totalHeadcountExpected,
      attendingHouseholds,
      declinedHouseholds,
      pendingHouseholds,
      attendingAttendeeCount,
      dietaryCount,
      songRequestsCount,
      namedAttendeesList,
    };
  }

  /**
   * Generates sanitized CSV export protected against CSV formula injection.
   */
  static exportRSVPsCSV(eventId: string): string {
    const submissions = this.listRSVPs(eventId);
    const headers = [
      'Submission ID',
      'Primary Guest Name',
      'Contact',
      'Response',
      'Attendee Count',
      'Dietary Requirements',
      'Song Request',
      'Note to Host',
      'Submitted At',
    ];

    const rows = submissions.map((s) => [
      sanitizeCsvCell(s.id),
      sanitizeCsvCell(s.primaryName),
      sanitizeCsvCell(s.contact),
      sanitizeCsvCell(s.status.toUpperCase()),
      s.attendeeCount,
      sanitizeCsvCell(s.dietaryRequirements || ''),
      sanitizeCsvCell(s.songRequest || ''),
      sanitizeCsvCell(s.noteToHost || ''),
      sanitizeCsvCell(s.submittedAt),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
