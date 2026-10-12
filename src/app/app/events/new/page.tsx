'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EventService } from '@/lib/services/event-service';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { EventCategory } from '@/lib/templates/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Check,
} from 'lucide-react';

const CATEGORIES: Array<{ id: EventCategory; title: string; desc: string }> = [
  { id: 'wedding', title: 'Wedding', desc: 'Ceremony, reception, wedding party & gift registry' },
  { id: 'birthday', title: 'Milestone Birthday', desc: 'Jubilees, dinners & vibrant celebrations' },
  { id: 'memorial', title: 'Memorial & Funeral', desc: 'Dignified tributes, service schedule & condolences' },
  { id: 'baby-shower', title: 'Baby Shower', desc: 'Pastel themes, nursery wishlist & family blessings' },
  { id: 'graduation', title: 'Graduation', desc: 'Academic milestones, honours & commencement parties' },
  { id: 'corporate', title: 'Corporate / Summit', desc: 'Agendas, executive speakers & venue logistics' },
];

function NewEventWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTemplateId = searchParams.get('template') || 'savannah-twilight';

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<EventCategory>('wedding');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTemplateId);

  // Form Fields
  const [title, setTitle] = useState('');
  const [hosts, setHosts] = useState('');
  const [celebrants, setCelebrants] = useState('');
  const [date, setDate] = useState('Saturday, 14 November 2026');
  const [time, setTime] = useState('2:00 PM EAT');
  const [venue, setVenue] = useState('Safari Park Hotel & Casino, Thika Road');
  const [city, setCity] = useState('Nairobi, Kenya');
  const [rsvpDeadline, setRsvpDeadline] = useState('1 November 2026');
  const [dressCode, setDressCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTemplate =
    TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

  const handleFinishCreate = async () => {
    setIsSubmitting(true);
    try {
      const newEvent = EventService.createEvent({
        title: title || selectedTemplate.sampleData.title,
        hosts: hosts || selectedTemplate.sampleData.hosts,
        celebrants: celebrants || selectedTemplate.sampleData.celebrants,
        category,
        templateId: selectedTemplateId,
        date,
        time,
        venue,
        city,
        rsvpDeadline,
        dressCode: dressCode || undefined,
        heroImage: selectedTemplate.sampleData.heroImage,
      });

      router.push(`/app/events/${newEvent.id}`);
    } catch (err: any) {
      alert(err.message || 'Error creating event');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Top Breadcrumb & Step Tracker */}
      <div className="mb-8">
        <Link
          href="/app/events"
          className="text-xs font-semibold text-brand-slate hover:text-brand-charcoal flex items-center gap-1.5 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Events</span>
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-brand-charcoal">
            Create Event Invitation
          </h1>
          <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-3 py-1 rounded-full">
            Step {step} of 3
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-brand-purple h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: EVENT TYPE */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-serif font-bold text-brand-charcoal">
              What occasion are you celebrating?
            </h2>
            <p className="text-xs text-brand-slate mt-1">
              Selecting the event category sets the appropriate animation motion and recommended sections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  category === cat.id
                    ? 'border-brand-purple bg-brand-purple-light/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <h3 className="font-serif font-bold text-sm text-brand-charcoal">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-brand-slate mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                {category === cat.id && (
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-brand-purple">
                    <Check className="w-3.5 h-3.5" />
                    <span>Selected</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="pt-6 flex justify-end">
            <Button
              size="md"
              variant="primary"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Choose Design
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT TEMPLATE */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-serif font-bold text-brand-charcoal">
              Choose an Invitation Suite
            </h2>
            <p className="text-xs text-brand-slate mt-1">
              Each design features a 3D envelope, custom liner, and coordinated typography palette.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${
                  selectedTemplateId === tmpl.id
                    ? 'border-brand-purple shadow-md bg-brand-purple-light/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="h-32 w-full overflow-hidden bg-slate-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tmpl.sampleData.heroImage}
                    alt={tmpl.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedTemplateId === tmpl.id && (
                    <div className="absolute top-2 right-2 bg-brand-purple text-white p-1 rounded-full shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-bold text-sm text-brand-charcoal">
                    {tmpl.name}
                  </h3>
                  <p className="text-[11px] text-brand-slate mt-0.5 line-clamp-1">
                    {tmpl.description}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-400 font-medium">
                    Liner: {tmpl.liner.name} • Motion: {tmpl.motionPreset}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button size="sm" variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={() => setStep(3)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Details
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-serif font-bold text-brand-charcoal">
              Enter Event Details
            </h2>
            <p className="text-xs text-brand-slate mt-1">
              You can fine-tune every field, upload photos, and edit sections later in the design studio.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4">
            <Input
              label="Event Title *"
              placeholder="e.g. The Wedding of Kevin & Wanjiku"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Host(s) / Families *"
                placeholder="e.g. Mr. & Mrs. Kamau"
                value={hosts}
                onChange={(e) => setHosts(e.target.value)}
                required
              />

              <Input
                label="Celebrant(s) / Honoree *"
                placeholder="e.g. Kevin Kamau & Wanjiku Ochieng"
                value={celebrants}
                onChange={(e) => setCelebrants(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date *"
                placeholder="e.g. Saturday, 14 November 2026"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <Input
                label="Time *"
                placeholder="e.g. 2:00 PM EAT"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Venue Name *"
                placeholder="e.g. Safari Park Hotel, Thika Road"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />

              <Input
                label="City / Region *"
                placeholder="e.g. Nairobi, Kenya"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="RSVP Deadline *"
                placeholder="e.g. 1 November 2026"
                value={rsvpDeadline}
                onChange={(e) => setRsvpDeadline(e.target.value)}
                required
              />

              <Input
                label="Dress Code (Optional)"
                placeholder="e.g. Black Tie with African Royal Accents"
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button size="sm" variant="ghost" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              size="lg"
              variant="primary"
              onClick={handleFinishCreate}
              isLoading={isSubmitting}
              rightIcon={<Check className="w-4 h-4" />}
            >
              Create Event & Open Studio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewEventWizardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-brand-slate">Loading event wizard...</div>}>
      <NewEventWizardContent />
    </Suspense>
  );
}
