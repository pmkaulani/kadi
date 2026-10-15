'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties } from 'react';

type Props = {
  className?: string;
  color?: string;
  width?: number | string;
  strokeWidth?: number;
  vertical?: boolean;
  duration?: number;
  style?: CSSProperties;
  decorative?: boolean;
};

/** A drawn SVG rule for timeline rails, chapter dividers and fine ornamental details. */
export function DrawnLine({ className, color = 'currentColor', width = '100%', strokeWidth = 1.4, vertical = false, duration = 1.15, style, decorative = true }: Props) {
  const reduced = useReducedMotion() === true;
  const viewBox = vertical ? '0 0 20 240' : '0 0 240 20';
  const path = vertical ? 'M10 1 C8 48 12 68 10 120 S12 190 10 239' : 'M1 10 C48 8 68 12 120 10 S190 12 239 10';
  return (
    <motion.svg
      className={className}
      width={vertical ? 20 : width}
      height={vertical ? '100%' : 20}
      viewBox={viewBox}
      preserveAspectRatio={vertical ? 'none' : 'none'}
      style={{ display: 'block', overflow: 'visible', ...style }}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
    >
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0, opacity: 0.4 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={reduced ? { duration: 0 } : { duration, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

export default DrawnLine;
