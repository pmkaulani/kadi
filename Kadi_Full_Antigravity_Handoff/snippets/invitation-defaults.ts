import type { InvitationBlockType } from './invitation-config.types';

/** Canonical starting sequences. Use canonical EventCategory ids from the app; don't fork the enum. */
export const DEFAULT_BLOCKS_BY_CATEGORY: Record<string, InvitationBlockType[]> = {
  wedding: ['hero', 'rich-text', 'timeline', 'venue-map', 'gallery', 'countdown', 'rsvp', 'contribution', 'faq'],
  engagement: ['hero', 'rich-text', 'venue-map', 'gallery', 'countdown', 'rsvp', 'faq'],
  anniversary: ['hero', 'rich-text', 'gallery', 'timeline', 'venue-map', 'rsvp'],
  birthday: ['hero', 'rich-text', 'timeline', 'venue-map', 'gallery', 'rsvp', 'contribution', 'faq'],
  graduation: ['hero', 'rich-text', 'timeline', 'venue-map', 'gallery', 'countdown', 'rsvp'],
  housewarming: ['hero', 'rich-text', 'photo', 'venue-map', 'rsvp', 'faq'],
  memorial: ['hero', 'rich-text', 'gallery', 'timeline', 'venue-map', 'guestbook', 'livestream'],
  funeral: ['hero', 'rich-text', 'timeline', 'venue-map', 'gallery', 'guestbook', 'livestream'],
  'baby-shower': ['hero', 'rich-text', 'venue-map', 'gallery', 'rsvp', 'contribution', 'faq'],
  'bridal-shower': ['hero', 'rich-text', 'timeline', 'venue-map', 'gallery', 'rsvp', 'faq'],
  corporate: ['hero', 'rich-text', 'timeline', 'venue-map', 'rsvp', 'faq'],
  'product-launch': ['hero', 'rich-text', 'timeline', 'venue-map', 'gallery', 'rsvp', 'faq'],
  holiday: ['hero', 'rich-text', 'timeline', 'venue-map', 'gallery', 'rsvp'],
  reunion: ['hero', 'rich-text', 'gallery', 'timeline', 'venue-map', 'rsvp'],
  'religious-milestone': ['hero', 'rich-text', 'timeline', 'venue-map', 'rsvp', 'faq'],
  'cultural-celebration': ['hero', 'rich-text', 'timeline', 'venue-map', 'gallery', 'rsvp'],
  retirement: ['hero', 'rich-text', 'timeline', 'gallery', 'venue-map', 'rsvp'],
  fundraiser: ['hero', 'rich-text', 'timeline', 'venue-map', 'contribution', 'rsvp', 'faq'],
  community: ['hero', 'rich-text', 'timeline', 'venue-map', 'rsvp', 'faq'],
  'welcome-baby': ['hero', 'rich-text', 'gallery', 'rsvp'],
  farewell: ['hero', 'rich-text', 'gallery', 'timeline', 'venue-map', 'rsvp'],
  'get-well': ['hero', 'rich-text', 'gallery', 'guestbook'],
  custom: ['hero', 'rich-text', 'photo', 'venue-map', 'rsvp', 'faq'],
};

export const MOTION_BLACKLIST_BY_CATEGORY: Record<string, string[]> = {
  funeral: ['confetti', 'disco', 'bouncy-party', 'doves-fly-across-screen'],
  memorial: ['confetti', 'disco', 'bouncy-party', 'doves-fly-across-screen'],
  'get-well': ['confetti', 'disco', 'heavy-parallax'],
};
