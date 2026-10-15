'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventService } from '@/lib/services/event-service';
import { GuestService } from '@/lib/services/guest-service';
import { RSVPService } from '@/lib/services/rsvp-service';
import { getTemplateById } from '@/lib/templates/catalogue';
import { EnvelopeRenderer } from '@/components/animation/EnvelopeRenderer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Users,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Plus,
  FileSpreadsheet,
  Download,
  Trash2,
  Sparkles,
  Palette,
  Eye,
  EyeOff,
  Smartphone,
  Info,
  ArrowLeft,
  Utensils,
  Music,
  ChevronUp,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { ScheduleSection } from '@/components/invitations/ScheduleSection';
import { VenueSection } from '@/components/invitations/VenueSection';
import { CeremonyReceptionSection } from '@/components/invitations/CeremonyReceptionSection';
import { StorySection } from '@/components/invitations/StorySection';
import { GallerySection } from '@/components/invitations/GallerySection';
import { FAQSection } from '@/components/invitations/FAQSection';
import { BirthdayAboutSection } from '@/components/invitations/BirthdayAboutSection';
import { BirthdayActivitiesSection } from '@/components/invitations/BirthdayActivitiesSection';
import { MemorialObituarySection } from '@/components/invitations/MemorialObituarySection';
import { MemorialServiceSection } from '@/components/invitations/MemorialServiceSection';
import { MemorialTributesCandlesSection } from '@/components/invitations/MemorialTributesCandlesSection';
import { MemorialLivestreamSection } from '@/components/invitations/MemorialLivestreamSection';
import { CondolencesSection } from '@/components/invitations/CondolencesSection';
import { RSVPSection } from '@/components/invitations/RSVPSection';
import { RegistrySection } from '@/components/invitations/RegistrySection';
import { ClosingSection } from '@/components/invitations/ClosingSection';

type TabType = 'overview' | 'guests' | 'rsvps' | 'design' | 'share' | 'contributions';

export default function EventCommandCenterPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  // Load Domain Entities
  const [event, setEvent] = useState(() => EventService.getEventById(eventId));
  const [design, setDesign] = useState(() => EventService.getEventDesign(eventId));
  const [guests, setGuests] = useState(() => GuestService.listGuests(eventId));
  const [rsvps, setRsvps] = useState(() => RSVPService.listRSVPs(eventId));
  const [summary, setSummary] = useState(() => RSVPService.getRSVPSummary(eventId));

  // Guest Search & Filter
  const [guestSearch, setGuestSearch] = useState('');
  const [guestGroupFilter, setGuestGroupFilter] = useState('all');

  // Add Guest Modal State
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestGroup, setNewGuestGroup] = useState('Guests');
  const [newGuestPlusOnes, setNewGuestPlusOnes] = useState(1);

  // CSV Import Modal State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvText, setCsvText] = useState(
    'Name,Phone,Group,PlusOnes\nDr. Peter Otieno,+254712345678,Family,2\nGrace Mwangi,+254722987654,Friends,1\nHon. Kiprono,+254733112233,VIP,1'
  );

  // Design Editor Local State
  const defaultSectionsByCategory: Record<string, string[]> = {
    wedding: ['story', 'ceremony', 'schedule', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
    birthday: ['about', 'activities', 'schedule', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
    memorial: ['obituary', 'services', 'livestream', 'candles', 'rsvp', 'registry', 'closing'],
    funeral: ['obituary', 'services', 'livestream', 'candles', 'rsvp', 'closing'],
    housewarming: ['story', 'schedule', 'gallery', 'faq', 'rsvp', 'closing'],
    graduation: ['story', 'ceremony', 'schedule', 'gallery', 'faq', 'rsvp', 'closing'],
    corporate: ['schedule', 'faq', 'rsvp', 'closing'],
    anniversary: ['story', 'ceremony', 'schedule', 'gallery', 'rsvp', 'closing'],
    'baby-shower': ['about', 'activities', 'registry', 'rsvp', 'closing'],
    holiday: ['activities', 'schedule', 'rsvp', 'closing'],
  };

  const [editorLiner, setEditorLiner] = useState(design?.linerId || 'gold-foil');
  const [editorSealMonogram, setEditorSealMonogram] = useState(design?.sealMonogram || 'K&W');
  const [editorSealColor, setEditorSealColor] = useState(design?.sealColor || '#D4AF37');
  const [editorEnvelopeColor, setEditorEnvelopeColor] = useState(
    design?.palette?.envelope || '#252042'
  );
  const [editorSections, setEditorSections] = useState<string[]>(() => {
    return (
      design?.sectionOrder ||
      design?.visibleSections ||
      (event ? defaultSectionsByCategory[event.category] : undefined) || [
        'venue',
        'schedule',
        'gallery',
        'faq',
        'registry',
        'rsvp',
        'closing',
      ]
    );
  });
  const [isDesignSaved, setIsDesignSaved] = useState(false);

  if (!event) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-serif font-bold text-brand-charcoal">Event not found</h2>
        <Link href="/app/events">
          <Button variant="primary" className="mt-4">Back to Events</Button>
        </Link>
      </div>
    );
  }

  const template = getTemplateById(event.templateId) || getTemplateById('savannah-twilight')!;
  const canonicalUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/e/${event.slug}`;

  const refreshData = () => {
    setEvent(EventService.getEventById(eventId));
    setDesign(EventService.getEventDesign(eventId));
    setGuests(GuestService.listGuests(eventId, guestSearch, guestGroupFilter));
    setRsvps(RSVPService.listRSVPs(eventId));
    setSummary(RSVPService.getRSVPSummary(eventId));
  };

  const handlePublish = () => {
    EventService.publishEvent(eventId);
    refreshData();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Add Guest Handler
  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    GuestService.addGuest(eventId, {
      displayName: newGuestName,
      contactPhone: newGuestPhone || undefined,
      contactEmail: newGuestEmail || undefined,
      group: newGuestGroup,
      allowedPlusOnes: Number(newGuestPlusOnes),
    });

    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestEmail('');
    setIsAddGuestOpen(false);
    refreshData();
  };

  // CSV Import Handler
  const handleImportCsv = () => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      alert('Please provide a header line and at least one guest row.');
      return;
    }

    const rows = lines.slice(1).map((line) => {
      const parts = line.split(',');
      return {
        name: parts[0]?.trim(),
        phone: parts[1]?.trim(),
        group: parts[2]?.trim() || 'Guests',
        plusOnes: Number(parts[3]) || 1,
      };
    });

    const result = GuestService.importGuests(eventId, rows);
    alert(`Successfully imported ${result.importedCount} guest households!`);
    setIsCsvModalOpen(false);
    refreshData();
  };

  const handleDeleteGuest = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from guest list?`)) {
      GuestService.deleteGuest(id);
      refreshData();
    }
  };

  const handleSaveDesign = () => {
    EventService.updateDesign(eventId, {
      linerId: editorLiner,
      sealMonogram: editorSealMonogram,
      sealColor: editorSealColor,
      visibleSections: editorSections,
      sectionOrder: editorSections,
      palette: {
        ...design?.palette,
        envelope: editorEnvelopeColor,
        primary: design?.palette?.primary || '#934638',
        secondary: design?.palette?.secondary || '#B99A62',
        accent: design?.palette?.accent || '#A94F51',
        flap: editorEnvelopeColor,
        cardBackground: design?.palette?.cardBackground || '#FCFCF9',
      },
    });
    refreshData();
    setIsDesignSaved(true);
    setTimeout(() => setIsDesignSaved(false), 3000);
  };

  const filteredGuests = GuestService.listGuests(eventId, guestSearch, guestGroupFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner / Event Title */}
      <div className="bg-transparent py-5 sm:py-7 border-y border-[rgba(39,38,32,.18)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Link
              href="/app/events"
              className="text-xs text-brand-slate hover:text-brand-charcoal flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Events</span>
            </Link>
            <span className="text-slate-300">/</span>
            <Badge
              variant={event.status === 'published' ? 'success' : 'warning'}
              size="sm"
            >
              {event.status}
            </Badge>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {event.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-[-.04em] text-brand-charcoal">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-slate mt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-purple" /> {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-purple" /> {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-purple" /> {event.venue}
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          {event.status === 'draft' ? (
            <Button variant="primary" size="md" onClick={handlePublish}>
              Publish Live Invitation
            </Button>
          ) : (
            <Link href={`/e/${event.slug}`} target="_blank">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ExternalLink className="w-4 h-4" />}
                className="shadow-md shadow-brand-purple/20"
              >
                View Live Link
              </Button>
            </Link>
          )}

          <Button
            variant="secondary"
            size="md"
            onClick={handleCopyLink}
            leftIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          >
            {copiedLink ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap border-b border-[rgba(39,38,32,.2)]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-0 py-4 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'border-brand-purple text-brand-purple'
              : 'border-transparent text-brand-slate hover:text-brand-charcoal'
          }`}
        >
          Overview & Stats
        </button>
        <button
          onClick={() => setActiveTab('guests')}
          className={`px-0 py-4 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'guests'
              ? 'border-brand-purple text-brand-purple'
              : 'border-transparent text-brand-slate hover:text-brand-charcoal'
          }`}
        >
          Guest Households ({summary.totalHouseholds})
        </button>
        <button
          onClick={() => setActiveTab('rsvps')}
          className={`px-0 py-4 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'rsvps'
              ? 'border-brand-purple text-brand-purple'
              : 'border-transparent text-brand-slate hover:text-brand-charcoal'
          }`}
        >
          RSVP Responses ({summary.attendingAttendeeCount} Attending)
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`px-0 py-4 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'design'
              ? 'border-brand-purple text-brand-purple'
              : 'border-transparent text-brand-slate hover:text-brand-charcoal'
          }`}
        >
          Design & 3D Envelope Studio
        </button>
        <button
          onClick={() => setActiveTab('share')}
          className={`px-0 py-4 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'share'
              ? 'border-brand-purple text-brand-purple'
              : 'border-transparent text-brand-slate hover:text-brand-charcoal'
          }`}
        >
          WhatsApp & Share Hub
        </button>
        <button
          onClick={() => setActiveTab('contributions')}
          className={`px-0 py-4 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'contributions'
              ? 'border-brand-purple text-brand-purple'
              : 'border-transparent text-brand-slate hover:text-brand-charcoal'
          }`}
        >
          Direct M-Pesa Setup
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-y border-[rgba(39,38,32,.2)]">
            <Card className="!bg-transparent !border-0 !shadow-none p-5 text-left border-r border-[rgba(39,38,32,.15)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate block">
                Households Invited
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal mt-1 block">
                {summary.totalHouseholds}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Up to {summary.totalHeadcountExpected} people
              </span>
            </Card>

            <Card className="!bg-transparent !border-0 !shadow-none p-5 text-left border-r border-[rgba(39,38,32,.15)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Confirmed Attending
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 mt-1 block">
                {summary.attendingAttendeeCount}
              </span>
              <span className="text-[11px] text-emerald-600 mt-1 block">
                {summary.attendingHouseholds} households
              </span>
            </Card>

            <Card className="!bg-transparent !border-0 !shadow-none p-5 text-left border-r border-[rgba(39,38,32,.15)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Awaiting Response
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 mt-1 block">
                {summary.pendingHouseholds}
              </span>
              <span className="text-[11px] text-amber-600 mt-1 block">
                Pending invitations
              </span>
            </Card>

            <Card className="!bg-transparent !border-0 !shadow-none p-5 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Dietary Requests
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal mt-1 block">
                {summary.dietaryCount}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Special meal needs
              </span>
            </Card>
          </div>

          {/* Canonical Share Link Card */}
          <Card className="!bg-transparent !border-0 !shadow-none border-t border-b border-[rgba(39,38,32,.2)] p-6">
            <h3 className="font-serif font-medium text-xl text-brand-charcoal mb-2">
              Shareable Invitation Link
            </h3>
            <p className="text-xs text-brand-slate mb-4">
              Send this canonical link to guests. Guests can open the 3D envelope and submit an RSVP immediately.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                readOnly
                value={canonicalUrl}
                className="w-full rounded-none border-0 border-b border-[rgba(39,38,32,.25)] bg-transparent px-1 py-3 font-mono text-xs text-brand-charcoal select-all focus:outline-none focus:border-brand-purple"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  size="md"
                  variant="primary"
                  onClick={handleCopyLink}
                  leftIcon={copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copiedLink ? 'Copied' : 'Copy'}
                </Button>
                <Link href={`/e/${event.slug}`} target="_blank">
                  <Button size="md" variant="secondary" leftIcon={<Eye className="w-4 h-4" />}>
                    Open
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: GUESTS & HOUSEHOLDS */}
      {activeTab === 'guests' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-brand-charcoal">
                Guest Households & Invitations
              </h2>
              <p className="text-xs text-brand-slate mt-0.5">
                Each household has a unique secure invitation link and plus-one allowance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsCsvModalOpen(true)}
                leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
              >
                Import CSV
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddGuestOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Household
              </Button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by name, phone, or email..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
              />
            </div>
            <select
              value={guestGroupFilter}
              onChange={(e) => setGuestGroupFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-brand-charcoal"
            >
              <option value="all">All Groups</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="VIP">VIP</option>
              <option value="Guests">General Guests</option>
            </select>
          </div>

          {/* Guests Table */}
          <div className="bg-transparent border-y border-[rgba(39,38,32,.18)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-brand-slate uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Household / Guest Name</th>
                    <th className="p-4">Group</th>
                    <th className="p-4">Max Attendees</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Personal Token Link</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-brand-slate">
                        No guests found. Click &ldquo;Add Household&rdquo; or &ldquo;Import CSV&rdquo; above.
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((g) => {
                      const personalUrl = `${canonicalUrl}?tok=${g.token}`;
                      return (
                        <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <span className="font-semibold text-brand-charcoal block">
                              {g.displayName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {g.contactPhone || g.contactEmail || 'No contact specified'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600 text-[10px]">
                              {g.group}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-brand-charcoal">
                            {1 + g.allowedPlusOnes} {g.allowedPlusOnes === 0 ? 'person' : 'people'}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                g.status === 'attending'
                                  ? 'success'
                                  : g.status === 'no'
                                  ? 'error'
                                  : 'warning'
                              }
                              size="sm"
                            >
                              {g.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                                ?tok={g.token.substring(0, 10)}...
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(personalUrl);
                                  alert('Personal link copied to clipboard!');
                                }}
                                className="p-1 hover:text-brand-purple text-slate-400"
                                title="Copy personal link"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteGuest(g.id, g.displayName)}
                              className="p-1.5 text-slate-400 hover:text-status-error rounded-lg hover:bg-red-50"
                              title="Delete guest"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* TAB 3: RSVPS & RESPONSES */}
      {activeTab === 'rsvps' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-brand-charcoal">
                RSVP Headcount & Preferences
              </h2>
              <p className="text-xs text-brand-slate mt-0.5">
                Real-time responses submitted by guests through the live invitation link.
              </p>
            </div>

            <a
              href={`/api/events/${eventId}/rsvps/export`}
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV for Caterer</span>
            </a>
          </div>

          {/* Submissions List */}
          <div className="bg-transparent border-y border-[rgba(39,38,32,.18)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-brand-slate uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Guest Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Response</th>
                    <th className="p-4">Headcount</th>
                    <th className="p-4">Dietary Notes</th>
                    <th className="p-4">Song Request</th>
                    <th className="p-4">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rsvps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-brand-slate">
                        No RSVPs received yet. Share your invitation link to start collecting responses!
                      </td>
                    </tr>
                  ) : (
                    rsvps.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-brand-charcoal">
                          {r.primaryName}
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">
                          {r.contact}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={r.status === 'yes' ? 'success' : 'error'}
                            size="sm"
                          >
                            {r.status === 'yes' ? 'Attending' : 'Declined'}
                          </Badge>
                        </td>
                        <td className="p-4 font-bold text-brand-charcoal">
                          {r.attendeeCount}
                        </td>
                        <td className="p-4 text-brand-slate">
                          {r.dietaryRequirements ? (
                            <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg w-fit text-[11px]">
                              <Utensils className="w-3 h-3 flex-shrink-0" />
                              <span>{r.dietaryRequirements}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="p-4 text-brand-slate">
                          {r.songRequest ? (
                            <span className="flex items-center gap-1.5 text-brand-purple bg-brand-purple-light px-2 py-0.5 rounded-lg w-fit text-[11px]">
                              <Music className="w-3 h-3 flex-shrink-0" />
                              <span>{r.songRequest}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="p-4 text-slate-400 text-[11px]">
                          {new Date(r.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DESIGN & 3D STUDIO */}
      {activeTab === 'design' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-brand-charcoal">
                Design & 3D Envelope Studio
              </h2>
              <p className="text-xs text-brand-slate mt-0.5">
                Customize stationery finishes, enable/reorder sections, and preview your guest experience in real time.
              </p>
            </div>

            <Button
              size="md"
              variant="primary"
              onClick={handleSaveDesign}
              leftIcon={isDesignSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
            >
              {isDesignSaved ? 'Design Saved!' : 'Save Changes'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls: Stationery & Section Management */}
            <div className="lg:col-span-5 space-y-8 bg-transparent py-5 border-y border-[rgba(39,38,32,.18)]">
              {/* Stationery Finishes Header */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#934638] flex items-center gap-1.5 mb-4">
                  <Palette size={14} /> Envelope & Wax Seal Finishes
                </h3>

                {/* Liner Pattern */}
                <div className="mb-5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-brand-slate mb-2">
                    Liner Pattern
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'gold-foil', label: 'Gold Foil' },
                      { id: 'floral', label: 'Blush Floral' },
                      { id: 'botanical', label: 'Botanical' },
                      { id: 'geometric', label: 'Geometric' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setEditorLiner(l.id as any)}
                        className={`p-2.5 rounded-sm border text-xs font-semibold transition-all text-center ${
                          editorLiner === l.id
                            ? 'border-[#934638] bg-[#934638]/10 text-[#934638] font-bold'
                            : 'border-[rgba(39,38,32,.15)] hover:bg-[#FBF8F1] text-brand-charcoal'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seal Monogram */}
                <div className="mb-5">
                  <Input
                    label="Wax Seal Monogram / Initial"
                    value={editorSealMonogram}
                    onChange={(e) => setEditorSealMonogram(e.target.value.toUpperCase())}
                    placeholder="e.g. K&W"
                    maxLength={5}
                  />
                </div>

                {/* Seal Color */}
                <div className="mb-5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-brand-slate mb-2">
                    Wax Seal Color
                  </label>
                  <div className="flex items-center gap-3">
                    {[
                      { color: '#D4AF37', label: 'Champagne Gold' },
                      { color: '#A94F51', label: 'Clay Rose' },
                      { color: '#934638', label: 'Terracotta' },
                      { color: '#747D62', label: 'Sage Olive' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setEditorSealColor(c.color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          editorSealColor === c.color ? 'scale-110 border-brand-charcoal ring-2 ring-[#934638]' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Envelope Body Color */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-brand-slate mb-2">
                    Envelope Paper Tone
                  </label>
                  <div className="flex items-center gap-3">
                    {[
                      { color: '#252042', label: 'Deep Royal' },
                      { color: '#272620', label: 'Ink' },
                      { color: '#3A2E33', label: 'Burgundy Plum' },
                      { color: '#2D352D', label: 'Forest Sage' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setEditorEnvelopeColor(c.color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          editorEnvelopeColor === c.color ? 'scale-110 border-brand-charcoal ring-2 ring-[#934638]' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Invitation Sections & Order Management */}
              <div className="pt-6 border-t border-[rgba(39,38,32,.18)]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#934638] flex items-center gap-1.5">
                    <Layers size={14} /> Sections & Flow ({editorSections.length} active)
                  </h3>
                  <span className="text-[10px] text-brand-slate font-serif italic">
                    Reorder or toggle sections
                  </span>
                </div>

                {/* Active Section List (Reorderable) */}
                <div className="space-y-2 mb-4">
                  {editorSections.map((secKey, idx) => {
                    const secInfo = {
                      story: { label: 'Our Story Timeline', desc: 'Milestone moments' },
                      ceremony: { label: 'Ceremony & Reception', desc: 'Locations & attire' },
                      venue: { label: 'Venue Location', desc: 'Address & directions' },
                      schedule: { label: 'Programme Schedule', desc: 'Order of events' },
                      about: { label: 'About the Celebrant', desc: 'Biography & fun facts' },
                      activities: { label: 'Celebration Flow & Menu', desc: 'Party highlights & bites' },
                      obituary: { label: 'Obituary & Biography', desc: 'Dates, bio & scripture' },
                      services: { label: 'Memorial Services', desc: 'Service & order of service' },
                      livestream: { label: 'Live Stream Broadcast', desc: 'Diaspora broadcast' },
                      candles: { label: 'Virtual Candles & Tributes', desc: 'Candle lighting & notes' },
                      condolences: { label: 'Condolences Wall', desc: 'Family condolence book' },
                      gallery: { label: 'Photo Gallery Mosaic', desc: 'Visual mosaic & lightbox' },
                      faq: { label: 'Questions & Answers', desc: 'Attire & event FAQs' },
                      registry: { label: 'M-Pesa Gift Registry', desc: 'Cash fund details' },
                      rsvp: { label: 'RSVP Response Form', desc: 'Headcount & diet' },
                      closing: { label: 'Sign-off & Calendar', desc: 'Closing blessings' },
                    }[secKey] || { label: secKey, desc: 'Invitation section' };

                    return (
                      <div
                        key={secKey}
                        className="flex items-center justify-between p-3 rounded-sm border border-[rgba(39,38,32,.14)] bg-[#FBF8F1]/80 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#934638]/15 text-[#934638] flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs font-semibold text-brand-charcoal">{secInfo.label}</h4>
                            <p className="text-[10px] text-brand-slate">{secInfo.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === 0) return;
                              const reordered = [...editorSections];
                              const temp = reordered[idx];
                              reordered[idx] = reordered[idx - 1];
                              reordered[idx - 1] = temp;
                              setEditorSections(reordered);
                            }}
                            disabled={idx === 0}
                            aria-label={`Move ${secInfo.label} up`}
                            className="p-1 text-brand-slate hover:text-brand-charcoal disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === editorSections.length - 1) return;
                              const reordered = [...editorSections];
                              const temp = reordered[idx];
                              reordered[idx] = reordered[idx + 1];
                              reordered[idx + 1] = temp;
                              setEditorSections(reordered);
                            }}
                            disabled={idx === editorSections.length - 1}
                            aria-label={`Move ${secInfo.label} down`}
                            className="p-1 text-brand-slate hover:text-brand-charcoal disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditorSections(editorSections.filter((k) => k !== secKey))}
                            aria-label={`Hide ${secInfo.label}`}
                            className="p-1 text-rose-700 hover:text-rose-900 ml-1"
                            title="Hide section"
                          >
                            <EyeOff size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Inactive Sections Picker */}
                {(() => {
                  const allCandidateKeys = [
                    'story',
                    'ceremony',
                    'venue',
                    'schedule',
                    'about',
                    'activities',
                    'obituary',
                    'services',
                    'livestream',
                    'candles',
                    'gallery',
                    'faq',
                    'registry',
                    'rsvp',
                    'closing',
                  ];
                  const inactiveKeys = allCandidateKeys.filter((k) => !editorSections.includes(k));
                  if (inactiveKeys.length === 0) return null;

                  return (
                    <div className="pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-slate mb-2">
                        Add Other Optional Sections:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {inactiveKeys.map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => setEditorSections([...editorSections, k])}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm border border-dashed border-[rgba(39,38,32,.25)] text-[11px] text-brand-charcoal hover:bg-[#FBF8F1] transition-colors"
                          >
                            <Plus size={11} className="text-[#934638]" />
                            <span className="capitalize">{k.replace('-', ' ')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right Live Real-Time Preview Stage */}
            <div className="lg:col-span-7 border border-[rgba(39,38,32,.18)] overflow-hidden bg-[#DDD0BE]/30 rounded-sm">
              <div className="bg-[#272620] text-white p-3 text-xs flex items-center justify-between border-b border-[rgba(39,38,32,.2)]">
                <span className="font-serif italic text-amber-200">
                  Live Guest Preview · Scroll to explore all active sections
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/60">
                  {editorSections.length} sections active
                </span>
              </div>

              <div className="max-h-[800px] overflow-y-auto">
                <EnvelopeRenderer
                  template={{
                    ...template,
                    palette: {
                      ...template.palette,
                      envelope: editorEnvelopeColor,
                      flap: editorEnvelopeColor,
                    },
                    liner: {
                      id: editorLiner as any,
                      name: editorLiner,
                      className: `bg-liner-${editorLiner}`,
                    },
                    seal: {
                      ...template.seal,
                      monogram: editorSealMonogram,
                      color: editorSealColor,
                    },
                    sampleData: {
                      ...template.sampleData,
                      title: event.title,
                      hosts: event.hosts,
                      celebrants: event.celebrants,
                      venue: event.venue,
                      date: event.date,
                      time: event.time,
                      heroImage: event.heroImage,
                      galleryImages: event.galleryImages || [],
                      milestoneAge: event.milestoneAge,
                      story: event.story,
                    },
                  }}
                  guestName="Guest Preview"
                  isDemo={true}
                >
                  {/* Dynamic sections rendered in preview according to host customization */}
                  {editorSections.map((key) => {
                    switch (key) {
                      case 'story':
                        if (!event.ourStoryMilestones || event.ourStoryMilestones.length === 0) return null;
                        return <StorySection key="preview-story" milestones={event.ourStoryMilestones} />;
                      case 'ceremony':
                        if (event.ceremonyDetails || event.receptionDetails) {
                          return (
                            <CeremonyReceptionSection
                              key="preview-ceremony"
                              ceremony={event.ceremonyDetails}
                              reception={event.receptionDetails}
                              eventTitle={event.title}
                              eventDate={event.date}
                            />
                          );
                        }
                        return (
                          <VenueSection
                            key="preview-venue"
                            venue={event.venue}
                            address={event.address}
                            city={event.city}
                            directionsNote={event.directionsNote}
                            googleMapsUrl={event.googleMapsUrl}
                            calendarData={{
                              title: event.title,
                              description: `Invitation to ${event.title}`,
                              location: `${event.venue}, ${event.city}`,
                              startDate: event.date,
                              endDate: event.date,
                            }}
                          />
                        );
                      case 'venue':
                        return (
                          <VenueSection
                            key="preview-venue"
                            venue={event.venue}
                            address={event.address}
                            city={event.city}
                            directionsNote={event.directionsNote}
                            googleMapsUrl={event.googleMapsUrl}
                            calendarData={{
                              title: event.title,
                              description: `Invitation to ${event.title}`,
                              location: `${event.venue}, ${event.city}`,
                              startDate: event.date,
                              endDate: event.date,
                            }}
                          />
                        );
                      case 'schedule':
                        return <ScheduleSection key="preview-schedule" items={event.programmeSchedule} />;
                      case 'about':
                        return (
                          <BirthdayAboutSection
                            key="preview-about"
                            celebrantName={event.celebrants}
                            milestoneAge={event.milestoneAge}
                            bio={event.birthdayAbout?.bio || event.story}
                            facts={event.birthdayAbout?.facts}
                            heading={event.birthdayAbout?.heading}
                            heroImage={event.heroImage}
                          />
                        );
                      case 'activities':
                        return (
                          <BirthdayActivitiesSection
                            key="preview-activities"
                            activities={event.birthdayActivities}
                            menu={event.birthdayMenu}
                          />
                        );
                      case 'obituary':
                        return (
                          <MemorialObituarySection
                            key="preview-obituary"
                            honoreeName={event.celebrants}
                            biography={event.memorialObituary?.biography || event.story || ''}
                            birthDate={event.memorialObituary?.birthDate}
                            deathDate={event.memorialObituary?.deathDate}
                            epitaph={event.memorialObituary?.epitaph}
                          />
                        );
                      case 'services':
                        return (
                          <MemorialServiceSection
                            key="preview-services"
                            services={event.memorialServices}
                            orderOfService={event.memorialOrderOfService}
                          />
                        );
                      case 'livestream':
                        return (
                          <MemorialLivestreamSection
                            key="preview-livestream"
                            livestreamUrl={event.livestreamUrl}
                            livestreamStatus={event.livestreamStatus}
                            honoreeName={event.celebrants}
                          />
                        );
                      case 'candles':
                        return (
                          <MemorialTributesCandlesSection
                            key="preview-candles"
                            honoreeName={event.celebrants}
                            initialCandlesCount={event.virtualCandlesCount}
                          />
                        );
                      case 'condolences':
                        return <CondolencesSection key="preview-condolences" honoreeName={event.celebrants} />;
                      case 'gallery':
                        if (!event.galleryImages || event.galleryImages.length === 0) return null;
                        return <GallerySection key="preview-gallery" images={event.galleryImages} celebrants={event.celebrants} />;
                      case 'faq':
                        return <FAQSection key="preview-faq" items={event.faqItems} />;
                      case 'registry':
                        if (!event.mpesaNumber) return null;
                        return (
                          <RegistrySection
                            key="preview-registry"
                            mpesaType={event.mpesaType}
                            mpesaNumber={event.mpesaNumber}
                            recipientName={event.mpesaRecipient}
                            accountReference={event.mpesaReference}
                          />
                        );
                      case 'rsvp':
                        return (
                          <RSVPSection
                            key="preview-rsvp"
                            eventId={event.id}
                            deadline={event.rsvpDeadline}
                            defaultGuestName="Guest Preview"
                            allowedPlusOnes={1}
                          />
                        );
                      case 'closing':
                        return (
                          <ClosingSection
                            key="preview-closing"
                            celebrants={event.celebrants}
                            calendarData={{
                              title: event.title,
                              description: `Invitation to ${event.title}`,
                              location: `${event.venue}, ${event.city}`,
                              startDate: event.date,
                              endDate: event.date,
                            }}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </EnvelopeRenderer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SHARE & WHATSAPP HUB */}
      {activeTab === 'share' && (
        <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 border-l-2 border-emerald-800 text-emerald-800">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-brand-charcoal">
                  WhatsApp & Native Share Hub
                </h2>
                <p className="text-xs text-brand-slate mt-0.5">
                  Share directly using your phone&apos;s WhatsApp without intermediary sending costs.
                </p>
              </div>
            </div>

            {/* Pre-filled Message Template */}
            <div className="my-6 p-4 border-y border-[rgba(39,38,32,.18)] bg-transparent text-xs text-brand-charcoal space-y-2 leading-relaxed">
              <p className="font-semibold text-brand-purple">Pre-filled WhatsApp Message:</p>
              <p className="italic font-serif">
                &ldquo;You are warmly invited to {event.title}! Please open your digital envelope invitation and let us know if you can join us: {canonicalUrl}&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `You are warmly invited to ${event.title}! Please open your digital envelope invitation: ${canonicalUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </a>

              <Button
                variant="secondary"
                size="md"
                onClick={handleCopyLink}
                leftIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              >
                {copiedLink ? 'Copied Invitation Link!' : 'Copy Invitation Link'}
              </Button>
            </div>

            {/* Decision Gate Note */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-3 text-xs text-brand-slate">
              <Info className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
              <p>
                <strong>Architecture Decision Gate:</strong> Automated background WhatsApp Cloud API dispatch is disabled until Meta Business Manager verification and explicit consent logging workflows are confirmed. Native WhatsApp sharing is instant, reliable, and completely free.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 6: DIRECT M-PESA SETUP */}
      {activeTab === 'contributions' && (
        <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl">
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-serif font-bold text-brand-charcoal mb-2">
              Direct M-Pesa Gift Instructions (Kenya)
            </h2>
            <p className="text-xs text-brand-slate mb-6">
              Guests can send contributions directly to your verified Paybill, Till number, or Send Money line.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1">
                  M-Pesa Account Type
                </label>
                <select
                  value={event.mpesaType || 'till'}
                  onChange={(e) => {
                    EventService.updateEvent(eventId, { mpesaType: e.target.value as any });
                    refreshData();
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-brand-charcoal"
                >
                  <option value="till">Buy Goods (Till Number)</option>
                  <option value="paybill">Paybill Number</option>
                  <option value="send_money">Send Money (Phone Number)</option>
                </select>
              </div>

              <Input
                label="M-Pesa Number *"
                placeholder="e.g. 8249102"
                value={event.mpesaNumber || ''}
                onChange={(e) => {
                  EventService.updateEvent(eventId, { mpesaNumber: e.target.value });
                  refreshData();
                }}
              />

              <Input
                label="Recipient / Account Name *"
                placeholder="e.g. Kevin Kamau"
                value={event.mpesaRecipient || ''}
                onChange={(e) => {
                  EventService.updateEvent(eventId, { mpesaRecipient: e.target.value });
                  refreshData();
                }}
              />

              <Input
                label="Account Reference (For Paybills)"
                placeholder="e.g. Kevin & Wanjiku Wedding"
                value={event.mpesaReference || ''}
                onChange={(e) => {
                  EventService.updateEvent(eventId, { mpesaReference: e.target.value });
                  refreshData();
                }}
              />
            </div>
          </Card>
        </div>
      )}

      {/* MODAL: ADD GUEST */}
      <Modal
        isOpen={isAddGuestOpen}
        onClose={() => setIsAddGuestOpen(false)}
        title="Add Guest Household"
        description="Add a family or individual to this event."
      >
        <form onSubmit={handleAddGuest} className="space-y-4 pt-2">
          <Input
            label="Household or Guest Name *"
            placeholder="e.g. Dr. Peter Otieno & Family"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number (WhatsApp)"
              placeholder="e.g. +254 712 345 678"
              value={newGuestPhone}
              onChange={(e) => setNewGuestPhone(e.target.value)}
            />

            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="e.g. peter@example.com"
              value={newGuestEmail}
              onChange={(e) => setNewGuestEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1">
                Group / Category
              </label>
              <select
                value={newGuestGroup}
                onChange={(e) => setNewGuestGroup(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-brand-charcoal"
              >
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
                <option value="VIP">VIP</option>
                <option value="Bridal Party">Bridal Party</option>
                <option value="Guests">General Guests</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1">
                Allowed Plus-Ones
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={newGuestPlusOnes}
                onChange={(e) => setNewGuestPlusOnes(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-brand-charcoal"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddGuestOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Household
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CSV IMPORT */}
      <Modal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        title="Import Guests via CSV / Spreadsheet"
        description="Paste your comma-separated guest records below. First row must be headers."
        maxWidth="lg"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1">
              CSV Data (Name, Phone, Group, PlusOnes)
            </label>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 font-mono text-xs p-3 text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
            <strong>Note:</strong> Importing contacts will NOT send any messages automatically. You control exactly when and how to share links.
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsCsvModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="md" onClick={handleImportCsv}>
              Parse & Import Guests
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
