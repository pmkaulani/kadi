'use client';

import React from 'react';
import { getDefaultInvitationSections } from '@/lib/events/default-invitation-sections';
import type { EventEntity } from '@/lib/db/types';
import { ScheduleSection } from '@/components/invitations/ScheduleSection';
import { VenueSection } from '@/components/invitations/VenueSection';
import { CeremonyReceptionSection } from '@/components/invitations/CeremonyReceptionSection';
import { StorySection } from '@/components/invitations/StorySection';
import { GallerySection } from '@/components/invitations/GallerySection';
import { FAQSection } from '@/components/invitations/FAQSection';
import { BirthdayAboutSection } from '@/components/invitations/BirthdayAboutSection';
import { BirthdayActivitiesSection } from '@/components/invitations/BirthdayActivitiesSection';
import { MemorialObituarySection } from '@/components/invitations/MemorialObituarySection';
import { MemorialServiceSection } from '@/components/invitations/MemorialServiceSection';
import { MemorialTributesCandlesSection } from '@/components/invitations/MemorialTributesCandlesSection';
import { MemorialLivestreamSection } from '@/components/invitations/MemorialLivestreamSection';
import { CondolencesSection } from '@/components/invitations/CondolencesSection';
import { RSVPSection } from '@/components/invitations/RSVPSection';
import { RegistrySection } from '@/components/invitations/RegistrySection';
import { ClosingSection } from '@/components/invitations/ClosingSection';

/**
 * The one content-section renderer used by the public guest page, invitation
 * designer preview, and the new-invitation live preview. Keep section behavior
 * here so the editor cannot quietly drift away from the guest experience.
 */

interface InvitationSectionsRendererProps {
  event: EventEntity;
  sectionKeys?: string[];
  guestToken?: string;
  guestName?: string;
  previewMode?: boolean;
}

function calendarData(event: EventEntity) {
  return {
    title: event.title,
    description: `Invitation to ${event.title}`,
    location: [event.venue, event.city].filter(Boolean).join(', '),
    startDate: event.date,
    endDate: event.date,
  };
}

export function InvitationSectionsRenderer({
  event,
  sectionKeys,
  guestToken,
  guestName,
  previewMode = false,
}: InvitationSectionsRendererProps) {
  const activeKeys = sectionKeys || getDefaultInvitationSections(event.category);
  const calendar = calendarData(event);

  const renderSection = (key: string): React.ReactNode => {
    switch (key) {
      case 'hero':
      case 'welcome':
        // The physical envelope and hero cover are owned by EnvelopeRenderer.
        return null;
      case 'story': {
        const milestones = event.ourStoryMilestones?.length
          ? event.ourStoryMilestones
          : event.story
            ? [{ yearOrDate: 'A note from the hosts', title: 'Our story', story: event.story }]
            : [];
        return milestones.length ? <StorySection key={key} milestones={milestones} /> : null;
      }
      case 'ceremony':
        if (event.ceremonyDetails || event.receptionDetails) {
          return <CeremonyReceptionSection key={key} ceremony={event.ceremonyDetails} reception={event.receptionDetails} eventTitle={event.title} eventDate={event.date} />;
        }
        return <VenueSection key={key} venue={event.venue} address={event.address} city={event.city} directionsNote={event.directionsNote} googleMapsUrl={event.googleMapsUrl} calendarData={calendar} />;
      case 'venue':
        return <VenueSection key={key} venue={event.venue} address={event.address} city={event.city} directionsNote={event.directionsNote} googleMapsUrl={event.googleMapsUrl} calendarData={calendar} />;
      case 'schedule':
        return event.programmeSchedule?.length ? <ScheduleSection key={key} items={event.programmeSchedule} /> : null;
      case 'about':
        return (event.birthdayAbout || event.story) ? <BirthdayAboutSection key={key} celebrantName={event.celebrants} milestoneAge={event.milestoneAge} bio={event.birthdayAbout?.bio || event.story} facts={event.birthdayAbout?.facts} heading={event.birthdayAbout?.heading} heroImage={event.heroImage} /> : null;
      case 'activities':
        return (event.birthdayActivities?.length || event.birthdayMenu) ? <BirthdayActivitiesSection key={key} activities={event.birthdayActivities} menu={event.birthdayMenu} /> : null;
      case 'obituary':
        return (event.memorialObituary || event.story) ? <MemorialObituarySection key={key} honoreeName={event.celebrants} biography={event.memorialObituary?.biography || event.story || ''} birthDate={event.memorialObituary?.birthDate} deathDate={event.memorialObituary?.deathDate} epitaph={event.memorialObituary?.epitaph} /> : null;
      case 'services':
        return event.memorialServices?.length ? <MemorialServiceSection key={key} services={event.memorialServices} orderOfService={event.memorialOrderOfService} /> : null;
      case 'livestream':
        return event.livestreamUrl ? <MemorialLivestreamSection key={key} livestreamUrl={event.livestreamUrl} livestreamStatus={event.livestreamStatus} honoreeName={event.celebrants} /> : null;
      case 'candles':
        return (event.category === 'memorial' || event.category === 'funeral') ? <MemorialTributesCandlesSection key={key} honoreeName={event.celebrants} initialCandlesCount={event.virtualCandlesCount} /> : null;
      case 'condolences':
        return (event.category === 'memorial' || event.category === 'funeral') ? <CondolencesSection key={key} honoreeName={event.celebrants} /> : null;
      case 'gallery':
        return event.galleryImages?.length ? <GallerySection key={key} images={event.galleryImages} celebrants={event.celebrants} /> : null;
      case 'faq':
        return event.faqItems?.length ? <FAQSection key={key} items={event.faqItems} /> : null;
      case 'registry':
        return event.mpesaNumber ? <RegistrySection key={key} mpesaType={event.mpesaType} mpesaNumber={event.mpesaNumber} recipientName={event.mpesaRecipient} accountReference={event.mpesaReference} /> : null;
      case 'rsvp':
        return <RSVPSection key={key} eventId={event.id} deadline={event.rsvpDeadline} guestToken={guestToken} defaultGuestName={guestName} allowedPlusOnes={previewMode ? 1 : undefined} previewMode={previewMode} />;
      case 'closing':
        return <ClosingSection key={key} celebrants={event.celebrants} closingNote={event.category === 'memorial' || event.category === 'funeral' ? 'Held in memory. Held together.' : undefined} calendarData={calendar} />;
      default:
        return null;
    }
  };

  return <>{activeKeys.map((key) => <React.Fragment key={key}>{renderSection(key)}</React.Fragment>)}</>;
}
