import type { TemplateDefinition } from './types';
import type { DraftInvitationValues } from '@/components/invitations/DraftInvitationPreview';
import type { CanvasElement, CanvasElementStyle, MaskShape } from '@/types/canvas';
import { STICKER_ASSETS, type StickerAsset } from '@/lib/assets/stickers';

function luminance(hexColor: string): number {
  const raw = hexColor?.replace('#', '') || '';
  if (!/^[0-9a-f]{6}$/i.test(raw)) return 0.5;
  const channels = [0, 2, 4].map((offset) => parseInt(raw.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function getAccessiblePalette(template: TemplateDefinition) {
  const cardBg = template.palette.cardBackground || '#FCFAF7';
  const isLightBg = luminance(cardBg) > 0.52;
  const rawInk = template.palette.text || '#272620';
  const rawPrimary = template.palette.primary || rawInk;
  const rawAccent = template.palette.secondary || '#B99A62';

  return {
    ink: isLightBg ? (luminance(rawInk) < 0.44 ? rawInk : '#272620') : '#FAF8F5',
    heading: isLightBg
      ? (luminance(rawPrimary) < 0.40 ? rawPrimary : '#272620')
      : (luminance(rawPrimary) > 0.46 ? rawPrimary : '#FAF8F5'),
    accent: isLightBg
      ? (luminance(rawAccent) < 0.34 ? rawAccent : '#77552D')
      : (luminance(rawAccent) > 0.48 ? rawAccent : '#E8D0A0'),
    muted: isLightBg ? '#625A50' : '#E5DED2',
  };
}

function sticker(...ids: string[]): StickerAsset | undefined {
  for (const id of ids) {
    const asset = STICKER_ASSETS.find((candidate) => candidate.id === id);
    if (asset?.imageUrl) return asset;
  }
  return undefined;
}

function addText(
  elements: CanvasElement[],
  id: string,
  name: string,
  content: string | undefined,
  box: { x: number; y: number; width: number; height: number },
  styleProps: CanvasElementStyle,
  zIndex = 5
) {
  const text = content?.trim();
  if (!text) return;
  elements.push({
    id,
    type: 'text',
    name,
    content: text,
    ...box,
    rotation: 0,
    zIndex,
    opacity: 1,
    styleProps,
  });
}

function addPhoto(
  elements: CanvasElement[],
  src: string | undefined,
  box: { x: number; y: number; width: number; height: number },
  maskShape: MaskShape = 'none',
  name = 'Invitation photograph'
) {
  if (!src?.trim()) return;
  elements.push({
    id: 'photo-hero',
    type: 'photo',
    name,
    content: src,
    ...box,
    rotation: 0,
    zIndex: 1,
    opacity: 1,
    styleProps: {
      maskShape,
      stickerEffect: false,
      stickerBorderWidth: 0,
      stickerBorderColor: '#FFFFFF',
    },
    accessibilityLabel: name,
  });
}

function addSticker(
  elements: CanvasElement[],
  asset: StickerAsset | undefined,
  id: string,
  box: { x: number; y: number; width: number; height: number },
  options: { rotation?: number; opacity?: number; zIndex?: number } = {}
) {
  if (!asset) return;
  elements.push({
    id,
    type: 'sticker',
    name: asset.name,
    // Always use transparent PNG artwork, not SVG-like fallback markup.
    content: asset.imageUrl,
    ...box,
    rotation: options.rotation ?? 0,
    zIndex: options.zIndex ?? 7,
    opacity: options.opacity ?? 1,
    styleProps: {},
    accessibilityLabel: asset.name,
  });
}

function addRule(
  elements: CanvasElement[],
  id: string,
  x: number,
  y: number,
  width: number,
  color: string,
  zIndex = 4
) {
  elements.push({
    id,
    type: 'shape',
    name: 'Fine printed rule',
    content: '',
    x,
    y,
    width,
    height: 1,
    rotation: 0,
    zIndex,
    opacity: 0.78,
    styleProps: { shapeType: 'rectangle', fill: color, borderWidth: 0 },
  });
}

type ArtDirection = {
  eyebrow: string;
  request: string;
  photo: { x: number; y: number; width: number; height: number };
  mask: MaskShape;
  titleY: number;
  titleHeight: number;
  titleMax: number;
  detailsY: number;
  venueY: number;
  venueHeight: number;
  detailSize: number;
  headingFont: string;
};

function resolveArtDirection(template: TemplateDefinition): ArtDirection {
  const category = template.category as string;
  const id = template.id.toLowerCase();
  const isWedding = ['wedding', 'engagement', 'anniversary', 'bridal-shower'].includes(category);
  const isBirthday = category === 'birthday';
  const isMemorial = category === 'memorial' || category === 'funeral';
  const isBaby = category === 'baby-shower' || category === 'welcome-baby' || id.includes('baby');
  const isGraduation = category === 'graduation';
  const isHousewarming = category === 'housewarming';
  const isCorporate = ['corporate', 'product-launch', 'fundraiser'].includes(category);
  const isHeritage = category === 'cultural-celebration' || id.includes('cultural') || id.includes('harambee') || id.includes('safari');

  if (isMemorial) {
    return {
      eyebrow: 'IN LOVING MEMORY', request: 'A life remembered with love',
      photo: { x: 166, y: 54, width: 148, height: 154 }, mask: 'oval',
      titleY: 245, titleHeight: 76, titleMax: 31, detailsY: 360, venueY: 401, venueHeight: 62,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (isWedding) {
    return {
      eyebrow: category === 'anniversary' ? 'A MILESTONE TO TREASURE' : category === 'engagement' ? 'A CELEBRATION OF LOVE' : 'TOGETHER WITH THEIR FAMILIES',
      request: category === 'anniversary' ? 'invite you to celebrate' : category === 'engagement' ? 'invite you to share in the joy of' : 'joyfully invite you to the wedding of',
      photo: { x: 76, y: 54, width: 328, height: 226 }, mask: 'arch',
      titleY: 315, titleHeight: 78, titleMax: 39, detailsY: 421, venueY: 462, venueHeight: 50,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (isBirthday) {
    return {
      eyebrow: 'A DATE WORTH CELEBRATING', request: 'Join us for a little more life',
      photo: { x: 38, y: 42, width: 404, height: 236 }, mask: 'none',
      titleY: 318, titleHeight: 92, titleMax: 43, detailsY: 429, venueY: 469, venueHeight: 50,
      detailSize: 12, headingFont: 'Playfair Display',
    };
  }
  if (isBaby) {
    return {
      eyebrow: 'A LITTLE LOVE IS ON THE WAY', request: 'Please join us to celebrate',
      photo: { x: 104, y: 45, width: 272, height: 225 }, mask: 'arch',
      titleY: 304, titleHeight: 86, titleMax: 34, detailsY: 420, venueY: 460, venueHeight: 52,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (isGraduation) {
    return {
      eyebrow: 'A MILESTONE EARNED', request: 'With pride and gratitude',
      photo: { x: 50, y: 46, width: 380, height: 222 }, mask: 'none',
      titleY: 303, titleHeight: 88, titleMax: 38, detailsY: 413, venueY: 453, venueHeight: 56,
      detailSize: 12, headingFont: 'Playfair Display',
    };
  }
  if (isHousewarming) {
    return {
      eyebrow: 'A NEW CHAPTER BEGINS', request: 'Come make yourself at home',
      photo: { x: 42, y: 46, width: 396, height: 240 }, mask: 'none',
      titleY: 318, titleHeight: 84, titleMax: 38, detailsY: 424, venueY: 464, venueHeight: 55,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (isCorporate) {
    return {
      eyebrow: 'YOU ARE CORDIALLY INVITED', request: 'An occasion to bring people together',
      photo: { x: 42, y: 50, width: 396, height: 210 }, mask: 'none',
      titleY: 293, titleHeight: 92, titleMax: 32, detailsY: 409, venueY: 450, venueHeight: 58,
      detailSize: 12, headingFont: 'Inter',
    };
  }
  if (isHeritage) {
    return {
      eyebrow: 'CULTURE · FAMILY · CELEBRATION', request: 'With joy, we invite you to gather',
      photo: { x: 44, y: 47, width: 392, height: 235 }, mask: 'none',
      titleY: 316, titleHeight: 80, titleMax: 38, detailsY: 423, venueY: 464, venueHeight: 55,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }

  return {
    eyebrow: 'YOU ARE INVITED', request: template.sampleData.subtitle || 'Please join us for this special occasion',
    photo: { x: 48, y: 48, width: 384, height: 222 }, mask: 'none',
    titleY: 306, titleHeight: 90, titleMax: 36, detailsY: 417, venueY: 458, venueHeight: 56,
    detailSize: 12, headingFont: template.fonts.heading === 'sans' ? 'Inter' : 'Playfair Display',
  };
}

export function getTemplateCanvasElements(
  template: TemplateDefinition,
  values: DraftInvitationValues
): CanvasElement[] {
  const category = template.category as string;
  const id = template.id.toLowerCase();
  const isWedding = ['wedding', 'engagement', 'anniversary', 'bridal-shower'].includes(category);
  const isBirthday = category === 'birthday';
  const isMemorial = category === 'memorial' || category === 'funeral';
  const isBaby = category === 'baby-shower' || category === 'welcome-baby' || id.includes('baby');
  const isGraduation = category === 'graduation';
  const isHousewarming = category === 'housewarming';
  const isCorporate = ['corporate', 'product-launch', 'fundraiser'].includes(category);
  const isHeritage = category === 'cultural-celebration' || id.includes('cultural') || id.includes('harambee') || id.includes('safari');
  const direction = resolveArtDirection(template);
  const { ink, heading, accent, muted } = getAccessiblePalette(template);
  const headingText = (values.celebrants || '').trim() || (values.title || template.sampleData.title).trim();

  const elements: CanvasElement[] = [];

  // One strong photograph is the hero artwork; secondary decorations stay deliberately few.
  addPhoto(elements, values.heroImage || template.sampleData.heroImage, direction.photo, direction.mask,
    isMemorial ? 'A quiet portrait or remembrance photograph' : 'Event photograph');

  // A fine frame sits behind rectangular photography only.
  if (direction.mask === 'none') {
    elements.push({
      id: 'shape-photo-frame',
      type: 'shape',
      name: 'Photograph hairline frame',
      content: '',
      x: direction.photo.x - 3,
      y: direction.photo.y - 3,
      width: direction.photo.width + 6,
      height: direction.photo.height + 6,
      rotation: 0,
      zIndex: 0,
      opacity: 1,
      styleProps: {
        shapeType: 'rectangle',
        fill: 'transparent',
        borderWidth: 1,
        borderColor: accent + '65',
      },
    });
  }

  addText(elements, 'text-hosts', 'Hosts / eyebrow',
    values.hosts?.trim() || direction.eyebrow,
    { x: 40, y: 18, width: 400, height: 20 },
    { fontFamily: 'Inter', fontSize: isMemorial ? 10 : 9, fontWeight: 600, color: accent, textAlign: 'center', letterSpacing: isMemorial ? 1.8 : 2.0 }, 4);

  addText(elements, 'text-request', 'Invitation request', direction.request,
    { x: 40, y: isMemorial ? 220 : 286, width: 400, height: 24 },
    { fontFamily: isMemorial ? 'Cormorant Garamond' : direction.headingFont, fontSize: 15, fontStyle: isCorporate ? 'normal' : 'italic', fontWeight: 400, color: muted, textAlign: 'center', letterSpacing: 0.2 }, 5);

  let titleFontSize = direction.titleMax;
  if (headingText.length > 30) titleFontSize -= 8;
  else if (headingText.length > 23) titleFontSize -= 5;
  else if (headingText.length > 18) titleFontSize -= 2;
  if (isBaby || isMemorial) titleFontSize = Math.min(titleFontSize, 31);
  if (isCorporate) titleFontSize = Math.min(titleFontSize, 29);

  addText(elements, 'text-title', 'Celebrants / event title', headingText,
    { x: 30, y: direction.titleY, width: 420, height: direction.titleHeight },
    { fontFamily: direction.headingFont, fontSize: Math.max(22, titleFontSize), fontWeight: isCorporate ? 600 : 500, color: heading, textAlign: 'center', lineHeight: 1.12, letterSpacing: isCorporate ? -0.6 : -0.25 }, 6);

  const date = values.date?.trim() || template.sampleData.date;
  const time = values.time?.trim() || template.sampleData.time;
  addText(elements, 'text-date', 'Date and time', [date, time].filter(Boolean).join('  ·  '),
    { x: 40, y: direction.detailsY, width: 400, height: 26 },
    { fontFamily: 'Inter', fontSize: direction.detailSize, fontWeight: 500, color: ink, textAlign: 'center', letterSpacing: 0.15 }, 7);

  const venue = values.venue?.trim() || template.sampleData.venue;
  const city = values.city?.trim() || template.sampleData.city;
  addText(elements, 'text-venue', 'Venue and city', [venue, city].filter(Boolean).join('\n'),
    { x: 46, y: direction.venueY, width: 388, height: direction.venueHeight },
    { fontFamily: 'Inter', fontSize: isMemorial ? 11 : 10.5, fontWeight: 400, color: muted, textAlign: 'center', lineHeight: 1.45 }, 7);

  const rsvp = values.rsvpDeadline?.trim();
  if (rsvp) {
    addRule(elements, 'rule-rsvp', 190, 548, 100, accent);
    addText(elements, 'text-rsvp', 'Kindly reply by', 'PLEASE REPLY BY ' + rsvp.toUpperCase(),
      { x: 48, y: 561, width: 384, height: 23 },
      { fontFamily: 'Inter', fontSize: 9, fontWeight: 500, color: muted, textAlign: 'center', letterSpacing: 1.1 }, 7);
  } else if (isMemorial) {
    addRule(elements, 'rule-remembrance', 210, 535, 60, accent);
    addText(elements, 'text-remembrance', 'Remembrance', 'FOREVER IN OUR HEARTS',
      { x: 48, y: 550, width: 384, height: 26 },
      { fontFamily: 'Inter', fontSize: 9, fontWeight: 500, color: muted, textAlign: 'center', letterSpacing: 1.25 }, 7);
  } else if (isWedding) {
    addRule(elements, 'rule-footer', 215, 546, 50, accent);
    addText(elements, 'text-footer', 'Invitation note', 'WITH JOY, WE LOOK FORWARD TO CELEBRATING WITH YOU',
      { x: 48, y: 559, width: 384, height: 26 },
      { fontFamily: 'Inter', fontSize: 8, fontWeight: 500, color: muted, textAlign: 'center', letterSpacing: 0.8 }, 7);
  }

  // One occasion-specific motif is enough. Avoid duplicated corner stickers.
  if (isWedding) {
    addSticker(elements, sticker('botanical-olive-branch', 'botanical-eucalyptus-garland', 'botanical-white-rose'), 'sticker-motif', { x: 367, y: 560, width: 64, height: 72 }, { rotation: 12, opacity: 0.92, zIndex: 3 });
  } else if (isBirthday) {
    addSticker(elements, sticker('party-disco-ball', 'party-gold-balloon-star', 'party-wedding-cake'), 'sticker-motif', { x: 371, y: 552, width: 70, height: 70 }, { rotation: 7, opacity: 0.96, zIndex: 3 });
  } else if (isBaby) {
    addSticker(elements, sticker('botanical-pink-peony', 'planner-doodle-heart', 'botanical-white-rose'), 'sticker-motif', { x: 370, y: 555, width: 64, height: 70 }, { rotation: 8, opacity: 0.9, zIndex: 3 });
  } else if (isHeritage) {
    addSticker(elements, sticker('cultural-harusi-tunayo', 'cultural-ruracio-vibes', 'planner-harusi-yetu'), 'sticker-motif', { x: 356, y: 556, width: 84, height: 74 }, { rotation: 2, opacity: 0.95, zIndex: 3 });
  } else if (isGraduation) {
    addSticker(elements, sticker('badge-best-day-ever', 'badge-save-the-date'), 'sticker-motif', { x: 368, y: 552, width: 72, height: 70 }, { rotation: -6, opacity: 0.92, zIndex: 3 });
  } else if (isHousewarming) {
    addSticker(elements, sticker('botanical-monstera-leaf', 'botanical-olive-branch'), 'sticker-motif', { x: 367, y: 555, width: 66, height: 73 }, { rotation: 9, opacity: 0.9, zIndex: 3 });
  }

  return elements;
}
