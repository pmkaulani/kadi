'use client';

import React from 'react';
import { SectionIntro, StaggerGroup, StaggerItem } from '@/components/animation/MotionToolkit';
import { MapPin, Navigation, CalendarPlus, Clock, Car, Palette, ArrowUpRight } from 'lucide-react';

interface VenueLocation {
  name: string;
  time?: string;
  address: string;
  mapUrl?: string;
  directions?: string;
  dressCode?: string;
  dressCodeColors?: string[];
  image?: string;
}

export function CeremonyReceptionSection({
  ceremony,
  reception,
  eventTitle,
  eventDate,
}: {
  ceremony?: VenueLocation;
  reception?: VenueLocation;
  eventTitle: string;
  eventDate: string;
}) {
  if (!ceremony && !reception) return null;

  const isSameVenue =
    ceremony && reception && ceremony.address.trim().toLowerCase() === reception.address.trim().toLowerCase();

  const handleDownloadICS = (venueName: string, address: string, time?: string) => {
    const escapeICS = (v: string) => v.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const startIso = '20261114T100000Z';
    const endIso = '20261114T210000Z';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kadi Digital Invitations//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${escapeICS(eventTitle)}`,
      `DESCRIPTION:${escapeICS(`Wedding celebration at ${venueName}. ${time || ''}`)}`,
      `LOCATION:${escapeICS(`${venueName}, ${address}`)}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 bg-transparent border-t border-[rgba(39,38,32,0.14)]">
      <div className="max-w-5xl mx-auto">
        <SectionIntro
          eyebrow="Where & When"
          title={isSameVenue ? 'Ceremony & Reception' : 'The Locations'}
          subtitle="Join us for the exchange of vows and the evening celebration."
        />

        <StaggerGroup className={`grid gap-8 mt-12 ${!isSameVenue && reception ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
          {/* Ceremony Card */}
          {ceremony && (
            <StaggerItem>
              <div className="border border-[rgba(39,38,32,0.18)] bg-[#FBF8F1] p-6 sm:p-9 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[rgba(39,38,32,0.14)]">
                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#934638]">
                      {isSameVenue ? 'Ceremony & Reception' : 'The Solemn Ceremony'}
                    </span>
                    {ceremony.time && (
                      <span className="text-xs font-serif text-brand-slate flex items-center gap-1.5">
                        <Clock size={13} className="text-[#B99A62]" />
                        {ceremony.time}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-brand-charcoal mt-5">
                    {ceremony.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-brand-slate flex items-start gap-2">
                    <MapPin size={15} className="text-[#934638] shrink-0 mt-0.5" />
                    <span>{ceremony.address}</span>
                  </p>

                  {ceremony.directions && (
                    <div className="mt-5 p-3.5 bg-[#EDE5D9]/50 border-l-2 border-[#B99A62] text-xs text-brand-slate leading-relaxed">
                      <Car size={14} className="inline mr-1.5 text-[#934638]" />
                      {ceremony.directions}
                    </div>
                  )}

                  {ceremony.dressCode && (
                    <div className="mt-5 pt-4 border-t border-[rgba(39,38,32,0.12)]">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-slate block mb-1.5 flex items-center gap-1">
                        <Palette size={12} className="text-[#B99A62]" />
                        Dress Code: {ceremony.dressCode}
                      </span>
                      {ceremony.dressCodeColors && ceremony.dressCodeColors.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-brand-slate/80">Palette:</span>
                          {ceremony.dressCodeColors.map((color, idx) => (
                            <span
                              key={idx}
                              className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-5 border-t border-[rgba(39,38,32,0.14)] flex flex-wrap items-center gap-3">
                  <a
                    href={ceremony.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${ceremony.name}, ${ceremony.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kadi-button !min-h-[38px] !py-2 !px-4 text-xs"
                  >
                    <Navigation size={13} />
                    <span>Open in Maps</span>
                    <ArrowUpRight size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDownloadICS(ceremony.name, ceremony.address, ceremony.time)}
                    className="kadi-button kadi-button--quiet !min-h-[38px] !py-2 !px-4 text-xs"
                  >
                    <CalendarPlus size={13} />
                    <span>Add to Calendar</span>
                  </button>
                </div>
              </div>
            </StaggerItem>
          )}

          {/* Separate Reception Card */}
          {!isSameVenue && reception && (
            <StaggerItem>
              <div className="border border-[rgba(39,38,32,0.18)] bg-[#FBF8F1] p-6 sm:p-9 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[rgba(39,38,32,0.14)]">
                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#934638]">
                      The Evening Reception
                    </span>
                    {reception.time && (
                      <span className="text-xs font-serif text-brand-slate flex items-center gap-1.5">
                        <Clock size={13} className="text-[#B99A62]" />
                        {reception.time}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-brand-charcoal mt-5">
                    {reception.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-brand-slate flex items-start gap-2">
                    <MapPin size={15} className="text-[#934638] shrink-0 mt-0.5" />
                    <span>{reception.address}</span>
                  </p>

                  {reception.directions && (
                    <div className="mt-5 p-3.5 bg-[#EDE5D9]/50 border-l-2 border-[#B99A62] text-xs text-brand-slate leading-relaxed">
                      <Car size={14} className="inline mr-1.5 text-[#934638]" />
                      {reception.directions}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-5 border-t border-[rgba(39,38,32,0.14)] flex flex-wrap items-center gap-3">
                  <a
                    href={reception.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${reception.name}, ${reception.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kadi-button !min-h-[38px] !py-2 !px-4 text-xs"
                  >
                    <Navigation size={13} />
                    <span>Open in Maps</span>
                    <ArrowUpRight size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDownloadICS(reception.name, reception.address, reception.time)}
                    className="kadi-button kadi-button--quiet !min-h-[38px] !py-2 !px-4 text-xs"
                  >
                    <CalendarPlus size={13} />
                    <span>Add to Calendar</span>
                  </button>
                </div>
              </div>
            </StaggerItem>
          )}
        </StaggerGroup>
      </div>
    </section>
  );
}
