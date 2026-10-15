'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = { children: ReactNode; className?: string; title?: string; note?: string };

/** Gives RSVP a distinct chapter entrance, but never disables the form while it animates. */
export function RSVPEntrance({ children, className, title, note }: Props) {
  const reduced = useReducedMotion() === true;
  return (
    <motion.section
      className={`ke-rsvp-entrance ${className ?? ''}`}
      initial={reduced ? false : { opacity: 0, y: 30, clipPath: 'inset(8% 0 0 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, amount: 0.1 }}
      transition={reduced ? { duration: 0 } : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      {(title || note) && <header className="ke-rsvp-entrance__heading">{title && <h2>{title}</h2>}{note && <p>{note}</p>}</header>}
      {children}
    </motion.section>
  );
}

export default RSVPEntrance;
