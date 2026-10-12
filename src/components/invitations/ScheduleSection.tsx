import React from 'react';
import { Clock } from 'lucide-react';

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

interface ScheduleSectionProps {
  items?: ScheduleItem[];
}

export function ScheduleSection({
  items = [
    {
      time: '1:30 PM',
      title: 'Guest Arrival & Seating',
      description: 'Guests arrive and are ushered to the garden ceremony lawn.',
    },
    {
      time: '2:00 PM',
      title: 'Ceremony & Exchange of Vows',
      description: 'Processional, wedding vows, and ceremonial blessing.',
    },
    {
      time: '3:30 PM',
      title: 'Cocktails & Garden Photos',
      description: 'Signature mocktails, canapés, and bridal party photographs.',
    },
    {
      time: '5:30 PM',
      title: 'Reception & Feast',
      description: 'Dinner banquet, heartfelt speeches, and cake cutting.',
    },
    {
      time: '8:00 PM',
      title: 'First Dance & Celebration',
      description: 'Music, dancing, and evening festivities.',
    },
  ],
}: ScheduleSectionProps) {
  return (
    <section className="w-full p-6 sm:p-12 bg-paper-grain border-t border-slate-100">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-slate bg-slate-200/60 px-3 py-1 rounded-full">
            Programme
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal mt-3">
            Schedule of Events
          </h2>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
          {items.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full bg-brand-purple border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-125" />

              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-purple">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.time}</span>
              </div>
              <h3 className="text-base font-serif font-bold text-brand-charcoal mt-1">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs sm:text-sm text-brand-slate mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
