'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Shield,
  Flag,
  ArrowRight,
  Filter,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { InsightsService } from '@/lib/services/insights-service';
import { EventEntity, EventReportEntity } from '@/lib/db/types';

const CANONICAL_CATEGORIES = [
  { id: 'all', label: 'All Occasions' },
  { id: 'corporate', label: 'Corporate & Summits' },
  { id: 'wedding', label: 'Weddings & Galas' },
  { id: 'birthday', label: 'Milestone Birthdays' },
  { id: 'graduation', label: 'Graduations' },
  { id: 'housewarming', label: 'Housewarmings' },
  { id: 'dinner', label: 'Dinners & Soirées' },
];

const KENYA_CITIES = ['All Cities', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'];

export default function PublicDiscoveryPage() {
  const [events, setEvents] = useState<Array<Partial<EventEntity>>>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');

  // Report Modal State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportingEvent, setReportingEvent] = useState<Partial<EventEntity>>({});
  const [reportReason, setReportReason] = useState<EventReportEntity['reason']>('inappropriate');
  const [reportDetails, setReportDetails] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const loadEvents = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (selectedCity !== 'All Cities') params.set('city', selectedCity);
        if (searchQuery.trim()) params.set('search', searchQuery.trim());

        const res = await fetch(`/api/public/discovery?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && Array.isArray(data.events)) {
            setEvents(data.events);
            return;
          }
        }
      } catch (err) {
        // Fallback to local service
      }
      if (!isCancelled) {
        const list = InsightsService.listPublicEvents({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          city: selectedCity !== 'All Cities' ? selectedCity : undefined,
          search: searchQuery.trim() || undefined,
        });
        setEvents(list);
      }
    };

    loadEvents();
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, selectedCity, searchQuery]);

  const handleOpenReport = (event: Partial<EventEntity>) => {
    setReportingEvent(event);
    setReportReason('inappropriate');
    setReportDetails('');
    setReporterContact('');
    setReportSuccess(false);
    setIsReportOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportingEvent.id) return;
    try {
      await fetch(`/api/public/events/${reportingEvent.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reportReason,
          details: reportDetails,
          reporterContact,
        }),
      });
    } catch (err) {
      InsightsService.reportEvent(reportingEvent.id, {
        reason: reportReason,
        details: reportDetails,
        reporterContact,
      });
    }
    setReportSuccess(true);
    setTimeout(() => {
      setIsReportOpen(false);
      setReportSuccess(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#272620]">
      {/* Hero Header */}
      <section className="border-b border-[rgba(39,38,32,.12)] bg-[#F8F5F0] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Curated Public Celebrations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#272620] tracking-tight">
            Discover Gatherings Across East Africa
          </h1>
          <p className="text-sm sm:text-base text-[#756F64] max-w-2xl mx-auto font-sans">
            Explore public summits, cultural festivals, community forums, and open galas designed on Kadi.
          </p>

          {/* Privacy Guarantee Banner */}
          <div className="max-w-2xl mx-auto p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-left flex items-start gap-3 text-xs text-amber-900 mt-4">
            <Shield className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Private by Default:</strong> Personal weddings, memorials, and private celebrations are strictly unlisted. Only public gatherings whose organizers have explicitly opted in appear here.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[rgba(39,38,32,.12)] shadow-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#756F64] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search summits, founders, cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[rgba(39,38,32,.2)] focus:outline-none focus:ring-2 focus:ring-[#934638]"
            />
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <MapPin className="w-4 h-4 text-[#756F64] flex-shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl border border-[rgba(39,38,32,.2)] bg-white p-2 text-xs font-medium text-[#272620] focus:outline-none focus:ring-2 focus:ring-[#934638]"
            >
              {KENYA_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pt-4 pb-2 scrollbar-none">
          {CANONICAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#934638] text-white shadow-sm'
                  : 'bg-white text-[#756F64] border border-[rgba(39,38,32,.15)] hover:text-[#272620]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#756F64]">
            {events.length} Public {events.length === 1 ? 'Event' : 'Events'} Available
          </h2>
          <Link href="/login" className="text-xs text-[#934638] hover:underline font-semibold">
            Host your own event →
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[rgba(39,38,32,.12)] p-8 space-y-3">
            <Sparkles className="w-8 h-8 text-[#934638] mx-auto opacity-40" />
            <h3 className="text-base font-serif font-bold text-[#272620]">
              No Public Events Matched Your Filter
            </h3>
            <p className="text-xs text-[#756F64] max-w-sm mx-auto">
              Try adjusting your search query, selecting &ldquo;All Cities&rdquo;, or checking back later as new public summits are listed.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCity('All Cities');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <Card
                key={ev.id}
                className="overflow-hidden border border-[rgba(39,38,32,.15)] bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Hero Image Container */}
                  <div className="relative h-44 w-full bg-[#EAE4DC]">
                    {ev.heroImage && (
                      <Image
                        src={ev.heroImage}
                        alt={ev.title || 'Event Cover'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#272620] shadow-sm backdrop-blur-sm">
                        {ev.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#272620] leading-snug line-clamp-2">
                        {ev.title}
                      </h3>
                      {ev.subtitle && (
                        <p className="text-xs text-[#756F64] line-clamp-2 mt-1">
                          {ev.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Schedule & Location */}
                    <div className="space-y-1.5 text-xs text-[#756F64] pt-2 border-t border-[rgba(39,38,32,.08)]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#934638] flex-shrink-0" />
                        <span>{ev.date || 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#934638] flex-shrink-0" />
                        <span>{ev.time || 'Time TBD'} ({ev.timezone || 'Africa/Nairobi'})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#934638] flex-shrink-0" />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-[#FBF9F5] border-t border-[rgba(39,38,32,.1)] flex items-center justify-between">
                  <button
                    onClick={() => handleOpenReport(ev)}
                    className="text-[11px] text-[#756F64] hover:text-rose-700 flex items-center gap-1 transition-all"
                    title="Report event for moderation"
                  >
                    <Flag className="w-3 h-3" />
                    <span>Report</span>
                  </button>

                  <Link href={`/e/${ev.slug}?src=discovery`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Invitation
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* REPORT EVENT MODAL */}
      <Modal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="Report Event for Review"
      >
        <div className="space-y-4 text-xs text-[#272620]">
          {reportSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-emerald-900">Report Submitted</p>
              <p className="text-xs text-emerald-800">
                Our moderation team will review &ldquo;{reportingEvent.title}&rdquo; promptly.
              </p>
            </div>
          ) : (
            <>
              <p className="text-[#756F64]">
                Help us keep Kadi safe. If &ldquo;{reportingEvent.title}&rdquo; violates our community standards, please indicate the reason below.
              </p>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#272620]">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as any)}
                  className="w-full rounded-xl border border-[rgba(39,38,32,.2)] bg-white p-2.5 text-xs text-[#272620]"
                >
                  <option value="inappropriate">Inappropriate or Offensive Content</option>
                  <option value="spam">Spam, Phishing, or Misleading Information</option>
                  <option value="fraud">Fraudulent or Impersonation Scheme</option>
                  <option value="harassment">Harassment or Hate Speech</option>
                  <option value="copyright">Intellectual Property / Copyright Infringement</option>
                  <option value="other">Other Concern</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#272620]">Additional Details (Optional)</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide context for our moderators..."
                  className="w-full rounded-xl border border-[rgba(39,38,32,.2)] bg-white p-2.5 text-xs text-[#272620]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#272620]">Your Contact Info (Optional)</label>
                <Input
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="Email or phone in case we need more details"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => setIsReportOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleSubmitReport}>
                  Submit Report
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
