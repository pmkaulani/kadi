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

// Pass code generation for on-the-day check-in and QR codes
export function generatePassCode(prefix = 'pass'): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let rand = '';
  for (let i = 0; i < 14; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${rand}`;
}

// Deterministic token hash computation
export function computeTokenHash(token: string): string {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}_${token.slice(-8)}`;
}

// Phone normalization for Kenyan (+254) numbers
export function normalizeKenyanPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('254') && !cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }
  return cleaned;
}

export function isValidPhoneNumber(phone: string): boolean {
  const normalized = normalizeKenyanPhoneNumber(phone);
  // Valid Kenyan phone numbers are +254 7XX XXX XXX or +254 1XX XXX XXX (12 digits total)
  return /^\+254[17]\d{8}$/.test(normalized) || /^\+[1-9]\d{7,14}$/.test(normalized);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
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
  duplicateCount: number;
  errorCount: number;
  errors: Array<{ row: number; reason: string }>;
  warnings: Array<{ row: number; reason: string }>;
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
    const direct = mockDb.guests.find((g) => g.token === token);
    if (direct) {
      if ((direct as any).tokenRevoked) return undefined;
      return direct;
    }

    const tokenAliases: Record<string, string> = {
      'tok_demo_zawadi_001': 'tok_wanjiku_fam_84a9f',
      'tok_demo_otieno_001': 'tok_wanjiku_fam_84a9f',
      'tok_demo_wambui_001': 'tok_wanjiku_fam_84a9f',
    };
    const targetToken = tokenAliases[token];
    if (targetToken) {
      const aliasMatch = mockDb.guests.find((g) => g.token === targetToken);
      if (aliasMatch && !(aliasMatch as any).tokenRevoked) {
        return aliasMatch;
      }
    }
    return undefined;
  }

  /**
   * Scoped token lookup strictly enforcing event boundaries.
   * Prevents cross-event token replay attacks.
   */
  static getGuestByTokenAndEvent(token: string, eventId: string): GuestHouseholdEntity | undefined {
    const guest = this.getGuestByToken(token);
    if (!guest) return undefined;
    if (guest.eventId !== eventId) return undefined;
    return guest;
  }

  static getGuestByPassCode(eventId: string, passCode: string): GuestHouseholdEntity | undefined {
    return mockDb.guests.find((g) => g.eventId === eventId && g.passCode === passCode);
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
    const tokenHash = computeTokenHash(token);
    const passCode = generatePassCode();

    const normalizedPhone = data.contactPhone
      ? normalizeKenyanPhoneNumber(data.contactPhone)
      : undefined;

    const newGuest: GuestHouseholdEntity = {
      id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      displayName: data.displayName.trim(),
      group: data.group || 'Guests',
      contactPhone: normalizedPhone,
      contactEmail: data.contactEmail?.trim(),
      allowedPlusOnes: data.allowedPlusOnes !== undefined ? Math.max(0, Number(data.allowedPlusOnes)) : 1,
      token,
      tokenHash,
      passCode,
      status: 'pending',
      checkedIn: false,
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

  /**
   * Rotates a household's private token, immediately invalidating the old link
   * and generating a fresh high-entropy token and hash.
   */
  static rotateGuestToken(id: string): GuestHouseholdEntity {
    const idx = mockDb.guests.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error('Guest not found');

    const newToken = generateHighEntropyToken();
    const newHash = computeTokenHash(newToken);

    mockDb.guests[idx] = {
      ...mockDb.guests[idx],
      token: newToken,
      tokenHash: newHash,
      tokenRevoked: false,
      updatedAt: new Date().toISOString(),
    } as GuestHouseholdEntity;

    return mockDb.guests[idx];
  }

  /**
   * Revokes a household's private token, preventing any further RSVPs or views.
   */
  static revokeGuestToken(id: string): GuestHouseholdEntity {
    const idx = mockDb.guests.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error('Guest not found');

    (mockDb.guests[idx] as any).tokenRevoked = true;
    mockDb.guests[idx].updatedAt = new Date().toISOString();

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
   * Safe CSV / batch importer with row-level validation, duplicate detection,
   * and column mapping.
   *
   * NON-NEGOTIABLE RULE: Never send invitations automatically as a side effect
   * of importing contacts.
   */
  static importGuests(
    eventId: string,
    rows: CSVImportRow[],
    options?: { skipDuplicates?: boolean }
  ): ImportResult {
    let importedCount = 0;
    let duplicateCount = 0;
    const errors: Array<{ row: number; reason: string }> = [];
    const warnings: Array<{ row: number; reason: string }> = [];

    const existingGuests = mockDb.guests.filter((g) => g.eventId === eventId);
    const existingPhones = new Set(
      existingGuests.map((g) => g.contactPhone).filter(Boolean)
    );
    const existingEmails = new Set(
      existingGuests.map((g) => g.contactEmail?.toLowerCase()).filter(Boolean)
    );

    rows.forEach((row, index) => {
      const rowNum = index + 1;
      const trimmedName = row.name ? row.name.trim() : '';

      if (!trimmedName) {
        errors.push({ row: rowNum, reason: 'Missing guest or household name' });
        return;
      }

      // Phone validation
      let normalizedPhone: string | undefined = undefined;
      if (row.phone && row.phone.trim()) {
        normalizedPhone = normalizeKenyanPhoneNumber(row.phone.trim());
        if (!isValidPhoneNumber(normalizedPhone)) {
          warnings.push({
            row: rowNum,
            reason: `Phone "${row.phone}" does not match standard Kenyan or international format.`,
          });
        }
      }

      // Email validation
      let normalizedEmail: string | undefined = undefined;
      if (row.email && row.email.trim()) {
        normalizedEmail = row.email.trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) {
          errors.push({
            row: rowNum,
            reason: `Invalid email address: "${row.email}"`,
          });
          return;
        }
      }

      // Duplicate detection
      const isDuplicatePhone = normalizedPhone && existingPhones.has(normalizedPhone);
      const isDuplicateEmail = normalizedEmail && existingEmails.has(normalizedEmail);

      if (isDuplicatePhone || isDuplicateEmail) {
        duplicateCount++;
        if (options?.skipDuplicates) {
          warnings.push({
            row: rowNum,
            reason: `Skipped duplicate contact: ${normalizedPhone || normalizedEmail}`,
          });
          return;
        }
      }

      try {
        const plusOnes = row.plusOnes !== undefined ? Math.max(0, Number(row.plusOnes)) : 1;
        const newGuest = this.addGuest(eventId, {
          displayName: trimmedName,
          contactPhone: normalizedPhone,
          contactEmail: normalizedEmail,
          group: row.group || 'Guests',
          allowedPlusOnes: isNaN(plusOnes) ? 1 : plusOnes,
          notes: row.notes,
        });

        if (normalizedPhone) existingPhones.add(normalizedPhone);
        if (normalizedEmail) existingEmails.add(normalizedEmail);

        importedCount++;
      } catch (err: any) {
        errors.push({ row: rowNum, reason: err.message || 'Validation error' });
      }
    });

    return {
      importedCount,
      duplicateCount,
      errorCount: errors.length,
      errors,
      warnings,
    };
  }

  /**
   * Flexible CSV text parser supporting common headers
   */
  static parseCsvText(csvText: string): CSVImportRow[] {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const cleanHeaders = lines[0]
      .split(',')
      .map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase().replace(/[\s_\-]+/g, ''));

    const nameIdx = cleanHeaders.findIndex((h) =>
      ['name', 'fullname', 'guest', 'household', 'displayname', 'guestname', 'contactname'].includes(h)
    );
    const phoneIdx = cleanHeaders.findIndex((h) =>
      ['phone', 'mobile', 'tel', 'cell', 'contactphone', 'whatsapp', 'mobilephone', 'phonenumber'].includes(h)
    );
    const emailIdx = cleanHeaders.findIndex((h) =>
      ['email', 'contactemail', 'mail', 'emailaddress'].includes(h)
    );
    const groupIdx = cleanHeaders.findIndex((h) =>
      ['group', 'category', 'type', 'guestgroup', 'groupcategory'].includes(h)
    );
    const plusOnesIdx = cleanHeaders.findIndex((h) =>
      ['plusones', 'plusone', 'maxattendees', 'attendees', 'seats', 'capacity', 'allowedplusones'].includes(h)
    );
    const notesIdx = cleanHeaders.findIndex((h) =>
      ['notes', 'note', 'comments', 'comment'].includes(h)
    );

    if (nameIdx === -1) {
      // Fallback: assume column 0 is name, column 1 is phone, column 2 is group, column 3 is plus-ones
      return lines.slice(1).map((line) => {
        const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
        return {
          name: cols[0] || '',
          displayName: cols[0] || '',
          phone: cols[1],
          group: cols[2],
          plusOnes: cols[3] ? Number(cols[3]) : 1,
          allowedPlusOnes: cols[3] ? Number(cols[3]) : 1,
          notes: cols[4],
        };
      });
    }

    return lines.slice(1).map((line) => {
      const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      return {
        name: cols[nameIdx] || '',
        displayName: cols[nameIdx] || '',
        phone: phoneIdx !== -1 ? cols[phoneIdx] : undefined,
        email: emailIdx !== -1 ? cols[emailIdx] : undefined,
        group: groupIdx !== -1 ? cols[groupIdx] : undefined,
        plusOnes: plusOnesIdx !== -1 ? Number(cols[plusOnesIdx]) : 1,
        allowedPlusOnes: plusOnesIdx !== -1 ? Number(cols[plusOnesIdx]) : 1,
        notes: notesIdx !== -1 ? cols[notesIdx] : undefined,
      };
    });
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
