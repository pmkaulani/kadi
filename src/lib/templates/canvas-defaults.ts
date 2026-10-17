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
  const isWedding =
    template.category === 'wedding' ||
    template.category === 'anniversary' ||
    template.category === 'engagement';
  const isBirthday = template.category === 'birthday';
  const isMemorial =
    template.category === 'memorial' || template.category === 'funeral';
  const isGraduation =
    template.category === 'graduation' || template.category === 'corporate';
  const isBaby = template.category === 'baby-shower';

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

  // 1. Top Decorative 3D Image Sticker / Crest (tailored to event archetype & culture)
  let topSticker = STICKER_ASSETS.find((s) => s.id === 'wedding-diamond-ring');
  if (isHeritage) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'heritage-warrior-shield') ||
      STICKER_ASSETS.find((s) => s.id === 'heritage-safari-lion') ||
      topSticker;
  } else if (isDisco) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'party-disco-ball') ||
      STICKER_ASSETS.find((s) => s.id === 'tiktok-sparkles') ||
      topSticker;
  } else if (isArtDeco) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'milestone-royal-crown') ||
      STICKER_ASSETS.find((s) => s.id === 'wedding-gem-stone') ||
      topSticker;
  } else if (isMediterranean) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'botanical-palm-tree') ||
      STICKER_ASSETS.find((s) => s.id === 'botanical-hibiscus') ||
      topSticker;
  } else if (isBirthday) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'party-birthday-cake') ||
      STICKER_ASSETS.find((s) => s.id === 'party-balloon') ||
      STICKER_ASSETS.find((s) => s.id === 'tiktok-party-popper');
  } else if (isMemorial) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'memorial-dove') ||
      STICKER_ASSETS.find((s) => s.id === 'memorial-candle');
  } else if (isGraduation) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'milestone-graduation-cap') ||
      STICKER_ASSETS.find((s) => s.id === 'milestone-trophy') ||
      STICKER_ASSETS.find((s) => s.id === 'milestone-medal');
  } else if (isBaby) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'baby-teddy-bear') ||
      STICKER_ASSETS.find((s) => s.id === 'baby-crescent-moon') ||
      STICKER_ASSETS.find((s) => s.id === 'baby-bottle');
  } else if (isWedding) {
    topSticker =
      STICKER_ASSETS.find((s) => s.id === 'wedding-diamond-ring') ||
      STICKER_ASSETS.find((s) => s.id === 'wedding-red-rose') ||
      STICKER_ASSETS.find((s) => s.id === 'wedding-flower-bouquet');
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

  // 4. Main Event Title / Celebrants (striking display headline)
  elements.push({
    id: 'text-title',
    type: 'text',
    name: 'Celebrants / Title',
    content: values.celebrants || values.title || 'Kevin & Wanjiku',
    x: 30,
    y: 216,
    width: 420,
    height: 68,
    rotation: 0,
    zIndex: 5,
    opacity: 1,
    styleProps: {
      fontFamily: headingFont,
      fontSize: isBirthday ? 34 : 38,
      fontWeight: '700',
      color: primaryColor,
      textAlign: 'center',
      lineHeight: 1.15,
      letterSpacing: -0.5,
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
