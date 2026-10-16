import { mockDb } from '../db/mock-db';
import { CoHostEntity, CoHostRole, CoHostStatus } from '../db/types';
import { EventService } from './event-service';
import { SessionUser } from '../auth/session';

export type CoHostPermission =
  | 'manage_event'
  | 'manage_guests'
  | 'view_rsvps'
  | 'export_data'
  | 'check_in'
  | 'manage_cohosts'
  | 'manage_messages'
  | 'delete_event';

export const ROLE_PERMISSIONS: Record<CoHostRole, CoHostPermission[]> = {
  owner: [
    'manage_event',
    'manage_guests',
    'view_rsvps',
    'export_data',
    'check_in',
    'manage_cohosts',
    'manage_messages',
    'delete_event',
  ],
  manager: [
    'manage_event',
    'manage_guests',
    'view_rsvps',
    'export_data',
    'check_in',
    'manage_messages',
  ],
  guest_manager: [
    'manage_guests',
    'view_rsvps',
    'export_data',
    'check_in',
    'manage_messages',
  ],
  check_in_staff: [
    'check_in',
  ],
};

export const ROLE_DESCRIPTIONS: Record<CoHostRole, { title: string; summary: string }> = {
  owner: {
    title: 'Owner',
    summary: 'Full administrative control over event content, guests, team, and settings.',
  },
  manager: {
    title: 'Event Manager',
    summary: 'Can edit event details, manage guests, view RSVPs, and perform check-ins.',
  },
  guest_manager: {
    title: 'Guest List Manager',
    summary: 'Can invite and manage guests, view RSVPs, export lists, and perform check-ins.',
  },
  check_in_staff: {
    title: 'Check-In Staff',
    summary: 'Fast on-the-day search and pass check-in only. Cannot edit event details or export guest data.',
  },
};

function generateInviteToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = 'tok_cohost_';
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export class CoHostService {
  static listCoHosts(eventId: string): CoHostEntity[] {
    return mockDb.cohosts.filter((c) => c.eventId === eventId);
  }

  static getCoHostById(id: string): CoHostEntity | undefined {
    return mockDb.cohosts.find((c) => c.id === id);
  }

  static getCoHostByToken(token: string): CoHostEntity | undefined {
    return mockDb.cohosts.find((c) => c.inviteToken === token);
  }

  static inviteCoHost(
    eventId: string,
    data: {
      email: string;
      name?: string;
      role: CoHostRole;
      invitedBy?: string;
    }
  ): CoHostEntity {
    const trimmedEmail = data.email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('A valid email address is required to invite a co-host.');
    }

    const event = EventService.getEventById(eventId);
    if (!event) throw new Error('Event not found.');

    // Check if user is already the owner
    const existingHost = mockDb.events.find((e) => e.id === eventId && e.hostId === trimmedEmail);
    if (existingHost) {
      throw new Error('This user is already the primary owner of the event.');
    }

    // Check for existing active invite
    const existing = mockDb.cohosts.find(
      (c) => c.eventId === eventId && c.email.toLowerCase() === trimmedEmail && c.status !== 'revoked'
    );
    if (existing) {
      if (existing.status === 'accepted') {
        throw new Error(`This user is already an accepted co-host (${existing.role}).`);
      }
      throw new Error('An active invitation has already been sent to this email address.');
    }

    const newCoHost: CoHostEntity = {
      id: `cohost-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      email: trimmedEmail,
      name: data.name?.trim(),
      role: data.role,
      status: 'pending',
      inviteToken: generateInviteToken(),
      invitedAt: new Date().toISOString(),
      invitedBy: data.invitedBy,
    };

    mockDb.cohosts.push(newCoHost);
    return newCoHost;
  }

  static updateCoHostRole(id: string, newRole: CoHostRole): CoHostEntity {
    const idx = mockDb.cohosts.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Co-host record not found.');

    mockDb.cohosts[idx] = {
      ...mockDb.cohosts[idx],
      role: newRole,
    };
    return mockDb.cohosts[idx];
  }

  static revokeCoHost(id: string): CoHostEntity {
    const idx = mockDb.cohosts.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Co-host record not found.');

    mockDb.cohosts[idx] = {
      ...mockDb.cohosts[idx],
      status: 'revoked',
    };
    return mockDb.cohosts[idx];
  }

  static removeCoHost(id: string): boolean {
    const idx = mockDb.cohosts.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    mockDb.cohosts.splice(idx, 1);
    return true;
  }

  static acceptInvite(
    inviteToken: string,
    user: { email: string; name?: string }
  ): CoHostEntity {
    const cohost = mockDb.cohosts.find((c) => c.inviteToken === inviteToken);
    if (!cohost) {
      throw new Error('Invalid or expired co-host invitation link.');
    }
    if (cohost.status === 'revoked') {
      throw new Error('This co-host invitation has been revoked by the event owner.');
    }
    if (cohost.status === 'accepted') {
      return cohost; // Idempotent return
    }

    cohost.status = 'accepted';
    cohost.acceptedAt = new Date().toISOString();
    if (user.name) cohost.name = user.name;
    return cohost;
  }

  /**
   * Resolves the highest role for a user on an event.
   */
  static getUserRoleForEvent(eventId: string, sessionUser: SessionUser): CoHostRole | null {
    const event = EventService.getEventById(eventId);
    if (!event) return null;

    if (event.hostId === sessionUser.id || sessionUser.role === 'admin') {
      return 'owner';
    }

    const cohost = mockDb.cohosts.find(
      (c) =>
        c.eventId === eventId &&
        c.status === 'accepted' &&
        (c.email.toLowerCase() === sessionUser.email.toLowerCase() || c.id === sessionUser.id)
    );

    return cohost ? cohost.role : null;
  }

  /**
   * Asserts whether the authenticated user has the required permission for the event.
   */
  static assertPermission(
    eventId: string,
    sessionUser: SessionUser,
    permission: CoHostPermission
  ): { role: CoHostRole; allowed: boolean } {
    const role = this.getUserRoleForEvent(eventId, sessionUser);
    if (!role) {
      return { role: 'check_in_staff', allowed: false };
    }

    const allowed = ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
    return { role, allowed };
  }
}
