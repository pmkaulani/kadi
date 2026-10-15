'use client';

import React, { useState } from 'react';
import { Share2, Calendar, Check, ArrowUp } from 'lucide-react';

interface ClosingSectionProps {
  celebrants?: string;
  closingNote?: string;
  calendarData?: {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate?: string;
  };
}

export function ClosingSection({
  celebrants,
  closingNote,
  calendarData,
}: ClosingSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: calendarData?.title || 'Invitation',
          text: `You're invited to celebrate with ${celebrants || 'us'}`,
          url,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleAddToCalendar = () => {
    if (!calendarData) return;
    const title = encodeURIComponent(calendarData.title);
    const location = encodeURIComponent(calendarData.location);
    const details = encodeURIComponent(calendarData.description);
    // Google Calendar direct link format
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full px-4 sm:px-6 py-16 sm:py-24 bg-transparent border-t border-[rgba(39,38,32,0.14)]" id="closing-section">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Sign-off message */}
        <div className="space-y-4">
          <p className="font-serif text-2xl sm:text-3xl text-brand-charcoal italic leading-relaxed">
            {closingNote || '“We cannot wait to share this unforgettable moment with you.”'}
          </p>
          {celebrants && (
            <p className="text-xs uppercase font-bold tracking-[0.22em] text-[#934638]">
              — {celebrants}
            </p>
          )}
        </div>

        <div className="w-12 h-px bg-[#B99A62] mx-auto opacity-50" />

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[rgba(39,38,32,0.18)] bg-[#FBF8F1] hover:bg-[#EDE4D3] text-xs font-semibold uppercase tracking-wider text-brand-charcoal transition-colors shadow-sm"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} className="text-[#934638]" />}
            <span>{copied ? 'Link Copied' : 'Share Invitation'}</span>
          </button>

          {calendarData && (
            <button
              type="button"
              onClick={handleAddToCalendar}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[rgba(39,38,32,0.18)] bg-[#FBF8F1] hover:bg-[#EDE4D3] text-xs font-semibold uppercase tracking-wider text-brand-charcoal transition-colors shadow-sm"
            >
              <Calendar size={14} className="text-[#B99A62]" />
              <span>Add to Calendar</span>
            </button>
          )}

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to the beginning"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm border border-[rgba(39,38,32,0.14)] text-xs text-brand-slate hover:text-brand-charcoal hover:bg-[#FBF8F1] transition-colors"
          >
            <ArrowUp size={13} />
            <span>Top</span>
          </button>
        </div>

        {/* Kadi mark */}
        <div className="pt-8">
          <span className="font-serif text-lg tracking-tight text-[#272620]">
            kadi<span className="text-[#934638]">.</span>
          </span>
          <p className="text-[10px] uppercase tracking-widest text-brand-slate/60 mt-1">
            Stationery for meaningful gatherings
          </p>
        </div>
      </div>
    </section>
  );
}
