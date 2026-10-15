'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CalendarPlus, Download, ExternalLink, ChevronDown, Check } from 'lucide-react';
import type { CalendarEventDefinition } from '@/lib/calendar/types';
import { generateIcsCalendar } from '@/lib/calendar/ics';
import {
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  getYahooCalendarUrl,
  downloadIcsFile,
} from '@/lib/calendar/links';

interface AddToCalendarDropdownProps {
  events: CalendarEventDefinition[];
  calendarName?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function AddToCalendarDropdown({
  events,
  calendarName,
  variant = 'secondary',
  size = 'md',
  className = '',
}: AddToCalendarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (!events || events.length === 0) return null;

  const isMultiEvent = events.length > 1;
  const primaryEvent = events[0];

  const handleDownloadAllIcs = () => {
    const icsContent = generateIcsCalendar(events, {
      calendarName: calendarName || primaryEvent.title,
    });
    const filename = `${(calendarName || primaryEvent.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
    downloadIcsFile(filename, icsContent);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
    setIsOpen(false);
  };

  const handleDownloadSingleIcs = (event: CalendarEventDefinition) => {
    const icsContent = generateIcsCalendar(event, { calendarName: event.title });
    const filename = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
    downloadIcsFile(filename, icsContent);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
    setIsOpen(false);
  };

  const btnClasses =
    variant === 'primary'
      ? 'bg-[var(--event-primary,#934638)] text-white hover:opacity-90 shadow-xs'
      : variant === 'outline'
      ? 'border border-[rgba(39,38,32,0.2)] bg-transparent text-[var(--event-ink,#272620)] hover:bg-black/[0.03]'
      : 'bg-white border border-[rgba(39,38,32,0.15)] text-[var(--event-ink,#272620)] hover:bg-[#FAF8F5] shadow-xs';

  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-xs sm:text-sm';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all select-none ${btnClasses} ${sizeClasses}`}
      >
        {downloaded ? (
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
        ) : (
          <CalendarPlus className="w-4 h-4 shrink-0 text-[var(--event-primary,#934638)]" />
        )}
        <span>{downloaded ? 'Added to Calendar' : 'Add to Calendar'}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform opacity-70 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 max-w-[calc(100vw-3rem)] rounded-xl bg-white shadow-xl border border-[rgba(39,38,32,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-[rgba(39,38,32,0.06)] mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8375] block">
              Save Event Reminder
            </span>
            <span className="text-xs text-[#272620] font-medium block truncate">
              {isMultiEvent ? `${events.length} Distinct Itinerary Moments` : primaryEvent.title}
            </span>
          </div>

          <div className="space-y-0.5">
            {/* 1. Offline .ics Download */}
            <button
              type="button"
              onClick={handleDownloadAllIcs}
              className="w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between text-[#272620] hover:bg-[#FAF8F5] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-3.5 h-3.5 text-[#934638]" />
                <div>
                  <span className="font-semibold block">Apple Calendar / iCal (.ics)</span>
                  <span className="text-[10px] text-[#8C8375] block">
                    {isMultiEvent ? 'Full itinerary with all locations' : 'Works with iPhone & Mac'}
                  </span>
                </div>
              </div>
            </button>

            {/* 2. Google Calendar */}
            {isMultiEvent ? (
              <div className="pt-1 border-t border-[rgba(39,38,32,0.06)] mt-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#8C8375] block mb-1">
                  Google Calendar Options
                </span>
                {events.map((ev, idx) => (
                  <a
                    key={ev.id || idx}
                    href={getGoogleCalendarUrl(ev)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between text-[#272620] hover:bg-[#FAF8F5] transition-colors"
                  >
                    <span className="truncate pr-2">{ev.title}</span>
                    <ExternalLink className="w-3 h-3 text-[#8C8375] shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <a
                href={getGoogleCalendarUrl(primaryEvent)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between text-[#272620] hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <div>
                    <span className="font-semibold block">Google Calendar</span>
                    <span className="text-[10px] text-[#8C8375] block">Open in browser tab</span>
                  </div>
                </div>
              </a>
            )}

            {/* 3. Microsoft Outlook */}
            <a
              href={getOutlookCalendarUrl(primaryEvent)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between text-[#272620] hover:bg-[#FAF8F5] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                <div>
                  <span className="font-semibold block">Outlook / Office 365</span>
                  <span className="text-[10px] text-[#8C8375] block">
                    {isMultiEvent ? `Starts: ${primaryEvent.title}` : 'Open in Outlook Web'}
                  </span>
                </div>
              </div>
            </a>

            {/* 4. Yahoo Calendar */}
            <a
              href={getYahooCalendarUrl(primaryEvent)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between text-[#272620] hover:bg-[#FAF8F5] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                <div>
                  <span className="font-semibold block">Yahoo Calendar</span>
                  <span className="text-[10px] text-[#8C8375] block">Open in Yahoo Mail</span>
                </div>
              </div>
            </a>
          </div>

          {/* Multi-event individual download links */}
          {isMultiEvent && (
            <div className="pt-1.5 border-t border-[rgba(39,38,32,0.06)] mt-1.5">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#8C8375] block mb-1">
                Separate Event Files (.ics)
              </span>
              {events.map((ev, idx) => (
                <button
                  key={ev.id || idx}
                  type="button"
                  onClick={() => handleDownloadSingleIcs(ev)}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between text-[#272620] hover:bg-[#FAF8F5] transition-colors"
                >
                  <span className="truncate pr-2 font-medium">{ev.title}</span>
                  <Download className="w-3 h-3 text-[#8C8375] shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
