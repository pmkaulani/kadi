import { z } from 'zod';

export type InvitationBlockType =
  | 'hero'
  | 'rich-text'
  | 'photo'
  | 'gallery'
  | 'video'
  | 'venue-map'
  | 'countdown'
  | 'rsvp'
  | 'contribution'
  | 'timeline'
  | 'quote'
  | 'divider'
  | 'button'
  | 'faq'
  | 'music'
  | 'guestbook'
  | 'livestream';

export type ScrollMotion = 'none' | 'fade-up' | 'slide-in' | 'scale-in' | 'parallax';
export type SectionSpacing = 'compact' | 'comfortable' | 'spacious';
export type CornerStyle = 'square' | 'soft' | 'round' | 'pill';
export type BorderStyle = 'none' | 'thin' | 'thick' | 'dotted';
export type BlockMaxWidth = 'narrow' | 'standard' | 'wide' | 'full';
export type BlockTextAlign = 'left' | 'center' | 'right';

export interface CommonBlockSettings {
  padding: SectionSpacing;
  maxWidth: BlockMaxWidth;
  background?: string;
  textAlign: BlockTextAlign;
  scrollMotion: ScrollMotion;
  cornerStyle: CornerStyle;
  borderStyle: BorderStyle;
}

export const CommonBlockSettingsSchema = z.object({
  padding: z.enum(['compact', 'comfortable', 'spacious']).default('comfortable'),
  maxWidth: z.enum(['narrow', 'standard', 'wide', 'full']).default('standard'),
  background: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).default('center'),
  scrollMotion: z.enum(['none', 'fade-up', 'slide-in', 'scale-in', 'parallax']).default('fade-up'),
  cornerStyle: z.enum(['square', 'soft', 'round', 'pill']).default('soft'),
  borderStyle: z.enum(['none', 'thin', 'thick', 'dotted']).default('none'),
});

// 1. Hero Block
export interface HeroBlockContent {
  title: string;
  subtitle?: string;
  hosts?: string;
  celebrants?: string;
  date?: string;
  time?: string;
  venue?: string;
  city?: string;
  heroImage?: string;
  focalPoint?: string;
  tagline?: string;
}

// 2. Rich Text Block
export interface RichTextBlockContent {
  headline?: string;
  subheading?: string;
  body: string;
  styleVariant?: 'editorial' | 'script-accent' | 'monogram';
}

// 3. Photo Block
export interface PhotoBlockContent {
  imageUrl: string;
  caption?: string;
  altText?: string;
  focalPoint?: string;
  aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | 'portrait';
}

// 4. Gallery Block
export interface GalleryImageItem {
  url: string;
  caption?: string;
  alt?: string;
}

export interface GalleryBlockContent {
  title?: string;
  subtitle?: string;
  images: GalleryImageItem[];
  columns?: 2 | 3 | 4;
  layout?: 'grid' | 'masonry' | 'carousel';
}

// 5. Video Block (Strictly allowlisted YouTube & Vimeo only)
export interface VideoBlockContent {
  provider: 'youtube' | 'vimeo';
  videoId: string;
  title?: string;
  caption?: string;
  autoplay?: boolean;
}

// 6. Venue & Map Block
export interface VenueMapBlockContent {
  venueName: string;
  address?: string;
  city?: string;
  directionsNote?: string;
  googleMapsUrl?: string;
  appleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  locations?: Array<{
    id: string;
    label: string;
    venueName: string;
    address?: string;
    city?: string;
    directionsNote?: string;
    googleMapsUrl?: string;
    appleMapsUrl?: string;
    latitude?: number;
    longitude?: number;
    time?: string;
  }>;
  showMapButton?: boolean;
  showCalendarButton?: boolean;
}

// 7. Countdown Block
export interface CountdownBlockContent {
  targetDate: string;
  targetTime?: string;
  startIso?: string;
  timezone?: string;
  label?: string;
  celebrants?: string;
  todayMessage?: string;
  passedMessage?: string;
}

// 8. RSVP Block
export interface RSVPBlockContent {
  headline?: string;
  deadline?: string;
  instructions?: string;
  allowedPlusOnes?: number;
  showDietary?: boolean;
  showSongRequest?: boolean;
  buttonText?: string;
}

// 9. Contribution / Registry Block
export interface ContributionBlockContent {
  title?: string;
  instructions?: string;
  type: 'till' | 'paybill' | 'send_money';
  number: string;
  recipientName: string;
  accountReference?: string;
  notes?: string;
}

// 10. Timeline / Schedule Block
export interface TimelineItem {
  time: string;
  title: string;
  description?: string;
  location?: string;
  icon?: string;
}

export interface TimelineBlockContent {
  title?: string;
  subtitle?: string;
  items: TimelineItem[];
}

// 11. Quote Block
export interface QuoteBlockContent {
  quote: string;
  attribution?: string;
  context?: string;
  style?: 'script' | 'serif' | 'minimal';
}

// 12. Divider Block
export interface DividerBlockContent {
  style: 'line' | 'flourish' | 'dots' | 'wave';
  spacing?: 'compact' | 'normal' | 'spacious';
}

// 13. Button / Call to Action Block
export interface ButtonBlockContent {
  label: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline';
  openInNewTab?: boolean;
  subtext?: string;
}

// 14. FAQ Block
export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface FAQBlockContent {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}

// 15. Music Player Block
export interface MusicBlockContent {
  audioUrl: string;
  title?: string;
  artist?: string;
  autoPlayNotice?: string;
}

// 16. Guestbook / Tributes Block
export interface GuestbookBlockContent {
  title?: string;
  prompt?: string;
  allowCandles?: boolean;
  honoreeName?: string;
  moderationNotice?: string;
}

// 17. Livestream Block
export interface LivestreamBlockContent {
  provider: 'youtube' | 'vimeo' | 'external';
  streamUrl: string;
  status: 'scheduled' | 'live' | 'ended';
  title?: string;
  pinNote?: string;
}

export type BlockContentMap = {
  hero: HeroBlockContent;
  'rich-text': RichTextBlockContent;
  photo: PhotoBlockContent;
  gallery: GalleryBlockContent;
  video: VideoBlockContent;
  'venue-map': VenueMapBlockContent;
  countdown: CountdownBlockContent;
  rsvp: RSVPBlockContent;
  contribution: ContributionBlockContent;
  timeline: TimelineBlockContent;
  quote: QuoteBlockContent;
  divider: DividerBlockContent;
  button: ButtonBlockContent;
  faq: FAQBlockContent;
  music: MusicBlockContent;
  guestbook: GuestbookBlockContent;
  livestream: LivestreamBlockContent;
};

export interface InvitationBlockConfig<TContent = any> {
  id: string;
  type: InvitationBlockType;
  version: 1;
  enabled: boolean;
  settings: CommonBlockSettings;
  content: TContent;
}

export const InvitationBlockConfigSchema = z.object({
  id: z.string(),
  type: z.enum([
    'hero',
    'rich-text',
    'photo',
    'gallery',
    'video',
    'venue-map',
    'countdown',
    'rsvp',
    'contribution',
    'timeline',
    'quote',
    'divider',
    'button',
    'faq',
    'music',
    'guestbook',
    'livestream',
  ]),
  version: z.literal(1).default(1),
  enabled: z.boolean().default(true),
  settings: CommonBlockSettingsSchema,
  content: z.record(z.any()),
});
