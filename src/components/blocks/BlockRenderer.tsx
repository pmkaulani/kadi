'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Calendar as CalendarIcon,
  ExternalLink,
  Copy,
  Check,
  Play,
  Pause,
  Clock,
  HelpCircle,
  Radio,
  Quote,
  Heart,
  ChevronDown,
  Camera,
  Maximize2,
} from 'lucide-react';
import type { InvitationBlockConfig } from '@/lib/blocks/types';
import { BlockWrapper } from './BlockWrapper';
import { sanitizeUrl, sanitizeVideoUrl, sanitizeLivestreamUrl } from '@/lib/blocks/registry';
import { GalleryLightbox } from '@/components/animation/MotionToolkit';
import { CountdownSection } from '@/components/invitations/CountdownSection';
import { VenueSection } from '@/components/invitations/VenueSection';
import { RSVPSection } from '@/components/invitations/RSVPSection';
import { RegistrySection } from '@/components/invitations/RegistrySection';
import type { EventEntity } from '@/lib/db/types';

export interface BlockRendererProps {
  block: InvitationBlockConfig;
  event: EventEntity;
  guestToken?: string;
  guestName?: string;
  previewMode?: boolean;
}

function BlockGallery({
  content,
  settings,
  id,
  previewMode,
}: {
  content: any;
  settings: any;
  id: string;
  previewMode?: boolean;
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const rawImages = content.images || [];

  const images = (Array.isArray(rawImages) ? rawImages : []).map((img: any, idx: number) => {
    let url = typeof img === 'string' ? img : img?.url || '';
    if (url.includes('1586075010923') || !url) {
      url = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
    }
    return {
      url,
      caption: typeof img === 'object' && img?.caption ? img.caption : (idx === 0 ? 'Featured Moment' : `Memory ${idx + 1}`),
      alt: typeof img === 'object' && (img?.alt || img?.caption) ? (img.alt || img.caption) : `Gallery photo ${idx + 1}`,
    };
  });

  if (images.length === 0) return null;

  const heroImage = images[0];
  const secondaryImages = images.slice(1);

  return (
    <BlockWrapper settings={settings} id={id} previewMode={previewMode}>
      <div className="space-y-4">
        {/* Editorial Title & Subtitle */}
        <div className="text-center space-y-1">
          {content.subtitle && (
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--event-primary,#934638)]">
              {content.subtitle}
            </p>
          )}
          {content.title && (
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--event-ink,#272620)]">
              {content.title}
            </h2>
          )}
          <div className="text-center text-[#B99A62] text-xs py-0.5 select-none" aria-hidden="true">
            ✦ ─── ❦ ─── ✦
          </div>
        </div>

        {/* Dynamic Editorial Photo Layout (Bigger, High-Impact & Interesting) */}
        {images.length === 1 ? (
          <div
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-white p-2 border border-[#B99A62]/35 shadow-sm group cursor-pointer"
            onClick={() => setSelectedPhotoIndex(0)}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src={heroImage.url}
                alt={heroImage.alt}
                fill
                sizes="(max-width: 640px) 100vw, 768px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5 text-white">
                <span className="text-xs font-serif italic">{heroImage.caption}</span>
                <span className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <Maximize2 size={14} />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {/* Grand Hero Photo (Takes Full Available Width, Much Bigger) */}
            <div
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-white p-2 border border-[#B99A62]/35 shadow-md group cursor-pointer"
              onClick={() => setSelectedPhotoIndex(0)}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 768px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-widest text-white font-medium flex items-center gap-1.5">
                  <Camera size={12} className="text-[#B99A62]" />
                  <span>Featured Moment</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5 text-white">
                  <span className="text-xs font-serif italic">{heroImage.caption}</span>
                  <span className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <Maximize2 size={14} />
                  </span>
                </div>
              </div>
            </div>

            {/* Paired Curated Duo Grid (Side-by-Side with Polaroid Matting & Subtle Angle) */}
            {secondaryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                {secondaryImages.map((img: any, i: number) => {
                  const actualIdx = i + 1;
                  const tiltClass = i % 2 === 0 ? '-rotate-1 hover:rotate-0' : 'rotate-1 hover:rotate-0';
                  return (
                    <div
                      key={actualIdx}
                      onClick={() => setSelectedPhotoIndex(actualIdx)}
                      className={`group cursor-pointer transition-all duration-300 transform ${tiltClass} bg-white p-2 rounded-2xl border border-[rgba(185,154,98,0.3)] shadow-xs hover:shadow-md hover:scale-[1.02]`}
                    >
                      <div className="relative aspect-[4/5] sm:aspect-square rounded-xl overflow-hidden bg-[#FAF8F5]">
                        <Image
                          src={img.url}
                          alt={img.alt}
                          fill
                          sizes="(max-width: 640px) 50vw, 360px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 size={12} />
                        </div>
                      </div>
                      {img.caption && (
                        <p className="mt-2 text-center text-[11px] font-serif italic text-[#756F64] truncate px-1">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedPhotoIndex !== null && (
          <GalleryLightbox
            photos={images.map((img: any) => img.url)}
            selectedIndex={selectedPhotoIndex}
            onClose={() => setSelectedPhotoIndex(null)}
            onSelectIndex={(idx) => setSelectedPhotoIndex(idx)}
          />
        )}
      </div>
    </BlockWrapper>
  );
}

export function BlockRenderer({
  block,
  event,
  guestToken,
  guestName,
  previewMode = false,
}: BlockRendererProps) {
  if (!block.enabled) return null;

  const { type, settings, content } = block;

  switch (type) {
    case 'hero': {
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <div className="space-y-4">
            {content.tagline && (
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--event-accent,#934638)]">
                {content.tagline}
              </p>
            )}
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[var(--event-ink,#272620)] leading-tight">
              {content.title || event.title}
            </h1>
            {content.celebrants && (
              <p className="font-serif italic text-xl sm:text-2xl text-[var(--event-ink,#272620)] opacity-90">
                {content.celebrants}
              </p>
            )}
            {content.subtitle && (
              <p className="text-sm sm:text-base text-[var(--event-ink,#272620)] opacity-80 max-w-lg mx-auto">
                {content.subtitle}
              </p>
            )}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs tracking-wide text-[var(--event-ink,#272620)] opacity-85">
              {(content.date || event.date) && (
                <span className="flex items-center gap-1.5 font-medium">
                  <CalendarIcon size={14} className="text-[var(--event-accent,#934638)]" />
                  {content.date || event.date}
                </span>
              )}
              {(content.time || event.time) && <span>· {content.time || event.time}</span>}
              {(content.venue || event.venue) && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[var(--event-accent,#934638)]" />
                  {[content.venue || event.venue, content.city || event.city].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>
        </BlockWrapper>
      );
    }

    case 'rich-text': {
      const paragraphs = (content.body || '').split('\n\n').filter(Boolean);
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <div className="space-y-4">
            {content.subheading && (
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--event-accent,#934638)]">
                {content.subheading}
              </p>
            )}
            {content.headline && (
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--event-ink,#272620)]">
                {content.headline}
              </h2>
            )}
            <div className="space-y-3 text-sm sm:text-base leading-relaxed text-[var(--event-ink,#272620)] opacity-90 font-light">
              {paragraphs.map((p: string, idx: number) => (
                <p key={idx} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </BlockWrapper>
      );
    }

    case 'photo': {
      const aspectClasses =
        content.aspectRatio === '16:9'
          ? 'aspect-video'
          : content.aspectRatio === '4:3'
            ? 'aspect-[4/3]'
            : content.aspectRatio === '1:1'
              ? 'aspect-square'
              : content.aspectRatio === 'portrait'
                ? 'aspect-[3/4]'
                : 'min-h-[260px] sm:min-h-[380px]';

      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <figure className="space-y-2.5">
            <div className={`relative w-full ${aspectClasses} rounded-lg overflow-hidden shadow-sm border border-[rgba(39,38,32,0.12)] bg-[#FAF8F5]`}>
              {content.imageUrl ? (
                <Image
                  src={content.imageUrl}
                  alt={content.altText || content.caption || 'Featured event photo'}
                  fill
                  sizes="(max-width: 768px) 100vw, 680px"
                  className="object-cover"
                  style={{ objectPosition: content.focalPoint || 'center center' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#8C8375]">
                  No photo selected
                </div>
              )}
            </div>
            {content.caption && (
              <figcaption className="text-xs italic text-[var(--event-ink,#272620)] opacity-75 font-serif">
                {content.caption}
              </figcaption>
            )}
          </figure>
        </BlockWrapper>
      );
    }

    case 'gallery': {
      return (
        <BlockGallery
          content={content}
          settings={settings}
          id={block.id}
          previewMode={previewMode}
        />
      );
    }

    case 'video': {
      const sanitized = sanitizeVideoUrl(content.videoId || content.url);
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <div className="space-y-3">
            {content.title && (
              <h2 className="font-serif text-2xl font-medium text-[var(--event-ink,#272620)]">
                {content.title}
              </h2>
            )}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black/5 border border-[rgba(39,38,32,0.12)] shadow-sm">
              {sanitized ? (
                <iframe
                  src={sanitized.embedUrl}
                  title={content.title || 'Video player'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[#8C8375] p-6 text-center">
                  <p className="font-medium text-[#272620]">Video unavailable</p>
                  <p className="text-[11px] mt-1">
                    Only verified YouTube or Vimeo video URLs are permitted for guest security.
                  </p>
                </div>
              )}
            </div>
            {content.caption && (
              <p className="text-xs text-[var(--event-ink,#272620)] opacity-75 italic font-serif">
                {content.caption}
              </p>
            )}
          </div>
        </BlockWrapper>
      );
    }

    case 'venue-map': {
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <VenueSection
            venue={content.venueName || event.venue}
            address={content.address || event.address}
            city={content.city || event.city}
            directionsNote={content.directionsNote || event.directionsNote}
            googleMapsUrl={content.googleMapsUrl || event.googleMapsUrl}
            appleMapsUrl={content.appleMapsUrl}
            latitude={content.latitude}
            longitude={content.longitude}
            locations={content.locations}
            event={event}
          />
        </BlockWrapper>
      );
    }

    case 'countdown': {
      const targetDate = content.targetDate || event.date;
      if (!targetDate) return null;
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <CountdownSection
            eventDate={targetDate}
            eventTime={content.targetTime || event.time}
            startIso={content.startIso}
            timezone={content.timezone || event.timezone || 'Africa/Nairobi'}
            label={content.label || 'Counting down with joy'}
            celebrants={content.celebrants || event.celebrants}
            todayMessage={content.todayMessage}
            passedMessage={content.passedMessage}
          />
        </BlockWrapper>
      );
    }

    case 'rsvp': {
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <RSVPSection
            eventId={event.id}
            deadline={content.deadline || event.rsvpDeadline}
            guestToken={guestToken}
            defaultGuestName={guestName}
            allowedPlusOnes={previewMode ? (content.allowedPlusOnes ?? 1) : undefined}
            previewMode={previewMode}
          />
        </BlockWrapper>
      );
    }

    case 'contribution': {
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <RegistrySection
            mpesaType={content.type || event.mpesaType || 'till'}
            mpesaNumber={content.number || event.mpesaNumber}
            recipientName={content.recipient || event.mpesaRecipient}
            accountReference={content.accountReference || event.mpesaReference}
            note={content.instructions}
            externalRegistryUrl={content.externalUrl}
            previewMode={previewMode}
          />
        </BlockWrapper>
      );
    }

    case 'timeline': {
      const items = content.items || [];
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <div className="space-y-6">
            <div className="space-y-1">
              {content.subtitle && (
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[var(--event-accent,#934638)]">
                  {content.subtitle}
                </p>
              )}
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--event-ink,#272620)]">
                {content.title || 'Programme of the Day'}
              </h2>
            </div>
            <div className="space-y-4 max-w-lg mx-auto text-left">
              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-4 p-3.5 rounded-lg bg-white border border-[rgba(39,38,32,0.08)] shadow-2xs items-start"
                >
                  <div className="w-16 shrink-0 font-mono text-xs font-semibold text-[var(--event-accent,#934638)] pt-0.5">
                    {item.time}
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-serif text-sm font-medium text-[var(--event-ink,#272620)]">
                      {item.title}
                    </h3>
                    {item.location && (
                      <p className="text-[11px] text-[var(--event-ink,#272620)] opacity-70 flex items-center gap-1">
                        <MapPin size={11} className="text-[var(--event-accent,#934638)]" />
                        {item.location}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-xs text-[var(--event-ink,#272620)] opacity-80 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BlockWrapper>
      );
    }

    case 'quote': {
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <blockquote className="space-y-3 py-4">
            <Quote
              size={28}
              className="text-[var(--event-accent,#934638)] opacity-40 mx-auto"
            />
            <p className="font-serif text-lg sm:text-2xl italic leading-relaxed text-[var(--event-ink,#272620)]">
              “{content.quote}”
            </p>
            {content.attribution && (
              <footer className="text-xs font-medium tracking-wide uppercase text-[var(--event-accent,#934638)]">
                — {content.attribution}
                {content.context && (
                  <span className="text-[var(--event-ink,#272620)] opacity-60 font-normal lowercase">
                    {' '}({content.context})
                  </span>
                )}
              </footer>
            )}
          </blockquote>
        </BlockWrapper>
      );
    }

    case 'divider': {
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <div className="flex items-center justify-center py-2" aria-hidden="true">
            {content.style === 'flourish' ? (
              <div className="flex items-center gap-2 text-[var(--event-accent,#934638)] opacity-60">
                <span className="w-12 h-px bg-current" />
                <span className="font-serif text-sm">❦</span>
                <span className="w-12 h-px bg-current" />
              </div>
            ) : content.style === 'dots' ? (
              <div className="flex items-center gap-1.5 text-[var(--event-accent,#934638)] opacity-50">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>
            ) : (
              <hr className="w-24 border-t border-[rgba(39,38,32,0.15)] mx-auto" />
            )}
          </div>
        </BlockWrapper>
      );
    }

    case 'button': {
      const safeUrl = sanitizeUrl(content.url);
      const isOutline = content.variant === 'outline';
      const isSecondary = content.variant === 'secondary';

      const btnStyle = isOutline
        ? 'border border-[var(--event-accent,#934638)] text-[var(--event-accent,#934638)] hover:bg-[var(--event-accent,#934638)] hover:text-white'
        : isSecondary
          ? 'bg-[#3E2F28] text-white hover:bg-black'
          : 'bg-[var(--event-accent,#934638)] text-white hover:opacity-90';

      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <div className="space-y-1.5">
            <a
              href={safeUrl}
              target={content.openInNewTab ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-md font-medium text-xs tracking-wide transition-all shadow-xs ${btnStyle}`}
            >
              <span>{content.label || 'Learn More'}</span>
              <ExternalLink size={13} className="opacity-75" />
            </a>
            {content.subtext && (
              <p className="text-[11px] text-[var(--event-ink,#272620)] opacity-70 italic font-serif">
                {content.subtext}
              </p>
            )}
          </div>
        </BlockWrapper>
      );
    }

    case 'faq': {
      const items = content.items || [];
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <div className="space-y-6">
            <div className="space-y-1">
              {content.subtitle && (
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[var(--event-accent,#934638)]">
                  {content.subtitle}
                </p>
              )}
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--event-ink,#272620)]">
                {content.title || 'Frequently Asked Questions'}
              </h2>
            </div>
            <div className="space-y-2.5 max-w-xl mx-auto text-left">
              {items.map((item: any, idx: number) => (
                <details
                  key={idx}
                  className="group bg-white rounded-lg border border-[rgba(39,38,32,0.1)] overflow-hidden shadow-2xs transition-all"
                >
                  <summary className="flex items-center justify-between p-3.5 cursor-pointer font-serif text-sm font-medium text-[var(--event-ink,#272620)] select-none">
                    <span>{item.question}</span>
                    <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-[#8C8375]" />
                  </summary>
                  <div className="px-3.5 pb-3.5 text-xs text-[var(--event-ink,#272620)] opacity-85 leading-relaxed border-t border-[rgba(39,38,32,0.06)] pt-2.5 font-light">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </BlockWrapper>
      );
    }

    case 'music': {
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <MusicPlayerWidget
            audioUrl={content.audioUrl}
            title={content.title}
            artist={content.artist}
            notice={content.autoPlayNotice}
          />
        </BlockWrapper>
      );
    }

    case 'guestbook': {
      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <div className="p-6 rounded-xl bg-white border border-[rgba(39,38,32,0.12)] space-y-4 max-w-lg mx-auto">
            <Heart size={20} className="text-[var(--event-accent,#934638)] mx-auto" />
            <div className="space-y-1">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-[var(--event-ink,#272620)]">
                {content.title || 'Tributes & Guestbook'}
              </h2>
              <p className="text-xs text-[var(--event-ink,#272620)] opacity-75">
                {content.prompt || 'Leave a message of love and memory'}
              </p>
            </div>
            {content.allowCandles && (
              <div className="py-2 px-3 rounded-lg bg-[#FAF8F5] border border-[rgba(39,38,32,0.08)] flex items-center justify-between text-xs">
                <span className="font-medium text-[#272620]">Virtual Memorial Candle</span>
                <span className="text-[11px] text-[var(--event-accent,#934638)] font-semibold">Lit in Memory 🕯️</span>
              </div>
            )}
            <p className="text-[10px] text-[#8C8375] italic">
              {content.moderationNotice || 'Messages are curated for the celebrants and attendees.'}
            </p>
          </div>
        </BlockWrapper>
      );
    }

    case 'livestream': {
      const sanitized = sanitizeLivestreamUrl(content.streamUrl);
      const isLive = content.status === 'live';

      return (
        <BlockWrapper settings={settings} id={block.id} previewMode={previewMode}>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isLive
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#FAF8F5] text-[#6D6558] border border-[rgba(39,38,32,0.12)]'
                }`}
              >
                <Radio size={12} />
                <span>{isLive ? 'Live Now' : content.status === 'ended' ? 'Broadcast Ended' : 'Scheduled Broadcast'}</span>
              </span>
            </div>
            <h2 className="font-serif text-2xl font-medium text-[var(--event-ink,#272620)]">
              {content.title || 'Live Ceremony Stream'}
            </h2>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black/5 border border-[rgba(39,38,32,0.12)]">
              {sanitized?.embedUrl ? (
                <iframe
                  src={sanitized.embedUrl}
                  title={content.title || 'Livestream'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              ) : sanitized?.rawUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5]">
                  <p className="text-sm font-medium text-[#272620]">External Broadcast</p>
                  <a
                    href={sanitized.rawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--event-accent,#934638)] text-white text-xs font-medium"
                  >
                    <span>Watch Broadcast</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#8C8375]">
                  Stream link not configured
                </div>
              )}
            </div>
            {content.pinNote && (
              <p className="text-xs text-[var(--event-ink,#272620)] opacity-75 italic font-serif">
                {content.pinNote}
              </p>
            )}
          </div>
        </BlockWrapper>
      );
    }

    default:
      return null;
  }
}

function ContributionCard({
  settings,
  id,
  content,
  defaultEventTitle,
}: {
  settings: any;
  id: string;
  content: any;
  defaultEventTitle: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (content.number) {
      navigator.clipboard.writeText(content.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const typeLabel =
    content.type === 'paybill'
      ? 'Paybill Number'
      : content.type === 'send_money'
        ? 'Send Money (Phone Number)'
        : 'Buy Goods Till Number';

  return (
    <BlockWrapper settings={settings} id={id}>
      <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-xl border border-[rgba(39,38,32,0.12)] space-y-4 max-w-lg mx-auto shadow-xs text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
          <span className="font-bold text-xs">M-PESA</span>
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-medium text-[var(--event-ink,#272620)]">
            {content.title || 'Gift Registry & Contributions'}
          </h2>
          {content.instructions && (
            <p className="text-xs text-[var(--event-ink,#272620)] opacity-80 leading-relaxed font-light">
              {content.instructions}
            </p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg border border-[rgba(39,38,32,0.1)] space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#6D6558]">
              {typeLabel}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] flex items-center gap-1 font-medium text-[var(--event-accent,#934638)] hover:underline"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="font-mono text-xl font-bold tracking-wider text-[#272620]">
            {content.number || '8249102'}
          </div>
          <div className="pt-1 text-xs text-[#6D6558] flex justify-between border-t border-[rgba(39,38,32,0.06)]">
            <span>Recipient: <strong>{content.recipientName || 'Event Host'}</strong></span>
            {content.accountReference && (
              <span>Ref: <strong>{content.accountReference || defaultEventTitle}</strong></span>
            )}
          </div>
        </div>
        {content.notes && (
          <p className="text-[11px] text-[var(--event-ink,#272620)] opacity-70 italic font-serif">
            {content.notes}
          </p>
        )}
      </div>
    </BlockWrapper>
  );
}

function MusicPlayerWidget({
  audioUrl,
  title,
  artist,
  notice,
}: {
  audioUrl?: string;
  title?: string;
  artist?: string;
  notice?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-[rgba(39,38,32,0.12)] shadow-xs text-xs">
      <audio ref={audioRef} src={audioUrl} loop onEnded={() => setIsPlaying(false)} />
      <button
        type="button"
        onClick={togglePlay}
        className="w-7 h-7 rounded-full bg-[var(--event-accent,#934638)] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
      >
        {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
      </button>
      <div className="text-left pr-2">
        <div className="font-medium text-[#272620] truncate max-w-[150px]">
          {title || 'Atmospheric Audio'}
        </div>
        {artist && <div className="text-[10px] text-[#8C8375] truncate">{artist}</div>}
      </div>
    </div>
  );
}
