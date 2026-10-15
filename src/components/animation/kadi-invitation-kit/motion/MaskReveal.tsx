'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

type MaskDirection = 'up' | 'left' | 'right' | 'circle' | 'diagonal';
type Props = { children: ReactNode; direction?: MaskDirection; duration?: number; delay?: number; className?: string; style?: CSSProperties; altLabel?: string };

const MASKS: Record<MaskDirection, { closed: string; open: string }> = {
  up: { closed: 'inset(100% 0 0 0)', open: 'inset(0% 0 0 0)' },
  left: { closed: 'inset(0 100% 0 0)', open: 'inset(0 0 0 0)' },
  right: { closed: 'inset(0 0 0 100%)', open: 'inset(0 0 0 0)' },
  circle: { closed: 'circle(0% at 50% 50%)', open: 'circle(75% at 50% 50%)' },
  diagonal: { closed: 'polygon(0 0, 0 0, 0 100%, 0 100%)', open: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
};

export function MaskReveal({ children, direction = 'up', duration = 0.9, delay = 0, className, style, altLabel }: Props) {
  const reduced = useReducedMotion() === true;
  const mask = MASKS[direction];
  return (
    <motion.div
      className={className}
      style={{ overflow: 'hidden', ...style }}
      aria-label={altLabel}
      initial={reduced ? false : { clipPath: mask.closed }}
      whileInView={{ clipPath: mask.open }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduced ? { duration: 0 } : { duration, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default MaskReveal;
