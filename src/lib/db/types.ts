import type { EventCategory } from '@/lib/events/categories';

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
  category: EventCategory;
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
  galleryImages?: string[];
  accommodationUrl?: string;
  googleMapsUrl?: string;
  openingPhrase?: string;
  houseRules?: string[];
  milestoneAge?: number;
  rsvpDeadline: string;
  maxCapacity?: number;
  allowsChildren?: boolean;
  audioUrl?: string;
  countdownLabel?: string;
  mpesaType?: 'till' | 'paybill' | 'send_money';
  mpesaNumber?: string;
  mpesaRecipient?: string;
  mpesaReference?: string;
  // Registration policy & custom questions extensions
  rsvpEnabled?: boolean;
  capacityWaitlist?: boolean;
  requireApproval?: boolean;
  allowUntokenizedRsvp?: boolean;
  allowedPlusOnesDefault?: number;
  customQuestions?: CustomRSVPQuestion[];
  // Rich data-driven section extensions
  ourStoryMilestones?: Array<{
    yearOrDate: string;
    title: string;
    story: string;
    image?: string;
    location?: string;
  }>;
  ceremonyDetails?: {
    name: string;
    time?: string;
    address: string;
    mapUrl?: string;
    directions?: string;
    dressCode?: string;
    dressCodeColors?: string[];
  };
  receptionDetails?: {
    name: string;
    time?: string;
    address: string;
    mapUrl?: string;
    directions?: string;
  };
  programmeSchedule?: Array<{
    time: string;
    title: string;
    description?: string;
    icon?: string;
    location?: string;
  }>;
  faqItems?: Array<{
    question: string;
    answer: string;
    category?: string;
  }>;
  birthdayAbout?: {
    bio?: string;
    facts?: string[];
    heading?: string;
  };
  birthdayActivities?: Array<{
    title: string;
    description: string;
    time?: string;
  }>;
  birthdayMenu?: {
    items: string[];
    drinksPolicy?: string;
    cakeNote?: string;
  };
  memorialObituary?: {
    biography: string;
    birthDate?: string;
    deathDate?: string;
    epitaph?: string;
  };
  memorialServices?: Array<{
    name: string;
    date: string;
    time: string;
    venue: string;
    address?: string;
    mapUrl?: string;
    type: 'service' | 'burial' | 'viewing';
  }>;
  memorialOrderOfService?: Array<{
    time?: string;
    item: string;
    participant?: string;
    notes?: string;
  }>;
  virtualCandlesCount?: number;
  livestreamUrl?: string;
  livestreamStatus?: 'upcoming' | 'live' | 'ended' | 'none';
  blocks?: import('@/lib/blocks/types').InvitationBlockConfig[];
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
    text?: string;
  };
  linerId: string;
  sealShape: 'circle' | 'diamond' | 'shield';
  sealMonogram: string;
  sealColor: string;
  visibleSections: string[];
  sectionOrder?: string[];
  fontFamily?: string;
  envelopeStyle?: 'classic-fold' | 'pocket-fold' | 'scalloped-edge' | 'minimal';
  letterStyle?: 'printed-letter' | 'handwritten-letter' | 'folded-card';
  backgroundAnimation?: 'none' | 'petals' | 'confetti' | 'bokeh' | 'leaves' | 'snow' | 'candles';
  scrollAnimation?: 'none' | 'fade-up' | 'slide-in' | 'scale-in' | 'parallax';
  transitionSpeed?: 'slow' | 'medium' | 'fast';
  layoutSpacing?: 'compact' | 'comfortable' | 'spacious';
  cardPadding?: 'normal' | 'generous' | 'minimal';
  imageCropFocalPosition?: string;
  headingTracking?: 'tight' | 'normal' | 'wide';
  headingLineHeight?: 'tight' | 'snug' | 'normal';
  countdownLabel?: string;
  blocks?: import('@/lib/blocks/types').InvitationBlockConfig[];
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    scale?: number;
    headingLetterSpacing?: number;
    bodyLineHeight?: number;
  };
  layoutPreset?: {
    spacing?: 'compact' | 'comfortable' | 'spacious';
    cornerStyle?: 'square' | 'soft' | 'round' | 'pill';
    borderStyle?: 'none' | 'thin' | 'thick' | 'dotted';
  };
}

export interface CustomRSVPQuestion {
  id: string;
  prompt: string;
  type: 'text' | 'choice' | 'checkboxes';
  options?: string[];
  required?: boolean;
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
  passCode?: string; // Random check-in pass ID for physical/QR check-in
  status: RSVPStatus;
  checkedIn?: boolean;
  checkedInAt?: string;
  hasConsented?: boolean;
  optedOut?: boolean;
  optedOutAt?: string;
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
  customAnswers?: Record<string, string | string[]>;
  isWaitlisted?: boolean;
  isApproved?: boolean;
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

export type CoHostRole = 'owner' | 'manager' | 'guest_manager' | 'check_in_staff';
export type CoHostStatus = 'pending' | 'accepted' | 'revoked';

export interface CoHostEntity {
  id: string;
  eventId: string;
  email: string;
  name?: string;
  role: CoHostRole;
  status: CoHostStatus;
  inviteToken: string;
  invitedAt: string;
  acceptedAt?: string;
  invitedBy?: string;
}

export interface CheckInRecordEntity {
  id: string;
  eventId: string;
  guestId: string;
  passCode: string;
  guestName: string;
  checkedInAt: string;
  checkedInBy: string;
  status: 'checked_in' | 'undone';
  undoneAt?: string;
  undoneBy?: string;
}

export type MessageChannel =
  | 'whatsapp_cloud'
  | 'sms'
  | 'email'
  | 'manual_whatsapp'
  | 'manual_link';

export type MessageDeliveryStatus =
  | 'draft'
  | 'scheduled'
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'partial'
  | 'unconfigured'
  | 'cancelled';

export type MessageAuditAction =
  | 'link_shared'
  | 'message_composed'
  | 'message_sent'
  | 'message_delivered'
  | 'delivery_failed'
  | 'reminder_scheduled'
  | 'reminder_cancelled'
  | 'event_updated';

export interface MessageJobEntity {
  id: string;
  eventId: string;
  idempotencyKey: string;
  subject?: string;
  body: string;
  channel: MessageChannel;
  audienceFilter: string; // 'all' | 'pending' | 'attending' | 'declined' | 'waitlisted' | 'checked_in' | 'group:<name>'
  targetGuestIds: string[];
  successfulGuestIds: string[];
  failedGuestIds: string[];
  status: MessageDeliveryStatus;
  scheduledFor?: string; // ISO string with timezone awareness
  timezone?: string;
  createdAt: string;
  sentAt?: string;
  createdBy: string;
  providerMessageIds?: Record<string, string>;
  failureReason?: string;
  isTestMessage?: boolean;
}

export interface MessageAuditRecordEntity {
  id: string;
  eventId: string;
  messageJobId?: string;
  guestId?: string;
  action: MessageAuditAction;
  channel?: MessageChannel;
  details: string;
  actorId: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

export interface InAppNotificationEntity {
  id: string;
  eventId: string;
  userId: string;
  type: 'success' | 'guest_response' | 'save_failure' | 'reminder_failure' | 'action_required';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface NotificationPreferencesEntity {
  eventId: string;
  userId: string;
  notifyOnRsvp: boolean;
  notifyOnContribution: boolean;
  notifyOnCheckIn: boolean;
  notifyOnReminderFailure: boolean;
  digestFrequency: 'immediate' | 'daily' | 'off';
}


