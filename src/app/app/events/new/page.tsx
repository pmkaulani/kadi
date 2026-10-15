'use client';

import React, { useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EventService } from '@/lib/services/event-service';
import { TEMPLATES, getTemplateById } from '@/lib/templates/catalogue';
import { KadiStudioEditor, type StudioDraft } from '@/components/studio/KadiStudioEditor';
import { Modal } from '@/components/ui/Modal';
import { type EventEntity } from '@/lib/db/types';
import { ArrowLeft, CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react';

function NewEventStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('templateId') || searchParams.get('template');
  const matchedTemplate = getTemplateById(templateParam || 'sage-botanical') || TEMPLATES[0];

  const createdEventIdRef = useRef<string | null>(null);
  const [publishedEvent, setPublishedEvent] = useState<EventEntity | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSaveDraft = async (draft: StudioDraft, revision: number) => {
    if (!createdEventIdRef.current) {
      // First persistence creates the durable draft event entity
      const newEvent = EventService.createEvent({
        title: draft.values.title,
        hosts: draft.values.hosts,
        celebrants: draft.values.celebrants,
        category: draft.category as any,
        templateId: draft.templateId,
        date: draft.values.date,
        time: draft.values.time,
        timezone: draft.values.timezone || 'Africa/Nairobi',
        venue: draft.values.venue,
        city: draft.values.city,
        heroImage: draft.values.heroImage,
        rsvpDeadline: draft.values.rsvpDeadline,
        dressCode: draft.values.dressCode,
        audioUrl: draft.values.audioUrl,
        mpesaType: draft.values.mpesaType,
        mpesaNumber: draft.values.mpesaNumber,
        mpesaRecipient: draft.values.mpesaRecipient,
        mpesaReference: draft.values.mpesaReference,
      });
      createdEventIdRef.current = newEvent.id;
      EventService.updateDesign(newEvent.id, draft.design);
    } else {
      // Subsequent debounced updates persist to the existing draft entity
      EventService.updateEvent(createdEventIdRef.current, {
        title: draft.values.title,
        hosts: draft.values.hosts,
        celebrants: draft.values.celebrants,
        category: draft.category as any,
        templateId: draft.templateId,
        date: draft.values.date,
        time: draft.values.time,
        venue: draft.values.venue,
        city: draft.values.city,
        heroImage: draft.values.heroImage,
        rsvpDeadline: draft.values.rsvpDeadline,
        dressCode: draft.values.dressCode,
        audioUrl: draft.values.audioUrl,
        mpesaType: draft.values.mpesaType,
        mpesaNumber: draft.values.mpesaNumber,
        mpesaRecipient: draft.values.mpesaRecipient,
        mpesaReference: draft.values.mpesaReference,
      });
      EventService.updateDesign(createdEventIdRef.current, draft.design);
    }
  };

  const handlePublish = async () => {
    let eventId = createdEventIdRef.current;
    if (!eventId) {
      // Create if user immediately clicks publish before debounce fires
      const newEvent = EventService.createEvent({
        title: matchedTemplate.sampleData.title,
        hosts: matchedTemplate.sampleData.hosts,
        celebrants: matchedTemplate.sampleData.celebrants,
        category: matchedTemplate.category as any,
        templateId: matchedTemplate.id,
        date: matchedTemplate.sampleData.date,
        time: matchedTemplate.sampleData.time,
        venue: matchedTemplate.sampleData.venue,
        city: matchedTemplate.sampleData.city,
        heroImage: matchedTemplate.sampleData.heroImage,
      });
      eventId = newEvent.id;
      createdEventIdRef.current = newEvent.id;
    }

    const pub = EventService.publishEvent(eventId);
    setPublishedEvent(pub);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto py-2 px-2 sm:px-4 flex flex-col h-[calc(100vh-80px)]">
      {/* Top back navigation */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(39,38,32,0.08)] shrink-0">
        <Link
          href="/app/events"
          className="inline-flex items-center gap-1.5 text-xs text-[#756F64] hover:text-[#934638] font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to dashboard</span>
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C8375]">
          New Invitation
        </span>
      </div>

      <div className="flex-1 min-h-0">
        <KadiStudioEditor
          template={matchedTemplate}
          availableTemplates={TEMPLATES}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
        />
      </div>

      {publishedEvent && (
        <Modal
          isOpen={true}
          onClose={() => router.push(`/app/events/${publishedEvent.id}`)}
          title="Invitation Published & Live!"
          description="Your gathering is now open for guests to view and reply."
          maxWidth="md"
        >
          <div className="space-y-5 py-2">
            <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <div className="text-xs leading-relaxed">
                <strong>{publishedEvent.title}</strong> is now live. Guests visiting your invitation link can open the envelope and RSVP.
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8D867A] mb-1.5">
                Live Public Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/e/${publishedEvent.slug}`}
                  className="flex-1 text-xs bg-black/5 border border-[rgba(39,38,32,0.15)] rounded-lg px-3 py-2 text-[#272620] select-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(`${window.location.origin}/e/${publishedEvent.slug}`);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }
                  }}
                  className="kadi-button !py-2 !px-3 text-xs shrink-0"
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(39,38,32,0.1)] flex flex-col sm:flex-row gap-3">
              <Link
                href={`/app/events/${publishedEvent.id}?tab=guests`}
                className="kadi-button flex-1 justify-center text-xs"
              >
                <span>Manage Guests &amp; Send</span>
              </Link>
              <a
                href={`/e/${publishedEvent.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="kadi-button kadi-button--quiet flex-1 justify-center text-xs inline-flex items-center gap-1.5"
              >
                <span>View Live Invitation</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function NewEventStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#756F64]">
          Loading Studio…
        </div>
      }
    >
      <NewEventStudioContent />
    </Suspense>
  );
}
