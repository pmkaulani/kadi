'use client';

import React, { useState } from 'react';
import { Flame, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CondolenceMessage {
  id: string;
  author: string;
  message: string;
  date: string;
}

interface CondolencesSectionProps {
  initialCandleCount?: number;
  initialTributes?: CondolenceMessage[];
  honoreeName?: string;
}

export function CondolencesSection({
  initialCandleCount = 42,
  initialTributes = [
    {
      id: '1',
      author: 'Rev. Samuel & Mary Mwangi',
      message: 'Mama Sarah was an exemplary mother in faith. May the Lord grant comfort, peace, and eternal rest to the entire family.',
      date: 'Yesterday at 4:15 PM',
    },
    {
      id: '2',
      author: 'The St. Paul High School Alumni (Class of 1994)',
      message: 'Teacher Sarah touched thousands of young minds with patience and wisdom. Rest well in God’s bosom.',
      date: '2 days ago',
    },
  ],
  honoreeName = 'Mama Sarah Wambui Kariuki',
}: CondolencesSectionProps) {
  const [candleCount, setCandleCount] = useState(initialCandleCount);
  const [hasLitCandle, setHasLitCandle] = useState(false);
  const [tributes, setTributes] = useState<CondolenceMessage[]>(initialTributes);

  const [authorName, setAuthorName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleLightCandle = () => {
    if (hasLitCandle) return;
    setCandleCount((prev) => prev + 1);
    setHasLitCandle(true);
  };

  const handleTributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !messageText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTribute: CondolenceMessage = {
        id: String(Date.now()),
        author: authorName,
        message: messageText,
        date: 'Just now',
      };
      setTributes([newTribute, ...tributes]);
      setAuthorName('');
      setMessageText('');
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 4000);
    }, 400);
  };

  return (
    <section className="w-full p-6 sm:p-12 bg-event-sage-light/30 border-t border-slate-200">
      <div className="max-w-xl mx-auto text-center">
        {/* Virtual Candle Memorial */}
        <div className="mb-10 p-6 rounded-2xl bg-white shadow-sm border border-emerald-900/10">
          <div className="relative inline-block mb-3">
            <Flame
              className={`w-10 h-10 transition-all duration-500 ${
                hasLitCandle ? 'text-amber-500 scale-110 drop-shadow-md' : 'text-slate-400'
              }`}
            />
          </div>
          <h3 className="text-lg font-serif font-bold text-brand-charcoal">
            Light a Virtual Candle in Memory
          </h3>
          <p className="text-xs text-brand-slate mt-1">
            {candleCount} {candleCount === 1 ? 'candle' : 'candles'} lit in honor of {honoreeName}
          </p>

          <Button
            variant={hasLitCandle ? 'secondary' : 'gold'}
            size="md"
            className="mt-4"
            disabled={hasLitCandle}
            onClick={handleLightCandle}
          >
            {hasLitCandle ? 'You Have Lit a Candle' : 'Light a Candle for the Family'}
          </Button>
        </div>

        {/* Condolences Book */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-slate bg-slate-100 px-3 py-1 rounded-full">
            Tributes & Condolences
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal mt-3">
            Words of Comfort
          </h2>
          <p className="text-xs text-brand-slate mt-1 mb-6">
            Share a memory or blessing with the family.
          </p>

          {/* Form */}
          <form onSubmit={handleTributeSubmit} className="space-y-4 mb-8 text-left bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            {isSent && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your message of comfort has been added to the family tribute book.</span>
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-brand-slate mb-1">
                Your Name & Relationship
              </label>
              <input
                type="text"
                placeholder="e.g. John Ochieng (Former Colleague)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-brand-slate mb-1">
                Your Condolence / Message
              </label>
              <textarea
                rows={3}
                placeholder="Share your memories, prayer, or comfort..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-emerald-800 hover:bg-emerald-900 focus:ring-emerald-800 w-full"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Sign the Condolence Book
            </Button>
          </form>

          {/* Tribute Stream */}
          <div className="space-y-4 text-left">
            {tributes.map((tribute) => (
              <div key={tribute.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <span className="font-semibold text-brand-charcoal">{tribute.author}</span>
                  <span className="text-[10px] text-slate-400">{tribute.date}</span>
                </div>
                <p className="text-xs text-brand-slate mt-2 leading-relaxed italic font-serif">
                  &ldquo;{tribute.message}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
