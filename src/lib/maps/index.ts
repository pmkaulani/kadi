import type { EventEntity } from '../db/types';

export interface VenueLocation {
  id: string;
  label: string; // e.g. "Church Ceremony", "Evening Reception", "Burial Service"
  venueName: string;
  address?: string;
  city?: string;
  directionsNote?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  appleMapsUrl?: string;
  time?: string;
}

/**
 * Known landmark coordinates in Kenya for prominent default venues
 */
export const KNOWN_KENYA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'safari park hotel': { lat: -1.2185, lng: 36.8837 },
  'all saints cathedral': { lat: -1.2906, lng: 36.8183 },
  'windsor golf': { lat: -1.2227, lng: 36.8432 },
  'karura forest': { lat: -1.2384, lng: 36.8286 },
  'paradise lost': { lat: -1.1895, lng: 36.8378 },
  'consolata shrine': { lat: -1.2655, lng: 36.8041 },
  'langata cemetery': { lat: -1.3364, lng: 36.7588 },
};

/**
 * Looks up fallback coordinates if available for known Kenyan landmarks.
 */
export function resolveCoordinates(
  venueName?: string,
  address?: string
): { lat: number; lng: number } | null {
  if (!venueName && !address) return null;
  const target = `${venueName || ''} ${address || ''}`.toLowerCase();

  for (const [key, coords] of Object.entries(KNOWN_KENYA_COORDINATES)) {
    if (target.includes(key)) {
      return coords;
    }
  }
  return null;
}

/**
 * Builds an unambiguous Google Maps search query string.
 */
export function buildLocationQuery(loc: {
  venueName?: string;
  address?: string;
  city?: string;
}): string {
  return [loc.venueName, loc.address, loc.city]
    .filter(Boolean)
    .join(', ')
    .trim();
}

/**
 * Generates an active Google Maps directions URL.
 */
export function getGoogleMapsDirectionsUrl(loc: {
  venueName?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
}): string {
  if (loc.googleMapsUrl && loc.googleMapsUrl.startsWith('https://')) {
    return loc.googleMapsUrl;
  }

  if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
    return `https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`;
  }

  const query = buildLocationQuery(loc);
  if (!query) return 'https://maps.google.com';

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Generates an active Apple Maps directions URL for iOS / macOS.
 */
export function getAppleMapsDirectionsUrl(loc: {
  venueName?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  appleMapsUrl?: string;
}): string {
  if (loc.appleMapsUrl && loc.appleMapsUrl.startsWith('https://')) {
    return loc.appleMapsUrl;
  }

  if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
    return `https://maps.apple.com/?daddr=${loc.latitude},${loc.longitude}`;
  }

  const query = buildLocationQuery(loc);
  if (!query) return 'https://maps.apple.com';

  return `https://maps.apple.com/?daddr=${encodeURIComponent(query)}`;
}

/**
 * Detects whether the current client is an Apple device (iOS / macOS).
 */
export function isAppleDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
}

/**
 * Generates platform-aware direct navigation URL (Apple Maps on iOS/macOS, Google Maps elsewhere).
 */
export function getPlatformDirectionsUrl(loc: {
  venueName?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  appleMapsUrl?: string;
}): string {
  return isAppleDevice() ? getAppleMapsDirectionsUrl(loc) : getGoogleMapsDirectionsUrl(loc);
}

/**
 * Generates a safe OpenStreetMap embed URL without API keys.
 * Returns null if valid coordinates cannot be resolved.
 */
export function getSafeOpenStreetMapEmbedUrl(latitude: number, longitude: number, delta = 0.008): string {
  const minLng = longitude - delta;
  const minLat = latitude - delta;
  const maxLng = longitude + delta;
  const maxLat = latitude + delta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

/**
 * Extracts all labeled venue locations from an event:
 * - For weddings with ceremony & reception: returns 2 distinct venue tabs.
 * - For funerals/memorials with multiple services: returns distinct service & burial tabs.
 * - Otherwise: returns single primary venue.
 */
export function extractVenuesFromEvent(event: Partial<EventEntity>): VenueLocation[] {
  // 1. Memorial / Funeral distinct services
  if (
    (event.category === 'memorial' || event.category === 'funeral') &&
    event.memorialServices &&
    event.memorialServices.length > 0
  ) {
    return event.memorialServices.map((svc, idx) => {
      const coords = resolveCoordinates(svc.venue, svc.address);
      return {
        id: `service-${idx + 1}`,
        label: svc.type === 'burial' ? 'Graveside Burial' : svc.type === 'viewing' ? 'Viewing & Tribute' : svc.name || 'Memorial Service',
        venueName: svc.venue,
        address: svc.address,
        city: event.city,
        directionsNote: svc.type === 'burial' ? 'Procession to proceed from the church service.' : undefined,
        googleMapsUrl: svc.mapUrl,
        latitude: coords?.lat,
        longitude: coords?.lng,
        time: svc.time,
      };
    });
  }

  // 2. Wedding Ceremony & Reception
  if (
    event.category === 'wedding' &&
    event.ceremonyDetails?.name &&
    event.receptionDetails?.name &&
    (event.ceremonyDetails.address !== event.receptionDetails.address ||
      event.ceremonyDetails.name !== event.receptionDetails.name)
  ) {
    const ceremonyCoords = resolveCoordinates(event.ceremonyDetails.name, event.ceremonyDetails.address);
    const receptionCoords = resolveCoordinates(event.receptionDetails.name, event.receptionDetails.address);

    return [
      {
        id: 'ceremony',
        label: 'Ceremony Venue',
        venueName: event.ceremonyDetails.name,
        address: event.ceremonyDetails.address,
        city: event.city,
        directionsNote: event.ceremonyDetails.directions || 'Church parking is accessible via the main gate.',
        googleMapsUrl: event.ceremonyDetails.mapUrl,
        latitude: ceremonyCoords?.lat,
        longitude: ceremonyCoords?.lng,
        time: event.ceremonyDetails.time || event.time || '10:00 AM',
      },
      {
        id: 'reception',
        label: 'Reception Venue',
        venueName: event.receptionDetails.name,
        address: event.receptionDetails.address,
        city: event.city,
        directionsNote: event.receptionDetails.directions || 'Ample secure on-site parking available with dedicated attendants.',
        googleMapsUrl: event.receptionDetails.mapUrl,
        latitude: receptionCoords?.lat,
        longitude: receptionCoords?.lng,
        time: event.receptionDetails.time || '2:00 PM',
      },
    ];
  }

  // 3. Standard Single Venue
  if (!event.venue && !event.address) {
    return [];
  }

  const defaultCoords = resolveCoordinates(event.venue, event.address);

  return [
    {
      id: 'main',
      label: 'Event Venue',
      venueName: event.venue || 'Venue',
      address: event.address,
      city: event.city,
      directionsNote: event.directionsNote || 'Ample parking available on-site. Follow signs upon arrival.',
      googleMapsUrl: event.googleMapsUrl,
      latitude: defaultCoords?.lat,
      longitude: defaultCoords?.lng,
      time: event.time,
    },
  ];
}
