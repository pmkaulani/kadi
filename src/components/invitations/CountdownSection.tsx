'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Clock, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import {
  parseEventDateTime,
  calculateCountdown,
  type CountdownState,
} from '@/lib/countdown/timer';
import { AddToCalendarDropdown } from '@/components/invitations/AddToCalendarDropdown';
import type { CalendarEventDefinition } from '@/lib/calendar/types';

export interface CountdownSectionProps {
  eventDate: string;
  eventTime?: string;
  startIso?: string;
  timezone?: string;
  label?: string;
  celebrants?: string;
  todayMessage?: string;
  passedMessage?: string;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

const WEEKDAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
] as const;

export function CountdownSection({
  eventDate,
  eventTime,
  startIso,
  timezone = 'Africa/Nairobi',
  label = 'Save the Date',
  celebrants,
  todayMessage = 'Today is the day! We celebrate together.',
  passedMessage = 'This celebration has concluded.',
}: CountdownSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date(0));

  // Resolve target date unambiguously
  const parsed = useMemo(() => {
    if (startIso) {
      const d = new Date(startIso);
      if (!isNaN(d.getTime())) {
        return { targetDate: d, isValid: true };
      }
    }
    return parseEventDateTime(eventDate, eventTime, timezone);
  }, [startIso, eventDate, eventTime, timezone]);

  // Set mounted and initial live clock tick
  useEffect(() => {
    setMounted(true);
    setNow(new Date());
  }, []);

  // Set up 1-second interval with cleanup
  useEffect(() => {
    if (!mounted || !parsed.isValid) return;

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted, parsed.isValid]);

  // Compute monthly calendar data
  const calendarData = useMemo(() => {
    if (!parsed.isValid) return null;
    const target = parsed.targetDate;
    const year = target.getFullYear();
    const month = target.getMonth();
    const eventDay = target.getDate();
    const monthName = MONTH_NAMES[month];
    const dayOfWeek = WEEKDAY_NAMES[target.getDay()];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday

    const leadingBlanks = Array.from({ length: firstDayWeekday }, () => null);
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalCells = [...leadingBlanks, ...monthDays];

    return {
      year,
      month,
      monthName,
      eventDay,
      dayOfWeek,
      daysInMonth,
      totalCells,
    };
  }, [parsed]);

  // Generate calendar export event definition
  const calendarEvent = useMemo<CalendarEventDefinition[]>(() => {
    if (!parsed.isValid) return [];
    const start = parsed.targetDate;
    const end = new Date(start.getTime() + 4 * 3600 * 1000); // 4-hour celebration duration default
    return [
      {
        title: celebrants ? `${celebrants} Celebration` : 'Celebration',
        start,
        end,
        description: `Save the date for the celebration${celebrants ? ` of ${celebrants}` : ''}.`,
      },
    ];
  }, [parsed, celebrants]);

  if (!parsed.isValid || !calendarData) {
    return null;
  }

  // Calculate current countdown state
  const countdown: CountdownState = calculateCountdown(parsed.targetDate, now, {
    label,
    todayMessage,
    passedMessage,
  });

  return (
    <section
      aria-label="Event Calendar and Countdown"
      className="py-10 sm:py-14 px-4 sm:px-6 bg-[rgba(39,38,32,0.02)] border-y border-[rgba(39,38,32,0.08)]"
    >
      <div className="max-w-md mx-auto text-center">
        {/* Header Label */}
        <div suppressHydrationWarning className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--event-primary,#934638)] font-semibold mb-2">
          {countdown.status === 'today' ? (
            <Sparkles className="w-3.5 h-3.5" />
          ) : (
            <CalendarIcon className="w-3.5 h-3.5" />
          )}
          <span>{countdown.label || 'Save the Date'}</span>
        </div>

        {/* Celebrants Title */}
        {celebrants && (
          <h3 className="font-serif text-xl sm:text-2xl text-[var(--event-ink,#272620)] mb-4 font-medium">
            {celebrants}
          </h3>
        )}

        {/* Luxury Stationery Calendar Sheet */}
        <div className="kadi-calendar-card rounded-2xl border border-[rgba(185,154,98,0.32)] bg-[#FFFDF9] p-5 sm:p-7 shadow-xs relative overflow-hidden transition-all">
          {/* Subtle Decorative Stationery Corner Accents */}
          <span
            className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#B99A62]/40 pointer-events-none"
            aria-hidden="true"
          />
          <span
            className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#B99A62]/40 pointer-events-none"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#B99A62]/40 pointer-events-none"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#B99A62]/40 pointer-events-none"
            aria-hidden="true"
          />

          {/* Month & Year Title */}
          <div className="mb-4">
            <h4 className="font-serif text-2xl sm:text-3xl text-[var(--event-primary,#934638)] font-semibold tracking-wide">
              {calendarData.monthName} {calendarData.year}
            </h4>
            <div className="text-center text-[#B99A62] text-xs my-1.5 select-none" aria-hidden="true">
              ✦ ─── ❦ ─── ✦
            </div>
          </div>

          {/* Weekday Column Headers */}
          <div className="grid grid-cols-7 mb-2 border-b border-[rgba(39,38,32,0.08)] pb-2">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="text-[11px] font-sans font-semibold tracking-wider text-[#8C8375] uppercase text-center select-none"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-y-2 sm:gap-y-2.5 text-center items-center">
            {calendarData.totalCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`blank-${idx}`}
                    className="h-10 sm:h-11"
                    aria-hidden="true"
                  />
                );
              }

              const isEventDay = day === calendarData.eventDay;

              return (
                <div
                  key={`day-${day}`}
                  className="relative flex items-center justify-center h-10 sm:h-11"
                >
                  {isEventDay ? (
                    <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 mx-auto">
                      {/* Authentic Hand-Drawn Calligraphy Loop encircling the date */}
                      <svg
                        viewBox="0 0 56 56"
                        fill="none"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-[52px] sm:h-[52px] pointer-events-none select-none"
                        aria-hidden="true"
                      >
                        {/* Organic calligraphic ring perfectly concentric to center (28, 28) */}
                        <path
                          d="M28 8 C 17 8.2 8.5 16.8 8 28 C 7.5 39.2 16.8 48 28 48.5 C 39.2 49 48 39.5 48 28 C 48 16.5 39 8 27.5 8 C 21 8 11.5 12.5 8.8 20"
                          stroke="var(--event-primary, #934638)"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-95"
                        />
                      </svg>
                      <span
                        className="font-serif text-base sm:text-lg font-bold text-[var(--event-primary,#934638)] leading-none flex items-center justify-center relative z-10 select-none"
                        aria-label={`Event Date: ${calendarData.monthName} ${day}`}
                      >
                        {day}
                      </span>
                    </div>
                  ) : (
                    <span className="font-serif text-xs sm:text-sm text-[#4A453E] select-none flex items-center justify-center w-8 h-8">
                      {day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Date Details & Countdown Status Below Calendar */}
          <div className="mt-5 pt-4 border-t border-[rgba(39,38,32,0.08)] flex flex-col items-center gap-2.5">
            <p className="font-serif text-sm sm:text-base text-[#272620] font-medium">
              {calendarData.dayOfWeek}, {calendarData.eventDay} {calendarData.monthName} {calendarData.year}
              {eventTime ? ` · ${eventTime}` : ''}
            </p>

            {countdown.status === 'today' ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{todayMessage}</span>
              </div>
            ) : countdown.status === 'passed' ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.04] border border-black/10 text-[#756F64] text-xs">
                <span>{passedMessage}</span>
              </div>
            ) : (
              /* Live Countdown Pill */
              <div
                suppressHydrationWarning
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(147,70,56,0.06)] border border-[rgba(147,70,56,0.2)] text-[var(--event-primary,#934638)] text-xs font-semibold tracking-wide"
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span suppressHydrationWarning>
                  {countdown.days > 0 ? `${countdown.days} ${countdown.days === 1 ? 'day' : 'days'}` : ''}
                  {countdown.days > 0 ? ' · ' : ''}
                  {mounted
                    ? `${String(countdown.hours).padStart(2, '0')}h ${String(countdown.minutes).padStart(2, '0')}m ${String(countdown.seconds).padStart(2, '0')}s`
                    : '--h --m --s'}
                </span>
              </div>
            )}

            {/* Quick Add to Calendar Action */}
            {calendarEvent.length > 0 && countdown.status !== 'passed' && (
              <div className="pt-1">
                <AddToCalendarDropdown
                  events={calendarEvent}
                  calendarName={celebrants}
                  variant="outline"
                  size="sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
