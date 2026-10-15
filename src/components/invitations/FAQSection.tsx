'use client';

import React, { useState } from 'react';
import { SectionIntro } from '@/components/animation/MotionToolkit';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQSectionProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export function FAQSection({
  items,
  title = 'Frequently Asked Questions',
  subtitle = 'A few helpful details to ensure your day with us is effortless and comfortable.',
}: FAQSectionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const defaultItems: FAQItem[] = [
    {
      category: 'Attire',
      question: 'What is the dress code?',
      answer:
        'We invite our guests to dress in formal celebratory attire. Warm earthy tones, neutrals, and terracotta shades are especially welcome.',
    },
    {
      category: 'Children',
      question: 'Are children welcome?',
      answer:
        'While we love your little ones, our celebration will be an adult-focused gathering unless specifically noted on your invitation envelope.',
    },
    {
      category: 'Parking & Arrival',
      question: 'Is parking available at the venue?',
      answer:
        'Yes, complimentary secure parking and valet assistance are provided on site. We recommend arriving 20 minutes prior to ceremony start.',
    },
    {
      category: 'Ceremony',
      question: 'Can I take photographs during the ceremony?',
      answer:
        'We kindly request an unplugged ceremony. Please tuck phones away during the vows so our photographers can capture unobstructed moments. Feel free to snap as many photos as you wish during the reception!',
    },
    {
      category: 'Gifts',
      question: 'What is your gift preference?',
      answer:
        'Your presence is the greatest gift of all. If you would like to honour us with a token, a contribution toward our home fund via M-Pesa is warmly appreciated.',
    },
  ];

  const list = items && items.length > 0 ? items : defaultItems;

  const toggleItem = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="w-full px-4 sm:px-6 py-16 sm:py-24 bg-transparent border-t border-[rgba(39,38,32,0.14)]" id="faq-section">
      <div className="max-w-4xl mx-auto">
        <SectionIntro
          eyebrow="Questions & Details"
          title={title}
          subtitle={subtitle}
          accentColor="#934638"
        />

        <div className="space-y-3">
          {list.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            const contentId = `faq-content-${idx}`;
            const headerId = `faq-header-${idx}`;

            return (
              <div
                key={`${item.question}-${idx}`}
                className="border border-[rgba(39,38,32,0.14)] bg-[#FBF8F1]/80 backdrop-blur-sm transition-colors rounded-sm overflow-hidden"
              >
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleItem(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#934638]"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm bg-[#934638]/10 text-[#934638] shrink-0">
                      {item.category || 'FAQ'}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg text-brand-charcoal font-medium">
                      {item.question}
                    </h3>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-[#B99A62] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={contentId}
                      role="region"
                      aria-labelledby={headerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-brand-slate leading-relaxed border-t border-[rgba(39,38,32,0.08)]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
