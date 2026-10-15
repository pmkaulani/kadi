import { mockDb } from '../db/mock-db';
import { EventEntity, EventDesignEntity } from '../db/types';
import { getTemplateById } from '../templates/catalogue';

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

  static createEvent(payload: Partial<EventEntity>): EventEntity {
    const template = getTemplateById(payload.templateId || 'savannah-twilight');
    const slugBase = (payload.title || 'celebration')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${slugBase}-${Math.random().toString(36).substring(2, 6)}`;

    const newEvent: EventEntity = {
      ...payload,
      id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
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

    mockDb.events[idx] = {
      ...mockDb.events[idx],
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
          envelope: '#252042',
          flap: '#2D2752',
          cardBackground: '#FCFCF9',
        },
        linerId: 'gold-foil',
        sealShape: 'diamond',
        sealMonogram: 'K',
        sealColor: '#D4AF37',
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

  /**
   * Duplicates an event cleanly as a draft.
   * NON-NEGOTIABLE RULE: Duplicating an event MUST NOT duplicate guest tokens,
   * RSVPs, payment records, consent or delivery history.
   */
  static duplicateEvent(id: string): EventEntity {
    const original = this.getEventById(id);
    if (!original) throw new Error('Original event not found');

    const duplicateTitle = `Copy of ${original.title}`;
    const newEvent = this.createEvent({
      ...original,
      id: undefined,
      slug: undefined,
      title: duplicateTitle,
      status: 'draft',
      createdAt: undefined,
      updatedAt: undefined,
    });

    return newEvent;
  }

  static deleteEvent(id: string): boolean {
    const idx = mockDb.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    mockDb.events.splice(idx, 1);
    delete mockDb.designs[id];
    return true;
  }
}
