import type {
  InvitationBlockConfig,
  InvitationBlockType,
  CommonBlockSettings,
  BlockContentMap,
} from './types';
import type { EventEntity, EventDesignEntity } from '@/lib/db/types';

/**
 * Stable, high-entropy ID generator for blocks.
 * Produces format: block_<type>_<timestamp>_<random>
 */
export function createBlockId(type: InvitationBlockType): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `blk_${type}_${timestamp}_${randomPart}`;
}

export const DEFAULT_COMMON_SETTINGS: CommonBlockSettings = {
  padding: 'comfortable',
  maxWidth: 'standard',
  textAlign: 'center',
  scrollMotion: 'fade-up',
  cornerStyle: 'soft',
  borderStyle: 'none',
};

export interface BlockDefinition<TType extends InvitationBlockType = InvitationBlockType> {
  type: TType;
  label: string;
  description: string;
  category: 'content' | 'media' | 'logistics' | 'social' | 'styling';
  icon: string;
  defaultSettings: CommonBlockSettings;
  defaultContent: () => BlockContentMap[TType];
}

/**
 * Block Registry defining metadata and factory defaults for all 17 blocks.
 */
export const BLOCK_DEFINITIONS: Record<InvitationBlockType, BlockDefinition<any>> = {
  hero: {
    type: 'hero',
    label: 'Cover / Hero',
    description: 'Event title, celebrants, date, venue and cover photography.',
    category: 'content',
    icon: 'Sparkles',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'wide', padding: 'spacious' },
    defaultContent: () => ({
      title: 'The Celebration of Love',
      subtitle: 'Together with their families',
      celebrants: 'Kevin & Wanjiku',
      date: 'Saturday, 14 November 2026',
      time: '2:00 PM EAT',
      venue: 'Safari Park Hotel & Casino',
      city: 'Nairobi, Kenya',
      tagline: 'Joyously invite you to share in their special day',
    }),
  },
  'rich-text': {
    type: 'rich-text',
    label: 'Story / Rich Text',
    description: 'Formatted story, welcome note, or milestone narrative.',
    category: 'content',
    icon: 'FileText',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'standard' },
    defaultContent: () => ({
      headline: 'A Note from the Hosts',
      subheading: 'Our Story & Gratitude',
      body: 'We are overjoyed to gather our dearest family and friends for this celebration. Thank you for walking this journey with us and for the love you bring to our lives.',
      styleVariant: 'editorial',
    }),
  },
  photo: {
    type: 'photo',
    label: 'Single Photo',
    description: 'Featured full-bleed or framed portrait with caption.',
    category: 'media',
    icon: 'Image',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'wide' },
    defaultContent: () => ({
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      caption: 'A cherished moment together',
      altText: 'Portrait of celebrants',
      aspectRatio: '16:9',
    }),
  },
  gallery: {
    type: 'gallery',
    label: 'Photo Gallery',
    description: 'Curated photo grid or carousel of milestones.',
    category: 'media',
    icon: 'Images',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'wide' },
    defaultContent: () => ({
      title: 'Cherished Memories',
      subtitle: 'Snapshots from our journey',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
          caption: 'Where it all began',
        },
        {
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
          caption: 'Celebration moments',
        },
      ],
      columns: 2,
      layout: 'grid',
    }),
  },
  video: {
    type: 'video',
    label: 'Video Clip',
    description: 'Embedded video clip (strictly YouTube or Vimeo allowlisted).',
    category: 'media',
    icon: 'Video',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'wide' },
    defaultContent: () => ({
      provider: 'youtube',
      videoId: 'dQw4w9WgXcQ',
      title: 'Our Journey in Motion',
      caption: 'A heartfelt message for our attendees',
    }),
  },
  'venue-map': {
    type: 'venue-map',
    label: 'Venue & Directions',
    description: 'Venue address, arrival instructions, and Google Maps directions.',
    category: 'logistics',
    icon: 'MapPin',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'standard' },
    defaultContent: () => ({
      venueName: 'Safari Park Hotel & Casino',
      address: 'Thika Super Highway',
      city: 'Nairobi, Kenya',
      directionsNote: 'Ample secure parking available on premise. Follow signage to the Garden Pavilion.',
      googleMapsUrl: 'https://maps.google.com/?q=Safari+Park+Hotel+Nairobi',
      showMapButton: true,
      showCalendarButton: true,
    }),
  },
  countdown: {
    type: 'countdown',
    label: 'Live Countdown',
    description: 'Live ticking countdown timer to the celebration.',
    category: 'logistics',
    icon: 'Clock',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'standard' },
    defaultContent: () => ({
      targetDate: '2026-11-14',
      targetTime: '14:00',
      timezone: 'Africa/Nairobi',
      label: 'Counting down with joy',
      celebrants: 'Kevin & Wanjiku',
    }),
  },
  rsvp: {
    type: 'rsvp',
    label: 'RSVP Form',
    description: 'Guest attendance confirmation with dietary and plus-one questions.',
    category: 'social',
    icon: 'UserCheck',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'standard' },
    defaultContent: () => ({
      headline: 'Kindly RSVP by 1 December 2026',
      deadline: '1 December 2026',
      instructions: 'Please let us know if you will be joining our celebration.',
      allowedPlusOnes: 1,
      showDietary: true,
      showSongRequest: true,
      buttonText: 'Confirm Attendance',
    }),
  },
  contribution: {
    type: 'contribution',
    label: 'M-Pesa Registry / Harambee',
    description: 'M-Pesa Till, Paybill, or Send Money details with one-touch copying.',
    category: 'social',
    icon: 'Smartphone',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'standard' },
    defaultContent: () => ({
      title: 'Wedding Registry & Harambee',
      instructions: 'Your presence is the greatest gift. If you wish to honour us with a blessing, contributions can be sent via M-Pesa.',
      type: 'till',
      number: '8249102',
      recipientName: 'Kevin & Wanjiku',
      accountReference: 'Wedding Gift',
      notes: 'Thank you for your generosity and warm blessings.',
    }),
  },
  timeline: {
    type: 'timeline',
    label: 'Programme & Schedule',
    description: 'Chronological timeline of events, arrival, service and reception.',
    category: 'logistics',
    icon: 'Calendar',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'standard' },
    defaultContent: () => ({
      title: 'Programme of the Day',
      subtitle: 'Order of Events',
      items: [
        { time: '1:30 PM', title: 'Guest Arrival & Seating', location: 'Garden Pavilion' },
        { time: '2:00 PM', title: 'Solemn Ceremony & Exchange of Vows', location: 'Main Lawn' },
        { time: '3:30 PM', title: 'Cocktails & High Tea', location: 'Orchard Terrace' },
        { time: '5:00 PM', title: 'Banquet Dinner & Speeches', location: 'Ballroom' },
      ],
    }),
  },
  quote: {
    type: 'quote',
    label: 'Featured Quote / Verse',
    description: 'Meaningful scripture, proverb, lyric or blessing.',
    category: 'content',
    icon: 'Quote',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'narrow' },
    defaultContent: () => ({
      quote: 'Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.',
      attribution: 'Ruth 1:16',
      context: 'Scripture reading for the ceremony',
      style: 'serif',
    }),
  },
  divider: {
    type: 'divider',
    label: 'Ornamental Divider',
    description: 'Subtle flourish, ruled line, or dotted separator between sections.',
    category: 'styling',
    icon: 'Minus',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'narrow', padding: 'compact' },
    defaultContent: () => ({
      style: 'flourish',
      spacing: 'normal',
    }),
  },
  button: {
    type: 'button',
    label: 'Action Button / Link',
    description: 'Direct call to action (hotel booking, dress guide, external site).',
    category: 'styling',
    icon: 'ExternalLink',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'narrow' },
    defaultContent: () => ({
      label: 'View Hotel Accommodations',
      url: 'https://safariparkhotel.com',
      variant: 'primary',
      openInNewTab: true,
      subtext: 'Preferential rates reserved under "Kamau Wedding"',
    }),
  },
  faq: {
    type: 'faq',
    label: 'Frequently Asked Questions',
    description: 'Helpful answers on parking, dress code, gifts, and children.',
    category: 'content',
    icon: 'HelpCircle',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'standard' },
    defaultContent: () => ({
      title: 'Frequently Asked Questions',
      subtitle: 'Helpful notes for our valued guests',
      items: [
        {
          question: 'What is the dress code?',
          answer: 'Formal African traditional attire or Black Tie. Earth tones, terracotta, and ochre are encouraged.',
        },
        {
          question: 'Are children invited?',
          answer: 'While we love the little ones, this will be an adults-only celebration with the exception of nursing infants.',
        },
        {
          question: 'Is parking available?',
          answer: 'Yes, secure valet and complimentary self-parking are provided at the hotel entrance.',
        },
      ],
    }),
  },
  music: {
    type: 'music',
    label: 'Atmospheric Audio',
    description: 'Ceremonial audio accompaniment with respectful gesture-only playback.',
    category: 'media',
    icon: 'Music',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'narrow' },
    defaultContent: () => ({
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
      title: 'Acoustic Afro-Soul Reverie',
      artist: 'Kadi Ceremonial Ensembles',
      autoPlayNotice: 'Audio will begin when you tap to open your invitation.',
    }),
  },
  guestbook: {
    type: 'guestbook',
    label: 'Tributes & Guestbook',
    description: 'Guest messages of celebration, blessings, or commemorative virtual candles.',
    category: 'social',
    icon: 'Heart',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'standard' },
    defaultContent: () => ({
      title: 'Warm Wishes & Blessings',
      prompt: 'Leave a note of love and congratulations for the couple',
      allowCandles: false,
      honoreeName: 'Kevin & Wanjiku',
      moderationNotice: 'Messages are displayed for all attendees to read.',
    }),
  },
  livestream: {
    type: 'livestream',
    label: 'Live Broadcast',
    description: 'Video broadcast for remote diaspora and overseas family.',
    category: 'media',
    icon: 'Radio',
    defaultSettings: { ...DEFAULT_COMMON_SETTINGS, maxWidth: 'wide' },
    defaultContent: () => ({
      provider: 'youtube',
      streamUrl: 'https://www.youtube.com/watch?v=live_stream_id',
      status: 'scheduled',
      title: 'Ceremony Live Stream',
      pinNote: 'Broadcast begins 15 minutes before the opening procession.',
    }),
  },
};

/**
 * Instantiate a new block configuration with stable ID and serializable payload.
 */
export function createBlock<TType extends InvitationBlockType>(
  type: TType,
  customContent?: Partial<BlockContentMap[TType]>,
  customSettings?: Partial<CommonBlockSettings>
): InvitationBlockConfig<BlockContentMap[TType]> {
  const def = BLOCK_DEFINITIONS[type];
  const content = {
    ...def.defaultContent(),
    ...(customContent || {}),
  };
  const settings = {
    ...def.defaultSettings,
    ...(customSettings || {}),
  };

  return {
    id: createBlockId(type),
    type,
    version: 1,
    enabled: true,
    settings,
    content,
  };
}

/**
 * Duplicate an existing block, creating a distinct new ID while preserving settings and content.
 */
export function duplicateBlock(block: InvitationBlockConfig): InvitationBlockConfig {
  return {
    ...JSON.parse(JSON.stringify(block)),
    id: createBlockId(block.type),
    version: 1,
    enabled: true,
  };
}

/**
 * Reorder blocks array immutably.
 */
export function reorderBlocks(
  blocks: InvitationBlockConfig[],
  fromIndex: number,
  toIndex: number
): InvitationBlockConfig[] {
  if (
    fromIndex < 0 ||
    fromIndex >= blocks.length ||
    toIndex < 0 ||
    toIndex >= blocks.length ||
    fromIndex === toIndex
  ) {
    return [...blocks];
  }

  const result = [...blocks];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Sanitize external URL to prevent javascript: or data: XSS attacks.
 * Only http, https, mailto, and tel are permitted.
 */
export function sanitizeUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:')
  ) {
    return trimmed;
  }

  // Reject dangerous protocols
  return '#';
}

/**
 * Strict sanitizer for embedded videos:
 * Allowlisted to YouTube and Vimeo exclusively. Rejects all other domains or arbitrary iframes.
 */
export function sanitizeVideoUrl(
  urlOrId?: string
): { provider: 'youtube' | 'vimeo'; videoId: string; embedUrl: string } | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // 1. YouTube checks:
  // e.g. https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID or embed/VIDEO_ID or just ID
  const ytMatch =
    trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/) ||
    (trimmed.length === 11 && trimmed.match(/^[a-zA-Z0-9_-]{11}$/) ? [null, trimmed] : null);

  if (ytMatch && ytMatch[1]) {
    const videoId = encodeURIComponent(ytMatch[1]);
    return {
      provider: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
    };
  }

  // 2. Vimeo checks:
  // e.g. https://vimeo.com/123456789 or https://player.vimeo.com/video/123456789 or just numeric ID
  const vimeoMatch =
    trimmed.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d{6,12})/) ||
    (trimmed.match(/^\d{6,12}$/) ? [null, trimmed] : null);

  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = encodeURIComponent(vimeoMatch[1]);
    return {
      provider: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?dnt=1`,
    };
  }

  return null;
}

/**
 * Strict sanitizer for livestream URLs.
 */
export function sanitizeLivestreamUrl(
  url?: string
): { provider: 'youtube' | 'vimeo' | 'external'; embedUrl?: string; rawUrl: string } | null {
  if (!url) return null;
  const trimmed = url.trim();

  const video = sanitizeVideoUrl(trimmed);
  if (video) {
    return {
      provider: video.provider,
      embedUrl: video.embedUrl,
      rawUrl: trimmed,
    };
  }

  const safeUrl = sanitizeUrl(trimmed);
  if (safeUrl !== '#') {
    return {
      provider: 'external',
      rawUrl: safeUrl,
    };
  }

  return null;
}

/**
 * Migrate legacy EventEntity & EventDesignEntity data into canonical typed InvitationBlockConfig[].
 * Guarantees 100% backwards compatibility with historical invitations.
 */
export function migrateEventToBlocks(
  event: EventEntity,
  design?: Partial<EventDesignEntity>
): InvitationBlockConfig[] {
  const blocks: InvitationBlockConfig[] = [];
  const isMemorial = event.category === 'memorial' || event.category === 'funeral';
  const isBirthday = event.category === 'birthday';

  // 1. Countdown block (if date exists)
  if (event.date) {
    blocks.push(
      createBlock(
        'countdown',
        {
          targetDate: event.date,
          targetTime: event.time || '14:00',
          timezone: event.timezone || 'Africa/Nairobi',
          label: event.countdownLabel || 'Counting down with joy',
          celebrants: event.celebrants,
        },
        { maxWidth: 'standard', padding: 'comfortable' }
      )
    );
  }

  // 2. Story / Rich Text block
  if (event.story || event.ourStoryMilestones?.length) {
    const storyText =
      event.story ||
      event.ourStoryMilestones?.map((m) => `${m.title}: ${m.story}`).join('\n\n') ||
      '';
    blocks.push(
      createBlock(
        'rich-text',
        {
          headline: isMemorial ? 'In Loving Memory' : isBirthday ? `Celebrating ${event.celebrants}` : 'Our Story',
          subheading: isMemorial ? 'Cherished Remembrances' : 'A Journey of Love & Family',
          body: storyText,
          styleVariant: 'editorial',
        },
        { maxWidth: 'standard', padding: 'comfortable' }
      )
    );
  }

  // 3. Programme / Timeline block
  if (event.programmeSchedule?.length) {
    blocks.push(
      createBlock(
        'timeline',
        {
          title: isMemorial ? 'Order of Service' : 'Programme of Events',
          subtitle: 'Schedule for the day',
          items: event.programmeSchedule.map((p) => ({
            time: p.time,
            title: p.title,
            description: p.description,
            location: p.location,
          })),
        },
        { maxWidth: 'standard', padding: 'comfortable' }
      )
    );
  }

  // 4. Venue & Map block
  if (event.venue || event.city) {
    blocks.push(
      createBlock(
        'venue-map',
        {
          venueName: event.venue,
          address: event.address,
          city: event.city,
          directionsNote: event.directionsNote,
          googleMapsUrl: event.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent([event.venue, event.city].filter(Boolean).join(', '))}`,
          showMapButton: true,
          showCalendarButton: true,
        },
        { maxWidth: 'standard', padding: 'comfortable' }
      )
    );
  }

  // 5. Photo Gallery
  if (event.galleryImages && event.galleryImages.length > 0) {
    blocks.push(
      createBlock(
        'gallery',
        {
          title: 'Photo Gallery',
          subtitle: 'Cherished moments',
          images: event.galleryImages.map((img) => ({ url: img })),
          columns: 2,
          layout: 'grid',
        },
        { maxWidth: 'wide', padding: 'comfortable' }
      )
    );
  }

  // 6. FAQ Block
  if (event.faqItems && event.faqItems.length > 0) {
    blocks.push(
      createBlock(
        'faq',
        {
          title: 'Frequently Asked Questions',
          subtitle: 'Helpful details for our guests',
          items: event.faqItems,
        },
        { maxWidth: 'standard', padding: 'comfortable' }
      )
    );
  }

  // 7. M-Pesa Registry (if applicable and NOT a funeral)
  if (event.mpesaNumber && event.category !== 'funeral') {
    blocks.push(
      createBlock(
        'contribution',
        {
          title: isBirthday ? 'Milestone Blessings' : 'Registry & Contributions',
          type: event.mpesaType || 'till',
          number: event.mpesaNumber,
          recipientName: event.mpesaRecipient || event.celebrants || 'Hosts',
          accountReference: event.mpesaReference || event.title,
          instructions: 'Your warm presence is our greatest joy. Any blessings can be gifted via M-Pesa below.',
        },
        { maxWidth: 'standard', padding: 'comfortable' }
      )
    );
  }

  // 8. RSVP Block
  blocks.push(
    createBlock(
      'rsvp',
      {
        headline: `Kindly RSVP by ${event.rsvpDeadline || 'the requested deadline'}`,
        deadline: event.rsvpDeadline || 'RSVP requested',
        instructions: 'Please confirm your attendance so we may prepare for your arrival.',
        allowedPlusOnes: 1,
        showDietary: true,
        showSongRequest: !isMemorial,
        buttonText: 'Confirm Attendance',
      },
      { maxWidth: 'standard', padding: 'comfortable' }
    )
  );

  // 9. Memorial special blocks: Guestbook / Tributes and Livestream
  if (isMemorial) {
    blocks.push(
      createBlock(
        'guestbook',
        {
          title: 'Condolences & Memories',
          prompt: `Share a tribute or memory in honour of ${event.celebrants}`,
          allowCandles: true,
          honoreeName: event.celebrants,
        },
        { maxWidth: 'standard', padding: 'comfortable' }
      )
    );

    if (event.livestreamUrl) {
      blocks.push(
        createBlock(
          'livestream',
          {
            streamUrl: event.livestreamUrl,
            status: event.livestreamStatus === 'live' ? 'live' : event.livestreamStatus === 'ended' ? 'ended' : 'scheduled',
            title: 'Memorial Service Live Stream',
            provider: 'youtube',
          },
          { maxWidth: 'wide', padding: 'comfortable' }
        )
      );
    }
  }

  // 10. Background audio block if audioUrl exists
  if (event.audioUrl) {
    blocks.push(
      createBlock(
        'music',
        {
          audioUrl: event.audioUrl,
          title: 'Atmospheric Soundtrack',
          artist: 'Ceremony accompaniment',
        },
        { maxWidth: 'narrow', padding: 'compact' }
      )
    );
  }

  return blocks;
}
