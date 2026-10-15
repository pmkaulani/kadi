import React from 'react';
import { Clock } from 'lucide-react';
import { StaggerGroup, StaggerItem, DrawLine } from '@/components/animation/MotionToolkit';

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  icon?: string;
  location?: string;
}
interface ScheduleSectionProps { items?: ScheduleItem[]; }

export function ScheduleSection({
  items = [
    { time: '1:30 PM', title: 'Guest arrival & seating', description: 'Guests arrive and are ushered to the garden ceremony lawn.' },
    { time: '2:00 PM', title: 'Ceremony & exchange of vows', description: 'Processional, wedding vows and ceremonial blessing.' },
    { time: '3:30 PM', title: 'Cocktails & garden photographs', description: 'Signature mocktails, canapés and photographs with family.' },
    { time: '5:30 PM', title: 'Reception & feast', description: 'Dinner, heartfelt speeches and cake cutting.' },
    { time: '8:00 PM', title: 'First dance & celebration', description: 'Music, dancing and evening festivities.' },
  ],
}: ScheduleSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-6 py-16 sm:py-24 bg-transparent border-t border-[rgba(39,38,32,0.14)]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#934638] mb-4">The order of the day</p>
          <h2 className="text-4xl sm:text-5xl font-serif font-medium tracking-[-.045em] leading-none text-brand-charcoal">A little look<br /><em>at what unfolds.</em></h2>
          <p className="text-sm text-brand-slate leading-relaxed mt-5 max-w-xs">We look forward to sharing each part of the day with you.</p>
          <div className="w-12 h-px bg-[#B99A62] mt-6 opacity-60" />
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <DrawLine color="rgba(39, 38, 32, 0.16)" />
          <StaggerGroup>
            {items.map((item, idx) => (
              <StaggerItem key={`${item.time}-${idx}`}>
                <article className="grid grid-cols-[88px_minmax(0,1fr)] sm:grid-cols-[115px_minmax(0,1fr)] gap-4 sm:gap-6 py-5 border-b border-[rgba(39,38,32,0.14)] group">
                  <div className="pt-1 text-[11px] font-semibold uppercase tracking-[.12em] text-[#934638] flex items-start gap-1.5">
                    <Clock size={13} className="mt-0.5 text-[#B99A62]" />
                    <span>{item.time}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-brand-charcoal leading-tight">{item.title}</h3>
                    {item.description && <p className="text-xs sm:text-sm text-brand-slate mt-2 leading-relaxed max-w-lg">{item.description}</p>}
                    {item.location && <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-[#B99A62]">{item.location}</span>}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
