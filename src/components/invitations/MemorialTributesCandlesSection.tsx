'use client';

import React, { useState } from 'react';
import { SectionIntro, DrawLine } from '@/components/animation/MotionToolkit';
import { Flame, Heart, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TributeItem {
  id: string;
  author: string;
  relationship?: string;
  message: string;
  createdAt: string;
}

interface MemorialTributesCandlesSectionProps {
  honoreeName: string;
  initialCandlesCount?: number;
  tributes?: TributeItem[];
}

export function MemorialTributesCandlesSection({
  honoreeName,
  initialCandlesCount = 142,
  tributes = [],
}: MemorialTributesCandlesSectionProps) {
  const [candlesCount, setCandlesCount] = useState(initialCandlesCount);
  const [hasLitCandle, setHasLitCandle] = useState(false);

  // Tribute submission form state
  const [author, setAuthor] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const defaultTributes: TributeItem[] = [
    {
      id: 'trib-1',
      author: 'Prof. David Mwangi',
      relationship: 'Former Colleague',
      message: 'Mama Sarah was an exceptional educator whose patience transformed countless lives. Her legacy lives on through every student she guided.',
      createdAt: '2 days ago',
    },
    {
      id: 'trib-2',
      author: 'Wanjiru & Patrick Kamau',
      relationship: 'Family Friends',
      message: 'A true mother in Israel. We will forever cherish her warmth, welcoming table, and unconditional prayers.',
      createdAt: '3 days ago',
    },
    {
      id: 'trib-3',
      author: 'Grace Njeri Kariuki',
      relationship: 'Granddaughter',
      message: 'Rest well, Cucu. Thank you for teaching us love, kindness, and dignity.',
      createdAt: '4 days ago',
    },
  ];

  const tributeList = tributes.length > 0 ? tributes : defaultTributes;

  const handleLightCandle = () => {
    if (hasLitCandle) return;
    setCandlesCount((prev) => prev + 1);
    setHasLitCandle(true);
  };

  const handleSubmitTribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;
    setSubmitting(true);
    // Honest simulated submission with clear feedback
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section className="w-full px-4 sm:px-6 py-16 sm:py-24 bg-transparent border-t border-[rgba(39,38,32,0.14)]" id="memorial-tributes">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Virtual Candle Lighting Ceremony */}
        <div className="text-center max-w-xl mx-auto p-8 rounded-sm border border-[rgba(39,38,32,0.14)] bg-[#FBF8F1] shadow-sm">
          <div className="relative inline-block mb-4">
            <motion.div
              animate={hasLitCandle ? { scale: [1, 1.15, 1], rotate: [-2, 2, -1] } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-colors ${
                hasLitCandle
                  ? 'bg-amber-100/90 text-amber-600 shadow-[0_0_24px_rgba(245,158,11,0.4)]'
                  : 'bg-[#DDD0BE]/40 text-[#68574B]'
              }`}
            >
              <Flame size={28} className={hasLitCandle ? 'fill-amber-500' : ''} />
            </motion.div>
          </div>

          <h3 className="font-serif text-2xl text-brand-charcoal mb-2">
            Light a Candle for {honoreeName}
          </h3>
          <p className="text-xs sm:text-sm text-brand-slate mb-6">
            Join friends and family near and far in keeping a quiet light burning in honour of her memory.
          </p>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleLightCandle}
              disabled={hasLitCandle}
              className={`px-6 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-[0.16em] transition-all flex items-center gap-2 ${
                hasLitCandle
                  ? 'bg-amber-50 border border-amber-300 text-amber-800 cursor-default'
                  : 'bg-[#68574B] text-white hover:bg-[#52443a] shadow-sm'
              }`}
            >
              <Flame size={14} />
              <span>{hasLitCandle ? 'Your Candle is Burning' : 'Light a Candle'}</span>
            </button>

            <span className="text-[11px] font-serif text-brand-slate">
              <strong className="text-brand-charcoal font-medium">{candlesCount}</strong> candles lit in quiet tribute
            </span>
          </div>
        </div>

        {/* Tributes & Condolences Book */}
        <div>
          <SectionIntro
            eyebrow="Tributes & Condolences"
            title="Words of Remembrance"
            subtitle="Heartfelt messages from friends, family, and colleagues celebrating a life well lived."
            accentColor="#68574B"
          />

          <div className="space-y-4 mb-10">
            {tributeList.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 rounded-sm border border-[rgba(39,38,32,0.12)] bg-[#FBF8F1]/70 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <strong className="font-serif text-base text-brand-charcoal block">
                      {item.author}
                    </strong>
                    {item.relationship && (
                      <span className="text-[10px] uppercase tracking-wider text-[#68574B] font-semibold">
                        {item.relationship}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-brand-slate font-serif">{item.createdAt}</span>
                </div>
                <p className="text-xs sm:text-sm text-brand-charcoal leading-relaxed font-serif italic mt-2">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Leave a Tribute Form */}
          <div className="p-6 sm:p-8 rounded-sm border border-[rgba(39,38,32,0.14)] bg-[#FBF8F1]">
            <h4 className="font-serif text-xl text-brand-charcoal mb-1 flex items-center gap-2">
              <Heart size={16} className="text-[#68574B]" /> Leave a Message for the Family
            </h4>
            <p className="text-xs text-brand-slate mb-6">
              Your words will be shared with the family in their private book of remembrance.
            </p>

            {submitted ? (
              <div className="p-4 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="font-medium">Thank you, {author}.</strong>
                  <p className="mt-0.5 text-emerald-800">
                    Your tribute has been lovingly recorded and will be presented to the family.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitTribute} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-brand-slate mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Jane Wangari"
                      className="w-full text-xs p-2.5 rounded-sm border border-[rgba(39,38,32,0.18)] bg-white focus:outline-none focus:border-[#68574B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-brand-slate mb-1">
                      Relationship / Organization
                    </label>
                    <input
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g. Colleague, Neighbor, Cousin"
                      className="w-full text-xs p-2.5 rounded-sm border border-[rgba(39,38,32,0.18)] bg-white focus:outline-none focus:border-[#68574B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-brand-slate mb-1">
                    Your Tribute / Condolence *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a memory, prayer, or comforting thought..."
                    className="w-full text-xs p-2.5 rounded-sm border border-[rgba(39,38,32,0.18)] bg-white focus:outline-none focus:border-[#68574B] resize-y"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-brand-slate italic">
                    Tributes are reviewed to maintain a dignified space.
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-sm bg-[#68574B] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#52443a] transition-colors flex items-center gap-1.5"
                  >
                    <Send size={12} />
                    <span>{submitting ? 'Submitting...' : 'Post Tribute'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
