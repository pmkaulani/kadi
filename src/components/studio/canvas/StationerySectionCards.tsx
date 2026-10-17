'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Images,
  Send,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Smartphone,
  Quote,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Navigation,
  CalendarPlus,
  ArrowUp,
  Music,
  Radio,
  FileText,
} from 'lucide-react';
import type { DraftInvitationValues } from '@/components/invitations/DraftInvitationPreview';
import type { EventDesignEntity } from '@/lib/db/types';
import type { TemplateDefinition } from '@/lib/templates/types';
import {
  getDefaultInvitationSections,
  SECTION_METADATA,
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
  const [activeEditingSection, setActiveEditingSection] = useState<string | null>(null);

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

  // Section card frame wrapper with header badge & toolbar
  const renderCardWrapper = (
    secKey: string,
    title: string,
    icon: React.ReactNode,
    content: React.ReactNode
  ) => {
    const isEditing = activeEditingSection === secKey;
    const meta = SECTION_METADATA[secKey as InvitationSectionKey];

    return (
      <section
        key={secKey}
        id={`canvas-section-${secKey}`}
        onClick={() => setActiveEditingSection(secKey)}
        className={`w-[480px] rounded-2xl relative shadow-[0_16px_50px_rgba(0,0,0,0.55)] transition-all duration-200 border group ${
          isEditing ? 'ring-2 ring-[#B99A62] shadow-[0_20px_60px_rgba(185,154,98,0.25)]' : 'border-black/[0.08]'
        }`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {/* Subtle Paper Linen texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: '8px 8px',
          }}
        />

        {/* Section Top Header Toolbar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-black/[0.06] select-none">
          <div className="flex items-center gap-2">
            <span style={{ color: primaryColor }}>{icon}</span>
            <span className="font-serif font-semibold text-xs tracking-wide uppercase text-black/75">
              {title}
            </span>
          </div>

          {/* Quick action controls: Move up, Move down, Hide */}
          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveSectionUp(secKey);
              }}
              title="Move section up"
              className="p-1 hover:bg-black/5 rounded text-black/60 hover:text-black transition-colors"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveSectionDown(secKey);
              }}
              title="Move section down"
              className="p-1 hover:bg-black/5 rounded text-black/60 hover:text-black transition-colors"
            >
              <ChevronDown size={14} />
            </button>
            <div className="w-[1px] h-3 bg-black/15 mx-0.5" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSectionVisibility(secKey);
              }}
              title="Hide this section"
              className="p-1 hover:bg-black/5 rounded text-black/60 hover:text-black transition-colors flex items-center gap-1 text-[11px]"
            >
              <EyeOff size={13} />
              <span className="hidden sm:inline">Hide</span>
            </button>
          </div>
        </div>

        {/* Section Content Body */}
        <div className="p-6 relative z-10">{content}</div>
      </section>
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 mt-6">
      {/* ── 0. CONTINUOUS STATIONERY CONNECTOR DIVIDER ────────────────── */}
      <div className="w-[480px] flex items-center justify-center gap-3 py-1 select-none">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#B99A62]/40 to-[#B99A62]/70" />
        <span className="font-serif text-[11px] uppercase tracking-[0.25em] text-[#B99A62] font-medium flex items-center gap-1.5 px-2">
          <span>❦</span>
          <span>Stationery Sections Flow</span>
          <span>❦</span>
        </span>
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#B99A62]/40 to-[#B99A62]/70" />
      </div>

      {/* ── 1. COUNTDOWN SECTION CARD ─────────────────────────────────── */}
      <section
        id="canvas-section-countdown"
        onClick={() => setActiveEditingSection('countdown')}
        className={`w-[480px] rounded-2xl relative shadow-[0_16px_50px_rgba(0,0,0,0.55)] transition-all duration-200 border group ${
          activeEditingSection === 'countdown'
            ? 'ring-2 ring-[#B99A62] shadow-[0_20px_60px_rgba(185,154,98,0.25)]'
            : 'border-black/[0.08]'
        }`}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-black/[0.06] select-none">
          <div className="flex items-center gap-2">
            <Clock size={15} style={{ color: primaryColor }} />
            <span className="font-serif font-semibold text-xs tracking-wide uppercase text-black/75">
              Celebration Countdown
            </span>
          </div>
          <span className="text-[10px] text-black/40 uppercase font-sans tracking-wider">
            Live Timer
          </span>
        </div>

        <div className="p-6 text-center space-y-4">
          {/* Inline Editable Countdown Label */}
          <div className="space-y-1">
            <input
              type="text"
              value={values.countdownLabel || 'Counting down with joy'}
              onChange={(e) => onUpdateValues('countdownLabel', e.target.value)}
              className="w-full text-center bg-transparent font-serif italic text-sm sm:text-base text-black/70 hover:bg-black/5 focus:bg-black/5 p-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#B99A62]"
              placeholder="e.g. Counting down with joy"
              title="Click to edit countdown label"
            />
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.2em]" style={{ color: primaryColor }}>
              {values.date} · {values.time}
            </p>
          </div>

          {/* Interactive Styled Countdown Boxes */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-1">
            {[
              { val: '28', label: 'Days' },
              { val: '14', label: 'Hours' },
              { val: '45', label: 'Mins' },
              { val: '30', label: 'Secs' },
            ].map((slot, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center w-16 h-16 rounded-xl border border-black/10 bg-white/70 shadow-xs"
              >
                <span className="font-serif text-xl font-bold" style={{ color: primaryColor }}>
                  {slot.val}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-black/50 font-sans">
                  {slot.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-black/40 italic font-serif">
            Guests see their dynamic live countdown to {values.date}
          </p>
        </div>
      </section>

      {/* ── 2. SEQUENCED VISIBLE SECTIONS ─────────────────────────────── */}
      {activeSections.map((secKey) => {
        switch (secKey) {
          /* ── CEREMONY & RECEPTION SECTION ── */
          case 'ceremony':
            return renderCardWrapper(
              secKey,
              'Ceremony & Reception Details',
              <Calendar size={15} />,
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ceremony Box */}
                  <div className="p-4 rounded-xl bg-white/60 border border-black/10 space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#8C5E50]">
                        The Ceremony
                      </span>
                      <span className="text-[10px] text-black/40">10:00 AM</span>
                    </div>
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={values.venue || 'Our Lady of the Rosary'}
                        onChange={(e) => onUpdateValues('venue', e.target.value)}
                        className="w-full text-xs font-serif font-medium text-black/85 bg-transparent hover:bg-black/5 focus:bg-white p-1 rounded border border-transparent focus:border-[#B99A62] focus:outline-none"
                        placeholder="Ceremony venue name"
                      />
                      <input
                        type="text"
                        value={values.city || 'Ridgeways, Kiambu Road'}
                        onChange={(e) => onUpdateValues('city', e.target.value)}
                        className="w-full text-[11px] text-black/60 bg-transparent hover:bg-black/5 focus:bg-white p-1 rounded border border-transparent focus:border-[#B99A62] focus:outline-none"
                        placeholder="Ceremony address / location"
                      />
                    </div>
                  </div>

                  {/* Reception Box */}
                  <div className="p-4 rounded-xl bg-white/60 border border-black/10 space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#8C5E50]">
                        The Reception
                      </span>
                      <span className="text-[10px] text-black/40">1:30 PM</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-serif font-medium text-black/85 p-1">
                        Windsor Golf &amp; Country Club
                      </p>
                      <p className="text-[11px] text-black/60 p-1">
                        Kigwa Ridge, Nairobi
                      </p>
                    </div>
                  </div>
                </div>

                {/* Calendar Action Preview */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/15 bg-white/80 text-[11px] font-medium text-black/70 shadow-2xs">
                    <CalendarPlus size={13} style={{ color: primaryColor }} />
                    <span>Add to Calendar (.ICS / Google)</span>
                  </div>
                </div>
              </div>
            );

          /* ── VENUE & LOCATION MAP SECTION ── */
          case 'venue':
            return renderCardWrapper(
              secKey,
              'Venue & Location',
              <MapPin size={15} />,
              <div className="space-y-4 text-center">
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <input
                    type="text"
                    value={values.venue}
                    onChange={(e) => onUpdateValues('venue', e.target.value)}
                    className="w-full text-center font-serif text-lg font-medium text-black/85 bg-transparent hover:bg-black/5 focus:bg-white p-1 rounded border border-transparent focus:border-[#B99A62] focus:outline-none"
                    placeholder="Venue name"
                  />
                  <input
                    type="text"
                    value={values.city}
                    onChange={(e) => onUpdateValues('city', e.target.value)}
                    className="w-full text-center font-sans text-xs text-black/60 bg-transparent hover:bg-black/5 focus:bg-white p-1 rounded border border-transparent focus:border-[#B99A62] focus:outline-none"
                    placeholder="City / Region"
                  />
                </div>

                {/* Map Action Button Preview */}
                <div className="p-4 rounded-xl bg-white/70 border border-black/10 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF5EE] border border-[#B99A62]/30 flex items-center justify-center shrink-0">
                      <Navigation size={15} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-black/80">Interactive Google Maps</p>
                      <p className="text-[10px] text-black/50">One-tap navigation for guests</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#0F766E] font-medium flex items-center gap-0.5">
                    <span>Preview</span>
                    <ExternalLink size={11} />
                  </span>
                </div>
              </div>
            );

          /* ── OUR STORY & HOST NOTE SECTION ── */
          case 'story':
          case 'about':
            return renderCardWrapper(
              secKey,
              category === 'birthday' ? 'About the Celebrant' : 'Our Story & Host Note',
              <Heart size={15} />,
              <div className="space-y-3">
                <p className="text-[11px] text-black/50 text-center font-serif italic">
                  A personal note, love story, or message to welcome your guests
                </p>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={values.story || ''}
                    onChange={(e) => onUpdateValues('story', e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/70 border border-black/15 text-xs font-serif leading-relaxed text-black/85 hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B99A62] transition-colors resize-y"
                    placeholder="Write your story or welcome message here..."
                  />
                </div>
              </div>
            );

          /* ── PHOTO GALLERY SECTION ── */
          case 'gallery':
            return renderCardWrapper(
              secKey,
              'Photo Gallery & Memories',
              <Images size={15} />,
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2.5">
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
                      className="relative aspect-square rounded-xl overflow-hidden border border-black/10 shadow-2xs group"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery memory ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={onOpenPhotoRail}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/15 bg-white/80 hover:bg-white text-[11px] font-medium text-black/75 shadow-2xs transition-colors"
                  >
                    <Plus size={13} style={{ color: primaryColor }} />
                    <span>Upload &amp; Manage Photos</span>
                  </button>
                </div>
              </div>
            );

          /* ── RSVP SECTION ── */
          case 'rsvp':
            return renderCardWrapper(
              secKey,
              'Guest RSVP Response',
              <Send size={15} />,
              <div className="space-y-4 text-center">
                {/* RSVP Deadline Field */}
                <div className="p-3 rounded-xl bg-white/60 border border-black/10 inline-flex items-center gap-2 max-w-sm mx-auto">
                  <span className="text-[11px] font-serif font-medium text-black/60 shrink-0">
                    Kindly respond by:
                  </span>
                  <input
                    type="text"
                    value={values.rsvpDeadline || '1 December 2026'}
                    onChange={(e) => onUpdateValues('rsvpDeadline', e.target.value)}
                    className="font-serif font-bold text-xs text-[#8C4638] bg-transparent hover:bg-black/5 focus:bg-white px-2 py-0.5 rounded border border-transparent focus:border-[#B99A62] focus:outline-none"
                    placeholder="e.g. 1 December 2026"
                  />
                </div>

                {/* RSVP Buttons Preview */}
                <div className="grid grid-cols-2 gap-2.5 max-w-xs mx-auto pt-1">
                  <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/50 text-emerald-800 text-xs font-medium flex items-center justify-center gap-1.5">
                    <Check size={14} className="text-emerald-600" />
                    <span>Will Attend</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-black/15 bg-black/5 text-black/60 text-xs font-medium flex items-center justify-center">
                    <span>Decline with Regret</span>
                  </div>
                </div>

                <p className="text-[11px] text-black/40 italic font-serif">
                  Guests submit attendance, dietary requirements, and meal preferences
                </p>
              </div>
            );

          /* ── M-PESA & GIFT REGISTRY SECTION ── */
          case 'registry':
            return renderCardWrapper(
              secKey,
              'Gift Registry & M-Pesa Harambee',
              <Smartphone size={15} />,
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/70 border border-black/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-serif text-[#0F766E] uppercase tracking-wider">
                      M-Pesa Contributions
                    </span>
                    <select
                      value={values.mpesaType || 'till'}
                      onChange={(e) => onUpdateValues('mpesaType', e.target.value as any)}
                      className="text-[11px] font-medium bg-[#FAF5EE] border border-black/15 rounded px-2 py-1 focus:outline-[#B99A62]"
                    >
                      <option value="till">Buy Goods Till</option>
                      <option value="paybill">Paybill</option>
                      <option value="send_money">Send Money</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div>
                      <label className="block text-[10px] text-black/50 uppercase tracking-wider mb-0.5">
                        Till / Paybill Number
                      </label>
                      <input
                        type="text"
                        value={values.mpesaNumber || '8249102'}
                        onChange={(e) => onUpdateValues('mpesaNumber', e.target.value)}
                        className="w-full text-xs font-mono font-medium p-1.5 rounded bg-white border border-black/15 focus:outline-[#B99A62]"
                        placeholder="8249102"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-black/50 uppercase tracking-wider mb-0.5">
                        Account / Recipient
                      </label>
                      <input
                        type="text"
                        value={values.mpesaRecipient || values.celebrants || 'Kevin & Wanjiku'}
                        onChange={(e) => onUpdateValues('mpesaRecipient', e.target.value)}
                        className="w-full text-xs font-sans p-1.5 rounded bg-white border border-black/15 focus:outline-[#B99A62]"
                        placeholder="Recipient Name"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-[11px] text-black/50 font-serif italic">
                    Guests can copy details or simulate STK push directly
                  </span>
                </div>
              </div>
            );

          /* ── FAQ SECTION ── */
          case 'faq':
            return renderCardWrapper(
              secKey,
              'Frequently Asked Questions',
              <HelpCircle size={15} />,
              <div className="space-y-3 text-left">
                {/* Dress Code Item */}
                <div className="p-3 rounded-xl bg-white/60 border border-black/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-black/80">
                      What is the dress code?
                    </span>
                  </div>
                  <input
                    type="text"
                    value={values.dressCode || 'Formal Traditional / Black Tie'}
                    onChange={(e) => onUpdateValues('dressCode', e.target.value)}
                    className="w-full text-xs text-black/70 bg-transparent hover:bg-black/5 focus:bg-white p-1 rounded border border-transparent focus:border-[#B99A62] focus:outline-none"
                    placeholder="e.g. Formal Traditional / Black Tie"
                  />
                </div>

                {/* Parking Item */}
                <div className="p-3 rounded-xl bg-white/60 border border-black/10 space-y-1">
                  <span className="text-xs font-serif font-bold text-black/80">
                    Is parking available at the venue?
                  </span>
                  <p className="text-xs text-black/70 p-1">
                    Yes, complimentary valet and secure on-site parking are provided for all guests.
                  </p>
                </div>
              </div>
            );

          /* ── CLOSING & SIGN-OFF SECTION ── */
          case 'closing':
            return renderCardWrapper(
              secKey,
              'Closing & Hosts Sign-off',
              <Sparkles size={15} />,
              <div className="text-center space-y-4">
                {/* Royal Monogram Emblem */}
                <div className="w-12 h-12 rounded-full border border-[#B99A62]/40 bg-white/80 shadow-xs mx-auto flex items-center justify-center">
                  <span className="font-serif italic text-lg font-bold" style={{ color: primaryColor }}>
                    {design.sealMonogram || template.seal.monogram || 'K'}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#8C5E50] uppercase">
                    With Love &amp; Gratitude
                  </p>
                  <h3 className="font-serif text-2xl text-[#934638] font-normal">
                    {values.celebrants}
                  </h3>
                  <p className="font-serif italic text-xs text-black/60 max-w-xs mx-auto pt-1 leading-relaxed">
                    We look forward to celebrating this joyful milestone together with you.
                  </p>
                </div>

                <div className="text-center text-[#B99A62] text-xs py-1 select-none" aria-hidden="true">
                  ✦ ─── ❦ ─── ✦
                </div>

                {/* Return to Top Button */}
                <button
                  type="button"
                  onClick={onScrollToTop}
                  className="inline-flex items-center gap-1.5 text-xs font-serif italic text-[#8C5E50] hover:text-[#934638] transition-colors py-1 cursor-pointer"
                >
                  <ArrowUp size={13} />
                  <span>Return to top of invitation</span>
                </button>
              </div>
            );

          default:
            return null;
        }
      })}

      {/* ── 3. RESTORE HIDDEN SECTIONS TRAY (IF ANY) ──────────────────── */}
      {hiddenSections.length > 0 && (
        <div className="w-[480px] p-4 rounded-xl border border-dashed border-white/20 bg-white/5 text-center space-y-2 select-none">
          <span className="text-[11px] text-white/50 block">
            Hidden sections (click to restore to invitation):
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {hiddenSections.map((secKey) => (
              <button
                key={secKey}
                type="button"
                onClick={() => toggleSectionVisibility(secKey)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] font-medium transition-colors flex items-center gap-1"
              >
                <Plus size={11} className="text-[#B99A62]" />
                <span className="capitalize">{secKey}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
