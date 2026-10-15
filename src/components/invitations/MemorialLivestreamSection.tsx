'use client';

import React from 'react';
import { SectionIntro } from '@/components/animation/MotionToolkit';
import { Video, ExternalLink, Radio, CheckCircle } from 'lucide-react';

interface MemorialLivestreamSectionProps {
  livestreamUrl?: string;
  livestreamStatus?: 'upcoming' | 'live' | 'ended' | 'none';
  honoreeName: string;
}

export function MemorialLivestreamSection({
  livestreamUrl,
  livestreamStatus = 'upcoming',
  honoreeName,
}: MemorialLivestreamSectionProps) {
  if (!livestreamUrl || livestreamStatus === 'none') return null;

  const isLive = livestreamStatus === 'live';
  const isEnded = livestreamStatus === 'ended';

  return (
    <section className="w-full px-4 sm:px-6 py-12 bg-transparent border-t border-[rgba(39,38,32,0.14)]" id="memorial-livestream">
      <div className="max-w-3xl mx-auto">
        <div className="p-6 sm:p-8 rounded-sm border border-[rgba(39,38,32,0.14)] bg-[#FBF8F1] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  Live Broadcast Now
                </span>
              ) : isEnded ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle size={11} /> Broadcast Concluded
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                  <Radio size={11} /> Live Stream Scheduled
                </span>
              )}
            </div>

            <h3 className="font-serif text-xl sm:text-2xl text-brand-charcoal">
              Virtual Attendance for Family & Diaspora
            </h3>
            <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
              {isLive
                ? `The memorial service for ${honoreeName} is currently streaming live. Join the congregation virtually.`
                : isEnded
                ? `The live broadcast has concluded. A recording of the memorial service is available to rewatch.`
                : `For beloved friends and family abroad or unable to travel to Nairobi, the entire thanksgiving service will be broadcast live.`}
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <a
              href={livestreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-[0.16em] transition-all ${
                isLive
                  ? 'bg-red-700 hover:bg-red-800 text-white shadow-md'
                  : 'bg-[#68574B] hover:bg-[#52443a] text-white shadow-sm'
              }`}
            >
              <Video size={15} />
              <span>{isLive ? 'Watch Live Stream' : isEnded ? 'View Recording' : 'Open Stream Link'}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
