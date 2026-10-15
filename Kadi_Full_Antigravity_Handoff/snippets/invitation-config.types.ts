/** A serializable block configuration. Do not store React nodes or callbacks here. */
export type InvitationBlockType =
  | 'hero' | 'rich-text' | 'photo' | 'gallery' | 'video' | 'venue-map'
  | 'countdown' | 'rsvp' | 'contribution' | 'timeline' | 'quote'
  | 'divider' | 'button' | 'faq' | 'music' | 'guestbook' | 'livestream';

export type ScrollMotion = 'none' | 'fade-up' | 'slide-in' | 'scale-in' | 'parallax';
export type SectionSpacing = 'compact' | 'comfortable' | 'spacious';
export type CornerStyle = 'square' | 'soft' | 'round' | 'pill';
export type BorderStyle = 'none' | 'thin' | 'thick' | 'dotted';

export interface CommonBlockSettings {
  padding: SectionSpacing;
  background?: string;
  textAlign: 'left' | 'center' | 'right';
  maxWidth: 'narrow' | 'standard' | 'wide' | 'full';
  scrollMotion: ScrollMotion;
  cornerStyle: CornerStyle;
  borderStyle: BorderStyle;
}

export interface InvitationBlockConfig<TContent = Record<string, unknown>> {
  id: string;
  type: InvitationBlockType;
  version: 1;
  enabled: boolean;
  settings: CommonBlockSettings;
  content: TContent;
}

export interface InvitationDesignConfig {
  version: 1;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: number;
    headingLetterSpacing: number;
    bodyLineHeight: number;
  };
  envelope: {
    style: 'floral-bloom' | 'confetti-burst' | 'minimal-fade' | 'classic-wax-seal' | 'gold-foil' | 'video-envelope';
    letterStyle: 'printed' | 'handwritten' | 'folded-card';
    liner: string;
    sealShape: 'circle' | 'diamond' | 'shield' | 'oval';
    sealMonogram: string;
    sealColor: string;
  };
  backgroundMotion: 'none' | 'petals' | 'confetti' | 'bokeh' | 'leaves' | 'snow' | 'candle-flicker' | 'doves';
  animationSpeed: 'slow' | 'medium' | 'fast';
  sectionSpacing: SectionSpacing;
}

export interface InvitationDraftConfig<TEvent = Record<string, unknown>> {
  schemaVersion: 1;
  event: TEvent;
  category: string;
  templateId: string;
  templateVersion: string;
  design: InvitationDesignConfig;
  blocks: InvitationBlockConfig[];
  updatedAt?: string;
}
