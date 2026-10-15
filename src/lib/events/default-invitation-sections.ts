/**
 * Canonical default invitation sections per category.
 * Used across the studio editor, preview renderer, and public guest pages
 * to ensure 100% parity.
 */
import { EVENT_CATEGORY_IDS, type EventCategory } from './categories';

export const ALL_INVITATION_SECTIONS = [
  'story',
  'ceremony',
  'venue',
  'schedule',
  'about',
  'activities',
  'obituary',
  'services',
  'livestream',
  'candles',
  'condolences',
  'gallery',
  'faq',
  'registry',
  'rsvp',
  'closing',
] as const;

export type InvitationSectionKey = (typeof ALL_INVITATION_SECTIONS)[number];

export const SECTION_METADATA: Record<
  InvitationSectionKey,
  { label: string; description: string; categoryRestriction?: EventCategory[] }
> = {
  story: {
    label: 'Our Story & Milestones',
    description: 'Personal love story, history, or milestone narrative with photos',
  },
  ceremony: {
    label: 'Ceremony & Reception Details',
    description: 'Specific venue, times, and dress code for the ceremony and reception',
  },
  venue: {
    label: 'Venue & Location',
    description: 'Event address, map direction note, and add-to-calendar actions',
  },
  schedule: {
    label: 'Programme & Schedule',
    description: 'Chronological timeline of activities and proceedings',
  },
  about: {
    label: 'About & Honouree Profile',
    description: 'Biography, fun facts, and milestone spotlight for celebrants',
  },
  activities: {
    label: 'Activities & Menu',
    description: 'Planned games, meal courses, and refreshments',
  },
  obituary: {
    label: 'Obituary & Biography',
    description: 'Life celebration history, birth/passing dates, and epitaph',
  },
  services: {
    label: 'Memorial Services',
    description: 'Requiem mass, viewing, church service, and burial logistics',
  },
  livestream: {
    label: 'Livestream Broadcast',
    description: 'Live video embed or link for diaspora and remote guests',
  },
  candles: {
    label: 'Virtual Candles & Tributes',
    description: 'Interactive tribute wall with candle lighting',
  },
  condolences: {
    label: 'Condolence Messages',
    description: 'Community guestbook for messages of comfort',
  },
  gallery: {
    label: 'Photo Gallery',
    description: 'Curated photo collection and memorable moments',
  },
  faq: {
    label: 'Frequently Asked Questions',
    description: 'Dress code, parking, children policy, and accommodations',
  },
  registry: {
    label: 'M-Pesa Gift Registry & Harambee',
    description: 'Direct Till, Paybill, or send money details for blessings',
  },
  rsvp: {
    label: 'RSVP Form',
    description: 'Guest attendance confirmation with meal and plus-one counts',
  },
  closing: {
    label: 'Closing & Sign-off',
    description: 'Warm closing message, hosts signature, and calendar links',
  },
};

export const DEFAULT_SECTIONS_BY_CATEGORY: Record<EventCategory, InvitationSectionKey[]> = {
  wedding: ['story', 'ceremony', 'schedule', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
  engagement: ['story', 'venue', 'schedule', 'gallery', 'faq', 'rsvp', 'closing'],
  anniversary: ['story', 'ceremony', 'schedule', 'gallery', 'rsvp', 'closing'],
  birthday: ['about', 'activities', 'schedule', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
  graduation: ['ceremony', 'schedule', 'story', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
  housewarming: ['venue', 'schedule', 'story', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
  memorial: ['obituary', 'services', 'livestream', 'candles', 'condolences', 'rsvp', 'registry', 'closing'],
  funeral: ['obituary', 'services', 'livestream', 'candles', 'condolences', 'rsvp', 'closing'],
  'baby-shower': ['about', 'activities', 'registry', 'rsvp', 'closing'],
  'bridal-shower': ['about', 'activities', 'schedule', 'gallery', 'registry', 'rsvp', 'closing'],
  corporate: ['schedule', 'venue', 'faq', 'rsvp', 'closing'],
  holiday: ['activities', 'schedule', 'venue', 'rsvp', 'closing'],
  reunion: ['schedule', 'story', 'gallery', 'faq', 'rsvp', 'closing'],
  'religious-milestone': ['ceremony', 'schedule', 'gallery', 'rsvp', 'closing'],
  'cultural-celebration': ['schedule', 'activities', 'gallery', 'faq', 'rsvp', 'closing'],
  retirement: ['about', 'schedule', 'gallery', 'rsvp', 'closing'],
  'product-launch': ['schedule', 'venue', 'gallery', 'faq', 'rsvp', 'closing'],
  fundraiser: ['story', 'registry', 'schedule', 'faq', 'rsvp', 'closing'],
  community: ['schedule', 'venue', 'activities', 'faq', 'rsvp', 'closing'],
  'welcome-baby': ['about', 'gallery', 'registry', 'rsvp', 'closing'],
  farewell: ['about', 'schedule', 'gallery', 'rsvp', 'closing'],
  'get-well': ['about', 'condolences', 'rsvp', 'closing'],
  custom: ['venue', 'schedule', 'gallery', 'faq', 'rsvp', 'closing'],
};

/**
 * Returns the canonical default section order for any event category.
 * Falls back to sensible wedding/general sections if category is unknown.
 */
export function getDefaultInvitationSections(category?: string): string[] {
  if (category && category in DEFAULT_SECTIONS_BY_CATEGORY) {
    return [...DEFAULT_SECTIONS_BY_CATEGORY[category as EventCategory]];
  }
  return ['venue', 'schedule', 'gallery', 'faq', 'registry', 'rsvp', 'closing'];
}

/**
 * Returns available sections for a category (including those not enabled by default).
 */
export function getAvailableSectionsForCategory(category?: string): InvitationSectionKey[] {
  const isMemorial = category === 'memorial' || category === 'funeral';
  const isBirthday = category === 'birthday' || category === 'welcome-baby' || category === 'baby-shower';

  return ALL_INVITATION_SECTIONS.filter((section) => {
    if (isMemorial) {
      // Don't show birthday-specific sections for memorial/funeral
      if (section === 'activities' || section === 'about') return false;
      return true;
    }
    // Don't show memorial-specific sections for celebratory events
    if (section === 'obituary' || section === 'services' || section === 'candles') return false;
    return true;
  });
}
