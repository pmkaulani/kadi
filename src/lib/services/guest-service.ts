import { mockDb } from '../db/mock-db';
import { GuestHouseholdEntity, AttendeeEntity } from '../db/types';

// High-entropy token generation
function generateHighEntropyToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = 'tok_';
  for (let i = 0; i < 28; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Phone normalization for Kenyan (+254) numbers
export function normalizeKenyanPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('254') && !cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }
  return cleaned;
}

export interface CSVImportRow {
  name: string;
  phone?: string;
  email?: string;
  group?: string;
  plusOnes?: number;
  notes?: string;
}

export interface ImportResult {
  importedCount: number;
  errors: Array<{ row: number; reason: string }>;
}

export class GuestService {
  static listGuests(eventId: string, search = '', group = 'all'): GuestHouseholdEntity[] {
    return mockDb.guests.filter((g) => {
      if (g.eventId !== eventId) return false;
      if (group !== 'all' && g.group !== group) return false;
      if (search) {
        const query = search.toLowerCase();
        const matchesName = g.displayName.toLowerCase().includes(query);
        const matchesPhone = g.contactPhone?.toLowerCase().includes(query) ?? false;
        const matchesEmail = g.contactEmail?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesPhone && !matchesEmail) return false;
      }
      return true;
    });
  }

  static getGuestById(id: string): GuestHouseholdEntity | undefined {
    return mockDb.guests.find((g) => g.id === id);
  }

  static getGuestByToken(token: string): GuestHouseholdEntity | undefined {
    return mockDb.guests.find((g) => g.token === token);
  }

  static addGuest(
    eventId: string,
    data: {
      displayName: string;
      group?: string;
      contactPhone?: string;
      contactEmail?: string;
      allowedPlusOnes?: number;
      notes?: string;
    }
  ): GuestHouseholdEntity {
    const token = generateHighEntropyToken();
    const tokenHash = `hash_${token.substring(4, 16)}`;

    const normalizedPhone = data.contactPhone
      ? normalizeKenyanPhoneNumber(data.contactPhone)
      : undefined;

    const newGuest: GuestHouseholdEntity = {
      id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      eventId,
      displayName: data.displayName.trim(),
      group: data.group || 'Guests',
      contactPhone: normalizedPhone,
      contactEmail: data.contactEmail?.trim(),
      allowedPlusOnes: data.allowedPlusOnes ?? 1,
      token,
      tokenHash,
      status: 'pending',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.guests.push(newGuest);
    return newGuest;
  }

  static updateGuest(
    id: string,
    updates: Partial<GuestHouseholdEntity>
  ): GuestHouseholdEntity {
    const idx = mockDb.guests.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error('Guest not found');

    if (updates.contactPhone) {
      updates.contactPhone = normalizeKenyanPhoneNumber(updates.contactPhone);
    }

    mockDb.guests[idx] = {
      ...mockDb.guests[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockDb.guests[idx];
  }

  static deleteGuest(id: string): boolean {
    const idx = mockDb.guests.findIndex((g) => g.id === id);
    if (idx === -1) return false;
    mockDb.guests.splice(idx, 1);
    // Also remove attendees for this household
    mockDb.attendees = mockDb.attendees.filter((a) => a.householdId !== id);
    return true;
  }

  /**
   * Safe CSV / batch importer.
   * NON-NEGOTIABLE RULE: Never send invitations automatically as a side effect of importing contacts.
   */
  static importGuests(eventId: string, rows: CSVImportRow[]): ImportResult {
    let importedCount = 0;
    const errors: Array<{ row: number; reason: string }> = [];

    rows.forEach((row, index) => {
      const rowNum = index + 1;
      if (!row.name || !row.name.trim()) {
        errors.push({ row: rowNum, reason: 'Missing guest or household name' });
        return;
      }

      try {
        this.addGuest(eventId, {
          displayName: row.name,
          contactPhone: row.phone,
          contactEmail: row.email,
          group: row.group,
          allowedPlusOnes: Number(row.plusOnes) || 1,
          notes: row.notes,
        });
        importedCount++;
      } catch (err: any) {
        errors.push({ row: rowNum, reason: err.message || 'Validation error' });
      }
    });

    return { importedCount, errors };
  }

  static getGroups(eventId: string): string[] {
    const guests = mockDb.guests.filter((g) => g.eventId === eventId);
    const set = new Set<string>();
    guests.forEach((g) => {
      if (g.group) set.add(g.group);
    });
    return Array.from(set);
  }
}
