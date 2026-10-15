'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/* --------------------------------------------------------------------------
   Section Animation Toolkit — Accessible, Coherent Motion Primitives
   -------------------------------------------------------------------------- */

/**
 * RevealText — Staggers words gracefully without breaking screen-reader flow.
 */
export function RevealText({
  text,
  className = '',
  tag: Tag = 'h2',
  delay = 0,
}: {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        transition={{ staggerChildren: 0.04, delayChildren: delay }}
        className="inline"
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block mr-[0.25em]"
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * RevealImage — Cinematic clip wipe and smooth image zoom on scroll entry.
 */
export function RevealImage({
  src,
  alt,
  className = '',
  aspectRatio = '3/4',
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={`overflow-hidden bg-[#DDD0BE] ${className}`} style={{ aspectRatio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <motion.div
      className={`overflow-hidden relative bg-[#DDD0BE] ${className}`}
      style={{ aspectRatio }}
      initial={{ clipPath: 'inset(10% 0% 10% 0%)', opacity: 0.7 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
      />
    </motion.div>
  );
}

/**
 * DrawLine — Expanding rule or decorative spine on scroll entry.
 */
export function DrawLine({
  className = '',
  orientation = 'horizontal',
  color = 'currentColor',
}: {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  color?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className={className}
        style={{
          backgroundColor: color,
          width: orientation === 'horizontal' ? '100%' : '2px',
          height: orientation === 'horizontal' ? '1px' : '100%',
        }}
      />
    );
  }

  return (
    <motion.div
      className={className}
      initial={orientation === 'horizontal' ? { scaleX: 0 } : { scaleY: 0 }}
      whileInView={orientation === 'horizontal' ? { scaleX: 1 } : { scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: color,
        transformOrigin: orientation === 'horizontal' ? 'left center' : 'top center',
        width: orientation === 'horizontal' ? '100%' : '2px',
        height: orientation === 'horizontal' ? '1px' : '100%',
      }}
    />
  );
}

/**
 * StaggerGroup — Orchestrates staggered entrance for child cards or list items.
 */
export function StaggerGroup({
  children,
  className = '',
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem — Child of StaggerGroup.
 */
export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * SectionIntro — Distinctive editorial header for an invitation section.
 */
export function SectionIntro({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  accentColor = '#934638',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  accentColor?: string;
}) {
  const alignClass =
    align === 'left' ? 'text-left items-start' : align === 'right' ? 'text-right items-end' : 'text-center items-center';

  return (
    <div className={`flex flex-col ${alignClass} mb-10 max-w-2xl mx-auto`}>
      {eyebrow && (
        <span
          className="text-[9px] font-bold uppercase tracking-[0.24em] mb-3"
          style={{ color: accentColor }}
        >
          {eyebrow}
        </span>
      )}
      <RevealText
        text={title}
        tag="h2"
        className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.04em] text-brand-charcoal leading-none"
      />
      {subtitle && (
        <p className="mt-3 text-xs sm:text-sm text-brand-slate leading-relaxed max-w-lg">
          {subtitle}
        </p>
      )}
      <div className="w-10 h-px mt-4" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
    </div>
  );
}

/**
 * CountdownTimer — Real-time computed countdown from event date/time.
 */
export function CountdownTimer({
  targetDate,
  accentColor = '#B99A62',
}: {
  targetDate: string;
  accentColor?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    function calculate() {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (isNaN(target) || diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className="text-center py-3">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-slate">
          The Celebration Has Begun
        </span>
      </div>
    );
  }

  const units = [
    { label: 'Days', val: timeLeft.days },
    { label: 'Hours', val: timeLeft.hours },
    { label: 'Mins', val: timeLeft.minutes },
    { label: 'Secs', val: timeLeft.seconds },
  ];

  return (
    <div
      className="inline-flex items-center gap-3 sm:gap-6 py-3 px-5 sm:px-7 rounded-sm border border-[rgba(39,38,32,0.14)] bg-[#FBF8F1]/70 backdrop-blur-sm"
      role="timer"
      aria-label="Time until event"
    >
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="flex flex-col items-center min-w-[36px] sm:min-w-[48px]">
            <span
              className="font-serif text-xl sm:text-3xl font-medium tracking-tight text-brand-charcoal"
              style={{ color: i === 0 ? accentColor : undefined }}
            >
              {String(u.val).padStart(2, '0')}
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-brand-slate mt-0.5">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-brand-slate/40 text-xs font-serif select-none">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Accessible Full-Screen Photo Lightbox with keyboard navigation.
 */
export function GalleryLightbox({
  photos,
  selectedIndex,
  onClose,
  onSelectIndex,
}: {
  photos: string[];
  selectedIndex: number | null;
  onClose: () => void;
  onSelectIndex: (idx: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onSelectIndex((selectedIndex! + 1) % photos.length);
      if (e.key === 'ArrowLeft') onSelectIndex((selectedIndex! - 1 + photos.length) % photos.length);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, photos.length, onClose, onSelectIndex]);

  if (selectedIndex === null) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[100] flex items-center justify-between p-4 sm:p-8 bg-[#181312]/96 text-white backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo viewer"
        className="absolute top-5 right-5 p-2 rounded-full border border-white/20 hover:border-white/60 text-white hover:bg-white/10 transition-colors z-10"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelectIndex((selectedIndex - 1 + photos.length) % photos.length);
        }}
        aria-label="Previous photo"
        className="p-3 rounded-full border border-white/20 hover:border-white/60 text-white hover:bg-white/10 transition-colors z-10 shrink-0"
      >
        <ChevronLeft size={22} />
      </button>

      <div
        className="max-h-[85vh] max-w-[85vw] flex flex-col items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[selectedIndex]}
          alt={`Gallery item ${selectedIndex + 1}`}
          className="max-h-[75vh] max-w-full object-contain rounded-sm shadow-2xl"
        />
        <div className="mt-4 flex items-center justify-between w-full text-xs text-white/70">
          <span>{selectedIndex + 1} of {photos.length}</span>
          <span className="text-[10px] uppercase tracking-widest text-white/50">Esc to close · Arrow keys to navigate</span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelectIndex((selectedIndex + 1) % photos.length);
        }}
        aria-label="Next photo"
        className="p-3 rounded-full border border-white/20 hover:border-white/60 text-white hover:bg-white/10 transition-colors z-10 shrink-0"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}

/**
 * ScrollParallax — Measured subtle vertical drift (capped at 14–20px on mobile)
 * Prevents disorientation while providing noticeable depth.
 */
export function ScrollParallax({
  children,
  className = '',
  offset = 16,
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/**
 * ChapterEntrance — Cinematic section curtain entrance with paper elevation
 */
export function ChapterEntrance({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * MaskReveal — Curtain/mask reveal for hero images and title headers
 */
export function MaskReveal({
  children,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialClip =
    direction === 'up'
      ? 'inset(100% 0 0 0)'
      : direction === 'down'
      ? 'inset(0 0 100% 0)'
      : direction === 'left'
      ? 'inset(0 0 0 100%)'
      : 'inset(0 100% 0 0)';

  return (
    <motion.div
      className={className}
      initial={{ clipPath: initialClip, opacity: 0.7 }}
      whileInView={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

