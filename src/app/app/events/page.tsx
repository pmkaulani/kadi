'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EventService } from '@/lib/services/event-service';
import { RSVPService } from '@/lib/services/rsvp-service';
import { GuestService } from '@/lib/services/guest-service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  Calendar,
  Users,
  CheckCircle2,
  ExternalLink,
  Plus,
  Copy,
  Trash2,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';

export default function EventsDashboardPage() {
  const [events, setEvents] = useState(() => EventService.listEvents('host-1'));

  const handleDuplicate = (id: string) => {
    try {
      const copy = EventService.duplicateEvent(id);
      setEvents(EventService.listEvents('host-1'));
    } catch (err: any) {
      alert(err.message || 'Could not duplicate event');
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      EventService.deleteEvent(id);
      setEvents(EventService.listEvents('host-1'));
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal">
            My Events & Invitations
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate mt-1">
            Manage your guest lists, design studio, and real-time RSVPs.
          </p>
        </div>

        <Link href="/app/events/new">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-md shadow-brand-purple/20"
          >
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="text-center p-12">
          <div className="w-16 h-16 rounded-3xl bg-brand-purple-light text-brand-purple flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-brand-charcoal">
            No events created yet
          </h3>
          <p className="text-xs sm:text-sm text-brand-slate mt-1 max-w-sm mx-auto mb-6">
            Get started by creating your first digital invitation suite with an animated 3D envelope.
          </p>
          <Link href="/app/events/new">
            <Button variant="primary">Create Your First Invitation</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => {
            const summary = RSVPService.getRSVPSummary(event.id);

            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Event Header Banner */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={event.status === 'published' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {event.status}
                        </Badge>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {event.category}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-brand-charcoal leading-snug">
                        {event.title}
                      </h2>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={event.heroImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Meta details */}
                  <div className="space-y-1.5 mt-4 text-xs text-brand-slate">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-brand-purple flex-shrink-0" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-purple flex-shrink-0" />
                      <span className="truncate">{event.venue}, {event.city}</span>
                    </div>
                  </div>

                  {/* RSVP Stat Strip */}
                  <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-brand-mist">
                      <span className="text-xs uppercase font-bold text-brand-slate block text-[10px]">
                        Households
                      </span>
                      <span className="text-base font-bold text-brand-charcoal">
                        {summary.totalHouseholds}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900">
                      <span className="text-xs uppercase font-bold text-emerald-700 block text-[10px]">
                        Attending
                      </span>
                      <span className="text-base font-bold text-emerald-800">
                        {summary.attendingAttendeeCount}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900">
                      <span className="text-xs uppercase font-bold text-amber-700 block text-[10px]">
                        Pending
                      </span>
                      <span className="text-base font-bold text-amber-800">
                        {summary.pendingHouseholds}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDuplicate(event.id)}
                      className="p-2 text-slate-500 hover:text-brand-purple rounded-xl hover:bg-white transition-colors"
                      title="Duplicate Event as New Draft"
                      aria-label="Duplicate Event as New Draft"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id, event.title)}
                      className="p-2 text-slate-400 hover:text-status-error rounded-xl hover:bg-white transition-colors"
                      title="Delete Event"
                      aria-label="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {event.status === 'published' && (
                      <Link
                        href={`/e/${event.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-brand-slate hover:text-brand-charcoal px-3 py-1.5 rounded-xl hover:bg-white flex items-center gap-1.5 transition-colors"
                      >
                        <span>Guest View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    <Link href={`/app/events/${event.id}`}>
                      <Button size="sm" variant="primary">
                        Manage Event <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
