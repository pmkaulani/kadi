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
import { CountdownSection } from '@/components/invitations/CountdownSection';

import type { InvitationBlockConfig } from '@/lib/blocks/types';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

/**
 * The single canonical content-section renderer used across all contexts:
 * - Public guest page (/e/[slug])
 * - Live studio editor draft preview (DraftInvitationPreview)
 * - Template preview (/templates/[templateId])
 * - Private review links
 *
 * Renders structured blocks when provided, or falls back to legacy section keys.
 * Missing fields omit their sections elegantly without rendering blank placeholders.
 * Unknown block types fail safely and are omitted without crashing the page.
 */

export interface InvitationSectionsRendererProps {
  event: EventEntity;
  blocks?: InvitationBlockConfig[];
  sectionKeys?: string[];
  guestToken?: string;
  guestName?: string;
  previewMode?: boolean;
}

function buildCalendarData(event: EventEntity) {
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
  blocks,
  sectionKeys,
  guestToken,
  guestName,
  previewMode = false,
}: InvitationSectionsRendererProps) {
  // If structured blocks are provided, render via BlockRenderer
  if (blocks && blocks.length > 0) {
    return (
      <>
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            event={event}
            guestToken={guestToken}
            guestName={guestName}
            previewMode={previewMode}
          />
        ))}
      </>
    );
  }

  const activeKeys = sectionKeys || getDefaultInvitationSections(event.category);
  const calendar = buildCalendarData(event);
  const isMemorial = event.category === 'memorial' || event.category === 'funeral';
  const hasVenueInKeys = activeKeys.includes('venue');

  const renderSection = (key: string): React.ReactNode => {
    switch (key) {
      case 'hero':
      case 'welcome':
        // Physical envelope cover & hero card are handled by EnvelopeRenderer
        return null;

      case 'countdown': {
        if (!event.date) return null;
        return (
          <CountdownSection
            key={key}
            eventDate={event.date}
            eventTime={event.time}
            label={event.countdownLabel || 'Counting down to the celebration'}
            celebrants={event.celebrants}
          />
        );
      }

      case 'story': {
        const milestones = event.ourStoryMilestones?.length
          ? event.ourStoryMilestones
          : event.story
            ? [{ yearOrDate: 'A note from the hosts', title: 'Our story', story: event.story }]
            : [];
        return milestones.length ? <StorySection key={key} milestones={milestones} /> : null;
      }

      case 'ceremony': {
        if (event.ceremonyDetails || event.receptionDetails) {
          return (
            <CeremonyReceptionSection
              key={key}
              ceremony={event.ceremonyDetails}
              reception={event.receptionDetails}
              eventTitle={event.title}
              eventDate={event.date}
            />
          );
        }
        // If ceremony details are absent, only fall back to VenueSection if venue is NOT already in activeKeys
        if (!hasVenueInKeys && (event.venue || event.city)) {
          return (
            <VenueSection
              key={key}
              venue={event.venue}
              address={event.address}
              city={event.city}
              directionsNote={event.directionsNote}
              googleMapsUrl={event.googleMapsUrl}
              calendarData={calendar}
            />
          );
        }
        return null;
      }

      case 'venue': {
        if (!event.venue && !event.city) return null;
        return (
          <VenueSection
            key={key}
            venue={event.venue}
            address={event.address}
            city={event.city}
            directionsNote={event.directionsNote}
            googleMapsUrl={event.googleMapsUrl}
            calendarData={calendar}
          />
        );
      }

      case 'schedule':
        return event.programmeSchedule?.length ? (
          <ScheduleSection key={key} items={event.programmeSchedule} />
        ) : null;

      case 'about':
        return event.birthdayAbout || event.story ? (
          <BirthdayAboutSection
            key={key}
            celebrantName={event.celebrants}
            milestoneAge={event.milestoneAge}
            bio={event.birthdayAbout?.bio || event.story}
            facts={event.birthdayAbout?.facts}
            heading={event.birthdayAbout?.heading}
            heroImage={event.heroImage}
          />
        ) : null;

      case 'activities':
        return event.birthdayActivities?.length || event.birthdayMenu ? (
          <BirthdayActivitiesSection
            key={key}
            activities={event.birthdayActivities}
            menu={event.birthdayMenu}
          />
        ) : null;

      case 'obituary':
        return event.memorialObituary || event.story ? (
          <MemorialObituarySection
            key={key}
            honoreeName={event.celebrants}
            biography={event.memorialObituary?.biography || event.story || ''}
            birthDate={event.memorialObituary?.birthDate}
            deathDate={event.memorialObituary?.deathDate}
            epitaph={event.memorialObituary?.epitaph}
          />
        ) : null;

      case 'services':
        return event.memorialServices?.length ? (
          <MemorialServiceSection
            key={key}
            services={event.memorialServices}
            orderOfService={event.memorialOrderOfService}
          />
        ) : null;

      case 'livestream':
        return event.livestreamUrl ? (
          <MemorialLivestreamSection
            key={key}
            livestreamUrl={event.livestreamUrl}
            livestreamStatus={event.livestreamStatus}
            honoreeName={event.celebrants}
          />
        ) : null;

      case 'candles':
        return isMemorial ? (
          <MemorialTributesCandlesSection
            key={key}
            honoreeName={event.celebrants}
            initialCandlesCount={event.virtualCandlesCount}
          />
        ) : null;

      case 'condolences':
        return isMemorial ? (
          <CondolencesSection key={key} honoreeName={event.celebrants} />
        ) : null;

      case 'gallery':
        return event.galleryImages?.length ? (
          <GallerySection key={key} images={event.galleryImages} celebrants={event.celebrants} />
        ) : null;

      case 'faq':
        return event.faqItems?.length ? <FAQSection key={key} items={event.faqItems} /> : null;

      case 'registry':
        // Funeral events omit registry by default
        if (event.category === 'funeral') return null;
        return event.mpesaNumber ? (
          <RegistrySection
            key={key}
            mpesaType={event.mpesaType}
            mpesaNumber={event.mpesaNumber}
            recipientName={event.mpesaRecipient}
            accountReference={event.mpesaReference}
          />
        ) : null;

      case 'rsvp':
        return (
          <RSVPSection
            key={key}
            eventId={event.id}
            deadline={event.rsvpDeadline}
            guestToken={guestToken}
            defaultGuestName={guestName}
            allowedPlusOnes={previewMode ? 1 : undefined}
            previewMode={previewMode}
            customQuestions={event.customQuestions}
          />
        );

      case 'closing':
        return (
          <ClosingSection
            key={key}
            celebrants={event.celebrants}
            closingNote={
              isMemorial
                ? '“Held forever in our hearts, until we meet again.”'
                : undefined
            }
            calendarData={calendar}
          />
        );

      default:
        // Unknown block type fail-safe: log warning and omit without crashing
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[Kadi InvitationRenderer] Unknown section block type "${key}" safely omitted.`);
        }
        return null;
    }
  };

  return (
    <>
      {activeKeys.map((key) => (
        <React.Fragment key={key}>{renderSection(key)}</React.Fragment>
      ))}
    </>
  );
}
