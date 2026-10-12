'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EventService } from '@/lib/services/event-service';
import { GuestService } from '@/lib/services/guest-service';
import { getTemplateById } from '@/lib/templates/catalogue';
import { EnvelopeRenderer } from '@/components/animation/EnvelopeRenderer';
import { ScheduleSection } from '@/components/invitations/ScheduleSection';
import { VenueSection } from '@/components/invitations/VenueSection';
import { RSVPSection } from '@/components/invitations/RSVPSection';
import { RegistrySection } from '@/components/invitations/RegistrySection';
import { CondolencesSection } from '@/components/invitations/CondolencesSection';
import { Button } from '@/components/ui/Button';
import { Share2, Check, Smartphone, ArrowLeft } from 'lucide-react';

function GuestInvitationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const token = searchParams.get('tok') || undefined;

  const [copiedLink, setCopiedLink] = useState(false);

  const event = EventService.getEventBySlug(slug);
  const guestHousehold = token ? GuestService.getGuestByToken(token) : undefined;
  const template = getTemplateById(event?.templateId || 'savannah-twilight');

  if (!event || !template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-mist text-center">
        <h1 className="text-2xl font-serif font-bold text-brand-charcoal">
          Invitation Not Found
        </h1>
        <p className="text-sm text-brand-slate mt-2 mb-6">
          The link you requested may have been archived or updated by the host.
        </p>
        <Link href="/">
          <Button variant="primary">Visit Kadi Homepage</Button>
        </Link>
      </div>
    );
  }

  const isMemorial = event.category === 'memorial';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleNativeShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: event.title,
        text: `You're warmly invited to ${event.title}! Open your digital invitation:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Floating Bottom Quick Actions for Guest */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-brand-charcoal/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-white/10 text-white">
        <button
          onClick={handleNativeShare}
          className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-purple hover:bg-brand-purple-hover transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 text-slate-200 transition-colors"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
          <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
        </button>

        <a
          href="#rsvp-section"
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-gold text-brand-charcoal hover:bg-amber-400 transition-colors ml-1"
        >
          RSVP
        </a>
      </div>

      {/* Flagship Signature Animated Invitation Renderer */}
      <EnvelopeRenderer
        template={{
          ...template,
          sampleData: {
            title: event.title,
            subtitle: event.subtitle,
            hosts: event.hosts,
            celebrants: event.celebrants,
            date: event.date,
            time: event.time,
            venue: event.venue,
            city: event.city,
            heroImage: event.heroImage,
            story: event.story,
          },
        }}
        guestName={guestHousehold?.displayName}
        audioUrl={event.audioUrl}
      >
        {/* Real Live Sections */}
        <ScheduleSection />

        <VenueSection
          venue={event.venue}
          address={event.address}
          city={event.city}
          directionsNote={event.directionsNote}
          calendarData={{
            title: event.title,
            description: `Invitation to ${event.title}`,
            location: `${event.venue}, ${event.city}`,
            startDate: event.date,
            endDate: event.date,
          }}
        />

        {isMemorial ? (
          <CondolencesSection honoreeName={event.celebrants} />
        ) : (
          <RegistrySection
            mpesaType={event.mpesaType}
            mpesaNumber={event.mpesaNumber}
            recipientName={event.mpesaRecipient}
            accountReference={event.mpesaReference}
          />
        )}

        <RSVPSection
          eventId={event.id}
          deadline={event.rsvpDeadline}
          guestToken={token}
          defaultGuestName={guestHousehold?.displayName}
          allowedPlusOnes={guestHousehold?.allowedPlusOnes ?? 1}
        />
      </EnvelopeRenderer>
    </div>
  );
}

export default function GuestInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-charcoal flex items-center justify-center text-white text-xs">
          Loading invitation...
        </div>
      }
    >
      <GuestInvitationContent />
    </Suspense>
  );
}
