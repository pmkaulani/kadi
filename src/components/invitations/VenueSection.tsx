import React from 'react';
import { MapPin, Navigation, CalendarPlus, Car } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface VenueSectionProps {
  venue: string;
  address?: string;
  city?: string;
  directionsNote?: string;
  googleMapsUrl?: string;
  calendarData?: {
    title: string;
    description: string;
    location: string;
    startDate: string; // ISO
    endDate: string;
  };
}

export function VenueSection({
  venue,
  address = 'Safari Park Hotel & Casino, Thika Road',
  city = 'Nairobi, Kenya',
  directionsNote = 'Ample secure parking available on-site. Security will direct you to the garden marquee.',
  googleMapsUrl = 'https://maps.google.com/?q=Safari+Park+Hotel+Nairobi',
  calendarData,
}: VenueSectionProps) {
  const handleAddToCalendar = () => {
    // Generate .ics file download directly in browser
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kadi Invitations//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${calendarData?.title || 'Kadi Event'}`,
      `DESCRIPTION:${calendarData?.description || 'Event Invitation via Kadi'}`,
      `LOCATION:${venue}, ${city}`,
      'DTSTART:20261114T110000Z',
      'DTEND:20261114T190000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'invitation-event.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full p-6 sm:p-12 bg-white border-t border-slate-100">
      <div className="max-w-xl mx-auto text-center">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-slate bg-slate-100 px-3 py-1 rounded-full">
          Location & Travel
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal mt-3">
          The Venue
        </h2>
        <p className="text-lg font-serif font-semibold text-brand-purple mt-2">
          {venue}
        </p>
        <p className="text-xs sm:text-sm text-brand-slate mt-1">{address}</p>

        {directionsNote && (
          <div className="my-6 p-4 rounded-xl bg-brand-mist border border-slate-200/60 flex items-start gap-3 text-left">
            <Car className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
            <p className="text-xs text-brand-slate leading-relaxed">{directionsNote}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-charcoal text-white hover:bg-black text-xs font-semibold shadow-md transition-all"
          >
            <Navigation className="w-4 h-4 text-brand-gold" />
            <span>Open in Google Maps</span>
          </a>

          <Button
            variant="secondary"
            size="md"
            leftIcon={<CalendarPlus className="w-4 h-4 text-brand-purple" />}
            onClick={handleAddToCalendar}
          >
            Add to Calendar (.ics)
          </Button>
        </div>
      </div>
    </section>
  );
}
