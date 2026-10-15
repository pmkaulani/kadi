'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EventService } from '@/lib/services/event-service';
import { GuestService } from '@/lib/services/guest-service';
import { getTemplateById } from '@/lib/templates/catalogue';
import { EnvelopeRenderer } from '@/components/animation/EnvelopeRenderer';
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
import { InvitationThemeScope } from '@/components/invitations/InvitationThemeScope';
import { Button } from '@/components/ui/Button';

function GuestInvitationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const token = searchParams.get('tok') || undefined;
  const phaseParam = searchParams.get('phase') as 'closed' | 'seal-press' | 'seal-release' | 'flap-open' | 'card-rising' | 'settling' | 'settled' | null;

  const event = EventService.getEventBySlug(slug);
  const guestHousehold = token ? GuestService.getGuestByToken(token) : undefined;
  const template = getTemplateById(event?.templateId || 'savannah-twilight');
  const design = event ? EventService.getEventDesign(event.id) : undefined;

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

  // Determine active section order
  const defaultSectionsByCategory: Record<string, string[]> = {
    wedding: ['story', 'ceremony', 'schedule', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
    birthday: ['about', 'activities', 'schedule', 'gallery', 'rsvp', 'faq', 'registry', 'closing'],
    memorial: ['obituary', 'services', 'livestream', 'candles', 'condolences', 'rsvp', 'registry', 'closing'],
    funeral: ['obituary', 'services', 'livestream', 'candles', 'condolences', 'rsvp', 'closing'],
    housewarming: ['venue', 'schedule', 'story', 'gallery', 'faq', 'rsvp', 'closing'],
    graduation: ['ceremony', 'schedule', 'story', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
    corporate: ['schedule', 'venue', 'faq', 'rsvp', 'closing'],
    anniversary: ['story', 'ceremony', 'schedule', 'gallery', 'rsvp', 'closing'],
    'baby-shower': ['about', 'activities', 'registry', 'rsvp', 'closing'],
    holiday: ['activities', 'schedule', 'rsvp', 'closing'],
  };

  const activeSectionKeys =
    design?.sectionOrder ||
    design?.visibleSections ||
    defaultSectionsByCategory[event.category] || [
      'venue',
      'schedule',
      'gallery',
      'faq',
      'registry',
      'rsvp',
      'closing',
    ];

  // Map section keys to actual rendered components
  const renderSection = (key: string) => {
    switch (key) {
      case 'story':
        if (!event.ourStoryMilestones || event.ourStoryMilestones.length === 0) return null;
        return <StorySection key="story" milestones={event.ourStoryMilestones} />;

      case 'ceremony':
        if (event.ceremonyDetails || event.receptionDetails) {
          return (
            <CeremonyReceptionSection
              key="ceremony"
              ceremony={event.ceremonyDetails}
              reception={event.receptionDetails}
              eventTitle={event.title}
              eventDate={event.date}
            />
          );
        }
        return (
          <VenueSection
            key="venue"
            venue={event.venue}
            address={event.address}
            city={event.city}
            directionsNote={event.directionsNote}
            googleMapsUrl={event.googleMapsUrl}
            calendarData={{
              title: event.title,
              description: `Invitation to ${event.title}`,
              location: `${event.venue}, ${event.city}`,
              startDate: event.date,
              endDate: event.date,
            }}
          />
        );

      case 'venue':
        return (
          <VenueSection
            key="venue"
            venue={event.venue}
            address={event.address}
            city={event.city}
            directionsNote={event.directionsNote}
            googleMapsUrl={event.googleMapsUrl}
            calendarData={{
              title: event.title,
              description: `Invitation to ${event.title}`,
              location: `${event.venue}, ${event.city}`,
              startDate: event.date,
              endDate: event.date,
            }}
          />
        );

      case 'schedule':
        return <ScheduleSection key="schedule" items={event.programmeSchedule} />;

      case 'about':
        return (
          <BirthdayAboutSection
            key="about"
            celebrantName={event.celebrants}
            milestoneAge={event.milestoneAge}
            bio={event.birthdayAbout?.bio || event.story}
            facts={event.birthdayAbout?.facts}
            heading={event.birthdayAbout?.heading}
            heroImage={event.heroImage}
          />
        );

      case 'activities':
        return (
          <BirthdayActivitiesSection
            key="activities"
            activities={event.birthdayActivities}
            menu={event.birthdayMenu}
          />
        );

      case 'obituary':
        return (
          <MemorialObituarySection
            key="obituary"
            honoreeName={event.celebrants}
            biography={event.memorialObituary?.biography || event.story || ''}
            birthDate={event.memorialObituary?.birthDate}
            deathDate={event.memorialObituary?.deathDate}
            epitaph={event.memorialObituary?.epitaph}
          />
        );

      case 'services':
        return (
          <MemorialServiceSection
            key="services"
            services={event.memorialServices}
            orderOfService={event.memorialOrderOfService}
          />
        );

      case 'livestream':
        return (
          <MemorialLivestreamSection
            key="livestream"
            livestreamUrl={event.livestreamUrl}
            livestreamStatus={event.livestreamStatus}
            honoreeName={event.celebrants}
          />
        );

      case 'candles':
        return (
          <MemorialTributesCandlesSection
            key="candles"
            honoreeName={event.celebrants}
            initialCandlesCount={event.virtualCandlesCount}
          />
        );

      case 'condolences':
        return <CondolencesSection key="condolences" honoreeName={event.celebrants} />;

      case 'gallery':
        if (!event.galleryImages || event.galleryImages.length === 0) return null;
        return (
          <GallerySection
            key="gallery"
            images={event.galleryImages}
            celebrants={event.celebrants}
          />
        );

      case 'faq':
        return <FAQSection key="faq" items={event.faqItems} />;

      case 'registry':
        if (!event.mpesaNumber) return null;
        return (
          <RegistrySection
            key="registry"
            mpesaType={event.mpesaType}
            mpesaNumber={event.mpesaNumber}
            recipientName={event.mpesaRecipient}
            accountReference={event.mpesaReference}
          />
        );

      case 'rsvp':
        return (
          <RSVPSection
            key="rsvp"
            eventId={event.id}
            deadline={event.rsvpDeadline}
            guestToken={token}
            defaultGuestName={guestHousehold?.displayName}
            allowedPlusOnes={guestHousehold?.allowedPlusOnes ?? 1}
          />
        );

      case 'closing':
        return (
          <ClosingSection
            key="closing"
            celebrants={event.celebrants}
            closingNote={
              event.category === 'memorial'
                ? '“Held forever in our hearts, until we meet again.”'
                : undefined
            }
            calendarData={{
              title: event.title,
              description: `Invitation to ${event.title}`,
              location: `${event.venue}, ${event.city}`,
              startDate: event.date,
              endDate: event.date,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <InvitationThemeScope template={template} className="min-h-screen flex flex-col">
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
            galleryImages: event.galleryImages || [],
            milestoneAge: event.milestoneAge,
            story: event.story,
          },
        }}
        guestName={guestHousehold?.displayName}
        audioUrl={event.audioUrl}
        initialPhase={phaseParam || undefined}
      >
        {activeSectionKeys.map(renderSection)}
      </EnvelopeRenderer>
    </InvitationThemeScope>
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
