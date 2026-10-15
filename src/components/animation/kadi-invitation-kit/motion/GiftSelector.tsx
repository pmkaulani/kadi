'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import type { GiftChoice } from '../types';

type Props = { choices: GiftChoice[]; className?: string; heading?: string; onChange?: (choice: GiftChoice) => void };

/** Tap-to-open gift objects; state is real React state, not a hover-only trick. */
export function GiftSelector({ choices, className, heading = 'A little something for you', onChange }: Props) {
  const [activeId, setActiveId] = useState(choices[0]?.id ?? '');
  const active = choices.find((choice) => choice.id === activeId) ?? choices[0];
  const reduced = useReducedMotion() === true;
  if (choices.length === 0 || !active) return null;

  const choose = (choice: GiftChoice) => {
    setActiveId(choice.id);
    onChange?.(choice);
  };

  return (
    <section className={`ke-gift-selector ${className ?? ''}`} aria-label={heading}>
      <p className="ke-gift-selector__eyebrow">A small surprise</p>
      <h2>{heading}</h2>
      <div className="ke-gift-selector__objects" role="group" aria-label="Choose a gift to reveal">
        {choices.map((choice, index) => (
          <motion.button
            key={choice.id}
            type="button"
            className={`ke-gift-selector__object ${active.id === choice.id ? 'is-active' : ''}`}
            aria-pressed={active.id === choice.id}
            onClick={() => choose(choice)}
            whileTap={reduced ? undefined : { scale: 0.94, rotate: index % 2 ? -2 : 2 }}
            whileHover={reduced ? undefined : { y: -5 }}
            transition={{ type: 'spring', stiffness: 330, damping: 18 }}
          >
            <span className="ke-gift-selector__symbol" aria-hidden="true">{choice.symbol ?? '✧'}</span>
            <span>{choice.label}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.id}
          className="ke-gift-selector__reveal"
          initial={reduced ? false : { opacity: 0, y: 13, rotate: -0.4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
        >
          <span className="ke-gift-selector__rule" aria-hidden="true" />
          <h3>{active.title}</h3>
          <div>{active.body}</div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

export default GiftSelector;
