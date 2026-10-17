'use client';

import React, { useState } from 'react';
import {
  Clock,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Check,
  Plus,
  ArrowUp,
  ExternalLink,
  MapPin,
  Calendar,
  Heart,
  Images,
  Send,
  Smartphone,
  HelpCircle,
} from 'lucide-react';
import type { DraftInvitationValues } from '@/components/invitations/DraftInvitationPreview';
import type { EventDesignEntity } from '@/lib/db/types';
import type { TemplateDefinition } from '@/lib/templates/types';
import {
  getDefaultInvitationSections,
  type InvitationSectionKey,
} from '@/lib/events/default-invitation-sections';

interface StationerySectionCardsProps {
  values: DraftInvitationValues;
  design: Partial<EventDesignEntity>;
  category: string;
  template: TemplateDefinition;
  cardBackground: string;
  palette: {
    primary: string;
    secondary: string;
    text: string;
    cardBackground: string;
  };
  onUpdateValues: <K extends keyof DraftInvitationValues>(key: K, value: DraftInvitationValues[K]) => void;
  onUpdateDesign: (patch: Partial<EventDesignEntity>) => void;
  onOpenPhotoRail?: () => void;
  onOpenStickerRail?: () => void;
  onScrollToTop?: () => void;
}

export function StationerySectionCards({
  values,
  design,
  category,
  template,
  cardBackground,
  palette,
  onUpdateValues,
  onUpdateDesign,
  onOpenPhotoRail,
  onOpenStickerRail,
  onScrollToTop,
}: StationerySectionCardsProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Resolved visible & ordered sections
  const defaultSections = getDefaultInvitationSections(category);
  const visibleSections = design.visibleSections || defaultSections;
  const sectionOrder = design.sectionOrder || defaultSections;

  // Active sections that are visible, in order
  const activeSections = sectionOrder.filter((s) => visibleSections.includes(s));
  const hiddenSections = sectionOrder.filter((s) => !visibleSections.includes(s));

  // Toggle visibility of a section
  const toggleSectionVisibility = (secKey: string) => {
    const isVisible = visibleSections.includes(secKey);
    const nextVisible = isVisible
      ? visibleSections.filter((s) => s !== secKey)
      : [...visibleSections, secKey];
    onUpdateDesign({ visibleSections: nextVisible });
  };

  // Move section up in order
  const moveSectionUp = (secKey: string) => {
    const idx = sectionOrder.indexOf(secKey);
    if (idx <= 0) return;
    const nextOrder = [...sectionOrder];
    const temp = nextOrder[idx - 1];
    nextOrder[idx - 1] = nextOrder[idx];
    nextOrder[idx] = temp;
    onUpdateDesign({ sectionOrder: nextOrder });
  };

  // Move section down in order
  const moveSectionDown = (secKey: string) => {
    const idx = sectionOrder.indexOf(secKey);
    if (idx === -1 || idx >= sectionOrder.length - 1) return;
    const nextOrder = [...sectionOrder];
    const temp = nextOrder[idx + 1];
    nextOrder[idx + 1] = nextOrder[idx];
    nextOrder[idx] = temp;
    onUpdateDesign({ sectionOrder: nextOrder });
  };

  const primaryColor = palette.primary || template.palette.primary || '#934638';
  const secondaryColor = palette.secondary || template.palette.secondary || '#B99A62';
  const textColor = palette.text || template.palette.text || '#272620';
  const bgColor = cardBackground || palette.cardBackground || template.palette.cardBackground || '#FCFAF7';

  // Floating subtle ghost toolbar for reordering and hiding without cluttering the paper
  const renderFloatingControls = (secKey: string, label: string) => {
    const isHovered = hoveredSection === secKey;
    return (
      <aside
        aria-label={`${label} controls`}
        className={`absolute -right-3 top-3 z-30 flex items-center gap-0.5 bg-[#1F1F1F]/90 backdrop-blur-md text-white/80 border border-white/15 px-1.5 py-0.5 rounded-full shadow-lg text-[10px] transition-all duration-200 select-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}
      >
        <span className="text-[9px] uppercase tracking-wider text-[#B99A62] font-sans px-1 font-semibold">
          {label}
        </span>
        <div className="w-[1px] h-2.5 bg-white/20 mx-0.5" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            moveSectionUp(secKey);
          }}
          title="Move section up"
          className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <ChevronUp size={11} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            moveSectionDown(secKey);
          }}
          title="Move section down"
          className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <ChevronDown size={11} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSectionVisibility(secKey);
          }}
          title="Hide section"
          className="p-1 hover:text-amber-300 hover:bg-white/10 rounded transition-colors"
        >
          <EyeOff size={11} />
        </button>
      </aside>
    );
  };

  // Delicate fleuron / divider between sections (no hard borders)
  const renderFleuronDivider = () => (
    <div className="w-full flex items-center justify-center gap-3 py-6 select-none opacity-60" aria-hidden="true">
      <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B99A62]/40" />
      <span className="text-[#B99A62] text-xs font-serif">✦ ─── ❦ ─── ✦</span>
      <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B99A62]/40" />
    </div>
  );

  return (
    <div
      className="w-[480px] rounded-2xl relative shadow-[0_24px_70px_rgba(0,0,0,0.85)] mt-4 p-8 sm:p-10 transition-all select-none"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {/* Authentic Paper Linen Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '8px 8px',
        }}
      />

      {/* Delicate Inner Margin Frame Rule */}
      <div className="absolute inset-4 border border-black/[0.06] pointer-events-none rounded-xl" />

      {/* ── 1. COUNTDOWN SECTION (PURE STATUESQUE TYPOGRAPHY, ZERO BOXES) ── */}
      <section
        id="canvas-section-countdown"
        onMouseEnter={() => setHoveredSection('countdown')}
        onMouseLeave={() => setHoveredSection(null)}
        className="relative text-center py-4 px-2 group"
      >
        {renderFloatingControls('countdown', 'Countdown')}

        {/* Italic Letterpress Quote / Label (Borderless In-Place Edit) */}
        <div className="mb-3">
          <input
            type="text"
            value={values.countdownLabel || 'Counting down with joy'}
            onChange={(e) => onUpdateValues('countdownLabel', e.target.value)}
            className="w-full text-center bg-transparent border-0 border-b border-transparent hover:border-black/20 focus:border-[#B99A62] text-sm sm:text-base font-serif italic text-black/75 focus:outline-none transition-colors p-0.5"
            placeholder="e.g. Counting down with joy"
            title="Click to edit countdown label"
          />
          <p
            className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.26em] mt-1"
            style={{ color: primaryColor }}
          >
            {values.date} <span>·</span> {values.time}
          </p>
        </div>

        {/* Floating Statuesque Numerals (NO BOXES, NO SHADOWS, NO RECTANGLES) */}
        <div className="flex items-baseline justify-center gap-5 sm:gap-7 py-2">
          {[
            { val: '28', label: 'Days' },
            { val: '14', label: 'Hours' },
            { val: '45', label: 'Minutes' },
            { val: '30', label: 'Seconds' },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.label}>
              <div className="flex flex-col items-center">
                <span
                  className="font-serif text-3xl sm:text-4xl font-light tracking-tight leading-none"
                  style={{ color: primaryColor }}
                >
                  {item.val}
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-black/45 font-sans mt-1.5 font-medium">
                  {item.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <span className="font-serif text-lg text-[#B99A62]/50 select-none self-start mt-1">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── 2. FLUID STATIONERY SECTIONS ───────────────────────────────── */}
      {activeSections.map((secKey) => {
        switch (secKey) {
          /* ── CEREMONY & RECEPTION (CLASSICAL ITINERARY TYPOGRAPHY) ── */
          case 'ceremony':
            return (
              <React.Fragment key={secKey}>
                {renderFleuronDivider()}
                <section
                  id="canvas-section-ceremony"
                  onMouseEnter={() => setHoveredSection(secKey)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="relative text-center py-4 px-2 space-y-6 group"
                >
                  {renderFloatingControls(secKey, 'Ceremony')}

                  <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-[#8C5E50]">
                    The Gathering
                  </p>

                  {/* Ceremony Moment */}
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-xl sm:text-2xl text-[#934638] font-normal tracking-wide">
                      The Ceremony
                    </h3>
                    <p className="font-serif italic text-xs sm:text-sm text-black/60">
                      Ten o'clock in the morning
                    </p>
                    <div className="max-w-xs mx-auto pt-0.5 space-y-0.5">
                      <input
                        type="text"
                        value={values.venue || 'Our Lady of the Rosary'}
                        onChange={(e) => onUpdateValues('venue', e.target.value)}
                        className="w-full text-center bg-transparent border-0 border-b border-transparent hover:border-black/20 focus:border-[#B99A62] text-xs sm:text-sm font-serif font-medium text-black/85 focus:outline-none transition-colors p-0.5"
                        placeholder="Ceremony Venue"
                      />
                      <input
                        type="text"
                        value={values.city || 'Ridgeways, Kiambu Road'}
                        onChange={(e) => onUpdateValues('city', e.target.value)}
                        className="w-full text-center bg-transparent border-0 border-b border-transparent hover:border-black/20 focus:border-[#B99A62] text-[11px] font-sans text-black/55 focus:outline-none transition-colors p-0.5"
                        placeholder="Address / Location"
                      />
                    </div>
                  </div>

                  {/* Classical Fleuron Ornament between Ceremony & Reception */}
                  <div className="text-[#B99A62]/60 text-xs select-none">❦</div>

                  {/* Reception Moment */}
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-xl sm:text-2xl text-[#934638] font-normal tracking-wide">
                      The Reception &amp; Dinner
                    </h3>
                    <p className="font-serif italic text-xs sm:text-sm text-black/60">
                      Half past one in the afternoon
                    </p>
                    <div className="max-w-xs mx-auto pt-0.5 space-y-0.5">
                      <p className="text-xs sm:text-sm font-serif font-medium text-black/85">
                        Windsor Golf &amp; Country Club
                      </p>
                      <p className="text-[11px] font-sans text-black/55">
                        Kigwa Ridge, Nairobi
                      </p>
                    </div>
                  </div>

                  {/* Understated Calendar Action Link */}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-serif italic text-[#8C5E50] hover:text-[#934638] transition-colors cursor-pointer border-b border-[#8C5E50]/30 hover:border-[#934638] pb-0.5">
                      <Calendar size={12} className="text-[#8C5E50]" />
                      <span>Add to calendar (.ics / Google)</span>
                    </span>
                  </div>
                </section>
              </React.Fragment>
            );

          /* ── VENUE & LOCATION (EDITORIAL ADDRESS & MAP LINK) ── */
          case 'venue':
            return (
              <React.Fragment key={secKey}>
                {renderFleuronDivider()}
                <section
                  id="canvas-section-venue"
                  onMouseEnter={() => setHoveredSection(secKey)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="relative text-center py-4 px-2 space-y-3 group"
                >
                  {renderFloatingControls(secKey, 'Venue')}

                  <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-[#8C5E50]">
                    Location &amp; Setting
                  </p>

                  <div className="max-w-sm mx-auto space-y-1">
                    <input
                      type="text"
                      value={values.venue}
                      onChange={(e) => onUpdateValues('venue', e.target.value)}
                      className="w-full text-center bg-transparent border-0 border-b border-transparent hover:border-black/20 focus:border-[#B99A62] font-serif text-xl sm:text-2xl text-black/85 font-normal focus:outline-none transition-colors p-0.5"
                      placeholder="Venue Name"
                    />
                    <input
                      type="text"
                      value={values.city}
                      onChange={(e) => onUpdateValues('city', e.target.value)}
                      className="w-full text-center bg-transparent border-0 border-b border-transparent hover:border-black/20 focus:border-[#B99A62] text-xs font-serif italic text-black/60 focus:outline-none transition-colors p-0.5"
                      placeholder="City or Region"
                    />
                  </div>

                  <p className="font-serif italic text-xs text-black/55 max-w-xs mx-auto">
                    Secured on-site parking &amp; valet services provided for all guests.
                  </p>

                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-serif text-[#0F766E] hover:text-[#0D5F58] border-b border-[#0F766E]/40 pb-0.5 cursor-pointer">
                      <MapPin size={12} />
                      <span>View Location on Google Maps</span>
                      <ExternalLink size={10} />
                    </span>
                  </div>
                </section>
              </React.Fragment>
            );

          /* ── OUR STORY / HOST NOTE (GENUINE LETTERPRESS ESSAY) ── */
          case 'story':
          case 'about':
            return (
              <React.Fragment key={secKey}>
                {renderFleuronDivider()}
                <section
                  id="canvas-section-story"
                  onMouseEnter={() => setHoveredSection(secKey)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="relative text-center py-4 px-2 space-y-3 group"
                >
                  {renderFloatingControls(secKey, category === 'birthday' ? 'About' : 'Our Story')}

                  <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-[#8C5E50]">
                    {category === 'birthday' ? 'The Honouree' : 'A Note From The Hosts'}
                  </p>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#934638] font-normal">
                    {category === 'birthday' ? 'A Milestone Celebration' : 'Our Story'}
                  </h3>

                  {/* Seamless Editorial Letterpress Textarea (Zero Box, Zero Border) */}
                  <div className="relative max-w-sm mx-auto pt-1">
                    <textarea
                      rows={5}
                      value={values.story || ''}
                      onChange={(e) => onUpdateValues('story', e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-transparent hover:border-black/15 focus:border-[#B99A62] text-xs sm:text-sm font-serif leading-[1.8] text-black/80 text-center focus:outline-none transition-colors resize-y p-1"
                      placeholder="Write your story, tribute, or welcome note here..."
                    />
                  </div>
                </section>
              </React.Fragment>
            );

          /* ── PHOTO GALLERY (ORGANIC EDITORIAL SPREAD, NO SAAS TILES) ── */
          case 'gallery':
            return (
              <React.Fragment key={secKey}>
                {renderFleuronDivider()}
                <section
                  id="canvas-section-gallery"
                  onMouseEnter={() => setHoveredSection(secKey)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="relative text-center py-4 px-2 space-y-4 group"
                >
                  {renderFloatingControls(secKey, 'Gallery')}

                  <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-[#8C5E50]">
                    Cherished Moments
                  </p>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#934638] font-normal">
                    Photo Memories
                  </h3>

                  {/* Asymmetric Luxury Photo Arrangement with Soft Shadows */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    {(values.galleryImages && values.galleryImages.length > 0
                      ? values.galleryImages
                      : [
                          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
                          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
                          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
                        ]
                    ).map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-lg overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.15)] border-2 border-white transition-transform hover:scale-105 duration-200 ${
                          idx === 1 ? 'w-32 h-44 -rotate-1 z-10' : 'w-24 h-36 rotate-2'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Memory ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onOpenPhotoRail}
                      className="inline-flex items-center gap-1.5 text-xs font-serif italic text-[#8C5E50] hover:text-[#934638] border-b border-[#8C5E50]/30 hover:border-[#934638] pb-0.5 cursor-pointer"
                    >
                      <Plus size={11} />
                      <span>Manage or add photos</span>
                    </button>
                  </div>
                </section>
              </React.Fragment>
            );

          /* ── RSVP (TASTEFUL LETTERPRESS RESPONSE) ── */
          case 'rsvp':
            return (
              <React.Fragment key={secKey}>
                {renderFleuronDivider()}
                <section
                  id="canvas-section-rsvp"
                  onMouseEnter={() => setHoveredSection(secKey)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="relative text-center py-4 px-2 space-y-4 group"
                >
                  {renderFloatingControls(secKey, 'RSVP')}

                  <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-[#8C5E50]">
                    Kindly Respond
                  </p>

                  <h3 className="font-serif text-2xl text-[#934638] font-normal">
                    R . S . V . P
                  </h3>

                  {/* Borderless Editable RSVP Deadline */}
                  <div className="inline-flex items-center justify-center gap-1.5 text-xs font-serif italic text-black/70">
                    <span>Kindly confirm your attendance by:</span>
                    <input
                      type="text"
                      value={values.rsvpDeadline || '1 December 2026'}
                      onChange={(e) => onUpdateValues('rsvpDeadline', e.target.value)}
                      className="bg-transparent border-0 border-b border-transparent hover:border-black/20 focus:border-[#B99A62] font-semibold text-[#8C4638] focus:outline-none transition-colors p-0.5 text-center"
                      placeholder="e.g. 1 December 2026"
                    />
                  </div>

                  {/* Refined Letterpress Response Choices (NO NEON BUTTONS) */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 bg-black/[0.02] text-xs font-serif text-black/80 hover:bg-black/[0.05] transition-colors cursor-pointer">
                      <span className="w-2.5 h-2.5 rounded-full border border-[#934638] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#934638]" />
                      </span>
                      <span>Joyfully Accept</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 bg-black/[0.02] text-xs font-serif text-black/60 hover:bg-black/[0.05] transition-colors cursor-pointer">
                      <span className="w-2.5 h-2.5 rounded-full border border-black/30" />
                      <span>Regretfully Decline</span>
                    </div>
                  </div>

                  <p className="text-[11px] font-serif italic text-black/40">
                    Guests can also indicate dietary preferences and named attendees
                  </p>
                </section>
              </React.Fragment>
            );

          /* ── M-PESA & GIFT REGISTRY (REFINED BLESSINGS NOTE) ── */
          case 'registry':
            return (
              <React.Fragment key={secKey}>
                {renderFleuronDivider()}
                <section
                  id="canvas-section-registry"
                  onMouseEnter={() => setHoveredSection(secKey)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="relative text-center py-4 px-2 space-y-3 group"
                >
                  {renderFloatingControls(secKey, 'Registry')}

                  <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-[#8C5E50]">
                    Gifts &amp; Blessings
                  </p>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#934638] font-normal">
                    M-Pesa Registry &amp; Harambee
                  </h3>

                  <p className="font-serif italic text-xs text-black/60 max-w-sm mx-auto leading-relaxed">
                    Your presence and blessings are our greatest gift. Should you wish to honour us with a contribution:
                  </p>

                  {/* Clean Typographic Mobile Money Line (NO FORM BOXES) */}
                  <div className="max-w-xs mx-auto py-2 space-y-1.5">
                    <div className="flex items-center justify-center gap-2 text-xs font-serif">
                      <span className="text-black/50">Buy Goods Till:</span>
                      <input
                        type="text"
                        value={values.mpesaNumber || '8249102'}
                        onChange={(e) => onUpdateValues('mpesaNumber', e.target.value)}
                        className="bg-transparent border-0 border-b border-transparent hover:border-black/20 focus:border-[#B99A62] font-mono font-bold text-sm text-[#0F766E] focus:outline-none transition-colors w-24 text-center p-0"
                        placeholder="8249102"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs font-serif">
                      <span className="text-black/50">Account Name:</span>
                      <input
                        type="text"
                        value={values.mpesaRecipient || values.celebrants || 'Kevin & Wanjiku'}
                        onChange={(e) => onUpdateValues('mpesaRecipient', e.target.value)}
                        className="bg-transparent border-0 border-b border-transparent hover:border-black/20 focus:border-[#B99A62] font-medium text-black/80 focus:outline-none transition-colors text-center p-0"
                        placeholder="Recipient Name"
                      />
                    </div>
                  </div>
                </section>
              </React.Fragment>
            );

          /* ── FAQ & PRACTICAL INFORMATION (CLASSICAL Q&A LINES) ── */
          case 'faq':
            return (
              <React.Fragment key={secKey}>
                {renderFleuronDivider()}
                <section
                  id="canvas-section-faq"
                  onMouseEnter={() => setHoveredSection(secKey)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="relative text-center py-4 px-2 space-y-4 group"
                >
                  {renderFloatingControls(secKey, 'FAQ')}

                  <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-[#8C5E50]">
                    Practical Details
                  </p>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#934638] font-normal">
                    Guest Information
                  </h3>

                  <div className="max-w-sm mx-auto space-y-4 text-center pt-1">
                    {/* Dress Code Line */}
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-sans font-semibold uppercase tracking-wider text-black/60">
                        Dress Code
                      </p>
                      <input
                        type="text"
                        value={values.dressCode || 'Formal Traditional / Black Tie'}
                        onChange={(e) => onUpdateValues('dressCode', e.target.value)}
                        className="w-full text-center bg-transparent border-0 border-b border-transparent hover:border-black/20 focus:border-[#B99A62] text-xs sm:text-sm font-serif italic text-black/80 focus:outline-none transition-colors p-0.5"
                        placeholder="e.g. Formal Traditional / Black Tie"
                      />
                    </div>

                    {/* Children & Parking Line */}
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-sans font-semibold uppercase tracking-wider text-black/60">
                        Children &amp; Accommodations
                      </p>
                      <p className="text-xs font-serif italic text-black/60">
                        Complimentary valet parking and wheelchair access provided at both venues.
                      </p>
                    </div>
                  </div>
                </section>
              </React.Fragment>
            );

          /* ── CLOSING & MONOGRAM (ROYAL WAX SEAL & CELEBRANTS SIGNATURE) ── */
          case 'closing':
            return (
              <React.Fragment key={secKey}>
                {renderFleuronDivider()}
                <section
                  id="canvas-section-closing"
                  onMouseEnter={() => setHoveredSection(secKey)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="relative text-center py-6 px-2 space-y-4 group"
                >
                  {renderFloatingControls(secKey, 'Closing')}

                  {/* Ornate Wax Monogram Crest */}
                  <div className="w-14 h-14 rounded-full border-2 border-[#B99A62]/40 bg-white/80 shadow-xs mx-auto flex items-center justify-center">
                    <span
                      className="font-serif italic text-2xl font-normal"
                      style={{ color: primaryColor }}
                    >
                      {design.sealMonogram || template.seal.monogram || 'K'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-sans font-semibold tracking-[0.28em] text-[#8C5E50] uppercase">
                      With Love &amp; Gratitude
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#934638] font-normal">
                      {values.celebrants}
                    </h3>
                    <p className="font-serif italic text-xs text-black/60 max-w-xs mx-auto pt-1 leading-relaxed">
                      We look forward to celebrating this joyful milestone together with you.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={onScrollToTop}
                      className="inline-flex items-center gap-1.5 text-xs font-serif italic text-[#8C5E50] hover:text-[#934638] transition-colors py-1 cursor-pointer border-b border-[#8C5E50]/30 hover:border-[#934638] pb-0.5"
                    >
                      <ArrowUp size={12} />
                      <span>Return to the beginning</span>
                    </button>
                  </div>
                </section>
              </React.Fragment>
            );

          default:
            return null;
        }
      })}

      {/* ── 3. RESTORE HIDDEN SECTIONS TRAY (IF ANY) ──────────────────── */}
      {hiddenSections.length > 0 && (
        <aside
          aria-label="Hidden sections"
          className="mt-8 pt-4 border-t border-black/[0.08] text-center select-none"
        >
          <span className="text-[10px] font-serif italic text-black/40 block mb-2">
            Hidden sections (click to restore to invitation):
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {hiddenSections.map((secKey) => (
              <button
                key={secKey}
                type="button"
                onClick={() => toggleSectionVisibility(secKey)}
                className="px-2.5 py-0.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-black/70 text-[10px] font-serif transition-colors flex items-center gap-1 border border-black/10"
              >
                <Plus size={10} className="text-[#B99A62]" />
                <span className="capitalize">{secKey}</span>
              </button>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
