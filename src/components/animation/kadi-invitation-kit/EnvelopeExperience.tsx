'use client';

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ENVELOPE_THEMES } from './themes';
import type { EnvelopeExperienceProps, OpeningPhase } from './types';
import { breakWaxSeal, handoffToInvitation, openHingedFlap, pressWaxSeal, raiseInvitationCard, raisePaperInserts, revealEnvelopeLiner, resetPhysicalOpening, skipPhysicalOpening, unfoldInvitationCard } from './motion/physicalBeats';
import './envelope.css';

function Ornament({ kind = 'flourish' }: { kind?: 'flourish' | 'stars' | 'leaf' }) {
  if (kind === 'stars') {
    return <span className="ke-ornament ke-ornament--stars" aria-hidden="true">✦ · ✧ · ✦</span>;
  }
  if (kind === 'leaf') {
    return <span className="ke-ornament ke-ornament--leaf" aria-hidden="true">❧</span>;
  }
  return <span className="ke-ornament" aria-hidden="true">❦</span>;
}

function PhaseLabel({ phase }: { phase: OpeningPhase }) {
  const labels: Partial<Record<OpeningPhase, string>> = {
    'seal-press': 'A little anticipation…',
    'seal-break': 'Breaking the seal…',
    'flap-open': 'Opening your letter…',
    'liner-reveal': 'A secret inside…',
    'inserts-rise': 'A note for you…',
    'letter-rise': 'Unfolding the invitation…',
    'letter-unfold': 'Just for you',
    handoff: 'Your invitation awaits',
  };
  return <span aria-live="polite">{labels[phase] ?? 'Tap to open'}</span>;
}

/**
 * A reusable physical-stationery opening. It uses Kadi's existing Framer Motion dependency.
 * The caller should pass real event data and the existing invitation renderer as children.
 */
export function EnvelopeExperience({
  names = 'Your invitation',
  eyebrow = 'A special invitation',
  monogram = 'K',
  recipientName,
  letterHeading = 'You are invited',
  letterCopy = 'We would be delighted to celebrate this special moment with you.',
  eventDate,
  eventLocation,
  theme = 'botanical-green',
  shape = 'classic-fold',
  letterFormat = 'printed',
  letterContent,
  secondInsert,
  children,
  onOpen,
  allowSkip = true,
  allowReplay = true,
  replayLabel = 'Replay opening',
  className = '',
}: EnvelopeExperienceProps) {
  const reduced = useReducedMotion() === true;
  const themeConfig = ENVELOPE_THEMES[theme];
  const [phase, setPhase] = useState<OpeningPhase>('closed');
  const [opening, setOpening] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const runRef = useRef(0);
  const openingLockRef = useRef(false);

  const stageControls = useAnimationControls();
  const objectControls = useAnimationControls();
  const sealControls = useAnimationControls();
  const flapControls = useAnimationControls();
  const linerControls = useAnimationControls();
  const insertOneControls = useAnimationControls();
  const insertTwoControls = useAnimationControls();
  const letterControls = useAnimationControls();
  const innerLetterControls = useAnimationControls();

  const revealImmediately = useCallback(() => {
    runRef.current += 1;
    skipPhysicalOpening([stageControls, objectControls, sealControls, flapControls, linerControls, insertOneControls, insertTwoControls, letterControls, innerLetterControls]);
    openingLockRef.current = false;
    setPhase('revealed');
    setOpening(false);
    setRevealed(true);
    onOpen?.();
  }, [stageControls, objectControls, sealControls, flapControls, linerControls, insertOneControls, insertTwoControls, letterControls, innerLetterControls, onOpen]);

  const openInvitation = useCallback(async () => {
    if (opening || revealed || openingLockRef.current) return;
    openingLockRef.current = true;
    const runId = ++runRef.current;
    const isCurrent = () => runRef.current === runId;
    setOpening(true);

    if (reduced) {
      setPhase('handoff');
      revealImmediately();
      return;
    }

    try {
      // 1. Press; the envelope and wax react as one physical object.
      setPhase('seal-press');
      await pressWaxSeal(sealControls, objectControls);
      if (!isCurrent()) return;

      // 2. Release the wax seal.
      setPhase('seal-break');
      await breakWaxSeal(sealControls);
      if (!isCurrent()) return;

      // 3. Hinge the flap open to expose its inner face.
      setPhase('flap-open');
      await openHingedFlap(flapControls);
      if (!isCurrent()) return;

      // 4. Reveal the patterned lining, then lift two pieces of paper at different speeds.
      setPhase('liner-reveal');
      await revealEnvelopeLiner(linerControls);
      if (!isCurrent()) return;
      setPhase('inserts-rise');
      await raisePaperInserts(insertOneControls, insertTwoControls);
      if (!isCurrent()) return;

      // 5. Lift the invitation far enough to establish that it was inside the pocket.
      setPhase('letter-rise');
      await raiseInvitationCard(letterControls);
      if (!isCurrent()) return;

      // 6. Open the folded-card crease or settle the printed/handwritten page.
      setPhase('letter-unfold');
      await unfoldInvitationCard(letterControls, innerLetterControls, letterFormat);
      if (!isCurrent()) return;

      // 7. Blend into the real event invitation page.
      setPhase('handoff');
      await handoffToInvitation(stageControls);
      if (!isCurrent()) return;
      openingLockRef.current = false;
      setPhase('revealed');
      setOpening(false);
      setRevealed(true);
      onOpen?.();
    } catch (error) {
      // The fallback keeps the invite usable if a browser interrupts an animation promise.
      if (isCurrent()) revealImmediately();
      if (process.env.NODE_ENV !== 'production') console.error('Kadi envelope animation interrupted:', error);
    }
  }, [opening, revealed, reduced, letterFormat, sealControls, stageControls, objectControls, flapControls, linerControls, insertOneControls, insertTwoControls, letterControls, innerLetterControls, revealImmediately, onOpen]);

  useEffect(() => {
    if (!revealed) {
      resetPhysicalOpening({ stage: stageControls, envelope: objectControls, seal: sealControls, flap: flapControls, liner: linerControls, firstInsert: insertOneControls, secondInsert: insertTwoControls, letter: letterControls, innerLetter: innerLetterControls }, letterFormat);
    }
  }, [revealed, letterFormat, stageControls, objectControls, sealControls, flapControls, linerControls, insertOneControls, insertTwoControls, letterControls, innerLetterControls]);

  const replay = () => {
    runRef.current += 1;
    openingLockRef.current = false;
    resetPhysicalOpening({ stage: stageControls, envelope: objectControls, seal: sealControls, flap: flapControls, liner: linerControls, firstInsert: insertOneControls, secondInsert: insertTwoControls, letter: letterControls, innerLetter: innerLetterControls }, letterFormat);
    setPhase('closed');
    setOpening(false);
    setRevealed(false);
  };

  if (revealed) {
    return (
      <div className={`ke-revealed ${className}`}>
        <motion.div initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.44 }}>
          {children}
        </motion.div>
        {allowReplay && (
          <button type="button" className="ke-replay" onClick={replay} aria-label={replayLabel}>
            <span aria-hidden="true">↶</span> {replayLabel}
          </button>
        )}
      </div>
    );
  }

  const letterStyle = { '--ke-paper': themeConfig.paper, '--ke-ink': themeConfig.ink, '--ke-accent': themeConfig.accent } as CSSProperties;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="kadi-envelope-stage"
        className={`ke-stage ke-theme--${theme} ${className}`}
        style={{
          '--ke-background': themeConfig.background,
          '--ke-envelope': themeConfig.envelope,
          '--ke-envelope-dark': themeConfig.envelopeDark,
          '--ke-liner': themeConfig.liner,
          '--ke-paper': themeConfig.paper,
          '--ke-ink': themeConfig.ink,
          '--ke-accent': themeConfig.accent,
          '--ke-seal': themeConfig.seal,
          '--ke-seal-ink': themeConfig.sealInk,
          '--ke-ornamental': themeConfig.ornamental,
        } as CSSProperties}
        initial={false}
        animate={stageControls}
        exit={{ opacity: 0 }}
        aria-label="Invitation envelope opening"
      >
        <div className={`ke-atmosphere ke-texture--${themeConfig.surfaceTexture}`} aria-hidden="true" />
        <div className="ke-light-orb" aria-hidden="true" />
        <header className="ke-stage-heading">
          <p className="ke-eyebrow">{eyebrow}</p>
          <h1>{recipientName ? `A letter for ${recipientName}` : 'Something special awaits'}</h1>
          <p className="ke-intro-subtitle">{opening ? <PhaseLabel phase={phase} /> : 'A small moment, made just for you'}</p>
        </header>

        <div className={`ke-object-scene ke-shape--${shape}`}>
          <div className="ke-table-shadow" aria-hidden="true" />
          <motion.div className="ke-envelope-object" animate={objectControls} initial={{ y: 0, scale: 1 }}>
            <div className="ke-envelope-back" />
            <motion.div className="ke-liner" animate={linerControls} initial={{ y: 6, opacity: 0 }} aria-hidden="true">
              <div className="ke-liner-pattern" />
              <Ornament kind={theme === 'blue-tones' || theme === 'ruby-disco' ? 'stars' : 'leaf'} />
            </motion.div>

            <motion.div className="ke-insert ke-insert--one" animate={insertOneControls} initial={{ y: '3%', rotate: -2, opacity: 0 }} aria-hidden="true">
              <div className="ke-insert-rule" />
              <Ornament />
            </motion.div>
            <motion.div className={`ke-insert ke-insert--two ${secondInsert ? 'ke-insert--custom' : ''}`} animate={insertTwoControls} initial={{ y: '5%', rotate: 2, opacity: 0 }} aria-hidden={secondInsert ? undefined : true}>
              {secondInsert ?? <><span className="ke-insert-monogram">{monogram.slice(0, 2)}</span><div className="ke-insert-rule" /></>}
            </motion.div>

            <motion.article className={`ke-letter ke-letter--${letterFormat}`} style={letterStyle} animate={letterControls} initial={{ y: '7%', rotate: 0, scale: 0.97, opacity: 0 }} aria-label="Invitation letter preview">
              <div className="ke-letter-inner">
                <div className="ke-letter-border" aria-hidden="true">
                  <span className="ke-corner ke-corner--tl" /><span className="ke-corner ke-corner--tr" />
                  <span className="ke-corner ke-corner--bl" /><span className="ke-corner ke-corner--br" />
                </div>
                <div className="ke-letter-content">
                  {recipientName && <p className="ke-recipient">For {recipientName}</p>}
                  <Ornament kind={theme === 'blue-tones' ? 'stars' : 'flourish'} />
                  <p className="ke-letter-kicker">{letterHeading}</p>
                  {letterContent ?? (
                    <>
                      <h2>{names}</h2>
                      <p className="ke-letter-copy">{letterCopy}</p>
                      {(eventDate || eventLocation) && (
                        <div className="ke-event-facts">
                          {eventDate && <p>{eventDate}</p>}
                          {eventLocation && <p>{eventLocation}</p>}
                        </div>
                      )}
                    </>
                  )}
                  <span className="ke-letter-bottom"><Ornament /></span>
                </div>
              </div>
              {letterFormat === 'folded-card' && (
                <motion.div className="ke-letter-fold-cover" animate={innerLetterControls} initial={{ rotateY: 0, scaleX: 0.97 }} aria-hidden="true">
                  <div className="ke-fold-cover-border" />
                  <span className="ke-fold-cover-monogram">{monogram.slice(0, 2)}</span>
                  <Ornament kind={theme === 'blue-tones' ? 'stars' : 'flourish'} />
                  <span className="ke-fold-cover-kicker">{letterHeading}</span>
                  <strong>{names}</strong>
                  <span className="ke-fold-cover-hint">Open to read the invitation</span>
                </motion.div>
              )}
            </motion.article>

            <div className="ke-pocket" aria-hidden="true">
              <div className="ke-pocket-left" /><div className="ke-pocket-right" /><div className="ke-pocket-bottom" />
              <div className="ke-pocket-edge" />
            </div>
            <motion.div className="ke-flap" animate={flapControls} initial={{ rotateX: 0, z: 0 }} aria-hidden="true">
              <div className="ke-flap-face ke-flap-face--outer"><span className="ke-flap-monogram">{monogram.slice(0, 2)}</span><Ornament /></div>
              <div className="ke-flap-face ke-flap-face--inner"><span className="ke-flap-inner-mark">{themeConfig.label}</span></div>
            </motion.div>

            {shape === 'ribbon-tie' && <div className="ke-ribbon" aria-hidden="true"><span /></div>}
            {shape === 'wax-string' && <svg className="ke-string" viewBox="0 0 360 220" aria-hidden="true"><path d="M181 0 C150 42 232 62 180 108 S147 168 181 220" /><path d="M0 110 C70 82 135 143 180 108 S284 84 360 110" /></svg>}
            {shape === 'tri-fold' && <div className="ke-trifold" aria-hidden="true"><i /><i /></div>}

            <motion.button
              type="button"
              className="ke-seal-button"
              animate={sealControls}
              initial={{ scale: 1, opacity: 1 }}
              onClick={openInvitation}
              disabled={opening}
              aria-label="Press the wax seal and open the invitation"
            >
              <span className="ke-seal-halo" aria-hidden="true" />
              <span className="ke-seal-face"><span className="ke-seal-mark">{monogram.slice(0, 2)}</span><span className="ke-seal-imprint" aria-hidden="true">❦</span></span>
            </motion.button>
          </motion.div>
        </div>

        <div className="ke-stage-actions">
          <button type="button" className="ke-open-button" onClick={openInvitation} disabled={opening}>
            <span className="ke-button-rule" aria-hidden="true" />
            {opening ? 'Opening your letter…' : 'Press the seal to open'}
            <span className="ke-button-rule" aria-hidden="true" />
          </button>
          {allowSkip && opening && <button type="button" className="ke-skip-button" onClick={revealImmediately}>Skip animation</button>}
        </div>
        <footer className="ke-stage-footer"><Ornament /> <span>Made for a moment worth remembering</span> <Ornament /></footer>
      </motion.section>
    </AnimatePresence>
  );
}

export default EnvelopeExperience;
