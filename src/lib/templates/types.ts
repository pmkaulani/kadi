export type EventCategory =
  | 'wedding'
  | 'birthday'
  | 'memorial'
  | 'baby-shower'
  | 'graduation'
  | 'anniversary'
  | 'corporate'
  | 'community'
  | 'custom';

export type MotionPreset =
  | 'classic-stationery'
  | 'floral-romance'
  | 'cinematic'
  | 'modern-editorial'
  | 'birthday-playful'
  | 'baby-shower'
  | 'graduation'
  | 'dignified-memorial'
  | 'corporate';

export interface TemplatePalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBackground: string;
  text: string;
  textMuted: string;
  envelope: string;
  flap: string;
  seal: string;
  sealIconColor: string;
}

export interface TemplateLiner {
  id: 'floral' | 'geometric' | 'gold-foil' | 'botanical' | 'minimal' | 'terracotta' | 'african-print';
  name: string;
  className: string;
  patternSvg?: string;
}

export interface TemplateSeal {
  shape: 'circle' | 'diamond' | 'shield' | 'oval';
  monogram?: string;
  color: string;
  borderStyle?: string;
}

export interface TemplateDefinition {
  id: string;
  version: string;
  name: string;
  description: string;
  category: EventCategory;
  motionPreset: MotionPreset;
  palette: TemplatePalette;
  fonts: {
    heading: 'serif' | 'sans' | 'display';
    body: 'sans';
    script?: boolean;
  };
  liner: TemplateLiner;
  seal: TemplateSeal;
  heroLayout: 'centered-portrait' | 'editorial-split' | 'arch-window' | 'cinematic-landscape' | 'minimalist';
  supportedSections: Array<
    | 'hero'
    | 'welcome'
    | 'story'
    | 'countdown'
    | 'schedule'
    | 'venue'
    | 'dress-code'
    | 'rsvp'
    | 'gallery'
    | 'registry'
    | 'condolences'
    | 'candles'
    | 'faq'
  >;
  sampleData: {
    title: string;
    subtitle?: string;
    hosts: string;
    celebrants: string;
    date: string;
    time: string;
    venue: string;
    city: string;
    heroImage: string;
    story?: string;
  };
}
