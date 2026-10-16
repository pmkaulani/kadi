import { mockDb } from '../db/mock-db';
import { CheckInRecordEntity, GuestHouseholdEntity } from '../db/types';
import { GuestService } from './guest-service';

export interface CheckInStatusSummary {
  totalHouseholds: number;
  checkedInHouseholds: number;
  totalAttendingHeadcount: number;
  checkedInHeadcount: number;
  percentage: number;
  recentRecords: CheckInRecordEntity[];
}

export class CheckInService {
  /**
   * Looks up a guest record by pass code or guest ID within an event boundary.
   */
  static findGuest(eventId: string, query: { passCode?: string; guestId?: string }): GuestHouseholdEntity | undefined {
    if (query.guestId) {
      const g = mockDb.guests.find((x) => x.id === query.guestId && x.eventId === eventId);
      if (g) return g;
    }
    if (query.passCode) {
      const trimmed = query.passCode.trim();
      const g = mockDb.guests.find((x) => x.eventId === eventId && x.passCode?.toLowerCase() === trimmed.toLowerCase());
      if (g) return g;
    }
    return undefined;
  }

  /**
   * Performs on-the-day check-in for a guest.
   * Rejects invalid passes, prevents duplicate check-ins, and logs staff actor & timestamp.
   */
  static checkIn(
    eventId: string,
    query: { passCode?: string; guestId?: string },
    staffActor: string
  ): {
    success: boolean;
    alreadyCheckedIn?: boolean;
    message: string;
    checkIn?: CheckInRecordEntity;
    guest?: GuestHouseholdEntity;
  } {
    const guest = this.findGuest(eventId, query);
    if (!guest) {
      return {
        success: false,
        message: 'Pass code or guest not found for this event.',
      };
    }

    if (guest.checkedIn) {
      return {
        success: false,
        alreadyCheckedIn: true,
        message: `Already checked in at ${new Date(guest.checkedInAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        guest,
      };
    }

    const checkedInAt = new Date().toISOString();
    guest.checkedIn = true;
    guest.checkedInAt = checkedInAt;

    const record: CheckInRecordEntity = {
      id: `chk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      guestId: guest.id,
      passCode: guest.passCode || 'pass_manual',
      guestName: guest.displayName,
      checkedInAt,
      checkedInBy: staffActor || 'Staff',
      status: 'checked_in',
    };

    mockDb.checkIns.unshift(record);

    return {
      success: true,
      message: `Checked in ${guest.displayName} successfully!`,
      checkIn: record,
      guest,
    };
  }

  /**
   * Reverses an erroneous check-in by authorized staff.
   */
  static undoCheckIn(
    eventId: string,
    guestId: string,
    staffActor: string
  ): { success: boolean; message: string } {
    const guest = mockDb.guests.find((g) => g.id === guestId && g.eventId === eventId);
    if (!guest) {
      return { success: false, message: 'Guest record not found.' };
    }

    if (!guest.checkedIn) {
      return { success: false, message: 'Guest is not currently checked in.' };
    }

    guest.checkedIn = false;
    guest.checkedInAt = undefined;

    // Update corresponding checkIn record
    const record = mockDb.checkIns.find(
      (c) => c.eventId === eventId && c.guestId === guestId && c.status === 'checked_in'
    );
    if (record) {
      record.status = 'undone';
      record.undoneAt = new Date().toISOString();
      record.undoneBy = staffActor || 'Staff';
    }

    return {
      success: true,
      message: `Check-in reversed for ${guest.displayName}.`,
    };
  }

  /**
   * Calculates real-time event day check-in statistics.
   */
  static getStatus(eventId: string): CheckInStatusSummary {
    const guests = mockDb.guests.filter((g) => g.eventId === eventId);
    const checkedInGuests = guests.filter((g) => g.checkedIn);

    const totalHouseholds = guests.length;
    const checkedInHouseholds = checkedInGuests.length;

    // Headcount estimate based on allowed plus-ones and attendance
    const totalAttendingHeadcount = guests
      .filter((g) => g.status === 'attending' || g.status === 'yes')
      .reduce((sum, g) => sum + 1 + (g.allowedPlusOnes || 0), 0);

    const checkedInHeadcount = checkedInGuests.reduce(
      (sum, g) => sum + 1 + (g.allowedPlusOnes || 0),
      0
    );

    const percentage = totalHouseholds > 0
      ? Math.round((checkedInHouseholds / totalHouseholds) * 100)
      : 0;

    const recentRecords = mockDb.checkIns
      .filter((c) => c.eventId === eventId)
      .slice(0, 20);

    return {
      totalHouseholds,
      checkedInHouseholds,
      totalAttendingHeadcount,
      checkedInHeadcount,
      percentage,
      recentRecords,
    };
  }
}
