'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MaskReveal } from './MaskReveal';

type Props = {
  title?: string;
  message?: string;
  names?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  onBackToTop?: () => void;
};

/** A designed final chapter so the invitation ends with a visual full stop, not a generic footer card. */
export function InvitationClosing({
  title = 'Until we meet',
  message = 'Thank you for being part of this moment.',
  names,
  imageSrc,
  imageAlt = '',
  className,
  onBackToTop,
}: Props) {
  const reduced = useReducedMotion() === true;
  return (
    <section className={`ke-closing ${className ?? ''}`}>
      {imageSrc && (
        <MaskReveal direction="up" className="ke-closing__image-wrap" duration={1.1}>
          <motion.img src={imageSrc} alt={imageAlt} loading="lazy" initial={reduced ? false : { scale: 1.12 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }} />
        </MaskReveal>
      )}
      <div className="ke-closing__content">
        <motion.span className="ke-closing__ornament" initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 0.7 }}>— ✧ —</motion.span>
        <motion.h2 initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 0.75 }}>{title}</motion.h2>
        <motion.p initial={reduced ? false : { opacity: 0, y: 13 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.12 }}>{message}</motion.p>
        {names && <p className="ke-closing__signature">{names}</p>}
        {onBackToTop && <button type="button" className="ke-closing__top" onClick={onBackToTop}>Back to the beginning ↑</button>}
      </div>
    </section>
  );
}

export default InvitationClosing;
