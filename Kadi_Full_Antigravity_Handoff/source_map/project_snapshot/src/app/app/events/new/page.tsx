'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EventService } from '@/lib/services/event-service';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { EventCategory } from '@/lib/templates/types';
import { Input } from '@/components/ui/Input';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';

const SWATCHES = [
  { id: 'terracotta', color: '#934638', label: 'Terracotta' },
  { id: 'gold', color: '#B99A62', label: 'Antique Gold' },
  { id: 'sage', color: '#747D62', label: 'Sage Botanical' },
  { id: 'velvet', color: '#651A25', label: 'Royal Velvet' },
  { id: 'charcoal', color: '#272620', label: 'Charcoal Ink' },
];

function NewEventWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('templateId') || searchParams.get('template');
  const matchedTemplate = TEMPLATES.find((t) => t.id === templateParam);
  const initialTemplateId = matchedTemplate?.id || 'sage-botanical';

  // Stepper: 1: Details, 2: Design, 3: Guests, 4: RSVP, 5: Publish
  const [activeStep, setActiveStep] = useState<number>(2);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [pickerCategory, setPickerCategory] = useState<string>('all');

  const [category, setCategory] = useState<EventCategory>(
    (matchedTemplate?.category as EventCategory) || 'wedding'
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const [activeColor, setActiveColor] = useState(SWATCHES[0].id);
  const [selectedFont, setSelectedFont] = useState('Playfair Display');
  const [envelopeStyle, setEnvelopeStyle] = useState('Classic Fold');
  const [letterStyle, setLetterStyle] = useState('Printed Letter');

  const [title, setTitle] = useState(matchedTemplate?.sampleData.title || 'Wedding Celebration');
  const [hosts, setHosts] = useState(matchedTemplate?.sampleData.hosts || 'Together with their families');
  const [celebrants, setCelebrants] = useState(matchedTemplate?.sampleData.celebrants || 'Wanjiku & Otieno');
  const [date, setDate] = useState(matchedTemplate?.sampleData.date || 'Saturday, 12 December 2026');
  const [time, setTime] = useState(matchedTemplate?.sampleData.time || '2:00 PM EAT');
  const [venue, setVenue] = useState(matchedTemplate?.sampleData.venue || 'Nairobi Chapel, Ngong Road');
  const [city, setCity] = useState(matchedTemplate?.sampleData.city || 'Nairobi, Kenya');
  const [rsvpDeadline, setRsvpDeadline] = useState('1 December 2026');
  const [dressCode, setDressCode] = useState('Formal Traditional / Black Tie');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTemplate =
    TEMPLATES.find((t) => t.id === selectedTemplateId) ||
    TEMPLATES.find((t) => t.category === category) ||
    TEMPLATES[0];

  const handleSelectTemplate = (tmpl: (typeof TEMPLATES)[0]) => {
    setSelectedTemplateId(tmpl.id);
    setCategory(tmpl.category as EventCategory);
    setTitle(tmpl.sampleData.title);
    setHosts(tmpl.sampleData.hosts);
    setCelebrants(tmpl.sampleData.celebrants);
    setVenue(tmpl.sampleData.venue);
    setDate(tmpl.sampleData.date);
    setTime(tmpl.sampleData.time);
    setCity(tmpl.sampleData.city);
    setTemplatePickerOpen(false);
  };

  const handleFinishCreate = async () => {
    setIsSubmitting(true);
    try {
      const newEvent = EventService.createEvent({
        title: title.trim() || selectedTemplate.sampleData.title,
        hosts: hosts.trim() || selectedTemplate.sampleData.hosts,
        celebrants: celebrants.trim() || selectedTemplate.sampleData.celebrants,
        category,
        templateId: selectedTemplateId,
        date,
        time,
        venue: venue.trim() || selectedTemplate.sampleData.venue,
        city,
        rsvpDeadline,
        dressCode: dressCode || undefined,
        heroImage: selectedTemplate.sampleData.heroImage,
      });
      router.push(`/app/events/${newEvent.id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not create the invitation');
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Details', desc: 'Event information' },
    { num: 2, label: 'Design', desc: 'Choose template & style' },
    { num: 3, label: 'Guests', desc: 'Add guest list' },
    { num: 4, label: 'RSVP', desc: 'Configure RSVP settings' },
    { num: 5, label: 'Publish', desc: 'Review and launch' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto min-h-[calc(100vh-120px)] flex flex-col justify-between">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[rgba(39,38,32,0.12)] mb-6">
        <Link
          href="/app/events"
          className="inline-flex items-center gap-2 text-xs text-[#756F64] hover:text-[#934638] font-medium"
        >
          <ArrowLeft size={14} />
          <span>Back to your events</span>
        </Link>
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8C8375]">
          Invitation Studio
        </span>
      </div>

      {/* Mobile Edit / Preview Toggle */}
      <div className="lg:hidden flex items-center justify-center p-1 bg-white border border-[rgba(39,38,32,0.12)] rounded-full mb-5 w-fit mx-auto shadow-sm">
        <button
          type="button"
          onClick={() => setMobileView('edit')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mobileView === 'edit'
              ? 'bg-[#794a32] text-white shadow-sm'
              : 'text-[#6D6558] hover:text-[#272620]'
          }`}
        >
          Edit Details
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mobileView === 'preview'
              ? 'bg-[#794a32] text-white shadow-sm'
              : 'text-[#6D6558] hover:text-[#272620]'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* 3-Column Studio Grid matching app-workspace-target.png (Bottom-Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start flex-1">
        {/* Left Column (3 cols): Step Rail & Summary */}
        <aside className={`lg:col-span-3 space-y-6 ${mobileView === 'edit' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-5 shadow-sm">
            <h2 className="font-serif text-xl text-[#272620] font-medium leading-tight">
              {celebrants || 'Wanjiku & Otieno'}
            </h2>
            <p className="text-xs text-[#756F64] mt-0.5 mb-5 capitalize">
              {category} · {date.replace(/^[a-zA-Z]+,\s*/, '')}
            </p>

            {/* Stepper List matching reference */}
            <div className="space-y-2">
              {steps.map((st) => {
                const isActive = activeStep === st.num;
                const isPassed = activeStep > st.num;

                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setActiveStep(st.num)}
                    className={`w-full text-left flex items-start gap-3 p-2.5 rounded transition-colors ${
                      isActive
                        ? 'bg-[#FAF4EB] text-[#272620]'
                        : 'hover:bg-black/[0.02] text-[#6D6558]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-[#934638] text-white shadow-sm'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'border border-[rgba(39,38,32,0.2)] text-[#8C8375]'
                      }`}
                    >
                      {isPassed ? <Check size={13} strokeWidth={2.5} /> : st.num}
                    </span>
                    <div>
                      <span className={`block text-xs font-medium ${isActive ? 'text-[#934638]' : ''}`}>
                        {st.label}
                      </span>
                      <span className="block text-[10px] text-[#8C8375] leading-tight">
                        {st.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-5 mt-5 border-t border-[rgba(39,38,32,0.08)]">
              <button
                type="button"
                onClick={handleFinishCreate}
                className="w-full py-2 bg-[#FAF7F0] hover:bg-[#F0EAE0] border border-[rgba(39,38,32,0.16)] rounded text-xs font-medium text-[#272620] transition-colors"
              >
                Save Draft
              </button>
            </div>
          </div>
        </aside>

        {/* Center Column (5 cols): Live Phone / Card Preview */}
        <section className={`lg:col-span-5 flex flex-col items-center ${mobileView === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="w-full mb-3 text-center sm:text-left">
            <h3 className="font-serif text-lg text-[#272620] font-medium">Design</h3>
            <p className="text-xs text-[#756F64]">Choose a template and customise your invitation.</p>
          </div>

          {/* Interactive Mobile / Stationery Preview Card */}
          <div className="w-full max-w-[340px] aspect-[9/16] max-h-[580px] bg-[#1a1412] rounded-3xl p-3 shadow-2xl border-4 border-[#302824] relative overflow-hidden flex flex-col justify-between">
            {/* Top Speaker notch */}
            <div className="w-20 h-3.5 bg-[#302824] rounded-full mx-auto mb-2 shrink-0" />

            {/* Inner Phone Screen */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#2D211A] flex flex-col items-center justify-center p-5 text-center text-[#FBF6ED]">
              {/* Envelope / Poster Art */}
              <div className="absolute inset-0 z-0">
                <img
                  src={selectedTemplate.sampleData.heroImage || '/kadi/category-botanical.webp'}
                  alt="Template background"
                  className="w-full h-full object-cover filter brightness-[0.72] contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />
              </div>

              {/* Stationery Content Overlay */}
              <div className="relative z-10 space-y-3 w-full border border-amber-200/30 p-4 rounded-lg bg-black/30 backdrop-blur-[2px]">
                <p className="text-[8px] uppercase tracking-[0.25em] text-amber-200/80">
                  {hosts}
                </p>
                <div className="w-6 h-px bg-amber-200/40 mx-auto" />
                <h4 className="font-serif text-2xl text-amber-100 font-medium tracking-tight">
                  {celebrants}
                </h4>
                <p className="text-[10px] text-amber-200/90 font-serif italic">
                  {title}
                </p>
                <div className="pt-2 border-t border-amber-200/20 text-[9px] uppercase tracking-wider text-amber-100/80 space-y-0.5">
                  <p>{date}</p>
                  <p className="text-[8px] text-amber-200/70">{venue}</p>
                </div>
              </div>

              {/* Bottom Cue */}
              <div className="relative z-10 mt-4 flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-amber-200/75">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Scroll to open invitation</span>
              </div>
            </div>

            {/* Home indicator bar */}
            <div className="w-24 h-1 bg-white/40 rounded-full mx-auto mt-2 shrink-0" />
          </div>

          {/* Template Thumbnails Carousel below preview */}
          <div className="w-full max-w-[340px] mt-4">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[11px] font-medium text-[#756F64]">Templates ({TEMPLATES.length})</span>
              <button
                type="button"
                onClick={() => setTemplatePickerOpen(true)}
                className="text-[11px] font-medium text-[#934638] hover:underline flex items-center gap-1"
              >
                <Sparkles size={11} />
                <span>Browse all</span>
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all relative group ${
                    selectedTemplateId === tmpl.id
                      ? 'border-[#934638] ring-2 ring-[#934638]/40 scale-105 shadow-md'
                      : 'border-black/10 opacity-70 hover:opacity-100'
                  }`}
                  title={`${tmpl.name} (${tmpl.category})`}
                >
                  <img
                    src={tmpl.sampleData.heroImage}
                    alt={tmpl.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column (4 cols): Settings Panel */}
        <section className={`lg:col-span-4 bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 shadow-sm space-y-6 ${mobileView === 'edit' ? 'block' : 'hidden lg:block'}`}>
          {/* Step 1 Form if Details active */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-[#272620] font-medium border-b border-[rgba(39,38,32,0.1)] pb-2">
                Event Information
              </h3>
              <Input
                label="Invitation Title"
                placeholder="Wedding Celebration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                label="Celebrant(s) / Couple"
                placeholder="Wanjiku & Otieno"
                value={celebrants}
                onChange={(e) => setCelebrants(e.target.value)}
              />
              <Input
                label="Hosts / Family Line"
                placeholder="Together with their families"
                value={hosts}
                onChange={(e) => setHosts(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <Input
                  label="Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <Input
                label="Venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
              <Input
                label="City / Town"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          )}

          {/* Step 2 Form if Design active */}
          {activeStep === 2 && (
            <div className="space-y-6">
              {/* Template Style */}
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(39,38,32,0.1)]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C8375] font-semibold block">
                    Template Style
                  </span>
                  <span className="font-serif text-lg text-[#272620] font-medium block">
                    {selectedTemplate.name}
                  </span>
                  <span className="text-xs text-[#756F64] capitalize">
                    {selectedTemplate.category} Suite
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTemplatePickerOpen(true)}
                    className="px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#F0EAE0] border border-[rgba(39,38,32,0.16)] rounded text-xs font-medium text-[#272620] transition-colors"
                  >
                    Change
                  </button>
                  <Link
                    href="/app/templates"
                    className="px-3 py-1.5 bg-white hover:bg-[#FAF4EB] border border-[rgba(39,38,32,0.16)] rounded text-xs font-medium text-[#794a32] transition-colors"
                  >
                    Full Gallery
                  </Link>
                </div>
              </div>

              {/* Customisation: Colors */}
              <div>
                <label className="text-xs font-medium text-[#272620] block mb-2.5">
                  Customisation · Colors
                </label>
                <div className="flex items-center gap-3">
                  {SWATCHES.map((swatch) => (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() => setActiveColor(swatch.id)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        activeColor === swatch.id
                          ? 'ring-2 ring-offset-2 ring-[#934638] scale-110'
                          : 'opacity-85 hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.color }}
                      title={swatch.label}
                    />
                  ))}
                </div>
              </div>

              {/* Fonts Dropdown */}
              <div>
                <label className="text-xs font-medium text-[#272620] block mb-1.5">
                  Typography · Heading Font
                </label>
                <div className="relative">
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full appearance-none bg-white border border-[rgba(39,38,32,0.18)] rounded px-3 py-2 text-xs text-[#272620] pr-8 focus:outline-none focus:border-[#934638]"
                  >
                    <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
                    <option value="Cormorant Garamond">Cormorant Garamond (Classical Garamond)</option>
                    <option value="IM Fell English">IM Fell English (Victorian Antiqua)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8375] pointer-events-none" />
                </div>
              </div>

              {/* Envelope Style */}
              <div>
                <label className="text-xs font-medium text-[#272620] block mb-1.5">
                  Stationery · Envelope Style
                </label>
                <div className="relative">
                  <select
                    value={envelopeStyle}
                    onChange={(e) => setEnvelopeStyle(e.target.value)}
                    className="w-full appearance-none bg-white border border-[rgba(39,38,32,0.18)] rounded px-3 py-2 text-xs text-[#272620] pr-8 focus:outline-none focus:border-[#934638]"
                  >
                    <option value="Classic Fold">Classic Diamond Fold</option>
                    <option value="Pocket Fold">Victorian Mitred Pocket</option>
                    <option value="Scalloped Edge">Romantic Scalloped Flap</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8375] pointer-events-none" />
                </div>
              </div>

              {/* Letter Style */}
              <div>
                <label className="text-xs font-medium text-[#272620] block mb-1.5">
                  Stationery · Letter Style
                </label>
                <div className="relative">
                  <select
                    value={letterStyle}
                    onChange={(e) => setLetterStyle(e.target.value)}
                    className="w-full appearance-none bg-white border border-[rgba(39,38,32,0.18)] rounded px-3 py-2 text-xs text-[#272620] pr-8 focus:outline-none focus:border-[#934638]"
                  >
                    <option value="Printed Letter">Engraved Letterpress Card</option>
                    <option value="Handwritten Letter">Romantic Calligraphy Note</option>
                    <option value="Folded Card">Bi-Fold Keepsake Folio</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8375] pointer-events-none" />
                </div>
              </div>

              {/* Section Note */}
              <div className="p-3.5 bg-[#FAF7F0] border border-[rgba(39,38,32,0.08)] rounded text-xs text-[#6F675A] space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-[#272620]">
                  <Layers size={13} className="text-[#934638]" />
                  <span>12 Sections Included</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  This template includes Welcome, Story, Schedule, Venue, Dress Code, RSVP, and Gallery. You can reorder or toggle them in your studio.
                </p>
              </div>
            </div>
          )}

          {/* Step 3, 4, 5 Quick Info */}
          {activeStep >= 3 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-[#272620] font-medium border-b border-[rgba(39,38,32,0.1)] pb-2">
                {steps[activeStep - 1].label} Configuration
              </h3>
              <p className="text-xs text-[#756F64] leading-relaxed">
                {activeStep === 3
                  ? 'Your guest list will be initialized with household grouping, personalized links, and dietary preference options.'
                  : activeStep === 4
                  ? 'Set RSVP cutoff date, meal preferences, and plus-one limits.'
                  : 'Review all stationery assets and publish to generate your live guest link.'}
              </p>
              <Input
                label="RSVP Deadline"
                value={rsvpDeadline}
                onChange={(e) => setRsvpDeadline(e.target.value)}
              />
              <Input
                label="Dress Code"
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
              />
            </div>
          )}
        </section>
      </div>

      {/* Bottom Sticky Action Bar matching app-workspace-target.png */}
      <div className="sticky bottom-0 z-20 bg-[#FBF8F1] border-t border-[rgba(39,38,32,0.14)] py-4 px-6 mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
          <Check size={14} strokeWidth={2.5} />
          <span>All changes saved</span>
        </div>

        <div className="flex items-center gap-3">
          {activeStep > 1 && (
            <button
              type="button"
              onClick={() => setActiveStep((s) => s - 1)}
              className="px-4 py-2 border border-[rgba(39,38,32,0.18)] rounded text-xs font-medium text-[#272620] hover:bg-[#F0EAE0]"
            >
              Back
            </button>
          )}

          {activeStep < 5 ? (
            <button
              type="button"
              onClick={() => setActiveStep((s) => s + 1)}
              className="kadi-button !min-h-[38px] !px-5 !py-2 !bg-[#934638] hover:!bg-[#73352B] text-xs font-medium"
            >
              <span>Next: {steps[activeStep].label}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishCreate}
              disabled={isSubmitting}
              className="kadi-button !min-h-[38px] !px-6 !py-2 !bg-[#934638] hover:!bg-[#73352B] text-xs font-medium disabled:opacity-60"
            >
              <Sparkles size={14} />
              <span>{isSubmitting ? 'Creating Invitation...' : 'Launch Invitation Studio'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Template Picker Modal */}
      {templatePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F0] border border-[rgba(39,38,32,0.15)] rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[rgba(39,38,32,0.1)] flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="font-serif text-xl text-[#272620] font-medium">Select a Template</h3>
                <p className="text-xs text-[#756F64]">Choose a design for your invitation. You can customize details anytime.</p>
              </div>
              <button
                type="button"
                onClick={() => setTemplatePickerOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#272620]"
                aria-label="Close template picker"
              >
                <X size={16} />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-6 py-3 border-b border-[rgba(39,38,32,0.08)] bg-white/60 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {['all', 'wedding', 'birthday', 'memorial', 'baby-shower', 'graduation', 'housewarming', 'corporate'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPickerCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                    pickerCategory === cat
                      ? 'bg-[#794a32] text-white shadow-sm'
                      : 'bg-white border border-[rgba(39,38,32,0.12)] text-[#6D6558] hover:text-[#272620]'
                  }`}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Grid of Templates */}
            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-1">
              {TEMPLATES.filter((t) => pickerCategory === 'all' || t.category === pickerCategory).map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`text-left bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group ${
                      isSelected
                        ? 'border-[#934638] ring-2 ring-[#934638]'
                        : 'border-[rgba(39,38,32,0.12)] hover:border-[#934638]/50'
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2D211A]">
                      <img
                        src={tmpl.sampleData.heroImage}
                        alt={tmpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#934638] text-white text-[10px] font-semibold rounded-full flex items-center gap-1 shadow">
                          <Check size={10} /> Active
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-serif text-sm text-[#272620] font-medium leading-tight truncate">
                        {tmpl.name}
                      </h4>
                      <span className="text-[10px] text-[#8C8375] capitalize block mt-0.5">
                        {tmpl.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer with Link to full gallery */}
            <div className="px-6 py-3.5 border-t border-[rgba(39,38,32,0.1)] bg-white flex items-center justify-between shrink-0">
              <Link
                href="/app/templates"
                className="text-xs text-[#794a32] hover:underline font-medium"
              >
                Go to full Template Gallery page &rarr;
              </Link>
              <button
                type="button"
                onClick={() => setTemplatePickerOpen(false)}
                className="px-4 py-1.5 bg-[#272620] text-white rounded-lg text-xs font-medium hover:bg-black transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewEventWizardPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-[#756F64]">Opening Invitation Studio...</div>}>
      <NewEventWizardContent />
    </Suspense>
  );
}
