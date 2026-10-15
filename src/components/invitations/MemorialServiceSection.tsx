'use client';

import React from 'react';
import { SectionIntro, StaggerGroup, StaggerItem, DrawLine } from '@/components/animation/MotionToolkit';
import { Calendar, Clock, MapPin, ExternalLink, ScrollText } from 'lucide-react';

interface MemorialServiceItem {
  name: string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  mapUrl?: string;
  type: 'service' | 'burial' | 'viewing';
}

interface MemorialOrderItem {
  time?: string;
  item: string;
  participant?: string;
  notes?: string;
}

interface MemorialServiceSectionProps {
  services?: MemorialServiceItem[];
  orderOfService?: MemorialOrderItem[];
}

export function MemorialServiceSection({
  services = [],
  orderOfService = [],
}: MemorialServiceSectionProps) {
  if (services.length === 0 && orderOfService.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-6 py-16 sm:py-24 bg-transparent border-t border-[rgba(39,38,32,0.14)]" id="memorial-services">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Services / Venues */}
        {services.length > 0 && (
          <div>
            <SectionIntro
              eyebrow="Gatherings & Committal"
              title="Memorial Services"
              subtitle="Details for attending family and friends to pay their final respects."
              accentColor="#68574B"
            />

            <StaggerGroup className="grid md:grid-cols-2 gap-6">
              {services.map((svc, idx) => (
                <StaggerItem key={`${svc.name}-${idx}`}>
                  <div className="p-6 rounded-sm border border-[rgba(39,38,32,0.14)] bg-[#FBF8F1] shadow-sm flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5 rounded-sm bg-[#68574B]/10 text-[#68574B] inline-block mb-3">
                        {svc.type === 'burial' ? 'Committal' : svc.type === 'viewing' ? 'Viewing & Vigil' : 'Funeral Service'}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-brand-charcoal">{svc.name}</h3>

                      <div className="mt-4 space-y-2 text-xs sm:text-sm text-brand-slate">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-[#B99A62] shrink-0" />
                          <span>{svc.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#B99A62] shrink-0" />
                          <span>{svc.time}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-[#B99A62] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-brand-charcoal font-normal">{svc.venue}</strong>
                            {svc.address && <p className="text-xs text-brand-slate mt-0.5">{svc.address}</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {svc.mapUrl && (
                      <div className="mt-6 pt-4 border-t border-[rgba(39,38,32,0.1)]">
                        <a
                          href={svc.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#68574B] hover:text-brand-charcoal font-medium transition-colors"
                        >
                          <span>Open Google Maps Directions</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        )}

        {/* Order of Service */}
        {orderOfService.length > 0 && (
          <div className="max-w-3xl mx-auto pt-8">
            <div className="text-center mb-8">
              <span className="text-[9px] uppercase tracking-[0.24em] font-bold text-[#68574B] block mb-2">
                Programme
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-brand-charcoal">Order of Service</h3>
            </div>

            <DrawLine color="rgba(39, 38, 32, 0.14)" />

            <div className="divide-y divide-[rgba(39,38,32,0.1)]">
              {orderOfService.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-brand-slate font-serif min-w-[20px] text-right">
                      {idx + 1}.
                    </span>
                    <div>
                      <h4 className="font-serif text-sm sm:text-base text-brand-charcoal font-medium">{item.item}</h4>
                      {item.notes && <p className="text-xs text-brand-slate mt-0.5">{item.notes}</p>}
                    </div>
                  </div>
                  {item.participant && (
                    <span className="text-xs text-[#68574B] font-serif italic shrink-0 text-right">
                      {item.participant}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
