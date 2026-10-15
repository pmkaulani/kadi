'use client';

import React from 'react';
import { SectionIntro, DrawLine, RevealImage, StaggerGroup, StaggerItem } from '@/components/animation/MotionToolkit';
import { MapPin } from 'lucide-react';

interface StoryMilestone {
  yearOrDate: string;
  title: string;
  story: string;
  image?: string;
  location?: string;
}

export function StorySection({
  milestones,
  eyebrow = 'Our Story',
  title = 'How We Got Here',
  subtitle = 'A few chapters along the road that brought us to this celebration.',
}: {
  milestones?: StoryMilestone[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  if (!milestones || milestones.length === 0) return null;

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 bg-transparent border-t border-[rgba(39,38,32,0.14)]">
      <div className="max-w-4xl mx-auto">
        <SectionIntro eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="relative mt-12 sm:mt-16">
          {/* Timeline Center Spine on Desktop, Left on Mobile */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px]">
            <DrawLine orientation="vertical" color="rgba(185, 154, 98, 0.45)" />
          </div>

          <StaggerGroup className="space-y-12 sm:space-y-20">
            {milestones.map((m, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <StaggerItem key={`${m.yearOrDate}-${idx}`} className="relative">
                  <div
                    className={`flex flex-col sm:flex-row items-center gap-6 sm:gap-12 ${
                      isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                    }`}
                  >
                    {/* Content Column */}
                    <div className={`w-full sm:w-1/2 pl-10 sm:pl-0 ${isEven ? 'sm:text-right' : 'sm:text-left'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#934638] block mb-1">
                        {m.yearOrDate}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-brand-charcoal">
                        {m.title}
                      </h3>
                      {m.location && (
                        <p
                          className={`text-xs text-brand-slate/80 mt-1 flex items-center gap-1 ${
                            isEven ? 'sm:justify-end' : 'sm:justify-start'
                          }`}
                        >
                          <MapPin size={12} className="text-[#B99A62]" />
                          <span>{m.location}</span>
                        </p>
                      )}
                      <p className="mt-3 text-xs sm:text-sm text-brand-slate leading-relaxed">
                        {m.story}
                      </p>
                    </div>

                    {/* Timeline Node on Spine */}
                    <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#934638] bg-[#FBF8F1] z-10 shadow-sm" />

                    {/* Image Column */}
                    <div className="w-full sm:w-1/2 pl-10 sm:pl-0">
                      {m.image ? (
                        <div className="max-w-xs mx-auto sm:mx-0 shadow-md border border-[rgba(39,38,32,0.12)] bg-[#FBF8F1] p-2">
                          <RevealImage
                            src={m.image}
                            alt={m.title}
                            aspectRatio="4/3"
                            className="w-full"
                          />
                        </div>
                      ) : (
                        <div className="hidden sm:block" />
                      )}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
