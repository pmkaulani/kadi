'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Keep this small (12–24px on phones) to avoid seasick movement. */
  maxShift?: number;
  scale?: number;
  loading?: 'eager' | 'lazy';
};

export function ParallaxImage({ src, alt, className, maxShift = 18, scale = 1.08, loading = 'lazy' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [maxShift, -maxShift]);
  return (
    <div ref={ref} className={`ke-parallax-frame ${className ?? ''}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className="ke-parallax-image"
        style={{ y: reduced ? 0 : y, scale: reduced ? 1 : scale }}
      />
    </div>
  );
}

export default ParallaxImage;
