'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateDefinition } from '@/lib/templates/types';
import { Button } from '@/components/ui/Button';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  FastForward,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export type AnimationPhase =
  | 'closed' // Sealed envelope
  | 'unsealing' // Seal reacts, flap starts opening
  | 'flap-open' // Flap folded back in 3D, liner visible
  | 'card-rising' // Card sliding upward out of pocket
  | 'settling' // Card expanding and settling into hero
  | 'settled'; // Fully revealed invitation with scrollable page

interface EnvelopeRendererProps {
  template: TemplateDefinition;
  guestName?: string;
  isDemo?: boolean;
  onPhaseChange?: (phase: AnimationPhase) => void;
  audioUrl?: string;
  children?: React.ReactNode; // Optional sections rendered below hero
}

export function EnvelopeRenderer({
  template,
  guestName,
  isDemo = false,
  onPhaseChange,
  audioUrl,
  children,
}: EnvelopeRendererProps) {
  const [phase, setPhase] = useState<AnimationPhase>('closed');
  const [isMuted, setIsMuted] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      setPhase('settled');
      onPhaseChange?.('settled');
    }
  }, [onPhaseChange]);

  // Audio setup
  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current
        .play()
        .then(() => setIsMuted(false))
        .catch(() => setIsMuted(true));
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  const handleOpenEnvelope = () => {
    if (phase !== 'closed') return;

    if (prefersReducedMotion) {
      setPhase('settled');
      onPhaseChange?.('settled');
      return;
    }

    // Coordinated physical sequence
    setPhase('unsealing');
    onPhaseChange?.('unsealing');

    // Step 1: Flap opens
    setTimeout(() => {
      setPhase('flap-open');
      onPhaseChange?.('flap-open');

      // Step 2: Card emerges out of envelope pocket
      setTimeout(() => {
        setPhase('card-rising');
        onPhaseChange?.('card-rising');

        // Step 3: Card expands and settles into hero
        setTimeout(() => {
          setPhase('settling');
          onPhaseChange?.('settling');

          // Step 4: Fully settled into scrollable invitation page
          setTimeout(() => {
            setPhase('settled');
            onPhaseChange?.('settled');
          }, 800);
        }, 900);
      }, 700);
    }, 400);
  };

  const handleSkip = () => {
    setPhase('settled');
    onPhaseChange?.('settled');
  };

  const handleReplay = () => {
    setPhase('closed');
    onPhaseChange?.('closed');
  };

  const isCardEmergingOrSettled =
    phase === 'card-rising' || phase === 'settling' || phase === 'settled';

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-start transition-colors duration-700 overflow-x-hidden"
      style={{ backgroundColor: template.palette.background }}
    >
      {/* Top Experience Controls Bar */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        {audioUrl && (
          <button
            onClick={toggleAudio}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/60 transition-all shadow-lg"
            title={isMuted ? 'Unmute music' : 'Mute music'}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-gold" />}
          </button>
        )}

        {phase !== 'settled' && (
          <button
            onClick={handleSkip}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all flex items-center gap-1.5 shadow-lg border border-white/10"
            aria-label="Skip animation to details"
          >
            <span>Skip to Details</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        )}

        {phase === 'settled' && (
          <button
            onClick={handleReplay}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all flex items-center gap-1.5 shadow-lg border border-white/10"
            aria-label="Replay opening reveal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        )}
      </div>

      {/* Main Animation Stage Area */}
      <main className="w-full flex flex-col items-center justify-center pt-8 pb-16 px-4">
        {phase !== 'settled' ? (
          /* ENVELOPE STAGE (Physical 3D layers) */
          <div className="relative w-full max-w-md min-h-[560px] flex items-center justify-center perspective-1500 py-12">
            {/* Ambient Shadow beneath Envelope */}
            <div className="absolute bottom-6 w-72 h-10 bg-black/40 blur-xl rounded-full transform -rotate-1 pointer-events-none" />

            {/* ENVELOPE CONTAINER */}
            <div
              className="relative w-[340px] sm:w-[380px] h-[250px] rounded-xl shadow-envelope-closed preserve-3d transition-all duration-500 cursor-pointer select-none"
              style={{ backgroundColor: template.palette.envelope }}
              onClick={phase === 'closed' ? handleOpenEnvelope : undefined}
            >
              {/* LAYER 1: Inner Envelope Back Wall with Decorative Liner Pattern */}
              <div
                className={`absolute inset-0 rounded-xl overflow-hidden border border-white/10 ${template.liner.className}`}
              >
                {/* Liner Sheen Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
              </div>

              {/* LAYER 2: THE PHYSICAL INVITATION CARD (Nested inside envelope pocket) */}
              <motion.div
                className="absolute left-4 right-4 h-[380px] rounded-2xl shadow-card-depth overflow-hidden border border-amber-900/10 flex flex-col preserve-3d z-10"
                style={{
                  backgroundColor: template.palette.cardBackground,
                  top: '-40px',
                }}
                initial={{ y: 0, rotate: 0, scale: 0.95 }}
                animate={
                  phase === 'card-rising'
                    ? { y: -180, rotate: -1.5, scale: 1, zIndex: 25 }
                    : phase === 'settling'
                    ? { y: -190, rotate: 0, scale: 1.02, zIndex: 35 }
                    : { y: 0, rotate: 0, scale: 0.95, zIndex: 5 }
                }
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Micro Card Preview while in envelope */}
                <div className="p-6 text-center flex flex-col items-center justify-between h-full bg-paper-grain">
                  <div className="w-12 h-0.5 bg-brand-gold/60 my-1" />
                  <p className="text-[10px] tracking-widest uppercase font-serif text-brand-slate">
                    {template.sampleData.hosts}
                  </p>
                  <h3 className="font-serif text-lg font-bold text-brand-charcoal mt-1 line-clamp-2">
                    {template.sampleData.title}
                  </h3>
                  <div className="w-full h-32 rounded-lg overflow-hidden my-2 shadow-inner border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={template.sampleData.heroImage}
                      alt={template.sampleData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[11px] font-medium text-brand-slate space-y-0.5">
                    <p>{template.sampleData.date}</p>
                    <p className="text-[10px] text-brand-charcoal/70">{template.sampleData.venue}</p>
                  </div>
                  <div className="w-12 h-0.5 bg-brand-gold/60 my-1" />
                </div>
              </motion.div>

              {/* LAYER 3: ENVELOPE FRONT POCKET (Hides bottom of card when seated inside) */}
              <div
                className="absolute inset-x-0 bottom-0 h-[210px] rounded-b-xl z-20 pointer-events-none overflow-hidden"
                style={{ backgroundColor: template.palette.envelope }}
              >
                {/* Slanted Side and Bottom Folds Geometry via SVG */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 380 210"
                  fill="none"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Left Triangle Flap */}
                  <path
                    d="M0 0 L190 135 L0 210 Z"
                    fill={template.palette.envelope}
                    fillOpacity="0.96"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                  {/* Right Triangle Flap */}
                  <path
                    d="M380 0 L190 135 L380 210 Z"
                    fill={template.palette.envelope}
                    fillOpacity="0.94"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                  {/* Bottom Triangle Flap */}
                  <path
                    d="M0 210 L190 110 L380 210 Z"
                    fill={template.palette.flap}
                    fillOpacity="0.98"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1"
                  />
                </svg>

                {/* Personalized Guest Label Plate on Front of Pocket */}
                {guestName && phase === 'closed' && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/95 rounded-lg shadow-md border border-amber-900/10 text-center pointer-events-auto">
                    <span className="text-[10px] tracking-wider uppercase text-slate-500 font-sans block">
                      Specially for
                    </span>
                    <span className="text-xs font-serif font-bold text-brand-charcoal">
                      {guestName}
                    </span>
                  </div>
                )}
              </div>

              {/* LAYER 4: 3D HINGED TOP FLAP */}
              <motion.div
                className="absolute inset-x-0 top-0 h-[155px] preserve-3d origin-top z-30 pointer-events-none"
                style={{
                  transformOrigin: 'top center',
                }}
                initial={{ rotateX: 0 }}
                animate={
                  phase === 'closed'
                    ? { rotateX: 0 }
                    : { rotateX: -180, zIndex: 0 }
                }
                transition={{
                  duration: 0.75,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {/* Flap Outer Front Surface */}
                <div className="absolute inset-0 backface-hidden">
                  <svg
                    className="w-full h-full filter drop-shadow-md"
                    viewBox="0 0 380 155"
                    fill="none"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 0 L190 150 L380 0 Z"
                      fill={template.palette.flap}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                    />
                  </svg>
                </div>

                {/* Flap Inner Reverse Surface (Reveals Liner when flipped back 180deg) */}
                <div
                  className={`absolute inset-0 backface-hidden overflow-hidden ${template.liner.className}`}
                  style={{
                    transform: 'rotateX(180deg)',
                  }}
                >
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 380 150"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 150 L190 0 L380 150 Z"
                      fill="url(#linerMask)"
                      stroke="rgba(255,255,255,0.1)"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* LAYER 5: WAX / METALLIC SEAL (Centrally positioned at the tip of the flap) */}
              <AnimatePresence>
                {phase === 'closed' || phase === 'unsealing' ? (
                  <motion.div
                    className="absolute left-1/2 top-[125px] -translate-x-1/2 z-40 cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEnvelope();
                    }}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={
                      phase === 'unsealing'
                        ? { scale: [1, 1.15, 0.8], opacity: [1, 1, 0] }
                        : { scale: 1, opacity: 1 }
                    }
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.35 }}
                  >
                    {/* Pulsing Hint Glow */}
                    <div className="absolute inset-0 rounded-full bg-brand-gold/40 animate-ping opacity-60" />

                    {/* Physical Seal Emboss */}
                    <div
                      className="relative w-14 h-14 rounded-full shadow-seal-emboss flex items-center justify-center transition-transform duration-200 group-hover:scale-105 active:scale-95 border-2 border-white/40"
                      style={{ backgroundColor: template.seal.color }}
                    >
                      <div className="w-11 h-11 rounded-full border border-dashed border-white/60 flex items-center justify-center">
                        <span
                          className="font-serif font-bold text-xs tracking-wider"
                          style={{ color: template.palette.sealIconColor }}
                        >
                          {template.seal.monogram || 'K'}
                        </span>
                      </div>
                    </div>

                    {/* Touch Prompt Label */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white tracking-widest uppercase border border-white/20 shadow-md">
                      Tap to Open
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        ) : null}

        {/* SETTLED INVITATION HERO CARD */}
        {phase === 'settled' && (
          <motion.article
            className="w-full max-w-2xl bg-paper-grain rounded-3xl shadow-2xl border border-amber-900/10 overflow-hidden text-brand-charcoal animate-in fade-in zoom-in-95 duration-500"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Editorial Top Border Accent */}
            <div
              className="h-2.5 w-full"
              style={{
                background: `linear-gradient(90deg, ${template.palette.primary}, ${template.palette.secondary}, ${template.palette.accent})`,
              }}
            />

            <div className="p-6 sm:p-12 text-center flex flex-col items-center">
              {/* Hosts Line */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-px bg-brand-gold" />
                <p className="text-xs uppercase tracking-widest font-serif text-brand-slate">
                  {template.sampleData.hosts}
                </p>
                <span className="w-6 h-px bg-brand-gold" />
              </div>

              {/* Invitation Subtitle / Request */}
              {template.sampleData.subtitle && (
                <p className="text-xs sm:text-sm italic font-serif text-brand-slate/90 max-w-md mb-2">
                  {template.sampleData.subtitle}
                </p>
              )}

              {/* Event Title / Celebrants */}
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-charcoal my-3 max-w-lg leading-tight">
                {template.sampleData.title}
              </h1>

              {/* Decorative Ribbon */}
              <div className="flex items-center justify-center my-4">
                <div className="w-16 h-px bg-slate-300" />
                <Sparkles className="w-4 h-4 text-brand-gold mx-3" />
                <div className="w-16 h-px bg-slate-300" />
              </div>

              {/* Real Event Hero Photograph */}
              <div className="w-full my-6 rounded-2xl overflow-hidden shadow-xl border-4 border-white max-h-[460px] relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={template.sampleData.heroImage}
                  alt={template.sampleData.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
              </div>

              {/* Essential Date, Time & Venue Block */}
              <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 my-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-brand-mist text-brand-purple flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-slate block">
                      Date
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-brand-charcoal">
                      {template.sampleData.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-brand-mist text-brand-purple flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-slate block">
                      Time
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-brand-charcoal">
                      {template.sampleData.time}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-start gap-3 pt-2 border-t border-slate-100">
                  <div className="p-2 rounded-xl bg-brand-mist text-brand-purple flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-slate block">
                      Location
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-brand-charcoal block">
                      {template.sampleData.venue}
                    </span>
                    <span className="text-xs text-brand-slate">
                      {template.sampleData.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Story / Tribute */}
              {template.sampleData.story && (
                <blockquote className="my-6 max-w-md text-xs sm:text-sm italic text-brand-slate font-serif border-l-2 border-brand-gold pl-4 py-1 text-left">
                  &ldquo;{template.sampleData.story}&rdquo;
                </blockquote>
              )}

              {/* Fast Scroll to RSVP CTA */}
              <div className="mt-4 flex flex-col items-center gap-3">
                <a
                  href="#rsvp-section"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-purple text-white font-medium shadow-md shadow-brand-purple/20 hover:bg-brand-purple-hover transition-all"
                >
                  <span>Respond to Invitation (RSVP)</span>
                  <ChevronDown className="w-4 h-4" />
                </a>
                <span className="text-[11px] text-brand-slate">
                  Scroll down for event schedule, directions & details
                </span>
              </div>
            </div>

            {/* Additional In-Depth Event Sections */}
            {children}
          </motion.article>
        )}
      </main>
    </div>
  );
}
