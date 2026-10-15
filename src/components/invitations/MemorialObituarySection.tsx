'use client';

import React from 'react';
import { SectionIntro, DrawLine } from '@/components/animation/MotionToolkit';
import { BookOpen } from 'lucide-react';

interface MemorialObituarySectionProps {
  honoreeName: string;
  biography: string;
  birthDate?: string;
  deathDate?: string;
  epitaph?: string;
}

export function MemorialObituarySection({
  honoreeName,
  biography,
  birthDate,
  deathDate,
  epitaph,
}: MemorialObituarySectionProps) {
  if (!biography) return null;

  return (
    <section className="w-full px-4 sm:px-6 py-16 sm:py-24 bg-transparent border-t border-[rgba(39,38,32,0.14)]" id="memorial-obituary">
      <div className="max-w-3xl mx-auto">
        <SectionIntro
          eyebrow="In Loving Memory"
          title="Life & Legacy"
          subtitle={`Honouring the journey and enduring impact of ${honoreeName}.`}
          accentColor="#68574B"
        />

        {/* Milestone Lifespan Dates */}
        {(birthDate || deathDate) && (
          <div className="flex items-center justify-center gap-6 mb-10 text-center">
            {birthDate && (
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#68574B] font-semibold block">
                  Sunrise
                </span>
                <span className="font-serif text-lg sm:text-xl text-brand-charcoal">{birthDate}</span>
              </div>
            )}
            <span className="text-[#B99A62] text-sm">✦</span>
            {deathDate && (
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#68574B] font-semibold block">
                  Sunset
                </span>
                <span className="font-serif text-lg sm:text-xl text-brand-charcoal">{deathDate}</span>
              </div>
            )}
          </div>
        )}

        <DrawLine color="rgba(39, 38, 32, 0.14)" />

        {/* Biography Content */}
        <div className="py-8 space-y-5">
          <p className="font-serif text-base sm:text-lg text-brand-charcoal leading-relaxed whitespace-pre-line text-justify sm:text-left">
            {biography}
          </p>
        </div>

        {/* Epitaph / Scripture Card */}
        {epitaph && (
          <div className="mt-6 p-6 sm:p-8 rounded-sm border border-[rgba(39,38,32,0.14)] bg-[#FBF8F1] text-center">
            <BookOpen size={18} className="mx-auto text-[#B99A62] mb-3" />
            <blockquote className="font-serif text-sm sm:text-base italic text-brand-charcoal leading-relaxed max-w-lg mx-auto">
              {epitaph}
            </blockquote>
          </div>
        )}
      </div>
    </section>
  );
}
