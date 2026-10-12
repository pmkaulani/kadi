'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { getTemplateById, TEMPLATES } from '@/lib/templates/catalogue';
import { EnvelopeRenderer } from '@/components/animation/EnvelopeRenderer';
import { ScheduleSection } from '@/components/invitations/ScheduleSection';
import { VenueSection } from '@/components/invitations/VenueSection';
import { RSVPSection } from '@/components/invitations/RSVPSection';
import { RegistrySection } from '@/components/invitations/RegistrySection';
import { CondolencesSection } from '@/components/invitations/CondolencesSection';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';

export default function TemplateDetailPage() {
  const params = useParams();
  const templateId = params?.templateId as string;
  const template = getTemplateById(templateId);

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-mist text-center">
        <h1 className="text-2xl font-serif font-bold text-brand-charcoal">
          Template Not Found
        </h1>
        <p className="text-sm text-brand-slate mt-2 mb-6">
          The requested invitation template could not be located in our catalogue.
        </p>
        <Link href="/templates">
          <Button variant="primary">Return to Catalogue</Button>
        </Link>
      </div>
    );
  }

  const isMemorial = template.category === 'memorial';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner Control Bar */}
      <div className="sticky top-0 z-50 w-full bg-brand-charcoal/95 backdrop-blur-md text-white border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-serif font-bold text-white">
                {template.name}
              </h2>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
                Live Demo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Motion Preset: {template.motionPreset} • Liner: {template.liner.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/app/events/new?template=${template.id}`}>
            <Button
              size="sm"
              variant="gold"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Use This Design
            </Button>
          </Link>
        </div>
      </div>

      {/* Flagship Envelope Experience */}
      <div className="flex-1">
        <EnvelopeRenderer
          template={template}
          guestName="Hon. & Mrs. Anyango"
          isDemo={true}
        >
          {/* Real Scrollable Event Sections */}
          <ScheduleSection />
          <VenueSection
            venue={template.sampleData.venue}
            city={template.sampleData.city}
          />
          {isMemorial ? (
            <CondolencesSection honoreeName={template.sampleData.celebrants} />
          ) : (
            <RegistrySection />
          )}
          <RSVPSection
            eventId={template.id}
            defaultGuestName="Hon. & Mrs. Anyango"
            allowedPlusOnes={1}
          />
        </EnvelopeRenderer>
      </div>
    </div>
  );
}
