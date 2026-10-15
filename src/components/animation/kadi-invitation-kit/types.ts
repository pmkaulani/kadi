import type { ReactNode } from 'react';

/** Visual families are intentionally distinct; do not force one aesthetic onto every event. */
export type EnvelopeTheme =
  | 'royal-velvet'
  | 'botanical-green'
  | 'blush-floral'
  | 'modern-minimal'
  | 'blue-tones'
  | 'ruby-disco'
  | 'gift-box'
  | 'memorial';

export type EnvelopeShape =
  | 'classic-fold'
  | 'tri-fold'
  | 'pocket'
  | 'ribbon-tie'
  | 'wax-string'
  | 'scalloped-edge';

export type LetterFormat = 'printed' | 'handwritten' | 'folded-card';

export type OpeningPhase =
  | 'closed'
  | 'seal-press'
  | 'seal-break'
  | 'flap-open'
  | 'liner-reveal'
  | 'inserts-rise'
  | 'letter-rise'
  | 'letter-unfold'
  | 'handoff'
  | 'revealed';

export type InvitationThemeConfig = {
  label: string;
  description: string;
  background: string;
  envelope: string;
  envelopeDark: string;
  liner: string;
  paper: string;
  ink: string;
  accent: string;
  seal: string;
  sealInk: string;
  ornamental: string;
  surfaceTexture: 'linen' | 'grain' | 'floral' | 'stars' | 'plain' | 'memorial';
};

export type EnvelopeExperienceProps = {
  /** Pull these from the current event/template record. */
  names?: string;
  eyebrow?: string;
  monogram?: string;
  recipientName?: string;
  letterHeading?: string;
  letterCopy?: string;
  eventDate?: string;
  eventLocation?: string;
  /** Choose the style and object shape separately. */
  theme?: EnvelopeTheme;
  shape?: EnvelopeShape;
  letterFormat?: LetterFormat;
  /** Optional actual invitation card content/insert, from the event record. */
  letterContent?: ReactNode;
  secondInsert?: ReactNode;
  /** Actual invitation page is mounted after the opening choreography finishes. */
  children: ReactNode;
  onOpen?: () => void;
  /** Accessible escape hatch during the sequence. */
  allowSkip?: boolean;
  /** Adds a low-key replay control to the revealed page. */
  allowReplay?: boolean;
  replayLabel?: string;
  className?: string;
};

export type RevealPreset =
  | 'fade-up'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'rotate-in'
  | 'mask-up'
  | 'mask-left'
  | 'mask-right';

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  /** Optional editorial variation: portrait, landscape or wide. */
  shape?: 'portrait' | 'landscape' | 'wide' | 'square';
};

export type TimelineEntry = {
  title: string;
  body?: string;
  date?: string;
  image?: string;
  imageAlt?: string;
};

export type GiftChoice = {
  id: string;
  label: string;
  symbol?: string;
  title: string;
  body: ReactNode;
};

export type FAQItem = {
  question: string;
  answer: ReactNode;
};
