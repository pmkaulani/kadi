import { mockDb } from '../db/mock-db';
import { EventEntity, EventDesignEntity } from '../db/types';
import { getTemplateById } from '../templates/catalogue';
import { isValidStatusTransition } from '../validation/events';

export class EventService {
  static listEvents(hostId = 'host-1'): EventEntity[] {
    return mockDb.events.filter((e) => e.hostId === hostId && e.status !== 'archived');
  }

  static getEventById(id: string): EventEntity | undefined {
    return mockDb.events.find((e) => e.id === id);
  }

  static getEventBySlug(slug: string): EventEntity | undefined {
    const direct = mockDb.events.find((e) => e.slug === slug);
    if (direct) return direct;

    const slugAliases: Record<string, string> = {
      'amani-zawadi-wedding': 'kevin-and-wanjiku',
      'otieno-at-50': 'maina-50',
      'celebrating-mama-wambui': 'mama-sarah-wambui',
    };
    const targetSlug = slugAliases[slug];
    if (targetSlug) {
      return mockDb.events.find((e) => e.slug === targetSlug);
    }
    return undefined;
  }

  static getEventDesign(eventId: string): EventDesignEntity | undefined {
    return mockDb.designs[eventId];
  }

  /**
   * Generates a unique slug by checking existing events in storage.
   */
  static generateUniqueSlug(baseTitle: string, excludeEventId?: string): string {
    const slugBase = baseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'event';
    
    let candidate = `${slugBase}-${Math.random().toString(36).substring(2, 6)}`;
    let counter = 1;
    while (mockDb.events.some((e) => e.slug === candidate && e.id !== excludeEventId)) {
      candidate = `${slugBase}-${Math.random().toString(36).substring(2, 6)}-${counter++}`;
    }
    return candidate;
  }

  static createEvent(payload: Partial<EventEntity>): EventEntity {
    const template = getTemplateById(payload.templateId || 'savannah-twilight');
    const slug = payload.slug || this.generateUniqueSlug(payload.title || 'celebration');

    const newEvent: EventEntity = {
      ...payload,
      id: payload.id || `event-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      hostId: payload.hostId || 'host-1',
      title: payload.title || 'New Event Invitation',
      subtitle: payload.subtitle || 'You are warmly invited to celebrate with us',
      slug,
      category: payload.category || 'wedding',
      status: payload.status || 'draft',
      templateId: template?.id || 'savannah-twilight',
      templateVersion: template?.version || '1.0.0',
      hosts: payload.hosts || 'Event Host',
      celebrants: payload.celebrants || payload.title || 'Honored Guests',
      date: payload.date || 'Saturday, 12 December 2026',
      time: payload.time || '2:00 PM EAT',
      timezone: 'Africa/Nairobi',
      venue: payload.venue || 'Nairobi, Kenya',
      city: payload.city || 'Nairobi',
      heroImage:
        payload.heroImage ||
        template?.sampleData.heroImage ||
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      rsvpDeadline: payload.rsvpDeadline || '1 December 2026',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.events.unshift(newEvent);

    // Initialize default design from template
    if (template) {
      mockDb.designs[newEvent.id] = {
        eventId: newEvent.id,
        motionPreset: template.motionPreset,
        palette: {
          primary: template.palette.primary,
          secondary: template.palette.secondary,
          accent: template.palette.accent,
          envelope: template.palette.envelope,
          flap: template.palette.flap,
          cardBackground: template.palette.cardBackground,
        },
        linerId: template.liner.id,
        sealShape: template.seal.shape as any,
        sealMonogram: template.seal.monogram || 'K',
        sealColor: template.seal.color,
        visibleSections: ['hero', 'schedule', 'venue', 'rsvp'],
      };
    }

    return newEvent;
  }

  static updateEvent(id: string, updates: Partial<EventEntity>): EventEntity {
    const idx = mockDb.events.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Event not found');

    const current = mockDb.events[idx];

    // Status transition validation
    if (updates.status && updates.status !== current.status) {
      if (!isValidStatusTransition(current.status, updates.status)) {
        throw new Error(`Invalid status transition from '${current.status}' to '${updates.status}'.`);
      }
    }

    // Slug conflict validation
    if (updates.slug && updates.slug !== current.slug) {
      const conflict = mockDb.events.some((e) => e.slug === updates.slug && e.id !== id);
      if (conflict) {
        throw new Error(`The slug '${updates.slug}' is already in use by another event.`);
      }
    }

    mockDb.events[idx] = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockDb.events[idx];
  }

  static updateDesign(eventId: string, updates: Partial<EventDesignEntity>): EventDesignEntity {
    if (!mockDb.designs[eventId]) {
      mockDb.designs[eventId] = {
        eventId,
        motionPreset: 'classic-stationery',
        palette: {
          primary: '#934638',
          secondary: '#B99A62',
          accent: '#A94F51',
          envelope: '#4A0E17',
          flap: '#5A101D',
          cardBackground: '#FCFCF9',
        },
        linerId: 'gold-foil',
        sealShape: 'diamond',
        sealMonogram: 'K',
        sealColor: '#8B1524',
        visibleSections: ['hero', 'schedule', 'venue', 'rsvp'],
      };
    }

    mockDb.designs[eventId] = {
      ...mockDb.designs[eventId],
      ...updates,
    };
    return mockDb.designs[eventId];
  }

  static publishEvent(id: string): EventEntity {
    return this.updateEvent(id, { status: 'published' });
  }

  static archiveEvent(id: string): EventEntity {
    return this.updateEvent(id, { status: 'archived' });
  }

  static unarchiveEvent(id: string): EventEntity {
    return this.updateEvent(id, { status: 'draft' });
  }

  /**
   * Duplicates an event cleanly as a draft.
   * NON-NEGOTIABLE RULE: Duplicating an event MUST NOT duplicate guest tokens,
   * RSVPs, payment records, consent, check-ins, co-hosts or delivery history.
   */
  static duplicateEvent(
    id: string,
    newHostIdOrOptions?: string | { newHostId?: string; copyDates?: boolean }
  ): EventEntity {
    const original = this.getEventById(id);
    if (!original) throw new Error('Original event not found');

    const options =
      typeof newHostIdOrOptions === 'string'
        ? { newHostId: newHostIdOrOptions, copyDates: true }
        : newHostIdOrOptions || { copyDates: true };

    const duplicateTitle = `Copy of ${original.title}`;
    const copyDates = options.copyDates !== false;

    const newEvent = this.createEvent({
      ...original,
      id: undefined,
      slug: undefined,
      hostId: options.newHostId || original.hostId,
      title: duplicateTitle,
      status: 'draft',
      date: copyDates ? original.date : 'TBD Date',
      time: copyDates ? original.time : 'TBD Time',
      rsvpDeadline: copyDates ? original.rsvpDeadline : 'TBD Deadline',
      createdAt: undefined,
      updatedAt: undefined,
    });

    // Also copy design cleanly
    const originalDesign = this.getEventDesign(id);
    if (originalDesign) {
      mockDb.designs[newEvent.id] = {
        ...JSON.parse(JSON.stringify(originalDesign)),
        eventId: newEvent.id,
      };
    }

    return newEvent;
  }

  /**
   * Sanitizes an event for public unauthenticated endpoints,
   * stripping sensitive internal IDs and provider secrets.
   */
  static sanitizeForPublic(event: EventEntity): Partial<EventEntity> {
    const {
      hostId,
      ...publicFields
    } = event;
    return publicFields;
  }

  static deleteEvent(id: string): boolean {
    const idx = mockDb.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    mockDb.events.splice(idx, 1);
    delete mockDb.designs[id];
    return true;
  }
}
