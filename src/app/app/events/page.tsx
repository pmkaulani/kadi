'use client';

import React, { useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { EventService } from '@/lib/services/event-service';
import { RSVPService } from '@/lib/services/rsvp-service';
import { GuestService } from '@/lib/services/guest-service';
import { mockDb } from '@/lib/db/mock-db';
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  MapPin,
  ArrowRight,
  ExternalLink,
  Share2,
  Copy,
  Trash2,
  Check,
  Plus,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
  Mail,
  Settings as SettingsIcon,
  ShieldCheck,
  Smartphone,
  Sliders,
  Utensils,
  Music,
  Heart,
  Save,
  LogOut,
} from 'lucide-react';

function EventsDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams?.get('tab') || 'overview';

  const [events, setEvents] = useState(() => EventService.listEvents('host-1'));
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Invitations tab filter
  const [invitationsFilter, setInvitationsFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Guests tab state
  const [guestSearch, setGuestSearch] = useState('');
  const [guestStatusFilter, setGuestStatusFilter] = useState<'all' | 'attending' | 'pending' | 'declined'>('all');

  // Settings form state
  const [hostName, setHostName] = useState('Peter Kaulani');
  const [hostEmail, setHostEmail] = useState('peter@kaulani.com');
  const [hostPhone, setHostPhone] = useState('+254 712 345 678');
  const [mpesaNumber, setMpesaNumber] = useState('+254 712 345 678');
  const [notifyRsvp, setNotifyRsvp] = useState(true);
  const [notifyMpesa, setNotifyMpesa] = useState(true);
  const [notifyDigest, setNotifyDigest] = useState(false);

  const refresh = () => setEvents(EventService.listEvents('host-1'));
  const featuredEvent = events[0];
  const remainingEvents = useMemo(() => events.slice(1), [events]);

  const summary = featuredEvent
    ? RSVPService.getRSVPSummary(featuredEvent.id)
    : { totalHouseholds: 0, attendingAttendeeCount: 0, pendingHouseholds: 0, totalHeadcountExpected: 0 };

  const totalInvited = summary.totalHeadcountExpected || 156;
  const attending = summary.attendingAttendeeCount || 112;
  const awaiting = summary.pendingHouseholds || 32;
  const rsvpRate = totalInvited > 0 ? Math.round((attending / totalInvited) * 100) : 72;

  const handleDuplicate = (id: string) => {
    try {
      EventService.duplicateEvent(id);
      refresh();
      showToast('Invitation duplicated successfully');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not duplicate event');
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      EventService.deleteEvent(id);
      refresh();
      showToast('Invitation deleted');
    }
  };

  const showToast = (msg: string) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleShare = (slug: string) => {
    const url = `${window.location.origin}/e/${slug}`;
    void navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard!');
  };

  // Filtered invitations for 'invitations' tab
  const filteredEvents = useMemo(() => {
    if (invitationsFilter === 'all') return events;
    return events.filter((e) => e.status === invitationsFilter);
  }, [events, invitationsFilter]);

  // Aggregate all guests across host's events
  const allGuests = useMemo(() => {
    return events.flatMap((ev) => {
      const guests = GuestService.listGuests(ev.id);
      return guests.map((g) => ({ ...g, eventTitle: ev.celebrants || ev.title, eventSlug: ev.slug }));
    });
  }, [events]);

  const filteredGuests = useMemo(() => {
    return allGuests.filter((g) => {
      if (guestStatusFilter !== 'all') {
        if (guestStatusFilter === 'attending' && !(g.status === 'attending' || g.status === 'yes')) return false;
        if (guestStatusFilter === 'declined' && g.status !== 'no') return false;
        if (guestStatusFilter === 'pending' && !(g.status === 'pending' || g.status === 'maybe')) return false;
      }
      if (guestSearch.trim()) {
        const q = guestSearch.toLowerCase();
        const matchName = g.displayName.toLowerCase().includes(q);
        const matchContact = (g.contactPhone || '').toLowerCase().includes(q) || (g.contactEmail || '').toLowerCase().includes(q);
        const matchEvent = g.eventTitle.toLowerCase().includes(q);
        return matchName || matchContact || matchEvent;
      }
      return true;
    });
  }, [allGuests, guestSearch, guestStatusFilter]);

  // Aggregate messages across events
  const guestMessages = useMemo(() => {
    return mockDb.rsvps
      .filter((r) => r.noteToHost || r.songRequest)
      .map((r) => {
        const ev = events.find((e) => e.id === r.eventId);
        return {
          id: r.id,
          author: r.primaryName,
          eventTitle: ev?.celebrants || ev?.title || 'Celebration',
          note: r.noteToHost,
          song: r.songRequest,
          time: 'Recently',
          status: r.status,
        };
      });
  }, [events]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Workspace settings saved successfully');
  };

  return (
    <div className="max-w-[1380px] mx-auto space-y-6 sm:space-y-8">
      {/* Toast feedback */}
      {copyFeedback && (
        <div className="fixed top-20 right-6 z-50 bg-[#272620] text-white px-4 py-2.5 rounded-lg shadow-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} className="text-emerald-400" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW (Default Dashboard)                                       */}
      {/* ========================================================================= */}
      {currentTab === 'overview' && (
        <>
          {/* Greeting and Header */}
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl text-[#272620] font-normal tracking-[-0.03em]">
              Good morning, Peter
            </h1>
            <p className="text-xs sm:text-sm text-[#756F64] mt-1">
              <span className="hidden sm:inline">Here&apos;s what&apos;s happening with your invitations.</span>
              <span className="sm:hidden">Your invitations at a glance.</span>
            </p>
          </div>

          {events.length === 0 ? (
            <section className="bg-white/80 border border-[rgba(39,38,32,0.14)] p-12 rounded-lg text-center max-w-xl mx-auto">
              <p className="font-serif text-2xl text-[#272620]">No invitations created yet</p>
              <p className="text-xs text-[#756F64] mt-2 mb-6 leading-relaxed">
                Begin your journey by selecting a bespoke template and adding your gathering details.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/app/templates" className="kadi-button !bg-[#794a32] hover:!bg-[#603924]">
                  <Sparkles size={15} /> Pick a Template
                </Link>
                <Link
                  href="/app/events/new"
                  className="px-4 py-2.5 bg-white border border-[rgba(39,38,32,0.18)] rounded-md text-xs font-medium text-[#272620] hover:bg-[#FAF4EB] transition-colors"
                >
                  <Plus size={14} className="inline mr-1" /> Blank Canvas
                </Link>
              </div>
            </section>
          ) : (
            /* Grid Layout matching reference/app-workspace-target.png */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
              {/* Left Column: Prominent Event Feature + Next Steps */}
              <div className="lg:col-span-7 space-y-6">
                {featuredEvent && (
                  <>
                    {/* Mobile Feature Card matching reference/app-workspace-target.png (Phone 1) */}
                    <div className="sm:hidden relative rounded-2xl overflow-hidden shadow-lg border border-[rgba(39,38,32,0.15)] bg-[#1e1713] text-[#FBF6ED] p-4 pt-5 pb-5">
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={featuredEvent.heroImage || '/kadi/hero-envelope.webp'}
                          alt={featuredEvent.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          priority
                          className="object-cover filter brightness-[0.82] contrast-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center justify-between min-h-[260px]">
                        {/* Inner Translucent Frosted Glass Plate matching Phone 1 */}
                        <div className="w-full max-w-[290px] mx-auto bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center text-white shadow-xl">
                          <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-[#f5dfb8] font-medium mb-1">
                            Upcoming
                          </span>
                          <h2 className="font-serif text-xl sm:text-2xl text-white font-medium leading-tight">
                            {featuredEvent.celebrants || featuredEvent.title}
                          </h2>
                          <p className="text-[11px] text-white/80 font-serif italic mt-0.5 mb-1.5">
                            Wedding
                          </p>
                          <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/85 mb-3">
                            <Calendar size={11} className="text-[#f5dfb8]" />
                            <span>12 Dec 2026 · 2:00 PM</span>
                          </div>
                          {/* Large Countdown matching Phone 1 */}
                          <div className="flex items-center justify-center gap-2 text-white font-serif text-xl font-medium tracking-tight border-t border-white/15 pt-2 mt-1">
                            <span>42<span className="text-[10px] font-sans text-white/70 ml-0.5 mr-1">d</span></span>
                            <span>8<span className="text-[10px] font-sans text-white/70 ml-0.5 mr-1">h</span></span>
                            <span>23<span className="text-[10px] font-sans text-white/70 ml-0.5">m</span></span>
                          </div>
                        </div>

                        {/* White Pill Action Button matching Phone 1 */}
                        <Link
                          href={`/e/${featuredEvent.slug}`}
                          target="_blank"
                          className="block w-full max-w-[290px] mx-auto py-2.5 px-6 bg-white text-[#272620] rounded-full text-xs font-semibold text-center hover:bg-[#FAF4EB] transition-colors shadow-md mt-4 active:scale-[0.98]"
                        >
                          View Invitation
                        </Link>
                      </div>
                    </div>

                    {/* Mobile "Your Events" List matching reference (Phone 1) */}
                    <div className="sm:hidden bg-white border border-[rgba(39,38,32,0.12)] rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between pb-2.5 border-b border-[rgba(39,38,32,0.08)] mb-2">
                        <h3 className="font-serif text-sm text-[#272620] font-medium">Your Events</h3>
                        <Link href="/app/events?tab=invitations" className="text-[11px] text-[#8C8375] hover:text-[#272620]">
                          View all
                        </Link>
                      </div>
                      <div className="divide-y divide-[rgba(39,38,32,0.06)]">
                        {events.slice(0, 2).map((ev) => (
                          <Link
                            key={ev.id}
                            href={`/app/events/${ev.id}`}
                            className="flex items-center gap-3 py-2.5 group"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#E8DDD0] shrink-0 border border-black/5 relative">
                              <Image
                                src={ev.heroImage || '/kadi/hero-envelope.webp'}
                                alt={ev.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-medium text-[#272620] truncate group-hover:text-[#934638] transition-colors">
                                {ev.celebrants || ev.title}
                              </h4>
                              <p className="text-[10px] text-[#756F64] capitalize">{ev.category} · {ev.date}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Desktop / Tablet Feature Card matching reference */}
                    <div className="hidden sm:block bg-white border border-[rgba(39,38,32,0.12)] rounded-lg shadow-sm overflow-hidden">
                      <div className="grid sm:grid-cols-12 items-stretch min-h-[290px]">
                        {/* Event Photo on Left */}
                        <div className="sm:col-span-5 relative min-h-[200px] sm:min-h-full overflow-hidden bg-[#D9C8B6]">
                          <Image
                            src={featuredEvent.heroImage || '/kadi/hero-envelope.webp'}
                            alt={featuredEvent.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover object-center"
                          />
                        </div>

                        {/* Event Details on Right */}
                        <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#934638] block mb-1">
                              Upcoming Event
                            </span>
                            <h2 className="font-serif text-2xl sm:text-[28px] text-[#272620] leading-tight font-medium">
                              {featuredEvent.celebrants || featuredEvent.title}
                            </h2>
                            <p className="text-xs text-[#756F64] font-medium mt-0.5 mb-3">
                              {featuredEvent.title}
                            </p>

                            <div className="space-y-1.5 text-xs text-[#625B50] mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar size={13} className="text-[#934638] shrink-0" />
                                <span>{featuredEvent.date} · {featuredEvent.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={13} className="text-[#934638] shrink-0" />
                                <span className="truncate">{featuredEvent.venue}, {featuredEvent.city}</span>
                              </div>
                            </div>

                            {/* Countdown Timer */}
                            <div className="pt-3 border-t border-[rgba(39,38,32,0.08)] flex items-center gap-4 text-center">
                              <div>
                                <span className="font-serif text-xl sm:text-2xl font-medium text-[#272620] block leading-none">
                                  42
                                </span>
                                <span className="text-[9px] uppercase tracking-wider text-[#8A8174]">Days</span>
                              </div>
                              <div>
                                <span className="font-serif text-xl sm:text-2xl font-medium text-[#272620] block leading-none">
                                  08
                                </span>
                                <span className="text-[9px] uppercase tracking-wider text-[#8A8174]">Hours</span>
                              </div>
                              <div>
                                <span className="font-serif text-xl sm:text-2xl font-medium text-[#272620] block leading-none">
                                  23
                                </span>
                                <span className="text-[9px] uppercase tracking-wider text-[#8A8174]">Minutes</span>
                              </div>
                              <div>
                                <span className="font-serif text-xl sm:text-2xl font-medium text-[#272620] block leading-none">
                                  17
                                </span>
                                <span className="text-[9px] uppercase tracking-wider text-[#8A8174]">Seconds</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons Row matching reference */}
                          <div className="flex flex-wrap items-center gap-2.5 pt-4 mt-3 border-t border-[rgba(39,38,32,0.08)]">
                            <Link
                              href={`/app/events/${featuredEvent.id}`}
                              className="px-4 py-1.5 bg-[#FAF7F0] hover:bg-[#F0EAE0] border border-[rgba(39,38,32,0.18)] rounded text-xs font-medium text-[#272620] transition-colors"
                            >
                              Manage
                            </Link>
                            <Link
                              href={`/e/${featuredEvent.slug}`}
                              target="_blank"
                              className="px-4 py-1.5 bg-[#FAF7F0] hover:bg-[#F0EAE0] border border-[rgba(39,38,32,0.18)] rounded text-xs font-medium text-[#272620] transition-colors inline-flex items-center gap-1.5"
                            >
                              <span>Preview</span>
                              <ExternalLink size={12} className="text-[#8C8375]" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleShare(featuredEvent.slug)}
                              className="px-4 py-1.5 bg-[#FAF7F0] hover:bg-[#F0EAE0] border border-[rgba(39,38,32,0.18)] rounded text-xs font-medium text-[#272620] transition-colors inline-flex items-center gap-1.5"
                            >
                              <Share2 size={12} className="text-[#8C8375]" />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Next Steps Checklist matching reference (desktop only, hidden on mobile) */}
                <div className="hidden sm:block bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-5 sm:p-6 shadow-sm">
                  <h3 className="font-serif text-base sm:text-lg text-[#272620] font-medium mb-4">Next Steps</h3>
                  <div className="space-y-3.5 divide-y divide-[rgba(39,38,32,0.07)]">
                    {/* Step 1 */}
                    <div className="flex items-center justify-between gap-4 pt-1">
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-[#272620]">
                            Customize your invitation design
                          </h4>
                          <p className="text-[11px] text-[#756F64] mt-0.5">
                            Choose a template and make it yours.
                          </p>
                        </div>
                      </div>
                      {featuredEvent && (
                        <Link
                          href={`/app/events/${featuredEvent.id}`}
                          className="text-xs font-medium text-[#934638] hover:text-[#73352B] whitespace-nowrap inline-flex items-center gap-1"
                        >
                          <span>Go to Design</span>
                          <ArrowRight size={13} />
                        </Link>
                      )}
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center justify-between gap-4 pt-3.5">
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-[#272620]">
                            Add guest list
                          </h4>
                          <p className="text-[11px] text-[#756F64] mt-0.5">
                            Upload or import your guests.
                          </p>
                        </div>
                      </div>
                      {featuredEvent && (
                        <Link
                          href={`/app/events/${featuredEvent.id}?tab=guests`}
                          className="px-3 py-1 bg-[#FAF7F0] border border-[rgba(39,38,32,0.16)] rounded text-xs font-medium text-[#272620] hover:bg-[#F0EAE0] transition-colors whitespace-nowrap"
                        >
                          Manage Guests
                        </Link>
                      )}
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center justify-between gap-4 pt-3.5">
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-[#272620]">
                            Review and publish
                          </h4>
                          <p className="text-[11px] text-[#756F64] mt-0.5">
                            Make sure everything looks perfect.
                          </p>
                        </div>
                      </div>
                      {featuredEvent && (
                        <Link
                          href={`/e/${featuredEvent.slug}`}
                          target="_blank"
                          className="px-3 py-1 bg-[#FAF7F0] border border-[rgba(39,38,32,0.16)] rounded text-xs font-medium text-[#272620] hover:bg-[#F0EAE0] transition-colors whitespace-nowrap inline-flex items-center gap-1"
                        >
                          <span>Preview & Publish</span>
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 2x2 Metrics + Recent Activity (desktop only, hidden on mobile) */}
              <div className="hidden sm:block lg:col-span-5 space-y-6">
                {/* 2x2 Metrics Grid matching reference */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Metric 1 */}
                  <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-4 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[#8A8174] mb-2">
                      <span className="text-[11px] font-medium">Total Invited</span>
                      <Users size={16} className="text-[#8A8174]" />
                    </div>
                    <span className="font-serif text-2xl sm:text-3xl font-medium text-[#272620]">
                      {totalInvited}
                    </span>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-4 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[#8A8174] mb-2">
                      <span className="text-[11px] font-medium">Attending</span>
                      <CheckCircle2 size={16} className="text-emerald-600" />
                    </div>
                    <span className="font-serif text-2xl sm:text-3xl font-medium text-[#272620]">
                      {attending}
                    </span>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-4 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[#8A8174] mb-2">
                      <span className="text-[11px] font-medium">Awaiting Response</span>
                      <Clock size={16} className="text-amber-600" />
                    </div>
                    <span className="font-serif text-2xl sm:text-3xl font-medium text-[#272620]">
                      {awaiting}
                    </span>
                  </div>

                  {/* Metric 4 */}
                  <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-4 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[#8A8174] mb-2">
                      <span className="text-[11px] font-medium">RSVP Rate</span>
                      <TrendingUp size={16} className="text-sky-600" />
                    </div>
                    <span className="font-serif text-2xl sm:text-3xl font-medium text-[#272620]">
                      {rsvpRate}%
                    </span>
                  </div>
                </div>

                {/* Recent Activity Card matching reference */}
                <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-base sm:text-lg text-[#272620] font-medium">Recent Activity</h3>
                    <Link href="/app/events?tab=messages" className="text-xs text-[#8A8174] hover:text-[#272620]">
                      View all
                    </Link>
                  </div>

                  <div className="space-y-3.5 divide-y divide-[rgba(39,38,32,0.06)]">
                    {/* Activity 1 */}
                    <div className="flex items-start gap-3 pt-1">
                      <div className="w-7 h-7 rounded-full bg-[#E8DDD0] text-[#7A4E38] font-serif font-semibold text-xs flex items-center justify-center shrink-0">
                        S
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-[#272620]">
                          <strong className="font-medium">Sarah Wanjiru</strong>{' '}
                          <span className="text-emerald-700 font-medium">RSVPed Yes</span>
                        </p>
                        <span className="text-[10px] text-[#9A9184]">2 hours ago</span>
                      </div>
                    </div>

                    {/* Activity 2 */}
                    <div className="flex items-start gap-3 pt-3">
                      <div className="w-7 h-7 rounded-full bg-[#DCE4D8] text-[#4A6342] font-serif font-semibold text-xs flex items-center justify-center shrink-0">
                        D
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-[#272620]">
                          <strong className="font-medium">David Mwangi</strong> sent a message
                        </p>
                        <span className="text-[10px] text-[#9A9184]">4 hours ago</span>
                      </div>
                    </div>

                    {/* Activity 3 */}
                    <div className="flex items-start gap-3 pt-3">
                      <div className="w-7 h-7 rounded-full bg-[#E5DFEA] text-[#5C4573] font-serif font-semibold text-xs flex items-center justify-center shrink-0">
                        G
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-[#272620]">New photo added to gallery</p>
                        <span className="text-[10px] text-[#9A9184]">5 hours ago</span>
                      </div>
                    </div>

                    {/* Activity 4 */}
                    <div className="flex items-start gap-3 pt-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-serif font-semibold text-xs flex items-center justify-center shrink-0">
                        K
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-[#272620]">Contribution received (KES 2,000)</p>
                        <span className="text-[10px] text-[#9A9184]">6 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Events Table / List if multiple events exist */}
          {remainingEvents.length > 0 && (
            <section className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 shadow-sm hidden sm:block">
              <div className="flex items-center justify-between border-b border-[rgba(39,38,32,0.1)] pb-3 mb-4">
                <h3 className="font-serif text-xl text-[#272620]">All Other Invitations</h3>
                <span className="text-xs text-[#756F64]">{remainingEvents.length} events</span>
              </div>
              <div className="divide-y divide-[rgba(39,38,32,0.08)]">
                {remainingEvents.map((event) => (
                  <div key={event.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-[#272620] truncate">{event.title}</h4>
                      <p className="text-xs text-[#756F64]">{event.date} · {event.venue}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/app/events/${event.id}`}
                        className="text-xs font-medium text-[#934638] hover:text-[#73352B]"
                      >
                        Manage
                      </Link>
                      <button
                        onClick={() => handleDuplicate(event.id)}
                        className="p-1 text-[#8A8174] hover:text-[#272620]"
                        title="Duplicate"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="p-1 text-[#8A8174] hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INVITATIONS MANAGER                                                */}
      {/* ========================================================================= */}
      {currentTab === 'invitations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(39,38,32,0.1)] pb-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#272620] font-normal tracking-[-0.03em]">
                Your Invitations
              </h1>
              <p className="text-xs text-[#756F64] mt-1">
                Manage, edit, duplicate, and publish your digital invitation experiences.
              </p>
            </div>
            <Link
              href="/app/templates"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAF4EB] border border-[rgba(39,38,32,0.16)] rounded text-xs font-medium text-[#794a32] transition-colors shadow-sm w-fit shrink-0"
            >
              <Sparkles size={14} />
              <span>Browse Template Gallery</span>
            </Link>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInvitationsFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                invitationsFilter === 'all'
                  ? 'bg-[#794a32] text-white'
                  : 'bg-white border border-[rgba(39,38,32,0.14)] text-[#6D6558] hover:text-[#272620]'
              }`}
            >
              All ({events.length})
            </button>
            <button
              onClick={() => setInvitationsFilter('published')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                invitationsFilter === 'published'
                  ? 'bg-[#794a32] text-white'
                  : 'bg-white border border-[rgba(39,38,32,0.14)] text-[#6D6558] hover:text-[#272620]'
              }`}
            >
              Published ({events.filter((e) => e.status === 'published').length})
            </button>
            <button
              onClick={() => setInvitationsFilter('draft')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                invitationsFilter === 'draft'
                  ? 'bg-[#794a32] text-white'
                  : 'bg-white border border-[rgba(39,38,32,0.14)] text-[#6D6558] hover:text-[#272620]'
              }`}
            >
              Drafts ({events.filter((e) => e.status === 'draft').length})
            </button>
          </div>

          {/* Invitations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const evSummary = RSVPService.getRSVPSummary(ev.id);
              return (
                <div
                  key={ev.id}
                  className="bg-white border border-[rgba(39,38,32,0.12)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-44 w-full bg-[#302824] overflow-hidden">
                      <Image
                        src={ev.heroImage || '/kadi/hero-envelope.webp'}
                        alt={ev.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white uppercase tracking-wider">
                        {ev.category}
                      </span>
                      <span
                        className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium ${
                          ev.status === 'published'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-400 text-amber-950'
                        }`}
                      >
                        {ev.status === 'published' ? 'Live' : 'Draft'}
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-serif text-lg leading-tight font-medium drop-shadow">
                          {ev.celebrants || ev.title}
                        </h3>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-2 text-xs text-[#6F675A]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#934638]" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#934638]" />
                        <span className="truncate">{ev.venue}, {ev.city}</span>
                      </div>
                      <div className="pt-2 border-t border-[rgba(39,38,32,0.08)] flex items-center justify-between text-[11px]">
                        <span>{evSummary.totalHeadcountExpected || 100} Guests</span>
                        <span className="text-emerald-700 font-medium">
                          {evSummary.attendingAttendeeCount || 45} Attending
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-[#FAF7F0] border-t border-[rgba(39,38,32,0.08)] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/app/events/${ev.id}`}
                        className="px-3 py-1.5 bg-white border border-[rgba(39,38,32,0.16)] rounded text-xs font-medium text-[#272620] hover:bg-[#F0EAE0]"
                      >
                        Manage
                      </Link>
                      <Link
                        href={`/e/${ev.slug}`}
                        target="_blank"
                        className="p-1.5 text-[#756F64] hover:text-[#272620]"
                        title="Preview live invitation"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleShare(ev.slug)}
                        className="p-1.5 text-[#756F64] hover:text-[#272620]"
                        title="Share link"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(ev.id)}
                        className="p-1.5 text-[#756F64] hover:text-[#272620]"
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ev.id, ev.title)}
                        className="p-1.5 text-[#756F64] hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GUESTS & RSVPS                                                     */}
      {/* ========================================================================= */}
      {currentTab === 'guests' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(39,38,32,0.1)] pb-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#272620] font-normal tracking-[-0.03em]">
                Guests & RSVPs
              </h1>
              <p className="text-xs text-[#756F64] mt-1">
                Track guest households, RSVP attendance, plus-one allocations, and invitation tokens.
              </p>
            </div>
            {featuredEvent && (
              <Link
                href={`/app/events/${featuredEvent.id}?tab=guests`}
                className="kadi-button !min-h-[38px] !px-4 !py-2 !bg-[#934638] hover:!bg-[#73352B] text-xs font-medium whitespace-nowrap w-fit"
              >
                <Plus size={14} />
                <span>Import / Add Guest</span>
              </Link>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border border-[rgba(39,38,32,0.12)] p-4 rounded-lg shadow-sm">
              <span className="text-[11px] text-[#756F64] block">Households</span>
              <span className="font-serif text-2xl font-medium text-[#272620]">{allGuests.length}</span>
            </div>
            <div className="bg-white border border-[rgba(39,38,32,0.12)] p-4 rounded-lg shadow-sm">
              <span className="text-[11px] text-emerald-700 block">Confirmed Attending</span>
              <span className="font-serif text-2xl font-medium text-emerald-800">
                {allGuests.filter((g) => g.status === 'attending').length}
              </span>
            </div>
            <div className="bg-white border border-[rgba(39,38,32,0.12)] p-4 rounded-lg shadow-sm">
              <span className="text-[11px] text-amber-700 block">Awaiting Response</span>
              <span className="font-serif text-2xl font-medium text-amber-800">
                {allGuests.filter((g) => g.status === 'pending').length}
              </span>
            </div>
            <div className="bg-white border border-[rgba(39,38,32,0.12)] p-4 rounded-lg shadow-sm">
              <span className="text-[11px] text-rose-700 block">Declined</span>
              <span className="font-serif text-2xl font-medium text-rose-800">
                {allGuests.filter((g) => g.status === 'no').length}
              </span>
            </div>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[rgba(39,38,32,0.1)] shadow-sm">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8375]" />
              <input
                type="text"
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                placeholder="Search guest by name, phone, or event..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FAF7F0] border border-[rgba(39,38,32,0.12)] rounded focus:outline-none focus:border-[#934638]"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'attending', 'pending', 'declined'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setGuestStatusFilter(st)}
                  className={`px-3 py-1 rounded text-xs capitalize transition-colors ${
                    guestStatusFilter === st
                      ? 'bg-[#272620] text-white font-medium'
                      : 'text-[#6F675A] hover:bg-black/[0.04]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Stacked Card List (< 640px) */}
          <div className="sm:hidden space-y-3">
            {filteredGuests.length === 0 ? (
              <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 text-center text-xs text-[#8C8375]">
                No guests match the search criteria.
              </div>
            ) : (
              filteredGuests.map((g) => {
                const guestLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/e/${g.eventSlug}?token=${g.token}`;
                const isAttending = g.status === 'attending' || g.status === 'yes';
                const isDeclined = g.status === 'no';
                return (
                  <div
                    key={g.id}
                    className="bg-white border border-[rgba(39,38,32,0.12)] rounded-xl p-4 shadow-sm space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-semibold text-sm text-[#272620] block truncate">
                          {g.displayName}
                        </span>
                        <span className="text-[11px] text-[#8C8375] block truncate mt-0.5">
                          {g.contactPhone || g.contactEmail || 'No contact specified'}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize shrink-0 ${
                          isAttending
                            ? 'bg-emerald-100 text-emerald-800'
                            : isDeclined
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isAttending ? 'Attending' : isDeclined ? 'Declined' : 'Pending'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#6F675A] pt-1 border-t border-[rgba(39,38,32,0.06)]">
                      <span className="truncate">{g.eventTitle}</span>
                      <span>·</span>
                      <span className="px-1.5 py-0.5 bg-[#FAF7F0] border border-[rgba(39,38,32,0.1)] rounded text-[10px]">
                        {g.group}
                      </span>
                      <span>·</span>
                      <span>+{g.allowedPlusOnes} plus one</span>
                    </div>

                    <div className="pt-1.5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard.writeText(guestLink);
                          showToast(`Personal link copied for ${g.displayName}`);
                        }}
                        className="w-full sm:w-auto min-h-[40px] px-3 py-2 bg-[#FAF7F0] hover:bg-[#F0EAE0] border border-[rgba(39,38,32,0.14)] rounded-lg text-xs font-semibold text-[#272620] inline-flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
                      >
                        <Copy size={13} />
                        <span>Copy personal link</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Guests Table (>= 640px) */}
          <div className="hidden sm:block bg-white border border-[rgba(39,38,32,0.12)] rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F0] text-[#756F64] border-b border-[rgba(39,38,32,0.1)]">
                  <tr>
                    <th className="py-3 px-4 font-medium">Guest / Household</th>
                    <th className="py-3 px-4 font-medium">Event</th>
                    <th className="py-3 px-4 font-medium">Group</th>
                    <th className="py-3 px-4 font-medium">Plus Ones</th>
                    <th className="py-3 px-4 font-medium">RSVP Status</th>
                    <th className="py-3 px-4 font-medium text-right">Personal Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(39,38,32,0.07)] text-[#272620]">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#8C8375]">
                        No guests match the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((g) => {
                      const guestLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/e/${g.eventSlug}?token=${g.token}`;
                      const isAttending = g.status === 'attending' || g.status === 'yes';
                      const isDeclined = g.status === 'no';
                      return (
                        <tr key={g.id} className="hover:bg-black/[0.015]">
                          <td className="py-3 px-4">
                            <span className="font-medium block">{g.displayName}</span>
                            <span className="text-[11px] text-[#8C8375] block">
                              {g.contactPhone || g.contactEmail || 'No contact specified'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#6F675A]">{g.eventTitle}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-[#FAF7F0] border border-[rgba(39,38,32,0.1)] rounded text-[10px]">
                              {g.group}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#6F675A]">+{g.allowedPlusOnes}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize inline-block ${
                                isAttending
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isDeclined
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isAttending ? 'Attending' : isDeclined ? 'Declined' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                void navigator.clipboard.writeText(guestLink);
                                showToast(`Personal link copied for ${g.displayName}`);
                              }}
                              className="px-2.5 py-1 bg-[#FAF7F0] hover:bg-[#F0EAE0] border border-[rgba(39,38,32,0.14)] rounded text-[11px] font-medium text-[#272620] inline-flex items-center gap-1"
                            >
                              <Copy size={11} />
                              <span>Copy link</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MESSAGES & GUESTBOOK                                               */}
      {/* ========================================================================= */}
      {currentTab === 'messages' && (
        <div className="space-y-6">
          <div className="border-b border-[rgba(39,38,32,0.1)] pb-4">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#272620] font-normal tracking-[-0.03em]">
              Guest Messages & Guestbook
            </h1>
            <p className="text-xs text-[#756F64] mt-1">
              Personal congratulations, well wishes, and song requests submitted with RSVPs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guestMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FAF4EB] border border-[rgba(39,38,32,0.1)] text-[#934638] font-serif font-semibold text-sm flex items-center justify-center">
                      {msg.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#272620]">{msg.author}</h4>
                      <p className="text-[10px] text-[#8C8375]">{msg.eventTitle} · {msg.time}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-medium rounded">
                    Attending
                  </span>
                </div>

                {msg.note && (
                  <p className="text-xs text-[#4F493E] italic bg-[#FAF7F0] p-3 rounded border border-[rgba(39,38,32,0.06)] leading-relaxed">
                    &ldquo;{msg.note}&rdquo;
                  </p>
                )}

                {msg.song && (
                  <div className="flex items-center gap-2 text-[11px] text-[#7A4E38]">
                    <Music size={13} className="shrink-0 text-[#934638]" />
                    <span>Requested: <strong>{msg.song}</strong></span>
                  </div>
                )}
              </div>
            ))}

            {/* Seed message 2 */}
            <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF4EB] border border-[rgba(39,38,32,0.1)] text-[#934638] font-serif font-semibold text-sm flex items-center justify-center">
                    G
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#272620]">Grace & Brian Mwangi</h4>
                    <p className="text-[10px] text-[#8C8375]">The Wedding of Kevin & Wanjiku · 4 hours ago</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-medium rounded">
                  Attending
                </span>
              </div>
              <p className="text-xs text-[#4F493E] italic bg-[#FAF7F0] p-3 rounded border border-[rgba(39,38,32,0.06)] leading-relaxed">
                &ldquo;So thrilled for you both! We will definitely be on the dancefloor all evening.&rdquo;
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#7A4E38]">
                <Music size={13} className="shrink-0 text-[#934638]" />
                <span>Requested: <strong>Bensoul — Medicine</strong></span>
              </div>
            </div>

            {/* Seed message 3 */}
            <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF4EB] border border-[rgba(39,38,32,0.1)] text-[#934638] font-serif font-semibold text-sm flex items-center justify-center">
                    M
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#272620]">Mama Joyce Kariuki</h4>
                    <p className="text-[10px] text-[#8C8375]">The Wedding of Kevin & Wanjiku · Yesterday</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-medium rounded">
                  Attending
                </span>
              </div>
              <p className="text-xs text-[#4F493E] italic bg-[#FAF7F0] p-3 rounded border border-[rgba(39,38,32,0.06)] leading-relaxed">
                &ldquo;May God bless this holy union abundantly. Prayers of joy from the entire family.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: INSIGHTS & ANALYTICS                                               */}
      {/* ========================================================================= */}
      {currentTab === 'insights' && (
        <div className="space-y-6">
          <div className="border-b border-[rgba(39,38,32,0.1)] pb-4">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#272620] font-normal tracking-[-0.03em]">
              Event Insights & Analytics
            </h1>
            <p className="text-xs text-[#756F64] mt-1">
              Guest response velocity, headcount conversion rate, and dietary requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[rgba(39,38,32,0.12)] p-5 rounded-lg shadow-sm">
              <span className="text-xs text-[#756F64] block mb-1">RSVP Velocity</span>
              <span className="font-serif text-3xl font-medium text-[#272620] block">84%</span>
              <span className="text-[11px] text-emerald-700 mt-1 block">↑ 12% faster than average</span>
            </div>
            <div className="bg-white border border-[rgba(39,38,32,0.12)] p-5 rounded-lg shadow-sm">
              <span className="text-xs text-[#756F64] block mb-1">Average Plus-Ones</span>
              <span className="font-serif text-3xl font-medium text-[#272620] block">1.8</span>
              <span className="text-[11px] text-[#8C8375] mt-1 block">Max permitted: 3</span>
            </div>
            <div className="bg-white border border-[rgba(39,38,32,0.12)] p-5 rounded-lg shadow-sm">
              <span className="text-xs text-[#756F64] block mb-1">Dietary Special Requests</span>
              <span className="font-serif text-3xl font-medium text-[#272620] block">14%</span>
              <span className="text-[11px] text-amber-700 mt-1 block">Vegetarian & Gluten-Free</span>
            </div>
            <div className="bg-white border border-[rgba(39,38,32,0.12)] p-5 rounded-lg shadow-sm">
              <span className="text-xs text-[#756F64] block mb-1">M-Pesa Contributions</span>
              <span className="font-serif text-3xl font-medium text-emerald-800 block">KES 46,000</span>
              <span className="text-[11px] text-[#8C8375] mt-1 block">Direct till collection</span>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#272620] font-medium">Attendance Headcount Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#272620] font-medium">Attending (Adults)</span>
                    <span className="text-[#756F64]">98 guests (78%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#FAF4EB] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#272620] font-medium">Attending (Children)</span>
                    <span className="text-[#756F64]">14 guests (11%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#FAF4EB] rounded-full overflow-hidden">
                    <div className="h-full bg-sky-600 rounded-full" style={{ width: '11%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#272620] font-medium">Awaiting Confirmation</span>
                    <span className="text-[#756F64]">32 guests (25%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#FAF4EB] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#272620] font-medium">Meal Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#FAF7F0] rounded border border-[rgba(39,38,32,0.06)] text-xs">
                  <div className="flex items-center gap-2">
                    <Utensils size={14} className="text-[#934638]" />
                    <span className="font-medium text-[#272620]">Chicken & Coastal Pilau</span>
                  </div>
                  <span className="font-semibold text-[#272620]">68 orders</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#FAF7F0] rounded border border-[rgba(39,38,32,0.06)] text-xs">
                  <div className="flex items-center gap-2">
                    <Utensils size={14} className="text-[#934638]" />
                    <span className="font-medium text-[#272620]">Prime Braised Beef</span>
                  </div>
                  <span className="font-semibold text-[#272620]">34 orders</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#FAF7F0] rounded border border-[rgba(39,38,32,0.06)] text-xs">
                  <div className="flex items-center gap-2">
                    <Utensils size={14} className="text-[#934638]" />
                    <span className="font-medium text-[#272620]">Vegetarian / Vegan</span>
                  </div>
                  <span className="font-semibold text-[#272620]">10 orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SETTINGS                                                           */}
      {/* ========================================================================= */}
      {currentTab === 'settings' && (
        <div className="space-y-6 max-w-3xl">
          <div className="border-b border-[rgba(39,38,32,0.1)] pb-4">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#272620] font-normal tracking-[-0.03em]">
              Workspace Settings
            </h1>
            <p className="text-xs text-[#756F64] mt-1">
              Configure your host account, Safaricom M-Pesa payout details, and notifications.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Host Profile */}
            <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#272620] font-medium border-b border-[rgba(39,38,32,0.08)] pb-2">
                Host Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#272620] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[rgba(39,38,32,0.15)] rounded focus:outline-none focus:border-[#934638]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#272620] block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={hostEmail}
                    onChange={(e) => setHostEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[rgba(39,38,32,0.15)] rounded focus:outline-none focus:border-[#934638]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#272620] block mb-1">WhatsApp / Contact Phone</label>
                <input
                  type="text"
                  value={hostPhone}
                  onChange={(e) => setHostPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[rgba(39,38,32,0.15)] rounded focus:outline-none focus:border-[#934638]"
                />
              </div>
            </div>

            {/* M-Pesa Gifting */}
            <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(39,38,32,0.08)] pb-2">
                <h3 className="font-serif text-lg text-[#272620] font-medium">M-Pesa Gifting & Payouts</h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-medium rounded flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>Verified Account</span>
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-[#272620] block mb-1">
                  Safaricom M-Pesa Number for Gifts
                </label>
                <input
                  type="text"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[rgba(39,38,32,0.15)] rounded focus:outline-none focus:border-[#934638]"
                />
                <p className="text-[10px] text-[#8C8375] mt-1">
                  Wedding registry and gift cash contributions from guests will be routed directly to this recipient.
                </p>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 shadow-sm space-y-3">
              <h3 className="font-serif text-lg text-[#272620] font-medium border-b border-[rgba(39,38,32,0.08)] pb-2">
                Notification Preferences
              </h3>
              <label className="flex items-center gap-3 text-xs text-[#272620] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyRsvp}
                  onChange={(e) => setNotifyRsvp(e.target.checked)}
                  className="rounded text-[#934638] focus:ring-[#934638]"
                />
                <span>Instant email notification whenever a guest submits an RSVP</span>
              </label>
              <label className="flex items-center gap-3 text-xs text-[#272620] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyMpesa}
                  onChange={(e) => setNotifyMpesa(e.target.checked)}
                  className="rounded text-[#934638] focus:ring-[#934638]"
                />
                <span>SMS confirmation on receipt of gift contributions</span>
              </label>
              <label className="flex items-center gap-3 text-xs text-[#272620] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyDigest}
                  onChange={(e) => setNotifyDigest(e.target.checked)}
                  className="rounded text-[#934638] focus:ring-[#934638]"
                />
                <span>Weekly summary digest of invitation activity</span>
              </label>
            </div>

            <button
              type="submit"
              className="kadi-button !min-h-[40px] !px-6 !py-2.5 !bg-[#934638] hover:!bg-[#73352B] text-xs font-medium"
            >
              <Save size={14} />
              <span>Save Workspace Settings</span>
            </button>
          </form>

          {/* Account & Session Management / Mobile & Desktop Sign Out */}
          <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(39,38,32,0.08)] pb-3">
              <h3 className="font-serif text-lg text-[#272620] font-medium">
                Host Account & Session
              </h3>
              <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                Active Session
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#934638] text-[#FAF8F5] flex items-center justify-center font-serif text-sm font-semibold tracking-wider">
                  PK
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#272620]">Peter Kaulani</p>
                  <p className="text-[11px] text-[#756F64]">peter@kaulani.com · Verified Host Account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                  } catch {}
                  router.push('/login');
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-colors"
              >
                <LogOut size={14} />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventsDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse py-4">
          <div className="h-8 w-48 bg-[#E8E6DF] rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-72 bg-white rounded-2xl border border-[rgba(29,29,31,0.08)]" />
            <div className="lg:col-span-5 h-72 bg-white rounded-2xl border border-[rgba(29,29,31,0.08)]" />
          </div>
        </div>
      }
    >
      <EventsDashboardContent />
    </Suspense>
  );
}
