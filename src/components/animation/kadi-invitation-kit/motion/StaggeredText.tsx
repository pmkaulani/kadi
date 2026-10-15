'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { HTMLAttributes, ReactNode } from 'react';

type Props = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  by?: 'word' | 'line';
  delay?: number;
  stagger?: number;
  className?: string;
} & Pick<HTMLAttributes<HTMLElement>, 'id' | 'role' | 'style'>;

export function StaggeredText({ text, as = 'h2', by = 'word', delay = 0, stagger = 0.065, className, id, role, style }: Props) {
  const reduced = useReducedMotion() === true;
  const pieces = by === 'line' ? text.split('\n') : text.split(/\s+/).filter(Boolean);
  const children: ReactNode = pieces.map((piece, index) => (
    <motion.span
      key={`${index}-${piece}`}
      aria-hidden="true"
      className="ke-staggered-text__piece"
      initial={reduced ? false : { opacity: 0, y: 18, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.7 }}
      transition={reduced ? { duration: 0 } : { duration: 0.54, delay: delay + index * stagger, ease: [0.22, 1, 0.36, 1] }}
    >
      {piece}{by === 'word' ? '\u00a0' : ''}
    </motion.span>
  ));
  const shared = { id, role, style, className: `ke-staggered-text ${className ?? ''}`, 'aria-label': text };
  if (as === 'h1') return <motion.h1 {...shared}>{children}</motion.h1>;
  if (as === 'h3') return <motion.h3 {...shared}>{children}</motion.h3>;
  if (as === 'p') return <motion.p {...shared}>{children}</motion.p>;
  if (as === 'span') return <motion.span {...shared}>{children}</motion.span>;
  return <motion.h2 {...shared}>{children}</motion.h2>;
}

export default StaggeredText;
