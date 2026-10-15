'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

type WipeStyle = 'paper' | 'curtain' | 'circle' | 'diagonal';
type Props = { children: ReactNode; className?: string; style?: CSSProperties; wipe?: WipeStyle; duration?: number; delay?: number; as?: 'section' | 'div' | 'article' };

const shapes: Record<WipeStyle, [string, string]> = {
  paper: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
  curtain: ['inset(0 50% 0 50%)', 'inset(0 0% 0 0%)'],
  circle: ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'],
  diagonal: ['polygon(0 0, 0 0, 0 100%, 0 100%)', 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'],
};

export function SectionWipe({ children, className, style, wipe = 'paper', duration = 0.95, delay = 0, as = 'section' }: Props) {
  const reduced = useReducedMotion() === true;
  const [closed, open] = shapes[wipe];
  const Tag = as === 'div' ? motion.div : as === 'article' ? motion.article : motion.section;
  return (
    <Tag
      className={className}
      style={{ overflow: 'hidden', ...style }}
      initial={reduced ? false : { clipPath: closed }}
      whileInView={{ clipPath: open }}
      viewport={{ once: true, amount: 0.15 }}
      transition={reduced ? { duration: 0 } : { duration, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </Tag>
  );
}

export default SectionWipe;
