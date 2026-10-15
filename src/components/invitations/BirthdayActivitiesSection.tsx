'use client';

import React from 'react';
import { SectionIntro, StaggerGroup, StaggerItem, DrawLine } from '@/components/animation/MotionToolkit';
import { GlassWater, UtensilsCrossed, Cake, PartyPopper, Clock } from 'lucide-react';

interface BirthdayActivitiesSectionProps {
  activities?: Array<{
    title: string;
    description: string;
    time?: string;
  }>;
  menu?: {
    items: string[];
    drinksPolicy?: string;
    cakeNote?: string;
  };
}

export function BirthdayActivitiesSection({
  activities = [],
  menu,
}: BirthdayActivitiesSectionProps) {
  if ((!activities || activities.length === 0) && !menu) return null;

  return (
    <section className="w-full px-4 sm:px-6 py-16 sm:py-24 bg-transparent border-t border-[rgba(39,38,32,0.14)]" id="birthday-activities">
      <div className="max-w-5xl mx-auto">
        <SectionIntro
          eyebrow="The Celebration"
          title="What to Look Forward To"
          subtitle="An evening designed for delicious bites, joyous toasts, and effortless dancing."
          accentColor="#934638"
        />

        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          {/* Activities / Flow Column */}
          {activities && activities.length > 0 && (
            <div className={menu ? 'md:col-span-7' : 'md:col-span-12 max-w-3xl mx-auto'}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#934638] mb-6 flex items-center gap-2">
                <PartyPopper size={14} className="text-[#B99A62]" /> The Evening&apos;s Flow
              </h3>
              <DrawLine color="rgba(39, 38, 32, 0.16)" />
              <StaggerGroup>
                {activities.map((act, idx) => (
                  <StaggerItem key={`${act.title}-${idx}`}>
                    <div className="py-4 border-b border-[rgba(39,38,32,0.12)] flex items-start gap-4">
                      {act.time && (
                        <div className="pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#934638] flex items-center gap-1 min-w-[76px] shrink-0">
                          <Clock size={12} className="text-[#B99A62]" />
                          <span>{act.time}</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-serif text-lg sm:text-xl text-brand-charcoal">{act.title}</h4>
                        <p className="text-xs sm:text-sm text-brand-slate mt-1 leading-relaxed">{act.description}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          )}

          {/* Feast & Libations Column */}
          {menu && (
            <div className={activities && activities.length > 0 ? 'md:col-span-5' : 'md:col-span-12 max-w-xl mx-auto'}>
              <div className="p-6 sm:p-7 rounded-sm border border-[rgba(39,38,32,0.16)] bg-[#FBF8F1] shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#934638] mb-4 flex items-center gap-2">
                  <UtensilsCrossed size={14} className="text-[#B99A62]" /> Bites & Libations
                </h3>

                {menu.items && menu.items.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <p className="text-[11px] font-serif uppercase tracking-wider text-brand-slate font-semibold">
                      Featured Menu
                    </p>
                    <ul className="space-y-1.5">
                      {menu.items.map((item, i) => (
                        <li key={i} className="text-xs sm:text-sm text-brand-charcoal flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B99A62] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {menu.drinksPolicy && (
                  <div className="pt-4 border-t border-[rgba(39,38,32,0.1)] mb-4">
                    <p className="text-[11px] font-serif uppercase tracking-wider text-brand-slate font-semibold flex items-center gap-1.5 mb-1">
                      <GlassWater size={13} className="text-[#934638]" /> Refreshments
                    </p>
                    <p className="text-xs text-brand-slate leading-relaxed">{menu.drinksPolicy}</p>
                  </div>
                )}

                {menu.cakeNote && (
                  <div className="pt-4 border-t border-[rgba(39,38,32,0.1)]">
                    <p className="text-[11px] font-serif uppercase tracking-wider text-brand-slate font-semibold flex items-center gap-1.5 mb-1">
                      <Cake size={13} className="text-[#B99A62]" /> The Cake
                    </p>
                    <p className="text-xs text-brand-slate leading-relaxed italic">{menu.cakeNote}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
