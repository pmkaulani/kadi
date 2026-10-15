'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MaskReveal } from './MaskReveal';

type Props = {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
  objectPosition?: string;
  mask?: 'up' | 'left' | 'right' | 'circle' | 'diagonal';
};

/** Hero photograph wipe + slow settle, kept separate so the cover transition can be art-directed. */
export function HeroImageReveal({ src, alt, className, caption, objectPosition = 'center', mask = 'diagonal' }: Props) {
  const reduced = useReducedMotion() === true;
  return (
    <figure className={`ke-hero-reveal ${className ?? ''}`}>
      <MaskReveal direction={mask} duration={1.05}>
        <motion.img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          style={{ objectPosition }}
          initial={reduced ? false : { scale: 1.13, y: 8 }}
          whileInView={{ scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduced ? { duration: 0 } : { duration: 1.65, ease: [0.22, 1, 0.36, 1] }}
        />
      </MaskReveal>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export default HeroImageReveal;
