'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useState } from 'react';
import type { FAQItem } from '../types';

type Props = { items: FAQItem[]; className?: string; allowMultiple?: boolean };

/** Accessible accordion: the answer container animates height while the button stays usable. */
export function AnimatedFAQ({ items, className, allowMultiple = false }: Props) {
  const baseId = useId();
  const reduced = useReducedMotion() === true;
  const [openIds, setOpenIds] = useState<string[]>([]);
  const toggle = (id: string) => setOpenIds((current) => current.includes(id)
    ? current.filter((entry) => entry !== id)
    : allowMultiple ? [...current, id] : [id]);

  return (
    <div className={`ke-faq ${className ?? ''}`}>
      {items.map((item, index) => {
        const id = `${baseId}-faq-${index}`;
        const open = openIds.includes(id);
        return (
          <div key={id} className={`ke-faq__item ${open ? 'is-open' : ''}`}>
            <h3 className="ke-faq__heading">
              <button id={id} type="button" className="ke-faq__trigger" aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => toggle(id)}>
                <span>{item.question}</span>
                <motion.span className="ke-faq__mark" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: reduced ? 0 : 0.22 }} aria-hidden="true">+</motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`${id}-panel`}
                  className="ke-faq__panel"
                  role="region"
                  aria-labelledby={id}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="ke-faq__answer">{item.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default AnimatedFAQ;
