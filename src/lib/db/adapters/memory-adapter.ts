import {
  IDatabaseAdapter,
  AdapterDiagnostics,
} from './types';
import {
  UserEntity,
  EventEntity,
  EventDesignEntity,
  GuestHouseholdEntity,
  AttendeeEntity,
  RSVPSubmissionEntity,
  CondolenceEntity,
} from '../types';
import { hashPassword } from '@/lib/auth/password';

export class MemoryDatabaseAdapter implements IDatabaseAdapter {
  private users: Map<string, UserEntity> = new Map();
  private userPasswords: Map<string, string> = new Map(); // userId -> passwordHash
  private events: Map<string, EventEntity> = new Map();
  private designs: Map<string, EventDesignEntity> = new Map();
  private guests: Map<string, GuestHouseholdEntity> = new Map();
  private attendees: Map<string, AttendeeEntity> = new Map();
  private rsvps: Map<string, RSVPSubmissionEntity> = new Map();
  private condolences: Map<string, CondolenceEntity> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // 1. Seed Hosts
    const host1: UserEntity = {
      id: 'host-1',
      email: 'host@kadi.co.ke',
      name: 'Peter Kaulani',
      role: 'host',
      createdAt: '2026-10-01T00:00:00Z',
    };
    this.users.set(host1.id, host1);
    this.userPasswords.set(host1.id, hashPassword('KadiHost2026!'));

    const host2: UserEntity = {
      id: 'host-2',
      email: 'claire@kadi.co.ke',
      name: 'Claire Achieng',
      role: 'host',
      createdAt: '2026-10-01T00:00:00Z',
    };
    this.users.set(host2.id, host2);
    this.userPasswords.set(host2.id, hashPassword('ClaireHost2026!'));

    // 2. Seed Events (from existing mock data)
    const weddingEvent: EventEntity = {
      id: 'event-wedding-1',
      hostId: 'host-1',
      title: 'The Wedding of Kevin & Wanjiku',
      subtitle: 'Together with their families, invite you to celebrate',
      slug: 'kevin-and-wanjiku',
      category: 'wedding',
      status: 'published',
      templateId: 'savannah-twilight',
      templateVersion: '1.0.0',
      hosts: 'Mr. & Mrs. Kamau and Mr. & Mrs. Ochieng',
      celebrants: 'Kevin Kamau & Wanjiku Ochieng',
      date: 'Saturday, 14 November 2026',
      time: '2:00 PM EAT',
      timezone: 'Africa/Nairobi',
      venue: 'Safari Park Hotel & Casino, Thika Road',
      address: 'Thika Road, Kasarani',
      city: 'Nairobi, Kenya',
      directionsNote: 'Ample secure parking on-site. Security will usher guests to the Paradise Garden.',
      dressCode: 'Black Tie with African Royal Accents (Rich Purples, Gold, Emerald)',
      story: 'From meeting in Westlands to climbing Mount Longonot together, every step led us to this day of joy.',
      heroImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
      ],
      rsvpDeadline: '1 November 2026',
      maxCapacity: 250,
      allowsChildren: true,
      mpesaType: 'till',
      mpesaNumber: '8249102',
      mpesaRecipient: 'Kevin Kamau',
      mpesaReference: 'Kevin & Wanjiku Wedding',
      createdAt: '2026-10-01T10:00:00Z',
      updatedAt: '2026-10-10T14:30:00Z',
    };
    this.events.set(weddingEvent.id, weddingEvent);

    const birthdayEvent: EventEntity = {
      id: 'event-birthday-1',
      hostId: 'host-1',
      title: 'Maina at 50 — Half a Century of Joy',
      subtitle: 'Join us for a golden afternoon of stories, roast goat, and live Benga',
      slug: 'maina-50',
      category: 'birthday',
      status: 'published',
      templateId: 'sunset-terracotta',
      templateVersion: '1.0.0',
      hosts: 'Wacera Maina & Children',
      celebrants: 'David Maina Mwangi',
      date: 'Saturday, 5 December 2026',
      time: '1:00 PM — 8:00 PM EAT',
      timezone: 'Africa/Nairobi',
      venue: 'The Riverfront Lawn, Karen Blixen Coffee Garden',
      address: '38 Karen Road, Karen',
      city: 'Nairobi, Kenya',
      heroImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
      rsvpDeadline: '20 November 2026',
      createdAt: '2026-10-05T09:00:00Z',
      updatedAt: '2026-10-10T10:00:00Z',
    };
    this.events.set(birthdayEvent.id, birthdayEvent);

    const memorialEvent: EventEntity = {
      id: 'event-memorial-1',
      hostId: 'host-1',
      title: 'Celebrating the Life of Mama Sarah Wambui',
      subtitle: 'A life of quiet grace, unconditional love, and faithful service',
      slug: 'mama-sarah-wambui',
      category: 'memorial',
      status: 'published',
      templateId: 'ancestral-stone',
      templateVersion: '1.0.0',
      hosts: 'The Family of the Late Elder John K. Mwangi',
      celebrants: 'Mama Sarah Wambui Mwangi (1942 — 2026)',
      date: 'Friday, 20 November 2026',
      time: '10:00 AM EAT',
      timezone: 'Africa/Nairobi',
      venue: 'St. Andrew’s Church, Nyerere Road',
      address: 'Nyerere Road, Nairobi',
      city: 'Nairobi, Kenya',
      heroImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
      rsvpDeadline: '15 November 2026',
      createdAt: '2026-10-08T08:00:00Z',
      updatedAt: '2026-10-11T11:00:00Z',
    };
    this.events.set(memorialEvent.id, memorialEvent);

    // 3. Seed Guests
    const g1: GuestHouseholdEntity = {
      id: 'guest-1',
      eventId: 'event-wedding-1',
      displayName: 'Dr. Peter Otieno & Family',
      group: 'Family',
      contactPhone: '+254 712 345 678',
      contactEmail: 'peter.otieno@example.com',
      allowedPlusOnes: 3,
      token: 'tok_wanjiku_fam_84a9f',
      tokenHash: 'hash_84a9f',
      status: 'attending',
      notes: 'Uncle from Kisumu',
      createdAt: '2026-10-02T10:00:00Z',
      updatedAt: '2026-10-05T12:00:00Z',
    };
    const g2: GuestHouseholdEntity = {
      id: 'guest-2',
      eventId: 'event-wedding-1',
      displayName: 'Grace & Brian Mwangi',
      group: 'Friends',
      contactPhone: '+254 722 987 654',
      contactEmail: 'grace.mwangi@example.com',
      allowedPlusOnes: 1,
      token: 'tok_grace_brian_19d4e',
      tokenHash: 'hash_19d4e',
      status: 'attending',
      createdAt: '2026-10-02T10:05:00Z',
      updatedAt: '2026-10-06T15:20:00Z',
    };
    const g3: GuestHouseholdEntity = {
      id: 'guest-3',
      eventId: 'event-wedding-1',
      displayName: 'Hon. David Kiprono',
      group: 'VIP',
      contactPhone: '+254 733 112 233',
      allowedPlusOnes: 1,
      token: 'tok_hon_kiprono_77c2a',
      tokenHash: 'hash_77c2a',
      status: 'pending',
      createdAt: '2026-10-02T10:10:00Z',
      updatedAt: '2026-10-02T10:10:00Z',
    };
    this.guests.set(g1.id, g1);
    this.guests.set(g2.id, g2);
    this.guests.set(g3.id, g3);

    // 4. Seed Attendees
    const att1: AttendeeEntity = {
      id: 'att-1',
      householdId: 'guest-1',
      eventId: 'event-wedding-1',
      name: 'Dr. Peter Otieno',
      status: 'attending',
      mealPreference: 'Chicken & Pilau',
      dietaryRestrictions: 'None',
    };
    const att2: AttendeeEntity = {
      id: 'att-2',
      householdId: 'guest-1',
      eventId: 'event-wedding-1',
      name: 'Mrs. Mary Otieno',
      status: 'attending',
      mealPreference: 'Vegetarian',
      dietaryRestrictions: 'Lactose intolerant',
    };
    this.attendees.set(att1.id, att1);
    this.attendees.set(att2.id, att2);

    // 5. Seed RSVPs
    const r1: RSVPSubmissionEntity = {
      id: 'rsvp-1',
      eventId: 'event-wedding-1',
      householdId: 'guest-1',
      primaryName: 'Dr. Peter Otieno',
      contact: '+254 712 345 678',
      status: 'yes',
      attendeeCount: 3,
      dietaryRequirements: 'One vegetarian meal, one lactose-free',
      songRequest: 'Sauti Sol — Suzanna',
      noteToHost: 'Congratulations Kevin & Wanjiku! We look forward to celebrating your great day.',
      submittedAt: '2026-10-05T12:00:00Z',
    };
    this.rsvps.set(r1.id, r1);
  }

  getDiagnostics(): AdapterDiagnostics {
    return {
      name: 'Kadi In-Memory Sandbox Adapter',
      isPersistent: false,
      driver: 'memory',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  // Users
  async getUserById(id: string): Promise<UserEntity | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    const normalized = email.trim().toLowerCase();
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === normalized);
  }

  async createUser(data: Omit<UserEntity, 'id' | 'createdAt'> & { id?: string; passwordHash: string }): Promise<UserEntity> {
    const id = data.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const user: UserEntity = {
      id,
      email: data.email.trim().toLowerCase(),
      name: data.name.trim(),
      role: data.role || 'host',
      createdAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);
    this.userPasswords.set(user.id, data.passwordHash);
    return user;
  }

  async getUserPasswordHash(userId: string): Promise<string | undefined> {
    return this.userPasswords.get(userId);
  }

  // Events
  async listEvents(hostId: string): Promise<EventEntity[]> {
    return Array.from(this.events.values()).filter(
      (e) => e.hostId === hostId && e.status !== 'archived'
    );
  }

  async getEventById(id: string): Promise<EventEntity | undefined> {
    return this.events.get(id);
  }

  async getEventBySlug(slug: string): Promise<EventEntity | undefined> {
    const direct = Array.from(this.events.values()).find((e) => e.slug === slug);
    if (direct) return direct;

    const slugAliases: Record<string, string> = {
      'amani-zawadi-wedding': 'kevin-and-wanjiku',
      'otieno-at-50': 'maina-50',
      'celebrating-mama-wambui': 'mama-sarah-wambui',
    };
    const target = slugAliases[slug];
    if (target) {
      return Array.from(this.events.values()).find((e) => e.slug === target);
    }
    return undefined;
  }

  async createEvent(event: Partial<EventEntity> & { hostId: string; title: string }): Promise<EventEntity> {
    const id = event.id || `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newEvent: EventEntity = {
      ...event,
      id,
      hostId: event.hostId,
      title: event.title,
      subtitle: event.subtitle || '',
      slug: event.slug || `event-${Math.random().toString(36).substring(2, 7)}`,
      category: event.category || 'wedding',
      status: event.status || 'draft',
      templateId: event.templateId || 'savannah-twilight',
      templateVersion: event.templateVersion || '1.0.0',
      hosts: event.hosts || 'Host',
      celebrants: event.celebrants || event.title,
      date: event.date || 'Saturday, 12 December 2026',
      time: event.time || '2:00 PM EAT',
      timezone: 'Africa/Nairobi',
      venue: event.venue || 'Nairobi, Kenya',
      city: event.city || 'Nairobi',
      heroImage: event.heroImage || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      rsvpDeadline: event.rsvpDeadline || '1 December 2026',
      createdAt: event.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.events.set(newEvent.id, newEvent);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<EventEntity>): Promise<EventEntity> {
    const existing = this.events.get(id);
    if (!existing) throw new Error('Event not found');
    const updated: EventEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const existed = this.events.delete(id);
    this.designs.delete(id);
    return existed;
  }

  // Event Designs
  async getEventDesign(eventId: string): Promise<EventDesignEntity | undefined> {
    return this.designs.get(eventId);
  }

  async saveEventDesign(eventId: string, design: Partial<EventDesignEntity>): Promise<EventDesignEntity> {
    const existing = this.designs.get(eventId);
    const fullDesign: EventDesignEntity = {
      eventId,
      motionPreset: design.motionPreset || existing?.motionPreset || 'classic-stationery',
      palette: design.palette || existing?.palette || {
        primary: '#934638',
        secondary: '#B99A62',
        accent: '#A94F51',
        envelope: '#4A0E17',
        flap: '#5A101D',
        cardBackground: '#FCFCF9',
      },
      linerId: design.linerId || existing?.linerId || 'gold-foil',
      sealShape: design.sealShape || existing?.sealShape || 'diamond',
      sealMonogram: design.sealMonogram || existing?.sealMonogram || 'K',
      sealColor: design.sealColor || existing?.sealColor || '#8B1524',
      visibleSections: design.visibleSections || existing?.visibleSections || ['hero', 'schedule', 'venue', 'rsvp'],
      sectionOrder: design.sectionOrder || existing?.sectionOrder,
      ...design,
    };
    this.designs.set(eventId, fullDesign);
    return fullDesign;
  }

  // Guests
  async listGuests(eventId: string, search?: string, group?: string): Promise<GuestHouseholdEntity[]> {
    let list = Array.from(this.guests.values()).filter((g) => g.eventId === eventId);
    if (group && group !== 'all') {
      list = list.filter((g) => g.group.toLowerCase() === group.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.displayName.toLowerCase().includes(q) ||
          g.contactPhone?.toLowerCase().includes(q) ||
          g.contactEmail?.toLowerCase().includes(q) ||
          g.group.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getGuestById(id: string): Promise<GuestHouseholdEntity | undefined> {
    return this.guests.get(id);
  }

  async getGuestByTokenHash(tokenHash: string): Promise<GuestHouseholdEntity | undefined> {
    return Array.from(this.guests.values()).find((g) => g.tokenHash === tokenHash);
  }

  async createGuest(data: Omit<GuestHouseholdEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<GuestHouseholdEntity> {
    const id = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const guest: GuestHouseholdEntity = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.guests.set(guest.id, guest);
    return guest;
  }

  async createManyGuests(items: Array<Omit<GuestHouseholdEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<GuestHouseholdEntity[]> {
    const results: GuestHouseholdEntity[] = [];
    for (const item of items) {
      const g = await this.createGuest(item);
      results.push(g);
    }
    return results;
  }

  async updateGuest(id: string, updates: Partial<GuestHouseholdEntity>): Promise<GuestHouseholdEntity> {
    const existing = this.guests.get(id);
    if (!existing) throw new Error('Guest not found');
    const updated: GuestHouseholdEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.guests.set(id, updated);
    return updated;
  }

  async deleteGuest(id: string): Promise<boolean> {
    return this.guests.delete(id);
  }

  // Attendees
  async listAttendees(eventId: string, householdId?: string): Promise<AttendeeEntity[]> {
    let list = Array.from(this.attendees.values()).filter((a) => a.eventId === eventId);
    if (householdId) {
      list = list.filter((a) => a.householdId === householdId);
    }
    return list;
  }

  async createAttendee(data: Omit<AttendeeEntity, 'id'>): Promise<AttendeeEntity> {
    const id = `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const attendee: AttendeeEntity = { ...data, id };
    this.attendees.set(attendee.id, attendee);
    return attendee;
  }

  async deleteAttendeesByHousehold(householdId: string): Promise<boolean> {
    let deleted = false;
    Array.from(this.attendees.entries()).forEach(([id, a]) => {
      if (a.householdId === householdId) {
        this.attendees.delete(id);
        deleted = true;
      }
    });
    return deleted;
  }

  // RSVPs
  async listRSVPs(eventId: string): Promise<RSVPSubmissionEntity[]> {
    return Array.from(this.rsvps.values()).filter((r) => r.eventId === eventId);
  }

  async getRSVPByHousehold(householdId: string): Promise<RSVPSubmissionEntity | undefined> {
    return Array.from(this.rsvps.values()).find((r) => r.householdId === householdId);
  }

  async createRSVP(data: Omit<RSVPSubmissionEntity, 'id' | 'submittedAt'>): Promise<RSVPSubmissionEntity> {
    const id = `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const rsvp: RSVPSubmissionEntity = {
      ...data,
      id,
      submittedAt: new Date().toISOString(),
    };
    this.rsvps.set(rsvp.id, rsvp);
    return rsvp;
  }

  async updateRSVP(id: string, updates: Partial<RSVPSubmissionEntity>): Promise<RSVPSubmissionEntity> {
    const existing = this.rsvps.get(id);
    if (!existing) throw new Error('RSVP not found');
    const updated: RSVPSubmissionEntity = {
      ...existing,
      ...updates,
      submittedAt: new Date().toISOString(),
    };
    this.rsvps.set(id, updated);
    return updated;
  }

  // Condolences
  async listCondolences(eventId: string): Promise<CondolenceEntity[]> {
    return Array.from(this.condolences.values()).filter((c) => c.eventId === eventId);
  }

  async createCondolence(data: Omit<CondolenceEntity, 'id' | 'createdAt'>): Promise<CondolenceEntity> {
    const id = `cond-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const condolence: CondolenceEntity = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    this.condolences.set(condolence.id, condolence);
    return condolence;
  }
}
