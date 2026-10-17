import type { TemplateDefinition } from './types';
import type { DraftInvitationValues } from '@/components/invitations/DraftInvitationPreview';
import type { CanvasElement } from '@/types/canvas';
import { STICKER_ASSETS } from '@/lib/assets/stickers';

function getLuminance(hexStr: string): number {
  if (!hexStr || !hexStr.startsWith('#')) return 0.2;
  const hex = hexStr.replace('#', '');
  const r = parseInt(hex.substring(0, 2) || '00', 16);
  const g = parseInt(hex.substring(2, 4) || '00', 16);
  const b = parseInt(hex.substring(4, 6) || '00', 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function getAccessiblePalette(template: TemplateDefinition) {
  const cardBg = template.palette.cardBackground || '#FCFAF7';
  const isLightBg = getLuminance(cardBg) > 0.5;

  const rawPrimary = template.palette.primary || '#934638';
  // Ensure primary heading is clearly distinguishable from background
  const primaryColor = isLightBg
    ? getLuminance(rawPrimary) < 0.42
      ? rawPrimary
      : '#272620'
    : getLuminance(rawPrimary) > 0.5
    ? rawPrimary
    : '#FAF8F5';

  // Accent / Gold: high-contrast deep bronze on light cards, warm luminous gold on dark cards
  const accentColor = isLightBg ? '#7C582B' : '#F6CFA0';
  const textColor = isLightBg ? '#272620' : '#FAF8F5';
  const subtitleColor = isLightBg ? '#3D3930' : '#E8E5DD';
  const venueColor = isLightBg ? '#403C35' : '#E0DDD5';

  return {
    cardBg,
    primaryColor,
    accentColor,
    textColor,
    subtitleColor,
    venueColor,
  };
}

export function getTemplateCanvasElements(
  template: TemplateDefinition,
  values: DraftInvitationValues
): CanvasElement[] {
  const valCat = (values as any).category as string | undefined;
  const isWedding =
    template.category === 'wedding' ||
    template.category === 'anniversary' ||
    template.category === 'engagement' ||
    valCat === 'wedding' ||
    valCat === 'anniversary' ||
    valCat === 'engagement';
  const isBirthday =
    template.category === 'birthday' ||
    valCat === 'birthday' ||
    values.title?.toLowerCase().includes('birthday');
  const isMemorial =
    template.category === 'memorial' ||
    template.category === 'funeral' ||
    valCat === 'memorial' ||
    valCat === 'funeral' ||
    values.title?.toLowerCase().includes('memorial') ||
    values.title?.toLowerCase().includes('funeral');
  const isGraduation =
    template.category === 'graduation' ||
    template.category === 'corporate' ||
    valCat === 'graduation' ||
    valCat === 'corporate' ||
    values.title?.toLowerCase().includes('graduation');
  const isBaby =
    template.category === 'baby-shower' ||
    template.category === 'welcome-baby' ||
    template.id.includes('baby') ||
    (template.motionPreset as string) === 'baby-shower' ||
    valCat === 'baby-shower' ||
    valCat === 'welcome-baby' ||
    values.title?.toLowerCase().includes('baby') ||
    values.celebrants?.toLowerCase().includes('baby');

  const isHeritage =
    template.motionPreset === 'cultural-celebration' ||
    template.liner?.id === 'african-print' ||
    template.id === 'harambee-cultural-night' ||
    template.id.includes('cultural') ||
    template.id.includes('safari');
  const isDisco =
    template.id.includes('disco') ||
    template.id === 'ruby-disco-birthday';
  const isArtDeco =
    template.id === 'golden-soiree' ||
    template.id === 'future-in-gold' ||
    template.id === 'bespoke-gathering';
  const isMediterranean =
    template.id === 'harvest-table' ||
    template.id === 'terrace-open-house';

  const headingFont =
    template.fonts.heading === 'sans' ? 'Inter' : 'Playfair Display';

  const {
    primaryColor,
    accentColor,
    textColor,
    subtitleColor,
    venueColor,
  } = getAccessiblePalette(template);

  // Base artboard coordinate space is 480 x 680 (portrait invitation card)
  const elements: CanvasElement[] = [];

  // 1. Top Decorative Image Sticker / Crest (tailored to event archetype & culture)
  let topSticker = isWedding
    ? STICKER_ASSETS.find((s) => s.id === 'romance-solitaire-diamond')
    : isBaby
    ? STICKER_ASSETS.find((s) => s.id === 'planner-doodle-heart') ||
      STICKER_ASSETS.find((s) => s.id === 'party-gold-balloon-star')
    : STICKER_ASSETS.find((s) => s.id === 'stationery-wax-seal-gold');

  if (isHeritage) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'cultural-harusi-tunayo') ||
      STICKER_ASSETS.find((s) => s.id === 'cultural-ruracio-vibes') ||
      topSticker;
  } else if (isDisco) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'party-disco-ball') ||
      STICKER_ASSETS.find((s) => s.id === 'party-champagne-pop') ||
      topSticker;
  } else if (isArtDeco) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'stationery-wax-seal-gold') ||
      STICKER_ASSETS.find((s) => s.id === 'badge-dress-to-impress') ||
      topSticker;
  } else if (isMediterranean) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'botanical-olive-branch') ||
      STICKER_ASSETS.find((s) => s.id === 'botanical-eucalyptus-garland') ||
      topSticker;
  } else if (isBaby) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'planner-doodle-heart') ||
      STICKER_ASSETS.find((s) => s.id === 'party-gold-balloon-star') ||
      STICKER_ASSETS.find((s) => s.id === 'romance-white-doves') ||
      STICKER_ASSETS.find((s) => s.id === 'botanical-pink-peony');
  } else if (isBirthday) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'party-wedding-cake') ||
      STICKER_ASSETS.find((s) => s.id === 'party-gold-balloon-star') ||
      STICKER_ASSETS.find((s) => s.id === 'party-champagne-pop');
  } else if (isMemorial) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'romance-white-doves') ||
      STICKER_ASSETS.find((s) => s.id === 'botanical-olive-branch');
  } else if (isGraduation) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'badge-best-day-ever') ||
      STICKER_ASSETS.find((s) => s.id === 'badge-vip-access') ||
      STICKER_ASSETS.find((s) => s.id === 'badge-its-giving-luxury');
  } else if (isWedding) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'romance-solitaire-diamond') ||
      STICKER_ASSETS.find((s) => s.id === 'romance-interlocking-rings') ||
      STICKER_ASSETS.find((s) => s.id === 'stationery-wax-seal-crimson') ||
      STICKER_ASSETS.find((s) => s.id === 'botanical-white-rose');
  }

  if (topSticker) {
    elements.push({
      id: 'sticker-hero-crest',
      type: 'sticker',
      name: topSticker.name,
      content: topSticker.imageUrl || topSticker.svgContent,
      x: 195,
      y: 36,
      width: 90,
      height: 90,
      rotation: 0,
      zIndex: 2,
      opacity: 1,
      styleProps: {},
      animation: { effect: 'gentleScale', duration: 1.2 },
      accessibilityLabel: topSticker.name,
    });
  }

  // 2. Eyebrow / Hosts Text (crisp tracked small caps, high contrast)
  elements.push({
    id: 'text-hosts',
    type: 'text',
    name: 'Host Line',
    content:
      values.hosts ||
      (isMemorial
        ? 'IN LOVING MEMORY'
        : isBirthday
        ? 'CELEBRATING WITH JOY'
        : isBaby
        ? 'WITH JOY & GRATITUDE'
        : 'TOGETHER WITH THEIR FAMILIES'),
    x: 40,
    y: 148,
    width: 400,
    height: 26,
    rotation: 0,
    zIndex: 3,
    opacity: 1,
    styleProps: {
      fontFamily: 'Inter',
      fontSize: 11,
      fontWeight: '700',
      color: accentColor,
      textAlign: 'center',
      letterSpacing: 2.4,
    },
    animation: { effect: 'fadeIn', duration: 0.8 },
  });

  // 3. Request / Subtitle (elegant, crisp italic serif)
  elements.push({
    id: 'text-request',
    type: 'text',
    name: 'Invitation Request',
    content:
      values.countdownLabel ||
      (isMemorial
        ? 'invite you to join in remembrance of'
        : isBirthday
        ? 'invite you to celebrate'
        : isBaby
        ? 'joyfully invite you to welcome'
        : 'joyfully invite you to the wedding of'),
    x: 40,
    y: 180,
    width: 400,
    height: 26,
    rotation: 0,
    zIndex: 4,
    opacity: 1,
    styleProps: {
      fontFamily: 'Cormorant Garamond',
      fontSize: 16,
      fontStyle: 'italic',
      fontWeight: '500',
      color: subtitleColor,
      textAlign: 'center',
      letterSpacing: 0.5,
    },
  });

  // 4. Main Event Title / Celebrants (striking display headline with responsive font scaling)
  const titleText = values.celebrants || values.title || 'Celebration';
  let titleFontSize = 36;
  if (titleText.length > 26) {
    titleFontSize = 26;
  } else if (titleText.length > 18) {
    titleFontSize = 30;
  } else if (titleText.length > 12) {
    titleFontSize = 34;
  }
  if (isBirthday || isBaby) {
    titleFontSize = Math.min(titleFontSize, 32);
  }

  elements.push({
    id: 'text-title',
    type: 'text',
    name: 'Celebrants / Title',
    content: titleText,
    x: 24,
    y: 216,
    width: 432,
    height: 76,
    rotation: 0,
    zIndex: 5,
    opacity: 1,
    styleProps: {
      fontFamily: headingFont,
      fontSize: titleFontSize,
      fontWeight: '700',
      color: primaryColor,
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: -0.3,
    },
    animation: { effect: 'rise', duration: 1.0 },
  });

  // 5. Date & Time Block (bold, prominent, high contrast)
  elements.push({
    id: 'text-date',
    type: 'text',
    name: 'Date & Time',
    content: `${values.date || 'Saturday, 14 November 2026'} · ${values.time || '2:00 PM'}`,
    x: 40,
    y: 326,
    width: 400,
    height: 32,
    rotation: 0,
    zIndex: 6,
    opacity: 1,
    styleProps: {
      fontFamily: 'Inter',
      fontSize: 13,
      fontWeight: '600',
      color: textColor,
      textAlign: 'center',
      letterSpacing: 1.2,
    },
  });

  // 6. Venue & City Block (clean, readable text with high contrast)
  elements.push({
    id: 'text-venue',
    type: 'text',
    name: 'Venue & City',
    content: `${values.venue || 'Safari Park Hotel'}\n${values.city || 'Nairobi, Kenya'}`,
    x: 40,
    y: 366,
    width: 400,
    height: 48,
    rotation: 0,
    zIndex: 7,
    opacity: 1,
    styleProps: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: '500',
      color: venueColor,
      textAlign: 'center',
      lineHeight: 1.5,
    },
  });

  // 7. Bottom Corner Accents tailored to archetype
  let cornerSticker = isWedding
    ? STICKER_ASSETS.find((s) => s.id === 'wedding-red-rose')
    : isHeritage
    ? STICKER_ASSETS.find((s) => s.id === 'heritage-ceremonial-drum')
    : isDisco || isBirthday
    ? STICKER_ASSETS.find((s) => s.id === 'party-confetti-ball')
    : isMediterranean
    ? STICKER_ASSETS.find((s) => s.id === 'botanical-hibiscus')
    : undefined;

  if (cornerSticker) {
    elements.push({
      id: 'sticker-bottom-left',
      type: 'sticker',
      name: `${cornerSticker.name} Corner Left`,
      content: cornerSticker.imageUrl || cornerSticker.svgContent,
      x: 10,
      y: 530,
      width: 80,
      height: 80,
      rotation: -15,
      zIndex: 1,
      opacity: 0.85,
      styleProps: {},
    });
    elements.push({
      id: 'sticker-bottom-right',
      type: 'sticker',
      name: `${cornerSticker.name} Corner Right`,
      content: cornerSticker.imageUrl || cornerSticker.svgContent,
      x: 390,
      y: 530,
      width: 80,
      height: 80,
      rotation: 15,
      zIndex: 1,
      opacity: 0.85,
      styleProps: {},
    });
  }

  // 8. Reception / RSVP Note (elegant italic line at bottom)
  elements.push({
    id: 'text-reception',
    type: 'text',
    name: 'Reception Line',
    content: isBirthday
      ? 'RSVP requested by date on card'
      : isMemorial
      ? 'A reception to celebrate her life will follow'
      : isBaby
      ? 'Celebration and refreshments to follow'
      : 'Reception and dinner to follow',
    x: 40,
    y: 595,
    width: 400,
    height: 30,
    rotation: 0,
    zIndex: 8,
    opacity: 1,
    styleProps: {
      fontFamily: 'Cormorant Garamond',
      fontSize: 14,
      fontStyle: 'italic',
      fontWeight: '500',
      color: subtitleColor,
      textAlign: 'center',
    },
  });

  return elements;
}
