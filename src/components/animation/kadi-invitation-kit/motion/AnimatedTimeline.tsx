'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { TimelineEntry } from '../types';
import { MaskReveal } from './MaskReveal';
import { DrawnLine } from './DrawnLine';

type Props = { items: TimelineEntry[]; className?: string; railColor?: string; align?: 'left' | 'alternate' };

/** A drawn timeline rail; each milestone arrives with its own offset and optional image mask. */
export function AnimatedTimeline({ items, className, railColor = 'currentColor', align = 'alternate' }: Props) {
  const reduced = useReducedMotion() === true;
  return (
    <div className={`ke-timeline ${align === 'alternate' ? 'ke-timeline--alternate' : 'ke-timeline--left'} ${className ?? ''}`}>
      <div className="ke-timeline__rail" aria-hidden="true"><DrawnLine vertical color={railColor} duration={1.45} /></div>
      {items.map((item, index) => (
        <motion.article
          key={`${item.title}-${index}`}
          className={`ke-timeline__item ke-timeline__item--${index % 2 ? 'right' : 'left'}`}
          initial={reduced ? false : { opacity: 0, y: 28, x: index % 2 ? 14 : -14 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={reduced ? { duration: 0 } : { duration: 0.65, delay: Math.min(index * 0.05, 0.2), ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="ke-timeline__dot" aria-hidden="true" />
          {item.image && (
            <MaskReveal direction={index % 2 ? 'left' : 'right'} className="ke-timeline__image-mask">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.imageAlt || item.title || 'Timeline milestone'}
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            </MaskReveal>
          )}
          {item.date && <p className="ke-timeline__date">{item.date}</p>}
          <h3>{item.title}</h3>
          {item.body && <p>{item.body}</p>}
        </motion.article>
      ))}
    </div>
  );
}

export default AnimatedTimeline;
