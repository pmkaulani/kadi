import type { TemplateDefinition } from './types';
import type { DraftInvitationValues } from '@/lib/invitations/config';
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
  zIndex = 5,
  animationOverride?: CanvasElement['animation']
) {
  const text = content?.trim();
  if (!text) return;
  const animation: CanvasElement['animation'] = animationOverride ?? (
    id === 'text-title'
      ? { effect: 'rise', duration: 0.72, delay: 0.16 }
      : id === 'text-hosts'
        ? { effect: 'fadeIn', duration: 0.48, delay: 0.02 }
        : id === 'text-request'
          ? { effect: 'fadeIn', duration: 0.5, delay: 0.1 }
          : id === 'text-date'
            ? { effect: 'fadeIn', duration: 0.5, delay: 0.28 }
            : id === 'text-venue'
              ? { effect: 'fadeIn', duration: 0.5, delay: 0.36 }
              : undefined
  );
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
    animation,
  });
}

function addPhoto(
  elements: CanvasElement[],
  src: string | undefined,
  box: { x: number; y: number; width: number; height: number },
  maskShape: MaskShape = 'none',
  name = 'Invitation photograph',
  elementId = 'photo-hero',
  zIndex = 1
) {
  if (!src?.trim()) return;
  elements.push({
    id: elementId,
    type: 'photo',
    name,
    content: src,
    ...box,
    rotation: 0,
    zIndex,
    opacity: 1,
    styleProps: {
      maskShape,
      stickerEffect: false,
      stickerBorderWidth: 0,
      stickerBorderColor: '#FFFFFF',
    },
    animation: { effect: 'fadeIn', duration: 0.7, delay: 0.02 },
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
    animation: { effect: 'gentleScale', duration: 0.62, delay: 0.3 },
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

type CanvasBox = { x: number; y: number; width: number; height: number };

type ArtDirection = {
  eyebrow: string;
  request: string;
  photo: CanvasBox;
  mask: MaskShape;
  requestY?: number;
  secondaryPhoto?: CanvasBox & { mask: MaskShape };
  titleY: number;
  titleHeight: number;
  titleMax: number;
  detailsY: number;
  venueY: number;
  venueHeight: number;
  detailSize: number;
  headingFont: string;
  textAlign?: 'left' | 'center' | 'right';
  hostsBox?: CanvasBox;
  requestBox?: CanvasBox;
  titleBox?: CanvasBox;
  detailsBox?: CanvasBox;
  venueBox?: CanvasBox;
  rsvpBox?: CanvasBox;
  decorations?: Array<{
    id: string;
    assetIds: string[];
    box: CanvasBox;
    rotation?: number;
    opacity?: number;
    zIndex?: number;
  }>;
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

  // The heirloom wedding: one large arch portrait, deliberate whitespace, fine print details.
  if (id === 'savannah-twilight') {
    return {
      eyebrow: 'TOGETHER WITH THEIR FAMILIES',
      request: 'joyfully invite you to the wedding of',
      photo: { x: 105, y: 40, width: 270, height: 252 }, mask: 'arch',
      titleY: 323, titleHeight: 84, titleMax: 41, detailsY: 431, venueY: 471, venueHeight: 61,
      detailSize: 11, headingFont: 'Cormorant Garamond',
      decorations: [{
        id: 'motif-heirloom-bloom',
        assetIds: ['botanical-white-rose', 'botanical-olive-branch'],
        box: { x: 367, y: 552, width: 69, height: 78 },
        rotation: 10, opacity: 0.94, zIndex: 8,
      }],
    };
  }

  // The milestone suite gets an assertive landscape crop and a single celebratory accent.
  if (id === 'milestone-gold') {
    return {
      eyebrow: 'AN OCCASION TO REMEMBER',
      request: 'A golden evening for a remarkable milestone',
      photo: { x: 38, y: 39, width: 404, height: 230 }, mask: 'none',
      titleY: 309, titleHeight: 91, titleMax: 43, detailsY: 415, venueY: 455, venueHeight: 59,
      detailSize: 12, headingFont: 'Playfair Display',
      decorations: [{
        id: 'motif-golden-toast',
        assetIds: ['party-crystal-flutes', 'party-disco-ball'],
        box: { x: 369, y: 548, width: 68, height: 70 },
        rotation: 5, opacity: 0.96, zIndex: 8,
      }],
    };
  }

  // Corporate, launch and gala suites use an asymmetric editorial column, not a wedding-card stack.
  if (['summit-executive', 'modern-keynote', 'nexus-product-unveil', 'beacon-of-hope-gala'].includes(id)) {
    const isLaunch = id === 'nexus-product-unveil';
    const isKeynote = id === 'modern-keynote';
    const isGala = id === 'beacon-of-hope-gala';
    return {
      eyebrow: isLaunch ? 'A FIRST LOOK' : isKeynote ? 'IDEAS IN MOTION' : isGala ? 'AN EVENING WITH PURPOSE' : 'LEADERSHIP · IDEAS · CONNECTION',
      request: isLaunch ? 'An idea becomes something real' : isKeynote ? 'Join the conversation' : isGala ? 'Together, we can make a difference' : 'An evening of perspective and progress',
      photo: { x: 238, y: 57, width: 208, height: 232 }, mask: 'none',
      requestY: 292, titleY: 336, titleHeight: 91, titleMax: isGala ? 34 : 31,
      detailsY: 441, venueY: 480, venueHeight: 66, detailSize: 11,
      headingFont: isGala ? 'Cormorant Garamond' : 'Inter',
      textAlign: 'left',
      hostsBox: { x: 34, y: 53, width: 184, height: 30 },
      requestBox: { x: 34, y: 292, width: 186, height: 38 },
      titleBox: { x: 31, y: 337, width: 194, height: 91 },
      detailsBox: { x: 35, y: 441, width: 186, height: 32 },
      venueBox: { x: 35, y: 480, width: 188, height: 66 },
      rsvpBox: { x: 35, y: 571, width: 238, height: 22 },
      decorations: [{
        id: 'motif-edition-clip',
        assetIds: ['stationery-brass-clip'],
        box: { x: 418, y: 43, width: 32, height: 52 },
        rotation: 5, opacity: 0.92, zIndex: 8,
      }],
    };
  }

  // A quiet two-photo botanical composition for a letter that feels collected, not templated.
  if (id === 'sweet-beginnings') {
    return {
      eyebrow: 'A LITTLE LOVE IS ON THE WAY',
      request: 'Please join us to celebrate',
      photo: { x: 135, y: 43, width: 210, height: 207 }, mask: 'arch',
      secondaryPhoto: { x: 24, y: 165, width: 135, height: 145, mask: 'polaroid' },
      requestY: 316, titleY: 350, titleHeight: 84, titleMax: 35, detailsY: 446, venueY: 487, venueHeight: 54,
      detailSize: 11, headingFont: 'Cormorant Garamond',
      decorations: [{
        id: 'motif-first-bloom',
        assetIds: ['botanical-pink-peony', 'botanical-white-rose'],
        box: { x: 370, y: 548, width: 62, height: 70 },
        rotation: 8, opacity: 0.92, zIndex: 8,
      }],
    };
  }

  // Named art directions keep sibling templates visually distinct instead of recolouring one layout.
  if (id === 'these-are-for-you') {
    return {
      eyebrow: 'A FEW OF YOUR FAVOURITE THINGS', request: 'For the people who make life feel special',
      photo: { x: 24, y: 45, width: 210, height: 252 }, mask: 'polaroid',
      secondaryPhoto: { x: 220, y: 116, width: 166, height: 199, mask: 'polaroid' },
      requestY: 321, titleY: 351, titleHeight: 74, titleMax: 36, detailsY: 440, venueY: 478, venueHeight: 52,
      detailSize: 11, headingFont: 'Playfair Display',
    };
  }
  if (id === 'coastal-romance') {
    return {
      eyebrow: 'A GATHERING BY THE INDIAN OCEAN', request: 'Two hearts, one beautiful horizon',
      photo: { x: 42, y: 40, width: 332, height: 218 }, mask: 'none',
      secondaryPhoto: { x: 247, y: 143, width: 180, height: 160, mask: 'polaroid' },
      titleY: 344, titleHeight: 82, titleMax: 39, detailsY: 446, venueY: 486, venueHeight: 55,
      detailSize: 11, headingFont: 'Cormorant Garamond',
      decorations: [{
        id: 'motif-coastal-postmark',
        assetIds: ['stationery-postage-stamp-vintage'],
        box: { x: 367, y: 548, width: 63, height: 72 },
        rotation: 5, opacity: 0.9, zIndex: 8,
      }],
    };
  }
  if (id === 'sage-love-letter') {
    return {
      eyebrow: 'A NOTE FROM THE HEART', request: 'With love, and a little room to linger',
      photo: { x: 98, y: 48, width: 284, height: 226 }, mask: 'arch',
      titleY: 312, titleHeight: 82, titleMax: 37, detailsY: 419, venueY: 459, venueHeight: 55,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'ruby-disco-birthday') {
    return {
      eyebrow: 'TONIGHT IS YOURS', request: 'A little sparkle. A lot of memories.',
      photo: { x: 42, y: 42, width: 396, height: 238 }, mask: 'none',
      titleY: 316, titleHeight: 86, titleMax: 43, detailsY: 424, venueY: 465, venueHeight: 54,
      detailSize: 12, headingFont: 'Playfair Display',
    };
  }
  if (id === 'pastel-garden-birthday') {
    return {
      eyebrow: 'A GARDEN GATHERING', request: 'Cake, flowers, and your favourite people',
      photo: { x: 108, y: 45, width: 264, height: 220 }, mask: 'arch',
      titleY: 302, titleHeight: 90, titleMax: 36, detailsY: 416, venueY: 456, venueHeight: 55,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'birthday-color-pop') {
    return {
      eyebrow: 'THE COLOUR IS JOY', request: 'Come as you are. Leave with a story.',
      photo: { x: 31, y: 42, width: 418, height: 226 }, mask: 'none',
      titleY: 326, titleHeight: 90, titleMax: 43, detailsY: 430, venueY: 470, venueHeight: 51,
      detailSize: 12, headingFont: 'Playfair Display',
    };
  }
  if (id === 'golden-soiree') {
    return {
      eyebrow: 'AN EVENING TO REMEMBER', request: 'An intimate gathering after hours',
      photo: { x: 60, y: 48, width: 360, height: 210 }, mask: 'none',
      titleY: 292, titleHeight: 92, titleMax: 38, detailsY: 407, venueY: 448, venueHeight: 56,
      detailSize: 12, headingFont: 'Playfair Display',
    };
  }
  if (id === 'first-home-botanical') {
    return {
      eyebrow: 'A PLACE TO CALL HOME', request: 'Come see where the next chapter begins',
      photo: { x: 42, y: 45, width: 396, height: 238 }, mask: 'none',
      titleY: 322, titleHeight: 82, titleMax: 38, detailsY: 426, venueY: 467, venueHeight: 53,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'new-address-modern') {
    return {
      eyebrow: 'NEW ADDRESS · SAME GOOD COMPANY', request: 'We have a key to share with you',
      photo: { x: 48, y: 49, width: 384, height: 210 }, mask: 'none',
      titleY: 292, titleHeight: 91, titleMax: 34, detailsY: 408, venueY: 449, venueHeight: 56,
      detailSize: 12, headingFont: 'Inter',
    };
  }
  if (id === 'terrace-open-house') {
    return {
      eyebrow: 'DOORS OPEN, TABLE SET', request: 'Drop by for a sunny afternoon',
      photo: { x: 34, y: 47, width: 412, height: 228 }, mask: 'none',
      titleY: 316, titleHeight: 84, titleMax: 36, detailsY: 422, venueY: 463, venueHeight: 54,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'future-in-gold') {
    return {
      eyebrow: 'THE NEXT CHAPTER', request: 'A proud day, shared with our people',
      photo: { x: 62, y: 45, width: 356, height: 210 }, mask: 'arch',
      titleY: 294, titleHeight: 96, titleMax: 39, detailsY: 415, venueY: 455, venueHeight: 56,
      detailSize: 12, headingFont: 'Playfair Display',
    };
  }
  if (id === 'laurel-achievement') {
    return {
      eyebrow: 'WITH PRIDE AND GRATITUDE', request: 'Honouring the work behind the milestone',
      photo: { x: 106, y: 45, width: 268, height: 220 }, mask: 'arch',
      titleY: 302, titleHeight: 88, titleMax: 37, detailsY: 414, venueY: 454, venueHeight: 56,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'quiet-remembrance') {
    return {
      eyebrow: 'IN LOVING REMEMBRANCE', request: 'Gathering in honour of a life well lived',
      photo: { x: 60, y: 56, width: 360, height: 192 }, mask: 'none',
      titleY: 286, titleHeight: 86, titleMax: 32, detailsY: 399, venueY: 439, venueHeight: 65,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'dignified-passage') {
    return {
      eyebrow: 'IN REMEMBRANCE', request: 'A service of love, gratitude, and farewell',
      photo: { x: 160, y: 42, width: 160, height: 184 }, mask: 'oval',
      titleY: 264, titleHeight: 84, titleMax: 32, detailsY: 379, venueY: 419, venueHeight: 68,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'serene-meadow') {
    return {
      eyebrow: 'A LIFE THAT STILL SURROUNDS US', request: 'In quiet remembrance',
      photo: { x: 36, y: 48, width: 408, height: 220 }, mask: 'none',
      titleY: 308, titleHeight: 82, titleMax: 33, detailsY: 417, venueY: 457, venueHeight: 60,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'lullaby-stars') {
    return {
      eyebrow: 'A LITTLE STAR IS ON THE WAY', request: 'A soft and sweet welcome',
      photo: { x: 104, y: 45, width: 272, height: 220 }, mask: 'arch',
      titleY: 300, titleHeight: 87, titleMax: 35, detailsY: 414, venueY: 454, venueHeight: 55,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'tender-welcome-baby') {
    return {
      eyebrow: 'MEET OUR LITTLE WONDER', request: 'We would love you to meet our newest love',
      photo: { x: 74, y: 47, width: 332, height: 220 }, mask: 'none',
      titleY: 306, titleHeight: 88, titleMax: 35, detailsY: 419, venueY: 459, venueHeight: 55,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'golden-legacy') {
    return {
      eyebrow: 'A LIFE, A LOVE, A LEGACY', request: 'An anniversary worth sharing',
      photo: { x: 45, y: 48, width: 390, height: 218 }, mask: 'none',
      titleY: 301, titleHeight: 86, titleMax: 39, detailsY: 412, venueY: 452, venueHeight: 56,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'silver-memories') {
    return {
      eyebrow: 'MOMENTS THAT MADE US', request: 'A little look back, a lot to celebrate',
      photo: { x: 18, y: 43, width: 220, height: 264 }, mask: 'polaroid',
      secondaryPhoto: { x: 228, y: 125, width: 154, height: 185, mask: 'polaroid' },
      requestY: 316, titleY: 346, titleHeight: 78, titleMax: 37, detailsY: 437, venueY: 475, venueHeight: 50,
      detailSize: 11, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'summit-executive') {
    return {
      eyebrow: 'LEADERSHIP · IDEAS · CONNECTION', request: 'An evening of perspective and progress',
      photo: { x: 52, y: 50, width: 376, height: 192 }, mask: 'none',
      titleY: 281, titleHeight: 96, titleMax: 31, detailsY: 399, venueY: 440, venueHeight: 61,
      detailSize: 12, headingFont: 'Inter',
    };
  }
  if (id === 'modern-keynote') {
    return {
      eyebrow: 'IDEAS IN MOTION', request: 'Join the conversation',
      photo: { x: 36, y: 44, width: 408, height: 214 }, mask: 'none',
      titleY: 291, titleHeight: 96, titleMax: 32, detailsY: 408, venueY: 449, venueHeight: 58,
      detailSize: 12, headingFont: 'Inter',
    };
  }
  if (id === 'festive-lumiere') {
    return {
      eyebrow: 'GATHER CLOSE, GLOW BRIGHT', request: 'A seasonal evening with good company',
      photo: { x: 50, y: 51, width: 380, height: 210 }, mask: 'none',
      titleY: 302, titleHeight: 84, titleMax: 37, detailsY: 411, venueY: 451, venueHeight: 58,
      detailSize: 12, headingFont: 'Playfair Display',
    };
  }
  if (id === 'twilight-toast') {
    return {
      eyebrow: 'SOMETHING WONDERFUL IS BEGINNING', request: 'Join us for an engagement celebration',
      photo: { x: 50, y: 49, width: 380, height: 218 }, mask: 'none',
      titleY: 301, titleHeight: 86, titleMax: 38, detailsY: 411, venueY: 452, venueHeight: 56,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'harvest-table') {
    return {
      eyebrow: 'A PLACE AT THE TABLE', request: 'Food, stories, and neighbours',
      photo: { x: 32, y: 47, width: 416, height: 232 }, mask: 'none',
      titleY: 316, titleHeight: 84, titleMax: 38, detailsY: 422, venueY: 464, venueHeight: 55,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'blush-bridal-brunch') {
    return {
      eyebrow: 'A BRUNCH BEFORE THE BIG DAY', request: 'Raise a glass to the bride-to-be',
      photo: { x: 112, y: 43, width: 256, height: 218 }, mask: 'arch',
      titleY: 297, titleHeight: 88, titleMax: 36, detailsY: 410, venueY: 450, venueHeight: 56,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'nostalgic-alumni-reunion') {
    return {
      eyebrow: 'OLD FRIENDS, NEW MEMORIES', request: 'The years change; the stories stay',
      photo: { x: 42, y: 46, width: 396, height: 230 }, mask: 'none',
      titleY: 313, titleHeight: 84, titleMax: 38, detailsY: 420, venueY: 460, venueHeight: 56,
      detailSize: 12, headingFont: 'Playfair Display',
    };
  }
  if (id === 'sacred-light-milestone') {
    return {
      eyebrow: 'A MOMENT OF FAITH AND GRATITUDE', request: 'Gather with us for a sacred milestone',
      photo: { x: 124, y: 44, width: 232, height: 218 }, mask: 'arch',
      titleY: 300, titleHeight: 88, titleMax: 35, detailsY: 414, venueY: 454, venueHeight: 57,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'harambee-cultural-night') {
    return {
      eyebrow: 'CULTURE · FAMILY · CELEBRATION', request: 'With joy, we invite you to gather',
      photo: { x: 42, y: 45, width: 396, height: 228 }, mask: 'none',
      titleY: 315, titleHeight: 84, titleMax: 38, detailsY: 422, venueY: 462, venueHeight: 55,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'golden-horizon-retirement') {
    return {
      eyebrow: 'WITH GRATITUDE FOR A REMARKABLE JOURNEY', request: 'Please join us to honour the next chapter',
      photo: { x: 158, y: 43, width: 164, height: 184 }, mask: 'oval',
      titleY: 265, titleHeight: 84, titleMax: 32, detailsY: 379, venueY: 419, venueHeight: 66,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'nexus-product-unveil') {
    return {
      eyebrow: 'A FIRST LOOK', request: 'An idea becomes something real',
      photo: { x: 35, y: 44, width: 410, height: 210 }, mask: 'none',
      titleY: 292, titleHeight: 94, titleMax: 32, detailsY: 408, venueY: 449, venueHeight: 57,
      detailSize: 12, headingFont: 'Inter',
    };
  }
  if (id === 'beacon-of-hope-gala') {
    return {
      eyebrow: 'AN EVENING WITH PURPOSE', request: 'Together, we can make a difference',
      photo: { x: 46, y: 50, width: 388, height: 214 }, mask: 'none',
      titleY: 298, titleHeight: 89, titleMax: 36, detailsY: 413, venueY: 453, venueHeight: 57,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'bon-voyage-safari') {
    return {
      eyebrow: 'UNTIL THE NEXT ADVENTURE', request: 'Come send us off in good company',
      photo: { x: 40, y: 46, width: 400, height: 230 }, mask: 'none',
      titleY: 315, titleHeight: 83, titleMax: 37, detailsY: 421, venueY: 462, venueHeight: 55,
      detailSize: 12, headingFont: 'Playfair Display',
    };
  }
  if (id === 'gentle-healing-wishes') {
    return {
      eyebrow: 'SENDING YOU CARE', request: 'A small note, with a lot of love',
      photo: { x: 94, y: 51, width: 292, height: 215 }, mask: 'arch',
      titleY: 303, titleHeight: 84, titleMax: 35, detailsY: 410, venueY: 450, venueHeight: 55,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }
  if (id === 'bespoke-gathering') {
    return {
      eyebrow: 'MADE FOR THIS MOMENT', request: 'An invitation shaped around you',
      photo: { x: 44, y: 46, width: 392, height: 220 }, mask: 'none',
      titleY: 307, titleHeight: 85, titleMax: 36, detailsY: 417, venueY: 458, venueHeight: 55,
      detailSize: 12, headingFont: 'Cormorant Garamond',
    };
  }

  if (isMemorial) {
    return {
      eyebrow: 'IN LOVING MEMORY', request: 'A life remembered with love',
      photo: { x: 166, y: 54, width: 148, height: 154 }, mask: 'oval',
      titleY: 252, titleHeight: 76, titleMax: 31, detailsY: 365, venueY: 406, venueHeight: 62,
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

/**
 * Treat the font mapped from a template as its default, not as a custom override.
 * This lets each stationery suite retain its own art-directed type pairing.
 */
export function getCanvasHeadingFontOverride(
  template: TemplateDefinition,
  design?: { fontFamily?: string; typography?: { headingFont?: string } }
): string | undefined {
  const candidate = design?.typography?.headingFont || design?.fontFamily;
  const templateDefault = template.fonts.heading === 'sans' ? 'Inter' : 'Playfair Display';
  return candidate && candidate !== templateDefault ? candidate : undefined;
}

export interface CanvasArtDirectionOverrides {
  palette?: Partial<TemplateDefinition['palette']>;
  headingFont?: string;
}

export function getTemplateCanvasElements(
  template: TemplateDefinition,
  values: DraftInvitationValues,
  overrides: CanvasArtDirectionOverrides = {}
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
  const paletteTemplate = overrides.palette
    ? { ...template, palette: { ...template.palette, ...overrides.palette } }
    : template;
  const { ink, heading, accent, muted } = getAccessiblePalette(paletteTemplate);
  const headingFont = overrides.headingFont || direction.headingFont;
  const headingText = (values.celebrants || '').trim() || (values.title || template.sampleData.title).trim();

  const elements: CanvasElement[] = [];

  // One strong photograph is the hero artwork; secondary decorations stay deliberately few.
  const heroImage = values.heroImage || template.sampleData.heroImage;
  addPhoto(elements, heroImage, direction.photo, direction.mask,
    isMemorial ? 'A quiet portrait or remembrance photograph' : 'Event photograph');

  if (direction.secondaryPhoto) {
    const gallery = values.galleryImages?.length
      ? values.galleryImages
      : template.sampleData.galleryImages || [];
    const secondImage = gallery.find((image) => image && image !== heroImage);
    const { mask: secondaryMask, ...secondaryBox } = direction.secondaryPhoto;
    addPhoto(
      elements,
      secondImage,
      secondaryBox,
      secondaryMask,
      'A second memory from the event',
      'photo-secondary',
      3
    );
  }

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
      zIndex: 2,
      opacity: 1,
      styleProps: {
        shapeType: 'rectangle',
        fill: 'transparent',
        borderWidth: 1,
        borderColor: accent + '65',
      },
    });
  }

  const textAlign = direction.textAlign || 'center';
  addText(elements, 'text-hosts', 'Hosts / eyebrow',
    values.hosts?.trim() || direction.eyebrow,
    direction.hostsBox || { x: 40, y: 18, width: 400, height: 20 },
    { fontFamily: 'Inter', fontSize: isMemorial ? 10 : 9, fontWeight: 600, color: accent, textAlign, letterSpacing: isMemorial ? 1.8 : 2.0 }, 4);

  const secondaryPhotoBottom = direction.secondaryPhoto
    ? direction.secondaryPhoto.y + direction.secondaryPhoto.height
    : 0;
  const photoBottom = Math.max(
    direction.photo.y + direction.photo.height,
    secondaryPhotoBottom
  );
  const requestY = direction.requestBox?.y ?? Math.max(direction.requestY ?? 0, isMemorial ? 220 : 0, photoBottom + 6);
  addText(elements, 'text-request', 'Invitation request', direction.request,
    direction.requestBox || { x: 40, y: requestY, width: 400, height: 24 },
    { fontFamily: headingFont, fontSize: 15, fontStyle: isCorporate ? 'normal' : 'italic', fontWeight: 400, color: muted, textAlign, letterSpacing: 0.2 }, 5);

  let titleFontSize = direction.titleMax;
  if (headingText.length > 30) titleFontSize -= 8;
  else if (headingText.length > 23) titleFontSize -= 5;
  else if (headingText.length > 18) titleFontSize -= 2;
  if (isBaby || isMemorial) titleFontSize = Math.min(titleFontSize, 31);
  if (isCorporate) titleFontSize = Math.min(titleFontSize, 29);

  addText(elements, 'text-title', 'Celebrants / event title', headingText,
    direction.titleBox || { x: 30, y: direction.titleY, width: 420, height: direction.titleHeight },
    { fontFamily: headingFont, fontSize: Math.max(22, titleFontSize), fontWeight: isCorporate ? 600 : 500, color: heading, textAlign, lineHeight: 1.12, letterSpacing: isCorporate ? -0.6 : -0.25 }, 6,
    isMemorial ? { effect: 'fadeIn', duration: 0.7, delay: 0.12 } : undefined);

  const date = values.date?.trim() || template.sampleData.date;
  const time = values.time?.trim() || template.sampleData.time;
  addText(elements, 'text-date', 'Date and time', [date, time].filter(Boolean).join('  ·  '),
    direction.detailsBox || { x: 40, y: direction.detailsY, width: 400, height: 26 },
    { fontFamily: 'Inter', fontSize: direction.detailSize, fontWeight: 500, color: ink, textAlign, letterSpacing: 0.15 }, 7);

  const venue = values.venue?.trim() || template.sampleData.venue;
  const city = values.city?.trim() || template.sampleData.city;
  addText(elements, 'text-venue', 'Venue and city', [venue, city].filter(Boolean).join('\n'),
    direction.venueBox || { x: 46, y: direction.venueY, width: 388, height: direction.venueHeight },
    { fontFamily: 'Inter', fontSize: isMemorial ? 11 : 10.5, fontWeight: 400, color: muted, textAlign, lineHeight: 1.45 }, 7);

  const rsvp = values.rsvpDeadline?.trim();
  if (rsvp) {
    addRule(elements, 'rule-rsvp', 48, 548, 58, accent);
    addText(elements, 'text-rsvp', 'Kindly reply by', 'PLEASE REPLY BY ' + rsvp.toUpperCase(),
      direction.rsvpBox || { x: 48, y: 561, width: 286, height: 23 },
      { fontFamily: 'Inter', fontSize: 8.5, fontWeight: 500, color: muted, textAlign: 'left', letterSpacing: 0.8 }, 7);
  } else if (isMemorial) {
    addRule(elements, 'rule-remembrance', 210, 535, 60, accent);
    addText(elements, 'text-remembrance', 'Remembrance', 'FOREVER IN OUR HEARTS',
      { x: 48, y: 550, width: 384, height: 26 },
      { fontFamily: 'Inter', fontSize: 9, fontWeight: 500, color: muted, textAlign: 'center', letterSpacing: 1.25 }, 7);
  }

  // A single art-directed PNG embellishment; named suites replace the generic category motif.
  if (direction.decorations?.length) {
    direction.decorations.forEach((decoration) => {
      addSticker(elements, sticker(...decoration.assetIds), decoration.id, decoration.box, {
        rotation: decoration.rotation,
        opacity: decoration.opacity,
        zIndex: decoration.zIndex ?? 8,
      });
    });
  } else if (isWedding && id !== 'silver-memories') {
    addSticker(elements, sticker('botanical-olive-branch', 'botanical-eucalyptus-garland', 'botanical-white-rose'), 'sticker-motif', { x: 367, y: 560, width: 64, height: 72 }, { rotation: 12, opacity: 0.92, zIndex: 3 });
  } else if (isBirthday && id !== 'these-are-for-you') {
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
