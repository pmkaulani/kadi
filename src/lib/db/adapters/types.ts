import type {
  UserEntity,
  EventEntity,
  EventDesignEntity,
  GuestHouseholdEntity,
  AttendeeEntity,
  RSVPSubmissionEntity,
  CondolenceEntity,
} from '../types';

export interface AdapterDiagnostics {
  name: string;
  isPersistent: boolean;
  driver: 'memory' | 'postgres';
  environment: string;
}

export interface IDatabaseAdapter {
  // Diagnostics
  getDiagnostics(): AdapterDiagnostics;

  // Users
  getUserById(id: string): Promise<UserEntity | undefined>;
  getUserByEmail(email: string): Promise<UserEntity | undefined>;
  createUser(user: Omit<UserEntity, 'id' | 'createdAt'> & { id?: string; passwordHash: string }): Promise<UserEntity>;
  getUserPasswordHash(userId: string): Promise<string | undefined>;

  // Events
  listEvents(hostId: string): Promise<EventEntity[]>;
  getEventById(id: string): Promise<EventEntity | undefined>;
  getEventBySlug(slug: string): Promise<EventEntity | undefined>;
  createEvent(event: Partial<EventEntity> & { hostId: string; title: string }): Promise<EventEntity>;
  updateEvent(id: string, updates: Partial<EventEntity>): Promise<EventEntity>;
  deleteEvent(id: string): Promise<boolean>;

  // Event Designs
  getEventDesign(eventId: string): Promise<EventDesignEntity | undefined>;
  saveEventDesign(eventId: string, design: Partial<EventDesignEntity>): Promise<EventDesignEntity>;

  // Guests & Households
  listGuests(eventId: string, search?: string, group?: string): Promise<GuestHouseholdEntity[]>;
  getGuestById(id: string): Promise<GuestHouseholdEntity | undefined>;
  getGuestByTokenHash(tokenHash: string): Promise<GuestHouseholdEntity | undefined>;
  createGuest(guest: Omit<GuestHouseholdEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<GuestHouseholdEntity>;
  createManyGuests(guests: Array<Omit<GuestHouseholdEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<GuestHouseholdEntity[]>;
  updateGuest(id: string, updates: Partial<GuestHouseholdEntity>): Promise<GuestHouseholdEntity>;
  deleteGuest(id: string): Promise<boolean>;

  // Attendees (named individuals)
  listAttendees(eventId: string, householdId?: string): Promise<AttendeeEntity[]>;
  createAttendee(attendee: Omit<AttendeeEntity, 'id'>): Promise<AttendeeEntity>;
  deleteAttendeesByHousehold(householdId: string): Promise<boolean>;

  // RSVPs
  listRSVPs(eventId: string): Promise<RSVPSubmissionEntity[]>;
  getRSVPByHousehold(householdId: string): Promise<RSVPSubmissionEntity | undefined>;
  createRSVP(rsvp: Omit<RSVPSubmissionEntity, 'id' | 'submittedAt'>): Promise<RSVPSubmissionEntity>;
  updateRSVP(id: string, updates: Partial<RSVPSubmissionEntity>): Promise<RSVPSubmissionEntity>;

  // Condolences
  listCondolences(eventId: string): Promise<CondolenceEntity[]>;
  createCondolence(condolence: Omit<CondolenceEntity, 'id' | 'createdAt'>): Promise<CondolenceEntity>;
}
