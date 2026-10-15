'use client';

import React, { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  Clock3,
  MapPin,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { TemplateDefinition } from '@/lib/templates/types';
import type { EventDesignEntity } from '@/lib/db/types';
import { WaxSeal } from '@/components/animation/WaxSeal';
import { ScrollParallax, RevealText } from '@/components/animation/MotionToolkit';
import { Logo } from '@/components/ui/Logo';

export type AnimationPhase =
  | 'closed'
  | 'seal-press'
  | 'seal-release'
  | 'flap-open'
  | 'card-rising'
  | 'settling'
  | 'settled';

export type EnvelopeMotionStyle =
  | 'classic-wax-seal'
  | 'floral-bloom'
  | 'confetti-burst'
  | 'minimal-fade'
  | 'gold-foil'
  | 'dignified-memorial';

export interface EnvelopeRendererProps {
  template: TemplateDefinition;
  guestName?: string;
  isDemo?: boolean;
  onPhaseChange?: (phase: AnimationPhase) => void;
  audioUrl?: string;
  initialPhase?: AnimationPhase;
  children?: React.ReactNode;
  /** Saved event design or optimistic editor preview overrides. */
  design?: Partial<EventDesignEntity>;
}

type ExperienceTheme =
  | 'savannah-twilight'
  | 'ruby-disco'
  | 'gift-box'
  | 'pastel-garden'
  | 'sage-love-letter'
  | 'memorial'
  | 'graduation'
  | 'housewarming'
  | 'corporate'
  | 'holiday-celebration'
  | 'modern-editorial';

export function getExperienceTheme(template: TemplateDefinition): ExperienceTheme {
  if (template.experienceTheme) return template.experienceTheme;
  if (template.category === 'memorial' || template.category === 'funeral') return 'memorial';
  if (template.category === 'birthday') return template.id === 'milestone-gold' ? 'ruby-disco' : 'gift-box';
  if (template.category === 'baby-shower' || template.category === 'welcome-baby' || template.id === 'sweet-beginnings') return 'pastel-garden';
  if (template.category === 'wedding' || template.category === 'engagement' || template.category === 'anniversary' || template.category === 'bridal-shower') return 'sage-love-letter';
  if (template.category === 'graduation') return 'graduation';
  if (template.category === 'housewarming') return 'housewarming';
  if (template.category === 'corporate' || template.category === 'product-launch' || template.category === 'fundraiser') return 'corporate';
  if (template.category === 'holiday') return 'holiday-celebration';
  return 'modern-editorial';
}

/**
 * Resolves the effective envelope motion choreography style.
 * Strict constraint: Funeral & memorial events MUST strictly map to dignified-memorial.
 */
export function resolveEnvelopeMotionStyle(
  template: TemplateDefinition,
  design?: Partial<EventDesignEntity>
): EnvelopeMotionStyle {
  // Memorial/funeral must strictly be dignified-memorial (never inherit celebratory motion)
  if (template.category === 'memorial' || template.category === 'funeral') {
    return 'dignified-memorial';
  }

  const rawPreset = (design?.motionPreset || template.motionPreset) as string;

  if (rawPreset === 'dignified-memorial' || rawPreset === 'funeral-service') {
    return 'dignified-memorial';
  }
  if (rawPreset === 'floral-bloom' || rawPreset === 'floral-romance' || rawPreset === 'baby-shower') {
    return 'floral-bloom';
  }
  if (rawPreset === 'confetti-burst' || rawPreset === 'birthday-playful' || template.id === 'milestone-gold') {
    return 'confetti-burst';
  }
  if (rawPreset === 'minimal-fade' || rawPreset === 'corporate-minimal' || rawPreset === 'corporate') {
    return 'minimal-fade';
  }
  if (rawPreset === 'gold-foil' || rawPreset === 'cultural-celebration' || rawPreset === 'cinematic') {
    return 'gold-foil';
  }
  if (rawPreset === 'classic-wax-seal' || rawPreset === 'classic-stationery') {
    return 'classic-wax-seal';
  }

  // Category fallbacks
  switch (template.category) {
    case 'birthday':
      return 'confetti-burst';
    case 'baby-shower':
    case 'welcome-baby':
    case 'bridal-shower':
      return 'floral-bloom';
    case 'corporate':
    case 'product-launch':
      return 'minimal-fade';
    case 'fundraiser':
    case 'cultural-celebration':
      return 'gold-foil';
    default:
      return 'classic-wax-seal';
  }
}

const LINER_BACKGROUNDS: Record<string, string> = {
  floral: 'linear-gradient(135deg, #fff5f0, #dfb4b6)',
  botanical: 'linear-gradient(135deg, #f1f2e8, #b9c8ae)',
  geometric: 'repeating-linear-gradient(45deg, #f0e9d9 0 8px, #d6c9ae 8px 10px)',
  'gold-foil': 'linear-gradient(135deg, #fff8e8, #d3b879)',
  minimal: '#f4f1e8',
  terracotta: 'linear-gradient(135deg, #f1c8ad, #b96e51)',
  'african-print': 'repeating-linear-gradient(45deg, #e6c15c 0 7px, #254b42 7px 14px, #a64b37 14px 21px, #f2e7cc 21px 28px)',
  'blush-floral': 'linear-gradient(135deg, #fff0f3, #e8b4b8)',
  none: '#f4f1e8',
};

function getRenderStyle(template: TemplateDefinition, design?: Partial<EventDesignEntity>): CSSProperties {
  const palette = { ...template.palette, ...(design?.palette || {}) };
  const linerId = design?.linerId || template.liner.id;
  const font = design?.fontFamily || (template.fonts.heading === 'sans' ? 'Inter' : template.fonts.heading === 'display' ? 'Cormorant Garamond' : 'Playfair Display');
  const linerPattern = linerId === 'floral' || linerId === 'blush-floral'
    ? 'radial-gradient(circle at 20% 25%, rgba(255,255,255,.7) 0 2px, transparent 3px), radial-gradient(circle at 70% 68%, rgba(165,75,88,.18) 0 4px, transparent 5px)'
    : linerId === 'geometric'
    ? 'repeating-linear-gradient(45deg, rgba(50,50,42,.16) 0 1px, transparent 1px 10px)'
    : linerId === 'gold-foil'
    ? 'linear-gradient(135deg, rgba(255,255,255,.35), transparent 55%)'
    : linerId === 'african-print'
    ? 'repeating-linear-gradient(45deg, #e6c15c 0 7px, #254b42 7px 14px, #a64b37 14px 21px, #f2e7cc 21px 28px)'
    : linerId === 'botanical'
    ? 'radial-gradient(ellipse at 20% 25%, rgba(62,91,67,.16), transparent 34%), radial-gradient(ellipse at 75% 75%, rgba(62,91,67,.12), transparent 30%)'
    : 'none';

  const envelopeColor = palette.envelope || template.palette.envelope;
  const flapColor = palette.flap || template.palette.flap;
  const secondary = palette.secondary || template.palette.secondary;

  return {
    '--iv-ink': palette.text || template.palette.text,
    '--iv-paper': palette.cardBackground || template.palette.cardBackground,
    '--iv-accent': palette.primary || template.palette.primary,
    '--iv-gold': secondary,
    '--iv-liner': LINER_BACKGROUNDS[linerId] || LINER_BACKGROUNDS.minimal,
    '--iv-liner-pattern': linerPattern,
    '--iv-envelope-color': envelopeColor,
    '--iv-flap-color': flapColor,
    '--iv-seal-color': design?.sealColor || template.seal.color,
    '--iv-seal-ink': template.palette.sealIconColor || '#f3e5c8',
    '--iv-card-line': `${secondary}66`,
    '--iv-font-heading': `"${font}", var(--font-playfair), Georgia, serif`,
    '--iv-envelope-grad-left': `linear-gradient(120deg, color-mix(in srgb, ${envelopeColor} 72%, white), ${envelopeColor} 78%)`,
    '--iv-envelope-grad-right': `linear-gradient(240deg, color-mix(in srgb, ${envelopeColor} 85%, white), ${envelopeColor} 78%)`,
    '--iv-envelope-grad-bottom': `linear-gradient(0deg, color-mix(in srgb, ${envelopeColor} 76%, black), ${envelopeColor})`,
  } as CSSProperties;
}

function BotanicalCorner({ side = 'left' }: { side?: 'left' | 'right' }) {
  return (
    <svg className={`iv-botanical iv-botanical--${side}`} viewBox="0 0 180 230" fill="none" aria-hidden="true">
      <path d="M12 218 C42 174 45 120 93 80 C122 55 145 35 160 10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M42 173 C12 163 8 139 13 122 C34 125 48 143 42 173Z" fill="currentColor" fillOpacity=".28" stroke="currentColor" strokeWidth="1" />
      <path d="M60 140 C85 145 103 129 103 108 C80 108 63 120 60 140Z" fill="currentColor" fillOpacity=".22" stroke="currentColor" strokeWidth="1" />
      <path d="M86 98 C55 92 48 70 57 51 C79 59 90 78 86 98Z" fill="currentColor" fillOpacity=".25" stroke="currentColor" strokeWidth="1" />
      <path d="M107 69 C130 77 152 65 157 45 C134 38 115 49 107 69Z" fill="currentColor" fillOpacity=".22" stroke="currentColor" strokeWidth="1" />
      <path d="M28 196 C54 198 69 181 67 162 C45 166 31 179 28 196Z" fill="currentColor" fillOpacity=".22" stroke="currentColor" strokeWidth="1" />
      <circle cx="155" cy="24" r="8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="155" cy="24" r="3" fill="currentColor" />
    </svg>
  );
}

function StarField() {
  return (
    <div className="iv-star-field" aria-hidden="true">
      <span className="iv-star iv-star--one">✦</span>
      <span className="iv-star iv-star--two">✧</span>
      <span className="iv-star iv-star--three">✦</span>
      <span className="iv-star iv-star--four">✧</span>
      <span className="iv-disco-ball iv-disco-ball--one" />
      <span className="iv-disco-ball iv-disco-ball--two" />
    </div>
  );
}

function ConfettiParticles() {
  const pieces = [
    { color: '#e6c15c', left: '18%', top: '25%', delay: '0s', dur: '1.4s', rot: '45deg', size: '7px' },
    { color: '#cf4a58', left: '28%', top: '20%', delay: '0.1s', dur: '1.6s', rot: '-30deg', size: '9px' },
    { color: '#f7d794', left: '38%', top: '22%', delay: '0.05s', dur: '1.5s', rot: '60deg', size: '6px' },
    { color: '#a62b3a', left: '48%', top: '18%', delay: '0.15s', dur: '1.7s', rot: '-45deg', size: '8px' },
    { color: '#e6c15c', left: '58%', top: '20%', delay: '0.08s', dur: '1.4s', rot: '90deg', size: '7px' },
    { color: '#cf4a58', left: '68%', top: '24%', delay: '0.2s', dur: '1.8s', rot: '-15deg', size: '9px' },
    { color: '#ffd32a', left: '78%', top: '22%', delay: '0.25s', dur: '1.5s', rot: '30deg', size: '6px' },
    { color: '#ff5e57', left: '86%', top: '26%', delay: '0.12s', dur: '1.6s', rot: '-60deg', size: '8px' },
    { color: '#e6c15c', left: '32%', top: '35%', delay: '0.18s', dur: '1.4s', rot: '75deg', size: '7px' },
    { color: '#a62b3a', left: '44%', top: '32%', delay: '0.22s', dur: '1.7s', rot: '-20deg', size: '8px' },
    { color: '#f7d794', left: '60%', top: '34%', delay: '0.3s', dur: '1.5s', rot: '40deg', size: '6px' },
    { color: '#ff3f34', left: '72%', top: '30%', delay: '0.1s', dur: '1.6s', rot: '-50deg', size: '9px' },
  ];
  return (
    <div className="iv-confetti-stage" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="iv-confetti-piece"
          style={{
            backgroundColor: p.color,
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.dur,
            transform: `rotate(${p.rot})`,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

function DecorativeRecord({ playing }: { playing: boolean }) {
  return (
    <div className={`iv-record ${playing ? 'is-playing' : ''}`} aria-hidden="true">
      <div className="iv-record__grooves" />
      <div className="iv-record__label"><span>kadi</span></div>
      <span className="iv-record__hole" />
    </div>
  );
}

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

export function EnvelopeRenderer({
  template,
  guestName,
  isDemo = false,
  onPhaseChange,
  audioUrl,
  initialPhase,
  children,
  design,
}: EnvelopeRendererProps) {
  const theme = getExperienceTheme(template);
  const motionStyle = resolveEnvelopeMotionStyle(template, design);
  const renderStyle = getRenderStyle(template, design);
  const envelopeStyle = design?.envelopeStyle || 'classic-fold';
  const letterStyle = design?.letterStyle || 'printed-letter';
  const linerStyle = design?.linerId || template.liner.id;
  const sealShape = design?.sealShape || template.seal.shape;
  const sealMonogram = design?.sealMonogram || template.seal.monogram || 'K';
  const [phase, setPhase] = useState<AnimationPhase>(initialPhase || 'closed');
  const [activeGift, setActiveGift] = useState<'note' | 'flowers' | 'cake'>('note');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRefs = useRef<number[]>([]);
  const reducedMotion = useReducedMotionPreference();
  const data = template.sampleData;
  const isBirthday = template.category === 'birthday';
  const birthdayNumber = data.milestoneAge?.toString() || data.title.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/)?.[1] || '50';

  const changePhase = useCallback((next: AnimationPhase) => {
    setPhase(next);
    onPhaseChange?.(next);
  }, [onPhaseChange]);

  // Reduced motion: immediately jump to settled, bypassing animation
  useEffect(() => {
    if (reducedMotion) {
      changePhase('settled');
    }
  }, [reducedMotion, changePhase]);

  // Cleanup: clear all pending timers on unmount to prevent leaks
  useEffect(() => {
    return () => {
      timerRefs.current.forEach(window.clearTimeout);
      timerRefs.current = [];
    };
  }, []);

  // Audio setup: strictly no autoplay
  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.preload = 'none';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [audioUrl]);

  /**
   * Choreographed 6-Beat Opening Sequence:
   * Beat A (0ms): Seal press & envelope slight deflection
   * Beat B (320ms): Seal release & unlock
   * Beat C (570ms): 3D hinged flap swing open (-178deg)
   * Beat D & E (1120ms): Staggered paper inserts + tall card rise with photo & details
   * Beat F (1920ms): Settling expansion
   * Settled (2650ms): Full editorial invitation active
   */
  const openEnvelope = useCallback(() => {
    if (phase !== 'closed') return;
    if (reducedMotion) {
      changePhase('settled');
      return;
    }

    timerRefs.current.forEach(window.clearTimeout);
    timerRefs.current = [];

    // Beat A — Seal press
    changePhase('seal-press');

    // Beat B — Break / release
    timerRefs.current.push(
      window.setTimeout(() => {
        changePhase('seal-release');
      }, 320)
    );

    // Beat C — Hinged flap opens backwards 180deg
    timerRefs.current.push(
      window.setTimeout(() => {
        changePhase('flap-open');
      }, 570)
    );

    // Beat D & E — Inserts move and tall hero card rises
    timerRefs.current.push(
      window.setTimeout(() => {
        changePhase('card-rising');
      }, 1120)
    );

    // Beat F — Settling expansion
    timerRefs.current.push(
      window.setTimeout(() => {
        changePhase('settling');
      }, 1920)
    );

    // Settled — Full invitation page active
    timerRefs.current.push(
      window.setTimeout(() => {
        changePhase('settled');
      }, 2650)
    );
  }, [phase, reducedMotion, changePhase]);

  const skipToDetails = useCallback(() => {
    timerRefs.current.forEach(window.clearTimeout);
    timerRefs.current = [];
    changePhase('settled');
  }, [changePhase]);

  const replay = useCallback(() => {
    timerRefs.current.forEach(window.clearTimeout);
    timerRefs.current = [];
    if (audioRef.current && musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    }
    changePhase('closed');
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [musicPlaying, changePhase, reducedMotion]);

  // Keyboard shortcut: Escape cancels intro and skips immediately to details
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'closed' && phase !== 'settled') {
        skipToDetails();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, skipToDetails]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
      return;
    }
    try {
      await audio.play();
      setMusicPlaying(true);
    } catch {
      setMusicPlaying(false);
    }
  };

  const shareInvitation = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) await navigator.share({ title: data.title, text: `You're invited to ${data.title}`, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Sharing cancellation should not interrupt the invitation.
    }
  };

  const galleryPhotos = (data.galleryImages?.length ? data.galleryImages : [data.heroImage]).filter(Boolean);

  return (
    <div
      className={`iv-world iv-world--${theme} ${phase === 'settled' ? 'iv-world--revealed' : ''}`}
      data-template={template.id}
      data-category={template.category}
      data-envelope-style={envelopeStyle}
      data-letter-style={letterStyle}
      data-liner-style={linerStyle}
      data-seal-shape={sealShape}
      data-motion-preset={motionStyle}
      data-custom-design={design ? 'true' : 'false'}
      style={renderStyle}
    >
      {/* Visual Ambiance depending on motionStyle / theme */}
      {motionStyle === 'confetti-burst' && <StarField />}
      {motionStyle === 'confetti-burst' && (phase === 'seal-release' || phase === 'card-rising' || phase === 'settling') && (
        <ConfettiParticles />
      )}
      {motionStyle === 'floral-bloom' && (
        <>
          <BotanicalCorner side="left" />
          <BotanicalCorner side="right" />
        </>
      )}
      {motionStyle === 'dignified-memorial' && (
        <div className="iv-tabletop-scene" aria-hidden="true">
          <span className="iv-candle-glow" />
          <div className="iv-candle-flame">
            <span className="iv-flame-core" />
            <span className="iv-flame-glow" />
          </div>
        </div>
      )}
      {motionStyle === 'classic-wax-seal' && (theme === 'savannah-twilight' || theme === 'sage-love-letter') && (
        <div className="iv-tabletop-scene" aria-hidden="true">
          <span className="iv-candle-glow" />
          <div className="iv-candle-flame">
            <span className="iv-flame-core" />
            <span className="iv-flame-glow" />
          </div>
          <div className="iv-tabletop-petals">
            <svg className="iv-petal iv-petal--1" viewBox="0 0 36 36">
              <path d="M 6 30 C 2 16 14 4 30 6 C 34 20 22 34 6 30 Z" fill="#6A141D" />
              <path d="M 10 26 C 8 16 16 8 26 10 C 28 18 20 28 10 26 Z" fill="#8C1B26" opacity="0.65" />
            </svg>
            <svg className="iv-petal iv-petal--2" viewBox="0 0 36 36">
              <path d="M 4 10 C 16 2 32 12 30 28 C 16 34 2 22 4 10 Z" fill="#520E15" />
              <path d="M 8 12 C 16 6 26 14 24 24 C 14 28 6 20 8 12 Z" fill="#75151F" opacity="0.65" />
            </svg>
            <svg className="iv-petal iv-petal--3" viewBox="0 0 36 36">
              <path d="M 8 28 C 3 13 18 3 33 8 C 33 23 23 33 8 28 Z" fill="#781722" />
            </svg>
            <svg className="iv-petal iv-petal--4" viewBox="0 0 36 36">
              <path d="M 10 6 C 24 4 32 18 26 30 C 12 32 4 18 10 6 Z" fill="#5A0F17" />
            </svg>
            <svg className="iv-petal iv-petal--5" viewBox="0 0 36 36">
              <path d="M 6 30 C 2 16 14 4 30 6 C 34 20 22 34 6 30 Z" fill="#721420" />
            </svg>
            <svg className="iv-petal iv-petal--6" viewBox="0 0 36 36">
              <path d="M 4 12 C 16 4 30 14 28 28 C 14 32 2 22 4 12 Z" fill="#460A11" />
            </svg>
          </div>
        </div>
      )}

      {/* Control Rail: Brand mark + quiet controls */}
      <div className="iv-control-rail">
        <Logo size="sm" color="#c4a16a" />
        <div className="iv-control-actions">
          {audioUrl && theme !== 'gift-box' && (
            <button
              className="iv-icon-control"
              onClick={toggleMusic}
              aria-label={musicPlaying ? 'Pause invitation music' : 'Play invitation music'}
              title={musicPlaying ? 'Pause music' : 'Play music'}
            >
              {musicPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{musicPlaying ? 'Music on' : 'Music off'}</span>
            </button>
          )}
          {phase === 'settled' ? (
            <button className="iv-text-control" onClick={replay} aria-label="Replay invitation opening">
              <RotateCcw size={13} /> Replay opening
            </button>
          ) : phase !== 'closed' ? (
            <button className="iv-text-control" onClick={skipToDetails} aria-label="Skip envelope animation">
              Skip intro <ChevronRight size={13} />
            </button>
          ) : null}
        </div>
      </div>

      {phase !== 'settled' ? (
        <section
          className={`iv-opening-stage ${phase !== 'closed' ? 'is-opening' : ''} ${
            phase === 'card-rising' || phase === 'settling' ? 'card-rising' : ''
          }`}
          aria-label="Open your sealed invitation"
        >
          {/* Eyebrow & Title: Compact and responsive on short phones */}
          <div className="iv-opening-copy">
            <p className="iv-eyebrow">
              {motionStyle === 'dignified-memorial'
                ? 'A gathering in remembrance'
                : motionStyle === 'confetti-burst'
                ? 'A celebration awaits'
                : motionStyle === 'floral-bloom'
                ? 'A celebration of love'
                : motionStyle === 'minimal-fade'
                ? 'You are cordially invited'
                : motionStyle === 'gold-foil'
                ? 'A regal occasion'
                : isBirthday
                ? 'Something special for you'
                : 'A note from the heart'}
            </p>
            <h1 className="iv-opening-title">
              {motionStyle === 'dignified-memorial'
                ? 'Remembering, together.'
                : motionStyle === 'confetti-burst'
                ? 'Tonight has your name on it.'
                : motionStyle === 'floral-bloom'
                ? 'A moment, beautifully told.'
                : motionStyle === 'minimal-fade'
                ? 'An occasion worth gathering for.'
                : motionStyle === 'gold-foil'
                ? 'For you, with honour.'
                : theme === 'gift-box'
                ? 'These are for you.'
                : 'A moment, sealed with love.'}
            </h1>
          </div>

          {/* 3D Physical Stationery Assembly */}
          <motion.button
            className="iv-envelope-hitarea"
            style={renderStyle}
            type="button"
            onClick={openEnvelope}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') openEnvelope();
            }}
            aria-label="Open your invitation envelope"
            disabled={phase !== 'closed'}
            animate={
              phase === 'seal-press'
                ? { y: 3, scale: 0.99 }
                : phase === 'seal-release'
                ? { y: -1, scale: 1 }
                : { y: 0, scale: 1 }
            }
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {/* Layer 0: Victorian Shadow Paper Underlay */}
            <span className="iv-shadow-paper" aria-hidden="true" />

            {/* Layer 1 & 9: Contact Shadows */}
            <span className="iv-envelope-shadow" />
            <span className="iv-envelope-contact-shadow" />

            {/* Envelope 3D Body */}
            <span className="iv-envelope">
              {/* Layer 2: Back Substrate with Gold Double Rule */}
              <span className="iv-envelope-back" style={renderStyle}>
                <span className="iv-envelope-back-border" />
              </span>

              {/* Layer 3: Inside Throat Liner Pattern with Fleurons & Gold Rule */}
              <span className="iv-envelope-liner" style={renderStyle}>
                <span className="iv-liner-ornament">
                  <span>❦</span>
                  <i className="iv-liner-rule" />
                  <span>❦</span>
                </span>
              </span>

              {/* Layer 3.5: Deep Pocket Cavity Throat Shadow behind card */}
              <span className="iv-envelope-throat-shadow" />

              {/* Layer 4: Staggered Stationery Inserts (Beat D) */}
              <motion.span
                className="iv-insert-paper iv-insert-paper--back"
                animate={
                  phase === 'card-rising' || phase === 'settling'
                    ? { y: -48, x: 26, rotate: 5.5, opacity: 1 }
                    : phase === 'flap-open'
                    ? { y: -16, x: 10, rotate: 2, opacity: 0.85 }
                    : { y: 0, x: 0, rotate: 0, opacity: 0 }
                }
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="iv-insert-header">✦ R . S . V . P . ✦</span>
                <span className="iv-insert-rule" />
                <span className="iv-insert-sub">Kindly respond</span>
              </motion.span>

              <motion.span
                className="iv-insert-paper iv-insert-paper--front"
                animate={
                  phase === 'card-rising' || phase === 'settling'
                    ? { y: -42, x: -26, rotate: -4.5, opacity: 1 }
                    : phase === 'flap-open'
                    ? { y: -14, x: -10, rotate: -1.5, opacity: 0.85 }
                    : { y: 0, x: 0, rotate: 0, opacity: 0 }
                }
                transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="iv-insert-header">✦ D E T A I L S ✦</span>
                <span className="iv-insert-rule" />
                <span className="iv-insert-sub">Information for guests</span>
              </motion.span>

              {/* Layer 5: Hero Formal Stationery Letter ("THE LETTER" in Reference Target) */}
              <motion.span
                className="iv-card-preview"
                style={renderStyle}
                animate={
                  phase === 'closed' || phase === 'seal-press'
                    ? { y: 28, z: 10, rotate: 0, scale: 0.96, opacity: 0 }
                    : phase === 'flap-open'
                    ? { y: 4, z: 14, rotate: 0, scale: 0.98, opacity: 1 }
                    : phase === 'card-rising'
                    ? { y: -136, z: 22, rotate: -0.5, scale: 1.03, opacity: 1 }
                    : phase === 'settling'
                    ? { y: -140, z: 26, rotate: 0, scale: 1.04, opacity: 1 }
                    : { y: 0, z: 16, rotate: 0, scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Inner Border Frame with Ornate Corner Scroll Brackets */}
                <span className="iv-letter-inner-border">
                  <span className="iv-letter-corner iv-letter-corner--tl" />
                  <span className="iv-letter-corner iv-letter-corner--tr" />
                  <span className="iv-letter-corner iv-letter-corner--bl" />
                  <span className="iv-letter-corner iv-letter-corner--br" />

                  {/* Top Royal Monogram Crest inside Laurel Wreath */}
                  <div className="iv-letter-crest">
                    <span className="iv-crest-laurel iv-crest-laurel--left">❧</span>
                    <span className="iv-crest-monogram">
                      {sealMonogram === 'K&W' ? 'W&O' : sealMonogram}
                    </span>
                    <span className="iv-crest-laurel iv-crest-laurel--right">❧</span>
                  </div>

                  {/* Host Line */}
                  <span className="iv-letter-hosts">
                    {data.hosts || (
                      template.category === 'memorial' || template.category === 'funeral'
                        ? 'IN LOVING MEMORY'
                        : isBirthday
                        ? 'A SPECIAL CELEBRATION'
                        : template.category === 'graduation'
                        ? 'WITH PRIDE AND GRATITUDE'
                        : template.category === 'housewarming'
                        ? 'A NEW CHAPTER BEGINS'
                        : template.category === 'corporate' || template.category === 'product-launch'
                        ? 'CORDIOUSLY INVITING YOU'
                        : 'TOGETHER WITH THEIR FAMILIES'
                    )}
                  </span>

                  {/* Formal Request Line */}
                  <span className="iv-letter-request">
                    {template.category === 'wedding' || template.category === 'engagement'
                      ? 'joyfully invite'
                      : isBirthday
                      ? 'invite you to join in celebrating'
                      : template.category === 'memorial' || template.category === 'funeral'
                      ? 'invite you to gather in memory of'
                      : template.category === 'graduation'
                      ? 'invite you to celebrate the achievement of'
                      : template.category === 'housewarming'
                      ? 'invite you to celebrate the new home of'
                      : template.category === 'corporate' || template.category === 'product-launch'
                      ? 'request the pleasure of your company at'
                      : 'invite you to celebrate with'}
                  </span>

                  {/* Prominent Guest Name Line ("Mr. & Mrs. Kamau" in Reference Target) */}
                  <span className="iv-letter-guest-line">
                    {guestName || 'Mr. & Mrs. Kamau'}
                  </span>

                  <span className="iv-letter-joining">
                    {template.category === 'wedding'
                      ? 'to celebrate the wedding of'
                      : template.category === 'graduation'
                      ? 'in honour of this achievement'
                      : template.category === 'housewarming'
                      ? 'at their new home'
                      : template.category === 'memorial' || template.category === 'funeral'
                      ? 'in loving memory of'
                      : template.category === 'birthday'
                      ? 'for a special birthday'
                      : 'for this special gathering'}
                  </span>

                  {/* Prominent Editorial Names */}
                  <span className={`iv-letter-names ${template.category === 'wedding' ? 'iv-letter-names--script' : ''}`}>
                    {isBirthday
                      ? data.celebrants || data.title
                      : template.category === 'wedding'
                      ? (data.celebrants || data.title.replace(/^The Wedding of\s*/i, ''))
                      : data.celebrants || data.title}
                  </span>

                  {/* Milestone age badge for birthday */}
                  {isBirthday && (
                    <span className="iv-letter-badge">
                      Celebrating {birthdayNumber} Years
                    </span>
                  )}

                  {/* Gold Tapered Rule with Diamond Fleuron */}
                  <div className="iv-letter-divider">
                    <span className="iv-divider-diamond">✦ ─── ❦ ─── ✦</span>
                  </div>

                  {/* Date, Time & Venue with Icons */}
                  <div className="iv-letter-details-grid">
                    <div className="iv-letter-detail-item">
                      <CalendarDays size={11} className="text-amber-800/80" />
                      <span>{data.date}</span>
                    </div>
                    <div className="iv-letter-detail-item">
                      <Clock3 size={11} className="text-amber-800/80" />
                      <span>{data.time}</span>
                    </div>
                    <div className="iv-letter-detail-item">
                      <MapPin size={11} className="text-amber-800/80" />
                      <span>{data.venue}{data.city ? `, ${data.city}` : ''}</span>
                    </div>
                  </div>

                  {/* Bottom Flourish & RSVP */}
                  <div className="iv-letter-bottom-section">
                    <span className="iv-letter-bottom-flourish">❦</span>
                    <span className="iv-letter-rsvp-hint">R . S . V . P .</span>
                  </div>
                </span>
              </motion.span>

              {/* Layer 6: Front Mitred Pocket with Left, Right, Bottom Panels, Gold Rule & Fleuron */}
              <span className="iv-envelope-pocket" style={renderStyle}>
                <span className="iv-pocket-fold iv-pocket-fold--left" />
                <span className="iv-pocket-fold iv-pocket-fold--right" />
                <span className="iv-pocket-fold iv-pocket-fold--bottom" />
                <span className="iv-pocket-gold-rule" />
                <span className="iv-pocket-fleuron">❦</span>
                <span className="iv-pocket-crease-shadow" />
              </span>

              {/* Layer 7 & 8: Hinged Flap with 3D Rotation and Inner Liner Face */}
              <motion.span
                className="iv-envelope-flap-hinge"
                animate={
                  phase === 'flap-open' || phase === 'card-rising' || phase === 'settling'
                    ? { rotateX: -178 }
                    : { rotateX: 0 }
                }
                transition={{ duration: 0.62, ease: [0.25, 1, 0.5, 1] }}
              >
                {/* Outer Flap Face (Visible when closed with Antique Gold Filigree Lace Border) */}
                <span className="iv-envelope-flap-face iv-envelope-flap-face--outer">
                  <span className="iv-flap-outer-polygon">
                    <span className="iv-flap-gold-frame" />
                    {motionStyle !== 'minimal-fade' && (
                      <svg className="iv-flap-filigree-border" viewBox="0 0 500 320" fill="none" preserveAspectRatio="none">
                        <path d="M 14 10 L 250 274 L 486 10" stroke="#dab76f" strokeWidth="1.6" strokeOpacity="0.9" />
                        <path d="M 24 16 L 250 262 L 476 16" stroke="#f3e5c8" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 2" />
                        {/* Top corners baroque scrolls */}
                        <path d="M 16 26 C 28 16 42 20 52 32 C 45 38 36 36 30 29 C 24 40 38 50 54 46" stroke="#dab76f" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M 484 26 C 472 16 458 20 448 32 C 455 38 464 36 470 29 C 476 40 462 50 446 46" stroke="#dab76f" strokeWidth="1.2" strokeLinecap="round" />
                        {/* Flap Tip Gold Royal Fleur-de-lis above seal */}
                        <path d="M 238 238 C 244 222 250 212 250 202 C 250 212 256 222 262 238 C 256 242 252 248 250 258 C 248 248 244 242 238 238 Z" fill="#dab76f" />
                        <circle cx="250" cy="196" r="3" fill="#f3e5c8" />
                      </svg>
                    )}
                  </span>
                </span>

                {/* Inner Flap Face (Flips up and faces forward when opened) */}
                <span className="iv-envelope-flap-face iv-envelope-flap-face--inner">
                  <span className="iv-flap-inner-rim" />
                  <span className="iv-flap-inner-liner">
                    <span className="iv-liner-ornament">
                      <span>❦</span>
                      <i className="iv-liner-rule" />
                      <span>❦</span>
                    </span>
                  </span>
                </span>
              </motion.span>

              {/* Layer 9: Victorian Physical Wax Seal with Dangling Antique Gold Charm */}
              <span className="iv-seal-anchor" aria-hidden="true">
                <motion.span
                  className={`iv-victorian-seal ${motionStyle === 'minimal-fade' ? 'iv-victorian-seal--minimal' : ''}`}
                  style={renderStyle}
                  initial={phase === 'closed' ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                  animate={
                    phase === 'closed'
                      ? { scale: 1, y: 0, rotate: 0, opacity: 1 }
                      : phase === 'seal-press'
                      ? { scale: 0.86, y: 3, rotate: 0, opacity: 1 }
                      : phase === 'seal-release'
                      ? { scale: 1.14, y: -4, rotate: -6, opacity: 0.88 }
                      : { scale: 0.4, y: -16, rotate: 16, opacity: 0 }
                  }
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <span className="iv-wax-rim" aria-hidden="true" />
                  <span className="iv-wax-monogram">
                    {sealMonogram === 'K&W' ? 'W&O' : sealMonogram}
                  </span>
                  <span className="iv-wax-imprint" aria-hidden="true">❦</span>

                  {/* Silk Ribbon / Cord & Dangling Antique Gold Coin Medallion Charm (hidden for minimal) */}
                  {motionStyle !== 'minimal-fade' && (
                    <>
                      <span className="iv-seal-cord" aria-hidden="true" />
                      <span className="iv-seal-charm" aria-hidden="true">
                        <span className="iv-seal-charm-inner">❦</span>
                      </span>
                    </>
                  )}
                </motion.span>
              </span>
            </span>
          </motion.button>

          {/* Tap Prompt & Guest Greeting */}
          {phase === 'closed' ? (
            <>
              <div className="iv-open-instruction">
                <span className="iv-pulse-dot" />
                <span>Tap the seal to open</span>
              </div>
              {guestName && (
                <p className="iv-personalized">
                  Prepared especially for <strong>{guestName}</strong>
                </p>
              )}
              <p className="iv-tap-caption">An invitation is waiting inside.</p>
            </>
          ) : (
            <div className="iv-opening-status" aria-live="polite">
              <span>Opening your invitation...</span>
            </div>
          )}
        </section>
      ) : (
        /* Full Editorial Invitation Revealed Stage with Scroll Parallax & Content Sections */
        <motion.main
          className={`iv-invitation iv-invitation--${theme}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55 }}
        >
          {theme === 'savannah-twilight' && (
            <section className="iv-wedding-hero-cover">
              <div className="iv-wedding-hero-frame">
                <div className="iv-wedding-hero-photo-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.heroImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
                    alt={data.celebrants}
                    className="iv-wedding-hero-photo"
                  />
                  <div className="iv-wedding-hero-overlay" />
                </div>
                <div className="iv-wedding-hero-copy">
                  <span className="iv-wedding-hero-kicker">A CELEBRATION OF LOVE</span>
                  <h1 className="iv-wedding-hero-names">{data.celebrants}</h1>
                  <div className="iv-wedding-hero-divider">✦ ─── ❦ ─── ✦</div>
                  <p className="iv-wedding-hero-meta">
                    <span>{data.date}</span>
                    <span className="iv-bullet">·</span>
                    <span>{data.venue}{data.city ? `, ${data.city}` : ''}</span>
                  </p>
                  <a href="#ceremony" className="iv-wedding-hero-scroll">
                    <span>Scroll to explore</span>
                    <ChevronDown size={14} className="animate-bounce" />
                  </a>
                </div>
              </div>
            </section>
          )}

          {theme === 'ruby-disco' && (
            <>
              <section className="iv-disco-cover">
                <div className="iv-disco-cover__top">
                  <span>YOU ARE INVITED TO</span>
                  <span>AN UNFORGETTABLE NIGHT</span>
                </div>
                <div className="iv-disco-cover__copy">
                  <p className="iv-script">{data.subtitle || 'Let the good times roll'}</p>
                  <RevealText
                    text={data.title.replace(/\s*Celebration/i, '')}
                    tag="h1"
                    className="font-serif font-medium tracking-tight"
                  />
                  <div className="iv-birthday-number">{birthdayNumber}</div>
                  <p className="iv-cover-date">{data.date} <span>·</span> {data.time}</p>
                </div>
                <ScrollParallax offset={14}>
                  <div className="iv-cover-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.heroImage} alt={data.celebrants || data.title} />
                  </div>
                </ScrollParallax>
                <a href="#iv-event-details" className="iv-down-link">
                  The details <ChevronDown size={15} />
                </a>
              </section>

              <section className="iv-party-details" id="iv-event-details">
                <p className="iv-eyebrow">Meet us on the dance floor</p>
                <h2>Good people. <em>Good music.</em><br />A night to remember.</h2>
                <div className="iv-detail-row">
                  <span><CalendarDays size={16} /> When</span>
                  <strong>{data.date} · {data.time}</strong>
                </div>
                <div className="iv-detail-row">
                  <span><MapPin size={16} /> Where</span>
                  <strong>{data.venue}, {data.city}</strong>
                </div>
                <div className="iv-detail-row">
                  <span><Clock3 size={16} /> Dress code</span>
                  <strong>Come dressed to celebrate</strong>
                </div>
              </section>

              <section className="iv-house-rules">
                <div className="iv-house-rules__title">
                  <span>THE SMALL PRINT</span>
                  <h2>House rules, darling.</h2>
                </div>
                <ul>
                  <li>Bring your best energy.</li>
                  <li>Arrive ready to make a memory.</li>
                  <li>Let the host know if your plans change.</li>
                </ul>
                <DecorativeRecord playing={musicPlaying} />
              </section>
            </>
          )}

          {theme === 'pastel-garden' && (
            <>
              <section className="iv-garden-cover">
                <div className="iv-garden-frame">
                  <p className="iv-eyebrow">You are invited to</p>
                  <p className="iv-script">{data.subtitle || 'A day full of little joys'}</p>
                  <h1>{data.celebrants}</h1>
                  <div className="iv-garden-illustration" aria-hidden="true">
                    <span className="iv-gazebo-roof" />
                    <span className="iv-gazebo-dome" />
                    <span className="iv-gazebo-posts" />
                    <span className="iv-gazebo-base" />
                    <span className="iv-garden-butterfly">✧</span>
                  </div>
                  <p className="iv-garden-event-type">{data.title}</p>
                  <div className="iv-garden-meta">
                    <span>{data.date}</span><i /> <span>{data.time}</span>
                  </div>
                </div>
                <p className="iv-garden-caption">A lovely day is made lovelier by you.</p>
              </section>

              <section className="iv-garden-green">
                <p className="iv-eyebrow">Save the date</p>
                <h2>We saved you<br /><em>a little place.</em></h2>
                <div className="iv-garden-venue">
                  <MapPin size={16} />
                  <div>
                    <strong>{data.venue}</strong>
                    <span>{data.city}</span>
                  </div>
                </div>
                <div className="iv-garden-date">
                  <span className="iv-garden-date__day">
                    {data.date.split(' ')[1]?.replace(',', '') || '19'}
                  </span>
                  <span>{data.date}</span>
                </div>
                <a href="#rsvp-section" className="iv-garden-rsvp">
                  Kindly reply <ChevronDown size={14} />
                </a>
              </section>
            </>
          )}

          {theme === 'gift-box' && (
            <>
              <section className="iv-gifts-cover">
                <p className="iv-eyebrow">A little something made for you</p>
                <p className="iv-script">These are for you</p>
                <ScrollParallax offset={12}>
                  <div className="iv-gifts-hero">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.heroImage} alt={data.celebrants || data.title} />
                    <span className="iv-photo-tape" />
                  </div>
                </ScrollParallax>
                <h1>{data.title}</h1>
                <p>{data.date} · {data.time}</p>
              </section>

              <section className="iv-gift-interactive">
                <p className="iv-eyebrow">Open a little something</p>
                <h2>Pick your <em>surprise.</em></h2>
                <div className="iv-gift-options" role="group" aria-label="Choose a birthday surprise">
                  <button
                    type="button"
                    className={activeGift === 'note' ? 'is-active' : ''}
                    onClick={() => setActiveGift('note')}
                  >
                    <span className="iv-gift-art iv-gift-art--letter">A</span>
                    <span>A note</span>
                  </button>
                  <button
                    type="button"
                    className={activeGift === 'flowers' ? 'is-active' : ''}
                    onClick={() => setActiveGift('flowers')}
                  >
                    <span className="iv-gift-art iv-gift-art--flowers"><i /><i /><i /><i /><b /></span>
                    <span>Flowers</span>
                  </button>
                  <button
                    type="button"
                    className={activeGift === 'cake' ? 'is-active' : ''}
                    onClick={() => setActiveGift('cake')}
                  >
                    <span className="iv-gift-art iv-gift-art--cake"><i /><b /></span>
                    <span>Something sweet</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    className="iv-gift-message"
                    key={activeGift}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28 }}
                  >
                    {activeGift === 'note' ? (
                      <>
                        <span className="iv-gift-message__ornament">To you, with love</span>
                        <p>
                          Here&apos;s to another year of moments worth keeping, people worth holding close, and a little more magic than you expected.
                        </p>
                      </>
                    ) : activeGift === 'flowers' ? (
                      <>
                        <span className="iv-gift-message__ornament">Flowers for your day</span>
                        <p>
                          May the year ahead bloom with joy, bright surprises and new things to love.
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="iv-gift-message__ornament">Save a little room</span>
                        <p>
                          There will be cake, laughter and people who are very happy you were born.
                        </p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </section>

              <section className="iv-memory-collage">
                <div className="iv-collage-heading">
                  <p className="iv-eyebrow">Little things, big memories</p>
                  <h2>Life looks better <em>together.</em></h2>
                </div>
                <div className="iv-collage-grid">
                  {galleryPhotos.map((photo, index) => (
                    <button
                      key={`${photo}-${index}`}
                      type="button"
                      className={`iv-collage-photo iv-collage-photo--${index + 1}`}
                      onClick={() => setGalleryIndex(index)}
                      aria-label={`Open photograph ${index + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`${data.celebrants || 'Celebration'} memory ${index + 1}`}
                        loading="lazy"
                      />
                      <span>{['The good days', 'All our people', 'The little moments', 'More to come'][index]}</span>
                    </button>
                  ))}
                </div>
                <div className="iv-record-dock">
                  <DecorativeRecord playing={musicPlaying} />
                  <p>
                    {audioUrl
                      ? musicPlaying
                        ? 'Now playing'
                        : 'A little music, if you like'
                      : 'A soundtrack for the memory'}
                  </p>
                  {audioUrl && (
                    <button type="button" onClick={toggleMusic}>
                      {musicPlaying ? 'Pause music' : 'Play music'} <CirclePlay size={15} />
                    </button>
                  )}
                </div>
              </section>
            </>
          )}

          {theme === 'sage-love-letter' && (
            <>
              <section className="iv-love-cover">
                <p className="iv-eyebrow">Together with their families</p>
                <h1>{data.celebrants}</h1>
                <p className="iv-script">invite you to celebrate</p>
                <ScrollParallax offset={15}>
                  <div className="iv-love-cover__photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.heroImage} alt={data.celebrants} />
                    <span className="iv-photo-caption">
                      A day for the two of us, shared with all of you.
                    </span>
                  </div>
                </ScrollParallax>
                <div className="iv-love-date">
                  <span>{data.date}</span><i /><span>{data.time}</span>
                </div>
                <p className="iv-love-quote">
                  “{data.story || 'The best things in life become even more beautiful when they are shared.'}”
                </p>
                <a href="#iv-love-details" className="iv-outline-link">
                  Explore the invitation <ChevronDown size={14} />
                </a>
              </section>

              <section className="iv-love-details" id="iv-love-details">
                <div className="iv-love-details__copy">
                  <p className="iv-eyebrow">The day we have been dreaming of</p>
                  <h2>We would be honoured<br /><em>to have you there.</em></h2>
                  <p>
                    Save the date and join us as we begin this next chapter surrounded by the people who made our story what it is.
                  </p>
                </div>
                <div className="iv-love-location">
                  <span className="iv-location-icon"><MapPin size={19} /></span>
                  <p className="iv-eyebrow">The place</p>
                  <h3>{data.venue}</h3>
                  <p>{data.city}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.venue}, ${data.city}`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open map <ChevronRight size={14} />
                  </a>
                </div>
              </section>

              <section className="iv-love-gallery">
                <div className="iv-love-gallery__heading">
                  <p className="iv-eyebrow">A few favourite frames</p>
                  <h2>Our story, <em>in pictures.</em></h2>
                </div>
                <div className="iv-love-gallery__grid">
                  {galleryPhotos.slice(0, 3).map((photo, index) => (
                    <figure key={`${photo}-${index}`} className={`iv-love-photo iv-love-photo--${index + 1}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`Photograph ${index + 1} for ${data.celebrants}`}
                        loading="lazy"
                      />
                      <figcaption>
                        {['The beginning', 'The in-between', 'The next chapter'][index]}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            </>
          )}

          {theme === 'memorial' && (
            <section className="iv-memorial-cover">
              <p className="iv-eyebrow">In loving memory</p>
              <ScrollParallax offset={10}>
                <div className="iv-memorial-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.heroImage} alt={data.celebrants} />
                </div>
              </ScrollParallax>
              <h1>{data.celebrants}</h1>
              <p className="iv-memorial-subtitle">{data.subtitle}</p>
              <p className="iv-memorial-note">
                {data.story || 'We gather to remember a life, honour a legacy and hold one another close.'}
              </p>
              <div className="iv-memorial-date">{data.date} · {data.time}</div>
            </section>
          )}

          {(theme === 'graduation' || theme === 'housewarming' || theme === 'corporate' || theme === 'holiday-celebration' || theme === 'modern-editorial') && (
            <section className={`iv-occasion-cover iv-occasion-cover--${theme}`}>
              <div className="iv-occasion-cover__frame">
                <div className="iv-occasion-cover__copy">
                  <p className="iv-eyebrow">
                    {template.category === 'graduation'
                      ? 'A proud new chapter'
                      : template.category === 'housewarming'
                      ? 'A new place to call home'
                      : template.category === 'holiday'
                      ? 'Together is the best tradition'
                      : template.category === 'corporate' || template.category === 'product-launch'
                      ? 'An invitation to connect'
                      : 'Mark the moment'}
                  </p>
                  <h1>{data.title}</h1>
                  <p className="iv-occasion-cover__names">{data.celebrants || data.hosts}</p>
                  <div className="iv-occasion-cover__meta">
                    <span>{data.date}</span>
                    <span className="iv-bullet">·</span>
                    <span>{data.time}</span>
                    <span className="iv-bullet">·</span>
                    <span>{data.venue}{data.city ? `, ${data.city}` : ''}</span>
                  </div>
                  <a href="#iv-content-start" className="iv-occasion-cover__link">
                    <span>Explore event details</span>
                    <ChevronDown size={14} className="animate-bounce" />
                  </a>
                </div>
                <div className="iv-occasion-cover__image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.heroImage} alt={`${data.title} invitation`} loading="lazy" />
                </div>
              </div>
            </section>
          )}

          {/* Content sections passed down from page */}
          <div id="iv-content-start" className="iv-content-sections">{children}</div>

          {/* Ending / Footer */}
          <footer className="iv-ending">
            <Logo size="sm" color="#c4a16a" />
            <p>
              {theme === 'memorial'
                ? 'Held in memory. Held together.'
                : 'Made with care, shared with love.'}
            </p>
            <button type="button" onClick={shareInvitation} aria-label="Share this invitation link">
              {copied ? <Check size={14} /> : null}
              {copied ? 'Link copied' : 'Share this invitation'}
            </button>
            <button
              type="button"
              className="iv-ending__back"
              onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
              aria-label="Scroll back to top of invitation"
            >
              Back to the beginning ↑
            </button>
          </footer>

          {/* Fullscreen Photo Lightbox modal */}
          {(theme === 'gift-box' || theme === 'sage-love-letter') && galleryIndex !== null && (
            <div
              className="iv-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Photo viewer"
              onClick={() => setGalleryIndex(null)}
            >
              <button type="button" onClick={() => setGalleryIndex(null)} aria-label="Close photo">
                ×
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galleryPhotos[galleryIndex]}
                alt={`${data.celebrants} memory ${galleryIndex + 1}`}
                onClick={(event) => event.stopPropagation()}
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setGalleryIndex((current) =>
                    current === null ? 0 : (current + 1) % galleryPhotos.length
                  );
                }}
                aria-label="Next photo"
              >
                Next →
              </button>
            </div>
          )}
        </motion.main>
      )}

      {phase !== 'settled' && (
        <div className="iv-opening-footer">
          <span>DESIGNED TO BE OPENED</span>
          <span>{isDemo ? 'LIVE PREVIEW' : 'A KADI INVITATION'}</span>
        </div>
      )}
    </div>
  );
}

export default EnvelopeRenderer;
