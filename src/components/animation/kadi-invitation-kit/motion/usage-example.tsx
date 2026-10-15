'use client';

import {
  AnimatedFAQ,
  AnimatedTimeline,
  EnvelopeExperience,
  GiftSelector,
  HeroImageReveal,
  InvitationClosing,
  MaskReveal,
  ParallaxImage,
  PhotoMasonry,
  RSVPEntrance,
  ScrollReveal,
  SectionWipe,
  StaggeredText,
} from '../index';
import type { FAQItem, GiftChoice, GalleryImage, TimelineEntry } from '../types';

/**
 * Reference-only composition. Replace all sample copy and image URLs with the current event record.
 * Keep Kadi's existing RSVP handler, contribution flow, venue links and server data intact.
 */
export function InvitationMotionExamples({
  heroImage,
  galleryImages,
  timelineItems,
  faqItems,
  giftChoices,
  onRsvpSubmit,
}: {
  heroImage: { src: string; alt: string };
  galleryImages: GalleryImage[];
  timelineItems: TimelineEntry[];
  faqItems: FAQItem[];
  giftChoices: GiftChoice[];
  onRsvpSubmit: () => void;
}) {
  return (
    <main className="ke-example-page">
      <SectionWipe wipe="paper" className="ke-example-hero">
        <HeroImageReveal src={heroImage.src} alt={heroImage.alt} />
        <StaggeredText text="A moment worth remembering" as="h1" by="word" />
        <ScrollReveal preset="fade-up"><p>Put the event&apos;s real opening message here.</p></ScrollReveal>
      </SectionWipe>

      <section className="ke-example-chapter">
        <ScrollReveal preset="mask-left"><h2>How the story began</h2></ScrollReveal>
        <AnimatedTimeline items={timelineItems} />
      </section>

      <section className="ke-example-chapter">
        <ScrollReveal preset="scale-in"><h2>Little moments</h2></ScrollReveal>
        <PhotoMasonry images={galleryImages} />
        {galleryImages[0] && <ParallaxImage src={galleryImages[0].src} alt={galleryImages[0].alt} maxShift={16} />}
      </section>

      <section className="ke-example-chapter">
        <GiftSelector choices={giftChoices} />
        <MaskReveal direction="diagonal"><div className="ke-example-note">Add a message, programme, venue or detail passage from the event record.</div></MaskReveal>
      </section>

      <RSVPEntrance title="Kindly reply" note="The form stays interactive as soon as it appears.">
        <form onSubmit={(event) => { event.preventDefault(); onRsvpSubmit(); }}>
          <label htmlFor="ke-example-guest">Guest name</label>
          <input id="ke-example-guest" name="guest" autoComplete="name" required />
          <button type="submit">Send response</button>
        </form>
      </RSVPEntrance>

      <section className="ke-example-chapter">
        <ScrollReveal><h2>Questions</h2></ScrollReveal>
        <AnimatedFAQ items={faqItems} />
      </section>

      <InvitationClosing title="Until we meet" message="Use the real event closing message." />
    </main>
  );
}

export default InvitationMotionExamples;
