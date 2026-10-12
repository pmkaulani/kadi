export type EventStatus = 'draft' | 'published' | 'archived';
export type RSVPStatus = 'yes' | 'no' | 'maybe' | 'pending' | 'attending';

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  role: 'host' | 'planner' | 'admin';
  createdAt: string;
}

export interface EventEntity {
  id: string;
  hostId: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: 'wedding' | 'birthday' | 'memorial' | 'baby-shower' | 'graduation' | 'anniversary' | 'corporate' | 'community' | 'custom';
  status: EventStatus;
  templateId: string;
  templateVersion: string;
  hosts: string;
  celebrants: string;
  date: string;
  time: string;
  timezone: string;
  venue: string;
  address?: string;
  city: string;
  directionsNote?: string;
  dressCode?: string;
  story?: string;
  heroImage: string;
  rsvpDeadline: string;
  maxCapacity?: number;
  allowsChildren?: boolean;
  audioUrl?: string;
  mpesaType?: 'till' | 'paybill' | 'send_money';
  mpesaNumber?: string;
  mpesaRecipient?: string;
  mpesaReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventDesignEntity {
  eventId: string;
  motionPreset: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    envelope: string;
    flap: string;
    cardBackground: string;
  };
  linerId: string;
  sealShape: 'circle' | 'diamond' | 'shield';
  sealMonogram: string;
  sealColor: string;
  visibleSections: string[];
}

export interface GuestHouseholdEntity {
  id: string;
  eventId: string;
  displayName: string; // e.g. "Dr. Peter Otieno & Family"
  group: string; // e.g. "Bridal Party", "Family", "VIP", "Friends"
  contactPhone?: string;
  contactEmail?: string;
  allowedPlusOnes: number;
  token: string; // High-entropy unhashed token for link generation
  tokenHash: string; // SHA-256 for secure verification
  status: RSVPStatus;
  notes?: string;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendeeEntity {
  id: string;
  householdId: string;
  eventId: string;
  name: string;
  status: RSVPStatus;
  mealPreference?: string;
  dietaryRestrictions?: string;
}

export interface RSVPSubmissionEntity {
  id: string;
  eventId: string;
  householdId?: string;
  primaryName: string;
  contact: string;
  status: 'yes' | 'no' | 'maybe';
  attendeeCount: number;
  dietaryRequirements?: string;
  songRequest?: string;
  noteToHost?: string;
  submittedAt: string;
}

export interface CondolenceEntity {
  id: string;
  eventId: string;
  author: string;
  message: string;
  status: 'approved' | 'pending';
  createdAt: string;
}
