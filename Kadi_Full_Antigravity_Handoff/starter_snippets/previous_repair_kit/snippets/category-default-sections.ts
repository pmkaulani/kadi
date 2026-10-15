import type { EventCategory } from '@/lib/events/categories';

/**
 * Shared default section order for publication, design previews and new drafts.
 * Intro/hero content belongs to EnvelopeRenderer rather than this list.
 */
export const DEFAULT_INVITATION_SECTIONS: Partial<Record<EventCategory, string[]>> = {
  wedding: ['story', 'ceremony', 'schedule', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
  birthday: ['about', 'activities', 'schedule', 'gallery', 'rsvp', 'faq', 'registry', 'closing'],
  memorial: ['obituary', 'services', 'livestream', 'candles', 'condolences', 'rsvp', 'registry', 'closing'],
  funeral: ['obituary', 'services', 'livestream', 'candles', 'condolences', 'rsvp', 'closing'],
  housewarming: ['venue', 'schedule', 'story', 'gallery', 'faq', 'rsvp', 'closing'],
  graduation: ['ceremony', 'schedule', 'story', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
  corporate: ['schedule', 'venue', 'faq', 'rsvp', 'closing'],
  anniversary: ['story', 'ceremony', 'schedule', 'gallery', 'rsvp', 'closing'],
  engagement: ['story', 'schedule', 'gallery', 'rsvp', 'closing'],
  'baby-shower': ['about', 'activities', 'registry', 'rsvp', 'closing'],
  'bridal-shower': ['schedule', 'gallery', 'rsvp', 'closing'],
  holiday: ['activities', 'schedule', 'rsvp', 'closing'],
  reunion: ['story', 'schedule', 'gallery', 'rsvp', 'closing'],
  'religious-milestone': ['story', 'schedule', 'venue', 'rsvp', 'closing'],
  'cultural-celebration': ['story', 'schedule', 'gallery', 'rsvp', 'closing'],
  retirement: ['about', 'schedule', 'gallery', 'rsvp', 'closing'],
  'product-launch': ['schedule', 'venue', 'faq', 'rsvp', 'closing'],
  fundraiser: ['story', 'schedule', 'venue', 'registry', 'rsvp', 'closing'],
  community: ['schedule', 'venue', 'faq', 'rsvp', 'closing'],
  'welcome-baby': ['about', 'gallery', 'closing'],
  farewell: ['story', 'schedule', 'gallery', 'rsvp', 'closing'],
  'get-well': ['about', 'closing'],
  custom: ['story', 'schedule', 'gallery', 'faq', 'rsvp', 'closing'],
};

export function getDefaultInvitationSections(category: EventCategory): string[] {
  return [...(DEFAULT_INVITATION_SECTIONS[category] || ['venue', 'schedule', 'gallery', 'faq', 'rsvp', 'closing'])];
}
