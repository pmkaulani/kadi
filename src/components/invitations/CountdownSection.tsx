'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  parseEventDateTime,
  calculateCountdown,
  type CountdownState,
} from '@/lib/countdown/timer';

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

/**
 * Digit card that animates on value change, respecting user's reduced-motion preference.
 */
function DigitCard({
  value,
  label,
  accent = false,
  mounted = true,
}: {
  value: string | number;
  label: string;
  accent?: boolean;
  mounted?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const formatted = typeof value === 'number' ? String(value).padStart(2, '0') : value;

  return (
    <div className="p-3 sm:p-4 rounded-xl bg-white border border-[rgba(39,38,32,0.12)] shadow-xs flex flex-col items-center justify-center min-w-[70px] sm:min-w-[84px]">
      <div className="relative h-8 sm:h-10 flex items-center justify-center overflow-hidden w-full">
        {!mounted || shouldReduceMotion ? (
          <span
            suppressHydrationWarning
            className={`font-serif text-2xl sm:text-3xl font-semibold select-none ${
              accent ? 'text-[var(--event-primary,#934638)]' : 'text-[var(--event-ink,#272620)]'
            }`}
          >
            {mounted ? formatted : '--'}
          </span>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={formatted}
              suppressHydrationWarning
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`font-serif text-2xl sm:text-3xl font-semibold select-none ${
                accent ? 'text-[var(--event-primary,#934638)]' : 'text-[var(--event-ink,#272620)]'
              }`}
            >
              {formatted}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <span className="text-[10px] sm:text-xs text-[#756F64] uppercase tracking-wider font-sans font-medium mt-1">
        {label}
      </span>
    </div>
  );
}

export function CountdownSection({
  eventDate,
  eventTime,
  startIso,
  timezone = 'Africa/Nairobi',
  label = 'Counting down to the celebration',
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

  if (!parsed.isValid) {
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
      aria-label="Event Countdown"
      className="py-10 sm:py-14 px-4 sm:px-6 bg-[rgba(39,38,32,0.02)] border-y border-[rgba(39,38,32,0.08)]"
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Header Label */}
        <div suppressHydrationWarning className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--event-primary,#934638)] font-semibold mb-2.5">
          {countdown.status === 'today' ? (
            <Sparkles className="w-3.5 h-3.5" />
          ) : (
            <Clock className="w-3.5 h-3.5" />
          )}
          <span>{countdown.label}</span>
        </div>

        {/* Celebrants Title */}
        {celebrants && (
          <h3 className="font-serif text-xl sm:text-2xl text-[var(--event-ink,#272620)] mb-5 font-medium">
            {celebrants}
          </h3>
        )}

        {/* Status Display: Today / Passed / Upcoming */}
        {countdown.status === 'today' ? (
          <div className="p-6 rounded-2xl bg-white border border-[rgba(39,38,32,0.12)] shadow-xs max-w-md mx-auto space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-2xl">✨</span>
            <p className="font-serif text-xl text-[var(--event-ink,#272620)] font-medium">
              {todayMessage}
            </p>
            <p className="text-xs text-[#756F64]">
              The moment has arrived. Wishing everyone a blessed celebration!
            </p>
          </div>
        ) : countdown.status === 'passed' ? (
          <div className="p-6 rounded-2xl bg-white/70 border border-[rgba(39,38,32,0.08)] max-w-md mx-auto space-y-1.5">
            <p className="font-serif text-lg text-[#756F64] italic">
              {passedMessage}
            </p>
            <p className="text-xs text-[#8C8375]">
              Thank you to everyone who joined and shared in this milestone.
            </p>
          </div>
        ) : (
          /* Upcoming: 4-digit countdown grid */
          <div suppressHydrationWarning className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-md mx-auto">
            <DigitCard value={countdown.days} label="Days" mounted={mounted} />
            <DigitCard value={countdown.hours} label="Hours" mounted={mounted} />
            <DigitCard value={countdown.minutes} label="Mins" mounted={mounted} />
            <DigitCard value={countdown.seconds} label="Secs" accent mounted={mounted} />
          </div>
        )}
      </div>
    </section>
  );
}
