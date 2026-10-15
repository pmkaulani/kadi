import type { EnvelopeShape, EnvelopeTheme, InvitationThemeConfig, LetterFormat } from './types';

/** Colours and material cues for the five moodboard directions plus two video-specific worlds and memorial. */
export const ENVELOPE_THEMES: Record<EnvelopeTheme, InvitationThemeConfig> = {
  'royal-velvet': {
    label: 'Royal Velvet', description: 'Ruby velvet, antique gold and rich tactile paper.',
    background: '#160c12', envelope: '#6f1427', envelopeDark: '#350a17', liner: '#d9b985', paper: '#f5e8d2',
    ink: '#3a2020', accent: '#c9a362', seal: '#8e1c2e', sealInk: '#f3d7a0', ornamental: '#d8b77e', surfaceTexture: 'linen',
  },
  'botanical-green': {
    label: 'Botanical Green', description: 'Sage, olive, pressed leaves and natural cotton paper.',
    background: '#172019', envelope: '#66785d', envelopeDark: '#354b39', liner: '#eee8d2', paper: '#fbf6e8',
    ink: '#344339', accent: '#b28d5b', seal: '#765441', sealInk: '#f7e8c7', ornamental: '#8b9b74', surfaceTexture: 'floral',
  },
  'blush-floral': {
    label: 'Blush Floral', description: 'Warm blush, soft pink seals and delicate floral paper.',
    background: '#2a161d', envelope: '#dba9a6', envelopeDark: '#b77d85', liner: '#fae8dc', paper: '#fff7ed',
    ink: '#65464a', accent: '#bc8a72', seal: '#c88989', sealInk: '#fff2e7', ornamental: '#d49a9b', surfaceTexture: 'floral',
  },
  'modern-minimal': {
    label: 'Modern Minimal', description: 'Architectural folds, matte ivory and restrained black detail.',
    background: '#151719', envelope: '#e6dfd3', envelopeDark: '#c8beb0', liner: '#d5ccbd', paper: '#fffdf8',
    ink: '#272522', accent: '#a08c70', seal: '#262626', sealInk: '#eee6d8', ornamental: '#80786c', surfaceTexture: 'plain',
  },
  'blue-tones': {
    label: 'Blue Tones', description: 'Midnight blue, antique brass and cloud-blue stationery.',
    background: '#081421', envelope: '#142e4c', envelopeDark: '#081629', liner: '#d7d5cb', paper: '#f5f4ef',
    ink: '#1c2b3b', accent: '#c4a66a', seal: '#214c74', sealInk: '#f5e1a9', ornamental: '#c7b17d', surfaceTexture: 'stars',
  },
  'ruby-disco': {
    label: 'Ruby Disco', description: 'Playful ruby, midnight contrast and tiny disco glints.',
    background: '#760d22', envelope: '#a51c38', envelopeDark: '#5c0a21', liner: '#f2c7bf', paper: '#fff0e4',
    ink: '#3d1820', accent: '#d9ced0', seal: '#9a1530', sealInk: '#f7dce0', ornamental: '#f1d6c2', surfaceTexture: 'stars',
  },
  'gift-box': {
    label: 'Gift Letter', description: 'A gift-like keepsake with bright red paper and warm cream inserts.',
    background: '#761025', envelope: '#bd2940', envelopeDark: '#801528', liner: '#f7d9c4', paper: '#fff2df',
    ink: '#482127', accent: '#d5a35e', seal: '#9f1729', sealInk: '#ffe3ad', ornamental: '#f0c9ab', surfaceTexture: 'grain',
  },
  memorial: {
    label: 'Memorial', description: 'Quiet ivory, slate, deep green and dignified restraint.',
    background: '#151a18', envelope: '#414f46', envelopeDark: '#27332c', liner: '#e1ddd2', paper: '#f7f5ef',
    ink: '#303932', accent: '#a99c83', seal: '#4b5b50', sealInk: '#f5efe2', ornamental: '#b1b4a5', surfaceTexture: 'memorial',
  },
};

export const ENVELOPE_SHAPES: Array<{ id: EnvelopeShape; label: string; description: string }> = [
  { id: 'classic-fold', label: 'Classic Fold', description: 'Traditional triangular flap and central seal.' },
  { id: 'tri-fold', label: 'Tri-Fold', description: 'Three-panel stationery with layered side folds.' },
  { id: 'pocket', label: 'Pocket Sleeve', description: 'Deep pocket with a visible nested card stack.' },
  { id: 'ribbon-tie', label: 'Ribbon Tie', description: 'A satin cross-ribbon with a tied centre.' },
  { id: 'wax-string', label: 'Wax & String', description: 'Textured wrap string secured under the wax seal.' },
  { id: 'scalloped-edge', label: 'Scalloped Edge', description: 'Soft die-cut edges and a romantic stationery feel.' },
];

export const LETTER_FORMATS: Array<{ id: LetterFormat; label: string; description: string }> = [
  { id: 'printed', label: 'Printed Letter', description: 'Formal typography, small rules and ornamental corners.' },
  { id: 'handwritten', label: 'Handwritten Letter', description: 'Personal script style with an intimate note layout.' },
  { id: 'folded-card', label: 'Folded Card', description: 'A two-panel keepsake that opens after it emerges.' },
];
