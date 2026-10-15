'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import type { RevealPreset } from '../types';

type Props = {
  children: ReactNode;
  preset?: RevealPreset;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'figure';
  /** Pass aria-label, id, style, etc. through to the motion element. */
  motionProps?: Omit<HTMLMotionProps<'div'>, 'children' | 'className'>;
};

const HIDDEN = {
  'fade-up': { opacity: 0, y: 34 },
  'slide-left': { opacity: 0, x: 52 },
  'slide-right': { opacity: 0, x: -52 },
  'scale-in': { opacity: 0, scale: 0.92 },
  'rotate-in': { opacity: 0, y: 24, rotate: -3 },
  'mask-up': { opacity: 1, clipPath: 'inset(100% 0 0 0)' },
  'mask-left': { opacity: 1, clipPath: 'inset(0 100% 0 0)' },
  'mask-right': { opacity: 1, clipPath: 'inset(0 0 0 100%)' },
} satisfies Record<RevealPreset, object>;

export function ScrollReveal({ children, preset = 'fade-up', delay = 0, duration = 0.7, once = true, amount = 0.18, className, as = 'div', motionProps }: Props) {
  const reduced = useReducedMotion() === true;
  const Tag = as === 'section' ? motion.section : as === 'article' ? motion.article : as === 'figure' ? motion.figure : motion.div;
  const hidden = reduced ? {} : HIDDEN[preset];
  const visible = preset.startsWith('mask-') ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' } : { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };
  return (
    <Tag
      className={className}
      initial={reduced ? false : hidden}
      whileInView={visible}
      viewport={{ once, amount }}
      transition={reduced ? { duration: 0 } : { duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...(motionProps as object)}
    >
      {children}
    </Tag>
  );
}

export default ScrollReveal;
