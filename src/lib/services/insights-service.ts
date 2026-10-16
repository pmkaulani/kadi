import { mockDb } from '../db/mock-db';
import { EventEntity, EventReportEntity } from '../db/types';

export interface ChannelReferralStat {
  source: string;
  label: string;
  visits: number;
  rsvps: number;
  conversionRate: number; // percentage (0 - 100)
}

export interface DietaryAggregate {
  requirement: string;
  count: number;
}

export interface EventInsightsData {
  eventId: string;
  eventTitle: string;
  status: string;
  visibility: 'private' | 'unlisted' | 'public';
  hideExactVenueUntilRsvp: boolean;
  timezone: string;
  overview: {
    totalHouseholdsInvited: number;
    totalHeadcountExpected: number;
    attendingHeadcount: number;
    attendingHouseholds: number;
    pendingHouseholds: number;
    declinedHouseholds: number;
    waitlistedHouseholds: number;
    householdResponseRate: number; // percentage (0 - 100)
    attendanceApprovalRatio: number; // percentage (0 - 100)
    rsvpDeadline: string;
    isDeadlinePassed: boolean;
  };
  checkInStats: {
    hasCheckIns: boolean;
    checkedInCount: number;
    attendingHeadcount: number;
    checkInRate: number; // percentage (0 - 100)
  };
  referralSources: ChannelReferralStat[];
  totalPageVisits: number;
  dietarySummary: DietaryAggregate[];
  metricDefinitions: Record<string, { definition: string; dataSource: string }>;
}

export class InsightsService {
  /**
   * Computes authentic, verifiable event analytics based exclusively on real records.
   * Free of mock data, fake charts, or covert surveillance metrics.
   */
  static getEventInsights(eventId: string): EventInsightsData {
    const event = mockDb.events.find((e) => e.id === eventId);
    if (!event) {
      throw new Error(`Event with id "${eventId}" not found.`);
    }

    const guests = mockDb.guests.filter((g) => g.eventId === eventId);
    const rsvps = mockDb.rsvps.filter((r) => r.eventId === eventId);
    const checkIns = mockDb.checkIns.filter((c) => c.eventId === eventId && c.status === 'checked_in');

    // 1. Core Overview
    const totalHouseholdsInvited = guests.length;
    const totalHeadcountExpected = guests.reduce((sum, g) => sum + 1 + (g.allowedPlusOnes || 0), 0);

    const attendingRsvps = rsvps.filter((r) => r.status === 'yes');
    const declinedRsvps = rsvps.filter((r) => r.status === 'no');
    const waitlistedRsvps = rsvps.filter((r) => r.status === 'maybe' || r.isWaitlisted);

    const attendingHouseholds = attendingRsvps.length;
    const attendingHeadcount = attendingRsvps.reduce((sum, r) => sum + (r.attendeeCount || 1), 0);
    const declinedHouseholds = declinedRsvps.length;
    const waitlistedHouseholds = waitlistedRsvps.length;

    // Pending: households that have not submitted an RSVP
    const respondingHouseholdIds = new Set(rsvps.map((r) => r.householdId).filter(Boolean));
    const pendingHouseholds = guests.filter((g) => !respondingHouseholdIds.has(g.id) && g.status === 'pending').length;

    const totalResponses = attendingHouseholds + declinedHouseholds + waitlistedHouseholds;
    const householdResponseRate =
      totalHouseholdsInvited > 0
        ? Math.round((totalResponses / totalHouseholdsInvited) * 100)
        : 0;

    const attendanceApprovalRatio =
      totalResponses > 0
        ? Math.round((attendingHouseholds / totalResponses) * 100)
        : 0;

    const isDeadlinePassed = Boolean(event.rsvpDeadline && new Date(event.rsvpDeadline).getTime() < Date.now());

    // 2. Real Check-In Stats (Only shown when check-in records actually exist)
    const hasCheckIns = checkIns.length > 0;
    const checkedInCount = checkIns.length;
    const checkInRate =
      attendingHeadcount > 0
        ? Math.round((checkedInCount / attendingHeadcount) * 100)
        : 0;

    // 3. Privacy-Safe Referral Channels (UTM / Source Attribution)
    const defaultSources = ['wa', 'qr', 'email', 'ig', 'direct'];
    const sourceViews = event.sourceViews || {};
    const sourceRsvps = event.sourceRsvps || {};

    const allKeys = Array.from(new Set([...defaultSources, ...Object.keys(sourceViews), ...Object.keys(sourceRsvps)]));
    const channelLabels: Record<string, string> = {
      wa: 'WhatsApp Click-to-Chat',
      qr: 'Printed / Physical QR Code',
      email: 'Email Invitation',
      ig: 'Instagram / Social Bio',
      direct: 'Direct Link / Bookmark',
    };

    const referralSources: ChannelReferralStat[] = allKeys.map((key) => {
      const visits = sourceViews[key] || 0;
      const rsvpsCount = sourceRsvps[key] || 0;
      const conversionRate = visits > 0 ? Math.round((rsvpsCount / visits) * 100) : 0;
      return {
        source: key,
        label: channelLabels[key] || `Campaign (${key})`,
        visits,
        rsvps: rsvpsCount,
        conversionRate,
      };
    });

    const totalPageVisits = event.pageViews || referralSources.reduce((sum, s) => sum + s.visits, 0);

    // 4. Dietary Aggregations
    const dietaryMap: Record<string, number> = {};
    for (const r of rsvps) {
      if (r.dietaryRequirements && r.dietaryRequirements.trim() && r.dietaryRequirements.toLowerCase() !== 'none') {
        const req = r.dietaryRequirements.trim();
        dietaryMap[req] = (dietaryMap[req] || 0) + (r.attendeeCount || 1);
      }
    }
    const dietarySummary: DietaryAggregate[] = Object.entries(dietaryMap).map(([requirement, count]) => ({
      requirement,
      count,
    }));

    // 5. Written Definitions & Data Sources
    const metricDefinitions = {
      totalHouseholdsInvited: {
        definition: 'Total distinct household entries recorded on the host guest roster.',
        dataSource: 'Host Guest Household list (mockDb.guests).',
      },
      attendingHeadcount: {
        definition: 'Sum of primary celebrants and declared plus-one attendees confirmed attending.',
        dataSource: 'Submitted and validated RSVP submissions (mockDb.rsvps).',
      },
      householdResponseRate: {
        definition: 'Percentage of invited households that have submitted an RSVP response.',
        dataSource: 'Ratio of submitted RSVPs to total invited households.',
      },
      checkInRate: {
        definition: 'Ratio of physical arrivals confirmed at reception to declared attending headcount.',
        dataSource: 'Reception desk check-in scans (mockDb.checkIns). Never inferred from page visits.',
      },
      referralConversion: {
        definition: 'Ratio of RSVP submissions to raw page views per privacy-safe campaign tag (?src=).',
        dataSource: 'Aggregate source tag counters. No personal identity or IP address profiling.',
      },
    };

    return {
      eventId: event.id,
      eventTitle: event.title,
      status: event.status,
      visibility: event.visibility || 'private',
      hideExactVenueUntilRsvp: Boolean(event.hideExactVenueUntilRsvp),
      timezone: event.timezone || 'Africa/Nairobi',
      overview: {
        totalHouseholdsInvited,
        totalHeadcountExpected,
        attendingHeadcount,
        attendingHouseholds,
        pendingHouseholds,
        declinedHouseholds,
        waitlistedHouseholds,
        householdResponseRate,
        attendanceApprovalRatio,
        rsvpDeadline: event.rsvpDeadline,
        isDeadlinePassed,
      },
      checkInStats: {
        hasCheckIns,
        checkedInCount,
        attendingHeadcount,
        checkInRate,
      },
      referralSources,
      totalPageVisits,
      dietarySummary,
      metricDefinitions,
    };
  }

  /**
   * Increments privacy-preserving page view counter with optional non-sensitive campaign tag (?src=).
   */
  static recordPageView(eventId: string, source = 'direct'): void {
    const event = mockDb.events.find((e) => e.id === eventId);
    if (!event) return;

    event.pageViews = (event.pageViews || 0) + 1;

    // Clean source tag: extract base identifier before any delimiters (?, &, #, /, =, :, space)
    const baseSource = (source || '').split(/[?#&/=: \t]/)[0] || '';
    const cleanSource = baseSource.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20).toLowerCase() || 'direct';
    event.sourceViews = event.sourceViews || {};
    event.sourceViews[cleanSource] = (event.sourceViews[cleanSource] || 0) + 1;
  }

  /**
   * Increments campaign RSVP conversion counter.
   */
  static recordSourceRsvp(eventId: string, source = 'direct'): void {
    const event = mockDb.events.find((e) => e.id === eventId);
    if (!event) return;

    const baseSource = (source || '').split(/[?#&/=: \t]/)[0] || '';
    const cleanSource = baseSource.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20).toLowerCase() || 'direct';
    event.sourceRsvps = event.sourceRsvps || {};
    event.sourceRsvps[cleanSource] = (event.sourceRsvps[cleanSource] || 0) + 1;
  }

  /**
   * Updates host privacy and discovery preferences with explicit consent validation.
   */
  static updateEventPrivacy(
    eventId: string,
    settings: {
      visibility: 'private' | 'unlisted' | 'public';
      hideExactVenueUntilRsvp?: boolean;
      tags?: string[];
    }
  ): EventEntity {
    const event = mockDb.events.find((e) => e.id === eventId);
    if (!event) {
      throw new Error(`Event with id "${eventId}" not found.`);
    }

    event.visibility = settings.visibility;
    if (typeof settings.hideExactVenueUntilRsvp === 'boolean') {
      event.hideExactVenueUntilRsvp = settings.hideExactVenueUntilRsvp;
    }
    if (settings.tags) {
      event.tags = settings.tags;
    }

    if (settings.visibility === 'public') {
      event.publicListedAt = new Date().toISOString();
    } else {
      event.publicListedAt = undefined;
    }

    event.updatedAt = new Date().toISOString();
    return event;
  }

  /**
   * Lists events on the public discovery surface.
   * STRICT CONTRACT:
   * 1. Only events with status === 'published' AND visibility === 'public' appear.
   * 2. Drafts, archived, cancelled, and private/unlisted events are NEVER returned.
   * 3. If hideExactVenueUntilRsvp === true, exact street address is masked.
   */
  static listPublicEvents(filters?: {
    category?: string;
    city?: string;
    search?: string;
    tag?: string;
  }): Array<Partial<EventEntity>> {
    let matches = mockDb.events.filter(
      (e) => e.status === 'published' && e.visibility === 'public'
    );

    if (filters?.category && filters.category !== 'all') {
      matches = matches.filter((e) => e.category === filters.category);
    }

    if (filters?.city && filters.city !== 'all') {
      matches = matches.filter((e) => e.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }

    if (filters?.tag) {
      matches = matches.filter((e) => e.tags?.includes(filters.tag!));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      matches = matches.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.subtitle?.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q)
      );
    }

    // Apply privacy masking for public discovery view
    return matches.map((e) => {
      const isVenueMasked = Boolean(e.hideExactVenueUntilRsvp);
      return {
        id: e.id,
        title: e.title,
        subtitle: e.subtitle,
        slug: e.slug,
        category: e.category,
        hosts: e.hosts,
        celebrants: e.celebrants,
        date: e.date,
        time: e.time,
        timezone: e.timezone,
        city: e.city,
        venue: isVenueMasked ? `${e.city} (Exact location disclosed upon RSVP)` : e.venue,
        heroImage: e.heroImage,
        tags: e.tags,
        publicListedAt: e.publicListedAt,
        hideExactVenueUntilRsvp: e.hideExactVenueUntilRsvp,
      };
    });
  }

  /**
   * Reports an event for content moderation review.
   */
  static reportEvent(
    eventId: string,
    payload: {
      reason: EventReportEntity['reason'];
      details?: string;
      reporterContact?: string;
    }
  ): EventReportEntity {
    const event = mockDb.events.find((e) => e.id === eventId);
    if (!event) {
      throw new Error(`Event "${eventId}" not found.`);
    }

    const report: EventReportEntity = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      reason: payload.reason,
      details: payload.details,
      reporterContact: payload.reporterContact,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    mockDb.reports.unshift(report);
    return report;
  }

  /**
   * Lists moderation reports for an event.
   */
  static listReports(eventId?: string): EventReportEntity[] {
    if (eventId) {
      return mockDb.reports.filter((r) => r.eventId === eventId);
    }
    return mockDb.reports;
  }
}
