import { z } from 'zod';
import type { EventEntity, EventDesignEntity, GuestHouseholdEntity } from '@/lib/db/types';
import type { TemplateDefinition } from '@/lib/templates/types';
import { getDefaultInvitationSections } from '@/lib/events/default-invitation-sections';
import type { AnimationPhase } from '@/components/animation/EnvelopeRenderer';
import type { InvitationBlockConfig } from '@/lib/blocks/types';
import { migrateEventToBlocks } from '@/lib/blocks/registry';
import { getCanvasHeadingFontOverride, getTemplateCanvasElements } from '@/lib/templates/canvas-defaults';

export type InvitationMode =
  | 'published'
  | 'draft-preview'
  | 'template-preview'
  | 'private-review';

/**
 * Zod schema defining the serializable core fields of an Event in the invitation config.
 */
export const EventEntityConfigSchema = z.object({
  id: z.string(),
  hostId: z.string().optional().default('host-1'),
  title: z.string().min(1, 'Event title is required'),
  subtitle: z.string().optional(),
  slug: z.string(),
  category: z.string(),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  templateId: z.string(),
  templateVersion: z.string().default('1.0.0'),
  hosts: z.string(),
  celebrants: z.string(),
  date: z.string(),
  time: z.string(),
  timezone: z.string().default('Africa/Nairobi'),
  venue: z.string(),
  address: z.string().optional(),
  city: z.string(),
  directionsNote: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  dressCode: z.string().optional(),
  story: z.string().optional(),
  heroImage: z.string(),
  galleryImages: z.array(z.string()).optional(),
  rsvpDeadline: z.string().optional(),
  maxCapacity: z.number().optional(),
  allowsChildren: z.boolean().optional(),
  mpesaType: z.enum(['till', 'paybill', 'send_money']).optional(),
  mpesaNumber: z.string().optional(),
  mpesaRecipient: z.string().optional(),
  mpesaReference: z.string().optional(),
  audioUrl: z.string().optional(),
  countdownLabel: z.string().optional(),
  imageCropFocalPosition: z.string().optional(),
  milestoneAge: z.number().optional(),
  ourStoryMilestones: z.array(z.any()).optional(),
  programmeSchedule: z.array(z.any()).optional(),
  faqItems: z.array(z.any()).optional(),
  ceremonyDetails: z.any().optional(),
  receptionDetails: z.any().optional(),
  birthdayAbout: z.any().optional(),
  birthdayActivities: z.array(z.any()).optional(),
  birthdayMenu: z.any().optional(),
  memorialObituary: z.any().optional(),
  memorialServices: z.array(z.any()).optional(),
  memorialOrderOfService: z.array(z.any()).optional(),
  livestreamUrl: z.string().optional(),
  livestreamStatus: z.enum(['scheduled', 'live', 'ended']).optional(),
  virtualCandlesCount: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Zod schema for the Canonical Invitation Configuration.
 */
export const CanonicalInvitationConfigSchema = z.object({
  version: z.string().default('1.0.0'),
  mode: z.enum(['published', 'draft-preview', 'template-preview', 'private-review']),
  event: EventEntityConfigSchema,
  template: z.any(),
  design: z.record(z.any()).optional(),
  blocks: z.array(z.any()).optional(),
  sectionOrder: z.array(z.string()).optional(),
  visibleSections: z.array(z.string()).optional(),
  guestToken: z.string().optional(),
  guestName: z.string().optional(),
  allowedPlusOnes: z.number().int().min(0).optional(),
  initialPhase: z
    .enum([
      'closed',
      'seal-press',
      'seal-release',
      'flap-open',
      'card-rising',
      'settling',
      'settled',
    ])
    .optional(),
  isReadOnly: z.boolean().optional().default(false),
});

export type CanonicalInvitationConfig = {
  version: string;
  mode: InvitationMode;
  event: EventEntity;
  template: TemplateDefinition;
  design?: Partial<EventDesignEntity>;
  blocks?: InvitationBlockConfig[];
  sectionOrder?: string[];
  visibleSections?: string[];
  guestToken?: string;
  guestName?: string;
  allowedPlusOnes?: number;
  initialPhase?: AnimationPhase;
  isReadOnly?: boolean;
};

/**
 * Canonical resolution of active, visible section keys in order.
 */
export function resolveActiveSections(
  category: string,
  design?: Partial<EventDesignEntity>,
  customOrder?: string[]
): string[] {
  const defaultSections = getDefaultInvitationSections(category);
  const defaultSet = new Set(defaultSections);

  // If visibleSections is specified, restrict to visible; otherwise all defaults are visible
  const visibleSet =
    design?.visibleSections !== undefined
      ? new Set(design.visibleSections)
      : defaultSet;

  // Resolve ordering preference
  const rawOrder = customOrder || design?.sectionOrder || defaultSections;

  // Keep ordered sections that are marked visible
  const orderedVisible = rawOrder.filter((key) => visibleSet.has(key));

  // Ensure any visible sections that were missing from sectionOrder are cleanly appended
  const seen = new Set(orderedVisible);
  for (const defKey of defaultSections) {
    if (visibleSet.has(defKey) && !seen.has(defKey)) {
      orderedVisible.push(defKey);
    }
  }

  return orderedVisible;
}

/**
 * Supply the art-directed default canvas for legacy/preview routes that do not
 * yet have a saved canvas. An explicitly saved (even empty) canvas is preserved.
 */
function resolveCanvasDesign(
  template: TemplateDefinition,
  event: EventEntity,
  design?: Partial<EventDesignEntity>,
  valuesOverride?: Partial<DraftInvitationValues>
): Partial<EventDesignEntity> {
  if (design?.canvasElements !== undefined) return design;

  const values: DraftInvitationValues = {
    title: valuesOverride?.title ?? event.title,
    hosts: valuesOverride?.hosts ?? event.hosts,
    celebrants: valuesOverride?.celebrants ?? event.celebrants,
    date: valuesOverride?.date ?? event.date,
    time: valuesOverride?.time ?? event.time,
    venue: valuesOverride?.venue ?? event.venue,
    city: valuesOverride?.city ?? event.city,
    heroImage: valuesOverride?.heroImage || event.heroImage || template.sampleData.heroImage,
    galleryImages:
      valuesOverride?.galleryImages !== undefined
        ? valuesOverride.galleryImages
        : event.galleryImages,
    // Draft mode must use the actual form value, not its display-only "Not set" placeholder.
    rsvpDeadline: valuesOverride ? valuesOverride.rsvpDeadline : event.rsvpDeadline,
    dressCode: valuesOverride?.dressCode ?? event.dressCode,
    story: valuesOverride?.story ?? event.story,
  };

  return {
    ...(design || {}),
    canvasElements: getTemplateCanvasElements(template, values, {
      palette: design?.palette,
      headingFont: getCanvasHeadingFontOverride(template, design),
    }),
  };
}

/**
 * Build canonical config for a published guest route (/e/[slug]).
 */
export function buildPublishedInvitationConfig(
  event: EventEntity,
  template: TemplateDefinition,
  options?: {
    design?: Partial<EventDesignEntity>;
    guestHousehold?: GuestHouseholdEntity;
    guestToken?: string;
    initialPhase?: AnimationPhase;
  }
): CanonicalInvitationConfig {
  const design = resolveCanvasDesign(template, event, options?.design);
  const activeSections = resolveActiveSections(event.category, design);
  const blocks = design.blocks || event.blocks || migrateEventToBlocks(event, design);

  return {
    version: '1.0.0',
    mode: 'published',
    event,
    template,
    design,
    blocks,
    sectionOrder: activeSections,
    visibleSections: design.visibleSections || activeSections,
    guestToken: options?.guestToken,
    guestName: options?.guestHousehold?.displayName,
    allowedPlusOnes: options?.guestHousehold?.allowedPlusOnes,
    initialPhase: options?.initialPhase,
    isReadOnly: false,
  };
}

/**
 * Build canonical config for template preview (/templates/[templateId]).
 */
export function buildTemplatePreviewInvitationConfig(
  template: TemplateDefinition,
  options?: {
    guestName?: string;
    initialPhase?: AnimationPhase;
  }
): CanonicalInvitationConfig {
  const sample = template.sampleData;
  const isMemorial = template.category === 'memorial' || template.category === 'funeral';
  const isBirthday = template.category === 'birthday';

  const previewEvent: EventEntity = {
    id: `template-${template.id}`,
    hostId: 'kadi-demo-host',
    title: sample.title,
    subtitle: sample.subtitle,
    slug: `demo-${template.id}`,
    category: template.category,
    status: 'published',
    templateId: template.id,
    templateVersion: template.version,
    hosts: sample.hosts,
    celebrants: sample.celebrants,
    date: sample.date,
    time: sample.time,
    timezone: 'Africa/Nairobi',
    venue: sample.venue,
    city: sample.city,
    story: sample.story,
    heroImage: sample.heroImage,
    galleryImages: sample.galleryImages || [],
    milestoneAge: sample.milestoneAge,
    rsvpDeadline: '',
    mpesaType: 'till',
    mpesaNumber: '8249102',
    mpesaRecipient: sample.celebrants || 'Event Host',
    mpesaReference: sample.title,
    ourStoryMilestones: sample.story
      ? [
          {
            yearOrDate: 'Welcome',
            title: 'Our Celebration',
            story: sample.story,
          },
        ]
      : undefined,
    programmeSchedule: [
      {
        time: sample.time || '2:00 PM',
        title: isBirthday
          ? 'Welcome & Cake Cutting'
          : isMemorial
            ? 'Commemorative Service'
            : 'Celebration Proceedings',
        description: sample.subtitle || 'All friends and family assemble.',
        location: sample.venue,
      },
    ],
    faqItems: [
      {
        question: 'Where will the event be held?',
        answer: `${sample.venue}, ${sample.city}. Secure parking is available on-site.`,
      },
    ],
    birthdayAbout: isBirthday
      ? {
          heading: `Celebrating ${sample.celebrants}`,
          bio: sample.story || 'A special milestone celebration with family and friends.',
        }
      : undefined,
    memorialObituary: isMemorial
      ? {
          biography: sample.story || `Honouring the cherished memory of ${sample.celebrants}.`,
        }
      : undefined,
    memorialServices: isMemorial
      ? [
          {
            name: 'Memorial Service',
            date: sample.date,
            time: sample.time,
            venue: sample.venue,
            type: 'service',
          },
        ]
      : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const design = resolveCanvasDesign(template, previewEvent);
  const activeSections = resolveActiveSections(template.category, design);
  const blocks = migrateEventToBlocks(previewEvent, design);

  return {
    version: '1.0.0',
    mode: 'template-preview',
    event: previewEvent,
    template,
    design,
    blocks,
    sectionOrder: activeSections,
    visibleSections: activeSections,
    guestName: options?.guestName || 'Hon. & Mrs. Anyango',
    allowedPlusOnes: 1,
    initialPhase: options?.initialPhase,
    isReadOnly: true,
  };
}

export interface DraftInvitationValues {
  title: string;
  hosts: string;
  celebrants: string;
  date: string;
  time: string;
  timezone?: string;
  venue: string;
  city: string;
  heroImage: string;
  galleryImages?: string[];
  rsvpDeadline?: string;
  dressCode?: string;
  story?: string;
  countdownLabel?: string;
  imageCropFocalPosition?: string;
  audioUrl?: string;
  mpesaType?: 'till' | 'paybill' | 'send_money';
  mpesaNumber?: string;
  mpesaRecipient?: string;
  mpesaReference?: string;
  // Section text overrides for direct in-place editing across the stationery
  registryHeading?: string;
  registryTitle?: string;
  registryMessage?: string;
  registryAccountLabel?: string;
  ceremonyHeading?: string;
  ceremonyTitle?: string;
  ceremonyTime?: string;
  receptionTitle?: string;
  receptionTime?: string;
  receptionLocation?: string;
  venueHeading?: string;
  venueNote?: string;
  storyHeading?: string;
  storyTitle?: string;
  galleryHeading?: string;
  galleryTitle?: string;
  rsvpHeading?: string;
  rsvpTitle?: string;
  rsvpSubtitle?: string;
  faqHeading?: string;
  faqTitle?: string;
  closingHeading?: string;
  closingTitle?: string;
  closingMessage?: string;
}

/**
 * Build canonical config for live studio draft preview.
 */
export function buildDraftPreviewInvitationConfig(
  template: TemplateDefinition,
  values: DraftInvitationValues,
  design: Partial<EventDesignEntity>,
  options?: {
    guestName?: string;
    initialPhase?: AnimationPhase;
  }
): CanonicalInvitationConfig {
  const isMemorial = template.category === 'memorial' || template.category === 'funeral';
  const isBirthday = template.category === 'birthday';
  const story = values.story || template.sampleData.story || '';

  const draftEvent: EventEntity = {
    id: 'kadi-draft-preview',
    hostId: 'kadi-preview-host',
    title: values.title || template.sampleData.title,
    subtitle: template.sampleData.subtitle || '',
    slug: 'kadi-draft-preview',
    category: template.category,
    status: 'draft',
    templateId: template.id,
    templateVersion: template.version,
    hosts: values.hosts || template.sampleData.hosts,
    celebrants: values.celebrants || template.sampleData.celebrants,
    date: values.date || template.sampleData.date,
    time: values.time || template.sampleData.time,
    timezone: values.timezone || 'Africa/Nairobi',
    venue: values.venue || template.sampleData.venue,
    city: values.city || template.sampleData.city,
    dressCode: values.dressCode,
    story,
    heroImage: values.heroImage || template.sampleData.heroImage,
    galleryImages:
      values.galleryImages?.length
        ? values.galleryImages
        : template.sampleData.galleryImages?.length
          ? template.sampleData.galleryImages
          : values.heroImage
            ? [values.heroImage]
            : [],
    rsvpDeadline: values.rsvpDeadline || 'Not set',
    countdownLabel: values.countdownLabel,
    audioUrl: values.audioUrl,
    mpesaType: values.mpesaType || 'till',
    mpesaNumber: values.mpesaNumber || '8249102',
    mpesaRecipient: values.mpesaRecipient || values.celebrants || 'Event Host',
    mpesaReference: values.mpesaReference || values.title,
    ourStoryMilestones: story
      ? [
          {
            yearOrDate: 'Our Journey',
            title: values.title || 'Our Story',
            story,
          },
        ]
      : undefined,
    programmeSchedule: [
      {
        time: values.time || '2:00 PM',
        title: isBirthday
          ? 'Gather and celebrate'
          : isMemorial
            ? 'Service & Commemoration'
            : template.category === 'graduation'
              ? 'Ceremony and celebration'
              : template.category === 'housewarming'
                ? 'Welcome to the new home'
                : 'Event proceedings begin',
        description:
          template.sampleData.subtitle ||
          'Details will dynamically reflect your schedule customizations.',
        location: values.venue,
      },
    ],
    faqItems: [
      {
        question: 'Where is the event taking place?',
        answer:
          [values.venue, values.city].filter(Boolean).join(', ') ||
          'Venue details will be shown here.',
      },
      {
        question: 'When should guests arrive?',
        answer: `The event begins promptly at ${values.time || 'the scheduled time'} on ${values.date || 'the listed date'}.`,
      },
    ],
    birthdayAbout: isBirthday
      ? {
          heading: `Celebrating ${values.celebrants || 'our celebrant'}`,
          bio: story || 'A life full of warmth, wisdom, and celebration.',
        }
      : undefined,
    memorialObituary: isMemorial
      ? {
          biography:
            story ||
            `A celebration of the life and cherished memories of ${values.celebrants || 'our loved one'}.`,
        }
      : undefined,
    memorialServices: isMemorial
      ? [
          {
            name: 'Memorial Service',
            date: values.date,
            time: values.time,
            venue: values.venue,
            type: 'service',
          },
        ]
      : undefined,
    ceremonyDetails: {
      name: values.ceremonyTitle || 'The Ceremony',
      time: values.ceremonyTime || values.time || '10:00 AM',
      address: [values.venue, values.city].filter(Boolean).join(', ') || 'Ceremony Venue',
    },
    receptionDetails: {
      name: values.receptionTitle || 'The Reception & Dinner',
      time: values.receptionTime || '1:30 PM',
      address: values.receptionLocation || [values.venue, values.city].filter(Boolean).join(', ') || 'Reception Venue',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const resolvedDesign = resolveCanvasDesign(template, draftEvent, design, values);
  const activeSections = resolveActiveSections(template.category, resolvedDesign);
  const rawBlocks = design.blocks || migrateEventToBlocks(draftEvent, design);

  // Synchronize draftEvent and values into blocks so BlockRenderer always displays current authored content
  const blocks = rawBlocks.map((blk) => {
    const nextContent = { ...blk.content };
    if (blk.type === 'hero') {
      nextContent.title = draftEvent.title;
      nextContent.celebrants = draftEvent.celebrants;
      nextContent.date = draftEvent.date;
      nextContent.time = draftEvent.time;
      nextContent.venue = draftEvent.venue;
      nextContent.city = draftEvent.city;
      if (draftEvent.hosts) nextContent.subtitle = draftEvent.hosts;
      if (values.countdownLabel) nextContent.tagline = values.countdownLabel;
    } else if (blk.type === 'venue-map') {
      nextContent.venueName = draftEvent.venue;
      nextContent.city = draftEvent.city;
      nextContent.address = draftEvent.address || [draftEvent.venue, draftEvent.city].filter(Boolean).join(', ');
    } else if (blk.type === 'countdown') {
      nextContent.date = draftEvent.date;
      nextContent.time = draftEvent.time;
      if (values.countdownLabel) nextContent.label = values.countdownLabel;
    } else if (blk.type === 'rich-text') {
      if (values.story) nextContent.body = values.story;
      if (values.storyHeading) nextContent.headline = values.storyHeading;
      if (values.storyTitle) nextContent.subheading = values.storyTitle;
    } else if (blk.type === 'rsvp') {
      if (values.rsvpDeadline) {
        nextContent.deadline = values.rsvpDeadline;
        nextContent.headline = values.rsvpHeading || `Kindly RSVP by ${values.rsvpDeadline}`;
      }
      if (values.rsvpTitle) nextContent.instructions = values.rsvpTitle;
    } else if (blk.type === 'contribution') {
      if (values.mpesaNumber) nextContent.number = values.mpesaNumber;
      if (values.mpesaRecipient) nextContent.recipientName = values.mpesaRecipient;
      if (values.mpesaReference) nextContent.accountReference = values.mpesaReference;
      if (values.mpesaType) nextContent.type = values.mpesaType;
      if (values.registryTitle) nextContent.title = values.registryTitle;
      if (values.registryMessage) nextContent.instructions = values.registryMessage;
    } else if (blk.type === 'gallery') {
      if (draftEvent.galleryImages && draftEvent.galleryImages.length > 0) {
        nextContent.images = draftEvent.galleryImages.map((img: any) =>
          typeof img === 'string' ? { url: img } : img
        );
      }
    } else if (blk.type === 'music') {
      if (values.audioUrl) nextContent.audioUrl = values.audioUrl;
    }
    return { ...blk, content: nextContent };
  });

  return {
    version: '1.0.0',
    mode: 'draft-preview',
    event: draftEvent,
    template,
    design: resolvedDesign,
    blocks,
    sectionOrder: activeSections,
    visibleSections: resolvedDesign.visibleSections || activeSections,
    guestName: options?.guestName || 'Preview Guest',
    allowedPlusOnes: 1,
    initialPhase: options?.initialPhase,
    isReadOnly: true,
  };
}

/**
 * Build canonical config for a private review link (read-only, expiring token).
 */
export function buildPrivateReviewInvitationConfig(
  event: EventEntity,
  template: TemplateDefinition,
  options?: {
    design?: Partial<EventDesignEntity>;
    initialPhase?: AnimationPhase;
  }
): CanonicalInvitationConfig {
  const design = resolveCanvasDesign(template, event, options?.design);
  const activeSections = resolveActiveSections(event.category, design);
  const blocks = design.blocks || event.blocks || migrateEventToBlocks(event, design);

  return {
    version: '1.0.0',
    mode: 'private-review',
    event,
    template,
    design,
    blocks,
    sectionOrder: activeSections,
    visibleSections: design.visibleSections || activeSections,
    guestName: 'Private Reviewer',
    allowedPlusOnes: 0,
    initialPhase: options?.initialPhase,
    isReadOnly: true,
  };
}
