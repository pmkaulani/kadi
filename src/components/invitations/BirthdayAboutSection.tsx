'use client';

import React from 'react';
import Image from 'next/image';
import { SectionIntro, DrawLine, StaggerGroup, StaggerItem } from '@/components/animation/MotionToolkit';
import { Sparkles, Quote, Award } from 'lucide-react';

interface BirthdayAboutSectionProps {
  celebrantName: string;
  milestoneAge?: number;
  bio?: string;
  facts?: string[];
  heading?: string;
  heroImage?: string;
}

export function BirthdayAboutSection({
  celebrantName,
  milestoneAge,
  bio,
  facts = [],
  heading = 'The Man of the Moment',
  heroImage,
}: BirthdayAboutSectionProps) {
  if (!bio && (!facts || facts.length === 0)) return null;

  return (
    <section className="w-full px-4 sm:px-6 py-16 sm:py-24 bg-transparent border-t border-[rgba(39,38,32,0.14)]" id="about-celebrant">
      <div className="max-w-5xl mx-auto">
        <SectionIntro
          eyebrow="A Few Words"
          title={heading}
          subtitle={`Celebrating the life, laughter, and wisdom of ${celebrantName}.`}
          accentColor="#934638"
        />

        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Milestone Age & Portrait Column */}
          <div className="md:col-span-5 flex flex-col items-center text-center">
            <div className="relative p-6 sm:p-8 rounded-sm border border-[rgba(39,38,32,0.16)] bg-[#FBF8F1] shadow-sm w-full max-w-sm">
              <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#934638] block mb-2">
                Milestone Year
              </span>
              {milestoneAge && (
                <div className="font-serif text-7xl sm:text-8xl font-bold tracking-tighter text-[#272620] leading-none mb-3">
                  {milestoneAge}
                  <span className="text-2xl font-serif text-[#B99A62] ml-1 font-normal italic">th</span>
                </div>
              )}
              <h3 className="font-serif text-2xl text-brand-charcoal">{celebrantName}</h3>
              <p className="text-xs text-brand-slate mt-1 font-serif italic">
                A lifetime of memories, another chapter begins.
              </p>

              {heroImage && (
                <div className="mt-5 overflow-hidden rounded-sm border border-[rgba(39,38,32,0.1)] aspect-square bg-[#DDD0BE] relative">
                  <Image
                    src={heroImage}
                    alt={celebrantName}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Biography & Facts Column */}
          <div className="md:col-span-7 space-y-6">
            {bio && (
              <div className="relative pl-6 border-l-2 border-[#934638]/40">
                <Quote className="text-[#934638]/30 mb-2" size={24} />
                <p className="text-base sm:text-lg font-serif text-brand-charcoal leading-relaxed italic">
                  {bio}
                </p>
              </div>
            )}

            {facts && facts.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[rgba(39,38,32,0.1)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#934638] mb-4 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#B99A62]" /> Things to know about the celebrant
                </p>
                <StaggerGroup className="grid sm:grid-cols-2 gap-3">
                  {facts.map((fact, idx) => (
                    <StaggerItem key={`${fact}-${idx}`}>
                      <div className="p-3.5 rounded-sm border border-[rgba(39,38,32,0.12)] bg-[#FBF8F1]/60 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#B99A62]/20 text-[#B99A62] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-brand-charcoal leading-snug">{fact}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
