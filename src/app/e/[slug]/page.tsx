'use client';

import React, { Suspense, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EventService } from '@/lib/services/event-service';
import { GuestService } from '@/lib/services/guest-service';
import { getTemplateById } from '@/lib/templates/catalogue';
import { type AnimationPhase } from '@/components/animation/EnvelopeRenderer';
import { InvitationRenderer } from '@/components/invitations/InvitationRenderer';
import { buildPublishedInvitationConfig } from '@/lib/invitations/config';
import { NotificationService } from '@/lib/services/notification-service';
import { Button } from '@/components/ui/Button';

function GuestInvitationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const token = searchParams.get('tok') || undefined;
  const phaseParam = searchParams.get('phase') as AnimationPhase | null;

  const event = EventService.getEventBySlug(slug);

  // Security gate: draft events strictly require a valid, signed, unexpired preview token
  const isDraft = event?.status === 'draft';
  const isAuthorizedDraft =
    isDraft &&
    Boolean(token && token.startsWith('prev_') && NotificationService.verifyPreviewToken(token, event.id));

  const isArchived = event?.status === 'archived';

  const guestHousehold = token && !token.startsWith('prev_') ? GuestService.getGuestByToken(token) : undefined;
  const template = getTemplateById(event?.templateId || 'savannah-twilight');
  const design = event ? EventService.getEventDesign(event.id) : undefined;

  const config = useMemo(() => {
    if (!event || !template) return null;
    const baseConfig = buildPublishedInvitationConfig(event, template, {
      design,
      guestHousehold,
      guestToken: token,
      initialPhase: phaseParam || undefined,
    });
    // In draft preview mode, mark config as read-only to prevent public mutations
    if (isDraft) {
      baseConfig.isReadOnly = true;
      baseConfig.mode = 'draft-preview';
    }
    return baseConfig;
  }, [event, template, design, guestHousehold, token, phaseParam, isDraft]);

  // Privacy-safe anonymous page view attribution
  React.useEffect(() => {
    if (event && !isDraft && !isArchived) {
      const source = searchParams.get('src') || 'direct';
      fetch(`/api/events/${event.id}/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source }),
      }).catch(() => {});
    }
  }, [event, isDraft, isArchived, searchParams]);

  if (!event || !template || (isDraft && !isAuthorizedDraft) || isArchived || !config) {
    const isUnauthDraft = isDraft && !isAuthorizedDraft;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F6F2EA] text-[#272620] text-center">
        <Link href="/" className="mb-8" aria-label="Kadi home">
          <span className="font-serif italic text-3xl text-[#934638] font-bold">kadi.</span>
        </Link>
        <p className="kadi-eyebrow text-[#934638] mb-3">
          {isUnauthDraft
            ? 'Private Draft · Authorization Required'
            : isArchived
              ? 'Concluded Gathering'
              : 'Stationery Not Found'}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#272620] mb-3 tracking-[-0.03em]">
          {isUnauthDraft
            ? 'This invitation is still being prepared.'
            : isArchived
              ? 'This celebration has concluded.'
              : 'This invitation could not be found.'}
        </h1>
        <p className="text-xs sm:text-sm text-[#756F64] mt-1 mb-8 max-w-md leading-relaxed">
          {isUnauthDraft
            ? 'The host has not yet opened this invitation to the public. If you are the host or an authorized reviewer, use your private review link from the studio.'
            : isArchived
              ? 'This occasion has concluded and the invitation has been safely archived by the host.'
              : 'The link you requested may have been updated with a new address or removed.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/" className="kadi-button">
            <span>Visit Kadi Homepage</span>
          </Link>
          {isUnauthDraft && (
            <Link href="/login" className="kadi-button kadi-button--quiet">
              <span>Sign in as Host</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <InvitationRenderer config={config} />
    </div>
  );
}

export default function GuestInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-mist">
          <div className="w-8 h-8 border-2 border-brand-terracotta border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GuestInvitationContent />
    </Suspense>
  );
}
