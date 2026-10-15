/**
 * MERGE EXAMPLES, not a replacement for catalogue.ts. These use the exact
 * TemplateDefinition shape in the supplied Kadi source snapshot. Add them to
 * src/lib/templates/catalogue.ts only after adding the new category + motion
 * preset literals to src/lib/templates/types.ts and src/lib/db/types.ts.
 */
import type { TemplateDefinition } from '@/lib/templates/types';

export const HOUSEWARMING_BOTANICAL: TemplateDefinition = {
  id: 'first-home-botanical',
  version: '1.0.0',
  name: 'A Place to Call Home',
  description: 'Natural greens, warm photography and an open-house feeling for a new beginning.',
  category: 'housewarming',
  motionPreset: 'home-warming',
  palette: {
    primary: '#49694C', secondary: '#C78D59', accent: '#8CA58B',
    background: '#18251B', cardBackground: '#FAF8F0', text: '#20291F', textMuted: '#677365',
    envelope: '#526A50', flap: '#40553F', seal: '#C78D59', sealIconColor: '#18251B',
  },
  fonts: { heading: 'serif', body: 'sans', script: false },
  liner: { id: 'botanical', name: 'Leaf and linen', className: 'bg-liner-botanical' },
  seal: { shape: 'circle', monogram: 'HOME', color: '#C78D59' },
  heroLayout: 'editorial-split',
  supportedSections: ['hero', 'welcome', 'schedule', 'venue', 'rsvp', 'gallery', 'faq'],
  sampleData: {
    title: 'Come See Our New Home',
    subtitle: 'A little housewarming, a lot of good company.',
    hosts: 'Your hosts', celebrants: 'Your names here', date: 'Add your date', time: 'Add your time',
    venue: 'Your new address', city: 'Your town',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82',
    story: 'We have unpacked the boxes and made space for friends. Come celebrate this new chapter with us.',
  },
};

export const GRADUATION_MILESTONE: TemplateDefinition = {
  id: 'future-in-gold',
  version: '1.0.0',
  name: 'The Next Chapter',
  description: 'Confident navy, crisp type and a proud milestone layout for graduation day.',
  category: 'graduation',
  motionPreset: 'graduation',
  palette: {
    primary: '#173C6B', secondary: '#D7A94E', accent: '#4C7DAA',
    background: '#101D30', cardBackground: '#FBFAF6', text: '#101B2B', textMuted: '#697789',
    envelope: '#183F73', flap: '#102D53', seal: '#D7A94E', sealIconColor: '#101D30',
  },
  fonts: { heading: 'display', body: 'sans', script: false },
  liner: { id: 'geometric', name: 'Midnight geometry', className: 'bg-liner-geometric' },
  seal: { shape: 'shield', monogram: '26', color: '#D7A94E' },
  heroLayout: 'editorial-split',
  supportedSections: ['hero', 'welcome', 'story', 'schedule', 'venue', 'rsvp', 'gallery', 'faq'],
  sampleData: {
    title: 'A Graduation Celebration',
    subtitle: 'The work was worth it. Come celebrate the next chapter.',
    hosts: 'Your family', celebrants: 'Graduate name', date: 'Add ceremony date', time: 'Add celebration time',
    venue: 'Add venue', city: 'Add city',
    heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=82',
    story: 'A milestone made possible by hard work, support and belief. Join us for the celebration.',
  },
};

export const BIRTHDAY_CONFETTI: TemplateDefinition = {
  id: 'birthday-color-pop',
  version: '1.0.0',
  name: 'Color Pop',
  description: 'Vibrant colors, oversized numbers and lively layouts for a birthday gathering.',
  category: 'birthday',
  motionPreset: 'birthday-playful',
  palette: {
    primary: '#D84D68', secondary: '#FFBF63', accent: '#5C67C7',
    background: '#241526', cardBackground: '#FFF8F5', text: '#2B1722', textMuted: '#796671',
    envelope: '#D84D68', flap: '#B83250', seal: '#FFBF63', sealIconColor: '#2B1722',
  },
  fonts: { heading: 'display', body: 'sans' },
  liner: { id: 'geometric', name: 'Confetti geometry', className: 'bg-liner-geometric' },
  seal: { shape: 'circle', monogram: 'PARTY', color: '#FFBF63' },
  heroLayout: 'cinematic-landscape',
  supportedSections: ['hero', 'welcome', 'schedule', 'venue', 'dress-code', 'rsvp', 'gallery', 'faq'],
  sampleData: {
    title: 'Come Celebrate My Birthday', subtitle: 'Good people, good music, a very good reason to gather.',
    hosts: 'Your host', celebrants: 'Birthday person', date: 'Add your date', time: 'Add your time',
    venue: 'Add your venue', city: 'Add your city',
    heroImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=82',
    story: 'One more trip around the sun. Come celebrate with us.',
  },
};

export const FUNERAL_SERVICE_PROGRAMME: TemplateDefinition = {
  id: 'quiet-remembrance',
  version: '1.0.0',
  name: 'Quiet Remembrance',
  description: 'A respectful, accessible service page for remembrance, directions and tributes.',
  category: 'funeral',
  motionPreset: 'funeral-service',
  palette: {
    primary: '#63715F', secondary: '#AEB7A8', accent: '#D0D0C4',
    background: '#252A25', cardBackground: '#F7F7F2', text: '#252A25', textMuted: '#626B62',
    envelope: '#414E42', flap: '#354237', seal: '#879481', sealIconColor: '#F7F7F2',
  },
  fonts: { heading: 'serif', body: 'sans', script: false },
  liner: { id: 'botanical', name: 'Quiet botanical', className: 'bg-liner-botanical' },
  seal: { shape: 'circle', monogram: 'In memory', color: '#879481' },
  heroLayout: 'centered-portrait',
  supportedSections: ['hero', 'welcome', 'schedule', 'venue', 'condolences', 'rsvp', 'gallery', 'faq'],
  sampleData: {
    title: 'In Loving Memory', subtitle: 'A life remembered with love and gratitude.',
    hosts: 'The family', celebrants: 'Name of loved one', date: 'Add service date', time: 'Add service time',
    venue: 'Add service location', city: 'Add city',
    heroImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=82',
    story: 'Family and friends are invited to gather, remember and celebrate a life that touched many.',
  },
};

export const HOUSEWARMING_MODERN: TemplateDefinition = {
  ...HOUSEWARMING_BOTANICAL,
  id: 'new-address-modern',
  name: 'New Address',
  description: 'Clean architectural photography, warm neutrals and a modern open-house mood.',
  palette: { ...HOUSEWARMING_BOTANICAL.palette, primary: '#273A40', secondary: '#D0B18A', accent: '#A4B8B5', background: '#182126', envelope: '#263C42', flap: '#1B2D32' },
  fonts: { heading: 'sans', body: 'sans', script: false },
  liner: { id: 'minimal', name: 'Warm minimal', className: 'bg-paper-grain' },
  seal: { shape: 'circle', monogram: 'OPEN', color: '#D0B18A' },
};
