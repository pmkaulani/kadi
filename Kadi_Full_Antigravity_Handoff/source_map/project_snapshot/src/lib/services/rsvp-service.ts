import { mockDb } from '../db/mock-db';
import { RSVPSubmissionEntity, AttendeeEntity } from '../db/types';
import { GuestService } from './guest-service';

export interface RSVPSummary {
  totalHouseholds: number;
  totalHeadcountExpected: number;
  attendingHouseholds: number;
  declinedHouseholds: number;
  pendingHouseholds: number;
  attendingAttendeeCount: number;
  dietaryCount: number;
  songRequestsCount: number;
}

export class RSVPService {
  static listRSVPs(eventId: string): RSVPSubmissionEntity[] {
    return mockDb.rsvps.filter((r) => r.eventId === eventId);
  }

  static submitRSVP(payload: {
    eventId: string;
    guestToken?: string;
    primaryName: string;
    contact: string;
    status: 'yes' | 'no' | 'maybe';
    attendeeCount: number;
    dietaryRequirements?: string;
    songRequest?: string;
    noteToHost?: string;
  }): RSVPSubmissionEntity {
    // If a token was provided, locate household and enforce constraints
    let household = payload.guestToken
      ? GuestService.getGuestByToken(payload.guestToken)
      : undefined;

    if (household) {
      const maxAllowed = 1 + household.allowedPlusOnes;
      if (payload.status === 'yes' && payload.attendeeCount > maxAllowed) {
        throw new Error(
          `Attendee count (${payload.attendeeCount}) exceeds allowed invitation limit of ${maxAllowed}.`
        );
      }

      // Update household status
      GuestService.updateGuest(household.id, {
        status: payload.status,
      });
    }

    const submission: RSVPSubmissionEntity = {
      id: `rsvp-${Date.now()}`,
      eventId: payload.eventId,
      householdId: household?.id,
      primaryName: payload.primaryName,
      contact: payload.contact,
      status: payload.status,
      attendeeCount: payload.status === 'yes' ? payload.attendeeCount : 0,
      dietaryRequirements: payload.dietaryRequirements,
      songRequest: payload.songRequest,
      noteToHost: payload.noteToHost,
      submittedAt: new Date().toISOString(),
    };

    mockDb.rsvps.unshift(submission);

    // If attending, add individual attendee records
    if (payload.status === 'yes' && household) {
      // Remove any prior attendees
      mockDb.attendees = mockDb.attendees.filter((a) => a.householdId !== household!.id);

      for (let i = 0; i < payload.attendeeCount; i++) {
        const attendeeName =
          i === 0 ? payload.primaryName : `Guest ${i + 1} (${payload.primaryName})`;

        mockDb.attendees.push({
          id: `att-${Date.now()}-${i}`,
          householdId: household.id,
          eventId: payload.eventId,
          name: attendeeName,
          status: 'attending',
          dietaryRestrictions: payload.dietaryRequirements,
        });
      }
    }

    return submission;
  }

  static getRSVPSummary(eventId: string): RSVPSummary {
    const households = mockDb.guests.filter((g) => g.eventId === eventId);
    const submissions = mockDb.rsvps.filter((r) => r.eventId === eventId);

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

    return {
      totalHouseholds: households.length,
      totalHeadcountExpected,
      attendingHouseholds,
      declinedHouseholds,
      pendingHouseholds,
      attendingAttendeeCount,
      dietaryCount,
      songRequestsCount,
    };
  }

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
      `"${s.id}"`,
      `"${s.primaryName.replace(/"/g, '""')}"`,
      `"${s.contact.replace(/"/g, '""')}"`,
      `"${s.status.toUpperCase()}"`,
      s.attendeeCount,
      `"${(s.dietaryRequirements || '').replace(/"/g, '""')}"`,
      `"${(s.songRequest || '').replace(/"/g, '""')}"`,
      `"${(s.noteToHost || '').replace(/"/g, '""')}"`,
      `"${s.submittedAt}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
