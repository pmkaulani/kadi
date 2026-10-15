'use client';

import React, { useState, useMemo } from 'react';
import {
  Navigation,
  MapPin,
  ExternalLink,
  Car,
  Compass,
  Clock,
  Layers,
} from 'lucide-react';
import type { EventEntity } from '@/lib/db/types';
import type { CalendarEventDefinition } from '@/lib/calendar/types';
import {
  extractVenuesFromEvent,
  getGoogleMapsDirectionsUrl,
  getAppleMapsDirectionsUrl,
  getPlatformDirectionsUrl,
  getSafeOpenStreetMapEmbedUrl,
  type VenueLocation,
} from '@/lib/maps';
import { buildCalendarEventsFromEvent } from '@/lib/calendar/links';
import { AddToCalendarDropdown } from './AddToCalendarDropdown';

export interface VenueSectionProps {
  venue?: string;
  address?: string;
  city?: string;
  directionsNote?: string;
  googleMapsUrl?: string;
  appleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  locations?: VenueLocation[];
  event?: Partial<EventEntity>;
  calendarEvents?: CalendarEventDefinition[];
  calendarData?: {
    title: string;
    description?: string;
    location?: string;
    startDate: string;
    endDate?: string;
  };
}

export function VenueSection({
  venue,
  address,
  city,
  directionsNote,
  googleMapsUrl,
  appleMapsUrl,
  latitude,
  longitude,
  locations: explicitLocations,
  event,
  calendarEvents: explicitCalendarEvents,
  calendarData,
}: VenueSectionProps) {
  // Resolve venues list: explicit locations, or extract from event entity, or fallback to props
  const locations: VenueLocation[] = useMemo(() => {
    if (explicitLocations && explicitLocations.length > 0) {
      return explicitLocations;
    }
    if (event) {
      const extracted = extractVenuesFromEvent(event);
      if (extracted.length > 0) return extracted;
    }
    if (venue || address) {
      return [
        {
          id: 'primary-venue',
          label: 'Event Venue',
          venueName: venue || 'Venue',
          address,
          city,
          directionsNote,
          googleMapsUrl,
          appleMapsUrl,
          latitude,
          longitude,
        },
      ];
    }
    return [];
  }, [explicitLocations, event, venue, address, city, directionsNote, googleMapsUrl, appleMapsUrl, latitude, longitude]);

  // Active tab index for multi-venue switcher
  const [activeIdx, setActiveIdx] = useState(0);

  // Calendar events resolved from event, calendarData, or explicit props
  const calendarEvents = useMemo(() => {
    if (explicitCalendarEvents && explicitCalendarEvents.length > 0) {
      return explicitCalendarEvents;
    }
    if (calendarData) {
      return [
        {
          title: calendarData.title,
          description: calendarData.description,
          location: calendarData.location || [venue, address, city].filter(Boolean).join(', '),
          venueName: venue,
          address,
          city,
          start: calendarData.startDate,
          end: calendarData.endDate,
          timezone: event?.timezone || 'Africa/Nairobi',
        },
      ];
    }
    if (event) {
      return buildCalendarEventsFromEvent(event);
    }
    if (venue || address) {
      return [
        {
          title: 'Celebration',
          location: [venue, address, city].filter(Boolean).join(', '),
          venueName: venue,
          address,
          city,
          start: new Date().toISOString(),
          timezone: 'Africa/Nairobi',
        },
      ];
    }
    return [];
  }, [explicitCalendarEvents, calendarData, event, venue, address, city]);

  // Gracefully handle empty or disabled venue
  if (locations.length === 0) {
    return null;
  }

  const activeVenue = locations[Math.min(activeIdx, locations.length - 1)];
  const isMultiLocation = locations.length > 1;

  // Directions URLs for active venue
  const googleUrl = getGoogleMapsDirectionsUrl(activeVenue);
  const appleUrl = getAppleMapsDirectionsUrl(activeVenue);
  const platformUrl = getPlatformDirectionsUrl(activeVenue);

  // Safe map embed URL (only generated when coordinates exist; never exposes private keys)
  const embedUrl =
    typeof activeVenue.latitude === 'number' && typeof activeVenue.longitude === 'number'
      ? getSafeOpenStreetMapEmbedUrl(activeVenue.latitude, activeVenue.longitude)
      : null;

  return (
    <section
      aria-label="Venue and Location"
      className="w-full px-4 sm:px-6 py-12 sm:py-16 bg-[#FAF8F5]/50 border-t border-[rgba(39,38,32,0.1)]"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--event-primary,#934638)]">
            <Compass className="w-3.5 h-3.5" />
            <span>Locations & Itinerary</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[var(--event-ink,#272620)]">
            We’ll meet you there
          </h2>
          <p className="text-xs sm:text-sm text-[#756F64]">
            Find venue directions, parking details, and add the itinerary to your calendar.
          </p>
        </div>

        {/* Multi-Location Switcher Tabs (Ceremony vs Reception or Church Service vs Burial) */}
        {isMultiLocation && (
          <div className="flex items-center justify-center">
            <div className="inline-flex p-1 bg-white rounded-xl border border-[rgba(39,38,32,0.12)] shadow-2xs gap-1 max-w-full overflow-x-auto">
              {locations.map((loc, idx) => (
                <button
                  key={loc.id || idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap select-none ${
                    activeIdx === idx
                      ? 'bg-[var(--event-primary,#934638)] text-white shadow-xs'
                      : 'text-[#6D6558] hover:text-[#272620] hover:bg-black/[0.03]'
                  }`}
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{loc.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Venue Information Card & Map Grid */}
        <div className="grid md:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Venue Details Card */}
          <div className={`${embedUrl ? 'md:col-span-5' : 'md:col-span-8 md:col-start-3'} flex flex-col justify-between bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(39,38,32,0.12)] shadow-xs space-y-6`}>
            <div className="space-y-4">
              {/* Venue Label Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF4EB] text-[var(--event-primary,#934638)] border border-[var(--event-primary,#934638)]/15">
                  <MapPin className="w-3 h-3" />
                  {activeVenue.label}
                </span>

                {activeVenue.time && (
                  <span className="flex items-center gap-1 text-xs text-[#756F64] font-medium">
                    <Clock className="w-3 h-3 text-[var(--event-primary,#934638)]" />
                    {activeVenue.time}
                  </span>
                )}
              </div>

              {/* Venue Name & Address */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--event-ink,#272620)] font-medium leading-tight">
                  {activeVenue.venueName}
                </h3>
                {activeVenue.address && (
                  <p className="text-xs sm:text-sm text-[#756F64] mt-1.5 leading-relaxed">
                    {activeVenue.address}
                    {activeVenue.city && !activeVenue.address.includes(activeVenue.city) ? `, ${activeVenue.city}` : ''}
                  </p>
                )}
              </div>

              {/* Parking and Directions Note */}
              {activeVenue.directionsNote && (
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[rgba(39,38,32,0.08)] flex items-start gap-2.5 text-xs text-[#554e42] leading-relaxed">
                  <Car className="w-4 h-4 text-[var(--event-primary,#934638)] shrink-0 mt-0.5" />
                  <span>{activeVenue.directionsNote}</span>
                </div>
              )}
            </div>

            {/* Action Buttons: Directions & Calendar Dropdown */}
            <div className="pt-4 border-t border-[rgba(39,38,32,0.08)] space-y-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Platform Directions Link (Google Maps / Apple Maps) */}
                <a
                  href={platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--event-primary,#934638)] text-white text-xs sm:text-sm font-medium shadow-xs hover:opacity-95 transition-opacity"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                {/* Add to Calendar Dropdown */}
                <AddToCalendarDropdown
                  events={calendarEvents}
                  calendarName={event?.title}
                  variant="secondary"
                  size="md"
                />
              </div>

              {/* Secondary Explicit Links: Google Maps & Apple Maps */}
              <div className="flex items-center gap-3 text-[11px] text-[#8C8375] pt-1">
                <span>Direct navigation:</span>
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#272620] underline transition-colors"
                >
                  Google Maps
                </a>
                <span>·</span>
                <a
                  href={appleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#272620] underline transition-colors"
                >
                  Apple Maps
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Safe Interactive Map Embed (OpenStreetMap) */}
          {embedUrl && (
            <div className="md:col-span-7 rounded-2xl overflow-hidden border border-[rgba(39,38,32,0.12)] shadow-xs bg-[#FAF8F5] relative min-h-[320px] sm:min-h-[400px]">
              <iframe
                title={`Map of ${activeVenue.venueName}`}
                src={embedUrl}
                className="w-full h-full min-h-[320px] sm:min-h-[400px] border-0"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
              />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-[#756F64] border border-black/10 shadow-xs">
                © OpenStreetMap contributors
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
